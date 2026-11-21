import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Contact strip of chosen frames of work/seg/11/frames (optionally cropped), labelled with frame and beat.
usage: python work/seg/11/strip.py <out.png> <cols> <width> [crop x0,y0,x1,y1] g1 g2 ..."""
import sys
from PIL import Image, ImageDraw
D = (_LO_ROOT + '/work/seg/11/frames')
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
args = sys.argv[4:]
crop = None
if args and ',' in args[0]:
    crop = tuple(int(v) for v in args[0].split(',')); args = args[1:]
gs = [int(a.lstrip('g')) for a in args]
ims = []
for g in gs:
    im = Image.open(f'{D}/g_{g:07d}.png').convert('RGB')
    if crop: im = im.crop(crop)
    h = round(im.height * w / im.width); im = im.resize((w, h), Image.LANCZOS)
    d = ImageDraw.Draw(im); k = (g / 30 - 0.318) / (60 / 162)
    d.rectangle([0, 0, 150, 18], fill=(0, 0, 0)); d.text((4, 3), f'g{g} k{k:.2f}', fill=(255, 255, 255))
    ims.append(im)
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * ims[0].height), (40, 40, 40))
for i, im in enumerate(ims): S.paste(im, ((i % cols) * w, (i // cols) * im.height))
S.save(out)
