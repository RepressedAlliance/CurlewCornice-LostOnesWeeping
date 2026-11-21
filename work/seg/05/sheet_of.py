"""Contact sheet of PNG frames (two columns, labelled). usage: python sheet_of.py out.png frame1.png frame2.png ..."""
import sys
from PIL import Image, ImageDraw
out, fs = sys.argv[1], sys.argv[2:]
tw = 800; th = 450; cols = 2; rows = (len(fs) + 1) // 2
S = Image.new('RGB', (cols * tw, rows * (th + 24)), (30, 30, 30)); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS); x = (i % 2) * tw; y = (i // 2) * (th + 24)
    S.paste(im, (x, y + 24)); d.text((x + 6, y + 4), f.split('/')[-1], fill=(230, 230, 230))
S.save(out)
