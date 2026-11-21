// Segment 08b 副歌1后半 (docs/分镜/08b_副歌1后半.md, 第 4 版 细做), k232-k264, global frames [2587, 2943).
// 句22 (from 「ろ」) - 句25. Design 乙 for 句24-25, chosen by both blind reviewers of the samples (第 11 节), with their must-fix list.
//
//  k232-k246  the 数学 page (one take, no cut): the big eraser (web/lib/big_eraser.js, shared with 08a) rubs her face out on
//             k232 and leaves on k233; under it 問三: a big abacus sets 4194 one column a beat (k234-k237), 4194 and a small 正解
//             are printed on k238 without a jolt. k239 the camera slides down the same sheet to 問四: 「あの子の首の輪も解けますか」
//             as a 知恵の輪 in four panels, printed one a beat (k240-k243); ④ is ①. k244 a dashed loop arrow sends it back to ①
//             and the reading frame lands there, k245 it jumps to ② and the ring turns again, and before it reaches ③ the one
//             big stamp of the segment, 解けません, slams across the four panels (k246, 大击: one step in, no sink since 第三轮).
//  k247-k259  the 進路 page and her hand, from the first beat: the pencil hovers over her empty はい oval while the machine prints
//             everyone's answer round it, a ring of 「名前　はい」 in 16-dot a beat, each ring closer in (k248-k250); k251 ten more
//             rings, k253 thirty: the whole answer row goes black and swells over its rules, はい and いいえ swallowed, only her
//             oval and a thin ring of paper round it left white. Her pencil sinks a notch a beat; on k253 she jerks it back
//             (h08b_pull), takes it down to the 理由 box and writes おいどうすんだよ herself, harder and bigger letter by letter.
//  k259-k264  the only cut to her: chest-up on paper, the whole pencil gripped in her raised fist like a dagger, cold, eyes down;
//             もうどうだって / いいや are rubbed out white in a graphite field beside her as she sings; on k262 (the second い)
//             the pencil snaps in her fist (r08b_snapc): the front half (p08b_front) is thrown up and out of the frame on the left in
//             six frames, spinning, on a parabola, streaked by the shutter; splinters and crumbs (p08b_bits) burst and drop hard.
// Everything comes from web/lib/: beats and the drawings' timeline (score.js), lyrics by line number (lyrics.js), layout and
// frame audit (type.js), camera (camera.js), hands placed by their pencil tip (hand.js), 16-dot print and white letters
// (print.js), colours (palette.js). The pieces that fly at the snap are Codex components in r08b_grip's line work (round 8).
import { BEAT, FRAME as FR, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics, lyricAudit } from '../../lib/lyrics.js';
import { textBox, measure, createLayout } from '../../lib/type.js';
import { createCamera, move, camLerp, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, axisOf, axisAudit, partAudit, samplesAlong, PIX, partReport } from '../../lib/parts.js';
import { createHand } from '../../lib/hand.js';
import { dots16, print16, print16Box, printSung, whiteLetter, vertical, sungBuild, sungSweep, onsetFrameTime } from '../../lib/print.js';
import { createBigEraser, Q3, T_TURN as ER_TURN, LMIN } from '../../lib/big_eraser.js';
import { herCardFace, HER_CARD, BACK as HER_BACK } from '../../lib/her_card.js';
import { PAPER, TEAL, TEAL_RGB, GRAPHITE, CARD_SHADOW, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, INK_RGB, FIBRE_RGB, PENCIL,
         rgba } from '../../lib/palette.js';

