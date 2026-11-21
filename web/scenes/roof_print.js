// #9 interlude, printed: the school roof behind a tall wire-mesh fence, the town spread out beyond it,
// and over the town every card in town hanging in one formation. With her downstroke a ring of cards
// flips over to the backs everyone has secretly blackened with pencil; the black spreads from behind her.
// Camera low, at her hip height, looking up a little: the performance drawing is made for this camera.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon, makeLights, characterCard, ToonRenderer, loadTex, PRINT } from '../lib/toon.js';
import { drawCard, loadCardFonts, CARD_RATIO, rng } from '../lib/card.js';
import { buildHut, buildAC, buildVent, buildAmp, buildCable } from '../lib/roofdress.js';

const q = new URLSearchParams(location.search);
const P = (k, v) => +(q.get(k) ?? v);
const DRESS2 = q.get('dress2') === '1';
const W = 1920, H = 1080;
const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
await loadCardFonts();
// night=1: the roof after sunset. Dark paper, light ink: the town is dark blocks with lit windows fading into the glow
// on the horizon, the sky goes from that glow to black overhead, and the cards in the sky are the brightest things
// there, so as they turn over to their blackened backs the lights go out ring by ring.
const NIGHT = q.get('night') === '1';
const NC = k => parseInt(q.get(k), 16);
if (NIGHT) {
  PRINT.dark = 1; PRINT.paper = q.get('npaper') ? NC('npaper') : 0x10181c; PRINT.teal = q.get('nink') ? NC('nink') : 0x7fa6ae;
  PRINT.shadowInk = q.get('nshade') ? NC('nshade') : 0x060a0c; PRINT.line = q.get('nline') ? NC('nline') : 0x34545c;
}
if (q.get('line')) PRINT.line = parseInt(q.get('line'), 16);
if (q.get('shink')) PRINT.shadowInk = parseInt(q.get('shink'), 16);
const scene = new THREE.Scene();
const HORIZON = q.get('nhor') ? NC('nhor') : 0x24444c, ZENITH = q.get('nzen') ? NC('nzen') : 0x070b0e;
scene.background = new THREE.Color(NIGHT ? ZENITH : 0xf5f3ed);
const rig = makeLights(scene, { amb: [P('amb', 0.8), P('amb', 0.8) * 1.012, P('amb', 0.8) * 1.04], sun: [P('sun', 0.2), P('sun', 0.2), P('sun', 0.2) * 0.95] });
const R = rng(17);
function tex(w, h, draw, repeat = null) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
const shadowy = o => { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

// ---------- the roof: concrete slabs with expansion joints, a drain along the fence ----------
const FZ = P('fz', 6.5);                                    // the fence line behind her
// tiles=1: 30 cm floor tiles inside the 3 m expansion joints (the grid answers the formation's grid overhead and the
// station floor's tiles). The texture has its own mip chain: the thin tile lines are only in the levels used near the
// camera and fade out in the next one, so far away the floor does not break the lines up into dashes; the 3 m joints stay.
const TILES = q.get('tiles') === '1';
function slabLevel(size, level) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, size, size);
  const ta = TILES ? [1, 1, P('tilefade', 0.35), 0][Math.min(level, 3)] : 0;
  if (ta > 0) { g.globalAlpha = ta; g.strokeStyle = q.get('tilec') ?? '#b8b8b8'; g.lineWidth = Math.max(1, P('tilew', 4) / 2 ** level); g.beginPath();
    for (let k = 1; k < 10; k++) { const u = k * size / 10; g.moveTo(u, 0); g.lineTo(u, size); g.moveTo(0, u); g.lineTo(size, u); } g.stroke(); g.globalAlpha = 1; }
  g.strokeStyle = '#8a8a8a'; g.lineWidth = Math.max(1, 6 / 2 ** level); g.strokeRect(0, 0, size, size);
  if (!TILES) { g.strokeStyle = '#c8c8c8'; g.lineWidth = Math.max(1, 3 / 2 ** level); g.beginPath(); g.moveTo(size / 2, 0); g.lineTo(size / 2, size); g.moveTo(0, size / 2); g.lineTo(size, size / 2); g.stroke(); }
  return c;
}
const slabTex = (() => {
  const levels = []; let size = 1024, level = 0;
  while (size >= 64) { levels.push(slabLevel(size, level)); size /= 2; level++; }
  // below 64 px a level is the one above it scaled down, so far away the floor keeps its average tone
  while (size >= 1) { const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(levels[levels.length - 1], 0, 0, size, size); levels.push(c); size /= 2; }
  const t = new THREE.CanvasTexture(levels[0]); t.mipmaps = levels; t.generateMipmaps = false; t.minFilter = THREE.LinearMipmapLinearFilter;
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(15, 15);
  return t;
})();
const slab = new THREE.Mesh(new THREE.PlaneGeometry(45, 45).rotateX(-Math.PI / 2), toon(parseInt(q.get('slabc') ?? 'ffffff', 16), { map: slabTex }));
slab.position.set(0, 0, FZ - 22.5); slab.receiveShadow = true; scene.add(slab);
const drain = new THREE.Mesh(new THREE.BoxGeometry(45, 0.06, 0.3), toon(0x9a9a9a)); drain.position.set(0, 0.0, FZ - 0.35); scene.add(shadowy(drain));
const curb = new THREE.Mesh(new RoundedBoxGeometry(45, 0.32, 0.3, 2, 0.02), toon(0xd8d8d8)); curb.position.set(0, 0.16, FZ); scene.add(shadowy(curb));

// ---------- the fence: posts every 2 m, top and middle rails, wire mesh (5 cm squares) ----------
const FH = P('fh', 1.5);
const steel = toon(0x7a7f84);
for (let x = -22; x <= 22; x += 2) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, FH + 0.32, 0.07), steel); post.position.set(x, (FH + 0.32) / 2, FZ); scene.add(shadowy(post)); }
// vertical bars, 15 cm apart, between the bottom and top rails
{ const barGeo = new THREE.CylinderGeometry(0.012, 0.012, FH - 0.08, 6), n = Math.floor(44 / 0.15), bars = new THREE.InstancedMesh(barGeo, steel, n), d = new THREE.Object3D();
  for (let i = 0; i < n; i++) { d.position.set(-22 + i * 0.15, 0.36 + (FH - 0.08) / 2, FZ); d.updateMatrix(); bars.setMatrixAt(i, d.matrix); }
  bars.castShadow = true; bars.receiveShadow = true; scene.add(bars); }
for (const y of [0.32 + FH, 0.32 + FH * 0.5, 0.36]) { const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 45, 8).rotateZ(Math.PI / 2), steel); rail.position.set(0, y, FZ - 0.02); scene.add(shadowy(rail)); }

