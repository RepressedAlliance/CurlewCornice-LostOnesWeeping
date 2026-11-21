// Render the set pack's answer cards (web/lib/card.js) to transparent PNGs in art/canon/.
// usage: node web/canon_cards.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const cards = {
  card_front_hers_blank: { blank: true, serial: '2026-0314' },
  card_front_hers_unreadable: { blank: true, serial: '2026-0314', stamp: '読み取れません' },
  card_front_town_filled: { name: '佐藤 健太', id: '4117', dev: '52', serial: '2026-0207', seed: 3 },
  card_front_hers_overflow: { blank: true, heart: 'over', stamp: '読み取れません', serial: '2026-0314', seed: 5 },
  card_back_rules: { side: 'back', serial: '2026-0314' },
};
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const tab = await browser.newPage();
  await tab.setViewport({ width: 1500, height: 1000, deviceScaleFactor: 1 });
  for (const [name, opts] of Object.entries(cards)) {
    await tab.goto(`http://127.0.0.1:${server.address().port}/web/scenes/canon_card.html?opts=${encodeURIComponent(JSON.stringify(opts))}`, { waitUntil: 'load' });
    await tab.waitForFunction('window.__ready === true', { timeout: 60000 });
    const out = path.join(root, 'art', 'canon', `${name}.png`);
    await tab.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: 1500, height: 1000 } });
    console.log('wrote', out);
  }
} finally { await browser.close(); server.close(); }
