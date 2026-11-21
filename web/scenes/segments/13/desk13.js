// Segment 13 C: the pieces drawn by code for the sample (docs/分镜/13_C.md 第 6 节). Pure drawing, no timing.
//  - neg(): the negative of the film's paper language: lightness inverted, hue kept (an RGB invert would turn teal orange-red,
//    and the film has no red). For an sRGB colour in HSL terms, keeping H and S and inverting L is exactly
//    c' = c + 255 - max - min per channel. The negative values below are DERIVED from palette.js this way (no new hex values);
//    docs/分镜/13_C.md asks for them as neg.* in palette.js - that is a shared-library change, left to the report.
//  - negPass(): one frame: inside the lamp / street lamp light the paper is normal, outside it is the negative, with a soft edge
//    in space (not in time).
//  - the essay 「しょうらいのゆめ」 on 原稿用紙: square cells (1.5 cm = 60 px), one character per cell, small kana and 、。 placed
//    as in vertical writing, a first-grader's careful pencil hand (Klee One, the textbook hand), the guitar drawing (Codex,
//    art/cut/p13_guitar2.png) in pencil on the empty cells, the teal よくかけました stamp, two fold creases.
//  - graphite rub strips and bands (the eraser full of graphite smears the pencil into dirty black, 08a's way).
import { SMALL_KANA, VERT_ROTATE } from '../../../lib/print.js';
import { PAPER_RGB, TEAL, TEAL_RGB, INK_RGB, FIBRE_RGB, PENCIL, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, rgba, rgb } from '../../../lib/palette.js';

export const mk = (w, h, read = false) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d', read ? { willReadFrequently: true } : undefined)]; };
export const mix = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
export const neg = c => { const d = 255 - Math.max(...c) - Math.min(...c); return c.map(v => v + d); };
const sm = f => { f = Math.min(1, Math.max(0, f)); return f * f * (3 - 2 * f); };

// colours used here, all derived from palette.js
export const DESK_RGB = mix(PAPER_RGB, INK_RGB, 0.10);       // the desk top as lit paper-language (its negative is near black)
export const OLD_RGB = mix(PAPER_RGB, FIBRE_RGB, 0.16);      // the essay: paper kept folded for years, yellowed
export const ASPH_RGB = mix(PAPER_RGB, INK_RGB, 0.30);       // asphalt under the street lamp
export const WALL_RGB = mix(PAPER_RGB, INK_RGB, 0.07);       // her room's wall

// ---------- the negative pass ----------
// src: the frame drawn normally (1920 x 1080, a willReadFrequently canvas); lights: [{x, y, rx, ry, soft}] in frame px, or a fan
// {fan: true, x, y (apex), a (direction), half (half angle), asoft, r (full reach), soft};
// writes the result into g (identity transform)
export function negPass(g, src, sctx, lights, W = 1920, H = 1080) {
  const corners = [[0, 0], [W, 0], [0, H], [W, H]];
  const allLit = lights.some(L => corners.every(([x, y]) => Math.hypot((x - L.x) / L.rx, (y - L.y) / L.ry) <= 1));
  if (allLit) { g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(src, 0, 0); return; }
  const id = sctx.getImageData(0, 0, W, H), a = id.data;
  const Ls = lights.map(L => ({ ...L, s: L.soft / Math.min(L.rx, L.ry) }));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let m = 0;
      for (const L of Ls) {
        let v;
        if (L.fan) {                                   // a fan of light from an apex (a lamp shade's opening): angle and reach
          const dx = x - L.x, dy = y - L.y, d = Math.sqrt(dx * dx + dy * dy); let an = Math.atan2(dy, dx) - L.a;
          an = Math.abs(an - 2 * Math.PI * Math.round(an / (2 * Math.PI)));
          const va = Math.min(1, Math.max(0, (L.half + L.asoft / 2 - an) / L.asoft)), vr = d <= L.r ? 1 : d >= L.r + L.soft ? 0 : 1 - (d - L.r) / L.soft;
          v = va * vr;
          if (L.mouth) {                               // a beam: only in front of the shade's mouth (the plane through mx, my
            const al = (x - L.mx) * Math.cos(L.a) + (y - L.my) * Math.sin(L.a);   // across the axis), dimming with distance
            v *= al <= 0 ? 0 : al >= L.msoft ? 1 : al / L.msoft;
            if (L.fall) v *= 1 - L.fall * Math.min(1, d / L.r);
          }
        } else if (L.ang) {                            // an ellipse turned by ang
          const c = Math.cos(L.ang), sn = Math.sin(L.ang), ex = x - L.x, ey = y - L.y, dx = (ex * c + ey * sn) / L.rx, dy = (-ex * sn + ey * c) / L.ry, d = Math.sqrt(dx * dx + dy * dy);
          v = d <= 1 ? 1 : d >= 1 + L.s ? 0 : 1 - (d - 1) / L.s;
        } else { const dx = (x - L.x) / L.rx, dy = (y - L.y) / L.ry, d = Math.sqrt(dx * dx + dy * dy); v = d <= 1 ? 1 : d >= 1 + L.s ? 0 : 1 - (d - 1) / L.s; }
        if (v > m) m = v;
      }
      if (m >= 1) continue;
      m = m * m * (3 - 2 * m);
      const i = (y * W + x) * 4, r = a[i], gg = a[i + 1], b = a[i + 2];
      const mx = r > gg ? (r > b ? r : b) : (gg > b ? gg : b), mn = r < gg ? (r < b ? r : b) : (gg < b ? gg : b), d = 255 - mx - mn, k = 1 - m;
      a[i] = r + d * k; a[i + 1] = gg + d * k; a[i + 2] = b + d * k;
    }
  }
  g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(id, 0, 0);
}

