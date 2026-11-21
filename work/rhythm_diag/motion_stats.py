"""Whole-frame jolts and shake in film.mp4, from motion.npz (motion_fit.py), against the drum map (drums.json).
A 'jolt' is a group of frames where the whole frame's motion changes abruptly (acceleration of the frame corners above
0.2% of the width per frame^2): punches, slams, shakes, snap steps. Eased pushes and pans have almost no acceleration and
are not jolts. For each jolt: beat, music under it, amplitude (largest corner excursion from where the frame was, % of the
width), frames until the frame is still again, reversals (back-and-forth), whether it came back (there-and-back) or stayed.
  python work/rhythm_diag/motion_stats.py [summary|events|json]"""
import json, os, sys
import numpy as np
from scipy.ndimage import median_filter

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
z = np.load(os.path.join(HERE, 'motion.npz'))
tx, ty, dz, rot, resid, hist = (z[k] for k in ['tx', 'ty', 'dz', 'rot', 'resid', 'hist'])
n = len(tx); FPS = 30; B = 60 / 162; BV0 = 0.318; Wd = 1920
CW = np.array([[960, 540], [-960, 540], [960, -540], [-960, -540]], float)   # frame corners from the centre (px)
D = json.load(open(os.path.join(HERE, 'drums.json'))); bt = D['beats']
SEG = [(s['id'][4:], s['f0'], s['f1']) for s in json.load(open(os.path.join(ROOT, 'web/segments.json'), encoding='utf-8'))['segments']]


def corner(a, c, s, r):  # largest corner displacement (px) of a similarity step
    return float(np.max(np.hypot(a + s * CW[:, 0] - r * CW[:, 1], c + s * CW[:, 1] + r * CW[:, 0])))


P = np.stack([tx, ty, dz, rot], 1)
v = np.array([corner(*p) for p in P])
cut = (hist > 0.22) | (resid > 25) | (v > 250)
cut[0] = True
P[cut] = 0; v[cut] = 0
acc = np.zeros(n)
for i in range(1, n):
    if cut[i] or cut[i - 1]: continue
    acc[i] = corner(*(P[i] - P[i - 1]))
# content jolts (inside the frame, camera compensated): residual spikes over the local level, not at cuts
rb = median_filter(resid, 15)
content = np.where(cut | np.r_[False, cut[:-1]], 0, resid - rb)

kof = lambda f: (f / FPS - BV0) / B
segof = lambda f: next((s for s, a, b in SEG if a <= f < b), '?')


def music(k):
    if k < 0 or k >= len(bt): return ''
    x = bt[k]
    return ('C' if (x['crash_db'] or 0) > 6 else '') + ('K' if x['kick'] > 0.9 else '') + ('S' if x['snare'] > 1.1 else '')


ACC_T, GAP = 0.002 * Wd, 3
hot = np.where(acc > ACC_T)[0]
groups = []
for f in hot:
    if groups and f - groups[-1][-1] <= GAP and not cut[groups[-1][-1]:f + 1].any(): groups[-1].append(f)
    else: groups.append([f])
events = []
for g in groups:
    s0 = g[0] - 1; e = g[-1]
    while e + 1 < n and not cut[e + 1] and acc[e + 1] > 0.0005 * Wd: e += 1      # until the motion is steady (as camera.js)
    cum = np.cumsum(P[s0 + 1:e + 1], 0)
    exc = np.array([corner(*c) for c in cum])
    amp = float(exc.max()); fin = float(exc[-1])
    # reversals: per-frame motion projected on the first big step's direction (corner-weighted)
    wts = np.array([1, 1, 1101, 1101])
    steps = P[s0 + 1:e + 1] * wts
    d0 = steps[np.argmax(np.linalg.norm(steps, axis=1))]; d0 = d0 / (np.linalg.norm(d0) + 1e-9)
    proj = steps @ d0; sig = np.sign(proj[np.abs(proj) > 1.5])
    rev = int((np.diff(sig) != 0).sum()) if len(sig) > 1 else 0
    zoomshare = float(np.abs(P[s0 + 1:e + 1, 2]).sum() * 1101 / (np.abs(steps).sum() + 1e-9))
    f_pk = g[int(np.argmax(acc[g]))]
    events.append(dict(f=int(g[0]), seg=segof(g[0]), k=round(float(kof(g[0])), 2), mus=music(int(round(kof(g[0])))),
                       amp=amp / Wd * 100, stay=fin / Wd * 100, dur=int(e - s0), rev=rev, zoom=zoomshare,
                       rotdeg=float(np.degrees(np.abs(np.cumsum(P[s0 + 1:e + 1, 3])).max())), accpk=float(acc[f_pk] / Wd * 100),
                       end=int(e)))
VIS = 0.3                                          # % of width: below this a jolt is not seen as a whole-frame move
ev = [e for e in events if e['amp'] >= VIS]
for e in ev:
    e['kind'] = ('shake' if e['rev'] >= 2 else 'there-back' if e['stay'] < 0.5 * e['amp'] else 'one-way')


