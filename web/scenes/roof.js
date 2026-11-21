// School rooftop, the interlude: she plays; behind her, over the town, the town's cards hang in the
// sky in rows like a card stunt, and a wave of flips runs through them with her downstroke.
// Level camera at her eye height (the performance drawing is a front view at eye level).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon, makeLights, characterCard, ToonRenderer, loadTex } from '../lib/toon.js';
import { drawCard, loadCardFonts, CARD_RATIO } from '../lib/card.js';

const q = new URLSearchParams(location.search);
const P = (k, v) => +(q.get(k) ?? v);
const W = 1920, H = 1080;
// where the feet are in a cut-out: mean x of the opaque pixels in the bottom 3% of rows, as a
// fraction of the width from the centre (so the contact shadow sits under the feet, not the image centre)
function feetOffset(img) {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d');
  g.drawImage(img, 0, 0); const h0 = Math.floor(img.height * 0.97), d = g.getImageData(0, h0, img.width, img.height - h0).data;
  let sx = 0, n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) { sx += ((i - 3) / 4) % img.width; n++; }
  return n ? sx / n / img.width - 0.5 : 0;
}

const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
await loadCardFonts();
const scene = new THREE.Scene();
const SKY_LO = new THREE.Color(0xe9ece9), SKY_HI = new THREE.Color(0xb9cbd2);
// sky: a big gradient dome, pale at the horizon
{
  const c = document.createElement('canvas'); c.width = 4; c.height = 512; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#a9bfc8'); gr.addColorStop(0.55, '#d6dfdf'); gr.addColorStop(1, '#eef0ec');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
  dome.userData.isFx = true; scene.add(dome);
}
scene.background = SKY_LO.clone();
const rig = makeLights(scene, { amb: [P('a0', 0.74), P('a1', 0.77), P('a2', 0.8)], sun: [0.28, 0.27, 0.25] });

// ---------- rooftop slab, parapet with a rail, stairwell hut, water tank ----------
function concreteTex() {
  const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#c9c8c2'; g.fillRect(0, 0, 1024, 1024);
  let s = 5; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 9000; i++) { g.fillStyle = R() < 0.5 ? 'rgba(90,90,95,0.10)' : 'rgba(255,255,255,0.22)'; g.fillRect(R() * 1024, R() * 1024, 1 + R() * 3, 1 + R() * 3); }
  g.strokeStyle = 'rgba(80,80,85,0.45)'; g.lineWidth = 3; g.strokeRect(0, 0, 1024, 1024);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10); t.offset.set(P('fox', 0.37), P('foy', 0.2)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}
const slab = new THREE.Mesh(new THREE.PlaneGeometry(30, 30).rotateX(-Math.PI / 2), toon(0xffffff, { map: concreteTex() }));
slab.receiveShadow = true; slab.position.z = 0; scene.add(slab);
const pz = P('pz', 3.2);                 // parapet line behind her
const parapet = new THREE.Mesh(new RoundedBoxGeometry(30, 0.9, 0.25, 2, 0.02), toon(0xd8d7d1)); parapet.position.set(0, 0.45, pz); scene.add(parapet);
const coping = new THREE.Mesh(new RoundedBoxGeometry(30, 0.06, 0.32, 2, 0.01), toon(0xb9b9b4)); coping.position.set(0, 0.93, pz); scene.add(coping);
const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 30, 8).rotateZ(Math.PI / 2), toon(0x8d9399)); rail.position.set(0, 1.25, pz); scene.add(rail);
for (let x = -15; x <= 15; x += 1.2) { const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 6), toon(0x8d9399)); post.position.set(x, 1.09, pz); scene.add(post); }
// stairwell hut with a steel door (screen right = world -x when looking +z)
const hut = new THREE.Group();
const hb = new THREE.Mesh(new RoundedBoxGeometry(3.2, 2.9, 3.0, 2, 0.03), toon(0xdedcd5)); hb.position.y = 1.45; hut.add(hb);
const door = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.05, 0.06, 2, 0.01), toon(0x7f8a8f)); door.position.set(0.8, 1.03, -1.52); hut.add(door);
const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), toon(0xc7c9cb)); knob.position.set(0.45, 1.0, -1.57); hut.add(knob);
const lamp = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.14, 0.12, 2, 0.02), toon(0xf4f3ee)); lamp.position.set(0.8, 2.3, -1.56); hut.add(lamp);
hut.position.set(P('hx', -9), 0, P('hz', 2.2)); hut.rotation.y = P('hry', 0); scene.add(hut);
// water tank on a steel stand (screen left)
const tank = new THREE.Group();
const tb = new THREE.Mesh(new RoundedBoxGeometry(2.4, 1.6, 1.8, 3, 0.08), toon(0xe4e3dd)); tb.position.y = 1.0 + 0.8; tank.add(tb);
for (const [x, z] of [[-1, -0.7], [1, -0.7], [-1, 0.7], [1, 0.7]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.08), toon(0x7d8287)); leg.position.set(x, 0.5, z); tank.add(leg); }
for (let i = 0; i < 5; i++) { const band = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.02, 1.82), toon(0xc9c8c2)); band.position.y = 1.15 + i * 0.32; tank.add(band); }
tank.position.set(P('tx', 9), 0, P('tz', 5.5)); scene.add(tank);
scene.traverse(o => { if (o.isMesh && !o.userData.isFx) { o.castShadow = true; o.receiveShadow = true; } });

