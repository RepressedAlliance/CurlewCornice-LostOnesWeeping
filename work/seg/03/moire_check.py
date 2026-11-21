"""Low-frequency frame difference of the hall wide (frames 636-676): the wainscot screen vs the plain paper wall.
usage: python moire_check.py <frames_dir> [f0 f1]   (frames named g_NNNNNNN.png)"""
import sys, numpy as np
from PIL import Image
d = sys.argv[1]; f0 = int(sys.argv[2]) if len(sys.argv) > 2 else 636; f1 = int(sys.argv[3]) if len(sys.argv) > 3 else 676
def lo(f):
    im = Image.open(f'{d}/g_{f:07d}.png').convert('L')
    return np.asarray(im.resize((240, 135), Image.BOX), dtype=np.float32)
regions = {'wainscot': [(92, 105, 43, 78), (92, 105, 162, 197)], 'paper wall': [(30, 42, 90, 105), (60, 70, 100, 140)]}
prev = None; acc = {k: [] for k in regions}
for f in range(f0, f1 + 1):
    a = lo(f)
    if prev is not None:
        for k, rs in regions.items():
            acc[k].append(np.mean([np.abs(a[y0:y1, x0:x1] - prev[y0:y1, x0:x1]).mean() for y0, y1, x0, x1 in rs]))
    prev = a
for k, v in acc.items(): print(f'{k}: mean {np.mean(v):.2f}  max {np.max(v):.2f} grey levels / frame (1/8 res)')
