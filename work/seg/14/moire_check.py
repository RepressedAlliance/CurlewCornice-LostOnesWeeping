"""Seg 14 moire check (the method of work/seg/03/moire_check.py): low-frequency frame difference (frames at 1/8 resolution,
240x135, box-filtered) in screened regions vs a plain graphite-wall region, over a camera move. A screen sampled without
prefiltering crawls under a slow push: its regions change far more per frame than the plain wall moving the same way.
usage: python work/seg/14/moire_check.py <frames_dir> <shot>   shot: S1 (C3 push), S3 (slow push), S4 (pull back), W7
Regions are (y0, y1, x0, x1) at 1/8 resolution, picked on the frames of each shot."""
import sys, numpy as np
from PIL import Image
SHOTS = {
    # the wainscot band left of 佐藤 and right of 小林 (bottom of the medium shot), the cabinet strips; plain wall above the heads
    'S3': (5243, 5331, {'wainscot': [(114, 128, 2, 24), (112, 126, 214, 238)], 'paper wall': [(40, 56, 60, 95), (40, 56, 150, 180)]}),
    'S1': (5068, 5154, {'wainscot': [(118, 134, 82, 96), (118, 134, 146, 158)], 'paper wall': [(20, 40, 150, 200), (20, 40, 40, 80)]}),
    'S4': (5388, 5431, {'wainscot': [(118, 134, 82, 96), (118, 134, 150, 162)], 'paper wall': [(5, 18, 150, 200), (5, 18, 30, 70)]}),
    'W7': (5199, 5231, {'wainscot': [(108, 120, 0, 240)], 'paper wall': [(10, 30, 60, 180)]}),
}
d, shot = sys.argv[1], sys.argv[2]
f0, f1, regions = SHOTS[shot]
def lo(f):
    im = Image.open(f'{d}/g_{f:07d}.png').convert('L')
    return np.asarray(im.resize((240, 135), Image.BOX), dtype=np.float32)
prev = None; acc = {k: [] for k in regions}
for f in range(f0, f1 + 1):
    a = lo(f)
    if prev is not None:
        for k, rs in regions.items():
            acc[k].append(np.mean([np.abs(a[y0:y1, x0:x1] - prev[y0:y1, x0:x1]).mean() for y0, y1, x0, x1 in rs]))
    prev = a
print(f'{shot} {d} frames {f0}-{f1}: ' + '; '.join(f'{k} mean {np.mean(v):.2f} max {np.max(v):.2f}' for k, v in acc.items()) + ' grey levels / frame (1/8 res)')
