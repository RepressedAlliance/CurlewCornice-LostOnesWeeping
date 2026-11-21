// Segment 00, the opening figure (k0-k8, frames [0, 98), 0.000-3.267 s; docs/分镜/00_开头音型.md 第 9 节 设计丙, 全片分镜 审查后改定 2, 10, 11).
// Design 丙 (after the independent review of design 甲: the review found 68 of 98 frames frozen, the k0 hit felt only on the
// card, and the face sleepy instead of cold; the old page is in archive/seg00_v2_20261120/).
// One framing preset for the whole segment (FRAMING, which seg 16 mirrors): from the middle of her big white bow to the
// collarbones, straight on at her eye height, against a wall printed as a mark sheet (解答用紙).
//   frame 0   she hides behind her card, only her cold, narrowed eyes over it (the thumbnail);
//   k0        (the strongest hit of the song) the reading machine's verdict 「読み取れません」 hits the whole screen: it is
//             printed as wide as the frame, the frame goes dark for an instant and sinks, the camera crashes in on the card,
//             and the print shrinks onto the card's name field in three frames, then soaks into the paper until k1;
//   k1-k3     the town's answers slam onto the wall from both edges on every hit of the guitar figure (k1, k2, k2.5, k3),
//             closing in on her; the camera steps in on the card on k1, k2, k2.5, k3 (still between the steps);
//   k3.5-k4   she takes the card down (an in-between held half a beat) while the camera pulls back to the whole face; the
//             pull-back lands on the bar line k4 with a 10 px dip (over before k4.5);
//   k4.5-k6   more answers slam in on k4.5, k5, k6, close to her hair; a 1.2% punch on k4.5, back by k5; the camera steps
//             in on her stare on k5 and k6;
//             from k6's settle everything is still through the gap in the music;
//   k7        the wall is pencilled black left to right in two frames and the camera punches in 2.7%, held into the cut.
// (2026-11-21 motion pass, 第六节「整屏运动」: the frame moves three times only: the k0 crash-in, now 3.5% from a framing that is
//  already close on the card (one-way, 大击); a slow pull-back to her face k1-k4, three beats eased (not a jolt); the k7 punch
//  (one-way, 大击). The camera steps on k1 k2 k2.5 k3 k5 k6, the k0 sink, the k4 dip and the k4.5 punch are gone; every one of
//  those hits is still answered in the picture by the band of answers slamming onto the wall. The lines above that speak of
//  steps, the sink, the dip and the k4.5 punch describe the earlier pass (archive/seg00_v4_beforemotion_20261121/).)
// The card is her card, drawn only by web/lib/her_card.js (docs/卡面状态.md; 2026-11-21 unification): before k0 the
// printer's blank card ('blank'), from the frame the print lands on 00 k0's first, fine print ('first'), the grid at full
// strength, the holder slot kept. The face is mapped onto the card drawn in each picture by a homography from its four
// measured corners (work/seg/00/card_quad.py) and printed only over the drawing's card-face pixels, inside the card (her
// thumbs, the card's outline and its shading stay the drawing's own); through the slot shows the lanyard behind the card.
// The flying print of the hit is the face's own print (the 'first' face minus the 'blank' face), so it lands as exactly
// what the card then shows.
import { CARD_RATIO } from '../../lib/card.js';
import { drawHerCardFace, herCardBoxes, BACK } from '../../lib/her_card.js';
import { BEAT, FRAME, beatV, createScore, publishAudit, smooth, ease } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, frameTimes, camLerp, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, partAudit, samplesAlong, PIX, partReport } from '../../lib/parts.js';
import { PAPER, TEAL_RGB, INK_RGB, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, rgba } from '../../lib/palette.js';

// ---- the drawings and where their card lies (measured on the generated pictures, image pixels) ----
const DRAW = { cover: '/art/cut/r00_cover_v3.png', mid: '/art/cut/r00_mid_v3.png', hold: '/art/cut/r00_hold_v3.png' };
// card corners in each drawing, [TL, TR, BR, BL] on the outline's centre, measured by fitting each side (work/seg/00/card_quad.py)
// (2026-11-21 parts pass: the corners live in art/cut/seg00_parts.json, per drawing, read with parts.js partOf; no drawing
// borrows another's; PART AUDIT checks them against each drawing's own pixels.)
const PART_FILE = { cover: 'r00_cover_v3', mid: 'r00_mid_v3' };
// the framing preset (seg 16 uses the same): the drawing's scale and top in the frame (centred across), the point between her eyes
export const FRAMING = { s: 1.16, y: -92.8, eyes: [773, 585] };

