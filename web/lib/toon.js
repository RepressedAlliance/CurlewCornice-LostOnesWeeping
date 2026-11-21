// Shared toon look for every 3D shot: two-tone hard shading, ink outlines from normal/depth
// edges, paper-coloured distance fog, and 2D character cards lit by the same light.
import * as THREE from 'three';
import { rinPalGLSL } from './rinpal.js';

export const PAL = {
  paper: 0xeee9dc, ink: 0x2b2b30, red: 0xd7263d, teal: 0x218ea3,
  floor: 0xb9b8a6, wall: 0xe6e0d0, wood: 0xcfa977, metal: 0x8e9196, board: 0x30483f,
};

// gradient with 2 steps -> hard two-tone shading
const grad = (() => {
  // faces turned away from the sun get no direct light, so they fall to the same ambient-only
  // tone as cast shadows: exactly two tones per colour
  const d = new Uint8Array([0, 0, 0, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 2, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();

export function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: grad, ...opts });
}

// Card for a cut-out 2D character / prop. It receives the scene's shadows (multiplying the
// art by the same shadow tone as the toon set) and casts an alpha-tested shadow.
// The lighting rig every shot shares. amb = colour of anything in shadow, sun = what the sun
// adds on lit surfaces. Toon materials and character cards both use exactly these two values.
export function makeLights(scene, { amb = [0.56, 0.60, 0.74], sun = [0.50, 0.42, 0.27] } = {}) {
  const a = new THREE.AmbientLight(new THREE.Color(...amb), Math.PI);
  const s = new THREE.DirectionalLight(new THREE.Color(...sun), Math.PI);
  s.castShadow = true;
  s.shadow.mapSize.set(4096, 4096);
  s.shadow.bias = -0.0006; s.shadow.normalBias = 0.035;
  scene.add(a, s, s.target);
  return { ambient: a, sun: s, amb: new THREE.Color(...amb), sunC: new THREE.Color(...sun) };
}

// Card for a cut-out 2D character / prop. In the colour pass it shows the drawing multiplied by
// the same ambient (+ sun where lit) as the toon set, so it falls into the same two tones.
// Shadows: a hidden proxy turned toward the sun casts the silhouette (a card facing the camera
// would cast only a sliver), and a small hard contact shadow sits under the feet.
export function characterCard(tex, heightM, rig, opts = {}) {
  const img = tex.image;
  const w = heightM * img.width / img.height;
  const geo = new THREE.PlaneGeometry(w, heightM);
  geo.translate(0, heightM / 2, 0);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    // depthBias: a drawing of something pressed onto a surface (a card on a reader) is drawn from a steeper
    // angle than the camera's, so part of it would sink into that surface; the card wins the depth test
    // against anything within this many metres behind its plane, without moving on screen
    sh.uniforms.uDepthBias = { value: opts.depthBias ?? 0 };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uDepthBias;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n          if (uDepthBias > 0.0) {   // depth as if this many metres nearer the camera; position on screen unchanged\n            vec4 pb = projectionMatrix * vec4(mvPosition.xy, mvPosition.z + uDepthBias, 1.0);\n            gl_Position.z = pb.z / pb.w * gl_Position.w;\n          }');
    sh.uniforms.uAmb = { value: rig.amb };
    sh.uniforms.uSun = { value: rig.sunC };
    sh.uniforms.uLitOverride = { value: opts.lit ?? -1 };
    sh.uniforms.uInk = { value: opts.ink ?? 1.0 };          // >1 darkens pencil lines of line-art cards
    sh.uniforms.uShadowMix = { value: opts.shadowMix ?? 1.0 }; // <1 makes cast shadows lighter on the card
    // rim light: a thin lit edge on the side of the silhouette that faces the light (UV step, colour)
    sh.uniforms.uRimDir = { value: new THREE.Vector2(...(opts.rimDir ?? [0, 0])) };
    sh.uniforms.uRimCol = { value: new THREE.Color(...(opts.rimCol ?? [0, 0, 0])) };
    // tint: multiplies the card, e.g. so a drawing's white becomes the paper it is drawn on
    sh.uniforms.uTint = { value: opts.tint ? new THREE.Color(opts.tint) : new THREE.Color(1, 1, 1) };
    // rinPal: Rin's colour rule (her whites to white, her teal to the official teal), see rinpal.js
    sh.uniforms.uRinPal = { value: opts.rinPal ?? 0 };
    sh.uniforms.uNeg = { value: opts.neg ? 1 : 0 };
    // keep: a mask of the name cards in the drawing (card_swap.py writes it); in the negative they stay paper white
    sh.uniforms.uKeep = { value: opts.keep ?? null }; sh.uniforms.uHasKeep = { value: opts.keep ? 1 : 0 };
    sh.uniforms.uNegL = { value: new THREE.Color(opts.neg ? opts.neg[0] : 0xffffff) };
    sh.uniforms.uNegD = { value: new THREE.Color(opts.neg ? opts.neg[1] : 0x000000) };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uAmb; uniform vec3 uSun; uniform float uLitOverride; uniform float uInk; uniform float uShadowMix; uniform vec2 uRimDir; uniform vec3 uRimCol; uniform vec3 uTint; uniform float uNeg; uniform vec3 uNegL, uNegD; uniform float uRinPal; uniform sampler2D uKeep; uniform float uHasKeep;\n' + rinPalGLSL)
      .replace('#include <opaque_fragment>', `
        float sh = 1.0;
        #if NUM_DIR_LIGHT_SHADOWS > 0
          DirectionalLightShadow dls = directionalLightShadows[0];
          sh = getShadow(directionalShadowMap[0], dls.shadowMapSize, dls.shadowIntensity, dls.shadowBias, dls.shadowRadius, vDirectionalShadowCoord[0]);
        #endif
        float lit = uLitOverride >= 0.0 ? uLitOverride : step(0.5, sh);
        vec3 art = 1.0 - clamp((1.0 - diffuseColor.rgb) * uInk, 0.0, 1.0);
        if (uRinPal > 0.0) art = rinPal(art, uRinPal);
        if (uNeg > 0.5) { float lu = dot(art, vec3(0.2126, 0.7152, 0.0722)); vec3 na = mix(uNegL, uNegD, smoothstep(0.44, 0.56, lu)); float kk = 0.0;
          #ifdef USE_MAP
          if (uHasKeep > 0.5) kk = texture2D(uKeep, vMapUv).r;
          #endif
          art = mix(na, art, kk); }
        vec3 light = mix(uAmb + uSun, uAmb + uSun * lit, uShadowMix);
        outgoingLight = art * light * uTint;
        #ifdef USE_MAP
        if (uRimDir.x != 0.0 || uRimDir.y != 0.0) {
          float edge = 0.0;
          for (int k = 1; k <= 3; k++) edge = max(edge, 1.0 - texture2D(map, vMapUv + uRimDir * float(k)).a);
          outgoingLight += uRimCol * smoothstep(0.35, 0.9, edge);
        }
        #endif
        #include <opaque_fragment>`);
  };
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = false; mesh.receiveShadow = true;
  mesh.userData.isCard = true; mesh.userData.depthBias = opts.depthBias ?? 0; mesh.userData.keep = opts.keep ?? null;
  const group = new THREE.Group(); group.add(mesh);
  // cast shadow: the silhouette projected flat onto the floor along the sun direction. It only
  // darkens floor that is still in sunlight, so it never doubles up with other shadows, and the
  // card never shadows itself (a sun-facing proxy plane did, leaving bands across the legs).
  const shMat = new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5, transparent: true, depthWrite: false,
    blending: THREE.MultiplyBlending, premultipliedAlpha: true, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  shMat.onBeforeCompile = (sh) => {
    sh.uniforms.uRatio = { value: new THREE.Color(rig.amb.r / (rig.amb.r + rig.sunC.r), rig.amb.g / (rig.amb.g + rig.sunC.g), rig.amb.b / (rig.amb.b + rig.sunC.b)) };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uRatio;')
      .replace('#include <opaque_fragment>', `
        float sh2 = 1.0;
        #if NUM_DIR_LIGHT_SHADOWS > 0
          DirectionalLightShadow dls2 = directionalLightShadows[0];
          sh2 = getShadow(directionalShadowMap[0], dls2.shadowMapSize, dls2.shadowIntensity, dls2.shadowBias, dls2.shadowRadius, vDirectionalShadowCoord[0]);
        #endif
        if (sh2 < 0.5) discard;
        outgoingLight = uRatio;
        #include <opaque_fragment>`);
  };
  const proxy = new THREE.Mesh(geo, shMat);
  proxy.receiveShadow = true; proxy.matrixAutoUpdate = false; proxy.renderOrder = 2;
  proxy.userData.isCard = true; proxy.userData.isProjShadow = true;
  // contact shadow under the feet
  const cw = opts.contactW ?? w * 0.75;
  const contact = new THREE.Mesh(new THREE.CircleGeometry(0.5, 40).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: rig.amb.clone().multiplyScalar(0.82), transparent: true, opacity: 0.55, depthWrite: false }));
  contact.scale.set(cw, 1, cw * 0.3); contact.position.set(0, 0.003, -cw * 0.3 * 0.42); contact.renderOrder = 1;
  contact.userData.isCard = true; contact.userData.isContact = true;
  group.add(contact);
  group.userData = { mesh, proxy, contact };
  if (opts.castShadow === false) proxy.visible = false;
  // place the projected shadow (call after the group is placed and added to the scene)
  group.faceSunProxy = (sun) => {
    const L = new THREE.Vector3().subVectors(sun.target.position, sun.position).normalize();
    const h = 0.0025, P = new THREE.Matrix4().set(
      1, -L.x / L.y, 0, L.x * h / L.y,
      0, 0, 0, h,
      0, -L.z / L.y, 1, L.z * h / L.y,
      0, 0, 0, 1);
    group.updateMatrixWorld(true);
    proxy.matrix.multiplyMatrices(P, mesh.matrixWorld);
    if (!proxy.parent) (group.parent || group).add(proxy);
  };
  return group;
}