// ---------- the essay ----------
export const CELL = 60, NC = 12, NR = 12, EM = { l: 40, t: 50 }, EW = 800, EH = 820, RS = 3;
// (round h) the canon text and layout (art/canon/essay_shourai_no_yume.png, docs/設定包): title, name, two paragraphs each
// indented one cell; the last 。 hangs in す's cell (ぶら下げ). The page draws the six-year-old's pencil handwriting
// (art/cut/p13h_essay_hand.png, Codex, written into exactly these cells); the glyphs here only lay out the cells and give
// the rub strips the shapes of the letters they smear.
export const COLS = [[1, 3, 'しょうらいのゆめ'], [2, 5, 'かがみね　りん'], [3, 1, '　わたしは、おおきくなっ'], [4, 1, 'たら、ギターをひくひとに'],
  [5, 1, 'なりたいです。'], [6, 1, '　ギターをひくと、みんな'], [7, 1, 'がわらってくれるからです']];
// columns counted from the right (1 = 題名), rows from the top
export function essayColumns() {
  const cols = COLS.map(([col, row0, text]) => ({ col, row0, text }));
  // 行頭禁則: no column may start with 、。 or a small kana (checked here, reported by the page)
  const bad = cols.filter(k => k.col > 2 && ('、。' + SMALL_KANA + 'ー').includes(k.text[0])).map(k => k.col);
  return { cols, bad };
}
// the handwriting image covers columns 1-7, rows 1-12 (its cells are 1/7 x 1/12 of it)
export const HAND_RECT = [EM.l + 5 * 60, EM.t, 7 * 60, 12 * 60];
// local essay coordinates (0..EW, 0..EH) of a cell centre
export const cellX = col => EM.l + NC * CELL - (col - 0.5) * CELL;
export const cellY = row => EM.t + (row - 0.5) * CELL;

function glyph(ctx, ch, cx, cy, size) {
  const small = SMALL_KANA.includes(ch), punct = '、。'.includes(ch), rot = VERT_ROTATE.includes(ch);
  const s = small ? size * 0.74 : size;
  ctx.save(); ctx.translate(cx + (small ? size * 0.12 : punct ? size * 0.52 : 0), cy - (small ? size * 0.08 : punct ? size * 0.5 : 0));
  if (rot) ctx.rotate(Math.PI / 2);
  ctx.font = `600 ${s}px Klee`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ch, 0, 0); ctx.restore();
}

