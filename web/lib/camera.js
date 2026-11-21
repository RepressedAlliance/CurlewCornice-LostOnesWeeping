// The camera: a shot is drawn into a world canvas (or straight into the frame by a callback), then shown pushed in, punched on
// the hits and shaken, never showing past the page (the focus is clamped so the frame stays inside the world, with room for
// the shake). Camera moves start and stop on beats: pushes() and move() register their ends in the score.
// docs/制作约定.md 第八节: no roll, no tilt; pans and pushes only.
//
//   import { createCamera, pushes, punch, shakeOf, camLerp } from '../lib/camera.js';
//   const CAM = createCamera(g, { W, H: 1080, bg: FIELD });
//   const push = pushes(S, [[beatV(136), beatV(143), 0.03, 'push1'], ...]);  // push(i, tt) = 1 + amt * smooth(...)
//   CAM.wg.drawImage(...);  CAM.show(push(0, tt), 960, 560);                 // the world canvas, shown
//   CAM.shoot([z, fx, fy], shake, tt, (ctx, z) => { ...draw the world... }); // drawn straight into the frame, sharp when close
//   CAM.view(z, fx, fy, shake) -> { z, fx, fy } as actually shown (for type.js frameCheck)
import { smooth, beatOf } from './score.js';
import { rng } from './card.js';

export function createCamera(g, { W = 1920, H = 1080, bg = '#000' } = {}) {
  const world = document.createElement('canvas'); world.width = W; world.height = H;
  const wg = world.getContext('2d');
  // the focus as it is used: clamped so the frame (plus the shake) stays inside the world
  function view(zoom, fx, fy, shake = 0) {
    zoom = Math.max(1, zoom); const m = (shake + 2) / zoom;
    fx = Math.min(W - W / 2 / zoom - m, Math.max(W / 2 / zoom + m, fx)); fy = Math.min(H - H / 2 / zoom - m, Math.max(H / 2 / zoom + m, fy));
    return { z: zoom, fx, fy };
  }
  // the world canvas shown at zoom around (fx, fy), shaken by up to `shake` px (seeded by `seed`, e.g. the time)
  function show(zoom, fx, fy, shake = 0, seed = 0, ground = bg) {
    const v = view(zoom, fx, fy, shake);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = ground; g.fillRect(0, 0, W, H);
    const r = rng(Math.floor(seed * 1000) + 7), dx = (r() - 0.5) * 2 * shake, dy = (r() - 0.5) * 2 * shake;
    g.save(); g.translate(W / 2 + dx, H / 2 + dy); g.scale(v.z, v.z); g.translate(-v.fx, -v.fy); g.drawImage(world, 0, 0); g.restore();
    return v;
  }
  // the same camera, but the world is drawn by draw(ctx, z) straight into the frame (full resolution when pushed in close)
  function shoot([z, fx, fy], shake, seed, draw, ground = bg) {
    const v = view(z, fx, fy, shake);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = ground; g.fillRect(0, 0, W, H);
    const r = rng(Math.floor(seed * 1000) + 7), dx = (r() - 0.5) * 2 * shake, dy = (r() - 0.5) * 2 * shake;
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.translate(W / 2 + dx, H / 2 + dy); g.scale(v.z, v.z); g.translate(-v.fx, -v.fy); draw(g, v.z); g.restore();
    return v;
  }
  return { world, wg, view, show, shoot, W, H };
}

// a punch: a quick zoom kick on each hit, decaying (add it to the zoom)
export const punch = (tt, times, amt = 0.02, tau = 0.14) => times.reduce((a, t0) => a + (tt >= t0 ? amt * Math.exp(-(tt - t0) / tau) : 0), 0);
// a shake: px of shake on each hit, decaying
export const shakeOf = (tt, times, amt = 6, tau = 0.08) => times.reduce((a, t0) => a + (tt >= t0 ? amt * Math.exp(-(tt - t0) / tau) : 0), 0);

// eased pushes, one per shot, each from a beat to a beat: list = [[t0, t1, amount, name], ...]; returns push(i, tt).
// Both ends are registered in the score (score.mark: a time already registered is not registered twice).
export function pushes(score, list) {
  const P = list.map(([t0, t1, amt, name]) => {
    if (score) { score.mark(`${name} start`, t0); score.mark(`${name} end`, t1); }
    return [t0, t1, amt];
  });
  const push = (i, tt) => 1 + P[i][2] * smooth((tt - P[i][0]) / (P[i][1] - P[i][0]));
  push.list = P; push.amount = i => P[i][2];
  return push;
}
// any other camera move: registers its start and end in the score, returns [t0, t1]
export function move(score, name, t0, t1) { score.mark(`${name} start`, t0); score.mark(`${name} end`, t1); return [t0, t1]; }

