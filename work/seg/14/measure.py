"""Measure seg 14 drawings: alpha bbox, hair top (first row with blonde pixels), card rectangle (largest bright low-saturation
blob inside a search box), skin-free card mask is done in the page. usage: python work/seg/14/measure.py name [name...]"""
import sys, json, os
import numpy as np
from PIL import Image
from scipy import ndimage
out = {}
for n in sys.argv[1:]:
    im = np.array(Image.open((f'art/design/out/{n}.png' if os.path.exists(f'art/design/out/{n}.png') else f'art/cut/{n}.png')).convert('RGBA')).astype(int)
    r, g, b, a = [im[..., i] for i in range(4)]
    H, W = a.shape
    op = a > 128
    ys, xs = np.nonzero(op)
    hair = op & (r > 200) & (g > 150) & (b < 120) & (r - b > 90)
    hy = np.nonzero(hair.any(1))[0]
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    paper = op & (mn > 215) & (mx - mn < 22)
    lab, k = ndimage.label(paper)
    best = None
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        area = (lab[sl] == i).sum()
        if w < 40 or h < 25: continue
        fill = area / (w * h); ratio = w / h
        if fill > 0.45 and 1.1 < ratio < 2.2 and sl[0].start > H * 0.25:
            if best is None or area > best[0]: best = (area, [sl[1].start, sl[0].start, w, h], round(fill, 2))
    out[n] = {'size': [W, H], 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
              'hairTop': int(hy[0]) if len(hy) else None, 'card': best[1] if best else None, 'cardFill': best[2] if best else None}
    print(n, out[n])
