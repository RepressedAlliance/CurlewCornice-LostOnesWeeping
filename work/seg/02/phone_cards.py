"""Phone check of the cards (docs/卡面状态.md 第四节): frames shrunk to 390 x 219 (a phone held upright, the film across it),
shown at 3x with nearest-neighbour so the phone's pixels can be judged, one row per frame (left: the frame, right: the strip
of the row's cards at chest height, cropped from the phone image).  usage: python phone_cards.py <frames_dir> <out.png> [g ...]"""
import sys
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
fr = [int(x) for x in sys.argv[3:]] or [410, 418, 424, 433, 437, 438, 440, 442, 445, 449, 453]
W, H, Z = 390, 219, 3
rows = []
for g in fr:
    p = Image.open(f'{d}/g_{g:07d}.png').convert('RGB').resize((W, H), Image.LANCZOS)
    rows.append((g, p.resize((W * Z, H * Z), Image.NEAREST)))
S = Image.new('RGB', (W * Z, len(rows) * (H * Z + 24)), 'white'); dr = ImageDraw.Draw(S)
for i, (g, im) in enumerate(rows):
    y = i * (H * Z + 24); dr.text((6, y + 4), f'g{g}  (390x219, shown 3x)', fill='black'); S.paste(im, (0, y + 24))
S.save(out); print(out)
