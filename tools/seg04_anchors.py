"""Measure the seg04 drawings (art/cut/r04{a,b,c}_{zip,half,hang}.png) for web/scenes/segments/seg_04.js:
  bbox = opaque extent [x0, y0, x1, y1]; clip = the bottom of the lanyard clip on her chest (the card hangs from it).
The clip: the lowest pixel of the teal lanyard in the middle third of the figure, then down through the silver clip (light,
low-saturation opaque pixels) to its end. Writes art/cut/seg04_anchors.json.  usage: python tools/seg04_anchors.py
"""
import json, os, colorsys
from PIL import Image
import numpy as np

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out = {}
for var in 'abcd':
    out[var] = {}
    for k in ('zip', 'half', 'hang', 'pull', 'rest', 'swing'):
        p = os.path.join(root, 'art', 'cut', f'r04{var}_{k}.png')
        if not os.path.exists(p): continue
        a = np.asarray(Image.open(p).convert('RGBA')).astype(float) / 255
        H, W = a.shape[:2]
        op = a[..., 3] > 0.08
        ys, xs = np.where(op)
        bbox = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
        sat = (mx - mn) / np.maximum(mx, 1e-4)
        teal = op & (sat > 0.35) & (b > r + 0.15) & (g > r + 0.1) & (mx > 0.3)
        # her chest: below the shirt collar, the middle of the opaque columns at that height
        cx = (bbox[0] + bbox[2]) / 2
        band = teal[int(H * 0.40):int(H * 0.65), int(W * 0.35):int(W * 0.65)]
        ty, tx = np.where(band)
        i = np.argmax(ty); y0 = ty[i] + int(H * 0.40); x0 = tx[i] + int(W * 0.35)
        # down through the clip: light grey opaque pixels within 8 px of x0
        y, last, gap = y0, y0, 0
        while y + 1 < min(H, y0 + 60):
            y += 1
            row = a[y, x0 - 6:x0 + 7]
            light = (row[:, 3] > 0.5) & (row[:, :3].max(1) > 0.55) & (((row[:, :3].max(1) - row[:, :3].min(1)) / np.maximum(row[:, :3].max(1), 1e-4)) < 0.2)
            if light.sum() >= 3: last, gap = y, 0
            else:
                gap += 1
                if last > y0 and gap > 3: break
        y = last + 2
        out[var][k] = {'bbox': bbox, 'clip': [int(x0), int(y)], 'lanyard_end': [int(x0), int(y0)], 'size': [W, H]}
        print(var, k, out[var][k])
out['_note'] = __doc__.strip().splitlines()[0]
json.dump(out, open(os.path.join(root, 'art', 'cut', 'seg04_anchors.json'), 'w'), indent=1)
