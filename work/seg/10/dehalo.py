"""Segment 10: some Codex variants came back with a faint cyan haze over the whole transparent area (alpha 25-200).
Keep only the solid drawing (alpha >= 250) and a 1 px anti-aliased ring round it; everything else becomes transparent.
usage: python work/seg/10/dehalo.py in.png out.png"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open(sys.argv[1]).convert('RGBA')).copy()
a = im[..., 3]
solid = a >= 250
solid = ndimage.binary_opening(solid, iterations=1) | (solid & ndimage.binary_erosion(solid, iterations=0))
lab, n = ndimage.label(solid)
if n:
    sizes = ndimage.sum(solid, lab, index=np.arange(1, n + 1))
    solid &= np.isin(lab, 1 + np.nonzero(sizes >= 60)[0])
ring = ndimage.binary_dilation(solid, iterations=1) & ~solid
out = np.zeros_like(a); out[solid] = 255; out[ring] = a[ring]
im[..., 3] = out
Image.fromarray(im).save(sys.argv[2])
print(sys.argv[2], 'kept', int((out > 0).sum()))
