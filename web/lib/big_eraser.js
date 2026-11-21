// The machine's big eraser and the page under the black: one function for both halves of the first chorus, so the seam between
// 08a and 08b (frame 2586 | 2587) is the same drawing on both sides (docs/分镜/08a_副歌1前半.md 第 3、6 节, 08b 第 4、6 节).
//
//   k231      the eraser comes in from the right, flat on the paper, and in three frames rubs out the right column (the second
//             「おい誰なんだよ」 and the graphite under it) down to x = PARK; it stays there, lined up beside her face, a row of
//             crumbs at its front edge. Under it is the next page: 数学 問三, its right column (問三, the question, the sum,
//             the empty answer boxes). 「そ」 (85.97) is printed there on time.
//   k232      it comes down on her face: the first pass to the left edge of the frame (k232-k232.5) leaves a dirty grey rub with
//             her gold, skin and teal smeared into it; the second pass (k232.5-k233) back to PARK rubs the middle cleaner;
//             a strip at the left edge that the second pass does not reach stays dark, darkest at the bottom left (the stain
//             08b's 問三/問四 page keeps).
//   k233      it lifts (its shadow opens) and leaves to the right in four frames, the way a part of the reading machine goes home.
//
// Nobody holds it: no hand, a straight horizontal track, like the reading head (審査後改定 6). It is the canon eraser
// (art/canon/machine_big_eraser.png, the upright middle view, 読取機用 and six timing squares printed by tools/eraser_print.py),
// about 230 px wide on the page, both rounded ends outside the frame.
//
// Everything is drawn in world (page) coordinates, inside the pushed camera (08a 第 7 节), at 1920 x 1080.
//
//   import { createBigEraser, Q3 } from '../../lib/big_eraser.js';
//   const ER = await createBigEraser({ W, rng, img, rinPalImage, LY, layout: LAY });
//   ER.events                         // [[name, t, level]] to register in the page's score (only those inside its window)
//   ER.drawShoutTop(ctx, tt)          // the world as it is before the eraser: graphite, her rounder shout, the right column
//   ER.compose(ctx, tt, { under, over })   // the page, the rubbed areas, what is left of the shout, crumbs, the eraser
//   ER.page                           // the 数学 page canvas (問三 upper half), with Q3 = its layout, for 08b
//   ER.SHOUT_CAM                      // the camera 08a ends on and 08b starts from: { z: 1.06, fx: 960, fy: 540 }
import { FRAME as FR, beatV, smooth } from './score.js';
import { textBox } from './type.js';
import { printSung, whiteLetter } from './print.js';
import { PAPER, TEAL, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, INK_RGB, FIBRE_RGB, rgba } from './palette.js';

const W = 1920, H = 1080;
export const T_IN = beatV(231), T_DOWN = beatV(232), T_TURN = beatV(232.5), T_UP = beatV(233);
export const PARK = 1100;          // the eraser's left (front) edge while it waits beside her face, and where the second pass ends
export const EW = 230;             // its width on the page
export const LMIN = 30;            // the left edge of the frame at 1.06 is x = 54: the first pass goes just past it
const OFF_R = W + 40;              // parked outside the frame, right
const IN_FRAMES = 3, OUT_FRAMES = 4;

// the 数学 page, upper half (問三). The right column holds everything 08a shows; the left (abacus) is 08b's.
// Band text sits low enough (y >= 62) and the right ends early enough (x <= 1790) that the push to 1.10 in 08b never cuts it.
export const Q3 = {
  band: [0, 0, W, 140], title: [96, 62, 360, 60], test: [W - 720, 74, 560, 44],
  kiri: { x: 64, y0: 176, y1: 1066 },
  label: { x: 1370, y: 214, size: 62 },                         // 「問三」
  rows: [[1370, 298], [1370, 380]], qsize: 62,                   // the question, sung: そろばんでこの / 式が解けますか
  split: 7,
  sum: { right: 1790, y1: 500, y2: 600, rule: 652, size: 84 },   // 2,738 / + 1,456 / rule
  ans: { x0: 1370, y: 690, s: 96, gap: 108, n: 4 },              // four empty answer boxes (08b prints 4194 in them at k238)
  ok: [1370, 820, 420, 96],                                      // reserved for 08b's small 正解
  abacus: [140, 236, 920, 690],                                  // reserved for 08b's abacus (about 60% of the frame height)
};
export const SHOUT_CAM = { z: 1.06, fx: 960, fy: 540 };

