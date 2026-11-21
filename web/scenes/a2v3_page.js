// The 2D demo, third version: A2 「数学と理科は好きですが / 国語がどうもダメで嫌いでした / 正しいのがどれか悩んでいりゃ /
// どれも不正解というオチでした」 (0:50.05-1:02.58). v2 was rejected as pale, small and unreadable ("an Excel screenshot"); this one
// is graphic and full-frame, in the film's inks: answer-sheet teal, correction red and black type on paper, over a flat teal field.
// One idea per beat:
//   S1  the sheet fills the frame and cuts on every beat between 数学 and 理科; her pencil fills one bubble per beat, a red
//       まる closes round it on the off-beat and the reader prints 正解 in its 16-dot head;
//   S2  国語: question 3 printed big in 16-dot, the pencil hovering from choice to choice on the beat;
//   S3  she fills ア イ ウ エ on every other beat; each gets a red cross and a big red 16-dot 不正解 stamp, and the stamps pile up;
//   S4  the field turns red, 不正解 covers it in rows, and 「どれも不正解というオチでした」 is set in big Mincho as it is sung.
// Her words (S1-S3) stand in a black vertical strip at the right, each character when it is sung (work/audio/lyrics_timed.json).
// The hand never slides across the page: it is at a bubble on the beat, lifts off it on the half beat and is at the next on the
// next beat (the swap on the beat, as her drawings change in the 3D part).
export async function a2v3(H) {
  const { g, W, P, rng, img, rinPalImage, pencilFill, erasedMark, inkjetText, pencilWrite } = H;
  const BEAT = 60 / 162, B0 = 0.354, LEAD = 1 / 30;
  const beatT = k => B0 + k * BEAT;
  const lyr = await (await fetch('/work/audio/lyrics_timed.json')).json();
  const line = text => lyr.find(x => x.text === text).chars.map(c => [c.c, c.t]);
  const L1 = line('数学と理科は好きですが'), L2 = line('国語がどうもダメで嫌いでした'), L3 = line('正しいのがどれか悩んでいりゃ'),
        L4 = line('どれも不正解というオチでした');
  const T_CUT = beatT(143), T_S3 = beatT(151), T_S4 = beatT(159);

  const FIELD = '#1f8ea3', FIELD_SH = '#14606e', PAPER = '#f7f5ef', TEAL = '#218ea3', INK = '#2a2a2f', GRAPHITE = '#2a2a2f';
  const INKRGB = [42, 42, 47], PAPERRGB = [247, 245, 239], TEALRGB = [33, 142, 163];
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };

  // ---------- the sheets: one canvas each, big type, big bubbles ----------
  const SW = 1560, SH = 1240;
  function paper(seed) {
    const [c, s] = mk(SW, SH), r = rng(seed);
    s.fillStyle = PAPER; s.fillRect(0, 0, SW, SH);
    // a faint fibre: short light strokes, so the paper is paper and not a flat fill
    for (let k = 0; k < 900; k++) { s.fillStyle = `rgba(160,150,130,${0.02 + r() * 0.03})`; s.fillRect(r() * SW, r() * SH, 2 + r() * 10, 1); }
    return [c, s];
  }
  function header(s, title, sub) {
    s.fillStyle = INK; s.textBaseline = 'top'; s.textAlign = 'left';
    s.font = '800 250px ShipporiX'; s.fillText(title, 70, 40);
    s.fillStyle = TEAL; s.font = '700 54px ZenKakuB'; s.fillText(sub, 620, 92);
    s.font = '500 27px ZenKaku'; s.fillText('令和八年度　第二学期　期末考査　（マーク式）', 622, 176);
    s.strokeStyle = TEAL; s.lineWidth = 5; s.strokeRect(1010, 70, 470, 120); s.fillStyle = TEAL; s.fillRect(1010, 70, 92, 120);
    s.fillStyle = PAPER; s.font = '700 34px ZenKakuB'; s.textAlign = 'center'; s.textBaseline = 'middle'; s.fillText('氏名', 1056, 130);
    pencilWrite(s, '鏡音　リン', 1130, 132, 64, { seed: 8, font: 'Yomogi', jitter: 3 });
    s.fillStyle = INK; for (const [x, y] of [[22, 22], [SW - 58, 22], [22, SH - 58], [SW - 58, SH - 58]]) s.fillRect(x, y, 36, 36);
  }
  // the answer grid: rows of numbered bubbles; bub(i, j) is the centre of bubble j in row i (sheet px)
  function grid(s, labels, rows, y0, dy, x0, dx, rx, ry, first = 1) {
    const bub = (i, j) => [x0 + j * dx, y0 + i * dy];
    s.fillStyle = 'rgba(33,142,163,0.12)'; s.fillRect(90, y0 - dy / 2 - 56, SW - 180, 46);
    s.fillStyle = TEAL; s.font = '700 26px ZenKakuB'; s.textBaseline = 'middle'; s.textAlign = 'center';
    s.fillText('解答番号', 190, y0 - dy / 2 - 33); s.fillText('解　　答　　欄', x0 + dx * (labels.length - 1) / 2, y0 - dy / 2 - 33);
    for (let i = 0; i < rows; i++) {
      const y = y0 + i * dy;
      if (i % 2 === 0) { s.fillStyle = 'rgba(33,142,163,0.06)'; s.fillRect(90, y - dy / 2, SW - 180, dy); }
      s.fillStyle = TEAL; s.fillRect(130, y - 44, 120, 88); s.fillStyle = PAPER; s.font = '700 58px ZenKakuB'; s.fillText(String(first + i), 190, y + 2);
      labels.forEach((lab, j) => { const [x] = bub(i, j);
        s.strokeStyle = TEAL; s.lineWidth = 5; s.beginPath(); s.ellipse(x, y, rx, ry, 0, 0, 7); s.stroke();
        s.fillStyle = TEAL; s.font = `500 ${Math.round(ry * 1.15)}px ZenKaku`; s.fillText(lab, x, y + 2); });
      s.fillStyle = INK; s.fillRect(22, y - 9, 40, 18);                 // the reader's timing mark for the row
    }
    return bub;
  }
  function makeSheet(title, sub, seed) {
    const [c, s] = paper(seed); header(s, title, sub);
    const bub = grid(s, ['1', '2', '3', '4'], 4, 480, 150, 470, 250, 66, 44);
    return { c, bub, rx: 66, ry: 44 };
  }
  const MATH = makeSheet('数学', '解答用紙', 3), SCI = makeSheet('理科', '解答用紙', 5);
  const KOKU = (() => {
    const [c, s] = paper(7); header(s, '国語', '解答用紙');
    inkjetText(s, '問三　この時の主人公の気持ちとして', 96, 380, { size: 16 * 4.6, align: 'left', seed: 4, matrix: true, color: INKRGB, dotr: 0.5 });
    inkjetText(s, '　　　最も適切なものを選べ。', 96, 476, { size: 16 * 4.6, align: 'left', seed: 5, matrix: true, color: INKRGB, dotr: 0.5 });
    const bub = grid(s, ['ア', 'イ', 'ウ', 'エ'], 1, 780, 260, 470, 290, 96, 64, 3);
    return { c, bub, rx: 96, ry: 64 };
  })();

  // where each sheet lies in the frame: centre, rotation; and the frame position of a point on it
  const LAY = { math: [900, 650, 0], sci: [930, 640, 0], koku: [910, 650, 0] };   // square to the frame (no tilt for a collage look)
  const toFrame = (key, [px, py]) => { const [cx, cy, r] = LAY[key], dx = px - SW / 2, dy = py - SH / 2;
    return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)]; };
  function placeSheet(c, key, shadow = true) {
    const [cx, cy, r] = LAY[key];
    if (shadow) { g.save(); g.translate(cx + 16, cy + 20); g.rotate(r); g.fillStyle = FIELD_SH; g.fillRect(-SW / 2, -SH / 2, SW, SH); g.restore(); }
    g.save(); g.translate(cx, cy); g.rotate(r); g.drawImage(c, -SW / 2, -SH / 2); g.restore();
  }

  // ---------- marks ----------
  const fills = {};
  function fillMark(rx, ry, seed, erased) {
    const key = `${rx}${seed}${erased ? 'e' : ''}`; if (fills[key]) return fills[key];
    const [c, x] = mk(rx * 2 + 40, ry * 2 + 40);
    (erased ? erasedMark : pencilFill)(x, rx + 20, ry + 20, rx * 0.9, ry * 0.9, 900, rng(seed), erased ? { angle: 0.06 } : { angle: -0.4, dark: 1.25, over: 0.1 });
    return (fills[key] = c);
  }
  // a stamp: 16-dot text that lands with a slam (big, then its size, in three frames)
  function stamp(s, text, x, y, k, rot, color, age, seed, label, frame = false) {
    if (age < 0) return;
    const f = Math.min(1, age * 30 / 3), sc = 1 + 0.32 * (1 - f) * (1 - f);
    s.save(); s.translate(x, y); s.rotate(rot); s.scale(sc, sc);
    const w = text.length * 16 * k + 16 * k * 0.9, h = 16 * k * 1.55;
    if (label) { s.fillStyle = label; s.fillRect(-w / 2, -h / 2, w, h); }
    if (frame) { s.strokeStyle = `rgb(${color.join(',')})`; s.lineWidth = Math.max(4, k * 1.6); s.strokeRect(-w / 2, -h / 2, w, h); }
    inkjetText(s, text, 0, 0, { size: 16 * k, align: 'center', seed, matrix: true, color, dotr: 0.6 });
    s.restore();
  }

  // ---------- the hand ----------
  const HAND = rinPalImage(await img('/art/cut/hpen3.png')), FACE = rinPalImage(await img('/art/cut/rface_ochi.png'));
  const TIP = [P('tipx', 200), P('tipy', 178)], HS0 = P('hs', 0.74);
  function drawHand(x, y, lifted, rot = 0) {
    // the forearm leaves its drawing through the bottom edge, so that edge must stay below the frame (checklist 27b)
    const need = (1080 + 40 - y) / ((HAND.height - TIP[1]) * Math.cos(rot));
    const hs = Math.max(HS0, need) * (lifted ? 1.035 : 1);
    const draw = (ctx, ox = 0, oy = 0) => { ctx.save(); ctx.translate(x + ox, y + oy); ctx.rotate(rot);
      ctx.drawImage(HAND, -TIP[0] * hs, -TIP[1] * hs, HAND.width * hs, HAND.height * hs); ctx.restore(); };
    // its shadow: tight under the pencil when it presses, further off when it lifts
    const [sc, s] = mk(W, 1080); draw(s, lifted ? 26 : 9, lifted ? 34 : 12);
    s.globalCompositeOperation = 'source-in'; s.fillStyle = 'rgba(20,60,70,0.30)'; s.fillRect(0, 0, W, 1080);
    g.drawImage(sc, 0, 0); draw(g);
  }

  // ---------- her words: a black strip at the right, white Mincho, a character when it is sung ----------
  function strip(chars, tt) {
    const shown = chars.filter(([, tc]) => tt >= tc - LEAD).map(([c]) => c);
    if (!shown.length) return;
    const size = P('ls', 66), x = P('lx', 1832), y0 = 34, step = size * 1.06, h = shown.length * step + size * 0.5;
    g.fillStyle = INK; g.fillRect(x - size * 0.72, y0, size * 1.44, h);
    g.fillStyle = PAPER; g.font = `800 ${size}px ShipporiX`; g.textAlign = 'center'; g.textBaseline = 'middle';
    shown.forEach((c, i) => {
      const small = 'ゃゅょっャュョッ'.includes(c), cy = y0 + size * 0.75 + i * step;
      if (small) { g.font = `800 ${size * 0.8}px ShipporiX`; g.fillText(c, x + size * 0.14, cy - size * 0.1); g.font = `800 ${size}px ShipporiX`; }
      else g.fillText(c, x, cy);
    });
  }

  // ---------- the score ----------
  const S1 = [['math', MATH, 0, 1], ['sci', SCI, 0, 2], ['math', MATH, 1, 3], ['sci', SCI, 1, 0], ['math', MATH, 2, 2], ['sci', SCI, 2, 1], ['math', MATH, 3, 0]]
    .map(([key, sht, row, ch], i) => ({ key, sht, row, ch, t: beatT(136 + i) }));
  const HOVER = [0, 3, 1, 2, 0, 3, 2, 1];                          // S2: the choice she hovers over on each beat
  const S3 = [0, 1, 2, 3].map(j => ({ ch: j, t: beatT(152 + 2 * j) }));
  const STAMPS = [[0, -175, -0.11, 6.6], [1, -330, 0.07, 7.4], [2, -190, 0.12, 8.2], [3, -360, -0.08, 9.2]];   // [choice, dy, rot, k]: all above the row, where the hand never is

  window.renderAt = async t => {
    const tt = t + LEAD;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (tt < T_CUT) {
      // ---- S1 ----
      g.fillStyle = FIELD; g.fillRect(0, 0, W, 1080);
      const cur = [...S1].reverse().find(m => tt >= m.t) || null;
      const key = cur ? cur.key : 'math', other = key === 'math' ? 'sci' : 'math';
      // the other subject's sheet lies underneath, its corner showing
      const sht = key === 'math' ? MATH : SCI, [c, s] = mk(SW, SH); s.drawImage(sht.c, 0, 0);
      for (const m of S1.filter(m => m.key === key && tt >= m.t)) {
        const [bx, by] = sht.bub(m.row, m.ch), age = tt - m.t;
        s.drawImage(fillMark(sht.rx, sht.ry, 100 + m.row * 7 + m.ch, false), bx - sht.rx - 20, by - sht.ry - 20);
        if (age >= BEAT / 2) {
          stamp(s, '正解', 1392, by, 4.4, 0, INKRGB, age - BEAT / 2, 3 + m.row, null, true);
        }
      }
      placeSheet(c, key);
      // the hand: on its bubble from the beat, lifted from the half beat; before the first mark, above the first bubble
      let at = cur || S1[0], lifted = !cur || tt >= cur.t + BEAT * 0.5, hx, hy;
      if (cur && lifted) at = S1.find(m => m.key === key && m.t > cur.t) || null;
      if (at) [hx, hy] = toFrame(key, at.sht.bub(at.row, at.ch)); else [hx, hy] = [1480, 930];
      drawHand(hx + (lifted ? 8 : 0), hy + (lifted ? -10 : 0), lifted);
      strip(L1, tt);
    } else if (tt < T_S4) {
      // ---- S2, S3: 国語 ----
      g.fillStyle = FIELD; g.fillRect(0, 0, W, 1080);
      const [c, s] = mk(SW, SH); s.drawImage(KOKU.c, 0, 0);
      const done = S3.filter(m => tt >= m.t);
      done.forEach((m, i) => {
        const [bx, by] = KOKU.bub(0, m.ch), last = i === done.length - 1;
        s.drawImage(fillMark(KOKU.rx, KOKU.ry, 300 + m.ch, !last), bx - KOKU.rx - 20, by - KOKU.ry - 20);
        const age = tt - (m.t + BEAT / 2);
      });
      placeSheet(c, 'koku');
      // the stamps are printed over everything on the page, so they are drawn in frame space, piling up
      done.forEach(m => { const [ch, dy, rot, k] = STAMPS[m.ch]; const [x, y] = toFrame('koku', [KOKU.bub(0, ch)[0], KOKU.bub(0, ch)[1] + dy]);
        stamp(g, '不正解', x, y, k, rot, INKRGB, tt - (m.t + BEAT / 2), 21 + ch, PAPER, true); });
      // the hand
      let ch, lifted, rot = 0;
      if (tt < S3[0].t) { const k = Math.max(0, Math.floor((tt - T_CUT) / BEAT)); ch = HOVER[Math.min(HOVER.length - 1, k)]; lifted = true;
        rot = 0.012 * Math.sin(tt * 37) ; }                                    // a hover that cannot settle
      else { const curm = [...S3].reverse().find(m => tt >= m.t); ch = curm.ch; lifted = tt >= curm.t + BEAT * 0.5;
        const nextm = S3.find(m => m.t > tt); if (lifted && nextm) ch = nextm.ch; }
      const [hx, hy] = toFrame('koku', KOKU.bub(0, ch));
      drawHand(hx + (lifted ? 8 : 0), hy + (lifted ? -10 : 0), lifted, rot);
      strip(tt < T_S3 ? L2 : L3, tt);
    } else {
      // ---- S4: the punchline ----
      g.fillStyle = GRAPHITE; g.fillRect(0, 0, W, 1080);
      const sung = L4.filter(([, tc]) => tt >= tc - LEAD).length;
      // rows of 不正解 printed across the field, one more row with every character she sings
      const RS = rng(77), wall = [];
      for (let i = 0; i < 40; i++) wall.push({ x: 60 + RS() * 1800, y: 50 + RS() * 980, k: 3.2 + RS() * 4.5, rot: (RS() - 0.5) * 0.24, ink: RS() < 0.3 });
      const n = Math.min(wall.length, 8 + sung * 3);
      for (let i = 0; i < n; i++) { const st = wall[i], born = i < 8 ? T_S4 : L4[Math.min(L4.length - 1, Math.floor((i - 8) / 3))][1] - LEAD;
        stamp(g, '不正解', st.x, st.y, st.k, st.rot, st.ink ? INKRGB : PAPERRGB, tt - born, 40 + i, st.ink ? PAPER : null, !st.ink); }
      // her, the one being marked: a stiff smile under the verdicts (the stamps already down stay behind her)
      { const fs = P('fs', 0.86), fw = FACE.width * fs, fh = FACE.height * fs, fx = P('fx', 1400), fy = 1080 - fh + P('fyo', 40);
        g.drawImage(FACE, fx - fw / 2, fy, fw, fh); }
      // the line, set big on a paper band as it is sung: どれも不正解という / オチでした
      const band = [P('bx', 70), P('by', 330), P('bw', 1180), P('bh', 470)];
      g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(band[0] + 18, band[1] + 22, band[2], band[3]);
      g.fillStyle = PAPER; g.fillRect(...band);
      const size = P('ps', 122), shown = L4.filter(([, tc]) => tt >= tc - LEAD).map(([c]) => c);
      g.textBaseline = 'middle'; g.textAlign = 'left'; g.font = `800 ${size}px ShipporiX`;
      const l1 = shown.slice(0, 9), l2 = shown.slice(9);
      let x = band[0] + 60; l1.forEach(c => { g.fillStyle = INK; g.fillText(c, x, band[1] + 140); x += size; });
      x = band[0] + 60; l2.forEach((c, i) => { g.fillStyle = i < 2 ? TEAL : INK; g.fillText(c, x, band[1] + 140 + size * 1.55); x += size; });
    }
  };
  await window.renderAt(P('t0', 50.05));
}
