"""Cut a character drawn on a plain white background into an RGBA PNG.

Background = near-white pixels connected to the image border (flood fill), so white parts
inside the line art (bow, shoes, collar lines) are kept. Edge pixels get a soft alpha by
un-mixing them from white, then the result is cropped to the figure with a margin.
usage: python cutout.py in.png out.png
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
mn = im.min(2)
mx = im.max(2)
whiteish = (mn > 0.90) & (mx - mn < 0.06)
lab, _ = ndimage.label(whiteish)
border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
bg = np.isin(lab, border[border > 0])
# grow background by 1px into the anti-aliased rim, then compute soft alpha on that rim
fg = ~bg
rim = ndimage.binary_dilation(bg, iterations=2) & fg
alpha = fg.astype(np.float32)
# alpha so that pixel = a*color + (1-a)*white, using darkness of the pixel relative to white
dark = 1.0 - mn
a_rim = np.clip(dark / 0.35, 0, 1)
alpha[rim] = a_rim[rim]
alpha[bg] = 0.0
# un-premultiply rim colors against white
rgb = im.copy()
m = (alpha > 0.02) & (alpha < 1)
rgb[m] = np.clip((im[m] - (1 - alpha[m, None])) / alpha[m, None], 0, 1)
ys, xs = np.nonzero(alpha > 0.05)
pad = 16
y0, y1 = max(0, ys.min() - pad), min(im.shape[0], ys.max() + pad)
x0, x1 = max(0, xs.min() - pad), min(im.shape[1], xs.max() + pad)
out = np.dstack([rgb, alpha])[y0:y1, x0:x1]
Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(dst)
print(dst, out.shape[1], out.shape[0], "foot y (rel)", int(ys.max() - y0))
