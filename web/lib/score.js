// The score: the measured beat, every visual event registered against it, and the drawings' timeline.
// docs/制作约定.md 第六节: everything lands on the measured beat; nothing is early (the old LEAD = 1/30 is void).
//
//   import { BEAT, beatV, createScore } from '../lib/score.js';
//   const S = createScore('a2', { t0: 50.05, t1: 62.58 });
//   const C2 = S.ev('cut to 国語', beatV(143));                      // a beat event; S.ev(name, t, 'half') for a half-beat one
//   S.hold('face', 'face stiff', beatV(161), beatV(164), { kind: 'key', file: '/art/cut/rface_ochi.png' });
//   S.hold('shot', 'shot face', beatV(161), beatV(168), { kind: 'shot' });
//   S.finish();                                                     // prints BEAT AUDIT and HOLD AUDIT, returns both
//   ... in renderAt: const F = S.at('face', tt)                     // the drawing on screen at tt (same data as the audit)
//
// Holds: a drawing's start is a swap, so it is registered as a beat event (a key on the beat, an in-between on the half
// beat), except when it starts at the segment's first frame (onBeat: false). The HOLD AUDIT reports every entry's real
// on-screen seconds; problems are: a key drawing or a shot shorter than two beats, an in-between shorter than half a beat,
// A -> B -> A in a track (the same drawing back after one other), and gaps/overlaps between consecutive drawings of a track.

export const BEAT = 60 / 162;              // 162 BPM
export const B0 = 0.354;                   // the theoretical 162-BPM grid starts here (tools/beat_grid.py)
export const BV0 = 0.354 - 0.036;          // = 0.318: the drums hit ~36 ms before that grid (tools/beat_accents.py); events go here
export const FRAME = 1 / 30;               // one frame at 30 fps (a duration, not a lead)
export const beatT = k => B0 + k * BEAT;   // the theoretical grid (analysis only)
export const beatV = k => BV0 + k * BEAT;  // the measured beat k: every visual event goes on this
export const beatOf = t => (t - BV0) / BEAT;

export const clamp01 = f => Math.min(1, Math.max(0, f));
export const smooth = f => { f = Math.min(1, Math.max(0, f)); return f * f * (3 - 2 * f); };
export const ease = f => 1 - Math.pow(1 - Math.min(1, Math.max(0, f)), 3);

const MIN_BEATS = { key: 2, shot: 2, inbetween: 0.5 };

export function createScore(id, { t0 = null, t1 = null } = {}) {
  const events = [], holds = [];
  // a visual event on the beat (level 'beat') or on the half beat (level 'half'); returns t so it can be used inline
  const ev = (name, t, level = 'beat') => { events.push({ name, t, level }); return t; };
  // the same, but only if no event is registered at that time yet (used by automatic registration: camera moves, swaps)
  const mark = (name, t, level = 'beat') => { if (!events.some(e => Math.abs(e.t - t) < 1e-9)) events.push({ name, t, level }); return t; };
  function offBeat() {
    return events.filter(({ t, level }) => { const step = level === 'half' ? BEAT / 2 : BEAT, k = Math.round((t - BV0) / step); return Math.abs(t - (BV0 + k * step)) > FRAME * 0.5; });
  }
  function beatAudit() {
    const bad = offBeat();
    console.warn(`BEAT AUDIT ${id}: ${events.length} events, ${bad.length} off the beat${bad.length ? ': ' + bad.map(({ name, t }) => `${name}@${t.toFixed(3)}`).join(', ') : ''}`);
    return { events: events.length, off: bad.length, offEvents: bad.map(({ name, t, level }) => ({ name, t, level })) };
  }

  // the timeline of drawings and shots: one entry per drawing (or shot) on screen from start to end
  function hold(track, name, start, end, { kind = 'key', file = null, onBeat = true, ...extra } = {}) {
    if (!(kind in MIN_BEATS)) throw new Error(`score.hold ${name}: kind must be key, inbetween or shot`);
    if (!(end > start)) throw new Error(`score.hold ${name}: end ${end} is not after start ${start}`);
    const h = { track, name, start, end, kind, file, ...extra };
    holds.push(h);
    if (onBeat) mark(`${kind === 'shot' ? 'cut' : 'swap'}: ${name}`, start, kind === 'inbetween' ? 'half' : 'beat');
    return h;
  }
  // the entry of a track on screen at time t: the last one that has started (null before the first)
  function at(track, t) {
    let cur = null;
    for (const h of holds) if (h.track === track && t >= h.start && (!cur || h.start >= cur.start)) cur = h;
    return cur;
  }
  function holdAudit() {
    const problems = [];
    for (const h of holds) {
      const s = h.end - h.start, min = MIN_BEATS[h.kind];
      h.seconds = s; h.beats = s / BEAT;
      if (s < min * BEAT - FRAME / 2) problems.push({ name: h.name, problem: `${h.kind} holds ${s.toFixed(2)}s (${h.beats.toFixed(2)} beats), under ${min} beats` });
    }
    const tracks = [...new Set(holds.map(h => h.track))];
    for (const tr of tracks) {
      const list = holds.filter(h => h.track === tr).sort((a, b) => a.start - b.start);
      for (let i = 0; i + 1 < list.length; i++) {
        const a = list[i], b = list[i + 1];
        if (a.kind !== 'shot' && Math.abs(a.end - b.start) > 1e-6) problems.push({ name: `${a.name} -> ${b.name}`, problem: `${a.end < b.start ? 'gap' : 'overlap'} of ${Math.abs(b.start - a.end).toFixed(3)}s in track ${tr}` });
        const c = list[i + 2], ka = a.file ?? a.name, kc = c && (c.file ?? c.name);
        if (c && a.kind !== 'shot' && ka === kc && ka !== (b.file ?? b.name)) problems.push({ name: `${a.name} -> ${b.name} -> ${c.name}`, problem: `A->B->A in track ${tr}` });
      }
    }
    console.warn(`HOLD AUDIT ${id}: ${holds.map(h => `${h.name} ${h.seconds.toFixed(2)}s`).join(', ')}; ${problems.length} problems${problems.length ? ': ' + problems.map(p => `${p.name}: ${p.problem}`).join('; ') : ''}`);
    return problems;
  }
  let result = null;
  function finish() {
    const beat = beatAudit(), problems = holdAudit();
    result = { beat, holdProblems: problems };
    return result;
  }
  // the score's part of window.__audit (see docs/制作约定.md 第九节)
  function auditData() {
    if (!result) finish();
    return {
      id, segment: { t0, t1 },
      beat: result.beat,
      events: events.map(({ name, t, level }) => ({ name, t, level, beat: +beatOf(t).toFixed(3) })),
      holds: holds.map(({ track, name, start, end, kind, file, seconds, beats }) => ({ track, name, start, end, kind, file, seconds, beats })),
      holdProblems: result.holdProblems,
      drawings: holds.filter(h => h.file).map(({ file, start, end, name, kind }) => ({ file, start, end, name, kind })),
    };
  }
  return { id, events, holds, ev, mark, hold, at, beatAudit, holdAudit, finish, auditData };
}

// assemble window.__audit from the score, the layout and anything else the page wants to add
export function publishAudit(score, layout = null, extra = {}) {
  const s = score.auditData(), L = layout ? layout.auditData() : { boxes: [], overlaps: [], outOfFrame: [] };
  window.__audit = { id: s.id, segment: s.segment, beat: s.beat, holds: s.holds, holdProblems: s.holdProblems, layout: L,
                     drawings: s.drawings, events: s.events, ...extra };
  return window.__audit;
}
