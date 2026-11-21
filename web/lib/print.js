// The film's two kinds of letters (docs/制作约定.md 第四节):
//   - the reading machine's words (verdicts, results, roll calls, questions) in its 16-dot print head;
//   - her words: pencil handwriting, or paper-white letters left in the black / rubbed out of the graphite.
// A machine print on a beat event starts on that beat's frame and builds up over three frames (a sweep or fade): the hit is
// the start of the print. A SUNG character is different: it must already read on the frame the singer opens their mouth.
//
// Sung characters (2026-11-21, user: 「我们的歌词好像比曲子慢了一点」): the old curve started a sung character on the first
// frame at or after its onset (frame grid rounding: up to 1 frame late) and gave it 1/3, 2/3, 1 over three frames, so it read
// 1-2 frames (33-63 ms) after the onset and was whole 2-3 frames after; visual-after-audio of about 45 ms is where people start
// to notice (ITU-R BT.1359). Now (sungBuild): the frame that contains the onset, floor(t * 30), shows it whole; the frame before
// shows it at 55%; nothing earlier. pencilWriter.char, whiteLetter and printSung always use this (they only draw sung words);
// print16 uses it when given { sung: true }. A page that gates a sung letter itself must gate with sungShown(tt, t), not
// tt >= t, or the letter is held back to the next frame. Page code that animates sung letters its own way takes its
// progress from sungBuild / sungSweep, so the letter is complete on the onset frame.
//
//   import { dots16Text, print16, print16Box, printSung, pencilWriter, whiteLetter, vertical } from '../lib/print.js';
//   print16(ctx, '正解', x, y, 5.1, tt - T_OK, 41, { frame: true, slam: true });    // centred on (x, y), measured from the dots
//   print16(ctx, c, x, y, 5, tt - t, seed, { sung: true });                           // a sung character, printed
//   const PEN = pencilWriter();  PEN.line(ctx, chars, box, tt, 104);  PEN.column(ctx, chars, x, y0, colH, tt, 60);
//   whiteLetter(ctx, '黒', x, y, 92, tt - t, 'paper');                                // 'paper' | 'rubbed' | 'pencil'
//   if (sungShown(tt, t)) ...;  const u = sungSweep(tt, t, 2 * FRAME);                // page-written sung letters
import { inkjetText, rng } from './card.js';
import { FRAME } from './score.js';
import { INK_RGB, PAPER, PENCIL, PENCIL_LETTER, RUBBED_WHITE, GRAPHITE, rgb } from './palette.js';

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
const build = age => Math.min(1, (age / FRAME + 1) / 3);          // beat prints: 1/3 on the first frame, whole on the third

// ---------- sung characters: whole on the frame that contains the onset ----------
// age = tt - t (tt = the frame's song time g / 30, t = the sung onset). framesBefore: 0 on the onset's frame (age in (-F, 0])
// and after, 1 on the frame before it, ... (the 1e-6 keeps an onset exactly on a frame boundary on its own frame)
export const SUNG_LEAD = 2 * FRAME;                               // the earliest a sung character may start to show
const framesBefore = age => Math.floor(-age / FRAME + 1e-6);
export const onsetFrameTime = t => Math.floor(t / FRAME + 1e-6) * FRAME;   // song time of the frame the onset falls in
// 0 (not shown), 0.55 on the frame before the onset's frame, 1 from the onset's frame on
export function sungBuild(age) { const k = framesBefore(age); return k <= 0 ? 1 : k === 1 ? 0.55 : 0; }
export const sungShown = (tt, t) => sungBuild(tt - t) > 0;
// progress 0..1 of a page's own sweep / write-on of a sung letter lasting d: it ends on the onset's frame, so it starts
// d - 1 frame before it (d = 2 frames: 50% on the frame before, whole on the onset's frame). A d longer than 2 frames shows
// the letter partly written earlier than SUNG_LEAD; check the partial letter cannot be read as another character.
export function sungSweep(tt, t, d = SUNG_LEAD) {
  const end = onsetFrameTime(t);
  return tt >= end - 1e-6 ? 1 : Math.max(0, Math.min(1, (tt - end + d) / d));
}

