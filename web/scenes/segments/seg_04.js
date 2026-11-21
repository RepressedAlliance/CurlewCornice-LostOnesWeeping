// Segment 04 A1 (docs/分镜/04_A1.md 第 4 稿), k71-k104, global frames [798, 1165). Three shots:
//   S1 k71-k92  her card back seen from above on the teal ground (the lanyard runs up out of frame). A 2 mm lead holder lies
//               along the card's bottom margin, her hand on its push button (H1, art/cut/h04_push.png): k72-k78 seven clicks,
//               the lead grows 0.5 cm a click over the printed centimetre scale, the camera glides in after it (round 10: no steps). k79 she picks
//               the holder up (H2, h04_hold.png) over the teal double line (the 静脈); k80-k83 it comes down a step a beat, k84
//               it touches, k84.5 a crack, k85 the tip crushes into a lump of graphite (the hand jolts, crumbs fly; the frame is still),
//               k85.5 the hand leaves; k86 the lump soaks in. k87-k91 the black leaks OUT OF THE LUMP a step a beat: thick at the
//               lump and thinning away from it, along the double line both ways (the left arm runs out to a point), then the
//               right arm breaks down through the memo lines between her words, wicks along two ruled lines, and on k91
//               (「飛び」) runs off the card's right edge across the teal ground. Dry pencil black: hatched, matte, its edges
//               pencil strokes spilling past the edge; no drips, no beads, no round ends (round 8: the old black closed into an
//               even box round the memo field and hung drips under the double line).
//   S2 k92-k100 hard cut on the heaviest beat to her, CLOSE (waist up, her face about 27% of the frame), on the right of the
//               frame. The black comes in from the left edge where it left the card and bursts out behind her: in three frames
//               it floods the paper behind her (the enlarged card back) with hatched graphite, and goes further on k93, k96, k98;
//               her words are left paper-white in the black as she sings them (出すもんで, then レスポールさえも凶器に in a second
//               column, read right to left), as in Demo 2. k94 the reader prints はみ出しています lightly on the paper still left
//               at the lower right. Drawings (one master and its variant): k92 P4a reaching up behind her shoulder to the bag's
//               zip, eyes down and aside, cold (s04a_zip); k95 P4b the guitar drawn out over her shoulder like a sword, the gold
//               top out of the bag on 「レ」 (s04a_half).
//   S3 k100-k104 cut on the action (line 4 opens on the bar line), round 9: as close as S2, from the other side; the guitar is
//               up on her right shoulder carried like a bat, her fist at the headstock end, the gold body beside her head,
//               a cold sidelong look down past us (s04d_shoulder); the cut on the action is the accent; 変えてしまいました left
//               white in the black on the right; the black takes one more step on k102.
// Her card is drawn blank in the drawings; its face is web/lib/her_card.js's (03 k40 on: 読み取れません, ロストワン, の号哭), laid
// into the drawn holder through its measured corners as a perspective, inside the card only: no pasted card, no drop shadows
// on her (round 8: those read as a paper doll stuck on). The card BACK in S1 is her_card.js's ruled back (herCardBackRuled:
// this segment's layout, 全片分镜 改定 15 卡背以 04 的罫线排位为准, moved into the library), see the note at S1.
// Everything comes from web/lib/: the beat and the drawings' timeline (score.js), layout and frame audit (type.js), the camera
// (camera.js), the hands (hand.js), the 16-dot print, her pencil and the white letters (print.js), the lyrics by line number
// (lyrics.js), the colours (palette.js).
import { CARD_RATIO } from '../../lib/card.js';
import { herCardFace, herCardBoxes, herCardBackRuled, herCardBackRuledBoxes, ruledLineBox, HER_BACK_RULED } from '../../lib/her_card.js';
import { BEAT, FRAME as FR, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { createLayout, measure } from '../../lib/type.js';
import { createCamera, camLerp, frameTimes, move, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, axisOf, axisAudit, partAudit, samplesAlong, PIX, partReport } from '../../lib/parts.js';
import { createHand } from '../../lib/hand.js';
import { print16, print16Box, pencilWriter, vertical, whiteLetter, sungShown, sungBuild } from '../../lib/print.js';
import { loadLyrics, lyricAudit, onsetFrame } from '../../lib/lyrics.js';
import { PAPER_CARD, PAPER_RGB, FIBRE_RGB, TEAL, TEAL_RGB, FIELD, FIELD_SHADOW, GRAPHITE, INK_RGB, PENCIL, GRAPHITE_FIELD,
         GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, HAND_SHADOW, rgba } from '../../lib/palette.js';

export default async function seg04(H) {
  const { g, W, rng, img, rinPalImage } = H;
  const F0 = 798, F1 = 1165, SEG = [F0 / 30, F1 / 30];
  const S = createScore('seg_04', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const K = beatV;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };
  const PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
  const LY = await loadLyrics({ within: [26.0, 42.0] });
  const L0 = LY.lineAt(0), L1 = LY.lineAt(1), L2 = LY.lineAt(2), L3 = LY.lineAt(3), L4 = LY.lineAt(4);
  const T71 = K(71), T79 = K(79), T84 = K(84), T85 = K(85), T86 = K(86), T88 = K(88), T92 = K(92), T95 = K(95), T100 = K(100), T103 = K(103);

  // ---- the rock, round 10 (2026-11-21 第二版反馈: 「你为什么要一直抖动屏幕？……我希望的是视频看着符合节奏 和摇滚的节奏对上 而且不是
  // 一直抖动头晕」「不是完全不能晃 但是不能晕」; docs/制作约定.md 第六节 整屏运动, MOTION AUDIT). The beat is carried inside the
  // frame (the lead's clicks, the hand coming down, the crush, the black stepping out, the flood, the swap, the cuts); the
  // camera only glides (eased, one direction) and is hit twice in the segment: k72 (ordinary, 1.4%) and k88 (大击, 3.5%), both
  // one-way kicks that stay. stepP is the shape of those kicks: in by n frames with a small give (3.7% over), then still.
  const backOut = p => 1 + 2 * Math.pow(p - 1, 3) + Math.pow(p - 1, 2);
  const stepP = (tt, t0, n = 4) => tt < t0 ? 0 : backOut(Math.min(1, ((tt - t0) / FR + 1) / n));

  // ---------------------------------------------------------------------------------------------------------------------
  // graphite: matte pencil black with hatching (the same make as Demo 2's black), as a repeating tile in world units
  // ---------------------------------------------------------------------------------------------------------------------
  function graphiteTile(n, lmin, lmax, wmin, wmax, count, seed) {
    const [c, x] = mk(n, n), r = rng(seed); x.fillStyle = GRAPHITE_FIELD; x.fillRect(0, 0, n, n); x.lineCap = 'round';
    for (let k = 0; k < count; k++) {
      { const light = r() < 0.5; x.strokeStyle = rgba(light ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, light ? 0.35 + r() * 0.35 : 0.3 + r() * 0.3); } x.lineWidth = wmin + r() * (wmax - wmin);
      const px = r() * n, py = r() * n, l = lmin + r() * (lmax - lmin), a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16;
      for (const [ox, oy] of [[0, 0], [n, 0], [-n, 0], [0, n], [0, -n], [n, n], [-n, -n], [n, -n], [-n, n]]) {
        x.beginPath(); x.moveTo(px + ox, py + oy); x.lineTo(px + ox + Math.cos(a) * l, py + oy + Math.sin(a) * l); x.stroke(); }
    }
    return c;
  }
  const TILE_S1 = graphiteTile(256, 14, 40, 1.0, 2.6, 520, 41);       // S1: world px, seen at 1.75-2.4x
  const patCache = new Map();
  const patOf = (ctx, tile) => { if (!patCache.has(tile)) patCache.set(tile, ctx.createPattern(tile, 'repeat')); return patCache.get(tile); };
  const HATCH = [-0.5, 0.55];                                            // the two pencil angles of the graphite

  // A vein of black leaking from a source: a centre line [[x, y, halfWidth], ...] (thick at the source, thinning to its far
  // end), filled as one outline with the graphite tile, its two edges a little uneven (paper fibre). The front, while it runs,
  // narrows to a point (never a round bead). Its burrs are short pencil strokes at the hatch angles spilling over the edges.
  function makeVein(pts, seed, { burr = 5, rough = 0.1 } = {}) {
    const r = rng(seed), ph = [r() * 10, r() * 10, r() * 10, r() * 10];
    const raw = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0, w0] = pts[i], [x1, y1, w1] = pts[i + 1], len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(len / 2));
      for (let j = (i ? 1 : 0); j <= n; j++) { const u = j / n; raw.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, w0 + (w1 - w0) * u]); }
    }
    // a smoothed centre line (the corners of the route rounded), arc length, normals by central difference
    const P = raw.map((p, i) => { if (i < 3 || i > raw.length - 4) return p.slice(); let sx = 0, sy = 0, c = 0;
      for (let k = -8; k <= 8; k++) { const q = raw[Math.min(raw.length - 1, Math.max(0, i + k))]; sx += q[0]; sy += q[1]; c++; } return [sx / c, sy / c, p[2]]; });
    const ds = []; let s = 0;
    for (let i = 0; i < P.length; i++) {
      if (i) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const wob = 1 + rough * (0.6 * Math.sin(s * 0.045 + ph[0]) + 0.4 * Math.sin(s * 0.13 + ph[1]));
      ds.push({ x: P[i][0], y: P[i][1], w: P[i][2] * wob, s, nx: -(b[1] - a[1]) / l, ny: (b[0] - a[0]) / l,
                jl: 0.5 * Math.sin(s * 0.9 + ph[2]) + (r() - 0.5) * 0.7, jr: 0.5 * Math.sin(s * 0.8 + ph[3]) + (r() - 0.5) * 0.7 });
    }
    const burrs = [];
    for (let i = 0; i < ds.length; i += 2) { const d = ds[i]; if (d.w < 1.6) continue;
      for (const side of [-1, 1]) { if (r() < 0.55) continue;
        const ox = d.nx * side, oy = d.ny * side; let best = 0, ba = 0;
        for (const h of HATCH) for (const a of [h, h + Math.PI]) { const dot = Math.cos(a) * ox + Math.sin(a) * oy; if (dot > best) { best = dot; ba = a; } }
        if (best < 0.35) continue;
        const sc = Math.min(1, d.w / 7);
        burrs.push({ s: d.s, side, i, a: ba + (r() - 0.5) * 0.12, l: burr * sc * (0.35 + r() * 0.75), lw: 0.5 + r() * 0.8 * sc, al: 0.55 + r() * 0.35 }); } }
    return { ds, burrs, len: s };
  }
  function drawVein(ctx, v, L, tile, taper = 22) {
    if (L <= 0) return;
    const ds = v.ds, n = ds.findIndex(d => d.s > L), m = n < 0 ? ds.length : n;
    if (m < 2) return;
    const wf = d => d.w * Math.pow(Math.min(1, Math.max(0, (L - d.s) / taper)), 0.75);
    ctx.save(); ctx.fillStyle = patOf(ctx, tile); ctx.beginPath();
    for (let i = 0; i < m; i++) { const d = ds[i], w = wf(d); const x = d.x + d.nx * (w + (w > 1 ? d.jl : 0)), y = d.y + d.ny * (w + (w > 1 ? d.jl : 0)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    { const lx = ds[m - 1].x + (ds[Math.min(ds.length - 1, m)].x - ds[m - 1].x) * 0, ly = ds[m - 1].y; ctx.lineTo(lx, ly); }
    for (let i = m - 1; i >= 0; i--) { const d = ds[i], w = wf(d); ctx.lineTo(d.x - d.nx * (w + (w > 1 ? d.jr : 0)), d.y - d.ny * (w + (w > 1 ? d.jr : 0))); }
    ctx.closePath(); ctx.fill();
    ctx.lineCap = 'butt';
    for (const br of v.burrs) {
      if (br.s > L - taper) continue; const d = ds[br.i], w = wf(d), bx = d.x + d.nx * br.side * (w - 0.6), by = d.y + d.ny * br.side * (w - 0.6);
      ctx.strokeStyle = rgba(INK_RGB, br.al); ctx.lineWidth = br.lw; ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(br.a) * br.l, by + Math.sin(br.a) * br.l); ctx.stroke();
    }
    ctx.restore();
  }
  // the crushed lead: a faceted cake of graphite (angular, like a crushed stick, not a drop), hatch burrs round it, and a few
  // angular crumbs thrown out on the crush
  function makeLump(cx, cy, R, seed, burr, sy = 0.86) {
    const r = rng(seed), n = 13, pts = [];
    for (let i = 0; i < n; i++) { const a = (i + (r() - 0.5) * 0.5) / n * Math.PI * 2, rr = R * (0.78 + r() * 0.36) * (1 + 0.12 * Math.cos(a) ** 2); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy, a]); }
    const burrs = [];
    for (let i = 0; i < 70; i++) { const k = Math.floor(r() * n), [x0, y0] = pts[k], [x1, y1] = pts[(k + 1) % n], u = r(), x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u;
      const ox = x - cx, oy = y - cy, ol = Math.hypot(ox, oy) || 1; let best = 0, ba = 0;
      for (const h of HATCH) for (const a of [h, h + Math.PI]) { const dot = (Math.cos(a) * ox + Math.sin(a) * oy) / ol; if (dot > best) { best = dot; ba = a; } }
      if (best < 0.3) continue; burrs.push({ x: x - ox / ol, y: y - oy / ol, a: ba + (r() - 0.5) * 0.15, l: burr * (0.4 + r() * 0.8), lw: 0.5 + r() * 0.9, al: 0.6 + r() * 0.3 }); }
    const crumbs = [];
    for (let k = 0; k < 8; k++) { const a = Math.PI * (-0.15 + r() * 1.3), d = R * (1.4 + r() * 0.9), s = R * (0.05 + r() * 0.06), rot = r() * 7;
      crumbs.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.8, tri: [0, 1, 2].map(j => [Math.cos(rot + j * 2.1 + r() * 0.5) * s * (0.7 + r() * 0.6), Math.sin(rot + j * 2.1 + r() * 0.5) * s * (0.7 + r() * 0.6)]) }); }
    return { pts, burrs, crumbs, cx, cy, R };
  }
  function drawLump(ctx, m, tile, grow = 1, crumbU = 1) {
    if (grow <= 0) return;
    ctx.save(); ctx.translate(m.cx, m.cy); ctx.scale(grow, grow); ctx.translate(-m.cx, -m.cy);
    ctx.fillStyle = patOf(ctx, tile); ctx.beginPath(); m.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
    ctx.lineCap = 'butt';
    for (const br of m.burrs) { ctx.strokeStyle = rgba(INK_RGB, br.al); ctx.lineWidth = br.lw; ctx.beginPath(); ctx.moveTo(br.x, br.y); ctx.lineTo(br.x + Math.cos(br.a) * br.l, br.y + Math.sin(br.a) * br.l); ctx.stroke(); }
    ctx.restore();
    if (crumbU !== null) { ctx.fillStyle = rgba(INK_RGB, 0.9); for (const c of m.crumbs) { const x = m.cx + (c.x - m.cx) * crumbU, y = m.cy + (c.y - m.cy) * crumbU;
      ctx.beginPath(); c.tri.forEach(([dx, dy], i) => i ? ctx.lineTo(x + dx, y + dy) : ctx.moveTo(x + dx, y + dy)); ctx.closePath(); ctx.fill(); } }
  }
  // a vein's reveal: steps [[t, L], ...]; each step eases out over 0.6 beat from the previous length (Demo 2's front)
  // (a step [t, L, n] bursts out in n frames instead: k88's crash, the black leaking out of the lump in one go)
  const reveal = (steps, t) => { let L = 0, prev = 0; for (const [t0, m, n] of steps) { if (t < t0) break;
      const u = n ? ease(((t - t0) / FR + 1) / n) : 1 - Math.pow(1 - Math.min(1, (t - t0) / (BEAT * 0.6)), 3); L = prev + (m - prev) * u; prev = m; } return L; };

  // ---------------------------------------------------------------------------------------------------------------------
  // S1: her card back seen from above, on the teal ground (card units: the card is 637 x 425, placed at CXO, CYO in the world;
  // the card's layout is the one 09, 11, 14, 16 draw: docs/分镜/04 第 6 节)
  // The back is web/lib/her_card.js's ruled back (herCardBackRuled, 2026-11-21 card unification): this segment's layout,
  // which 全片分镜 改定 15 makes the film's reference for her back (11 writes on the same ruled lines), moved into the library
  // unchanged; no card layout numbers of this segment's own. S1's design (passed review) is built on it: the stab on the teal
  // double line, the black along the double line and between the memo lines and off the card's right edge, her lines on the
  // ruled lines, the centimetre scale for the lead. (her_card.js's herCardBack is drawCard's dashed-area back, used by 09;
  // which of the two is the film's one back is reported as open.)
  // ---------------------------------------------------------------------------------------------------------------------
  const HB = HER_BACK_RULED;
  const CW = HB.ref, CH = CW / CARD_RATIO, CXO = 233, CYO = 540 - CH / 2;  // card units = the ruled back's ref units (637 wide)
  const RES = 3;                                                         // the card's print is rendered at 3x (seen at <= 2.4x)
  const RULE_Y = HB.ruleY, DBL = HB.dbl;
  const STAB = [294, (DBL[0] + DBL[1]) / 2];                             // where she stabs: on the double line, left of centre
  const TXT = HB.text, lineBoxOf = ruledLineBox, SC = HB.scale;
  const CARD = herCardBackRuled(CW * RES);
  const MARGIN = 11;                                                       // 20 screen px at the 1.75x of k91
  const grow = ([x, y, w, h], m) => [x - m, y - m, w + 2 * m, h + 2 * m];
  for (const [nm, b] of Object.entries(herCardBackRuledBoxes())) LAY.text(nm, 'card', b);
  LAY.text('line 0 (6th ruled line)', 'card', grow(lineBoxOf(5, L0.length), MARGIN));
  LAY.text('line 1 (2nd ruled line)', 'card', grow(lineBoxOf(1, L1.length), MARGIN));
  const L2A = L2.slice(0, 7), L2B = L2.slice(7);                         // 病弱な愛が飛び on the card; 出すもんで in S2
  LAY.text('line 2, first half (4th ruled line)', 'card', grow(lineBoxOf(3, L2A.length), MARGIN));

  // the black on the card back (card units), every step on a beat (docs/分镜/04 第 4 节 k86-k91, round 8). It all comes out of
  // the lump at the stab point: the right arm (the one that leaves the card) is the thickest, 15 at the lump (52 px across on
  // screen at k91's 1.75x) thinning to 4.5 where it leaves the card (16 px); the left arm runs out to a point before the frame
  // line; three wicks along printed lines run out to points. Nothing follows the frame lines (the old black boxed the memo).
  const VR = makeVein([[STAB[0] + 6, STAB[1], 9.5], [360, 144, 9.5], [410, 145, 9.2], [440, 146.5, 8.6], [462, 152, 8.2], [472, 170, 7.8], [478, 200, 7.4], [492, 232, 7],
                       [522, 256, 6.6], [552, 268, 6.4], [572, 292, 6.2], [596, 314, 5.6], [622, 321, 5], [CW + 4, 323, 4.6], [CW + 140, 326, 4.4], [CW + 1100, 334, 4.2]], 11, { burr: 5 });
  const VL = makeVein([[STAB[0] - 4, STAB[1], 8], [250, 143.5, 7.4], [200, 143.8, 6.5], [150, 144.2, 5], [108, 144.6, 3.4], [76, 145, 2], [56, 145.2, 0.6]], 12, { burr: 4.5 });
  const WK = [
    makeVein([[446, 147, 6.5], [462, 147.2, 5], [480, 147.4, 3.2], [492, 147.6, 1.2], [498, 147.8, 0.4]], 21, { burr: 3 }),   // the double line on past the turn (short of the memo note)
    makeVein([[560, 266, 5], [530, 266.4, 3.8], [500, 266.2, 2.4], [476, 266.5, 1.1], [460, 266.6, 0.4]], 22, { burr: 3 }),          // ruled line 3, back to the left
    makeVein([[488, 226, 4.6], [522, 226.3, 3.4], [556, 226.2, 2], [584, 226.4, 0.5]], 23, { burr: 3 }),                             // ruled line 2, on to the right
  ];
  const LUMP = makeLump(STAB[0], STAB[1] + 3.5, 25, 13, 4, 0.62);   // wider than tall: clear of the rules above it
  const lenAt = (v, x, y) => { let best = 0, bd = 1e9; for (const d of v.ds) { const dd = Math.hypot(d.x - x, d.y - y); if (dd < bd) { bd = dd; best = d.s; } } return best; };
  const B87 = S.ev('black runs out of the lump along the double line', K(87));
  const B88 = S.ev('black turns down through the memo (bar line)', T88), B89 = S.ev('black runs down between her lines', K(89));
  const B90 = S.ev('black reaches the 4th line, wicks along the lines', K(90)), B91 = S.ev('black runs off the card (飛び)', K(91));
  const VR_STEPS = [[B87, lenAt(VR, 410, 145)], [B88, lenAt(VR, 476, 185), 3], [B89, lenAt(VR, 552, 268)], [B90, lenAt(VR, 622, 321)], [B91, VR.len]];
  const VL_STEPS = [[B87, lenAt(VL, 200, 144)], [B88, VL.len, 3]];
  const WK_STEPS = [[[B88, WK[0].len * 0.5, 3], [B89, WK[0].len]], [[B90, WK[1].len]], [[B90, WK[2].len * 0.6], [B91, WK[2].len]]];
  // the black's room, registered in pieces along each vein (one sheet each, with every word on the card): nothing touches a word
  const CARD_TEXT = LAY.boxes.filter(b => b.sheet === 'card').map(b => [b.name, b.box]);
  { let i = 0; for (const [nm, v, bw] of [['right arm', VR, 5], ['left arm', VL, 4.5], ['wick 1', WK[0], 3.5], ['wick 2', WK[1], 3], ['wick 3', WK[2], 3]]) {
      for (let k = 0; k < v.ds.length; k += 6) { const d = v.ds[k]; if (d.x > CW) break; const r = d.w + bw + 1;
        LAY.reg(`black: ${nm} ${k}`, `card:black${i}`, [d.x - r, d.y - r, 2 * r, 2 * r]); for (const [tn, tb] of CARD_TEXT) LAY.text(tn, `card:black${i}`, tb); i++; } }
    const xs = LUMP.pts.map(p => p[0]), ys = LUMP.pts.map(p => p[1]), m = 2;
    LAY.reg('black: the lump', `card:black${i}`, [Math.min(...xs) - m, Math.min(...ys) - m, Math.max(...xs) - Math.min(...xs) + 2 * m, Math.max(...ys) - Math.min(...ys) + 2 * m]); for (const [tn, tb] of CARD_TEXT) LAY.text(tn, `card:black${i}`, tb); }

  // ---- the lead holder and her hand (H1 pushing the lead, H2 holding it to stab): one hand size for the whole shot ----
  // Parts (2026-11-21, 根因清单「笔芯和笔不对了」): the lead is a part on each hand drawing, measured on THAT drawing
  // (art/cut/seg04_parts.json, web/lib/parts.js): it leaves the centre of the drawn sleeve's mouth along the drawn barrel's
  // axis, and is drawn through the same placement as the drawing (origin = that tip). Round 9 read the tip and the back end
  // by hand off the axis (h04_hold 11.9 px and 1.6 deg off: the lead came out of the sleeve's lower rim at an angle).
  const PA = await loadPartAnchors('/art/cut/seg04_parts.json');
  const RAW = { push: await img('/art/cut/h04_push.png'), hold: await img('/art/cut/h04_hold.png') };
  const HIMG = { push: rinPalImage(RAW.push), hold: rinPalImage(RAW.hold) };
  const PEN_LEN = 780;                                                     // 13 cm at the scale's 60 px / cm
  const HAND = {}, HDIR = {}, HAX = {};
  for (const [k, name] of [['push', 'h04_push'], ['hold', 'h04_hold']]) {
    const lead = partOf(PA, name, 'lead'), ax = axisOf(lead.axis);
    HAX[k] = ax;
    HAND[k] = await createHand({ name, image: HIMG[k], W, H: 1080, tip: ax.tip });
    HAND[k].scale = PEN_LEN / ax.len;
    HDIR[k] = ax.angle;
    // PART AUDIT: the sleeve (tip and direction where the lead leaves it) and the barrel (direction over the whole holder)
    const sl = [[ax.tip[0] - ax.dir[0] * lead.sleeve, ax.tip[1] - ax.dir[1] * lead.sleeve], ax.tip];
    axisAudit('seg_04', name, 'lead at the sleeve', { image: RAW[k], axis: sl, halfWidth: 60 });
    // h04_hold's sleeve is drawn 4.3 px below its barrel's centreline: the barrel check is on the direction (tip 6 px)
    axisAudit('seg_04', name, 'lead along the barrel', { image: RAW[k], axis: lead.axis, tolPx: 6 });
  }
  // the hand drawing's placement (the same transform hand.js draws it with: tip at p, scale grown a little with the lift,
  // turned by rot about the tip); the lead's start and direction come from it, never added on separately
  const handPlace = (k, p, lift, rot) => placement({ x: p[0], y: p[1], s: HAND[k].scale * (1 + 0.035 * lift), rot, origin: HAX[k].tip });
  const DROT = Math.atan2(Math.sin(HDIR.hold - HDIR.push), Math.cos(HDIR.hold - HDIR.push));
  const cardW = ([x, y]) => [CXO + x, CYO + y];
  const LEAD = { w: 12, step: 30, max: 210, crush: 18 };
  const LEAD_Y = 392;
  const TIP1 = cardW([SC.x0, LEAD_Y]);
  const STABW = cardW(STAB);
  const TIP2 = [STABW[0] - Math.cos(HDIR.hold) * LEAD.max, STABW[1] - Math.sin(HDIR.hold) * LEAD.max];
  const PUSH_K = [72, 73, 74, 75, 76, 77, 78].map(k => S.ev(`click ${k - 71}: the lead out 0.5 cm`, K(k)));
  [72, 73, 74, 75, 76, 77, 78].forEach(k => S.ev(`finger up ${k - 71}`, K(k + 0.5), 'half'));
  const DIG = [[1, PUSH_K[1]], [2, PUSH_K[3]], [3, PUSH_K[5]]];
  const LIFTUP = S.ev('she lifts the lead holder', K(78.5), 'half');
  const DOWN = [80, 81, 82, 83].map(k => S.ev(`the lead comes down ${k - 79}`, K(k)));
  const TOUCH = S.ev('the lead touches the double line (刺)', T84), CRACK = S.ev('a crack in the lead', K(84.5), 'half');
  const CRUSH = S.ev('the tip crushes into graphite (動作)', T85), LEAVE = S.ev('the hand leaves', K(85.5), 'half'), SOAK = S.ev('the graphite soaks into a lump', T86);
  S.hold('shot', 'S1 her card back, the lead holder', T71, T92, { kind: 'shot' });
  S.hold('hand', 'H1 pushing the lead out', T71, T79, { kind: 'key', file: '/art/cut/h04_push.png', onBeat: false });
  S.hold('hand', 'H2 holding the lead holder to stab', T79, T86, { kind: 'key', file: '/art/cut/h04_hold.png' });
  function leadLen(tt) {
    let n = 0, last = -1; for (const t of PUSH_K) if (tt >= t) { n++; last = t; }
    if (!n) return { L: 0, q: 0 };
    const age = tt - last, L = n * LEAD.step + 2.2 * Math.exp(-age / 0.05) * Math.cos(age * 60);
    const q = (0.4 + 2.6 * (n * LEAD.step / LEAD.max)) * Math.exp(-age / 0.22) * Math.sin(age * 2 * Math.PI * 11);
    return { L: tt >= CRUSH ? L - LEAD.crush : L, q };
  }
  // a lead from the holder's tip p in direction a, length L, its end bent sideways by q. Its shadow is soft and close under it
  // when it lies on the paper, softer and further off as it is lifted (round 8: a hard offset grey copy read as a second lead)
  function drawLead(ctx, p, a, L, q, lift, crack = 0) {
    if (L <= 0) return;
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, e = [p[0] + ux * L + nx * q, p[1] + uy * L + ny * q];
    const seg = (c, dx, dy) => { c.beginPath(); c.moveTo(p[0] + dx, p[1] + dy); c.quadraticCurveTo(p[0] + ux * L * 0.55 + nx * q * 0.3 + dx, p[1] + uy * L * 0.55 + ny * q * 0.3 + dy, e[0] + dx, e[1] + dy); c.stroke(); };
    ctx.save(); ctx.lineCap = 'butt';
    ctx.save(); ctx.filter = `blur(${(2.5 + 9 * lift).toFixed(1)}px)`; ctx.globalAlpha = 0.85 - 0.45 * lift;
    ctx.strokeStyle = HAND_SHADOW; ctx.lineWidth = LEAD.w * (1 + 0.4 * lift); seg(ctx, 3 + 16 * lift, 4 + 21 * lift); ctx.restore();
    ctx.strokeStyle = GRAPHITE; ctx.lineWidth = LEAD.w; seg(ctx, 0, 0);
    ctx.strokeStyle = rgba(PAPER_RGB, 0.12); ctx.lineWidth = 2; seg(ctx, -ny * LEAD.w * 0.22, nx * LEAD.w * 0.22);
    if (crack > 0) { const c = [p[0] + ux * (L - LEAD.crush), p[1] + uy * (L - LEAD.crush)];
      ctx.strokeStyle = rgba(PAPER_RGB, 0.75 * crack); ctx.lineWidth = 1.3; ctx.beginPath();
      ctx.moveTo(c[0] + nx * LEAD.w * 0.5 + ux * 2, c[1] + ny * LEAD.w * 0.5 + uy * 2); ctx.lineTo(c[0] - ux * 1.5, c[1] - uy * 1.5); ctx.lineTo(c[0] - nx * LEAD.w * 0.5 + ux * 1, c[1] - ny * LEAD.w * 0.5 + uy * 1); ctx.stroke(); }
    ctx.restore();
  }
  function handAt(tt) {
    if (tt < T79) {
      let press = 0; for (const t of PUSH_K) if (tt >= t && tt < t + BEAT / 2) press = 1 - Math.pow((tt - t) / (BEAT / 2), 3) * 0.6;
      const u = smooth((tt - LIFTUP) / (T79 - LIFTUP)), off = [(TIP2[0] - TIP1[0]) * 0.5 * u - 3 * press, (TIP2[1] - TIP1[1]) * 0.5 * u];
      return { k: 'push', p: [TIP1[0] + off[0], TIP1[1] + off[1]], rot: DROT * 0.35 * u, lift: 0.45 * u };
    }
    const LIFTS = [0.45, 0.32, 0.2, 0.09, 0.03, 0];
    const steps = [T79, ...DOWN, TOUCH]; let lift = LIFTS[0];
    for (let i = 1; i < steps.length; i++) if (tt >= steps[i]) lift = LIFTS[i - 1] + (LIFTS[i] - LIFTS[i - 1]) * ease((tt - steps[i]) / (BEAT * 0.45));
    let dx = 0, dy = 0;
    const land = (tt - T79) / FR; if (land < 4) dy += [-6, -2, 1, 0.3][Math.floor(land)];
    if (tt >= CRUSH) { const a = tt - CRUSH; dy -= 12.5 * (a < 0.05 ? a / 0.05 : Math.exp(-(a - 0.05) / 0.09)); lift = Math.min(0.25, a * 3); }
    if (tt >= LEAVE) { const u = Math.pow(Math.min(1, (tt - LEAVE) / (8 * FR)), 2); dx += 760 * u; dy += 620 * u; lift = 0.3; }
    return { k: 'hold', p: [TIP2[0] + dx, TIP2[1] + dy], rot: 0, lift };
  }

  // the camera of S1 (round 10, 2026-11-21 第二版反馈「一直抖动屏幕……看着很晕」; docs/制作约定.md 第六节 整屏运动). The rock
  // pass cut every move into a step a beat (k72-k91 jolted on 19 beats of 20, 3-4.6% of the width each); now the frame moves
  // only in eased glides and is hit twice: k71 still at 1.15x; one eased push k72 -> k79 that follows the lead out (the clicks
  // are the lead growing 0.5 cm over the printed scale, not the camera); one eased push k79 -> k84 onto the stab point with
  // the hand coming down a level a beat; k84-k88 still (touch, crack, crush, soak: the quiet before the heaviest beat);
  // k88 (14.2 dB, the loudest crash of the segment, the black bursting out of the lump) the one 大击: a one-way kick in of
  // 3.5% that stays; k89 -> k92 one eased pull back to 1.95x with the black running right a step a beat (room for it on the
  // teal, the whole card in frame at k91). k72 (9.9 dB, the verse's first downbeat) keeps one ordinary kick of 1.4%, one-way.
  const CAM = createCamera(g, { W, H: 1080, bg: FIELD });
  const FR0 = [1.15, [990, 560]], FR1 = [1.45, [720, 610]], FR2 = [2.40, [560, 534]], FR4 = [1.95, [650, 546]];
  const lerpF = (A, B, e, tgt) => tgt ? camLerp(A[0], A[1], B[0], B[1], e, tgt) : [A[0] + (B[0] - A[0]) * e, A[1][0] + (B[1][0] - A[1][0]) * e, A[1][1] + (B[1][1] - A[1][1]) * e];
  const K72 = PUSH_K[0], K89 = B89;
  const MV1 = move(S, 'S1 push after the lead', K72, T79), MV2 = move(S, 'S1 push onto the stab point', T79, T84), MV3 = move(S, 'S1 pull back with the black', K89, T92);
  S.mark('S1 kick (k72, ordinary)', K72); S.mark('S1 大击 (k88 crash)', B88);
  const KICK72 = 0.014, KICK88 = 0.035;
  const kickAt = (tt, t0, amt) => 1 + amt * stepP(tt, t0, 3);             // one-way: in by 3 frames (3.7% give), then it stays
  const glide = ([a, b], tt) => smooth((tt - a) / (b - a));
  function camS1(tt) {
    let c;
    if (tt < T79) c = lerpF(FR0, FR1, glide(MV1, tt));
    else if (tt < K89) c = lerpF(FR1, FR2, glide(MV2, tt), STABW);
    else { const A = [FR2[0] * (1 + KICK88), FR2[1]]; c = lerpF(A, FR4, glide(MV3, tt)); return [c[0] * kickAt(tt, K72, KICK72), c[1], c[2]]; }
    return [c[0] * kickAt(tt, K72, KICK72) * kickAt(tt, B88, KICK88), c[1], c[2]];
  }
  const shakeS1 = () => 0;
  // the teal ground under the card: the Demo 1 field, a few fibres, and a little depth: light falling off toward the corners
  const [GROUND, gs] = mk(W, 1080);
  { gs.fillStyle = FIELD; gs.fillRect(0, 0, W, 1080); const r = rng(77); for (let i = 0; i < 1600; i++) { gs.fillStyle = rgba(PAPER_RGB, 0.015 + r() * 0.025); gs.fillRect(r() * W, r() * 1080, 2 + r() * 7, 1); }
    const vg = gs.createRadialGradient(560, 540, 300, 760, 540, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, FIELD_SHADOW);
    gs.globalAlpha = 0.55; gs.fillStyle = vg; gs.fillRect(0, 0, W, 1080); gs.globalAlpha = 1; }
  function writeLine(ctx, chars, ri, tt) {
    const [bx, by] = lineBoxOf(ri, chars.length);
    chars.forEach(([c, t], i) => { if (!sungShown(tt, t)) return; ctx.save(); ctx.translate(bx + TXT.size * (i + 0.5) * 1.02, by + 15); ctx.scale(1 / 3, 1 / 3);   // whole on its onset frame (print.js sungBuild)
      PEN.char(ctx, c, 0, 0, TXT.size * 3, tt - t); ctx.restore(); });
  }
  function drawS1(tt) {
    CAM.shoot(camS1(tt), shakeS1(tt), tt, (ctx) => {
      ctx.drawImage(GROUND, 0, 0);
      // the card and its lanyard lie on the ground: soft shadows, close under them
      ctx.save(); ctx.filter = 'blur(9px)'; ctx.globalAlpha = 0.8; ctx.fillStyle = FIELD_SHADOW;
      ctx.beginPath(); ctx.roundRect(CXO + 5, CYO + 9, CW, CH, 18); ctx.fill(); ctx.fillRect(CXO + CW / 2 - 9 + 4, -20, 18, CYO + 30); ctx.restore();
      ctx.drawImage(CARD, CXO, CYO, CW, CH);
      { const [sx, sy, sw, sh] = HB.slot; ctx.fillStyle = FIELD_SHADOW; ctx.beginPath(); ctx.roundRect(CXO + CW * sx, CYO + CW * sy, CW * sw, CW * sh, CW * sh / 2); ctx.fill(); }   // the holder slot (her_card.js)
      ctx.fillStyle = TEAL; ctx.fillRect(CXO + CW / 2 - 9, -20, 18, CYO + 36);
      ctx.fillStyle = rgba(PAPER_RGB, 0.35); ctx.fillRect(CXO + CW / 2 - 9, -20, 2, CYO + 36);
      ctx.fillStyle = rgba(PAPER_RGB, 0.7); ctx.beginPath(); ctx.roundRect(CXO + CW / 2 - 13, CYO + 6, 26, 26, 5); ctx.fill();
      ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.save(); ctx.translate(CXO, CYO);
      ctx.font = '600 9px ZenKaku'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const [cm, t] of DIG) if (tt >= t) { ctx.fillStyle = rgba(INK_RGB, Math.min(1, (tt - t) / (2 * FR))); ctx.fillText(String(cm), SC.x0 - cm * SC.cm, SC.digitY); }
      if (tt >= TOUCH && tt < SOAK + 4 * FR) { ctx.fillStyle = rgba(INK_RGB, tt >= CRACK ? 0.3 : 0.18); ctx.beginPath(); ctx.ellipse(STAB[0] + 1.5, STAB[1] + 2, 7, 4.5, 0, 0, 7); ctx.fill(); }
      // the black: the wicks and arms first, the lump over their roots
      WK.forEach((v, i) => drawVein(ctx, v, reveal(WK_STEPS[i], tt), TILE_S1, 12));
      drawVein(ctx, VL, reveal(VL_STEPS, tt), TILE_S1, 18);
      drawVein(ctx, VR, reveal(VR_STEPS, tt), TILE_S1, 22);
      if (tt >= CRUSH) { const gr = tt < SOAK ? 0.45 : 0.45 + 0.55 * ease((tt - SOAK) / (4 * FR)); drawLump(ctx, LUMP, TILE_S1, gr, Math.min(1, (tt - CRUSH) / (3 * FR))); }
      writeLine(ctx, L0, 5, tt); writeLine(ctx, L1, 1, tt); writeLine(ctx, L2A, 3, tt);
      ctx.restore();
      if (tt < LEAVE + 9 * FR) {
        const h = handAt(tt), HD = HAND[h.k], HP = handPlace(h.k, h.p, h.lift, h.rot);
        const lp = HP.toWorld(HAX[h.k].tip), ld = HP.dirToWorld(HAX[h.k].dir), a = Math.atan2(ld[1], ld[0]);
        const { L, q } = h.k === 'push' ? leadLen(tt) : { L: leadLen(tt).L, q: 0 };
        drawLead(ctx, lp, a, L, q, h.lift, h.k === 'hold' && tt >= CRACK && tt < CRUSH ? Math.min(1, (tt - CRACK) / (2 * FR)) : 0);
        const clip = h.k === 'push' && tt >= LIFTUP;
        if (clip) { const ux = Math.cos(a), uy = Math.sin(a), nx = Math.sin(a), ny = -Math.cos(a), d = 60, far = 4000, p = h.p;
          ctx.save(); ctx.beginPath();
          ctx.moveTo(p[0] - ux * far + nx * d, p[1] - uy * far + ny * d); ctx.lineTo(p[0] + ux * far + nx * d, p[1] + uy * far + ny * d);
          ctx.lineTo(p[0] + ux * far - nx * far, p[1] + uy * far - ny * far); ctx.lineTo(p[0] - ux * far - nx * far, p[1] - uy * far - ny * far); ctx.closePath(); ctx.clip(); }
        HD.draw(ctx, h.p[0], h.p[1], h.lift, HD.scale, h.rot);
        if (clip) ctx.restore();
      }
    });
  }
  const s1Views = frameTimes(SEG[0], SEG[0], T92).map(t => { const [z, fx, fy] = camS1(t), v = CAM.view(z, fx, fy, shakeS1(t)); return { t, ...v }; });
  LAY.audit('S1 card back');
  LAY.frameCheck('S1 card back', { sheets: { card: p => [CXO + p[0], CYO + p[1]] }, views: s1Views });

  // ---------------------------------------------------------------------------------------------------------------------
  // S2 and S3: her in front of the enlarged card back, the black flooding it (screen units at 1x)
  // ---------------------------------------------------------------------------------------------------------------------
  // S3 (round 9): s04d_shoulder, the guitar carried on her shoulder like a bat. Blind-compared on thumbnails against a full
  // figure dragging it by the headstock end (archive/seg04_r8_s3/): that one read "she doesn't know what to do with it"
  const ART = { zip: '/art/cut/s04a_zip.png', half: '/art/cut/s04a_half.png', hang: '/art/cut/s04d_shoulder.png' };
  const ANJ = await (await fetch('/art/cut/seg04_r8_anchors.json')).json();
  const AN = { zip: ANJ.s04a_zip, half: ANJ.s04a_half, hang: ANJ.s04d_shoulder };
  const IMG = {}, RAWS = {}; for (const [k, f] of Object.entries(ART)) { RAWS[k] = await img(f); IMG[k] = rinPalImage(RAWS[k]); }
  // placement: S2 (the square master and its variant) scaled 0.92, her face at about x 1200, on the right. S3 is a cut on the
  // action to the other side: the square drawing scaled 0.86 (her head about 28% of the frame, as close as S2), her face at
  // about x 860, the gold body up beside her head at x 370-700, the line on the right in the black. Both run past the bottom
  // of the frame (no cut edge in view)
  const PLACE = { zip: { s: 0.92, x: 501, y: -10 }, half: { s: 0.92, x: 501, y: -10 },
                  hang: { s: 0.86, x: 230, y: 4 } };
  const toScreen = (k, [px, py]) => [PLACE[k].x + px * PLACE[k].s, PLACE[k].y + py * PLACE[k].s];

  // Her card on her chest (docs/卡面状态.md, 2026-11-21): the face is web/lib/her_card.js's herCardFace in its state from 03
  // k40 on (the 読み取れません band in the name field, ロストワン in the 学籍番号 rows, の号哭 in her pencil, the grid pressed
  // under the title), the same function 03 prints; no face coordinates of this segment's own. The drawings show the card in
  // a clear holder that Codex drew blank. CARD_Q is the holder's outline in each drawing (the light frame's outer edge at
  // half-intensity against the dark rim, edges fitted per row and column: work/seg/04/cardfix/). The outline is 1.56:1 in
  // s04a and 1.44:1 in s04d, so the 3:2 card is fitted in it whole (contain, centred) and mapped through its four corners as
  // a true perspective (homography), sampled 4 x 4 per pixel from a face prefiltered down to about 4x its size in the
  // drawing (the grid does not alias). It is laid over the drawn card opaque and only inside the card: its rounded corners
  // and holder slot are cut out, so the drawn clip shows through the slot (the card's top edge covers the rest of it, the
  // lanyard enters the card's top edge) and the holder's drawn rim stays round it. (Round 8 multiplied an old face of its own
  // onto the white window, which squashed the 3:2 face into the 1.84:1 window and let the window's strip line run through
  // the band.)
  // (round 10: the outlines are parts measured on each drawing, art/cut/seg04_parts.json, read with parts.js partOf: no
  // drawing borrows another's)
  const DRAWING = { zip: 's04a_zip', half: 's04a_half', hang: 's04d_shoulder' };
  const CARD_Q = {}; for (const k of Object.keys(DRAWING)) CARD_Q[k] = partOf(PA, DRAWING[k], 'card').quad;
  // the homography taking the four points src onto dst (an 8 x 8 solve), as a function [x, y] -> [x, y]
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
  // the 3:2 card's corners inside a measured outline (contain, centred, in the outline's own perspective)
  function cardCorners(q) {
    const unit = homography([[0, 0], [1, 0], [1, 1], [0, 1]], q), len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    const r = (len(q[0], q[1]) + len(q[3], q[2])) / (len(q[0], q[3]) + len(q[1], q[2]));
    const du = r > CARD_RATIO ? (1 - CARD_RATIO / r) / 2 : 0, dv = r > CARD_RATIO ? 0 : (1 - r / CARD_RATIO) / 2;
    return [[du, dv], [1 - du, dv], [1 - du, 1 - dv], [du, 1 - dv]].map(unit);
  }
  const CARD_SS = 4;
  function printCard(im, q) {
    const Q = cardCorners(q), wq = Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]), fu = Math.round(wq * CARD_SS);
    let src = herCardFace(2400);                                   // halved step by step (each step filters), then to fu
    while (src.width / 2 >= fu) { const [c, x] = mk(src.width / 2, src.width / 2 / CARD_RATIO); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height); src = c; }
    const [fc, fx] = mk(fu, fu / CARD_RATIO); fx.imageSmoothingQuality = 'high'; fx.drawImage(src, 0, 0, fc.width, fc.height);
    const fw = fc.width, fh = fc.height, F = fx.getImageData(0, 0, fw, fh).data, inv = homography(Q, [[0, 0], [fw, 0], [fw, fh], [0, fh]]);
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const X0 = Math.floor(Math.min(...Q.map(p => p[0]))), X1 = Math.ceil(Math.max(...Q.map(p => p[0])));
    const Y0 = Math.floor(Math.min(...Q.map(p => p[1]))), Y1 = Math.ceil(Math.max(...Q.map(p => p[1]))), bw = X1 - X0;
    const d = x.getImageData(X0, Y0, bw, Y1 - Y0), D = d.data, n = CARD_SS * CARD_SS;
    for (let py = Y0; py < Y1; py++) for (let px = X0; px < X1; px++) {
      let r = 0, gg = 0, bb = 0, a = 0;
      for (let j = 0; j < CARD_SS; j++) for (let i = 0; i < CARD_SS; i++) {
        const [u, v] = inv([px + (i + 0.5) / CARD_SS, py + (j + 0.5) / CARD_SS]); if (u < 0 || v < 0 || u >= fw || v >= fh) continue;
        const o = (Math.floor(v) * fw + Math.floor(u)) * 4, al = F[o + 3] / 255; r += F[o] * al; gg += F[o + 1] * al; bb += F[o + 2] * al; a += al;
      }
      if (!a) continue;
      const A = a / n, o = ((py - Y0) * bw + px - X0) * 4;
      D[o] = D[o] * (1 - A) + r / n; D[o + 1] = D[o + 1] * (1 - A) + gg / n; D[o + 2] = D[o + 2] * (1 - A) + bb / n;
    }
    x.putImageData(d, X0, Y0); return { c, Q };
  }
  const CARD_ON = {};                                               // the card's corners in each drawing (drawing px)
  for (const k of Object.keys(IMG)) { const r = printCard(IMG[k], CARD_Q[k]); IMG[k] = r.c; CARD_ON[k] = r.Q; }
  // PART AUDIT: the card sits on the drawn holder in each drawing (its outline and a 7 x 5 grid inside the 3:2 card, on the
  // drawing's own opaque pixels, read off the drawing before the face is printed into it)
  for (const k of Object.keys(DRAWING)) { const q = CARD_Q[k], Q = CARD_ON[k], pts = [];
    for (let i = 0; i < 4; i++) pts.push(...samplesAlong(q[i], q[(i + 1) % 4], 40));
    for (let j = 1; j <= 5; j++) for (let i = 1; i <= 7; i++) { const u = i / 8, v = j / 6, top = [Q[0][0] + (Q[1][0] - Q[0][0]) * u, Q[0][1] + (Q[1][1] - Q[0][1]) * u],
      bot = [Q[3][0] + (Q[2][0] - Q[3][0]) * u, Q[3][1] + (Q[2][1] - Q[3][1]) * u]; pts.push([top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v]); }
    partAudit('seg_04', DRAWING[k], 'card in the drawn holder', { image: RAWS[k], points: pts, on: PIX.opaque, maxOffPct: 0 }); }
  // the face's lines against the card's own labels (card space, u = 1000), as 03 audits the same face
  { const CU = 1000, fb = herCardBoxes(CU);
    for (const [nm, b] of Object.entries(fb.lines)) LAY.text(`card ${nm}`, 'cardface', b);
    for (const [nm, b] of Object.entries(fb.labels)) LAY.text(`card label ${nm}`, 'cardface', b);
    LAY.audit('her card face (her_card.js)'); }

  // the graphite field (Demo 2's black page) and the flood: a front driven out from a source behind her, one pencil stroke at a
  // time, its shape set by a stretched distance (it reaches left and up faster than right and down, where the paper is kept)
  const [GF, gfs] = mk(W, 1080); { gfs.fillStyle = GRAPHITE_FIELD; gfs.fillRect(0, 0, W, 1080); const r = rng(9); gfs.lineCap = 'round';
    for (let k = 0; k < 2400; k++) { gfs.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); gfs.lineWidth = 2 + r() * 5;
      const x = r() * W, y = r() * 1080, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16; gfs.beginPath(); gfs.moveTo(x, y); gfs.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); gfs.stroke(); } }
  function makeFlood(C, kx, ky, seed) {
    const metric = (x, y) => { const dx = x - C[0], dy = y - C[1]; return Math.hypot(dx * (dx > 0 ? kx[1] : kx[0]), dy * (dy > 0 ? ky[1] : ky[0])); };
    const STR = [], r = rng(seed);
    for (let gy = -40; gy < 1120; gy += 11) for (let gx = -60; gx < W + 60; gx += 20) {
      const x = gx + (r() - 0.5) * 20, y = gy + (r() - 0.5) * 12, n = 0.5 * Math.sin(x * 0.006 + y * 0.004) + 0.5 * Math.sin(x * 0.011 - y * 0.009);
      STR.push({ x, y, d: metric(x, y) * (1 + 0.1 * n) + r() * 30, len: 50 + r() * 60, ang: -0.5 + (r() - 0.5) * 0.16, w: 3 + r() * 4, a: 0.6 + r() * 0.3 }); }
    STR.sort((a, b) => a.d - b.d);
    function draw(ctx, R) {
      if (R <= 0) return;
      if (R > 60) { ctx.save(); ctx.beginPath();
        for (let i = 0; i <= 140; i++) { const a = i / 140 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), k = Math.hypot(c * (c > 0 ? kx[1] : kx[0]), s * (s > 0 ? ky[1] : ky[0]));
          const n = 0.5 * Math.sin(a * 5 + 1.3) + 0.3 * Math.sin(a * 11 + 0.4) + 0.2 * Math.sin(a * 17), rr = Math.max(0, R - 120 + 45 * n) / k;
          const x = C[0] + c * rr, y = C[1] + s * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.closePath(); ctx.clip(); ctx.drawImage(GF, 0, 0); ctx.restore(); }
      ctx.save(); ctx.lineCap = 'round';
      for (const st of STR) { if (st.d > R) break; if (st.d < R - 170) continue;
        ctx.strokeStyle = rgba(INK_RGB, st.a); ctx.lineWidth = st.w; ctx.beginPath();
        const dx = Math.cos(st.ang) * st.len / 2, dy = Math.sin(st.ang) * st.len / 2; ctx.moveTo(st.x - dx, st.y - dy); ctx.lineTo(st.x + dx, st.y + dy); ctx.stroke(); }
      ctx.restore();
    }
    return { metric, draw, C };
  }
  // the paper behind her: the card back enlarged (paper, fibres, teal ruled lines every `gap` px)
  function backPaper(gap, y0, seed) {
    const [c, x] = mk(W, 1080); x.fillStyle = PAPER_CARD; x.fillRect(0, 0, W, 1080); const r = rng(seed);
    for (let i = 0; i < 2400; i++) { x.strokeStyle = rgba(FIBRE_RGB, 0.04 + r() * 0.06); x.lineWidth = 0.8 + r() * 0.8; const px = r() * W, py = r() * 1080, a = r() * 7, l = 6 + r() * 22; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
    x.fillStyle = rgba(TEAL_RGB, 0.75); for (let y = y0; y < 1080; y += gap) x.fillRect(0, y - gap / 60, W, gap / 30);
    return c;
  }
  const BACK2 = backPaper(150, 90, 808), BACK3 = backPaper(108, 60, 809);

  // ---------------------------------------------------------------------------------------------------------------------
  // S2: k92-k100, close on her (P4a, P4b), the black bursting out behind her
  // ---------------------------------------------------------------------------------------------------------------------
  S.hold('shot', 'S2 her, close: the black bursts behind her', T92, T100, { kind: 'shot' });
  S.hold('rin', 'P4a reaching up behind her shoulder to the zip', T92, T95, { kind: 'key', file: ART.zip, onBeat: false });
  S.hold('rin', 'P4b the guitar drawn out over the shoulder, the gold out', T95, T100, { kind: 'key', file: ART.half });
  const BURST = S.ev('the black bursts behind her (bar line)', T92), PRINT = S.ev('はみ出しています (light print)', K(94));
  const FL2 = makeFlood([720, 560], [1, 1.75], [1, 1.5], 61);
  const FL2_STEPS = [[BURST, 1060], [S.ev('the black goes further (1)', K(93)), 1160], [S.ev('the black goes further (2, bar line)', K(96)), 1300], [S.ev('the black goes further (3)', K(98)), 1420]];
  const floodR = (steps, tt, burstFrames = 3) => { let R = 0, prev = 0; for (let i = 0; i < steps.length; i++) { const [t0, m] = steps[i]; if (tt < t0) break;
      const u = i === 0 ? ease(((tt - t0) / FR + 0.5) / (burstFrames + 1)) : 1 - Math.pow(1 - Math.min(1, (tt - t0) / (BEAT * 0.6)), 3); R = prev + (m - prev) * u; prev = m; } return R; };
  // the trunk: the black that ran off the card in S1 comes in from the left edge to the source behind her (seen as the burst lands)
  const TRUNK = makeVein([[-60, 640, 34], [260, 628, 33], [520, 606, 31], [720, 566, 29]], 61, { burr: 16, rough: 0.08 });
  const TILE_S2 = graphiteTile(512, 50, 150, 2, 6, 640, 42);
  // her words, left paper-white in the black as she sings them (read right to left: 出すもんで, then レスポールさえも凶器に)
  const COL2B = { x: 372, y0: 120, size: 116 }, COL3 = { x: 176, y0: 66, h: 950, max: 84 };
  const col3Size = Math.min(COL3.max, Math.floor(COL3.h / (L3.length * 1.04)));
  const W2B = vertical(L2B, COL2B.x, COL2B.y0, COL2B.size, 1.06), W3 = vertical(L3, COL3.x, COL3.y0, col3Size, 1.04);
  const whitenAt = (fl, steps, letters) => letters.forEach(p => { p.d = fl.metric(p.x, p.y) + p.size * 1.3; p.tc = Infinity;
    for (let t = steps[0][0]; t < SEG[1]; t += FR / 4) if (floodR(steps, t) >= p.d) { p.tc = t; break; } });
  whitenAt(FL2, FL2_STEPS, [...W2B, ...W3]);
  const PRINT_K = 2.8, PRINT_AT = [1680, 955];
  LAY.text('line 2, second half (出すもんで, white)', 's2', grow([COL2B.x - COL2B.size * 0.55, COL2B.y0, COL2B.size * 1.1, COL2B.size * L2B.length * 1.06], 8));
  LAY.text('line 3 (white column)', 's2', grow([COL3.x - col3Size * 0.55, COL3.y0, col3Size * 1.1, col3Size * L3.length * 1.04], 8));
  LAY.text('はみ出しています', 's2', grow(print16Box('はみ出しています', PRINT_AT[0], PRINT_AT[1], PRINT_K), 6));
  for (const k of ['zip', 'half']) { const a = AN[k]; if (!a) continue; const [x0, y0] = toScreen(k, [a.bbox[0], a.bbox[1]]), [x1, y1] = toScreen(k, [a.bbox[2], a.bbox[3]]);
    LAY.reg(`her (${k})`, `s2:${k}`, [x0, y0, x1 - x0, y1 - y0]);
    for (const b of LAY.boxes.filter(b => b.sheet === 's2' && b.kind === 'text')) LAY.text(b.name, `s2:${k}`, b.box); }
  LAY.audit('S2 her, close');
  // the camera (round 10, 整屏运动): one eased push onto her face across both drawings, k92 -> k100 (round 9's framings).
  // The hard cut on the heaviest beat is the accent; the burst, the black's steps (k93, k96, k98) and the guitar coming out on
  // k95 move inside the frame, the frame itself does not jolt (the rock pass stepped it on four snares, kicked and dipped it)
  const MV_S2 = move(S, 'S2 push onto her face', T92, T100);
  const camS2 = tt => { const u = smooth((tt - MV_S2[0]) / (MV_S2[1] - MV_S2[0]));
    return [1.005 + 0.045 * u, 960 + 260 * u, 540 - 36 * u]; };
  const shakeS2 = () => 0;
  function drawS2(tt) {
    CAM.shoot(camS2(tt), shakeS2(tt), tt, (ctx) => {
      ctx.drawImage(BACK2, 0, 0);
      drawVein(ctx, TRUNK, TRUNK.len, TILE_S2, 60);
      FL2.draw(ctx, floodR(FL2_STEPS, tt));
      print16(ctx, 'はみ出しています', PRINT_AT[0], PRINT_AT[1], PRINT_K, tt - PRINT, 94);
      for (const p of [...W2B, ...W3]) { const ts = Math.max(p.t, p.tc); if (!sungShown(tt, ts)) continue; ctx.save(); ctx.translate(p.x, p.y); if (p.rot) ctx.rotate(p.rot);
        whiteLetter(ctx, p.c, 0, 0, p.size, tt - ts, 'paper'); ctx.restore(); }
      const k = tt >= T95 ? 'half' : 'zip';                       // the swap on 「レ」 is the accent (no bounce of the whole figure)
      const P = PLACE[k], im = IMG[k]; ctx.drawImage(im, P.x, P.y, im.width * P.s, im.height * P.s);
    });
  }
  const s2Views = frameTimes(SEG[0], T92, T100).map(t => { const [z, fx, fy] = camS2(t), v = CAM.view(z, fx, fy, shakeS2(t)); return { t, ...v }; });
  LAY.frameCheck('S2 her, close', { sheets: { s2: p => p }, views: s2Views });
  // her card on her chest: whole in view every frame, and its width on the screen and on a phone (390 px wide, 0.203 of the
  // frame; docs/卡面状态.md 第四节). Registered as text (it carries her title), one sheet per drawing
  const cardSize = [];
  function cardCheck(shot, keys, views) {
    const sheets = {};
    for (const k of keys) {
      const P = CARD_ON[k].map(p => toScreen(k, p)), xs = P.map(p => p[0]), ys = P.map(p => p[1]);
      const b = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)], zs = views.map(v => v.z);
      LAY.text(`her card (${k})`, `card:${k}`, b); sheets[`card:${k}`] = p => p;
      const w0 = b[2] * Math.min(...zs), w1 = b[2] * Math.max(...zs);
      cardSize.push({ shot, drawing: k, screenPx: [+w0.toFixed(1), +w1.toFixed(1)], phonePx: [+(w0 * 390 / 1920).toFixed(1), +(w1 * 390 / 1920).toFixed(1)] });
    }
    LAY.frameCheck(`${shot}: her card`, { sheets, views });
  }
  cardCheck('S2', ['zip', 'half'], s2Views);

  // ---------------------------------------------------------------------------------------------------------------------
  // S3: k100-k104 (round 9), cut on the action: the guitar is out and up on her right shoulder, carried like a bat, her fist
  // at the headstock end, the gold body up beside her head; a cold sidelong look down past us. As close as S2 (her head about
  // 28% of the frame), from the other side: she is left of centre, the line white in the black on the right. The guitar lands
  // on the shoulder on the cut (a 4-frame dip and settle); a slow push onto her face and fist; k102 the black takes one more
  // step with a nudge of the camera. (Round 8's knee-up s04c_hang read as "a girl holding her guitar", not a weapon.)
  // ---------------------------------------------------------------------------------------------------------------------
  S.hold('shot', 'S3 the weapon', T100, SEG[1], { kind: 'shot' });
  S.hold('rin', 'P4c the guitar on her shoulder like a bat, a weapon', T100, SEG[1], { kind: 'key', file: ART.hang, onBeat: false });
  const FL3 = makeFlood([900, 540], [0.75, 1.5], [0.85, 1.0], 62);
  // the fill into k104 (the rock pass: k101.25-k103.75 sixteenth snares, round 9 was still on k103): the black and the camera
  // step on k101, k102, k103 and the half beat k103.5, each bigger than the one before, and 05 cuts in on k104's crash
  const B102 = S.ev('the black goes further (S3)', K(102));
  const B103 = S.ev('the black goes further (S3, the fill)', K(103)), B1035 = S.ev('the black goes further (S3, the fill, half beat)', K(103.5), 'half');
  const FL3_STEPS = [[T100, 1090], [B102, 1170], [B103, 1250], [B1035, 1340]];
  const floodR3 = tt => { let R = FL3_STEPS[0][1]; for (let i = 1; i < FL3_STEPS.length; i++) { const [t0, m] = FL3_STEPS[i]; if (tt < t0) break;
      const u = ease(((tt - t0) / FR + 1) / 3); R = FL3_STEPS[i - 1][1] + (m - FL3_STEPS[i - 1][1]) * u; } return R; };
  const COL4 = { x: 1430, y0: 100, h: 800, max: 96 };   // its foot stays in view at the end of the push (z 1.10, top kept)
  const col4Size = Math.min(COL4.max, Math.floor(COL4.h / (L4.length * 1.04)));
  const W4 = vertical(L4, COL4.x, COL4.y0, col4Size, 1.04);
  W4.forEach(p => { p.tc = FL3.metric(p.x, p.y) + p.size * 1.3 <= FL3_STEPS[0][1] ? -Infinity : Infinity; });
  LAY.text('line 4 (white column)', 's3', grow([COL4.x - col4Size * 0.55, COL4.y0, col4Size * 1.1, col4Size * L4.length * 1.04], 8));
  { const a = AN.hang, [x0, y0] = toScreen('hang', [a.bbox[0], a.bbox[1]]), [x1, y1] = toScreen('hang', [a.bbox[2], a.bbox[3]]);
    LAY.reg('her (hang)', 's3:hang', [x0, y0, x1 - x0, y1 - y0]);
    for (const b of LAY.boxes.filter(b => b.sheet === 's3' && b.kind === 'text')) LAY.text(b.name, 's3:hang', b.box); }
  LAY.audit('S3 the weapon');
  // the push keeps the top of the frame (the bow and the gold body stay whole); the hips go out at the bottom. Round 10
  // (整屏运动): one eased push k100 -> k104; the fill (k101, k102, k103, k103.5) is the black stepping on behind her, and 05
  // comes in on k104's crash with its own 大击 (the rock pass stepped and punched the frame on every hit of the fill)
  const MV_S3 = move(S, 'S3 push onto her face and fist', T100, SEG[1]);
  const camS3 = tt => { const u = smooth((tt - MV_S3[0]) / (MV_S3[1] - MV_S3[0])), z = 1.005 + 0.095 * u;
    return [z, Math.max(960 / z, 960 - 90 * u), 540 / z]; };
  function drawS3(tt) {
    CAM.shoot(camS3(tt), 0, tt, (ctx) => {
      ctx.drawImage(BACK3, 0, 0);
      FL3.draw(ctx, floodR3(tt));
      for (const p of W4) { if (!sungShown(tt, p.t)) continue; ctx.save(); ctx.translate(p.x, p.y); if (p.rot) ctx.rotate(p.rot);
        whiteLetter(ctx, p.c, 0, 0, p.size, tt - p.t, 'paper'); ctx.restore(); }
      // round 10: no drop and bounce of the whole figure on the cut and on k102 (she fills half the frame: that read as the
      // frame jolting); the cut on the action is the accent
      const P = PLACE.hang, im = IMG.hang; ctx.drawImage(im, P.x, P.y, im.width * P.s, im.height * P.s);
    });
  }
  const s3Views = frameTimes(SEG[0], T100, SEG[1]).map(t => { const [z, fx, fy] = camS3(t), v = CAM.view(z, fx, fy, 0); return { t, ...v }; });
  LAY.frameCheck('S3 the weapon', { sheets: { s3: p => p }, views: s3Views });
  cardCheck('S3', ['hang'], s3Views);
  console.warn(`CARD SIZE seg_04: ${cardSize.map(c => `${c.shot} ${c.drawing} ${c.screenPx.join('-')} px (phone ${c.phonePx.join('-')} px)`).join('; ')}`);
  // every white letter must sit in the black on its onset's frame (the flood has passed it by then: a white letter on the
  // paper cannot be read)
  const inBlack = (p, tt) => tt < T100 ? floodR(FL2_STEPS, tt) >= p.d : p.tc === -Infinity || floodR3(tt) >= FL3.metric(p.x, p.y) + p.size * 1.3;
  const notInBlack = [...W2B, ...W3, ...W4].filter(p => !inBlack(p, onsetFrame(p.t) / 30)).map(p => `${p.c}@${p.t.toFixed(2)}`);
  console.warn(`WHITE LETTERS seg_04: ${[...W2B, ...W3, ...W4].length} letters, ${notInBlack.length} not in the black on their onset's frame${notInBlack.length ? ': ' + notInBlack.join(', ') : ''}`);
  // LYRIC AUDIT (docs/制作约定.md 第六节): the first frame each sung character reads on, read off the same gates renderAt draws
  // with: the pencil lines of S1 (whole when sungBuild is 1, while S1 is on), the white letters (whole, in the black, in their shot)
  const firstRead = (t, ok) => { for (let g0 = F0; g0 < F1; g0++) { const tt = g0 / 30; if (sungBuild(tt - t) >= 1 && ok(tt)) return tt; } return null; };
  const LYRIC = [
    ...[...L0, ...L1, ...L2A].map(([c, t]) => ({ c, t, readT: firstRead(t, tt => tt < T92) })),
    ...[...W2B, ...W3].map(p => ({ c: p.c, t: p.t, readT: firstRead(Math.max(p.t, p.tc), tt => tt >= T92 && tt < T100 && inBlack(p, tt)) })),
    ...W4.map(p => ({ c: p.c, t: p.t, readT: firstRead(p.t, tt => tt >= T100 && inBlack(p, tt)) })),
  ];
  const lyric = lyricAudit('seg_04', LYRIC);

  S.finish();
  // MOTION AUDIT (docs/制作约定.md 第六节 整屏运动): every frame's view as shown, the first frames of S2 and S3 marked as cuts
  const camAt = t => t < T92 ? camS1(Math.max(t, T71)) : t < T100 ? camS2(t) : camS3(t);
  let prevShot = -1;
  const motionViews = frameTimes(SEG[0], SEG[0], SEG[1]).map(t => { const shot = t < T92 ? 0 : t < T100 ? 1 : 2, cut = prevShot >= 0 && shot !== prevShot; prevShot = shot;
    const [z, fx, fy] = camAt(t); return { t, ...CAM.view(z, fx, fy, 0), cut }; });
  const motion = motionAudit('seg_04', motionViews, { big: [[B88, 'k88 段内最响的镲 (14.2 dB)，黑色从石墨团里冲出来，画面中心']] });
  const parts = partReport('seg_04');
  publishAudit(S, LAY, { design: 'round 10 (2026-11-21 第二版反馈): eased camera, k72 kick and k88 大击 only, beat inside the frame; lead and card parts per drawing (parts.js); sung letters whole on their onset frame', whiteLate: notInBlack, cardSize, lyric, motion, parts });

  window.renderAt = async t => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (t < T92) drawS1(Math.max(t, T71)); else if (t < T100) drawS2(t); else drawS3(t);
  };
}
