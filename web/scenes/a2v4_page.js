// The 2D demo, fourth version: A2 (0:50.05-1:02.58). Designed again from nothing (v3 reused the old sheet's header and set
// her words in a separate black strip). Rules for this page:
//   - the words are part of the paper: her words are written in pencil on her answer sheets as she sings them; the reading
//     machine's words (正解, 不正解, the result) are printed in its 16-dot head on the sheet and on its result slip;
//   - every block of text is measured and fitted into its own box, and the boxes are audited (no overlap, nothing cut by the
//     frame as the camera shows it): the audit is printed to the console as "AUDIT ..." and "FRAME AUDIT ..." lines;
//   - the camera moves with the music: a slow push through each shot, a small punch on every verdict; the hand changes place
//     only on the beat or the half beat, never slides.
// Shots: 1 the spread of 数学 and 理科, a correct mark on every beat; 2 国語 question 3, the pencil hovering; 3 ア イ ウ エ each
// printed 不正解; 4 the result slip and her stiff smile.
// Confirmed by the director as version 15 (2026-11-20). Since the shared-library refactor (2026-11-20) the beat, lyrics, layout,
// camera, hand, print and colours come from web/lib/; the frames are identical to version 15 (work/infra/refactor_diff.txt).
import { BEAT, BV0, FRAME as FR, beatV, smooth, createScore, publishAudit } from '../lib/score.js';
import { loadLyrics } from '../lib/lyrics.js';
import { textBox, createLayout } from '../lib/type.js';
import { createCamera, pushes, shakeOf, frameTimes } from '../lib/camera.js';
import { createHand, glide } from '../lib/hand.js';
import { dots16Text, dots16TextBox, print16ByCount, print16ByCountBox, pencilWriter } from '../lib/print.js';
import { FIELD, FIELD_SHADOW, FIELD_SHADOW_SLIP, PAPER, PAPER_SLIP, TEAL, TEAL_RGB, GRAPHITE, PENCIL, PENCIL_FILL, PENCIL_ERASED, FIBRE_RGB, rgba } from '../lib/palette.js';

