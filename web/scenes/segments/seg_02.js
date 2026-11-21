// Segment 02 急停 (k36-k40, 13.651-15.133 s, global frames [410, 454)). docs/分镜/02_急停.md, design 甲, finished after the blind
// review of the samples (sample page in archive/seg02_sample_20261120/). The riff stops dead: k38.25 the band drops out, then
// four full-band stabs at k38.5, k39, k39.5 (and k40 = 03's first frame), each followed by a sixteenth of silence.
//
// It is the same shot as 01 (one camera), so this page is 01's page (seg_01.js) carried on: the same world, row, drawings and
// camera up to k36 (camAt); 02's first frame continues 01's last exactly. From k36 the camera is a lens zoom on the frozen
// layers of 01's stop (screen = M * (base - Q) + centre).
//   third round (2026-11-21, docs/制作约定.md 第六节「整屏运动」; director: “screen motion can have rhythm but must not cause dizziness”): the frame moves once.
//   k36      the camera snaps out to the wide shot (people plane 0.62x, her card centred, three people each side): a registered
//            whip, half a beat long (lands on k36.5, ease-out power 5, 180-degree shutter blur), no bounce. The 回送 car pulls
//            away to the right (she watches it go: r01_follow2) and its tail clears the frame on k37.
//   k36.5-k40 the wide is dead still to the cut (the old k38 push and the three stab camera steps are gone): 静动对比.
//   k38      the last full-band beat: every card in the row flashes once (read), hers does not.
//   stabs    on each stab every card is yanked one step toward her: the lanyard pulled taut from the two collarbone points,
//            the clip swung out along the lanyard's length toward her, the card swung with it and its face turned to her
//            about its own long axis. Cards move on the stab's frame (85 %, then 110 %, settled on the third). People never
//            look up (kept for 15 k522); she looks after the train.
//   lanyards p3, p6, p7, p8, p2 are their lanyard-free redraws (art/cut/s02b_*) from 02's first frame (the swap is inside the
//            whip's blur); every lanyard below the collarbones is the code's ribbon from the ends measured on each drawing
//            (art/cut/seg02_parts.json, web/lib/parts.js, PART AUDIT).
import { drawCard, CARD_RATIO } from '../../lib/card.js';
import { BEAT, FRAME, beatV, smooth, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { move, frameTimes, camLerp, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, endsAudit, partAudit, pixelsOf, PIX, partReport } from '../../lib/parts.js';
import { dots16 } from '../../lib/print.js';
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, INK_RGB, CARD_SHADOW, rgba } from '../../lib/palette.js';
import { herCardFace, herCardBoxes } from '../../lib/her_card.js';

