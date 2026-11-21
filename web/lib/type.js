// Typesetting: every block of text is measured and fitted into its own box, and the boxes are registered so the page can be
// audited (docs/制作约定.md 第七节): no two boxes of one layer overlap, and no text box is cut by the frame as the camera
// actually shows it.
//
//   import { fit, textBox, createLayout } from '../lib/type.js';
//   const LAY = createLayout();
//   textBox(s, '数学', '700 #px ZenKakuB', [48, 78, 300, 84], { maxSize: 64, color: PAPER, name: 'title', sheet: 'mathb', layout: LAY });
//   LAY.reg('band', 'math', [0, 70, 900, 100]);          // a region (reserved area, not text)
//   LAY.audit('spread sheets');                           // "AUDIT spread sheets: n boxes, k overlaps" for the boxes since the last audit
//   LAY.frameCheck('shot 1', { sheets: { math: p => [x, y] }, views: [{ t, z, fx, fy }] });   // see below
//
// `sheet` is a layer: boxes are only checked against boxes of the same sheet. Text that is the content of a region (her words
// in the field reserved for them, a band's title on the band) goes on its own layer (e.g. 'math:pencil', 'mathb').
// Fonts are given with '#' where the size goes: '700 #px ZenKakuB'.
import { TEAL } from './palette.js';

let _m = null;
const mctx = () => (_m ||= document.createElement('canvas').getContext('2d'));

// the largest size <= maxSize (whole px, down to 7) at which text fits maxW x maxH (height taken as 1.05 x size)
export function fit(text, font, maxSize, maxW, maxH) {
  const m = mctx();
  let s = maxSize; for (; s > 6; s -= 1) { m.font = font.replace('#', s); if (m.measureText(text).width <= maxW && s * 1.05 <= maxH) break; }
  m.font = font.replace('#', s); return { size: s, w: m.measureText(text).width };
}
export function measure(text, font, size) { const m = mctx(); m.font = font.replace('#', size); return m.measureText(text).width; }

// text fitted into box [x, y, w, h], vertically centred, aligned left/center/right; with name + layout, the box the text
// actually takes is registered (kind 'text')
export function textBox(ctx, text, font, box, { maxSize = 200, align = 'left', color = TEAL, name, sheet, layout } = {}) {
  const [x, y, w, h] = box, f = fit(text, font, maxSize, w, h);
  ctx.font = font.replace('#', f.size); ctx.fillStyle = color; ctx.textBaseline = 'middle';
  const tx = align === 'center' ? x + (w - f.w) / 2 : align === 'right' ? x + w - f.w : x;
  ctx.textAlign = 'left'; ctx.fillText(text, tx, y + h / 2);
  if (name && layout) layout.text(name, sheet, [tx, y + h / 2 - f.size * 0.55, f.w, f.size * 1.1]);
  return f;
}

const overlap = (a, b) => { const [ax, ay, aw, ah] = a, [bx, by, bw, bh] = b; return ax < bx + bw - 1 && bx < ax + aw - 1 && ay < by + bh - 1 && by < ay + ah - 1; };

export function createLayout() {
  const boxes = [], overlaps = [], outOfFrame = [], frameChecks = [];
  let groupStart = 0;
  const add = (name, sheet, box, kind) => { const b = { name, sheet, box: box.map(v => +v), kind, group: null }; boxes.push(b); return b; };
  // overlap audit of the boxes registered since the last audit
  function audit(label) {
    const cur = boxes.slice(groupStart), bad = [];
    for (let i = 0; i < cur.length; i++) for (let j = i + 1; j < cur.length; j++) {
      const a = cur[i], b = cur[j]; if (a.sheet !== b.sheet) continue;
      if (overlap(a.box, b.box)) bad.push(`${a.name} x ${b.name}`);
    }
    cur.forEach(b => { b.group = label; });
    bad.forEach(p => overlaps.push({ group: label, pair: p }));
    console.warn(`AUDIT ${label}: ${cur.length} boxes, ${bad.length} overlaps${bad.length ? ': ' + bad.join('; ') : ''}`);
    groupStart = boxes.length;
    return bad;
  }
  // Out-of-frame check, by the camera as it actually moves. sheets: { sheetKey: point -> world point }; views: the camera at
  // each frame to check, { t, z, fx, fy } with the frame's centre on world point (fx, fy) at zoom z (camera.js view()).
  // A box is 'cut' when part of it is outside the visible frame (inset by `inset` px) while part of it is inside; 'hidden'
  // when it is entirely outside in every view checked. Text boxes cut are problems; region boxes cut are notes.
  function frameCheck(label, { sheets, views, W = 1920, H = 1080, inset = 0 }) {
    const res = [];
    for (const b of boxes) {
      const map = sheets[b.sheet]; if (!map) continue;
      const [x, y, w, h] = b.box, p0 = map([x, y]), p1 = map([x + w, y + h]);
      let firstCut = null, worst = 0, everIn = false;
      for (const v of views) {
        const sx0 = W / 2 + (p0[0] - v.fx) * v.z, sy0 = H / 2 + (p0[1] - v.fy) * v.z, sx1 = W / 2 + (p1[0] - v.fx) * v.z, sy1 = H / 2 + (p1[1] - v.fy) * v.z;
        const out = Math.max(inset - sx0, inset - sy0, sx1 - (W - inset), sy1 - (H - inset), 0);
        const allOut = sx1 <= inset || sy1 <= inset || sx0 >= W - inset || sy0 >= H - inset;
        if (!allOut) everIn = true;
        if (out > 0 && !allOut) { if (firstCut === null) firstCut = v.t; worst = Math.max(worst, out); }
      }
      if (firstCut !== null) res.push({ check: label, name: b.name, sheet: b.sheet, kind: b.kind, state: 'cut', t: +firstCut.toFixed(3), px: +worst.toFixed(1), problem: b.kind === 'text' });
      else if (!everIn) res.push({ check: label, name: b.name, sheet: b.sheet, kind: b.kind, state: 'hidden', problem: false });
    }
    const probs = res.filter(r => r.problem), notes = res.filter(r => !r.problem);
    const n = boxes.filter(b => sheets[b.sheet]).length;
    frameChecks.push({ label, boxes: n, views: views.length, t0: views.length ? views[0].t : null, t1: views.length ? views[views.length - 1].t : null, inset });
    outOfFrame.push(...res);
    const fmt = r => r.state === 'cut' ? `${r.name}(${r.sheet}) cut ${r.px}px from ${r.t}s` : `${r.name}(${r.sheet}) hidden`;
    console.warn(`FRAME AUDIT ${label}: ${n} boxes over ${views.length} frames, ${probs.length} text boxes cut${probs.length ? ': ' + probs.map(fmt).join('; ') : ''}${notes.length ? `; notes: ${notes.map(fmt).join('; ')}` : ''}`);
    return res;
  }
  return {
    boxes,
    reg: (name, sheet, box) => add(name, sheet, box, 'region'),      // a reserved area (a field, a band, a row)
    text: (name, sheet, box) => add(name, sheet, box, 'text'),       // text actually set
    audit, frameCheck,
    auditData: () => ({ boxes: boxes.map(({ name, sheet, box, kind, group }) => ({ name, sheet, box, kind, group })), overlaps, outOfFrame,
                         frameChecks, problems: overlaps.length + outOfFrame.filter(r => r.problem).length }),
  };
}
