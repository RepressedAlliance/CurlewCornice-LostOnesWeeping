"""Render the exported three.js shot in Blender (Eevee + Freestyle) with the same toon rules,
for a like-for-like comparison.  usage:
blender -b -P blender_cmp.py -- <scene.glb> <scene.json> <out.png> <project root>
"""
import bpy, json, math, sys, os
from mathutils import Quaternion, Vector

glb, meta_p, out, root = sys.argv[sys.argv.index('--') + 1:]
meta = json.load(open(meta_p))
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=glb)

amb = Vector(meta['sun']['amb']); sunc = Vector(meta['sun']['color'])
fog_col = (0.855, 0.815, 0.722)          # #eee9dc in linear
near, far = meta['fog'] or (1000, 2000)


def toon_material(name, base_color=None, base_link=None, alpha_link=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links; N.clear()
    out_n = N.new('ShaderNodeOutputMaterial')
    diff = N.new('ShaderNodeBsdfDiffuse'); diff.inputs['Color'].default_value = (1, 1, 1, 1)
    s2r = N.new('ShaderNodeShaderToRGB'); L.new(diff.outputs[0], s2r.inputs[0])
    ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.interpolation = 'CONSTANT'
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1); ramp.color_ramp.elements[1].position = 0.01
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    L.new(s2r.outputs['Color'], ramp.inputs['Fac'])
    # light = amb + sun * lit
    sunmul = N.new('ShaderNodeMix'); sunmul.data_type = 'RGBA'; sunmul.blend_type = 'MULTIPLY'; sunmul.inputs[0].default_value = 1
    L.new(ramp.outputs['Color'], sunmul.inputs[6]); sunmul.inputs[7].default_value = (*sunc, 1)
    add = N.new('ShaderNodeMix'); add.data_type = 'RGBA'; add.blend_type = 'ADD'; add.inputs[0].default_value = 1
    add.inputs[6].default_value = (*amb, 1); L.new(sunmul.outputs[2], add.inputs[7])
    col = N.new('ShaderNodeMix'); col.data_type = 'RGBA'; col.blend_type = 'MULTIPLY'; col.inputs[0].default_value = 1
    L.new(add.outputs[2], col.inputs[6])
    if base_link is not None:
        L.new(base_link, col.inputs[7])
    else:
        col.inputs[7].default_value = base_color or (0.8, 0.8, 0.8, 1)
    # distance fog, same near/far as the three.js shot
    cam = N.new('ShaderNodeCameraData')
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = near; mr.inputs['From Max'].default_value = far
    L.new(cam.outputs['View Distance'], mr.inputs['Value'])
    fog = N.new('ShaderNodeMix'); fog.data_type = 'RGBA'; L.new(mr.outputs['Result'], fog.inputs[0])
    L.new(col.outputs[2], fog.inputs[6]); fog.inputs[7].default_value = (*fog_col, 1)
    em = N.new('ShaderNodeEmission'); L.new(fog.outputs[2], em.inputs['Color'])
    if alpha_link is not None:
        tr = N.new('ShaderNodeBsdfTransparent'); mix = N.new('ShaderNodeMixShader')
        gt = N.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5
        L.new(alpha_link, gt.inputs[0]); L.new(gt.outputs[0], mix.inputs[0])
        L.new(tr.outputs[0], mix.inputs[1]); L.new(em.outputs[0], mix.inputs[2])
        L.new(mix.outputs[0], out_n.inputs['Surface'])
    else:
        L.new(em.outputs[0], out_n.inputs['Surface'])
    return m, N, L

# replace every imported material by the toon rule, keeping base colour / texture
for mat in list(bpy.data.materials):
    if not mat.use_nodes:
        continue
    bsdf = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if bsdf is None:
        continue
    bc = bsdf.inputs['Base Color']
    if bc.is_linked:
        img_node = bc.links[0].from_node
        m, N, L = toon_material(mat.name + '_toon')
        tex = N.new('ShaderNodeTexImage'); tex.image = getattr(img_node, 'image', None)
        uv = N.new('ShaderNodeUVMap'); L.new(uv.outputs[0], tex.inputs[0])
        mulnode = [n for n in N if n.type == 'MIX' and n.blend_type == 'MULTIPLY'][1]
        L.new(tex.outputs['Color'], mulnode.inputs[7])
    else:
        m, N, L = toon_material(mat.name + '_toon', tuple(bc.default_value))
    for ob in bpy.data.objects:
        for slot in ob.material_slots:
            if slot.material == mat:
                slot.material = m

