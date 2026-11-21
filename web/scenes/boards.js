// Stage-1 design boards (3840x2160): ?board=rin | town | props
import { drawCard, loadCardFonts, rng, inkjetText } from '../lib/card.js';
import { rinPalImage } from '../lib/rinpal.js';
const q = new URLSearchParams(location.search);
const board = q.get('board') || 'rin';
const W = 3840, H = 2160;
const g = document.getElementById('c').getContext('2d');
await loadCardFonts();
for (const [fam, url] of [['SC', '/assets/fonts/NotoSansSC-VF.ttf'], ['Shippori', '/assets/fonts/ShipporiMincho-Bold.ttf']]) { const f = new FontFace(fam, `url(${url})`); await f.load(); document.fonts.add(f); }
const img = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const PAPER = '#f1eee6', INKC = '#2b2b30', TEAL = '#218ea3';

function background(title, sub) {
  g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
  const R = rng(4);
  for (let i = 0; i < 9000; i++) { g.strokeStyle = R() < 0.6 ? `rgba(150,140,120,${0.04 + R() * 0.05})` : `rgba(255,255,250,${0.3})`; g.lineWidth = 1.2; const x = R() * W, y = R() * H, a = R() * 6.28, l = 4 + R() * 12; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  g.fillStyle = INKC; g.fillRect(0, 0, W, 150); g.fillStyle = TEAL; g.fillRect(0, 150, W, 10);
  g.fillStyle = '#f1eee6'; g.textBaseline = 'middle'; g.font = '700 70px Shippori'; g.fillText(title, 80, 78);
  g.font = '500 40px SC'; g.fillStyle = '#c9cfd2'; g.fillText(sub, 80 + g.measureText(title).width * 0 + 980, 82);
}
// an image drawn on white, laid onto the paper with multiply so its white becomes the paper
function put(im, x, y, w, h) {
  const s = Math.min(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s;
  g.save(); g.globalCompositeOperation = 'multiply'; g.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); g.restore();
  return [x + (w - dw) / 2, y + (h - dh) / 2, dw, dh];
}
function label(t, x, y, size = 40, color = INKC, weight = 500) { g.fillStyle = color; g.font = `${weight} ${size}px SC`; g.textBaseline = 'top'; g.fillText(t, x, y); }
function notes(lines, x, y, size = 36, gap = 1.6, width = 1400) {
  g.font = `400 ${size}px SC`; g.fillStyle = INKC; g.textBaseline = 'top';
  // break into units that must stay on one line: a short 「quote」, a number with its unit (14 岁, 152 cm),
  // a Latin word or code (#218EA3, Les Paul); everything else breaks between characters
  const units = line => line.match(/Les Paul|「[^」]{1,10}」|[#A-Za-z0-9.]+(?: ?(?:cm|岁|px|m))?|[\s\S]/g);
  // line-breaking rules: closing punctuation never starts a line, an opening bracket never ends one
  const NOSTART = '、。，．,.：；！？」』）】〕〉》ー・…', NOEND = '「『（【〔〈《';
  let yy = y;
  for (const line of lines) {
    let cur = '';
    for (const u of units(line)) {
      if (cur && g.measureText(cur + u).width > width && !NOSTART.includes(u[0])) {
        let carry = '';
        while (cur.length > 1 && NOEND.includes(cur[cur.length - 1])) { carry = cur[cur.length - 1] + carry; cur = cur.slice(0, -1); }
        g.fillText(cur.trimEnd(), x, yy); yy += size * gap; cur = carry + u.trimStart();
      } else cur += u;
    }
    g.fillText(cur, x, yy); yy += size * gap * 1.15;
  }
  return yy;
}

if (board === 'rin') {
  background('鏡音リン　人物設定', '《ロストワンの号哭》MV　阶段 1');
  const D = '/art/design/board/', O = '/art/design/out/';
  const raw = await Promise.all([D + 'rin_A2', O + 'rin_expr4', O + 'rlow3_down_k', O + 'rlow3_master_k', O + 'rlow3_up_k', O + 'rin_story_k', O + 'rin_gate_v6_k', O + 'rin_fling_v4_k'].map(n => img(`${n}.png`)));
  // every drawing here is a whole Codex drawing, cards included (nothing pasted on afterwards)
  // every drawing of her goes through the same colour rule as the shots (whites to white, her teal to #218EA3)
  const [turn, expr, low1, low2, low3, story, gate, fling] = raw.map(im => rinPalImage(im));
  put(turn, 60, 190, 1650, 1100); label('正面 · 四分之三 · 侧面 · 背面', 90, 1300, 36, '#5b5f66');
  put(expr, 1750, 190, 1320, 880); label('表情：戒备 · 不耐烦 · 冷笑 · 吼', 1780, 1080, 32, '#5b5f66'); label('忍住不哭 · 无声流泪 · 号哭 · 难得的笑', 1780, 1126, 32, '#5b5f66');
  const Y2 = 1420, H2 = 640, wl = H2 * low1.width / low1.height;
  [low1, low2, low3].forEach((im, i) => put(im, 50 + i * (wl - 20), Y2, wl, H2));
  const xs = 50 + 3 * (wl - 20) + 40;
  { const sw3 = story.width / 3, sc = H2 / story.height; const piece = (sx, dx) => { g.save(); g.globalCompositeOperation = 'multiply'; g.drawImage(story, sx, 0, sw3, story.height, dx, Y2, sw3 * sc, H2); g.restore(); };
    piece(0, xs); piece(sw3 * 2, xs + sw3 * sc + 10); }
  const xg = xs + 2 * (story.width / 3) * (H2 / story.height) + 60, wg = H2 * gate.width / gate.height, wf = H2 * fling.width / fling.height;
  put(gate, xg, Y2, wg, H2); put(fling, xg + wg + 20, Y2, wf, H2);
  label('楼顶（腰高仰拍）：低头扫弦 · 吼 · 仰天吼', 80, 2080, 32, '#5b5f66');
  label('背琴包走路 · 抱膝', xs + 20, 2080, 32, '#5b5f66');
  label('检票口（俯拍）· 扯下颈绳（俯拍，招牌动作）', xg + 10, 2080, 32, '#5b5f66');
  notes([
    '官方基础设定：金色短发，白色大蝴蝶结（两只立起的大耳）和白色发夹，碧青色眼睛 #218EA3，14 岁，152 cm。',
    '本片服装：炭灰西装外套（胸袋校徽），白衬衫，碧青领结，炭灰百褶裙，黑色及膝袜，棕色乐福鞋。',
    '「読み取れません」是读卡机读她的卡时唯一打出的字：她的卡和全城同一张，只是什么都没涂，挂在碧青颈绳上。',
    '背一个黑色琴包，里面是一把金色面板的 Les Paul。',
    '小城是碧青单色印刷的，她是全片唯一的全彩；金发和这把琴是画面里唯一的暖色。',
    '画法：细而清楚的深灰线，平涂加一档硬阴影，头发成块不碎，衣褶少。每个镜头按自己的机位、动作、情绪重新出图：楼顶从低处仰拍，检票口和最终副歌从高处俯拍。',
  ], 3110, 210, 31, 1.5, 690);
  label('她的颜色', 3110, 1380, 32, INKC, 600);
  [['金发', '#F1C75B'], ['眼睛', '#218EA3'], ['外套', '#36373B'], ['衬衫・蝴蝶结', '#FFFFFF'], ['乐福鞋', '#6A4A32'], ['琴的金色面板', '#C9A548']].forEach(([n, c], i) => {
    const x = 3110 + (i % 3) * 225, y = 1440 + Math.floor(i / 3) * 300;
    g.fillStyle = c; g.fillRect(x, y, 195, 160); g.strokeStyle = 'rgba(43,43,48,0.3)'; g.lineWidth = 2; g.strokeRect(x, y, 195, 160);
    label(n, x, y + 172, 26, INKC, 600); label(c, x, y + 206, 24, '#5b5f66');
  });
}
if (board === 'town') {
  background('小城的人　人物設定', '每个人都不一样；只有卡是一模一样的格式');
  const D = '/art/design/board/', O = '/art/design/out/';
  const [stu, adu, bld, rinT, essay] = await Promise.all([D + 'students_14', D + 'print_people_test_s', D + 'adults_builds', D + 'rin_A2'].map(n => img(`${n}.png`)).concat([img('/art/props/essay_prop.png')]));
  // ---- everyone on one height scale: K board px per cm, all feet on one ground line, a ruler on the left.
  // Each lineup sheet was drawn at its own scale; [image, crop x0, x1, its ground line y, its px per cm, label]
  const K = 3.95, BASE = 990;
  const lineups = [[rinPalImage(rinT), 128, 372, 1005, 6.08, '她'], [stu, 115, 1425, 984, 4.5, '同班同学（14 岁）'],
    [adu, 0, 1536, 996, 5.7, '小城的大人和孩子'], [bld, 45, 1455, 992, 5.4, '还有：站务员 · 工人 · 推购物车的老太太 · 瘦高的青年']];
  // the ruler
  g.strokeStyle = 'rgba(43,43,48,0.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(150, BASE); g.lineTo(150, BASE - 190 * K); g.stroke();
  for (let cm = 0; cm <= 190; cm += 10) { const y = BASE - cm * K, long = cm % 50 === 0; g.beginPath(); g.moveTo(150, y); g.lineTo(long ? 120 : 136, y); g.stroke();
    if (long && cm) { g.fillStyle = '#5b5f66'; g.font = '500 26px SC'; g.textBaseline = 'middle'; g.textAlign = 'right'; g.fillText(`${cm}`, 112, y); g.textAlign = 'left'; } }
  label('cm', 92, BASE - 190 * K - 40, 24, '#5b5f66');
  let x = 200;
  for (const [im, x0, x1, gy, ppc, lab] of lineups) {
    const s = K / ppc, w = (x1 - x0) * s, below = 22;
    g.save(); g.globalCompositeOperation = 'multiply'; g.drawImage(im, x0, 0, x1 - x0, gy + below, x, BASE - gy * s, w, (gy + below) * s); g.restore();
    label(lab, x + 10, BASE + 24, 30, '#5b5f66');
    if (lab === '她') label('152 cm', x + 4, BASE + 62, 26, '#5b5f66');
    x += w + 45;
  }
  g.strokeStyle = 'rgba(33,142,163,0.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(150, BASE); g.lineTo(x - 45, BASE); g.stroke();
  // ---- the same people redrawn for each shot's camera (seen from above), at the heights they have in the shot
  const KS = 3.41, B2 = 1740;   // board px per cm
  const shot = async (list, x0) => {
    let xx = x0;
    for (const [n, hm, bx0, by0, bx1, by1] of list) {
      const im = await img(`${O}${n}.png`), s = hm * 100 * KS / (by1 - by0), w = (bx1 - bx0) * s;
      g.save(); g.globalCompositeOperation = 'multiply'; g.drawImage(im, bx0, by0, bx1 - bx0, by1 - by0, xx, B2 - (by1 - by0) * s, w, (by1 - by0) * s); g.restore();
      xx += w + 12;
    }
    return xx;
  };
  const e1 = await shot([['g1_instructor_v2_k', 1.75, 89, 25, 840, 1505], ['g1_elder_k', 1.65, 262, 34, 756, 1490], ['g1_officewoman_v2_k', 1.62, 87, 38, 815, 1502],
    ['g1_salaryman_k2', 1.76, 266, 27, 756, 1506], ['g1_students_k', 1.58, 78, 36, 905, 1484], ['g1_mother_v2', 1.62, 99, 65, 900, 1478]], 60);
  label('01 检票口：按这一镜的机位从高处俯拍重画，刷卡、排队、走过', 80, B2 + 16, 30, '#5b5f66');
  const x5 = e1 + 60;
  const e5 = await shot([['g5_clerk', 1.602, 311, 29, 716, 1509], ['g5_officewoman', 1.623, 267, 33, 711, 1509], ['g5_elder', 1.655, 271, 39, 725, 1494],
    ['g5_girl', 1.521, 272, 24, 748, 1512], ['g5_salaryman', 1.767, 226, 34, 774, 1503], ['g5_mother', 1.644, 80, 42, 880, 1504]], x5);
  label('05 最终副歌：卡全掉了，只剩空夹子（同样按机位俯拍重画）', x5 + 20, B2 + 16, 30, '#5b5f66');
  const ex = e5 + 60, eh = 600, ew = eh * essay.width / essay.height;
  put(essay, ex, B2 - eh, ew, eh); label('她六岁写的作文', ex, B2 + 16, 30, '#5b5f66'); label('（一直叠着收在琴包口袋里）', ex, B2 + 54, 26, '#5b5f66');
  notes([
    '没有人长得像她：别的发色，没有蝴蝶结。小城的人和小城一样是印出来的：碧青单色线稿加网点，没有别的颜色；黑的只有卡上用铅笔涂过的格子。',
    '“无个性”由卡来表现：所有人挂的都是同一张卡，只有名字和涂黑不同；人却各有各的年龄、体型、样子和动作。',
  ], 80, 1860, 30, 1.5, 1800);
  notes([
    '上排是统一身高比例尺：所有人按同一厘米比例站在同一条地平线上。每一镜都按这一镜的机位高度和俯仰角重新出图，不拿平视的设定图直接放进俯拍镜头。',
    '作文「しょうらいのゆめ」：长大想当弹吉他的人。C 段里擦掉它的是她自己的手。',
  ], 1960, 1860, 30, 1.5, 1820);
}
if (board === 'props') {
  background('道具 · 答题卡 · 色彩', '卡是纸，不是界面');
  const [lp] = await Promise.all([img('/art/design/out/lespaul_v3.png')]);
  put(lp, 60, 200, 1800, 1200); label('Les Paul（金色面板，两个 P-90 拾音器，一体式琴桥，琴头无品牌）与黑色琴包', 90, 1400, 38, '#5b5f66');
  // each card lies flat on the board with the film's hard shadow: its silhouette offset and filled with the teal screen
  const screenC = (() => { const c = document.createElement('canvas'); c.width = 900; c.height = 600; const x = c.getContext('2d'); x.fillStyle = '#1b7f92';
    for (let yy = 0; yy < 600; yy += 7) for (let xx = (yy / 7) % 2 ? 3.5 : 0; xx < 900; xx += 7) { x.beginPath(); x.arc(xx, yy, 1.9, 0, 7); x.fill(); } return c; })();
  const mk = (opts, x, y, w) => { const c = document.createElement('canvas'); c.width = w; c.height = Math.round(w / 1.5); drawCard(c, opts);
    const sh = document.createElement('canvas'); sh.width = c.width; sh.height = c.height; const sx = sh.getContext('2d'); sx.drawImage(c, 0, 0);
    sx.globalCompositeOperation = 'source-in'; sx.drawImage(screenC, 0, 0);
    g.drawImage(sh, x + 14, y + 16); g.drawImage(c, x, y); };
  mk({ blank: true, serial: '2026-0314' }, 1980, 220, 860);
  mk({ name: '佐藤 健太', id: '4117', dev: '52', serial: '2026-4117', seed: 3 }, 2900, 220, 860);
  label('她的卡：什么都没涂', 2000, 820, 34, '#5b5f66'); label('别人的卡：同一张卡，涂了学号、偏差值、こころ', 2920, 820, 34, '#5b5f66');
  mk({ blank: true, heart: 'over', stamp: '読み取れません', serial: '2026-0314', seed: 5 }, 1980, 900, 860);
  mk({ side: 'back', serial: '2026-0314' }, 2900, 900, 860);
  label('涂出格的黑：机器报「読み取れません」', 2000, 1500, 34, '#5b5f66'); label('背面印着三条规矩，也是这首歌', 2920, 1500, 34, '#5b5f66');
  // palette
  const sw = [['纸白', '#F5F3ED', '世界的底色'], ['碧青', '#218EA3', '小城的印刷墨'], ['碧青线', '#12606E', '描线'], ['碧青网点', '#1B7F92', '阴影网点'], ['铅笔黑', '#2A2A2F', '机器只读这种黑'], ['夜', '#2E3546', 'C 段台灯外的夜'], ['金色面板', '#C9A548', '她的吉他']];
  sw.forEach(([n, c, d], i) => {
    const x = 90 + i * 258, y = 1590;
    g.fillStyle = c; g.fillRect(x, y, 220, 190); g.strokeStyle = 'rgba(43,43,48,0.3)'; g.lineWidth = 2; g.strokeRect(x, y, 220, 190);
    label(n, x, y + 206, 28, INKC, 600); label(c, x, y + 244, 26, INKC, 500); label(d, x, y + 282, 24, '#5b5f66');
  });
  label('全片不用红色。批改、报错、印章都用铅笔黑或碧青。', 90, 1960, 34, INKC, 600);
  const ny = notes(['字体：印刷用 Zen Kaku Gothic New；读卡机打印是 16 点阵（DotGothic16，每个点是一粒圆墨点）；手写用 Klee One；歌词用 Shippori 明朝。方阵里翻过来的卡背，是被人用铅笔偷偷涂黑的规矩面。',
    '画法统一：二维页和三维镜头是同一张印刷品。纸白底，碧青描线（近粗远细，外轮廓粗、内部细），暗部是一档碧青网点，材质深浅变成几档碧青平涂，碧青层对纸面有一点套色偏差；天空用同一网点由疏到密。不用模糊、渐变和照片质感。'], 1980, 1600, 34, 1.5, 1780);
  label('读卡机的打印', 1980, ny + 20, 34, '#5b5f66');
  [['読み取れません', 0], ['不正解', 640], ['正解', 1010], ['読取完了', 1290]].forEach(([t, dx], i) => inkjetText(g, t, 1980 + dx, ny + 150, { size: 70, seed: 3 + i, matrix: true }));
}
window.__ready = true;
