"""Geometry guides for the set-pack fixes (round 3, 2026-11-20): plain grey line drawings at the exact layout and scale the
design sheet must follow, attached to the Codex prompt as a measurement reference (not a style reference).

- board/guide_lespaul.png: the Les Paul sheet's front view (nut, 22 frets at the real equal-temperament positions, inlays, neck/body
  join, pickups, bridge line, truss-rod cover) and the side view (flat back, rim, arched top, 4 degree neck angle, fingerboard above
  the top, 17 degree headstock, string line to the bridge), on the same 1536 x 1024 layout as the old sheet (99 cm = 1007 px).
- board/guide_gate.png: the ticket gate's front and side elevations at one shared scale (cabinet 25 cm wide, 1.0 m high, 1.8 m long,
  passages 55 cm, closed flaps 0.55-1.0 m).
usage: python art/design/prompts/_setpack_guides.py
"""
import math, os
from PIL import Image, ImageDraw

here = os.path.dirname(os.path.abspath(__file__))
board = os.path.join(here, '..', 'board')
G = (120, 120, 120)
LW = 3


def lespaul():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255))
    d = ImageDraw.Draw(im)
    top, k = 12, 1007 / 99.0                # px per cm
    nut = 195
    L = 62.9 * k                            # scale length in px
    sad = nut + L
    fret = lambda n: nut + L * (1 - 2 ** (-n / 12))
    body_top, body_bot = 1018 - 44 * k, 1018

    # ---------- front view, centre x=380 ----------
    cx = 380
    fb_end = fret(22) + 1.0 * k
    w_nut, w_end = 4.3 * k, 5.7 * k
    hw = lambda y: (w_nut + (w_end - w_nut) * (y - nut) / (fb_end - nut)) / 2
    # headstock (open-book outline simplified) and truss-rod bell
    d.polygon([(cx - hw(nut), nut), (cx - 4.6 * k, top + 3 * k), (cx - 3.6 * k, top), (cx + 3.6 * k, top),
               (cx + 4.6 * k, top + 3 * k), (cx + hw(nut), nut)], outline=G, width=LW)
    bell = [(cx - 0.9 * k, nut - 0.3 * k), (cx - 0.5 * k, nut - 2.8 * k), (cx, nut - 3.4 * k), (cx + 0.5 * k, nut - 2.8 * k),
            (cx + 0.9 * k, nut - 0.3 * k)]
    d.polygon(bell, outline=G, width=2)
    for i, s in enumerate((-1, 1)):
        for j in range(3):
            y = top + (4.5 + 4.2 * j) * k
            d.ellipse([cx + s * 2.6 * k - 6, y - 6, cx + s * 2.6 * k + 6, y + 6], outline=G, width=2)
    # fingerboard, frets, inlays
    d.polygon([(cx - hw(nut), nut), (cx + hw(nut), nut), (cx + hw(fb_end), fb_end), (cx - hw(fb_end), fb_end)], outline=G, width=LW)
    d.line([(cx - hw(nut), nut), (cx + hw(nut), nut)], fill=(60, 60, 60), width=6)
    for n in range(1, 23):
        y = fret(n)
        d.line([(cx - hw(y), y), (cx + hw(y), y)], fill=G, width=2)
    for n in (3, 5, 7, 9, 12, 15, 17, 19, 21):
        y0, y1 = fret(n - 1), fret(n)
        ym, h = (y0 + y1) / 2, (y1 - y0) * 0.42
        w = hw(ym) * 0.72
        d.polygon([(cx - w * 0.85, ym - h / 2), (cx + w * 0.85, ym - h / 2), (cx + w, ym + h / 2), (cx - w, ym + h / 2)], outline=G, width=2)
    # 12th fret = half the scale: a long tick each side
    y12 = fret(12)
    d.line([(cx - 150, y12), (cx - 60, y12)], fill=(40, 40, 40), width=3)
    d.line([(cx + 60, y12), (cx + 150, y12)], fill=(40, 40, 40), width=3)
    # body extents (dashed), neck join at fret 16
    for y in (body_top, body_bot):
        for x in range(cx - 170, cx + 170, 16):
            d.line([(x, y), (x + 8, y)], fill=G, width=2)
    y16 = fret(16)
    d.line([(cx - 120, y16), (cx - 40, y16)], fill=G, width=2)
    # pickups, bridge bar, strings
    for yc in (fb_end + 2.6 * k, sad - 4.5 * k):
        d.rectangle([cx - 4.3 * k, yc - 1.8 * k, cx + 4.3 * k, yc + 1.8 * k], outline=G, width=LW)
    d.rounded_rectangle([cx - 5.2 * k, sad - 0.6 * k, cx + 5.2 * k, sad + 0.6 * k], radius=5, outline=G, width=LW)
    for i in range(6):
        t = (i - 2.5) / 2.5
        d.line([(cx + t * (hw(nut) - 5), nut), (cx + t * 2.6 * k, sad)], fill=(160, 160, 160), width=1)
    # knobs (treble side = viewer's right on the front view) and toggle (upper bass side = viewer's left)
    for (dx, dy) in ((6.5, 4.5), (11.0, 2.5), (8.0, 9.5), (12.5, 7.5)):
        x, y = cx + dx * k * 0.85, sad + dy * k
        d.ellipse([x - 13, y - 13, x + 13, y + 13], outline=G, width=2)
    d.ellipse([cx - 11 * k - 10, body_top + 4 * k - 10, cx - 11 * k + 10, body_top + 4 * k + 10], outline=G, width=2)

    # ---------- side view (bass side; face of the guitar toward the viewer's LEFT; back on the right) ----------
    bk = 805                                     # flat back line
    rim = bk - 4.8 * k                           # front edge of the rim (binding line)
    arch = 1.4 * k
    xtop = lambda y: rim - arch * math.sin(math.pi * (y - body_top) / (body_bot - body_top))
    d.line([(bk, body_top), (bk, body_bot)], fill=G, width=LW)
    d.line([(rim, body_top), (rim, body_bot)], fill=G, width=2)
    d.line([(rim, body_top), (bk, body_top)], fill=G, width=LW)
    d.line([(rim, body_bot), (bk, body_bot)], fill=G, width=LW)
    pts = [(xtop(y), y) for y in range(int(body_top), int(body_bot) + 1, 4)]
    d.line(pts, fill=G, width=LW)
    xs_b = xtop(sad) - 1.9 * k                    # string height above the top at the bridge
    tan4 = math.tan(math.radians(4))
    xstr = lambda y: xs_b + tan4 * (sad - y)      # the string line (neck tilted back 4 degrees)
    d.line([(xstr(nut), nut), (xs_b, sad)], fill=(150, 150, 150), width=1)
    # fingerboard surface 0.35 cm behind the strings, board 0.6 cm thick, neck depth 2.1 -> 2.5 cm
    fb = lambda y: xstr(y) + 0.35 * k
    d.line([(fb(nut), nut), (fb(fb_end), fb_end)], fill=G, width=LW)
    d.line([(fb(nut) + 0.6 * k, nut), (fb(fb_end) + 0.6 * k, fb_end)], fill=G, width=1)
    depth = lambda y: (2.1 + 0.4 * min(1, (y - nut) / (fret(12) - nut))) * k
    back_pts = [(fb(y) + depth(y), y) for y in range(nut, int(body_top) + 30, 6)]
    d.line(back_pts, fill=G, width=LW)
    d.line([(fb(fb_end), fb_end), (xtop(fb_end), fb_end)], fill=G, width=2)
    # bridge (studs + bar), pickups standing up from the top, knobs, toggle
    d.rectangle([xs_b - 0.3 * k, sad - 0.6 * k, xtop(sad), sad + 0.6 * k], outline=G, width=2)
    for yc in (fb_end + 2.6 * k, sad - 4.5 * k):
        d.rectangle([xstr(yc) + 0.4 * k, yc - 1.8 * k, xtop(yc), yc + 1.8 * k], outline=G, width=2)
    for y in (sad + 4.0 * k, sad + 9.0 * k):
        d.rectangle([xtop(y) - 1.9 * k, y - 1.0 * k, xtop(y), y + 1.0 * k], outline=G, width=2)
    yt = body_top + 4 * k
    d.line([(xtop(yt), yt), (xtop(yt) - 3.0 * k, yt - 0.3 * k)], fill=G, width=4)
    # headstock: 17 degrees further back than the neck, 18 cm long, 1.5 cm thick
    ang = math.radians(4 + 17)
    ux, uy = math.sin(ang), -math.cos(ang)       # direction up the headstock (toward the right = back)
    nx, ny = math.cos(ang), math.sin(ang)        # normal toward the back
    p0 = (fb(nut), nut)
    hl, ht = 17.5 * k, 1.5 * k
    hs = [p0, (p0[0] + ux * hl, p0[1] + uy * hl), (p0[0] + ux * hl + nx * ht, p0[1] + uy * hl + ny * ht),
          (p0[0] + nx * (ht + 0.6 * k), p0[1] + ny * (ht + 0.6 * k))]
    d.polygon(hs, outline=G, width=LW)
    for j in range(3):
        t = (4.5 + 4.2 * j) * k
        bx, by = p0[0] + ux * t + nx * ht * 0.5, p0[1] + uy * t + ny * ht * 0.5
        d.ellipse([bx - 9, by - 13, bx + 9, by + 13], outline=G, width=2)          # key button seen end-on
        d.line([(bx - nx * ht * 0.5, by - ny * ht * 0.5), (bx - nx * (ht * 0.5 + 0.9 * k), by - ny * (ht * 0.5 + 0.9 * k))],
               fill=G, width=3)                                                    # post through the face
    # strap buttons
    d.ellipse([(rim + bk) / 2 - 7, body_bot - 2, (rim + bk) / 2 + 7, body_bot + 6], outline=G, width=2)
    out = os.path.join(board, 'guide_lespaul.png')
    im.save(out)
    print(out, '12th fret y=%.1f (nut %d, bridge %.1f)' % (y12, nut, sad))


