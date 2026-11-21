// Rooftop dressing for the school roof, built as real objects (no placeholder boxes): the stairwell hut with its
// steel door, frame, hinges, lever, wired-glass window, sign, caged lamp and braced canopy, a caged access
// ladder, a downpipe, the elevated water tank; air-conditioner condensers with fan guards, louvres, feet on
// blocks and insulated pipes; a mushroom vent; her practice amp with its grille, control panel and jack.
// Everything uses toon materials in greys, so the print pass turns darkness into teal tints and shade into dots.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from './toon.js';

function tex(w, h, draw, repeat = null) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const shadowy = o => { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
const box = (w, h, d, mat, r = 0.01) => new THREE.Mesh(r > 0 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d), mat);
const cyl = (r, h, mat, seg = 16) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);

// concrete wall: panel joints, a horizontal construction joint, weathering streaks under the coping
function wallTex(seed, wM, hM) {
  const ppm = 160, W = Math.round(wM * ppm), H = Math.round(hM * ppm);
  return tex(W, H, (g) => {
    const R = rng(seed); g.fillStyle = '#efefef'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#a8a8a8'; g.lineWidth = 3;
    for (let x = ppm * 0.9; x < W; x += ppm * 0.9) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    g.beginPath(); g.moveTo(0, H * 0.34); g.lineTo(W, H * 0.34); g.stroke();
    // streaks: rain washing down from the coping, in two greys
    for (let i = 0; i < W / 9; i++) {
      const x = R() * W, len = H * (0.08 + R() * R() * 0.5), w = 2 + R() * 7;
      g.fillStyle = `rgba(150,150,150,${0.18 + R() * 0.25})`; g.fillRect(x, 0, w, len);
    }
    // a kick of splashed dirt at the foot
    for (let i = 0; i < W / 4; i++) { g.fillStyle = `rgba(140,140,140,${0.15 + R() * 0.2})`; g.fillRect(R() * W, H - R() * R() * H * 0.12, 2 + R() * 4, 2 + R() * 6); }
  });
}

