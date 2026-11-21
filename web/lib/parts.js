// Parts drawn by code on top of a drawing (a pencil lead out of a drawn lead holder, strings over a drawn guitar, a lanyard
// from drawn stubs, a clip, a cord, a shadow): each part is measured on EACH drawing in that drawing's own px, drawn through
// the SAME transform as the drawing (once, never "the drawing's offset" added again on top), and checked against the
// drawing's own pixels (PART AUDIT). 根因清单 「笔芯和笔不对了……吉他弦和吉他不是一块的」 (2026-11-21): parts were measured once on
// one reference drawing and moved by every other drawing's alignment offset; a hand-read anchor point lay off the drawn
// object's axis; a swap to another drawing kept the old drawing's anchors.
//
//   import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, axisOf, along, axisAudit, partAudit, stringsAudit,
//            PIX, partReport } from '../lib/parts.js';
//   const PA = await loadPartAnchors('/art/cut/seg04_parts.json');     // { "<drawing>": { "<part>": {...} } }, drawing px
//   const P = placement({ x, y, s, rot, origin: PA.h04_hold.lead.tip }); // drawing px -> world, ONE transform per drawing
//   drawImageAt(ctx, P, IMG.hold);                                       // the drawing ...
//   drawPart(ctx, P, (c, px) => {                                        // ... and its part, in the drawing's own px
//     const L = partOf(PA, 'h04_hold', 'lead'), ax = axisOf(L.axis);     // axis: [back, tip] ON the drawn centreline
//     c.lineWidth = px(12); c.beginPath(); c.moveTo(...ax.tip); c.lineTo(...along(ax, len / P.s)); c.stroke(); });
//   axisAudit('seg_04', 'h04_hold', 'lead', { image: IMG.hold, axis: L.axis });      // lead continues the holder's axis
//   stringsAudit('seg_05', 's05_pluck', { image: IM.pluck, strings: partOf(PA, 's05_pluck', 'strings') });
//   publishAudit(S, LAY, { parts: partReport('seg_04') });             // console PART AUDIT line, window.__audit.parts
//
// Anchor files (art/cut/<seg>_parts.json) hold, per drawing and part:
//   axis    [[bx, by], [tx, ty]]   two points ON the drawn object's centreline, back end then tip (a pen, a lead holder,
//                                  a pencil, a neck): the part leaves the tip along back -> tip
//   strings [{ a: [x, y], b: [x, y] }, ...]   each string from its bridge end (a) to its far end (b), on the drawn string
//   ends    [[x, y], [x, y]]       where a drawn strand stops and code continues it (lanyard stubs, cords)
//   point   [x, y]                 a single contact (a clip, the jack a cable leaves, a shadow's foot)
// measureAxis() fits an axis from the drawing's pixels; use it to write the file (or to check a hand-read one).

// ------------------------------------------------------------------------------------------------ anchors and placement
const MISSING = [];
export async function loadPartAnchors(url) { return (await fetch(url)).json(); }
// the part as measured on THIS drawing; a drawing without its own anchors throws (no falling back to another drawing's)
export function partOf(anchors, drawing, part) {
  const d = anchors && anchors[drawing], p = d && d[part];
  if (!p) { MISSING.push(`${drawing}.${part}`); throw new Error(`parts.js: no '${part}' measured on ${drawing} (measure it on this drawing; do not reuse another drawing's anchors)`); }
  return p;
}
// drawing px -> world: translate(x, y) . rotate(rot) . scale(s) . translate(-origin). origin is the drawing px that lands on
// (x, y) (e.g. a pencil tip). Drawing and parts both go through P; nothing else may add an offset to a part.
export function placement({ x = 0, y = 0, s = 1, rot = 0, origin = [0, 0], flipX = false } = {}) {
  const c = Math.cos(rot), n = Math.sin(rot), fx = flipX ? -1 : 1;
  const toWorld = ([px, py]) => { const u = (px - origin[0]) * s * fx, v = (py - origin[1]) * s; return [x + u * c - v * n, y + u * n + v * c]; };
  const dirToWorld = ([dx, dy]) => { const u = dx * fx, v = dy, l = Math.hypot(u, v) || 1; return [(u * c - v * n) / l, (u * n + v * c) / l]; };
  const apply = ctx => { ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * fx, s); ctx.translate(-origin[0], -origin[1]); };
  return { x, y, s, rot, origin, flipX, toWorld, dirToWorld, apply };
}
export function drawImageAt(ctx, P, image) { ctx.save(); P.apply(ctx); ctx.drawImage(image, 0, 0); ctx.restore(); }
// fn(ctx, px) draws in the drawing's own px; px(w) converts a width in world px into drawing px (so a lead stays 12 world px)
export function drawPart(ctx, P, fn) { ctx.save(); P.apply(ctx); fn(ctx, w => w / P.s); ctx.restore(); }