// ---------- the town beyond: mostly below the parapet; only far towers and pylons show above it ----------
function facadeTex(seed, tint) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 512; const g = c.getContext('2d');
  let s = seed; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = tint; g.fillRect(0, 0, 256, 512);
  const cols = 3 + Math.floor(R() * 3), rows = 8 + Math.floor(R() * 8), mw = 256 / cols, mh = 512 / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    g.fillStyle = R() < 0.18 ? 'rgba(120,132,140,0.55)' : 'rgba(150,162,170,0.45)';
    g.fillRect(i * mw + mw * 0.18, j * mh + mh * 0.22, mw * 0.64, mh * 0.5);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
{
  let s = 11; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const tints = ['#d4d7d6', '#dcd9d1', '#cdd2d4', '#c8ccce'];
  const roofY = -P('roofh', 20);
  for (let i = 0; i < 120; i++) {
    const tall = R() < 0.18, z = 80 + R() * 320, x = (R() - 0.5) * (120 + z * 1.4);
    const w = 8 + R() * 16, d = 8 + R() * 14, h = tall ? 26 + R() * 22 : 6 + R() * 12;
    const tex = facadeTex(3 + i, tints[i % 4]); tex.repeat.set(Math.max(1, Math.round(w / 10)), Math.max(1, Math.round(h / 14)));
    const m = toon(0xffffff, { map: tex });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [m, m, toon(0xc9cbcb), toon(0xc9cbcb), m, m]);
    b.position.set(x, roofY + h / 2, z); scene.add(b);
    if (tall) { const t2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.4, 12), toon(0xd2d4d3)); t2.position.set(x, roofY + h + 1.2, z); scene.add(t2); }
  }
  // transmission pylons marching across the far hills, with their sagging lines
  const steel = new THREE.LineBasicMaterial({ color: 0x7c8186 });
  const pyl = [];
  for (let k = 0; k < 6; k++) {
    const px = -260 + k * 110, pz = 420 + Math.sin(k) * 30, ph = 46;
    const pts = [];
    const add = (a, b) => pts.push(new THREE.Vector3(...a), new THREE.Vector3(...b));
    add([px - 7, roofY, pz], [px - 1.2, roofY + ph, pz]); add([px + 7, roofY, pz], [px + 1.2, roofY + ph, pz]);
    for (let y = 6; y < ph; y += 6) { const w2 = 7 - (y / ph) * 5.8; add([px - w2, roofY + y, pz], [px + w2, roofY + y, pz]); add([px - w2, roofY + y, pz], [px + w2 - 0.8, roofY + y + 6, pz]); }
    for (const [yy, ww] of [[ph - 10, 11], [ph - 18, 13], [ph - 26, 11]]) add([px - ww, roofY + yy, pz], [px + ww, roofY + yy, pz]);
    const ls = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), steel); scene.add(ls);
    pyl.push([px, pz, ph]);
  }
  for (let k = 0; k < pyl.length - 1; k++) for (const [yy, ww] of [[pyl[k][2] - 10, 11], [pyl[k][2] - 18, 13]]) for (const sx of [-1, 1]) {
    const a = new THREE.Vector3(pyl[k][0] + sx * ww, roofY + yy, pyl[k][1]), b = new THREE.Vector3(pyl[k + 1][0] + sx * ww, roofY + yy, pyl[k + 1][1]);
    const pts = []; for (let t = 0; t <= 20; t++) { const p = a.clone().lerp(b, t / 20); p.y -= Math.sin(Math.PI * t / 20) * 6; pts.push(p); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), steel));
  }
}

