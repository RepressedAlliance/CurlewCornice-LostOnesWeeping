"""Segment 08b: the pieces that fly off when the pencil snaps (k262), cut from Codex's transparent component drawings.

  art/design/out/<front>.png  -> art/cut/p08b_front.png   the snapped-off front half, turned so the break is on the left and
                                                           the point on the right, scaled so its body is as wide as the pencil
                                                           in r08b_grip (x2 for the punch-in), an outline added outside to
                                                           bring its line weight up to r08b_grip's at that size
  art/design/out/<bits>.png   -> art/cut/p08b_bits.png    the splinters, slivers of green skin and graphite crumbs, each
                                                           scaled to its size on screen (x2), packed in one strip
and their geometry goes into art/cut/seg08b_anchors.json ("front", "bits").
usage: python art/design/prompts/_cut_seg08b_pieces.py <front_name> <bits_name>
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT, CUT = f'{ROOT}/art/design/out', f'{ROOT}/art/cut'
INK = (34, 32, 36)          # the outline colour of her drawings (dark, not pure black)
X2 = 2                      # stored at twice the screen size
PENCIL_W = 56 * 1080 / 1024 # the pencil body's width on screen in r08b_grip (56 drawing px measured across the body)
GRIP_LINE = 3.0 * 1080 / 1024  # r08b_grip's outline on screen


def outline(im, px):
    """Add an outline px wide outside the drawing (alpha dilated by a disc, ink underneath)."""
    r = int(round(px))
    if r < 1: return im
    a = np.array(im.getchannel('A')) > 90
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    grown = ndimage.binary_dilation(a, structure=(xx * xx + yy * yy) <= r * r + 0.5)
    g = Image.fromarray((grown * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    base = Image.new('RGBA', im.size, INK + (0,)); base.putalpha(g)
    base.alpha_composite(im); return base


def line_width(im):
    """The drawing's outline width: the median run of dark opaque pixels across its edges, scanned in rows and columns."""
    arr = np.array(im.convert('RGBA')).astype(int); rgb = arr[..., :3]; dark = (rgb.sum(-1) < 130) & (rgb.max(-1) - rgb.min(-1) < 28) & (arr[..., 3] > 128)
    runs = []
    for m in (dark, dark.T):
        for row in m[:: max(1, m.shape[0] // 200)]:
            n = 0
            for v in row:
                if v: n += 1
                elif n: runs.append(n); n = 0
    return float(np.median(runs)) if runs else 0.0


def front(name):
    im = Image.open(f'{OUT}/{name}.png').convert('RGBA'); a = np.array(im)[..., 3] > 128
    ys, xs = np.nonzero(a); c = np.array([xs.mean(), ys.mean()])
    ev, evec = np.linalg.eigh(np.cov(np.stack([xs - c[0], ys - c[1]])))
    ax = evec[:, np.argmax(ev)]
    # the point is the end towards the upper left (the prompt puts it there): make ax point from the break to the point
    if ax[0] + ax[1] > 0: ax = -ax
    ang = math.degrees(math.atan2(ax[1], ax[0]))
    # PIL turns the picture counter-clockwise on screen, so the axis at angle ang (y down) comes to +x when turned by ang
    rot = im.rotate(ang, resample=Image.BICUBIC, expand=True)
    r = np.array(rot)[..., 3] > 128; ys, xs = np.nonzero(r)
    if xs.size == 0: raise SystemExit('empty after rotation')
    # which end is the point: the point end is the narrow one
    x0, x1 = xs.min(), xs.max(); L = x1 - x0
    colh = np.array([r[:, x].sum() for x in range(x0, x1 + 1)])
    if colh[: L // 6].mean() < colh[-L // 6:].mean():      # narrow end on the left: flip so the point is on the right
        rot = rot.transpose(Image.FLIP_LEFT_RIGHT); r = r[:, ::-1]; ys, xs = np.nonzero(r); x0, x1 = xs.min(), xs.max(); colh = colh[::-1]
    y0, y1 = ys.min(), ys.max()
    rot = rot.crop((x0, y0, x1 + 1, y1 + 1)); r = r[y0:y1 + 1, x0:x1 + 1]; L = r.shape[1]
    # the body's width: the median column height between 25% and 50% of the length from the break (past the splinters)
    body_w = float(np.median(colh[int(L * 0.25): int(L * 0.5)]))
    lw = line_width(rot)
    s = PENCIL_W * X2 / body_w
    out = rot.resize((max(1, round(rot.width * s)), max(1, round(rot.height * s))), Image.LANCZOS)
    pad = 8; canvas = Image.new('RGBA', (out.width + 2 * pad, out.height + 2 * pad), (0, 0, 0, 0)); canvas.alpha_composite(out, (pad, pad))
    add = max(0.0, GRIP_LINE * X2 - lw * s)
    canvas = outline(canvas, add / 2 if add < 2 else add * 0.5)
    rr = np.array(canvas)[..., 3] > 128
    # the axis row: the middle of the body columns; the break point: where the body (not the splinters) begins
    mid_cols = range(int(canvas.width * 0.3), int(canvas.width * 0.5))
    axis_y = float(np.median([np.nonzero(rr[:, x])[0].mean() for x in mid_cols if rr[:, x].any()]))
    full = [x for x in range(canvas.width) if rr[:, x].sum() > 0.8 * PENCIL_W * X2]
    brk_x = float(full[0]) if full else pad
    canvas.save(f'{CUT}/p08b_front.png')
    print(f'front {name}: body {body_w:.0f}px, line {lw:.1f}px -> scale {s:.3f}, added outline {add:.1f}px (x2), size {canvas.size}, length/width {canvas.width / (PENCIL_W * X2):.2f}')
    return {'src': f'art/design/out/{name}.png', 'x2': X2, 'size': list(canvas.size), 'break': [round(brk_x, 1), round(axis_y, 1)],
            'center': [round(canvas.width / 2, 1), round(axis_y, 1)], 'wid': round(PENCIL_W * X2, 1)}


def bits(name):
    im = Image.open(f'{OUT}/{name}.png').convert('RGBA'); arr = np.array(im); a = arr[..., 3] > 100
    lab, n = ndimage.label(ndimage.binary_dilation(a, iterations=3))
    pieces = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        m = (lab[sl] == i + 1) & a[sl]
        if m.sum() < 400: continue
        px = arr[sl][m][:, :3].astype(int)
        green = ((px[:, 1] > px[:, 0] + 15) & (px[:, 1] > px[:, 2] + 8)).mean()
        neutral_dark = ((px.sum(1) < 330) & (px.max(1) - px.min(1) < 30)).mean()
        kind = 'skin' if green > 0.3 else 'graphite' if neutral_dark > 0.6 else 'wood'
        crop = im.crop((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop)); cm = Image.fromarray((m * 255).astype(np.uint8))
        crop.putalpha(Image.fromarray(np.minimum(np.array(crop.getchannel('A')), np.array(cm))))
        pieces.append((kind, crop, sl[1].start, sl[0].start))
    pieces.sort(key=lambda p: (p[3] // 150, p[2]))
    # sizes on screen (long side): splinters 22-34 px, green slivers 16-24, graphite crumbs 8-12; stored x2
    size = {'wood': [34, 22, 30, 26, 32, 24], 'skin': [22, 16, 24], 'graphite': [10, 12, 8, 11]}
    cnt = {'wood': 0, 'skin': 0, 'graphite': 0}; tiles = []
    for kind, crop, _, _ in pieces:
        L = size[kind][cnt[kind] % len(size[kind])] * X2; cnt[kind] += 1
        s = L / max(crop.size); t = crop.resize((max(2, round(crop.width * s)), max(2, round(crop.height * s))), Image.LANCZOS)
        c = Image.new('RGBA', (t.width + 6, t.height + 6), (0, 0, 0, 0)); c.alpha_composite(t, (3, 3))
        tiles.append((kind, outline(c, 1)))
    W = sum(t.width for _, t in tiles) + 4 * len(tiles); H = max(t.height for _, t in tiles)
    strip = Image.new('RGBA', (W, H), (0, 0, 0, 0)); x = 0; rects = []
    for kind, t in tiles:
        strip.alpha_composite(t, (x, 0)); rects.append({'kind': kind, 'rect': [x, 0, t.width, t.height]}); x += t.width + 4
    strip.save(f'{CUT}/p08b_bits.png')
    print(f'bits {name}: {len(rects)} pieces', {k: v for k, v in cnt.items()})
    return {'src': f'art/design/out/{name}.png', 'x2': X2, 'pieces': rects}


if __name__ == '__main__':
    fname, bname = sys.argv[1], sys.argv[2]
    path = f'{CUT}/seg08b_anchors.json'; AN = json.load(open(path, encoding='utf-8'))
    AN['front'] = front(fname); AN['bits'] = bits(bname)
    AN['note'] = AN['note'].split(' Pieces:')[0] + (' Pieces: front (p08b_front.png, x2: break = where the body begins at the torn end, '
                 'on the axis; center = the middle of the piece on the axis; wid = the body width) and bits (p08b_bits.png strip, x2).')
    json.dump(AN, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
