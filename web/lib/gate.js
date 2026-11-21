// Automatic ticket gate (自動改札機), modelled after the common Japanese two-sided gate:
// a long cabinet about 1.0 m high with a sloped top deck carrying the card reader pad, ticket slots
// and a small display; flap doors fold out of the cabinet sides at mid length; indicator panels at
// both ends. In this film the reader is an answer-card reader: the pad is printed with the card's
// teal grid. Units are metres; the gate runs along +z (people walk toward -z, entry at +z).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toon } from './toon.js';

const L = 1.8, Wd = 0.24, Hh = 0.95;       // cabinet length, width, height (gates run 0.95-1.05 m)
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// the reader's lit face: the touch ring (rings of light round the spot to touch), a small card symbol and an arrow;
// unlit (lights out in the final chorus) it is a dark glass plate
const readerTex = canvasTex(256, 320, (g, w, h) => {
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#3a3a3a'; for (const [r, lw] of [[0.40, 10], [0.31, 4], [0.24, 4]]) { g.lineWidth = lw; g.beginPath(); g.ellipse(w / 2, h * 0.45, w * r, w * r * 0.92, 0, 0, 7); g.stroke(); }
  g.fillStyle = '#3a3a3a'; g.fillRect(w / 2 - 30, h * 0.45 - 20, 60, 40); g.fillStyle = '#ffffff'; g.fillRect(w / 2 - 24, h * 0.45 - 14, 48, 28);
  g.fillStyle = '#3a3a3a'; g.beginPath(); g.moveTo(w / 2, h * 0.92); g.lineTo(w / 2 - 22, h * 0.84); g.lineTo(w / 2 + 22, h * 0.84); g.closePath(); g.fill();
});
const readerOffTex = canvasTex(64, 80, (g, w, h) => { g.fillStyle = '#2a2d31'; g.fillRect(0, 0, w, h); });
const numTex = n => canvasTex(160, 128, (g, w, h) => {
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a3a3a'; g.fillRect(0, 0, w, 18);
  g.font = '700 84px ZenKakuB'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), w / 2, h * 0.6);
});

export function gateMaterials() {
  return {
    body: toon(0xd9d8d2), trim: toon(0x9a9ea3), dark: toon(0x2c2e33), deck: toon(0xe9e8e2),
    pad: toon(0x218ea3), flap: toon(0xc9cbc6), screen: toon(0x3b4a50), plinth: toon(0x6f7378),
  };
}

