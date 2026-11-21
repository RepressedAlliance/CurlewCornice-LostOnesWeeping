// Segment 09: the interlude riff (k264-k295, 98.096-109.577 s, global frames [2943, 3287)). docs/分镜/09_间奏riff.md (third
// draft), the review notes at the end of docs/全片分镜.md, and the blind review of the two samples (design 甲 chosen; the sample
// page with both designs is archive/seg09_sample_20261120/seg_09_samples.js).
//
// k264 macro of the cards' fronts on the playground's ball-stop fence (every name different); k265/k266/k267 cards A, B, C flip one
// by one, three different blacks (A neat and full, B looping circles, C one-way hatching stopped halfway), each with a few broken
// white dents. k268 the zoom out starts and the black grows as a MOUNTAIN from the card above her (row 1, column 0): row 1 zips
// out from B and C as the ground line; every other row starts on the beat when the peak reaches it and then widens inside a
// triangle (peak P, half base B). On every beat P and B surge (eased) and settle: the peak climbs from about 30% to 88% of the
// frame height while the zoom widens, the slopes steepen, so a low mound grows into a clear steep Λ with white wedges either side.
// k284 the wedges flip from the slopes outwards in 10 frames: all black, and the sky (in frame since k282) is night. k285 a gust
// crosses the wall from the right in two beats: a broad band of cards swings towards the lamp (silver) and back (shadow). k287-k289
// the frame comes down (zoom in a little and shift down) to her: she stands at the foot of the black wall, the only colour, and
// plays (R09-play, lit from the lamp at the right); k289 (low hit) the frame lands. k292 her big strum: a mountain of light grows up
// the wall from above her head in 1.2 beats (every card inside turns 35 deg to the lamp, the newest rows brightest, a glow), holds,
// and falls back from the top.
//
// "3D": only the card wall is 3D (each card a thin sheet turning about its cord, with thickness, side light and a shadow on the
// mesh). The camera is 25 m off the fence, so the long lens projects it orthographically. Her, the amp, the foreground planter, the
// base wall and the far street are 2D layers placed by their distance (her 22 m, planter 18 m, fence 25 m) and moved with the same
// zoom and shift: no parallax. Units: cm. "Fence-equivalent" coordinates: a point (x, y) at distance d shows where
// (x*25/d, 135 + (y-135)*25/d) on the fence plane would (the camera is at 1.35 m).
import { drawCard, CARD_RATIO } from '../../lib/card.js';
import { BEAT, FRAME, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { move, frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, stringsAudit, partAudit, PIX, partReport } from '../../lib/parts.js';
import { herCardFace, BACK as HER_BACK } from '../../lib/her_card.js';
import { PAPER, PAPER_CARD, PAPER_RGB, TEAL, TEAL_RGB, INK_RGB, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB,
         RUBBED_WHITE, rgba, rgb } from '../../lib/palette.js';

export default async function seg09(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 2943, F1 = 3287, FPS = 30, T0 = F0 / FPS, T1 = F1 / FPS;
  const S = createScore('seg_09', { t0: T0, t1: T1 });
  const LAY = createLayout();
  const K = beatV;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };
  const DEG = Math.PI / 180;
  const lerp = (a, b, f) => a + (b - a) * f;
  const mixRGB = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
  // Colours are only the three plates mixed (as segment 10 does). The night is drawn the way 10 draws it: a heavy teal screen
  // and the paper-white structure lit by the lamp, never a grey multiply over everything (no veil: 根因清单).
  const SILVER_RGB = mixRGB(INK_RGB, PAPER_RGB, 0.42);          // graphite catching the lamp: ONE flat matte step (well under her whites)
  const LINE_RGB = mixRGB(TEAL_RGB, INK_RGB, 0.35);             // the print's deeper teal (10's LINE): the heavy screen's dots
  const NIGHT_RGB = mixRGB(INK_RGB, TEAL_RGB, 0.16);            // night concrete / far roofs (10's NIGHT)
  const NIGHT_MID_RGB = mixRGB(INK_RGB, TEAL_RGB, 0.44);        // one step lit by the lamp (10's NIGHT_MID)
  const DARK_RGB = GRAPHITE_DARK_RGB;
  // the night of k282-k295 (third design of this block, 09 分镜 第 12 节): the wall must read as ONE black. Seen through the gaps
  // between the cards the night sky is graphite with only a hint of teal (its value close to the cards' backs, never a bright
  // teal grid); unlit paper at night is a dark grey (the paper margins of the backs drop to it), so nothing on the wall is light
  // unless the lamp (out of frame right) lights it: the steel, the wire, the glint on a card that turns, the pool around her
  const NIGHT_SKY_RGB = mixRGB(GRAPHITE_FIELD_RGB(), TEAL_RGB, 0.07);
  const NIGHT_PAPER_RGB = mixRGB(GRAPHITE_FIELD_RGB(), TEAL_RGB, 0.08);
  function GRAPHITE_FIELD_RGB() { return [1, 3, 5].map(i => parseInt(GRAPHITE_FIELD.slice(i, i + 2), 16)); }

  // ---------------- the fence and the card grid ----------------
  const CW = 15, CH = 10, PX = 16.5, PY = 12.5, Y1 = 180;          // card 15 x 10 cm, hung densely (1.5 cm apart, 2.5 cm for the cords)
  const ROWS = 20, C0 = -64, C1 = 64;
  const TOPBAR = 445;                                            // the fence's top rail
  const WALL = 110;                                              // the concrete base wall, 1.1 m
  const rowBottom = r => Y1 + (r - 1) * PY;
  const R0 = rng(9091);

  // A, B, C: the three people whose cards open the segment (shared with 11; the roster in 设定包)
  const OWNERS = {
    A: { name: '鈴木　恵子', col: 0, style: 'neat', seed: 9101 },      // careful: a full, even, meticulous fill
    B: { name: '吉田　蓮', col: -1, style: 'loops', seed: 9102 },      // tired: looping circles over each other, the paper fuzzed
    C: { name: '渡辺　翔', col: 1, style: 'half', seed: 9103 },        // one-way hatching, stopped halfway
  };
  const FAM = ['佐藤', '田中', '高橋', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
    '山崎', '森', '池田', '橋本', '阿部', '石川', '前田', '藤田', '小川', '岡田', '後藤', '長谷川', '村上', '近藤', '石井', '坂本', '遠藤', '青木', '藤井', '西村', '福田'];
  const GIV = ['陽翔', '湊', '樹', '大和', '悠真', '朝陽', '碧', '律', '颯', '陽向', '蒼', '奏太', '健', '拓海', '直樹', '誠', '亮', '陽葵', '凛', '結菜', '芽依',
    '紬', '葵', '咲良', '美月', '結衣', '杏', '心春', '莉子', '澪', '詩', '千尋', '美咲', '彩', '真央', '優花', '遥', '茜', '楓', '栞'];

  // ---------------- card textures (computed once): fronts all different, backs in many ways of blacking ----------------
  const TU = 576, TH = TU / 1.5;
  function mips(c) {                                              // 576 -> 192 -> 64 -> 20 px wide, each step high quality
    const out = [c]; let src = c;
    for (const w of [192, 64, 20]) { const [d, x] = mk(w, w / 1.5); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, d.width, d.height); out.push(d); src = d; }
    return out;
  }
  const levelOf = sw => sw >= 150 ? 0 : sw >= 50 ? 1 : sw >= 16 ? 2 : 3;

  const NFRONT = 48, FRONTS = [], NAMES = [];
  for (let i = 0; i < NFRONT; i++) NAMES.push(`${FAM[(i * 7 + 3) % FAM.length]}　${GIV[(i * 11 + 5) % GIV.length]}`);
  function frontTex(name, seed) {
    const [c] = mk(TU, TH); const r = rng(seed);
    drawCard(c, { name, seed, id: String(1000 + Math.floor(r() * 8999)), dev: String(38 + Math.floor(r() * 35)), serial: `2026-${String(1000 + Math.floor(r() * 8999))}` });
    return mips(c);
  }
  for (let i = 0; i < NFRONT; i++) FRONTS.push(frontTex(NAMES[i], 300 + i * 13));
  const FRONT_OWN = {}; for (const [k, o] of Object.entries(OWNERS)) FRONT_OWN[k] = frontTex(o.name, o.seed);

  // graphite: soft strokes that overlap into a matte solid black (never a see-through veil), sheen streaks along the strokes
  function strokes(x, { angle = -0.35, gap = 0.012, width = 0.02, alpha = 0.78, box = [0, 0, 1, 1], passes = 1, wobble = 0.004, R, until = null }) {
    const u = TU, [bx0, by0, bx1, by1] = box.map((v, i) => v * (i % 2 ? TH : TU));
    x.save(); x.beginPath(); x.rect(bx0, by0, bx1 - bx0, by1 - by0); x.clip(); x.lineCap = 'round';
    for (let p = 0; p < passes; p++) {
      const a = angle + p * 0.09, ca = Math.cos(a), sa = Math.sin(a), diag = Math.hypot(TU, TH);
      for (let d = -diag; d < diag; d += gap * u * (0.85 + R() * 0.3)) {
        if (until && !until(d / diag)) continue;
        x.strokeStyle = rgba(R() < 0.5 ? DARK_RGB : INK_RGB, alpha * (0.85 + R() * 0.15)); x.lineWidth = width * u * (0.8 + R() * 0.4);
        const cx = TU / 2 - sa * d, cy = TH / 2 + ca * d; x.beginPath();
        for (let k = -12; k <= 12; k++) { const s = k / 12 * diag * 0.6, w = Math.sin(k * 0.9 + d) * wobble * u; x.lineTo(cx + ca * s - sa * w, cy + sa * s + ca * w); }
        x.stroke();
      }
    }
    x.restore();
  }
  function sheen(x, R, n = 10, angle = -0.35, box = [0, 0, 1, 1]) {
    x.save(); x.beginPath(); x.rect(box[0] * TU, box[1] * TH, (box[2] - box[0]) * TU, (box[3] - box[1]) * TH); x.clip();
    for (let i = 0; i < n; i++) {
      const px = R() * TU, py = R() * TH, l = TU * (0.15 + R() * 0.3);
      x.strokeStyle = rgba(GRAPHITE_LIGHT_RGB, 0.35 + R() * 0.25); x.lineWidth = TU * (0.003 + R() * 0.004);
      x.beginPath(); x.moveTo(px - Math.cos(angle) * l / 2, py - Math.sin(angle) * l / 2); x.lineTo(px + Math.cos(angle) * l / 2, py + Math.sin(angle) * l / 2); x.stroke();
    }
    x.restore();
  }
  function loops(x, R, { n = 46, r0 = 0.08, r1 = 0.2, alpha = 0.8, width = 0.016 }) {
    x.save(); x.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const cx = R() * TU, cy = R() * TH, rr = TU * (r0 + R() * (r1 - r0)), turns = 3 + R() * 3;
      x.strokeStyle = rgba(R() < 0.5 ? DARK_RGB : INK_RGB, alpha); x.lineWidth = TU * width * (0.7 + R() * 0.6); x.beginPath();
      for (let k = 0; k <= turns * 24; k++) { const a = k / 24 * 2 * Math.PI, rk = rr * (0.7 + 0.3 * Math.sin(k * 0.21)); x.lineTo(cx + Math.cos(a) * rk + k * 0.12, cy + Math.sin(a) * rk * 0.8); }
      x.stroke();
    }
    x.restore();
  }
  function fuzz(x, R, n = 260) {                                  // paper roughed up by pressing too hard: tiny lifted specks
    for (let i = 0; i < n; i++) { x.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 0.5 + R() * 0.4); x.fillRect(R() * TU, R() * TH, 1 + R() * 2.5, 1 + R() * 1.5); }
  }
  // the dents: someone wrote hard on paper laid over this card, so where the pencil passed later the grooves stayed white, a hair
  // of darker graphite on each side. Only broken pieces here (they never make a character: they are parts of 11's words)
  // (only inside the graphite: on bare paper a groove does not show, so the dents keep to the painted band y0-y1)
  function dents(x, R, n, y0 = 0.3, y1 = 0.85) {
    // each piece stands alone, well apart from the others, so no two of them cross or join into something that reads as a kana
    x.save(); x.lineCap = 'round'; const placed = [];
    for (let i = 0; i < n; i++) {
      let cx, cy, tries = 0;
      do { cx = TU * (0.18 + R() * 0.64); cy = TH * (y0 + R() * (y1 - y0)); } while (placed.some(([px, py]) => Math.hypot(px - cx, py - cy) < TU * 0.16) && ++tries < 60);
      if (tries >= 60) continue;
      placed.push([cx, cy]);
      const l = TU * (0.025 + R() * 0.045), a = (R() - 0.5) * 2.4, bend = (R() - 0.5) * 0.5;
      const path = () => { x.beginPath(); x.moveTo(cx - Math.cos(a) * l / 2, cy - Math.sin(a) * l / 2); x.quadraticCurveTo(cx - Math.sin(a) * l * bend, cy + Math.cos(a) * l * bend, cx + Math.cos(a) * l / 2, cy + Math.sin(a) * l / 2); };
      path(); x.strokeStyle = rgba(DARK_RGB, 0.95); x.lineWidth = TU * 0.008; x.stroke();
      path(); x.strokeStyle = RUBBED_WHITE; x.lineWidth = TU * 0.0035; x.stroke();
    }
    x.restore();
  }
  // every variant draws its own random strokes (seeded per variant), so no two cards on the wall carry the same black
  const STYLES = {
    neat: (x, R) => { strokes(x, { R, angle: -0.3 + (R() - 0.5) * 0.3, gap: 0.009, width: 0.016, passes: 3, alpha: 0.86, wobble: 0.001, box: [0.02, 0.03, 0.98, 0.97] }); sheen(x, R, 6, -0.3); },
    loops: (x, R) => { loops(x, R, { n: 60 }); loops(x, R, { n: 30, r0: 0.04, r1: 0.1, width: 0.022 }); fuzz(x, R, 320); },
    // C: one-way hatching from the bottom up, stopped partway: the ragged top edge of the strokes sits between rule 2 and rule 3,
    // so 記入上の注意 and the first two rules still show above the black
    half: (x, R) => {
      x.save(); x.beginPath(); x.moveTo(-2, TH + 2);
      for (let i = 0; i <= 30; i++) x.lineTo(TU * i / 30, TH * (0.322 + R() * 0.022 + 0.012 * Math.sin(i * 0.7)));
      x.lineTo(TU + 2, TH + 2); x.closePath(); x.clip();
      strokes(x, { R, angle: -1.15, gap: 0.011, width: 0.018, passes: 2, alpha: 0.84 }); sheen(x, R, 5, -1.15, [0, 0.42, 1, 1]); x.restore();
    },
    cross: (x, R) => { const a = 0.4 + R() * 0.4; strokes(x, { R, angle: a, gap: 0.016, width: 0.016, alpha: 0.8 }); strokes(x, { R, angle: -a, gap: 0.016, width: 0.016, alpha: 0.8 }); strokes(x, { R, angle: 0.0, gap: 0.03, width: 0.02, alpha: 0.6 }); },
    hard: (x, R) => { const a = -0.3 - R() * 0.5; strokes(x, { R, angle: a, gap: 0.01, width: 0.02, passes: 3, alpha: 0.92 }); fuzz(x, R, 500); sheen(x, R, 14, a); },
    zigzag: (x, R) => { x.save(); x.lineJoin = 'round'; for (let p = 0; p < 2; p++) { x.strokeStyle = rgba(DARK_RGB, 0.8); x.lineWidth = TU * 0.03; x.beginPath(); let left = true; for (let y = -10; y < TH + 20; y += TU * (0.015 + R() * 0.006)) { x.lineTo(left ? -10 : TU + 10, y + R() * 6); left = !left; } x.stroke(); } x.restore(); },
    vertical: (x, R) => { const a = Math.PI / 2 - 0.15 + R() * 0.2; strokes(x, { R, angle: a, gap: 0.01, width: 0.018, passes: 2, alpha: 0.84 }); sheen(x, R, 8, a); },
    smear: (x, R) => { strokes(x, { R, angle: -0.2, gap: 0.01, width: 0.02, passes: 2, alpha: 0.86 }); x.save(); x.lineCap = 'round'; x.strokeStyle = rgba(GRAPHITE_LIGHT_RGB, 0.45); x.lineWidth = TU * 0.12; x.beginPath(); x.moveTo(TU * (0.1 + R() * 0.2), TH * (0.7 + R() * 0.2)); x.quadraticCurveTo(TU * 0.5, TH * (0.3 + R() * 0.3), TU * (0.75 + R() * 0.2), TH * (0.2 + R() * 0.2)); x.stroke(); x.restore(); },
    stipple: (x, R) => { strokes(x, { R, angle: -0.6, gap: 0.014, width: 0.02, alpha: 0.7 }); for (let i = 0; i < 1800; i++) { x.fillStyle = rgba(R() < 0.5 ? DARK_RGB : INK_RGB, 0.85); x.beginPath(); x.arc(R() * TU, R() * TH, TU * (0.008 + R() * 0.01), 0, 7); x.fill(); } },
    diag: (x, R) => strokes(x, { R, angle: -0.6 - R() * 0.4, gap: 0.022, width: 0.034, alpha: 0.92 }),
    box: (x, R) => { strokes(x, { R, angle: -0.4, gap: 0.009, width: 0.017, passes: 3, alpha: 0.9, box: [0.075, 0.47, 0.925, 0.93] }); strokes(x, { R, angle: 0.3, gap: 0.02, width: 0.02, alpha: 0.75 }); },
  };
  // how often each way of blacking appears on the wall: almost all full fills (the far wall a textured solid black, no white
  // specks); B's looping circles belong to B alone; C's half fill only to C
  const STYLE_W = { neat: 3, cross: 3, hard: 3, zigzag: 2, vertical: 3, smear: 2, stipple: 1.5, diag: 2, box: 0.6 };
  const NVAR = 5;
  // the printed rules under the graphite (设定包: they show through to a different degree for each way of blacking): the printed
  // ink takes the pencil differently, so the lines read as a faint teal sheen in the black, never as clean print
  const THROUGH = { neat: 0.13, loops: 0.3, half: 0.22, cross: 0.2, hard: 0.06, zigzag: 0.22, vertical: 0.17, smear: 0.15, stipple: 0.2, diag: 0.24, box: 0 };
  const RULE_LINES = [['1.', 'HBの黒鉛筆で、○の中を正確にぬりつぶしてください。'], ['2.', 'はみ出したり、うすかったりすると読み取れません。'], ['3.', '訂正するときは、消しゴムできれいに消し、消しくずを残さないでください。']];
  function showThrough(x, a) {                                    // the same positions as card.js draws the back (misreg 0.7)
    if (!(a > 0)) return;
    const u = TU; x.save(); x.translate(0.7 * u / 600, 0.7 * u / 900); x.textBaseline = 'middle'; x.fillStyle = rgba(TEAL_RGB, a);
    x.font = `700 ${u * 0.034}px ZenKakuB`; x.fillText('記入上の注意', u * 0.08, u * 0.1);
    x.font = `500 ${u * 0.024}px ZenKaku`;
    RULE_LINES.forEach(([n, t], i) => { x.fillText(n, u * 0.08, u * (0.155 + i * 0.042)); x.fillText(t, u * 0.115, u * (0.155 + i * 0.042)); });
    x.restore();
  }
  // Every back keeps its paper (docs/卡面状态.md 第四节, the same numbers as her card's blackened back, her_card.js BACK): the
  // pencil stays off a margin of 0.03u round the edge and a paper ring round the clip slot, and the cord goes into the slot, so
  // a blackened card on the fence reads as a paper card with a white rim, never as a black rounded block (a phone)
  function backTex(style, seed, nDents = 0) {
    const [c, x] = mk(TU, TH); const R = rng(seed);
    drawCard(c, { side: 'back', seed });
    // the pencil's region: the card inset by the margin, minus the ring round the slot (her_card.js drawHerCardBack, full)
    const [lc, lx] = mk(TU, TH), m = TU * HER_BACK.margin, [sx, sy, sw, sh] = HER_BACK.slot, ring = TU * HER_BACK.slotRing;
    lx.save(); lx.beginPath(); lx.rect(0, 0, TU, TH); lx.clip(); STYLES[style](lx, R); lx.restore();
    lx.save(); lx.globalCompositeOperation = 'destination-in'; lx.fillStyle = '#000'; lx.beginPath(); lx.roundRect(m, m, TU - 2 * m, TH - 2 * m, TU * 0.012); lx.fill(); lx.restore();
    lx.save(); lx.globalCompositeOperation = 'destination-out'; lx.fillStyle = '#000'; lx.beginPath(); lx.roundRect(TU * sx - ring, 0, TU * sw + 2 * ring, TU * (sy + sh) + ring, TU * sh / 2 + ring); lx.fill(); lx.restore();
    x.drawImage(lc, 0, 0);
    x.save(); x.beginPath(); x.roundRect(m, m, TU - 2 * m, TH - 2 * m, TU * 0.012); x.clip(); showThrough(x, THROUGH[style]); x.restore();
    if (nDents) style === 'half' ? dents(x, R, nDents, 0.46, 0.9) : dents(x, R, nDents);
    x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.beginPath(); x.roundRect(TU * 0.4, TU * 0.022, TU * 0.2, TU * 0.028, TU * 0.014); x.fill(); x.restore();
    return mips(c);
  }
  const BACKS = {}; const STYLE_LIST = Object.keys(STYLE_W);
  for (const st of STYLE_LIST) BACKS[st] = [...Array(NVAR)].map((_, v) => backTex(st, 700 + STYLE_LIST.indexOf(st) * 31 + v * 7));
  const BACK_OWN = {}; for (const [k, o] of Object.entries(OWNERS)) BACK_OWN[k] = backTex(o.style, o.seed + 50, k === 'A' ? 5 : 4);
  // the same backs at night: unlit paper (the margins, the printed rules showing through) drops to a dark grey; the graphite
  // keeps its own strokes (darken: only what is lighter than the night paper changes)
  const NIGHT_OF = new Map();
  function nightMips(ms) {
    if (NIGHT_OF.has(ms)) return NIGHT_OF.get(ms);
    const out = ms.map(c0 => {
      const [c, x] = mk(c0.width, c0.height); x.drawImage(c0, 0, 0);
      x.globalCompositeOperation = 'darken'; x.fillStyle = rgb(NIGHT_PAPER_RGB); x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = 'destination-in'; x.drawImage(c0, 0, 0);
      return c;
    });
    NIGHT_OF.set(ms, out); return out;
  }
  for (const st of STYLE_LIST) BACKS[st].forEach(nightMips);
  Object.values(BACK_OWN).forEach(nightMips);
  // the same backs as the lamp's glint sees them: graphite is what shines (the denser the pencil, the brighter), bare paper stays
  // dark, so a glint is made of the card's own strokes (a sheen on pencil), not a clean white bar
  const LIT_OF = new Map();
  function litMips(ms) {
    if (LIT_OF.has(ms)) return LIT_OF.get(ms);
    const out = ms.map(c0 => {
      const [c, x] = mk(c0.width, c0.height); x.drawImage(c0, 0, 0);
      x.globalCompositeOperation = 'difference'; x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = 'multiply'; x.fillStyle = rgb(mixRGB(PAPER_RGB, TEAL_RGB, 0.04)); x.fillRect(0, 0, c.width, c.height);
      x.globalCompositeOperation = 'destination-in'; x.drawImage(c0, 0, 0);
      return c;
    });
    LIT_OF.set(ms, out); return out;
  }
  for (const st of STYLE_LIST) BACKS[st].forEach(litMips);
  Object.values(BACK_OWN).forEach(litMips);
  const wsum = Object.values(STYLE_W).reduce((a, b) => a + b, 0);
  const pickStyle = r => { let a = r * wsum; for (const [k, w] of Object.entries(STYLE_W)) { if ((a -= w) <= 0) return k; } return 'neat'; };

  // ---------------- the cards ----------------
  const CARDS = [];
  for (let r = 1; r <= ROWS; r++) for (let c = C0; c <= C1; c++) {
    const own = r === 1 ? Object.keys(OWNERS).find(k => OWNERS[k].col === c) : null;
    const h = Math.floor(R0() * 1e6);
    CARDS.push({ r, c, x: c * PX, y: rowBottom(r) + (R0() - 0.5) * 0.6, own,
      front: own ? FRONT_OWN[own] : FRONTS[h % NFRONT], back: own ? BACK_OWN[own] : BACKS[pickStyle(R0())][h % NVAR], t: Infinity });
  }
  const cardAt = (r, c) => CARDS[(r - 1) * (C1 - C0 + 1) + (c - C0)];

  // ---------------- the camera: one fixed position, zoom (frame width wf at the fence) and a vertical shift (bottom edge yb) ----
  function monoCubic(keys) {                                      // monotone cubic through log(wf): never backwards, speed continuous
    const xs = keys.map(k => k[0]), ys = keys.map(k => Math.log(k[1])), n = xs.length, d = [], m = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : 3 * (xs[i + 1] - xs[i - 1]) / ((2 * xs[i + 1] - xs[i] - xs[i - 1]) / d[i - 1] + (xs[i + 1] + xs[i] - 2 * xs[i - 1]) / d[i]);
    return k => {
      if (k <= xs[0]) return Math.exp(ys[0]); if (k >= xs[n - 1]) return Math.exp(ys[n - 1]);
      let i = 0; while (k > xs[i + 1]) i++;
      const h = xs[i + 1] - xs[i], s = (k - xs[i]) / h, s2 = s * s, s3 = s2 * s;
      return Math.exp((2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h * m[i + 1]);
    };
  }
  // k264-k268 macro 0.75 m; k272 1.12 m; k276 1.9 m; k280 3.9 m (fastest just before, the lowest hit); the top rail comes in at
  // k282; k284 5.8 m
  // ZOOM0 is the approved curve up to k282 (the mountain's rows and widths are still computed on it, so k264-k283 flip exactly as
  // before). From k282 the camera eases to a stop at 5.1 m instead of 5.8 m: the sky above the rail stays a narrow band (about 7%
  // of the frame) and the wall fills the picture at the moment it goes black (review: a flat teal sky took the top 15-18%)
  const ZOOM0 = monoCubic([[268, 75], [272, 112], [276, 190], [280, 390], [282, (TOPBAR - Y1) / 0.5625], [284, 580]]);
  const WF_END = 510, Z82 = ZOOM0(282), M82 = (Math.log(ZOOM0(282.001)) - Math.log(ZOOM0(281.999))) / 0.002;
  const ZOOM = k => {
    if (k <= 282) return ZOOM0(k);
    const h = 2, s = Math.min(1, (k - 282) / h), y0 = Math.log(Z82), y1 = Math.log(WF_END), s2 = s * s, s3 = s2 * s;
    return Math.exp((2 * s3 - 3 * s2 + 1) * y0 + (s3 - 2 * s2 + s) * h * M82 + (-2 * s3 + 3 * s2) * y1);
  };
  // the ending: a low concrete planter edge (30 cm, its top face 25 cm deep) at 18 m. Its far top edge is the line that hides her
  // shoes (8 cm of her at 22 m), and between it and the foot of the base wall a strip of ground shows (23.5-25 m), so she reads as
  // standing out in front of the wall, not pasted on it. The planter takes the bottom 6% of the frame; 6.5 m wide (09 分镜 第 7 节)
  const RIN_D = 2200, FENCE_D = 2500, PLANT_D = 1800, PLANT_H = 30, PLANT_DEEP = 25;
  const eq = (x, y, d) => [x * FENCE_D / d, 135 + (y - 135) * FENCE_D / d];
  const PLANT_TOP = eq(0, PLANT_H, PLANT_D + PLANT_DEEP)[1];          // the far edge of its top face (its silhouette)
  const PLANT_NEAR = eq(0, PLANT_H, PLANT_D)[1];                      // the near edge (the top of its front face)
  const WF_LAST = 650, YB_LAST = PLANT_NEAR - 0.06 * WF_LAST * 0.5625;
  const DOWN0 = 287, DOWN1 = 289;
  // ---- the whole frame's motion (third pass, 2026-11-21, docs/制作约定.md 第六节「整屏运动」; director on the second cut:
  // “screen motion can have rhythm but must not cause dizziness”). The second pass stepped the zoom out on every beat k269-k284 with an
  // overshoot (16 jolts in a row, a back-and-forth), punched the macro on k265-k268, landed the move down with an overshoot,
  // pushed in on k290/k291 and punched k292: 18 jolts. Now the frame moves only three times:
  //   k265 大击 (the crash, card A flips): one step in on the macro, 3 frames, no overshoot, it stays;
  //   k268-k284 the zoom out is ONE eased move again (the approved monotone curve ZOOM0, eased into 5.1 m from k282); the beat
  //            lives in the picture: the mountain's peak and base grow on every beat (PB), the rows start on the beat, the k280
  //            band floods with its graphite flash, the night falls in two steps;
  //   k289 甩镜 (the move down to her, registered): 10 frames ending on k289, eased in and out, it lands without overshoot;
  //   k292 大击 (her big chord): one step in about her knees, 3 frames, no overshoot, then still to the cut.
  // The heavy kicks k290/k291 move only things in the picture: her strings ring and the hung cards above her head shiver
  // (kickTurn), so the frame is still for 3 beats before k292's step.
  const stepP = u => u < 0 ? 0 : ease(Math.min(1, (u + 1) / 4));             // u: frames since the beat (a 3-frame step, no overshoot)
  const uOf = (t, k) => (t - K(k)) / FRAME;
  const MACRO_IN = 1.03;                                                      // k265: 75 * 1.03 -> 75 about the frame's bottom edge (top corners 2.2% of the width)
  const HER_STEP = 1.03, YC = 40;                                             // k292: 3% in about her knees (the planter keeps its strip)
  const WHIP_F = 10, T_WHIP1 = K(DOWN1), T_WHIP0 = T_WHIP1 - WHIP_F * FRAME;
  function camAt(t) {
    const k = (t - 0.318) / BEAT;
    if (k < 268) return { wf: 75 * Math.pow(MACRO_IN, 1 - stepP(uOf(t, 265))), yb: Y1 };
    if (t < T_WHIP0) return { wf: ZOOM(k), yb: Y1 };
    if (t < T_WHIP1) {                                             // the whip down to her: eased in and out, lands on k289
      const e = 0.5 - 0.5 * Math.cos(Math.PI * (t - T_WHIP0) / (T_WHIP1 - T_WHIP0));
      return { wf: Math.exp(lerp(Math.log(WF_END), Math.log(WF_LAST), e)), yb: lerp(Y1, YB_LAST, e) };
    }
    const wf = WF_LAST / Math.pow(HER_STEP, stepP(uOf(t, 292)));
    return { wf, yb: YC - (YC - YB_LAST) * wf / WF_LAST };
  }
  S.mark('大击 k265: one step in on card A (the crash)', K(265));
  move(S, 'zoom out (one eased move)', K(268), K(284));
  S.mark('甩镜 down to her lands (10 frames)', K(DOWN1));
  S.mark('大击 k292: one step in on her chord', K(292));

  // ---------------- the mountain: who flips when ----------------
  // On each beat kb the peak P (height above row 1's bottom) and the half base B (both fence cm) take their values; between beats
  // they surge to the next value in the first 60% of the beat (eased) and settle. A row starts on the first beat its bottom is
  // under the peak; a card of a started row flips when the triangle's slope reaches its near edge (and not before the zip from
  // the middle gets there).
  const fh = k => ZOOM0(k) * 0.5625;
  const PK = {}, BK = {};
  for (let k = 268; k <= 284; k++) {
    const u = Math.min(1, (k - 268) / 14);
    const frac = 0.27 + 0.61 * Math.pow(u, 0.85) + (k > 282 ? 0.05 * (k - 282) : 0);
    const bfrac = 0.92 - 0.2 * u;
    PK[k] = Math.max(k >= 269 ? PY + 0.5 : 10, frac * fh(k)); BK[k] = bfrac * ZOOM0(k) / 2;
  }
  for (let k = 269; k <= 284; k++) { PK[k] = Math.max(PK[k], PK[k - 1]); BK[k] = Math.max(BK[k], BK[k - 1]); }
  function PB(t) {
    const kf = (t - 0.318) / BEAT; if (kf <= 268) return [PK[268], BK[268]]; if (kf >= 284) return [PK[284], BK[284]];
    // the peak steps on the beat (the new rows start there, so the apex stays one card wide); the base surges on the beat with
    // the zoom step (most of it in the first two frames, so the beat's cards flip together) and settles
    const kb = Math.floor(kf), e = ease(Math.min(1, (kf - kb) / 0.22));
    return [PK[kb], lerp(BK[kb], BK[kb + 1], e)];
  }
  const ROW_START = {};
  for (let r = 1; r <= ROWS; r++) {
    const hb = rowBottom(r) - Y1, kmin = r === 1 ? 268 : r === 2 ? 269 : 270;
    for (let k = kmin; k <= 283; k++) if (PK[k] >= hb - 1e-6) { ROW_START[r] = k; break; }
  }
  const ZIP1 = 55 / BEAT, ZIPFAST = 900 / BEAT;                    // row 1 zips out from B and C (the ground line); a row's burst
  CARDS.forEach(cd => { if (cd.own) cd.t = K({ A: 265, B: 266, C: 267 }[cd.own]); });
  const TSTEP = FRAME / 2, T84 = K(284);
  for (const cd of CARDS) {
    if (cd.own) continue;
    const near = Math.max(0, Math.abs(cd.x) - CW / 2);
    if (cd.r === 1) { cd.t = K(268) + Math.max(0, Math.abs(cd.x) - PX) / ZIP1; continue; }
    const ks = ROW_START[cd.r]; if (ks === undefined) continue;
    const ts = K(ks), hb = rowBottom(cd.r) - Y1, tz = ts + Math.abs(cd.x) / ZIPFAST;
    for (let t = ts; t < T84; t += TSTEP) {
      const [Pt, Bt] = PB(t); if (Pt <= hb) continue;
      if (near <= Bt * (1 - hb / Pt)) { cd.t = Math.max(t, tz); break; }
    }
  }
  // k280, the riff's second round (its cymbal): the foot of the mountain floods out to both edges at once. Every card of rows
  // 2-BAND_R still white flips on the beat, from the slopes outwards within 2 frames, with a graphite flash (one frame 78%, the
  // next 30%): the Λ now stands on a black ground across the whole frame
  const T80 = K(280), BAND_R = 6;
  {
    // (the zoom is one eased move now, so the frame keeps widening after k280: every card of these rows that will come into
    // frame before k284 flips with the band; the 2-frame spread is measured on the frame as it is on k280)
    const [P80, B80] = PB(T80 + 0.3 * BEAT), half = ZOOM(280.3) / 2, reach = ZOOM(284) / 2;
    for (const cd of CARDS) {
      if (cd.r < 2 || cd.r > BAND_R || cd.t <= T80 + 2 * FRAME || Math.abs(cd.x) > reach + CW) continue;
      const hb = rowBottom(cd.r) - Y1, edge = Math.max(0, B80 * (1 - hb / P80));
      cd.t = T80 + Math.min(1, Math.max(0, Math.abs(cd.x) - CW / 2 - edge) / Math.max(1, half - edge)) * 2 * FRAME; cd.band = true;
    }
  }
  const FLASH80 = t => { const n = Math.floor(uOf(t, 280)); return n === 0 ? 0.78 : n === 1 ? 0.3 : 0; };
  // k284: every card still white flips, from the slopes outwards, all those in frame within about 10 frames
  const halfwAt84 = r => { const [Pt, Bt] = PB(T84 - 1e-4), hb = rowBottom(r) - Y1; return r === 1 ? Infinity : Math.max(0, Bt * (1 - hb / Pt)); };
  {
    const half = ZOOM(284) / 2;
    for (const cd of CARDS) {
      if (cd.t <= T84) continue;
      const edge = Math.min(halfwAt84(cd.r), half - 1), d = Math.max(0, Math.abs(cd.x) - CW / 2 - edge) / Math.max(1, half - edge);
      cd.t = T84 + Math.min(1.6, d) * 10 * FRAME;
    }
  }

  // ---------------- motions of one card ----------------
  const OV = 12 * DEG;
  function flipAngle(tau) {                                       // 5 frames to 180 deg (fast then slow), 12 deg past, two small sways
    const f = tau * FPS;
    if (f <= 0) return 0;
    if (f < 5) { const s = f / 5; return (Math.PI + OV) * (1 - (1 - s) * (1 - s)); }
    if (f < 14) return Math.PI + OV * Math.cos(Math.PI * (f - 5) / 4) * Math.exp(-(f - 5) / 3);
    return Math.PI;
  }
  // A hung card that is pushed (the gust, the k292 strum through the fence) does not go grey: it SWINGS about its cord, a real
  // sheet with a paper edge. Its turn is a damped swing, first towards the lamp (out of frame right), then back past straight:
  // turned towards the lamp it narrows and a narrow slanted glint crosses its graphite (paper white, the rest stays graphite);
  // swung back the other way, its right paper edge comes forward and catches the lamp as a thin white line. Every card has its
  // own phase and size of swing, so from a distance the wall throws a scattered, moving scale-shimmer, never a block of grey cells
  // (review MUST 2: no stadium card-stunt, no LED matrix)
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  function swing(f, A, P, D) { return f <= 0 ? 0 : A * Math.sin(2 * Math.PI * f / P) * Math.exp(-f / D); }
  // k285 the gust (09 分镜 第 4 节): its front crosses from just beyond the right edge to the left edge in two beats; the cards
  // behind it keep swinging and die down over about a beat, so a ragged band of glints travels right to left
  const T_GUST = K(285), GUST_HALF = ZOOM(285) / 2, GUST_V = (2 * GUST_HALF + 40) / (2 * BEAT);
  function gust(cd, t) {
    const jit = (hash(cd.r, cd.c) - 0.5) * 8 * FRAME, amp = (0.4 + 0.8 * hash(cd.c, cd.r + 77)) * 48 * DEG;
    const ta = T_GUST + (GUST_HALF + 20 - cd.x) / GUST_V + jit + (cd.y - Y1) / 3000;
    const f = (t - ta) * FPS; if (f > 46) return 0;
    return swing(f, amp, 10 + 7 * hash(cd.r + 5, cd.c), 11);
  }
  // k292 the light (09 分镜 第 4 节): her strum shakes the fence; the shiver climbs the wall from the card above her head to the top
  // of the frame in 1.2 beats and spreads sideways a little slower, strongest above her and fading out to either side (so it is a
  // rising, rounded front of glints, not a ruled chevron); each card it reaches swings to the lamp once and settles
  // (2026-11-21 third pass: the frame steps in 3% on k292 and is still from there; the shiver reaches its top on k293, the
  // first beat of the drums' gap, and dies down in the still frame)
  const WF292 = WF_LAST / HER_STEP, YB292 = YC - (YC - YB_LAST) * WF292 / WF_LAST;
  const T_LIGHT = K(292), L_RISE = 1.0 * BEAT, L_TOP = WF292 * 0.5625 + YB292 - Y1 + 20, L_LAT = 260 / BEAT, L_SIG = 190;
  function lightStart(cd) {
    const hb = cd.y - Y1; if (hb > L_TOP) return Infinity;
    return T_LIGHT + L_RISE * (1 - Math.pow(1 - hb / L_TOP, 1 / 2.2)) + Math.abs(cd.x) / L_LAT;   // the inverse of an ease-out rise
  }
  function lightTurn(cd, t) {
    const ts = lightStart(cd); if (!(t > ts)) return 0;
    const f = (t - ts) * FPS + (hash(cd.c + 9, cd.r) - 0.5) * 5; if (f > 40) return 0;
    const amp = (0.55 + 0.6 * hash(cd.r + 3, cd.c + 1)) * 52 * DEG * Math.exp(-((cd.x / L_SIG) ** 2));
    return swing(f, amp, 11 + 6 * hash(cd.c, cd.r + 11), 9);
  }
  // k290, k291 (the two heavy kicks after the landing): the frame stays still; the fence takes the hit right above her. The
  // hung cards of rows 1-4 within about a metre either side of her swing once to the lamp, from her outwards and upwards within
  // 2-3 frames, smaller each row and towards the sides (a small local patch, about 5% of the frame: the picture's hit, not
  // the camera's); k291 a little bigger than k290, k292's light then climbs the whole wall
  const KICKS = [[290, 50], [291, 58]];
  function kickTurn(cd, t) {
    const hb = cd.y - Y1; if (hb > 5 * PY || Math.abs(cd.x) > 170) return 0;
    let a = 0;
    for (const [k, deg] of KICKS) {
      const f = (t - K(k)) * FPS - (Math.abs(cd.x) / 60 + hb / 25) - (hash(cd.c + 41, cd.r) - 0.5) * 1.5;
      if (f <= 0 || f > 30) continue;
      a += swing(f, deg * DEG * (0.75 + 0.5 * hash(cd.r + 7, cd.c + 3)) * Math.exp(-((cd.x / 110) ** 2) - hb / 60), 10 + 4 * hash(cd.c, cd.r + 5), 7);
    }
    return a;
  }
  // the lamp: out of frame right and a little above the wall's middle; how much of its light reaches a point (fence-eq cm), 0-1
  const LAMP = { x: 900, y: 260 };
  const lampI = (x, y) => Math.max(0, Math.min(1, 1.05 - Math.hypot(x - LAMP.x, (y - LAMP.y) * 1.3) / 1250));

  // ---------------- print screens (screen space, 4 px, 45 deg, like the other segments) ----------------
  const DOTS = {};
  function dots(ctx, cover, rgbA = TEAL_RGB, alpha = 1) {
    const key = cover.toFixed(3) + '|' + alpha + '|' + rgbA.join(',');
    if (!DOTS[key]) {
      const p = 4, [c, s] = mk(p, p); s.fillStyle = rgba(rgbA, alpha); const r = p * Math.sqrt(cover / Math.PI / 2);
      for (const [x, y] of [[0, 0], [p, 0], [0, p], [p, p], [p / 2, p / 2]]) { s.beginPath(); s.arc(x, y, r, 0, 7); s.fill(); }
      DOTS[key] = c;
    }
    return ctx.createPattern(DOTS[key], 'repeat');
  }

  // ---------------- the 2D layers of the ending ----------------
  // R09-play (k287-k292) and, from the same master ("redraw exactly, change only the head and the right arm"), R09-strike for k292:
  // the big strum's follow-through, her head thrown up, so the light visibly starts from HER strum (review: k292 she stood frozen)
  const ART = '/art/cut/r09_play_lit.png', ART2 = '/art/cut/r09_strike.png';
  // Her card (docs/卡面状态.md; the face is web/lib/her_card.js, state 'title': all of 09 is after 03 k40): Codex drew it on her
  // chest as a white window in a grey holder, hung from the teal lanyard by a clip at the top centre. The window's four corners
  // are measured in each drawing's own px (work/seg/09/card/measure_card.py -> holder_quads.json: lines fitted to the four edges,
  // fit error <= 0.37 px), with its corner radius and the holder's grey. The face goes through the corners with a true
  // perspective map (a homography), 4x4 samples per drawing px, cut to the window's rounded outline, so the drawn bevel and the
  // grey holder stay round it as drawn. The windows are 1.76 (play) and 1.65 (strike) wide to 1 high, the card 3:2: the face is
  // drawn 4% wider than 3:2 (seg_07's CARD_STRETCH, not visible) and CONTAINED by the window's height, so the whole card shows
  // (clip slot, corner and timing marks, every printed line); the window's own white shows in a sliver either side of it.
  // Every code part on her drawings (the card window, the strings, the jack the lead leaves) comes from art/cut/seg09_parts.json,
  // measured on EACH drawing in its own px (work/seg/09/parts/build_parts.py), read with parts.js partOf (no falling back to the
  // other drawing's anchors) and drawn through the drawing's own placement (根因清单「笔芯和笔不对了……吉他弦和吉他不是一块的」)
  const PA = await loadPartAnchors('/art/cut/seg09_parts.json');
  const DNAME = { [ART]: 'r09_play_lit', [ART2]: 'r09_strike' };
  const holderOf = path => { const h = partOf(PA, DNAME[path], 'holder'); return { q: h.quad, r: h.radius, grey: h.grey }; };
  const HOLDER = { [ART]: holderOf(ART), [ART2]: holderOf(ART2) };
  const CARD_STRETCH = 1.04, HOLD_SUB = 4;
  // unit square (s, t) -> the window quad [TL, TR, BR, BL] (Heckbert's projective map) and its inverse
  function unitToQuad([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
    const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dx2 * dy1;
    const gg = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
    return [x1 - x0 + gg * x1, x3 - x0 + hh * x3, x0, y1 - y0 + gg * y1, y3 - y0 + hh * y3, y0, gg, hh, 1];
  }
  function inv3([a, b, c, d, e, f, gg, hh, i]) {
    const A = e * i - f * hh, B = -(d * i - f * gg), C = d * hh - e * gg, det = a * A + b * B + c * C;
    return [A / det, -(b * i - c * hh) / det, (b * f - c * e) / det, B / det, (a * i - c * gg) / det, -(a * f - c * d) / det, C / det, -(a * hh - b * gg) / det, (a * e - b * d) / det];
  }
  // the card's place in the window, in window fractions (s across, t down): contained by height, centred
  function holderFit(q) {
    const ww = (Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) + Math.hypot(q[2][0] - q[3][0], q[2][1] - q[3][1])) / 2;
    const wh = (Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]) + Math.hypot(q[2][0] - q[1][0], q[2][1] - q[1][1])) / 2;
    const A = CARD_RATIO * CARD_STRETCH, fw = Math.min(1, wh * A / ww), fh = Math.min(1, ww / A / wh);
    return { ww, wh, s0: 0.5 - fw / 2, s1: 0.5 + fw / 2, t0: 0.5 - fh / 2, t1: 0.5 + fh / 2 };
  }
  // the face written into the drawing (a copy), only inside the window; the face's own transparent pixels (its rounded corners,
  // the clip slot) show the holder's grey, the window's white beside a contained card stays as drawn
  const cardScreenBox = {};
  function withCard(im, path) {
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const Hd = HOLDER[path], q = Hd.q, F = holderFit(q), Hi = inv3(unitToQuad(q)), r = Hd.r, [GR, GG, GB] = Hd.grey, N = HOLD_SUB;
    const U = Math.ceil(F.ww * (F.s1 - F.s0) * N), UH = U / CARD_RATIO, face = herCardFace(U, { state: 'title' });
    const fd = face.getContext('2d').getImageData(0, 0, face.width, face.height).data, FW = face.width, FH = face.height;
    const bx0 = Math.floor(Math.min(...q.map(p => p[0]))) - 1, by0 = Math.floor(Math.min(...q.map(p => p[1]))) - 1;
    const bw = Math.ceil(Math.max(...q.map(p => p[0]))) + 2 - bx0, bh = Math.ceil(Math.max(...q.map(p => p[1]))) + 2 - by0;
    const d = x.getImageData(bx0, by0, bw, bh), p = d.data;
    for (let py = 0; py < bh; py++) for (let px = 0; px < bw; px++) {
      let ar = 0, ag = 0, ab = 0, aw = 0;                          // the face over the grey, premultiplied by the window coverage
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const X0 = bx0 + px + (i + 0.5) / N, Y0 = by0 + py + (j + 0.5) / N, w = Hi[6] * X0 + Hi[7] * Y0 + Hi[8];
        const s = (Hi[0] * X0 + Hi[1] * Y0 + Hi[2]) / w, t = (Hi[3] * X0 + Hi[4] * Y0 + Hi[5]) / w;
        const ds = Math.min(s, 1 - s) * F.ww, dt = Math.min(t, 1 - t) * F.wh;     // inside the window's rounded outline
        if (ds < 0 || dt < 0 || (ds < r && dt < r && Math.hypot(r - ds, r - dt) > r)) continue;
        const cs = (s - F.s0) / (F.s1 - F.s0), ct = (t - F.t0) / (F.t1 - F.t0);
        if (cs < 0 || cs > 1 || ct < 0 || ct > 1) continue;                      // the window's own white beside the card
        const fx = Math.min(FW - 1, Math.floor(cs * U)), fy = Math.min(FH - 1, Math.floor(ct * UH)), fi = (fy * FW + fx) * 4, fa = fd[fi + 3] / 255;
        ar += fd[fi] * fa + GR * (1 - fa); ag += fd[fi + 1] * fa + GG * (1 - fa); ab += fd[fi + 2] * fa + GB * (1 - fa); aw++;
      }
      if (!aw) continue;
      const k = (py * bw + px) * 4, cov = aw / (N * N);
      p[k] = p[k] * (1 - cov) + ar / (N * N); p[k + 1] = p[k + 1] * (1 - cov) + ag / (N * N); p[k + 2] = p[k + 2] * (1 - cov) + ab / (N * N);
    }
    x.putImageData(d, bx0, by0);
    // the card's corners in drawing px (for the phone-size record)
    const H = unitToQuad(q), at = (s, t) => { const w = H[6] * s + H[7] * t + H[8]; return [(H[0] * s + H[1] * t + H[2]) / w, (H[3] * s + H[4] * t + H[5]) / w]; };
    cardScreenBox[path] = [at(F.s0, F.t0), at(F.s1, F.t0), at(F.s1, F.t1), at(F.s0, F.t1)];
    return c;
  }
  let RIN = null, RIN2 = null, RAW = {}, MISSING = [];
  try { RAW[ART] = rinPalImage(await img(ART)); RIN = withCard(RAW[ART], ART); } catch (e) { MISSING.push(ART); }
  try { RAW[ART2] = rinPalImage(await img(ART2)); RIN2 = withCard(RAW[ART2], ART2); } catch (e) { MISSING.push(ART2); }
  const rinAtT = t => (t >= T_LIGHT && RIN2) ? RIN2 : RIN;
  const pathOf = im => im === RIN2 ? ART2 : ART;
  // measured on the drawing (1024 x 1536): soles y 1512, top of the head y 209 (152 cm), bow top y 114, feet centre x 461
  const RA = { feet: 1512, head: 209, bow: 114, cx: 461 };
  const RIN_CM = 152 / (RA.feet - RA.head) * FENCE_D / RIN_D;      // fence-equivalent cm per drawing px
  const rinAt = (px, py) => [(px - RA.cx) * RIN_CM, eq(0, 0, RIN_D)[1] + (RA.feet - py) * RIN_CM];
  const RIN_TOP = rinAt(0, RA.bow)[1];                             // the bow's top, fence-equivalent (must stay under 180 before the move down)
  // her drawing's placement on screen for a camera (X, Y, s): ONE transform for the drawing and every part on it (parts.js)
  const rinPlace = (X, Y, s) => { const [a0, b0] = rinAt(0, 0); return placement({ x: X(a0), y: Y(b0), s: RIN_CM * s }); };
  // The strings (2026-11-21 third pass; director: the strings did not read as part of the guitar). Codex drew five-pole pickups and five strings on these two
  // drawings (the gold top between the pickups shows five desaturated lines on the pole lines). Each string is measured on each
  // drawing: the line through its bridge-pickup pole and its neck-pickup pole, refined on the drawn string's own pixels (rms
  // 0.3-0.5 px), from where her sleeve stops covering it near the tailpiece to the neck joint (strings_body), then on over the
  // fretboard to her first fretting finger at its share between the measured binding edges (strings_neck; on the wood the drawn
  // strings are too faint to fit, so that piece is checked to lie on the fretboard). They ring only there: nothing over her
  // sleeve or her fingers.
  const STRINGS = {};
  for (const path of [ART, ART2]) {
    const bd = partOf(PA, DNAME[path], 'strings_body').strings, nk = partOf(PA, DNAME[path], 'strings_neck').strings;
    STRINGS[path] = bd.map((b, i) => [b.a, b.b, nk[i].b]);
  }
  // PART AUDIT on each drawing's own pixels (the drawing before her card face is written into the window)
  // a drawn string on these drawings: a light neutral grey on the chrome, a desaturated line on the gold top, a darker line on the
  // cream pickup covers; the drawing's ink line crossing it (an outline) or skin counts as hidden
  const STRING_PX = ([r, g, b, a]) => { if (a <= 200) return false; const l = (r + g + b) / 3, ch = Math.max(r, g, b) - Math.min(r, g, b);
    return (ch < 30 && l > 92 && l < 236) || (r > 140 && r - b >= 55 && r - b <= 118 && l < 205) || (l > 150 && l < 216 && r - b < 45 && ch < 45); };
  const OVER_STRING = p => PIX.skin(p) || (p[3] > 200 && Math.max(p[0], p[1], p[2]) < 75);
  const ON_FRETBOARD = p => PIX.fretboard(p) || PIX.steel(p) || (p[3] > 200 && (p[0] + p[1] + p[2]) / 3 > 180 && p[0] - p[2] < 80);   // wood, frets, inlays
  const ON_BODY_EDGE = p => p[3] > 200 && p[0] > 190 && p[0] - p[2] > 40;                                                         // gold top or its cream binding
  const WINDOW_PX = ([r, g, b, a]) => a > 200 && Math.min(r, g, b) > 200 && Math.max(r, g, b) - Math.min(r, g, b) < 30;
  for (const path of [ART, ART2]) {
    const nm = DNAME[path], image = RAW[path]; if (!image) continue;
    stringsAudit('seg_09', nm, { image, strings: partOf(PA, nm, 'strings_body').strings, on: STRING_PX, hidden: OVER_STRING });
    stringsAudit('seg_09', nm + ' (neck)', { image, strings: partOf(PA, nm, 'strings_neck').strings, on: ON_FRETBOARD, hidden: PIX.skin, maxOffPct: 3 });
    partAudit('seg_09', nm, 'jack', { image, points: [partOf(PA, nm, 'jack').point], on: ON_BODY_EDGE, maxOffPct: 0 });
    const q = partOf(PA, nm, 'holder').quad, pts = [];                 // the window's inside (3 px in from its edge) is the drawn white
    for (let j = 1; j < 8; j++) for (let i = 1; i < 12; i++) { const s_ = 0.06 + 0.88 * i / 12, t_ = 0.12 + 0.76 * j / 8;
      const top = [lerp(q[0][0], q[1][0], s_), lerp(q[0][1], q[1][1], s_)], bot = [lerp(q[3][0], q[2][0], s_), lerp(q[3][1], q[2][1], s_)];
      pts.push([lerp(top[0], bot[0], t_), lerp(top[1], bot[1], t_)]); }
    partAudit('seg_09', nm, 'card window', { image, points: pts, on: WINDOW_PX, r: 0, maxOffPct: 0 });
  }
  // a small practice amp on a plastic crate, 22 m out, right of her; the planter (60 cm, its shrubs trimmed flush) 18 m out
  const AMP = { x0: 70, x1: 122, y0: 30, y1: 80 }, CRATE = { x0: 66, x1: 126, y0: 0, y1: 30 };
  const TOWN = []; { const R = rng(9300); for (let x = -1800; x < 1800;) { const w = 30 + R() * 70, h = 118 + R() * 30; TOWN.push({ x, w, h, roof: R() < 0.55 ? 3 + R() * 6 : 0, lights: R() < 0.35 ? [[x + 5 + R() * (w - 10), 112 + R() * (h - 120)]] : [] }); x += w + 2 + R() * 18; } }
  // the posts every 2 m, placed between columns (none behind column 0: in the macro a post behind card A read as a ribbon)
  const POSTS = []; for (let x = -3100; x <= 3100; x += 200) POSTS.push(x);

  // ---------------- one frame ----------------
  const [MC, MG] = mk(W, 1080), [SC, SG] = mk(W, 1080), [FC, FG] = mk(W, 1080), [NC, NG] = mk(W, 1080);
  // the night falls k282-k284 (09 分镜 第 4 节): in the sky and the gaps, and on the unlit paper of the backs; the fronts' paper
  // white never dims (the last white wedges stay full white until they flip on k284)
  // (2026-11-21: in two steps on the beats k282 and k283, with the zoom steps, not a two-beat fade)
  function nightAt(t) { return 0.5 * stepP(uOf(t, 282)) + 0.5 * stepP(uOf(t, 283)); }
  // the night sky as print: graphite with a hint of teal, under a fine teal screen that is a little denser just above the far
  // roofs (the town's glow) and thins out upwards. Its value sits next to the cards' backs, so through the gaps the wall stays
  // one black (review MUST 1: the gaps had read as a bright teal grid, "tiles", "an LED screen")
  function nightSky(ctx, Y, y0w, y1w, a) {
    ctx.save(); ctx.globalAlpha = a;
    const top = Math.max(0, Y(y1w)), bot = Math.min(1080, Y(y0w));
    ctx.fillStyle = rgb(NIGHT_SKY_RGB); ctx.fillRect(0, top, W, bot - top);
    for (let hw = Math.floor(y0w / 15) * 15; hw < y1w; hw += 15) {
      const ya = Y(hw + 15), yz = Y(hw); if (yz < 0 || ya > 1080) continue;
      const cov = Math.round((0.04 + 0.2 * Math.exp(-Math.max(0, hw - 130) / 90)) * 100) / 100;
      ctx.fillStyle = dots(ctx, cov, TEAL_RGB, 0.4); ctx.fillRect(0, Math.max(0, ya), W, Math.min(1080, yz) - Math.max(0, ya));
    }
    ctx.restore();
  }
  // the lamp's pool on the base wall (fence plane), hard-edged, coming down from the upper right: her shadow is inside it
  const POOL = [[-150, WALL], [190, WALL], [275, 0], [-95, 0]];
  function frame(t) {
    const cam = camAt(t), s = W / cam.wf, yb = cam.yb, yt = yb + cam.wf * 0.5625;
    const X = x => 960 + x * s, Y = y => 1080 - (y - yb) * s;
    const night = nightAt(t), xl = -cam.wf / 2 - 20, xr = cam.wf / 2 + 20;
    const RINi = rinAtT(t);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    // the sky (seen above the rail and through every gap): dusk = paper under a light teal screen; k282-k284 it falls to night
    if (night < 1) { g.fillStyle = PAPER; g.fillRect(0, 0, W, 1080); g.fillStyle = dots(g, 0.3); g.fillRect(0, 0, W, 1080); }
    if (night > 0) nightSky(g, Y, Math.min(100, yb - 10), yt + 10, night);
    // the far street, seen through the empty strip of net between the wall and the first row (night only: it shows only on the
    // way down): low rooftops darker than the glow behind them, a few paper-white windows
    if (yb < 200) {
      for (const b of TOWN) {
        if (b.x + b.w < xl || b.x > xr) continue;
        g.beginPath(); g.moveTo(X(b.x), Y(100)); g.lineTo(X(b.x), Y(b.h)); if (b.roof) g.lineTo(X(b.x + b.w / 2), Y(b.h + b.roof)); g.lineTo(X(b.x + b.w), Y(b.h)); g.lineTo(X(b.x + b.w), Y(100)); g.closePath();
        g.fillStyle = GRAPHITE_FIELD; g.fill();
        for (const [lx, ly] of b.lights) { g.fillStyle = PAPER; g.fillRect(X(lx), Y(ly + 1.2), Math.max(2, 1.2 * s), Math.max(2, 1.2 * s)); }
      }
    }
    // the base wall (fence plane, 0-1.1 m) at night: dark concrete, nearly as dark as the sky; the lamp (out of frame right) lights
    // a pool behind and right of her one step lighter, hard-edged, a second, smaller step close to the light; her shadow falls in it
    // to the left. Below, the strip of ground before the planter, dark, the lamp's pool on it a step lighter
    if (yb < WALL) {
      const top = Y(WALL), foot = Y(0);
      const poolPath = (ctx, sc = 1) => { ctx.beginPath(); POOL.forEach(([px, py], i) => { const xx = px * sc + (1 - sc) * 60; i ? ctx.lineTo(X(xx), Y(py)) : ctx.moveTo(X(xx), Y(py)); }); ctx.closePath(); };
      g.save(); g.beginPath(); g.rect(0, top, W, 1080 - top); g.clip();
      g.fillStyle = rgb(mixRGB(GRAPHITE_FIELD_RGB(), TEAL_RGB, 0.1)); g.fillRect(0, top, W, foot - top);
      g.fillStyle = dots(g, 0.08, TEAL_RGB, 0.5); g.fillRect(0, top, W, foot - top);
      poolPath(g); g.fillStyle = rgb(NIGHT_RGB); g.fill(); g.fillStyle = dots(g, 0.2, TEAL_RGB, 0.6); g.fill();
      poolPath(g, 0.55); g.fillStyle = rgb(mixRGB(NIGHT_RGB, NIGHT_MID_RGB, 0.5)); g.fill(); g.fillStyle = dots(g, 0.16, PAPER_RGB, 0.35); g.fill();
      if (RINi) {                                                  // her shadow on the wall, only where the lamp reaches
        const sx = -92, sy = -10, [a0, b0] = rinAt(0, 0), [a1, b1] = rinAt(RINi.width, RINi.height);
        SG.setTransform(1, 0, 0, 1, 0, 0); SG.globalCompositeOperation = 'source-over'; SG.clearRect(0, 0, W, 1080);
        SG.drawImage(RINi, X(a0 + sx), Y(b0 + sy), (a1 - a0) * s, (b0 - b1) * s);
        SG.globalCompositeOperation = 'source-in'; SG.fillStyle = rgb(mixRGB(GRAPHITE_FIELD_RGB(), TEAL_RGB, 0.12)); SG.fillRect(0, 0, W, 1080);
        g.save(); poolPath(g); g.clip(); g.beginPath(); g.rect(0, top, W, foot - top); g.clip(); g.drawImage(SC, 0, 0); g.restore();
      }
      // coping (its top edge catches the lamp: a paper-white line over the pool), joints, rain streaks
      g.fillStyle = rgb(NIGHT_RGB); g.fillRect(0, top, W, 6 * s);
      const cg = g.createLinearGradient(X(-260), 0, X(380), 0); cg.addColorStop(0, rgba(PAPER_RGB, 0)); cg.addColorStop(0.35, rgba(PAPER_RGB, 0.85)); cg.addColorStop(1, rgba(PAPER_RGB, 0.95));
      g.fillStyle = cg; g.fillRect(X(-260), top, X(xr) - X(-260), Math.max(1.5, 0.8 * s));
      g.strokeStyle = rgba(TEAL_RGB, 0.3); g.lineWidth = Math.max(1, 0.35 * s); g.beginPath(); g.moveTo(0, top + 6 * s); g.lineTo(W, top + 6 * s);
      for (let x = -3000; x < 3000; x += 300) { if (x < xl || x > xr) continue; g.moveTo(X(x), top + 6 * s); g.lineTo(X(x), foot); }
      g.stroke();
      const RS = rng(9400); g.strokeStyle = rgba(DARK_RGB, 0.5);
      for (let i = 0; i < 90; i++) { const x = -1500 + RS() * 3000, l = 10 + RS() * 40; if (x < xl || x > xr) continue; g.lineWidth = Math.max(1, (0.3 + RS() * 0.5) * s); g.beginPath(); g.moveTo(X(x), top + 6 * s); g.lineTo(X(x + (RS() - 0.5) * 2), top + (6 + l) * s); g.stroke(); }
      // the ground
      g.fillStyle = rgb(mixRGB(GRAPHITE_FIELD_RGB(), TEAL_RGB, 0.12)); g.fillRect(0, foot, W, 1080 - foot);
      g.beginPath(); g.moveTo(X(-100), foot); g.lineTo(X(300), foot); g.lineTo(X(420), 1080); g.lineTo(X(-180), 1080); g.closePath();
      g.fillStyle = rgb(NIGHT_RGB); g.fill(); g.fillStyle = dots(g, 0.3, TEAL_RGB, 0.8); g.fill();
      g.fillStyle = rgb(GRAPHITE_FIELD_RGB()); g.fillRect(0, foot, W, Math.max(2, 1.2 * s));
      g.restore();
    }

    // ---- the fence layer (posts, rail, mesh, cards) ----
    // by day the galvanised steel is paper white on the lit side and screened on the other; at night only the lamp lights it:
    // a paper-white line down the right edge of each post and along the rail, strong near the lamp, fading out to the left
    FG.setTransform(1, 0, 0, 1, 0, 0); FG.globalCompositeOperation = 'source-over'; FG.clearRect(0, 0, W, 1080);
    const day = 1 - night;
    for (const px of POSTS) {
      if (px < xl - 10 || px > xr + 10) continue;
      const x0 = X(px - 3), w6 = 6 * s, y0 = Y(TOPBAR), hh = Y(WALL) - Y(TOPBAR);
      if (day > 0) {
        FG.globalAlpha = day; FG.fillStyle = PAPER; FG.fillRect(x0, y0, w6, hh);
        FG.fillStyle = dots(FG, 0.5); FG.fillRect(x0, y0, 3 * s, hh);
        FG.strokeStyle = rgba(TEAL_RGB, 0.85); FG.lineWidth = Math.max(1, 0.5 * s); FG.strokeRect(x0, y0, w6, hh);
      }
      if (night > 0) {
        FG.globalAlpha = night; FG.fillStyle = rgb(NIGHT_RGB); FG.fillRect(x0, y0, w6, hh);
        FG.fillStyle = rgba(PAPER_RGB, 0.12 + 0.8 * lampI(px, 200)); FG.fillRect(x0 + 4 * s, y0, Math.max(1.5, 2 * s), hh);
      }
      FG.globalAlpha = 1;
    }
    if (yt > TOPBAR - 5) {
      const ry = Y(TOPBAR + 2.4), rh = 4.8 * s;
      if (day > 0) {
        FG.globalAlpha = day; FG.fillStyle = PAPER; FG.fillRect(0, ry, W, rh);
        FG.fillStyle = dots(FG, 0.5); FG.fillRect(0, Y(TOPBAR), W, 2.4 * s);
        FG.strokeStyle = rgba(TEAL_RGB, 0.85); FG.lineWidth = Math.max(1, 0.5 * s); FG.strokeRect(-5, ry, W + 10, rh);
      }
      if (night > 0) {
        FG.globalAlpha = night; FG.fillStyle = rgb(NIGHT_RGB); FG.fillRect(0, ry, W, rh);
        const rg = FG.createLinearGradient(0, 0, W, 0); rg.addColorStop(0, rgba(PAPER_RGB, 0.25 + 0.75 * lampI(xl, TOPBAR))); rg.addColorStop(1, rgba(PAPER_RGB, 0.25 + 0.75 * lampI(xr, TOPBAR)));
        FG.fillStyle = rg; FG.fillRect(0, ry, W, Math.max(1.5, 1.3 * s));
      }
      FG.globalAlpha = 1;
    }
    // the chain-link mesh (5 cm diamonds), from the wall to the rail; where its diamonds get under ~8 px on screen it fades into an
    // even tone (no moire). By day dark wire against the paper sky; at night the wire is lit only by the lamp: paper-white lines,
    // bright near it and in the pool around her, gone in the far left
    const pitch = 7.07 * s, wireA = smooth((pitch - 6) / 8);
    MG.setTransform(1, 0, 0, 1, 0, 0); MG.globalCompositeOperation = 'source-over'; MG.clearRect(0, 0, W, 1080);
    const my0 = Math.max(WALL, yb - 10), my1 = Math.min(TOPBAR, yt + 10);
    const wires = (ctx, D = 7.07) => {
      ctx.beginPath();
      for (let k = Math.floor((xl - my1) / D) - 1; k * D < xr - my0 + D; k++) { const x0 = k * D; ctx.moveTo(X(x0 + my0), Y(my0)); ctx.lineTo(X(x0 + my1), Y(my1)); }
      for (let k = Math.floor((xl + my0) / D) - 1; k * D < xr + my1 + D; k++) { const x0 = k * D; ctx.moveTo(X(x0 - my0), Y(my0)); ctx.lineTo(X(x0 - my1), Y(my1)); }
      ctx.stroke();
    };
    if (my1 > my0) {
      MG.save(); MG.beginPath(); MG.rect(0, Y(my1), W, Y(my0) - Y(my1)); MG.clip();
      if (wireA > 0.01 && day > 0) { MG.strokeStyle = rgba(INK_RGB, 0.42 * wireA * day); MG.lineWidth = Math.max(0.7, 0.35 * s); wires(MG); }
      if (wireA < 0.99 && day > 0) { MG.fillStyle = rgba(INK_RGB, 0.12 * (1 - wireA) * day); MG.fillRect(0, 0, W, 1080); }
      MG.restore();
      if (night > 0 && wireA > 0.01) {
        NG.setTransform(1, 0, 0, 1, 0, 0); NG.globalCompositeOperation = 'source-over'; NG.clearRect(0, 0, W, 1080);
        NG.save(); NG.beginPath(); NG.rect(0, Y(my1), W, Y(my0) - Y(my1)); NG.clip();
        NG.strokeStyle = PAPER; NG.lineWidth = Math.max(0.8, 0.3 * s); wires(NG); NG.restore();
        // the lamp's reach (radial, from out of frame right) and the pool around her
        NG.globalCompositeOperation = 'destination-in';
        const lr = NG.createRadialGradient(X(LAMP.x), Y(LAMP.y), 0, X(LAMP.x), Y(LAMP.y), 1250 * s);
        lr.addColorStop(0, 'rgba(0,0,0,0.95)'); lr.addColorStop(0.45, 'rgba(0,0,0,0.6)'); lr.addColorStop(0.8, 'rgba(0,0,0,0.12)'); lr.addColorStop(1, 'rgba(0,0,0,0.04)');
        NG.fillStyle = lr; NG.fillRect(0, 0, W, 1080);
        // and the net right behind her, in the same lamp's light as she is (the light around her): stronger wire there
        if (yb < 175) {
          NG.globalCompositeOperation = 'source-over'; NG.save(); NG.beginPath(); NG.rect(0, Y(Y1 - 1), W, Y(WALL) - Y(Y1 - 1)); NG.clip();
          const hr = NG.createRadialGradient(X(70), Y(125), 0, X(70), Y(125), 260 * s);
          hr.addColorStop(0, rgba(PAPER_RGB, 0.75)); hr.addColorStop(0.6, rgba(PAPER_RGB, 0.3)); hr.addColorStop(1, rgba(PAPER_RGB, 0));
          NG.strokeStyle = hr; NG.lineWidth = Math.max(0.8, 0.3 * s); wires(NG); NG.restore();
        }
        // behind the cards the wire shows only in the gaps: keep it low there, so the gaps do not light up into a grid
        NG.globalCompositeOperation = 'destination-out'; NG.fillStyle = 'rgba(0,0,0,0.65)'; NG.fillRect(0, Y(TOPBAR), W, Y(Y1 - 1) - Y(TOPBAR));
        MG.globalAlpha = night * wireA; MG.drawImage(NC, 0, 0); MG.globalAlpha = 1;
      }
    }
    FG.drawImage(MC, 0, 0);

    // the cards: visible range only
    const cmin = Math.floor((xl - CW) / PX), cmax = Math.ceil((xr + CW) / PX);
    const rmin = Math.max(1, Math.floor((yb - Y1 - CH) / PY) + 1), rmax = Math.min(ROWS, Math.ceil((yt - Y1) / PY) + 1);
    const cw = CW * s, ch = CH * s, lvl = levelOf(cw);
    const vis = [];
    for (let r = rmin; r <= rmax; r++) for (let c = Math.max(C0, cmin); c <= Math.min(C1, cmax); c++) {
      // th: the flip; swing: the gust / the k292 shiver, only for a card that has finished its flip (a hung back swinging)
      const cd = cardAt(r, c), settled = cd.t < t && (t - cd.t) * FPS > 14, sw = settled ? gust(cd, t) + lightTurn(cd, t) + kickTurn(cd, t) : 0;
      vis.push([cd, settled ? Math.PI : flipAngle(t - cd.t), sw]);
    }
    // their shadows on the wire (light from the upper right, the cards 1.5 cm in front of the mesh)
    if (cw > 12 && wireA > 0.05) {
      SG.setTransform(1, 0, 0, 1, 0, 0); SG.globalCompositeOperation = 'source-over'; SG.clearRect(0, 0, W, 1080); SG.fillStyle = '#000';
      for (const [cd, th, sw] of vis) { const wv = cw * Math.abs(Math.cos(th)) * Math.cos(sw); SG.fillRect(X(cd.x - 1.6) - wv / 2, Y(cd.y + CH - 1.1), wv, ch); }
      SG.globalCompositeOperation = 'destination-in'; SG.drawImage(MC, 0, 0);
      FG.globalAlpha = 0.75; FG.drawImage(SC, 0, 0); FG.globalAlpha = 1;
    }
    // the cords: teal, from the clip slot up round a wire (seen only when the cards are big enough); unlit at night
    if (cw > 9) {
      FG.strokeStyle = rgb(mixRGB(TEAL_RGB, NIGHT_RGB, 0.9 * night)); FG.lineWidth = Math.max(0.8, 0.32 * s); FG.lineCap = 'round';
      FG.beginPath();
      for (const [cd] of vis) { const x0 = X(cd.x), yt0 = Y(cd.y + CH - 0.4), yw = Y(cd.y + CH + 2.1); FG.moveTo(x0 - 0.5 * s, yt0); FG.lineTo(x0 - 0.35 * s, yw); FG.lineTo(x0 + 0.35 * s, yw - 0.5 * s); FG.lineTo(x0 + 0.5 * s, yt0); }
      FG.stroke();
    }
    const veil = Math.min(0.5, Math.max(0, (170 - cw) / 220));
    // At night the backs' paper rim (backTex) would fall to the same dark as the gaps beside it, and a blackened back would read as a
    // black block (docs/卡面状态.md 第四节). So the rim stays one step lighter than the gaps everywhere (RIM_FLOOR), and the lamp (out
    // of frame right) lifts it a further step where it reaches, fading out to the left. Drawn with every back (hung, swinging,
    // flipping: the swing narrows the rim with the card), so a card never loses or gains its rim when it starts to move.
    const RIM_FLOOR = 0.08, RIM_LAMP = 0.22, RIM_M = Math.max(0.8, HER_BACK.margin * cw);
    const backDraw = (cd, x, y, w, h) => {
      if (night < 1) FG.drawImage(cd.back[lvl], x, y, w, h);
      if (night > 0) {
        FG.globalAlpha = night; FG.drawImage(nightMips(cd.back)[lvl], x, y, w, h); FG.globalAlpha = 1;
        const la = night * (RIM_FLOOR + RIM_LAMP * lampI(cd.x, cd.y)), mx = RIM_M * w / cw, my = RIM_M;
        if (w > 2 * mx + 0.5) {
          FG.fillStyle = rgba(PAPER_RGB, la); FG.beginPath();
          FG.roundRect(x, y, w, h, 0.03 * cw); FG.roundRect(x + mx, y + my, w - 2 * mx, h - 2 * my, 0.012 * cw); FG.fill('evenodd');
        }
      }
    };
    const EDGE = Math.max(1.4, 0.12 * s);                           // a card's paper edge on screen (drawn heavier than 0.4 mm)
    const glints = [];
    FG.imageSmoothingEnabled = true; FG.imageSmoothingQuality = cw > 40 ? 'high' : 'medium';
    for (const [cd, th, sw] of vis) {
      const x0 = X(cd.x), y0 = Y(cd.y + CH);
      if (sw !== 0) {
        // a hung back swinging about its cord: narrower by cos, the edge that comes forward shows its paper thickness
        const wv = cw * Math.cos(sw), xa = x0 - wv / 2, sn = Math.sin(sw), L = lampI(cd.x, cd.y);
        backDraw(cd, xa, y0, wv, ch);
        if (sw > 0) {
          FG.fillStyle = rgb(NIGHT_RGB); FG.fillRect(xa - EDGE * sn, y0, EDGE * sn + 0.5, ch);       // left edge, facing away
          // the glint: a narrow slanted band of paper white that crosses the graphite as the card turns through the lamp's angle
          // each card meets the lamp's angle at its own turn (its warp), so neighbours glint at different moments and places
          const ths = (22 + 13 * hash(cd.c + 31, cd.r)) * DEG, gI = Math.exp(-(((sw - ths) / (7 * DEG)) ** 2)) * (0.55 + 0.45 * L);
          if (gI > 0.04) glints.push([cd, xa, y0, wv, ch, Math.max(0, Math.min(1, (sw - ths + 12 * DEG) / (24 * DEG))), gI]);
        } else {
          FG.fillStyle = rgba(DARK_RGB, Math.min(0.4, -sw / (40 * DEG) * 0.4)); FG.fillRect(xa, y0, wv, ch);
          FG.fillStyle = rgba(PAPER_RGB, Math.min(1, -sn * 3) * (0.45 + 0.55 * L)); FG.fillRect(xa + wv - 0.5, y0, EDGE * -sn + 0.5, ch);   // right edge lit
        }
        continue;
      }
      const c = Math.cos(th), sn = Math.sin(th), wv = cw * Math.abs(c);
      if (wv > 0.25) {
        if (c >= 0) {
          FG.drawImage(cd.front[lvl], x0 - wv / 2, y0, wv, ch);
          // far off, the fronts' print fades towards the paper (the white reads as one white, not as a table of small print)
          if (veil > 0) { FG.fillStyle = rgba(PAPER_RGB, veil); FG.fillRect(x0 - wv / 2, y0, wv, ch); }
        } else {
          backDraw(cd, x0 - wv / 2, y0, wv, ch);
        }
      }
      // the paper edge of a flipping card (drawn a little heavier than 0.4 mm so it reads): on the left, the edge that came forward
      const ew = Math.abs(sn) * Math.max(1.5, 0.08 * s);
      if (Math.abs(sn) > 0.04 && cw > 6) {
        const xe = x0 - wv / 2 - ew;
        FG.fillStyle = PAPER_CARD; FG.fillRect(xe, y0, ew + 0.5, ch);
        FG.fillStyle = rgba(TEAL_RGB, 0.55); FG.fillRect(xe, y0, Math.max(0.6, ew * 0.25), ch);
      }
    }
    // the glints: a slanted band (the direction of most of the strokes), its position across the card set by the turn, a paper
    // white core in a narrow silver flank. Only a sliver of the card, so the wall around it stays black
    // (the band's brightness comes from the card's own graphite, see litMips; three nested bands give it a soft edge)
    for (const [cd, x, y, w, h, u, gI] of glints) {
      const hv = hash(cd.r + 13, cd.c + 17), cx = x + w * (-0.2 + 1.4 * u), sl = h * (0.12 + 0.36 * hv), bw = Math.max(1.5, w * (0.05 + 0.1 * hash(cd.c + 2, cd.r + 29))), tex = litMips(cd.back)[lvl];
      for (const [k, a] of [[2.4, 0.35], [1.5, 0.45], [0.8, 0.6]]) {
        FG.save(); FG.beginPath(); FG.moveTo(cx - bw * k + sl, y); FG.lineTo(cx + bw * k + sl, y); FG.lineTo(cx + bw * k - sl, y + h); FG.lineTo(cx - bw * k - sl, y + h); FG.closePath(); FG.clip();
        FG.globalAlpha = a * gI; FG.drawImage(tex, x, y, w, h); FG.restore();
      }
      FG.globalAlpha = 1;
    }
    g.drawImage(FC, 0, 0);
    const fl = FLASH80(t);
    if (fl > 0) { g.fillStyle = rgba(INK_RGB, fl); g.fillRect(0, 0, W, 1080); }
    // the ending's 2D layers: her (with the strings ringing on the beats), the amp and its lead, the planter in front
    if (yb < 175 && RINi) {
      const PL = rinPlace(X, Y, s), path = pathOf(RINi);
      drawImageAt(g, PL, RINi);
      const kb = STRUMS.map(K).filter(tb => t >= tb).pop();
      if (kb !== undefined) {
        const tau = t - kb, amp = (kb === K(292) ? 1.6 : 1) * 1.2 * Math.max(1, 0.25 * s) * Math.exp(-tau / (2.2 * FRAME)) * (tau < 9 * FRAME ? 1 : 0);
        if (amp > 0.25) {
          // a band round each measured string, as wide as its swing (largest halfway between the tailpiece end and the finger),
          // drawn in the drawing's own px through the drawing's placement
          drawPart(g, PL, (c, px) => {
            c.fillStyle = rgba(PAPER_RGB, 0.45); const NS = 30;
            for (const [p0, p1, p2] of STRINGS[path]) {
              const L1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), L2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), LT = L1 + L2;
              const dx = (p2[0] - p0[0]) / Math.hypot(p2[0] - p0[0], p2[1] - p0[1]), dy = (p2[1] - p0[1]) / Math.hypot(p2[0] - p0[0], p2[1] - p0[1]), nx = -dy, ny = dx;
              const side = [], back = [];
              for (let j = 0; j <= NS; j++) {
                const d = LT * j / NS, [qa, qb, f] = d <= L1 ? [p0, p1, d / L1] : [p1, p2, (d - L1) / L2];
                const x = lerp(qa[0], qb[0], f), y = lerp(qa[1], qb[1], f), w = px(amp) * Math.sin(Math.PI * j / NS);
                side.push([x + nx * w, y + ny * w]); back.push([x - nx * w, y - ny * w]);
              }
              c.beginPath(); side.forEach(([x, y]) => c.lineTo(x, y)); back.reverse().forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); c.fill();
            }
          });
        }
      }
      drawAmp(X, Y, s);
      // the lead: from the guitar's output jack (measured on each drawing: the lower edge of the body under the knobs) down
      // behind the planter, and from the amp
      const [jx, jy] = PL.toWorld(partOf(PA, DNAME[path], 'jack').point), [ajx, ajy] = eq(AMP.x0 + 8, AMP.y0 + 14, RIN_D);
      g.strokeStyle = GRAPHITE; g.lineWidth = Math.max(1.2, 0.9 * s);
      g.beginPath(); g.moveTo(jx, jy); g.bezierCurveTo(jx - 6 * s, jy + 25 * s, jx + 8 * s, Y(PLANT_TOP + 12), jx + 16 * s, Y(PLANT_TOP - 8)); g.stroke();
      g.beginPath(); g.moveTo(X(ajx), Y(ajy)); g.bezierCurveTo(X(ajx - 10), Y(ajy - 6), X(ajx - 12), Y(PLANT_TOP + 6), X(ajx - 16), Y(PLANT_TOP - 8)); g.stroke();
      drawPlanter(X, Y, s, xl, xr);
    }
    return cam;
  }
  // the practice amp on its crate (2D, 22 m), lit from the right: a dark cabinet, a teal-screened grille, a control strip with
  // knobs and a pilot light along the top, a handle; its right edge one step lighter
  function drawAmp(X, Y, s) {
    const box = (o, y0, y1) => { const [x0, yy1] = eq(o.x0, y1, RIN_D), [x1, yy0] = eq(o.x1, y0, RIN_D); return [X(x0), Y(yy1), (x1 - x0) * s, (yy1 - yy0) * s]; };
    const [cx, cy, cwd, chh] = box(CRATE, CRATE.y0, CRATE.y1);
    g.fillStyle = rgb(mixRGB(DARK_RGB, TEAL_RGB, 0.25)); g.fillRect(cx, cy, cwd, chh);
    g.fillStyle = rgb(DARK_RGB); for (let i = 1; i < 4; i++) g.fillRect(cx + cwd * i / 4 - 1.2 * s, cy + chh * 0.22, 2.4 * s, chh * 0.6);
    const [ax, ay, aw, ah] = box(AMP, AMP.y0, AMP.y1), k = s * FENCE_D / RIN_D;
    g.fillStyle = GRAPHITE; g.fillRect(ax, ay, aw, ah);
    g.fillStyle = rgb(mixRGB(INK_RGB, TEAL_RGB, 0.35)); g.fillRect(ax + aw - 3.2 * k, ay, 3.2 * k, ah);       // the lit side
    // grille
    const gx = ax + 4 * k, gy = ay + 12 * k, gw = aw - 8 * k, gh = ah - 16 * k;
    g.fillStyle = GRAPHITE_FIELD; g.fillRect(gx, gy, gw, gh); g.fillStyle = dots(g, 0.38, TEAL_RGB, 0.85); g.fillRect(gx, gy, gw, gh);
    g.strokeStyle = rgba(PAPER_RGB, 0.5); g.lineWidth = Math.max(1, 0.5 * k); g.strokeRect(gx, gy, gw, gh);
    // control strip
    g.fillStyle = rgb(mixRGB(INK_RGB, PAPER_RGB, 0.25)); g.fillRect(ax + 3 * k, ay + 3 * k, aw - 6 * k, 6 * k);
    g.fillStyle = rgb(DARK_RGB); for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(ax + (9 + i * 7) * k, ay + 6 * k, 1.5 * k, 0, 7); g.fill(); }
    g.fillStyle = PAPER; g.beginPath(); g.arc(ax + aw - 8 * k, ay + 6 * k, 1.1 * k, 0, 7); g.fill();
    // handle
    g.strokeStyle = GRAPHITE; g.lineWidth = Math.max(1.5, 1.4 * k); g.beginPath(); g.moveTo(ax + aw * 0.32, ay); g.quadraticCurveTo(ax + aw / 2, ay - 4.5 * k, ax + aw * 0.68, ay); g.stroke();
    g.strokeStyle = TEAL; g.lineWidth = Math.max(1, 0.5 * k); g.strokeRect(ax, ay, aw, ah);
  }
  // the planter: a low concrete edge, its top face a thin strip lit from the right, the trimmed shrubs flush with it
  function drawPlanter(X, Y, s, xl, xr) {
    const top = Y(PLANT_TOP), k = s * FENCE_D / PLANT_D;
    g.fillStyle = GRAPHITE_FIELD; g.fillRect(0, top, W, 1080 - top); g.fillStyle = dots(g, 0.14); g.fillRect(0, top, W, 1080 - top);
    // the lamp's light on the planter's top edge, stronger to the right
    const grd = g.createLinearGradient(0, 0, W, 0); grd.addColorStop(0, rgba(mixRGB(PAPER_RGB, TEAL_RGB, 0.45), 0.18)); grd.addColorStop(1, rgba(mixRGB(PAPER_RGB, TEAL_RGB, 0.45), 0.7));
    g.fillStyle = grd; g.fillRect(0, top + 1.2 * k, W, Math.max(2, 1.4 * k));
    g.fillStyle = rgb(DARK_RGB); const RB = rng(9500); g.beginPath(); g.moveTo(0, top + 1.2 * k);
    for (let x = xl; x <= xr + 10; x += 7) g.lineTo(X(x), top - (0.6 + RB() * 1.8) * k);
    g.lineTo(W, top + 1.2 * k); g.closePath(); g.fill();
    g.fillStyle = dots(g, 0.2, TEAL_RGB, 0.7); g.fill();
    // a joint every 2 m on the face
    g.strokeStyle = rgba(TEAL_RGB, 0.35); g.lineWidth = Math.max(1, 0.4 * k); g.beginPath();
    for (let x = -2000; x <= 2000; x += 200) { const xx = x * FENCE_D / PLANT_D; if (xx < xl || xx > xr) continue; g.moveTo(X(xx), top + 3 * k); g.lineTo(X(xx), 1080); }
    g.stroke();
  }

  // ---------------- the score ----------------
  const STRUMS = [289, 290, 291, 292];                             // the heavy kicks and the chord; k293-k294 (her arm up, no kick) nothing rings
  S.hold('shot', '09 one shot (the fence)', K(264), K(295), { kind: 'shot' });
  S.hold('rin', 'R09-play (lit by the lamp)', K(DOWN0), K(292), { kind: 'key', file: ART });
  S.hold('rin', 'R09-strike (the big strum, head up)', K(292), K(295), { kind: 'key', file: ART2 });
  S.ev('flip A', K(265)); S.ev('flip B', K(266)); S.ev('flip C', K(267));
  S.ev('row 1 zips out from B and C', K(268));
  const rowsAt = {}; for (const [r, k] of Object.entries(ROW_START)) if (+r > 1) (rowsAt[k] = rowsAt[k] || []).push(+r);
  for (const [k, rs] of Object.entries(rowsAt)) S.mark(`the peak reaches row${rs.length > 1 ? 's' : ''} ${rs.join(',')}`, K(+k));
  for (let k = 269; k <= 283; k++) S.mark(`the mountain surges k${k}`, K(k));
  S.mark('the zoom slows (lowest hit)', K(280));
  S.mark('the top rail and the sky come in, it starts to darken', K(282));
  S.ev('the wedges flip: all black; night (sky, gaps, unlit paper)', K(284));
  S.ev('a gust from the right (the cards swing and glint)', K(285)); S.mark('gust off the left edge', K(287));
  S.mark('the frame lands on her (low hit)', K(DOWN1));
  for (const k of STRUMS) S.mark(`strum: the strings ring k${k}`, K(k));
  S.ev('her strum: a shiver of glints climbs the wall from above her', K(292)); S.mark('the shiver reaches the top of the frame', K(293));
  S.mark('cut to 10', K(295));

  // ---------------- checks ----------------
  const views = frameTimes(T0, T0, T1);
  // she must not be in frame before the move down (her bow's top against the frame's bottom edge, both on the fence plane)
  const herEarly = views.filter(t => t < K(DOWN0)).filter(t => camAt(t).yb <= RIN_TOP + 0.5).map(t => +t.toFixed(3));
  // the mountain: the peak (top started row, centre) and the half base as fractions of the frame, once a beat; the peak must stay
  // inside the frame and move on screen
  const peak = [];
  for (let k = 268; k <= 284; k++) {
    const t = K(k) + 3 * FRAME, cam = camAt(t); let top = 0;
    for (let r = ROWS; r >= 1; r--) if (ROW_START[r] !== undefined && K(ROW_START[r]) <= t) { top = rowBottom(r) + CH; break; }
    peak.push({ k, wf: +cam.wf.toFixed(1), peakFrac: +((top - Y1) / (cam.wf * 0.5625)).toFixed(3), baseFrac: +(PB(t)[1] / (cam.wf / 2)).toFixed(3) });
  }
  const peakOut = peak.filter(p => p.peakFrac > 1);
  const cardPx = [264, 270, 276, 280, 284, 289].map(k => ({ k, px: +(CW * W / camAt(K(k) + FRAME).wf).toFixed(1) }));
  // her card on screen, every frame she is in (docs/卡面状態.md 第四节: the phone check reads this), screen px at 1920 x 1080
  const herCardScreen = views.filter(t => camAt(t).yb < 175).map(t => {
    const cam = camAt(t), s = W / cam.wf, path = rinAtT(t) === RIN2 ? ART2 : ART, Q = cardScreenBox[path];
    if (!Q) return { g: Math.round(t * FPS), drawing: path, inFrame: false };
    const pts = Q.map(([px, py]) => { const [fx, fy] = rinAt(px, py); return [960 + fx * s, 1080 - (fy - cam.yb) * s]; });
    const x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
    return { g: Math.round(t * FPS), drawing: path.split('/').pop(), inFrame: x1 > 0 && x0 < W && y1 > 0 && y0 < 1080, whole: x0 >= 0 && x1 <= W && y0 >= 0 && y1 <= 1080,
      box: [+x0.toFixed(1), +y0.toFixed(1), +(x1 - x0).toFixed(1), +(y1 - y0).toFixed(1)] };
  });
  const hcw = herCardScreen.filter(r => r.inFrame).map(r => r.box[2]);
  // MOTION AUDIT (camera.js, docs/制作约定.md 第六节「整屏运动」): every rendered frame's view. The camera has no roll and no
  // shake; world y is flipped (the fence's y runs up), which leaves every corner displacement's size unchanged
  const motionViews = views.map(t => { const c = camAt(t), z = W / c.wf; return { t, z, fx: 0, fy: -(c.yb + c.wf * 0.5625 / 2) }; });
  const MOTION_R = motionAudit('seg_09', motionViews, { big: [[K(265), 'crash k265, card A flips (段落交界的镲)'], [K(292), 'her big chord k292 (画面中心的击打)']],
    whips: [[T_WHIP0, 'move down to her, lands on k289']] });
  const PARTS_R = partReport('seg_09');
  S.finish();
  publishAudit(S, LAY, { motion: MOTION_R, parts: PARTS_R, herCardScreen, herCard: { source: 'web/lib/her_card.js', state: 'title', holderQuads: Object.fromEntries(Object.entries(HOLDER).map(([k, v]) => [k.split('/').pop(), v.q])) }, missingDrawings: MISSING, herInFrameBeforeDown: herEarly, herBowTopFenceEq: +RIN_TOP.toFixed(1),
    mountainPeak: peak, peakOutOfFrame: peakOut, rowStart: ROW_START, cardPx, cards: CARDS.length });
  console.warn(`FRAME AUDIT seg_09: her bow top ${RIN_TOP.toFixed(1)} cm (fence eq.) under the frame's bottom edge 180 cm before k${DOWN0}: ${herEarly.length ? 'IN FRAME at ' + herEarly.slice(0, 5).join(',') : 'ok'}; mountain peak ${peakOut.length ? 'OUT OF FRAME at ' + peakOut.map(p => 'k' + p.k).join(',') : 'in frame'}; cards ${cardPx.map(c => `k${c.k} ${c.px}px`).join(' ')}; her card (her_card.js 'title') ${hcw.length ? `${Math.min(...hcw).toFixed(1)}-${Math.max(...hcw).toFixed(1)} px wide (${(Math.min(...hcw) * 390 / 1920).toFixed(1)}-${(Math.max(...hcw) * 390 / 1920).toFixed(1)} px on a 390 px phone)` : 'not in frame'}${MISSING.length ? '; MISSING ' + MISSING.join(',') : ''}`);
  // RHYTHM AUDIT: what answers each heavy hit of the riff now that the frame is still on most of them (the picture's hit, its
  // first frame: the first frame at or after the beat must already show it, the frame before must not)
  const hitRows = [['大击 step in (card A flips)', 265], ['flip B', 266], ['flip C', 267], ['row 1 zips out', 268]];
  for (let k = 269; k <= 283; k++) hitRows.push(['mountain surges', k]);
  hitRows.push(['band + flash', 280], ['night step', 282], ['night step', 283], ['wedges flip', 284], ['gust', 285], ['whip lands', DOWN1],
               ['strings ring + cards shiver', 290], ['strings ring + cards shiver', 291], ['大击 step in + light', 292]);
  const rhythm = hitRows.map(([what, k]) => { const g1 = Math.ceil(K(k) * FPS - 1e-9); return { what, k, g: g1 }; });
  window.__audit.rhythm = rhythm;
  console.warn(`RHYTHM AUDIT seg_09: ${rhythm.length} hits answered in the picture or by the frame (${rhythm.map(r => 'k' + r.k).join(' ')}); frame jolts only k265, k292 and the k289 whip`);
  console.warn(`PEAK seg_09: ${peak.map(p => `k${p.k} ${(p.peakFrac * 100).toFixed(0)}%/${(p.baseFrac * 100).toFixed(0)}%`).join(' ')}`);
  console.warn(`ROWS seg_09: ${Object.entries(ROW_START).map(([r, k]) => `r${r}@k${k}`).join(' ')}`);

  window.renderAt = async t => { frame(t); g.setTransform(1, 0, 0, 1, 0, 0); };
  await window.renderAt(P('t0', 104.0));
}