// ---------- the stairwell hut to one side, with its door, lamp, ladder and a tank on top ----------
const hut = new THREE.Group();
const hb = new THREE.Mesh(new RoundedBoxGeometry(3.4, 3.0, 3.2, 2, 0.03), toon(0xe2e2e2)); hb.position.y = 1.5; hut.add(hb);
const door = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.1, 0.06, 2, 0.01), toon(0x8c9196)); door.position.set(0.7, 1.05, -1.62); hut.add(door);
const lampH = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.14, 0.14, 2, 0.02), toon(0xf4f4f4)); lampH.position.set(0.7, 2.4, -1.66); hut.add(lampH);
const canopy = new THREE.Mesh(new RoundedBoxGeometry(1.4, 0.06, 0.6, 2, 0.01), toon(0xb0b0b0)); canopy.position.set(0.7, 2.25, -1.85); hut.add(canopy);
const tankH = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.3, 24), toon(0xd6d6d6)); tankH.position.set(-0.6, 3.75, 0.3); hut.add(tankH);
for (let k = 0; k < 9; k++) { const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.42, 6).rotateZ(Math.PI / 2), steel); rung.position.set(-1.0, 0.4 + k * 0.3, -1.63); hut.add(rung); }
for (const dx of [-1.21, -0.79]) { const side = new THREE.Mesh(new THREE.BoxGeometry(0.035, 3.0, 0.035), steel); side.position.set(dx, 1.6, -1.63); hut.add(side); }
const acu = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.6, 0.35, 2, 0.02), toon(0xcfcfcf)); acu.position.set(1.95, 0.3, -0.8); hut.add(acu);
hut.position.set(P('hx', -7.5), 0, P('hzz', 1.5)); hut.rotation.y = P('hrot', 0) * Math.PI / 180; if (!DRESS2 && q.get('noprops') !== '1') scene.add(shadowy(hut));

if (q.get('dressroof') === '1' && !DRESS2 && q.get('noprops') !== '1') {
  const grey = toon(0xd2d2d2), dark = toon(0x9a9a9a);
  const ac = (x, z, ry) => { const g = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.62, 0.32, 2, 0.02), grey); body.position.y = 0.41; g.add(body);
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24).rotateX(Math.PI / 2), dark); fan.position.set(-0.15, 0.42, -0.17); g.add(fan);
    for (let k = 0; k < 6; k++) { const grille = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.008, 0.01), steel); grille.position.set(-0.15, 0.24 + k * 0.07, -0.18); g.add(grille); }
    for (const dx of [-0.32, 0.32]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.34), dark); leg.position.set(dx, 0.05, 0); g.add(leg); }
    g.position.set(x, 0, z); g.rotation.y = ry; scene.add(shadowy(g)); };
  for (const x of [P('acx', 2.6), P('acx', 2.6) + 1.0, P('acx', 2.6) + 2.0]) ac(x, FZ - 0.9, 0);
  // a water pipe running along the fence on low stands
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 30, 12).rotateZ(Math.PI / 2), grey); pipe.position.set(0, 0.28, FZ - 0.55); scene.add(shadowy(pipe));
  for (let x = -14; x <= 14; x += 1.6) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.14), dark); st.position.set(x, 0.11, FZ - 0.55); scene.add(shadowy(st)); }
  // a vent stack with a cap
  const vent = new THREE.Group(); const vs = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.4, 16), grey); vs.position.y = 0.7; vent.add(vs);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.18, 16), dark); cap.position.y = 1.52; vent.add(cap);
  vent.position.set(P('vx', -2.6), 0, P('vz', 4.6)); scene.add(shadowy(vent));
  // a small practice amp on the floor, where her cable ends
  const amp = new THREE.Group();
  const ab = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.38, 0.24, 3, 0.025), toon(0x8a8a8a)); ab.position.y = 0.19; amp.add(ab);
  const grille = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.24, 0.01, 2, 0.01), toon(0x5e5e5e)); grille.position.set(0, 0.16, -0.122); amp.add(grille);
  for (let k = 0; k < 9; k++) { const sl = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.004, 0.004), toon(0x9a9a9a)); sl.position.set(0, 0.06 + k * 0.025, -0.128); amp.add(sl); }
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.01), toon(0xe0e0e0)); panel.position.set(0, 0.33, -0.122); amp.add(panel);
  for (let k = 0; k < 5; k++) { const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.02, 12).rotateX(Math.PI / 2), toon(0x3a3a3a)); knob.position.set(-0.14 + k * 0.06, 0.33, -0.132); amp.add(knob); }
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 20, Math.PI), toon(0x3a3a3a)); handle.position.set(0, 0.38, 0); amp.add(handle);
  amp.position.set(P('ampx', 0.86), 0, P('ampz', 0.22)); amp.rotation.y = P('amprot', -20) * Math.PI / 180; scene.add(shadowy(amp));
}

let ampJack = null;
if (DRESS2 && q.get('noprops') !== '1') {
  buildHut(scene, { x: P('hx', -4.3), z: P('hzz', 4.6), rot: P('hrot', 0) * Math.PI / 180, steel });
  for (let k = 0; k < 3; k++) buildAC(scene, { x: P('acx', 2.6) + k * 1.0, z: FZ - 0.95, steel });
  if (q.get('vent') === '1') buildVent(scene, { x: P('vx', -2.6), z: P('vz', 4.6), steel });   // off by default: from below it did not read as anything
  // the pipe along the fence on its stands
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 30, 12).rotateZ(Math.PI / 2), toon(0xd2d2d2)); pipe.position.set(0, 0.28, FZ - 0.55); scene.add(shadowy(pipe));
  for (let x = -14; x <= 14; x += 1.6) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.14), toon(0x9a9a9a)); st.position.set(x, 0.11, FZ - 0.55); scene.add(shadowy(st)); }
  ampJack = buildAmp(scene, { x: P('ampx', 0.86), z: P('ampz', 0.22), rot: P('amprot', -20) * Math.PI / 180 }).jack;
}