// one cabinet; side = +1 if its flap opens toward +x, -1 toward -x (cabinets between two aisles have both)
export function gateCabinet(M, { flaps = [1, -1], screenTex = null, num = null } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(Wd, Hh - 0.08, L, 3, 0.03), M.body);
  body.position.y = (Hh - 0.08) / 2 + 0.06; g.add(body);
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(Wd + 0.02, 0.06, L + 0.02, 2, 0.01), M.plinth);
  plinth.position.y = 0.03; g.add(plinth);
  // sloped top deck: high at the entry end, a few degrees down toward the exit
  const deck = new THREE.Mesh(new RoundedBoxGeometry(Wd + 0.04, 0.04, L * 0.62, 3, 0.015), M.deck);
  deck.position.set(0, Hh + 0.01, L * 0.12); deck.rotation.x = -0.06; g.add(deck);
  // card reader near the entry end, tilted toward the walker: a raised housing with a dark frame, bigger than a card,
  // and its lit face inside the frame
  const readerBase = new THREE.Mesh(new RoundedBoxGeometry(Wd * 0.94, 0.05, 0.3, 2, 0.012), M.dark);
  readerBase.position.set(0, Hh + 0.035, L * 0.33); readerBase.rotation.x = -0.16; g.add(readerBase);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(Wd * 0.74, 0.008, 0.24), screenTex ? new THREE.MeshBasicMaterial({ map: screenTex }) : new THREE.MeshBasicMaterial({ map: readerTex }));
  pad.position.set(0, Hh + 0.062, L * 0.33); pad.rotation.x = -0.16; g.add(pad);
  pad.userData.keepColor = true; pad.userData.onMat = pad.material; pad.userData.offMat = new THREE.MeshBasicMaterial({ map: readerOffTex });
  g.userData.pad = pad;
  // ticket insertion and exit slots
  for (const [z, w] of [[L * 0.2, 0.09], [-L * 0.28, 0.09]]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, 0.012), M.dark);
    s.position.set(0, Hh + 0.025 + z * 0.06, z); g.add(s);
  }
  // small display facing the walker
  const scrBox = new THREE.Mesh(new RoundedBoxGeometry(Wd * 0.7, 0.1, 0.025, 2, 0.006), M.dark);
  scrBox.position.set(0, Hh + 0.04, L * 0.06); scrBox.rotation.x = -0.5; g.add(scrBox);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(Wd * 0.6, 0.075), new THREE.MeshBasicMaterial({ color: 0x24282b }));
  scr.position.set(0, Hh + 0.04 + Math.sin(0.5) * 0.0131, L * 0.06 + Math.cos(0.5) * 0.0131); scr.rotation.x = -0.5; g.add(scr);
  scr.userData.keepColor = true; g.userData.screen = scr;
  // seams and a trim band along both long sides, panel joints, and a kick band at the foot
  for (const sx of [-1, 1]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.05, L * 0.96), M.trim);
    band.position.set(sx * (Wd / 2 + 0.002), Hh * 0.62, 0); g.add(band);
    for (const zj of [-0.62, 0.38, 0.72]) {
      const joint = new THREE.Mesh(new THREE.BoxGeometry(0.004, Hh * 0.72, 0.006), M.trim);
      joint.position.set(sx * (Wd / 2 + 0.0015), 0.12 + Hh * 0.36, zj); g.add(joint);
    }
    const kick = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.012, L * 0.97), M.trim);
    kick.position.set(sx * (Wd / 2 + 0.0015), 0.14, 0); g.add(kick);
    for (const yj of [0.3, Hh * 0.86]) { const seam = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.006, L * 0.96), M.trim); seam.position.set(sx * (Wd / 2 + 0.0015), yj, 0); g.add(seam); }
    for (const zs of [0.62, 0.3, -0.42, -0.72]) { const win = new THREE.Mesh(new RoundedBoxGeometry(0.008, 0.05, 0.09, 2, 0.003), M.dark); win.position.set(sx * (Wd / 2 + 0.002), 0.72, zs); g.add(win); }
    const fslot = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.4, 0.035), M.dark); fslot.position.set(sx * (Wd / 2 + 0.002), 0.73, -0.05); g.add(fslot);
  }
  // aisle number on the exit end of the top deck, read by people coming out
  if (num !== null) {
    const np = new THREE.Mesh(new THREE.BoxGeometry(Wd * 0.7, 0.008, 0.11), new THREE.MeshToonMaterial({ color: 0xffffff, map: numTex(num), gradientMap: M.body.gradientMap }));
    np.position.set(0, Hh - 0.011, -L / 2 + 0.1); np.rotation.set(0, Math.PI, 0); g.add(np);
  }
  // end panels with an indicator: entry end shows the walk-in arrow, exit end a plain plate
  // indicators at both ends: a housing on top of the cabinet end, its face tilted up and outward so it reads
  // from standing height and from above (the entry face shows the walk-in arrow, the exit face pass / stop)
  for (const [z, end] of [[L / 2 - 0.06, 'entry'], [-L / 2 + 0.06, 'exit']]) {
    const sgn = end === 'exit' ? -1 : 1, tilt = 1.05;
    const hold = new THREE.Group(); hold.position.set(0, Hh - 0.03, z); hold.rotation.x = -sgn * tilt; g.add(hold);
    const box = new THREE.Mesh(new RoundedBoxGeometry(Wd * 0.86, 0.17, 0.05, 2, 0.008), M.trim); box.position.set(0, 0.06, 0); hold.add(box);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(Wd * 0.7, 0.13), new THREE.MeshBasicMaterial({ color: 0x2f3438 }));
    scr.position.set(0, 0.06, sgn * 0.0262); if (end === 'exit') scr.rotation.y = Math.PI;
    hold.add(scr); g.userData[end + 'Screen'] = scr;
  }
  // flap doors at mid length: pale panels with rounded tips, open = folded into the cabinet
  g.userData.flaps = [];
  for (const side of flaps) {
    const shape = new THREE.Shape();
    const fl = 0.27, fh = 0.36;
    shape.moveTo(0, 0); shape.lineTo(fl - 0.08, 0); shape.quadraticCurveTo(fl, 0, fl, 0.08); shape.lineTo(fl, fh - 0.08);
    shape.quadraticCurveTo(fl, fh, fl - 0.08, fh); shape.lineTo(0, fh); shape.lineTo(0, 0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 });
    geo.translate(0, 0, -0.011);
    const flap = new THREE.Mesh(geo, M.flap);
    const pivot = new THREE.Group();
    pivot.position.set(side * Wd / 2, 0.55, -0.05);
    flap.rotation.y = side > 0 ? 0 : Math.PI;          // extend toward the aisle on that side
    pivot.add(flap); g.add(pivot);
    pivot.userData.side = side;
    g.userData.flaps.push(pivot);
  }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

// one flap: open = 0 closed (across the aisle), 1 open. An open flap folds back and slides inside the
// cabinet, as real gate doors retract into the body, so nothing sticks out of an open cabinet's side.
export function setFlap(p, open) {
  const side = p.userData.side;
  p.rotation.y = side * (-Math.PI / 2) * open * 0.98;
  p.position.x = side * (Wd / 2) * (1 - 0.45 * open);
  p.position.y = 0.55 - 0.2 * open;
}
export function setFlaps(cabinet, open) {
  for (const p of cabinet.userData.flaps) setFlap(p, open);
}

// a bank of n aisles: cabinets at x = (i - n/2) * pitch
export function gateBank(M, n, pitch = Wd + 0.6) {
  const g = new THREE.Group(); const cabs = [];
  for (let i = 0; i <= n; i++) {
    const flaps = i === 0 ? [1] : i === n ? [-1] : [1, -1];
    const c = gateCabinet(M, { flaps, num: i + 1 });
    c.position.x = (i - n / 2) * pitch; g.add(c); cabs.push(c);
  }
  g.userData.cabs = cabs; g.userData.pitch = pitch;
  return g;
}
