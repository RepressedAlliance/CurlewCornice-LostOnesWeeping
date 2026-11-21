"""Best shift (dx, dy) that puts a swap drawing onto its master over a region that must not move (alpha masks, brute force).
usage: python work/seg/05/align.py master.png swap.png x0 y0 x1 y1"""
import sys, numpy as np
from PIL import Image
a = np.array(Image.open(sys.argv[1]).convert('RGBA'))[..., 3] > 128
b = np.array(Image.open(sys.argv[2]).convert('RGBA'))[..., 3] > 128
x0, y0, x1, y1 = map(int, sys.argv[3:7])
A = a[y0:y1, x0:x1]
best = None
for dy in range(-40, 41, 2):
    for dx in range(-40, 41, 2):
        B = b[y0 - dy:y1 - dy, x0 - dx:x1 - dx]
        if B.shape != A.shape: continue
        e = np.count_nonzero(A ^ B)
        if best is None or e < best[0]: best = (e, dx, dy)
e0 = np.count_nonzero(A ^ b[y0:y1, x0:x1])
print('shift', best[1], best[2], 'mismatch', best[0], 'unshifted', e0, 'of', A.size)
