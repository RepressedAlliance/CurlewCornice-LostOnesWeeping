import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Where the lanyard now stops in each lanyard-free redraw: the top of the strands that the redraw removed (ink in the 01 master,
paper in the redraw), on each side of the body's centre, inside a box round the chest. Prints drawing px for seg_02.js.
usage: python work/seg/02/stub_ends.py name:master:redraw:x0,y0,x1,y1:cx ..."""
import sys
import numpy as np
from PIL import Image
ROOT = _LO_ROOT
def ink(p):
    im = Image.open(p).convert('RGBA'); bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    return np.array(bg.convert('L')).astype(int)
for arg in sys.argv[1:]:
    name, m, r, box, cx = arg.split(':')
    x0, y0, x1, y1 = map(int, box.split(',')); cx = int(cx)
    A, B = ink(f'{ROOT}/{m}'), ink(f'{ROOT}/{r}')
    gone = (A < 140) & (B > 175)
    out = []
    for lo, hi in ((x0, cx), (cx, x1)):
        sub = gone[y0:y1, lo:hi]
        rows = np.where(sub.sum(1) >= 2)[0]
        if not len(rows): out.append(None); continue
        # the top row of the longest run of rows with removed ink (the strand), its mean x there
        ys = rows; runs = np.split(ys, np.where(np.diff(ys) > 6)[0] + 1); run = max(runs, key=len)
        ty = run[0]; xs = np.where(sub[ty:ty + 4].any(0))[0]
        out.append((int(lo + xs.mean()), int(y0 + ty), int(y0 + run[-1])))
    print(name, out)
