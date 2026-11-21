// Card design sheet: her blank card, a classmate's filled card, the overflowing heart, the back.
import { drawCard, loadCardFonts, CARD_RATIO } from '../lib/card.js';
await loadCardFonts();
const put = (opts, x, y, w) => {
  const c = document.createElement('canvas'); c.width = w; c.height = Math.round(w / CARD_RATIO);
  c.style.left = `${x}px`; c.style.top = `${y}px`; document.body.appendChild(c); drawCard(c, opts); return c;
};
put({ blank: true, serial: '2026-0314' }, 60, 60, 880);
put({ name: '佐藤 健太', id: '4117', dev: '52', serial: '2026-0207', seed: 3 }, 980, 60, 880);
put({ blank: true, heart: 'over', stamp: '読み取れません', serial: '2026-0314', seed: 5 }, 60, 680, 560);
put({ name: '高橋 美咲', id: '2093', dev: '61', serial: '2026-0118', seed: 9, stamp: '読取完了', stampX: 0.78, stampSize: 0.034 }, 680, 680, 560);
put({ side: 'back', serial: '2026-0314' }, 1300, 680, 560);
window.__ready = true;
