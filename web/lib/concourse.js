// Dressing for the station concourse on the entry (unpaid) side of the gates: a bank of ticket
// machines under the fare chart on the back wall, the south exit opening onto daylight in the side
// wall, and cram-school / mock-exam posters on the columns (the town lives by its scores).
// Units are metres; the back wall is the plane z = backZ facing -z, the side wall x = sideX facing -x.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from './toon.js';

function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
}
const INK = '#2b2b30', TEAL = '#218ea3';
// print mode: everything the town prints is teal on paper (set by the scene before building the dressing)
export const STYLE = { print: false };
const PAPERC = '#f5f3ed', TEAL_T = '#cfe6ea';

// ---------- ticket machine (券売機): a pale cabinet with a touch screen, coin and note slots ----------
function machineFace(seed, off = false) {
  return tex(512, 1280, (g, w, h) => {
    const PR = STYLE.print;
    g.fillStyle = PR ? PAPERC : '#d5d8d9'; g.fillRect(0, 0, w, h);
    if (PR) { g.strokeStyle = TEAL; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16); }
    // header strip
    g.fillStyle = TEAL; g.fillRect(0, 60, w, 70);
    g.fillStyle = '#ffffff'; g.font = '700 44px ZenKakuB'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(seed % 2 ? 'きっぷ・カード' : 'きっぷ・チャージ', w / 2, 96);
    // touch screen
    g.fillStyle = PR ? (off ? TEAL : TEAL_T) : (off ? '#141618' : '#26343a'); g.fillRect(48, 200, w - 96, 340);
    if (PR) { g.strokeStyle = TEAL; g.lineWidth = 5; g.strokeRect(48, 200, w - 96, 340); }
    if (!off) {
      g.fillStyle = PR ? PAPERC : '#e9f1f2';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g.fillRect(78 + c * 124, 236 + r * 96, 104, 72);
      g.fillStyle = INK; g.font = '500 30px ZenKaku';
      ['150', '170', '190', '210', '230', '260', '290', '320', '350'].forEach((t, i) => g.fillText(t, 130 + (i % 3) * 124, 274 + Math.floor(i / 3) * 96));
    }
    // slots and the change tray
    g.fillStyle = PR ? TEAL : '#3a3f44';
    g.fillRect(90, 640, 120, 18); g.fillRect(300, 640, 130, 18);
    g.fillRect(90, 760, 330, 16);
    g.fillStyle = PR ? TEAL_T : '#b9bdbf'; g.fillRect(60, 1020, w - 120, 150);
    g.fillStyle = PR ? TEAL : '#7d8286'; g.fillRect(90, 1080, w - 180, 50);
    g.font = '500 26px ZenKaku'; g.fillStyle = PR ? TEAL : INK;
    g.fillText('硬貨', 150, 690); g.fillText('紙幣', 365, 690); g.fillText('カード', w / 2, 800);
  });
}
export function ticketMachines(n, { x0 = 0, gap = 0.78, z = 11.7, off = false } = {}) {
  const g = new THREE.Group();
  const body = toon(0xc8cbcd), dark = toon(0x55595d);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Group();
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.72, 1.8, 0.5, 3, 0.03), body); b.position.y = 0.9; m.add(b);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.5), new THREE.MeshBasicMaterial({ map: machineFace(i, off) }));
    face.position.set(0, 0.95, -0.252); face.rotation.y = Math.PI; m.add(face);
    const hood = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.06, 0.16, 2, 0.02), dark); hood.position.set(0, 1.83, -0.2); m.add(hood);
    const fy = v => 1.7 - 1.5 * v / 1280, fx = u => (u / 512 - 0.5) * 0.6, F = -0.252;      // face texture pixels -> metres
    const bz = (w, h, d, x, y, mat) => { const o = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.3), mat); o.position.set(x, y, F - d / 2); m.add(o); return o; };
    // the bezel round the touch screen
    const sT = fy(200), sB = fy(540), sH = sT - sB, sW = 0.6 - 0.11;
    bz(sW + 0.04, 0.025, 0.03, 0, sT + 0.012, dark); bz(sW + 0.04, 0.025, 0.03, 0, sB - 0.012, dark);
    bz(0.025, sH + 0.05, 0.03, -sW / 2 - 0.012, (sT + sB) / 2, dark); bz(0.025, sH + 0.05, 0.03, sW / 2 + 0.012, (sT + sB) / 2, dark);
    // the counter ledge under the screen
    bz(0.62, 0.035, 0.13, 0, sB - 0.06, body);
    // coin slot, note slot, card slot standing out of the face
    bz(0.09, 0.03, 0.035, fx(150), fy(649), dark); bz(0.1, 0.03, 0.035, fx(365), fy(649), dark); bz(0.26, 0.026, 0.03, fx(255), fy(768), dark);
    // the change tray at the foot: a lip in front of a dark recess
    bz(0.5, 0.11, 0.012, 0, fy(1095), dark); bz(0.52, 0.03, 0.07, 0, fy(1170) + 0.015, body);
    // the machine's number on the hood
    const np = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.05), new THREE.MeshBasicMaterial({ map: tex(96, 40, (g2, w2, h2) => { g2.fillStyle = '#ffffff'; g2.fillRect(0, 0, w2, h2); g2.fillStyle = '#26262b'; g2.font = '700 30px ZenKakuB'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(String(i + 1), w2 / 2, h2 / 2 + 1); }) }));
    np.position.set(0, 1.83, -0.281); np.rotation.y = Math.PI; m.add(np);
    m.position.set(x0 + i * gap, 0, z); m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.add(m);
  }
  return g;
}

