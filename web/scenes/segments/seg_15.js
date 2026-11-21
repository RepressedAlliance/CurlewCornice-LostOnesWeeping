// Segment 15 尾奏 riff (docs/分镜/15_尾奏riff.md, design 甲 after the blind review of the k508-k528 samples), k488-k556,
// global frames [5432, 6187). The finished segment; the reviewers' must-fix list and what was done about it is in
// work/seg/15/fin/plan.md.
//   S1 k488-k491  her card from segment 14 fills the frame (her pencil もうどうだって／いいや on it); k489.5 it slips a little,
//                 k491 (the band's hardest hit) it drops out of the frame in four frames and uncovers the hall. The poster
//                 frame is her_card.js POSTER_FRAME (shared with 14): every word on the face whole in the frame through the
//                 landing, the wobble and the slip, the card's side edges just showing (2026-11-21 review MUST).
//   S2 k491-k508  the seven-lane wide of the graphite hall (W7): every door shut, a × on every indicator, everyone's card gone
//                 (an empty clip on every lanyard), the fallen cards lying on the cabinet tops, she in the middle lane playing.
//                 The camera steps in one notch a beat like a second hand (k492-k504, 13 notches, x1.049 each) while the
//                 doors open from the outside in on the bar lines: lanes 1+7 (k492), 2+6 (k496), 3+5 (k500), hers (k504),
//                 each lane lighting up paper white and its indicators printed ○. k505 she glances down at her open lane.
//   S3 k508-k522.25  cut into a pan along the lanes (chest-up, in motion from its first frame) past 加藤 大輔 (pinching his empty
//                 clip), 田中 美咲 (hand flat on her chest), 吉田 蓮; from k514 the pan slows and pulls back at once, she slides
//                 in from the right playing with her eyes closed; k522.25 (the music cuts) the camera stops dead and the
//                 clock's second hand stops on the same frame.
//   S4 k522.25-k528  k522.5 (first tutti hit) all six groups turn their heads to her; k524 (fourth hit) she opens her eyes and
//                 the camera steps in once, then creeps on to k528.
//   S5 k528-k536  close-up: 小林 そうた (3, in his mother's right arm, her neck, collar and a strand of her hair beside him)
//                 turns to her (k528), his eyes go round, his mouth opens, his fist grips her collar (k532); n5 turned behind him.
//   S6 k536-k540  close-up: 山本 さくら, one headphone cup just pulled off her ear, listening; n4 turned to her far behind.
//   S7 k540-k556  her waist shot, centred, the faces turned to her round her: eight strumming keys, one every two beats, the
//                 head rising; k544 the camera jolts in on the heavy strum; k548-k556 the frame rises onto her face.
// 2026-11-21: changed after the independent review of the finished segment (docs/分镜/15_尾奏riff.md 第 4 稿).
// 2026-11-21 rhythm pass (user: 「这是一首摇滚乐……希望视频跟歌曲节奏一致」「结尾那个吉他弦都脱离吉他了」; work/rhythm_diag): the
// slides became steps on the drums, every step starting on the beat's frame (more than half there on it, in place on the
// third, still between steps): S3 one pan step a beat k509-k516 (double steps on the bar lines k512, k516), three big steps
// that pan and pull back on the three heavy kicks k517-k519, k520 a small step in, still through the stop; k523 (tutti hit 2)
// a punch; k524 (crash) a paper-white flash with the step in; k526 a step in place of the creep; S5/S6 a push step every two
// beats (k530, k532 with the swap, k534) and punches on the snare hits k533, k535, then k537-k539 a step a beat (no drift);
// k540 (crash) a flash on the cut; S7 three steps in towards her face on the three heavy kicks k549-k551, still to the cut
// (no slow rise). Her strings are measured on each drawing in its own px (art/cut/seg15_anchors.json strings_by, nut to
// bridge, work/seg/15/fin/strings_measure.py), drawn with the drawing's one transform, her hands drawn back over them.
// 2026-11-21 third round (user after the second cut: 「你为什么要一直抖动屏幕？……不是完全不能晃 但是不能晕」「笔芯和笔不对了 还有
// 其他地方 也有吉他弦和吉他不是一块的」, and the guitar-smash ending; docs/制作约定.md 第六节「整屏运动」): the frame no longer
// steps or punches on the drums. S1 the card lands and lies dead still, then drops out (a registered whip, k491); S2 one slow
// eased push W7 -> F3 (k492-k508) while the doors open on the bar lines, the clock's second hand ticks a notch on every beat
// (the "second hand" is the clock again, not the camera) and the fallen cards jump on every beat (twice as high on the kick
// run k505-k507.5); S3 the even pan from the cut, slowing and pulling back from k514, stopped dead with the music on k522.25;
// S4 still, then an eased creep from k524 (the flash and her eyes carry k524); S5/S6 one eased push each (his fist on the
// collar k532 is the beat); S7a k544 the one 大击 (3.5% in two frames, one way, held), a slow rise k548-k552 onto her face,
// k550 she stops playing (R15_grip: her fist round the neck joint, her eyes on the reader at her right); S7b k552 an action
// cut to the BAT frame: the guitar on her shoulder like a bat (R16_shoulder), the frame still to segment 16 [2026-11-22: no cut, see S7KEYS]. No code strings
// any more (only the strings Codex drew); the lanyards and clips from each drawing's own measured stubs (art/cut/
// seg15_parts.json through web/lib/parts.js, PART AUDIT); MOTION AUDIT on every frame's view.
// The hall is a flat front elevation (改定 1): world units are metres, y = -height; layers scaled about the 1.40 m eye line,
// no parallax between people; only the back wall moves slower in the pan (0.6).
import { CARD_RATIO } from '../../lib/card.js';
import { herCardFace, herCardBoxes, drawHerWords, herWordsBoxes, POSTER_FRAME } from '../../lib/her_card.js';
import { BEAT, FRAME as FR, beatV, beatOf, smooth, createScore, publishAudit } from '../../lib/score.js';
import { loadLyrics } from '../../lib/lyrics.js';
import { createLayout } from '../../lib/type.js';
import { frameTimes, motionAudit } from '../../lib/camera.js';
import { loadPartAnchors, partOf, partAudit, PIX, partReport, pixelsOf } from '../../lib/parts.js';
import { print16, whiteLetter } from '../../lib/print.js';
import { PAPER, PAPER_RGB, TEAL, TEAL_RGB, GRAPHITE, GRAPHITE_FIELD, GRAPHITE_LIGHT_RGB, GRAPHITE_DARK_RGB, INK_RGB, PAPER_CARD,
         rgba } from '../../lib/palette.js';

