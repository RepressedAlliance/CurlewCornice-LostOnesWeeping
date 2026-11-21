// Segment 12 副歌2 (docs/分镜/12_副歌2.md 第 3 稿, design 甲), k359-k423, global frames [3998, 4710).
// The finished segment, after the blind review of the samples (sample page and design 乙 in archive/seg12_sample_20261120/).
//   S1 k359-k367  Q1 as Demo 2 v15 (号哭); k366 正解 and in the same beat the cut line splits: one teal eye looks at us.
//   S2 k367-k383  Q2: the printed bust of HER lies exactly on the real her; the slit stays put across the cut. k374 the second
//                 読み取れません half-prints as the slit is torn wide (half the face printed, half real); k375-k380 five strips
//                 tear and fold down in perspective, one by one uncovering her shoulder, her fretting hand, the neck, the
//                 headstock and her open tall locker; her heavy pencil words on their backs; k381 the rest of the figure swings
//                 open like a door: she stares back, cold; k382 the push into the tear (paper 1.6, her 1.15, lockers 1.08).
//   S3 k383-k391  she shouts at us; the locker windows behind her flip black one letter at a time (句41).
//   S4 k391-k407  the 数学 page of 08b as it was (abacus at 4194, 解けません); its cut line opens in three beats and her lowered
//                 eyes are in the slit; k397 two fists bulge the paper, k399 her hands punch through and pinch the printed
//                 rings of panel ③ and pull: the rings do not move, the reading frame goes on to ④ and the loop arrow prints again.
//   S5 k407-k423  the 進路 page as a stack of thirty answer sheets, everyone's はい filled black; torn into strips from below,
//                 she plays behind them; k413 the outer two drop, k420 / k421 the left and right halves drop, k422 the title
//                 band flips up and away: 8 frames of nothing between her and us.
// Round 5 (review 2026-11-21): S4's forearms are drawn whole (no seam), the punched holes are the sleeves' silhouettes, torn
// like the slit; S5 is re-laid so no white letter is behind her (scale 1.15, eyes at x 880); FIGURE AUDIT checks every letter
// against the silhouettes of the drawings in front of it (S3 windows, S4 print, S5 white letters).
// Round 9 (card review 2026-11-21, MUST): the card on S4's ring B is her card, 08b's: her_card.js 'title', 3:2, hung by its
// holder slot, CARD_SHADOW and a teal rule, the arrow across it haloed (it was 08b's old blank 5:3 card); the figure is 24 px
// higher; CARD AUDIT, and the card's lines in the layout, frame and figure audits.
// Round 10 (card re-review 2026-11-21, MUST): round 9 kept 08b's OLD ③ round the new card (ring B at the bar's corner, the
// rings and a haloed arrow over the card: ロ read コ, labels and み/ん covered). S4's ③ is now 08b's current ③ (seg_08b.js
// SLIDE: same numbers, drawing order, slot-column clip, both arrows clear of the card, no halo; SYNC 08b SLIDE reads them
// from 08b's source); the figure at CHY 715 (問四 and the panels 12 px up), the pinch points recomputed from the new ring B;
// CARD COVER AUDIT (boxes, the printed figure, every frame's page and front layers against the card drawn alone).
// Round 11 (2026-11-21, user after the second cut: 「一直抖动屏幕……看着很晕」; docs/制作约定.md 第六节「整屏运动」): five whole-frame
// jolts instead of ~45 (k360 大击, k374, k392, k399 ordinary <= 1 %, k421 大击), the push into the tear k382 as the registered
// whip, two flashes (k360, k420); no punch-backs, dips or shakes; S4 keeps the band in the frame (zoom anchored on the top
// edge); S5's strips sway one way and settle. MOTION AUDIT and PART AUDIT (web/lib/parts.js, art/cut/seg12_parts.json:
// the card windows and the pinch points, each drawing's own) are published.
// Everything timed comes from web/lib/: beats, events and the drawings' timeline (score.js), lyrics by line number (lyrics.js),
// layout and frame audit (type.js), 16-dot print and white letters (print.js), colours (palette.js), the card layout (card.js).
// The paper (tears, folds, door, lockers, heavy pencil) is this segment's own: web/scenes/segments/12/paper12.js.
import { FRAME as FR, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics, lyricAudit, onsetFrame } from '../../lib/lyrics.js';
import { textBox, measure, createLayout } from '../../lib/type.js';
import { createCamera, pushes, move, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, partAudit, PIX, partReport } from '../../lib/parts.js';
import { print16, print16Box, printSung, whiteLetter, vertical, sungShown, sungSweep, sungBuild } from '../../lib/print.js';
import { CARD_RATIO } from '../../lib/card.js';
import { herCardFace, herCardBoxes, HER_CARD, BACK as HER_BACK } from '../../lib/her_card.js';
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, GRAPHITE, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, INK_RGB, FIBRE_RGB, CARD_SHADOW, HAND_SHADOW, PENCIL, rgba } from '../../lib/palette.js';
import { mk, noise1, roughLine, roughPath, pathPoly, polyline, perfEdges, tornEdge, backPaper, drawFold, drawDoor, makeBits, drawBits,
         heavyPencil, drawLockers, openLocker, scissors, cutLine, cutLineH, shadowOf } from './12/paper12.js';

