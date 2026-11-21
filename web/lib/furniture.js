// Japanese school desk and chair (JIS size 5: desk 700 mm, seat 420 mm), modelled from the real
// construction: bent and welded steel tube frames, plywood top with resin edge band, a steel
// drawer open toward the seat, height-adjust sleeves with bolts, plastic glides, a bag hook, and a
// moulded plywood seat and curved backrest. Desk origin: floor centre under the top; the teacher's
// side is -z, the student sits at +z. Every part returns as geometry grouped by material.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const ni = (g) => (g.index ? g.toNonIndexed() : g);
const merge = (list) => mergeGeometries(list.map(ni).map(g => { if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); return g; }));

// polyline with filleted corners -> CurvePath (bends of a real bent tube)
export function bentPath(pts, r) {
  const path = new THREE.CurvePath();
  let prev = pts[0].clone();
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const d1 = b.clone().sub(a).normalize(), d2 = c.clone().sub(b).normalize();
    const rr = Math.min(r, b.distanceTo(a) * 0.45, c.distanceTo(b) * 0.45);
    const p1 = b.clone().addScaledVector(d1, -rr), p2 = b.clone().addScaledVector(d2, rr);
    if (prev.distanceTo(p1) > 1e-5) path.add(new THREE.LineCurve3(prev, p1));
    path.add(new THREE.QuadraticBezierCurve3(p1, b.clone(), p2));
    prev = p2;
  }
  path.add(new THREE.LineCurve3(prev, pts[pts.length - 1].clone()));
  return path;
}
export function tube(pts, radius, { bend = 0.03, seg = 12, lod = 1 } = {}) {
  const path = pts.length > 2 ? bentPath(pts, bend) : new THREE.LineCurve3(pts[0], pts[1]);
  const len = path.getLength();
  const tubular = Math.max(2, Math.round((pts.length > 2 ? 10 * (pts.length - 2) : 1) + len * 6) * lod | 0);
  const g = new THREE.TubeGeometry(path, Math.max(2, tubular), radius, Math.max(5, Math.round(seg * lod)), false);
  // end caps
  const caps = [];
  for (const [p, t] of [[path.getPoint(0), path.getTangent(0).negate()], [path.getPoint(1), path.getTangent(1)]]) {
    const c = new THREE.CircleGeometry(radius, Math.max(5, Math.round(seg * lod)));
    c.lookAt(t); c.translate(p.x, p.y, p.z); caps.push(c);
  }
  return merge([g, ...caps]);
}
function roundedRectShape(w, d, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
// flat slab in the XZ plane, top face at y=top, with a small rounded edge
function slab(w, d, r, thick, top, bevel = 0.002, curveSeg = 6) {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w, d, r), { depth: thick - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: curveSeg });
  g.rotateX(-Math.PI / 2); g.translate(0, top - thick + bevel, 0);
  return g;
}
function glide(x, z, r) {
  const pts = [V(0, 0, 0), V(r * 1.15, 0, 0), V(r * 1.2, 0.006, 0), V(r * 1.12, 0.022, 0), V(r * 0.9, 0.024, 0)].map(p => new THREE.Vector2(p.x, p.y));
  const g = new THREE.LatheGeometry(pts, 14); g.translate(x, 0, z); return g;
}
function bolt(p, axis) {   // hex bolt head + washer on the outside of a sleeve
  const head = new THREE.CylinderGeometry(0.006, 0.006, 0.004, 6);
  const washer = new THREE.CylinderGeometry(0.009, 0.009, 0.0012, 16);
  washer.translate(0, -0.0026, 0);
  const g = merge([head, washer]);
  if (Math.abs(axis.x) > 0.5) g.rotateZ(-Math.sign(axis.x) * Math.PI / 2); else g.rotateX(Math.sign(axis.z) * Math.PI / 2);
  g.translate(p.x, p.y, p.z);
  return g;
}

