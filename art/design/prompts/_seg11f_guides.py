"""Grey guides for the finished segment 11 (docs/分镜/11_前副歌2.md, after the blind review of the samples).
Written to art/design/board/guide_seg11f_*.png.

S3b (the row): the screen layout is fixed first (1920x1080, the frame's top edge 20 px under the shoulder line, the four cards'
top edges on one line at y 200; cards B 28-353, A 425-765, C 838-1163, hers 1238-1578; a strip of paper right of her for her
pencil column). Each drawing covers a screen region at 0.86 canvas px per screen px:
  trio  canvas origin = screen (-290, -90)
  row   canvas origin = screen ( 515, -90)
S2 (her ID photo): portrait canvas 1024x1536 = 50 cm x 75 cm (20.48 px/cm), from 162 cm above the floor down to 87 cm; the photo
frame (45 x 60 cm) and the card (15 x 10 cm, top at 122 cm) as drawn here.
"""
from PIL import Image, ImageDraw
import os
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'board')
G, L, F = (150, 150, 150), (210, 210, 210), (185, 185, 185)
K = 0.86

def land():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255)); return im, ImageDraw.Draw(im)

def sc(ox, oy):
    return lambda x, y: ((x - ox) * K, (y - oy) * K)

CARDS = {'B': (28, 353), 'A': (425, 765), 'C': (838, 1163), 'R': (1238, 1578)}
TOP = 200
def card_rect(d, f, who):
    x0, x1 = CARDS[who]; h = (x1 - x0) / 1.5
    a, b = f(x0, TOP), f(x1, TOP + h)
    d.rectangle([a[0], a[1], b[0], b[1]], outline=G, width=6)
    m = f((x0 + x1) / 2, TOP); d.line([(m[0], 0), (m[0], m[1])], fill=L, width=3)     # the lanyard comes down to the clip

def lines(d, f):
    s = f(0, -20)[1]; d.line([(0, s), (1536, s)], fill=L, width=3)                    # shoulder line
    t = f(0, 0)[1]
    for x in range(0, 1536, 24): d.line([(x, t), (x + 12, t)], fill=F, width=2)    # the film frame's top edge (dashed)

def trio():
    im, d = land(); f = sc(-290, -90); lines(d, f)
    l = f(0, 0)[0]
    for y in range(0, 1024, 24): d.line([(l, y), (l, y + 12)], fill=F, width=2)    # the film frame's left edge (dashed)
    for w in 'BAC': card_rect(d, f, w)
    im.save(os.path.join(out, 'guide_seg11f_trio.png'))

def row():
    im, d = land(); f = sc(515, -90); lines(d, f); card_rect(d, f, 'R')
    im.save(os.path.join(out, 'guide_seg11f_row.png'))

def idphoto():
    im = Image.new('RGB', (1024, 1536), (255, 255, 255)); d = ImageDraw.Draw(im); p = 1024 / 50
    Y = lambda h: (162 - h) * p; X = lambda cm: 512 + cm * p
    # the photo frame 45 x 60 cm (dashed), top 158.8 cm
    x0, x1, y0, y1 = X(-22.5), X(22.5), Y(158.8), Y(98.8)
    for x in range(int(x0), int(x1), 26): d.line([(x, y0), (x + 13, y0)], fill=F, width=3); d.line([(x, y1), (x + 13, y1)], fill=F, width=3)
    for y in range(int(y0), int(y1), 26): d.line([(x0, y), (x0, y + 13)], fill=F, width=3); d.line([(x1, y), (x1, y + 13)], fill=F, width=3)
    # the card, its clip line
    d.rectangle([X(-7.5), Y(122), X(7.5), Y(112)], outline=G, width=6); d.line([(512, Y(131)), (512, Y(122))], fill=L, width=3)
    # where her face and bow go (light marks): bow top 157 cm, chin 131 cm, face 13 cm wide
    d.line([(X(-9), Y(157)), (X(9), Y(157))], fill=L, width=3); d.line([(X(-6.5), Y(131)), (X(6.5), Y(131))], fill=L, width=3)
    d.ellipse([X(-6.5), Y(146), X(6.5), Y(131)], outline=L, width=3)
    im.save(os.path.join(out, 'guide_seg11f_id.png'))

trio(); row(); idphoto()
print('ok')
