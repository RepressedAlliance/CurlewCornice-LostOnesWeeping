"""Crop a set of transparent Codex drawings (same canvas, same figure) with ONE common box, so they stay registered
to each other: the same scale, the feet where they were drawn (a jump stays off the ground). Writes art/cut/<name>.png.
usage: python tools/alpha_crop.py out_name1 out_name2 ...   (art/design/out/<name>.png -> art/cut/<name>.png)
Prints, for the first drawing, the fraction of the common box its own figure fills (to scale the scene's height).
"""
import os, sys
import numpy as np
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
names = sys.argv[1:]
ims = [Image.open(os.path.join(ROOT, 'art/design/out', n + '.png')).convert('RGBA') for n in names]
assert len({im.size for im in ims}) == 1, [im.size for im in ims]
boxes = []
for n, im in zip(names, ims):
    a = np.asarray(im)[..., 3]
    opaque = (a > 16).mean()
    ys, xs = np.nonzero(a > 16)
    boxes.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    print(f'{n}: alpha opaque {opaque:.2f}, semi {((a > 16) & (a < 240)).mean():.4f}, box {boxes[-1]}')
x0 = max(0, min(b[0] for b in boxes) - 4); y0 = max(0, min(b[1] for b in boxes) - 4)
x1 = min(ims[0].width, max(b[2] for b in boxes) + 4); y1 = min(ims[0].height, max(b[3] for b in boxes))
for n, im in zip(names, ims):
    im.crop((x0, y0, x1, y1)).save(os.path.join(ROOT, 'art/cut', n + '.png'))
b = boxes[0]
print('common box', (x0, y0, x1, y1), 'first figure height fraction %.4f' % ((b[3] - b[1]) / (y1 - y0)))
