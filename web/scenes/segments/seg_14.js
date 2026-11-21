// Segment 14 最終副歌 (docs/分镜/14_最终副歌.md, design 甲 + 细做改定), k455-k488, global frames [5065, 5432), lines 50-53.
// The hall is a flat 2D front elevation in its graphite state (改定 1): metres, every layer scaled about the 1.40 m eye line,
// no perspective, no parallax; zooms only. gate2d.js does not exist yet, so the hall is drawn here (the sample's hall).
//   S1  (k455-k463) C3 chest-up: she stands behind her closed gate, head bowed over her card; line 50 rubbed white out of the
//       black wall over her head as it is sung. Rhythm pass 2026-11-21 (the even push 1.00 -> 1.06 read as a still frame
//       over a crash and seven beats of chorus): k456 crash = one frame of paper white, a 4% punch, a 10 px dip and a step
//       to 1.03; snare punches 1.5% on k457, k459, k461; the bar line k460 a step to 1.06.
//   S2  (k463-k468) the card and the gate (second review 2026-11-21 must: the close two-shot's centre was two still faces and
//       the event happened on a 41 px card and at the bottom edge; on a phone it read as "the frame shook"). Now a low frame
//       1.0 m wide at waist-to-collar height (1920 px/m): the card is 15% of the frame's width, the open lane's paper-white
//       light and the flap doors fill the lower third, the cabinet's two indicator windows (as in 15: one for the lane on
//       either side, ○ while open, × once shut) are in the frame, the question そもそも／大人とは／一体全体 rubbed out of the
//       wall above the cabinet as it is sung. k463 佐藤's card; k464 wave 1 is 00 k0's hit itself: the frame-wide print
//       読み取れません, the dark and the sink, the print flying onto his card in three frames (his card becomes hers), on the
//       same beat his doors slam shut across the white and his window prints ×; k465-k466 the camera pans right to 高橋's
//       card (the wave is coming for him: his card is seen whole before it goes); k466 wave 2 (light): his card printed, his
//       doors shut, his window ×. She is out of this shot (it is about them).
//   S2b (k468-k471) W7 seven-lane wide (a 1.5% punch on the heavy snare k469): wave 3 on the cut, doors 1 and 7 half out on the first frame and shut on the next, the
//       gate row one dark band, every indicator ×; she looks round (R14f_see); なんですか high on the wall over the clock.
//   S3  (k471-k479) the medium shot (M3, 3.1 m) pushed to 1.08 (her face grows on a phone) in two steps on the bar lines
//       (rhythm pass: k472, the second phrase's crash and heavy kick, to 1.04 with a 9 px dip; k476 to 1.08), 1.5% punches on
//       the snare k473, k475, k477, still in between:
//       she turns to 吉田 on her right and takes him by the sleeve (R14f_askL3, her hand above the gate's reader), then calls
//       out the other way (R14f_askR). Nobody looks up; the clock ticks. Line 52 under the clock.
//   S4  (k479-k488) every question on the wall hatched back into the graphite from the frame's edges in (6 frames); four steps
//       in, one a beat (k479-k482), to the chest-up; grip (k479), grip harder (k481); k482.5 still; k483 the yank: the card
//       torn off her neck, the clasp at the back of her neck popped, the strap running from the card to the two clasp
//       halves (R14f_yank); k484 the throw (R14f_throw2, a follow-through: shoulder and body after the arm, hair and blazer
//       swinging, shouting): the card leaves her hand at once and flies up and in; k484-k488 is the song's one drum fill
//       (snare k485, k485.75, k486.25, k487, the cymbals out from k486, the crash on k488), so (fill pass 2026-11-21, review
//       MUST: the old even pull back and the card hanging in slow motion had no beat in them) the card comes at the lens in
//       three steps, one a beat (k485, k486, k487: a snap in four frames with a small overshoot and a kick of yaw and roll,
//       a slow drift between), always left of her face, and rushes in from k487.5; the camera steps back on the yank (k483),
//       the throw (k484) and k485 (the bottom edge from the doors' top down to 0.82 m, the top up to 2.15 m), with punches on
//       k484, k485, k486, k486.5 (half beat, small), k487 (the fill's heaviest kick) and dips on k485, k486, k487; the punches
//       and dips move the card with the world; k486 every card in the hall snaps off its clip (thrown down at 1.2 m/s, so it
//       has dropped 4.5 cm on the beat's frame; the lane people's land on the shut doors' top and bounce); the card fills the
//       frame at k488 (segment 15's first frame): the poster frame, 読み取れません and もうどうだって／いいや, the whole
//       printed face in the frame (her_card.js POSTER_FRAME).
//       Line 53's second half もうどうだって　いいや is rubbed white out of the wall as it is sung, one row above おいどうすんだよ
//       (the camera's step back on the yank opens the wall above it); on her card the same words are written in her pencil
//       but the card only becomes legible on a phone at the rush. LYRIC AUDIT measures each letter's size on screen.
// Shared libraries: score.js (beat, events, the drawings' timeline, audits), lyrics.js, type.js, camera.js (move/frameTimes),
// print.js, palette.js, card.js.
import { drawCard, CARD_RATIO } from '../../lib/card.js';
import { BEAT, FRAME as FR, beatV, beatOf, smooth, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics, lyricAudit } from '../../lib/lyrics.js';
import { createLayout } from '../../lib/type.js';
import { frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, partAudit, PIX, partReport } from '../../lib/parts.js';
import { print16, pencilWriter, whiteLetter, sungShown, sungBuild } from '../../lib/print.js';
import { herCardFace, herCardBoxes, herCardLabelBoxes, drawHerWords, herWordsBoxes, POSTER_FRAME, HER_WORDS } from '../../lib/her_card.js';
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, REHATCH_DARK_RGB,
         REHATCH_LIGHT_RGB, INK_RGB, CARD_SHADOW, PENCIL, rgba } from '../../lib/palette.js';