// the whole sheet, flat, at RS x world resolution: { canvas, left, right } (left/right: the two halves, for the fold)
export function drawEssay({ guitar, rng, hand }) {
  const [c, x] = mk(EW * RS, EH * RS); x.scale(RS, RS);
  const R = rng(1313);
  // paper (corners worn round)
  x.save(); x.beginPath(); x.roundRect(0, 0, EW, EH, 12); x.clip();
  x.fillStyle = rgb(OLD_RGB); x.fillRect(0, 0, EW, EH);
  for (let k = 0; k < 2600; k++) { x.fillStyle = rgba(FIBRE_RGB, 0.03 + R() * 0.05); x.fillRect(R() * EW, R() * EH, 1 + R() * 5, 0.6); }
  // years in a pocket: the edges and the folded quarters' outer corners a little darker
  const vg = x.createRadialGradient(EW / 2, EH / 2, EW * 0.3, EW / 2, EH / 2, EW * 0.75); vg.addColorStop(0, rgba(FIBRE_RGB, 0)); vg.addColorStop(1, rgba(FIBRE_RGB, 0.22));
  x.fillStyle = vg; x.fillRect(0, 0, EW, EH);
  // the grid (teal, printed): outer double rule, cells
  const gx0 = EM.l, gy0 = EM.t, gw = NC * CELL, gh = NR * CELL;
  x.strokeStyle = TEAL; x.lineWidth = 1.4;
  for (let i = 0; i <= NC; i++) { x.beginPath(); x.moveTo(gx0 + i * CELL, gy0); x.lineTo(gx0 + i * CELL, gy0 + gh); x.stroke(); }
  for (let j = 0; j <= NR; j++) { x.beginPath(); x.moveTo(gx0, gy0 + j * CELL); x.lineTo(gx0 + gw, gy0 + j * CELL); x.stroke(); }
  x.lineWidth = 2.6; x.strokeRect(gx0 - 6, gy0 - 6, gw + 12, gh + 12);
  // the writing: pencil on its own layer, then grain taken out of it
  const [tl, ts] = mk(EW * RS, EH * RS); ts.scale(RS, RS); ts.fillStyle = PENCIL;
  if (hand) { ts.drawImage(hand, HAND_RECT[0], HAND_RECT[1], HAND_RECT[2], HAND_RECT[3]); }
  else for (const k of essayColumns().cols) [...k.text].forEach((ch, i) => { if (ch !== '　') glyph(ts, ch, cellX(k.col), cellY(k.row0 + i), 46); });
  ts.setTransform(1, 0, 0, 1, 0, 0); ts.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < 26000; k++) { ts.fillStyle = `rgba(0,0,0,${0.12 + R() * 0.3})`; ts.fillRect(R() * tl.width, R() * tl.height, 1 + R() * 2.5, 1); }
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(tl, 0, 0); x.restore();
  // the guitar drawing on the four empty columns at the left (pencil on white: multiplied onto the paper)
  // (full cut) the pencil is laid OVER the printed grid, as pencil on paper is: the drawing's darkness becomes graphite alpha
  const GB = guitarBox();
  { const P = pencilize(guitar, GUITAR_CROP, GB[2] * RS, GB[3] * RS, true); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(P, GB[0] * RS, GB[1] * RS); x.restore(); }
  // よくかけました: a teal rubber stamp, a little uneven ink
  { const sx = 104, sy = 722, r = 36; x.save(); x.strokeStyle = rgba(TEAL_RGB, 0.85); x.lineWidth = 3; x.beginPath(); x.arc(sx, sy, r, 0, 7); x.stroke();
    x.lineWidth = 1.4; x.beginPath(); x.arc(sx, sy, r - 5, 0, 7); x.stroke();
    x.fillStyle = rgba(TEAL_RGB, 0.85); x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 15px ZenKakuB';
    x.fillText('よく', sx, sy - 16); x.fillText('かけ', sx, sy); x.fillText('ました', sx, sy + 16);
    x.globalCompositeOperation = 'destination-out'; for (let k = 0; k < 160; k++) { x.fillStyle = `rgba(0,0,0,${0.2 + R() * 0.5})`; x.fillRect(sx - r + R() * 2 * r, sy - r + R() * 2 * r, 1 + R() * 2, 1 + R() * 2); }
    x.restore(); }
  // fold creases (folded in four): a soft valley and a highlight along each
  const crease = (x0, y0, x1, y1, nx, ny) => { for (const [o, col, a] of [[-1.5, INK_RGB, 0.10], [1.5, PAPER_RGB, 0.5]]) { x.strokeStyle = rgba(col, a); x.lineWidth = 2.2; x.beginPath(); x.moveTo(x0 + nx * o, y0 + ny * o); x.lineTo(x1 + nx * o, y1 + ny * o); x.stroke(); } };
  crease(EW / 2, 0, EW / 2, EH, 1, 0); crease(0, EH / 2, EW, EH / 2, 0, 1);
  x.restore();
  // the halves (for the fold): left = 0..EW/2, right = EW/2..EW
  const half = sx0 => { const [h, hx] = mk(EW / 2 * RS, EH * RS); hx.drawImage(c, sx0 * RS, 0, EW / 2 * RS, EH * RS, 0, 0, EW / 2 * RS, EH * RS); return h; };
  return { canvas: c, left: half(0), right: half(EW / 2) };
}
// the guitar drawing's box on the essay (local): within columns 9-12 (x 40..280), rows 3-10
// (full cut) the first-grader's drawing art/cut/p13f_guitar.png: herself with a guitar; content box in the drawing:
export const GUITAR_CROP = [28, 44, 980, 1450];
export const guitarBox = () => { const w = 238, h = w * GUITAR_CROP[3] / GUITAR_CROP[2]; return [40 + (240 - w) / 2, 452 - h / 2, w, h]; };
// a pencil drawing on white (Codex) -> graphite with alpha from its darkness, so it covers what is under it like real pencil
// (multiply let the teal grid show through the strokes: review must_fix). crop [sx, sy, sw, sh]; out w x h; mirror: flip.
export function pencilize(im, [sx, sy, sw, sh], w, h, mirror = false) {
  const [c, x] = mk(w, h, true); if (mirror) { x.translate(c.width, 0); x.scale(-1, 1); }
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingQuality = 'high'; x.drawImage(im, sx, sy, sw, sh, 0, 0, c.width, c.height);
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data, [pr, pg, pb] = [40, 40, 46];
  for (let i = 0; i < d.length; i += 4) { const l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255, a = Math.min(1, Math.max(0, (0.97 - l) * 1.25)); d[i] = pr; d[i + 1] = pg; d[i + 2] = pb; d[i + 3] = Math.round(a * 255); }
  x.setTransform(1, 0, 0, 1, 0, 0); x.putImageData(id, 0, 0); return c;
}

