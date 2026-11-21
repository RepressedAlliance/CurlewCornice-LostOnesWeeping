// Segment 06, A2 (k135-k171, frames [1510, 1910), lines 6-10; docs/分镜/06_A2.md 第 3 稿, 帧表_定稿).
// This is Demo 1 version 15 (web/scenes/a2v4_page.js, confirmed by the director 2026-11-20) put back into the film. The page is a
// copy of a2v4_page.js; everything up to k167 is the confirmed page line for line (the original file is not touched), and the
// changes are only these:
//   - timing: the film shows frame g at song time g/30, the confirmed render showed its frame i at 50.05 + i/30; the
//     segment is placed so that v15 frame = global frame - 1501 (docs/分镜/06_A2.md 第 1 节, picture half a frame early, as in
//     the registry before), so renderAt(g/30) draws exactly the time v15 drew for that frame (pageTime below) and frames
//     1510-1864 are pixel for pixel the confirmed frames (checked with work/infra/frame_diff.py);
//   - the segment starts at k135 (frame 1510, in the bass gap k134.25-k135.75) instead of 50.05;
//   - the tail k167-k171 (new, 方案甲 「镜头跟纸走」): at k167 the reader feeds the slip up 80 px in four frames (no bounce) and
//     the camera starts a single even move down (2 frames up to speed, 14.5 px a frame, 6 frames to stop, 585 px), so
//     her eyes and tears leave the top edge just at k171 and only her trembling mouth and chin stay; the slip goes on printing
//     line 10 「本日の宿題は」 as it is sung, in the same 16-dot size, left margin and line spacing as 「オチでした」, a light print
//     (no slam, no shake: 全片分镜 审查后改定 2); the slip is lengthened (plain paper, no sprocket holes, like the part above)
//     and runs down into the slot of the reader's paper exit (card_reader_cutaway ⑥, drawn in code, teal print: the housing's
//     top and a plain exit slot with its lip, no print head), which comes in at the bottom from about k170;
//   - the timeline: shot face and face crack now end at k171 (from k167 carried up out of frame by the move);
//   - 2026-11-21 (card unification, 同类自查 a): the last 不正解 (エ) slams about its bottom centre instead of its centre, so on
//     its hit frame its ruled frame no longer runs out of the bottom edge (see stampSlam); this changes frames 1743-1745 only.
//   - 2026-11-21 (director, on the whole film: “cuts and motion should follow the rock song's rhythm”“lyrics appear slightly behind the singing”):
//     * lyrics: every sung character (lines 6-10) reads on the frame its onset falls in, floor(t * 30) (制作约定 第六节).
//       Sung gates run on FILM time (g / 30), not on this page's time, which is half a frame ahead (pageTime): the pencil
//       (lines 6-8, print.js pencilWriter: 55% on the frame before, whole on the onset frame) and the slip's 16-dot lines 9-10
//       (whole from the onset frame, sungOn below; was tt >= t, up to a frame late). LYRIC AUDIT checks every character.
//     * rhythm: the three crashes of A2 get an answer. k136 (first mark) a 1.5% punch, k152 (ア, the first of the four
//       不正解) a 2% punch (camera.js punch, tau 0.11); k168 (the crash after the k166.5-k167.75 snare fill): the tail's one
//       even move is split into a step and a go: on k167 (the fill) the reader feeds the slip 80 px and the camera steps
//       down STEP_PX in four frames and stops, so the line 10 print position is in frame for 「本」 (f1869); everything holds
//       still through the rest of the fill; on the crash k168 the camera starts the move down (2 frames to speed, even, 6
//       frames to rest at k171, the same 585 px in all, so the k171 frame and the hand-over to 07 are unchanged). Still no
//       sink or shake on the slip at k168 (全片分镜 审查后改定 2).
//   - 2026-11-21 (director, second cut: “screen motion can have rhythm but must not cause dizziness”; 制作约定 第六节「整屏运动」):
//     * no punch on k136 (the first mark printing is the hit); no shake on the last 不正解 (the stamp's own slam is the hit);
//     * k152 (ア, crash) is a registered 大击: in over 2 frames, back over 16 frames, eased (punchBig);
//     * the slip comes in at the cut k159 already rising and settles by k160 (eased out: no start-up jolt after the cut);
//     * the tail's move down (585 px, same k171 frame): an eased drift of DRIFT_PX from k166, easing to rest on k168, that brings line 10's
//       print position into frame for 「本」 (f1869) (was a 100 px step in 4 frames on k167); from rest on the crash k168
//       (the segment's loudest crash, the end of the fill: a registered 大击) the move sets off, up to speed in KICK frames;
//     * MOTION AUDIT (camera.js) on every frame as shown; the hand is placed by its pencil point measured on hpen3 itself
//       (art/cut/seg06_parts.json via parts.js partOf; PART AUDIT: the anchor axis is the drawn pencil's centreline and the
//       point is on the drawn graphite).
// The rest of this header is the confirmed page's own.
//
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
import { BEAT, BV0, FRAME as FR, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics, lyricAudit, onsetFrame } from '../../lib/lyrics.js';
import { textBox, createLayout } from '../../lib/type.js';
import { createCamera, pushes, frameTimes, move, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, axisAudit, partAudit, PIX, partReport } from '../../lib/parts.js';
import { createHand, glide } from '../../lib/hand.js';
import { dots16Text, dots16TextBox, print16ByCount, print16ByCountBox, pencilWriter, sungBuild, onsetFrameTime } from '../../lib/print.js';
import { rng as camRng } from '../../lib/card.js';                  // the camera's shake generator (camera.js), for the slam audit only
import { FIELD, FIELD_SHADOW, FIELD_SHADOW_SLIP, PAPER, PAPER_SLIP, TEAL, TEAL_RGB, GRAPHITE, PENCIL, PENCIL_FILL, PENCIL_ERASED, FIBRE_RGB, rgba } from '../../lib/palette.js';

