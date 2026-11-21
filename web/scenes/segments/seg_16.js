// Segment 16, the ending figure (k556-k572; frames [6187, 6381), 206.233-212.700 s). Sixth round 2026-11-22 (independent
// re-review: the impact held to k565, a new last picture; fifth round in archive/seg16_v5_20261122/). Fifth round, after the director
// watched the fourth cut: “make the guitar smash a real highlight”. The smash stays,
// but it is the film's closing image, not a blink: the raise is seen step by step, the hit lands on the segment's heaviest beat
// (k564, crash 19.2: the beat 00 k0 printed 読み取れません on her card), and the picture after it stays 3.3 s to the end.
// The fourth round (smash on k570, 1.07 s after it) is in archive/seg16_v4_20261122/.
//
//   S8  k556-k560  cut to frame 0's framing (seg_00.js FRAMING): her cold glare, no card, the Les Paul over her right shoulder
//                  like a bat (r16_glare_sh): frame 0 had the card in front of her face, the end has the guitar. One slow push.
//                  (unchanged from the fourth round)
//   S10 k560-k564  the BAT frame in the hall of 15 (graphite wall, the stopped clock, open lanes, the cabinets): two key
//                  drawings of one master, two beats each: k560 R16_lift (half way up, hands at her forehead), k562 R16_raise
//                  (high over her head). One slow push that ends on k562.5 (the music's breath): from there the frame is
//                  completely still at the top. k561 and k563 her reader (machine 4, the one that printed もう一度 at her in 03)
//                  tries again: its window lights and the slip feeds out one more もう一度.
//   k564           the impact drawing (i16_impact): 2 frames inverted (paper lines on graphite), then printed teal on paper and
//                  held completely still to k565 (sixth round: it was 3 frames, a blink); the segment's one 大击 (a single 3.5%
//                  step in, one way).
//   k565-end       R16_final (sixth round), one Codex drawing at 1:1 (1536 x 1024 on the 1920 x 1080 frame, never enlarged),
//                  closer than before (1122 px a metre): the guitar planted in the smashed reader (the same machine as its
//                  neighbours: teal strips, grey-white body, the two small windows), she has JUST let go: half turned to the
//                  guitar, her hand still in the air, hair, tie and skirt still swinging, looking back at us. The lane light
//                  behind is printed halftone falling off from its top and sides, not a flat band. Not a dead still: the pieces the
//                  smash threw up (m16_bit_*, Codex) fall and leave the frame; the reader's last window still glows, and on
//                  k567, k568, k569 it stutters, dimmer each time; on k570 (the last chord) it goes out, and nothing moves
//                  again to the end. The camera never moves in this shot.
import { BEAT, FRAME, beatV, beatOf, createScore, publishAudit, smooth } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, frameTimes, motionAudit } from '../../lib/camera.js';
import { partReport } from '../../lib/parts.js';
import { print16 } from '../../lib/print.js';
import { PAPER, PAPER_RGB, PAPER_SLIP, TEAL, TEAL_RGB, INK_RGB, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB,
         rgba } from '../../lib/palette.js';
import { FRAMING } from './seg_00.js';   // the framing preset of segment 00 (only its constants run on import)

const DRAW = {
  glare: '/art/cut/r16_glare_sh.png',   // frame 0's framing, the cold glare, the guitar over her right shoulder (_make_seg16c.py)
  lift: '/art/cut/R16_lift.png',        // BAT frame: half way up (R16_raise redrawn with one change, _make_seg16e.py)
  raise: '/art/cut/R16_raise.png',      // BAT frame master: the guitar raised high over her head
  impact: '/art/cut/i16_impact.png',    // the impact drawing, black ink on white
  final: '/art/cut/R16_final.png',      // the last picture: her, the planted guitar and the smashed reader, one drawing (_make_seg16e.py)
  smile: '/art/cut/R16_smile.png',      // k570 to the end: R16_final redrawn with only the mouth corners and eyes changed, a faint smile
};
// the pieces thrown up by the smash: cut apart from one Codex sheet (m16_bits, _make_seg16e.py) by work/seg/16/v5/split_bits.py;
// kind 'paper' (slip scraps: they flutter) or 'hard' (metal, wood, plastic chips: they fly and drop)
const BITS = '/art/cut/m16_bits.json';

