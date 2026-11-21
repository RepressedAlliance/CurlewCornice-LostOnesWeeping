"""Remove the light halo a white-background cutout leaves on its edge.

Edge pixels of a cutout are part artwork, part the white paper it was drawn on; when the card is
drawn with an alpha test those pixels show up as a light outline round dark areas (socks, uniform).
This copies the colour of the nearest solid pixel into every semi-transparent pixel and keeps alpha.
usage: python tools/defringe.py <in.png> <out.png> [solid_alpha=250]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
solid = int(sys.argv[3]) if len(sys.argv) > 3 else 250
im = np.asarray(Image.open(src).convert('RGBA')).copy()
a = im[..., 3]
_, (iy, ix) = ndimage.distance_transform_edt(a < solid, return_indices=True)
edge = (a > 0) & (a < solid)
im[edge, :3] = im[iy[edge], ix[edge], :3]
Image.fromarray(im).save(dst)
print('defringed', int(edge.sum()), 'edge pixels ->', dst)
