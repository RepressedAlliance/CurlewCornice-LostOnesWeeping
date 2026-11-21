"""Find the blank white card in a front drawing: the largest near-white component in a search box -> its 4 corners (TL,TR,BR,BL).
usage: python work/seg/05/find_card.py <png> x0 y0 x1 y1"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage
p, x0, y0, x1, y1 = sys.argv[1], *map(int, sys.argv[2:6])
im = np.array(Image.open(p).convert('RGBA')).astype(int)
sub = im[y0:y1, x0:x1]
m = (sub[..., :3].min(axis=2) > 225) & (sub[..., 3] > 200)
lab, n = ndimage.label(m)
if not n: print('none'); sys.exit()
sizes = ndimage.sum(m, lab, range(1, n + 1)); k = int(np.argmax(sizes)) + 1
ys, xs = np.nonzero(lab == k); xs = xs + x0; ys = ys + y0
s, d = xs + ys, xs - ys
tl = (xs[s.argmin()], ys[s.argmin()]); br = (xs[s.argmax()], ys[s.argmax()])
tr = (xs[d.argmax()], ys[d.argmax()]); bl = (xs[d.argmin()], ys[d.argmin()])
print([[int(a), int(b)] for a, b in (tl, tr, br, bl)], 'area', int(sizes[k - 1]))