// ------------------------------------------------------------------------------------------------ geometry
// an axis [[back], [tip]] -> { tip, back, dir (unit, back -> tip), nrm, len, angle }
export function axisOf([back, tip]) {
  const dx = tip[0] - back[0], dy = tip[1] - back[1], len = Math.hypot(dx, dy), dir = [dx / len, dy / len];
  return { tip, back, dir, nrm: [-dir[1], dir[0]], len, angle: Math.atan2(dy, dx) };
}
export const along = (ax, d, side = 0) => [ax.tip[0] + ax.dir[0] * d + ax.nrm[0] * side, ax.tip[1] + ax.dir[1] * d + ax.nrm[1] * side];
export function samplesAlong(a, b, n = 100) { const o = []; for (let i = 0; i <= n; i++) { const u = i / n; o.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); } return o; }

// ------------------------------------------------------------------------------------------------ the drawing's pixels
const PIXC = new WeakMap();
// image: an <img>/<canvas>, or { width, height, data } (RGBA). Returns { w, h, at(x, y) -> [r, g, b, a] (a = 0 outside) }
export function pixelsOf(image) {
  if (PIXC.has(image)) return PIXC.get(image);
  let w = image.width, h = image.height, data = image.data;
  if (!data) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(image, 0, 0); data = x.getImageData(0, 0, w, h).data; }
  const at = (px, py) => { const X = Math.round(px), Y = Math.round(py); if (X < 0 || Y < 0 || X >= w || Y >= h) return [0, 0, 0, 0]; const i = (Y * w + X) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
  const r = { w, h, at }; PIXC.set(image, r); return r;
}
// pixel classes (the film's drawings: Codex line art, flat colours). Thresholds as in work/seg/15/fin/strings_measure.py.
export const PIX = {
  opaque: ([, , , a]) => a > 200,
  skin: ([r, g, b, a]) => a > 200 && r > 225 && r - g >= 28 && r - g <= 50 && g - b <= 27 && g - b >= 8,
  fretboard: ([r, g, b, a]) => { const l = (r + g + b) / 3; return a > 200 && r - b >= 22 && r - g >= 12 && l > 70 && l < 150 && g - b >= 3; },
  gold: ([r, g, b, a]) => a > 200 && r > 150 && r - b > 70 && g - b > 40,
  steel: ([r, g, b, a]) => a > 200 && Math.min(r, g, b) > 140 && Math.max(r, g, b) - Math.min(r, g, b) < 28,   // strings, frets, metal
  dark: ([r, g, b, a]) => a > 200 && Math.max(r, g, b) < 80,                                                       // a pen body, a suit
  // a pen / lead holder / pencil body: opaque and not skin (fingers over it are reported as hidden, not as off)
  body: p => PIX.opaque(p) && !PIX.skin(p),
};
// true when `cls` holds within r px of (x, y) (a 1-2 px line drawn by Codex is never exactly on a measured line)
export const near = (px, cls, x, y, r = 2) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (cls(px.at(x + dx, y + dy))) return true; return false; };

