// Segment 07 前副歌1 (docs/分镜/07_前副歌1.md), k171-k199, global frames [1910, 2221): one continuous take.
// Version 4 (2026-11-20, after the full-segment review; version 3 is in archive/seg07_v3_20261120/):
//   k171-k175  her 自己紹介カード on the cork board, close (the card fills the frame, the strip torn off 06's result slip pinned
//              over its top edge at 06's on-screen print size). 句11 is printed into the テーマ field as sung. k172 her pencil
//              starts a big ギ in 長所 by itself and the camera pushes into the field (k173: 長所 and 短所 fill the frame); k173
//              the machine prints a 特になし label over it (a light print: nothing shakes; the growing stroke stops dead, the
//              start of both strokes still showing at the label's left edge); her pencil starts again in 短所, harder, k174 a
//              bigger, ruled 特になし label covers that too, the empty 将来の夢 field below.
//   k175-k176  quick pull back (log zoom, most of it in the first quarter beat, 2% overshoot): the board is on the wall of her
//              room, seen from outside her window; she sits on the bed under the window, her card on her chest (r07b_sit).
//   k176-k179  句12 printed into the month's slogan banner as sung (large: phone-readable); 満 light-stamped k177 the books,
//              k178 the desk lamp, k179 the alarm clock on the sill: right to left, each nearer to her and larger, the gold
//              Les Paul (its gold top a third above the sill) skipped between the first two.
//   k179-k191  push to her, the leader line and 最近に／生きていて, the pan to the calendar, k184 she looks out of the window,
//              two circles, 時々に struck out, いや毎日, k190.5 all thirty days black.
//   k191-k199  back to her; 悲しいって言うんだ on the window glass right of her face, k194 her lips part (r07c_say), 淋しいって言うんだ
//              on the glass left of her face, k196-k199 push to her close-up between the two columns.
// Version 5 (2026-11-21, review MUST): from k184 her head is lifted and both irises are pushed up under the upper lids and to
//   the left (white showing below-right): she looks up and out over the camera, never at us (改定 5); look / say are drawn at
//   high resolution for the close-up (r07c_*, see GEOM). Version 4's page is archive/seg07_v4_20261121/.
// Her four drawings (r07b_sit and its variants r07c_*) are one master and its variants; the card in them is drawn plain white and the card face of
// 03 on (審査後改定 15: 読み取れません in the name field, ロストワン in print, の号哭 in her pencil) is drawn over it here
// with web/lib/her_card.js (the film's one card face, docs/卡面状態.md), warped through the holder window's four corners
// measured in each drawing (HOLDER; version 6, 2026-11-21; version 5's page is archive/seg07_v5_before_card_20261121/).
// Version 7 (2026-11-21, rhythm pass after the user watched the whole film; version 6's page is
// archive/seg07_v6_before_rhythm_20261121/): sung letters are whole on the frame their onset falls in (print.js sungBuild,
// LYRIC AUDIT); the camera answers the drums (see "Version 7" at the camera): the 満 slams with a dip, steps on the calendar,
// the close-up push as four growing steps on the crash and the fill. The design and every drawing are unchanged.
// ?black=190 renders the comparison with the calendar going black on k190 instead of k190.5.
// World units: centimetres of the elevation, drawn at 10 world px per cm. x runs from the window's left frame (0) to its right
// frame (192); h is the height above the room's floor; the frame at zoom 1 shows h 80..188 (the whole window).
import { FRAME as FR, beatV, beatOf, smooth, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, move, camLerp, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, partAudit, PIX, partReport } from '../../lib/parts.js';
import { dots16, print16Box, pencilWriter, vertical, sungBuild, onsetFrameTime } from '../../lib/print.js';
import { CARD_RATIO } from '../../lib/card.js';
import { herCardFace, herCardBoxes } from '../../lib/her_card.js';
import { loadLyrics, lyricAudit } from '../../lib/lyrics.js';
import { PAPER, PAPER_SLIP, PAPER_RGB, TEAL, TEAL_RGB, GRAPHITE, INK_RGB, PENCIL, PENCIL_FILL, FIBRE_RGB, rgba } from '../../lib/palette.js';

