"""Segment 11 moire check (the method of work/seg/03/moire_check.py): low-frequency frame difference, at 1/8 resolution,
of the screened / halftoned areas against plain areas of the same shot, over the frames where the camera scales.
  S2 push k341-k343 (frames 3799-3820): the paper ground's teal screen (left of the columns, below them) against the photo's
     plain ground inside the frame (left of her hair).
  S3b punch at k355 (frames 3950-3966): the halftone of the drawings (A's skirt, C's trousers) against her coat (flat cel
     shading) -- everything scales by 2% here, so both move a little; a moire shows as the halftone far above the plain.
usage: python work/seg/11/moire_check.py <frames_dir>"""
import sys, numpy as np
from PIL import Image
d = sys.argv[1]
def lo(f):
    im = Image.open(f'{d}/g_{f:07d}.png').convert('L')
    return np.asarray(im.resize((240, 135), Image.BOX), dtype=np.float32)
# regions in 1/8 resolution: (y0, y1, x0, x1)
CHECKS = {
    'S2 push 3799-3820': (3799, 3820, {'paper screen': [(95, 130, 4, 35), (5, 30, 4, 40)], 'photo plain ground': [(50, 85, 75, 84)]}),
    'S3b punch 3950-3966': (3950, 3966, {'drawing halftone': [(108, 130, 62, 110), (108, 130, 130, 170)], 'her coat (flat)': [(85, 105, 186, 205)]}),
}
for name, (f0, f1, regions) in CHECKS.items():
    prev = None; acc = {k: [] for k in regions}
    for f in range(f0, f1 + 1):
        a = lo(f)
        if prev is not None:
            for k, rs in regions.items():
                acc[k].append(np.mean([np.abs(a[y0:y1, x0:x1] - prev[y0:y1, x0:x1]).mean() for y0, y1, x0, x1 in rs]))
        prev = a
    print(name + ': ' + '; '.join(f'{k} mean {np.mean(v):.2f} max {np.max(v):.2f}' for k, v in acc.items()) + ' grey levels / frame (1/8 res)')
