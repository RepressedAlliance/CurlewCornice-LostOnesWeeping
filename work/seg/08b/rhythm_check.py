import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Beat-by-beat picture response of a segment film against the drums (same measures and thresholds as
work/rhythm_diag/video.py + align.py). usage: python rhythm_check.py <seg.mp4> <global first frame> <k0> <k1>"""
import sys, json, subprocess
import numpy as np
from scipy import ndimage as nd
from scipy.ndimage import median_filter
ROOT = _LO_ROOT
mp4, G0, K0, K1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
W, H = 192, 108
p = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf', f'scale={W}:{H}:flags=area', '-pix_fmt', 'gray', '-f', 'rawvideo', '-'], capture_output=True, check=True)
F = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(np.float32); n = len(F)
luma = F.mean((1, 2)); hist = np.zeros(n); tx = np.zeros(n); ty = np.zeros(n); dz = np.zeros(n); resid = np.zeros(n)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); xc = xx - W / 2; yc = yy - H / 2
prevh = prevb = None
for i in range(n):
    f = F[i]; b = nd.gaussian_filter(f, 1.2); h = np.histogram(f, 32, (0, 256))[0].astype(float); h /= h.sum()
    if i:
        hist[i] = 0.5 * np.abs(h - prevh).sum(); a = c = s = 0.0
        for _ in range(3):
            u = a + s * xc; v = c + s * yc; wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest')
            gy, gx = np.gradient(wb); It = wb - prevb; m = np.ones_like(It, bool); m[:4] = m[-4:] = False; m[:, :4] = m[:, -4:] = False
            J = np.stack([gx[m], gy[m], gx[m] * xc[m] + gy[m] * yc[m]], 1); d, *_ = np.linalg.lstsq(J, -It[m], rcond=None); a += d[0]; c += d[1]; s += d[2]
        tx[i], ty[i], dz[i] = a, c, s; u = a + s * xc; v = c + s * yc
        wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest'); resid[i] = np.abs(wb - prevb)[6:-6, 6:-6].mean()
    prevh, prevb = h, b
cut = (hist > 0.22) | (resid > 25); cut[0] = True
content = np.where(cut, 0, np.maximum(0, resid - median_filter(resid, 31)))
vel = np.stack([tx * 10, ty * 10, dz * 1000], 1); acc = np.r_[0, np.linalg.norm(np.diff(vel, axis=0), axis=1)]; acc[cut] = 0; acc[np.r_[False, cut[:-1]]] = 0
flash = np.abs(luma - median_filter(luma, 9)); flash[cut] = 0
D = json.load(open(ROOT + '/work/rhythm_diag/drums.json')); bt = D['beats']
fr = lambda k: int(round((0.318 + k * 60 / 162) * 30)) - G0
still = (np.abs(vel).max(1) < 0.3) & (content < 1) & ~cut
hits = 0; rows = []
for k in range(K0, K1):
    f = fr(k)
    if f < 0 or f >= n: continue
    w = slice(max(0, f - 1), min(n, f + 3))
    r = dict(cut=bool(cut[w].any()), content=float(content[w].max()), acc=float(acc[w].max()), flash=float(flash[w].max()))
    ok = r['cut'] or r['content'] > 4 or r['acc'] > 6 or r['flash'] > 12; hits += ok
    # where in the window the strongest response is (frames from the beat's frame): later than +2 = dragging, before = early
    sc = np.maximum.reduce([cut[w] * 100, content[w], acc[w], flash[w] * 0.5]); off = int(np.argmax(sc)) + max(0, f - 1) - f
    b = bt[k]; mus = ('C' if b['crash_db'] > 6 else ' ') + ('K' if b['kick'] > 1.2 else 'k' if b['kick'] > 0.8 else '.') + ('S' if b['snare'] > 0.95 else 's' if b['snare'] > 0.75 else '.')
    rows.append(f"k{k} f{f + G0} {'|' if k % 4 == 0 else ' '} {mus} rms {b['rms_db']:4.1f}  {'HIT' if ok else '   '} cut {int(r['cut'])} cont {r['content']:5.1f} acc {r['acc']:5.1f} flash {r['flash']:5.1f} peak@{off:+d}")
print('\n'.join(rows))
print(f"beats with a response {hits}/{len(rows)} ({100 * hits / len(rows):.0f}%), still frames {100 * still.mean():.0f}%, mean |motion| {np.abs(vel).mean():.2f}")
