"""0.5-second contact sheet of a frame folder (f_00000.png ...): one cell every 15 frames, labelled with song time and beat.
usage: python work/seg/12/half_second_sheet.py <frames_dir> <t0> <out.png>"""
import os, sys
from PIL import Image, ImageDraw
src, t0, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
fr = sorted(f for f in os.listdir(src) if f.endswith('.png'))
idx = list(range(0, len(fr), 15))
tw, th, cols = 480, 270, 4
rows = (len(idx) + cols - 1) // cols
sh = Image.new('RGB', (cols * (tw + 6), rows * (th + 6)), 'white')
for k, i in enumerate(idx):
    im = Image.open(os.path.join(src, fr[i])).convert('RGB').resize((tw, th), Image.LANCZOS)
    t = t0 + i / 30; d = ImageDraw.Draw(im); d.rectangle((0, 0, 170, 16), fill='black')
    d.text((3, 2), f'{t:.2f}s k{(t - 0.318) / (60 / 162):.1f} f{i}', fill='white')
    sh.paste(im, ((k % cols) * (tw + 6), (k // cols) * (th + 6)))
sh.save(out)
print(out, len(idx), 'cells')
