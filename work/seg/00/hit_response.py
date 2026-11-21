import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Does the picture answer every hit of the opening figure? (2026-11-21 review: k2.5 / k4.5 had no visible reaction.)
Two measures on a rendered seg_00 (frames dir of g_XXXXXXX.png, or an mp4):
  1. the coarse test of work/rhythm_diag (video.py + align.py): 192x108 gray, global translation+zoom fit, residual content,
     camera acceleration; a hit 'reacts' if in frames f-1..f+2 (f = round(beatV(k)*30)) there is a cut, content > 4,
     acc > 6 or flash > 12;
  2. full size: share of pixels changed by > 0.2 (gray 0..1) between the frame before the hit and the frame after it settles.
usage: python work/seg/00/hit_response.py [work/seg/00/frames | work/seg/00/seg_00.mp4]"""
import sys, os, glob, subprocess
import numpy as np
from PIL import Image
from scipy import ndimage as nd
from scipy.ndimage import median_filter

src = sys.argv[1] if len(sys.argv) > 1 else (_LO_ROOT + '/work/seg/00/frames')
W, H = 192, 108
if src.endswith('.mp4'):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-pix_fmt', 'gray', '-f', 'rawvideo', '-'], capture_output=True, check=True)
    full = np.frombuffer(p.stdout, np.uint8).reshape(-1, 1080, 1920).astype(np.float32) / 255
else:
    files = sorted(glob.glob(os.path.join(src, 'g_*.png')))
    full = np.stack([np.asarray(Image.open(f).convert('L'), np.float32) / 255 for f in files])
F = np.stack([np.asarray(Image.fromarray((f * 255).astype(np.uint8)).resize((W, H), Image.BOX), np.float32) for f in full])
n = len(F)
mad = np.zeros(n); luma = F.mean((1, 2)); hist = np.zeros(n); tx = np.zeros(n); ty = np.zeros(n); dz = np.zeros(n); resid = np.zeros(n)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); xc = xx - W / 2; yc = yy - H / 2
prevh = prevb = None
for i in range(n):
    f = F[i]; b = nd.gaussian_filter(f, 1.2)
    h = np.histogram(f, 32, (0, 256))[0].astype(float); h /= h.sum()
    if i > 0:
        hist[i] = 0.5 * np.abs(h - prevh).sum()
        a = c = s = 0.0
        for _ in range(3):
            u = a + s * xc; v = c + s * yc
            wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest')
            gy, gx = np.gradient(wb); It = wb - prevb
            m = np.ones_like(It, bool); m[:4] = m[-4:] = False; m[:, :4] = m[:, -4:] = False
            J = np.stack([gx[m], gy[m], gx[m] * xc[m] + gy[m] * yc[m]], 1)
            d, *_ = np.linalg.lstsq(J, -It[m], rcond=None); a += d[0]; c += d[1]; s += d[2]
        tx[i], ty[i], dz[i] = a, c, s
        wb = nd.map_coordinates(b, [yy + c + s * yc, xx + a + s * xc], order=1, mode='nearest')
        resid[i] = np.abs(wb - prevb)[6:-6, 6:-6].mean()
    prevh = h; prevb = b
cut = (hist > 0.22) | (resid > 25)
base = median_filter(resid, 31)
content = np.where(cut, 0, np.maximum(0, resid - base))
vel = np.stack([tx * 10, ty * 10, dz * 1000], 1)
acc = np.r_[0, np.linalg.norm(np.diff(vel, axis=0), axis=1)]; acc[cut] = 0; acc[np.r_[False, cut[:-1]]] = 0
flash = np.abs(luma - median_filter(luma, 9)); flash[cut] = 0
beat = lambda k: 0.318 + k * 60 / 162
print(f'{"hit":>5} {"frame":>5} {"content":>7} {"acc":>6} {"flash":>6}  coarse   full-size changed (before -> settled)')
for k in [0, 0.5, 1, 2, 2.5, 3, 4, 4.5, 5, 6, 7]:
    f = int(round(beat(k) * 30)); w = slice(max(0, f - 1), min(n, f + 3))
    r = dict(cut=bool(cut[w].any()), content=float(content[w].max()), acc=float(acc[w].max()), flash=float(flash[w].max()))
    ok = r['cut'] or r['content'] > 4 or r['acc'] > 6 or r['flash'] > 12
    g0 = int(np.ceil(beat(k) * 30 - 1e-6)); pre, post = g0 - 1, min(n - 1, g0 + 4)
    ch = float((np.abs(full[post] - full[pre]) > 0.2).mean() * 100) if pre >= 0 else float('nan')
    print(f'{k:>5} {f:>5} {r["content"]:7.2f} {r["acc"]:6.2f} {r["flash"]:6.2f}  {"REACTS" if ok else "none  "}   {ch:6.2f}%  (g{pre} -> g{post})')