// the eraser's front (left) edge on the page at time t, how far it is lifted (0 = flat on the paper, 1 = up), whether it is in view
export function eraserAt(t) {
  if (t < T_IN) return { L: OFF_R, lift: 0, on: false, phase: 'before' };
  if (t < T_IN + IN_FRAMES * FR) { const u = (t - T_IN) / (IN_FRAMES * FR); return { L: PARK + (OFF_R - PARK) * Math.pow(1 - u, 3), lift: 0, on: true, phase: 'in' }; }
  if (t < T_DOWN) return { L: PARK, lift: 0, on: true, phase: 'park' };
  if (t < T_TURN) { const u = (t - T_DOWN) / (T_TURN - T_DOWN); return { L: PARK + (LMIN - PARK) * smooth(u), lift: 0, on: true, phase: 'pass1' }; }
  if (t < T_UP) { const u = (t - T_TURN) / (T_UP - T_TURN); return { L: LMIN + (PARK - LMIN) * smooth(u), lift: 0, on: true, phase: 'pass2' }; }
  const u = (t - T_UP) / (OUT_FRAMES * FR);
  if (u >= 1) return { L: OFF_R, lift: 1, on: false, phase: 'gone' };
  return { L: PARK + (OFF_R - PARK) * u * u, lift: Math.min(1, u * 2.5), on: true, phase: 'out' };
}

