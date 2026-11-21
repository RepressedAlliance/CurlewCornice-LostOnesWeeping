// Printed dressing for the station hall in print mode: the walls are printed like a giant answer sheet.
// Textures are drawn in greys on white; the print material (toon.js) turns their darkness into teal screens
// (white = paper, light grey = light teal, mid grey = mid teal, dark = solid teal), so shading still applies.
import * as THREE from 'three';
import { toon } from './toon.js';

function tex(w, h, draw, repeat = null) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
const SOLID = '#3a3a3a', MID = '#8a8a8a', LIGHT = '#c4c4c4', BUBBLE = '#7a7a7a';

// the back wall behind the gates: a giant answer sheet. Timing track along the top, the station name in a
// form field, then rows of huge bubbles numbered 0-9, a printed rule line, and timing marks along the foot
export function answerSheetWall(wM, hM) {
  const ppm = 160, W = Math.round(wM * ppm), H = Math.round(hM * ppm);
  return tex(W, H, (g) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    const m = v => v * ppm;
    // timing track: short solid bars along the top and the foot, one every 40 cm
    g.fillStyle = SOLID;
    for (let x = m(0.2); x < W - m(0.2); x += m(0.4)) { g.fillRect(x, m(0.1), m(0.16), m(0.07)); g.fillRect(x, H - m(0.26), m(0.16), m(0.07)); }
    // corner registration squares
    for (const [x, y] of [[m(0.15), m(0.28)], [W - m(0.45), m(0.28)]]) g.fillRect(x, y, m(0.3), m(0.3));
    // header field: label block + the station name
    g.strokeStyle = SOLID; g.lineWidth = m(0.025);
    const fx = m(0.9), fy = m(0.3), fw = W - m(1.8), fh = m(0.62);
    g.strokeRect(fx, fy, fw, fh); g.fillStyle = MID; g.fillRect(fx, fy, m(1.6), fh);
    g.fillStyle = '#ffffff'; g.font = `700 ${m(0.3)}px ZenKakuB`; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText('駅名', fx + m(0.8), fy + fh / 2);
    g.fillStyle = SOLID; g.textAlign = 'left'; g.font = `700 ${m(0.42)}px ZenKakuB`; g.fillText('南台　改札口', fx + m(1.9), fy + fh / 2 + m(0.02));
    g.font = `500 ${m(0.16)}px ZenKaku`; g.fillText('MINAMIDAI STATION  TICKET GATES  ／  カードは読取部にまっすぐタッチしてください', fx + m(6.2), fy + fh / 2);
    // the bubble field: rows of big ovals numbered 0-9, a few filled solid (the wall's own print, not pencil)
    const rows = 4, top = m(1.18), rowH = m(0.46), bw = m(0.34), bh = m(0.2);
    let k = 0;
    for (let r = 0; r < rows; r++) {
      const y = top + r * rowH;
      g.fillStyle = LIGHT; g.fillRect(m(0.3), y - m(0.18), m(0.7), m(0.36));
      g.fillStyle = SOLID; g.font = `700 ${m(0.17)}px ZenKakuB`; g.textAlign = 'center'; g.fillText(['学籍', '番号', '偏差', '値'][r], m(0.65), y);
      for (let x = m(1.3), i = 0; x < W - m(0.5); x += m(0.48), i++) {
        g.lineWidth = m(0.018); g.strokeStyle = BUBBLE; g.beginPath(); g.ellipse(x, y, bw / 2, bh / 2, 0, 0, 7); g.stroke();
        g.fillStyle = MID; g.font = `500 ${m(0.12)}px ZenKaku`; g.fillText(String(i % 10), x, y + m(0.005));
        k++;
      }
    }
    // a printed rule and small print under the field
    g.fillStyle = SOLID; g.fillRect(m(0.3), top + rows * rowH - m(0.05), W - m(0.6), m(0.02));
    g.font = `500 ${m(0.11)}px ZenKaku`; g.textAlign = 'left';
    g.fillText('注意　1. HBの黒鉛筆で○の中を正確にぬりつぶしてください。　2. はみ出したり、うすかったりすると読み取れません。　3. 訂正するときは、消しゴムできれいに消してください。', m(0.35), top + rows * rowH + m(0.12));
  });
}

// the side walls: square tiles with printed joints and a timing track at the top
export function tiledWall(wM, hM) {
  const ppm = 120, W = Math.round(wM * ppm), H = Math.round(hM * ppm);
  return tex(W, H, (g) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    g.strokeStyle = LIGHT; g.lineWidth = 3;
    for (let x = 0; x < W; x += ppm * 0.3) { g.beginPath(); g.moveTo(x, ppm * 0.6); g.lineTo(x, H); g.stroke(); }
    for (let y = ppm * 0.6; y < H; y += ppm * 0.3) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.fillStyle = SOLID; for (let x = ppm * 0.2; x < W; x += ppm * 0.4) g.fillRect(x, ppm * 0.18, ppm * 0.16, ppm * 0.07);
    g.fillRect(0, ppm * 0.5, W, ppm * 0.03);
  });
}

// tactile paving in front of each aisle: a strip of raised dots, printed as rows of small circles
export function tactileStrip(lenM, widM = 0.3) {
  const geo = new THREE.BoxGeometry(widM, 0.008, lenM);
  const t = tex(256, Math.round(256 * lenM / widM), (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = MID; g.lineWidth = 6;
    const s = w / 5; g.fillStyle = MID; for (let y = s / 2; y < h; y += s) for (let x = s / 2; x < w; x += s) { g.beginPath(); g.arc(x, y, s * 0.24, 0, 7); g.fill(); }
  });
  const m = new THREE.Mesh(geo, toon(0xffffff, { map: t })); m.receiveShadow = true;
  return m;
}
