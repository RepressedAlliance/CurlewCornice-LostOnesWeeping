// Segment 13 C (docs/分镜/13_C.md 第 3 稿, design 乙 picked in the blind review of the two samples), k423-k455,
// global frames [4710, 5065). The sample page (k436-k455, both designs) is in archive/seg13_sample_20261120/; the full cut
// before this round is in archive/seg13_round_g_20261121/.
//   S1 the desk, her own view down at it, one continuous shot k423-k447: the city is dark (the negative of the paper language);
//      k423.5 the lamp clicks fully on in one frame; k426.5 her hand slaps a small, old, yellowed folded square onto question
//      2's answer box right under the printed line and presses it hard (the questions print as sung; the camera holds a tight
//      frame on the square, her hand and cuff); k434.5 she pinches the square's free edge and flicks: the flap snaps down
//      (the guitar drawing); k437.5 she pulls the last fold out flat and the camera pushes in to 2.6x; the machine's big
//      eraser comes in alone (no hand, straight, one strip per beat, ends out of the frame) and rubs four strips to dirty
//      graphite with white letters left in them; only her drawing is left. k443 it lifts, tilts and comes to hang right over
//      the guitar in the drawing while the camera pulls out to 0.82x: it is held by a hand - her slim hand, her blazer cuff,
//      her card on its teal lanyard on the desk beside it. It hangs over the guitar (shadow far apart), comes down almost onto
//      it (k445, the shadow closes), pulls back up (k445.5, the shadow opens), then rubs the guitar out with its tip itself
//      (k446, k446.5): the smear stays inside the drawing, the girl in the drawing is left holding nothing.
//   S2 k447 the street drain under a street lamp, straight down, at night: the negative is real (dark outside the light, paper
//      white inside); the children's rubbed essays drift along the kerb, catch on the grating and are dragged into its slots
//      one per beat (hers first); 「おい誰なんだよ」 rubbed white out of the dark asphalt.
//   S3 k451 her face across the desk, the lamp on our right (her left, as on the desk), its light on our right side of her face,
//      its spill on the wall from the top of its shade; k452 she looks up at us.
// Review (2026-11-21) MUST taken in: 1 the hesitation and the rub happen over the drawing, the hand never jumps (one place,
// shadow only), the smear stays in the drawing; 2 the face is redrawn lit from the lamp's side (r13h), the wall patch comes
// out of the lamp's shade; 3 the opening frame is tight on the square and her pressing hand with its cuff (h13h_slap), the
// square is old yellowed paper with worn corners, folded layers and pencil showing through; 4 the essay is a six-year-old's
// pencil handwriting (p13h_essay, the canon text); 5 the pull-out frame leaves room above the letters and the essay's top.
// Review round i (2026-11-21) MUST taken in: 1 the S3 lamp has ONE shade with ONE opening (tilted up to the left); the wall
// light is a beam out of that opening with crisp edges (no light out of the shade's back, no big soft grey patch), its lower
// edge level with the opening so it still lights her face from our right; 2 the page header is frame-checked (16 px margin)
// and both held desk framings are set so it sits whole inside the frame (CAM0 1.24x, CAM_OUT 0.74x); 3 the hesitation and
// the rub re-staged: lifting is big (10 % nearer, shadow thrown clear beside the eraser), down at k445 with the shadow
// closing, a flinch back of 100 world px along the axis, down for real at k445.5 and rubbing from the neck down the guitar
// towards her, so the graphite shows beside and ahead of the tip and darkens stroke by stroke (k447 unchanged).
// Everything timed comes from web/lib/ (score.js beats, events and the drawings' timeline; lyrics.js by line number; type.js
// layout and frame audit; camera.js moves; print.js 16-dot print, pencil words, white letters; palette.js colours; her_card.js
// her card). The negative, the essay and the graphite are this segment's own drawing (web/scenes/segments/13/desk13.js).
import { BEAT, FRAME as FR, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics, lyricAudit, onsetFrame } from '../../lib/lyrics.js';
import { createLayout, measure } from '../../lib/type.js';
import { move, pushes, camLerp, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, axisOf, along, axisAudit, partAudit, samplesAlong, pixelsOf, PIX, partReport } from '../../lib/parts.js';
import { print16, pencilWriter, whiteLetter, dots16Text, sungBuild } from '../../lib/print.js';
import { CARD_RATIO } from '../../lib/card.js';
import { herCardFace, herCardBoxes } from '../../lib/her_card.js';
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, GRAPHITE, INK_RGB, HAND_SHADOW, PENCIL, GRAPHITE_DARK_RGB, FIBRE_RGB, rgba, rgb } from '../../lib/palette.js';
import { mk, mix, negPass, DESK_RGB, OLD_RGB, WALL_RGB, EW, EH, cellX, cellY, essayColumns, drawEssay, rubStrip, crumb, pencilize, guitarBox, GUITAR_CROP } from './13/desk13.js';

