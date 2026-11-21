// Demo 2: the first chorus, first half (1:14.0-1:26.28): 「黒板のこの漢字が読めますか / あの子の心象は読めますか /
// その心を黒く染めたのは / おい誰なんだよおい誰なんだよ」. The questions she sings ARE the test's questions: they are printed on the
// paper as she sings them. The rule of the film plays out: the school question is answered in one beat and printed 正解; the
// question about a person's heart cannot be read (読み取れません). Then the black: the heart oval on her classmate's card fills
// and the pencil black spreads over the page with her words, each left as paper-white letters in the black as she sings it;
// then she plays and shouts in the graphite while an eraser rubs on the beats and her shout is rubbed out in white.
// Every block is measured into its box; something happens on every beat; the camera pushes and punches with the music; her
// drawings change only on the beat; the camera never shows past the page.
// Confirmed by the user as version 15 (2026-11-20). Since the shared-library refactor (2026-11-20) the beat, lyrics, layout,
// camera, print and colours come from web/lib/; the frames are identical to version 15 (work/infra/refactor_diff.txt).
import { drawCard, CARD_RATIO } from '../lib/card.js';
import { BEAT, FRAME as FR, beatV, smooth, createScore, publishAudit } from '../lib/score.js';
import { loadLyrics } from '../lib/lyrics.js';
import { textBox, createLayout } from '../lib/type.js';
import { createCamera, pushes, move, punch, shakeOf, camLerp, frameTimes } from '../lib/camera.js';
import { print16, print16Box, printSung, whiteLetter } from '../lib/print.js';
import { PAPER, TEAL, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, REHATCH_DARK_RGB, REHATCH_LIGHT_RGB, INK_RGB,
         CARD_SHADOW, ERASER_STREAK, FIBRE_RGB, rgba } from '../lib/palette.js';

