"""Refit the Les Paul design sheet to real guitar geometry (set pack round 3, 2026-11-20).

Codex keeps drawing the Les Paul with the body about 15% too big for its neck, so fret 12 lands at ~44% of the nut-to-bridge
length instead of 50% (art review). Asking again does not move it: Codex keeps the layout of the sheet it redraws. This
re-proportions a Codex sheet geometrically, without repainting anything:
  - all three views (front | side | back, aligned in height) are scaled by one factor s about their own centre line, so the body
    keeps its drawn shape and becomes 44 x 33 cm against a 62.9 cm scale;
  - the neck between the nut and the body is stretched in height to the real scale length;
  - on the front view the fingerboard strip is remapped fret by fret (piecewise in height) so that every fret lands on its
    equal-temperament position: fret n at L * (1 - 2^(-n/12)) from the nut, fret 12 at exactly half the scale;
  - the neck pickup is moved down just enough to clear the (now longer) fingerboard end, as on the real guitar.
usage: python tools/lespaul_refit.py in.png out.png [--nut Y] [--board-end Y]
  (--nut: first fingerboard row under the nut; --board-end: last row of the fingerboard's end outline; both measured
  automatically when left out, but the truss-rod cover and the pickup can fool the automatic guess, so check the printout)
Prints the measured and the new fret positions.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
opt = lambda k: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else None
im = np.asarray(Image.open(src).convert('RGBA')).astype(np.float64) / 255
H, W = im.shape[:2]
pm = im.copy()
pm[..., :3] *= pm[..., 3:4]                 # premultiplied, so resampling leaves no fringe
a = im[..., 3]
lum = im[..., :3] @ np.array([0.2126, 0.7152, 0.0722])
VIEWS = [(0, 620), (620, 950), (950, W)]


def opaque_rows(x0, x1):
    m = a[:, x0:x1] > 0.5
    ys = np.nonzero(m.any(1))[0]
    return ys.min(), ys.max()


top, bottom = opaque_rows(0, W)
# ---- measure the front view ----
fx0, fx1 = VIEWS[0]
# nut: the cream bar just above the fingerboard; N = first fingerboard row under it
col = lum[:, fx0:fx1]
rows300 = np.nonzero(a[300, fx0:fx1] > 0.5)[0] + fx0
bl, br = rows300.min(), rows300.max()
cx = (bl + br) // 2
y = 150
while not (lum[y, cx] > 0.6 and lum[y + 1, cx] > 0.6):
    y += 1
while lum[y, cx] > 0.45:
    y += 1
N = y                                          # first dark (rosewood) row below the nut
if opt('--nut'): N = int(opt('--nut'))
# bridge bar: grey rows at the board centre column near the lower body, the saddle line is its middle
sat = im[..., :3].max(2) - im[..., :3].min(2)
ys = [y for y in range(700, 900) if sat[y, cx] < 0.05 and 0.35 < lum[y, cx] < 0.9 and a[y, cx] > 0.9]
grp = [ys[0]]
for y in ys[1:]:
    if y - grp[-1] <= 3:
        grp.append(y)
    else:
        if len(grp) >= 8:
            break
        grp = [y]
B = (grp[0] + grp[-1]) / 2
# body width (front) -> px per cm of the drawn body
wid = [(a[y, fx0:fx1] > 0.5).sum() for y in range(int(B) - 120, int(B) + 150)]
k_b = max(wid) / 33.0
# fingerboard edges (fit on the free neck), board end, frets
ys_fit = np.arange(N + 10, 470)
L_ = np.array([np.nonzero(a[y, fx0:fx1] > 0.5)[0].min() + fx0 for y in ys_fit])
R_ = np.array([np.nonzero(a[y, fx0:fx1] > 0.5)[0].max() + fx0 for y in ys_fit])
pl, pr = np.polyfit(ys_fit, L_, 1), np.polyfit(ys_fit, R_, 1)
xl = lambda y: np.polyval(pl, y)
xr = lambda y: np.polyval(pr, y)
rose = lambda y: lum[y, cx - 3:cx + 4].mean() < 0.33 and (im[y, cx, 0] - im[y, cx, 2]) > 0.02
y = 560
last = y
while y < 700:
    if rose(y):
        last = y
    y += 1
E_old = last + 1
while lum[E_old, cx] < 0.35:                   # the board's end outline
    E_old += 1
if opt('--board-end'): E_old = int(opt('--board-end'))
prof = []
for y in range(N, E_old):
    l0, r0 = xl(y), xr(y)
    cols = list(range(int(l0) + 6, int(l0) + 11)) + list(range(int(r0) - 10, int(r0) - 5))
    prof.append(np.median(lum[y, cols]))
prof = np.array(prof)
fy = np.nonzero(prof > 0.42)[0] + N
frets, g_ = [], [fy[0]]
for y in fy[1:]:
    if y - g_[-1] <= 2:
        g_.append(y)
    else:
        frets.append(np.mean(g_)); g_ = [y]
frets.append(np.mean(g_))
frets = [f for f in frets if N + 3 < f < E_old - 3]
assert len(frets) == 22, f'found {len(frets)} frets: {frets}'

# ---- the new geometry ----
s = (bottom - top) / ((N - top) + 62.9 * k_b + (bottom - B))
N2 = top + s * (N - top)
L2 = 62.9 * k_b * s
B2 = N2 + L2
k2 = k_b * s
t = [N2 + L2 * (1 - 2 ** (-n / 12)) for n in range(1, 23)]
tE = t[-1] + 0.45 * k2
Yc = 480.0                                    # rows above: neck (stretched); below: body (scaled)
gb = lambda y: B2 + s * (y - B)


def g(y):
    y = np.asarray(y, dtype=np.float64)
    return np.where(y <= N, top + s * (y - top),
                    np.where(y < Yc, N2 + (y - N) * (gb(Yc) - N2) / (Yc - N), gb(y)))


# inverse of g by interpolation (monotonic)
yy = np.linspace(0, H - 1, 4 * H)
ginv = lambda yo: np.interp(yo, g(yy), yy)
hk_src = np.array([N] + frets + [E_old], dtype=np.float64)
hk_dst = np.array([N2] + t + [tE])
hinv = lambda yo: np.interp(yo, hk_dst, hk_src)

# ---- move the neck pickup down (in the source) so it clears the new board end ----
pk_top_src = None
for y in range(E_old, E_old + 30):            # first cream row under the board end at the centre
    if lum[y, cx] > 0.75 and a[y, cx] > 0.9:
        pk_top_src = y
        break
ys_c = [y for y in range(pk_top_src, pk_top_src + 80) if lum[y, cx] > 0.6]
pk_bot_src = ys_c[-1] + 6                       # its outline and shadow
row = pk_top_src + 30
xs_c = np.nonzero(lum[row, fx0:fx1] > 0.6)[0] + fx0
pk_x0 = cx
while pk_x0 > fx0 and lum[row, pk_x0 - 1] > 0.3:
    pk_x0 -= 1
pk_x1 = cx
while lum[row, pk_x1 + 1] > 0.3:
    pk_x1 += 1
pk_x0 -= 6; pk_x1 += 6
want_top = tE + 3
d_src = int(np.ceil((want_top - B2) / s + B - pk_top_src))
src_pm = pm.copy()
if d_src > 0:
    blk = pm[pk_top_src - 3:pk_bot_src, pk_x0:pk_x1].copy()
    # fill the vacated band with a row from beside the board's end, above its drop shadow and the pickguard screw (under the
    # board this row is rosewood, which the remapped fingerboard covers)
    fill = pm[E_old - 12, pk_x0:pk_x1].copy()
    # right of the board's end the pickguard comes up to the board; that row is still above the pickguard's top edge there,
    # so take those columns from under the pickup instead (cream pickguard)
    r0 = int(np.ceil(xr(E_old))) + 2 - pk_x0
    fill[r0:] = pm[pk_bot_src + 8, pk_x0 + r0:pk_x1]
    src_pm[pk_top_src - 3:pk_top_src - 3 + d_src, pk_x0:pk_x1] = fill
    src_pm[pk_top_src - 3 + d_src:pk_bot_src + d_src, pk_x0:pk_x1] = blk

# ---- resample ----
out = np.zeros_like(pm)
Yo, Xo = np.mgrid[0:H, 0:W].astype(np.float64)
for (x0, x1) in VIEWS:
    r = np.nonzero(a[300, x0:x1] > 0.5)[0] + x0
    ax = (r.min() + r.max()) / 2
    sl = slice(x0, x1)
    xs = ax + (Xo[:, sl] - ax) / s
    ys_ = ginv(Yo[:, sl])
    view_src = np.zeros_like(src_pm)                     # sample only this view's own pixels
    view_src[:, x0:x1] = src_pm[:, x0:x1]
    for c in range(4):
        out[:, sl, c] = ndimage.map_coordinates(view_src[..., c], [ys_, xs], order=1, mode='constant', cval=0)
    if x0 == 0:
        axf = ax
# front fingerboard strip, remapped fret by fret, laid over
sl = slice(0, 620)
yo = Yo[:, sl]
xo = Xo[:, sl]
inband = (yo >= N2) & (yo <= tE + 1)
ys_h = hinv(yo)
xs_h = axf + (xo - axf) / s
mask = inband & (xs_h >= xl(ys_h) - 1.5) & (xs_h <= xr(ys_h) + 1.5)
strip = np.zeros(yo.shape + (4,))
for c in range(4):
    strip[..., c] = ndimage.map_coordinates(pm[..., c], [ys_h, xs_h], order=1, mode='constant', cval=0)
strip[~mask] = 0
base = out[:, sl]
out[:, sl] = strip + base * (1 - strip[..., 3:4])

res = out.copy()
al = res[..., 3:4]
res[..., :3] = np.where(al > 1e-6, res[..., :3] / np.maximum(al, 1e-6), 0)
Image.fromarray((np.clip(res, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA').save(dst)
print(f'measured: nut {N}, bridge {B:.1f}, body {k_b:.2f} px/cm, frets {[round(f) for f in frets]}, board end {E_old}')
print(f'fret 12 was at {(frets[11] - N) / (B - N):.3f} of the scale')
print(f'new: scale factor {s:.4f}, nut {N2:.1f}, bridge {B2:.1f}, {k2:.2f} px/cm, frets {[round(v) for v in t]}, board end {tE:.1f}')
print(f'neck pickup moved down {d_src} source px; total length {(g(bottom) - g(top)) / k2:.1f} cm')
