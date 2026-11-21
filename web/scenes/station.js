// Station concourse with a bank of automatic ticket gates (style frame: the gate that will not read her).
// People walk from the entry side (+z) toward the exit side (-z), where the camera stands, level
// at eye height: the character drawings are front views at eye level.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon, makeLights, characterCard, ToonRenderer, loadTex, PRINT, negBasic } from '../lib/toon.js';
import { gateMaterials, gateBank, setFlaps, setFlap } from '../lib/gate.js';
import { loadCardFonts } from '../lib/card.js';
import { ticketMachines, poster, exitOpening, STYLE } from '../lib/concourse.js';
import { answerSheetWall, tiledWall, tactileStrip } from '../lib/hall_print.js';

const q = new URLSearchParams(location.search);
const P = (k, v) => +(q.get(k) ?? v);
// print=1: the town printed in teal on paper (see toon.js PRINT); only she keeps her colours
const PRINTMODE = q.get('print') === '1';
const SEQ = q.get('seq') === '1';          // animation: render_seq.mjs calls window.renderAt(t)
const BEAM = q.get('beam') === '1';
if (q.get('shink')) PRINT.shadowInk = parseInt(q.get('shink'), 16);
if (q.get('line')) PRINT.line = parseInt(q.get('line'), 16);
if (q.get('cover')) PRINT.cover = +q.get('cover');
if (q.get('spitch')) PRINT.pitch = +q.get('spitch');   // the shadow screen's ruling (px in the 2x buffer)
STYLE.print = PRINTMODE;
const NEG = PRINTMODE && q.get('neg') === '1';
const NEG_BASE = parseInt(q.get('nbase') ?? '232327', 16), NEG_LIGHT = parseInt(q.get('nlight') ?? '9fd4de', 16);
if (NEG) {
  const { rng } = await import('../lib/card.js');
  const S = 2048, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, S, S); g.lineCap = 'round';
  const R = rng(31);
  // patches of strokes laid side by side, the way a hand fills a large area with a pencil; each patch its
  // own angle, length and pressure; drawn with wrap-around so the texture tiles without a seam
  for (let pch = 0; pch < P('gpatch', 170); pch++) {
    const cx = R() * S, cy = R() * S, ang = -0.75 + (R() - 0.5) * 1.0, len = 140 + R() * 300, n = 12 + Math.floor(R() * 26), gap = 4.5 + R() * 5;
    const ca = Math.cos(ang), sa = Math.sin(ang), a = 0.1 + R() * 0.22, lw = 1.4 + R() * 2.4;
    const strokes = [];
    for (let k = 0; k < n; k++) { const off = (k - n / 2) * gap; strokes.push([off, (R() - 0.5) * 10, (R() - 0.5) * 10, 0.75 + R() * 0.35]); }
    for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) {
      g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = lw;
      for (const [off, j1, j2, lf] of strokes) {
        const x0 = cx + dx - ca * len / 2 - sa * off, y0 = cy + dy - sa * len / 2 + ca * off;
        g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + ca * len / 2 + j1, y0 + sa * len / 2 + j2, x0 + ca * len * lf, y0 + sa * len * lf); g.stroke();
      }
    }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  PRINT.neg = 1; PRINT.graph = t; PRINT.paper = NEG_BASE; PRINT.shadowInk = parseInt(q.get('nshadow') ?? '121215', 16);
  PRINT.sheen = parseInt(q.get('nsheen') ?? '3b3b41', 16); PRINT.line = parseInt(q.get('nline') ?? '8fcbd6', 16);
}
const W = 1920, H = 1080;

// when each character of a lyric is sung, from the one timed table (tools/lyric_times.py -> work/audio/lyrics_timed.json).
// lwin=t0-t1 picks the sung line in that window. Times are never typed into a query by hand.
async function sungTimes(text, win) {
  const [t0, t1] = (win || '0-999').split('-').map(Number);
  const lines = await (await fetch('/work/audio/lyrics_timed.json')).json();
  for (const l of lines) {
    if (l.end < t0 || l.start > t1 || !l.text.includes(text)) continue;
    const i0 = l.text.indexOf(text); return l.chars.slice(i0, i0 + text.length).map(c => c.t);
  }
  throw new Error('lyric not in table: ' + text);
}
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
const BG = 0xe9e7e1;
scene.background = new THREE.Color(BG);
const rig = makeLights(scene, { amb: [P('a0', 0.80), P('a1', 0.81), P('a2', 0.83)], sun: [0.2, 0.2, 0.19] });
const M = gateMaterials();
if (q.get('flap')) M.flap.color.set('#' + q.get('flap'));

// ---------- floor: pale terrazzo tiles with a darker band of tactile paving before the gates ----------
function floorTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 2048; const g = c.getContext('2d');
  if (PRINTMODE) {      // printed: paper, and the tile joints as a grid of thin lines
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 2048, 2048); g.strokeStyle = '#6f6f6f'; g.lineWidth = 5;
    for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 512, 0); g.lineTo(i * 512, 2048); g.stroke(); g.beginPath(); g.moveTo(0, i * 512); g.lineTo(2048, i * 512); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(20, 20); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
  }
  g.fillStyle = q.get('floor') ? '#' + q.get('floor') : '#d7d6d1'; g.fillRect(0, 0, 2048, 2048);
  let s = 7; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 16000; i++) { g.fillStyle = R() < 0.5 ? 'rgba(120,120,125,0.18)' : 'rgba(255,255,255,0.35)'; g.fillRect(R() * 2048, R() * 2048, 2 + R() * 3, 2 + R() * 3); }
  g.strokeStyle = 'rgba(110,110,115,0.45)'; g.lineWidth = 3;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 512, 0); g.lineTo(i * 512, 2048); g.stroke(); g.beginPath(); g.moveTo(0, i * 512); g.lineTo(2048, i * 512); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(20, 20); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  return t;
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(48, 48).rotateX(-Math.PI / 2), toon(0xffffff, { map: floorTexture() }));
floor.receiveShadow = true; scene.add(floor);

