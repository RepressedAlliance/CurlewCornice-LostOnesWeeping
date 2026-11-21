// Render one segment (or one chunk of it) of the film on the global frame grid, with headless Chrome, resumably.
// usage: node web/render_film.mjs <page_url> "<query>"|@query_file <out_dir> <f0> <f1> [--chunk a:b] [options]
//   page_url   the page relative to the project root, e.g. web/scenes/sheet.html
//   query      the page query, e.g. "page=a2v4" (seq=1 is added); @file reads it from a file
//   f0, f1     the segment's global frames [f0, f1); frame g shows song time g/fps
//   --chunk a:b   render only global frames [a, b) of the segment (f0 <= a < b <= f1)
//   --fps 30  --size 1920x1080
//   --since <ms>  frames written before this time (ms since 1970) count as stale and are rendered again
//   --t0 <sec>    test only: frame g shows t0 + (g - f0)/fps instead of g/fps (to compare with old render_seq output)
//   --warmup <n>  pose the page at the n frames before the first missing one without saving them (for a page whose
//                 drawing depends on the frames before; a pure renderAt(t) needs 0, the default)
//   --audit-only  build the page and write the audit and deps files, render nothing
// Frames are <out_dir>/g_<7-digit global frame>.png, written to a temp name and renamed, so a killed run never leaves
// a half frame. A frame that already exists, ends in a PNG IEND chunk and is newer than --since is skipped.
// The page must set window.__ready = true and expose window.renderAt(t); after it is built the page's window.__audit
// is read. Written next to the frames:
//   audit.<a>-<b>.json  window.__audit (as the page set it) plus _render (segment, chunk, page console AUDIT lines)
//   deps.<a>-<b>.json   every file the page requested, with its SHA-1 as served
//   and, when the chunk is the whole segment and finished, audit.json and deps.json.
// A page error closes the browser before exiting (exit code 3; page crash 4; interrupted 130; other errors 1).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const pos = [], opt = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--audit-only') opt.auditOnly = true;
  else if (a.startsWith('--')) opt[a.slice(2)] = argv[++i];
  else pos.push(a);
}
if (pos.length < 5) {
  console.log('usage: node web/render_film.mjs <page_url> <query> <out_dir> <f0> <f1> [--chunk a:b] [--fps 30] [--size 1920x1080] [--since ms] [--t0 sec] [--warmup n] [--audit-only]');
  process.exit(2);
}
const [pageUrl, queryArg, outDirArg, f0s, f1s] = pos;
const query = queryArg.startsWith('@') ? fs.readFileSync(queryArg.slice(1), 'utf8').trim() : queryArg;
const outDir = path.resolve(outDirArg);
const f0 = +f0s, f1 = +f1s, fps = +(opt.fps || 30);
const [W, H] = (opt.size || '1920x1080').split('x').map(Number);
const [ca, cb] = opt.chunk ? opt.chunk.split(':').map(Number) : [f0, f1];
const since = +(opt.since || 0), warmup = +(opt.warmup || 0);
const tBase = opt.t0 !== undefined ? +opt.t0 : null;
if (![f0, f1, ca, cb].every(Number.isInteger) || f1 <= f0 || ca < f0 || cb > f1 || cb <= ca) {
  console.log(`[error] bad range: segment [${f0}, ${f1}) chunk [${ca}, ${cb})`); process.exit(2);
}
const timeOf = g => tBase === null ? g / fps : tBase + (g - f0) / fps;
const frameName = g => `g_${String(g).padStart(7, '0')}.png`;
const tag = `${ca}-${cb}`;
fs.mkdirSync(outDir, { recursive: true });

function frameOk(g) {
  const p = path.join(outDir, frameName(g));
  let st; try { st = fs.statSync(p); } catch { return false; }
  if (st.size < 1024 || st.mtimeMs < since) return false;
  const fd = fs.openSync(p, 'r'), b = Buffer.alloc(12);
  try { fs.readSync(fd, b, 0, 12, st.size - 12); } finally { fs.closeSync(fd); }
  return b.includes('IEND');
}
const todo = [];
for (let g = ca; g < cb; g++) if (!frameOk(g)) todo.push(g);
console.log(`chunk ${tag}: ${cb - ca} frames, ${cb - ca - todo.length} already there, ${todo.length} to render`);
if (!todo.length && !opt.auditOnly) { console.log('RESULT ' + JSON.stringify({ chunk: tag, rendered: 0, skipped: cb - ca })); process.exit(0); }

