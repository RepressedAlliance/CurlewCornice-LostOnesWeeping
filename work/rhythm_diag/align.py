"""Music events (drums.json) against picture events (video.npz), per segment."""
import json, sys
import numpy as np
from scipy.ndimage import median_filter
from mstruct import SEG

D = json.load(open('drums.json')); bt = D['beats']; sl = D['slots']
z = np.load('video.npz')
mad, luma, hist, tx, ty, dz, resid = (z[k] for k in ['mad', 'luma', 'hist', 'tx', 'ty', 'dz', 'resid'])
n = len(mad); B = 60 / 162; BV0 = 0.318
fr = lambda k: int(round((BV0 + k * B) * 30))
# camera speed in 1920-px units per frame (translation) and zoom rate
spd = np.hypot(tx, ty) * 10; zr = np.abs(dz)
cut = (hist > 0.22) | (resid > 25)
chg = resid.copy(); chg[cut] = 0
base = median_filter(resid, 31)
content = np.where(cut, 0, np.maximum(0, resid - base))           # local content jumps (stamps, swaps, prints)
vel = np.stack([tx * 10, ty * 10, dz * 1000], 1)
acc = np.r_[0, np.linalg.norm(np.diff(vel, axis=0), axis=1)]; acc[cut] = 0; acc[np.r_[False, cut[:-1]]] = 0
lm = median_filter(luma, 9); flash = np.abs(luma - lm); flash[cut] = 0
zr = np.minimum(zr, 0.05); spd = np.minimum(spd, 60)
force = np.minimum(resid, 60) + spd + zr * 400


def vresp(f):
    w = slice(max(0, f - 1), min(n, f + 3))
    c = cut[w].any()
    return dict(cut=bool(c), content=float(content[w].max()), acc=float(acc[w].max()), flash=float(flash[w].max()))


def strong(r):
    return r['cut'] or r['content'] > 4 or r['acc'] > 6 or r['flash'] > 12


K = np.array([b['kick'] for b in bt]); Sn = np.array([b['snare'] for b in bt]); Cr = np.nan_to_num(np.array([b['crash_db'] for b in bt]))
R = np.array([b['rms_db'] for b in bt])
mode = sys.argv[1] if len(sys.argv) > 1 else 'sum'
if mode == 'sum':
    for name, a, b in SEG:
        ks = [k for k in range(a, b) if fr(k) < n]
        f0, f1 = fr(a), min(n, fr(b))
        resp = {k: vresp(fr(k)) for k in ks}
        bars = [k for k in ks if k % 4 == 0]; back = [k for k in ks if k % 2 == 1 and Sn[k] > 0.9]
        crs = [k for k in ks if Cr[k] > 6 and R[k] > 40]
        miss_cr = [k for k in crs if not strong(resp[k])]
        bar_hit = sum(strong(resp[k]) for k in bars)
        back_hit = sum(strong(resp[k]) for k in back)
        ncut = int(cut[f0:f1].sum()); sec = (f1 - f0) / 30
        # visual events per beat (any strong response)
        ev = sum(strong(resp[k]) for k in ks)
        # off-beat strong events: frames with cut/content/acc not within 1 frame of a half beat
        hb = set()
        for k2 in np.arange(a, b, 0.5): hb.update(range(fr(k2) - 1, fr(k2) + 2))
        off = [f for f in range(f0, f1) if (cut[f] or content[f] > 6 or acc[f] > 8) and f not in hb]
        print(f"{name:3s} k{a}-{b} {sec:5.1f}s music rms{np.median(R[ks]):5.1f} | pic force{force[f0:f1].mean():6.1f} cuts{ncut:3d} ({ncut/sec*60:4.0f}/min) "
              f"beats-with-hit {ev}/{len(ks)} | bar1 {bar_hit}/{len(bars)} | backbeat {back_hit}/{len(back)} | crash miss {miss_cr}/{crs} | offbeat-frames {off[:12]}{'...' if len(off)>12 else ''}")
if mode == 'beats':
    a, b = int(sys.argv[2]), int(sys.argv[3])
    for k in range(a, b):
        f = fr(k); r = vresp(f); x = bt[k]
        mus = ('C' if Cr[k] > 6 else ' ') + ('K' if K[k] > 0.9 else 'k' if K[k] > 0.6 else '.') + ('S' if Sn[k] > 1.1 else 's' if Sn[k] > 0.75 else '.')
        pic = ('CUT ' if r['cut'] else '    ') + f"cont{r['content']:5.1f} acc{r['acc']:5.1f} fl{r['flash']:5.1f}"
        w = slice(f - 6, f + 6)
        print(f"k{k:3d} f{f:4d} {'|' if k % 4 == 0 else ' '} {mus} rms{x['rms_db']:5.1f}  {'*' if strong(r) else ' '} {pic}  spd{spd[f]:5.1f} zr{zr[f]*1000:5.1f} force{force[f]:5.1f}")
if mode == 'frames':
    a, b = int(sys.argv[2]), int(sys.argv[3])
    for f in range(a, b):
        kk = (f / 30 - BV0) / B
        print(f"f{f} k{kk:7.2f} mad{mad[f]:6.1f} res{resid[f]:6.1f} hist{hist[f]:.3f} tx{tx[f]*10:6.1f} ty{ty[f]*10:6.1f} dz{dz[f]*1000:6.1f} luma{luma[f]:6.1f} {'CUT' if cut[f] else ''}")