export async function createBigEraser({ rng, img, rinPalImage, LY, layout = null }) {
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const R = rng(231);

  // ---------- the world before the eraser (= c1a k230-k232: the graphite, her rounder shout, the second 「おい誰なんだよ」) ----------
  // Built exactly as web/scenes/c1a_page.js builds it, so the two halves and Demo 2 match pixel for pixel.
  const [GF, gfs] = mk(W, H); { gfs.fillStyle = GRAPHITE_FIELD; gfs.fillRect(0, 0, W, H); const r = rng(9); gfs.lineCap = 'round';
    for (let k = 0; k < 2400; k++) { gfs.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); gfs.lineWidth = 2 + r() * 5;
      const x = r() * W, y = r() * H, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16; gfs.beginPath(); gfs.moveTo(x, y); gfs.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); gfs.stroke(); } }
  const FACE = rinPalImage(await img('/art/cut/rface_scr_o.png'));
  const L4 = LY.lineAt(21, 'おい誰なんだよおい誰なんだよ'), SHOUT2 = L4.slice(7), SSIZE = 116, SCX = W - 200, SY0 = 540 - SHOUT2.length * SSIZE / 2;
  function drawShoutTop(ctx, tt) {
    ctx.drawImage(GF, 0, 0);
    const s2 = 0.95, w = FACE.width * s2, h = FACE.height * s2; ctx.drawImage(FACE, 700 - w / 2, H - h + 30, w, h);
    SHOUT2.forEach(([c, tc], i) => whiteLetter(ctx, c, SCX, SY0 + SSIZE * (i + 0.5), SSIZE, tt - tc, true));
  }

  // ---------- the page under it: 数学, 問三 ----------
  const [page, ps] = mk(W, H);
  { ps.fillStyle = PAPER; ps.fillRect(0, 0, W, H); const r = rng(13);
    for (let k = 0; k < W * H / 2200; k++) { ps.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); ps.fillRect(r() * W, r() * H, 2 + r() * 9, 1); }
    const reg = (name, box) => layout && layout.reg(name, 'q3', box);
    const tb = (text, font, box, o = {}) => textBox(ps, text, font, box, { layout, sheet: 'q3', ...o });
    ps.fillStyle = TEAL; ps.fillRect(...Q3.band); reg('band', Q3.band);
    tb('数学', '700 #px ZenKakuB', Q3.title, { maxSize: 48, color: PAPER, name: 'title', sheet: 'q3b' });
    tb('令和八年度　読取確認テスト', '500 #px ZenKaku', Q3.test, { maxSize: 28, align: 'right', color: PAPER, name: 'test', sheet: 'q3b' });
    // the cut-off line down the left edge (12 tears along it): teal dashes, a small pair of scissors, キリトリ線 set vertically
    { const { x, y0, y1 } = Q3.kiri; ps.strokeStyle = TEAL; ps.lineWidth = 3; ps.setLineDash([18, 12]); ps.beginPath(); ps.moveTo(x, y0 + 60); ps.lineTo(x, y1); ps.stroke(); ps.setLineDash([]);
      ps.save(); ps.translate(x, y0 + 26); ps.lineWidth = 3; ps.lineCap = 'round';
      for (const sx of [-1, 1]) { ps.beginPath(); ps.arc(sx * 9, -14, 7, 0, 7); ps.stroke(); ps.beginPath(); ps.moveTo(sx * 6, -7); ps.lineTo(-sx * 5, 24); ps.stroke(); }
      ps.restore();
      ps.fillStyle = TEAL; ps.font = '500 22px ZenKaku'; ps.textAlign = 'center'; ps.textBaseline = 'middle';
      [...'キリトリ線'].forEach((c, i) => ps.fillText(c, x - 30, y0 + 90 + i * 26)); ps.textAlign = 'left'; }
    // 問三, printed from the start (the sung question is printed as she sings it, by ER.printQuestion)
    ps.font = `700 ${Q3.label.size}px ShipporiB`; ps.fillStyle = GRAPHITE; ps.textBaseline = 'middle'; ps.fillText('問三', Q3.label.x, Q3.label.y);
    const lw = ps.measureText('問三').width; ps.fillStyle = TEAL; ps.fillRect(Q3.label.x, Q3.label.y + Q3.label.size * 0.62, lw + 40, 4);
    layout && layout.text('問三', 'q3', [Q3.label.x, Q3.label.y - Q3.label.size * 0.6, lw, Q3.label.size * 1.2]);
    // the sum, set as a written column sum (筆算), right-aligned
    { const { right, y1, y2, rule, size } = Q3.sum; ps.font = `700 ${size}px ShipporiB`; ps.fillStyle = GRAPHITE; ps.textAlign = 'right';
      ps.fillText('2,738', right, y1); ps.fillText('+　1,456', right, y2);
      const w1 = ps.measureText('2,738').width, w2 = ps.measureText('+　1,456').width; ps.textAlign = 'left';
      layout && layout.text('sum 1', 'q3', [right - w1, y1 - size * 0.6, w1, size * 1.2]);
      layout && layout.text('sum 2', 'q3', [right - w2, y2 - size * 0.6, w2, size * 1.2]);
      ps.fillStyle = TEAL; ps.fillRect(right - Math.max(w1, w2) - 20, rule, Math.max(w1, w2) + 26, 5); reg('sum rule', [right - Math.max(w1, w2) - 20, rule, Math.max(w1, w2) + 26, 5]); }
    { const { x0, y, s, gap, n } = Q3.ans; ps.strokeStyle = TEAL; ps.lineWidth = 4;
      for (let i = 0; i < n; i++) { ps.strokeRect(x0 + i * gap, y, s, s); reg(`answer ${i}`, [x0 + i * gap, y, s, s]); } }
  }
  const Q22 = LY.lineAt(22, 'そろばんでこの式が解けますか');
  if (layout) { const m = document.createElement('canvas').getContext('2d'); m.font = `700 ${Q3.qsize}px ShipporiB`;
    [Q22.slice(0, Q3.split), Q22.slice(Q3.split)].forEach((row, i) => layout.text(`question row ${i + 1}`, 'q3:print',
      [Q3.rows[i][0], Q3.rows[i][1] - Q3.qsize * 0.6, row.reduce((a, [c]) => a + m.measureText(c).width, 0), Q3.qsize * 1.2])); }
  // the question printed as she sings it, in the two rows of the right column
  function printQuestion(ctx, tt) {
    printSung(ctx, Q22.slice(0, Q3.split), Q3.rows[0][0], Q3.rows[0][1], Q3.qsize, tt);
    printSung(ctx, Q22.slice(Q3.split), Q3.rows[1][0], Q3.rows[1][1], Q3.qsize, tt);
  }

  // ---------- what the rubbing leaves ----------
  // horizontal grain of graphite dragged along by the eraser (the direction it moves), on a light grey wash
  function streaks(seed, density, aMin, aMax, wash) {
    const [c, s] = mk(W, H), r = rng(seed); s.fillStyle = rgba(INK_RGB, wash); s.fillRect(0, 0, W, H); s.lineCap = 'round';
    for (let y = 0; y < H; y += 2 + r() * 5) for (let n = 0; n < density; n++) {
      const x = r() * W, l = 120 + r() * 700; s.strokeStyle = rgba(r() < 0.7 ? INK_RGB : GRAPHITE_LIGHT_RGB, aMin + r() * (aMax - aMin)); s.lineWidth = 1 + r() * 4;
      s.beginPath(); s.moveTo(x - l / 2, y); s.lineTo(x + l / 2, y + (r() - 0.5) * 2); s.stroke(); }
    return c;
  }
  const GRAIN = streaks(232, 1, 0.02, 0.08, 0.035);
  // her colours smeared sideways: the world before the eraser (at T_IN, fixed, so every render process makes the same smear),
  // blurred along x, then broken up by the grain so it lies in streaks
  let SMEAR = null;
  function smear() {
    if (SMEAR) return SMEAR;
    const [top, ts] = mk(W, H); drawShoutTop(ts, T_IN);
    const [c, s] = mk(W, H); s.globalAlpha = 1 / 14; for (let i = 0; i < 14; i++) s.drawImage(top, (i - 7) * 14, (i % 3 - 1) * 2);
    s.globalAlpha = 1; s.globalCompositeOperation = 'destination-in'; s.drawImage(streaks(233, 3, 0.25, 0.9, 0.35), 0, 0);
    return (SMEAR = c);
  }
  // the dark strip at the left edge that the second pass does not reach: dense graphite, darkest at the bottom left
  const STAIN = (() => { const [c, s] = mk(W, H), r = rng(234); s.lineCap = 'round';
    for (let y = 0; y < H; y += 2 + r() * 3) for (let n = 0; n < 3; n++) {
      const x = LMIN + r() * 260, l = 60 + r() * 260; s.strokeStyle = rgba(r() < 0.8 ? GRAPHITE_DARK_RGB : GRAPHITE_LIGHT_RGB, 0.12 + r() * 0.3); s.lineWidth = 2 + r() * 6;
      s.beginPath(); s.moveTo(x - l / 2, y); s.lineTo(x + l / 2, y + (r() - 0.5) * 2); s.stroke(); }
    s.globalCompositeOperation = 'destination-in';
    const gx = s.createLinearGradient(LMIN, 0, LMIN + 300, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.55, 'rgba(0,0,0,0.7)'); gx.addColorStop(1, 'rgba(0,0,0,0)');
    s.fillStyle = gx; s.fillRect(0, 0, W, H);
    const gy = s.createLinearGradient(0, 0, 0, H); gy.addColorStop(0, 'rgba(0,0,0,0.35)'); gy.addColorStop(1, 'rgba(0,0,0,1)');
    s.fillStyle = gy; s.fillRect(0, 0, W, H);
    return c; })();

  // crumbs: rolled bits of rubber, grey with graphite in them. A row rides at the front edge; some drop off behind and stay.
  const crumb = (ctx, x, y, r, seed) => { const q = rng(seed), a = (q() - 0.5) * 0.9, l = r * (1.3 + q() * 1.2);
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = rgba(CARD_SHADOW_RGB, 0.35); ctx.beginPath(); ctx.ellipse(2, 3, l, r, 0, 0, 7); ctx.fill();
    ctx.fillStyle = q() < 0.5 ? '#d9d7cf' : '#c9c7bf'; ctx.beginPath(); ctx.ellipse(0, 0, l, r, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rgba(INK_RGB, 0.35 + q() * 0.3); for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc((q() - 0.5) * l, (q() - 0.5) * r, 0.8 + q() * 1.4, 0, 7); ctx.fill(); }
    ctx.restore(); };
  const CARD_SHADOW_RGB = [20, 60, 70];
  const FRONT = []; for (let y = -10; y < H + 10; ) {          // clumps of different sizes with gaps between, not an even row
    const n = 1 + Math.floor(R() * 4); for (let k = 0; k < n; k++) FRONT.push({ y: y + (R() - 0.5) * 14, dx: 2 + Math.pow(R(), 1.6) * 22, r: 1.6 + Math.pow(R(), 2) * 4.2, seed: Math.floor(R() * 1e6) });
    y += 18 + R() * 70; }
  const TRAIL = []; for (let k = 0; k < 70; k++) TRAIL.push({ x: LMIN + 40 + R() * (PARK - LMIN - 60), y: 20 + R() * (H - 40), r: 1.8 + R() * 2.6, seed: Math.floor(R() * 1e6), pass: R() < 0.55 ? 1 : 2 });
  const FLING = []; for (let k = 0; k < 26; k++) FLING.push({ x: LMIN + 8 + R() * 120, y: 380 + R() * 620, r: 2 + R() * 3, seed: Math.floor(R() * 1e6) });

  // ---------- the eraser itself: the canon's upright middle view, both ends stretched out of the frame through its blank parts ----------
  const CANON = await img('/art/canon/machine_big_eraser.png');
  const SRC = { x0: 1122, x1: 1420, top: [0, 60], blankA: [60, 220], text: [220, 830], blankB: [830, 960], bot: [960, 1024] };
  const ES = EW / (SRC.x1 - SRC.x0), EH = 1110;   // drawn from y = -15 to 1095
  const [EB, ebs] = mk(EW, EH); { ebs.imageSmoothingQuality = 'high';
    const fixed = [SRC.top, SRC.text, SRC.bot].reduce((a, [y0, y1]) => a + (y1 - y0) * ES, 0), stretch = (EH - fixed) / 2;
    let y = 0; const put = ([y0, y1], h) => { ebs.drawImage(CANON, SRC.x0, y0, SRC.x1 - SRC.x0, y1 - y0, 0, y, EW, h); y += h; };
    put(SRC.top, (SRC.top[1] - SRC.top[0]) * ES); put(SRC.blankA, stretch); put(SRC.text, (SRC.text[1] - SRC.text[0]) * ES); put(SRC.blankB, stretch); put(SRC.bot, EH - y); }
  function drawEraser(ctx, L, lift) {
    const dx = 6 + lift * 16, dy = 8 + lift * 20;
    ctx.fillStyle = rgba(CARD_SHADOW_RGB, 0.24 - lift * 0.08); ctx.fillRect(L + dx, -15 + dy, EW, EH);
    ctx.drawImage(EB, L - lift * 4, -15 - lift * 6, EW * (1 + lift * 0.035), EH);
  }

  // ---------- the composition ----------
  // The rubbed areas: pass 1 covers x >= front1 (the furthest left the eraser has reached), pass 2 covers [LMIN, front2] (the
  // furthest right its back edge has come on the way back). under(ctx, tt): page content drawn before the rub (08b's abacus);
  // over(ctx, tt): print that lands after it (the sung question is printed here by default).
  function compose(ctx, tt, { under = null, over = null } = {}) {
    if (tt < T_IN) return false;
    const E = eraserAt(tt);
    const front1 = tt < T_TURN ? Math.min(E.L, OFF_R) : LMIN;
    const front2 = tt < T_TURN ? null : tt < T_UP ? E.L + EW : PARK + EW;
    const [top, ts] = scratch(); ts.clearRect(0, 0, W, H); drawShoutTop(ts, tt);
    // the page and the rub
    ctx.save(); ctx.beginPath(); ctx.rect(front1, 0, W - front1, H); ctx.clip();
    ctx.drawImage(page, 0, 0); if (under) under(ctx, tt);
    const dirty = (x0, x1, a) => { if (x1 <= x0) return; ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip();
      ctx.globalAlpha = a; ctx.drawImage(GRAIN, 0, 0); ctx.globalAlpha = a * 0.2; ctx.drawImage(smear(), 0, 0); ctx.restore(); };
    if (front2 === null) dirty(front1, W, 1);
    else {
      dirty(front2, W, 1);                                     // not yet gone over again
      // gone over twice: cleaner in the middle, dirtier where the second pass started and where it is now
      ctx.save(); ctx.beginPath(); ctx.rect(LMIN, 0, front2 - LMIN, H); ctx.clip();
      ctx.globalAlpha = 0.45; ctx.drawImage(GRAIN, 0, 0); ctx.globalAlpha = 0.08; ctx.drawImage(smear(), 0, 0);
      ctx.globalAlpha = 1; const g = ctx.createLinearGradient(front2 - 120, 0, front2, 0); g.addColorStop(0, 'rgba(42,42,47,0)'); g.addColorStop(1, 'rgba(42,42,47,0.10)');
      ctx.fillStyle = g; ctx.fillRect(front2 - 120, 0, 120, H); ctx.restore();
      ctx.drawImage(STAIN, 0, 0);
    }
    for (const c of TRAIL) { const left = c.pass === 1 ? (front1 <= c.x - 40) : (front2 !== null && front2 >= c.x + 60); if (left && c.x > front1) crumb(ctx, c.x, c.y, c.r, c.seed); }
    if (tt >= T_TURN) for (const c of FLING) { const a = Math.min(1, (tt - T_TURN) / (2 * FR)); crumb(ctx, c.x + (1 - a) * 20, c.y, c.r, c.seed); }
    (over || printQuestion)(ctx, tt);
    ctx.restore();
    // what is left of the shout, left of the front of the first pass
    if (front1 > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, front1, H); ctx.clip(); ctx.drawImage(top, 0, 0); ctx.restore(); }
    // the eraser and the row of crumbs riding at its front edge
    if (E.on) {
      if (E.phase === 'in' || E.phase === 'park' || E.phase === 'pass1') for (const c of FRONT) crumb(ctx, E.L - c.dx, c.y, c.r, c.seed);
      drawEraser(ctx, E.L, E.lift);
    }
    return true;
  }
  let SCR = null; const scratch = () => (SCR ||= mk(W, H));

  const events = [['eraser in: clears the right column', T_IN, 'beat'], ['eraser comes down on her face: first pass', T_DOWN, 'beat'],
                  ['eraser second pass', T_TURN, 'half'], ['eraser lifts and leaves', T_UP, 'beat']];
  return { events, eraserAt, drawShoutTop, compose, printQuestion, page, Q3, SHOUT_CAM, T_IN, T_DOWN, T_TURN, T_UP, PARK, EW, LMIN };
}
