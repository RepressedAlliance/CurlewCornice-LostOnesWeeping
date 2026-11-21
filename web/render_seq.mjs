// Render a frame sequence of a scene page with headless Chrome, in one browser session.
// usage: node render_seq.mjs <page> <out_dir> "<query>"|@query_file <t0> <t1> [fps=30] [width=1920] [height=1080]
// The page is opened once with `seq=1` added to the query. It must set window.__ready = true when built and
// expose window.renderAt(t) (seconds, song time), which poses the scene for time t, draws it and resolves
// when the frame (and any overlay canvases) are final. Frames are written as out_dir/f_00000.png ...
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const [page, outDir, queryArg = '', t0s, t1s, fpsS = '30', w = '1920', h = '1080'] = process.argv.slice(2);
// a query starting with @ is read from that file (for launchers that do not go through a shell)
const query = queryArg.startsWith('@') ? fs.readFileSync(queryArg.slice(1), 'utf8').trim() : queryArg;
const t0 = +t0s, t1 = +t1s, fps = +fpsS;
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
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', `--window-size=${w},${h}`, '--hide-scrollbars'],
});
let code = 0;
try {
  const tab = await browser.newPage();
  await tab.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  tab.on('console', m => console.log('[page]', m.text()));
  tab.on('pageerror', e => { console.log('[page error]', e.message); process.exit(3); });
  const q = [query, 'seq=1'].filter(Boolean).join('&');
  await tab.goto(`http://127.0.0.1:${port}/${page}?${q}`, { waitUntil: 'load' });
  await tab.waitForFunction('window.__ready === true', { timeout: 180000 });
  if (!(await tab.evaluate(() => typeof window.renderAt === 'function'))) throw new Error('page has no window.renderAt(t)');
  fs.mkdirSync(outDir, { recursive: true });
  const n = Math.round((t1 - t0) * fps), start = Date.now();
  for (let i = 0; i < n; i++) {
    const t = t0 + i / fps;
    await tab.evaluate(async tt => { await window.renderAt(tt); }, t);
    await tab.screenshot({ path: path.join(outDir, `f_${String(i).padStart(5, '0')}.png`), clip: { x: 0, y: 0, width: +w, height: +h } });
    if (i % 30 === 0) console.log(`frame ${i}/${n}  t=${t.toFixed(3)}  ${((Date.now() - start) / (i + 1)).toFixed(0)} ms/frame`);
  }
  console.log(JSON.stringify({ outDir, frames: n, ms: Date.now() - start }));
} catch (e) { console.log('[error]', e.message); code = 1; }
await browser.close(); server.close(); process.exit(code);
