"""Geometry guides for the round-4 set-pack fixes (2026-11-20, second art review): plain grey line drawings at the exact layout
and scale a sheet must follow, attached to the Codex prompt as a measurement reference (never a style reference).

- board/guide_eraser.png: the big eraser, 16 x 3 x 1.5 cm. Views 1 (front) and 2 (side) at 60 px/cm, view 3 (standing, view 1
  turned 90 degrees clockwise) at 90 px/cm with both rounded ends outside the canvas. The sleeve covers the middle two thirds;
  it is drawn blank (its print is set afterwards by tools/eraser_print.py on a fixed 16-dot grid).
- board/guide_reader.png: the card reader cutaway at 15 px/cm (housing 60 cm long). Lower deck: card path on one straight plate,
  feed tray 1 outside left, rollers 2, read head 3, eraser 4 standing on its rail, rollers, exit tray 7 outside right BELOW the
  exit slot. Every card is the same 15 cm, seen edge-on. Upper deck: paper roll -> sprocket -> under and round the platen ->
  straight up between the platen (left) and the print head 5 (right) -> slot 6 in the top.
- board/guide_hand.png: her right hand writing, seen from her right at desk height, 50 px/cm: a new 17.5 cm pencil, the hand
  from the cuff to the index fingertip about 13 cm, knuckle height about 6.5 cm, the cuff opening about 8 cm.
usage: python art/design/prompts/_setpack_guides4.py
"""
import math, os
from PIL import Image, ImageDraw, ImageFont

here = os.path.dirname(os.path.abspath(__file__))
board = os.path.join(here, '..', 'board')
G = (120, 120, 120)
L = (175, 175, 175)
LW = 3


def font(px):
    for f in ('arial.ttf', 'DejaVuSans.ttf'):
        try:
            return ImageFont.truetype(f, px)
        except OSError:
            pass
    return ImageFont.load_default()


def dashed(d, p0, p1, fill=L, width=2, on=10, off=8):
    x0, y0 = p0; x1, y1 = p1
    n = math.hypot(x1 - x0, y1 - y0)
    t = 0
    while t < n:
        a, b = t / n, min(t + on, n) / n
        d.line([(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a), (x0 + (x1 - x0) * b, y0 + (y1 - y0) * b)], fill=fill, width=width)
        t += on + off


def eraser():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255))
    d = ImageDraw.Draw(im)
    # view 1 front (16 x 3 cm) and view 2 side (16 x 1.5 cm) at 60 px/cm; working end (left) rounder
    k = 60
    x0, x1 = 60, 60 + 16 * k
    s0, s1 = x0 + 16 * k / 6, x1 - 16 * k / 6                  # sleeve: the middle two thirds
    for cy, h, rl, rr in ((300, 3 * k, 80, 40), (650, 1.5 * k, 40, 22)):
        t, b = cy - h / 2, cy + h / 2
        d.line([(x0 + rl, t), (x1 - rr, t)], fill=G, width=LW)
        d.line([(x0 + rl, b), (x1 - rr, b)], fill=G, width=LW)
        d.line([(x0, t + rl), (x0, b - rl)], fill=G, width=LW)
        d.line([(x1, t + rr), (x1, b - rr)], fill=G, width=LW)
        d.arc([x0, t, x0 + 2 * rl, t + 2 * rl], 180, 270, fill=G, width=LW)
        d.arc([x0, b - 2 * rl, x0 + 2 * rl, b], 90, 180, fill=G, width=LW)
        d.arc([x1 - 2 * rr, t, x1, t + 2 * rr], 270, 360, fill=G, width=LW)
        d.arc([x1 - 2 * rr, b - 2 * rr, x1, b], 0, 90, fill=G, width=LW)
        d.rectangle([s0, cy - h / 2 - 5, s1, cy + h / 2 + 5], outline=G, width=LW)      # sleeve, a little proud of the rubber
        d.rectangle([s0 + 8, cy - h / 2 + 3, s1 - 8, cy + h / 2 - 3], outline=L, width=1)  # its thin printed border
    # view 3: view 1 turned 90 degrees clockwise (its left end at the top), 90 px/cm, the rubber running off top and bottom
    k3 = 90
    cx, cy = 1270, 512
    w = 3 * k3
    S0, S1 = cy - (16 * k3 / 3), cy + (16 * k3 / 3)            # sleeve 10.67 cm
    d.line([(cx - w / 2, 0), (cx - w / 2, 1024)], fill=G, width=LW)
    d.line([(cx + w / 2, 0), (cx + w / 2, 1024)], fill=G, width=LW)
    d.rectangle([cx - w / 2 - 7, S0, cx + w / 2 + 7, S1], outline=G, width=LW)
    d.rectangle([cx - w / 2 + 5, S0 + 12, cx + w / 2 - 5, S1 - 12], outline=L, width=1)
    for y in (6, 1018):
        dashed(d, (cx - w / 2 - 40, y), (cx + w / 2 + 40, y))
    im.save(os.path.join(board, 'guide_eraser.png'))
    return dict(front=(x0, x1, 300, 3 * k, s0, s1), side=(x0, x1, 650, 1.5 * k), vert=(cx, w, S0, S1))


