"""Measure a Les Paul set-pack sheet the way the art review does (round 4, 2026-11-20): front fret positions (fret 12 as a
fraction of nut->bridge), front / back neck widths and side-view neck depth (cm, body length = 44 cm), and whether the front
fingerboard has a light (cream) binding strip on both edges.
usage: python tools/lespaul_measure.py sheet.png
"""
import sys
import numpy as np
from PIL import Image

im = np.asarray(Image.open(sys.argv[1]).convert('RGBA')).astype(float)
a = im[..., 3] > 128
lum = im[..., :3] @ np.array([0.2126, 0.7152, 0.0722]) / 255
H, W = a.shape
wid = a[:, :620].sum(1)
b_top = next(y for y in range(400, H) if wid[y] > 1.15 * wid[480])
b_bot = max(y for y in range(H) if wid[y] > 40)
k = (b_bot - b_top) / 44.0


def run(y, x0, x1):
    xs = np.nonzero(a[y, x0:x1])[0] + x0
    # the run that contains the middle of the view's opaque pixels
    if not len(xs):
        return None
    c = int(np.median(xs))
    l = c
    while l > x0 and a[y, l - 1]:
        l -= 1
    r = c
    while r < x1 - 1 and a[y, r + 1]:
        r += 1
    return l, r


print(f'body {b_top}-{b_bot} = {k:.2f} px/cm')
for y in (200, 300, 400, 500):
    f, s, b = run(y, 0, 620), run(y, 620, 950), run(y, 950, W)
    fl, fr = f
    prof = lum[y, fl:fr + 1]
    light = np.nonzero(prof > 0.7)[0]
    edges = (light.min() if len(light) else -1, (fr - fl) - light.max() if len(light) else -1)
    print(f'y={y}: front {fr - fl + 1}px ({(fr - fl + 1) / k:.2f} cm), back {b[1] - b[0] + 1}px ({(b[1] - b[0] + 1) / k:.2f} cm), '
          f'side depth {s[1] - s[0] + 1}px ({(s[1] - s[0] + 1) / k:.2f} cm); front light px from edges {edges}; '
          f'front edge colours {[tuple(int(v) for v in im[y, x, :3]) for x in (fl + 2, fl + 4, fr - 4, fr - 2)]}')

# frets: bright rows in a column between the binding and the inlays (both edges), from the nut to the body
rows = []
for y in range(150, 700):
    f = run(y, 0, 620)
    if f is None:
        continue
    fl, fr = f
    if fr - fl > 90:
        break
    v = (lum[y, fl + 8:fl + 11].mean() + lum[y, fr - 10:fr - 7].mean()) / 2
    rows.append((y, v))
ys = np.array([r[0] for r in rows]); vs = np.array([r[1] for r in rows])
bright = ys[vs > 0.45]
groups, g = [], [bright[0]]
for y in bright[1:]:
    if y - g[-1] <= 2:
        g.append(y)
    else:
        groups.append(g); g = [y]
groups.append(g)
centres = [float(np.mean(g)) for g in groups]
nut_bottom = groups[0][-1] + 1                  # the first bright band is the nut
frets = centres[1:]
while frets and frets[0] - nut_bottom < 10:      # the nut's own lower edge, not a fret
    nut_bottom = int(round(frets.pop(0))) + 1
# bridge: the grey bar row band below the pickups at the centre column
cx = int(np.median(np.nonzero(a[300, :620])[0]))
sat = im[..., :3].max(2) - im[..., :3].min(2)
ys_b = [y for y in range(750, 900) if sat[y, cx] < 14 and 0.35 < lum[y, cx] < 0.9 and a[y, cx]]
bridge = float(np.mean(ys_b)) if ys_b else float('nan')
print(f'nut {nut_bottom}, bridge {bridge:.1f}, {len(frets)} frets: {[round(f) for f in frets]}')
if len(frets) >= 12:
    print(f'fret 12 at {(frets[11] - nut_bottom) / (bridge - nut_bottom):.3f} of nut->bridge')
