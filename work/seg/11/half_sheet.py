"""0.5-second contact sheet: one frame every 15 (0.5 s at 30 fps), labelled with song time and beat number.
usage: python work/seg/11/half_sheet.py <frames_dir (g_NNNNNNN.png)> <out.png> [title]"""
import os, sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; title = sys.argv[3] if len(sys.argv) > 3 else ''
fr = sorted(f for f in os.listdir(src) if f.startswith('g_') and f.endswith('.png'))
pick = fr[::15] + ([fr[-1]] if (len(fr) - 1) % 15 else [])
tw, th, cols = 480, 270, 4
rows = (len(pick) + cols - 1) // cols
sh = Image.new('RGB', (cols * (tw + 6) + 6, rows * (th + 26) + 34), (30, 30, 30)); d = ImageDraw.Draw(sh)
d.text((8, 8), title, fill='white')
for k, f in enumerate(pick):
    gf = int(f[2:9]); t = gf / 30; beat = (t - 0.318) / (60 / 162)
    im = Image.open(os.path.join(src, f)).convert('RGB').resize((tw, th), Image.LANCZOS)
    x, y = 6 + (k % cols) * (tw + 6), 34 + (k // cols) * (th + 26)
    sh.paste(im, (x, y)); d.text((x + 2, y + th + 6), f'g{gf}  {t:.2f}s  k{beat:.2f}', fill='white')
sh.save(out); print(out, len(pick), 'frames')
