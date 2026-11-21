// Segment 03 片名・検票口 (docs/分镜/03_片名检票口.md), k40-k71, global frames [454, 798). Design 甲. Second version
// (2026-11-21), after the independent review of the first (archive/seg03_v1_before_hall_redo_20261121/): the title and the
// readers kept, her card made the film's one card everywhere, and the hall redesigned. Three shots:
//   k40-k48  the title, her own view down at her card (h03_hold, her left hand; the ground is her charcoal blazer). k40 the
//            fourth stab: ロストワン slams into the card in the 16-dot head, card and hand sink and spring back by k40.5 (one of
//            the six sinks, 改定 2). k40.5 her right hand comes in with the pencil (h03_pen); k41 it lands and writes の号哭 stroke by
//            stroke, the tip on each stroke as it is drawn (の done k42, 号 k43, 哭's last dot k44.5); it lifts on k44.5 and is out
//            of the frame on k45; k45 the camera pushes into the answer area in one beat (x2.3, settled on k46; the band leaves
//            the top of the frame), k46-k48 the title card holds (drift 1.5%): 学籍番号 ロストワン / 偏差値 の号哭 (third version,
//            2026-11-21 review MUST 2).
//   k48-k56  the two card readers side by side, from above (paper layout): lane 3 at the left, a hand of the town on every beat
//            and a name with a ○; lane 4 at the right, her hand three times (k50, k52, k54), もう一度タッチしてください each time.
//   k56-k71  the exit hall's front elevation (2D, metres, 改定 1), the same set as 14 and 15 in its paper-white state: the back
//            wall printed like a giant answer sheet (timing marks, two fields of ovals, the wainscot screen), the station clock
//            on its pole over her head, a row of exit gates. k56 the wide: she stands behind her open lane peering at her card
//            (r03_peer3); her reader's slip stands up out of its slot with もう一度 printed three times. k60 every lane's dark
//            flaps slam shut at once (2 frames, 1 frame of overshoot), the open lanes' white goes out, every indicator prints ×,
//            the frame jolts and the camera kicks one step in (x1.5): she startles (r03_flinch2). k60-k68 a slow push; k64 she
//            lets the card go (r03_drop3), it falls to her chest, turns face out and sways. k68 she looks up at us (r03_upC, the
//            close-up redraw of r03_up2), three steps in (k68, k69, k70) to her chest-up: 0.90 m (the flaps' top edge just in)
//            to 1.68 m, x2.69 from the wide.
// Her card is one card everywhere (改定 15), and this file defines it for the whole film: docs/卡面状态.md (the band inside
// the name field right of 氏名; ロストワン in the 学籍番号 rows and の号哭 in the 偏差値 rows, right of the label column; the
// grid under the title pressed down to 22% and a paper-white halo knocked out round ロストワン's dots). In the close-ups that
// face is printed over the card drawn in the drawing (everything but her hand). The face's code is web/lib/her_card.js.
// Third version (2026-11-21, review MUST 1): the halftone screen is drawn prefiltered at the scale it is shown (no moire).
// Rhythm pass (2026-11-21, the director after the full film: “cuts and motion should follow the rock song's rhythm”; work/rhythm_diag): the hall
// answers the riff instead of drifting. k57-k59 and k61-k62 the wall's answer fields are marked one row a beat (graphite, a
// stamp's 1.3 -> 1 pop), a diagonal closing in on her from both sides, each mark with a 1.5% step in (k63 a step alone); k64
// (bar line) the card drops onto her chest in 3 frames with a vertical dip and a 2% push hit; the three heavy kicks k65, k66,
// k67 are the three steps in (k67, the heaviest, is the biggest step and the swap to r03_upC: she looks up at us); k68 the
// camera stops, k69-k70 (the drums drop out) the frame is frozen on her stare, k71 the cut. The readers' pads light on every
// press (teal for the town, graphite for her). Before this the steps came on k68-k70, a bar after the kicks, and k57-k67 was a
// slow drift (archive/seg03_v3_before_rhythm_20261121/).
// Fill pass (2026-11-21 review MUST, archive/seg03_v4_before_fill_20261121/): the rhythm pass froze k68-k71, which is not a
// drop-out but the intro's loudest bar (k68's kick as strong as k67's, a sixteenth-note fill k68.25-k70.75 2-3 dB above the
// other bars' off-beats). Now: k65-k67 three kick steps (x1.05, x1.05, x1.076); k68 the bar line: the biggest step (x1.22,
// a punch) and the swap to r03_upC (改定 5: she looks up on k68); in the fill x1.06 steps on k69, k70 and 2% nudges on the
// half beats k68.5, k69.5, k70.5, to the old end frame; and her reader's slip feeds out one more もう一度 block on each half
// beat k68.5-k70.5, the tower rising beside her as she stares.
// Motion pass (2026-11-21, the director after the second cut: “screen motion can have rhythm but must not cause dizziness”; docs/制作约定.md 第六节
// 「整屏运动」; archive/seg03_v5_before_motion_20261121/): the rhythm and fill passes' frame steps, the k60 knock-down, the k64
// dip and push hit and the fill's nudges are gone (17 jolts in the second cut). The frame now moves in eased pushes (k57-k60,
// k60-k68, k68.5-k71) and jolts only three times: k45 the registered whip into the title, k60 one 1.3% step (the slam),
// k68 the 大击 (3.5%, one way: she looks up). The beats are kept inside the picture: the wall's rows marked k57-k62, the
// flaps and the × on k60, the card's drop on k64, and in the fill her reader feeding out, flashing and a pair of timing
// marks printed on the wainscot on k68 and every half beat. Code parts are drawn from art/cut/seg03_parts.json through
// each drawing's own placement (web/lib/parts.js; MOTION AUDIT and PART AUDIT at the end of the page).
// Everything comes from web/lib/: the beat and the drawings' timeline (score.js), layout and frame audit (type.js), the camera
// (camera.js), the pencil hand (hand.js), the 16-dot print (print.js), the colours (palette.js), the card printer (card.js),
// her card's face (her_card.js).
import { drawCard, cardLayout, CARD_RATIO } from '../../lib/card.js';
import { FRAME as FR, beatV, smooth, createScore, publishAudit } from '../../lib/score.js';
import { createLayout } from '../../lib/type.js';
import { createCamera, move, frameTimes, camLerp, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, placement, drawImageAt, drawPart, partAudit, endsAudit, PIX, partReport } from '../../lib/parts.js';
import { createHand } from '../../lib/hand.js';
import { print16, print16Box } from '../../lib/print.js';
import { HER_CARD, herCardBase, herCardFace, herCardLineBoxes, herCardLabelBoxes, inkLine1, line2Pos, slamAt } from '../../lib/her_card.js';
import { PAPER, PAPER_RGB, PAPER_SLIP, TEAL, TEAL_RGB, GRAPHITE, INK_RGB, HAND_SHADOW, CARD_SHADOW, FIBRE_RGB,
         GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, PENCIL_FILL, REHATCH_LIGHT_RGB, rgba } from '../../lib/palette.js';

