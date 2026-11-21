"""Crop regions of drawings with a 25 px grid (labels every 100 px in drawing coords) to read points by eye.
usage: python work/seg/14/gridcrop.py out.png name:x0,y0,x1,y1[:scale] ..."""
import sys
from PIL import Image, ImageDraw
out = sys.argv[1]; tiles = []
for a in sys.argv[2:]:
    n, b, *sc = a.split(':'); x0, y0, x1, y1 = map(int, b.split(',')); s = float(sc[0]) if sc else 2
    p = f'art/design/out/{n}.png'
    im = Image.open(p).convert('RGBA'); bg = Image.new('RGBA', im.size, (40, 40, 46, 255)); bg.alpha_composite(im)
    c = bg.crop((x0, y0, x1, y1)).resize((int((x1 - x0) * s), int((y1 - y0) * s))).convert('RGB'); d = ImageDraw.Draw(c)
    for x in range((x0 // 25 + 1) * 25, x1, 25):
        X = (x - x0) * s; d.line([(X, 0), (X, c.height)], fill=(255, 0, 255) if x % 100 == 0 else (110, 50, 110))
        if x % 100 == 0: d.text((X + 2, 2), str(x), fill=(255, 255, 0))
    for y in range((y0 // 25 + 1) * 25, y1, 25):
        Y = (y - y0) * s; d.line([(0, Y), (c.width, Y)], fill=(255, 0, 255) if y % 100 == 0 else (110, 50, 110))
        if y % 100 == 0: d.text((2, Y + 2), str(y), fill=(255, 255, 0))
    d.text((4, c.height - 14), n, fill=(0, 255, 0)); tiles.append(c)
W = sum(t.width for t in tiles); H = max(t.height for t in tiles)
sh = Image.new('RGB', (W, H), (0, 0, 0)); x = 0
for t in tiles: sh.paste(t, (x, 0)); x += t.width
sh.save(out)