// ------------------------------------------------------------------------------------------------ measuring
// fit the drawn object's centreline between two rough points (tipRough, backRough): sections across it at 12 places from
// 12 % to 88 % of the way, the run of `body` pixels through the rough line in each, its middle; a least-squares line through
// the middles. Returns { axis: [[back], [tip]] on the fitted line (tip = the rough tip moved onto it), angleDeg, rms, width }.
export function measureAxis(image, tipRough, backRough, { body = PIX.body, halfWidth = null, from = 0.12, to = 0.88, n = 12 } = {}) {
  const px = pixelsOf(image), ax = axisOf([backRough, tipRough]), R = halfWidth ?? Math.max(8, ax.len * 0.08);
  const mids = [], widths = [];
  for (let i = 0; i < n; i++) {
    const t = ax.len * (from + (to - from) * i / (n - 1)), c = [ax.tip[0] - ax.dir[0] * t, ax.tip[1] - ax.dir[1] * t];
    const ok = o => body(px.at(c[0] + ax.nrm[0] * o, c[1] + ax.nrm[1] * o));
    if (!ok(0)) continue;
    let lo = 0, hi = 0; while (lo > -R && ok(lo - 1)) lo--; while (hi < R && ok(hi + 1)) hi++;
    if (lo <= -R || hi >= R) continue;                         // ran into something as wide as the search: not this object
    mids.push([t, (lo + hi) / 2]); widths.push(hi - lo + 1);
  }
  // drop sections much wider than the median (a pen clip, a finger along the body): they push the middle sideways
  { const med = widths.slice().sort((a, b) => a - b)[widths.length >> 1]; for (let i = mids.length - 1; i >= 0; i--) if (widths[i] > med * 1.15) { mids.splice(i, 1); widths.splice(i, 1); } }
  if (mids.length < 4) return null;
  const mt = mids.reduce((s, m) => s + m[0], 0) / mids.length, mo = mids.reduce((s, m) => s + m[1], 0) / mids.length;
  let sxx = 0, sxy = 0; for (const [t, o] of mids) { sxx += (t - mt) ** 2; sxy += (t - mt) * (o - mo); }
  const k = sxy / sxx, b0 = mo - k * mt;                      // offset o(t) = k t + b0, t measured from the rough tip backwards
  const rms = Math.sqrt(mids.reduce((s, [t, o]) => s + (o - (k * t + b0)) ** 2, 0) / mids.length);
  const P = (t, o) => [ax.tip[0] - ax.dir[0] * t + ax.nrm[0] * o, ax.tip[1] - ax.dir[1] * t + ax.nrm[1] * o];
  return { axis: [P(ax.len, k * ax.len + b0), P(0, b0)], angleDeg: (ax.angle - Math.atan(k)) * 180 / Math.PI,
           tipOffset: b0, slope: k, rms, width: widths.sort((a, b) => a - b)[widths.length >> 1], sections: mids.length };
}