// A move between two framings (zoom z0 on focus f0 -> zoom z1 on focus f1, e from 0 to 1) that keeps the target point tgt
// travelling in a straight line on screen while the zoom changes evenly (log scale), so nothing drifts the wrong way.
export function camLerp(z0, f0, z1, f1, e, tgt) {
  const z = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * e);
  const sx = (tgt[0] - f0[0]) * z0 * (1 - e) + (tgt[0] - f1[0]) * z1 * e, sy = (tgt[1] - f0[1]) * z0 * (1 - e) + (tgt[1] - f1[1]) * z1 * e;
  return [z, tgt[0] - sx / z, tgt[1] - sy / z];
}

// the frame times of [a, b) on the 30 fps grid of a segment starting at t0 (for audits that follow the camera frame by frame)
export function frameTimes(t0, a, b, fps = 30) {
  const out = []; const i0 = Math.max(0, Math.ceil((a - t0) * fps - 1e-9));
  for (let i = i0; t0 + i / fps < b; i++) out.push(t0 + i / fps);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------------
// MOTION AUDIT: the whole frame's motion, frame by frame, against docs/制作约定.md 第六节「整屏运动」(2026-11-21, the user after
// the second cut: 「你为什么要一直抖动屏幕？节奏感确实有 但是看着很晕啊」「不是完全不能晃 但是不能晕」). It only reads views; no
// camera function above changes. The same rules run on a rendered film in work/rhythm_diag/motion_stats.py (mode audit).
//
// A jolt is a group of frames where the whole frame starts, stops or turns abruptly: the largest acceleration of the four frame
// corners is over 0.2% of the width per frame^2 (about 4 px at 1080p). Eased pushes and pans hardly accelerate and are not
// jolts (but a push cut into steps is one jolt per step). Per jolt: amplitude = the largest corner excursion from where the
// frame was before it (fraction of the width), stay = where it ends, reversals = back-and-forth turns of the corner that
// moved most.
//
//   import { motionAudit, shakeOffset, frameTimes } from '../../lib/camera.js';
//   const views = frameTimes(T0, T0, T1).map(t => { const [z, fx, fy] = camAt(t), sh = shakeAt(t);
//     return { t, ...CAM.view(z, fx, fy, sh), ...shakeOffset(sh, t), cut: isFirstFrameOfShot(t) }; });
//   const MOTION_R = motionAudit('seg_14', views, { big: [[beatV(456), 'crash k456, 最终副歌第一拍']] });
//   publishAudit(S, LAY, { motion: MOTION_R });
// samples: { t, z, fx, fy, dx = 0, dy = 0, cut = false, roll = 0 }, one per rendered frame, the view as actually shown
// (CAM.view() plus the shake offset). cut: the first frame of a new shot (a cut is not motion).
// big: [[t, why]] the registered 大击 (段落交界的重拍、段内最响的镲、过门落下的那一拍、画面中心的击打动作本身);
// whips: [[t, why]] the registered 甩镜/滑镜 transitions (one-way, over 8% of the width).
export const MOTION = {
  joltAcc: 0.002,      // corner acceleration (fraction of the width per frame^2) that makes a frame part of a jolt
  visible: 0.003,      // jolts smaller than this (0.3% of the width) are not counted
  amp: 0.010,          // largest amplitude of an ordinary jolt: 1.0% of the width (19 px at 1080p; a zoom step of about 1.7%)
  ampBig: 0.025,       // largest amplitude of a registered 大击: 2.5% (48 px; a zoom of about 4.4%)
  overshoot: 0.15,     // a one-way jolt may run past and come back by at most 15% of its amplitude
  returnFrames: 12,    // a 大击 that goes in and comes back (打进去再退回) takes at least 12 frames to come back
  gapBeats: 4,         // the frame is free of jolts for at least 4 beats between two jolts
  gapBigBeats: 2,      // ... 2 beats when one of the two is a registered 大击 (or the first is a whip)
  perBeats: 8,         // at most one jolt per 8 beats of the segment on average (whips not counted)
  bigPerSeg: 2,        // at most two 大击 per segment
  joltFrac: 0.15,      // at most 15% of the segment's frames inside a jolt
  whipAmp: 0.08,       // a one-way move over 8% of the width is a whip (transition) and must be registered
  whipFrames: 12,      // a whip is done in 12 frames
  whipPerSeg: 1,
  cutGrace: 2,         // no ordinary jolt starts within 2 frames after a cut (the cut is already the accent)
};

// the shake offset that show() and shoot() add for a given shake and seed (the same generator, for audits only)
export function shakeOffset(shake, seed) {
  const r = rng(Math.floor(seed * 1000) + 7), dx = (r() - 0.5) * 2 * shake, dy = (r() - 0.5) * 2 * shake;
  return { dx, dy };
}

export function motionAudit(name, samples, { W = 1920, H = 1080, fps = 30, beat = 60 / 162, big = [], whips = [], rules = {}, log = true } = {}) {
  const R = { ...MOTION, ...rules }, S = samples.slice().sort((a, b) => a.t - b.t), n = S.length;
  const CORNERS = [[0, 0], [W, 0], [0, H], [W, H]], px = W / 1920;
  // per frame: each corner's screen displacement since the previous frame (null on the first frame and on cuts)
  const disp = S.map((b, i) => {
    if (i === 0 || b.cut) return null;
    const a = S[i - 1];
    return CORNERS.map(([sx, sy]) => {
      const wx = a.fx + (sx - W / 2 - (a.dx || 0)) / a.z, wy = a.fy + (sy - H / 2 - (a.dy || 0)) / a.z;
      return [W / 2 + (b.dx || 0) + (wx - b.fx) * b.z - sx, H / 2 + (b.dy || 0) + (wy - b.fy) * b.z - sy];
    });
  });
  const acc = disp.map((d, i) => (d && disp[i - 1]) ? Math.max(...d.map(([x, y], j) => Math.hypot(x - disp[i - 1][j][0], y - disp[i - 1][j][1]))) : 0);
  const cutBetween = (a, b) => { for (let i = a + 1; i <= b; i++) if (!disp[i]) return true; return false; };
  // group the hot frames into jolts (frames up to 3 apart, no cut between)
  const groups = [];
  for (let i = 0; i < n; i++) if (acc[i] > R.joltAcc * W) {
    const g = groups[groups.length - 1];
    if (g && i - g[g.length - 1] <= 3 && !cutBetween(g[g.length - 1], i)) g.push(i); else groups.push([i]);
  }
  const near = (list, t) => list.find(([tb]) => t >= tb - 0.5 / fps && t <= tb + 2.5 / fps);
  const jolts = [];
  for (const g of groups) {
    const s0 = g[0] - 1; let e = g[g.length - 1];
    while (e + 1 < n && disp[e + 1] && acc[e + 1] > 0.0005 * W) e++;              // until the motion is steady again
    const cum = CORNERS.map(() => [0, 0]); let amp = 0, ampAt = s0, cAmp = 0;
    for (let i = s0 + 1; i <= e; i++) {
      disp[i].forEach(([x, y], j) => { cum[j][0] += x; cum[j][1] += y; const m = Math.hypot(cum[j][0], cum[j][1]); if (m > amp) { amp = m; ampAt = i; cAmp = j; } });
    }
    const stay = Math.max(...cum.map(c => Math.hypot(c[0], c[1])));
    // reversals of the corner that moved most: its per-frame steps projected on its biggest step
    const steps = []; for (let i = s0 + 1; i <= e; i++) steps.push(disp[i][cAmp]);
    const big0 = steps.reduce((m, s) => Math.hypot(s[0], s[1]) > Math.hypot(m[0], m[1]) ? s : m, [0, 0]), L = Math.hypot(big0[0], big0[1]) || 1;
    const signs = steps.map(([x, y]) => (x * big0[0] + y * big0[1]) / L).filter(p => Math.abs(p) > 1.5 * px).map(Math.sign);
    let rev = 0; for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i - 1]) rev++;
    // ... and of the frame's centre (a random shake on top of a zoom kick turns the centre, not the corners)
    const cst = []; for (let i = s0 + 1; i <= e; i++) cst.push([(disp[i][0][0] + disp[i][3][0]) / 2, (disp[i][0][1] + disp[i][3][1]) / 2]);
    const cb = cst.reduce((m, s) => Math.hypot(s[0], s[1]) > Math.hypot(m[0], m[1]) ? s : m, [0, 0]), cL = Math.hypot(cb[0], cb[1]) || 1;
    const csg = cst.map(([x, y]) => (x * cb[0] + y * cb[1]) / cL).filter(p => Math.abs(p) > 1.5 * px).map(Math.sign);
    let crev = 0; for (let i = 1; i < csg.length; i++) if (csg[i] !== csg[i - 1]) crev++;
    rev = Math.max(rev, crev);
    const t = S[g[0]].t, A = amp / W, St = stay / W;
    if (A < R.visible && !(rev >= 2 && A >= R.visible / 2)) continue;      // a back-and-forth is seen from half that size
    const kind = rev >= 2 ? 'shake' : St < 0.5 * A ? 'there-back' : St < (1 - R.overshoot) * A ? 'overshoot' : 'one-way';
    const bigReg = near(big, t), whipReg = near(whips, t);
    const isWhip = kind !== 'shake' && (A >= R.whipAmp || !!whipReg);
    jolts.push({ t, k: +beatOf(t).toFixed(2), f0: s0 + 1, f1: e, frames: e - s0, amp: +(A * 100).toFixed(2), stay: +(St * 100).toFixed(2), rev, kind,
                 back: e - ampAt, big: bigReg ? bigReg[1] : null, whip: isWhip ? (whipReg ? whipReg[1] : 'UNREGISTERED') : null,
                 rollDeg: Math.max(0, ...S.slice(s0 + 1, e + 1).map(s => Math.abs(s.roll || 0))) * 180 / Math.PI });
  }
  // the checks
  const problems = [], P = (j, what) => problems.push(`${j ? `k${j.k} ` : ''}${what}`);
  for (const j of jolts) {
    const lim = j.big ? R.ampBig : R.amp;
    if (j.kind === 'shake') P(j, `抖 (back and forth ${j.rev} times, ${j.amp}%): random or repeated shake is not allowed`);
    if (j.whip) {
      if (j.whip === 'UNREGISTERED') P(j, `a ${j.amp}% move in ${j.frames} frames is a whip: register it (whips) or make it an eased move`);
      if (j.frames > R.whipFrames) P(j, `whip takes ${j.frames} frames (max ${R.whipFrames})`);
    } else {
      if (j.amp > lim * 100 + 1e-9) P(j, `${j.amp}% > ${(lim * 100).toFixed(1)}%${j.big ? ' (大击)' : ' (register it as 大击 only if the music earns it)'}`);
      if (j.kind === 'there-back' && !j.big) P(j, `打进去再退回 (${j.amp}% in, ends at ${j.stay}%): only a registered 大击 may come back`);
      if (j.kind === 'there-back' && j.big && j.back < R.returnFrames) P(j, `大击 comes back in ${j.back} frames (at least ${R.returnFrames})`);
      if (j.kind === 'overshoot') P(j, `overshoot: ends at ${j.stay}% of a ${j.amp}% jolt (more than ${R.overshoot * 100}% back)`);
      if (!j.big) for (let i = Math.max(1, j.f0 - R.cutGrace); i <= j.f0; i++) if (!disp[i]) { P(j, 'a jolt right after a cut (the cut is already the accent)'); break; }
    }
    if (j.rollDeg > 0) P(j, `roll ${j.rollDeg.toFixed(2)} deg (第八节: no roll)`);
  }
  for (let i = 1; i < jolts.length; i++) {
    const a = jolts[i - 1], b = jolts[i], gap = (S[b.f0].t - S[a.f1].t) / beat;
    const need = (a.big || b.big || a.whip) ? R.gapBigBeats : R.gapBeats;
    if (gap < need - 1e-6) P(b, `only ${gap.toFixed(2)} beats free after the jolt at k${a.k} (at least ${need})`);
  }
  const beats = n ? (S[n - 1].t - S[0].t + 1 / fps) / beat : 0, ordinary = jolts.filter(j => !j.whip);
  const allowed = Math.max(1, Math.round(beats / R.perBeats)), nBig = ordinary.filter(j => j.big).length, nWhip = jolts.length - ordinary.length;
  const cap = Math.max(allowed, Math.min(nBig, R.bigPerSeg));                      // a short segment may still have its 大击
  if (ordinary.length > cap) P(null, `${ordinary.length} jolts in ${beats.toFixed(1)} beats (at most ${cap}: one per ${R.perBeats} beats)`);
  if (nBig > R.bigPerSeg) P(null, `${nBig} 大击 (at most ${R.bigPerSeg})`);
  if (nWhip > R.whipPerSeg) P(null, `${nWhip} whips (at most ${R.whipPerSeg})`);
  let inJolt = 0; for (const j of jolts) inJolt += j.frames;
  const frac = n ? inJolt / n : 0;
  if (frac > R.joltFrac) P(null, `${(frac * 100).toFixed(0)}% of the frames are inside a jolt (at most ${R.joltFrac * 100}%)`);
  const stats = { frames: n, beats: +beats.toFixed(1), jolts: ordinary.length, big: nBig, whips: nWhip, allowed, joltFrac: +frac.toFixed(3),
                  perMinute: n ? +(ordinary.length / (n / fps / 60)).toFixed(1) : 0 };
  if (log) console.warn(`MOTION AUDIT ${name}: ${jolts.length} jolts${jolts.length ? ' (' + jolts.map(j => `k${j.k} ${j.kind} ${j.amp}%${j.big ? ' 大击' : ''}${j.whip ? ' whip' : ''}`).join(', ') + ')' : ''}; ${problems.length} problems${problems.length ? ': ' + problems.join('; ') : ''}`);
  return { jolts, problems, stats, rules: R };
}