// ---------- gate bank ----------
const N = 5;
const bank = gateBank(M, N);
scene.add(bank);
const pitch = bank.userData.pitch;
bank.userData.cabs.forEach((c, i) => setFlaps(c, 1));
// the aisle she is in: both flaps shut across it
const HER = 2;
setFlaps(bank.userData.cabs[HER], 0); setFlaps(bank.userData.cabs[HER + 1], 0);
// the two flaps of the other cabinets that face her aisle must stay closed; the others open
for (const p of bank.userData.cabs[HER].userData.flaps) setFlap(p, p.userData.side > 0 ? 0 : 1);
for (const p of bank.userData.cabs[HER + 1].userData.flaps) setFlap(p, p.userData.side < 0 ? 0 : 1);
// shutflap=hex: her two shut flaps in their own colour, so the barrier across her aisle reads at a glance
if (q.get('shutflap')) {
  let shutM = toon(parseInt(q.get('shutflap'), 16));
  if (q.get('shutx') === '1') {
    const c = document.createElement('canvas'); c.width = 270; c.height = 360; const x = c.getContext('2d');
    x.fillStyle = '#f2f1ec'; x.fillRect(0, 0, 270, 360); x.strokeStyle = '#218ea3'; x.lineWidth = 18; x.strokeRect(9, 9, 252, 342);
    x.strokeStyle = '#17171b'; x.lineWidth = 40; x.lineCap = 'butt'; x.beginPath(); x.moveTo(60, 95); x.lineTo(210, 265); x.moveTo(210, 95); x.lineTo(60, 265); x.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1 / 0.27, 1 / 0.36);
    t.anisotropy = 16;
    // the printed face only on the flap's two faces (extrude group 0); its rim (group 1) is plain teal
    shutM = [new THREE.MeshBasicMaterial({ map: t }), new THREE.MeshBasicMaterial({ color: 0x218ea3 })];
  }
  for (const [ci, side] of [[HER, 1], [HER + 1, -1]]) for (const p of bank.userData.cabs[ci].userData.flaps) if (p.userData.side === side) p.traverse(o => { if (o.isMesh) o.material = shutM; });
}
const aisleX = i => (i - (N - 1) / 2) * pitch;
// tactile paving strips leading into and out of every aisle
if (PRINTMODE) for (let i = 0; i < N; i++) for (const zc of [1.75, -1.75]) { const t = tactileStrip(1.3); t.position.set(aisleX(i), 0.004, zc); scene.add(t); }
// exit-end indicators facing the camera: a teal arrow on open aisles; on hers, a black cross and the
// machine's dot-matrix line. Aisle i is between cabinets i and i+1; its indicator sits on cabinet i+1's
// exit end (the cabinet on the walker's left as they come out = screen left from the camera? no: screen
// right). Both cabinets of her aisle show the refusal.
function indicatorTex(kind) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 400; const g = c.getContext('2d');
  g.fillStyle = '#2f3438'; g.fillRect(0, 0, 512, 400);
  if (kind === 'ok') {
    g.fillStyle = '#eef0ec'; g.fillRect(0, 0, 512, 400);
    g.fillStyle = '#218ea3'; g.beginPath(); g.moveTo(256, 60); g.lineTo(400, 230); g.lineTo(310, 230); g.lineTo(310, 340); g.lineTo(202, 340); g.lineTo(202, 230); g.lineTo(112, 230); g.closePath(); g.fill();
  } else {
    g.fillStyle = '#f2f1ec'; g.fillRect(0, 0, 512, 400);
    g.strokeStyle = '#17171b'; g.lineWidth = 46; g.lineCap = 'square';
    g.beginPath(); g.moveTo(150, 90); g.lineTo(362, 310); g.moveTo(362, 90); g.lineTo(150, 310); g.stroke();

  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const okTex = indicatorTex('ok');
let ngTex = indicatorTex('ng');
// ngind=text: her aisle's display prints the machine's verdict in dot matrix instead of a cross
if (q.get('ngind') === 'text') {
  const { inkjetText } = await import('../lib/card.js');
  const c = document.createElement('canvas'); c.width = 512; c.height = 400; const g = c.getContext('2d');
  g.fillStyle = '#24282b'; g.fillRect(0, 0, 512, 400);
  inkjetText(g, '読み取れ', 256, 128, { size: 118, font: 'ZenKakuB', weight: 700, align: 'center', color: [238, 236, 228], seed: 31, pitch: 7 });
  inkjetText(g, 'ません', 256, 272, { size: 118, font: 'ZenKakuB', weight: 700, align: 'center', color: [238, 236, 228], seed: 32, pitch: 7 });
  ngTex = new THREE.CanvasTexture(c); ngTex.colorSpace = THREE.SRGBColorSpace; ngTex.anisotropy = 16;
}
bank.userData.cabs.forEach((c, i) => {
  const s = c.userData.exitScreen; const her = i === HER || i === HER + 1;
  s.material = (q.get('screens') === 'off' || (her && q.get('ngind') === 'blank')) ? new THREE.MeshBasicMaterial({ color: 0x24282b }) : new THREE.MeshBasicMaterial({ map: her ? ngTex : okTex });
});
if (q.get('allopen') === '1') bank.userData.cabs.forEach(c => setFlaps(c, 1));

// staffed booth at the left end of the bank
const booth = new THREE.Group();
const boothBody = new THREE.Mesh(new RoundedBoxGeometry(1.6, 2.3, 2.4, 3, 0.04), toon(0xcfd2d4)); boothBody.position.y = 1.15; booth.add(boothBody);
const win = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 1.6), toon(0x7d8c92)); win.position.set(0.81, 1.45, 0); booth.add(win);
const counter = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.05, 1.8, 2, 0.015), toon(0xe8e7e2)); counter.position.set(0.92, 1.0, 0); booth.add(counter);
booth.position.set(aisleX(0) - pitch / 2 - 0.12 - 0.8 - 0.3, 0, 0.2); scene.add(booth);
booth.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