export function buildDesk({ lod = 1 } = {}) {
  const H = 0.70, W = 0.65, D = 0.45, T = 0.024;
  const steel = [], wood = [], band = [], drawer = [], plastic = [];
  // top: plywood core + dark resin edge band all round
  wood.push(slab(W - 0.006, D - 0.006, 0.022, T - 0.002, H - 0.0005, 0.0015, Math.round(6 * lod)));
  const ring = new THREE.Shape(); ring.copy(roundedRectShape(W, D, 0.025));
  ring.holes.push(roundedRectShape(W - 0.006, D - 0.006, 0.022));
  const bandG = new THREE.ExtrudeGeometry(ring, { depth: T - 0.003, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0012, bevelSegments: 2, curveSegments: Math.round(8 * lod) });
  bandG.rotateX(-Math.PI / 2); bandG.translate(0, H - T + 0.0015, 0); band.push(bandG);
  // under-top frame: two side rails (20x20 square tube) and a rear rail under the opening
  const yR = H - T - 0.011;
  for (const x of [-0.27, 0.27]) steel.push(new RoundedBoxGeometry(0.02, 0.02, 0.40, 2, 0.003).translate(x, yR, 0));
  // legs: outer tube 25.4 mm from the glide to 0.43 m, inner 22 mm sleeve up to the rail, bolt on the sleeve
  const legX = 0.27, legZ = 0.185;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * legX, z = sz * legZ;
    steel.push(tube([V(x, 0.02, z), V(x, 0.43, z)], 0.0127, { lod }));
    steel.push(tube([V(x, 0.41, z), V(x, yR - 0.01, z)], 0.0108, { lod }));
    steel.push(new THREE.CylinderGeometry(0.0145, 0.0145, 0.012, Math.round(14 * lod)).translate(x, 0.43, z)); // sleeve collar
    steel.push(bolt(V(x + sx * 0.015, 0.415, z), V(sx, 0, 0)));
    plastic.push(glide(x, z, 0.0127));
  }
  // side frames: low bar between front and back legs, bent up into the legs (one bent tube each side)
  for (const sx of [-1, 1]) {
    const x = sx * legX;
    steel.push(tube([V(x, 0.11, -legZ), V(x, 0.11, legZ)], 0.0095, { lod }));
  }
  // front foot bar (teacher side), slightly higher, welded between the front legs
  steel.push(tube([V(-legX, 0.16, -legZ), V(legX, 0.16, -legZ)], 0.0095, { lod }));
  // drawer: steel box open toward the seat, rolled lip on the opening, pressed bottom
  const dy = yR - 0.012, dh = 0.105, dw = 0.52, dd = 0.37;
  drawer.push(new RoundedBoxGeometry(dw, 0.0016 * 2, dd, 1, 0.0012).translate(0, dy - dh, 0.01));                 // bottom
  for (const sx of [-1, 1]) drawer.push(new RoundedBoxGeometry(0.003, dh, dd, 1, 0.0012).translate(sx * dw / 2, dy - dh / 2, 0.01));
  drawer.push(new RoundedBoxGeometry(dw, dh, 0.003, 1, 0.0012).translate(0, dy - dh / 2, 0.01 - dd / 2));            // back (teacher side)
  // rolled lip: a thin tube around the opening (bottom + sides)
  const lz = 0.01 + dd / 2;
  drawer.push(tube([V(-dw / 2, dy - 0.004, lz), V(-dw / 2, dy - dh, lz), V(dw / 2, dy - dh, lz), V(dw / 2, dy - 0.004, lz)], 0.0035, { bend: 0.012, lod }));
  // bag hook on the right side rail
  steel.push(tube([V(0.28, yR - 0.006, 0.05), V(0.315, yR - 0.006, 0.05), V(0.33, yR - 0.04, 0.05), V(0.33, yR - 0.075, 0.05), V(0.318, yR - 0.09, 0.05), V(0.304, yR - 0.075, 0.05)], 0.0035, { bend: 0.012, lod }));
  steel.push(new THREE.SphereGeometry(0.0048, 10, 8).translate(0.304, yR - 0.075, 0.05));
  return { steel: merge(steel), wood: merge(wood), band: merge(band), drawer: merge(drawer), plastic: merge(plastic) };
}

