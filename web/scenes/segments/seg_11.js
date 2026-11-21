// Segment 11 前副歌2 (docs/分镜/11_前副歌2.md, 第 3 稿), k327-k359, global frames [3643, 3998). Design 甲 (a row of card backs
// answers her card back), finished after the blind review of the two samples (sample page: archive/seg11_sample_20261120/).
//   S1  k327-k335  her 自己紹介カード from straight above on a teal 下敷き (07's card, 07's state): k327 the band slams back in and
//                  a black 未提出 stamp (white dots, the locker window's black) slams down in the photo field, the frame
//                  steps in 3% and stays (大击); 句30: 本日 struck out, 昨日 printed over it, の宿題は printed again.
//                  Her hand (h11_write) writes a big ギ in 将来の夢, one stroke a beat (k328-k331.5); 句31 writes itself under
//                  it; k332 the thumb (h11_rub) rubs the ギ to a grey smear, eased push 1.03 -> 1.12; k334 the thumb lifts.
//  S2  k335-k343  the photo that was not handed in: her, chest up, front on, in the dashed 3:4 photo frame, looking down at her
//                  card (r11_id_a); 句32 in 16-dot columns left of the frame, 句33 in her pencil right of it, mirrored; k340
//                  she shuts her eyes (r11_id_b) and one slow push (k340-k343) goes down to her card (1.12); k341 (snare) a
//                  読取不可 label slams down over the frame's lower left corner (the photo itself stays still).
//  S3a k343-k351  her card back, close (r11_cb): 04's back, the black grown since over the top band (veins from the stab, matte,
//                  bits of dented white letters in it); 句34 / 句35 in her pencil across the lower half; k348 her grip
//                  (r11_cb_grip, the card sinks 3 px and stays); k344 crash: a 3% step (大击), then a slow push to 1.15.
//  S3b k351-k359  a row of four chests, the frame's top edge under the shoulder line (p11_trio3: 09's B 吉田 蓮, A 鈴木 恵子, C 渡辺 翔; r11_row6: her,
//                  in colour): 句36 消えたい comes up white out of all four blacks at once (where a card's paper shows, the
//                  dent shows as a grey groove); her pencil adds って言うんだ on her own card; k354 the long eraser comes down
//                  from above the frame onto B's card and rubs straight across all four; 句37 死にたい in pencil on the rubbed
//                  strip, って言うんだ again on her card; k355 the camera stops with one small step on the snare; the fill
//                  k356-k358.5 plays inside the picture: a timing mark printed down every card's right edge on each eighth,
//                  and k357.5 the eraser again from B's card across all four, out of the frame on the cut.
// (2026-11-21 rhythm pass, user: 「希望视频跟歌曲节奏一致」 and 「歌词好像比曲子慢了一点」: every sung letter is whole on its
// onset frame, LYRIC AUDIT. Third round, same day, user after the second cut: 「你为什么要一直抖动屏幕？……看着很晕」: the
// rhythm pass's camera steps, kicks and the card's sink are gone (docs/制作约定.md 第六节「整屏运动」, MOTION AUDIT): two 大击
// (k327, k344), one ordinary step (k355), slow eased pushes; the beat is carried by the stamps, the writing, the swaps, the
// timing marks and the eraser. 「笔芯和笔不对了」: every part drawn on a drawing is measured on that drawing, parts.js, PART AUDIT.)
// Everything shared comes from web/lib/ (score, type, camera, print, lyrics, palette, hand). Drawings: art/cut (Codex,
// art/design/prompts/_make_seg11.py and _make_seg11f.py); measured by work/seg/11/anchors.py, anchors_f.py.
import { BEAT, FRAME as FR, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, pushes, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, partAudit, pixelsOf, PIX, partReport } from '../../lib/parts.js';
import { dots16, print16, pencilWriter, vertical, sungBuild, sungShown, sungSweep } from '../../lib/print.js';
import { loadLyrics, lyricAudit } from '../../lib/lyrics.js';
import { createHand } from '../../lib/hand.js';
import { BACK } from '../../lib/her_card.js';
import { PAPER, PAPER_CARD, PAPER_SLIP, PAPER_RGB, FIBRE_RGB, TEAL, TEAL_RGB, GRAPHITE, GRAPHITE_FIELD, INK_RGB, PENCIL, PENCIL_FILL,
         GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, REHATCH_LIGHT_RGB, HAND_SHADOW, CARD_SHADOW, rgba } from '../../lib/palette.js';