export default async function seg02(H) {
  const { g, W, P, q, rng, img, rinPalImage, inkjetText } = H;
  const VAR = '';
  const F0 = 410, F1 = 454, FPS = 30, T0 = F0 / FPS, T1 = F1 / FPS;
  const S = createScore(`seg_02${VAR}`, { t0: T0, t1: T1 });
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
  // cx = the body's centre column, lan = the two lanyard ends (drawing px)
  // p2's drawing, measured (head top row, body centre column, the two lanyard ends), see art/design/prompts/_make_seg02.py
  const P2M = { top: 328, cx: 520 };
  // the lanyard ends: measured on EACH drawing in its own px (art/cut/seg02_parts.json, web/lib/parts.js; 根因清单 2026-11-21
  // 「笔芯和笔不对了……」: a part follows the drawing it is drawn over). Her card hangs from r01_follow2's own ends (she is in
  // r01_follow2 for the whole of 02; before, the ends were r01_side's), the passers-by from their t01 drawing's ends until
  // the swap, then from their s02b redraw's.
  const PA = await loadPartAnchors('/art/cut/seg02_parts.json');
  const lanOf = (d, part = 'lan') => partOf(PA, d, part).ends.map(p => p.slice());
  let EXT = null;
  const FIG = {
    p1: { file: '/art/cut/t01_p1c.png', H: 172, top: 243, cx: 510, lan: lanOf('t01_p1c'), name: '佐藤　健太', id: '3172', dev: '49' },
    p3: { file: '/art/cut/t01_p3.png', H: 160, top: 378, cx: 512, lan: lanOf('t01_p3'), name: '高橋　正男', id: '1043', dev: '51' },
    p6: { file: '/art/cut/t01_p6.png', H: 160, top: 322, cx: 508, lan: lanOf('t01_p6'), name: '山本　さくら', id: '5208', dev: '55' },
    // p9: the lanyard is not drawn (only the hoodie's strings); it comes out from under the hood at the neck
    p9: { file: '/art/cut/t01_p9.png', H: 183, top: 150, cx: 511, lan: lanOf('t01_p9'), drop: 9, name: '吉田　蓮', id: '6630', dev: '53' },
    rin: { file: '/art/cut/r01_side.png', H: 152, top: 407, cx: 535, lan: lanOf('r01_follow2'), her: true },   // drawn: r01_follow2 (same master, same top / cx)
    // the child sits on the mother's right arm (left in the picture): KID is his outline in the drawing (px), so the two can be
    // printed on different beats
    p7: { file: '/art/cut/t01_p7.png', H: 162, top: 307, cx: 515, lan: lanOf('t01_p7'), name: '小林　由美', id: '2614', dev: '50',
          kid: { lan: lanOf('t01_p7', 'kidLan'), name: '小林　そうた', id: '0003', dev: '00' },
          KID: [[175, 520], [425, 520], [425, 600], [405, 700], [450, 800], [452, 1135], [175, 1135]] },
    p8: { file: '/art/cut/t01_p8.png', H: 168, top: 310, cx: 512, lan: lanOf('t01_p8'), name: '加藤　大輔', id: '7781', dev: '47' },
    // 02 only: Tanaka Misaki stands right of p8 (01 file: p2 only appears in 02's wide shot); read off frame in 01 (k28)
    p2: { file: '/art/cut/t01_p2.png', H: 158, top: P2M.top, cx: P2M.cx, lan: lanOf('t01_p2'), name: '田中　美咲', id: '3111', dev: '52' },
  };
  // 02: the lanyard-free redraws (on screen from stab 1) and, in them, where the lanyard now stops: the tips of the two short
  // strands at the collarbones (drawing px, read off gridded crops of each redraw); the code's taut strands start there
  const RE = {
    p3: { file: '/art/cut/s02b_p3.png', neck: lanOf('s02b_p3', 'neck') },
    p6: { file: '/art/cut/s02b_p6.png', neck: lanOf('s02b_p6', 'neck') },
    p7: { file: '/art/cut/s02b_p7.png', neck: lanOf('s02b_p7', 'neck'), kidNeck: lanOf('s02b_p7', 'kidNeck') },
    p8: { file: '/art/cut/s02b_p8.png', neck: lanOf('s02b_p8', 'neck') },
    p2: { file: '/art/cut/s02b_p2.png', neck: lanOf('s02b_p2', 'neck') },
  };
  for (const [k, r] of Object.entries(RE)) { FIG[k].re = r.file; FIG[k].neck = r.neck; if (r.kidNeck) FIG[k].kid.neck = r.kidNeck; }
  FIG.p9.neck = lanOf('t01_p9');                              // his lanyard is the code's from the neck already
  FIG.p1.neck = lanOf('t01_p1c');                              // p1 is never in frame in 02 (kept so the row is whole)
  const TURN = '/art/cut/r01_turn.png', FOLLOW = '/art/cut/r01_follow2.png';
  const BOTTOM = 25;                                    // the drawings' bottom edge is 0.25 m above the floor
  for (const [k, f] of Object.entries(FIG)) {
    f.key = k; f.im = await img(f.file); if (f.re) f.imRe = await img(f.re);
    if (f.her) { f.im = rinPalImage(f.im); f.imT = rinPalImage(await img(TURN)); f.imF = rinPalImage(await img(FOLLOW)); }
    f.cmpp = (f.H - BOTTOM) / (1536 - f.top);           // cm per drawing px, from its real height
  }
  // the row, left to right (cm on the people plane). Each neighbour stands 1 cm further than where their outlines would first
  // touch (measured from the drawings' alpha at every height), so the row is shoulder to shoulder without anyone in front of
  // anyone. The mother and child stand right of her: the machine skips her and reads the child, then the mother.
  const ROW = [['p1', 0], ['p3', 59], ['p6', 108.2], ['p9', 162.8], ['rin', 224.7], ['p7', 275.6], ['p8', 334.8], ['p2', 0]];
  for (const [k, x] of ROW) FIG[k].x = x;
  // p2's place by the same rule as 01's row: 1 cm further than where p8's and her outlines first touch, at any height
  {
    const prof = (f, side) => {                          // per 1 cm of height: the outline's extreme x (cm from the body centre)
      const c = document.createElement('canvas'); c.width = 1024; c.height = 1536; const x = c.getContext('2d'); x.drawImage(f.im, 0, 0);
      const A = x.getImageData(0, 0, 1024, 1536).data, out = {};
      for (let py = 0; py < 1536; py++) {
        let e = null;
        for (let px = 0; px < 1024; px++) if (A[(py * 1024 + px) * 4 + 3] > 96) { if (side < 0) { e = px; break; } e = px; }
        if (e === null) continue; const h = Math.round(f.H - (py - f.top) * f.cmpp); const v = (e - f.cx) * f.cmpp;
        out[h] = side > 0 ? Math.max(out[h] ?? -1e9, v) : Math.min(out[h] ?? 1e9, v);
      }
      return out;
    };
    const R8 = prof(FIG.p8, 1), L2 = prof(FIG.p2, -1);
    let need = 0; for (const h in R8) if (h in L2) need = Math.max(need, R8[h] - L2[h]);
    FIG.p2.x = FIG.p8.x + need + 1; ROW[ROW.length - 1][1] = FIG.p2.x;
    // the outer extents (for the wide shot's frame): p1's right edge, p3's left edge, p2's right edge
    const ext = (f, side) => { const o = prof(f, side); return f.x + (side > 0 ? Math.max(...Object.values(o)) : Math.min(...Object.values(o))); };
    EXT = { p1R: ext(FIG.p1, 1), p3L: ext(FIG.p3, -1), p2R: ext(FIG.p2, 1) };
    console.warn(`ROW seg_02: p2 at ${FIG.p2.x.toFixed(1)} cm; extents p1 right ${EXT.p1R.toFixed(1)}, p3 left ${EXT.p3L.toFixed(1)}, p2 right ${EXT.p2R.toFixed(1)} cm`);
  }
  // a person's drawing placed: (drawing px) -> (cm, -cm) on the people plane
  // ONE transform per drawing (parts.js placement): the drawing and every part measured on it (lanyard ends) go through it
  const placeOf = f => placement({ x: f.x - f.cx * f.cmpp, y: -(BOTTOM + 1536 * f.cmpp), s: f.cmpp });
  const toCm = (f, p) => placeOf(f).toWorld(p);
  const cardX = f => { const [[x1], [x2]] = f.lan.map(p => toCm(f, p)); return (x1 + x2) / 2; };   // cm

  // ---------------- the cards ----------------
  // each card drawn once by the film's card printer (blank), plus its printed layers, as seg_01.js draws them (2026-11-21 card
  // unification): a band is solid 16-dot ink inside one field, the dots run together: ① the name field right of its label (the
  // name knocked out in paper white), ② the student number (one stripe per row), ③ the deviation value (2 rows), ④ the こころ
  // row (ink run past the oval). Paper shows between the rows and the paper rim, header, label column, timing marks and clip
  // always show: on a phone a read card is a paper card striped with black, never a black tile (docs/卡面状态.md 第四节:
  // the old whole-card flip to black made the row look like grey people looking down at phones). Her card is
  // web/lib/her_card.js's face, state 'band' all through 02.
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
    const u = w;
    if (f.her) {
      // her card: the film's one face (web/lib/her_card.js, docs/卡面状态.md), state 'band' from 01 k24 to 03 k40: the band
      // inside the name field, the grid at full strength. 01 k24's reprint is over before 02 starts, so it is printed already.
      const base = herCardFace(w, { state: 'band' });
      const { lines, labels } = herCardBoxes(w, { state: 'band' });
      for (const [n, b] of Object.entries(lines)) LAY.text(`her card ${n}`, 'card:print', b);
      for (const [n, b] of Object.entries(labels)) LAY.text(`her card label ${n}`, 'card:print', b);
      LAY.reg('her card', 'card', [0, 0, u, u / CARD_RATIO]);
      return { base, bands: [], rects: [], hit: null, w };
    }
    const hh = w / CARD_RATIO;
    // the passers-by's cards: the same printed bands as seg_01.js (copied verbatim, same seeds, so 01's last frame and 02's
    // first match): stripes inside the fields, paper between the rows, no whole-card flip (docs/卡面状态.md 第四节)
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
  const sweep = age => age < 0 ? 0 : Math.min(1, (age / FRAME + 1) / 3);       // 1/3 on the first frame, whole on the third
  const PR = {};                                         // per card: the time each band is printed
  const T_HIT = K(24), T_FALL = K(25), T_TRAIN = K(26), T_PUSH = K(27), T_TURN_IN = K(31.5), T_TURN = K(32);
  [['p1', 8], ['p3', 12], ['p6', 16], ['p9', 20]].forEach(([k, b]) => {
    PR[k] = [0, 1, 2, 3].map(j => K(b + j));
  });
  PR.p7kid = Array(4).fill(K(25)); PR.p7 = Array(4).fill(K(26)); PR.p8 = Array(4).fill(K(27)); PR.p2 = Array(4).fill(K(28));
  // ---- 02 ----
  const K36 = K(36), K37 = K(37), K38 = K(38), K40 = K(40);
  // the stabs: the measured onsets (docs/分镜/节拍核对.md k36-40); k38.5 and k39.5 fall on the half beat because the music does
  const STAB = [S.ev('stab 1 (齐奏, measured): cards yanked, step 1 (frame still)', K(38.5), 'half'),
                S.ev('stab 2 (齐奏): cards yanked, step 2 (frame still)', K(39)),
                S.ev('stab 3 (齐奏, measured): cards yanked to the full (frame still)', K(39.5), 'half')];
  // the pull-out is a registered whip, a snap in half a beat (lands on k36.5 without a bounce; MOTION AUDIT: a whip in a 44-frame
  // segment must be this short to keep the frames inside a jolt under 15 %), shot with a 180-degree shutter (renderAt)
  const PULL_D = BEAT / 2, PULL_PW = P('pullpw', 5);
  S.ev('pull out (whip) to the wide shot, her card centred: start', K36);
  S.ev('pull out (whip): lands, the frame dead still from here to the cut', K36 + PULL_D, 'half');
  S.ev('回送 car: pulls away to the right (she watches it go)', K36);
  S.ev('回送 car: its tail clears the frame (the car runs out of the still wide)', K37);
  S.ev('k38 last full-band beat: every card in the row flashes (read), hers does not; the frame stays still', K38);
  S.ev('cut to 03 on the fourth stab (03 starts here)', K40);
  // the redraws without the lower lanyard come in on 02's first frame, inside the whip's shutter blur (third round: with the
  // stabs' camera steps gone, a swap on stab 1 showed in the still wide as the five figures' line and tone redrawn in one
  // frame); from then on every lanyard below the collarbones is the code's ribbon, at rest until stab 1
  const T_SWAP = T0 - FRAME;                             // every shutter sample of f410 (13.650-13.667 s) is past it
  S.ev('swap to the lanyard-free redraws s02b_* (inside the whip blur)', K36);
  // the drawings on screen (HOLD AUDIT, reuse table). p1 never shows in 02 (out of frame left in 01's last framing and in the
  // wide shot). p9's lanyard is not drawn, he keeps t01_p9.
  S.hold('shot', 'platform (01 continues)', T0, T1, { kind: 'shot', onBeat: false });
  for (const k of ['p3', 'p6', 'p9', 'p7', 'p8', 'p2']) {
    const f = FIG[k], nm = p => p.split('/').pop().replace('.png', '');
    if (!f.re) { S.hold(k, nm(f.file), T0, T1, { file: f.file, onBeat: false }); continue; }
    S.hold(k, nm(f.re) + ' (01 drawing without the lower lanyard)', T0, T1, { file: f.re, onBeat: false });
  }
  S.hold('rin', 'r01_follow2', T0, T1, { file: FOLLOW, onBeat: false });

  // ---------------- the camera ----------------
  // cx: world px (people plane) at the frame's centre; z: the scale. k8 -> k24 one move: the frame trucks right and closes in
  // (z 0.9 -> 1.45, eased in on a log scale), its centre on a Hermite curve from 63.5 cm (cut in at speed, 19 cm a beat) to the
  // stop at k24 with her card at screen x 1000 (still moving 4 px a frame, then dead: the first frame at or after k24 is 10 px
  // past). The curve is set so that p1's card is in frame through k11 and she is in frame from k12, and every card being read
  // stays in frame. Then a jolt and a zoom kick on the cymbal, and a slow push-in k27 -> k36 (an outer scale about her face).
  const N_STOP = Math.ceil(T_HIT * FPS - 1e-9);
  const X8 = 63.5, V0 = 260, V1 = 60;                    // cm, cm per unit of the move
  const X24 = cardX(FIG.rin) - 40 / (PPC * ZS);
  const herm = u => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * X8 + (u3 - 2 * u2 + u) * V0 + (-2 * u3 + 3 * u2) * X24 + (u3 - u2) * V1; };
  const CX_STOP = X24 * PPC;
  const faceCm = toCm(FIG.rin, [620, 560]);              // her face in the drawing (px) -> cm: the push-in's anchor
  const ANCHOR = [960 + (faceCm[0] * PPC - CX_STOP) * ZS, 540 + (yOf(-faceCm[1]) - FY) * ZS];
  const PUSH = 1.5 / 1.45 - 1;                           // to 1.5x at k36 (the drawings shown at 1.5x their own pixels at most)
  const KICK = 0.034, SHAKE = 12;                        // the kick stays inside the 1.5x limit
  function camAt01(t) {
    const n = Math.round(t * FPS);
    let cx, z;
    if (n < N_STOP) { const u = (n / FPS - K(8)) / (T_HIT - K(8)); cx = herm(u) * PPC; z = Z0 * Math.pow(ZS / Z0, Math.max(0, u) ** 2); }
    else { cx = CX_STOP; z = ZS; }
    const over = n === N_STOP ? 10 / ZS : 0;
    const a = t - T_HIT;
    let sc = 1, dx = 0, dy = 0;
    if (a >= 0) {
      sc *= 1 + KICK * Math.exp(-a / 0.12);
      const amp = SHAKE * Math.exp(-a / 0.09);
      if (amp > 0.5) { const r = rng(n * 13 + 5); dx = Math.round((r() - 0.5) * 2 * amp * 0.6); dy = Math.round((r() - 0.5) * 2 * amp); }
    }
    if (t >= T_PUSH) sc *= 1 + PUSH * smooth((t - T_PUSH) / (K(36) - T_PUSH));
    return { cx, over, fy: FY, z, sc, dx, dy, dz: z, lw: 1 };
  }

  // ---------------- 02: a lens zoom on 01's last frame ----------------
  // base = 01's layers at the stop (cx = CX_STOP, z = ZS, no outer scale); the view is screen = M * (base - Q) + centre.
  // 01's last frame is M = its outer scale (1.5 / 1.45) about ANCHOR. People-plane base point of (X cm, h cm above the floor):
  const BA = PPC * ZS, BE = Math.round(960 - CX_STOP * ZS), BF = 540 + (YH + 140 * PPC - FY) * ZS;
  const base = (X, h) => [BA * X + BE, -BA * h + BF];
  const V01 = camAt01(K36), M_END = V01.sc;
  const Q_END = [ANCHOR[0] + (960 - ANCHOR[0]) / M_END, ANCHOR[1] + (540 - ANCHOR[1]) / M_END];
  // The wide shot: people plane at ZW (frame 1080 / (PPC * ZW) cm tall), its bottom edge 1.5 cm above the drawings' bottom
  // edge (25 cm), centred on her card. From k37 to the cut the wide stands dead still (third round, 2026-11-21, docs/制作约定.md
  // 第六节「整屏运动」: the k38 push and the three stab steps x1.35 / x1.8 / x2.4 are gone; the stabs are the cards' yank).
  const ZW = P('zw', 0.62), ACH = P('ach', 117);
  const HW = BOTTOM + 1.5 + 1080 / (PPC * ZW) / 2;
  const herCardCm = () => { const f = FIG.rin, e2 = f.lan.map(p => toCm(f, p)); return [cardX(f), -Math.max(e2[0][1], e2[1][1]) + 5]; };
  const M_W = ZW / ZS;
  const Q_W = base(herCardCm()[0], HW);
  // steps counted in frames from the first frame at or after the stab, never before it
  const nOf = (t, t0) => t < t0 - 1e-9 ? -1 : Math.floor((t - t0) * FPS + 1e-6);
  // the cards move on the stab's own frame (inside the sounding sixteenth); the frame does not move: the stab is the row's cards
  // yanked toward her in a dead-still wide (静动对比: the riff has stopped, only the cards move). The swap to the lanyard-free
  // redraws rides in the cards' jump on stab 1.
  const cardStep = n => n < 0 ? 0 : n === 0 ? 0.85 : n === 1 ? 1.1 : 1; // a card: 85 %, 110 % (overshoot), settled on the third
  // the pull-out: a hard ease-out from the k36 beat (01's slow push ends at rest on k36, so the jolt is the beat), landing on k37:
  // a registered whip (MOTION AUDIT whips, one-way, done in 12 frames f410-f421, no overshoot), then dead still
  const pullE = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), PULL_PW);
  function cam02(t) {
    let M, Q;
    if (t < K36 + PULL_D) {
      const e = pullE((t - K36) / PULL_D), tg = base(...herCardCm());
      const [z, fx, fy] = camLerp(M_END, Q_END, M_W, Q_W, e, tg); M = z; Q = [fx, fy];
    } else { M = M_W; Q = Q_W; }                       // k36.5 to the cut: dead still
    return { cx: CX_STOP, over: 0, fy: FY, z: ZS, sc: 1, dx: 0, dy: 0, M, Q, dz: ZS * M / M_END, lw: M / M_END };
  }
  const camAt = t => t < K36 - 1e-9 ? camAt01(t) : cam02(t);

  // ---------------- drawing helpers: layers in (X cm, -h cm) ----------------
  // a layer's transform: x_screen = 960 + (X*PPC*fs - cx*fp)*z, y_screen = 540 + (yOf(h, fs) - fy)*z; the people plane's
  // offset is rounded to whole pixels
  let VIEW = null;
  function layer(ctx, fs, fp) {
    const { cx, fy, z, over, sc, dx, dy, M, Q } = VIEW, a = PPC * fs * z;
    const e = Math.round(960 - (cx + over) * fp * z), f = 540 + (YH + 140 * PPC * fs - fy) * z;
    if (M) { ctx.setTransform(a * M, 0, 0, a * M, M * (e - Q[0]) + 960, M * (f - Q[1]) + 540); return 1 / (a * M); }
    const [ax, ay] = ANCHOR;
    ctx.setTransform(a * sc, 0, 0, a * sc, e * sc + ax * (1 - sc) + dx, f * sc + ay * (1 - sc) + dy);
    return 1 / (a * sc);
  }
  // the print screen: round teal dots on a 45-degree grid, 4 px pitch on screen at scale 1, anchored to the layer
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
  // the print screen: round teal dots on a 45-degree grid, 4 px pitch on screen at scale 1 (VIEW.dz: 01's VIEW.z carried on
  // through 02's lens zoom), anchored to the layer
  const dotPattern = (ctx, cover, rgbA = TEAL_RGB, alpha = 1) => dotsAt(ctx, cover, rgbA, alpha, 4 * VIEW.dz);
  const line = (ctx, px, a = 1) => { const m = ctx.getTransform(); ctx.lineWidth = px * VIEW.lw / m.a; ctx.strokeStyle = rgba(TEAL_RGB, a); };

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
  // 02: the car pulls away. From the k36 beat it accelerates evenly to the right (she watches it go), a blurred rush inside the
  // pull-out, and its tail clears the wide shot's right edge on k37 as the camera lands, so the whole wide shot is still: the
  // fence and the town behind the row.
  const TR_E = Math.round(960 - CX_STOP * TR * ZS);
  const X36 = X_LEFT + (K36 - T_TRAIN) * TR_V;
  const X_CLEAR = ((1920 + 40 - 960) / M_W + Q_W[0] - TR_E) / TA + TR_LEN;       // the front when the tail is 40 px past the edge
  const TR_ACC = 2 * (X_CLEAR - X36 - TR_V * (K37 - K36)) / ((K37 - K36) ** 2);   // car cm / s^2
  const front = t => t <= K36 ? X_LEFT + (t - T_TRAIN) * TR_V : X36 + TR_V * (t - K36) + 0.5 * TR_ACC * (t - K36) ** 2;
  const trSpeedPx = t => (t <= K36 ? TR_V : TR_V + TR_ACC * (t - K36)) * TA * (VIEW ? VIEW.M : 1) / FPS;   // screen px a frame
  console.warn(`TRAIN seg_02: pulls away k36, accel ${(TR_ACC / 100).toFixed(1)} m/s^2 on its plane, ${((TR_V + TR_ACC * (K37 - K36)) / 100 * 3.6).toFixed(0)} km/h at k37`);
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
  // the tone's screen: TONE_PITCH cm on the people plane, prefiltered at its device size (dotsAt; the same as seg_01.js)
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
  // body: its far, right-hand edge seen a little higher and shorter); shadow: its shadow on the coat behind it.
  // 02: pull = { th, yaw, dir, k }: the card yanked toward her. th (rad): the clip swung about the middle of the two lanyard ends
  // toward her (the card hangs from the clip, so it turns by the same angle, its lower edge toward her); yaw (rad): its face
  // turned to her about its own vertical axis (seen narrower, the edge away from her a little shorter, its near edge's thickness
  // showing); dir: +1 she is to the right; k (0..1): how taut the lower lanyard is (straight at 1).
  // the overlap between a card's perspective strips: 1.5 device px, in the card's local x units
  const SEAM = 1.5;
  const seamPad = ctx => { const m = ctx.getTransform(); return SEAM / Math.max(1e-6, Math.hypot(m.a, m.b)); };
  function hangCard(ctx, card, ends, t, key, { w = CARD_W, sx = 1, swing = 0, dip = 0, drop = 7, hitAt = null, skew = 0, far = 1, shadow = 0.55, pull = null, flash = 0 } = {}) {
    const [[x1, y1], [x2, y2]] = ends, mx = (x1 + x2) / 2, piv = Math.max(y1, y2), clipY = piv + drop;
    const h = w / CARD_RATIO;
    const m = ctx.getTransform(), lw = 2.6 * VIEW.lw / m.a;
    ctx.strokeStyle = TEAL; ctx.lineWidth = Math.max(lw, 0.3); ctx.lineCap = 'round';
    let cxp = mx + Math.sin(swing) * 1.2, cyp = clipY + dip, sag = 0.6, farSide = 1;
    if (pull && (pull.dx > 1e-4 || pull.yaw > 1e-4)) {
      cxp = mx + pull.dx * pull.dir; cyp = clipY - pull.up;
      swing = -pull.rot * pull.dir; sag = 0.6 * (1 - pull.k);
      sx = Math.cos(pull.yaw); far = 1 - 0.12 * Math.sin(pull.yaw); farSide = pull.dir;
      shadow = shadow * (1 + 1.6 * Math.sin(pull.yaw));
    }
    // a taut lanyard is drawn as the flat ribbon it is (0.7 cm wide, as wide as the strands in the drawings); at rest it stays the
    // thin line 01 drew, so 02's first frame matches 01's last
    if (pull && pull.k > 0) ctx.lineWidth = Math.max(lw, 0.3) * (1 - pull.k) + Math.max(0.7, lw) * pull.k;
    for (const [x, y] of ends) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + cxp) / 2, (y + cyp) / 2 + sag, cxp, cyp); ctx.stroke(); }
    ctx.lineWidth = Math.max(lw, 0.3);
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
    // towards the edge further from us (the right-hand edge, or the left-hand one when farSide is -1)
    ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-w / 2 + shadow, shadow * 1.6, w, h * (far < 1 ? (1 + far) / 2 : 1));
    if (shadow > 0.6) ctx.fillRect(-w / 2 + shadow * 0.5, shadow * 0.8, w, h * (far < 1 ? (1 + far) / 2 : 1));
    ctx.fillStyle = rgba(TEAL_RGB, 0.55); ctx.fillRect(-w / 2, 0.12, w, h);
    if (pull && pull.yaw > 1e-4) {                       // the near edge's thickness (a 3 mm holder), seen as the face turns away
      const thk = 0.3 * Math.sin(pull.yaw) / Math.max(0.2, sx), ex = farSide > 0 ? -w / 2 - thk : w / 2;
      ctx.fillStyle = rgba(TEAL_RGB, 0.9); ctx.fillRect(ex, 0, thk, h);
    }
    if (far >= 1) ctx.drawImage(fc, 0, 0, card.w, card.w / CARD_RATIO, -w / 2, 0, w, h);
    else {
      // each strip but the last is drawn SEAM device px wider, its source widened by the same fraction, so the next strip
      // covers its anti-aliased right edge (2026-11-21: with a 0.02 cm overlap, a quarter of a pixel, the backing showed through
      // every strip boundary as faint vertical lines across her card)
      const N = 12, cw = card.w / N, pad = seamPad(ctx);
      for (let i = 0; i < N; i++) {
        const f0 = i / N, fpos = farSide > 0 ? f0 + 0.5 / N : 1 - f0 - 0.5 / N, sh = 1 - (1 - far) * fpos, ex = i < N - 1 ? pad : 0;
        ctx.drawImage(fc, i * cw, 0, cw + ex * card.w / w, card.w / CARD_RATIO, -w / 2 + f0 * w, h * (1 - sh) / 2, w / N + ex, h * sh);
      }
    }
    if (flash > 0) {                                     // k38: the card is read: its face flashes paper white with a teal rim
      ctx.fillStyle = PAPER; ctx.globalAlpha = 0.88 * flash; ctx.fillRect(-w / 2, 0, w, h); ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba(TEAL_RGB, 0.75 * flash); ctx.lineWidth = 0.55; ctx.strokeRect(-w / 2 - 0.45, -0.45, w + 0.9, h + 0.9);
    }
    ctx.fillStyle = PAPER; ctx.fillRect(-0.7, -0.5, 1.4, 1.1); ctx.strokeStyle = TEAL; ctx.lineWidth = Math.max(lw * 0.7, 0.2); ctx.strokeRect(-0.7, -0.5, 1.4, 1.1);
    ctx.restore();
  }
  // k38 (the last full-band beat; the riff cuts out a frame later): every card in the row flashes once, as if read, over four
  // frames (the beat's frame whole, then 62 / 34 / 14 %); hers does not. In-picture accent in place of the old camera push.
  const N_FLASH = Math.ceil(K38 * FPS - 1e-9);
  const flashAt = t => { const n = Math.round(t * FPS) - N_FLASH; return n < 0 ? 0 : [1, 0.62, 0.34, 0.14][n] ?? 0; };
  // 02: the yank. On each stab every card is pulled one step toward her: the lanyard goes taut from the two collarbone points
  // (the tips of the drawn stubs), the clip swings out along the lanyard's length on an arc about the neck toward her, the
  // card swings with it (its long axis on the lanyard's line, its lower edge toward her) and its face turns to her about its
  // own long axis. The last step aims each card's line at her chest (clamped to 55-70 degrees from hanging); the mother's is
  // held lower so it does not cross her boy's face, the boy's short lanyard least. Steps: 50 %, 78 %, 100 % of the full yank.
  const D2R = Math.PI / 180, STEP_FR = [0.5, 0.78, 1];
  const herChest = () => { const f = FIG.rin, e = f.lan.map(p => toCm(f, p)); return [cardX(f), Math.max(e[0][1], e[1][1]) + 0.8 + 0.5 * CARD_W / CARD_RATIO]; };   // her card's centre (cm, y down)
  function yankFr(t) {
    let v = 0;
    for (let i = 0; i < 3; i++) v += (STEP_FR[i] - (i ? STEP_FR[i - 1] : 0)) * cardStep(nOf(t, STAB[i]));
    return v;
  }
  const YANK = { def: { lo: 55, hi: 70, yaw: 56 }, p7: { lo: 46, hi: 48, yaw: 58 }, kid: { lo: 34, hi: 34, yaw: 42 } };
  const PERSP = 45;                                       // cm: the card's turn seen in perspective (near edge longer)
  function composeFace(card, key, t) {
    const [fc, fx] = FACE;
    fx.setTransform(1, 0, 0, 1, 0, 0); fx.clearRect(0, 0, fc.width, fc.height);
    fx.drawImage(card.base, 0, 0);
    const bs = bandsAt(key, t);
    bs.forEach((f, i) => {
      if (f <= 0) return; const r = card.rects[i];
      fx.save(); fx.beginPath(); fx.rect(r[0] - 3, r[1] - 4, (r[2] + 6) * f + 3, r[3] + 8); fx.clip(); fx.drawImage(card.bands[i], 0, 0); fx.restore();
    });
    return fc;
  }
  // neck: the two collarbone points (cm); rest: the clip at rest (cm); xCard: the card's column (for the side she is on)
  function hangPulled(ctx, card, neck, rest, t, key, { w = CARD_W, who = 'def', tone = 0, flash = 0 } = {}) {
    const Y = YANK[who] || YANK.def, s = yankFr(t), h = w / CARD_RATIO;
    const m = [(neck[0][0] + neck[1][0]) / 2, (neck[0][1] + neck[1][1]) / 2];
    const her = herChest(), dir = her[0] > rest[0] ? 1 : -1;
    const aim = Math.atan2(Math.abs(her[0] - m[0]), her[1] - m[1]) / D2R;
    const thMax = Math.min(Y.hi, Math.max(Y.lo, aim)) * D2R, th = thMax * s;
    const L0 = Math.hypot(rest[0] - m[0], rest[1] - m[1]), L1 = Math.max(L0 * 1.12, who === 'kid' ? 6 : 14);
    const L = L0 + (L1 - L0) * Math.min(1, s / STEP_FR[0]);
    const C = [m[0] + dir * L * Math.sin(th), m[1] + L * Math.cos(th)];
    const yaw = Y.yaw * D2R * Math.min(1, s);
    const tr = ctx.getTransform(), lw = 2.6 * VIEW.lw / tr.a;
    // the taut lanyard: two straight flat strands as wide as the drawn stubs (0.85 cm), printed with the owner's tone like the
    // drawn stubs they continue (TEAL, then the person's halftone multiplied over it)
    ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.85 * (w / CARD_W) ** 0.5, lw);
    const strands = () => { ctx.beginPath(); for (const [x, y] of neck) { ctx.moveTo(x, y); ctx.lineTo(C[0], C[1]); } ctx.stroke(); };
    ctx.strokeStyle = TEAL; strands();
    if (tone > 0.001) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = tonePattern(ctx, Math.min(0.92, TONE_MAX * tone)); strands(); ctx.restore(); }
    ctx.save(); ctx.translate(C[0], C[1]); ctx.rotate(-dir * th);
    // the card turned by yaw about its own long axis: N strips across its width, each foreshortened and scaled in perspective
    const N = 18, ps = x => PERSP / (PERSP + x * Math.sin(yaw) * dir), cy = Math.cos(yaw);
    const corner = x => { const k = ps(x); return [x * cy * k, h * (1 - k) / 2, h * (1 + k) / 2]; };
    const [lx, lt, lb] = corner(-w / 2), [rx, rt, rb] = corner(w / 2);
    // the holder's edge (3 mm), seen on the side that comes toward us as the face turns away from it
    if (yaw > 1e-3) {
      const thk = Math.max(0.12, 0.45 * Math.sin(yaw)), ex = dir > 0 ? lx : rx, et = dir > 0 ? lt : rt, eb = dir > 0 ? lb : rb, sgn = dir > 0 ? -1 : 1;
      ctx.fillStyle = rgba(TEAL_RGB, 0.95); ctx.beginPath(); ctx.moveTo(ex, et); ctx.lineTo(ex + sgn * thk, et + 0.1); ctx.lineTo(ex + sgn * thk, eb - 0.1); ctx.lineTo(ex, eb); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = rgba(TEAL_RGB, 0.55); ctx.beginPath(); ctx.moveTo(lx, lt); ctx.lineTo(rx, rt); ctx.lineTo(rx, rb + 0.12); ctx.lineTo(lx, lb + 0.12); ctx.closePath(); ctx.fill();
    const fc = composeFace(card, key, t), cw = card.w / N, chh = card.w / CARD_RATIO, pad = seamPad(ctx);
    for (let i = 0; i < N; i++) {
      const x0 = -w / 2 + i * w / N, x1 = x0 + w / N, a0 = corner(x0), a1 = corner(x1), k = ps((x0 + x1) / 2);
      const dw = a1[0] - a0[0], ex = i < N - 1 ? pad : 0;     // overlap the next strip by SEAM device px (see hangCard)
      ctx.drawImage(fc, i * cw, 0, cw + ex * cw / dw, chh, a0[0], h * (1 - k) / 2, dw + ex, h * k);
    }
    if (flash > 0) {                                     // k38 read flash (as hangCard; the card still hangs flat here)
      ctx.fillStyle = PAPER; ctx.globalAlpha = 0.88 * flash; ctx.fillRect(lx, lt, rx - lx, lb - lt); ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba(TEAL_RGB, 0.75 * flash); ctx.lineWidth = 0.55; ctx.strokeRect(lx - 0.45, lt - 0.45, rx - lx + 0.9, lb - lt + 0.9);
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
  function drawPerson(ctx, f, t) {
    const c = f.cmpp, wcm = 1024 * c, hcm = 1536 * c, left = f.x - f.cx * c, top = -(BOTTOM + hcm);
    const pulled = t >= T_SWAP - 1e-9;
    const im = f.her ? (t >= T_TURN ? f.imF : t >= T_TURN_IN ? f.imT : f.im) : (pulled && f.imRe ? f.imRe : f.im);
    const box = [left, top, wcm, hcm];
    drawImageAt(ctx, placeOf(f), im);                    // the drawing through the same placement as its lanyard ends (toCm)
    if (!f.her) {
      if (f.kid) printTone(ctx, f, im, box, [{ level: toneOf('p7kid', t), clip: KID_PATH }, { level: toneOf('p7', t), clip: MOM_PATH }]);
      else printTone(ctx, f, im, box, [{ level: toneOf(f.key, t), clip: null }]);
    }
    const ends = f.lan.map(p => toCm(f, p));
    const restOf = (e, drop) => [(e[0][0] + e[1][0]) / 2, Math.max(e[0][1], e[1][1]) + drop];
    if (f.her) {
      const mo = hitMotion(t);
      hangCard(ctx, f.card, ends, t, 'rin', { sx: Math.max(0.42, mo.sx), swing: mo.swing, dip: mo.dip, drop: 0.8, hitAt: T_HIT, skew: mo.skew, far: mo.far, shadow: 0.9 });
    } else if (!pulled) {                                  // as 01 left them
      hangCard(ctx, f.card, ends, t, f.key, { drop: f.drop ?? 6, flash: flashAt(t) });
      if (f.kid) hangCard(ctx, f.kid.card, f.kid.lan.map(p => toCm(f, p)), t, f.key + 'kid', { w: 7.5, drop: 3, flash: flashAt(t) });
    } else {
      // the boy's card first, so the mother's taut lanyard and card pass in front of him (he sits in front of her side)
      if (f.kid) { const ke = f.kid.lan.map(p => toCm(f, p)); hangPulled(ctx, f.kid.card, f.kid.neck.map(p => toCm(f, p)), restOf(ke, 3), t, f.key + 'kid', { w: 7.5, who: 'kid', tone: toneOf('p7kid', t), flash: flashAt(t) }); }
      hangPulled(ctx, f.card, f.neck.map(p => toCm(f, p)), restOf(ends, f.drop ?? 6), t, f.key, { who: f.key === 'p7' ? 'p7' : 'def', tone: toneOf(f.key, t), flash: flashAt(t) });
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
  const herCard = (() => { const f = FIG.rin, ends = f.lan.map(p => toCm(f, p)); return { x: cardX(f), top: Math.max(ends[0][1], ends[1][1]) + 0.8 }; })();
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
    const f = FIG.rin, ends = f.lan.map(p => toCm(f, p)), cy = Math.max(ends[0][1], ends[1][1]) + 0.8, cx = cardX(f);
    const wpx = CARD_W * SX_REST, hpx = CARD_W / CARD_RATIO;
    const box = [cx - wpx / 2, cy, wpx, hpx];
    // card canvas px -> world px on the people plane (the card at rest), then the frame check by the camera as it actually moves
    const toW = ([x, y]) => [(box[0] + x / CU * wpx) * PPC, yOf(-(box[1] + y / CU * CARD_W))];
    const bigW = ([x, y]) => [x * PPC, yOf(-y)];
    const views = (a, b) => frameTimes(T0, a, b).map(t => { const v = camAt(t); return { t, z: v.z * v.sc, fx: v.cx + (ANCHOR[0] - 960) / v.z * (1 - 1 / v.sc), fy: v.fy + (ANCHOR[1] - 540) / v.z * (1 - 1 / v.sc) }; });
    // 02's camera as a type.js view: screen = M * ZS * (world - f) + centre
    const views02 = frameTimes(T0, T0, T1).map(t => { const v = camAt(t); return { t, z: ZS * v.M, fx: (v.Q[0] - BE) / ZS, fy: FY + (v.Q[1] - 540) / ZS }; });
    LAY.frameCheck(`seg_02${VAR} her card (k36-k40)`, { sheets: { card: toW, 'card:print': toW }, views: views02 });
  }
  // ---------------- MOTION AUDIT (docs/制作约定.md 第六节「整屏运动」) ----------------
  // every frame's view as shown (02's lens zoom as a camera.js view), with 01's last frame in front so the whip's first step
  // (f409 -> f410) is seen too. Registered: the k36 pull-out (whip). No 大击, no other jolt: the stabs move the cards only.
  let MOTION_R;
  {
    const v01 = (t => { const v = camAt01(t); return { t, z: v.z * v.sc, fx: v.cx + (ANCHOR[0] - 960) / v.z * (1 - 1 / v.sc), fy: v.fy + (ANCHOR[1] - 540) / v.z * (1 - 1 / v.sc), dx: v.dx, dy: v.dy }; })(T0 - 1 / FPS);
    const mv = frameTimes(T0, T0, T1).map(t => { const v = camAt(t); return { t, z: ZS * v.M, fx: (v.Q[0] - BE) / ZS, fy: FY + (v.Q[1] - 540) / ZS }; });
    MOTION_R = motionAudit(`seg_02${VAR}`, [v01, ...mv], { whips: [[K36, 'k36 pull-out to the wide: 段落交界, the riff stops (one-way, 12 frames, no overshoot)']] });
  }
  // ---------------- PART AUDIT (web/lib/parts.js): every lanyard end on the drawing it is drawn over ----------------
  // each end must lie on the drawn strand (its colour: the strand pixel `core` px above the end, within 45) and at its terminal
  // (paper or cloth within 10 px below), measured on the drawing's own pixels; p9's lanyard is not drawn: his ends must be on
  // his hoodie. Every drawing must be 1024 x 1536 (placement draws it at its own pixels times cmpp).
  {
    const RAW_FOLLOW = await img(FOLLOW);
    const strandCls = (px, [x, y], core) => {
      const cs = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) cs.push(px.at(x + dx, y - core + dy));
      const med = [0, 1, 2].map(i => cs.map(c => c[i]).sort((a, b) => a - b)[4]);
      return p => p[3] > 200 && Math.hypot(p[0] - med[0], p[1] - med[1], p[2] - med[2]) < 45;
    };
    const lanAudit = (drawing, part, image) => {
      if (image.width !== 1024 || image.height !== 1536) throw new Error(`seg_02: ${drawing} is ${image.width} x ${image.height}, not 1024 x 1536`);
      const a = partOf(PA, drawing, part), px = pixelsOf(image);
      if (a.point) { partAudit('seg_02', drawing, part, { image, points: a.ends, on: PIX.opaque, r: 0, maxOffPct: 0 }); return; }
      a.ends.forEach((e, i) => {
        const cls = strandCls(px, e, a.core ?? 5), side = i ? 'right' : 'left';
        endsAudit('seg_02', drawing, `${part} ${side} end on the drawn strand`, { image, ends: [e], on: cls, r: a.r ?? 2 });
        let k = 3; while (k < 10 && cls(px.at(e[0], e[1] + k))) k++;
        endsAudit('seg_02', drawing, `${part} ${side} end at the strand's terminal`, { image, ends: [[e[0], e[1] + k]], on: p => !cls(p), r: 0 });
      });
    };
    const nm = p => p.split('/').pop().replace('.png', '');
    for (const k of ['p1', 'p3', 'p6', 'p9', 'p7', 'p8', 'p2']) {
      const f = FIG[k];
      lanAudit(nm(f.file), 'lan', f.im);
      if (f.kid) lanAudit(nm(f.file), 'kidLan', f.im);
      if (f.imRe) { lanAudit(nm(f.re), 'neck', f.imRe); if (f.kid) lanAudit(nm(f.re), 'kidNeck', f.imRe); }
    }
    lanAudit('r01_follow2', 'lan', RAW_FOLLOW);
  }
  S.finish();
  {
    const zs = frameTimes(T0, T0, T1).map(t => ZS * camAt(t).M);
    publishAudit(S, LAY, { zoom: [+Math.min(...zs).toFixed(3), +Math.max(...zs).toFixed(3)], maxDrawingScale: +Math.max(...zs).toFixed(3),
                           p2x: +FIG.p2.x.toFixed(1), extents: EXT, render: 'frames 410-453', wide: ZW, motion: MOTION_R, parts: partReport(`seg_02${VAR}`) });
    console.warn(`ZOOM seg_02${VAR}: people plane ${Math.min(...zs).toFixed(3)}-${Math.max(...zs).toFixed(3)} (drawings shown at that many times their own pixels; hard limit 1.5)`);
  }

  // the car's motion blur: when it moves more than 6 px a frame it is drawn at several times across half a frame (a 180-degree
  // shutter) on its own layer and the samples averaged ('lighter' with alpha 1/N adds premultiplied colour: the mean)
  const [TRA, TRAg] = mk(W, 1080), [TRB, TRBg] = mk(W, 1080);
  function drawTrainBlurred(ctx, t) {
    if (t < T_TRAIN - FRAME) return;
    const px = trSpeedPx(t), n = Math.min(40, Math.max(1, Math.ceil(px / 10)));
    if (n === 1) { ctx.save(); drawTrain(ctx, t); ctx.restore(); return; }
    TRAg.setTransform(1, 0, 0, 1, 0, 0); TRAg.globalCompositeOperation = 'source-over'; TRAg.globalAlpha = 1; TRAg.clearRect(0, 0, W, 1080);
    for (let i = 0; i < n; i++) {
      TRBg.setTransform(1, 0, 0, 1, 0, 0); TRBg.clearRect(0, 0, W, 1080);
      TRBg.save(); drawTrain(TRBg, t - (i / (n - 1)) * 0.5 * FRAME); TRBg.restore();
      TRAg.globalCompositeOperation = 'lighter'; TRAg.globalAlpha = 1 / n; TRAg.drawImage(TRB, 0, 0);
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(TRA, 0, 0); ctx.restore();
  }

  // one frame of the scene at time t on ctx (innerBlur: the car's own motion blur; off inside the camera's shutter, whose
  // sub-frame samples already smear the car)
  const drawScene = (ctx, t, innerBlur = true) => {
    VIEW = camAt(t);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, 1080);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    for (const fn of [drawTown, drawFence, c => innerBlur ? drawTrainBlurred(c, t) : drawTrain(c, t), drawPlatform,
                      c => { layer(c, 1, 1); for (const [k] of ROW) drawPerson(c, FIG[k], t); }, drawCanopy, c => drawBig(c, t)]) { ctx.save(); fn(ctx); ctx.restore(); }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  // the whip's frames: a 180-degree shutter, 16 samples across the half frame before t, averaged in float (no 8-bit rounding
  // drift against the neighbouring frames)
  const [, SCBg] = mk(W, 1080), ACC = new Float32Array(W * 1080 * 3);
  window.renderAt = async t => {
    if (!(t > K36 && t < K36 + PULL_D + FRAME)) { drawScene(g, t); return; }
    const n = 16; ACC.fill(0);
    for (let i = 0; i < n; i++) {
      drawScene(SCBg, t - (i / (n - 1)) * 0.5 * FRAME, false);
      const d = SCBg.getImageData(0, 0, W, 1080).data;
      for (let p = 0, q = 0; p < d.length; p += 4, q += 3) { ACC[q] += d[p]; ACC[q + 1] += d[p + 1]; ACC[q + 2] += d[p + 2]; }
    }
    VIEW = camAt(t);
    const out = g.createImageData(W, 1080), o = out.data;
    for (let p = 0, q = 0; p < o.length; p += 4, q += 3) { o[p] = Math.round(ACC[q] / n); o[p + 1] = Math.round(ACC[q + 1] / n); o[p + 2] = Math.round(ACC[q + 2] / n); o[p + 3] = 255; }
    g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(out, 0, 0);
  };
  await window.renderAt(P('t0', 14.2));
}