export function buildHut(scene, { x = -4.3, z = 4.6, rot = 0, steel }) {
  const hut = new THREE.Group();
  const W = 3.4, Hh = 3.0, D = 3.2;
  const wallFront = toon(0xffffff, { map: wallTex(3, W, Hh) }), wallSide = toon(0xffffff, { map: wallTex(7, D, Hh) });
  const walls = new THREE.Mesh(new THREE.BoxGeometry(W, Hh, D), [wallSide, wallSide, toon(0xdedede), toon(0xdedede), wallFront, wallFront]);
  walls.position.y = Hh / 2; hut.add(walls);
  // coping: a slab a little wider than the walls, and a dark kick strip at the foot
  const coping = box(W + 0.12, 0.14, D + 0.12, toon(0xd6d6d6), 0.015); coping.position.y = Hh + 0.07; hut.add(coping);
  const kick = box(W + 0.02, 0.18, D + 0.02, toon(0x9c9c9c), 0.005); kick.position.y = 0.09; hut.add(kick);
  // the door (front face is -z): frame, leaf with an inset panel, wired-glass window, lever, hinges, sill
  const fz = -D / 2, dx = 0.55;
  const frameM = toon(0x7d8287);
  const jambL = box(0.08, 2.2, 0.1, frameM, 0.006); jambL.position.set(dx - 0.52, 1.1, fz - 0.03); hut.add(jambL);
  const jambR = jambL.clone(); jambR.position.x = dx + 0.52; hut.add(jambR);
  const head = box(1.12, 0.09, 0.1, frameM, 0.006); head.position.set(dx, 2.22, fz - 0.03); hut.add(head);
  const leaf = box(0.96, 2.12, 0.05, toon(0x9aa0a5), 0.008); leaf.position.set(dx, 1.07, fz - 0.035); hut.add(leaf);
  const inset = box(0.72, 0.9, 0.012, toon(0xa9aeb2), 0.004); inset.position.set(dx, 0.62, fz - 0.064); hut.add(inset);
  const glassTex = tex(128, 160, (g, w, h) => { g.fillStyle = '#b9c0c4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7b8186'; g.lineWidth = 2;
    for (let i = 8; i < w; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } for (let i = 8; i < h; i += 16) { g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.42), toon(0xffffff, { map: glassTex })); glass.position.set(dx, 1.62, fz - 0.062); glass.rotation.y = Math.PI; hut.add(glass);
  const lever = box(0.16, 0.025, 0.03, toon(0x5a5e62), 0.006); lever.position.set(dx - 0.36, 1.0, fz - 0.075); hut.add(lever);
  const rose = cyl(0.03, 0.02, toon(0x5a5e62), 12); rose.rotation.x = Math.PI / 2; rose.position.set(dx - 0.4, 1.0, fz - 0.065); hut.add(rose);
  for (const hy of [0.25, 1.05, 1.85]) { const hinge = box(0.03, 0.12, 0.03, toon(0x6a6e72), 0.004); hinge.position.set(dx + 0.47, hy, fz - 0.07); hut.add(hinge); }
  const sill = box(1.1, 0.04, 0.16, toon(0xbdbdbd), 0.004); sill.position.set(dx, 0.02, fz - 0.08); hut.add(sill);
  // the sign above the door, printed in the town's ink
  const signT = tex(512, 128, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#4a4a4a'; g.fillRect(0, 0, 56, h);
    g.fillStyle = '#ffffff'; g.font = '700 40px ZenKakuB'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('!', 28, h / 2);
    g.fillStyle = '#3a3a3a'; g.font = '700 42px ZenKakuB'; g.fillText('屋上出入口', 290, 44); g.font = '500 26px ZenKaku'; g.fillText('関係者以外の立入りを禁ず', 290, 96);
    g.strokeStyle = '#3a3a3a'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.18), toon(0xffffff, { map: signT })); sign.position.set(dx, 2.48, fz - 0.012); sign.rotation.y = Math.PI; hut.add(sign);
  // the canopy on two diagonal braces, and a caged lamp under it
  const can = box(1.5, 0.05, 0.62, toon(0xc2c2c2), 0.006); can.position.set(dx, 2.74, fz - 0.31); hut.add(can);
  const fascia = box(1.5, 0.1, 0.03, toon(0xb0b0b0), 0.004); fascia.position.set(dx, 2.72, fz - 0.62); hut.add(fascia);
  for (const bx of [-0.66, 0.66]) { const br = box(0.03, 0.03, 0.66, steel, 0); br.position.set(dx + bx, 2.55, fz - 0.27); br.rotation.x = -0.6; hut.add(br); }
  const lampBase = box(0.16, 0.08, 0.06, toon(0x8a8a8a), 0.01); lampBase.position.set(dx, 2.58, fz - 0.04); hut.add(lampBase);
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 10), toon(0xf2f2f2)); globe.position.set(dx, 2.52, fz - 0.1); hut.add(globe);
  for (let k = 0; k < 4; k++) { const cage = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.004, 4, 16), steel); cage.position.copy(globe.position); cage.rotation.set(Math.PI / 2, 0, k * Math.PI / 4); hut.add(cage); }
  // the access ladder to the tank: rails, rungs, wall standoffs, and a safety cage from 2.1 m up
  const lx = -1.0, lz = fz - 0.2;
  for (const ox of [-0.21, 0.21]) { const rail = box(0.035, 4.6, 0.05, steel, 0); rail.position.set(lx + ox, 2.3, lz); hut.add(rail); }
  for (let k = 0; k < 15; k++) { const rung = cyl(0.014, 0.42, steel, 6); rung.rotation.z = Math.PI / 2; rung.position.set(lx, 0.3 + k * 0.3, lz); hut.add(rung); }
  for (const sy of [0.6, 1.8, 2.9]) for (const ox of [-0.21, 0.21]) { const so = box(0.03, 0.03, 0.2, steel, 0); so.position.set(lx + ox, sy, lz + 0.1); hut.add(so); }
  for (let k = 0; k < 6; k++) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.012, 5, 24, Math.PI), steel);
    hoop.rotation.set(Math.PI / 2, 0, Math.PI); hoop.position.set(lx, 2.1 + k * 0.5, lz); hut.add(hoop);
  }
  for (const a of [0.35, 1.2, 1.95, 2.8]) { const vb = box(0.02, 2.5, 0.02, steel, 0); vb.position.set(lx + Math.cos(a) * 0.36, 3.35, lz - Math.sin(a) * 0.36); hut.add(vb); }
  // downpipe at the corner, with brackets and a shoe
  const dp = cyl(0.045, 3.0, toon(0xbcbcbc), 12); dp.position.set(W / 2 - 0.12, 1.5, fz - 0.08); hut.add(dp);
  for (const by of [0.5, 1.5, 2.5]) { const bk = box(0.12, 0.03, 0.06, steel, 0); bk.position.set(W / 2 - 0.12, by, fz - 0.05); hut.add(bk); }
  const shoe = cyl(0.05, 0.12, toon(0xbcbcbc), 12); shoe.rotation.x = Math.PI / 2.6; shoe.position.set(W / 2 - 0.12, 0.08, fz - 0.14); hut.add(shoe);
  // the water tank on a steel frame, banded
  const frameT = new THREE.Group();
  for (const [ox, oz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) { const leg = box(0.06, 0.7, 0.06, steel, 0); leg.position.set(ox, 0.35, oz); frameT.add(leg); }
  for (const oz of [-0.6, 0.6]) { const bm = box(1.32, 0.06, 0.06, steel, 0); bm.position.set(0, 0.7, oz); frameT.add(bm); }
  const tank = cyl(0.78, 1.4, toon(0xd8d8d8), 32); tank.position.y = 1.43; frameT.add(tank);
  for (const ty of [1.0, 1.43, 1.86]) { const band = new THREE.Mesh(new THREE.TorusGeometry(0.785, 0.012, 4, 40), toon(0x9a9a9a)); band.rotation.x = Math.PI / 2; band.position.y = ty; frameT.add(band); }
  const lid = cyl(0.22, 0.06, toon(0xbdbdbd), 16); lid.position.y = 2.16; frameT.add(lid);
  frameT.position.set(-0.4, Hh + 0.14, 0.3); hut.add(frameT);
  hut.position.set(x, 0, z); hut.rotation.y = rot; scene.add(shadowy(hut));
  return hut;
}

