// Paper surface drawn in code: recycled-paper base, sparse fibres, a soft fold crease, faint
// graphite smudges. Deterministic (seeded) so every frame of a shot gets the same sheet.
import { GRAPHITE } from './palette.js';

export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function drawPaper(ctx, W, H, { seed = 3, base = '#eee9dc', fibres = 900, crease = null, smudges = 6 } = {}) {
  const R = rng(seed);
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
  // very low-frequency tone variation (no visible noise)
  for (let i = 0; i < 14; i++) {
    const g = ctx.createRadialGradient(R() * W, R() * H, 0, R() * W, R() * H, 300 + R() * 700);
    const a = 0.018 + R() * 0.02;
    g.addColorStop(0, R() < 0.5 ? `rgba(255,252,244,${a})` : `rgba(200,190,170,${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // fibres: short thin curved strokes, barely visible
  ctx.lineCap = 'round';
  for (let i = 0; i < fibres; i++) {
    const x = R() * W, y = R() * H, l = 4 + R() * 14, a = R() * Math.PI * 2;
    ctx.strokeStyle = R() < 0.6 ? `rgba(150,140,120,${0.05 + R() * 0.07})` : `rgba(255,255,250,${0.2 + R() * 0.2})`;
    ctx.lineWidth = 0.6 + R() * 0.6;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (R() - 0.5) * 4, y + Math.sin(a) * l * 0.5 + (R() - 0.5) * 4, x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
  if (crease) {
    // a fold: a lit edge and a shaded edge, slightly irregular
    const { x0, y0, x1, y1 } = crease;
    for (const [off, col] of [[-1.5, 'rgba(255,255,250,0.55)'], [1.5, 'rgba(120,110,95,0.16)']]) {
      ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let t = 0; t <= 1.0001; t += 0.02) {
        const x = x0 + (x1 - x0) * t + off + Math.sin(t * 31) * 0.8, y = y0 + (y1 - y0) * t + Math.cos(t * 23) * 0.8;
        t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  for (let i = 0; i < smudges; i++) {
    const x = R() * W, y = R() * H;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 40 + R() * 90);
    g.addColorStop(0, `rgba(60,60,66,${0.025 + R() * 0.03})`); g.addColorStop(1, 'rgba(60,60,66,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 120, 40 + R() * 40, R() * 3, 0, 7); ctx.fill();
  }
}

// A pen stroke with pressure: tapered start/end, slight wobble. pts = [[x,y],...]. Default colour: pencil black
// (palette.js GRAPHITE; the film uses no red, 2026-11-20 the old red default #d7263d was removed).
// A felt-pen stroke drawn like a hand does it: the nib lands (quick swell), runs at nearly even
// pressure with a slow wobble across the line, and lifts off in a long taper.
export function penStroke2(ctx, pts, { color = GRAPHITE, width = 7, seed = 5, taperIn = 0.05, taperOut = 0.16, minW = 0.18, wobble = 0, alpha = 0.9 } = {}) {
  const R = rng(seed), ph1 = R() * 6.28, ph2 = R() * 6.28;
  const seg = []; let L = 0;
  for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); L += d; }
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  ctx.fillStyle = color; ctx.globalAlpha = alpha;
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], d = seg[i] || 1e-6, nx = -(by - ay) / d, ny = (bx - ax) / d;
    const n = Math.max(1, Math.ceil(d / 1.0));
    for (let k = 0; k < n; k++) {
      const u = k / n, t = (acc + d * u) / L;
      const p = sm(0, taperIn, t) * (1 - sm(1 - taperOut, 1, t));
      const vary = 0.92 + 0.08 * Math.sin(t * 23 + ph1);
      const off = wobble * (Math.sin(t * 9.0 + ph1) * 0.6 + Math.sin(t * 21.0 + ph2) * 0.4);
      const x = ax + (bx - ax) * u + nx * off, y = ay + (by - ay) * u + ny * off;
      ctx.beginPath(); ctx.arc(x, y, width * 0.5 * (minW + (1 - minW) * p) * vary, 0, 7); ctx.fill();
    }
    acc += d;
  }
  ctx.globalAlpha = 1;
}

export function penStroke(ctx, pts, { color = GRAPHITE, width = 7, seed = 5 } = {}) {
  const R = rng(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const n = Math.max(2, Math.hypot(bx - ax, by - ay) / 1.5);
    for (let k = 0; k < n; k++) {
      const t = (i + k / n) / (pts.length - 1);
      const p = Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.5;   // pressure
      const x = ax + (bx - ax) * k / n + (R() - 0.5) * 0.4, y = ay + (by - ay) * k / n + (R() - 0.5) * 0.4;
      ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(x, y, width * 0.5 * (0.35 + 0.65 * p), 0, 7); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
