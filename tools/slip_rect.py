"""Measure the blank face of the slip she holds in each slip drawing (the near-white rectangle across her chest) and write
art/cut/slip_rects.json: name -> [x, y, w, h] in image px. usage: python tools/slip_rect.py name ..."""
import json, os, sys
import numpy as np
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
out = os.path.join(ROOT, 'art', 'cut', 'slip_rects.json')
res = json.load(open(out)) if os.path.exists(out) else {}
for n in sys.argv[1:]:
    im = np.asarray(Image.open(os.path.join(ROOT, 'art', 'cut', n + '.png')).convert('RGBA')).astype(int)
    r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
    white = (a > 200) & (r > 232) & (g > 232) & (b > 232) & (abs(r - b) < 14)
    h = im.shape[0]; band = white[int(h * 0.55):int(h * 0.95)]
    rows = [y + int(h * 0.55) for y in range(band.shape[0]) if band[y].sum() > 400]
    y0, y1 = rows[0], rows[-1]
    colsum = white[y0:y1 + 1].sum(0); cols = [x for x in range(im.shape[1]) if colsum[x] > (y1 - y0) * 0.6]
    res[n] = [int(cols[0]), int(y0), int(cols[-1] - cols[0]), int(y1 - y0)]
    print(n, res[n])
json.dump(res, open(out, 'w'), indent=1)