export default async function seg13(H) {
  const { g, rng, img, rinPalImage } = H;
  const F0 = 4710, F1 = 5065, SEG = [F0 / 30, F1 / 30];
  const K = beatV;
  const S = createScore('seg_13', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const LY = await loadLyrics();
  const L46 = LY.lineAt(46, '面積比の公式言えますか'), L47 = LY.lineAt(47, '子供の時の夢は言えますか');
  const L48 = LY.lineAt(48, 'その夢すら溝に捨てたのは'), L49 = LY.lineAt(49, 'おい誰なんだよもう知ってんだろ');
  const PEN = pencilWriter();
  const clamp01 = f => Math.min(1, Math.max(0, f));
  const lerp = (a, b, u) => a + (b - a) * u, lerp2 = (A, B, u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];
  const C_HALF = 'C 段实测切分重击';
  // (2026-11-21 rhythm pass, user: 「这是一首摇滚乐 ……希望视频跟歌曲节奏一致」) the picture answers the music's hits, still
  // between them. (2026-11-21 third pass, user: 「你为什么要一直抖动屏幕？……看着很晕」, 制作约定第六节「整屏运动」) the frame
  // itself no longer answers any hit here: no desk steps, no street dips, no face steps. 13 is the quietest section: the hits
  // are answered inside the picture (the slap and the presses, the folds, the eraser on each strip, each paper snatched into
  // the grating, her look up); the camera only makes the one eased push in (k437.5-k441), the one registered whip out to her
  // hand (k443, 10 frames) and an even 4 % drift on her face (MOTION AUDIT below).
  // age is counted from the hit's frame (the first frame at or after the beat time, where qc_sheets puts the event and
  // where the measured onsets in this segment fall)
  const hitFrame = t => Math.ceil(t * 30 - 1e-6) / 30;
  // her hand's press (in the picture, not the frame): frame 0 at 65 %, frame 1 full, back over the next five frames with a rebound of 15 %, then still
  const dipU = age => { if (age < 0) return 0; const n = age / FR; if (n < 1) return 0.65; if (n < 2) return 1;
    if (n < 6) return Math.cos((n - 2) / 4 * Math.PI / 2) * 1.15 - 0.15; if (n < 8) return -0.15 * (1 - (n - 6) / 2); return 0; };

  // ---------- drawings (Codex, art/cut/; one master per camera: h13g_slap for the desk hand, r13h_face for the face) ----------
  // the desk hands: set g (art/design/prompts/_make_seg13g.py) with the pressing hand of round h (_make_seg13h.py, h13g_slap
  // redrawn, only the pressure); the face: round h (r13f_face redrawn, only the light turned to the lamp's side)
  const KEY = { slap: 'h13h_slap', open: 'h13g_open', erase: 'h13g_erase', hover: 'h13g_hover' };
  const DRAW = { slap: `/art/cut/${KEY.slap}.png`, open: `/art/cut/${KEY.open}.png`, erase: `/art/cut/${KEY.erase}.png`, hover: `/art/cut/${KEY.hover}.png`,
                 face: '/art/cut/r13h_face.png', up: '/art/cut/r13h_face_up.png' };
  const IMG = {}; for (const f of Object.values(DRAW)) IMG[f] = rinPalImage(await img(f));
  // (third pass, 根因清单「笔芯和笔不对了……」) every part drawn on a drawing is measured on THAT drawing (web/lib/parts.js,
  // art/cut/seg13_parts.json written by work/seg/13/parts/measure13.py): no anchor is shared between drawings, no fallback
  const PRT = await loadPartAnchors('/art/cut/seg13_parts.json');
  const FING = { [DRAW.face]: await img('/art/cut/r13h_face_fingers.png'), [DRAW.up]: await img('/art/cut/r13h_face_up_fingers.png') };
  const GUITAR = await img('/art/cut/p13f_guitar.png'), KIDS = await img('/art/cut/p13_kids.png');
  const HANDWRITING = await img('/art/cut/p13h_essay_hand.png');
  const CANON = await img('/art/canon/machine_big_eraser.png');

  // ---------- the desk (S1), world px = 40 px/cm ----------
  const EX = 580, EY = 222;                                    // the essay's top-left when it lies flat
  const wx = lx => EX + lx, wy = ly => EY + ly;
  const LIGHT1 = { x: 890, y: 680, rx: 690, ry: 770, soft: 300 };   // the lamp's light on the desk (world)
  const ER_L = 680, ER_W = 140;                                // the big eraser: 17 x 3.5 cm (the canon's 966:188 within 6%)
  // the canon eraser (art/canon/machine_big_eraser.png); its two rubber ends are dull with graphite (13_C.md 第 6 节, and the end
  // her fingers hold in the hand drawings is drawn that way): a graphite wash over the ends, the sleeve left clean
  const ER_SLV = [160 / 966, 808 / 966];                       // the sleeve's borders along the canon drawing
  const ERC = (() => { const [c, x] = mk(966, 188); x.drawImage(CANON, 56, 206, 966, 188, 0, 0, 966, 188);
    const R = rng(1717); x.save(); x.globalCompositeOperation = 'source-atop';
    for (const [a, b] of [[0, ER_SLV[0] * 966 - 4], [ER_SLV[1] * 966 + 4, 966]]) {
      x.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.34); x.fillRect(a, 0, b - a, 188);
      for (let k = 0; k < 900; k++) { x.fillStyle = rgba(R() < 0.5 ? GRAPHITE_DARK_RGB : PAPER_RGB, 0.08 + R() * 0.2); x.fillRect(a + R() * (b - a), R() * 188, 1 + R() * 3, 1 + R() * 2); } }
    x.restore(); return c; })();
  // the hands: one scale for the whole shot, set by the eraser's width in the drawing (= the canon eraser's width)
  // The eraser in her hand: Codex drew the whole eraser in h13g_erase / h13g_hover; cut13f.py cut it off above its sleeve border
  // and the page continues the drawn rubber end she holds with the canon eraser. Its axis [held end, border] is the drawn
  // eraser's own centreline (measured from both edges of its free part in the uncut drawing), so the canon eraser leaves the
  // border along it (the old hand-read sleeve axis of h13g_erase was 0.90 deg and 5 px off the drawn centreline, 13 px on
  // screen at 2.6x). Both drawings measure the drawn eraser 168 px wide: one hand scale for the shot.
  const ERX = { erase: partOf(PRT, KEY.erase, 'eraser'), hover: partOf(PRT, KEY.hover, 'eraser') };
  if (Math.abs(ERX.erase.wid - ERX.hover.wid) > 2) console.warn(`PART AUDIT seg_13: eraser widths differ (${ERX.erase.wid} / ${ERX.hover.wid})`);
  const HS = ER_W / ERX.erase.wid;
  const HAND = {
    slap: { f: DRAW.slap, key: KEY.slap, end: partOf(PRT, KEY.slap, 'palm').point, a: null },
    open: { f: DRAW.open, key: KEY.open, end: partOf(PRT, KEY.open, 'pinch').point, a: null },
  };
  for (const k of ['erase', 'hover']) { const ax = axisOf(ERX[k].axis); HAND[k] = { f: DRAW[k], key: KEY[k], end: ax.tip, ax, a: ax.angle + Math.PI }; }   // a: towards the held end
  // a hand pose -> its placement (drawing px -> world): the drawing and its eraser both go through it, once
  const placeOf = P => placement({ x: P.at[0], y: P.at[1], s: P.sc, rot: P.rot, origin: P.h.end });
  const SIL = {}; for (const h of Object.values(HAND)) { const im = IMG[h.f], [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = HAND_SHADOW; x.fillRect(0, 0, c.width, c.height); SIL[h.f] = c; }

  const T_LAMP = S.ev(`the lamp clicks fully on (${C_HALF})`, K(423.5), 'half');
  const T_SLAP = S.ev(`her hand slaps the folded essay down (${C_HALF})`, K(426.5), 'half');
  const T_OPEN1 = S.ev(`a flick: the first fold snaps open (${C_HALF})`, K(434.5), 'half');
  const T_OPEN2 = S.ev(`the last fold snaps flat (${C_HALF})`, K(437.5), 'half');
  const T_FLAT = T_OPEN2 + 3 * FR;
  // the two low hits between the slap and the flick (k429.5 and k432, measured in the accompaniment stem: low band +14 and +6 dB,
  // as strong as k426.5) had nothing on them for eight beats; her hand presses the square down again on each
  const T_PRESS = [S.ev(`her hand presses the square down again (${C_HALF})`, K(429.5), 'half'), S.ev('her hand presses the square down again', K(432))];
  // (third pass) the desk camera holds still from the slap to the flick: the slap and the two presses are the hand's (in the
  // picture), not the frame's

  const HEAD_TXT = '問題集　算数・せいかつ';
  const [DESK, ds] = mk(2800, 2100); const DO = [-400, -300];  // the desk canvas covers world (-400..2400, -300..1800)
  function bagPocketPaper(ctx) { ctx.fillStyle = rgb(OLD_RGB); ctx.strokeStyle = TEAL; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(1750, 548); ctx.lineTo(1860, 520); ctx.lineTo(1880, 600); ctx.lineTo(1772, 640); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  { ds.translate(-DO[0], -DO[1]); const R = rng(4);
    ds.fillStyle = rgb(DESK_RGB); ds.fillRect(DO[0], DO[1], 2800, 2100);
    for (let k = 0; k < 9900; k++) { ds.fillStyle = rgba(INK_RGB, 0.02 + R() * 0.04); ds.fillRect(DO[0] + R() * 2800, DO[1] + R() * 2100, 1 + R() * 3, 1 + R() * 3); }
    // the desk's front edge (towards her), low in the world
    ds.strokeStyle = TEAL; ds.lineWidth = 4; ds.beginPath(); ds.moveTo(DO[0], 1520); ds.lineTo(2400, 1520); ds.stroke();
    // the lamp's round base (upper left) and its arm going up out of the frame
    ds.fillStyle = PAPER; ds.strokeStyle = TEAL; ds.lineWidth = 4;
    ds.beginPath(); ds.arc(210, 170, 124, 0, 7); ds.fill(); ds.stroke(); ds.lineWidth = 2; ds.beginPath(); ds.arc(210, 170, 96, 0, 7); ds.stroke();
    for (let k = 0; k < 360; k += 9) { ds.fillStyle = rgba(TEAL_RGB, 0.5); ds.beginPath(); ds.arc(210 + Math.cos(k / 57.3) * 110, 170 + Math.sin(k / 57.3) * 110, 3, 0, 7); ds.fill(); }
    ds.lineWidth = 4; ds.fillStyle = PAPER; ds.beginPath(); ds.moveTo(190, 150); ds.lineTo(80, -320); ds.lineTo(124, -320); ds.lineTo(232, 150); ds.closePath(); ds.fill(); ds.stroke();
    ds.beginPath(); ds.arc(211, 160, 22, 0, 7); ds.fillStyle = PAPER; ds.fill(); ds.stroke();
    // the soft gig bag at the right edge, its front pocket unzipped
    ds.save(); ds.beginPath(); ds.roundRect(1660, 60, 520, 980, 150); ds.fillStyle = PAPER; ds.fill(); ds.clip();
    for (let y = 40; y < 1060; y += 16) for (let x = 1640 + ((y / 16) % 2) * 8; x < 2200; x += 16) { const d = 1.2 + 2.6 * Math.max(0, (x - 1660) / 520); ds.fillStyle = rgba(TEAL_RGB, 0.55); ds.beginPath(); ds.arc(x, y, d, 0, 7); ds.fill(); }
    ds.restore(); ds.strokeStyle = TEAL; ds.lineWidth = 5; ds.beginPath(); ds.roundRect(1660, 60, 520, 980, 150); ds.stroke();
    ds.fillStyle = PAPER; ds.beginPath(); ds.roundRect(1712, 520, 420, 330, 60); ds.fill(); ds.lineWidth = 4; ds.stroke();
    ds.fillStyle = rgba(INK_RGB, 0.5); ds.beginPath(); ds.moveTo(1744, 538); ds.quadraticCurveTo(1920, 506, 2118, 544); ds.lineTo(2118, 552); ds.quadraticCurveTo(1920, 516, 1744, 548); ds.closePath(); ds.fill();
    ds.setLineDash([10, 7]); ds.lineWidth = 3; ds.beginPath(); ds.moveTo(1740, 536); ds.quadraticCurveTo(1920, 500, 2120, 540); ds.stroke(); ds.setLineDash([]);
    ds.fillStyle = TEAL; ds.fillRect(1734, 528, 14, 30);
    // the problem book's page, and the second question's empty answer box (the essay lies in it)
    ds.fillStyle = PAPER; ds.fillRect(540, -140, 890, 1500); ds.fillStyle = rgba(INK_RGB, 0.12); ds.fillRect(1430, -140, 8, 1500);
    ds.strokeStyle = TEAL; ds.lineWidth = 3; ds.strokeRect(568, 196, 834, 872);
    ds.fillStyle = TEAL; ds.font = '700 26px ZenKakuB'; ds.textBaseline = 'middle'; ds.fillText(HEAD_TXT, 600, 30); ds.fillRect(568, 50, 834, 3); }
  LAY.reg('answer box', 's1page', [568, 196, 834, 872]);
  // the page's header (MUST 2 of round i: it was cut by the top of the frame at 1.3x and only grazed it at 0.76x, because
  // the frame check never knew it was there): registered as text, checked with a margin in every held framing
  LAY.text('header', 's1page:head', [600, 15, Math.ceil(measure(HEAD_TXT, '700 #px ZenKakuB', 26)), 30]);
  // the questions, printed as sung (16-dot): Q1 (no figure, no answer box: she ignores it), Q2 over the box
  const QK = 3.0, QADV = 16 * QK, QX = 596;
  const Q1 = [['１', -1], ['　', -1], ...L46], Q2 = [['２', -1], ['　', -1], ...L47];
  const QY = [96, 152];
  [Q1, Q2].forEach((Ln, j) => LAY.text(`Q${j + 1}`, 's1page:print', [QX, QY[j] - QADV * 0.45, QADV * Ln.length, QADV * 0.9]));
  // sung print, but whole or nothing: print16's sung curve sweeps 55 % of the glyph in on the frame before the onset, and a
  // left half reads as another kana (は's left half read 「に」 on g4839), so the character shows whole from its onset's frame
  function printQ(ctx, tt) { [Q1, Q2].forEach((Ln, j) => Ln.forEach(([c, t], i) => { if (c !== '　' && (t < 0 || sungBuild(tt - t) >= 1)) print16(ctx, c, QX + QADV * (i + 0.5), QY[j], QK, t < 0 ? 1 : tt - t, 70 + j * 20 + i, { sung: t >= 0 }); })); }

  // her card on the desk at the lower left, left of where her arm comes in; its teal lanyard runs out of the bottom of the frame
  // to her neck. The face is the film's one card (docs/卡面状态.md, web/lib/her_card.js; 03 k40 on, so the full state: the
  // band of 読み取れません inside the name field, ロストワン in the 16-dot head and の号哭 in her pencil right of the label
  // column, the grid under them pressed). No face coordinates of this segment's own.
  // The lanyard goes through the card's holder slot (卡面状态 第四节): its two strands come out of the slot under the card and
  // a loop of the strap crosses the bridge between the slot and the top edge on top of the card.
  const CARD_U = 1000, CARD = herCardFace(CARD_U, { state: 'title' }), CW = 330, CH = CW / CARD_RATIO, CXY = [598, 1122], CROT = 0.05;
  const SLOT = { x: 0.4, y: 0.022, w: 0.2, h: 0.028 };         // card.js slot(), in u
  function drawCardOnDesk(ctx) {
    const cx = CXY[0] + CW / 2, top = CXY[1], sy = top + CW * (SLOT.y + SLOT.h / 2);
    ctx.save(); ctx.strokeStyle = TEAL; ctx.lineWidth = 7; ctx.lineCap = 'round';
    for (const o of [-8, 8]) { ctx.beginPath(); ctx.moveTo(cx + 5 + o * 0.6, sy); ctx.bezierCurveTo(cx - 40 + o, top - 46, cx - CW / 2 - 70 + o, top + 10, cx - CW / 2 - 56 + o, top + 200); ctx.bezierCurveTo(cx - CW / 2 - 46 + o, top + 330, cx - CW / 2 - 70 + o, top + 420, cx - CW / 2 - 60 + o, top + 600); ctx.stroke(); }
    ctx.translate(cx, top + CH / 2); ctx.rotate(CROT);
    ctx.fillStyle = rgba(INK_RGB, 0.25); ctx.filter = 'blur(4px)'; ctx.fillRect(-CW / 2 + 6, -CH / 2 + 8, CW, CH); ctx.filter = 'none';
    ctx.drawImage(CARD, -CW / 2, -CH / 2, CW, CH);
    // the strap's loop over the bridge above the slot (top edge to the slot's middle), with a fine dark edge so it reads small
    const lw = CW * 0.075, ly0 = -CH / 2 - CW * 0.012, ly1 = -CH / 2 + CW * (SLOT.y + SLOT.h * 0.6);
    ctx.fillStyle = TEAL; ctx.strokeStyle = rgba(INK_RGB, 0.45); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(-lw / 2, ly0, lw, ly1 - ly0, CW * 0.012); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  LAY.reg('card', 's1desk', [CXY[0], CXY[1], CW, CH]);

  // ---------- the essay: folded in four (back out), half open, flat ----------
  // The square lies on the essay's top-left quarter, right under question 2: the right half is folded behind, the bottom half
  // folded up over the top; its outside is the yellowed back of the bottom-left quarter. Its bottom and right edges are the
  // folds, its top and left edges the open edges of four layers. k434.5 she pinches the free (top) edge and the flap snaps
  // down over its hinge (the square's bottom edge): the left half; k437.5 she pulls the right half out from behind: flat.
  const ES = drawEssay({ guitar: GUITAR, rng, hand: HANDWRITING });
  { const { bad } = essayColumns(); if (bad.length) console.warn(`ESSAY 行頭禁則: columns ${bad.join(', ')} start with a forbidden character`); }
  const HW = EW / 2, HH = EH / 2;                              // quarter 400 x 410
  const OLDER = mix(OLD_RGB, FIBRE_RGB, 0.16);                 // years in a gig bag's pocket
  const BACK = (() => {                                        // the outside of the square, at 3x
    const RSb = 3, [c, x] = mk(HW * RSb, HH * RSb); x.scale(RSb, RSb); const R = rng(4321);
    // a worn outline: the open corner (top left) rounded most, the fold-fold corner (bottom right) least
    const shape = ctx => { ctx.beginPath(); ctx.roundRect(0, 0, HW, HH, [18, 9, 5, 9]); };
    x.save(); shape(x); x.clip();
    x.fillStyle = rgb(OLDER); x.fillRect(0, 0, HW, HH);
    for (let k = 0; k < 1400; k++) { x.fillStyle = rgba(FIBRE_RGB, 0.03 + R() * 0.06); x.fillRect(R() * HW, R() * HH, 1 + R() * 6, 0.6); }
    // the pencil on the other side shows through, mirrored top to bottom (the quarter was turned over its bottom edge)
    x.save(); x.globalAlpha = 0.2; x.filter = 'blur(1.2px)'; x.translate(0, HH); x.scale(1, -1);
    x.drawImage(ES.canvas, 0, HH * 3, HW * 3, HH * 3, 0, 0, HW, HH); x.restore();
    // edges darkened by handling, a grey thumb smudge where it was always taken out, two soft wrinkles
    for (const [x0, y0, x1, y1, w] of [[0, 0, 0, HH, 34], [0, 0, HW, 0, 34], [HW, 0, HW, HH, 16], [0, HH, HW, HH, 16]]) {
      const gr = x.createLinearGradient(x0 === x1 ? x0 : 0, y0 === y1 ? y0 : 0, x0 === x1 ? (x0 ? x0 - w : w) : 0, y0 === y1 ? (y0 ? y0 - w : w) : 0);
      gr.addColorStop(0, rgba(FIBRE_RGB, 0.34)); gr.addColorStop(1, rgba(FIBRE_RGB, 0)); x.fillStyle = gr; x.fillRect(0, 0, HW, HH); }
    const sm = x.createRadialGradient(HW * 0.82, HH * 0.84, 4, HW * 0.82, HH * 0.84, 70); sm.addColorStop(0, rgba(INK_RGB, 0.09)); sm.addColorStop(1, rgba(INK_RGB, 0));
    x.fillStyle = sm; x.fillRect(0, 0, HW, HH);
    for (const [a, b, c2, d] of [[30, 120, 260, 40], [120, 380, 380, 250]]) { for (const [o, col, al] of [[0, INK_RGB, 0.07], [2, PAPER_RGB, 0.35]]) { x.strokeStyle = rgba(col, al); x.lineWidth = 2; x.beginPath(); x.moveTo(a + o, b + o); x.quadraticCurveTo((a + c2) / 2 + 20, (b + d) / 2 - 14, c2 + o, d + o); x.stroke(); } }
    x.restore();
    // the outline: the two folds crisp, the two open edges a little frayed
    x.strokeStyle = rgba(INK_RGB, 0.22); x.lineWidth = 2; shape(x); x.stroke();
    x.strokeStyle = rgba(PAPER_RGB, 0.6); x.lineWidth = 1.4; x.beginPath(); x.moveTo(HW - 2, 10); x.lineTo(HW - 2, HH - 6); x.moveTo(10, HH - 2); x.lineTo(HW - 6, HH - 2); x.stroke();
    return c; })();
  // the four layers' open edges, a little out of line, under the outside (top and left)
  function layerEdges(ctx, x, y) {
    for (const [dx, dy, a] of [[-5, -4, 0.9], [-3, -7, 0.85], [-8, -2, 0.8]]) { ctx.fillStyle = rgb(mix(OLDER, INK_RGB, 0.04 + a * 0.02)); ctx.beginPath(); ctx.roundRect(x + dx, y + dy, HW - dx * 0.4, HH - dy * 0.4, [16, 8, 4, 8]); ctx.fill();
      ctx.strokeStyle = rgba(INK_RGB, 0.18); ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  const quarter = (ctx, qx, qy, dx, dy, w, h) => ctx.drawImage(ES.canvas, qx * 3, qy * 3, HW * 3, HH * 3, dx, dy, w, h);
  const SQ0 = [wx(0), wy(0)];                                  // the folded square's top-left (world) when it lies in place
  const HINGE = wy(HH);                                        // the flap's hinge: the square's bottom edge
  const SLIDE = [560, 470];                                    // the hand brings it in from the lower right
  function shadowRect(ctx, x, y, w, h, off, a, blur) { ctx.save(); ctx.fillStyle = rgba(INK_RGB, a); ctx.filter = `blur(${blur}px)`; ctx.fillRect(x + off, y + off * 1.3, w, h); ctx.restore(); }
  function slideOff(tt) { if (tt >= T_SLAP) return [0, 0]; const u = ease((tt - (T_SLAP - 3 * FR)) / (3 * FR)); return [SLIDE[0] * (1 - u), SLIDE[1] * (1 - u)]; }
  const bounce = (tt, t0) => (tt >= t0 && tt < t0 + 2 * FR) ? -2 : 0;
  const flapU = tt => clamp01((tt - T_OPEN1) / (3 * FR));
  function drawEssayAt(ctx, tt) {
    if (tt < T_SLAP - 3 * FR) return;
    if (tt < T_OPEN1) {                                        // the folded square
      const [ox, oy] = slideOff(tt), b = bounce(tt, T_SLAP), land = tt >= T_SLAP;
      const x = SQ0[0] + ox, y = SQ0[1] + oy + b;
      shadowRect(ctx, x, y, HW, HH, land && tt >= T_SLAP + FR ? 4 : 10, land ? 0.32 : 0.22, land && tt >= T_SLAP + FR ? 3 : 8);
      layerEdges(ctx, x, y);
      ctx.drawImage(BACK, x, y, HW, HH);
      return;
    }
    if (tt < T_OPEN2) {                                        // the flap snaps down over its hinge
      const u = flapU(tt), b = u >= 1 ? bounce(tt, T_OPEN1 + 3 * FR) : 0;
      shadowRect(ctx, wx(0), wy(0), HW, u < 1 ? HH : EH, 5, 0.26, 4);
      quarter(ctx, 0, 0, wx(0), wy(0), HW, HH);                // the top-left quarter, face up under the flap
      ctx.fillStyle = rgba(INK_RGB, 0.12); ctx.fillRect(wx(HW) - 5, wy(0), 5, u < 1 ? HH : EH);   // the right half folded behind
      if (u < 0.5) {                                           // the flap rising: its outside, foreshortened above the hinge
        const h = HH * Math.cos(Math.PI * u);
        shadowRect(ctx, wx(0), HINGE - h, HW, h, 8 + 30 * u, 0.2, 6);
        ctx.drawImage(BACK, wx(0), HINGE - h, HW, h); ctx.fillStyle = rgba(INK_RGB, 0.3 * 2 * u); ctx.fillRect(wx(0), HINGE - h, HW, h);
      } else if (u < 1) {                                      // the flap coming down: its inside, the bottom-left quarter
        const h = -HH * Math.cos(Math.PI * u);
        shadowRect(ctx, wx(0), HINGE, HW, h, 8 + 30 * (1 - u), 0.2, 6);
        quarter(ctx, 0, HH, wx(0), HINGE, HW, h); ctx.fillStyle = rgba(INK_RGB, 0.3 * 2 * (1 - u)); ctx.fillRect(wx(0), HINGE, HW, h);
      } else quarter(ctx, 0, HH, wx(0), HINGE + b, HW, HH);
      return;
    }
    const u = clamp01((tt - T_OPEN2) / (3 * FR)), by = (tt >= T_FLAT && tt < T_FLAT + 2 * FR) ? -2 : 0;
    ctx.save(); ctx.fillStyle = rgba(INK_RGB, 0.24); ctx.filter = 'blur(5px)';
    if (u < 1) { ctx.fillRect(EX + 7, EY + 9, HW, EH); ctx.fillStyle = rgba(INK_RGB, 0.2); ctx.fillRect(EX + HW + 16, EY + 20, HW * ease(u), EH); }
    else ctx.fillRect(EX + 5 + (tt < T_FLAT + FR ? 4 : 0), EY + 7, EW, EH);
    ctx.restore();
    ctx.drawImage(ES.left, EX, EY + (u >= 1 ? by : 0), HW, EH);
    if (u < 1) { const w = HW * ease(u); ctx.drawImage(ES.right, EX + HW, EY, w, EH); ctx.fillStyle = rgba(INK_RGB, 0.28 * (1 - u)); ctx.fillRect(EX + HW, EY, w, EH); }
    else ctx.drawImage(ES.right, EX + HW, EY + by, HW, EH);
  }
  const paperClip = ctx => { ctx.beginPath(); ctx.roundRect(EX, EY, EW, EH, 12); ctx.clip(); };

  // ---------- the strips the eraser rubs (four pairs of columns, right to left) and the letters left in them ----------
  const AMP = 40, YS = 632;                                    // each trip +-1 cm; the strips' centre line: rows 1-12 covered
  const STRIP_COLS = [[1, 2], [3, 4], [5, 6], [7, 8]];
  const XS = STRIP_COLS.map(([a, b]) => wx((cellX(a) + cellX(b)) / 2));
  const { cols: ECOLS } = essayColumns();
  const ghostsOf = (pair, cy, h) => ECOLS.filter(k => pair.includes(k.col)).flatMap(k => [...k.text].map((ch, i) => ({ ch, x: ER_W / 2 + (cellX(k.col) - (cellX(pair[0]) + cellX(pair[1])) / 2), y: (EY + cellY(k.row0 + i)) - (cy - h / 2), size: 46 })).filter(gg => gg.ch !== '　'));
  const SL = ER_L + 2 * AMP;
  const STRIPS = XS.map((x, i) => ({ x, y: YS, tex: rubStrip({ w: ER_W, h: SL, rng, seed: 500 + i, ghosts: ghostsOf(STRIP_COLS[i], YS, SL) }),
    crumbs: (() => { const R = rng(600 + i), out = []; for (let k = 0; k < 16; k++) { const side = R() < 0.5 ? -1 : 1; out.push([x + side * (ER_W / 2 + 4 + R() * 12), Math.max(EY + 30, YS - SL / 2 + 60) + R() * (Math.min(EY + EH - 30, YS + SL / 2 - 60) - Math.max(EY + 30, YS - SL / 2 + 60)), 2 + R() * 2.2, R() * 3]); } return out; })() }));
  const LSZ = 64, LSTEP = 1.06, LTOP = 378;
  const CHUNK = [L48.slice(0, 3), L48.slice(3, 5), L48.slice(5, 7), L48.slice(7)];
  const LETTERS = CHUNK.map((ch, i) => ({ i, chars: ch, x: XS[i] }));
  LETTERS.forEach(L => LAY.text(`strip ${L.i + 1} letters`, 's1letters', [L.x - LSZ * 0.6, LTOP, LSZ * 1.2, L.chars.length * LSZ * LSTEP]));
  // (2026-11-21, user: 「我们的歌词好像比曲子慢了一点」) the eraser covers the strip it is rubbing, so a strip's letters only
  // read once it has stepped off: it used to land on strip 1 on k439, four frames before そ, and keep その夢 and すら under
  // its body 0.3 s and 0.15 s past their onsets. Now it comes in one beat earlier (k438, during the push) and steps off each
  // strip before that strip's first letter is sung: strip 1 off k439 (そ k439.33), strip 2 off k440 (す k440.9), strip 3 off
  // k441 (溝 k442.7); it stays on strip 4 two beats (k441-k443) with a second hard press on k442 and lifts on k443 (捨 k443.5).
  const T_IN = S.ev('the eraser lands on strip 1 (during the push)', K(438));
  const STEP_T = [T_IN, K(439), K(440), K(441)];
  STEP_T.slice(1).forEach((t, i) => S.ev(`the eraser steps to strip ${i + 2}`, t));
  const T_REPRESS = S.ev('the eraser presses strip 4 again', K(442));
  const T_OFF = K(443);
  function drawStrips(ctx, tt) {
    ctx.save(); paperClip(ctx);
    STEP_T.forEach((t0, i) => { if (tt < t0 + (i ? 3 * FR : 0)) return; const s = STRIPS[i]; ctx.drawImage(s.tex, s.x - ER_W / 2, s.y - SL / 2, ER_W, SL); });
    ctx.restore();
    STEP_T.forEach((t0, i) => { const t1 = STEP_T[i + 1] ?? T_OFF; if (tt < t1) return; for (const [x, y, r, a] of STRIPS[i].crumbs) crumb(ctx, x, y, r, a); });
    for (const L of LETTERS) L.chars.forEach(([c, t], k) => whiteLetter(ctx, c, L.x, LTOP + LSZ * LSTEP * (k + 0.5), LSZ, tt - t, 'rubbed'));
  }

  // ---------- the eraser and the hand ----------
  const dirOf = a => [Math.cos(a), Math.sin(a)];
  // (round i, MUST 3) lifting is what tells the hesitation, so it has to read at 0.74x and on a phone: a lifted eraser and
  // hand are nearer her eye (10 % bigger at full lift) and their shadow falls well clear of them (about 50 px on screen),
  // crisp enough to see; touching, the shadow closes right under them. The size only changes with the lift, never because
  // of where the hand is (根因清单: one hand, one size in a shot).
  const LIFT_SC = 0.10;
  // the shade hangs over the upper middle of the page (its arm comes over from the base at the upper left; the pool on the
  // desk is centred below it), so a shadow falls straight away from that point: beside the eraser, on its lower-left side,
  // out on the paper where it can be seen - not slid along under its own body
  const BULB = [820, 420];
  const shOff = (x, y, lift) => { const dx = x - BULB[0], dy = y - BULB[1], n = Math.hypot(dx, dy) || 1, k = 7 + 80 * lift; return [dx / n * k, dy / n * k]; };
  function drawEraser(ctx, E, shadowOnly) {
    if (!E) return;
    const sc = 1 + LIFT_SC * E.lift;
    if (shadowOnly) {
      const [dx, dy] = shOff(E.cx - Math.cos(E.ang) * ER_L / 4, E.cy - Math.sin(E.ang) * ER_L / 4, E.lift);
      ctx.save(); ctx.translate(E.cx + dx, E.cy + dy); ctx.rotate(E.ang); ctx.fillStyle = rgba(INK_RGB, 0.5); ctx.filter = `blur(${2 + 2 * E.lift}px)`;
      ctx.beginPath(); ctx.roundRect(-ER_L / 2, -ER_W / 2, ER_L, ER_W, ER_W / 2); ctx.fill(); ctx.restore(); return;
    }
    // through the placement of the hand drawing that holds it, in that drawing's px: from its border along its measured axis
    const PH = handOnEraser(E), P = placeOf(PH), ax = PH.h.ax, d = (ER_SLV[1] - 0.5) * ER_L / HS, L = ER_L / HS, Wd = ER_W / HS;
    drawPart(ctx, P, c => { const m = along(ax, d); c.translate(m[0], m[1]); c.rotate(ax.angle + Math.PI); c.imageSmoothingQuality = 'high'; c.drawImage(ERC, -L / 2, -Wd / 2, L, Wd); });
  }
  function handOnEraser(E) {
    if (!E || !E.hand) return null;
    // the hand drawing is anchored at its eraser's sleeve border (the part above it was cut away), on the canon's border
    const h = HAND[E.hand], [ux, uy] = dirOf(E.ang), sc = 1 + LIFT_SC * E.lift, bd = (ER_SLV[1] - 0.5) * ER_L * sc;
    return { h, at: [E.cx + ux * bd, E.cy + uy * bd], rot: E.ang - h.a, sc: HS * sc, lift: E.lift };
  }
  function drawHand(ctx, P, shadow) {
    if (!P) return; const im = shadow ? SIL[P.h.f] : IMG[P.h.f];
    ctx.save();
    if (shadow) { const [dx, dy] = shOff(P.at[0], P.at[1], P.lift), n = Math.hypot(dx, dy) || 1; ctx.translate(dx * (1 + 8 / n), dy * (1 + 8 / n)); ctx.filter = `blur(${3 + 3 * P.lift}px)`; }
    drawImageAt(ctx, placeOf(P), im); ctx.restore();
  }
  // the reading head (k439-k443), then her hand (k443-k447): the eraser tilts to 34 degrees (axis from its tip down to her hand)
  // and from then on it works in ONE place over the guitar in the drawing, along its own axis - her hand never moves across
  // the frame. (round i, MUST 3) The hesitation and the rub are re-staged so they read at full speed and on a phone:
  //   k443      it lifts off strip 4 (big: the shadow jumps clear) and comes to hang high over the guitar's neck;
  //   k444.5    the pull-out stops; it goes down, slowly, the shadow closing in under it;
  //   k445      almost touching (the shadow right under it) - a frame - and it flinches back up and away along its own axis
  //             (100 world px = 74 px on screen, the shadow jumping clear again);
  //   k445.5    it comes down for real, onto the neck, and rubs: short strokes along its axis, working down the guitar towards
  //             her (her pulling it towards herself), so what it has rubbed is always just ahead of its tip, in the open:
  //             graphite spreads out beside it and gets darker with every stroke; the neck goes first, then the body;
  //   k447 - 3f it comes up and away: the girl in the drawing holds nothing.
  const V = Math.PI / 2, A_T = 0.6, U = dirOf(A_T), VP = [-U[1], U[0]];   // 34 degrees: her arm comes up from the lower right, the cuff in the frame
  const tipToC = tip => [tip[0] + U[0] * ER_L / 2, tip[1] + U[1] * ER_L / 2];
  const GB = guitarBox(), GBW = [wx(GB[0]), wy(GB[1]), GB[2], GB[3]];      // the drawing on the desk (world)
  // the guitar in the drawing (mirrored crop of p13f_guitar): its body at about (0.67, 0.59) of the drawing, its neck running
  // up to the upper left at about the eraser's own angle, the head about 170 world px from the body
  const GUIT = [GBW[0] + 0.67 * GBW[2], GBW[1] + 0.59 * GBW[3]];
  const OFFG = -12;                                             // the rub runs a touch below the neck line: her face in the drawing stays clean
  const TIP_A = [GUIT[0] - U[0] * 132 + VP[0] * -OFFG, GUIT[1] - U[1] * 132 + VP[1] * -OFFG];  // where it hangs, nearly touches and starts: the neck below the head
  const TIP_B = [GUIT[0] + U[0] * 18 + VP[0] * -OFFG, GUIT[1] + U[1] * 18 + VP[1] * -OFFG];    // where the rubbing ends: past the body
  const C_A = tipToC(TIP_A), RETRACT = 100, C_R = [C_A[0] + U[0] * RETRACT, C_A[1] + U[1] * RETRACT];
  const T_TILT = K(443), T_PULL1 = K(444.5), T_DOWN = K(445), T_COMMIT = K(445.5), T_RUB = [K(446), K(446.5)];
  const T_S2 = K(447), T_S3 = K(451), T_UP = K(452);
  const T_ARRIVE = T_TILT + 9 * FR;                            // hanging high over the neck from here, while the camera settles
  const T_FLINCH = T_DOWN + 1 * FR, T_FLINCHED = T_DOWN + 4 * FR;
  const T_CONTACT = T_COMMIT + 2 * FR;
  const T_LIFTOFF = T_S2 - 3 * FR;
  const STROKE = { amp: 26, per: BEAT / 2, lat: 6 };
  function eraserAt(t) {
    if (t < T_IN - 3 * FR || t >= T_S2) return null;
    if (t < T_IN) { const u = ease((t - (T_IN - 3 * FR)) / (3 * FR)); return { cx: 1720 + (XS[0] - 1720) * u, cy: YS, ang: V, lift: 0.25 * (1 - u), hand: 'erase' }; }
    for (let i = 0; i < 4; i++) {
      const a = STEP_T[i], b = STEP_T[i + 1] ?? T_OFF;
      if (t >= a && t < b) {
        const st = i === 0 ? 1 : clamp01((t - a) / (3 * FR)), x = i === 0 ? XS[0] : XS[i - 1] + (XS[i] - XS[i - 1]) * ease(st);
        const r0 = a + 3 * FR, ph = clamp01((t - r0) / (b - r0)), trips = 2 * (b - a) / BEAT;
        // strip 4: up off the paper over the three frames before k442 and down hard on it (the press lands on the beat)
        const rp = i === 3 && t >= T_REPRESS - 3 * FR && t < T_REPRESS ? 0.45 * ease((t - (T_REPRESS - 3 * FR)) / (3 * FR)) : 0;
        return { cx: x, cy: YS + (t >= r0 ? -AMP * Math.sin(2 * Math.PI * trips * ph) : 0), ang: V, lift: (i === 0 ? 0 : 0.3 * Math.sin(Math.PI * st)) + rp, hand: 'erase' };
      }
    }
    if (t < T_PULL1) {                                         // up off strip 4, over to the neck, tilting; then hanging high
      const u = smooth((t - T_TILT) / (T_ARRIVE - T_TILT));
      return { cx: lerp(XS[3], C_A[0], u), cy: lerp(YS, C_A[1], u), ang: V + (A_T - V) * u, lift: ease(clamp01((t - T_TILT) / (3 * FR))), hand: 'erase' };
    }
    if (t < T_DOWN) { const u = smooth((t - T_PULL1) / (T_DOWN - T_PULL1)); return { cx: C_A[0], cy: C_A[1], ang: A_T, lift: 1 - 0.96 * u, hand: 'erase' }; }
    if (t < T_FLINCH) return { cx: C_A[0], cy: C_A[1], ang: A_T, lift: 0.04, hand: 'hover' };
    if (t < T_COMMIT) {                                        // the flinch: back along its own axis and up, then a beat of doubt
      const u = ease(clamp01((t - T_FLINCH) / (T_FLINCHED - T_FLINCH))), c = lerp2(C_A, C_R, u);
      return { cx: c[0], cy: c[1], ang: A_T, lift: 0.04 + 0.66 * u, hand: 'hover' };
    }
    if (t < T_CONTACT) {                                       // down for real, accelerating
      const u = clamp01((t - T_COMMIT) / (T_CONTACT - T_COMMIT)), w = u * u, c = lerp2(C_R, C_A, w);
      return { cx: c[0], cy: c[1], ang: A_T, lift: 0.7 * (1 - w), hand: 'hover' };
    }
    // rubbing: strokes along the axis plus a little sideways, working from the neck down to the body (towards her)
    const tau = t - T_CONTACT, p = clamp01((Math.min(t, T_LIFTOFF) - T_CONTACT) / (T_LIFTOFF - T_CONTACT));
    const base = lerp2(TIP_A, TIP_B, smooth(p)), s = -STROKE.amp * Math.sin(2 * Math.PI * tau / STROKE.per), l = STROKE.lat * Math.sin(2 * Math.PI * tau / (STROKE.per * 1.6));
    let tip = [base[0] + U[0] * s + VP[0] * l, base[1] + U[1] * s + VP[1] * l], lift = 0;
    if (t >= T_LIFTOFF) {                                      // up and away towards her
      const v = ease((t - T_LIFTOFF) / (3 * FR)), tl = T_LIFTOFF - T_CONTACT;
      const s0 = -STROKE.amp * Math.sin(2 * Math.PI * tl / STROKE.per), l0 = STROKE.lat * Math.sin(2 * Math.PI * tl / (STROKE.per * 1.6));
      tip = [TIP_B[0] + U[0] * (s0 + 220 * v) + VP[0] * l0, TIP_B[1] + U[1] * (s0 + 220 * v) + VP[1] * l0]; lift = 0.8 * v;
    }
    const c = tipToC(tip);
    return { cx: c[0], cy: c[1], ang: A_T, lift, hand: 'hover' };
  }
  // the smear the tip leaves on the drawing: every footprint of the rubbing end while it touches (lift < 0.12), accumulated
  // up to tt - a little wider than the eraser (rubbing pushes graphite out to the sides), each touch adding a little, so it
  // darkens stroke by stroke - kept inside the drawing (never over the white letters of strip 4 to its right); the child's
  // pencil is dragged into it along the rub
  const FOOT = 78, FOOT_W = ER_W + 6;                         // the rubbing end's footprint: depth along the axis, width across
  const SM_BOX = [GBW[0] - 4, GBW[1], Math.min(GBW[2] + 4, XS[3] - ER_W / 2 - 8 - (GBW[0] - 4)), GBW[3]];
  const SMEAR_TEX = rubStrip({ w: FOOT_W + 40, h: 420, rng, seed: 777, ghosts: [] });
  const SMEAR_MID = [(TIP_A[0] + TIP_B[0]) / 2 + U[0] * FOOT / 2, (TIP_A[1] + TIP_B[1]) / 2 + U[1] * FOOT / 2];
  const GPEN = pencilize(GUITAR, GUITAR_CROP, GB[2] * 2, GB[3] * 2, true);
  const [SMC, smc] = mk(SM_BOX[2] * 2, SM_BOX[3] * 2), [MKC, mkc] = mk(SM_BOX[2] * 2, SM_BOX[3] * 2);
  let smearT = -1;
  function smearAt(tt) {                                       // the smear layer (SM_BOX at 2x) as it is at tt
    const t1 = Math.min(tt, T_S2);
    if (t1 === smearT) return SMC; smearT = t1;
    smc.setTransform(1, 0, 0, 1, 0, 0); smc.clearRect(0, 0, SMC.width, SMC.height);
    mkc.setTransform(1, 0, 0, 1, 0, 0); mkc.clearRect(0, 0, MKC.width, MKC.height);
    if (t1 < T_COMMIT) return SMC;
    mkc.setTransform(2, 0, 0, 2, -SM_BOX[0] * 2, -SM_BOX[1] * 2); mkc.fillStyle = 'rgba(0,0,0,0.085)'; mkc.filter = 'blur(2px)';
    let any = false;
    for (let t = T_COMMIT; t <= t1 + 1e-6; t += FR / 4) {         // each touch adds graphite: rubbed over more often, darker
      const E = eraserAt(t); if (!E || E.lift > 0.12) continue; any = true;
      const tip = [E.cx - U[0] * ER_L / 2, E.cy - U[1] * ER_L / 2];
      mkc.save(); mkc.translate(tip[0], tip[1]); mkc.rotate(A_T); mkc.beginPath(); mkc.roundRect(-6, -FOOT_W / 2, FOOT, FOOT_W, FOOT_W / 2.4); mkc.fill(); mkc.restore();
    }
    mkc.filter = 'none';
    if (!any) return SMC;
    // the right side fades out before the strip (never a straight cut edge)
    mkc.setTransform(1, 0, 0, 1, 0, 0); mkc.globalCompositeOperation = 'destination-in';
    const fe = mkc.createLinearGradient(SMC.width - 70, 0, SMC.width - 4, 0); fe.addColorStop(0, '#000'); fe.addColorStop(1, 'rgba(0,0,0,0)');
    mkc.fillStyle = fe; mkc.fillRect(0, 0, MKC.width, MKC.height); mkc.globalCompositeOperation = 'source-over';
    smc.setTransform(2, 0, 0, 2, -SM_BOX[0] * 2, -SM_BOX[1] * 2);
    smc.save(); smc.translate(SMEAR_MID[0], SMEAR_MID[1]); smc.rotate(A_T - Math.PI / 2); smc.drawImage(SMEAR_TEX, -(FOOT_W + 40) / 2, -210, FOOT_W + 40, 420); smc.restore();
    smc.save(); smc.globalAlpha = 0.55; for (const d of [-30, -16, 16, 30]) smc.drawImage(GPEN, GBW[0] + U[0] * d, GBW[1] + U[1] * d, GBW[2], GBW[3]); smc.restore();
    smc.setTransform(1, 0, 0, 1, 0, 0); smc.globalCompositeOperation = 'destination-in';
    smc.drawImage(MKC, 0, 0);
    smc.globalCompositeOperation = 'source-over';
    return SMC;
  }
  // graphite crumbs pushed out at the sides of the rubbing end, one per half stroke, left on the paper
  const RUB_CRUMBS = (() => { const R = rng(4471), out = [], n = 14; for (let k = 0; k < n; k++) {
    const t = T_CONTACT + (k + 0.5) / n * (T_LIFTOFF - T_CONTACT), E = eraserAt(t), tip = [E.cx - U[0] * ER_L / 2, E.cy - U[1] * ER_L / 2], side = k % 2 ? 1 : -1, along = 10 + R() * 60, off = FOOT_W / 2 + 4 + R() * 14;
    out.push({ t, x: tip[0] + U[0] * along + VP[0] * side * off, y: tip[1] + U[1] * along + VP[1] * side * off, r: 2 + R() * 2.4, a: R() * 3 }); } return out; })();
  function drawSmear(ctx, tt) {
    if (tt < T_COMMIT) return; ctx.save(); ctx.beginPath(); ctx.rect(...SM_BOX); ctx.clip(); ctx.drawImage(smearAt(tt), SM_BOX[0], SM_BOX[1], SM_BOX[2], SM_BOX[3]);
    for (const c of RUB_CRUMBS) if (tt >= c.t) crumb(ctx, c.x, c.y, c.r, c.a);
    ctx.restore();
  }
  // her hand on the paper before the eraser: slapping the square (h13h_slap), then pinching the flap (h13g_open); both turned
  // so the arm comes in from the lower right (her right hand), the cuff in the frame
  const HROT = -0.3;
  const SLAP_AT = [SQ0[0] + HW * 0.66, SQ0[1] + HH * 0.8];       // the palm low on the square: the fingertips stay under question 2
  const PINCH_X = wx(HW - 46);                                  // the free edge's right end: after the flick her hand rests right of the drawing
  function paperHand(tt) {
    if (tt < T_SLAP - 3 * FR || tt >= T_TILT) return null;
    if (tt < T_OPEN1) {                                        // the slap; on k429.5 and k432 the palm presses down again
      const [ox, oy] = slideOff(tt), pr = T_PRESS.reduce((a, t0) => a + dipU(tt - hitFrame(t0)), 0);
      return { h: HAND.slap, at: [SLAP_AT[0] + ox, SLAP_AT[1] + oy + bounce(tt, T_SLAP) + 4 * pr], rot: HROT, sc: HS * (1 - 0.022 * pr), lift: tt < T_SLAP ? 0.35 : 0 };
    }
    if (tt < T_OPEN2) {                                        // pinching the free edge: up with it to the hinge, then it lets go
      const u = flapU(tt), ue = Math.min(u, 0.5), y = HINGE - HH * Math.cos(Math.PI * ue);
      const rest = clamp01((tt - (T_OPEN1 + 1.5 * FR)) / (3 * FR));
      return { h: HAND.open, at: [PINCH_X, y + 14 * ease(rest)], rot: HROT, sc: HS, lift: u < 0.5 ? Math.sin(Math.PI * ue) * 0.8 : 0.8 * (1 - ease(rest)) };
    }
    const u = clamp01((tt - T_OPEN2) / (3 * FR));               // pulling the right half out by its free edge
    // then she lets go and takes her hand back out of the lower right (3 frames), before the eraser comes in on k438
    if (tt >= T_FLAT) { const v = ease((tt - T_FLAT) / (3 * FR)); if (v >= 0.999) return null;
      return { h: HAND.open, at: [wx(HW) + HW - 6 + 760 * v, HINGE + 14 + 560 * v], rot: HROT, sc: HS, lift: 0.5 * v }; }
    return { h: HAND.open, at: [wx(HW) + HW * ease(u) - 6, HINGE + 14], rot: HROT, sc: HS, lift: 0.3 * Math.sin(Math.PI * u) };
  }

  // ---------- the camera on the desk ----------
  // CAM0: tight on question 2, the square and her hand (MUST 3); CAM_IN: the strips; CAM_OUT: the drawing, the eraser over it,
  // her hand with its cuff, her card, with room above the essay's top and the letters (MUST 5)
  // (round i, MUST 2) both held framings are set by the header at the top and her cuff at the bottom: the header sits whole
  // inside the frame with a margin (>= 16 px, frame-checked), the cuff stays where it was (bottom of CAM0 about world 863,
  // of CAM_OUT about 1446)
  const CAM0 = [1.24, 840, 428], CAM_IN = [2.6, 985, 560], CAM_OUT = [0.74, 1020, 716];
  // (third pass, 整屏运动) the push in is ONE eased move over 4 beats (k437.5-k441.5, a cosine ease: its largest corner
  // acceleration 3.1 px/frame^2 stays under the jolt line; it used to be an ease-out over 1.5 beats that started at full speed:
  // a 7 % and a 21 % jolt); the eraser rubbing a strip on each beat is the rhythm under it. The pull-out to her hand is the
  // segment's one whip (registered, starts on k443, done in 10 frames), still from then to the cut.
  const T_PUSHED = K(441.5), T_PULLED = T_TILT + 10 * FR;
  const sine01 = f => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(f));
  S.mark('push into the essay start', T_OPEN2, 'half'); S.mark('push into the essay end', T_PUSHED, 'half');
  S.ev('whip out to her hand, her sleeve, her card (done in 10 frames)', T_TILT);
  function cam1(tt) {
    if (tt < T_OPEN2) return CAM0;
    if (tt < T_PUSHED) return camLerp(CAM0[0], [CAM0[1], CAM0[2]], CAM_IN[0], [CAM_IN[1], CAM_IN[2]], sine01((tt - T_OPEN2) / (T_PUSHED - T_OPEN2)), [CAM_IN[1], CAM_IN[2]]);
    if (tt < T_TILT) return CAM_IN;
    if (tt < T_PULLED) return camLerp(CAM_IN[0], [CAM_IN[1], CAM_IN[2]], CAM_OUT[0], [CAM_OUT[1], CAM_OUT[2]], smooth((tt - T_TILT) / (T_PULLED - T_TILT)), [GUIT[0], GUIT[1]]);
    return CAM_OUT;
  }

  const [NB, nbs] = mk(1920, 1080, true);
  const setCam = (ctx, [z, fx, fy]) => ctx.setTransform(z, 0, 0, z, 960 - fx * z, 540 - fy * z);
  const toScreen = ([z, fx, fy], L) => ({ x: (L.x - fx) * z + 960, y: (L.y - fy) * z + 540, rx: (L.rx ?? L.r) * z, ry: (L.ry ?? L.r) * z, soft: L.soft * z });

  function drawS1(tt) {
    const C = cam1(tt), E = eraserAt(tt), PH = paperHand(tt), PE = handOnEraser(E);
    nbs.setTransform(1, 0, 0, 1, 0, 0); nbs.fillStyle = rgb(DESK_RGB); nbs.fillRect(0, 0, 1920, 1080);
    setCam(nbs, C); nbs.imageSmoothingQuality = 'high';
    nbs.drawImage(DESK, DO[0], DO[1]);
    if (tt < T_SLAP - 3 * FR) bagPocketPaper(nbs);               // the essay is still in the gig bag's pocket
    printQ(nbs, tt);
    drawCardOnDesk(nbs);
    drawEssayAt(nbs, tt);
    if (tt >= T_FLAT) { drawStrips(nbs, tt); drawSmear(nbs, tt); }
    if (PH) drawHand(nbs, PH, true);
    if (PE) drawHand(nbs, PE, true);
    drawEraser(nbs, E, true); drawEraser(nbs, E, false);
    negPass(g, NB, nbs, tt >= T_LAMP ? [toScreen(C, LIGHT1)] : []);
    setCam(g, C);
    if (PH) drawHand(g, PH, false);
    if (PE) drawHand(g, PE, false);
    g.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ---------- S2: the street drain under a street lamp (k447-k451), straight down, night ----------
  // Drawn as lit paper language (pavement, kerb, asphalt as light grounds with ink texture), so outside the street lamp's
  // circle the negative turns it dark with light grit; the grating is set into the asphalt against the kerb.
  const GR = { x: 600, y: 258, w: 560, h: 372 }, GX = GR.x + GR.w / 2, GY = GR.y + GR.h / 2;
  const LIGHT2 = { x: 960, y: 470, rx: 530, ry: 450, soft: 160 };
  const ASPH = mix(PAPER_RGB, INK_RGB, 0.07), WALK = mix(PAPER_RGB, INK_RGB, 0.03);
  const [ROAD, rs] = mk(1920, 1080);
  { const R = rng(21); rs.fillStyle = rgb(ASPH); rs.fillRect(0, 0, 1920, 1080);
    for (let k = 0; k < 42000; k++) { rs.fillStyle = rgba(INK_RGB, 0.10 + R() * 0.32); const s = 1 + R() * 2.6; rs.fillRect(R() * 1920, R() * 1080, s, s * (0.6 + R() * 0.6)); }
    // the pavement (top) with its slabs, then the kerb stone
    rs.fillStyle = rgb(WALK); rs.fillRect(0, 0, 1920, 182);
    for (let k = 0; k < 5000; k++) { rs.fillStyle = rgba(INK_RGB, 0.05 + R() * 0.1); rs.fillRect(R() * 1920, R() * 182, 2, 2); }
    rs.strokeStyle = rgba(INK_RGB, 0.3); rs.lineWidth = 2; for (let x = 260; x < 1980; x += 720) { rs.beginPath(); rs.moveTo(x, 0); rs.lineTo(x, 182); rs.stroke(); }
    rs.fillStyle = rgb(mix(PAPER_RGB, INK_RGB, 0.02)); rs.fillRect(0, 182, 1920, 66);
    for (let x = 140; x < 1920; x += 420) { rs.strokeStyle = rgba(INK_RGB, 0.45); rs.lineWidth = 2; rs.beginPath(); rs.moveTo(x, 182); rs.lineTo(x, 248); rs.stroke(); }
    rs.strokeStyle = GRAPHITE; rs.lineWidth = 4; rs.beginPath(); rs.moveTo(0, 182); rs.lineTo(1920, 182); rs.moveTo(0, 248); rs.lineTo(1920, 248); rs.stroke();
    // the wet strip along the kerb (darker, smoother)
    const wg = rs.createLinearGradient(0, 248, 0, 660); wg.addColorStop(0, rgba(INK_RGB, 0.16)); wg.addColorStop(1, rgba(INK_RGB, 0)); rs.fillStyle = wg; rs.fillRect(0, 248, 1920, 412);
    // the grating's frame and its dark pit
    rs.fillStyle = rgb(GRAPHITE_DARK_RGB); rs.fillRect(GR.x, GR.y, GR.w, GR.h);
    rs.fillStyle = rgb(mix(PAPER_RGB, INK_RGB, 0.25)); rs.fillRect(GR.x - 18, GR.y - 10, GR.w + 36, 10); rs.fillRect(GR.x - 18, GR.y + GR.h, GR.w + 36, 18); rs.fillRect(GR.x - 18, GR.y, 18, GR.h); rs.fillRect(GR.x + GR.w, GR.y, 18, GR.h);
    rs.strokeStyle = GRAPHITE; rs.lineWidth = 3; rs.strokeRect(GR.x - 18, GR.y - 10, GR.w + 36, GR.h + 28); rs.strokeRect(GR.x, GR.y, GR.w, GR.h); }
  function bars(ctx) { ctx.fillStyle = rgb(mix(PAPER_RGB, INK_RGB, 0.18)); ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 2;
    for (let x = GR.x + 10; x < GR.x + GR.w - 10; x += 34) { ctx.fillRect(x, GR.y, 16, GR.h); ctx.strokeRect(x, GR.y, 16, GR.h); }
    for (const yy of [GR.y + GR.h * 0.33, GR.y + GR.h * 0.66]) { ctx.fillRect(GR.x, yy - 6, GR.w, 12); ctx.strokeRect(GR.x, yy - 6, GR.w, 12); } }
  // the water: thin streaks along the kerb, moving left
  const VW = 360 / BEAT;
  const STREAKS = (() => { const R = rng(31), out = []; for (let k = 0; k < 60; k++) out.push([R() * 2600, 258 + R() * 380, 40 + R() * 170, 1.2 + R() * 2]); return out; })();
  function water(ctx, tt) { ctx.strokeStyle = rgba(INK_RGB, 0.5); ctx.lineCap = 'round';
    for (const [x0, y, l, w] of STREAKS) { if (x0 % 7 < 1 && y > GR.y && y < GR.y + GR.h) continue; const x = ((x0 - VW * (tt - T_S2)) % 2600 + 2600) % 2600 - 300; if (x > GR.x - l && x < GR.x + GR.w && y > GR.y && y < GR.y + GR.h) continue; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y); ctx.stroke(); } }
  // the papers: hers as it was left, then other children's, each rubbed black but for one small drawing
  const KID_CROPS = [[77, 46, 626, 431], [907, 158, 520, 236], [208, 583, 377, 380], [991, 545, 335, 436]];   // airplane, bread, ball, tulip
  const PW = 360, PHh = 280;
  function kidPaper(i) {
    const w = PW, h = PHh, [c, x] = mk(w * 2, h * 2); x.scale(2, 2);
    x.fillStyle = rgb(mix(OLD_RGB, PAPER_RGB, 0.5 - i * 0.1)); x.fillRect(0, 0, w, h);
    x.strokeStyle = rgba(TEAL_RGB, 0.9); x.lineWidth = 1; const cs = 26;
    for (let k = 0; k <= 12; k++) { x.beginPath(); x.moveTo(24 + k * cs, 18); x.lineTo(24 + k * cs, 18 + 9 * cs); x.stroke(); }
    for (let k = 0; k <= 9; k++) { x.beginPath(); x.moveTo(24, 18 + k * cs); x.lineTo(24 + 12 * cs, 18 + k * cs); x.stroke(); }
    const n = 3 + (i % 2);
    for (let s = 0; s < n; s++) { const t = rubStrip({ w: cs * 2, h: h + 120, rng, seed: 900 + i * 10 + s }); x.save(); x.beginPath(); x.rect(0, 0, w, h); x.clip(); x.drawImage(t, 24 + (12 - 2 * (s + 1)) * cs, -60 + (s % 2) * 14, cs * 2, h + 120); x.restore(); }
    const [sx, sy, sw, sh] = KID_CROPS[i], box = 150, k = Math.min(box / sw, box / sh), dw = sw * k, dh = sh * k;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(pencilize(KIDS, KID_CROPS[i], dw * 2, dh * 2), (24 + 2.9 * cs - dw / 2) * 2, (18 + 4.5 * cs - dh / 2) * 2);
    return { c, w, h };
  }
  function herPaper() {   // the essay as she left it: four strips with the white letters, the guitar rubbed out
    const s = 0.4, w = EW * s, h = EH * s, [c, x] = mk(w * 2, h * 2); x.scale(2 * s, 2 * s); x.translate(-EX, -EY);
    x.drawImage(ES.canvas, EX, EY, EW, EH);
    x.save(); paperClip(x); STRIPS.forEach(st => x.drawImage(st.tex, st.x - ER_W / 2, st.y - SL / 2, ER_W, SL)); x.restore();
    drawSmear(x, T_S2);
    CHUNK.forEach((ch, i) => ch.forEach(([cc], k) => whiteLetter(x, cc, XS[i], LTOP + LSZ * LSTEP * (k + 0.5), LSZ, 10, 'rubbed')));
    return { c, w, h };
  }
  const PAPERS = [herPaper(), ...[0, 1, 2, 3].map(kidPaper)];
  // the queue along the kerb: index 0 on the grating, the others upstream at uneven gaps; each beat the front one is dragged
  // into the slots and the water surges the rest one place on (k448, k449, k450); at the cut her paper arrives (6 frames)
  // only the paper on the grating and the next one drifting in are in the picture (the rest are upstream, out of frame), each
  // coming in at its own height and angle and turning square to the bars as it catches (not a row on a belt)
  const SLOTS = [GX, GX + 640, GX + 1250, GX + 1860, GX + 2470];
  const PY = [GY + 6, GY + 150, GY - 40, GY + 190, GY + 40], PA = [0.03, -0.42, 0.33, -0.5, 0.45];
  const T_SINK = [448, 449, 450].map((k, i) => S.ev(`paper ${i + 1} is dragged into the grating`, K(k)));
  // (rhythm pass) the kick comes back on k448 and hits every beat: each paper is snatched into the slots on the kick itself
  // (a third of the way under on the kick's frame, gone in six frames; it used to start slowly and only show 3-5 frames
  // late) and the water surges the next one on from the same frame; the whole street dips on each kick (k448 and k450 the
  // heavy ones, k449 lighter)
  // (third pass) the street no longer dips on the kicks: the snatch itself is the answer, the frame stays still
  const SINKD = 6 * FR, SURGE = 10 * FR;
  const nAt = tt => -1 + ease((tt - T_S2) / (6 * FR)) + T_SINK.reduce((a, t0) => a + ease((tt - t0) / SURGE), 0);
  const slotX = j => { if (j <= 0) return GX; const i = Math.min(Math.floor(j), SLOTS.length - 2), f = j - i; return lerp(SLOTS[i], SLOTS[i + 1], f); };
  function paperPose(p, tt) {
    const j = p - nAt(tt), x = slotX(j) + (j > 0 ? -14 * Math.sin(1.7 * tt + p) : 0), on = clamp01(1 - j);
    const y = lerp(PY[p], GY, on) + (j > 0 ? 5 * Math.sin(2.6 * tt + p * 1.3) : 0), a = lerp(PA[p], 0.015 * (p % 2 ? 1 : -1), on) + (j > 0 ? 0.025 * Math.sin(1.9 * tt + p) : 0);
    return { x, y, a, j };
  }
  function drawPaper(ctx, p, tt, pass) {
    const P = PAPERS[p], { x, y, a } = paperPose(p, tt), ts = T_SINK[p];
    let su = ts === undefined || tt < ts ? 0 : clamp01((tt - ts + FR) / (SINKD + FR)); su = 1 - (1 - su) * (1 - su);
    if (su >= 1) return;
    const cut = -P.w / 2 + P.w * su * 1.04;                    // the part left of `cut` has gone under the bars
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    if (pass === 'under' && su > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(-P.w / 2, -P.h / 2 - 4, cut + P.w / 2, P.h + 8); ctx.clip();
      ctx.translate(-10 * su, 14 * su); ctx.scale(0.94, 0.94); ctx.drawImage(P.c, -P.w / 2, -P.h / 2, P.w, P.h);
      ctx.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.5 + 0.45 * su); ctx.fillRect(-P.w / 2 - 20, -P.h / 2 - 20, P.w + 40, P.h + 40); ctx.restore();
    }
    if (pass === 'over') {
      ctx.save(); ctx.beginPath(); ctx.rect(cut, -P.h / 2 - 4, P.w / 2 - cut + 4, P.h + 8); ctx.clip();
      ctx.fillStyle = rgba(INK_RGB, 0.26); ctx.filter = 'blur(4px)'; ctx.fillRect(-P.w / 2 + 6, -P.h / 2 + 8, P.w, P.h); ctx.filter = 'none';
      ctx.drawImage(P.c, -P.w / 2, -P.h / 2, P.w, P.h);
      if (su > 0) { const gr = ctx.createLinearGradient(cut, 0, cut + 40, 0); gr.addColorStop(0, rgba(GRAPHITE_DARK_RGB, 0.7)); gr.addColorStop(1, rgba(GRAPHITE_DARK_RGB, 0)); ctx.fillStyle = gr; ctx.fillRect(cut, -P.h / 2, 40, P.h); }
      ctx.restore();
    }
    ctx.restore();
  }
  const OI = L49.slice(0, 7), OSZ = 104, OX = 156, OTOP = 300;
  LAY.text('おい誰なんだよ', 's2', [OX - OSZ * 0.6, OTOP, OSZ * 1.2, OI.length * OSZ * 1.04]);
  function drawS2(tt) {
    nbs.setTransform(1, 0, 0, 1, 0, 0); nbs.drawImage(ROAD, 0, 0);
    water(nbs, tt);
    for (let p = PAPERS.length - 1; p >= 0; p--) drawPaper(nbs, p, tt, 'under');
    bars(nbs);
    for (let p = PAPERS.length - 1; p >= 0; p--) drawPaper(nbs, p, tt, 'over');
    negPass(g, NB, nbs, [LIGHT2]);
    OI.forEach(([c, t], k) => whiteLetter(g, c, OX, OTOP + OSZ * 1.04 * (k + 0.5), OSZ, tt - t, 'rubbed'));
  }

  // ---------- S3: her face across the desk ----------
  // The lamp stands at the far left of her desk (upper left in the desk shot), i.e. on our RIGHT here. (round i, MUST 1: the
  // shade used to open to the left while the wall's fan of light came out of its closed back end - two openings - and the
  // fan was a large, very soft grey gradient.) Now the shade is ONE cone with ONE opening, tilted up to the left; every bit
  // of light comes out of that opening: the opening itself glows (the bulb inside), and the beam spreads from it up and to
  // the left across the wall behind her, with edges as crisp as a real shade's cut-off and a gentle fall-off with distance.
  // The beam's lower edge runs level with the opening, so the light also falls on her face from our right (r13h is drawn
  // lit from that side). Her pencil words are written inside the beam, in the upper third with her eyes.
  const FS = 1.055, FX = 40, FY = 0;                           // the 1536 x 1024 drawing, her face a little left of centre
  const SH_A = -142 * Math.PI / 180, SH_U = [Math.cos(SH_A), Math.sin(SH_A)], SH_V = [-SH_U[1], SH_U[0]];   // the shade's axis
  const SH_M = [1712, 590], SH_RM = 82, SH_LEN = 150, SH_RB = 36;                                         // mouth, back
  const SH_B = [SH_M[0] - SH_U[0] * SH_LEN, SH_M[1] - SH_U[1] * SH_LEN], SH_J = [SH_B[0] + 16, SH_B[1] + 34];   // back, arm joint
  const BEAM_HALF = 36 * Math.PI / 180, BEAM_H = SH_RM / Math.tan(BEAM_HALF);                           // the bulb: the edges graze the rim
  const BEAM = { fan: true, mouth: true, x: SH_M[0] - SH_U[0] * BEAM_H, y: SH_M[1] - SH_U[1] * BEAM_H, a: SH_A, half: BEAM_HALF, asoft: 0.07,
                 r: 760, soft: 280, mx: SH_M[0], my: SH_M[1], msoft: 10, fall: 0.14 };
  const MOUTH = { x: SH_M[0], y: SH_M[1], rx: 32, ry: SH_RM + 4, ang: SH_A, soft: 6 };
  const pt = (P, Q) => [P[0] + Q[0], P[1] + Q[1]], sc2 = (V, k) => [V[0] * k, V[1] * k];
  const [ROOM, ro] = mk(1920, 1080);
  { const R = rng(41); ro.fillStyle = rgb(WALL_RGB); ro.fillRect(0, 0, 1920, 1080);
    for (let k = 0; k < 7000; k++) { ro.fillStyle = rgba(INK_RGB, 0.02 + R() * 0.04); ro.fillRect(R() * 1920, R() * 1080, 1 + R() * 3, 1 + R() * 3); }
    // the window at the far left behind her shoulder, the city's few lights in it (dark here, bright in the negative)
    ro.fillStyle = rgb(mix(PAPER_RGB, TEAL_RGB, 0.12)); ro.fillRect(40, 420, 300, 420);
    for (let k = 0; k < 18; k++) { ro.fillStyle = GRAPHITE; const x = 56 + R() * 270, y = 640 + R() * 180; ro.fillRect(x, y, 4 + R() * 6, 4 + R() * 5); }
    ro.strokeStyle = TEAL; ro.lineWidth = 10; ro.strokeRect(40, 420, 300, 420); ro.lineWidth = 6; ro.beginPath(); ro.moveTo(190, 420); ro.lineTo(190, 840); ro.moveTo(40, 610); ro.lineTo(340, 610); ro.stroke();
    // the desk top (front edge at the bottom)
    ro.fillStyle = rgb(DESK_RGB); ro.fillRect(0, 980, 1920, 100); ro.strokeStyle = TEAL; ro.lineWidth = 4; ro.beginPath(); ro.moveTo(0, 980); ro.lineTo(1920, 980); ro.stroke();
    // the lamp at the right: a round base on the desk, a jointed arm, one cone shade tilted up to the left, its one mouth lit
    ro.fillStyle = PAPER; ro.strokeStyle = TEAL; ro.lineWidth = 5;
    ro.beginPath(); ro.ellipse(1800, 1040, 120, 28, 0, 0, 7); ro.fill(); ro.stroke();
    ro.lineWidth = 3; ro.beginPath(); ro.ellipse(1800, 1034, 86, 16, 0, 0, 7); ro.stroke(); ro.lineWidth = 5;
    for (const [a, b] of [[[1790, 1030], [1868, 830]], [[1868, 830], SH_J]]) { ro.beginPath(); ro.moveTo(a[0] - 9, a[1]); ro.lineTo(b[0] - 9, b[1]); ro.lineTo(b[0] + 9, b[1]); ro.lineTo(a[0] + 9, a[1]); ro.closePath(); ro.fill(); ro.stroke(); }
    ro.lineWidth = 7; ro.beginPath(); ro.moveTo(...SH_J); ro.lineTo(...SH_B); ro.stroke(); ro.lineWidth = 5;
    for (const p of [[1868, 830], SH_J]) { ro.beginPath(); ro.arc(p[0], p[1], 15, 0, 7); ro.fill(); ro.stroke(); }
    const shade = () => { ro.beginPath(); ro.moveTo(...pt(SH_M, sc2(SH_V, SH_RM))); ro.lineTo(...pt(SH_B, sc2(SH_V, SH_RB)));
      ro.arc(SH_B[0], SH_B[1], SH_RB, Math.atan2(SH_V[1], SH_V[0]), Math.atan2(-SH_V[1], -SH_V[0]), SH_V[0] * SH_U[1] - SH_V[1] * SH_U[0] > 0);
      ro.lineTo(...pt(SH_M, sc2(SH_V, -SH_RM))); ro.closePath(); };
    shade(); ro.fill(); ro.stroke();
    ro.save(); shade(); ro.clip(); ro.strokeStyle = rgba(TEAL_RGB, 0.5); ro.lineWidth = 2;      // shading along the cone, heavier on its lower side
    for (let k = -6; k <= 6; k++) { const f = k / 6, m = pt(SH_M, sc2(SH_V, SH_RM * f)), bk = pt(SH_B, sc2(SH_V, SH_RB * f)); if (f > 0.25) continue; ro.beginPath(); ro.moveTo(...m); ro.lineTo(...bk); ro.stroke(); }
    ro.restore();
    ro.fillStyle = PAPER; ro.lineWidth = 5; ro.beginPath(); ro.ellipse(SH_M[0], SH_M[1], 28, SH_RM, SH_A, 0, 7); ro.fill(); ro.stroke();
    const bulb = pt(SH_M, sc2(SH_U, -8)); ro.lineWidth = 2; ro.strokeStyle = rgba(TEAL_RGB, 0.6); ro.beginPath(); ro.ellipse(bulb[0], bulb[1], 14, 30, SH_A, 0, 7); ro.stroke(); }
  // the eraser's sleeve in her hand is blank: 読取機用 printed on its free (right) part; her fingers lie over its left part
  function faceImage(f) {
    const key = f === DRAW.face ? 'r13h_face' : 'r13h_face_up', [rx, ry, rw, rh] = partOf(PRT, key, 'sleeve').rect;
    const im = IMG[f], [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const k = rh * 0.62 / 16; dots16Text(x, '読取機用', rx + rw - 4 * 16 * k - rh * 0.35, ry + rh / 2, k, 61, { color: TEAL_RGB });
    x.drawImage(rinPalImage(FING[f]), 0, 0);
    return c;
  }
  const FACE = {}; for (const f of [DRAW.face, DRAW.up]) FACE[f] = faceImage(f);
  const MO = L49.slice(7);
  const TXT_BOX = [1190, 246, 460, 92], TSZ = 56;              // inside the beam, right of her hair
  LAY.text('もう知ってんだろ', 's3', PEN.lineBox(MO, TXT_BOX, TSZ));
  // (third pass, 整屏运动) no steps on k452-k454 any more: an even drift in towards her eyes, 1.00 -> 1.04 from the cut (k451)
  // to the cut into 14 (k455), constant speed (no start, no stop inside the shot); her look up on k452 is the accent
  move(S, 'even drift in to her eyes', T_S3, SEG[1]);
  const push3 = (i, tt) => 1 + 0.04 * clamp01((tt - T_S3) / (SEG[1] - T_S3));
  const EYEPT = [FX + 860 * FS, FY + 500 * FS];
  function drawS3(tt, f, z = 1) {
    const C = [z, EYEPT[0] - (EYEPT[0] - 960) / z, EYEPT[1] - (EYEPT[1] - 540) / z];   // zoom about her eyes
    nbs.setTransform(1, 0, 0, 1, 0, 0); setCam(nbs, C); nbs.drawImage(ROOM, 0, 0);
    PEN.line(nbs, MO, TXT_BOX, tt, TSZ);
    const sx = X => (X - C[1]) * z + 960, sy = Y => (Y - C[2]) * z + 540;
    const beam = { ...BEAM, x: sx(BEAM.x), y: sy(BEAM.y), mx: sx(BEAM.mx), my: sy(BEAM.my), r: BEAM.r * z, soft: BEAM.soft * z, msoft: BEAM.msoft * z };
    negPass(g, NB, nbs, [beam, { ...toScreen(C, MOUTH), ang: MOUTH.ang }]);
    setCam(g, C); g.imageSmoothingQuality = 'high'; const im = FACE[f]; g.drawImage(im, FX, FY, im.width * FS, im.height * FS); g.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ---------- the timeline of shots and drawings ----------
  S.hold('shot', 'S1 the desk', SEG[0], T_S2, { kind: 'shot', onBeat: false });
  S.hold('hand', 'H13h-slap: pressing the folded essay down hard', T_SLAP, T_OPEN1, { kind: 'key', file: DRAW.slap, onBeat: false });
  S.hold('hand', 'H13g-open: pinching the flap, then the last fold (pushed out of the frame from k438.5)', T_OPEN1, T_TILT, { kind: 'key', file: DRAW.open, onBeat: false });
  S.hold('hand', 'H13g-erase: the hand at the end of the eraser', T_TILT, T_DOWN, { kind: 'key', file: DRAW.erase });
  S.hold('hand', 'H13g-hover: almost touching, flinching back, then rubbing', T_DOWN, T_S2, { kind: 'key', file: DRAW.hover });
  S.ev('the eraser lifts off strip 4, comes to hang high over the guitar in the drawing', T_TILT);
  S.ev('it goes down (from the pull-out stop), almost touches, flinches back up and away', T_DOWN);
  S.ev('it comes down for real and starts rubbing (a move of the hand)', T_COMMIT, 'half');
  S.ev('the rubbing works down to the body', T_RUB[0]); S.ev('a stroke (a small move of the hand)', T_RUB[1], 'half');
  S.hold('shot', 'S2 the drain', T_S2, T_S3, { kind: 'shot' });
  S.hold('shot', 'S3 her face', T_S3, SEG[1], { kind: 'shot' });
  // R13h-face holds one beat: the eyes only (an eye movement, 制作约定第六节's exception; 13_C.md 第 5 节)
  S.hold('rin', 'R13h-face: eyes down (one beat: an eye movement)', T_S3, T_UP, { kind: 'key', file: DRAW.face, onBeat: false });
  S.hold('rin', 'R13h-face-up: she looks up at us', T_UP, SEG[1], { kind: 'key', file: DRAW.up });

  // ---------- audits ----------
  LAY.audit('seg_13 desk');
  // her card's face (her_card.js, state 'title'): its printed lines against the card's own labels, card space u = 1000
  { const B = herCardBoxes(CARD_U, { state: 'title' });
    for (const [n, b] of Object.entries(B.lines)) LAY.text(`her card ${n}`, 'cardface13', b);
    for (const [n, b] of Object.entries(B.labels)) LAY.text(`her card label ${n}`, 'cardface13', b);
    LAY.audit('seg_13 her card face'); }
  const views1 = (a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy] = cam1(t); return { t, z, fx, fy }; });
  const id = p => p;
  LAY.frameCheck('S1 header and questions (1.24x)', { sheets: { 's1page:print': id, 's1page:head': id }, views: views1(SEG[0], T_OPEN2), inset: 16 });
  LAY.frameCheck('S1 white letters (push in and 2.6x)', { sheets: { s1letters: id }, views: views1(T_OPEN2, T_TILT) });
  LAY.frameCheck('S1 header, questions, white letters and card at the pull-out (0.74x)', { sheets: { 's1page:print': id, 's1page:head': id, s1letters: id, s1desk: id }, views: views1(T_PULLED, T_S2), inset: 16 });
  LAY.frameCheck('S2 おい誰なんだよ', { sheets: { s2: id }, views: frameTimes(SEG[0], T_S2, T_S3).map(t => ({ t, z: 1, fx: 960, fy: 540 })) });
  LAY.frameCheck('S3 もう知ってんだろ', { sheets: { s3: id }, views: frameTimes(SEG[0], T_S3, SEG[1]).map(t => { const z = push3(0, t); return { t, z, fx: EYEPT[0] - (EYEPT[0] - 960) / z, fy: EYEPT[1] - (EYEPT[1] - 540) / z }; }) });
  // LYRIC AUDIT (docs/制作约定.md 第六节): the first frame each sung character reads on. The strip letters (line 48) are
  // also counted as hidden while the eraser's body covers their middle (the eraser is drawn over them).
  const coveredByEraser = (tt, x, y) => { const E = eraserAt(tt); if (!E) return false; const sc = 1 + LIFT_SC * E.lift, dx = x - E.cx, dy = y - E.cy;
    const lx = dx * Math.cos(E.ang) + dy * Math.sin(E.ang), ly = -dx * Math.sin(E.ang) + dy * Math.cos(E.ang);
    return Math.abs(lx) < ER_L * sc / 2 + LSZ * 0.3 && Math.abs(ly) < ER_W * sc / 2 + LSZ * 0.3; };
  const readOf = (t, hidden = () => false) => { for (let f = onsetFrame(t) - 2; f < F1 && f <= onsetFrame(t) + 30; f++) { const tt = f / 30; if (f >= F0 && sungBuild(tt - t) >= 1 && !hidden(tt)) return tt; } return null; };
  const LA = [];
  for (const Ln of [L46, L47]) for (const [c, t] of Ln) LA.push({ c, t, readT: readOf(t) });
  for (const L of LETTERS) L.chars.forEach(([c, t], k) => { const y = LTOP + LSZ * LSTEP * (k + 0.5); LA.push({ c, t, readT: readOf(t, tt => coveredByEraser(tt, L.x, y)) }); });
  for (const [c, t] of L49) LA.push({ c, t, readT: readOf(t) });
  const lyric = lyricAudit('seg_13', LA);
  // MOTION AUDIT (制作约定第六节「整屏运动」): every shown frame's view; the first frames of S2 and S3 are cuts. No 大击 in 13;
  // one whip (the pull-out to her hand).
  const MV = frameTimes(SEG[0], SEG[0], SEG[1]).map((t, i, A) => {
    const cut = i > 0 && ((t >= T_S2 && A[i - 1] < T_S2) || (t >= T_S3 && A[i - 1] < T_S3));
    if (t >= T_S3) { const z = push3(0, t); return { t, z, fx: EYEPT[0] - (EYEPT[0] - 960) / z, fy: EYEPT[1] - (EYEPT[1] - 540) / z, cut }; }
    if (t >= T_S2) return { t, z: 1, fx: 960, fy: 540, cut };
    const [z, fx, fy] = cam1(t); return { t, z, fx, fy, cut }; });
  const motion = motionAudit('seg_13', MV, { whips: [[T_TILT, 'k443 拉出，露出她的手（甩镜）']] });
  // PART AUDIT (web/lib/parts.js): each part against the pixels of the drawing it is drawn on
  { const RAW = {}; for (const k of ['erase', 'hover']) RAW[k] = await img(ERX[k].src);
    const clear = p => p[3] < 60;
    for (const k of ['erase', 'hover']) {
      const ax = HAND[k].ax, w = ERX[k].wid / 2, far = along(ax, 640);
      // the canon eraser runs on along the drawn eraser's centreline (the free part Codex drew above her fingers)
      axisAudit('seg_13', KEY[k], 'eraser', { image: RAW[k], axis: [ax.tip, far], body: PIX.opaque, halfWidth: 120 });
      // ... and as wide as it: just inside both of the canon eraser's long edges is drawn eraser, just outside is background
      const edge = o => [...samplesAlong(along(ax, 40, o), along(ax, 560, o), 60)];
      partAudit('seg_13', KEY[k], 'eraser edges (inside)', { image: RAW[k], points: [...edge(w - 3), ...edge(-(w - 3))], on: PIX.opaque, r: 1 });
      partAudit('seg_13', KEY[k], 'eraser edges (outside)', { image: RAW[k], points: [...edge(w + 4), ...edge(-(w + 4))], on: clear, r: 1 });
    }
    // her hand's anchor on the paper: the palm (slap) and the pinching fingertips (open) are on her drawn skin
    partAudit('seg_13', KEY.slap, 'palm', { image: await img(DRAW.slap), points: [HAND.slap.end], on: PIX.skin, r: 3, maxOffPct: 0 });
    partAudit('seg_13', KEY.open, 'pinch', { image: await img(DRAW.open), points: [HAND.open.end], on: PIX.opaque, r: 3, maxOffPct: 0 });
    // 読取機用 printed on the blank sleeve in her hand (S3): the print area is on the drawn pale sleeve, or under the finger
    // overlay that is drawn back over it
    for (const f of [DRAW.face, DRAW.up]) {
      const key = f === DRAW.face ? 'r13h_face' : 'r13h_face_up', [rx, ry, rw, rh] = partOf(PRT, key, 'sleeve').rect, k = rh * 0.62 / 16;
      const x0 = rx + rw - 4 * 16 * k - rh * 0.35, x1 = rx + rw - rh * 0.35, fp = pixelsOf(FING[f]);
      const pts = []; for (let y = ry + rh / 2 - 7 * k; y <= ry + rh / 2 + 7 * k; y += 2) for (let x = x0; x <= x1; x += 2) if (fp.at(x, y)[3] < 100) pts.push([x, y]);
      partAudit('seg_13', key, 'sleeve print area', { image: await img(f), points: pts, on: p => p[3] > 200 && Math.min(p[0], p[1], p[2]) > 170, r: 0 });
    } }
  const parts = partReport('seg_13');
  S.finish();
  publishAudit(S, LAY, { motion, parts, segment: [F0, F1], lyric: { ...lyric, chars: LA.map(e => ({ c: e.c, t: e.t, onsetFrame: onsetFrame(e.t), readFrame: e.readT === null ? null : Math.round(e.readT * 30) })) } });

  window.renderAt = async t => {
    if (t >= T_S3) { const F = S.at('rin', t); drawS3(t, F.file, push3(0, t)); return; }
    if (t >= T_S2) { drawS2(t); return; }
    drawS1(t);
  };
  await window.renderAt(SEG[0]);
}
