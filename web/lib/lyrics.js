// The lyrics, character by character, as actually sung (work/audio/lyrics_timed.json; never typed in by hand).
// docs/制作约定.md 第七节: take a line by its number or by a time window. The two choruses repeat ten lines word for word, so
// taking a line by its text alone picks the wrong time: line() throws when the text is not found or is found more than once
// in the window.
//
//   import { loadLyrics } from '../lib/lyrics.js';
//   const LY = await loadLyrics({ within: [74.0, 86.28] });          // default window: this segment
//   const L1 = LY.line('黒板のこの漢字が読めますか');                  // [[char, t], ...] (t = the moment it is sung)
//   const L4 = LY.line('おい誰なんだよおい誰なんだよ', { within: [83, 86] });
//   const L9 = LY.lineAt(9);                                          // by number (0-based index in lyrics_timed.json)
//
// Displayed text goes through the display table (the subtitles' transcription errors): 「レスボール」 -> 「レスポール」.
// Lines can be asked for by either spelling.

// WHEN a character must read (2026-11-21, user: 「我们的歌词好像比曲子慢了一点」): t is the moment it is sung (the vocal
// onset, checked on the vocal stem: within about 10-20 ms of it). Frame g shows song time g / 30, so the character must be
// readable on frame floor(t * 30), the frame the onset falls in, at the latest; it may start to show 1-2 frames before
// that, never earlier. The shared letters do this (print.js: pencilWriter, whiteLetter, printSung, print16 { sung: true });
// a page that gates or animates sung letters itself uses print.js sungShown / sungBuild / sungSweep, never `tt >= t`
// (that holds the letter to the next frame) and never a fade or write-on that is still running after the onset frame.
// lyricAudit checks it: give it, for every sung character a page shows, the song time of the first frame it reads on.
export const FPS = 30;
export const onsetFrame = t => Math.floor(t * FPS + 1e-6);
// entries: [{ c, t, readT }] (readT: song time of the first frame the character is readable, null if never shown).
// Prints LYRIC AUDIT <id>: n characters, k read late (after the onset's frame), e early (more than 2 frames before it).
export function lyricAudit(id, entries) {
  const late = [], early = [], missing = [];
  for (const e of entries) {
    if (e.readT === null || e.readT === undefined) { missing.push(e); continue; }
    const d = Math.round(e.readT * FPS) - onsetFrame(e.t);
    if (d > 0) late.push({ ...e, frames: d }); else if (d < -2) early.push({ ...e, frames: d });
  }
  const fmt = a => a.map(e => `${e.c}@${e.t.toFixed(2)}${e.frames !== undefined ? `(${e.frames > 0 ? '+' : ''}${e.frames}f)` : ''}`).join(' ');
  console.warn(`LYRIC AUDIT ${id}: ${entries.length} characters, ${late.length} read late${late.length ? ': ' + fmt(late) : ''}` +
    `, ${early.length} early${early.length ? ': ' + fmt(early) : ''}${missing.length ? `, ${missing.length} never shown: ${fmt(missing)}` : ''}`);
  return { characters: entries.length, late: late.length, early: early.length, missing: missing.length, lateChars: late };
}

export const DISPLAY_FIXES = [['レスボール', 'レスポール']];
export const fixText = s => DISPLAY_FIXES.reduce((a, [from, to]) => a.split(from).join(to), s);

// apply the table to a line's characters (same count of characters on both sides, so the times stay with their characters)
function fixLine(x) {
  let text = x.text, chars = x.chars.map(c => ({ ...c }));
  for (const [from, to] of DISPLAY_FIXES) {
    if (from.length !== to.length) throw new Error(`lyrics.js: display fix ${from} -> ${to} must keep the length`);
    let joined = chars.map(c => c.c).join(''), i = joined.indexOf(from);
    while (i >= 0) { for (let k = 0; k < to.length; k++) chars[i + k].c = to[k]; joined = chars.map(c => c.c).join(''); i = joined.indexOf(from, i + to.length); }
    text = text.split(from).join(to);
  }
  return { ...x, text, rawText: x.text, chars };
}

export async function loadLyrics({ url = '/work/audio/lyrics_timed.json', within = null } = {}) {
  const raw = await (await fetch(url)).json();
  const lines = raw.map((x, i) => ({ index: i, ...fixLine(x) }));
  const asPairs = x => x.chars.map(c => [c.c, c.t]);
  function find(text, { within: win = within, index = null } = {}) {
    const want = fixText(text);
    let hits = lines.filter(x => x.text === want);
    if (index !== null) hits = hits.filter(x => x.index === index);
    if (win) hits = hits.filter(x => x.start >= win[0] && x.start < win[1]);
    const where = win ? ` in ${win[0]}-${win[1]} s` : '';
    if (hits.length === 0) throw new Error(`lyrics: 「${text}」 not found${where}${index !== null ? ` at line ${index}` : ''}`);
    if (hits.length > 1) throw new Error(`lyrics: 「${text}」 found ${hits.length} times${where} (lines ${hits.map(x => x.index).join(', ')}); give a line number or a narrower window`);
    return hits[0];
  }
  return {
    lines,
    // [[char, t], ...] of one line, by its text inside the window (default: the window given to loadLyrics)
    line: (text, opts = {}) => asPairs(find(text, opts)),
    // the whole record { index, start, end, text, rawText, chars }
    record: (text, opts = {}) => find(text, opts),
    // by number; with text given, also checks that the line says that
    lineAt: (index, text = null) => {
      const x = lines[index]; if (!x) throw new Error(`lyrics: no line ${index}`);
      if (text !== null && x.text !== fixText(text)) throw new Error(`lyrics: line ${index} is 「${x.text}」, not 「${text}」`);
      return asPairs(x);
    },
    // every line starting inside [t0, t1)
    linesIn: (t0, t1) => lines.filter(x => x.start >= t0 && x.start < t1),
  };
}