def stats(fr0, fr1):
    E = [e for e in ev if fr0 <= e['f'] < fr1]; sec = (fr1 - fr0) / FPS; mn = sec / 60
    gaps = np.diff([e['f'] for e in E]) / FPS / B if len(E) > 1 else np.array([])
    # quiet gap: from the end of one jolt to the start of the next, in beats
    q = np.array([(E[i + 1]['f'] - E[i]['end']) / FPS / B for i in range(len(E) - 1)]) if len(E) > 1 else np.array([])
    cuts = int(cut[max(1, fr0):fr1].sum())
    moving = (v[fr0:fr1] > 1.0)                     # frame moving > ~0.05% W per frame, any cause
    jolting = np.zeros(fr1 - fr0, bool)
    for e in E: jolting[e['f'] - fr0 - 1:e['end'] - fr0 + 1] = True
    cj = int(((content[fr0:fr1] > 3.0) & ~np.r_[False, (content[fr0:fr1] > 3.0)[:-1]]).sum())
    return dict(sec=sec, n=len(E), per_min=len(E) / mn, amp_med=float(np.median([e['amp'] for e in E])) if E else 0,
                amp_p90=float(np.percentile([e['amp'] for e in E], 90)) if E else 0, amp_max=max([e['amp'] for e in E], default=0),
                dur_med=float(np.median([e['dur'] for e in E])) if E else 0, rev_sum=sum(e['rev'] for e in E),
                there_back=sum(e['kind'] == 'there-back' for e in E), shake=sum(e['kind'] == 'shake' for e in E),
                one_way=sum(e['kind'] == 'one-way' for e in E),
                gap_med_beats=float(np.median(q)) if len(q) else None, gap_lt2=int((q < 2).sum()) if len(q) else 0,
                gap_lt1=int((q < 1).sum()) if len(q) else 0,
                on_every_beat_runs=int(((gaps > 0.6) & (gaps < 1.4)).sum()) if len(gaps) else 0,
                cuts=cuts, cuts_per_min=cuts / mn, content_hits=cj, content_per_min=cj / mn,
                moving_frac=float(moving.mean()), jolting_frac=float(jolting.mean()))


mode = sys.argv[1] if len(sys.argv) > 1 else 'summary'
if mode == 'summary':
    S = stats(0, n)
    print('WHOLE FILM', {k: (round(v_, 2) if isinstance(v_, float) else v_) for k, v_ in S.items()})
    for m in range(0, int(np.ceil(n / 1800))):
        S = stats(m * 1800, min(n, (m + 1) * 1800))
        print(f'min {m}', {k: (round(v_, 2) if isinstance(v_, float) else v_) for k, v_ in S.items()})
    for s, a, b in SEG:
        S = stats(a, min(b, n))
        print(f'{s:4s}', {k: (round(v_, 2) if isinstance(v_, float) else v_) for k, v_ in S.items()})
if mode == 'events':
    for e in ev:
        print(f"{e['seg']:4s} f{e['f']:5d} k{e['k']:7.2f} {e['mus']:4s} {e['kind']:10s} amp{e['amp']:5.2f}% stay{e['stay']:5.2f}% "
              f"dur{e['dur']:3d}f rev{e['rev']:2d} zoom{e['zoom']:.2f} rot{e['rotdeg']:.2f}deg")
if mode == 'audit':
    # the rules of docs/制作约定.md 第六节「整屏运动」 (the same numbers as web/lib/camera.js MOTION). The film carries no
    # registrations, so every jolt over 1% is listed as 'needs 大击' and whips (one-way over 8%) as 'whip?' to be checked by eye.
    AMP, AMPBIG, OVER, GAP, PER, FRAC, WHIP = 1.0, 2.5, 0.15, 4, 8, 0.15, 8.0
    tot = dict(jolts=0, allowed=0)
    for s, a, b in SEG:
        E = [e for e in ev if a <= e['f'] < b]; prob = []
        for e in E:
            whip = e['kind'] != 'shake' and e['amp'] >= WHIP
            e['k2'] = f"k{e['k']:.1f}"
            if e['kind'] == 'shake': prob.append(f"{e['k2']} 抖 rev{e['rev']} {e['amp']:.1f}%")
            elif whip: prob.append(f"{e['k2']} whip? {e['amp']:.0f}% {e['dur']}f")
            else:
                if e['amp'] > AMPBIG: prob.append(f"{e['k2']} {e['amp']:.1f}% > 2.5%")
                elif e['amp'] > AMP: prob.append(f"{e['k2']} {e['amp']:.1f}% needs 大击")
                if e['kind'] == 'there-back': prob.append(f"{e['k2']} 弹回")
                elif e['stay'] < (1 - OVER) * e['amp']: prob.append(f"{e['k2']} overshoot {e['stay']:.1f}/{e['amp']:.1f}")
        for e in E:                                   # film-wide: the jolt before may be in the segment before
            i = ev.index(e)
            if i == 0: continue
            g = (e['f'] - ev[i - 1]['end']) / FPS / B
            if g < GAP - 1e-6: prob.append(f"{e['k2']} gap {g:.1f} beats")
        beats = (b - a) / FPS / B; ordinary = [e for e in E if not (e['kind'] != 'shake' and e['amp'] >= WHIP)]
        allowed = max(1, round(beats / PER)); inj = sum(e['dur'] for e in E) / (b - a)
        tot['jolts'] += len(ordinary); tot['allowed'] += allowed
        print(f"{s:4s} jolts {len(ordinary):3d} / allowed {allowed} | in-jolt {inj * 100:3.0f}% (max 15) | problems {len(prob) + (len(ordinary) > allowed) + (inj > FRAC)}")
    print('film', tot, f"= {tot['jolts'] / (n / FPS / 60):.1f}/min now, {tot['allowed'] / (n / FPS / 60):.1f}/min at most")
if mode == 'json':
    json.dump(dict(events=ev, cuts=[int(i) for i in np.where(cut)[0]]), open(os.path.join(HERE, 'motion_events.json'), 'w'), indent=0)
    print('wrote motion_events.json', len(ev))