export async function a2v4(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const SEG = [50.05, 62.58];
  const LY = await loadLyrics({ within: SEG });
  const L1 = LY.line('数学と理科は好きですが'), L2 = LY.line('国語がどうもダメで嫌いでした'), L3 = LY.line('正しいのがどれか悩んでいりゃ'),
        L4 = LY.line('どれも不正解というオチでした');

  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });

  // ---------- typesetting: measure, fit into a box, register the box for the audit ----------
  const LAY = createLayout();
  const tb = (ctx, text, font, box, o = {}) => textBox(ctx, text, font, box, { layout: LAY, ...o });
  const reg = LAY.reg;

  // ---------- the answer sheet, drawn for this page ----------
  // a sheet: paper, the subject band, the exam line, the name field; rows of bubbles are added per sheet below
  function sheetHead(s, sw, title, key) {
    s.fillStyle = PAPER; s.fillRect(0, 0, sw, s.canvas.height);
    const r = rng(title.length * 17 + sw);
    for (let k = 0; k < 700; k++) { s.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); s.fillRect(r() * sw, r() * s.canvas.height, 2 + r() * 9, 1); }
    s.fillStyle = TEAL; s.fillRect(0, 70, sw, 100); reg('band', key, [0, 70, sw, 100]);
    tb(s, title, '700 #px ZenKakuB', [48, 78, 300, 84], { maxSize: 64, color: PAPER, name: 'title', sheet: key + 'b' });
    tb(s, '解答用紙', '500 #px ZenKaku', [sw - 260, 96, 212, 48], { maxSize: 34, align: 'right', color: PAPER, name: 'kind', sheet: key + 'b' });
    tb(s, '令和八年度　第二学期　期末考査', '500 #px ZenKaku', [48, 192, sw * 0.5 - 70, 44], { maxSize: 25, name: 'exam', sheet: key });
    // the name field: label block and box, her name written inside with room to spare
    const nx = sw * 0.5 + 10, nw = sw - nx - 48, ny = 186, nh = 60;
    s.strokeStyle = TEAL; s.lineWidth = 3; s.strokeRect(nx, ny, nw, nh); s.fillStyle = TEAL; s.fillRect(nx, ny, 78, nh);
    tb(s, '氏名', '700 #px ZenKakuB', [nx + 8, ny + 8, 62, nh - 16], { maxSize: 28, align: 'center', color: PAPER, name: 'name-label', sheet: key + 'n' });
    tb(s, '鏡音リン', '600 #px Klee', [nx + 100, ny + 6, nw - 120, nh - 12], { maxSize: 40, color: PENCIL, name: 'name', sheet: key + 'n' });
    reg('name-field', key, [nx, ny, nw, nh]);
  }

  // shot 1 sheets: 900 wide, four rows of four bubbles, a verdict column at the right
  const S1W = 900, S1H = 1240;
  const WORDS1 = [160, 300, S1W - 220, 122];                                          // where her pencil words are written
  function spreadSheet(title, key) {
    const [c, s] = mk(S1W, S1H); sheetHead(s, S1W, title, key);
    s.strokeStyle = TEAL; s.lineWidth = 2; s.setLineDash([8, 6]); s.strokeRect(48, 262, S1W - 96, 170); s.setLineDash([]);
    s.fillStyle = TEAL; s.fillRect(48, 262, 96, 30); tb(s, '計算欄', '700 #px ZenKakuB', [52, 264, 88, 26], { maxSize: 20, align: 'center', color: PAPER, name: 'words-label', sheet: key + 'n' });
    reg('words', key, [48, 262, S1W - 96, 170]);                                   // her pencil words go here
    s.fillStyle = rgba(TEAL_RGB, 0.12); s.fillRect(48, 452, S1W - 96, 42);
    tb(s, '解答番号', '700 #px ZenKakuB', [60, 456, 140, 34], { maxSize: 22, align: 'center', name: 'grid-head-no', sheet: key + 'n' });
    tb(s, '解　答　欄', '700 #px ZenKakuB', [230, 456, 400, 34], { maxSize: 22, align: 'center', name: 'grid-head-ans', sheet: key + 'n' });
    reg('grid-head', key, [48, 452, S1W - 96, 42]);
    const rowY = i => 570 + i * 132, colX = j => 262 + j * 118, RX = 46, RY = 31;
    for (let i = 0; i < 3; i++) {
      const y = rowY(i);
      if (i % 2 === 0) { s.fillStyle = rgba(TEAL_RGB, 0.06); s.fillRect(48, y - 66, S1W - 96, 132); }
      s.fillStyle = TEAL; s.fillRect(80, y - 34, 76, 68);
      tb(s, String(i + 1), '700 #px ZenKakuB', [80, y - 30, 76, 60], { maxSize: 46, align: 'center', color: PAPER });
      for (let j = 0; j < 4; j++) { const x = colX(j); s.strokeStyle = TEAL; s.lineWidth = 4; s.beginPath(); s.ellipse(x, y, RX, RY, 0, 0, 7); s.stroke();
        tb(s, String(j + 1), '500 #px ZenKaku', [x - RX, y - RY, RX * 2, RY * 2], { maxSize: 34, align: 'center' }); }
      reg(`row${i}`, key, [48, y - 66, colX(3) + RX + 10 - 48, 132]);
      reg(`verdict${i}`, key, [colX(3) + RX + 24, y - 40, S1W - 48 - (colX(3) + RX + 24), 80]);
      s.fillStyle = GRAPHITE; s.fillRect(16, y - 8, 40, 16);
    }
    return { c, s, rowY, colX, RX, RY, verdictX: (colX(3) + RX + 24 + S1W - 48) / 2 };
  }
  const MATH = spreadSheet('数学', 'math'), SCI = spreadSheet('理科', 'sci');
  LAY.audit('spread sheets');

  // shot 2-3 sheet: 国語, 1640 wide; the machine-printed question, four choices with their wording, her margin at the right
  const S2W = 1640, S2H = 1260;
  const CHOICES = [['ア', '悲しかった'], ['イ', '淋しかった'], ['ウ', '怒っていた'], ['エ', '何も感じなかった']];
  const KOKU = (() => {
    const [c, s] = mk(S2W, S2H); sheetHead(s, S2W, '国語', 'koku');
    const qBox = [56, 276, 1180, 190];
    // (the question itself is printed in renderAt, character by character, as the shot begins)
    reg('question', 'koku', qBox);
    const rowY = i => 580 + i * 150, BX = 690, RX = 56, RY = 38;      // wording at the left, the bubble after it, the verdict after that
    CHOICES.forEach(([k, txt], i) => {
      const y = rowY(i);
      if (i % 2 === 0) { s.fillStyle = rgba(TEAL_RGB, 0.06); s.fillRect(56, y - 75, 1180, 150); }
      s.strokeStyle = TEAL; s.lineWidth = 4; s.beginPath(); s.ellipse(BX, y, RX, RY, 0, 0, 7); s.stroke();
      tb(s, k, '500 #px ZenKaku', [BX - RX, y - RY, RX * 2, RY * 2], { maxSize: 40, align: 'center' });
      tb(s, `${k}　${txt}`, '600 #px ShipporiB', [96, y - 36, BX - RX - 130, 72], { maxSize: 54, color: TEAL, name: `choice${i}`, sheet: 'koku' });
      reg(`stamp${i}`, 'koku', [BX + RX + 40, y - 62, 1236 - (BX + RX + 40), 124]);
    });
    reg('margin', 'koku', [1300, 270, S2W - 1300 - 40, 940]);
    return { c, rowY, BX, RX, RY };
  })();
  LAY.audit('koku sheet');

  // where the sheets lie in the frame (square to it); the frame point of a sheet point
  const LAYOUT = { math: [480, 560 + 60], sci: [1440, 560 + 60], koku: [960, 560 + 30] };
  const DIM = { math: [S1W, S1H], sci: [S1W, S1H], koku: [S2W, S2H] };
  const toFrame = (key, [px, py]) => [LAYOUT[key][0] - DIM[key][0] / 2 + px, LAYOUT[key][1] - DIM[key][1] / 2 + py];

  // ---------- marks ----------
  const cache = {};
  function fillCanvas(rx, ry, seed, erased) {
    const key = `${rx}_${seed}_${erased ? 1 : 0}`; if (cache[key]) return cache[key];
    const [c, x] = mk(rx * 2 + 40, ry * 2 + 40), r = rng(seed);
    x.save(); x.beginPath(); x.ellipse(rx + 20, ry + 20, rx * 0.93, ry * 0.9, 0, 0, 7); x.clip();
    if (!erased) {
      x.fillStyle = PENCIL_FILL; x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = 'destination-out'; x.lineCap = 'round';
      for (let k = 0; k < 24; k++) { x.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.1})`; x.lineWidth = 1 + r() * 2; const y = r() * c.height * 1.4;
        x.beginPath(); x.moveTo(0, y); x.lineTo(c.width, y - c.width * 0.42); x.stroke(); }
    } else { x.fillStyle = PENCIL_ERASED; x.fillRect(0, 0, c.width, c.height); }
    x.restore(); return (cache[key] = c);
  }
  // a mark appears stroke by stroke: a wipe across it in three frames
  function drawFill(s, cx, cy, rx, ry, seed, age, erased = false) {
    if (age < 0) return; const c = fillCanvas(rx, ry, seed, erased), f = Math.min(1, (age / FR + 1) / 3);
    s.save(); s.beginPath(); s.rect(cx - rx - 20, cy - ry - 20, (rx * 2 + 40) * f, ry * 2 + 40); s.clip(); s.drawImage(c, cx - rx - 20, cy - ry - 20); s.restore();
  }

  // ---------- the score: every visual event on the measured beat (lib/score.js), with no lead ----------
  // Cuts land on the beat before a line's first syllable; the hand lands on the beat and lets go on the half beat; prints,
  // stamps and swaps are on beats; the camera moves start and stop on beats.
  const S = createScore('a2', { t0: SEG[0], t1: SEG[1] });
  const ev = S.ev;
  const C2 = ev('cut to 国語', beatV(143)), C4 = ev('cut to the slip', beatV(159)), C4B = ev('cut to her face', beatV(161));
  // the camera: one eased push per shot, between two beats (registered in the score by pushes())
  const push = pushes(S, [[beatV(136), beatV(143), 0.03, 'push1'], [beatV(144), beatV(158), 0.05, 'push2'],
                          [beatV(160), C4B, 0.02, 'slip push'], [C4B, beatV(168), 0.04, 'face push']]);
  // shot 1: six marks on six beats (math 3, science 3); each verdict on the next beat
  const S1 = [['math', 0, 1, 136], ['math', 1, 3, 137], ['math', 2, 2, 138], ['sci', 0, 2, 139], ['sci', 1, 0, 140], ['sci', 2, 1, 141]]
    .map(([key, row, ch, b]) => ({ key, row, ch, t: ev(`mark ${key}${row}`, beatV(b)), tv: ev(`正解 ${key}${row}`, beatV(b + 1)), tl: ev(`lift ${key}${row}`, beatV(b + 0.5), 'half') }));
  // 国語: the question printed from the cut to the next beat; the pencil hovers over a choice on every other beat; then ア イ ウ エ
  // on four beats, each 不正解 on the next beat; the last stamp (a bar line) shakes the page
  const QP0 = C2, QP1 = ev('question printed', beatV(144));
  const HOVER = [[0, 144], [3, 146], [1, 148], [2, 150]].map(([c, b]) => ({ c, t: ev(`hover ${c}`, beatV(b)), t0: ev(`hover move ${c}`, beatV(b - 1)) }));
  const S3 = [0, 1, 2, 3].map(j => ({ ch: j, t: ev(`mark ${j}`, beatV(152 + j)), tv: ev(`不正解 ${j}`, beatV(153 + j)), tl: ev(`lift ${j}`, beatV(152.5 + j), 'half') }));
  const T_SHAKE = S3[3].tv;
  // the slip rises over one beat; her face from 161 (the line goes on printing on the slip's end below her)
  const RISE1 = ev('slip in', beatV(160));
  const SH = k => k === 'math' ? MATH : SCI;

  // ---------- the drawings' timeline: decides which drawing is on screen, and is the hold audit ----------
  // Key drawings at least two beats (most much longer), an in-between at least half a beat, so it reads as a movement and
  // never flashes. Her face: the stiff smile holds three beats, the in-between (drawn from the two keys, round 70) a whole
  // beat from 164, and from 165 the cracked smile holds to the end (the next line, 本日の宿題は, starts at 167.4).
  S.hold('shot', 'shot spread', BV0 + 135 * BEAT, C2, { kind: 'shot' });
  S.hold('shot', 'shot 国語', C2, C4, { kind: 'shot' });
  S.hold('shot', 'shot slip', C4, C4B, { kind: 'shot' });
  S.hold('shot', 'shot face', C4B, beatV(168), { kind: 'shot' });
  S.hold('hand', 'hand (one drawing)', SEG[0], C4, { kind: 'key', file: '/art/cut/hpen3.png', onBeat: false });
  S.hold('face', 'face stiff', C4B, beatV(164), { kind: 'key', file: '/art/cut/rface_ochi.png' });
  S.hold('face', 'face in-between', beatV(164), beatV(165), { kind: 'inbetween', file: '/art/cut/rface_ochi_mid.png' });
  S.hold('face', 'face crack', beatV(165), beatV(168), { kind: 'key', file: '/art/cut/rface_ochi_crack.png' });
  S.finish();

  // ---------- drawings (loaded from the timeline) and the hand ----------
  const IMG = {};
  for (const h of S.holds) if (h.file && !IMG[h.file]) IMG[h.file] = rinPalImage(await img(h.file));
  const HAND = await createHand({ name: 'hpen3', image: IMG['/art/cut/hpen3.png'], W, H: 1080 });
  let HAND_HS = 0.6;                                                                 // set per shot: one size for the whole shot
  const SLIP_W = 1240, SLIP_X = 960 - 1240 / 2, SLIP_Y = 70;
  const [SLIPC, slg] = mk(SLIP_W, 1400);
  { slg.fillStyle = PAPER_SLIP; slg.beginPath(); slg.moveTo(0, 14);
    for (let i = 0; i <= 62; i++) slg.lineTo(i * SLIP_W / 62, i % 2 ? 2 : 16);      // the torn top edge
    slg.lineTo(SLIP_W, 1400); slg.lineTo(0, 1400); slg.closePath(); slg.fill();
    const r = rng(5); for (let k = 0; k < 900; k++) { slg.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); slg.fillRect(r() * SLIP_W, 20 + r() * 1380, 2 + r() * 8, 1); }
    slg.fillStyle = TEAL; slg.fillRect(0, 40, SLIP_W, 10);
    textBox(slg, '読取結果', '700 #px ZenKakuB', [60, 80, 400, 70], { maxSize: 52 });
    textBox(slg, 'No.2026-0314　国語　問三', '500 #px ZenKaku', [SLIP_W - 640, 92, 580, 50], { maxSize: 32, align: 'right' });
    const dash = y => { slg.strokeStyle = TEAL; slg.setLineDash([10, 9]); slg.lineWidth = 3; slg.beginPath(); slg.moveTo(60, y); slg.lineTo(SLIP_W - 60, y); slg.stroke(); slg.setLineDash([]); };
    dash(176);
    CHOICES.forEach(([k], i) => dots16Text(slg, `${k}　不正解`, 90 + (i % 2) * 560, 236 + Math.floor(i / 2) * 76, 3.4, 60 + i));
    dash(370);
    for (let y = 1300; y < 1400; y += 34) { slg.fillStyle = TEAL; slg.fillRect(40, y, 14, 14); slg.fillRect(SLIP_W - 54, y, 14, 14); } }

  // ---------- the camera ----------
  const CAM = createCamera(g, { W, H: 1080, bg: FIELD }), wg = CAM.wg;
  const camSpread = tt => [push(0, tt), 960, 560, 0];
  const camKoku = tt => [push(1, tt), 960, 540, shakeOf(tt, [T_SHAKE], 5)];

  // ---------- layout of the dynamic text, and the frame audit (the camera as it actually moves, every frame) ----------
  for (const key of ['math', 'sci']) LAY.text('pencil words', key + ':pencil', PEN.lineBox(key === 'math' ? L1.slice(0, 6) : L1.slice(6), WORDS1, 104));
  for (let i = 0; i < 3; i++) for (const key of ['math', 'sci']) LAY.text(`正解 ${i}`, key + ':print', print16ByCountBox('正解', MATH.verdictX, MATH.rowY(i), 3.2));
  [['問三　この時の主人公の気持ちとして', 0], ['　　　最も適切なものを選べ。', 1]].forEach(([txt, li]) =>
    LAY.text(`question ${li}`, 'koku:print', dots16TextBox(txt, 56, 276 + 46 + li * 16 * 3.8 * 1.35, 3.8, 4 + li)));
  for (let j = 0; j < 4; j++) LAY.text(`不正解 ${j}`, 'koku:print', print16ByCountBox('不正解', 1010, KOKU.rowY(j), 4.6));
  LAY.text('pencil L2', 'koku:pencil', PEN.columnBox(L2, 1530, 300, 760, 60));
  LAY.text('pencil L3', 'koku:pencil', PEN.columnBox(L3, 1400, 300, 760, 60));
  LAY.audit('dynamic text');
  const onSheet = key => p => toFrame(key, p);
  const viewsOf = (cam, a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy, sh] = cam(t); return { t, ...CAM.view(z, fx, fy, sh) }; });
  LAY.frameCheck('shot spread', { sheets: { math: onSheet('math'), mathb: onSheet('math'), mathn: onSheet('math'), 'math:pencil': onSheet('math'), 'math:print': onSheet('math'),
                                            sci: onSheet('sci'), scib: onSheet('sci'), scin: onSheet('sci'), 'sci:pencil': onSheet('sci'), 'sci:print': onSheet('sci') },
                                  views: viewsOf(camSpread, SEG[0], C2) });
  LAY.frameCheck('shot 国語', { sheets: { koku: onSheet('koku'), kokub: onSheet('koku'), kokun: onSheet('koku'), 'koku:pencil': onSheet('koku'), 'koku:print': onSheet('koku') },
                               views: viewsOf(camKoku, C2, C4) });
  publishAudit(S, LAY);

  window.renderAt = async t => {
    const tt = t;                                   // no lead: on the hit, on the syllable
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (tt < C2) {
      // ---- shot 1: the spread ----
      wg.fillStyle = FIELD; wg.fillRect(0, 0, W, 1080);
      for (const key of ['math', 'sci']) {
        const sh = SH(key), [c, s] = mk(S1W, S1H); s.drawImage(sh.c, 0, 0);
        PEN.line(s, key === 'math' ? L1.slice(0, 6) : L1.slice(6), WORDS1, tt, 104);
        for (const m of S1.filter(m => m.key === key)) {
          drawFill(s, sh.colX(m.ch), sh.rowY(m.row), sh.RX, sh.RY, 100 + m.row * 7 + m.ch, tt - m.t);
          print16ByCount(s, '正解', sh.verdictX, sh.rowY(m.row), 3.2, tt - m.tv, 3 + m.row, { frame: true });
        }
        const [x0, y0] = toFrame(key, [0, 0]);
        wg.fillStyle = FIELD_SHADOW; wg.fillRect(x0 + 12, y0 + 16, S1W, S1H); wg.drawImage(c, x0, y0);
      }
      const posOf = m => toFrame(m.key, [SH(m.key).colX(m.ch), SH(m.key).rowY(m.row)]);
      HAND_HS = Math.max(0.6, (1080 + 40 - posOf(S1[0])[1]) / (HAND.image.height - HAND.tip[1]));
      const h = glide(S1, tt, posOf, [1720, 1250]);
      if (h) HAND.draw(wg, h.p[0], h.p[1], h.lift, HAND_HS);
      else { // before the first mark: hovering, then down over the last half beat, touching the paper on the beat
        const [hx, hy] = posOf(S1[0]), d = Math.max(0, Math.min(1, (tt - (S1[0].t - BEAT / 2)) / (BEAT / 2))), up = 1 - d * d;
        HAND.draw(wg, hx + 8 * up, hy + (-10 + 3 * Math.sin((tt - BV0) / BEAT * Math.PI)) * up, up, HAND_HS); }
      const [z, fx, fy] = camSpread(tt); CAM.show(z, fx, fy);
    } else if (tt < C4) {
      // ---- shots 2-3: 国語 ----
      wg.fillStyle = FIELD; wg.fillRect(0, 0, W, 1080);
      const [c, s] = mk(S2W, S2H); s.drawImage(KOKU.c, 0, 0);
      { const Q = [['問三　この時の主人公の気持ちとして', 0], ['　　　最も適切なものを選べ。', 1]], total = Q[0][0].length + Q[1][0].length;
        const n = Math.floor(total * Math.min(1, (tt - QP0) / (QP1 - QP0))); let used = 0;
        for (const [txt, li] of Q) { const k = Math.max(0, Math.min(txt.length, n - used)); used += txt.length;
          if (k > 0) dots16Text(s, txt.slice(0, k), 56, 276 + 46 + li * 16 * 3.8 * 1.35, 3.8, 4 + li); } }
      S3.forEach(m => drawFill(s, KOKU.BX, KOKU.rowY(m.ch), KOKU.RX, KOKU.RY, 300 + m.ch, tt - m.t));
      S3.forEach(m => print16ByCount(s, '不正解', 1010, KOKU.rowY(m.ch), 4.6, tt - m.tv, 21 + m.ch, { frame: true, label: PAPER, slam: true }));
      PEN.column(s, L2, 1530, 300, 760, tt, 60);
      PEN.column(s, L3, 1400, 300, 760, tt, 60);
      const [x0, y0] = toFrame('koku', [0, 0]);
      wg.fillStyle = FIELD_SHADOW; wg.fillRect(x0 + 14, y0 + 18, S2W, S2H); wg.drawImage(c, x0, y0);
      const posK = c => toFrame('koku', [KOKU.BX, KOKU.rowY(c)]);
      HAND_HS = Math.max(0.62, (1080 + 40 - posK(0)[1]) / (HAND.image.height - HAND.tip[1]));
      if (tt < S3[0].t) {
        // hovering: an eased move over one beat to a new choice, then a beat of hovering there (a slow drift)
        let cur = HOVER[0], prev = null;
        for (let i = 0; i < HOVER.length; i++) if (tt >= HOVER[i].t0) { cur = HOVER[i]; prev = HOVER[i - 1] || null; }
        const target = tt >= HOVER[HOVER.length - 1].t + BEAT ? { c: S3[0].ch, t: S3[0].t, t0: HOVER[HOVER.length - 1].t + BEAT } : null;
        const A = target || cur, B0p = target ? HOVER[HOVER.length - 1] : prev;
        let [hx, hy] = posK(A.c);
        if (B0p && tt < A.t) { const [px, py] = posK(B0p.c), u = smooth((tt - A.t0) / (A.t - A.t0)); hx = px + (hx - px) * u; hy = py + (hy - py) * u - 16 * Math.sin(Math.PI * u); }
        const d = Math.max(0, Math.min(1, (tt - (S3[0].t - BEAT / 2)) / (BEAT / 2))), up = 1 - d * d;   // down onto ア on the beat
        HAND.draw(wg, hx + 8 * up, hy + (-12 + 4 * Math.sin((tt - BV0) / BEAT * Math.PI)) * up, up, HAND_HS);
      } else {
        const h = glide(S3, tt, c => posK(c.ch), [1780, 1260]);
        HAND.draw(wg, h.p[0], h.p[1], h.lift, HAND_HS);
      }
      const [z, fx, fy, sh] = camKoku(tt); CAM.show(z, fx, fy, sh, tt);
    } else {
      // ---- shot 4a: her view of the result slip; 4b: her face, the slip's end in the bottom of the frame ----
      const shown = L4.filter(([, tc]) => tt >= tc), p1 = shown.slice(0, 9).map(([c]) => c).join(''), p2 = shown.slice(9).map(([c]) => c).join('');
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = FIELD; g.fillRect(0, 0, W, 1080);
      if (tt < C4B) {
        const rise = smooth((tt - C4) / (RISE1 - C4)), z = push(2, tt);
        g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540 + (1 - rise) * 160);
        g.fillStyle = FIELD_SHADOW_SLIP; g.fillRect(SLIP_X + 18, SLIP_Y + 22, SLIP_W, 1200);
        g.drawImage(SLIPC, SLIP_X, SLIP_Y);
        if (p1) dots16Text(g, p1, SLIP_X + 70, SLIP_Y + 470, 7.0, 12);
        g.restore();
      } else {
        // the drawing on screen comes from the timeline (the same data as the hold audit)
        const F = IMG[S.at('face', tt).file];
        const fs = 0.7, fw = F.width * fs, fh = F.height * fs, z = push(3, tt);
        g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        g.drawImage(F, 960 - fw / 2, 64, fw, fh);
        const sy = 1080 - 262, SS = 0.6, SX = 960 - SLIP_W * SS / 2;
        g.fillStyle = FIELD_SHADOW_SLIP; g.fillRect(SX + 14, sy + 16, SLIP_W * SS, 600);
        g.save(); g.translate(SX, sy); g.scale(SS, SS); g.drawImage(SLIPC, 0, 340, SLIP_W, 900, 0, 0, SLIP_W, 900);
        if (p1) dots16Text(g, p1, 70, 130, 7.0, 12);
        if (p2) dots16Text(g, p2, 70, 330, 9.0, 13);
        g.restore();
        g.restore();
      }
    }
  };
  await window.renderAt(P('t0', 50.05));
}
