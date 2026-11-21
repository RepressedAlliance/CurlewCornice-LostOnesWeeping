"""Moire check of seg 00 (the method of work/seg/03/moire_check.py): the low-frequency frame difference (1/8 resolution,
box filter) frame by frame through the slow camera moves, in the textured regions (the card face, the printed wall) and,
for scale, the flat regions (her face skin / the drawing's hair). A texture that aliases under the camera's scale shows as
low-frequency change well above what the same move does to the flat regions, flickering frame to frame.
usage: python moire_check.py <frames_dir> <f0> <f1> [--regions card,wall,face]
Regions are in 1/8-resolution pixels (240x135) and depend on the shot: 'card' and 'face' for the card-up drift (15-48),
'wall' and 'face2' for the push on her face (54-82)."""
import sys, numpy as np
from PIL import Image
d = sys.argv[1]; f0 = int(sys.argv[2]); f1 = int(sys.argv[3])
R = {'card': [(78, 112, 80, 160)], 'wall': [(20, 120, 4, 50), (20, 120, 190, 236)],
     'face': [(55, 66, 95, 112)], 'hair': [(30, 50, 90, 120)], 'face2': [(70, 95, 100, 140)]}
names = sys.argv[sys.argv.index('--regions') + 1].split(',') if '--regions' in sys.argv else list(R)
def lo(f): return np.asarray(Image.open(f'{d}/g_{f:07d}.png').convert('L').resize((240, 135), Image.BOX), dtype=np.float32)
prev = None; acc = {k: [] for k in names}
for f in range(f0, f1 + 1):
    a = lo(f)
    if prev is not None:
        for k in names: acc[k].append(np.mean([np.abs(a[y0:y1, x0:x1] - prev[y0:y1, x0:x1]).mean() for y0, y1, x0, x1 in R[k]]))
    prev = a
for k, v in acc.items():
    v = np.array(v); flick = np.abs(np.diff(v)).mean() if len(v) > 1 else 0
    print(f'{k}: mean {v.mean():.2f}  max {v.max():.2f}  frame-to-frame flicker {flick:.2f} grey levels (1/8 res), frames {f0}-{f1}')
