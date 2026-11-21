"""Fit the Les Paul sheet's SIDE and BACK neck to the real neck (set pack round 4, 2026-11-20, second art review).

The review measured the side-view neck at 3.3-4.3 cm deep (real: about 2.2-2.6 cm including the fingerboard) and the back-view
neck 12-17% wider than the front view. Codex redraws keep their own neck, so this re-proportions it geometrically, without
repainting anything (same principle as tools/lespaul_refit.py):
  - side view (middle third): on every neck row the dark-brown neck behind the cream fingerboard binding is resampled narrower,
    so that from the binding's front edge to the back of the neck is 2.1 cm at the nut growing to 2.4 cm from fret 12 on (with the string and fret line drawn in front, the whole side-view neck is about 2.7-3.0 cm); the
    strings, frets and binding in front are untouched; blended in over the headstock transition and stopped at the body;
  - back view (right third): every neck row is resampled about its own centre to the width of the front-view neck on that row;
  - optional --front-scale S: first the front view's free neck (nut to body) is resampled about its centre by S, ramped in over
    the headstock throat and out over the last 80 rows above the body, for a redraw that came back with a wider neck.
Scale: the body's drawn length = 44 cm.
usage: python tools/lespaul_neckfit.py in.png out.png [--nut Y] [--fret12 Y] [--join Y] [--front-scale S]
"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
opt = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
im = np.asarray(Image.open(src).convert('RGBA')).astype(np.float64)
H, W = im.shape[:2]
a = im[..., 3] > 128
VIEWS = [(0, 620), (620, 950), (950, W)]


def seg(y, x0, x1, near=None):
    """opaque runs of row y in [x0, x1); the one containing / nearest `near` (default: the widest)"""
    row = a[y, x0:x1]
    runs, x = [], 0
    while x < len(row):
        if row[x]:
            s = x
            while x < len(row) and row[x]:
                x += 1
            runs.append((s + x0, x - 1 + x0))
        x += 1
    if not runs:
        return None
    if near is None:
        return max(runs, key=lambda r: r[1] - r[0])
    return min(runs, key=lambda r: 0 if r[0] <= near <= r[1] else min(abs(r[0] - near), abs(r[1] - near)))


# body length on the front view -> px per cm
fy = np.nonzero(a[:, :620].any(1))[0]
wid = a[:, :620].sum(1)
b_top = next(y for y in range(400, H) if wid[y] > 1.15 * wid[480])          # the horn leaves the neck
b_bot = max(y for y in range(H) if wid[y] > 40)                              # the tail (not the strap button)
body_rows = np.array([b_top, b_bot])
k = (b_bot - b_top) / 44.0
nut = opt('--nut', 175)
f12 = opt('--fret12', 505)
join = int(opt('--join', 558))
print(f'body {body_rows.min()}-{body_rows.max()} -> {k:.2f} px/cm; nut {nut}, fret 12 {f12}, side join {join}')

pm = im.copy()
pm[..., :3] *= pm[..., 3:4] / 255.0
out = pm.copy()


def put_span(y, s0, s1, d0, d1, clear):
    """resample source columns [s0, s1) of row y onto [d0, d1) (fractional, edges antialiased by coverage), after clearing the
    columns in `clear` (the old span and its antialiased fringe)"""
    out[y, clear[0]:clear[1]] = 0
    for x in range(int(np.floor(d0)), int(np.ceil(d1))):
        cov = min(x + 1, d1) - max(x, d0)
        if cov <= 0:
            continue
        xm = (max(x, d0) + min(x + 1, d1)) / 2
        xsrc = s0 + (xm - d0) * (s1 - s0) / (d1 - d0) - 0.5
        xsrc = min(max(xsrc, s0), s1 - 1)
        x0 = int(np.floor(xsrc)); t = xsrc - x0
        out[y, x] = (pm[y, x0] * (1 - t) + pm[y, min(x0 + 1, W - 1)] * t) * cov


def fringe(y, r0, r1, side):
    """the old run plus its soft edge pixels"""
    c0, c1 = r0, r1 + 1
    if side in ('l', 'b'):
        while c0 > 0 and im[y, c0 - 1, 3] > 0 and r0 - c0 < 4:
            c0 -= 1
    if side in ('r', 'b'):
        while c1 < W and im[y, c1, 3] > 0 and c1 - r1 < 5:
            c1 += 1
    return c0, c1


def smooth(ys, vals, deg=3):
    ys, vals = np.asarray(ys, float), np.asarray(vals, float)
    return np.polyval(np.polyfit(ys, vals, deg), ys)


fs = opt('--front-scale', 1.0)
if fs != 1.0:
    fc = None
    for y in range(int(nut) - 14, b_top):
        r = seg(y, *VIEWS[0], near=fc)
        if r is None:
            continue
        fc = (r[0] + r[1]) // 2
        ramp = min(np.clip((y - (nut - 14)) / 20.0, 0, 1), np.clip((b_top - y) / 80.0, 0, 1))
        f = 1 + (fs - 1) * ramp
        c = (r[0] + r[1] + 1) / 2
        w = r[1] - r[0] + 1
        put_span(y, r[0], r[1] + 1, c - w * f / 2, c + w * f / 2, fringe(y, r[0], r[1], 'b'))
    pm = out.copy()
    im = pm.copy()
    al = im[..., 3:4] / 255.0
    im[..., :3] = np.where(al > 1e-6, im[..., :3] / np.maximum(al, 1e-6), 0)
    a = im[..., 3] > 128
    print(f'front neck scaled by {fs} (rows {int(nut) - 14}-{b_top})')

lum = im[..., :3] @ np.array([0.2126, 0.7152, 0.0722]) / 255
# ---- side view ----
sx0, sx1 = VIEWS[1]
cx_side = None
rows = []
for y in range(120, join + 1):
    r = seg(y, sx0, sx1, near=cx_side)
    if r is None:
        continue
    xl, xr = r
    cx_side = (xl + xr) // 2
    cream = [x for x in range(xl, min(xl + 25, xr)) if lum[y, x] > 0.75]      # the binding, nearest the front (left) edge
    rows.append((y, cream[0], cream[-1] + 1, xr) if cream else (y, None, xl, xr))
# rows where the binding is not found (the nut, a fret) take the binding's usual place behind the front edge
good = [r for r in rows if r[1] is not None]
d_front = np.median([r[1] - seg(r[0], sx0, sx1, near=(r[1] + r[3]) // 2)[0] for r in good])
d_back = np.median([r[2] - r[1] for r in good])
rows = [r if r[1] is not None else (r[0], r[2] + d_front, int(round(r[2] + d_front + d_back)), r[3]) for r in rows]
R = np.array(rows, float)
fit = R[:, 0] >= 195
xb0_s = R[:, 1].copy()
xb0_s[fit] = smooth(R[fit, 0], R[fit, 1])
wants = []
for (y, _, xb, xr), xb0 in zip(rows, xb0_s):
    T = (2.1 + 0.3 * np.clip((y - nut) / (f12 - nut), 0, 1)) * k
    blend = np.clip((y - 166) / 34.0, 0, 1)          # 0 in the headstock, full from y=200
    wants.append((xb0 + T) * blend + (xr + 1) * (1 - blend))
wants = np.array(wants)
ker = np.ones(9) / 9                                  # a smooth back line (no row-to-row steps)
wants = np.convolve(np.pad(wants, 4, mode='edge'), ker, mode='valid')
log = []
for (y, _, xb, xr), xb0, want in zip(rows, xb0_s, wants):
    xb = int(xb)
    if y < 166 or want >= xr + 0.5:
        continue
    put_span(y, xb, xr + 1, xb, want, fringe(y, xb, xr, 'r'))
    if y % 60 == 0:
        log.append((y, xr + 1 - int(xb0), round(want - xb0, 1)))
print('side (row, depth from binding front before -> after, px):', log)

# ---- back view: match the front neck's width row by row ----
fx_c = bx_c = None
rows = []
for y in range(130, b_top):                           # stop where the front horns begin
    rf = seg(y, *VIEWS[0], near=fx_c)
    rb = seg(y, *VIEWS[2], near=bx_c)
    if rf is None or rb is None:
        continue
    fx_c, bx_c = (rf[0] + rf[1]) // 2, (rb[0] + rb[1]) // 2
    rows.append((y, rf[1] - rf[0] + 1, rb[0], rb[1]))
log = []
for y, wf, b0, b1 in rows:
    wb = b1 - b0 + 1
    if y < nut + 5:                                   # headstock: the two views are already the same width
        blend = np.clip((y - 140) / (nut + 5 - 140), 0, 1)
    else:
        blend = np.clip((b_top - y) / 40.0, 0, 1)     # ramp out where the heel flares into the body
    if wb > 1.6 * wf:                                 # tuner / body rows: leave alone
        continue
    f = 1 + (wf / wb - 1) * blend
    if abs(f - 1) < 0.005:
        continue
    c = (b0 + b1 + 1) / 2
    put_span(y, b0, b1 + 1, c - wb * f / 2, c + wb * f / 2, fringe(y, b0, b1, 'b'))
    if y % 60 == 0:
        log.append((y, wf, wb, round(wb * f, 1)))
print('back (row, front width, back before, back after):', log)

res = out.copy()
al = res[..., 3:4] / 255.0
res[..., :3] = np.where(al > 1e-6, res[..., :3] / np.maximum(al, 1e-6), 0)
Image.fromarray(np.clip(res + 0.5, 0, 255).astype(np.uint8), 'RGBA').save(dst)
print('->', dst)
