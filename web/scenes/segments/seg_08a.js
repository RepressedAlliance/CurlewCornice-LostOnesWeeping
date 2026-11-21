// Segment 08a: the first chorus, first half (k199-k232, frames [2221, 2587)): Demo 2 version 15 (web/scenes/c1a_page.js,
// confirmed by the director 2026-11-20) put back into the film. docs/分镜/08a_副歌1前半.md (第 3 版) and 全片分镜 审查后改定.
// The middle is version 15 exactly; only these differ from it (08a 第 8 节):
//  - 改定 2 (the one-sink budget): 憂鬱 and 正解 are light prints, each whole on the first frame of its beat (憂鬱 is not on the
//    page before k200), with no slam, no camera punch, no shake; the card dropping in on
//    k208 keeps its own settle but no camera punch; the two 読み取れません are the only page sinks: punch 0.02 + shake 6. The
//    punch on Q2 is anchored at the top edge of the frame, so the page sinks without the header leaving the frame.
//  - the header 国語 (and the test name at the right) was cut by the frame in the Q1 push (76.4-76.9 s): the band's words are
//    set further in (国語 x 56 -> 112, y +8; the test name ends at 1800, was 1852), inside every frame of the push (FRAME AUDIT).
//  - the classmate's card has no name: the name field is a rubbed-out grey trace that reads as nothing (「あの子」 has no name).
//  - her chest card (k223-k227 drawings) carries the film's one card state (docs/卡面状态.md, 03 k40 on: the band in the name
//    field, ロストワン, の号哭, the grid pressed), printed by web/lib/her_card.js and laid onto the card in the drawing by the
//    perspective of its measured corners, clipped to the card (the drawing itself is not redrawn). The classmate's card on
//    Q2 and the pair's cards in the figure are not hers and stay as they are.
//  - k231: the machine's big eraser comes in from the right and rubs out the right column down to the 数学 page (問三),
//    「そ」 printed on time; it waits beside her face. web/lib/big_eraser.js, shared with 08b, which goes on from k232.
// 2026-11-21 rhythm pass (director: “cuts and motion should follow the rock song's rhythm”“lyrics appear slightly behind the singing”), the design unchanged:
//  - the slow eased pushes on Q1 and Q2 are beat steps; camera hits on k200 (crash), k203/205/206, k208 (heaviest kick),
//    k209/211, k224, k225, k228-k230; the page sinks (a vertical dip, no random shake) on k200, k208, k213, k214, k224, k225,
//    k228. 正解 lands with print16's slam. 改定 2 becomes an order of size: the two 読み取れません are still the heaviest.
//  - every sung character reads on its onset's frame (LYRIC AUDIT): その心, sung before the black exists, is her pencil
//    writing in the こころ row as the camera flies in; the black's steps pass every later white letter by its onset frame.
// 2026-11-21 third pass (director on the second cut: “screen motion can have rhythm but must not cause dizziness”; 制作约定
// 第六节「整屏运动」, MOTION AUDIT below; 「笔芯和笔不对了……」 parts by web/lib/parts.js, PART AUDIT below):
//  - the rhythm pass's step pushes, snare hits and dips are gone: Q1 and Q2 are version 15's slow eased pushes again (anchored
//    at the frame's top edge). The whole frame jolts once: k200, the chorus's crash (大击, a one-way step that stays, no dip).
//    The two 読み取れません, the card dropping in, 正解 are the things themselves (print16's slam, the card's settle).
//  - the fly in to the こころ oval is the segment's one registered whip: k215 -> k216 (11 frames, lands on k216's crash and the
//    bar line where the pencil starts filling the oval), then dead still. Version 15 took two beats to fly in and two to be
//    thrown back; both are moves of 4x, and only one may be a whip (rule 8). The throw back on the burst becomes one eased
//    pull back over the whole black page, k217 -> k223 (corner acceleration under the jolt line every frame), so the black
//    bursting out of the oval is the hit, not the camera. Her white words follow that pull back: the line breaks after を
//    (その心を / 黒く染めたのは, the phrase's own break; version 15 broke after く), so を is inside the close frame on its
//    onset and every later word is inside the widening frame on its onset (frame-checked per word).
//    k213 keeps no camera hit: the whip starts two beats later and rule 2 wants two clear beats after a 大击.
//  - the shout: version 15's slow pushes, no hits or dips (the cuts on k223 and k227 and the head-up are the accents).
//  - her chest card: the card window and the lanyard clip are read per drawing from art/cut/seg08a_parts.json (partOf; the
//    clip used to be one polygon for all three drawings), and checked against each drawing's pixels (PART AUDIT).
// The hold of the head-down drawing (k223-k224.5, 0.56 s) is kept as in version 15: one continuous head-up movement with the
// in-between and the head-up drawing (k223-k227, 1.48 s), recorded as an exception in the audit (08a 第 5 节).
import { drawCard, CARD_RATIO } from '../../lib/card.js';
import { FRAME as FR, beatV, smooth, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics, lyricAudit } from '../../lib/lyrics.js';
import { textBox, createLayout } from '../../lib/type.js';
import { createCamera, pushes, move, camLerp, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, partAudit, pixelsOf, PIX, partReport } from '../../lib/parts.js';
import { print16, print16Box, printSung, whiteLetter, pencilWriter, sungBuild, sungShown, onsetFrameTime } from '../../lib/print.js';
import { inkjetText as inkjet, cardLayout, erasedMark } from '../../lib/card.js';
import { createBigEraser, T_IN as T_ER } from '../../lib/big_eraser.js';
import { herCardFace } from '../../lib/her_card.js';
import { PAPER, TEAL, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, REHATCH_DARK_RGB, REHATCH_LIGHT_RGB, INK_RGB,
         CARD_SHADOW, ERASER_STREAK, FIBRE_RGB, rgba } from '../../lib/palette.js';

