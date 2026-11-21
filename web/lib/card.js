// The answer-sheet name card worn by everyone in the film, drawn in code at any size.
// Landscape, height = width / 1.5 (the cards in the character art hang landscape from a clip).
// Printed grid and labels are in the "dropout" teal the reading machine cannot see; the machine
// reads only black: the corner marks, the timing marks and the pencil marks people fill in.
// All lengths are fractions of the card width u.

export const INK = '#218EA3';            // dropout teal (also her eye colour)
export const PAPER = '#f5f3ed';
export const CARD_RATIO = 1.5;
export const CARD_FONTS = [
  ['ZenKaku', '/assets/fonts/ZenKakuGothicNew-Medium.ttf'],
  ['ZenKakuB', '/assets/fonts/ZenKakuGothicNew-Bold.ttf'],
  ['DotG', '/assets/fonts/DotGothic16-Regular.ttf'],
  ['Klee', '/assets/fonts/kleeone_KleeOne-SemiBold.ttf'],
];

export async function loadCardFonts() {
  await Promise.all(CARD_FONTS.map(async ([fam, url]) => { const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f); }));
}

export function rng(seed = 1) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// Inkjet print: the text is laid out normally, then re-printed as a fine field of ink dots whose
// size follows the glyph coverage, each dot bleeding a little into the paper. Reads as machine print on
// paper, not as a screen font. align: 'left' | 'center'.
export function inkjetText(g, text, x, y, { size = 40, font = 'ZenKaku', weight = 500, align = 'left', color = [22, 22, 26], rot = 0, seed = 3, pitch = null, matrix = false, dotr = 0.46 } = {}) {
  const R = rng(seed);
  if (matrix) return matrixText(g, text, x, y, { size, align, color, rot, R, dotr });
  const m = document.createElement('canvas').getContext('2d');
  m.font = `${weight} ${size}px ${font}`;
  const tw = Math.ceil(m.measureText(text).width) + size, th = Math.ceil(size * 1.6);
  const c = document.createElement('canvas'); c.width = tw; c.height = th; const t = c.getContext('2d');
  t.font = `${weight} ${size}px ${font}`; t.textBaseline = 'middle'; t.fillStyle = '#000'; t.fillText(text, size / 2, th / 2);
  const d = t.getImageData(0, 0, tw, th).data;
  const step = pitch ?? Math.max(1.6, size / 15);
  g.save(); g.translate(x, y); g.rotate(rot);
  const ox = align === 'center' ? -tw / 2 : -size / 2, oy = -th / 2;
  for (let yy = 0; yy < th; yy += step) for (let xx = (Math.floor(yy / step) % 2) * step / 2; xx < tw; xx += step) {
    const a = d[(Math.floor(yy) * tw + Math.floor(xx)) * 4 + 3] / 255;
    if (a < 0.06) continue;
    const r = step * 0.62 * Math.sqrt(a) * (0.85 + R() * 0.3);
    g.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${0.8 + R() * 0.2})`;
    g.beginPath(); g.arc(ox + xx + (R() - 0.5) * step * 0.25, oy + yy + (R() - 0.5) * step * 0.25, r, 0, 7); g.fill();
  }
  g.restore();
}

// the reading machine's print head: a 16-dot matrix. The text is set in DotGothic16 at 16 x k px, so each pixel of
// the font is one k x k cell; every cell is either one round dot of ink or nothing, like a receipt or a ticket.
function matrixText(g, text, x, y, { size, align, color, rot, R, dotr = 0.46 }) {
  const k = size / 16, m = document.createElement('canvas').getContext('2d');
  m.font = `${size}px DotG`;
  const tw = Math.ceil(m.measureText(text).width / k + 2) * Math.ceil(k) + Math.ceil(k) * 2, th = Math.ceil(size * 1.4);
  const c = document.createElement('canvas'); c.width = tw; c.height = th; const t = c.getContext('2d');
  t.font = `${size}px DotG`; t.textBaseline = 'middle'; t.fillStyle = '#000'; t.fillText(text, k, th / 2);
  const d = t.getImageData(0, 0, tw, th).data;
  const cov = (cx, cy) => { let s = 0, n = 0; for (let yy = Math.floor(cy); yy < Math.floor(cy + k); yy++) for (let xx = Math.floor(cx); xx < Math.floor(cx + k); xx++) { if (xx < 0 || yy < 0 || xx >= tw || yy >= th) continue; s += d[(yy * tw + xx) * 4 + 3]; n++; } return n ? s / n / 255 : 0; };
  // find the offset where the font's own pixels fall into the cells (coverage nearest to 0 or 1)
  let best = [0, 0], bestScore = -1;
  for (const ox of [0, 0.25, 0.5, 0.75]) for (const oy of [0, 0.25, 0.5, 0.75]) {
    let sc = 0; for (let cy = oy * k; cy < th; cy += k * 3) for (let cx = ox * k; cx < tw; cx += k * 3) sc += Math.abs(cov(cx, cy) - 0.5);
    if (sc > bestScore) { bestScore = sc; best = [ox * k, oy * k]; }
  }
  g.save(); g.translate(x, y); g.rotate(rot);
  const ox = align === 'center' ? -tw / 2 : 0, oy = -th / 2;
  for (let cy = best[1]; cy < th - 0.5; cy += k) for (let cx = best[0]; cx < tw - 0.5; cx += k) {
    if (cov(cx, cy) < 0.45) continue;
    g.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${0.86 + R() * 0.14})`;
    g.beginPath(); g.arc(ox + cx + k / 2 + (R() - 0.5) * k * 0.12, oy + cy + k / 2 + (R() - 0.5) * k * 0.12, k * (dotr + R() * 0.05), 0, 7); g.fill();
  }
  g.restore();
}