// ---------- the card stunt in the sky ----------
// Every card in town hangs in one formation over the town. Fronts: the answer side, filled in.
// Backs: the printed rules, which everyone has secretly blackened with pencil, each in their own way.
// With her downstroke a ring of flips spreads out from behind her: the black spreads across the sky.
const cols = P('gc', 26), rows = P('gr', 9), cw = P('cw', 3.4), gap = P('gg', 0.6), gz = P('gz', 95), gy = P('gy', 15);
const plugSlot = (c, color) => { const g = c.getContext('2d'); g.fillStyle = color; g.beginPath(); g.roundRect(236, 10, 128, 24, 10); g.fill(); };
const fronts = [0, 1, 2, 3, 4, 5].map(i => {
  const c = document.createElement('canvas'); c.width = 600; c.height = 400;
  drawCard(c, { id: String(1000 + i * 1373 % 9000), dev: String(40 + i * 7 % 30), seed: 3 + i, serial: `2026-${1000 + i}` });
  plugSlot(c, '#f5f3ed');             // the slot is a 2 cm hole; at this distance it only reads as a notch
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
});
const backs = [0, 1, 2, 3, 4, 5].map(i => {
  const c = document.createElement('canvas'); c.width = 600; c.height = 400;
  drawCard(c, { side: 'back', seed: 20 + i }); plugSlot(c, '#f5f3ed');
  const g = c.getContext('2d'); let s2 = 9 + i * 31; const R2 = () => (s2 = (s2 * 16807) % 2147483647) / 2147483647;
  g.save(); g.beginPath(); g.roundRect(0, 0, 600, 400, 18); g.clip(); g.lineCap = 'round'; g.lineJoin = 'round';
  // pencil scribble: matte graphite, a different hand and angle on every card, the print just showing through
  const ang = (R2() - 0.5) * 1.2, ca = Math.cos(ang), sa = Math.sin(ang);
  for (let pass = 0; pass < 3; pass++) {
    g.strokeStyle = `rgba(46,46,52,${0.42 + pass * 0.12 + R2() * 0.08})`; g.lineWidth = 7 + R2() * 6;
    g.beginPath();
    for (let k = 0; k <= 30; k++) {
      const t = (k / 30) * 2 - 1, yy = t * 260 + (R2() - 0.5) * 18;
      const ax = -380, bx = 380, P0 = [ax * ca - yy * sa + 300, ax * sa + yy * ca + 200], P1 = [bx * ca - (yy + 22) * sa + 300, bx * sa + (yy + 22) * ca + 200];
      k ? g.lineTo(...(k % 2 ? P1 : P0)) : g.moveTo(...P0); g.lineTo(...(k % 2 ? P0 : P1));
    }
    g.stroke();
  }
  // graphite sheen and gaps where the paper and print show
  g.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(0,0,0,${0.08 + R2() * 0.22})`; g.fillRect(R2() * 600, R2() * 400, 2 + R2() * 5, 1 + R2() * 2); }
  g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
});
const ch = cw / CARD_RATIO;
const frontGeo = new THREE.PlaneGeometry(cw, ch), backGeo = new THREE.PlaneGeometry(cw, ch).rotateY(Math.PI);
const frontMats = fronts.map(t => new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, fog: false }));
const backMats = backs.map(t => new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, fog: false }));
// ring wave: the flip front is a circle centred on the point of the formation straight behind her
const wcx = P('wcx', (cols - 1) / 2), wcy = P('wcy', 0.15), wr = P('wr', 0.42), ww = P('ww', 0.07);
const wave = (i, j) => {
  const dx = (i - wcx) / cols, dy = (j - wcy * rows) / cols;     // aspect-correct distance in formation widths
  const r = Math.hypot(dx, dy);
  const t = (wr - r) / ww;                                         // inside the ring: flipped
  return Math.PI * Math.min(1, Math.max(0, 0.5 + t * 0.5));
};
const dummy = new THREE.Object3D();
const frontsIM = frontMats.map(m => new THREE.InstancedMesh(frontGeo, m, cols * rows));
const backsIM = backMats.map(m => new THREE.InstancedMesh(backGeo, m, cols * rows));
const cf = frontsIM.map(() => 0), cb = backsIM.map(() => 0);
for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
  const x = (i - (cols - 1) / 2) * (cw + gap), y = gy + j * (ch + gap);
  const a = wave(i, j);
  dummy.position.set(-x, y, gz); dummy.rotation.set(0, Math.PI + a, (a > 0.05 && a < Math.PI - 0.05) ? (((i + j) % 2) - 0.5) * 0.08 : 0); dummy.updateMatrix();
  const k = (i * 7 + j * 3) % frontsIM.length, kb = (i * 5 + j * 11) % backsIM.length;
  frontsIM[k].setMatrixAt(cf[k]++, dummy.matrix); backsIM[kb].setMatrixAt(cb[kb]++, dummy.matrix);
}
// these are real objects in the depth and outline passes, so nearer things occlude them correctly
frontsIM.forEach((m, k) => { m.count = cf[k]; scene.add(m); });
backsIM.forEach((m, k) => { m.count = cb[k]; scene.add(m); });

// ---------- her ----------
const cards = [];
const her = q.get('rin');
if (her) {
  const t = await loadTex(`/art/cut/${her}.png`);
  const c = characterCard(t, P('rh', 1.6), rig, { lit: 1, castShadow: false, contactW: 0.5 });
    const ct = c.userData.contact; ct.userData.isFx = true;
  // a soft dark ellipse right under the soles, nudged toward the camera so it shows past the shoes
  ct.material.color.set(0x5f6266); ct.material.opacity = P('cto', 0.34); ct.scale.set(P('ctw', 0.34), 1, P('ctd', 0.1)); ct.position.set(feetOffset(t.image) * c.userData.mesh.geometry.parameters.width, 0.003, P('ctz', 0.035));
  c.position.set(P('rx', 0), 0, P('rz', 0)); c.rotation.order = 'YXZ'; c.rotation.y = Math.PI; c.rotation.x = -P('pitch', 0) * Math.PI / 180 * P('tiltk', 1); scene.add(c); cards.push(c);
}

// ---------- light, camera ----------
rig.sun.position.set(P('sx', 4), P('sy', 9), P('sz', -2)); rig.sun.target.position.set(0, 0, 1); scene.add(rig.sun.target);
const sh = rig.sun.shadow.camera; sh.left = -12; sh.right = 12; sh.top = 12; sh.bottom = -12; sh.near = 0.5; sh.far = 40;
const cam = new THREE.PerspectiveCamera(P('fov', 40), W / H, 0.1, 2000);
const eye = P('ch', 1.4);
cam.position.set(P('cx', 0), eye, -P('dist', 4.2));
cam.lookAt(P('cx', 0), eye + Math.tan(P('pitch', 0) * Math.PI / 180) * 100, 100);
if (P('shift', 0)) cam.setViewOffset(W, H, 0, -P('shift', 0) * H, W, H);
scene.fog = new THREE.Fog(0xe6e9e6, P('f0', 40), P('f1', 320));
const tr = new ToonRenderer(canvas, W, H, 2);
tr.post.uniforms.inkColor && tr.post.uniforms.inkColor.value.set('#4a4c54');
tr.render(scene, cam, { lineW: P('lw', 1.4), dof: { focus: P('fo', 4.2), aperture: P('ap', 0), maxR: 6 } });
window.__info = { cards: cards.length };
window.__ready = true;
