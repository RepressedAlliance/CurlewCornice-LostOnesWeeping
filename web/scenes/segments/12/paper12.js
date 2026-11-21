// Segment 12's own paper and locker helpers (docs/分镜/12_副歌2.md 第 6 节). Only the four ways paper comes apart:
//   ① a cut line opening (キリトリ線: the perforation's bridges tear, the two sides bow apart),
//   ② a rough tear (fibrous edge with the paper's thickness, a strip can fold over and show its back, a fist can punch through),
//   ③ a piece swinging open like a door on one edge, ④ a whole piece dropping straight down.
// Finished-segment version (after the blind review of the samples, 2026-11-20): the torn edges get the paper's thickness as a
// curled lip that shows the back of the sheet, irregular widths and fibres; folds and doors are drawn in perspective, slice by
// slice, with the far end lagging (paper bends, it does not squash).
// Kept inside the segment folder (not web/lib/): no other segment uses it yet.
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, INK_RGB, FIBRE_RGB, GRAPHITE, PENCIL, rgba } from '../../../lib/palette.js';
import { rng } from '../../../lib/card.js';
import { FRAME as FR } from '../../../lib/score.js';

export const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return [c, c.getContext('2d')]; };

// value noise in 1D, smooth, deterministic per seed
export function noise1(seed) {
  const r = rng(seed), N = 512, v = Array.from({ length: N }, () => r() * 2 - 1);
  return x => { const i = Math.floor(x), f = x - i, a = v[((i % N) + N) % N], b = v[(((i + 1) % N) + N) % N], s = f * f * (3 - 2 * f); return a + (b - a) * s; };
}
// a rough torn line from p0 to p1: points every ~3 px, displaced sideways by three octaves of noise (amp px); the ends stay put
export function roughLine(p0, p1, seed, amp = 7, step = 3) {
  const n1 = noise1(seed), n2 = noise1(seed + 17), n3 = noise1(seed + 31), r = rng(seed + 5);
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, n = Math.max(2, Math.round(L / step));
  const out = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, d = (i === 0 || i === n) ? 0 : amp * (0.62 * n1(u * L / 46) + 0.28 * n2(u * L / 13) + 0.1 * n3(u * L / 4)) + (r() - 0.5) * amp * 0.25;
    out.push([p0[0] + dx * u + nx * d, p0[1] + dy * u + ny * d]);
  }
  return out;
}
// a polyline through several points, each leg a rough line
export function roughPath(pts, seed, amp = 6) {
  let out = [];
  for (let i = 0; i + 1 < pts.length; i++) { const leg = roughLine(pts[i], pts[i + 1], seed + i * 7, amp); out = out.concat(i ? leg.slice(1) : leg); }
  return out;
}
export function pathPoly(ctx, pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }
export function polyline(ctx, pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); }

// The two edges of a cut line torn open (①): the printed perforation is 14 px cuts and 9 px bridges; the paper parts along the
// cuts (straight runs) and the bridges tear (each leaves a small fibrous tab on one side or the other). The two sides bow apart
// by different amounts (wL(y), wR(y): half-widths), so the opening is not a symmetric lens.
export function perfEdges(xc, y0, y1, wL, wR, seed, { pitch = 23, cut = 14 } = {}) {
  const r = rng(seed), L = [], R = [];
  const tabs = []; for (let y = y0; y <= y1 + pitch; y += pitch) tabs.push({ y: y + cut, side: r() < 0.5 ? -1 : 1, h: 1.5 + r() * 3.2, w: 6 + r() * 4 });
  const tabAt = (y, side) => { let d = 0; for (const t of tabs) if (t.side === side && Math.abs(y - (t.y + t.w / 2)) < t.w / 2) d = Math.max(d, t.h * Math.sin(Math.PI * (y - t.y) / t.w)); return d; };
  for (let y = y0; y <= y1 + 0.01; y += 1.5) {
    L.push([xc - wL(y) + tabAt(y, -1), y]);
    R.push([xc + wR(y) - tabAt(y, 1), y]);
  }
  return [L, R];
}