// ---------- the town: printed blocks, windows as rows of answer bubbles, roof clutter, a few signs ----------
const GROUND = -16;                                         // the school roof stands four storeys up
const facade = (seed) => tex(512, 512, (g, w, h) => {
  // a real facade, one storey per 128 px: framed windows with sashes and sills, floor bands, on some kinds a
  // balcony with railings, air-con boxes, a stair core of narrow slots; a few windows lit (blacked) like a filled bubble
  const r = rng(seed); g.fillStyle = '#f4f4f4'; g.fillRect(0, 0, w, h);
  const kind = Math.floor(r() * 4);
  for (let y = 0; y < h; y += 128) {
    g.fillStyle = '#cfcfcf'; g.fillRect(0, y + 112, w, 16);                       // floor slab edge
    g.strokeStyle = '#9a9a9a'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, y + 112); g.lineTo(w, y + 112); g.stroke();
    if (kind === 0) {             // office: ribbon windows with mullions
      g.fillStyle = '#7d7d7d'; g.fillRect(0, y + 30, w, 62); g.fillStyle = '#b8b8b8';
      for (let x = 0; x < w; x += 64) { g.fillRect(x, y + 30, 6, 62); }
      g.fillStyle = '#e6e6e6'; for (let x = 0; x < w; x += 64) if (r() < 0.35) g.fillRect(x + 8, y + 34, 52, 26);
    } else if (kind === 1) {      // flats: balconies with railings and doors behind, an AC box on some
      for (let x = 0; x < w; x += 128) {
        g.fillStyle = '#8a8a8a'; g.fillRect(x + 18, y + 18, 54, 80); g.fillStyle = '#b5b5b5'; g.fillRect(x + 78, y + 30, 34, 50);
        g.strokeStyle = '#5c5c5c'; g.lineWidth = 3; g.strokeRect(x + 6, y + 72, 116, 40);
        for (let k = x + 12; k < x + 120; k += 10) { g.beginPath(); g.moveTo(k, y + 74); g.lineTo(k, y + 110); g.stroke(); }
        if (r() < 0.5) { g.fillStyle = '#d0d0d0'; g.fillRect(x + 90, y + 86, 26, 20); g.strokeStyle = '#7a7a7a'; g.strokeRect(x + 90, y + 86, 26, 20); }
      }
    } else if (kind === 2) {      // shophouse: punched windows with sills and sashes
      for (let x = 14; x < w; x += 100) {
        g.fillStyle = '#7a7a7a'; g.fillRect(x, y + 26, 64, 60); g.fillStyle = '#c4c4c4'; g.fillRect(x + 30, y + 26, 4, 60); g.fillRect(x, y + 54, 64, 3);
        g.fillStyle = '#d8d8d8'; g.fillRect(x - 4, y + 86, 72, 7); if (r() < 0.25) { g.fillStyle = '#3a3a3a'; g.fillRect(x + 2, y + 28, 60, 56); }
      }
    } else {                      // school / public block: tall windows in pairs, a stair core of slots
      for (let x = 10; x < w - 60; x += 76) { g.fillStyle = '#868686'; g.fillRect(x, y + 20, 26, 78); g.fillRect(x + 32, y + 20, 26, 78); g.fillStyle = '#c9c9c9'; g.fillRect(x, y + 56, 58, 3); }
      g.fillStyle = '#9a9a9a'; for (let k = 0; k < 4; k++) g.fillRect(w - 44, y + 18 + k * 24, 26, 10);
    }
  }
}, [1, 1]);
const nightFacade = (seed) => tex(512, 512, (g, w, h) => {
  const r = rng(seed); g.fillStyle = '#121b20'; g.fillRect(0, 0, w, h);
  const kind = Math.floor(r() * 4), lit = 0.22 + r() * 0.3;
  const win = (x, y, ww, hh) => { const u = r(); g.fillStyle = u < lit ? (r() < 0.82 ? '#efe6cf' : '#6fb6c4') : (u < lit + 0.1 ? '#2e4a52' : '#0b1215'); g.fillRect(x, y, ww, hh); };
  for (let y = 0; y < h; y += 128) {
    g.fillStyle = '#1b282e'; g.fillRect(0, y + 112, w, 16);
    if (kind === 0) { for (let x = 0; x < w; x += 64) win(x + 6, y + 30, 54, 62); }
    else if (kind === 1) { for (let x = 0; x < w; x += 128) { win(x + 18, y + 18, 54, 80); win(x + 78, y + 30, 34, 50); g.strokeStyle = '#26383f'; g.lineWidth = 3; g.strokeRect(x + 6, y + 72, 116, 40); } }
    else if (kind === 2) { for (let x = 14; x < w; x += 100) { win(x, y + 26, 64, 60); g.fillStyle = '#1b282e'; g.fillRect(x + 30, y + 26, 4, 60); } }
    else { for (let x = 10; x < w - 60; x += 76) { win(x, y + 20, 26, 78); win(x + 32, y + 20, 26, 78); } }
  }
}, [1, 1]);
const facades = [0, 1, 2, 3, 4, 5].map(i => (NIGHT ? nightFacade : facade)(30 + i));
const signTex = (text, sub) => tex(1024, 320, (g, w, h) => {
  g.fillStyle = '#f5f3ed'; g.fillRect(0, 0, w, h); g.fillStyle = '#218ea3'; g.fillRect(0, 0, w, 40); g.fillRect(0, h - 40, w, 40);
  g.fillStyle = '#1d7f92'; g.font = '700 150px ZenKakuB'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 - 10);
  if (sub) { g.font = '500 44px ZenKaku'; g.fillText(sub, w / 2, h - 80); }
});
const signs = [signTex('南台ゼミナール', '正解は、ひとつ。'), signTex('全町一斉模試', '申込受付中'), signTex('合格', '偏差値で選ぶ未来')];
const town = new THREE.Group();
const townLights = [];          // night: the lit facades, so the town can black out
let si = 0;
for (let k = 0; k < P('nb', 260); k++) {
  const dist = 60 + Math.pow(R(), 1.4) * 640, ang = (R() - 0.5) * 2.1, x = Math.sin(ang) * dist, z = FZ + Math.cos(ang) * dist;
  const w = 8 + R() * 22, d = 8 + R() * 18;
  const hgt = dist < 160 ? 6 + R() * 12 : 8 + Math.pow(R(), 2.0) * (dist > 300 ? 70 : 40);
  const t = facades[k % facades.length].clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(w / 14)), Math.max(1, hgt / 14));
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, hgt, d), NIGHT ? new THREE.MeshBasicMaterial({ map: t, fog: true }) : toon(0xffffff, { map: t }));
  if (NIGHT) { b.userData.keepColor = true; townLights.push(b.material); }
  b.position.set(x, GROUND + hgt / 2, z); b.rotation.y = (R() - 0.5) * 0.3; town.add(b);
  // roof clutter on the nearer ones: a water tank, an AC box, an antenna
  if (dist < 260) {
    const top = GROUND + hgt;
    if (R() < 0.6) { const tk = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.0, 16), toon(0xdadada)); tk.position.set(x + (R() - 0.5) * w * 0.5, top + 1.0, z + (R() - 0.5) * d * 0.5); town.add(tk); }
    if (R() < 0.7) { const ac = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.6), toon(0xcfcfcf)); ac.position.set(x + (R() - 0.5) * w * 0.5, top + 0.7, z + (R() - 0.5) * d * 0.5); town.add(ac); }
    if (R() < 0.35) { const an = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6, 6), steel); an.position.set(x + (R() - 0.5) * w * 0.4, top + 3, z); town.add(an); }
    if (q.get('signs') === '1' && R() < 0.18 && si < 6) { const sm = [new THREE.MeshBasicMaterial({ map: signs[si % signs.length] }), new THREE.MeshBasicMaterial({ map: signs[si++ % signs.length] })]; townLights.push(...sm); const sg = new THREE.Mesh(new THREE.BoxGeometry(14, 4.4, 0.3), [steel, steel, steel, steel, ...sm]); sg.position.set(x, top + 3.4, z - d / 2 - 0.2); sg.rotation.y = Math.PI; town.add(sg);
      for (const sx2 of [-5, 5]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 0.2), steel); leg.position.set(x + sx2, top + 1.2, z - d / 2); town.add(leg); } }
  }
}
// two pylons and the wires between them
const pylon = (x, z, hgt) => {
  const g = new THREE.Group();
  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, hgt, 0.4), steel); leg.position.set(dx * 0.6, hgt / 2, dz * 0.6); leg.rotation.set(dz * 0.04, 0, -dx * 0.04); g.add(leg); }
  for (const y of [hgt * 0.62, hgt * 0.82, hgt]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 0.4), steel); arm.position.y = y; g.add(arm); }
  for (let y = 4; y < hgt; y += 6) { const br = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 0.2), steel); br.position.y = y; br.rotation.z = (y / 6) % 2 ? 0.6 : -0.6; g.add(br); }
  g.position.set(x, GROUND, z); town.add(g); return g;
};
if (q.get('py') === '1') pylon(P('p1x', 70), FZ + 160, 52), pylon(P('p2x', 150), FZ + 330, 52);
if (q.get('py') === '1') for (const yo of [0.62, 0.82, 1.0]) for (const s of [-8, 8]) {
  const a = new THREE.Vector3(P('p1x', 70) + s, GROUND + 52 * yo, FZ + 160), b = new THREE.Vector3(P('p2x', 150) + s, GROUND + 52 * yo, FZ + 330);
  const pts = []; for (let t = 0; t <= 1.001; t += 0.05) { const p = a.clone().lerp(b, t); p.y -= Math.sin(t * Math.PI) * 6; pts.push(p); }
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.08, 4), steel); town.add(wire);
}
scene.add(town);

