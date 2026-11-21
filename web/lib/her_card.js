// Her card (鏡音リン's 個人読取カード): the one way to draw it, front and back, for every segment. The state is
// docs/卡面状態.md (the film's single card state); the face code is moved here unchanged from seg_03.js (third version,
// 2026-11-21), so 03 and every later segment print the same card from the same numbers (根因清单: 说“同一个”的，代码里
// 直接用同一组数或同一个函数).
//
// Coordinates: card space. Origin at the card face's top-left corner, x right, y down, in pixels of a card u px wide;
// the card is u x u / CARD_RATIO (3:2, 15 x 10 cm). All the layout numbers below are fractions of u.
//
//   import { herCardFace, drawHerCardFace, herCardBoxes, herCardBack } from '../../lib/her_card.js';
//
//   herCardFace(u, opts)            -> a canvas u x u/1.5 with the face (a fresh canvas; cached when the face is static)
//   drawHerCardFace(ctx, u, opts)   -> draws the face into ctx at card space (origin = the card's top-left)
//     opts.state   'blank'  the printer's blank card (nothing printed yet; grid at full strength)
//                  'first'  00 k0's first, fine print of 読み取れません (drawCard's own stamp), grid at full strength (00-01 k24)
//                  'band'   01 k24's thick reprint: the band only, inside the name field; grid at full strength (01 k24-03 k40)
//                  'title'  (default) 03 k40 on: band + ロストワン (16-dot, emphasised) + の号哭 (her pencil); the grid under
//                           the title pressed to 22%, a paper-white halo knocked out round ロストワン's dots
//     opts.sweep   0..1, 'title' only: how far the print head has swept (the press and the halo follow it); default 1.
//                  03 k40 uses sweep = min(1, (frames since the hit + 1) / 3)
//     opts.age     seconds since ロストワン's hit (print16's three-frame build), 'title' only; default 9 (settled)
//     opts.slam    true: the hit lands large about the dots' TOP-LEFT (x 1.22 on the hit frame, back to 1 in 3 frames);
//                  never print16's own centred slam (it grows left over 学籍番号)
//     opts.pencil  false: leave の号哭 out (a page that writes it stroke by stroke itself, as 03 k41-k44.5 does)
//     opts.ink     false: the face before the title's ink (the band and the pressed grid, no ロストワン / の号哭)
//   herCardBoxes(u, { age, slam })  -> { lines, labels }: boxes [x, y, w, h] in card space for the layout audit
//     lines   '読み取れません' (the band's ink), 'ロストワン' (its dots; with slam/age, the box as drawn on that frame),
//             'の号哭' (her letters)
//     labels  the card's own preprinted words and label blocks (個人読取カード, 折り曲げないでください, No., 氏名 label,
//             学籍番号 label, 偏差値 label, こころ row): register them with the lines so nothing is printed over a label
//   herCardBack(u, opts) / drawHerCardBack(ctx, u, opts)  -> the back (docs/卡面状態.md 第四节), see below
//   herCardBackRuled(u) / drawHerCardBackRuled(ctx, u) / HER_BACK_RULED / ruledLineBox / herCardBackRuledBoxes -> 04's ruled
//                                  back (全片分镜 改定 15; 04 and 11), see "the ruled back" at the end
//   drawHerWords(ctx, u, chars, tt) / herWordsBoxes(u) / HER_WORDS -> her pencil もうどうだって／いいや on the face from the
//                                  yank on (14 k483-k488, 15 S1), see "her words" below
//
// Lower-level pieces (03 uses them for its print-head sweep and its stroke-by-stroke pencil): herCardBase(u, knocked),
// inkLine1(ctx, u, age, slam), line2Pos(u), slamAt(age, slam), line1Anchor(u), drawBand(ctx, u), knockGrid(ctx, u),
// and the numbers in HER_CARD. Canvases returned by herCardBase / herCardFace (static) / herCardBack are shared caches:
// draw them, never draw into them.
import { drawCard, CARD_RATIO, inkjetText, rng } from './card.js';
import { FRAME as FR } from './score.js';
import { measure } from './type.js';
import { print16, dots16, dots16TextBox, pencilWriter } from './print.js';
import { PAPER, PAPER_RGB, INK_RGB, PENCIL, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, rgba } from './palette.js';

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h); return [c, c.getContext('2d')]; };