def reader():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255))
    d = ImageDraw.Draw(im)
    f = font(26)
    k = 15                                     # px per cm; housing 60 cm
    X0, X1 = 318, 1218
    # housing: lower box and the printer hump on the right; the box's top wall is the inner wall between the two decks
    d.rounded_rectangle([X0, 400, X1, 860], radius=40, outline=G, width=LW)
    d.rounded_rectangle([X0 + 14, 414, X1 - 14, 846], radius=30, outline=L, width=2)
    d.rounded_rectangle([740, 170, X1, 420], radius=40, outline=G, width=LW)
    d.rounded_rectangle([754, 184, X1 - 14, 400], radius=30, outline=L, width=2)
    for x in (360, 1170):
        d.rectangle([x, 860, x + 50, 880], outline=G, width=2)          # feet
    # card plate through two slots
    plate = 720
    d.rectangle([X0 - 20, plate, X1 + 20, plate + 6], outline=G, width=2)
    for x in (X0, X1):
        d.rectangle([x - 8, plate - 18, x + 8, plate - 2], fill=(255, 255, 255), outline=G, width=1)   # slot
    card = 15 * k                               # 225 px, every card
    # (1) feed tray outside left, sloping down to the slot, a stack of cards edge-on
    t0, t1 = (40, 650), (X0 - 10, plate + 4)
    d.line([t0, t1], fill=G, width=LW)
    d.line([t0, (t0[0], t0[1] - 30)], fill=G, width=LW)
    ang = math.atan2(t1[1] - t0[1], t1[0] - t0[0])
    ux, uy = math.cos(ang), math.sin(ang)
    for i in range(8):
        off = 5 + i * 5
        a = (t1[0] - card * ux + uy * off, t1[1] - card * uy - ux * off)
        b = (t1[0] + uy * off, t1[1] - ux * off)
        d.line([a, b], fill=G, width=2)
    # (2) feed rollers + motor and belt
    for cy in (plate - 21, plate + 27):
        d.ellipse([400 - 20, cy - 20, 400 + 20, cy + 20], outline=G, width=LW)
    d.rectangle([470, 790, 545, 840], outline=G, width=2)
    d.ellipse([440, 805, 462, 827], outline=G, width=2)
    d.line([(451, 805), (395, plate + 8)], fill=G, width=2)
    d.line([(462, 816), (418, plate + 36)], fill=G, width=2)
    # (3) read head, a bar with a row of sensors just above the plate
    d.rectangle([520, 664, 650, 698], outline=G, width=LW)
    for i in range(7):
        x = 530 + i * 18
        d.rectangle([x, 698, x + 8, 708], outline=G, width=1)
    d.line([(585, 664), (585, 414)], fill=L, width=2)                    # its bracket to the ceiling
    # the one card in transit, edge-on, 15 cm
    d.rectangle([548, plate - 5, 548 + card, plate], outline=G, width=2)
    # (4) eraser standing in a carriage on a vertical rail, working end down just above the plate
    ex0, ew, eh = 840, 3 * k, 16 * k            # 45 x 240
    ey1 = plate - 12
    ey0 = ey1 - eh
    d.rounded_rectangle([ex0, ey0, ex0 + ew, ey1], radius=18, outline=G, width=LW)
    d.rectangle([ex0 - 4, ey0 + eh / 6, ex0 + ew + 4, ey1 - eh / 6], outline=G, width=2)        # sleeve
    d.rectangle([ex0 - 12, ey0 + 10, ex0 + ew + 12, ey0 + 40], outline=G, width=2)              # carriage clamp
    d.rectangle([ex0 + ew + 12, ey0 + 10, ex0 + ew + 30, ey0 + 40], outline=G, width=2)
    d.rectangle([ex0 + ew + 30, 414, ex0 + ew + 40, 690], outline=G, width=2)                   # rail
    # rollers after the eraser
    for cy in (plate - 21, plate + 27):
        d.ellipse([1040 - 20, cy - 20, 1040 + 20, cy + 20], outline=G, width=LW)
    # (7) exit tray outside right, BELOW the exit slot, cards drop onto it
    ty = 812
    d.line([(X1 + 4, ty), (1500, ty - 10)], fill=G, width=LW)
    d.line([(1500, ty - 10), (1500, ty - 50)], fill=G, width=LW)
    for i in range(6):
        y = ty - 6 - i * 5
        d.line([(1262, y - (1262 - X1) * 10 / 280 + 0), (1262 + card, y - (1262 + card - X1) * 10 / 280)], fill=G, width=2)
    dashed(d, (X1 + 22, plate + 3), (1290, ty - 40), fill=L)
    # upper deck: the printer
    rx, ry, rr = 860, 290, 80
    d.ellipse([rx - rr, ry - rr, rx + rr, ry + rr], outline=G, width=LW)
    d.ellipse([rx - 12, ry - 12, rx + 12, ry + 12], outline=G, width=2)
    d.polygon([(rx, ry), (rx - 40, 400), (rx + 40, 400)], outline=L, width=2)                 # spindle bracket
    sx, sy, sr = 990, 388, 16
    d.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], outline=G, width=2)                       # sprocket
    px, py, pr = 1080, 330, 38
    d.ellipse([px - pr, py - pr, px + pr, py + pr], outline=G, width=LW)                      # platen
    paper = [(rx, ry + rr), (sx, sy - sr), (px, py + pr)]
    for a in range(90, -1, -10):                                                              # round the platen's lower right
        paper.append((px + pr * math.cos(math.radians(a)) + 0, py + pr * math.sin(math.radians(a))))
    paper += [(px + pr, py), (px + pr, 170), (px + pr, 80)]
    d.line(paper, fill=(70, 70, 70), width=3)
    for a in range(0, 181, 12):                                                               # the strip curling over on top
        pass
    curl = [(px + pr, 80)] + [(px + pr + 34 - 34 * math.cos(math.radians(a)), 80 - 34 * math.sin(math.radians(a))) for a in range(0, 181, 15)]
    curl += [(px + pr + 68, 120)]
    d.line(curl, fill=(70, 70, 70), width=3)
    d.rectangle([px + pr + 6, py - 26, px + pr + 74, py + 26], outline=G, width=LW)           # (5) print head, right of the paper
    d.rectangle([px + pr + 74, py - 8, X1 - 14, py + 8], outline=L, width=2)                  # its carriage rod
    d.rectangle([px + pr - 14, 164, px + pr + 14, 186], fill=(255, 255, 255), outline=G, width=2)   # (6) slot
    # callout positions
    for n, (x, y), tgt in ((1, (60, 560), (150, 660)), (2, (400, 960), (400, 760)), (3, (585, 960), (585, 705)),
                           (4, (790, 960), (860, 690)), (5, (1300, 330), (1188, 330)), (6, (960, 90), (1105, 172)),
                           (7, (1420, 960), (1380, 795))):
        d.line([(x, y), tgt], fill=L, width=2)
        d.ellipse([x - 24, y - 24, x + 24, y + 24], fill=(255, 255, 255), outline=G, width=2)
        d.text((x, y), str(n), fill=G, font=f, anchor='mm')
    im.save(os.path.join(board, 'guide_reader.png'))


