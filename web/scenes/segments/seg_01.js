// Segment 01: the intro riff, first half (k8-k36, 3.281-13.651 s, global frames [98, 410)). docs/分镜/01_前奏riff前半.md
// (design 甲; second version after the independent review, written at the end of that file, "评审后改定（第 2 版）").
// The rule of the film in ten seconds: on the platform of 南台 the town reads everyone's card every morning; hers cannot be read.
//
// One shot, the camera at eye level across the empty A line, long lens. It cuts in already trucking right on a wider framing
// (0.9 of the close scale) that shows the platform and the row, and closes in on her as the reading comes towards her:
//   k8-k23   one person a bar, one beat a stroke of the print head (① name ② number ③ deviation ④ こころ): p1, p3, p6, p9.
//            Every beat the person being read is printed one shade darker (a teal halftone over the whole figure) while a solid
//            black band is printed in one field of their card; on the fourth beat the こころ row is printed (the card fully
//            printed, still a paper card: docs/卡面状態.md 第四节) and the person is fully printed. The row goes dark from the left, one person a bar, towards the only colour in the frame. Her bag is at the
//            right edge from k8 and she is in frame (face, hair, most of her body) from k12; the frame tightens on her
//            (0.9 -> 1.45) as the dark comes nearer.
//   k24      the cymbal: the camera stops dead on her and pushes in 2.8 % in three frames, one way (the 大击); the machine slams
//            「読み取れません」 out of her card in letters far larger than the card, double struck, ink spattered round them;
//            her card is reprinted in its name field and knocked hard (down, twisted round, swinging). The only physical hit.
//   k25      the print will not take: the big letters crumble off her and fall out of the frame, left to right, while the machine
//            skips her and prints the child on the next mother's arm whole in one sweep; k26 the mother.
//            The frame now reads dark, COLOUR, dark, dark.
//   k26-k35  an empty 「回送」 car creeps through on the B line behind them, dark body and paper-white windows: a window post
//            passes behind her head on every beat from k29. A slow push-in from k27 to k36; the kicks jump the cards.
//   k31.5    in-between, k32 she turns her head to follow the car (r01_side -> r01_turn -> r01_follow2). She never looks at us.
// Rhythm pass (2026-11-21) took the truck in beat steps with snare zoom kicks and dips; the third pass (2026-11-21, the user
// after the second cut: 「你为什么要一直抖动屏幕？……看着很晕啊」, docs/制作约定.md 第六节「整屏运动」) took all of that out again:
// one even truck k8-k24, one 大击 on k24 (the stop and a one-way push-in, no dip), one slow push k27-k36. The rhythm is in the
// frame: the print on every beat, the printed cards jumping on their lanyards (k28/30/32), every card jumping (k33/34/35).
// Archive of the rhythm-pass page: work/seg/01/seg_01_before_r3.js. See the camera section.
// Space: an island platform. Layers, each with its own scale (fs) and parallax (fp): the town (fs 0.03, fp 2/15), the fence beyond
// the B line (4/15), the 回送 car on the B line (2/5), the pillars, benches and plates on the platform's centre line (3/5), the
// people (1), the canopy's edge (0.95).
// Card unification (2026-11-21, docs/卡面状態.md): her card is drawn only by web/lib/her_card.js: 'first' (00 k0's fine print,
// grid at full strength) until k24, then 'band' (01 k24's thick reprint, left-aligned in the name field, 第二节) swept in.
// The passers-by's read cards stay paper (第四节: a row of black tiles on people looking down read as phones): every band is
// printed inside its field, the number and deviation fields as one solid stripe per row with paper between the rows, and
// there is no whole-card flip to black; the paper rim, header, label column, timing marks and the clip always show.
// The halftones (the print screen and the people's print tone) are prefiltered at the scale they are shown (seg_03.js
// screen()): the tone's 32 px tile was minified ~6x and crawled in the push-in (moire, 3 grey levels a frame at 1/8 res).
import { drawCard, CARD_RATIO } from '../../lib/card.js';
import { herCardFace, herCardBoxes } from '../../lib/her_card.js';
import { BEAT, FRAME, beatV, smooth, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { move, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, endsAudit, PIX, partReport } from '../../lib/parts.js';
import { dots16 } from '../../lib/print.js';
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, INK_RGB, CARD_SHADOW, rgba } from '../../lib/palette.js';