// ---------- columns, back wall with the station name board and fare chart, ceiling ----------
const col = (x, z) => { const m = new THREE.Mesh(new RoundedBoxGeometry(0.8, 3.6, 0.8, 2, 0.02), toon(0xe2e1dc)); m.position.set(x, 1.8, z); m.castShadow = m.receiveShadow = true; scene.add(m); return m; };
col(-4.6, 4.2); col(4.6, 4.2); col(-4.6, 9.5); col(4.6, 9.5);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 3.6), toon(0xe6e4dd)); wall.position.set(0, 1.8, 12); wall.rotation.y = Math.PI; scene.add(wall);
wall.material.userData.flatPrint = !BEAM;
// side walls, so a camera turned off the axis still sees the concourse end in a wall
const sideWalls = [];
// beam=1: morning sun comes in low through the south exit and lays a door-shaped patch of light across
// the hall; everything outside it is in the shadow screen. The south wall then needs a real opening.
for (const sx of [-1, 1]) {
  if (BEAM && sx === 1) {
    // the wall at x = 8.5 in pieces round the exit opening (z 7.0-11.2, up to 2.6 m), casting shadows
    const z0 = P('exz', 9.1) - 2.1, z1 = P('exz', 9.1) + 2.1, mk = (zA, zB, yA, yB) => {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(zB - zA, yB - yA), toon(0xe3e1da)); w.castShadow = true; w.receiveShadow = true;
      w.position.set(8.5, (yA + yB) / 2, (zA + zB) / 2); w.rotation.y = -Math.PI / 2; w.material.side = THREE.DoubleSide; scene.add(w); sideWalls.push(w); };
    mk(-15, z0, 0, 3.6); mk(z1, 15, 0, 3.6); mk(z0, z1, 2.6, 3.6);
    continue;
  }
  const sw = new THREE.Mesh(new THREE.PlaneGeometry(30, 3.6), toon(0xe3e1da)); sw.material.userData.flatPrint = !BEAM; sw.position.set(sx * 8.5, 1.8, 0); sw.rotation.y = -sx * Math.PI / 2; scene.add(sw); sideWalls.push(sw);
}
// print mode: the back wall is printed as a giant answer sheet, the side walls with tile joints
if (PRINTMODE) {
  wall.material.color.set(0xffffff); wall.material.map = answerSheetWall(30, 3.6); wall.material.needsUpdate = true;
  for (const sw of sideWalls) { sw.material.color.set(0xffffff); sw.material.map = tiledWall(30, 3.6); sw.material.needsUpdate = true; }
}
const ceil = new THREE.Mesh(new THREE.PlaneGeometry(30, 30).rotateX(Math.PI / 2), toon(0xdcdbd6)); ceil.position.y = 3.6; scene.add(ceil);
ceil.material.userData.flatPrint = true;
for (let z = -4; z <= 11; z += 2.5) for (const x of [-2.6, 0, 2.6]) {
  const l = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.03, 0.22), new THREE.MeshBasicMaterial({ color: 0xffffff })); l.position.set(x, 3.585, z); scene.add(l);
}
function boardTexture(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; }
// station name board hanging above the gates (fictional station)
const nameTex = boardTexture(2048, 512, (g, w, h) => {
  g.fillStyle = '#f7f6f2'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#218ea3'; g.fillRect(0, h * 0.78, w, h * 0.08);
  g.fillStyle = '#2b2b30'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 190px ZenKakuB'; g.fillText('南台', w / 2, h * 0.38);
  g.font = '500 64px ZenKaku'; g.fillText('Minamidai', w / 2, h * 0.66);
  g.font = '500 52px ZenKaku'; g.textAlign = 'left'; g.fillText('← 北口', 60, h * 0.38); g.textAlign = 'right'; g.fillText('南口 →', w - 60, h * 0.38);
});
const nameBoard = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshBasicMaterial({ map: nameTex }));
nameBoard.position.set(P('nbx', 0), P('nby', 3.05), P('nbz', 8.6)); nameBoard.scale.setScalar(P('nbs', 0.8)); nameBoard.rotation.y = Math.PI; scene.add(nameBoard);
// fare chart on the back wall: a route map and columns of small fares
const fareTex = boardTexture(2048, 1024, (g, w, h) => {
  // a route map: stations sit on the lines, each with its name and the fare from here
  g.fillStyle = '#f4f3ef'; g.fillRect(0, 0, w, h);
  g.font = '700 54px ZenKakuB'; g.fillStyle = '#2b2b30'; g.fillText('運賃表', 60, 74);
  g.font = '500 24px ZenKaku'; g.fillText('きっぷうりば　IC カードは改札機にタッチしてください', 290, 70);
  const lines = [
    { col: '#218ea3', wid: 12, pts: t => [80 + t * (w - 160), h * (0.52 - 0.18 * Math.sin(t * Math.PI * 1.2))] },
    { col: '#6c7378', wid: 8, pts: t => [420 + t * 320, 110 + t * (h - 220)] },
    { col: '#6c7378', wid: 8, pts: t => [1520 - t * 260, 110 + t * (h - 220)] },
  ];
  const names = ['北町', '桜坂', '西原', '若葉', '中央', '南台', '東山', '青葉台', '本町', '緑ヶ丘', '港', '大橋', '旭町', '白川', '星ヶ丘', '宮前', '川口', '平和台', '新町', '高砂', '柳原', '月見', '花園', '湊', '朝日', '富士見'];
  let k = 0;
  for (const L of lines) {
    g.strokeStyle = L.col; g.lineWidth = L.wid; g.beginPath();
    for (let t = 0; t <= 1.0001; t += 0.01) { const [x, y] = L.pts(t); t ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
    const n = L.col === '#218ea3' ? 12 : 7;
    for (let i = 0; i < n; i++) {
      const [x, y] = L.pts((i + 0.5) / n), name = names[k++ % names.length], here = name === '南台';
      g.fillStyle = '#ffffff'; g.strokeStyle = '#2b2b30'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, here ? 16 : 11, 0, 7); g.fill(); g.stroke();
      g.fillStyle = '#2b2b30'; g.font = `${here ? 700 : 500} ${here ? 34 : 26}px ${here ? 'ZenKakuB' : 'ZenKaku'}`; g.fillText(name, x + 18, y - 14);
      if (!here) { g.font = '500 22px ZenKaku'; g.fillText(String(150 + ((k * 37) % 25) * 10), x + 18, y + 18); }
    }
  }
});
const fare = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.6), new THREE.MeshBasicMaterial({ map: fareTex }));
fare.position.set(P('fx', -4.2), 1.85, 11.95); fare.rotation.y = Math.PI; scene.add(fare);
// concourse dressing (dress=1): ticket machines under the fare chart, the south exit, posters on the columns
if (q.get('dress') === '1') {
  // the ticket machines and the fare chart over them stand along the side wall near the south exit,
  // so the back wall behind the gates stays plain (it is what frames the people in the frontal shots)
  const side = new THREE.Group(); side.position.set(8.5, 0, 0); side.rotation.y = -Math.PI / 2; scene.add(side);
  // in the side group, local +x runs along the wall toward +z (world) and local +z points into the hall
  fare.scale.setScalar(0.66); fare.rotation.y = 0; fare.position.set(P('fz', 4.35), 2.7, 0.05); side.add(fare);
  const tm = ticketMachines(5, { x0: 0, gap: 0.78, z: 0, off: q.get('screens') === 'off' });
  tm.rotation.y = Math.PI; tm.position.set(P('fz', 4.35) + 1.56, 0, 0.3); side.add(tm);
  const ex = exitOpening({ width: 4.2, height: 2.6 }); ex.position.set(8.49, 0, P('exz', 9.1)); ex.rotation.y = -Math.PI / 2; scene.add(ex);
  let k = 0;
  for (const [cx, cz] of [[4.6, 4.2], [4.6, 9.5], [-4.6, 4.2], [-4.6, 9.5]]) {
    const a = poster(k++, 0.6, 0.9); a.position.set(cx, 1.55, cz - 0.405); a.rotation.y = Math.PI; scene.add(a);
    const b = poster(k++, 0.6, 0.9); b.position.set(cx - Math.sign(cx) * 0.405, 1.55, cz); b.rotation.y = -Math.sign(cx) * Math.PI / 2; scene.add(b);
  }
}

// ---------- people: 2D character cards (front views drawn at eye level) ----------
const cards = [];
async function person(file, heightM, x, z, opts = {}) {
  const t = await loadTex(`/art/cut/${file}.png`);
  // in the negative, the name cards in the drawing stay paper white (mask written by card_swap.py, if there is one)
  if (NEG && !opts.keep) { const kt = await loadTex(`/art/cut/${file}_keep.png`).catch(() => null); if (kt) opts = { ...opts, keep: kt }; }
  // print mode: the drawings' white is the film's paper white
  const c = characterCard(t, heightM, rig, { lit: 1, castShadow: false, contactW: opts.contactW ?? 0.42, rinPal: /^(rin|rlow|rfl|rhi|rgate)/.test(file) ? P('rinpal', 1) : 0, ...(PRINTMODE ? { tint: '#f5f3ed' } : {}), ...opts });
  // contact shadow: small, soft, no ink outline (kept out of the outline pass)
  const ct = c.userData.contact; ct.userData.isFx = true;
  // a soft dark ellipse right under the soles, nudged toward the camera so it shows past the shoes
  const fo = feetOffset(t.image) * c.userData.mesh.geometry.parameters.width, FA = q.get('feetalign') === '1';
  ct.material.color.set(PRINTMODE ? 0x218ea3 : 0x5f6266); ct.material.opacity = P('cto', 0.34); ct.scale.set(P('ctw', 0.34), 1, P('ctd', 0.1)); ct.position.set(FA ? 0 : fo, P('cty', 0.003), P('ctz', 0.035));
  // the card faces straight down the camera's view axis, so a drawing made at the camera's angle reads undistorted
  c.position.set(x, 0, z); c.rotation.y = Math.PI + YAW; if (opts.flip) c.scale.x = -1;
  // a drawing made from above (ctilt=1): lean the card back so it squarely faces the camera along the line
  // of sight to its middle, so the 3D view does not add its own foreshortening to the drawing's. It turns
  // about a level axis at height `pivot` (the feet by default; the hand for someone pressing a reader).
  if (q.get('ctilt') === '1') {
    const dx = x - CAMPOS.x, dz = z - CAMPOS.z, a = -Math.atan2(CAMPOS.y - heightM * 0.55, Math.hypot(dx, dz)), pv = opts.pivot ?? 0;
    const m = c.userData.mesh; m.rotation.x = a; m.position.set(0, pv - pv * Math.cos(a), -pv * Math.sin(a));
  }
  if (FA) c.userData.mesh.position.x = -fo;     // the middle of the feet on the person's spot
  if (q.get('pshadow') === '1') { const m = c.userData.mesh; m.castShadow = true;
    m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: 0.5 }); }
  scene.add(c); cards.push(c); return c;
}
// yaw (degrees): the camera orbits level round the target point (tx, tz); positive yaw moves it toward -x,
// so people walking toward the camera (-z) are seen turned toward screen left, front and left side showing
const YAW = P('yaw', 0) * Math.PI / 180;
const CAMPOS = q.has('yaw') ? new THREE.Vector3(P('tx', 0) - P('dist', 6.5) * Math.sin(YAW), P('ch', 1.45), P('tz', 0.8) - P('dist', 6.5) * Math.cos(YAW))
  : new THREE.Vector3(P('cx', 0), P('ch', 1.45), -P('dist', 6.5));