// Normals of a polyline (unit), pointing to its left (for a line going down the page: to the +x side when side = -1 ...)
function normals(pts) {
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1; return [-ty / L, tx / L]; });
}
// The torn edge of a sheet, drawn over the paper along the edge polyline `pts`; side (+1/-1) says which normal side is the
// opening. What makes it read as paper and not as a cut-out:
//   - the lip: along a tear the paper curls a little towards the camera, so a narrow band of the BACK of the sheet shows
//     on the opening side (greyer than the front), irregular in width, with a fine dark line where it ends;
//   - the thickness: a bright fibrous band right at the break, a faint shade line just inside the front;
//   - fibres: short pale hairs (a few long ones) sticking out of the lip into the opening.
export function tornEdge(ctx, pts, seed, { side = 1, lip = 1, fibres = 1, scale = 1, layers = 0 } = {}) {
  if (pts.length < 2) return;
  const r = rng(seed), n = normals(pts), nz = noise1(seed + 3), nz2 = noise1(seed + 9);
  let s = 0; const arc = pts.map((p, i) => (s += i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0));
  const wOf = i => scale * lip * Math.max(0.6, 2.4 + 3.6 * (0.5 + 0.5 * nz(arc[i] / 38)) + 1.4 * nz2(arc[i] / 9));
  const outer = pts.map((p, i) => [p[0] + n[i][0] * side * wOf(i), p[1] + n[i][1] * side * wOf(i)]);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // shade just inside the front (the paper bends up at the tear)
  ctx.strokeStyle = rgba(INK_RGB, 0.14); ctx.lineWidth = 3.2 * scale; ctx.beginPath();
  pts.forEach((p, i) => { const q = [p[0] - n[i][0] * side * 2.6 * scale, p[1] - n[i][1] * side * 2.6 * scale]; i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke();
  // the lip: the back of the sheet (greyer), between the break and the outer line
  ctx.beginPath(); polyline(ctx, pts); for (let i = outer.length - 1; i >= 0; i--) ctx.lineTo(...outer[i]); ctx.closePath();
  ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = rgba(INK_RGB, 0.13); ctx.fill();
  // several sheets: the stack's layers show as fine lines across the lip
  for (let k = 1; k <= layers; k++) { const f = k / (layers + 1); ctx.strokeStyle = rgba(INK_RGB, 0.1 + 0.08 * ((k * 7) % 3)); ctx.lineWidth = 0.7 * scale; ctx.beginPath();
    pts.forEach((p, i) => { const q = [p[0] + (outer[i][0] - p[0]) * f, p[1] + (outer[i][1] - p[1]) * f]; i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke(); }
  ctx.strokeStyle = rgba(INK_RGB, 0.42); ctx.lineWidth = 1.1 * scale; ctx.beginPath(); polyline(ctx, outer); ctx.stroke();
  // the break: a bright band of torn fibres
  ctx.strokeStyle = rgba([255, 255, 255], 0.95); ctx.lineWidth = 1.6 * scale; ctx.beginPath(); polyline(ctx, pts); ctx.stroke();
  // fibres from the lip's edge into the opening
  for (let i = 1; i < outer.length - 1; i++) {
    if (r() > 0.5 * fibres) continue;
    const [x, y] = outer[i], nx = n[i][0] * side, ny = n[i][1] * side, long = r() < 0.12, len = (long ? 7 + r() * 9 : 1.5 + r() * 4.5) * scale, ang = (r() - 0.5) * 1.3;
    const ex = x + (nx * Math.cos(ang) - ny * Math.sin(ang)) * len, ey = y + (ny * Math.cos(ang) + nx * Math.sin(ang)) * len;
    ctx.strokeStyle = r() < 0.75 ? rgba([252, 251, 247], 0.8) : rgba(FIBRE_RGB, 0.4); ctx.lineWidth = (0.5 + r() * 0.8) * scale;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + nx * len * 0.5 + (r() - 0.5) * 3 * scale, y + ny * len * 0.5 + (r() - 0.5) * 3 * scale, ex, ey); ctx.stroke();
  }
  ctx.restore();
}

// the back of a sheet (a folded strip shows it): slightly grey paper, fibres, no print showing through (the review read the
// faint mirrored print as a stray character)
export function backPaper(w, h, seed) {
  const [c, x] = mk(w, h), r = rng(seed);
  x.fillStyle = PAPER; x.fillRect(0, 0, w, h); x.fillStyle = rgba(INK_RGB, 0.07); x.fillRect(0, 0, w, h);
  for (let k = 0; k < w * h / 1500; k++) { x.fillStyle = rgba(FIBRE_RGB, 0.03 + r() * 0.05); x.fillRect(r() * w, r() * h, 2 + r() * 8, 1); }
  return c;
}

// A strip folding over its fold line, in perspective (②). front: the strip as it is on the page, a canvas covering
// [x0, x0 + w] x [yTop, FY] (alpha = the strip's torn shape); back: the strip's back as it will be seen once folded, a canvas
// covering [x0, x0 + w] x [FY, FY + (FY - yTop)] (its shape is the front's mirrored top to bottom). theta 0 .. PI: how far it
// has turned towards the camera and down. The far end lags behind the fold (the sheet bends), the side turned away is shaded,
// and everything is projected from (cx, cy) with focal length f, so the part that comes towards the camera grows.
export function drawFold(tctx, front, back, x0, yTop, FY, theta, { f = 2600, cx = 960, cy = 540, bend = 0.5, roll = 0, shrink = 1 } = {}) {
  // tctx is a scratch canvas the size of the frame (cleared by the caller, then composited): the shading of each row is laid
  // over that row only (source-atop), so nothing under the strip gets darker
  const L = FY - yTop, w = front.width, step = 2;
  tctx.save();
  if (roll || shrink !== 1) { const ax = x0 + w / 2; tctx.translate(ax, FY); tctx.rotate(roll); tctx.scale(shrink, 1); tctx.translate(-ax, -FY); }
  if (theta <= 0.0005) { tctx.drawImage(front, x0, yTop); tctx.restore(); return; }
  let y = FY, z = 0;
  for (let d = 0; d < L; d += step) {
    const u = d / L, th = Math.min(Math.PI, Math.max(0, theta - bend * Math.sin(theta) * u * u));
    const y1 = y - Math.cos(th) * step, z1 = z + Math.sin(th) * step;
    const sA = f / (f - z), sB = f / (f - z1), syA = cy + (y - cy) * sA, syB = cy + (y1 - cy) * sB, s = (sA + sB) / 2;
    const top = Math.min(syA, syB), hgt = Math.max(1, Math.abs(syB - syA) + 0.8), X = cx + (x0 - cx) * s, Wd = w * s;
    let shade;
    if (Math.cos(th) > 0) { tctx.drawImage(front, 0, Math.max(0, L - d - step), w, step, X, top, Wd, hgt); shade = 0.42 * (1 - Math.cos(th)); }
    else { tctx.drawImage(back, 0, Math.min(back.height - step, d), w, step, X, top, Wd, hgt); shade = 0.26 * (1 + Math.cos(th)); }
    if (shade > 0.01) { tctx.save(); tctx.beginPath(); tctx.rect(X - 2, top, Wd + 4, hgt); tctx.clip(); tctx.globalCompositeOperation = 'source-atop';
      tctx.fillStyle = rgba(INK_RGB, shade); tctx.fillRect(X - 2, top, Wd + 4, hgt); tctx.restore(); }
    y = y1; z = z1;
  }
  tctx.restore();
}

// A piece swinging open on a vertical hinge towards the camera (③): piece is a canvas covering [x0, x0 + w] x [y0, y0 + h]
// with the hinge on its left edge (x0). phi 0 .. PI/2. Projected from (cx, cy); the side turned away gets darker. Drawn into a
// scratch canvas (as drawFold).
export function drawDoor(tctx, piece, x0, y0, phi, { f = 2600, cx = 960, cy = 540, step = 2, bend = 0.25 } = {}) {
  const w = piece.width, h = piece.height;
  let x = x0, z = 0;
  for (let d = 0; d < w; d += step) {
    const u = d / w, ph = Math.min(Math.PI / 2 + 0.3, phi + bend * Math.sin(2 * phi) * u * u);
    const x1 = x + Math.cos(ph) * step, z1 = z + Math.sin(ph) * step;
    if (f - z1 < 300) break;
    const sA = f / (f - z), sB = f / (f - z1);
    const XA = cx + (x - cx) * sA, XB = cx + (x1 - cx) * sB, s = (sA + sB) / 2;
    const left = Math.min(XA, XB), wd = Math.max(0.8, Math.abs(XB - XA) + 0.6), Y = cy + (y0 - cy) * s, H = h * s;
    tctx.drawImage(piece, d, 0, step, h, left, Y, wd, H);
    const sh = 0.38 * Math.sin(ph); if (sh > 0.01) { tctx.save(); tctx.beginPath(); tctx.rect(left, Y, wd, H); tctx.clip(); tctx.globalCompositeOperation = 'source-atop'; tctx.fillStyle = rgba(INK_RGB, sh); tctx.fillRect(left, Y, wd, H); tctx.restore(); }
    x = x1; z = z1;
  }
}

// little pieces torn off a page: irregular torn shapes cut from the page itself (they carry its print), each with a fibrous
// rim; they fall (g px/s^2) and turn
export function makeBits(page, centres, seed, { size = [8, 16] } = {}) {
  const r = rng(seed);
  return centres.map(([cx, cy], i) => {
    const s = size[0] + r() * (size[1] - size[0]), n = 7, poly = Array.from({ length: n }, (_, k) => { const a = k / n * Math.PI * 2 + (r() - 0.5) * 0.5; return [Math.cos(a) * s * (0.55 + r() * 0.6), Math.sin(a) * s * (0.4 + r() * 0.5)]; });
    const [c, x] = mk(s * 3, s * 3); x.translate(s * 1.5, s * 1.5); x.beginPath(); pathPoly(x, poly); x.clip(); x.drawImage(page, -cx, -cy);
    x.setTransform(1, 0, 0, 1, s * 1.5, s * 1.5); tornEdge(x, [...poly, poly[0]], seed + i, { side: 1, lip: 0.45, fibres: 0.6, scale: 0.7 });
    return { c, s, cx, cy, vx: (r() - 0.5) * 140, vy: -20 - r() * 60, rot: (r() - 0.5) * 10, flip: 6 + r() * 8 };
  });
}
export function drawBits(ctx, bits, age, { g = 2600, life = 0.4 } = {}) {
  if (age < 0 || age > life) return;
  for (const b of bits) {
    const x = b.cx + b.vx * age, y = b.cy + b.vy * age + 0.5 * g * age * age;
    ctx.save(); ctx.translate(x, y); ctx.rotate(b.rot * age); ctx.scale(Math.cos(b.flip * age), 1);
    ctx.drawImage(b.c, -b.c.width / 2, -b.c.height / 2); ctx.restore();
  }
}

// ---------- her heavy pencil (as 08b: Klee pressed over two to four times, the hand's wobble, grain; revealed by a sweep) ----------
export function heavyPencil({ res = 3 } = {}) {
  const GLY = {};
  function glyph(ch, size, p, seed) {
    const key = `${ch}|${size}|${p.toFixed(2)}|${seed}`; if (GLY[key]) return GLY[key];
    const S3 = size * res, [c0, x] = mk(Math.ceil(S3 * 1.5), Math.ceil(S3 * 1.5)), r = rng(seed);
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `600 ${S3}px Klee`; x.lineJoin = 'round';
    const passes = 2 + Math.round(p * 2);
    for (let k = 0; k < passes; k++) { const dx = (r() - 0.5) * S3 * 0.02 * (0.5 + p), dy = (r() - 0.5) * S3 * 0.02 * (0.5 + p);
      x.globalAlpha = 0.5 + 0.3 * p; x.fillStyle = PENCIL; x.fillText(ch, c0.width / 2 + dx, c0.height / 2 + dy);
      if (p > 0.35) { x.strokeStyle = PENCIL; x.lineWidth = S3 * 0.016 * p; x.strokeText(ch, c0.width / 2 + dx, c0.height / 2 + dy); } }
    const [c1, x1] = mk(c0.width, c0.height), [c, x2] = mk(c0.width, c0.height), A = S3 * 0.022, f1 = (2 + r() * 2) / S3, f2 = (2 + r() * 2) / S3, ph1 = r() * 6, ph2 = r() * 6;
    for (let y = 0; y < c0.height; y += 2) x1.drawImage(c0, 0, y, c0.width, 2, A * Math.sin(y * f1 * Math.PI + ph1), y, c0.width, 2);
    for (let xx = 0; xx < c0.width; xx += 2) x2.drawImage(c1, xx, 0, 2, c0.height, xx, A * Math.sin(xx * f2 * Math.PI + ph2), 2, c0.height);
    x2.globalAlpha = 1; x2.globalCompositeOperation = 'destination-out';
    for (let k = 0; k < size * (3.4 - 2.4 * p); k++) { x2.fillStyle = `rgba(0,0,0,${0.1 + r() * 0.25})`; x2.fillRect(r() * c.width, r() * c.height, (1 + r() * 2.5) * res, res); }
    return (GLY[key] = c);
  }
  // one letter L = { c, x, y, size, rot, p, seed }, u 0..1 = how much of it is written (a sweep in the writing direction)
  function letter(ctx, L, u) {
    if (u <= 0) return; const gc = glyph(L.c, L.size, L.p, L.seed), s = 1 / res, w = gc.width * s, h = gc.height * s;
    ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(L.rot || 0);
    if (u < 1) { ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w * (0.16 + 0.84 * u), h); ctx.clip(); }
    ctx.drawImage(gc, -w / 2, -h / 2, w, h); ctx.restore();
  }
  return { glyph, letter };
}

// ---------- the coin lockers (art/canon/coin_lockers_front.png), lit by their own fluorescent tube ----------
// White doors drawn in teal print; this segment's light: mid-tone pale teal-grey doors, clear teal lines, sparse dots,
// darker towards the floor (第 6 节「柜墙的光」). cells: [{x, y, w, h, n, tall, win}], drawn into ctx at their coordinates.
export function drawLockers(ctx, cells, { x0, y0, x1, y1, line = 3, light = [y0, y1] } = {}) {
  ctx.fillStyle = PAPER; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.fillStyle = rgba(TEAL_RGB, 0.36); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  for (const c of cells) {
    const { x, y, w, h } = c;
    ctx.fillStyle = PAPER; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = rgba(TEAL_RGB, 0.17); ctx.fillRect(x, y, w, h);
    const f0 = (y - light[0]) / (light[1] - light[0]), f1 = (y + h - light[0]) / (light[1] - light[0]);
    const gr = ctx.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, rgba(INK_RGB, 0.05 + 0.3 * Math.max(0, f0))); gr.addColorStop(1, rgba(INK_RGB, 0.05 + 0.3 * Math.max(0, f1)));
    ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = rgba(TEAL_RGB, 0.35);
    const pitch = Math.max(5, w / 26);
    for (let yy = y + h * 0.82; yy < y + h - 2; yy += pitch) for (let xx = x + 3 + ((yy / pitch) % 2) * pitch / 2; xx < x + w - 2; xx += pitch) {
      const rr = pitch * 0.22 * ((yy - (y + h * 0.82)) / (h * 0.18)); if (rr > 0.3) { ctx.beginPath(); ctx.arc(xx, yy, rr, 0, 7); ctx.fill(); } }
    ctx.strokeStyle = TEAL; ctx.lineWidth = line; ctx.strokeRect(x + line / 2, y + line / 2, w - line, h - line);
    ctx.lineWidth = line * 0.5; ctx.strokeRect(x + line * 2.2, y + line * 2.2, w - line * 4.4, h - line * 4.4);
    ctx.fillStyle = TEAL; for (const fy of c.tall ? [0.12, 0.5, 0.88] : [0.22, 0.78]) ctx.fillRect(x - line * 0.6, y + h * fy - h * 0.035, line * 1.8, h * 0.07);
    const u = c.u ?? w;
    ctx.fillStyle = TEAL; ctx.font = `800 ${Math.round(u * 0.14)}px ZenKakuB`; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    const wr = c.win, nw = ctx.measureText(String(c.n)).width, nx = x + u * 0.09; let ny = y + u * 0.07;
    // a number the window would cover (the door's top-left gutter is narrow) goes to the bottom-left corner instead
    if (wr && nx + nw > wr[0] && ny + u * 0.14 > wr[1]) ny = y + h - u * 0.07 - u * 0.15;
    ctx.fillText(String(c.n), nx, ny);
    if (wr) {
      ctx.fillStyle = PAPER; ctx.fillRect(wr[0], wr[1], wr[2], wr[3]);
      ctx.strokeStyle = TEAL; ctx.lineWidth = line * 0.8; ctx.strokeRect(wr[0], wr[1], wr[2], wr[3]);
      const kx = wr[0] + wr[2] / 2, ky = wr[1] + wr[3] + u * 0.12, kr = u * 0.055;
      ctx.lineWidth = line * 0.7; ctx.strokeRect(kx - kr * 1.15, ky - kr * 1.25, kr * 2.3, kr * 2.7);
      ctx.beginPath(); ctx.arc(kx, ky, kr * 0.7, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx, ky + kr * 2.6); ctx.lineTo(kx + kr * 0.6, ky + kr * 2.6); ctx.stroke();
      ctx.strokeRect(kx + kr * 1.6, ky - kr, kr * 0.5, kr * 1.8);
    }
  }
}

// the dark inside of an open locker (her tall door 22 after she has taken the bag out): charcoal with a soft inner shade,
// the open door panel standing out from its hinge edge, seen almost edge-on
export function openLocker(ctx, c, { panel = 0.22, line = 3 } = {}) {
  const { x, y, w, h } = c;
  ctx.fillStyle = GRAPHITE; ctx.fillRect(x, y, w, h);
  const g = ctx.createLinearGradient(x, y, x + w, y); g.addColorStop(0, rgba(INK_RGB, 0)); g.addColorStop(1, rgba([14, 14, 18], 0.6));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = rgba(TEAL_RGB, 0.55); ctx.lineWidth = line * 0.6; ctx.strokeRect(x + w * 0.12, y + h * 0.05, w * 0.76, h * 0.9);
  ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * 0.12, y + h * 0.95); ctx.moveTo(x + w, y + h); ctx.lineTo(x + w * 0.88, y + h * 0.95);
  ctx.moveTo(x, y); ctx.lineTo(x + w * 0.12, y + h * 0.05); ctx.moveTo(x + w, y); ctx.lineTo(x + w * 0.88, y + h * 0.05); ctx.stroke();
  if (panel > 0) {
    const pw = w * panel, grow = h * 0.06;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - pw, y - grow); ctx.lineTo(x - pw, y + h + grow); ctx.lineTo(x, y + h); ctx.closePath();
    ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = rgba(TEAL_RGB, 0.24); ctx.fill(); ctx.fillStyle = rgba(INK_RGB, 0.12); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = line; ctx.stroke();
  }
  ctx.strokeStyle = TEAL; ctx.lineWidth = line; ctx.strokeRect(x, y, w, h);
}