// ---- the static server, which records every file the page asks for and the SHA-1 of what it served
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.json': 'application/json', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.css': 'text/css' };
const deps = new Map();
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
  const p = path.join(root, rel);
  const key = path.relative(root, p).split(path.sep).join('/');
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    if (!deps.has(key)) deps.set(key, { path: key, sha1: null, bytes: 0, status: 404 });
    res.writeHead(404); return res.end();
  }
  const buf = fs.readFileSync(p);
  const sha1 = crypto.createHash('sha1').update(buf).digest('hex');
  const prev = deps.get(key);
  if (prev && prev.sha1 && prev.sha1 !== sha1) prev.changed = true;      // the file changed while we were rendering
  else deps.set(key, { path: key, sha1, bytes: buf.length });
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(buf);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const consoleAudit = [];
const meta = () => ({ page_url: pageUrl, query, f0, f1, chunk: [ca, cb], fps, size: [W, H], t0_override: tBase,
  written: new Date().toISOString(), console: consoleAudit });
function writeJson(name, obj) {
  const p = path.join(outDir, name), tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 1)); fs.renameSync(tmp, p);
}
let auditObj = null;
function writeAudit(final) {
  const a = auditObj && typeof auditObj === 'object' ? { ...auditObj } : { _missing: true };
  a._render = { ...meta(), complete: final };
  writeJson(`audit.${tag}.json`, a);
  const d = { page_url: pageUrl, query, chunk: [ca, cb], complete: final, written: new Date().toISOString(),
    files: [...deps.values()].sort((x, y) => x.path < y.path ? -1 : 1) };
  writeJson(`deps.${tag}.json`, d);
  if (final && ca === f0 && cb === f1) { writeJson('audit.json', a); writeJson('deps.json', d); }
}

const pidFile = path.join(outDir, `.render_${tag}.pid.json`);
let browser = null, closing = false;
async function shutdown(code, why) {
  if (closing) return; closing = true;
  if (why) console.log(why);
  if (browser) {
    const proc = browser.process();
    await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 10000))]);
    if (proc && proc.exitCode === null) { try { proc.kill('SIGKILL'); } catch {} }
  }
  server.close();
  try { fs.unlinkSync(pidFile); } catch {}
  process.exit(code);
}
for (const s of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) process.on(s, () => shutdown(130, `[interrupted] ${s}`));

try {
  browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', `--window-size=${W},${H}`, '--hide-scrollbars'],
  });
  fs.writeFileSync(pidFile, JSON.stringify({ node: process.pid, chrome: browser.process()?.pid ?? null, started: Date.now() }));
  const tab = await browser.newPage();
  await tab.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  tab.on('console', m => { const t = m.text(); console.log('[page]', t); if (/AUDIT/.test(t)) consoleAudit.push(t); });
  tab.on('pageerror', e => shutdown(3, `[page error] ${e.message}`));
  tab.on('error', e => shutdown(4, `[page crash] ${e.message}`));
  const q = [query, 'seq=1'].filter(Boolean).join('&');
  const tb = Date.now();
  await tab.goto(`http://127.0.0.1:${port}/${pageUrl.replace(/\\/g, '/').replace(/^\/+/, '')}?${q}`, { waitUntil: 'load' });
  await tab.waitForFunction('window.__ready === true', { timeout: 180000 });
  if (closing) await new Promise(() => {});
  if (!(await tab.evaluate(() => typeof window.renderAt === 'function'))) throw new Error('page has no window.renderAt(t)');
  auditObj = await tab.evaluate(() => { try { return window.__audit === undefined ? null : JSON.parse(JSON.stringify(window.__audit)); } catch (e) { return { _unserializable: String(e) }; } });
  const buildMs = Date.now() - tb;
  console.log(`page built in ${buildMs} ms; __audit ${auditObj ? 'present' : 'MISSING'}`);
  writeAudit(false);
  let rendered = 0;
  const start = Date.now();
  if (!opt.auditOnly) {
    for (let g = Math.max(f0, todo[0] - warmup); g < todo[0]; g++) await tab.evaluate(async tt => { await window.renderAt(tt); }, timeOf(g));
    for (const g of todo) {
      if (closing) break;
      await tab.evaluate(async tt => { await window.renderAt(tt); }, timeOf(g));
      const buf = await tab.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
      const p = path.join(outDir, frameName(g));
      fs.writeFileSync(p + '.tmp', buf); fs.renameSync(p + '.tmp', p);
      rendered++;
      if (rendered % 30 === 1 || rendered === todo.length)
        console.log(`frame g${g} (${rendered}/${todo.length})  t=${timeOf(g).toFixed(4)}  ${((Date.now() - start) / rendered).toFixed(0)} ms/frame`);
    }
  }
  if (closing) await new Promise(() => {});
  writeAudit(true);
  const ms = Date.now() - start;
  console.log('RESULT ' + JSON.stringify({ chunk: tag, rendered, skipped: cb - ca - todo.length, build_ms: buildMs, ms,
    ms_per_frame: rendered ? +(ms / rendered).toFixed(1) : null, deps: deps.size, audit: !!auditObj }));
  await shutdown(0);
} catch (e) {
  await shutdown(1, `[error] ${e.message}`);
}