export default async function seg08b(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 2587, F1 = 2943, SEG = [F0 / 30, F1 / 30];               // web/segments.json seg_08b; frame g shows song time g/30
  const T = beatV;
  const S = createScore('seg_08b', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  for (const [fam, url] of [['KleeR', '/assets/fonts/kleeone_KleeOne-Regular.ttf']]) { const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f); }
  const LY = await loadLyrics();
  const L23 = LY.lineAt(23, 'あの子の首の輪も解けますか');
  const L24 = LY.lineAt(24, '僕達このまんまでいいんですか');
  const L25 = LY.lineAt(25, 'おいどうすんだよもうどうだっていいや');
  const SHOUT = L25.slice(0, 8), GIVEUP = L25.slice(8);                // おいどうすんだよ | もうどうだっていいや
  const flat = p => p;
  const tb = (ctx, text, font, box, o = {}) => textBox(ctx, text, font, box, o);

  // ---------- the whole frame's motion (2026-11-21 第三轮, docs/制作约定.md 第六节「整屏运动」, MOTION AUDIT below) ----------
  // The second cut moved the whole frame on almost every beat here (23 jolts: abacus steps, panel steps, push steps, hits,
  // dips, the snap's shake; the user: 「你为什么要一直抖动屏幕？……看着很晕啊」). Now the frame moves three times in the segment:
  //  k239  the registered slide (甩镜) down the sheet to 問四, done in one beat;
  //  k246  大击 解けません: one step in (3%, one way, three frames, no overshoot), no sink;
  //  k262  大击 the pencil snaps: the same one-way step, no shake, no dip (and the one paper-white flash).
  // Everything else is still or an eased push (smooth, at least three beats) and the beat is carried inside the picture:
  // abacus beads a column a beat, 正解 stamped, the panels printed one a beat, the reading frame jumping, 解けません slamming,
  // the rings closing in a ring a beat, the black, her pencil sinking a notch a beat and jerking back, her letters, the cut to
  // her face, the snap and the flying pieces.
  //  bigStep(tt, t0): 0 -> 1 in three frames from the beat (70% on the beat's own frame), no overshoot, then it stays.
  //  flash: one frame of paper white (78%) and one of 30%, from palette.js PAPER (only on the snap, k262).
  const bigStep = (tt, t0, n = 3) => { const a = (tt - t0) / FR; if (a < 0) return 0; return 1 - Math.pow(1 - Math.min(1, (a + 1) / n), 3); };
  const flashA = (tt, t0) => { const a = (tt - t0) / FR; return a < 0 ? 0 : a < 1 ? 0.78 : a < 2 ? 0.3 : 0; };

  // ---------- her drawings (Codex, art/cut) and where things are in them (art/cut/seg08b_anchors.json) ----------
  const AN = await (await fetch('/art/cut/seg08b_anchors.json')).json();
  const ART = { write: '/art/cut/h08b_write.png', pull: '/art/cut/h08b_pull.png', scrawl: '/art/cut/h08b_scrawl.png',
                grip: '/art/cut/r08b_grip.png', snap: '/art/cut/r08b_snapc.png', front: '/art/cut/p08b_front.png', bits: '/art/cut/p08b_bits.png' };
  const IMG = {}, RAW = {}; for (const [k, f] of Object.entries(ART)) { RAW[k] = await img(f); IMG[k] = rinPalImage(RAW[k]); }
  // the code-drawn parts on these drawings, each measured on its own drawing (web/lib/parts.js; 根因清单 「笔芯和笔不对了」)
  const PA = await loadPartAnchors('/art/cut/seg08b_parts.json');

  // ---------- the drawings' timeline (= the HOLD AUDIT) and the shots ----------
  S.hold('shot', 'shot 数学 page (問三, slide down, 問四)', SEG[0], T(247), { kind: 'shot', onBeat: false });
  S.hold('shot', 'shot 進路 page, close on her oval and hand', T(247), T(259), { kind: 'shot' });
  S.hold('shot', 'shot her face, the pencil in her fist', T(259), SEG[1], { kind: 'shot' });
  S.hold('hand', 'h08b_write (hovering over her はい)', T(247), T(253), { kind: 'key', file: ART.write });
  S.hold('hand', 'h08b_pull (jerked back)', T(253), T(255), { kind: 'key', file: ART.pull });
  S.hold('hand', 'h08b_scrawl (writing in the 理由 box)', T(255), T(259), { kind: 'key', file: ART.scrawl });
  S.hold('face', 'r08b_grip (the whole pencil in her fist)', T(259), T(262), { kind: 'key', file: ART.grip });
  S.hold('face', 'r08b_snapc (snapped in her fist)', T(262), SEG[1], { kind: 'key', file: ART.snap });

  // =====================================================================================================================
  // 1. the 数学 page: 問三 (upper half, web/lib/big_eraser.js) and 問四 (lower half, world y 1080-2160)
  // =====================================================================================================================
  const ER = await createBigEraser({ rng, img, rinPalImage, LY, layout: LAY });
  for (const [name, t, lvl] of ER.events) if (t >= SEG[0] && t < SEG[1]) S.ev(name, t, lvl);

  // ---- the abacus: 9 rods, teal print, pencil-black beads; the machine sets 4194, one column a beat ----
  const AB = { x: 150, y: 346, w: 900, h: 470, bar: 28, n: 9 };
  const AX0 = AB.x + AB.bar, AX1 = AB.x + AB.w - AB.bar, AY0 = AB.y + AB.bar, AY1 = AB.y + AB.h - AB.bar;
  const PITCH = (AX1 - AX0) / AB.n, BW = 43, BHh = 25, BEAM = [AY0 + 4 * BHh + 18, 24];
  const rodX = i => AX0 + PITCH * (i + 0.5);
  const HEAVEN = [AY0 + BHh, BEAM[0] - BHh], EARTH_REST = j => AY1 - BHh - (3 - j) * 2 * BHh, EARTH_SET = j => BEAM[0] + BEAM[1] + BHh + j * 2 * BHh;
  // rod 6 is the units rod (定位点 on rods 0, 3, 6): 4 on rod 3, 1 on rod 4, 9 on rod 5 (the five bead and four), 4 on rod 6
  const SETS = [{ k: 234, rod: 3, earth: 4, heaven: false, name: 'abacus: 4 thousands' }, { k: 235, rod: 4, earth: 1, heaven: false, name: 'abacus: 1 hundred' },
                { k: 236, rod: 5, earth: 4, heaven: true, name: 'abacus: 9 tens' }, { k: 237, rod: 6, earth: 4, heaven: false, name: 'abacus: 4 units' }];
  SETS.forEach(s => { s.t = S.ev(s.name, T(s.k)); });
  // a bead's way from rest to set: one frame before the beat it is on its way, on the beat it is there, then a small rebound
  const travel = a => a < -FR ? 0 : a < 0 ? 0.55 : 1 - 0.1 * Math.exp(-a / 0.045) * Math.cos(a * 70);
  function bead(ctx, cx, cy) {
    ctx.beginPath(); ctx.moveTo(cx - BW, cy); ctx.lineTo(cx - BW * 0.45, cy - BHh); ctx.lineTo(cx + BW * 0.45, cy - BHh); ctx.lineTo(cx + BW, cy);
    ctx.lineTo(cx + BW * 0.45, cy + BHh); ctx.lineTo(cx - BW * 0.45, cy + BHh); ctx.closePath(); ctx.fillStyle = GRAPHITE; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - BW, cy); ctx.lineTo(cx - BW * 0.45, cy - BHh); ctx.lineTo(cx + BW * 0.45, cy - BHh); ctx.lineTo(cx + BW, cy); ctx.closePath();
    ctx.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 1); ctx.fill();
    ctx.strokeStyle = rgba([247, 245, 239], 0.55); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - BW * 0.62, cy - BHh * 0.42); ctx.lineTo(cx - BW * 0.32, cy - BHh * 0.78); ctx.stroke();
  }
  function abacus(ctx, tt) {
    let dy = 0; for (const s of SETS) { const a = tt - s.t; if (a >= 0) dy += 2.6 * Math.exp(-a / 0.05) * Math.cos(a * 60); }
    ctx.save(); ctx.translate(0, dy);
    ctx.fillStyle = TEAL; const { x, y, w, h, bar } = AB;
    ctx.fillRect(x, y, w, bar); ctx.fillRect(x, y + h - bar, w, bar); ctx.fillRect(x, y, bar, h); ctx.fillRect(x + w - bar, y, bar, h);
    ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 2; ctx.strokeRect(AX0, AY0, AX1 - AX0, AY1 - AY0);
    ctx.strokeStyle = TEAL; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i < AB.n; i++) { ctx.moveTo(rodX(i), AY0); ctx.lineTo(rodX(i), AY1); } ctx.stroke();
    ctx.fillStyle = TEAL; ctx.fillRect(AX0, BEAM[0], AX1 - AX0, BEAM[1]);
    ctx.fillStyle = PAPER; for (const i of [0, 3, 6]) { ctx.beginPath(); ctx.arc(rodX(i), BEAM[0] + BEAM[1] / 2, 5, 0, 7); ctx.fill(); }
    for (let i = 0; i < AB.n; i++) {
      const s = SETS.find(q => q.rod === i), a = s ? tt - s.t : -1, m = s ? travel(a) : 0;
      const hy = s && s.heaven ? HEAVEN[0] + (HEAVEN[1] - HEAVEN[0]) * m : HEAVEN[0];
      bead(ctx, rodX(i), hy);
      // the top `earth` beads go up to the beam, stacked from the beam down
      for (let j = 0; j < 4; j++) { const up = s && j < s.earth, y0 = EARTH_REST(j); bead(ctx, rodX(i), up ? y0 + (EARTH_SET(j) - y0) * m : y0); }
    }
    ctx.restore();
  }
  // 4194 in the answer boxes (a light print) and a framed 正解 stamped under them on k238. 2026-11-21 rhythm pass: the old
  // small light 正解 (k 3.0, no hit) was nearly invisible in the film (content jump 0.3); k238 is a kick on the beat after the
  // abacus. Now 正解 is a stamp: k 3.6 in the space Q3.ok reserves for it, landing 1.3x and back to 1.0 in three frames about its
  // TOP-LEFT corner (it grows only right and down, into empty paper, away from the answer boxes above it: 根因清单 slam 锚点).
  // 2026-11-21 第三轮: no camera hit (整屏运动): the stamp's own landing is the beat.
  const T_ANS = S.ev('4194 printed, 正解 stamped (1.3x landing)', T(238));
  const OKK = 3.6, OKB = print16Box('正解', 0, 0, OKK, { framed: true });               // box about (0, 0): [x, y, w, h]
  const OK = [Q3.ok[0] - OKB[0] + 2, Q3.ok[1] + Q3.ok[3] / 2];                          // left edge on the answer boxes' left edge
  const OK_ANCHOR = [OK[0] + OKB[0] - 4, OK[1] + OKB[1] - 4];
  const okScale = age => age < 0 ? 1 : 1 + 0.3 * Math.pow(1 - Math.min(1, age / (3 * FR)), 2);
  [...'4194'].forEach((c, i) => LAY.text(`answer ${c}${i}`, 'q3:ans', print16Box(c, Q3.ans.x0 + i * Q3.ans.gap + Q3.ans.s / 2, Q3.ans.y + Q3.ans.s / 2, 4.0)));
  LAY.text('正解', 'q3:ans', print16Box('正解', OK[0], OK[1], OKK, { framed: true }));
  function okStamp(ctx, tt) {
    const age = tt - T_ANS; if (age < 0) return; const sc = okScale(age);
    ctx.save(); if (sc !== 1) { ctx.translate(OK_ANCHOR[0], OK_ANCHOR[1]); ctx.scale(sc, sc); ctx.translate(-OK_ANCHOR[0], -OK_ANCHOR[1]); }
    print16(ctx, '正解', OK[0], OK[1], OKK, age, 75, { frame: true, label: PAPER }); ctx.restore();
  }
  function prints3(ctx, tt) {
    ER.printQuestion(ctx, tt);
    if (tt < T_ANS) return;
    [...'4194'].forEach((c, i) => print16(ctx, c, Q3.ans.x0 + i * Q3.ans.gap + Q3.ans.s / 2, Q3.ans.y + Q3.ans.s / 2, 4.0, 2 * FR, 70 + i));
    okStamp(ctx, tt);
  }

  // ---- 問四: the lower half of the same sheet ----
  const Y4 = 1080, PT = 1180, PH = 420, PW = 372, PX = [170, 572, 974, 1376], RY = PT + 150;   // panels; RY = ring A's top bar
  const Q4 = { label: [170, 1120, 60], qsize: 56, tag: [1500, 1096, 248, 48], ans: [290, 1666, 1458, 100], ansLab: [170, 1666, 110, 100] };
  const [P4, p4] = mk(W, 1080);
  { p4.fillStyle = PAPER; p4.fillRect(0, 0, W, 1080); const r = rng(41);
    for (let k = 0; k < W * 1080 / 2200; k++) { p4.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); p4.fillRect(r() * W, r() * 1080, 2 + r() * 9, 1); }
    p4.translate(0, -Y4);
    // the cut-off line goes on down the left edge (12 tears the sheet along it)
    p4.strokeStyle = TEAL; p4.lineWidth = 3; p4.setLineDash([18, 12]); p4.beginPath(); p4.moveTo(Q3.kiri.x, Y4 - 14); p4.lineTo(Q3.kiri.x, 2130); p4.stroke(); p4.setLineDash([]);
    const [lx, ly, ls] = Q4.label; p4.font = `700 ${ls}px ShipporiB`; p4.fillStyle = GRAPHITE; p4.textBaseline = 'middle'; p4.textAlign = 'left'; p4.fillText('問四', lx, ly);
    const lw = p4.measureText('問四').width; p4.fillStyle = TEAL; p4.fillRect(lx, ly + ls * 0.62, lw + 40, 4);
    LAY.text('問四', 'q4', [lx, ly - ls * 0.6, lw, ls * 1.2]); Q4.qx = lx + lw + 40;
    p4.fillStyle = TEAL; p4.fillRect(...Q4.tag); LAY.reg('tag', 'q4', Q4.tag);
    tb(p4, '思考力問題', '700 #px ZenKakuB', [Q4.tag[0] + 12, Q4.tag[1] + 4, Q4.tag[2] - 24, Q4.tag[3] - 8], { maxSize: 30, align: 'center', color: PAPER, name: '思考力問題', sheet: 'q4b', layout: LAY });
    PX.forEach((x, i) => { p4.strokeStyle = TEAL; p4.lineWidth = 4; p4.strokeRect(x, PT, PW, PH); LAY.reg(`panel ${i + 1}`, 'q4', [x, PT, PW, PH]);
      tb(p4, '①②③④'[i], '700 #px ZenKakuB', [x + 14, PT + 10, 52, 52], { maxSize: 44, color: TEAL, name: `panel number ${i + 1}`, sheet: 'q4n', layout: LAY }); });
    p4.fillStyle = TEAL; p4.fillRect(...Q4.ansLab); LAY.reg('答 label', 'q4', Q4.ansLab);
    tb(p4, '答', '700 #px ZenKakuB', [Q4.ansLab[0] + 20, Q4.ansLab[1] + 20, Q4.ansLab[2] - 40, Q4.ansLab[3] - 40], { maxSize: 56, align: 'center', color: PAPER, name: '答', sheet: 'q4b', layout: LAY });
    p4.strokeStyle = TEAL; p4.lineWidth = 4; p4.strokeRect(...Q4.ans); LAY.reg('answer box', 'q4', Q4.ans); }
  { const m = mk(8, 8)[1]; m.font = `700 ${Q4.qsize}px ShipporiB`; LAY.text('question 23', 'q4:print', [Q4.qx, Q4.label[1] - Q4.qsize * 0.6, L23.reduce((a, [c]) => a + m.measureText(c).width, 0), Q4.qsize * 1.2]); }
  // the stain the eraser left at the bottom left of the upper half goes on a little way down (it was rubbed off a face, not
  // off a rectangle), and the light wash of the rub ends softly at the eraser's lower end
  const [ST2, st2] = mk(W, 300); { const r = rng(235); st2.lineCap = 'round';
    for (let y = 0; y < 300; y += 2 + r() * 3) for (let n = 0; n < 3; n++) { const x = LMIN + r() * 260, l = 60 + r() * 260;
      st2.strokeStyle = rgba(r() < 0.8 ? GRAPHITE_DARK_RGB : GRAPHITE_LIGHT_RGB, 0.12 + r() * 0.3); st2.lineWidth = 2 + r() * 6; st2.beginPath(); st2.moveTo(x - l / 2, y); st2.lineTo(x + l / 2, y + (r() - 0.5) * 2); st2.stroke(); }
    st2.globalCompositeOperation = 'destination-in';
    const gx = st2.createLinearGradient(LMIN, 0, LMIN + 300, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.55, 'rgba(0,0,0,0.7)'); gx.addColorStop(1, 'rgba(0,0,0,0)'); st2.fillStyle = gx; st2.fillRect(0, 0, W, 300);
    const gy = st2.createLinearGradient(0, 0, 0, 300); gy.addColorStop(0, 'rgba(0,0,0,1)'); gy.addColorStop(0.35, 'rgba(0,0,0,0.45)'); gy.addColorStop(1, 'rgba(0,0,0,0)'); st2.fillStyle = gy; st2.fillRect(0, 0, W, 300); }

  // ---- the 知恵の輪: two hard rings (a D-ring with a stub of flat lanyard, a small ring through a blank card's hole) ----
  function tube(ctx, path, w = 14) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = GRAPHITE; ctx.lineWidth = w; path(); ctx.stroke();
    ctx.strokeStyle = PAPER; ctx.globalAlpha = 0.85; ctx.lineWidth = 3.5; ctx.translate(-2.6, -2.6); path(); ctx.stroke(); ctx.restore();
  }
  const dRing = (ctx, cx) => () => { ctx.beginPath(); ctx.moveTo(cx - 78, RY); ctx.lineTo(cx + 78, RY); ctx.ellipse(cx, RY, 78, 104, 0, 0, Math.PI); ctx.closePath(); };
  const dArc = (ctx, cx, a0, a1) => () => { ctx.beginPath(); ctx.ellipse(cx, RY, 78, 104, 0, a0, a1); };
  const ringB = (ctx, bx, by, rx) => () => { ctx.beginPath(); ctx.ellipse(bx, by, Math.max(1, rx), 46, 0, 0, 7); };
  function strap(ctx, cx) {   // a short end of the flat teal lanyard folded over the top bar (a stitched hem at its end)
    ctx.save(); ctx.fillStyle = TEAL; ctx.fillRect(cx - 27, RY - 50, 54, 64); ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 2.5; ctx.strokeRect(cx - 27, RY - 50, 54, 64);
    ctx.strokeStyle = rgba([247, 245, 239], 0.8); ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(cx - 20, RY - 40); ctx.lineTo(cx + 20, RY - 40);
    ctx.moveTo(cx - 18, RY - 32); ctx.lineTo(cx - 18, RY + 4); ctx.moveTo(cx + 18, RY - 32); ctx.lineTo(cx + 18, RY + 4); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }
  // Her card on ring B (卡面状态.md; 根因清单: 她的卡只用 web/lib/her_card.js 画). It used to be a small blank card of this
  // page's own (124 x 74, two teal rules and a round hole): the wrong shape (5:3), blank where the film's card is printed from
  // 03 k40 on (改定 15: 08b 按完整状态画，不是空白卡), and about 36 px wide on a 390 px phone. Now: her_card.js's face in the
  // 'title' state (k240-k246 is long after 03 k40), 3:2, its own holder slot (card.js slot(), = her_card BACK.slot) on ring B:
  // ring B's lowest point sits in the slot. CARD_U 136 in figure units: x1.25 in the panel and x1.16 by the camera, about 197 px
  // on the 1080p frame, 40 px on a 390 px phone (根因清单: 卡至少约 40 px 宽). The face is made at 400 px (the card is about
  // 200 device px) and filtered down by drawImage (camera.js shoots with imageSmoothingQuality 'high'). On the page's paper the
  // card's paper edge is kept by its shadow (CARD_SHADOW) and a thin teal rule, the line language of the rest of the figure.
  const CARD_U = 136, CARD_HH = CARD_U / HER_CARD.ratio, SLOT_CY = (HER_BACK.slot[1] + HER_BACK.slot[3] / 2) * CARD_U;
  const CARD_FACE = herCardFace(400, { state: 'title' });
  const rrect = (ctx, x, y, w, h, r) => { r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
  // The ring only meets the card at its slot (2026-11-21, 08b review MUST, 问四③): ring B is drawn BEHIND the card and only the
  // piece in the slot's own column, from the card's top edge to the slot's bottom (the paper bridge and the hole), is drawn
  // again over it, so the ring threads the hole and its tube never lies on the header, the band or the name field.
  const SLOT_X0 = HER_BACK.slot[0], SLOT_W = HER_BACK.slot[2], SLOT_BOT = (HER_BACK.slot[1] + HER_BACK.slot[3]) * CARD_U;
  const cardRect = (bx, ringBottom, w) => [bx - w / 2, ringBottom - SLOT_CY, w, CARD_HH];          // figure units
  function card(ctx, bx, ringBottom, w, ring = null) {   // her card hanging from ring B by its slot (edge on when w is small)
    const [x0, top] = cardRect(bx, ringBottom, w), r = CARD_U * 0.03 * Math.min(1, w / CARD_U);
    ctx.save();
    ctx.fillStyle = CARD_SHADOW; rrect(ctx, x0 + 3, top + 4, w, CARD_HH, r); ctx.fill();
    ctx.drawImage(CARD_FACE, x0, top, w, CARD_HH);
    ctx.strokeStyle = TEAL; ctx.lineWidth = 2; rrect(ctx, x0, top, w, CARD_HH, r); ctx.stroke();
    ctx.restore();
    if (ring) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + w * SLOT_X0, top, w * SLOT_W, SLOT_BOT); ctx.clip(); ring(); ctx.restore(); }
  }
  function arrow(ctx, pts, { w = 6, head = 18, dash = null } = {}) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = TEAL; ctx.fillStyle = TEAL; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(b[0] + Math.cos(an) * head * 0.4, b[1] + Math.sin(an) * head * 0.4);
    ctx.lineTo(b[0] + Math.cos(an + 2.5) * head, b[1] + Math.sin(an + 2.5) * head); ctx.lineTo(b[0] + Math.cos(an - 2.5) * head, b[1] + Math.sin(an - 2.5) * head); ctx.closePath();
    ctx.fill(); ctx.restore();
  }
  // one panel's figure. state 'link' (①, ④), 'turn' (②: ring B turned edge on; u 0..1 is how far it has turned), 'slide' (③)
  // FIG_Y: the figure's centre in the panel. 18 px higher than the old 1392, so her (taller, 3:2) card keeps 10 px of paper
  // above the panel's bottom rule; the lanyard strap still keeps 10 px below the top rule (both measured in the audit below).
  const FIG_Y = 1374, FIG_S = 1.25;
  const figXf = (ctx, cx, dx = 0) => { ctx.translate(dx, 0); ctx.translate(cx, FIG_Y); ctx.scale(FIG_S, FIG_S); ctx.translate(-cx, -1425); };   // drawn 1.25x: the figure fills its panel
  const figBox = (cx, dx, [x, y, w, h]) => [cx + dx + (x - cx) * FIG_S, FIG_Y + (y - 1425) * FIG_S, w * FIG_S, h * FIG_S];   // figure units -> world box
  // ③ slide (2026-11-21 review MUST): the old ③ hung ring B at the bar's corner, so her card hung across the D-ring's lower
  // arc (the arc ran through せん), ring B's tube lay on み and the name field, and the down arrow with its paper halo cut
  // through ロ (ロストワン read コストワン) and the 学籍番号 / 偏差値 / こころ labels. Now ring B has slid up the D-ring's LEFT
  // arc (threaded on it: the D-ring crosses it twice, over it at the upper crossing, 2.6-2.9 rad); the card hangs from it
  // below the D-ring and to the left, its top 16 figure units (20 px) under the D-ring's lowest tube edge; the push arrow runs
  // up OUTSIDE the arc, left of ring B and above the card (toward the corner it is trying to slip off), and the pull arrow
  // leaves the D-ring on the right, clear of the card. Every element's box and the card's drawn pixels are audited below.
  const SLIDE = { bx: -66, by: 86, over: [2.6, 2.9],
    arrows: cx => [[[cx + 50, RY + 62], [cx + 116, RY + 36]], [[cx - 129, RY + 74], [cx - 128, RY + 56], [cx - 124, RY + 40], [cx - 118, RY + 28], [cx - 110, RY + 18]]] };
  const TURN_ARROW = { rx: 86, ry: 24, a0: 0.25 * Math.PI, a1: 0.86 * Math.PI };
  // returns the figure's geometry (figure units) for the audits
  function chie(ctx, cx, state, { u = 1, dx = 0 } = {}) {
    ctx.save(); figXf(ctx, cx, dx);
    let bx, by, rx, cw;
    if (state === 'slide') { bx = cx + SLIDE.bx; by = RY + SLIDE.by; rx = 46; cw = CARD_U; }
    else { bx = cx; by = RY + 134; rx = state === 'turn' ? 46 * (1 - u) + 10 * u : 46; cw = state === 'turn' ? CARD_U * (1 - u) + 10 * u : CARD_U; }
    const rb = () => tube(ctx, ringB(ctx, bx, by, rx), 13);
    strap(ctx, cx); tube(ctx, dRing(ctx, cx)); rb(); card(ctx, bx, by + 46, cw, rb);
    if (state === 'slide') {
      tube(ctx, dArc(ctx, cx, SLIDE.over[0], SLIDE.over[1]));                                                       // the D-ring passes over ring B at the upper crossing: linked
      SLIDE.arrows(cx).forEach(p => arrow(ctx, p));
    } else {
      tube(ctx, dArc(ctx, cx, rx > 30 ? 1.78 : 1.5, rx > 30 ? 2.14 : 1.72));                                       // ring A passes over ring B on one side: linked
      if (state === 'turn') { const A = TURN_ARROW; ctx.save(); ctx.strokeStyle = TEAL; ctx.fillStyle = TEAL; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.ellipse(bx, by, A.rx, A.ry, 0, A.a0, A.a1); ctx.stroke();
        const e = [bx + A.rx * Math.cos(A.a0), by + A.ry * Math.sin(A.a0)]; ctx.beginPath(); ctx.moveTo(e[0] + 14, e[1] - 12); ctx.lineTo(e[0] - 6, e[1] - 6); ctx.lineTo(e[0] + 6, e[1] + 12); ctx.closePath(); ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
    return { cx, dx, state, bx, by, rx, cw };
  }
  // her card alone, exactly as chie draws it (the reference for the occlusion audit)
  function cardAlone(ctx, geo) { ctx.save(); figXf(ctx, geo.cx, geo.dx); card(ctx, geo.bx, geo.by + 46, geo.cw); ctx.restore(); }
  // the boxes (world) of everything in a panel's figure that could lie on her card, and the card face itself split round the
  // slot column (the only place the ring may meet it): the body below the slot, and the strips left and right of the slot
  function figBoxes(geo) {
    const { cx, dx, state, bx, by, rx, cw } = geo, [x0, top, w, h] = cardRect(bx, by + 46, cw), F = b => figBox(cx, dx, b);
    const cardB = { 'card face (below the slot)': F([x0, top + SLOT_BOT, w, h - SLOT_BOT]), 'card face (left of the slot)': F([x0, top, w * SLOT_X0, SLOT_BOT]),
                    'card face (right of the slot)': F([x0 + w * (SLOT_X0 + SLOT_W), top, w * (1 - SLOT_X0 - SLOT_W), SLOT_BOT]) };
    const arrowBox = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), m = 18;
      return F([Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) - Math.min(...xs) + 2 * m, Math.max(...ys) - Math.min(...ys) + 2 * m]); };
    const el = { strap: F([cx - 29, RY - 52, 58, 68]), 'D-ring': F([cx - 85, RY - 7, 170, 118]),
                 'ring B (above the card)': F([bx - rx - 6.5, by - 52.5, 2 * rx + 13, top - (by - 52.5)]),
                 'ring B (in the slot)': F([x0 + w * SLOT_X0, top, w * SLOT_W, SLOT_BOT]) };
    if (state === 'slide') SLIDE.arrows(cx).forEach((p, i) => { el[`arrow ${i + 1}`] = arrowBox(p); });
    if (state === 'turn') { const A = TURN_ARROW, ex = bx + A.rx * Math.cos(A.a0), ey = by + A.ry * Math.sin(A.a0);   // the arc's lowest point is by + ry; the head reaches 12 below its end
      el['turn arrow'] = F([bx + A.rx * Math.cos(A.a1) - 3, ey - 12, ex + 14 - (bx + A.rx * Math.cos(A.a1) - 3), Math.max(by + A.ry + 3, ey + 12) - (ey - 12)]); }
    return { card: cardB, el, cardWorld: F([x0, top, w, h]), slotWorld: F([x0 + w * SLOT_X0, top, w * SLOT_W, SLOT_BOT]) };
  }
  const STATES = ['link', 'turn', 'slide', 'link'];
  const T_PANEL = [240, 241, 242, 243].map((k, i) => S.ev(`panel ${'①②③④'[i]} printed`, T(k)));
  const T_LOOP = S.ev('loop arrow back to ①, reading frame lands on ①', T(244)), T_F2 = S.ev('reading frame jumps to ②, ring B turns again', T(245));
  const T_FSLIDE = S.ev('reading frame sets off for ③', T(245.5), 'half'), T_STAMP = S.ev('解けません slams across the panels (大击: one step in)', T(246));
  const KST = 16.5;   // the stamp spans the four figures: at 15 the D-rings of ① and ④ stuck out of its sides like two handles
  LAY.text('解けません', 'q4:stamp', print16Box('解けません', 960, PT + PH / 2, KST, { framed: true }));
  // The stamp's landing (根因清单: 03 片名砸下的冲击帧压住「学籍番号」; 放大、过冲类效果按放大后的实际墨迹框逐帧登记检查，锚点选在远离
  // 邻近元素的一侧). print16's own slam grew the stamp 22% about its CENTRE: on the hit frame its top rule lay over 問四's underline
  // and the question line, and its left end ran out of the frame (frame 2743 of the 2026-11-21 render). The stamp fills the space
  // between the question line and the 答 row, and nearly the frame's width, so no corner has room for 22%: it lands large about
  // its LEFT edge (the print head sweeps in from the left, so the growth goes into the part not yet printed), at the height that
  // splits the vertical room above and below it, by as much as that room allows (A, measured here from the page's own boxes,
  // at most print16's 0.22). The frames are measured pixel by pixel in the audit below.
  // ST_OUT: the settled stamp as drawn (its ruled frame's outer edge), measured from pixels: print16Box sizes the frame from
  // the dots' nominal width and leaves the frame's line width out, so it is about 6 px off the drawn frame
  const ST_PAD = 8, ST_OUT = (() => { const [c, x] = mk(W, 1080); x.translate(0, -Y4); print16(x, '解けません', 960, PT + PH / 2, KST, 9, 61, { frame: true, label: PAPER });
    const d = x.getImageData(0, 0, W, 1080).data; let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
    for (let yy = 0; yy < 1080; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] > 40) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
    return [x0, y0 + Y4, x1 - x0 + 1, y1 - y0 + 1]; })();
  const Q4_ABOVE = Math.max(Q4.label[1] + Q4.label[2] * 0.62 + 4, Q4.label[1] + Q4.qsize * 0.6, Q4.tag[1] + Q4.tag[3]);   // 問四's underline, the question, the tag
  const ST_ROOM = [ST_OUT[1] - Q4_ABOVE - ST_PAD, (Q4.ans[1] - 2) - (ST_OUT[1] + ST_OUT[3]) - ST_PAD];                        // px above, below
  const ST_A = Math.max(0, Math.min(0.22, (ST_ROOM[0] + ST_ROOM[1]) / ST_OUT[3]));
  const ST_ANCHOR = [ST_OUT[0], ST_A > 0 ? ST_OUT[1] + ST_ROOM[0] / ST_A : ST_OUT[1] + ST_OUT[3] / 2];
  const stampScale = age => age >= 0 ? 1 + ST_A * Math.pow(1 - Math.min(1, age / (3 * FR)), 2) : 1;
  function stamp(ctx, tt) {
    const age = tt - T_STAMP; if (age < 0) return; const sc = stampScale(age);
    ctx.save(); if (sc !== 1) { ctx.translate(ST_ANCHOR[0], ST_ANCHOR[1]); ctx.scale(sc, sc); ctx.translate(-ST_ANCHOR[0], -ST_ANCHOR[1]); }
    print16(ctx, '解けません', 960, PT + PH / 2, KST, age, 61, { frame: true, label: PAPER }); ctx.restore();
  }
  // The reading frame lands 8% large too; about its centre its top rule covered 問四's underline (①, frames 2721-2722) and
  // reached into the question line's box (②, frame 2732). It now lands about the middle of its TOP rule: it only grows
  // sideways (into the gaps between the panels) and down, away from the question line.
  const RF = { pad: 12, lw: 12, amp: 0.08 };
  const sweep = (tt, t0) => Math.min(1, ((tt - t0) / FR + 1) / 3);
  const Q4GEO = [];   // each panel figure's geometry as last drawn by q4 (for the per-frame card occlusion audit)
  function q4(ctx, tt, { rf = true } = {}) {
    ctx.drawImage(P4, 0, Y4);
    if (tt >= ER_TURN) { ctx.drawImage(ST2, 0, Y4); }
    { const gw = ctx.createLinearGradient(0, Y4, 0, Y4 + 30); gw.addColorStop(0, rgba(INK_RGB, 0.03)); gw.addColorStop(1, rgba(INK_RGB, 0)); ctx.fillStyle = gw; ctx.fillRect(LMIN, Y4, W - LMIN, 30); }
    printSung(ctx, L23, Q4.qx, Q4.label[1], Q4.qsize, tt);
    // the reading frame: lands on ① (k244), jumps to ② (k245), sets off for ③ on the half beat and is stopped half way (k246).
    // Drawn UNDER the panel figures (2026-11-21, 08b review MUST 问四③): stopped half way, its right rule stands through the
    // middle of ③, where her card hangs; on top it cut ロストワン for the last four frames before 解けません covered the panels.
    // Under the figures it slides beneath the hanging card (the card is the thing in front), and outside the panels nothing changes.
    if (tt >= T_LOOP && rf) {
      let fx = PX[0]; if (tt >= T_F2) fx = PX[1]; if (tt >= T_FSLIDE) { const v = Math.min(1, (tt - T_FSLIDE) / (T_STAMP - T_FSLIDE)); fx = PX[1] + (PX[2] - PX[1]) * 0.5 * v * v; }
      readingFrame(ctx, fx, rfScale(tt));
    }
    PX.forEach((x, i) => {
      Q4GEO[i] = null; if (tt < T_PANEL[i]) return; const f = sweep(tt, T_PANEL[i]), cx = x + PW / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(x + 2, PT + 2, (PW - 4) * f, PH - 4); ctx.clip();
      let o = {};
      if (i === 0 && tt >= T_LOOP) { const a = tt - T_LOOP; o = { dx: 7 * Math.exp(-a / 0.09) * Math.sin(a * 48) }; }
      if (i === 1) o = { u: tt >= T_F2 ? smooth((tt - T_F2) / (5 * FR)) : 1 };
      Q4GEO[i] = { ...chie(ctx, cx, STATES[i], o), printed: f }; ctx.restore();
    });
    if (tt >= T_LOOP) {   // the dashed loop arrow from under ④ back to ①, drawn in three frames
      const f = sweep(tt, T_LOOP), y = PT + PH + 28, x4 = PX[3] + PW / 2, x1 = PX[0] + PW / 2;
      const pts = [[x4, PT + PH + 6], [x4, y], [x4 + (x1 - x4) * Math.min(1, f * 1.2), y]]; if (f >= 1) pts.push([x1, PT + PH + 8]);
      if (f >= 1) arrow(ctx, pts, { w: 7, head: 20, dash: [16, 11] }); else { ctx.save(); ctx.strokeStyle = TEAL; ctx.lineWidth = 7; ctx.setLineDash([16, 11]); ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach(p => ctx.lineTo(...p)); ctx.stroke(); ctx.restore(); }
    }
    stamp(ctx, tt);
  }
  function rfScale(tt) { const land = tt < T_F2 ? tt - T_LOOP : tt - T_F2; return tt < T_FSLIDE ? 1 + RF.amp * Math.pow(1 - Math.min(1, land / (3 * FR)), 2) : 1; }
  function readingFrame(ctx, fx, sc) {
    const top = PT - RF.pad - RF.lw / 2;                                   // the top rule's outer edge: the anchor's height
    ctx.save(); ctx.translate(fx + PW / 2, top); ctx.scale(sc, sc); ctx.translate(0, -top);
    ctx.strokeStyle = TEAL; ctx.lineWidth = RF.lw; ctx.strokeRect(-PW / 2 - RF.pad, PT - RF.pad, PW + 2 * RF.pad, PH + 2 * RF.pad); ctx.restore();
  }

  // ---- the camera on the 数学 page: 08a ends at 1.06 on (960, 540); an eased push while the abacus counts; one beat's
  // slide down to 問四 with a little motion blur; an eased push to 1.16; one step in on 解けません ----
  // createCamera's world is the frame's size, so the tall sheet (1920 x 2160) is shot with the focus held at y 540 and the
  // world shifted up by fy - 540 instead (the framings below are all inside the sheet, so nothing past it shows)
  const CAMM = createCamera(g, { W, H: 1080, bg: PAPER });
  const [OFF, og] = mk(W, 1080), CAMO = createCamera(og, { W, H: 1080, bg: PAPER });
  const shootTall = (CAM, [z, fx, fy, sh], seed, draw) => CAM.shoot([z, fx, 540], sh, seed, ctx => { ctx.translate(0, 540 - fy); draw(ctx); });
  const viewTall = (CAM, [z, fx, fy, sh]) => ({ ...CAM.view(z, fx, 540, sh), fy });
  // 2026-11-21 第三轮 (整屏运动, docs/制作约定.md 第六节; the second cut stepped and hit the camera on every beat here):
  //  k232-k239  one eased push 1.06 -> Z3 while the abacus sets a column a beat (the beads are the beat; no steps, no hits)
  //  k239-k240  the slide down to 問四: the segment's one registered whip, done in one beat
  //  k240-k246  one eased push from the slide's landing (1.11 on the row's left) to the centre (1.16) while the panels print
  //             one a beat and the reading frame jumps; it ends still on the beat 解けません lands.
  //             The 問四 row (label at x 170, the 思考力問題 tag to x 1736) spans the sheet, and the sung question on it must
  //             stay whole, so the zoom keeps label and tag both in the frame (1.20 at most).
  //  k246       解けません, 大击: one step in of 3% in three frames, one way, no sink (改定 2's sink is gone with the dips)
  const FY4 = 1425;   // the middle of 問四's content (label 1084 .. answer box 1766): no empty band at the bottom
  const ROWL = Math.min(Q4.label[0], LAY.boxes.find(b => b.name === '問四').box[0]), ROWR = Q4.tag[0] + Q4.tag[2];   // the 問四 label .. the teal tag's right end
  const ZL = [1.11], Z4 = 1.16, Z4BIG = 0.03;
  const FXL = ZL.map(z => { const half = W / 2 / z, lo = ROWR + 10 / z - half; return lo; });          // the slide lands as far left as keeps the tag whole
  // 問三's framing is width-limited too: the band title (x 96) and the right column (the sum, to x 1790) span the sheet. The
  // focus sits midway between them, and the zoom with its hits stays inside what keeps both whole (8 px margin)
  const Q3T = LAY.boxes.filter(b => (b.sheet === 'q3' || b.sheet === 'q3b' || b.sheet === 'q3:print') && b.kind === 'text');
  const Q3L = Math.min(...Q3T.map(b => b.box[0])), Q3R = Math.max(...Q3T.map(b => b.box[0] + b.box[2]));
  const FX3 = (Q3L + Q3R) / 2, Z3MAX = W / (Q3R - Q3L + 16), Z3 = Math.min(1.09, Z3MAX / 1.026);
  console.warn(`CAMERA seg_08b 問三: text spans x ${Q3L.toFixed(0)}-${Q3R.toFixed(0)}, focus x ${FX3.toFixed(0)}, zoom at most ${Z3MAX.toFixed(3)}; eased push 1.06 -> ${Z3.toFixed(3)}`);
  move(S, 'eased push on 問三', T(232), T(239));
  move(S, 'slide down to 問四', T(239), T(240));
  move(S, 'eased push on 問四', T(240), T(246));
  const camMath = tt => {
    if (tt < T(239)) {
      const f = Math.min(1, (tt - T(232)) / (T(234) - T(232)));                          // 08a hands over at 1.06 on x 960: drift to FX3 under the eraser
      const z = 1.06 + (Z3 - 1.06) * smooth((tt - T(232)) / (T(239) - T(232)));
      return [z, 960 + (FX3 - 960) * smooth(Math.max(0, f)), 540, 0];
    }
    // the slide: a whip down on the k239 kick (quartic ease-out), 96% there when あ is sung (89.05 s) so the question reads,
    // settling onto the panel row on k240
    if (tt < T(240)) { const e = 1 - Math.pow(1 - Math.min(1, Math.max(0, (tt - T(239)) / (T(240) - T(239)))), 4); return [Z3 + (ZL[0] - Z3) * e, FX3 + (FXL[0] - FX3) * e, 540 + (FY4 - 540) * e, 0]; }
    const e = smooth((tt - T(240)) / (T_STAMP - T(240)));
    const z = (ZL[0] + (Z4 - ZL[0]) * e) * (1 + Z4BIG * bigStep(tt, T_STAMP)), fx = FXL[0] + (960 - FXL[0]) * e;
    return [z, fx, FY4, 0];
  };
  const drawMath = (ctx, tt) => { ER.compose(ctx, tt, { under: abacus, over: prints3 }); q4(ctx, tt); };

  // =====================================================================================================================
  // 2. the 進路 page: her hand over her empty はい, everyone's はい closing in
  // =====================================================================================================================
  const BX = 420, BY = 290, BWD = 1080, BH = 540, LABW = 160, CX0 = BX + LABW;
  const ROW = { name: [290, 380], pick: [380, 610], why: [610, 830] };
  const HAI = [950, 495], IIE = [1300, 495], ORX = 64, ORY = 40;
  const QS = 50, QY = 238, QCH = [['問', -1], ['五', -1], ['　', -1], ...L24];
  const QW = QCH.reduce((a, [c]) => a + measure(c, '700 #px ShipporiB', QS), 0), QX = BX + (BWD - QW) / 2;
  const [FIB, fb] = mk(W, 1080); { const r = rng(17); for (let k = 0; k < W * 1080 / 2200; k++) { fb.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); fb.fillRect(r() * W, r() * 1080, 2 + r() * 9, 1); } }
  const [STAIN, stn] = mk(W, 1080); { const r = rng(5); stn.lineCap = 'round';   // the 数学 page's stain soaked through, faint, bottom left
    for (let k = 0; k < 160; k++) { const x = 60 + Math.pow(r(), 1.6) * 360, y = 1080 - Math.pow(r(), 1.6) * 300, l = 40 + r() * 120, a = -0.5 + (r() - 0.5) * 0.2;
      stn.strokeStyle = rgba(INK_RGB, 0.02 + r() * 0.03); stn.lineWidth = 4 + r() * 8; stn.beginPath(); stn.moveTo(x, y); stn.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); stn.stroke(); } }
  const labY = (t, y0, y1) => t === '理由' ? y0 + 14 : (y0 + y1) / 2 - 26;
  const NOTES = ['1　どちらか一つを', '　 ぬりつぶすこと。', '2　理由は自分の', '　 ことばで書くこと。', '3　読み取り機で', '　 採点します。'];
  const BOX = { hai: [HAI[0] - ORX - 14 - 104, HAI[1] - 30, 104, 60], iie: [IIE[0] - ORX - 14 - 152, IIE[1] - 30, 152, 60] };
  const [PG, pg] = mk(W, 1080);
  { pg.fillStyle = PAPER; pg.fillRect(0, 0, W, 1080); pg.drawImage(FIB, 0, 0); pg.drawImage(STAIN, 0, 0);
    pg.fillStyle = TEAL; pg.fillRect(0, 0, W, 124);
    tb(pg, '進路', '700 #px ZenKakuB', [56, 44, 200, 66], { maxSize: 48, color: PAPER, name: 'band title', sheet: 'page', layout: LAY });
    tb(pg, '令和八年度　読取確認テスト', '500 #px ZenKaku', [W - 580, 54, 512, 46], { maxSize: 28, align: 'right', color: PAPER, name: 'test name', sheet: 'page', layout: LAY });
    pg.strokeStyle = TEAL; pg.lineWidth = 3; pg.setLineDash([18, 12]); pg.beginPath(); pg.moveTo(64, 236); pg.lineTo(64, 1066); pg.stroke(); pg.setLineDash([]);
    pg.save(); pg.translate(64, 202); pg.lineWidth = 3; pg.lineCap = 'round'; for (const sx of [-1, 1]) { pg.beginPath(); pg.arc(sx * 9, -14, 7, 0, 7); pg.stroke(); pg.beginPath(); pg.moveTo(sx * 6, -7); pg.lineTo(-sx * 5, 24); pg.stroke(); } pg.restore();
    // the 得点 box, empty (the teacher fills it in): with a printed score in it, the push cut 「10点」 down to 「0点」 for a few frames
    pg.strokeStyle = TEAL; pg.lineWidth = 3; pg.strokeRect(100, 300, 300, 200); pg.fillStyle = TEAL; pg.fillRect(100, 300, 300, 56);
    tb(pg, '得点', '700 #px ZenKakuB', [110, 306, 280, 44], { maxSize: 30, align: 'center', color: PAPER, name: '得点', sheet: 'page', layout: LAY });
    pg.strokeStyle = rgba(TEAL_RGB, 0.45); pg.lineWidth = 2; pg.setLineDash([8, 8]); pg.beginPath(); pg.moveTo(130, 470); pg.lineTo(370, 470); pg.stroke(); pg.setLineDash([]);
    pg.strokeStyle = TEAL; pg.lineWidth = 3; pg.strokeRect(1530, 300, 300, 410); pg.fillStyle = TEAL; pg.fillRect(1530, 300, 300, 56);   // (stroke and fill were left over from 得点: the 注意 header was paper on paper, its frame the faint dash colour)
    tb(pg, '解答上の注意', '700 #px ZenKakuB', [1540, 306, 280, 44], { maxSize: 28, align: 'center', color: PAPER, name: '注意', sheet: 'page', layout: LAY });
    NOTES.forEach((t, i) => tb(pg, t, '500 #px ZenKaku', [1548, 376 + i * 54, 272, 44], { maxSize: 27, name: `注意 ${i}`, sheet: 'page', layout: LAY }));
    tb(pg, '－６－', '500 #px ZenKaku', [900, 1012, 120, 40], { maxSize: 26, align: 'center', name: 'page number', sheet: 'page', layout: LAY });
    // the answer block
    pg.fillStyle = TEAL; pg.fillRect(BX, BY, LABW, BH);
    pg.strokeStyle = TEAL; pg.lineWidth = 4; pg.strokeRect(BX, BY, BWD, BH);
    pg.lineWidth = 3; pg.beginPath(); for (const y of [ROW.pick[0], ROW.why[0]]) { pg.moveTo(BX, y); pg.lineTo(BX + BWD, y); } pg.stroke();
    pg.strokeStyle = rgba(TEAL_RGB, 0.45); pg.lineWidth = 2; pg.setLineDash([8, 8]); pg.beginPath(); for (const y of [745, 812]) { pg.moveTo(CX0 + 24, y); pg.lineTo(BX + BWD - 24, y); } pg.stroke(); pg.setLineDash([]);
    [['なまえ', ROW.name], ['回答', ROW.pick], ['理由', ROW.why]].forEach(([t, [y0, y1]]) =>
      tb(pg, t, '700 #px ZenKakuB', [BX + 10, labY(t, y0, y1), LABW - 20, 52], { maxSize: 36, align: 'center', color: PAPER, name: t, sheet: 'q', layout: LAY }));
    tb(pg, 'はい', '700 #px ShipporiB', BOX.hai, { maxSize: 46, align: 'right', color: GRAPHITE, name: 'はい', sheet: 'q', layout: LAY });
    tb(pg, 'いいえ', '700 #px ShipporiB', BOX.iie, { maxSize: 46, align: 'right', color: GRAPHITE, name: 'いいえ', sheet: 'q', layout: LAY });
    pg.strokeStyle = TEAL; pg.lineWidth = 4; for (const [x, y] of [HAI, IIE]) { pg.beginPath(); pg.ellipse(x, y, ORX, ORY, 0, 0, 7); pg.stroke(); } }
  LAY.text('question', 'q', [QX, QY - QS * 0.6, QW, QS * 1.2]);
  LAY.reg('得点 box', 'page:box', [100, 300, 300, 200]); LAY.reg('注意 box', 'page:box', [1530, 300, 300, 410]);

  // ---- her pencil letters: Klee, but each letter its own size, tilt, baseline and pressure, pressed over two to four times
  // (so a hard letter is darker and broader where the passes overlap), grain left in the strokes; revealed by a sweep ----
  const LRES = 3, GLY = {};
  function glyph(ch, size, p, seed) {
    const key = `${ch}|${size}|${p.toFixed(2)}|${seed}`; if (GLY[key]) return GLY[key];
    const S3 = size * LRES, [c0, x] = mk(Math.ceil(S3 * 1.5), Math.ceil(S3 * 1.5)), r = rng(seed);
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `600 ${S3}px Klee`; x.lineJoin = 'round';
    const passes = 2 + Math.round(p * 2);
    for (let k = 0; k < passes; k++) { const dx = (r() - 0.5) * S3 * 0.02 * (0.5 + p), dy = (r() - 0.5) * S3 * 0.02 * (0.5 + p);
      x.globalAlpha = 0.5 + 0.3 * p; x.fillStyle = PENCIL; x.fillText(ch, c0.width / 2 + dx, c0.height / 2 + dy);
      if (p > 0.35) { x.strokeStyle = PENCIL; x.lineWidth = S3 * 0.016 * p; x.strokeText(ch, c0.width / 2 + dx, c0.height / 2 + dy); } }
    // a hand's wobble: the letter bent a little along both axes (thin strips shifted on slow waves), so no two strokes are ruler-even
    const [c1, x1] = mk(c0.width, c0.height), [c, x2] = mk(c0.width, c0.height), A = S3 * 0.022, f1 = (2 + r() * 2) / S3, f2 = (2 + r() * 2) / S3, ph1 = r() * 6, ph2 = r() * 6;
    for (let y = 0; y < c0.height; y += 2) x1.drawImage(c0, 0, y, c0.width, 2, A * Math.sin(y * f1 * Math.PI + ph1), y, c0.width, 2);
    for (let xx = 0; xx < c0.width; xx += 2) x2.drawImage(c1, xx, 0, 2, c0.height, xx, A * Math.sin(xx * f2 * Math.PI + ph2), 2, c0.height);
    const x_ = x; void x_;
    { const x = x2;
    x.globalAlpha = 1; x.globalCompositeOperation = 'destination-out';
    for (let k = 0; k < size * (3.4 - 2.4 * p); k++) { x.fillStyle = `rgba(0,0,0,${0.1 + r() * 0.25})`; x.fillRect(r() * c.width, r() * c.height, (1 + r() * 2.5) * LRES, LRES); } }
    return (GLY[key] = c);
  }
  // a run of letters as she writes it: sizes grow, the line tilts and sinks, pressure rises; d = how long each letter's sweep takes
  function scrawl(chars, x0, cy, size0, grow, seed, { tilt = 0.012, sink = 0.02, p0 = 0.3, dp = 0.1, jit = 0.12, endT = Infinity } = {}) {
    const r = rng(seed); let x = x0;
    const out = chars.map(([c, t], i) => { const small = 'っゃゅょ'.includes(c), base = size0 * (1 + grow * i) * (0.9 + r() * 0.2), size = Math.round(small ? base * 0.72 : base);
      const w = (small ? 0.82 : 1.0) * base + base * 0.08 * (r() - 0.25);
      const L = { c, t, x: x + w / 2, y: cy + (r() - 0.5) * base * 0.12 + sink * i * size0 + (small ? base * 0.16 : 0), size, w, rot: (r() - 0.5) * jit + tilt * i,
                  p: Math.min(1, p0 + dp * i), seed: seed * 31 + i }; x += w; return L; });
    // 2026-11-21 (user: 「我们的歌词好像比曲子慢了一点」): each letter used to START its sweep on its onset and take up to 0.26 s,
    // so it read 2-7 frames (63-213 ms) after she sang it. Now (print.js sungSweep) the sweep ENDS on the frame the onset falls
    // in: d is 2-3 frames (the gap to the next letter allows), it starts d before that frame (L.ws), so the letter first shows
    // at most two frames early and is whole on its onset's frame (docs/制作约定.md 第六节).
    out.forEach((L, i) => { const nt = i + 1 < out.length ? out[i + 1].t : Math.min(endT, L.t + 0.3); L.d = Math.max(2 * FR, Math.min(3 * FR, nt - L.t)); L.ws = onsetFrameTime(L.t) - L.d; });
    return out;
  }
  function letter(ctx, L, u) {
    if (u <= 0) return; const gc = glyph(L.c, L.size, L.p, L.seed), s = 1 / LRES, w = gc.width * s, h = gc.height * s;
    ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(L.rot);
    if (u < 1) { ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w * (0.32 + 0.68 * u), h); ctx.clip(); }
    ctx.drawImage(gc, -w / 2, -h / 2, w, h); ctx.restore();
  }
  const drawRun = (ctx, R, tt) => { for (const L of R) { const u = L.t < 0 ? 1 : sungSweep(tt, L.t, L.d); if (u > 0) letter(ctx, L, u); } };
  // her name, written before the test started (an ordinary pencil hand)
  const NAME = scrawl([['鏡', -1], ['音', -1], ['リ', -1], ['ン', -1]], CX0 + 22, (ROW.name[0] + ROW.name[1]) / 2 - 2, 52, 0, 99, { tilt: 0, sink: 0, p0: 0.25, dp: 0 });
  NAME.forEach(L => { L.t = -1; L.d = FR; L.ws = -1 - FR; });
  NAME.forEach((L, i) => LAY.text(`name ${L.c}${i}`, 'q:name', [L.x - L.w * 0.47, L.y - L.size * 0.55, L.w * 0.94, L.size * 1.1]));
  // where the pencil tip is while writing a run: on the sweep front of the letter, gliding between letters; sampled on the
  // frame grid, smoothed (a 9-frame gaussian) and limited to vmax px a frame, so the hand never jerks for a two-frame letter
  function tipPath(R, tStart, tEnd, rest0, rest1, vmax = 40) {
    const raw = [];
    for (let t = tStart; t <= tEnd + 1e-6; t += FR) {
      let p = rest0; const cur = [...R].reverse().find(L => t >= L.ws), nxt = R.find(L => L.ws > t);   // the sweep's own times (L.ws, L.d)
      const at = (L, u) => [L.x + Math.cos(L.rot) * L.w * (u - 0.5) * 0.9, L.y + Math.sin(L.rot) * L.w * (u - 0.5) * 0.9 + L.size * (0.12 - 0.2 * Math.sin(u * Math.PI * 2))];
      if (!cur) p = nxt ? at(nxt, 0) : rest0;
      else { const u = Math.min(1, (t - cur.ws) / cur.d);
        if (u < 1) p = at(cur, u);
        else if (nxt) { const v = smooth((t - cur.ws - cur.d) / Math.max(FR, nxt.ws - cur.ws - cur.d)), a = at(cur, 1), b = at(nxt, 0); p = [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v - 10 * Math.sin(Math.PI * v)]; }
        else { const v = smooth((t - cur.ws - cur.d) / (2 * BEAT)), a = at(cur, 1); p = [a[0] + (rest1[0] - a[0]) * v, a[1] + (rest1[1] - a[1]) * v]; } }
      raw.push(p);
    }
    const sig = 1.6, Rr = 4, sm = raw.map((_, i) => { let sx = 0, sy = 0, sw = 0; for (let k = -Rr; k <= Rr; k++) { const j = Math.min(raw.length - 1, Math.max(0, i + k)), w = Math.exp(-k * k / (2 * sig * sig)); sx += raw[j][0] * w; sy += raw[j][1] * w; sw += w; } return [sx / sw, sy / sw]; });
    for (let i = 1; i < sm.length; i++) { const dx = sm[i][0] - sm[i - 1][0], dy = sm[i][1] - sm[i - 1][1], d = Math.hypot(dx, dy); if (d > vmax) sm[i] = [sm[i - 1][0] + dx * vmax / d, sm[i - 1][1] + dy * vmax / d]; }
    const fn = t => { const f = Math.min(sm.length - 1, Math.max(0, (t - tStart) / FR)), i = Math.floor(f), a = f - i, b = sm[Math.min(sm.length - 1, i + 1)]; return [sm[i][0] + (b[0] - sm[i][0]) * a, sm[i][1] + (b[1] - sm[i][1]) * a]; };
    fn.raw = raw; fn.sm = sm; return fn;
  }

  // ---- the rings: each pupil's 「名前　はい」 printed in 16-dot round her oval, the letters standing on the ring ----
  const NAMES = ['佐藤', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '清水',
                 '斎藤', '森', '池田', '橋本', '阿部', '石川', '前田', '藤田', '小川', '岡田', '後藤', '長谷川', '村上', '近藤', '石井', '坂本', '遠藤', '青木',
                 '藤井', '西村', '福田', '太田', '三浦', '岡本', '松田', '中島'];
  const KX = 1.8, ringRX = d => ORX + 10 + d * KX, ringRY = d => ORY + 10 + d;
  // the region the black takes in the end: the answer row (spilling 40 px past the block's right rule) and, round her oval,
  // a swell over the row's rules onto なまえ and 理由
  const RG = { rect: [CX0, ROW.pick[0], BX + BWD + 40 - CX0, ROW.pick[1] - ROW.pick[0]], ell: [HAI[0], HAI[1], 430, 150] };
  const regionPath = (ctx, grow = 0) => { const [x, y, w, h] = RG.rect, [ex, ey, erx, ery] = RG.ell; ctx.beginPath();
    ctx.rect(Math.max(CX0, x - grow), y - grow, w + grow * 2, h + grow * 2); ctx.moveTo(ex + erx + grow, ey); ctx.ellipse(ex, ey, erx + grow, ery + grow, 0, 0, Math.PI * 2); };
  const LB = [CX0 - 20, 300, 1000, 430], RES = 2;                  // the layers' canvas covers world LB = [x, y, w, h]
  function ring(x, d, k, name, seed, color = INK_RGB, alpha = 1) {
    const rx = ringRX(d), ry = ringRY(d), N = 900, pts = []; let len = 0;
    for (let i = 0; i <= N; i++) { const th = -Math.PI / 2 + (i / N) * Math.PI * 2, p = [HAI[0] + rx * Math.cos(th), HAI[1] + ry * Math.sin(th)];
      if (i) len += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]); pts.push([...p, len, th]); }
    const r = rng(seed), unit = [...`${name}　はい　`], cell = 16 * k * 1.06, adv = unit.map(c => (c === '　' ? 0.55 : 1) * cell), L = adv.reduce((a, v) => a + v, 0);
    const loops = Math.max(1, Math.floor(len / L)), sc = len / (loops * L); let s = r() * L * sc, j = 0;
    const find = s0 => { s0 = ((s0 % len) + len) % len; while (j < N && pts[j + 1][2] < s0) j++; while (j > 0 && pts[j][2] > s0) j--; return pts[j]; };
    x.globalAlpha = alpha;
    for (let n = 0; n < loops * unit.length; n++) { const c = unit[n % unit.length], a = adv[n % unit.length] * sc, p = find(s + a / 2);
      if (c !== '　' && r() > 0.05) { const th = p[3], nx = ry * Math.cos(th), ny = rx * Math.sin(th), phi = Math.atan2(nx, -ny), D = dots16(c, k, 500 + (c.charCodeAt(0) % 7), color);
        x.save(); x.translate(p[0], p[1]); x.rotate(phi); if (r() < 0.07) x.globalAlpha = alpha * 0.45; x.drawImage(D.c, D.x0, D.y0, D.w, D.h, -D.w / 2, -D.h / 2, D.w, D.h); x.restore(); }
      s += a; }
    x.globalAlpha = 1;
  }
  const GROUPS = [{ k: 248, ds: [100], ks: [1.6] }, { k: 249, ds: [75], ks: [1.6] }, { k: 250, ds: [50], ks: [1.6] },
                  { k: 251, ds: Array.from({ length: 10 }, (_, i) => 118 + i * 12.7), ks: Array.from({ length: 10 }, (_, i) => 1.22 + (i % 3) * 0.1) },
                  { k: 253, ds: Array.from({ length: 30 }, (_, i) => 16 + i * 9.8), ks: Array.from({ length: 30 }, (_, i) => 1.5 + ((i * 7) % 5) * 0.14) }];
  const layerCanvas = () => { const [c, x] = mk(Math.ceil(LB[2] * RES), Math.ceil(LB[3] * RES)); x.scale(RES, RES); x.translate(-LB[0], -LB[1]); return [c, x]; };
  { let n = 0;
    for (const G of GROUPS) { G.t = S.ev(G.ds.length > 1 ? `${G.ds.length} rings printed round her oval` : `ring ${n + 1} printed round her oval`, T(G.k));
      const [c, x] = layerCanvas(); x.save(); x.beginPath(); x.rect(CX0 + 2, LB[1], LB[2], LB[3]); x.clip(); regionPath(x, G.ds.length === 30 ? 3 : G.ds.length > 1 ? 18 : 40); x.clip();
      G.ds.forEach((d, i) => { ring(x, d, G.ks[i], NAMES[n % NAMES.length], 300 + n, INK_RGB, G.ds.length === 30 ? 1 : 0.92); n++; });
      x.restore(); G.c = c; } }
  // the black: the region filled solid on k253, a thin ring of paper left round her oval, the edge broken by the print's own
  // dots; the thirty rings show through it, a lighter graphite, so it reads as printed rings packed solid, not a pasted slab
  const FLOOD = (() => { const [c, x] = layerCanvas(), r = rng(2531);
    x.fillStyle = GRAPHITE; regionPath(x, 0); x.fill();
    const [, , w, h] = RG.rect;
    const edge = []; for (let i = 0; i <= 160; i++) { edge.push([CX0 + w * i / 160, ROW.pick[0]]); edge.push([CX0 + w * i / 160, ROW.pick[1]]); }
    for (let i = 0; i <= 60; i++) edge.push([CX0 + w, ROW.pick[0] + h * i / 60]);
    for (let i = 0; i <= 240; i++) { const th = (i / 240) * Math.PI * 2; edge.push([HAI[0] + 430 * Math.cos(th), HAI[1] + 150 * Math.sin(th)]); }
    const inside = (px, py) => (px >= CX0 && px <= CX0 + w && py >= ROW.pick[0] && py <= ROW.pick[1]) || (((px - HAI[0]) / 430) ** 2 + ((py - HAI[1]) / 150) ** 2 <= 1);
    const rim = edge.filter(([ex, ey]) => [[12, 0], [-12, 0], [0, 12], [0, -12]].some(([dx, dy]) => !inside(ex + dx, ey + dy)));   // only the real outline
    edge.length = 0; edge.push(...rim);
    x.globalCompositeOperation = 'source-atop'; const G = GROUPS[4];
    G.ds.forEach((d, i) => ring(x, d, G.ks[i], NAMES[(13 + i) % NAMES.length], 900 + i, GRAPHITE_LIGHT_RGB, 0.42));
    // the edge broken by the print head's own dots: dark dots spilling out, a few small bites of paper in
    x.globalCompositeOperation = 'source-over'; x.fillStyle = GRAPHITE;
    for (const [ex, ey] of edge) for (let k = 0; k < 3; k++) { const px = ex + (r() - 0.5) * 22, py = ey + (r() - 0.5) * 22; if (px < CX0 + 2 || inside(px, py)) continue;
      x.beginPath(); x.arc(px, py, 1.4 + r() * 2.4, 0, 7); x.fill(); }
    x.globalCompositeOperation = 'destination-out';
    for (const [ex, ey] of edge) { if (r() > 0.25) continue; const px = ex + (r() - 0.5) * 12, py = ey + (r() - 0.5) * 12; if (!inside(px, py)) continue; x.beginPath(); x.arc(px, py, 1 + r() * 1.6, 0, 7); x.fill(); }
    x.fillStyle = '#000'; x.fillRect(LB[0] - 2, LB[1] - 2, CX0 + 2 - LB[0], LB[3] + 4);          // never over the label column
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.beginPath(); x.ellipse(HAI[0], HAI[1], ORX + 13, ORY + 13, 0, 0, 7); x.fill();
    return c; })();
  const land = (tt, t0) => { const a = tt - t0; return { f: Math.min(1, (a / FR + 1) / 3), sc: 1 + 0.12 * Math.pow(1 - Math.min(1, a / (3 * FR)), 2) }; };
  // The rings and the black land 12% large. About her oval's centre, the hit frames of the black (2821-2822) ran 40-60 px over
  // the label column (回答) and its dots onto 鏡音リン (2026-11-21 render): FLOOD's own "never over the label column" was undone
  // by the scale. Now the landing is clipped to the answer area in world space (x >= CX0 + 2) and anchored at the top of the
  // region's swell (above her oval), so it grows sideways and down into the empty 理由 row, never up onto なまえ.
  // Above the answer row (the なまえ row, where 鏡音リン is written) a landing frame may not put ink where its layer does not
  // settle (2026-11-21 card task, LANDING AUDIT: scaled about her oval, the hit frames of k251 and the black still pushed
  // 16-55 px more ink onto リ / ン than the settled state, because everything left of the anchor grows left). So a landing
  // frame is drawn into a scratch canvas, and above the answer row's top rule it is masked by the layer's own settled ink
  // (destination-in); below the rule it lands free, so the punch into the empty 理由 row and the sides is unchanged, and the
  // landing stays centred on her oval (her paper ring stays round it).
  const LAND_ANCHOR = [HAI[0], HAI[1] - RG.ell[3]];
  const [LANDC, landx] = mk(W * RES, 1080 * RES);
  const putLayer = (ctx, c, tt, t0, solid = false) => { const { f: f0, sc } = land(tt, t0), f = solid ? 1 : f0;
    const into = (x, s) => { x.save(); x.beginPath(); x.rect(CX0 + 2, LB[1] - 200, LB[2] + 400, LB[3] + 400); x.clip();
      x.translate(LAND_ANCHOR[0], LAND_ANCHOR[1]); x.scale(s, s); x.translate(-LAND_ANCHOR[0], -LAND_ANCHOR[1]); x.globalAlpha = f; x.drawImage(c, LB[0], LB[1], LB[2], LB[3]); x.restore(); };
    if (sc === 1) { into(ctx, 1); return; }
    landx.setTransform(1, 0, 0, 1, 0, 0); landx.clearRect(0, 0, LANDC.width, LANDC.height); landx.setTransform(RES, 0, 0, RES, 0, 0);
    into(landx, sc);
    landx.save(); landx.beginPath(); landx.rect(0, 0, W, ROW.pick[0]); landx.clip(); landx.globalCompositeOperation = 'destination-in';
    landx.drawImage(c, LB[0], LB[1], LB[2], LB[3]); landx.restore();
    ctx.drawImage(LANDC, 0, 0, W, 1080); };
  const T_BLACK = GROUPS[4].t;
  function rings(ctx, tt) {
    // once the black has landed only it and the thirty rings are drawn (the earlier rings would fray its edge into grey)
    for (const G of GROUPS) if (tt >= G.t && (tt < T_BLACK + 3 * FR || G === GROUPS[4])) putLayer(ctx, G.c, tt, G.t);
    if (tt >= T_BLACK) putLayer(ctx, FLOOD, tt, T_BLACK, true);          // solid from its first frame (no grey veil), it only lands
    ctx.save(); ctx.fillStyle = PAPER; ctx.beginPath(); ctx.ellipse(HAI[0], HAI[1], ORX - 2, ORY - 2, 0, 0, 7); ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  }

  // ---- her hand ----
  const HSC = AN.write.screen;
  // each hand by its own drawn pencil point (seg08b_parts.json); h08b_pull is registered on h08b_write's canvas (its 'canvas'
  // point = h08b_write's tip), so the jerk back drawn into it reads as a move, and its own drawn point (PULL_TIP) is where it is
  const HAND = { write: await createHand({ name: 'h08b_write', image: IMG.write, W, H: 1080, tip: partOf(PA, 'h08b_write', 'tip').point }),
                 pull: await createHand({ name: 'h08b_pull', image: IMG.pull, W, H: 1080, tip: partOf(PA, 'h08b_pull', 'canvas').point }),
                 scrawl: await createHand({ name: 'h08b_scrawl', image: IMG.scrawl, W, H: 1080, tip: partOf(PA, 'h08b_scrawl', 'tip').point }) };
  const HOVER = [HAI[0] + 10, HAI[1] - 4];
  const DIPS = [248, 249, 250, 251, 252], LIFTS = [0.8, 0.62, 0.45, 0.29, 0.14];       // a notch lower on every beat; the last a stroke above the paper
  DIPS.forEach((k, i) => { if (k === 252) S.ev('the pencil sinks a notch', T(k)); });
  const T_PULL = S.ev('she jerks the pencil back', T(253));
  const JERK = [16, 12];
  const WHY = scrawl(SHOUT, CX0 + 30, 700, 58, 0.055, 2551, { tilt: 0.014, sink: 0.03, p0: 0.32, dp: 0.11, jit: 0.2 });
  WHY.forEach((L, i) => LAY.text(`理由 ${L.c}${i}`, 'why', [L.x - L.w * 0.44, L.y - L.size * 0.5, L.w * 0.88, L.size * 1.0]));
  const END = [WHY[WHY.length - 1].x + WHY[WHY.length - 1].w * 0.4, WHY[WHY.length - 1].y + 14];
  const tipW = tipPath(WHY, T(255), T(259), null, END);
  const START = tipW(T(255));
  // the drawn tip of h08b_pull, in world: the pull drawing is placed with h08b_write's canvas, so its own tip is offset
  const PT_PULL = partOf(PA, 'h08b_pull', 'tip').point, PT_CANVAS = partOf(PA, 'h08b_pull', 'canvas').point;
  const PULL_TIP = [(PT_PULL[0] - PT_CANVAS[0]) * HSC, (PT_PULL[1] - PT_CANVAS[1]) * HSC];
  function handAt(tt) {
    if (tt < T_PULL) {
      let L = 1, from = 1, t0 = null; DIPS.forEach((k, i) => { if (tt >= T(k)) { from = i ? LIFTS[i - 1] : 1; L = LIFTS[i]; t0 = T(k); } });
      if (t0 !== null) { const a = tt - t0, u = Math.min(1, a / (2 * FR)); L = from + (L - from) * u - (a >= 2 * FR ? 0.05 * Math.exp(-(a - 2 * FR) / 0.08) : 0); }
      const n = DIPS.filter(k => tt >= T(k)).length, amp = 0.35 + n * 0.8;
      return { h: 'write', p: [HOVER[0] + amp * Math.sin(tt * 53) + amp * 0.6 * Math.sin(tt * 89 + 1), HOVER[1] + amp * 0.7 * Math.sin(tt * 61 + 2)], lift: Math.max(0.1, L) };
    }
    if (tt < T(255)) {
      const a = tt - T_PULL, j = ease(a / (2 * FR)), base = [HOVER[0] + JERK[0] * j, HOVER[1] - 15 + JERK[1] * j];
      const tr = 1.4 * Math.sin(tt * 57), tip0 = [base[0] + PULL_TIP[0], base[1] + PULL_TIP[1]];
      // the second beat: lifted, it goes down to where the 理由 line starts, landing there on k255
      const v = smooth((tt - T(254)) / (T(255) - T(254))), tip = [tip0[0] + (START[0] - tip0[0]) * v, tip0[1] + (START[1] - tip0[1]) * v];
      return { h: 'pull', p: [tip[0] - PULL_TIP[0] + tr, tip[1] - PULL_TIP[1] + tr * 0.5], lift: 0.95 - 0.35 * v };
    }
    const p = tipW(tt), writing = WHY.some(L => tt >= L.ws && tt < L.ws + L.d), done = tt >= WHY[WHY.length - 1].ws + WHY[WHY.length - 1].d;
    const lift = tt < WHY[0].ws ? 0.6 * (1 - smooth((tt - T(255)) / (WHY[0].ws - T(255)))) : writing || done ? 0 : 0.1;
    const press = done ? 1.6 * Math.sin(tt * 71) : 0;          // after よ the point stays pressed into the paper, shaking
    return { h: 'scrawl', p: [p[0] + press, p[1] + press * 0.4], lift };
  }
  // ---- the camera on the 進路 page: the shot opens close on her oval and hand (k247) ----
  // History: the 2026-11-21 rhythm pass stepped the push on every beat k248-k253 and hit/stepped k253-k257; the push-out fix
  // then found the page text is whole only at e <= 0.061 and all out from e >= 0.692 on the push path (根因清单 08b row).
  // 2026-11-21 第三轮 (整屏运动; MOTION AUDIT): the six push steps, the k253 hit, the k255 step down, the k256 step in and the
  // k257 hit are gone. The 進路 shot opens (the cut on k247) straight on the closer framing (e = 0.72 on the old push path, past
  // e >= 0.692 where all the page's edge text is out of the frame, so nothing is ever stopped half cut: 根因清单 08b push-out).
  // (A cut from the whole sheet to it on k248, as the motion checklist proposed, left a one-beat shot (HOLD AUDIT: under two
  // beats) and a jump cut on the same set-up (第六节); the k248 crash is carried by ring 1 slamming down round her oval and her
  // pencil's first notch down.) The question, the labels and her name are whole in it. Then the frame is still k247-k254 while the rings close in a ring a beat, the black lands and her
  // pencil sinks a notch a beat and jerks back; k254-k258 one eased move (four beats, smooth) down and in to the 理由 box as
  // her hand goes down there and writes; still again for the last beat before the cut to her face.
  const ZB = 1.9, FB = [905, 455], FW = [905, 660], ZW = 1.95, E_CUT = 0.72;
  // The framing (2026-11-21 第三轮): 1.72 on (965, 490). The old push path's e = 0.72 (1.59 on (913, 468)) left the 得点 box's
  // teal header and rule cut by the left edge for the whole still shot (render check, frame 2754); the page's furniture lies at
  // x <= 400 (得点) and x >= 1530 (注意), so the frame must be at least 1920 / 1130 = 1.70 wide-limited and sit between them:
  // 407 .. 1523 here (the answer block 420 .. 1500 whole), y 176 .. 804 (the band out above, the question and her letters in).
  const V_CUT = [1.72, 965, 490]; void E_CUT;
  const T_PCUT = T(247);
  move(S, 'eased move down to 理由', T(254), T(258));
  const camPage = tt => {
    if (tt < T_PCUT) return [1, 960, 540, 0];
    const e = smooth((tt - T(254)) / (T(258) - T(254)));
    return [Math.exp(Math.log(V_CUT[0]) + (Math.log(ZW) - Math.log(V_CUT[0])) * e), V_CUT[1] + (FW[0] - V_CUT[1]) * e, V_CUT[2] + (FW[1] - V_CUT[2]) * e, 0];
  };

  // =====================================================================================================================
  // 3. her face: on paper, a graphite field down the right, もうどうだって / いいや rubbed out white; the pencil snaps on k262
  // =====================================================================================================================
  const FS = 1080 / IMG.grip.height, FX = 20;
  const toScreen = ([x, y]) => [FX + x * FS, y * FS];
  const T_SNAP = S.ev('the pencil snaps in her fist', T(262));
  const GF = (() => { const [c, x] = mk(W, 1080), r = rng(259); x.fillStyle = GRAPHITE_FIELD; x.fillRect(0, 0, W, 1080); x.lineCap = 'round';
    for (let k = 0; k < 2400; k++) { x.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); x.lineWidth = 2 + r() * 5;
      const px = r() * W, py = r() * 1080, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
    // its left edge: the strokes of the smear, ragged
    x.globalCompositeOperation = 'destination-in'; x.beginPath(); const q = rng(8); x.moveTo(1110, -20);
    for (let y = 0; y <= 1100; y += 40) x.lineTo(1090 + 60 * Math.sin(y * 0.006 + 1) + q() * 50, y); x.lineTo(1960, 1100); x.lineTo(1960, -20); x.closePath(); x.fill();
    return c; })();
  const COL1 = vertical(GIVEUP.slice(0, 7), 1700, 112, 118), COL2 = vertical(GIVEUP.slice(7), 1470, 112, 150);
  [...COL1, ...COL2].forEach((p, i) => LAY.text(`white ${p.c}${i}`, 'face', [p.x - p.size * 0.5, p.y - p.size * 0.52, p.size, p.size * 1.04]));
  // 2026-11-21 rhythm pass: the face was a slow 1.00 -> 1.04 push, still for three beats; the snap a 2.5% punch and a random
  // 5 px shake. Now: still on the cut (k259); k260 (bar line) a 1.5% step in; k261 (a hard kick) a 1% hit; k262, the snap
  // (one of the loudest beats of the segment): one frame of paper white (78%, then 30%), a 3% hit and the frame dips 10 px
  // with a 1.5% step in; then still while the pieces fly.
  // 2026-11-21 第三轮 (整屏运动): the k260 step and the k261 hit are gone, and the snap's hit, step and dip are one 大击: a 3%
  // step in, one way, in three frames. The face is dead still from the cut (k259) to the snap, so the snap is the one thing
  // that moves the frame: 静动对比.
  S.ev('flash: paper white and one 3% step in on the snap (大击)', T_SNAP);
  const camFace = tt => [1 + 0.03 * bigStep(tt, T_SNAP), 960, 540, 0];
  // ---- the snap: the front half and the bits that burst out ----
  // Both are Codex components drawn in r08b_grip's line work (p08b_front, p08b_bits; cut and sized by
  // art/design/prompts/_cut_seg08b_pieces.py, geometry in seg08b_anchors.json, stored at x2). The front half starts exactly
  // where it stood in her fist (its break on the top of the stub, its point on r08b_grip's point) and is thrown up and out to
  // the upper left: about 120 px a frame at first, on a parabola, spinning about 30 degrees a frame, out of the frame on the
  // sixth frame. The bits burst from the break, small and fast, and drop hard (all gone within about eight frames). Each
  // piece is drawn sharp where it is, with a smooth smear behind it (24 exposures over the last 0.6 frame, averaged): eight
  // exposures over the whole frame read as a stack of ghost copies, and a fully blurred piece lost the drawing's line work.
  // 2026-11-21 第三轮 (parts.js, 根因清单 「笔芯和笔不对了」): the front half used to leave from r08b_grip's hand-read break and tip,
  // while the frame shows r08b_snapc, whose fist (and stub) sits about 10 px right and 3 degrees steeper; and the piece was
  // turned as if its own axis were exactly horizontal. Now it leaves from r08b_snapc's own stub (its tip = the top of the break,
  // its direction = the stub's measured centreline), and the piece goes through one placement whose origin is the torn end of
  // its own measured axis: on the snap's instant the front half continues the stub in one line. The bits burst from the same
  // break.
  const FA = AN.front, BA = AN.bits, FSC = 1 / FA.x2;
  const STUB = axisOf(partOf(PA, 'r08b_snapc', 'stub').axis), FRONT = partOf(PA, 'p08b_front', 'body'), FAX = axisOf(FRONT.axis);
  const BRK = toScreen(STUB.tip), P_ANG = STUB.angle;                       // the drawing and the screen share one uniform scale (FS) and no turn
  const ROT0 = P_ANG - FAX.angle;                                           // the piece's own axis laid along the stub
  const P0 = placement({ x: BRK[0], y: BRK[1], s: FSC, rot: ROT0, origin: FAX.back });
  const C0 = P0.toWorld(FRONT.centre);
  const V0 = [-1800, -3200], GRAV = 5200, SPIN = -15;                        // px/s, px/s^2, rad/s
  const frontAt = a => [C0[0] + V0[0] * a, C0[1] + V0[1] * a + 0.5 * GRAV * a * a, ROT0 + SPIN * a];
  const BITS = (() => { const r = rng(262), fan = { wood: [-2.9, -1.2, 1300, 2400], skin: [-2.7, -1.3, 1000, 1700], graphite: [-3.4, -1.0, 900, 2000] };
    return BA.pieces.map(({ kind, rect }) => { const [a0, a1, s0, s1] = fan[kind], an = a0 + r() * (a1 - a0), sp = s0 + r() * (s1 - s0);
      return { rect, p0: [BRK[0] + (r() - 0.5) * 30, BRK[1] + (r() - 0.5) * 24], v: [Math.cos(an) * sp, Math.sin(an) * sp], a0: r() * 6.3, spin: (r() < 0.5 ? -1 : 1) * (14 + r() * 16) }; }); })();
  const G_BITS = 18000;
  function drawDebris(c, a) {
    const [x, y, ang] = frontAt(a);
    c.save(); placement({ x, y, s: FSC, rot: ang, origin: FRONT.centre }).apply(c); c.drawImage(IMG.front, 0, 0); c.restore();
    for (const b of BITS) { const bx = b.p0[0] + b.v[0] * a, by = b.p0[1] + b.v[1] * a + 0.5 * G_BITS * a * a; if (by > 1120 || bx < -60) continue;
      const [sx, sy, sw, sh] = b.rect; c.save(); c.translate(bx, by); c.rotate(b.a0 + b.spin * a);
      c.drawImage(IMG.bits, sx, sy, sw, sh, -sw * FSC / 2, -sh * FSC / 2, sw * FSC, sh * FSC); c.restore(); }
  }
  // gone: the front half and every bit out of the frame (checked on the frame grid below and published in the audit)
  const T_DEBRIS_END = T_SNAP + 0.75;
  const [BLUR, bl] = mk(W, 1080), NEXP = 24, SHUT = 0.6 * FR;
  function debris(ctx, tt) {
    const a0 = tt - T_SNAP; if (a0 < 0 || tt > T_DEBRIS_END) return;
    bl.setTransform(1, 0, 0, 1, 0, 0); bl.clearRect(0, 0, W, 1080); bl.globalCompositeOperation = 'lighter'; bl.globalAlpha = 1 / NEXP;
    for (let i = 0; i < NEXP; i++) drawDebris(bl, Math.max(0, a0 - SHUT * i / (NEXP - 1)));   // the snap can fall inside the shutter
    bl.globalCompositeOperation = 'source-over'; bl.globalAlpha = 1;
    ctx.save(); ctx.globalAlpha = 0.6; ctx.drawImage(BLUR, 0, 0); ctx.restore();   // the smear
    drawDebris(ctx, a0);                                                           // the pieces themselves, sharp
  }
  // the flight, frame by frame (for the audit and the report): the front half's centre, its speed, and the frame it is gone
  const FLIGHT = frameTimes(SEG[0], T_SNAP, T_DEBRIS_END).map(t => { const a = t - T_SNAP, [x, y] = frontAt(a), R = Math.hypot(FA.size[0], FA.size[1]) * FSC / 2;
    return { f: Math.round(t * 30), a: +a.toFixed(3), x: Math.round(x), y: Math.round(y), out: x + R < 0 || y + R < 0 }; });
  const bitsOut = a => BITS.every(b => { const bx = b.p0[0] + b.v[0] * a, by = b.p0[1] + b.v[1] * a + 0.5 * G_BITS * a * a; return by > 1100 || bx < -30 || by < -30; });
  { const bitsGone = FLIGHT.find(q => bitsOut(q.a)), gone = FLIGHT.find(q => q.out), sp = FLIGHT.length > 1 ? Math.hypot(FLIGHT[1].x - FLIGHT[0].x, FLIGHT[1].y - FLIGHT[0].y) : 0;
    console.warn(`FLIGHT seg_08b: front half from (${FLIGHT[0].x},${FLIGHT[0].y}) at ${sp.toFixed(0)} px/frame, out of the frame on frame ${gone ? gone.f : 'never'} (${gone ? FLIGHT.indexOf(gone) : '-'} frames after the snap); bits all gone on frame ${bitsGone ? bitsGone.f : 'never'}`); }
  const CAMF = createCamera(g, { W, H: 1080, bg: PAPER });

  // =====================================================================================================================
  // audits: overlaps per page, and every frame of every shot with the camera as it actually moves
  // =====================================================================================================================
  LAY.audit('seg_08b');
  const viewsOf = (CAM, cam, a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy, sh = 0] = cam(t); return { t, ...CAM.view(z, fx, fy, sh) }; });
  const viewsTall = (a, b) => frameTimes(SEG[0], a, b).map(t => ({ t, ...viewTall(CAMM, camMath(t)) }));
  LAY.frameCheck('数学 page, 問三 (to the slide)', { sheets: { q3: flat, q3b: flat, 'q3:print': flat, 'q3:ans': flat }, views: viewsTall(SEG[0], T(239)) });
  LAY.frameCheck('数学 page, 問四 (after the slide)', { sheets: { q4: flat, q4b: flat, q4n: flat, 'q4:print': flat, 'q4:stamp': flat }, views: viewsTall(T(240), T(247)) });
  // the 進路 shot opens on the closer framing (2026-11-21 第三轮): from its first frame every page text box (band, test name, 得点,
  // 注意, page number) is entirely out of the frame and the question, labels and her name whole; the frame is still to k254
  LAY.frameCheck('進路 page, the closer framing (k247-k254, still)', { sheets: { page: flat, q: flat, 'q:name': flat, why: flat }, views: viewsOf(CAMF, camPage, T(247), T(254)) });
  // PUSH-OUT AUDIT (kept from the push-out fix, now for the cut): on the shot's first frames no page text box may be cut by the
  // frame (whole or entirely out)
  const pushOut = (() => { const page = LAY.boxes.filter(b => b.sheet === 'page' && b.kind === 'text'), rows = [];
    for (const v of viewsOf(CAMF, camPage, T(247), T(247) + 3 * FR)) { const cut = [], whole = [];
      for (const b of page) { const [x, y, w, h] = b.box, sx0 = 960 + (x - v.fx) * v.z, sy0 = 540 + (y - v.fy) * v.z, sx1 = 960 + (x + w - v.fx) * v.z, sy1 = 540 + (y + h - v.fy) * v.z;
        const allOut = sx1 <= 0 || sy1 <= 0 || sx0 >= 1920 || sy0 >= 1080, allIn = sx0 >= 0 && sy0 >= 0 && sx1 <= 1920 && sy1 <= 1080;
        if (allIn) whole.push(b.name); else if (!allOut) cut.push(b.name); }
      rows.push({ f: Math.round(v.t * 30), z: +v.z.toFixed(3), whole: whole.length, cut }); }
    const cutFrames = rows.filter(r => r.cut.length);
    console.warn(`PUSH-OUT AUDIT seg_08b k247 cut: ${page.length} page text boxes; ${rows.map(r => `f${r.f} z ${r.z}: ${r.whole} whole, ${r.cut.length} cut`).join('; ')}; ${cutFrames.length} frame(s) with a page text box cut`);
    return { rows, cutFrames: cutFrames.length, outsideStep: cutFrames.length }; })();
  // the eased move down (k254-k258) carries the question and the なまえ row slowly out of the top of the frame (moving, never
  // stopped on them); her letters in the 理由 box are whole on every frame of it, and everything is checked again once it is still
  LAY.frameCheck('進路 page, her letters over the move down (k254-k258)', { sheets: { why: flat }, views: viewsOf(CAMF, camPage, T(254), T(258)) });
  LAY.frameCheck('進路 page, the 理由 box (k258-k259, still)', { sheets: { page: flat, q: flat, 'q:name': flat, why: flat }, views: viewsOf(CAMF, camPage, T(258), T(259)) });
  LAY.frameCheck('her face', { sheets: { face: flat }, views: viewsOf(CAMF, camFace, T(259), SEG[1]) });

  // ---- the landings, frame by frame (根因清单: 放大、过冲类效果按放大后的实际墨迹框逐帧登记检查; 有分支状态的效果要逐帧看完它生效的
  // 整段窗口). Every frame of each landing is drawn alone into a clear world-sized canvas exactly as the page draws it; its drawn
  // pixels are counted inside each neighbouring word or label (any drawn pixel counts: the stamp's paper ground covers what it
  // lands on as surely as its dots), its drawn box is registered on that frame's own sheet with the neighbours (overlap audit),
  // and the stamp's box is checked against the frame as the camera shows it on that frame.
  const overshoot = (() => {
    const [oc, ox] = mk(W, 1080), rows = [];
    const scan = (y0w, boxes) => {   // drawn bbox (world) and drawn-pixel counts inside each neighbour box; canvas row 0 = world y0w
      const d = ox.getImageData(0, 0, W, 1080).data, on = (xx, yy) => d[(yy * W + xx) * 4 + 3] > 40;
      let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
      for (let yy = 0; yy < 1080; yy++) for (let xx = 0; xx < W; xx++) if (on(xx, yy)) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      const hits = {};
      for (const [n, [bx, by, bw, bh]] of Object.entries(boxes)) { let k = 0;
        for (let yy = Math.max(0, Math.floor(by - y0w)); yy < Math.min(1080, Math.ceil(by + bh - y0w)); yy++) for (let xx = Math.max(0, Math.floor(bx)); xx < Math.min(W, Math.ceil(bx + bw)); xx++) if (on(xx, yy)) k++;
        if (k) hits[n] = k; }
      return { box: x1 < 0 ? null : [x0, y0 + y0w, x1 - x0 + 1, y1 - y0 + 1], hits };
    };
    const q23 = LAY.boxes.find(b => b.name === 'question 23').box, l4 = LAY.boxes.find(b => b.name === '問四').box;
    const N4 = { 'question 23': q23, '問四': l4, '問四 underline': [Q4.label[0], Q4.label[1] + Q4.label[2] * 0.62, l4[2] + 40, 4], '思考力問題 tag': Q4.tag,
                 '答 label': Q4.ansLab, 'answer box': [Q4.ans[0] - 2, Q4.ans[1] - 2, Q4.ans[2] + 4, Q4.ans[3] + 4] };
    const drawScan = (y0w, draw, nb) => { ox.setTransform(1, 0, 0, 1, 0, 0); ox.clearRect(0, 0, W, 1080); ox.save(); ox.translate(0, -y0w); draw(ox); ox.restore(); return scan(y0w, nb); };
    const one = (kind, t, y0w, draw, nb, check, register = true) => {
      const fno = Math.round(t * 30), r = drawScan(y0w, draw, nb), sheet = `${kind}@${fno}`;
      if (r.box && register) { LAY.text(`${kind} f${fno}`, sheet, r.box); for (const [n, b] of Object.entries(nb)) LAY.text(`${n} f${fno}`, sheet, b); }
      const row = { kind, f: fno, box: r.box && r.box.map(Math.round), hits: r.hits, ok: !Object.keys(r.hits).length };
      if (check) Object.assign(row, check(r, t, sheet)); rows.push(row); return row;
    };
    const stampFrames = frameTimes(SEG[0], T_STAMP, T_STAMP + 7 * FR + 1e-6);
    for (const t of stampFrames) one('解けません', t, Y4, x => stamp(x, t), N4, (r, tt, sheet) => {
      const v = viewTall(CAMM, camMath(tt)), cut = r.box ? LAY.frameCheck(`解けません landing f${Math.round(tt * 30)}`, { sheets: { [sheet]: flat }, views: [{ t: tt, ...v }] }).filter(q => q.name.startsWith('解けません') && q.state === 'cut') : [];
      return { scale: +stampScale(tt - T_STAMP).toFixed(3), cut: cut.map(q => q.px), ok: !Object.keys(r.hits).length && !cut.length }; });
    for (const [t0, fx] of [[T_LOOP, PX[0]], [T_F2, PX[1]]]) for (const t of frameTimes(SEG[0], t0, t0 + 4 * FR + 1e-6))
      one('reading frame', t, Y4, x => readingFrame(x, fx, rfScale(t)), { 'question 23': q23, '問四': l4, '問四 underline': N4['問四 underline'], '思考力問題 tag': Q4.tag, '答 label': Q4.ansLab, 'answer box': N4['answer box'] });
    const NP = { '回答/なまえ/理由 label column': [BX, BY, LABW, BH], question: [QX, QY - QS * 0.6, QW, QS * 1.2], '得点 box': [100, 300, 300, 200], '注意 box': [1530, 300, 300, 410] };
    NAME.forEach((L, i) => { NP[`name ${L.c}`] = LAY.boxes.find(b => b.name === `name ${L.c}${i}`).box; });
    GROUPS.forEach((G, gi) => { for (const t of frameTimes(SEG[0], G.t, G.t + 4 * FR + 1e-6)) {
      const fl = gi === 4, v = CAMF.view(...camPage(t).slice(0, 3)), vis = [v.fx - W / 2 / v.z, v.fy - 540 / v.z, W / v.z, 1080 / v.z];
      const nb = Object.fromEntries(Object.entries(NP).filter(([, b]) => b[0] < vis[0] + vis[2] && b[0] + b[2] > vis[0] && b[1] < vis[1] + vis[3] && b[1] + b[3] > vis[1]));   // the ones in the frame
      // the rings and the black are shaped (rings, a swell): their boxes overlap everything round them, so they are judged by
      // pixels only, and against their own settled state: the black is designed to swell over the row's rules onto なまえ
      // (reviewed design); a landing frame is a problem only where it reaches past that settled state (more than 12 px)
      const lay = x => { putLayer(x, G.c, t, G.t); if (fl) putLayer(x, FLOOD, t, T_BLACK, true); };
      const settled = drawScan(0, x => { putLayer(x, G.c, G.t + 1, G.t); if (fl) putLayer(x, FLOOD, G.t + 1, T_BLACK, true); }, nb).hits;
      one(fl ? 'black' : `rings k${G.k}`, t, 0, lay, nb, r => { const past = Object.fromEntries(Object.entries(r.hits).filter(([n, k]) => k > (settled[n] || 0) + 12).map(([n, k]) => [n, `${k} (settled ${settled[n] || 0})`]));
        return { settled, past, ok: !Object.keys(past).length }; }, false); } });
    // 正解 (k238, 2026-11-21 rhythm pass): its 1.3x landing about its top-left corner, against the four answer boxes above
    // it, the sum, and the frame as the camera shows it (with the 2.5% hit)
    const NQ3 = Object.fromEntries([0, 1, 2, 3].map(i => [`answer box ${i}`, [Q3.ans.x0 + i * Q3.ans.gap - 2, Q3.ans.y - 2, Q3.ans.s + 4, Q3.ans.s + 4]]));
    for (const n of ['sum 1', 'sum 2', 'question row 2']) { const b = LAY.boxes.find(q => q.name === n); if (b) NQ3[n] = b.box; }
    for (const t of frameTimes(SEG[0], T_ANS, T_ANS + 5 * FR + 1e-6)) one('正解', t, 0, x => okStamp(x, t), NQ3, (r, tt, sheet) => {
      const v = viewTall(CAMM, camMath(tt)), cut = r.box ? LAY.frameCheck(`正解 landing f${Math.round(tt * 30)}`, { sheets: { [sheet]: flat }, views: [{ t: tt, ...v }], inset: 8 }).filter(q => q.name.startsWith('正解') && q.state === 'cut') : [];
      return { scale: +okScale(tt - T_ANS).toFixed(3), cut: cut.map(q => q.px), ok: !Object.keys(r.hits).length && !cut.length }; });
    const ov = LAY.audit('landings, frame by frame (each frame its own sheet)');
    const bad = rows.filter(r => !r.ok);
    console.warn(`LANDING AUDIT seg_08b: ${rows.length} frames, ${bad.length} on a neighbouring word/label or cut by the frame, ${ov.length} box overlaps; stamp A ${ST_A.toFixed(3)} (room above ${ST_ROOM[0].toFixed(0)} px, below ${ST_ROOM[1].toFixed(0)} px, anchor ${ST_ANCHOR.map(Math.round)}) [${rows.map(r => `${r.kind} f${r.f}${r.scale ? ' x' + r.scale : ''} ${r.box ? r.box.join(',') : '-'}${r.past ? (Object.keys(r.past).length ? ' PAST SETTLED ' + JSON.stringify(r.past) : (Object.keys(r.hits).length ? ' (settled state on ' + Object.keys(r.hits).join(', ') + ')' : '')) : (Object.keys(r.hits).length ? ' ON ' + JSON.stringify(r.hits) : '')}${r.cut && r.cut.length ? ' CUT ' + r.cut : ''}`).join('; ')}]`);
    return { frames: rows, stamp: { A: ST_A, room: ST_ROOM, anchor: ST_ANCHOR }, problems: bad.length + ov.length };
  })();
  // her card on ring B: inside its panel, with paper round it (each state, and the turn frame by frame)
  const cardFit = (() => {
    const [oc, ox] = mk(W, 1080), rows = [];
    const cases = [['① link', 0, 'link', {}], ['③ slide', 2, 'slide', {}], ['④ link', 3, 'link', {}], ...[0, 0.25, 0.5, 0.75, 1].map(u => [`② turn u${u}`, 1, 'turn', { u }])];
    for (const [name, i, st, o] of cases) {
      ox.setTransform(1, 0, 0, 1, 0, 0); ox.clearRect(0, 0, W, 1080); ox.save(); ox.translate(0, -Y4); chie(ox, PX[i] + PW / 2, st, o); ox.restore();
      const d = ox.getImageData(0, 0, W, 1080).data; let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
      for (let yy = 0; yy < 1080; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] > 40) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      const inner = [PX[i] + 2, PT + 2, PX[i] + PW - 2, PT + PH - 2], m = [x0 - inner[0], y0 + Y4 - inner[1], inner[2] - x1, inner[3] - (y1 + Y4)];
      rows.push({ name, margins: m.map(Math.round), ok: Math.min(...m) >= 6 });
    }
    const cw = CARD_U * FIG_S, phone = cw * 1.16 * 390 / 1920;
    console.warn(`CARD AUDIT seg_08b (her card on ring B, her_card.js 'title'): ${cardFit_bad(rows)} panels with less than 6 px of paper inside the panel rule [${rows.map(r => `${r.name} margins L${r.margins[0]} T${r.margins[1]} R${r.margins[2]} B${r.margins[3]}`).join('; ')}]; card ${cw.toFixed(0)} px wide in the world, ${(cw * 1.16).toFixed(0)} px on the frame, ${phone.toFixed(1)} px on a 390 px phone`);
    return { panels: rows, worldW: cw, phoneW: phone, problems: rows.filter(r => !r.ok).length };
  })();
  function cardFit_bad(rows) { return rows.filter(r => !r.ok).length; }
  // ---- her card is not covered by its own 知恵の輪 figure (2026-11-21 review MUST, 问四③: the CARD AUDIT above only measured the
  // card's room to the panel rule, so the D-ring, ring B and an arrow lying on ③'s card were never seen). Two checks:
  // 1. boxes: for every figure state, each element of the figure (strap, D-ring, ring B above the card, ring B in the slot, the
  //    arrows) is registered on a sheet of its own together with the card face, split round the slot column (the only place
  //    the ring may meet the card), and the overlap audit runs over those sheets.
  // 2. pixels, frame by frame: every frame from ① being printed to the frame before 解けません, q4 is drawn into a world canvas as
  //    the page draws it, and each printed panel's card is compared with the card drawn alone at the same place (dx shake and
  //    ②'s turn included); a pixel that differs where the card face is opaque, outside the slot column, is something lying on
  //    the card. The reading frame is counted apart (a second pass with it drawn): it is the one moving thing that sweeps into ③
  //    before the stamp (k245.5-k246: it sets off for ③ and the stamp stops it half way); it now runs under the figures, so
  //    any count there means it is back on top of the card.
  const cardCover = (() => {
    const states = [['① link', 0, 'link', {}], ['③ slide', 2, 'slide', {}], ['④ link', 3, 'link', {}], ...[0, 0.25, 0.5, 0.75, 1].map(u => [`② turn u${u}`, 1, 'turn', { u }])];
    const [, sx] = mk(8, 8);
    for (const [name, i, st, o] of states) {
      const B = figBoxes(chie(sx, PX[i] + PW / 2, st, o));
      for (const [en, eb] of Object.entries(B.el)) { const sh = `card cover ${name} | ${en}`; LAY.reg(en, sh, eb); for (const [cn, cb] of Object.entries(B.card)) LAY.reg(cn, sh, cb); }
    }
    const boxOv = LAY.audit('her card vs her own 知恵の輪 figure (each element on its own sheet with the card face)');
    const R0 = PT - Y4 - 4, RH = PH + 8;                                   // the panel row, canvas rows
    const [, ax] = mk(W, 1080), [, kx] = mk(W, 1080);
    const grab = (x, draw) => { x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, 1080); x.save(); x.translate(0, -Y4); draw(x); x.restore(); return x.getImageData(0, R0, W, RH).data; };
    const rows = [], perPanel = {};
    for (const t of frameTimes(SEG[0], T_PANEL[0], T_STAMP - 1e-6)) {
      const fno = Math.round(t * 30), A = grab(ax, x => q4(x, t, { rf: false })), geos = Q4GEO.map(g => g && { ...g });
      const Arf = grab(ax, x => q4(x, t, { rf: true }));
      geos.forEach((geo, i) => {
        if (!geo || geo.printed < 1) return;
        const K = grab(kx, x => cardAlone(x, geo)), B = figBoxes(geo), [cx0, cy0, cw0, ch0] = B.cardWorld, [sx0, sy0, sw0, sh0] = B.slotWorld;
        let n = 0, nrf = 0, bb = null;
        for (let yy = Math.ceil(cy0 + 2); yy < Math.floor(cy0 + ch0 - 2); yy++) for (let xx = Math.ceil(cx0 + 2); xx < Math.floor(cx0 + cw0 - 2); xx++) {
          if (xx >= sx0 - 1 && xx <= sx0 + sw0 + 1 && yy <= sy0 + sh0 + 1) continue;      // the slot column: the ring threads it here
          const r = yy - Y4 - R0; if (r < 0 || r >= RH) continue; const p = (r * W + xx) * 4;
          if (K[p + 3] < 250) continue;                                                    // only where the card face is opaque
          const diff = (D) => Math.max(Math.abs(D[p] - K[p]), Math.abs(D[p + 1] - K[p + 1]), Math.abs(D[p + 2] - K[p + 2])) > 6;
          if (diff(A)) { n++; bb = bb ? [Math.min(bb[0], xx), Math.min(bb[1], yy), Math.max(bb[2], xx), Math.max(bb[3], yy)] : [xx, yy, xx, yy]; }
          else if (diff(Arf)) nrf++;
        }
        const key = '①②③④'[i]; (perPanel[key] ||= { frames: 0, covered: [], readingFrame: [] }).frames++;
        if (n) perPanel[key].covered.push({ f: fno, px: n, box: bb });
        if (nrf) perPanel[key].readingFrame.push({ f: fno, px: nrf });
        rows.push({ f: fno, panel: key, px: n, rf: nrf });
      });
    }
    const bad = rows.filter(r => r.px > 0);
    const fmt = (k, P) => `${k} ${P.frames} frames, covered ${P.covered.length ? P.covered.map(c => `f${c.f} ${c.px}px [${c.box.map(Math.round)}]`).join(', ') : 0}${P.readingFrame.length ? `, the moving reading frame on it f${P.readingFrame.map(c => `${c.f} ${c.px}px`).join(', f')}` : ''}`;
    console.warn(`CARD COVER AUDIT seg_08b (her card vs the rest of its 知恵の輪 panel, the slot column excepted): ${boxOv.length} box overlaps over ${states.length} figure states; ${bad.length} frame-panels with pixels on the card [${Object.entries(perPanel).map(([k, P]) => fmt(k, P)).join('; ')}]`);
    return { boxOverlaps: boxOv, panels: perPanel, problems: boxOv.length + bad.length };
  })();
  // ---- LYRIC AUDIT (lyrics.js): for every sung character this segment shows, the first frame it reads on, worked out from the
  // same rules the drawing uses (printSung / whiteLetter: sungBuild whole; her pencil letters: the sungSweep whole), within the
  // shot that shows it ----
  const L22 = LY.lineAt(22, 'そろばんでこの式が解けますか');
  const FT = frameTimes(SEG[0], SEG[0], SEG[1]);
  const readOn = (t, ok, [a, b]) => { const f = FT.find(tt => tt >= a && tt < b && ok(tt)); return f === undefined ? null : f; };
  const sungWhole = t => tt => sungBuild(tt - t) >= 1;
  const LYR = [
    ...L22.filter(([, t]) => t >= SEG[0]).map(([c, t]) => ({ c, t, readT: readOn(t, sungWhole(t), [SEG[0], T(247)]) })),
    ...L23.map(([c, t]) => ({ c, t, readT: readOn(t, sungWhole(t), [T(239), T(247)]) })),
    ...QCH.filter(([, t]) => t >= 0).map(([c, t]) => ({ c, t, readT: readOn(t, sungWhole(t), [T(247), T(259)]) })),
    ...WHY.map(L => ({ c: L.c, t: L.t, readT: readOn(L.t, tt => sungSweep(tt, L.t, L.d) >= 1, [T(247), T(259)]) })),
    ...[...COL1, ...COL2].map(p => ({ c: p.c, t: p.t, readT: readOn(p.t, sungWhole(p.t), [T(259), SEG[1]]) }))];
  const lyricRes = lyricAudit('seg_08b', LYR);
  { const d = LYR.filter(e => e.readT !== null).map(e => (e.readT - e.t) * 1000);
    console.warn(`LYRIC TIMING seg_08b: ${d.length} characters, read on average ${(d.reduce((a, v) => a + v, 0) / d.length).toFixed(0)} ms after the onset, latest ${Math.max(...d).toFixed(0)} ms, earliest ${Math.min(...d).toFixed(0)} ms`); }
  // ---- MOTION AUDIT (camera.js, docs/制作约定.md 第六节「整屏运动」): every frame's view as actually shown, one shot after
  // another; a new shot's first frame is a cut (k247 the 進路 page, k259 her face) ----
  const camAll = t => t < T(247) ? viewTall(CAMM, camMath(t)) : t < T(259) ? CAMF.view(...camPage(t).slice(0, 3)) : CAMF.view(...camFace(t).slice(0, 3));
  const CUTS = [T(247), T(259)].map(c => frameTimes(SEG[0], c, c + FR + 1e-6)[0]);
  const MOTION_R = motionAudit('seg_08b', FT.map(t => ({ t, ...camAll(t), cut: CUTS.some(c => Math.abs(c - t) < 1e-6) })), {
    big: [[T_STAMP, '解けません: the stamp slams across the panels (画面中心的击打)'], [T_SNAP, 'the pencil snaps in her fist (画面中心的击打, 段内最响)']],
    whips: [[T(239), 'slide down the sheet to 問四']] });
  // ---- PART AUDIT (parts.js): every code-drawn part on its own drawing's pixels ----
  { const pencil = p => PIX.opaque(p) && !PIX.skin(p) && !(p[0] - p[2] > 90 && p[1] - p[2] > 50);   // the pencil: opaque, not skin, not her hair
    // the stub the front half and the bits leave from: its centreline lies on the drawn stub (green, wood, lead, outline) all along
    partAudit('seg_08b', 'r08b_snapc', 'stub centreline', { image: RAW.snap, points: samplesAlong(STUB.back, STUB.tip, 60), on: pencil, r: 2, maxOffPct: 0 });
    // the flying front half is turned by its own axis: that axis is the drawn piece's centreline
    axisAudit('seg_08b', 'p08b_front', 'body', { image: RAW.front, axis: FRONT.axis, halfWidth: 80 });
    // each hand is placed by its drawn pencil point: the point is on the graphite of the drawn point
    for (const [k, name] of [['write', 'h08b_write'], ['pull', 'h08b_pull'], ['scrawl', 'h08b_scrawl']])
      partAudit('seg_08b', name, 'pencil point', { image: RAW[k], points: [partOf(PA, name, 'tip').point], on: PIX.dark, r: 3, maxOffPct: 0 });
    // the front half on the snap's instant continues the stub: its torn end on the stub's tip, along the stub's direction
    const a0 = P0.toWorld(FAX.back), d0 = P0.dirToWorld(FAX.dir), dAng = Math.atan2(d0[1], d0[0]) - P_ANG;
    console.warn(`SNAP JOIN seg_08b: front half's torn end ${a0.map(v => v.toFixed(1))} vs the stub's tip ${BRK.map(v => v.toFixed(1))}, direction off ${(dAng * 180 / Math.PI).toFixed(3)} deg; piece ${(FRONT.axis[1][0] - FRONT.axis[0][0]) * FSC | 0} px long`); }
  const PARTS_R = partReport('seg_08b');
  S.finish();
  publishAudit(S, LAY, { segment: [F0, F1], landings: overshoot, cardFit, cardCover, pushOut, lyrics: { ...lyricRes, chars: LYR }, motion: MOTION_R, parts: PARTS_R });

  window.renderAt = async t => {
    const tt = t; g.setTransform(1, 0, 0, 1, 0, 0);
    if (tt < T(247)) {
      const sliding = tt > T(239) && tt < T(240);
      if (!sliding) { shootTall(CAMM, camMath(tt), tt, ctx => drawMath(ctx, tt)); return; }
      // the slide: twelve exposures over half a frame, averaged. (2026-11-21: these used to go to CAMO.shoot with the tall sheet's
      // focus y as is; the 1080-tall camera clamped it to 540, so the old film never slid: it zoomed in place on 問三 and jumped
      // to 問四 on k240. Now shot like every other frame of the sheet, shootTall.)
      const n = 12; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);   // 12: with 4 the fast first frames showed separate ghost copies
      for (let i = 0; i < n; i++) { const ti = tt - (i / (n - 1)) * FR * 0.5; shootTall(CAMO, camMath(ti), ti, ctx => drawMath(ctx, tt)); g.globalAlpha = 1 / (i + 1); g.drawImage(OFF, 0, 0); }
      g.restore(); return;
    }
    if (tt < T(259)) {
      const c = camPage(tt);
      CAMF.shoot(c, c[3], tt, ctx => {
        ctx.drawImage(PG, 0, 0); printSung(ctx, QCH, QX, QY, QS, tt); drawRun(ctx, NAME, tt);
        rings(ctx, tt); drawRun(ctx, WHY, tt);
        const h = handAt(tt); HAND[h.h].draw(ctx, h.p[0], h.p[1], h.lift, HSC);
      });
      return;
    }
    const c = camFace(tt);
    CAMF.shoot(c, c[3], tt, ctx => {
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, 1080); ctx.drawImage(FIB, 0, 0); ctx.drawImage(GF, 0, 0);
      const im = tt < T_SNAP ? IMG.grip : IMG.snap; ctx.drawImage(im, FX, 0, im.width * FS, im.height * FS);
      debris(ctx, tt);
      [...COL1, ...COL2].forEach(p => whiteLetter(ctx, p.c, p.x, p.y, p.size, tt - p.t, true));
    });
    const fa = flashA(tt, T_SNAP); if (fa > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = fa; g.fillStyle = PAPER; g.fillRect(0, 0, W, 1080); g.restore(); }
  };
  await window.renderAt(P('t0', SEG[0]));
}