// scissors mark at the head of a cut line (two rings and two blades), teal
export function scissors(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = TEAL; ctx.fillStyle = TEAL; ctx.lineWidth = s * 0.09;
  for (const sg of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(sg * s * 0.24, -s * 0.36, s * 0.15, s * 0.2, 0, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sg * s * 0.18, -s * 0.18); ctx.lineTo(-sg * s * 0.06, s * 0.52); ctx.lineTo(-sg * s * 0.14, s * 0.5); ctx.lineTo(sg * s * 0.08, -s * 0.16); ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, s * 0.02, s * 0.04, 0, 7); ctx.fillStyle = PAPER; ctx.fill();
  ctx.restore();
}
// a dashed cut line from (x, y0) to (x, y1) (vertical) with the scissors at the top
export function cutLine(ctx, x, y0, y1, { dash = 14, gap = 9, w = 3, size = 30 } = {}) {
  ctx.save(); ctx.strokeStyle = TEAL; ctx.lineWidth = w; ctx.setLineDash([dash, gap]);
  ctx.beginPath(); ctx.moveTo(x, y0 + size * 0.9); ctx.lineTo(x, y1); ctx.stroke(); ctx.setLineDash([]);
  scissors(ctx, x, y0 + size * 0.3, size, Math.PI);
  ctx.restore();
}
// the same, horizontal, scissors at the left end
export function cutLineH(ctx, y, x0, x1, { dash = 14, gap = 9, w = 3, size = 30 } = {}) {
  ctx.save(); ctx.strokeStyle = TEAL; ctx.lineWidth = w; ctx.setLineDash([dash, gap]);
  ctx.beginPath(); ctx.moveTo(x0 + size * 0.9, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.setLineDash([]);
  scissors(ctx, x0 + size * 0.3, y, size, Math.PI / 2);
  ctx.restore();
}

// a soft paper shadow of a layer (its alpha), offset and blurred, onto whatever is behind it
export function shadowOf(dst, src, { dx = 7, dy = 11, blur = 5, a = 0.42, res = 1 } = {}) {
  const x = dst.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, dst.width, dst.height);
  x.filter = `blur(${blur * res}px)`; x.drawImage(src, dx * res, dy * res); x.filter = 'none';
  x.globalCompositeOperation = 'source-in'; x.fillStyle = rgba([14, 30, 34], a); x.fillRect(0, 0, dst.width, dst.height); x.globalCompositeOperation = 'source-over';
}
export { PAPER_RGB, FR };