// Print mode ("印刷答题卡风"): the world is printed in teal on paper. A toon material keeps its lighting,
// but its output becomes paper white plus teal ink: the material's own darkness turns into a flat tint
// (four screens: none, light, mid, solid) and the shadow step becomes a teal halftone dot screen in screen
// space. The teal layer is shifted a little against the paper, like a print slightly off register.
const printCache = new WeakMap();
export const PRINT = { paper: 0xf5f3ed, teal: 0x218ea3, line: 0x218ea3, shadowInk: 0x218ea3, pitch: 7, mis: [2.2, -1.4], shadeT: 0.9, cover: 0.30,   // pitch: 3.5 px at 1080p, the same ruling the people are printed with
  neg: 0, graph: null, sheen: 0x3b3b41, dark: 0 };   // dark: night print, dark paper and light ink (the lighter and more lit a surface, the more light ink)   // neg: paper is graphite; graph: a screen-space texture of pencil strokes (red = sheen)
function printMaterial(m) {
  if (printCache.has(m)) return printCache.get(m);
  const pm = m.clone();
  pm.onBeforeCompile = sh => {
    sh.uniforms.uPaper = { value: new THREE.Color(PRINT.paper) };
    sh.uniforms.uTeal = { value: new THREE.Color(PRINT.teal) };
    sh.uniforms.uShInk = { value: new THREE.Color(PRINT.shadowInk) };
    sh.uniforms.uPitch = { value: PRINT.pitch };
    sh.uniforms.uMis = { value: new THREE.Vector2(...PRINT.mis) };
    sh.uniforms.uShadeT = { value: PRINT.shadeT };
    sh.uniforms.uCover = { value: PRINT.cover };
    sh.uniforms.uFlat = { value: m.userData.flatPrint ? 1 : 0 };   // big walls and ceilings: lines only, no screen
    sh.uniforms.uNeg = { value: PRINT.neg ? 1 : 0 };
    sh.uniforms.uGraph = { value: PRINT.graph };
    sh.uniforms.uSheen = { value: new THREE.Color(PRINT.sheen) };
    sh.uniforms.uDark = { value: PRINT.dark ? 1 : 0 };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uPaper, uTeal, uShInk, uSheen; uniform float uPitch, uShadeT, uCover, uFlat, uNeg, uDark; uniform vec2 uMis; uniform sampler2D uGraph;')
      .replace('#include <opaque_fragment>', `
        const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);
        float base = max(dot(diffuseColor.rgb, LUM), 1e-3);
        float shade = dot(outgoingLight, LUM) / base;          // lighting alone, 1 = fully lit
        float tone = 1.0 - base;                               // how dark the material itself is
        float tint = tone < 0.1 ? 0.0 : tone < 0.32 ? 0.16 : tone < 0.58 ? 0.4 : 0.82;
        vec2 fc = (gl_FragCoord.xy + uMis) / uPitch;
        vec2 hp = vec2(0.9659 * fc.x - 0.2588 * fc.y, 0.2588 * fc.x + 0.9659 * fc.y);
        float dd = length(fract(hp) - 0.5);
        float rr = sqrt(uCover / 3.14159);
        float dotMask = (1.0 - smoothstep(rr - 0.07, rr + 0.07, dd)) * step(shade, uShadeT) * (1.0 - uFlat);
        // two plates: teal for the printed tints, the shadow screen in its own ink (teal or pencil graphite)
        vec3 paperC = uPaper;
        // graphite: the paper is covered in pencil, with the sheen of the strokes catching the light
        if (uNeg > 0.5) paperC = mix(uPaper, uSheen, texture2D(uGraph, gl_FragCoord.xy / 2048.0).r);
        if (uDark > 0.5) {
          // night: the paper is the dark; a surface takes light ink by how light it is and how much light it gets,
          // in flat steps; the parts in shadow get the dark screen on top
          float cov = (1.0 - tone) * mix(0.3, 1.0, clamp(shade, 0.0, 1.0));
          float tier = cov < 0.22 ? 0.0 : cov < 0.45 ? 0.16 : cov < 0.7 ? 0.32 : 0.5;
          outgoingLight = mix(mix(uPaper, uTeal, tier), uShInk, dotMask * 0.8);
        } else
        outgoingLight = mix(mix(paperC, uTeal, tint), uShInk, dotMask);
        #include <opaque_fragment>`);
  };
  pm.customProgramCacheKey = () => 'print-' + m.uuid;
  printCache.set(m, pm);
  return pm;
}

