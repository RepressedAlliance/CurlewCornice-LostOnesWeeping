// The 2D demo: A2 「数学と理科は好きですが / 国語がどうもダメで嫌いでした / 正しいのがどれか悩んでいりゃ /
// どれも不正解というオチでした」 (0:50.39-1:02.27). Her answer sheets on the desk, seen from straight above, the camera
// still. Her hand (one Codex master and its variants: touching, lifted, hovering) marks bubbles on the beat; the reader
// prints its verdicts in its 16-dot head; her words stand in a vertical column of Mincho at the right, each character
// appearing when it is sung (times from work/audio/lyrics_timed.json); the last line is the reader's own printout.
// Called from sheet.js with its drawing helpers, so the page is printed exactly like the other 2D pages.
export async function a2demo(H) {
  const { g, W, P, q, T, TEAL, PAPERW, LIGHT, deskSurface, paperSheet, place, hardShadow, heldShadow, vtext, pencilWrite,
          pencilFill, erasedMark, inkjetText, rng, img, rinPalImage } = H;
  const BEAT = 60 / 162, B0 = 0.354, LEAD = 1 / 30;
  const beatT = k => B0 + k * BEAT;
  const lyr = await (await fetch('/work/audio/lyrics_timed.json')).json();
  const line = text => { const l = lyr.find(x => x.text === text); return l.chars.map(c => [c.c, c.t]); };
  const L1 = line('数学と理科は好きですが'), L2 = line('国語がどうもダメで嫌いでした'), L3 = line('正しいのがどれか悩んでいりゃ'),
        L4 = line('どれも不正解というオチでした');
  const T_CUT = beatT(143), T_SLIP = beatT(159);          // 53.32: cut to 国語; 59.24: the reader prints its result

  // ---------- the desk (drawn once) ----------
  const desk = document.createElement('canvas'); desk.width = W; desk.height = 1080;
  { const keep = g.getImageData(0, 0, W, 1080); deskSurface(); desk.getContext('2d').drawImage(g.canvas, 0, 0); g.putImageData(keep, 0, 0); }

  // ---------- an answer sheet: title, name, examinee number, and n rows of four choices ----------
  function sheetBase(title, labels, rows, opt = {}) {
    const sw = 860, sh = opt.h || 1040, c = paperSheet(sw, sh, 9), s = c.getContext('2d');
    const BRX = 30, BRY = 20;
    s.save(); s.translate(1.2, 0.8);
    s.fillStyle = T(1); s.textBaseline = 'middle'; s.textAlign = 'left';
    s.font = '700 34px ZenKakuB'; s.fillText(title, 64, 70);
    s.font = '500 17px ZenKaku'; s.fillText('令和八年度　第二学期　期末考査　（マーク式）', 64, 106);
    s.strokeStyle = T(1); s.lineWidth = 2.2; s.strokeRect(470, 42, 330, 80); s.fillRect(470, 42, 62, 80);
    s.fillStyle = '#f6f4ee'; s.font = '700 24px ZenKakuB'; s.textAlign = 'center'; s.fillText('氏名', 501, 82);
    const fy0 = opt.fy0 || 230, frh = 88, x0 = 110;
    s.fillStyle = T(0.12); s.fillRect(x0 - 60, fy0 - 74, 720, 30); s.fillStyle = T(1); s.font = '700 17px ZenKakuB';
    s.fillText('解答番号', x0, fy0 - 59); s.fillText('解　答　欄', x0 + 140 + 1.5 * 150, fy0 - 59);
    const qY = i => fy0 + i * frh, qX = j => x0 + 140 + j * 150;
    for (let i = 0; i < rows; i++) {
      const y = qY(i);
      s.fillStyle = T(i % 2 ? 0.0 : 0.06); s.fillRect(x0 - 60, y - frh / 2, 720, frh);
      s.fillStyle = T(1); s.font = '700 30px ZenKakuB'; s.textAlign = 'center'; s.fillText(String(i + 1), x0, y);
      s.strokeStyle = T(0.95); s.lineWidth = 2.4;
      labels.forEach((k, j) => { const x = qX(j); s.beginPath(); s.ellipse(x, y, BRX, BRY, 0, 0, 7); s.stroke(); s.fillStyle = T(0.9); s.font = '500 20px ZenKaku'; s.fillText(k, x, y + 1); });
    }
    s.restore();
    s.fillStyle = '#17171b';
    for (let i = 0; i < rows; i++) s.fillRect(20, qY(i) - 5, 22, 10);
    for (const [x, y] of [[18, 18], [sw - 42, 18], [18, sh - 42], [sw - 42, sh - 42]]) s.fillRect(x, y, 24, 24);
    pencilWrite(s, '鏡音　リン', 552, 84, 40, { seed: 8, font: 'Yomogi', jitter: 2.2 });
    return { c, qX, qY, sw, sh, rx: BRX * 0.92, ry: BRY * 0.92 };
  }
  const MATH = sheetBase('数学　解答用紙', ['1', '2', '3', '4'], 4, { h: 620 });
  const SCI = sheetBase('理科　解答用紙', ['1', '2', '3', '4'], 4, { h: 620 });
  const KOKU = sheetBase('国語　解答用紙', ['ア', 'イ', 'ウ', 'エ'], 4, { h: 760, fy0: 380 });
  // the 国語 question, printed by the same machine above its answer field, in two lines
  { const s = KOKU.c.getContext('2d');
    inkjetText(s, '問三　この時の主人公の気持ちとして', 64, 186, { size: 16 * 2.2, align: 'left', seed: 4, matrix: true });
    inkjetText(s, '　　　最も適切なものを選べ。', 64, 244, { size: 16 * 2.2, align: 'left', seed: 5, matrix: true }); }

  // where each sheet lies on the desk, and the screen position of a point on it
  const POS = { math: [500, 548, -0.03, 0.98], sci: [1190, 566, 0.025, 0.98], koku: [800, 560, -0.02, 1.32] };
  const onDesk = (key, sht, px, py) => { const [cx, cy, r, sc] = POS[key]; const dx = (px - sht.sw / 2) * sc, dy = (py - sht.sh / 2) * sc;
    return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)]; };

  // ---------- the marks over time ----------
  const R = rng(41);
  const fills = {};                                       // key -> pre-rendered pencil fill canvas, so a mark looks the same every frame
  function markCanvas(sht, seed, erased) {
    const id = sht === MATH ? 'm' : sht === SCI ? 's' : 'k', key = `${id}${seed}${erased ? 'e' : ''}`;
    if (fills[key]) return fills[key];
    const c = document.createElement('canvas'); c.width = 120; c.height = 90; const x = c.getContext('2d'); const r = rng(seed);
    (erased ? erasedMark : pencilFill)(x, 60, 45, sht.rx, sht.ry, 340, r, erased ? { angle: 0.06 } : { angle: -0.4, dark: 1.2, over: 0.12 });
    return (fills[key] = c);
  }
  // S1: one mark per beat, alternating sheets (beats 136-142); the reader prints 正解 half a beat later
  const S1 = [['math', MATH, 0, 1], ['sci', SCI, 0, 2], ['math', MATH, 1, 3], ['sci', SCI, 1, 0], ['math', MATH, 2, 2], ['sci', SCI, 2, 1], ['math', MATH, 3, 0]]
    .map(([key, sht, row, ch], i) => ({ key, sht, row, ch, t: beatT(136 + i) }));
  // S3: ア イ ウ エ on every other beat (beats 152, 154, 156, 158); each new mark erases the one before
  const S3 = [0, 1, 2, 3].map(j => ({ key: 'koku', sht: KOKU, row: 2, ch: j, t: beatT(152 + 2 * j) }));
  // the hand: master touching, lifted, hovering; one registration (the master's pencil tip)
  // the writing hand comes in from below: its forearm runs out through the bottom of its drawing, so that edge must
  // always be below the frame (docs/交付检查清单.md 27b); the scale grows when the pencil works high on the page
  const HANDS = { m: rinPalImage(await img('/art/cut/hpen2_m.png')), up: rinPalImage(await img('/art/cut/hpen2_up.png')), hov: rinPalImage(await img('/art/cut/hpen2_hov.png')) };
  const TIP = [P('tipx', 61), P('tipy', 134)], HR = P('hr', 0) * Math.PI / 180;
  let HS = P('hs', 0.55);
  function drawHand(kind, x, y, lifted) {
    const im = HANDS[kind];
    const need = (1080 + 30 - y) / ((im.height - TIP[1]) * Math.cos(HR));       // the forearm's cut edge below the frame
    const hs = Math.max(HS, need);
    const draw = ctx => { ctx.save(); ctx.translate(x, y); ctx.rotate(HR); ctx.drawImage(im, -TIP[0] * hs, -TIP[1] * hs, im.width * hs, im.height * hs); ctx.restore(); };
    if (!lifted) heldShadow(draw, [x, y], [Math.cos(HR), Math.sin(HR)], 0.05);
    else hardShadow(draw, LIGHT.dx * 2.4, LIGHT.dy * 2.4);
    draw(g);
  }
  // the column of her words: vertical Mincho at the right, a character appears when it is sung; the column clears for the next line
  function words(chars, tNow) {
    const x = P('lcx', 1800), y0 = P('lcy', 70), size = P('lcs', 58);       // 14 characters fit above the bottom edge
    const shown = chars.filter(([, tc]) => tNow >= tc - LEAD).map(([c]) => c).join('');
    if (shown) vtext(g, shown, x, y0, size, 1.08, 'ShipporiB', '#26262b');
  }
  // the result slip, printed and pushed out of the reader from the bottom edge
  const SL = (() => { const SWp = 1500, SHp = 380, c = document.createElement('canvas'); c.width = SWp; c.height = SHp; const x = c.getContext('2d');
    x.fillStyle = '#f8f7f2'; x.beginPath(); x.moveTo(0, 8); for (let i = 0; i <= 100; i++) x.lineTo(i * SWp / 100, (i % 2) ? 2 : 9); x.lineTo(SWp, SHp); x.lineTo(0, SHp); x.closePath(); x.fill();
    x.fillStyle = TEAL; x.font = '700 24px ZenKakuB'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText('読取結果', 34, 40);
    x.font = '500 19px ZenKaku'; x.textAlign = 'right'; x.fillText('No.2026-0314　国語　問三', SWp - 34, 40);
    x.strokeStyle = TEAL; x.setLineDash([4, 5]); x.lineWidth = 2; x.beginPath(); x.moveTo(34, 64); x.lineTo(SWp - 34, 64); x.stroke(); x.setLineDash([]);
    inkjetText(x, 'ア 不正解　イ 不正解　ウ 不正解　エ 不正解', SWp / 2, 116, { size: 16 * 2.6, align: 'center', seed: 13, matrix: true, dotr: 0.52 });
    return { c, SWp, SHp }; })();

  const frame = document.createElement('canvas'); frame.width = W; frame.height = 1080;
  window.renderAt = async t => {
    const tt = t + LEAD;
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(desk, 0, 0);
    if (tt < T_CUT) {
      // ---- S1: math and science, a correct answer on every beat ----
      for (const [key, sht] of [['math', MATH], ['sci', SCI]]) {
        const c = document.createElement('canvas'); c.width = sht.sw; c.height = sht.sh; const s = c.getContext('2d'); s.drawImage(sht.c, 0, 0);
        for (const m of S1.filter(m => m.key === key && tt >= m.t)) {
          s.drawImage(markCanvas(sht, 100 + m.row * 7 + m.ch, false), sht.qX(m.ch) - 60, sht.qY(m.row) - 45);
          if (tt >= m.t + BEAT / 2) inkjetText(s, '正解', sht.qX(m.ch), sht.qY(m.row) + 38, { size: 16 * 1.6, align: 'center', seed: 3 + m.row, matrix: true });
        }
        const [cx, cy, r, sc] = POS[key]; place(c, cx, cy, r, sc);
      }
      // the hand: on the bubble at each beat, lifted and on its way to the next between them
      const cur = [...S1].reverse().find(m => tt >= m.t), next = S1.find(m => m.t > tt) || S1[S1.length - 1];
      let kind = 'up', at = next;
      if (cur && tt < cur.t + BEAT * 0.55) { kind = 'm'; at = cur; }
      const [hx, hy] = onDesk(at.key, at.sht, at.sht.qX(at.ch), at.sht.qY(at.row)); HS = P('hs', 0.55);
      drawHand(kind, hx, hy, kind !== 'm');
      words(L1, tt);
    } else {
      // ---- S2-S4: 国語 ----
      const c = document.createElement('canvas'); c.width = KOKU.sw; c.height = KOKU.sh; const s = c.getContext('2d'); s.drawImage(KOKU.c, 0, 0);
      // questions 1 and 2 were answered before: correct
      for (const [row, ch] of [[0, 1], [1, 3]]) { s.drawImage(markCanvas(KOKU, 200 + row, false), KOKU.qX(ch) - 60, KOKU.qY(row) - 45);
        inkjetText(s, '正解', KOKU.qX(ch), KOKU.qY(row) + 38, { size: 16 * 1.6, align: 'center', seed: 7 + row, matrix: true }); }
      const done = S3.filter(m => tt >= m.t);
      done.forEach((m, i) => {
        const last = i === done.length - 1;
        s.drawImage(markCanvas(KOKU, 300 + m.ch, !last), KOKU.qX(m.ch) - 60, KOKU.qY(m.row) - 45);
        if (tt >= m.t + BEAT / 2) inkjetText(s, '不正解', KOKU.qX(m.ch), KOKU.qY(m.row) + 40, { size: 16 * 1.9, align: 'center', seed: 21 + m.ch, matrix: true });
      });
      const [cx, cy, r, sc] = POS.koku; place(c, cx, cy, r, sc);
      // the hand: hovering from choice to choice on the beat (S2), marking on every other beat (S3), resting at the end (S4)
      let kind = 'hov', ch = 0;
      if (tt < S3[0].t) { const k = Math.floor((tt - T_CUT) / BEAT); ch = [0, 3, 1, 2, 0, 3, 2, 1, 0][Math.max(0, Math.min(8, k))]; kind = k % 2 ? 'hov' : 'up'; }
      else { const curm = [...S3].reverse().find(m => tt >= m.t); ch = curm.ch; kind = tt < curm.t + BEAT * 0.6 ? 'm' : 'up';
        const nextm = S3.find(m => m.t > tt); if (kind === 'up' && nextm && tt > nextm.t - BEAT * 0.5) ch = nextm.ch; }
      const [hx, hy] = onDesk('koku', KOKU, KOKU.qX(ch), KOKU.qY(2)); HS = P('hsk', 0.8);
      if (tt < T_SLIP + BEAT) drawHand(kind, hx, hy, kind !== 'm');
      else drawHand('up', hx + 40, hy + 30, true);
      if (tt < T_SLIP) words(tt < S3[0].t - BEAT * 0.3 ? L2 : L3, tt);
      // ---- S4: the reader prints its result and pushes the slip out; the last line is printed as it is sung ----
      if (tt >= T_SLIP) {
        const u = Math.min(1, (tt - T_SLIP) / 0.28), e = 1 - Math.pow(1 - u, 3);
        const sx = P('slx', 960), sy = 1080 + SL.SHp / 2 - (SL.SHp + P('slup', 60)) * e, rr = P('slr', -0.02);
        const sc2 = document.createElement('canvas'); sc2.width = SL.SWp; sc2.height = SL.SHp; const x = sc2.getContext('2d'); x.drawImage(SL.c, 0, 0);
        const shown = L4.filter(([, tc]) => tt >= tc).map(([c]) => c).join('');
        if (shown) inkjetText(x, shown, 70, 270, { size: 16 * 5.6, align: 'left', seed: 12, matrix: true, dotr: 0.52 });
        const draw = ctx => { ctx.save(); ctx.translate(sx, sy); ctx.rotate(rr); ctx.drawImage(sc2, -SL.SWp / 2, -SL.SHp / 2); ctx.restore(); };
        hardShadow(draw, 8, 10); draw(g);
      }
    }
  };
  await window.renderAt(P('t0', 50.05));
}