export default async function seg00(H) {
  const { g, W, P, rng, img, rinPalImage, pencilFill } = H;
  const F0 = 0, F1 = 98, T_END = F1 / 30;
  const SEG = [F0 / 30, T_END];
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d', { willReadFrequently: true })]; };

  // ---------- assets ----------
  const IMG = {};
  for (const [k, f] of Object.entries(DRAW)) IMG[k] = rinPalImage(await img(f));
  const IW = IMG.hold.width, IH = IMG.hold.height;
  const PA = await loadPartAnchors('/art/cut/seg00_parts.json');
  const CARD_Q = {}; for (const [k, d] of Object.entries(PART_FILE)) CARD_Q[k] = partOf(PA, d, 'card').corners;
  const fr = { s: P('fs', FRAMING.s), x: 0, y: P('fy', FRAMING.y) };
  fr.x = W / 2 - (IW / 2) * fr.s;
  const PL = placement({ x: fr.x, y: fr.y, s: fr.s });   // drawing px -> world: the drawing and its card face, one transform
  const toWorld = PL.toWorld;
  const EYES = toWorld(FRAMING.eyes);

  // ---------- her card (web/lib/her_card.js; docs/卡面状态.md) ----------
  // A homography from the card's unit square (a across, b down, both 0..1) to the four measured corners in a drawing.
  const sq2quad = ([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) => {
    const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
    let gg = 0, hh = 0; if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) { const den = dx1 * dy2 - dx2 * dy1; gg = (sx * dy2 - dx2 * sy) / den; hh = (dx1 * sy - sx * dy1) / den; }
    return [x1 - x0 + gg * x1, x3 - x0 + hh * x3, x0, y1 - y0 + gg * y1, y3 - y0 + hh * y3, y0, gg, hh, 1];
  };
  const inv3 = m => { const [a, b, c, d, e, f, gg, h, i] = m, A = e * i - f * h, B = -(d * i - f * gg), C = d * h - e * gg, det = a * A + b * B + c * C;
    return [A / det, -(b * i - c * h) / det, (b * f - c * e) / det, B / det, (a * i - c * gg) / det, -(a * f - c * d) / det, C / det, -(a * h - b * gg) / det, (a * e - b * d) / det]; };
  const hApply = (m, x, y) => { const w = m[6] * x + m[7] * y + m[8]; return [(m[0] * x + m[1] * y + m[2]) / w, (m[3] * x + m[4] * y + m[5]) / w]; };
  const HQ = {}; for (const k of Object.keys(CARD_Q)) HQ[k] = sq2quad(CARD_Q[k]);
  // a point on the card in card-width units (x across, y down; the card is 1 x 1/1.5) -> image pixels of drawing k
  const onCard = (k, cx, cy) => hApply(HQ[k], cx, cy * CARD_RATIO);

  // The card layer of a drawing: the face mapped through the homography onto the drawing's card at 2x the drawing's pixels
  // (drawn back at the drawing's scale; the camera's high-quality filter takes it down to the screen). Only the drawing's
  // card-face pixels take it (light, colourless, inside the card), shaded by the drawing's own shading; the face's holder
  // slot shows the teal lanyard behind the card, in the card's shadow (darker under the slot's top edge).
  const SS = 2, FACE_U = 1600;                   // FACE_U: 0.05u stamp em = 80 px, its 16-dot cell 5 px (whole), so the
  const [SX, SY, SW, SH] = BACK.slot;            // stamp's centred matrix sets exactly (inkjetText rounds the cell up)
  function cardLayer(k, state) {
    const Q = CARD_Q[k], Hi = inv3(HQ[k]), im = IMG[k];
    const bx0 = Math.max(0, Math.floor(Math.min(...Q.map(p => p[0]))) - 1), bx1 = Math.min(IW, Math.ceil(Math.max(...Q.map(p => p[0]))) + 1);
    const by0 = Math.max(0, Math.floor(Math.min(...Q.map(p => p[1]))) - 1), by1 = Math.min(IH, Math.ceil(Math.max(...Q.map(p => p[1]))) + 1);
    const lw = (bx1 - bx0) * SS, lh = (by1 - by0) * SS;
    const [fc, fx] = mk(FACE_U, FACE_U / CARD_RATIO); drawHerCardFace(fx, FACE_U, { state });
    const fw = Math.round(Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]) * SS), fh = Math.round(fw / CARD_RATIO);
    const [pc, px] = mk(fw, fh); px.imageSmoothingEnabled = true; px.imageSmoothingQuality = 'high'; px.drawImage(fc, 0, 0, fw, fh);
    const F = px.getImageData(0, 0, fw, fh).data;
    const [dc, dx] = mk(lw, lh); dx.imageSmoothingEnabled = true; dx.imageSmoothingQuality = 'high'; dx.drawImage(im, bx0, by0, bx1 - bx0, by1 - by0, 0, 0, lw, lh);
    const D = dx.getImageData(0, 0, lw, lh).data, out = dx.createImageData(lw, lh), O = out.data;
    const samp = (fu, fv) => {                       // bilinear, premultiplied: [r*a, g*a, b*a, a] (0..255, a 0..1)
      const x = fu * fw - 0.5, y = fv * fh - 0.5, ix = Math.floor(x), iy = Math.floor(y), tx = x - ix, ty = y - iy, s = [0, 0, 0, 0];
      for (const [ox, oy, wt] of [[0, 0, (1 - tx) * (1 - ty)], [1, 0, tx * (1 - ty)], [0, 1, (1 - tx) * ty], [1, 1, tx * ty]]) {
        const xx = Math.min(fw - 1, Math.max(0, ix + ox)), yy = Math.min(fh - 1, Math.max(0, iy + oy)), o = (yy * fw + xx) * 4, a = F[o + 3] / 255 * wt;
        s[0] += F[o] * a; s[1] += F[o + 1] * a; s[2] += F[o + 2] * a; s[3] += a; }
      return s;
    };
    for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) {
      const [a, b] = hApply(Hi, bx0 + (i + 0.5) / SS, by0 + (j + 0.5) / SS);
      if (a < 0.006 || a > 0.994 || b < 0.009 || b > 0.991) continue;
      const o = (j * lw + i) * 4, r = D[o] / 255, gg = D[o + 1] / 255, bl = D[o + 2] / 255, al = D[o + 3] / 255;
      const mx = Math.max(r, gg, bl), mn = Math.min(r, gg, bl), sat = (mx - mn) / Math.max(mx, 1e-4);
      const w = al * Math.min(1, Math.max(0, (0.11 - sat) / 0.05)) * Math.min(1, Math.max(0, (mx - 0.5) / 0.12));
      if (w <= 0) continue;
      let [pr, pg, pb, pa] = samp(a, b);
      const cy = b / CARD_RATIO;                     // card-width units
      if (pa < 0.999 && a > SX - 0.01 && a < SX + SW + 0.01 && cy > SY - 0.01 && cy < SY + SH + 0.01) {
        const t = Math.min(1, Math.max(0, (cy - SY) / SH)), sh = 0.62 - 0.34 * t;   // the lanyard behind, in the card's shadow
        const lr = TEAL_RGB[0] + (INK_RGB[0] - TEAL_RGB[0]) * sh, lg = TEAL_RGB[1] + (INK_RGB[1] - TEAL_RGB[1]) * sh, lb = TEAL_RGB[2] + (INK_RGB[2] - TEAL_RGB[2]) * sh;
        pr += lr * (1 - pa); pg += lg * (1 - pa); pb += lb * (1 - pa); pa = 1;
      }
      if (pa <= 0) continue;
      O[o] = pr / pa * r; O[o + 1] = pg / pa * gg; O[o + 2] = pb / pa * bl; O[o + 3] = Math.round(255 * w * pa);
    }
    dx.putImageData(out, 0, 0);
    return { c: dc, bx0, by0, bx1, by1 };
  }
  const LAYER = { cover: { blank: cardLayer('cover', 'blank'), first: cardLayer('cover', 'first') }, mid: { first: cardLayer('mid', 'first') } };

  // ---------- the machine's print: the face's own 'first' print, lifted off the card for the flight of the hit ----------
  // The 'first' face minus the 'blank' face (same card, same paper; only the print differs), at u = 4800 (cell 15 px), as
  // an ink sprite: alpha from how much darker each pixel got, colour the print's darkest ink. Its box on the card (card-width
  // units) is where the flight lands, and the size it lands at.
  const SPR_U = 4800, STAMP = (() => {
    const hh = SPR_U / CARD_RATIO, [ac, ax] = mk(SPR_U, hh), [bc, bxx] = mk(SPR_U, hh);
    drawHerCardFace(ax, SPR_U, { state: 'first' }); drawHerCardFace(bxx, SPR_U, { state: 'blank' });
    const X0 = Math.round(SPR_U * 0.05), Y0 = Math.round(SPR_U * 0.085), w = Math.round(SPR_U * 0.9), h = Math.round(SPR_U * 0.12);
    const A = ax.getImageData(X0, Y0, w, h).data, B = bxx.getImageData(X0, Y0, w, h).data, lum = (d, o) => 0.3 * d[o] + 0.59 * d[o + 1] + 0.11 * d[o + 2];
    let lmin = 255, ink = [0, 0, 0], x0 = w, x1 = -1, y0 = h, y1 = -1;
    for (let o = 0; o < A.length; o += 4) { const l = lum(A, o); if (lum(B, o) - l > 8 && l < lmin) { lmin = l; ink = [A[o], A[o + 1], A[o + 2]]; } }
    const [sc, sx] = mk(w, h), sd = sx.createImageData(w, h), S2 = sd.data;
    for (let o = 0, p = 0; o < A.length; o += 4, p++) {
      const lb = lum(B, o), drop = lb - lum(A, o); if (drop <= 8) continue;
      const a = Math.min(1, drop / Math.max(1, lb - lmin)); S2[o] = ink[0]; S2[o + 1] = ink[1]; S2[o + 2] = ink[2]; S2[o + 3] = Math.round(255 * a);
      const xx = p % w, yy = Math.floor(p / w); if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy;
    }
    sx.putImageData(sd, 0, 0);
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1, [c] = mk(cw, ch); c.getContext('2d').drawImage(sc, -x0, -y0);
    return { c, box: [(X0 + x0) / SPR_U, (Y0 + y0) / SPR_U, cw / SPR_U, ch / SPR_U], ink };   // box in card-width units
  })();
  const cardPx = Math.hypot(CARD_Q.cover[1][0] - CARD_Q.cover[0][0], CARD_Q.cover[1][1] - CARD_Q.cover[0][1]) * fr.s;   // card width in the world
  const PCX = STAMP.box[0] + STAMP.box[2] / 2, PCY = STAMP.box[1] + STAMP.box[3] / 2;   // the print's centre on the card (from her_card)
  const PW = STAMP.box[2] * cardPx, PH = STAMP.box[3] * cardPx;                         // the landed print's size in the world
  const TEXT = '読み取れません';

  // ---------- the score: every event on the measured beat (lib/score.js) ----------
  const S = createScore('seg_00', { t0: SEG[0], t1: SEG[1] });
  const ev = S.ev;
  const T_HIT = ev('print 読み取れません hits the whole frame (frame-wide print, dark, crash-in on the card)', beatV(0));
  ev('print soaking into the card; the camera still on the card', beatV(0.5), 'half');
  // the wall's answers, filled in from both edges one band per hit of the opening figure (2026-11-21 rhythm pass, user: "这是一首
  //摇滚乐……希望视频跟歌曲节奏一致"). The guitar figure measured on the accompaniment stem (spectral flux, work/rhythm_diag):
  // hits on k0, k0.5, k1 | k2, k2.5, k3 | k4, k4.5, k5 | k6 (weaker), then the gap k6.25-k6.9, k7 the loudest hit. Every hit
  // after k0 gets a band of marks that slams in (1.3x -> 1.0 in three frames, fresh graphite darker); k0.5 is the print's
  // landing, k4 her reveal. The half-beat bands (k2.5, k4.5) are real guitar hits (flux 0.93 / 0.70 at +4 / +1 ms).
  // 2026-11-21 review fix: on the no_vocals stem k2.5 and k4.5 are as strong as the hits around them (onset strength 0.14 /
  // 0.18 against 0.17-0.19), but their bands were one or two bubble columns (k4.5 was a single column on the left, 0.08% of
  // the pixels) and the camera did nothing, so groups 2 and 3 read as two hits. Now each half-beat band holds 3-4 columns
  // (fronts are set on the real bubble columns, d = distance from the nearer edge), and each half beat moves the camera too.
  const FILLS = [[1, 'beat'], [2, 'beat'], [2.5, 'half'], [3, 'beat'], [4.5, 'half'], [5, 'beat'], [6, 'beat']];
  const T_FILL = FILLS.map(([k, lv]) => ev(`answers slam onto the wall, band k${k} (both edges inwards)${k === 1 ? '; print has soaked in' : ''}${[4.5, 5, 6].includes(k) ? '; every answer on the wall throbs' : ''}`, beatV(k), lv));
  const T_MID = beatV(3.5), T_SWAP = beatV(4);
  // 2026-11-21 motion pass (docs/制作约定.md 第六节「整屏运动」, user: 「你为什么要一直抖动屏幕？……看着很晕」): the frame moves only
  // three times: the k0 crash (大击, one-way), a slow pull-back k1-k4 (eased in and out over three beats: not a jolt), the k7 punch (大击, one-way,
  // held to the cut). The camera steps on k1 k2 k2.5 k3 k5 k6, the k0 sink, the k4 dip and the k4.5 punch are gone: those hits
  // are the answers slamming onto the wall (in the picture, the frame still).
  const T_PULL = ev('camera starts the slow pull-back from the card to her face (k1-k4, eased in and out)', beatV(1));
  ev('card coming down (in-between)', T_MID, 'half');
  ev('pull-back lands on her whole face (bar line); camera still until k7', T_SWAP);
  const T_BLACK = ev('wall goes black left to right (2 frames) + camera punch 2.7% (大击, held to the cut)', beatV(7));
  S.hold('shot', 'shot close-up', SEG[0], T_END, { kind: 'shot', onBeat: false });
  S.hold('rin', 'card up to her nose, only her cold eyes', SEG[0], T_MID, { kind: 'key', file: DRAW.cover, use: 'cover', onBeat: false });
  S.hold('rin', 'card coming down (in-between)', T_MID, T_SWAP, { kind: 'inbetween', file: DRAW.mid, use: 'mid' });
  S.hold('rin', 'card down, her bare face staring', T_SWAP, T_END, { kind: 'key', file: DRAW.hold, use: 'hold' });
  S.finish();

  // ---------- the wall: an answer sheet (解答用紙) printed as a wall ----------
  // Small vertical bubbles in five-choice rows like a real mark sheet: question number cells, bands of five rows, a header,
  // timing marks down the left edge (the black the machine reads). Answers are one mark a row, irregular like real answers.
  const M = 70, WW = W + 2 * M, WH = 1080 + 2 * M;            // drawn larger than the frame so the sink never shows its edge
  const BRX = 9.5, BRY = 14.5, BP = 31, NUMW = 48, GUT = 30, BLOCK = NUMW + 5 * BP + GUT;   // a bubble; one answer block
  const ROW = 42, ROW0 = 136, HEAD = 70;                        // row pitch, the first row's centre, the header band's height
  const BLOCKS = [], ROWS = [];
  for (let b = -5; b <= 4; b++) BLOCKS.push(W / 2 + b * BLOCK + GUT / 2);   // block left edges (world), symmetric about the centre
  for (let y = ROW0; y < 1080 + M; y += ROW) ROWS.push(y);
  const bubbleX = (bx, i) => bx + NUMW + BP * (i + 0.5);
  const R0 = rng(41), ANSWERS = [];                              // [x, y] of every mark the town will have filled in
  BLOCKS.forEach(bx => ROWS.forEach(y => { if (R0() < 0.92) ANSWERS.push([bubbleX(bx, Math.floor(R0() * 5)), y, R0()]); }));
  const TEALA = a => rgba(TEAL_RGB, a);
  const [wallC, wallS] = mk(WW, WH);
  { const s = wallS; s.save(); s.translate(M, M);
    s.fillStyle = PAPER; s.fillRect(-M, -M, WW, WH);
    s.fillStyle = rgba(INK_RGB, P('wshade', 0.06)); s.fillRect(-M, -M, WW, WH);              // the wall in shade: colder than paper
    // header band
    s.fillStyle = TEALA(0.12); s.fillRect(-M, -M, WW, HEAD + M);
    s.fillStyle = TEALA(0.75); s.textBaseline = 'middle';
    s.font = '700 30px ZenKakuB'; s.textAlign = 'left'; s.fillText('解答用紙', 64, HEAD / 2 + 2);
    s.font = '500 17px ZenKaku'; s.fillText('マーク例', 224, HEAD / 2 + 2);
    s.fillText('良い例', 306, HEAD / 2 + 2); s.fillText('悪い例', 410, HEAD / 2 + 2);
    s.textAlign = 'right'; s.fillText('HBの鉛筆で、○の中を正確にぬりつぶすこと。', W - 64, HEAD / 2 + 2);
    // the examples: a good mark and two bad ones
    const ovalPath = (x, y) => { s.beginPath(); s.ellipse(x, y, BRX, BRY, 0, 0, 7); };
    s.strokeStyle = TEALA(0.75); s.lineWidth = 2;
    ovalPath(374, HEAD / 2 + 2); s.stroke();
    s.save(); ovalPath(374, HEAD / 2 + 2); s.clip(); s.fillStyle = rgba(INK_RGB, 0.6); s.fillRect(360, 0, 30, HEAD);
    pencilFill(s, 374, HEAD / 2 + 2, BRX * 0.95, BRY * 0.95, 1600, rng(5), { over: 0.1 }); s.restore();
    ovalPath(478, HEAD / 2 + 2); s.stroke(); ovalPath(506, HEAD / 2 + 2); s.stroke();
    s.strokeStyle = rgba(INK_RGB, 0.7); s.lineWidth = 2.4; s.beginPath(); s.moveTo(471, HEAD / 2 + 2); s.lineTo(477, HEAD / 2 + 9); s.lineTo(487, HEAD / 2 - 8); s.stroke();
    s.beginPath(); s.moveTo(499, HEAD / 2 - 4); s.lineTo(513, HEAD / 2 + 8); s.stroke();
    // column heads
    s.font = '500 14px ZenKaku'; s.textAlign = 'center'; s.fillStyle = TEALA(0.7);
    BLOCKS.forEach(bx => { s.fillText('番号', bx + NUMW / 2, HEAD + 22); s.fillText('解　答　欄', bx + NUMW + 2.5 * BP, HEAD + 22); });
    s.strokeStyle = TEALA(0.45); s.lineWidth = 1.5; s.beginPath(); s.moveTo(-M, HEAD + 38); s.lineTo(W + M, HEAD + 38); s.stroke();
    // bands of five rows, number cells, bubbles with their digits
    ROWS.forEach((y, r) => { if (Math.floor(r / 5) % 2 === 0) { s.fillStyle = TEALA(0.055); s.fillRect(-M, y - ROW / 2, WW, ROW); } });
    BLOCKS.forEach((bx, b) => {
      s.fillStyle = TEALA(0.09); s.fillRect(bx, ROWS[0] - ROW / 2, NUMW, ROWS.length * ROW);
      s.strokeStyle = TEALA(0.45); s.lineWidth = 1.4; s.strokeRect(bx, ROWS[0] - ROW / 2, NUMW + 5 * BP, ROWS.length * ROW);
      ROWS.forEach((y, r) => {
        s.fillStyle = TEALA(0.62); s.font = '700 17px ZenKakuB'; s.fillText(String(b * ROWS.length + r + 1), bx + NUMW / 2, y + 1);
        s.font = '500 12px ZenKaku'; s.fillStyle = TEALA(0.42); s.strokeStyle = TEALA(0.44); s.lineWidth = 1.8;
        for (let i = 0; i < 5; i++) { const x = bubbleX(bx, i); s.beginPath(); s.ellipse(x, y, BRX, BRY, 0, 0, 7); s.stroke(); s.fillText(String(i + 1), x, y + 1); }
        if (r % 5 === 4) { s.strokeStyle = TEALA(0.3); s.lineWidth = 1; s.beginPath(); s.moveTo(bx, y + ROW / 2); s.lineTo(bx + NUMW + 5 * BP, y + ROW / 2); s.stroke(); }
      });
    });
    // timing marks down the left edge
    s.fillStyle = rgba(INK_RGB, 0.92); ROWS.forEach(y => s.fillRect(14, y - 5, 26, 10));
    s.restore(); }
  // the marks, one layer a fill step: everything outside the two fronts is filled (a clean solid pencil fill, Demo 1's marks)
  // Fronts by bubble columns (d from the nearer edge; left columns d 339.5 370.5 401.5 432.5 463.5 | 572.5 603.5 634.5, right
  // 291.5 | 322.5 353.5 384.5 415.5 | 524.5 555.5 586.5 617.5 648.5):
  //   k1 d<300 (5 columns in view), k2 322 339 353, k2.5 370 384 401 415, k3 432 463 524, k4.5 555 572 586 (beside her hair),
  //   k5 603 617, k6 634 648. (Before: k2.5 3 columns, k4.5 the single column 463.5 on the left and none on the right.)
  const FRONT_L = [-1e9, ...[300, 362, 420, 540, 595, 625, 660].map(v => P('front', 1) * v)];
  const FRONT_R = FRONT_L.map(v => W - v);
  const STATE = FRONT_L.map(() => null), BAND = FRONT_L.map(() => null), BANDM = FRONT_L.map(() => []);
  { const R = rng(17); let prev = wallC;
    for (let i = 0; i < FRONT_L.length; i++) {
      const [c, s] = mk(WW, WH); s.drawImage(prev, 0, 0);
      const [bc, bs] = mk(WW, WH);                 // this band's marks alone (composited onto the state: same pixels)
      for (const [x, y, q] of ANSWERS) {
        const inNow = x < FRONT_L[i] || x > FRONT_R[i], inBefore = i > 0 && (x < FRONT_L[i - 1] || x > FRONT_R[i - 1]);
        if (!inNow || inBefore) continue;
        bs.save(); bs.translate(M, M); bs.beginPath(); bs.ellipse(x, y, BRX * 0.94, BRY * 0.92, 0, 0, 7); bs.clip();
        bs.fillStyle = rgba(INK_RGB, 0.62 + q * 0.1); bs.fillRect(x - BRX, y - BRY, 2 * BRX, 2 * BRY);
        pencilFill(bs, x, y, BRX, BRY, 1600, R, { over: 0.1 }); bs.restore();
        BANDM[i].push([x, y]);
      }
      s.drawImage(bc, 0, 0);
      STATE[i] = c; BAND[i] = bc; prev = c;
    } }
  const stateAt = tt => { let i = 0; T_FILL.forEach((t, j) => { if (tt >= t) i = j + 1; }); return i; };
  // the slam of a band: frame by frame from its hit, each fresh mark's scale about its own centre and the extra graphite on it
  const SLAM = [P('slam0', 1.3), P('slam1', 1.12), P('slam2', 1.04)], SLAM_DARK = [0.6, 0.25, 0.08];
  function drawWall(c, tt) {
    const i = stateAt(tt), a = i > 0 ? tt - T_FILL[i - 1] : 1, fi = Math.floor(a / FRAME + 1e-6);
    if (i === 0 || fi >= SLAM.length) { c.drawImage(STATE[i], -M, -M); drawThrob(c, tt, i); return; }
    c.drawImage(STATE[i - 1], -M, -M);
    const sc = SLAM[fi], sw = 2 * BRX + 4, sh = 2 * BRY + 4;
    for (const pass of [1, SLAM_DARK[fi]]) { if (pass <= 0) continue; c.save(); c.globalAlpha = pass;
      for (const [x, y] of BANDM[i]) c.drawImage(BAND[i], x + M - sw / 2, y + M - sh / 2, sw, sh, x - sw * sc / 2, y - sh * sc / 2, sw * sc, sh * sc);
      c.restore(); }
    drawThrob(c, tt, i);
  }
  // 2026-11-21 motion pass: k4.5, k5, k6 used to be carried by the camera (a punch and two steps). Their own bands lie mostly
  // behind her hair, so now on each of those hits every answer already on the wall slams again about its own centre (the frame
  // and the wall stay put; nothing moves as a whole): the wall throbs with the guitar, a little harder each time.
  const THROB_K = [4.5, 5, 6], THROB_T = THROB_K.map(k => T_FILL[FILLS.findIndex(f => f[0] === k)]), THROB_A = [0.75, 0.88, 1];
  const THROB = [1.16, 1.07, 1.02], THROB_DARK = [0.45, 0.18, 0.05];
  function drawThrob(c, tt, i) {
    const n = THROB_T.findIndex(t => tt >= t && tt - t < THROB.length * FRAME - 1e-6); if (n < 0) return;
    const fi = Math.floor((tt - THROB_T[n]) / FRAME + 1e-6), sc = 1 + (THROB[fi] - 1) * THROB_A[n], sw = 2 * BRX + 4, sh = 2 * BRY + 4;
    const band = T_FILL.indexOf(THROB_T[n]) + 1;                  // that hit's own band slams already; the rest throb
    for (const pass of [1, THROB_DARK[fi] * THROB_A[n]]) { if (pass <= 0) continue; c.save(); c.globalAlpha = pass;
      for (let j = 1; j <= i; j++) { if (j === band) continue; for (const [x, y] of BANDM[j]) c.drawImage(BAND[j], x + M - sw / 2, y + M - sh / 2, sw, sh, x - sw * sc / 2, y - sh * sc / 2, sw * sc, sh * sc); }
      c.restore(); }
  }
  // after k7: the same wall pencilled over, the page under many layers of pencil as in Demo 2 (GRAPHITE_FIELD and its strokes);
  // every bubble filled darker still, its printed ring only faintly through the graphite
  const [blackC, blackS] = mk(WW, WH);
  { blackS.fillStyle = GRAPHITE_FIELD; blackS.fillRect(0, 0, WW, WH); const r = rng(9); blackS.lineCap = 'round';
    for (let k = 0; k < 2600; k++) { blackS.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); blackS.lineWidth = 2 + r() * 5;
      const x = r() * WW, y = r() * WH, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16; blackS.beginPath(); blackS.moveTo(x, y); blackS.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); blackS.stroke(); }
    blackS.save(); blackS.translate(M, M);
    BLOCKS.forEach(bx => ROWS.forEach(y => { for (let i = 0; i < 5; i++) { const x = bubbleX(bx, i);
      blackS.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.9); blackS.beginPath(); blackS.ellipse(x, y, BRX * 0.97, BRY * 0.95, 0, 0, 7); blackS.fill();
      blackS.strokeStyle = TEALA(0.16); blackS.lineWidth = 2; blackS.beginPath(); blackS.ellipse(x, y, BRX, BRY, 0, 0, 7); blackS.stroke(); } }));
    blackS.restore(); }
  // the front of the black as it sweeps: a band of fresh strokes along a ragged edge
  const FRONT = []; { const r = rng(23); for (let y = -M; y < WH; y += 9) FRONT.push({ y, dx: -r() * 120, l: 50 + r() * 70, w: 3 + r() * 4, a: 0.6 + r() * 0.3, ang: -0.5 + (r() - 0.5) * 0.16 }); }

  // ---------- camera ----------
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  const [PX, PY] = toWorld(onCard('cover', PCX, PCY));                       // the print's centre on the card (world)
  const F_CARD = [W / 2, (EYES[1] + PY) / 2 + P('fcy', 0)];                  // the crash-in centre: her eyes and the print
  // The crash-in (大击 k0, the strongest hit of the song): before the hit the camera already sits close on the card and her eyes
  // (the thumbnail), on the hit it crashes in 3.5% in two frames, runs 8% past and stops (one-way, corners about 2.2% of the
  // width; 第六节 规则 3/4). It holds still to k1, then pulls back slowly to her whole face over three beats, landing on the bar
  // line k4 (规则 8: a move this big takes at least three beats, eased in and out); the hits k1-k3 are the answers slamming in.
  const Z_PRE = P('zpre', 1.165), CRASH = P('crash', 0.028), Z_SET = Z_PRE * (1 + CRASH);
  const CRASH_PROF = [0.6, 0.95, 1.08, 1.02, 1.0];
  const camBase = tt => {
    if (tt < T_HIT) return [Z_PRE, ...F_CARD];
    const fi = Math.floor((tt - T_HIT) / FRAME + 1e-6);
    if (fi < CRASH_PROF.length) return [Z_PRE * (1 + CRASH * CRASH_PROF[fi]), ...F_CARD];
    if (tt < T_PULL) return [Z_SET, ...F_CARD];
    // k1-k4: back to her whole face, eased in and out (smoothstep), one way, no overshoot, no dip; lands on the bar line
    if (tt < T_SWAP) return camLerp(Z_SET, F_CARD, 1, EYES, smooth((tt - T_PULL) / (T_SWAP - T_PULL)), EYES);
    return [1, ...EYES];
  };
  // the punch on k7 (the loudest hit before the riff, 大击): 2.7% in, centred between her eyes; past half on the beat's frame,
  // full on the third, then held (one-way) into the cut on k8
  const PUNCH_UP = [0.6, 0.9, 1.0];
  const punchAt = tt => { const a = tt - T_BLACK; if (a < 0) return 0; const fi = Math.floor(a / FRAME + 1e-6);
    return P('punch', 0.027) * PUNCH_UP[Math.min(fi, PUNCH_UP.length - 1)]; };
  const camAt = tt => { const [z, fx, fy] = camBase(tt); return [z * (1 + punchAt(tt)), fx, fy]; };
  const sinkAt = () => 0;   // no sink, no dip (第六节 规则 4)
  // the dark of the impact, frame by frame from the hit
  const DARK = [P('dark0', 0.5), P('dark1', 0.26), P('dark2', 0.1)];
  const darkAt = tt => { const a = tt - T_HIT; if (a < 0) return 0; const fi = Math.floor(a / FRAME + 1e-6); return fi < 3 ? DARK[fi] : 0; };
  // the wall's black front: from the left edge to past the right edge over the first two frames at or after k7 (never before it)
  const blackFront = tt => Math.min(1, Math.max(0, (tt - T_BLACK + 0.001) / (1.25 * FRAME)));

  // the print's flight: frame 0 of the hit as wide as the frame (screen-centred), frame 1 in the air in front of the card
  // (3.1x, between the frame's centre and the landing point), frame 2 the overshoot: already ON the landing point (m 1, the
  // card's print as it sits on screen that frame, the sink included) and 1.28x about it, so it lies inside the name field
  // (about 0.45u x 0.07u) and never over the header 折り曲げないでください or the 氏名 label (problem list: a slam's overshoot
  // frame is checked by its real ink box, the same class as 03's title slam). From frame 3 it is the card's own 'first' face.
  const PFLY = [{ w: P('pw0', 0.84), m: 0 }, { w: 0, k: P('pk1', 3.1), m: 0.55 }, { w: 0, k: P('pk2', 1.28), m: 1, onCard: true }];
  const landed = tt => tt - T_HIT >= 3 * FRAME - 1e-6;
  function printState(tt) {
    const a = tt - T_HIT; if (a < 0 || landed(tt)) return null;
    const fi = Math.floor(a / FRAME + 1e-6);
    const [z, fx0, fy0] = camAt(tt), v = CAM.view(z, fx0, fy0), f = PFLY[fi];
    const w = f.w ? f.w * W / v.z : PW * f.k, h = w * PH / PW;
    const ty = PY + (f.onCard ? sinkAt(tt) : 0);           // onCard: where the print sits on the sunk card that frame
    return { x: v.fx + (PX - v.fx) * f.m, y: v.fy + (ty - v.fy) * f.m, w, h, v };
  }
  const layerAt = (k, tt) => k === 'cover' ? LAYER.cover[landed(tt) ? 'first' : 'blank'] : k === 'mid' ? LAYER.mid.first : null;
  const TO_SCREEN = (v, [x, y], sink = 0) => [(x - v.fx) * v.z + W / 2, (y + sink - v.fy) * v.z + 540];

  // ---------- layout ----------
  const LAY = createLayout();
  // the card face in card space (u = 1000), as the card shows it from the landing on ('first'): her_card's registered boxes,
  // plus the print's ink as actually drawn (measured off the face), checked against the card's own labels and the card's edge
  const CU = 1000, CHt = CU / CARD_RATIO, FB = herCardBoxes(CU, { state: 'first' });
  for (const [n, b] of Object.entries(FB.lines)) LAY.text(`card ${n}`, 'cardface', b);
  for (const [n, b] of Object.entries(FB.labels)) LAY.text(`card label ${n}`, 'cardface', b);
  LAY.audit('seg_00 card face (first)');
  LAY.text('card print ink (measured)', 'cardink', STAMP.box.map(v => v * CU));
  for (const [n, b] of Object.entries(FB.labels)) LAY.text(`card label ${n}`, 'cardink', b);
  LAY.audit('seg_00 card print ink vs labels');
  LAY.frameCheck('card face inside the card', { sheets: { cardface: p => p, cardink: p => p }, views: [{ t: 0, z: 1, fx: CU / 2, fy: CHt / 2 }], W: CU, H: CHt, inset: CU * 0.035 });
  // the print on the card in the frame (world), checked against the frame every frame it is seen
  const PBOX = [PX - PW / 2, PY - PH / 2, PW, PH];
  { LAY.text(TEXT, 'card:print', PBOX);
    const cw = toWorld(CARD_Q.cover[0]), ce = toWorld(CARD_Q.cover[2]); LAY.reg('card', 'card', [cw[0], cw[1], ce[0] - cw[0], ce[1] - cw[1]]);
    const zh = Z_SET * PH / 1080 * 100;
    console.warn(`FIELD AUDIT seg_00: her card 'first' print (her_card.js) ${Math.round(PW)}x${Math.round(PH)}px in the world (${(STAMP.box[2]).toFixed(3)}u x ${(STAMP.box[3]).toFixed(3)}u of the card, ${(PH / 1080 * 100).toFixed(1)}% of the frame height at zoom 1, ${zh.toFixed(1)}% after the crash-in); card ${Math.round(cardPx)}px wide in the world`);
    // the frame-wide print of the hit: it must be whole in the frame
    const st = printState(T_HIT + 0.01), [sx0, sy0] = TO_SCREEN(st.v, [st.x - st.w / 2, st.y - st.h / 2]);
    const bx = [sx0, sy0, st.w * st.v.z, st.h * st.v.z], whole = bx[0] >= 0 && bx[1] >= 0 && bx[0] + bx[2] <= W && bx[1] + bx[3] <= 1080;
    console.warn(`FIELD AUDIT seg_00 hit frame: frame-wide print ${Math.round(bx[2])}x${Math.round(bx[3])}px on screen (${(bx[3] / 1080 * 100).toFixed(1)}% of the frame height), ${whole ? 'whole inside the frame' : 'CUT BY THE FRAME'}`); }
  LAY.audit('seg_00 card');
  LAY.frameCheck('card print while the card is up', { sheets: { 'card:print': p => p },
    views: frameTimes(SEG[0], T_HIT + 3 * FRAME, T_MID).map(t => { const [z, fx, fy] = camAt(t); return { t, ...CAM.view(z, fx, fy) }; }) });
  // FLIGHT AUDIT: the flying print's ink box on screen, frame by frame, against the card's preprinted labels as they are on
  // screen that frame (the picture sinks; the print flies above it and does not). The hit frame covers the whole frame by
  // design; the next two are checked: in the air in front of the card, over a label or not, and inside the frame or not.
  const flight = [];
  for (const t of frameTimes(SEG[0], T_HIT, T_HIT + 3 * FRAME)) {
    const st = printState(t); if (!st) continue;
    const fi = Math.round((t - T_HIT) / FRAME), sink = sinkAt(t), [x0, y0] = TO_SCREEN(st.v, [st.x - st.w / 2, st.y - st.h / 2]);
    const box = [x0, y0, st.w * st.v.z, st.h * st.v.z], hits = [];
    for (const [n, b] of Object.entries(FB.labels)) {
      const p0 = TO_SCREEN(st.v, toWorld(onCard('cover', b[0] / CU, b[1] / CU)), sink), p1 = TO_SCREEN(st.v, toWorld(onCard('cover', (b[0] + b[2]) / CU, (b[1] + b[3]) / CU)), sink);
      if (box[0] < p1[0] && box[0] + box[2] > p0[0] && box[1] < p1[1] && box[1] + box[3] > p0[1]) hits.push(n);
    }
    const inFrame = box[0] >= 0 && box[1] >= 0 && box[0] + box[2] <= W && box[1] + box[3] <= 1080;
    flight.push({ frame: Math.round(t * 30), fi, box: box.map(Math.round), over: hits, inFrame });
    console.warn(`FLIGHT AUDIT seg_00 frame ${Math.round(t * 30)} (hit +${fi}): print ${box.map(Math.round).join(',')} on screen, ${inFrame ? 'inside the frame' : 'CUT BY THE FRAME'}; ${fi === 0 ? 'frame-wide by design' : hits.length ? 'over card labels: ' + hits.join(', ') : 'clear of the card labels'}`);
  }
  // the bitmap's largest magnification on screen (docs/交付检查清单 26: hard limit 1.5)
  { let zmax = 0; for (const t of frameTimes(SEG[0], SEG[0], T_END)) zmax = Math.max(zmax, CAM.view(...camAt(t)).z);
    console.warn(`SCALE AUDIT seg_00: drawing scale ${fr.s.toFixed(3)}, largest camera zoom ${zmax.toFixed(3)}, largest magnification on screen ${(fr.s * zmax).toFixed(3)} (limit 1.5)`); }
  // MOTION AUDIT (第六节「整屏运动」): every frame's view as shown; the segment opens on a cut (frame 0 has no previous frame)
  const MOTION_R = motionAudit('seg_00', frameTimes(SEG[0], SEG[0], T_END).map(t => { const [z, fx, fy] = camAt(t); return { t, ...CAM.view(z, fx, fy) }; }),
    { big: [[T_HIT, 'k0 全曲最响的一下: 読み取れません 砸向卡'], [T_BLACK, 'k7 riff 前最响的一下: 墙被铅笔涂黑']],
      whips: [] });
  // PART AUDIT (parts.js): the card corners each drawing's face is mapped onto lie on THAT drawing's card outline (sides sampled
  // 5-95%, off the rounded corners; her thumbs over the outline are hidden), and the inside of the quad is the drawing's own
  // light card face (thumbs hidden), so the printed face sits exactly on the drawn card.
  const OUTLINE = p => p[3] > 200 && Math.max(p[0], p[1], p[2]) < 110;
  const CARDFACE = p => p[3] > 200 && Math.max(p[0], p[1], p[2]) > 215 && Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]) < 26;
  for (const [k, d] of Object.entries(PART_FILE)) {
    const Q = CARD_Q[k], inPic = ([x, y]) => x >= 0 && y >= 0 && x < IW - 3 && y < IH - 3;
    const edge = []; for (let i = 0; i < 4; i++) { const a = Q[i], b = Q[(i + 1) % 4], A = [a[0] + (b[0] - a[0]) * 0.05, a[1] + (b[1] - a[1]) * 0.05], B = [a[0] + (b[0] - a[0]) * 0.95, a[1] + (b[1] - a[1]) * 0.95];
      edge.push(...samplesAlong(A, B, 100).filter(inPic)); }
    partAudit('seg_00', d, 'card outline', { image: IMG[k], points: edge, on: OUTLINE, hidden: PIX.skin });
    const face = []; for (let i = 0; i < 30; i++) for (let j = 0; j < 20; j++) face.push(hApply(HQ[k], 0.06 + 0.88 * i / 29, 0.08 + 0.84 * j / 19));
    partAudit('seg_00', d, 'card face', { image: IMG[k], points: face.filter(inPic), on: CARDFACE, hidden: PIX.skin, r: 1 });
  }
  const PARTS_R = partReport('seg_00');
  publishAudit(S, LAY, { motion: MOTION_R, parts: PARTS_R, framing: { ...FRAMING, s: fr.s, x: fr.x, y: fr.y },
    grid: { BLOCK, BP, BRX, BRY, ROW, ROW0, blocks: BLOCKS, rows: ROWS.length, fronts: FRONT_L.slice(1) },
    card: { source: 'web/lib/her_card.js', states: { before: 'blank', fromLanding: 'first' }, quads: CARD_Q, printBox: STAMP.box, ink: STAMP.ink, cardPx, flight } });

  window.renderAt = async t => {
    const tt = t;                                        // no lead: on the hit
    const R = S.at('rin', tt), k = R.use;
    const sink = sinkAt(tt), bf = blackFront(tt), dark = darkAt(tt), ps = printState(tt), L = layerAt(k, tt);
    CAM.shoot(camAt(tt), 0, tt, c => {
      c.save(); c.translate(0, sink);
      drawWall(c, tt);
      if (bf > 0) { // the black sweeps in from the left; its front is a ragged band of fresh pencil strokes
        const xf = -M + bf * (WW + 260), edge = y => xf + 30 * Math.sin(y * 0.031) + 18 * Math.sin(y * 0.11 + 1.7);
        c.save(); c.beginPath(); c.moveTo(-M, -M);
        for (let y = -M; y <= WH; y += 24) c.lineTo(edge(y), y);
        c.lineTo(-M, WH); c.closePath(); c.clip(); c.drawImage(blackC, -M, -M); c.restore();
        if (bf < 1) { c.save(); c.lineCap = 'round';
          for (const s of FRONT) { const x = edge(s.y) + s.dx, dx = Math.cos(s.ang) * s.l / 2, dy = Math.sin(s.ang) * s.l / 2;
            c.strokeStyle = rgba(INK_RGB, s.a); c.lineWidth = s.w; c.beginPath(); c.moveTo(x - dx, s.y - dy); c.lineTo(x + dx, s.y + dy); c.stroke(); }
          c.restore(); }
      }
      drawImageAt(c, PL, IMG[k]);                                                                    // the drawing ...
      if (L) drawPart(c, PL, cc => cc.drawImage(L.c, L.bx0, L.by0, L.bx1 - L.bx0, L.by1 - L.by0));  // ... her card's face, same transform
      c.restore();
    });
    // the impact: the whole frame goes dark for an instant, the flying print on top of it
    if (dark > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = rgba(INK_RGB, dark); g.fillRect(0, 0, W, 1080); }
    if (ps) {
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.translate(W / 2, 540); g.scale(ps.v.z, ps.v.z); g.translate(-ps.v.fx, -ps.v.fy);
      g.drawImage(STAMP.c, ps.x - ps.w / 2, ps.y - ps.h / 2, ps.w, ps.h);
      g.restore();
    }
  };
  await window.renderAt(SEG[0]);
}
