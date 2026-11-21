// 2D pages on her desk, seen from straight above.
// ?page=a2 : #6 「どれも不正解というオチでした」 the Japanese test: question booklet + answer sheet
import { loadCardFonts, pencilFill, erasedMark, rng, INK, inkjetText } from '../lib/card.js';
import { rinPalImage } from '../lib/rinpal.js';

const q = new URLSearchParams(location.search);
const P = (k, v) => +(q.get(k) ?? v);
const page = q.get('page') || 'a2';
const W = 1920, H = 1080;
const cv = document.getElementById('c'), g = cv.getContext('2d');
await loadCardFonts();
for (const [fam, url] of [['Shippori', '/assets/fonts/ShipporiMincho-Medium.ttf'], ['ShipporiB', '/assets/fonts/ShipporiMincho-Bold.ttf'], ['Yomogi', '/assets/fonts/Yomogi-Regular.ttf']]) {
  const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f);
}
const img = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const T = a => `rgba(33,142,163,${a})`;
const R = rng(11);

// The 2D pages are printed with the same plates as the 3D shots (toon.js PRINT): paper white, teal tints,
// the key line in deep teal, shadows as the teal halftone screen (same pitch and angle), hard edges only,
// no blur, no photographic texture.
const LINE = '#12606e';                       // key plate: outlines (the 3D post-pass ink in print mode)
const SCREEN = '#1b7f92';                     // the shadow screen ink
const PAPERW = '#f5f3ed', TEAL = '#218ea3';
const mixHex = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
const LIGHT = { dx: P('ldx', 9), dy: P('ldy', 12) };   // where shadows fall (px at 1080p): away from the light
// the halftone screen: dots on a 15-degree grid, 5.5 px pitch at 1080p, covering `cover` of the area
function screenPattern(color = SCREEN, cover = 0.30, pitch = 3.5) {   // the same ruling as the 3D shots and the people
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = color; const r = pitch * Math.sqrt(cover / Math.PI), a = 15 * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  for (let i = -Math.ceil(H / pitch) - 4; i < Math.ceil((W + H) / pitch); i++) for (let j = -Math.ceil(W / pitch) - 4; j < Math.ceil((W + H) / pitch); j++) {
    const u = i * pitch, v = j * pitch, px = u * ca - v * sa, py = u * sa + v * ca;
    if (px < -r || py < -r || px > W + r || py > H + r) continue;
    x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
  }
  return c;
}
let _screen = null;
const screen = () => (_screen ||= screenPattern());
function deskSurface() {
  // the school desk, printed: one light teal tint, a few long grain lines one step darker
  g.fillStyle = mixHex(PAPERW, TEAL, 0.16); g.fillRect(0, 0, W, H);
  g.strokeStyle = mixHex(PAPERW, TEAL, 0.32); g.lineCap = 'round';
  const knots = [[W * 0.18, H * 0.3, 70], [W * 0.86, H * 0.72, 55]];
  let y = -10;
  while (y < H + 20) {
    y += 22 + R() * 60; const a1 = 3 + R() * 9, f1 = 0.001 + R() * 0.002, ph = R() * 6.28;
    g.lineWidth = 1 + R() * 1.8; g.beginPath();
    for (let x = -20; x <= W + 20; x += 12) {
      let yy = y + Math.sin(x * f1 + ph) * a1 + Math.sin(x * 0.006 + ph * 2) * 1.5;
      for (const [kx, ky, kr] of knots) { const d = Math.hypot(x - kx, yy - ky); if (d < kr * 2.2) yy += (yy < ky ? -1 : 1) * (kr * 2.2 - d) * 0.45; }
      x === -20 ? g.moveTo(x, yy) : g.lineTo(x, yy);
    }
    g.stroke();
  }
  for (const [kx, ky, kr] of knots) for (let k = 0; k < 3; k++) { g.lineWidth = 1.4; g.beginPath(); g.ellipse(kx, ky, kr * (0.35 + k * 0.28), kr * (0.18 + k * 0.14), 0.05, 0, 7); g.stroke(); }
}
// a hard shadow: the silhouette of whatever draw() paints, offset away from the light, filled with the screen
function hardShadow(draw, dx = LIGHT.dx, dy = LIGHT.dy) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.save(); x.translate(dx, dy); draw(x); x.restore();
  x.globalCompositeOperation = 'source-in'; x.drawImage(screen(), 0, 0);
  g.drawImage(c, 0, 0);
}
function paperSheet(w, h, seed = 3) {
  // flat paper, the film's paper white
  const c = document.createElement('canvas'); c.width = w; c.height = h; const p = c.getContext('2d');
  p.fillStyle = PAPERW; p.fillRect(0, 0, w, h);
  return c;
}
// an image's silhouette (its alpha) filled with one colour
function pencilWrite(ctx, text, x, y, size, { font = 'Klee', seed = 5, jitter = 1, spacing = 1.04 } = {}) {
  const r = rng(seed), m = document.createElement('canvas'), w = Math.ceil(size * text.length * 1.3 + size), h = Math.ceil(size * 1.8);
  m.width = w; m.height = h; const t = m.getContext('2d'); t.textBaseline = 'middle';
  let gx = size * 0.3;
  for (const ch of text) {
    const sz = size * (0.95 + r() * 0.1 * jitter);
    t.font = `${sz}px ${font}`; const cw = t.measureText(ch).width;
    t.save(); t.translate(gx + cw / 2, h / 2 + (r() - 0.5) * size * 0.07 * jitter); t.rotate((r() - 0.5) * 0.08 * jitter);
    for (let k = 0; k < 2; k++) { t.fillStyle = `rgba(44,44,50,${0.55 + r() * 0.2})`; t.textAlign = 'center'; t.fillText(ch, (r() - 0.5) * 1.2, (r() - 0.5) * 1.2); }
    t.restore(); gx += cw * spacing;
  }
  t.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < w * h / 30; i++) { t.fillStyle = `rgba(0,0,0,${0.08 + r() * 0.18})`; t.fillRect(r() * w, r() * h, 1 + r() * 1.5, 1); }
  ctx.drawImage(m, x - size * 0.3, y - h / 2);
}
function silhouette(im, color) {
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d');
  x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  return c;
}
// draw an image with an outer outline in the 3D ink (the silhouette pushed out in eight directions underneath)
function inked(ctx, im, x, y, w = im.width, h = im.height, lw = 2.4) {
  const sil = silhouette(im, LINE);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.drawImage(sil, x + Math.cos(a) * lw, y + Math.sin(a) * lw, w, h); }
  ctx.drawImage(im, x, y, w, h);
}
// lay a sheet on the desk: its hard shadow, then the sheet with its outline, rotated about its centre
function place(sheet, cx, cy, rot, sc = 1) {
  const at = x => { x.translate(cx, cy); x.rotate(rot); x.scale(sc, sc); };
  hardShadow(x => { at(x); x.drawImage(sheet, -sheet.width / 2, -sheet.height / 2); });
  g.save(); at(g); inked(g, sheet, -sheet.width / 2, -sheet.height / 2); g.restore();
}
// the shadow of something held above the paper and touching it at one point (a pencil tip, an eraser): the
// shadow meets the object at the contact point and slides further from it the higher the object rises, which
// grows with distance from the contact along `axis` (unit vector pointing from the contact toward the hand).
function heldShadow(draw, contact, axis, rise) {
  const L = Math.hypot(LIGHT.dx, LIGHT.dy), lx = LIGHT.dx / L, ly = LIGHT.dy / L;
  const a = 1 + rise * lx * axis[0], b = rise * ly * axis[0], c = rise * lx * axis[1], d = 1 + rise * ly * axis[1];
  hardShadow(x => { x.setTransform(a, b, c, d, contact[0] - a * contact[0] - c * contact[1], contact[1] - b * contact[0] - d * contact[1]); draw(x); }, 0, 0);
}
// vertical Japanese text, one glyph per step; brackets and the long vowel mark turn 90 degrees
function vtext(p, text, x, y, size, step = 1.05, font = 'Shippori', color = '#26262b') {
  p.save(); p.fillStyle = color; p.font = `${size}px ${font}`; p.textAlign = 'center'; p.textBaseline = 'middle';
  let yy = y;
  for (const ch of text) {
    if (ch === '\n') { yy = y; x -= size * 1.75; continue; }
    p.save(); p.translate(x, yy + size / 2);
    if ('「」『』（）ー〜…―'.includes(ch)) p.rotate(Math.PI / 2);
    if ('、。'.includes(ch)) p.translate(size * 0.56, -size * 0.52);
    if ('ゃゅょっャュョッぁぃぅぇぉ'.includes(ch)) p.translate(size * 0.1, -size * 0.08);
    p.fillText(ch, 0, 0); p.restore();
    yy += size * step;
  }
  p.restore();
  return yy;
}