// ------------------------------------------------------------------------------------------------ PART AUDIT
const REC = [];
const rec = r => { REC.push(r); return r; };
// a part leaving a drawn object along its axis (a lead out of a lead holder, a pencil's point, a cable from a jack):
// the drawn object's own centreline is measured from the drawing and compared with the anchor axis the page draws from.
// Fails when the angle differs by more than tolDeg or the tip lies more than tolPx off the drawn centreline (drawing px).
export function axisAudit(seg, drawing, part, { image, axis, body = PIX.body, tolDeg = 0.6, tolPx = 1.5, halfWidth = null } = {}) {
  const ax = axisOf(axis), m = measureAxis(image, ax.tip, ax.back, { body, halfWidth });
  if (!m) return rec({ seg, drawing, part, kind: 'axis', ok: false, why: 'the drawn object was not found along the anchor axis' });
  const dAng = ((ax.angle * 180 / Math.PI - m.angleDeg + 540) % 360) - 180;
  const ok = Math.abs(dAng) <= tolDeg && Math.abs(m.tipOffset) <= tolPx;
  return rec({ seg, drawing, part, kind: 'axis', ok, angleErrDeg: +dAng.toFixed(2), tipOffPx: +m.tipOffset.toFixed(1), rms: +m.rms.toFixed(2),
               width: m.width, measured: m.axis.map(p => p.map(v => +v.toFixed(1))),
               why: ok ? '' : `anchor axis ${dAng.toFixed(2)} deg / tip ${m.tipOffset.toFixed(1)} px off the drawn centreline (use measured)` });
}
// any part given as sample points in the drawing's px: every point must be on `on` (within r px), unless `hidden` holds
// there (e.g. a finger over a string: the page must draw the drawing's own pixels back over it). maxOffPct of points may miss.
export function partAudit(seg, drawing, part, { image, points, on, hidden = null, r = 2, maxOffPct = 3 } = {}) {
  const px = pixelsOf(image); let off = 0, hid = 0; const bad = [];
  for (const [x, y] of points) {
    if (hidden && hidden(px.at(x, y))) { hid++; continue; }
    if (!near(px, on, x, y, r)) { off++; if (bad.length < 6) bad.push([Math.round(x), Math.round(y)]); }
  }
  const n = points.length - hid, pct = n ? 100 * off / n : 100, ok = n > 0 && pct <= maxOffPct;
  return rec({ seg, drawing, part, kind: 'points', ok, offPct: +pct.toFixed(1), hiddenPct: +(100 * hid / points.length).toFixed(1), firstOff: bad,
               why: ok ? '' : n ? `${pct.toFixed(1)}% of points off the drawn ${part}` : 'every point hidden' });
}
// strings: each from a to b must lie ON a drawn string (steel within 2 px) over the fretboard and the body, hidden under skin;
// and the set must be in order, not crossing (a string drawn between two drawn strings reads as a seventh string)
export function stringsAudit(seg, drawing, { image, strings, on = PIX.steel, hidden = PIX.skin, r = 2, maxOffPct = 8, n = 200 } = {}) {
  const out = strings.map((s, i) => partAudit(seg, drawing, `string ${i + 1}`, { image, points: samplesAlong(s.a ?? s[0], s.b ?? s[1], n), on, hidden, r, maxOffPct }));
  return { ok: out.every(o => o.ok), strings: out };
}
// a strand that code continues from drawn stubs (lanyard, cord): the code's start must be on the drawn strand's end, i.e.
// `on` holds within r px at the start and NOT a few px further along the code's direction (else it starts inside the stub)
export function endsAudit(seg, drawing, part, { image, ends, on, r = 2 } = {}) {
  const px = pixelsOf(image), bad = ends.filter(([x, y]) => !near(px, on, x, y, r)).map(p => p.map(Math.round));
  return rec({ seg, drawing, part, kind: 'ends', ok: !bad.length, why: bad.length ? `ends not on the drawn ${part}: ${JSON.stringify(bad)}` : '' });
}
// the console line and the data for window.__audit.parts (a missing anchor counts as a failure)
export function partReport(seg) {
  const mine = REC.filter(r => r.seg === seg), bad = mine.filter(r => !r.ok);
  const miss = MISSING.slice();
  console.warn(`PART AUDIT ${seg}: ${mine.length} parts checked, ${bad.length + miss.length} problems` +
    (bad.length ? ' [' + bad.map(r => `${r.drawing} ${r.part}: ${r.why}`).join('; ') + ']' : '') + (miss.length ? ` [missing anchors: ${miss.join(', ')}]` : ''));
  return { checked: mine.length, problems: bad.length + miss.length, records: mine, missing: miss };
}
