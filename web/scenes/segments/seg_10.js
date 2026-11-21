// Segment 10 B (docs/分镜/10_B.md), k295-k327, global frames [3287, 3643). Design 乙 for the car, chosen by the blind review
// of the two samples (sample page: archive/seg10_sample_20261120/seg_10_samples.js), finished with the review's must_fix:
//   S1 k295-k311  down the aisle of a night train, a long lens (one-point perspective, f = 3000 px): two rows of passengers,
//                 every head bowed at one angle, each holding the film's answer card flat on the lap; two rows of straps that
//                 lean together with the car, far enough to read (ends on the bar lines k296 / k300 / k304 / k308) and kick on
//                 the snares; the car jolts on k299 / k303 / k307 (everything inside drops and rebounds, a pole sweeps past the
//                 windows); she stands in the middle of the aisle, her back to us, hugging her gig bag. The hanging dot-matrix
//                 display prints 句26 (いつまで経ったって／僕達は) and, after the wipe on k303, 句27 (ぞんざいな催眠に／酔っていて),
//                 each row at its final place from the first letter. A slow push from the cut to k311 (1.00 -> 1.32);
//                 k307 (「眠」just sung): every head drops at once, hers too (r10g_doorb: head forward, the bow tipping, the nape showing),
//                 with the camera's one stop (punch) and the jolt.
//   S2 k311-k322  over her shoulder at the door glass: her face in the glass (mirrored, her lanyard at the collar), eyes
//                 half closed like everyone's; behind it in the glass the three people of the bench opposite, asleep; the city
//                 streams through the glass (thinned where her face is). The paper tag hangs on her bag's handle: her pencil
//                 writes 句28 in its なかみ field; k316 the reflection looks up, cold (r10g_reflb) as 「驕傲」 goes into the printed
//                 box. k312 the lights thicken; on the snares k315 and k319 a lamp sweeps the glass from the snare's frame
//                 (k319's the wide one, across her face; it replaced a slow band k317-k319 whose ends no one could see);
//                 k320-k322 the train brakes and a platform pillar comes in and stops in the glass.
// 2026-11-21 (user, after the whole film: lyrics a little behind the song; the picture should go with the rock rhythm):
// the display's sung letters show with print.js sungBuild (whole on the onset's frame), LYRIC AUDIT checks every sung
// letter; the lamp passes on k315 / k319. B stays the quietest part: no flash, no punch added.
// 2026-11-21 motion pass (user, second cut: 「你为什么要一直抖动屏幕……看着很晕」; 制作约定 第六节 整屏运动): the car no longer
// drops and rebounds as a whole on k299 / k303 / k307 (S1) nor the door and her head on k315 / k319 (S2) — those were
// whole-frame there-and-back shakes. The snares stay in the picture: the straps swing together and a pole sweeps past the
// windows (S1), the tag swings and a lamp crosses the glass (S2). The camera's only jolt is the registered 大击 on k307
// (every head drops at once): the slow push eases to a stop on k307, steps in 3% in two frames, one way, and holds still to
// the cut on k311. MOTION AUDIT checks every frame's framing. Parts drawn over the drawings (the bag's carry handle and
// the tag cord on r10g_back, the tag on g10f_bag's handle, the locker door under her hand in r10g_lock / lockm / lockb)
// come from art/cut/seg10_parts.json, measured on each drawing, through parts.js placement (PART AUDIT).
//   S3 k322-k327  cut on the stop: the station's coin lockers, front on (the set pack's drawing itself). Her tall door 22 stands
//                 open, her gig bag inside with the tag; she has her hand on the door (r10g_lock), pushes it half shut on
//                 k323.5 (r10g_lockm) and shut on k324 (r10g_lockb, palm flat on it): the door steps with the drawings so
//                 the hand stays on its free edge. On k324 the whole door turns pencil black with 使用中 in white dots, one
//                 filled cell in a white answer sheet; then nothing moves but 句29 in her pencil down the side panel.
// Everything shared comes from web/lib/ (score, type, camera, print, lyrics, palette, hand, card); drawings in art/cut (Codex,
// art/design/prompts/_make_seg10f.py, _make_seg10f3.py, _make_seg10g.py): p10f_rowL/R and p10f_rowLb/Rb (b = p10g_row*b redrawn
// from the masters; the film's card printed on every lap card by work/seg/10/fin/swap10.py, fingers kept in front, the same
// quads master and b), r10_door (sample master) + r10g_doorb, r10g_back, r10g_refl (+b), p10f_opp, r10g_lock / lockm / lockb,
// g10f_bag; the lockers are art/canon/coin_lockers_front.png.
import { BEAT, FRAME as FR, beatV, beatOf, smooth, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, move, camLerp, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, partAudit, PIX, pixelsOf, partReport } from '../../lib/parts.js';
import { dots16, pencilWriter, sungBuild } from '../../lib/print.js';
import { loadLyrics, lyricAudit } from '../../lib/lyrics.js';
import { PAPER, PAPER_CARD, TEAL, TEAL_RGB, GRAPHITE, INK_RGB, PAPER_RGB, PENCIL, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB,
         REHATCH_LIGHT_RGB, rgba } from '../../lib/palette.js';

