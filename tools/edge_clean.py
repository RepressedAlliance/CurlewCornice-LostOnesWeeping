"""Remove the light fringe round a cut-out's silhouette.

Cut-outs come from drawings on white. Outside the drawing's outer ink line there is a 1-2 px ring of light,
anti-aliased pixels; on a light background nobody sees it, on a dark one (the graphite hall, the sky) it reads
as a white edge round the figure, like a sticker. This drops the light pixels in the outer band (the line
itself stays), then softens the new edge by one pixel. Writes in place; the first original is kept in
art/cut/_edge/.
usage: python tools/edge_clean.py art/cut/a.png [art/cut/b.png ...]   [--band 2] [--light 0.55]
"""
import sys, os, shutil
import numpy as np
from PIL import Image
from scipy import ndimage

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
band_w = int(opt('--band', 2)); light_t = opt('--light', 0.55)
prot = [int(v) for v in sys.argv[sys.argv.index('--protect') + 1].split(',')] if '--protect' in sys.argv else None
os.makedirs('art/cut/_edge', exist_ok=True)
for p in args:
    if p.startswith('--') or (sys.argv[sys.argv.index(p) - 1] in ('--band', '--light', '--protect')): continue
    keep = os.path.join('art/cut/_edge', os.path.basename(p))
    if not os.path.exists(keep): shutil.copy2(p, keep)
    A = np.asarray(Image.open(p).convert('RGBA')).astype(np.float32) / 255
    rgb, a = A[..., :3], A[..., 3].copy()
    lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    outside = a < 0.5
    band = ndimage.binary_dilation(outside, iterations=band_w) & ~outside
    drop = band & (lum > light_t)
    if prot: drop[prot[1]:prot[3], prot[0]:prot[2]] = False
    a[drop] = 0
    # soften the new silhouette by a pixel: edge pixels take part alpha
    out2 = a < 0.5
    edge = ndimage.binary_dilation(out2, iterations=1) & ~out2
    if prot: edge[prot[1]:prot[3], prot[0]:prot[2]] = False
    a[edge] = np.minimum(a[edge], 0.7)
    # edge pixels take the colour of the nearest solid interior pixel (no light rim colour left)
    solid = a >= 0.95
    if solid.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
        e = (a > 0) & (a < 0.95)
        rgb[e] = rgb[iy[e], ix[e]]
    Image.fromarray((np.dstack([rgb, a]) * 255 + 0.5).astype(np.uint8), 'RGBA').save(p)
    print('cleaned', p, 'dropped', int(drop.sum()), 'px')
