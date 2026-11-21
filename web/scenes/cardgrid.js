// The one card design, rendered as a grid of variants for compositing onto the drawings:
// cell 0 is her card (blank), the rest are townspeople's cards, each with its own name, number and marks.
// Cells are 600x400 at (col*600, row*400) on a magenta ground (keyed out afterwards).
import { drawCard, loadCardFonts } from '../lib/card.js';
await loadCardFonts();
const names = ['佐藤 健太', '高橋 美咲', '田中 翔', '伊藤 陽菜', '渡辺 蓮', '山本 結衣', '中村 大翔', '小林 さくら', '加藤 悠真', '吉田 美月',
  '山田 湊', '佐々木 葵', '山口 颯太', '松本 莉子', '井上 陸', '木村 凛', '林 樹', '清水 心春', '斎藤 優斗', '森 杏',
  '池田 大和', '橋本 芽依', '阿部 朝陽', '石川 紬'];
const put = (opts, i) => {
  const c = document.createElement('canvas'); c.width = 600; c.height = 400;
  c.style.left = `${(i % 5) * 600}px`; c.style.top = `${Math.floor(i / 5) * 400}px`; document.body.appendChild(c); drawCard(c, opts);
};
put({ blank: true, serial: '2026-0314', seed: 5 }, 0);
for (let i = 1; i < 25; i++) {
  const id = String((1000 + i * 2737) % 9999).padStart(4, '0'), dev = String(38 + (i * 7) % 33);
  put({ name: names[i - 1], id, dev, serial: `2026-${String(100 + i * 37).padStart(4, '0')}`, seed: 3 + i * 5 }, i);
}
window.__ready = true;
