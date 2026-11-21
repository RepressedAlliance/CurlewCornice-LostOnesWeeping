"""A contact sheet with one cell every 0.5 s of song time (the frame nearest each half second), labelled with time and frame.
usage: python work/seg/14/half_sheet.py <frames_dir of g_NNNNNNN.png> <out.png> [cols]"""
import os, re, sys
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
fr = {int(m.group(1)): f for f in os.listdir(src) if (m := re.match(r'g_(\d+)\.png$', f))}
g0, g1 = min(fr), max(fr)
t = (int(g0 / 15) + (g0 % 15 > 0)) * 0.5
picks = []
while round(t * 30) <= g1:
    g = round(t * 30)
    if g in fr: picks.append((t, g))
    t += 0.5
tw, th, lab = 480, 270, 22
rows = (len(picks) + cols - 1) // cols
sh = Image.new('RGB', (cols * (tw + 6), rows * (th + lab + 6)), (30, 30, 30))
d = ImageDraw.Draw(sh)
for k, (tt, g) in enumerate(picks):
    x, y = (k % cols) * (tw + 6), (k // cols) * (th + lab + 6)
    sh.paste(Image.open(os.path.join(src, fr[g])).convert('RGB').resize((tw, th), Image.LANCZOS), (x, y + lab))
    beat = (tt - 0.318) / (60 / 162)
    d.text((x + 4, y + 4), f'{tt:.1f}s  g{g}  k{beat:.1f}', fill='white')
sh.save(out)
print(out, len(picks), 'cells')
