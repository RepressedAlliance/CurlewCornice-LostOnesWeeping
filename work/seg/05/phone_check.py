"""Segment 05: every shot where a card is on screen, shrunk to the phone size (390 x 220, docs/卡面状態.md 第四节), shown at
2x (nearest) so the phone pixels can be read. usage: python work/seg/05/phone_check.py <frames_dir> <out.png>"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
SHOTS = [(1185, 'S1 board, her back'), (1200, 'S1 swing'), (1270, 'S3 lanyard, board edge'), (1310, 'S4 board'),
         (1321, 'S4 jolt'), (1323, 'S4 blown cards'), (1325, 'S4 blown cards 2'), (1337, 'S4 blown cards 3'),
         (1400, 'S4 hole stands'), (1450, 'S5 lanyard'), (1490, 'S6 close cards'), (1505, 'S6 corner swing')]
PW, PH, Z = 390, 220, 2
cols = 3; rows = (len(SHOTS) + cols - 1) // cols
S = Image.new('RGB', (cols * PW * Z, rows * (PH * Z + 24)), 'white'); dr = ImageDraw.Draw(S)
try: font = ImageFont.truetype('arial.ttf', 18)
except Exception: font = ImageFont.load_default()
for i, (f, lab) in enumerate(SHOTS):
    im = Image.open(f'{d}/g_{f:07d}.png').convert('RGB').resize((PW, PH), Image.LANCZOS).resize((PW * Z, PH * Z), Image.NEAREST)
    x, y = (i % cols) * PW * Z, (i // cols) * (PH * Z + 24)
    S.paste(im, (x, y + 24)); dr.text((x + 6, y + 2), f'{f}  {lab}', fill='black', font=font)
S.save(out)