// people=file,height,x,z[,f = mirrored][,pivot height for the lean]
const people = (q.get('people') ?? '').split(';').filter(Boolean);
// alignment: put the point (fx, fy) of person k's drawing (fractions of the image from its left and top)
// exactly on the card-reader pad of cabinet c, so a card pressed on a reader in the drawing lies on the
// reader in 3D. ali=k:c:fx:fy. The person may rise or sink a few centimetres (only where the feet are hidden).
const ALIGNS = q.get('ali') ? q.get('ali').split('|').map(a => a.split(':').map(Number)) : [];
const padTop = c => new THREE.Vector3(bank.userData.cabs[c].position.x, 1.016, 1.8 * 0.33);
const byIndex = [];        // people in the order given (cards[] is in load order)
await Promise.all(people.map(async (s, k) => {
  const [f, h, x, z, fl, pv, db, yo] = s.split(',');   // yo: standing on something (tactile paving is 8 mm)
  const keep = (q.get('negskip') ?? '0').split(',').map(Number).includes(k);
  const c = await person(f, +h, +x, +z, { flip: fl === 'f', pivot: pv ? +pv : 0, depthBias: db ? +db : 0,
    ...(NEG ? (keep ? { tint: '#ffffff' } : { tint: '#ffffff', neg: [parseInt(q.get('pl') ?? NEG_LIGHT.toString(16), 16), parseInt(q.get('pd') ?? NEG_BASE.toString(16), 16)] }) : {}) });
  byIndex[k] = c;
  if (yo) c.position.y += +yo;
  const ALIGN = ALIGNS.find(a => a[0] === k);
  if (ALIGN) {
    const [, ci, fx, fy] = ALIGN, w = c.userData.mesh.geometry.parameters.width, u = (fx - 0.5) * w, v = (1 - fy) * +h, T = padTop(ci);
    c.position.set(T.x + u * Math.cos(YAW), T.y - v, T.z - u * Math.sin(YAW));
    window.__align = { x: c.position.x, y: c.position.y, z: c.position.z, cardHeight: v };
  }
}));