export default async function seg14(H) {
  const { g, W, P: QP, rng, img, rinPalImage, inkjetText } = H;
  const F0 = 5065, F1 = 5432, SEG = [F0 / 30, F1 / 30];
  const K = beatV;
  const S = createScore('seg_14', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };
  const LY = await loadLyrics({ within: [168.5, 182] });
  const L50 = LY.lineAt(50, '何時になりゃ大人になれますか'), L51 = LY.lineAt(51, 'そもそも大人とは一体全体なんですか');
  const L52 = LY.lineAt(52, 'どなたに伺えばいいんですか'), L53 = LY.lineAt(53, 'おいどうすんだよもうどうだっていいや');
  const L53a = L53.slice(0, 8), L53b = L53.slice(8);
  const PEN = pencilWriter({ font: '600 #px Klee', color: PENCIL });
  const T_S2 = K(463), T_W1 = K(464), T_W1h = K(464.5), T_PAN = K(465), T_W2 = K(466), T_S2B = K(468), T_S3 = K(471), T_ASKR = K(475), T_S4 = K(479),
        T_481 = K(481), T_YANK = K(483), T_THROW = K(484), T_DROP = K(486), T_488 = K(488), T_END = SEG[1];

  // ================================================================================================================
  // the drawings (art/cut, Codex; art/design/prompts/_make_seg14f.py) and the points measured on them
  // ================================================================================================================
  const AN = await (await fetch('/art/cut/seg14f_anchors.json')).json();
  // the code parts (lanyard stubs, the throw's hand), measured on EACH drawing in its own px (web/lib/parts.js; art/cut/seg14_parts.json,
  // work/seg/14/parts/make_parts.py): a drawing without its own anchors throws, nothing is borrowed from another drawing
  const PA = await loadPartAnchors('/art/cut/seg14_parts.json');
  // a drawing of hers: drawing px -> world (metres, y = -height), the one transform the drawing and its parts go through
  const rinPlace = name => { const a = AN.rin[name]; return placement({ x: 0, y: -a.top, s: 1 / a.ppm, origin: [a.cx, 0] }); };
  const FILE = n => `/art/cut/${n}.png`;
  const RIN_NAMES = ['R14f_down2', 'R14f_see', 'R14f_askL3', 'R14f_askR', 'R14f_grip', 'R14f_grip2', 'R14f_yank', 'R14f_throw2'];
  const IMG = {};
  for (const n of RIN_NAMES) IMG[n] = rinPalImage(await img(FILE(n)));

  // ---- her card (docs/卡面状態.md; web/lib/her_card.js is the film's one drawing of it). Up to the yank the card state from
  // 03 k40 on: band 読み取れません in the name field, ロストワン (bold 16-dot) in the 学籍番号 rows, の号哭 (her pencil) in the
  // 偏差値 rows, the grid under them pressed. From the yank on her words もうどうだって／いいや are written over it as sung
  // (drawHerWords, the same layout as segment 15's S1). On the drawings the face is printed onto the card's four corners as
  // measured (work/seg/14/card_quads.py -> art/cut/seg14f_cardquads.json: each side fitted on the paper's outer edge, a corner
  // under the fist found where the sides meet) with a true perspective map (a homography, drawn as a fine triangle mesh),
  // and kept inside the drawn paper by that card's mask (no clasp, no fist; the drawing's own black outline stays the edge).
  const QUADS = await (await fetch('/art/cut/seg14f_cardquads.json')).json();
  const FACE_U = 720, FACE_H = FACE_U / CARD_RATIO;
  // the 3x3 map taking the four source points onto the four destination points (row-major, h33 = 1)
  function homography(src, dst) {
    const A = [], b = [];
    src.forEach(([x, y], i) => { const [X, Y] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X); A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y); });
    for (let c = 0; c < 8; c++) { let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
      for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } }
    const h = b.map((v, i) => v / A[i][i]); return [...h, 1];
  }
  const hApply = (h, x, y) => { const w = h[6] * x + h[7] * y + h[8]; return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w]; };
  const PRINTED = {};
  async function printRin(name) {
    const im = IMG[name], Q = QUADS[name]; if (!Q) return { im };
    const mask = await img(`/art/cut/${Q.mask}`);
    const xs = Q.quad.map(p => p[0]), ys = Q.quad.map(p => p[1]);
    const rx = Math.max(0, Math.floor(Math.min(...xs)) - 3), ry = Math.max(0, Math.floor(Math.min(...ys)) - 3);
    const rw = Math.min(im.width, Math.ceil(Math.max(...xs)) + 3) - rx, rh = Math.min(im.height, Math.ceil(Math.max(...ys)) + 3) - ry;
    const hm = homography([[0, 0], [FACE_U, 0], [FACE_U, FACE_H], [0, FACE_H]], Q.quad), NX = 18, NY = 12, G = [];
    for (let j = 0; j <= NY; j++) { const row = []; for (let i = 0; i <= NX; i++) { const [X, Y] = hApply(hm, i / NX * FACE_U, j / NY * FACE_H); row.push([X - rx, Y - ry]); } G.push(row); }
    // a card-space canvas mapped onto the drawn card and cut to its paper: into a canvas the size of the card's box
    const onCard = src => { const [c, x] = mk(rw, rh); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; drawOnGrid(x, src, G);
      x.globalCompositeOperation = 'destination-in'; x.drawImage(mask, -rx, -ry); return c; };
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0); x.drawImage(onCard(herCardFace(FACE_U)), rx, ry);
    return { im: c, box: [rx, ry, rw, rh], onCard };
  }
  for (const n of RIN_NAMES) PRINTED[n] = await printRin(n);
  // her words on the card in her fist (R14f_yank: も 179.37 and う 179.45 are sung before the throw, k484 = 179.58): written
  // in card space and mapped onto the drawn card like the face
  const [WC, wcx] = mk(FACE_U, FACE_H);
  function wordsOnDrawnCard(ctx, name, tt, s, ox, oy) {
    const P = PRINTED[name]; if (!P.onCard || !sungShown(tt, L53b[0][1])) return;   // も: 55% the frame before its onset's frame
    wcx.setTransform(1, 0, 0, 1, 0, 0); wcx.clearRect(0, 0, FACE_U, FACE_H); drawHerWords(wcx, FACE_U, L53b, tt);
    const [rx, ry, rw, rh] = P.box; ctx.drawImage(P.onCard(WC), ox + rx * s, oy + ry * s, rw * s, rh * s);
  }

  // ================================================================================================================
  // the town: 01's drawings, 15's three new people, 14's six (docs/分镜/14 第 5、6 节: the same people, pose and eye-level camera)
  // ================================================================================================================
  // H: real height (cm); top: the head's top row in the drawing (the drawing's scale follows from them, the canvas bottom
  // being 0.25 m above the floor); cx: the body's centre column; lan: the two lanyard ends where code hangs the rest
  const FIG = {
    p1: { file: 't01_p1c', H: 172, top: 243, cx: 510, lan: [[475, 652], [555, 652]], name: '佐藤　健太', id: '3172', dev: '49' },
    p2: { file: 't01_p2', H: 158, top: 328, cx: 520, lan: [[498, 708], [532, 708]], name: '田中　美咲', id: '3111', dev: '52' },
    p3: { file: 't01_p3', H: 160, top: 378, cx: 512, lan: [[485, 732], [540, 732]], name: '高橋　正男', id: '1043', dev: '51' },
    p6: { file: 't01_p6', H: 160, top: 322, cx: 508, lan: [[495, 660], [535, 660]], name: '山本　さくら', id: '5208', dev: '55' },
    p7: { file: 't01_p7', H: 162, top: 307, cx: 515, lan: [[495, 690], [542, 690]], name: '小林　由美', id: '2614', dev: '50',
          kid: { lan: [[307, 777], [340, 777]], name: '小林　そうた', id: '0003', dev: '00', w: 0.075, drop: 0.03 } },
    p8: { file: 't01_p8', H: 168, top: 310, cx: 512, lan: [[480, 712], [547, 712]], name: '加藤　大輔', id: '7781', dev: '47' },
    p9: { file: 't01_p9', H: 183, top: 150, cx: 511, lan: [[505, 520], [552, 520]], drop: 0.09, name: '吉田　蓮', id: '6630', dev: '53' },
    n3: { file: 't15_n3', H: 158, cx: 508, lan: [[476, 706], [548, 706]], name: '松田　久美子', id: '4420', dev: '48' },
    n5: { file: 't15_n5', H: 175, cx: 508, lan: [[494, 612], [530, 612]], name: '森　拓也', id: '8015', dev: '56' },
    n6: { file: 't15_n6', H: 163, cx: 508, lan: [[492, 706], [540, 706]], name: '石川　真央', id: '2209', dev: '54' },
    ...AN.town,
  };
  // where they stand (docs/分镜/14 第 6 节 站位表; 15 shares it): x (m), layer scale f (lanes 1.0, first row 0.85, second 0.72)
  const EYE = 1.40;
  const ROWS = [
    { k: 'n4', x: -2.0, f: 0.72 }, { k: 'n5', x: -0.655, f: 0.72 }, { k: 'n6', x: 0.68, f: 0.72 }, { k: 'n7', x: 2.0, f: 0.72 },
    { k: 'p5', x: -3.15, f: 0.85 }, { k: 'p6', x: -2.25, f: 0.85 }, { k: 'p7', x: -0.45, f: 0.85 }, { k: 'n3', x: 0.45, f: 0.85 },
    { k: 'p10', x: 2.25, f: 0.85 }, { k: 'p11', x: 3.15, f: 0.85 },
    { k: 'p8', x: -2.7, f: 1 }, { k: 'p2', x: -1.8, f: 1 }, { k: 'p9', x: -0.85, f: 1 }, { k: 'p1', x: 0.9, f: 1 }, { k: 'p3', x: 1.8, f: 1 },
    { k: 'p4', x: 2.7, f: 1 },
  ];
  // the three waves of the stamp (改定 8: from her outwards): k464 lanes 3, 5 (heavy, the sink); k466 lanes 2, 6 and the first
  // row (light); k468 lanes 1, 7 and the second row (light, on the cut to the wide)
  const WAVE = { p9: T_W1, p1: T_W1, p2: T_W2, p3: T_W2, p5: T_W2, p6: T_W2, p7: T_W2, n3: T_W2, p10: T_W2, p11: T_W2,
                 p8: T_S2B, p4: T_S2B, n4: T_S2B, n5: T_S2B, n6: T_S2B, n7: T_S2B };
  const HEAVY = new Set(['p1', 'p9']);
  // 佐藤 and 高橋 redrawn crisp (art/cut/t14_p1cu, t14_p3cu2; registered on their 01 drawings, art/cut/seg14f_anchors.json
  // 'hires'): used where the camera is close: 佐藤 in S1, S2 and S4 (his canvas reaches down to 0.70 m, under every frame's
  // bottom edge there), 高橋 in S2 only. 高橋's first redraw (t14_p3cu) stopped at 0.82 m, inside S2 frame B (bottom 0.71 m):
  // his hands were cut by its straight bottom edge (third review 2026-11-21). t14_p3cu2 (art/design/prompts/_make_seg14h.py) is
  // the same width and px per metre moved down to 0.60-1.50 m, with his 01 pose whole: both hands folded on his cane's crook,
  // the cane straight down out of the frame. EDGE AUDIT below checks every drawing's edges in every frame.
  const HIRES = { p1: { file: 't14_p1cu', on: t => t < T_S2B || t >= T_S4 }, p3: { file: 't14_p3cu2', on: t => t >= T_S2 && t < T_S2B } };
  // 00 k0's stamp, exactly (seg_00.js printAt / PCX, PCY, FIELD_W): the 16-dot head at dot radius 0.5 in pencil black, its em
  // 0.104 card widths, fitted to 0.785 card widths across and 0.92 of the name field's height, centred at (0.5375, 0.141) card
  // widths. The town's stamp used to be a lighter, smaller print (em 0.073, dot radius 0.42): on a phone it was a grey line
  // (second review 2026-11-21); now an adult's stamped card is what hers was at k0.
  const STAMP = { text: '読み取れません', cx: 0.5375, cy: 0.141, em: 0.104, fw: 0.785, fh: 0.1 };
  const stampCache = new Map();
  function stampCrop(size, seed) {                     // the print at one em size, cropped to its dots: { c, w, h }
    const key = `${Math.round(size * 4)}|${seed}`; if (stampCache.has(key)) return stampCache.get(key);
    const s = Math.round(size * 4) / 4, [c, x] = mk(s * 10, s * 2.2);
    inkjetText(x, STAMP.text, c.width / 2, c.height / 2, { size: s, align: 'center', seed, matrix: true, color: INK_RGB, dotr: 0.5 });
    const d = x.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, x1 = 0, y0 = c.height, y1 = 0;
    for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++) if (d[(yy * c.width + xx) * 4 + 3] > 20) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
    const [pc, px] = mk(x1 - x0 + 1, y1 - y0 + 1); px.drawImage(c, -x0, -y0);
    const out = { c: pc, w: pc.width, h: pc.height }; stampCache.set(key, out); return out;
  }
  // the em that fits (in card widths), measured once on a 360 px card
  const STAMP_EM = (() => { const u = 360, p = stampCrop(STAMP.em * u, 7); return STAMP.em * Math.min(1, STAMP.fw * u / p.w, 0.92 * STAMP.fh * u / p.h) * 0.995; })();
  const drawStamp = (x, u, seed) => { const p = stampCrop(STAMP_EM * u, seed); x.drawImage(p.c, STAMP.cx * u - p.w / 2, STAMP.cy * u - p.h / 2); };
  // a card of the town: filled in; [plain, stamped, ground]: 00 k0's stamp in the name field, on a paper-white ground that covers
  // the written name (print16's label), so the name field becomes what hers is. 'ground' is the name field wiped white without
  // the stamp: under the slam frames of the flying print (S2), so the oversized print never lies over the written name (the
  // class of 03's slam: an overshoot frame over neighbouring words; 2026-11-21 card unification, frames 5168, 5188-5189)
  const NAME_GROUND = 0.08;                            // the ground starts 0.08 card widths into the name box (right of 氏名)
  let NAMEBOX = null;                                  // drawCard's name box in card widths (the same template on every card)
  function townCards(name, id, dev, sd) {
    const w = 360, out = [];
    for (const st of ['plain', 'stamped', 'ground']) {
      const [c, x] = mk(w, w / CARD_RATIO), L = drawCard(c, { name, id, dev, seed: sd, serial: `2026-${id}`, heart: 'fill' });
      NAMEBOX ||= L.nameBox.map(v => v / w);
      if (st !== 'plain') { const u = w, [nx, ny, nw, nh] = L.nameBox; x.textAlign = 'left';
        x.fillStyle = PAPER; x.fillRect(nx + u * NAME_GROUND, ny + u * 0.006, nw - u * (NAME_GROUND + 0.008), nh - u * 0.012);
        if (st === 'stamped') drawStamp(x, u, sd + 1); }
      out.push(c);
    }
    return out;
  }
  let seed = 60;
  // a back row is printed one tone step darker (as in 15), so the three rows read as depth on the black wall
  const tone = (im, b) => { const [c, x] = mk(im.width, im.height); x.filter = `brightness(${b})`; x.drawImage(im, 0, 0); return c; };
  for (const [k, f] of Object.entries(FIG)) {
    f.im = await img(FILE(f.file));
    if (f.top === undefined) {                       // the head's top: the first opaque row
      const [c, x] = mk(f.im.width, f.im.height); x.drawImage(f.im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
      let top = 0; outer: for (let y = 0; y < c.height; y++) for (let xx = 0; xx < c.width; xx++) if (d[(y * c.width + xx) * 4 + 3] > 40) { top = y; break outer; }
      f.top = top;
    }
    f.mpp = (f.H - 25) / (1536 - f.top) / 100;       // metres per drawing px (the canvas bottom is 0.25 m above the floor)
    const row = ROWS.find(r => r.k === k); if (row && row.f < 1) f.im = tone(f.im, row.f === 0.85 ? 0.9 : 0.8);
    f.cards = townCards(f.name, f.id, f.dev, seed++);
    if (AN.hires[k]) f.hi = { ...AN.hires[k], im: await img(FILE(HIRES[k].file)), on: HIRES[k].on };
    if (f.kid) f.kid.cards = townCards(f.kid.name, f.kid.id, f.kid.dev, seed++);
    // the lanyard stubs on THIS drawing (and on its crisp redraw, measured on the redraw), drawing px (parts.js)
    f.lanEnds = partOf(PA, f.file, 'lan').ends;
    if (f.hi) f.hi.lanEnds = partOf(PA, HIRES[k].file, 'lan').ends;
    if (f.kid) f.kid.lanEnds = partOf(PA, f.file, 'kidlan').ends;
  }
  // a town drawing's one transform, drawing px -> world (the canvas bottom 0.25 m above the floor; px row 1536 is that edge),
  // and the crisp redraw's (its registration box on the 01 drawing)
  const place01 = (f, x) => placement({ x, y: -0.25, s: f.mpp, origin: [f.cx, 1536] });
  const placeHi = (b, x) => placement({ x: x + b.x0, y: -b.h1, s: (b.x1 - b.x0) / b.im.width });
  // how much of the stamp is printed: swept left to right over 3 frames (heavy) or 2 (light); the two cards the camera holds in
  // S2 are printed by the flying print instead (FLY): their card shows the stamp from the frame the print lands
  const FLY = { p1: { t0: T_W1, land: 3, heavy: true }, p3: { t0: T_W2, land: 2, heavy: false } };
  const stampFrac = (k, tt) => { const t0 = WAVE[k]; if (tt < t0) return 0;
    if (FLY[k]) return tt >= FLY[k].t0 + (FLY[k].land - 1e-3) * FR ? 1 : 0;
    return Math.min(1, ((tt - t0) / FR + 1) / (HEAVY.has(k) ? 3 : 2)); };
  // the name field wiped white from the first frame the flying print is ON the card (佐藤: its third frame; 高橋: its first)
  const groundOn = (k, tt) => !!FLY[k] && tt >= FLY[k].t0 + ((FLY[k].heavy ? 2 : 0) - 1e-3) * FR;
  const toW = (f, x, [px, py]) => [x + (px - f.cx) * f.mpp, -(0.25 + (1536 - py) * f.mpp)];
  // a lane person's card before the drop, in world metres: [left, top (world y), width, height] (hang() below)
  function cardRect(k) { const r = ROWS.find(q => q.k === k), Pf = FIG[k];     // S2 only, where 佐藤 and 高橋 are their redraws
    const ends = Pf.hi ? Pf.hi.lanEnds.map(placeHi(Pf.hi, r.x).toWorld) : Pf.lanEnds.map(place01(Pf, r.x).toWorld);
    const mx = (ends[0][0] + ends[1][0]) / 2, top = Math.max(ends[0][1], ends[1][1]) + (Pf.drop ?? 0.06);
    return [mx - 0.075, top, 0.15, 0.15 / CARD_RATIO]; }
  // a lane person's card (land) comes down on the shut door's top edge in front of them (0.955 m) and bounces once (2 cm, 0.16 s)
  // before it settles there, standing (review 2026-11-21: the drop has to be seen); the rows behind drop out of sight
  const LAND_H = 0.955, BOUNCE = 0.02, BOUNCE_T = 0.16;
  // fill pass 2026-11-21 (review MUST: the drop from rest moved 5 mm on the beat's frame and did not read as a hit): the cards
  // snap off at 1.2 m/s, counted in whole frames from the beat's frame (that frame already shows one frame of fall, 4.5 cm)
  const DROP_V0 = 1.2;
  function hang(ctx, cards, ends, { w = 0.15, drop = 0.06, t, key, sf, land = false, ground = false }) {
    const [[x1, y1], [x2, y2]] = ends, mx = (x1 + x2) / 2, clipY = Math.max(y1, y2) + drop, h = w / CARD_RATIO;
    const a = t - T_DROP, dropped = a >= 0, sw = dropped ? 0.07 * Math.exp(-a / 0.6) * Math.sin(a * 2 * Math.PI / 0.62 + key) : 0;
    const ae = dropped ? (Math.floor(a / FR + 1e-6) + 1) * FR : 0;
    const cxp = mx + Math.sin(sw) * 0.02, cyp = clipY;
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.0045; ctx.lineCap = 'round';
    for (const [x, y] of ends) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + cxp) / 2, (y + cyp) / 2 + 0.01, cxp, cyp); ctx.stroke(); }
    if (!dropped || land || a < 0.8) {
      let fall = dropped ? DROP_V0 * ae + 0.5 * 9.8 * ae * ae : 0;    // straight down, no turn, no sway (改定 8)
      if (land) { const fMax = -LAND_H - cyp - h, tl = (-DROP_V0 + Math.sqrt(DROP_V0 * DROP_V0 + 19.6 * fMax)) / 9.8;
        if (ae >= tl) { const b = ae - tl; fall = fMax - (b < BOUNCE_T ? BOUNCE * 4 * (b / BOUNCE_T) * (1 - b / BOUNCE_T) : 0); } }
      ctx.save(); ctx.translate(mx, cyp + fall);
      ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-w / 2 + 0.004, 0.006, w, h);
      ctx.fillStyle = rgba(TEAL_RGB, 0.55); ctx.fillRect(-w / 2, 0.0015, w, h);
      ctx.drawImage(cards[ground && sf < 1 ? 2 : 0], -w / 2, 0, w, h);
      if (sf > 0) { const cw = cards[1].width; ctx.drawImage(cards[1], 0, 0, cw * sf, cards[1].height, -w / 2, 0, w * sf, h); }
      ctx.restore();
    }
    // the clip: stays on the lanyard, empty after the drop, swaying a little
    ctx.save(); ctx.translate(cxp, cyp); ctx.rotate(sw);
    ctx.fillStyle = PAPER; ctx.fillRect(-0.007, -0.005, 0.014, 0.011); ctx.strokeStyle = TEAL; ctx.lineWidth = 0.002; ctx.strokeRect(-0.007, -0.005, 0.014, 0.011);
    ctx.restore();
  }
  function drawPerson(ctx, { k, x, f }, t) {
    const P = FIG[k];
    ctx.save(); ctx.translate(x, -EYE); ctx.scale(f, f); ctx.translate(-x, EYE);
    const hi = P.hi && P.hi.on(t), PL = hi ? placeHi(P.hi, x) : place01(P, x);
    drawImageAt(ctx, PL, hi ? P.hi.im : P.im);
    const sf = stampFrac(k, t);
    hang(ctx, P.cards, (hi ? P.hi.lanEnds : P.lanEnds).map(PL.toWorld), { drop: P.drop ?? 0.06, t, key: x * 3, sf, land: f === 1, ground: groundOn(k, t) });
    if (P.kid) hang(ctx, P.kid.cards, P.kid.lanEnds.map(PL.toWorld), { w: P.kid.w, drop: P.kid.drop, t, key: x * 3 + 1, sf });
    ctx.restore();
  }
  function headBox({ k, x, f }) {
    const P = FIG[k], top = 0.25 + (1536 - P.top) * P.mpp, hh = 0.25, hw = 0.11;
    const sc = h => EYE + (h - EYE) * f;
    return [x - hw * f, -sc(top), 2 * hw * f, (sc(top) - sc(top - hh))];
  }

  // ================================================================================================================
  // the hall: a flat front elevation in metres (world y = -height), graphite state
  // ================================================================================================================
  // The halftone screen (dots on a 15-degree grid, pitch in metres, so it scales with the camera), drawn prefiltered as seg_03.js
  // screen() does (unify-card task, 根因清单 03 moire): the old pattern was one 64 px dot minified onto 1.8 px (W7) to 3.7 px (S3)
  // on screen, and canvas patterns are sampled without prefiltering, so the wainscot and the cabinets' screened strips aliased
  // (and crawled under S3's slow push). Now the tile is built at the size it is shown (12 x 12 dots, its pixel size from the
  // context's current transform), supersampled 4x and box-filtered: each dot's ink is kept, and below a few px the screen
  // reads as the even tint it stands for.
  const scrCache = new Map();
  function screen(ctx, cover = 0.3, pitch = 0.006, rgbv = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 12, tpx = Math.max(12, Math.round(N * pitch * dev));
    const key = `${cover}|${rgbv}|${tpx}`;
    let e = scrCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [big, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) { bx.beginPath(); bx.arc((i + 0.5) * cell, (j + 0.5) * cell, r, 0, 7); bx.fill(); }
      const src = bx.getImageData(0, 0, B, B).data, [c, x] = mk(tpx, tpx), out = x.createImageData(tpx, tpx), [R0, G0, B0] = rgbv;
      for (let y = 0; y < tpx; y++) for (let xx = 0; xx < tpx; xx++) {
        let a = 0; for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) a += src[((y * SS + sy) * B + xx * SS + sx) * 4 + 3];
        const o = (y * tpx + xx) * 4; out.data[o] = R0; out.data[o + 1] = G0; out.data[o + 2] = B0; out.data[o + 3] = Math.round(a / (SS * SS));
      }
      x.putImageData(out, 0, 0);
      e = { p: ctx.createPattern(c, 'repeat') }; scrCache.set(key, e);
    }
    const sc = N * pitch / tpx;
    e.p.setTransform(new DOMMatrix().rotateSelf(15).scaleSelf(sc, sc));
    return e.p;
  }
  const [GT, gts] = mk(1024, 1024);
  { gts.fillStyle = GRAPHITE_FIELD; gts.fillRect(0, 0, 1024, 1024); const r = rng(9); gts.lineCap = 'round';
    for (let k = 0; k < 1500; k++) { gts.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); gts.lineWidth = 2 + r() * 5;
      const x = r() * 1024, y = r() * 1024, l = 60 + r() * 140, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16;
      for (const [ox, oy] of [[0, 0], [-1024, 0], [1024, 0], [0, -1024], [0, 1024]]) { gts.beginPath(); gts.moveTo(x + ox, y + oy); gts.lineTo(x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l); gts.stroke(); } } }
  let gPat = null;
  const graphite = (ctx, metres = 1.4) => { gPat ||= ctx.createPattern(GT, 'repeat'); gPat.setTransform(new DOMMatrix().scaleSelf(metres / 1024, metres / 1024)); return gPat; };
  const LINE = 0.0055, LANE = 0.9, BW = 0.25, DOOR_LO = 0.25, DOOR_HI = 0.95;
  const LANES = [-4, -3, -2, -1, 0, 1, 2, 3, 4];               // 1-7 are lanes -3..3; the two outer ones always shut
  const BODIES = [-4.05, -3.15, -2.25, -1.35, -0.45, 0.45, 1.35, 2.25, 3.15, 4.05];
  const CLOSE = { '-4': -1, '-3': T_S2B, '-2': T_W2, '-1': T_W1, '0': -1, '1': T_W1, '2': T_W2, '3': T_S2B, '4': -1 };
  // a door's state: 0 open (folded into the cabinets) .. 1 shut: two frames to close, one frame of overshoot
  const doorF = (i, tt) => { const t0 = CLOSE[i]; if (t0 < 0) return 1; if (tt < t0) return 0; const f = Math.floor((tt - t0) / FR + 1e-6); return [0.5, 1.04, 1.0][Math.min(2, f)]; };
  const CLOCK = { x: 0, h: 2.33, R: 0.17 };
  const PRINT = rgba(TEAL_RGB, 0.42);                 // the wall's teal print showing through the graphite (light teal)
  const OVAL_PRINT = rgba(TEAL_RGB, 0.30);
  // the ovals kept: none whose ring comes within 0.08 m of a head's sides or within 0.34 m above its top (every layer, scaled
  // about the eye line as drawn), nor over her head and bow
  const OVALS = [];
  function buildOvals() {                              // after the wall's words are placed: no oval under a written letter either
    const avoid = [...ROWS.map(r => headBox(r)), [-0.2, -1.70, 0.4, 0.4]].map(([x, y, w, h]) => [x - 0.08 - 0.075, y - 0.34 - 0.05, w + 0.16 + 0.15, h + 0.34 + 0.10]);
    for (const L of [...Q, ...N53a, ...N53b]) avoid.push([L.x - L.size * 0.6 - 0.075, -L.h - L.size * 0.6 - 0.05, L.size * 1.2 + 0.15, L.size * 1.2 + 0.10]);
    for (const sx of [-1, 1]) for (let ri = 0; ri < 5; ri++) for (let j = 0; j < 5; j++) {
      const ox = sx * (0.62 + j * 0.27), oy = -(1.40 + ri * 0.2);
      if (!avoid.some(([x, y, w, h]) => ox > x && ox < x + w && oy > y && oy < y + h)) OVALS.push([ox, oy]); } }
  function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function wall(ctx, tt) {
    ctx.fillStyle = graphite(ctx); ctx.fillRect(-4.6, -4.6, 9.2, 4.6);
    // the beam with its timing marks, the wainscot rule, the two fields of ovals, an upper rule: 03's print under the graphite
    ctx.fillStyle = rgba(TEAL_RGB, 0.30); ctx.fillRect(-4.6, -3.06, 9.2, 0.31);
    ctx.fillStyle = rgba(PAPER_RGB, 0.16);
    for (let x = -4.3; x <= 4.31; x += 0.2) if (Math.abs(x) > 0.3) ctx.fillRect(x - 0.03, -2.445, 0.06, 0.045);
    ctx.fillStyle = PRINT; ctx.fillRect(-4.6, -1.19, 9.2, 0.015); ctx.fillRect(-4.6, -3.95, 9.2, 0.012);
    ctx.fillStyle = screen(ctx, 0.10, 0.006, TEAL_RGB); ctx.globalAlpha = 0.5; ctx.fillRect(-4.6, -1.175, 9.2, 1.175); ctx.globalAlpha = 1;
    // 03's two fields of answer ovals, printed fainter under the graphite; an oval that would sit on or just over somebody's head
    // is left out (review 2026-11-21: in the close shots the ovals over the heads read as a row of haloes), so in every frame the
    // ovals read as the wall's grid, never as a ring over a head
    ctx.strokeStyle = OVAL_PRINT; ctx.lineWidth = 0.007;
    for (const [ox, oy] of OVALS) { ctx.beginPath(); ctx.ellipse(ox, oy, 0.075, 0.05, 0, 0, 7); ctx.stroke(); }
    clock(ctx, tt);
  }
  function clock(ctx, tt) {
    const { x: cx, h, R } = CLOCK, cy = -h;
    ctx.fillStyle = PRINT; ctx.fillRect(cx - 0.012, -2.75, 0.024, 2.75 - h - R + 0.01);
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.02; ctx.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = R * (i % 5 ? 0.86 : 0.74), r1 = R * 0.92;
      ctx.lineWidth = i % 5 ? 0.004 : 0.011; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.stroke(); }
    const secs = 52 * 60 + 12 + tt, hand = (a, len, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - Math.sin(a) * len * 0.15, cy + Math.cos(a) * len * 0.15); ctx.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len); ctx.stroke(); };
    hand((7 + secs / 3600) / 12 * Math.PI * 2, R * 0.5, 0.02, TEAL);
    hand((secs / 60) / 60 * Math.PI * 2, R * 0.76, 0.013, TEAL);
    // the second hand drawn thick (a phone sees it move), ticking once a second with a small overshoot
    const s0 = Math.floor(secs), fr = secs - s0, tick = s0 + (fr < 0.12 ? smooth(fr / 0.12) * 1.04 : 1 - 0.04 * Math.exp(-(fr - 0.12) / 0.05)) - 1;
    hand(((tick % 60) + 1) / 60 * Math.PI * 2, R * 0.86, 0.008, GRAPHITE);
    ctx.fillStyle = GRAPHITE; ctx.beginPath(); ctx.arc(cx, cy, 0.013, 0, 7); ctx.fill();
  }
  // an open lane: a cell of paper-white light between the cabinets (the exit beyond), a screened teal edge; shutting, it goes dark
  function lights(ctx, tt) {
    const half = (LANE - BW) / 2;
    for (const i of LANES) { const f = doorF(i, tt); if (f >= 1) continue;
      const lc = i * LANE; ctx.globalAlpha = 1 - Math.min(1, f);
      ctx.fillStyle = PAPER; ctx.fillRect(lc - half, -DOOR_HI, 2 * half, DOOR_HI - DOOR_LO + 0.3);
      ctx.fillStyle = screen(ctx, 0.35); ctx.fillRect(lc - half, -DOOR_HI, 0.035, DOOR_HI); ctx.fillRect(lc + half - 0.035, -DOOR_HI, 0.035, DOOR_HI);
      ctx.globalAlpha = 1; }
  }
  function gateFace(ctx, cx, tt) {
    const x0 = cx - BW / 2;
    for (const sd of [-1, 1]) { ctx.fillStyle = screen(ctx, 0.55); const xs = sd < 0 ? x0 - 0.035 : x0 + BW; ctx.fillRect(xs, -0.985, 0.035, 0.985); }
    rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.fillStyle = PAPER; ctx.fill();
    ctx.fillStyle = rgba(INK_RGB, 0.12); ctx.fill();                                   // the machines stay light grey; readers dark
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.008; ctx.stroke();
    ctx.save(); rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.clip(); ctx.fillStyle = TEAL; ctx.fillRect(x0, -1.0, BW, 0.06); ctx.restore();
    ctx.strokeStyle = TEAL; ctx.lineWidth = LINE; rrect(ctx, x0 + 0.025, -0.915, BW - 0.05, 0.86, 0.012); ctx.stroke();
    // the reader: solid (paper under the dark ink), so nothing behind it shows through
    rrect(ctx, cx - 0.045, -1.075, 0.09, 0.075, 0.008); ctx.fillStyle = PAPER; ctx.fill(); ctx.fillStyle = rgba(INK_RGB, 0.7); ctx.fill(); ctx.lineWidth = LINE; ctx.stroke();
    for (const sx of [x0 + 0.045, x0 + BW - 0.045]) { ctx.beginPath(); ctx.arc(sx, -0.6, 0.006, 0, 7); ctx.stroke(); }
    // two indicator windows, one for the lane on either side (15's cabinets, so 14's wide and 15's wide are the same hall):
    // ○ while the lane is open, × printed (machine print, light) the frame its doors shut
    for (const sd of [-1, 1]) {
      const lane = Math.round((cx + sd * LANE / 2) / LANE); if (lane < -3 || lane > 3) continue;
      const [wx, wy] = WIN(cx, sd), t0 = CLOSE[String(lane)], shut = t0 < 0 || tt >= t0;
      rrect(ctx, wx - 0.045, wy - 0.045, 0.09, 0.09, 0.008); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 0.005; ctx.stroke();
      ctx.save(); ctx.translate(wx, wy); ctx.scale(0.001, 0.001);
      print16(ctx, shut ? '×' : '○', 0, 0, 4.4, shut ? (t0 < 0 ? 9 : tt - t0) : 9, 120 + Math.round(cx * 10) + (sd > 0 ? 1 : 0));
      ctx.restore();
    }
  }
  const WIN = (cx, sd) => [cx + sd * 0.058, -0.83];      // a window's centre (world)
  // the two halves meet with no slit and their top corners are square, so a shut pair is one flat top edge (a slit 8 mm wide and
  // the V the rounded tips made used to show the bottom edge of the drawing behind them: EDGE AUDIT); the foot stays rounded
  const DOOR_HALF = (LANE - BW) / 2 + 0.001;
  function doorPath(ctx, x, y, w, h, r) { r = Math.min(r, w / 2); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.closePath(); }
  function doors(ctx, tt) {
    const half = DOOR_HALF;
    for (const i of LANES) {
      const lc = i * LANE, f = doorF(i, tt); if (f <= 0) continue;
      for (const sd of [-1, 1]) {
        const root = lc + sd * (LANE / 2 - BW / 2), w = half * f, xa = sd < 0 ? root : root - w;
        doorPath(ctx, xa, -DOOR_HI, w, DOOR_HI - DOOR_LO, 0.03); ctx.fillStyle = GRAPHITE; ctx.fill();
        ctx.strokeStyle = rgba(PAPER_RGB, 0.42); ctx.lineWidth = 0.006; rrect(ctx, xa + 0.014, -DOOR_HI + 0.015, Math.max(0, w - 0.028), DOOR_HI - DOOR_LO - 0.03, 0.022); ctx.stroke();
      }
    }
  }

  // ================================================================================================================
  // her words rubbed white out of the black wall (Demo 2's letters), placed in metres; hatched back at k479
  // ================================================================================================================
  const wallLine = (chars, x0, h, size, gap = 1.02) => chars.map(([c, t], i) => ({ c, t, x: x0 + size * gap * (i + 0.5), h, size }));
  const lineW = (n, size, gap = 1.02) => n * size * gap;
  // line 50 over her head (0.09 m: its right end, 0.64 m, stays left of the close two-shot's frame, 0.66 m)
  const Q50 = wallLine(L50, -lineW(14, 0.09) / 2, 1.74, 0.09);
  // line 51's first half low on the wall in the gap between 佐藤 (to x 1.22 m) and 高橋 (from 1.555 m), above cabinet 1.35's
  // reader (1.075 m): three rows of four (そもそも / 大人とは / 一体全体), 0.05 m a letter (96 px in S2, as before), all of it
  // written while S2 holds them: the right third of frame A, the left third of frame B; the middle row's foot clears the
  // wainscot rule (1.19 m); inside the medium shot's right edge (1.47 m) after its push
  const Q51ROWS = [QP('q1', 1.23), QP('q2', 1.172), QP('q3', 1.114)];
  const Q51a = [0, 1, 2].map(i => wallLine(L51.slice(4 * i, 4 * i + 4), QP('qx', 1.24), Q51ROWS[i], QP('qs', 0.045)));
  const Q51b = wallLine(L51.slice(12), -lineW(5, 0.30) / 2, 3.48, 0.30);    // big on the high wall: the wide's only words
  const Q52 = wallLine(L52, -1.15, 2.02, 0.095);
  const Q = [...Q50, ...Q51a.flat(), ...Q51b, ...Q52];
  // line 53's first half over her head on the hatched wall: 1.785 m, so the bow of the throw (its top 1.72 m) stays under it
  const N53a = wallLine(L53a, -lineW(8, 0.115) / 2, 1.785, 0.115);
  // line 53's second half もうどうだって　いいや (fill pass 2026-11-21, review MUST: it was only on her card, 6-15 px high on
  // the frame each letter was sung, legible only when the card filled the frame 0.7-1.7 s late): one row above おいどうすんだよ,
  // 0.12 m letters (one space between だって and いいや), its centre 1.95 m: above every head (吉田's top 1.83 m) and over
  // the old line's top (1.845 m); the camera's step back on the yank (k483) brings the wall up to 2.07 m into the frame before
  // も (k483.44). On a phone the letters are 17-20 px high.
  const N53B_SIZE = 0.12, N53B_H = 1.95, N53B_SLOT = N53B_SIZE * 1.02, N53B_X0 = -11 * N53B_SLOT / 2;
  const N53b = L53b.map(([c, t], i) => ({ c, t, x: N53B_X0 + N53B_SLOT * ((i < 7 ? i : i + 1) + 0.5), h: N53B_H, size: N53B_SIZE }));
  buildOvals();
  // a sung letter: 55% on the frame before its onset's frame, whole on that frame (print.js sungBuild; 2026-11-21, the lyrics
  // read 1-2 frames late when this gate was tt < L.t and the letter faded in over three frames after it)
  function wallLetter(ctx, L, tt) {
    if (!sungShown(tt, L.t)) return;
    ctx.save(); ctx.translate(L.x, -L.h); ctx.scale(L.size / 120, L.size / 120); whiteLetter(ctx, L.c, 0, 0, 120, tt - L.t, 'rubbed'); ctx.restore();
  }
  // the medium shot S3 (M3: 3.1 m wide; bottom 0.868 m so that after its push it ends on the chest-up's bottom edge, 0.90 m):
  // its frame is where the hatching starts (its edges), sweeping in to her
  const S3F = { w: 3.1 }; S3F.h = S3F.w * 1080 / W; S3F.cy = 0.868 + S3F.h / 2;
  const dOf = (x, h) => 1 - Math.max(Math.abs(x) / (S3F.w / 2), Math.abs(h - S3F.cy) / (S3F.h / 2));
  const HATCH = [];
  { const r = rng(1479), boxes = [];
    const box = list => { const xs = list.map(L => L.x), hs = list.map(L => L.h), s = list[0].size; boxes.push([Math.min(...xs) - s, Math.min(...hs) - s * 0.9, Math.max(...xs) + s, Math.max(...hs) + s * 0.9]); };
    [Q50, ...Q51a, Q51b, Q52].forEach(box);
    for (const [x0, h0, x1, h1] of boxes) { const n = Math.round((x1 - x0) * (h1 - h0) * 2600);
      for (let k = 0; k < n; k++) { const x = x0 + r() * (x1 - x0), h = h0 + r() * (h1 - h0), ang = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.2, l = 0.05 + r() * 0.1;
        HATCH.push({ x, h, ang, l, w: 0.006 + r() * 0.008, dark: r() < 0.7, a: r(), d: Math.max(0, dOf(x, h)) + r() * 0.04 }); } }
    HATCH.sort((p, q2) => p.d - q2.d); }
  Q.forEach(L => { L.d = Math.max(0, dOf(L.x, L.h)); });
  const T_HATCH = T_S4, HATCH_FRAMES = 6;     // six frames (in the beat): the sweep in from the edges is seen as a sweep
  const hatchFront = tt => tt < T_HATCH ? -1 : Math.min(1.1, ((tt - T_HATCH) / FR + 1) / HATCH_FRAMES * 1.1);
  function drawQuestions(ctx, tt) {
    const fr = hatchFront(tt);
    for (const L of Q) if (L.d > fr) wallLetter(ctx, L, tt);
    if (fr < 0) return;
    ctx.save(); ctx.lineCap = 'round';
    for (const s of HATCH) { if (s.d > fr) break;
      ctx.strokeStyle = s.dark ? rgba(REHATCH_DARK_RGB, 0.55 + s.a * 0.35) : rgba(REHATCH_LIGHT_RGB, 0.18 + s.a * 0.2); ctx.lineWidth = s.w;
      const dx = Math.cos(s.ang) * s.l / 2, dy = Math.sin(s.ang) * s.l / 2; ctx.beginPath(); ctx.moveTo(s.x - dx, -s.h - dy); ctx.lineTo(s.x + dx, -s.h + dy); ctx.stroke(); }
    ctx.restore();
  }

  // ================================================================================================================
  // her standing drawings, placed by their measurement: px per metre, centre column, the height of the canvas top edge
  // ================================================================================================================
  function drawRin(ctx, name, tt) {
    const PL = rinPlace(name), [ox, oy] = PL.toWorld([0, 0]);
    drawImageAt(ctx, PL, PRINTED[name].im);
    wordsOnDrawnCard(ctx, name, tt, PL.s, ox, oy);
  }
  function hall(ctx, tt, rinName) {
    wall(ctx, tt);
    lights(ctx, tt);
    drawQuestions(ctx, tt);
    for (const L of N53a) wallLetter(ctx, L, tt);
    for (const L of N53b) wallLetter(ctx, L, tt);
    for (const f of [0.72, 0.85, 1]) for (const r of ROWS.filter(r => r.f === f)) drawPerson(ctx, r, tt);
    drawRin(ctx, rinName, tt);
    doors(ctx, tt);
    for (const cx of BODIES) gateFace(ctx, cx, tt);
  }
  function shootWorld([ppm, cx, ch], tt, drawLayers, dy = 0) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = GRAPHITE_FIELD; g.fillRect(0, 0, W, 1080);
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.setTransform(ppm, 0, 0, ppm, W / 2 - cx * ppm, 540 + ch * ppm + dy);
    drawLayers(g, ppm);
    g.restore();
  }

  // ================================================================================================================
  // the cameras: [px per metre, centre x, centre height]
  // ================================================================================================================
  const C3 = [1080 / 0.95, 0, (0.90 + 1.85) / 2];                 // chest-up: 0.90 m (the doors' top 0.95 m just in) to 1.85 m
  // S2, the card and the gate (second review 2026-11-21: in the close two-shot the event was on a 41 px card and at the bottom
  // edge). 1.0 m wide (1920 px/m): a card is 288 px, 15% of the frame (59 px on a 390 px phone); bottom 0.775 m, so the
  // indicator windows (0.785-0.875 m) are whole and the doors (to 0.95 m) fill the lower third; top 1.3375 m (collars, the
  // lanyards running up out of frame). Frame A x 0.56-1.56: 佐藤's card in the left third (his doors under it, cabinet 1.35
  // with both windows), the question in the right third above the cabinet; frame B x 1.14-2.14: the question in the left
  // third, 高橋's card right of centre. The pan A -> B is a whip k465-k465.5 (motion pass), held half a beat on his card before it goes.
  const S2Z = QP('s2z', 1920), S2BOT = QP('s2bot', 0.775), S2XA = QP('s2xa', 1.06), S2XB = QP('s2xb', 1.64);
  const S2CY = S2BOT + 1080 / S2Z / 2, S2DYB = QP('s2dyb', -0.065);
  const W7 = [W / 6.3, 0, 0.30 + 6.3 * 1080 / W / 2];             // the seven lanes: 6.3 m wide from 0.30 m (the gates and people larger)
  const S3C = [1080 / S3F.h, 0, S3F.cy];
  // ---- the whole frame's motion (motion pass 2026-11-21, docs/制作约定.md 第六节「整屏运动」; the user after the second cut:
  // 「你为什么要一直抖动屏幕？……看着很晕啊」「不是完全不能晃 但是不能晕」). The rhythm pass had the camera answer every crash, bar
  // line and snare (punches k457/459/461/469/473/475/477/484-487, steps k460/k476/k479-k482/k483-k485, dips, the k464 sink): 18 jolts
  // in 33 beats. Now the frame moves only on: k456 (大击: the final chorus's first crash, one step in, one-way, the paper-white
  // frame kept), the S2 pan k465 (the registered whip: 佐藤's card to 高橋's, half a beat), k472 (one ordinary step under 1%,
  // the second phrase's crash), k484 (大击: the throw, one step back, one-way). Everything else is eased pushes in one direction
  // (S1, S3, S4) or still; the beat is carried inside the picture: line 50 rubbed out letter by letter, the flying print slamming
  // onto 佐藤's card with his doors and window on k464, the doors of wave 2 and 3, her swaps (grip k479, grip harder k481, yank
  // k483, throw k484), the questions hatched back on k479, the card's snaps at the lens on the fill's hits k485/k486/k487 and the
  // hall's cards dropping off their clips on k486. MOTION AUDIT below checks every frame.
  const fiOf = (tt, t0) => tt < t0 ? -1 : Math.floor((tt - t0) / FR + 1e-6);
  // a one-way step: started on the beat's frame, there on the third with a 6% overshoot (the rule allows 15%), settled on the fourth
  const STEP_P = [0.55, 0.93, 1.06, 1];
  const stepP = (tt, t0) => { const fi = fiOf(tt, t0); return fi < 0 ? 0 : STEP_P[Math.min(STEP_P.length - 1, fi)]; };
  const ease = (tt, a, b) => smooth(Math.min(1, Math.max(0, (tt - a) / (b - a))));
  // flash: paper white over the frame on the k456 crash, 78% on the beat's frame, 30% on the next
  const FLASH = [0.78, 0.30];
  const flashAt = (tt, list) => list.reduce((a, t0) => { const fi = fiOf(tt, t0); return Math.max(a, fi >= 0 && fi < FLASH.length ? FLASH[fi] : 0); }, 0);
  // a camera [ppm, cx, ch] zoomed by m about the world point (fx, fh)
  const zoomAbout = ([ppm, cx, ch], m, fx, fh) => [ppm * m, fx + (cx - fx) / m, fh + (ch - fh) / m];
  // S1 (k455-k463): k456 one step in 1.00 -> 1.03 about her face (1.45 m; corners move 1.8% of the width), with the flash; then
  // an eased push on to 1.06 over k457-k463 (where the old push ended), so line 50 keeps its margin under the top edge
  const S1_BIG = K(456), FLASHES = [K(456)];
  const camS1 = tt => { const z = Math.pow(1.03, stepP(tt, S1_BIG)) * Math.pow(1.06 / 1.03, ease(tt, K(457), T_S2));
    return [C3[0] * z, 0, 1.45 + (C3[2] - 1.45) / z]; };
  // S2: the k464 hit is in the picture (the frame-wide print flying onto 佐藤's card, his doors slamming, his window ×) and the
  // dark of the impact; the frame no longer sinks (the dip is out of the rules). sinkPx stays as the frame's offset (always 0).
  const HIT_DARK = [0.30, 0.16, 0.06];
  const hitFrame = tt => tt < T_W1 ? -1 : Math.floor((tt - T_W1) / FR + 1e-6);
  const sinkPx = () => 0;
  const darkAt = tt => { const fi = hitFrame(tt); return fi >= 0 && fi < 3 ? HIT_DARK[fi] : 0; };
  // S3: k472 one step in 1.00 -> 1.012 about the push's fixed point (0.5 m right of her, 1.76 m; corners under 1%), then an eased
  // push on to 1.08 over k473-k479: her face grows 8% (phone legibility), the clock, her card and line 51's three rows (to x
  // 1.444 m) stay whole; it ends exactly where S4 starts (S3END)
  const S3Z = 1.08, S3P = 1.76, S3PX = 0.5, S3_STEP = K(472), S3_STEP_Z = 1.012;
  const camS3base = tt => { const z = Math.pow(S3_STEP_Z, stepP(tt, S3_STEP)) * Math.pow(S3Z / S3_STEP_Z, ease(tt, K(473), T_S4));
    return [S3C[0] * z, S3PX - S3PX / z, S3P + (S3C[2] - S3P) / z]; };
  const camS3 = camS3base;
  const camW7 = () => W7;
  // S4: from where S3 ended, one eased push over three beats (k479-k482, the questions hatched back, grip, grip harder) to a
  // waist-up frame 0.88-2.10 m (the doors' tops in at the bottom for the drop on k486; the wall above おいどうすんだよ open for line
  // 53's second half before も, k483.44); still through the yank; k484 the throw (大击): one step back, 3.5% about her face
  // (corners about 2%), one-way, held to the end. The flying card is placed on this camera's screen, so no extra shake on it.
  const frameOf = (bot, top) => [1080 / (top - bot), 0, (bot + top) / 2];
  // from frame A to frame B about their common fixed point (both [ppm, cx, ch]); p the progress
  function stepBetween(A, B, p) {
    const r = B[0] / A[0], xf = (B[1] * r - A[1]) / (r - 1), yf = (B[2] * r - A[2]) / (r - 1), z = A[0] * Math.pow(r, p);
    return [z, xf + (A[1] - xf) * A[0] / z, yf + (A[2] - yf) * A[0] / z];
  }
  const S3END = camS3base(T_S4), FS4 = frameOf(0.88, 2.10), T_PUSH4 = K(482), S4_BACK = 1.035, PF_H = 1.45;
  function camS4base(tt) {
    if (tt < T_PUSH4) return stepBetween(S3END, FS4, ease(tt, T_S4, T_PUSH4));
    return zoomAbout(FS4, Math.pow(1 / S4_BACK, stepP(tt, T_THROW)), 0, PF_H);
  }
  const camS4 = camS4base;
  // S2's pan from frame A to frame B: k465 to k465.5, a registered whip (half a beat, then held 2.5 beats to the cut)
  const T_PAN_END = K(465.5);
  const camS2 = tt => { const e = ease(tt, T_PAN, T_PAN_END); return [S2Z, S2XA + (S2XB - S2XA) * e, S2CY + S2DYB * e]; };
  const camAt = tt => tt < T_S2 ? camS1(tt) : tt < T_S2B ? camS2(tt) : tt < T_S3 ? camW7(tt) : tt < T_S4 ? camS3(tt) : camS4(tt);

  // ================================================================================================================
  // the score
  // ================================================================================================================
  S.hold('shot', 'S1 chest-up C3, a step to 1.03 on k456, eased on to 1.06', SEG[0], T_S2, { kind: 'shot', onBeat: false });
  S.hold('shot', 'S2 the card and the gate: 佐藤, pan, 高橋 (low frame, 1920 px/m)', T_S2, T_S2B, { kind: 'shot' });
  S.hold('shot', 'S2b the seven lanes (W7)', T_S2B, T_S3, { kind: 'shot' });
  S.hold('shot', 'S3 the medium shot, a step on k472, eased push to 1.08', T_S3, T_S4, { kind: 'shot' });
  S.hold('shot', 'S4 eased push in, the yank, the throw (one step back)', T_S4, T_END, { kind: 'shot' });
  const RIN_TRACK = [
    ['R14f_down2', 'head bowed over her card', SEG[0], T_S2B, 'key', false],
    ['R14f_see', 'looking round at the shut gates (the wide)', T_S2B, T_S3, 'key'],
    ['R14f_askL3', 'turns and takes 吉田 by the sleeve to ask', T_S3, T_ASKR, 'key'],
    ['R14f_askR', 'calls out the other way', T_ASKR, T_S4, 'key'],
    ['R14f_grip', 'grips the card', T_S4, T_481, 'key'],
    ['R14f_grip2', 'grips harder, glaring', T_481, T_YANK, 'key'],
    ['R14f_yank', 'the yank, the clasp pops', T_YANK, T_THROW, 'inbetween'],
    ['R14f_throw2', 'the throw, followed through', T_THROW, T_END, 'key'],
  ];
  for (const [n, what, a, b, kind, onBeat = true] of RIN_TRACK) S.hold('rin', `${n} (${what})`, a, b, { kind, file: FILE(n), onBeat });
  // the town drawings on screen (no swaps; registered for the reuse table)
  for (const r of ROWS) S.hold(`town ${r.k}`, `${FIG[r.k].file}`, SEG[0], T_END, { kind: 'key', file: FILE(FIG[r.k].file), onBeat: false, person: true });
  // the two crisp redraws, registered like the town drawings above (the same person and pose as t01_p1c / t01_p3, swapped in
  // only where the camera is close: not a pose change)
  S.hold('town p1 close', 't14_p1cu', SEG[0], T_END, { kind: 'key', file: FILE('t14_p1cu'), onBeat: false, person: true });
  S.hold('town p3 close', 't14_p3cu2', SEG[0], T_END, { kind: 'key', file: FILE('t14_p3cu2'), onBeat: false, person: true });
  S.ev('line 50 opens (cut from 13 on the downbeat)', K(455));
  // the frame's motion (motion pass): two 大击, one whip, one ordinary step; every start on a beat (the whip ends on the half beat)
  S.ev('S1 大击: one step in (x1.03), crash', S1_BIG); S.mark('S1 eased push x1.03 -> x1.06 start', K(457));
  FLASHES.forEach(t => S.ev('flash (paper white, crash)', t));
  S.ev("wave 1 (00 k0's hit): the frame-wide print flies onto 佐藤's card in 3 frames, dark; 吉田 printed; doors 3, 5 shut; windows ×", T_W1);
  S.ev("S2 whip pan to 高橋's card", T_PAN); S.mark('S2 whip pan end', T_PAN_END, 'half');
  S.ev(`S3 step in (x${S3_STEP_Z})`, S3_STEP); S.mark('S3 eased push to x1.08 start', K(473));
  S.ev('wave 2: 高橋 (the print lands on his card in 2 frames), 田中, the first row; doors 2, 6 shut; windows ×', T_W2);
  S.ev('wave 3: lanes 1, 7, the second row; doors 1, 7 shut', T_S2B);
  S.ev('the questions hatched back into the wall', T_HATCH);
  S.mark('S4 eased push to the waist-up start', T_S4); S.mark('S4 eased push end', T_PUSH4);
  S.ev('the card leaves her hand; S4 大击: one step back (1/1.035)', T_THROW);
  [485, 486, 487].forEach(k => S.ev(`the card steps in at the lens (k${k})`, K(k)));
  S.ev('the card rushes in', K(487.5), 'half');
  S.ev('every card in the hall snaps off its clip', T_DROP);
  S.ev('the card fills the frame (segment 15 frame 1)', T_488);

  // ================================================================================================================
  // the card in flight (screen space, a true 3D card; review 2026-11-21 must 2: it must leave her hand at once). It leaves
  // R14f_throw2's open hand at its real size (15 cm) on k484 and in that first beat flies clearly away from the hand, up and in
  // towards the frame's centre while it grows (8.9% -> 16% of the frame's width); for the next two beats it floats on towards
  // the lens, drifting a little, growing to a third of the frame, always left of her face (she sings もうどうだっていいや with
  // her face in view); from k487 it rushes in, crosses her face on k487.5 and lands at k488 square to the lens on her_card.js's
  // POSTER_FRAME (1878 px wide, everything printed on the face in the frame, the timing marks below it; segment 15 holds it). Position:
  // a Catmull-Rom curve through the key points; width: a monotone curve in log scale. It tumbles (yaw, pitch, roll) out of the
  // wrist's snap and settles square; the lanyard trails BEHIND it along the way it came (never back to her); motion blur.
  // ================================================================================================================
  // the poster frame is her_card.js's POSTER_FRAME, the one set of numbers 14's flight lands on and 15 S1 holds (2026-11-21:
  // it was 2050 px / 0.076u here, which cut the band's raised right end; now the whole printed face is in the frame)
  const POSTER_W = POSTER_FRAME.width, POSTER_TOP = POSTER_FRAME.top;   // card px width; the frame's top edge in card widths
  const IMPACT = [W / 2, -POSTER_TOP * POSTER_W + POSTER_W / CARD_RATIO / 2];
  const TH = AN.rin.R14f_throw2, HAND_W = rinPlace('R14f_throw2').toWorld(partOf(PA, 'R14f_throw2', 'hand').point), HAND_WORLD = [HAND_W[0], -HAND_W[1]];
  const proj = ([ppm, cx, ch], [wx, wh]) => [W / 2 + (wx - cx) * ppm, 540 - (wh - ch) * ppm];
  // fill pass 2026-11-21 (review MUST: through the fill the card hung in mid-air, its x between 450 and 480 px, growing slowly):
  // the card's place is given in the BASE camera's screen (camS4base, without the punches and dips; renderAt moves it with
  // them). Out of the hand on k484 (from the hand at its real size, easing out over 0.55 of a beat to its first place, so it
  // has left the hand on the first frame); then three steps at the lens, one a beat on the fill's hits k485, k486, k487: each
  // a snap in four frames from the beat's frame (SNAP, a 6% overshoot in log size) and a slow drift until the next beat, the
  // card 1.30x, 1.30x, 1.36x larger each time; always left of her face and below line 53's second half on the wall; from
  // k487.5 it rushes in (its size growing exponentially, faster and faster; its place moving with its size, as a thing coming
  // at the lens does) onto the poster frame at k488. Each step kicks its yaw and roll (decaying in about 0.3 s), the wrist's
  // tumble dies out over the first beat, and all turning is gone as it lands square.
  const BASE_FR = t => Math.ceil(t * 30 - 1e-6) / 30;            // the first frame at or after t
  const camRel = camS4base(BASE_FR(T_THROW));
  const W0 = 0.15 * camRel[0];
  const H0 = proj(camRel, HAND_WORLD);
  const flyU = tt => Math.max(0, (tt - T_THROW) / (T_488 - T_THROW));
  const DEG = Math.PI / 180;
  // her face on R14f_throw2 (measured: x 900-1150 px, y 330-620 px): the card's right edge stays left of it until k487.5
  const FACE_L = [(900 - TH.cx) / TH.ppm, TH.top - 475 / TH.ppm];
  // [x, y, width] in base screen px: where each step lands (to) and where it has drifted to by the next beat (drift)
  const FLY_STEPS = [
    { t: T_THROW, to: [455, 505, 285], drift: [460, 498, 300] },
    { t: K(485), to: [480, 470, 390], drift: [482, 466, 400] },
    { t: K(486), to: [462, 500, 520], drift: [460, 498, 532] },
    { t: K(487), to: [403, 530, 720], drift: [397, 532, 735] },
  ];
  const T_RUSH = K(487.5), SNAP = [0.55, 0.92, 1.06, 1.0], OUT_T = 0.55 * BEAT;
  const lerpC = (a, b, e) => [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] * Math.pow(b[2] / a[2], e)];
  const rushS = tt => Math.min(1, Math.max(0, (tt - T_RUSH) / (T_488 - T_RUSH)));
  function cardBase(tt) {
    if (tt < T_THROW) return [H0[0], H0[1], W0];
    if (tt >= T_RUSH) { const D = FLY_STEPS[FLY_STEPS.length - 1].drift, s = rushS(tt), w = D[2] * Math.pow(POSTER_W / D[2], s * s), e = (w - D[2]) / (POSTER_W - D[2]);
      return [D[0] + (IMPACT[0] - D[0]) * e, D[1] + (IMPACT[1] - D[1]) * e, w]; }
    let i = FLY_STEPS.length - 1; while (i > 0 && tt < FLY_STEPS[i].t) i--;
    const S0 = FLY_STEPS[i], next = i + 1 < FLY_STEPS.length ? FLY_STEPS[i + 1].t : T_RUSH;
    if (i === 0) { const a = tt - T_THROW;
      return a < OUT_T ? lerpC([H0[0], H0[1], W0], S0.to, 1 - Math.pow(1 - a / OUT_T, 3)) : lerpC(S0.to, S0.drift, (a - OUT_T) / (next - T_THROW - OUT_T)); }
    const fi = fiOf(tt, S0.t); if (fi < SNAP.length) return lerpC(FLY_STEPS[i - 1].drift, S0.to, SNAP[fi]);
    const n = fiOf(next - 1e-6, S0.t) + 1;
    return lerpC(S0.to, S0.drift, Math.min(1, (fi - SNAP.length + 1) / Math.max(1, n - SNAP.length)));
  }
  // each step's kick: [beat, yaw deg, roll deg]; up over two frames, decaying (tau 0.15 s)
  // motion pass 2026-11-21: the yaw and roll kicks on the fill's steps are gone (the card filling a third of the frame read as
  // the frame turning: 第八节 no roll); the steps at the lens are size and place only
  const KICKS = [];
  const kickF = a => a < 0 ? 0 : Math.sin(Math.min(1, a / (2 * FR)) * Math.PI / 2) * Math.exp(-a / 0.15);
  function cardState(tt) {
    const [x, y, w] = cardBase(tt), u = flyU(tt), e = Math.pow(Math.max(0, 1 - u / 0.275), 1.4), calm = 1 - smooth(rushS(tt));
    let yaw = 50 * DEG * e * Math.cos(2.4 * Math.PI * u), pitch = -24 * DEG * e * Math.cos(1.8 * Math.PI * u + 0.3), roll = -28 * DEG * e * Math.cos(1.4 * Math.PI * u);
    for (const [t0, ky, kr] of KICKS) { const k = kickF(tt - t0); yaw += ky * DEG * k; roll += kr * DEG * k; pitch -= 0.4 * kr * DEG * k; }
    return { x, y, w, u, yaw: yaw * calm, pitch: pitch * calm, roll: roll * calm };
  }
  // motion pass: no punches or dips any more, so the card's base screen is the screen
  const cardShake = () => [1, 0, 0, 1, 0, 0];
  // the card's corners and a grid over it, rotated in 3D and projected (focal length 3 card widths)
  function cardGrid(st, nx = 6, ny = 4) {
    const { x, y, w, yaw, pitch, roll } = st, h = w / CARD_RATIO, f = 3 * w;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
    const P = (lx, ly) => { let X = lx, Y = ly, Z = 0;
      [X, Z] = [X * cy + Z * sy, -X * sy + Z * cy];          // yaw about the vertical axis
      [Y, Z] = [Y * cp - Z * sp, Y * sp + Z * cp];          // pitch about the horizontal axis
      [X, Y] = [X * cr - Y * sr, X * sr + Y * cr];          // roll in the picture plane
      const k = f / (f + Z); return [x + X * k, y + Y * k]; };
    const G = [];
    for (let j = 0; j <= ny; j++) { const row = []; for (let i = 0; i <= nx; i++) row.push(P((i / nx - 0.5) * w, (j / ny - 0.5) * h)); G.push(row); }
    return { G, P, h };
  }
  // an image drawn onto the projected grid, two affine triangles a cell (each grown half a pixel so no seams show)
  function drawOnGrid(ctx, im, G, alpha = 1) {
    const ny = G.length - 1, nx = G[0].length - 1, iw = im.width, ih = im.height;
    ctx.save(); ctx.globalAlpha = alpha;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const s0 = [i / nx * iw, j / ny * ih], s1 = [(i + 1) / nx * iw, j / ny * ih], s2 = [i / nx * iw, (j + 1) / ny * ih], s3 = [(i + 1) / nx * iw, (j + 1) / ny * ih];
      tri(ctx, im, [s0, s1, s2], [G[j][i], G[j][i + 1], G[j + 1][i]]);
      tri(ctx, im, [s1, s3, s2], [G[j][i + 1], G[j + 1][i + 1], G[j + 1][i]]);
    }
    ctx.restore();
  }
  function tri(ctx, im, [a, b, c], [A, B, C]) {
    const cxm = (A[0] + B[0] + C[0]) / 3, cym = (A[1] + B[1] + C[1]) / 3, grow = p => { const dx = p[0] - cxm, dy = p[1] - cym, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * 0.7, p[1] + dy / l * 0.7]; };
    const [A2_, B2, C2] = [A, B, C].map(grow);
    ctx.save(); ctx.beginPath(); ctx.moveTo(...A2_); ctx.lineTo(...B2); ctx.lineTo(...C2); ctx.closePath(); ctx.clip();
    const den = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    const m11 = ((B[0] - A[0]) * (c[1] - a[1]) - (C[0] - A[0]) * (b[1] - a[1])) / den, m12 = ((B[1] - A[1]) * (c[1] - a[1]) - (C[1] - A[1]) * (b[1] - a[1])) / den;
    const m21 = ((C[0] - A[0]) * (b[0] - a[0]) - (B[0] - A[0]) * (c[0] - a[0])) / den, m22 = ((C[1] - A[1]) * (b[0] - a[0]) - (B[1] - A[1]) * (c[0] - a[0])) / den;
    ctx.transform(m11, m12, m21, m22, A[0] - m11 * a[0] - m21 * a[1], A[1] - m12 * a[0] - m22 * a[1]);
    ctx.drawImage(im, 0, 0); ctx.restore();
  }
  // the flying card's face: her_card.js's face (the state as it was at the yank) with her words written over it as sung
  const FACES = [600, 1200, 2400].map(w => { const base = herCardFace(w), [c, x] = mk(w, w / CARD_RATIO); return { w, base, c, x }; });
  let faceKey = '';
  function faceFor(w, tt) {
    const F = FACES.find(f => f.w >= w * 1.15) || FACES[2], key = `${F.w}|${tt.toFixed(4)}`;
    if (key !== faceKey) { F.x.setTransform(1, 0, 0, 1, 0, 0); F.x.clearRect(0, 0, F.c.width, F.c.height); F.x.drawImage(F.base, 0, 0); drawHerWords(F.x, F.w, L53b, tt); faceKey = key; }
    return F.c;
  }
  // the lanyard: two strands from the clip, trailing BEHIND the card (against its screen velocity, mostly streaming out to the
  // left, away from her and her hand, and sagging): never back over her (review 2026-11-21: the strands ran back to her
  // collar and read as the card still tied to her neck). Thinner as they go, swinging a little; the two popped clasp halves at
  // their ends. Drawn before the card (behind it).
  function lanyard(tt, st, P, h) {
    const clip = P(0, -h / 2), w = st.w, prev = cardState(Math.max(T_THROW, tt - 2 * FR));
    let v = [st.x - prev.x, st.y - prev.y]; const vl = Math.hypot(...v);
    let dir = vl > 2 ? [-v[0] / vl, -v[1] / vl] : [-0.6, 0.8];
    dir = [0.35 * dir[0] + 0.65 * -0.92, 0.35 * dir[1] + 0.65 * 0.38];   // fill pass: streaming left and DOWN, clear of line 53b on the wall above the card const dl = Math.hypot(...dir); dir = [dir[0] / dl, dir[1] / dl];
    const len = 0.5 * w;
    g.save(); g.strokeStyle = TEAL; g.fillStyle = TEAL; g.lineCap = 'round';
    for (const sd of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 10; i++) { const f = i / 10, wob = Math.sin(tt * 11 + sd * 1.9 + i * 0.8) * 0.07 * len * f;
        const spread = sd * 0.22 * len * f * (1 - 0.3 * f);
        pts.push([clip[0] + dir[0] * len * f - dir[1] * (spread + wob), clip[1] + dir[1] * len * f + dir[0] * (spread + wob) + 0.18 * len * f * f]); }
      for (let i = 0; i < 10; i++) { g.lineWidth = Math.max(2.5, w * (0.024 - 0.012 * i / 10)); g.beginPath(); g.moveTo(...pts[i]); g.lineTo(...pts[i + 1]); g.stroke(); }
      const e = pts[10], q = pts[9], a = Math.atan2(e[1] - q[1], e[0] - q[0]), cw = 0.06 * w * 0.6;
      g.save(); g.translate(...e); g.rotate(a); g.fillRect(-cw * 0.2, -cw * 0.32, cw, cw * 0.64); g.fillStyle = rgba(PAPER_RGB, 0.45); g.fillRect(cw * 0.12, -cw * 0.12, cw * 0.5, cw * 0.24); g.restore();
    }
    g.restore();
  }
  function drawCardAt(tt, alpha) {
    const st = cardState(tt), { G, P, h } = cardGrid(st);
    const off = 0.012 * st.w, shadow = G.map(r => r.map(([x, y]) => [x + off, y + off * 1.3]));
    drawOnGrid(g, SHADOW_TILE, shadow, 0.35 * alpha);
    const edge = G.map(r => r.map(([x, y]) => [x, y + st.w * 0.004]));
    drawOnGrid(g, EDGE_TILE, edge, alpha);
    drawOnGrid(g, faceFor(st.w, tt), G, alpha);
    return { st, P, h };
  }
  const [SHADOW_TILE, sht] = mk(8, 8); sht.fillStyle = 'rgb(14,14,18)'; sht.fillRect(0, 0, 8, 8);
  const [EDGE_TILE, edt] = mk(8, 8); edt.fillStyle = rgba(TEAL_RGB, 0.65); edt.fillRect(0, 0, 8, 8);
  function flyingCard(tt) {
    if (tt < T_THROW) return;
    const st = cardState(tt);
    g.save(); g.setTransform(...cardShake(tt));
    // motion blur: two fainter copies a third and two thirds of a frame back, when the card moves fast
    const prev = cardState(Math.max(T_THROW, tt - FR)), speed = Math.hypot(st.x - prev.x, st.y - prev.y) + Math.abs(st.w - prev.w);
    if (speed > 25) for (const [dt, a] of [[2 / 3, 0.22], [1 / 3, 0.34]]) drawCardAt(Math.max(T_THROW, tt - dt * FR), a);
    if (st.w < 1500) { const { P, h } = cardGrid(st); lanyard(tt, st, P, h); }     // the strands trail behind the card
    drawCardAt(tt, 1);
    g.restore();
  }

  // ================================================================================================================
  // layout audit: the words on the wall against each other and the heads; the frame check with every camera as it moves
  // ================================================================================================================
  const MM = 1000;
  const lbox = (list, name, sheet) => { const s = list[0].size, xs = list.map(L => L.x), hs = list.map(L => L.h);
    LAY.text(name, sheet, [(Math.min(...xs) - s / 2) * MM, -(Math.max(...hs) + s * 0.55) * MM, (Math.max(...xs) - Math.min(...xs) + s) * MM, (Math.max(...hs) - Math.min(...hs) + s * 1.1) * MM]); };
  const regHeads = sheet => { ROWS.forEach(r => LAY.reg(`head ${r.k}`, sheet, headBox(r).map(v => v * MM)));
    LAY.reg('her head and bow', sheet, [-0.2 * MM, -1.68 * MM, 0.4 * MM, 0.4 * MM]); LAY.reg('clock', sheet, [(CLOCK.x - CLOCK.R) * MM, -(CLOCK.h + CLOCK.R) * MM, 2 * CLOCK.R * MM, 2 * CLOCK.R * MM]); };
  const ID = p => p;
  const viewsOf = (cam, a, b) => frameTimes(SEG[0], a, b).map(t => { const [ppm, cx, ch] = cam(t); return { t, z: ppm / MM, fx: cx * MM, fy: -ch * MM }; });
  const L51A = Q51a.map((l, i) => [l, `line 51a row ${i + 1}`]);
  lbox(Q50, 'line 50', 'wall'); L51A.forEach(([l, n]) => lbox(l, n, 'wall'));
  lbox(Q51b, 'line 51b (high wall)', 'wall'); lbox(Q52, 'line 52', 'wall'); regHeads('wall');
  LAY.audit('the wall S1-S3');
  // per shot, only the lines that are on the wall then (a written line stays until the hatching)
  const shotLines = { S1: [[Q50, 'line 50']], S2: [[Q50, 'line 50'], ...L51A],
    S2b: [[Q50, 'line 50'], ...L51A, [Q51b, 'line 51b']],
    S3: [[Q50, 'line 50'], ...L51A, [Q52, 'line 52']] };
  for (const [shot, lines] of Object.entries(shotLines)) { lines.forEach(([l, n]) => lbox(l, n, `wall${shot}`)); LAY.audit(`lines on the wall in ${shot}`); }
  LAY.frameCheck('S1 C3 push', { sheets: { wallS1: ID }, views: viewsOf(camAt, SEG[0], T_S2) });
  LAY.frameCheck('S2 card and gate', { sheets: { wallS2: ID }, views: viewsOf(camAt, T_S2, T_S2B) });
  // the things the S2 event happens on (second review 2026-11-21: the × was left below the frame, the door showed 40 px): each
  // card and the window that answers for its lane must be whole in the frame that holds it (A before the pan, B after it);
  // the doors' top edge must be at least a fifth of the frame's height above the bottom edge
  const mmBox = ([x, y, w, h]) => [x * MM, y * MM, w * MM, h * MM];
  const winBox = (cx, sd) => { const [wx, wy] = WIN(cx, sd); return [wx - 0.045, wy - 0.045, 0.09, 0.09]; };
  LAY.text("佐藤's card", 'keyS2A', mmBox(cardRect('p1'))); LAY.text('window lane 5 (佐藤)', 'keyS2A', mmBox(winBox(1.35, -1)));
  LAY.text("高橋's card", 'keyS2B', mmBox(cardRect('p3'))); LAY.text('window lane 6 (高橋)', 'keyS2B', mmBox(winBox(1.35, 1)));
  LAY.text('window lane 5 (佐藤), B', 'keyS2B', mmBox(winBox(1.35, -1)));
  LAY.audit('S2 key objects');
  LAY.frameCheck('S2 frame A key objects', { sheets: { keyS2A: ID }, views: viewsOf(camAt, T_S2, T_PAN) });
  LAY.frameCheck('S2 frame B key objects', { sheets: { keyS2B: ID }, views: viewsOf(camAt, T_W2, T_S2B) });
  { const doorShare = cam => (DOOR_HI - (cam[2] - 540 / cam[0])) * cam[0] / 1080, a = doorShare(camS2(T_S2)), b2 = doorShare(camS2(T_W2));
    console.log(`DOOR AUDIT seg_14 S2: the doors fill the lower ${(a * 100).toFixed(0)}% (frame A) and ${(b2 * 100).toFixed(0)}% (frame B) of the frame; card width ${(0.15 * S2Z / W * 100).toFixed(1)}% of the frame (${(0.15 * S2Z / W * 390).toFixed(0)} px on a 390 px phone)${a < 0.2 || b2 < 0.2 ? ' PROBLEM' : ''}`); }
  LAY.frameCheck('S2b W7', { sheets: { wallS2b: ID }, views: viewsOf(camAt, T_S2B, T_S3) });
  LAY.frameCheck('S3 push', { sheets: { wallS3: ID }, views: viewsOf(camAt, T_S3, T_S4) });
  lbox(N53a, 'line 53a', 'wall4'); lbox(N53b, 'line 53b', 'wall4'); regHeads('wall4'); LAY.audit('S4 wall');
  // the frame checks: line 53a from the hatching on; line 53b from the frame before も shows (it is not written before that)
  lbox(N53a, 'line 53a', 'wall4a'); lbox(N53b, 'line 53b', 'wall4b'); LAY.audit('S4 wall (frame sheets)');
  LAY.frameCheck('S4 steps in, steps back', { sheets: { wall4a: ID }, views: viewsOf(camAt, T_S4, T_END) });
  LAY.frameCheck('S4 line 53b from も', { sheets: { wall4b: ID }, views: viewsOf(camAt, L53b[0][1] - 2 * FR, T_END) });
  // her card face (u = 2400): the state's three lines, the card's own printed labels and her words, one layer, no overlaps
  const HCB = herCardBoxes(2400), HWB = herWordsBoxes(2400);
  for (const [n, b] of Object.entries(HCB.lines)) LAY.text(`card ${n}`, 'card', b);
  for (const [n, b] of Object.entries(HCB.labels)) LAY.text(`card label ${n}`, 'card', b);
  for (const [n, b] of Object.entries(HWB)) LAY.text(n, 'card', b);
  LAY.audit('her card face');
  // the poster frame (segment 15's first frame, her_card.js POSTER_FRAME): what is in it, in card px of a 2400 px card. Every
  // word on the face (the band as her_card.js measures its tilted ink, the title lines, her words, the header row and the
  // labels, the こころ row) wholly in; the timing marks wholly out. 15 checks every frame of its hold (the bounce, the wobble,
  // the slip); this is the landing itself.
  const PF = { top: POSTER_TOP * 2400, h: 2400 * 1080 / POSTER_W };
  for (const [n, b] of Object.entries(HCB.labels)) LAY.text(`card label ${n}`, 'poster', b);
  for (const [n, b] of Object.entries(HCB.lines)) LAY.text(`card ${n}`, 'poster', b);
  for (const [n, b] of Object.entries(HWB)) LAY.text(n, 'poster', b);
  LAY.audit('poster frame');
  LAY.text('timing marks', 'poster:out', [2400 * 0.229, 2400 * 0.618, 2400 * 0.624, 2400 * 0.026]);
  const PV = [{ t: T_488, z: POSTER_W / 2400, fx: 1200, fy: PF.top + PF.h / 2 }];
  LAY.frameCheck('poster frame (k488)', { sheets: { poster: ID }, views: PV, inset: 4 });
  LAY.frameCheck('poster frame (k488) timing marks', { sheets: { 'poster:out': ID }, views: PV, inset: -4 });
  // the flying card's projected corners (base screen px), its right edge against her face's left edge, frame by frame from the
  // release to the rush (k487.5; px, must stay > 0); and its top against line 53b's letters (CARD/LINE below)
  const cardCorners = tt => { const st = cardState(tt), { G } = cardGrid(st); return [G[0][0], G[0][G[0].length - 1], G[G.length - 1][0], G[G.length - 1][G[0].length - 1]]; };
  const cardBBox = tt => { const c = cardCorners(tt), xs = c.map(p => p[0]), ys = c.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const faceList = frameTimes(SEG[0], T_THROW, T_RUSH).map(t => [Math.round(t * 30), proj(camS4base(t), FACE_L)[0] - cardBBox(t)[2]]), faceClear = Math.min(...faceList.map(p => p[1]));
  console.log(`FLIGHT AUDIT seg_14 face margin per frame: ${faceList.map(([f, m]) => `g${f} ${m.toFixed(0)}`).join(" ")}`);
  console.log(`FLIGHT AUDIT seg_14: card right edge to her face, least margin before the rush (k487.5): ${faceClear.toFixed(0)} px`);
  { const steps = [485, 486, 487].map(k => { const a = cardBase(K(k) - 1e-6), b = cardBase(K(k) + 4 * FR); return `k${k} ${a[2].toFixed(0)}->${b[2].toFixed(0)} px wide, moved ${Math.hypot(b[0] - a[0], b[1] - a[1]).toFixed(0)} px`; });
    console.log(`FLIGHT AUDIT seg_14 steps: ${steps.join('; ')}`); }
  // the drawings' edges (third review 2026-11-21: in S2 frame B 高橋's close redraw ended at 0.82 m, inside the frame: his hands
  // cut by a straight line, the lane's light and the man behind showing under it; the frame checks only held the cards and the
  // windows). Every frame of the segment, every person drawing on screen (the town's, the close redraws, hers): each edge pixel of
  // the drawing that is opaque must be outside the frame or behind something opaque drawn over it (a cabinet, its reader, a door
  // as far as it has shut). The screened strips beside the cabinets are dots, so they do not count as cover.
  const edgeCache = new Map();
  function edgeSamples(im) {                           // opaque pixels on the four edges, every 3 px: [u, v] in drawing px
    if (edgeCache.has(im)) return edgeCache.get(im);
    const w = im.width, h = im.height, [c, x] = mk(w, h); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, w, h).data, out = [];
    const op = (xx, yy) => d[(yy * w + xx) * 4 + 3] > 40;
    for (let xx = 1; xx < w; xx += 3) { if (op(xx, 0)) out.push([xx + 0.5, 0, 'top']); if (op(xx, h - 1)) out.push([xx + 0.5, h, 'bottom']); }
    for (let yy = 1; yy < h; yy += 3) { if (op(0, yy)) out.push([0, yy + 0.5, 'left']); if (op(w - 1, yy)) out.push([w, yy + 0.5, 'right']); }
    edgeCache.set(im, out); return out;
  }
  const rounded = (r, x0, x1, h0, h1, rad) => { r.push([x0, x1, h0 + rad, h1 - rad]); r.push([x0 + rad, x1 - rad, h0, h1]); };
  const covers = tt => {                               // opaque things drawn over every person: [x0, x1, h0, h1] (m), round corners left out
    const r = [];
    for (const cx of BODIES) { rounded(r, cx - BW / 2, cx + BW / 2, -1, 1.0, 0.022); rounded(r, cx - 0.045, cx + 0.045, 0.99, 1.075, 0.008); }
    for (const i of LANES) { const f = doorF(i, tt); if (f <= 0) continue;
      for (const sd of [-1, 1]) { const root = i * LANE + sd * (LANE / 2 - BW / 2), w = DOOR_HALF * f, xa = sd < 0 ? root : root - w, rad = Math.min(0.03, w / 2);
        r.push([xa, xa + w, DOOR_LO + rad, DOOR_HI]); r.push([xa + rad, xa + w - rad, DOOR_LO, DOOR_HI]); } }
    return r;
  };
  const drawingsAt = tt => {                          // [label, image, (u, v) -> world [x, h]]
    const out = [];
    for (const r of ROWS) { const P = FIG[r.k], sc = ([wx, h]) => [r.x + (wx - r.x) * r.f, EYE + (h - EYE) * r.f];
      if (P.hi && P.hi.on(tt)) { const b = P.hi, iw = b.im.width, ih = b.im.height;
        out.push([HIRES[r.k].file, b.im, (u, v) => sc([r.x + b.x0 + u / iw * (b.x1 - b.x0), b.h1 - v / ih * (b.h1 - b.h0)])]); }
      else { const [lx, ty] = toW(P, r.x, [0, 0]); out.push([P.file, P.im, (u, v) => sc([lx + u * P.mpp, -(ty + v * P.mpp)])]); } }
    const rt = RIN_TRACK.find(([, , a, b]) => tt >= a && tt < b) || RIN_TRACK[RIN_TRACK.length - 1], n = rt[0], a = AN.rin[n], s = 1 / a.ppm;
    out.push([n, PRINTED[n].im, (u, v) => [-a.cx * s + u * s, a.top - v * s]]);
    return out;
  };
  const EDGE = {};
  for (const tt of frameTimes(SEG[0], SEG[0], SEG[1])) {
    const [ppm, cx, ch] = camAt(tt), dy = tt >= T_S2 && tt < T_S2B ? sinkPx(tt) : 0, cov = covers(tt);
    for (const [label, im, toWorld] of drawingsAt(tt)) {
      let n = 0;
      for (const [u, v, side] of edgeSamples(im)) {
        const [wx, h] = toWorld(u, v), X = W / 2 + (wx - cx) * ppm, Y = 540 - (h - ch) * ppm + dy;
        if (X < 0 || X >= W || Y < 0 || Y >= 1080) continue;
        if (cov.some(([x0, x1, h0, h1]) => wx >= x0 && wx <= x1 && h >= h0 && h <= h1)) continue;
        n++; const e = EDGE[label] ||= { frames: new Set(), sides: new Set(), t0: tt, t1: tt }; e.sides.add(side); e.t1 = tt;
      }
      if (n) EDGE[label].frames.add(Math.round(tt * 30));
    }
  }
  const edgeList = Object.entries(EDGE).map(([k, e]) => `${k} ${[...e.sides].join('/')} edge on screen in ${e.frames.size} frames (${e.t0.toFixed(2)}-${e.t1.toFixed(2)} s)`);
  console.log(`FRAME AUDIT seg_14 drawing edges: ${ROWS.length + 1} drawings a frame over ${frameTimes(SEG[0], SEG[0], SEG[1]).length} frames, ${edgeList.length ? edgeList.length + ' PROBLEM: ' + edgeList.join('; ') : '0 drawing edges on screen'}`);
  // LYRIC AUDIT (docs/制作约定.md 第六节: a sung character reads on the frame its onset falls in): for every sung character, the
  // first frame of this segment it is readable on: drawn whole (sungBuild 1), its centre inside the frame as the camera (sink,
  // punches, dips) shows it that frame, not yet hatched back, not under a flash of half or more, not under the flying card, and
  // BIG ENOUGH TO READ ON A PHONE: its em at least LYR_MIN_EM px on the 1080p frame (about 7 px on a 390 px phone, 根因清单
  // 手机 390×220). Fill pass 2026-11-21 (review MUST): the audit used to count her card's words as read whenever the card was
  // in the frame, at 6-15 px high, so 10 letters that could not be read until the card filled the frame were counted as read.
  // The wall letters by their place in metres; her words もうどうだって／いいや on the card (R14f_yank's card before the throw,
  // the flying card after it) by the card's width on screen; for line 53's second half the earlier of the wall and the card.
  const LYR_MIN_EM = 36;
  { const ALL = frameTimes(SEG[0], SEG[0], SEG[1]), entries = [];
    const onScreen = (tt, x, h) => { const [ppm, cx, ch] = camAt(tt), dy = tt >= T_S2 && tt < T_S2B ? sinkPx(tt) : 0;
      const X = W / 2 + (x - cx) * ppm, Y = 540 - (h - ch) * ppm + dy; return X > 0 && X < W && Y > 0 && Y < 1080; };
    // under the flying card: the letter's box on the base camera's screen against the card's box (the punch and dip move both alike)
    const underCard = (tt, L) => { if (tt < T_THROW) return false; const b = camS4base(tt), [X, Y] = proj(b, [L.x, L.h]), r = L.size * b[0] * 0.55, c = cardBBox(tt);
      return X + r > c[0] && X - r < c[2] && Y + r > c[1] && Y - r < c[3]; };
    const big = (tt, size) => size * camAt(tt)[0] >= LYR_MIN_EM;
    const wallRead = (L, hatched) => ALL.find(tt => sungBuild(tt - L.t) >= 1 && flashAt(tt, FLASHES) < 0.5 && onScreen(tt, L.x, L.h) && big(tt, L.size)
      && !(hatched && hatchFront(tt) >= L.d) && !underCard(tt, L)) ?? null;
    for (const L of Q) entries.push({ c: L.c, t: L.t, readT: wallRead(L, true) });
    for (const L of N53a) entries.push({ c: L.c, t: L.t, readT: wallRead(L, false) });
    // her card's width on screen (px): the drawn card in her fist (its top edge as measured, card_quads) or the flying card
    const cardPx = tt => { if (tt >= T_THROW) return cardState(tt).w;
      const n = (RIN_TRACK.find(([, , a, b]) => tt >= a && tt < b) || [])[0], Qd = QUADS[n]; if (!n || !PRINTED[n]?.onCard || !Qd) return 0;
      return Math.hypot(Qd.quad[1][0] - Qd.quad[0][0], Qd.quad[1][1] - Qd.quad[0][1]) / AN.rin[n].ppm * camAt(tt)[0]; };
    const cardEntries = L53b.map(([c, t], i) => { const em = HER_WORDS.rows[i < 7 ? 0 : 1].size;
      return { c, t, readT: ALL.find(tt => sungBuild(tt - t) >= 1 && cardPx(tt) * em >= LYR_MIN_EM) ?? null, em }; });
    const wallB = N53b.map(L => wallRead(L, false));
    L53b.forEach(([c, t], i) => { const a = wallB[i], b = cardEntries[i].readT; entries.push({ c, t, readT: a === null ? b : b === null ? a : Math.min(a, b) }); });
    const late = e => e.readT === null ? 'never' : `${Math.round(e.readT * 30) - Math.floor(e.t * 30 + 1e-6) > 0 ? '+' : ''}${Math.round(e.readT * 30) - Math.floor(e.t * 30 + 1e-6)}f`;
    const atOnset = (t, em) => { const tt = Math.floor(t * 30 + 1e-6) / 30; return (cardPx(tt) * em).toFixed(0); };
    console.log(`CARD WORDS AUDIT seg_14 (her pencil on the card alone, em >= ${LYR_MIN_EM} px): ${cardEntries.map(e => `${e.c} ${late(e)} (em ${atOnset(e.t, e.em)} px at onset)`).join(', ')}`);
    console.log(`WALL LINE 53b AUDIT seg_14 (rubbed white, em ${(N53B_SIZE * camAt(L53b[0][1])[0]).toFixed(0)}-${Math.min(...N53b.map(L => L.size * camAt(Math.floor(L.t * 30 + 1e-6) / 30)[0])).toFixed(0)} px at onset): ${N53b.map((L, i) => `${L.c} ${late({ t: L.t, readT: wallB[i] })}`).join(', ')}`);
    { const sm = Math.min(...entries.filter(e => e.readT !== null).map(e => { const L = [...Q, ...N53a, ...N53b].find(q => q.c === e.c && q.t === e.t); return L ? L.size * camAt(e.readT)[0] : Infinity; }));
      console.log(`LYRIC SIZE AUDIT seg_14: the smallest wall letter on the frame it is first read: em ${sm.toFixed(0)} px (${(sm * 390 / 1920).toFixed(1)} px on a 390 px phone)`); }
    window.__lyricAudit = { ...lyricAudit('seg_14', entries), minEmPx: LYR_MIN_EM, cardOnly: cardEntries.map(e => ({ c: e.c, t: e.t, readT: e.readT })) }; }
  // MOTION AUDIT (docs/制作约定.md 第六节「整屏运动」): every frame's camera as shown; a new shot's first frame is a cut
  const CUTS = [T_S2, T_S2B, T_S3].map(t => Math.round(Math.ceil(t * 30 - 1e-6)));
  const MOTION_R = motionAudit('seg_14', frameTimes(SEG[0], SEG[0], SEG[1]).map(t => { const [ppm, cx, ch] = camAt(t);
    return { t, z: ppm, fx: cx, fy: -ch, dy: sinkPx(t), cut: CUTS.includes(Math.round(t * 30)) }; }),
    { big: [[S1_BIG, 'k456 最终副歌第一拍的镲（单向推近一步，留一帧纸白）'], [T_THROW, 'k484 甩卡出手（画面中心的击打动作，单向退一步）']],
      whips: [[T_PAN, "k465 S2 甩镜：佐藤的卡 → 高橋的卡（半拍）"]] });
  // PART AUDIT (web/lib/parts.js): every code part on every drawing it is drawn on, against that drawing's own pixels
  { const strap = ([r, gg, b, a]) => a > 200 && gg - r > 45 && b - r > 45;             // the drawn teal strap / its outline
    const used = new Map();
    // the end on the drawn strap and the strap still there 4 px up it; where no strap is drawn (lan.under: the strand comes out
    // from under the collar or neckline) the end on that drawn edge
    for (const r of ROWS) { const P = FIG[r.k]; used.set(P.file, [P.im, P.lanEnds]); if (P.hi) used.set(HIRES[r.k].file, [P.hi.im, P.hi.lanEnds]); }
    for (const [file, [im, ends]] of used) partAudit('seg_14', file, 'lanyard stubs', { image: im, on: strap, r: 3, maxOffPct: 0,
      points: ends.flatMap(([x, y]) => PA[file].lan.under ? [[x, y]] : [[x, y], [x, y - 4]]) });
    partAudit('seg_14', 't01_p7', 'kid lanyard stubs', { image: FIG.p7.im, on: strap, r: 3, maxOffPct: 0, points: FIG.p7.kid.lanEnds.flatMap(([x, y]) => [[x, y], [x, y - 4]]) });
    // the palm in shade is darker than PIX.skin's lit skin: lit or shaded skin
    const skinAny = ([r, gg, b, a]) => a > 200 && r > 170 && r - gg >= 25 && r - gg <= 65 && gg - b >= 10 && gg - b <= 40;
    partAudit('seg_14', 'R14f_throw2', 'hand (card release)', { image: IMG.R14f_throw2, on: skinAny, r: 4, maxOffPct: 0, points: [partOf(PA, 'R14f_throw2', 'hand').point] });
    // a card corner is where two fitted sides meet: on a rounded corner that point is up to ~6 px outside the drawn paper
    for (const n of RIN_NAMES) if (QUADS[n]) partAudit('seg_14', n, 'card corners', { image: IMG[n], on: PIX.opaque, r: 8, maxOffPct: 0, points: QUADS[n].quad }); }
  const PARTS_R = partReport('seg_14');
  S.finish();
  const camScale = (cam, name) => +(cam[0] / AN.rin[name].ppm).toFixed(3);
  publishAudit(S, LAY, { scale: { c3: camScale(C3, 'R14f_grip'), s1push: camScale(camS1(T_S2 - 0.01), 'R14f_down2'), throwAtRelease: camScale(camS4(T_THROW), 'R14f_throw2'),
    stepTop: camScale(camS4(T_YANK), 'R14f_yank'), s2: Object.fromEntries(["p1", "p3"].map(k => [k, +(S2Z * (FIG[k].hi.x1 - FIG[k].hi.x0) / FIG[k].hi.im.width).toFixed(2)])), s3: camScale(S3END, 'R14f_askR'),
    town: Object.fromEntries(ROWS.map(r => [r.k, +(C3[0] * FIG[r.k].mpp * r.f).toFixed(2)])) }, poster: { width: POSTER_W, top: POSTER_TOP, center: IMPACT }, flightFaceClearPx: Math.round(faceClear), drawingEdges: edgeList, lyrics: window.__lyricAudit, motion: MOTION_R, parts: PARTS_R });

  // the flying print in S2, drawn straight into the frame at screen resolution (as in 00): for 佐藤 00 k0's flight (PFLY):
  // frame 0 as wide as 0.84 of the frame on the frame's centre, frame 1 at 2.3x its landed size 55% of the way to his card's
  // name field, frame 2 at 1.28x 88% of the way, landed on frame 3 (from then the card itself carries it); for 高橋 the light
  // slam: 1.5x and 1.2x on his card's name field, landed on frame 2
  function stampOnScreen(k, [ppm, cx, ch], dy) { const [x, y, w] = cardRect(k);
    return [W / 2 + (x + STAMP.cx * w - cx) * ppm, 540 + (y + STAMP.cy * w + ch) * ppm + dy, STAMP_EM * w * ppm]; }
  // frame 0's print is 0.62 of the frame wide over the light jacket left of the cabinet (on the black wall its dots vanished)
  const HIT0 = { w: QP('h0w', 0.62), x: QP('h0x', 0.36), y: QP('h0y', 470) };
  // The print ON a card grows about its dots' TOP-LEFT (unify-card task, the class of 03's slam: grown about its centre, 高橋's
  // light slam at 1.5x reached 0.2u to the left over his card's 氏名 label): 高橋's two slam frames and 佐藤's last flight frame
  // (1.28x, now landed on the name field) keep the landed print's top-left, so they only grow right and down, away from the
  // label column. 佐藤's first two frames are the print still flying in from the frame's centre (00 k0's flight), off the card.
  // printRect(): the print's screen box [x, y, w, h] and whether it is on the card that frame (SLAM AUDIT below)
  function printRect(k, tt, cam, dy) {
    const F = FLY[k], fi = Math.floor((tt - F.t0) / FR + 1e-6); if (fi < 0 || fi >= F.land) return null;
    const [tx, ty, em] = stampOnScreen(k, cam, dy), land = stampCrop(em, 314), lx = tx - land.w / 2, ly = ty - land.h / 2;
    let e, x, y, on = true;
    if (F.heavy && fi < 2) {
      on = false;
      if (fi === 0) { e = em * HIT0.w * W / land.w; x = HIT0.x * W; y = HIT0.y; }
      else { e = em * 2.3; x = HIT0.x * W + (tx - HIT0.x * W) * 0.55; y = HIT0.y + (ty - HIT0.y) * 0.55; }
      const pr = stampCrop(e, 314); return { pr, box: [x - pr.w / 2, y - pr.h / 2, pr.w, pr.h], on, fi };
    }
    e = em * (F.heavy ? 1.28 : fi === 0 ? 1.5 : 1.2);
    const pr = stampCrop(e, 314); return { pr, box: [lx, ly, pr.w, pr.h], on, fi };
  }
  function flyingPrint(tt, cam, dy) {
    for (const k of ['p1', 'p3']) {
      const r = printRect(k, tt, cam, dy); if (!r) continue;
      g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(r.pr.c, r.box[0], r.box[1]);
    }
  }
  // SLAM AUDIT: every frame the print is on a card, its dots' box against that card's printed labels (card.js's template, as
  // her_card.js lists them for her card) and the card's left edge, in screen px
  { const res = [];
    for (const k of ['p1', 'p3']) for (const tt of frameTimes(SEG[0], FLY[k].t0, FLY[k].t0 + FLY[k].land * FR)) {
      const cam = camAt(tt), dy = sinkPx(tt), r = printRect(k, tt, cam, dy); if (!r || !r.on) continue;
      const [x, y, w] = cardRect(k), [ppm, cx, ch] = cam, u = w * ppm, ox = W / 2 + (x - cx) * ppm, oy = 540 + (y + ch) * ppm + dy;
      const hits = Object.entries(herCardLabelBoxes(u)).filter(([, [bx, by, bw, bh]]) => r.box[0] < ox + bx + bw && ox + bx < r.box[0] + r.box[2] && r.box[1] < oy + by + bh && oy + by < r.box[1] + r.box[3]).map(([n]) => n);
      if (r.box[0] < ox) hits.push('card left edge');
      // the written name (the name field right of 氏名): only free when the field is not wiped white that frame (groundOn)
      const [nx, ny, nw, nh] = NAMEBOX.map(v => v * u), gx = ox + nx + NAME_GROUND * u, gy = oy + ny;
      if (!groundOn(k, tt) && r.box[0] < gx + nw - NAME_GROUND * u && gx < r.box[0] + r.box[2] && r.box[1] < gy + nh && gy < r.box[1] + r.box[3]) hits.push('written name');
      const over = r.box[0] + r.box[2] - (ox + u);      // ink past the card's right edge (the overshoot only; noted, not a label)
      res.push(`${k} f${Math.round(tt * 30)} x${(r.pr.w / stampCrop(stampOnScreen(k, cam, dy)[2], 314).w).toFixed(2)}${groundOn(k, tt) ? ' (name wiped)' : ''}${over > 0 ? ` ${over.toFixed(0)} px past the card's right edge` : ''}${hits.length ? ' over ' + hits.join('/') : ''}`);
    }
    const bad = res.filter(s => s.includes(' over '));
    console.log(`SLAM AUDIT seg_14: ${res.length} frames with the print on a card, ${bad.length} over a label${res.length ? ': ' + res.join('; ') : ''}`);
    window.__audit.slam = { frames: res, problems: bad.length }; }
  // pre-render the flight sizes so no frame waits on them
  for (const tt of frameTimes(SEG[0], T_W1, T_W1 + 3 * FR)) flyingPrint(tt, camAt(tt), 0);
  window.renderAt = async t => {
    const tt = t, cam = camAt(tt), rin = S.at('rin', tt), name = rin.file.split('/').pop().replace('.png', '');
    const inS2 = tt < T_S2B && tt >= T_S2, dy = inS2 ? sinkPx(tt) : 0;
    shootWorld(cam, tt, ctx => hall(ctx, tt, name), dy);
    if (inS2) {
      const dk = darkAt(tt); if (dk > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = rgba(INK_RGB, dk); g.fillRect(0, 0, W, 1080); }
      flyingPrint(tt, cam, dy);
    }
    const fl = flashAt(tt, FLASHES); if (fl > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = rgba(PAPER_RGB, fl); g.fillRect(0, 0, W, 1080); }
    flyingCard(tt);
  };
  await window.renderAt(SEG[0]);
}
