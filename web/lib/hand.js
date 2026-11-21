// Her hand with the pencil: one drawing per shot, placed by its pencil tip (art/cut/hand_tips.json), with a soft shadow that
// moves away as the hand lifts. The hand lands on the beat and lets go on the half beat; between marks it glides in an eased
// arc that lands on the next beat (docs/制作约定.md 第六节).
//
//   import { createHand, glide } from '../lib/hand.js';
//   const HAND = await createHand({ name: 'hpen3', image: rinPalImage(await img('/art/cut/hpen3.png')), W, H: 1080 });
//   HAND.draw(ctx, x, y, lift, scale);                     // (x, y) = where the pencil tip touches; lift 0 on the paper .. 1 lifted
//   const h = glide(marks, tt, posOf, rest);               // marks: [{ t: lands (beat), tl: lets go (half beat) }, ...]
import { BEAT, smooth } from './score.js';
import { HAND_SHADOW } from './palette.js';

let _tips = null;
export async function loadHandTips(url = '/art/cut/hand_tips.json') { return (_tips ||= await (await fetch(url)).json()); }

export async function createHand({ name, image, W = 1920, H = 1080, tip = null, shadow = HAND_SHADOW } = {}) {
  const TP = tip || (await loadHandTips())[name];
  if (!TP) throw new Error(`hand.js: no pencil tip for ${name} in art/cut/hand_tips.json`);
  const IM = image;
  // lifted: true/false or 0..1; scale: one size for the whole shot; rot: radians (kept 0 in the demos)
  function draw(ctx, x, y, lifted, scale, rot = 0) {
    const lift = lifted === true ? 1 : lifted === false ? 0 : lifted;
    const hs = scale * (1 + 0.035 * lift);
    const put = (c, ox = 0, oy = 0) => { c.save(); c.translate(x + ox, y + oy); c.rotate(rot); c.drawImage(IM, -TP[0] * hs, -TP[1] * hs, IM.width * hs, IM.height * hs); c.restore(); };
    const sc = document.createElement('canvas'); sc.width = W; sc.height = H; const s = sc.getContext('2d');
    put(s, 8 + 18 * lift, 11 + 24 * lift);
    s.globalCompositeOperation = 'source-in'; s.fillStyle = shadow; s.fillRect(0, 0, W, H);
    ctx.drawImage(sc, 0, 0); put(ctx);
  }
  return { name, image: IM, tip: TP, draw };
}

// The hand between marks: pressing from the mark's beat (m.t) to its half beat (m.tl), then an eased glide that lands on the
// next mark's beat (a higher arc for long moves); after the last mark it glides to `rest` over one beat.
// Returns { p: [x, y], lift } or null before the first mark.
export function glide(marks, tt, posOf, rest, { beat = BEAT } = {}) {
  const cur = [...marks].reverse().find(m => tt >= m.t), next = marks.find(m => m.t > tt);
  if (!cur) return null;
  if (tt < cur.tl) return { p: posOf(cur), lift: 0 };
  const [x0, y0] = posOf(cur), [x1, y1] = next ? posOf(next) : rest;
  const t1 = next ? next.t : cur.tl + beat, u = smooth((tt - cur.tl) / (t1 - cur.tl)), arc = Math.hypot(x1 - x0, y1 - y0) > 400 ? 60 : 16;
  return { p: [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - arc * Math.sin(Math.PI * u)], lift: Math.sin(Math.PI * Math.min(1, (tt - cur.tl) / (t1 - cur.tl))) };
}
