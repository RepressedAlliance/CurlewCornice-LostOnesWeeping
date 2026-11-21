"""Cut a sheet of separate figures on white into one RGBA PNG per figure.

Runs tools/cutout.py on the whole sheet, then splits the alpha into connected figures (small specks
are merged into the nearest figure), crops each, removes the white halo (tools/defringe.py logic)
and writes <out_prefix>_<n>.png left to right. Prints each figure's bbox and pixel height so the
scene can scale it to a real height.
usage: python tools/split_sheet.py sheet.png art/cut/name [min_area=4000]
"""
import subprocess, sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

src, prefix = sys.argv[1], sys.argv[2]
min_area = int(sys.argv[3]) if len(sys.argv) > 3 else 4000
here = os.path.dirname(os.path.abspath(__file__))
tmp = prefix + '__full.png'
subprocess.run([sys.executable, os.path.join(here, 'cutout.py'), src, tmp], check=True)
im = np.asarray(Image.open(tmp).convert('RGBA')).copy()
os.remove(tmp)
a = im[..., 3] > 8
# close tiny gaps so a figure's separate bits (a hand holding a card, a lanyard) stay one figure
solid = ndimage.binary_closing(ndimage.binary_dilation(a, iterations=6), iterations=6)
lab, n = ndimage.label(solid)
objs = ndimage.find_objects(lab)
figs = []
for i, sl in enumerate(objs):
    area = int((lab[sl] == i + 1).sum())
    if area < min_area:
        continue
    figs.append((sl[1].start, i + 1, sl))
figs.sort()
for k, (_, idx, sl) in enumerate(figs):
    mask = (lab == idx)
    out = im.copy()
    out[~mask, 3] = 0
    y0, y1 = sl[0].start, sl[0].stop
    x0, x1 = sl[1].start, sl[1].stop
    crop = out[max(0, y0 - 4):y1 + 4, max(0, x0 - 4):x1 + 4].copy()
    # defringe: semi-transparent edge pixels take the colour of the nearest solid pixel
    al = crop[..., 3]
    if (al >= 250).any():
        _, (iy, ix) = ndimage.distance_transform_edt(al < 250, return_indices=True)
        edge = (al > 0) & (al < 250)
        crop[edge, :3] = crop[iy[edge], ix[edge], :3]
    path = f'{prefix}_{k + 1}.png'
    Image.fromarray(crop).save(path)
    print(path, 'bbox', (x0, y0, x1, y1), 'h', y1 - y0)