// ---------- posters: typographic ads for a cram school and the mock exams ----------
const POSTERS = [
  (g, w, h) => { // a cram school: one right answer
    g.fillStyle = '#f7f6f1'; g.fillRect(0, 0, w, h);
    g.fillStyle = TEAL; g.fillRect(0, 0, w, h * 0.06); g.fillRect(0, h * 0.94, w, h * 0.06);
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${w * 0.2}px ZenKakuB`; g.fillText('正解は、', w / 2, h * 0.3); g.fillText('ひとつ。', w / 2, h * 0.46);
    g.font = `500 ${w * 0.06}px ZenKaku`; g.fillText('迷わない力を、南台ゼミナールで。', w / 2, h * 0.64);
    g.fillStyle = TEAL; g.font = `700 ${w * 0.075}px ZenKakuB`; g.fillText('南台ゼミナール', w / 2, h * 0.84);
  },
  (g, w, h) => { // the town-wide mock exam: an answer-sheet grid as the graphic
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.strokeStyle = TEAL; g.lineWidth = w * 0.006;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) { g.beginPath(); g.ellipse(w * (0.18 + c * 0.13), h * (0.36 + r * 0.045), w * 0.045, h * 0.014, 0, 0, 7); g.stroke(); }
    g.fillStyle = INK; for (let r = 0; r < 9; r++) { const c = (r * 7 + 3) % 6; g.beginPath(); g.ellipse(w * (0.18 + c * 0.13), h * (0.36 + r * 0.045), w * 0.045, h * 0.014, 0, 0, 7); g.fill(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${w * 0.13}px ZenKakuB`; g.fillText('全町一斉模試', w / 2, h * 0.13);
    g.font = `500 ${w * 0.058}px ZenKaku`; g.fillText('あなたの偏差値を、', w / 2, h * 0.205); g.fillText('町が知っています。', w / 2, h * 0.255);
    g.fillStyle = TEAL; g.font = `700 ${w * 0.07}px ZenKakuB`; g.fillText('申込受付中', w / 2, h * 0.86);
  },
  (g, w, h) => { // a station manners poster in the same answer-card language
    g.fillStyle = '#eef3f3'; g.fillRect(0, 0, w, h);
    g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${w * 0.1}px ZenKakuB`; g.fillText('カードは', w / 2, h * 0.2); g.fillText('まっすぐ、', w / 2, h * 0.31); g.fillText('しっかり。', w / 2, h * 0.42);
    g.fillStyle = '#ffffff'; g.strokeStyle = INK; g.lineWidth = w * 0.01;
    g.fillRect(w * 0.22, h * 0.55, w * 0.56, h * 0.2); g.strokeRect(w * 0.22, h * 0.55, w * 0.56, h * 0.2);
    g.strokeStyle = TEAL; g.lineWidth = w * 0.006;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { g.beginPath(); g.ellipse(w * (0.3 + c * 0.1), h * (0.6 + r * 0.05), w * 0.03, h * 0.012, 0, 0, 7); g.stroke(); }
    g.fillStyle = INK; g.font = `500 ${w * 0.055}px ZenKaku`; g.fillText('読み取れないカードは通れません', w / 2, h * 0.85);
  },
];
export function poster(i, wM, hM) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wM, hM), new THREE.MeshBasicMaterial({ map: tex(600, Math.round(600 * hM / wM), POSTERS[i % POSTERS.length]) }));
  return m;
}

// ---------- the south exit: an opening in the side wall onto overexposed daylight, glass doors ----------
export function exitOpening({ width = 4.2, height = 2.6 } = {}) {
  const g = new THREE.Group();
  const light = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color: 0xfbfaf6 }));
  light.position.y = height / 2; light.userData.isFx = true; g.add(light);
  const frame = toon(0x6c7176);
  const mull = (x, w, h, y) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), frame); b.position.set(x, y, 0.03); g.add(b); };
  mull(-width / 2, 0.08, height, height / 2); mull(width / 2, 0.08, height, height / 2); mull(0, width + 0.08, 0.08, height);
  for (let k = 1; k < 4; k++) mull(-width / 2 + k * width / 4, 0.05, height, height / 2);
  mull(0, width, 0.05, 1.0);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.42), new THREE.MeshBasicMaterial({ map: tex(912, 200, (c, w, h) => {
    c.fillStyle = STYLE.print ? TEAL : '#2f3438'; c.fillRect(0, 0, w, h); c.fillStyle = STYLE.print ? PAPERC : '#ffffff'; c.textBaseline = 'middle';
    c.font = '700 96px ZenKakuB'; c.fillText('南口', 40, h / 2); c.font = '500 52px ZenKaku'; c.fillText('South Exit', 300, h / 2 + 6);
    c.fillStyle = STYLE.print ? PAPERC : '#4fc1d3'; c.beginPath(); c.moveTo(w - 150, 50); c.lineTo(w - 50, h / 2); c.lineTo(w - 150, h - 50); c.closePath(); c.fill();
  }) }));
  sign.position.set(0, height + 0.36, 0.04); g.add(sign);
  return g;
}