// the machines are switched on: every reader face is lit, and the small display on each cabinet top prints what its
// machine says in its dot matrix: 読取完了 where a card has just been read, 読み取れません on the cabinet she is
// pressing her card on, an arrow where nobody is. screens=off (the final chorus): every reader and display is dark.
{
  const { inkjetText: ijt } = await import('../lib/card.js');
  const dispTex = txt => { const c = document.createElement('canvas'); c.width = 384; c.height = 192; const g = c.getContext('2d');
    g.fillStyle = '#eef0ec'; g.fillRect(0, 0, 384, 192);
    if (txt) ijt(g, txt, 192, 104, { size: txt.length > 5 ? 46 : 70, align: 'center', seed: 7, matrix: true, color: [22, 22, 26] });
    else { g.fillStyle = '#218ea3'; g.beginPath(); g.moveTo(192, 158); g.lineTo(146, 100); g.lineTo(238, 100); g.closePath(); g.fill(); g.fillRect(174, 36, 36, 66); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; };
  const OFF = q.get('screens') === 'off';
  const said = {};
  for (const [k, ci] of ALIGNS) said[ci] = (k === 0) ? '読み取れません' : '読取完了';
  const texCache = {};
  bank.userData.cabs.forEach((c, i) => {
    const pad = c.userData.pad, scr = c.userData.screen;
    if (OFF) { pad.material = pad.userData.offMat; scr.material = new THREE.MeshBasicMaterial({ color: 0x24282b }); return; }
    const key = said[i] ?? '';
    scr.material = new THREE.MeshBasicMaterial({ map: texCache[key] ??= dispTex(key) });
  });
}

const alts = [];          // { k, card, until } : person k is shown as `card` while t < until
if (q.get('alt')) {
  for (const grp of q.get('alt').split('|')) {
    const [k, list] = grp.split(':'); const base = byIndex[+k], spec = people[+k].split(',');
    const baseH = +spec[1], baseImgH = base.userData.mesh.material.map.image.height;
    for (const item of list.split(',')) {
      const [file, until] = item.split('@'), t = await loadTex(`/art/cut/${file}.png`), hk = baseH * t.image.height / baseImgH;
      const keep = (q.get('negskip') ?? '0').split(',').map(Number).includes(+k);
      const c = await person(file, hk, +spec[2], +spec[3], { flip: spec[4] === 'f', pivot: spec[5] ? +spec[5] : 0, depthBias: spec[6] ? +spec[6] : 0,
        ...(NEG ? (keep ? { tint: '#ffffff' } : { tint: '#ffffff', neg: [parseInt(q.get('pl') ?? NEG_LIGHT.toString(16), 16), parseInt(q.get('pd') ?? NEG_BASE.toString(16), 16)] }) : {}) });
      if (spec[7]) c.position.y += +spec[7];
      c.visible = false; alts.push({ k: +k, card: c, until: +until });
    }
  }
}
const posts = [];         // { k, card, from } : person k is shown as `card` once t >= from (after the main drawing)
if (q.get('post')) {
  for (const grp of q.get('post').split('|')) {
    const [k, list] = grp.split(':'); const base = byIndex[+k], spec = people[+k].split(',');
    const baseH = +spec[1], baseImgH = base.userData.mesh.material.map.image.height;
    for (const item of list.split(',')) {
      const [file, from] = item.split('@'), t = await loadTex(`/art/cut/${file}.png`), hk = baseH * t.image.height / baseImgH;
      const keep = (q.get('negskip') ?? '0').split(',').map(Number).includes(+k);
      const c = await person(file, hk, +spec[2], +spec[3], { flip: spec[4] === 'f', pivot: spec[5] ? +spec[5] : 0, depthBias: spec[6] ? +spec[6] : 0,
        ...(NEG ? (keep ? { tint: '#ffffff' } : { tint: '#ffffff', neg: [parseInt(q.get('pl') ?? NEG_LIGHT.toString(16), 16), parseInt(q.get('pd') ?? NEG_BASE.toString(16), 16)] }) : {}) });
      if (spec[7]) c.position.y += +spec[7];
      c.visible = false; posts.push({ k: +k, card: c, from: +from });
    }
  }
}
if (q.get('att')) {
  const atts = q.get('att').split('|').map(a => a.split(':'));
  await Promise.all(atts.map(async ([k, file, dx, dy, h]) => {
    const t = await loadTex(`/art/cut/${file}.png`);
    const piece = characterCard(t, +h, rig, { lit: 1, castShadow: false, rinPal: /^(rin|rlow|rfl|rhi|rgate)/.test(file) ? P('rinpal', 1) : 0, ...(PRINTMODE ? { tint: NEG ? '#ffffff' : '#f5f3ed' } : {}) });
    piece.userData.contact.visible = false;
    piece.position.set(+dx, +dy, 0.002);
    byIndex[+k].userData.mesh.add(piece);
  }));
}

if (q.get('floorv')) {
  const { inkjetText } = await import('../lib/card.js');
  const c = document.createElement('canvas'); c.width = 2400; c.height = 420; const g = c.getContext('2d');
  inkjetText(g, q.get('floorv'), 1200, 230, { size: 300, font: 'ZenKakuB', weight: 700, align: 'center', color: [26, 26, 30], seed: 21, pitch: P('fvp', 12) });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  const wM = P('fvw', 3.0), m = new THREE.Mesh(new THREE.PlaneGeometry(wM, wM * 420 / 2400).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  m.position.set(P('fvx', 0), 0.007, P('fvz', -1.6)); m.rotation.y = P('fvrot', 0) * Math.PI / 180; m.renderOrder = 0.6;
  m.userData.isFx = true; m.userData.keepColor = true; scene.add(m);
}
let drawFloorLyric = () => {};
let floorLyricMesh = null;
if (q.get('floorlyric')) {
  const { rng } = await import('../lib/card.js');
  const FLF = q.get('flfont') ?? 'Klee';
  if (FLF === 'ShipporiB') { const f = new FontFace('ShipporiB', 'url(/assets/fonts/ShipporiMincho-ExtraBold.ttf)'); await f.load(); document.fonts.add(f); }
  const lines = q.get('floorlyric').split('/'), CW = 2400, CH = 1000, c = document.createElement('canvas'); c.width = CW; c.height = CH;
  const g = c.getContext('2d'), size = P('fls', 330);
  // ltimes: when each character is sung; it appears then, as if rubbed out of the graphite at that moment
  const ltimes = q.get('ltimes') ? await sungTimes(lines.join(''), q.get('lwin')) : null;
  let t = null;
  drawFloorLyric = (tNow = Infinity) => {
    const r = rng(P('flseed', 7)); let ci = 0;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, CW, CH);
    g.textBaseline = 'middle'; g.textAlign = 'center'; g.lineJoin = 'round';
    lines.forEach((line, li) => {
      let gx = 80 + (li ? P('flind', 0.9) * size : 0); const gy = 250 + li * size * 1.12;
      for (const ch of line) {
        const sz = size * (0.92 + r() * 0.14); g.font = `${sz}px ${FLF}`; const cw = g.measureText(ch).width;
        const shown = !ltimes || tNow >= ltimes[ci]; ci++;
        g.save(); g.translate(gx + cw / 2, gy + (r() - 0.5) * size * 0.08); g.rotate((r() - 0.5) * 0.12);
        // rubbed out of the graphite: several passes, the strokes thick and a little ragged
        g.lineWidth = size * P('flsw', 0.012);
        for (let k = 0; k < 4; k++) { const dx = (r() - 0.5) * 7, dy = (r() - 0.5) * 7; g.strokeStyle = g.fillStyle = `rgba(240,238,230,${0.45 + r() * 0.25})`; if (shown) { g.strokeText(ch, dx, dy); g.fillText(ch, dx, dy); } }
        g.restore(); gx += cw * 0.96;
      }
    });
    // the eraser leaves streaks along its strokes, and graphite crumbs inside the white
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 9000; i++) { const x = r() * CW, y = r() * CH; g.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.35})`; g.fillRect(x, y, 2 + r() * 10, 1 + r() * 2); }
    g.globalCompositeOperation = 'source-over';
    if (t) t.needsUpdate = true;
  };
  drawFloorLyric(SEQ ? -Infinity : Infinity);
  t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  const wM = P('flw', 3.0), m = new THREE.Mesh(new THREE.PlaneGeometry(wM, wM * CH / CW).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  m.position.set(P('flx', 0), 0.0095, P('flz', 0)); m.rotation.y = P('flrot', 0) * Math.PI / 180; m.renderOrder = 0.6;
  m.userData.isFx = true; m.userData.keepColor = true; m.userData.noNeg = true; scene.add(m);
  floorLyricMesh = m;
}
// deckv=text: the machine prints its verdict onto the top of her gate, along the exit half of the cabinet
// that holds her reader, in the 16-dot head it prints everything with
if (q.get('deckv')) {
  const { inkjetText } = await import('../lib/card.js');
  const txt = q.get('deckv'), k = P('dvk', 9), CW = Math.ceil(16 * k * (txt.length + 1)), CH = Math.ceil(16 * k * 1.5);
  const c = document.createElement('canvas'); c.width = CW; c.height = CH; const g = c.getContext('2d');
  inkjetText(g, txt, CW / 2, CH / 2, { size: 16 * k, align: 'center', seed: 31, matrix: true, color: [22, 22, 26] });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  const len = P('dvl', 0.56), wid = len * CH / CW;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, wid).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  const cab = bank.userData.cabs[HER + 1];
  m.position.set(cab.position.x + P('dvx', 0), P('dvy', 0.932), P('dvz', -0.62)); m.rotation.y = P('dvrot', 90) * Math.PI / 180;
  m.userData.isFx = true; m.userData.keepColor = true; m.userData.noNeg = true; scene.add(m);
}
// ---------- her black, overflowing: a giant bubble scribbled in pencil on the floor round her ----------
// pool=x,z,rx,rz: the oval she has filled, and the strokes that ran out over its edge (the error the
// machine cannot stand). Pencil graphite is the one black the machine reads, so it keeps its own colour.
if (q.get('pool')) {
  const [px, pz, prx, prz] = q.get('pool').split(',').map(Number);
  const { pencilFill, rng } = await import('../lib/card.js');
  const S = 2048, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
  const R = rng(P('pseed', 5));
  // the oval fills 78% of the canvas; the rest is room for the strokes that overflow it
  const ox = S / 2, oy = S / 2, orx = S * 0.39, ory = S * 0.39;
  pencilFill(g, ox, oy, orx, ory, P('pu', 2048), R, { over: P('pover', 0.1), dark: 2, angle: P('pang', -0.42), mess: P('pmess', 6) });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  const wM = prx * 2 / 0.78, dM = prz * 2 / 0.78;
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(wM, dM).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  pool.position.set(px, 0.006, pz); pool.rotation.y = P('prot', 0) * Math.PI / 180; pool.renderOrder = 0.5;
  pool.userData.isFx = true; pool.userData.keepColor = true; scene.add(pool);
}

if (NEG) scene.traverse(o => {
  if (!o.isMesh || !o.material || !o.material.isMeshBasicMaterial || o.userData.isCard || o.userData.noNeg) return;
  if (o.material.map) negBasic(o.material, parseInt(q.get('nsign') ?? NEG_LIGHT.toString(16), 16), NEG_BASE);
  // daylight in the exit and the ceiling panels: in the blackened hall they would be glaring white bars
  else if (o.material.color.r > 0.9 && o.material.color.g > 0.9) o.material.color.set(parseInt(q.get('ndoor') ?? '4f6f77', 16));
});

// ---------- light and camera ----------
rig.sun.position.set(P('sx', 1.5), P('sy', 8), P('sz', -3)); rig.sun.target.position.set(0, 0, 1); scene.add(rig.sun.target);
const sh = rig.sun.shadow.camera; const SB = BEAM ? 14 : 8; sh.left = -SB; sh.right = SB; sh.top = SB; sh.bottom = -SB; sh.near = 0.5; sh.far = BEAM ? 60 : 30;
const cam = new THREE.PerspectiveCamera(P('fov', 30), W / H, 0.1, 80);
const eye = P('ch', 1.45);
if (q.has('yaw')) {
  const tx = P('tx', 0), tz = P('tz', 0.8), d = P('dist', 6.5);
  cam.position.copy(CAMPOS);
  // tilt (degrees, down): only with drawings made from the same height and angle
  // pan (degrees): turn the view left (+) or right (-) from the orbit target without moving the camera
  const pan = YAW + P('pan', 0) * Math.PI / 180;
  cam.lookAt(CAMPOS.x + d * Math.sin(pan), eye - d * Math.tan(P('tilt', 0) * Math.PI / 180), CAMPOS.z + d * Math.cos(pan));
} else {
  cam.position.set(P('cx', 0), eye, -P('dist', 6.5));
  cam.lookAt(P('cx', 0), eye, 10);
}
if (P('shift', 0)) cam.setViewOffset(W, H, 0, -P('shift', 0) * H, W, H);

// ---------- cards falling off every lanyard, like snow (final chorus) ----------
const nFall = SEQ ? 0 : P('fall', 0);
if (nFall) {
  const { drawCard, CARD_RATIO } = await import('../lib/card.js');
  const texs = [0, 1, 2, 3].map(i => { const c = document.createElement('canvas'); c.width = 300; c.height = 200; drawCard(c, { id: String(2000 + i * 1777 % 8000), dev: String(45 + i * 6), seed: 7 + i });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; });
  const bc = document.createElement('canvas'); bc.width = 300; bc.height = 200; drawCard(bc, { side: 'back', seed: 3 });
  const bt = new THREE.CanvasTexture(bc); bt.colorSpace = THREE.SRGBColorSpace;
  const cwid = P('fcw', 0.11), geoF = new THREE.PlaneGeometry(cwid, cwid / CARD_RATIO), geoB = geoF.clone().rotateY(Math.PI);
  const mF = texs.map(t => new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5 })), mB = new THREE.MeshBasicMaterial({ map: bt, transparent: true, alphaTest: 0.5 });
  const IF = mF.map(m => new THREE.InstancedMesh(geoF, m, nFall)), IB = new THREE.InstancedMesh(geoB, mB, nFall);
  const cnt = IF.map(() => 0); let nb = 0; let s = 77; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const o = new THREE.Object3D(); const hx = P('rx', 0), hz = P('rz', -1.2);
  // keep-clear zones on screen: nothing falls in front of her and what she throws, or in front of a face
  scene.updateMatrixWorld(true); cam.updateMatrixWorld(true);
  const scr = v => { const q2 = v.clone().project(cam); return [(q2.x + 1) / 2 * W, (1 - q2.y) / 2 * H]; };
  const camDepth = v => -v.clone().applyMatrix4(cam.matrixWorldInverse).z;
  const zones = [];
  byIndex.forEach((c, k) => {
    const box = new THREE.Box3().setFromObject(c.userData.mesh), pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(scr(new THREE.Vector3(x, y, z)));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const d = camDepth(c.getWorldPosition(new THREE.Vector3()));
    if (k === 0) { const m = 24; zones.push({ x0: x0 - m, x1: x1 + m, y0: y0 - m, y1: y1 + m, d }); }      // her, whole
    else { const hh = (y1 - y0) * P('fchest', 0.6), m = 14; zones.push({ x0: x0 - m, x1: x1 + m, y0: y0 - m, y1: y0 + hh, d }); }   // head and chest
  });
  // what she throws gets clear air round it, in front and behind, so the one card that matters reads
  if (byIndex[0]) for (const piece of byIndex[0].userData.mesh.children.filter(c => c.isGroup)) {
    const box = new THREE.Box3().setFromObject(piece), pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(scr(new THREE.Vector3(x, y, z)));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), m = P('fthrowpad', 70);
    zones.push({ x0: Math.min(...xs) - m, x1: Math.max(...xs) + m, y0: Math.min(...ys) - m, y1: Math.max(...ys) + m, d: Infinity });
  }
  const minD = P('fmin', 2.2);
  // no card may pass through anybody: a box round every person's drawing (and what hangs on it), with room to spare
  const bodies = byIndex.map(c => new THREE.Box3().setFromObject(c.userData.mesh).expandByScalar(P('fpad', 0.12)));
  // nor through a gate cabinet, and the floor lyric stays clear
  bank.userData.cabs.forEach(cab => { cab.updateMatrixWorld(true); bodies.push(new THREE.Box3().setFromObject(cab).expandByScalar(0.03)); });
  if (floorLyricMesh) {
    floorLyricMesh.updateMatrixWorld(true); const gp = floorLyricMesh.geometry.parameters, pts = [];
    for (const sx of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) pts.push(scr(new THREE.Vector3(sx * gp.width, 0, sz * gp.height).applyMatrix4(floorLyricMesh.matrixWorld)));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), pad = P('flpad', 30);
    zones.push({ x0: Math.min(...xs) - pad, x1: Math.max(...xs) + pad, y0: Math.min(...ys) - pad, y1: Math.max(...ys) + pad, d: 1e9 });
  }
  for (let i = 0; i < nFall; i++) {
    let x, y, z;
    for (let k = 0; k < 40; k++) {
      x = P('fx0', -4.5) + R() * P('fxw', 9); y = 0.15 + Math.pow(R(), P('fyp', 0.8)) * 3.3; z = P('fz0', -2.6) + Math.pow(R(), P('fzp', 1)) * P('fzw', 8);
      const v = new THREE.Vector3(x, y, z), d = camDepth(v);
      if (d < minD || y > P('fymax', 3.1)) continue;
      if (d < P('fnear', 0) && R() > P('fnp', 1)) continue;          // fewer big cards right in front of the lens
      if (bodies.some(bx => bx.containsPoint(v))) continue;
      const [sx, sy] = scr(v);
      if (zones.some(zn => d < zn.d + 0.3 && sx > zn.x0 && sx < zn.x1 && sy > zn.y0 && sy < zn.y1)) continue;
      break;
    }
    o.position.set(x, y, z);
    // a falling card mostly tips flat-ish, turning as it goes; fface pulls it toward facing the camera
    const ff = P('fface', 0);
    if (ff > 0) {
      o.lookAt(cam.position); o.rotateX((R() - 0.5) * 2.2 * (1 - ff) + (R() - 0.5) * 0.9); o.rotateY((R() - 0.5) * 2.2 * (1 - ff) + (R() - 0.5) * 0.9); o.rotateZ((R() - 0.5) * 1.6);
    } else o.rotation.set(-0.6 + (R() - 0.5) * 1.6, R() * 6.283, (R() - 0.5) * 1.2);
    o.updateMatrix();
    const k = i % IF.length; IF[k].setMatrixAt(cnt[k]++, o.matrix); IB.setMatrixAt(nb++, o.matrix);
  }
  IF.forEach((m, k) => { m.count = cnt[k]; m.userData.isFx = !PRINTMODE || NEG; scene.add(m); }); IB.count = nb; IB.userData.isFx = !PRINTMODE || NEG; scene.add(IB);
}

scene.fog = new THREE.Fog(BG, P('f0', 14), P('f1', 40));
const tr = new ToonRenderer(canvas, W, H, 2);
tr.post.uniforms.inkColor && tr.post.uniforms.inkColor.value.set('#4a4c54');
if (PRINTMODE) { const bgc = NEG ? NEG_BASE : 0xf5f3ed; scene.background = new THREE.Color(bgc); scene.fog.color.set(bgc); }
const drawScene = () => tr.render(scene, cam, { lineW: P('lw', 1.4), dof: { focus: P('fo', 6.8), aperture: P('ap', 0), maxR: 6 }, print: PRINTMODE ? { wNear: P('wn', 3.0) } : null });
if (!SEQ) { drawScene(); if (q.get('clipscan') === '1') tr.clipScan(scene, cam, P('gap', 0.1)); }
// verdict=text: the reading machine's verdict printed over the frame in inkjet dots, like a slip it prints
if (q.get('verdict')) {
  const { inkjetText } = await import('../lib/card.js');
  const ov = document.createElement('canvas'); ov.width = W; ov.height = H;
  Object.assign(ov.style, { position: 'absolute', left: '0px', top: '0px', width: W + 'px', height: H + 'px' });
  document.body.appendChild(ov); const o = ov.getContext('2d');
  const vx = P('vx', 960), vy = P('vy', 980), vs = P('vs', 120);
  inkjetText(o, q.get('verdict'), vx, vy, { size: vs, font: 'ZenKakuB', weight: 700, align: 'center', color: [26, 26, 30], seed: 21, pitch: P('vp', 5) });
  if (q.get('vsub')) inkjetText(o, q.get('vsub'), vx, vy - vs * 0.82, { size: vs * 0.2, align: 'center', color: [26, 26, 30], seed: 22, pitch: P('vp', 5) * 0.5 });
}
let drawLyric = () => {};
if (q.get('lyric')) {
  const { rng } = await import('../lib/card.js');
  const ov = document.createElement('canvas'); ov.width = W; ov.height = H;
  Object.assign(ov.style, { position: 'absolute', left: '0px', top: '0px', width: W + 'px', height: H + 'px' });
  document.body.appendChild(ov); const o = ov.getContext('2d');
  const lines = q.get('lyric').split('/'), size = P('ls', 110);
  const ltimes = q.get('ltimes') ? await sungTimes(lines.join(''), q.get('lwin')) : null;   // when each character is sung
  drawLyric = (tNow = Infinity) => {
  const r = rng(P('lseed', 9)); let ci = 0;
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, W, H);
  o.save(); o.translate(P('lx', 140), P('ly', 900)); o.rotate(P('lrot', -3) * Math.PI / 180);
  lines.forEach((line, li) => {
    let gx = (li ? P('lind', 0.6) : 0) * size; const gy = li * size * P('lsp', 1.18);
    for (const ch of line) {
      const sz = size * (0.94 + r() * 0.12); o.font = `${sz}px Klee`; o.textBaseline = 'middle'; o.textAlign = 'center';
      const shown = !ltimes || tNow >= ltimes[ci]; ci++;
      const cw = o.measureText(ch).width;
      o.save(); o.translate(gx + cw / 2, gy + (r() - 0.5) * size * 0.08); o.rotate((r() - 0.5) * 0.1);
      // pressed hard: two passes of graphite, a little apart, so the strokes have the grain of a pencil
      // pressed hard: the strokes thickened by a few passes slightly apart, with an edge of graphite round them
      o.lineJoin = 'round'; o.lineWidth = size * P('lw2', 0.035);
      for (let k = 0; k < 3; k++) { const dx = (r() - 0.5) * 2.4, dy = (r() - 0.5) * 2.4; o.strokeStyle = o.fillStyle = `rgba(${q.get('lrgb') ?? '40,40,46'},${0.55 + r() * 0.2})`; if (shown) { o.strokeText(ch, dx, dy); o.fillText(ch, dx, dy); } }
      o.restore(); gx += cw * P('lspc', 0.98);
    }
  });
  o.restore();
  // paper grain shows through the graphite
  o.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 26000; i++) { o.fillStyle = `rgba(0,0,0,${0.1 + r() * 0.25})`; o.fillRect(r() * W, r() * H, 1 + r() * 1.6, 1); }
  o.globalCompositeOperation = 'source-over';
  };
  if (!SEQ) drawLyric();
}
if (q.get('vlyric')) {
  const f = new FontFace('ShipporiB', 'url(/assets/fonts/ShipporiMincho-Bold.ttf)'); await f.load(); document.fonts.add(f);
  const ov = document.createElement('canvas'); ov.width = W; ov.height = H;
  Object.assign(ov.style, { position: 'absolute', left: '0px', top: '0px', width: W + 'px', height: H + 'px' });
  document.body.appendChild(ov); const o = ov.getContext('2d');
  const size = P('vls', 96), step = P('vlstep', 1.04), cols = q.get('vlyric').split('/');
  o.fillStyle = '#' + (q.get('vlc') ?? 'f5f3ed'); o.font = `${size}px ShipporiB`; o.textAlign = 'center'; o.textBaseline = 'middle';
  cols.forEach((col, ci) => {
    const x = P('vlx', 200) - ci * size * P('vlgap', 1.3); let y = P('vly', 120) + (ci ? P('vlind', 0) * size : 0);
    for (const ch of col) {
      o.save(); o.translate(x, y + size / 2);
      if ('「」『』（）ー〜…―'.includes(ch)) o.rotate(Math.PI / 2);
      if ('、。'.includes(ch)) o.translate(size * 0.56, -size * 0.52);
      if ('ゃゅょっャュョッぁぃぅぇぉ'.includes(ch)) o.translate(size * 0.1, -size * 0.08);
      o.fillText(ch, 0, 0); o.restore(); y += size * step;
    }
  });
}
// ---------- animation (seq=1): the final line, 2:57.4-3:03 ----------
// she grabs the lanyard, pulls it over her head and flings it on 「いいや」; the card flies off in an arc;
// on the downbeat of the outro every card in the hall drops off its lanyard and the cards come down like snow,
// tumbling, drifting, landing flat on the floor. No card ever passes in front of a face or through a body.
if (SEQ) {
  const { drawCard, CARD_RATIO } = await import('../lib/card.js');
  const T0 = P('t0', 177.4), T1 = P('t1', 183.0), TFLING = P('tfling', 180.37), TDROP = P('tdrop', 181.09), LEAD = 1 / 30;
  const DIST0 = P('dist', 6.5), DIST1 = P('dist1', DIST0);
  const smooth = f => { f = Math.min(1, Math.max(0, f)); return f * f * (3 - 2 * f); };
  function setCam(t) {
    const d = DIST0 + (DIST1 - DIST0) * smooth((t - T0) / (T1 - T0)), tx = P('tx', 0), tz = P('tz', 0.8);
    cam.position.set(tx - d * Math.sin(YAW), eye, tz - d * Math.cos(YAW));
    const pan = YAW + P('pan', 0) * Math.PI / 180;
    cam.lookAt(cam.position.x + d * Math.sin(pan), eye - d * Math.tan(P('tilt', 0) * Math.PI / 180), cam.position.z + d * Math.cos(pan));
    cam.updateMatrixWorld(true);
  }
  // card textures: fronts with their pencil marks, backs with the printed rules
  const texs = [0, 1, 2, 3].map(i => { const c = document.createElement('canvas'); c.width = 300; c.height = 200; drawCard(c, { id: String(2000 + i * 1777 % 8000), dev: String(45 + i * 6), seed: 7 + i });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; });
  const bc = document.createElement('canvas'); bc.width = 300; bc.height = 200; drawCard(bc, { side: 'back', seed: 3 });
  const bt = new THREE.CanvasTexture(bc); bt.colorSpace = THREE.SRGBColorSpace;
  const cwid = P('fcw', 0.10), geoF = new THREE.PlaneGeometry(cwid, cwid / CARD_RATIO), geoB = geoF.clone().rotateY(Math.PI);
  let sd = 77; const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  // keep-clear zones, taken at the middle of the push-in: her whole figure (and what she throws), every head
  setCam((T0 + T1) / 2); scene.updateMatrixWorld(true);
  const scr = v => { const q2 = v.clone().project(cam); return [(q2.x + 1) / 2 * W, (1 - q2.y) / 2 * H]; };
  const camDepth = v => -v.clone().applyMatrix4(cam.matrixWorldInverse).z;
  const zones = [], bodies = [];
  const allCards = byIndex.map((c, k) => [c, k]).concat(alts.map(a => [a.card, a.k])).concat(posts.map(a => [a.card, a.k]));
  for (const [c, k] of allCards) {
    const vis = c.visible; c.visible = true; c.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(c.userData.mesh), pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(scr(new THREE.Vector3(x, y, z)));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), d = camDepth(c.getWorldPosition(new THREE.Vector3()));
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    if (k === 0) zones.push({ x0: x0 - 30, x1: x1 + 30, y0: y0 - 30, y1: y1 + 30, d });
    else zones.push({ x0: x0 - 16, x1: x1 + 16, y0: y0 - 16, y1: y0 + (y1 - y0) * P('fchest', 0.6), d });
    bodies.push(box.clone().expandByScalar(P('fpad', 0.12)));
    c.visible = vis;
  }
  // the floor lyric must stay readable: its whole area on screen is kept clear of falling and landed cards
  if (floorLyricMesh) {
    floorLyricMesh.updateMatrixWorld(true); const gp = floorLyricMesh.geometry.parameters, pts = [];
    for (const sx of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) pts.push(scr(new THREE.Vector3(sx * gp.width, 0, sz * gp.height).applyMatrix4(floorLyricMesh.matrixWorld)));   // the geometry is already laid flat (rotateX baked in)
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), pad = P('flpad', 30);
    zones.push({ x0: Math.min(...xs) - pad, x1: Math.max(...xs) + pad, y0: Math.min(...ys) - pad, y1: Math.max(...ys) + pad, d: 1e9 });
  }
  // nor may a card fall through a gate cabinet: every cabinet is a solid box for the falling cards
  bank.userData.cabs.forEach(cab => { cab.updateMatrixWorld(true); bodies.push(new THREE.Box3().setFromObject(cab).expandByScalar(0.03)); });
  const fallers = [];
  // (a) the six people in view: their own card drops from the chest on the downbeat
  // Each one starts exactly where the card hangs in that person's drawing (the centre of its card mask, put on the
  // drawing's plane), the size it is drawn, facing the camera like the drawing, so it reads as the same card coming
  // off the clip; then it tips and flutters down.
  const chest = [];
  for (const a of alts) if (Math.abs(a.until - TDROP) < 0.01 && a.k > 0) {
    const spec = people[a.k].split(','), h = +spec[1], x = +spec[2], z = +spec[3];
    const toCam = new THREE.Vector3(cam.position.x - x, 0, cam.position.z - z).normalize();
    const m = a.card.userData.mesh, kimg = m.userData.keep && m.userData.keep.image;
    const pts = [];
    if (kimg) {
      const kc = document.createElement('canvas'); kc.width = kimg.width; kc.height = kimg.height; const kx = kc.getContext('2d', { willReadFrequently: true }); kx.drawImage(kimg, 0, 0);
      const d = kx.getImageData(0, 0, kc.width, kc.height).data, lab = new Int32Array(kc.width * kc.height);
      // one start point per card in the mask (the mother and her boy have one each): flood-fill the mask's pieces
      let nl = 0; const cs = [];
      for (let i = 0; i < lab.length; i++) if (d[i * 4] > 127 && !lab[i]) { nl++; let sx = 0, sy = 0, n = 0, wmin = 1e9, wmax = -1; const st = [i]; lab[i] = nl;
        while (st.length) { const p = st.pop(), px = p % kc.width, py = (p / kc.width) | 0; sx += px; sy += py; n++; wmin = Math.min(wmin, px); wmax = Math.max(wmax, px);
          for (const q2 of [p - 1, p + 1, p - kc.width, p + kc.width]) if (q2 >= 0 && q2 < lab.length && !lab[q2] && d[q2 * 4] > 127 && Math.abs((q2 % kc.width) - px) <= 1) { lab[q2] = nl; st.push(q2); } }
        if (n > 40) cs.push([sx / n / kc.width, sy / n / kc.height, (wmax - wmin) / kc.width]); }
      m.updateMatrixWorld(true);
      const gw = m.geometry.parameters.width, gh = m.geometry.parameters.height;
      for (const [u, v, wu] of cs) pts.push([new THREE.Vector3((u - 0.5) * gw, (1 - v) * gh, 0).applyMatrix4(m.matrixWorld), wu * gw * Math.abs(m.getWorldScale(new THREE.Vector3()).x)]);
    }
    if (!pts.length) pts.push([new THREE.Vector3(x, h * 0.72, z), cwid]);
    for (const [p, wc] of pts) {
      const yaw = Math.atan2(cam.position.x - p.x, cam.position.z - p.z);
      chest.push(fallers.length);
      fallers.push({ x0: p.x + toCam.x * 0.03, y0: p.y, z0: p.z + toCam.z * 0.03, ts: TDROP, vt: 0.7, ax: 0.06, wx: 5, phx: R() * 6, az: 0.05, wz: 4, phz: R() * 6,
        r0: [0, yaw, 0], sp: [2.2 * (R() - 0.5), 1.5 * (R() - 0.5), 3 * (R() - 0.5)], s: wc / cwid, hold: 0.06 });
    }
  }
  // (b) the rest of the hall: cards coming down from above, some already falling when the shot reaches them
  const pos = (f, t) => { const dt = Math.max(0, t - f.ts), tau = 0.35, fall = f.vt * (dt - tau * (1 - Math.exp(-dt / tau)));
    return new THREE.Vector3(f.x0 + f.ax * (Math.sin(f.wx * dt + f.phx) - Math.sin(f.phx)), Math.max(0.004, f.y0 - fall), f.z0 + f.az * (Math.sin(f.wz * dt + f.phz) - Math.sin(f.phz))); };
  const clear = f => {
    for (let k = 0; k <= 10; k++) {
      const t = f.ts + (T1 - f.ts) * k / 10, v = pos(f, t), d = camDepth(v);
      if (d < P('fmin', 2.2)) return false;
      if (bodies.some(bx => bx.containsPoint(v))) return false;
      const [sx, sy] = scr(v);
      if (zones.some(zn => d < zn.d + 0.3 && sx > zn.x0 && sx < zn.x1 && sy > zn.y0 && sy < zn.y1)) return false;
    }
    return true;
  };
  for (let i = 0; i < P('fall', 500); i++) {
    for (let tries = 0; tries < 30; tries++) {
      const f = { x0: P('fx0', -4.5) + R() * P('fxw', 9), z0: P('fz0', -2.6) + Math.pow(R(), P('fzp', 1)) * P('fzw', 8), y0: P('fy0', 2.0) + R() * P('fyh', 2.0),
        ts: TDROP + R() * P('fspread', 0.9), vt: 0.55 + R() * 0.5, ax: 0.05 + R() * 0.12, wx: 2 + R() * 3, phx: R() * 6.28, az: 0.05 + R() * 0.12, wz: 2 + R() * 3, phz: R() * 6.28,
        r0: [-0.6 + (R() - 0.5) * 1.6, R() * 6.283, (R() - 0.5) * 1.2], sp: [3 * (R() - 0.5), 2 * (R() - 0.5), 3 * (R() - 0.5)] };
      if (clear(f)) { fallers.push(f); break; }
    }
  }
  const NF = fallers.length;
  const mF = texs.map(t => new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5 })), mB = new THREE.MeshBasicMaterial({ map: bt, transparent: true, alphaTest: 0.5 });
  const IF = mF.map(m => new THREE.InstancedMesh(geoF, m, NF)), IB = new THREE.InstancedMesh(geoB, mB, NF);
  IF.forEach(m => { m.userData.isFx = !PRINTMODE || NEG; scene.add(m); }); IB.userData.isFx = !PRINTMODE || NEG; scene.add(IB);
  const ob = new THREE.Object3D(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  function poseFallers(t) {
    const cnt = IF.map(() => 0); let nb = 0;
    fallers.forEach((f, i) => {
      let mtx = zero;
      if (t >= f.ts) {
        const dt = t - f.ts, v = pos(f, t), sp = f.hold ? smooth(dt / 0.5) : 1; ob.position.copy(v);
        if (v.y <= 0.0041) ob.rotation.set(-Math.PI / 2, 0, f.r0[1]);       // landed: lying flat on the floor
        else ob.rotation.set(f.r0[0] + f.sp[0] * dt * sp, f.r0[1] + f.sp[1] * dt * sp, f.r0[2] + f.sp[2] * dt * sp);
        ob.scale.setScalar(f.s || 1);
        ob.updateMatrix(); mtx = ob.matrix;
      }
      const k = i % IF.length; IF[k].setMatrixAt(cnt[k]++, mtx); IB.setMatrixAt(nb++, mtx);
    });
    IF.forEach((m, k) => { m.count = cnt[k]; m.instanceMatrix.needsUpdate = true; }); IB.count = nb; IB.instanceMatrix.needsUpdate = true;
  }
  // what she throws: the piece hung on her fling drawing flies up and away after the fling
  const holder = new THREE.Group();
  if (byIndex[0]) {
    const m0 = byIndex[0].userData.mesh; scene.updateMatrixWorld(true);
    holder.matrixAutoUpdate = false; holder.matrix.copy(m0.matrixWorld); holder.matrixWorldNeedsUpdate = true; scene.add(holder);
    for (const c of m0.children.filter(c => c.isGroup)) holder.add(c);
  }
  const thrown = holder.children.slice();
  const thrown0 = thrown.map(c => c.position.clone());
  const byK = {}; for (const a of alts) (byK[a.k] ||= []).push(a); for (const k in byK) byK[k].sort((a, b) => a.until - b.until);
  window.renderAt = async (t) => {
    const tt = t + LEAD;
    for (const k in byK) {
      const cur = byK[k].find(a => tt < a.until);
      byK[k].forEach(a => { a.card.visible = a === cur; }); byIndex[+k].visible = !cur;
    }
    // after the main drawing: the latest post drawing whose time has come replaces it
    const pk = {}; for (const p2 of posts) if (tt >= p2.from && (!pk[p2.k] || p2.from > pk[p2.k].from)) pk[p2.k] = p2;
    for (const p2 of posts) p2.card.visible = pk[p2.k] === p2;
    for (const k in pk) byIndex[+k].visible = false;
    holder.visible = tt >= TFLING;
    thrown.forEach((c, i) => { const dt = Math.max(0, tt - TFLING);
      c.position.set(thrown0[i].x + P('thvx', -0.9) * dt, thrown0[i].y + P('thvy', 1.6) * dt - 0.5 * P('thg', 2.2) * dt * dt, thrown0[i].z);
      c.rotation.z = P('thspin', 2.4) * dt; });
    poseFallers(tt);
    setCam(t);
    drawFloorLyric(tt);
    drawScene(); drawLyric(tt);
  };
  window.__info = { cards: cards.length, fallers: NF };
}
window.__info ||= { cards: cards.length, align: window.__align };
window.__ready = true;