export default async function seg12(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 3998, F1 = 4710, SEG = [F0 / 30, F1 / 30];
  const K = beatV;
  const S = createScore('seg_12', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const LY = await loadLyrics();
  const L38 = LY.lineAt(38, '黒板のこの漢字が読めますか'), L39 = LY.lineAt(39, 'あの子の心象は読めますか');
  const L40 = LY.lineAt(40, 'その心を黒く染めたのは'), L41 = LY.lineAt(41, 'おい誰なんだよおい誰なんだよ');
  const L42 = LY.lineAt(42, 'そろばんでこの式が解けますか'), L43 = LY.lineAt(43, 'あの子の首の輪も解けますか');
  const L44 = LY.lineAt(44, '僕達このまんまでいいんですか'), L45 = LY.lineAt(45, 'おいどうすんだよおいどうすんだよ');
  const HP = heavyPencil();
  const tb = (ctx, text, font, box, o = {}) => textBox(ctx, text, font, box, { layout: LAY, ...o });
  const flat = p => p;

  // ---------- rhythm pass (2026-11-21, user: 「这是一首摇滚乐 我希望我的的切分镜啊 什么动态效果啊……就是希望视频跟歌曲节奏一致」) ----------
  // work/rhythm_diag (drums on the backing stem against the film's frame differences): this chorus is loud (44.9 dB) but its
  // picture was the film's stillest (75 % of frames static; k392-k406 locked for 15 beats; the k420-k423 tutti not met). The
  // camera now hits with the drums. Every strike starts on its beat's frame (the first frame at or after the beat; nothing early)
  // and is deterministic (no random shake, docs/制作约定.md 第八节: no roll, no tilt):
  //   hit    a punch-in: 60 % of it on the beat frame, 90 % the next, whole on the third, then decays (tau 0.11 s)
  //   dip    the picture drops straight down (px): 60 % / 100 % over two frames, back over five, a 1 px rebound
  //   step   a step push (zoom amount): starts on the beat frame, there in 4 frames with a 10 % overshoot, still until the next
  //          (with snap: whole on the beat frame, a 4 % overshoot on the next, settled on the third: a cut-in, S4 k399)
  //   flash  paper white over the whole frame, 78 % on the beat frame and 30 % on the next (crashes only, one per 4-bar phrase)
  // Only the strike's start is a beat event (registered below); its 3-4 frame arrival is the strike itself, not a second event.
  // Round 11 (2026-11-21, the user after the second cut: 「你为什么要一直抖动屏幕？……看着很晕啊」「不是完全不能晃 但是不能晕」;
  // docs/制作约定.md 第六节「整屏运动」, MOTION AUDIT below): the camera no longer hits every beat. The whole frame jolts five
  // times in the segment: k360 (大击: crash, 号哭 slams), k374 (second 読み取れません, <= 1 %), k392 (S4's crash, <= 1 %), k399
  // (her hands punch through, <= 1 %), k421 (大击: the loudest crash of the closing tutti, 26.6 dB); k382 is the registered whip
  // (the push into the tear, 11 frames). Each jolt is a one-way step (there in 3 frames, 6 % overshoot, then still); no punch
  // that comes back, no dip, no shake. Every other beat is carried inside the picture: the strips tear, the windows flip, the
  // slit opens, the fists bulge, the rings are pulled, the reading frame moves, the stack is torn and drops.
  const nF = d => Math.floor(d / FR + 1e-6);
  const HIT_ENV = [0.6, 0.9, 1], DIP_ENV = [0.6, 1, 0.78, 0.5, 0.24, 0.04, -0.1, -0.04], STEP_ENV = [0.6, 0.95, 1.06, 1.02, 1], SNAP_ENV = [1, 1.04, 1.01], FLASH_ENV = [0.78, 0.3];
  const hitEnv = d => d < 0 ? 0 : nF(d) < 3 ? HIT_ENV[nF(d)] : Math.exp(-(d - 2 * FR) / 0.11);
  const dipEnv = d => d < 0 || nF(d) >= DIP_ENV.length ? 0 : DIP_ENV[nF(d)];
  const stepEnv = (d, snap = false) => { const E = snap ? SNAP_ENV : STEP_ENV; return d < 0 ? 0 : nF(d) < E.length ? E[nF(d)] : 1; };
  function strikes(shot, list) {
    const L = list.map(([k, o]) => { const t = K(k), what = [o.step && `${o.snap ? 'snap ' : ''}step ${+(o.step * 100).toFixed(2)}%`, o.hit && `punch ${+(o.hit * 100).toFixed(1)}%`, o.dip && `dip ${o.dip}px`, o.flash && 'flash'].filter(Boolean).join(', ');
      S.ev(`${shot} k${k} ${o.why}: ${what}`, t); return { t, ...o }; });
    const sum = (tt, f) => L.reduce((a, s) => a + f(s, tt - s.t), 0);
    return { list: L,
      steps: tt => sum(tt, (s, d) => (s.step || 0) * stepEnv(d, s.snap)),
      z: tt => 1 + sum(tt, (s, d) => (s.step || 0) * stepEnv(d, s.snap) + (s.hit || 0) * hitEnv(d)),
      dip: tt => sum(tt, (s, d) => (s.dip || 0) * dipEnv(d)),
      flash: tt => L.reduce((a, s) => s.flash && tt >= s.t && nF(tt - s.t) < FLASH_ENV.length ? Math.max(a, FLASH_ENV[nF(tt - s.t)] * s.flash) : a, 0) };
  }

  // ---------- the shots ----------
  const TQ2 = K(367), TS3 = K(383), TS4 = K(391), TS5 = K(407);
  S.hold('shot', 'S1 Q1 (号哭)', SEG[0], TQ2, { kind: 'shot', onBeat: false });
  S.hold('shot', 'S2 Q2, torn open', TQ2, TS3, { kind: 'shot' });
  S.hold('shot', 'S3 she shouts, windows flip', TS3, TS4, { kind: 'shot' });
  S.hold('shot', 'S4 数学 page, her hands through it', TS4, TS5, { kind: 'shot' });
  S.hold('shot', 'S5 進路 stack torn into strips', TS5, SEG[1], { kind: 'shot' });

  // ---------- her drawings (Codex, art/cut/) ----------
  const DRAW = { cold: '/art/cut/r12_play_cold.png', shoutA: '/art/cut/r12c_shout_a.png', shoutAB: '/art/cut/r12c_shout_ab.png', shoutB: '/art/cut/r12c_shout_b.png',
                 anoko: '/art/cut/p12_anoko.png', strain: '/art/cut/r12_strain_close.png', strainB: '/art/cut/r12_strain_close_b.png',
                 pryL: '/art/cut/h12_pry2_l.png', pryR: '/art/cut/h12_pry2_r.png', bust: '/art/cut/r12_bust_play.png',
                 bustA: '/art/cut/r12_bust_shout_a.png', bustB: '/art/cut/r12_bust_shout_b.png' };
  const IMG = {};
  for (const [k, f] of Object.entries(DRAW)) IMG[f] = k === 'anoko' ? await img(f) : rinPalImage(await img(f));

  // Her card (docs/卡面状态.md; 2026-11-21 card unification): the face is web/lib/her_card.js's herCardFace, state 'title'
  // (all of 12 is after 03 k40: 読み取れません band in the name field, ロストワン in the 学籍番号 rows, の号哭 in her pencil, the
  // grid pressed under the title); no face coordinates of this segment's own. Codex drew the chest card as a clear holder
  // with a blank white window. CARD_WIN is that window in each drawing (the near-white region's pixel edges, measured with
  // work/seg/12/fine/find_card.py at threshold 225: TL, TR, BR, BL). The window is about 1.64:1, so the 3:2 card is fitted in
  // it whole (contain, centred) and mapped through its four corners as a true perspective (homography, as seg_04), sampled
  // 4 x 4 per pixel from a face prefiltered down to about 4x its size in the drawing, so the grid does not alias. It is laid
  // over the window opaque and only inside the card: the face canvas's rounded corners and holder slot are transparent, so
  // the window shows through the slot and at the card's sides (a paper edge against the holder) and the drawn rim stays.
  function homography(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) { const [x, y] = src[i], [X, Y] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X); A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y); }
    for (let c = 0; c < 8; c++) {
      let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
      for (let r = 0; r < 8; r++) { if (r === c) continue; const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; }
    }
    const h = b.map((v, i) => v / A[i][i]);
    return ([x, y]) => { const w = h[6] * x + h[7] * y + 1; return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w]; };
  }
  function cardCorners(q) {
    const unit = homography([[0, 0], [1, 0], [1, 1], [0, 1]], q), len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    const r = (len(q[0], q[1]) + len(q[3], q[2])) / (len(q[0], q[3]) + len(q[1], q[2]));
    const du = r > CARD_RATIO ? (1 - CARD_RATIO / r) / 2 : 0, dv = r > CARD_RATIO ? 0 : (1 - r / CARD_RATIO) / 2;
    return [[du, dv], [1 - du, dv], [1 - du, 1 - dv], [du, 1 - dv]].map(unit);
  }
  // her_card.js's face at u = 2400, halved step by step (each step filters), then to fu: no grid aliasing at any size
  function herFaceAt(fu) {
    let src = herCardFace(2400, { state: 'title' });
    while (src.width / 2 >= fu) { const [c, x] = mk(src.width / 2, src.width / 2 / CARD_RATIO); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height); src = c; }
    const [fc, fx] = mk(fu, fu / CARD_RATIO); fx.imageSmoothingQuality = 'high'; fx.drawImage(src, 0, 0, fc.width, fc.height); return fc;
  }
  const CARD_SS = 4, CARD_ON = {};
  function printCard(file, q) {
    const im = IMG[file], Q = cardCorners(q), wq = Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]), fc = herFaceAt(Math.round(wq * CARD_SS));
    const fw = fc.width, fh = fc.height, Fd = fc.getContext('2d').getImageData(0, 0, fw, fh).data, inv = homography(Q, [[0, 0], [fw, 0], [fw, fh], [0, fh]]);
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const X0 = Math.floor(Math.min(...Q.map(p => p[0]))), X1 = Math.ceil(Math.max(...Q.map(p => p[0])));
    const Y0 = Math.floor(Math.min(...Q.map(p => p[1]))), Y1 = Math.ceil(Math.max(...Q.map(p => p[1]))), bw = X1 - X0;
    const d = x.getImageData(X0, Y0, bw, Y1 - Y0), D = d.data, n = CARD_SS * CARD_SS;
    for (let py = Y0; py < Y1; py++) for (let px = X0; px < X1; px++) {
      let r = 0, gg = 0, bb = 0, a = 0;
      for (let j = 0; j < CARD_SS; j++) for (let i = 0; i < CARD_SS; i++) {
        const [u, v] = inv([px + (i + 0.5) / CARD_SS, py + (j + 0.5) / CARD_SS]); if (u < 0 || v < 0 || u >= fw || v >= fh) continue;
        const o = (Math.floor(v) * fw + Math.floor(u)) * 4, al = Fd[o + 3] / 255; r += Fd[o] * al; gg += Fd[o + 1] * al; bb += Fd[o + 2] * al; a += al;
      }
      if (!a) continue;
      const A = a / n, o = ((py - Y0) * bw + px - X0) * 4;
      D[o] = D[o] * (1 - A) + r / n; D[o + 1] = D[o + 1] * (1 - A) + gg / n; D[o + 2] = D[o + 2] * (1 - A) + bb / n;
    }
    x.putImageData(d, X0, Y0); IMG[file] = c; CARD_ON[file] = Q;
  }
  // Round 11 (根因清单 「笔芯和笔不对了……」: parts only through web/lib/parts.js, each drawing's own anchors): the window of each
  // drawing is read from art/cut/seg12_parts.json (card.quad, that drawing's px; partOf throws for a drawing without its own),
  // and PART AUDIT checks it against the drawing's pixels before the face goes in: every point inside the window is the drawn
  // blank window (near white, opaque), and a ring 4 px outside it is not (the holder's rim).
  // The printed bust of her in Q2 (P12-anoko, the same pose and canvas as R12-play cold): its card window was left blank, so the
  // print showed her with a blank card while her real card says the title (卡面状态.md 改定 15: never a blank card from 03 on).
  // The same face goes in; ANOKO then turns the whole drawing, card included, into one teal ink, as the printer would print it.
  const PA = await loadPartAnchors('/art/cut/seg12_parts.json');
  const nameOf = f => f.split('/').pop().replace(/\.png$/, '');
  const WHITE = ([r, g2, b, a]) => a > 200 && (r + g2 + b) / 3 >= 225, NOT_WHITE = p => !WHITE(p);
  const CARD_WIN = {};
  for (const k of ['cold', 'shoutA', 'shoutAB', 'shoutB', 'bust', 'bustA', 'bustB', 'anoko']) {
    const f = DRAW[k], q = partOf(PA, nameOf(f), 'card').quad; CARD_WIN[f] = q;
    const x0 = Math.min(...q.map(p => p[0])), x1 = Math.max(...q.map(p => p[0])), y0 = Math.min(...q.map(p => p[1])), y1 = Math.max(...q.map(p => p[1]));
    const inside = [], ring = [];
    for (let x = x0 + 2; x <= x1 - 2; x += 2) for (let y = y0 + 2; y <= y1 - 2; y += 2) inside.push([x, y]);
    for (let x = x0; x <= x1; x += 2) ring.push([x, y0 - 4], [x, y1 + 4]);
    for (let y = y0; y <= y1; y += 2) ring.push([x0 - 4, y], [x1 + 4, y]);
    // against the drawing as Codex drew it (the palette mapping lightens a few rim pixels; the window is the same pixels)
    const raw = await img(f);
    partAudit('seg_12', nameOf(f), 'card window (inside)', { image: raw, points: inside, on: WHITE, r: 0, maxOffPct: 1 });
    partAudit('seg_12', nameOf(f), 'card window (holder rim outside it)', { image: raw, points: ring, on: NOT_WHITE, r: 0, maxOffPct: 3 });
  }
  for (const [f, q] of Object.entries(CARD_WIN)) printCard(f, q);
  // the face's lines against the card's own labels (card space, u = 1000), as 03 and 04 audit the same face
  { const CU = 1000, fb = herCardBoxes(CU, { state: 'title' });
    for (const [nm, b] of Object.entries(fb.lines)) LAY.text(`card ${nm}`, 'cardface', b);
    for (const [nm, b] of Object.entries(fb.labels)) LAY.text(`card label ${nm}`, 'cardface', b);
    LAY.audit('seg_12 her card face (her_card.js)'); }

  // the drawings' silhouettes (alpha > 0.5): for the punched holes (S4) and for the figure audit (no letter behind her)
  const MASKS = {};
  function maskOf(file) {
    if (MASKS[file]) return MASKS[file];
    const im = IMG[file], [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data, w = c.width, h = c.height, m = new Uint8Array(w * h);
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 128 ? 1 : 0;
    return (MASKS[file] = { m, w, h, at: (px, py) => { px = Math.floor(px); py = Math.floor(py); return px >= 0 && py >= 0 && px < w && py < h && m[py * w + px] === 1; } });
  }
  // Figure audit (round 5, review MUST 1: the white letters of 句45 were hidden behind the guitar's headstock and FRAME AUDIT
  // said 0, because the layout checks only boxes against boxes and the frame). For every frame of a window, every letter box
  // that is already showing is tested against the silhouettes of the drawings in front of it, placed as the frame places them
  // (same space as the boxes). A letter is 'covered' when any silhouette pixel falls inside its box grown by `pad` px.
  // Round 6 (review MUST: the torn root of the page in S3 covered the left half of 「ん・だ・よ」 and the audit said 0, because only
  // the drawings were obstacles): every opaque layer in front of the letters counts, at its real alpha. A figure is either a
  // drawing ({ file, x, y, s }) or a foreground layer ({ at(x, y) } in the boxes' space, made by layerFig from the canvas the
  // frame draws: the page's torn root and strips, the flaps of a punched hole, torn bits, falling halves, the title band).
  // figures(t, liveBoxes, pad) is called once per frame.
  const FIG = [];
  function layerFig(name, canvas, toC, boxes, pad) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const { box: [bx, by, bw, bh] } of boxes) for (const [x, y] of [[bx - pad, by - pad], [bx + bw + pad, by - pad], [bx - pad, by + bh + pad], [bx + bw + pad, by + bh + pad]]) {
      const [cx, cy] = toC(x, y); x0 = Math.min(x0, cx); y0 = Math.min(y0, cy); x1 = Math.max(x1, cx); y1 = Math.max(y1, cy); }
    x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2); x1 = Math.min(canvas.width, Math.ceil(x1) + 2); y1 = Math.min(canvas.height, Math.ceil(y1) + 2);
    const w = x1 - x0, h = y1 - y0; if (w <= 0 || h <= 0) return { name, at: () => false };
    const d = canvas.getContext('2d').getImageData(x0, y0, w, h).data;
    return { name, at: (x, y) => { const [cx, cy] = toC(x, y), px = Math.floor(cx) - x0, py = Math.floor(cy) - y0; return px >= 0 && py >= 0 && px < w && py < h && d[(py * w + px) * 4 + 3] > 128; } };
  }
  function figureCheck(label, { boxes, figures, times, pad = 8 }) {
    const hits = new Map();
    for (const t of times) { const live = boxes.filter(b => t >= (b.from ?? -1e9)); if (!live.length) continue;
      for (const f of figures(t, live, pad)) {
        const at = f.at || (M => (x, y) => M.at((x - f.x) / f.s, (y - f.y) / f.s))(maskOf(f.file));
        for (const b of live) { const [bx, by, bw, bh] = b.box; let n = 0, nIn = 0;
          for (let y = by - pad; y < by + bh + pad; y += 2) for (let x = bx - pad; x < bx + bw + pad; x += 2) if (at(x, y)) { n++; if (x >= bx && x < bx + bw && y >= by && y < by + bh) nIn++; }
          if (n) { const k = `${b.name} behind ${f.name}`, o = hits.get(k) || { first: t, last: t, px: 0, n: 0, nIn: 0 };
            o.last = t; o.px = Math.max(o.px, n * 4); o.n++; if (nIn) o.nIn++; hits.set(k, o); } } } }
    // covered: something opaque on the letter's box in any frame, or within `pad` of it for 3 frames or more; a layer passing
    // within `pad` of a letter for one or two frames (a falling strip's fibres going by) is listed as a brush, not a cover
    const fmt = ([k, o]) => `${k} ${o.first.toFixed(2)}-${o.last.toFixed(2)}s (${o.n} frames, ${o.nIn} on the box, ${o.px} px)`;
    const all = [...hits], bad = all.filter(([, o]) => o.nIn > 0 || o.n >= 3).map(fmt), brush = all.filter(([, o]) => !(o.nIn > 0 || o.n >= 3)).map(fmt);
    FIG.push({ label, boxes: boxes.length, frames: times.length, covered: bad, brushes: brush });
    console.warn(`FIGURE AUDIT ${label}: ${boxes.length} boxes over ${times.length} frames, ${bad.length} covered by a drawing or a foreground layer${bad.length ? ': ' + bad.join('; ') : ''}${brush.length ? `; ${brush.length} brushes within ${pad} px: ` + brush.join('; ') : ''}`);
  }

  // =====================================================================================================================
  // S1 + S2 + S3: she comes back into the picture (第 3 节 甲)
  // =====================================================================================================================
  // R12-play (cold) and its shout variants (same canvas) placed in the S2 frame: her right eye (viewer's right) on the slit at
  // (480, 362), about 64 px wide; the face centre F is the pivot of the push into the tear.
  const RS = 1.06, RX = 480 - 493.5 * RS, RY = 362 - 344.8 * RS;
  const EYE = [480, 362], F = [RX + 441 * RS, RY + 360 * RS];
  // where the face lands after the push into the tear (S3). Round 5: x 700 -> 740; at 700 shout-b's hair (from k387) covered the
  // right half of 「誰」 in the left group of windows (found by the new figure audit, the same fault as review MUST 1)
  const C1 = [740, 540];
  // the three layers' scales at the end of the push: paper, her, the lockers. Round 6: paper 1.6 -> 1.75. With the face at x 740
  // the door's torn root (page x < 37) landed at x 120 and covered the left half of 「ん・だ・よ」 (left column of windows, x 100+);
  // the nearest layer now grows a little more in the push, so the root stands at x ~62 (a sliver on the frame's left edge, about
  // 38 px clear of the windows, more on each よ flick, which pulls it outwards). The face, the windows and the lockers do not move.
  const SP = 1.75, SR = 1.15, SWL = 1.08;
  const her = (ctx, file) => { const im = IMG[file]; ctx.drawImage(im, RX, RY, im.width * RS, im.height * RS); };

  function paper(w, h, seed) {
    const [c, s] = mk(w, h), r = rng(seed); s.fillStyle = PAPER; s.fillRect(0, 0, w, h);
    for (let k = 0; k < w * h / 2200; k++) { s.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); s.fillRect(r() * w, r() * h, 2 + r() * 9, 1); }
    return [c, s];
  }
  function band(s, w, title, key, h = 124, size = 48) {
    s.fillStyle = TEAL; s.fillRect(0, 0, w, h); LAY.reg('band', key, [0, 0, w, h]);
    tb(s, title, '700 #px ZenKakuB', [112, h * 0.42, 420, h * 0.53], { maxSize: size, color: PAPER, name: 'title', sheet: key + 'b' });
    tb(s, '令和八年度　読取確認テスト', '500 #px ZenKaku', [w - 632, h * 0.5, 512, h * 0.37], { maxSize: size * 0.58, align: 'right', color: PAPER, name: 'test', sheet: key + 'b' });
  }
  // the printed bust of her (P12-anoko) as one teal ink
  const ANOKO = (() => { const src = IMG[DRAW.anoko], [c, x] = mk(src.width, src.height); x.drawImage(src, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height), a = d.data;
    for (let i = 0; i < a.length; i += 4) { const lum = 0.3 * a[i] + 0.59 * a[i + 1] + 0.11 * a[i + 2], ink = Math.min(1, Math.max(0, (238 - lum) / 150)) * (a[i + 3] / 255);
      a[i] = TEAL_RGB[0]; a[i + 1] = TEAL_RGB[1]; a[i + 2] = TEAL_RGB[2]; a[i + 3] = Math.round(255 * Math.pow(ink, 0.9)); }
    x.putImageData(d, 0, 0); return c; })();
  const AX = RX + 4, AY = RY + 4;

  // ---------- the coin lockers behind her (S1-S3) ----------
  // Laid out in the shout shot's frame (S3) so the flip windows land where the frame needs them (two columns each side of her,
  // four windows high, clear of her hair and shoulders), then mapped back to the lockers' own layer (scale 1.08 in S3). Her
  // own tall locker (22) stands open at the right, where strip 4 uncovers it.
  const S3toWall = ([x, y]) => [F[0] + (x - C1[0]) / SWL, F[1] + (y - C1[1]) / SWL];
  const WALL = { x0: -360, y0: -150, x1: 2060, y1: 1110, s: 1.25 };
  const COLX = i => 150 + 170 * i, ROWY = j => 110 + 180 * j;
  const cells = [], winS3 = {};
  for (let i = -2; i <= 13; i++) for (let j = -1; j <= 5; j++) {
    const tall = i === 10 && j >= 1 && j <= 3; if (i === 10 && (j === 2 || j === 3)) continue;
    const [x, y] = S3toWall([COLX(i) - 85, ROWY(j) - 70]), w = 170 / SWL, h = (tall ? 540 : 180) / SWL, u = 170 / SWL;
    const [wx, wy] = S3toWall([COLX(i) - 50, ROWY(j) - 47]);
    const cell = { x: x + 3, y: y + 3, w: w - 6, h: h - 6, u, n: 1 + (i + 2) * 7 + (j + 1), tall, win: [wx, wy, 100 / SWL, 94 / SWL] };
    if (tall) { cell.win = null; cell.n = 22; }
    cells.push(cell); winS3[`${i},${j}`] = cell;
  }
  const TALL = cells.find(c => c.tall);
  const [WC, wcs] = mk((WALL.x1 - WALL.x0) * WALL.s, (WALL.y1 - WALL.y0) * WALL.s);
  wcs.scale(WALL.s, WALL.s); wcs.translate(-WALL.x0, -WALL.y0);
  drawLockers(wcs, cells, { x0: WALL.x0, y0: WALL.y0, x1: WALL.x1, y1: WALL.y1, line: 2.6, light: [-150, 1250] });
  openLocker(wcs, TALL, { panel: 0.3, line: 2.6 });
  { const gr = wcs.createLinearGradient(0, WALL.y0, 0, WALL.y1); gr.addColorStop(0, rgba(INK_RGB, 0)); gr.addColorStop(1, rgba(INK_RGB, 0.18));
    wcs.fillStyle = gr; wcs.fillRect(WALL.x0, WALL.y0, WALL.x1 - WALL.x0, WALL.y1 - WALL.y0); }
  const drawWall = ctx => ctx.drawImage(WC, WALL.x0, WALL.y0, WALL.x1 - WALL.x0, WALL.y1 - WALL.y0);
  const WIN_L = [...[0, 1, 2, 3].map(j => winS3[`1,${j}`]), ...[0, 1, 2].map(j => winS3[`0,${j}`])];
  // vertical text reads right to left on both sides: the right column first (the review: the right group was read backwards)
  const WIN_R = [...[0, 1, 2, 3].map(j => winS3[`7,${j}`]), ...[0, 1, 2].map(j => winS3[`6,${j}`])];
  const FLIPS = [...L41.slice(0, 7).map(([c, t], i) => ({ c, t, cell: WIN_L[i] })), ...L41.slice(7).map(([c, t], i) => ({ c, t, cell: WIN_R[i] }))];
  function drawWindows(ctx, tt) {
    for (const f of FLIPS) { if (!sungShown(tt, f.t)) continue; const [x, y, w, h] = f.cell.win;   // sung: reads on its onset's frame
      ctx.fillStyle = GRAPHITE; ctx.fillRect(x, y, w, h);
      whiteLetter(ctx, f.c, x + w / 2, y + h / 2 + 2, Math.round(h * 0.84), tt - f.t, 'rubbed'); }
  }
  const layerT = (ctx, e, s) => { const a = 1 + (s - 1) * e, tx = F[0] + (C1[0] - F[0]) * e - F[0] * a, ty = F[1] + (C1[1] - F[1]) * e - F[1] * a; ctx.transform(a, 0, 0, a, tx, ty); };

  // ---------- events ----------
  const T_KAN = S.ev('号哭 printed (light) + the cut line cracks (gold in it)', K(360)), T_ANS = S.ev('ごうこく printed', K(365)), T_OK = S.ev('正解 + the cut line splits', K(366));
  const T_CARD = S.ev('her card drops in', K(368)), T_LEAD = S.ev('leader to あの子', K(369));
  const T_ST1 = S.ev('読み取れません 1 (light)', K(373)), T_ST2 = S.ev('読み取れません 2 + the slit torn wide', K(374));
  // strips 1 and 2 tear together on k375 (rhythm pass: 「心」, the only letter of strip 2, is sung at k376.12, 1.5 frames after
  // k376, so a strip folding on k376 could not show it on its onset's frame; k376, the bar line, is the camera's step instead)
  const STRIP_K = [375, 375, 378, 379, 380];
  const T_STRIP = STRIP_K.map((k, i) => S.ev(`strip ${i + 1} torn and folded down`, K(k)));
  const T_DOOR = S.ev('the rest of the figure swings open', K(381));
  const T_PI0 = K(382), T_PI1 = TS3; move(S, 'push into the tear', T_PI0, T_PI1);
  const T_FLICK = [S.ev('paper edge flicks (よ)', K(386)), S.ev('paper edge flicks harder (よ)', K(390))];
  // S1 (round 11): one 大击 on the k360 crash (a one-way step of 3 %, no punch back), then an eased push (k361 -> k366, the split)
  // to the same 7 % as before (V1 below: the slit lands on her eye). Base zoom 1.003 so the clamp never shows the 2 px border.
  const SK1 = strikes('S1', [[360, { step: 0.03, flash: 1, why: '大击 crash: 号哭 slams, the cut line cracks' }]]);
  const PUSH1 = pushes(S, [[K(361), K(366), 0.037, 'S1 eased push to the split']]);
  const zQ1 = tt => SK1.z(tt) + 0.003 + (PUSH1(0, tt) - 1);
  // S2 (round 11): the camera stands still; the card drops, the stamps print, the strips tear one by one, the door swings. One
  // ordinary jolt (<= 1 % of the width) on the second 読み取れません, when the slit is torn wide.
  const SK2 = strikes('S2', [[374, { step: 0.015, why: '読み取れません 2, the slit torn wide' }]]);
  // S2's camera (zoom about the frame's centre, dip): it hands over to the push into the tear (k382-k383), which ends at 1.00
  // where S3 starts; the dip never opens a gap at the page's top or bottom edge
  // round 11: the whip runs 10 frames from the k382 frame (MOTION AUDIT: a whip is done in 12 frames counting its start and
  // settle; over the whole beat it measured 13) and lands about a frame before k383, where the shout shot begins
  const PI_DUR = 10 * FR;
  const cam2 = tt => { const e = tt < T_PI0 ? 0 : Math.pow(Math.min(1, (tt - T_PI0) / PI_DUR), 2.2), z = 1 + (SK2.z(tt) - 1) * (1 - e), m = 540 * (z - 1);
    return { e, z, dy: Math.max(-m, Math.min(m, SK2.dip(tt) * (1 - e))) }; };
  S.hold('rin2', 'R12-play cold (behind the paper)', T_KAN, TS3, { kind: 'key', file: DRAW.cold });
  S.hold('rin2', 'R12-shout-a', TS3, K(386.5), { kind: 'key', file: DRAW.shoutA });
  // k386.5: the in-between (drawn from shout-a and shout-b together), half a beat, then shout-b on k387 (review nice 8: the
  // head jumped ~15 % in one frame)
  S.hold('rin2', 'R12-shout-ab (in-between)', K(386.5), K(387), { kind: 'inbetween', file: DRAW.shoutAB });
  S.hold('rin2', 'R12-shout-b', K(387), TS4, { kind: 'key', file: DRAW.shoutB });
  S.hold('print', 'P12-anoko (printed bust in Q2)', TQ2, T_DOOR, { kind: 'key', file: DRAW.anoko });
  const TSB = K(387);
  // S3: the old slow push (4 % from k383 to k387, a 3-frame stop on k385) is two bar-line steps (k384, k388, 4 % in all) and the
  // hits of the kicks and snares (k386 and k390 also flick the paper edge)
  // round 11: the camera stands still after the whip into the tear (at least 2 beats, and the whole shot): the shout drawings,
  // the windows flipping black letter by letter (句41) and the paper root's flicks on each よ carry the beats
  const SK3 = strikes('S3', []);

  // ---------- page Q1 (as Demo 2 v15 / 08a, with 号哭 and the cut line) ----------
  const QX = 120, QY = 186, QS = 62;
  const [q1, q1s] = paper(W, 1080, 3); band(q1s, W, '国語', 'q1');
  const KB = [560, 248, 800, 470]; q1s.strokeStyle = TEAL; q1s.lineWidth = 4; q1s.strokeRect(...KB); LAY.reg('kanji box', 'q1', KB);
  const AXA = 712, AYA = 790, AS = 120, AG = 136;
  tb(q1s, '答', '700 #px ZenKakuB', [AXA - 112, AYA + 12, 96, 96], { maxSize: 60, align: 'center', name: '答', sheet: 'q1' });
  for (let i = 0; i < 4; i++) { q1s.strokeStyle = TEAL; q1s.lineWidth = 4; q1s.strokeRect(AXA + i * AG, AYA, AS, AS); LAY.reg(`answer ${i}`, 'q1', [AXA + i * AG, AYA, AS, AS]); }
  { q1s.strokeStyle = TEAL; q1s.lineWidth = 3; q1s.strokeRect(150, 300, 300, 200); q1s.fillStyle = TEAL; q1s.fillRect(150, 300, 300, 56); LAY.reg('配点 box', 'q1', [150, 300, 300, 200]);
    tb(q1s, '配点', '700 #px ZenKakuB', [160, 306, 280, 44], { maxSize: 30, align: 'center', color: PAPER, name: '配点', sheet: 'q1n' });
    tb(q1s, '10点', '700 #px ZenKakuB', [160, 370, 280, 110], { maxSize: 80, align: 'center', name: '10点', sheet: 'q1n' });
    q1s.strokeRect(1460, 300, 330, 420); q1s.fillRect(1460, 300, 330, 56); LAY.reg('注意 box', 'q1', [1460, 300, 330, 420]);
    tb(q1s, '解答上の注意', '700 #px ZenKakuB', [1470, 306, 310, 44], { maxSize: 28, align: 'center', color: PAPER, name: '注意', sheet: 'q1n' });
    ['1　読みはひらがなで', '　 答えること。', '2　一マスに一字。', '3　読み取り機で', '　 採点します。'].forEach((t, i) =>
      tb(q1s, t, '500 #px ZenKaku', [1480, 380 + i * 64, 300, 50], { maxSize: 30, name: `注意 ${i}`, sheet: 'q1n' })); }
  // the cut line between the 配点 box and the kanji box, at x 480 on screen at the end of the push (on her eye); it starts under
  // the question line and presses on no text. The slit opens on screen y 236-500 (below the question line).
  const CAM = createCamera(g, { W, H: 1080, bg: GRAPHITE });
  const V1 = CAM.view(zQ1(TQ2), 960, 560, 0);
  const toPage1 = ([x, y]) => [V1.fx + (x - 960) / V1.z, V1.fy + (y - 540) / V1.z];
  const LX = toPage1(EYE)[0], SL_Y0 = toPage1([0, 236])[1], SL_Y1 = toPage1([0, 500])[1], SL_W = 132 / V1.z;
  cutLine(q1s, LX, 236, 1010, { size: 30 });
  LAY.reg('cut line', 'q1', [LX - 18, 236, 36, 774]);
  // the slit's two edges: asymmetric bow, the left side opening wider at the top, the right side lower down
  const nL = noise1(201), nR = noise1(202);
  const prof = (y, y0, y1) => { const u = (y - y0) / (y1 - y0); return u <= 0 || u >= 1 ? 0 : Math.pow(Math.sin(Math.PI * u), 0.62); };
  const wQ1L = (y, o) => o * SL_W * 0.5 * prof(y, SL_Y0, SL_Y1) * (1.08 - 0.3 * (y - SL_Y0) / (SL_Y1 - SL_Y0) + 0.16 * nL(y / 31));
  const wQ1R = (y, o) => o * SL_W * 0.5 * prof(y, SL_Y0, SL_Y1) * (0.86 + 0.3 * (y - SL_Y0) / (SL_Y1 - SL_Y0) + 0.16 * nR(y / 27));

  // ---------- page Q2: the printed bust of HER in the figure box, her card in the answer field ----------
  const [q2, q2s] = paper(W, 1080, 5); band(q2s, W, '国語', 'q2');
  const FB = [120, 236, 620, 744]; q2s.strokeStyle = TEAL; q2s.lineWidth = 4; q2s.strokeRect(...FB); LAY.reg('figure', 'q2', FB);
  q2s.save(); q2s.beginPath(); q2s.rect(FB[0] + 2, FB[1] + 2, FB[2] - 4, FB[3] - 4); q2s.clip();
  q2s.drawImage(ANOKO, AX, AY, ANOKO.width * RS, ANOKO.height * RS); q2s.restore();
  // the answer field (review nice 2: the right half was empty): a header band and three dotted guide lines; it tears with the strips
  const AF = [800, 252, 1000, 790];
  q2s.strokeStyle = TEAL; q2s.lineWidth = 4; q2s.strokeRect(...AF); q2s.fillStyle = TEAL; q2s.fillRect(AF[0], AF[1], AF[2], 58); LAY.reg('answer field', 'q2f', AF);
  tb(q2s, '解答欄', '700 #px ZenKakuB', [AF[0] + 20, AF[1] + 6, 200, 46], { maxSize: 34, color: PAPER, name: '解答欄', sheet: 'q2h' });
  tb(q2s, '読み取り機で採点します', '500 #px ZenKaku', [AF[0] + AF[2] - 420, AF[1] + 12, 400, 34], { maxSize: 24, align: 'right', color: PAPER, name: '採点', sheet: 'q2h' });
  q2s.save(); q2s.strokeStyle = rgba(TEAL_RGB, 0.5); q2s.lineWidth = 2.5; q2s.setLineDash([10, 9]); q2s.beginPath();
  for (const y of [420, 530, 640]) { q2s.moveTo(AF[0] + 40, y); q2s.lineTo(AF[0] + AF[2] - 40, y); } q2s.stroke(); q2s.restore();
  tb(q2s, '答', '700 #px ZenKakuB', [AF[0] + 22, 345, 56, 56], { maxSize: 44, align: 'center', name: '答', sheet: 'q2' });
  // her card in the answer field, low (under the strips' fold lines it is later covered by the folded strips 3 and 4)
  // (her_card.js's face, state 'title', prefiltered to twice its size on the page so the grid and the dots stay clean)
  const CARDC = herFaceAt(840);
  const CW = 420, CH = CW / CARD_RATIO, CX = 1360, CY = 880;
  // The card drops in 8% large and settles in 3 frames. Its nearest neighbour is the answer field's bottom frame line (22 px
  // under the settled card; the guide line above it is 100 px away), so the drop is anchored on the card's bottom edge and the
  // overshoot grows up and sideways, away from that line (about the centre, the hit frame's shadow crossed the line by 4 px;
  // 根因清单: 放大、过冲类效果按放大后的实际框逐帧登记，锚点选在远离邻近元素的一侧). Its box on the hit frame (with its shadow) is
  // what is registered, and it must stay inside the answer field's frame and under its last guide line (y 640)
  const CARD_HIT = [CX - CW * 0.54, CY + CH / 2 - CH * 1.08, CW * 1.08 + 11, CH * 1.08 + 15];
  LAY.reg('card (drop-in hit frame, x1.08 + shadow)', 'q2', CARD_HIT);
  { const [x, y, w, h] = CARD_HIT, ok = x > AF[0] + 4 && y > 640 + 4 && x + w < AF[0] + AF[2] - 4 && y + h < AF[1] + AF[3] - 4;
    console.warn(`CARD DROP AUDIT seg_12 Q2: hit-frame box ${CARD_HIT.map(Math.round).join(',')} ${ok ? 'inside the answer field, below its last guide line' : 'CROSSES the answer field frame or its guide lines'}`); }
  // 「あの子」 label at the top left of the figure, the leader from the left of her printed hair (both stay on the door piece)
  const LBL = [132, 252, 112, 50], GIRL = [262, 372];
  const ST1 = [430, 868, 2.7], ST2 = [430, 452, 3.0];

  // ---------- the openings in Q2 (page = S2 frame coordinates) ----------
  const STX = [634, 864, 1094, 1324, 1554, 1786];                       // strip edges
  const FYS = [800, 790, 705, 720, 770];                                // each strip's fold line (staggered)
  // the vertical tears, from above the top edge down past each strip's fold line (vt[0] is also the k374 tear's right edge)
  const vt = STX.map((x, i) => roughLine([x, -30], [x + (i % 2 ? 4 : -3), 1110], 31 + i, 6));
  const cutY = (pts, y0, y1) => pts.filter(p => p[1] >= y0 && p[1] <= y1);
  // the slit in Q2 (k367-k373): torn through from behind, rough edges, the same place as Q1's slit on screen
  const slitL = roughPath([[EYE[0] - 4, 236], [EYE[0] - 58, 300], [EYE[0] - 66, 420], [EYE[0] - 2, 500]], 11, 4);
  const slitR = roughPath([[EYE[0] - 2, 500], [EYE[0] + 60, 440], [EYE[0] + 62, 320], [EYE[0] - 4, 236]], 14, 4);
  // k374: torn wide: left edge from the slit's top down to y 640, along the bottom to vt[0], up vt[0], along the top
  const holeL = roughPath([[EYE[0] - 6, 236], [414, 300], [408, 470], [420, 640]], 21, 6);
  const holeB = roughLine([420, 640], [636, 628], 24, 6);
  const v0 = cutY(vt[0], 236, 632);
  const holeT = roughLine([STX[0] - 2, 238], [EYE[0] - 6, 236], 25, 4);
  const holePoly = [...holeL, ...holeB.slice(1), ...[...v0].reverse(), ...holeT.slice(1)];
  // the strips: between two vertical tears, from above the top edge down to the strip's fold line
  const stripPoly = i => { const a = cutY(vt[i], -40, FYS[i]), b = cutY(vt[i + 1], -40, FYS[i]); return [...a, [b[b.length - 1][0], FYS[i]], ...[...b].reverse()]; };
  // the door piece (k381): from the hinge tear at x ~36 to vt[0], the whole height (the hole goes with it)
  const hinge = roughLine([38, -30], [36, 1110], 41, 4);
  const doorPoly = [...hinge, ...[...vt[0]].reverse()];
  const ROOTCUT = roughPath([[78, -40], [52, 80], [34, 150], [-40, 182]], 51, 4);

  // the words she writes on the strips' backs (句40), each strip folded before its first letter is sung; heavy pencil (08b)
  const WORDS = [[0, 2], [2, 3], [3, 5], [5, 8], [8, 11]].map(([a, b], i) => ({ chars: L40.slice(a, b), strip: i }));
  const wordLayout = WORDS.map(({ chars, strip }) => { const x0 = STX[strip], x1 = STX[strip + 1], n = chars.length, r = rng(300 + strip);
    return chars.map(([c, t], k) => { const big = c === '心', size = big ? 104 : n >= 3 ? 58 : 70, pitch = Math.min(76, (x1 - x0 - 36) / n);
      const cx = (x0 + x1) / 2 + (k - (n - 1) / 2) * pitch, cy = FYS[strip] + (big ? 96 : 84) + (r() - 0.5) * 8;
      // d: the write-on, 2 frames ending on the onset's frame (it was 0.16 s from the onset: read 4-5 frames late)
      return { c, t, x: cx, y: cy, size, rot: (r() - 0.5) * 0.08, p: 0.85, seed: 500 + strip * 10 + k, d: 2 * FR }; }); });
  wordLayout.flat().forEach((w, i) => LAY.text(`pencil ${w.c}${i}`, 'q2:back', [w.x - w.size * 0.52, w.y - w.size * 0.6, w.size * 1.04, w.size * 1.2]));

  // the page as printed at time tt
  const [PN, pns] = mk(W, 1080);
  function pageQ1(ctx, tt) {
    ctx.drawImage(q1, 0, 0);
    printSung(ctx, [['問', -1], ['一', -1], ['　', -1], ...L38], QX, QY, QS, tt);
    print16(ctx, '号哭', KB[0] + KB[2] / 2, KB[1] + KB[3] / 2, 19, tt - T_KAN, 21, { slam: true });   // rhythm pass: it lands on the crash (22 % large, settles in 3 frames)
    ['ご', 'う', 'こ', 'く'].forEach((c, i) => print16(ctx, c, AXA + i * AG + AS / 2, AYA + AS / 2, 5.0, tt - T_ANS, 30 + i));
    print16(ctx, '正解', AXA + 4 * AG + 150, AYA + AS / 2, 5.1, tt - T_OK, 41, { frame: true });
  }
  function pageQ2(ctx, tt) {
    ctx.drawImage(q2, 0, 0);
    printSung(ctx, [['問', -1], ['二', -1], ['　', -1], ...L39], QX, QY, QS, tt);
    const u = Math.min(1, Math.max(0, (tt - T_LEAD) / (4 * FR)));
    if (u > 0) { const [gx, gy] = GIRL, ex = LBL[0] + LBL[2] / 2, ey = LBL[1] + LBL[3];
      ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx, gy); const v = Math.min(1, u * 2);
      ctx.lineTo(gx + (ex - gx) * v, gy + (ey + 18 - gy) * v); if (u > 0.5) ctx.lineTo(ex, ey + 18 - 18 * (u - 0.5) * 2); ctx.stroke();
      if (u >= 1) { ctx.fillStyle = PAPER; ctx.fillRect(...LBL); ctx.strokeRect(...LBL);
        textBox(ctx, 'あの子', '700 #px ShipporiB', [LBL[0] + 6, LBL[1] + 4, LBL[2] - 12, LBL[3] - 8], { maxSize: 36, align: 'center', color: GRAPHITE }); } }
    const a = tt - T_CARD;
    if (a >= 0) { const sc = 1 + 0.08 * Math.pow(1 - Math.min(1, a / (3 * FR)), 2);
      ctx.save(); ctx.translate(CX, CY + CH / 2); ctx.scale(sc, sc); ctx.translate(0, -CH / 2); ctx.fillStyle = CARD_SHADOW; ctx.beginPath(); ctx.roundRect(-CW / 2 + 10, -CH / 2 + 14, CW, CH, CW * 0.03); ctx.fill();
      ctx.drawImage(CARDC, -CW / 2, -CH / 2, CW, CH); ctx.restore(); }
    print16(ctx, '読み取れません', ST1[0], ST1[1], ST1[2], tt - T_ST1, 51, { frame: true });
    print16(ctx, '読み取れません', ST2[0], ST2[1], ST2[2], tt - T_ST2, 52, { frame: true });
  }

  // ---- the paper layer of S2/S3: the page with its openings cut, torn edges, folded strips, the door, the bits; its shadow ----
  const RES = 2;
  const [PL, pls] = mk(W * RES, 1080 * RES), [SH] = mk(W * RES, 1080 * RES), [FC, fcs] = mk(W * RES, 1080 * RES);
  // the strips' front and back canvases (front = the printed page, cut to the strip; back = grey back, her words written on it)
  const STRIPS = STX.slice(0, 5).map((x, i) => { const x0 = Math.floor(Math.min(...stripPoly(i).map(p => p[0]))) - 2, x1 = Math.ceil(Math.max(...stripPoly(i).map(p => p[0]))) + 2;
    return { i, x0, w: x1 - x0, yTop: -40, FY: FYS[i], roll: [0.010, -0.012, 0.008, -0.009, 0.012][i], shrink: 0.968 }; });
  const FRONTS = {};
  function stripFront(s) {
    if (FRONTS[s.i]) return FRONTS[s.i];   // the strip as printed now, alpha = its torn outline, with its torn edges drawn on its front
    const [c, x] = mk(s.w, s.FY - s.yTop); x.translate(-s.x0, -s.yTop);
    x.save(); x.beginPath(); pathPoly(x, stripPoly(s.i)); x.clip(); x.drawImage(PN, 0, 0); x.restore();
    tornEdge(x, cutY(vt[s.i], -40, s.FY), 70 + s.i, { side: 1, lip: 0.6 }); tornEdge(x, cutY(vt[s.i + 1], -40, s.FY), 80 + s.i, { side: -1, lip: 0.6 });
    return (FRONTS[s.i] = c);
  }
  const BACKS = STRIPS.map(s => { const h = s.FY - s.yTop, [c, x] = mk(s.w, h), bp = backPaper(s.w, h, 90 + s.i);
    // the back's outline: the front's mirrored top to bottom (row d below the fold = row FY - d above it)
    x.save(); x.translate(0, h); x.scale(1, -1); x.translate(-s.x0, -s.yTop); x.beginPath(); pathPoly(x, stripPoly(s.i)); x.restore();
    x.save(); x.clip(); x.drawImage(bp, 0, 0); x.restore();
    return { c, x }; });
  // the back with her words written so far (u = how much of each letter), drawn fresh each frame onto a copy
  function backNow(s, tt) {
    const B = BACKS[s.i], [c, x] = mk(B.c.width, B.c.height); x.drawImage(B.c, 0, 0);
    x.save(); x.beginPath(); x.rect(0, 0, c.width, c.height); x.clip(); x.translate(-s.x0, -s.FY);
    for (const L of wordLayout[s.i]) { const u = sungSweep(tt, L.t, L.d); if (u > 0) HP.letter(x, L, u); }
    x.restore();
    // the fold: a rounded edge, lit on top, a fine shade under it
    const gr = x.createLinearGradient(0, 0, 0, 16); gr.addColorStop(0, rgba([255, 255, 255], 0.55)); gr.addColorStop(0.35, rgba(INK_RGB, 0)); gr.addColorStop(1, rgba(INK_RGB, 0.06));
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = gr; x.fillRect(0, 0, c.width, 16); x.globalCompositeOperation = 'source-over';
    return c;
  }
  // the fold's angle: 3 frames (rhythm pass: was 4; そ, sung 3.8 frames after k375, must read on its onset's frame), gravity
  // (slow start), a small slap and settle at the bottom
  function foldTheta(tt, i) {
    const a = tt - T_STRIP[i]; if (a < 0) return null;
    const D = 3 * FR; if (a < D) return Math.PI * Math.pow(a / D, 1.5);
    return Math.PI - 0.12 * Math.exp(-(a - D) / 0.07) * Math.abs(Math.cos((a - D) * 34));
  }
  const BITS = makeBits(q2, [[470, 300], [452, 380], [500, 470], [436, 560], [520, 620]], 57, { size: [7, 14] });
  // the paper layer at time tt (res: its resolution), flick: the S3 shout's push on the left edge
  function buildPaper(tt, res) {
    pageQ2(pns, tt);
    pls.setTransform(res, 0, 0, res, 0, 0); pls.clearRect(0, 0, W, 1080); pls.globalCompositeOperation = 'source-over';
    pls.drawImage(PN, 0, 0);
    pls.globalCompositeOperation = 'destination-out'; pls.fillStyle = '#000';
    const doorOpen = tt >= T_DOOR;
    if (tt < T_ST2) { pls.beginPath(); pathPoly(pls, [...slitL, ...slitR.slice(1)]); pls.fill(); }
    else { pls.beginPath(); pathPoly(pls, holePoly); pls.fill(); }
    T_STRIP.forEach((t, i) => { if (tt >= t) { pls.beginPath(); pathPoly(pls, stripPoly(i)); pls.fill(); } });
    if (doorOpen) { pls.beginPath(); pathPoly(pls, doorPoly); pls.fill(); }
    pls.globalCompositeOperation = 'source-over';
    // torn edges: the slit / the hole (on the door piece, until it opens)
    if (!doorOpen) {
      if (tt < T_ST2) { tornEdge(pls, slitL, 5, { side: -1 }); tornEdge(pls, slitR, 6, { side: -1 }); }
      else { tornEdge(pls, holeL, 7, { side: -1 }); tornEdge(pls, holeB, 8, { side: -1 }); tornEdge(pls, holeT, 9, { side: -1 }); }
    }
    // the vertical tears' edges on the paper that stays (vt lines run downward: side -1 = the opening is to their right)
    const gone = j => j < 0 ? doorOpen : j > 4 ? false : tt >= T_STRIP[j], ext = j => j < 0 ? 1110 : FYS[j];
    for (let i = 0; i < 6; i++) {
      const l = i - 1, r = i, lg = gone(l), rg = gone(r);
      if (!lg && rg) tornEdge(pls, cutY(vt[i], -40, ext(r)), 100 + i, { side: -1 });
      else if (lg && !rg) tornEdge(pls, cutY(vt[i], i === 0 ? 632 : -40, ext(l)), 110 + i, { side: 1 });
      else if (lg && rg && r <= 4 && l >= 0) { if (ext(l) > ext(r)) tornEdge(pls, cutY(vt[i], ext(r), ext(l)), 130 + i, { side: 1 }); else if (ext(r) > ext(l)) tornEdge(pls, cutY(vt[i], ext(l), ext(r)), 140 + i, { side: -1 }); }
    }
    // the hole's right edge (on vt[0]) belongs to strip 1 until it goes
    if (!doorOpen && tt >= T_ST2 && !gone(0)) tornEdge(pls, v0, 120, { side: 1 });
    if (doorOpen) tornEdge(pls, hinge, 121, { side: -1 });
    // the door took the top of its root with it (review nice 5: a scrap of the teal band stayed in S3's top-left corner)
    if (doorOpen) { pls.globalCompositeOperation = 'destination-out'; pls.fillStyle = '#000'; pls.beginPath(); pathPoly(pls, [...ROOTCUT, [-60, 190], [-60, -60], [90, -60]]); pls.fill();
      pls.globalCompositeOperation = 'source-over'; tornEdge(pls, ROOTCUT, 124, { side: 1 }); }
    // the page under the folded strips is in their shade: the slivers between two hanging strips read dark, not as print
    // (review nice 4: card print showed between strips 3 and 4)
    STRIPS.forEach(s => { const th = foldTheta(tt, s.i); if (th === null || th < Math.PI * 0.5) return; const k = Math.min(1, (th - Math.PI * 0.5) / (Math.PI * 0.4));
      pls.save(); pls.globalCompositeOperation = 'source-atop'; pls.fillStyle = rgba(INK_RGB, 0.55 * k); pls.fillRect(s.x0 - 6, s.FY, s.w + 12, s.FY - s.yTop); pls.restore(); });
    // the folded strips
    STRIPS.forEach(s => { const th = foldTheta(tt, s.i); if (th === null) return;
      const front = stripFront(s), back = backNow(s, tt);
      fcs.setTransform(res, 0, 0, res, 0, 0); fcs.clearRect(0, 0, W, 1080);
      const k = th / Math.PI;
      drawFold(fcs, front, back, s.x0, s.yTop, s.FY, th, { roll: s.roll * k, shrink: 1 - (1 - s.shrink) * k, bend: 0.85 });
      // the flap's own shadow on the page under it (light from above, a little in front)
      if (th > Math.PI * 0.55) { pls.save(); pls.setTransform(1, 0, 0, 1, 0, 0); pls.globalCompositeOperation = 'source-atop'; pls.globalAlpha = 0.22;
        pls.filter = `blur(${3 * res}px) brightness(0)`; pls.drawImage(FC, 3 * res, 6 * res); pls.restore(); }
      pls.save(); pls.setTransform(1, 0, 0, 1, 0, 0); pls.drawImage(FC, 0, 0); pls.restore(); });
    // the door: the figure's piece swings towards the camera on its left edge, in 5 frames, and leaves the frame
    const doorA = tt - T_DOOR;
    if (doorOpen && doorA < 7 * FR) {
      const x0 = 30, x1 = Math.ceil(Math.max(...vt[0].map(p => p[0]))) + 2, [dc, dx] = mk(x1 - x0, 1140);
      dx.translate(-x0, 30); dx.save(); dx.beginPath(); pathPoly(dx, doorPoly); dx.clip(); dx.drawImage(PN, 0, 0); dx.restore();
      dx.globalCompositeOperation = 'destination-out'; dx.beginPath(); pathPoly(dx, holePoly); dx.fill(); dx.globalCompositeOperation = 'source-over';
      tornEdge(dx, holeL, 7, { side: -1 }); tornEdge(dx, holeB, 8, { side: -1 }); tornEdge(dx, holeT, 9, { side: -1 }); tornEdge(dx, vt[0], 122, { side: -1 }); tornEdge(dx, hinge, 123, { side: 1 });
      const ph = Math.PI / 2 * 1.12 * Math.pow(Math.min(1, doorA / (5 * FR)), 1.3);
      fcs.setTransform(res, 0, 0, res, 0, 0); fcs.clearRect(0, 0, W, 1080);
      drawDoor(fcs, dc, x0, -30, ph, { bend: 0.3 });
      pls.save(); pls.setTransform(1, 0, 0, 1, 0, 0); pls.drawImage(FC, 0, 0); pls.restore();
    }
    // bits torn off at k374
    drawBits(pls, BITS, tt - T_ST2, { g: 2400, life: 0.35 });
    shadowOf(SH, PL, { res });
  }
  // S1's paper: page Q1 with the slit opening along the cut line (the bridges tear, the two sides bow apart, 3 frames)
  const [PL1, pl1] = mk(W, 1080), [SH1] = mk(W, 1080);
  function buildPaperQ1(tt) {
    pageQ1(pns, tt);
    pl1.setTransform(1, 0, 0, 1, 0, 0); pl1.clearRect(0, 0, W, 1080); pl1.drawImage(PN, 0, 0);
    // k360 the line cracks (a fifth of the opening: a thread of her gold hair shows), k366 it splits open on her eye
    const a = tt - T_OK, a0 = tt - T_KAN, CRACK = 0.22;
    if (a0 >= 0) { const o = a < 0 ? CRACK * Math.min(1, (a0 / FR + 1) / 3) : (CRACK + (1 - CRACK) * Math.min(1, (a / FR + 1) / 3)) * (1 + (a > 2 * FR ? 0.05 * Math.exp(-(a - 2 * FR) / 0.08) * Math.cos((a - 2 * FR) * 40) : 0));
      const [Le, Re] = perfEdges(LX, SL_Y0, SL_Y1, y => wQ1L(y, o), y => wQ1R(y, o), 203);
      pl1.globalCompositeOperation = 'destination-out'; pl1.fillStyle = '#000'; pl1.beginPath(); pathPoly(pl1, [...Le, ...[...Re].reverse()]); pl1.fill(); pl1.globalCompositeOperation = 'source-over';
      tornEdge(pl1, Le, 5, { side: -1, lip: 0.9 * o + 0.1 }); tornEdge(pl1, Re, 6, { side: 1, lip: 0.9 * o + 0.1 }); }
    shadowOf(SH1, PL1, {});
  }

  // ---- the S3 shout shot ----
  // slow push 1.00 -> 1.04 from k383 to k387; on k385 it stops dead for 3 frames and gives 2 px back, then goes on
  const zoomS3 = tt => SK3.z(tt);
  const dipS3 = tt => { const z = SK3.z(tt), m = 540 * (z - 1); return Math.max(-m, Math.min(m, SK3.dip(tt))); };
  function flickAng(tt) { return T_FLICK.reduce((a, t0, i) => { const d = tt - t0; if (d < 0) return a; const up = Math.min(1, d / (2 * FR)), amp = (i ? 6 : 4) * Math.PI / 180;
    return a + amp * (d < 2 * FR ? up : Math.exp(-(d - 2 * FR) / 0.09) * Math.cos((d - 2 * FR) * 30)); }, 0); }
  function drawS3(tt) {
    const Z = zoomS3(tt), DY = dipS3(tt);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = GRAPHITE; g.fillRect(0, 0, W, 1080);
    const base = () => g.setTransform(Z, 0, 0, Z, 960 - 960 * Z, 540 - 540 * Z + DY);
    base(); g.save(); layerT(g, 1, SWL); drawWall(g); drawWindows(g, tt); g.restore();
    base(); g.save(); layerT(g, 1, SR); her(g, tt < K(386.5) ? DRAW.shoutA : tt < TSB ? DRAW.shoutAB : DRAW.shoutB); g.restore();
    // what is left of the page: the door's root along the left edge (x < 36 on the page); it flicks out on each よ
    base(); g.save(); layerT(g, 1, SP); const fa = flickAng(tt); g.translate(-fa * 160, 0);
    g.drawImage(SH, 0, 0, W, 1080); g.drawImage(PL, 0, 0, W, 1080); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0);
  }
  const s3pt = ([x, y]) => [C1[0] + (x - F[0]) * SWL, C1[1] + (y - F[1]) * SWL];
  FLIPS.forEach((f, i) => { const [x, y, w, h] = f.cell.win, p0 = s3pt([x, y]), p1 = s3pt([x + w, y + h]); LAY.text(`window ${f.c}${i}`, 's3:windows', [p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]]); });

  // ---- S1/S2 frame audit ----
  const QW = (chars, size) => chars.reduce((a, [c]) => a + measure(c, '700 #px ShipporiB', size), 0);
  LAY.text('question', 'q1:print', [QX, QY - QS * 0.6, QW([['問'], ['一'], ['　'], ...L38], QS), QS * 1.2]);
  LAY.text('号哭', 'q1:print', print16Box('号哭', KB[0] + KB[2] / 2, KB[1] + KB[3] / 2, 19));
  ['ご', 'う', 'こ', 'く'].forEach((c, i) => LAY.text(`answer ${c}${i}`, 'q1:print', print16Box(c, AXA + i * AG + AS / 2, AYA + AS / 2, 5.0)));
  LAY.text('正解', 'q1:print', print16Box('正解', AXA + 4 * AG + 150, AYA + AS / 2, 5.1, { framed: true }));
  LAY.text('question', 'q2:print', [QX, QY - QS * 0.6, QW([['問'], ['二'], ['　'], ...L39], QS), QS * 1.2]);
  LAY.text('あの子', 'q2:print', LBL);
  LAY.text('読み取れません 1', 'q2:stamp', print16Box('読み取れません', ST1[0], ST1[1], ST1[2], { framed: true }));
  // the printed bust's card (its face printed in teal with the rest of the bust): the k373 stamp lands just under it
  { const Q = CARD_ON[DRAW.anoko].map(([x, y]) => [AX + x * RS, AY + y * RS]), xs = Q.map(p => p[0]), ys = Q.map(p => p[1]);
    LAY.text('printed bust card face', 'q2:stamp', [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]); }
  LAY.audit('seg_12 S1/S2 pages');
  // the punches go past the push's 1.07: the focus rises with them so the band's title (top y 52) stays whole (FRAME AUDIT)
  const camQ1 = tt => { const z = zQ1(tt), v = CAM.view(z, 960, Math.min(560, 50 + 540 / z), 0); return [z, v.fx, v.fy]; };

  // =====================================================================================================================
  // S4 (round 4, after the 2026-11-21 review): close on the cut line and panel ③, so she and her hands are the subject. Her face
  // is in the slit from the first beat (the slit opens in three beats, to brows-to-chin); k397 two fists bulge the paper (the
  // print bends over them, two paper tones); k399 her forearms come through at the camera and pinch the printed rings of ③; the
  // rings do not move, the reading frame slides onto ③ (it "reads" her hands) and goes on to ④.
  // =====================================================================================================================
  const T4 = { cut1: S.ev('S4 cut line: the middle opens, her eyes', TS4), cut2: S.ev('S4 cut line: the left third opens, the slit wider', K(393)),
               cut3: S.ev('S4 cut line: the right third opens, her face brows to chin', K(395)), bulge: S.ev('two fists bulge the paper', K(397)),
               punch: S.ev('her forearms punch through and pinch the rings', K(399)), pull1: S.ev('pull 1 (rings do not move)', K(401)),
               frame3: K(401), frame4: S.ev('reading frame goes on to ④', K(403)), pull2: S.ev('pull 2, hardest; eyes shut', K(405)) };
  S.hold('rin4', 'R12-strain-close (in the slit)', TS4, K(405), { kind: 'key', file: DRAW.strain });
  S.hold('rin4', 'R12-strain-close-b (eyes shut)', K(405), TS5, { kind: 'key', file: DRAW.strainB });
  S.hold('handL', 'H12-pry2-L (her left forearm)', K(399), TS5, { kind: 'key', file: DRAW.pryL });
  S.hold('handR', 'H12-pry2-R (her right forearm)', K(399), TS5, { kind: 'key', file: DRAW.pryR });
  // S4 (rhythm pass): the k392 crash tears the middle of the slit wider (a fourth stage of the opening), and every snare and
  // bar line hits. The smooth push k399-k405 (6 %) is four steps (k396, k399, k400, k404). Before k399 the band's title and
  // 問三 must stay whole and her card keeps its 24 px of paper above the frame's lower edge, so zoom stays under ~1.025 there
  // (the hits are smaller, no dips) and the focus is set between the two limits (FY4A); from k399 the frame goes down to the
  // hands (the focus clamped to the page's bottom edge, as the push had it).
  // From k399 (S4 band review 2026-11-21, MUST: the band's 数学 / 令和八年度 lines sat half cut under the frame's top edge for
  // 1.9 s and flashed in and out on every hit, 根因清单 Demo 2「国語」/ 15 S1 页眉): the k399 punch is a snap step (whole on the
  // beat frame) that takes the band's whole strip (y 0-62) out of the frame in that one frame, and the frame's top edge then
  // stays in a window: below the strip (> 62 world px, with the dips) and above 問三 (< 88.8, its box top; 問三 and the sum
  // must stay whole). With the focus on the page's bottom edge the top edge is 1080 - 1082 / z, so after k399 z stays about
  // 1.069-1.088: no more zoom steps; the beats after k399 are small punches with a drop (dip) of the picture on the same
  // frames, which pull the top edge opposite ways, so the top edge holds (72-78) while the hands and the page in the middle
  // and below jolt. frameCheck 'S4 band and 問三' covers all of S4 (TS4-TS5), by each frame's view.
  const T4w = S.ev('S4 crash: the middle of the slit tears wider', K(392));
  // Round 11 (整屏运动): the k399 snap step (6.55 % with a drop, the band thrown out of the frame) and the hits and dips on every
  // beat are gone. Two ordinary one-way steps of 0.85 % and 0.8 % zoom (k392 crash: the slit tears wider; k399: her forearms punch through),
  // the zoom anchored on the page's top edge, so the band and 問三 stay whole in every frame (no half-cut band) and her card
  // keeps its 24 px of paper above the lower edge (peak z 1.020 with the overshoot; at 1.0236 it kept 21 px, at 1.021 23.6 px). The slit's stages, the bulge, the punch, the two pulls and the reading
  // frame are the beats.
  const SK4 = strikes('S4', [[392, { step: 0.0085, why: 'crash: the slit tears wider' }], [399, { step: 0.008, why: 'her forearms punch through' }]]);
  const Y_CUT = 300;
  const [P4, p4] = paper(W, 1080, 41);
  // band (a sliver: the page is seen close)
  p4.fillStyle = TEAL; p4.fillRect(0, 0, W, 62); LAY.reg('band', 's4', [0, 0, W, 62]);
  tb(p4, '数学', '700 #px ZenKakuB', [112, 10, 200, 44], { maxSize: 38, color: PAPER, name: 'title', sheet: 's4b' });
  tb(p4, '令和八年度　読取確認テスト', '500 #px ZenKaku', [W - 632, 16, 512, 32], { maxSize: 24, align: 'right', color: PAPER, name: 'test', sheet: 's4b' });
  // 問三 (句42 printed as sung), the sum with 08b's printed answer 4194 and its small 正解, the abacus (08b's) small at the right
  const Q3S = 52, Q3X = 120, Q3Y = 120;
  p4.font = `700 ${Q3S}px ShipporiB`; p4.fillStyle = GRAPHITE; p4.textBaseline = 'middle'; p4.textAlign = 'left'; p4.fillText('問三', Q3X, Q3Y);
  const lw3 = p4.measureText('問三').width; p4.fillStyle = TEAL; p4.fillRect(Q3X, Q3Y + Q3S * 0.62, lw3 + 30, 4); LAY.text('問三', 's4:q3', [Q3X, Q3Y - Q3S * 0.6, lw3, Q3S * 1.2]);
  const Q3QX = Q3X + lw3 + 30;
  const SUMY = 202, SUMS = 44, sumT = '2,738 ＋ 1,456 ＝';
  p4.font = `700 ${SUMS}px ShipporiB`; p4.fillStyle = GRAPHITE; p4.fillText(sumT, Q3X, SUMY);
  const sumW = p4.measureText(sumT).width; LAY.text('sum', 's4:q3', [Q3X, SUMY - SUMS * 0.6, sumW, SUMS * 1.2]);
  const ANS4 = { x0: Q3X + sumW + 24, y: SUMY - 30, s: 60, gap: 70 };
  for (let i = 0; i < 4; i++) { p4.strokeStyle = TEAL; p4.lineWidth = 4; p4.strokeRect(ANS4.x0 + i * ANS4.gap, ANS4.y, ANS4.s, ANS4.s); }
  [...'4194'].forEach((c, i) => print16(p4, c, ANS4.x0 + i * ANS4.gap + ANS4.s / 2, ANS4.y + ANS4.s / 2, 2.5, 1, 70 + i));
  const OK4 = [ANS4.x0 + 4 * ANS4.gap + 70, SUMY, 2.2];
  print16(p4, '正解', OK4[0], OK4[1], OK4[2], 1, 75, { frame: true });
  [...'4194'].forEach((c, i) => LAY.text(`answer ${c}${i}`, 's4:q3', print16Box(c, ANS4.x0 + i * ANS4.gap + ANS4.s / 2, ANS4.y + ANS4.s / 2, 2.5)));
  LAY.text('正解', 's4:q3', print16Box('正解', OK4[0], OK4[1], OK4[2], { framed: true }));
  const AB = { x: 150, y: 346, w: 900, h: 470, bar: 28, n: 9 }, ABS = 0.36, ABX = 1420 - AB.x * ABS, ABY = 84 - AB.y * ABS;
  { const AX0 = AB.x + AB.bar, AX1 = AB.x + AB.w - AB.bar, AY0 = AB.y + AB.bar, AY1 = AB.y + AB.h - AB.bar, PITCH = (AX1 - AX0) / AB.n, BW = 43, BHh = 25, BEAM = [AY0 + 4 * BHh + 18, 24];
    const rodX = i => AX0 + PITCH * (i + 0.5), HEAVEN = [AY0 + BHh, BEAM[0] - BHh], EARTH_REST = j => AY1 - BHh - (3 - j) * 2 * BHh, EARTH_SET = j => BEAM[0] + BEAM[1] + BHh + j * 2 * BHh;
    const SETS = { 3: [4, false], 4: [1, false], 5: [4, true], 6: [4, false] };
    const bead = (ctx, cx, cy) => { ctx.beginPath(); ctx.moveTo(cx - BW, cy); ctx.lineTo(cx - BW * 0.45, cy - BHh); ctx.lineTo(cx + BW * 0.45, cy - BHh); ctx.lineTo(cx + BW, cy);
      ctx.lineTo(cx + BW * 0.45, cy + BHh); ctx.lineTo(cx - BW * 0.45, cy + BHh); ctx.closePath(); ctx.fillStyle = GRAPHITE; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - BW, cy); ctx.lineTo(cx - BW * 0.45, cy - BHh); ctx.lineTo(cx + BW * 0.45, cy - BHh); ctx.lineTo(cx + BW, cy); ctx.closePath();
      ctx.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 1); ctx.fill(); };
    p4.save(); p4.translate(ABX, ABY); p4.scale(ABS, ABS);
    p4.fillStyle = TEAL; const { x, y, w, h, bar } = AB;
    p4.fillRect(x, y, w, bar); p4.fillRect(x, y + h - bar, w, bar); p4.fillRect(x, y, bar, h); p4.fillRect(x + w - bar, y, bar, h);
    p4.strokeStyle = TEAL; p4.lineWidth = 5; p4.beginPath(); for (let i = 0; i < AB.n; i++) { p4.moveTo(rodX(i), AY0); p4.lineTo(rodX(i), AY1); } p4.stroke();
    p4.fillStyle = TEAL; p4.fillRect(AX0, BEAM[0], AX1 - AX0, BEAM[1]);
    for (let i = 0; i < AB.n; i++) { const s = SETS[i]; bead(p4, rodX(i), s && s[1] ? HEAVEN[1] : HEAVEN[0]);
      for (let j = 0; j < 4; j++) bead(p4, rodX(i), s && j < s[0] ? EARTH_SET(j) : EARTH_REST(j)); }
    p4.restore(); LAY.reg('abacus', 's4', [ABX + AB.x * ABS, ABY + AB.y * ABS, AB.w * ABS, AB.h * ABS]); }
  // the cut line (this version prints it across the page; scissors at the left end)
  cutLineH(p4, Y_CUT, 34, 1890, { size: 30 }); LAY.reg('cut line', 's4', [34, Y_CUT - 16, 1856, 32]);
  // 問四 (句43 printed as sung)
  const Q4S = 48, Q4Y = 573, Q4X = 120;   // round 10: 問四 and the panels 12 px higher (room for 08b's ③ below)
  { p4.font = `700 ${Q4S}px ShipporiB`; p4.fillStyle = GRAPHITE; p4.textAlign = 'left'; p4.fillText('問四', Q4X, Q4Y);
    const lw = p4.measureText('問四').width; p4.fillStyle = TEAL; p4.fillRect(Q4X, Q4Y + Q4S * 0.62, lw + 30, 4); LAY.text('問四', 's4', [Q4X, Q4Y - Q4S * 0.6, lw, Q4S * 1.2]); }
  const Q4QX = Q4X + measure('問四', '700 #px ShipporiB', Q4S) + 30;
  // the panels (08b's four, seen close): ③ wide in the middle, the edges of ② and ④ at the sides (① off the left)
  // ③'s two side lines run through the places her fists come through: the bulges bend them, the holes break them
  const PW4 = 1024, PT4 = 628, PH4 = 460, PX4 = [-1679, -615, 449, 1513];
  PX4.forEach((x, i) => { p4.strokeStyle = TEAL; p4.lineWidth = 4; p4.strokeRect(x, PT4, PW4, PH4); LAY.reg(`panel ${i + 1}`, 's4', [x, PT4, PW4, PH4]);
    if (x + 12 > 0) tb(p4, '①②③④'[i], '700 #px ZenKakuB', [x + 12, PT4 + 8, 46, 46], { maxSize: 40, color: TEAL, name: `panel number ${i + 1}`, sheet: 's4n' }); });
  // the 知恵の輪 (08b's component: a D-ring with a stub of flat lanyard, a small ring B through HER card's holder slot), drawn
  // with ring A's top bar centre at (cx, cy), scale s.
  // Round 9 (card review 2026-11-21, MUST): the card on ring B is HER card, as 08b made it (docs/卡面状态.md 第六节 08b; 改定 15:
  // from 03 on never a blank card): her_card.js's face, state 'title', 3:2, CARD_U 136 figure units wide, hung by its own
  // holder slot (her_card BACK.slot) with ring B's lowest point in the slot, CARD_SHADOW under it and a thin teal rule round
  // it. The face is prefiltered (herFaceAt, from u 2400) to the card's size on this page (CARD_U x s, about 197 px) and drawn
  // at about 1:1, so its grid does not alias.
  // Round 10 (card re-review 2026-11-21, MUST): round 9 changed the card but kept 08b's OLD ③ around it (ring B on the bar's
  // corner at (-82, 32), the strap, D-ring and ring B's tube drawn over the card, a haloed down arrow across it): the arrow
  // cut ロ (ロストワン read コストワン) and the three labels, the D-ring's lower arc and ring B's tube lay on み, ん and the name
  // field (根因清单: 08b 问四③换成完整的印字卡后，被本段自己的图解压住). S4 is "08b's page, close", so ③ is now 08b's ③ as
  // it is NOW (seg_08b.js SLIDE, 08b review MUST): the same numbers, the same drawing order, the same slot-column clip and
  // the same two arrows. Ring B has slid up the D-ring's left arc; the card hangs from it below the D-ring and to the left;
  // ring B is drawn BEHIND the card and only its piece in the slot's own column is drawn again in front; the D-ring passes
  // over ring B at the upper crossing (2.6-2.9 rad); the push arrow runs up outside the arc, left of ring B and above the
  // card, the pull arrow leaves the D-ring on the right; no halo (nothing crosses the card). The numbers are checked against
  // seg_08b.js's own source when the page loads (SYNC 08b SLIDE below), and the card's cover is audited (CARD COVER AUDIT).
  const CARD_U = 136, CARD_HH = CARD_U / HER_CARD.ratio, SLOT_CY = (HER_BACK.slot[1] + HER_BACK.slot[3] / 2) * CARD_U;
  const SLOT_X0 = HER_BACK.slot[0], SLOT_W = HER_BACK.slot[2], SLOT_BOT = (HER_BACK.slot[1] + HER_BACK.slot[3]) * CARD_U;
  // seg_08b.js: SLIDE = { bx: -66, by: 86, over: [2.6, 2.9], arrows: cx => [[[cx + 50, RY + 62], ...]] }, here about (cx, RY) = (0, 0)
  const SLIDE = { bx: -66, by: 86, over: [2.6, 2.9],
                  arrows: [[[50, 62], [116, 36]], [[-129, 74], [-128, 56], [-124, 40], [-118, 28], [-110, 18]]] };
  const CHIE_FACE = {};
  // only: 'all' (the figure as printed), 'card' (her card alone, exactly as the figure draws it: the reference of the cover audit)
  function chie(ctx, cx, cy, s, state, { only = 'all' } = {}) {
    const RY = 0; ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    const tube = (path, w = 14) => { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = GRAPHITE; ctx.lineWidth = w; path(); ctx.stroke();
      ctx.strokeStyle = PAPER; ctx.globalAlpha = 0.85; ctx.lineWidth = 3.5; ctx.translate(-2.6, -2.6); path(); ctx.stroke(); ctx.restore(); };
    const dRing = () => { ctx.beginPath(); ctx.moveTo(-78, RY); ctx.lineTo(78, RY); ctx.ellipse(0, RY, 78, 104, 0, 0, Math.PI); ctx.closePath(); };
    const dArc = (a0, a1) => () => { ctx.beginPath(); ctx.ellipse(0, RY, 78, 104, 0, a0, a1); };
    const ringB = (bx, by, rx) => () => { ctx.beginPath(); ctx.ellipse(bx, by, Math.max(1, rx), 46, 0, 0, 7); };
    const strap = () => { ctx.save(); ctx.fillStyle = TEAL; ctx.fillRect(-27, RY - 50, 54, 64); ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 2.5; ctx.strokeRect(-27, RY - 50, 54, 64);
      ctx.strokeStyle = rgba([247, 245, 239], 0.8); ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(-20, RY - 40); ctx.lineTo(20, RY - 40);
      ctx.moveTo(-18, RY - 32); ctx.lineTo(-18, RY + 4); ctx.moveTo(18, RY - 32); ctx.lineTo(18, RY + 4); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); };
    const fu = Math.round(CARD_U * s), face = CHIE_FACE[fu] || (CHIE_FACE[fu] = herFaceAt(fu));
    const rrect = (x, y, w, h, r) => { r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
    // her card hanging from ring B by its slot (edge on when w is small), as 08b's card(): ring, if given, is drawn again in
    // front of the card only inside the slot's column (the card's top edge to the slot's bottom: the paper bridge and the hole)
    const card = (bx, ringBottom, w, ring = null) => { const top = ringBottom - SLOT_CY, x0 = bx - w / 2, r = CARD_U * 0.03 * Math.min(1, w / CARD_U);
      ctx.save(); ctx.fillStyle = CARD_SHADOW; rrect(x0 + 3, top + 4, w, CARD_HH, r); ctx.fill();
      ctx.imageSmoothingQuality = 'high'; ctx.drawImage(face, x0, top, w, CARD_HH);
      ctx.strokeStyle = TEAL; ctx.lineWidth = 2; rrect(x0, top, w, CARD_HH, r); ctx.stroke(); ctx.restore();
      if (ring) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + w * SLOT_X0, top, w * SLOT_W, SLOT_BOT); ctx.clip(); ring(); ctx.restore(); }
      return [x0, top, w, CARD_HH]; };
    // 08b's arrow(): a polyline shaft and a filled head
    const arrow = (pts, { w = 6, head = 18 } = {}) => { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = TEAL; ctx.fillStyle = TEAL; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b[0] + Math.cos(an) * head * 0.4, b[1] + Math.sin(an) * head * 0.4);
      ctx.lineTo(b[0] + Math.cos(an + 2.5) * head, b[1] + Math.sin(an + 2.5) * head); ctx.lineTo(b[0] + Math.cos(an - 2.5) * head, b[1] + Math.sin(an - 2.5) * head); ctx.closePath();
      ctx.fill(); ctx.restore(); };
    let bx, by, rx, cw;
    if (state === 'slide') { bx = SLIDE.bx; by = RY + SLIDE.by; rx = 46; cw = CARD_U; }
    else { const turn = state === 'turn'; bx = 0; by = RY + 134; rx = turn ? 10 : 46; cw = turn ? 10 : CARD_U; }
    const rb = () => tube(ringB(bx, by, rx), 13);
    let cardBox;
    if (only === 'card') cardBox = card(bx, by + 46, cw);
    else {
      strap(); tube(dRing); rb(); cardBox = card(bx, by + 46, cw, rb);
      if (state === 'slide') { tube(dArc(SLIDE.over[0], SLIDE.over[1])); SLIDE.arrows.forEach(p => arrow(p)); }    // the D-ring over ring B at the upper crossing: linked
      else tube(dArc(rx > 30 ? 1.78 : 1.5, rx > 30 ? 2.14 : 1.72));
    }
    ctx.restore();
    // the geometry on the page (world px) for the audits: the card, its slot column, and every element of the figure that could
    // lie on it (08b's figBoxes: strap, D-ring, ring B above the card, ring B in the slot, the arrows with their heads)
    const [x0, top, w, h] = cardBox, F = ([x, y, bw, bh]) => [cx + x * s, cy + y * s, bw * s, bh * s];
    const el = { strap: F([-29, RY - 52, 58, 68]), 'D-ring': F([-85, RY - 7, 170, 118]),
                 'ring B (above the card)': F([bx - rx - 6.5, by - 52.5, 2 * rx + 13, top - (by - 52.5)]),
                 'ring B (in the slot)': F([x0 + w * SLOT_X0, top, w * SLOT_W, SLOT_BOT]) };
    if (state === 'slide') SLIDE.arrows.forEach((pts, i) => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), m = 18;
      el[`arrow ${i + 1}`] = F([Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) - Math.min(...xs) + 2 * m, Math.max(...ys) - Math.min(...ys) + 2 * m]); });
    const pieces = { 'card face (below the slot)': F([x0, top + SLOT_BOT, w, h - SLOT_BOT]), 'card face (left of the slot)': F([x0, top, w * SLOT_X0, SLOT_BOT]),
                     'card face (right of the slot)': F([x0 + w * (SLOT_X0 + SLOT_W), top, w * (1 - SLOT_X0 - SLOT_W), SLOT_BOT]) };
    return Object.assign(F(cardBox), { el, pieces, slot: F([x0 + w * SLOT_X0, top, w * SLOT_W, SLOT_BOT]), ringB: [cx + bx * s, cy + by * s] });
  }
  // ③'s rings: ring A's top bar. Round 10: 08b's ③ hangs her card 54 figure units (78 px) lower than round 9's, so the figure
  // goes up: CHY 806 -> 715 (and 問四 and the panels 12 px higher). The figure is 396 px tall at 1.45 (the strap's top edge
  // to the card's shadow); its strap keeps 10 px of paper under ③'s top rule (as in 08b) and the card with its shadow keeps
  // about 40 px of paper above the frame's lower edge at the push's nearest (CARD AUDIT, and frameCheck 'S4 her card with
  // its paper margin' with an inset of 24 px). Everything placed from CHX / CHY (the pinch points, so the forearms, their
  // holes and the bulges) follows.
  const CHS = 1.45, CHY = 715, CHX = 1000;
  // only ③'s rings are drawn: ② and ④ are seen only at their edges, where a sliver of their rings read as stray dark marks
  p4.save(); p4.beginPath(); p4.rect(PX4[2] + 2, PT4 + 2, PW4 - 4, PH4 - 4); p4.clip(); const CARD4 = chie(p4, CHX, CHY, CHS, 'slide'); p4.restore();
  // her card's printed lines on the page (her_card.js boxes at the card's size, moved to where it hangs): sheet 's4:card', in
  // the layout audit (they must not overlap each other), the frame audit (whole in every frame of S4) and the figure audit
  // (not covered by her forearms, the flaps or the torn bits)
  { const cu = CARD4[2], fb = herCardBoxes(cu, { state: 'title' });
    for (const [nm, b] of Object.entries(fb.lines)) LAY.text(`her card ${nm}`, 's4:card', [CARD4[0] + b[0], CARD4[1] + b[1], b[2], b[3]]); }
  // the whole card with its shadow, alone on its sheet, as a text box: cut by the frame in any frame of S4 is a problem
  const CARD4S = [CARD4[0], CARD4[1], CARD4[2] + 3 * CHS, CARD4[3] + 4 * CHS];
  LAY.text('her card (whole, with its shadow)', 's4:cardframe', CARD4S);
  // 08b's 解けません, small, on the edge of ② that is in the picture
  const ST4 = [210, 666, 3.2];
  print16(p4, '解けません', ST4[0], ST4[1], ST4[2], 1, 61, { frame: true, label: PAPER });
  LAY.text('解けません', 's4:stamp', print16Box('解けません', ST4[0], ST4[1], ST4[2], { framed: true }));
  { const m = mk(8, 8)[1]; m.font = `700 ${Q4S}px ShipporiB`; LAY.text('question 43', 's4:print', [Q4QX, Q4Y - Q4S * 0.6, L43.reduce((a, [c]) => a + m.measureText(c).width, 0), Q4S * 1.2]);
    m.font = `700 ${Q3S}px ShipporiB`; LAY.text('question 42', 's4:q3', [Q3QX, Q3Y - Q3S * 0.6, L42.reduce((a, [c]) => a + m.measureText(c).width, 0), Q3S * 1.2]); }
  LAY.audit('seg_12 S4 page');
  // CARD COVER AUDIT, the boxes (round 10; the pixel checks are with the frame audits below): each element of ③'s figure on a
  // sheet of its own with the card face cut in three round the slot column (audited here, as its own group)
  for (const [en, eb] of Object.entries(CARD4.el)) { const sh = `card cover | ${en}`; LAY.reg(en, sh, eb); for (const [cn, cb] of Object.entries(CARD4.pieces)) LAY.reg(cn, sh, cb); }
  const COVER_BOX_OV = LAY.audit('seg_12 S4 her card vs her own 知恵の輪 figure (each element on its own sheet with the card face)');
  // the reading frame: on ② at first; k401 it slides onto ③ (round her hands), k403 it goes on to ④
  const frameX = tt => { const a = PX4[1]; if (tt < T4.frame3) return a; if (tt < T4.frame4) return a + (PX4[2] - a) * ease(Math.min(1, (tt - T4.frame3) / (3 * FR))); return PX4[3]; };
  // where her hands pinch: the left hand (from the right, fingers to the left) ring A's right side, the right hand ring B's left
  // Round 10: the figure went up 91 px (08b's ③ hangs the card lower), so the left hand pinches ring A lower on its right arc
  // (1.1 rad, was 0.32): the forearm, its hole and its bulge stay where round 9 had them (y 849, was 853), clear of ④'s
  // number and the panels' top rules; at 0.32 the hole tore through ④'s number (FIGURE AUDIT)
  const ringAR = [CHX + 78 * CHS * Math.cos(1.1), CHY + 104 * CHS * Math.sin(1.1)];
  const ringBL = [CHX + (SLIDE.bx - 46 * Math.cos(0.35)) * CHS, CHY + (SLIDE.by + 46 * Math.sin(0.35)) * CHS];   // round 10: ring B where 08b's ③ has it; 0.35 rad (was 0.2) keeps the arm at round 9's height, its flaps clear of ③'s number
  // The forearm drawings (1536 x 1024; pinch point measured on art/cut/h12_pry2_l.png / _r.png). Round 5 (review 2026-11-21,
  // MUST 2): each forearm is drawn WHOLE in front of the paper. The old way split the drawing on a straight line (the cuff in
  // front, the rest of the sleeve clipped to the hole behind the paper, under the paper's shadow), which showed as a hard
  // vertical seam across the sleeve. Now the sleeve's far end IS where it passes the paper: the hole is the sleeve's own
  // silhouette there (measured from the drawing's alpha), a little larger, ragged; on the hand's side the hole runs inside the
  // sleeve, so the paper's rim only shows round the far end. The flaps are torn like the slit (rough edges, fibres, the grey
  // back, a shadow), not drawn as triangles.
  const HS = 0.4;
  // round 11: the pinch point is each forearm drawing's own anchor (seg12_parts.json, pinch.point), checked on its pixels (on the
  // line where finger and thumb meet, skin next to it); the drawing is placed by placement() with that point on the ring, and
  // everything derived from the drawing (the hole's rim, the flaps, the shadow) goes through the same P (h.x0/y0 = P's origin)
  const HANDS = { L: { file: DRAW.pryL, pinch: partOf(PA, 'h12_pry2_l', 'pinch').point, side: 1, at: ringAR, seed: 401 },
                  R: { file: DRAW.pryR, pinch: partOf(PA, 'h12_pry2_r', 'pinch').point, side: -1, at: ringBL, seed: 402 } };
  for (const h of Object.values(HANDS)) {
    h.P = placement({ x: h.at[0], y: h.at[1], s: HS, origin: h.pinch });
    partAudit('seg_12', nameOf(h.file), 'pinch (on the line where finger and thumb meet)', { image: IMG[h.file], points: [h.pinch], on: PIX.dark, r: 2, maxOffPct: 0 });
    partAudit('seg_12', nameOf(h.file), 'pinch (skin of finger and thumb next to it)', { image: IMG[h.file], points: [h.pinch], on: PIX.skin, r: 8, maxOffPct: 0 });
  }
  const sstep = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const DEG = Math.PI / 180;
  for (const h of Object.values(HANDS)) {
    const M = maskOf(h.file), far = h.side, r = rng(h.seed);
    [h.x0, h.y0] = h.P.toWorld([0, 0]);
    // the sleeve's far end: the drawing's extreme column on the sleeve's side
    let xb = far > 0 ? 0 : M.w;
    for (let y = 0; y < M.h; y += 2) for (let x = 0; x < M.w; x += 2) if (M.m[y * M.w + x] && (far > 0 ? x > xb : x < xb)) xb = x;
    // the centre of the sleeve's cross-section at the paper: 170 px (drawing) in from the far end, half way up the sleeve there
    const cx = xb - far * 170; let top = -1, bot = -1;
    for (let y = 0; y < M.h; y++) if (M.m[y * M.w + Math.round(cx)]) { if (top < 0) top = y; bot = y; }
    const C = [cx, (top + bot) / 2];
    // theta is measured from the sleeve's far direction, positive downwards, for both hands
    const dirOf = th => far > 0 ? th : Math.PI - th;
    const exitR = th => { const a = dirOf(th), dx = Math.cos(a), dy = Math.sin(a); for (let q = 0; q < 900; q += 1) if (!M.at(C[0] + dx * q, C[1] + dy * q)) return q; return 900; };
    const toS = (th, rr) => { const a = dirOf(th); return [h.x0 + (C[0] + Math.cos(a) * rr) * HS, h.y0 + (C[1] + Math.sin(a) * rr) * HS]; };
    const rIn = 0.55 * Math.min(exitR(-90 * DEG), exitR(90 * DEG));
    // the rim: 13-27 px (screen) outside the silhouette round the far end (a dark crescent: the sleeve goes in there), ragged at
    // three scales; from 80 deg on it turns in under the sleeve (hidden by it)
    const N = 288, nz = noise1(h.seed + 7), nz2 = noise1(h.seed + 9);
    h.rimTh = []; h.rim = [];
    for (let k = 0; k < N; k++) {
      const th = -Math.PI + k / N * 2 * Math.PI, A = Math.abs(th);
      const out = exitR(th) + (13 + 11 * (0.5 + 0.5 * nz(k / 11)) + 2.6 * nz2(k / 2.1) + (r() - 0.5) * 1.8) / HS;
      const w = sstep(80 * DEG, 120 * DEG, A);
      h.rimTh.push(th); h.rim.push(toS(th, out * (1 - w) + rIn * w));
    }
    h.hole = toS(0, rIn * 0.4);       // the fist's place before it comes through (the bulge, the torn bits)
    h.rimAt = th => h.rim[((Math.round((th + Math.PI) / (2 * Math.PI) * N) % N) + N) % N];
    h.rimIdx = th => ((Math.round((th + Math.PI) / (2 * Math.PI) * N) % N) + N) % N;
    h.C = toS(0, 0); h.toS = toS;
    // the flaps: the paper round the far end and the top and bottom tore into irregular tongues (no two alike: long, short,
    // broad, one torn off short); most folded back over the page (grey back up, a shadow under them); one stands up against the
    // sleeve (its printed front, over the sleeve's edge)
    h.flaps = []; const span = [-126, 126], nf = 6;
    let a = span[0] * DEG;
    for (let k = 0; k < nf; k++) {
      const b = k === nf - 1 ? span[1] * DEG : a + (span[1] - span[0]) / nf * DEG * (0.7 + r() * 0.6), mid = (a + b) / 2;
      const up = k === (far > 0 ? 1 : 4);
      h.flaps.push({ a, b, mid, up, len: up ? 14 + r() * 6 : [34, 18, 44, 26, 38, 22][k] * (0.85 + r() * 0.3), lean: (r() - 0.5) * 0.6,
                     peak: 0.3 + r() * 0.4, seed: h.seed * 10 + k, under: Math.abs(mid) > 100 * DEG });
      a = b;
    }
  }
  // the hands pull outward on k401 (4 px) and k405 (8 px): 2 frames out, 2 frames back
  const pullPx = tt => [[T4.pull1, 4], [T4.pull2, 8]].reduce((a, [t0, amp]) => { const d = (tt - t0) / FR; if (d < 0 || d > 6) return a; return a + amp * (d < 2 ? d / 2 : d < 4 ? 1 - (d - 2) / 2 * 0.85 : 0.15 * (1 - (d - 4) / 2)); }, 0);
  const holeOff = (h, tt) => pullPx(tt) * h.side * 0.8;    // the rim and its flaps follow the arm's pull a little less than the arm
  // her face behind the slit (R12-strain-close, 1536 x 1024: the eyes' midpoint at (775, 645)): eyes on screen y 330, face centred
  const STR = { s: 1.0, eyes: [775, 645] }, STR_AT = [960, 330];
  // the slit: [up, down] half-openings per third, the middle first; it bows (widest in the middle of the page)
  const THIRDS = [[640, 1280, T4.cut1], [34, 640, T4.cut2], [1280, 1890, T4.cut3]];
  // the opening's stages: [start, [up, down]] (rhythm pass: k392 added between the first two)
  const STAGES4 = [[T4.cut1, [20, 58]], [T4w, [30, 90]], [T4.cut2, [40, 128]], [T4.cut3, [62, 206]]];
  function gapAt(x, tt) {
    let g0 = 0; for (const [a, b, t0] of THIRDS) { if (tt < t0 || x < a - 40 || x > b + 40) continue; const age = tt - t0, o = Math.min(1, (age / FR + 1) / 3) * (1 + (age > 2 * FR ? 0.04 * Math.exp(-(age - 2 * FR) / 0.08) * Math.cos((age - 2 * FR) * 38) : 0));
      const e = Math.min(1, Math.max(0, (x - a + 40) / 80)) * Math.min(1, Math.max(0, (b + 40 - x) / 80)); g0 = Math.max(g0, o * e); }
    // a widening that has just begun eases in over 3 frames from the previous opening
    let si = 0; STAGES4.forEach(([t0], i) => { if (tt >= t0) si = i; });
    const lastT = STAGES4[si][0], cur = STAGES4[si][1], prev = si > 0 ? STAGES4[si - 1][1] : [0, 0];
    const k = Math.min(1, ((tt - lastT) / FR + 1) / 3), bow = 0.62 + 0.38 * Math.cos(Math.min(1, Math.abs(x - 960) / 960) * Math.PI / 2);
    return [g0 * bow * (prev[0] + (cur[0] - prev[0]) * k), g0 * bow * (prev[1] + (cur[1] - prev[1]) * k)];
  }
  const cells4 = []; { const u = 185; for (let i = -1; i < 12; i++) for (let j = -1; j < 7; j++) cells4.push({ x: i * u + 3 - 60, y: j * u + 3 - 40, w: u - 6, h: u - 6, u, n: 1 + i * 8 + j, tall: false, win: [i * u - 60 + u * 0.3, j * u - 40 + u * 0.24, u * 0.4, u * 0.28] }); }
  const [WC4, w4] = mk(W, 1080); drawLockers(w4, cells4, { x0: 0, y0: 0, x1: W, y1: 1080, line: 2.6, light: [-200, 1300] });
  const [PL4, pl4] = mk(W, 1080), [SH4] = mk(W, 1080);
  // the torn bits start on the rim round the far end (round 5: from the old hole's centre they flew out of the middle of the sleeve)
  const BITS4 = Object.values(HANDS).flatMap((h, i) => makeBits(P4, [-70, -20, 30, 75].map(d => h.rimAt(d * DEG)), 71 + i, { size: [7, 14] }));
  // the fist bulge (k397): a height field (the fist's mass and its row of knuckles), the paper's print displaced over it (the
  // lines bend) and lit in two paper tones (the side towards the light a little lighter, the side away in shade); no gloss
  const LIGHT4 = (() => { const v = [-0.35, -0.8, 0.5], n = Math.hypot(...v); return v.map(c => c / n); })();
  function bulge(ctx, h, amt, tt) {
    const R = 150, [bx, by] = h.hole, x0 = Math.round(bx - R), y0 = Math.round(by - R), n = 2 * R;
    const src = ctx.getImageData(x0, y0, n, n), dst = ctx.createImageData(n, n), s = src.data, d = dst.data;
    const knk = [-45, -15, 15, 45].map((kx, i) => [kx * h.side, -16 + (i === 0 || i === 3 ? 6 : 0)]);
    const pulse = 1 + 0.06 * Math.sin((tt - T4.bulge) * 26) * Math.exp(-(tt - T4.bulge) / 0.25);
    const A = 26 * amt * pulse;    // height in px
    // the fist's mass: a flat-topped dome (steep only near its rim, so its shade is a crescent, not half a ball), plus the knuckles
    const HM = (x, y) => { const q = (x * x) / (70 * 70) + ((y - 8) * (y - 8)) / (60 * 60); return Math.exp(-q * q * 1.6); };
    const H = (x, y) => { let v = HM(x, y);
      for (const [kx, ky] of knk) v += 0.28 * Math.exp(-(((x - kx) ** 2) + ((y - ky) ** 2)) / (2 * 12 * 12)); return v; };
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i - R, y = j - R, o = (j * n + i) * 4, hv = H(x, y);
      if (hv < 0.004 && H(x - 7, y - 13) < 0.3) { d[o] = s[o]; d[o + 1] = s[o + 1]; d[o + 2] = s[o + 2]; d[o + 3] = s[o + 3]; continue; }
      // the print seen on the dome: magnified towards the top, sampled nearer the centre
      const m = 1 - 0.18 * amt * HM(x, y), sx = Math.round(R + x * m), sy = Math.round(R + y * m);
      const q = (Math.min(n - 1, Math.max(0, sy)) * n + Math.min(n - 1, Math.max(0, sx))) * 4;
      let r = s[q], g2 = s[q + 1], b = s[q + 2];
      const hx = (H(x + 1, y) - H(x - 1, y)) * A / 2, hy = (H(x, y + 1) - H(x, y - 1)) * A / 2, nl = Math.hypot(hx, hy, 1);
      const lit = (-hx * LIGHT4[0] - hy * LIGHT4[1] + LIGHT4[2]) / nl - LIGHT4[2];
      // two tones, hard-edged (a 2 px ramp): the side away from the light in the paper's shade tone; the lit side stays paper
      const dn = Math.min(1, Math.max(0, (-lit - 0.16) / 0.025)), cast = hv < 0.3 && H(x - 5, y - 9) > 0.3 ? 1 : 0;
      // the lit tone lightens the paper only (the print on it keeps its colour)
      const lum = (0.3 * r + 0.59 * g2 + 0.11 * b) / 255, up = Math.min(1, Math.max(0, (lit - 0.16) / 0.025)) * 0.85 * Math.pow(lum, 10), k2 = Math.max(0.12 * dn, 0.08 * cast);
      r += (255 - r) * up; g2 += (255 - g2) * up; b += (255 - b) * up;
      r *= 1 - k2; g2 *= 1 - k2 * 0.95; b *= 1 - k2 * 0.8;
      d[o] = r; d[o + 1] = g2; d[o + 2] = b; d[o + 3] = s[q + 3];
    }
    ctx.putImageData(dst, x0, y0);
  }
  const nU = noise1(411), nD = noise1(412);
  function buildPaper4(tt) {
    pl4.setTransform(1, 0, 0, 1, 0, 0); pl4.globalCompositeOperation = 'source-over'; pl4.clearRect(0, 0, W, 1080); pl4.drawImage(P4, 0, 0);
    printSung(pl4, L42, Q3QX, Q3Y, Q3S, tt);
    printSung(pl4, L43, Q4QX, Q4Y, Q4S, tt);
    // the reading frame (08b's)
    { const fx = frameX(tt), land = tt >= T4.frame4 ? tt - T4.frame4 : tt - T4.frame3, sc = tt >= T4.frame3 ? 1 + 0.04 * Math.pow(1 - Math.min(1, land / (3 * FR)), 2) : 1;
      pl4.save(); pl4.translate(fx + PW4 / 2, PT4 + PH4 / 2); pl4.scale(sc, sc); pl4.strokeStyle = TEAL; pl4.lineWidth = 12; pl4.strokeRect(-PW4 / 2 - 12, -PH4 / 2 - 12, PW4 + 24, PH4 + 24); pl4.restore(); }
    // the bulges (k397 until they are punched through on k399)
    const bAmt = tt >= T4.bulge && tt < T4.punch ? Math.min(1, ((tt - T4.bulge) / FR + 1) / 3) : 0;
    if (bAmt > 0) for (const h of Object.values(HANDS)) bulge(pl4, h, bAmt, tt);
    // the cut line opening (explicit opaque fill: destination-out takes its alpha from the fill, and a transparent fill left
    // over from earlier drawing cut nothing: the review's "the slit closes" bug, k397-k399)
    const xs = []; for (let x = 20; x <= 1904; x += 3) xs.push(x);
    const sway = tt >= T4.cut3 ? 3 * Math.exp(-(tt - T4.cut3) / 0.12) * Math.max(0, Math.sin((tt - T4.cut3) * 26 + 0.5)) : 0;
    const G = xs.map(x => gapAt(x, tt));
    const U = xs.map((x, i) => [x, Y_CUT - G[i][0] * (0.82 + 0.18 * nU(x / 37)) - (G[i][0] > 0 ? sway : 0)]), D = xs.map((x, i) => [x, Y_CUT + G[i][1] * (0.86 + 0.14 * nD(x / 41))]);
    if (U.some((p, i) => D[i][1] - p[1] > 0.5)) {
      pl4.globalCompositeOperation = 'destination-out'; pl4.fillStyle = '#000'; pl4.beginPath(); pathPoly(pl4, [...U, ...[...D].reverse()]); pl4.fill(); pl4.globalCompositeOperation = 'source-over';
      const runs = (pts, other) => { const out = []; let cur = []; pts.forEach((p, i) => { if (Math.abs(other[i][1] - p[1]) > 0.5) cur.push(p); else if (cur.length) { out.push(cur); cur = []; } }); if (cur.length) out.push(cur); return out; };
      runs(U, D).forEach((r, k) => tornEdge(pl4, r, 430 + k, { side: 1, lip: 1.4, fibres: 1.3 })); runs(D, U).forEach((r, k) => tornEdge(pl4, r, 440 + k, { side: -1, lip: 1.6, fibres: 1.3 })); }
    // the punched holes (k399): cut along the rim (opaque fill, see above), then the rim's torn edge round the far end (the part
    // on the hand's side runs under the sleeve); the rim follows the arm's pull a little (0.8)
    if (tt >= T4.punch) for (const h of Object.values(HANDS)) { const off = holeOff(h, tt), rim = h.rim.map(([x, y]) => [x + off, y]);
      pl4.globalCompositeOperation = 'destination-out'; pl4.fillStyle = '#000'; pl4.beginPath(); pathPoly(pl4, rim); pl4.fill(); pl4.globalCompositeOperation = 'source-over';
      const i0 = h.rimIdx(-112 * DEG), i1 = h.rimIdx(112 * DEG);
      tornEdge(pl4, rim.slice(i0, i1 + 1), h.seed + 30, { side: h.side, lip: 0.8, fibres: 1.2 }); }   // rim runs by theta: its left normal points into the hole for L, out of it for R
    shadowOf(SH4, PL4, {});
  }
  // The flaps of a punched hole, torn the way the slit is torn: each one hinged on a stretch of the rim, its two sides radial
  // tears (rough, fibrous), a blunt torn tip. Folded back over the page, a flap shows the sheet's grey back, in one of two hard
  // tones by which way it faces (light from the upper left), with a shadow on the page under it. The two 'up' flaps stand
  // against the sleeve: their printed front, leaning over the sleeve's edge, drawn after the arm (they hide its edge there).
  const BACK4 = backPaper(320, 320, 431);
  const L2 = (() => { const v = [-0.4, -0.9], n = Math.hypot(...v); return v.map(c => c / n); })();
  function flapShape(h, f, off, grow) {
    const i0 = h.rimIdx(f.a), i1 = h.rimIdx(f.b), base = h.rim.slice(Math.min(i0, i1), Math.max(i0, i1) + 1).map(([x, y]) => [x + off, y]);
    const c = [h.C[0] + off, h.C[1]], n1 = noise1(f.seed), n2 = noise1(f.seed + 11), sgn = f.up ? -1 : 1, L = f.len * grow;
    // the torn outer edge: from B back to A, each rim point pushed out (in for an 'up' flap) by the tongue's profile (a lopsided
    // hump, peak at f.peak, with notches), ragged at two scales; its sides are the radial tears where it parted from the next
    const torn = [];
    for (let j = base.length - 1; j >= 0; j -= 1) {
      const u = j / (base.length - 1), p = base[j], vx = p[0] - c[0], vy = p[1] - c[1], vl = Math.hypot(vx, vy);
      const hump = Math.pow(Math.sin(Math.PI * Math.pow(u, Math.log(0.5) / Math.log(f.peak))), 0.55);
      const d = L * hump * (0.82 + 0.3 * n1(u * 5.3)) + 1.6 * n2(u * 40) * hump;
      const lean = f.lean * d * 0.6;
      torn.push([p[0] + sgn * vx / vl * d - vy / vl * lean, p[1] + sgn * vy / vl * d + vx / vl * lean]);
    }
    let lx = 0, ly = 0; for (const [x, y] of base) { lx += x - c[0]; ly += y - c[1]; } const ll = Math.hypot(lx, ly);
    const mid = torn[torn.length >> 1];
    return { poly: [...base, ...torn], torn, base, lit: (lx * L2[0] + ly * L2[1]) / ll, c: [(base[base.length >> 1][0] + mid[0]) / 2, (base[base.length >> 1][1] + mid[1]) / 2] };
  }
  // a flap's torn edge lying over the page: no curled lip (it is the flap's own edge, seen from above), a fine line of its
  // thickness and its fibres poking out over the page
  function flapEdge(ctx, pts, seed, side) {
    const r = rng(seed); ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(INK_RGB, 0.2); ctx.lineWidth = 1; ctx.beginPath(); polyline(ctx, pts); ctx.stroke();
    for (let i = 2; i < pts.length - 2; i++) { if (r() > 0.55) continue;
      const a = pts[i - 1], b = pts[i + 1], tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1, nx = -ty / tl * side, ny = tx / tl * side;
      const len = r() < 0.12 ? 5 + r() * 7 : 1.2 + r() * 3.5, ang = (r() - 0.5) * 1.2, ex = pts[i][0] + (nx * Math.cos(ang) - ny * Math.sin(ang)) * len, ey = pts[i][1] + (ny * Math.cos(ang) + nx * Math.sin(ang)) * len;
      ctx.strokeStyle = r() < 0.5 ? rgba(FIBRE_RGB, 0.45) : rgba([252, 251, 247], 0.9); ctx.lineWidth = 0.5 + r() * 0.7;
      ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.quadraticCurveTo(pts[i][0] + nx * len * 0.5 + (r() - 0.5) * 2, pts[i][1] + ny * len * 0.5 + (r() - 0.5) * 2, ex, ey); ctx.stroke(); }
    ctx.restore();
  }
  const leftSide = (pts, c) => { const i = pts.length >> 1, a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 2)], nx = -(b[1] - a[1]), ny = b[0] - a[0];
    return nx * (pts[i][0] - c[0]) + ny * (pts[i][1] - c[1]) > 0 ? 1 : -1; };
  function flaps(ctx, h, off, tt, layer) {
    const age = tt - T4.punch, grow = Math.min(1, (age / FR + 1) / 3) + pullPx(tt) * 0.012;
    const list = h.flaps.filter(f => (layer === 'up') === f.up).map(f => ({ f, s: flapShape(h, f, off, grow) }));
    if (layer !== 'up') {   // the page under the folded-back flaps: a shadow (they stand off the page a little)
      ctx.save(); ctx.filter = 'blur(3px)'; ctx.fillStyle = rgba(INK_RGB, 0.24);
      for (const { s } of list) { ctx.beginPath(); pathPoly(ctx, s.poly.map(([x, y]) => [x + 4, y + 7])); ctx.fill(); } ctx.restore();
    } else {                // the up flaps' shadow on the sleeve
      ctx.save(); ctx.filter = 'blur(2px)'; ctx.fillStyle = rgba(INK_RGB, 0.22);
      for (const { s } of list) { ctx.beginPath(); pathPoly(ctx, s.poly.map(([x, y]) => [x + 3, y + 5])); ctx.fill(); } ctx.restore();
    }
    for (const { f, s } of list) {
      ctx.save(); ctx.beginPath(); pathPoly(ctx, s.poly); ctx.clip();
      if (f.up) { ctx.drawImage(P4, 0, 0); ctx.fillStyle = rgba(INK_RGB, 0.08); ctx.fill(); }
      else { ctx.drawImage(BACK4, s.c[0] - 160, s.c[1] - 160); ctx.fillStyle = rgba(INK_RGB, s.lit > 0.2 ? 0.0 : s.lit > -0.35 ? 0.09 : 0.2); ctx.fill(); }
      ctx.restore();
      // the fold along the rim: a lit crease on the flaps facing the light, a dark one on the others
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 1.3; ctx.strokeStyle = s.lit > 0.2 ? rgba([255, 255, 255], 0.75) : rgba(INK_RGB, 0.3);
      ctx.beginPath(); polyline(ctx, s.base); ctx.stroke(); ctx.restore();
      flapEdge(ctx, s.torn, f.seed + 5, leftSide(s.torn, s.c));
    }
  }
  // the forearm, whole, in front of the paper, and its shadow on the page (light from the upper left; the hand is well off the
  // page, so the shadow falls further and softer than the flaps')
  const ARMSH = {};
  for (const h of Object.values(HANDS)) { const im = IMG[h.file], [c, x] = mk(im.width * HS, im.height * HS); x.drawImage(im, 0, 0, im.width * HS, im.height * HS);
    x.globalCompositeOperation = 'source-in'; x.fillStyle = HAND_SHADOW; x.fillRect(0, 0, c.width, c.height); ARMSH[h.file] = c; }
  function drawHand(ctx, h, tt, part) {
    const off = pullPx(tt) * h.side, im = IMG[h.file], x0 = h.x0 + off, y0 = h.y0;
    if (part === 'shadow') { ctx.save(); ctx.filter = 'blur(5px)'; ctx.drawImage(ARMSH[h.file], x0 + 12, y0 + 19); ctx.restore(); return; }
    ctx.drawImage(im, x0, y0, im.width * HS, im.height * HS);
  }
  // round 11: zoom anchored on the page's top edge (the clamp keeps its 2 px margin), base 1.003 so no border shows
  const camS4 = tt => { const z = SK4.z(tt) + 0.003, v = CAM4.view(z, 960, 542 / z, 0); return [z, v.fx, v.fy]; };
  const CAM4 = createCamera(g, { W, H: 1080, bg: GRAPHITE });
  function drawS4(tt) {
    buildPaper4(tt);
    // she leans into it on k397: 6 px down, 2 % nearer
    const lean = tt >= T4.bulge ? Math.min(1, ((tt - T4.bulge) / FR + 1) / 3) : 0, R = S.at('rin4', tt);
    CAM4.shoot(camS4(tt), 0, tt, c => {
      c.drawImage(WC4, 0, 0);
      if (R) { const im = IMG[R.file], s = STR.s * (1 + 0.02 * lean); c.drawImage(im, STR_AT[0] - STR.eyes[0] * s, STR_AT[1] + 6 * lean - STR.eyes[1] * s, im.width * s, im.height * s); }
      // through a hole: the locker wall behind the paper, in the shade of the paper and of her (its middle tone, not black)
      if (tt >= T4.punch) for (const h of Object.values(HANDS)) { const off = holeOff(h, tt);
        c.save(); c.beginPath(); pathPoly(c, h.rim.map(([x, y]) => [x + off, y])); c.clip(); c.fillStyle = rgba(INK_RGB, 0.55); c.fillRect(0, 0, W, 1080); c.restore(); }
      c.drawImage(SH4, 0, 0); c.drawImage(PL4, 0, 0);
      if (tt >= T4.punch) { for (const h of Object.values(HANDS)) { const off = holeOff(h, tt);
          flaps(c, h, off, tt, 'back'); drawHand(c, h, tt, 'shadow'); drawHand(c, h, tt, 'arm'); flaps(c, h, off, tt, 'up'); }
        drawBits(c, BITS4, tt - T4.punch, { g: 2600, life: 0.4 }); }
    });
  }

  // =====================================================================================================================
  // S5: the 進路 page, a stack of thirty answer sheets with everyone's はい filled black, torn into strips from below. Round 4
  // (review 2026-11-21): she is waist-up behind it (face ~330 px), the middle tear parts wide around her face from the first
  // tear on, four strips hang round her; the outer two drop at k413, the halves at k420 / k421, the title band at k422.
  // =====================================================================================================================
  // her face sits at x 880 (round 5, see FS below), so the wide middle tear and the two inner tears are centred on it
  const T5 = { tears: [[408, 880 / 1920, 470], [409, 0.22, 90], [410, 0.72, 90], [411, 0.10, 80], [412, 0.90, 80]].map(([k, x, w], i) => ({ t: S.ev(`stack torn at x ${x}`, K(k)), x: x * W, w, seed: 600 + i })),
               outer: S.ev('the outer two strips drop', K(413)), sway: [415, 417, 419].map(k => S.ev(`strips sway (k${k})`, K(k))),
               dropL: S.ev('left half drops (齐奏 1)', K(420)), dropR: S.ev('right half drops (齐奏 2)', K(421)), band: S.ev('title band flips up and away (齐奏 3)', K(422)) };
  S.hold('rin5', 'R12-bust-play (behind the strips)', TS5, K(415), { kind: 'key', file: DRAW.bust });
  S.hold('rin5', 'R12-bust-shout-a', K(415), K(419), { kind: 'key', file: DRAW.bustA });
  S.hold('rin5', 'R12-bust-shout-b', K(419), SEG[1], { kind: 'key', file: DRAW.bustB });
  // S5 (rhythm pass): every tear, drop and sway hits; the smooth push k415-k422 (6 %) is five steps (k412, k416, k420, k421,
  // k422; 4.5 %, so with the tutti's punches the white letters at x 120 / 1800 stay whole); the tutti k420 / k421 / k422 each
  // drops its piece in 4 frames with a dip, k420 also flashes (the phrase's one flash)
  // Round 11 (整屏运动): the camera stands still through the tears, the drops and the sways; the tutti is one paper-white flash
  // (k420, the left half drops) and one 大击 (k421, the loudest crash, 26.6 dB: a one-way 3.5 % step while the right half drops);
  // k422 the band flips away inside the picture.
  const SK5 = strikes('S5', [[420, { flash: 1, why: 'tutti 1: the left half drops' }], [421, { step: 0.035, why: '大击 tutti 2, loudest crash: the right half drops' }]]);
  const TOPY = 192;                                   // the strips hang from here (the title band and question row above)
  // the page (the top sheet of the stack)
  const [P5, p5] = paper(W, 1080, 61);
  p5.fillStyle = TEAL; p5.fillRect(0, 0, W, 104); LAY.reg('band', 's5', [0, 0, W, 104]);
  tb(p5, '進路', '700 #px ZenKakuB', [112, 38, 260, 56], { maxSize: 46, color: PAPER, name: 'band title', sheet: 's5b' });
  tb(p5, '令和八年度　読取確認テスト', '500 #px ZenKaku', [W - 632, 46, 512, 40], { maxSize: 28, align: 'right', color: PAPER, name: 'test name', sheet: 's5b' });
  const Q5S = 52, Q5Y = 150, Q5X = 120;
  { p5.font = `700 ${Q5S}px ShipporiB`; p5.fillStyle = GRAPHITE; p5.textBaseline = 'middle'; p5.textAlign = 'left'; p5.fillText('問五', Q5X, Q5Y);
    const lw = p5.measureText('問五').width; p5.fillStyle = TEAL; p5.fillRect(Q5X, Q5Y + Q5S * 0.6, lw + 30, 4); LAY.text('問五', 's5', [Q5X, Q5Y - Q5S * 0.6, lw, Q5S * 1.2]); }
  const Q5QX = Q5X + measure('問五', '700 #px ShipporiB', Q5S) + 30;
  { const m = mk(8, 8)[1]; m.font = `700 ${Q5S}px ShipporiB`; LAY.text('question 44', 's5:print', [Q5QX, Q5Y - Q5S * 0.6, L44.reduce((a, [c]) => a + m.measureText(c).width, 0), Q5S * 1.2]); }
  // the answer block (08b's 進路 page): なまえ / 回答 / 理由; はい filled solid black, いいえ empty
  const BX5 = 300, BY5 = 250, BW5 = 1320, BH5 = 700, LAB5 = 190;
  const ROW5 = { name: [250, 380], pick: [380, 700], why: [700, 950] };
  p5.fillStyle = TEAL; p5.fillRect(BX5, BY5, LAB5, BH5); p5.strokeStyle = TEAL; p5.lineWidth = 5; p5.strokeRect(BX5, BY5, BW5, BH5);
  p5.lineWidth = 4; p5.beginPath(); for (const y of [ROW5.pick[0], ROW5.why[0]]) { p5.moveTo(BX5, y); p5.lineTo(BX5 + BW5, y); } p5.stroke();
  p5.strokeStyle = rgba(TEAL_RGB, 0.45); p5.lineWidth = 2; p5.setLineDash([9, 9]); p5.beginPath(); for (const y of [800, 880]) { p5.moveTo(BX5 + LAB5 + 30, y); p5.lineTo(BX5 + BW5 - 30, y); } p5.stroke(); p5.setLineDash([]);
  [['なまえ', ROW5.name], ['回答', ROW5.pick], ['理由', ROW5.why]].forEach(([t, [y0, y1]]) => tb(p5, t, '700 #px ZenKakuB', [BX5 + 14, (y0 + y1) / 2 - 32, LAB5 - 28, 64], { maxSize: 44, align: 'center', color: PAPER, name: t, sheet: 's5q' }));
  const HAI5 = [560, 575], IIE5 = [1222, 575], OR5 = [118, 72];     // each in the middle of a strip that stays (round 5: the tears moved with her)
  // the labels above their ovals (the ovals moved onto the strips that stay: everyone's black はい is seen all through S5)
  tb(p5, 'はい', '700 #px ShipporiB', [HAI5[0] - 100, HAI5[1] - OR5[1] - 78, 200, 64], { maxSize: 56, align: 'center', color: GRAPHITE, name: 'はい', sheet: 's5q' });
  tb(p5, 'いいえ', '700 #px ShipporiB', [IIE5[0] - 100, IIE5[1] - OR5[1] - 78, 200, 64], { maxSize: 56, align: 'center', color: GRAPHITE, name: 'いいえ', sheet: 's5q' });
  p5.strokeStyle = TEAL; p5.lineWidth = 5; p5.beginPath(); p5.ellipse(IIE5[0], IIE5[1], OR5[0], OR5[1], 0, 0, 7); p5.stroke();
  { // someone's はい: one big solid pencil-black fill, a little over the line all round (the town's way of marking)
    const r = rng(77); p5.save(); p5.beginPath(); p5.ellipse(HAI5[0], HAI5[1], OR5[0] + 6, OR5[1] + 5, -0.03, 0, 7); p5.fillStyle = GRAPHITE; p5.fill();
    p5.clip(); p5.lineCap = 'round'; for (let k = 0; k < 90; k++) { const y = HAI5[1] - OR5[1] + r() * OR5[1] * 2; p5.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.35); p5.lineWidth = 2 + r() * 3;
      p5.beginPath(); p5.moveTo(HAI5[0] - OR5[0] - 10, y); p5.lineTo(HAI5[0] + OR5[0] + 10, y - 30 + r() * 10); p5.stroke(); } p5.restore();
    p5.strokeStyle = TEAL; p5.lineWidth = 5; p5.beginPath(); p5.ellipse(HAI5[0], HAI5[1], OR5[0], OR5[1], 0, 0, 7); p5.stroke(); }
  { p5.save(); p5.font = '600 64px Klee'; p5.fillStyle = PENCIL; p5.textBaseline = 'middle'; p5.translate(BX5 + LAB5 + 50, (ROW5.name[0] + ROW5.name[1]) / 2); p5.rotate(-0.012); p5.fillText('佐藤　みのり', 0, 0); p5.restore(); }
  LAY.text('name', 's5q', [BX5 + LAB5 + 50, 280, 400, 70]);
  // the stack's edge: thirty sheets under the top one, each a little offset, along the right edge and the bottom
  { for (let k = 30; k >= 1; k--) { p5.fillStyle = k % 2 ? rgba(INK_RGB, 0.05) : rgba([255, 255, 255], 0.5); p5.fillRect(W - 44 + k * 1.4, 104, 1.2, 1080); } }
  LAY.audit('seg_12 S5 page');
  // the wall behind: the locker bank (x 270-1650) under its tube, dark station wall left and right, the floor
  const BANK = [270, 1650], FLOOR = 1240;   // the floor is below the frame (waist-up)
  const cells5 = []; { const u = 196, n = Math.floor((BANK[1] - BANK[0]) / u), ox = BANK[0] + ((BANK[1] - BANK[0]) - n * u) / 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < 7; j++) { const x = ox + i * u, y = FLOOR - (7 - j) * u; const tall = i === 5 && j === 4; if (i === 5 && j > 4) continue;
      cells5.push({ x: x + 3, y: y + 3, w: u - 6, h: (tall ? 3 * u : u) - 6, u, n: 1 + i * 9 + j, tall, win: tall ? null : [x + u * 0.3, y + u * 0.24, u * 0.4, u * 0.28] }); } }
  const TALL5 = cells5.find(c => c.tall);
  const [WC5, w5] = mk(W, 1080);
  { w5.fillStyle = GRAPHITE; w5.fillRect(0, 0, W, 1080);
    const r = rng(81); for (let y = 0; y < 1080; y += 7) for (let x = (y / 7 % 2) * 3.5; x < W; x += 7) { w5.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 0.55 + r() * 0.1); w5.beginPath(); w5.arc(x, y, 1.6, 0, 7); w5.fill(); }
    w5.save(); w5.beginPath(); w5.rect(BANK[0], -10, BANK[1] - BANK[0], FLOOR + 10); w5.clip();
    drawLockers(w5, cells5, { x0: BANK[0], y0: -10, x1: BANK[1], y1: FLOOR, line: 2.4, light: [-80, FLOOR + 200] }); openLocker(w5, TALL5, { panel: 0.3, line: 2.4 }); w5.restore();
    w5.fillStyle = rgba(GRAPHITE_DARK_RGB, 1); w5.fillRect(0, FLOOR, W, 1080 - FLOOR);
    const gr = w5.createLinearGradient(0, FLOOR, 0, 1080); gr.addColorStop(0, rgba(INK_RGB, 0.9)); gr.addColorStop(1, rgba(GRAPHITE_DARK_RGB, 1)); w5.fillStyle = gr; w5.fillRect(BANK[0] - 40, FLOOR, BANK[1] - BANK[0] + 80, 1080 - FLOOR);
    w5.strokeStyle = rgba(TEAL_RGB, 0.5); w5.lineWidth = 2; w5.beginPath(); w5.moveTo(0, FLOOR); w5.lineTo(W, FLOOR); w5.stroke(); }
  // her (R12-bust-*, 1536 x 1024, the eyes' midpoint at (715, 365)), eyes on screen y 420 (the bow behind the band).
  // Round 5 (review MUST 1): at 1.25 and centred, shout-b's headstock (drawing x 1440) reached x 1866 and hid う・す・ど of the
  // second white column through the last 8 frames. Her whole span, raised fist (x 183) to headstock (x 1440), now fits between
  // the two columns: scale 1.15, eyes at x 880 (face ~305 px, ~325 at the end of the push); the guitar's neck runs out to the
  // right of her face, which balances the frame. The figure audit below proves no letter is behind a drawing.
  const FS = 1.15, FACE5 = 880, FXo = FACE5 - 715 * FS, FYo = 420 - 365 * FS;
  // 句45 white letters rubbed out of the dark wall: first time left of the bank, second time right of it (symmetric about the
  // frame's centre, each in the middle of its dark wall)
  const COL5 = [[120, L45.slice(0, 8)], [1800, L45.slice(8)]], C5Y = 250, C5SZ = 86;
  COL5.forEach(([x, chars], k) => vertical(chars, x, C5Y, C5SZ, 1.06).forEach((p, i) => LAY.text(`white ${p.c}${k}${i}`, 's5:white', [p.x - p.size * 0.55, p.y - p.size * 0.55, p.size * 1.1, p.size * 1.1])));
  // the strips: between neighbouring tears; each tear's gap opens wedge-shaped from below (the stack is torn from the bottom up)
  const TEARX = [...T5.tears].sort((a, b) => a.x - b.x);
  const tearLine = T5.tears.map(tr => roughLine([tr.x + (rng(tr.seed)() - 0.5) * 16, 1110], [tr.x, TOPY], tr.seed, 9));
  T5.tears.forEach((tr, i) => { tr.line = tearLine[i]; });
  const gap5 = (tr, y, tt) => { if (tt < tr.t) return 0; const o = Math.min(1, ((tt - tr.t) / FR + 1) / 3), f = Math.max(0, (y - TOPY) / (1080 - TOPY)), wide = tr.w > 200;
    const prof = wide ? Math.pow(Math.min(1, (y - TOPY) / 150), 0.7) * (0.84 + 0.16 * f) : Math.min(1, (y - TOPY) / 70) * (0.5 + 0.5 * Math.pow(f, 0.8));
    return o * tr.w * prof * (1 + 0.04 * Math.sin((tt - tr.t) * 30) * Math.exp(-(tt - tr.t) / 0.1)); };
  // strip k lies between edge tear a (left) and b (right); null = the page's own edge
  const STR5 = []; { const xs = [null, ...TEARX, null]; for (let k = 0; k + 1 < xs.length; k++) STR5.push({ k, a: xs[k], b: xs[k + 1] }); }
  // which strips drop when: outer two at k413, the three left of centre at k420, the three right at k421
  STR5.forEach(s => { const cx = ((s.a ? s.a.x : 0) + (s.b ? s.b.x : W)) / 2; s.cx = cx;
    s.drop = !s.a || !s.b ? T5.outer : cx < FACE5 ? T5.dropL : T5.dropR; s.seed = 700 + s.k; });
  const [PL5, pl5] = mk(W, 1080), [SH5] = mk(W, 1080), [ST5, st5] = mk(W, 1080);
  const swayAng = (tt, s) => T5.sway.reduce((a, t0, i) => { const d = tt - t0; if (d < 0) return a; const amp = (i === 1 ? 2 : 3) * Math.PI / 180 * (1 + 0.15 * ((s.k * 7) % 3 - 1));
    // round 11: the stack covers most of the frame, so its sway is one swing out (2 frames) and a slow return without
    // swinging back (it was a 2.5 Hz damped back-and-forth: a shake of most of the frame, 第六节 整屏运动)
    return a + amp * (d < 2 * FR ? -d / (2 * FR) : -Math.exp(-(d - 2 * FR) / 0.22)); }, 0);
  function stripEdge(tr, tt, side) {   // the torn edge of tear tr seen from the strip on its `side` (-1: strip to its left)
    return tr.line.map(([x, y]) => [x + side * gap5(tr, y, tt) / 2, y]);
  }
  function buildPaper5(tt) {
    pl5.setTransform(1, 0, 0, 1, 0, 0); pl5.clearRect(0, 0, W, 1080);
    // the band and question row (until it flips away on k422), drawn last; first the strips
    for (const s of STR5) {
      const da = tt - s.drop; if (da > 5 * FR) continue;
      const L = s.a ? stripEdge(s.a, tt, 1) : [[-60, 1110], [-60, TOPY]], R = s.b ? stripEdge(s.b, tt, -1) : [[W + 60, 1110], [W + 60, TOPY]];
      const poly = [...L.slice().sort((p, q) => q[1] - p[1]).reverse(), ...R.slice().sort((p, q) => p[1] - q[1]).reverse()];
      // a strip is cut free once both its tears have reached the band (it hangs from the band either way)
      // rhythm pass: a drop is a hit, not a fall (it fell 17 px on its beat's frame and took a beat to leave): 110 px on the
      // beat's frame, gone below the frame on the fourth (round 11: the camera no longer dips with it)
      const DROP = [110, 330, 690, 1150], drop = da >= 0 ? (nF(da) < 4 ? DROP[nF(da)] : 1150 + (da - 3 * FR) * 4000) : 0, ang = da >= 0 ? 0 : swayAng(tt, s);
      st5.setTransform(1, 0, 0, 1, 0, 0); st5.clearRect(0, 0, W, 1080);
      st5.save(); st5.translate(s.cx, TOPY + drop); st5.rotate(ang); st5.translate(-s.cx, -TOPY);
      st5.save(); st5.beginPath(); pathPoly(st5, poly); st5.clip(); st5.drawImage(P5, 0, 0); st5.restore();
      if (s.a && tt >= s.a.t) tornEdge(st5, L.filter(p => p[1] > TOPY + 2), s.seed, { side: -1, lip: 1.9, layers: 7, fibres: 1.2 });
      if (s.b && tt >= s.b.t) tornEdge(st5, R.filter(p => p[1] > TOPY + 2), s.seed + 50, { side: 1, lip: 1.9, layers: 7, fibres: 1.2 });
      if (da >= 0) tornEdge(st5, roughLine([s.a ? s.a.x : 0, TOPY], [s.b ? s.b.x : W, TOPY], s.seed + 90, 4), s.seed + 91, { side: -1, lip: 1.2, layers: 5 });
      st5.restore();
      pl5.drawImage(ST5, 0, 0);
    }
    // the band: where the strips hang from; it flips up towards the camera on k422 (4 frames, hinge above the frame)
    const bandA = tt - T5.band;
    const [BD, bd] = mk(W, TOPY + 4); bd.drawImage(P5, 0, 0, W, TOPY + 4, 0, 0, W, TOPY + 4); printSung(bd, L44, Q5QX, Q5Y, Q5S, tt);
    if (tt >= T5.outer) tornEdge(bd, roughLine([0, TOPY], [W, TOPY], 650, 3), 651, { side: 1, lip: 1.2, layers: 5 });
    if (bandA < 0) pl5.drawImage(BD, 0, 0);
    else if (bandA < 5 * FR) {   // rows below the hinge (y = 0) turn towards the camera: y = d cos(ph), z = d sin(ph), projected from the centre
      const ph = Math.PI / 2 * 1.1 * Math.pow(Math.min(1, bandA / (4 * FR)), 1.2), f = 2600, step = 2;
      let y = 0, z = 0;
      for (let d = 0; d < BD.height; d += step) { const y1 = y + Math.cos(ph) * step, z1 = z + Math.sin(ph) * step; if (f - z1 < 300) break;
        const sA = f / (f - z), sB = f / (f - z1), yA = 540 + (y - 540) * sA, yB = 540 + (y1 - 540) * sB, s2 = (sA + sB) / 2;
        pl5.drawImage(BD, 0, d, W, step, 960 - 960 * s2, Math.min(yA, yB), W * s2, Math.max(1, Math.abs(yB - yA) + 0.8));
        y = y1; z = z1; }
    }
    shadowOf(SH5, PL5, { dx: 6, dy: 10, blur: 6, a: 0.45 });
  }
  const camS5 = tt => { const z = SK5.z(tt) + 0.003, v = CAM5.view(z, 960, 540, 0); return [z, v.fx, v.fy]; };
  const CAM5 = createCamera(g, { W, H: 1080, bg: GRAPHITE });
  function drawS5(tt) {
    buildPaper5(tt);
    const R = S.at('rin5', tt);
    CAM5.shoot(camS5(tt), 0, tt, c => {
      c.drawImage(WC5, 0, 0);
      COL5.forEach(([x, chars], k) => vertical(chars, x, C5Y, C5SZ, 1.06).forEach(p => whiteLetter(c, p.c, p.x, p.y, p.size, tt - p.t, 'rubbed')));
      if (R) { const im = IMG[R.file]; c.drawImage(im, FXo, FYo, im.width * FS, im.height * FS); }
      c.drawImage(SH5, 0, 0); c.drawImage(PL5, 0, 0);
    });
  }

  let CARD4_AUDIT = null;
  // =====================================================================================================================
  // frame audits (every text box against the frame as the camera actually shows it) and the score
  // =====================================================================================================================
  LAY.frameCheck('S1 Q1', { sheets: { q1: flat, q1b: flat, q1n: flat, 'q1:print': flat }, views: frameTimes(SEG[0], SEG[0], TQ2).map(t => ({ t, ...CAM.view(...camQ1(t), 0) })) });
  LAY.frameCheck('S2 Q2', { sheets: { q2b: flat, q2h: flat, 'q2:print': flat, 'q2:stamp': flat, 'q2:back': flat }, views: frameTimes(SEG[0], TQ2, T_PI0).map(t => { const { z, dy } = cam2(t); return { t, z, fx: 960, fy: 540 - dy / z }; }) });
  // the pencil words on the folded strips, as the push into the tear and the shout shot carry them: they must be whole or gone
  const s3paper = ([x, y]) => [C1[0] + (x - F[0]) * SP, C1[1] + (y - F[1]) * SP];
  LAY.frameCheck('S3 pencil words on the strips', { sheets: { 'q2:back': s3paper }, views: frameTimes(SEG[0], TS3, TS4).map(t => { const z = zoomS3(t); return { t, z, fx: 960, fy: 540 - dipS3(t) / z }; }) });
  LAY.frameCheck('S3 windows', { sheets: { 's3:windows': flat }, views: frameTimes(SEG[0], TS3, TS4).map(t => ({ t, z: zoomS3(t), fx: 960, fy: 540 - dipS3(t) / zoomS3(t) })) });
  // the band and 問三 (句42, sung by 147.78) only have to be whole until the push starts on k399; 問四 (句43) and the rest all through
  // the band's two lines and 問三, by each frame's actual view through the whole of S4 (until round 10 only TS4 to the punch,
  // so the band sitting half cut after k399 was in no check); the band's lines must be whole in the frame or wholly out of it
  LAY.frameCheck('S4 band and 問三 (all of S4)', { sheets: { s4b: flat, 's4:q3': flat }, views: frameTimes(SEG[0], TS4, TS5).map(t => ({ t, ...CAM4.view(...camS4(t), 0) })) });
  // round 11: the band stays in the frame all through S4 (zoom anchored on the top edge): its lines start at page y 10
  { const rows = frameTimes(SEG[0], TS4, TS5).map(t => { const v = CAM4.view(...camS4(t), 0); return { f: Math.round(t * 30), top: v.fy - 540 / v.z, z: v.z }; });
    const lo = Math.min(...rows.map(r => r.top)), hi = Math.max(...rows.map(r => r.top)), ok = hi < 8;
    console.warn(`S4 TOP EDGE AUDIT seg_12 (all of S4, ${rows.length} frames): ${ok ? 0 : 1} problems; the frame's top edge at page y ${lo.toFixed(1)}-${hi.toFixed(1)} (the band's lines start at 10: whole in every frame); zoom ${Math.min(...rows.map(r => r.z)).toFixed(4)}-${Math.max(...rows.map(r => r.z)).toFixed(4)}`); }
  LAY.frameCheck('S4 数学 page', { sheets: { s4: flat, s4n: flat, 's4:print': flat, 's4:stamp': flat, 's4:card': flat, 's4:cardframe': flat }, views: frameTimes(SEG[0], TS4, TS5).map(t => ({ t, ...CAM4.view(...camS4(t), 0) })) });
  // her card on ring B (round 9): inside panel ③'s rule with paper round it, and its size on the frame and on a 390 px phone
  // (根因清单: 卡至少约 40 px 宽), at the camera's widest and nearest in S4. Round 10: also the paper the card (with its shadow)
  // keeps above the frame's lower edge in every frame of S4 (on screen px, the camera as it moves), and the strap's room
  // under ③'s top rule
  { const inner = [PX4[2] + 2, PT4 + 2, PX4[2] + PW4 - 2, PT4 + PH4 - 2], m = [CARD4S[0] - inner[0], CARD4S[1] - inner[1], inner[2] - (CARD4S[0] + CARD4S[2]), inner[3] - (CARD4S[1] + CARD4S[3])];
    const views = frameTimes(SEG[0], TS4, TS5).map(t => CAM4.view(...camS4(t), 0)), zs = views.map(v => v.z), z0 = Math.min(...zs), z1 = Math.max(...zs);
    const bottom = Math.min(...views.map(v => 1080 - (540 + (CARD4S[1] + CARD4S[3] - v.fy) * v.z)));
    const strapTop = (CHY + (-50 - 1.25) * CHS) - inner[1];
    const ok = Math.min(...m) >= 6 && bottom >= 24 && strapTop >= 6, px = [CARD4[2] * z0, CARD4[2] * z1], ph = px.map(v => v * 390 / 1920);
    console.warn(`CARD AUDIT seg_12 S4 (her card on ring B, her_card.js 'title', ${(CARD4[2] / CARD4[3]).toFixed(3)}:1): ${ok ? 0 : 1} problems [paper inside panel ③'s rule L${m[0].toFixed(0)} T${m[1].toFixed(0)} R${m[2].toFixed(0)} B${m[3].toFixed(0)}; card and shadow to the frame's lower edge, fewest ${bottom.toFixed(1)} screen px over ${views.length} frames; strap ${strapTop.toFixed(1)} px under ③'s top rule]; card ${px[0].toFixed(0)}-${px[1].toFixed(0)} px wide on the frame, ${ph[0].toFixed(1)}-${ph[1].toFixed(1)} px on a 390 px phone`);
    CARD4_AUDIT = { box: CARD4S.map(v => +v.toFixed(1)), margins: m.map(v => +v.toFixed(1)), bottomOnScreen: +bottom.toFixed(1), strapTop: +strapTop.toFixed(1), frameW: px, phoneW: ph, problems: ok ? 0 : 1 }; }
  LAY.frameCheck('S4 her card with its paper margin (24 px inset)', { sheets: { 's4:cardframe': flat }, inset: 24, views: frameTimes(SEG[0], TS4, TS5).map(t => ({ t, ...CAM4.view(...camS4(t), 0) })) });
  // ---- round 10 (card re-review MUST (1), (4)): ③ is 08b's ③ with 08b's numbers, and nothing lies on her card ----
  // SYNC: the numbers of SLIDE and CARD_U are read from seg_08b.js's own source and compared with this page's (根因清单: 说
  // “同一个”的，代码里直接用同一组数; 08b's are inside its page function, so they cannot be imported without changing 08b).
  const SYNC08B = await (async () => {
    try { const src = await (await fetch(new URL('./seg_08b.js', import.meta.url))).text();
      const m = src.match(/const SLIDE = \{ bx: (-?[\d.]+), by: (-?[\d.]+), over: \[([\d.]+), ([\d.]+)\],\s*arrows: cx => (\[[^;]*?\]) \};/);
      if (!m) return { same: false, why: 'SLIDE not found in seg_08b.js' };
      const num = (_, sg, v) => sg === '-' ? '-' + v : v;
      const arrows = JSON.parse(m[5].replace(/cx ([+-]) (\d+(?:\.\d+)?)/g, num).replace(/RY ([+-]) (\d+(?:\.\d+)?)/g, num));
      const theirs = { bx: +m[1], by: +m[2], over: [+m[3], +m[4]], arrows }, cu = +((src.match(/const CARD_U = (\d+)/) || [])[1]);
      return { same: JSON.stringify(theirs) === JSON.stringify(SLIDE) && cu === CARD_U, theirs, cardU: cu };
    } catch (e) { return { same: false, why: String(e) }; } })();
  console.warn(`SYNC 08b SLIDE seg_12 S4 ③ vs seg_08b.js: ${SYNC08B.same ? 'same numbers (SLIDE and CARD_U)' : 'DIFFERENT ' + JSON.stringify(SYNC08B)}`);
  LAY.frameCheck('S5 進路 page and white letters', { sheets: { s5: flat, s5b: flat, 's5:print': flat, 's5:white': flat }, views: frameTimes(SEG[0], TS5, SEG[1]).map(t => ({ t, ...CAM5.view(...camS5(t), 0) })) });
  // figure audits: letters that a drawing stands in front of (S3 windows behind her, S4 page print under her forearms, S5 white
  // letters behind her), each placed exactly as the frame places it
  figureCheck('S3 windows behind her', {
    boxes: FLIPS.map((f, i) => { const [x, y, w, h] = f.cell.win, p0 = s3pt([x, y]), p1 = s3pt([x + w, y + h]); return { name: `window ${f.c}${i}`, box: [p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]], from: f.t }; }),
    // her drawing, and what is left of the page in front of her (the door's root on the left edge, its flicks on each よ), as
    // drawS3 places it: page px = ((x - C1) / SP + F + flick) * RES
    figures: (t, live, pad) => { buildPaper(t, RES); const fa = flickAng(t);
      return [{ name: 'shout', file: t < K(386.5) ? DRAW.shoutA : t < TSB ? DRAW.shoutAB : DRAW.shoutB, x: C1[0] + (RX - F[0]) * SR, y: C1[1] + (RY - F[1]) * SR, s: RS * SR },
              layerFig('the page (torn root)', PL, (x, y) => [((x - C1[0]) / SP + F[0] + fa * 160) * RES, ((y - C1[1]) / SP + F[1]) * RES], live, pad)]; },
    times: frameTimes(SEG[0], TS3, TS4), pad: 4 });
  const s4text = LAY.auditData().boxes.filter(b => b.kind === 'text' && ['s4', 's4n', 's4:print', 's4:stamp', 's4:q3', 's4:card'].includes(b.sheet)).map(b => ({ name: b.name, box: b.box }));
  // the forearms, and the flaps and torn bits drawn over the page with them (the flaps folded back over the print, the ones
  // standing up against the sleeve), drawn as drawS4 draws them
  const [FM4, fm4] = mk(W, 1080);
  figureCheck('S4 page print under her forearms, flaps and torn bits', { boxes: s4text,
    figures: (t, live, pad) => { if (t < T4.punch) return [];
      fm4.setTransform(1, 0, 0, 1, 0, 0); fm4.clearRect(0, 0, W, 1080);
      for (const h of Object.values(HANDS)) { const off = holeOff(h, t); flaps(fm4, h, off, t, 'back'); flaps(fm4, h, off, t, 'up'); }
      drawBits(fm4, BITS4, t - T4.punch, { g: 2600, life: 0.4 });
      return [...Object.values(HANDS).map(h => ({ name: h.file.split('/').pop(), file: h.file, x: h.x0 + pullPx(t) * h.side, y: h.y0, s: HS })),
              layerFig('flaps and torn bits', FM4, (x, y) => [x, y], live, pad)]; },
    times: frameTimes(SEG[0], TS4, TS5) });
  // her drawing, and the paper in front of the white letters (the strips, the dropping halves, the title band flipping away)
  figureCheck('S5 white letters behind her and the strips', {
    boxes: COL5.flatMap(([x, chars], k) => vertical(chars, x, C5Y, C5SZ, 1.06).map((p, i) => ({ name: `white ${p.c}${k}${i}`, box: [p.x - p.size * 0.55, p.y - p.size * 0.55, p.size * 1.1, p.size * 1.1], from: p.t }))),
    figures: (t, live, pad) => { const R = S.at('rin5', t); buildPaper5(t);
      return [...(R ? [{ name: R.file.split('/').pop(), file: R.file, x: FXo, y: FYo, s: FS }] : []), layerFig('the paper (strips, band)', PL5, (x, y) => [x, y], live, pad)]; },
    times: frameTimes(SEG[0], TS5, SEG[1]) });
  // (run after the figure audits: its 178 extra page builds and read-backs change Chrome's canvas state, and S5's figure audit,
  // which measures fibres a few px from a letter, moved by 4 px when it ran after them)
  // CARD COVER AUDIT (as seg_08b.js's): round 9's FIGURE AUDIT only tested her forearms, the flaps and the torn bits against
  // the card's lines, so the rings and the arrow lying on the card were in no check. Three checks:
  // 1. boxes: each element of the figure (strap, D-ring, ring B above the card, ring B in the slot, the two arrows) on a sheet
  //    of its own together with the card face cut in three round the slot column (the only place the ring may meet the card).
  // 2. pixels, the printed figure: the page as printed (P4) against the card drawn alone at the same place; a pixel that
  //    differs where the card face is opaque, outside the slot column, is part of the figure lying on the card.
  // 3. pixels, frame by frame through S4: the page as each frame builds it (the print being sung, the reading frame, the
  //    bulges, the slit, the punched holes) against the card alone, and the layers drawn in front of the page (the forearms,
  //    the flaps, the torn bits) where they are opaque on the card; the forearms' soft shadow is listed apart (a note).
  const cardCover = (() => {
    const boxOv = COVER_BOX_OV;
    const [cx0, cy0, cw0, ch0] = CARD4, [sx0, sy0, sw0, sh0] = CARD4.slot;
    const X0 = Math.floor(cx0) - 2, Y0 = Math.floor(cy0) - 2, RW = Math.ceil(cw0) + 6, RH = Math.ceil(ch0) + 6;
    // the audit's own canvases read back on the CPU (willReadFrequently) and are released afterwards: made as ordinary
    // (accelerated) canvases they pushed Chrome's canvas budget and changed later canvases' anti-aliasing (S5's audit moved)
    const mkR = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d', { willReadFrequently: true })]; };
    const [KC, kx] = mkR(W, 1080); kx.save(); kx.beginPath(); kx.rect(PX4[2] + 2, PT4 + 2, PW4 - 4, PH4 - 4); kx.clip(); chie(kx, CHX, CHY, CHS, 'slide', { only: 'card' }); kx.restore();
    const K = kx.getImageData(X0, Y0, RW, RH).data, region = c => c.getContext('2d').getImageData(X0, Y0, RW, RH).data;
    const px = []; for (let yy = Math.ceil(cy0 + 2); yy < Math.floor(cy0 + ch0 - 2); yy++) for (let xx = Math.ceil(cx0 + 2); xx < Math.floor(cx0 + cw0 - 2); xx++) {
      if (xx >= sx0 - 1 && xx <= sx0 + sw0 + 1 && yy <= sy0 + sh0 + 1) continue;               // the slot column: the ring threads it here
      const p = ((yy - Y0) * RW + (xx - X0)) * 4; if (K[p + 3] >= 250) px.push([p, xx, yy]); }
    const count = (D, test) => { let n = 0, bb = null; for (const [p, xx, yy] of px) if (test(D, p)) { n++; bb = bb ? [Math.min(bb[0], xx), Math.min(bb[1], yy), Math.max(bb[2], xx), Math.max(bb[3], yy)] : [xx, yy, xx, yy]; } return { n, bb }; };
    const differs = (D, p) => D[p + 3] < 250 || Math.max(Math.abs(D[p] - K[p]), Math.abs(D[p + 1] - K[p + 1]), Math.abs(D[p + 2] - K[p + 2])) > 6;
    const printed = count(region(P4), differs);
    const [FC4, fc4] = mkR(W, 1080), [SC4, sc4] = mkR(W, 1080), rows = [];
    for (const t of frameTimes(SEG[0], TS4, TS5)) {
      buildPaper4(t);
      fc4.setTransform(1, 0, 0, 1, 0, 0); fc4.clearRect(0, 0, W, 1080); sc4.setTransform(1, 0, 0, 1, 0, 0); sc4.clearRect(0, 0, W, 1080);
      if (t >= T4.punch) { for (const h of Object.values(HANDS)) { const off = holeOff(h, t); flaps(fc4, h, off, t, 'back'); drawHand(sc4, h, t, 'shadow'); drawHand(fc4, h, t, 'arm'); flaps(fc4, h, off, t, 'up'); }
        drawBits(fc4, BITS4, t - T4.punch, { g: 2600, life: 0.4 }); }
      const page = count(region(PL4), differs), front = count(region(FC4), (D, p) => D[p + 3] > 20), shade = count(region(SC4), (D, p) => D[p + 3] > 25);
      rows.push({ f: Math.round(t * 30), page: page.n, front: front.n, shadow: shade.n, box: page.bb || front.bb });
    }
    KC.width = FC4.width = SC4.width = 0;
    const bad = rows.filter(r => r.page || r.front), shaded = rows.filter(r => r.shadow);
    const problems = boxOv.length + (printed.n ? 1 : 0) + bad.length;
    console.warn(`CARD COVER AUDIT seg_12 S4 (her card vs the rest of panel ③, the slot column excepted; ${px.length} card-face px tested): ${boxOv.length} box overlaps; the printed figure ${printed.n} px on the card${printed.bb ? ' [' + printed.bb + ']' : ''}; ${bad.length} of ${rows.length} frames with something on the card${bad.length ? ': ' + bad.slice(0, 12).map(r => `f${r.f} page ${r.page} front ${r.front} [${r.box}]`).join(', ') : ''}; forearm shadow on the card in ${shaded.length} frames${shaded.length ? ` (most ${Math.max(...shaded.map(r => r.shadow))} px)` : ''}`);
    return { boxOverlaps: boxOv, printedPx: printed.n, frames: rows.length, framesCovered: bad, shadowFrames: shaded.length, sync08b: SYNC08B.same, problems: problems + (SYNC08B.same ? 0 : 1) };
  })();
  // LYRIC AUDIT (2026-11-21, user: 「我们的歌词好像比曲子慢了一点」): every sung character of 句38-45 and the first frame it reads
  // on, found by stepping the frames round its onset through the same gates and progress the drawing uses (printSung and
  // whiteLetter: sungBuild whole; the windows: sungShown and whole; the heavy pencil: the write-on finished and its strip
  // folded down far enough to show its back, theta >= 0.85 pi), and only while its shot is on screen
  const lyricEntries = [];
  { const firstRead = (t, ok) => { for (let g0 = onsetFrame(t) - 3; g0 <= onsetFrame(t) + 15; g0++) if (ok(g0 / 30)) return g0 / 30; return null; };
    const add = (c, t, ok) => lyricEntries.push({ c, t, readT: firstRead(t, ok) });
    const printed = (line, a, b) => line.forEach(([c, t]) => add(c, t, tt => tt >= a && tt < b && sungBuild(tt - t) >= 1));
    printed(L38, SEG[0], TQ2); printed(L39, TQ2, TS3); printed(L42, TS4, TS5); printed(L43, TS4, TS5); printed(L44, TS5, T5.band);
    wordLayout.forEach((ws, i) => ws.forEach(L => add(L.c, L.t, tt => tt >= TQ2 && tt < TS3 && sungSweep(tt, L.t, L.d) >= 1 && (foldTheta(tt, i) ?? 0) >= 0.85 * Math.PI)));
    FLIPS.forEach(f => add(f.c, f.t, tt => tt >= TS3 && tt < TS4 && sungShown(tt, f.t) && sungBuild(tt - f.t) >= 1));
    COL5.forEach(([, chars]) => chars.forEach(([c, t]) => add(c, t, tt => tt >= TS5 && tt < SEG[1] && sungBuild(tt - t) >= 1))); }
  const LYRIC = lyricAudit('seg_12', lyricEntries);
  // MOTION AUDIT (round 11, docs/制作约定.md 第六节「整屏运动」): every frame's view as actually shown. S1, S4, S5 are camera shots
  // (CAM.view); S2 and S3 are drawn as layers (base zoom about the centre, then layerT): their view is the paper layer's (the
  // nearest and largest: in S2 it fills the frame; in S3 nothing moves), i.e. screen = z (a p + T - c) + c + dy, a = 1 + (SP - 1) e.
  // The push into the tear (k382-k383, 11 frames) is the registered whip; S2 -> S3 is continuous (no cut there).
  const MOTION_R = (() => {
    const cuts = [TQ2, TS4, TS5].map(t => Math.ceil((t - SEG[0]) * 30 - 1e-9));
    const views = frameTimes(SEG[0], SEG[0], SEG[1]).map((t, i) => {
      const cut = cuts.includes(i);
      if (t < TQ2) return { t, ...CAM.view(...camQ1(t), 0), cut };
      if (t < TS4) { const c2 = t < TS3 ? cam2(t) : { e: 1, z: zoomS3(t), dy: dipS3(t) }, a = 1 + (SP - 1) * c2.e;
        const Tx = F[0] + (C1[0] - F[0]) * c2.e - F[0] * a, Ty = F[1] + (C1[1] - F[1]) * c2.e - F[1] * a, Z = c2.z * a;
        return { t, z: Z, fx: (960 - Tx) / a, fy: (540 - Ty) / a - c2.dy / Z, cut }; }
      if (t < TS5) return { t, ...CAM4.view(...camS4(t), 0), cut };
      return { t, ...CAM5.view(...camS5(t), 0), cut };
    });
    return motionAudit('seg_12', views, {
      big: [[K(360), 'crash k360 (14.4 dB): 号哭 slams, the cut line cracks; 副歌2 first beat'], [K(421), 'crash k421 (26.6 dB), loudest of the closing tutti: the right half drops']],
      whips: [[K(382), 'push into the tear (S2 -> S3, 11 frames)']] });
  })();
  publishAudit(S, LAY, { motion: MOTION_R, parts: partReport('seg_12'), lyricAudit: { ...LYRIC, entries: lyricEntries.map(e => ({ c: e.c, t: e.t, onsetFrame: onsetFrame(e.t), readFrame: e.readT === null ? null : Math.round(e.readT * 30) })) }, segment12: 'design a, finished (round 11: whole-frame motion, parts.js)', figureAudit: FIG, cardS4: CARD4_AUDIT, cardCoverS4: cardCover });

  // =====================================================================================================================
  // the flash (rhythm pass): paper white over the whole frame, after the shot is drawn
  const FLASHES = [SK1, SK4, SK5];
  window.renderAt = async t => {
    drawFrame(t);
    const fl = Math.max(...FLASHES.map(k => k.flash(t)));
    if (fl > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = rgba(PAPER_RGB, fl); g.fillRect(0, 0, W, 1080); }
  };
  function drawFrame(t) {
    const tt = t;
    if (tt < TQ2) {
      buildPaperQ1(tt);
      CAM.shoot(camQ1(tt), 0, tt, c => {
        c.save(); c.translate(V1.fx, V1.fy); c.scale(1 / V1.z, 1 / V1.z); c.translate(-960, -540);
        if (tt >= T_KAN) { drawWall(c); her(c, DRAW.cold); }
        c.restore();
        c.drawImage(SH1, 0, 0); c.drawImage(PL1, 0, 0);
      });
      return;
    }
    if (tt < TS3) {
      const { e, z, dy } = cam2(tt), base = () => g.setTransform(z, 0, 0, z, 960 - 960 * z, 540 - 540 * z + dy);
      buildPaper(tt, RES);
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = GRAPHITE; g.fillRect(0, 0, W, 1080);
      base(); g.save(); layerT(g, e, SWL); drawWall(g); g.restore();
      base(); g.save(); layerT(g, e, SR); her(g, DRAW.cold); g.restore();
      base(); g.save(); layerT(g, e, SP); g.drawImage(SH, 0, 0, W, 1080); g.drawImage(PL, 0, 0, W, 1080); g.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      return;
    }
    if (tt < TS4) { buildPaper(tt, RES); drawS3(tt); return; }
    if (tt < TS5) { drawS4(tt); return; }
    drawS5(tt);
  }

  await window.renderAt(P('t0', SEG[0]));
}
