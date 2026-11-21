// Her card at high resolution for close-ups: left blank, right with the reading machine's verdict printed
// in the name field. Each cell 1500x1000 at (i*1500, 0) on magenta (keyed out afterwards).
import { drawCard, loadCardFonts } from '../lib/card.js';
await loadCardFonts();
const q = new URLSearchParams(location.search);
const put = (opts, i) => { const c = document.createElement('canvas'); c.width = 1500; c.height = 1000; c.style.left = `${i * 1500}px`; c.style.top = '0px'; document.body.appendChild(c); drawCard(c, opts); };
put({ blank: true, serial: '2026-0314', seed: 5 }, 0);
put({ blank: true, serial: '2026-0314', seed: 5, stamp: '読み取れません', stampSize: +(q.get('ss') ?? 0.07), stampY: 0.142, stampRot: -0.025, stampDotr: +(q.get('sd') ?? 0.56) }, 1);
window.__ready = true;