// ---------- the sky ----------
const skyMat = new THREE.ShaderMaterial({
  uniforms: { uPaper: { value: new THREE.Color(NIGHT ? HORIZON : PRINT.paper) }, uInk: { value: new THREE.Color(NIGHT ? ZENITH : PRINT.shadowInk) },
    uPitch: { value: PRINT.pitch }, uMis: { value: new THREE.Vector2(...PRINT.mis) },
    e0: { value: P('sky0', 2) }, e1: { value: P('sky1', 48) }, cmax: { value: P('skymax', 0.85) }, gam: { value: P('skyg', 1.1) } },
  vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform vec3 uPaper, uInk; uniform float uPitch, e0, e1, cmax, gam; uniform vec2 uMis; varying vec3 vDir;
    void main(){
      float e = degrees(asin(clamp(normalize(vDir).y, -1.0, 1.0)));
      float cov = cmax * pow(clamp((e - e0) / (e1 - e0), 0.0, 1.0), gam);
      vec2 fc = (gl_FragCoord.xy + uMis) / uPitch;
      vec2 hp = vec2(0.9659 * fc.x - 0.2588 * fc.y, 0.2588 * fc.x + 0.9659 * fc.y);
      // spot function: round dots that grow, touch at half cover, then become round white holes
      float f = -0.5 * (cos(6.28318 * hp.x) + cos(6.28318 * hp.y));
      float t = 1.0 - 2.0 * cov, w = max(fwidth(f) * 0.8, 1e-4);
      float m = cov <= 0.002 ? 0.0 : smoothstep(t - w, t + w, f);
      gl_FragColor = vec4(mix(uPaper, uInk, m), 1.0);
    }`,
  depthWrite: false, depthTest: false, side: THREE.BackSide, fog: false,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(2500, 64, 32), skyMat);
sky.userData.isFx = true; sky.userData.keepColor = true; sky.renderOrder = -10; sky.frustumCulled = false;
if (q.get('sky') !== '0') scene.add(sky);

// ---------- the formation of every card in town, hanging over it ----------
const cols = P('gc', 30), rows = P('gr', 12), cw = P('cw', 6.0), gap = P('gg', 1.0), gz = P('gz', 260), gy = P('gy', 26);
const fronts = [0, 1, 2, 3, 4, 5].map(i => {
  const c = document.createElement('canvas'); c.width = 600; c.height = 400;
  drawCard(c, { id: String(1000 + i * 1373 % 9000), dev: String(40 + i * 7 % 30), seed: 3 + i, serial: `2026-${1000 + i}` });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
});
// backs: the printed rules, blackened in secret with pencil, each in its own hand: angle, pressure, how much
const backs = [...Array(12)].map((_, i) => {
  const c = document.createElement('canvas'); c.width = 600; c.height = 400;
  drawCard(c, { side: 'back', seed: 20 + i });
  const g = c.getContext('2d'), r = rng(9 + i * 31);
  // at night the pencil stops short of the edge: the paper rim still catches the light, so a turned card reads as a
  // card in the dark and not as a hole
  const bi = NIGHT ? P('binset', 18) : 0;
  g.save(); g.beginPath(); g.roundRect(bi, bi, 600 - 2 * bi, 400 - 2 * bi, 18); g.clip(); g.lineCap = 'round'; g.lineJoin = 'round';
  const cover = 0.82 + r() * 0.18, ang = (r() - 0.5) * 2.4, ca = Math.cos(ang), sa = Math.sin(ang), passes = 4 + Math.floor(r() * 3);
  for (let pass = 0; pass < passes; pass++) {
    const a2 = ang + (pass % 2 ? 0.5 + r() * 0.6 : 0), c2 = Math.cos(a2), s2 = Math.sin(a2);
    g.strokeStyle = `rgba(38,38,44,${0.62 + r() * 0.26})`; g.lineWidth = 10 + r() * 12;
    g.beginPath();
    const n = 18 + Math.floor(r() * 18), span = 300 * cover;
    for (let k = 0; k <= n; k++) {
      const t = (k / n) * 2 - 1, yy = t * span + (r() - 0.5) * 20, xl = -380 * cover - r() * 30, xr = 380 * cover + r() * 30;
      const P0 = [xl * c2 - yy * s2 + 300, xl * s2 + yy * c2 + 200], P1 = [xr * c2 - (yy + 20) * s2 + 300, xr * s2 + (yy + 20) * c2 + 200];
      k ? g.lineTo(...(k % 2 ? P1 : P0)) : g.moveTo(...P0); g.lineTo(...(k % 2 ? P0 : P1));
    }
    g.stroke();
  }
  g.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < 700; k++) { g.fillStyle = `rgba(0,0,0,${0.06 + r() * 0.2})`; g.fillRect(r() * 600, r() * 400, 2 + r() * 6, 1 + r() * 2); }
  g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
});
const ch = cw / CARD_RATIO;
const frontGeo = new THREE.PlaneGeometry(cw, ch), backGeo = new THREE.PlaneGeometry(cw, ch).rotateY(Math.PI);
const fm = fronts.map(t => new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, fog: false }));
const bm = backs.map(t => new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, fog: false }));
// at night the card faces are paper catching the town's light, not white screens
if (NIGHT) fm.forEach(m => m.color.set(q.get('ncard') ? NC('ncard') : 0xcfc9b8));
const wcx = P('wcx', (cols - 1) / 2), wcy = P('wcy', 0.2), ww = P('ww', 0.06);
// the flip angle of card (i, j) when the black has spread to radius wr (in formation widths from its centre)
const wave = (i, j, wr) => { const r = Math.hypot((i - (wcxNow ?? wcx)) / cols, (j - (wcyNow ?? wcy) * rows) / cols), t = (wr - r) / ww; return Math.PI * Math.min(1, Math.max(0, 0.5 + t * 0.5)); };
const dummy = new THREE.Object3D();
const fIM = fm.map(m => new THREE.InstancedMesh(frontGeo, m, cols * rows)), bIM = bm.map(m => new THREE.InstancedMesh(backGeo, m, cols * rows));
const cf = fIM.map(() => 0), cb = bIM.map(() => 0), slots = [];
for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
  const k = (i * 7 + j * 3) % fIM.length, kb = (i * 5 + j * 11) % bIM.length;
  slots.push({ i, j, x: (i - (cols - 1) / 2) * (cw + gap), y: gy + j * (ch + gap), k, fi: cf[k]++, kb, bi: cb[kb]++ });
}
const CANOPY = q.get('canopy') === '1' && q.get('wall') !== '1', WALL = q.get('wall') === '1';
let wcxNow = null, wcyNow = null;
// canopy: rows run away from the camera (j = 0 nearest), columns across; the slab tilts up toward the far edge
const cz0 = P('cz0', -1.5), cy0 = P('cy0', 5.0), crise = P('crise', 0.12), cpitch = cw / CARD_RATIO + gap;
const ci0 = P('ci0', (cols - 1) / 2), cj0 = P('cj0', 2.5);      // the card over her head: where the black starts
function poseFormation(wr) {
  for (const sl of slots) {
    if (CANOPY) {
      let r = Math.hypot((sl.i - ci0) / cols, (sl.j - cj0) / cols);
      if (q.get('rq') === '1') r = Math.round(Math.hypot(sl.i - ci0, (sl.j - cj0) * P('rqz', 1)) / P('rqw', 1)) * P('rqw', 1) / cols;   // whole rings, rqw cards wide
      const tt = (wr - r) / ww, a = Math.PI * Math.min(1, Math.max(0, 0.5 + tt * 0.5));
      const zc = cz0 + sl.j * cpitch, yc = cy0 + (zc - cz0) * crise;
      // lying face-down under the slab (front seen from below); flipping turns it over about its long axis
      dummy.position.set(sl.x + P('gx', 0), yc, zc);
      dummy.rotation.set(Math.PI / 2 + Math.atan(crise) + a, 0, (a > 0.05 && a < Math.PI - 0.05) ? (((sl.i + sl.j) % 2) - 0.5) * 0.12 : 0);
    } else {
      const a = wave(sl.i, sl.j, wr);
      dummy.position.set(-sl.x + P('gx', 0), sl.y, gz); dummy.rotation.set(0, Math.PI + a, (!WALL && a > 0.05 && a < Math.PI - 0.05) ? (((sl.i + sl.j) % 2) - 0.5) * 0.1 : 0);
    }
    dummy.updateMatrix();
    fIM[sl.k].setMatrixAt(sl.fi, dummy.matrix); bIM[sl.kb].setMatrixAt(sl.bi, dummy.matrix);
  }
  fIM.forEach(m => { m.instanceMatrix.needsUpdate = true; }); bIM.forEach(m => { m.instanceMatrix.needsUpdate = true; });
}
poseFormation(P('wr', 0.3));
fIM.forEach((m, k) => { m.count = cf[k]; m.userData.keepColor = true; scene.add(m); });
bIM.forEach((m, k) => { m.count = cb[k]; m.userData.keepColor = true; scene.add(m); });

// ---------- her ----------
const cards = [];
let camH = P('ch', 0.9), camD = P('dist', 5.2);
const herZ = P('rz', 0);
function feetX(img) {     // mean x of the opaque pixels in the bottom 3% of rows, as a fraction of the width from the centre
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d');
  g.drawImage(img, 0, 0); const h0 = Math.floor(img.height * 0.97), d = g.getImageData(0, h0, img.width, img.height - h0).data;
  let sx = 0, n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) { sx += ((i - 3) / 4) % img.width; n++; }
  return n ? sx / n / img.width - 0.5 : 0;
}
if (q.get('rin')) {
  const files = q.get('rin').split(','), texs = await Promise.all(files.map(f => loadTex(`/art/cut/${f}.png`)));
  const h0 = texs[0].image.height, rh = P('rh', 1.62), align = (q.get('feetalign') ?? (files.length > 1 ? '1' : '0')) === '1';
  texs.forEach((t, k) => {
    const rhs = (q.get('rhs') ?? '').split(',').map(Number);
    const hk = rhs[k] > 0 ? rhs[k] : rh * t.image.height / h0;       // rhs: a drawing made from another set-up has its own height
    const c = characterCard(t, hk, rig, { lit: 1, castShadow: false, contactW: 0.5, tint: '#f8f6f0', rinPal: P('rinpal', 1) });
    const ct = c.userData.contact; ct.userData.isFx = true; ct.material.color.set(NIGHT ? 0x000000 : 0x218ea3); ct.material.opacity = P('cto', 0.35); ct.scale.set(P('ctw', 0.5), 1, P('ctd', 0.14)); ct.position.set(0, 0.003, P('ctz', -0.02));
    if (k > 0) ct.visible = false;
    const m = c.userData.mesh, wk = m.geometry.parameters.width;
    if (align) m.position.x = -feetX(t.image) * wk;
    const lifts = (q.get('lifts') ?? '').split(',').map(Number), lift = lifts[k] || 0;
    c.position.set(P('rx', 0), lift, herZ); c.rotation.order = 'YXZ'; c.rotation.y = Math.PI; scene.add(c); cards.push(c);
    if (lift) { ct.position.y = 0.003 - lift; ct.scale.multiplyScalar(0.8); ct.material.opacity *= 0.6; }
    // she casts her own shadow into the shadow map, so the floor prints it as the same halftone as everything else
    if (q.get('herShadow') !== '0') { m.castShadow = true; m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: 0.5 }); }
    c.visible = k === 0;
    const huv = (q.get('headuv') ?? '').split(';').filter(Boolean)[k];
    c.userData.headUV = huv ? huv.split(',').map(Number) : [0.5, 0.1];
  });
}
// her head in the world for drawing k (the card plane's origin is the middle of its bottom edge)
function headWorld(k) {
  const c = cards[k], m = c.userData.mesh, [u, v] = c.userData.headUV;
  m.updateMatrixWorld(true);
  return m.localToWorld(new THREE.Vector3((u - 0.5) * m.geometry.parameters.width, (1 - v) * m.geometry.parameters.height, 0));
}
// the card faces the camera along the line of sight to her middle, so the hip-height drawing is not foreshortened twice
const leanCards = () => cards.forEach(c => { c.rotation.x = Math.atan2(P('rh', 1.62) * 0.55 - camH, camD); });
leanCards();
const cables = [];
if (ampJack && cards.length && q.get('cabx')) {
  // every drawing has its own cable end (cabys: one height per drawing, as a fraction of its image), and its own
  // 3D cable from there to the amp's jack, shown together with that drawing
  const cabys = (q.get('cabys') ?? '').split(',').filter(Boolean).map(Number);
  cards.forEach((c, k) => {
    const m = c.userData.mesh; c.updateMatrixWorld(true);
    const gw = m.geometry.parameters.width, gh = m.geometry.parameters.height;
    const cabxs = (q.get('cabxs') ?? '').split(',').filter(Boolean).map(Number);
    const pt = new THREE.Vector3(((cabxs[k] ?? P('cabx', 0)) - 0.5) * gw, (1 - (cabys[k] ?? P('caby', 0.95))) * gh, 0).applyMatrix4(m.matrixWorld);
    pt.y = Math.max(0.008, pt.y);
    const tube = buildCable(scene, pt, ampJack, { plug: k === 0 }); tube.visible = k === 0; cables.push(tube);
  });
}

// ---------- light, camera ----------
rig.sun.position.set(P('sx', -6), P('sy', 9), P('sz', -4)); rig.sun.target.position.set(0, 0, 2); scene.add(rig.sun.target);
const sh = rig.sun.shadow.camera; sh.left = -14; sh.right = 14; sh.top = 14; sh.bottom = -14; sh.near = 0.5; sh.far = 50;
const cam = new THREE.PerspectiveCamera(P('fov', 46), W / H, 0.05, 3000);
let pitchNow = P('pitch', 10), camKeyS = null;
let camX = P('cx', 0), camRoll = P('roll', 0);
function placeCamera() {
  cam.position.set(camX, camH, herZ - camD);
  cam.lookAt(camX + P('lookx', 0), camH + Math.tan(pitchNow * Math.PI / 180) * camD, herZ);
  cam.rotateZ(camRoll * Math.PI / 180);
  const sh = camKeyS ?? P('shift', 0);
  if (sh) cam.setViewOffset(W, H, 0, -sh * H, W, H); else cam.clearViewOffset();
  sky.position.copy(cam.position);
}
placeCamera();

// halo=1: the town's cards hang in the sky behind her in concentric rings round her head, as the camera sees it, and the
// black spreads ring by ring from the centre (a flat grid of thousands of cards seen from below read as a ceiling).
// hd: distance of the rings from the camera; hr0, hdr: first radius and spacing; hn: rings; hb: rings already turned to
// their black backs in the still, hf: how far the next ring has turned.
const HALO = q.get('halo') === '1', VORTEX = q.get('vortex') === '1';
let poseHalo = null, haloItems = [], aimHalo = null, haloRings = 0;
if (HALO && VORTEX) {
  fIM.forEach(m => { m.visible = false; }); bIM.forEach(m => { m.visible = false; });
  const hcw = P('hcw', 1.4), hch = hcw / CARD_RATIO, hFront = new THREE.PlaneGeometry(hcw, hch), hBack = hFront.clone().rotateY(Math.PI);
  haloRings = P('hn', 26);
  // v6 (after the review "a screensaver of tiny bright tiles that outshines her"): fewer and bigger cards, each ring's cards
  // a little bigger than the last (hsz), set unevenly (angular hjt and radial hjr jitter, a roll of up to hroll, a share hskip
  // left out), and darker than her, fading outward (hfall) with a spread of their own (hbr)
  const ringD = [], ringR = [], ringS = [], HR = rng(91);
  for (let k = 0; k < haloRings; k++) {
    const d = P('hd0', 16) * (1 + k * P('hdg', 0.12)), a = P('ha0', 0.05) + k * P('hda', 0.032);
    ringD.push(d); ringR.push(d * Math.tan(Math.min(1.45, a))); ringS.push(1 + k * P('hsz', 0));
    const m = Math.max(8, Math.floor(2 * Math.PI * ringR[k] / (hcw * ringS[k] * (1 + P('hgt', 0.45)))));
    for (let j = 0; j < m; j++) {
      const jt = (HR() - 0.5) * P('hjt', 0), jr = (HR() - 0.5) * P('hjr', 0), roll = (HR() - 0.5) * 2 * P('hroll', 0), skip = HR() < P('hskip', 0);
      const bright = P('hbase', 1) * (1 - P('hfall', 0) * k / Math.max(1, haloRings - 1)) * (1 - P('hbr', 0) * HR());
      if (!skip) haloItems.push({ k, th: (j + (k % 2) * 0.5 + jt) / m * 2 * Math.PI, jr, roll, bright });
    }
  }
  const HF = fm.map(mt => new THREE.InstancedMesh(hFront, mt, haloItems.length)), HB = bm.map(mt => new THREE.InstancedMesh(hBack, mt, haloItems.length));
  const cntF = HF.map(() => 0), cntB = HB.map(() => 0);
  haloItems.forEach((it, i) => { it.f = i % HF.length; it.fi = cntF[it.f]++; it.b = (i * 7) % HB.length; it.bi = cntB[it.b]++; it.jit = ((i * 7919) % 97) / 97; });
  const ic = new THREE.Color();
  haloItems.forEach(it => { ic.setScalar(it.bright ?? 1); HF[it.f].setColorAt(it.fi, ic); HB[it.b].setColorAt(it.bi, ic); });
  HF.forEach((m, k) => { m.count = cntF[k]; m.userData.keepColor = true; m.frustumCulled = false; if (m.instanceColor) m.instanceColor.needsUpdate = true; scene.add(m); });
  HB.forEach((m, k) => { m.count = cntB[k]; m.userData.keepColor = true; m.frustumCulled = false; if (m.instanceColor) m.instanceColor.needsUpdate = true; scene.add(m); });
  const dir = new THREE.Vector3(), n = new THREE.Vector3(), ux = new THREE.Vector3(), uy = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  aimHalo = head => { dir.copy(head).sub(cam.position).normalize(); n.copy(dir).negate(); ux.crossVectors(up, n).normalize(); uy.crossVectors(n, ux).normalize(); };
  const M4 = new THREE.Matrix4(), t = new THREE.Vector3(), r = new THREE.Vector3(), tn = new THREE.Vector3(), nn = new THREE.Vector3(), pp = new THREE.Vector3(), ux2 = new THREE.Vector3(), uy2 = new THREE.Vector3();
  const minSin = Math.sin(P('hmine', 3.5) * Math.PI / 180);
  poseHalo = angleOf => {
    for (const it of haloItems) {
      const c = Math.cos(it.th), sn = Math.sin(it.th);
      r.copy(ux).multiplyScalar(c).addScaledVector(uy, sn);
      t.copy(ux).multiplyScalar(sn).addScaledVector(uy, -c);
      const a = angleOf(it), ca = Math.cos(a), sa = Math.sin(a);
      tn.copy(t).multiplyScalar(ca).addScaledVector(n, sa);
      nn.copy(n).multiplyScalar(ca).addScaledVector(t, -sa);
      pp.copy(cam.position).addScaledVector(dir, ringD[it.k]).addScaledVector(r, ringR[it.k] * (1 + (it.jr ?? 0) * (ringR[1] - ringR[0] || 1) / Math.max(1, ringR[it.k])));
      // the card's own roll about its face normal, and the ring's card size
      const sz = ringS[it.k], cr = Math.cos(it.roll ?? 0), sr = Math.sin(it.roll ?? 0);
      ux2.copy(tn).multiplyScalar(cr).addScaledVector(r, sr).multiplyScalar(sz); uy2.copy(r).multiplyScalar(cr).addScaledVector(tn, -sr).multiplyScalar(sz);
      M4.makeBasis(ux2, uy2, nn); M4.setPosition(pp);
      const el = (pp.y - cam.position.y) / pp.distanceTo(cam.position);
      if (el < minSin || pp.y < P('hymin', 2)) M4.makeScale(0, 0, 0);      // nothing below the skyline
      HF[it.f].setMatrixAt(it.fi, M4); HB[it.b].setMatrixAt(it.bi, M4);
    }
    HF.forEach(m => { m.instanceMatrix.needsUpdate = true; }); HB.forEach(m => { m.instanceMatrix.needsUpdate = true; });
  };
  if (cards.length) aimHalo(headWorld(0)); else aimHalo(new THREE.Vector3(P('rx', 0), P('rh', 1.62) * 0.9, herZ));
  const hb = P('hb', 6), hf = P('hf', 0.5);
  poseHalo(it => it.k < hb ? Math.PI : it.k === hb ? Math.PI * Math.min(1, Math.max(0, hf * 1.5 - it.jit * 0.5)) : 0);
} else if (HALO) {
  fIM.forEach(m => { m.visible = false; }); bIM.forEach(m => { m.visible = false; });
  const head = new THREE.Vector3(P('rx', 0), P('rh', 1.62) * P('hcy', 0.9), herZ);
  const dir = head.clone().sub(cam.position).normalize();
  const C = cam.position.clone().add(dir.clone().multiplyScalar(P('hd', 70)));
  const n = dir.clone().negate();
  const ux = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), n).normalize(), uy = new THREE.Vector3().crossVectors(n, ux).normalize();
  const hcw = P('hcw', 1.6), hch = hcw / CARD_RATIO, gapT = P('hgt', 0.5);
  const hFront = new THREE.PlaneGeometry(hcw, hch), hBack = hFront.clone().rotateY(Math.PI);
  for (let k = 0; k < P('hn', 44); k++) {
    const R = P('hr0', 2.4) + k * P('hdr', 1.9), m = Math.max(6, Math.floor(2 * Math.PI * R / (hcw + gapT)));
    for (let j = 0; j < m; j++) haloItems.push({ k, th: (j + (k % 2) * 0.5) / m * 2 * Math.PI, R });
  }
  const HF = fm.map(mt => new THREE.InstancedMesh(hFront, mt, haloItems.length)), HB = bm.map(mt => new THREE.InstancedMesh(hBack, mt, haloItems.length));
  const cntF = HF.map(() => 0), cntB = HB.map(() => 0);
  haloItems.forEach((it, i) => { it.f = i % HF.length; it.fi = cntF[it.f]++; it.b = (i * 7) % HB.length; it.bi = cntB[it.b]++; it.jit = ((i * 7919) % 97) / 97; });
  HF.forEach((m, k) => { m.count = cntF[k]; m.userData.keepColor = true; m.frustumCulled = false; scene.add(m); });
  HB.forEach((m, k) => { m.count = cntB[k]; m.userData.keepColor = true; m.frustumCulled = false; scene.add(m); });
  const M4 = new THREE.Matrix4(), t = new THREE.Vector3(), r = new THREE.Vector3(), tn = new THREE.Vector3(), nn = new THREE.Vector3(), pp = new THREE.Vector3();
  poseHalo = angleOf => {
    for (const it of haloItems) {
      const c = Math.cos(it.th), sn = Math.sin(it.th);
      r.copy(ux).multiplyScalar(c).addScaledVector(uy, sn);              // radial
      t.copy(ux).multiplyScalar(sn).addScaledVector(uy, -c);             // tangent (t x r = n, a right-handed basis)
      const a = angleOf(it), ca = Math.cos(a), sa = Math.sin(a);
      tn.copy(t).multiplyScalar(ca).addScaledVector(n, sa);              // the card turns over about its radial axis
      nn.copy(n).multiplyScalar(ca).addScaledVector(t, -sa);
      pp.copy(C).addScaledVector(r, it.R);
      M4.makeBasis(tn, r, nn); M4.setPosition(pp);
      if (pp.y < P('hymin', 6)) M4.makeScale(0, 0, 0);     // the rings stop at the skyline: no card among the town's buildings
      HF[it.f].setMatrixAt(it.fi, M4); HB[it.b].setMatrixAt(it.bi, M4);
    }
    HF.forEach(m => { m.instanceMatrix.needsUpdate = true; }); HB.forEach(m => { m.instanceMatrix.needsUpdate = true; });
  };
  const hb = P('hb', 6), hf = P('hf', 0.5);
  poseHalo(it => it.k < hb ? Math.PI : it.k === hb ? Math.PI * Math.min(1, Math.max(0, hf * 1.5 - it.jit * 0.5)) : 0);
}
scene.fog = new THREE.Fog(NIGHT ? HORIZON : 0xf5f3ed, P('f0', 120), P('f1', 700));
// ndim: at night every lit prop (not the cards, not the town's lit facades, not her) is darkened, so it prints a tier lower
if (NIGHT && P('ndim', 1) !== 1) scene.traverse(o => { if (!o.isMesh || o.userData.keepColor || o.userData.isCard || o.userData.isFx) return;
  for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m && m.color && !m.userData.dimmed) { m.color.multiplyScalar(P('ndim', 1)); m.userData.dimmed = true; } });
const tr = new ToonRenderer(canvas, W, H, 2);
const draw = () => tr.render(scene, cam, { lineW: P('lw', 2.6), dof: { focus: 5, aperture: 0, maxR: 6 }, print: { wNear: P('wn', 5) } });
if (q.get('seq') !== '1') { draw(); if (q.get('clipscan') === '1') tr.clipScan(scene, cam, P('gap', 0.1)); }

// ---------- animation (seq=1): the interlude, 1:38.13-1:49.98, eight bars of the riff ----------
// one ring of cards flips to its blackened back on every beat (her downstroke), so the black spreads out from
// behind her ring by ring; she changes drawing on the beat, each drawing held at least two beats, never
// going straight back to the one before; the camera eases in a little over the eight bars.
const BEAT = 60 / P('bpm', 162), T0 = P('t0', 98.13), T1 = P('t1', 109.98), LEAD = 1 / 30;
const sched = (q.get('psched') ?? '0:8').split(',').map(x => x.split(':').map(Number));     // drawing:beats
function drawingAt(beat) {
  if (q.get('ptl')) { let k = 0; for (const [b0, kk] of q.get('ptl').split(',').map(x => x.split(':').map(Number))) if (beat >= b0) k = kk; return k; }
  let acc = 0; for (const [k, n] of sched) { acc += n; if (beat < acc) return k; } return sched[sched.length - 1][0];
}
// rkeys=beat:rings,...: how many rings have been reached by that beat (piecewise linear), so the black goes out in
// waves on the hits instead of one ring per beat; ringBeat(k) is the beat ring k starts to turn
const RKEYS = q.get('rkeys') ? q.get('rkeys').split(',').map(x => x.split(':').map(Number)) : null;
function ringsAt(b) {
  if (!RKEYS) return 0;
  if (b <= RKEYS[0][0]) return RKEYS[0][1];
  for (let i = 0; i + 1 < RKEYS.length; i++) { const [b0, r0] = RKEYS[i], [b1, r1] = RKEYS[i + 1]; if (b >= b0 && b < b1) return r0 + (b - b0) / (b1 - b0) * (r1 - r0); }
  return RKEYS[RKEYS.length - 1][1];
}
let headEase = null;
function ringBeat(k) {
  for (let i = 0; i + 1 < RKEYS.length; i++) { const [b0, r0] = RKEYS[i], [b1, r1] = RKEYS[i + 1]; if (k >= r0 && k < r1) return b0 + (k - r0) / (r1 - r0) * (b1 - b0); }
  return k < RKEYS[0][1] ? RKEYS[0][0] : Infinity;
}
// hits=beat:amount,...: the lens punches in on a hit and springs back (fov narrows by amount, decays in ptau s);
// shk: degrees of handheld shake, a new kick every eighth note, louder for a beat after each crash (crash=beat,...)
const HITS = q.get('hits') ? q.get('hits').split(',').map(x => x.split(':').map(Number)) : [];
const CRASH = q.get('crash') ? q.get('crash').split(',').map(Number) : [];
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function lensAt(b) {
  let pn = 0; for (const [hb, a] of HITS) { const dt = (b - hb) * BEAT; if (dt >= 0) pn += a * Math.exp(-dt / P('ptau', 0.11)); }
  const e = Math.floor(b * 2), fe = b * 2 - e, boost = CRASH.some(cb => b >= cb && b < cb + 1) ? P('shkc', 2.5) : 1;
  const crashOn = CRASH.some(cb => b >= cb && b < cb + 1);
  const amp = (P('shk', 0) * boost + (crashOn ? P('shkcr', 0) : 0)) * Math.exp(-fe * 3) * Math.PI / 180;
  return { punch: Math.min(0.4, pn), yaw: (hash(e) - 0.5) * 2 * amp, pitch: (hash(e + 0.5) - 0.5) * 2 * amp, roll: (hash(e + 0.25) - 0.5) * 2 * amp * 0.6 };
}
const ease = f => 1 - Math.pow(1 - Math.min(1, Math.max(0, f)), 3);
const smooth = f => { f = Math.min(1, Math.max(0, f)); return f * f * (3 - 2 * f); };
// ringbeat: ring rho (whole rings of cards round the card over her head, rq=1) turns over on beat rb0 + rho * rstep,
// each card in about flipdur seconds with a few hundredths of a second of its own delay, so a ring goes over together
const RB = q.get('ringbeat') === '1';
const ringOf = sl => Math.round(Math.hypot(sl.i - ci0, (sl.j - cj0) * P('rqz', 1)) / P('rqw', 1));
const jit = slots.map((sl, i) => ((i * 7919) % 97) / 97);
function poseRingsAt(bt) {
  slots.forEach((sl, idx) => {
    const start = P('rb0', 0) + ringOf(sl) * P('rstep', 2), f = (bt - start) * BEAT / P('flipdur', 0.18) - jit[idx] * P('rjit', 0.25);
    const a = Math.PI * ease(f);
    const zc = cz0 + sl.j * cpitch, yc = cy0 + (zc - cz0) * crise;
    dummy.position.set(sl.x + P('gx', 0), yc, zc);
    dummy.rotation.set(Math.PI / 2 + Math.atan(crise) + a, 0, (a > 0.05 && a < Math.PI - 0.05) ? (((sl.i + sl.j) % 2) - 0.5) * 0.12 : 0);
    dummy.updateMatrix(); fIM[sl.k].setMatrixAt(sl.fi, dummy.matrix); bIM[sl.kb].setMatrixAt(sl.bi, dummy.matrix);
  });
  fIM.forEach(m => { m.instanceMatrix.needsUpdate = true; }); bIM.forEach(m => { m.instanceMatrix.needsUpdate = true; });
}
let haloPose = null, camKeyH = null, camKeyP = null, shotNow = -1, haloShot = -2;
window.renderAt = async (t) => {
  const b = (t + LEAD - T0) / BEAT, n = Math.floor(b), fr = b - n;
  if (RB && HALO) { const ease3 = f => 1 - Math.pow(1 - Math.min(1, Math.max(0, f)), 3);
    // one ring per beat at first, then (from ring raccel on) two per beat, so the whole sky is black before the end
    const RA = P('raccel', 16), kb = k => RKEYS ? ringBeat(k) : (k < RA ? k : RA + (k - RA) * 0.5);
    haloPose = it => Math.PI * ease3((b - (RKEYS ? kb(it.k) : P('rb0', 0) + kb(it.k) * P('rstep', 1))) * BEAT / P('flipdur', 0.18) - it.jit * P('rjit', 0.25));
    if (!VORTEX) poseHalo(haloPose); }
  else if (RB && CANOPY) poseRingsAt(b);
  else if (WALL && RKEYS) poseFormation(P('wr0', -0.01) + P('wring', 0.03) * ringsAt(b));
  else {
    // the black: each beat a ring flips over in about a fifth of a second, then holds
    const flip = Math.min(1, fr * BEAT / P('flipdur', 0.2));
    poseFormation(P('wr0', -0.02) + P('wstep', 0.021) * (Math.max(0, n) + (b >= 0 ? ease(flip) : 0)));
  }
  const k = Math.min(cards.length - 1, drawingAt(Math.max(0, b)));
  cards.forEach((c, i) => { c.visible = i === k; });
  cables.forEach((cb, i) => { cb.visible = i === k; });
  const u = smooth((t - T0) / (T1 - T0));
  camD = P('dist', 2.6) + (P('dist1', P('dist', 2.6)) - P('dist', 2.6)) * u;
  if (q.get('camkeys')) {
    const ks = q.get('camkeys').split('|').map(x => x.split(':'));
    let i = 0; for (let j = 0; j < ks.length; j++) if (b >= +ks[j][0]) i = j;
    shotNow = i;
    const b0 = +ks[i][0], b1 = i + 1 < ks.length ? +ks[i + 1][0] : (T1 - T0) / BEAT, f = Math.min(1, Math.max(0, (b - b0) / (b1 - b0)));
    const lerp = (str, e) => { const [a0, a1] = str.split('>').map(Number); return a0 + ((a1 ?? a0) - a0) * e; };
    const e = 1 - Math.pow(1 - f, 2);
    camD = lerp(ks[i][1], e); camX = lerp(ks[i][2], e); camRoll = lerp(ks[i][3], e);
    camKeyH = ks[i][4] ? lerp(ks[i][4], e) : null; camKeyP = ks[i][5] ? lerp(ks[i][5], ks[i][6] === 'lin' ? f : e) : null;
    camKeyS = ks[i][7] ? lerp(ks[i][7], e) : null;
  }
  camH = camKeyH ?? (P('ch', 0.62) + (P('ch1', P('ch', 0.62)) - P('ch', 0.62)) * u);
  pitchNow = camKeyP ?? (P('pitch', 9.2) + (P('pitch1', P('pitch', 9.2)) - P('pitch', 9.2)) * u);
  placeCamera(); leanCards();
  // blackout=beat: from that beat the town's windows go out in a quarter of a second
  if (NIGHT && q.get('blackout')) {
    const k = Math.min(1, Math.max(0, (b - P('blackout', 31)) * BEAT / P('bodur', 0.25)));
    townLights.forEach(m => m.color.setScalar(1 - 0.995 * k));
  }
  // on a crash every card still showing its face flares up to paper white and settles back (the town's light pulsing)
  if (NIGHT && CRASH.length) {
    let k = 0; for (const cb of CRASH) { const dt = (b - cb) * BEAT; if (dt >= -1 / 30) k += Math.exp(-Math.max(0, dt) / P('flare', 0.28)); }
    const base = new THREE.Color(q.get('ncard') ? NC('ncard') : 0xcfc9b8), white = new THREE.Color(0xfffdf6);
    fm.forEach(m => m.color.copy(base).lerp(white, Math.min(1, k)));
  }
  if (WALL && cards.length && shotNow !== haloShot) {
    const hw = headWorld(k), d = hw.clone().sub(cam.position), tz = (gz - cam.position.z) / d.z, X = cam.position.x + d.x * tz, Y = cam.position.y + d.y * tz;
    wcxNow = (P('gx', 0) - X) / (cw + gap) + (cols - 1) / 2; wcyNow = (Y - gy) / (ch + gap) / rows; haloShot = shotNow;
    poseFormation(P('wr0', -0.01) + P('wring', 0.03) * ringsAt(b));
  }
  if (VORTEX && aimHalo) {
    if (cards.length) {
      // the rings are aimed at her head once, on the first frame of each shot, and then stay where they are in the sky:
      // a sky that slides after every change of pose is the "background always moving" the owner rejected.
      // hfollow=1 brings back the old behaviour (re-aimed every frame at the eased head).
      const target = headWorld(k);
      if (q.get('hfollow') === '1') {
        if (!headEase) headEase = target.clone(); else headEase.lerp(target, 1 - Math.exp(-(1 / 30) / P('hease', 0.09)));
        aimHalo(headEase);
      } else if (shotNow !== haloShot) { aimHalo(target); haloShot = shotNow; }
    } else {
      // a plate without her (for a close-up composited on top): the centre goes where the close-up puts her head,
      // straight ahead raised by haimy metres at 20 m
      const f = new THREE.Vector3(); cam.getWorldDirection(f);
      aimHalo(cam.position.clone().addScaledVector(f, 20).add(new THREE.Vector3(0, P('haimy', 0), 0)));
    }
    if (haloPose) poseHalo(haloPose);           // the rings are posed after the camera and her head are known
  }
  if (NIGHT && RKEYS) {
    const pr = Math.min(1, ringsAt(b) / Math.max(1, haloRings || P('hn', 44))), kd = 1 - P('skydark', 0.8) * pr;
    skyMat.uniforms.uPaper.value.setHex(HORIZON).multiplyScalar(kd); skyMat.uniforms.uInk.value.setHex(ZENITH).multiplyScalar(Math.max(0.3, kd));
  }
  const L = lensAt(b);
  cam.fov = P('fov', 46) * (1 - L.punch); cam.updateProjectionMatrix();
  cam.rotateY(L.yaw); cam.rotateX(L.pitch); cam.rotateZ(L.roll);
  draw();
};
window.__info = { cards: cards.length };
window.__ready = true;