// In print mode a contact shadow is not a soft transparent blob but the shadow screen itself: the same dots
// (ruling, angle, register shift) as every other shadow, densest under the soles and thinning out to the rim.
const contactCache = new WeakMap();
function printContactMaterial(m) {
  if (contactCache.has(m)) return contactCache.get(m);
  const pm = new THREE.ShaderMaterial({
    uniforms: { uInk: { value: new THREE.Color(PRINT.shadowInk) }, uPitch: { value: PRINT.pitch }, uMis: { value: new THREE.Vector2(...PRINT.mis) },
      uMax: { value: Math.min(0.85, 0.25 + m.opacity * 1.2) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uInk; uniform float uPitch, uMax; uniform vec2 uMis; varying vec2 vUv;
      void main(){
        float r = length(vUv - 0.5) * 2.0;
        float cov = uMax * pow(clamp(1.0 - r, 0.0, 1.0), 0.8);
        vec2 fc = (gl_FragCoord.xy + uMis) / uPitch;
        vec2 hp = vec2(0.9659 * fc.x - 0.2588 * fc.y, 0.2588 * fc.x + 0.9659 * fc.y);
        float f = -0.5 * (cos(6.28318 * hp.x) + cos(6.28318 * hp.y));
        float t = 1.0 - 2.0 * cov, w = max(fwidth(f) * 0.8, 1e-4);
        float a = cov <= 0.002 ? 0.0 : smoothstep(t - w, t + w, f);
        if (a < 0.01) discard;
        gl_FragColor = vec4(uInk, a);
      }`,
    transparent: true, depthWrite: false,
  });
  contactCache.set(m, pm);
  return pm;
}

export function negBasic(mat, light, dark) {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uNegL = { value: new THREE.Color(light) }; sh.uniforms.uNegD = { value: new THREE.Color(dark) };
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uNegL, uNegD;')
      .replace('#include <map_fragment>', '#include <map_fragment>\n  { float lu = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)); diffuseColor.rgb = mix(uNegL, uNegD, smoothstep(0.2, 0.8, lu)); }');
  };
  mat.customProgramCacheKey = () => 'neg-' + mat.uuid; mat.needsUpdate = true;
}

// Renderer with supersampled outline compositing.
export class ToonRenderer {
  constructor(canvas, W, H, ss = 2) {
    this.W = W; this.H = H; this.ss = ss;
    this.r = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
    this.r.setPixelRatio(1); this.r.setSize(W, H, false);
    this.r.shadowMap.enabled = true; this.r.shadowMap.type = THREE.PCFShadowMap;
    this.r.outputColorSpace = THREE.SRGBColorSpace;
    const mk = () => new THREE.WebGLRenderTarget(W * ss, H * ss, { type: THREE.HalfFloatType, samples: 0 });
    this.colorRT = mk();
    this.normRT = mk();
    // sampled at the same texels as the depth (nearest): a linearly filtered normal next to a card's zero-normal mask
    // passes the mask test while the depth already jumps to the card, which printed a dotted ghost line around every card
    this.normRT.texture.minFilter = this.normRT.texture.magFilter = THREE.NearestFilter;
    this.normRT.depthTexture = new THREE.DepthTexture(W * ss, H * ss);
    this.normMat = new THREE.MeshNormalMaterial();
    this.post = new THREE.ShaderMaterial({
      uniforms: { tColor: { value: this.colorRT.texture }, tNorm: { value: this.normRT.texture }, tDepth: { value: this.normRT.depthTexture },
        texel: { value: new THREE.Vector2(1 / (W * ss), 1 / (H * ss)) }, near: { value: 0.1 }, far: { value: 100 },
        inkColor: { value: new THREE.Color(PAL.ink) }, lineW: { value: 1.6 }, fogColor: { value: new THREE.Color(PAL.paper) },
        fogNear: { value: 1000 }, fogFar: { value: 2000 }, ss: { value: ss },
        printMode: { value: 0 }, wNear: { value: 3.0 }, mis: { value: new THREE.Vector2(0, 0) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
      fragmentShader: `
        uniform sampler2D tColor, tNorm, tDepth; uniform vec2 texel; uniform float near, far, lineW, fogNear, fogFar, ss;
        uniform vec3 inkColor, fogColor; uniform float printMode, wNear; uniform vec2 mis; varying vec2 vUv;
        float lin(float d){ float z = d*2.0-1.0; return (2.0*near*far)/(far+near-z*(far-near)); }
        // print lines: silhouettes (depth jumps) full width, creases (normal turns) thinner; both thicker near
        float edgePrint(vec2 uv){
          float dc = lin(texture2D(tDepth, uv).r);
          vec3 nc = texture2D(tNorm, uv).rgb;
          if (length(nc) < 0.05) return 0.0;
          float w = lineW * clamp(wNear / max(dc, 0.1), 0.55, 2.4);
          float e = 0.0;
          for(int i=0;i<8;i++){
            float a = float(i) * 0.785398;
            vec2 dir = vec2(cos(a), sin(a));
            float d = lin(texture2D(tDepth, uv + dir*texel*w).r);
            vec3 n1 = texture2D(tNorm, uv + dir*texel*w).rgb, n2 = texture2D(tNorm, uv + dir*texel*w*0.55).rgb;
            if (length(n1) < 0.05) return 0.0;
            e = max(e, step(0.035*dc + 0.02, abs(d-dc)));
            e = max(e, step(0.32, length(n2-nc)));
          }
          float f = smoothstep(fogNear, fogFar, dc);
          return e*(1.0-f);
        }
        float edgeAt(vec2 uv){
          vec2 o = texel*lineW;
          float dc = lin(texture2D(tDepth, uv).r);
          vec3 nc = texture2D(tNorm, uv).rgb;
          float e = 0.0;
          if (length(nc) < 0.05) return 0.0;
          for(int i=0;i<4;i++){
            vec2 dir = i==0?vec2(1,0):i==1?vec2(-1,0):i==2?vec2(0,1):vec2(0,-1);
            float d = lin(texture2D(tDepth, uv+dir*o).r);
            vec3 n = texture2D(tNorm, uv+dir*o).rgb;
            if (length(n) < 0.05) return 0.0;
            e = max(e, step(0.035*dc + 0.02, abs(d-dc)));
            e = max(e, step(0.32, length(n-nc)));
          }
          // fade lines with distance like the fog does
          float f = smoothstep(fogNear, fogFar, dc);
          return e*(1.0-f);
        }
        void main(){
          // pass A: colour + ink at full supersampled resolution (kept linear for the depth-of-field blur)
          float e = printMode > 0.5 ? edgePrint(vUv + mis * texel) : edgeAt(vUv);
          gl_FragColor = vec4(mix(texture2D(tColor, vUv).rgb, inkColor, e*0.92), 1.0);
        }`,
      depthTest: false, depthWrite: false,
    });
    this.compRT = mk(); this.dofRT = mk();
    // pass B: depth of field (scatter-as-gather on a golden-angle disc). Each tap counts only if
    // its own blur reaches the centre; taps behind the centre are also limited by the centre's
    // blur, so a sharp subject never takes on a halo from the blurred background behind it.
    this.dof = new THREE.ShaderMaterial({
      uniforms: { tComp: { value: this.compRT.texture }, tDepth: { value: this.normRT.depthTexture },
        texel: { value: new THREE.Vector2(1 / (W * ss), 1 / (H * ss)) }, near: { value: 0.1 }, far: { value: 100 },
        focus: { value: 3 }, aperture: { value: 0 }, maxR: { value: 24 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
      fragmentShader: `
        uniform sampler2D tComp, tDepth; uniform vec2 texel; uniform float near, far, focus, aperture, maxR; varying vec2 vUv;
        float lin(float d){ float z = d*2.0-1.0; return (2.0*near*far)/(far+near-z*(far-near)); }
        float coc(float z){ return min(maxR, aperture * abs(z - focus) / max(z, 0.01)); }
        void main(){
          float zc = lin(texture2D(tDepth, vUv).r), cc = coc(zc);
          vec3 acc = texture2D(tComp, vUv).rgb; float wsum = 1.0;
          if (aperture > 0.0) {
            for (int i = 1; i < 72; i++) {
              float fi = float(i), r = sqrt(fi / 72.0) * maxR, a = fi * 2.39996323;
              vec2 off = vec2(cos(a), sin(a)) * r;
              vec2 uv = vUv + off * texel;
              float zt = lin(texture2D(tDepth, uv).r), ct = coc(zt);
              float reach = zt < zc - 0.02 ? ct : min(ct, cc);
              float w = smoothstep(r - 1.0, r + 1.0, reach);
              acc += texture2D(tComp, uv).rgb * w; wsum += w;
            }
          }
          gl_FragColor = vec4(acc / wsum, 1.0);
        }`,
      depthTest: false, depthWrite: false,
    });
    // pass C: ss x ss box downsample to the screen, linear -> sRGB
    this.down = new THREE.ShaderMaterial({
      uniforms: { tSrc: { value: this.dofRT.texture }, texel: { value: new THREE.Vector2(1 / (W * ss), 1 / (H * ss)) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
      fragmentShader: `
        uniform sampler2D tSrc; uniform vec2 texel; varying vec2 vUv;
        void main(){
          vec3 c = vec3(0.0);
          for(int y=0;y<2;y++) for(int x=0;x<2;x++) c += texture2D(tSrc, vUv + (vec2(float(x),float(y))-0.5)*texel).rgb;
          gl_FragColor = vec4(c * 0.25, 1.0);
          #include <colorspace_fragment>
        }`,
      depthTest: false, depthWrite: false,
    });
    // clip scan: depth of the scene without the character cards, to find where a card is cut by something
    // that is not clearly in front of it (a plane crossing the card, or touching it)
    this.scanRT = new THREE.WebGLRenderTarget(W, H); this.scanRT.depthTexture = new THREE.DepthTexture(W, H);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.post);
    this.postScene = new THREE.Scene(); this.postScene.add(this.quad);
    this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }
  // Paints magenta over every pixel of a character card that is hidden by scene geometry lying less than
  // `gap` metres in front of the card (an intersection or a near-touch), and cyan where the card is hidden
  // by something clearly in front of it. Drawn over the finished frame for checking, never for delivery.
  clipScan(scene, camera, gap = 0.1) {
    const r = this.r, hidden = [];
    scene.traverse(o => { if (o.isMesh && o.visible && (o.userData.isCard || o.userData.isProjShadow || o.userData.isFx || (o.parent && o.parent.userData && o.parent.userData.isFx))) { o.visible = false; hidden.push(o); } });
    const swapped = [];
    scene.traverse(o => { if (o.isMesh && o.visible) { swapped.push([o, o.material]); o.material = this.normMat; } });
    const bg = scene.background, fog = scene.fog; scene.background = null; scene.fog = null;
    r.setRenderTarget(this.scanRT); r.setClearColor(0x000000, 1); r.clear(); r.render(scene, camera);
    swapped.forEach(([o, m]) => o.material = m); hidden.forEach(o => o.visible = true);
    // cards only, with the scan material
    const others = [], cards = [];
    scene.traverse(o => { if (!o.isMesh || !o.visible) return; if (o.userData.isCard && !o.userData.isProjShadow && o.material && o.material.map) cards.push([o, o.material]); else { others.push(o); } });
    others.forEach(o => o.visible = false);
    for (const [o] of cards) {
      const bias = o.userData.depthBias || 0;
      o.material = new THREE.ShaderMaterial({
        uniforms: { tScene: { value: this.scanRT.depthTexture }, map: { value: o.material.map }, near: { value: camera.near }, far: { value: camera.far },
          res: { value: new THREE.Vector2(this.W, this.H) }, gap: { value: gap }, uDepthBias: { value: bias } },
        vertexShader: `uniform float uDepthBias; varying vec2 vUv; varying float vZ;
          void main(){ vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); vZ = -(mvPosition.z + uDepthBias);
            gl_Position = projectionMatrix * mvPosition; }`,
        fragmentShader: `uniform sampler2D tScene, map; uniform float near, far, gap; uniform vec2 res; varying vec2 vUv; varying float vZ;
          float lin(float d){ float z = d*2.0-1.0; return (2.0*near*far)/(far+near-z*(far-near)); }
          void main(){
            if (texture2D(map, vUv).a < 0.5) discard;
            float sd = texture2D(tScene, gl_FragCoord.xy / res).r;
            if (sd >= 0.9999) discard;                   // nothing behind or in front: sky
            float sz = lin(sd);
            float d = vZ - sz;                            // > 0: scene is in front of the card here
            if (d <= 0.0) discard;
            // magenta: crossing or touching (< gap); yellow: close, judge by eye (< 2.5 gap); cyan: clearly in front
            gl_FragColor = d < gap ? vec4(1.0, 0.0, 1.0, 0.85) : d < gap * 2.5 ? vec4(1.0, 0.85, 0.0, 0.6) : vec4(0.0, 0.9, 1.0, 0.35);
          }`,
        transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      });
    }
    const bg2 = scene.background; scene.background = null;
    r.setRenderTarget(null); const ac = r.autoClear; r.autoClear = false; r.render(scene, camera); r.autoClear = ac;
    scene.background = bg2; scene.fog = fog; scene.background = bg;
    cards.forEach(([o, m]) => { o.material.dispose(); o.material = m; });
    others.forEach(o => o.visible = true);
  }
  render(scene, camera, opts = {}) {
    const r = this.r;
    this.post.uniforms.near.value = camera.near; this.post.uniforms.far.value = camera.far;
    if (scene.fog) { this.post.uniforms.fogNear.value = scene.fog.near; this.post.uniforms.fogFar.value = scene.fog.far; }
    this.post.uniforms.lineW.value = opts.lineW ?? 1.6;
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    const printed = [];
    this.post.uniforms.printMode.value = opts.print ? 1 : 0;
    if (opts.print) {
      this.post.uniforms.inkColor.value.set(PRINT.line);
      this.post.uniforms.wNear.value = opts.print.wNear ?? 3.0;
      this.post.uniforms.mis.value.set(...PRINT.mis);
      // every toon surface is printed, including meshes with one material per face (a box with a textured front)
      scene.traverse(o => {
        if (!o.isMesh || !o.material || o.userData.keepColor) return;
        if (Array.isArray(o.material)) { if (o.material.some(m => m.isMeshToonMaterial)) { printed.push([o, o.material]); o.material = o.material.map(m => m.isMeshToonMaterial ? printMaterial(m) : m); } }
        else if (o.material.isMeshToonMaterial) { printed.push([o, o.material]); o.material = printMaterial(o.material); }
      });
      scene.traverse(o => { if (o.isMesh && o.userData.isContact && o.material && !o.material.isShaderMaterial && !o.userData.softContact) { printed.push([o, o.material]); o.material = printContactMaterial(o.material); } });
    }
    r.setRenderTarget(this.colorRT); r.render(scene, camera);
    printed.forEach(([o, m]) => o.material = m);
    // normals pass. Cards write a zero "normal" as a mask: no ink lines are drawn on or
    // around them (they carry their own drawn lines) but they still occlude what is behind.
    const swapped = [];
    const fx = [];
    scene.traverse(o => { if (o.userData.isFx && o.visible) { o.visible = false; fx.push(o); } });
    scene.traverse(o => {
      if (!o.isMesh || o.userData.isProxy) return;
      swapped.push([o, o.material]);
      if (o.userData.isCard) {
        if (!o.userData.maskMat) {
          o.userData.maskMat = new THREE.MeshBasicMaterial({ color: 0x000000, map: o.material.map, alphaTest: 0.5, side: THREE.DoubleSide });
          const bias = o.userData.depthBias || 0;
          if (bias > 0) o.userData.maskMat.onBeforeCompile = sh => {
            sh.uniforms.uDepthBias = { value: bias };
            sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uDepthBias;')
              .replace('#include <project_vertex>', '#include <project_vertex>\n          if (uDepthBias > 0.0) {   // depth as if this many metres nearer the camera; position on screen unchanged\n            vec4 pb = projectionMatrix * vec4(mvPosition.xy, mvPosition.z + uDepthBias, 1.0);\n            gl_Position.z = pb.z / pb.w * gl_Position.w;\n          }');
          };
        }
        o.material = o.userData.maskMat;
      } else o.material = this.normMat;
    });
    const bg = scene.background, fog = scene.fog; scene.background = null; scene.fog = null;
    r.setRenderTarget(this.normRT); r.setClearColor(0x808080, 1); r.clear(); r.render(scene, camera);
    swapped.forEach(([o, m]) => o.material = m);
    fx.forEach(o => o.visible = true);
    scene.background = bg; scene.fog = fog;
    // A: colour + ink
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.quad.material = this.post; r.setRenderTarget(this.compRT); r.render(this.postScene, this.postCam);
    // B: depth of field
    const d = opts.dof || {};
    Object.assign(this.dof.uniforms, {});
    this.dof.uniforms.near.value = camera.near; this.dof.uniforms.far.value = camera.far;
    this.dof.uniforms.focus.value = d.focus ?? 3; this.dof.uniforms.aperture.value = d.aperture ?? 0; this.dof.uniforms.maxR.value = d.maxR ?? 24;
    this.quad.material = this.dof; r.setRenderTarget(this.dofRT); r.render(this.postScene, this.postCam);
    // C: down to the screen
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.quad.material = this.down; r.setRenderTarget(null); r.render(this.postScene, this.postCam);
  }
}

export function loadTex(url) {
  return new Promise((res, rej) => new THREE.TextureLoader().load(url, res, undefined, rej));
}