// ---------- 16-dot print ----------
// the print head's text at k x 16 px (each font pixel one k x k cell of ink dots), from (x, y): left edge or centre, mid-height
export function dots16Text(ctx, text, x, y, k, seed, { align = 'left', color = INK_RGB } = {}) {
  inkjetText(ctx, text, x, y, { size: 16 * k, align, seed, matrix: true, color, dotr: 0.42 });
}
// the print rendered once and measured from the dots actually printed, so it can sit exactly centred in its frame
const P16 = {};
export function dots16(text, k, seed, color = INK_RGB) {
  const key = `${text}|${k}|${seed}|${color.join(',')}`; if (P16[key]) return P16[key];
  const [c, x] = mk(Math.ceil(text.length * 16 * k + 64 * k), Math.ceil(16 * k * 2.2));
  inkjetText(x, text, 16 * k, c.height / 2, { size: 16 * k, align: 'left', seed, matrix: true, color, dotr: 0.42 });
  const d = x.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, x1 = 0, y0 = c.height, y1 = 0;
  for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++) if (d[(yy * c.width + xx) * 4 + 3] > 20) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
  return (P16[key] = { c, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
}
// Boxes for the layout registry. They are worked out from the font's advance widths, NOT by printing: printing at build time
// creates GPU canvases early, and that alone was measured to change a few pixels of the confirmed c1a frames by one level
// (GPU resource state; work/infra/refactor_diff.txt). The estimate: the dots cover the advance width less about one cell at
// each end, and 14 of the 16 rows; good to a dot cell or two, which is what a layout audit needs.
let _m16 = null;
function advance16(text, k) {
  if (!_m16) { const c = document.createElement('canvas'); c.width = 8; c.height = 8; _m16 = c.getContext('2d'); }
  _m16.font = `${16 * k}px DotG`; return _m16.measureText(text).width;
}
const dotsW = (text, k) => Math.max(k, advance16(text, k) - 2 * k), dotsH = k => 14 * k;
// the box a print16 takes before the slam: its ruled frame / label ground when it has one (framed), else the dots alone
export function print16Box(text, x, y, k, { framed = false } = {}) {
  const padX = framed ? 16 * k * 0.45 : 0, padY = framed ? 16 * k * 0.28 : 0, w = dotsW(text, k) + 2 * padX, h = dotsH(k) + 2 * padY;
  return [x - w / 2, y - h / 2, w, h];
}
// the box the dots of a left-aligned dots16Text(ctx, text, x, y, k, seed) take
export function dots16TextBox(text, x, y, k) { return [x + k, y - dotsH(k) / 2, dotsW(text, k), dotsH(k)]; }
// THE 16-dot print (the standard for every new page): centred on (x, y), swept in left to right over three frames; frame: a
// ruled box round it (a stamp), label: a ground colour under it, slam: lands 22% large and settles in three frames
// sung: a sung character (whole on its onset's frame, sungBuild) instead of a beat print (the 3-frame sweep from the beat)
export function print16(s, text, x, y, k, age, seed, { frame = false, label = null, slam = false, color = INK_RGB, sung = false } = {}) {
  const f = sung ? sungBuild(age) : age < 0 ? 0 : build(age); if (f <= 0) return;
  const D = dots16(text, k, seed, color), padX = 16 * k * 0.45, padY = 16 * k * 0.28, w = D.w + 2 * padX, h = D.h + 2 * padY;
  const sc = slam ? 1 + 0.22 * Math.pow(1 - Math.min(1, Math.max(0, age) / (3 * FRAME)), 2) : 1;
  s.save(); s.translate(x, y); s.scale(sc, sc); s.beginPath(); s.rect(-w / 2 - 8, -h / 2 - 8, (w + 16) * f, h + 16); s.clip();
  if (label) { s.fillStyle = label; s.fillRect(-w / 2, -h / 2, w, h); }
  if (frame) { s.strokeStyle = rgb(color); s.lineWidth = Math.max(3, k * 1.2); s.strokeRect(-w / 2, -h / 2, w, h); }
  s.drawImage(D.c, D.x0, D.y0, D.w, D.h, -D.w / 2, -D.h / 2, D.w, D.h); s.restore();
}
// 待统一: the older 16-dot stamp of Demo 1 (a2v4), whose frame is sized from the character count, not from the dots. Kept only
// so the confirmed frames of a2v4 do not change; new pages use print16.
export function print16ByCount(s, text, x, y, k, age, seed, { frame = false, label = null, color = INK_RGB, slam = false } = {}) {
  if (age < 0) return;
  const w = text.length * 16 * k + 16 * k * 0.9, h = 16 * k * 1.55, f = build(age);
  const sc = slam ? 1 + 0.22 * Math.pow(1 - Math.min(1, age / (3 * FRAME)), 2) : 1;
  s.save(); s.translate(x, y); s.scale(sc, sc);
  s.beginPath(); s.rect(-w / 2 - 8, -h / 2 - 8, (w + 16) * f, h + 16); s.clip();
  if (label) { s.fillStyle = label; s.fillRect(-w / 2, -h / 2, w, h); }
  if (frame) { s.strokeStyle = rgb(color); s.lineWidth = Math.max(3, k * 1.3); s.strokeRect(-w / 2, -h / 2, w, h); }
  dots16Text(s, text, 0, 0, k, seed, { align: 'center', color });
  s.restore();
}
export function print16ByCountBox(text, x, y, k) { const w = text.length * 16 * k + 16 * k * 0.9, h = 16 * k * 1.55; return [x - w / 2, y - h / 2, w, h]; }

// ---------- typeset print, character by character as sung (a printed test question, set in Mincho) ----------
// chars: [[char, t], ...] (t = -1 for characters there from the start); returns the full width. Each character is printed
// whole from the frame that contains its onset (sungBuild), not from the frame after it.
export function printSung(ctx, chars, x, y, size, tt, font = '700 #px ShipporiB', color = GRAPHITE) {
  ctx.font = font.replace('#', size); ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  let cx = x; for (const [c, t] of chars) { const w = ctx.measureText(c).width; if (sungBuild(tt - t) >= 1) ctx.fillText(c, cx, y); cx += w; }
  return cx - x;
}

// ---------- vertical setting (縦書き) ----------
// small kana sit up and right and are set smaller; punctuation and brackets use their vertical forms; long-vowel marks and
// dashes are turned a quarter round
export const SMALL_KANA = 'ゃゅょっャュョッぁぃぅぇぉァィゥェォゎヮヵヶ';
export const VERT_FORMS = { '、': '︑', '。': '︒', '，': '︐', '「': '﹁', '」': '﹂', '『': '﹃', '』': '﹄', '（': '︵', '）': '︶', '【': '︻', '】': '︼', '〔': '︹', '〕': '︺', '…': '︙', '‥': '︰', '！': '︕', '？': '︖', '：': '︓', '；': '︔' };
export const VERT_ROTATE = 'ー－―〜～→←';
// positions of a column of n characters of size `size` from y0 at x (step: advance per character in sizes)
export function vertical(chars, x, y0, size, step = 1.04) {
  return chars.map(([c, t], i) => {
    const small = SMALL_KANA.includes(c);
    return { c: VERT_FORMS[c] || c, t, rot: VERT_ROTATE.includes(c) ? Math.PI / 2 : 0, small,
             x: x + (small ? size * 0.12 : 0), y: y0 + size * (i + 0.5) * step - (small ? size * 0.1 : 0), size: small ? Math.round(size * 0.8) : size };
  });
}

// ---------- her pencil handwriting ----------
// each character written as it is sung: 55% (at 96% size) on the frame before its onset's frame, whole on that frame
// (sungBuild); graphite grain inside the strokes
export function pencilWriter({ font = '600 #px Klee', color = PENCIL } = {}) {
  const glyphs = {};
  function glyph(ch, size) {
    const key = ch + size; if (glyphs[key]) return glyphs[key];
    const [c, x] = mk(Math.ceil(size * 1.3), Math.ceil(size * 1.3)); x.font = font.replace('#', size); x.fillStyle = color; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.fillText(ch, c.width / 2, c.height / 2);
    const r = rng(ch.charCodeAt(0)); x.globalCompositeOperation = 'destination-out';
    for (let k = 0; k < size * 3; k++) { x.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.25})`; x.fillRect(r() * c.width, r() * c.height, 1 + r() * 2, 1); }
    return (glyphs[key] = c);
  }
  function char(s, ch, cx, cy, size, age, rot = 0) {
    const f = sungBuild(age); if (f <= 0) return; const gc = glyph(ch, size), sc = 0.92 + 0.08 * f;
    s.save(); s.globalAlpha = f; s.translate(cx, cy); if (rot) s.rotate(rot); s.scale(sc, sc); s.drawImage(gc, -gc.width / 2, -gc.height / 2); s.restore();
  }
  // a line written across in box [x, y, w, h]: one size for the whole line, fitted so it all fits
  const lineSize = (n, [, , w, h], maxSize) => Math.min(maxSize, Math.floor(w / (n * 1.02)), Math.floor(h / 1.15));
  function line(s, chars, box, tt, maxSize) {
    const [x, y, w, h] = box, size = lineSize(chars.length, box, maxSize);
    chars.forEach(([c, t], i) => char(s, c, x + size * (i + 0.5) * 1.02, y + h / 2, size, tt - t));
  }
  function lineBox(chars, box, maxSize) { const [x, y, , h] = box, size = lineSize(chars.length, box, maxSize); return [x, y + h / 2 - size * 0.65, size * chars.length * 1.02, size * 1.3]; }
  // a line written down a column of height colH from y0
  const columnSize = (n, colH, maxSize) => Math.min(maxSize, Math.floor(colH / (n * 1.04)));
  function column(s, chars, x, y0, colH, tt, maxSize) {
    const size = columnSize(chars.length, colH, maxSize);
    for (const p of vertical(chars, x, y0, size, 1.04)) char(s, p.c, p.x, p.y, p.size, tt - p.t, p.rot);
  }
  function columnBox(chars, x, y0, colH, maxSize) { const size = columnSize(chars.length, colH, maxSize); return [x - size * 0.65, y0, size * 1.3, size * chars.length * 1.04]; }
  return { glyph, char, line, lineBox, column, columnBox };
}

// ---------- white letters: left in the black, or rubbed out of the graphite ----------
// tone 'paper' (paper-white left unpainted), 'rubbed' / true (rubbed out with an eraser: greyer, more broken), 'pencil'.
// Rendered at 4x and drawn down, so they stay sharp under a close camera. Each shows as a sung character (sungBuild): 55% on
// the frame before its onset's frame, whole on that frame.
const LG = {}, LRES = 4;
export function whiteLetter(ctx, ch, cx, cy, size, age, tone, { font = '800 #px ShipporiX' } = {}) {
  const f = sungBuild(age); if (f <= 0) return; const rubbed = tone === true || tone === 'rubbed', key = ch + size + String(tone) + font;
  if (!LG[key]) { const S = size * LRES, [c, x] = mk(Math.ceil(S * 1.3), Math.ceil(S * 1.3)); x.font = font.replace('#', S); x.fillStyle = tone === 'pencil' ? PENCIL_LETTER : rubbed ? RUBBED_WHITE : PAPER; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(ch, c.width / 2, c.height / 2); const r = rng(ch.charCodeAt(0) + size); x.globalCompositeOperation = 'destination-out';
    for (let k = 0; k < size * (rubbed ? 4 : 1.5); k++) { x.fillStyle = `rgba(0,0,0,${0.2 + r() * 0.4})`; x.fillRect(r() * c.width, r() * c.height, (2 + r() * 4) * LRES, (1 + r() * 2) * LRES); }
    LG[key] = c; }
  const c = LG[key], sc = (0.92 + 0.08 * f) / LRES;
  ctx.save(); ctx.globalAlpha = f; ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore();
}