function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// pencil fill, the way a hand fills a bubble: one zig-zag scribble of soft graphite strokes at a slant,
// stroke ends poking a little past the oval (over), a second pass across when pressed hard (dark > 1),
// strays past the edge when filled in anger (mess), and the sheen of graphite along the strokes.
// The edge is made by the strokes themselves, never a clean vector oval.
export function pencilFill(g, cx, cy, rx, ry, u, R, { over = 0.06, dark = 1, angle = -0.42, mess = 0 } = {}) {
  g.save(); g.translate(cx + (R() - 0.5) * rx * 0.06, cy + (R() - 0.5) * ry * 0.08); g.rotate(angle + (R() - 0.5) * 0.12);
  g.lineCap = 'round'; g.lineJoin = 'round';
  // the oval in the rotated frame: half-width of the chord at height y
  const ca = Math.cos(-angle), sa = Math.sin(-angle);
  const chord = y => {           // intersect the horizontal line at height y (rotated frame) with the oval
    let lo = 0, hi = rx * 2;
    const inside = x => { const X = x * ca - y * sa, Y = x * sa + y * ca; return (X * X) / (rx * rx) + (Y * Y) / (ry * ry) <= 1; };
    let c = 0; for (let k = -40; k <= 40; k++) { const x = (k / 40) * rx * 1.6; if (inside(x)) { c = x; break; } }
    let L = null, Rr = null;
    for (let k = -80; k <= 80; k++) { const x = (k / 80) * rx * 1.6; if (inside(x)) { if (L === null) L = x; Rr = x; } }
    return L === null ? null : [L, Rr];
  };
  const reach = Math.max(rx, ry) * 1.1;
  const passes = dark > 1 ? 2 : 1;
  for (let pass = 0; pass < passes; pass++) {
    const n = Math.max(7, Math.round(ry * 2 / (u * 0.0042))), w = (ry * 2.2) / n;
    g.lineWidth = w * 1.9;
    g.strokeStyle = `rgba(44,44,50,${(0.5 + 0.12 * dark) * (pass ? 0.75 : 1)})`;
    if (pass) g.rotate(0.5 + (R() - 0.5) * 0.2);
    g.beginPath(); let first = true, left = true;
    for (let i = 0; i <= n; i++) {
      const y = -ry * 1.1 + i * w + (R() - 0.5) * w * 0.3;
      const c = chord(y); if (!c) continue;
      const o1 = rx * (R() * over * 1.6), o2 = rx * (R() * over * 1.6);
      const a = [c[0] - o1, y], b = [c[1] + o2, y + w * 0.5];
      const [p0, p1] = left ? [a, b] : [b, a]; left = !left;
      if (first) { g.moveTo(...p0); first = false; } else g.lineTo(...p0);
      g.quadraticCurveTo((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 + (R() - 0.5) * w * 0.6, ...p1);
    }
    g.stroke();
  }
  // strays: strokes that ran out of the bubble when she pressed in anger
  for (let i = 0; i < mess * 5; i++) {
    const y = (R() - 0.5) * ry * 1.6, x0 = (R() < 0.5 ? -1 : 1) * rx * (0.6 + R() * 0.3);
    g.strokeStyle = `rgba(44,44,50,${0.4 + R() * 0.3})`; g.lineWidth = u * (0.0025 + R() * 0.002);
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + Math.sign(x0) * rx * (0.3 + R() * 0.6 * mess), y + (R() - 0.5) * ry * 0.5); g.stroke();
  }
  // graphite sheen: thin lighter streaks along the strokes, and a few specks of paper left showing
  for (let i = 0; i < 4 + dark * 3; i++) {
    const y = (R() - 0.5) * ry * 1.5, x = (R() - 0.5) * rx;
    g.strokeStyle = `rgba(150,150,160,${0.18 + R() * 0.14})`; g.lineWidth = u * (0.0012 + R() * 0.001);
    g.beginPath(); g.moveTo(x - rx * 0.5, y); g.lineTo(x + rx * 0.5, y + (R() - 0.5) * 2); g.stroke();
  }
  g.restore();
}

