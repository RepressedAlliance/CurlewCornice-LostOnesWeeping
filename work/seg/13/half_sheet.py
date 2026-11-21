"""Contact sheet at one cell per 0.5 s (15 frames) of a g_<global frame>.png sequence, labelled with frame and song time.
usage: python work/seg/13/half_sheet.py <frames_dir> <out.png> [cols]"""
import os, sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
fr = sorted(f for f in os.listdir(src) if f.startswith('g_') and f.endswith('.png'))
pick = fr[::15]
tw, th = 384, 216
rows = (len(pick) + cols - 1) // cols
sh = Image.new('RGB', (cols * (tw + 4), rows * (th + 20)), 'white')
for k, f in enumerate(pick):
    g = int(f[2:-4]); im = Image.open(os.path.join(src, f)).convert('RGB').resize((tw, th))
    x, y = (k % cols) * (tw + 4), (k // cols) * (th + 20)
    sh.paste(im, (x, y + 18)); ImageDraw.Draw(sh).text((x + 2, y + 3), f'g{g}  {g / 30:.2f}s  k{(g / 30 - 0.318) / (60 / 162):.1f}', fill='black')
sh.save(out); print(out, len(pick), 'cells')