export default async function seg01(H) {
  const { g, W, P, rng, img, rinPalImage, inkjetText } = H;
  const F0 = 98, F1 = 410, FPS = 30, T0 = F0 / FPS, T1 = F1 / FPS;
  const S = createScore('seg_01', { t0: T0, t1: T1 });
  const LAY = createLayout();
  const K = beatV;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };

  // ---------------- the people plane ----------------
  // the drawings' own scale: every drawing is a 1024 x 1536 canvas showing 1.75 m (2.00 m down to 0.25 m above the floor)
  const PPC = 1536 / 175;                      // world px per cm on the people plane (8.78); the camera shows it at z
  const ZS = 1.45;                             // the close scale (from k24): 12.73 screen px per cm, a 15 cm card 191 px wide
  const Z0 = 0.9;                              // the cut-in scale (k8): the platform and five people
  const HC = 134.4;                            // the frame's vertical centre (cm)
  const YH = 0;                                // world y of eye level (1.4 m)
  const yOf = (hcm, fs = 1) => YH - (hcm - 140) * PPC * fs;   // world y of a height on a layer of scale fs
  const FY = yOf(HC);

  // the drawings (art/cut/), each measured: H = real height (cm), top = the head's top row (hair, not the bow or the bag),
  // cx = the body's centre column. The lanyard ends (where each drawn strand stops and the code's cord to the card begins)
  // are measured on EACH drawing, in that drawing's own px, in art/cut/seg01_parts.json (parts.js; work/seg/01/parts/):
  // her three drawings (r01_side, r01_turn, r01_follow2) each have their own, no drawing borrows another's (根因清单
  // 「笔芯和笔不对了……」 2026-11-21)
  const FIG = {
    p1: { file: '/art/cut/t01_p1c.png', H: 172, top: 243, cx: 510, name: '佐藤　健太', id: '3172', dev: '49' },
    p3: { file: '/art/cut/t01_p3.png', H: 160, top: 378, cx: 512, name: '高橋　正男', id: '1043', dev: '51' },
    p6: { file: '/art/cut/t01_p6.png', H: 160, top: 322, cx: 508, name: '山本　さくら', id: '5208', dev: '55' },
    // p9: the lanyard is not drawn (only the hoodie's strings); it comes out from under the hood at the neck (seg01_parts.json)
    p9: { file: '/art/cut/t01_p9.png', H: 183, top: 150, cx: 511, drop: 9, name: '吉田　蓮', id: '6630', dev: '53' },
    rin: { file: '/art/cut/r01_side.png', H: 152, top: 407, cx: 535, her: true },
    // the child sits on the mother's right arm (left in the picture): KID is his outline in the drawing (px), so the two can be
    // printed on different beats
    p7: { file: '/art/cut/t01_p7.png', H: 162, top: 307, cx: 515, name: '小林　由美', id: '2614', dev: '50',
          kid: { name: '小林　そうた', id: '0003', dev: '00' },
          KID: [[175, 520], [425, 520], [425, 600], [405, 700], [450, 800], [452, 1135], [175, 1135]] },
    p8: { file: '/art/cut/t01_p8.png', H: 168, top: 310, cx: 512, name: '加藤　大輔', id: '7781', dev: '47' },
  };
  const TURN = '/art/cut/r01_turn.png', FOLLOW = '/art/cut/r01_follow2.png';
  const BOTTOM = 25;                                    // the drawings' bottom edge is 0.25 m above the floor
  const T_HIT = K(24), T_TURN_IN = K(31.5), T_TURN = K(32);
  for (const [k, f] of Object.entries(FIG)) {
    f.key = k; f.im = await img(f.file);
    if (f.her) { f.im = rinPalImage(f.im); f.imT = rinPalImage(await img(TURN)); f.imF = rinPalImage(await img(FOLLOW)); }
    f.cmpp = (f.H - BOTTOM) / (1536 - f.top);           // cm per drawing px, from its real height
  }
  // the row, left to right (cm on the people plane). Each neighbour stands 1 cm further than where their outlines would first
  // touch (measured from the drawings' alpha at every height), so the row is shoulder to shoulder without anyone in front of
  // anyone. The mother and child stand right of her: the machine skips her and reads the child, then the mother.
  const ROW = [['p1', 0], ['p3', 59], ['p6', 108.2], ['p9', 162.8], ['rin', 224.7], ['p7', 275.6], ['p8', 334.8]];
  for (const [k, x] of ROW) FIG[k].x = x;
  // a person's drawing placed: ONE transform per person, drawing px -> (cm, -cm) on the people plane (parts.js placement);
  // the drawing and its lanyard ends both go through it, nothing adds an offset to a part afterwards
  for (const f of Object.values(FIG)) f.P = placement({ x: f.x - f.cx * f.cmpp, y: -(BOTTOM + 1536 * f.cmpp), s: f.cmpp });
  const toCm = (f, p) => f.P.toWorld(p);
  // the drawing on screen at t and its name in the anchor file (her three drawings are from one master, placed the same)
  const DRAWING = { p1: 't01_p1c', p3: 't01_p3', p6: 't01_p6', p9: 't01_p9', p7: 't01_p7', p8: 't01_p8' };
  const drawingOf = (f, t) => f.her ? (t >= T_TURN ? 'r01_follow2' : t >= T_TURN_IN ? 'r01_turn' : 'r01_side') : DRAWING[f.key];
  const PA = await loadPartAnchors('/art/cut/seg01_parts.json');
  const lanEnds = (f, t, part = 'lan') => partOf(PA, drawingOf(f, t), part).ends.map(p => toCm(f, p));
  // her card's position for the framing (the camera's stop, the big print) is her card on r01_side, the drawing she wears
  // when the camera stops on her (k24); the cord itself is drawn from whichever drawing is on screen
  const cardX = f => { const [[x1], [x2]] = lanEnds(f, 0); return (x1 + x2) / 2; };   // cm

  // ---------------- the cards ----------------
  // each card drawn once by the film's card printer (blank), plus its printed layers. A band is solid 16-dot ink inside one
  // field of the card, the dots run together so it reads as solid black: ① the name field right of its label (the name knocked
  // out in paper white), ② the student number (one stripe per row, 4 rows), ③ the deviation value (2 rows), ④ the こころ row
  // (ink run past the oval). The stripes leave paper between the rows and the printed card keeps its paper rim, header, label
  // column, timing marks and clip: on a phone a read card is a paper card striped with black, never a black tile
  // (docs/卡面状態.md 第四节). Each layer is swept in left to right over 3 frames.
  // Her card is her_card.js's ('first' before k24, 'band' swept in on k24).
  const CU = 600;                                       // card canvas width (px); drawn at 15 cm
  const CARD_W = 15;
  function inkBand(s, [x, y, w, h], R, { pitch = CU * 0.0068, blot = null, gap = 0.12 } = {}) {
    s.fillStyle = rgba(INK_RGB, 0.98);
    for (let yy = y; yy <= y + h; yy += pitch) for (let xx = x; xx <= x + w; xx += pitch) {
      const edge = Math.min(xx - x, x + w - xx, yy - y, y + h - yy) < pitch * 1.2;
      if (edge && R() < gap) continue;
      s.beginPath(); s.arc(xx + (R() - 0.5) * pitch * 0.2, yy + (R() - 0.5) * pitch * 0.2, pitch * (0.86 + R() * 0.08) * (edge ? 0.9 : 1), 0, 7); s.fill();
    }
    if (blot) {                                         // ink run past the こころ oval
      const [bx, by, br] = blot;
      for (let k = 0; k < 900; k++) { const a = R() * 7, r = br * Math.sqrt(R()); const xx = bx + Math.cos(a) * r * 1.5, yy = by + Math.sin(a) * r;
        s.beginPath(); s.arc(xx, yy, pitch * (0.6 + R() * 0.2), 0, 7); s.fill(); }
    }
  }
  function nameOut(s, name, r, u, seed) {               // the name knocked out of a band in paper-white 16-dot letters
    const k = (r[3] * 0.6) / 16, D = dots16(name, k, seed + 1, PAPER_RGB);
    s.drawImage(D.c, D.x0, D.y0, D.w, D.h, r[0] + u * 0.025, r[1] + (r[3] - D.h) / 2, D.w, D.h);
  }
  function makeCard(f, { serial, seed, w = CU } = {}) {
    const u = w, hh = w / CARD_RATIO;
    if (f.her) {
      // her card: her_card.js, the film's one card (docs/卡面状態.md). Until k24 the face 00 k0 printed ('first': the fine
      // 読み取れません, grid at full strength); on k24 the machine reprints it as the thick band, left-aligned inside the name
      // field right of the 氏名 label (第二节: ink x 0.147-0.929u, y 0.08-0.202u), swept in left to right over 3 frames.
      const base = herCardFace(u, { state: 'first' }), hit = herCardFace(u, { state: 'band' });
      // the layout audit: the band against the card's own preprinted labels (氏名, 学籍番号, 偏差値, こころ, header, No.)
      const bx = herCardBoxes(u, { state: 'band' });
      for (const [name, b] of Object.entries(bx.lines)) LAY.text(`her card: ${name} (k24 band)`, 'card:print', b);
      for (const [name, b] of Object.entries(bx.labels)) LAY.text(`her card label: ${name}`, 'card:print', b);
      LAY.reg('her card', 'card', [0, 0, u, hh]);
      return { base, bands: [], rects: [], hit, w };
    }
    const [c] = mk(w, hh);
    const L = drawCard(c, { blank: true, heart: 'empty', serial, seed });
    const R = rng(seed * 7 + 3);
    const [nx, ny, nw, nh] = L.nameBox;
    // the printed fields: right of the label column, short of the right-hand corner marks; one stripe per answer row (the row's
    // ovals, 0.028u tall) with the paper between the rows showing
    const X0 = u * 0.205, XW = u * 0.7, SH = u * 0.028;
    const stripe = i => [X0, L.rowY(i) - SH / 2, XW, SH];
    const parts = [
      [[nx + u * 0.08, ny + u * 0.006, nw - u * 0.1, nh - u * 0.012]],
      [0, 1, 2, 3].map(stripe),
      [4, 5].map(stripe),
      [[X0, L.heart[1] - SH * 0.6, XW, SH * 1.2]],
    ];
    const rects = parts.map(ps => { const x0 = Math.min(...ps.map(r => r[0])), y0 = Math.min(...ps.map(r => r[1]));
      return [x0, y0, Math.max(...ps.map(r => r[0] + r[2])) - x0, Math.max(...ps.map(r => r[1] + r[3])) - y0]; });
    const bands = parts.map((ps, i) => {
      const [b, s] = mk(w, hh);
      ps.forEach(r => inkBand(s, r, R, { pitch: u * 0.0068, blot: i === 3 ? [L.heart[0], L.heart[1], L.rx * 1.5] : null }));
      if (i === 0 && f.name) nameOut(s, f.name, ps[0], u, seed);
      return b;
    });
    return { base: c, bands, rects, hit: null, w };
  }
  let seed = 40;
  for (const f of Object.values(FIG)) {
    f.card = makeCard(f, { serial: `2026-${f.id ?? '0314'}`, seed: seed += 3 });
    if (f.kid) f.kid.card = makeCard(f.kid, { serial: `2026-${f.kid.id}`, seed: seed += 3 });
  }
  LAY.audit('seg_01 her card');

  // ---------------- the timeline ----------------
  // a print sweep: over 60 % on the beat frame, whole on the next (rhythm pass 2026-11-21: was 1/3, 2/3, whole, and the
  // field filling read as a slow wipe, not a hit on the beat)
  const sweep = age => age < 0 ? 0 : Math.min(1, (age / FRAME + 1) / 1.6);
  const PR = {};                                         // per card: the time each band is printed
  const T_FALL = K(25), T_TRAIN = K(26), T_PUSH = K(27);
  S.ev('cut in (from 00), already trucking', K(8));
  [['p1', 8], ['p3', 12], ['p6', 16], ['p9', 20]].forEach(([k, b]) => {
    PR[k] = [0, 1, 2, 3].map(j => K(b + j));
    PR[k].forEach((t, j) => S.ev(`read ${k}: band ${j + 1} + one shade darker${j === 3 ? ' (the こころ band: card fully printed, still paper)' : ''}`, t));
  });
  PR.p7kid = Array(4).fill(K(25)); PR.p7 = Array(4).fill(K(26)); PR.p8 = Array(4).fill(K(27));
  S.ev('camera stops dead on her (cymbal)', T_HIT);
  S.ev('big 読み取れません slammed out of her card; card reprinted and knocked', T_HIT);
  S.ev('the big print crumbles off her and falls; skipped: the child read (whole)', T_FALL);
  S.ev('the mother read (whole)', K(26));
  S.ev('p8 read (whole, off frame right; for 02)', K(27));
  S.ev('回送 car: nose in at the left edge', T_TRAIN);
  S.ev('回送 car: nose passes behind her head', K(28));
  S.ev('回送 car: the cab seam behind her head', K(29));
  for (let b = 30; b <= 35; b++) S.ev(`回送 car: window post behind her head`, K(b));
  // the camera (third pass 2026-11-21, see the camera below): one even truck k8-k24, the 大击 on k24, one slow push k27-k36
  move(S, 'truck', K(8), T_HIT);
  S.ev('camera: the truck stops dead on her, 2.8% push-in one way (大击, cymbal)', T_HIT);
  move(S, 'slow push-in to her face', T_PUSH, K(36));
  for (const b of [28, 30, 32]) S.ev('the printed cards jump on their lanyards (kick)', K(b));
  for (const b of [33, 34, 35]) S.ev('every card jumps on its lanyard (heavy kick)', K(b));
  for (const [k] of ROW) if (k !== 'rin') for (const t of new Set(PR[k] ?? [])) S.mark(`${k}'s card jumps on its lanyard (printed)`, t);
  // the drawings on screen (HOLD AUDIT, reuse table)
  S.hold('shot', 'platform', T0, T1, { kind: 'shot', onBeat: false });
  for (const [k] of ROW) if (k !== 'rin') S.hold(k, FIG[k].file.split('/').pop().replace('.png', ''), T0, T1, { file: FIG[k].file, onBeat: false });
  S.hold('rin', 'r01_side', T0, T_TURN_IN, { file: FIG.rin.file, onBeat: false });
  S.hold('rin', 'r01_turn', T_TURN_IN, T_TURN, { kind: 'inbetween', file: TURN });
  S.hold('rin', 'r01_follow2', T_TURN, T1, { file: FOLLOW });

  // ---------------- the camera ----------------
  // cx: world px (people plane) at the frame's centre; z: the scale. The path k8 -> k24: the frame trucks right and closes in
  // (z 0.9 -> 1.45 on a log scale), its centre on a Hermite curve from 63.5 cm to the stop at k24 with her card at screen
  // x 1000. The curve is set so that p1's card is in frame through k11 and she is in frame from k12, and every card being read
  // stays in frame.
  // Rhythm pass (2026-11-21, user: "这是一首摇滚乐 我希望我的的切分镜啊 什么动态效果啊……就是希望视频跟歌曲节奏一致";
  // work/rhythm_diag): the path is no longer one glide but taken in steps, one a beat, as the riff hits. Each step starts on
  // the beat frame (the first frame at or after the beat) with over half of it done there, lands on the third frame with a
  // 6 % overshoot and the camera is dead still until the next beat. The bar lines k8/k12/k16/k20 take the big step (1.8 : 0.8
  // : 0.8 : 0.8 of the bar's travel); k24, the cymbal, is the stop (a hair past on its second frame, dead on the third). The
  // snare hits k17/19/21/23 add a 2 % zoom kick. On k24 a 3.4 % kick and a vertical dip (down 12 px in two frames, back in
  // five; the old random shake is gone). k25-k32 the camera holds its framing (the 回送 car moves behind), but the riff is
  // answered on every beat from k27: the snares k27/29/31 the same 2 % kick, the kicks k28/30/32 a dip (6, 5, 7 px) with the
  // printed cards jumping (review 2026-11-21: 2 s with no answer read as the rhythm dropping out). The three heavy kicks k33/34/35
  // take the push-in to her face in three steps, each with a dip (8, 10, 12 px) and every card jumping on its lanyard. The
  // push ends at the same 1.5x as before (the drawings are shown at 1.5x their own pixels at most), so 02's first frame
  // still continues 01's last exactly.
  const X8 = 63.5, V0 = 260, V1 = 60;                    // cm, cm per unit of the move
  // the framing's reference (not a part): column 583 of r01_side, the middle of her card as the stop has been framed since
  // the first cut, so 02's first frame still continues 01's last exactly
  const X24 = toCm(FIG.rin, [583, 0])[0] - 40 / (PPC * ZS);
  const herm = u => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * X8 + (u3 - 2 * u2 + u) * V0 + (-2 * u3 + 3 * u2) * X24 + (u3 - u2) * V1; };
  const CX_STOP = X24 * PPC;
  const faceCm = toCm(FIG.rin, [620, 560]);              // her face in the drawing (px) -> cm: the push-in's anchor
  const ANCHOR = [960 + (faceCm[0] * PPC - CX_STOP) * ZS, 540 + (yOf(-faceCm[1]) - FY) * ZS];
  const PUSH = 1.5 / 1.45 - 1;                           // to 1.5x at k36 (the drawings shown at 1.5x their own pixels at most)
  // Third pass (2026-11-21, the user after the second cut: 「你为什么要一直抖动屏幕？节奏感确实有 但是看着很晕啊」「不是完全不能晃
  // 但是不能晕」; docs/制作约定.md 第六节「整屏运动」): the beat steps k8-k23, the snare zoom kicks k17-k31 and every dip are
  // gone. k8-k24 is one even truck again (the old glide: its progress even in time, M0 = M1 = 1); the beat is in the frame:
  // every beat the person being read is printed one shade darker, a band is printed on their card and the card jumps on its
  // lanyard. k24, the cymbal, is the segment's one 大击: the truck stops dead on her and the frame pushes in HIT_PUSH in
  // three frames, one way, and stays there (no dip, nothing comes back). k27-k36 one slow push to the same 1.5x as before
  // (02's first frame continues 01's last); the kicks k28/30/32 jump the printed cards and the heavy kicks k33/34/35 every
  // card, in the frame (the frame itself does not move on them). MOTION AUDIT below checks it frame by frame.
  const NB = k => Math.ceil(K(k) * FPS - 1e-9);          // the beat frame of beat k
  const M0 = 1, M1 = 1;                                  // the truck's speed at k8 and at k24 (x the average): even
  const uOf = t => { const s = (t - K(8)) / (T_HIT - K(8)); if (s <= 0) return M0 * s; if (s >= 1) return 1;
    const s2 = s * s, s3 = s2 * s; return (s3 - 2 * s2 + s) * M0 + (-2 * s3 + 3 * s2) + (s3 - s2) * M1; };
  const HIT_PUSH = 0.028, HIT = [0.62, 0.97, 1];         // k24: a 2.8 % push-in, over half on the beat frame, one way
  const PUSH2 = (1 + PUSH) / (1 + HIT_PUSH) - 1;         // the rest of the way to 1.5x, k27-k36
  const prog = (n, k, shape) => { const i = n - NB(k); return i < 0 ? 0 : i < shape.length ? shape[i] : 1; };
  function camAt(t) {
    const n = Math.round(t * FPS), u = n >= NB(24) ? 1 : uOf(n / FPS);
    const cx = herm(u) * PPC, z = Z0 * Math.pow(ZS / Z0, Math.min(1, Math.max(0, u)) ** 2);
    const sc = (1 + HIT_PUSH * prog(n, 24, HIT)) * (1 + PUSH2 * smooth((t - T_PUSH) / (K(36) - T_PUSH)));
    return { cx, over: 0, fy: FY, z, sc, dx: 0, dy: 0 };
  }

  // ---------------- drawing helpers: layers in (X cm, -h cm) ----------------
  // a layer's transform: x_screen = 960 + (X*PPC*fs - cx*fp)*z, y_screen = 540 + (yOf(h, fs) - fy)*z; the people plane's
  // offset is rounded to whole pixels
  let VIEW = null;
  function layer(ctx, fs, fp) {
    const { cx, fy, z, over, sc, dx, dy } = VIEW, a = PPC * fs * z;
    const e = Math.round(960 - (cx + over) * fp * z), f = 540 + (YH + 140 * PPC * fs - fy) * z;
    const [ax, ay] = ANCHOR;
    ctx.setTransform(a * sc, 0, 0, a * sc, e * sc + ax * (1 - sc) + dx, f * sc + ay * (1 - sc) + dy);
    return 1 / (a * sc);
  }
  // A prefiltered halftone tile (seg_03.js screen(), review 2026-11-21): N x N cells of a 45-degree dot grid (a dot at each
  // cell's corners and centre), drawn at the device size it is shown at (tpx px, supersampled 4x and box-filtered), so the
  // canvas pattern is sampled about 1:1 and each dot's ink is conserved at every zoom. Canvas patterns are sampled without
  // prefiltering: the old tiles (the tone's 32 px cell shown at 4-7 px) crawled as the camera moved.
  const DOT_TILES = new Map();
  function dotTile(cover, rgbA, alpha, tpx, N) {
    const key = `${cover}|${alpha}|${rgbA}|${tpx}|${N}`; let c = DOT_TILES.get(key); if (c) return c;
    const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI / 2), [, bx] = mk(B, B);
    bx.fillStyle = '#000';
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) for (const o of [0, 0.5]) { bx.beginPath(); bx.arc((i + o) * cell, (j + o) * cell, r, 0, 7); bx.fill(); }
    const src = bx.getImageData(0, 0, B, B).data, [tc, tx] = mk(tpx, tpx), out = tx.createImageData(tpx, tpx), [R0, G0, B0] = rgbA;
    for (let y = 0; y < tpx; y++) for (let xx = 0; xx < tpx; xx++) {
      let a = 0; for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) a += src[((y * SS + sy) * B + xx * SS + sx) * 4 + 3];
      const o = (y * tpx + xx) * 4; out.data[o] = R0; out.data[o + 1] = G0; out.data[o + 2] = B0; out.data[o + 3] = Math.round(alpha * a / (SS * SS));
    }
    tx.putImageData(out, 0, 0); DOT_TILES.set(key, tc); return tc;
  }
  // the pattern for a dot pitch of pitchDev device px, in the user space of ctx (no rotation in this page's transforms)
  function dotsAt(ctx, cover, rgbA, alpha, pitchDev) {
    const dev = Math.hypot(ctx.getTransform().a, ctx.getTransform().b), N = 12, tpx = Math.max(12, Math.round(N * pitchDev));
    const pat = ctx.createPattern(dotTile(cover, rgbA, alpha, tpx, N), 'repeat'), s = N * pitchDev / tpx / dev;
    pat.setTransform(new DOMMatrix([s, 0, 0, s, 0, 0]));
    return pat;
  }
  // the print screen: round teal dots on a 45-degree grid, 4 px pitch on screen at scale 1 (4 z px), anchored to the layer
  const dotPattern = (ctx, cover, rgbA = TEAL_RGB, alpha = 1) => dotsAt(ctx, cover, rgbA, alpha, 4 * VIEW.z);
  const line = (ctx, px, a = 1) => { const m = ctx.getTransform(); ctx.lineWidth = px / m.a; ctx.strokeStyle = rgba(TEAL_RGB, a); };

  // ---------------- the town far behind (fs 0.03, fp 2/15): a low skyline ----------------
  const TOWN_FS = 0.03, TOWN_FP = 2 / 15;
  const R0 = rng(5);
  const TOWN = [];
  for (let X = -30000; X < 80000;) {
    const r = R0(), kind = r < 0.1 ? 'flat' : r < 0.14 ? 'school' : 'house';
    const w = kind === 'flat' ? 2400 + R0() * 1200 : kind === 'school' ? 4200 : 700 + R0() * 700;
    const h = kind === 'flat' ? 1100 + R0() * 300 : kind === 'school' ? 1250 : 550 + R0() * 200;
    TOWN.push({ X, w, h, kind, roof: 150 + R0() * 120, r: R0() }); X += w + 100 + R0() * 400;
  }
  const POLES = []; for (let X = -30000; X < 80000; X += 2800 + R0() * 800) POLES.push(X);
  function drawTown(ctx) {
    layer(ctx, TOWN_FS, TOWN_FP); const GROUND = -150;
    for (const b of TOWN) {
      const { X, w, h, kind, roof } = b;
      ctx.fillStyle = PAPER; ctx.fillRect(X, -h, w, h + GROUND);
      if (kind === 'house') {
        ctx.beginPath(); ctx.moveTo(X - 60, -h + 10); ctx.lineTo(X + w / 2, -h - roof); ctx.lineTo(X + w + 60, -h + 10); ctx.closePath();
        ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = dotPattern(ctx, b.r < 0.5 ? 0.42 : 0.26); ctx.fill(); line(ctx, 1.1, 0.5); ctx.stroke();
      } else {
        ctx.fillStyle = dotPattern(ctx, 0.3); ctx.fillRect(X - 30, -h - 40, w + 60, 50); line(ctx, 1.1, 0.5); ctx.strokeRect(X - 30, -h - 40, w + 60, 50);
      }
      line(ctx, 1.1, 0.5); ctx.strokeRect(X, -h, w, h + GROUND);
      const rows = kind === 'house' ? 2 : Math.floor(h / 300), cols = Math.max(1, Math.floor(w / (kind === 'house' ? 320 : 240)));
      for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
        const wx = X + (c + 0.5) * w / cols - 60, wy = -h + 100 + rr * (h - 120) / rows;
        if (wy + 110 > GROUND - 30) continue;
        ctx.fillStyle = rgba(TEAL_RGB, kind === 'house' ? 0.22 : 0.14); ctx.fillRect(wx, wy, 120, 100);
      }
    }
    line(ctx, 1.2, 0.55);
    for (const X of POLES) { ctx.beginPath(); ctx.moveTo(X, GROUND); ctx.lineTo(X, -1100); ctx.moveTo(X - 140, -1020); ctx.lineTo(X + 140, -1020); ctx.stroke(); }
    line(ctx, 0.8, 0.4);
    for (let i = 0; i + 1 < POLES.length; i++) for (const sx of [-140, 140]) {
      const a = POLES[i] + sx, b = POLES[i + 1] + sx; ctx.beginPath(); ctx.moveTo(a, -1020); ctx.quadraticCurveTo((a + b) / 2, -880, b, -1020); ctx.stroke();
    }
    ctx.fillStyle = dotPattern(ctx, 0.12); ctx.fillRect(-60000, GROUND, 200000, 3000);
  }

  // ---------------- beyond the B line: the trackside fence (fs = fp = 4/15) ----------------
  const FN = 4 / 15;
  function drawFence(ctx) {
    layer(ctx, FN, FN);
    ctx.fillStyle = PAPER; ctx.fillRect(-20000, -10, 60000, 400);
    ctx.fillStyle = dotPattern(ctx, 0.12); ctx.fillRect(-20000, -10, 60000, 120);
    line(ctx, 1.2, 0.5); ctx.beginPath(); ctx.moveTo(-20000, -10); ctx.lineTo(40000, -10); ctx.stroke();
    for (let X = -20000; X < 40000; X += 200) { ctx.beginPath(); ctx.moveTo(X, -10); ctx.lineTo(X, 110); ctx.stroke(); }
    ctx.fillStyle = dotPattern(ctx, 0.3); ctx.fillRect(-20000, 110, 60000, 300);
  }

  // ---------------- the 回送 car on the B line (fs = fp = 2/5) ----------------
  // a 17 m commuter car side-on, creeping through the station empty. Its side is a run of equal modules with a window post
  // between every two; the car moves one module a beat. The nose comes in at the left edge on k26 and is behind her head on k28;
  // the cab is two modules long with a seam in its middle (k29), then a post passes behind her head on every beat from k30.
  // Strong print contrast, one step darker than the platform: a heavy dotted body, solid teal line bands and posts, paper-white
  // glass with the empty car seen through it (seat backs, straps), so a white window and a dark post pass behind her face on
  // every beat. The destination board 「回送」 (paper white knocked out of solid teal) sits high on the cab's rear half, above the
  // people's heads, so it reads as it passes behind her and the mother.
  const TR = 2 / 5, TA = PPC * TR * ZS;                  // screen px per cm on the car's plane (before the push-in)
  const trX = sx => (sx - Math.round(960 - CX_STOP * TR * ZS)) / TA;               // screen x (at the stop) -> car cm
  const headScreenX = 960 + (toCm(FIG.rin, [560, 520])[0] * PPC - CX_STOP) * ZS;    // the middle of her head, at the stop
  const X_HEAD = trX(headScreenX), X_LEFT = trX(0);
  const MOD = (X_HEAD - X_LEFT) / 2;                     // nose at the left edge on k26, behind her head on k28
  const TR_V = MOD / BEAT;                               // cm a second (about 9 km/h)
  const CAB = 2 * MOD, NMOD = 16, TR_LEN = CAB + NMOD * MOD;
  const front = t => X_LEFT + (t - T_TRAIN) * TR_V;
  const DEST = dots16('回送', 19 * TA * (1 + PUSH) / 16, 71, PAPER_RGB);           // glyphs 19 cm tall, drawn at screen resolution
  function drawTrain(ctx, t) {
    if (t < T_TRAIN - FRAME) return;
    layer(ctx, TR, TR);
    const F = front(t), back = F - TR_LEN;
    const ROOF = 290, WT = 186, WB = 88, SKIRT = -20;     // cm above the car floor: roof, window top and bottom, the skirt
    ctx.fillStyle = PAPER; ctx.fillRect(back, -ROOF, TR_LEN, ROOF - SKIRT);
    ctx.fillStyle = dotPattern(ctx, 0.46); ctx.fillRect(back, -ROOF, TR_LEN, ROOF - SKIRT);
    ctx.fillStyle = dotPattern(ctx, 0.8); ctx.fillRect(back, -ROOF, TR_LEN, 26);
    ctx.fillStyle = TEAL; ctx.fillRect(back, -WB + 6, TR_LEN, 18); ctx.fillRect(back, -WT - 26, TR_LEN, 10);
    // the passenger modules: windows (a door every fourth), each with a post at its front edge
    for (let i = 0; i < NMOD; i++) {
      const x1 = F - CAB - i * MOD, x0 = x1 - MOD, door = i % 4 === 2;
      const gx = x0 + 9, gw = MOD - 18, gt = door ? WT + 4 : WT, gb = door ? 36 : WB;
      ctx.fillStyle = PAPER; ctx.fillRect(gx, -gt, gw, gt - gb);
      ctx.fillStyle = dotPattern(ctx, 0.12); ctx.fillRect(gx + gw * 0.08, -WT + 26, gw * 0.84, 60);
      if (!door) {
        ctx.fillStyle = dotPattern(ctx, 0.5); ctx.fillRect(gx, -WB - 22, gw, 22);
        line(ctx, 1.4, 0.6); ctx.beginPath(); ctx.moveTo(gx, -WT + 10); ctx.lineTo(gx + gw, -WT + 10); ctx.stroke();
        for (let k = 0; k < 2; k++) { const sx = gx + gw * (0.3 + k * 0.4); ctx.beginPath(); ctx.moveTo(sx, -WT + 10); ctx.lineTo(sx, -WT + 30); ctx.stroke(); ctx.beginPath(); ctx.ellipse(sx, -WT + 36, 4.5, 6, 0, 0, 7); ctx.stroke(); }
      } else {
        line(ctx, 1.6, 0.7); ctx.beginPath(); ctx.moveTo(gx + gw / 2, -gt); ctx.lineTo(gx + gw / 2, -gb); ctx.stroke();
        ctx.fillStyle = dotPattern(ctx, 0.3); ctx.fillRect(gx, -gb, gw, gb - 6);
      }
      line(ctx, 2.2, 0.9); ctx.strokeRect(gx, -gt, gw, gt - gb);
      ctx.fillStyle = TEAL; ctx.fillRect(x1 - 7, -WT - 8, 14, WT - WB + 16);                               // the post
    }
    // the cab: front half the driver's door and window, the seam (k29), rear half the destination board
    const c0 = F - CAB;
    ctx.fillStyle = TEAL; ctx.fillRect(F - MOD - 7, -WT - 8, 14, WT - WB + 16);                              // the seam
    ctx.fillStyle = PAPER; ctx.fillRect(F - MOD + 12, -WT + 4, MOD * 0.42, WT - WB - 26);
    line(ctx, 2.2, 0.9); ctx.strokeRect(F - MOD + 12, -WT + 4, MOD * 0.42, WT - WB - 26);
    line(ctx, 1.6, 0.7); ctx.strokeRect(F - MOD + 8, -WT - 2, MOD * 0.5, WT + 10);
    const bw = MOD * 0.8, bh = 26, bx = c0 + (MOD - bw) / 2, by = -223;      // above the heads (seen at 163-174 cm)
    ctx.fillStyle = TEAL; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 3); ctx.fill();
    ctx.save(); ctx.translate(bx + bw / 2, by + bh / 2); ctx.scale(1 / (TA * (1 + PUSH)), 1 / (TA * (1 + PUSH)));
    ctx.drawImage(DEST.c, DEST.x0, DEST.y0, DEST.w, DEST.h, -DEST.w / 2, -DEST.h / 2, DEST.w, DEST.h); ctx.restore();
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.moveTo(F - 16, -ROOF); ctx.quadraticCurveTo(F + 6, -ROOF + 40, F + 6, -ROOF + 120); ctx.lineTo(F + 6, -SKIRT); ctx.lineTo(F - 16, -SKIRT); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dotPattern(ctx, 0.6); ctx.fill();
    line(ctx, 2.6, 0.95); ctx.beginPath(); ctx.moveTo(back, -ROOF); ctx.lineTo(F - 16, -ROOF); ctx.quadraticCurveTo(F + 6, -ROOF + 40, F + 6, -ROOF + 120); ctx.lineTo(F + 6, -SKIRT); ctx.lineTo(back, -SKIRT); ctx.closePath(); ctx.stroke();
  }

  // ---------------- the platform's centre line (fs = fp = 3/5): pillars, benches, posters, station-name plates ----------------
  const PL = 3 / 5;
  const PILLARS = []; for (let i = -8; i < 26; i++) PILLARS.push(-1030 + i * 260);
  const POSTERS = [
    { head: '全国統一模試', big: '偏差値', sub: '申込受付中' },
    { head: '夏期講習', big: '合格', sub: '南台ゼミナール' },
    { head: '定期テスト対策', big: '読解力', sub: '個別指導' },
  ];
  function drawBench(ctx, x0) {                          // a platform bench between two pillars: four seats on a steel frame
    const w = 150, seat = 44, back = 84;
    line(ctx, 1.6, 0.75);
    for (const lx of [x0 + 12, x0 + w - 12]) { ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, -back); ctx.stroke(); }
    ctx.fillStyle = PAPER; ctx.fillRect(x0, -seat - 5, w, 7); ctx.fillStyle = dotPattern(ctx, 0.5); ctx.fillRect(x0, -seat - 5, w, 7);
    line(ctx, 1.4, 0.8); ctx.strokeRect(x0, -seat - 5, w, 7);
    for (let s = 0; s < 4; s++) {
      const sx = x0 + 4 + s * (w - 8) / 4, sw = (w - 8) / 4 - 4;
      ctx.fillStyle = PAPER; ctx.beginPath(); ctx.roundRect(sx, -back, sw, back - seat - 8, 4); ctx.fill();
      ctx.fillStyle = dotPattern(ctx, 0.22); ctx.fill(); line(ctx, 1.3, 0.75); ctx.stroke();
    }
  }
  const PLAIN = 13;
  function drawPlatform(ctx) {
    layer(ctx, PL, PL);
    PILLARS.forEach((X, i) => {
      // the pillar: a white steel column 30 cm wide, its shaded side in the screen
      ctx.fillStyle = PAPER; ctx.fillRect(X, -450, 30, 450);
      ctx.fillStyle = dotPattern(ctx, 0.3); ctx.fillRect(X + 20, -450, 10, 450);
      line(ctx, 1.6, 0.62); ctx.strokeRect(X, -450, 30, 450);
      if (i % 3 === 2) drawBench(ctx, X + 55);
      if (i === PLAIN) return;                            // the pillar that ends up behind the mother's head stays bare
      if (i % 3 === 0) {                                  // a station-name plate on every third pillar (vertical, as on real pillars)
        const pw = 26, ph = 58, px = X + 15 - pw / 2, py = -192;
        ctx.fillStyle = PAPER; ctx.fillRect(px, py, pw, ph); line(ctx, 1.8, 0.9); ctx.strokeRect(px, py, pw, ph);
        ctx.fillStyle = TEAL; ctx.fillRect(px, py, pw, 5);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = TEAL;
        ctx.font = `700 13px ZenKakuB`; ctx.fillText("南", px + pw / 2 - 2.5, py + 19); ctx.fillText("台", px + pw / 2 - 2.5, py + 35);
        ctx.save(); ctx.font = `500 3.4px ZenKaku`; const hx = px + pw - 4;
        [...'みなみだい'].forEach((ch, j) => ctx.fillText(ch, hx, py + 14 + j * 4)); ctx.restore();
      } else if (i % 3 === 1) {                           // posters
        const pp = POSTERS[((i % 9) + 9) % 9 / 3 | 0], pw = 42, ph = 60, ppx = X + 15 - pw / 2, ppy = -170;
        ctx.fillStyle = PAPER; ctx.fillRect(ppx, ppy, pw, ph); line(ctx, 1.3, 0.62); ctx.strokeRect(ppx, ppy, pw, ph);
        ctx.fillStyle = rgba(TEAL_RGB, 0.75); ctx.fillRect(ppx, ppy, pw, 10);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = PAPER; ctx.font = `700 5.6px ZenKakuB`; ctx.fillText(pp.head, ppx + pw / 2, ppy + 5.3);
        ctx.fillStyle = rgba(TEAL_RGB, 0.8); ctx.font = `700 12px ZenKakuB`; ctx.fillText(pp.big, ppx + pw / 2, ppy + 27);
        ctx.fillStyle = dotPattern(ctx, 0.3); ctx.fillRect(ppx + 4, ppy + 37, pw - 8, 10);
        ctx.fillStyle = rgba(TEAL_RGB, 0.8); ctx.font = `500 4.6px ZenKaku`; ctx.fillText(pp.sub, ppx + pw / 2, ppy + 53);
      }
    });
  }
  // the canopy's edge above the platform edge (fs = fp = 0.95): seen only in the wider framing at the start
  const CN = 0.95;
  function drawCanopy(ctx) {
    layer(ctx, CN, CN);
    const lo = 196, hi = 236;                             // cm (apparent ~ 193 to 231)
    ctx.fillStyle = PAPER; ctx.fillRect(-3000, -hi, 9000, hi - lo);
    ctx.fillStyle = dotPattern(ctx, 0.34); ctx.fillRect(-3000, -hi, 9000, hi - lo);
    ctx.fillStyle = TEAL; ctx.fillRect(-3000, -lo - 4, 9000, 4);
    line(ctx, 1.6, 0.85); ctx.beginPath(); ctx.moveTo(-3000, -lo); ctx.lineTo(6000, -lo); ctx.stroke();
  }

  // ---------------- people, their print tone and their cards ----------------
  function bandsAt(key, t) { const pr = PR[key]; return pr ? pr.map(tp => sweep(t - tp)) : [0, 0, 0, 0]; }
  // the print tone over a read person: a teal halftone multiplied over the whole figure, one shade a beat (a quarter of the
  // full tone per band printed), so the figure ends a dark print of itself. The tone's dots are anchored to the people plane
  // (0.5 cm pitch) so they move and scale with the person.
  const TONE_MAX = 0.62, TONE_PITCH = 0.5;
  const [TC, TG] = mk(W, 1080);
  // the tone's screen: TONE_PITCH cm on the people plane, prefiltered at its device size (dotsAt)
  const tonePattern = (ctx, cover) => dotsAt(ctx, +cover.toFixed(2), TEAL_RGB, 1, TONE_PITCH * Math.hypot(ctx.getTransform().a, ctx.getTransform().b));
  const toneOf = (key, t) => bandsAt(key, t).reduce((a, b) => a + b, 0) / 4;
  function printTone(ctx, f, im, box, regions) {
    // regions: [{ level, clip }] (clip: a path in people-plane cm, or null for the whole figure)
    const live = regions.filter(r => r.level > 0.001); if (!live.length) return;
    const m = ctx.getTransform();
    TG.setTransform(1, 0, 0, 1, 0, 0); TG.globalCompositeOperation = 'source-over'; TG.clearRect(0, 0, W, 1080);
    TG.setTransform(m); TG.drawImage(im, ...box);
    TG.globalCompositeOperation = 'source-in';
    for (const r of live) {
      TG.save(); if (r.clip) TG.clip(r.clip, 'evenodd');
      TG.fillStyle = tonePattern(TG, Math.min(0.92, TONE_MAX * r.level)); TG.fillRect(...box); TG.restore();
    }
    // the parts of the figure not in any live region must not be tinted: cut them out of the tone layer
    const cover = regions.length > 1 ? regions.filter(r => r.level <= 0.001) : [];
    if (cover.length) { TG.globalCompositeOperation = 'destination-out'; for (const r of cover) { TG.save(); if (r.clip) TG.clip(r.clip, 'evenodd'); TG.fillStyle = '#000'; TG.fillRect(...box); TG.restore(); } }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(TC, 0, 0); ctx.restore();
  }
  // the child's outline and the rest of p7, as paths in people-plane cm
  const KID_PATH = new Path2D(), MOM_PATH = new Path2D();
  {
    const f = FIG.p7, pts = f.KID.map(p => toCm(f, p));
    pts.forEach(([x, y], i) => i ? KID_PATH.lineTo(x, y) : KID_PATH.moveTo(x, y)); KID_PATH.closePath();
    const c = f.cmpp, l = f.x - f.cx * c, tp = -(BOTTOM + 1536 * c);
    MOM_PATH.rect(l - 5, tp - 5, 1024 * c + 10, 1536 * c + 10); MOM_PATH.addPath(KID_PATH);
  }

  // one card hanging from the two lanyard ends (cm). sx: its width as seen; swing: its rotation in the picture plane about the
  // clip; dip: how far the clip is knocked down (cm); skew: the slope of its top and bottom edges (her card, turned with her
  // body: its far, right-hand edge seen a little higher and shorter); shadow: its shadow on the coat behind it
  function hangCard(ctx, card, ends, t, key, { w = CARD_W, sx = 1, swing = 0, dip = 0, drop = 7, hitAt = null, skew = 0, far = 1, shadow = 0.55 } = {}) {
    const [[x1, y1], [x2, y2]] = ends, mx = (x1 + x2) / 2, clipY = Math.max(y1, y2) + drop;
    const h = w / CARD_RATIO;
    const m = ctx.getTransform(), lw = 2.6 / m.a;
    ctx.strokeStyle = TEAL; ctx.lineWidth = Math.max(lw, 0.3); ctx.lineCap = 'round';
    const cxp = mx + Math.sin(swing) * 1.2, cyp = clipY + dip;
    for (const [x, y] of ends) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + cxp) / 2, (y + cyp) / 2 + 0.6, cxp, cyp); ctx.stroke(); }
    ctx.save(); ctx.translate(cxp, cyp); ctx.rotate(swing); ctx.transform(sx, skew, 0, 1, 0, 0);
    // the face of the card, composed once per frame at card resolution
    const [fc, fx] = FACE;
    fx.setTransform(1, 0, 0, 1, 0, 0); fx.clearRect(0, 0, fc.width, fc.height);
    fx.drawImage(card.base, 0, 0);
    const bs = bandsAt(key, t);
    bs.forEach((f, i) => {
      if (f <= 0) return; const r = card.rects[i];
      fx.save(); fx.beginPath(); fx.rect(r[0] - 3, r[1] - 4, (r[2] + 6) * f + 3, r[3] + 8); fx.clip(); fx.drawImage(card.bands[i], 0, 0); fx.restore();
    });
    if (card.hit && hitAt !== null && t >= hitAt) {
      const f = sweep(t - hitAt); fx.save(); fx.beginPath(); fx.rect(0, 0, card.w * f, fc.height); fx.clip(); fx.drawImage(card.hit, 0, 0); fx.restore();
    }
    // shadow on the coat, the card's edge (its thickness), then the face; far < 1 draws it in vertical strips that shrink
    // towards the right-hand edge (the edge further from us)
    ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-w / 2 + shadow, shadow * 1.6, w, h * (far < 1 ? (1 + far) / 2 : 1));
    if (shadow > 0.6) ctx.fillRect(-w / 2 + shadow * 0.5, shadow * 0.8, w, h * (far < 1 ? (1 + far) / 2 : 1));
    ctx.fillStyle = rgba(TEAL_RGB, 0.55); ctx.fillRect(-w / 2, 0.12, w, h);
    if (far >= 1) ctx.drawImage(fc, 0, 0, card.w, card.w / CARD_RATIO, -w / 2, 0, w, h);
    else {
      const N = 12, cw = card.w / N;
      for (let i = 0; i < N; i++) { const f0 = i / N, sh = 1 - (1 - far) * (f0 + 0.5 / N); ctx.drawImage(fc, i * cw, 0, cw, card.w / CARD_RATIO, -w / 2 + f0 * w, h * (1 - sh) / 2, w / N + 0.02, h * sh); }
    }
    ctx.fillStyle = PAPER; ctx.fillRect(-0.7, -0.5, 1.4, 1.1); ctx.strokeStyle = TEAL; ctx.lineWidth = Math.max(lw * 0.7, 0.2); ctx.strokeRect(-0.7, -0.5, 1.4, 1.1);
    ctx.restore();
  }
  const FACE = mk(CU, CU / CARD_RATIO);
  // her card on k24: knocked down 7 cm and back, twisted round to face us and back past its rest (as seen: 0.74 -> 1 -> 0.5
  // -> ...), swinging hard in the picture plane (0.5 rad), settled in about 1.2 s
  const SX_REST = 0.74, SKEW_REST = -0.07, FAR_REST = 0.93;
  function hitMotion(t) {
    const a = t - T_HIT; if (a < 0) return { swing: 0, dip: 0, sx: SX_REST, skew: SKEW_REST, far: FAR_REST };
    const k = Math.exp(-a / 0.32), tw = Math.exp(-a / 0.26) * Math.cos(a * 2 * Math.PI / 0.46);
    return {
      swing: 0.5 * k * Math.sin(a * 2 * Math.PI / 0.36 + 0.4),
      dip: 7 * Math.exp(-a / 0.1),
      sx: SX_REST + (1 - SX_REST) * tw,
      skew: SKEW_REST * (1 - Math.max(0, tw)),
      far: FAR_REST + (1 - FAR_REST) * Math.max(0, tw),
    };
  }
  // the cards jump on their lanyards (rhythm pass 2026-11-21): a passer-by's card on each beat it is printed (1.3 cm, swung a
  // little, alternating), and every card on the three heavy kicks k33/34/35 (1.6 cm). Down on the beat frame (70 %, all of it
  // on the next), then a damped bounce (0.2 s period, tau 0.075 s), settled to under 0.3 screen px by the next beat, so 02's
  // first frame (k36) still continues 01's last.
  const JOLT_KICKS = [33, 34, 35].map(k => K(k));
  const BAR_JOLTS = [28, 30, 32].map(k => K(k));         // the printed cards only (1.3 cm), the kicks k28/30/32
  function joltShape(t, tk) {
    const i = Math.round(t * FPS) - Math.ceil(tk * FPS - 1e-9); if (i < 0) return 0; if (i === 0) return 0.7; if (i === 1) return 1;
    // faded out by 0.24 s so the card is exactly at rest before the next beat (and on 02's first frame)
    const a = (i - 1) / FPS; return Math.exp(-a / 0.075) * Math.cos(2 * Math.PI * a / 0.2) * (1 - smooth((a - 0.12) / 0.12));
  }
  function joltOf(key, t) {
    let dip = 0, swing = 0;
    [...new Set(PR[key] ?? [])].forEach((tk, j) => { const s = joltShape(t, tk); dip += 1.3 * s; swing += (j % 2 ? -1 : 1) * 0.045 * s; });
    JOLT_KICKS.forEach((tk, j) => { const s = joltShape(t, tk); dip += 1.6 * s; swing += (j % 2 ? 1 : -1) * 0.03 * s; });
    if (PR[key]) BAR_JOLTS.forEach((tk, j) => { if (tk < Math.max(...PR[key])) return; const s = joltShape(t, tk); dip += 1.3 * s; swing += (j % 2 ? -1 : 1) * 0.04 * s; });
    return { dip, swing };
  }
  function drawPerson(ctx, f, t) {
    const c = f.cmpp, wcm = 1024 * c, hcm = 1536 * c, left = f.x - f.cx * c, top = -(BOTTOM + hcm);
    const im = f.her ? (t >= T_TURN ? f.imF : t >= T_TURN_IN ? f.imT : f.im) : f.im;
    const box = [left, top, wcm, hcm];
    drawImageAt(ctx, f.P, im);                           // = box: the same placement as its lanyard ends
    if (!f.her) {
      if (f.kid) printTone(ctx, f, im, box, [{ level: toneOf('p7kid', t), clip: KID_PATH }, { level: toneOf('p7', t), clip: MOM_PATH }]);
      else printTone(ctx, f, im, box, [{ level: toneOf(f.key, t), clip: null }]);
    }
    const ends = lanEnds(f, t);
    if (f.her) {
      const mo = hitMotion(t), jo = joltOf('rin', t);
      hangCard(ctx, f.card, ends, t, 'rin', { sx: Math.max(0.42, mo.sx), swing: mo.swing + jo.swing, dip: mo.dip + jo.dip, drop: 0.8, hitAt: T_HIT, skew: mo.skew, far: mo.far, shadow: 0.9 });
    } else {
      const jo = joltOf(f.key, t);
      hangCard(ctx, f.card, ends, t, f.key, { drop: f.drop ?? 6, dip: jo.dip, swing: jo.swing });
      if (f.kid) { const jk = joltOf(f.key + 'kid', t); hangCard(ctx, f.kid.card, lanEnds(f, t, 'kid_lan'), t, f.key + 'kid', { w: 7.5, drop: 3, dip: jk.dip * 0.6, swing: jk.swing }); }
    }
  }

  // ---------------- k24: the big print slammed out of her card, k25 crumbling off ----------------
  // The machine's 16-dot head prints 「読み取れません」 in letters 11 cm tall (seven of them span 77 cm, about 1000 px on the frame,
  // 29 px a letter on a phone), each dot on a paper-white halo so the letters read over her dark coat, centred over her card with their foot just above it (so the card itself stays in sight
  // swinging), double struck a dot apart, the dots run together, ink spattered round them. Swept in left to right in three
  // frames. On k25 the print will not take: the dots crumble off left to right (each lets go up to 4 frames after its left
  // neighbour) and fall out of the frame under gravity, fading as they go.
  function recordDots(text, size, sd, dotr) {
    const dots = []; let tx = 0, ty = 0;
    const rec = { save() {}, restore() {}, translate(x, y) { tx += x; ty += y; }, rotate() {}, beginPath() {}, fill() {}, set fillStyle(v) {}, arc(x, y, r) { dots.push([tx + x, ty + y, r]); } };
    inkjetText(rec, text, 0, 0, { size, align: 'center', matrix: true, seed: sd, dotr, color: INK_RGB });
    return dots;
  }
  const BIG_H = 11, BIG_SIZE = 160, BS = BIG_H / BIG_SIZE;          // letter height (cm); recorded at 160 px, scaled to cm
  const herCard = (() => { const f = FIG.rin, ends = lanEnds(f, 0); return { x: cardX(f), top: Math.max(ends[0][1], ends[1][1]) + 0.8 }; })();
  const BIG_CX = herCard.x, BIG_CY = herCard.top - 1.2 - BIG_H / 2;   // cm, -h
  const BIG = [];
  {
    const R = rng(907), kd = BIG_SIZE / 16;
    const passes = [[recordDots('読み取れません', BIG_SIZE, 61, 0.62), 0, 0, 1], [recordDots('読み取れません', BIG_SIZE, 62, 0.58), kd, kd * 0.7, 1],
                    [recordDots('読み取れません', BIG_SIZE, 63, 0.95), 0, 0, 0.3]];
    for (const [dots, ox, oy, al] of passes) for (const [x, y, r] of dots) BIG.push({ x: BIG_CX + (x + ox) * BS, y: BIG_CY + (y + oy) * BS, r: r * BS, a: al });
    const xs = BIG.map(d => d.x), x0 = Math.min(...xs), x1 = Math.max(...xs);
    const letters = BIG.slice();
    for (let i = 0; i < 9; i++) {                        // spatter: nine splashes thrown off the letters' edges, drops getting smaller
      const c = letters[Math.floor(R() * letters.length)], ang0 = R() * Math.PI * 2;
      for (let j = 0; j < 9; j++) {
        const ang = ang0 + (R() - 0.5) * 1.1, dist = 1.2 + R() * 5.5;
        BIG.push({ x: c.x + Math.cos(ang) * dist, y: c.y + Math.sin(ang) * dist * 0.8, r: Math.max(0.12, (0.75 - dist * 0.09) * (0.6 + R() * 0.6)), a: 1 });
      }
    }
    for (const d of BIG) { d.u = (d.x - x0) / (x1 - x0); d.delay = Math.max(0, Math.min(1, d.u)) * 4 * FRAME + R() * FRAME; d.vx = (R() - 0.5) * 30; d.vy = -10 - R() * 25; }
    BIG.box = [x0 - 1, BIG_CY - BIG_H / 2 - 1, x1 - x0 + 2, BIG_H + 2];
    LAY.text('big 読み取れません (k24)', 'big', BIG.box);
    LAY.audit('seg_01 big print');
  }
  const GRAV = 900;                                      // cm/s^2
  function drawBig(ctx, t) {
    const a0 = t - T_HIT; if (a0 < 0) return;
    const f = sweep(a0);
    layer(ctx, 1, 1);
    const pos = [];
    for (const d of BIG) {
      if (d.u > f * 1.0001 && f < 1) continue;
      let x = d.x, y = d.y, al = d.a;
      const a = t - T_FALL - d.delay;
      if (a > 0) { x += d.vx * a; y += d.vy * a + 0.5 * GRAV * a * a; al *= 1 - smooth((a - 0.14) / 0.22); if (al <= 0.01) continue; }
      pos.push([x, y, d.r, al]);
    }
    ctx.fillStyle = PAPER;                               // the halo: paper white under every dot
    for (const [x, y, r, al] of pos) { ctx.globalAlpha = Math.min(1, al) * 0.92; ctx.beginPath(); ctx.arc(x, y, r + 0.42, 0, 7); ctx.fill(); }
    ctx.fillStyle = rgba(INK_RGB, 0.97);
    for (const [x, y, r, al] of pos) { ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  // ---------------- audits: the prints stay in frame while they are there ----------------
  {
    const f = FIG.rin, ends = lanEnds(f, 0), cy = Math.max(ends[0][1], ends[1][1]) + 0.8, cx = cardX(f);
    const wpx = CARD_W * SX_REST, hpx = CARD_W / CARD_RATIO;
    const box = [cx - wpx / 2, cy, wpx, hpx];
    // card canvas px -> world px on the people plane (the card at rest), then the frame check by the camera as it actually moves
    const toW = ([x, y]) => [(box[0] + x / CU * wpx) * PPC, yOf(-(box[1] + y / CU * CARD_W))];
    const bigW = ([x, y]) => [x * PPC, yOf(-y)];
    const views = (a, b) => frameTimes(T0, a, b).map(t => { const v = camAt(t); return { t, z: v.z * v.sc, fx: v.cx + (ANCHOR[0] - 960) / v.z * (1 - 1 / v.sc), fy: v.fy + (ANCHOR[1] - 540) / v.z * (1 - 1 / v.sc) - v.dy / (v.z * v.sc) }; });
    LAY.frameCheck('seg_01 her card from k24 (with the push-in)', { sheets: { card: toW, 'card:print': toW }, views: views(T_HIT, T1) });
    LAY.frameCheck('seg_01 big print k24-k25', { sheets: { big: bigW }, views: views(T_HIT, T_FALL) });
  }
  // MOTION AUDIT (docs/制作约定.md 第六节「整屏运动」): the people plane's view, every frame as shown; frame 98 is the cut from 00
  const camView = t => { const v = camAt(t); return { t, z: v.z * v.sc, fx: v.cx + (ANCHOR[0] - 960) / v.z * (1 - 1 / v.sc), fy: v.fy + (ANCHOR[1] - 540) / v.z * (1 - 1 / v.sc) - v.dy / (v.z * v.sc) }; };
  const MOTION_R = motionAudit('seg_01', frameTimes(T0, T0, T1).map((t, i) => ({ ...camView(t), cut: i === 0 })),
    { big: [[T_HIT, 'crash k24 (段内最响的镲): the truck stops dead on her, 読み取れません slammed out of her card']] });
  // PART AUDIT: every lanyard end the code continues from must be on the drawn strand's end, on each drawing's own pixels
  {
    const CLS = {
      teal_or_tip: ([r, g, b, a]) => a > 200 && ((b - r > 35 && g - r > 30) || Math.min(r, g, b) > 150),
      opaque: PIX.opaque,
    };
    const IMG = { r01_side: FIG.rin.im, r01_turn: FIG.rin.imT, r01_follow2: FIG.rin.imF };
    for (const k of Object.keys(DRAWING)) IMG[DRAWING[k]] = FIG[k].im;
    for (const [d, parts] of Object.entries(PA)) for (const [part, rec] of Object.entries(parts)) {
      const on = typeof rec.class === 'string' ? CLS[rec.class]
        : ([r, g, b, a]) => a > 200 && rec.class.fill.some(c => Math.abs(r - c[0]) + Math.abs(g - c[1]) + Math.abs(b - c[2]) < rec.class.tol);
      endsAudit('seg_01', d, part, { image: IMG[d], ends: partOf(PA, d, part).ends, on });
    }
  }
  const PARTS_R = partReport('seg_01');
  S.finish();
  publishAudit(S, LAY, { zoom: [Z0, ZS], cardPx: +(CARD_W * PPC * ZS).toFixed(1), motion: MOTION_R, parts: PARTS_R });

  window.renderAt = async t => {
    VIEW = camAt(t);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.fillStyle = PAPER; g.fillRect(0, 0, W, 1080);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    for (const fn of [drawTown, drawFence, ctx => drawTrain(ctx, t), drawPlatform,
                      ctx => { layer(ctx, 1, 1); for (const [k] of ROW) drawPerson(ctx, FIG[k], t); }, drawCanopy, ctx => drawBig(ctx, t)]) { g.save(); fn(g); g.restore(); }
    g.setTransform(1, 0, 0, 1, 0, 0);
  };
  await window.renderAt(P('t0', 9.3));
}