// ---------------------------------------------------------------------------------------------------------------------
// the face (docs/卡面状态.md 第一到第三节)
// ---------------------------------------------------------------------------------------------------------------------
// The band (01 k24's thick reprint of 読み取れません) lies INSIDE the name field, right of the 氏名 label: cells of 0.1125u,
// set left-aligned at (0.136u, 0.1395u), rot -0.012, so its ink runs x 0.147u-0.929u, y 0.08u-0.202u; the teal 氏名 label
// (0.05-0.125u) shows whole. 00's first, finer print of the same line lies under the band; in the close-ups it showed as grey
// ghost letters between the band's, so from the band on it is left out: the band is what the card says from 01 k24 on.
// inkjetText's 'center' alignment rounds the cell size up (Math.ceil(k)) when it measures the line, so a centred band lands
// 0.055u further left at u = 1000 than at u = 2400 (measured): the band is set left-aligned, which scales exactly.
// The title sits in the answer area RIGHT of the label column, one line per field: ロストワン (16-dot, emphasised: four
// strikes offset by half a cell, k = 0.0079u) in the 学籍番号 rows, dots x 0.21u-0.82u, centred on y 0.337u; の号哭 (her
// pencil, Klee 700, 0.115u) in the 偏差値 rows, from x 0.21u, centred on y 0.487u. So the labels read as the fields the
// machine filled: 氏名 読み取れません, 学籍番号 ロストワン, 偏差値 の号哭.
// Where the title is printed the preprinted grid is pressed down: the answer grid's ovals and digits (x 0.20-0.885u,
// y 0.235-0.54u) keep 22% of their teal, and the dots of ロストワン knock a paper-white halo (0.9 cell) out of what is left.
const BAND = { x: 0.136, dx: 0.011, cy: 0.1395, sz: 0.1125 };
const KNOCK = { x0: 0.20, y0: 0.235, x1: 0.885, y1: 0.54, keep: 0.22 };
const L1 = { x: 0.21, y: 0.337, k: 0.0079 }, L2 = { x: 0.21, y: 0.487, size: 0.115 }, TITLE2 = ['の', '号', '哭'];
const EMPH = [[0, 0], [0.5, 0], [0, 0.5], [0.5, 0.5]];            // the emphasised strikes, in cells
const PEN_FONT = s => `700 ${s}px Klee`;
const CARD = { serial: '2026-0314', seed: 31, backSeed: 32 };
export const HER_CARD = { BAND, KNOCK, L1, L2, TITLE2, EMPH, CARD, ratio: CARD_RATIO };

export function drawBand(x, u) {
  const sz = u * BAND.sz, kd = sz / 16, cx = u * BAND.x, cy = u * BAND.cy, opt = { size: sz, align: 'left', rot: -0.012, matrix: true, color: INK_RGB };
  x.save();
  x.globalAlpha = 0.32; inkjetText(x, '読み取れません', cx, cy, { ...opt, seed: 33, dotr: 1.0 });
  x.globalAlpha = 1; inkjetText(x, '読み取れません', cx, cy, { ...opt, seed: 31, dotr: 0.7 });
  inkjetText(x, '読み取れません', cx + kd, cy + kd * 0.7, { ...opt, seed: 32, dotr: 0.66 });
  x.restore(); x.textAlign = 'left';
}
// the grid pressed down: teal print inside the knock zone lightened towards the paper (only teal pixels; fibres untouched)
export function knockGrid(x, u) {
  const X0 = Math.floor(u * KNOCK.x0), Y0 = Math.floor(u * KNOCK.y0), w = Math.ceil(u * (KNOCK.x1 - KNOCK.x0)), h = Math.ceil(u * (KNOCK.y1 - KNOCK.y0));
  const d = x.getImageData(X0, Y0, w, h), p = d.data, [PR, PG, PB] = PAPER_RGB;
  for (let i = 0; i < p.length; i += 4) {
    const tealness = Math.max(0, Math.min(1, (p[i + 2] - p[i] - 8) / 40)); if (!tealness) continue;
    const k = (1 - KNOCK.keep) * tealness;
    p[i] += (PR - p[i]) * k; p[i + 1] += (PG - p[i + 1]) * k; p[i + 2] += (PB - p[i + 2]) * k;
  }
  x.putImageData(d, X0, Y0);
}
// The card face before the title's ink, with the band: knocked = from k40 on (the grid pressed, ロストワン's halo knocked out)
const faceCache = new Map();
export function herCardBase(u, knocked = true) {
  const key = `${u}|${knocked}`; if (faceCache.has(key)) return faceCache.get(key);
  const [c, x] = mk(u, u / CARD_RATIO);
  drawCard(c, { blank: true, heart: 'empty', serial: CARD.serial, seed: CARD.seed });
  if (knocked) {
    knockGrid(x, u);
    // the halo: line 1's dots, dilated by 0.9 cell, filled paper white
    const [m, mx] = mk(u, u / CARD_RATIO); inkLine1(mx, u);
    const [hc, hx] = mk(u, u / CARD_RATIO), r = u * L1.k * 0.9;
    for (let a = 0; a < 16; a++) for (const rr of [r * 0.5, r]) hx.drawImage(m, Math.cos(a / 16 * 2 * Math.PI) * rr, Math.sin(a / 16 * 2 * Math.PI) * rr);
    hx.globalCompositeOperation = 'source-in'; hx.fillStyle = PAPER; hx.fillRect(0, 0, u, u);
    x.drawImage(hc, 0, 0);
  }
  drawBand(x, u);
  faceCache.set(key, c); return c;
}
// the cards before the band (00-01 k24): blank, or with 00 k0's first, fine print (drawCard's own stamp, as 00-02 draw it)
const preCache = new Map();
function preBandCard(u, first) {
  const key = `${u}|${first}`; if (preCache.has(key)) return preCache.get(key);
  const [c] = mk(u, u / CARD_RATIO);
  drawCard(c, { blank: true, heart: 'empty', serial: CARD.serial, seed: CARD.seed, stamp: first ? '読み取れません' : null });
  preCache.set(key, c); return c;
}