export async function c1a(H) {
  const { g, W, P, rng, img, rinPalImage, pencilFill } = H;
  const SEG = [74.0, 86.28];
  const LY = await loadLyrics({ within: SEG });
  const L1 = LY.line('黒板のこの漢字が読めますか'), L2 = LY.line('あの子の心象は読めますか'), L3 = LY.line('その心を黒く染めたのは');
  const L4 = LY.line('おい誰なんだよおい誰なんだよ');
  // Q2 from 207; the camera pushes in to the こころ oval from 215, the pencil fills it from the bar line 216; the black bursts out on
  // 217 while the camera is thrown back to the page by 219; the shout from 223, her crying face from 227
  const TB = beatV(207), TPI = beatV(215), T_FILL = beatV(216), TC = beatV(217), TPB = beatV(219), TD = beatV(223), TD2 = beatV(227), T_CARD = beatV(208), T_LEADER = beatV(209);

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
    tb(s, title, '700 #px ZenKakuB', [56, 44, 520, 66], { maxSize: 48, color: PAPER, name: 'title', sheet: key + 'b' });
    tb(s, '令和八年度　読取確認テスト', '500 #px ZenKaku', [w - 580, 54, 512, 46], { maxSize: 28, align: 'right', color: PAPER, name: 'test', sheet: key + 'b' });
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
  const CL = drawCard(cardC, { name: '佐倉　みなみ', id: '2613', dev: '58', seed: 23, serial: '2026-2613', heart: 'empty' });
  const BIGW = 3600, [cardBig] = mk(BIGW, Math.round(BIGW / CARD_RATIO));                 // the same card for the close-up, sharp
  drawCard(cardBig, { name: '佐倉　みなみ', id: '2613', dev: '58', seed: 23, serial: '2026-2613', heart: 'empty' });

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
  const LET = []; { const rows = [L3.slice(0, 6), L3.slice(6)], size = 92;
    rows.forEach((row, ri) => row.forEach(([c, t], i) => LET.push({ c, t, x: HEART[0] + 70 + i * size * 1.04, y: HEART[1] - 60 + ri * size * 1.2, size }))); }
  LET.forEach(L => { L.d = Math.hypot(L.x - HEART[0], L.y - HEART[1]) + L.size * 1.25; });
  const STR = []; { const r = rng(61);
    for (let pass = 0; pass < 1; pass++) for (let gy = -40; gy < 1120; gy += 11) for (let gx = -60; gx < W + 60; gx += 20) {
      const x = gx + (r() - 0.5) * 20, y = gy + (r() - 0.5) * 12, d0 = Math.hypot(x - HEART[0], y - HEART[1]);
      const n = 0.5 * Math.sin(x * 0.006 + y * 0.004) + 0.5 * Math.sin(x * 0.011 - y * 0.009);
      STR.push({ x, y, d: d0 * (1 + 0.12 * n) + r() * 30 + pass * 40, len: 50 + r() * 60, ang: (pass ? 0.55 : -0.5) + (r() - 0.5) * 0.16, w: 3 + r() * 4, a: 0.6 + r() * 0.3 }); }
    STR.sort((a, b) => a.d - b.d); }
  const DMAX = STR[STR.length - 1].d;
  // the black goes one step further on every beat from TC: far enough to cover every word she sings before the next beat
  // (at least 150 px a step), and nearly the whole page on the last step
  const BSTEPS = []; { let m = 0;
    for (let k = 217; k <= 222; k++) { const tNext = beatV(k + 1); let need = m;
      LET.forEach(L => { if (L.t < tNext) need = Math.max(need, L.d); });
      m = k === 222 ? DMAX * 0.93 : Math.max(need, m + 150); BSTEPS.push([beatV(k), m]); } }
  const frontAt = t => { let r = 0, prev = 0; for (const [t0, m] of BSTEPS) { if (t < t0) break; const u = 1 - Math.pow(1 - Math.min(1, (t - t0) / (BEAT * 0.6)), 3); r = prev + (m - prev) * u; prev = m; } return r; };
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
  const S = createScore('c1a', { t0: SEG[0], t1: SEG[1] });
  const ev = S.ev;
  ev('cut Q2', TB); ev('push in to the heart', TPI); ev('heart fill', T_FILL); ev('black bursts, camera thrown back', TC); ev('pull back ends', TPB);
  ev('cut shout', TD); ev('cut crying face', TD2);
  const T_KANJI = ev('kanji', beatV(200)), T_ANS = ev('answer printed', beatV(205)), T_OK = ev('正解', beatV(206));
  // 読み取れません as she asks and on the beat she ends the question, so both are read before the camera moves in
  const T_ERR = [ev('読み取れません 1', beatV(213)), ev('読み取れません 2', beatV(214))];
  ev('card drops', T_CARD); ev('leader line', T_LEADER);
  const push = pushes(S, [[beatV(200), beatV(207), 0.07, 'push Q1'], [beatV(208), TPI, 0.06, 'push Q2'],
                          [TPB, TD, 0.04, 'push black'], [TD, TD2, 0.06, 'push shout'], [TD2, beatV(232), 0.06, 'push face']]);
  move(S, 'fly in to the heart', TPI, TC); move(S, 'thrown back to the page', TC, TPB);
  BSTEPS.forEach(([t], i) => ev(`black step ${i}`, t));
  const T_BAR = ev('bar line 228 (camera hit)', beatV(228));

  // ---------- the drawings' timeline: decides which drawing is on screen, and is the hold audit ----------
  // First shout: head down 223, the in-between from 224.5 (half a beat), head up on 225; second shout: the crying face 227,
  // the in-between from 229.5 (half a beat), the rounder shout on 230 (よ). Key drawings and shots at least two beats, an
  // in-between at least half a beat, so it reads as a movement and never flashes.
  S.hold('shot', 'shot Q1', P('t0', 74.0), TB, { kind: 'shot', onBeat: false });
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
  S.finish();
  for (const h of S.holds) if (h.file && !IMG[h.file]) throw new Error(`c1a: ${h.file} is in the timeline but not loaded (add it to DRAW)`);

  // ---------- camera ----------
  const CAM = createCamera(g, { W, H: 1080, bg: GRAPHITE }), wg = CAM.wg;
  function pose(ctx, im, cx, s = 0.74, os = 1) { const w = im.width * s, h = im.height * s;
    ctx.save(); ctx.translate(cx, 700); ctx.scale(os, os); ctx.translate(-cx, -700); ctx.drawImage(im, cx - w / 2, 12, w, h); ctx.restore(); }

  // ---------- Q2 and the black are one continuous camera move, no cut ----------
  // From 215 it pushes in to the こころ oval (4x by 217, slowing into it) while the pencil fills the oval as she sings 心; on 217
  // the black bursts out of the oval and the camera is thrown back (fast, then settling) to the whole page by 219. The oval
  // area travels in a straight line on screen while the zoom changes evenly, so nothing drifts the wrong way. It is drawn straight
  // into the frame at full resolution, so the close view stays sharp.
  // In close the frame holds こころ, the oval and 「← 必ずぬりつぶすこと」, and ends above the 読み取れません box under the card.
  const ZC = 4.0, TGT = [HEART[0] + 60, HEART[1] - 40];
  function camQ2(tt) {
    if (tt < TPI) return [push(1, tt) + punch(tt, [T_CARD], 0.02), 960, 560];
    if (tt < TC) return camLerp(1 + push.amount(1), [960, 560], ZC, TGT, smooth((tt - TPI) / (TC - TPI)), TGT);
    if (tt < TPB) return camLerp(ZC, TGT, 1, [960, 540], 1 - Math.pow(1 - (tt - TC) / (TPB - TC), 3), TGT);
    return [push(2, tt), 960, 540];
  }
  const camQ1 = tt => [push(0, tt) + punch(tt, [T_KANJI, T_OK], 0.018), 960, 560, shakeOf(tt, [T_KANJI, T_OK], 5)];
  const camQ2Shake = tt => shakeOf(tt, T_ERR, 6) + shakeOf(tt, [TC], 5);
  const camShout = tt => { const second = tt >= TD2;
    return [second ? push(4, tt) + punch(tt, [T_BAR], 0.014) : push(3, tt) + punch(tt, [P_UP], 0.01), 960, 540, shakeOf(tt, second ? [T_BAR] : [P_UP], 3)]; };
  // the こころ oval filled in pencil, left to right as p goes 0 -> 1, with the same strokes as the card's other marks
  function heartFill(ctx, p) {
    if (p <= 0) return; const rx = CL.rx * CS, ry = CL.ry * CS;
    ctx.save(); ctx.beginPath(); ctx.rect(HEART[0] - rx * 1.4, HEART[1] - ry * 1.6, rx * 2.8 * p, ry * 3.2); ctx.clip();
    pencilFill(ctx, HEART[0], HEART[1], rx * 1.15, ry * 1.15, CW, rng(77), { dark: 1.15, over: 0.04 }); ctx.restore();
  }
  // each of her words shows when it is sung, or, if it was sung before the black got there (その心), the moment the front passes it
  LET.forEach(L => { L.tc = Infinity; for (let t = TC; t < TD; t += FR / 4) if (frontAt(t) >= L.d) { L.tc = t; break; } });
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
    for (const second of [false, true]) { const { half, size, cx, y0 } = shoutCol(second);
      LAY.text(`shout ${second ? 2 : 1}`, 'shout', [cx - size * 0.5, y0, size, size * half.length]); } }
  LAY.audit('c1a pages');
  const flat = p => p;                      // the pages are drawn at world = page coordinates
  const views = (cam, a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy, sh = 0] = cam(t); return { t, ...CAM.view(z, fx, fy, sh) }; });
  LAY.frameCheck('shot Q1', { sheets: { q1: flat, q1b: flat, q1n: flat, 'q1:print': flat }, views: views(camQ1, SEG[0], TB) });
  // Q2 is checked until the push in to the こころ oval: from 215 the camera flies into the card on purpose (4x), and from 217
  // the black covers the page, so only her white words are checked there
  LAY.frameCheck('shot Q2 (until the push)', { sheets: { q2: flat, q2b: flat, 'q2:print': flat, 'q2:stamp': flat }, views: views(tt => [...camQ2(tt), camQ2Shake(tt)], TB, TPI) });
  LAY.frameCheck('black page (after the pull back)', { sheets: { 'q2:white': flat }, views: views(tt => [...camQ2(tt), camQ2Shake(tt)], TPB, TD) });
  LAY.frameCheck('shot shout', { sheets: { shout: flat }, views: views(camShout, TD, SEG[1]) });
  publishAudit(S, LAY);

  window.renderAt = async t => {
    const tt = t;                                   // no lead: on the hit, on the syllable
    if (tt < TB) {
      // ---- Q1: the kanji slams in on the bar line; the machine prints the reading on beat 205 and 正解 on 206 ----
      wg.drawImage(q1, 0, 0);
      printSung(wg, [['問', -1], ['一', -1], ['　', -1], ...L1], QX, QY, QS, tt);
      { const a = tt - T_KANJI, sc = a < 0 ? 1 : 1 + 0.06 * Math.pow(1 - Math.min(1, a / (3 * FR)), 2);
        wg.save(); wg.translate(KB[0] + KB[2] / 2, KB[1] + KB[3] / 2); wg.scale(sc, sc);
        textBox(wg, '憂鬱', '800 #px ShipporiX', [-KB[2] / 2 + 30, -KB[3] / 2 + 30, KB[2] - 60, KB[3] - 60], { maxSize: 380, align: 'center', color: GRAPHITE }); wg.restore(); }
      ['ゆ', 'う', 'う', 'つ'].forEach((c, i) => print16(wg, c, AX + i * AG + AS / 2, AY + AS / 2, 5.0, tt - T_ANS, 30 + i));
      print16(wg, '正解', AX + 4 * AG + 150, AY + AS / 2, 5.1, tt - T_OK, 41, { frame: true, slam: true });
      const [z, fx, fy, sh] = camQ1(tt); CAM.show(z, fx, fy, sh, tt);
    } else if (tt < TD) {
      // ---- Q2: her card drops in on the bar line, あの子 is marked on the next beat, 読み取れません on 213 and 214; then the push in
      // to the こころ oval, the pencil filling it, the black bursting out of it on 217 and covering the page step by step, her
      // words left white in it ----
      const black = tt >= TC;
      CAM.shoot(camQ2(tt), camQ2Shake(tt), tt, (c, z) => {
        drawQ2(c, tt, z);
        printSung(c, [['問', -1], ['二', -1], ['　', -1], ...L2], QX, QY, QS, tt);
        print16(c, '読み取れません', CX, CY + CH / 2 + 84, 4.6, tt - T_ERR[0], 51, { frame: true, label: PAPER, slam: true });
        print16(c, '読み取れません', GIRL[0] + 10, GIRL[1] + 250, 3.6, tt - T_ERR[1], 52, { frame: true, label: PAPER, slam: true });
        if (!black) { heartFill(c, smooth((tt - T_FILL) / (TC - 2 * FR - T_FILL))); return; }
        heartFill(c, 1);
        pencilFill(c, HEART[0], HEART[1], CL.rx * 1.2 * CS, CL.ry * 1.2 * CS, 900, rng(77), { dark: 1.4, over: 0.85 });
        const fr = frontAt(tt); blackOver(c, fr);
        LET.forEach(L => { if (tt >= L.t && fr >= L.d) whiteLetter(c, L.c, L.x, L.y, L.size, tt - Math.max(L.t, L.tc), 'paper'); });
      });
    } else {
      // ---- おい誰なんだよ: head down from the first word, halfway up for half a beat, up to the sky on 225 (a small overshoot),
      // held while the camera pushes; then her crying face, opening for half a beat into the rounder shout on よ (230) ----
      wg.drawImage(GF, 0, 0);
      const R = S.at('rin', tt), im = IMG[R.file];            // the drawing on screen, from the timeline (= the hold audit)
      if (R.use === 'pose') pose(wg, im, 1300, 0.74, tt >= P_UP ? 1 + 0.015 * Math.exp(-(tt - P_UP) / 0.09) : 1);
      else { const s2 = 0.95, w = im.width * s2, h = im.height * s2; wg.drawImage(im, 700 - w / 2, 1080 - h + 30, w, h); }
      const { half, size, cx, y0 } = shoutCol(tt >= TD2);
      half.forEach(([c, tc], i) => whiteLetter(wg, c, cx, y0 + size * (i + 0.5), size, tt - tc, true));
      const [z, fx, fy, sh] = camShout(tt); CAM.show(z, fx, fy, sh, tt);
    }
  };
  await window.renderAt(P('t0', 74.0));
}
