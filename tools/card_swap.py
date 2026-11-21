"""Replace a drawn name card in a cut-out with the film's one card design (art/ref/cards/card_NN.png).

Every card in the film must be the same card: the props board design, changing only the name and the pencil
marks. Codex draws the card a little differently each time, so the drawn card is replaced: the card's paper
is found inside a rough box, its four corners are taken from the paper's outline, and the design is warped
onto that quad (perspective), then edged with a thin line in the drawing's own line colour.

usage: python tools/card_swap.py in.png out.png  card=NN box=x0,y0,x1,y1 [corners=x,y;x,y;x,y;x,y] [line=RRGGBB]
       [grow=1.5] [repeat card=.. box=.. for more cards]  (writes out.png and a preview next to it in _swap/)

Also writes out_keep.png: a mask of the pasted cards (and their edge line, minus whatever is kept in front).
The 3D cards use it in the graphite negative of the final chorus, where the people are printed in negative but
every card in the hall stays paper white.
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
jobs, cur = [], {}
for a in sys.argv[3:]:
    k, _, v = a.partition('=')
    if k == 'card' and cur: jobs.append(cur); cur = {}
    cur[k] = v
if cur: jobs.append(cur)

im = Image.open(src).convert('RGBA')
A = np.asarray(im).astype(np.float32) / 255.0
H, W = A.shape[:2]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def find_quad(box, grow):
    x0, y0, x1, y1 = box
    sub = A[y0:y1, x0:x1]
    rgb, al = sub[..., :3], sub[..., 3]
    mn, mx = rgb.min(2), rgb.max(2)
    paper = (mn > 0.80) & ((mx - mn) < 0.12) & (al > 0.8)
    lab, n = ndimage.label(paper)
    if n == 0:
        raise SystemExit(f'no card paper found in box {box}')
    sizes = ndimage.sum(paper, lab, range(1, n + 1))
    comp = ndimage.binary_fill_holes(lab == (int(np.argmax(sizes)) + 1))
    ys, xs = np.nonzero(comp)
    pts = np.stack([xs + x0, ys + y0], 1).astype(np.float64)
    # the card's outline: the convex hull simplified to four corners (Visvalingam: drop the vertex that
    # changes the area least), which works for upright, rotated and foreshortened cards alike
    from scipy.spatial import ConvexHull
    hull = pts[ConvexHull(pts).vertices].tolist()
    def tri(a, b, c): return abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2
    while len(hull) > 4:
        k = min(range(len(hull)), key=lambda i: tri(hull[i - 1], hull[i], hull[(i + 1) % len(hull)]))
        hull.pop(k)
    q = np.array(hull)
    # order: clockwise on screen, starting so that the first edge is a long edge and the upper of the two
    c = q.mean(0); q = q[np.argsort(np.arctan2(q[:, 1] - c[1], q[:, 0] - c[0]))]
    best = None
    for s0 in range(4):
        r = np.roll(q, -s0, 0)
        e0, e1 = np.linalg.norm(r[1] - r[0]), np.linalg.norm(r[2] - r[1])
        top = (r[0][1] + r[1][1]) / 2
        score = (e0 >= e1 * 0.98, -top)
        if best is None or score > best[0]: best = (score, r)
    q = best[1]
    c = q.mean(0)
    q = c + (q - c) * (1 + grow / max(4.0, np.linalg.norm(q - c, axis=1).mean()))
    return q


def homography(src_pts, dst_pts):
    A_ = []
    for (x, y), (u, v) in zip(src_pts, dst_pts):
        A_.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u]); A_.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, vt = np.linalg.svd(np.array(A_))
    Hm = vt[-1].reshape(3, 3)
    return Hm / Hm[2, 2]


def bilinear(img, x, y):
    h, w = img.shape[:2]
    x = np.clip(x, 0, w - 1.001); y = np.clip(y, 0, h - 1.001)
    x0 = np.floor(x).astype(int); y0 = np.floor(y).astype(int); fx = (x - x0)[..., None]; fy = (y - y0)[..., None]
    return (img[y0, x0] * (1 - fx) * (1 - fy) + img[y0, x0 + 1] * fx * (1 - fy) + img[y0 + 1, x0] * (1 - fx) * fy + img[y0 + 1, x0 + 1] * fx * fy)


out = A.copy()
quads = []
cardm = np.zeros((H, W), np.float32)   # where the pasted cards are
protect = np.zeros((H, W), bool)     # pixels kept in front of a card: no edge line over them
for job in jobs:
    grow = float(job.get('grow', 1.5))
    if 'corners' in job:
        q = np.array([[float(t) for t in p.split(',')] for p in job['corners'].split(';')])
    else:
        q = find_quad([int(t) for t in job['box'].split(',')], grow)
    quads.append(q)
    cname = job['card']; cfile = f"card_{int(cname):02d}.png" if cname.isdigit() else f"{cname}.png"
    card = Image.open(os.path.join(root, 'art', 'ref', 'cards', cfile)).convert('RGBA')
    # pre-shrink the design to about twice the target size, so the warp does not alias
    side = max(np.linalg.norm(q[1] - q[0]), np.linalg.norm(q[2] - q[3]))
    cw = min(card.width, max(24, int(side * 2))); card = card.resize((cw, int(cw / 1.5)), Image.LANCZOS)
    C = np.asarray(card).astype(np.float32) / 255.0
    ch, cwid = C.shape[:2]
    Hm = homography(q, [(0, 0), (cwid, 0), (cwid, ch), (0, ch)])     # target -> card
    xa, ya = int(np.floor(q[:, 0].min())) - 1, int(np.floor(q[:, 1].min())) - 1
    xb, yb = int(np.ceil(q[:, 0].max())) + 2, int(np.ceil(q[:, 1].max())) + 2
    xa, ya, xb, yb = max(0, xa), max(0, ya), min(W, xb), min(H, yb)
    gy, gx = np.mgrid[ya:yb, xa:xb].astype(np.float64)
    # 3x3 supersampling of each target pixel
    acc = np.zeros((yb - ya, xb - xa, 4), np.float32)
    for oy in (-1 / 3, 0, 1 / 3):
        for ox in (-1 / 3, 0, 1 / 3):
            X, Y = gx + 0.5 + ox, gy + 0.5 + oy
            den = Hm[2, 0] * X + Hm[2, 1] * Y + Hm[2, 2]
            u = (Hm[0, 0] * X + Hm[0, 1] * Y + Hm[0, 2]) / den; v = (Hm[1, 0] * X + Hm[1, 1] * Y + Hm[1, 2]) / den
            inside = ((u >= 0) & (u <= cwid - 1) & (v >= 0) & (v <= ch - 1))[..., None]
            acc += np.where(inside, bilinear(C, u, v), 0)
    acc /= 9.0
    a = acc[..., 3:4]
    region = out[ya:yb, xa:xb].copy()
    orig = A[ya:yb, xa:xb]
    if 'paper' in job:
        pc = np.array([int(job['paper'][i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0
        acc[..., :3] = acc[..., :3] * pc
    if job.get('fiber') == '1':
        rr = np.random.default_rng(7); fib = rr.random(acc.shape[:2]).astype(np.float32)
        acc[..., :3] = acc[..., :3] * (1 - 0.035 * (fib > 0.985)[..., None]) * (1 - 0.012 * fib[..., None])
    region[..., :3] = acc[..., :3] * a + region[..., :3] * (1 - a)   # card colour is not premultiplied
    region[..., 3:4] = np.maximum(region[..., 3:4], a)
    # whatever reaches over the card from outside it (fingers, the lanyard clip) stays in front: pixels that
    # are neither card paper nor teal print, in pieces that continue outside the card's outline
    o_rgb = orig[..., :3]; omn, omx = o_rgb.min(2), o_rgb.max(2)
    sat = (omx - omn) / np.maximum(omx, 1e-3)
    r_, g_, b_ = o_rgb[..., 0], o_rgb[..., 1], o_rgb[..., 2]
    tealish = (b_ > r_ + 0.05) & (g_ > r_ + 0.05) & (sat > 0.12)
    paperish = (omn > 0.78) & (sat < 0.14)
    foreign = (~tealish) & (~paperish) & (orig[..., 3] > 0.5)
    lab, n = ndimage.label(foreign)
    if n:
        inner = np.array([q.mean(0) + (p - q.mean(0)) * 0.9 for p in q])
        yy, xx = np.mgrid[ya:yb, xa:xb]; px, py = xx + 0.5, yy + 0.5
        sides = []
        for i in range(4):          # inside a convex quad = on the same side of all four edges
            (ax_, ay_), (bx_, by_) = inner[i], inner[(i + 1) % 4]
            sides.append((bx_ - ax_) * (py - ay_) - (by_ - ay_) * (px - ax_))
        sides = np.stack(sides)
        inside = (sides >= 0).all(0) | (sides <= 0).all(0)
        keep = np.zeros_like(foreign)
        skin = (r_ > 0.55) & (r_ > b_ + 0.06) & (r_ >= g_)          # warm light pixels: a finger, not a printed mark
        for lbl in range(1, n + 1):
            m = lab == lbl
            if (m & ~inside).any() and (m & inside).any() and (skin & m).sum() > 0.25 * m.sum(): keep |= m
        region[keep] = orig[keep]
        protect[ya:yb, xa:xb] |= keep
        cardm[ya:yb, xa:xb] = np.maximum(cardm[ya:yb, xa:xb], a[..., 0] * (~keep))
    else:
        cardm[ya:yb, xa:xb] = np.maximum(cardm[ya:yb, xa:xb], a[..., 0])
    out[ya:yb, xa:xb] = region

res = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA')
# the drawing's own line round each card's edge, never over what reaches in front of the card
edge = Image.new('RGBA', res.size, (0, 0, 0, 0)); d = ImageDraw.Draw(edge)
for job, q in zip(jobs, quads):
    col = job.get('line', '2b2d33'); col = tuple(int(col[i:i + 2], 16) for i in (0, 2, 4))
    lw = max(1, int(round(float(job.get('lw', 1.4)))))
    pts = [tuple(p) for p in q] + [tuple(q[0])]
    d.line(pts, fill=col + (255,), width=lw, joint='curve')
E = np.asarray(edge).copy(); E[protect, 3] = 0
res = Image.alpha_composite(res, Image.fromarray(E, 'RGBA'))
res.save(dst)
cardm = np.maximum(cardm, E[..., 3].astype(np.float32) / 255.0)
Image.fromarray((np.clip(cardm, 0, 1) * 255 + 0.5).astype(np.uint8), 'L').save(os.path.splitext(dst)[0] + '_keep.png')
pv = os.path.join(os.path.dirname(os.path.abspath(dst)), '_swap'); os.makedirs(pv, exist_ok=True)
for i, q in enumerate(quads):
    x0, y0 = max(0, int(q[:, 0].min()) - 40), max(0, int(q[:, 1].min()) - 40)
    x1, y1 = min(W, int(q[:, 0].max()) + 40), min(H, int(q[:, 1].max()) + 40)
    before = im.crop((x0, y0, x1, y1)); after = res.crop((x0, y0, x1, y1)); s = 4 if (x1 - x0) < 200 else 2
    pair = Image.new('RGBA', ((x1 - x0) * 2 * s + 10, (y1 - y0) * s), (128, 128, 128, 255))
    pair.alpha_composite(before.resize(((x1 - x0) * s, (y1 - y0) * s), Image.NEAREST), (0, 0))
    pair.alpha_composite(after.resize(((x1 - x0) * s, (y1 - y0) * s), Image.NEAREST), ((x1 - x0) * s + 10, 0))
    pair.convert('RGB').save(os.path.join(pv, os.path.splitext(os.path.basename(dst))[0] + f'_{i}.png'))
print('swapped', len(quads), 'card(s) ->', dst, [np.round(q).astype(int).tolist() for q in quads])