export default async function seg15(H) {
  const { g, W, P, q, rng, img, rinPalImage } = H;
  const F0 = 5432, F1 = 6187, FPS = 30, T0 = F0 / FPS, T1 = F1 / FPS;
  const K = beatV;
  const S = createScore('seg_15', { t0: T0, t1: T1 });
  const LAY = createLayout();
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return [c, c.getContext('2d')]; };
  const LY = await loadLyrics({ within: [168.5, 182] });
  const L53 = LY.lineAt(53, 'おいどうすんだよもうどうだっていいや'), L53b = L53.slice(8);

  // ---- the beats ----
  const T488 = K(488), T4895 = K(489.5), T491 = K(491), T504 = K(504), T505 = K(505), T508 = K(508), T514 = K(514),
        T520 = K(520), TSTOP = K(522.25), TTURN = K(522.5), T524 = K(524), T528 = K(528), T532 = K(532), T536 = K(536),
        T540 = K(540), T544 = K(544), T548 = K(548), T556 = K(556);
  const DOOR_AT = [[K(492), [-3, 3]], [K(496), [-2, 2]], [K(500), [-1, 1]], [T504, [0]]];   // lane index -3..3, 0 = hers
  // 2026-11-21 third round: no camera steps or punches on the drums (docs/制作约定.md 第六节「整屏运动」). The beats are carried
  // inside the frame: the doors, the second hand's tick (TICK_FROM..TSTOP, one notch a beat), the fallen cards' jump (twice
  // as high on the kick run KICK_RUN), the empty clips, the strum keys. The frame's only jolt is the 大击 on the heavy strum
  // k544; the card's drop out of the frame k491 is a registered whip; the stop k522.25 is a dead stop with the music.
  const T550 = K(550), T552 = K(552), TICK_FROM = K(492), KICK_RUN = [K(505), K(506), K(507), K(507.5)];
  const FLASHES = [T524, T540];
  // her lane's light shaft on the kick run (S2): 1 on the kick's frame, then dying away (e-fold 3.5 frames)
  const shaftOf = tt => { let v = 0; for (const t0 of KICK_RUN) { if (tt < t0 - 1e-6) continue; const f = (tt - t0) / FR; v = Math.max(v, f < 1 ? 1 : Math.exp(-(f - 1) / 3.5)); } return v < 0.03 ? 0 : v; };
  const ease = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
  // a paper-white flash on a crash: 75% on the first frame, 30% on the second
  const flashOf = tt => { for (const t0 of FLASHES) { if (tt < t0) continue; const f = Math.floor((tt - t0) / FR + 1e-6); if (f === 0) return 0.75; if (f === 1) return 0.3; } return 0; };

  // ================================================================================================================
  // the drawings (art/cut; Codex, art/design/prompts/_make_seg15.py and _make_seg15f.py)
  // ================================================================================================================
  // town drawings at the 01 scale: 1024 x 1536 showing 2.00 m (top edge) to 0.25 m (bottom edge); the close lane drawings for the
  // pan: 2.00 m to 0.72 m. cx = the body's centre column (drawing px); lan = the lanyard's two cut ends where code hangs the
  // lower lanyard and the empty clip (null: drawn in the picture); len = how far the clip hangs below them (m)
  const FULL = { ppm: 1536 / 1.75, top: 2.0 }, CLOSE = { ppm: 1536 / 1.28, top: 2.0 };
  const A = await (await fetch('/art/cut/seg15_anchors.json')).json();
  // the lanyard stubs (lan), the clip's drop (len) and そうた's stubs (kid): measured on EACH drawing in its own px, read with
  // parts.js partOf (a turned drawing has its own; nothing falls back to the bowed drawing's numbers). A drawing without a
  // 'lan' entry draws its whole lanyard itself.
  const PA = await loadPartAnchors('/art/cut/seg15_parts.json');
  const lanOf = file => PA[file] && PA[file].lan ? partOf(PA, file, 'lan') : null;
  const TOWN = {
    p8: { ...FULL, file: 't15_p8', cx: 512 },
    p2: { ...FULL, file: 't15_p2', cx: 535 },
    p9: { ...FULL, file: 't01_p9', cx: 511 },
    p1: { ...FULL, file: 't01_p1c', cx: 510 },
    p3: { ...FULL, file: 't01_p3', cx: 512 },
    p4: { ...FULL, file: 't15_p4', cx: A.t15_p4.cx },
    p5: { ...FULL, file: 't15_p5', cx: A.t15_p5.cx },
    p6: { ...FULL, file: 't01_p6', cx: 508 },
    p7: { ...FULL, file: 't01_p7', turn: 't15_p7_turn', cx: 515, kid: true },
    n3: { ...FULL, file: 't15_n3', turn: 't15_n3_turn2', cx: 508 },
    n5: { ...FULL, file: 't15_n5', turn: 't15_n5_turn', cx: 508 },
    n6: { ...FULL, file: 't15_n6', turn: 't15_n6_turn', cx: 508 },
    // the close drawings of the lane people (S3, S4, S7)
    p8h: { ...CLOSE, file: 't15_p8h', cx: A.t15_p8h.cx },
    p2h: { ...CLOSE, file: 't15_p2h', cx: A.t15_p2h.cx },
    p9h: { ...CLOSE, file: 't15_p9h', turn: 't15_p9h_turn', cx: A.t15_p9h.cx },
    p1h: { ...CLOSE, file: 't15_p1h2', turn: 't15_p1h2_turn', cx: A.t15_p1h2.cx },
  };
  // where they stand (segment 14 第 6 节 七通道站位表, 14 and 15 share it): layer scale fs, x (m). The wide (S2) shows everyone;
  // the pan and the medium shot (S3, S4, S7) use the close lane drawings for the four lane people they pass.
  const ROW_WIDE = [
    ['n5', 0.72, -0.68], ['n6', 0.72, 0.68],
    ['p6', 0.85, -2.25], ['p7', 0.85, -0.45], ['n3', 0.85, 0.45], ['p5', 0.85, 2.25],
    ['p8', 1, -2.7], ['p2', 1, -1.8], ['p9', 1, -0.9], ['p1', 1, 0.9], ['p3', 1, 1.8], ['p4', 1, 2.7],
  ];
  const ROW_NEAR = [
    ['n5', 0.72, -0.68], ['n6', 0.72, 0.68],
    ['p6', 0.85, -2.25], ['p7', 0.85, -0.45], ['n3', 0.85, 0.45],
    ['p8h', 1, -2.7], ['p2h', 1, -1.8], ['p9h', 1, -0.9], ['p1h', 1, 0.9],
  ];
  // her: every drawing on the R15_play_d* canvas, 1024 x 1536 showing 1.25 m; placed with its top edge at 1.76 m (her hair top
  // at 1.53 m) and her body's centre column (446 px) at x = 0
  const RIN = { ppm: 1536 / 1.25, top: 1.76, cx: 446 };
  const HERS = ['R15_play_a', 'R15_play_b', 'R15_play_c', 'R15_look', 'R15_play_d1', 'R15_play_d2', 'R15_play_d3', 'R15_play_d4',
                'R15_play_e3'];
  // the S7 keys (2026-11-22, third review MUST: the action cut to R16_shoulder on k552 was a jump cut, the guitar shrank to
  // ~60% and her eyes switched sides): four strumming keys, one every two beats (k540-k548); k548 (the bar line) R15_grip2,
  // she stops playing and grips the neck joint, her eyes on the reader at the viewer's LEFT (R15_grip redrawn, only the eyes:
  // R15_grip looked right although it was asked to look left, and segment 16 smashes the reader on the left), held 3.5 beats
  // in the stillness before the heaviest kick; k551.5 R15_heave (the half-beat in-between: she heaves the guitar up); k552
  // (the heaviest kick) R15_bat, the guitar on her right shoulder like a bat, in the SAME shot: the action happens in front
  // of us, no cut. R15_heave and R15_bat are drawn from R15_grip2 on a padded canvas (board/seg15_grip2_pad.png: R15_grip2 at
  // 0.78, 353 px right, 338 px down, room for the gold body above and on the viewer's left), so she and the guitar keep
  // R15_grip's size (the Les Paul's tailpiece and pickups measure the same as in R15_grip, within 8%).
  const STRUMS = ['R15_strum_1', 'R15_strum_2', 'R15_strum_3', 'R15_strum_4b'];
  const S7KEYS = [...STRUMS.map((n, j) => [n, K(540 + 2 * j), K(542 + 2 * j), '', j > 0]),
    ['R15_grip2', T548, K(551.5), " (stops playing on the bar line, grips the neck joint, eyes on the reader at the viewer's left)"],
    ['R15_heave', K(551.5), T552, ' (in-between: heaves the guitar up past her right shoulder)', true, 'inbetween'],
    ['R15_bat', T552, T556, ' (the guitar on her right shoulder like a bat; the heaviest kick k552)']];
  const S7NAMES = S7KEYS.map(k => k[0]);
  HERS.push(...S7NAMES);
  const PAD = { s: 0.78, dx: 353, dy: 338 };            // the padded canvas of R15_heave / R15_bat against R15_grip2's
  const rinOff = { ...A.rinOff, R15_grip: [-1, 0], R15_grip2: [-1, 0] };      // work/seg/15/fin/align.py against R15_play_d1 (gold top)
  // drawing px -> world for each of her drawings: [x0, y0 (top-left in world), s (m per px)]
  const herPlace = name => {
    if (name === 'R15_heave' || name === 'R15_bat') {     // q = 0.78 p + (353, 338), p a pixel of R15_grip2
      const sg = 1 / RIN.ppm, s = sg / PAD.s, [odx, ody] = rinOff.R15_grip2;
      return [-(RIN.cx + odx) * sg - PAD.dx * s, -RIN.top - ody * sg - PAD.dy * s, s]; }
    const [odx, ody] = rinOff[name] ?? [0, 0], s = 1 / RIN.ppm;
    return [-(RIN.cx + odx) * s, -RIN.top - ody * s, s];
  };
  const FILE = n => `/art/cut/${n}.png`;
  // a drawing that is not there yet is drawn as nothing and reported (window.__audit.missing; a finished render has none)
  const MISSING = [];
  const load = async n => { try { return await img(FILE(n)); } catch { MISSING.push(n); console.error(`MISSING DRAWING ${n}`); const [c] = mk(1024, 1536); return c; } };
  const IM = {};
  const tone = (im, b) => { const [c, x] = mk(im.width, im.height); x.filter = `brightness(${b})`; x.drawImage(im, 0, 0); return c; };
  const rowTone = fs => fs === 1 ? 1 : fs > 0.8 ? 0.9 : 0.8;     // the back rows one tone step darker each, for depth on the black wall
  const toneOf = {}; for (const [k, fs] of [...ROW_WIDE, ...ROW_NEAR]) toneOf[k] = rowTone(fs);
  for (const [k, f] of Object.entries(TOWN)) {
    const b = toneOf[k] ?? 1, get = async n => { const i = await load(n); return b < 1 ? tone(i, b) : i; };
    IM[k] = await get(f.file); if (f.turn) IM[k + '_turn'] = await get(f.turn);
  }
  for (const n of HERS) { const i = await load(n); IM[n] = MISSING.includes(n) ? i : rinPalImage(i); }
  // S6 (2026-11-22, third review MUST: the three heaviest kicks k537-k539 had nothing moving): さくら pulls the headphone cup
  // off on the kicks, three drawings from the f15_p6c master: f15_p6_a (cut in on the action k536: the cup still on, lifting),
  // f15_p6c (k537: off the ear), f15_p6_c2 (k538: pulled right down, head turned to the music, eyes wide; the key, held to the
  // cut), and on k539 a startled blink (f15_p6_cb, three frames; a blink is exempt from the hold rules, 第六节)
  const CU = {};
  for (const n of ['f15_sota_a', 'f15_sota_b', 'f15_p6_a', 'f15_p6c', 'f15_p6_c2', 'f15_p6_cb']) CU[n] = await load(n);
  const T537 = K(537), T538 = K(538), T539 = K(539);
  const sakuraAt = t => t < T537 ? 'f15_p6_a' : t < T538 ? 'f15_p6c' : (t >= T539 && t < T539 + 3 * FR - 1e-6) ? 'f15_p6_cb' : 'f15_p6_c2';
  // the people behind the two close-ups (the storyboard's backboards), turned to her like everyone else, a tone step darker
  const RAW_N4 = await load('f15_n4_bg');
  const CUBG = { n5: tone(await load('f15_n5_bg'), 0.5), n4: tone(RAW_N4, 0.62) };
  // (2026-11-21 third round: no code strings. The ringing strings drawn over her drawings, even measured per drawing, read as
  // a part apart from the guitar; her strings are only the ones Codex drew. strings_by / <name>_cover.png are no longer used.)

  // ================================================================================================================
  // the score: shots, drawings, events
  // ================================================================================================================
  S.hold('shot', 'S1 her card fills the frame', T0, T491, { kind: 'shot', onBeat: false });
  S.hold('shot', 'S2 seven-lane wide, the doors count down (one slow push; the clock ticks)', T491, T508, { kind: 'shot' });
  S.hold('shot', 'S3+S4 pan -> slows and pulls back -> stop -> everyone turns -> she opens her eyes (one take)', T508, T528, { kind: 'shot' });
  S.hold('shot', 'S5 close-up 小林 そうた', T528, T536, { kind: 'shot' });
  S.hold('shot', 'S6 close-up 山本 さくら', T536, T540, { kind: 'shot' });
  S.hold('shot', 'S7 her waist shot among the turned faces: strums, stops, heaves the guitar onto her shoulder (one take)', T540, T556, { kind: 'shot' });
  S.ev('card in place (from segment 14), dead still', T488);
  S.ev('card drops out of the frame (registered whip); the hall; her first strum (measured hit k491)', T491);
  DOOR_AT.forEach(([t, lanes]) => S.ev(`doors open + ○ printed: lanes ${lanes.map(i => i + 4).join(', ')}`, t));
  S.ev('slow eased push W7 -> F3 starts', TICK_FROM);
  for (let b = 492; b <= 522; b++) S.ev(`the clock's second hand ticks a notch (k${b})`, K(b));
  KICK_RUN.forEach(t => S.ev(`the fallen cards jump high (kick run k${beatOf(t).toFixed(1)})`, t, Math.abs(beatOf(t) % 1) > 0.1 ? 'half' : 'beat'));
  KICK_RUN.forEach(t => S.ev(`her lane's light flares up the wall behind her (kick run k${beatOf(t).toFixed(1)})`, t, Math.abs(beatOf(t) % 1) > 0.1 ? 'half' : 'beat'));
  const herTrack = (track, list) => list.forEach(([n, a, b, note = '', onBeat = true]) => S.hold(track, `${n}${note}`, a, b, { kind: 'key', file: FILE(n), onBeat }));
  herTrack('rin S2', [['R15_play_a', T491, K(496), ' (eyes open, down-strum)'], ['R15_play_b', K(496), K(500), ' (up-strum)'],
                      ['R15_play_c', K(500), T505, ' (hard down-strum)'], ['R15_look', T505, T508, ' (glances at her open lane)']]);
  herTrack('rin S3', [['R15_play_d1', T508, K(516), ' (eyes closed, down-strum; in the frame from ~k514)', false], ['R15_play_d2', K(516), K(518), ' (up-strum)'],
                      ['R15_play_d3', K(518), T520, ' (hard down-strum)'], ['R15_play_d4', T520, T524, ' (chin up, hand raised)'],
                      ['R15_play_e3', T524, T528, ' (eyes open, looking out past us)']]);
  S7KEYS.forEach(([n, a, b, note, onBeat = true, kind = 'key']) => S.hold('rin S7', `${n}${note}`, a, b, { kind, file: FILE(n), onBeat }));
  // the town: one drawing each per shot; the six groups of the medium shot turn on the measured first tutti hit (k522.5)
  for (const [k] of ROW_WIDE) S.hold(`town ${k} S2`, `${TOWN[k].file} (wide)`, T491, T508, { kind: 'key', file: FILE(TOWN[k].file), onBeat: false, person: true });
  for (const [k] of ROW_NEAR) {
    const f = TOWN[k];
    if (f.turn) {
      S.hold(`town ${k}`, `${f.file} head bowed`, T508, TTURN, { kind: 'key', file: FILE(f.file), onBeat: false, person: true });
      S.hold(`town ${k}`, `${f.turn} turns to her`, TTURN, T528, { kind: 'key', file: FILE(f.turn), onBeat: false, person: true });
    } else S.hold(`town ${k}`, `${f.file}`, T508, T528, { kind: 'key', file: FILE(f.file), onBeat: false, person: true });
  }
  S.ev('six groups turn their heads to her (measured tutti hit 1, k522.5)', TTURN, 'half');
  S.ev('the clock stops, nothing moves (measured stop, k522.25)', TSTOP, 'quarter');
  S.ev('paper-white flash, she opens her eyes; an eased creep in starts (tutti hit 4, crash)', T524);
  S.hold('sota', 'f15_sota_a (turns to her)', T528, T532, { kind: 'key', file: FILE('f15_sota_a'), onBeat: false, person: true });
  S.hold('sota', 'f15_sota_b (eyes round, mouth open)', T532, T536, { kind: 'key', file: FILE('f15_sota_b'), person: true });
  S.hold('sakura', 'f15_p6_a (cut in on the action: her hand lifting the cup, still on the ear)', T536, T537, { kind: 'inbetween', file: FILE('f15_p6_a'), onBeat: false, person: true });
  S.hold('sakura', 'f15_p6c (the cup off the ear; heaviest kick k537)', T537, T538, { kind: 'inbetween', file: FILE('f15_p6c'), person: true });
  S.hold('sakura', 'f15_p6_c2 (cup pulled right down, head turned to the music, eyes wide; kick k538)', T538, T540, { kind: 'key', file: FILE('f15_p6_c2'), person: true });
  S.ev('さくら blinks, startled, on the third heavy kick (f15_p6_cb, 3 frames; blinks are exempt from the hold rules)', T539);
  S.hold('behind sota', 'f15_n5_bg (turned to her, behind そうた)', T528, T536, { kind: 'key', file: FILE('f15_n5_bg'), onBeat: false, person: true });
  S.hold('behind sakura', 'f15_n4_bg (turned to her, behind さくら)', T536, T540, { kind: 'key', file: FILE('f15_n4_bg'), onBeat: false, person: true });
  for (const k of ['p7', 'n3', 'n5', 'n6', 'p9h', 'p1h'])
    S.hold(`town ${k} S7`, `${TOWN[k].turn} (S7, behind her)`, T540, T556, { kind: 'key', file: FILE(TOWN[k].turn), onBeat: false, person: true });
  S.ev('大击: the frame jolts in once on the heavy strum (3.5%, one way, held)', T544);
  S.ev('the pan cuts in moving (k508)', T508);
  S.ev('the pan slows and pulls back (k514)', T514);
  S.ev('paper-white flash on the cut (crash k540)', T540);
  S.ev('slow rise onto her face starts (k548)', T548);
  S.ev("she stops playing on the bar line: R15_grip2, eyes on the reader at the viewer's left (k548)", T548);
  S.ev('the guitar lands on her shoulder like a bat, in the shot (the heaviest kick, k552); the frame has settled', T552);
  // the beat responses (改定 9): every beat, something visible answers the riff (docs/分镜/15 第 4 节 正拍响应)
  const KICKS = []; for (let b = 492; b < 556; b++) if (b !== 523) KICKS.push(K(b));    // k522.25-k524: the stop, nothing moves
  KICKS.push(K(507.5)); KICKS.sort((a, b) => a - b);                                    // the fill into k508 (measured kick)
  const kickFrozen = t => t >= TSTOP && t < T524 + 0.25 * BEAT;
  for (let b = 492; b <= 527; b++) if (b < 522 || b > 523) S.ev(`cards on the cabinets jump${b >= 508 ? ', clips swing' : ''} (k${b})`, K(b));
  S.ev('cards on the cabinets jump (the fill k507.5)', K(507.5), 'half');
  for (let b = 529; b <= 535; b++) if (b !== 532) S.ev(`his empty clip swings (k${b})`, K(b));
  for (let b = 541; b <= 555; b += 2) S.ev(`the empty clips behind her swing (k${b})`, K(b));

  // ================================================================================================================
  // the hall: wall, clock, people, light cells, doors, cabinets, fallen cards (world metres, y = -height)
  // ================================================================================================================
  const LANE = 0.9, BW = 0.25, BODIES = [-3.15, -2.25, -1.35, -0.45, 0.45, 1.35, 2.25, 3.15];
  const DOOR = { top: 0.95, bot: 0.28 };
  const CLOCK = { h: 1.81, R: 0.095 };
  // The printed screen: a square lattice of `pitch` (m) with a dot at each corner and one in the middle, rotated 15°.
  // Prefiltered at the size it lands on the screen (the 03 hall's fix, seg_03.js screen(); 根因清单 2026-11-21): the tile is
  // built at the device's own resolution (N cells, 4x4 supersampled, box-filtered), so the pattern is never sampled down by
  // the canvas; and as the dot pitch nears the pixel pitch (the W7 wide: 0.006 m = 1.7 px, 0.009 m = 2.5 px) the dots fade
  // into their mean tone instead of beating against the pixel grid (the W7 doors and cabinet sides showed a crawling grain).
  // Same lattice, same dot size, same mean tone as before; only the sampling changed.
  const patCache = new Map();
  function screen(ctx, cover = 0.3, pitch = 0.006, rgbv = TEAL_RGB) {
    const m = ctx.getTransform(), dev = Math.hypot(m.a, m.b), N = 8, ppx = pitch * dev, tpx = Math.max(16, Math.round(N * ppx));
    const key = `${cover}|${rgbv}|${tpx}`;
    let e = patCache.get(key);
    if (!e) {
      const SS = 4, B = tpx * SS, cell = B / N, r = cell * Math.sqrt(cover / Math.PI), [big, bx] = mk(B, B);
      bx.fillStyle = '#000';
      for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) for (const [ox, oy] of [[0, 0], [0.5, 0.5]]) {
        bx.beginPath(); bx.arc((i + ox) * cell, (j + oy) * cell, r, 0, 7); bx.fill(); }
      const src = bx.getImageData(0, 0, B, B).data, [c, x] = mk(tpx, tpx), out = x.createImageData(tpx, tpx), A = new Float32Array(tpx * tpx);
      let mean = 0;
      for (let y = 0; y < tpx; y++) for (let xx = 0; xx < tpx; xx++) {
        let a = 0; for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) a += src[((y * SS + sy) * B + xx * SS + sx) * 4 + 3];
        A[y * tpx + xx] = a / (SS * SS); mean += a / (SS * SS);
      }
      mean /= tpx * tpx;
      const keep = Math.max(0, Math.min(1, (tpx / N - 2.2) / 1.6));     // dot contrast kept: 0 at <= 2.2 px pitch, all at >= 3.8 px
      const [R0, G0, B0] = rgbv;
      for (let i = 0; i < A.length; i++) { const o = i * 4; out.data[o] = R0; out.data[o + 1] = G0; out.data[o + 2] = B0; out.data[o + 3] = Math.round(mean + (A[i] - mean) * keep); }
      x.putImageData(out, 0, 0);
      e = { p: ctx.createPattern(c, 'repeat') }; patCache.set(key, e);
    }
    const s = N * pitch / tpx;
    e.p.setTransform(new DOMMatrix().rotateSelf(15).scaleSelf(s, s));
    return e.p;
  }
  // graphite: the wall under many layers of pencil (Demo 2's field at the hall's scale), a 2048 px tile = 1.4 m
  const GTN = 2048, [GT, gts] = mk(GTN, GTN);
  { gts.fillStyle = GRAPHITE_FIELD; gts.fillRect(0, 0, GTN, GTN); const r = rng(9); gts.lineCap = 'round';
    for (let k = 0; k < 6000; k++) { gts.strokeStyle = rgba(r() < 0.5 ? GRAPHITE_LIGHT_RGB : GRAPHITE_DARK_RGB, 0.2 + r() * 0.2); gts.lineWidth = 4 + r() * 10;
      const x = r() * GTN, y = r() * GTN, l = 120 + r() * 280, a = (r() < 0.5 ? -0.5 : 0.55) + (r() - 0.5) * 0.16;
      for (const [ox, oy] of [[0, 0], [-GTN, 0], [GTN, 0], [0, -GTN], [0, GTN]]) { gts.beginPath(); gts.moveTo(x + ox, y + oy); gts.lineTo(x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l); gts.stroke(); } } }
  let gPat = null;
  const graphite = (ctx, metres = 1.4) => { gPat ||= ctx.createPattern(GT, 'repeat'); gPat.setTransform(new DOMMatrix().scaleSelf(metres / GTN, metres / GTN)); return gPat; };
  const PRINT = rgba(TEAL_RGB, 0.40);
  function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // the clock's time: real time, stopped for good at k522.25 (no bounce, no reset)
  const clockT = tt => Math.min(tt, TSTOP);
  // the second hand (2026-11-21 third round: 「像秒针一样」 is the clock's job, not the camera's): from k492 it ticks one notch
  // (6 degrees) on every beat, in two frames with a 1-degree recoil, and stops for good with the music at k522.25 (the tick
  // due on k523 never comes)
  const SEC0 = 7, TICKS = []; for (let b = 492; b <= 522; b++) TICKS.push(K(b));
  const secAngle = tt => { tt = Math.min(tt, TSTOP); let n = 0;
    for (const t0 of TICKS) { if (tt < t0) break; const f = (tt - t0) / FR; n += f >= 2 ? 1 : f >= 1 ? 1.12 : 0.65; }
    // f 0: 65% there on the beat's frame, f 1: 112% (the recoil), f 2: in place
    return (SEC0 + n) / 60 * Math.PI * 2; };
  // the back wall (offset ox: it moves at 0.6 of the people's speed in the pan)
  // her scream from segment 14, rubbed white out of the graphite above the clock: large, so the wide reads as a poster (the words
  // over the bowed heads); fully inside the frame from W7 to F3, above the frame in the pan and the medium shot
  const LINE_TXT = [...'おいどうすんだよ'], LINE_H = 2.30, LINE_S = 0.30;
  const lineX = i => (i - (LINE_TXT.length - 1) / 2) * LINE_S * 1.06;
  function wall(ctx, tt, ox, rows) {
    const halo = haloMask(rows);
    ctx.save(); ctx.translate(ox, 0);
    ctx.fillStyle = graphite(ctx); ctx.fillRect(-6, -4.6, 12, 4.6);
    // the beam with its timing marks, the wainscot rule, the screened dado, the two fields of ovals (the 03 hall's print)
    ctx.fillStyle = rgba(TEAL_RGB, 0.30); ctx.fillRect(-6, -3.36, 12, 0.31);
    ctx.fillStyle = rgba(PAPER_RGB, 0.16);
    for (let x = -5.9; x <= 5.91; x += 0.2) ctx.fillRect(x - 0.03, -3.245, 0.06, 0.045);
    ctx.fillStyle = PRINT; ctx.fillRect(-6, -1.19, 12, 0.015);
    ctx.fillStyle = screen(ctx, 0.10, 0.006, TEAL_RGB); ctx.globalAlpha = 0.5; ctx.fillRect(-6, -1.175, 12, 1.175); ctx.globalAlpha = 1;
    ctx.strokeStyle = PRINT; ctx.lineWidth = 0.007;
    for (let ri = 0; ri < 8; ri++) for (let ox2 = -5.5; ox2 <= 5.51; ox2 += 0.27) {
      const oy = 1.36 + ri * 0.2; if (Math.abs(ox2) < 0.4 && oy < 2.05) continue;          // clear round the clock
      if (Math.abs(ox2) < 1.42 && oy > 2.08 && oy < 2.52) continue;                         // and under the rubbed line
      // and none on, beside or just over anybody's head (根因清单: an oval alone round a head reads as a halo; 2026-11-21
      // second review, S7's last frame and S4's turn): faded out by its clearance from the people of this shot, measured at
      // the wall's current offset, so in the pan an oval sliding towards a head fades instead of popping
      let a = halo.alpha(ox2 + (ri % 2) * 0.135 + ox, oy); if (ox === 0 && a < 1) a = 0;       // a still wall: whole or none
      if (a <= 0) continue;
      ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(ox2 + (ri % 2) * 0.135, -oy, 0.075, 0.05, 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
    // 2026-11-22 (third review MUST: on the kick run k505-k507.5 only the 60 px cards jumped, unreadable on a phone): her open
    // lane's light flares up the wall behind her on each of the four kicks, a paper-white shaft the width of her lane from the
    // cabinet tops to above the clock (in F3 about 340 x 650 px, the frame's centre), full on the kick's frame and dying away
    // over ~8 frames; the frame does not move
    const sh = tt < T508 ? shaftOf(tt) : 0;
    if (sh > 0) {
      const x0 = -LANE / 2 + BW / 2, w = LANE - BW;
      const g1 = ctx.createLinearGradient(0, -0.95, 0, -2.25);
      g1.addColorStop(0, rgba(PAPER_RGB, 0.88 * sh)); g1.addColorStop(0.6, rgba(PAPER_RGB, 0.5 * sh)); g1.addColorStop(1, rgba(PAPER_RGB, 0));
      ctx.fillStyle = g1; ctx.fillRect(x0, -2.25, w, 1.30);
    }
    // the station clock on a short wall bracket over her lane (a rod from the beam ran through the rubbed line and split it in
    // two: the 2026-11-21 review); the bracket's plate sits under the line
    const { h, R } = CLOCK, cy = -h, s = clockT(tt) - T488 + 41 * 60 + 7;
    ctx.fillStyle = PRINT; ctx.fillRect(-0.011, -(h + R + 0.11), 0.022, 0.12);
    rrect(ctx, -0.045, -(h + R + 0.135), 0.09, 0.035, 0.008); ctx.fillStyle = rgba(TEAL_RGB, 0.55); ctx.fill();
    ctx.strokeStyle = rgba(PAPER_RGB, 0.25); ctx.lineWidth = 0.004; ctx.stroke();
    ctx.fillStyle = rgba(INK_RGB, 0.6); ctx.beginPath(); ctx.arc(0.008, cy + 0.01, R, 0, 7); ctx.fill();
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(0, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = TEAL; ctx.lineWidth = 0.014; ctx.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = R * (i % 5 ? 0.86 : 0.72), r1 = R * 0.92;
      ctx.lineWidth = i % 5 ? 0.003 : 0.008; ctx.beginPath(); ctx.moveTo(Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.stroke(); }
    const hand = (a, len, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-Math.sin(a) * len * 0.16, cy + Math.cos(a) * len * 0.16); ctx.lineTo(Math.sin(a) * len, cy - Math.cos(a) * len); ctx.stroke(); };
    hand(((6 + s / 3600) % 12) / 12 * Math.PI * 2, R * 0.5, 0.014, TEAL);
    hand(((s / 60) % 60) / 60 * Math.PI * 2, R * 0.76, 0.009, TEAL);
    hand(secAngle(tt), R * 0.88, 0.0065, GRAPHITE);       // drawn thick: a phone sees it tick and stop
    ctx.fillStyle = GRAPHITE; ctx.beginPath(); ctx.arc(0, cy, 0.01, 0, 7); ctx.fill();
    // 「おいどうすんだよ」 rubbed white out of the graphite above the clock (segment 14 left it on the wall)
    LINE_TXT.forEach((c, i) => { ctx.save(); ctx.translate(lineX(i), -LINE_H); ctx.scale(LINE_S / 120, LINE_S / 120); whiteLetter(ctx, c, 0, 0, 120, 1, 'rubbed'); ctx.restore(); });
    ctx.restore();
  }
  LINE_TXT.forEach((c, i) => LAY.text(`wall line ${c}${i}`, 'world', [lineX(i) - LINE_S * 0.5, -LINE_H - LINE_S * 0.55, LINE_S, LINE_S * 1.1]));
  LAY.audit('wall line');

  // a lane's door state: 1 shut .. 0 open (two frames into the cabinets, a frame of bounce); when it opened (or Infinity)
  const openAt = i => { for (const [t, lanes] of DOOR_AT) if (lanes.includes(i)) return t; return Infinity; };
  const doorF = (i, tt) => { const t0 = openAt(i); if (tt < t0) return 1; const f = Math.round((tt - t0) * FPS); return [0.45, 0, 0.07, 0][Math.min(3, f)]; };
  function lightCells(ctx, tt) {
    for (let i = -3; i <= 3; i++) {
      if (tt < openAt(i)) continue;
      const lc = i * LANE, x0 = lc - LANE / 2 + BW / 2, w = LANE - BW;
      ctx.fillStyle = PAPER; ctx.fillRect(x0, -0.95, w, 0.95);
      ctx.fillStyle = screen(ctx, 0.28, 0.009); ctx.fillRect(x0, -0.95, w, 0.03);           // a soft printed edge under the cabinet tops
    }
  }
  function doors(ctx, tt) {
    for (let i = -3; i <= 3; i++) {
      const f = doorF(i, tt); if (f <= 0) continue;
      const lc = i * LANE, full = (LANE - BW) / 2 - 0.006, half = full * f, hgt = DOOR.top - DOOR.bot;
      for (const sd of [-1, 1]) {
        const root = lc + sd * (LANE / 2 - BW / 2), xa = sd < 0 ? root : root - half;
        // a flap: graphite, printed over with the teal screen, a paper-white rim so the shut row reads as doors, not as holes
        rrect(ctx, xa, -DOOR.top, half, hgt, Math.min(0.045, half / 2)); ctx.fillStyle = GRAPHITE; ctx.fill();
        ctx.save(); ctx.clip(); ctx.fillStyle = screen(ctx, 0.42, 0.009); ctx.fillRect(xa, -DOOR.top, half, hgt); ctx.restore();
        ctx.strokeStyle = rgba(PAPER_RGB, 0.85); ctx.lineWidth = 0.009; rrect(ctx, xa, -DOOR.top, half, hgt, Math.min(0.045, half / 2)); ctx.stroke();
        if (half > 0.03) { ctx.strokeStyle = rgba(PAPER_RGB, 0.35); ctx.lineWidth = 0.005; rrect(ctx, xa + 0.03, -DOOR.top + 0.03, half - 0.06, hgt - 0.06, 0.03); ctx.stroke();
          // the rubber edge where the two flaps meet
          ctx.fillStyle = rgba(GRAPHITE_LIGHT_RGB, 1); ctx.fillRect(sd < 0 ? xa + half - 0.022 : xa, -DOOR.top + 0.01, 0.022, hgt - 0.02); }
      }
    }
  }
  // the cabinets; each has an indicator window for the lane on either side of it: × while the lane is shut, ○ once it opens
  function cabinets(ctx, tt) {
    for (const cx of BODIES) {
      const x0 = cx - BW / 2;
      for (const sd of [-1, 1]) { ctx.fillStyle = screen(ctx, 0.55); const xs = sd < 0 ? x0 - 0.035 : x0 + BW; ctx.fillRect(xs, -0.985, 0.035, 0.985); }
      rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.fillStyle = PAPER; ctx.fill();
      ctx.fillStyle = rgba(INK_RGB, 0.12); ctx.fill();
      ctx.strokeStyle = TEAL; ctx.lineWidth = 0.008; ctx.stroke();
      ctx.save(); rrect(ctx, x0, -1.0, BW, 1.0, 0.022); ctx.clip(); ctx.fillStyle = TEAL; ctx.fillRect(x0, -1.0, BW, 0.06); ctx.restore();
      ctx.strokeStyle = TEAL; ctx.lineWidth = 0.0055; rrect(ctx, x0 + 0.025, -0.915, BW - 0.05, 0.86, 0.012); ctx.stroke();
      rrect(ctx, cx - 0.045, -1.075, 0.09, 0.075, 0.008); ctx.fillStyle = rgba(INK_RGB, 0.7); ctx.fill(); ctx.lineWidth = 0.0055; ctx.stroke();
      for (const sd of [-1, 1]) {
        const lane = Math.round((cx + sd * LANE / 2) / LANE); if (lane < -3 || lane > 3) continue;
        const wx = cx + sd * 0.058, wy = -0.83;
        rrect(ctx, wx - 0.045, wy - 0.045, 0.09, 0.09, 0.008); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 0.005; ctx.stroke();
        const t0 = openAt(lane), open = tt >= t0;
        ctx.save(); ctx.translate(wx, wy); ctx.scale(0.001, 0.001);
        print16(ctx, open ? '○' : '×', 0, 0, 4.4, open ? tt - t0 : 1, 120 + Math.round(cx * 10) + (sd > 0 ? 1 : 0));
        ctx.restore();
      }
    }
  }
  // the fallen cards: one on each cabinet top, lying a little askew; on every beat each jumps ~2 cm (2 frames up, 3 down)
  const CARDS = BODIES.map((cx, i) => { const r = rng(900 + i); return { x: cx + (r() - 0.5) * 0.06 + (cx < 0 ? 0.03 : -0.03), rot: (r() - 0.5) * 0.12, amp: 0.016 + r() * 0.01, lag: Math.floor(r() * 2) }; });
  const JUMP_FROM = TICK_FROM;       // 2026-11-21 third round: every beat from k492 (the push no longer answers the beat)
  function lastKick(tt) { if (kickFrozen(tt)) return null; let k = null; for (const t0 of KICKS) if (tt >= t0) k = t0; return k; }
  function jump(tt, c) {
    if (tt < JUMP_FROM || (tt >= T528)) return 0;
    const k0 = lastKick(tt); if (k0 === null || k0 < JUMP_FROM) return 0;
    const last = Math.abs(k0 - K(522)) < 1e-6, age = tt - k0 - c.lag * FR * 0.5, up = (last ? 1 : 2) * FR, dn = (last ? 1.5 : 3) * FR;
    const amp = c.amp * (KICK_RUN.some(t => Math.abs(t - k0) < 1e-6) ? 2 : 1);          // the kick run k505-k507.5: twice as high
    if (age < 0) return 0; if (age < up) return amp * smooth(age / up); if (age < up + dn) return amp * (1 - (age - up) / dn) ** 2 * (last ? 0.6 : 1); return 0;
  }
  function fallenCards(ctx, tt) {
    for (const c of CARDS) {
      const h = jump(tt, c);
      ctx.save(); ctx.translate(c.x, -(1.0 + 0.004 + h)); ctx.rotate(c.rot + h * 3);
      // drawn as a card lying a little tilted towards us (its face 2.4 cm tall, the teal header band and a pencil mark): in the
      // seven-lane wide the old 1.2 cm sliver did not read as a card (2026-11-21 review)
      ctx.fillStyle = rgba(INK_RGB, 0.35); ctx.fillRect(-0.075 + 0.005, -0.005, 0.15, 0.012);
      ctx.beginPath(); ctx.moveTo(-0.075, 0); ctx.lineTo(0.075, 0); ctx.lineTo(0.068, -0.024); ctx.lineTo(-0.082, -0.024); ctx.closePath();
      ctx.fillStyle = PAPER_CARD; ctx.fill(); ctx.strokeStyle = rgba(TEAL_RGB, 0.9); ctx.lineWidth = 0.0025; ctx.stroke();
      ctx.fillStyle = rgba(TEAL_RGB, 0.9); ctx.beginPath(); ctx.moveTo(-0.082, -0.024); ctx.lineTo(0.068, -0.024); ctx.lineTo(0.0665, -0.019); ctx.lineTo(-0.0835 + 0.003, -0.019); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(INK_RGB, 0.85); ctx.fillRect(-0.045, -0.013, 0.05, 0.004);
      ctx.fillStyle = rgba(TEAL_RGB, 0.6); for (let i = 0; i < 5; i++) ctx.fillRect(0.012 + i * 0.011, -0.0125, 0.006, 0.003);
      ctx.restore();
    }
  }
  // the empty clip at the end of a lanyard: a kicked, damped pendulum on every beat; still through the stop
  function swing(tt, seed) {
    if (kickFrozen(tt)) tt = TSTOP;
    let a = 0;
    for (const t0 of KICKS) if (tt >= t0 && t0 <= tt) { const age = tt - t0; if (age > 1.2) continue; a += (seed % 2 ? 1 : -1) * 0.16 * Math.exp(-age / 0.22) * Math.sin(age / 0.36 * Math.PI * 2); }
    return a;
  }
  // 2026-11-22 (third review MUST, review item 3, same class as「颈绳和图不是一块的」): where a drawing's strand is measured (seg15_parts.json
  // lan.sty / lan.dirs: its own width, outline, outline and core colours, core screen, direction at the cut end, drawing px),
  // the code strand is that strand continued: it leaves the end along the drawn direction (a quadratic, so no kink), starts
  // inside the drawn strand (its cut cap is covered by the core), and has the drawn width, outline and core; the clip is
  // outlined in the same ink. st: { sty, dirs, unit (world per drawing px), tone (the drawing's brightness), under }.
  // 2026-11-22 fourth round (review r3 MUST: two drawings without sty fell back to a plain solid teal line that looked nothing
  // like their drawn strand): there is NO default strand any more. A lan without sty throws here (and is a PART AUDIT
  // problem); under (no strand drawn, it comes out from under an edge): start exactly on that edge; sty.ov: how far into the
  // drawn end to start (a fitting: its edge).
  const corePats = new Map();
  function corePattern(ctx, sty, unit, tone) {
    const D = sty.dots, k = `${sty.cc}|${D.pitch}|${D.r}|${D.col}|${tone}`, SS = 4, P = D.pitch;
    let p = corePats.get(k);
    if (!p) {
      const n = Math.round(P * 2 * SS), [c, x] = mk(n, n), tn = v => v.map(u => Math.round(u * tone));
      x.fillStyle = rgba(tn(sty.cc), 1); x.fillRect(0, 0, n, n); x.fillStyle = rgba(tn(D.col), 1);
      for (const [cx, cy] of [[0.5, 0.5], [1.5, 0.5], [1, 1.5], [0, 1.5], [2, 1.5]]) { x.beginPath(); x.arc(cx * P * SS, cy * P * SS, D.r * SS, 0, 7); x.fill(); }
      p = ctx.createPattern(c, 'repeat'); corePats.set(k, p);
    }
    p.setTransform(new DOMMatrix().scaleSelf(unit / SS, unit / SS));
    return p;
  }
  function clip(ctx, ends, tt, seed, len = 0.13, small = 1, st = null) {
    const [[ax, ay], [bx, by]] = ends, a = swing(tt, seed), top = Math.max(ay, by);   // y = -height: the lower end is the larger y
    const mx = (ax + bx) / 2, kx = mx + Math.sin(a) * len, ky = top + Math.cos(a) * len;
    if (!st || !st.sty || !st.dirs) throw new Error(`seg_15 clip(): a lanyard without its measured style (seg15_parts.json sty + dirs); no default strand (seed ${seed})`);
    let ink, inkW;
    {
      const { sty, dirs, unit, tone = 1, under = false } = st, col = c => rgba(c.map(v => Math.round(v * tone)), 1);
      const w = sty.w * unit, o = Math.min(sty.o, sty.w / 2) * unit, solid = !sty.cc || sty.o * 2 >= sty.w;
      const ov = (under ? 0 : sty.ov ?? (solid ? 2.5 : sty.o + 2.5)) * unit;   // back up the drawn strand, past its cut cap
      const paths = ends.map(([ex, ey], i) => { const [dx, dy] = dirs[i], L = Math.hypot(kx - ex, ky - ey);
        return [ex - dx * ov, ey - dy * ov, ex + dx * L * 0.45, ey + dy * L * 0.45]; });
      ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
      const stroke = (wid, style) => { ctx.strokeStyle = style; ctx.lineWidth = wid;
        for (const [sx, sy, cx, cy] of paths) { ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, kx, ky); ctx.stroke(); } };
      stroke(w, col(sty.oc));
      if (!solid) stroke(w - 2 * o, sty.dots ? corePattern(ctx, sty, unit, tone) : col(sty.cc));
      ink = col(sty.oc); inkW = Math.max(unit * 1.5, Math.min(o, w * 0.3));
    }
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(-a);
    const cw = 0.026 * small, ch = 0.02 * small, tone = st && st.tone ? st.tone : 1;
    ctx.fillStyle = rgba([235, 238, 236].map(v => Math.round(v * tone)), 0.97); rrect(ctx, -cw / 2, -inkW, cw, ch + inkW, cw * 0.18); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = inkW; ctx.stroke();
    ctx.fillStyle = ink; ctx.fillRect(-cw * 0.3, ch * 0.72, cw * 0.6, Math.max(0.0025 * small, inkW * 0.8));
    ctx.restore();
  }
  // the measured style of a drawing's part, for clip(): unit = world per drawing px of that drawing as drawn
  const styOf = (part, unit, tone = 1) => part && part.sty ? { sty: part.sty, dirs: part.dirs, unit, tone, under: !!part.under } : null;
  // a town drawing on layer fs at x: scaled about the 1.40 m eye line
  function person(ctx, k, fs, x, tt, turned) {
    const f = TOWN[k], file = turned && f.turn ? f.turn : f.file, im = IM[turned && f.turn ? k + '_turn' : k], s = 1 / f.ppm;
    ctx.save(); ctx.translate(x, -1.4); ctx.scale(fs, fs); ctx.translate(-x, 1.4);
    ctx.drawImage(im, x - f.cx * s, -f.top, im.width * s, im.height * s);
    // the drawing's ONE transform (x - cx*s, -top, s) carries its parts too: the stubs measured on THIS drawing (seg15_parts.json)
    const toW = ([px, py]) => [x + (px - f.cx) * s, -f.top + py * s], lan = lanOf(file);
    // (the drawing was toned for depth: the strand continues in the drawing's own tone)
    if (lan) { USED_LAN.set(file, im); clip(ctx, lan.ends.map(toW), tt, k.charCodeAt(1) + Math.round(fs * 10), lan.len ?? 0.13, 1, styOf(lan, s, toneOf[k] ?? 1)); }
    if (f.kid) { const kd = partOf(PA, file, 'kid'); clip(ctx, kd.ends.map(toW), tt, 7, 0.08, 0.7, styOf(kd, s, toneOf[k] ?? 1)); }
    ctx.restore();
  }
  const USED_LAN = new Map();        // drawing -> image, for PART AUDIT
  function town(ctx, rows, tt, which, turned) { for (const [k, fs, x] of rows) if (which(fs)) person(ctx, k, fs, x, tt, turned); }
  // her drawing on screen (no code strings: 2026-11-21 third round), through its one placement (herPlace)
  function her(ctx, name) {
    const im = IM[name], [x0, y0, s] = herPlace(name);
    ctx.drawImage(im, x0, y0, im.width * s, im.height * s);
  }
  // HALO MASK (2026-11-21 second review, 根因清单 「墙上的答题椭圆在近景里正好套在人头上」, same rule as seg_14.js buildOvals):
  // the silhouettes of everyone a shot can show (both drawings of a person who turns; her every drawing of that shot), drawn
  // in world metres at 50 px/m exactly as person() and her() place them. An oval keeps its full print only when no silhouette
  // comes within 0.155 m of its centre sideways (0.08 m clear of its ring) from 0.39 m below its centre (0.34 m clear over
  // a head) to 0.30 m above it; it fades to nothing over the last 5 cm.
  const HALO_SETS = new Map(), MP = 50, MXR = 6, MHT = 3.4;
  function haloMask(rows) {
    let e = HALO_SETS.get(rows); if (e) return e;
    const mw = 2 * MXR * MP, mh = MHT * MP, [c, x] = mk(mw, mh);
    const hersOf = rows === ROW_WIDE ? ['R15_play_a', 'R15_play_b', 'R15_play_c', 'R15_look']
      : ['R15_play_d1', 'R15_play_d2', 'R15_play_d3', 'R15_play_d4', 'R15_play_e3', ...S7NAMES];
    for (const [k, fs, px] of rows) {
      const f = TOWN[k], s = 1 / f.ppm;
      for (const im of [IM[k], f.turn ? IM[k + '_turn'] : null]) { if (!im) continue;
        x.setTransform(MP, 0, 0, MP, MXR * MP, MHT * MP); x.translate(px, -1.4); x.scale(fs, fs); x.translate(-px, 1.4);
        x.drawImage(im, px - f.cx * s, -f.top, im.width * s, im.height * s); }
    }
    for (const n of hersOf) {
      const im = IM[n], [x0, y0, s] = herPlace(n);
      x.setTransform(MP, 0, 0, MP, MXR * MP, MHT * MP); x.drawImage(im, x0, y0, im.width * s, im.height * s);
    }
    const d = x.getImageData(0, 0, mw, mh).data, SAT = new Float64Array((mw + 1) * (mh + 1));
    for (let yy = 0; yy < mh; yy++) { let row = 0;
      for (let xx = 0; xx < mw; xx++) { row += d[(yy * mw + xx) * 4 + 3] > 60 ? 1 : 0; SAT[(yy + 1) * (mw + 1) + xx + 1] = SAT[yy * (mw + 1) + xx + 1] + row; } }
    const sum = (x0, y0, x1, y1) => {           // mask px, inclusive-exclusive, clamped
      x0 = Math.max(0, Math.min(mw, Math.floor(x0))); x1 = Math.max(0, Math.min(mw, Math.ceil(x1)));
      y0 = Math.max(0, Math.min(mh, Math.floor(y0))); y1 = Math.max(0, Math.min(mh, Math.ceil(y1)));
      if (x1 <= x0 || y1 <= y0) return 0;
      const W1 = mw + 1; return SAT[y1 * W1 + x1] - SAT[y0 * W1 + x1] - SAT[y1 * W1 + x0] + SAT[y0 * W1 + x0];
    };
    const clear = (X, Hc, m) => sum((X - 0.155 - m + MXR) * MP, (MHT - (Hc + 0.30 + m)) * MP, (X + 0.155 + m + MXR) * MP, (MHT - (Hc - 0.39 - m)) * MP) === 0;
    e = { alpha: (X, Hc) => { let n = 0; for (const m of [0, 0.0125, 0.025, 0.0375, 0.05]) if (clear(X, Hc, m)) n++; return n / 5; } };
    HALO_SETS.set(rows, e); return e;
  }
  function hall(ctx, tt, { rows, rin, ox = 0, turned = false }) {
    wall(ctx, tt, ox, rows);
    town(ctx, rows, tt, fs => fs < 0.8, turned);
    town(ctx, rows, tt, fs => fs > 0.8 && fs < 1, turned);
    lightCells(ctx, tt);
    town(ctx, rows, tt, fs => fs === 1, turned);
    if (rin) her(ctx, rin);
    doors(ctx, tt);
    cabinets(ctx, tt);
    fallenCards(ctx, tt);
  }

  // ================================================================================================================
  // the cameras: a framing is [centre x, bottom edge height, width] in metres (16:9)
  // ================================================================================================================
  const shoot = ([cx, bot, wid], draw) => {
    const ppm = W / wid;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = GRAPHITE_FIELD; g.fillRect(0, 0, W, 1080);
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.setTransform(ppm, 0, 0, ppm, W / 2 - cx * ppm, 1080 + bot * ppm);
    draw(g, ppm); g.restore();
  };
  const zoomAbout = ([cx, bot, wid], z, [ax, ah]) => [ax + (cx - ax) / z, ah + (bot - ah) / z, wid / z];
  // S2 (2026-11-21 third round: the 13-notch "second hand" push stepped the whole frame on every beat, the dizziest run of the
  // film): W7 (6.8 m, bottom 0.30 m) still until k492, then ONE eased push to F3 (3.64 m, bottom 0.58 m) about (0, 0.9025),
  // smoothstep k492 -> k508 (its corners never accelerate more than ~0.1 px/frame^2: no jolt), so the cut on k508 meets it
  // at rest. The beats live in the frame: doors, the second hand's tick, the cards.
  const W7 = [0, 0.30, 6.8], ZF3 = 6.8 / 3.64, ANCH2 = [0, 0.9025];
  function camS2(tt) {
    const u = ease((tt - TICK_FROM) / (T508 - TICK_FROM));
    return zoomAbout(W7, Math.pow(ZF3, u), ANCH2);
  }
  // S3 + S4 (2026-11-21 third round, back to the design: 「一开场就在动」): the pan P (1.62 m wide, bottom 0.97 m = just under the
  // cabinet tops) cuts in already moving at x -2.45 and runs evenly (V) to k514; from k514 it slows (a quadratic, the speed
  // continuous at k514) to M3's x (0) at k522.25, still moving a little there (S1V m/s), and stops dead with the music and
  // the clock; the pull-back to M3 (2.1 m wide, bottom 0.80 m) eases in and out over the same stretch, so it adds no kick at
  // either end. S4: still through the stop and the turn; from k524 (crash: the flash, her eyes) an eased creep in about
  // (0, 1.60) to x1.12 at the cut on k528.
  const P_W = 1.62, P_BOT = 0.97, M3 = [0, 0.80, 2.1], XA = -2.45, ANCH4 = [0, 1.60];
  const TP1 = T514 - T508, TP2 = TSTOP - T514, S1V = 0.2, V = (-2 * XA - S1V * TP2) / (TP2 + 2 * TP1);
  const XB = XA + V * TP1, D = -XB;                     // x at k514, and the distance left to x 0
  function camS3(tt) {
    if (tt < T514) return [XA + V * (tt - T508), P_BOT, P_W];
    if (tt < TSTOP) {
      const u = (tt - T514) / TP2, s0 = V * TP2, x = XB + s0 * u + (D - s0) * u * u, f = ease(u);
      return [x, P_BOT + (M3[1] - P_BOT) * f, P_W + (M3[2] - P_W) * f];
    }
    if (tt < T524) return M3;
    const u = Math.min(1, (tt - T524) / (T528 - T524));
    return zoomAbout(M3, 1 + 0.12 * u * u, ANCH4);
  }
  const wallOff = tt => tt < TSTOP ? 0.4 * camS3(tt)[0] : 0;
  // S7a: WU 1.62 m wide, bottom 0.77 m, centred on her (吉田 and 佐藤 the narrow strips at the edges). k544 (the heavy strum) the
  // segment's one 大击: in 3.5% about her chest (0, 1.15) in two frames, one way, held (corners 2.1% of the width); k548-k552
  // the frame rises slowly (5 cm, eased in AND out: 2026-11-22, there is no cut on k552 any more to hide a stop) as she stops
  // playing, and is at rest when the guitar lands on her shoulder on k552; still to the end (the gold body's top, 1.66 m,
  // stays ~0.1 m inside the top edge, 1.76 m).
  const WU = [0, 0.77, 1.62];
  function camS7(tt) {
    let f = WU;
    if (tt >= T544) f = zoomAbout(WU, 1 + 0.035 * Math.min(1, ((tt - T544) / FR + 1) / 2), [0, 1.15]);
    if (tt >= T548) { const u = ease((tt - T548) / (T552 - T548)); f = [f[0], f[1] + 0.05 * u, f[2]]; }
    return f;
  }

  // ================================================================================================================
  // S1: her card (segment 14's poster frame, the same drawing and place), slipping on k489.5 and dropping out on k491
  // ================================================================================================================
  // The face is her_card.js (docs/卡面状态.md; the film's one card face), in its settled 'title' state (k488 is long after 03
  // k40): the band in the name field, ロストワン in the 学籍番号 rows, の号哭 in the 偏差値 rows, the grid under the title
  // pressed. No coordinates of the face are written here. Her words from segment 14 (もうどうだって／いいや, her pencil, written
  // as she sang them on k484-k488) are her_card.js's drawHerWords: the one layout 14 and 15 share (right of の号哭, under
  // ロストワン), so the poster frame is the same card in both segments.
  // The poster frame is segment 14's: her_card.js POSTER_FRAME, one set of numbers for both (14's flight lands on it): the card
  // 1878 px wide, square to the lens, the frame's top edge 0.0389 card widths below the card's top. Everything printed on the
  // face is whole in the frame through the landing, the wobble and the slip (2026-11-21 review MUST: at 2050 px / 0.076u the
  // frame's top edge cut the band's raised right end, and after the slip the header row stood half in the frame); the card's
  // side edges show, 21 px a side; the timing marks stay below the frame. Checked frame by frame below (FRAME AUDIT S1).
  const CU2400 = 2400;
  const POSTER_W = POSTER_FRAME.width, POSTER_TOP = POSTER_FRAME.top;
  const FACE_L = herCardFace(CU2400, { state: 'title' }), [FC, fcx] = mk(CU2400, CU2400 / CARD_RATIO);
  const FW1 = POSTER_W / W, T_THROW = K(484);
  const IMPACT = [W / 2, -POSTER_TOP * POSTER_W + POSTER_W / CARD_RATIO / 2];
  // the card's pose at tt (screen space): centre (x, y), width w, the turn rot, the squeeze sx, sy; null once it has dropped out
  // 2026-11-21 third round: the card fills the frame, so its landing pulse, its wobble and its slip moved the whole frame; it
  // now lies dead still from k488 (14's flight ends square on it) to k491, the stillness before the band's hardest hit, and
  // drops out in four frames on k491 (a registered whip: one way, out through the bottom edge)
  function cardPose(tt) {
    const frac = FW1, rot0 = 0, sx = 1, slip = 0;
    const fi = tt >= T491 ? Math.floor((tt - T491) / FR + 1e-6) : -1;
    const drop = fi < 0 ? 0 : [150, 420, 820, 1400][Math.min(3, fi)], tip = fi < 0 ? 0 : [0.01, 0.025, 0.045, 0.07][Math.min(3, fi)];
    if (fi > 3) return null;
    return { x: IMPACT[0], y: IMPACT[1] + slip + drop, w: frac * W, rot: rot0 + tip, sx, sy: 1 - tip * 1.2, slip, dropping: fi >= 0 };
  }
  function card(tt) {
    const p = cardPose(tt); if (!p) return;
    const w = p.w, h = w / CARD_RATIO;
    fcx.setTransform(1, 0, 0, 1, 0, 0); fcx.clearRect(0, 0, FC.width, FC.height); fcx.drawImage(FACE_L, 0, 0);
    drawHerWords(fcx, CU2400, L53b, tt);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(p.sx, p.sy);
    // segment 14's card under its face: the shadow (0.35, offset 1.2% / 1.56% of the width) and the card's teal edge (0.65)
    g.fillStyle = 'rgba(14,14,18,0.35)'; g.fillRect(-w / 2 + w * 0.012, -h / 2 + w * 0.0156, w, h);
    g.fillStyle = rgba(TEAL_RGB, 0.65); g.fillRect(-w / 2, -h / 2 + w * 0.004, w, h);
    g.drawImage(FC, -w / 2, -h / 2, w, h);
    g.restore();
  }

  // ================================================================================================================
  // S5, S6: the two close-ups (screen space). The backboard: the black wall close up (graphite, the oval print) and the
  // light of the lanes far below; the figure drawing (portrait, the figure free of the side and top edges) under the frame.
  // ================================================================================================================
  // avoid: screen circles [x, y, r] (the heads): no oval is printed behind a head (an oval round a head read as a halo or a
  // memorial frame: 2026-11-21 review)
  function closeWall(ox, oy, ppm, avoid = []) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = GRAPHITE_FIELD; g.fillRect(0, 0, W, 1080);
    g.save(); g.setTransform(ppm, 0, 0, ppm, ox, oy);
    g.fillStyle = graphite(g, 2048 / ppm * 0.9); g.fillRect(-2, -2, 4 + W / ppm, 4 + 1080 / ppm);
    g.strokeStyle = PRINT; g.lineWidth = 0.007;
    for (let ri = -1; ri < 6; ri++) for (let x = -0.6; x < W / ppm + 0.6; x += 0.27) {
      const ex = x + (ri % 2 ? 0.135 : 0), ey = ri * 0.2 + 0.08, sx = ox + ex * ppm, sy = oy + ey * ppm;
      if (avoid.some(([ax, ay, ar]) => Math.hypot(sx - ax, sy - ay) < ar + 0.09 * ppm)) continue;
      g.beginPath(); g.ellipse(ex, ey, 0.075, 0.05, 0, 0, 7); g.stroke(); }
    g.restore();
  }
  // a close-up drawing (screen px: scale, top-left x, y) and, when its lanyard is measured (lan: the seg15_parts.json entry of
  // THIS drawing), the strands and the empty clip continued from its own ends in its own style; ppm: screen px per metre
  function lanAt(lan, { scale, x, y, ppm, tt, seed, len, small = 1, tone = 1 }) {
    if (!lan) return;
    const sp = ([px, py]) => [(x + px * scale) / ppm, (y + py * scale) / ppm];
    g.save(); g.setTransform(ppm, 0, 0, ppm, 0, 0); clip(g, lan.ends.map(sp), tt, seed, len, small, styOf(lan, scale / ppm, tone)); g.restore();
  }
  function behind(im, scale, x, y, lan = null, o = {}) {
    g.save(); g.setTransform(scale, 0, 0, scale, x, y); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0); g.restore();
    lanAt(lan, { scale, x, y, ...o });
  }
  function closeUp(im, { scale, x, y, lan = null, lanLen = 0.04, ppm, kid = false }, tt) {
    g.save(); g.setTransform(scale, 0, 0, scale, x, y); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(im, 0, 0);
    g.restore();
    lanAt(lan, { scale, x, y, ppm, tt, seed: 3, len: lanLen, small: kid ? 0.7 : 1 });
  }
  const CUS = A.closeups;

  // ================================================================================================================
  // audits: the rubbed line against the frame in S2 (the only text in the hall); layout: the card words are segment 14's
  // ================================================================================================================
  const PPMB = W / 6.8, sheetMap = ([x, y]) => [(x + 3.4) * PPMB, (y + 0.30 + 1080 / PPMB) * PPMB];
  const viewOf = (t, [cx, bot, wid]) => { const z = 6.8 / wid, ch = bot + wid * 9 / 32; return { t, z, fx: (cx + 3.4) * PPMB, fy: (-ch + 0.30 + 1080 / PPMB) * PPMB }; };
  LAY.frameCheck('wall line in the wide (S2)', { sheets: { world: sheetMap }, views: frameTimes(T0, T491, T508).map(t => viewOf(t, camS2(t))) });
  // her card (S1): her words against the face's printed lines and its own labels (her_card.js herCardBoxes, the card at
  // 2400 px), so nothing she wrote lies over 読み取れません, ロストワン, の号哭 or a label; then the poster frame through the
  // whole hold, EVERY frame from k488 to the drop (the landing's bounce, the wobble, the slip at k489.5 and the frames after
  // it; 2026-11-21 review MUST: only k488 itself was checked, so the slip's frames were never seen): every word on the face
  // (the band, as her_card.js measures its tilted ink, both title lines, her words, the header row, the labels, the こころ
  // row) wholly in, with a margin of the wobble's largest turn at the card's side edges; the timing marks wholly out by the
  // same margin. The drop (k491 on, four frames) takes the card out through the frame's bottom edge on purpose and is not
  // checked. The view of each frame: the card's centre, width and slip from cardPose (its turn is the inset).
  { const { lines, labels } = herCardBoxes(CU2400, { state: 'title' });
    for (const [n, b] of Object.entries(lines)) LAY.reg(`card line ${n}`, 'card', b);
    for (const [n, b] of Object.entries(labels)) LAY.reg(`card label ${n}`, 'card', b);
    const HWB = herWordsBoxes(CU2400);
    for (const [n, b] of Object.entries(HWB)) LAY.text(n, 'card', b);
    LAY.audit('her card face (S1)');
    for (const [n, b] of Object.entries(lines)) LAY.text(`poster ${n}`, 'poster', b);
    for (const [n, b] of Object.entries(HWB)) LAY.text(`poster ${n}`, 'poster', b);
    for (const [n, b] of Object.entries(labels)) LAY.text(`poster ${n}`, 'poster', b);
    LAY.audit('poster frame (S1)');
    const U = CU2400;
    LAY.text('poster timing marks', 'poster:out', [U * 0.229, U * 0.618, U * 0.624, U * 0.026]);
    LAY.reg('poster corner mark top left', 'poster:marks', [U * 0.035, U * 0.035, U * 0.025, U * 0.025]);
    LAY.reg('poster corner mark top right', 'poster:marks', [U * 0.94, U * 0.035, U * 0.025, U * 0.025]);
    LAY.reg('poster corner mark bottom left', 'poster:marks', [U * 0.035, U * 0.605, U * 0.025, U * 0.025]);
    LAY.reg('poster corner mark bottom right', 'poster:marks', [U * 0.94, U * 0.605, U * 0.025, U * 0.025]);
    LAY.reg('poster clip slot', 'poster:marks', [U * 0.4, U * 0.022, U * 0.2, U * 0.028]);
    const held = frameTimes(T0, T488, T491 + 4 * FR).map(t => [t, cardPose(t)]).filter(([, p]) => p && !p.dropping);
    const views = held.map(([t, p]) => { const z = p.w / U; return { t, z, fx: U / 2 - (p.x - W / 2) / z, fy: U / CARD_RATIO / 2 - (p.y - 540) / z }; });
    const turnPx = Math.ceil(Math.max(...held.map(([, p]) => Math.abs(p.rot) * p.w / 2 + (1 - p.sy) * p.w / CARD_RATIO / 2))) + 1;
    const id = p => p;
    LAY.frameCheck(`poster frame S1 (every held frame, words in by ${turnPx} px)`, { sheets: { poster: id }, views, inset: turnPx });
    LAY.frameCheck(`poster frame S1 (timing marks out by ${turnPx} px)`, { sheets: { 'poster:out': id }, views, inset: -turnPx });
    LAY.frameCheck('poster frame S1 (corner marks and clip slot)', { sheets: { 'poster:marks': id }, views });
    // the margins themselves, per frame (px): the nearest word to the top and bottom edges, the timing marks below the bottom
    const PB = Object.fromEntries(LAY.boxes.filter(b => b.sheet === 'poster' || b.sheet === 'poster:out').map(b => [b.name, b]));
    const marg = views.map(v => { let top = Infinity, bot = Infinity, tim = Infinity;
      for (const b of Object.values(PB)) { const [, y, , h] = b.box, sy0 = 540 + (y - v.fy) * v.z, sy1 = 540 + (y + h - v.fy) * v.z;
        if (b.sheet === 'poster') { top = Math.min(top, sy0); bot = Math.min(bot, 1080 - sy1); } else tim = Math.min(tim, sy0 - 1080); }
      return { f: Math.round(v.t * 30), top, bot, tim }; });
    const mn = k => marg.reduce((a, m) => m[k] < a[k] ? m : a);
    console.warn(`FRAME AUDIT poster frame S1 margins over ${marg.length} frames (f${marg[0].f}-f${marg[marg.length - 1].f}, wobble allowance ${turnPx} px): ` +
      `words to the top edge least ${mn('top').top.toFixed(1)} px (f${mn('top').f}), words to the bottom edge least ${mn('bot').bot.toFixed(1)} px (f${mn('bot').f}), ` +
      `timing marks below the bottom edge least ${mn('tim').tim.toFixed(1)} px (f${mn('tim').f})`); }
  // ================================================================================================================
  // the close-ups' push (S5, S6) and every frame's view as shown (MOTION AUDIT)
  // ================================================================================================================
  // 2026-11-21 third round: one eased push per close-up (そうた 1 -> 1.06 k528-k536, さくら 1 -> 1.05 k536-k540) about the face,
  // at rest at both cuts; his fist on the collar (the swap on k532) is the beat
  const closeZ = t => t < T536 ? 1 + 0.06 * ease((t - T528) / (T536 - T528)) : 1 + 0.05 * ease((t - T536) / (T540 - T536));
  const closeAnchor = t => { const c = t < T536 ? CUS.sota : CUS.p6; return t < T536 ? [c.heads[0][0], c.heads[0][1] + 40] : [c.heads[0][0], c.heads[0][1]]; };
  // a framing [cx, bot, wid] (metres) as a view: screen = (W/2, 540) + (world - (fx, fy)) * z, world y = -height
  const viewOfFraming = (t, [cx, bot, wid]) => { const z = W / wid; return { t, z, fx: cx, fy: -bot - 540 / z }; };
  const firstFrame = t => Math.ceil(t * FPS - 1e-9);
  const CUT_FRAMES = new Set([F0, ...[T508, T528, T536, T540].map(firstFrame)]);
  function viewAt(t) {
    const f = Math.round(t * FPS);
    if (t < T491 + 4 * FR) {                     // S1: the card fills the frame: its pose is the frame (card px of a 2400 px card)
      const p = cardPose(t);
      if (p) { const z = p.w / CU2400; return { t, z, fx: CU2400 / 2 - (p.x - W / 2) / z, fy: CU2400 / CARD_RATIO / 2 - (p.y - 540) / z, cut: f === F0, layer: 'card' }; }
    }
    if (t < T508) return { ...viewOfFraming(t, camS2(t)), layer: 'hall' };
    if (t < T528) return { ...viewOfFraming(t, camS3(t)), cut: CUT_FRAMES.has(f) };
    if (t < T540) { const z = closeZ(t), [ax, ay] = closeAnchor(t); return { t, z, fx: ax + (W / 2 - ax) / z, fy: ay + (540 - ay) / z, cut: CUT_FRAMES.has(f) }; }
    return { ...viewOfFraming(t, camS7(t)), cut: CUT_FRAMES.has(f) };
  }
  const VIEWS = frameTimes(T0, T0, T1).map(viewAt);
  // the first hall frame after the card has gone is a change of layer (card -> hall), not motion
  for (let i = 1; i < VIEWS.length; i++) if (VIEWS[i].layer === 'hall' && VIEWS[i - 1].layer === 'card') VIEWS[i].cut = true;
  const MOTION_R = motionAudit('seg_15', VIEWS, {
    big: [[T544, 'k544 重扫弦：画面中心的击打动作（单向推近 3.5%，两帧到位，停住）']],
    whips: [[T491, 'k491 卡整张掉出画面（乐队最重的一击，单向，四帧出画），露出大厅']] });

  // ================================================================================================================
  // PART AUDIT (web/lib/parts.js; 根因清单 「笔芯和笔不对了……吉他弦和吉他不是一块的」): every code part on every drawing it is
  // drawn on, against that drawing's own pixels. The parts here are the lanyard stubs the empty clips hang from: the end on the
  // drawn strap (teal line) and the strap still there 4 px up it; where no strap is drawn (lan.under: the strand comes out
  // from under a collar or neckline) the end on that drawn edge (t01_p9 was listed as one of these; it does draw a narrow strand
  // into the hoodie's V, now measured as cased). Her drawings carry no code part any more (no code strings).
  // ================================================================================================================
  const STYLE_BAD = [], STYLE_OK = [], FIT = [];     // the lanyard STYLE audit below (counted in PART AUDIT's problems)
  { const strap = ([r, gg, b, a]) => a > 200 && gg - r > 45 && b - r > 45;
    const audited = new Map();
    for (const [k, f] of Object.entries(TOWN)) for (const [file, key] of [[f.file, k], [f.turn, k + '_turn']]) if (file && lanOf(file)) audited.set(file, IM[key]);
    for (const n of ['f15_sota_a', 'f15_sota_b', 'f15_p6_a', 'f15_p6c', 'f15_p6_c2']) if (lanOf(n)) audited.set(n, CU[n]);
    if (lanOf('f15_n4_bg')) audited.set('f15_n4_bg', RAW_N4);
    // a strand with a measured style (sty): both of its drawn outline edges, 4 px up from the cut end, must be on the drawn strap
    // (so the code strand of that width, from that centre, along that direction, lies exactly on the drawn one)
    const edgePts = (part, i) => { const [x, y] = part.ends[i], [dx, dy] = part.dirs[i], h = part.sty.w / 2 - Math.max(1, Math.min(part.sty.o, part.sty.w / 2) / 2);
      const cx = x - dx * 4, cy = y - dy * 4; return [[cx - dy * h, cy + dx * h], [cx + dy * h, cy - dx * h]]; };
    const ptsOf = part => part.under ? part.ends.map(([x, y]) => [x, y]) : part.sty ? part.ends.flatMap((_, i) => edgePts(part, i)) : part.ends.flatMap(([x, y]) => [[x, y], [x, y - 4]]);
    // STYLE (2026-11-22 fourth round, review r3 MUST 「颈绳和图仍不是一块的」: two drawings had no sty and clip() quietly drew a
    // plain solid teal line; n3_turn2's registered width was twice the drawn one): every lan / kid must carry sty + dirs
    // (missing = PROBLEM, no default), every drawn strand must be classed cased / light, and the drawn strand just above the end
    // must look like its sty in the drawing's own pixels (in the drawing's tone): at 4, 6, 8 px up its centre is the core
    // colour (solid: the ink), ±(w/2 - 1) is the outline ink (the width is not too wide) and ±(w/2 + 1.5) is NOT the ink (not
    // too narrow; skipped where the strand lies on a ground of its own ink, sty.ground 'dark'). sty.fit (the drawn end is a
    // fitting, the strand style is read above it) is checked by hand only: listed.
    const inkLike = (c, ref, tol) => c[3] > 200 && Math.hypot(c[0] - ref[0], c[1] - ref[1], c[2] - ref[2]) <= tol;
    const styleAudit = (file, part, a, im, tn) => {
      const lab = `${file} ${part}`;
      if (!a.sty || !a.dirs) { STYLE_BAD.push(`${lab}: no sty/dirs (no default strand: measure it on this drawing)`); return; }
      if (a.under) { STYLE_OK.push(`${lab} (under: no drawn strand)`); return; }
      if (a.class !== 'cased' && a.class !== 'light') { STYLE_BAD.push(`${lab}: drawn strand not classed cased/light`); return; }
      if (a.sty.fit) { FIT.push(lab); return; }
      const S = a.sty, px = pixelsOf(im), T = c => c.map(v => v * tn), solid = !S.cc || S.o * 2 >= S.w, oc = T(S.oc), cc = solid ? oc : T(S.cc);
      const bad = [];
      a.ends.forEach(([x, y], i) => {
        const [dx, dy] = a.dirs[i], o0 = solid ? 2 : Math.min(S.o, S.w / 2); let core = 0, inner = 0, outer = 0;
        // above the drawn cut end's own cap (an outline as thick as the strand's): o + 2, 4, 6 px up; a 1-2 px core or edge is
        // anti-aliased, so the nearest pixel within ±1 px (core) / ±0.5 px (outline) across the strand counts
        const fr = S.from ?? o0 + 2;                  // sty.from: start higher where another drawn line runs along the strand's end
        for (const b of [fr, fr + 2, fr + 4]) {
          const cx = x - dx * b, cy = y - dy * b, at = o => px.at(cx - dy * o, cy + dx * o), any = (os, ref, tol) => os.some(o => inkLike(at(o), ref, tol));
          if (any([-1, -0.5, 0, 0.5, 1], cc, 50)) core++;
          // (a solid line: its outer half-pixel, w/2 - 0.5, no slack: a 6 px registration on a 4.5 px line fails here)
          for (const sg of [-1, 1]) { const e = S.w / 2 - 1; if (any((solid ? [S.w / 2 - 0.5] : [e - 0.5, e, e + 0.5]).map(v => sg * v), oc, 65)) inner++;
            if (S.ground === 'dark' || !inkLike(at(sg * (S.w / 2 + 1.5)), oc, 65)) outer++; }
        }
        if (core < 2) bad.push(`end ${i} core not ${solid ? 'the ink' : 'the core colour'} (${core}/3)`);
        if (inner < 4) bad.push(`end ${i} outline not at ±w/2 (${inner}/6: sty too wide or wrong ink)`);
        if (outer < 4) bad.push(`end ${i} ink beyond ±w/2 (${outer}/6: sty too narrow)`);
      });
      (bad.length ? STYLE_BAD : STYLE_OK).push(bad.length ? `${lab}: ${bad.join(', ')}` : lab);
    };
    const toneOfFile = file => { for (const [k, f] of Object.entries(TOWN)) if (f.file === file || f.turn === file) return toneOf[k] ?? 1; return 1; };
    for (const [file, im] of audited) {
      const a = lanOf(file), on = a.class === 'opaque' ? PIX.opaque : a.class === 'light' ? PIX.opaque : strap;
      partAudit('seg_15', file, 'lanyard stubs', { image: im, on, r: 3, maxOffPct: 0, points: ptsOf(a) });
      styleAudit(file, 'lan', a, im, toneOfFile(file));
      if (PA[file].kid) { const kd = partOf(PA, file, 'kid');
        partAudit('seg_15', file, 'kid lanyard stubs', { image: im, on: strap, r: 3, maxOffPct: 0, points: ptsOf(kd) });
        styleAudit(file, 'kid', kd, im, toneOfFile(file)); }
    }
    // every registered lan in the file is audited (a drawing registered but not on screen in this segment is still checked)
    for (const n of Object.keys(PA)) if (!n.startsWith('_') && PA[n].lan && !audited.has(n)) STYLE_BAD.push(`${n} lan: registered but not audited (no image)`);
    console.warn(`PART AUDIT seg_15 lanyard STYLE: ${STYLE_OK.length + FIT.length} strands, ${STYLE_BAD.length} problems` +
      (STYLE_BAD.length ? ` -- PROBLEM: ${STYLE_BAD.join('; ')}` : '') + (FIT.length ? ` (fittings, looked at by hand: ${FIT.join(', ')})` : ''));
    // drawings that draw their whole lanyard themselves (no code part), for the record
    const noLan = [...Object.values(TOWN).flatMap(f => [f.file, f.turn]), 'f15_n5_bg'].filter(Boolean).filter(n => !lanOf(n));
    // each looked at on its own (2026-11-22, the third review: t15_p1h2(+_turn) and f15_n4_bg were listed here with their
    // strands cut square mid-shirt; now registered): t15_p8/t15_p8h draw the whole lanyard and pinch the empty clip; t15_p2/
    // t15_p2h draw no lanyard (coat closed, her hand flat on her chest); f15_n5_bg's strings are the hoodie's drawstrings with
    // their aglets, no lanyard. Anything else listed here is unchecked.
    const CHECKED = { t15_p8: 'draws lanyard + clip', t15_p8h: 'draws lanyard + clip', t15_p2: 'no lanyard drawn', t15_p2h: 'no lanyard drawn', f15_n5_bg: 'hoodie drawstrings, no lanyard' };
    const unchecked = noLan.filter(n => !CHECKED[n]);
    console.warn(`PART AUDIT seg_15 drawings without a code lanyard: ${noLan.map(n => `${n} (${CHECKED[n] ?? 'UNCHECKED'})`).join(', ')}` + (unchecked.length ? ` -- PROBLEM: unchecked ${unchecked.join(', ')}` : '')); }
  const PARTS_R = partReport('seg_15');
  PARTS_R.lanyardStyle = { ok: STYLE_OK, fittings: FIT, problems: STYLE_BAD }; PARTS_R.problems += STYLE_BAD.length;
  S.finish();
  publishAudit(S, LAY, { missing: MISSING, motion: MOTION_R, parts: PARTS_R,
    cameras: { S1: 'card dead still, drops out k491 (whip)', S2: 'W7 -> F3 one eased push k492-k508', S3: 'even pan from the cut, slows + pulls back from k514, dead stop k522.25',
               S4: 'still, eased creep from k524', S5S6: 'one eased push each', S7: 'WU, 大击 k544, eased rise k548-k552, still (the guitar lands on her shoulder k552 in the shot)' } });

  // ================================================================================================================
  // the frame
  // ================================================================================================================
  function drawFrame(t) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (t < T508) {                                                   // S1, S2: the seven-lane wide
      const rin = S.at('rin S2', t)?.name.split(' ')[0] ?? 'R15_play_a';
      shoot(camS2(t), ctx => hall(ctx, t, { rows: ROW_WIDE, rin }));
      if (t < T491 + 4 * FR) card(t);
      return;
    }
    if (t < T528) {                                                   // S3, S4: the pan, the stop, the turn
      const rin = S.at('rin S3', t).name.split(' ')[0];
      shoot(camS3(t), ctx => hall(ctx, t, { rows: ROW_NEAR, rin, ox: wallOff(t), turned: t >= TTURN }));
      return;
    }
    if (t < T540) {                                                   // S5, S6: the close-ups
      const c = t < T536 ? CUS.sota : CUS.p6, file = t < T532 ? 'f15_sota_a' : t < T536 ? 'f15_sota_b' : sakuraAt(t);
      const im = CU[file];
      const { scale, x, y, ppm } = c;
      const z = closeZ(t), [ax, ay] = closeAnchor(t);
      const PZ = (px, py) => [ax + (px - ax) * z, ay + (py - ay) * z];
      const sc = scale * z, [xx, yy] = PZ(x, y), b = c.bg, [bx, by] = PZ(b.x, b.y);
      const avoid = [...c.heads, ...b.heads].map(([hx, hy, hr]) => [...PZ(hx, hy), hr * z]);
      closeWall((-0.3 * ppm) * z + ax * (1 - z), (-0.2 * ppm) * z + ay * (1 - z), ppm * z, avoid);
      const bgFile = t < T536 ? 'f15_n5_bg' : 'f15_n4_bg';
      behind(t < T536 ? CUBG.n5 : CUBG.n4, b.scale * z, bx, by, lanOf(bgFile), { ppm: ppm * z, tt: t, seed: 5, len: 0.07, tone: t < T536 ? 0.5 : 0.62 });
      const lan = lanOf(file === 'f15_p6_cb' ? 'f15_p6_c2' : file);   // the strands measured on THIS drawing (the blink is c2's copy)
      closeUp(im, { scale: sc, x: xx, y: yy, lan, lanLen: lan && lan.len ? lan.len : c.lanLen, ppm: ppm * z, kid: t < T536 }, t);
      return;
    }
    const rin = S.at('rin S7', t).name.split(' ')[0];                 // S7: her waist shot, strum -> grip -> heave -> bat
    shoot(camS7(t), ctx => hall(ctx, t, { rows: ROW_NEAR, rin, turned: true }));
  }
  window.renderAt = async t => {
    drawFrame(t);
    const fl = flashOf(t);                                            // the crash flashes (k524, k540): paper white over all
    if (fl > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = rgba(PAPER_RGB, fl); g.fillRect(0, 0, W, 1080); }
  };
  await window.renderAt(P('t0', T0 + 0.1));
}