// chair placed behind the desk (seat centre at z=0.65), facing -z
export function buildChair({ lod = 1, z0 = 0.62 } = {}) {
  const SH = 0.42, SW = 0.38, SD = 0.36;
  const steel = [], wood = [], plastic = [];
  const fx = 0.175, fz = z0 - 0.15, bz = z0 + 0.16;   // front and rear leg positions
  for (const sx of [-1, 1]) {
    const x = sx * fx;
    // front leg: up from the glide, bends 90 deg and runs back under the seat to the rear post
    steel.push(tube([V(x, 0.02, fz), V(x, SH - 0.03, fz), V(x, SH - 0.03, bz)], 0.0095, { bend: 0.035, lod }));
    // rear leg / back post: one tube from the glide, past the seat, raked back to the backrest top
    steel.push(tube([V(x, 0.02, bz + 0.02), V(x, SH - 0.02, bz), V(x, SH + 0.06, bz + 0.005), V(x, 0.772, bz + 0.05)], 0.0095, { bend: 0.06, lod }));
    // low side stretcher
    steel.push(tube([V(x, 0.14, fz), V(x, 0.14, bz + 0.012)], 0.0075, { lod }));
    plastic.push(glide(x, fz, 0.0095), glide(x, bz + 0.02, 0.0095));
  }
  // cross stretcher under the seat front
  steel.push(tube([V(-fx, SH - 0.03, fz + 0.02), V(fx, SH - 0.03, fz + 0.02)], 0.0075, { lod }));
  // seat: moulded plywood, rounded corners, front edge rolled down slightly
  const seat = slab(SW, SD, 0.04, 0.012, SH + 0.004, 0.003, Math.round(8 * lod));
  const sp = seat.attributes.position;
  for (let i = 0; i < sp.count; i++) {      // shallow dish + waterfall front edge
    const x = sp.getX(i), z = sp.getZ(i);
    let y = sp.getY(i) - 0.006 * (1 - (x / (SW / 2)) ** 2) * (1 - ((z) / (SD / 2)) ** 2);
    if (z < -SD / 2 + 0.03) y -= ((-SD / 2 + 0.03 - z) / 0.03) ** 2 * 0.008;
    sp.setY(i, y);
  }
  seat.computeVertexNormals(); seat.translate(0, 0, z0 - 0.005); wood.push(seat);
  // backrest: rounded panel bent to a 0.55 m radius around the sitter
  const bw = 0.39, bh = 0.16, R = 0.55;
  const back = new THREE.ExtrudeGeometry(roundedRectShape(bw, bh, 0.03), { depth: 0.008, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: Math.round(8 * lod) });
  const bp = back.attributes.position;
  for (let i = 0; i < bp.count; i++) { const x = bp.getX(i); bp.setZ(i, bp.getZ(i) + (R - Math.sqrt(R * R - x * x))); }
  back.computeVertexNormals();
  back.rotateX(-0.12); back.translate(0, 0.70, bz + 0.03); wood.push(back);
  // rivets fixing the backrest to the posts
  for (const sx of [-1, 1]) for (const y of [0.66, 0.74]) steel.push(new THREE.SphereGeometry(0.0045, 8, 6).translate(sx * fx, y, bz + 0.026 + (y - 0.62) * 0.12));
  return { steel: merge(steel), wood: merge(wood), plastic: merge(plastic) };
}

// desk-top props: hexagonal pencil (dark green lacquer, sharpened) and a plain eraser with a paper sleeve
export function buildPencil() {
  const L = 0.17, r = 0.0038;
  const body = new THREE.CylinderGeometry(r, r, L, 6); body.rotateZ(Math.PI / 2);
  const cone = new THREE.ConeGeometry(r * 0.98, 0.018, 6); cone.rotateZ(-Math.PI / 2); cone.translate(L / 2 + 0.009, 0, 0);
  const lead = new THREE.ConeGeometry(0.0011, 0.004, 8); lead.rotateZ(-Math.PI / 2); lead.translate(L / 2 + 0.0185, 0, 0);
  return { lacquer: ni(body), wood: ni(cone), lead: ni(lead) };
}
export function buildEraser() {
  const e = new RoundedBoxGeometry(0.043, 0.011, 0.02, 2, 0.002);
  const sleeve = new RoundedBoxGeometry(0.03, 0.0118, 0.0208, 1, 0.0008); sleeve.translate(0.005, 0, 0);
  return { rubber: ni(e), sleeve: ni(sleeve) };
}

// toon wood grain for plywood tops and seats: base colour plus long grain lines in one darker
// tone (no gradients), drawn once into a canvas and tiled
export function woodGrainTexture(base = '#d4b48a', line = 'rgba(150,108,62,0.38)', seed = 7) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 1024, 1024);
  let s = seed; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.strokeStyle = line; g.lineCap = 'round';
  for (let i = 0; i < 70; i++) {
    let y = R() * 1024; const amp = 2 + R() * 6, f = 0.004 + R() * 0.01, ph = R() * 6;
    g.lineWidth = 0.8 + R() * 1.6; g.beginPath();
    for (let x = -10; x <= 1034; x += 8) { const yy = y + Math.sin(x * f + ph) * amp + Math.sin(x * f * 3.7) * amp * 0.25; x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); }
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}
