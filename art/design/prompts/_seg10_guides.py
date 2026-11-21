"""Segment 10 design B (乙, the view down the aisle): grey guide drawings for the two rows of seated passengers, so Codex draws
them in the same one-point perspective the page uses (web/scenes/segments/seg_10.js, variant b).
Camera: level, 1.45 m high, on the aisle centre line, f = 3000 px on a 1920 x 1080 frame (long lens), horizon y = 540.
A point at lateral offset lat (m, left negative), height h (m), depth d (m) lands on X = 960 + 3000 lat / d, Y = 540 + 3000 (1.45 - h) / d.
The left-row image covers frame x 0..900, y 480..1080; the right-row image frame x 1020..1920, y 480..1080 (both 1536 x 1024).
usage: python art/design/prompts/_seg10_guides.py
"""
import json, os
from PIL import Image, ImageDraw
here = os.path.dirname(os.path.abspath(__file__))
F, HC = 3000.0, 1.45
ROWS = {
    'L': {'x0': 0,    'side': -1, 'd': [4.2, 5.3, 6.6, 10.0, 11.6]},
    'R': {'x0': 1020, 'side': +1, 'd': [4.6, 5.8, 7.2, 9.8, 11.4]},
}
S = 1536 / 900.0
def proj(lat, h, d): return 960 + F * lat / d, 540 + F * (HC - h) / d
def img_xy(row, X, Y): return (X - ROWS[row]['x0']) * S, (Y - 480) * S

meta = {}
for key, R in ROWS.items():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255)); dr = ImageDraw.Draw(im)
    sd = R['side'] ; g = (175, 175, 175); g2 = (205, 205, 205)
    # floor edge at the bench foot, seat front edge, seat surface back, window sill, all converging on the vanishing point
    for lat, h in [(0.86 * sd, 0.0), (0.86 * sd, 0.43), (1.32 * sd, 0.43), (1.40 * sd, 0.86), (1.40 * sd, 1.70)]:
        pts = [img_xy(key, *proj(lat, h, d)) for d in (3.0, 30.0)]
        dr.line(pts, fill=g2, width=3)
    people = []
    for d in R['d']:
        # head (centre 1.16 m high, 0.23 m tall, 0.19 m deep in profile), body, thigh to the knee, shin
        hx, hy = img_xy(key, *proj(1.13 * sd, 1.16, d)); hh = F * 0.23 / d * S; hw = F * 0.19 / d * S
        dr.ellipse([hx - hw / 2, hy - hh / 2, hx + hw / 2, hy + hh / 2], outline=(120, 120, 120), width=4)
        sh = img_xy(key, *proj(1.16 * sd, 1.00, d)); hip = img_xy(key, *proj(1.20 * sd, 0.47, d))
        knee = img_xy(key, *proj(0.80 * sd, 0.52, d)); foot = img_xy(key, *proj(0.74 * sd, 0.02, d))
        dr.line([(hx, hy + hh / 2), sh, hip, knee, foot], fill=g, width=5)
        people.append({'d': d, 'head': [round(hx), round(hy)], 'head_h': round(hh)})
    # the vanishing point (frame 960, 540)
    vx, vy = img_xy(key, 960, 540); dr.ellipse([vx - 8, vy - 8, vx + 8, vy + 8], fill=(150, 150, 150))
    out = os.path.join(here, '..', 'board', f'guide_seg10_row{key}.png'); im.save(out)
    meta[key] = {'x0': R['x0'], 'scale': S, 'people': people}
json.dump(meta, open(os.path.join(here, '..', 'board', 'guide_seg10_rows.json'), 'w'), indent=1)
print(json.dumps(meta))
