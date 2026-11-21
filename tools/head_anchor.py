"""Where her head is in each drawing, as (u, v) fractions of the image (u from the left, v from the top), for things
that must stay centred on her head (the ring of cards behind it). The bow is the anchor: the largest pale, unsaturated
blob in the upper part of the figure; the head centre is a little below the bow's centre.
usage: python tools/head_anchor.py art/cut/a.png art/cut/b.png ...   -> prints headuv=u,v;u,v;... for the query
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

out = []
for p in sys.argv[1:]:
    a = np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)
    h, w = a.shape[:2]
    rgb, al = a[..., :3], a[..., 3]
    mx, mn = rgb.max(2), rgb.min(2)
    pale = (al > 200) & (mn > 125) & (mx - mn < 32)     # the bow: pale grey even in night shade
    ys = np.nonzero(al.max(1) > 128)[0]
    top, bot = ys.min(), ys.max()
    pale[int(top + (bot - top) * 0.3):] = False             # the bow is in the top of the figure (the name card lower is pale too)
    lab, n = ndimage.label(pale)
    if n == 0:
        out.append((0.5, (top + 0.08 * h) / h)); continue
    sizes = ndimage.sum(pale, lab, range(1, n + 1))
    # the bow is the topmost sizeable pale blob (the shirt collar below it can be bigger)
    tops = ndimage.minimum(np.indices(pale.shape)[0], lab, range(1, n + 1))
    big = [i for i in range(n) if sizes[i] >= max(1500, 0.25 * sizes.max())]
    k = min(big, key=lambda i: tops[i]) + 1
    by, bx = np.nonzero(lab == k)
    cu, cv = bx.mean() / w, (by.mean() + 0.055 * h) / h        # head centre: a little below the bow's centre
    out.append((cu, cv))
    print(f'{p}: bow {sizes[k - 1]:.0f} px at ({bx.mean():.0f},{by.mean():.0f}) -> head uv ({cu:.3f}, {cv:.3f})', file=sys.stderr)
print('headuv=' + ';'.join(f'{u:.3f},{v:.3f}' for u, v in out))
