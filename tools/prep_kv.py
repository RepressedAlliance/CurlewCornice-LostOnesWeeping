"""Split the 'holding a blank sheet' drawing into: the figure with a transparent background, a mask of
the sheet's white face (so printed content lands only on paper, never on her fingers), and the
sheet's bounding box. usage: python prep_kv.py in.png out_prefix"""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, pre = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
mn, mx = im.min(2), im.max(2)
white = (mn > 0.91) & (mx - mn < 0.055)
lab, _ = ndimage.label(white)
H, W = white.shape
top = set(np.unique(np.r_[lab[0], lab[:, 0], lab[:, -1]])) - {0}
bot = set(np.unique(lab[-1])) - {0}
bg = np.isin(lab, list(top))
paper_ids = [l for l in bot if l not in top]
paper = np.isin(lab, paper_ids)
# soft alpha on the figure's rim, as in cutout.py
fg = ~bg
rim = ndimage.binary_dilation(bg, iterations=2) & fg
alpha = fg.astype(np.float32)
alpha[rim] = np.clip((1 - mn[rim]) / 0.35, 0, 1)
rgb = im.copy()
m = (alpha > 0.02) & (alpha < 1)
rgb[m] = np.clip((im[m] - (1 - alpha[m, None])) / alpha[m, None], 0, 1)
Image.fromarray((np.dstack([rgb, alpha]) * 255 + 0.5).astype(np.uint8), 'RGBA').save(pre + '_layer.png')
# paper mask, grown by one pixel into the anti-aliased edge and blurred a touch
pm = ndimage.binary_dilation(paper, iterations=1).astype(np.float32)
pm = ndimage.gaussian_filter(pm, 0.7)
Image.fromarray((pm * 255).astype(np.uint8), 'L').save(pre + '_paper.png')
ys, xs = np.nonzero(paper)
box = dict(x0=int(xs.min()), y0=int(ys.min()), x1=int(xs.max()), y1=int(ys.max()), W=W, H=H)
# eye line: the darkest small features in the band just above the paper top
json.dump(box, open(pre + '.json', 'w'))
print(box)
