// Single-frame previews: open the page once, render a few song times, save each frame and a two-column contact sheet.
// usage: node web/preview.mjs "<query>"|@query_file <sec|gNNNN> [<sec|gNNNN> ...] [--url web/scenes/sheet.html]
//        [--out work/preview] [--exact] [--fps 30] [--size 1920x1080] [--thumb 800]
//   e.g. node web/preview.mjs "page=c1a" 76.0 80.5 82.0
// A time is snapped to the film's frame grid (frame g = g/fps s, as render_film.mjs renders it) unless --exact;
// gNNNN names a global frame. Writes <out>/<page>_g<frame>.png per time and <out>/<page>_sheet_<first>-<last>.png
// (two columns, labelled with song time, frame and the segment from web/segments.json). Prints the page's AUDIT lines.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const pos = [], opt = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--exact') opt.exact = true;
  else if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[++i];
  else pos.push(argv[i]);
}
if (pos.length < 2) { console.log('usage: node web/preview.mjs "<query>" <sec|gNNNN> ... [--url page] [--out dir] [--exact]'); process.exit(2); }
const query = pos[0].startsWith('@') ? fs.readFileSync(pos[0].slice(1), 'utf8').trim() : pos[0];
const fps = +(opt.fps || 30), [W, H] = (opt.size || '1920x1080').split('x').map(Number), thumb = +(opt.thumb || 800);
const pageUrl = (opt.url || 'web/scenes/sheet.html').replace(/\\/g, '/').replace(/^\/+/, '');
const outDir = path.resolve(opt.out || path.join(root, 'work', 'preview'));
const pageName = (new URLSearchParams(query).get('page') || 'page').replace(/[^\w.-]/g, '_');
let reg = { segments: [] };
try { reg = JSON.parse(fs.readFileSync(path.join(root, 'web', 'segments.json'), 'utf8')); } catch {}
const shots = pos.slice(1).map(a => {
  if (a.startsWith('g')) { const g = +a.slice(1); return { g, t: g / fps, label: a }; }
  const s = +a, g = Math.round(s * fps);
  return { g, t: opt.exact ? s : g / fps, label: a, exact: !!opt.exact };
});
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.json': 'application/json', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser = null, closing = false;
async function shutdown(code, why) {
  if (closing) return; closing = true;
  if (why) console.log(why);
  if (browser) {
    const proc = browser.process();
    await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 10000))]);
    if (proc && proc.exitCode === null) { try { proc.kill('SIGKILL'); } catch {} }
  }
  server.close(); process.exit(code);
}
for (const s of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) process.on(s, () => shutdown(130, `[interrupted] ${s}`));
try {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', `--window-size=${W},${H}`, '--hide-scrollbars'],
  });
  const tab = await browser.newPage();
  await tab.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  tab.on('console', m => { const t = m.text(); if (/AUDIT/.test(t) || opt.verbose) console.log('[page]', t); });
  tab.on('pageerror', e => shutdown(3, `[page error] ${e.message}`));
  await tab.goto(`http://127.0.0.1:${server.address().port}/${pageUrl}?${[query, 'seq=1'].filter(Boolean).join('&')}`, { waitUntil: 'load' });
  await tab.waitForFunction('window.__ready === true', { timeout: 180000 });
  const files = [];
  for (const s of shots) {
    await tab.evaluate(async tt => { await window.renderAt(tt); }, s.t);
    const name = s.exact ? `${pageName}_t${s.t.toFixed(3)}.png` : `${pageName}_g${String(s.g).padStart(7, '0')}.png`;
    const p = path.join(outDir, name);
    fs.writeFileSync(p, await tab.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } }));
    const seg = (reg.segments || []).find(x => x.f0 <= s.g && s.g < x.f1);
    s.caption = `${s.t.toFixed(3)} s  g${s.g}${seg ? `  ${seg.id} +${s.g - seg.f0}` : ''}${seg && seg.page !== query ? ' (other page)' : ''}`;
    files.push(p);
    console.log(`${p}  ${s.caption}`);
  }
  // the contact sheet, drawn in a second tab from the saved frames
  const cols = Math.min(2, shots.length), rows = Math.ceil(shots.length / 2), tw = thumb, th = Math.round(thumb * H / W), cap = 34;
  const sheet = await browser.newPage();
  await sheet.setViewport({ width: cols * tw + (cols + 1) * 12, height: rows * (th + cap) + (rows + 1) * 12, deviceScaleFactor: 1 });
  const imgs = files.map(f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64'));
  await sheet.setContent('<html><body style="margin:0;background:#202020"><canvas id="c"></canvas></body></html>');
  await sheet.evaluate(async (imgs, caps, tw, th, cap, cols, rows) => {
    const c = document.getElementById('c'); c.width = cols * tw + (cols + 1) * 12; c.height = rows * (th + cap) + (rows + 1) * 12;
    const g = c.getContext('2d'); g.fillStyle = '#202020'; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < imgs.length; i++) {
      const im = new Image(); im.src = imgs[i]; await im.decode();
      const x = 12 + (i % 2) * (tw + 12), y = 12 + Math.floor(i / 2) * (th + cap + 12);
      g.drawImage(im, x, y + cap, tw, th);
      g.fillStyle = '#e8e8e8'; g.font = '20px sans-serif'; g.textBaseline = 'middle'; g.fillText(caps[i], x + 2, y + cap / 2);
    }
  }, imgs, shots.map(s => s.caption), tw, th, cap, cols, rows);
  const sp = path.join(outDir, `${pageName}_sheet_${shots[0].label}-${shots[shots.length - 1].label}.png`);
  const vp = sheet.viewport();
  fs.writeFileSync(sp, await sheet.screenshot({ type: 'png', clip: { x: 0, y: 0, width: vp.width, height: vp.height } }));
  console.log(`sheet ${sp}`);
  await shutdown(0);
} catch (e) { await shutdown(1, `[error] ${e.message}`); }