// condenser: front with a round fan guard (rings and spokes) and a louvred side, top grille, feet on blocks
const fanTex = tex(256, 256, (g, w, h) => {
  g.fillStyle = '#d9d9d9'; g.fillRect(0, 0, w, h); g.fillStyle = '#5f5f5f'; g.beginPath(); g.arc(w * 0.42, h / 2, w * 0.36, 0, 7); g.fill();
  g.strokeStyle = '#dadada'; g.lineWidth = 3; for (let r = 12; r < w * 0.36; r += 11) { g.beginPath(); g.arc(w * 0.42, h / 2, r, 0, 7); g.stroke(); }
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.beginPath(); g.moveTo(w * 0.42, h / 2); g.lineTo(w * 0.42 + Math.cos(a) * w * 0.36, h / 2 + Math.sin(a) * w * 0.36); g.stroke(); }
  g.fillStyle = '#8a8a8a'; g.beginPath(); g.arc(w * 0.42, h / 2, 10, 0, 7); g.fill();
  g.strokeStyle = '#8f8f8f'; g.lineWidth = 4; for (let y = 40; y < h - 30; y += 14) { g.beginPath(); g.moveTo(w * 0.83, y); g.lineTo(w * 0.95, y); g.stroke(); }
  g.strokeStyle = '#9f9f9f'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
});
const louvreTex = tex(128, 128, (g, w, h) => { g.fillStyle = '#d6d6d6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8c8c8c'; g.lineWidth = 3; for (let y = 6; y < h; y += 9) { g.beginPath(); g.moveTo(4, y); g.lineTo(w - 4, y); g.stroke(); } });
export function buildAC(scene, { x, z, rot = 0, steel }) {
  const g = new THREE.Group();
  const front = toon(0xffffff, { map: fanTex }), side = toon(0xffffff, { map: louvreTex }), top = toon(0xffffff, { map: louvreTex }), plain = toon(0xd4d4d4);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.64, 0.32), [side, side, top, plain, plain, front]);
  body.position.y = 0.44; body.rotation.y = Math.PI; g.add(body);
  for (const dx of [-0.34, 0.34]) { const foot = box(0.06, 0.06, 0.36, toon(0x9a9a9a), 0); foot.position.set(dx, 0.1, 0); g.add(foot); const blk = box(0.16, 0.08, 0.3, toon(0xbcbcbc), 0.01); blk.position.set(dx, 0.04, 0); g.add(blk); }
  // refrigerant pipes leaving the side, wrapped in insulation, bending down into a duct cover on the roof
  const ins = toon(0xe8e8e8);
  const p1 = cyl(0.03, 0.22, ins, 10); p1.rotation.z = Math.PI / 2; p1.position.set(0.54, 0.3, 0.06); g.add(p1);
  const p2 = cyl(0.03, 0.22, ins, 10); p2.position.set(0.64, 0.19, 0.06); g.add(p2);
  const duct = box(0.16, 0.1, 1.2, toon(0xcfcfcf), 0.01); duct.position.set(0.64, 0.05, 0.62); g.add(duct);
  g.position.set(x, 0, z); g.rotation.y = rot; scene.add(shadowy(g));
  return g;
}

export function buildVent(scene, { x, z, steel }) {
  const g = new THREE.Group(); const grey = toon(0xd0d0d0), dark = toon(0x8f8f8f);
  const base = box(0.4, 0.12, 0.4, toon(0xbdbdbd), 0.01); base.position.y = 0.06; g.add(base);
  const pipe = cyl(0.1, 1.2, grey, 20); pipe.position.y = 0.72; g.add(pipe);
  for (let k = 0; k < 4; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17 - k * 0.012, 0.012, 4, 24), dark); ring.rotation.x = Math.PI / 2; ring.position.y = 1.36 + k * 0.035; g.add(ring); }
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.14, 24), grey); cap.position.y = 1.55; g.add(cap);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 24), dark); rim.position.y = 1.47; g.add(rim);
  g.position.set(x, 0, z); scene.add(shadowy(g));
  return g;
}

