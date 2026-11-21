"""Phone-size flow sheets for the blind review of seg 04: every 6th frame (0.2 s) at 390x220, labelled with song time.
usage: python work/seg/04/phone_sheets.py <frames_dir> <out_dir> <first_global_frame>"""
import os, sys
from PIL import Image, ImageDraw

src, out, g0 = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(out, exist_ok=True)
frames = sorted(f for f in os.listdir(src) if f.endswith('.png'))
pick = frames[::6]
TW, TH, COLS, ROWS = 390, 220, 4, 6
for s in range(0, len(pick), COLS * ROWS):
    chunk = pick[s:s + COLS * ROWS]
    rows = (len(chunk) + COLS - 1) // COLS
    sheet = Image.new('RGB', (COLS * (TW + 8) + 8, rows * (TH + 26) + 8), (30, 30, 30))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        n = frames.index(f)
        im = Image.open(os.path.join(src, f)).convert('RGB').resize((TW, TH), Image.LANCZOS)
        x, y = 8 + (i % COLS) * (TW + 8), 8 + (i // COLS) * (TH + 26)
        sheet.paste(im, (x, y + 18))
        d.text((x, y + 2), f'{(g0 + n) / 30:.2f} s', fill=(230, 230, 230))
    sheet.save(os.path.join(out, f'phone_flow_{s // (COLS * ROWS) + 1}.png'))
print('ok', len(pick))