def gate():
    im = Image.new('RGB', (1536, 1024), (255, 255, 255))
    d = ImageDraw.Draw(im)
    k = 3.45                                  # px per cm, both views
    floor = 690
    H = 100 * k
    # front elevation: cabinet 25 | passage 55 | cabinet 25 | passage 55 | cabinet 25  (185 cm)
    x = 60
    cabs = []
    for i in range(3):
        cabs.append(x)
        d.rectangle([x, floor - H, x + 25 * k, floor], outline=G, width=LW)
        d.rectangle([x, floor - H - 8 * k, x + 25 * k, floor - H], outline=G, width=2)           # reader deck seen end-on
        d.rectangle([x + 7 * k, floor - H - 18 * k, x + 18 * k, floor - H - 8 * k], outline=G, width=2)  # small display
        d.rectangle([x + 5 * k, floor - 88 * k, x + 20 * k, floor - 73 * k], outline=G, width=2)  # indicator panel
        d.rectangle([x, floor - 6 * k, x + 25 * k, floor], outline=G, width=2)                    # plinth
        x += (25 + 55) * k
    # right passage closed: two flaps from the cabinet sides meeting in the middle, 0.55-1.0 m
    xl, xr = cabs[1] + 25 * k, cabs[2]
    xm = (xl + xr) / 2
    d.rounded_rectangle([xl, floor - 100 * k, xm - 1, floor - 55 * k], radius=10, outline=G, width=LW)
    d.rounded_rectangle([xm + 1, floor - 100 * k, xr, floor - 55 * k], radius=10, outline=G, width=LW)
    # left passage open: flaps folded into the cabinet sides (thin slots)
    for xs in (cabs[0] + 25 * k - 4, cabs[1] + 4):
        d.line([(xs, floor - 100 * k), (xs, floor - 55 * k)], fill=G, width=2)
    # side elevation of one cabinet: 180 cm long, entry end on the LEFT
    x0 = 800
    Lc = 180 * k
    d.rectangle([x0, floor - H, x0 + Lc, floor], outline=G, width=LW)
    d.rectangle([x0, floor - 6 * k, x0 + Lc, floor], outline=G, width=2)
    d.polygon([(x0, floor - H), (x0, floor - H - 3 * k), (x0 + 45 * k, floor - H - 8 * k), (x0 + 45 * k, floor - H)],
              outline=G, width=2)                                                            # inclined reader pad
    d.polygon([(x0 + 47 * k, floor - H), (x0 + 50 * k, floor - H - 18 * k), (x0 + 60 * k, floor - H - 18 * k),
               (x0 + 58 * k, floor - H)], outline=G, width=2)                                # small slanted display
    d.rectangle([x0 + 88 * k, floor - 100 * k, x0 + 92 * k, floor - 55 * k], outline=G, width=2)  # flap slot (mid-length)
    for xe in (x0 + 2 * k, x0 + Lc - 2 * k):
        d.line([(xe, floor - 88 * k), (xe, floor - 73 * k)], fill=G, width=5)               # indicator panels on both ends
    # plan view (seen from straight above) of the same cabinet, under its side elevation: the printed reader pad on the
    # entry-end deck, the display, the flap slot
    py0, W = floor + 90, 25 * k
    d.rectangle([x0, py0, x0 + Lc, py0 + W], outline=G, width=LW)
    d.rectangle([x0 + 3 * k, py0 + 3 * k, x0 + 42 * k, py0 + W - 3 * k], outline=G, width=2)
    d.ellipse([x0 + 8 * k, py0 + 6 * k, x0 + 21 * k, py0 + W - 6 * k], outline=G, width=2)
    for r in range(3):
        for c in range(4):
            ex, ey = x0 + (25 + c * 4) * k, py0 + (6 + r * 5) * k
            d.ellipse([ex - 5, ey - 3, ex + 5, ey + 3], outline=G, width=1)
    d.rectangle([x0 + 47 * k, py0 + 5 * k, x0 + 60 * k, py0 + W - 5 * k], outline=G, width=2)
    d.rectangle([x0 + 88 * k, py0 + W - 4 * k, x0 + 92 * k, py0 + W], outline=G, width=2)
    # 1.0 m and floor reference
    for xx in range(40, 1500, 18):
        d.line([(xx, floor - H), (xx + 8, floor - H)], fill=(200, 200, 200), width=1)
    d.line([(40, floor), (1500, floor)], fill=(170, 170, 170), width=1)
    out = os.path.join(board, 'guide_gate.png')
    im.save(out)
    print(out)


lespaul()
gate()
