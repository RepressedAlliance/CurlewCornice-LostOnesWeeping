"""Her card as drawn in seg 14's drawings: the four corners measured on the paper, and a mask of the paper the face may cover.
(docs/卡面状态.md; unify-card task 2026-11-21: "贴到人物图里画的卡上时，按实测四角做透视并裁在卡内".)

For each drawing with a card (art/cut/seg14f_anchors.json rin.*.card, three rough corners TL/TR/BL):
  1. paper = opaque, bright, low-saturation pixels (the card's paper white) plus the light teal print on it; every paper
     component that lies inside the rough quad (grown 14 px; the rough corners were measured on the paper inside the drawn inner rule, the card's edge is the outer black outline) is kept and its holes filled (the drawn ovals / grid lines), so the
     region is the whole paper inside the drawn black outline, without the clasp (its own outline separates it) and without
     the fist (skin is not paper).
  2. each side: the region's boundary pixels from 5 px inside to 16 px outside the rough (inner) side, its middle 70% (the rounded corners left out), a
     total-least-squares line refitted twice with the points over 1.2 px from it dropped (the clasp and the fist cut into the
     top / bottom side; they fall away as outliers).
  3. the corners: neighbouring sides intersected (TL, TR, BR, BL). A corner under the fist is found the same way.
  4. the mask: the paper region, 1 px eroded, minus a 3 px ring round skin, feathered 1 px; saved as a PNG whose alpha channel is the mask the
     drawing's size: art/cut/seg14f_cardmask_<name>.png.
Writes art/cut/seg14f_cardquads.json {name: {quad: [[x,y] x4 TL,TR,BR,BL], mask: file, fit: residuals}} and a check sheet
work/seg/14/card_quads_check.png. usage: python work/seg/14/card_quads.py
"""
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

AN = json.load(open('art/cut/seg14f_anchors.json', encoding='utf-8'))['rin']
NAMES = [n for n in ['R14f_down2', 'R14f_see', 'R14f_askL3', 'R14f_askR', 'R14f_grip', 'R14f_grip2', 'R14f_yank'] if 'card' in AN[n]]
out, tiles = {}, []


def line_fit(pts):
    c = pts.mean(0); u, s, vt = np.linalg.svd(pts - c); d = vt[0]; nrm = np.array([-d[1], d[0]])
    return c, d, nrm


def inside_quad(q, X, Y, grow):
    # q: 4 corners in order; point inside if on the inner side of each edge (grown)
    ok = np.ones_like(X, bool)
    cx, cy = q.mean(0)
    for i in range(4):
        a, b = q[i], q[(i + 1) % 4]; e = b - a; n = np.array([-e[1], e[0]]) / np.hypot(*e)
        if np.dot([cx - a[0], cy - a[1]], n) < 0: n = -n
        ok &= ((X - a[0]) * n[0] + (Y - a[1]) * n[1]) > -grow
    return ok


