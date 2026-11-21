"""Clear the faint residue Codex leaves in the transparent area of a drawing.

Transparent Codex drawings come back with a ring of low-alpha haze round the subject and scattered faint specks; on paper white
they show as dirty smudges (art review of the set pack, 2026-11-20). This keeps every solid part of the drawing and its
anti-aliased edge, and makes everything else fully transparent:
  - pixels with alpha <= --floor become 0;
  - connected parts of (alpha > --floor) smaller than --min-area pixels are dropped (specks);
  - faint pixels (alpha < 128) farther than --edge px from a solid pixel (alpha >= --solid) are dropped (haze); thin
    drawn strokes (alpha >= 128) are kept.
usage: python tools/alpha_clean.py in.png out.png [--floor 24] [--solid 200] [--edge 3] [--min-area 40]
Prints how many pixels it cleared.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
opt = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
floor, solid = opt('--floor', 24), opt('--solid', 200)
edge, min_area = int(opt('--edge', 3)), int(opt('--min-area', 40))
im = np.asarray(Image.open(src).convert('RGBA')).copy()
a = im[..., 3].astype(np.int32)
before = int((a > 0).sum())
keep = a > floor
lab, n = ndimage.label(keep)
if n:
    sizes = ndimage.sum(keep, lab, index=np.arange(1, n + 1))
    keep &= np.isin(lab, 1 + np.nonzero(sizes >= min_area)[0])
near_solid = ndimage.binary_dilation(a >= solid, iterations=edge)
keep &= near_solid | (a >= 128)
im[~keep, 3] = 0
im[~keep, :3] = 0
Image.fromarray(im).save(dst)
print(f'{src}: cleared {before - int(keep.sum())} of {before} non-transparent pixels -> {dst}')