// ---------- graphite rubbed into the paper ----------
// a straight strip (the eraser rubbed up and down a pair of columns): w x h local px, at RS resolution, with the child's
// letters of those columns smeared into it (ghosts), ragged lighter edges, rounded ends
export function rubStrip({ w, h, rng, seed, ghosts = [] }) {
  const R = rng(seed), [c, x] = mk(w * RS, h * RS); x.scale(RS, RS);
  x.save(); x.beginPath(); x.roundRect(0, 0, w, h, w * 0.18); x.clip();
  x.fillStyle = GRAPHITE_FIELD; x.globalAlpha = 0.9; x.fillRect(0, 0, w, h); x.globalAlpha = 1;
  // streaks along the rub (vertical)
  x.lineCap = 'round';
  for (let k = 0; k < w * h / 260; k++) { x.strokeStyle = rgba(R() < 0.55 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.18 + R() * 0.3); x.lineWidth = 1 + R() * 4;
    const sx = R() * w, sy = R() * h, l = 40 + R() * 160; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + (R() - 0.5) * 4, sy + l); x.stroke(); }
  // the child's pencil letters dragged up and down into the black
  for (const g of ghosts) { x.save(); x.globalAlpha = 0.5; x.filter = 'blur(2px)'; x.fillStyle = rgb(GRAPHITE_DARK_RGB);
    for (let d = -18; d <= 18; d += 6) { x.font = `600 ${g.size}px Klee`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(g.ch, g.x, g.y + d); }
    x.restore(); }
  // ragged, lighter edges where it was not rubbed in evenly
  for (const side of [0, 1]) { const gr = x.createLinearGradient(side ? w : 0, 0, side ? w - 14 : 14, 0); gr.addColorStop(0, rgba(GRAPHITE_LIGHT_RGB, 0.95)); gr.addColorStop(1, rgba(GRAPHITE_LIGHT_RGB, 0));
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = gr; x.fillRect(side ? w - 14 : 0, 0, 14, h); }
  x.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < h / 2.2; k++) { const side = R() < 0.5, yy = R() * h, ww = 1 + R() * 6; x.fillStyle = `rgba(0,0,0,${0.4 + R() * 0.6})`; x.fillRect(side ? 0 : w - ww, yy, ww, 2 + R() * 10); }
  for (let k = 0; k < w * h / 40; k++) { x.fillStyle = `rgba(0,0,0,${0.1 + R() * 0.25})`; x.fillRect(R() * w, R() * h, 1 + R() * 2, 1); }
  x.restore();
  return c;
}
// crumbs of black rubber: a small rolled lump
export function crumb(ctx, cx, cy, r, a) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
  ctx.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 0.95); ctx.beginPath(); ctx.ellipse(0, 0, r * 1.7, r, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba(GRAPHITE_DARK_RGB, 0.9); ctx.lineWidth = Math.max(0.6, r * 0.35); ctx.stroke();
  ctx.fillStyle = rgba(PAPER_RGB, 0.25); ctx.beginPath(); ctx.ellipse(-r * 0.5, -r * 0.3, r * 0.6, r * 0.3, 0, 0, 7); ctx.fill(); ctx.restore();
}
export { sm };
