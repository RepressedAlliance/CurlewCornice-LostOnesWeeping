"""0.5 s contact sheet: one frame every 15 frames, labelled with frame, song time and beat. usage: half_sheet.py <seq_dir> <t0> <out.png>"""
import os, sys
from PIL import Image, ImageDraw
src, t0, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
fr = sorted(f for f in os.listdir(src) if f.startswith('f_') and f.endswith('.png'))
idx = list(range(0, len(fr), 15)); tw, th, cols = 384, 216, 5
rows = (len(idx) + cols - 1) // cols
sh = Image.new('RGB', (cols * (tw + 4), rows * (th + 4)), 'white')
for k, i in enumerate(idx):
    im = Image.open(os.path.join(src, fr[i])).convert('RGB').resize((tw, th), Image.LANCZOS)
    t = t0 + i / 30; d = ImageDraw.Draw(im); d.rectangle((0, 0, 150, 16), fill='black')
    d.text((3, 2), f'{i} {t:.2f}s k{(t - 0.318) / (60 / 162):.1f}', fill='white')
    sh.paste(im, ((k % cols) * (tw + 4), (k // cols) * (th + 4)))
sh.save(out); print(out, len(idx))
