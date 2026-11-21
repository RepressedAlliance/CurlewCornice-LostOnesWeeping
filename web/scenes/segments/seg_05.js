// Segment 05: the riff 「ノーフィクション」 (k104-k135, 38.833-50.333 s, global frames [1165, 1510)). docs/分镜/05_riff_ノーフィクション.md
// (third draft, design 乙: she faces the wall) and the review notes at the end of docs/全片分镜.md, finished after the blind review
// of the two samples (archive/seg05_sample_20261120/; the reviews' must-fix list is answered in docs/分镜/05_riff_ノーフィクション.md,
// 细做改定).
//
// The school's ranking board in the entrance hall: 45 x 32 landscape cards (9 x 6 cm, pitch 9.9 x 6.6 cm), each pinned by one
// pin at the middle of its top edge, so a card can only swing round its pin; nothing ever flips (flipping belongs to 09).
//   k104  S1 her back, full figure, close enough that the cards read as cards; the empty bag from 04 at her feet. Her first strum:
//         every card swings once, outwards from the point of the board in front of her, in rings that take 0.6 s to reach the
//         edges; a swinging card turns from the light and shows the black behind it. The only time the wall moves to her playing.
//   k108  S2 her pick hand over the gold top (the gold sounds for the first time): the strings vibrate on every beat.
//   k112  S3 the aim: body to us, the neck held level towards the board at the right edge, her head turned down the neck.
//   k116  S4 over her shoulder, the wall in front of her. k118 she leans into the shout (right elbow flung out); on each syllable
//         as actually sung (lyrics_timed.json line 5) the cards of one glyph are blown off their pins: a one-frame jolt forward,
//         then they spin away into the black with a smear, a torn corner left on every pin, the ring round the glyph kicked
//         outwards; the camera kicks in once, on the first (ノ), and stands. Eight blows in 0.64 s: ノーフィ / クション, 7 x 10 cards
//         a character (the small ィ, ョ 5 x 6). k124 she throws her head back and the neck up. Then the hole stands.
//   k128  S5 her face, the cold smirk into the camera (the only direct look of the segment).
//   k132  S6 the foot of 「ン」, close: empty pins with torn corners, crooked cards, one card torn down to a corner hanging on
//         its pin; k134.5 that corner swings once.
import { drawCard, CARD_RATIO } from '../../lib/card.js';
import { BEAT, FRAME, beatV, smooth, ease, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, frameTimes, pushes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, partAudit, samplesAlong, pixelsOf, PIX, partReport } from '../../lib/parts.js';
import { dots16, dots16Text, onsetFrameTime } from '../../lib/print.js';
import { loadLyrics, onsetFrame, lyricAudit } from '../../lib/lyrics.js';
import { PAPER, PAPER_RGB, PAPER_CARD, FIBRE_RGB, TEAL, TEAL_RGB, INK_RGB, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_DARK_RGB,
         PENCIL, PENCIL_FILL, ERASER_STREAK, rgba } from '../../lib/palette.js';