export default async function seg03(H) {
  const { g, W, P, rng, img, rinPalImage } = H;
  const F0 = 454, F1 = 798, SEG = [F0 / 30, F1 / 30];
  const S = createScore('seg_03', { t0: SEG[0], t1: SEG[1] });
  const LAY = createLayout();
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h); return [c, c.getContext('2d')]; };
  const K = beatV;
  const T40 = SEG[0], T48 = K(48), T56 = K(56), T60 = K(60), T64 = K(64), T68 = K(68), T69 = K(69), T70 = K(70);
  const AN = await (await fetch('/art/cut/seg03_anchors.json')).json();
  // Parts drawn by code over a drawing (her card's face, the card backs, the town's name fields, the lanyard carried up, the
  // pencil tip the hand is placed by, the clip the hanging card covers): each measured on its own drawing (art/cut/
  // seg03_parts.json), drawn through that drawing's one placement, checked against its pixels (PART AUDIT, 2026-11-21:
  // 根因清单「笔芯和笔不对了……吉他弦和吉他不是一块的」). A drawing without its own anchor throws; nothing borrows another's.
  const PA = await loadPartAnchors('/art/cut/seg03_parts.json');
  const PT = (drawing, part) => partOf(PA, drawing, part);

  // ---------- shared print helpers ----------
  // The halftone screen: round dots on a 15-degree grid, anchored in user space (world metres in the hall), so it scales with
  // the camera. Review 2026-11-21 MUST 1: the old pattern was one 64 px dot minified ~20x onto ~3 px on the screen; canvas
  // patterns are sampled without prefiltering, so the wide's wainscot showed a crawling moire (11 grey levels a frame at 1/8
  // resolution against 0.14 on the plain wall). Now the tile is drawn at the scale it is shown (12 x 12 dots, the tile's
  // pixel size rounded from the current device scale, read off the context's transform), supersampled 4x and box-filtered,
  // so the pattern is sampled about 1:1 and each dot's ink is conserved: the screen reads the same at every zoom.
  const scrCache = new Map();
  function screen(ctx, cover = 0.3, pitch = 5, rgb = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 12, tpx = Math.max(12, Math.round(N * pitch * dev));
    const key = `${cover}|${rgb}|${tpx}`;
    let e = scrCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [big, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) { bx.beginPath(); bx.arc((i + 0.5) * cell, (j + 0.5) * cell, r, 0, 7); bx.fill(); }
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
  function rrect(ctx, x, y, w, h, r) { r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  const silCache = new Map();
  function silhouette(im, color) {
    if (silCache.has(im)) return silCache.get(im);
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    silCache.set(im, c); return c;
  }
  // an affine map of card space (u x u/1.5) onto a card measured in a drawing (its TL, TR, BL corners), printed (multiply)
  function onQuad(ctx, ink, u, [TL, TR, , BL]) {
    const hh = u / CARD_RATIO;
    ctx.save(); ctx.transform((TR[0] - TL[0]) / u, (TR[1] - TL[1]) / u, (BL[0] - TL[0]) / hh, (BL[1] - TL[1]) / hh, TL[0], TL[1]);
    ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(ink, 0, 0, u, hh); ctx.restore();
  }
  const cardPt = (u, [TL, TR, , BL], [px, py]) => { const hh = u / CARD_RATIO, a = px / u, b = py / hh; return [TL[0] + (TR[0] - TL[0]) * a + (BL[0] - TL[0]) * b, TL[1] + (TR[1] - TL[1]) * a + (BL[1] - TL[1]) * b]; };

  // ---------- her card (改定 15): one face everywhere ----------
  // The card state is docs/卡面状态.md; the face's code (the band, the pressed grid and halo, ロストワン with its top-left
  // anchored slam, の号哭, the label boxes) lives in web/lib/her_card.js, moved there unchanged from this file, so every
  // segment draws the same card. cardBase(u, knocked) is the face before the title's ink; cardFace(u) the settled face.
  const { L1, L2 } = HER_CARD;
  const cardBase = herCardBase, cardFace = u => herCardFace(u);
  const lineBoxes = u => herCardLineBoxes(u), cardLabels = u => herCardLabelBoxes(u);
  // A card face printed over the card drawn in a drawing (mapped by its corners), everywhere except her hand: the skin and a
  // 4 px ring round it (its outline) stay as drawn, so a thumb resting on the card stays on top. The face's own cut-out (the
  // holder slot) leaves the drawing's slot and lanyard as drawn.
  function printFace(im, quad, face) {
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const [, fx] = mk(im.width, im.height), u = face.width, [TL, TR, , BL] = quad, hh = u / CARD_RATIO;
    fx.setTransform((TR[0] - TL[0]) / u, (TR[1] - TL[1]) / u, (BL[0] - TL[0]) / hh, (BL[1] - TL[1]) / hh, TL[0], TL[1]); fx.drawImage(face, 0, 0);
    const w = c.width, h = c.height, d = x.getImageData(0, 0, w, h), f = fx.getImageData(0, 0, w, h).data;
    const skin = new Uint8Array(w * h), hand = new Uint8Array(w * h), R = 4;
    for (let i = 0; i < w * h; i++) { const o = i * 4, r = d.data[o], gg = d.data[o + 1], b = d.data[o + 2]; if (d.data[o + 3] > 40 && r > 150 && r - b > 25 && r >= gg) skin[i] = 1; }
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) { if (!skin[y * w + xx]) continue;
      for (let dy = -R; dy <= R; dy++) { const yy = y + dy; if (yy < 0 || yy >= h) continue; for (let dx = -R; dx <= R; dx++) { const x2 = xx + dx; if (x2 >= 0 && x2 < w) hand[yy * w + x2] = 1; } } }
    for (let i = 0; i < w * h; i++) { const o = i * 4, a = f[o + 3] / 255; if (!a || hand[i]) continue;
      d.data[o] = d.data[o] * (1 - a) + f[o] * a; d.data[o + 1] = d.data[o + 1] * (1 - a) + f[o + 1] * a; d.data[o + 2] = d.data[o + 2] * (1 - a) + f[o + 2] * a; }
    x.putImageData(d, 0, 0); return c;
  }
  // The card-face audit: the lines and the card's own labels registered in card space (u = 1000) and checked against each
  // other and against the card's printable area (inside the corner marks), and the ink actually drawn measured line by line:
  // a line that does not fully land on the card shows as a missing or narrow ink band.
  const CU = 1000, CH = CU / CARD_RATIO;
  for (const [n, b] of Object.entries(lineBoxes(CU))) LAY.text(`card ${n}`, 'cardface', b);
  for (const [n, b] of Object.entries(cardLabels(CU))) LAY.text(`card label ${n}`, 'cardface', b);
  LAY.audit('card face');
  LAY.frameCheck('card face inside the card', { sheets: { cardface: p => p }, views: [{ t: 0, z: 1, fx: CU / 2, fy: CH / 2 }], W: CU, H: CH, inset: CU * 0.035 });
  const inkAudit = (() => {
    const ink = cardFace(CU), d = ink.getContext('2d').getImageData(0, 0, ink.width, ink.height).data;
    const band = ([, y, , h]) => { let a = ink.width, b = -1, n = 0; for (let yy = Math.max(0, Math.floor(y)); yy < y + h; yy++) for (let xx = 0; xx < ink.width; xx++) { const o = (yy * ink.width + xx) * 4; if (d[o + 3] > 200 && d[o] < 70 && d[o + 1] < 70 && d[o + 2] < 80) { n++; if (xx < a) a = xx; if (xx > b) b = xx; } } return { x0: a, x1: b, n }; };
    // the band's raised-end step boxes (her_card.js registers the tilted band's right end in steps for the overlap audits) are
    // parts of the band line, not lines of their own: their ink is the band's, checked once on the band's own box
    const res = Object.entries(lineBoxes(CU)).filter(([name]) => !/\(raised /.test(name)).map(([name, box]) => { const bnd = band(box);
      return { name, ink: [bnd.x0, bnd.x1], n: bnd.n, expect: [Math.round(box[0]), Math.round(box[0] + box[2])],
               ok: bnd.n > 300 && bnd.x0 >= CU * 0.035 && bnd.x1 <= CU * 0.965 && bnd.x0 <= box[0] + CU * 0.03 && bnd.x1 >= box[0] + box[2] - CU * 0.06
                   && (name !== '読み取れません' || bnd.x0 > CU * 0.13) }; });          // the band clear of the 氏名 label (ends 0.125u)
    const bad = res.filter(r => !r.ok);
    console.warn(`CARD INK AUDIT: ${res.length} lines, ${bad.length} not fully on the card${bad.length ? ': ' + bad.map(r => `${r.name} ink ${r.ink} expected ${r.expect} (${r.n} px)`).join('; ') : ''} [ink x at u=1000: ${res.map(r => `${r.name} ${r.ink}`).join(', ')}]`);
    return { lines: res, problems: bad.length };
  })();
  // The slam frames, frame by frame (review MUST, round 3; 根因清单: 有分支状态的效果要逐帧看完它生效的整段窗口): the card
  // face above was checked on the settled card only, so the hit frame, where ロストワン lands 22% large, was never checked
  // against the labels. Every frame from the hit (k40, frame 454) to past the half beat (at least 454-460) is printed here as
  // the page draws it (inkLine1 with slam, same age), its ink measured, and the measured box registered with the card's labels
  // and the band on that frame's own sheet, so the overlap audit and the inside-the-card check see each frame. The ink is
  // also counted pixel by pixel inside each label block, and its left edge must keep 0.01u of paper right of the label
  // column (0.19u).
  const slamAudit = (() => {
    const times = frameTimes(SEG[0], T40, Math.max(K(40.5), T40 + 7 * FR) + 1e-6), labels = cardLabels(CU), band = lineBoxes(CU)['読み取れません'];
    const [c, x] = mk(CU, Math.ceil(CH)), rows = [];
    for (const t of times) {
      const fno = Math.round(t * 30), sheet = `cardface@${fno}`, age = t - T40;
      x.clearRect(0, 0, c.width, c.height); inkLine1(x, CU, age, true);
      const d = x.getImageData(0, 0, c.width, c.height).data, ink = (xx, yy) => { const o = (yy * c.width + xx) * 4; return d[o + 3] > 200 && d[o] < 70 && d[o + 1] < 70 && d[o + 2] < 80; };
      let x0 = c.width, x1 = -1, y0 = c.height, y1 = -1;
      for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++) if (ink(xx, yy)) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      const onLabels = {};
      for (const [n, [bx, by, bw, bh]] of Object.entries(labels)) { let k = 0; for (let yy = Math.max(0, Math.floor(by)); yy < Math.min(c.height, by + bh); yy++) for (let xx = Math.max(0, Math.floor(bx)); xx < Math.min(c.width, bx + bw); xx++) if (ink(xx, yy)) k++; if (k) onLabels[n] = k; }
      LAY.text(`card ロストワン f${fno}`, sheet, [x0, y0, x1 - x0 + 1, y1 - y0 + 1]);
      LAY.text(`card 読み取れません f${fno}`, sheet, band);
      for (const [n, b] of Object.entries(labels)) LAY.text(`card label ${n} f${fno}`, sheet, b);
      rows.push({ f: fno, scale: +slamAt(age, true).toFixed(3), ink: [x0, x1, y0, y1], onLabels, ok: x1 >= 0 && x0 >= CU * 0.20 && !Object.keys(onLabels).length });
    }
    const ov = LAY.audit('card face, slam frames (k40-k40.5, each frame its own sheet)');
    const sheets = Object.fromEntries(rows.map(r => [`cardface@${r.f}`, p => p]));
    LAY.frameCheck('card face inside the card, slam frames', { sheets, views: [{ t: 0, z: 1, fx: CU / 2, fy: CH / 2 }], W: CU, H: CH, inset: CU * 0.035 });
    const bad = rows.filter(r => !r.ok);
    console.warn(`CARD SLAM AUDIT: ${rows.length} frames (${rows[0].f}-${rows[rows.length - 1].f}), ${bad.length} with ロストワン on a label or left of 0.20u, ${ov.length} box overlaps [u=1000: ${rows.map(r => `f${r.f} x${r.scale} ink x ${r.ink[0]}-${r.ink[1]} y ${r.ink[2]}-${r.ink[3]}${Object.keys(r.onLabels).length ? ' ON ' + JSON.stringify(r.onLabels) : ''}`).join('; ')}]`);
    return { frames: rows, problems: bad.length + ov.length };
  })();

  // ---------- the drawings (art/cut, Codex) ----------
  const ART = { hold: '/art/cut/h03_hold.png', pen: '/art/cut/h03_pen.png', rin: '/art/cut/h03_tap_rin.png',
    peer: '/art/cut/r03_peer3.png', flinch: `/art/cut/${AN.files.flinch}.png`, drop: '/art/cut/r03_drop3.png', up: '/art/cut/r03_upC.png',
    p1: '/art/cut/h03_tap_p1.png', p3: '/art/cut/h03_tap_p3.png', p6: '/art/cut/h03_tap_p6.png', p7: '/art/cut/h03_tap_p7.png', p8: '/art/cut/h03_tap_p8.png' };
  const IMG = {};
  for (const [k, f] of Object.entries(ART)) { const im = await img(f); IMG[k] = /^p\d$/.test(k) ? im : rinPalImage(im); }
  const PEOPLE = [['p1', '佐藤 健太', 48], ['p3', '高橋 正男', 49], ['p6', '山本 さくら', 50], ['p7', '小林 そうた', 51], ['p8', '加藤 大輔', 52]];

  // =====================================================================================================================
  // the drawings' timeline and the events
  // =====================================================================================================================
  S.hold('shot', 'shot title (her view down at her card)', T40, T48, { kind: 'shot' });
  S.hold('shot', 'shot readers (from above)', T48, T56, { kind: 'shot' });
  S.hold('shot', 'shot hall (front elevation)', T56, SEG[1], { kind: 'shot' });
  // the title
  S.hold('card hand', 'h03_hold (her left hand, her card)', T40, T48, { kind: 'key', file: ART.hold, onBeat: false });
  S.ev('ロストワン printed (slam), card and hand sink', T40);
    const PEN_IN = S.ev('pencil hand comes in', K(40.5), 'half'), PEN_ON = S.ev('pencil lands, の begins', K(41));
  const CHAR_T = [[K(41), S.ev('の written, 号 begins', K(42))], [K(42), S.ev('号 written, 哭 begins', K(43))], [K(43), S.ev('哭 written (last dot), pencil lifts', K(44.5), 'half')]];
  S.mark('哭 reaches 犬 (bar line)', K(44));
  const PEN_OUT = S.ev('pencil hand out of the frame', K(45));
  S.hold('pen hand', 'h03_pen (writing の号哭)', PEN_IN, PEN_OUT, { kind: 'key', file: ART.pen, onBeat: false });
  // review MUST 2: the title's three beats are a title card. On k45 (the pencil out) the camera pushes into the answer area in
  // one beat (fast out of the gate, settling on k46), the band leaving the top of the frame; k46-k48 the title holds, a slow
  // drift of 1.5% keeping it alive
  const T_TIN = K(45), T_TSET = K(46);
  move(S, 'title push into the answer area', T_TIN, T_TSET);
  move(S, 'title drift', T_TSET, T48);
  // the readers
  const HL = PEOPLE.map(([k, name, b]) => {
    const tin = b === 48 ? T48 : S.ev(`hand ${k} in`, K(b - 0.5), 'half'), tp = S.ev(`hand ${k} press, ${name} ○`, K(b)), tl = S.ev(`hand ${k} lifts`, K(b + 0.5), 'half');
    S.hold(`hand ${k}`, `hand ${k} (${name})`, tin, K(b + 1), { kind: 'key', file: ART[k], onBeat: false, person: true });
    return { k, name, b, tin, tp, tl, tout: K(b + 1) };
  });
  const RIN_IN = K(49), RIN_HOVER = S.ev('her hand hovers', K(49.5), 'half');
  const RP = [50, 52, 54].map((b, i) => ({ t: S.ev(`her press ${i + 1}, もう一度`, K(b)), tl: S.ev(`her lift ${i + 1}`, K(b + 0.5), 'half') }));
  const RIN_BACK = S.ev('her hand goes back', K(55)), RIN_OUT = S.ev('her hand out', K(55.5), 'half');
  S.hold('hand rin', 'her hand (h03_tap_rin)', RIN_IN, RIN_OUT, { kind: 'key', file: ART.rin, onBeat: false });
  S.ev('her hand in', RIN_IN);
  // the hall: four drawings, one an act (peers at the card, startled by the slam, lets it go, looks at us)
  S.hold('rin', 'r03_peer3 (peers at her card)', T56, T60, { kind: 'key', file: ART.peer, onBeat: false });
  S.hold('rin', `${AN.files.flinch} (the slam startles her)`, T60, T64, { kind: 'key', file: ART.flinch });
  // fill pass (2026-11-21 review): the look up lands on the bar line k68 (改定 5), the first beat of the intro's loudest bar,
  // a sixteenth-note fill k68-k71 (measured on the no_vocals stem: k68's kick as strong as k67's, every sixteenth of
  // k68.25-k70.75 2-3 dB above the other bars' off-beats; the drums do not drop out). r03_drop3 holds k64-k68 (4 beats),
  // r03_upC k68-k71 (3 beats). k65-k67 three kick steps, k68 the biggest step with the swap, k69/k70 steps, and her reader
  // feeds out another もう一度 on every half beat of the fill (k68.5-k70.5)
  const T65 = K(65), T66 = K(66), T67 = K(67);
  S.hold('rin', 'r03_drop3 (lets the card go)', T64, T68, { kind: 'key', file: ART.drop });
  S.hold('rin', 'r03_upC (looks at us, empty and hurt; r03_up2 at close-up resolution)', T68, SEG[1], { kind: 'key', file: ART.up });
  S.ev('the flaps slam shut (a dark band), × printed, she startles; the frame steps in 1.3% (the one ordinary jolt)', T60);
  S.ev('the card drops onto her chest (3 frames; the frame does not move)', T64);
  // the wall's answer fields marked one row a beat, each with a small step in (k63 a step alone)
  const MARKS = [[57, 4, 4], [58, 3, 3], [59, 2, 2], [61, 1, 1], [62, 0, 1]].map(([b, ri, j]) => ({ t: S.ev(`wall row ${ri} marked (column ${j})`, K(b)), ri, j }));
  S.ev('bar line: she looks up at us, the 大击 (3.5% step in, one way)', T68);
  // her reader keeps printing: the slip standing out of its slot feeds out one more もう一度 block on each half beat of the
  // fill (a small print action, 2 frames of paper feed); the tower grows beside her while she stares at us
  // motion pass: the fill lives inside the picture, not in the frame: on each of these half beats her reader also flashes and
  // a pair of the wall's timing marks prints beside her, outwards from her (TMARKS)
  const FEEDS = [68.5, 69, 69.5, 70, 70.5].map(b => S.ev(`fill: her reader feeds out another もう一度, flashes; a pair of timing marks printed`, K(b), b % 1 ? 'half' : 'beat'));

  // =====================================================================================================================
  // k40-k48 the title
  // =====================================================================================================================
  const HS = AN.hold.scale, HPOS = AN.hold.pos;                                            // h03_hold drawn at HS from HPOS
  const P_HOLD = placement({ x: HPOS[0], y: HPOS[1], s: HS });                             // h03_hold's px -> the screen (unpushed)
  const TQ = PT('h03_hold', 'card').quad.map(P_HOLD.toWorld);                              // the card on the screen (unpushed)
  const TC = [(TQ[0][0] + TQ[2][0]) / 2, (TQ[0][1] + TQ[2][1]) / 2];                       // its centre: the push's fixed point
  // The card face and the title's ink are drawn at u = 2400, straight onto the screen through the card's measured corners, so
  // the push into the answer area (x2.3, the card ~2090 px wide) stays sharp; the drawing keeps only her hand on top (the skin
  // and a 4 px ring, as printFace keeps it), so the thumb resting on the card's edge stays in front of the face.
  const TU = 2400;
  const toScreen = p => cardPt(TU, TQ, p);
  const FACE_PRE = cardBase(TU, false), FACE_K = cardBase(TU, true);
  IMG.holdHand = (() => {
    const im = IMG.hold, [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const w = c.width, h = c.height, d = x.getImageData(0, 0, w, h), skin = new Uint8Array(w * h), keep = new Uint8Array(w * h), R = 4;
    for (let i = 0; i < w * h; i++) { const o = i * 4, r = d.data[o], gg = d.data[o + 1], b = d.data[o + 2]; if (d.data[o + 3] > 40 && r > 150 && r - b > 25 && r >= gg) skin[i] = 1; }
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) { if (!skin[y * w + xx]) continue;
      for (let dy = -R; dy <= R; dy++) { const yy = y + dy; if (yy < 0 || yy >= h) continue; for (let dx = -R; dx <= R; dx++) { const x2 = xx + dx; if (x2 >= 0 && x2 < w) keep[yy * w + x2] = 1; } } }
    // only pixels on the card need the mask; off the card the drawing is drawn whole underneath anyway
    for (let i = 0; i < w * h; i++) if (!keep[i]) d.data[i * 4 + 3] = 0;
    x.putImageData(d, 0, 0); return c;
  })();
  // the title camera: identity until k45, then a push (log-even zoom, the title's centre travelling straight) to the answer
  // area: x 0.062-0.872u (the label column's blocks run off the left edge past the corner mark, her thumb out), y 0.207-0.663u (the band's
  // ink ends at 0.202u, the card's bottom edge at 0.667u): 学籍番号 ロストワン / 偏差値 の号哭, こころ and the timing marks under
  const Z_TITLE = 1920 / (0.81 * Math.hypot(TQ[1][0] - TQ[0][0], TQ[1][1] - TQ[0][1]));
  const T_FOCUS = toScreen([TU * 0.467, TU * (0.207 + 0.405 * 1080 / 1920)]);     // the frame's centre once pushed (unpushed px)
  const T_TGT = toScreen([TU * 0.52, TU * 0.41]);                                // the title block's centre
  function titleCam(tt) {
    if (tt < T_TIN) return [1, W / 2, 540];
    const u = Math.min(1, (tt - T_TIN) / (T_TSET - T_TIN)), e = 1 - Math.pow(1 - u, 3);
    const [z, fx, fy] = camLerp(1, [W / 2, 540], Z_TITLE, T_FOCUS, e, T_TGT);
    const drift = tt > T_TSET ? 1 + 0.015 * smooth((tt - T_TSET) / (T48 - T_TSET)) : 1;
    return [z * drift, fx, fy];
  }
  const PEN = await createHand({ name: 'h03_pen', image: IMG.pen, W, H: 1080, tip: PT('h03_pen', 'tip').point });
  const PEN_S = AN.pen.scale;
  // the ground: her blazer past the card (one flat charcoal tone, a faint twill)
  const [GROUND, gx] = mk(W, 1080);
  {
    gx.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 1); gx.fillRect(0, 0, W, 1080);
    gx.strokeStyle = rgba(GRAPHITE_DARK_RGB, 0.10); gx.lineWidth = 1.2;
    for (let x = -1100; x < W; x += 7) { gx.beginPath(); gx.moveTo(x, 1080); gx.lineTo(x + 1080 * 0.9, 0); gx.stroke(); }
    const r = rng(304); for (let i = 0; i < 1800; i++) { gx.fillStyle = rgba(PAPER_RGB, 0.012 + r() * 0.02); gx.fillRect(r() * W, r() * 1080, 1 + r() * 6, 1); }
  }
  // her strokes, in the order she writes them (em box: x 0..1 across the character's advance, y 0..1 down the em square centred
  // on the line's middle). Each pixel of the glyph shows when the pencil passes its nearest point on these paths.
  const STROKES = {
    'の': [[[0.52, 0.22], [0.50, 0.45], [0.42, 0.68], [0.30, 0.80], [0.18, 0.74], [0.14, 0.55], [0.24, 0.34], [0.45, 0.22], [0.66, 0.24], [0.82, 0.38], [0.84, 0.58], [0.72, 0.76], [0.52, 0.86]]],
    '号': [[[0.28, 0.10], [0.28, 0.38]], [[0.28, 0.10], [0.72, 0.10], [0.72, 0.38]], [[0.28, 0.37], [0.72, 0.37]], [[0.08, 0.52], [0.92, 0.52]],
           [[0.32, 0.53], [0.28, 0.68], [0.74, 0.68], [0.70, 0.86], [0.56, 0.93]]],
    '哭': [[[0.12, 0.08], [0.12, 0.34]], [[0.12, 0.08], [0.42, 0.08], [0.42, 0.34]], [[0.12, 0.33], [0.42, 0.33]],
           [[0.58, 0.08], [0.58, 0.34]], [[0.58, 0.08], [0.88, 0.08], [0.88, 0.34]], [[0.58, 0.33], [0.88, 0.33]],
           [[0.08, 0.52], [0.92, 0.52]], [[0.50, 0.40], [0.48, 0.62], [0.34, 0.80], [0.12, 0.93]], [[0.52, 0.58], [0.68, 0.76], [0.90, 0.92]], [[0.70, 0.40], [0.76, 0.47]]],
  };
  const AIR = 0.22;                                                    // em: the pencil's hop between strokes, as time
  const LINE2 = line2Pos(TU).map((p, ci) => {
    const s = p.s, emX = p.x + p.G.pad, emY = TU * L2.y - s / 2;
    const strokes = STROKES[p.ch].map(pts => { const Q = pts.map(([a, b]) => [emX + a * p.adv, emY + b * s]); const lens = [0]; for (let i = 1; i < Q.length; i++) lens.push(lens[i - 1] + Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1])); return { Q, lens, L: lens[lens.length - 1] }; });
    const G = p.G, gd = G.c.getContext('2d').getImageData(0, 0, G.w, G.h), R = new Float32Array(G.w * G.h).fill(-1);
    for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) {
      if (gd.data[(y * G.w + x) * 4 + 3] < 6) continue;
      const cx = p.x + x, cy = p.y + y; let best = 1e9, val = 0;
      strokes.forEach((st, si) => { for (let i = 1; i < st.Q.length; i++) {
        const [ax, ay] = st.Q[i - 1], [bx, by] = st.Q[i], vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1;
        const tq = Math.max(0, Math.min(1, ((cx - ax) * vx + (cy - ay) * vy) / l2)), dx = ax + vx * tq - cx, dy = ay + vy * tq - cy, d2 = dx * dx + dy * dy;
        if (d2 < best) { best = d2; val = si + (st.lens[i - 1] + tq * Math.sqrt(l2)) / (st.L || 1); } } });
      R[y * G.w + x] = val;
    }
    // the strokes' timing in the character's window: each slot is the stroke's length plus a hop (no hop before the first
    // stroke of の: the pencil has just landed there)
    const [ta, tb] = CHAR_T[ci], wts = strokes.map((st, i) => st.L / s + (ci === 0 && i === 0 ? 0 : AIR)), tot = wts.reduce((a, b) => a + b, 0);
    let acc = 0; const slots = strokes.map((st, i) => { const t0 = ta + (tb - ta) * acc / tot; acc += wts[i]; const t1 = ta + (tb - ta) * acc / tot;
      return { t0, ta: t0 + ((ci === 0 && i === 0) ? 0 : (t1 - t0) * AIR / wts[i]), t1 }; });
    const [rc, rx] = mk(G.w, G.h);
    return { ...p, strokes, R, slots, ta, tb, rc, rx, rimg: rx.createImageData(G.w, G.h), gd };
  });
  LINE2.forEach((c, i) => { if (i) c.prevEnd = LINE2[i - 1].strokes.slice(-1)[0].Q.slice(-1)[0]; });
  // a character's progress (in strokes) at tt, where the pencil tip is (card space) and how high
  function charState(c, tt) {
    const end = c.strokes[c.strokes.length - 1].Q.slice(-1)[0];
    if (tt < c.ta) return { prog: -1 };
    if (tt >= c.tb) return { prog: 1e9, tip: end, lift: 0 };
    for (let i = 0; i < c.slots.length; i++) {
      const sl = c.slots[i], st = c.strokes[i];
      if (tt >= sl.t1) continue;
      const prev = i > 0 ? c.strokes[i - 1].Q.slice(-1)[0] : (c.prevEnd || st.Q[0]);
      if (tt < sl.ta) { const u = smooth((tt - sl.t0) / (sl.ta - sl.t0)); return { prog: i, tip: [prev[0] + (st.Q[0][0] - prev[0]) * u, prev[1] + (st.Q[0][1] - prev[1]) * u], lift: 0.35 * Math.sin(Math.PI * u) }; }
      const f = (tt - sl.ta) / (sl.t1 - sl.ta), dist = f * st.L; let j = 1; while (j < st.Q.length - 1 && st.lens[j] < dist) j++;
      const seg = st.lens[j] - st.lens[j - 1] || 1, w = (dist - st.lens[j - 1]) / seg, A = st.Q[j - 1], B = st.Q[j];
      return { prog: i + f, tip: [A[0] + (B[0] - A[0]) * w, A[1] + (B[1] - A[1]) * w], lift: 0 };
    }
    return { prog: 1e9, tip: end, lift: 0 };
  }
  function drawLine2(x, tt) {
    for (const c of LINE2) {
      const st = charState(c, tt); if (st.prog < 0) continue;
      if (st.prog >= c.strokes.length) { x.drawImage(c.G.c, c.x, c.y); continue; }
      const d = c.rimg.data, src = c.gd.data;
      for (let i = 0, n = c.R.length; i < n; i++) { const v = c.R[i], o = i * 4; d[o] = src[o]; d[o + 1] = src[o + 1]; d[o + 2] = src[o + 2]; d[o + 3] = v >= 0 && v <= st.prog ? src[o + 3] : 0; }
      c.rx.putImageData(c.rimg, 0, 0); x.drawImage(c.rc, c.x, c.y);
    }
  }
  // the pencil: in from the lower right (k40.5 -> k41, landing on the first stroke), writing, lifting on k44.5, out by k45
  const PEN_REST = [W + 300, 1080 + 420];
  function penAt(tt) {
    if (tt < PEN_IN || tt >= PEN_OUT) return null;
    const first = toScreen(LINE2[0].strokes[0].Q[0]);
    if (tt < PEN_ON) { const u = smooth((tt - PEN_IN) / (PEN_ON - PEN_IN)); return { p: [PEN_REST[0] + (first[0] - PEN_REST[0]) * u, PEN_REST[1] + (first[1] - PEN_REST[1]) * u], lift: 1 - u * u }; }
    const last = LINE2[LINE2.length - 1];
    if (tt >= last.tb) { const end = toScreen(charState(last, last.tb).tip), u = smooth((tt - last.tb) / (PEN_OUT - last.tb));
      return { p: [end[0] + (PEN_REST[0] - end[0]) * u, end[1] + (PEN_REST[1] - end[1]) * u], lift: Math.min(1, u * 3) }; }
    for (const c of LINE2) if (tt < c.tb) { const st = charState(c, tt); return { p: toScreen(st.tip), lift: st.lift }; }
    return null;
  }
  // the k40 sink: the card and hand are pressed down by the print and stay there (px from the hit's frame). Motion pass
  // (2026-11-21): the card and hand fill ~40% of the frame, so the old 20 px drop and spring back by the half beat read as a
  // whole-frame there-and-back (motion_fit measured it as a 1.05% jolt); now one way, 9 px, a 5% overshoot, then still
  const SINK = [6, 9.5, 9];
  const sinkAt = tt => { if (tt < T40) return 0; const f = Math.round((tt - T40) * 30); return SINK[Math.min(SINK.length - 1, f)]; };
  const [INK, ix] = mk(TU, TU / CARD_RATIO);
  // the lanyard's columns where h03_hold's top edge cuts it (drawing px), carried straight up past the frame's top by code
  const STRAP = PT('h03_hold', 'strap').ends, STRAP_TOP = (-240 - HPOS[1]) / HS;
  // a card-space canvas (u wide) drawn through the card's corners on the screen
  function onCard(ctx, c, u = TU) {
    const [TL, TR, , BL] = TQ, hh = u / CARD_RATIO;
    ctx.save(); ctx.transform((TR[0] - TL[0]) / u, (TR[1] - TL[1]) / u, (BL[0] - TL[0]) / hh, (BL[1] - TL[1]) / hh, TL[0], TL[1]);
    ctx.drawImage(c, 0, 0, u, hh); ctx.restore();
  }
  function drawTitle(tt) {
    const [z, fx, fy] = titleCam(tt), dy = sinkAt(tt);
    g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.save(); g.translate(W / 2, 540); g.scale(z, z); g.translate(-fx, -fy);
    g.drawImage(GROUND, 0, 0);
    g.save(); g.translate(12, 18 + dy * 0.4); drawImageAt(g, P_HOLD, silhouette(IMG.hold, CARD_SHADOW)); g.restore();
    g.translate(0, dy);
    // the lanyard carried up: the drawing's own row at the measured ends, stretched up, through the drawing's placement
    drawPart(g, P_HOLD, c => { const [[x0, y0], [x1]] = STRAP; c.drawImage(IMG.hold, x0, y0, x1 - x0, 1, x0, STRAP_TOP, x1 - x0, y0 - STRAP_TOP + 1); });
    drawImageAt(g, P_HOLD, IMG.hold);
    // the face: the grid is pressed and ロストワン's halo knocked out as the head sweeps across (print16's three-frame build)
    const f = Math.min(1, ((tt - T40) / FR + 1) / 3);
    if (f >= 1) onCard(g, FACE_K);
    else { onCard(g, FACE_PRE); g.save(); const [TL, TR, , BL] = TQ, hh = TU / CARD_RATIO;
      g.transform((TR[0] - TL[0]) / TU, (TR[1] - TL[1]) / TU, (BL[0] - TL[0]) / hh, (BL[1] - TL[1]) / hh, TL[0], TL[1]);
      g.beginPath(); g.rect(0, 0, TU * (L1.x - 0.01 + f * 0.72), hh); g.clip(); g.drawImage(FACE_K, 0, 0); g.restore(); }
    ix.clearRect(0, 0, INK.width, INK.height);
    inkLine1(ix, TU, tt - T40, true); drawLine2(ix, tt);
    onQuad(g, INK, TU, TQ);
    drawImageAt(g, P_HOLD, IMG.holdHand);
    const pn = penAt(tt); if (pn) PEN.draw(g, pn.p[0], pn.p[1], pn.lift, PEN_S);
    g.restore();
  }
  // The title's frame audit, through the camera: the title lines over every frame; the band only where the camera holds (k40-
  // k45 whole in the frame, k46-k48 wholly out above it; while the camera moves it is meant to cross the edge); the card's
  // labels as regions (a label cut by the frame is noted, so the pushed frame's left edge can be checked against 学籍番号).
  {
    const tl = b => { const a = toScreen([b[0], b[1]]), c = toScreen([b[0] + b[2], b[1] + b[3]]); return [a[0], a[1], c[0] - a[0], c[1] - a[1]]; };
    for (const [n, b] of Object.entries(lineBoxes(TU))) LAY.text(`title ${n}`, n === '読み取れません' ? 'title:band' : 'title', tl(b));
    for (const [n, b] of Object.entries(cardLabels(TU))) LAY.reg(`title card label ${n}`, 'title:label', tl(b));
    LAY.audit('title');
    const view = t => { const [z, fx, fy] = titleCam(t); return { t, z, fx, fy }; };
    LAY.frameCheck('title', { sheets: { title: p => p }, views: frameTimes(SEG[0], T40, T48).map(view) });
    LAY.frameCheck('title band (camera held)', { sheets: { 'title:band': p => p }, views: [...frameTimes(SEG[0], T40, T_TIN), ...frameTimes(SEG[0], T_TSET, T48)].map(view) });
    LAY.frameCheck('title card labels (pushed)', { sheets: { 'title:label': p => p }, views: frameTimes(SEG[0], T_TSET, T48).map(view) });
  }

  // =====================================================================================================================
  // k48-k56 the readers from above (screen space, the camera does not move)
  // =====================================================================================================================
  const SLOT_Y = 430, PAD_Y = 742, SLIP_W = 540;
  const SIDES = { L: 480, R: 1440 };
  const HAND_S = 430 / AN.handCardW;                                   // one size for every hand: the card 430 px wide
  const [BASE, bs] = mk(W, 1080);
  {
    bs.fillStyle = PAPER; bs.fillRect(0, 0, W, 1080);
    const r = rng(303); for (let i = 0; i < 2600; i++) { bs.fillStyle = rgba(FIBRE_RGB, 0.02 + r() * 0.03); bs.fillRect(r() * W, r() * 1080, 2 + r() * 9, 1); }
    bs.fillStyle = screen(bs, 0.42, 5); bs.fillRect(930, 0, 60, 1080);
    bs.strokeStyle = TEAL; bs.lineWidth = 4; for (const x of [930, 990]) { bs.beginPath(); bs.moveTo(x, 0); bs.lineTo(x, 1080); bs.stroke(); }
    for (const [s, cx] of Object.entries(SIDES)) {
      bs.strokeStyle = TEAL; bs.lineWidth = 3; bs.strokeRect(cx - 440, 24, 880, 1032);
      for (const [x, y] of [[cx - 420, 44], [cx + 420, 44], [cx - 420, 1036], [cx + 420, 1036]]) { bs.beginPath(); bs.arc(x, y, 7, 0, 7); bs.stroke(); bs.beginPath(); bs.moveTo(x - 5, y); bs.lineTo(x + 5, y); bs.stroke(); }
      bs.fillStyle = TEAL; bs.fillRect(cx - 410, 60, 96, 110);
      bs.fillStyle = PAPER; bs.font = '700 84px ZenKakuB'; bs.textAlign = 'center'; bs.textBaseline = 'middle'; bs.fillText(s === 'L' ? '3' : '4', cx - 362, 118);
      LAY.reg(`lane number ${s}`, 'cu', [cx - 410, 60, 96, 110]);
      bs.fillStyle = screen(bs, 0.25, 5); bs.fillRect(cx - 320, SLOT_Y - 26, 640, 52);
      bs.strokeStyle = TEAL; bs.lineWidth = 3; bs.strokeRect(cx - 320, SLOT_Y - 26, 640, 52);
      bs.fillStyle = GRAPHITE; bs.fillRect(cx - SLIP_W / 2 - 14, SLOT_Y - 5, SLIP_W + 28, 10);
      bs.strokeStyle = TEAL; for (const [rr, lw] of [[262, 10], [228, 4], [200, 3]]) { bs.lineWidth = lw; bs.beginPath(); bs.arc(cx, PAD_Y, rr, 0, 7); bs.stroke(); }
      bs.fillStyle = rgba(TEAL_RGB, 0.1); bs.beginPath(); bs.arc(cx, PAD_Y, 200, 0, 7); bs.fill();
      bs.setLineDash([14, 10]); bs.lineWidth = 3; bs.strokeRect(cx - 232, PAD_Y - 155, 464, 310); bs.setLineDash([]);
      bs.lineWidth = 3; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { bs.beginPath(); bs.ellipse(cx + 318 + c * 42, 690 + r * 40, 15, 10, 0, 0, 7); bs.stroke(); }   // the canon's oval keys
      bs.fillStyle = TEAL; bs.font = '500 26px ZenKaku'; bs.textAlign = 'left';
      ['カードを', 'タッチして', 'ください'].forEach((t, i) => bs.fillText(t, cx + 290, 880 + i * 36));
      LAY.text(`instruction ${s}`, 'cu', [cx + 290, 864, 140, 104]);
      bs.fillStyle = TEAL; bs.beginPath(); bs.moveTo(cx - 362, 260); bs.lineTo(cx - 392, 300); bs.lineTo(cx - 332, 300); bs.closePath(); bs.fill(); bs.fillRect(cx - 372, 300, 20, 60);
    }
  }
  const feed = t => (t >= -1e-6 ? 1 : 0);
  const LH = 78, RH = 128;
  const LEFT_ROWS = HL.map(h => ({ t: h.tp, name: h.name }));
  const RIGHT_ROWS = RP.map(p => ({ t: p.t }));
  function slip(ctx, cx, rows, rowH, tt, base, drawRow) {
    let len = base; for (const rw of rows) len += rowH * feed(tt - rw.t);
    const top = SLOT_Y - len;
    ctx.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.10); ctx.fillRect(cx - SLIP_W / 2 + 8, top + 10, SLIP_W, len - 10);
    ctx.fillStyle = PAPER_SLIP; ctx.beginPath(); ctx.moveTo(cx - SLIP_W / 2, SLOT_Y);
    ctx.lineTo(cx - SLIP_W / 2, top + 8); for (let i = 0; i <= 30; i++) ctx.lineTo(cx - SLIP_W / 2 + i * SLIP_W / 30, top + (i % 2 ? 0 : 9));
    ctx.lineTo(cx + SLIP_W / 2, SLOT_Y); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(cx - SLIP_W / 2, 0, SLIP_W, SLOT_Y - 6); ctx.clip();
    rows.forEach((rw, i) => {
      if (tt < rw.t) return;
      let after = 0; for (let j = i + 1; j < rows.length; j++) after += feed(tt - rows[j].t);
      drawRow(ctx, rw, SLOT_Y - 26 - rowH / 2 - after * rowH, tt - rw.t, i);
    });
    ctx.restore();
  }
  const nameRow = (ctx, rw, y, age, i) => {
    const k = 3.0, bx = SIDES.L - SLIP_W / 2 + 34, b = print16Box(rw.name, 0, 0, k);
    print16(ctx, rw.name, bx + b[2] / 2, y, k, age, 70 + i);
    print16(ctx, '○', SIDES.L + SLIP_W / 2 - 70, y, 4.4, age, 80 + i);
  };
  const againRow = (ctx, rw, y, age, i) => {
    print16(ctx, 'もう一度', SIDES.R, y - 33, 3.2, age, 90 + i * 2);
    print16(ctx, 'タッチしてください', SIDES.R, y + 33, 3.2, age, 91 + i * 2);
  };
  LEFT_ROWS.forEach((rw, i) => { const y = SLOT_Y - 26 - LH / 2 - (LEFT_ROWS.length - 1 - i) * LH, bx = SIDES.L - SLIP_W / 2 + 34;
    const b = print16Box(rw.name, 0, 0, 3.0); LAY.text(`slip L name ${i}`, 'cu:slipL', [bx, y - b[3] / 2, b[2], b[3]]);
    LAY.text(`slip L ○ ${i}`, 'cu:slipL', print16Box('○', SIDES.L + SLIP_W / 2 - 70, y, 4.4)); });
  RIGHT_ROWS.forEach((rw, i) => { const y = SLOT_Y - 26 - RH / 2 - (RIGHT_ROWS.length - 1 - i) * RH;
    LAY.text(`slip R もう一度 ${i}`, 'cu:slipR', print16Box('もう一度', SIDES.R, y - 33, 3.2));
    LAY.text(`slip R タッチ ${i}`, 'cu:slipR', print16Box('タッチしてください', SIDES.R, y + 33, 3.2)); });
  LAY.audit('readers from above');
  LAY.frameCheck('readers from above', { sheets: { cu: p => p, 'cu:slipL': p => p, 'cu:slipR': p => p }, views: frameTimes(SEG[0], T48, T56).map(t => ({ t, z: 1, fx: 960, fy: 540 })) });
  // the town's cards carry each person's own name, printed over the drawn name field in card.js's handwriting
  const HANDIMG = {};
  for (const [k, name] of PEOPLE) {
    const im = IMG[k], [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    { const [nx, ny, nw, nh] = PT(`h03_tap_${k}`, 'name').box; x.fillStyle = PAPER; x.fillRect(nx, ny, nw, nh);
      x.save(); x.beginPath(); x.rect(nx, ny, nw, nh); x.clip(); x.fillStyle = rgba(INK_RGB, 0.9); x.font = `${Math.round(nh * 0.62)}px Klee`; x.textBaseline = 'middle'; x.textAlign = 'left';
      x.translate(nx + nh * 0.25, ny + nh * 0.54); x.rotate(-0.012); x.fillText(name, 0, 0); x.restore(); }
    HANDIMG[k] = c;
  }
  // her card in her hand: the same card face as everywhere (cardFace), printed over the card drawn in h03_tap_rin
  HANDIMG.rin = printFace(IMG.rin, PT('h03_tap_rin', 'card').quad, cardFace(1000));
  function drawHandA(ctx, key, x, y, lift) {
    const im = HANDIMG[key], s = HAND_S * (1 + 0.035 * lift), origin = PT(`h03_tap_${key}`, 'anchor').point;
    const put = (c, ox, oy) => drawImageAt(ctx, placement({ x: x + ox, y: y + oy, s, origin }), c);
    put(silhouette(im, HAND_SHADOW), 8 + 18 * lift, 11 + 24 * lift); put(im, 0, 0);
  }
  const OFF = 820;
  function townHand(h, tt) {
    if (tt < h.tin || tt >= h.tout) return null;
    if (tt < h.tp) { const u = smooth((tt - h.tin) / (h.tp - h.tin)); return { x: 90 * (1 - u), y: OFF * (1 - u), lift: 1 - u * u }; }
    if (tt < h.tl) return { x: 0, y: 0, lift: 0 };
    const u = smooth((tt - h.tl) / (h.tout - h.tl)); return { x: -110 * u, y: OFF * u * u, lift: Math.min(1, u * 3) };
  }
  function rinHand(tt) {
    if (tt < RIN_IN || tt >= RIN_OUT) return null;
    if (tt < RIN_HOVER) { const u = smooth((tt - RIN_IN) / (RIN_HOVER - RIN_IN)); return { x: 60 * (1 - u), y: OFF * (1 - u), lift: 1 }; }
    if (tt >= RIN_BACK) { const u = smooth((tt - RIN_BACK) / (RIN_OUT - RIN_BACK)); return { x: 40 * u, y: OFF * u * u, lift: 1 }; }
    for (let i = RP.length - 1; i >= 0; i--) {
      const p = RP[i];
      if (tt >= p.t && tt < p.tl) return { x: 0, y: 0, lift: 0 };
      if (tt >= p.tl) { const u = Math.min(1, (tt - p.tl) / (3 * FR)); return { x: 0, y: -6 * u, lift: u }; }
    }
    const d = Math.max(0, Math.min(1, (tt - (RP[0].t - 3 * FR)) / (3 * FR)));
    return { x: 0, y: -6 * (1 - d), lift: 1 - d };
  }
  function drawReaders(tt) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(BASE, 0, 0);
    // rhythm pass: the pad lights on every press, on the beat's frame (the ring between the inner and outer circles), and fades
    // in four frames: teal where the town's cards are read, graphite where hers is not (no red in the film). No camera move:
    // the readers' prints stay the light, unshaken prints of 改定 2.
    const padFlash = (cx, times, rgb, a0) => {
      let a = 0; for (const t of times) { if (tt < t) continue; const f = frameOf(tt, t); if (f < 5) a = Math.max(a, [1, 0.75, 0.5, 0.28, 0.12][f]); }
      if (!a) return;
      g.fillStyle = rgba(rgb, a0 * a); g.beginPath(); g.arc(cx, PAD_Y, 262, 0, 7); g.arc(cx, PAD_Y, 200, 0, 7, true); g.fill('evenodd');
    };
    padFlash(SIDES.L, HL.map(h => h.tp), TEAL_RGB, 0.85);
    padFlash(SIDES.R, RP.map(p => p.t), INK_RGB, 0.8);
    slip(g, SIDES.L, LEFT_ROWS, LH, tt, 46, nameRow);
    slip(g, SIDES.R, RIGHT_ROWS, RH, tt, 46, againRow);
    const vis = HL.map(h => ({ h, p: townHand(h, tt) })).filter(v => v.p).reverse();
    for (const { h, p } of vis) drawHandA(g, h.k, SIDES.L + p.x, PAD_Y + p.y, p.lift);
    const r = rinHand(tt); if (r) drawHandA(g, 'rin', SIDES.R + r.x, PAD_Y + r.y, r.lift);
  }

  // =====================================================================================================================
  // k56-k71 the hall's front elevation (metres; drawn straight into the frame by the camera)
  // =====================================================================================================================
  // The set is 14's and 15's (seg_14.js: lanes 0.9 m apart, cabinets 0.25 m wide and 1.0 m high with the reader on top, flaps
  // 0.25-0.95 m in graphite, the clock 0.17 m on its pole at 2.33 m, the wall's print) in its paper-white state: in 14 the same
  // print shows faintly through the graphite. World: x right of her lane's centre, y = -height (so the drawings stay upright).
  // The wide (k56): 0.50 m to 2.60 m high (her knees out, the clock and the timing marks in), 3.73 m wide. Every zoom is about
  // her chest (0, 1.1365 m), chosen so the end frame is exactly 0.90 m (the flaps' top 0.95 m just in) to 1.68 m.
  const HW = 2.10, PPM = 1080 / HW, YMID = 0.50 + HW / 2, YA = 1.1365;
  const ANCH = [960, 540 - (YA - YMID) * PPM];
  const CAM = createCamera(g, { W, H: 1080, bg: PAPER });
  // Motion pass (2026-11-21, the director after the second cut: “screen motion can have rhythm but must not cause dizziness”「不是完全不能晃 但是不能
  // 晕」; docs/制作约定.md 第六节「整屏运动」, MOTION AUDIT below). The hall used to step the whole frame on nearly every beat
  // (k57-k63 steps, the k60 slam x1.5 with a 14 px knock-down that rang back, k64 dip and push hit, k65-k67 kick steps, k68
  // punch, steps and nudges through the fill: 17 jolts, 29 problems). Now the frame moves in three eased pushes and only
  // twice abruptly, one way, then still:
  //   k56-k57 the wide holds; k57-k60 an eased push 1.00 -> 1.45 (the clock leaves the top), the wall's rows marked on the
  //   beats; k60 one ordinary jolt (the flaps slam, × printed, she startles): a 1.3% step in, two frames, no knock-down, no
  //   ring; k60-k68 an eased push to 2.00 (r03_drop3 shown 0.97x), through the card's drop (k64, an action in the picture,
  //   the frame still) and the three heavy kicks; k68 the 大击 (bar line, she looks up at us, the fill begins): a 3.5% step in,
  //   two frames, one way; k68.5-k71 a slight eased push to 2.20 on her stare (0.85-1.80 m) while the fill plays inside the
  //   picture (her reader prints and flashes on every half beat, the wall's timing marks print outwards beside her).
  const Z60A = 1.45, Z60B = Z60A * 1.013, Z68A = 2.00, Z68B = Z68A * 1.035, Z_END = 2.20;
  const T57 = K(57), T61P = T60 + 3 * FR, T685 = K(68.5);
  const frameOf = (tt, t0) => Math.floor((tt - t0) / FR + 1e-6);
  const logEase = (tt, a, b, za, zb) => Math.exp(Math.log(za) + (Math.log(zb) - Math.log(za)) * smooth((tt - a) / (b - a)));
  const STEP_P = [0.6, 1];                                        // a step: 60% on the beat's frame, there on the next, no overshoot
  const stepZ = (tt, t0, za, zb) => za * Math.pow(zb / za, STEP_P[Math.min(STEP_P.length - 1, frameOf(tt, t0))]);
  function hallZoom(tt) {
    if (tt < T57) return 1;
    if (tt < T60) return logEase(tt, T57, T60, 1, Z60A);
    if (tt < T61P) return stepZ(tt, T60, Z60A, Z60B);
    if (tt < T68) return logEase(tt, T61P, T68, Z60B, Z68A);
    if (tt < T685) return stepZ(tt, T68, Z68A, Z68B);
    return logEase(tt, T685, SEG[1], Z68B, Z_END);
  }
  move(S, 'hall push 1 (eased)', T57, T60);
  move(S, 'hall push 2 (eased)', T60, T68);
  move(S, 'hall push 3 (eased, the stare)', T685, K(71));
  const camAt = tt => { const z = hallZoom(tt); return [z, ANCH[0], ANCH[1] - (ANCH[1] - 540) / z]; };
  const toWorld = ctx => { ctx.translate(960, 540 + YMID * PPM); ctx.scale(PPM, PPM); };
  const toBase = (x, h) => [960 + x * PPM, 540 - (h - YMID) * PPM];
  const scrM = (ctx, cover, pitch = 0.006, rgb = TEAL_RGB) => screen(ctx, cover, pitch, rgb);

  const LINE = 0.0055, LANE = 0.9, BW = 0.25, DOOR_LO = 0.25, DOOR_HI = 0.95;
  const LANES = [-3, -2, -1, 0, 1, 2, 3], BODIES = [-2.25, -1.35, -0.45, 0.45, 1.35, 2.25];
  // a flap's state: 0 open (folded into the cabinets) .. 1 shut: half out on the slam's frame, overshoot, shut (as in 14)
  const doorF = tt => { if (tt < T60) return 0; const f = Math.floor((tt - T60) / FR + 1e-6); return [0.5, 1.04, 1.0][Math.min(2, f)]; };
  const CLOCK = { x: 0, h: 2.33, R: 0.17 };

  // The back wall: the station printed like the film's answer card (the city reads everyone): a teal beam with the card's black
  // timing marks under it, two fields of ovals left and right of her (five columns 0-4, five rows), the wainscot rule and a teal
  // screen below it; the clock on its pole right over her head.
  function wall(ctx, tt) {
    ctx.fillStyle = PAPER; ctx.fillRect(-4.6, -4.6, 9.2, 4.6);
    const r = rng(305); for (let i = 0; i < 900; i++) { ctx.fillStyle = rgba(FIBRE_RGB, 0.03 + r() * 0.04); ctx.fillRect(-3 + r() * 6, -3 + r() * 3, 0.004 + r() * 0.016, 0.0016); }
    ctx.fillStyle = TEAL; ctx.fillRect(-4.6, -3.06, 9.2, 0.31);
    ctx.fillStyle = GRAPHITE; for (let x = -4.3; x <= 4.31; x += 0.2) if (Math.abs(x) > 0.3) ctx.fillRect(x - 0.03, -2.445, 0.06, 0.045);
    ctx.fillStyle = TEAL; ctx.fillRect(-4.6, -1.19, 9.2, 0.015); ctx.fillRect(-4.6, -3.95, 9.2, 0.012);
    ctx.fillStyle = scrM(ctx, 0.24); ctx.fillRect(-4.6, -1.175, 9.2, 1.175);
    ctx.strokeStyle = rgba(TEAL_RGB, 0.8); ctx.lineWidth = 0.006; ctx.fillStyle = rgba(TEAL_RGB, 0.7);
    for (const sx of [-1, 1]) for (let ri = 0; ri < 5; ri++) for (let j = 0; j < 5; j++) {
      const ox = sx * (0.62 + j * 0.27), oy = -(1.40 + ri * 0.2);
      ctx.beginPath(); ctx.ellipse(ox, oy, 0.075, 0.05, 0, 0, 7); ctx.stroke();
      ctx.save(); ctx.translate(ox, oy + 0.002); ctx.scale(0.001, 0.001); ctx.font = '500 36px ZenKaku'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(sx < 0 ? 4 - j : j), 0, 0); ctx.restore();
    }
    // the answer fields marked on the riff (rhythm pass): one row a beat, the same column index left and right (a mirrored
    // diagonal from the top outer ovals down to the ones beside her head), filled in pencil like the town's cards; a mark lands
    // 1.3x on its beat's frame and settles to 1 over three frames (the stamp language of the film)
    for (const m of MARKS) {
      if (tt < m.t) continue;
      const f = frameOf(tt, m.t), sc = [1.3, 1.15, 1.05][f] ?? 1, oy = -(1.40 + m.ri * 0.2);
      for (const sx of [-1, 1]) {
        const ox = sx * (0.62 + m.j * 0.27);
        ctx.fillStyle = PENCIL_FILL; ctx.beginPath(); ctx.ellipse(ox, oy, 0.07 * sc, 0.045 * sc, 0, 0, 7); ctx.fill();
        ctx.fillStyle = rgba(REHATCH_LIGHT_RGB, 0.18); ctx.beginPath(); ctx.ellipse(ox - 0.018 * sc, oy - 0.012 * sc, 0.03 * sc, 0.012 * sc, -0.2, 0, 7); ctx.fill();
      }
    }
    // the fill (motion pass): a pair of timing marks printed on the wainscot rule on k68 and each half beat of the fill, from
    // beside her outwards, like the card's own timing track (graphite, a stamp's 1.3 -> 1 pop); the last pair at the frame's edge
    TMARKS.forEach((t0, i) => {
      if (tt < t0) return;
      const f = frameOf(tt, t0), sc = [1.3, 1.15, 1.05][f] ?? 1, w = 0.04 * sc, h = 0.03 * sc, cy = -1.19 - 0.012 - 0.015;
      ctx.fillStyle = GRAPHITE; for (const sx of [-1, 1]) ctx.fillRect(sx * (0.32 + i * 0.10) - w / 2, cy - h / 2, w, h);
    });
    clock(ctx, tt);
  }
  // 14's clock: paper face, teal ring and ticks, the second hand ticking once a second with a small overshoot (one time: song time)
  function clock(ctx, tt) {
    const { x: cx, h, R } = CLOCK, cy = -h;
    ctx.fillStyle = TEAL; ctx.fillRect(cx - 0.012, -2.75, 0.024, 2.75 - h - R + 0.01);
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.02; ctx.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = R * (i % 5 ? 0.86 : 0.74), r1 = R * 0.92;
      ctx.lineWidth = i % 5 ? 0.004 : 0.011; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.stroke(); }
    const secs = 52 * 60 + 12 + tt, hand = (a, len, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - Math.sin(a) * len * 0.15, cy + Math.cos(a) * len * 0.15); ctx.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len); ctx.stroke(); };
    hand((7 + secs / 3600) / 12 * Math.PI * 2, R * 0.5, 0.02, TEAL);
    hand((secs / 60) / 60 * Math.PI * 2, R * 0.76, 0.013, TEAL);
    const s0 = Math.floor(secs), fr = secs - s0, tick = s0 + (fr < 0.12 ? smooth(fr / 0.12) * 1.04 : 1 - 0.04 * Math.exp(-(fr - 0.12) / 0.05)) - 1;
    hand(((tick % 60) + 1) / 60 * Math.PI * 2, R * 0.86, 0.008, GRAPHITE);
    ctx.fillStyle = GRAPHITE; ctx.beginPath(); ctx.arc(cx, cy, 0.013, 0, 7); ctx.fill();
    ctx.lineCap = 'butt';
  }
  // an open lane: a cell of paper-white light between the cabinets (the exit beyond), screened teal edges; it goes out as the
  // flaps shut (14's lanes)
  function lights(ctx, tt) {
    const half = (LANE - BW) / 2, f = Math.min(1, doorF(tt)); if (f >= 1) return;
    ctx.globalAlpha = 1 - f;
    for (const i of LANES) { const lc = i * LANE;
      ctx.fillStyle = PAPER; ctx.fillRect(lc - half, -DOOR_HI, 2 * half, DOOR_HI + 0.05);
      ctx.fillStyle = scrM(ctx, 0.35); ctx.fillRect(lc - half, -DOOR_HI, 0.035, DOOR_HI); ctx.fillRect(lc + half - 0.035, -DOOR_HI, 0.035, DOOR_HI); }
    ctx.globalAlpha = 1;
  }
  // a cabinet's exit end (14's gateFace): light grey face, teal cap, panel, indicator window, the dark reader on top; the two
  // inner sides facing her lane take her shade (a denser screen)
  function gateFace(ctx, cx, tt) {
    const x0 = cx - BW / 2;
    for (const sd of [-1, 1]) { const xs = sd < 0 ? x0 - 0.035 : x0 + BW, toHer = Math.abs(xs + 0.0175) < 0.34;
      ctx.fillStyle = scrM(ctx, toHer ? 0.8 : 0.55); ctx.fillRect(xs, -0.985, 0.035, 0.985); }
    rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.fillStyle = PAPER; ctx.fill();
    ctx.fillStyle = rgba(INK_RGB, 0.12); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.008; ctx.stroke();
    ctx.save(); rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.clip(); ctx.fillStyle = TEAL; ctx.fillRect(x0, -1.0, BW, 0.06); ctx.restore();
    ctx.strokeStyle = TEAL; ctx.lineWidth = LINE; rrect(ctx, x0 + 0.025, -0.915, BW - 0.05, 0.86, 0.012); ctx.stroke();
    rrect(ctx, cx - 0.075, -0.895, 0.15, 0.15, 0.012); ctx.fillStyle = PAPER; ctx.fill(); ctx.lineWidth = 0.007; ctx.stroke();
    rrect(ctx, cx - 0.045, -1.075, 0.09, 0.075, 0.008); ctx.fillStyle = rgba(INK_RGB, 0.7); ctx.fill(); ctx.lineWidth = LINE; ctx.stroke();
    // her reader (the cabinet at -0.45, by her slip) tries her card again on k68 and every half beat of the fill: its window
    // lights paper-white on the beat's frame and fades over four frames
    if (Math.abs(cx - SLIP.x) < 1e-6) { let a = 0; for (const t0 of TMARKS) { if (tt < t0) continue; const f = frameOf(tt, t0); if (f < 5) a = Math.max(a, [1, 0.75, 0.5, 0.28, 0.12][f]); }
      if (a) { rrect(ctx, cx - 0.037, -1.067, 0.074, 0.059, 0.006); ctx.fillStyle = rgba(PAPER_RGB, 0.8 * a); ctx.fill(); } }
    for (const sx of [x0 + 0.045, x0 + BW - 0.045]) { ctx.beginPath(); ctx.arc(sx, -0.6, 0.006, 0, 7); ctx.stroke(); }
    if (tt >= T60) { ctx.save(); ctx.translate(cx, -0.82); ctx.scale(0.001, 0.001); print16(ctx, '×', 0, 0, 6.8, tt - T60, 120 + Math.round(cx * 10)); ctx.restore(); }
  }
  // her reader's slip (the cabinet on her right hand, our left, x -0.45): the strip printed three times in the close-up stands
  // up out of the reader's slot, its top curled back: three identical blocks of もう一度／タッチしてください
  const SLIP = { x: -0.45, w: 0.10, bot: 1.075, top: 1.215 }, BLOCK = 0.035, FEED = [0.6, 1];
  const TMARKS = [T68, ...FEEDS];
  // fill pass: blocks fed out of the slot so far (each feed takes two frames from its half beat)
  const feedAt = tt => FEEDS.reduce((n, t) => tt < t ? n : n + (FEED[frameOf(tt, t)] ?? 1), 0);
  function slipUp(ctx, tt) {
    const { x, w, bot } = SLIP, x0 = x - w / 2, n = feedAt(tt), top = SLIP.top + n * BLOCK;
    ctx.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.12); ctx.fillRect(x0 + 0.006, -top + 0.004, w, top - bot);
    ctx.fillStyle = PAPER_SLIP; ctx.beginPath(); ctx.moveTo(x0, -bot); ctx.lineTo(x0, -top + 0.004);
    for (let i = 0; i <= 12; i++) ctx.lineTo(x0 + i * w / 12, -top + (i % 2 ? 0 : 0.004)); ctx.lineTo(x0 + w, -bot); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(INK_RGB, 0.35); ctx.lineWidth = 0.0012; ctx.stroke();
    ctx.fillStyle = rgba(GRAPHITE_DARK_RGB, 0.10); ctx.fillRect(x0, -top + 0.004, w, 0.012);       // the curl, its back towards us
    // 16-dot cells of 0.52 mm, printed at 0.1 mm a unit (so the dots are rasterised fine and scaled with the camera)
    // block i (0 at the top) rises with the feed; the new ones come up out of the slot already printed (clipped at the slot)
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 0.01, -top, w + 0.02, top - bot); ctx.clip();
    for (let i = 0; i < 3 + Math.ceil(n); i++) {
      const h = 1.180 - i * BLOCK + n * BLOCK; if (h - 0.018 > top || h + 0.018 < bot) continue;
      ctx.save(); ctx.translate(x, -h); ctx.scale(0.0001, 0.0001);
      print16(ctx, 'もう一度', 0, -46, 5.2, 9, 90 + i * 2); print16(ctx, 'タッチしてください', 0, 46, 5.2, 9, 91 + i * 2);
      ctx.restore(); }
    ctx.restore();
  }
  // the flaps (14's): graphite panels 0.25-0.95 m from each cabinet's inner side, meeting in the lane's middle
  function doors(ctx, tt) {
    const f = doorF(tt); if (f <= 0) return;
    const half = (LANE - BW) / 2 - 0.004;
    for (const i of LANES) {
      const lc = i * LANE;
      for (const sd of [-1, 1]) {
        const root = lc + sd * (LANE / 2 - BW / 2), w = half * f, xa = sd < 0 ? root : root - w;
        rrect(ctx, xa, -DOOR_HI, w, DOOR_HI - DOOR_LO, 0.03); ctx.fillStyle = GRAPHITE; ctx.fill();
        ctx.strokeStyle = rgba(PAPER_RGB, 0.42); ctx.lineWidth = 0.006; rrect(ctx, xa + 0.014, -DOOR_HI + 0.015, Math.max(0, w - 0.028), DOOR_HI - DOOR_LO - 0.03, 0.022); ctx.stroke();
      }
    }
  }

  // her drawings: the 2:3 canvas spans 0.40 m to 1.85 m, centred on her lane; r03_upC is r03_up2's crop at 1.809x
  const RS = 1.45 / 1536;
  const [backCard] = mk(600, 400); drawCard(backCard, { side: 'back', seed: 32 });
  // the card back (記入上の注意) printed over the card drawn in her hand: only the card's own pixels (paper white or the teal
  // print) inside its measured box are replaced, so the fingers and the holder's rim stay as drawn
  function cardBackOver(im, [bx, by, bw, bh]) {
    const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0);
    const [mc, mx] = mk(bw, bh); mx.drawImage(im, bx, by, bw, bh, 0, 0, bw, bh);
    const d = mx.getImageData(0, 0, bw, bh), [, ox] = mk(bw, bh); ox.drawImage(backCard, 0, 0, bw, bh); const o = ox.getImageData(0, 0, bw, bh);
    for (let i = 0; i < d.data.length; i += 4) {
      const r = d.data[i], gg = d.data[i + 1], b = d.data[i + 2], a = d.data[i + 3];
      const card = (Math.min(r, gg, b) > 196 && Math.max(r, gg, b) - Math.min(r, gg, b) < 26) || (b > r + 45 && gg > r + 30);
      if (card && a > 200) { d.data[i] = o.data[i]; d.data[i + 1] = o.data[i + 1]; d.data[i + 2] = o.data[i + 2]; }
    }
    mx.putImageData(d, 0, 0); x.drawImage(mc, bx, by); return c;
  }
  const HER = { [ART.peer]: cardBackOver(IMG.peer, PT('r03_peer3', 'cardBack').box), [ART.flinch]: cardBackOver(IMG.flinch, PT(AN.files.flinch, 'cardBack').box), [ART.drop]: IMG.drop, [ART.up]: IMG.up };
  // each drawing's one placement in the hall (drawing px -> metres): the 2:3 canvas over 0.40-1.85 m, r03_upC the crop of
  // r03_up2 it was redrawn from; drawings and their parts (the clip) both go through it
  const NAME = { [ART.peer]: 'r03_peer3', [ART.flinch]: AN.files.flinch, [ART.drop]: 'r03_drop3', [ART.up]: 'r03_upC' };
  const PLACE = Object.fromEntries(Object.keys(HER).map(f => {
    if (f !== ART.up) return [f, placement({ x: -512 * RS, y: -1.85, s: RS })];
    const [cx0, cy0, cw] = AN.upC.crop; return [f, placement({ x: (cx0 - 512) * RS, y: -(1.85 - cy0 * RS), s: cw * RS / IMG.up.width })];
  }));
  function drawHer(ctx, file) { drawImageAt(ctx, PLACE[file], HER[file]); }
  // the card she lets go (k64): from where her hand held it (r03_flinch2, back towards us, foreshortened) it falls onto the
  // lanyard, turning face out, then sways and settles. It hangs with its top at 1.09 m, centred on the drop drawing's clip
  // column, covering the drawn clip, so the lanyard enters its top edge; its bottom clears the flaps by 4 cm.
  const herCard = cardFace(900), CW = 0.15, CHH = CW / CARD_RATIO;
  // where it hangs: centred on the clip measured on the drawing on screen (r03_drop3 k64-k68, r03_upC k68 on), its top 1.09 m
  const hangOf = file => [PLACE[file].toWorld(PT(NAME[file], 'clip').point)[0], AN.hang.top];
  const HANG = hangOf(ART.drop);
  function hangingCard(ctx, tt, file) {
    const pcb = PT(AN.files.flinch, 'cardBack').box, [hx, hyw] = PLACE[ART.flinch].toWorld([pcb[0] + pcb[2] / 2, pcb[1]]), hy = -hyw;   // the held card's top centre
    const HANG = hangOf(file);
    // rhythm pass: it drops in three frames (gravity: 40%, 80%, landed on the third), so it hits her chest inside the beat's
    // dip; it turns face out over the same three frames, then swings on the lanyard and settles. (Before: a 5-frame ease that
    // read as floating, the diagnosis measured almost no change on k64.)
    const age = tt - T64, fa = frameOf(tt, T64), LAND = 2 * FR;
    const u = [0.4, 0.8][fa] ?? 1, uf = [0.3, 0.7][fa] ?? 1;
    const cx = hx + (HANG[0] - hx) * u, top = hy + (HANG[1] - hy) * u - (fa === 2 ? 0.006 : 0);      // a 6 mm sag as the lanyard catches it
    const swing = fa < 2 ? -0.22 * (1 - u) : 0.10 * Math.exp(-(age - LAND) / 0.32) * Math.sin((age - LAND) / 0.45 * Math.PI * 2);
    const flip = Math.cos(Math.PI * (1 - uf));
    const sq = (pcb[3] / pcb[2]) * CARD_RATIO * (1 - u) + u;
    ctx.save(); ctx.translate(cx, -top); ctx.rotate(swing); ctx.scale(Math.max(0.05, Math.abs(flip)), 1);
    ctx.fillStyle = CARD_SHADOW; ctx.fillRect(-CW / 2 + 0.005, 0.007, CW, CHH * sq);
    ctx.drawImage(flip > 0 ? herCard : backCard, -CW / 2, 0, CW, CHH * sq);
    rrect(ctx, -CW / 2, 0, CW, CHH * sq, 0.005); ctx.strokeStyle = rgba(INK_RGB, 0.55); ctx.lineWidth = 0.0013; ctx.stroke();
    ctx.restore();
  }
  // the hanging card's lines, where they sit once it has settled (for the frame audit of the push to her chest)
  {
    const sc = CW / CU, [bx, by] = toBase(HANG[0] - CW / 2, HANG[1]), tl = b => [bx + b[0] * sc * PPM, by + b[1] * sc * PPM, b[2] * sc * PPM, b[3] * sc * PPM];
    for (const [n, b] of Object.entries(lineBoxes(CU))) LAY.text(`hung card ${n}`, 'hall:card', tl(b));
    LAY.audit('hall card');
    const views = frameTimes(SEG[0], T64 + 0.5, SEG[1]).map(t => ({ t, ...CAM.view(...camAt(t)) }));
    LAY.frameCheck('hall: her card on her chest', { sheets: { 'hall:card': p => p }, views });
  }
  function drawHall(tt) {
    const file = S.at('rin', tt).file;
    CAM.shoot(camAt(tt), 0, tt, (ctx) => {
      ctx.save(); toWorld(ctx);
      wall(ctx, tt);
      lights(ctx, tt);
      drawHer(ctx, file);
      if (tt >= T64) hangingCard(ctx, tt, file);
      doors(ctx, tt);
      for (const cx of BODIES) gateFace(ctx, cx, tt);
      slipUp(ctx, tt);
      ctx.restore();
    });
  }

  // ---------- MOTION AUDIT: the frame as actually shown, every frame of the segment (docs/制作约定.md 第六节「整屏运动」) ----------
  // title: the camera is still until k45, then the push into the answer area (registered whip, one beat), a 1.5% drift; the
  // k40 sink moves the card and her hand inside the picture, not the frame. readers: still. hall: as camAt.
  const MOTION_R = (() => {
    const fr = frameTimes(SEG[0], SEG[0], SEG[1]);
    const firstOf = t0 => fr.find(t => t >= t0 - 1e-9);
    const cuts = new Set([firstOf(T48), firstOf(T56)]);
    const views = fr.map(t => {
      const v = t < T48 ? (([z, fx, fy]) => ({ z, fx, fy }))(titleCam(t)) : t < T56 ? { z: 1, fx: 960, fy: 540 } : CAM.view(...camAt(t));
      return { t, ...v, dx: 0, dy: 0, cut: cuts.has(t) };
    });
    return motionAudit('seg_03', views, {
      whips: [[T_TIN, 'k45 推进答题区，片名卡（一拍，11 帧）']],
      big: [[T68, 'k68 小节线、她抬头看我们，前奏最响的一小节和过门的起点']] });
  })();

  // ---------- PART AUDIT: every code part against its own drawing's pixels ----------
  const isSkin = ([r, gg, b, a]) => a > 40 && r > 150 && r - b > 25 && r >= gg;            // the page's own skin rule (printFace)
  const cardPx = ([r, gg, b, a]) => a > 200 && ((Math.min(r, gg, b) > 180 && Math.max(r, gg, b) - Math.min(r, gg, b) < 32) || (b > r + 30 && gg > r + 20));
  const lanyardPx = ([r, gg, b, a]) => a > 200 && b > r + 30;
  const clipPx = p => lanyardPx(p) || (p[3] > 200 && Math.min(p[0], p[1], p[2]) > 150 && Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]) < 30);
  const quadPts = ([TL, TR, BR, BL], ins = 10, n = 24) => { const o = [], cx = (TL[0] + TR[0] + BR[0] + BL[0]) / 4, cy = (TL[1] + TR[1] + BR[1] + BL[1]) / 4;
    const inn = ([x, y]) => { const d = Math.hypot(x - cx, y - cy); return [x + (cx - x) * ins / d, y + (cy - y) * ins / d]; };
    const Q = [TL, TR, BR, BL].map(inn); for (let e = 0; e < 4; e++) { const A = Q[e], B = Q[(e + 1) % 4]; for (let i = 0; i < n; i++) o.push([A[0] + (B[0] - A[0]) * i / n, A[1] + (B[1] - A[1]) * i / n]); } return o; };
  const boxPts = ([x, y, w, h], ins = 6, n = 5) => { const o = []; for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) o.push([x + ins + (w - 2 * ins) * i / n, y + ins + (h - 2 * ins) * j / n]); return o; };
  partAudit('seg_03', 'h03_hold', 'card (face printed over it)', { image: IMG.hold, points: quadPts(PT('h03_hold', 'card').quad), on: cardPx, hidden: isSkin, r: 2, maxOffPct: 5 });
  endsAudit('seg_03', 'h03_hold', 'lanyard (carried up)', { image: IMG.hold, ends: PT('h03_hold', 'strap').ends, on: lanyardPx });
  partAudit('seg_03', 'h03_pen', 'pencil tip (the hand is placed by it)', { image: IMG.pen, points: [PT('h03_pen', 'tip').point], on: PIX.dark, r: 3, maxOffPct: 0 });
  partAudit('seg_03', 'h03_tap_rin', 'card (face printed over it)', { image: IMG.rin, points: quadPts(PT('h03_tap_rin', 'card').quad), on: cardPx, hidden: isSkin, r: 2, maxOffPct: 5 });
  for (const [k] of PEOPLE) {
    partAudit('seg_03', `h03_tap_${k}`, 'name field (name printed in it)', { image: IMG[k], points: boxPts(PT(`h03_tap_${k}`, 'name').box), on: cardPx, hidden: isSkin, r: 1, maxOffPct: 5 });
    partAudit('seg_03', `h03_tap_${k}`, 'anchor (on the card)', { image: IMG[k], points: [PT(`h03_tap_${k}`, 'anchor').point], on: cardPx, r: 3, maxOffPct: 0 });
  }
  partAudit('seg_03', 'h03_tap_rin', 'anchor (on the card)', { image: IMG.rin, points: [PT('h03_tap_rin', 'anchor').point], on: p => cardPx(p) || PIX.dark(p), r: 3, maxOffPct: 0 });
  for (const f of [ART.peer, ART.flinch]) partAudit('seg_03', NAME[f], 'card back (printed over the drawn card)', { image: IMG[f === ART.peer ? 'peer' : 'flinch'], points: boxPts(PT(NAME[f], 'cardBack').box, 5), on: cardPx, hidden: isSkin, r: 2, maxOffPct: 10 });
  for (const f of [ART.drop, ART.up]) partAudit('seg_03', NAME[f], 'lanyard clip (the hanging card covers it)', { image: IMG[f === ART.drop ? 'drop' : 'up'], points: [PT(NAME[f], 'clip').point], on: clipPx, r: 3, maxOffPct: 0 });
  // the hanging card on each drawing it hangs on: it must cover that drawing's clip (the card spans HANG x +- CW/2, top 1.09 m)
  for (const f of [ART.drop, ART.up]) { const [cx, cyw] = PLACE[f].toWorld(PT(NAME[f], 'clip').point), [hx, top] = hangOf(f);
    const ok = Math.abs(cx - hx) < CW * 0.1 && -cyw < top && -cyw > top - CHH;
    partAudit('seg_03', NAME[f], `hanging card covers the clip (${(-cyw).toFixed(3)} m, card ${top}-${(top - CHH).toFixed(3)} m)`, { image: IMG.hold, points: [[0, 0]], on: () => ok, r: 0, maxOffPct: 0 }); }
  const PARTS_R = partReport('seg_03');

  S.finish();
  publishAudit(S, LAY, { cardInk: inkAudit, cardSlam: slamAudit, motion: MOTION_R, parts: PARTS_R });

  window.renderAt = async t => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (t < T48) drawTitle(t); else if (t < T56) drawReaders(t); else drawHall(t);
  };
  await window.renderAt(P('t0', 20));
}