// the practice amp: woven grille, a top panel with knobs and printed labels, corners, the input jack; returns the
// jack's world position so the cable can be plugged in
const grilleTex = tex(512, 320, (g, w, h) => { g.fillStyle = '#b4b4b4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6e6e6e'; g.lineWidth = 3;
  for (let i = -h; i < w; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); }
  g.strokeStyle = '#5a5a5a'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
  g.fillStyle = '#3c3c3c'; g.fillRect(w * 0.58, h * 0.76, w * 0.36, h * 0.15); g.fillStyle = '#e0e0e0'; g.font = '700 36px ZenKakuB'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PRACTICE 15', w * 0.76, h * 0.835); });
const panelTex = tex(512, 96, (g, w, h) => { g.fillStyle = '#e4e4e4'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a3a3a'; g.font = '500 16px ZenKaku'; g.textAlign = 'center';
  ['TREBLE', 'MID', 'BASS', 'VOLUME', 'GAIN', 'INPUT'].forEach((t, i) => g.fillText(t, 40 + i * 84, h - 12)); });
export function buildAmp(scene, { x, z, rot = 0 }) {
  const amp = new THREE.Group();
  const shell = box(0.46, 0.4, 0.25, toon(0x8e8e8e), 0.03); shell.position.y = 0.2; amp.add(shell);
  const grille = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), toon(0xffffff, { map: grilleTex })); grille.position.set(0, 0.165, -0.127); grille.rotation.y = Math.PI; amp.add(grille);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.075), toon(0xffffff, { map: panelTex })); panel.position.set(0, 0.34, -0.127); panel.rotation.y = Math.PI; amp.add(panel);
  const knobs = [];
  // panel seen from the front: TREBLE at the viewer's left ... INPUT at the viewer's right (local -x is the viewer's right)
  for (let k = 0; k < 5; k++) { const knob = cyl(0.014, 0.022, toon(0x2e2e2e), 14); knob.rotation.x = Math.PI / 2; knob.position.set(0.21 - (40 + k * 84) / 512 * 0.42, 0.348, -0.137); amp.add(knob); knobs.push(knob); }
  const jack = cyl(0.009, 0.012, toon(0x9c9c9c), 10); jack.rotation.x = Math.PI / 2; const jx = 0.21 - (40 + 5 * 84) / 512 * 0.42; jack.position.set(jx, 0.348, -0.132); amp.add(jack);
  for (const [cx, cy] of [[-0.21, 0.02], [0.21, 0.02], [-0.21, 0.38], [0.21, 0.38]]) { const c = box(0.05, 0.05, 0.27, toon(0x3c3c3c), 0.01); c.position.set(cx, cy, 0); amp.add(c); }
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.013, 8, 20, Math.PI), toon(0x2e2e2e)); handle.position.set(0, 0.4, 0); amp.add(handle);
  amp.position.set(x, 0, z); amp.rotation.y = rot; scene.add(shadowy(amp));
  amp.updateMatrixWorld(true);
  const jackW = new THREE.Vector3(jx, 0.348, -0.145).applyMatrix4(amp.matrixWorld);
  return { amp, jack: jackW };
}

// a guitar cable lying on the floor from (a) to the jack, rising up the amp's front
export function buildCable(scene, a, jack, { r = 0.0075, mat, plug: withPlug = true } = {}) {
  const mid = new THREE.Vector3((a.x + jack.x) / 2, 0.008, (a.z + jack.z) / 2 - 0.12);
  const foot = new THREE.Vector3(jack.x, 0.01, jack.z - 0.08);
  const pts = [new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(a.x + (mid.x - a.x) * 0.4, 0.008, a.z + (mid.z - a.z) * 0.4), mid, foot,
    new THREE.Vector3(jack.x, jack.y * 0.5, jack.z - 0.06), new THREE.Vector3(jack.x, jack.y, jack.z - 0.03), jack];
  const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, r, 6), mat ?? toon(0x2c2c2c));
  // the cable is hers, like the one in her drawing: dark grey, not printed in the town's teal
  tube.userData.keepColor = true; scene.add(shadowy(tube));
  if (withPlug) { const plug = cyl(0.012, 0.06, toon(0x3c3c3c), 10); plug.userData.keepColor = true; plug.position.set(jack.x, jack.y, jack.z - 0.03); plug.rotation.x = Math.PI / 2; scene.add(shadowy(plug)); }
  return tube;
}