for name in NAMES:
    im = np.array(Image.open(f'art/cut/{name}.png').convert('RGBA')).astype(int)
    r, g, b, a = [im[..., i] for i in range(4)]
    H, W = a.shape
    tl, tr, bl = [np.array(p, float) for p in AN[name]['card']]
    br = tr + bl - tl
    rough = np.array([tl, tr, br, bl])
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    op = a > 128
    paper = op & (((mn > 205) & (mx - mn < 30)) | ((b > 170) & (g > 170) & (b - r > 15) & (r > 120)))
    Y, X = np.mgrid[0:H, 0:W]
    inq = inside_quad(rough, X, Y, 14)
    lab, k = ndimage.label(paper)
    keep, other = np.zeros_like(paper), np.zeros_like(paper)
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        comp = lab[sl] == i
        if comp.sum() < 30: continue
        frac = inq[sl][comp].mean()
        if frac > 0.97: keep[sl] |= comp
        elif frac > 0: other[sl] |= comp          # the clasp's white (its lower half lies on the card)
    region = ndimage.binary_fill_holes(ndimage.binary_closing(keep, iterations=3)) & inq
    region &= ~ndimage.binary_dilation(other, iterations=3)
    # boundary
    er = ndimage.binary_erosion(region)
    by, bx = np.nonzero(region & ~er)
    B = np.stack([bx, by], 1).astype(float)
    lines, fit = [], []
    for i in range(4):
        p0, p1 = rough[i], rough[(i + 1) % 4]
        e = p1 - p0; L = np.hypot(*e); d = e / L; n = np.array([-d[1], d[0]])
        cq = rough.mean(0); n = n if np.dot(cq - p0, n) < 0 else -n          # n points out of the card
        rel = B - p0; s = rel @ d / L; sd = rel @ n
        P = B[(sd > -5) & (sd < 16) & (s > 0.15) & (s < 0.85)]
        for _ in range(3):
            c, dd, nn = line_fit(P); res = np.abs((P - c) @ nn)
            P2 = P[res < max(1.2, np.percentile(res, 60))]
            if len(P2) < 10: break
            P = P2
        c, dd, nn = line_fit(P); res = np.abs((P - c) @ nn)
        lines.append((c, dd)); fit.append([int(len(P)), round(float(res.mean()), 2)])

    def isect(l1, l2):
        (c1, d1), (c2, d2) = l1, l2
        A = np.array([d1, -d2]).T; t = np.linalg.solve(A, c2 - c1); return c1 + t[0] * d1
    # sides: 0 top (TL-TR), 1 right (TR-BR), 2 bottom (BR-BL), 3 left (BL-TL)
    quad = [isect(lines[3], lines[0]), isect(lines[0], lines[1]), isect(lines[1], lines[2]), isect(lines[2], lines[3])]
    quad = [[round(float(p[0]), 2), round(float(p[1]), 2)] for p in quad]
    # mask
    skin = op & (r > 170) & (r - b > 22) & (r - g > 6)
    near = ndimage.binary_dilation(skin, iterations=3)
    m = ndimage.binary_erosion(region, iterations=1) & ~near
    mimg = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    mfile = f'seg14f_cardmask_{name}.png'
    rgba = Image.new('RGBA', (W, H), (255, 255, 255, 0)); rgba.putalpha(mimg)      # the page reads the mask's ALPHA (destination-in)
    rgba.save(f'art/cut/{mfile}')
    w_top = np.hypot(*(np.array(quad[1]) - quad[0])); h_left = np.hypot(*(np.array(quad[3]) - quad[0]))
    out[name] = {'quad': quad, 'mask': mfile, 'fit': fit, 'aspect': round(float(w_top / h_left), 3)}
    print(name, out[name])
    # check tile: the drawing, the mask tinted, the quad
    xs = [p[0] for p in quad]; ys = [p[1] for p in quad]
    x0, y0, x1, y1 = int(min(xs)) - 30, int(min(ys)) - 40, int(max(xs)) + 30, int(max(ys)) + 30
    base = Image.new('RGBA', (W, H), (60, 60, 60, 255)); base.alpha_composite(Image.open(f'art/cut/{name}.png').convert('RGBA'))
    tint = Image.new('RGBA', (W, H), (255, 0, 200, 0)); tint.putalpha(mimg.point(lambda v: v * 90 // 255))
    base.alpha_composite(tint)
    S = 3
    t = base.crop((x0, y0, x1, y1)).resize(((x1 - x0) * S, (y1 - y0) * S), Image.NEAREST)
    d = ImageDraw.Draw(t)
    pts = [((p[0] - x0) * S, (p[1] - y0) * S) for p in quad]
    d.line(pts + [pts[0]], fill=(0, 255, 0, 255), width=1)
    d.text((4, 4), name, fill=(255, 255, 0, 255))
    tiles.append(t)

json.dump(out, open('art/cut/seg14f_cardquads.json', 'w', encoding='utf-8'), indent=1)
Wt = max(t.width for t in tiles); Ht = sum(t.height for t in tiles[:4])
cols = [tiles[:4], tiles[4:]]
sheet = Image.new('RGBA', (sum(max(t.width for t in c) for c in cols if c), max(sum(t.height for t in c) for c in cols if c)), (0, 0, 0, 255))
x = 0
for c in cols:
    y = 0
    for t in c: sheet.paste(t, (x, y)); y += t.height
    x += max(t.width for t in c)
sheet.save('work/seg/14/card_quads_check.png')
