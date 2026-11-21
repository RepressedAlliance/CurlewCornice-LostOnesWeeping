// One colour rule for Rin's drawings, used by the 3D cards (shader) and the design boards (canvas), so she has the
// same colours everywhere.
//  1. Whites: Codex paints her white bow, shirt and card a light warm grey (#E6E1DB), which reads as grey next to
//     the film's paper. Light, low-saturation colours are lifted to white; the bow's grey shading, skin, hair and
//     anything saturated or darker are left alone.
//  2. Her teal (eyes, ribbon tie): the official colour is #218EA3. Teal pixels keep their hue and value; their
//     saturation is raised to at least the official teal's, so the eyes do not go grey-blue.
// Everything works on sRGB-encoded values in 0..1 (the shader converts from linear first).
export const RINPAL = { lo: 0.80, hi: 0.885, s0: 0.055, s1: 0.10, wp: 0.90, h0: 175, h1: 206, hf: 6, smin: 0.80 };

export const rinPalGLSL = `
vec3 rinPal(vec3 lin, float amt) {
  vec3 c = pow(max(lin, vec3(0.0)), vec3(1.0 / 2.2));
  float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b)), sat = (mx - mn) / max(mx, 1e-4);
  float kw = smoothstep(${RINPAL.lo.toFixed(4)}, ${RINPAL.hi.toFixed(4)}, mx) * (1.0 - smoothstep(${RINPAL.s0.toFixed(4)}, ${RINPAL.s1.toFixed(4)}, sat)) * amt;
  c = mix(c, vec3(min(1.0, mx / ${RINPAL.wp.toFixed(4)})), kw);
  mx = max(c.r, max(c.g, c.b)); mn = min(c.r, min(c.g, c.b)); sat = (mx - mn) / max(mx, 1e-4);
  float d = mx - mn, h = 0.0;
  if (d > 1e-4) {
    if (mx == c.r) h = mod((c.g - c.b) / d, 6.0); else if (mx == c.g) h = (c.b - c.r) / d + 2.0; else h = (c.r - c.g) / d + 4.0;
    h *= 60.0;
  }
  float kt = smoothstep(${RINPAL.h0.toFixed(1)}, ${(RINPAL.h0 + RINPAL.hf).toFixed(1)}, h) * (1.0 - smoothstep(${(RINPAL.h1 - RINPAL.hf).toFixed(1)}, ${RINPAL.h1.toFixed(1)}, h)) * smoothstep(0.25, 0.4, sat) * amt;
  if (kt > 0.0) {
    float ns = mix(sat, max(sat, ${RINPAL.smin.toFixed(4)}), kt);
    // same hue and value, new saturation: scale the distance of each channel from the max
    c = mx - (mx - c) * (ns / max(sat, 1e-4));
  }
  return pow(clamp(c, 0.0, 1.0), vec3(2.2));
}`;

const ss = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
// the same rule on a canvas, in place
export function rinPalCanvas(ctx, w, h, amt = 1) {
  const id = ctx.getImageData(0, 0, w, h), d = id.data, P = RINPAL;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
    let mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = (mx - mn) / Math.max(mx, 1e-4);
    const kw = ss(P.lo, P.hi, mx) * (1 - ss(P.s0, P.s1, sat)) * amt;
    if (kw > 0) { const wv = Math.min(1, mx / P.wp); r += (wv - r) * kw; g += (wv - g) * kw; b += (wv - b) * kw; }
    mx = Math.max(r, g, b); mn = Math.min(r, g, b); sat = (mx - mn) / Math.max(mx, 1e-4);
    const dd = mx - mn; let hh = 0;
    if (dd > 1e-4) { hh = mx === r ? (((g - b) / dd) % 6 + 6) % 6 : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; hh *= 60; }
    const kt = ss(P.h0, P.h0 + P.hf, hh) * (1 - ss(P.h1 - P.hf, P.h1, hh)) * ss(0.25, 0.4, sat) * amt;
    if (kt > 0) { const ns = sat + (Math.max(sat, P.smin) - sat) * kt, f = ns / Math.max(sat, 1e-4); r = mx - (mx - r) * f; g = mx - (mx - g) * f; b = mx - (mx - b) * f; }
    d[i] = Math.round(Math.min(1, Math.max(0, r)) * 255); d[i + 1] = Math.round(Math.min(1, Math.max(0, g)) * 255); d[i + 2] = Math.round(Math.min(1, Math.max(0, b)) * 255);
  }
  ctx.putImageData(id, 0, 0);
}
// an image (or canvas) run through the rule, as a new canvas
export function rinPalImage(im, amt = 1) {
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0); rinPalCanvas(x, c.width, c.height, amt); return c;
}