// the segment on the film's frame grid (帧表_定稿) and where v15 sits on it
export const F0 = 1510, F1 = 1910, V15_T0 = 50.05, V15_F = 1501;
// the time this page draws for a film time t = g/30: exactly the value web/render_seq.mjs used for v15 frame g - 1501
// (t0 + i / fps with t0 = 50.05), so the confirmed frames come out bit for bit
export const pageTime = t => V15_T0 + (Math.round(t * 30) - V15_F) / 30;
// page time minus film time (1/60 s): sung characters are gated on film time, tt - FILM_OFF = g / 30
export const FILM_OFF = V15_T0 - V15_F / 30;
// a sung character of the 16-dot slip lines is whole from the frame its onset falls in (print.js sungBuild on film time)
const sungOn = (tt, t) => sungBuild(tt - FILM_OFF - t) >= 1;
// debug only (lyric read probe, work/seg/06/lyr_probe.mjs): window.__lyrHide = 'line:j' hides that sung character
const hidden = (line, j) => typeof window !== 'undefined' && window.__lyrHide === `${line}:${j}`;
const pencilChars = (L, line, off = 0) => L.map(([c, t], j) => hidden(line, j + off) ? [c, 1e9] : [c, t]);

export default async function seg06(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const SEG = [F0 / 30, F1 / 30];                          // film time
  const PT0 = pageTime(SEG[0]), PT1 = pageTime(SEG[1]);    // page time of the first frame and of the end
  const LY = await loadLyrics({ within: SEG });
  const L1 = LY.line('数学と理科は好きですが'), L2 = LY.line('国語がどうもダメで嫌いでした'), L3 = LY.line('正しいのがどれか悩んでいりゃ'),
        L4 = LY.line('どれも不正解というオチでした');
  const L5 = LY.lineAt(10, '本日の宿題は');                // line 10, printed on the slip in the tail

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
  const S = createScore('seg_06', { t0: SEG[0], t1: SEG[1] });
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
  // The 不正解 slams (print16ByCount's: x1.22 on the hit frame, back to 1 in three frames). print16ByCount grows a stamp about
  // its centre. The last stamp (エ) sits 5.9 px above the frame's bottom edge once settled, and on its hit frame (g1743) the
  // centred growth pushed its ruled frame out of the picture (rows 1076-1079 dark on the render; SLAM AUDIT: cut). So each stamp
  // grows about an anchor on the side away from its nearest neighbour (根因清单: 锚点选在远离邻近元素的一侧): ア イ ウ about their
  // centre, exactly as v15 (free on every side: SLAM AUDIT 0 overlaps), エ about its bottom centre, so it grows up and sideways,
  // towards the settled ウ 30 px above, away from the frame edge. One function for the drawing and the audit (SLAM below).
  const STAMP = { x: 1010, k: 4.6 };
  STAMP.w = 3 * 16 * STAMP.k + 16 * STAMP.k * 0.9; STAMP.h = 16 * STAMP.k * 1.55; STAMP.lw = Math.max(3, STAMP.k * 1.3);
  const stampSlam = (j, age) => ({ sc: 1 + 0.22 * Math.pow(1 - Math.min(1, age / (3 * FR)), 2), ax: STAMP.x,
                                   ay: j === 3 ? KOKU.rowY(j) + STAMP.h / 2 + STAMP.lw / 2 : KOKU.rowY(j) });
  function drawStamp(s, j, age) {
    if (j !== 3) return print16ByCount(s, '不正解', STAMP.x, KOKU.rowY(j), STAMP.k, age, 21 + j, { frame: true, label: PAPER, slam: true });
    if (age < 0) return;
    const { sc, ax, ay } = stampSlam(j, age);
    s.save(); s.translate(ax, ay); s.scale(sc, sc); s.translate(-ax, -ay);
    print16ByCount(s, '不正解', STAMP.x, KOKU.rowY(j), STAMP.k, age, 21 + j, { frame: true, label: PAPER });
    s.restore();
  }
  // the slip rises over one beat; her face from 161 (the line goes on printing on the slip's end below her)
  const RISE1 = ev('slip in', beatV(160));
  // already rising on the cut, eased out to rest on k160 (an ease-in from rest right after the cut was a 7% jolt)
  const slipRise = tt => { const u = Math.min(1, Math.max(0, (tt - C4) / (RISE1 - C4))); return 1 - (1 - u) * (1 - u); };
  const SH = k => k === 'math' ? MATH : SCI;
  // the crashes (work/rhythm_diag: C on k136, k152, k168): a zoom punch on the first two, a start of motion on the third
  // 2026-11-21 (第六节「整屏运动」): k136 has no punch any more (the first mark is the hit); k152 is the one 大击 of the 国語
  // shot: in over BIG_IN, back over BIG_OUT (>= 12 frames), eased, never reversing on the way back
  const T_BIG = ev('大击: crash k152, ア', beatV(152)), BIG_AMT = 0.02, BIG_IN = 2 * FR, BIG_OUT = 16 * FR;
  const punchAt = tt => { const u = tt - T_BIG; if (u < 0) return 0;
    if (u < BIG_IN) return BIG_AMT * (1 - Math.pow(1 - u / BIG_IN, 2));
    return BIG_AMT * (1 - smooth((u - BIG_IN) / BIG_OUT)); };
  // the tail: k167 (the snare fill) the reader feeds the slip up and the camera steps down and stops; k168 (the crash) the
  // camera starts the move down to k171
  const T_FEED = ev('paper feed', beatV(167));
  const [TD0, TD1] = move(S, 'drift down', beatV(166), beatV(168));
  const [TM_BEAT, TM1] = move(S, 'move down', ev('大击: move down sets off on the crash k168', beatV(168)), beatV(171));
  // the move's clock starts one frame before the crash's frame (f1876), so that frame already shows the first frame of
  // motion (started at the beat itself, the beat frame shows only 0.3 frame of it, under 1 px, and the eye sees the start
  // a frame late: first render, 2026-11-21)
  const TM0 = onsetFrameTime(TM_BEAT) + FILM_OFF - FR;

  // ---------- the drawings' timeline: decides which drawing is on screen, and is the hold audit ----------
  // Key drawings at least two beats (most much longer), an in-between at least half a beat, so it reads as a movement and
  // never flashes. Her face: the stiff smile holds three beats, the in-between (drawn from the two keys, round 70) a whole
  // beat from 164, and from 165 the cracked smile holds to the end (the next line, 本日の宿題は, starts at 167.4).
  S.hold('shot', 'shot spread', BV0 + 135 * BEAT, C2, { kind: 'shot' });
  S.hold('shot', 'shot 国語', C2, C4, { kind: 'shot' });
  S.hold('shot', 'shot slip', C4, C4B, { kind: 'shot' });
  S.hold('shot', 'shot face', C4B, beatV(171), { kind: 'shot' });
  S.hold('hand', 'hand (one drawing)', PT0, C4, { kind: 'key', file: '/art/cut/hpen3.png', onBeat: false });
  S.hold('face', 'face stiff', C4B, beatV(164), { kind: 'key', file: '/art/cut/rface_ochi.png' });
  S.hold('face', 'face in-between', beatV(164), beatV(165), { kind: 'inbetween', file: '/art/cut/rface_ochi_mid.png' });
  // from k167 carried up by the move; the eyes are whole until about k170.25, then leave the top edge (gone at k171)
  S.hold('face', 'face crack', beatV(165), beatV(171), { kind: 'key', file: '/art/cut/rface_ochi_crack.png' });
  S.finish();

  // ---------- drawings (loaded from the timeline) and the hand ----------
  const IMG = {};
  for (const h of S.holds) if (h.file && !IMG[h.file]) IMG[h.file] = rinPalImage(await img(h.file));
  // the pencil point the hand is placed by: measured on hpen3 itself (parts.js; no anchor borrowed from another drawing)
  const PA = await loadPartAnchors('/art/cut/seg06_parts.json');
  const HAND = await createHand({ name: 'hpen3', image: IMG['/art/cut/hpen3.png'], W, H: 1080, tip: partOf(PA, 'hpen3', 'tip').point });
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

  // ---------- the tail (k167-k171): numbers only here; its canvases are made on its first frame, so nothing new is created
  // while the confirmed frames are drawn (GPU resource order changes pixels, work/infra/refactor_diff.txt) ----------
  // face shot geometry (as in v15 below): the slip's end at world y FACE_SY, scale FACE_SS, its local (0, 0) = SLIPC (0, 340)
  const FACE_SY = 1080 - 262, FACE_SS = 0.6, FACE_SX = 960 - SLIP_W * FACE_SS / 2;
  const Z_END = 1 + 0.04;                                    // the face push at rest (from k168)
  const FEED_PX = 80, FEED_W = FEED_PX / Z_END, FEED_DUR = 4 * FR;          // the feed: 80 px on screen in four frames
  const feedOf = tt => FEED_W * (1 - Math.pow(1 - Math.min(1, Math.max(0, (tt - T_FEED) / FEED_DUR)), 2));   // eased out, no bounce
  // the move down, 585 px in all (puts the tears' lowest point, 578 px at rest, measured on v15's last frames, just past the
  // top edge at k171): first a step of STEP_PX on k167 in four frames (eased out, no bounce), which puts 「本」 (f1869) well
  // inside the bottom edge; still to the crash; from k168 the rest, up to speed in 2 frames, even, to rest in 6 frames
  // (2026-11-21, 第六节: the step became an eased drift DRIFT_PX over k166-k168 (at rest on the crash), so 「本」 is in frame without a jolt;
  // the set-off on k168 takes KICK frames to speed)
  const MOVE_PX = 585, DRIFT_PX = 130, MAIN_PX = MOVE_PX - DRIFT_PX;
  const ACC = 3 * FR, DEC = 6 * FR, MDUR = TM1 - TM0, VMOVE = MAIN_PX / (MDUR - ACC / 2 - DEC / 2);
  const stepOf = tt => DRIFT_PX * smooth((tt - TD0) / (TD1 - TD0));
  const mainOf = tt => { const u = tt - TM0; if (u <= 0) return 0; if (u >= MDUR) return MAIN_PX;
    if (u < ACC) return VMOVE * u * u / (2 * ACC);
    if (u < MDUR - DEC) return VMOVE * (u - ACC / 2);
    const w = MDUR - u; return MAIN_PX - VMOVE * w * w / (2 * DEC); };
  const moveOf = tt => stepOf(tt) + mainOf(tt);
  // line 10 on the slip: the size and left margin of 「オチでした」 (k 9.0 at x 70), one line pitch (200) below it
  const L5_X = 70, L5_Y = 330 + 200, L5_K = 9.0;
  // the reader's paper exit: its top edge in world y, placed so it stands at y 930 on screen at k171
  const EXIT_Y = 540 + (930 + MOVE_PX - 540) / Z_END, EXIT_W = 1120, EXIT_X = 960 - EXIT_W / 2;
  const TAIL_LEN = 1500;                                     // the lengthened slip, in slip pixels from SLIPC row 340

  // ---------- the camera ----------
  const CAM = createCamera(g, { W, H: 1080, bg: FIELD }), wg = CAM.wg;
  const camSpread = tt => [push(0, tt) + punchAt(tt), 960, 560, 0];
  const camKoku = tt => [push(1, tt) + punchAt(tt), 960, 540, 0];

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
  const viewsOf = (cam, a, b) => frameTimes(PT0, a, b).map(t => { const [z, fx, fy, sh] = cam(t); return { t, ...CAM.view(z, fx, fy, sh) }; });
  LAY.frameCheck('shot spread', { sheets: { math: onSheet('math'), mathb: onSheet('math'), mathn: onSheet('math'), 'math:pencil': onSheet('math'), 'math:print': onSheet('math'),
                                            sci: onSheet('sci'), scib: onSheet('sci'), scin: onSheet('sci'), 'sci:pencil': onSheet('sci'), 'sci:print': onSheet('sci') },
                                  views: viewsOf(camSpread, PT0, C2) });
  LAY.frameCheck('shot 国語', { sheets: { koku: onSheet('koku'), kokub: onSheet('koku'), kokun: onSheet('koku'), 'koku:pencil': onSheet('koku'), 'koku:print': onSheet('koku') },
                               views: viewsOf(camKoku, C2, C4) });
  // the tail: the three printed lines on the slip, checked from the first character of line 10 to the end of the segment,
  // with the camera as it moves (screen y = 540 + (y - 540) z - move, i.e. focus y = 540 + move / z)
  { const r1 = L4.slice(0, 9).map(([c]) => c).join(''), r2 = L4.slice(9).map(([c]) => c).join(''), r3 = L5.map(([c]) => c).join('');
    LAY.text('slip line 1', 'slip:print', dots16TextBox(r1, 70, 130, 7.0));
    LAY.text('slip line 2', 'slip:print', dots16TextBox(r2, 70, 330, 9.0));
    LAY.text('slip line 3 本日の宿題は', 'slip:print', dots16TextBox(r3, L5_X, L5_Y, L5_K));
    LAY.audit('tail slip');
    const toWorld = ([x, y]) => [FACE_SX + x * FACE_SS, FACE_SY - FEED_W + y * FACE_SS];
    const views = frameTimes(PT0, onsetFrameTime(L5[0][1]) + FILM_OFF - 1e-6, PT1).map(t => { const z = push(3, t); return { t, z, fx: 960, fy: 540 + moveOf(t) / z }; });
    LAY.frameCheck('tail 本日の宿題は', { sheets: { 'slip:print': toWorld }, views }); }
  // ---------- SLAM AUDIT (2026-11-21, 根因清单: 放大、过冲类效果按放大后的实际墨迹框逐帧登记检查) ----------
  // The four 不正解 land with print16ByCount's slam (x1.22 about the anchor stampSlam gives, back to 1 in three frames; the print head
  // sweeps it in left to right over the same three frames). The boxes above are the settled stamps only; here every frame of
  // every slam window registers the stamp's ink box as drawn on that frame (its label ground and ruled frame, scaled, clipped
  // by the sweep), together with its neighbours on the sheet (the choice wording, the bubble, the stamps already printed above,
  // the question, her pencil columns), for the overlap audit; and checks it against the frame edges with the camera as shown
  // on that frame, the shake's offset included (camera.js show(): rng(floor(tt * 1000) + 7)). Pure arithmetic: no canvas is
  // made here (the confirmed frames must stay bit for bit). Cross-checked against the ink measured on a canvas with the same
  // call: work/seg/06/slam/slam_probe.mjs (within 1 px).
  const SLAM = (() => {
    const { w, h, lw, x: cx } = STAMP;
    // the unscaled ink (ruled frame, clipped on the right by the sweep), scaled about the stamp's own anchor (stampSlam)
    const inkOf = (j, age) => {
      const { sc, ax, ay } = stampSlam(j, age), f = Math.min(1, (age / FR + 1) / 3), cy = KOKU.rowY(j);
      const ux0 = cx - (w / 2 + lw / 2), ux1 = cx + Math.min(-w / 2 - 8 + (w + 16) * f, w / 2 + lw / 2), uy0 = cy - (h / 2 + lw / 2), uy1 = cy + h / 2 + lw / 2;
      const x0 = ax + (ux0 - ax) * sc, x1 = ax + (ux1 - ax) * sc, y0 = ay + (uy0 - ay) * sc, y1 = ay + (uy1 - ay) * sc;
      return { sc, box: [x0, y0, x1 - x0, y1 - y0] };
    };
    const named = n => LAY.boxes.find(b => b.name === n && /^koku/.test(b.sheet)).box;
    const rows = [], views = {}, sheets = {};
    for (let gf = F0; gf < F1; gf++) {
      const tt = pageTime(gf / 30);
      S3.forEach((m, j) => {
        const age = tt - m.tv; if (age < 0 || age >= 3 * FR - 1e-9) return;
        const { sc, box } = inkOf(j, age), sheet = `koku@g${gf}`;
        LAY.text(`slam 不正解 ${j} (x${sc.toFixed(3)})`, sheet, box);
        for (let i = 0; i < 4; i++) {
          const y = KOKU.rowY(i);
          LAY.text(`choice ${i}`, sheet, named(`choice${i}`));
          LAY.text(`bubble ${i}`, sheet, [KOKU.BX - KOKU.RX - 2, y - KOKU.RY - 2, 2 * KOKU.RX + 4, 2 * KOKU.RY + 4]);
          if (i < j) LAY.text(`不正解 ${i} (printed)`, sheet, inkOf(i, 9).box);
        }
        for (const n of ['question 0', 'question 1', 'pencil L2', 'pencil L3']) LAY.text(n, sheet, named(n));
        // the camera on this frame, the shake's offset folded into the focus (screen = H/2 + d + (p - f) z)
        const [z0, fx0, fy0, sh] = camKoku(tt), v = CAM.view(z0, fx0, fy0, sh), r = camRng(Math.floor(tt * 1000) + 7);
        const dx = (r() - 0.5) * 2 * sh, dy = (r() - 0.5) * 2 * sh;
        const [, wy1] = toFrame('koku', [box[0] + box[2], box[1] + box[3]]), [, wy0] = toFrame('koku', [box[0], box[1]]);
        const sy0 = 540 + dy + (wy0 - v.fy) * v.z, sy1 = 540 + dy + (wy1 - v.fy) * v.z;
        sheets[sheet] = onSheet('koku'); views[sheet] = { t: tt, z: v.z, fx: v.fx - dx / v.z, fy: v.fy - dy / v.z };
        rows.push({ f: gf, stamp: j, scale: +sc.toFixed(3), ink: box.map(q => +q.toFixed(1)), screenY: [+sy0.toFixed(1), +sy1.toFixed(1)], marginBottom: +(1080 - sy1).toFixed(1) });
      });
    }
    const ov = LAY.audit('slam frames (不正解 ink as drawn on each hit frame, with its neighbours)');
    // the frame edges: one frame check per slam frame (only that frame's boxes are mapped)
    const cut = [];
    for (const sheet of Object.keys(sheets)) {
      const res = LAY.frameCheck(`slam ${sheet}`, { sheets: { [sheet]: sheets[sheet] }, views: [views[sheet]] });
      cut.push(...res.filter(q => q.problem && /^slam/.test(q.name)).map(q => `${sheet} ${q.name} cut ${q.px}px`));
    }
    console.warn(`SLAM AUDIT: ${rows.length} slam frames (${rows.map(q => `f${q.f}`).join(' ')}), ${ov.length} overlaps, ${cut.length} cut by the frame${cut.length ? ': ' + cut.join('; ') : ''} [${rows.map(q => `f${q.f} 不正解${q.stamp} x${q.scale} ink x ${q.ink[0]}-${(q.ink[0] + q.ink[2]).toFixed(1)} y ${q.ink[1]}-${(q.ink[1] + q.ink[3]).toFixed(1)} screen bottom ${q.screenY[1]} (margin ${q.marginBottom})`).join('; ')}]`);
    return { frames: rows, overlaps: ov, cut };
  })();
  // ---------- LYRIC AUDIT (lyrics.js): the first frame each sung character reads on, from the same gates the drawing uses
  // (pencil: print.js sungBuild on film time, whole = readable, the 55% frame before is not counted; the slip's 16-dot lines:
  // sungOn), inside the window its shot shows it ----------
  const LYR = (() => {
    const rows = [], shot = [[6, L1, PT0, C2, 'pen'], [7, L2, C2, C4, 'pen'], [8, L3, C2, C4, 'pen'], [9, L4, C4, PT1, 'dots'], [10, L5, T_FEED, PT1, 'dots']];
    for (const [line, L, a, b, kind] of shot) L.forEach(([c, t], j) => {
      let readT = null;
      for (let gf = F0; gf < F1 && readT === null; gf++) {
        const tt = pageTime(gf / 30); if (tt < a - 1e-9 || tt >= b - 1e-9) continue;
        if (kind === 'pen' ? sungBuild(gf / 30 - t) >= 1 : sungOn(tt, t)) readT = gf / 30;
      }
      rows.push({ c, t, readT, line, j, kind, onsetFrame: onsetFrame(t), readFrame: readT === null ? null : Math.round(readT * 30) });
    });
    const res = lyricAudit('seg_06', rows);
    const d = rows.filter(r => r.readT !== null).map(r => (r.readT - r.t) * 1000);
    res.readMinusOnsetMs = { mean: +(d.reduce((a, x) => a + x, 0) / d.length).toFixed(1), max: +Math.max(...d).toFixed(1), min: +Math.min(...d).toFixed(1) };
    res.rows = rows;
    return res;
  })();
  // ---------- MOTION AUDIT (camera.js, 制作约定 第六节「整屏运动」): the view as each frame shows it ----------
  const MOTION_R = (() => {
    const views = [];
    let prevShot = null;
    for (let gf = F0; gf < F1; gf++) {
      const tt = pageTime(gf / 30); let v, shot;
      if (tt < C2) { shot = 1; const [z, fx, fy] = camSpread(tt); v = CAM.view(z, fx, fy); }
      else if (tt < C4) { shot = 2; const [z, fx, fy, sh] = camKoku(tt); v = CAM.view(z, fx, fy, sh); }
      else if (tt < C4B) { shot = 3; v = { z: push(2, tt), fx: 960, fy: 540 - (1 - slipRise(tt)) * 160 }; }
      else if (tt < TD0) { shot = 4; v = { z: push(3, tt), fx: 960, fy: 540 }; }
      else { shot = 4; const z = push(3, tt); v = { z, fx: 960, fy: 540 + moveOf(tt) / z }; }
      views.push({ t: tt, ...v, cut: prevShot !== null && shot !== prevShot }); prevShot = shot;
    }
    return motionAudit('seg_06', views, { big: [[T_BIG, 'crash k152, ア: the first of the four 不正解'],
                                                [TM_BEAT, 'crash k168: the loudest of the segment, the end of the snare fill; the move down sets off']] });
  })();
  // ---------- PART AUDIT (parts.js): the hand is placed by its pencil point, measured on hpen3 itself ----------
  { const raw = await img('/art/cut/hpen3.png');
    axisAudit('seg_06', 'hpen3', 'pencil', { image: raw, axis: partOf(PA, 'hpen3', 'pencil').axis, halfWidth: 40 });
    partAudit('seg_06', 'hpen3', 'pencil point', { image: raw, points: [partOf(PA, 'hpen3', 'tip').point], on: PIX.dark, r: 3, maxOffPct: 0 }); }
  const PARTS_R = partReport('seg_06');
  publishAudit(S, LAY, { motion: MOTION_R, parts: PARTS_R, lyrics: LYR, timing: { note: 'page time = 50.05 + (g - 1501) / 30 for film frame g (v15 frame = g - 1501); audit times are page times', f0: F0, f1: F1, v15Frame0: V15_F, v15T0: V15_T0 }, slam: SLAM });

  // the page drawn at page time tt (v15's renderAt, with the tail added in the face shot)
  const drawAt = async t => {
    const tt = t;                                   // no lead: on the hit, on the syllable
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (tt < C2) {
      // ---- shot 1: the spread ----
      wg.fillStyle = FIELD; wg.fillRect(0, 0, W, 1080);
      for (const key of ['math', 'sci']) {
        const sh = SH(key), [c, s] = mk(S1W, S1H); s.drawImage(sh.c, 0, 0);
        PEN.line(s, key === 'math' ? pencilChars(L1.slice(0, 6), 6) : pencilChars(L1.slice(6), 6, 6), WORDS1, tt - FILM_OFF, 104);
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
      S3.forEach(m => drawStamp(s, m.ch, tt - m.tv));
      PEN.column(s, pencilChars(L2, 7), 1530, 300, 760, tt - FILM_OFF, 60);
      PEN.column(s, pencilChars(L3, 8), 1400, 300, 760, tt - FILM_OFF, 60);
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
      const shown = L4.filter(([, tc], j) => sungOn(tt, tc) && !hidden(9, j)), p1 = shown.slice(0, 9).map(([c]) => c).join(''), p2 = shown.slice(9).map(([c]) => c).join('');
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = FIELD; g.fillRect(0, 0, W, 1080);
      if (tt < C4B) {
        const rise = slipRise(tt), z = push(2, tt);
        g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540 + (1 - rise) * 160);
        g.fillStyle = FIELD_SHADOW_SLIP; g.fillRect(SLIP_X + 18, SLIP_Y + 22, SLIP_W, 1200);
        g.drawImage(SLIPC, SLIP_X, SLIP_Y);
        if (p1) dots16Text(g, p1, SLIP_X + 70, SLIP_Y + 470, 7.0, 12);
        g.restore();
      } else if (tt >= TD0) {
        drawTail(tt, p1, p2);
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

  // ---------- the tail, k167-k171 ----------
  let TAIL = null;
  function tailAssets() {
    // the lengthened slip: SLIPC from row 340 (what v15 shows) down to row 1300, where SLIPC's sprocket holes would begin
    // (they were never on screen in the confirmed frames), then more of the same plain paper with the same fibre density;
    // no holes anywhere, so the slip reads as one paper from its printed top to the exit
    const KEEP = 1300 - 340, [c, s] = mk(SLIP_W, TAIL_LEN);
    s.drawImage(SLIPC, 0, 340, SLIP_W, KEEP, 0, 0, SLIP_W, KEEP);
    s.fillStyle = PAPER_SLIP; s.fillRect(0, KEEP, SLIP_W, TAIL_LEN - KEEP);
    const r = rng(6), nf = Math.round(900 * (TAIL_LEN - KEEP) / 1380);
    for (let k = 0; k < nf; k++) { s.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); s.fillRect(r() * SLIP_W, KEEP + r() * (TAIL_LEN - KEEP), 2 + r() * 8, 1); }
    return { slip: c };
  }
  // the reader's paper exit (設定包 card_reader_cutaway ⑥; 06_A2.md 第 6 节: the housing's top and one exit slot), seen from
  // the front in the same cutaway print as the set drawing: the housing's top wall cut and hatched, open where the slip
  // comes up through it, inside a light dot screen; the slot's front lip lies across the slip at the wall, and the slip
  // goes down into the slot behind it. No print head here: the slip's lines are printed down inside the machine, out of
  // sight. Teal only; drawn in world units straight into the frame, so it stays sharp.
  const EX = (() => {
    const x0 = EXIT_X, x1 = EXIT_X + EXIT_W, y0 = EXIT_Y, y1 = EXIT_Y + 560, R = 46, WALL = 24;
    const sx0 = FACE_SX - 26, sx1 = FACE_SX + SLIP_W * FACE_SS + 26;          // the opening: a little wider than the slip
    const ly0 = y0 - 5, ly1 = y0 + WALL + 5, lx0 = sx0 - 16, lx1 = sx1 + 16;     // the slot's lip, over the opening
    return { x0, x1, y0, y1, R, WALL, sx0, sx1, ly0, ly1, lx0, lx1 };
  })();
  function exitPath(c, ax0, ay0, ax1, ay1, rr, fresh = true) {
    if (fresh) c.beginPath(); c.moveTo(ax0, ay1); c.lineTo(ax0, ay0 + rr); c.arcTo(ax0, ay0, ax0 + rr, ay0, rr);
    c.lineTo(ax1 - rr, ay0); c.arcTo(ax1, ay0, ax1, ay0 + rr, rr); c.lineTo(ax1, ay1); c.closePath();
  }
  // behind the slip: the housing, its cut wall and the inside
  function drawExitBack(c) {
    const { x0, x1, y0, y1, R, WALL, sx0, sx1 } = EX;
    c.save();
    exitPath(c, x0, y0, x1, y1, R); c.fillStyle = PAPER; c.fill();
    c.save(); exitPath(c, x0, y0, x1, y1, R); c.clip(); c.fillStyle = rgba(TEAL_RGB, 0.2);
    for (let yy = y0 + WALL + 7, i = 0; yy < y1; yy += 9, i++) for (let xx = x0 + (i % 2) * 4.5; xx < x1; xx += 9) { c.beginPath(); c.arc(xx, yy, 1.5, 0, 7); c.fill(); }
    c.restore();
    // the cut wall: hatched between the outer and the inner outline, except where the slip comes up through it
    c.save(); exitPath(c, x0, y0, x1, y1, R); exitPath(c, x0 + WALL, y0 + WALL, x1 - WALL, y1 + 10, R - WALL * 0.6, false); c.clip('evenodd');
    c.beginPath(); c.rect(x0 - 10, y0 - 10, sx0 - x0 + 10, y1 - y0 + 20); c.rect(sx1, y0 - 10, x1 - sx1 + 10, y1 - y0 + 20); c.clip();
    c.fillStyle = PAPER; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.strokeStyle = TEAL; c.lineWidth = 3; c.beginPath();
    for (let k = -700; k < EXIT_W + 700; k += 13) { c.moveTo(x0 + k, y1); c.lineTo(x0 + k + (y1 - y0), y0); }
    c.stroke(); c.restore();
    // outlines: the outer one broken by the opening, the inner one, and the two cut ends of the wall at the opening
    c.strokeStyle = TEAL; c.lineCap = 'butt';
    c.save(); c.beginPath(); c.rect(x0 - 10, y0 - 10, sx0 - x0 + 10, y1 - y0 + 20); c.rect(sx1, y0 - 10, x1 - sx1 + 10, y1 - y0 + 20); c.clip();
    c.lineWidth = 6; exitPath(c, x0, y0, x1, y1, R); c.stroke(); c.restore();
    c.save(); c.beginPath(); c.rect(x0 - 10, y0 + WALL - 4, x1 - x0 + 20, y1 - y0); c.rect(x0 - 10, y0 - 10, sx0 - x0 + 10, WALL + 10); c.rect(sx1, y0 - 10, x1 - sx1 + 10, WALL + 10); c.clip();
    c.lineWidth = 3; exitPath(c, x0 + WALL, y0 + WALL, x1 - WALL, y1 + 10, R - WALL * 0.6); c.stroke(); c.restore();
    c.lineWidth = 4; c.beginPath(); c.moveTo(sx0, y0 - 1); c.lineTo(sx0, y0 + WALL + 1); c.moveTo(sx1, y0 - 1); c.lineTo(sx1, y0 + WALL + 1); c.stroke();
    // the opening itself is a dark gap in the wall (the slip, drawn after this, covers its middle)
    c.fillStyle = rgba(TEAL_RGB, 0.6); c.fillRect(sx0 + 2, y0, sx1 - sx0 - 4, WALL);
    c.restore();
  }
  // in front of the slip: the exit slot's lip, a plain rolled edge across the opening at the wall, in the set drawing's line
  // print (paper filled, teal outline, one thin line where the roll turns under); the slip goes into the slot behind it
  function drawExitLip(c) {
    const { ly0, ly1, lx0, lx1 } = EX, h = ly1 - ly0;
    c.save();
    c.beginPath(); c.roundRect(lx0, ly0, lx1 - lx0, h, h / 2); c.fillStyle = PAPER; c.fill();
    c.strokeStyle = TEAL; c.lineWidth = 4; c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(lx0 + h / 2, ly0 + h * 0.62); c.lineTo(lx1 - h / 2, ly0 + h * 0.62); c.stroke();
    c.restore();
  }
  // the face shot from k167: the face push (to k168) under the camera's move down; the slip fed up, printing line 10
  function drawTail(tt, p1, p2) {
    TAIL ||= tailAssets();
    const F = IMG[S.at('face', tt).file];
    const fs = 0.7, fw = F.width * fs, fh = F.height * fs, z = push(3, tt), D = moveOf(tt), sy = FACE_SY - feedOf(tt);
    const p3 = L5.filter(([, tc], j) => sungOn(tt, tc) && !hidden(10, j)).map(([c]) => c).join('');
    const exitIn = 540 + (EX.y0 - 540) * z - D < 1080 + 40;                    // the move brings the exit in from about k170
    g.save(); g.translate(0, -D); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
    g.drawImage(F, 960 - fw / 2, 64, fw, fh);
    if (exitIn) drawExitBack(g);
    const yEnd = EX.y0 + EX.WALL / 2;                                            // the slip comes up out of the slot, behind the lip
    g.fillStyle = FIELD_SHADOW_SLIP; g.fillRect(FACE_SX + 14, sy + 16, SLIP_W * FACE_SS, EX.y0 - (sy + 16));      // on the field, down to the exit
    g.save(); g.beginPath(); g.rect(FACE_SX - 40, sy - 40, SLIP_W * FACE_SS + 80, yEnd - (sy - 40)); g.clip();
    g.translate(FACE_SX, sy); g.scale(FACE_SS, FACE_SS); g.drawImage(TAIL.slip, 0, 0);
    if (p1) dots16Text(g, p1, 70, 130, 7.0, 12);
    if (p2) dots16Text(g, p2, 70, 330, 9.0, 13);
    if (p3) dots16Text(g, p3, L5_X, L5_Y, L5_K, 14);   // a light print: no slam, nothing shakes
    g.restore();
    if (exitIn) drawExitLip(g);
    g.restore();
  }

  await drawAt(P('t0', 50.05));
  window.renderAt = async t => drawAt(pageTime(t));
}