// line 1 as the print head prints it at `age` (the static card: age large): four strikes of the 16-dot head, half a cell
// apart, so the one-dot strokes print as solid scalloped strokes (a dot-matrix printer's emphasised + double-strike mode);
// the first strike's dots start at x 0.21u.
// The slam (03 review MUST, round 3): print16's own slam grows the line 22% about its CENTRE, so on the hit frame the line
// grew 0.067u to the left, over the 学籍番号 label. Here the line lands large about the TOP-LEFT of its dots (0.21u, the
// dots' top): the overshoot only grows right and down, into the answer area, never over the label column (x <= 0.19u) or up
// towards the band. One geometry for the drawing and the audits (slamAt).
export const slamAt = (age, slam) => slam && age >= 0 ? 1 + 0.22 * Math.pow(1 - Math.min(1, age / (3 * FR)), 2) : 1;
export function line1Anchor(u) { const k = u * L1.k, D = dots16('ロストワン', k, 43); return { k, D, ax: u * L1.x, ay: u * L1.y - D.h / 2 }; }
export function inkLine1(x, u, age = 9, slam = false) {
  const { k, D, ax, ay } = line1Anchor(u), cx = ax + D.w / 2, cy = u * L1.y, sc = slamAt(age, slam);
  x.save(); if (sc !== 1) { x.translate(ax, ay); x.scale(sc, sc); x.translate(-ax, -ay); }
  EMPH.forEach(([dx, dy], i) => print16(x, 'ロストワン', cx + dx * k, cy + dy * k, k, age, 43 + i * 7));
  x.restore();
}
// her pencil letters: one glyph canvas per character (graphite grain inside the strokes, as print.js pencilWriter), placed
// along the line set left-aligned at (L2.x, L2.y)
const glyphCache = {};
function penGlyph(ch, s) {
  const key = ch + s; if (glyphCache[key]) return glyphCache[key];
  const pad = Math.ceil(s * 0.2), w = Math.ceil(measure(ch, PEN_FONT('#'), s)) + 2 * pad, h = Math.ceil(s * 1.4), [c, x] = mk(w, h);
  x.font = PEN_FONT(s); x.fillStyle = PENCIL; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(ch, pad, h / 2);
  const r = rng(ch.charCodeAt(0)); x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < s * 3; i++) { x.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.25})`; x.fillRect(r() * w, r() * h, 1 + r() * 2 * s / 100, 1 + s / 160); }
  return (glyphCache[key] = { c, pad, w, h });
}
// の号哭's characters: { ch, G: { c, pad, w, h }, x, y (the glyph canvas's top-left in card space), adv, s }
export function line2Pos(u) {
  const s = Math.round(u * L2.size); let x0 = u * L2.x; const out = [];
  for (const ch of TITLE2) { const G = penGlyph(ch, s), adv = measure(ch, PEN_FONT('#'), s); out.push({ ch, G, x: x0 - G.pad, y: u * L2.y - G.h / 2, adv, s }); x0 += adv; }
  return out;
}

// the whole face into ctx (card space)
export function drawHerCardFace(x, u, { state = 'title', sweep = 1, age = 9, slam = false, pencil = true, ink = true } = {}) {
  if (state === 'blank' || state === 'first') { x.drawImage(preBandCard(u, state === 'first'), 0, 0); return; }
  if (state === 'band') { x.drawImage(herCardBase(u, false), 0, 0); return; }
  if (state !== 'title') throw new Error(`her_card: unknown state ${state}`);
  if (sweep >= 1) x.drawImage(herCardBase(u, true), 0, 0);
  else {
    // the print head sweeping left to right: the press and the halo behind it, the full grid ahead of it (03 k40's 3 frames)
    x.drawImage(herCardBase(u, false), 0, 0);
    x.save(); x.beginPath(); x.rect(0, 0, u * (L1.x - 0.01 + Math.max(0, sweep) * 0.72), u / CARD_RATIO); x.clip(); x.drawImage(herCardBase(u, true), 0, 0); x.restore();
  }
  if (!ink) return;
  inkLine1(x, u, age, slam);
  if (pencil) for (const p of line2Pos(u)) x.drawImage(p.G.c, p.x, p.y);
}
// a canvas with the face; the settled faces are cached (do not draw into the returned canvas)
const herFaceCache = new Map();
export function herCardFace(u, opts = {}) {
  const o = { state: 'title', sweep: 1, age: 9, slam: false, pencil: true, ink: true, ...opts };
  const settled = o.sweep >= 1 && o.age >= 1;                     // the print head's build is over after 3 frames
  const key = `${u}|${o.state}|${o.pencil}|${o.ink}`;
  if (settled && herFaceCache.has(key)) return herFaceCache.get(key);
  const [c, x] = mk(u, u / CARD_RATIO); drawHerCardFace(x, u, o);
  if (settled) herFaceCache.set(key, c);
  return c;
}

// The band's ink as drawn (drawBand into an empty canvas, every pixel with alpha >= 16 counted, the faint first strike
// included), per column: so the boxes carry the line's turn (rot -0.012: the right end stands higher than the left) and the
// dots' radius exactly, at any u. Cached per u. { x0, x1, top: Float32Array, bot: Float32Array } (top/bot per column x0..x1).
// 2026-11-21 (15 S1 review MUST): the old box was a level rectangle from y 0.08u (the LEFT end's top), so the right end
// (ません, about 0.073u) stood outside it and the poster frame's audit never saw that end cut by the frame's top edge.
const bandInkCache = new Map();
export function herCardBandInk(u) {
  if (bandInkCache.has(u)) return bandInkCache.get(u);
  const hh = Math.ceil(u * 0.3), [c, x] = mk(u, hh); drawBand(x, u);
  const d = x.getImageData(0, 0, c.width, hh).data, W = c.width;
  let x0 = W, x1 = -1; const top = new Float32Array(W).fill(Infinity), bot = new Float32Array(W).fill(-Infinity);
  for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] >= 16) {
    if (yy < top[xx]) top[xx] = yy; if (yy + 1 > bot[xx]) bot[xx] = yy + 1; if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; }
  const r = { x0, x1: x1 + 1, top, bot }; bandInkCache.set(u, r); return r;
}
// The band's boxes: the body (the whole run of the line, from the LEFT end's top, the lowest top, down to the lowest bottom)
// and, where the line has turned up above that, one box per eighth of its length for the part that stands higher. Together
// they follow the tilted line in steps instead of one level rectangle that would either miss the raised right end or (as one
// box from its highest point) reach over the header row at its left end, where the header has words and the band does not.
function bandBoxes(u) {
  const B = herCardBandInk(u), n = 8, sw = (B.x1 - B.x0) / n, colsMin = (a, b, arr) => { let m = Infinity; for (let i = Math.floor(a); i < Math.ceil(b); i++) if (arr[i] < m) m = arr[i]; return m; };
  let botMax = -Infinity; for (let i = B.x0; i < B.x1; i++) if (B.bot[i] > botMax) botMax = B.bot[i];
  const topL = colsMin(B.x0, B.x0 + sw, B.top);
  const o = { '読み取れません': [B.x0, topL, B.x1 - B.x0, botMax - topL] };
  for (let i = 1; i < n; i++) { const a = B.x0 + i * sw, t = colsMin(a, a + sw, B.top);
    if (t < topL - 0.25) o[`読み取れません (raised ${i + 1}/${n})`] = [a, t, sw, topL - t]; }
  return o;
}
// The boxes for the layout audit (card space, [x, y, w, h]). The band: bandBoxes (measured ink, x about 0.147u-0.93u, the left
// end's top about 0.08u, the right end's about 0.072u, the offset strike bleeding a little over the name field's rules at the
// bottom, as a reprint does). ロストワン: its emphasised dots; with slam and an age on the hit, the box scaled about the dots'
// top-left, as inkLine1 draws it. の号哭: her letters.
export function herCardLineBoxes(u, { age = 9, slam = false } = {}) {
  const lp = line2Pos(u), s = lp[0].s, w2 = lp.reduce((a, p) => a + p.adv, 0), k = u * L1.k, b1 = dots16TextBox('ロストワン', 0, 0, k);
  let r1 = [u * L1.x, u * L1.y - b1[3] / 2, b1[2] + 0.5 * k, b1[3] + 0.5 * k];
  const sc = slamAt(age, slam);
  if (sc !== 1) { const { ax, ay } = line1Anchor(u); r1 = [ax + (r1[0] - ax) * sc, ay + (r1[1] - ay) * sc, r1[2] * sc, r1[3] * sc]; }
  return { ...bandBoxes(u),
           'ロストワン': r1,
           'の号哭': [u * L2.x, u * L2.y - s * 0.5, w2, s * 1.0] };
}
// the card's own preprinted words and label blocks (card.js), so the printed lines are checked against them (the old audit
// saw no overlap while ロ sat on 学籍番号 and の on 偏差値, because the card's labels were not registered)
export function herCardLabelBoxes(u) {
  const lw = (t, f, s) => measure(t, f, u * s);
  return { '個人読取カード': [u * 0.08, u * 0.050, lw('個人読取カード', '700 #px ZenKakuB', 0.024), u * 0.024],
    '折り曲げないでください': [u * 0.27, u * 0.056, lw('折り曲げないでください', '500 #px ZenKaku', 0.016), u * 0.016],
    'No.': [u * 0.93 - lw('No.2026-0314', '500 #px ZenKaku', 0.02), u * 0.052, lw('No.2026-0314', '500 #px ZenKaku', 0.02), u * 0.02],
    '氏名 label': [u * 0.05, u * 0.09, u * 0.075, u * 0.1],
    '学籍番号 label': [u * 0.05, u * 0.24, u * 0.14, u * 0.194], '偏差値 label': [u * 0.05, u * 0.44, u * 0.14, u * 0.094],
    'こころ row': [u * 0.05, u * 0.552, u * 0.275 + lw('← 必ずぬりつぶすこと', '500 #px ZenKaku', 0.019) - u * 0.05, u * 0.044] };
}
// lines: only the lines printed in that state ('blank' none; 'first' 00's fine stamp; 'band' the band; 'title' all three)
export function herCardBoxes(u, { state = 'title', age = 9, slam = false } = {}) {
  const all = herCardLineBoxes(u, { age, slam });
  const lines = state === 'title' ? all : state === 'band' ? Object.fromEntries(Object.entries(all).filter(([n]) => n.startsWith('読み取れません')))
    : state === 'first' ? { '読み取れません (first print)': [u * (0.5 - 0.175), u * (0.142 - 0.03), u * 0.35, u * 0.06] } : {};
  return { lines, labels: herCardLabelBoxes(u) };
}

// ---------------------------------------------------------------------------------------------------------------------
// her words: もうどうだって／いいや (lyrics line 53 from も), written on the face as sung, from the yank on (14 k483: the
// card in her fist, the flying card, the poster frame k488 = 15's first frame, 15 S1). The card state (docs/卡面状態.md) runs to
// the yank and stays under her words: band, ロストワン, の号哭 all whole. Her words go in the paper the title leaves free: right
// of の号哭 (which ends near 0.555u) and under ワン, a clear gap from both (left edge 0.60u), two rows set left-aligned, the
// second larger (the shout's end): row 1 もうどうだって 0.047u, centred on y 0.452u (under ロストワン's dots, above 偏差値's
// last row); row 2 いいや 0.075u, centred on y 0.530u. Both stay inside the poster frame (POSTER_FRAME below) and right of
// the こころ row's printed words. One layout for 14 and 15 (根因清单: 同一个就用同一组数).
//   drawHerWords(ctx, u, chars, tt)   chars: [[c, t], ...] the ten sung characters; each is written from its t (pencilWriter)
//   herWordsBoxes(u)                  { 'her words row 1': [x, y, w, h], 'her words row 2': [...] } for the layout audit
// ---------------------------------------------------------------------------------------------------------------------
export const HER_WORDS = { x: 0.60, gap: 1.02, rows: [{ n: 7, cy: 0.452, size: 0.047 }, { n: 3, cy: 0.530, size: 0.075 }] };
// The poster frame: the thrown card square to the lens at 14 k488 = 15's first frame, held through 15 S1 (k488-k491). One set
// of numbers for both segments (14's flight lands on it, 15 holds it): the card POSTER_FRAME.width px wide, centred across the
// frame, the frame's top edge at POSTER_FRAME.top card widths below the card's top edge.
// 2026-11-21 (15 S1 review MUST): it was 2050 px / 0.076u, with the header row "wholly above the frame"; but the band's right
// end (about 0.072u, the line turned -0.012) and the header (No. down to about 0.071u) overlap in height, so no level frame
// edge can pass between them: the edge cut ません's tops, and after 15's slip (k489.5, 2% of the frame height) the header
// stood half in the frame, cut through. Now everything printed on the face is whole IN the frame, before and after the slip
// and through the landing's bounce and wobble: the header row (ink from about 0.051u), the band, both title lines, her words
// and the こころ row (to 0.597u); the card is a little narrower than the frame (its side edges show, 21 px a side) because
// the face from the header to the こころ row (0.546u) plus the slip does not fit 1080 px at any width that fills 1920 px.
// The timing marks (0.618u-0.644u) stay wholly below the frame. The lower corner registration marks (0.605u-0.630u, black
// squares at the bottom corners) show their top 17 px before the slip and are wholly out after it: the gap between the
// こころ row and them (0.008u) is narrower than the slip, so the frame edge has to pass through them at one end of the slip,
// and they are marks, not words. Checked frame by frame in 15 (FRAME AUDIT poster frame S1) and at k488 in 14.
export const POSTER_FRAME = { width: 1878, top: 0.0389 };
const WORDS_PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
function herWordsSplit(chars) { const out = []; let i = 0; for (const r of HER_WORDS.rows) { out.push(chars.slice(i, i + r.n)); i += r.n; } return out; }
export function drawHerWords(x, u, chars, tt) {
  herWordsSplit(chars).forEach((row, ri) => { const R = HER_WORDS.rows[ri], s = Math.round(u * R.size);
    row.forEach(([c, t], i) => WORDS_PEN.char(x, c, u * HER_WORDS.x + s * HER_WORDS.gap * (i + 0.5), u * R.cy, s, tt - t)); });
}
export function herWordsBoxes(u) {
  const o = {};
  HER_WORDS.rows.forEach((R, ri) => { const s = Math.round(u * R.size); o[`her words row ${ri + 1}`] = [u * HER_WORDS.x, u * R.cy - s * 0.55, s * HER_WORDS.gap * R.n, s * 1.1]; });
  return o;
}

// ---------------------------------------------------------------------------------------------------------------------
// the back (docs/卡面状態.md 第四节)
// ---------------------------------------------------------------------------------------------------------------------
// drawCard's back (seed 32, as 03 prints it): 記入上の注意 and its three rules at the top, the dashed writing area
// x 0.08-0.92u, y 0.30-0.59u, the corner marks, the holder slot at the top edge's centre. From 04 on the black spreads:
//   herCardBack(u, opts) -> canvas (cached per u and options);  drawHerCardBack(ctx, u, opts) -> into ctx (card space)
//   opts.black   0..1 how far the black has spread through the writing area (0 none, 1 the whole area); default 1
//   opts.origin  [x, y] in fractions of u where it starts (default [0.46, 0.40], the middle of the writing area)
//   opts.full    true: the whole back blackened (09's flip, 11, 14, 16): everything but a paper margin of 0.03u round the
//                edge and a paper ring round the holder slot (black ignored)
//   opts.seed    the black's own pattern (default 404)
// The black stays INSIDE the dashed area (0.004u in from its line); 記入上の注意, the rules, the paper margins and the slot
// always show. It is graphite, not paint: a dark field laid in strokes, the paper's tooth showing through it as pale flecks
// along the fibres, a sheen of lighter strokes, the spread's edge ragged and hatched rather than cut.
export const BACK = { area: [0.08, 0.30, 0.84, 0.29], margin: 0.03, slot: [0.4, 0.022, 0.2, 0.028], slotRing: 0.014 };
const backCache = new Map();
export function herCardBack(u, opts = {}) {
  const o = { black: 1, origin: [0.46, 0.40], full: false, seed: 404, ...opts };
  const key = `${u}|${o.full ? 'full' : o.black.toFixed(4)}|${o.origin}|${o.seed}`;
  if (backCache.has(key)) return backCache.get(key);
  const [c, x] = mk(u, u / CARD_RATIO); drawHerCardBack(x, u, o);
  backCache.set(key, c); return c;
}
export function drawHerCardBack(x, u, { black = 1, origin = [0.46, 0.40], full = false, seed = 404 } = {}) {
  const hh = u / CARD_RATIO, [bc] = mk(u, hh);
  drawCard(bc, { side: 'back', seed: CARD.backSeed });
  x.drawImage(bc, 0, 0);
  if (!full && black <= 0) return;
  const W = Math.round(u), Hh = Math.round(hh), R = rng(seed);
  // the region the black may take
  const [rc, rx] = mk(W, Hh); rx.fillStyle = '#000';
  if (full) {
    const m = u * BACK.margin; rx.beginPath(); rx.roundRect(m, m, u - 2 * m, hh - 2 * m, u * 0.012); rx.fill();
    const [sx, sy, sw, sh] = BACK.slot, ring = u * BACK.slotRing;
    rx.globalCompositeOperation = 'destination-out'; rx.beginPath(); rx.roundRect(u * sx - ring, 0, u * sw + 2 * ring, u * (sy + sh) + ring, u * sh / 2 + ring); rx.fill();
    rx.globalCompositeOperation = 'source-over';
  } else {
    const [ax, ay, aw, ah] = BACK.area, i = u * 0.004; rx.beginPath(); rx.roundRect(u * ax + i, u * ay + i, u * aw - 2 * i, u * ah - 2 * i, u * 0.012); rx.fill();
  }
  // the spread: one ragged mass soaking out from the origin. Distance (the area is wide, so it runs further along x), a broad
  // value noise for the outline, and a streak noise along the hatching angle, so the edge reads as strokes laid in, not a cut
  const vnoise = (seed2, sx, sy, ang = 0) => {
    const n2 = rng(seed2), ca = Math.cos(ang), sa = Math.sin(ang), span = Math.hypot(W, Hh), gw = Math.ceil(2 * span / sx) + 3, gh = Math.ceil(2 * span / sy) + 3, v = new Float32Array(gw * gh);
    for (let i = 0; i < v.length; i++) v[i] = n2();
    const s = t => t * t * (3 - 2 * t);
    return (px, py) => { const rxx = (px * ca + py * sa + span) / sx, ryy = (-px * sa + py * ca + span) / sy, ix = Math.floor(rxx), iy = Math.floor(ryy), tx = s(rxx - ix), ty = s(ryy - iy), at = (a, b) => v[b * gw + a];
      return (at(ix, iy) * (1 - tx) + at(ix + 1, iy) * tx) * (1 - ty) + (at(ix, iy + 1) * (1 - tx) + at(ix + 1, iy + 1) * tx) * ty; };
  };
  const HATCH = -0.42;
  const broad = vnoise(seed, u / 9, u / 16), mid = vnoise(seed + 1, u / 40, u / 60), streak = vnoise(seed + 2, u / 22, u / 420, HATCH);
  const [mc, mx] = mk(W, Hh), md = mx.createImageData(W, Hh), reg = rx.getImageData(0, 0, W, Hh).data;
  const [ox, oy] = [origin[0] * u, origin[1] * u], reach = u * 0.42;
  const thr = 1 - Math.min(1, black) * 1.25;                           // black 1 reaches every corner of the area
  for (let py = 0; py < Hh; py++) for (let px = 0; px < W; px++) {
    const o = (py * W + px) * 4; if (!reg[o + 3]) continue;
    let a = 1;
    if (!full) {
      const d = Math.hypot(px - ox, (py - oy) * 1.9) / reach;
      const f = (1 - d) + (broad(px, py) - 0.5) * 0.30 + (mid(px, py) - 0.5) * 0.10 + (streak(px, py) - 0.5) * 0.16 - thr;
      a = Math.max(0, Math.min(1, f / 0.035));
    }
    md.data[o + 3] = Math.round(a * reg[o + 3]);
  }
  mx.putImageData(md, 0, 0);
  // the graphite: a dark field laid in strokes along one hand's angle, lighter sheen strokes, the paper's tooth as pale flecks
  // along the fibres (the print under it shows faintly, as print does under pencil)
  const [gc, gx] = mk(W, Hh), lw = u / 600, K = u / 1000;
  gx.fillStyle = GRAPHITE_FIELD; gx.globalAlpha = 0.86; gx.fillRect(0, 0, W, Hh); gx.globalAlpha = 1;
  gx.lineCap = 'round';
  for (let i = 0; i < 4200 * K; i++) {
    const px = R() * W, py = R() * Hh, a = HATCH + (R() - 0.5) * 0.12, l = u * (0.015 + R() * 0.045), dark = R() < 0.6;
    gx.strokeStyle = rgba(dark ? GRAPHITE_DARK_RGB : GRAPHITE_LIGHT_RGB, dark ? 0.16 + R() * 0.2 : 0.08 + R() * 0.12); gx.lineWidth = lw * (0.8 + R() * 1.8);
    gx.beginPath(); gx.moveTo(px, py); gx.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); gx.stroke();
  }
  gx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 5200 * K; i++) {                                  // the paper's tooth: short flecks along the grain
    gx.fillStyle = `rgba(0,0,0,${0.08 + R() * 0.24})`; gx.fillRect(R() * W, R() * Hh, lw * (1.5 + R() * 4), lw * (0.5 + R() * 0.5));
  }
  gx.globalCompositeOperation = 'destination-in'; gx.drawImage(mc, 0, 0);
  x.drawImage(gc, 0, 0);
}

// ---------------------------------------------------------------------------------------------------------------------
// the ruled back (04's layout; 全片分镜 审查后改定 15: 卡背以 04 的罫线排位为准, 11 writes on the same ruled lines)
// ---------------------------------------------------------------------------------------------------------------------
// Moved here from seg_04.js unchanged (2026-11-21, the card unification), so 04 and 11 print one back from one set of numbers.
// 記入上の注意 and its three rules at the top, her name on the なまえ line top right, a teal double line under the rules (the
// 静脈 04 stabs), two frame lines down the sides, six ruled memo lines (メモ欄), the four corner marks, and her centimetre
// scale in the bottom margin (04's lead is measured on it). The numbers are in the units of a card 637 wide (HER_BACK_RULED.ref;
// the card is 637 x 424.7), as 04 and 11 lay it out; drawHerCardBackRuled scales them to any u. The holder slot is the same
// hole as the other back's (BACK.slot, fractions of u).
// NOTE: this is not drawCard's back (art/canon/card_back_rules.png: a dashed writing area, which herCardBack draws and 09
// uses). Which of the two is the film's one back is still open (reported by 04, 2026-11-21); until it is settled 04 and 11 use
// this one, 09 the other.
//   drawHerCardBackRuled(ctx, u, { paper, hers })  -> into ctx at card space. paper: the paper and its fibres (default true);
//                       hers: her name and the centimetre scale (default true; 11 draws the other people's backs without them)
//   herCardBackRuled(u, opts)  -> a cached canvas u x u/1.5 (draw it, never draw into it)
//   ruledLineBox(ri, n)        -> the box [x, y, w, h] (ref units) of n of her characters written on ruled line ri (0-5): 25
//                                 units a character from x 52, sitting just above the line (04's lines 0, 1, 2)
//   herCardBackRuledBoxes()    -> the back's printed words (ref units) for the layout audit
import { PAPER_CARD, FIBRE_RGB, TEAL, GRAPHITE } from './palette.js';
export const HER_BACK_RULED = {
  ref: 637, corner: 18, marks: [[22, 20], [599, 20], [22, 392], [599, 392]], mark: 16,
  heading: { x: 52, y: 52, size: 21 }, rules: { x: 52, xt: 70, y0: 77, dy: 18, size: 12.5 },
  name: { label: [372, 54], line: [408, 62, 182], box: [418, 40, 120, 22], size: 20 },
  dbl: [140, 147], frameX: [14, 623], ruleY: [186, 226, 266, 306, 346, 386], memo: { x: 598, y: 168, size: 10 },
  scale: { x0: 584, cm: 60, y: 398, digitY: 414 }, text: { x: 52, size: 25 }, slot: BACK.slot,
};
export const HER_BACK_RULES = [['1.', 'HBの黒鉛筆で、○の中を正確にぬりつぶしてください。'], ['2.', 'はみ出したり、うすかったりすると読み取れません。'], ['3.', '訂正するときは、消しゴムできれいに消し、消しくずを残さないでください。']];
const RULED_PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
export const ruledLineBox = (ri, n) => { const R = HER_BACK_RULED; return [R.text.x, R.ruleY[ri] - 36, R.text.size * 1.02 * n, 30]; };
export function herCardBackRuledBoxes() {
  const R = HER_BACK_RULED, S = R.scale;
  return { 'card heading': [52, 41, 128, 22], 'card rules': [52, 69, 470, 52], 'her name': [418, 40, 90, 22], 'memo note': [500, 162, 100, 12],
           'scale digits': [S.x0 - 8 * S.cm - 6, S.digitY - 6, 8 * S.cm + 24, 12] };
}
export function drawHerCardBackRuled(x, u, { paper = true, hers = true } = {}) {
  const R = HER_BACK_RULED, CW = R.ref, CH = CW / CARD_RATIO, S = R.scale;
  x.save(); x.scale(u / CW, u / CW);
  if (paper) {
    x.fillStyle = PAPER_CARD; x.beginPath(); x.roundRect(0, 0, CW, CH, R.corner); x.fill();
    const r = rng(404); for (let i = 0; i < 900; i++) { x.strokeStyle = rgba(FIBRE_RGB, 0.05 + r() * 0.07); x.lineWidth = 0.4; const px = r() * CW, py = r() * CH, a = r() * 7, l = 3 + r() * 8; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  }
  x.fillStyle = GRAPHITE; for (const [mx, my] of R.marks) x.fillRect(mx, my, R.mark, R.mark);
  x.fillStyle = TEAL; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = `700 ${R.heading.size}px ZenKakuB`; x.fillText('記入上の注意', R.heading.x, R.heading.y);
  x.font = `500 ${R.rules.size}px ZenKaku`;
  HER_BACK_RULES.forEach(([n, t], i) => { x.fillText(n, R.rules.x, R.rules.y0 + i * R.rules.dy); x.fillText(t, R.rules.xt, R.rules.y0 + i * R.rules.dy); });
  x.font = '500 11px ZenKaku'; x.fillText('なまえ', ...R.name.label); x.fillRect(R.name.line[0], R.name.line[1], R.name.line[2], 1.2);
  const [F0, F1] = R.frameX, RY = R.ruleY;
  for (const y of R.dbl) x.fillRect(F0, y - 1.1, F1 - F0, 2.2);
  for (const fx of R.frameX) x.fillRect(fx - 1, R.dbl[1], 2, RY[5] - R.dbl[1]);
  x.globalAlpha = 0.75; for (const y of RY) x.fillRect(F0, y - 0.6, F1 - F0, 1.2); x.globalAlpha = 1;
  x.font = `500 ${R.memo.size}px ZenKaku`; x.textAlign = 'right'; x.fillText('メモ欄（採点対象外）', R.memo.x, R.memo.y); x.textAlign = 'left';
  if (hers) {
    x.fillRect(S.x0 - 8 * S.cm - 1, S.y, 8 * S.cm + 2, 1.1);
    for (let mm = 0; mm <= 80; mm++) { const tx = S.x0 - mm * S.cm / 10, l = mm % 10 === 0 ? 8 : mm % 5 === 0 ? 5.5 : 3.2; x.fillRect(tx - 0.4, S.y, 0.8, l); }
    x.font = '600 9px ZenKaku'; x.textAlign = 'center'; for (let cm = 0; cm <= 8; cm++) x.fillText(String(cm), S.x0 - cm * S.cm, S.digitY); x.textAlign = 'left';
    x.font = '500 7px ZenKaku'; x.fillText('cm', S.x0 + 7, S.digitY);
    RULED_PEN.line(x, [...'鏡音リン'].map(c => [c, -1]), R.name.box, 0, R.name.size);
  }
  x.restore();
}
const ruledCache = new Map();
export function herCardBackRuled(u, opts = {}) {
  const o = { paper: true, hers: true, ...opts }, key = `${u}|${o.paper}|${o.hers}`;
  if (ruledCache.has(key)) return ruledCache.get(key);
  const [c, x] = mk(u, u / CARD_RATIO); drawHerCardBackRuled(x, u, o);
  ruledCache.set(key, c); return c;
}