# camera
cd = meta['camera']
cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam)
# three: x right, y up, z toward viewer; blender: x right, y forward(-z three), z up
cam.location = Vector((cd['pos'][0], -cd['pos'][2], cd['pos'][1]))
qx, qy, qz, qw = cd['quat']
q3 = Quaternion((qw, qx, qy, qz))
conv = Quaternion((math.cos(math.pi / 4), math.sin(math.pi / 4), 0, 0))   # +90 deg about X
cam.rotation_mode = 'QUATERNION'; cam.rotation_quaternion = conv @ q3
cam.data.sensor_fit = 'VERTICAL'; cam.data.angle_y = math.radians(cd['fov'])
cam.data.clip_start = 0.1; cam.data.clip_end = 160
sc.camera = cam

# sun (strength high so any lit surface clears the ramp threshold)
s = meta['sun']
sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN')); sc.collection.objects.link(sun)
p = Vector((s['pos'][0], -s['pos'][2], s['pos'][1])); t = Vector((s['target'][0], -s['target'][2], s['target'][1]))
sun.rotation_euler = (t - p).to_track_quat('-Z', 'Y').to_euler()
sun.data.energy = 5; sun.data.angle = 0.0

# character cards + sun-facing shadow proxies
d_sun = (p - t); d_sun.z = 0; d_sun.normalize()
for i, c in enumerate(meta['cards']):
    rel = c['src'].split('/art/')[1]
    img = bpy.data.images.load(os.path.join(root, 'art', rel))
    w = c['h'] * img.size[0] / img.size[1]
    for proxy in (False, True):
        bpy.ops.mesh.primitive_plane_add(size=1)
        ob = bpy.context.active_object
        ob.scale = (w, c['h'], 1)
        bpy.ops.object.transform_apply(scale=True)
        for v in ob.data.vertices:
            v.co.y += c['h'] / 2
        ob.rotation_euler = (math.radians(90), 0, 0)
        ob.location = Vector((c['pos'][0], -c['pos'][2], c['pos'][1]))
        m, N, L = toon_material(f'card{i}{proxy}')
        tex = N.new('ShaderNodeTexImage'); tex.image = img
        mulnode = [n for n in N if n.type == 'MIX' and n.blend_type == 'MULTIPLY'][1]
        L.new(tex.outputs['Color'], mulnode.inputs[7])
        mix = [n for n in N if n.type == 'MIX_SHADER']
        # alpha clip
        tr = N.new('ShaderNodeBsdfTransparent'); ms = N.new('ShaderNodeMixShader')
        gt = N.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5
        L.new(tex.outputs['Alpha'], gt.inputs[0]); L.new(gt.outputs[0], ms.inputs[0])
        outn = next(n for n in N if n.type == 'OUTPUT_MATERIAL'); em = next(n for n in N if n.type == 'EMISSION')
        L.new(tr.outputs[0], ms.inputs[1]); L.new(em.outputs[0], ms.inputs[2]); L.new(ms.outputs[0], outn.inputs['Surface'])
        ob.data.materials.append(m)
        if proxy:
            ob.rotation_euler.z = math.atan2(-d_sun.x, d_sun.y) + math.pi
            ob.visible_camera = False
        else:
            ob.rotation_euler.z = -c['rotY'] + math.pi
            ob.visible_shadow = False
        ob['is_card'] = 1

# world, colour management, Eevee, Freestyle
w = bpy.data.worlds.new('W'); w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (*fog_col, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1
sc.world = w
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.eevee.taa_render_samples = 16
sc.eevee.shadow_resolution_scale = 1.0
sc.render.use_freestyle = True
sc.render.line_thickness_mode = 'ABSOLUTE'; sc.render.line_thickness = 1.4
vl = sc.view_layers[0]; fs = vl.freestyle_settings
ls = fs.linesets[0] if fs.linesets else fs.linesets.new('L')
ls.select_by_visibility = True; ls.select_by_edge_types = True
ls.select_silhouette = ls.select_border = ls.select_crease = True
if ls.linestyle is None:
    ls.linestyle = bpy.data.linestyles.new('LS')
ls.linestyle.color = (0.024, 0.024, 0.030); ls.linestyle.thickness = 1.4
# keep cards out of Freestyle (their lines are drawn)
coll = bpy.data.collections.new('cards'); sc.collection.children.link(coll)
for ob in list(bpy.data.objects):
    if ob.get('is_card'):
        for c_ in ob.users_collection: c_.objects.unlink(ob)
        coll.objects.link(ob)
ls.select_by_collection = True; ls.collection = coll; ls.collection_negation = 'EXCLUSIVE'
sc.render.filepath = out
import time
t0 = time.time()
bpy.ops.render.render(write_still=True)
print('RENDER_SECONDS', round(time.time() - t0, 2))
