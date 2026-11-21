import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../..'))).replace('\\', '/')
"""Whole-frame motion of film.mp4, frame by frame (2026-11-21 motion pass: "一直抖动屏幕……看着很晕").
Streams the film at 384x216 gray (no full load: the machine is in use), fits a global similarity per frame pair
(translation a, c; isotropic zoom s; roll r) coarse-to-fine with robust (Cauchy) weights, so characters moving inside the
frame do not count as camera. Writes motion.npz: tx, ty in 1920-px units per frame, dz (scale change per frame), rot
(radians per frame), resid (mean abs residual after compensation), hist (histogram change, for cuts), luma.
Single process, single thread; run at BelowNormal priority.
  python work/rhythm_diag/motion_fit.py [film.mp4]"""
import os, sys, subprocess
os.environ.setdefault('OMP_NUM_THREADS', '1'); os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')
import numpy as np
from scipy import ndimage as nd

ROOT = _LO_ROOT
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + '/work/full/film.mp4'
W, H = 384, 216
SC = 1920 / W
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-threads', '2', '-i', SRC, '-vf', f'scale={W}:{H}:flags=area',
                      '-pix_fmt', 'gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
LV = []
for f in (2, 1):                                        # pyramid levels: 192x108 then 384x216
    h, w = H // f, W // f
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    m = np.ones((h, w), bool); e = 6 // f + 2; m[:e] = m[-e:] = False; m[:, :e] = m[:, -e:] = False
    LV.append((f, y, x, x - w / 2, y - h / 2, m))


def fit(prev, cur, iters=(4, 4)):
    a = c = s = r = 0.0                                 # in full-level (384) pixels; s, r dimensionless
    for (f, y, x, xc, yc, m), it in zip(LV, iters):
        P = prev[f]; C = cur[f]
        for _ in range(it):
            u = a / f + s * xc - r * yc; v = c / f + s * yc + r * xc
            wb = nd.map_coordinates(C, [y + v, x + u], order=1, mode='nearest')
            gy, gx = np.gradient(wb)
            It = (wb - P)[m]; gx = gx[m]; gy = gy[m]; X = xc[m]; Y = yc[m]
            sig = max(2.0, 1.4826 * np.median(np.abs(It)) * 2)
            wt = 1 / (1 + (It / sig) ** 2)
            J = np.stack([gx, gy, gx * X + gy * Y, -gx * Y + gy * X], 1)
            JW = J * wt[:, None]
            try: d = np.linalg.solve(JW.T @ J + 1e-3 * np.eye(4), -(JW.T @ It))
            except np.linalg.LinAlgError: break
            a += d[0] * f; c += d[1] * f; s += d[2]; r += d[3]
            if abs(d[0]) + abs(d[1]) < 1e-3 and abs(d[2]) + abs(d[3]) < 1e-6: break
    f, y, x, xc, yc, m = LV[1]
    u = a + s * xc - r * yc; v = c + s * yc + r * xc
    wb = nd.map_coordinates(cur[1], [y + v, x + u], order=1, mode='nearest')
    return a, c, s, r, float(np.abs(wb - prev[1])[m].mean())


def pyr(fr):
    b = nd.gaussian_filter(fr, 1.0)
    return {1: b, 2: nd.gaussian_filter(fr, 2.0)[::2, ::2].copy()}


out = {k: [] for k in ['tx', 'ty', 'dz', 'rot', 'resid', 'hist', 'luma', 'mad']}
prev = prevh = prevf = None; i = 0
while True:
    buf = p.stdout.read(W * H)
    if len(buf) < W * H: break
    fr = np.frombuffer(buf, np.uint8).reshape(H, W).astype(np.float32)
    hh = np.histogram(fr, 32, (0, 256))[0].astype(float); hh /= hh.sum()
    cur = pyr(fr)
    if prev is None:
        vals = (0, 0, 0, 0, 0, 0, fr.mean(), 0)
    else:
        a, c, s, r, res = fit(prev, cur)
        vals = (a * SC, c * SC, s, r, res, 0.5 * np.abs(hh - prevh).sum(), fr.mean(), np.abs(fr - prevf).mean())
    for k, v in zip(out, vals): out[k].append(v)
    prev, prevh, prevf = cur, hh, fr; i += 1
    if i % 500 == 0: print(i, flush=True)
p.wait()
np.savez(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'motion.npz'), **{k: np.array(v) for k, v in out.items()})
print('done', i)