export default async function seg07(H) {
  const { g, W, P, q, rng, img, rinPalImage } = H;
  const BLACK_K = q.get('black') === '190' ? 190 : 190.5;
  const F0 = 1910, F1 = 2221, SEG = [F0 / 30, F1 / 30];
  const K = beatV;
  const S = createScore(BLACK_K === 190 ? 'seg_07 (black k190)' : 'seg_07', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const LY = await loadLyrics({ within: SEG });
  const L11 = LY.lineAt(11, '無個性な僕のこと'), L12 = LY.lineAt(12, '過不足無い不自由無い'), L13 = LY.lineAt(13, '最近に生きていて');
  const L14 = LY.lineAt(14, 'でもどうして僕達は'), L15 = LY.lineAt(15, '時々にいや毎日');
  const L16 = LY.lineAt(16, '悲しいって言うんだ'), L17 = LY.lineAt(17, '淋しいって言うんだ');
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };

  // ---------- world ----------
  const PX = 10, XOFF = 60, HTOP = 188, HBOT = 80;
  const X = x => (x + XOFF) * PX, Y = h => (HTOP - h) * PX, L = cm => cm * PX;
  // camera.js clamps its focus to a world the size of the frame; this world is the window (x 0..192, h 80..188), so the
  // focus is clamped here to it and the frame is shot centred, with the world shifted under it
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  function view(z, fx, fy) {
    z = Math.max(1, z);
    fx = Math.min(X(192) - W / 2 / z, Math.max(X(0) + W / 2 / z, fx)); fy = Math.min(Y(HBOT) - 540 / z, Math.max(Y(HTOP) + 540 / z, fy));
    return { z, fx, fy };
  }
  function shoot(z, fx, fy, draw) {
    const v = view(z, fx, fy);
    CAM.shoot([v.z, W / 2, 540], 0, 0, ctx => { ctx.translate(W / 2 - v.fx, 540 - v.fy); draw(ctx, v.z); });
    return v;
  }
  const RES = 3;                                                       // offscreen textures at 3x world px: sharp to zoom 3
  const RC = 80;                                                       // the board, the card and the strip: 80 px per cm (zoom <= 8)

  // ---------- the drawings (art/cut, Codex) ----------
  // one master (r07b_sit) and its variants, one scale: the master's canvas is 16 px per cm (her head 21 cm); the master
  // point (151, 784) (the left edge of her blazer at the bottom of her card) is the world point (22 cm, 89 cm): the bed is
  // high enough that her card clears the sill.
  // Version 5: turn, look and say (the end, up to 2.52x = 25.2 screen px per cm) are drawn at high resolution: the master's crop
  // x 180.., y 0.. enlarged 1.5x (24 px per cm) and redrawn crisp with the one change (art/design/prompts/_make_seg07.py
  // round 10); each is placed on the master's canvas by GEOM (k master px per drawing px, origin ox, oy in master px),
  // registered on the master's body below the neck (art/design/prompts/_reg_seg07.py, alpha IoU > 0.99).
  const ART = { sit: '/art/cut/r07b_sit.png', turn: '/art/cut/r07c_turn.png', look: '/art/cut/r07c_look.png', say: '/art/cut/r07c_say.png' };
  const GEOM = { sit: [1, 0, 0], turn: [0.66333, 181, 4], look: [0.66333, 180, 2], say: [0.66333, 180, 3] };
  // Her card (docs/卡面状态.md; the face is web/lib/her_card.js, state 'title': all of 07 is after 03 k40). Codex drew it on
  // her chest as a white window in a grey holder, hung from the teal lanyard by a clip at the top centre. The window's four
  // corners are measured in each drawing's own px (work/seg/07/card/measure_card.py -> holder_quads.json: lines fitted to
  // the four edges, fit error <= 0.3 px), with its corner radius and the holder's grey. The face goes through the corners
  // with a true perspective map (a homography) and is cut to the window's rounded outline, so the drawn bevel line and the
  // grey holder stay round it as drawn. The window is 1.62-1.64 wide to 1 high, the card 3:2: the face is drawn 4% wider
  // than 3:2 (not visible) and fills the window by its width, so the window crops 0.014u off its top and its bottom (the
  // corner marks, the timing marks, the clip slot and every printed line stay inside; AUDIT her card in the holder).
  // Version 8 (2026-11-21, 根因清单「笔芯和笔不对了……」): the window is a part measured on each drawing in its own px, read from
  // art/cut/seg07_parts.json through web/lib/parts.js (partOf: no drawing borrows another's), and drawn through that drawing's
  // one placement (PL); PART AUDIT checks the quad against the drawing's own pixels.
  const DRAW = { sit: 'r07b_sit', turn: 'r07c_turn', look: 'r07c_look', say: 'r07c_say' };
  const PA = await loadPartAnchors('/art/cut/seg07_parts.json');
  const HOLDER = {};
  for (const [k, d] of Object.entries(DRAW)) { const w = partOf(PA, d, 'card_window'); HOLDER[k] = { q: w.quad, r: w.r, grey: w.grey }; }
  const CARD_STRETCH = 1.04, HOLD_SS = 3;                             // the face's width stretch; warp px per drawing px
  const IMG = {}, KEY_OF = new Map();
  for (const [k, f] of Object.entries(ART)) { IMG[f] = rinPalImage(await img(f)); KEY_OF.set(IMG[f], k); }
  const LP = await img('/art/cut/p07_lespaul.png');
  const RIN_PXCM = 16, RIN_AX = 151, RIN_AY = 784, RIN_WX = 22, RIN_WH = 89;
  const rinS = PX / RIN_PXCM;
  // one placement per drawing (drawing px -> world px): the drawing, its card face and its shadow all go through it, once
  const PL = {};
  for (const [key, [k, ox, oy]] of Object.entries(GEOM)) PL[key] = placement({ x: X(RIN_WX) + (ox - RIN_AX) * rinS, y: Y(RIN_WH) + (oy - RIN_AY) * rinS, s: k * rinS });
  const plOf = im => PL[KEY_OF.get(im)];
  const AN = { faceX: 40, faceH: 113 };                               // measured on the drawings (cm): her face's centre

  // ---------- the timeline ----------
  const T171 = K(171), T172 = K(172), T172h = K(172.5), T173 = K(173), T174 = K(174), T175 = K(175), T176 = K(176);
  const T179 = K(179), T180 = K(180), T180h = K(180.5), T183 = K(183), T184 = K(184), T188 = K(188), T188h = K(188.5), T189h = K(189.5);
  const T190 = K(190), TBLACK = K(BLACK_K), T191 = K(191), T192 = K(192), T194 = K(194), T196 = K(196), T199 = K(199);
  S.hold('shot', 'one take: card -> room -> her', T171, T199, { kind: 'shot', onBeat: false });
  S.ev('cut in: the card close', T171);
  // her drawings: on screen from the pull (k175); the head turn from profile to three-quarter gets an in-between drawn from
  // both keys, held a whole beat while the camera pans
  S.hold('rin', 'r07b_sit (head bowed, card on her chest)', T175, T183, { kind: 'key', file: ART.sit });
  S.hold('rin', 'r07c_turn (head halfway round and up)', T183, T184, { kind: 'inbetween', file: ART.turn });
  S.hold('rin', 'r07c_look (head up, looks up and out past us)', T184, T194, { kind: 'key', file: ART.look });
  S.hold('rin', 'r07c_say (lips parted, saying it, still looking out)', T194, T199, { kind: 'key', file: ART.say });
  const rinAt = tt => { const h = tt >= T175 ? S.at('rin', tt) : null; return IMG[h && h.file ? h.file : ART.sit]; };
  S.ev('pencil starts ギ in 長所', T172); S.ev('second stroke starts', T172h, 'half');
  S.ev('特になし label over 長所 (light print)', T173); S.ev('pencil starts again in 短所', T173);
  S.ev('特になし label over 短所 (larger, ruled; light print)', T174);
  const STAMPS = [[S.ev('満 slams on the books', K(177)), 'books'], [S.ev('満 slams on the desk lamp', K(178)), 'lamp'],
                  [S.ev('満 slams on the alarm clock', T179), 'clock']];
  S.ev('leader line starts', T180); S.ev('leader arrow lands', T180h, 'half');
  S.ev('small circle 1', T188); S.ev('small circle 2', T188h, 'half'); S.ev('時々に struck out', T189h, 'half');
  S.ev(`all thirty days black k${BLACK_K}`, TBLACK, BLACK_K % 1 ? 'half' : 'beat');
  move(S, 'note and leader fade out', T191, T192);

  // ---------- the board, the card and the strip (positions in cm) ----------
  const BOARD = { x0: 4, x1: 62, h0: 134, h1: 172, rim: 1.0 };
  const CARD = { x0: 24, top: 167.5, w: 18.2, h: 25.7 };              // B5, portrait (設定包: art/canon/jikoshoukai_card.png)
  const CX = cx => X(CARD.x0 + cx), CY = cy => Y(CARD.top - cy);      // card cm (from its top left) -> world px
  // the strip: 06's slip at 06's on-screen size at k171 (16-dot cell 9 slip px x 0.6 x 1.04 = 5.616 screen px) -> slip px to cm
  const Z0 = 5.2;                                                     // k171 framing: the strip and the card's top two thirds
  const SLIP_CM = 0.624 / (Z0 * PX);                                  // cm per slip px
  const STRIP = { x0: CARD.x0 + 7.1, bot: CARD.top - 0.5, wpx: 1240, hpx: 230, rot: 0.018 };
  STRIP.w = STRIP.wpx * SLIP_CM; STRIP.h = STRIP.hpx * SLIP_CM;
  const STRIP_TXT = { x: 70, y: 115, k: 9 };                          // 06's left margin and cell, in slip px
  const PIN_STRIP = [STRIP.x0 + 4.3, CARD.top - 0.1], PIN_CARD = [CARD.x0 + 1.6, CARD.top - 0.7];
  const LONE_PINS = [[8.5, 169.5], [57.5, 137.5]];

  // the cork: printed teal granules on paper, once, at RC px per cm
  const CORK = (() => {
    const w = (BOARD.x1 - BOARD.x0) * RC, h = (BOARD.h1 - BOARD.h0) * RC, [c, x] = mk(w, h), r = rng(1707);
    x.fillStyle = PAPER; x.fillRect(0, 0, w, h);
    x.fillStyle = rgba(TEAL_RGB, 0.13); x.fillRect(0, 0, w, h);
    for (let i = 0; i < 42000; i++) {
      const rr = (0.03 + r() * 0.06) * RC; x.fillStyle = rgba(TEAL_RGB, 0.07 + r() * 0.12);
      x.beginPath(); x.ellipse(r() * w, r() * h, rr, rr * (0.55 + r() * 0.45), r() * 3.14, 0, 7); x.fill();
    }
    // the board's rim: a plain printed frame
    const m = BOARD.rim * RC; x.fillStyle = PAPER;
    x.fillRect(0, 0, w, m); x.fillRect(0, h - m, w, m); x.fillRect(0, 0, m, h); x.fillRect(w - m, 0, m, h);
    x.strokeStyle = TEAL; x.lineWidth = 0.09 * RC; x.strokeRect(x.lineWidth / 2, x.lineWidth / 2, w - x.lineWidth, h - x.lineWidth); x.strokeRect(m, m, w - 2 * m, h - 2 * m);
    return c;
  })();
  // the card's printed layout (設定包 proportions), once, at RC px per cm; her name in pencil
  const PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
  const PEN_SH = pencilWriter({ font: '600 #px Klee', color: 'rgba(18,70,82,0.10)' });
  const CF = {   // fields in card cm: [x0, y0, x1, y1, tag width]
    name: [5.64, 3.16, 17.04, 5.23, 2.3], theme: [5.64, 5.69, 17.04, 7.68, 2.63],
    chosho: [1.0, 8.35, 17.2, 12.89, 2.6], tansho: [1.0, 13.35, 17.2, 17.72, 2.6], yume: [1.0, 18.16, 17.2, 24.63, 4.05] };
  const TAG_H = 0.95;
  const CARD_TEX = (() => {
    const u = RC, w = CARD.w * u, h = CARD.h * u, [c, x] = mk(w, h);
    x.fillStyle = PAPER; x.fillRect(0, 0, w, h);
    const r = rng(1771); for (let i = 0; i < 500; i++) { x.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); x.fillRect(r() * w, r() * h, (0.2 + r() * 0.6) * u, 0.03 * u); }
    x.strokeStyle = TEAL; x.lineWidth = 0.05 * u; x.strokeRect(0.66 * u, 0.6 * u, 16.88 * u, 24.33 * u);
    x.fillStyle = TEAL; x.fillRect(0.66 * u, 0.6 * u, 16.88 * u, 1.95 * u);
    const dotsAt = (text, cx, cy, hCm, seed, color, align = 'center') => {      // hCm: the character height (16 cells) in cm
      const D = dots16(text, hCm * u / 16, seed, color);
      const dx = align === 'center' ? cx * u - D.w / 2 : cx * u;
      x.drawImage(D.c, D.x0, D.y0, D.w, D.h, dx, cy * u - D.h / 2, D.w, D.h);
    };
    dotsAt('自己紹介カード', 9.1, 1.58, 1.3, 1772, PAPER_RGB);
    x.strokeStyle = TEAL; x.lineWidth = 0.05 * u; x.setLineDash([0.28 * u, 0.2 * u]); x.strokeRect(1.2 * u, 2.97 * u, 3.85 * u, 4.71 * u); x.setLineDash([]);
    dotsAt('写真をはる', 3.125, 5.32, 0.5, 1773, TEAL_RGB);
    const field = ([x0, y0, x1, y1, tw], label, lines, seed) => {
      x.strokeStyle = TEAL; x.lineWidth = 0.05 * u; x.strokeRect(x0 * u, y0 * u, (x1 - x0) * u, (y1 - y0) * u);
      x.fillStyle = TEAL; x.fillRect(x0 * u, y0 * u, tw * u, TAG_H * u);
      dotsAt(label, x0 + 0.28, y0 + TAG_H / 2, 0.62, seed, PAPER_RGB, 'left');
      x.fillStyle = TEAL;
      for (const f of lines) { const yy = (y0 + (y1 - y0) * f) * u; for (let xx = x0 + 0.35; xx < x1 - 0.3; xx += 0.14) { x.beginPath(); x.arc(xx * u, yy, 0.022 * u, 0, 7); x.fill(); } }
    };
    field(CF.name, '名前', [], 1774); field(CF.theme, 'テーマ', [], 1775);
    field(CF.chosho, '長所', [0.35, 0.53, 0.71, 0.89], 1776); field(CF.tansho, '短所', [0.35, 0.53, 0.71, 0.89], 1777);
    field(CF.yume, '将来の夢', [0.24, 0.38, 0.52, 0.66, 0.8, 0.93], 1778);
    // her name in pencil (the hand of Demo 1's answer sheets)
    '鏡音リン'.split('').forEach((ch, i) => PEN.char(x, ch, (8.6 + i * 1.22) * u, 4.38 * u, 1.15 * u, 1));
    // the corner marks and the timing marks along the bottom
    x.fillStyle = GRAPHITE; for (const [a, b] of [[0.12, 0.12], [17.73, 0.12], [0.12, 25.23], [17.73, 25.23]]) x.fillRect(a * u, b * u, 0.35 * u, 0.35 * u);
    x.fillStyle = TEAL; for (let i = 0; i < 22; i++) x.fillRect((1.5 + i * 0.71) * u, 25.12 * u, 0.07 * u, 0.3 * u);
    return c;
  })();
  // 句11 in the テーマ field, one 16-dot character at a time as sung
  const L11_CELL = 1.0, L11_X0 = 8.75, L11_Y = 6.82;
  const L11_D = L11.map(([c], i) => dots16(c, L11_CELL * RC / 16, 1790 + i, INK_RGB));
  // the 特になし labels: a whiter label printed over the field (the machine's light print), k173 and the larger, ruled one k174;
  // each starts a little right of where her strokes start, so the start of her strokes still shows at its left edge
  const LABELS = [{ t: T173, left: 2.4, cy: 10.75, cell: 1.9, ruled: false, seed: 1795 }, { t: T174, left: 2.6, cy: 16.0, cell: 2.15, ruled: true, seed: 1796 }];
  for (const lb of LABELS) {
    lb.D = dots16('特になし', lb.cell * RC / 16, lb.seed, INK_RGB);
    const [bx, by, bw, bh] = print16Box('特になし', 0, 0, lb.cell * RC / 16, { framed: true }).map(v => v / RC);
    lb.cx = lb.left - bx;
    lb.box = [lb.cx + bx, lb.cy + by, bw, bh];                         // card cm
  }
  // her pencil strokes of ギ, big and growing by themselves (no hand): [x0, y0, x1, y1, start, end, width] in card cm
  const STROKES = [
    [1.45, 10.25, 4.3, 10.0, T172, K(172.4), 0.26], [1.25, 11.35, 4.6, 11.1, T172h, K(173.4), 0.26],          // 長所 (cut at k173)
    [1.4, 14.95, 4.4, 14.7, T173, K(173.3), 0.3], [1.2, 16.05, 4.7, 15.8, K(173.33), K(173.62), 0.3],        // 短所
    [2.9, 14.15, 3.15, 17.3, K(173.66), K(174.4), 0.3]];                                                      // its down stroke (cut at k174)
  const strokeCut = i => i < 2 ? T173 : T174;
  function cardDynamic(ctx, tt) {
    const s = PX / RC;
    // 句11
    L11.forEach(([, t], i) => { if (sungBuild(tt - t) < 1) return; const D = L11_D[i];
      ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, CX(L11_X0 + (i + 0.5) * L11_CELL) - D.w * s / 2, CY(L11_Y) - D.h * s / 2, D.w * s, D.h * s); });
    // the strokes, each frozen where the label caught it: graphite with a lighter grain along it, a darker growing tip
    STROKES.forEach(([x0, y0, x1, y1, a, b, w], i) => {
      const te = Math.min(tt, strokeCut(i)); if (te < a) return;
      const u = Math.min(1, (te - a) / (b - a)), ex = x0 + (x1 - x0) * u, ey = y0 + (y1 - y0) * u;
      ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(40,40,46,0.88)'; ctx.lineWidth = L(w);
      ctx.beginPath(); ctx.moveTo(CX(x0), CY(y0)); ctx.lineTo(CX(ex), CY(ey)); ctx.stroke();
      ctx.strokeStyle = 'rgba(90,90,98,0.4)'; ctx.lineWidth = L(w * 0.35);
      ctx.beginPath(); ctx.moveTo(CX(x0), CY(y0) - L(w * 0.2)); ctx.lineTo(CX(ex), CY(ey) - L(w * 0.2)); ctx.stroke();
      if (tt < strokeCut(i) && u < 1) { ctx.fillStyle = 'rgba(24,24,28,0.95)'; ctx.beginPath(); ctx.arc(CX(ex), CY(ey), L(w * 0.62), 0, 7); ctx.fill(); }
    });
    // the labels: printed in one frame, nothing shakes
    for (const lb of LABELS) { if (tt < lb.t) continue;
      const [bx, by, bw, bh] = lb.box;
      ctx.fillStyle = 'rgba(18,70,82,0.22)'; ctx.fillRect(CX(bx + 0.08), CY(by - 0.1), L(bw), L(bh));
      ctx.fillStyle = PAPER_SLIP; ctx.fillRect(CX(bx), CY(by), L(bw), L(bh));
      if (lb.ruled) { ctx.strokeStyle = GRAPHITE; ctx.lineWidth = L(0.09); ctx.strokeRect(CX(bx + 0.12), CY(by + 0.12), L(bw - 0.24), L(bh - 0.24)); }
      const D = lb.D; ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, CX(lb.cx) - D.w * s / 2, CY(lb.cy) - D.h * s / 2, D.w * s, D.h * s);
    }
  }
  // the strip torn off 06's slip: torn top and bottom, 06's paper and print
  const STRIP_TEX = (() => {
    const k = RC * SLIP_CM, w = STRIP.wpx * k, h = STRIP.hpx * k, [c, x] = mk(w, h), r = rng(1799);
    x.fillStyle = PAPER_SLIP; x.beginPath(); x.moveTo(0, 10 * k);
    for (let i = 0; i <= 40; i++) x.lineTo(w * i / 40, (4 + r() * 16) * k);
    for (let i = 40; i >= 0; i--) x.lineTo(w * i / 40, h - (4 + r() * 16) * k);
    x.closePath(); x.fill();
    for (let i = 0; i < 160; i++) { x.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); x.fillRect(r() * w, (20 + r() * (STRIP.hpx - 40)) * k, (2 + r() * 8) * k, 1); }
    const D = dots16('本日の宿題は', STRIP_TXT.k * k, 1801, INK_RGB);
    x.drawImage(D.c, D.x0, D.y0, D.w, D.h, (STRIP_TXT.x + STRIP_TXT.k) * k, STRIP_TXT.y * k - D.h / 2, D.w, D.h);
    return c;
  })();
  function pin(ctx, x, h, r = 0.6) {
    ctx.fillStyle = 'rgba(18,70,82,0.25)'; ctx.beginPath(); ctx.arc(X(x - 0.25), Y(h - 0.35), L(r), 0, 7); ctx.fill();
    ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(X(x), Y(h), L(r), 0, 7); ctx.fill();
    ctx.fillStyle = rgba(PAPER_RGB, 0.85); ctx.beginPath(); ctx.arc(X(x + r * 0.3), Y(h + r * 0.33), L(r * 0.28), 0, 7); ctx.fill();
  }
  function corkboard(ctx, tt) {
    shadow(ctx, BOARD.x0, BOARD.h0, BOARD.x1, BOARD.h1);
    ctx.drawImage(CORK, X(BOARD.x0), Y(BOARD.h1), L(BOARD.x1 - BOARD.x0), L(BOARD.h1 - BOARD.h0));
    for (const [x, h] of LONE_PINS) pin(ctx, x, h);
    ctx.fillStyle = 'rgba(18,70,82,0.2)'; ctx.fillRect(CX(-0.35), CY(0.45), L(CARD.w), L(CARD.h));
    ctx.drawImage(CARD_TEX, CX(0), CY(0), L(CARD.w), L(CARD.h));
    cardDynamic(ctx, tt);
    ctx.save(); ctx.translate(X(STRIP.x0), Y(STRIP.bot)); ctx.rotate(-STRIP.rot);
    ctx.fillStyle = 'rgba(18,70,82,0.18)'; ctx.fillRect(-L(0.2), -L(STRIP.h) + L(0.28), L(STRIP.w), L(STRIP.h) - L(0.2));
    ctx.drawImage(STRIP_TEX, 0, -L(STRIP.h), L(STRIP.w), L(STRIP.h)); ctx.restore();
    pin(ctx, ...PIN_CARD, 0.45); pin(ctx, ...PIN_STRIP, 0.45);
  }
  const stripToWorld = ([px, py]) => {      // slip px on the strip -> world px (the strip's small rotation about its bottom left)
    const lx = L(px * SLIP_CM), ly = -L(STRIP.h) + L(py * SLIP_CM), c = Math.cos(-STRIP.rot), s = Math.sin(-STRIP.rot);
    return [X(STRIP.x0) + lx * c - ly * s, Y(STRIP.bot) + lx * s + ly * c];
  };

  // ---------- the camera ----------
  // [zoom, x cm, h cm] of the frame's centre; zoom 1 = the whole window
  const cardH = cy => CARD.top - cy, CARD_MX = CARD.x0 + CARD.w / 2;
  const CARD_C = [CARD_MX, cardH(CARD.h / 2)];
  const KF = { K0: [Z0, CARD_MX, 160.0], K0b: [Z0 * 1.05, CARD_MX, 159.6], K1: [7.6, CARD_MX, 156.7], K2: [6.6, CARD_MX, 153.3],
               A: [1.02, 96, 134], B: [1.7, 58, 113], C: [1.70, 79.5, 124.5], C2: [1.74, 79.5, 124.5], D: [2.0, 38, 111], E: [2.52, 38, 112] };
  const FACE = [AN.faceX, AN.faceH];
  const FIELDS_C = [CARD_MX, cardH(12.9)];
  // Version 8 (2026-11-21, the user after the second cut: 「你为什么要一直抖动屏幕？……看着很晕啊」「不是完全不能晃 但是不能晕」;
  // docs/制作约定.md 第六节「整屏运动」, MOTION AUDIT): version 7's camera answered the drums with steps, zoom kicks and dips
  // (13 jolts, 5 large moves in one take). Now the frame never jolts except the one registered whip, the pull to her room on
  // k175; everything else is a slow eased move in one direction, and the beat is carried inside the picture: the 特になし
  // labels (k173, k174), the three 満 slams (1.3x -> 1x on the stamp only, k177-k179), the head turn and look (k183, k184,
  // the crash), the two circles and the strike-out (k188-k189.5), the month going black (k190.5), her words on the glass
  // and, on the fill k196-k198.5, four pencil side lines beside 悲しい and 淋しい (SIDE).
  //   k171-k172  still on the strip and the card (本日の宿題は, 句11 starts printing)
  //   k172-k175  one slow push from the strip and the card's top into 長所 and 短所 (was: a push into 長所 in one beat, then
  //              down to 短所 in one beat)
  //   k175-k176  the whip: the quick pull to the window, log zoom, ease-out, no overshoot, in 11 frames
  //   k176-k179  still (the 満 slams are the beats)
  //   k179-k184  one move to her, the note and the calendar (was: a push to her in four beats, then a one-beat pan)
  //   k184-k191  a 2% drift on the calendar (was: two steps and three kicks)
  //   k191-k198   one move back to her and in to the close-up between the two columns (was: a 3-beat pan and four growing
  //              steps on the fill); still for the last beat (the fill's side lines k198, k198.5) before 08a's crash k200
  const SLOW = f => { f = Math.min(1, Math.max(0, f)); return 0.5 - 0.5 * Math.cos(Math.PI * f); };   // ease in and out
  const PULL = f => { f = Math.min(1, Math.max(0, f)); return 1 - Math.pow(1 - f, 4); };              // the whip: ease-out, no overshoot
  const MOVES = [[T172, T175, 'K0', 'K2', SLOW, 'slow push into 長所 and 短所', FIELDS_C],
                 [T175, T176, 'K2', 'A', PULL, 'whip: quick pull to the window', CARD_C],
                 [T179, T184, 'A', 'C', SLOW, 'to her, the note and the calendar', FACE],
                 [T184, T191, 'C', 'C2', SLOW, 'drift on the calendar', FACE],
                 [T191, K(198), 'C2', 'E', SLOW, 'back to her and in to the close-up', FACE]];
  for (const [a, b, , , , name] of MOVES) move(S, name, a, b);
  const WHIPS = [[T175, 'quick pull from her card to her room (the one transition of the take)']];
  function camCm(tt) {
    let cur = [KF.K0[0], X(KF.K0[1]), Y(KF.K0[2])];
    for (const [a, b, k0, k1, fn, , tgt] of MOVES) {
      if (tt < a) break;
      const e = fn((tt - a) / (b - a));
      const [z0, x0, h0] = KF[k0], [z1, x1, h1] = KF[k1];
      // camLerp keeps the target point travelling straight on screen while the zoom changes evenly
      cur = camLerp(z0, [X(x0), Y(h0)], z1, [X(x1), Y(h1)], e, [X(tgt[0]), Y(tgt[1])]);
    }
    return cur;
  }

  // ---------- print helpers ----------
  // The halftone screen: per cell of `pitch` world px a dot in the centre and one on the corners (each `cover` of the cell),
  // on a 15-degree grid, anchored in world space so it scales with the camera. Version 6 (2026-11-21, the 03 review's moire
  // finding checked here: work/seg/07/moire_check07.py): the old tile was one 64 px cell minified 6-13x onto the screen, and
  // canvas patterns are sampled without prefiltering, so the screened frame members shimmered frame to frame in the slow
  // moves. Now, as seg_03.js screen(): the tile (12 x 12 cells, the same dots) is drawn at the size it is shown (its pixel
  // size rounded from the context's current scale), supersampled 4x and box-filtered, so it is sampled about 1:1.
  const scrCache = new Map();
  function screen(ctx, cover = 0.3, pitch = 5, rgb = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 12, tpx = Math.max(12, Math.round(N * pitch * dev));
    const key = `${cover}|${rgb}|${tpx}`;
    let e = scrCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [big, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) for (const o of [0, 0.5]) { bx.beginPath(); bx.arc((i + o) * cell, (j + o) * cell, r, 0, 7); bx.fill(); }
      const src = bx.getImageData(0, 0, B, B).data, [c, x] = mk(tpx, tpx), out = x.createImageData(tpx, tpx), [R0, G0, B0] = rgb;
      for (let y = 0; y < tpx; y++) for (let xx = 0; xx < tpx; xx++) {
        let a = 0; for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) a += src[((y * SS + sy) * B + xx * SS + sx) * 4 + 3];
        const o = (y * tpx + xx) * 4; out.data[o] = R0; out.data[o + 1] = G0; out.data[o + 2] = B0; out.data[o + 3] = Math.round(a / (SS * SS));
      }
      x.putImageData(out, 0, 0);
      e = { p: ctx.createPattern(c, 'repeat') }; scrCache.set(key, e);
    }
    const s = N * pitch / tpx;
    e.p.setTransform(new DOMMatrix().rotateSelf(15).scaleSelf(s, s));
    return e.p;
  }
  const line = (ctx, pts, w = 2.2, color = TEAL) => { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
  const rectCm = (ctx, x0, h0, x1, h1) => { ctx.beginPath(); ctx.rect(X(x0), Y(h1), L(x1 - x0), L(h1 - h0)); };
  function box(ctx, x0, h0, x1, h1, { fill = PAPER, stroke = TEAL, w = 2.2, scr = null } = {}) {
    rectCm(ctx, x0, h0, x1, h1);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (scr) { ctx.fillStyle = screen(ctx, scr[0], scr[1]); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); }
  }
  const font = (ctx, f, size) => { ctx.font = f.replace('#', size); };
  // a thing hung on the wall casts a small hard teal shadow down-left (the window light comes from our side and above)
  function shadow(ctx, x0, h0, x1, h1) { ctx.fillStyle = 'rgba(18,70,82,0.16)'; rectCm(ctx, x0 - 0.7, h0 - 0.9, x1 - 0.7, h1 - 0.9); ctx.fill(); }
  // her pencil: glyphs rasterised at RES x and drawn down, so the words stay sharp in the close-up
  function penChar(ctx, ch, cx, cy, size, age, rot = 0, pen = PEN) {
    // pen.char shows a sung letter by sungBuild (55% on the frame before the onset's frame, whole on it); no tt >= t gate here
    if (sungBuild(age) <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(1 / RES, 1 / RES); pen.char(ctx, ch, 0, 0, size * RES, age, rot); ctx.restore();
  }
  function penLine(ctx, chars, x, y, size, tt, step = 1.02) { chars.forEach(([c, t], i) => penChar(ctx, c, x + size * (i + 0.5) * step, y, size, tt - t)); }
  const penLineBox = (n, x, y, size, step = 1.02) => [x, y - size * 0.62, size * n * step, size * 1.24];
  function penColumn(ctx, chars, x, y0, size, tt, pen = PEN) { for (const p of vertical(chars, x, y0, size, 1.04)) penChar(ctx, p.c, p.x, p.y, p.size, tt - p.t, p.rot, pen); }
  const penColumnBox = (n, x, y0, size) => [x - size * 0.6, y0, size * 1.2, size * n * 1.04];

  // ---------- textures (built once) ----------
  // the round 満 stamp: a ring and the 16-dot 満 in pencil black, the ink a little broken by the paper
  function stampTex(seed) {
    const d = L(12) * RES, [c, x] = mk(d + 8, d + 8), r = rng(seed);
    x.strokeStyle = rgba(INK_RGB, 1); x.lineWidth = d * 0.06; x.beginPath(); x.arc(c.width / 2, c.height / 2, d * 0.46, 0, 7); x.stroke();
    const D = dots16('満', d * 0.62 / 16, seed, INK_RGB); x.drawImage(D.c, D.x0, D.y0, D.w, D.h, c.width / 2 - D.w / 2, c.height / 2 - D.h / 2, D.w, D.h);
    x.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(0,0,0,${0.2 + r() * 0.5})`; x.fillRect(r() * c.width, r() * c.height, 1 + r() * 4, 1 + r() * 2); }
    return c;
  }
  const STAMP_TEX = [stampTex(71), stampTex(72), stampTex(73)];
  // x, h, size factor (x 12 cm): right to left along one line that ends at her, each nearer and a little larger
  const STAMP_AT = { books: [178, 127, 1.3], lamp: [142, 116.5, 1.36], clock: [85, 94, 1.4] };
  const STAMP_ROT = [-0.12, 0.08, -0.05];
  const STAMP_SLAM = [1.3, 1.13, 1.04];                                // the slam's scale on the beat frame and the two after it
  function stamp(ctx, i, tt) {
    const [t, where] = STAMPS[i]; if (tt < t) return;
    // version 7 (rhythm): each 満 slams down from the beat frame: 1.3x -> 1.0x in three frames (STAMP_SLAM), with the picture's dip
    const fr = Math.floor((tt - t) / FR + 1e-6), slam = fr < STAMP_SLAM.length ? STAMP_SLAM[fr] : 1;
    const [x, h, f] = STAMP_AT[where], c = STAMP_TEX[i], s = f * slam / RES;
    ctx.save(); ctx.globalAlpha = 0.92; ctx.translate(X(x), Y(h)); ctx.rotate(STAMP_ROT[i]); ctx.drawImage(c, -c.width * s / 2, -c.height * s / 2, c.width * s, c.height * s); ctx.restore();
  }
  // a silhouette of a drawing (its shadow on the pillow)
  const silCache = new Map();
  function silhouette(im) {
    if (silCache.has(im)) return silCache.get(im);
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = 'rgba(18,70,82,1)'; x.fillRect(0, 0, c.width, c.height);
    silCache.set(im, c); return c;
  }
  // her chest card: her_card.js's face warped once per drawing into its holder window (HOLDER), at HOLD_SS px per drawing px.
  // unit square (s, t) -> the window quad [TL, TR, BR, BL] (Heckbert's projective map) and back
  function unitToQuad([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
    const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dx2 * dy1;
    const gg = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
    return [x1 - x0 + gg * x1, x3 - x0 + hh * x3, x0, y1 - y0 + gg * y1, y3 - y0 + hh * y3, y0, gg, hh, 1];
  }
  function inv3([a, b, c, d, e, f, gg, hh, i]) {
    const A = e * i - f * hh, B = -(d * i - f * gg), C = d * hh - e * gg, det = a * A + b * B + c * C;
    return [A / det, -(b * i - c * hh) / det, (b * f - c * e) / det, B / det, (a * i - c * gg) / det, -(a * f - c * d) / det, C / det, -(a * hh - b * gg) / det, (a * e - b * d) / det];
  }
  // the window's visible part of the card, in card fractions: [x0, x1] of its width, [y0, y1] of its height
  const holderView = q => {
    const ww = (Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) + Math.hypot(q[2][0] - q[3][0], q[2][1] - q[3][1])) / 2;
    const wh = (Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]) + Math.hypot(q[2][0] - q[1][0], q[2][1] - q[1][1])) / 2;
    const A = CARD_RATIO * CARD_STRETCH, Rw = ww / wh;
    return { ww, wh, vx: Rw >= A ? [0, 1] : [0.5 - Rw / A / 2, 0.5 + Rw / A / 2], vy: Rw >= A ? [0.5 - A / Rw / 2, 0.5 + A / Rw / 2] : [0, 1] };
  };
  const HOLDER_FACE = {};
  for (const [key, Hd] of Object.entries(HOLDER)) {
    const im = IMG[ART[key]], q = Hd.q, { ww, wh, vx, vy } = holderView(q), Hi = inv3(unitToQuad(q)), SS = HOLD_SS;
    const bx0 = Math.floor(Math.min(...q.map(p => p[0]))) - 1, by0 = Math.floor(Math.min(...q.map(p => p[1]))) - 1;
    const bw = Math.ceil(Math.max(...q.map(p => p[0]))) + 2 - bx0, bh = Math.ceil(Math.max(...q.map(p => p[1]))) + 2 - by0;
    const U = Math.ceil(ww * SS / (vx[1] - vx[0])), UH = U / CARD_RATIO, face = herCardFace(U, { state: 'title' });
    const fd = face.getContext('2d').getImageData(0, 0, face.width, face.height).data, FW = face.width, FH = face.height;
    const sd = im.getContext('2d').getImageData(bx0, by0, bw, bh).data;  // the drawing under it (her hand stays on top)
    const [c, x] = mk(bw * SS, bh * SS), od = x.createImageData(c.width, c.height), o = od.data, [GR, GG, GB] = Hd.grey, r = Hd.r;
    for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {
      const X0 = bx0 + (px + 0.5) / SS, Y0 = by0 + (py + 0.5) / SS, w = Hi[6] * X0 + Hi[7] * Y0 + Hi[8];
      const s = (Hi[0] * X0 + Hi[1] * Y0 + Hi[2]) / w, t = (Hi[3] * X0 + Hi[4] * Y0 + Hi[5]) / w;
      const ds = Math.min(s, 1 - s) * ww, dt = Math.min(t, 1 - t) * wh;   // distance to the window's edges, drawing px
      if (ds <= -1 || dt <= -1) continue;
      const dist = ds < r && dt < r ? r - Math.hypot(r - ds, r - dt) : Math.min(ds, dt);
      const cov = Math.max(0, Math.min(1, dist * SS + 0.5)); if (!cov) continue;
      const si = (Math.min(bh - 1, Math.floor(Y0) - by0) * bw + Math.min(bw - 1, Math.floor(X0) - bx0)) * 4;
      if (sd[si + 3] > 40 && sd[si] > 150 && sd[si] - sd[si + 2] > 25 && sd[si] >= sd[si + 1]) continue;   // skin
      // the face, bilinear, over the holder's grey (which shows through the clip slot and the face's own rounded corners)
      const fx = Math.max(0, Math.min(FW - 1.001, (vx[0] + s * (vx[1] - vx[0])) * U - 0.5)), fy = Math.max(0, Math.min(FH - 1.001, (vy[0] + t * (vy[1] - vy[0])) * UH - 0.5));
      const ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy, i00 = (iy * FW + ix) * 4, i10 = i00 + 4, i01 = i00 + FW * 4, i11 = i01 + 4;
      const smp = k => (fd[i00 + k] * (1 - ax) + fd[i10 + k] * ax) * (1 - ay) + (fd[i01 + k] * (1 - ax) + fd[i11 + k] * ax) * ay;
      const fa = smp(3) / 255, oi = (py * c.width + px) * 4;
      // the face's pixels are premultiplied-free RGBA from getImageData: weight its colour by its alpha per sample
      const pr = (fd[i00] * fd[i00 + 3] * (1 - ax) + fd[i10] * fd[i10 + 3] * ax) * (1 - ay) + (fd[i01] * fd[i01 + 3] * (1 - ax) + fd[i11] * fd[i11 + 3] * ax) * ay;
      const pg = (fd[i00 + 1] * fd[i00 + 3] * (1 - ax) + fd[i10 + 1] * fd[i10 + 3] * ax) * (1 - ay) + (fd[i01 + 1] * fd[i01 + 3] * (1 - ax) + fd[i11 + 1] * fd[i11 + 3] * ax) * ay;
      const pb = (fd[i00 + 2] * fd[i00 + 3] * (1 - ax) + fd[i10 + 2] * fd[i10 + 3] * ax) * (1 - ay) + (fd[i01 + 2] * fd[i01 + 3] * (1 - ax) + fd[i11 + 2] * fd[i11 + 3] * ax) * ay;
      o[oi] = pr / 255 + GR * (1 - fa); o[oi + 1] = pg / 255 + GG * (1 - fa); o[oi + 2] = pb / 255 + GB * (1 - fa); o[oi + 3] = Math.round(255 * cov);
    }
    x.putImageData(od, 0, 0);
    HOLDER_FACE[key] = { c, box: [bx0, by0, bw, bh], vy, U };
  }
  // paper fibres of the wall, once
  const FIBRES = (() => { const r = rng(707), out = []; for (let i = 0; i < 1400; i++) out.push([r() * 192, 80 + r() * 108, 0.2 + r() * 0.9, 0.02 + r() * 0.03]); return out; })();
  // 句12 on the month's slogan banner: one 16-dot character at a time as sung, one line of ten, large enough to read on a phone
  // the tag sits on the left glass and the ten characters all on the right glass, clear of the meeting stiles (x 92..98)
  const BAN = { x0: 74, x1: 180.5, h0: 166, h1: 178.5, tagW: 17, cell: 8.0, tx0: 98.6 };
  BAN.k = L(BAN.cell) / 16; BAN.cx0 = BAN.tx0; BAN.hc = (BAN.h0 + BAN.h1) / 2;
  const L12_D = L12.map(([c], i) => dots16(c, BAN.k * RES, 610 + i, INK_RGB));
  const l12Pos = i => [X(BAN.cx0 + BAN.cell * (i + 0.5)), Y(BAN.hc)];

  // ---------- the room ----------
  // window: outer frame x 0..192 (members 4.5 wide), h 83..188; sashes: left x 4.5..98, right 92..187.5; glass h 88.5..180
  const SASH_L = [4.5, 98], SASH_R = [92, 187.5], GLASS_H = [88.5, 180], STILE = 3.2;

  function wall(ctx) {
    box(ctx, 4.5, 80, 187.5, 184, { fill: PAPER, stroke: null });
    for (const [x, h, w, a] of FIBRES) { ctx.fillStyle = rgba(FIBRE_RGB, a); ctx.fillRect(X(x), Y(h), L(w), 1.2); }
    line(ctx, [[X(4.5), Y(181.5)], [X(187.5), Y(181.5)]], 1.6);
  }
  function banner(ctx, tt) {
    shadow(ctx, BAN.x0, BAN.h0, BAN.x1, BAN.h1);
    box(ctx, BAN.x0, BAN.h0, BAN.x1, BAN.h1, { fill: PAPER, w: 2.4 });
    ctx.fillStyle = TEAL; rectCm(ctx, BAN.x0, BAN.h0, BAN.x0 + BAN.tagW, BAN.h1); ctx.fill();
    ctx.fillStyle = PAPER; font(ctx, '700 #px ZenKakuB', L(2.7)); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('今月の目標', X(BAN.x0 + BAN.tagW / 2), Y(BAN.hc));
    line(ctx, [[X(BAN.x0 + BAN.tagW + 0.8), Y(BAN.h0 + 0.9)], [X(BAN.x1 - 0.8), Y(BAN.h0 + 0.9)]], 1.2);
    L12.forEach(([, t], i) => { if (sungBuild(tt - t) < 1) return; const D = L12_D[i], [x, y] = l12Pos(i);
      ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, x - D.w / RES / 2, y - D.h / RES / 2, D.w / RES, D.h / RES); });
    pin(ctx, BAN.x0 + 1.4, BAN.h1 - 1.4, 0.5); pin(ctx, BAN.x1 - 1.4, BAN.h1 - 1.4, 0.5);
  }
  // the calendar: June 2026 (starts on a Monday), 36 x 54 cm at x 96..131.8, h 98..151.8; laid out on a 28 x 42 grid scaled 1.28
  const CAL = { x0: 96, h0: 98, s: 1.28 };
  const cu = u => CAL.x0 + u * CAL.s, cv = v => CAL.h0 + v * CAL.s;          // layout units -> cm
  CAL.x1 = cu(28); CAL.h1 = cv(42); CAL.gx0 = cu(0.6); CAL.gx1 = cu(27.4); CAL.gh0 = cv(8); CAL.gh1 = cv(28);
  const cellW = (CAL.gx1 - CAL.gx0) / 7, cellH = (CAL.gh1 - CAL.gh0) / 5;
  const cellOf = d => [CAL.gx0 + (d % 7) * cellW, CAL.gh1 - Math.floor(d / 7 + 1) * cellH];   // day d (1..30) -> its cell's left-bottom
  const CIRCLES = [[9, T188], [25, T188h]];
  const CAL_SIZE = { l14: L(2.85 * CAL.s), l15: L(2.75 * CAL.s) };
  const L14_X = X(cu(1.9)), L14_Y = Y(cv(38.9)), L15_X = X(cu(6.3)), L15_Y = Y(cv(4));
  const L15A = L15.slice(0, 3), L15B = L15.slice(3);              // 時々に | いや毎日
  function calendar(ctx, tt) {
    const s = CAL.s;
    ctx.strokeStyle = TEAL; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X(cu(10)), Y(CAL.h1)); ctx.lineTo(X(cu(14)), Y(cv(45.2))); ctx.lineTo(X(cu(18)), Y(CAL.h1)); ctx.stroke();
    ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(X(cu(14)), Y(cv(45.2)), L(0.6), 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(18,70,82,0.16)'; rectCm(ctx, CAL.x0 + 0.6, CAL.h0 - 0.7, CAL.x1 + 0.6, CAL.h1 - 0.7); ctx.fill();
    box(ctx, CAL.x0, CAL.h0, CAL.x1, CAL.h1, { fill: PAPER, w: 2.4 });
    ctx.fillStyle = TEAL; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    font(ctx, '700 #px ZenKakuB', L(4.2 * s)); ctx.fillText('6', X(cu(2.0)), Y(cv(32.6))); font(ctx, '700 #px ZenKakuB', L(2.2 * s)); ctx.fillText('月', X(cu(4.8)), Y(cv(31.9)));
    font(ctx, '500 #px ZenKaku', L(1.5 * s)); ctx.textAlign = 'right'; ctx.fillText('2026', X(cu(27.2)), Y(cv(32.2)));
    ctx.textAlign = 'center'; font(ctx, '700 #px ZenKakuB', L(1.25 * s));
    '日月火水木金土'.split('').forEach((c, i) => ctx.fillText(c, X(CAL.gx0 + (i + 0.5) * cellW), Y(cv(29.2))));
    ctx.strokeStyle = TEAL; ctx.lineWidth = 1.5;
    for (let i = 0; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(X(CAL.gx0 + i * cellW), Y(CAL.gh0)); ctx.lineTo(X(CAL.gx0 + i * cellW), Y(CAL.gh1)); ctx.stroke(); }
    for (let j = 0; j <= 5; j++) { ctx.beginPath(); ctx.moveTo(X(CAL.gx0), Y(CAL.gh0 + j * cellH)); ctx.lineTo(X(CAL.gx1), Y(CAL.gh0 + j * cellH)); ctx.stroke(); }
    font(ctx, '500 #px ZenKaku', L(1.05 * s)); ctx.textAlign = 'left';
    for (let d = 1; d <= 30; d++) { const [cx, ch] = cellOf(d); ctx.fillText(String(d), X(cx + 0.35 * s), Y(ch + cellH - 0.75 * s)); }
    line(ctx, [[X(CAL.gx0), Y(cv(7.4))], [X(CAL.gx1), Y(cv(7.4))]], 1.4);
    line(ctx, [[X(cu(6)), Y(cv(1.5))], [X(cu(27.2)), Y(cv(1.5))]], 1.1);
    ctx.fillStyle = TEAL; rectCm(ctx, cu(0.6), cv(4.6), cu(5.2), cv(6.8)); ctx.fill(); ctx.fillStyle = PAPER; font(ctx, '700 #px ZenKakuB', L(1.2 * s)); ctx.fillText('メモ', X(cu(1)), Y(cv(5.7)));
    penLine(ctx, L14, L14_X, L14_Y, CAL_SIZE.l14, tt, 1.0);
    penLine(ctx, L15A, L15_X, L15_Y, CAL_SIZE.l15, tt, 1.0);
    penLine(ctx, L15B, L15_X + CAL_SIZE.l15 * 3.15, L15_Y, CAL_SIZE.l15, tt, 1.0);
    // two small circles: 'sometimes'
    for (const [d, t] of CIRCLES) if (tt >= t) {
      const [cx, ch] = cellOf(d), u = Math.min(1, (tt - t) / (3 * FR));
      ctx.strokeStyle = PENCIL; ctx.lineWidth = L(0.3 * s); ctx.lineCap = 'round'; ctx.beginPath();
      for (let k = 0; k <= 40 * u; k++) { const a = -1.2 + k / 40 * Math.PI * 2.15, rr = L(1.15 * s) * (1 + 0.05 * Math.sin(k * 0.7 + d)); const px = X(cx + cellW / 2 + 0.2) + Math.cos(a) * rr, py = Y(ch + cellH / 2 - 0.25) + Math.sin(a) * rr * 0.9; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke();
    }
    // 時々に struck out, a pencil line drawn in three frames
    if (tt >= T189h) { const u = Math.min(1, (tt - T189h) / (3 * FR)); line(ctx, [[L15_X - L(0.4), L15_Y + L(0.2)], [L15_X - L(0.4) + (CAL_SIZE.l15 * 3.1 + L(0.8)) * u, L15_Y - L(0.15) * u]], L(0.36), PENCIL); }
    // all thirty days solid pencil black, in one beat
    if (tt >= TBLACK) {
      const a = Math.min(1, (tt - TBLACK) / (2 * FR) + 0.34);
      for (let d = 1; d <= 30; d++) {
        const [cx, ch] = cellOf(d), r = rng(300 + d);
        ctx.fillStyle = PENCIL_FILL.replace('0.95', String(0.95 * a)); rectCm(ctx, cx + 0.14, ch + 0.14, cx + cellW - 0.14 + (r() - 0.5) * 0.36, ch + cellH - 0.14 + (r() - 0.5) * 0.24); ctx.fill();
        ctx.strokeStyle = `rgba(120,120,130,${0.22 * a})`; ctx.lineWidth = L(0.09);
        for (let k = 0; k < 3; k++) { const yy = ch + 0.7 + r() * (cellH - 1.4); ctx.beginPath(); ctx.moveTo(X(cx + 0.6), Y(yy)); ctx.lineTo(X(cx + cellW - 0.7), Y(yy + 0.36)); ctx.stroke(); }
      }
    }
  }
  function deskLamp(ctx) {
    // the desk itself is below the sill; only the lamp rises above it: base arm, elbow, shade (the same lamp as 13 C)
    line(ctx, [[X(136), Y(84)], [X(133.5), Y(104)], [X(141), Y(114)]], 2.6);
    ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(X(133.5), Y(104), L(0.8), 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(X(137), Y(113)); ctx.lineTo(X(145.5), Y(121.5)); ctx.lineTo(X(149), Y(113.5)); ctx.lineTo(X(144.5), Y(110)); ctx.closePath();
    ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = screen(ctx, 0.32, 5); ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.6; ctx.stroke();
  }
  function bookshelf(ctx) {
    box(ctx, 162, 84, 187.5, 152, { fill: PAPER, w: 2.4 });
    const r = rng(551);
    for (const [h0, h1] of [[86, 108], [109.5, 129.5], [131, 150.5]]) {
      line(ctx, [[X(162), Y(h0 - 0.8)], [X(187.5), Y(h0 - 0.8)]], 2.0);
      let x = 163; while (x < 186) {
        const w = 1.6 + r() * 2.4, hh = (h1 - h0) * (0.62 + r() * 0.34); if (x + w > 186.6) break;
        box(ctx, x, h0, x + w, h0 + hh, { fill: PAPER, w: 1.4, scr: r() < 0.35 ? [0.3 + r() * 0.2, 5] : null });
        if (r() < 0.5) line(ctx, [[X(x + 0.3), Y(h0 + hh - 1.6)], [X(x + w - 0.3), Y(h0 + hh - 1.6)]], 1.0);
        x += w + 0.15;
      }
    }
  }
  // the alarm clock on the inner sill, near her knees (the third 満): a round body on two feet, two bells and a hammer
  function alarmClock(ctx) {
    const cx = 85, ch = 93.6, r = 4.6;
    for (const sgn of [-1, 1]) {                                        // bells
      ctx.beginPath(); ctx.arc(X(cx + sgn * 3.3), Y(ch + 4.1), L(2.0), 0, 7); ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = screen(ctx, 0.4, 5); ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.2; ctx.stroke();
      line(ctx, [[X(cx + sgn * 2.6), Y(ch - 3.4)], [X(cx + sgn * 3.6), Y(ch - 5.4)]], 2.4);   // feet
    }
    line(ctx, [[X(cx), Y(ch + r)], [X(cx), Y(ch + r + 1.6)]], 2.2);
    ctx.beginPath(); ctx.arc(X(cx), Y(ch), L(r), 0, 7); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(X(cx), Y(ch), L(r * 0.78), 0, 7); ctx.lineWidth = 1.2; ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(ctx, [[X(cx) + Math.sin(a) * L(r * 0.62), Y(ch) - Math.cos(a) * L(r * 0.62)], [X(cx) + Math.sin(a) * L(r * 0.72), Y(ch) - Math.cos(a) * L(r * 0.72)]], 1.2); }
    line(ctx, [[X(cx), Y(ch)], [X(cx + 1.9), Y(ch + 1.2)]], 2.0); line(ctx, [[X(cx), Y(ch)], [X(cx - 0.6), Y(ch + 2.9)]], 1.6);
  }
  function lesPaul(ctx) {
    // standing in its stand on a low chest behind the sill (hidden): the gold top's upper half above the sill (its body runs
    // h 62..104, so 18.5 of its 42 cm show), the neck and the headstock rising to h 157.5
    const s = L(99) / (LP.height * 0.93), w = LP.width * s, h = LP.height * s;
    ctx.drawImage(LP, X(154) - w / 2, Y(159.5), w, h);
  }
  function pillow(ctx, rinIm) {
    // a big plump pillow standing against the left wall, her back pressed into it: x 4.5..29, h 84..125; puffed edges and
    // pulled corners, a seam, a few creases; her shadow on it is a hard, darker shape
    const path = () => { ctx.beginPath(); ctx.moveTo(X(4.5), Y(86));
      ctx.lineTo(X(4.5), Y(121)); ctx.quadraticCurveTo(X(4.8), Y(125.5), X(8.5), Y(124.4));
      ctx.quadraticCurveTo(X(17), Y(126.4), X(25.5), Y(124.2)); ctx.quadraticCurveTo(X(29.6), Y(124.8), X(28.6), Y(120));
      ctx.quadraticCurveTo(X(30.4), Y(104), X(29), Y(86)); ctx.closePath(); };
    path(); ctx.fillStyle = PAPER; ctx.fill();
    ctx.save(); path(); ctx.clip();
    ctx.fillStyle = screen(ctx, 0.08, 5); ctx.fillRect(X(4.5), Y(127), L(26), L(42));
    const sil = silhouette(rinIm); ctx.globalAlpha = 0.34;
    ctx.save(); ctx.translate(L(-2.4), L(1.3)); drawImageAt(ctx, plOf(rinIm), sil); ctx.restore();   // her shadow: her drawing's placement, moved down-left
    ctx.restore();
    path(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.8; ctx.stroke();
    ctx.save(); ctx.globalAlpha = 0.8;
    line(ctx, [[X(5.6), Y(119.5)], [X(9.6), Y(122.4)]], 1.4); line(ctx, [[X(27.4), Y(119.8)], [X(24.6), Y(122.6)]], 1.4);
    line(ctx, [[X(7), Y(121.6)], [X(15), Y(122.8)], [X(24), Y(121.8)]], 1.0);
    ctx.restore();
  }
  function rin(ctx, im) {
    const P = plOf(im);
    drawImageAt(ctx, P, im);
    // her card: her_card.js's face, warped into this drawing's holder window (HOLDER_FACE), in the drawing's px through its placement
    const { c, box: [bx0, by0, bw, bh] } = HOLDER_FACE[KEY_OF.get(im)];
    drawPart(ctx, P, x => x.drawImage(c, bx0, by0, bw, bh));
  }
  // the pencil leader line from 最近に／生きていて to her shoulder, k180 -> k180.5, and its note: one thing, faded out together k191-k192
  const LEAD = [[66.0, 122.6], [62.8, 115.6], [58.4, 108.4], [54.6, 104.4]];
  const L13_X = X(64.6), L13_Y1 = Y(131.2), L13_Y2 = Y(126.0), L13_SIZE = L(4.4);
  const L13A = L13.slice(0, 3), L13B = L13.slice(3);                 // 最近に | 生きていて
  const noteAlpha = tt => 1 - smooth((tt - T191) / (T192 - T191));
  function leader(ctx, tt) {
    const a = noteAlpha(tt); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    penLine(ctx, L13A, L13_X, L13_Y1, L13_SIZE, tt, 1.0); penLine(ctx, L13B, L13_X, L13_Y2, L13_SIZE, tt, 1.0);
    if (tt >= T180) {
      const u = smooth(Math.min(1, (tt - T180) / (T180h - T180)));
      const pts = []; const n = 30;
      for (let i = 0; i <= n * u; i++) { const s = i / n, k = Math.min(2, Math.floor(s * 3)), f = s * 3 - k, p0 = LEAD[k], p1 = LEAD[k + 1];
        pts.push([X(p0[0] + (p1[0] - p0[0]) * f), Y(p0[1] + (p1[1] - p0[1]) * f)]); }
      if (pts.length > 1) line(ctx, pts, L(0.34), PENCIL);
      if (u >= 1) {   // two even barbs back along the line's last direction
        const tip = [X(LEAD[3][0]), Y(LEAD[3][1])], from = [X(LEAD[2][0]), Y(LEAD[2][1])];
        const an = Math.atan2(tip[1] - from[1], tip[0] - from[0]), r = L(1.7);
        line(ctx, [[tip[0] - r * Math.cos(an - 0.5), tip[1] - r * Math.sin(an - 0.5)], tip, [tip[0] - r * Math.cos(an + 0.5), tip[1] - r * Math.sin(an + 0.5)]], L(0.34), PENCIL);
      }
    }
    ctx.restore();
  }
  // the glass: faint teal reflections, three diagonals on each sash, and a second group on the left sash behind 句17 (kept
  // clear of her: her drawing's left edge is at x >= 22 cm)
  const REFL = { R: [[SASH_R[0] + 58, 0.5], [SASH_R[0] + 63, 1.4], [SASH_R[0] + 70, 0.4]], L: [[64.5, 0.5], [69.5, 1.4], [76.5, 0.4]] };
  const REFL_L2 = [[7.6, 95, 20.6, 121.5, 0.5], [9.6, 92, 21.2, 115.6, 1.3], [12.4, 91, 21.4, 108.6, 0.4]];
  function reflections(ctx, x0, x1, list, extra = []) {
    ctx.save(); rectCm(ctx, x0 + STILE, GLASS_H[0], x1 - STILE, GLASS_H[1]); ctx.clip();
    ctx.strokeStyle = rgba(TEAL_RGB, 0.42); ctx.lineCap = 'butt';
    for (const [x, w] of list) { ctx.lineWidth = L(w); ctx.beginPath(); ctx.moveTo(X(x), Y(GLASS_H[0])); ctx.lineTo(X(x + 34), Y(GLASS_H[1] - 30)); ctx.stroke(); }
    ctx.lineCap = 'round';
    for (const [ax, ah, bx, bh, w] of extra) { ctx.lineWidth = L(w); ctx.beginPath(); ctx.moveTo(X(ax), Y(ah)); ctx.lineTo(X(bx), Y(bh)); ctx.stroke(); }
    ctx.restore();
  }
  // the window's frame and sashes are the nearest thing to us: a denser screen than anything in the room (the darkest tone
  // after her blazer and the black month)
  function sash(ctx, x0, x1) {
    ctx.fillStyle = PAPER;
    for (const r of [[x0, GLASS_H[0] - 3, x0 + STILE, GLASS_H[1] + 3], [x1 - STILE, GLASS_H[0] - 3, x1, GLASS_H[1] + 3], [x0, GLASS_H[0] - 3, x1, GLASS_H[0]], [x0, GLASS_H[1], x1, GLASS_H[1] + 3]]) {
      rectCm(ctx, ...r); ctx.fill(); ctx.fillStyle = screen(ctx, 0.36, 5); ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.2; ctx.stroke(); ctx.fillStyle = PAPER;
    }
    if (x1 === SASH_L[1]) { ctx.fillStyle = TEAL; rectCm(ctx, x1 - 2.6, 132, x1 - 0.6, 134.5); ctx.fill(); }   // the crescent lock
  }
  function outerFrame(ctx) {
    const parts = [[0, 83, 4.5, 188], [187.5, 83, 192, 188], [0, 183, 192, 188], [0, 83, 192, 85.5]];
    for (const r of parts) { rectCm(ctx, ...r); ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = screen(ctx, 0.5, 5); ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.4; ctx.stroke(); }
    rectCm(ctx, 0, 80, 192, 83.2); ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = screen(ctx, 0.62, 5); ctx.fill();
    rectCm(ctx, 0, 82.2, 192, 84); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2.4; ctx.stroke();
    line(ctx, [[X(0), Y(82.2)], [X(192), Y(82.2)]], 3.2, GRAPHITE);
  }

  // ---------- her words on the glass ----------
  const COL = L(3.8);
  const GL = { l16: { x: 58.2, h: 130 }, l17: { x: 18.2, h: 130 } };
  const WSH = [-1.4, -1.6];                                            // the words' shadow in the room (cm), like the wall things'
  function words(ctx, tt, which, shadowPass) {
    const [chars, spec] = which === 16 ? [L16, GL.l16] : [L17, GL.l17];
    if (shadowPass) penColumn(ctx, chars, X(spec.x + WSH[0]), Y(spec.h + WSH[1]), COL, tt, PEN_SH);
    else penColumn(ctx, chars, X(spec.x), Y(spec.h), COL, tt);
  }

  // Version 8: the fill k196-k198.5 is in her pencil, not in the camera: on each hit one side line (傍線, on the right of a
  // vertical line of text) beside 悲しい and then 淋しい, two each, drawn top to bottom in 3 frames: she means it
  const SIDE = [[T196, 16, 0.70, 'crash'], [K(197), 16, 0.86, 'fill'], [K(198), 17, 0.70, 'fill'], [K(198.5), 17, 0.86, 'fill, half beat']];
  const sideSeg = (which, off) => { const spec = which === 16 ? GL.l16 : GL.l17, x = X(spec.x) + COL * off, y0 = Y(spec.h) + COL * 0.12;
    return [[x, y0], [x + COL * 0.03, y0 + COL * 3 * 1.04 - COL * 0.22]]; };
  for (const [t, which, , why] of SIDE) S.ev(`side line beside ${which === 16 ? '悲しい' : '淋しい'} (${why})`, t, beatOf(t) % 1 ? 'half' : 'beat');
  function sideLines(ctx, tt, shadowPass) {
    for (const [t, which, off] of SIDE) { if (tt < t) continue;
      const u = Math.min(1, (tt - t) / (2 * FR) + 1 / 3), [[x0, y0], [x1, y1]] = sideSeg(which, off);
      const d = shadowPass ? [L(WSH[0]), -L(WSH[1])] : [0, 0];
      line(ctx, [[x0 + d[0], y0 + d[1]], [x0 + (x1 - x0) * u + d[0], y0 + (y1 - y0) * u + d[1]]], L(0.3), shadowPass ? 'rgba(18,70,82,0.10)' : PENCIL);
    }
  }

  function drawWorld(ctx, tt) {
    const im = rinAt(tt);
    wall(ctx);
    corkboard(ctx, tt); banner(ctx, tt); calendar(ctx, tt); bookshelf(ctx); deskLamp(ctx);
    lesPaul(ctx); alarmClock(ctx);
    for (let i = 0; i < STAMPS.length; i++) stamp(ctx, i, tt);
    pillow(ctx, im);
    words(ctx, tt, 17, true); words(ctx, tt, 16, true); sideLines(ctx, tt, true);   // the shadows of the words on the glass fall into the room
    rin(ctx, im);
    leader(ctx, tt);
    reflections(ctx, SASH_R[0], SASH_R[1], REFL.R);
    reflections(ctx, SASH_L[0], SASH_L[1], REFL.L, REFL_L2);
    words(ctx, tt, 17, false); words(ctx, tt, 16, false); sideLines(ctx, tt, false);
    sash(ctx, SASH_R[0], SASH_R[1]);
    sash(ctx, SASH_L[0], SASH_L[1]);
    outerFrame(ctx);
  }

  // ---------- layout registry and audits ----------
  const ID = p => p;
  const cardBox = ([x0, y0, w, h]) => [CX(x0), CY(y0), L(w), L(h)];  // a card-cm box -> world px
  for (const [k, f] of Object.entries(CF)) LAY.reg(`field ${k}`, 'card', cardBox([f[0], f[1], f[2] - f[0], f[3] - f[1]]));
  LAY.reg('photo box', 'card', cardBox([1.2, 2.97, 3.85, 4.71])); LAY.reg('header', 'card', cardBox([0.66, 0.6, 16.88, 1.95]));
  LAY.audit('card fields');
  const tagBox = f => cardBox([f[0], f[1], f[4], TAG_H]);
  LAY.text('句11 in テーマ', 'card:theme', cardBox([L11_X0, L11_Y - L11_CELL * 0.45, L11_CELL * L11.length, L11_CELL * 0.9])); LAY.reg('テーマ tag', 'card:theme', tagBox(CF.theme));
  LAY.audit('テーマ field');
  LAY.text('特になし 長所', 'card:chosho', cardBox(LABELS[0].box)); LAY.reg('長所 tag', 'card:chosho', tagBox(CF.chosho));
  LAY.audit('長所 field');
  LAY.text('特になし 短所', 'card:tansho', cardBox(LABELS[1].box)); LAY.reg('短所 tag', 'card:tansho', tagBox(CF.tansho));
  LAY.audit('短所 field');
  { const p0 = stripToWorld([STRIP_TXT.x, STRIP_TXT.y - STRIP_TXT.k * 7.6]), p1 = stripToWorld([STRIP_TXT.x + 6 * 16 * STRIP_TXT.k, STRIP_TXT.y + STRIP_TXT.k * 7.6]);
    LAY.text('本日の宿題は on the strip', 'strip', [p0[0], Math.min(p0[1], p1[1]), p1[0] - p0[0], Math.abs(p1[1] - p0[1]) + L(0.3)]); }
  LAY.reg('header (not under the strip)', 'strip', cardBox([0.66, 0.6, 16.88, 1.95]));
  LAY.audit('strip over the card');
  // the note and its leader line and arrow are one thing on the wall
  { const nb1 = penLineBox(L13A.length, L13_X, L13_Y1, L13_SIZE, 1.0), nb2 = penLineBox(L13B.length, L13_X, L13_Y2, L13_SIZE, 1.0);
    const lx = LEAD.map(p => X(p[0])), lh = LEAD.map(p => Y(p[1]));
    const x0 = Math.min(nb1[0], nb2[0], ...lx) - L(1.8), x1 = Math.max(nb1[0] + nb1[2], nb2[0] + nb2[2], ...lx) + L(1.8), y0 = nb1[1], y1 = Math.max(...lh) + L(0.6);
    LAY.text('句13 note with its leader and arrow', 'wall', [x0, y0, x1 - x0, y1 - y0]); }
  LAY.reg('cork board', 'wall', [X(BOARD.x0), Y(BOARD.h1), L(BOARD.x1 - BOARD.x0), L(BOARD.h1 - BOARD.h0)]);
  LAY.reg('calendar', 'wall', [X(CAL.x0), Y(CAL.h1 + 4.2), L(CAL.x1 - CAL.x0), L(CAL.h1 + 4.2 - CAL.h0)]);
  LAY.audit('wall: note, cork board and calendar');
  LAY.text('句12 on the banner', 'banner', print16Box('過不足無い不自由無い', X(BAN.cx0 + BAN.cell * 5), Y(BAN.hc), BAN.k));
  LAY.reg('banner tag', 'banner', [X(BAN.x0), Y(BAN.h1), L(BAN.tagW), L(BAN.h1 - BAN.h0)]);
  LAY.reg('banner', 'banner:edge', [X(BAN.x0), Y(BAN.h1), L(BAN.x1 - BAN.x0), L(BAN.h1 - BAN.h0)]);
  LAY.audit('banner');
  { const tb = print16Box('過不足無い不自由無い', X(BAN.cx0 + BAN.cell * 5), Y(BAN.hc), BAN.k);
    if (tb[0] + tb[2] > X(BAN.x1 - 0.8) || tb[1] < Y(BAN.h1) || tb[1] + tb[3] > Y(BAN.h0)) console.warn('AUDIT banner: 句12 runs off the banner');
    if (tb[0] < X(SASH_L[1] + 0.4)) console.warn('AUDIT banner: 句12 runs under the meeting stiles'); }
  LAY.text('句14', 'cal', penLineBox(L14.length, L14_X, L14_Y, CAL_SIZE.l14, 1.0));
  LAY.text('句15 時々に', 'cal', penLineBox(3, L15_X, L15_Y, CAL_SIZE.l15, 1.0));
  LAY.text('句15 いや毎日', 'cal', penLineBox(4, L15_X + CAL_SIZE.l15 * 3.15, L15_Y, CAL_SIZE.l15, 1.0));
  LAY.reg('memo label', 'cal', [X(cu(0.6)), Y(cv(6.8)), L(4.6 * CAL.s), L(2.2 * CAL.s)]);
  LAY.reg('6月 header', 'cal', [X(cu(1.8)), Y(cv(35.4)), L(25.6 * CAL.s), L(4.8 * CAL.s)]);
  LAY.reg('grid', 'cal', [X(CAL.gx0), Y(CAL.gh1 + 2.4 * CAL.s), L(CAL.gx1 - CAL.gx0), L(CAL.gh1 + 2.4 * CAL.s - CAL.gh0)]);
  LAY.audit('calendar');
  if (L14_X - CAL_SIZE.l14 * 0.1 < X(SASH_L[1])) console.warn('AUDIT calendar: 句14 starts under the meeting stiles');
  const colBox = (chars, spec) => penColumnBox(chars.length, X(spec.x), Y(spec.h), COL);
  LAY.text('句16', 'glass', colBox(L16, GL.l16)); LAY.text('句17', 'glass17', colBox(L17, GL.l17));
  // her head (hair included) in the look and say drawings, measured: x 26..53 cm, h 104..130 cm (r07c: hair x 26.7..50.8, h 107.5..129.7)
  const headBox = [X(25.6), Y(130.2), L(27.6), L(26.4)];
  LAY.reg('her head', 'glass', headBox); LAY.reg('her head', 'glass17', headBox);
  for (const which of [16, 17]) { const ps = SIDE.filter(sd => sd[1] === which).flatMap(([, , off]) => sideSeg(which, off)), w = L(0.3);
    const x0 = Math.min(...ps.map(p => p[0])) - w, x1 = Math.max(...ps.map(p => p[0])) + w, y0 = Math.min(...ps.map(p => p[1])) - w, y1 = Math.max(...ps.map(p => p[1])) + w;
    LAY.reg(`side lines ${which}`, which === 16 ? 'glass' : 'glass17', [x0, y0, x1 - x0, y1 - y0]); }
  LAY.audit('her words and her head');
  // her card in the holder: every printed line, label, corner mark, timing mark and the clip slot inside the window's view of
  // the card (the window crops the face's top and bottom by HOLDER_FACE.vy)
  for (const [key, { vy, U }] of Object.entries(HOLDER_FACE)) {
    const { lines, labels } = herCardBoxes(U, { state: 'title' }), hh = U / CARD_RATIO, y0 = vy[0] * hh, y1 = vy[1] * hh;
    const marks = { 'corner marks': [U * 0.035, U * 0.035, U * 0.93, U * 0.595], 'timing marks': [U * 0.229, U * 0.618, U * 0.624, U * 0.026], 'clip slot': [U * 0.4, U * 0.022, U * 0.2, U * 0.028] };
    const all = { ...lines, ...labels, ...marks }, out = Object.entries(all).filter(([, b]) => b[1] < y0 - 0.5 || b[1] + b[3] > y1 + 0.5).map(([n]) => n);
    console.log(`AUDIT her card in the holder (${key}): visible y ${(vy[0] / CARD_RATIO).toFixed(3)}u-${(vy[1] / CARD_RATIO).toFixed(3)}u; ${Object.keys(all).length} boxes, ${out.length} outside${out.length ? ': ' + out.join(', ') : ''}`);
    if (out.length) console.warn(`AUDIT her card in the holder (${key}): ${out.join(', ')} cut by the window`);
  }
  const viewsOf = (a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy] = camCm(t); return { t, ...view(z, fx, fy) }; });
  LAY.frameCheck('句11 in テーマ k171.56-k175', { sheets: { 'card:theme': ID }, views: viewsOf(L11[0][1], T175) });
  LAY.frameCheck('特になし 長所 k173-k175', { sheets: { 'card:chosho': ID }, views: viewsOf(T173, T175) });
  LAY.frameCheck('特になし 短所 k174-k175', { sheets: { 'card:tansho': ID }, views: viewsOf(T174, T175) });
  LAY.frameCheck('strip k171-k172 (then it may leave with the push)', { sheets: { strip: ID }, views: viewsOf(SEG[0], T172 + FR) });
  LAY.frameCheck('banner k176-k179 (句12 is sung k175.4-k179.1; it leaves the frame top with the push)', { sheets: { banner: ID }, views: viewsOf(T176, L12[L12.length - 1][1] + 2 * FR) });
  LAY.frameCheck('note and leader k179.45-k192 (until faded out)', { sheets: { wall: ID }, views: viewsOf(L13[0][1], T192) });
  LAY.frameCheck('calendar k184-k191', { sheets: { cal: ID }, views: viewsOf(T184, T191) });
  LAY.frameCheck('句16 on the glass', { sheets: { glass: ID }, views: viewsOf(L16[0][1], L17[0][1]) });
  LAY.frameCheck('句16 and 句17 on the glass', { sheets: { glass: ID, glass17: ID }, views: viewsOf(L17[0][1], SEG[1]) });
  // LYRIC AUDIT (docs/制作约定.md 第六节): every sung character must read on the frame its onset falls in. A character reads
  // on the first frame from its onset's frame on (16-dot prints and pencil letters are whole from that frame: sungBuild) on
  // which its centre is inside the frame by half its size (and, for 句13, the note is not fading out)
  { const sung = [];
    const add = (chars, pos, size, extra = () => true) => chars.forEach(([c, t], i) => sung.push({ c, t, p: pos(i), size, extra }));
    add(L11, i => [CX(L11_X0 + (i + 0.5) * L11_CELL), CY(L11_Y)], L(L11_CELL));
    add(L12, l12Pos, L(BAN.cell));
    const fade = tt => noteAlpha(tt) > 0.5;
    add(L13A, i => [L13_X + L13_SIZE * (i + 0.5), L13_Y1], L13_SIZE, fade); add(L13B, i => [L13_X + L13_SIZE * (i + 0.5), L13_Y2], L13_SIZE, fade);
    add(L14, i => [L14_X + CAL_SIZE.l14 * (i + 0.5), L14_Y], CAL_SIZE.l14);
    add(L15A, i => [L15_X + CAL_SIZE.l15 * (i + 0.5), L15_Y], CAL_SIZE.l15); add(L15B, i => [L15_X + CAL_SIZE.l15 * (3.15 + i + 0.5), L15_Y], CAL_SIZE.l15);
    for (const [chars, spec] of [[L16, GL.l16], [L17, GL.l17]]) { const v = vertical(chars, X(spec.x), Y(spec.h), COL, 1.04); add(chars, i => [v[i].x, v[i].y], COL); }
    const entries = sung.map(({ c, t, p: [wx, wy], size, extra }) => {
      let readT = null;
      for (let k = 0; k < 12 && readT === null; k++) {
        const tt = onsetFrameTime(t) + k * FR; if (tt < SEG[0] - 1e-6 || tt >= SEG[1]) continue;
        const { z, fx, fy } = view(...camCm(tt)), sx = (wx - fx) * z + W / 2, sy = (wy - fy) * z + 540, m = size * z / 2;
        if (sx - m >= 0 && sx + m <= W && sy - m >= 0 && sy + m <= 1080 && extra(tt)) readT = tt;
      }
      return { c, t, readT };
    });
    window.__lyricAudit = lyricAudit('seg_07', entries); }
  S.finish();
  // her card's window on the screen, per frame from k175 (for the phone-size check, docs/卡面状態.md 第四节): the bbox of its
  // four corners in 1920 x 1080 px, and whether it is inside the frame
  const herCardScreen = frameTimes(SEG[0], T175, SEG[1]).map(t => {
    const im = rinAt(t), key = KEY_OF.get(im), P = PL[key], { z, fx, fy } = view(...camCm(t));
    const pts = HOLDER[key].q.map(p => P.toWorld(p)).map(([wx, wy]) => [(wx - fx) * z + W / 2, (wy - fy) * z + 540]);
    const x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
    return { g: Math.round(t * 30), drawing: key, box: [x0, y0, x1 - x0, y1 - y0].map(v => +v.toFixed(1)), inFrame: x1 > 0 && x0 < W && y1 > 0 && y0 < 1080, whole: x0 >= 0 && x1 <= W && y0 >= 0 && y1 <= 1080 };
  });
  // MOTION AUDIT (docs/制作约定.md 第六节「整屏运動」): every rendered frame's view as shown; the first frame is the cut from 06
  const MOTION_R = motionAudit('seg_07', frameTimes(SEG[0], SEG[0], SEG[1]).map((t, i) => ({ t, ...view(...camCm(t)), cut: i === 0 })), { whips: WHIPS });
  // PART AUDIT: her card face is warped through the window quad measured on each drawing; on the drawing's own pixels the quad
  // must sit on the drawn window: 3 px inside each edge the drawing is the window's white (her fingers count as hidden), 1-2 px
  // outside it is the window's drawn outline (not white), and a grid over the inside is white
  { const white = ([r, g, b, a]) => a > 200 && Math.min(r, g, b) >= 240,   // the window is drawn 250+; the holder's bevel highlight 220-232
      notWhite = p => PIX.opaque(p) && !white(p);
    for (const [key, d] of Object.entries(DRAW)) {
      const im = IMG[ART[key]], { q, r } = HOLDER[key], Hm = unitToQuad(q), ww = holderView(q).ww, wh = holderView(q).wh;
      const at = (s, t) => { const w = Hm[6] * s + Hm[7] * t + Hm[8]; return [(Hm[0] * s + Hm[1] * t + Hm[2]) / w, (Hm[3] * s + Hm[4] * t + Hm[5]) / w]; };
      const edge = inset => { const o = []; const m = (r + 4) / ww, mt = (r + 4) / wh, is = inset / ww, it = inset / wh;
        for (let i = 0; i <= 40; i++) { const u = m + (1 - 2 * m) * i / 40, v = mt + (1 - 2 * mt) * i / 40;
          o.push(at(u, is), at(u, 1 - it), at(is, v), at(1 - is, v)); } return o; };
      const grid = []; for (let i = 1; i < 12; i++) for (let j = 1; j < 8; j++) grid.push(at(i / 12, j / 8));
      partAudit('seg_07', d, 'card window: 3 px inside the edges', { image: im, points: edge(3), on: white, hidden: PIX.skin, r: 1 });
      partAudit('seg_07', d, 'card window: its drawn outline 1-2 px outside the edges', { image: im, points: edge(-1.5), on: notWhite, hidden: PIX.skin, r: 1 });
      partAudit('seg_07', d, 'card window: inside grid', { image: im, points: grid, on: white, hidden: PIX.skin, r: 1 });
    } }
  const PARTS_R = partReport('seg_07');
  publishAudit(S, LAY, { blackBeat: BLACK_K, z0: Z0, herCardScreen, lyric: window.__lyricAudit, motion: MOTION_R, parts: PARTS_R });

  window.renderAt = async t => {
    const tt = Math.max(t, SEG[0]);
    shoot(...camCm(tt), ctx => drawWorld(ctx, tt));
  };
  await window.renderAt(P('t0', 64));
}