export default async function seg11(H) {
  const { g, W, q, rng, img, rinPalImage } = H;
  const F0 = 3643, F1 = 3998, SEG = [F0 / 30, F1 / 30];
  const S = createScore('seg_11', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const K = beatV;
  const P = (k, v) => +(q.get(k) ?? v);
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return [c, c.getContext('2d')]; };
  for (const [fam, url] of [['Kurenaido', '/assets/fonts/zenkurenaido_ZenKurenaido-Regular.ttf'], ['YomogiH', '/assets/fonts/Yomogi-Regular.ttf']]) {
    const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f);
  }
  const PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
  const PEN_OLD = pencilWriter({ font: '600 #px Klee', color: rgba(INK_RGB, 0.34) });   // what she wrote in 04, older and handled
  const LY = await loadLyrics({ within: [121.0, 134.0] });
  const L0 = LY.lineAt(0), L1 = LY.lineAt(1), L2A = LY.lineAt(2).slice(0, 7), L11 = LY.lineAt(11, '無個性な僕のこと');
  const L30 = LY.lineAt(30, '昨日の宿題は'), L31 = LY.lineAt(31, '相変わらず解けないや'), L32 = LY.lineAt(32, '過不足無い不自由無い');
  const L33 = LY.lineAt(33, '最近に生きていて'), L34 = LY.lineAt(34, 'でもどうして僕達の'), L35 = LY.lineAt(35, '胸元の塊は');
  const L36 = LY.lineAt(36, '消えたいって言うんだ'), L37 = LY.lineAt(37, '死にたいって言うんだ');
  const KIE = L36.slice(0, 4), TTE1 = L36.slice(4), SHI = L37.slice(0, 4), TTE2 = L37.slice(4);
  const shiGate = tt => sungShown(tt, SHI[0][1]);         // 死にたい goes on the rubbed strips from the frame 死 is sung on
  // every part drawn on a drawing (the pencil point the strokes start from, the thumb that rubs, the cuff the three hand
  // drawings share, each blank card's rectangle and fill mask) is measured on THAT drawing: art/cut/seg11_parts.json
  // (work/seg/11/parts_measure.py; web/lib/parts.js, PART AUDIT at the end)
  const PA = await loadPartAnchors('/art/cut/seg11_parts.json');
  const PART_CHECKS = [];                       // [drawing name, raw image, cards] for the PART AUDIT
  const T327 = K(327), T336 = K(336), T332 = K(332), T334 = K(334), T335 = K(335), T340 = K(340), T341 = K(341);
  const T343 = K(343), T348 = K(348), T351 = K(351), T354 = K(354), T355 = K(355), T358 = K(358), T359 = K(359);
  // (2026-11-21, 「我们的歌词好像比曲子慢了一点」) every sung letter of this page is whole on the frame its onset falls in
  // (print.js sungBuild: 55% the frame before, nothing earlier); the old 3-frame build here made them read 1-3 frames late.
  // The LYRIC AUDIT at the end reads each letter's opacity through these same functions.
  const lerp = (a, b, u) => a + (b - a) * u;
  // The camera steps (台阶, 2026-11-21 rhythm pass: 「希望视频跟歌曲节奏一致」). A step starts on its beat: the first frame at or
  // after the beat is already ~70% there, the step lands in n frames a little past its mark (ov) and settles back in ~4
  // frames; between steps the camera stands still. stepAt(tt, [[t0, amount, n, ov], ...]) adds up the steps started by tt.
  const stepOne = (tt, t0, amt, n = 3, ov = 0) => { if (tt < t0 - 1e-9) return 0; const k = Math.floor((tt - t0) / FR + 1e-6) + 1;
    return k < n ? (amt + ov) * ease(k / n) : amt + ov * Math.exp(-(k - n) / 1.8); };
  const stepAt = (tt, list) => list.reduce((a, [t0, amt, n, ov]) => a + stepOne(tt, t0, amt, n, ov), 0);
  // how far (0..1) the step started at t0 has gone (for a focus that travels with the step)
  const stepU = (tt, t0, n = 3) => { if (tt < t0 - 1e-9) return 0; const k = Math.floor((tt - t0) / FR + 1e-6) + 1; return k < n ? ease(k / n) : 1; };
  const lyricRows = [];                         // [{ c, t, f: tt -> opacity 0..1, need }] for the LYRIC AUDIT
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  // the frames of a shot in which the camera stands (the frame's corners move less than 3 px to the next frame): a word may
  // cross the frame's edge while the camera moves, but the picture must never stand on half a word
  const standing = vs => vs.filter((v, i) => { const n = vs[i + 1] || vs[i - 1]; if (!n) return true;
    const d = (px, py, a) => [960 + (px - a.fx) * a.z, 540 + (py - a.fy) * a.z];
    return [[0, 0], [1920, 1080]].every(([sx, sy]) => { const wx = v.fx + (sx - 960) / v.z, wy = v.fy + (sy - 540) / v.z, [x2, y2] = d(wx, wy, n); return Math.hypot(x2 - sx, y2 - sy) < 3; }); });

  // the shots and drawings (HOLD AUDIT reads these; the renderer asks the score which drawing is on)
  S.hold('shot', 'S1 her 自己紹介カード', T327, T335, { kind: 'shot' });
  S.hold('shot', 'S2 the photo not handed in', T335, T343, { kind: 'shot' });
  S.hold('shot', 'S3a her card back', T343, T351, { kind: 'shot' });
  S.hold('shot', 'S3b the row of card backs', T351, T359, { kind: 'shot' });
  S.hold('hand', 'H11-write', T327, K(331.5), { kind: 'key', file: '/art/cut/h11_write.png' });
  S.hold('hand', 'H11-turn (the pencil slides into the fingers)', K(331.5), T332, { kind: 'inbetween', file: '/art/cut/h11_turn.png' });
  S.hold('hand', 'H11-rub', T332, T335, { kind: 'key', file: '/art/cut/h11_rub.png' });
  S.hold('rin', 'R11-id-a (looks down at her card)', T335, T340, { kind: 'key', file: '/art/cut/r11_id_a.png' });
  S.hold('rin', 'R11-id-b (eyes shut)', T340, T343, { kind: 'key', file: '/art/cut/r11_id_b.png' });
  S.hold('rin', 'R11-cb', T343, T348, { kind: 'key', file: '/art/cut/r11_cb.png' });
  S.hold('rin', 'R11-cb-grip', T348, T351, { kind: 'key', file: '/art/cut/r11_cb_grip.png' });
  S.hold('rin', 'R11-row', T351, T359, { kind: 'key', file: '/art/cut/r11_row6.png' });
  S.hold('town', 'P11-B/A/C', T351, T359, { kind: 'key', file: '/art/cut/p11_trio3.png' });

  // =====================================================================================================================
  // graphite: the same make as Demo 2's black and 04's veins (a repeating hatch tile; veins; the lump at the stab)
  // =====================================================================================================================
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
  const TILE = graphiteTile(256, 14, 40, 1.0, 2.6, 520, 41);
  const patOf = (ctx, tile) => ctx.createPattern(tile, 'repeat');
  function makeVein(pts, seed, burr = 6, wob = 0.08) {
    const ds = []; let s = 0; const r = rng(seed), ph = r() * 10;
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0, w0] = pts[i], [x1, y1, w1] = pts[i + 1], len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(len / 3));
      for (let j = (i ? 1 : 0); j <= n; j++) {
        const u = j / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u, ss = s + len * u;
        const w = (w0 + (w1 - w0) * u) * (1 + wob * Math.sin(ss * 0.031 + ph) + wob * 0.7 * Math.sin(ss * 0.113 + ph * 2) + wob * 0.5 * Math.sin(ss * 0.29 + ph * 3));
        ds.push({ x, y, w, s: ss, nx: -(y1 - y0) / len, ny: (x1 - x0) / len });
      }
      s += len;
    }
    const burrs = [];
    for (const d of ds) for (const side of [-1, 1]) {
      if (r() < 0.62) continue;
      const a0 = Math.atan2(d.ny * side, d.nx * side), hatch = (r() < 0.5 ? -0.5 : 0.55) + (side < 0 ? Math.PI : 0);
      const a = a0 * 0.5 + hatch * 0.5 + (r() - 0.5) * 0.5, long = r() < 0.025;
      burrs.push({ x: d.x + d.nx * side * d.w * 0.8, y: d.y + d.ny * side * d.w * 0.8, a, l: burr * (long ? 1.3 + r() * 0.8 : 0.3 + r() * 0.55),
                   lw: burr * (long ? 0.12 : 0.22 + r() * 0.2), al: long ? 0.6 + r() * 0.2 : 0.75 + r() * 0.2 });
    }
    return { ds, burrs, len: s };
  }
  function drawVein(ctx, v) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = patOf(ctx, TILE);
    for (let i = 1; i < v.ds.length; i++) { const a = v.ds[i - 1], b = v.ds[i]; ctx.lineWidth = Math.max(0.5, 2 * b.w); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    for (const br of v.burrs) { ctx.strokeStyle = rgba(INK_RGB, br.al); ctx.lineWidth = br.lw; ctx.beginPath(); ctx.moveTo(br.x, br.y); ctx.lineTo(br.x + Math.cos(br.a) * br.l, br.y + Math.sin(br.a) * br.l); ctx.stroke(); }
    ctx.restore();
  }
  function makeLump(cx, cy, R, seed, burr) {
    const r = rng(seed), ph = [r() * 7, r() * 7, r() * 7], pts = [], burrs = [];
    for (let i = 0; i < 120; i++) { const a = i / 120 * Math.PI * 2, n = 0.5 * Math.sin(a * 3 + ph[0]) + 0.3 * Math.sin(a * 7 + ph[1]) + 0.2 * Math.sin(a * 13 + ph[2]); const rr = R * (1 + 0.16 * n); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, a]); }
    for (const [x, y, a] of pts) for (let k = 0; k < 2; k++) { if (r() < 0.5) continue; const ang = a + (r() - 0.5), long = r() < 0.05; burrs.push({ x, y, a: ang, l: burr * (long ? 1.4 + r() : 0.3 + r() * 0.6), lw: burr * (long ? 0.12 : 0.22 + r() * 0.2), al: 0.7 + r() * 0.25 }); }
    return { pts, burrs };
  }
  function drawLump(ctx, m) {
    ctx.save(); ctx.fillStyle = patOf(ctx, TILE); ctx.beginPath(); m.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
    ctx.lineCap = 'round'; for (const br of m.burrs) { ctx.strokeStyle = rgba(INK_RGB, br.al); ctx.lineWidth = br.lw; ctx.beginPath(); ctx.moveTo(br.x, br.y); ctx.lineTo(br.x + Math.cos(br.a) * br.l, br.y + Math.sin(br.a) * br.l); ctx.stroke(); }
    ctx.restore();
  }

  // =====================================================================================================================
  // the card backs (card units: 637 x 425, the card back of art/canon/card_back_rules.png as 04 lays it out; each card is
  // drawn at this size and set onto the card's four corners in the drawing). Layers, so the eraser takes the pencil and leaves
  // the print: paper (with the dents' grooves), print, black (dented letters cut out of it), rubbed strips, pencil after.
  // =====================================================================================================================
  const CU = 637, CH = 425;
  const RULE_Y = [186, 226, 266, 306, 346, 386], DBL = [140, 147], FRAME_X = [14, 623], STAB = [294, 143.5];
  const SC = { x0: 584, cm: 60, y: 398, digitY: 414 };          // 04's centimetre scale in the bottom margin
  const LET = { y: 92, size: 138 };                              // the four words: across the card, 0.5-4.0 cm from its top edge
  const BAND = 172;                                              // the rubbed strip: from the top edge to 4.3 cm (all the words)
  // her pencil on her own card (card units; S3a writes 句34/35, S3b adds って言うんだ twice): rows under the eraser's strip
  // (below 172), clear of her fingertips (below y 323 at the two lower corners), and set BETWEEN 04's three older lines, never
  // over them: 04 wrote 句1, 句2 (first half) and 句0 small just above ruled lines 2, 4 and 6 (ink y 192-218, 272-298, 352-378;
  // x from 52 to 435, 231 and 358). 句34 sits on ruled line 3 under 句1; 句35 on ruled line 4 right of 04's 病弱な愛が飛び;
  // the two って言うんだ side by side on ruled line 5, between 句2 and 句0 (the song says it twice)
  const HERP = { r34: { x: 52, y: 246, size: 40 }, r35: { x: 262, y: 286, size: 40 }, t1: { x: 58, y: 326, size: 40 }, t2: { x: 330, y: 326, size: 40 } };
  const herRowBox = (row, n) => [row.x, row.y - row.size * 0.5, row.size * 1.04 * n, row.size];
  const oldLineBox = (ri, n) => [52, RULE_Y[ri] - 36, 25 * 1.02 * n, 30];                       // 04's lineBoxOf
  const OLD_LINES = () => [['04 句1 (old)', oldLineBox(1, L1.length)], ['04 句2 first half (old)', oldLineBox(3, L2A.length)], ['04 句0 (old)', oldLineBox(5, L0.length)]];
  const rowAt = (row, i) => [row.x + row.size * 1.04 * (i + 0.5), row.y];
  // who holds which card (docs/分镜/09 第 6 节: the owners of 09's cards A, B, C; written into docs/设定包.md)
  const OWN = {
    A: { black: 'full', font: '400 #px Kurenaido', sx: 0.86, skew: 0, size: 0.82, jit: 0.02, seed: 101 },     // 鈴木 恵子 (h01): small, neat
    B: { black: 'loops', font: '400 #px YomogiH', sx: 1.06, skew: 0, size: 0.98, jit: 0.07, seed: 202 },     // 吉田 蓮 (p09): big, loose
    C: { black: 'hatch', font: '500 #px ZenKaku', sx: 0.7, skew: -0.24, size: 0.9, jit: 0.05, seed: 303, wobble: 0.035, span: [35, 522] }, // 渡辺 翔 (p05): cramped, slanted, shaky block print (not A's brush hand); kept left of her sleeve
    R: { black: 'veins', font: '600 #px Klee', sx: 1.0, skew: 0, size: 0.76, jit: 0.015, seed: 404 },         // her: Demo 1's hand (set smaller: her card is drawn ~9% wider in S3b)
  };
  function printLayer(x, who) {
    x.fillStyle = GRAPHITE; for (const [mx, my] of [[22, 20], [599, 20], [22, 392], [599, 392]]) x.fillRect(mx, my, 16, 16);
    x.fillStyle = TEAL; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = '700 21px ZenKakuB'; x.fillText('記入上の注意', 52, 52);
    x.font = '500 12.5px ZenKaku';
    [['1.', 'HBの黒鉛筆で、○の中を正確にぬりつぶしてください。'], ['2.', 'はみ出したり、うすかったりすると読み取れません。'], ['3.', '訂正するときは、消しゴムできれいに消し、消しくずを残さないでください。']]
      .forEach(([n, t], i) => { x.fillText(n, 52, 77 + i * 18); x.fillText(t, 70, 77 + i * 18); });
    x.font = '500 11px ZenKaku'; x.fillText('なまえ', 372, 54); x.fillRect(408, 62, 182, 1.2);
    for (const y of DBL) x.fillRect(FRAME_X[0], y - 1.1, FRAME_X[1] - FRAME_X[0], 2.2);
    for (const fx of FRAME_X) x.fillRect(fx - 1, DBL[1], 2, RULE_Y[5] - DBL[1]);
    x.globalAlpha = 0.75; for (const y of RULE_Y) x.fillRect(FRAME_X[0], y - 0.6, FRAME_X[1] - FRAME_X[0], 1.2); x.globalAlpha = 1;
    x.font = '500 10px ZenKaku'; x.textAlign = 'right'; x.fillText('メモ欄（採点対象外）', 598, 168); x.textAlign = 'left';
    if (who !== 'R') return;
    // hers: 04's scale, her name, 04's three lines on the ruled lines (older, lighter), 04's はみ出しています at the lower right
    x.fillRect(SC.x0 - 8 * SC.cm - 1, SC.y, 8 * SC.cm + 2, 1.1);
    for (let mm = 0; mm <= 80; mm++) { const tx = SC.x0 - mm * SC.cm / 10, l = mm % 10 === 0 ? 8 : mm % 5 === 0 ? 5.5 : 3.2; x.fillRect(tx - 0.4, SC.y, 0.8, l); }
    x.font = '600 9px ZenKaku'; x.textAlign = 'center'; for (let cm = 0; cm <= 8; cm++) x.fillText(String(cm), SC.x0 - cm * SC.cm, SC.digitY); x.textAlign = 'left';
    x.font = '500 7px ZenKaku'; x.fillText('cm', SC.x0 + 7, SC.digitY);
    PEN.line(x, [...'鏡音リン'].map(c => [c, -1]), [418, 40, 120, 22], 0, 20);
    const lineBoxOf = (ri, n) => [52, RULE_Y[ri] - 36, 25 * 1.02 * n, 30];
    PEN_OLD.line(x, L1.map(([c]) => [c, -1]), lineBoxOf(1, L1.length), 0, 25);
    PEN_OLD.line(x, L2A.map(([c]) => [c, -1]), lineBoxOf(3, L2A.length), 0, 25);
    PEN_OLD.line(x, L0.map(([c]) => [c, -1]), lineBoxOf(5, L0.length), 0, 25);
    print16(x, 'はみ出しています', 540, 372, 1.1, 1, 94);
  }
  // her black, as it has grown since 04 (each segment a little more black: the film's progress bar). 04 left a vein along the
  // double line from the stab; since then the black has spread up from the stab over the rules: veins radiating from the stab,
  // grown together into a mass of dry hatched graphite, its top edge scalloped where the veins end. Matte, no drips: nothing
  // runs down out of it (the review of the samples: the closed black frame read as a mourning border).
  function herBlack(x) {
    const r = rng(4404), N = 15;
    // the veins' tips along the top, and the mass's top edge: high at each tip, dipping a little between them
    // (2026-11-21: the whole mass sits SH lower than before, so its scalloped top stays whole inside the paper margin)
    const SH = MARG.m - 7;
    const tips = []; for (let i = 0; i < N; i++) tips.push([10 + (CU - 20) * (i + 0.5) / N + (r() - 0.5) * 14, 5 + SH + r() * 6]);
    const topY = xx => { let best = 30 + SH; for (const [tx, ty] of tips) { const d = Math.abs(xx - tx) / ((CU - 20) / N); best = Math.min(best, ty + 15 * Math.min(1, d * d * 1.6)); } return best + 3 * Math.sin(xx * 0.21); };
    x.save(); x.fillStyle = patOf(x, TILE); x.beginPath(); x.moveTo(9, DBL[1] + 3);
    for (let xx = 9; xx <= CU - 9; xx += 3) x.lineTo(xx, topY(xx));
    x.lineTo(CU - 9, DBL[1] + 3); x.closePath(); x.fill(); x.restore();
    // the veins: from the stab out to each tip (and two along the double line to the frame corners), darker ridges in the mass
    const RAYS = tips.map(([ex, ey], i) => { const mx = lerp(STAB[0], ex, 0.5) + (r() - 0.5) * 30, my = lerp(STAB[1], ey, 0.5) + (r() - 0.5) * 12;
      return makeVein([[STAB[0], STAB[1], 12 + r() * 3], [mx, my, 8 + r() * 3], [ex, ey + 2, 3]], 600 + i, 3.5); });
    for (const ex of [FRAME_X[0] + 2, FRAME_X[1] - 2]) RAYS.push(makeVein([[STAB[0], STAB[1], 15], [ex, DBL[0] + 3, 9]], ex < 300 ? 11 : 12, 5));
    x.save(); x.lineCap = 'round';
    for (const v of RAYS) for (let i = 1; i < v.ds.length; i++) { const a = v.ds[i - 1], b = v.ds[i];
      x.strokeStyle = rgba(GRAPHITE_DARK_RGB, 0.55); x.lineWidth = Math.max(0.5, 1.5 * b.w); x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
      x.strokeStyle = rgba(GRAPHITE_LIGHT_RGB, 0.35); x.lineWidth = 0.9; x.beginPath(); x.moveTo(a.x + a.nx * a.w, a.y + a.ny * a.w); x.lineTo(b.x + b.nx * b.w, b.y + b.ny * b.w); x.stroke(); }
    x.restore();
    for (const v of RAYS) for (const br of v.burrs) { x.strokeStyle = rgba(INK_RGB, br.al * 0.8); x.lineWidth = br.lw; x.beginPath(); x.moveTo(br.x, br.y); x.lineTo(br.x + Math.cos(br.a) * br.l, br.y + Math.sin(br.a) * br.l); x.stroke(); }
    drawLump(x, makeLump(STAB[0], STAB[1] + 3, 23, 13, 4));
  }
  // The black may take the card back only inside a paper margin, never round the holder slot (docs/卡面状态.md 第四节:
  // 卡背整张被涂黑的镜头也要留住纸边和卡夹孔，颈绳接在卡夹孔上; margin, slot and ring are her_card.js's BACK, in card units).
  // On a phone (390 x 220) a card whose black ran to its edges read as a phone screen held in two hands (2026-11-21 phone
  // check, A's card in S3b). So every back keeps: the paper margin, its edge ragged where the hand stopped short (a pencil
  // edge, not a cut); a paper notch round the clip at the slot; the four printed corner marks standing in paper (the hand
  // went round them: at phone size they are the form card's tell); and the paper's tooth showing through the graphite.
  const MARG = { m: BACK.margin * CU, slot: BACK.slot.map(v => v * CU), ring: BACK.slotRing * CU, marks: [[22, 20], [599, 20], [22, 392], [599, 392]], markSz: 16, markRing: 5 };
  function blackRegion(x, seed) {
    const r = rng(seed + 900), c = x.canvas, res = x.getTransform().a, w = c.width, h = c.height;
    // the ragged edge: per side a slow wobble along it plus a fibrous grain
    const ph = [0, 1, 2, 3].map(() => [r() * 7, r() * 7]);
    const wob = (k, s) => 2.4 * Math.sin(s * 0.085 + ph[k][0]) + 1.4 * Math.sin(s * 0.27 + ph[k][1]);
    const [mc, mx] = mk(w, h), md = mx.createImageData(w, h), m = MARG.m;
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
      const X = (px + 0.5) / res, Y = (py + 0.5) / res, g = (r() - 0.5) * 1.4;
      const d = Math.min(X - (m + wob(0, Y)), CU - X - (m + wob(1, Y)), Y - (m + wob(2, X)), CH - Y - (m + wob(3, X))) + g;
      md.data[(py * w + px) * 4 + 3] = Math.round(255 * Math.max(0, Math.min(1, d * res + 0.5)));
    }
    mx.putImageData(md, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(mc, 0, 0); x.restore();
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000';
    const [sx, sy, sw, sh] = MARG.slot, ring = MARG.ring;
    x.beginPath(); x.roundRect(sx - ring, -5, sw + 2 * ring, sy + sh + ring + 5, sh / 2 + ring); x.fill();
    const R = MARG.markRing; for (const [mx0, my0] of MARG.marks) { x.beginPath(); x.roundRect(mx0 - R, my0 - R, MARG.markSz + 2 * R, MARG.markSz + 2 * R, R); x.fill(); }
    // the paper's tooth: short pale flecks along the grain where the graphite skipped (as her_card.js's back)
    for (let i = 0; i < 3300; i++) { x.fillStyle = `rgba(0,0,0,${0.08 + r() * 0.24})`; x.fillRect(r() * CU, r() * CH, 1.6 + r() * 4.2, 0.55 + r() * 0.5); }
    x.globalCompositeOperation = 'source-over';
  }
  function blackLayer(x, kind, seed) {
    const r = rng(seed); x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
    if (kind === 'full') {                          // A: line after line from the top, the lines giving out lower down
      // each line one stroke of the pencil, its ends ragged short of the margin and its pressure varying a little from line
      // to line (a hand fill, not a cut black block). The top band (the four words and the eraser's strip, to y A_FULL) is
      // filled to the margin; below it her lines stop short, at ~77% of the card's width tapering to ~60% at the bottom,
      // each line's end a little off the last. 2026-11-21 phone check (390 x 220, A's card ~74 px wide): filled to the
      // margin everywhere it was a white rim round one black slab, a phone held in two hands; the 8-unit line pitch and the
      // 0-30 unit ragged ends are under 1 px and 4 px there. The lower right now stays paper (its ruled lines and the メモ欄
      // label showing) over a block of roughly 20-35% x 55% of the card, ~15-25 px x ~25 px on a phone: a sheet of paper
      // someone has been blacking in, not a screen.
      const M = MARG.m, A_FULL = 160, yEnd = CH - M - 2, endAt = [];
      for (let y = M + 4; y < yEnd; y += 8) {
        const u = Math.max(0, (y - A_FULL) / (yEnd - A_FULL));
        const end = y < A_FULL ? CU - M - 2 - r() * r() * 30 : CU * (0.77 - 0.17 * u) + (r() - 0.5) * 34;
        endAt.push([y, end]);
        x.globalAlpha = 0.84 + r() * 0.16; x.strokeStyle = patOf(x, TILE); x.lineWidth = 10 + r() * 3;
        x.beginPath(); x.moveTo(M + 2 + r() * 8, y + r() * 2); x.lineTo(end, y + r() * 2); x.stroke();
      }
      x.globalAlpha = 1; x.strokeStyle = rgba(GRAPHITE_DARK_RGB, 0.25); x.lineWidth = 3;
      for (const [y, end] of endAt) { x.beginPath(); x.moveTo(M + 8, y + 2 + r() * 2); x.lineTo(end - 6 - r() * 14, y + 2 + r() * 2); x.stroke(); }
    } else if (kind === 'loops') {                  // B: loose loops wound round and round; packed tight across the top band
      x.strokeStyle = patOf(x, TILE);
      const loop = (cx, cy, R, ry, turns, ph, lw) => { x.lineWidth = lw; x.beginPath();
        for (let i = 0; i <= 90; i++) { const a = ph + i / 90 * turns * Math.PI * 2, rr = 1 - i / 90 * 0.35; const px = cx + Math.cos(a) * R * rr, py = cy + Math.sin(a) * ry * rr; i ? x.lineTo(px, py) : x.moveTo(px, py); }
        x.stroke(); };
      for (let k = 0; k < 40; k++) loop(30 + r() * (CU - 60), 200 + r() * (CH - 230), 30 + r() * 70, 25 + r() * 40, 2 + r() * 3, r() * 7, 9 + r() * 9);
      for (let k = 0; k < 64; k++) loop(16 + r() * (CU - 32), 14 + r() * 168, 26 + r() * 46, 18 + r() * 30, 2.5 + r() * 2.5, r() * 7, 13 + r() * 9);
    } else if (kind === 'hatch') {                  // C: one direction of hatching, dense, stopped a little past half way down
      x.strokeStyle = patOf(x, TILE);
      for (let i = -50; i < 110; i++) {
        const x0 = i * 7 + r() * 2, stop = 236 + 26 * Math.sin(i * 0.31) + r() * 18;
        x.lineWidth = 7 + r() * 3; x.beginPath(); x.moveTo(x0, 4); x.lineTo(x0 + stop * 0.42, Math.min(CH - 6, stop)); x.stroke();
      }
    } else if (kind === 'veins') herBlack(x);
    blackRegion(x, seed);
    x.restore();
  }
  // a word's letters as glyph canvases in one owner's hand (card units x RES), set across the card
  function wordGlyphs(word, own, res) {
    const [sx0, sx1] = own.span || [35, CU - 35], n = word.length, step = (sx1 - sx0) / n, size = LET.size * own.size, r = rng(own.seed + word[0][0].charCodeAt(0));
    return word.map(([ch, t], i) => {
      const S2 = Math.ceil(size * res * 1.5);
      let [c, x] = mk(S2, S2);
      x.translate(S2 / 2, S2 / 2); x.transform(own.sx, 0, own.skew, 1, 0, 0); x.rotate((r() - 0.5) * own.jit * 6);
      x.font = own.font.replace('#', Math.round(size * res)); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = GRAPHITE; x.fillText(ch, 0, 0);
      if (own.wobble) {         // a shaky hand: the letter's rows pushed sideways by a slow uneven wave, its columns up and down
        const [c2, x2] = mk(S2, S2), [c3, x3] = mk(S2, S2), A = own.wobble * S2, ph = r() * 7, ph2 = r() * 7;
        for (let yy = 0; yy < S2; yy += 2) x2.drawImage(c, 0, yy, S2, 2, A * (0.6 * Math.sin(yy / S2 * 9 + ph) + 0.4 * Math.sin(yy / S2 * 23 + ph2)), yy, S2, 2);
        for (let xx = 0; xx < S2; xx += 2) x3.drawImage(c2, xx, 0, 2, S2, xx, A * 0.7 * Math.sin(xx / S2 * 11 + ph2), 2, S2);
        c = c3;
      }
      return { ch, t, c, x: sx0 + step * (i + 0.5) + (r() - 0.5) * step * own.jit * 2, y: LET.y + (r() - 0.5) * size * own.jit * 3, s: S2 / res };
    });
  }
  const TINT = new Map();
  function tinted(c, rgb, a = 1) {
    let m = TINT.get(c); if (!m) TINT.set(c, (m = new Map()));
    const k2 = rgb.join(',') + '|' + a; if (m.has(k2)) return m.get(k2);
    const [t, x] = mk(c.width, c.height); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = `rgba(${rgb.join(',')},${a})`; x.fillRect(0, 0, c.width, c.height);
    m.set(k2, t); return t;
  }
  // the pieces of her dented letters that show in S3a: a few small irregular windows into the black
  const FRAG_WIN = [[66, 68, 42, 16], [150, 110, 30, 13], [212, 48, 36, 15], [300, 118, 40, 13], [358, 64, 30, 16], [448, 96, 42, 14], [520, 54, 34, 13], [580, 122, 28, 12]];
  // one card: built once at `res` px per card unit; compose(tt, state) draws it into a canvas of its own size
  function makeCard(who, res, { kieWord = null, shiWord = null, frags = false } = {}) {
    const own = OWN[who], w = Math.ceil(CU * res), h = Math.ceil(CH * res);
    const [paper, px] = mk(w, h); px.scale(res, res); px.fillStyle = PAPER_CARD; px.fillRect(0, 0, CU, CH);
    { const r = rng(own.seed + 7); for (let i = 0; i < 900; i++) { px.strokeStyle = rgba(FIBRE_RGB, 0.05 + r() * 0.07); px.lineWidth = 0.4; const a = r() * 7, l = 3 + r() * 8, x0 = r() * CU, y0 = r() * CH; px.beginPath(); px.moveTo(x0, y0); px.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); px.stroke(); } }
    const kie = kieWord ? wordGlyphs(kieWord, own, res) : [], shi = shiWord ? wordGlyphs(shiWord, own, res) : [];
    // the dents on bare paper: a groove (graphite dust caught along its edges), so a letter reads where no black covers it
    const [paperK] = mk(w, h);
    { const x = paperK.getContext('2d'); x.drawImage(paper, 0, 0);
      for (const L of kie) { const X0 = (L.x - L.s / 2) * res, Y0 = (L.y - L.s / 2) * res, SS = L.s * res, d = 2.4 * res;
        for (const [dx, dy] of [[-d, 0], [d, 0], [0, -d], [0, d], [d * 0.7, d * 0.7], [-d * 0.7, -d * 0.7]]) x.drawImage(tinted(L.c, GRAPHITE_LIGHT_RGB, 0.42), X0 + dx, Y0 + dy, SS, SS);
        x.drawImage(tinted(L.c, GRAPHITE_LIGHT_RGB, 0.3), X0 + d * 0.6, Y0 + d * 0.9, SS, SS);
        x.drawImage(tinted(L.c, PAPER_RGB, 1), X0, Y0, SS, SS); x.drawImage(tinted(L.c, GRAPHITE_LIGHT_RGB, 0.07), X0, Y0, SS, SS); } }
    const [prn, pr] = mk(w, h); pr.scale(res, res); printLayer(pr, who);
    const [blk, bk] = mk(w, h); bk.scale(res, res); blackLayer(bk, own.black, own.seed);
    function rubTexture(seed) {
      const [c, x] = mk(w, h), r = rng(seed); x.scale(res, res);
      x.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 0.15); x.fillRect(0, 0, CU, CH);
      for (let i = 0; i < 300; i++) { x.strokeStyle = r() < 0.55 ? rgba(GRAPHITE_LIGHT_RGB, 0.06 + r() * 0.14) : rgba(PAPER_RGB, 0.5); x.lineWidth = 1 + r() * 4;
        const x0 = r() * CU, y0 = r() * BAND, l = 20 + r() * 70; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + (r() - 0.5) * 4, y0 + l); x.stroke(); }
      return c;
    }
    const RUB = [rubTexture(own.seed + 11), rubTexture(own.seed + 12)];
    const [out, o] = mk(w, h), [tmp, tx] = mk(w, h);
    // state: { rubs: [[x1 (card units, rubbed left of it), yBottom], [..]] for the two passes; shiOn; kieAll }
    function compose(tt, st = {}) {
      const rubs = st.rubs || [];
      const inRub = (ctx, k) => { const [ex, yb] = rubs[k]; ctx.beginPath(); ctx.rect(-5, -5, ex + 5, yb + 5); };
      o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = 'source-over'; o.globalAlpha = 1; o.clearRect(0, 0, w, h);
      // the grooves exist from the start (they were pressed in long ago); bare paper shows them only as they come up
      const lettersOn = frags ? kie : kie.filter(L => st.kieAll || sungShown(tt, L.t));
      o.drawImage(paper, 0, 0);
      if (!frags && lettersOn.length) {
        o.save(); o.beginPath();
        for (const L of lettersOn) { const a = st.kieAll ? 1 : sungBuild(tt - L.t); o.rect((L.x - L.s / 2) * res, (L.y - L.s / 2) * res, L.s * res * a, L.s * res); }
        o.clip(); o.drawImage(paperK, 0, 0); o.restore();
      }
      rubs.forEach((rb, k) => { if (rb[0] <= 0) return; o.save(); o.scale(res, res); inRub(o, k); o.clip(); o.setTransform(1, 0, 0, 1, 0, 0); o.drawImage(paper, 0, 0); o.drawImage(RUB[k], 0, 0); o.restore(); });
      o.drawImage(prn, 0, 0);
      // the black, the dented letters cut out of it with a dark rim along each cut, the rubbed strips taken out
      tx.setTransform(1, 0, 0, 1, 0, 0); tx.globalCompositeOperation = 'source-over'; tx.globalAlpha = 1; tx.clearRect(0, 0, w, h); tx.drawImage(blk, 0, 0);
      const cut = (fn) => {
        if (frags) { tx.save(); tx.beginPath(); for (const [fx, fy, fw, fh] of FRAG_WIN) { tx.moveTo((fx + fw) * res, (fy + fh / 2) * res); tx.ellipse((fx + fw / 2) * res, (fy + fh / 2) * res, fw / 2 * res, fh / 2 * res, 0, 0, 7); } tx.clip(); fn(1); tx.restore(); }
        else fn(null);
      };
      tx.globalCompositeOperation = 'source-atop';
      cut(fa => { for (const L of lettersOn) { const a = fa ?? (st.kieAll ? 1 : sungBuild(tt - L.t)); tx.globalAlpha = 0.9 * a;
        for (const [dx, dy] of [[-1.2, 0], [1.2, 0], [0, -1.2], [0, 1.2]]) tx.drawImage(tinted(L.c, GRAPHITE_DARK_RGB), (L.x - L.s / 2) * res + dx * res / 2, (L.y - L.s / 2) * res + dy * res / 2, L.s * res, L.s * res); } });
      tx.globalCompositeOperation = 'destination-out';
      cut(fa => { for (const L of lettersOn) { tx.globalAlpha = fa ?? (st.kieAll ? 1 : sungBuild(tt - L.t)); tx.drawImage(L.c, (L.x - L.s / 2) * res, (L.y - L.s / 2) * res, L.s * res, L.s * res); } });
      tx.globalAlpha = 1;
      rubs.forEach((rb, k) => { if (rb[0] <= 0) return; tx.save(); tx.scale(res, res); inRub(tx, k); tx.fill(); tx.restore(); });
      o.drawImage(tmp, 0, 0);
      // the pencil words written on the rubbed strip after the first pass (taken out again by the second)
      if (shi.length && st.shiOn) {
        tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, w, h);
        for (const L of shi) { if (!sungShown(tt, L.t) && !st.shiAll) continue; tx.globalAlpha = 0.92 * sungBuild(st.shiAll ? 9 : tt - L.t); tx.drawImage(tinted(L.c, INK_RGB), (L.x - L.s / 2) * res, (L.y - L.s / 2) * res, L.s * res, L.s * res); }
        tx.globalAlpha = 1; if (rubs[1] && rubs[1][0] > 0) { tx.globalCompositeOperation = 'destination-out'; tx.save(); tx.scale(res, res); inRub(tx, 1); tx.fill(); tx.restore(); }
        o.drawImage(tmp, 0, 0);
      }
      // her own pencil on her card (S3a writes 句34/35 as she sings; S3b has them and adds って言うんだ)
      if (st.her) { o.save(); o.scale(res, res); st.her(o, tt); o.restore(); }
      return out;
    }
    return { who, res, w, h, compose, kie, shi };
  }
  // her pencil rows on her card, card units (written as sung, or all there with all = true)
  function herRows(ctx, tt, rows) {
    for (const [chars, row, all] of rows) chars.forEach(([c, t], i) => { const [x, y] = rowAt(row, i); PEN.char(ctx, c, x, y, row.size, all ? 9 : tt - t); });
  }
  // a figure drawing with blank cards in it; the film paints each card through its fill mask, set on the card's corners
  async function figure(name, pal) {
    const im0 = await img(`/art/cut/${name}.png`), im = pal ? rinPalImage(im0) : im0;
    const cards = await Promise.all(partOf(PA, name, 'cards').map(async c => ({ ...c, maskImg: await img(c.mask) })));
    PART_CHECKS.push([name, im0, cards]);
    return { name, im, cards, w: im.width, h: im.height };
  }
  const PC = {};
  function paintCards(ctx, F, X, Y, s, contents) {
    F.cards.forEach((c, i) => {
      const content = contents[i]; if (!content) return;
      const [x0, y0, x1, y1] = c.rect, ow = Math.ceil((x1 - x0) * s * 1.6), oh = Math.ceil((y1 - y0) * s * 1.6);
      const key = `${F.name}${i}`; let oc = PC[key]; if (!oc || oc.width !== ow) { oc = PC[key] = mk(ow, oh)[0]; }
      const ox = oc.getContext('2d'); ox.globalCompositeOperation = 'source-over'; ox.clearRect(0, 0, ow, oh);
      ox.imageSmoothingQuality = 'high'; ox.drawImage(content, 0, 0, ow, oh);
      ox.globalCompositeOperation = 'destination-in'; ox.drawImage(c.maskImg, x0, y0, x1 - x0, y1 - y0, 0, 0, ow, oh);
      ctx.drawImage(oc, X + x0 * s, Y + y0 * s, (x1 - x0) * s, (y1 - y0) * s);
    });
  }
  // a paper ground (the film's paper white, fibres, a very light teal screen)
  function paperGround(seed, screenA = 0.05) {
    const [c, x] = mk(W, 1080); x.fillStyle = PAPER; x.fillRect(0, 0, W, 1080);
    const r = rng(seed); for (let i = 0; i < 2600; i++) { x.strokeStyle = rgba(FIBRE_RGB, 0.03 + r() * 0.05); x.lineWidth = 0.6; const a = r() * 7, l = 4 + r() * 12, x0 = r() * W, y0 = r() * 1080; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); x.stroke(); }
    if (screenA > 0) { x.fillStyle = rgba(TEAL_RGB, screenA); const p = 7, rr = 1.3, ca = Math.cos(0.26), sa = Math.sin(0.26);
      for (let i = -160; i < 360; i++) for (let j = -160; j < 360; j++) { const u = i * p, v = j * p, X = u * ca - v * sa, Y = u * sa + v * ca; if (X < -3 || Y < -3 || X > W + 3 || Y > 1083) continue; x.beginPath(); x.arc(X, Y, rr, 0, 7); x.fill(); } }
    return c;
  }

  // =====================================================================================================================
  // S1 (k327-k335): her 自己紹介カード close on the 下敷き, from straight above. The frame is the card's lower half, the card's
  // width filling the frame (the 下敷き only a band at each side): the 短所 field's 特になし (07) at the top, 将来の夢 below.
  // k327 the band slams back in and the machine's black 未提出 block lands in the 将来の夢 field on the very spot (and at the
  // size) of 10's last frame, the black 使用中 locker window; the card sinks and springs back (the segment's one 一沉). The
  // strip off 06's result slip is stapled over the 短所 field's right, right above the stamp: 句30 corrects it to 昨日の宿題は,
  // so the right side reads 昨日の宿題は / 未提出. Her hand writes a big ギ beside the stamp, one stroke a beat; 句31 writes
  // itself along the field's top row; k332 her thumb rubs the ギ into solid, frayed graphite streaks, one layer a pass.
  // (Second redesign after the review of 2026-11-21: the whole card at a third of the frame's width was a small card on a
  // big 九九 table, the stamp 8% of the width and on the other side of the screen from 10's window.)
  // (Third pass, review of 2026-11-21 second round: the card sat so high that 07's 特になし and the strip touched the frame's
  // top edge at rest, and the push into 将来の夢 then cut both through the middle of their letters and held there to the cut;
  // the strip was only checked before the push. Now the card is set a little smaller and lower (90 px/cm, card cm 13.1 at
  // the frame's top): the whole top row is in the picture with room round it (短所's label tab, 特になし's label with its
  // ruled border, the strip with 昨日 and its correction); the k327 punch and the push grow the picture from its top edge, so
  // nothing at the top ever leaves; the push drifts toward the right column 昨日の宿題は / 未提出; and the frame audit
  // checks every word of the shot in every frame of it. The strike-through
  // was a dotted hairline through the middle of 本日 and made 日 read 目; it is now a slanted double rule in solid pencil
  // black, running well past 本日 on the left and crossing every stroke at a slant, so it can't be read as part of a letter.)
  // =====================================================================================================================
  const S1 = await (async () => {
    const PXCM = 90, CW = 18.2 * PXCM, CARDH = 25.7 * PXCM, CX0 = 960 - CW / 2, CY0 = -13.1 * PXCM;     // card cm 13.1 at the top
    const cx = cm => CX0 + cm * PXCM, cy = cm => CY0 + cm * PXCM, L = cm => cm * PXCM;
    const RC = 150;                                                    // texture px per card cm (sharp to the push)
    const CF = { name: [5.64, 3.16, 17.04, 5.23, 2.3], theme: [5.64, 5.69, 17.04, 7.68, 2.63], chosho: [1.0, 8.35, 17.2, 12.89, 2.6],
                 tansho: [1.0, 13.35, 17.2, 17.72, 2.6], yume: [1.0, 18.16, 17.2, 24.63, 4.05] };
    const PHOTO = [1.2, 2.97, 3.85, 4.71];
    // the card's print (07's layout and 07's state: her name, 句11 in テーマ, her two cut-off strokes under the 特になし labels)
    const TEX = (() => {
      const u = RC, w = 18.2 * u, h = 25.7 * u, [c, x] = mk(w, h);
      x.fillStyle = PAPER; x.fillRect(0, 0, w, h);
      const r = rng(1771); for (let i = 0; i < 1400; i++) { x.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); x.fillRect(r() * w, r() * h, (0.2 + r() * 0.6) * u, 0.03 * u); }
      x.strokeStyle = TEAL; x.lineWidth = 0.05 * u; x.strokeRect(0.66 * u, 0.6 * u, 16.88 * u, 24.33 * u);
      x.fillStyle = TEAL; x.fillRect(0.66 * u, 0.6 * u, 16.88 * u, 1.95 * u);
      const dotsAt = (text, cxm, cym, hCm, seed, color, align = 'center') => {
        const D = dots16(text, hCm * u / 16, seed, color); const dx = align === 'center' ? cxm * u - D.w / 2 : cxm * u;
        x.drawImage(D.c, D.x0, D.y0, D.w, D.h, dx, cym * u - D.h / 2, D.w, D.h); };
      dotsAt('自己紹介カード', 9.1, 1.58, 1.3, 1772, PAPER_RGB);
      x.strokeStyle = TEAL; x.lineWidth = 0.05 * u; x.setLineDash([0.28 * u, 0.2 * u]); x.strokeRect(PHOTO[0] * u, PHOTO[1] * u, PHOTO[2] * u, PHOTO[3] * u); x.setLineDash([]);
      dotsAt('写真をはる', 3.125, 5.32, 0.5, 1773, TEAL_RGB);
      const field = ([x0, y0, x1, y1, tw], label, lines, seed) => {
        x.strokeStyle = TEAL; x.lineWidth = 0.05 * u; x.strokeRect(x0 * u, y0 * u, (x1 - x0) * u, (y1 - y0) * u);
        x.fillStyle = TEAL; x.fillRect(x0 * u, y0 * u, tw * u, 0.95 * u);
        dotsAt(label, x0 + 0.28, y0 + 0.475, 0.62, seed, PAPER_RGB, 'left');
        x.fillStyle = TEAL;
        for (const f of lines) { const yy = (y0 + (y1 - y0) * f) * u; for (let xx = x0 + 0.35; xx < x1 - 0.3; xx += 0.14) { x.beginPath(); x.arc(xx * u, yy, 0.022 * u, 0, 7); x.fill(); } }
      };
      field(CF.name, '名前', [], 1774); field(CF.theme, 'テーマ', [], 1775);
      field(CF.chosho, '長所', [0.35, 0.53, 0.71, 0.89], 1776); field(CF.tansho, '短所', [0.35, 0.53, 0.71, 0.89], 1777);
      field(CF.yume, '将来の夢', [0.24, 0.38, 0.52, 0.66, 0.8, 0.93], 1778);
      '鏡音リン'.split('').forEach((ch, i) => PEN.char(x, ch, (8.6 + i * 1.22) * u, 4.38 * u, 1.15 * u, 1));
      x.fillStyle = GRAPHITE; for (const [a, b] of [[0.12, 0.12], [17.73, 0.12], [0.12, 25.23], [17.73, 25.23]]) x.fillRect(a * u, b * u, 0.35 * u, 0.35 * u);
      x.fillStyle = TEAL; for (let i = 0; i < 22; i++) x.fillRect((1.5 + i * 0.71) * u, 25.12 * u, 0.07 * u, 0.3 * u);
      // 句11 in テーマ (07, 16-dot)
      L11.forEach(([ch], i) => { const D = dots16(ch, 1.0 * u / 16, 1790 + i, INK_RGB); x.drawImage(D.c, D.x0, D.y0, D.w, D.h, (8.75 + (i + 0.5) * 1.0) * u - D.w / 2, 6.82 * u - D.h / 2, D.w, D.h); });
      // 07's two cut-off strokes in 長所 and three in 短所, under the 特になし labels
      [[1.45, 10.25, 4.3, 10.0, 0.26, 0.85], [1.25, 11.35, 4.6, 11.1, 0.26, 0.62], [1.4, 14.95, 4.4, 14.7, 0.3, 1], [1.2, 16.05, 4.7, 15.8, 0.3, 1], [2.9, 14.15, 3.15, 17.3, 0.3, 0.7]]
        .forEach(([x0, y0, x1, y1, lw, f]) => { x.lineCap = 'round'; x.strokeStyle = PENCIL_FILL; x.lineWidth = lw * u; x.beginPath(); x.moveTo(x0 * u, y0 * u); x.lineTo((x0 + (x1 - x0) * f) * u, (y0 + (y1 - y0) * f) * u); x.stroke(); });
      for (const lb of [{ left: 2.4, cy: 10.75, cell: 1.9, ruled: false, seed: 1795 }, { left: 2.6, cy: 15.55, cell: 2.3, ruled: true, seed: 1796 }]) {
        const D = dots16('特になし', lb.cell * u / 16, lb.seed, INK_RGB), bw = D.w + lb.cell * u * 0.9, bh = D.h + lb.cell * u * 0.56, bx = lb.left * u, by = lb.cy * u - bh / 2;
        x.fillStyle = CARD_SHADOW; x.fillRect(bx + 0.08 * u, by + 0.1 * u, bw, bh);
        x.fillStyle = PAPER_SLIP; x.fillRect(bx, by, bw, bh);
        if (lb.ruled) { x.strokeStyle = GRAPHITE; x.lineWidth = 0.09 * u; x.strokeRect(bx + 0.12 * u, by + 0.12 * u, bw - 0.24 * u, bh - 0.24 * u); }
        x.drawImage(D.c, D.x0, D.y0, D.w, D.h, bx + (bw - D.w) / 2, lb.cy * u - D.h / 2, D.w, D.h);
      }
      // 07's pin hole, top left of the card
      x.fillStyle = rgba(INK_RGB, 0.7); x.beginPath(); x.arc(1.6 * u, 0.7 * u, 0.09 * u, 0, 7); x.fill();
      x.strokeStyle = rgba(INK_RGB, 0.25); x.lineWidth = 0.03 * u; x.beginPath(); x.arc(1.6 * u, 0.7 * u, 0.16 * u, 0, 7); x.stroke();
      return c;
    })();
    // the card's paper under a box of screen px (to lay a rubbed state over the clean one, the paper and the field's dots
    // come back first and the graphite on top; nothing translucent)
    const paperUnder = (ctx, [x0, y0, w, h]) => ctx.drawImage(TEX, (x0 - CX0) / PXCM * RC, (y0 - CY0) / PXCM * RC, w / PXCM * RC, h / PXCM * RC, x0, y0, w, h);
    // the strip torn off 06's result slip (07 pinned it over the card's top edge; its pin hole stays), stapled at its left end
    // over the 短所 field's right, sticking out past the card's right edge; torn top and bottom; 本日の宿題は in 16-dot print
    const SL = { x0: cx(13.0), w: L(6.0), h: L(2.65), bot: cy(17.05), rot: 0.012 };
    const kS = L(0.9) / 16;                                           // one 16-dot cell on screen (a character 0.9 cm)
    const STRIP = (() => {
      const s = 2, [c, x] = mk(SL.w * s, SL.h * s), r = rng(1799); x.scale(s, s);
      x.fillStyle = PAPER_SLIP; x.beginPath(); x.moveTo(0, 6);
      for (let i = 0; i <= 30; i++) x.lineTo(SL.w * i / 30, 2 + r() * 9);
      for (let i = 30; i >= 0; i--) x.lineTo(SL.w * i / 30, SL.h - 2 - r() * 8);
      x.closePath(); x.fill();
      for (let i = 0; i < 160; i++) { x.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); x.fillRect(r() * SL.w, 8 + r() * (SL.h - 16), 2 + r() * 6, 0.6); }
      x.fillStyle = rgba(INK_RGB, 0.65); x.beginPath(); x.arc(SL.w - L(0.55), L(0.42), 3.6, 0, 7); x.fill();      // 07's pin hole
      return c;
    })();
    const TXT = { x: L(0.42), y: SL.h * 0.66, zy: SL.h * 0.25 };       // 本日の宿題は (left edge, middle) and 昨日 (middle), strip px
    const D_ORIG = dots16('本日の宿題は', kS, 1801, INK_RGB);
    const D_RE = L30.slice(2).map(([ch], i) => dots16(ch, kS, 1830 + i, INK_RGB));
    const D_ZUO = dots16('昨日', kS * 0.85, 1840, INK_RGB);
    const charX = i => TXT.x + D_ORIG.w * (i + 0.5) / 6;                                // the six characters' centres (monospaced)
    // the strike-through over 本日: two parallel rules of solid pencil black (the machine's correction is pencil black, never
    // dots), slanted ~9 degrees so they cross every stroke of 本 and 日 at an angle and can't be read as a stroke of either
    // (a level line through 日 makes it 目); they start well left of 本 and stop just past 日, short of の. Strip px.
    const CELL = D_ORIG.w / 6, SLANT = Math.tan(9 * Math.PI / 180);
    const STRIKE = { xL: TXT.x - CELL * 0.3, xR: TXT.x + CELL * 1.94, xM: TXT.x + CELL, gap: L(0.23), lw: L(0.09) };
    const strikeY = (x, side) => TXT.y + side * STRIKE.gap / 2 - (x - STRIKE.xM) * SLANT;    // from the strip's top edge
    // her ギ in 将来の夢: big, at the field's left, the stamp on its right; four strokes and two dakuten ticks (card cm)
    const GI = { cx: 3.45, cy: 21.3, s: 3.2 };
    const GP = ([u, v]) => [cx(GI.cx + u * GI.s), cy(GI.cy + v * GI.s)];
    const STROKES = [
      { a: [-0.38, -0.25], b: [0.30, -0.31], t0: K(328), dur: 0.42, w: 0.2 }, { a: [-0.44, 0.05], b: [0.40, -0.01], t0: K(329), dur: 0.45, w: 0.2 },
      { a: [-0.06, -0.52], b: [0.10, 0.46], t0: K(330), dur: 0.5, w: 0.2 }, { a: [0.40, -0.52], b: [0.47, -0.37], t0: K(331), dur: 0.16, w: 0.17 },
      { a: [0.53, -0.55], b: [0.60, -0.40], t0: K(331.22), dur: 0.16, w: 0.17 }];
    STROKES.slice(0, 4).forEach((s, i) => S.ev(`ギ stroke ${i + 1}`, s.t0));          // the second dakuten tick follows the first inside k331 (a small action)
    // the stamp: a black block standing in the 将来の夢 field right of her ギ, 未提出 in white dots down it. Its rectangle is the
    // black 使用中 window of 10's last frame (door 22's face: x 1333-1540, y 370-940), so the cut lands black on black: the same
    // x, width and bottom; its top 30 px lower (card cm 17.54), clear of 特になし's label above it. It overruns the gap
    // between 短所 and 将来の夢 and covers both field borders there, as a slammed-on stamp does
    const ST = { x: 1333, y: 400, w: 208, h: 540 };
    // The slam (lands 22% large, back to 1 in three frames). It used to grow about the block's centre, so on the hit frame
    // (3643) its top rose 59 px and its left 23 px, over the lower right corner and the ruled border of 07's 特になし label
    // (2026-11-21 同类自查 after 03's slam MUST; the layout audit had only the block at rest). It now grows about a point on
    // its left edge a tenth of the way down: away from the label above-left (the top rises at most 12 px, still clear of the
    // label's border) and short enough downward that the hit frame, with the card's sink and the camera's punch, keeps the
    // block inside the frame. Every slam frame is measured and audited below (STAMP SLAM AUDIT).
    const ST_ANCHOR = [ST.x, ST.y + 0.1 * ST.h];
    const stampScale = tt => { const age = tt - T327; return age < 0 ? 1 : 1 + 0.22 * Math.pow(1 - Math.min(1, age / (3 * FR)), 2); };
    const STD = [...'未提出'].map((ch, i) => dots16(ch, (ST.w * 0.62) / 16, 1850 + i, PAPER_RGB));
    // 句31 writes itself along the field's top row, right of the 将来の夢 label, clear of the stamp and of her rubbing hand
    const R31 = { x: cx(5.35), y: cy(18.86), size: Math.round(L(0.68)) };
    LAY.text('句31 in 将来の夢', 's1', [R31.x, R31.y - R31.size * 0.6, R31.size * 1.04 * L31.length, R31.size * 1.2]);
    LAY.reg('ギ', 's1', [cx(GI.cx - 0.5 * GI.s), cy(GI.cy - 0.58 * GI.s), L(1.12 * GI.s), L(1.08 * GI.s)]);
    LAY.reg('未提出 block', 's1', [ST.x, ST.y, ST.w, ST.h]);
    LAY.reg('将来の夢 label', 's1', [cx(1.0), cy(18.16), L(4.05), L(0.95)]);
    // the strip's words, in the same sheet as the card's (they are checked against everything else in the shot and against the
    // frame in every frame of it): 昨日 above, and 本日の宿題は with its strike (the strike's ends included); 2 px for the strip's
    // slight tilt
    { const sy = SL.bot - SL.h;
      LAY.text('昨日 (the correction) on the strip', 's1', [SL.x0 + charX(0.5) - D_ZUO.w / 2 - 2, sy + TXT.zy - D_ZUO.h / 2 - 2, D_ZUO.w + 4, D_ZUO.h + 4]);
      const y0 = Math.min(TXT.y - D_ORIG.h / 2, strikeY(STRIKE.xR, -1) - STRIKE.lw), y1 = Math.max(TXT.y + D_ORIG.h / 2, strikeY(STRIKE.xL, 1) + STRIKE.lw);
      LAY.text('本日の宿題は and its strike on the strip', 's1', [SL.x0 + STRIKE.xL - STRIKE.lw - 2, sy + y0 - 4, TXT.x + D_ORIG.w - STRIKE.xL + STRIKE.lw + 4, y1 - y0 + 8]); }
    // 07's 特になし in 短所 (the label's print, as TEX lays it out): a word on screen, so it is checked like one
    { const D = dots16('特になし', 2.3 * RC / 16, 1796, INK_RGB), wcm = D.w / RC, hcm = D.h / RC, x0 = 2.6 + 0.45 * 2.3;
      LAY.text('特になし (07, 短所)', 's1', [cx(x0), cy(15.55 - hcm / 2), L(wcm), L(hcm)]); }
    LAY.text('短所 (the field tab)', 's1', [cx(CF.tansho[0]), cy(CF.tansho[1]), L(CF.tansho[4]), L(0.95)]);
    LAY.audit('S1 her card');
    // the hand: h11_write writes the strokes; h11_rub's thumb rubs; one size for the shot (her hand's breadth ~7.3 cm on the card)
    // Each hand drawing is placed by a point measured on itself (parts.js): h11_write by its drawn pencil point (the strokes
    // start there), h11_rub by its thumb; the in-between h11_turn has no pencil point on the paper, so it is placed by its own
    // cuff onto the cuff of h11_write (the three drawings share the wrist): its origin is h11_write's point moved by the
    // difference of the two measured cuffs, never h11_write's anchor reused.
    const IMW = await img('/art/cut/h11_write.png'), IMR = await img('/art/cut/h11_rub.png'), IMT = await img('/art/cut/h11_turn.png');
    const TIPW = partOf(PA, 'h11_write', 'tip').point, PADR = partOf(PA, 'h11_rub', 'pad').point;
    const CUFFW = partOf(PA, 'h11_write', 'cuff').point, CUFFR = partOf(PA, 'h11_rub', 'cuff').point, CUFFT = partOf(PA, 'h11_turn', 'cuff').point;
    const ORIGT = [TIPW[0] + CUFFT[0] - CUFFW[0], TIPW[1] + CUFFT[1] - CUFFW[1]];
    const HW = await createHand({ name: 'h11_write', image: rinPalImage(IMW), W, H: 1080, tip: TIPW, shadow: HAND_SHADOW });
    const HR = await createHand({ name: 'h11_rub', image: rinPalImage(IMR), W, H: 1080, tip: PADR, shadow: HAND_SHADOW });
    const HT = await createHand({ name: 'h11_turn', image: rinPalImage(IMT), W, H: 1080, tip: ORIGT, shadow: HAND_SHADOW });
    { const cuffWhite = ([r, g, b, a]) => a > 200 && Math.min(r, g, b) > 215 && Math.max(r, g, b) - Math.min(r, g, b) < 30;
      partAudit('seg_11', 'h11_write', 'tip (the drawn pencil point)', { image: IMW, points: [TIPW], on: PIX.dark, r: 2, maxOffPct: 0 });
      partAudit('seg_11', 'h11_rub', 'pad (the thumb)', { image: IMR, points: [PADR], on: PIX.skin, r: 3, maxOffPct: 0 });
      for (const [n, im, c] of [['h11_write', IMW, CUFFW], ['h11_turn', IMT, CUFFT], ['h11_rub', IMR, CUFFR]])
        partAudit('seg_11', n, 'cuff (the shared wrist)', { image: im, points: [c], on: cuffWhite, r: 2, maxOffPct: 0 }); }
    const HS = P('hs', 1.45);
    // the rub: the thumb pad on the ギ, two passes a beat side to side (a little up and down too, so the pad covers the whole
    // letter), k332-k334; k334 it lifts
    const RUBC = GP([0.04, 0.08]), RUB_A = L(0.55), RUB_AY = L(0.26);
    const thumbAt = tt => { const ph = (tt - T332) / BEAT * 2 * Math.PI; return [RUBC[0] + Math.sin(ph) * RUB_A, RUBC[1] + Math.sin(ph * 2) * RUB_AY]; };
    function writeTip(tt) {
      const st = STROKES;
      for (let i = 0; i < st.length; i++) {
        const s = st[i], t1 = s.t0 + s.dur * BEAT;
        if (tt >= s.t0 && tt < t1) { const u = (tt - s.t0) / (t1 - s.t0); return { p: GP([lerp(s.a[0], s.b[0], u), lerp(s.a[1], s.b[1], u)]), lift: 0 }; }
        const n = st[i + 1];
        if (tt >= t1 && n && tt < n.t0) { const u = smooth((tt - t1) / (n.t0 - t1)), P0 = GP(s.b), P1 = GP(n.a); return { p: [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u)], lift: 0.35 * Math.sin(Math.PI * u) }; }
      }
      if (tt < st[0].t0) { const P1 = GP(st[0].a); return { p: [P1[0] + 6, P1[1] - 4], lift: 0.55 }; }      // hovering before the first stroke
      // after the last tick the pencil lifts a little; from k331.5 (the in-between) the hand moves to where its wrist and sleeve
      // will be in h11_rub (the three drawings share the wrist), so the swap on k332 changes only the fingers
      const last = st[st.length - 1], t1 = last.t0 + last.dur * BEAT, P0 = GP(last.b), T3315 = K(331.5);
      if (tt < T3315) return { p: P0, lift: 0.25 * smooth((tt - t1) / (T3315 - t1)) };
      const u = smooth((tt - T3315) / (T332 - T3315));
      // where h11_write's pencil point must be so that its cuff lands on h11_rub's cuff (h11_rub's thumb on RUBC)
      const P1 = [RUBC[0] + (CUFFR[0] - PADR[0] - CUFFW[0] + TIPW[0]) * HS, RUBC[1] + (CUFFR[1] - PADR[1] - CUFFW[1] + TIPW[1]) * HS];
      return { p: [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u)], lift: 0.25 * (1 - u) };
    }
    function rubPos(tt) {
      if (tt < T334) return { p: thumbAt(tt), lift: 0 };
      // k334 the thumb lifts and the hand draws back toward her (down the card), so the smear it left shows whole for the
      // shot's last beat (the pencil stays left of the stamp)
      const u = smooth((tt - T334) / (BEAT * 0.5)); return { p: [RUBC[0] - L(0.15) * u, RUBC[1] + L(1.9) * u - 10 * Math.sin(Math.PI * Math.min(1, u * 1.4))], lift: 0.5 * Math.min(1, u * 2) };
    }
    S.ev('the thumb lifts', T334);
    // ---- the rub. The thumb drags the pencil's graphite along its path: every pass leaves a new state of the letter, solid
    // graphite (Demo 1's pencil black, the same tile as the blacks of 04 and 09) pulled into streaks, frayed where the streaks
    // end, the pad's path burnished lighter and shiny in the middle. Each pass lays its state over the last one only where the
    // pad has been so far (the paper under it first, so nothing is see-through). Five passes: centre -> right, right -> left,
    // left -> right, right -> left, left -> centre (k332-k334).
    const PASS_T = [0, 0.25, 0.75, 1.25, 1.75, 2].map(b => T332 + b * BEAT);
    const PAD = L(0.85);                                               // half the thumb pad's width
    const SMB = (() => { const x0 = cx(GI.cx - 0.6 * GI.s) - L(1.5), y0 = cy(GI.cy - 0.62 * GI.s) - L(0.5); return [x0, y0, cx(GI.cx + 0.66 * GI.s) + L(1.5) - x0, cy(GI.cy + 0.56 * GI.s) + L(0.5) - y0]; })();
    const SMR = 2;                                                     // smear px per screen px (sharp at the push)
    function smearState(s) {
      const [bx, by, bw, bh] = SMB, [c, x] = mk(bw * SMR, bh * SMR), r = rng(1188 + 31 * s);
      x.scale(SMR, SMR); x.translate(-bx, -by); x.lineCap = 'round'; x.lineJoin = 'round';
      x.beginPath(); x.rect(cx(1.08), cy(19.3), L(16.0), L(5.2)); x.clip();          // graphite stays inside the field, under 句31s row
      const TP = patOf(x, TILE);
      const keep = [0.86, 0.55, 0.3, 0.12, 0.04][s];                 // how much of each pencil line is still a clean line
      const ax = L(0.16 + 0.13 * s), ay = L(0.1 + 0.075 * s);        // how far the graphite has been pushed (sideways, up/down)
      const cov = [0.35, 0.62, 0.8, 0.9, 0.95][s];                   // how densely the pushed graphite covers the paper
      const segs = STROKES.map(st => { const A = GP(st.a), B = GP(st.b); return { A, B, w: L(st.w) }; });
      // the distance to the letter, stretched along the thumb's path: 0 on a pencil line, 1 at the smudge's frayed edge
      const dist = (px, py) => { let best = 9;
        for (const { A, B, w } of segs) { const vx = B[0] - A[0], vy = B[1] - A[1], u = Math.max(0, Math.min(1, ((px - A[0]) * vx + (py - A[1]) * vy) / (vx * vx + vy * vy)));
          const dx = (px - (A[0] + vx * u)) / (ax + w / 2), dy = (py - (A[1] + vy * u)) / (ay + w / 2); best = Math.min(best, Math.hypot(dx, dy)); }
        return best; };
      // 1. the body: short solid streaks packed along the thumb's path (dark where the lines were, lighter outward); where they
      //    thin out at the edge, their ends fray
      const step = 3.2;
      for (let py = by; py < by + bh; py += step) for (let px0 = bx; px0 < bx + bw; px0 += step * 1.6) {
        const px = px0 + (r() - 0.5) * step * 1.6, qy = py + (r() - 0.5) * step, d = dist(px, qy);
        if (d >= 1 || r() > cov * (1 - d * d * 0.85)) continue;
        const l = L(0.06 + r() * (0.12 + 0.05 * s)) * (1.15 - d * 0.5), dir = r() < 0.5 ? -1 : 1, dy = (r() - 0.5) * 1.6;
        const tone = d + (r() - 0.5) * 0.5;
        x.strokeStyle = tone < 0.3 ? TP : tone < 0.62 ? rgba(GRAPHITE_LIGHT_RGB, 0.92) : rgba(REHATCH_LIGHT_RGB, 0.88);
        x.lineWidth = 1.4 + r() * 2.2 * (1 - d * 0.5);
        x.beginPath(); x.moveTo(px - dir * l * 0.3, qy); x.lineTo(px + dir * l * 0.7, qy + dy); x.stroke();
        if (d > 0.72 && r() < 0.28) { const ex = px + dir * l * 0.7, a = (dir > 0 ? 0 : Math.PI) + (r() - 0.5) * 1.2, bl = 2 + r() * 5;
          x.strokeStyle = rgba(INK_RGB, 0.6); x.lineWidth = 0.7; x.beginPath(); x.moveTo(ex, qy + dy); x.lineTo(ex + Math.cos(a) * bl, qy + dy + Math.sin(a) * bl); x.stroke(); }
      }
      // 2. what is left of the pencil lines: pieces of them, fewer and thinner each pass
      for (const { A, B, w } of segs) {
        const n = Math.max(2, Math.round(Math.hypot(B[0] - A[0], B[1] - A[1]) / 3));
        for (let i = 0; i < n; i++) { if (r() > keep) continue; const u0 = i / n, u1 = (i + 1) / n;
          x.strokeStyle = PENCIL; x.lineWidth = w * (0.5 + 0.5 * keep) * (0.8 + r() * 0.3);
          x.beginPath(); x.moveTo(lerp(A[0], B[0], u0), lerp(A[1], B[1], u0)); x.lineTo(lerp(A[0], B[0], u1), lerp(A[1], B[1], u1)); x.stroke(); }
      }
      // 3. the pad's path, burnished: from the third pass a lighter, shiny band of flattened graphite through the middle
      if (s >= 2) {
        const [tx0, ty0] = RUBC;
        for (let i = 0; i < 120 + 60 * s; i++) {
          const xx = tx0 + (r() - 0.5) * L(1.5 + 0.3 * s), yy = ty0 + (r() - 0.5) * L(0.7 + 0.25 * s);
          if (dist(xx, yy) > 0.8) continue;
          const l = L(0.12 + r() * 0.35); x.strokeStyle = r() < 0.8 ? rgba(REHATCH_LIGHT_RGB, 0.92) : rgba(PAPER_RGB, 0.5); x.lineWidth = 1.2 + r() * 2;
          x.beginPath(); x.moveTo(xx - l / 2, yy); x.lineTo(xx + l / 2, yy + (r() - 0.5) * 1.5); x.stroke();
        }
      }
      return c;
    }
    const SMEAR = [0, 1, 2, 3, 4].map(smearState);
    const drawSmear = (ctx, k) => ctx.drawImage(SMEAR[k], SMB[0], SMB[1], SMB[2], SMB[3]);
    function drawGi(ctx, tt) {
      let pass = -1; if (tt >= T332) { pass = 4; for (let i = 0; i < 5; i++) if (tt < PASS_T[i + 1]) { pass = i; break; } }
      if (pass < 1) {                                                  // the clean letter as written
        ctx.save(); ctx.lineCap = 'round';
        for (const s of STROKES) {
          if (tt < s.t0) continue; const u = Math.min(1, (tt - s.t0) / (s.dur * BEAT)), A = GP(s.a), B0 = GP(s.b), B = [lerp(A[0], B0[0], u), lerp(A[1], B0[1], u)];
          ctx.strokeStyle = PENCIL; ctx.lineWidth = L(s.w); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
          ctx.strokeStyle = rgba(REHATCH_LIGHT_RGB, 0.4); ctx.lineWidth = L(s.w * 0.35); ctx.beginPath(); ctx.moveTo(A[0], A[1] - L(s.w * 0.2)); ctx.lineTo(B[0], B[1] - L(s.w * 0.2)); ctx.stroke();
        }
        ctx.restore();
      } else { paperUnder(ctx, SMB); drawSmear(ctx, pass - 1); }      // the state the last pass left
      if (pass < 0) return;
      if (tt >= T334) { paperUnder(ctx, SMB); drawSmear(ctx, 4); return; }
      // the pass in progress: its state only where the pad has swept so far
      const xa = thumbAt(PASS_T[pass])[0], xb = thumbAt(tt)[0], x0 = Math.min(xa, xb) - PAD, x1 = Math.max(xa, xb) + PAD;
      ctx.save(); ctx.beginPath(); ctx.rect(x0, SMB[1], x1 - x0, SMB[3]); ctx.clip(); paperUnder(ctx, SMB); drawSmear(ctx, pass); ctx.restore();
    }
    S.ev('未提出 stamped (the one 一沉: the card sinks, the camera stops)', T327);
    function stamp(ctx, tt) {
      const sc = stampScale(tt);
      ctx.save(); ctx.translate(ST_ANCHOR[0], ST_ANCHOR[1]); ctx.scale(sc, sc); ctx.translate(ST.x + ST.w / 2 - ST_ANCHOR[0], ST.y + ST.h / 2 - ST_ANCHOR[1]);
      ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-ST.w / 2 + 6, -ST.h / 2 + 8, ST.w, ST.h);
      // the block is graphite-black ink laid by the machine (the same black as 10's pencil-black window)
      ctx.fillStyle = GRAPHITE_FIELD; const r = rng(1859); ctx.beginPath(); ctx.moveTo(-ST.w / 2, -ST.h / 2);
      for (let i = 1; i <= 12; i++) ctx.lineTo(-ST.w / 2 + ST.w * i / 12, -ST.h / 2 + (r() - 0.5) * 2);
      for (let i = 1; i <= 24; i++) ctx.lineTo(ST.w / 2 + (r() - 0.5) * 2, -ST.h / 2 + ST.h * i / 24);
      for (let i = 11; i >= 0; i--) ctx.lineTo(-ST.w / 2 + ST.w * i / 12, ST.h / 2 + (r() - 0.5) * 2);
      for (let i = 23; i > 0; i--) ctx.lineTo(-ST.w / 2 + (r() - 0.5) * 2, -ST.h / 2 + ST.h * i / 24);
      ctx.closePath(); ctx.fill();
      ctx.save(); ctx.clip(); ctx.globalAlpha = 0.5; ctx.fillStyle = patOf(ctx, TILE); ctx.fillRect(-ST.w / 2, -ST.h / 2, ST.w, ST.h); ctx.restore();
      const step = ST.h / 3.15; STD.forEach((D, i) => ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, -D.w / 2, -ST.h / 2 + step * (i + 0.58) - D.h / 2, D.w, D.h));
      ctx.restore();
    }
    // the 下敷き: teal clear plastic, a faint 九九 table printed on it; only a band of it shows at each side of the card
    const SHITA = (() => {
      const [c, x] = mk(W, 1080); x.fillStyle = PAPER; x.fillRect(0, 0, W, 1080); x.fillStyle = rgba(TEAL_RGB, 0.30); x.fillRect(0, 0, W, 1080);
      const cell = 1.9 * PXCM, ox = 960 - cell * 4.5 - cell * 4, oy = -cell * 0.37;
      x.strokeStyle = rgba(TEAL_RGB, 0.2); x.lineWidth = 2;
      for (let i = 0; i <= 17; i++) { x.beginPath(); x.moveTo(ox + i * cell, 0); x.lineTo(ox + i * cell, 1080); x.stroke(); }
      for (let j = 0; j <= 12; j++) { x.beginPath(); x.moveTo(0, oy + j * cell); x.lineTo(W, oy + j * cell); x.stroke(); }
      x.fillStyle = rgba(TEAL_RGB, 0.34); x.font = `600 ${Math.round(cell * 0.17)}px ZenKaku`; x.textAlign = 'center'; x.textBaseline = 'middle';
      for (let i = 0; i < 17; i++) for (let j = 0; j < 12; j++) { const a = (i % 9) + 1, b = ((j + 5) % 9) + 1; x.fillText(`${a}×${b}=${a * b}`, ox + (i + 0.5) * cell, oy + (j + 0.5) * cell); }
      x.fillStyle = rgba(PAPER_RGB, 0.18); x.fillRect(0, 0, W, 1080);              // the plastic's sheen over the print
      return c;
    })();
    // k332-k334 the push toward the right column, 昨日の宿題は over 未提出, while 句31 writes itself and the thumb rubs the ギ.
    // Its end frame is set by what has to stay whole, not by a focus point: the frame's top edge stays at the world's top (the
    // top row never leaves), x 173-1887 keeps the smear (graphite from x 238), the 短所 / 将来の夢 tabs (from x 231) and
    // the strip (to x 1851); y 0-964 keeps the stamp (to y 940). The hand leaves by the bottom edge, as the frame cuts it.
    // The k327 punch grows the picture from the top edge too.
    // (2026-11-21 third round, 「一直抖动屏幕……看着很晕」, docs/制作约定.md 第六节「整屏运动」) the k327 大击: the band slams
    // back in, the frame steps in 3% in three frames from the cut and stays (one way, no coming back; the top edge holds, so
    // the frame's lower corners move 2.3% of the width). The card no longer sinks and springs back (a whole-frame dip): the
    // stamp's own slam is the hit inside the picture.
    // (the push is 0.09 on top of the step: it ends at 1.12 as before, the stamp's bottom at y 940 still in the frame)
    const pushS1 = pushes(S, [[T332, T334, 0.09, 'S1 push toward 昨日の宿題は / 未提出']]);
    const FOC1X = 1030, BIG1 = 0.03, TBIG1 = (F0 + 1) / 30 - 1e-4;   // from the frame after the cut (on the cut frame the camera is still at 1)
    const camS1 = tt => { const z0 = pushS1(0, tt), u = (z0 - 1) / 0.09, z = z0 + stepOne(tt, TBIG1, BIG1, 3, 0); return [z, lerp(960, FOC1X, u), 540 / z]; };
    const sinkS1 = () => 1;
    const PIV = [ST.x + ST.w / 2, ST.y + ST.h / 2];
    // STAMP SLAM AUDIT (根因清单: 放大、过冲类效果按放大后的实际墨迹框逐帧登记检查): every frame from the hit to past the
    // settle is drawn as the page draws it (stamp() alone, world px), its ink measured, and the measured box registered on
    // that frame's own sheet with its neighbours: 07's 特になし label (its slip and ruled border, and the print), the strip
    // (its paper and both its words), 句31, the ギ, the 将来の夢 label. The frame check maps each box through that frame's
    // sink and camera, so the block must stay whole in the frame on the hit too.
    const stampSlamAudit = (() => {
      const times = frameTimes(SEG[0], T327, T327 + 5 * FR), [c, x] = mk(W, 1080), rows = [];
      const DT = dots16('特になし', 2.3 * RC / 16, 1796, INK_RGB), bwc = (DT.w + 2.3 * RC * 0.9) / RC, bhc = (DT.h + 2.3 * RC * 0.56) / RC;
      const SLIP = [cx(2.6), cy(15.55 - bhc / 2), L(bwc), L(bhc)];
      const sy = SL.bot - SL.h;
      const nb = {
        '特になし label (07: slip and ruled border)': ['text', SLIP],
        'strip (paper)': ['region', [SL.x0, sy, SL.w, SL.h]],
        '句31 in 将来の夢': ['text', [R31.x, R31.y - R31.size * 0.6, R31.size * 1.04 * L31.length, R31.size * 1.2]],
        'ギ': ['region', [cx(GI.cx - 0.5 * GI.s), cy(GI.cy - 0.58 * GI.s), L(1.12 * GI.s), L(1.08 * GI.s)]],
        '将来の夢 label': ['region', [cx(1.0), cy(18.16), L(4.05), L(0.95)]] };
      for (const t of times) {
        const fno = Math.round(t * 30), sheet = `s1slam@${fno}`;
        x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, 1080); stamp(x, t);
        const d = x.getImageData(0, 0, W, 1080).data; let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
        for (let yy = 250; yy < 1080; yy++) for (let xx = 1150; xx < 1750; xx++) { const o = (yy * W + xx) * 4; if (d[o + 3] > 200) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
        const box = [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
        LAY.text(`未提出 block f${fno}`, sheet, box);                         // (the frame check's sheet)
        // one sheet per neighbour (the neighbours overlap one another by design: the strip is stapled over the label's corner)
        Object.entries(nb).forEach(([n, [kind, b]], i) => { LAY.text(`未提出 block f${fno}`, `${sheet}:${i}`, box); (kind === 'text' ? LAY.text : LAY.reg)(`${n} f${fno}`, `${sheet}:${i}`, b); });
        const k = sinkS1(t), [z, fx, fy] = camS1(t);
        LAY.frameCheck(`S1 未提出 slam frame ${fno}`, { sheets: { [sheet]: p => [PIV[0] + (p[0] - PIV[0]) * k, PIV[1] + (p[1] - PIV[1]) * k] }, views: [{ t, ...CAM.view(z, fx, fy, 0) }] });
        const sb = [PIV[1] + (y1 - PIV[1]) * k], scrBottom = 540 + (sb[0] - CAM.view(z, fx, fy, 0).fy) * CAM.view(z, fx, fy, 0).z;
        rows.push({ f: fno, scale: +stampScale(t).toFixed(3), ink: [x0, x1, y0, y1], scrBottom: +scrBottom.toFixed(1), gapToLabel: Math.round(y0 - (SLIP[1] + SLIP[3])) });
      }
      const ov = LAY.audit('S1 未提出 slam frames (each frame its own sheet)');
      console.warn(`STAMP SLAM AUDIT: ${rows.length} frames (${rows[0].f}-${rows[rows.length - 1].f}), ${ov.length} box overlaps [${rows.map(r => `f${r.f} x${r.scale} ink x ${r.ink[0]}-${r.ink[1]} y ${r.ink[2]}-${r.ink[3]} (below 特になし label by ${r.gapToLabel}px, bottom on screen ${r.scrBottom})`).join('; ')}]`);
      return { frames: rows, problems: ov.length };
    })();
    function draw(tt) {
      CAM.shoot(camS1(tt), 0, tt, ctx => {
        ctx.drawImage(SHITA, 0, 0);
        const k = sinkS1(tt);
        ctx.save(); ctx.translate(PIV[0], PIV[1]); ctx.scale(k, k); ctx.translate(-PIV[0], -PIV[1]);
        const sh = 7 + 6 * (k - 1) / 0.04;                              // the card's shadow tucks in as it is pressed down
        ctx.fillStyle = CARD_SHADOW; ctx.fillRect(CX0 + sh, CY0 + sh * 1.3, CW, CARDH);
        ctx.drawImage(TEX, CX0, CY0, CW, CARDH);
        stamp(ctx, tt);
        drawGi(ctx, tt);
        L31.forEach(([c, t], i) => PEN.char(ctx, c, R31.x + R31.size * 1.04 * (i + 0.5), R31.y, R31.size, tt - t));
        // the strip and its staple; the correction printed as sung
        ctx.save(); ctx.translate(SL.x0, SL.bot); ctx.rotate(-SL.rot);
        ctx.fillStyle = CARD_SHADOW; ctx.fillRect(5, -SL.h + 7, SL.w, SL.h - 4);
        ctx.drawImage(STRIP, 0, -SL.h, SL.w, SL.h);
        const ty = -SL.h + TXT.y;
        // 本日の宿題は (06's print); on 昨 the first rule of the strike is drawn through 本日 (left to right, three frames), on
        // 日 the second, and 昨日 is printed above as sung
        ctx.drawImage(D_ORIG.c, D_ORIG.x0, D_ORIG.y0, D_ORIG.w, D_ORIG.h, TXT.x, ty - D_ORIG.h / 2, D_ORIG.w, D_ORIG.h);
        const t昨 = L30[0][1], t日 = L30[1][1];
        if (sungShown(tt, t昨)) {
          const f = sungBuild(tt - t昨);
          // each rule of the strike is drawn through 本日 in two frames, done on its syllable's onset frame
          ctx.save(); ctx.strokeStyle = GRAPHITE; ctx.lineWidth = STRIKE.lw; ctx.lineCap = 'round';
          [[t昨, -1], [t日, 1]].forEach(([t0, side]) => { const u = sungSweep(tt, t0, 2 * FR); if (u <= 0) return; const xe = lerp(STRIKE.xL, STRIKE.xR, u);
            ctx.beginPath(); ctx.moveTo(STRIKE.xL, -SL.h + strikeY(STRIKE.xL, side)); ctx.lineTo(xe, -SL.h + strikeY(xe, side)); ctx.stroke(); });
          ctx.restore();
          const zx = charX(0.5) - D_ZUO.w / 2;
          ctx.save(); ctx.beginPath(); ctx.rect(zx - 4, -SL.h, (D_ZUO.w / 2 + 4) * (1 + sungBuild(tt - t日)), SL.h); ctx.clip();
          ctx.globalAlpha = f; ctx.drawImage(D_ZUO.c, D_ZUO.x0, D_ZUO.y0, D_ZUO.w, D_ZUO.h, zx, -SL.h + TXT.zy - D_ZUO.h / 2, D_ZUO.w, D_ZUO.h); ctx.restore();
        }
        // の宿題は printed once more over themselves, a cell's fraction down and right: one shade darker
        L30.slice(2).forEach(([, t], i) => { if (!sungShown(tt, t)) return; const D = D_RE[i]; ctx.globalAlpha = 0.85 * sungBuild(tt - t);
          ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, charX(i + 2) - D.w / 2 + kS * 0.3, ty - D.h / 2 + kS * 0.3, D.w, D.h); ctx.globalAlpha = 1; });
        // the staple through the strip's left end into the card, upright
        const stx = L(0.22), sty = -SL.h * 0.58, sl = L(0.42);          // high enough to stay clear of the strike's low left end
        ctx.fillStyle = HAND_SHADOW; ctx.fillRect(stx + 2, sty - sl + 3, 4, sl * 2);
        ctx.strokeStyle = rgba(REHATCH_LIGHT_RGB, 0.95); ctx.lineWidth = 4.2; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(stx, sty - sl); ctx.lineTo(stx, sty + sl); ctx.stroke();
        ctx.strokeStyle = rgba(PAPER_RGB, 0.85); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(stx - 1.2, sty - sl + 1); ctx.lineTo(stx - 1.2, sty + sl - 1); ctx.stroke();
        ctx.restore();
        ctx.restore();
        // the hand
        const h = S.at('hand', tt);
        if (h && h.name === 'H11-rub') { const r = rubPos(tt); HR.draw(ctx, r.p[0], r.p[1], r.lift, HS); }
        else if (h && h.name.startsWith('H11-turn')) { const w = writeTip(tt); HT.draw(ctx, w.p[0], w.p[1], w.lift, HS); }
        else { const w = writeTip(tt); HW.draw(ctx, w.p[0], w.p[1], w.lift, HS); }
      });
    }
    const views = frameTimes(SEG[0], T327, T335).map(t => { const [z, fx, fy] = camS1(t); return { t, ...CAM.view(z, fx, fy, 0) }; });
    // every word of the shot (特になし, the strip's 昨日 and 本日の宿題は with its strike, 句31) and the ギ, the stamp, the
    // 将来の夢 label: whole in every frame of the shot, through the k327 punch and the push, to the cut
    LAY.frameCheck('S1 her card, every frame', { sheets: { s1: p => p }, views, inset: 6 });
    return { draw, cam: camS1 };
  })();

  // =====================================================================================================================
  // S2 (k335-k343): the photo not handed in. The dashed 3:4 photo frame on paper, her inside it; 句32 left, 句33 right
  // =====================================================================================================================
  const S2 = await (async () => {
    const FR2 = { x: 585, y: 40, w: 750, h: 1000 };
    const IDA = await figure('r11_id_a', true), IDB = await figure('r11_id_b', true);
    // the drawing: her bow's top 3% under the frame's top edge, her card's bottom edge a little above the frame's bottom edge
    const BOWTOP = P('bowtop', (await (await fetch('/art/cut/seg11_anchors.json')).json()).r11_id_a_bowtop ?? 55);   // measured on r11_id_a
    const sI = P('s2s', 0.92), XI = 960 - IDA.w * sI / 2, YI = FR2.y + 30 - BOWTOP * sI;
    const HER_ID = makeCard('R', 1.0, { kieWord: KIE, frags: true });
    const GROUND = paperGround(2202, 0.045);
    // 句32 (16-dot, two columns left of the frame) and 句33 (her pencil, two columns right of it), mirrored, top-aligned
    const CS = 80, COLY = 286;
    const C32 = [[L32.slice(0, 5), 455], [L32.slice(5), 365]], C33 = [[L33.slice(0, 3), 1555], [L33.slice(3), 1465]];
    const P32 = C32.map(([chars, x]) => vertical(chars, x, COLY, CS, 1.04)), P33 = C33.map(([chars, x]) => vertical(chars, x, COLY, CS, 1.04));
    const D32 = P32.map((col, j) => col.map((p, i) => dots16(p.c, CS / 16 * 0.92, 1900 + j * 10 + i, INK_RGB)));
    [...P32, ...P33].forEach((col, j) => LAY.text(`S2 column ${j}`, 's2', [col[0].x - CS * 0.5, COLY, CS * 1.0, CS * 1.04 * col.length]));
    // k340.5 (the line's strongest hit, the 半拍 exception) the machine's verdict on the photo: a 読取不可 label, the same kind
    // of paper label as 07's 特になし (paper slip, ruled border, 16-dot print), lands over the frame's lower left corner, on the
    // machine's side under 句32. A light print: it lands in two frames, nothing shakes. (The review of 2026-11-21: four teal
    // corners closing on her face read at once as a phone camera's face-detection box; nothing frames her face now.)
    const VERD = { k: 3.3, cx: 590, cy: 995 };
    const D_VERD = dots16('読取不可', VERD.k, 1920, INK_RGB);
    VERD.w = D_VERD.w + 16 * VERD.k * 0.9; VERD.h = D_VERD.h + 16 * VERD.k * 0.62;
    LAY.text('読取不可 label', 's2', [VERD.cx - VERD.w / 2, VERD.cy - VERD.h / 2, VERD.w, VERD.h]);
    LAY.audit('S2 photo and columns');
    LAY.reg('photo frame', 's2frame', [FR2.x, FR2.y, FR2.w, FR2.h]);
    { const D = dots16('写真', 2.2, 1910, TEAL_RGB); LAY.text('写真 label', 's2label', [FR2.x + 96, FR2.y + 22, D.w, D.h]); }
    // (2026-11-21 rhythm pass) the label is stamped on the snare of k341 (it was a light print on the half beat k340.5 that
    // nothing in the drums answered): it lands 25% large and is pressed down to size in three frames, growing about its
    // bottom edge's middle (so it never grows down out of the frame), with the camera's step on the same beat
    const TVERD = T341;
    S.ev('読取不可 stamped on the photo (the snare of k341)', TVERD);
    function verdict(ctx, tt) {
      const age = tt - TVERD; if (age < -1e-9) return;
      const kf = Math.floor(age / FR + 1e-6), sc = [1.25, 1.1, 1.03][kf] ?? 1;
      ctx.save(); ctx.translate(VERD.cx, VERD.cy + VERD.h / 2); ctx.scale(sc, sc); ctx.translate(0, -VERD.h / 2);
      ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-VERD.w / 2 + 5, -VERD.h / 2 + 6, VERD.w, VERD.h);
      ctx.fillStyle = PAPER_SLIP; ctx.fillRect(-VERD.w / 2, -VERD.h / 2, VERD.w, VERD.h);
      ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 3; ctx.strokeRect(-VERD.w / 2 + 6, -VERD.h / 2 + 6, VERD.w - 12, VERD.h - 12);
      ctx.drawImage(D_VERD.c, D_VERD.x0, D_VERD.y0, D_VERD.w, D_VERD.h, -D_VERD.w / 2, -D_VERD.h / 2, D_VERD.w, D_VERD.h);
      ctx.restore();
    }
    // The camera (2026-11-21 rhythm pass; it stood still for eight beats): a small step on each bar line (k336, k340, the
    // second with her eyes shutting), a kick with the 読取不可 stamp on the snare of k341, and the push down to her card in a
    // step on k342 (it was a slow push over k341-k343). The k341 step keeps the whole photo frame and the label in the
    // picture (top 25 px, bottom 1054 at 1.05); the k342 step takes the frame's top edge and 写真 out at once (top 108).
    // (2026-11-21 third round, 整屏运动) the bar-line steps k336 / k340, the kick on k341 and the step down on k342 are gone:
    // the photo stands still while 句32 / 句33 print and write themselves; the 読取不可 label slamming down on k341 is the hit
    // (inside the picture). From k340, as she shuts her eyes, one slow push down to her card over three beats (eased in and
    // out, 1.00 -> 1.12, the same end framing as before: the frame's top edge and 写真 leave the picture).
    const pushS2 = pushes(S, [[T340, T343, 0.12, 'S2 slow push down to her card']]);
    const FY2 = 590;
    const camS2 = tt => { const z = pushS2(0, tt); return [z, 960, lerp(540, FY2, (z - 1) / 0.12)]; };
    // VERDICT SLAM AUDIT: the label lands 12% large about its centre and settles in two frames; each frame from the hit is
    // drawn alone, its paper measured, and the box audited against 句32 / 句33's columns and her card in the photo, and kept
    // whole in the frame (it lands over the photo frame's corner on purpose, so the dashed frame is not a neighbour here)
    const verdSlamAudit = (() => {
      const times = frameTimes(SEG[0], TVERD, TVERD + 5 * FR), [c, x] = mk(W, 1080), rows = [];
      const [qx0, qy0, qx1, qy1] = IDA.cards[0].rect, CARDBOX = [XI + qx0 * sI, YI + qy0 * sI, (qx1 - qx0) * sI, (qy1 - qy0) * sI];
      const nb = [...[...P32, ...P33].map((col, j) => [`S2 column ${j}`, 'text', [col[0].x - CS * 0.5, COLY, CS * 1.0, CS * 1.04 * col.length]]), ['her card in the photo', 'region', CARDBOX]];
      for (const t of times) {
        const fno = Math.round(t * 30), sheet = `s2slam@${fno}`;
        x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, 1080); verdict(x, t);
        const d = x.getImageData(0, 0, W, 1080).data; let x0 = W, x1 = -1, y0 = 1080, y1 = -1;
        for (let yy = 800; yy < 1080; yy++) for (let xx = 300; xx < 900; xx++) { const o = (yy * W + xx) * 4; if (d[o + 3] > 200) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
        const box = [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
        LAY.text(`読取不可 label f${fno}`, sheet, box);
        nb.forEach(([n, kind, b], i) => { LAY.text(`読取不可 label f${fno}`, `${sheet}:${i}`, box); (kind === 'text' ? LAY.text : LAY.reg)(`${n} f${fno}`, `${sheet}:${i}`, b); });
        const [z, fx, fy] = camS2(t);
        LAY.frameCheck(`S2 読取不可 slam frame ${fno}`, { sheets: { [sheet]: p => p }, views: [{ t, ...CAM.view(z, fx, fy, 0) }] });
        rows.push(`f${fno} ink x ${x0}-${x1} y ${y0}-${y1}`);
      }
      const ov = LAY.audit('S2 読取不可 slam frames (each frame its own sheet)');
      console.warn(`VERDICT SLAM AUDIT: ${rows.length} frames, ${ov.length} box overlaps [${rows.join('; ')}]`);
      return { problems: ov.length };
    })();
    function draw(tt) {
      CAM.shoot(camS2(tt), 0, tt, ctx => {
        ctx.drawImage(GROUND, 0, 0);
        // inside the frame: the photo's plain light ground, then her
        ctx.save(); ctx.beginPath(); ctx.rect(FR2.x, FR2.y, FR2.w, FR2.h); ctx.clip();
        ctx.fillStyle = PAPER; ctx.fillRect(FR2.x, FR2.y, FR2.w, FR2.h); ctx.fillStyle = rgba(TEAL_RGB, 0.07); ctx.fillRect(FR2.x, FR2.y, FR2.w, FR2.h);
        const F = tt >= T340 ? IDB : IDA;
        ctx.drawImage(F.im, XI, YI, F.w * sI, F.h * sI);
        paintCards(ctx, F, XI, YI, sI, [HER_ID.compose(tt, {})]);
        ctx.restore();
        // the dashed frame and its 写真 label
        ctx.strokeStyle = TEAL; ctx.lineWidth = 3; ctx.setLineDash([12, 9]); ctx.strokeRect(FR2.x, FR2.y, FR2.w, FR2.h); ctx.setLineDash([]);
        { const D = dots16('写真', 2.2, 1910, TEAL_RGB); ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, FR2.x + 96, FR2.y + 22, D.w, D.h); }
        verdict(ctx, tt);
        // 句32, printed as sung (16-dot, light print: nothing shakes); 句33 in her pencil
        // (the old 3-frame wipe-down read late; cut to one frame, its half-wiped letter read as another one (足 as ロ), so the
        // frame before the onset shows the whole letter faint, as every other sung letter does)
        P32.forEach((col, j) => col.forEach((p, i) => { const f = sungBuild(tt - p.t); if (f <= 0) return; const D = D32[j][i]; ctx.save(); ctx.globalAlpha = f;
          ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, p.x - D.w / 2, p.y - D.h / 2, D.w, D.h); ctx.restore(); }));
        P33.forEach(col => col.forEach(p => PEN.char(ctx, p.c, p.x, p.y, p.size, tt - p.t, p.rot)));
      });
    }
    const views = frameTimes(SEG[0], T335, T343).map(t => { const [z, fx, fy] = camS2(t); return { t, ...CAM.view(z, fx, fy, 0) }; });
    LAY.frameCheck('S2 photo and columns', { sheets: { s2: p => p }, views });
    // the dashed frame and its 写真 label are whole until the push; the push down to her card then takes the frame's top edge
    // and the label out of the picture on purpose, all of it. They may cross the edge while the camera moves, never while it
    // stands: the check runs over every frame where the camera moves less than 3 px (before the push and its easing end)
    LAY.frameCheck('S2 the photo frame and 写真, whenever the camera stands', { sheets: { s2frame: p => p, s2label: p => p }, views: standing(views) });
    return { draw, cam: camS2 };
  })();

  // =====================================================================================================================
  // S3a (k343-k351): her card back, close. Her pencil writes 句34 / 句35 across its lower half; k348 her fingers grip
  // =====================================================================================================================
  const S3A = await (async () => {
    const CB = await figure('r11_cb', true), CBG = await figure('r11_cb_grip', true);
    const SA = 1.25, CTOP = 230, XA = 0, YA = CTOP - CB.cards[0].rect[1] * SA;
    const rc = CB.cards[0].rect, CW_A = (rc[2] - rc[0]) * SA, CH_A = (rc[3] - rc[1]) * SA, CX0 = XA + rc[0] * SA, CY0 = YA + rc[1] * SA;
    const HER = makeCard('R', 2.2, { kieWord: KIE, frags: true });
    const toScr = ([x, y]) => [CX0 + x * CW_A / CU, CY0 + y * CH_A / CH];
    const boxScr = ([bx, by, bw, bh]) => { const [x0, y0] = toScr([bx, by]), [x1, y1] = toScr([bx + bw, by + bh]); return [x0, y0, x1 - x0, y1 - y0]; };
    const rowBox = (row, n) => boxScr(herRowBox(row, n));
    LAY.text('句34 on her card back', 's3a', rowBox(HERP.r34, L34.length));
    LAY.text('句35 on her card back', 's3a', rowBox(HERP.r35, L35.length));
    for (const [n, b] of OLD_LINES()) LAY.text(n, 's3a', boxScr(b));                    // 04's own lines: her new rows go between them
    { const [x0, y0] = toScr([462, 360]), [x1, y1] = toScr([612, 384]); LAY.reg('はみ出しています (04, small print; under her fingertips)', 's3a:print', [x0, y0, x1 - x0, y1 - y0]);
      LAY.text('句35 (against the small print)', 's3a:print', rowBox(HERP.r35, L35.length)); LAY.text('句34 (against the small print)', 's3a:print', rowBox(HERP.r34, L34.length)); }
    // her new rows against her fingertips (measured from the card mask; 04's old lines do pass under the fingers, so they are
    // checked against the new rows only, above)
    LAY.text('句34 (against her fingertips)', 's3a:hands', rowBox(HERP.r34, L34.length)); LAY.text('句35 (against her fingertips)', 's3a:hands', rowBox(HERP.r35, L35.length));
    LAY.reg('left fingertips (measured from the card mask)', 's3a:hands', boxScr([0, 326, 92, 99]));
    LAY.reg('right fingertips (measured from the card mask)', 's3a:hands', boxScr([540, 326, 97, 99]));
    LAY.audit('S3a her card back');
    // The camera (2026-11-21 rhythm pass; it was one slow push over eight beats): the push to the card's lower half in two
    // steps on the bar lines, k344 (the crash) and k348 (her grip, the card's dip on the same frame), and a 1.2% kick on
    // each snare between them (k345, k347, k349); still between the hits.
    // (2026-11-21 third round, 整屏运动) one 大击 on the crash k344: a 3% step in, three frames, one way; then a slow push
    // over k345-k351 to the card's lower half (1.03 -> 1.15, eased). The kicks on the snares k345/347/349 and the k348 step
    // are gone: her grip on k348 (the drawing's swap, the corners bending back, the card sinking 3 px and staying) is the
    // hit inside the picture.
    const BIGA = 0.03, pushA = pushes(S, [[K(345), T351, 0.12, 'S3a slow push to the lower half of the card']]);
    S.ev('S3a 大击 step (the crash k344)', K(344)); S.ev('S3a her grip (the card sinks)', T348);
    const FOC_A = [960, CY0 + CH_A * 0.62];
    const camA = tt => { const zs = pushA(0, tt) + stepOne(tt, K(344), BIGA, 3, 0), u = Math.min(1, (zs - 1) / 0.15); return [zs, 960, 540 + (FOC_A[1] - 540) * u]; };
    // the card (the whole drawing) sinks 3 px on the grip and stays down: one way, below the motion audit's visible size
    const gripDy = tt => { const age = (tt - T348) / FR; return age < 0 ? 0 : [1.5, 2.5, 3][Math.floor(age)] ?? 3; };
    const GROUND = paperGround(1111, 0);
    // k348 her grip bends the card's two lower corners back toward her: each corner folds along a crease from the fingertips,
    // the folded part turned away from the light (darker), a crisp crease with a lit edge above it, a shadow pooling into the
    // corner; kept inside the card's mask (her fingers stay in front)
    const BEND = (() => {
      const w = Math.ceil(CW_A), h = Math.ceil(CH_A), [c, x] = mk(w, h);
      for (const side of [0, 1]) {
        const X = v => side ? w - v : v, cxp = X(0), A = [X(0), h * 0.66], B = [X(w * 0.2), h];
        x.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.2); x.beginPath(); x.moveTo(A[0], A[1]); x.quadraticCurveTo(X(w * 0.075), h * 0.9, B[0], B[1]); x.lineTo(cxp, h); x.closePath(); x.fill();
        const gr = x.createRadialGradient(cxp, h, 2, cxp, h, w * 0.26); gr.addColorStop(0, rgba(GRAPHITE_DARK_RGB, 0.3)); gr.addColorStop(1, rgba(GRAPHITE_DARK_RGB, 0));
        x.fillStyle = gr; x.fillRect(0, 0, w, h);
        x.lineCap = 'round';
        x.strokeStyle = rgba(PAPER_RGB, 0.75); x.lineWidth = 2.2; x.beginPath(); x.moveTo(A[0] + (side ? -3 : 3), A[1] - 3); x.quadraticCurveTo(X(w * 0.075 + 3), h * 0.9 - 3, B[0] + (side ? -3 : 3), B[1] - 3); x.stroke();
        x.strokeStyle = rgba(INK_RGB, 0.45); x.lineWidth = 2.4; x.beginPath(); x.moveTo(A[0], A[1]); x.quadraticCurveTo(X(w * 0.075), h * 0.9, B[0], B[1]); x.stroke();
      }
      const m = CBG.cards[0], [mx0, my0, mx1, my1] = m.rect;
      x.globalCompositeOperation = 'destination-in'; x.drawImage(m.maskImg, mx0, my0, mx1 - mx0, my1 - my0, 0, 0, w, h);
      return c;
    })();
    function draw(tt) {
      const grip = tt >= T348, F = grip ? CBG : CB, age = grip ? (tt - T348) / FR : 99, dy = gripDy(tt);
      CAM.shoot(camA(tt), 0, tt, ctx => {
        ctx.drawImage(GROUND, 0, 0);
        ctx.save(); ctx.translate(0, dy);
        ctx.drawImage(F.im, XA, YA, F.w * SA, F.h * SA);
        paintCards(ctx, F, XA, YA, SA, [HER.compose(tt, { her: (o, t2) => herRows(o, t2, [[L34, HERP.r34], [L35, HERP.r35]]) })]);
        if (grip) { ctx.globalAlpha = Math.min(1, (age + 1) / 2); ctx.drawImage(BEND, CX0, CY0, CW_A, CH_A); ctx.globalAlpha = 1; }
        ctx.restore();
      });
    }
    const views = frameTimes(SEG[0], T343, T351).map(t => { const [z, fx, fy] = camA(t); return { t, ...CAM.view(z, fx, fy, 0) }; });
    LAY.frameCheck('S3a her card back', { sheets: { s3a: p => p }, views });
    return { draw, cam: camA, dy: gripDy };
  })();

  // =====================================================================================================================
  // S3b (k351-k359): the row of four chests. The frame's top edge under the shoulder line; the four cards on one line
  // =====================================================================================================================
  const S3B = await (async () => {
    const TRIO = await figure('p11_trio3', false), ROW = await figure('r11_row6', true);
    // the trio: cropped at its shoulder line (drawing y CROP_T), filling the frame's height; B's card 28 px in from the left
    const CROP_T = P('cropt', 110), ST = 1080 / (TRIO.h - CROP_T), XT = P('bx', 28) - TRIO.cards[0].rect[0] * ST, YT = -CROP_T * ST;
    const rectOf = (F, i, X, Y, s) => { const [x0, y0, x1, y1] = F.cards[i].rect; return [X + x0 * s, Y + y0 * s, (x1 - x0) * s, (y1 - y0) * s]; };
    const RB = rectOf(TRIO, 0, XT, YT, ST), RA = rectOf(TRIO, 1, XT, YT, ST), RCc = rectOf(TRIO, 2, XT, YT, ST);
    // her: her card's top edge on the line of the others' (their mean), right of C's card; drawn large enough that her drawing
    // reaches below the frame's bottom edge (her card comes out ~9% wider than A's: she stands nearest, at the frame's edge,
    // so her body shows no wider than A's; her letters are set smaller in card units so on screen they match A's)
    const CTOPL = (RB[1] + RA[1] + RCc[1]) / 3, RW = ROW.cards[0].rect[2] - ROW.cards[0].rect[0];
    const SR = Math.max(RA[2] / RW, (1080 + 6 - CTOPL) / (ROW.h - ROW.cards[0].rect[1])), herW = RW * SR;
    const XR = P('hx', RCc[0] + RCc[2] + 64) - ROW.cards[0].rect[0] * SR, YR = CTOPL - ROW.cards[0].rect[1] * SR;
    const RR = rectOf(ROW, 0, XR, YR, SR);
    const R4 = [RB, RA, RCc, RR], WHO = ['B', 'A', 'C', 'R'];
    const CARDS = R4.map((r, i) => makeCard(WHO[i], 2.0, { kieWord: KIE, shiWord: SHI }));
    R4.forEach((r, i) => LAY.reg(`card ${WHO[i]}`, 's3b', r));
    LAY.audit('S3b the row');
    CARDS.forEach((C, i) => { C.kie.forEach((L, j) => { const bw = L.s * 0.66 * Math.min(1, OWN[WHO[i]].sx + 0.1); LAY.text(`消えたい ${WHO[i]} ${j}`, `card${WHO[i]}`, [L.x - bw / 2, L.y - L.s * 0.33, bw, L.s * 0.66]); }); LAY.audit(`card ${WHO[i]} words`); });
    // her pencil rows on her card (card units): 句34/35 written in S3a, って言うんだ written here
    [['句34', HERP.r34, L34.length], ['句35', HERP.r35, L35.length], ['って言うんだ 1', HERP.t1, TTE1.length], ['って言うんだ 2', HERP.t2, TTE2.length]]
      .forEach(([n, row, len]) => LAY.text(n, 'cardR:pencil', herRowBox(row, len)));
    for (const [n, b] of OLD_LINES()) LAY.text(n, 'cardR:pencil', b);
    // her new rows against the eraser's band and her fingertips in r11_row6 (measured from the card mask: they cover the card
    // only below y 355); 04's old lines pass under the fingers, so they are checked against the new rows only
    [['句34', HERP.r34, L34.length], ['句35', HERP.r35, L35.length], ['って言うんだ 1', HERP.t1, TTE1.length], ['って言うんだ 2', HERP.t2, TTE2.length]]
      .forEach(([n, row, len]) => LAY.text(`${n} (against the band and the fingers)`, 'cardR:hands', herRowBox(row, len)));
    LAY.reg('band of the eraser', 'cardR:hands', [0, 0, CU, BAND]);
    LAY.reg('left fingertips', 'cardR:hands', [0, 355, 145, 70]); LAY.reg('right fingertips', 'cardR:hands', [488, 365, 149, 60]);
    LAY.audit('S3b her card');
    // the eraser: the canon eraser, upright, its rounded working end down; 16 x 3 cm at the cards' scale (a card is 15 cm).
    // It comes down from above the frame onto B's card on the beat (its upper end never in the frame), presses, and rubs
    // straight across all four at one speed, scrubbing up and down along its length.
    const ERI = await img('/art/canon/machine_big_eraser.png');
    const ESRC = [56, 206, 966, 188], PXCM = RA[2] / 15, EWID = 3 * PXCM, ELEN = 16 * PXCM;
    const EB_LOW = CTOPL + BAND / CH * RA[3] + 2, STROKE = 0.6 * PXCM;
    const XE = W + EWID * 1.2;
    // pass 2 (third round: the camera no longer steps in through the fill, so B's card stays in the picture) comes down onto
    // B's card again on the half beat k357.5 and rubs across all four at about pass 1's speed, out of the frame on the cut
    const T3575 = K(357.5);
    const PASS = [{ t: T354, xs: RB[0] - EWID * 0.1, sweep: K(355.25) - T354 - 2 * FR }, { t: T3575, xs: RB[0] - EWID * 0.1, sweep: T359 - T3575 - 3 * FR }];
    S.ev('the eraser comes down onto B\'s card (pass 1)', T354); S.ev('the eraser comes down again, onto B\'s card (pass 2)', T3575, 'half');
    // the reuse table counts a drawing as on screen from its hold: the canon eraser (its upright view, a sub-rectangle of the
    // set page) is on for the two passes, out of the frame between them
    S.hold('eraser', 'E-big (canon eraser, two passes; out of the frame between them)', T354, T359, { kind: 'key', file: '/art/canon/machine_big_eraser.png', onBeat: false });
    const eraserAt = (tt, k) => {
      const { t, sweep, xs: XS } = PASS[k], drop = 3 * FR;
      if (tt < t - drop || tt > t + 2 * FR + sweep + FR) return null;
      if (tt < t) { const u = (tt - t + drop) / drop; return { cx: XS, yb: lerp(-40, EB_LOW, u * u), squash: 0 }; }
      if (tt < t + 2 * FR) return { cx: XS, yb: EB_LOW + 3, squash: 1 - (tt - t) / (2 * FR) };
      const u = Math.min(1, (tt - t - 2 * FR) / sweep), x = lerp(XS, XE, u), scrub = STROKE * (0.5 - 0.5 * Math.cos(2 * Math.PI * 3 * (tt - t) / BEAT));
      return { cx: x, yb: EB_LOW - scrub, squash: 0, speed: (XE - XS) / sweep };
    };
    // how far the eraser has rubbed card i, card units
    const rubbedX = (i, tt, k) => { const e = eraserAt(tt, k), r = R4[i]; const t = PASS[k].t;
      if (tt < t) return 0; const x = e ? e.cx + EWID / 2 : XE; return Math.max(0, Math.min(CU + 10, (x - r[0]) / r[2] * CU)); };
    // the eraser over one frame's travel: a shutter of half a frame, sampled; still, it is drawn once, solid
    const [EB, eb] = mk(W, 1080);
    function drawEraser(ctx, e) {
      const travel = 0, n = 1;                 // drawn crisp: a blur over a frame's travel made it a faint ghost
      eb.setTransform(1, 0, 0, 1, 0, 0); eb.globalCompositeOperation = 'source-over'; eb.globalAlpha = 1; eb.clearRect(0, 0, W, 1080);
      eb.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const dx = n > 1 ? -travel * (i / (n - 1)) : 0;
        eb.save(); eb.globalAlpha = 1 / n; eb.translate(e.cx + dx, e.yb); eb.rotate(-Math.PI / 2);
        eb.fillStyle = HAND_SHADOW; eb.beginPath(); eb.roundRect(-6, -EWID / 2 + 10, ELEN, EWID, EWID / 2); eb.fill();
        eb.restore();
      }
      ctx.drawImage(EB, 0, 0);
      eb.globalCompositeOperation = 'source-over'; eb.clearRect(0, 0, W, 1080); eb.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const dx = n > 1 ? -travel * (i / (n - 1)) : 0;
        eb.save(); eb.globalAlpha = 1 / n; eb.translate(e.cx + dx, e.yb); eb.rotate(-Math.PI / 2);
        eb.drawImage(ERI, ESRC[0], ESRC[1], ESRC[2], ESRC[3], -(e.squash || 0) * 2, -EWID / 2, ELEN, EWID);
        eb.restore();
      }
      ctx.drawImage(EB, 0, 0);
    }
    const crumbs = (() => { const r = rng(77), out = []; for (let i = 0; i < 40; i++) out.push([r() * W, EB_LOW + 2 + r() * 14, 2 + r() * 3, r() * 7, i % 2]); return out; })();
    // The camera (2026-11-21 third round, 整屏运动): the row stands still k351-k359. One ordinary step on the snare k355 (the
    // camera stops dead as the eraser's first pass ends: 1.4% in, three frames, about the centre, so a frame corner moves
    // 0.8% of the width) and nothing more: the kick on k352 and the four steps through the fill (k356-k358.5) are gone, so
    // the frame is still before 12's crash on k360. The fill plays inside the picture: on each eighth k356-k358.5 the machine
    // prints one timing mark on every card back, top to bottom down the right edge (the column of the corner marks; a paper
    // ring round each, as round the corner marks), and the eraser's second pass comes down on k357.5.
    const STEP_B = 0.014;
    S.ev('the camera stops on the snare (one step)', T355);
    const camB = tt => [1 + stepOne(tt, T355, STEP_B, 3, 0), 960, 540];
    const TMARK_T = [356, 356.5, 357, 357.5, 358, 358.5].map(K);
    TMARK_T.forEach((t, i) => S.ev(`fill: timing mark ${i + 1} printed on every card`, t, 'half'));
    const TMARK = { x: 600, w: 16, h: 26, y0: 58, dy: 47, ring: 5 };
    const tmarkBox = i => [TMARK.x, TMARK.y0 + i * TMARK.dy, TMARK.w, TMARK.h];
    // drawn in card units on top of the card (machine print: the eraser does not take it); each mark slams down 40% large and
    // is pressed to size in three frames, about its own centre
    function timingMarks(o, tt) {
      TMARK_T.forEach((t, i) => { const age = tt - t; if (age < -1e-9) return; const kf = Math.floor(age / FR + 1e-6), sc = [1.4, 1.15, 1.04][kf] ?? 1;
        const [x, y, w, h] = tmarkBox(i), R = TMARK.ring;
        o.save(); o.translate(x + w / 2, y + h / 2); o.scale(sc, sc);
        o.fillStyle = PAPER_CARD; o.beginPath(); o.roundRect(-w / 2 - R, -h / 2 - R, w + 2 * R, h + 2 * R, R); o.fill();
        o.fillStyle = GRAPHITE; o.fillRect(-w / 2, -h / 2, w, h); o.restore(); });
    }
    CARDS.forEach((C, i) => { TMARK_T.forEach((t, j) => { const [x, y, w, h] = tmarkBox(j), R = TMARK.ring;
      LAY.reg(`timing mark ${j + 1} (with its ring)`, `card${WHO[i]}`, [x - R, y - R, w + 2 * R, h + 2 * R]); }); LAY.audit(`card ${WHO[i]} words and timing marks`); });
    const GROUND = paperGround(3303, 0.05);
    function draw(tt) {
      CAM.shoot(camB(tt), 0, tt, ctx => {
        ctx.drawImage(GROUND, 0, 0);
        const states = R4.map((r, i) => ({ rubs: [[rubbedX(i, tt, 0), BAND], [rubbedX(i, tt, 1), BAND]], shiOn: shiGate(tt), her: timingMarks }));
        states[3].her = (o, t2) => { herRows(o, t2, [[L34, HERP.r34, true], [L35, HERP.r35, true], [TTE1, HERP.t1], [TTE2, HERP.t2]]); timingMarks(o, t2); };
        ctx.drawImage(TRIO.im, XT, YT, TRIO.w * ST, TRIO.h * ST);
        paintCards(ctx, TRIO, XT, YT, ST, [0, 1, 2].map(i => CARDS[i].compose(tt, states[i])));
        ctx.drawImage(ROW.im, XR, YR, ROW.w * SR, ROW.h * SR);
        paintCards(ctx, ROW, XR, YR, SR, [CARDS[3].compose(tt, states[3])]);
        for (const [k, t0] of [[0, T354], [1, T358]]) { if (tt < t0) continue; const e = eraserAt(tt, k), front = e ? e.cx : XE;
          for (const [x, y, rr, a, par] of crumbs) { if (par !== k || x > front - EWID) continue; if (!R4.some(r => x > r[0] && x < r[0] + r[2])) continue;
            ctx.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 0.55); ctx.beginPath(); ctx.ellipse(x, y, rr * 1.6, rr, a, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(INK_RGB, 0.5); ctx.lineWidth = 0.8; ctx.stroke(); } }
        for (const k of [0, 1]) { const e = eraserAt(tt, k); if (e) drawEraser(ctx, e); }
      });
    }
    // her rows map from card units to the screen through her card's rectangle
    const herMap = ([x, y]) => [RR[0] + x / CU * RR[2], RR[1] + y / CH * RR[3]];
    const views = frameTimes(SEG[0], T351, T359).map(t => { const [z, fx, fy] = camB(t); return { t, ...CAM.view(z, fx, fy, 0) }; });
    const cardMap = r => ([x, y]) => [r[0] + x / CU * r[2], r[1] + y / CH * r[3]];
    const wordSheets = Object.fromEntries(WHO.map((w, i) => [`card${w}`, cardMap(R4[i])]));
    // all four cards, every word and timing mark on them and her pencil rows whole in every frame of the shot
    LAY.frameCheck('S3b the row (k351-k359)', { sheets: { s3b: p => p, 'cardR:pencil': herMap, ...wordSheets }, views, inset: 2 });
    return { draw, R4, cam: camB };
  })();

  // LYRIC AUDIT: every sung letter, the first frame of its shot on which it reads (opacity >= 2/3).
  // The opacities are the ones the drawing code uses: sungBuild everywhere
  // (pencilWriter's letters, the strip's 昨日 and の宿題は, 句32's 16-dot print, the dented 消えたい, the pencil 死にたい behind its gate).
  {
    const shotOf = { s1: [T327, T335], s2: [T335, T343], s3a: [T343, T351], s3b: [T351, T359] };
    const sung = age => sungBuild(age);
    const rows = [
      ...L30.map(([c, t]) => ({ c, t, shot: 's1', f: tt => sung(tt - t) })),
      ...L31.map(([c, t]) => ({ c, t, shot: 's1', f: tt => sung(tt - t) })),
      ...L32.map(([c, t]) => ({ c, t, shot: 's2', f: tt => sung(tt - t) })),
      ...L33.map(([c, t]) => ({ c, t, shot: 's2', f: tt => sung(tt - t) })),
      ...L34.map(([c, t]) => ({ c, t, shot: 's3a', f: tt => sung(tt - t) })),
      ...L35.map(([c, t]) => ({ c, t, shot: 's3a', f: tt => sung(tt - t) })),
      ...KIE.map(([c, t]) => ({ c, t, shot: 's3b', f: tt => (sungShown(tt, t) ? sung(tt - t) : 0) })),
      ...TTE1.map(([c, t]) => ({ c, t, shot: 's3b', f: tt => sung(tt - t) })),
      ...SHI.map(([c, t]) => ({ c, t, shot: 's3b', f: tt => (shiGate(tt) && sungShown(tt, t) ? sung(tt - t) : 0) })),
      ...TTE2.map(([c, t]) => ({ c, t, shot: 's3b', f: tt => sung(tt - t) })),
    ];
    lyricAudit('seg_11', rows.map(r => { const [a, b] = shotOf[r.shot], need = r.need ?? 0.66;
      const tt = frameTimes(SEG[0], Math.max(a, r.t - 4 * FR), b).find(x => r.f(x) >= need - 1e-9);
      return { c: r.c, t: r.t, readT: tt ?? null }; }));
  }

  // MOTION AUDIT (docs/制作约定.md 第六节「整屏运动」): every frame's view as shown (the shot's camera, plus S3a's 3 px grip
  // sink as an offset), the first frame of each shot marked as a cut. 大击: k327 (the band slams back in, the 未提出 stamp;
  // the segment's first beat, crash 44.5 dB) and k344 (the crash, 4.6 dB, the loudest in the segment after k327).
  const SHOTS = [[T327, S1], [T335, S2], [T343, S3A], [T351, S3B]];
  const shotAt = t => SHOTS.filter(([t0]) => t >= t0 - 1e-9).pop() || SHOTS[0];
  const MV = frameTimes(SEG[0], SEG[0], SEG[1]).map((t, i, all) => {
    const [t0, sh] = shotAt(t), [z, fx, fy] = sh.cam(t), v = CAM.view(z, fx, fy, 0);
    return { t, ...v, dx: 0, dy: sh.dy ? sh.dy(t) * v.z : 0, cut: i === 0 || shotAt(all[i - 1])[0] !== t0 }; });
  const MOTION_R = motionAudit('seg_11', MV, { big: [[T327, 'k327 the band slams back in, 未提出 stamped (segment start, crash)'], [K(344), 'k344 crash (S3a)']] });
  // PART AUDIT: the hand points were checked where the hands are made (S1); here each card's fill mask against its own
  // drawing: wherever the page paints a card, that drawing has blank card paper (a mask measured on another drawing fails)
  { const paperish = ([r, g, b, a]) => a > 200 && Math.min(r, g, b) > 196 && Math.max(r, g, b) - Math.min(r, g, b) < 26;
    for (const [name, im0, cards] of PART_CHECKS) cards.forEach((c, i) => {
      const mp = pixelsOf(c.maskImg), [x0, y0, x1, y1] = c.rect, pts = [];
      for (let y = y0 + 2; y < y1 - 2; y += 5) for (let x = x0 + 2; x < x1 - 2; x += 5) if (mp.at(x, y)[3] > 128) pts.push([x, y]);
      partAudit('seg_11', name, `card ${i} (fill mask on the drawn blank card)`, { image: im0, points: pts, on: paperish, r: 1, maxOffPct: 1 }); }); }
  const PARTS_R = partReport('seg_11');
  S.finish();
  publishAudit(S, LAY, { motion: MOTION_R, parts: PARTS_R, shots: { S1: [T327, T335], S2: [T335, T343], S3a: [T343, T351], S3b: [T351, T359] },
                         owners: { A: '鈴木 恵子 (h01)', B: '吉田 蓮 (p09)', C: '渡辺 翔 (p05)' }, s3bCards: S3B.R4.map(r => r.map(v => +v.toFixed(1))) });

  window.renderAt = async t => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    const tt = Math.min(Math.max(t, SEG[0]), SEG[1] - 1e-6);
    if (tt < T335) S1.draw(tt); else if (tt < T343) S2.draw(tt); else if (tt < T351) S3A.draw(tt); else S3B.draw(tt);
  };
  window.__ready = true;
  await window.renderAt(P('t0', SEG[0]));
}
