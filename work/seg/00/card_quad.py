"""Measure the four corners of the card drawn in a picture: fit a straight line to each side of the near-white card face
(the inner edge of its outline) away from the rounded corners and the thumbs, and intersect the lines.
usage: python card_quad.py <png> <x0> <y0> <x1> <y1> [--rows y_a y_b] [--cols x_a x_b]
  the box is a rough box around the card; --rows limits the rows used for the left/right sides (thumbs), --cols the columns
  used for the top/bottom sides. A side that runs off the picture is reported as missing (the caller extrapolates it).
Prints TL, TR, BR, BL (image px, on the outline's centre: 1.5 px outside the face edge) and the side lengths."""
import sys, numpy as np
from PIL import Image
a = sys.argv[1:]
im = np.asarray(Image.open(a[0]).convert('RGBA')).astype(float) / 255
x0, y0, x1, y1 = map(int, a[1:5])
rows = cols = None
if '--rows' in a: i = a.index('--rows'); rows = (int(a[i + 1]), int(a[i + 2]))
if '--cols' in a: i = a.index('--cols'); cols = (int(a[i + 1]), int(a[i + 2]))
r, g, b, al = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); sat = (mx - mn) / np.maximum(mx, 1e-4)
face = (al > 0.9) & (mx > 0.85) & (sat < 0.08)
H, W = face.shape
cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
def run(line, start):
    # from start, walk outwards while the face is set; return the last face index
    i = start
    while 0 <= i + 1 < len(line) and line[i + 1]: i += 1
    return i
pad = 30
ra = rows or (y0 + pad, y1 - pad); ca = cols or (x0 + pad, x1 - pad)
L, R, T, B = [], [], [], []
for y in range(max(ra[0], 0), min(ra[1], H)):
    line = face[y]
    if not line[cx]: continue
    left = cx
    while left - 1 >= 0 and line[left - 1]: left -= 1
    right = run(line, cx)
    L.append((left - 1.5, y)); R.append((right + 1.5, y))
for x in range(max(ca[0], 0), min(ca[1], W)):
    col = face[:, x]
    if not col[cy]: continue
    top = cy
    while top - 1 >= 0 and col[top - 1]: top -= 1
    bot = run(col, cy)
    T.append((x, top - 1.5)); B.append((x, bot + 1.5 if bot < H - 1 else np.nan))
def fit_x_of_y(p):  # x = a*y + c
    p = np.array(p); m = np.median(p[:, 0]); p = p[np.abs(p[:, 0] - m) < 3]; return np.polyfit(p[:, 1], p[:, 0], 1)
def fit_y_of_x(p):
    p = np.array(p); p = p[~np.isnan(p[:, 1])]
    if len(p) < 20: return None
    m = np.median(p[:, 1]); p = p[np.abs(p[:, 1] - m) < 3]; return np.polyfit(p[:, 0], p[:, 1], 1)
fl, fr, ft, fb = fit_x_of_y(L), fit_x_of_y(R), fit_y_of_x(T), fit_y_of_x(B)
def meet(fx, fy):  # x = a y + c ; y = d x + e
    a_, c_ = fx; d_, e_ = fy; y = (d_ * c_ + e_) / (1 - d_ * a_); return (a_ * y + c_, y)
TL, TR = meet(fl, ft), meet(fr, ft)
print(f'left  x = {fl[0]:+.5f} y + {fl[1]:.2f}   right x = {fr[0]:+.5f} y + {fr[1]:.2f}')
print(f'top   y = {ft[0]:+.5f} x + {ft[1]:.2f}' + (f'   bottom y = {fb[0]:+.5f} x + {fb[1]:.2f}' if fb is not None else '   bottom: off the picture'))
out = {'TL': TL, 'TR': TR}
if fb is not None: out['BR'] = meet(fr, fb); out['BL'] = meet(fl, fb)
for k, v in out.items(): print(f'{k}: [{v[0]:.1f}, {v[1]:.1f}]')
w = np.hypot(TR[0] - TL[0], TR[1] - TL[1])
if fb is not None: print(f'top {w:.1f}  bottom {np.hypot(out["BR"][0]-out["BL"][0], out["BR"][1]-out["BL"][1]):.1f}  left {np.hypot(out["BL"][0]-TL[0], out["BL"][1]-TL[1]):.1f}  right {np.hypot(out["BR"][0]-TR[0], out["BR"][1]-TR[1]):.1f}  ratio {w/np.hypot(out["BL"][0]-TL[0], out["BL"][1]-TL[1]):.3f}')
else: print(f'top {w:.1f}; a 3:2 card would reach y {TL[1] + w / 1.5:.1f}')