export default async function seg10(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 3287, F1 = 3643, SEG = [F0 / 30, F1 / 30];
  const K = beatV;
  const T295 = K(295), T303 = K(303), T307 = K(307), T311 = K(311), T312 = K(312), T315 = K(315), T316 = K(316), T319 = K(319),
        T320 = K(320), T322 = K(322), T323 = K(323), T3235 = K(323.5), T324 = K(324), T327 = K(327);
  const S = createScore('seg_10', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const LY = await loadLyrics({ within: SEG });
  const L26 = LY.lineAt(26, 'いつまで経ったって僕達は'), L27 = LY.lineAt(27, 'ぞんざいな催眠に酔っていて');
  const L28 = LY.lineAt(28, 'どうしようもないくらいの驕傲をずっと'), L29 = LY.lineAt(29, '匿っていたんだ');
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return [c, c.getContext('2d')]; };

  // ---------- colours: only the three plates, mixed (no new colour values) ----------
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixRGB = (a, b, t) => { const A = hex(a), B = hex(b); return A.map((v, i) => Math.round(v + (B[i] - v) * t)); };
  const mix = (a, b, t, al = 1) => rgba(mixRGB(a, b, t), al);
  const NIGHT = mix(GRAPHITE, TEAL, 0.16), NIGHT_FAR = mix(GRAPHITE, TEAL, 0.30), NIGHT_MID = mix(GRAPHITE, TEAL, 0.42);
  const LINE = mix(TEAL, GRAPHITE, 0.35);
  const BELT = mix(TEAL, GRAPHITE, 0.5);
  const INSIDE = mix(GRAPHITE, TEAL, 0.22);

  // ---------- halftone screen ----------
  // One cell of `pitch` px (user space, so it scales with the camera) holds a dot at its corner and one at its centre, on a
  // 15-degree grid. Same-class fix as 03 (根因清单: 网点贴图按屏幕缩放预滤波): the old pattern was one 64 px cell minified
  // ~13x onto 5 px, and canvas patterns are sampled without prefiltering, so S1's slow push made the screens crawl. Now the
  // tile (12 x 12 cells) is drawn at the scale it is shown (its pixel size rounded from the context's current device scale),
  // supersampled 4x and box-filtered, so it is sampled about 1:1; the cell geometry and the ink coverage are the old ones.
  const scrCache = new Map();
  function screen(ctx, cover = 0.3, pitch = 5, rgb = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 12, tpx = Math.max(12, Math.round(N * pitch * dev));
    const key = `${cover}|${rgb}|${tpx}`;
    let e = scrCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N + 1; i++) for (let j = -1; j <= N + 1; j++) for (const o of [0, 0.5]) {
        bx.beginPath(); bx.arc((i + o) * cell, (j + o) * cell, r, 0, 7); bx.fill();
      }
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
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
  const line = (ctx, pts, w = 2, color = TEAL) => { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
  function fillPoly(ctx, pts, { fill = PAPER, scr = null, stroke = TEAL, w = 2 } = {}) {
    poly(ctx, pts);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (scr) { ctx.fillStyle = screen(ctx, scr[0], scr[1], scr[2]); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); }
  }

  // ---------- drawings ----------
  const ART = {
    door: '/art/cut/r10_door.png', doorb: '/art/cut/r10g_doorb.png',
    rowL: '/art/cut/p10f_rowL.png', rowLb: '/art/cut/p10f_rowLb.png', rowR: '/art/cut/p10f_rowR.png', rowRb: '/art/cut/p10f_rowRb.png',
    back: '/art/cut/r10g_back.png', refl: '/art/cut/r10g_refl.png', reflb: '/art/cut/r10g_reflb.png', opp: '/art/cut/p10f_opp.png',
    lock: '/art/cut/r10g_lock.png', lockm: '/art/cut/r10g_lockm.png', lockb: '/art/cut/r10g_lockb.png', bag: '/art/cut/g10f_bag.png',
    lockers: '/art/canon/coin_lockers_front.png',
  };
  const PAL = new Set(['door', 'doorb', 'back', 'refl', 'reflb', 'lock', 'lockm', 'lockb', 'bag']);
  const IM = {};
  const FALLBACK = { doorb: 'door', rowLb: 'rowL', rowRb: 'rowR', reflb: 'refl', back: 'door', opp: 'rowL', lock: 'door', lockm: 'lock', lockb: 'lock', bag: 'door', lockers: 'door' };   // DEV ONLY
  await Promise.all(Object.keys(ART).map(async k => { let im = await img(ART[k]).catch(() => null); if (!im) { console.warn('MISSING ART ' + ART[k]); im = await img(ART[FALLBACK[k]]); } IM[k] = PAL.has(k) ? rinPalImage(im) : im; }));
  function bbox(im) {
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, x1 = 0, y0 = c.height, y1 = 0;
    for (let yy = 0; yy < c.height; yy += 2) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 128) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
    return { x0, y0, x1, y1 };
  }
  const PA = await loadPartAnchors('/art/cut/seg10_parts.json');      // parts measured on each drawing (parts.js)
  const BB = Object.fromEntries(['back', 'refl', 'opp', 'bag'].map(k => [k, bbox(IM[k])]));
  // her drawing (r10_door): soles at y 1519, hair top at y 142 (152 cm), head centre (514, 253) -> 906 px per metre
  const DOOR = { pxm: 906, headX: 514, headY: 253 };

  // ---------- the timeline ----------
  S.hold('shot', 'S1 down the aisle (one take, slow push)', T295, T311, { kind: 'shot' });
  // S3 is cut on k322, the beat the train stops (句29 opens on k323.55): the open locker and her bag in it need the extra
  // beat to be read before the door shuts on k324 (independent review, MUST 1)
  S.hold('shot', 'S2 her face in the door glass, over her shoulder', T311, T322, { kind: 'shot' });
  S.hold('shot', 'S3 the coin lockers', T322, T327, { kind: 'shot' });
  S.hold('rin', 'r10_door (back, hugging the bag)', T295, T307, { kind: 'key', file: ART.door, onBeat: false });
  S.hold('rin', 'r10g_doorb (head drops with everyone)', T307, T311, { kind: 'key', file: ART.doorb });
  for (const s of ['L', 'R']) {
    S.hold(`row${s}`, `p10f_row${s}`, T295, T307, { kind: 'key', file: ART[`row${s}`], onBeat: false });
    S.hold(`row${s}`, `p10f_row${s}b (heads drop)`, T307, T311, { kind: 'key', file: ART[`row${s}b`] });
  }
  S.hold('back', 'r10g_back (her bowed head, close; the nape redrawn clean)', T311, T322, { kind: 'key', file: ART.back, onBeat: false });
  S.hold('refl', 'r10g_refl (reflection, eyes half closed, her lanyard)', T311, T316, { kind: 'key', file: ART.refl, onBeat: false });
  S.hold('refl', 'r10g_reflb (reflection looks up, cold)', T316, T322, { kind: 'key', file: ART.reflb });
  S.hold('opp', 'p10f_opp (the bench opposite, in the glass)', T311, T322, { kind: 'key', file: ART.opp, onBeat: false });
  // S3: she pushes her locker door shut in three drawings, the door stepping with them so her hand stays on its free edge
  // (independent review: the hand stood still while the edge swept away). r10g_lock holds 1.5 beats from the cut: it opens
  // a one-beat-and-a-half shove (制作约定 第六节 "本来就快的动作"), so it is registered as part of the motion (in-between
  // kind, min half a beat); r10g_lockm, drawn from lock and lockb, holds the half beat before the door shuts on k324.
  S.hold('rin3', 'r10g_lock (her hand on the open door)', T322, T3235, { kind: 'inbetween', file: ART.lock, onBeat: false });
  S.hold('rin3', 'r10g_lockm (pushing, the door half shut)', T3235, T324, { kind: 'inbetween', file: ART.lockm });
  S.hold('rin3', 'r10g_lockb (palm on the shut door)', T324, T327, { kind: 'key', file: ART.lockb });
  S.hold('prop', 'g10f_bag (her gig bag in the open locker, mirrored)', T322, T324, { kind: 'key', file: ART.bag, onBeat: false });
  S.hold('set', 'coin_lockers_front (the set pack locker bank, the whole of S3)', T322, T327, { kind: 'key', file: ART.lockers, onBeat: false });
  [296, 300, 304, 308].forEach(k => S.ev(`straps at the end of their lean (k${k})`, K(k)));
  // the snares: the straps swing together and a pole sweeps past the windows (in the picture; the frame stays put)
  const BUMPS1 = [299, 303, 307].map(k => S.ev(`straps swing, a pole sweeps past the windows (k${k})`, K(k)));
  const BUMPS2 = [315, 319].map(k => S.ev(`the tag swings on the snare (k${k})`, K(k)));
  S.ev('display wiped (k303)', T303);
  S.ev('大击: every head drops, the camera steps in 3% one way and stops (k307)', T307);
  move(S, 'S1 push (eased to a stop on k307)', T295, T307);
  S.ev('city lights thicken (k312)', T312);
  S.ev('a lamp sweeps the glass on the snare (k315)', T315);
  S.ev('the wide lamp sweeps the glass, across her face, on the snare (k319)', T319);
  move(S, 'braking', T320, T322);
  S.ev('locker door pushed half shut (k323.5)', T3235, 'half');
  S.ev('locker door shut; the whole door turns pencil black, 使用中 (k324)', T324);
  const imOf = (track, tt) => { const h = S.at(track, tt); return h && IM[Object.keys(ART).find(k => ART[k] === h.file)]; };

  // the straps: the car's sway leans them all together (degrees, + = the handles swing to the viewer's right), ends on the bar
  // lines; each jolt kicks them into a quick decaying swing
  const AMP = 15;
  function lean(tt) {
    const b = beatOf(tt), n = Math.floor((b - 292) / 4), b0 = 292 + 4 * n;
    const from = n % 2 === 0 ? -AMP : AMP, e = smooth((b - b0 - 0.4) / 3.2);
    let a = from + (-from - from) * e;
    for (const t0 of BUMPS1) { const d = tt - t0; if (d >= 0 && d < 1.2) a += 9 * Math.exp(-d / 0.35) * Math.sin(2 * Math.PI * d / 0.55) * Math.sign(a || 1); }
    return a;
  }

  // ---------- dot-matrix letters (rendered at RES x so they stay sharp in the push) ----------
  const RES = 2, glyphs = {};
  function glyph(ch, k, seed) { const key = ch + k + seed; return (glyphs[key] ||= dots16(ch, k * RES, seed, INK_RGB)); }
  // a sung character on the display: whole on the frame its onset falls in, 55% on the frame before (print.js sungBuild;
  // 2026-11-21 the old 1/3, 2/3, 1 fade from the onset read 1-2 frames late: 「歌词好像比曲子慢了一点」)
  function dotChar(ctx, ch, cx, cy, k, age, seed) {
    const f = sungBuild(age); if (f <= 0) return;
    const D = glyph(ch, k, seed), w = D.w / RES, h = D.h / RES;
    ctx.save(); ctx.globalAlpha = f; ctx.drawImage(D.c, D.x0, D.y0, D.w, D.h, cx - w / 2, cy - h / 2, w, h); ctx.restore();
  }
  function cellGrid(ctx, x0, y0, x1, y1, pitch) {
    ctx.fillStyle = rgba(TEAL_RGB, 0.10);
    for (let y = y0 + pitch / 2; y < y1; y += pitch) for (let x = x0 + pitch / 2; x < x1; x += pitch) ctx.fillRect(x - pitch * 0.22, y - pitch * 0.22, pitch * 0.44, pitch * 0.44);
  }

  // ======================================================================================================================
  // S1: down the aisle. Camera 1.45 m high on the aisle centre line, level, f = 3000 px (long lens); horizon y 540.
  // ======================================================================================================================
  const FB = 3000, HC = 1.45;
  const PJ = (lat, h, d) => [960 + FB * lat / d, 540 + FB * (HC - h) / d];
  const B = { wall: 1.40, seatFront: 0.86, seatBack: 1.32, seat: 0.43, sill: 0.86, winTop: 1.90, ceil: 2.38, end: 20,
              benches: [[2.0, 7.4], [8.9, 14.3], [15.8, 19.9]], doors: [[7.5, 8.8], [14.4, 15.7]], bar: [0.80, 1.96],
              disp: { d: 7.0, w: 1.6, h0: 2.02, h1: 2.36 }, rinD: 3.2 };   // the display hangs high and a size smaller: it sat on her bow
  const ROWG = { L: { x0: 0, s: 1536 / 900 }, R: { x0: 1020, s: 1536 / 900 } };
  // lights outside, on the window planes, streaming from far to near (the camera faces the way the train goes)
  const BLIGHTS = (() => { const r = rng(2020), out = []; for (let i = 0; i < 80; i++) out.push([r() < 0.5 ? -1 : 1, r() * 26, 0.95 + r() * 0.85, 0.6 + r() * 1.6]); return out; })();
  const POLES = [K(299), K(303), K(307)];
  function windowQuads(side) {
    const out = [], L = B.wall * side;
    for (const [d0, d1] of B.benches) {
      const mid = (d0 + d1) / 2;
      for (const [a, b] of [[d0 + 0.08, mid - 0.06], [mid + 0.06, d1 - 0.08]]) out.push({ a, b, h0: B.sill, h1: B.winTop, L });
    }
    for (const [d0, d1] of B.doors) for (const [a, b] of [[d0 + 0.1, (d0 + d1) / 2 - 0.12], [(d0 + d1) / 2 + 0.12, d1 - 0.1]]) out.push({ a, b, h0: 0.98, h1: 1.80, L });
    return out;
  }
  const quad = (L, a, b, h0, h1) => [PJ(L, h0, a), PJ(L, h1, a), PJ(L, h1, b), PJ(L, h0, b)];
  // one strap: the belt wraps the bar, hangs 24 cm, a ring handle 14 cm across; it leans about the bar
  function strap(ctx, x, y, s, deg) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-deg * Math.PI / 180);
    const bw = 0.03 * s, bl = 0.24 * s, r = 0.07 * s, lw = Math.max(1, 0.005 * s);
    ctx.fillStyle = BELT; ctx.fillRect(-bw / 2, -0.012 * s, bw, bl + 0.012 * s);
    ctx.fillStyle = rgba(PAPER_RGB, 0.25); ctx.fillRect(-bw / 2 + lw, 0.01 * s, bw * 0.28, bl - 0.02 * s);
    ctx.strokeStyle = LINE; ctx.lineWidth = lw; ctx.strokeRect(-bw / 2, -0.012 * s, bw, bl + 0.012 * s);
    // the loop round the bar and the clamp above the ring
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.ellipse(0, -0.004 * s, bw * 0.72, 0.016 * s, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = PAPER; ctx.fillRect(-bw * 0.62, bl - 0.03 * s, bw * 1.24, 0.034 * s); ctx.strokeRect(-bw * 0.62, bl - 0.03 * s, bw * 1.24, 0.034 * s);
    ctx.beginPath(); ctx.arc(0, bl + r, r, 0, 7); ctx.lineWidth = 0.02 * s; ctx.strokeStyle = LINE; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, bl + r, r, 0, 7); ctx.lineWidth = Math.max(0.6, 0.02 * s - 2.5 * lw); ctx.strokeStyle = PAPER; ctx.stroke();
    ctx.restore();
  }
  function drawS1(ctx, tt) {
    const t = tt - T295;
    ctx.fillStyle = PAPER; ctx.fillRect(-50, -50, W + 100, 1180);
    // windows (the night does not jolt)
    for (const sd of [-1, 1]) for (const w of windowQuads(sd)) {
      const Q = quad(w.L, w.a, w.b, w.h0, w.h1);
      ctx.save(); poly(ctx, Q); ctx.fillStyle = NIGHT; ctx.fill(); ctx.fillStyle = screen(ctx, 0.25, 5); ctx.fill(); ctx.clip();
      fillPoly(ctx, [PJ(w.L, w.h0, w.a), PJ(w.L, w.h0 + 0.42, w.a), PJ(w.L, w.h0 + 0.42, w.b), PJ(w.L, w.h0, w.b)], { fill: NIGHT_FAR, stroke: null });
      for (const [s, z0, h, len] of BLIGHTS) { if (s !== sd) continue; const d = ((z0 - 15 * t) % 26 + 26) % 26 + 2.2; if (d < w.a - 0.5 || d > w.b + 0.6) continue;
        const [x0, y0] = PJ(w.L, h, d), [x1, y1] = PJ(w.L, h, d + len * 0.45), th = Math.max(1.5, FB * 0.012 / d);
        ctx.strokeStyle = rgba(PAPER_RGB, 0.6); ctx.lineWidth = th; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
      for (const tp of POLES) { const u = (tt - tp) / 0.30; if (u < 0 || u > 1) continue; const d = 20 - u * 18;
        if (d < w.a - 0.2 || d > w.b + 0.2) continue; const [px0, py0] = PJ(w.L, w.h0 - 0.1, d), [, py1] = PJ(w.L, w.h1 + 0.1, d), pw = FB * 0.14 / d;
        ctx.fillStyle = mix(GRAPHITE, TEAL, 0.06); ctx.fillRect(px0 - pw / 2, py1, pw, py0 - py1); }
      ctx.restore();
    }
    ctx.save();
    const ND = 2.0, FD = B.end;
    const E = (lat, h) => PJ(lat, h, FD);
    fillPoly(ctx, [E(-B.wall, 0), E(-B.wall, B.ceil), E(B.wall, B.ceil), E(B.wall, 0)], { fill: PAPER, scr: [0.1, 5], w: 1.6, stroke: LINE });
    fillPoly(ctx, [E(-0.4, 0), E(-0.4, 1.9), E(0.4, 1.9), E(0.4, 0)], { fill: PAPER, w: 1.4, stroke: LINE });
    fillPoly(ctx, [E(-0.3, 1.0), E(-0.3, 1.75), E(0.3, 1.75), E(0.3, 1.0)], { fill: NIGHT, w: 1.4, stroke: LINE });
    fillPoly(ctx, [PJ(-B.wall, B.ceil, ND), PJ(B.wall, B.ceil, ND), E(B.wall, B.ceil), E(-B.wall, B.ceil)], { fill: PAPER, scr: [0.12, 5], stroke: null });
    fillPoly(ctx, [PJ(-B.seatFront, 0, ND), PJ(B.seatFront, 0, ND), E(B.seatFront, 0), E(-B.seatFront, 0)], { fill: PAPER, scr: [0.18, 5], stroke: null });
    for (const lat of [-0.45, 0, 0.45]) line(ctx, [PJ(lat, 0, ND), E(lat, 0)], 1.2, rgba(TEAL_RGB, 0.5));
    for (const lat of [-0.48, 0.48]) for (let d = 2.6; d < 19.5; d += 1.8) fillPoly(ctx, [PJ(lat - 0.09, B.ceil, d), PJ(lat + 0.09, B.ceil, d), PJ(lat + 0.09, B.ceil, d + 1.5), PJ(lat - 0.09, B.ceil, d + 1.5)], { fill: PAPER, w: 1.4, stroke: LINE });
    for (const sd of [-1, 1]) {
      const Lw = B.wall * sd, Lf = B.seatFront * sd, Lb = B.seatBack * sd;
      fillPoly(ctx, [PJ(Lw, B.winTop, ND), PJ(Lw, B.ceil, ND), PJ(Lw, B.ceil, FD), PJ(Lw, B.winTop, FD)], { fill: PAPER, stroke: null });
      fillPoly(ctx, [PJ(Lw, B.winTop + 0.06, ND), PJ(Lw, B.winTop + 0.34, ND), PJ(Lw, B.winTop + 0.34, FD), PJ(Lw, B.winTop + 0.06, FD)], { fill: PAPER, scr: [0.14, 5], w: 1.2, stroke: LINE });
      line(ctx, [PJ(Lw, B.ceil, ND), PJ(Lw, B.ceil, FD)], 2, LINE);
      for (const w of windowQuads(sd)) { const Q = quad(w.L, w.a, w.b, w.h0, w.h1); poly(ctx, Q); ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.stroke(); }
      for (const [a, b] of B.benches) {
        const mid = (a + b) / 2;
        for (const [p0, p1] of [[a, a + 0.08], [mid - 0.06, mid + 0.06], [b - 0.08, b]]) fillPoly(ctx, [PJ(Lw, B.sill, p0), PJ(Lw, B.winTop, p0), PJ(Lw, B.winTop, p1), PJ(Lw, B.sill, p1)], { fill: PAPER, stroke: null });
      }
      for (const [a, b] of B.doors) {
        const m = (a + b) / 2;
        fillPoly(ctx, [PJ(Lw, 0, a), PJ(Lw, 1.86, a), PJ(Lw, 1.86, b), PJ(Lw, 0, b)], { fill: null, stroke: LINE, w: 2.2 });
        for (const [p0, p1, w0, w1] of [[a, m, a + 0.1, m - 0.12], [m, b, m + 0.12, b - 0.1]]) {
          ctx.beginPath(); [PJ(Lw, 0, p0), PJ(Lw, 1.86, p0), PJ(Lw, 1.86, p1), PJ(Lw, 0, p1)].forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
          ctx.closePath(); quad(Lw, w0, w1, 0.98, 1.80).slice().reverse().forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
          ctx.fillStyle = PAPER; ctx.fill('evenodd'); ctx.fillStyle = screen(ctx, 0.14, 5); ctx.fill('evenodd');
        }
        line(ctx, [PJ(Lw, 0, m), PJ(Lw, 1.86, m)], 2, LINE);
        fillPoly(ctx, [PJ(Lw, 1.88, a), PJ(Lw, 2.12, a), PJ(Lw, 2.12, b), PJ(Lw, 1.88, b)], { fill: PAPER, w: 1.6, stroke: LINE });
      }
      for (const [a, b] of B.benches) {
        fillPoly(ctx, [PJ(Lw, 0.06, a), PJ(Lw, B.sill, a), PJ(Lw, B.sill, b), PJ(Lw, 0.06, b)], { fill: PAPER, stroke: null });
        fillPoly(ctx, [PJ(Lb, B.seat, a), PJ(Lb, 0.86, a), PJ(Lb, 0.86, b), PJ(Lb, B.seat, b)], { scr: [0.3, 5], w: 1.6, stroke: LINE });
        fillPoly(ctx, [PJ(Lb, B.seat, a), PJ(Lf, B.seat, a), PJ(Lf, B.seat, b), PJ(Lb, B.seat, b)], { scr: [0.4, 5], w: 1.6, stroke: LINE });
        fillPoly(ctx, [PJ(Lf, B.seat, a), PJ(Lf, 0.06, a), PJ(Lf, 0.06, b), PJ(Lf, B.seat, b)], { fill: PAPER, scr: [0.12, 5], w: 1.6, stroke: LINE });
        // the bench's end screens (the panel at each end of a seat run, by the doors) and the grab poles
        for (const d of [a, b]) { if (d < 3) continue;
          fillPoly(ctx, [PJ(Lb, 0.43, d), PJ(Lb, 1.02, d), PJ(Lf, 1.02, d), PJ(Lf, 0.43, d)], { fill: PAPER, scr: [0.22, 5], w: 1.6, stroke: LINE });
          const [x0, y0] = PJ(Lf, 0, d), [, y1] = PJ(Lf, B.ceil, d), pw = Math.max(2, FB * 0.032 / d);
          ctx.fillStyle = PAPER; ctx.fillRect(x0 - pw / 2, y1, pw, y0 - y1); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.strokeRect(x0 - pw / 2, y1, pw, y0 - y1); }
      }
    }
    // the two strap bars and the straps (far to near), all leaning together
    const deg = lean(tt);
    for (const sd of [-1, 1]) { line(ctx, [PJ(B.bar[0] * sd, B.bar[1], ND), PJ(B.bar[0] * sd, B.bar[1], FD)], 5, LINE); line(ctx, [PJ(B.bar[0] * sd, B.bar[1], ND), PJ(B.bar[0] * sd, B.bar[1], FD)], 2, PAPER); }
    const ds = []; for (const [a, b] of B.benches) for (let d = a + 0.2; d < b - 0.1; d += 0.42) ds.push(d);
    ds.sort((p, q2) => q2 - p);
    for (const d of ds) for (const sd of [-1, 1]) { const [x, y] = PJ(B.bar[0] * sd, B.bar[1], d); if (x < -120 || x > W + 120) continue; strap(ctx, x, y, FB / d, deg); }
    dispS1(ctx, tt);
    for (const s of ['L', 'R']) { const im = imOf(`row${s}`, tt), G = ROWG[s]; ctx.drawImage(im, G.x0, 480, im.width / G.s, im.height / G.s); }
    { const h = S.at('rin', tt), name = h.file.split('/').pop().replace('.png', ''), [sx, sy] = PJ(0, 0, B.rinD);
      drawImageAt(ctx, placement({ x: sx, y: sy, s: (FB / B.rinD) / DOOR.pxm, origin: partOf(PA, name, 'soles').point }), imOf('rin', tt)); }
    ctx.restore();
  }
  // the hanging display: 1.8 m x 0.42 m at 7 m, two rows, each row at its final place from its first letter (no reflow);
  // 句26 いつまで経ったって／僕達は, 句27 ぞんざいな催眠に／酔っていて; wiped in one frame on k303
  const DP = B.disp, [DX0, DY0] = PJ(-DP.w / 2, DP.h1, DP.d), [DX1, DY1] = PJ(DP.w / 2, DP.h0, DP.d);
  const KB = 4.0, ADVB = 16 * KB * 0.98;
  const rowsB = (chars, cut) => [chars.slice(0, cut), chars.slice(cut)].flatMap((row, ri) => row.map(([c, t], i) => ({ c, t,
    x: (DX0 + DX1) / 2 + (i - (row.length - 1) / 2) * ADVB, y: DY0 + (DY1 - DY0) * (ri === 0 ? 0.285 : 0.735) })));
  const PB26 = rowsB(L26, 9), PB27 = rowsB(L27, 8);
  function dispS1(ctx, tt) {
    for (const lat of [-0.7, 0.7]) line(ctx, [PJ(lat, B.ceil, DP.d), PJ(lat, DP.h1, DP.d)], 2.4, LINE);
    const pad = 9; fillPoly(ctx, [[DX0 - pad, DY0 - pad], [DX1 + pad, DY0 - pad], [DX1 + pad, DY1 + pad], [DX0 - pad, DY1 + pad]], { fill: PAPER, scr: [0.5, 5], w: 2.2, stroke: LINE });
    fillPoly(ctx, [[DX0, DY0], [DX1, DY0], [DX1, DY1], [DX0, DY1]], { fill: PAPER, w: 1.6, stroke: LINE });
    cellGrid(ctx, DX0 + 6, DY0 + 6, DX1 - 6, DY1 - 6, 9);
    const list = tt < T303 ? PB26 : PB27;
    list.forEach((p, i) => dotChar(ctx, p.c, p.x, p.y, KB, tt - p.t, 3100 + i + (tt < T303 ? 0 : 40)));
  }
  // the slow push eases to a stop on k307 (1.00 -> 1.28); on k307 the 大击: 3% in two frames, one way, no overshoot, then
  // the frame holds still to the cut (1.318, the old end framing)
  const S1_F0 = [1, [960, 540]], S1_F1 = [1.28, [960, 470]], S1_TGT = [960, 470], STEP307 = 0.03;
  function camS1(tt) {
    const e = smooth((Math.min(tt, T307) - T295) / (T307 - T295));
    const [z, fx, fy] = camLerp(S1_F0[0], S1_F0[1], S1_F1[0], S1_F1[1], e, S1_TGT);
    const u = Math.min(1, Math.max(0, (tt - T307 + 0.5 / 30) / (2 / 30)));       // reaches the step on the 2nd frame
    return [z * (1 + STEP307 * u * (2 - u)), fx, fy];
  }

  // ======================================================================================================================
  // S2: over her shoulder at the door glass. Screen px; static camera. The glass fills the left of the frame (x < 1320, y > 54);
  // the reflection is a mirror of r10g_refl, darker and cooler, laid on the night by screen blending, with the bench opposite
  // (p10f_opp, mirrored, darker still, 36% of her size) behind it; her real head (r10g_back) on the right.
  // ======================================================================================================================
  const GL = { x0: -10, x1: 1300, y0: 52, y1: 1090 };
  const CITY = (() => {
    const r = rng(1011), far = [], mid = [], lights = [];
    for (let x = 0; x < 6000;) { const w = 40 + r() * 120, hh = 40 + r() * 160; far.push([x, w, hh, r() < 0.25 ? 14 + r() * 28 : 0]); x += w; }
    for (let x = 0; x < 6000;) {
      const w = 80 + r() * 190, hh = 60 + r() * 260, wins = [], cols = Math.max(2, Math.floor(w / 20)), rows = Math.max(1, Math.floor(hh / 18));
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (r() < 0.18) wins.push([6 + i * (w - 12) / cols, 10 + j * 18]);
      mid.push([x, w, hh, wins]); x += w + 14 + r() * 120;
    }
    for (let i = 0; i < 90; i++) lights.push([r() * 6000, 380 + r() * 520, 40 + r() * 120, r()]);
    return { far, mid, lights };
  })();
  // distance travelled (s at full speed); the train brakes k320 -> k322 (speed 1 -> 0, eased out)
  function travel(tt) {
    const a = Math.min(tt, T320) - T311; if (tt <= T320) return a;
    const D = T322 - T320, u = Math.min(1, (tt - T320) / D);
    return a + D * (u - u * u * u + u * u * u * u / 2);        // integral of 1 - smooth(u) = u - u^3 + u^4/2
  }
  const PILLAR_STOP = 250, TRAVEL_END = travel(T322);
  const wrapX = (x, span = 6000) => ((x % span) + span) % span;
  function nightBase(ctx) {
    ctx.fillStyle = NIGHT; ctx.fillRect(GL.x0, GL.y0, GL.x1 - GL.x0, GL.y1 - GL.y0);
    ctx.fillStyle = screen(ctx, 0.22, 5); ctx.fillRect(GL.x0, GL.y0, GL.x1 - GL.x0, GL.y1 - GL.y0);
  }
  // the city behind the glass (buildings and lit windows); drawn on its own layer so it can be thinned under her face
  function nightS2(ctx, tt) {
    const t = travel(tt);
    const base = 900;
    ctx.fillStyle = NIGHT_FAR;
    for (const [bx, w, hh, ant] of CITY.far) { const x = wrapX(bx + 70 * t) - 1500; if (x + w < GL.x0 || x > GL.x1) continue;
      ctx.fillRect(1300 - x - w, base - 260 - hh, w + 0.5, hh + 400); if (ant) ctx.fillRect(1300 - x - w / 2, base - 260 - hh - ant, 2, ant); }
    for (const [bx, w, hh, wins] of CITY.mid) { const x = wrapX(bx + 520 * t) - 1500; if (x + w < GL.x0 - 300 || x > GL.x1 + 300) continue;
      const X0 = 1300 - x - w;
      ctx.fillStyle = NIGHT_MID; ctx.fillRect(X0, base - 120 - hh, w, hh + 300);
      ctx.fillStyle = rgba(PAPER_RGB, 0.8); for (const [wx, wy] of wins) ctx.fillRect(X0 + wx, base - 120 - hh + wy, 9, 7); }
  }
  // the city's lights passing close (screen): long soft streaks, few of them, with soft ends (short hard dashes read as scan
  // lines); from k312 there are more and they are brighter
  // t0 (the snare), x0 (centre at t0, screen px), v (px per second of travel), w (core width), a (core alpha), wash (the
  // glass lift on the snare's frame: kept small, B is the quietest part and gets no flash), life (s)
  // x0 is just left of her real head (hair edge about x 1010-1080), so the lamp is seen on the snare's frame itself; it comes
  // out from behind her head (before the snare it is not drawn at all, so nothing shows early)
  const LAMPS = [{ t0: T315, x0: 960, v: 3200, w: 80, a: 0.36, wash: 0.06, life: 0.42 },
                 { t0: T319, x0: 950, v: 2500, w: 120, a: 0.46, wash: 0.08, life: 0.55 }];
  const STREAKS = (() => { const r = rng(1012), out = []; for (let i = 0; i < 26; i++) out.push([r() * 6000, 330 + r() * 600, 260 + r() * 360, r()]); return out; })();
  function lightsS2(ctx, tt) {
    const t = travel(tt), dense = tt >= T312, brake = tt < T320 ? 1 : 1 - 0.85 * smooth((tt - T320) / (T322 - T320));
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.lineCap = 'round';
    STREAKS.forEach(([lx, ly, len, r], i) => {
      if (!dense && i % 2) return;
      const L = len * brake + 12, x = 1300 - (wrapX(lx + 1500 * t) - 1500); if (x + L < GL.x0 || x > GL.x1) return;
      const a = dense ? 0.26 + 0.16 * r : 0.2, gr = ctx.createLinearGradient(x, 0, x + L, 0);
      gr.addColorStop(0, rgba(PAPER_RGB, 0)); gr.addColorStop(0.3, rgba(PAPER_RGB, a)); gr.addColorStop(0.75, rgba(PAPER_RGB, a)); gr.addColorStop(1, rgba(PAPER_RGB, 0));
      ctx.strokeStyle = gr; ctx.lineWidth = dense ? 7 : 5; ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x + L, ly); ctx.stroke();
    });
    // the snares on beat 4 (k315, k319): a lamp close to the track sweeps the glass right to left (2026-11-21, user: the
    // picture should go with the song's rhythm). It is there, whole, on the snare's frame (no fade-in), and the glass lifts
    // once with it; it travels with the train (so it slows with the brake). k319's is the wide one that crosses her face.
    for (const L of LAMPS) {
      const d = tt - L.t0; if (d < 0 || d > L.life) continue;
      const x = L.x0 - L.v * (t - travel(L.t0)), a = L.a * (1 - smooth((d - L.life + 0.2) / 0.2)), w = L.w;
      ctx.fillStyle = rgba(PAPER_RGB, L.wash * Math.exp(-d / 0.10)); ctx.fillRect(GL.x0, GL.y0, GL.x1 - GL.x0, GL.y1 - GL.y0);
      const gr = ctx.createLinearGradient(x - 2.6 * w, 0, x + 2.6 * w, 0);
      gr.addColorStop(0, rgba(PAPER_RGB, 0)); gr.addColorStop(0.5, rgba(PAPER_RGB, a * 0.32)); gr.addColorStop(1, rgba(PAPER_RGB, 0));
      ctx.fillStyle = gr; poly(ctx, [[x - 2.6 * w + 60, GL.y0], [x + 2.6 * w + 60, GL.y0], [x + 2.6 * w - 60, GL.y1], [x - 2.6 * w - 60, GL.y1]]); ctx.fill();
      ctx.fillStyle = rgba(PAPER_RGB, a); poly(ctx, [[x - w / 2 + 60, GL.y0], [x + w / 2 + 60, GL.y0], [x + w / 2 - 60, GL.y1], [x - w / 2 - 60, GL.y1]]); ctx.fill();
    }
    ctx.restore();
    // the platform: a pillar and a lamp come in with the braking and stop in the glass on k322
    const px = PILLAR_STOP + (TRAVEL_END - t) * 1500;                 // comes in from the right like the city, stops on k322
    if (px > GL.x0 - 200 && px < GL.x1 + 50) {
      ctx.fillStyle = mix(GRAPHITE, TEAL, 0.08); ctx.fillRect(px, GL.y0, 110, GL.y1 - GL.y0);
      ctx.fillStyle = screen(ctx, 0.3, 5, PAPER_RGB); ctx.fillRect(px + 84, GL.y0, 14, GL.y1 - GL.y0);
      ctx.fillStyle = PAPER; ctx.fillRect(px + 130, 150, 150, 22); ctx.fillStyle = mix(GRAPHITE, TEAL, 0.08); ctx.fillRect(px + 110, 158, 24, 8);
    }
  }
  const tintCache = new Map();
  function tinted(im, bright, teal) {
    const key = [im, bright, teal]; for (const [k, v] of tintCache) if (k[0] === im && k[1] === bright && k[2] === teal) return v;
    const [c, x] = mk(im.width, im.height); x.filter = `saturate(0.5) brightness(${bright})`; x.drawImage(im, 0, 0); x.filter = 'none';
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = rgba(TEAL_RGB, teal); x.fillRect(0, 0, c.width, c.height);
    tintCache.set(key, c); return c;
  }
  // her reflection: image scale and where its bounding box goes (mirrored about its own centre)
  // about three quarters of her real head's size: the lens is long and stands well back from her, so the reflection (1.6 m
  // away) is not much smaller than her head (1 m away); the eyes stay where they were
  const REFL = { s: 0.74, cx: 610, top: 160 };
  const OPP = { s: 0.46, cx: 300, bottom: 1046 };
  const [RC, RX] = mk(W, 1080);
  function reflectionS2(ctx, tt) {
    RX.setTransform(1, 0, 0, 1, 0, 0); RX.clearRect(0, 0, W, 1080);
    { const im = tinted(IM.opp, 0.55, 0.38), b = BB.opp, s = OPP.s, wB = (b.x1 - b.x0) * s;
      RX.save(); RX.translate(OPP.cx + wB / 2, OPP.bottom - b.y1 * s); RX.scale(-s, s); RX.drawImage(im, -b.x0, 0); RX.restore(); }
    { const im = tinted(imOf('refl', tt), 0.78, 0.26), b = BB.refl, s = REFL.s, wB = (b.x1 - b.x0) * s;
      RX.save(); RX.translate(REFL.cx + wB / 2, REFL.top - b.y0 * s); RX.scale(-s, s); RX.drawImage(im, -b.x0, 0); RX.restore(); }
  }
  // a reflection in night glass: laid over the night (normal, half strength) and brightened where it is light (screen),
  // so the face reads whole and the city still shows through the dark parts
  function laReflection(ctx) { ctx.save(); ctx.globalAlpha = 0.5; ctx.drawImage(RC, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.55; ctx.drawImage(RC, 0, 0); ctx.restore(); }
  const [NC, NX] = mk(W, 1080);
  function doorFrameS2(ctx) {
    // the door around the glass: the top rail, the rubber seal and the leaf to the right (paper with a light screen)
    ctx.fillStyle = PAPER; ctx.fillRect(GL.x1, -10, W - GL.x1 + 10, 1100); ctx.fillRect(-10, -10, GL.x1 + 20, GL.y0 + 10);
    ctx.fillStyle = screen(ctx, 0.14, 5); ctx.fillRect(GL.x1, -10, W - GL.x1 + 10, 1100); ctx.fillRect(-10, -10, GL.x1 + 20, GL.y0 + 10);
    ctx.fillStyle = LINE; ctx.fillRect(GL.x1, GL.y0 - 6, 22, 1100); ctx.fillRect(-10, GL.y0 - 6, GL.x1 + 30, 12);
    ctx.fillStyle = PAPER; ctx.fillRect(GL.x1 + 5, GL.y0 + 6, 5, 1100);
    line(ctx, [[GL.x1 + 60, -10], [GL.x1 + 60, 1100]], 2, LINE);
  }
  // the paper tag (荷札) on her bag, close to the lens: local px 700 x 320, printed in teal, her pencil. Its string hole is
  // at the RIGHT end (local 662, 160), tied to the handle at the top of the bag beside her right shoulder, so the tag hangs
  // from the bag and lies against her shoulder (the string is short and visible), not over her hair.
  const TAG = { w: 700, h: 320, hx: 662, x: 1690, y: 770, rot: -0.22, s: 0.9 };   // hangs from its hole: the free end drops
  const TAGROW = { r1: [124, 108, 440, 54], r2: [124, 170, 440, 54], box: [124, 228, 150, 86], r3: [288, 244, 270, 54] };
  const PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
  const tagTex = (() => {
    const [c, x] = mk(TAG.w, TAG.h);
    x.fillStyle = PAPER_CARD; poly(x, [[0, 0], [TAG.w - 30, 0], [TAG.w, 30], [TAG.w, TAG.h - 30], [TAG.w - 30, TAG.h], [0, TAG.h]]); x.fill();
    const r = rng(1031); for (let i = 0; i < 260; i++) { x.fillStyle = rgba(INK_RGB, 0.015 + r() * 0.02); x.fillRect(r() * TAG.w, r() * TAG.h, 6 + r() * 20, 1); }
    x.strokeStyle = TEAL; x.lineWidth = 2.5; x.strokeRect(16, 14, 554, TAG.h - 28);
    // reinforcement ring and hole
    x.fillStyle = mix(TEAL, '#f7f5ef', 0.55); x.beginPath(); x.arc(TAG.hx, TAG.h / 2, 24, 0, 7); x.fill();
    x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(TAG.hx, TAG.h / 2, 11, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over';
    const label = (txt, x0, y0, w, h) => { x.fillStyle = TEAL; x.fillRect(x0, y0, w, h); const D = dots16(txt, 1.45, 1032 + txt.length, PAPER_RGB); x.drawImage(D.c, D.x0, D.y0, D.w, D.h, x0 + (w - D.w) / 2, y0 + (h - D.h) / 2, D.w, D.h); };
    label('なまえ', 26, 24, 82, 34); label('なかみ', 26, 92, 82, 34);
    x.fillStyle = TEAL;
    const dotted = (y, x0, x1) => { for (let xx = x0; xx < x1; xx += 9) { x.beginPath(); x.arc(xx, y, 1.6, 0, 7); x.fill(); } };
    dotted(70, 122, 560); line(x, [[16, 82], [570, 82]], 2, TEAL);
    dotted(TAGROW.r1[1] + 54, 122, 560); dotted(TAGROW.r2[1] + 54, 122, 560); dotted(TAGROW.r3[1] + 56, 286, 560);
    const [bx, by, bw, bh] = TAGROW.box; x.strokeStyle = TEAL; x.lineWidth = 2.5; x.strokeRect(bx, by, bw, bh);
    // her name, written before (the same hand as everywhere)
    [...'鏡音リン'].forEach((ch, i) => PEN.char(x, ch, 142 + i * 50, 48, 44, 1));
    return c;
  })();
  const R1 = L28.slice(0, 8), R2 = L28.slice(8, 12), BOXW = L28.slice(12, 14), R3 = L28.slice(14);
  function tagS2(ctx, tt) {
    // a swing: the jolts (k315, k319) and the brake (k320 forward and back)
    let a = TAG.rot;
    for (const t0 of BUMPS2) { const d = tt - t0; if (d >= 0 && d < 1.2) a += 0.05 * Math.exp(-d / 0.3) * Math.sin(2 * Math.PI * d / 0.6); }
    if (tt >= T320) { const d = tt - T320; a += 0.09 * Math.sin(Math.PI * Math.min(1, d / 0.7)) * Math.exp(-Math.max(0, d - 0.7) / 0.5); }
    const sx = TAG.x, sy = TAG.y;
    // the bag's carry handle (a webbing loop at the top of the bag) and the tag's cotton cord looped through it and the hole
    const [hx, hy] = BAGTOP;
    ctx.save(); ctx.lineCap = 'round';
    // the loop's feet are measured on r10g_back (on the drawn bag top), through the drawing's own placement
    const [[ax, ay], [bx, by]] = HANDLE.base.map(BACKP.toWorld);
    const loop = c => { c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(hx, hy - 44 * BACKP.s, bx, by); };
    ctx.strokeStyle = GRAPHITE; ctx.lineWidth = 15; loop(ctx); ctx.stroke();
    ctx.strokeStyle = mix(GRAPHITE, PAPER, 0.4); ctx.lineWidth = 9; loop(ctx); ctx.stroke();
    for (const o of [-6, 6]) {
      const cord = c => { c.beginPath(); c.moveTo(hx + o, hy - 12); c.quadraticCurveTo((hx + sx) / 2 + o, Math.max(hy, sy) + 16, sx + o * 0.3, sy); };
      ctx.strokeStyle = rgba(INK_RGB, 0.75); ctx.lineWidth = 5.5; cord(ctx); ctx.stroke();
      ctx.strokeStyle = PAPER_CARD; ctx.lineWidth = 3; cord(ctx); ctx.stroke();
    }
    ctx.restore();
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(a); ctx.scale(TAG.s, TAG.s); ctx.translate(-TAG.hx, -TAG.h / 2);
    ctx.fillStyle = rgba(INK_RGB, 0.18); ctx.fillRect(-10, 14, TAG.w, TAG.h);
    ctx.drawImage(tagTex, 0, 0);
    PEN.line(ctx, R1, TAGROW.r1, tt, 52); PEN.line(ctx, R2, [TAGROW.r2[0], TAGROW.r2[1], 4 * 54, TAGROW.r2[3]], tt, 52);
    PEN.line(ctx, BOXW, [TAGROW.box[0] + 6, TAGROW.box[1] + 4, TAGROW.box[2] - 12, TAGROW.box[3] - 8], tt, 70);
    PEN.line(ctx, R3, [TAGROW.r3[0], TAGROW.r3[1], 4 * 54, TAGROW.r3[3]], tt, 52);
    ctx.restore();
  }
  // her real head: right of the frame, cut by the right edge (she is 60 cm from the lens); the top of her bag beside her
  // right shoulder (r10g_back px 820, 760) is where the tag's string goes
  const BACK = { s: 1.0, cx: 1450, top: 60 };
  const BACKP = placement({ x: BACK.cx - (BB.back.x0 + BB.back.x1) / 2 * BACK.s, y: BACK.top - BB.back.y0 * BACK.s, s: BACK.s });
  const HANDLE = partOf(PA, 'r10g_back', 'handle'), BAGTOP = BACKP.toWorld(HANDLE.point);
  function drawS2(ctx, tt) {
    ctx.save(); ctx.beginPath(); ctx.rect(GL.x0, GL.y0, GL.x1 - GL.x0, GL.y1 - GL.y0); ctx.clip();
    nightBase(ctx); reflectionS2(ctx, tt);
    // the buildings and their lit windows are thinned where her reflection is (they made blotches on her eyes and cheeks)
    NX.globalCompositeOperation = 'source-over'; NX.globalAlpha = 1; NX.clearRect(0, 0, W, 1080); nightS2(NX, tt);
    NX.globalCompositeOperation = 'destination-out'; NX.globalAlpha = 0.72; NX.drawImage(RC, 0, 0); NX.globalCompositeOperation = 'source-over'; NX.globalAlpha = 1;
    ctx.drawImage(NC, 0, 0); laReflection(ctx); lightsS2(ctx, tt);
    ctx.restore();
    doorFrameS2(ctx);
    drawImageAt(ctx, BACKP, IM.back);
    tagS2(ctx, tt);
  }

  // ======================================================================================================================
  // S3: the coin lockers, front on, level, long lens (camera 1.1 m high, 7 m from the wall). The bank IS the set pack's
  // drawing (art/canon/coin_lockers_front.png: the コインロッカー plate, hinges, keys on their tags, the numbers), 1.05x;
  // the next bank starts at the right edge (only its blank side panel and the hinge side of its door 1 show, no number).
  // Every door hangs on its LEFT hinges, so her tall door 22 opens toward us on the left and she stands to its LEFT and
  // pushes its outer face. The door steps with her three drawings, so her hand is always on its free edge:
  //   k322 (the cut, the train has stopped) wide open: her gig bag stands inside, its tag (なかみ: 驕傲) out;
  //   k323.5 half shut (r10g_lockm); k324 shut, her palm flat on it, and the whole door is pencil black with 使用中 down it
  //   in white dots: one filled cell in a white answer sheet. From k324.25 nothing moves but her pencil.
  // ======================================================================================================================
  const LKC = { s: 1.05, x: 2, y: -12 };                                      // canon px -> screen
  const LKX = cx => LKC.x + cx * LKC.s, LKY = cy => LKC.y + cy * LKC.s;
  const LK = { hinge: LKX(1264), right: LKX(1466), top: LKY(361), bot: LKY(909),   // door 22's outer border (hinges on the left)
               face: [1267, 364, 1464, 906], pxm: 468 * 1.05, w: 0.43,          // its face in canon px; 491 px per metre at the wall
               next: 1600, floorY: LKY(962), side: [LKX(61), LKY(166), LKX(230), LKY(906)] };
  const CAM3 = { D: 7.0, vx: 960, hz: LK.floorY - 1.1 * LK.pxm };              // the vanishing point: camera 1.1 m high
  // a point drawn on the wall plane at (x, y), moved z metres toward the camera (z < 0: behind the wall)
  const PR = (x, y, z) => { const f = CAM3.D / (CAM3.D - z); return [CAM3.vx + (x - CAM3.vx) * f, CAM3.hz + (y - CAM3.hz) * f]; };
  // her drawings (r10g_lock / lockm / lockb: 898 px per metre; the soles measured on each, seg10_parts.json), standing 0.35 m
  // from the wall
  const RIN3 = { z: 0.35, spine: 1232, pxm: 898 };
  RIN3.s = LK.pxm * CAM3.D / (CAM3.D - RIN3.z) / RIN3.pxm;
  RIN3.soles = PR(0, LK.floorY, RIN3.z)[1];
  const DOOR_A = { lock: 85, lockm: 62 };                                      // set so the free edge passes through her hand
  const doorAngle = tt => tt < T3235 ? DOOR_A.lock : tt < T324 ? DOOR_A.lockm : 0;
  const LOCKERS = IM.lockers;
  // door 22's face, cut once from the canon drawing (the texture of the swinging door)
  const DOOR_TEX = (() => { const [x0, y0, x1, y1] = LK.face, [c, x] = mk(x1 - x0, y1 - y0); x.drawImage(LOCKERS, -x0, -y0); return c; })();
  // the pencil-black cell: the whole face filled the way a hand fills a bubble, hard: graphite strokes on a slant laid
  // twice across, a few running a hair past the edge, the sheen of graphite; 使用中 down it in white 16-dot print
  const BLACK = (() => {
    const [fx0, fy0, fx1, fy1] = LK.face, x0 = LKX(fx0) + 1, y0 = LKY(fy0) + 1, w = (fx1 - fx0) * LKC.s - 2, h = (fy1 - fy0) * LKC.s - 2;
    const pad = 8, [c, x] = mk(w + 2 * pad, h + 2 * pad), r = rng(1310);
    x.save(); x.translate(pad, pad);
    x.beginPath(); x.rect(-1, -1, w + 2, h + 2); x.clip();
    x.fillStyle = GRAPHITE_FIELD; x.fillRect(-1, -1, w + 2, h + 2);
    x.lineCap = 'round';
    for (const [ang, n, rgbA, a0] of [[-0.42, 900, GRAPHITE_LIGHT_RGB, 0.20], [0.55, 700, GRAPHITE_DARK_RGB, 0.30], [-0.42, 260, REHATCH_LIGHT_RGB, 0.10]]) {
      for (let i = 0; i < n; i++) {
        const cx = r() * w, cy = r() * h, L = 30 + r() * 90, dx = Math.cos(ang) * L / 2, dy = Math.sin(ang) * L / 2;
        x.strokeStyle = rgba(rgbA, a0 * (0.5 + r())); x.lineWidth = 1.5 + r() * 3; x.beginPath(); x.moveTo(cx - dx, cy - dy); x.lineTo(cx + dx, cy + dy); x.stroke();
      }
    }
    x.restore();
    // a few stroke ends poking past the cell's edge (the cell was filled by hand, not printed)
    for (let i = 0; i < 14; i++) {
      const t = r(), L = 3 + r() * 4, o = r() < 0.5;
      let px, py, ex, ey;
      if (r() < 0.5) { px = pad + t * w; py = o ? pad : pad + h; ex = px + (r() - 0.5) * L; ey = py + (o ? -L : L); }
      else { px = o ? pad : pad + w; py = pad + t * h; ex = px + (o ? -L : L); ey = py + (r() - 0.5) * L; }
      x.strokeStyle = rgba(INK_RGB, 0.55 + r() * 0.3); x.lineWidth = 2 + r() * 1.5; x.beginPath(); x.moveTo(px, py); x.lineTo(ex, ey); x.stroke();
    }
    // 使用中, white dots, down the lower part of the door (her hand rests above it)
    const k = 5.6, step = 16 * k * 1.08, cxm = pad + w / 2, ytop = pad + h - 3 * step - 30;
    [...'使用中'].forEach((ch, i) => { const D = dots16(ch, k, 1320 + i, PAPER_RGB); x.drawImage(D.c, D.x0, D.y0, D.w, D.h, cxm - D.w / 2, ytop + step * (i + 0.5) - D.h / 2, D.w, D.h); });
    return { c, x: x0 - pad, y: y0 - pad, box: [x0 + w / 2 - 16 * k * 0.5, y0 - pad + ytop, 16 * k, 3 * step] };
  })();
  // the paper tag on the bag inside the locker: the S2 tag as it was left (なかみ written), hanging from the bag's side handle
  const TAG_DONE = (() => {
    const [c, x] = mk(TAG.w, TAG.h), tEnd = SEG[1]; x.drawImage(tagTex, 0, 0);
    PEN.line(x, R1, TAGROW.r1, tEnd, 52); PEN.line(x, R2, [TAGROW.r2[0], TAGROW.r2[1], 4 * 54, TAGROW.r2[3]], tEnd, 52);
    PEN.line(x, BOXW, [TAGROW.box[0] + 6, TAGROW.box[1] + 4, TAGROW.box[2] - 12, TAGROW.box[3] - 8], tEnd, 70);
    PEN.line(x, R3, [TAGROW.r3[0], TAGROW.r3[1], 4 * 54, TAGROW.r3[3]], tEnd, 52);
    return c;
  })();
  const BAG = { depth: 0.22, h: 1.05 };                                        // the bag drawing (mirrored on screen)
  // the bag's placement in the open locker (one transform for the drawing and the tag cord on its handle)
  function bagPlacement() {
    const o = [LK.hinge + 2, LK.top + 2, LK.right - 2, LK.bot - 2], b = BB.bag, f = CAM3.D / (CAM3.D + BAG.depth), s = BAG.h * LK.pxm * f / (b.y1 - b.y0);
    const [fx, fy] = PR((o[0] + o[2]) / 2 + 6, o[3] - 4, -BAG.depth);
    return placement({ x: fx + ((b.x0 + b.x1) / 2) * s, y: fy - b.y1 * s, s, flipX: true });
  }
  function interior(ctx) {
    const o = [LK.hinge + 2, LK.top + 2, LK.right - 2, LK.bot - 2], kb = -0.55;
    const B0 = PR(o[0], o[1], kb), B1 = PR(o[2], o[3], kb);
    ctx.save(); ctx.beginPath(); ctx.rect(o[0], o[1], o[2] - o[0], o[3] - o[1]); ctx.clip();
    // back wall, the far (right) side wall, the ceiling and the floor of the compartment, in teal print
    fillPoly(ctx, [[o[0], o[1]], [o[2], o[1]], [o[2], o[3]], [o[0], o[3]]], { fill: PAPER, scr: [0.42, 5], stroke: null });
    fillPoly(ctx, [[B0[0], B0[1]], [B1[0], B0[1]], [B1[0], B1[1]], [B0[0], B1[1]]], { fill: PAPER, scr: [0.30, 5], w: 1.6, stroke: LINE });
    fillPoly(ctx, [[o[2], o[1]], [o[2], o[3]], [B1[0], B1[1]], [B1[0], B0[1]]], { fill: PAPER, scr: [0.18, 5], w: 1.6, stroke: LINE });
    fillPoly(ctx, [[o[0], o[1]], [o[2], o[1]], [B1[0], B0[1]], [B0[0], B0[1]]], { fill: PAPER, scr: [0.62, 5], w: 1.6, stroke: LINE });
    fillPoly(ctx, [[o[0], o[3]], [o[2], o[3]], [B1[0], B1[1]], [B0[0], B1[1]]], { fill: PAPER, scr: [0.10, 5], w: 1.6, stroke: LINE });
    // her bag standing on the compartment floor (mirrored, so the side handle is on the open side), a contact shadow
    const b = BB.bag, im = IM.bag, f = CAM3.D / (CAM3.D + BAG.depth), s = BAG.h * LK.pxm * f / (b.y1 - b.y0);
    const [fx, fy] = PR((o[0] + o[2]) / 2 + 6, o[3] - 4, -BAG.depth);
    ctx.fillStyle = rgba(TEAL_RGB, 0.45); ctx.beginPath(); ctx.ellipse(fx, fy, (b.x1 - b.x0) * s * 0.5, 7, 0, 0, 7); ctx.fill();
    const BP = bagPlacement();                                                     // mirrored: image x -> X0 - x * s
    drawImageAt(ctx, BP, im);
    // the tag hangs from the handle on its short cord, hole up (the S2 tag turned on end), a little swung toward us; the
    // cord starts on the drawn handle strand (measured on g10f_bag: seg10_parts.json)
    const [hx, hy] = BP.toWorld(partOf(PA, 'g10f_bag', 'handle').point), ts = 0.14 * LK.pxm * f / TAG.w;
    line(ctx, [[hx, hy], [hx + 4, hy + 20]], 2, mix(PAPER, GRAPHITE, 0.3));
    ctx.save(); ctx.translate(hx + 4, hy + 20); ctx.rotate(-Math.PI / 2 + 0.10); ctx.scale(ts, ts); ctx.translate(-TAG.hx, -TAG.h / 2);
    ctx.fillStyle = rgba(INK_RGB, 0.25); ctx.fillRect(14, 10, TAG.w, TAG.h); ctx.drawImage(TAG_DONE, 0, 0); ctx.restore();
    ctx.restore();
  }
  // the door swung open by a degrees: its face (cut from the canon drawing) in vertical strips, each projected
  function doorPanel(ctx, a) {
    const N = 48, r = a * Math.PI / 180, tw = DOOR_TEX.width, th = DOOR_TEX.height;
    const yT = LKY(LK.face[1]), yB = LKY(LK.face[3]), xH = LKX(LK.face[0]), wpx = (LK.face[2] - LK.face[0]) * LKC.s;
    const P = u => { const X = xH + wpx * u * Math.cos(r), z = (wpx * u / LK.pxm) * Math.sin(r); return [PR(X, yT, z), PR(X, yB, z)]; };
    const turn = Math.sin(r);
    for (let i = 0; i < N; i++) {
      const [a0, b0] = P(i / N), [a1] = P((i + 1) / N), x0 = a0[0], x1 = a1[0] + 0.6;
      ctx.drawImage(DOOR_TEX, tw * i / N, 0, tw / N + 0.5, th, x0, a0[1], x1 - x0, b0[1] - a0[1]);
    }
    // the face turned away from the station's light: a screen tone that fades as it comes round to face us
    const [t0, b0] = P(0), [t1, b1] = P(1);
    fillPoly(ctx, [t0, t1, b1, b0], { fill: null, scr: [0.22 * turn, 5], w: 2.2, stroke: LINE });
    // the door's thickness at its free edge (2 cm), seen from our left
    const dx = 5 * turn;
    fillPoly(ctx, [t1, [t1[0] + dx, t1[1]], [b1[0] + dx, b1[1]], b1], { fill: PAPER, scr: [0.4, 5], w: 1.4, stroke: LINE });
  }
  // the door's outline on screen at angle a (its face and the edge's thickness; shut: the face itself), for PART AUDIT
  function doorQuad(a) {
    const r = a * Math.PI / 180, yT = LKY(LK.face[1]), yB = LKY(LK.face[3]), xH = LKX(LK.face[0]), wpx = (LK.face[2] - LK.face[0]) * LKC.s;
    const z = (wpx / LK.pxm) * Math.sin(r), X = xH + wpx * Math.cos(r), dx = 5 * Math.sin(r);
    const t1 = PR(X, yT, z), b1 = PR(X, yB, z);
    return [PR(xH, yT, 0), [t1[0] + dx, t1[1]], [b1[0] + dx, b1[1]], PR(xH, yB, 0)];
  }
  // the free edge of the door at angle a, on screen (for placing her hand)
  const edgeX = a => { const r = a * Math.PI / 180, wpx = (LK.face[2] - LK.face[0]) * LKC.s; return PR(LKX(LK.face[0]) + wpx * Math.cos(r), 0, LK.w * Math.sin(r))[0]; };
  const rin3Name = tt => S.at('rin3', tt).file.split('/').pop().replace('.png', '');
  const rin3Placement = name => placement({ x: RIN3.spine, y: RIN3.soles, s: RIN3.s, origin: partOf(PA, name, 'soles').point });
  function drawRin3(ctx, tt) {
    ctx.fillStyle = rgba(TEAL_RGB, 0.35); ctx.beginPath(); ctx.ellipse(RIN3.spine, RIN3.soles - 3, 112, 11, 0, 0, 7); ctx.fill();
    drawImageAt(ctx, rin3Placement(rin3Name(tt)), imOf('rin3', tt));
  }
  const PEN29 = { x: (LK.side[0] + LK.side[2]) / 2, y0: 300, colH: 560, max: 76 };
  function drawS3(ctx, tt) {
    // the station: a tiled wall (paper, a light screen, the tile joints) and a floor of teal tiles
    ctx.fillStyle = PAPER; ctx.fillRect(-10, -10, W + 20, 1100);
    ctx.fillStyle = screen(ctx, 0.16, 5); ctx.fillRect(-10, -10, W + 20, LK.floorY + 10);
    for (let y = LK.floorY - 30; y > -40; y -= 60) line(ctx, [[-10, y], [W + 10, y]], 1.1, rgba(TEAL_RGB, 0.35));
    fillPoly(ctx, [[-10, LK.floorY], [W + 10, LK.floorY], [W + 10, 1090], [-10, 1090]], { fill: PAPER, scr: [0.34, 5], stroke: null });
    line(ctx, [[-10, LK.floorY], [W + 10, LK.floorY]], 2.4, LINE);
    for (let i = -14; i <= 14; i++) { const x = CAM3.vx + i * 150; line(ctx, [PR(x, LK.floorY, 0), PR(x, LK.floorY, 2.2)], 1.1, rgba(TEAL_RGB, 0.45)); }
    for (const z of [0.6, 1.25]) { const y = PR(0, LK.floorY, z)[1]; line(ctx, [[-10, y], [W + 10, y]], 1.1, rgba(TEAL_RGB, 0.45)); }
    // the banks: hers, and the next one cut by the frame
    ctx.drawImage(LOCKERS, LKC.x, LKC.y, LOCKERS.width * LKC.s, LOCKERS.height * LKC.s);
    ctx.drawImage(LOCKERS, LK.next, LKC.y, LOCKERS.width * LKC.s, LOCKERS.height * LKC.s);
    const a = doorAngle(tt);
    if (a > 0) { interior(ctx); doorPanel(ctx, a); }
    else ctx.drawImage(BLACK.c, BLACK.x, BLACK.y);
    drawRin3(ctx, tt);
    PEN.column(ctx, L29, PEN29.x, PEN29.y0, PEN29.colH, tt, PEN29.max);
  }
  // ---------- layout registry and audits ----------
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  const charBox = (p, k) => { const s = 16 * k, a = s * 0.98 - 1; return [p.x - a / 2, p.y - s * 0.48, a, s * 0.96]; };
  const viewsS1 = (a, b) => frameTimes(SEG[0], a, b).map(t => { const [z, fx, fy] = camS1(t); return { t, ...CAM.view(z, fx, fy) }; });
  const STILL = (a, b) => frameTimes(SEG[0], a, b).map(t => ({ t, z: 1, fx: 960, fy: 540 }));
  LAY.reg('display', 'disp', [DX0, DY0, DX1 - DX0, DY1 - DY0]); LAY.audit('S1 display');
  PB26.forEach(p => LAY.text(`句26 ${p.c}`, 'd26', charBox(p, KB))); LAY.audit('句26 on the display');
  PB27.forEach(p => LAY.text(`句27 ${p.c}`, 'd27', charBox(p, KB))); LAY.audit('句27 on the display');
  LAY.frameCheck('句26 k295-k303', { sheets: { d26: q2 => q2 }, views: viewsS1(T295, T303) });
  LAY.frameCheck('句27 k303-k311', { sheets: { d27: q2 => q2 }, views: viewsS1(T303, T311) });
  // the tag: its rows in tag px, mapped to the screen by the tag's resting transform (the swing is a few px)
  const tagMap = ([x, y]) => { const c = Math.cos(TAG.rot), s = Math.sin(TAG.rot), lx = (x - TAG.hx) * TAG.s, ly = (y - TAG.h / 2) * TAG.s; return [TAG.x + c * lx - s * ly, TAG.y + s * lx + c * ly]; };
  LAY.reg('tag なかみ row 1', 'tag', TAGROW.r1); LAY.reg('tag なかみ row 2', 'tag', TAGROW.r2); LAY.reg('tag box', 'tag', TAGROW.box); LAY.reg('tag なかみ row 3', 'tag', TAGROW.r3);
  LAY.audit('S2 tag fields');
  LAY.text('句28 row 1', 'tag:pencil', PEN.lineBox(R1, TAGROW.r1, 52)); LAY.text('句28 row 2', 'tag:pencil', PEN.lineBox(R2, [TAGROW.r2[0], TAGROW.r2[1], 216, 54], 52));
  LAY.text('句28 驕傲', 'tag:pencil', PEN.lineBox(BOXW, [TAGROW.box[0] + 6, TAGROW.box[1] + 4, TAGROW.box[2] - 12, TAGROW.box[3] - 8], 70));
  LAY.text('句28 row 3', 'tag:pencil', PEN.lineBox(R3, [TAGROW.r3[0], TAGROW.r3[1], 216, 54], 52));
  LAY.audit('句28 on the tag');
  LAY.frameCheck('S2 tag', { sheets: { 'tag:pencil': tagMap, tag: tagMap }, views: STILL(T311, T322), inset: 4 });
  LAY.text('句29 column', 'side:pencil', PEN.columnBox(L29, PEN29.x, PEN29.y0, PEN29.colH, PEN29.max));
  LAY.reg('side panel', 'side', [LK.side[0], LK.side[1], LK.side[2] - LK.side[0], LK.side[3] - LK.side[1]]);
  LAY.audit('句29 on the side panel');
  LAY.frameCheck('S3 side panel', { sheets: { 'side:pencil': q2 => q2 }, views: STILL(T322, T327), inset: 4 });
  LAY.reg('door 22', 'door22', [LK.hinge, LK.top, LK.right - LK.hinge, LK.bot - LK.top]);
  LAY.text('使用中', 'door22:print', BLACK.box); LAY.audit('使用中 on door 22');
  LAY.frameCheck('S3 使用中', { sheets: { 'door22:print': q2 => q2 }, views: STILL(T324, T327), inset: 4 });
  // LYRIC AUDIT: every sung letter, the first frame it reads (alpha >= 2/3) as the page shows it (renderAt clamps to k295;
  // 句26 only before the wipe on k303, 句27 on the display k303-k311, 句28 on the tag from k311 (and whole in S3), 句29 in S3)
  {
    const shown = (tt, t, a, b) => (tt >= a && tt < b ? sungBuild(tt - t) : 0);
    const entries = [], add = (chars, a, b) => chars.forEach(([c, t]) => {
      let readT = null;
      for (let gF = F0; gF < F1; gF++) { const tt = Math.min(Math.max(gF / 30, T295), SEG[1] - 1e-6); if (shown(tt, t, a, b) >= 2 / 3) { readT = gF / 30; break; } }
      entries.push({ c, t, readT });
    });
    add(L26, T295, T303); add(L27, T303, T311); add(L28, T311, SEG[1]); add(L29, T322, SEG[1]);
    window.__lyricAudit = lyricAudit('seg_10', entries);
  }
  // MOTION AUDIT (制作约定 第六节 整屏运动): every frame's framing as shown; the cuts on k311 and k322 are not motion
  let motion;
  {
    const views = [];
    for (let gF = F0; gF < F1; gF++) {
      const tt = Math.min(Math.max(gF / 30, T295), SEG[1] - 1e-6), shot = tt < T311 ? 0 : tt < T322 ? 1 : 2;
      const v = shot === 0 ? CAM.view(...camS1(tt)) : CAM.view(1, 960, 540);
      views.push({ t: gF / 30, z: v.z, fx: v.fx, fy: v.fy, cut: views.length > 0 && views[views.length - 1].shot !== shot, shot });
    }
    motion = motionAudit('seg_10', views, { big: [[T307, 'k307 every head drops at once (「眠」), the camera steps in and stops']] });
  }
  // PART AUDIT: parts drawn over the drawings, each checked against the drawing's own pixels
  {
    const nameOf = k => ART[k].split('/').pop().replace('.png', '');
    // her soles (the placement origin, between the shoes) on each drawing: both shoes are drawn there
    for (const k of ['door', 'doorb', 'lock', 'lockm', 'lockb'])
      partAudit('seg_10', nameOf(k), 'soles', { image: IM[k], points: partOf(PA, nameOf(k), 'soles').feet, on: PIX.opaque, r: 1, maxOffPct: 0 });
    // the carry handle and the tag cord on the bag top (r10g_back) and on the bag's side handle (g10f_bag): on the drawn bag
    partAudit('seg_10', 'r10g_back', 'handle', { image: IM.back, points: [HANDLE.point, ...HANDLE.base], on: PIX.dark, r: 2, maxOffPct: 0 });
    partAudit('seg_10', 'g10f_bag', 'handle', { image: IM.bag, points: [partOf(PA, 'g10f_bag', 'handle').point], on: PIX.dark, r: 2, maxOffPct: 0 });
    // her pushing hand on the locker door: the door as drawn at each drawing's angle, projected into the drawing's px; every
    // skin pixel of the hand must lie on it (a few px for the fingers curling round the free edge)
    for (const [k, a] of [['lock', DOOR_A.lock], ['lockm', DOOR_A.lockm], ['lockb', 0]]) {
      const name = nameOf(k), P3 = rin3Placement(name), im = IM[k], [bx0, by0, bx1, by1] = partOf(PA, name, 'hand').box;
      const [mc, mx] = mk(im.width, im.height), inv = ([X, Y]) => [P3.origin[0] + (X - P3.x) / P3.s, P3.origin[1] + (Y - P3.y) / P3.s];
      mx.fillStyle = '#000'; poly(mx, doorQuad(a).map(inv)); mx.fill();
      const px = pixelsOf(im), pts = [];
      for (let y = by0; y <= by1; y += 2) for (let x = bx0; x <= bx1; x += 2) if (PIX.skin(px.at(x, y))) pts.push([x, y]);
      partAudit('seg_10', name, 'hand on door 22', { image: mc, points: pts, on: PIX.opaque, r: 4, maxOffPct: 3 });
    }
  }
  S.finish();
  publishAudit(S, LAY, { shots: { S1: [T295, T311], S2: [T311, T322], S3: [T322, T327] }, motion, parts: partReport('seg_10') });

  window.renderAt = async t => {
    // frame 3287 (= round(k295 x 30)) is 10 ms before k295: it shows the cut's first state, not the end of 09
    const tt = Math.min(Math.max(t, T295), SEG[1] - 1e-6);
    if (tt < T311) CAM.shoot(camS1(tt), 0, 0, ctx => drawS1(ctx, tt));
    else if (tt < T322) CAM.shoot([1, 960, 540], 0, 0, ctx => drawS2(ctx, tt));
    else CAM.shoot([1, 960, 540], 0, 0, ctx => drawS3(ctx, tt));
  };
  await window.renderAt(P('t0', 110));
}