def hand():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255))
    d = ImageDraw.Draw(im)
    k = 50                                     # px per cm
    paper_y = 880
    dashed(d, (0, paper_y), (1536, paper_y), fill=L, width=2)
    # pencil: 17.5 cm new pencil, 0.75 cm across the flats, point touching the paper, rising at 48 degrees
    tip = (300, paper_y - 4)
    ang = math.radians(48)
    ux, uy = math.cos(ang), -math.sin(ang)
    nx, ny = -uy, ux
    Lp, wp, cone = 17.5 * k, 0.75 * k, 2.0 * k
    end = (tip[0] + ux * Lp, tip[1] + uy * Lp)
    c0 = (tip[0] + ux * cone, tip[1] + uy * cone)
    d.polygon([tip, (c0[0] + nx * wp / 2, c0[1] + ny * wp / 2), (c0[0] - nx * wp / 2, c0[1] - ny * wp / 2)], outline=G, width=2)
    d.polygon([(c0[0] + nx * wp / 2, c0[1] + ny * wp / 2), (end[0] + nx * wp / 2, end[1] + ny * wp / 2),
               (end[0] - nx * wp / 2, end[1] - ny * wp / 2), (c0[0] - nx * wp / 2, c0[1] - ny * wp / 2)], outline=G, width=LW)
    at = lambda cm: (tip[0] + ux * cm * k, tip[1] + uy * cm * k)
    # the hand's extent: index fingertip ~2.8 cm up the pencil, thumb tip just behind it, the pencil crossing the web ~8.5 cm
    # up; the hand's top (knuckles) ~6.5 cm above the paper; the little-finger side resting on the paper; wrist at the cuff
    ift, web = at(2.8), at(8.5)
    wrist_x = 1000
    blob = [(ift[0] - 30, ift[1] - 10), (web[0] - 40, web[1] + 10), (web[0] + 60, paper_y - 6.6 * k), (800, paper_y - 6.4 * k),
            (wrist_x, paper_y - 6.0 * k), (wrist_x, paper_y - 1.4 * k), (820, paper_y - 0.2 * k), (620, paper_y - 0.4 * k),
            (470, paper_y - 1.2 * k), (ift[0] + 10, ift[1] + 40)]
    pts = blob + [blob[0]]
    for i in range(len(pts) - 1):
        dashed(d, pts[i], pts[i + 1], fill=G, width=2)
    for p in (ift, web):
        d.ellipse([p[0] - 9, p[1] - 9, p[0] + 9, p[1] + 9], outline=(60, 60, 60), width=3)
    # cuff (white shirt cuff seen from the side, about 8 cm across) and the blazer sleeve to the right edge
    cy = paper_y - 4.0 * k
    d.ellipse([wrist_x + 10, cy - 4.1 * k, wrist_x + 70, cy + 4.1 * k], outline=G, width=LW)
    d.line([(wrist_x + 55, cy - 4.6 * k), (1536, cy - 5.6 * k)], fill=G, width=LW)
    d.line([(wrist_x + 55, cy + 4.0 * k), (1536, cy + 4.2 * k)], fill=G, width=LW)
    d.ellipse([wrist_x + 40, cy - 4.6 * k, wrist_x + 100, cy + 4.3 * k], outline=G, width=2)
    im.save(os.path.join(board, 'guide_hand.png'))
    print('hand: pencil', round(Lp), 'px; index tip -> wrist', round(math.hypot(wrist_x - ift[0], cy - ift[1])), 'px')


print(eraser())
reader()
hand()