export default async function seg08a(H) {
  const { g, W, P, q, rng, img, rinPalImage, pencilFill } = H;
  const F0 = 2221, F1 = 2587, SEG = [F0 / 30, F1 / 30];        // web/segments.json seg_08a; frame g shows song time g/30
  const LY = await loadLyrics({ within: [74.0, 86.28] });
  const L1 = LY.line('黒板のこの漢字が読めますか'), L2 = LY.line('あの子の心象は読めますか'), L3 = LY.line('その心を黒く染めたのは');
  const L4 = LY.line('おい誰なんだよおい誰なんだよ');
  // Q2 from 207; the camera pushes in to the こころ oval from 215, the pencil fills it from the bar line 216; the black bursts out on
  // 217 while the camera is thrown back to the page by 219; the shout from 223, her crying face from 227
  const TB = beatV(207), TPI = beatV(215), T_FILL = beatV(216), TC = beatV(217), TD = beatV(223), TD2 = beatV(227), T_CARD = beatV(208), T_LEADER = beatV(209);

  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const LAY = createLayout();
  const tb = (ctx, text, font, box, o = {}) => textBox(ctx, text, font, box, { layout: LAY, ...o });
  function paper(w, h, seed) {
    const [c, s] = mk(w, h), r = rng(seed); s.fillStyle = PAPER; s.fillRect(0, 0, w, h);
    for (let k = 0; k < w * h / 2200; k++) { s.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); s.fillRect(r() * w, r() * h, 2 + r() * 9, 1); }
    return [c, s];
  }
  function band(s, w, title, key) {
    // the band is tall enough that the push and the punches never cut its words (the most they take is ~30 px)
    s.fillStyle = TEAL; s.fillRect(0, 0, w, 124); LAY.reg('band', key, [0, 0, w, 124]);
    // the band's words sit inside what the push and the sinks leave of the band (version 15 had them cut at 76.4-76.9 s):
    // at most 1.075x on x 960, so the frame shows x 67-1853 and, at its top, y >= 51
    tb(s, title, '700 #px ZenKakuB', [112, 52, 520, 66], { maxSize: 48, color: PAPER, name: 'title', sheet: key + 'b' });
    tb(s, '令和八年度　読取確認テスト', '500 #px ZenKaku', [w - 632, 62, 512, 46], { maxSize: 28, align: 'right', color: PAPER, name: 'test', sheet: key + 'b' });
  }

  // ---------- assets ----------
  // her drawings, used by the timeline below (S.hold ... file). Loaded first, before the card and the pages are drawn: the
  // order canvases are made in is kept as it was in version 15, because it was measured to matter for a few pixels of the
  // close-up's GPU downscale (work/infra/refactor_diff.txt)
  const DRAW = { down: '/art/cut/rmid_bang2.png', half: '/art/cut/rmid_bmid2.png', up: '/art/cut/rmid_up.png',
                 cry: '/art/cut/rface_scr2.png', open: '/art/cut/rface_scr_mid.png', round: '/art/cut/rface_scr_o.png' };
  const IMG = {};
  for (const f of Object.values(DRAW)) IMG[f] = rinPalImage(await img(f));
  const PAIR = await img('/art/design/out/g1_students_k.png');
  // the classmate's card, drawn by the film's own card printer
  const CARDW = 1100, [cardC] = mk(CARDW, Math.round(CARDW / CARD_RATIO));
  // 「あの子」 has no name (08a 第 8 节 2): where the name was, a rubbed-out grey trace, the film's erased-mark texture, that
  // reads as no strokes at all. The same on the card and on its sharp copy for the close-up.
  const noName = (c, u) => { const L = cardLayout(u), [nx, ny, nw, nh] = L.nameBox, mx = 0.7 * u / 600, my = 0.7 * u / 900;
    const x = c.getContext('2d'); x.save(); x.beginPath(); x.rect(nx + mx + u * 0.085, ny + my + nh * 0.12, nw * 0.6, nh * 0.76); x.clip();
    erasedMark(x, nx + mx + u * 0.27, ny + my + nh / 2, u * 0.16, u * 0.022, u, rng(29), { angle: 0 }); x.restore(); };
  const CL = drawCard(cardC, { id: '2613', dev: '58', seed: 23, serial: '2026-2613', heart: 'empty' }); noName(cardC, CARDW);
  const BIGW = 3600, [cardBig] = mk(BIGW, Math.round(BIGW / CARD_RATIO));                 // the same card for the close-up, sharp
  drawCard(cardBig, { id: '2613', dev: '58', seed: 23, serial: '2026-2613', heart: 'empty' }); noName(cardBig, BIGW);

  // ---------- the two question pages share the band, the question line and the margins ----------
  const QX = 120, QY = 186, QS = 62;
  // page Q1: the kanji centred, the answer row under it, the verdict beside the answer
  const [q1, q1s] = paper(W, 1080, 3); band(q1s, W, '国語', 'q1');
  const KB = [560, 248, 800, 470];
  q1s.strokeStyle = TEAL; q1s.lineWidth = 4; q1s.strokeRect(...KB); LAY.reg('kanji box', 'q1', KB);
  const AX = 712, AY = 790, AS = 120, AG = 136;
  tb(q1s, '答', '700 #px ZenKakuB', [AX - 112, AY + 12, 96, 96], { maxSize: 60, align: 'center', name: '答', sheet: 'q1' });
  for (let i = 0; i < 4; i++) { q1s.strokeStyle = TEAL; q1s.lineWidth = 4; q1s.strokeRect(AX + i * AG, AY, AS, AS); LAY.reg(`answer ${i}`, 'q1', [AX + i * AG, AY, AS, AS]); }
  { q1s.strokeStyle = TEAL; q1s.lineWidth = 3; q1s.strokeRect(150, 300, 300, 200); q1s.fillStyle = TEAL; q1s.fillRect(150, 300, 300, 56); LAY.reg('配点 box', 'q1', [150, 300, 300, 200]);
    tb(q1s, '配点', '700 #px ZenKakuB', [160, 306, 280, 44], { maxSize: 30, align: 'center', color: PAPER, name: '配点', sheet: 'q1n' });
    tb(q1s, '10点', '700 #px ZenKakuB', [160, 370, 280, 110], { maxSize: 80, align: 'center', name: '10点', sheet: 'q1n' });
    q1s.strokeRect(1460, 300, 330, 420); q1s.fillRect(1460, 300, 330, 56); LAY.reg('注意 box', 'q1', [1460, 300, 330, 420]);
    tb(q1s, '解答上の注意', '700 #px ZenKakuB', [1470, 306, 310, 44], { maxSize: 28, align: 'center', color: PAPER, name: '注意', sheet: 'q1n' });
    ['1　読みはひらがなで', '　 答えること。', '2　一マスに一字。', '3　読み取り機で', '　 採点します。'].forEach((t, i) =>
      tb(q1s, t, '500 #px ZenKaku', [1480, 380 + i * 64, 300, 50], { maxSize: 30, name: `注意 ${i}`, sheet: 'q1n' })); }

  // page Q2: the figure (the pair, あの子 marked) at the left, the answer field (her card) at the right
  const [q2, q2s] = paper(W, 1080, 5); band(q2s, W, '国語', 'q2');
  const FB = [120, 236, 620, 744];
  q2s.strokeStyle = TEAL; q2s.lineWidth = 4; q2s.strokeRect(...FB); LAY.reg('figure', 'q2', FB);
  const FSC = 0.6, FSX = 128, FSY = 246;
  q2s.save(); q2s.beginPath(); q2s.rect(FB[0] + 2, FB[1] + 2, FB[2] - 4, FB[3] - 4); q2s.clip(); q2s.globalCompositeOperation = 'multiply';
  q2s.drawImage(PAIR, 0, 100, 1024, 1300, FSX, FSY, 1024 * FSC, 1300 * FSC); q2s.restore();
  const GIRL = [FSX + 700 * FSC, FSY + (262 - 100) * FSC];          // her head, where the leader line starts
  const LBL = [FB[0] + FB[2] - 160, FB[1] + 18, 140, 60];
  tb(q2s, '答', '700 #px ZenKakuB', [800, 300, 70, 70], { maxSize: 56, align: 'center', name: '答', sheet: 'q2' });
  const CX = 1330, CY = 590, CS = 0.74, CW = CARDW * CS, CH = (CARDW / CARD_RATIO) * CS;
  LAY.reg('card', 'q2', [CX - CW / 2, CY - CH / 2, CW, CH]);
  const cardPt = (px, py) => [CX - CW / 2 + px * CS, CY - CH / 2 + py * CS];
  const HEART = cardPt(...CL.heart);
  function drawQ2(ctx, tt, z = 1) {
    ctx.drawImage(q2, 0, 0);
    // the leader line draws itself to the girl on beat 209, then the label appears
    const u = Math.min(1, Math.max(0, (tt - T_LEADER) / (4 * FR)));
    if (u > 0) { const [gx, gy] = GIRL, ex = LBL[0], ey = LBL[1] + LBL[3] / 2, mx = gx + 34, my = ey;
      ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx + 20, gy - 12);
      const v = Math.min(1, u * 2); ctx.lineTo(gx + 20 + (mx - gx - 20) * v, gy - 12 + (my - gy + 12) * v);
      if (u > 0.5) ctx.lineTo(mx + (ex - mx) * (u - 0.5) * 2, my); ctx.stroke();
      if (u >= 1) { ctx.fillStyle = PAPER; ctx.fillRect(...LBL); ctx.strokeRect(...LBL);
        textBox(ctx, 'あの子', '700 #px ShipporiB', [LBL[0] + 6, LBL[1] + 4, LBL[2] - 12, LBL[3] - 8], { maxSize: 40, align: 'center', color: GRAPHITE }); } }
    // her card drops into the answer field on beat 208
    const a = tt - T_CARD;
    if (a >= 0) { const sc = 1 + 0.08 * Math.pow(1 - Math.min(1, a / (3 * FR)), 2);
      ctx.save(); ctx.translate(CX, CY); ctx.scale(sc, sc); ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-CW / 2 + 10, -CH / 2 + 14, CW, CH);
      ctx.drawImage(z * CS > 1.05 ? cardBig : cardC, -CW / 2, -CH / 2, CW, CH); ctx.restore(); }
  }

  // graphite: the page under many layers of pencil
  const [GF, gfs] = mk(W, 1080); { gfs.fillStyle = GRAPHITE_FIELD; gfs.fillRect(0, 0, W, 1080); const r = rng(9); gfs.lineCap = 'round';
    for (let k = 0; k < 2400; k++) { gfs.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); gfs.lineWidth = 2 + r() * 5;
      const x = r() * W, y = r() * 1080, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16; gfs.beginPath(); gfs.moveTo(x, y); gfs.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); gfs.stroke(); } }
  // ---------- the black: pencil hatching laid down from the heart oval, its front driven by her singing ----------
  // her words appear as paper-white letters left in the black, each when it is sung; the black has always reached a
  // letter's place by then, and covers the whole page as the line ends
  // two rows broken after を (その心を / 黒く染めたのは): the eased pull back on the black page shows each word on its onset
  const LET = []; { const rows = [L3.slice(0, 4), L3.slice(4)], size = 92;
    rows.forEach((row, ri) => row.forEach(([c, t], i) => LET.push({ c, t, x: HEART[0] + 70 + i * size * 1.04, y: HEART[1] - 60 + ri * size * 1.2, size }))); }
  LET.forEach(L => { L.d = Math.hypot(L.x - HEART[0], L.y - HEART[1]) + L.size * 1.25; });
  const STR = []; { const r = rng(61);
    for (let pass = 0; pass < 1; pass++) for (let gy = -40; gy < 1120; gy += 11) for (let gx = -60; gx < W + 60; gx += 20) {
      const x = gx + (r() - 0.5) * 20, y = gy + (r() - 0.5) * 12, d0 = Math.hypot(x - HEART[0], y - HEART[1]);
      const n = 0.5 * Math.sin(x * 0.006 + y * 0.004) + 0.5 * Math.sin(x * 0.011 - y * 0.009);
      STR.push({ x, y, d: d0 * (1 + 0.12 * n) + r() * 30 + pass * 40, len: 50 + r() * 60, ang: (pass ? 0.55 : -0.5) + (r() - 0.5) * 0.16, w: 3 + r() * 4, a: 0.6 + r() * 0.3 }); }
    STR.sort((a, b) => a.d - b.d); }
  const DMAX = STR[STR.length - 1].d;
  // the black goes one step further on every beat from TC (k217-k222), each step landing on its beat's frame (easeB), at least 150 px a step,
  // nearly the whole page on the last. Every white letter must read on the frame its onset falls in (制作约定 第六节,
  // 2026-11-21, “lyrics appear slightly behind the singing”): the front has passed it by then. A letter whose onset frame comes in the first
  // half of a step's ease is covered whole by the step before; otherwise the step it falls in is made long enough to pass it by
  // that frame. その心 is sung before the black exists (k215-k216): it is her pencil writing beside the oval (SONO below).
  // Each step (and the burst on k217, the first step) lands like the camera hits: counted in frames from the beat's frame
  // (the first frame at or after the measured beat), 62% on that frame, 92% on the next, 98.5% on the third, whole on the
  // fifth. Version 15's ease (from 0 at the beat over 0.6 beat) put only 1-35% on the beat's frame, so every step read a
  // frame late (beat_react k217-k220 +1; 复审 2026-11-21).
  const easeB = a => { if (a < 0) return 0; const k = Math.floor(a / FR + 1e-6); return k >= 4 ? 1 : 1 - 0.38 * Math.pow(0.2, k); };
  const BSTEPS = []; { const ks = [217, 218, 219, 220, 221, 222], need = ks.map(() => []);
    LET.forEach(L => { if (L.t < TC) return; const tf = onsetFrameTime(L.t);
      let i = ks.findIndex((k, j) => tf >= beatV(k) && (j === ks.length - 1 || tf < beatV(ks[j + 1]))); if (i < 0) return;
      let u = easeB(tf - beatV(ks[i])); if (u < 0.5) { i -= 1; u = 1; }
      if (i < 0) throw new Error(`seg_08a: ${L.c} is sung too early for the black`); need[i].push([L, u]); });
    let m = 0; ks.forEach((k, i) => { const prev = m; let req = prev + 150;
      for (const [L, u] of need[i]) req = Math.max(req, prev + (L.d - prev) / u + 2);
      m = k === 222 ? Math.max(req, DMAX * 0.93) : req; BSTEPS.push([beatV(k), m]); }); }
  const frontAt = t => { let r = 0, prev = 0; for (const [t0, m] of BSTEPS) { if (t < t0) break; const u = easeB(t - t0); r = prev + (m - prev) * u; prev = m; } return r; };
  // a white letter's opacity on the frame at tt (what renderAt draws, and what the lyric audit reads)
  const letAlpha = (L, tt) => (sungShown(tt, L.t) && frontAt(tt) >= L.d) ? sungBuild(tt - L.t) : 0;
  function blackOver(ctx, radius) {
    if (radius > 30) {           // the solid part: graphite inside the front, its edge uneven
      ctx.save(); ctx.beginPath();
      for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2, n = 0.5 * Math.sin(a * 5 + 1.3) + 0.3 * Math.sin(a * 11 + 0.4) + 0.2 * Math.sin(a * 17);
        const r = Math.max(0, radius - 90) * (1 + 0.16 * n) * (1 + 0.25 * Math.abs(Math.cos(a))); const x = HEART[0] + Math.cos(a) * r, y = HEART[1] + Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.closePath(); ctx.clip(); ctx.drawImage(GF, 0, 0); ctx.restore(); }
    ctx.save(); ctx.lineCap = 'round';
    for (const s of STR) { if (s.d > radius) break; if (s.d < radius - 160) continue;
      ctx.strokeStyle = rgba(INK_RGB, s.a); ctx.lineWidth = s.w; ctx.beginPath();
      const dx = Math.cos(s.ang) * s.len / 2, dy = Math.sin(s.ang) * s.len / 2; ctx.moveTo(s.x - dx, s.y - dy); ctx.lineTo(s.x + dx, s.y + dy); ctx.stroke(); }
    ctx.restore();
  }
  // on every beat of the shout the pencil goes over the graphite again: a patch of fresh strokes appears and stays
  // (not used in this half of the chorus; kept with the page for the second half)
  const PATCH = {};
  function rehatch(ctx, t0, tt, seed) {
    const a = tt - t0; if (a < 0) return;
    if (!PATCH[seed]) { const r = rng(seed), [c, x] = mk(W, 1080), cx = 150 + r() * 1620, cy = 100 + r() * 880; x.lineCap = 'round';
      for (let k = 0; k < 160; k++) { const ang = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.2, d = Math.pow(r(), 0.6) * 340, th = r() * Math.PI * 2, px = cx + Math.cos(th) * d, py = cy + Math.sin(th) * d * 0.7, l = 60 + r() * 120;
        x.strokeStyle = r() < 0.6 ? rgba(REHATCH_DARK_RGB, 0.35 + r() * 0.3) : rgba(REHATCH_LIGHT_RGB, 0.25 + r() * 0.25); x.lineWidth = 2 + r() * 4;
        x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(ang) * l, py + Math.sin(ang) * l); x.stroke(); }
      PATCH[seed] = c; }
    ctx.save(); ctx.globalAlpha = Math.min(1, (a / FR + 1) / 2); ctx.drawImage(PATCH[seed], 0, 0); ctx.restore();
  }
  function eraserStreak(ctx, t0, tt, seed) {
    const a = tt - t0; if (a < 0 || a > 0.4) return; const r = rng(seed), x = 200 + r() * 1100, y = 120 + r() * 800, l = 500 + r() * 500, ang = -0.5 + (r() - 0.5) * 0.3;
    ctx.save(); ctx.globalAlpha = 0.16 * (1 - a / 0.4); ctx.strokeStyle = ERASER_STREAK; ctx.lineCap = 'round'; ctx.lineWidth = 70 + r() * 50;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * l, y + Math.sin(ang) * l); ctx.stroke(); ctx.restore();
  }
  void rehatch; void eraserStreak;

  // ---------- the score: every visual event on the measured beat (lib/score.js), with no lead ----------
  const S = createScore('seg_08a', { t0: SEG[0], t1: SEG[1] });
  const ev = S.ev;
  ev('cut Q2', TB); ev('push in to the heart', TPI); ev('heart fill', T_FILL); ev('black bursts, the pull back starts', TC);
  ev('cut shout', TD); ev('cut crying face', TD2);
  const T_KANJI = ev('kanji', beatV(200)), T_ANS = ev('answer printed', beatV(205)), T_OK = ev('正解', beatV(206));
  // 読み取れません as she asks and on the beat she ends the question, so both are read before the camera moves in
  const T_ERR = [ev('読み取れません 1', beatV(213)), ev('読み取れません 2', beatV(214))];
  ev('card drops', T_CARD); ev('leader line', T_LEADER);
  // ---------- the whole frame's motion (制作约定 第六节「整屏运动」, 2026-11-21 third pass) ----------
  // Slow eased pushes (version 15's) on Q1, Q2 and the shout; one 大击 on k200 (the chorus's crash: a one-way zoom step that
  // stays, 62% / 96% / 100% on the beat's first three frames, anchored at the frame's top edge, no dip); one whip k215 -> k216
  // into the こころ oval; one eased pull back k217 -> k223 over the black page. The beat lives in the cuts (k207, k223, k227),
  // the prints and stamps, the card's drop, the black's steps, her head-up.
  const T_WHIP = TPI, T_WHIP_END = T_FILL;                  // the whip lands on k216 (crash, bar line, the pencil starts)
  const push = pushes(S, [[beatV(200), TB, 0.04, 'push Q1'], [T_CARD, beatV(214), 0.05, 'push Q2'],
                          [TD, TD2, 0.06, 'push shout'], [TD2, beatV(232), 0.06, 'push face']]);
  const KICK = [0.62, 0.96, 1], fk = a => Math.floor(a / FR + 1e-6);   // frames since the beat's frame
  const kick = (tt, t0, amt) => tt < t0 ? 0 : amt * KICK[Math.min(2, fk(tt - t0))];
  const BIG = [[beatV(200), 'k200 副歌第一拍的镲 (crash 12.7 dB, 段内最响)']];
  const WHIPS = [[T_WHIP, 'k215 fly in to the こころ oval (one way, 11 frames, lands on k216)']];
  move(S, 'whip in to the heart', T_WHIP, T_WHIP_END); move(S, 'pull back over the black page', TC, TD);
  BSTEPS.forEach(([t], i) => ev(`black step ${i}`, t));
    // the big eraser (web/lib/big_eraser.js, shared with 08b) comes in on 231; it comes down on her face on 232, in 08b
  ev('eraser in: clears the right column', T_ER);

  // ---------- the drawings' timeline: decides which drawing is on screen, and is the hold audit ----------
  // First shout: head down 223, the in-between from 224.5 (half a beat), head up on 225; second shout: the crying face 227,
  // the in-between from 229.5 (half a beat), the rounder shout on 230 (よ). Key drawings and shots at least two beats, an
  // in-between at least half a beat, so it reads as a movement and never flashes.
  S.hold('shot', 'shot Q1', SEG[0], TB, { kind: 'shot', onBeat: false });
  S.hold('shot', 'shot Q2 until the push', TB, TPI, { kind: 'shot' });
  S.hold('shot', 'black page', TC, TD, { kind: 'shot' });
  S.hold('shot', 'shot shout', TD, TD2, { kind: 'shot' });
  S.hold('rin', 'head down', TD, beatV(224.5), { kind: 'key', file: DRAW.down, use: 'pose' });
  S.hold('rin', 'head halfway (in-between)', beatV(224.5), beatV(225), { kind: 'inbetween', file: DRAW.half, use: 'pose' });
  S.hold('rin', 'head up', beatV(225), TD2, { kind: 'key', file: DRAW.up, use: 'pose' });
  S.hold('rin', 'crying shout', TD2, beatV(229.5), { kind: 'key', file: DRAW.cry, use: 'face' });
  S.hold('rin', 'shout opening (in-between)', beatV(229.5), beatV(230), { kind: 'inbetween', file: DRAW.open, use: 'face' });
  S.hold('rin', 'rounder shout', beatV(230), beatV(232), { kind: 'key', file: DRAW.round, use: 'face' });
  const P_UP = S.holds.find(h => h.name === 'head up').start;
  // the head-down drawing holds 1.5 beats (0.56 s), kept as confirmed in version 15: it is the start of one continuous head-up
  // movement (head down -> in-between -> head up, k223-k227, 1.48 s), and k222-k223 has to stay the one beat where the black
  // covers the page with その心を黒く染めたのは whole (08a 第 5 节). Recorded as an exception, not dropped silently.
  const HOLD_EXC = [{ name: 'head down', why: 'start of one continuous head-up movement k223-k227 (1.48 s) with the in-between and head up; kept from version 15 (08a 第 5 节)' }];
  { const res = S.finish(); for (const e of HOLD_EXC) { const i = res.holdProblems.findIndex(p => p.name === e.name);
      if (i >= 0) { e.problem = res.holdProblems[i].problem; res.holdProblems.splice(i, 1); console.warn(`HOLD EXCEPTION seg_08a: ${e.name}: ${e.problem}; ${e.why}`); } }
    console.warn(`HOLD AUDIT seg_08a (after exceptions): ${res.holdProblems.length} problems`); }
  for (const h of S.holds) if (h.file && !IMG[h.file]) throw new Error(`c1a: ${h.file} is in the timeline but not loaded (add it to DRAW)`);

  // ---------- camera ----------
  const CAM = createCamera(g, { W, H: 1080, bg: GRAPHITE }), wg = CAM.wg;
  // everything new to the film version is made after all of version 15's canvases (their creation order was measured to
  // matter for a few pixels of the close-up's GPU downscale, work/infra/refactor_diff.txt)
  // Her chest card in the three pose drawings (k223-k227): Codex drew it as a clean card in a clear sleeve. k223 is long after
  // 03 k40, so the card shows the film's one card state (docs/卡面状态.md, 'title': the band, ロストワン, の号哭, the grid pressed),
  // printed by web/lib/her_card.js, the only way her card is drawn; no card coordinates of this page's own.
  // The face replaces the drawn card face inside the sleeve: the quad is the sleeve's grey inner line (the card's edge),
  // measured per drawing on art/cut/rmid_*.png (work/seg/08a/card_fix/measure_edges.py: a profile across each edge finds the
  // grey line, a trimmed line fit per edge, the corners where the edges meet; residuals <= 0.4 px). The face is mapped by
  // the true perspective (homography) of that quad, written only inside it (clipped to the card), and prefiltered for the
  // scale it is shown at: each drawing pixel averages 8 x 8 bilinear samples of a 600 px face over a 1.35 px footprint
  // (the drawing is shown at 0.74-0.79, so that is about one screen pixel; 根因清单: textures prefiltered by screen scale).
  // The lanyard's clip tab (drawn over the sleeve's top edge, at the card's slot) is put back on top of the face.
  // Parts (web/lib/parts.js, 2026-11-21): the card window (quad) and the clip (tab polygon) are read per drawing from
  // art/cut/seg08a_parts.json with partOf (no drawing borrows another's: the clip was one polygon for all three before), and
  // composited into that drawing's own canvas in its own px, so they go through the drawing's one placement (pose()).
  const PA = await loadPartAnchors('/art/cut/seg08a_parts.json'), partId = f => f.replace(/^.*\//, '').replace(/\.png$/, '');
  { const QUAD = {}, TABS = {};
    for (const f of [DRAW.down, DRAW.half, DRAW.up]) { QUAD[f] = partOf(PA, partId(f), 'card_window').quad; TABS[f] = partOf(PA, partId(f), 'tab').poly; }
    const FU = 600, face = herCardFace(FU, { state: 'title' }), fw = face.width, fh = face.height;
    const fd = face.getContext('2d').getImageData(0, 0, fw, fh).data;
    // the unit square (s, t) -> the quad TL, TR, BR, BL (a projective map), and its inverse
    const homography = ([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) => {
      const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
      const den = dx1 * dy2 - dx2 * dy1, g7 = (dx3 * dy2 - dx2 * dy3) / den, h8 = (dx1 * dy3 - dx3 * dy1) / den;
      const a = x1 - x0 + g7 * x1, b = x3 - x0 + h8 * x3, c = x0, d = y1 - y0 + g7 * y1, e = y3 - y0 + h8 * y3, f = y0;
      // inverse of [[a b c] [d e f] [g h 1]] (adjugate; the scale does not matter in homogeneous coordinates)
      const A = e - f * h8, B = c * h8 - b, C = b * f - c * e, D = f * g7 - d, E = a - c * g7, F = c * d - a * f, G = d * h8 - e * g7, Hh = b * g7 - a * h8, I = a * e - b * d;
      return (X, Y) => { const w = G * X + Hh * Y + I; return [(A * X + B * Y + C) / w, (D * X + E * Y + F) / w]; };
    };
    const sample = (sx, sy, out) => {               // bilinear, premultiplied, outside the face = transparent
      const x = sx - 0.5, y = sy - 0.5, x0 = Math.floor(x), y0 = Math.floor(y), tx = x - x0, ty = y - y0;
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
        const xx = x0 + i, yy = y0 + j; if (xx < 0 || yy < 0 || xx >= fw || yy >= fh) continue;
        const wgt = (i ? tx : 1 - tx) * (j ? ty : 1 - ty), o = (yy * fw + xx) * 4, al = fd[o + 3] / 255 * wgt;
        out[0] += fd[o] * al; out[1] += fd[o + 1] * al; out[2] += fd[o + 2] * al; out[3] += al;
      }
    };
    const N = 8, FOOT = 1.35;
    for (const f of [DRAW.down, DRAW.half, DRAW.up]) {
      const src = IMG[f], [c, x] = mk(src.width, src.height); x.drawImage(src, 0, 0);
      const Q = QUAD[f], inv = homography(Q);
      const bx0 = Math.floor(Math.min(...Q.map(p => p[0]))) - 1, by0 = Math.floor(Math.min(...Q.map(p => p[1]))) - 1;
      const bx1 = Math.ceil(Math.max(...Q.map(p => p[0]))) + 1, by1 = Math.ceil(Math.max(...Q.map(p => p[1]))) + 1, bw = bx1 - bx0, bh = by1 - by0;
      const id = x.getImageData(bx0, by0, bw, bh), p = id.data, acc = [0, 0, 0, 0];
      for (let py = 0; py < bh; py++) for (let px = 0; px < bw; px++) {
        acc[0] = acc[1] = acc[2] = acc[3] = 0;
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const X = bx0 + px + 0.5 + ((i + 0.5) / N - 0.5) * FOOT, Y = by0 + py + 0.5 + ((j + 0.5) / N - 0.5) * FOOT, [s, t] = inv(X, Y);
          if (s < 0 || s > 1 || t < 0 || t > 1) continue;          // outside the card: nothing (the clip to the card)
          sample(s * fw, t * fh, acc);
        }
        const a = acc[3] / (N * N); if (a <= 0) continue;
        const o = (py * bw + px) * 4, k = 1 - a, n = N * N;
        p[o] = acc[0] / n + p[o] * k; p[o + 1] = acc[1] / n + p[o + 1] * k; p[o + 2] = acc[2] / n + p[o + 2] * k; p[o + 3] = Math.min(255, a * 255 + p[o + 3] * k);
      }
      x.putImageData(id, bx0, by0);
      x.save(); x.beginPath(); TABS[f].forEach(([tx, ty], i) => i ? x.lineTo(tx, ty) : x.moveTo(tx, ty)); x.closePath(); x.clip(); x.drawImage(src, 0, 0); x.restore();
      IMG[f] = c; }
    // PART AUDIT, on each drawing's own (unrecoloured) pixels: (1) the quad's four edges lie on the sleeve's grey inner line
    // (within 1 px) and 2.5 px inside them is the card's paper (a quad 1.5 px off fails: 13-50% off, work/seg/08a/parts);
    // (2) every corner of the clip polygon is on the clip's dark outline (within 2 px). Points under the clip are skipped.
    const lum = ([r, g2, b]) => 0.299 * r + 0.587 * g2 + 0.114 * b;
    const GREY_LINE = p => PIX.opaque(p) && lum(p) >= 95 && lum(p) <= 205 && Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]) < 45;
    const PAPER_PX = p => PIX.opaque(p) && lum(p) >= 205, OUTLINE = p => PIX.opaque(p) && lum(p) < 120;
    const inPoly = ([x, y], P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [x1, y1] = P[i], [x2, y2] = P[j]; if ((y1 > y) !== (y2 > y) && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) c = !c; } return c; };
    for (const f of [DRAW.down, DRAW.half, DRAW.up]) {
      const raw = await img(f), Q = QUAD[f], T = TABS[f], cx = Q.reduce((a, p) => a + p[0], 0) / 4, cy = Q.reduce((a, p) => a + p[1], 0) / 4, edge = [], inner = [];
      for (let k = 0; k < 4; k++) { const A = Q[k], B = Q[(k + 1) % 4], L = Math.hypot(B[0] - A[0], B[1] - A[1]); let nx = (B[1] - A[1]) / L, ny = -(B[0] - A[0]) / L;
        if (nx * ((A[0] + B[0]) / 2 - cx) + ny * ((A[1] + B[1]) / 2 - cy) < 0) { nx = -nx; ny = -ny; }
        for (let i = 0; i < 45; i++) { const s2 = 0.06 + 0.88 * i / 44, P = [A[0] + (B[0] - A[0]) * s2, A[1] + (B[1] - A[1]) * s2], I = [P[0] - 2.5 * nx, P[1] - 2.5 * ny];
          if (inPoly(P, T) || inPoly(I, T)) continue; edge.push(P); inner.push(I); } }
      partAudit('seg_08a', partId(f), 'card_window edges on the grey line', { image: raw, points: edge, on: GREY_LINE, r: 1, maxOffPct: 3 });
      partAudit('seg_08a', partId(f), 'card_window inside is paper', { image: raw, points: inner, on: PAPER_PX, r: 0, maxOffPct: 5 });
      partAudit('seg_08a', partId(f), 'tab corners on the clip outline', { image: raw, points: T, on: OUTLINE, r: 2, maxOffPct: 0 }); } }
  const PARTS = partReport('seg_08a'); void pixelsOf;
  const ER = await createBigEraser({ rng, img, rinPalImage, LY, layout: LAY });
  for (const [name, t] of ER.events) if (t >= SEG[0] && t < SEG[1] && !S.events.some(e => e.name === name)) throw new Error(`seg_08a: eraser event ${name} not registered`);
  function pose(ctx, im, cx, s = 0.74, os = 1) { const w = im.width * s, h = im.height * s;
    ctx.save(); ctx.translate(cx, 700); ctx.scale(os, os); ctx.translate(-cx, -700); ctx.drawImage(im, cx - w / 2, 12, w, h); ctx.restore(); }

  // ---------- Q2 and the black are one continuous camera move, no cut ----------
  // Q2's slow push (version 15) ends on k214; on k215 the camera whips in to the こころ oval (the segment's one registered
  // whip, 11 frames, smootherstep so its first and last frames are small: it starts and lands clean) and lands on k216, dead
  // still while the pencil fills the oval; on k217 the black bursts out of the oval and the camera eases back over the black
  // page to the whole page by k223 (an even push of acceleration, then an even pull of it, with short ramps: every frame's
  // corner acceleration stays under the jolt line, so it reads as one long breath out, not a throw). Both moves keep a
  // target point travelling in a straight line on screen while the zoom changes evenly (camLerp). Drawn straight into the
  // frame at full resolution, so the close view stays sharp.
  // The close frame (3.55x) holds the label こころ whole, the oval, 「← 必ずぬりつぶすこと」, her pencil その心 and, once the black
  // passes, the white その心を, and ends above the 読み取れません box under the card; each later white word is inside the
  // widening frame on its onset (frame-checked per word below).
  // Solved for in work/seg/08a/motion/pull_search.py: corner acceleration <= 2.7 px/frame^2, every word >= 14 page px inside the
  // frame on its onset.
  const ZC = 3.55, TGT = [HEART[0] + 138, HEART[1] - 49], PULL_TGT = [1000, 800];
  const Z_Q2 = 1 + push.amount(1), F_Q2 = [960, 20 + 540 / Z_Q2];
  const smoother = u => { u = Math.min(1, Math.max(0, u)); return u * u * u * (u * (6 * u - 15) + 10); };
  // the pull back's ease: acceleration +a for the first half, -a for the second, each half's ends ramped by sin^2 over 20%
  const PULL_E = (() => { const n = 4000, h = 0.1, acc = []; for (let i = 0; i < n; i++) { const x = (i + 0.5) / n;
      let w = Math.min(1, x / h, (1 - x) / h, Math.abs(x - 0.5) / h); w = Math.sin(w * Math.PI / 2) ** 2; acc.push((x < 0.5 ? 1 : -1) * w); }
    const pos = [0]; let v = 0, p = 0; for (const a of acc) { v += a; p += v; pos.push(p); } const P = pos.map(q => q / p);
    return u => { u = Math.min(1, Math.max(0, u)); const k = u * n, i = Math.floor(k); return i >= n ? 1 : P[i] + (P[i + 1] - P[i]) * (k - i); }; })();
  // the frame stays anchored at its top edge on Q1 and Q2 (the band never leaves the frame)
  const topAnchored = z => [z, 960, 20 + 540 / z];
  function camQ2(tt) {
    if (tt < T_WHIP) return topAnchored(push(1, tt));
    if (tt < TC) return camLerp(Z_Q2, F_Q2, ZC, TGT, smoother((tt - T_WHIP) / (T_WHIP_END - T_WHIP)), TGT);
    return camLerp(ZC, TGT, 1, [960, 540], PULL_E((tt - TC) / (TD - TC)), PULL_TGT);
  }
  const camQ1 = tt => [...topAnchored(push(0, tt) + kick(tt, BIG[0][0], 0.03)), 0];
  const camShout = tt => [tt >= TD2 ? push(3, tt) : push(2, tt), 960, 540, 0];
  // the こころ oval filled in pencil, left to right as p goes 0 -> 1, with the same strokes as the card's other marks
  function heartFill(ctx, p) {
    if (p <= 0) return; const rx = CL.rx * CS, ry = CL.ry * CS;
    ctx.save(); ctx.beginPath(); ctx.rect(HEART[0] - rx * 1.4, HEART[1] - ry * 1.6, rx * 2.8 * p, ry * 3.2); ctx.clip();
    pencilFill(ctx, HEART[0], HEART[1], rx * 1.15, ry * 1.15, CW, rng(77), { dark: 1.15, over: 0.04 }); ctx.restore();
  }
  // each of her words in the black shows when it is sung (letAlpha). その心 is sung (k215-k216) while the camera flies in to
  // the oval, before there is any black: version 15 showed it only when the front passed (0.45-0.70 s late). Now she writes it
  // in pencil as she sings it, in the こころ row to the right of 「← 必ずぬりつぶすこと」 (her handwriting next to the field she
  // is filling in), whole on each onset's frame; the burst swallows it and the line comes back in white, その心 first, as the
  // front passes. Drawn at 4x resolution and scaled down, so it stays sharp in the 4x close view.
  // the printed instruction on the card (card.js: at hx + 0.04u, 500 0.019u ZenKaku), measured, so the pencil starts after it
  const INSTR = (() => { const m = document.createElement('canvas').getContext('2d'); m.font = `500 ${0.019 * CW}px ZenKaku`;
    const w = m.measureText('← 必ずぬりつぶすこと').width, x = HEART[0] + 0.04 * CW, h = 0.019 * CW; return [x, HEART[1] - h * 0.6, w, h * 1.2]; })();
  const PW = pencilWriter(), SONO_S = 28, SONO_X = INSTR[0] + INSTR[2] + 18, SONO_Y = HEART[1] + 1;
  const SONO = L3.slice(0, 3).map(([c, t], i) => ({ c, t, x: SONO_X + SONO_S * (i + 0.5) * 1.04, y: SONO_Y }));
  const sonoChar = (ctx, p, tt) => { ctx.save(); ctx.translate(p.x, p.y); ctx.scale(0.25, 0.25); PW.char(ctx, p.c, 0, 0, SONO_S * 4, tt - p.t); ctx.restore(); };
  // the shout's words, rubbed out of the graphite down one side (first half at the left, second at the right)
  const shoutCol = second => { const half = second ? L4.slice(7) : L4.slice(0, 7), size = 116, cx = second ? W - 200 : 200, y0 = 540 - half.length * size / 2; return { half, size, cx, y0 }; };

  // ---------- layout of the dynamic text, and the frame audit (the camera as it actually moves, every frame) ----------
  { const QW = (chars, size) => { const m = document.createElement('canvas').getContext('2d'); m.font = `700 ${size}px ShipporiB`; return chars.reduce((a, [c]) => a + m.measureText(c).width, 0); };
    const q1Line = [['問', -1], ['一', -1], ['　', -1], ...L1], q2Line = [['問', -1], ['二', -1], ['　', -1], ...L2];
    LAY.text('question', 'q1:print', [QX, QY - QS * 0.6, QW(q1Line, QS), QS * 1.2]);
    LAY.text('憂鬱', 'q1:print', [KB[0] + 30, KB[1] + 30, KB[2] - 60, KB[3] - 60]);
    ['ゆ', 'う', 'う', 'つ'].forEach((c, i) => LAY.text(`answer ${c}${i}`, 'q1:print', print16Box(c, AX + i * AG + AS / 2, AY + AS / 2, 5.0)));
    LAY.text('正解', 'q1:print', print16Box('正解', AX + 4 * AG + 150, AY + AS / 2, 5.1, { framed: true }));
    LAY.text('question', 'q2:print', [QX, QY - QS * 0.6, QW(q2Line, QS), QS * 1.2]);
    LAY.text('あの子', 'q2:print', LBL);
    LAY.text('読み取れません 1', 'q2:stamp', print16Box('読み取れません', CX, CY + CH / 2 + 84, 4.6, { framed: true }));
    LAY.text('読み取れません 2', 'q2:stamp', print16Box('読み取れません', GIRL[0] + 10, GIRL[1] + 250, 3.6, { framed: true }));
    LET.forEach((L, i) => LAY.text(`white ${L.c}${i}`, 'q2:white', [L.x - L.size * 0.5, L.y - L.size * 0.55, L.size, L.size * 1.1]));
    LAY.text('← 必ずぬりつぶすこと (card)', 'q2:pencil', INSTR);
    SONO.forEach((p, i) => LAY.text(`pencil ${p.c}${i}`, 'q2:pencil', [p.x - SONO_S * 0.5, p.y - SONO_S * 0.62, SONO_S, SONO_S * 1.24]));
    for (const second of [false, true]) { const { half, size, cx, y0 } = shoutCol(second);
      LAY.text(`shout ${second ? 2 : 1}`, 'shout', [cx - size * 0.5, y0, size, size * half.length]); } }
  LAY.audit('seg_08a pages');
  const flat = p => p;                      // the pages are drawn at world = page coordinates
  const views = (cam, a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy, sh = 0] = cam(t); return { t, ...CAM.view(z, fx, fy, sh) }; });
  LAY.frameCheck('shot Q1', { sheets: { q1: flat, q1b: flat, q1n: flat, 'q1:print': flat }, views: views(camQ1, SEG[0], TB) });
  // Q2 is checked until the push in to the こころ oval: from 215 the camera flies into the card on purpose (4x), and from 217
  // the black covers the page, so only her white words are checked there
  LAY.frameCheck('shot Q2 (until the push)', { sheets: { q2: flat, q2b: flat, 'q2:print': flat, 'q2:stamp': flat }, views: views(camQ2, TB, T_WHIP) });
  // her pencil その心 and the card's instruction beside it, from a frame before the first onset to the burst (the 4x close view)
  LAY.frameCheck('pencil その心 (fly in to the oval)', { sheets: { 'q2:pencil': flat }, views: views(camQ2, onsetFrameTime(SONO[0].t) - FR, TC) });
  // her white words on the black page, each from the first frame it shows (its onset's frame, or the frame the black reaches
  // it for その心, sung before the black) to the cut, through the eased pull back
  LET.forEach((L, i) => { const first = frameTimes(SEG[0], TC, TD).find(tt => letAlpha(L, tt) > 0); if (first === undefined) throw new Error(`seg_08a: ${L.c} never shows`);
    const sheet = `q2:white ${i}`; LAY.text(`white ${L.c}${i}`, sheet, [L.x - L.size * 0.5, L.y - L.size * 0.55, L.size, L.size * 1.1]);
    LAY.frameCheck(`white ${L.c}${i} (from its first frame)`, { sheets: { [sheet]: flat }, views: views(camQ2, first, TD) }); });
  LAY.frameCheck('shot shout', { sheets: { shout: flat }, views: views(camShout, TD, SEG[1]) });
  // the 数学 page's right column, from the frame the eraser has stopped beside her face to the end of the segment
  LAY.frameCheck('問三 right column (after the eraser)', { sheets: { q3: flat, q3b: flat, 'q3:print': flat }, views: views(camShout, T_ER + 3 * FR, SEG[1]) });
  // STAMP SLAM AUDIT (根因清单 2026-11-21, 03 片名: 放大、过冲类效果按放大后的实际墨迹框逐帧登记检查). The two 読み取れません are
  // print16 with its own centred slam (22% large on the hit, back to 1 in three frames). Each frame of each slam is printed
  // here by the same call the frame uses, and its actual ink (dots, frame rule, paper ground) is measured and registered,
  // one sheet per frame, with every text box and region of page Q2 it could land on (the band, its words, the question, 答,
  // あの子, the card and its shadow, the other stamp as printed then). The figure box is left out: the second stamp is laid
  // over the figure on purpose (version 15). Each frame's boxes are also frame-checked with the camera of that frame
  // (punch and shake included).
  { const STAMPS = [{ name: '読み取れません 1', x: CX, y: CY + CH / 2 + 84, k: 4.6, t0: T_ERR[0], seed: 51 },
                    { name: '読み取れません 2', x: GIRL[0] + 10, y: GIRL[1] + 250, k: 3.6, t0: T_ERR[1], seed: 52 }];
    const mc = document.createElement('canvas'); mc.width = W; mc.height = 1080; const mx = mc.getContext('2d', { willReadFrequently: true });
    const inkBox = (s, age) => {
      mx.clearRect(0, 0, W, 1080); print16(mx, '読み取れません', s.x, s.y, s.k, age, s.seed, { frame: true, label: PAPER, slam: true });
      const d = mx.getImageData(0, 0, W, 1080).data; let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
      for (let yy = 0; yy < 1080; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] > 8) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      return x1 < 0 ? null : [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
    };
    // the neighbours: every box of Q2 but the figure (stamped over on purpose), the band region (its words, which are what
    // a stamp could hit, are in) and the card (replaced by one box round the card and its shadow), so the neighbours do not
    // overlap each other and every overlap reported is a stamp's
    const near = LAY.boxes.filter(b => ['q2', 'q2b', 'q2:print'].includes(b.sheet) && !['figure', 'band', 'card'].includes(b.name)).map(b => ({ ...b }));
    near.push({ name: 'card and its shadow', kind: 'region', box: [CX - CW / 2, CY - CH / 2, CW + 10, CH + 14] });
    const rows = [];
    for (const s of STAMPS) for (const t of frameTimes(SEG[0], s.t0, s.t0 + 4 * FR)) {
      const g0 = Math.round(t * 30), sheet = `q2:slam ${g0}`, age = t - s.t0, box = inkBox(s, age);
      if (!box) continue;
      LAY.text(`${s.name} as printed (age ${(age / FR).toFixed(2)} fr)`, sheet, box);
      for (const o of STAMPS) if (o !== s && t >= o.t0) { const ob = inkBox(o, t - o.t0); if (ob) LAY.text(`${o.name} as printed`, sheet, ob); }
      near.forEach(b => (b.kind === 'text' ? LAY.text : LAY.reg)(b.name, sheet, b.box));
      const [z, fx, fy] = camQ2(t), v = CAM.view(z, fx, fy, 0);
      rows.push({ g: g0, sheet, box, v, t, name: s.name, static: print16Box('読み取れません', s.x, s.y, s.k, { framed: true }) });
    }
    const bad = LAY.audit('seg_08a stamp slam (as printed, frame by frame)');
    for (const r of rows) LAY.frameCheck(`stamp slam frame ${r.g}`, { sheets: { [r.sheet]: flat }, views: [{ t: r.t, ...r.v }] });
    console.warn(`STAMP SLAM AUDIT seg_08a: ${rows.map(r => `${r.g} ${r.name} ink [${r.box.join(', ')}] (static frame box [${r.static.map(v => Math.round(v)).join(', ')}])`).join('; ')}; ${bad.length} overlaps`); }
  // 正解 now lands with print16's slam (22% large on the beat's frame, back in three): the same per-frame ink audit against
  // every box of page Q1 it could land on (the answer boxes, 注意, the band's words; the band region itself is left out)
  { const OK = { x: AX + 4 * AG + 150, y: AY + AS / 2, k: 5.1, t0: T_OK };
    const mc = document.createElement('canvas'); mc.width = W; mc.height = 1080; const mx = mc.getContext('2d', { willReadFrequently: true });
    // the texts as they are, and each ruled box (answer boxes, kanji box, 配点, 注意) as its four 4 px rules, so a box and the
    // words inside it are not reported against each other
    const q1b = LAY.boxes.filter(b => ['q1', 'q1b', 'q1n', 'q1:print'].includes(b.sheet) && !['band', '正解'].includes(b.name));
    const near = q1b.filter(b => b.kind === 'text').map(b => ({ ...b }));
    q1b.filter(b => b.kind !== 'text').forEach(({ name, box: [x, y, w, h] }) => [[x - 2, y - 2, w + 4, 4], [x - 2, y + h - 2, w + 4, 4], [x - 2, y + 3, 4, h - 6], [x + w - 2, y + 3, 4, h - 6]]
      .forEach((r, i) => near.push({ name: `${name} rule ${'tblr'[i]}`, kind: 'region', box: r })));
    const rows = [];
    for (const t of frameTimes(SEG[0], OK.t0, OK.t0 + 4 * FR)) {
      mx.clearRect(0, 0, W, 1080); print16(mx, '正解', OK.x, OK.y, OK.k, t - OK.t0, 41, { frame: true, slam: true, sung: true });
      const d = mx.getImageData(0, 0, W, 1080).data; let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
      for (let yy = 0; yy < 1080; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] > 8) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      if (x1 < 0) continue; const g0 = Math.round(t * 30), sheet = `q1:slam ${g0}`, box = [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
      LAY.text(`正解 as printed (frame ${g0})`, sheet, box); near.forEach(b => (b.kind === 'text' ? LAY.text : LAY.reg)(b.name, sheet, b.box));
      const [z, fx, fy] = camQ1(t); rows.push({ g: g0, sheet, box, t, v: CAM.view(z, fx, fy, 0) }); }
    const bad = LAY.audit('seg_08a 正解 slam (as printed, frame by frame)');
    for (const r of rows) LAY.frameCheck(`正解 slam frame ${r.g}`, { sheets: { [r.sheet]: flat }, views: [{ t: r.t, ...r.v }] });
    console.warn(`STAMP SLAM AUDIT seg_08a 正解: ${rows.map(r => `${r.g} ink [${r.box.join(', ')}]`).join('; ')}; ${bad.length} overlaps`); }

  // LYRIC AUDIT (lyrics.js): for every sung character this page shows, the first frame it reads (opacity >= 2/3), worked out
  // from the same gates renderAt uses; it must be the frame its onset falls in, at the latest
  const LYR = (() => { const frames = []; for (let g0 = F0; g0 < F1; g0++) frames.push(g0 / 30);
    const firstRead = alpha => { for (const tt of frames) if (alpha(tt) >= 2 / 3) return tt; return null; };
    const E = [];
    L1.forEach(([c, t]) => E.push({ c, t, readT: firstRead(tt => tt < TB && sungBuild(tt - t) >= 1 ? 1 : 0) }));
    L2.forEach(([c, t]) => E.push({ c, t, readT: firstRead(tt => tt >= TB && tt < TD && sungBuild(tt - t) >= 1 ? 1 : 0) }));
    SONO.forEach(p => E.push({ c: p.c, t: p.t, readT: firstRead(tt => tt >= TB && tt < TC ? sungBuild(tt - p.t) : 0) }));
    LET.forEach(L => { if (L.t >= TC) E.push({ c: L.c, t: L.t, readT: firstRead(tt => tt >= TC && tt < TD ? letAlpha(L, tt) : 0) }); });
    for (const second of [false, true]) shoutCol(second).half.forEach(([c, t]) =>
      E.push({ c, t, readT: firstRead(tt => (second ? tt >= TD2 : tt >= TD && tt < TD2) && tt < T_ER ? sungBuild(tt - t) : 0) }));
    // 「そ」 of line 22, printed by the shared big eraser page (print.js printSung) from k231
    LY.lineAt(22, 'そろばんでこの式が解けますか').filter(([, t]) => t < SEG[1]).forEach(([c, t]) =>
      E.push({ c, t, readT: firstRead(tt => tt >= T_ER && sungBuild(tt - t) >= 1 ? 1 : 0) }));
    return { ...lyricAudit('seg_08a', E), entries: E.map(e => ({ ...e, onsetFrame: Math.floor(e.t * 30 + 1e-6), readFrame: e.readT === null ? null : Math.round(e.readT * 30) })) }; })();
  // MOTION AUDIT (camera.js, 制作约定 第六节「整屏运动」): every frame's view as renderAt shows it (no shake anywhere), the first
  // frame of each shot marked as a cut (the segment's first frame, Q2 on k207, the shout on k223, the crying face on k227)
  const camAt = tt => tt < TB ? camQ1(tt) : tt < TD ? [...camQ2(tt), 0] : camShout(tt);
  const CUTS = [SEG[0], TB, TD, TD2].map(t => Math.ceil(t * 30 - 1e-6));
  const MOTION_V = frameTimes(SEG[0], SEG[0], SEG[1]).map(t => { const [z, fx, fy, sh = 0] = camAt(t); return { t, ...CAM.view(z, fx, fy, sh), cut: CUTS.includes(Math.round(t * 30)) }; });
  const MOTION_R = motionAudit('seg_08a', MOTION_V, { big: BIG, whips: WHIPS });
  publishAudit(S, LAY, { holdExceptions: HOLD_EXC, lyric: LYR, motion: MOTION_R, parts: PARTS });

  window.renderAt = async t => {
    const tt = t;                                   // no lead: on the hit, on the syllable
    if (tt < TB) {
      // ---- Q1: the kanji slams in on the bar line; the machine prints the reading on beat 205 and 正解 on 206 ----
      wg.drawImage(q1, 0, 0);
      printSung(wg, [['問', -1], ['一', -1], ['　', -1], ...L1], QX, QY, QS, tt);
      // a light print on the bar line k200: not there before it, whole on its first frame, no scale, no shake (version 15 had
      // it on from the first frame and let the camera punch make the beat; with the punch gone the beat is the print itself)
      if (tt >= T_KANJI) {
        wg.save(); wg.translate(KB[0] + KB[2] / 2, KB[1] + KB[3] / 2);
        textBox(wg, '憂鬱', '800 #px ShipporiX', [-KB[2] / 2 + 30, -KB[3] / 2 + 30, KB[2] - 60, KB[3] - 60], { maxSize: 380, align: 'center', color: GRAPHITE }); wg.restore(); }
      ['ゆ', 'う', 'う', 'つ'].forEach((c, i) => print16(wg, c, AX + i * AG + AS / 2, AY + AS / 2, 5.0, tt - T_ANS, 30 + i));
      // 正解 stamped on k206: whole on the beat's frame (sung: whole from age 0; the tt gate keeps it off the frame before the
      // beat) and landing with the slam (the camera does not move on it)
      if (tt >= T_OK) print16(wg, '正解', AX + 4 * AG + 150, AY + AS / 2, 5.1, tt - T_OK, 41, { frame: true, slam: true, sung: true });
      const [z, fx, fy, sh] = camQ1(tt); CAM.show(z, fx, fy, sh, tt);
    } else if (tt < TD) {
      // ---- Q2: her card drops in on the bar line, あの子 is marked on the next beat, 読み取れません on 213 and 214; then the push in
      // to the こころ oval, the pencil filling it, the black bursting out of it on 217 and covering the page step by step, her
      // words left white in it ----
      const black = tt >= TC;
      CAM.shoot(camQ2(tt), 0, tt, (c, z) => {
        drawQ2(c, tt, z);
        printSung(c, [['問', -1], ['二', -1], ['　', -1], ...L2], QX, QY, QS, tt);
        print16(c, '読み取れません', CX, CY + CH / 2 + 84, 4.6, tt - T_ERR[0], 51, { frame: true, label: PAPER, slam: true });
        print16(c, '読み取れません', GIRL[0] + 10, GIRL[1] + 250, 3.6, tt - T_ERR[1], 52, { frame: true, label: PAPER, slam: true });
        SONO.forEach(p => sonoChar(c, p, tt));               // her pencil その心, as she sings it (swallowed by the black)
        if (!black) { heartFill(c, smooth((tt - T_FILL) / (TC - 2 * FR - T_FILL))); return; }
        heartFill(c, 1);
        pencilFill(c, HEART[0], HEART[1], CL.rx * 1.2 * CS, CL.ry * 1.2 * CS, 900, rng(77), { dark: 1.4, over: 0.85 });
        const fr = frontAt(tt); blackOver(c, fr);
        LET.forEach(L => { if (letAlpha(L, tt) > 0) whiteLetter(c, L.c, L.x, L.y, L.size, tt - L.t, 'paper'); });
      });
    } else {
      // ---- おい誰なんだよ: head down from the first word, halfway up for half a beat, up to the sky on 225 (a small overshoot),
      // held while the camera pushes; then her crying face, opening for half a beat into the rounder shout on よ (230) ----
      if (tt >= T_ER || q.get('erTop')) {
        // k231 on: the big eraser rubs out the right column and waits beside her face (shared with 08b, web/lib/big_eraser.js)
        if (!ER.compose(wg, tt)) ER.drawShoutTop(wg, tt);
        const [z, fx, fy, sh] = camShout(tt); CAM.show(z, fx, fy, sh, tt); return;
      }
      wg.drawImage(GF, 0, 0);
      const R = S.at('rin', tt), im = IMG[R.file];            // the drawing on screen, from the timeline (= the hold audit)
      if (R.use === 'pose') pose(wg, im, 1300, 0.74, tt >= P_UP ? 1 + 0.015 * Math.exp(-(tt - P_UP) / 0.09) : 1);
      else { const s2 = 0.95, w = im.width * s2, h = im.height * s2; wg.drawImage(im, 700 - w / 2, 1080 - h + 30, w, h); }
      const { half, size, cx, y0 } = shoutCol(tt >= TD2);
      half.forEach(([c, tc], i) => whiteLetter(wg, c, cx, y0 + size * (i + 0.5), size, tt - tc, true));
      const [z, fx, fy, sh] = camShout(tt); CAM.show(z, fx, fy, sh, tt);
    }
  };
  await window.renderAt(P('t0', SEG[0]));
}