// an erased mark: graphite never comes fully off. A faint ghost of the scribble, smeared along the
// rubbing direction past the bubble, with the cleaner streaks the eraser left
export function erasedMark(g, cx, cy, rx, ry, u, R, { angle = 0.1 } = {}) {
  g.save(); g.globalAlpha = 0.24; pencilFill(g, cx, cy, rx, ry, u, R, { over: 0.2 }); g.restore();
  g.save(); g.translate(cx, cy); g.rotate(angle); g.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const y = (R() - 0.5) * ry * 2.2, len = rx * (1.4 + R() * 1.4), x = (R() - 0.5) * rx * 0.8;
    g.strokeStyle = `rgba(110,110,118,${0.05 + R() * 0.06})`; g.lineWidth = ry * (0.25 + R() * 0.35);
    g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y + (R() - 0.5) * ry * 0.3); g.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const y = (R() - 0.5) * ry * 1.4, len = rx * (0.8 + R());
    g.strokeStyle = 'rgba(246,244,238,0.45)'; g.lineWidth = ry * (0.12 + R() * 0.12);
    g.beginPath(); g.moveTo(-len / 2, y); g.lineTo(len / 2, y + (R() - 0.5) * 3); g.stroke();
  }
  g.restore();
}

// the mark that runs outside the bubble: the one the machine cannot read. The same hand, pressing
// hard and carelessly: a scribble far past the oval with strays
export function blot(g, cx, cy, size, u, R) {
  pencilFill(g, cx, cy, size * 0.95, size * 0.6, u, R, { over: 0.55, dark: 1.25, angle: -0.5 + (R() - 0.5) * 0.3, mess: 1.4 });
}

