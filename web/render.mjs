// Render a page of this project to PNG with headless Chrome (GPU via ANGLE).
// usage: node render.mjs <page relative to project root> <out.png> [query] [width] [height]
// The page must set window.__ready = true when the frame is drawn.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const [page, out, queryArg = '', w = '1920', h = '1080'] = process.argv.slice(2);
// a query starting with @ is read from that file (for launchers that do not go through a shell)
const query = queryArg.startsWith('@') ? fs.readFileSync(queryArg.slice(1), 'utf8').trim() : queryArg;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.json': 'application/json', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader=false',
         `--window-size=${w},${h}`, '--hide-scrollbars'],
});
try {
  const tab = await browser.newPage();
  await tab.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  tab.on('console', m => console.log('[page]', m.text()));
  tab.on('pageerror', e => { console.log('[page error]', e.message); process.exit(3); });
  const t0 = Date.now();
  await tab.goto(`http://127.0.0.1:${port}/${page}${query ? '?' + query : ''}`, { waitUntil: 'load' });
  await tab.waitForFunction('window.__ready === true', { timeout: 120000 });
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await tab.screenshot({ path: out, clip: { x: 0, y: 0, width: +w, height: +h } });
  const info = await tab.evaluate(() => ({ ...(window.__info || {}), pool: window.__pool }));
  const exp = await tab.evaluate(() => window.__export || null);
  if (exp) {
    const base = out.replace(/\.png$/, '');
    fs.writeFileSync(base + '.glb', Buffer.from(exp.glb, 'base64'));
    delete exp.glb;
    fs.writeFileSync(base + '.json', JSON.stringify(exp, null, 1));
  }
  console.log(JSON.stringify({ out, ms: Date.now() - t0, ...info }));
} finally {
  await browser.close();
  server.close();
}
