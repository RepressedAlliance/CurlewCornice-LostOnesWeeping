"""Segment 10's moire check (the method of work/seg/03/moire_check.py): low-frequency frame difference at 1/8 resolution in
the S1 slow push (frames 3287-3464). A screen that is sampled without prefiltering crawls as the zoom changes, which shows as
grey-level change at 1/8 resolution even where the drawing only scales smoothly. Regions (1/8-res px, y0 y1 x0 x1):
the ceiling screen between the strap rows, the dark windows (night screen), the far end wall, the passengers (drawings).
Pass two frame dirs to compare (e.g. the old frames and the new ones); the drawings' own tones are the control.
usage: python moire_check10.py <frames_dir> [<frames_dir2>] [f0 f1]   (frames named g_NNNNNNN.png)"""
import sys, os, numpy as np
from PIL import Image
dirs = [a for a in sys.argv[1:] if os.path.isdir(a)]
nums = [int(a) for a in sys.argv[1:] if a.isdigit()]
f0, f1 = (nums + [3287, 3464])[:2] if len(nums) >= 2 else (3287, 3464)
regions = {'ceiling screen': [(2, 9, 104, 136)], 'windows (night screen)': [(40, 62, 0, 14), (40, 62, 226, 240)],
           'end wall / aisle': [(60, 75, 112, 128)], 'passengers (drawings)': [(95, 130, 10, 60), (95, 130, 180, 230)]}
def lo(d, f):
    return np.asarray(Image.open(f'{d}/g_{f:07d}.png').convert('L').resize((240, 135), Image.BOX), dtype=np.float32)
for d in dirs:
    prev = None; acc = {k: [] for k in regions}
    for f in range(f0, f1 + 1):
        a = lo(d, f)
        if prev is not None:
            for k, rs in regions.items():
                acc[k].append(np.mean([np.abs(a[y0:y1, x0:x1] - prev[y0:y1, x0:x1]).mean() for y0, y1, x0, x1 in rs]))
        prev = a
    print(d)
    for k, v in acc.items(): print(f'  {k}: mean {np.mean(v):.2f}  max {np.max(v):.2f} grey levels / frame (1/8 res)')