if (page === 'open2') {
  // ---- 0: the opening. Her, holding up her card (the machine has printed 読み取れません in the name field), in front
  // of the wall of answer bubbles the town prints everywhere (the same wall as the station hall in 01). Printed like
  // every other frame: paper white, teal plate, her shadow on the wall in the halftone screen. ----
  g.fillStyle = PAPERW; g.fillRect(0, 0, W, H);
  const cw = P('ow', 196), ch = P('oh', 146), x0 = P('ox', -60), y0 = P('oy', 38);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let r = 0; r * ch + y0 < H; r++) for (let c = 0; c * cw + x0 < W + cw; c++) {
    const x = x0 + c * cw + (r % 2) * cw * 0.5, y = y0 + r * ch, d = (c + r * 3 + 8) % 10;
    g.strokeStyle = TEAL; g.lineWidth = 5; g.beginPath(); g.ellipse(x, y, cw * 0.36, ch * 0.3, 0, 0, 7); g.stroke();
    g.fillStyle = TEAL; g.font = `500 ${Math.round(ch * 0.34)}px ZenKaku`; g.fillText(String(d), x, y + 2);
  }
  // the rule printed along the wall at waist height (the one she will break in the C part)
  const by = P('bandy', 905), bh2 = P('bandh', 84) / 2;
  g.fillStyle = PAPERW; g.fillRect(0, by - bh2, W, bh2 * 2);
  g.fillStyle = TEAL; g.fillRect(0, by - bh2, W, 6); g.fillRect(0, by + bh2 - 6, W, 6);
  g.font = `500 ${Math.round(bh2 * 0.9)}px ZenKaku`; g.textAlign = 'left';
  const rule = '訂正するときは、消しゴムできれいに消すこと。　';
  let tx = -P('bandx', 140); while (tx < W) { g.fillText(rule, tx, by + 2); tx += g.measureText(rule).width; }
  if (q.get('poster') === '1') {
    const px = P('pox', 1480), py = P('poy', 90), pw = P('pow', 330), ph = P('poh', 470);
    hardShadow(x => { x.fillStyle = '#000'; x.fillRect(px, py, pw, ph); }, 10, 12);
    g.fillStyle = '#f7f6f1'; g.fillRect(px, py, pw, ph); g.strokeStyle = 'rgba(38,38,43,0.5)'; g.lineWidth = 2; g.strokeRect(px, py, pw, ph);
    g.fillStyle = TEAL; g.fillRect(px, py, pw, ph * 0.06); g.fillRect(px, py + ph * 0.94, pw, ph * 0.06);
    g.fillStyle = '#26262b'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${pw * 0.2}px ZenKakuB`; g.fillText('正解は、', px + pw / 2, py + ph * 0.3); g.fillText('ひとつ。', px + pw / 2, py + ph * 0.46);
    g.font = `500 ${pw * 0.06}px ZenKaku`; g.fillText('迷わない力を、南台ゼミナールで。', px + pw / 2, py + ph * 0.64);
    g.fillStyle = TEAL; g.font = `700 ${pw * 0.075}px ZenKakuB`; g.fillText('南台ゼミナール', px + pw / 2, py + ph * 0.84);
    g.textAlign = 'left';
  }
  // her
  const her = rinPalImage(await img(`/art/cut/${q.get('rin') || 'rin_open_1c'}.png`));
  const sc = P('rs', 1.06), hw = her.width * sc, hh = her.height * sc, hx = P('rx', 960) - hw / 2, hy = P('ry', 30);
  hardShadow(x => x.drawImage(her, hx, hy, hw, hh), P('shx', 44), P('shy', 20));
  if (q.get('seq') !== '1') g.drawImage(her, hx, hy, hw, hh);
  else {
    // seq=1, the opening bars: her card is blank until the first hit of the riff, when the reader's print head sweeps
    // 読み取れません into the name field left to right; the frame jolts once with the hit, and eases in toward the card
    const blank = rinPalImage(await img(`/art/cut/${q.get('rinb') || 'rin_open_1b'}.png`));
    const CQ = (q.get('cardq') || '143,726,446,916').split(',').map(Number);
    const base = document.createElement('canvas'); base.width = W; base.height = H; base.getContext('2d').drawImage(cv, 0, 0);
    const frame = document.createElement('canvas'); frame.width = W; frame.height = H; const f = frame.getContext('2d');
    const T0 = P('t0', 0), T1 = P('t1', 3.32), HIT = P('thit', 0.354), SWEEP = P('sweep', 0.16), LEAD = 1 / 30;
    const cardL = hx + CQ[0] * sc, cardT = hy + CQ[1] * sc, cardW = (CQ[2] - CQ[0]) * sc, cardH = (CQ[3] - CQ[1]) * sc;
    const smooth = v => { v = Math.min(1, Math.max(0, v)); return v * v * (3 - 2 * v); };
    window.renderAt = async t => {
      const tt = t + LEAD;
      f.setTransform(1, 0, 0, 1, 0, 0); f.drawImage(base, 0, 0); f.drawImage(blank, hx, hy, hw, hh);
      const pr = Math.min(1, Math.max(0, (tt - HIT) / SWEEP));
      if (pr > 0) { f.save(); f.beginPath(); f.rect(cardL, cardT, cardW * pr, cardH); f.clip(); f.drawImage(her, hx, hy, hw, hh); f.restore(); }
      const z = 1 + P('push', 0.07) * smooth((t - T0) / (T1 - T0)), cx = cardL + cardW / 2, cy = cardT + cardH * 0.3;
      const k = tt >= HIT ? Math.exp(-(tt - HIT) / 0.07) : 0, jx = Math.sin((tt - HIT) * 90) * 4 * k, jy = Math.cos((tt - HIT) * 70) * 3 * k;
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = PAPERW; g.fillRect(0, 0, W, H);
      g.setTransform(z, 0, 0, z, cx - cx * z + jx, cy - cy * z + jy); g.drawImage(frame, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0);
    };
    await window.renderAt(T0);
  }
}
if (page === 'insert') {
  // ---- a hard-cut close-up for the rock sections (her face, her picking hand, her stomping foot): the Codex drawing on
  // the film's paper with printed speed lines (集中線, teal plate) that are redrawn every other frame; the lens punches
  // in on each hit and the frame kicks on every eighth note. Song time in seconds throughout.
  // imgs=a,b,...: a real cycle (a picking hand down and up), one drawing per icyc beats; otherwise one drawing
  const CYC = q.get('imgs') ? await Promise.all(q.get('imgs').split(',').map(async n => rinPalImage(await img(`/art/cut/${n}.png`)))) : null;
  const her = CYC ? CYC[0] : rinPalImage(await img(`/art/cut/${q.get('img')}.png`));
  const sc = P('is', 1.0), hw = her.width * sc, hh = her.height * sc, hx = P('ix', 960) - hw / 2, hy = P('iy', 540) - hh / 2;
  const FX = P('fx', 960), FY = P('fy', 540), MODE = q.get('lines') || 'radial';
  const BEAT = 60 / 162, B0 = 0.354, LEAD = 1 / 30;
  const HITS = (q.get('hits') || '').split(',').filter(Boolean).map(x => x.split(':').map(Number));
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const layer = document.createElement('canvas'); layer.width = W; layer.height = H; const L = layer.getContext('2d');
  function speedLines(seed) {
    L.setTransform(1, 0, 0, 1, 0, 0); L.fillStyle = PAPERW; L.fillRect(0, 0, W, H);
    L.fillStyle = TEAL;
    if (MODE === 'radial') {
      const n = P('ln', 150), Rout = Math.hypot(W, H);
      for (let i = 0; i < n; i++) {
        const a = (i + hash(seed * 31 + i) * 0.8) / n * Math.PI * 2, w = (0.15 + hash(seed * 17 + i * 3) * 0.85) * P('lw', 0.018);
        const r0 = P('lr0', 380) * (0.75 + hash(seed * 7 + i * 5) * 0.6);
        L.beginPath(); L.moveTo(FX + Math.cos(a) * r0, FY + Math.sin(a) * r0 * P('lry', 0.62));
        L.lineTo(FX + Math.cos(a - w) * Rout, FY + Math.sin(a - w) * Rout); L.lineTo(FX + Math.cos(a + w) * Rout, FY + Math.sin(a + w) * Rout); L.closePath(); L.fill();
      }
    } else {
      // horizontal impact lines across the frame, thick near the floor line, thinning upward
      for (let i = 0; i < P('ln', 70); i++) {
        const y = hash(seed * 13 + i) * H * P('lyh', 0.8), th = 1 + hash(seed * 5 + i) * P('lth', 7), x0 = hash(seed * 3 + i * 7) * W * 0.5, len = W * (0.3 + hash(i * 11 + seed) * 0.7);
        L.fillRect(x0 - W * 0.2, y, len, th);
      }
    }
  }
  // bg=file: a plate rendered from the same 3D scene (the night sky with the cards, the roof floor) instead of speed
  // lines, so a close-up sits in the world it was cut from; it drifts slowly (bgdx, bgdy px over the window)
  const BG = q.get('bg') ? await img(`/work/2d/${q.get('bg')}.png`) : null;
  window.renderAt = async t => {
    const tt = t + LEAD, b = (tt - B0) / BEAT;
    // bgseq=dir: a plate that is itself animated (rendered from the 3D scene over the same song time, bgt0 = its first frame)
    const BGF = q.get('bgseq') ? await img(`/${q.get('bgseq')}/f_${String(Math.max(0, Math.round((t - P('bgt0', 98.13)) * 30))).padStart(5, '0')}.png`).catch(() => null) : null;
    if (BG || BGF) {
      const u = Math.min(1, Math.max(0, (t - P('t0', 0)) / Math.max(0.01, P('t1', 1) - P('t0', 0)))), bz = P('bgz', 1.12);
      L.setTransform(1, 0, 0, 1, 0, 0); L.drawImage(BGF || BG, -W * (bz - 1) / 2 + P('bgdx', 0) * u, -H * (bz - 1) / 2 + P('bgdy', 0) * u, W * bz, H * bz);
    } else speedLines(Math.floor(tt * 15));                      // new lines every other frame at 30 fps
    let pn = 0; for (const [th, a] of HITS) { const dt = tt - th; if (dt >= 0) pn += a * Math.exp(-dt / P('ptau', 0.1)); }
    const e = Math.floor(b * 2), fe = b * 2 - e, amp = P('shk', 10) * Math.exp(-fe * 3);
    const jx = (hash(e) - 0.5) * 2 * amp, jy = (hash(e + 0.5) - 0.5) * 2 * amp;
    const z = P('z0', 1) + (P('z1', 1.06) - P('z0', 1)) * Math.min(1, Math.max(0, (t - P('t0', 0)) / Math.max(0.01, P('t1', 1) - P('t0', 0)))) + pn;
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(layer, 0, 0);
    const cur = CYC ? CYC[Math.floor(Math.max(0, tt - P('t0', 0)) / (P('icyc', 0.5) * BEAT)) % CYC.length] : her;
    g.setTransform(z, 0, 0, z, FX - FX * z + jx, FY - FY * z + jy);
    if (P('shx', 24) || P('shy', 14)) hardShadow(x => x.drawImage(cur, hx, hy, hw, hh), P('shx', 24), P('shy', 14));
    g.setTransform(z, 0, 0, z, FX - FX * z + jx, FY - FY * z + jy);
    g.drawImage(cur, hx, hy, hw, hh);
    g.setTransform(1, 0, 0, 1, 0, 0);
  };
  await window.renderAt(P('t0', 0));
}
if (page === 'a2demo') {
  // the 2D demo (docs/demo说明.md): her answer sheets for A2, animated to the singing; the page lives in its own module
  const { a2demo } = await import('./a2demo_page.js');
  await a2demo({ g, W, P, q, T, TEAL, PAPERW, LIGHT, deskSurface, paperSheet, place, hardShadow, heldShadow, vtext, pencilWrite,
                 pencilFill, erasedMark, inkjetText, rng, img, rinPalImage });
}
if (page === 'c1a') {
  // demo 2: the first chorus, first half (web/scenes/c1a_page.js)
  const fx = new FontFace('ShipporiX', 'url(/assets/fonts/ShipporiMincho-ExtraBold.ttf)'); await fx.load(); document.fonts.add(fx);
  const { c1a } = await import('./c1a_page.js');
  await c1a({ g, W, P, q, rng, img, rinPalImage, pencilFill, inkjetText });
}
if (page === 'a2v4') {
  // the 2D demo, fourth version: designed again, words on the paper (web/scenes/a2v4_page.js)
  const { a2v4 } = await import('./a2v4_page.js');
  await a2v4({ g, W, P, q, rng, img, rinPalImage, pencilFill, erasedMark, inkjetText });
}
if (page === 'a2v3') {
  // the 2D demo, third version: graphic and full-frame (web/scenes/a2v3_page.js)
  const fx = new FontFace('ShipporiX', 'url(/assets/fonts/ShipporiMincho-ExtraBold.ttf)'); await fx.load(); document.fonts.add(fx);
  const { a2v3 } = await import('./a2v3_page.js');
  await a2v3({ g, W, P, q, rng, img, rinPalImage, pencilFill, erasedMark, inkjetText, pencilWrite });
}
if (page === 'a2') {
  deskSurface();
  // ---- question booklet (left): a short passage of my own and question 3, set vertically ----
  const bw = 760, bh = 1000, book = paperSheet(bw, bh, 5), b = book.getContext('2d');
  b.strokeStyle = 'rgba(38,38,43,0.85)'; b.lineWidth = 2; b.strokeRect(40, 40, bw - 80, bh - 80);
  vtext(b, '国語　二', bw - 70, 70, 30, 1.1, 'ShipporiB');
  // passage: four columns right to left, then the question, then the four choices
  const ps = 30, pstep = 1.06, top = 80;
  const passage = ['放課後の教室で、僕はまた答えを探していた。', '窓の外では、みんなが同じ方向へ歩いていく。', '正しい道は一つしかないと言われて、', '僕はうなずいた。うなずくのは得意だった。'];
  passage.forEach((t, i) => vtext(b, t, 620 - i * 52, top, ps, pstep));
  // 傍線部ア: a rule down the right side of a whole phrase, 「うなずくのは得意だった」 (glyphs 9-19 of column 4)
  const lx = 620 - 3 * 52 + ps * 0.62, y0 = top + 8 * ps * pstep, y1 = top + 19 * ps * pstep;
  b.strokeStyle = '#26262b'; b.lineWidth = 2.2; b.beginPath(); b.moveTo(lx, y0 + 3); b.lineTo(lx, y1 - 3); b.stroke();
  b.fillStyle = '#26262b'; b.font = '18px Shippori'; b.textAlign = 'center'; b.fillText('ア', lx + 13, y0 + 12);
  vtext(b, '問三　傍線部ア「うなずくのは得意だった」とあるが、', 395, top, 27, 1.05, 'Shippori');
  vtext(b, 'このときの「僕」の気持ちとして最も適切なものを、', 350, top + 27 * 1.05, 27, 1.05, 'Shippori');
  vtext(b, '次のア〜エから一つ選びなさい。', 305, top + 27 * 1.05, 27, 1.05, 'Shippori');
  ['ア　悲しい', 'イ　淋しい', 'ウ　腹が立つ', 'エ　どうでもいい'].forEach((t, i) => vtext(b, t, 236 - i * 54, top + 30, 29, 1.06));
  place(book, P('bx', 360), P('by', 560), P('br', 0.07));

  // ---- answer sheet (right): rows of bubbles; row 3 has every choice tried, each refused ----
  const sw = 820, sh = 960, sheet = paperSheet(sw, sh, 9), s = sheet.getContext('2d');
  s.translate(1.2, 0.8);    // teal plate a hair off
  s.fillStyle = T(1); s.font = '700 34px ZenKakuB'; s.textBaseline = 'middle'; s.fillText('国語　解答用紙', 60, 72);
  s.font = '500 20px ZenKaku'; s.fillText('令和八年度　第二学期　期末考査', 60, 112);
  s.strokeStyle = T(1); s.lineWidth = 2.5; s.strokeRect(430, 44, 330, 86); s.fillRect(430, 44, 70, 86);
  s.fillStyle = '#f6f4ee'; s.font = '700 26px ZenKakuB'; s.textAlign = 'center'; s.fillText('氏名', 465, 87);
  s.setTransform(1, 0, 0, 1, 0, 0);
  // her name, in her own pencil handwriting
  pencilWrite(s, '鏡音　リン', 522, 90, 40, { seed: 8 });
  s.translate(1.2, 0.8);
  const rows = ['問一', '問二', '問三', '問四', '問五'], kana = ['ア', 'イ', 'ウ', 'エ'];
  const rowY = i => 220 + i * 120, colX = j => 260 + j * 120, rx = 34, ry = 21;
  s.lineWidth = 2.2;
  rows.forEach((t, i) => {
    s.fillStyle = T(0.12); s.fillRect(60, rowY(i) - 44, 120, 88);
    s.fillStyle = T(1); s.font = '700 28px ZenKakuB'; s.textAlign = 'center'; s.fillText(t, 120, rowY(i));
    kana.forEach((k, j) => { s.strokeStyle = T(0.95); s.beginPath(); s.ellipse(colX(j), rowY(i), rx, ry, 0, 0, 7); s.stroke(); s.fillStyle = T(0.9); s.font = '500 24px ZenKaku'; s.fillText(k, colX(j), rowY(i) + 1); });
  });
  // black timing marks down the left edge, one per row
  s.setTransform(1, 0, 0, 1, 0, 0); s.fillStyle = '#17171b';
  rows.forEach((t, i) => s.fillRect(18, rowY(i) - 8, 26, 16));
  for (const [x, y] of [[18, 18], [sw - 44, 18], [18, sh - 44], [sw - 44, sh - 44]]) s.fillRect(x, y, 26, 26);
  // pencil: one clean mark each in rows 1-2; row 3 tried every choice (three erased smudges, one mark)
  pencilFill(s, colX(1), rowY(0), rx * 0.92, ry * 0.92, 800, R);
  pencilFill(s, colX(3), rowY(1), rx * 0.92, ry * 0.92, 800, R, { angle: -0.36 });
  for (let j = 0; j < 3; j++) erasedMark(s, colX(j), rowY(2), rx * 0.95, ry * 0.95, 800, R, { angle: 0.08 - j * 0.05 });
  // the fourth try, pressed hard and past the line
  pencilFill(s, colX(3), rowY(2), rx * 0.98, ry * 0.98, 800, R, { dark: 1.35, over: 0.3, mess: 1.1, angle: -0.5 });
  // the reading machine's inkjet verdicts, printed under each mark
  const HEAD = 2.0;   // the reading machine's print head: one dot pitch for everything it prints
  inkjetText(s, '正解', colX(1), rowY(0) + 46, { size: 24, align: 'center', seed: 1, pitch: HEAD });
  inkjetText(s, '正解', colX(3), rowY(1) + 46, { size: 24, align: 'center', seed: 2, pitch: HEAD });
  for (let j = 0; j < 4; j++) inkjetText(s, '不正解', colX(j), rowY(2) + 46, { size: 23, align: 'center', seed: 5 + j, pitch: HEAD });
  // the result line at the foot of the sheet: the lyric, printed by the machine
  inkjetText(s, '問三　採点結果', sw / 2, sh - 178, { size: 22, align: 'center', seed: 9, pitch: HEAD });
  inkjetText(s, 'どれも不正解というオチでした', sw / 2, sh - 122, { size: 54, weight: 700, font: 'ZenKakuB', align: 'center', seed: 12, pitch: HEAD });
  // the answer sheet is the subject: large, a little turned; the booklet lies under its left edge
  const SX = P('sx', 1150), SY = P('sy', 540), SR = P('sr', -0.04), SC = P('ssc', 1.08);
  place(sheet, SX, SY, SR, SC);
  const onSheet = (px, py) => { const dx = (px - sw / 2) * SC, dy = (py - sh / 2) * SC; return [SX + dx * Math.cos(SR) - dy * Math.sin(SR), SY + dx * Math.sin(SR) + dy * Math.cos(SR)]; };
  // her hand with the pencil, hovering over row 3 (cut-out art), with its soft shadow on the paper
  try {
    const hand = await img(`/art/cut/${q.get('hand') || 'hand_pencil_1'}.png`);
    const [tx0, ty0] = onSheet(colX(3) + rx * 0.5, rowY(2));
    const hs = P('hs', 0.47), tipX = P('tx', tx0), tipY = P('ty', ty0), rot = P('hr', 32) * Math.PI / 180;
    const kx = P('hkx', 10), ky = P('hky', 683);   // the pencil tip in the hand drawing's own pixels
    const drawHand = ctx => { ctx.save(); ctx.translate(tipX, tipY); ctx.rotate(rot); ctx.drawImage(hand, -kx * hs, -ky * hs, hand.width * hs, hand.height * hs); ctx.restore(); };
    // the pencil touches the paper at its tip, the hand rises toward the upper right
    const ax = [Math.cos(rot - Math.PI / 4), Math.sin(rot - Math.PI / 4)];
    heldShadow(drawHand, [tipX, tipY], [Math.cos(rot), Math.sin(rot)], P('hrise', 0.05));
    drawHand(g);
  } catch (e) { console.log('no hand yet'); }
}
if (page === 'a3') {
  deskSurface();
  // ---- question booklet (left): a full page, set vertically, the passage then question 3 and its choices ----
  const bw = 800, bh = 1060, book = paperSheet(bw, bh, 5), b = book.getContext('2d');
  b.strokeStyle = 'rgba(38,38,43,0.85)'; b.lineWidth = 2; b.strokeRect(36, 36, bw - 72, bh - 72);
  vtext(b, '国語　二', bw - 66, 60, 28, 1.1, 'ShipporiB');
  b.fillStyle = '#26262b'; b.font = '20px Shippori'; b.textAlign = 'center'; b.fillText('— 4 —', bw / 2, bh - 54);
  // the passage: my own short story, nine columns right to left, a little smaller, like a real test page
  const ps = 25, pstep = 1.04, top = 64, colW = 40, colLen = Math.floor((bh - top - 96) / (ps * pstep));
  const passageText = '　駅前のバス停で、僕はまた答えを探していた。通りの向こうでは、みんなが同じ方向へ歩いていく。同じ制服、同じ鞄、同じ歩幅。誰も迷わない。改札では、胸の名札をかざすだけで扉が開く。\n　「正しい道は一つしかない」と先生は言った。僕はうなずいた。うなずくのは得意だった。\n　けれど本当は、ギターの音のことを考えていた。弦を一本はじくと、胸の奥で何かが鳴る。その音が何なのか、僕には名前が付けられない。答案用紙のどこにも、それを書く欄はなかった。';
  const cols = [];
  for (const para of passageText.split('\n')) {
    let col = '';
    for (const ch of para) {
      if (col.length === colLen) {
        if ('、。」'.includes(ch)) { col += ch; continue; }          // hangs at the foot of the column
        let carry = ''; while (col.endsWith('「')) { carry = '「' + carry; col = col.slice(0, -1); }
        cols.push(col); col = carry;
      }
      col += ch;
    }
    if (col) cols.push(col);
  }
  cols.forEach((t, i) => vtext(b, t, bw - 104 - i * colW, top, ps, pstep));
  // 傍線部ア: down the right of 「うなずくのは得意だった」
  const phrase = 'うなずくのは得意だった';
  { const flat = cols.join(''), k0 = flat.indexOf(phrase); let acc = 0, first = true;
    cols.forEach((t, i) => {
      const a = Math.max(k0, acc), z = Math.min(k0 + phrase.length, acc + t.length);
      if (k0 >= 0 && a < z) {
        const lx = bw - 104 - i * colW + ps * 0.62, y0 = top + (a - acc) * ps * pstep, y1 = top + (z - acc) * ps * pstep;
        b.strokeStyle = '#26262b'; b.lineWidth = 2; b.beginPath(); b.moveTo(lx, y0 + 3); b.lineTo(lx, y1 - 3); b.stroke();
        if (first) { b.fillStyle = '#26262b'; b.font = '15px Shippori'; b.textAlign = 'center'; b.fillText('ア', lx + 11, y0 + 10); first = false; }
      }
      acc += t.length;
    }); }
  // a rule between the passage and the questions
  const qx = bw - 104 - cols.length * colW - 14; b.strokeStyle = 'rgba(38,38,43,0.6)'; b.lineWidth = 1.2; b.beginPath(); b.moveTo(qx + 24, top); b.lineTo(qx + 24, bh - 90); b.stroke();
  const qs = 24, qstep = 1.04;
  vtext(b, '問三　傍線部ア「うなずくのは得意だった」とあるが、', qx, top, qs, qstep, 'Shippori');
  vtext(b, 'このときの「僕」の気持ちとして最も適切なものを、', qx - 36, top + qs * qstep, qs, qstep, 'Shippori');
  vtext(b, '次のア〜エから一つ選び、マークしなさい。', qx - 72, top + qs * qstep, qs, qstep, 'Shippori');
  ['ア　悲しい', 'イ　淋しい', 'ウ　腹が立つ', 'エ　どうでもいい'].forEach((t, i) => vtext(b, t, qx - 124 - i * 40, top + 26, 25, 1.05));
  // question 4, in the last two columns of the page
  { const q4 = '問四　「僕」が名前を付けられないものは何か。最も適切なものを選び、マークしなさい。', L = Math.floor((bh - top - 96) / (22 * 1.04));
    vtext(b, q4.slice(0, L), qx - 124 - 4 * 40 + 6, top, 22, 1.04, 'Shippori');
    vtext(b, q4.slice(L), qx - 124 - 4 * 40 - 26, top + 22 * 1.04 * 3, 22, 1.04, 'Shippori'); }
  place(book, P('bx', 330), P('by', 560), P('br', 0.06));

  // ---- the answer sheet (right): a real mark sheet. Bubbles are 5 x 3 mm; the sheet is B5, so ~6 px/mm ----
  const sw = 860, sh = 1040, sheet = paperSheet(sw, sh, 9), s = sheet.getContext('2d');
  const MM = 5.6, bx = v => v * MM;
  s.save(); s.translate(1.2, 0.8);    // the teal plate a hair off
  s.fillStyle = T(1); s.textBaseline = 'middle'; s.textAlign = 'left';
  s.font = '700 32px ZenKakuB'; s.fillText('国語　解答用紙', 64, 70);
  s.font = '500 17px ZenKaku'; s.fillText('令和八年度　第二学期　期末考査　（マーク式）', 64, 104);
  // name box
  s.strokeStyle = T(1); s.lineWidth = 2.2; s.strokeRect(470, 42, 330, 80); s.fillRect(470, 42, 62, 80);
  s.fillStyle = '#f6f4ee'; s.font = '700 24px ZenKakuB'; s.textAlign = 'center'; s.fillText('氏名', 501, 82);
  // the examinee number: four columns of 0-9 bubbles
  const nx0 = 92, ny0 = 168, ncw = 44, nrh = 22;
  s.fillStyle = T(0.12); s.fillRect(64, ny0 - 34, 4 * ncw + 52, 26); s.fillStyle = T(1); s.font = '700 15px ZenKakuB'; s.fillText('受験番号', 64 + (4 * ncw + 52) / 2, ny0 - 21);
  s.strokeStyle = T(0.9); s.lineWidth = 1.4;
  for (let c = 0; c < 4; c++) { s.strokeRect(nx0 + c * ncw - 16, ny0 - 6, 36, 26); }
  for (let c = 0; c < 4; c++) for (let d = 0; d < 10; d++) {
    const x = nx0 + c * ncw + 2, y = ny0 + 36 + d * nrh;
    s.beginPath(); s.ellipse(x, y, bx(1.9), bx(1.25), 0, 0, 7); s.stroke();
    s.fillStyle = T(0.85); s.font = '500 10px ZenKaku'; s.fillText(String(d), x, y + 0.5);
  }
  // the marking example and the rules
  const ex = 330; s.fillStyle = T(1); s.font = '700 15px ZenKakuB'; s.textAlign = 'left'; s.fillText('マーク例', ex, ny0 - 21);
  s.font = '500 14px ZenKaku'; s.fillText('良い例', ex, ny0 + 10); s.fillText('悪い例', ex + 120, ny0 + 10);
  s.strokeStyle = T(0.9);
  s.beginPath(); s.ellipse(ex + 74, ny0 + 10, bx(1.9), bx(1.25), 0, 0, 7); s.stroke();
  for (let k = 0; k < 3; k++) { s.beginPath(); s.ellipse(ex + 196 + k * 34, ny0 + 10, bx(1.9), bx(1.25), 0, 0, 7); s.stroke(); }
  { // printed examples: the good mark is solid, the bad ones are a tick, a dot and a stroke
    s.save(); s.fillStyle = '#2a2a2f'; s.beginPath(); s.ellipse(ex + 74, ny0 + 10, bx(1.9) - 1, bx(1.25) - 1, 0, 0, 7); s.fill();
    s.strokeStyle = '#2a2a2f'; s.lineWidth = 2.2; s.lineCap = 'round';
    const c0 = ex + 196; s.beginPath(); s.moveTo(c0 - 7, ny0 + 9); s.lineTo(c0 - 2, ny0 + 15); s.lineTo(c0 + 8, ny0 + 3); s.stroke();
    s.beginPath(); s.arc(ex + 230, ny0 + 10, 2.4, 0, 7); s.fill();
    s.beginPath(); s.moveTo(ex + 256, ny0 + 10); s.lineTo(ex + 272, ny0 + 10); s.stroke();
    s.restore(); }
  s.font = '500 13px ZenKaku';
  ['・HBの黒鉛筆で、○の中を正確にぬりつぶすこと。', '・はみ出したり、うすかったりすると読み取れません。', '・訂正は消しゴムできれいに消すこと。'].forEach((t, i) => s.fillText(t, ex, ny0 + 44 + i * 22));
  // the answer field: questions 1-20 in two columns, choices ア イ ウ エ
  const kana = ['ア', 'イ', 'ウ', 'エ'], fy0 = 476, frh = 19, fcol = [110, 500];
  const qY = i => fy0 + (i % 12) * frh * 2.0, qX = (i, j) => fcol[Math.floor(i / 12)] + 70 + j * 62;
  for (const c0 of fcol) { s.fillStyle = T(0.12); s.fillRect(c0 - 46, fy0 - 40, 330, 24); s.fillStyle = T(1); s.font = '700 14px ZenKakuB'; s.textAlign = 'center';
    s.fillText('解答番号', c0, fy0 - 28); s.fillText('解　答　欄', c0 + 70 + 1.5 * 62, fy0 - 28); }
  for (let i = 0; i < 24; i++) {
    const y = qY(i), c0 = fcol[Math.floor(i / 12)];
    s.fillStyle = T(i % 2 ? 0.0 : 0.06); s.fillRect(c0 - 46, y - frh * 0.95, 330, frh * 1.9);
    s.fillStyle = T(1); s.font = '700 16px ZenKakuB'; s.textAlign = 'center'; s.fillText(String(i + 1), c0, y);
    s.strokeStyle = T(0.95); s.lineWidth = 1.5;
    kana.forEach((k, j) => { const x = qX(i, j); s.beginPath(); s.ellipse(x, y, bx(1.9), bx(1.25), 0, 0, 7); s.stroke(); s.fillStyle = T(0.9); s.font = '500 11px ZenKaku'; s.fillText(k, x, y + 0.5); });
  }
  s.restore();
  // black timing marks down the left edge, one per answer row, and the corner marks
  s.fillStyle = '#17171b';
  for (let i = 0; i < 12; i++) s.fillRect(20, qY(i) - 5, 22, 10);
  for (const [x, y] of [[18, 18], [sw - 42, 18], [18, sh - 42], [sw - 42, sh - 42]]) s.fillRect(x, y, 24, 24);
  // her name, in her own pencil (graphite over the print), and her examinee number in the boxes
  pencilWrite(s, '鏡音　リン', 552, 84, 40, { seed: 8, font: 'Yomogi', jitter: 2.2 });
  [...'0314'].forEach((d, c) => pencilWrite(s, d, nx0 + c * ncw - 5 + (c % 2 ? 1.5 : -1), ny0 + 7 + (c === 2 ? 1.5 : 0), 25, { seed: 20 + c, jitter: 3.2, font: 'Yomogi' }));
  // her examinee number 0314, the answers so far: 1 イ, 2 エ, then question 3 (row index 2): every choice tried
  const RS = rng(41), rxm = bx(1.9) * 0.92, rym = bx(1.25) * 0.92;
  [0, 3, 1, 4].forEach((d, c) => pencilFill(s, nx0 + c * ncw + 2, ny0 + 36 + d * nrh, rxm, rym, 860, RS));
  pencilFill(s, qX(0, 1), qY(0), rxm, rym, 860, RS);
  pencilFill(s, qX(1, 3), qY(1), rxm, rym, 860, RS, { angle: -0.36 });
  for (let j = 0; j < 3; j++) erasedMark(s, qX(2, j), qY(2), rxm * 1.05, rym * 1.05, 860, RS, { angle: 0.08 - j * 0.05 });
  pencilFill(s, qX(2, 3), qY(2), rxm * 1.05, rym * 1.05, 860, RS, { dark: 1.35, over: 0.3, mess: 1.1, angle: -0.5 });
  // the reading machine's verdicts in the margin of each answer row, one print head for everything
  const HEAD = 1.4;
  const VK = P('vk', 1.4);   // the print head's dot pitch for the small verdicts (16-dot font, k px per dot)
  inkjetText(s, '正解', qX(0, 1), qY(0) + 19, { size: 16 * VK, align: 'center', seed: 1, matrix: true });
  inkjetText(s, '正解', qX(1, 3), qY(1) + 19, { size: 16 * VK, align: 'center', seed: 2, matrix: true });
  for (let j = 0; j < 4; j++) inkjetText(s, '不正解', qX(2, j), qY(2) + 19, { size: 16 * VK, align: 'center', seed: 5 + j, matrix: true });
  // and the verdict on question 3, printed big right across the answer field (over the teal print)
  // the machine prints the verdict right across the answer field, square to the paper, in the same 16-dot head
  if (q.get('slip') === '0') inkjetText(s, 'どれも不正解というオチでした', P('vlx', 430), qY(2) + P('vly', 118), { size: 16 * P('lk', 3.2), align: 'center', seed: 12, rot: P('vlr', 0), matrix: true });
  const SX = P('sx', 1170), SY = P('sy', 540), SR = P('sr', -0.035), SC = P('ssc', 1.0);
  place(sheet, SX, SY, SR, SC);
  const onSheet = (px, py) => { const dx = (px - sw / 2) * SC, dy = (py - sh / 2) * SC; return [SX + dx * Math.cos(SR) - dy * Math.sin(SR), SY + dx * Math.sin(SR) + dy * Math.cos(SR)]; };
  if (q.get('slip') !== '0') {
    // the result slip: a strip of thin paper with a torn top edge, printed by the reader in its 16-dot head
    const SWp = P('slw', 900), SHp = P('slh', 250), sl = document.createElement('canvas'); sl.width = SWp; sl.height = SHp; const x = sl.getContext('2d');
    x.fillStyle = '#f8f7f2'; x.beginPath(); x.moveTo(0, 8);
    for (let i = 0; i <= 90; i++) x.lineTo(i * SWp / 90, (i % 2) ? 2 : 9);
    x.lineTo(SWp, SHp); x.lineTo(0, SHp); x.closePath(); x.fill();
    x.fillStyle = TEAL; x.font = '700 22px ZenKakuB'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText('読取結果', 30, 38);
    x.font = '500 18px ZenKaku'; x.textAlign = 'right'; x.fillText('No.2026-0314　解答番号 3', SWp - 30, 38);
    x.strokeStyle = TEAL; x.setLineDash([4, 5]); x.lineWidth = 2; x.beginPath(); x.moveTo(30, 60); x.lineTo(SWp - 30, 60); x.stroke(); x.setLineDash([]);
    inkjetText(x, 'ア 不正解　イ 不正解　ウ 不正解　エ 不正解', SWp / 2, 100, { size: 16 * P('vk2', 1.9), align: 'center', seed: 13, matrix: true, dotr: 0.52 });
    inkjetText(x, 'どれも不正解というオチでした', SWp / 2, 182, { size: 16 * P('lk', 3.4), align: 'center', seed: 12, matrix: true, dotr: 0.52 });
    const cx = P('slx', 1010), cy = P('sly', 955), rr = P('slr', -0.045);
    const drawSlip = ctx => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rr); ctx.drawImage(sl, -SWp / 2, -SHp / 2); ctx.restore(); };
    hardShadow(drawSlip, P('slsx', 8), P('slsy', 10));
    drawSlip(g);
  }
  try {
    const hand = await img(`/art/cut/${q.get('hand') || 'hpg_1'}.png`);
    const [tx0, ty0] = onSheet(qX(2, 3) + rxm * 0.4, qY(2));
    const hs = P('hs', 0.6), tipX = P('tx', tx0 + P('tdx', 30)), tipY = P('ty', ty0 + P('tdy', -42)), rot = P('hr', 8) * Math.PI / 180;
    const kx = P('hkx', 10), ky = P('hky', 542);
    const drawHand = ctx => { ctx.save(); ctx.translate(tipX, tipY); ctx.rotate(rot); ctx.drawImage(hand, -kx * hs, -ky * hs, hand.width * hs, hand.height * hs); ctx.restore(); };
    heldShadow(drawHand, [tipX, tipY], [Math.cos(rot), Math.sin(rot)], P('hrise', 0.05));
    if (P('tlift', 1)) hardShadow(drawHand, LIGHT.dx * 2.2, LIGHT.dy * 2.2);   // lifted: the shadow of the whole hand falls further off
    drawHand(g);
  } catch (e) { console.log('no hand'); }
}
if (page === 'c') {
  // ---- C: 「その夢すら溝に捨てたのは」 her own hand erasing the dream she drew at six, at night ----
  for (const [fam, url] of [['Yomogi', '/assets/fonts/Yomogi-Regular.ttf']]) { const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f); }
  deskSurface();
  // the card's back, printed with the rules, lying beside the drawing
  const { drawCard } = await import('../lib/card.js');
  const cardC = document.createElement('canvas'); cardC.width = P('kw', 420); cardC.height = Math.round(P('kw', 420) / 1.5); drawCard(cardC, { side: 'back', seed: 4 });
  place(cardC, P('kx', 1150), P('ky', 200), P('kr', 0.16), 10);
  // the drawing: crayon on cheap paper, the top strip lettered by a six-year-old
  const art = await img('/art/design/out/crayon.png');
  const dw = 620, dh = Math.round(dw * art.height / art.width);
  const d = document.createElement('canvas'); d.width = dw; d.height = dh; const x = d.getContext('2d');
  x.drawImage(art, 0, 0, dw, dh);
  const crayonText = (t, cx, cy, size, rgb, rot, seed) => {
    const tc = document.createElement('canvas'); tc.width = dw; tc.height = Math.round(size * 1.6); const tx = tc.getContext('2d'), rr = rng(seed);
    tx.font = `${size}px Yomogi`; tx.textAlign = 'center'; tx.textBaseline = 'middle';
    // each glyph a little off the line and a little off the angle, the way a child letters
    const glyphs = [...t]; let w = 0; glyphs.forEach(ch => w += tx.measureText(ch).width * 1.08);
    let gx = dw / 2 - w / 2;
    glyphs.forEach(ch => { const cw = tx.measureText(ch).width * 1.08; tx.save(); tx.translate(gx + cw / 2, tc.height / 2 + (rr() - 0.5) * size * 0.16); tx.rotate((rr() - 0.5) * 0.22);
      for (let k = 0; k < 3; k++) { tx.fillStyle = `rgba(${rgb},${0.35 + rr() * 0.25})`; tx.fillText(ch, (rr() - 0.5) * 2.5, (rr() - 0.5) * 2.5); } tx.restore(); gx += cw; });
    // wax grain: the paper tooth shows through
    tx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < dw * tc.height / 18; i++) { tx.fillStyle = `rgba(0,0,0,${0.25 + rr() * 0.5})`; tx.fillRect(rr() * dw, rr() * tc.height, 1 + rr() * 2.5, 1 + rr() * 1.2); }
    x.save(); x.translate(0, cy - tc.height / 2); x.rotate(rot); x.drawImage(tc, cx - dw / 2, 0); x.restore();
  };
  crayonText('しょうらいの ゆめ', dw / 2, dh * 0.07, 64, '40,150,172', -0.025, 5);
  crayonText('ぎたりすと', dw / 2 + 10, dh * 0.07 + 70, 62, '58,58,64', 0.02, 9);
  // erasing: back-and-forth bands that lift the wax but never all of it; heaviest across her and the guitar
  // erasing in progress: her face is gone, the eraser is on the guitar neck now, the body still mostly there
  const RE = rng(23);
  const band = (u, v, strength, n) => {
    for (let i = 0; i < n; i++) {
      const cx = dw * (u + (RE() - 0.5) * 0.12), cy = dh * (v + (RE() - 0.5) * 0.06), len = dw * (0.1 + RE() * 0.16), ang = -0.55 + (RE() - 0.5) * 0.35;
      x.save(); x.translate(cx, cy); x.rotate(ang);
      x.fillStyle = `rgba(244,241,234,${strength * (0.6 + RE() * 0.5)})`;
      x.beginPath(); x.ellipse(0, 0, len / 2, dw * (0.025 + RE() * 0.02), 0, 0, 7); x.fill();
      x.strokeStyle = `rgba(150,140,150,${0.05 + RE() * 0.05})`; x.lineWidth = 1;
      for (let k = 0; k < 3; k++) { const yy = (RE() - 0.5) * dw * 0.035; x.beginPath(); x.moveTo(-len / 2, yy); x.lineTo(len / 2, yy + (RE() - 0.5) * 3); x.stroke(); }
      x.restore();
    }
  };
  band(0.38, 0.36, 0.62, 26);     // the face and bow: rubbed almost away
  band(0.5, 0.42, 0.42, 12);      // the shoulder toward the neck
  band(0.64, 0.47, 0.5, 10);      // the neck, where the eraser is now
  band(0.42, 0.56, 0.16, 6);      // the body: only grazed
  const dx = P('dx', 760), dy = P('dy', 560), dr = P('dr', -0.06);
  place(d, dx, dy, dr, 16);
  // eraser crumbs: little rolled grey-white pills, some tinted with crayon
  const RC = rng(31);
  for (let i = 0; i < 24; i++) {
    const a = -0.6 + (RC() - 0.5) * 2.6, r = 40 + RC() * 200, cx = P('ex', 874) - 60 + Math.cos(a) * r, cy = P('ey', 560) + 40 + Math.sin(a) * r * 0.6;
    const tint = ['226,224,218', '214,206,150', '186,214,226', '220,212,196'][Math.floor(RC() * 4)];
    g.save(); g.translate(cx, cy); g.rotate(RC() * 6.283);
    g.shadowColor = 'rgba(40,30,20,0.35)'; g.shadowBlur = 3; g.shadowOffsetY = 2;
    g.fillStyle = `rgb(${tint})`; const L = 3 + RC() * RC() * 18; g.beginPath(); g.ellipse(0, 0, L, 2 + RC() * 2.2, 0, 0, 7); g.fill(); g.restore();
  }
  // her hand pressing the eraser on the guitar in the drawing
  const hand = await img('/art/cut/hand_eraser_1.png');
  const hs = P('hs', 0.55), cx = P('ex', 874), cy = P('ey', 560), hx = cx - 70 * hs, hy = cy - 175 * hs;
  g.save(); g.globalAlpha = 0.25; g.filter = 'blur(12px) brightness(0)'; g.drawImage(hand, hx + 18, hy + 26, hand.width * hs, hand.height * hs); g.restore();
  g.drawImage(hand, hx, hy, hand.width * hs, hand.height * hs);
  // night: one desk lamp pool from the upper left, the rest falls off into the dark
  const lx = P('lx', 900), ly = P('ly', 470);
  g.save(); g.globalCompositeOperation = 'multiply';
  const v = g.createRadialGradient(lx, ly, 120, lx, ly, 1050);
  v.addColorStop(0, 'rgba(255,248,232,1)'); v.addColorStop(0.45, 'rgba(214,196,168,1)'); v.addColorStop(1, 'rgba(38,40,52,1)');
  g.fillStyle = v; g.fillRect(0, 0, W, H); g.restore();
  // the lyric, set vertically in the dark at the left
  g.save(); g.globalAlpha = 0.92;
  vtext(g, 'その夢すら溝に捨てたのは', P('lyx', 190), P('lyy', 150), P('lys', 62), 1.08, 'ShipporiB', '#eee9dc');
  g.restore();
}
if (page === 'c2') {
  // ---- C: 「その夢すら溝に捨てたのは」 the essay she wrote at six, kept folded in her card holder,
  // now being erased by her own hand under the desk lamp ----
  const LAMP = [P('lampx', 120), P('lampy', -260)], POOL = [P('lx', 1040), P('ly', 520)];
  const LDIR = (() => { const dx = POOL[0] - LAMP[0], dy = POOL[1] - LAMP[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; })();
  LIGHT.dx = LDIR[0] * P('lsh', 14); LIGHT.dy = LDIR[1] * P('lsh', 14);
  for (const [fam, url] of [['Yomogi', '/assets/fonts/Yomogi-Regular.ttf']]) { const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f); }
  // prop=1: the essay alone, flat and untouched, for the design board
  const PROP = q.get('prop') === '1';
  if (PROP) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); } else {
  deskSurface();
  const { drawCard } = await import('../lib/card.js');
  const cardC = document.createElement('canvas'); cardC.width = P('kw', 380); cardC.height = Math.round(P('kw', 380) / 1.5); drawCard(cardC, { blank: true, seed: 4, serial: '2026-0314' });
  place(cardC, P('kx', 1440), P('ky', 300), P('kr', -0.16));   // her blank card, half under the essay
  }
  // the manuscript sheet: teal-printed squares, vertical columns read right to left
  const SW = 940, SH = 1180, sh = paperSheet(SW, SH, 13), e = sh.getContext('2d');
  const cols = 11, rows = 13, sq = 64, gapc = 14, x0 = SW - 70, y0 = 120;
  const colX = c => x0 - sq / 2 - c * (sq + gapc), rowY = r => y0 + sq / 2 + r * sq;
  e.strokeStyle = 'rgba(33,142,163,0.7)'; e.lineWidth = 1.6;
  for (let c = 0; c < cols; c++) { const x = colX(c) - sq / 2; e.strokeRect(x, y0, sq, rows * sq); for (let r = 1; r < rows; r++) { e.beginPath(); e.moveTo(x, y0 + r * sq); e.lineTo(x + sq, y0 + r * sq); e.stroke(); } }
  e.lineWidth = 3; e.strokeRect(colX(cols - 1) - sq / 2 - 10, y0 - 10, cols * (sq + gapc) - gapc + 20, rows * sq + 20);
  e.fillStyle = 'rgba(33,142,163,0.9)'; e.font = '500 20px ZenKaku'; e.fillText('こくご　さくぶん', 40, 70);
  // a six-year-old's pencil, one glyph per square, on its own layer; punctuation and small kana sit high and right
  const RK = rng(41);
  const txt = document.createElement('canvas'); txt.width = SW; txt.height = SH; const sheetCtx = e;
  { const e = txt.getContext('2d');
  var write = (c, r0, text, opts = {}) => {
    let r = r0;
    for (const ch of text) {
      if (ch === '　') { r++; continue; }
      const small = 'ゃゅょっャュョッぁぃぅぇぉ'.includes(ch), punct = '、。'.includes(ch);
      const big = RK() < 0.18 ? 1.16 : 1;      // now and then a glyph comes out too big for its square
      const size = (opts.size ?? 46) * (small ? 0.72 : 1) * (0.76 + RK() * 0.34) * big;
      let x = colX(c), y = rowY(r);
      if (small) { x += sq * P('smx', 0.2); y -= sq * P('smy', 0.2); }
      if (punct) { x += sq * P('pux', 0.5); y -= sq * P('puy', 0.5); }
      e.save(); e.translate(x + (RK() - 0.5) * 15, y + (RK() - 0.5) * 13); e.rotate((RK() - 0.5) * 0.46);
      if ('ー〜「」'.includes(ch)) e.rotate(Math.PI / 2);   // vertical writing: the long vowel mark runs down the column
      e.font = `${size}px Yomogi`; e.textAlign = 'center'; e.textBaseline = 'middle';
      const press = 0.36 + RK() * 0.42;          // how hard she pressed on this one
      if (q.get('wobble') === '0') {
        for (let k = 0; k < 3; k++) { e.fillStyle = `rgba(44,44,50,${press * (0.7 + RK() * 0.4)})`; e.fillText(ch, (RK() - 0.5) * 2.4, (RK() - 0.5) * 2.4); }
      } else {
        const GS = Math.ceil(size * 1.7), gc = document.createElement('canvas'); gc.width = gc.height = GS; const gx = gc.getContext('2d');
        gx.font = e.font; gx.textAlign = 'center'; gx.textBaseline = 'middle'; gx.lineJoin = 'round';
        const col = `rgba(44,44,50,${Math.min(1, press * 1.25)})`; gx.fillStyle = gx.strokeStyle = col;
        gx.lineWidth = size * (0.012 + RK() * 0.03);  // heavier or lighter line, glyph by glyph
        gx.fillText(ch, GS / 2, GS / 2); gx.strokeText(ch, GS / 2, GS / 2);
        const A = P('wobA', 1.6) * size / 46, f1 = 6.283 / (size * (0.45 + RK() * 0.3)), p1 = RK() * 6.283, f2 = 6.283 / (size * (0.5 + RK() * 0.3)), p2 = RK() * 6.283;
        const w1 = document.createElement('canvas'); w1.width = w1.height = GS; const wx = w1.getContext('2d');
        for (let yy = 0; yy < GS; yy += 2) wx.drawImage(gc, 0, yy, GS, 2, A * Math.sin(yy * f1 + p1), yy, GS, 2);
        const w2 = document.createElement('canvas'); w2.width = w2.height = GS; const wy = w2.getContext('2d');
        for (let xx = 0; xx < GS; xx += 2) wy.drawImage(w1, xx, 0, 2, GS, xx, A * Math.sin(xx * f2 + p2), 2, GS);
        e.globalAlpha = 0.92; e.drawImage(w2, -GS / 2, -GS / 2); e.globalAlpha = 1;
      }
      e.restore(); r++;
    }
  };
  write(0, 2, 'しょうらいの　ゆめ', { size: 50 });
  write(1, 6, '一ねん二くみ', { size: 40 });       // class and name sit at the foot of their columns, one square left empty below
  write(2, 5, 'かがみね　りん', { size: 44 });
  var paras = ['　わたしは、おおきく　なったら、ギターを　ひく　ひとに　なりたいです。', '　おうちで　ギターを　ひくと、みんなが　わらって　くれます。'];
  var cells = [];                         // every square the essay uses: { ch, c, r, para, i }
  { let c = 3, r = 0;
    paras.forEach((t, pi) => {
      if (r > 0) { c++; r = 0; }
      [...t].forEach((ch, i) => {
        if (r === rows) { if ('、。'.includes(ch)) { cells.push({ ch, c, r: rows - 1, para: pi, i, hang: true }); return; } c++; r = 0; }
        cells.push({ ch, c, r, para: pi, i }); r++;
      });
    });
  }
  for (const k of cells) { if (k.ch === '　') continue; if (k.hang) { write(k.c, k.r, k.ch); } else write(k.c, k.r, k.ch); }
  var lastCell = cells[cells.length - 1];
  // pencil grain over the writing
  e.save(); e.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 9000; i++) { e.fillStyle = `rgba(0,0,0,${0.04 + RK() * 0.08})`; e.fillRect(RK() * SW, RK() * SH, 1 + RK() * 2, 1); }
  e.restore(); }
  // the teacher's stamp in teal ink, in the empty squares after the essay; the ink is uneven inside the ring only
  { const sc0 = lastCell.r < rows - 5 ? lastCell.c : lastCell.c + 1, sr0 = lastCell.r < rows - 5 ? lastCell.r + 3 : 7;
    e.save(); e.translate(colX(Math.min(sc0, cols - 1)) - 10, rowY(sr0)); e.rotate(-0.18); }
  const st = document.createElement('canvas'); st.width = st.height = 180; const sx = st.getContext('2d');
  sx.translate(90, 90); sx.strokeStyle = 'rgba(33,142,163,0.8)'; sx.lineWidth = 6; sx.beginPath(); sx.arc(0, 0, 70, 0, 7); sx.stroke();
  sx.lineWidth = 2; sx.beginPath(); sx.arc(0, 0, 60, 0, 7); sx.stroke();
  sx.fillStyle = 'rgba(33,142,163,0.82)'; sx.textAlign = 'center'; sx.textBaseline = 'middle'; sx.font = '700 24px ZenKakuB'; sx.fillText('よく', 0, -16); sx.font = '700 18px ZenKakuB'; sx.fillText('かけました', 0, 15);
  sx.setTransform(1, 0, 0, 1, 0, 0); sx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 160; i++) { const a = RK() * 6.283, r = RK() * 74; sx.fillStyle = `rgba(0,0,0,${0.15 + RK() * 0.35})`; sx.beginPath(); sx.arc(90 + Math.cos(a) * r, 90 + Math.sin(a) * r, 0.8 + RK() * 1.6, 0, 7); sx.fill(); }
  e.drawImage(st, -90, -90); e.restore();
  // folded small to fit the card holder: one vertical and one horizontal crease
  for (const [ax, ay, bx, by] of [[SW / 2, 0, SW / 2, SH], [0, SH / 2, SW, SH / 2]]) {
    e.strokeStyle = 'rgba(255,255,250,0.6)'; e.lineWidth = 2.5; e.beginPath(); e.moveTo(ax - 1.5, ay - 1.5); e.lineTo(bx - 1.5, by - 1.5); e.stroke();
    e.strokeStyle = 'rgba(110,100,85,0.22)'; e.lineWidth = 2.5; e.beginPath(); e.moveTo(ax + 1.5, ay + 1.5); e.lineTo(bx + 1.5, by + 1.5); e.stroke();
  }
  // erasing in progress, column by column through the dream: the graphite comes off the text layer only,
  // and leaves a faint grey smear on the paper along the rubbing direction
  const RE = rng(23), tx = txt.getContext('2d');
  const eraseCol = (c, r0, r1, strength) => {
    for (let k = 0; k < 10; k++) {
      const cy = rowY(r0) + RE() * (rowY(r1) - rowY(r0)), len = sq * (1.6 + RE() * 2.6), w = sq * (0.34 + RE() * 0.16), ang = Math.PI / 2 + (RE() - 0.5) * 0.45, cx = colX(c) + (RE() - 0.5) * sq * 0.4;
      tx.save(); tx.translate(cx, cy); tx.rotate(ang); tx.globalCompositeOperation = 'destination-out';
      const gr = tx.createRadialGradient(0, 0, 0, 0, 0, len / 2); gr.addColorStop(0, `rgba(0,0,0,${strength})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      tx.fillStyle = gr; tx.scale(1, w / (len / 2)); tx.beginPath(); tx.arc(0, 0, len / 2, 0, 7); tx.fill(); tx.restore();
      e.save(); e.translate(cx, cy); e.rotate(ang); e.strokeStyle = 'rgba(110,110,118,0.07)'; e.lineWidth = 1.2;
      for (let j = 0; j < 5; j++) { const yy = (RE() - 0.5) * w; e.beginPath(); e.moveTo(-len / 2, yy); e.lineTo(len / 2, yy + (RE() - 0.5) * 3); e.stroke(); }
      e.restore();
    }
  };
  const dreamText = 'ギターを　ひく　ひとに　なりたい', p0 = paras[0].indexOf(dreamText);
  const dream = cells.filter(k => k.para === 0 && k.i >= p0 && k.i < p0 + dreamText.length && k.ch !== '　');
  const frontier = Math.round(dream.length * P('erased', 0.55));   // how far she has got
  var eraserCell = dream[Math.min(frontier, dream.length - 1)];
  const rub = (k, strength) => {
    const x0 = colX(k.c) - sq / 2, y0q = rowY(k.r) - sq / 2;
    // the smear: the graphite dragged up and down the column a little, faint, on the paper
    for (let d = -2; d <= 2; d++) { if (!d) continue; e.save(); e.globalAlpha = 0.07 * strength; e.drawImage(txt, x0, y0q, sq, sq, x0 + (RE() - 0.5) * 4, y0q + d * sq * 0.18, sq, sq); e.restore(); }
    // then the text layer loses most of its graphite in that square
    tx.save(); tx.globalCompositeOperation = 'destination-out'; tx.fillStyle = `rgba(0,0,0,${strength})`;
    tx.beginPath(); tx.ellipse(colX(k.c) + (RE() - 0.5) * 4, rowY(k.r), sq * 0.46, sq * 0.56, 0, 0, 7); tx.fill(); tx.restore();
    e.save(); e.strokeStyle = 'rgba(110,110,118,0.08)'; e.lineWidth = 1.2;
    for (let j = 0; j < 4; j++) { const xx = colX(k.c) + (RE() - 0.5) * sq * 0.6; e.beginPath(); e.moveTo(xx, y0q - sq * 0.2); e.lineTo(xx + (RE() - 0.5) * 3, y0q + sq * 1.2); e.stroke(); }
    e.restore();
  };
  if (!PROP) { dream.forEach((k, j) => { if (j < frontier) rub(k, P('rubs', 0.86)); else if (j === frontier) rub(k, P('rubf', 0.45)); }); }
  e.drawImage(txt, 0, 0);
  if (!PROP && q.get('tear') !== '0') {
    // her tears on the essay. The fresh one is still a bead sitting on the paper: a little lens that magnifies the
    // pencil under it, darker at the rim away from the lamp, a bright caustic where it focuses the light on the far
    // side, a specular highlight toward the lamp and a faint shadow. The older one has soaked in: a flat round a touch
    // darker than the dry paper, darkest at the tide line, with no outline drawn round it.
    const RT = rng(91);
    // the lamp's centre in sheet pixels (the same numbers the lamp pool uses), to light the bead from the right side
    const exq = P('sx', 1010), eyq = P('sy', 545), erq = P('sr', 0.04), scq = P('ssc', 0.72);
    const ldx = P('lx', 1040) - exq, ldy = P('ly', 520) - eyq;
    const lsx = (ldx * Math.cos(-erq) - ldy * Math.sin(-erq)) / scq + SW / 2, lsy = (ldx * Math.sin(-erq) + ldy * Math.cos(-erq)) / scq + SH / 2;
    const drops = q.get('tearicon') === '1'
      ? [['bead', P('tj1', 10), P('tb', 0.42), P('t1dx', 0.06), P('t1dy', -0.1)], ['soak', P('tj2', 5), P('ts', 0.3), P('t2dx', -0.2), P('t2dy', 0.3)]]
      : [['soak', P('tj1', 10), P('tb', 0.52), P('t1dx', 0.1), P('t1dy', -0.05)], ['soak', P('tj2', 5), P('ts', 0.4), P('t2dx', -0.25), P('t2dy', 0.35)], ['soak', P('tj3', 8), P('ts3', 0.3), P('t3dx', 0.3), P('t3dy', 0.4)]];
    for (const [kind, jj, rk, ddx, ddy] of drops) {
      if (rk <= 0) continue;
      const k = dream[Math.min(dream.length - 1, Math.max(0, Math.round(jj)))];
      const tx0 = colX(k.c) + ddx * sq, ty0 = rowY(k.r) + ddy * sq, rr = sq * rk;
      if (kind === 'bead') window.__bead = [tx0, ty0, rr];
      const ph = RT() * 6.283, ph2 = RT() * 6.283, sq2 = 0.92 + RT() * 0.06;
      const path = (c) => { c.beginPath(); for (let i = 0; i <= 72; i++) { const an = i / 72 * 6.283, w = rr * (1 + 0.035 * Math.sin(an * 3 + ph) + 0.02 * Math.sin(an * 5 + ph2)); i ? c.lineTo(Math.cos(an) * w, Math.sin(an) * w * sq2) : c.moveTo(w, 0); } c.closePath(); };
      let ux = lsx - tx0, uy = lsy - ty0; const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
      if (kind === 'soak') {
        e.save(); e.translate(tx0, ty0);
        // soaked: a flat darker, cooler tone (the desk shows through), darkest in a band at the tide line
        path(e); e.fillStyle = 'rgba(96,94,92,0.16)'; e.fill();
        e.save(); path(e); e.clip(); e.lineWidth = rr * 0.22; e.strokeStyle = 'rgba(92,86,76,0.16)'; path(e); e.stroke(); e.restore();
        e.lineWidth = 1.1; e.strokeStyle = 'rgba(96,88,74,0.42)'; path(e); e.stroke();
        // the pucker round it: a light ridge toward the lamp (upper left), a soft dark crease away from it
        e.lineCap = 'round';
        e.strokeStyle = 'rgba(255,255,250,0.55)'; e.lineWidth = 1.4; e.beginPath(); e.arc(0, 0, rr * 1.12, 3.4, 4.6); e.stroke();
        e.strokeStyle = 'rgba(110,102,88,0.22)'; e.lineWidth = 1.4; e.beginPath(); e.arc(0, 0, rr * 1.1, 0.2, 1.5); e.stroke();
        e.restore();
        continue;
      }
      // what is under the bead, put back a little magnified inside it
      const R = Math.ceil(rr * 1.4), under = document.createElement('canvas'); under.width = under.height = 2 * R;
      under.getContext('2d').drawImage(e.canvas, tx0 - R, ty0 - R, 2 * R, 2 * R, 0, 0, 2 * R, 2 * R);
      e.save(); e.translate(tx0 - ux * rr * 0.16, ty0 - uy * rr * 0.16); path(e); e.fillStyle = 'rgba(58,62,70,0.14)'; e.fill(); e.restore();
      e.save(); e.translate(tx0, ty0); path(e); e.save(); e.clip();
      const mag = P('tmag', 1.16); e.drawImage(under, -R * mag, -R * mag, 2 * R * mag, 2 * R * mag);
      e.fillStyle = 'rgba(196,210,216,0.10)'; e.fillRect(-R, -R, 2 * R, 2 * R);
      const g2 = e.createRadialGradient(ux * rr * 0.3, uy * rr * 0.3, rr * 0.5, 0, 0, rr * 1.02);
      g2.addColorStop(0, 'rgba(58,62,70,0)'); g2.addColorStop(1, 'rgba(58,62,70,0.34)');
      e.fillStyle = g2; e.fillRect(-R, -R, 2 * R, 2 * R);
      e.fillStyle = 'rgba(255,255,246,0.5)'; e.beginPath(); e.ellipse(-ux * rr * 0.5, -uy * rr * 0.5, rr * 0.3, rr * 0.16, Math.atan2(uy, ux) + Math.PI / 2, 0, 7); e.fill();
      e.restore();
      e.strokeStyle = 'rgba(64,68,76,0.32)'; e.lineWidth = 0.9; e.stroke();
      e.fillStyle = 'rgba(255,255,255,0.96)'; e.beginPath(); e.ellipse(ux * rr * 0.42, uy * rr * 0.42, rr * 0.17, rr * 0.09, Math.atan2(uy, ux) + Math.PI / 2, 0, 7); e.fill();
      e.restore();
    }
  }
  const ex = P('sx', 1010), ey = P('sy', 545), er = P('sr', 0.04), sc = P('ssc', 0.72);
  // a point on the sheet (sheet pixels) to the frame
  const onSheet = (px, py) => { const dx = (px - SW / 2) * sc, dy = (py - SH / 2) * sc; return [ex + dx * Math.cos(er) - dy * Math.sin(er), ey + dx * Math.sin(er) + dy * Math.cos(er)]; };
  const shS = document.createElement('canvas'); shS.width = Math.round(SW * sc); shS.height = Math.round(SH * sc); shS.getContext('2d').drawImage(sh, 0, 0, shS.width, shS.height);
  place(shS, ex, ey, er);
  if (!PROP && window.__bead && q.get('drop') === '1') {
    const [bx0, by0] = onSheet(window.__bead[0], window.__bead[1]), rd = window.__bead[2] * sc * P('dropk', 0.62);
    const dx = bx0 + P('dropx', -26), dy = by0 + P('dropy', -40);
    const drawDrop = (c, fill) => { c.beginPath(); c.moveTo(dx, dy - rd * 1.9); c.bezierCurveTo(dx + rd * 0.35, dy - rd * 1.1, dx + rd, dy - rd * 0.4, dx + rd, dy + rd * 0.1);
      c.arc(dx, dy + rd * 0.1, rd, 0, Math.PI); c.bezierCurveTo(dx - rd, dy - rd * 0.4, dx - rd * 0.35, dy - rd * 1.1, dx, dy - rd * 1.9); c.closePath(); c.fillStyle = fill; c.fill(); };
    hardShadow(c => drawDrop(c, '#000'), LIGHT.dx * P('drops', 3.2), LIGHT.dy * P('drops', 3.2));
    drawDrop(g, 'rgba(214,226,232,0.55)');
    g.save(); g.strokeStyle = 'rgba(70,76,84,0.55)'; g.lineWidth = 1.2; drawDrop({ beginPath: () => g.beginPath(), moveTo: (...a) => g.moveTo(...a), bezierCurveTo: (...a) => g.bezierCurveTo(...a), arc: (...a) => g.arc(...a), closePath: () => g.closePath(), set fillStyle(v) {}, fill: () => g.stroke() }, ''); g.restore();
    g.fillStyle = 'rgba(255,255,255,0.95)'; g.beginPath(); g.ellipse(dx - rd * 0.35, dy - rd * 0.15, rd * 0.22, rd * 0.4, -0.4, 0, 7); g.fill();
  }
  if (!PROP) {
  // eraser crumbs: little rolled curls of rubber and graphite, gathered along the squares she has rubbed
  const RC = rng(31), rubbed = dream.slice(0, frontier + 1);
  for (let i = 0; i < 16; i++) {
    const k = rubbed[Math.floor(RC() * rubbed.length)], [px, py] = onSheet(colX(k.c) + (RC() - 0.5) * sq * 1.6, rowY(k.r) + (RC() - 0.5) * sq * 1.2);
    const len = 5 + RC() * 9, bend = (RC() - 0.5) * 1.6, ang = RC() * 6.283, wid = 2.2 + RC() * 1.6;
    g.save(); g.translate(px, py); g.rotate(ang); g.lineCap = 'round';
    const curl = (ctx) => { ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.quadraticCurveTo(0, bend * len, len / 2, 0); ctx.stroke(); };
    g.strokeStyle = 'rgba(60,60,66,0.55)'; g.lineWidth = wid + 1.2; curl(g);                  // its dark rolled edge
    g.strokeStyle = RC() < 0.6 ? '#dedbd3' : '#c4c3c0'; g.lineWidth = wid; curl(g);          // rubber
    g.fillStyle = 'rgba(44,44,50,0.7)'; for (let k = 0; k < 3; k++) { g.fillRect((RC() - 0.5) * len, (RC() - 0.5) * wid * 0.6, 1.2, 1.2); }   // graphite flecks
    g.restore();
  }
  // her hand pressing the eraser on the column she is erasing
  try {
    const hand = await img(`/art/cut/${q.get('hand') || 'hand_eraser2_1'}.png`);
    // rotated about the eraser so the forearm comes up from below and the sleeve's cut edge stays outside the frame
    // the eraser sits on column 5 (the dream), row 6; the hand keeps its real size against the paper
    const [ecx0, ecy0] = onSheet(colX(eraserCell.c), rowY(eraserCell.r));
    const hs = P('hs', 0.65 * sc / 0.86), cx = P('ecx', ecx0), cy = P('ecy', ecy0), kx = P('hkx', 60), ky = P('hky', 170), rot = P('hr', 45) * Math.PI / 180;
    const drawHand = ctx => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.drawImage(hand, -kx * hs, -ky * hs, hand.width * hs, hand.height * hs); ctx.restore(); };
    // the eraser presses the paper; the forearm rises off the desk toward the bottom of the frame
    heldShadow(drawHand, [cx, cy], [Math.sin(rot) * 0.5, Math.cos(rot)], P('hrise', 0.05));
    drawHand(g);
    // hand2: her other hand flat on the paper, holding it down so it does not slide while she scrubs
    if (q.get('hand2')) {
      const h2 = await img(`/art/cut/${q.get('hand2')}.png`);
      const s2 = P('h2s', hs), x2 = P('h2x', 600), y2 = P('h2y', 700), r2 = P('h2r', 0) * Math.PI / 180;
      const draw2 = ctx => { ctx.save(); ctx.translate(x2, y2); ctx.rotate(r2); ctx.drawImage(h2, -h2.width * s2 / 2, -h2.height * s2 * 0.35, h2.width * s2, h2.height * s2); ctx.restore(); };
      hardShadow(draw2, P('h2sx', LIGHT.dx), P('h2sy', LIGHT.dy));
      draw2(g);
    }
    // the paper buckles a little ahead of the eraser: short curved wrinkles in the sheet's own grey
    if (q.get('wrinkle') !== '0') {
      const RW = rng(77);
      for (let k = 0; k < P('wn', 5); k++) {
        const a0 = rot - Math.PI / 2 + (RW() - 0.5) * 0.9, r0 = 40 + RW() * 30, len = 30 + RW() * 40;
        const wx = cx + Math.cos(a0) * r0, wy = cy + Math.sin(a0) * r0;
        g.save(); g.translate(wx, wy); g.rotate(a0); g.lineCap = 'round';
        g.strokeStyle = 'rgba(255,255,250,0.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -1.2); g.quadraticCurveTo(len / 2, (RW() - 0.5) * 8 - 1.2, len, -1.2); g.stroke();
        g.strokeStyle = 'rgba(110,100,85,0.28)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, 1.2); g.quadraticCurveTo(len / 2, (RW() - 0.5) * 8 + 1.2, len, 1.2); g.stroke();
        g.restore();
      }
    }
  } catch (err) { console.log('no hand', err.message); }
  const lit = document.createElement('canvas'); lit.width = W; lit.height = H; lit.getContext('2d').drawImage(cv, 0, 0);
  // night: one desk lamp. Its pool is drawn the way the 3D shots draw light: flat steps with hard edges
  // (lit, one narrow shadow step, night), never a gradient. The pool holds the whole sheet, the hand and the
  // forearm (its lower edge falls outside the frame), so its edges only cross empty desk.
  const lx = P('lx', 1040), ly = P('ly', 520), rx1 = P('lrx', 700), ry1 = P('lry', 620), band = P('lband', 64);
  g.save(); g.globalCompositeOperation = 'multiply';
  g.fillStyle = 'rgb(58,62,80)'; g.fillRect(0, 0, W, H);
  g.restore();
  // put the lamp-lit pool back: redraw the scene inside the ellipses from a copy taken before darkening
  g.save(); g.globalCompositeOperation = 'source-over';
  const LS = P('lshift', 70), OX = LDIR[0] * LS, OY = LDIR[1] * LS;
  const stepFill = (rx, ry, tint, k = -0.25) => { g.save(); g.beginPath(); g.ellipse(lx + OX * k, ly + OY * k, rx, ry, 0, 0, 7); g.clip(); g.drawImage(lit, 0, 0); g.globalCompositeOperation = 'multiply'; g.fillStyle = tint; g.fillRect(0, 0, W, H); g.restore(); };
  // the one shadow step at the rim of the pool is the print's shadow screen, the same dots as every other shadow
  if (q.get('lampdots') !== '0') {
    // the light falls off in two halftone steps toward the night: lit paper with night-coloured dots, sparse then dense
    const NIGHT = q.get('night') ?? '#2e3546';
    for (const [grow, cov] of (P('lsteps', 1) >= 2 ? [[1.0, P('pen2', 0.5)], [0.5, P('pen1', 0.22)]] : [[1.0, P('pen1', 0.3)]])) {
      g.save(); g.beginPath(); g.ellipse(lx + OX * grow, ly + OY * grow, rx1 + band * grow, ry1 + band * grow, 0, 0, 7); g.clip(); g.drawImage(lit, 0, 0);
      g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgb(236,230,220)'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over'; g.drawImage(screenPattern(NIGHT, cov), 0, 0); g.restore();
    }
  } else stepFill(rx1 + band, ry1 + band, 'rgb(150,144,140)');
  stepFill(rx1, ry1, 'rgb(255,247,232)');
  g.restore();
  g.save(); g.globalAlpha = 0.92;
  if (q.get('larc') === '0') vtext(g, 'その夢すら溝に捨てたのは', P('lyx', 170), P('lyy', 150), P('lys', 62), 1.08, 'ShipporiB', '#eee9dc');
  else {
    const LYR = 'その夢すら溝に捨てたのは', LS = P('lys', 62), stepL = LS * P('lstep', 1.08);
    const rxT = rx1 + band + P('lgap', 58), ryT = ry1 + band + P('lgap', 58);
    let th = Math.PI + Math.asin(Math.max(-1, Math.min(1, (ly - (P('lyy', 150) + LS / 2)) / ryT)));
    g.fillStyle = '#eee9dc'; g.font = `${LS}px ShipporiB`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const ch of LYR) {
      const x = lx + rxT * Math.cos(th), y = ly + ryT * Math.sin(th);
      const tx = rxT * Math.sin(th), ty = -ryT * Math.cos(th);   // the way down the rim
      g.save(); g.translate(x, y); g.rotate(Math.atan2(ty, tx) - Math.PI / 2); g.fillText(ch, 0, 0); g.restore();
      // advance one glyph step along the rim
      let walked = 0; while (walked < stepL) { const d = 0.002, sp = Math.hypot(rxT * Math.sin(th), ryT * Math.cos(th)); th -= d; walked += sp * d; }
    }
  }
  g.restore();
  }
}
// full-film segment pages (docs/全片分镜.md): ?page=seg_<id> loads web/scenes/segments/seg_<id>.js and calls its default
// export with the same helper bag as the demo pages; each segment lives in its own file, so segments can be built in parallel
if (page.startsWith('seg_')) {
  const fx = new FontFace('ShipporiX', 'url(/assets/fonts/ShipporiMincho-ExtraBold.ttf)'); await fx.load(); document.fonts.add(fx);
  const mod = await import(`./segments/${page}.js`);
  await mod.default({ g, W, H, P, q, rng, img, rinPalImage, pencilFill, erasedMark, inkjetText });
}
// every page leaves window.__audit for the renderer (docs/制作约定.md 第九节); pages built on web/lib/ (a2v4, c1a and new ones)
// set it themselves with publishAudit() (web/lib/score.js); the old pages get an empty one marked legacy
window.__audit ??= { id: page, legacy: true, beat: { events: 0, off: 0, offEvents: [] }, holds: [], holdProblems: [],
                     layout: { boxes: [], overlaps: [], outOfFrame: [] }, drawings: [], events: [] };
window.__ready = true;