export default async function seg05(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 1165, F1 = 1510, FPS = 30, T0 = F0 / FPS, T1 = F1 / FPS;
  const S = createScore('seg_05', { t0: T0, t1: T1 });
  const LAY = createLayout();
  const K = beatV;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };
  const DEG = Math.PI / 180;
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  const PIN = rgba(GRAPHITE_DARK_RGB, 1);

  // ---------------- the sung syllables (never typed in: lyrics_timed.json line 5, from lyric_fixes.json) ----------------
  const LY = await loadLyrics();
  const SUNG = LY.lineAt(5, 'ノーフィクション');            // [[char, t], ...]
  const HIT = SUNG.map(([, t]) => t);
  // 2026-11-21 (director: “lyrics appear slightly behind the singing”; docs/制作约定.md 第六节): a syllable's letter must read on the frame its
  // onset falls in. The old blow started on the frame after the onset with a one-frame jolt, so a letter read 3-4 frames
  // late. Now each blow starts on the frame before the onset's frame (ONF: the onset's frame, TS: the blow's first frame) and
  // has opened the hole far enough to read on the onset's frame (blowE below).
  const ONF = HIT.map(t => onsetFrameTime(t)), TS = ONF.map(t => t - FRAME);

  // ---------------- the shots ----------------
  const SH = { s1: [T0, K(108)], s2: [K(108), K(112)], s3: [K(112), K(116)], s4: [K(116), K(128)], s5: [K(128), K(134)], s6: [K(134), T1] };
  // 2026-11-21 rhythm pass: S5 runs to k134 (k132-k133 still drum; the gap is k134-k135), S6 is the insert on the gap
  const shotAt = t => Object.keys(SH).find(k => t >= SH[k][0] && t < SH[k][1]) || 's6';

  // ---------------- the board ----------------
  const COLS = 45, ROWS = 32, PX = 9.9, PY = 6.6, CW = 9, CH = 6;     // cm
  const BW = COLS * PX, BH = ROWS * PY;
  // the glyphs: 7 x 10 cards a character (6 x 8 did not read on a phone: ク looked like ウ, ィ was a blot), strokes two cards
  // wide; the small kana 5 x 6 in the lower left of their cell; one column between characters, one row between the lines,
  // 7 columns free each side; line 1 from row 1, line 2 from row 12, 10 rows under it (work/seg/05/glyph: the readings)
  const GLYPH = {
    'ノ': ['.....##', '.....##', '....##.', '....##.', '...##..', '...##..', '..##...', '.##....', '##.....', '#......'],
    'ー': ['.......', '.......', '.......', '.......', '#######', '#######', '.......', '.......', '.......', '.......'],
    'フ': ['#######', '#######', '.....##', '.....##', '....##.', '....##.', '...##..', '..##...', '.##....', '##.....'],
    'ィ': ['...##', '..##.', '.####', '##.##', '...##', '...##'],
    'ク': ['..##...', '.######', '.##..##', '##...##', '#...##.', '....##.', '...##..', '..##...', '.##....', '##.....'],
    'シ': ['.......', '##....#', '.##...#', '.....##', '##...##', '.##.##.', '...##..', '..##...', '.##....', '##.....'],
    'ョ': ['#####', '....#', '.####', '....#', '....#', '#####'],
    'ン': ['##.....', '.##....', '..##...', '.......', '......#', '.....##', '....##.', '...##..', '.###...', '##.....'],
  };
  const GC = 7, GR = 10, L1 = 1, L2 = 12, GX0 = 7;
  const holeOf = new Map();                                   // 'c,r' -> syllable index
  const glyphCells = [];                                      // per syllable: [[c, r], ...]
  SUNG.forEach(([ch], i) => {
    const bm = GLYPH[ch]; if (!bm) throw new Error(`seg_05: no glyph for ${ch}`);
    const c0 = GX0 + (i % 4) * (GC + 1), r0 = (i < 4 ? L1 : L2) + (GR - bm.length);
    const cells = [];
    bm.forEach((row, r) => [...row].forEach((v, c) => { if (v === '#') { cells.push([c0 + c, r0 + r]); holeOf.set(`${c0 + c},${r0 + r}`, i); } }));
    glyphCells.push(cells);
  });
  const ZW = 4 * GC + 3;                                      // 31 columns
  const GLYPH_BOX = [[GX0 * PX, L1 * PY, ZW * PX, GR * PY], [GX0 * PX, L2 * PY, ZW * PX, GR * PY]];   // cm on the board

  // every card different: a name (no family name twice within any 7 x 6 patch, so the S6 close-up never repeats one), a rank
  // (1 at the top left), a block of filled bubbles
  const FAM = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
    '山崎', '森', '池田', '橋本', '阿部', '石川', '前田', '藤田', '小川', '岡田', '後藤', '長谷川', '村上', '近藤', '石井', '坂本', '遠藤', '青木', '藤井', '西村', '福田', '太田', '三浦', '藤原', '岡本', '松田', '中川', '中野', '原田', '小野'];
  const GIV = ['陽翔', '蓮', '湊', '樹', '大和', '悠真', '朝陽', '碧', '律', '颯', '陽向', '蒼', '大翔', '奏太', '健', '翔', '拓海', '直樹', '誠', '亮', '陽葵', '凛', '結菜', '芽依',
    '紬', '葵', '咲良', '美月', '結衣', '杏', '心春', '莉子', '花', '澪', '詩', 'ひなた', 'ゆい', 'さくら', '千尋', '美咲', '彩', '真央', '優花', '奈々', '遥', '茜', '楓', '栞', '舞', '瞳'];
  const R0 = rng(5051);
  const CARDS = [];
  const famAt = new Map(), givAt = new Map();
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const near = (M) => { const s = new Set(); for (let dr = -5; dr <= 0; dr++) for (let dc = -6; dc <= 6; dc++) { const v = M.get(`${c + dc},${r + dr}`); if (v !== undefined) s.add(v); } return s; };
    const pick = (list, M) => { const used = near(M); let k = Math.floor(R0() * list.length), n = 0; while (used.has(k) && n++ < list.length) k = (k + 1) % list.length; M.set(`${c},${r}`, k); return list[k]; };
    const fam = pick(FAM, famAt), giv = pick(GIV, givAt);
    CARDS.push({ c, r, rank: r * COLS + c + 1, name: `${fam} ${giv}`, fills: [0, 1, 2].map(() => Math.floor(R0() * 6)), seed: 100 + r * COLS + c, hole: holeOf.get(`${c},${r}`) ?? -1 });
  }
  const cardAt = (c, r) => CARDS[r * COLS + c];

  // one card of the board (u = its width in px): a small 個人読取カード laid out for its size on the board (about 40 x 27 px on
  // screen in S4): the name in pencil, the rank as one large 16-dot number, one block of bubbles, the timing marks
  function boardCard(x, u, cd, { hi = false } = {}) {
    const h = u / CARD_RATIO, R = rng(cd.seed);
    x.fillStyle = PAPER_CARD; rrect(x, 0, 0, u, h, u * 0.025); x.fill();
    if (hi) { for (let i = 0; i < 70; i++) { x.strokeStyle = rgba(FIBRE_RGB, +(0.05 + R() * 0.06).toFixed(3)); x.lineWidth = u * 0.0015; const a = R() * u, b = R() * h, l = u * (0.01 + R() * 0.03), th = R() * 7; x.beginPath(); x.moveTo(a, b); x.lineTo(a + Math.cos(th) * l, b + Math.sin(th) * l); x.stroke(); } }
    x.fillStyle = PIN;
    for (const [cx, cy] of [[0.03, 0.03], [0.93, 0.03], [0.03, 0.596], [0.93, 0.596]]) x.fillRect(u * cx, u * cy, u * 0.04, u * 0.04);
    const nx = u * 0.1, ny = u * 0.09, nw = u * 0.8, nh = u * 0.17;
    x.strokeStyle = TEAL; x.lineWidth = u * 0.012; rrect(x, nx, ny, nw, nh, u * 0.012); x.stroke();
    x.fillStyle = TEAL; x.fillRect(nx, ny, u * 0.11, nh);
    x.fillStyle = PAPER_CARD; x.font = `700 ${u * 0.05}px ZenKakuB`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('氏名', nx + u * 0.055, ny + nh / 2);
    x.fillStyle = PENCIL; x.font = `${u * 0.1}px Klee`; x.textAlign = 'left';
    x.save(); x.translate(nx + u * 0.15, ny + nh / 2 + u * 0.006); x.rotate((R() - 0.5) * 0.04); x.fillText(cd.name, 0, 0); x.restore();
    const rk = String(cd.rank), k = u * 0.0155, D = dots16(rk, k, 7 + (cd.seed % 5));
    const rw = Math.min(D.w, u * 0.4), rh = D.h * rw / D.w;
    x.drawImage(D.c, D.x0, D.y0, D.w, D.h, u * 0.07, u * 0.33 + (u * 0.22 - rh) / 2, rw, rh);
    x.fillStyle = TEAL; x.font = `700 ${u * 0.07}px ZenKakuB`; x.textAlign = 'left'; x.fillText('位', u * 0.08 + rw + u * 0.01, u * 0.49);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 6; j++) {
      const bx = u * (0.6 + j * 0.058), by = u * (0.355 + i * 0.075);
      if (cd.fills[i] === j) { x.fillStyle = PENCIL_FILL; x.beginPath(); x.ellipse(bx, by, u * 0.024, u * 0.017, -0.2, 0, 7); x.fill(); }
      else { x.strokeStyle = rgba(TEAL_RGB, 0.95); x.lineWidth = u * 0.006; x.beginPath(); x.ellipse(bx, by, u * 0.02, u * 0.014, 0, 0, 7); x.stroke(); }
    }
    x.fillStyle = PIN;
    for (let d = 0; d < 10; d++) x.fillRect(u * (0.2 + d * 0.068), u * 0.6, u * 0.014, u * 0.04);
  }
  function rrect(x, a, b, w, h, rr) { x.beginPath(); x.moveTo(a + rr, b); x.arcTo(a + w, b, a + w, b + h, rr); x.arcTo(a + w, b + h, a, b + h, rr); x.arcTo(a, b + h, a, b, rr); x.arcTo(a, b, a + w, b, rr); x.closePath(); }

  // the atlas: every card once at 100 px (S1 and S4 show them at 38-43 px)
  const AU = 100, AH = Math.round(AU / CARD_RATIO);
  const [ATLAS, ax] = mk(COLS * AU, ROWS * AH);
  for (const cd of CARDS) { ax.save(); ax.translate(cd.c * AU, cd.r * AH); boardCard(ax, AU, cd); ax.restore(); }
  // S6 shows the foot of 「ン」 close (cards about 300 px wide): those cards again at 520 px
  const S6R = { c0: 29, c1: 38, r0: 15, r1: 23 };
  const HIU = 520, HI = new Map();
  for (let r = S6R.r0; r <= S6R.r1; r++) for (let c = S6R.c0; c <= S6R.c1; c++) {
    const [cc, x] = mk(HIU, HIU / CARD_RATIO); boardCard(x, HIU, cardAt(c, r), { hi: true }); HI.set(`${c},${r}`, cc);
  }

  // ---------------- the cards' motion ----------------
  // S1: the one big swing, from the point of the board right in front of her head (centre column, about row 22). It travels:
  // the farthest cards start 0.6 s after the nearest, so it is seen spreading in rings; 26 degrees in front of her, 10 at the
  // edges (2026-11-21 rhythm pass: 20 / 6 read too small for the riff's first strum, work/rhythm_diag motion 4-5).
  const SW0 = K(104), ORIGIN = [BW / 2, 146], DMAX = Math.hypot(BW / 2, 181), SPREAD = 0.6, SWF = 2.5, SWTAU = 0.3, SWA = 26 * DEG, SWFALL = 170;
  function swingOf(cd, t) {
    const x = cd.c * PX + PX / 2, y = cd.r * PY + PY / 2, d = Math.hypot(x - ORIGIN[0], y - ORIGIN[1]);
    const tau = t - SW0 - (d / DMAX) * SPREAD; if (tau <= 0 || tau > 1.6) return 0;
    const side = x < ORIGIN[0] ? 1 : -1;                     // the bottom swings away from her first
    return side * SWA / (1 + d / SWFALL) * Math.sin(2 * Math.PI * SWF * tau) * Math.exp(-tau / SWTAU);
  }
  // S4: the ring round each glyph is kicked outwards (14 degrees, settled within 0.35 s); a few cards not beside a hole stay
  // a little crooked (never more than 3 degrees, so no card leans into a stroke)
  const KICK = new Map();                                     // 'c,r' -> [{t, sign, res}]
  glyphCells.forEach((cells, i) => {
    const cx = cells.reduce((a, [c]) => a + c, 0) / cells.length;
    const ring = new Set();
    for (const [c, r] of cells) for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) {
      const nc = c + dc, nr = r + dr; if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS || holeOf.has(`${nc},${nr}`)) continue; ring.add(`${nc},${nr}`);
    }
    const RK = rng(700 + i);
    for (const key of ring) {
      const [c, r] = key.split(',').map(Number), dx = c - cx;
      const sign = Math.abs(dx) < 0.6 ? (RK() < 0.5 ? -1 : 1) : (dx < 0 ? 1 : -1);
      const beside = holeOf.has(`${c - 1},${r}`) || holeOf.has(`${c + 1},${r}`);
      const res = !beside && RK() < 0.4 ? sign * (1.0 + RK() * 2.0) * DEG : 0;
      if (!KICK.has(key)) KICK.set(key, []);
      KICK.get(key).push({ t: TS[i], sign, res });
    }
  });
  function kickOf(cd, t) {
    const L = KICK.get(`${cd.c},${cd.r}`); if (!L) return 0;
    let a = 0;
    for (const k of L) { const tau = t - k.t; if (tau < 0) continue; a += k.res * (1 - Math.exp(-tau / 0.09)) + k.sign * 14 * DEG * Math.sin(2 * Math.PI * 3.0 * tau) * Math.exp(-tau / 0.1); }
    return a;
  }
  // S4 after the blows, k120-k127 (2026-11-21 rhythm pass): the riff's second round goes on and the wall shudders on every
  // beat: a quick swing on the pins from the point under her (she plays on), outwards in 0.15 s, gone within about 0.25 s, so
  // between the beats the wall is still; strongest on the crash k120 and the bar line k124. The cards round the letters (the
  // kicked ring) move a third as much, so no card leans into a stroke and the letters stay sharp.
  const TREM = [120, 121, 122, 123, 124, 125, 126, 127].map(k => [K(k), k === 120 ? 24 : k === 124 ? 22 : 17]);
  const ORIGIN4 = [GX0 * PX + ZW * PX / 2, (L2 + GR) * PY + 22], DMAX4 = Math.hypot(BW / 2, BH);
  function tremOf(cd, t) {
    const x = cd.c * PX + PX / 2, y = cd.r * PY + PY / 2, d = Math.hypot(x - ORIGIN4[0], y - ORIGIN4[1]);
    const side = x < ORIGIN4[0] ? 1 : -1, ring = KICK.has(`${cd.c},${cd.r}`) ? 0.33 : 1;
    let a = 0;
    for (const [tb, amp] of TREM) {
      const tau = t - tb - (d / DMAX4) * 0.15; if (tau <= 0 || tau > 0.36) continue;
      a += side * ring * amp * DEG / (1 + d / 320) * Math.sin(2 * Math.PI * 3.2 * tau) * Math.exp(-tau / 0.085);
    }
    return a;
  }
  // the card torn down to its top left corner (above the foot of 「ン」, over an empty hole), hanging on its pin; its one swing
  // at k134.5 (the high accent in the bass gap)
  const DANGLE = cardAt(33, 19), T_DANGLE = TS[7], T_SWAY = K(134.5);
  KICK.delete('33,19');
  // what is left of it (cm, from its pin; the card spans x -4.5..4.5, y -0.85..5.15): the top left corner with a ragged tear
  const DPIECE = [[-4.5, -0.85], [1.05, -0.85], [1.15, 0.25], [0.55, 0.75], [0.7, 1.25], [-0.4, 1.7], [-1.1, 2.35], [-2.2, 2.15], [-2.9, 2.85], [-3.9, 2.6], [-4.5, 3.05]];
  const DCOM = DPIECE.reduce((a, [x, y]) => [a[0] + x / DPIECE.length, a[1] + y / DPIECE.length], [0, 0]);
  const DANG_REST = Math.atan2(DCOM[0], DCOM[1]);             // turned until its centre hangs straight under the pin
  function dangleOf(t) {                                      // -> null (pinned normally) or { phi, f } (f: 0..1 into the tear)
    const tau = t - T_DANGLE; if (tau < 0) return null;
    const f = ease(tau / (3 * FRAME));
    let phi = DANG_REST * f + 12 * DEG * Math.sin(2 * Math.PI * 1.9 * tau) * Math.exp(-tau / 0.16) * f;
    const ts = t - T_SWAY; if (ts >= 0 && ts < 0.8) phi += 4 * DEG * Math.sin(Math.PI * ts / (8 * FRAME) * 2) * Math.exp(-ts / 0.2);
    return { phi, f };
  }
  // the blow (2026-11-21, the lyric rule): it starts on the frame before the onset's frame (e 0.15: the card just starting
  // to turn and shrink, the letter a faint outline), on the onset's frame it is at e 0.60 (0.47 x, dark 0.69: the hole reads;
  // the old film read on its frames g1322-g1323, e 0.42-0.70), then it spins away into the black by the 3rd frame after, smeared by two fading copies of where
  // it just was. The old one-frame jolt forward (1.12 x) is gone: it held the letter a frame; the hit is now the flash and (on ノ
  // only) the camera's one-way kick on the onset's frame.
  const PUNCH = 7 * FRAME, BLOW_U0 = 0.053, BLOW_D = 4.76 * FRAME, READ_E = 0.5;
  const blowE = a => ease(BLOW_U0 + Math.max(0, a) / BLOW_D);
  const torn = new Map();                                     // the torn scrap left on a pin (cm, from the pin): small, so it never breaks a stroke
  for (const cd of CARDS) if (cd.hole >= 0) {
    const RT = rng(cd.seed * 3 + 1), wl = 0.8 + RT() * 0.6, wr = 0.7 + RT() * 0.7, pts = [[-wl, -0.62], [wr, -0.62]];
    const n = 6; for (let i = 0; i <= n; i++) { const u = 1 - i / n, x = -wl + (wl + wr) * u; pts.push([x + (RT() - 0.5) * 0.2, 0.15 + RT() * 0.45 + (i % 2) * 0.18 + 0.3 * Math.sin(u * Math.PI) * RT()]); }
    torn.set(cd, pts);
  }
  const blowOf = cd => { const RS = rng(cd.seed * 5 + 2); return { sgn: RS() < 0.5 ? -1 : 1, spin: (28 + RS() * 30) * DEG, pull: 0.25 + RS() * 0.2 }; };
  const glyphCentre = glyphCells.map(cells => [cells.reduce((a, [c]) => a + c, 0) / cells.length * PX + PX / 2, cells.reduce((a, [, r]) => a + r, 0) / cells.length * PY + PY / 2]);
  // a blown card `a` seconds after its hit -> [scale, angle, dx, dy (cm), dark]; one geometry for the drawing and the audit
  function blowPose(cd, a) {
    const B = blowOf(cd), [gx, gy] = glyphCentre[cd.hole], x0 = cd.c * PX + (PX - CW) / 2, y0 = cd.r * PY + (PY - CH) / 2;
    const e = blowE(a);
    return [1 - 0.88 * e, B.sgn * B.spin * e, (gx - (x0 + CW / 2)) * B.pull * e, (gy - (y0 + CH / 2)) * B.pull * e, Math.min(1, e * 1.15)];
  }
  // the board-cm box of a blown card as drawn at age a (its CW x CH rect, scaled and turned about its centre)
  function blowBox(cd, a) {
    const [sc, ang, dx, dy] = blowPose(cd, a), cx = cd.c * PX + PX / 2 + dx, cy = cd.r * PY + PY / 2 + dy;
    const hw = sc * (CW / 2 * Math.abs(Math.cos(ang)) + CH / 2 * Math.abs(Math.sin(ang))), hh = sc * (CW / 2 * Math.abs(Math.sin(ang)) + CH / 2 * Math.abs(Math.cos(ang)));
    return [cx - hw, cy - hh, 2 * hw, 2 * hh];
  }
  // A blown card turns away into the black, but it stays a paper card (docs/卡面状态.md 第四节, applied to the other students'
  // cards: never a black block that could read as a phone): its paper darkens at most to 0.6 of the black (about 115 grey, a
  // step lighter than her jacket, about 83), and its edge only half as much, so the paper edge shows to the last frame.
  const BLOW_DARK = 0.6, BLOW_RIM = 0.06;

  // ---------------- drawing the board ----------------
  // m = { ox, oy, s }: board cm -> world px; opts.swing: the S1 swing is live; opts.hiRes: draw the S6 cards from their big copies
  function drawBoard(ctx, m, t, { swing = false, trem = false, hiRes = false, banner = true } = {}) {
    const X = v => m.ox + v * m.s, Y = v => m.oy + v * m.s, L = v => v * m.s;
    ctx.fillStyle = GRAPHITE; ctx.fillRect(X(-2.5), Y(-2.5), L(BW + 5), L(BH + 5));
    ctx.strokeStyle = rgba(TEAL_RGB, 0.55); ctx.lineWidth = L(0.8); ctx.strokeRect(X(-2.1), Y(-2.1), L(BW + 4.2), L(BH + 4.2));
    if (banner) {
      ctx.fillStyle = PAPER; ctx.fillRect(X(40), Y(-22), L(BW - 80), L(16));
      ctx.fillStyle = TEAL; ctx.fillRect(X(40), Y(-22), L(BW - 80), L(1.4)); ctx.fillRect(X(40), Y(-7.4), L(BW - 80), L(1.4));
      const k = L(16) * 0.62 / 16; dots16Text(ctx, '第二学期　期末考査　成績順位', X(BW / 2), Y(-14), k, 905, { align: 'center' });
    }
    const dang = dangleOf(t);
    const late = [];
    const pinAt = (px, py) => { const pr = L(0.55); ctx.fillStyle = PIN; ctx.beginPath(); ctx.arc(X(px), Y(py), pr, 0, 7); ctx.fill();
      if (pr > 1.6) { ctx.fillStyle = rgba(PAPER_RGB, 0.85); ctx.beginPath(); ctx.arc(X(px) - pr * 0.3, Y(py) - pr * 0.35, pr * 0.28, 0, 7); ctx.fill(); } };
    for (const cd of CARDS) {
      const px = cd.c * PX + PX / 2, py = cd.r * PY + 0.3 + 0.55;            // the pin (cm)
      const x0 = cd.c * PX + (PX - CW) / 2, y0 = cd.r * PY + (PY - CH) / 2;
      const src = hiRes ? HI.get(`${cd.c},${cd.r}`) : null;
      const draw = (sx = 1) => { if (src) ctx.drawImage(src, -L(CW / 2) * sx, -L(0.85) * sx, L(CW) * sx, L(CH) * sx); else ctx.drawImage(ATLAS, cd.c * AU, cd.r * AH, AU, AH, -L(CW / 2) * sx, -L(0.85) * sx, L(CW) * sx, L(CH) * sx); };
      if (cd.hole >= 0 && t >= TS[cd.hole] - 1e-6) {
        const age = Math.max(0, t - TS[cd.hole]);
        if (age < PUNCH) {                                    // blown off: drawn after the board (it flies in front of the pins)
          late.push(() => {
            const one = (a, alpha) => {
              const [sc, ang, dx, dy, dk] = blowPose(cd, a), dark = dk * BLOW_DARK;
              ctx.save(); ctx.globalAlpha = alpha; ctx.translate(X(x0 + CW / 2 + dx), Y(y0 + CH / 2 + dy)); ctx.rotate(ang); ctx.scale(sc, sc);
              ctx.translate(0, -L(CH / 2 - 0.85)); draw();
              if (dark > 0) {                                 // the whole card half as dark, the inside (all but the paper edge) to `dark`
                const rim = L(CW * BLOW_RIM);
                ctx.fillStyle = GRAPHITE_FIELD;
                ctx.globalAlpha = alpha * dark * 0.5; ctx.fillRect(-L(CW / 2), -L(0.85), L(CW), L(CH));
                ctx.globalAlpha = alpha * (dark * 0.5) / (1 - dark * 0.5); ctx.fillRect(-L(CW / 2) + rim, -L(0.85) + rim, L(CW) - 2 * rim, L(CH) - 2 * rim);
              }
              ctx.restore();
            };
            // the smear trails from the frame after the onset's frame: on the onset's frame a copy of the frame before (the card
            // still nearly whole and light) would lie over the hole and grey the letter out just when it must read
            if (age >= 2 * FRAME - 1e-6) { one(Math.max(0, age - 2 * FRAME), 0.22); one(Math.max(0, age - FRAME), 0.4); }
            one(age, 1);
          });
        }
        const pts = torn.get(cd);                             // the torn scrap left on the pin
        ctx.fillStyle = PAPER_CARD; ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(X(px + a), Y(py + b)) : ctx.moveTo(X(px + a), Y(py + b))); ctx.closePath(); ctx.fill();
        if (m.s > 12) { ctx.strokeStyle = rgba(FIBRE_RGB, 0.5); ctx.lineWidth = L(0.05); ctx.stroke(); }
      } else if (cd === DANGLE && dang) {                    // torn down to its top left corner, hanging on its pin
        late.push(() => {
          ctx.save(); ctx.translate(X(px), Y(py)); ctx.rotate(dang.phi);
          if (dang.f < 1) { ctx.globalAlpha = 1 - dang.f; draw(); ctx.globalAlpha = 1; }          // the rest of it goes in the 3-frame tear
          ctx.beginPath(); DPIECE.forEach(([a, b], i) => i ? ctx.lineTo(L(a), L(b)) : ctx.moveTo(L(a), L(b))); ctx.closePath();
          ctx.save(); ctx.clip(); draw(); ctx.restore();
          if (m.s > 12) { ctx.strokeStyle = rgba(FIBRE_RGB, 0.6); ctx.lineWidth = L(0.05); ctx.stroke(); }
          ctx.restore();
          pinAt(px, py);
        });
      } else {
        const a = (swing ? swingOf(cd, t) : 0) + (trem ? tremOf(cd, t) : 0) + kickOf(cd, t);
        if (Math.abs(a) < 1e-4) { if (src) ctx.drawImage(src, X(x0), Y(y0), L(CW), L(CH)); else ctx.drawImage(ATLAS, cd.c * AU, cd.r * AH, AU, AH, X(x0), Y(y0), L(CW), L(CH)); }
        else {
          ctx.save(); ctx.translate(X(px), Y(py)); ctx.rotate(a); draw();
          // a card turning on its pin turns from the light: it darkens with the angle (the ring reads as a wave of shade)
          const sh = Math.min(0.42, Math.abs(a) / (20 * DEG) * 0.42);
          if (sh > 0.02) { ctx.fillStyle = rgba(INK_RGB, +sh.toFixed(3)); ctx.fillRect(-L(CW / 2), -L(0.85), L(CW), L(CH)); }
          ctx.restore();
        }
      }
      pinAt(px, py);
    }
    for (const f of late) f();
  }

  // ---------------- print helpers: the halftone screen ----------------
  // The same screen as before (a dot at the centre and the corners of every `pitch` px cell, 15 degrees), now prefiltered the
  // way seg_03.js screen() is (根因清单: 03 hall wide, 2026-11-21): the old tile was one 64 px cell minified 13x onto 5 px, and
  // canvas patterns are sampled without prefiltering, so the screens crawled under the slow pushes of S1, S3 and S5
  // (work/seg/05/moire/moire_check.py). The tile is now 12 x 12 cells drawn at the size it is shown (its pixel size rounded
  // from the context's current scale), supersampled 4x and box-filtered, so it is sampled about 1:1 at every zoom.
  const scrCache = new Map();
  function screen(ctx, cover = 0.3, pitch = 5, rgb = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 12, tpx = Math.max(12, Math.round(N * pitch * dev));
    const key = `${cover}|${rgb}|${tpx}`;
    let e = scrCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) for (const o of [0, 0.5]) { bx.beginPath(); bx.arc((i + o) * cell, (j + o) * cell, r, 0, 7); bx.fill(); }
      const src = bx.getImageData(0, 0, B, B).data, [c, x] = mk(tpx, tpx), out = x.createImageData(tpx, tpx), [R0, G0, B0] = rgb;
      for (let y = 0; y < tpx; y++) for (let xx = 0; xx < tpx; xx++) {
        let a = 0; for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) a += src[((y * SS + sy) * B + xx * SS + sx) * 4 + 3];
        const o = (y * tpx + xx) * 4; out.data[o] = R0; out.data[o + 1] = G0; out.data[o + 2] = B0; out.data[o + 3] = Math.round(a / (SS * SS));
      }
      x.putImageData(out, 0, 0);
      e = { p: ctx.createPattern(c, 'repeat') }; scrCache.set(key, e);
    }
    const s = N * pitch / tpx;
    e.p.setTransform(new DOMMatrix().rotateSelf(15).scaleSelf(s, s));
    return e.p;
  }

  // ---------------- her drawings (art/cut, Codex; anchors measured by work/seg/05/anchors.py) ----------------
  const AN = await (await fetch('/art/cut/seg05_anchors.json')).json();
  const ART = { full: 's05_back_full', pluck: 's05_pluck', aim: 's05_aim', s4a: 's05_ots', s4b: 's05_strike', s4c: 's05_throw', sneer: 's05_cold' };
  const IM = {};
  for (const [k, n] of Object.entries(ART)) IM[k] = rinPalImage(await img(`/art/cut/${n}.png`));
  const anc = k => AN[ART[k]];
  // Parts drawn by code over her drawings (2026-11-21, 根因清单「笔芯和笔不对了……吉他弦和吉他不是一块的」): measured on EACH
  // drawing in its own px (art/cut/seg05_parts.json; work/seg/05/parts/strings_measure.py, contacts_measure.py), drawn through
  // the drawing's own placement only, and checked against the drawing's pixels (PART AUDIT). S2 strings: the six drawn
  // strings, bridge bar to where each leaves the drawing (they bow 3-5 px, so each is a measured path, not a straight line);
  // the old six hand-guessed straight lines from x 1105 missed the drawn strings by 26-98 % and string 6 lay off the board.
  // S1 shadows: under the shoes and under the bag, from the lowest row of each in s05_back_full.
  const PA = await loadPartAnchors('/art/cut/seg05_parts.json');
  const RAW = { pluck: await img('/art/cut/s05_pluck.png'), full: await img('/art/cut/s05_back_full.png') };   // the audit reads the drawing as drawn
  const STR = partOf(PA, ART.pluck, 'strings');
  // the hand and the pick over the strings: the drawing's own pixels under s05_pluck_cover.png, drawn back over the vibration
  const PLUCK_COVER = await (async () => {
    const m = await img('/art/cut/s05_pluck_cover.png'), im = IM.pluck, [c, x] = mk(im.width, im.height);
    x.drawImage(m, 0, 0); const mask = x.getImageData(0, 0, im.width, im.height).data;
    x.globalCompositeOperation = 'source-in'; x.drawImage(im, 0, 0); return { canvas: c, mask, w: im.width };
  })();
  const covered = ([px, py]) => { const X = Math.round(px), Y = Math.round(py); return PLUCK_COVER.mask[(Y * PLUCK_COVER.w + X) * 4 + 3] > 127; };
  // a string's measured path sampled evenly (n points)
  const pathSamples = (path, n = 200) => { const L = []; let tot = 0; for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); L.push(l); tot += l; }
    const out = []; for (let j = 0; j <= n; j++) { let d = tot * j / n, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; } const u = Math.min(1, d / L[i]); out.push([path[i][0] + (path[i + 1][0] - path[i][0]) * u, path[i][1] + (path[i + 1][1] - path[i][1]) * u, (j / n) * tot]); }
    return { pts: out, len: tot }; };
  const STRS = STR.map(s => pathSamples(s.path || samplesAlong(s.a, s.b, 22)));
  // PART AUDIT: every visible point of every string on a drawn string (steel within 2 px); points under the hand or the pick
  // (the cover) are hidden: the page draws the drawing's own pixels back over them
  STRS.forEach((s, i) => { const vis = s.pts.filter(p => !covered(p)).map(([x, y]) => [x, y]);
    partAudit('seg_05', ART.pluck, `string ${i + 1} (${(100 * (1 - vis.length / s.pts.length)).toFixed(0)}% under the hand)`, { image: RAW.pluck, points: vis, on: PIX.steel, r: 2, maxOffPct: 3 }); });
  const FOOT = partOf(PA, ART.full, 'foot').point, SOLES = partOf(PA, ART.full, 'foot').soles, BAGP = partOf(PA, ART.full, 'bag').point;
  // the shadows' contacts must be on the drawn soles / bag bottom (opaque within 2 px) with nothing drawn under them
  for (const [nm, p] of [['left sole', SOLES[0]], ['right sole', SOLES[1]], ['bag', BAGP]]) partAudit('seg_05', ART.full, `${nm} shadow contact`, { image: RAW.full, points: [p], on: PIX.opaque, r: 2, maxOffPct: 0 });
  for (const [nm, p] of [['left sole', SOLES[0]], ['right sole', SOLES[1]], ['bag', BAGP]]) partAudit('seg_05', ART.full, `${nm} shadow: nothing drawn below the contact`, { image: RAW.full, points: [[p[0], p[1] + 4], [p[0], p[1] + 8]], on: q => !PIX.opaque(q), r: 0, maxOffPct: 0 });
  // her strum on every beat while she plays in S3 and S4: the body dips a few px on the beat and settles within about 0.2 s
  // (the drawings there are cut by the bottom edge, so the dip never lifts a foot off the floor)
  function bob(t, amp) { const k = Math.floor((t - K(0)) / BEAT + 1e-6), tau = t - K(k); return tau >= 0 ? amp * Math.exp(-tau / 0.07) : 0; }
  function place(ctx, k, s, [ax0, ay0], [wx, wy]) { const im = IM[k]; ctx.drawImage(im, wx - ax0 * s, wy - ay0 * s, im.width * s, im.height * s); }

  // ---------------- S1: her back, full figure, the board ----------------
  // the wall at 4.25 px/cm (cards 38 x 26 px); she stands about 0.8 m in front of it (4.6 px/cm); eye level 1.4 m; feet at y 1048
  const S1 = { s: 4.25, sh: 4.6 };
  S1.feetY = 1048; S1.hor = S1.feetY - 140 * S1.sh;
  S1.wallBase = S1.hor + 140 * S1.s;
  // the board's lower edge 85 cm off the floor in this shot, so it crosses her at the hips and not right at the bow (a tangent)
  S1.board = { ox: 960 - BW / 2 * S1.s, oy: S1.wallBase - (85 + BH) * S1.s, s: S1.s };
  function drawS1(ctx, t) {
    const wb = S1.wallBase;
    ctx.fillStyle = PAPER; ctx.fillRect(-50, -50, W + 100, 1200);
    ctx.fillStyle = screen(ctx, 0.1, 5); ctx.fillRect(-50, -50, W + 100, wb + 50);
    // a wainscot under a rule, and the skirting
    ctx.fillStyle = screen(ctx, 0.16, 5); ctx.fillRect(-50, wb - 50 * S1.s, W + 100, 50 * S1.s);
    ctx.fillStyle = TEAL; ctx.fillRect(-50, wb - 50 * S1.s - 3, W + 100, 3); ctx.fillRect(-50, wb - 5, W + 100, 5);
    // the floor: paper with tile seams closing up towards the wall
    ctx.fillStyle = PAPER; ctx.fillRect(-50, wb, W + 100, 1200 - wb);
    ctx.strokeStyle = rgba(TEAL_RGB, 0.45); ctx.lineWidth = 1.5;
    for (const d of [0.5, 1.4, 2.8]) { const y = wb + (S1.feetY + 40 - wb) * (1 - 1 / (1 + d)); if (y < 1090) { ctx.beginPath(); ctx.moveTo(-50, y); ctx.lineTo(W + 50, y); ctx.stroke(); } }
    drawBoard(ctx, S1.board, t, { swing: true });
    // the drawing and its shadows through one placement (drawing px); the shadows sit on the measured contacts
    const a = anc('full'), s = S1.sh / a.pxPerCm, PL = placement({ x: 960, y: S1.feetY, s, origin: [a.cx, a.feet] });
    // (the contacts are mapped to the world by the same placement; the halftone is laid in world px so its screen pitch holds)
    const [fx, fy] = PL.toWorld(FOOT), [bx, by] = PL.toWorld(BAGP);
    ctx.fillStyle = screen(ctx, 0.45, 4); ctx.beginPath(); ctx.ellipse(fx, fy + 3, 175, 16, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx, by + 2, 205, 14, 0, 0, 7); ctx.fill();
    drawImageAt(ctx, PL, IM.full);
  }
  const herBoxS1 = () => { const a = anc('full'), s = S1.sh / a.pxPerCm; return [960 - (a.cx - a.bbox[0]) * s, S1.feetY - (a.feet - a.bbox[1]) * s, (a.bbox[2] - a.bbox[0]) * s, (a.feet - a.bbox[1]) * s]; };

  // ---------------- S2: the pick hand over the gold top ----------------
  function drawS2(ctx, t) {
    ctx.fillStyle = GRAPHITE; ctx.fillRect(-50, -50, W + 100, 1200);
    const s = Math.max(W / IM.pluck.width, 1080 / IM.pluck.height) * 1.02;
    const PL = placement({ x: (W - IM.pluck.width * s) / 2, y: (1080 - IM.pluck.height * s) / 2, s });
    drawImageAt(ctx, PL, IM.pluck);
    // the strings ring on every beat (the riff's beat lives in the picture, not in the camera): each measured string widens
    // into a thin band and settles within about 6 frames. A string rings from the bridge to where it is fretted, far off the
    // right edge (the nut is about 2.6 visible lengths away), so the band is narrow at the bridge and widest at the edge.
    // Drawn in the drawing's own px through its placement; then the hand and the pick are drawn back over it.
    const kb = [108, 109, 110, 111].map(K).filter(tb => t >= tb).pop();
    if (kb !== undefined) {
      const tau = t - kb, amp = 9 * Math.exp(-tau / (3 * FRAME)) * (tau < 12 * FRAME ? 1 : 0);   // third pass: wider, the beat's carrier now that the camera stands
      if (amp > 0.3) drawPart(ctx, PL, (c, px) => {
        const ph = Math.sin(tau * 2 * Math.PI * 14), Lv = 2.6 * STRS[0].len;
        for (const { pts, len } of STRS) {
          const nrm = i => { const p = pts[Math.max(0, i - 1)], q = pts[Math.min(pts.length - 1, i + 1)], l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [-(q[1] - p[1]) / l, (q[0] - p[0]) / l]; };
          // string 6 is drawn only to the fretboard's lower edge (x 1200), inside the frame: its band fades out over 60 px there
          const inside = pts[pts.length - 1][0] < IM.pluck.width - 2;
          const wAt = i => px(amp) * Math.sin(Math.PI * pts[i][2] / Lv) * (inside ? Math.min(1, (len - pts[i][2]) / 60) : 1);
          c.fillStyle = rgba(PAPER_RGB, 0.45); c.beginPath();
          for (let i = 0; i < pts.length; i += 4) { const [nx, ny] = nrm(i), w = wAt(i); c.lineTo(pts[i][0] + nx * w, pts[i][1] + ny * w); }
          for (let i = pts.length - 1; i >= 0; i -= 4) { const [nx, ny] = nrm(i), w = wAt(i); c.lineTo(pts[i][0] - nx * w, pts[i][1] - ny * w); }
          c.closePath(); c.fill();
          c.strokeStyle = ERASER_STREAK; c.lineWidth = px(1.6); c.beginPath();
          for (let i = 0; i < pts.length; i += 2) { const [nx, ny] = nrm(i), w = wAt(i) * ph; c.lineTo(pts[i][0] + nx * w, pts[i][1] + ny * w); }
          c.stroke();
        }
      });
      drawImageAt(ctx, PL, PLUCK_COVER.canvas);
    }
  }

  // ---------------- S3: the aim ----------------
  // the entrance hall's side wall (a tall window, morning light left paper white), the board seen edge on at the right edge
  function drawS3(ctx, t) {
    ctx.fillStyle = PAPER; ctx.fillRect(-50, -50, W + 100, 1200);
    ctx.fillStyle = screen(ctx, 0.16, 5); ctx.fillRect(-50, -50, W + 100, 1200);
    const wx = 180, wy = 70, ww = 760, wh = 640;
    ctx.fillStyle = PAPER; ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = screen(ctx, 0.07, 5); ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww * 0.42, wy); ctx.lineTo(wx + ww * 0.58, wy); ctx.lineTo(wx + ww * 0.16, wy + wh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = TEAL; ctx.fillRect(wx - 14, wy - 14, ww + 28, 14); ctx.fillRect(wx - 14, wy + wh, ww + 28, 22); ctx.fillRect(wx - 14, wy - 14, 14, wh + 36); ctx.fillRect(wx + ww, wy - 14, 14, wh + 36);
    ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh); ctx.fillRect(wx, wy + wh * 0.46 - 6, ww, 12);
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.moveTo(wx + ww + 14, wy + 40); ctx.lineTo(wx + ww + 520, wy + 260); ctx.lineTo(wx + ww + 520, wy + wh + 300); ctx.lineTo(wx + ww + 14, wy + wh + 22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = TEAL; ctx.fillRect(-50, 905, W + 100, 4);
    ctx.fillStyle = screen(ctx, 0.28, 5); ctx.fillRect(-50, 909, W + 100, 300);
    // the board edge on at the right edge: its black frame, a narrow foreshortened strip of its face (cards and pins)
    const bx = 1800;
    ctx.fillStyle = GRAPHITE; ctx.fillRect(bx, -50, W - bx + 50, 1200);
    for (let r = -1; r < 22; r++) for (let j = 0; j < 4; j++) {
      const x0 = bx + 10 + j * 28 + j * j * 3, w = 22 + j * 4, y0 = -40 + r * 52 + j * 2;
      ctx.fillStyle = PAPER_CARD; ctx.fillRect(x0, y0, w, 44);
      ctx.fillStyle = rgba(TEAL_RGB, 0.8); ctx.fillRect(x0 + 2, y0 + 6, w - 4, 3);
      ctx.fillStyle = PIN; ctx.beginPath(); ctx.arc(x0 + w / 2, y0 + 4, 3.2, 0, 7); ctx.fill();
    }
    ctx.fillStyle = rgba(TEAL_RGB, 0.6); ctx.fillRect(bx - 6, -50, 6, 1200);
    const a = anc('aim'), s = a.scale || (1080 * 0.98 / IM.aim.height);
    place(ctx, 'aim', s, [a.bbox[0], a.bbox[3]], [a.placeX ?? 120, 1080 + 4 + bob(t, 5)]);
  }

  // ---------------- S4: the punch-through, over her shoulder ----------------
  // the wall at 4.45 px/cm (cards 40 x 27 px): the glyphs y 50-667, 1380 px wide; she (much nearer the camera) under them, the
  // top of the bow at y 690; every S4 drawing is a swap of s05_ots on its canvas (registered by work/seg/05/anchors.py), so all
  // three are placed by the master's anchor and nothing jumps at a swap but what the swap changes
  const S4 = { s: 4.45, top: 50, bow: 690 };
  S4.board = { ox: 960 - (GX0 * PX + ZW * PX / 2) * S4.s, oy: S4.top - L1 * PY * S4.s, s: S4.s };
  S4.glyphBox = i => { const [x, y, w, h] = GLYPH_BOX[i]; const m = S4.board; return [m.ox + x * m.s, m.oy + y * m.s, w * m.s, h * m.s]; };
  const herS4 = t => t < K(118) ? 's4a' : t < K(124) ? 's4b' : 's4c';
  function placeS4() { const a = anc('s4a'); return [a.scale, [a.headX, a.bbox[1]], [960, S4.bow]]; }
  function drawS4(ctx, t) {
    ctx.fillStyle = GRAPHITE; ctx.fillRect(-50, -50, W + 100, 1300);
    drawBoard(ctx, S4.board, t, { trem: true, banner: false });
    const k = herS4(t), [s, aa, wp] = placeS4();
    place(ctx, k, s, aa, [wp[0], wp[1] + bob(t, 4)]);
  }
  // the first blow lights the whole frame for two frames on the onset's frame of ノ (paper white over it, 30 % then 10 %);
  // the crash k120 that ends the burst lands with one paper-white flash (75 %, then 30 %: 2026-11-21 rhythm pass, the only
  // crash flash of the segment)
  function flashOf(t) {
    const n0 = Math.round((t - ONF[0]) * FPS), n1 = nAt(t, K(120));
    return Math.max(n0 === 0 ? 0.3 : n0 === 1 ? 0.1 : 0, n1 === 0 ? 0.75 : n1 === 1 ? 0.3 : 0);
  }

  // ---------------- S5: the cold smirk ----------------
  function drawS5(ctx, t) {
    ctx.fillStyle = PAPER; ctx.fillRect(-50, -50, W + 100, 1200);
    ctx.fillStyle = screen(ctx, 0.14, 6); ctx.fillRect(-50, 150, W + 100, 1100);
    ctx.fillStyle = PAPER;
    for (const x0 of [160, 1180]) { ctx.beginPath(); ctx.moveTo(x0, 1100); ctx.lineTo(x0 + 330, 150); ctx.lineTo(x0 + 470, 150); ctx.lineTo(x0 + 140, 1100); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = TEAL; ctx.fillRect(-50, 118, W + 100, 34); ctx.fillRect(300, 150, 30, 1000); ctx.fillRect(1590, 150, 30, 1000);
    ctx.fillStyle = screen(ctx, 0.5, 5); ctx.fillRect(-50, -50, W + 100, 168);
    ctx.fillStyle = TEAL; ctx.fillRect(330, 610, 120, 16); ctx.fillRect(1470, 610, 120, 16);
    const a = anc('sneer'), s = a.scale || (1080 / IM.sneer.height) * 1.04;
    place(ctx, 'sneer', s, [a.headX, a.bbox[3]], [960, 1084]);
  }

  // ---------------- S6: the foot of 「ン」, close ----------------
  // 33 px/cm (cards 297 px wide), from the 520 px copies; the stroke runs from the top right to the bottom left of the frame
  const S6 = { s: 33 };
  S6.board = { ox: 960 - (34.0 * PX) * S6.s, oy: 560 - (19.4 * PY) * S6.s, s: S6.s };
  function drawS6(ctx, t) {
    ctx.fillStyle = GRAPHITE; ctx.fillRect(-50, -50, W + 100, 1200);
    drawBoard(ctx, S6.board, t, { hiRes: true, banner: false });
  }

  // ---------------- the camera (2026-11-21 third pass: 有节奏感，但不晕; docs/制作约定.md 第六节「整屏运动」) ----------------
  // Director after the second cut: “screen motion can have rhythm but must not cause dizziness”. The second
  // cut stepped, kicked and dipped the whole frame on almost every beat here (19 jolts: S1 k105-k107 steps, S2 steps and dips,
  // S3 snare hits, a kick and a dip on every blow, k120 hit + dip + step, k124 step, S5 three 5 % steps, k132 dip, k133 hit).
  // Now the frame jolts twice in the segment, both registered 大击, both one-way (in within 3 frames, at most 6 % past, then it
  // stands): k104 (the crash, her first strum, the riff's first beat) and the first blow ノ (k118, the shout lands). Every shot
  // otherwise stands or pushes in slowly in one direction (the storyboard's 第 7 节 camera table). The beat is carried in the
  // picture: the whole board swings at k104, the strings ring on every beat in S2, her body strums on every beat in S3/S4,
  // eight letters blown out of the wall in 0.64 s, the wall shudders on its pins k120-k127, the white flash at k120.
  const fr0 = t0 => Math.ceil(t0 * FPS - 1e-6);                  // the first frame showing an event at t0 (never before it)
  const nAt = (t, t0) => Math.round(t * FPS) - fr0(t0);           // frames since that frame (t is a frame's song time g / 30)
  const ONE_WAY = [0.55, 0.9, 1.06, 1.0];                         // a one-way jolt: in within 3 frames, 6 % past, then it stands
  const jolt = (n, amt) => n < 0 ? 0 : amt * (n < ONE_WAY.length ? ONE_WAY[n] : 1);
  const HIT104 = 0.03, HIT118 = 0.025;                            // zoom 3 % / 2.5 %: frame corners 1.7 % / 1.4 % of the width
  const PUSH = pushes(S, [[K(105), K(108), 0.04, 'S1 slow push'], [K(108), K(111), 0.04, 'S2 slow push'], [K(112), K(115), 0.04, 'S3 slow push'],
                          [K(120), K(128), 0.03, 'S4 slow push'], [K(128), K(132), 0.12, 'S5 slow push']]);
  const BIG = [[K(104), 'crash k104: the riff\'s first beat, her first strum (段落交界)'], [ONF[0], 'the first blow ノ: the shout lands, the wall is punched (画面中心的击打)']];
  function camAt(t) {
    const sh = shotAt(t);
    if (sh === 's1') { const hb = herBoxS1(); return { z: PUSH(0, t) + jolt(nAt(t, K(104)), HIT104), fx: 960, fy: hb[1] + hb[3] * 0.42 }; }
    if (sh === 's2') return { z: PUSH(1, t), fx: 960, fy: 540 };
    if (sh === 's3') { const a = anc('aim'); return { z: PUSH(2, t), fx: a.neckMidX ?? 1000, fy: a.neckMidY ?? 520 }; }
    if (sh === 's4') return { z: PUSH(3, t) + jolt(Math.round((t - ONF[0]) * FPS), HIT118), fx: 960, fy: 330 };
    if (sh === 's5') return { z: PUSH(4, t), fx: 960, fy: 470 };
    return { z: 1, fx: 960, fy: 540 };
  }
  // the view as actually shown, for frameCheck and MOTION AUDIT (no shake, no dip: the frame only zooms)
  const viewAt = t => { const c = camAt(t); return { t, ...CAM.view(c.z, c.fx, c.fy, 0) }; };

  // ---------------- the score ----------------
  S.hold('shot', 'S1 her back, the board', T0, K(108), { kind: 'shot', onBeat: false });
  S.hold('shot', 'S2 pick hand, gold top', K(108), K(112), { kind: 'shot' });
  S.hold('shot', 'S3 the aim', K(112), K(116), { kind: 'shot' });
  S.hold('shot', 'S4 punch-through', K(116), K(128), { kind: 'shot' });
  S.hold('shot', 'S5 cold smirk', K(128), K(134), { kind: 'shot' });
  // S6 is one beat (k134-k135, 11 frames): the insert on the bass gap, no drawing of her in it (rhythm pass: fast cuts only for
  // shots without her). HOLD AUDIT's 2-beat shot minimum flags it; that is the reason.
  S.hold('shot', 'S6 the foot of the hole', K(134), T1, { kind: 'shot' });
  const fileOf = k => `/art/cut/${ART[k]}.png`;
  S.hold('rin', ART.full, T0, K(108), { file: fileOf('full'), onBeat: false });
  S.hold('rin', ART.pluck, K(108), K(112), { file: fileOf('pluck') });
  S.hold('rin', ART.aim, K(112), K(116), { file: fileOf('aim') });
  S.hold('rin', ART.s4a, K(116), K(118), { file: fileOf('s4a') });
  S.hold('rin', ART.s4b, K(118), K(124), { file: fileOf('s4b') });
  S.hold('rin', ART.s4c, K(124), K(128), { file: fileOf('s4c') });
  S.hold('rin', ART.sneer, K(128), K(134), { file: fileOf('sneer') });
  S.ev('first strum: the whole board swings once, from her outwards', K(104));
  for (const b of [108, 109, 110, 111]) S.ev('strum: the strings ring', K(b));
  S.ev('the torn corner swings once on its pin', T_SWAY, 'half');
  // the camera (third pass): two one-way 大击 (k104 here, the first blow below, which follows the syllable) and slow pushes (registered by pushes())
  S.ev('S1 大击 k104: one-way zoom 3 % (the crash, her first strum)', K(104));
  S.ev('S4 crash k120: white flash 75 % (the camera stands)', K(120));
  for (const [tb] of TREM) S.ev('S4 the wall shudders on its pins', tb);
  // the blows follow the syllables as sung (the lyric rule: 第七节, "逐字跟着实际演唱出现"); not beat events. frame: the onset's
  // frame (floor), start: the blow's first frame, read: the first frame its letter reads (blowE >= READ_E)
  const readFrame = i => { let gq = Math.round(TS[i] * FPS); while (blowE(gq / FPS - TS[i]) < READ_E) gq++; return gq; };
  const lyricHits = SUNG.map(([c, t], i) => ({ char: c, t, frame: onsetFrame(t), start: Math.round(TS[i] * FPS), read: readFrame(i), cards: glyphCells[i].length }));
  const LYA = lyricAudit('seg_05', SUNG.map(([c, t], i) => ({ c, t, readT: readFrame(i) / FPS })));

  const BLOWCHK = { frames: 0 };
  // ---------------- layout: the glyphs never under her head, bow or headstock in S4; and in frame ----------------
  {
    for (const k of ['s4a', 's4b', 's4c']) {
      LAY.text('glyph line 1 ノーフィ', 'wall', S4.glyphBox(0));
      LAY.text('glyph line 2 クション', 'wall', S4.glyphBox(1));
      const a = anc(k), [s, aa, wp] = placeS4(), toW = ([x, y]) => [wp[0] + (x - aa[0]) * s, wp[1] + (y - aa[1]) * s];
      for (const [nm, b] of Object.entries(a.keep || {})) { const p0 = toW([b[0], b[1]]), p1 = toW([b[2], b[3]]); LAY.reg(`${ART[k]} ${nm}`, 'wall', [p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]]); }
      LAY.audit(`S4 glyphs vs ${ART[k]} head, bow and headstock`);
    }
    // The blows' overshoot, frame by frame (根因清单, 03 slam: 放大、过冲类效果按放大后的实际墨迹框逐帧登记): on every frame of
    // every blow, the box of that glyph's flying cards as drawn (the 1.12 x jolt, then the spin, with the two smear copies) is
    // checked against the letters already punched (each glyph's cards) and her head, bow and headstock in the drawing then shown.
    // There is no print16 slam in this segment; this jolt (about each card's own centre) is its only overshoot.
    const toPx = ([x, y, w, h]) => { const m = S4.board; return [m.ox + x * m.s, m.oy + y * m.s, w * m.s, h * m.s]; };
    const unionB = bs => { const x0 = Math.min(...bs.map(b => b[0])), y0 = Math.min(...bs.map(b => b[1])), x1 = Math.max(...bs.map(b => b[0] + b[2])), y1 = Math.max(...bs.map(b => b[1] + b[3])); return [x0, y0, x1 - x0, y1 - y0]; };
    const letterBox = j => unionB(glyphCells[j].map(([c, r]) => [c * PX + (PX - CW) / 2, r * PY + (PY - CH) / 2, CW, CH]));
    SUNG.forEach(([ch], i) => {
      for (const t of frameTimes(T0, TS[i] - 1e-6, TS[i] + PUNCH)) {
        const age = Math.max(0, t - TS[i]), ages = [age, Math.max(0, age - FRAME), Math.max(0, age - 2 * FRAME)];
        LAY.text(`blow ${ch} (frame ${Math.round(t * FPS)})`, 'wall', toPx(unionB(glyphCells[i].flatMap(([c, r]) => ages.map(a => blowBox(cardAt(c, r), a))))));
        SUNG.forEach(([cj], j) => { if (j !== i && TS[j] <= t + 1e-6) LAY.text(`letter ${cj}`, 'wall', toPx(letterBox(j))); });
        const k = herS4(t), a = anc(k), [s, aa, wp] = placeS4(), toW = ([x, y]) => [wp[0] + (x - aa[0]) * s, wp[1] + (y - aa[1]) * s];
        for (const [nm, b] of Object.entries(a.keep || {})) { const p0 = toW([b[0], b[1]]), p1 = toW([b[2], b[3]]); LAY.reg(`${ART[k]} ${nm}`, 'wall', [p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]]); }
        LAY.audit(`S4 blow ${ch} frame ${Math.round(t * FPS)}: flying cards vs the letters punched and her`);
        BLOWCHK.frames++;
      }
    });
    const views = frameTimes(T0, SH.s4[0], SH.s4[1]).map(viewAt);
    LAY.frameCheck('S4 glyphs in frame (with the slow push and the ノ kick)', { sheets: { wall: p => p }, views, inset: 24 });
  }
  // MOTION AUDIT (docs/制作约定.md 第六节「整屏运动」): every rendered frame's view, a cut on the first frame of each shot
  const MOTION_R = motionAudit('seg_05', frameTimes(T0, T0, T1).map(t => ({ ...viewAt(t), cut: Math.round(t * FPS) === F0 || shotAt(t) !== shotAt(t - FRAME) })), { big: BIG });
  const PARTS_R = partReport('seg_05');
  S.finish();
  publishAudit(S, LAY, { motion: MOTION_R, parts: PARTS_R, lyricHits, cardsOnScreen: { S1: [+(CW * S1.s).toFixed(1), +(CH * S1.s).toFixed(1)], S4: [+(CW * S4.s).toFixed(1), +(CH * S4.s).toFixed(1)] }, board: [COLS, ROWS], glyph: [GC, GR], blowFramesAudited: BLOWCHK.frames, blowDarkMax: BLOW_DARK, lyricAudit: LYA });

  const DRAW = { s1: drawS1, s2: drawS2, s3: drawS3, s4: drawS4, s5: drawS5, s6: drawS6 };
  window.renderAt = async t => {
    const sh = shotAt(t), c = camAt(t);
    CAM.shoot([c.z, c.fx, c.fy], 0, t, ctx => DRAW[sh](ctx, t));
    g.setTransform(1, 0, 0, 1, 0, 0);
    const fl = sh === 's4' ? flashOf(t) : 0;
    if (fl > 0) { g.fillStyle = rgba(PAPER_RGB, fl); g.fillRect(0, 0, W, 1080); }
  };
  await window.renderAt(P('t0', 44.7));
}
