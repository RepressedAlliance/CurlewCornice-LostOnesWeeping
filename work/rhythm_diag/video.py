import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../..'))).replace('\\', '/')
"""Per-frame picture force of film.mp4 at 192x108 gray: frame difference, mean luma, histogram cut score, and a global
affine motion fit (translation + zoom) with the residual after compensating it. Writes video.npz next to this script."""
import os, subprocess
import numpy as np
from scipy import ndimage as nd

ROOT = _LO_ROOT
W, H = 192, 108
p = subprocess.run(['ffmpeg', '-v', 'error', '-i', ROOT + '/work/full/film.mp4', '-vf', f'scale={W}:{H}:flags=area',
                    '-pix_fmt', 'gray', '-f', 'rawvideo', '-'], capture_output=True, check=True)
F = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(np.float32)
n = len(F); print('frames', n)
mad = np.zeros(n); luma = F.mean((1, 2)); hist = np.zeros(n); tx = np.zeros(n); ty = np.zeros(n); dz = np.zeros(n); resid = np.zeros(n)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); xc = xx - W / 2; yc = yy - H / 2
prevh = None; prevb = None
for i in range(n):
    f = F[i]; b = nd.gaussian_filter(f, 1.2)
    h = np.histogram(f, 32, (0, 256))[0].astype(float); h /= h.sum()
    if i > 0:
        mad[i] = np.abs(f - F[i - 1]).mean()
        hist[i] = 0.5 * np.abs(h - prevh).sum()
        # Lucas-Kanade global model: u = a + s*xc, v = c + s*yc (translation + isotropic zoom), 2 Gauss-Newton steps
        a = c = s = 0.0
        for _ in range(3):
            # warp current toward previous: sample current at (x+u, y+v)
            u = a + s * xc; v = c + s * yc
            wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest')
            gy, gx = np.gradient(wb)
            It = wb - prevb
            m = np.ones_like(It, bool); m[:4] = m[-4:] = False; m[:, :4] = m[:, -4:] = False
            J = np.stack([gx[m], gy[m], gx[m] * xc[m] + gy[m] * yc[m]], 1)
            d, *_ = np.linalg.lstsq(J, -It[m], rcond=None)
            a += d[0]; c += d[1]; s += d[2]
        tx[i], ty[i], dz[i] = a, c, s
        u = a + s * xc; v = c + s * yc
        wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest')
        resid[i] = np.abs(wb - prevb)[6:-6, 6:-6].mean()
    prevh = h; prevb = b
    if i % 1000 == 0: print(i, flush=True)
np.savez(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'video.npz'), mad=mad, luma=luma, hist=hist, tx=tx, ty=ty, dz=dz, resid=resid)
print('done')