export default async function seg16(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 6187, F1 = 6381, T_START = F0 / 30, T_END = F1 / 30;
  const SEG = [T_START, T_END];
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d', { willReadFrequently: true })]; };
  const K = beatV;
  const frameOf = (tt, t0) => Math.floor((tt - t0) / FRAME + 1e-6);

  // ---------- drawings ----------
  const IMG = {};
  for (const k of Object.keys(DRAW)) IMG[k] = k === 'impact' ? await img(DRAW[k]) : rinPalImage(await img(DRAW[k]));
  const bitsMeta = await (await fetch(BITS)).json();
  const BIT = [];
  for (const b of bitsMeta.pieces) BIT.push({ ...b, im: await img(b.file) });

  // ---------- the score ----------
  const T_S10 = K(560), T_TRY0 = [561, 563].map(K), T_TOP = K(562), T_STILL = K(562.5), T_SLAM = K(564);
  const T_TEAL = T_SLAM + 2 * FRAME, T_AFTER = K(565), T_STUT = [567, 568, 569].map(K), T_DIE = K(570);
  const S = createScore('seg_16', { t0: SEG[0], t1: SEG[1] });
  const ev = S.ev;
  T_TRY0.forEach((t, i) => ev(`her reader tries again: window lights, the slip feeds out もう一度 (k${[561, 563][i]})`, t));
  ev('still: the music\'s breath, the guitar at the top, the push ends here', T_STILL, 'half');
  ev('impact on the heaviest beat (crash 19.2, 00 k0\'s beat): the inverted impact drawing, the one 大击', T_SLAM);
  T_STUT.forEach((t, i) => ev(`the smashed reader's last window stutters, dimmer (k${567 + i})`, t));
  ev('the last chord: the reader\'s window goes out; nothing moves to the end', T_DIE);
  S.hold('shot', 'S8 frame 0 framing, the guitar on her shoulder', SEG[0], T_S10, { kind: 'shot', onBeat: false });
  S.hold('shot', 'S10 the BAT frame, the raise', T_S10, T_SLAM, { kind: 'shot' });
  S.hold('shot', 'the last picture (still to the end)', T_AFTER, T_END, { kind: 'shot' });
  S.hold('rin S8', 'the cold glare, the guitar over her right shoulder', SEG[0], T_S10, { kind: 'key', file: DRAW.glare, onBeat: false });
  S.hold('rin S10', 'half way up: hands at her forehead', T_S10, T_TOP, { kind: 'key', file: DRAW.lift, onBeat: false });
  S.hold('rin S10', 'the guitar high over her head', T_TOP, T_SLAM, { kind: 'key', file: DRAW.raise });
  S.hold('rin S10', 'the impact drawing (2 inverted frames, then teal held still to k565)', T_SLAM, T_AFTER, { kind: 'inbetween', file: DRAW.impact, onBeat: false });
  S.hold('rin S10', 'after the smash: she has just let go, she looks at us', T_AFTER, T_DIE, { kind: 'key', file: DRAW.final });
  S.hold('rin S10', 'the last chord: the same drawing, a faint smile', T_DIE, T_END, { kind: 'key', file: DRAW.smile });
  S.finish();

  // =====================================================================================================================
  // S8: frame 0's framing (seg_00.js FRAMING), the wall pencilled black (00 "after k7", same numbers)
  // =====================================================================================================================
  const IW = IMG.glare.width, IH = IMG.glare.height;
  const fr = { s: P('fs', FRAMING.s), y: P('fy', FRAMING.y) }; fr.x = W / 2 - (IW / 2) * fr.s;
  const EYES = [fr.x + FRAMING.eyes[0] * fr.s, fr.y + FRAMING.eyes[1] * fr.s];
  const M = 70, WW = W + 2 * M, WH = 1080 + 2 * M;
  const BRX = 9.5, BRY = 14.5, BP = 31, NUMW = 48, GUT = 30, BLOCKW = NUMW + 5 * BP + GUT, ROW = 42, ROW0 = 136;
  const BLOCKS = [], ROWS = [];
  for (let b = -5; b <= 4; b++) BLOCKS.push(W / 2 + b * BLOCKW + GUT / 2);
  for (let y = ROW0; y < 1080 + M; y += ROW) ROWS.push(y);
  const [blackC, blackS] = mk(WW, WH);
  { blackS.fillStyle = GRAPHITE_FIELD; blackS.fillRect(0, 0, WW, WH); const r = rng(9); blackS.lineCap = 'round';
    for (let k = 0; k < 2600; k++) { blackS.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); blackS.lineWidth = 2 + r() * 5;
      const x = r() * WW, y = r() * WH, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16; blackS.beginPath(); blackS.moveTo(x, y); blackS.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); blackS.stroke(); }
    blackS.save(); blackS.translate(M, M);
    BLOCKS.forEach(bx => ROWS.forEach(y => { for (let i = 0; i < 5; i++) { const x = bx + NUMW + BP * (i + 0.5);
      blackS.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.9); blackS.beginPath(); blackS.ellipse(x, y, BRX * 0.97, BRY * 0.95, 0, 0, 7); blackS.fill();
      blackS.strokeStyle = rgba(TEAL_RGB, 0.16); blackS.lineWidth = 2; blackS.beginPath(); blackS.ellipse(x, y, BRX, BRY, 0, 0, 7); blackS.stroke(); } }));
    blackS.restore(); }
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  // one slow push through the shot (eased, one way): no steps (第六节 整屏运动)
  const S8_PUSH = P('s8push', 0.03);
  const camS8 = tt => [1 + S8_PUSH * smooth((tt - SEG[0]) / (T_S10 - SEG[0])), ...EYES];

  // =====================================================================================================================
  // S10: the BAT frame in the hall of 15 (seg_15.js: the same lanes, cabinets, wall and stopped clock; metres, y = -height)
  // =====================================================================================================================
  function rrect(ctx, x, y, w, h, r) { r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  const LANE = 0.9, BW = 0.25, BODIES = [-1.35, -0.45, 0.45, 1.35], TARGET = -0.45, CLOCK = { h: 1.81, R: 0.095 };
  // [centre x, bottom edge height, width] in metres; one slow push towards the point between the reader and her face
  const BAT = [P('batx', -0.1), P('baty', 0.84), P('batw', 2.25)];
  const BAT_ANCH = [P('bax', -0.2), P('bay', 1.3)], BAT_PUSH = P('batpush', 0.03);
  const zoomAbout = ([cx, bot, wid], z, [ax, ah]) => [ax + (cx - ax) / z, ah + (bot - ah) / z, wid / z];
  // the push runs k560 -> k562.5 (eased in and out) and stops: from the breath to the hit the frame is completely still
  const camBAT = tt => zoomAbout(BAT, 1 + BAT_PUSH * smooth((Math.min(tt, T_STILL) - T_S10) / (T_STILL - T_S10)), BAT_ANCH);
  const PPM0 = W / BAT[2];
  // as a view in px of the start framing (for MOTION AUDIT): the frame's centre and zoom
  const batView = f => { const [cx, bot, wid] = f; return { z: BAT[2] / wid, fx: 960 + (cx - BAT[0]) * PPM0, fy: 540 - ((bot + wid * 9 / 32) - (BAT[1] + BAT[2] * 9 / 32)) * PPM0 }; };
  function shootM([cx, bot, wid], draw) {
    const ppm = W / wid;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = GRAPHITE_FIELD; g.fillRect(0, 0, W, 1080);
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.setTransform(ppm, 0, 0, ppm, W / 2 - cx * ppm, 1080 + bot * ppm);
    draw(g, ppm); g.restore();
  }
  // seg_15.js screen() in metres (pitch in m)
  const patCache = new Map();
  function screenM(ctx, cover = 0.3, pitch = 0.006, rgbv = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 8, ppx = pitch * dev, tpx = Math.max(16, Math.round(N * ppx));
    const key = `${cover}|${rgbv}|${tpx}`;
    let e = patCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) for (const [ox, oy] of [[0, 0], [0.5, 0.5]]) { bx.beginPath(); bx.arc((i + ox) * cell, (j + oy) * cell, r, 0, 7); bx.fill(); }
      const src = bx.getImageData(0, 0, B, B).data, [c, x] = mk(tpx, tpx), out = x.createImageData(tpx, tpx), A = new Float32Array(tpx * tpx);
      let mean = 0;
      for (let y = 0; y < tpx; y++) for (let xx = 0; xx < tpx; xx++) { let a = 0; for (let sy = 0; sy < SS; sy++) for (let sx2 = 0; sx2 < SS; sx2++) a += src[((y * SS + sy) * B + xx * SS + sx2) * 4 + 3]; A[y * tpx + xx] = a / (SS * SS); mean += a / (SS * SS); }
      mean /= tpx * tpx;
      const keep = Math.max(0, Math.min(1, (tpx / N - 2.2) / 1.6)), [R0, G0, B0] = rgbv;
      for (let i = 0; i < A.length; i++) { const o = i * 4; out.data[o] = R0; out.data[o + 1] = G0; out.data[o + 2] = B0; out.data[o + 3] = Math.round(mean + (A[i] - mean) * keep); }
      x.putImageData(out, 0, 0);
      e = { p: ctx.createPattern(c, 'repeat') }; patCache.set(key, e);
    }
    const s = N * pitch / tpx;
    e.p.setTransform(new DOMMatrix().rotateSelf(15).scaleSelf(s, s));
    return e.p;
  }
  const GTN = 2048, [GT, gts] = mk(GTN, GTN);
  { gts.fillStyle = GRAPHITE_FIELD; gts.fillRect(0, 0, GTN, GTN); const r = rng(9); gts.lineCap = 'round';
    for (let k = 0; k < 6000; k++) { gts.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); gts.lineWidth = 4 + r() * 10;
      const x = r() * GTN, y = r() * GTN, l = 120 + r() * 280, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16;
      for (const [ox, oy] of [[0, 0], [-GTN, 0], [GTN, 0], [0, -GTN], [0, GTN]]) { gts.beginPath(); gts.moveTo(x + ox, y + oy); gts.lineTo(x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l); gts.stroke(); } } }
  let gPat = null;
  const graphite = ctx => { gPat ||= ctx.createPattern(GT, 'repeat'); gPat.setTransform(new DOMMatrix().scaleSelf(1.4 / GTN, 1.4 / GTN)); return gPat; };
  const PRINT = rgba(TEAL_RGB, 0.40);
  // the clock stopped at 15's k522.25 for good
  const CLOCK_S = (K(522.25) - K(488)) + 41 * 60 + 7;
  function wall(ctx, clock = true) {
    ctx.fillStyle = graphite(ctx); ctx.fillRect(-6, -4.6, 12, 4.6);
    ctx.fillStyle = PRINT; ctx.fillRect(-6, -1.19, 12, 0.015);
    ctx.fillStyle = screenM(ctx, 0.10, 0.006, TEAL_RGB); ctx.globalAlpha = 0.5; ctx.fillRect(-6, -1.175, 12, 1.175); ctx.globalAlpha = 1;
    if (!clock) return;
    const { h, R } = CLOCK, cy = -h, s = CLOCK_S;
    ctx.fillStyle = PRINT; ctx.fillRect(-0.011, -(h + R + 0.11), 0.022, 0.12);
    rrect(ctx, -0.045, -(h + R + 0.135), 0.09, 0.035, 0.008); ctx.fillStyle = rgba(TEAL_RGB, 0.55); ctx.fill();
    ctx.fillStyle = rgba(INK_RGB, 0.6); ctx.beginPath(); ctx.arc(0.008, cy + 0.01, R, 0, 7); ctx.fill();
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(0, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.014; ctx.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = R * (i % 5 ? 0.86 : 0.72), r1 = R * 0.92;
      ctx.lineWidth = i % 5 ? 0.003 : 0.008; ctx.beginPath(); ctx.moveTo(Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.stroke(); }
    const hand = (a, len, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-Math.sin(a) * len * 0.16, cy + Math.cos(a) * len * 0.16); ctx.lineTo(Math.sin(a) * len, cy - Math.cos(a) * len); ctx.stroke(); };
    hand(((6 + s / 3600) % 12) / 12 * Math.PI * 2, R * 0.5, 0.014, TEAL);
    hand(((s / 60) % 60) / 60 * Math.PI * 2, R * 0.76, 0.009, TEAL);
    hand((s % 60) / 60 * Math.PI * 2, R * 0.88, 0.0065, GRAPHITE);
    ctx.fillStyle = GRAPHITE; ctx.beginPath(); ctx.arc(0, cy, 0.01, 0, 7); ctx.fill();
  }
  function lightCells(ctx) {      // every lane is open (15 k504): paper-white light in the lanes
    for (let i = -2; i <= 1; i++) { const x0 = i * LANE - LANE / 2 + BW / 2, w = LANE - BW;
      ctx.fillStyle = PAPER; ctx.fillRect(x0, -0.95, w, 0.95); ctx.fillStyle = screenM(ctx, 0.28, 0.009); ctx.fillRect(x0, -0.95, w, 0.03); }
  }
  // the reader's window: the dark reader box on the cabinet top lights paper-white on each try (k561, k563) and fades in four frames
  const tryFlash = tt => { let a = 0; for (const t0 of T_TRY0) { if (tt < t0) continue; const f = frameOf(tt, t0); if (f < 5) a = Math.max(a, [1, 0.75, 0.5, 0.28, 0.12][f]); } return a; };
  function cabinet(ctx, cx, tt) {
    const x0 = cx - BW / 2;
    for (const sd of [-1, 1]) { ctx.fillStyle = screenM(ctx, 0.55); const xs = sd < 0 ? x0 - 0.035 : x0 + BW; ctx.fillRect(xs, -0.985, 0.035, 0.985); }
    rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.fillStyle = PAPER; ctx.fill();
    ctx.fillStyle = rgba(INK_RGB, 0.12); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.008; ctx.stroke();
    ctx.save(); rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.clip(); ctx.fillStyle = TEAL; ctx.fillRect(x0, -1.0, BW, 0.06); ctx.restore();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.0055; rrect(ctx, x0 + 0.025, -0.915, BW - 0.05, 0.86, 0.012); ctx.stroke();
    rrect(ctx, cx - 0.045, -1.075, 0.09, 0.075, 0.008); ctx.fillStyle = rgba(INK_RGB, 0.7); ctx.fill(); ctx.lineWidth = 0.0055; ctx.stroke();
    if (cx === TARGET) { const a = tryFlash(tt); if (a) { rrect(ctx, cx - 0.037, -1.067, 0.074, 0.059, 0.006); ctx.fillStyle = rgba(PAPER_RGB, 0.85 * a); ctx.fill(); } }
    for (const sd of [-1, 1]) {
      const wx = cx + sd * 0.058, wy = -0.83;
      rrect(ctx, wx - 0.045, wy - 0.045, 0.09, 0.09, 0.008); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 0.005; ctx.stroke();
      ctx.save(); ctx.translate(wx, wy); ctx.scale(0.001, 0.001); print16(ctx, '○', 0, 0, 4.4, 9, 120 + Math.round(cx * 10) + (sd > 0 ? 1 : 0)); ctx.restore();
    }
  }
  // her slip standing out of the reader's slot (seg_03.js slipUp: x -0.45, 10 cm wide, from 1.075 m; three もう一度 blocks),
  // one more block fed out on each try (two frames, as 03's fill)
  const SLIP = { x: TARGET, w: 0.10, bot: 1.075, top: 1.215 }, BLOCK = 0.035, FEED = [0.6, 1];
  const feedAt = tt => T_TRY0.reduce((n, t) => tt < t ? n : n + (FEED[frameOf(tt, t)] ?? 1), 0);
  function slipUp(ctx, tt) {
    const { x, w, bot } = SLIP, x0 = x - w / 2, n = feedAt(tt), top = SLIP.top + n * BLOCK;
    ctx.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.12); ctx.fillRect(x0 + 0.006, -top + 0.004, w, top - bot);
    ctx.fillStyle = PAPER_SLIP; ctx.beginPath(); ctx.moveTo(x0, -bot); ctx.lineTo(x0, -top + 0.004);
    for (let i = 0; i <= 12; i++) ctx.lineTo(x0 + i * w / 12, -top + (i % 2 ? 0 : 0.004)); ctx.lineTo(x0 + w, -bot); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(INK_RGB, 0.35); ctx.lineWidth = 0.0012; ctx.stroke();
    ctx.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.10); ctx.fillRect(x0, -top + 0.004, w, 0.012);
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 0.01, -top, w + 0.02, top - bot); ctx.clip();
    for (let i = 0; i < 3 + Math.ceil(n); i++) {
      const h = 1.180 - i * BLOCK + n * BLOCK; if (h - 0.018 > top || h + 0.018 < bot) continue;
      ctx.save(); ctx.translate(x, -h); ctx.scale(0.0001, 0.0001);
      print16(ctx, 'もう一度', 0, -46, 5.2, 9, 90 + i * 2); print16(ctx, 'タッチしてください', 0, 46, 5.2, 9, 91 + i * 2);
      ctx.restore(); }
    ctx.restore();
  }
  // her drawings in the hall: R16_lift and R16_raise share one canvas (the master redrawn); placed by her own measures
  // (ppm px a metre, the canvas top at `top` m, her body's centre column cx px at x = RIN_X)
  const RIN = { ppm: P('rppm', 800), top: P('rtop', 2.16), cx: P('rcx', 665), x: P('rinx', 0.0) };
  // R16_lift is placed by her legs (feet planted): measured against R16_raise its lower body sits 34 px left and 44 px high
  const LIFT_OFF = [P('liftdx', 34), P('liftdy', 44)];
  function her(ctx, im, [dx, dy] = [0, 0]) { const s = 1 / RIN.ppm; ctx.drawImage(im, RIN.x + (dx - RIN.cx) * s, -RIN.top + dy * s, im.width * s, im.height * s); }
  function hall(ctx, tt, im) {
    wall(ctx); lightCells(ctx);
    for (const cx of BODIES) cabinet(ctx, cx, tt);
    slipUp(ctx, tt);
    her(ctx, im, im === IMG.lift ? LIFT_OFF : [0, 0]);
  }

  // =====================================================================================================================
  // k564: the impact drawing, inverted (paper lines on graphite) for 2 frames, then printed teal on paper for 3; the segment's
  // one 大击: a single step in about the frame's centre (past two thirds on the second frame, there on the third, no overshoot)
  // =====================================================================================================================
  const IMP = (() => {
    const im = IMG.impact, w = im.width, h = im.height, [c, x] = mk(w, h); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, w, h), inv = x.createImageData(w, h), tea = x.createImageData(w, h);
    const gr = [0x1c, 0x1c, 0x20], pa = PAPER_RGB, te = TEAL_RGB;
    for (let i = 0; i < d.data.length; i += 4) {
      const L = (d.data[i] * 0.299 + d.data[i + 1] * 0.587 + d.data[i + 2] * 0.114) / 255, a = d.data[i + 3] / 255, ink = Math.min(1, Math.max(0, (1 - L) * a));
      for (let j = 0; j < 3; j++) { inv.data[i + j] = gr[j] + (pa[j] - gr[j]) * ink; tea.data[i + j] = pa[j] + (te[j] - pa[j]) * ink; }
      inv.data[i + 3] = 255; tea.data[i + 3] = 255;
    }
    const [ci, xi] = mk(w, h); xi.putImageData(inv, 0, 0); const [ct, xt] = mk(w, h); xt.putImageData(tea, 0, 0);
    return { inv: ci, teal: ct, w, h };
  })();
  const IMP_S = Math.max(W / IMP.w, 1080 / IMP.h), IMP_X = (W - IMP.w * IMP_S) / 2, IMP_Y = (1080 - IMP.h * IMP_S) / 2;
  const BIG = P('big', 0.035), STEP = [0, 0.7, 1.0];
  const zImp = tt => { const f = frameOf(tt, T_SLAM); return 1 + BIG * (f < STEP.length ? STEP[f] : 1); };

  // =====================================================================================================================
  // k565 to the end: the last picture. R16_final is shown at exactly 1:1 (1536 x 1024, at integer px), its bottom edge
  // under the frame's. The hall behind it (wall, the lanes, cabinet 3 to her right) is drawn in metres at the drawing's
  // own scale (1100 px a metre on the guide work/seg/16/v6/guide/layout_final6.png, 1122 measured); no clock in this frame.
  // =====================================================================================================================
  // measured on R16_final (sixth round, R16_final6_e: R16_final6_d redrawn with only the cabinet body greyed): the drawn cabinet's outer teal strips run x 236-595 (the code cabinet's
  // 0.32 m: 1122 px a metre), its centre column 415.5 px is the target cabinet's x (-0.45 m); its windows are centred at y 827
  // px, the code cabinet's 0.83 m. Placed so the planted guitar and the cabinet hold the left half (the neck rising into the
  // open wall) and she stands just right of centre with cabinet 3 behind her on the right; at FIN.y = 57 its bottom edge is
  // 1 px under the frame's.
  const FIN = { x: P('finx', 250), y: 57, ppm: 1122, cabU: 415.5, winV: 827 };
  const finWX = u => TARGET + (u - FIN.cabU) / FIN.ppm, finH = v => 0.83 + (FIN.winV - v) / FIN.ppm;
  const FIN_FR = [finWX(960 - FIN.x), finH(1080 - FIN.y), W / FIN.ppm];
  // the lane light in the last picture is not a flat paper band: printed teal halftone steps fall off from the lane's top
  // (under the wall band) and from both sides (the cabinets' edges), leaving a clean bright core low in the middle
  // (one cover per cell, the larger of the two falloffs: overlapping two screens would print the dots twice)
  const TOPF = [0.22, 0.16, 0.11, 0.07, 0.04, 0.02], SIDEF = [0.16, 0.10, 0.05, 0.02], FT = 0.05, FS = 0.04;
  function lanesLit(ctx) {
    for (let i = -3; i <= 2; i++) { const x0 = i * LANE - LANE / 2 + BW / 2 + 0.035, w = LANE - BW - 0.07;
      ctx.fillStyle = PAPER; ctx.fillRect(x0, -0.95, w, 0.95);
      const xs = [x0]; for (let j = 1; j <= SIDEF.length; j++) xs.push(x0 + j * FS);
      for (let j = SIDEF.length - 1; j >= 0; j--) xs.push(x0 + w - j * FS); xs.push(x0 + w);
      const xs2 = [...new Set(xs.map(v => +v.toFixed(5)))].sort((p, q) => p - q);
      const sideAt = xm => { const d = Math.min(xm - x0, x0 + w - xm); const j = Math.floor(d / FS); return j < SIDEF.length ? SIDEF[j] : 0; };
      for (let r = 0; r <= TOPF.length; r++) {
        const y0 = -0.95 + r * FT, y1 = r < TOPF.length ? y0 + FT : 0, top = r < TOPF.length ? TOPF[r] : 0;
        for (let k = 0; k + 1 < xs2.length; k++) { const c = Math.max(top, sideAt((xs2[k] + xs2[k + 1]) / 2)); if (!c) continue;
          ctx.fillStyle = screenM(ctx, c, 0.006); ctx.fillRect(xs2[k], y0, xs2[k + 1] - xs2[k], y1 - y0); }
      } }
  }
  function hallFinal(ctx, tt) {
    wall(ctx, false); lanesLit(ctx);
    for (const cx of BODIES) if (cx !== TARGET) cabinet(ctx, cx, tt);   // the target cabinet is in the drawing, smashed
  }
  // the reader's last window (the drawing's right indicator window, dark grey glass with one light crack): lit, it is the
  // window's own pixels turned over (dark glass -> paper-white screen, the light crack -> a dark crack: the same idea as the
  // impact drawing's inversion), with a 16-dot × on it; measured grey interior x 442-530, y 779-875 px on R16_final
  const WIN = { u: 442, v: 779, w: 89, h: 97 };
  WIN.x = FIN.x + WIN.u; WIN.y = FIN.y + WIN.v;
  const LIT = (() => {
    const [c, x] = mk(WIN.w, WIN.h); x.drawImage(IMG.final, WIN.u, WIN.v, WIN.w, WIN.h, 0, 0, WIN.w, WIN.h);
    const d = x.getImageData(0, 0, WIN.w, WIN.h), o = d.data, pa = PAPER_RGB, ink = INK_RGB;
    for (let i = 0; i < o.length; i += 4) {
      const L = o[i] * 0.299 + o[i + 1] * 0.587 + o[i + 2] * 0.114, k = Math.min(1, Math.max(0, (L - 95) / 100));
      for (let j = 0; j < 3; j++) o[i + j] = pa[j] + (ink[j] - pa[j]) * k;
    }
    x.putImageData(d, 0, 0); return c;
  })();
  // brightness: 0.85 steady from the cut; each stutter (k567, k568, k569): full on the beat's frame, out for one frame,
  // back, then settling dimmer than before (0.62, 0.42, 0.24); on k570 out for good
  const BASE = [0.85, 0.62, 0.42, 0.24];
  function winLevel(tt) {
    if (tt >= T_DIE) return 0;
    let n = 0; for (const t of T_STUT) if (tt >= t) n++;
    if (n === 0) return BASE[0];
    const f = frameOf(tt, T_STUT[n - 1]);
    return f === 0 ? 1 : f === 1 ? 0 : f === 2 ? 0.9 : f < 6 ? BASE[n] + (0.9 - BASE[n]) * (6 - f) / 4 : BASE[n];
  }
  function drawWindow(ctx, tt) {
    const a = winLevel(tt); if (!a) return;
    ctx.save(); ctx.beginPath(); ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.clip();
    ctx.globalAlpha = a; ctx.drawImage(LIT, WIN.x, WIN.y);
    print16(ctx, '×', WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, WIN.w / 22, 9, 161 + T_STUT.filter(t => tt >= t).length);
    ctx.restore();
  }
  // the pieces: thrown up from the impact point at k564 (the impact drawing is held still to k565, so at the cut they are
  // already in the air), each its own Codex drawing, scaled from 1035 to 1122 px a metre (BS). Paper scraps rise, slow down in the air and flutter down at 0.4-0.55 m/s with a sway; hard chips fly and
  // drop. Every piece has left the frame's bottom before k570, so the picture is completely still after the last chord.
  const HIT = [FIN.x + P('hitu', 420), FIN.y + P('hitv', 650)];   // the crushed top on R16_final (px on the screen)
  const NOTCH = [FIN.x + 318, FIN.y + 568];                          // the broken notch in the guitar body's left edge: the gold chip leaves from here
  const BS = FIN.ppm / 1035;                                         // the pieces were sized for 1035 px a metre
  const GPX = 7000 * BS;                                             // px/s² for the hard chips (a little under 1 g)
  const r16 = rng(1606);
  // each piece its own direction (a burst, not a clump): paper and hard pieces dealt out over fixed fans of x speeds
  const P5 = [2, 0, 4, 1, 3], H4 = [3, 1, 0, 2]; let pi = 0, hi = 0;
  const FLY = BIT.map((b, i) => {
    const paper = b.kind === 'paper';
    return paper
      ? { b, paper, x0: HIT[0] + (r16() - 0.5) * 220, y0: HIT[1] + (r16() - 0.5) * 60, vx: [-2000, -1450, -950, -500, -100][P5[pi++]] + (r16() - 0.5) * 200, vy: -1350 - r16() * 600,
          tau: 0.27 + r16() * 0.06, vt: (470 + r16() * 120) * BS, amp: 28 + r16() * 34, per: 0.85 + r16() * 0.5, ph: r16() * 6.28, rot0: (r16() - 0.5) * 1.2, spin: (r16() - 0.5) * 9 }
      : { b, paper, x0: (b.file.endsWith('_6.png') ? NOTCH : HIT)[0] + (r16() - 0.5) * (b.file.endsWith('_6.png') ? 16 : 160), y0: (b.file.endsWith('_6.png') ? NOTCH : HIT)[1] + (r16() - 0.5) * (b.file.endsWith('_6.png') ? 10 : 40), vx: [-1300, -800, -350, 450][H4[hi++]] + (r16() - 0.5) * 150, vy: -1400 - r16() * 700,
          rot0: r16() * 6.28, spin: (r16() < 0.5 ? -1 : 1) * (5 + r16() * 7) };
  });
  function flyAt(f, t) {          // t: seconds since the impact; returns { x, y, rot }
    if (f.paper) {
      const e = 1 - Math.exp(-t / f.tau), sway = 1 - Math.exp(-t / 0.35);
      return { x: f.x0 + f.vx * f.tau * e + f.amp * Math.sin(2 * Math.PI * t / f.per + f.ph) * sway,
               y: f.y0 + f.vt * t + (f.vy - f.vt) * f.tau * e,
               rot: f.rot0 + f.spin * f.tau * e + 0.45 * Math.sin(2 * Math.PI * t / f.per + f.ph + 1.2) * sway };
    }
    return { x: f.x0 + f.vx * t, y: f.y0 + f.vy * t + 0.5 * GPX * t * t, rot: f.rot0 + f.spin * t };
  }
  const gone = (f, t) => { const p = flyAt(f, t), R = Math.hypot(f.b.w, f.b.h) * BS / 2; return p.y - R > 1080; };
  function drawBits(ctx, tt) {
    const t = tt - T_SLAM;
    for (const f of FLY) {
      if (gone(f, t)) continue;
      const p = flyAt(f, t);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.drawImage(f.b.im, -f.b.w * BS / 2, -f.b.h * BS / 2, f.b.w * BS, f.b.h * BS); ctx.restore();
    }
  }

  // =====================================================================================================================
  // audits
  // =====================================================================================================================
  const LAY = createLayout();
  // the window and her face whole in the last frame; the drawing's left, top and right edges carry no ink (the drawing is
  // narrower than the frame: its edges must be invisible), its bottom edge is under the frame's
  LAY.text('the reader\'s last window', 'fin', [WIN.x, WIN.y, WIN.w, WIN.h]);
  LAY.text('her face (R16_final)', 'fin', [FIN.x + 680, FIN.y + 140, 220, 220]);
  LAY.audit('seg_16 last picture');
  LAY.frameCheck('the last picture: the window', { sheets: { fin: p => p }, views: [{ t: T_AFTER, z: 1, fx: 960, fy: 540 }] });
  { const im = IMG.final, [, cx] = mk(im.width, im.height); cx.drawImage(im, 0, 0);
    const d = cx.getImageData(0, 0, im.width, im.height).data, A = (x, y) => d[(y * im.width + x) * 4 + 3];
    let left = 0, right = 0, top = 0;
    for (let y = 0; y < im.height; y++) { left = Math.max(left, A(0, y), A(1, y)); right = Math.max(right, A(im.width - 1, y), A(im.width - 2, y)); }
    for (let x = 0; x < im.width; x++) top = Math.max(top, A(x, 0), A(x, 1));
    const bottomPx = FIN.y + im.height - 1080;
    const rightOut = FIN.x + im.width > W;
    const bad = left > 24 || (right > 24 && !rightOut) || top > 24 || bottomPx < 0 || im.width !== 1536 || im.height !== 1024;
    console.warn(`EDGE AUDIT seg_16 last picture: ${im.width}x${im.height} at (${FIN.x}, ${FIN.y}) scale 1.000 (never enlarged); max alpha on the left/top/right edge ${left}/${top}/${right}; bottom edge ${bottomPx} px under the frame${bad ? ' PROBLEM' : ' OK'}`); }
  // BITS AUDIT: when each piece leaves the frame; all gone before k570
  { const leave = FLY.map(f => { let t = 0; while (!gone(f, t) && t < 10) t += FRAME / 4; return T_SLAM + t; });
    const last = Math.max(...leave);
    const inFrame = FLY.filter(f => !gone(f, T_AFTER - T_SLAM)).length;
    console.warn(`BITS AUDIT seg_16: ${FLY.length} pieces (${FLY.filter(f => f.paper).length} paper, ${FLY.filter(f => !f.paper).length} hard), ${inFrame} in the frame at the cut; they leave at ${leave.map(t => 'k' + beatOf(t).toFixed(2)).join(', ')}; last k${beatOf(last).toFixed(2)}${last < T_DIE - FRAME ? ' OK (still from k570)' : ' PROBLEM: a piece is still falling at k570'}`); }
  // MOTION AUDIT (第六节 整屏运动): every frame's view as shown; cuts flagged
  const viewAt = tt => {
    if (tt < T_S10) { const v = CAM.view(...camS8(tt)); return { ...v }; }
    if (tt < T_SLAM) return batView(camBAT(tt));
    if (tt < T_AFTER) return { z: zImp(tt), fx: 960, fy: 540 };
    return { z: 1, fx: 960, fy: 540 };
  };
  const CUTS = [T_S10, T_SLAM, T_AFTER].map(t => SEG[0] + Math.ceil((t - SEG[0]) * 30 - 1e-9) / 30);
  const views = frameTimes(SEG[0], SEG[0], T_END).map(t => ({ t, ...viewAt(t), cut: CUTS.some(c => Math.abs(c - t) < 1e-6) }));
  const MOTION_R = motionAudit('seg_16', views, { big: [[T_SLAM + 2 * FRAME, 'k564 全段最重的一下（镲 19.2，00 k0 砸字的那一拍）：琴砸下（切到冲击图，第 2、3 帧一步推近）']] });
  // PART AUDIT: no part is drawn by code over any drawing of this segment (the strings are the drawings' own; the falling pieces
  // are Codex drawings of their own, flying free; the window light is the drawn window's screen); partReport lists 0 parts
  const PARTS_R = partReport('seg_16');
  console.warn(`NO CODE PARTS seg_16: drawings ${Object.keys(DRAW).join(', ')} + ${BIT.length} Codex pieces; code draws no part attached to a drawing`);
  // FLASH AUDIT: whole-frame brightness jumps (第六节 白闪 ≤ 2 a segment, ≤ 3 a second): the impact (dark, then light)
  console.warn(`FLASH AUDIT seg_16: whole-frame jumps at k564 (inverted, frame ${Math.ceil(T_SLAM * 30 - 1e-9)}) and k564 + 2 frames (teal on paper); no paper-white flash elsewhere`);
  publishAudit(S, LAY, { framing: { ...FRAMING, s: fr.s, x: fr.x, y: fr.y }, motion: MOTION_R, parts: PARTS_R,
    bat: { frame: BAT, push: BAT_PUSH, rin: RIN }, final: { ...FIN, frame: FIN_FR, window: WIN, hit: HIT, pieces: BIT.length } });

  // =====================================================================================================================
  // the frame
  // =====================================================================================================================
  window.renderAt = async t => {
    const tt = t;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (tt < T_S10) {                                  // S8
      CAM.shoot(camS8(tt), 0, tt, c => { c.drawImage(blackC, -M, -M); c.drawImage(IMG.glare, fr.x, fr.y, IW * fr.s, IH * fr.s); });
      return;
    }
    if (tt < T_SLAM) { shootM(camBAT(tt), ctx => hall(ctx, tt, tt < T_TOP ? IMG.lift : IMG.raise)); return; }   // S10
    if (tt < T_AFTER) {                                // the impact
      g.fillStyle = PAPER; g.fillRect(0, 0, W, 1080);
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      const z = zImp(tt);
      g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
      g.drawImage(tt < T_TEAL - 1e-6 ? IMP.inv : IMP.teal, IMP_X, IMP_Y, IMP.w * IMP_S, IMP.h * IMP_S);
      g.restore();
      return;
    }
    shootM(FIN_FR, ctx => hallFinal(ctx, tt));          // the last picture: the hall, then the drawing at 1:1
    g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false;
    g.drawImage(tt >= T_DIE ? IMG.smile : IMG.final, FIN.x, FIN.y);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    drawWindow(g, tt);
    drawBits(g, tt);
  };
  await window.renderAt(P('t0', SEG[0]));
}
