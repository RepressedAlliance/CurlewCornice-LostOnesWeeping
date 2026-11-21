"""Find the drawn name cards in an image (for tools/card_swap.py): paper-white regions that are landscape,
nearly rectangular and card-sized. Writes a numbered preview to <image dir>/_swap/<name>_cards.png and prints
one box per candidate (x0,y0,x1,y1 with a small margin).
usage: python tools/find_cards.py image.png [min_area=150] [max_frac=0.02]
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

src = sys.argv[1]
min_area = int(sys.argv[2]) if len(sys.argv) > 2 else 150
max_frac = float(sys.argv[3]) if len(sys.argv) > 3 else 0.02
im = Image.open(src).convert('RGBA')
A = np.asarray(im).astype(np.float32) / 255.0
rgb, al = A[..., :3], A[..., 3]
mn, mx = rgb.min(2), rgb.max(2)
paper = (mn > 0.80) & ((mx - mn) < 0.12) & (al > 0.8)
lab, n = ndimage.label(paper)
objs = ndimage.find_objects(lab)
H, W = paper.shape
cands = []
for i, sl in enumerate(objs):
    comp = lab[sl] == i + 1
    filled = ndimage.binary_fill_holes(comp)
    area = int(filled.sum())
    if area < min_area or area > max_frac * H * W:
        continue
    h, w = filled.shape
    aspect = w / max(1, h)
    rect = area / float(w * h)
    if 1.05 <= aspect <= float(os.environ.get("ASPMAX", "3.2")) and rect >= float(os.environ.get("RECTMIN", "0.5")):
        cands.append((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop, area, aspect, rect))
cands.sort(key=lambda c: (c[1] // 50, c[0]))
pv = im.convert('RGB').copy(); d = ImageDraw.Draw(pv)
for k, (x0, y0, x1, y1, area, aspect, rect) in enumerate(cands):
    d.rectangle([x0 - 2, y0 - 2, x1 + 2, y1 + 2], outline=(255, 0, 255), width=2); d.text((x0, max(0, y0 - 12)), str(k), fill=(255, 0, 255))
    print(f'{k}: box={max(0, x0 - 3)},{max(0, y0 - 3)},{min(W, x1 + 3)},{min(H, y1 + 3)} area={area} aspect={aspect:.2f} rect={rect:.2f}')
out = os.path.join(os.path.dirname(os.path.abspath(src)), '_swap'); os.makedirs(out, exist_ok=True)
pv.save(os.path.join(out, os.path.splitext(os.path.basename(src))[0] + '_cards.png'))