function paper(g, W, H, R, u) {
  g.fillStyle = PAPER; roundRect(g, 0, 0, W, H, u * 0.03); g.fill();
  g.save(); roundRect(g, 0, 0, W, H, u * 0.03); g.clip();
  for (let i = 0; i < W * 0.7; i++) {
    g.strokeStyle = R() < 0.6 ? `rgba(150,140,120,${0.04 + R() * 0.05})` : `rgba(255,255,250,${0.25 + R() * 0.2})`;
    g.lineWidth = u * 0.001; const x = R() * W, y = R() * H, a = R() * 6.283, l = u * (0.005 + R() * 0.014);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  g.restore();
}

function slot(g, u) {
  g.save(); g.globalCompositeOperation = 'destination-out';
  roundRect(g, u * 0.4, u * 0.022, u * 0.2, u * 0.028, u * 0.014); g.fill(); g.restore();
}

// layout shared by drawing and by animation code that needs bubble positions
export function cardLayout(u) {
  const rowY = i => u * (0.262 + i * 0.05);
  const colX = d => u * (0.235 + d * 0.068);
  return { rowY, colX, rx: u * 0.022, ry: u * 0.0145, heart: [u * 0.235, rowY(6) + u * 0.012], nameBox: [u * 0.05, u * 0.09, u * 0.9, u * 0.1] };
}

// opts: side 'front'|'back'; name; id (4 digits); dev (2 digits); heart 'fill'|'empty'|'over';
// blank (her card: nothing filled, nothing written); stamp (machine print); seed; misreg (px at u=600)
export function drawCard(canvas, opts = {}) {
  const W = canvas.width, H = canvas.height, u = W, g = canvas.getContext('2d');
  const R = rng(opts.seed ?? 7), blank = !!opts.blank;
  g.clearRect(0, 0, W, H);
  paper(g, W, H, R, u);
  const mx = (opts.misreg ?? 0.7) * u / 600, my = (opts.misreg ?? 0.7) * u / 900;
  const T = a => `rgba(33,142,163,${a})`;
  const L = cardLayout(u);
  g.textBaseline = 'middle';
  const black = (x, y, w, h) => { g.fillStyle = '#17171b'; g.fillRect(x, y, w, h); };
  // corner registration marks (black, machine-read)
  for (const [x, y] of [[0.035, 0.035], [0.94, 0.035], [0.035, 0.605], [0.94, 0.605]]) black(u * x, u * y, u * 0.025, u * 0.025);

  if ((opts.side ?? 'front') === 'back') {
    g.save(); g.translate(mx, my);
    g.fillStyle = T(1); g.font = `700 ${u * 0.034}px ZenKakuB`; g.fillText('記入上の注意', u * 0.08, u * 0.1);
    g.font = `500 ${u * 0.024}px ZenKaku`;
    const lines = [['1.', 'HBの黒鉛筆で、○の中を正確にぬりつぶしてください。'], ['2.', 'はみ出したり、うすかったりすると読み取れません。'], ['3.', '訂正するときは、消しゴムできれいに消し、消しくずを残さないでください。']];
    lines.forEach(([n, t], i) => { g.fillText(n, u * 0.08, u * (0.155 + i * 0.042)); g.fillText(t, u * 0.115, u * (0.155 + i * 0.042)); });
    g.strokeStyle = T(0.6); g.lineWidth = u * 0.002; g.setLineDash([u * 0.01, u * 0.008]);
    roundRect(g, u * 0.08, u * 0.3, u * 0.84, u * 0.29, u * 0.015); g.stroke(); g.setLineDash([]);
    g.restore();
    slot(g, u);
    return { drawArea: [u * 0.08, u * 0.3, u * 0.84, u * 0.29] };
  }

  g.save(); g.translate(mx, my);
  g.fillStyle = T(1); g.font = `700 ${u * 0.024}px ZenKakuB`; g.fillText('個人読取カード', u * 0.08, u * 0.062);
  g.font = `500 ${u * 0.016}px ZenKaku`; g.fillText('折り曲げないでください', u * 0.27, u * 0.064);
  // name box with the teal label block
  const [nx, ny, nw, nh] = L.nameBox;
  g.strokeStyle = T(1); g.lineWidth = u * 0.003; roundRect(g, nx, ny, nw, nh, u * 0.01); g.stroke();
  g.fillRect(nx, ny, u * 0.075, nh);
  g.fillStyle = PAPER; g.font = `700 ${u * 0.03}px ZenKakuB`; g.textAlign = 'center'; g.fillText('氏名', nx + u * 0.0375, ny + nh / 2);
  // bubble rows: 4 for the student number, 2 for the deviation value, digits 0-9 inside each oval
  const labels = [['学籍番号', 0, 4], ['偏差値', 4, 2]];
  for (const [t, r0, n] of labels) {
    const y0 = L.rowY(r0) - u * 0.022, h = n * u * 0.05 - u * 0.006;
    g.fillStyle = T(0.12); g.fillRect(u * 0.05, y0, u * 0.14, h);
    g.fillStyle = T(1); g.font = `700 ${u * 0.022}px ZenKakuB`; g.textAlign = 'center'; g.fillText(t, u * 0.12, y0 + h / 2);
  }
  g.lineWidth = u * 0.0022;
  for (let r = 0; r < 6; r++) for (let d = 0; d < 10; d++) {
    const x = L.colX(d), y = L.rowY(r);
    g.strokeStyle = T(0.95); g.beginPath(); g.ellipse(x, y, L.rx, L.ry, 0, 0, 7); g.stroke();
    g.fillStyle = T(0.9); g.font = `500 ${u * 0.018}px ZenKaku`; g.fillText(String(d), x, y + u * 0.0008);
  }
  // the heart cell: one oval that has to be filled black
  const [hx, hy] = L.heart;
  g.fillStyle = T(0.12); g.fillRect(u * 0.05, hy - u * 0.022, u * 0.14, u * 0.044);
  g.fillStyle = T(1); g.font = `700 ${u * 0.024}px ZenKakuB`; g.fillText('こころ', u * 0.12, hy);
  g.strokeStyle = T(0.95); g.beginPath(); g.ellipse(hx, hy, L.rx * 1.2, L.ry * 1.2, 0, 0, 7); g.stroke();
  g.textAlign = 'left'; g.font = `500 ${u * 0.019}px ZenKaku`; g.fillText('← 必ずぬりつぶすこと', hx + u * 0.04, hy);
  g.restore();
  // black timing marks along the bottom edge, one under each digit column
  for (let d = 0; d < 10; d++) black(L.colX(d) - u * 0.006, u * 0.618, u * 0.012, u * 0.026);
  g.fillStyle = '#17171b'; g.font = `500 ${u * 0.02}px ZenKaku`; g.textAlign = 'right';
  g.fillText(`No.${opts.serial ?? '2026-0000'}`, u * 0.93, u * 0.062);

  if (!blank) {
    const id = String(opts.id ?? '4117').padStart(4, '0'), dev = String(opts.dev ?? '52').padStart(2, '0');
    // the town marks neatly inside the ovals (the rule on the back: marks that stray out cannot be read)
    [...id].forEach((c, i) => pencilFill(g, L.colX(+c) + mx, L.rowY(i) + my, L.rx * 0.84, L.ry * 0.84, u, R, { over: 0 }));
    [...dev].forEach((c, i) => pencilFill(g, L.colX(+c) + mx, L.rowY(4 + i) + my, L.rx * 0.84, L.ry * 0.84, u, R, { over: 0 }));
    if (opts.name) {
      g.save(); g.fillStyle = 'rgba(40,40,45,0.86)'; g.font = `${u * 0.05}px Klee`; g.textAlign = 'left';
      g.translate(nx + u * 0.1, ny + nh / 2 + u * 0.004); g.rotate((R() - 0.5) * 0.03); g.fillText(opts.name, 0, 0); g.restore();
    }
  }
  const heart = opts.heart ?? (blank ? 'empty' : 'fill');
  if (heart === 'fill') pencilFill(g, hx + mx, hy + my, L.rx * 1.15, L.ry * 1.15, u, R, { dark: 1.15 });
  if (heart === 'over') blot(g, hx + mx, hy + my, u * 0.05, u, R);
  if (opts.stamp) {
    inkjetText(g, opts.stamp, u * (opts.stampX ?? 0.5), u * (opts.stampY ?? 0.142), { size: u * (opts.stampSize ?? 0.05), align: 'center', rot: opts.stampRot ?? -0.02, seed: 11, matrix: opts.stampMatrix ?? true, dotr: opts.stampDotr ?? 0.46 });
  }
  slot(g, u);
  return L;
}
