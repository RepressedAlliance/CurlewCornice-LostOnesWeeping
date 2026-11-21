"""Phone-size check of her card (docs/卡面状态.md 第四节): every listed frame shrunk to 390x220 (the phone's landscape
player in a portrait screen), then the card region blown back up 4x with nearest neighbour so its pixels can be judged.
usage: python phone_check.py <frames_dir> <out.png> <frame> [<frame> ...]
Prints the card's width in phone pixels for the cover frames (card measured as the widest near-white run on the row
through the card's centre in the phone frame)."""
import sys, numpy as np
from PIL import Image, ImageDraw
d, out, frames = sys.argv[1], sys.argv[2], [int(f) for f in sys.argv[3:]]
tiles = []
for f in frames:
    im = Image.open(f'{d}/g_{f:07d}.png').convert('RGB')
    ph = im.resize((390, 220), Image.LANCZOS)
    a = np.asarray(ph).astype(int)
    # widest bright, low-saturation run (the card) on rows 100..215
    best = (0, 0, 0)
    for y in range(90, 218):
        row = a[y]; mx = row.max(1); mn = row.min(1); ok = (mx > 200) & (mx - mn < 40)
        x = 0
        while x < 390:
            if ok[x]:
                s = x
                while x < 390 and ok[x]: x += 1
                if x - s > best[0]: best = (x - s, y, s)
            x += 1
    big = ph.resize((390 * 2, 220 * 2), Image.NEAREST)
    t = Image.new('RGB', (780, 460), 'white'); t.paste(big, (0, 0))
    ImageDraw.Draw(t).text((6, 442), f'g{f}  phone 390x220 (x2 nearest)  widest card-white run {best[0]} px', fill=(0, 0, 0))
    tiles.append(t)
    print(f'g{f}: widest card-white run {best[0]} px at phone row {best[1]}')
cols = 2; rows = (len(tiles) + 1) // 2
sheet = Image.new('RGB', (780 * cols, 460 * rows), 'white')
for i, t in enumerate(tiles): sheet.paste(t, ((i % cols) * 780, (i // cols) * 460))
sheet.save(out)
