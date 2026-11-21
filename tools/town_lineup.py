"""Rebuild art/canon/town/_lineup_same_scale.png: every town person side by side at the one shared scale (each drawing's canvas
is 2.0 m high), to check that the drawing hand and the heights agree. Transparent, 768 px high.
usage: python tools/town_lineup.py
"""
import glob, os
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
town = os.path.join(ROOT, 'art', 'canon', 'town')
files = sorted(f for f in glob.glob(os.path.join(town, '[hp][0-9][0-9]_*.png')))
H, GAP = 768, 24
tiles = []
for f in files:
    im = Image.open(f).convert('RGBA')
    im = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
    a = np.asarray(im)[..., 3]
    xs = np.nonzero((a > 24).any(axis=0))[0]
    tiles.append(im.crop((xs.min(), 0, xs.max() + 1, H)))
W = sum(t.width for t in tiles) + GAP * (len(tiles) + 1)
out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
x = GAP
for t in tiles:
    out.alpha_composite(t, (x, 0))
    x += t.width + GAP
dst = os.path.join(town, '_lineup_same_scale.png')
out.save(dst)
print(len(tiles), 'people ->', dst, out.size)
