"""Take the white out of a cut-out's edge without eating its outline.

Cut-outs come from drawings on white, so the pixels just outside the drawn outline are blends of the outline's
colour and the white paper. On a dark background they read as a light rim (a sticker edge). edge_clean.py dropped
every light pixel near the edge, which also broke light outlines (the grey line round her white bow) into dashes.

This un-mattes instead. For each edge pixel lighter than the outline next to it, it treats the pixel as
alpha * outline + (1 - alpha) * white, solves for alpha from the luminance, and gives the pixel the outline's
colour with that alpha. Solid outline pixels keep alpha 1, the light fringe fades out, and the outline stays
continuous. Only pixels reached from outside without crossing the outline are touched, so a white area inside the
outline (the bow, the shirt) is never made see-through.

usage: python tools/edge_unmat.py in.png out.png [--band 3] [--win 2]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

args = [a for a in sys.argv[1:]]
opt = lambda k, d: float(args[args.index(k) + 1]) if k in args else d
src, dst = args[0], args[1]
band_w, win = int(opt('--band', 3)), int(opt('--win', 2))

A = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255
rgb, a = A[..., :3].copy(), A[..., 3].copy()
lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)
outside = a < 0.5
fig = ~outside
dist = ndimage.distance_transform_edt(fig)          # distance of each figure pixel from the outside
band = fig & (dist <= band_w)

# the outline next to each pixel: the darkest figure pixel within `win` pixels (its colour and luminance)
H, W = lum.shape
best_l = np.where(fig, lum, 2.0)
best_c = rgb.copy()
for dy in range(-win, win + 1):
    for dx in range(-win, win + 1):
        if not dx and not dy: continue
        sl = np.roll(np.roll(np.where(fig, lum, 2.0), dy, 0), dx, 1)
        sc = np.roll(np.roll(rgb, dy, 0), dx, 1)
        m = sl < best_l
        best_l[m] = sl[m]; best_c[m] = sc[m]

light = band & (lum > best_l + 0.06) & (best_l < 0.85)
# grow from the outside through light pixels only: the outline stops the growth
fringe = light & ndimage.binary_dilation(outside, iterations=1)
for _ in range(band_w):
    fringe = fringe | (light & ndimage.binary_dilation(fringe, iterations=1))

alpha_new = np.clip((1 - lum) / np.maximum(1 - best_l, 1e-3), 0, 1)
a[fringe] = np.minimum(a[fringe], alpha_new[fringe])
rgb[fringe] = best_c[fringe]
# the anti-aliased rim of the cut itself (partial alpha) also takes the outline colour
rim = fig & (a < 0.98) & ~fringe & (lum > best_l + 0.06)
rgb[rim] = best_c[rim]

Image.fromarray((np.dstack([rgb, a]) * 255 + 0.5).clip(0, 255).astype(np.uint8), 'RGBA').save(dst)
print('unmatted', src, '->', dst, 'fringe px', int(fringe.sum()))
