"""Segment 13 full cut: prepare the round-f drawings (art/design/prompts/_make_seg13f.py) for the page.

- h13f_slap, h13f_open: copied as they are (no eraser in them).
- h13f_erase, h13f_hover: the eraser Codex drew (found from its teal sleeve) is removed and the page draws the canon eraser in
  its place. The sample's cut left a white ragged rim along the thumb and index finger (review must_fix): now every light,
  unsaturated pixel near the removed eraser goes too (the eraser's white rubber and its anti-aliased edge), small islands are
  dropped, and the new cut edge gets a one-pixel soft alpha ramp instead of a stair-stepped edge.
- r13f_face, r13f_face_up: the blank sleeve of the eraser in her hand is measured so the page can print 読取機用 on it.
- p13f_guitar: copied.
Writes art/cut/seg13f_anchors.json: per drawing { sleeve: {c, u, len, wid}, end } as work/seg/13/cut.py did, plus for the
hands without an eraser the hand's skin centroid ('palm') and for h13f_open the pinch point ('pinch').
usage: python work/seg/13/cut13f.py [names...]
"""
import json, os, sys, shutil
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, 'art', 'design', 'out')
CUT = os.path.join(ROOT, 'art', 'cut')
ANP = os.path.join(CUT, 'seg13f_anchors.json')
sys.path.insert(0, os.path.dirname(__file__))
from cut import sleeve  # noqa: E402


def dehalo(im):
    """Codex sometimes paints a soft glow around the figure into the alpha (h13f_open, r13f_face_up): keep only the solid figure
    and its 2-pixel anti-aliased edge, drop the faint halo beyond it (it showed as a pale rim on the dark negative)."""
    a = im[..., 3]
    solid = a >= 200
    lab, n = ndimage.label(solid)
    if n > 1:   # drop tiny solid specks inside the halo
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        solid = np.isin(lab, 1 + np.nonzero(sizes >= 400)[0])
    keep = ndimage.binary_dilation(solid, iterations=2)
    out = im.copy(); out[~keep, 3] = 0
    # the edge ring: anti-aliased pixels whose colour is the glow (light, low saturation) and fainter than half are dropped too
    ring = keep & ~solid
    r, g, b = (out[..., i].astype(int) for i in range(3))
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    glow = ring & (mx > 170) & ((mx - mn) < 60) & (a < 128)
    out[glow, 3] = 0
    return out


def rgba(name):
    return dehalo(np.array(Image.open(os.path.join(OUT, name + '.png')).convert('RGBA')))


def skin_of(im):
    r, g, b, a = (im[..., i].astype(int) for i in range(4))
    return (a > 100) & (r > 150) & (r > g + 8) & (g > b + 4) & (r - b > 28)


def cut_hand(name):
    im = rgba(name)
    S = sleeve(im)
    c, u = np.array(S['c']), np.array(S['u']); v = np.array([-u[1], u[0]])
    L = S['len'] * 1.5
    hw = S['wid'] / 2 + 6
    H, W = im.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
    s = (xx - c[0]) * u[0] + (yy - c[1]) * u[1]; t = (xx - c[0]) * v[0] + (yy - c[1]) * v[1]
    half = L / 2 - hw
    sc = np.clip(s, -half, half)
    cap = (s - sc) ** 2 + t ** 2 <= (hw + 4) ** 2
    r, g, b, a = (im[..., i].astype(int) for i in range(4))
    skin = skin_of(im)
    near = ndimage.binary_dilation(skin, iterations=5)
    dark = (a > 100) & (np.maximum(np.maximum(r, g), b) < 110) & (np.abs(r - b) < 25)
    keep = skin | (dark & near)
    remove = cap & ~keep
    # the rim: light, unsaturated pixels (white rubber, grey graphite on it, their blend into skin) next to what was removed
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    pale = (mx > 150) & ((mx - mn) < 46)
    teal = (b > r + 30) & (g > r + 20)
    for _ in range(4):
        zone = ndimage.binary_dilation(remove, iterations=3)
        add = zone & (pale | teal) & (a > 0) & ~remove
        if not add.any(): break
        remove |= add
    out = im.copy(); out[remove, 3] = 0
    lab, n = ndimage.label(out[..., 3] > 0)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = 1 + int(np.argmax(sizes))
        out[(lab != big) & (lab > 0), 3] = 0
    # the new cut edge is redrawn as a clean ink line (the sample's cut left a ragged rim of grey outline pixels and specks):
    # inside the cut zone the hand's mask is closed, opened and smoothed; the gaps are filled with the nearest kept colour;
    # a 2.5-pixel band along the new edge is painted in the drawing's own line colour, anti-aliased
    cutzone = ndimage.binary_dilation(remove, iterations=6)
    m0 = out[..., 3] > 100
    mz = ndimage.binary_opening(ndimage.binary_closing(m0, iterations=3), iterations=2)
    mz = ndimage.gaussian_filter(mz.astype(float), 1.3) > 0.5
    M = np.where(cutzone, mz, m0)
    lab, n = ndimage.label(M)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); M = lab == 1 + int(np.argmax(sizes))
    _, (iy, ix) = ndimage.distance_transform_edt(~(m0 & ~(dark & cutzone)), return_indices=True)
    fill = cutzone & M
    for ch in range(3): out[..., ch][fill] = im[..., ch][iy[fill], ix[fill]]
    inside = ndimage.distance_transform_edt(M)
    line = dark & (a > 200)
    lc = np.median(im[line][:, :3], axis=0).astype(np.uint8) if line.any() else np.array([30, 26, 28], np.uint8)
    band = cutzone & M & (inside <= 3.0)
    w = np.clip(3.2 - inside, 0, 1)
    for ch in range(3):
        o = out[..., ch].astype(float); o[band] = o[band] * (1 - w[band]) + lc[ch] * w[band]; out[..., ch] = o.astype(np.uint8)
    soft = ndimage.gaussian_filter(M.astype(float), 0.7)
    al = out[..., 3].astype(float)
    al[cutzone] = 255 * np.clip((soft[cutzone] - 0.2) / 0.6, 0, 1) * (M[cutzone] | (soft[cutzone] > 0.2))
    al[~M & ~cutzone] = al[~M & ~cutzone]
    out[..., 3] = al.astype(np.uint8)
    Image.fromarray(out).save(os.path.join(CUT, name + '.png'))
    end = (c + u * L / 2).tolist()
    return {'sleeve': S, 'end': end, 'eraserLen': L, 'removed': int(remove.sum())}


def cut_hand_at_border(name):
    """(full cut, second way) Keep the fingers whole: the eraser Codex drew is cut off only ABOVE its sleeve's lower border
    (the sleeve and the far end go, the end she pinches stays with her fingers on it, untouched). The page draws the canon
    eraser underneath with its sleeve border on the same line, so no finger edge is ever re-cut."""
    im = rgba(name)
    S = sleeve(im)
    c, u = np.array(S['c']), np.array(S['u']); v = np.array([-u[1], u[0]])
    H, W = im.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
    s = (xx - c[0]) * u[0] + (yy - c[1]) * u[1]; t = (xx - c[0]) * v[0] + (yy - c[1]) * v[1]
    L = S['len'] * 1.5; hw = S['wid'] / 2 + 8
    half = L / 2 - hw; sc = np.clip(s, -half, half)
    cap = (s - sc) ** 2 + t ** 2 <= (hw + 4) ** 2
    border = S['len'] / 2                       # the sleeve's lower border (towards her hand)
    r, g, b, a = (im[..., i].astype(int) for i in range(4))
    skin = skin_of(im)
    hand = ndimage.binary_fill_holes(ndimage.binary_closing(skin, iterations=4))
    hand = ndimage.binary_dilation(hand, iterations=3)
    remove = cap & (s < border - 1) & ~hand
    out = im.copy(); out[remove, 3] = 0
    lab, n = ndimage.label(out[..., 3] > 0)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = 1 + int(np.argmax(sizes))
        out[(lab != big) & (lab > 0), 3] = 0
    # a clean, slightly soft straight edge along the cut across the eraser
    edge = cap & ~hand & (np.abs(s - (border - 1)) < 1.5) & (out[..., 3] > 0)
    out[edge, 3] = (out[edge, 3] * 0.5).astype(np.uint8)
    Image.fromarray(out).save(os.path.join(CUT, name + '.png'))
    B = (c + u * border).tolist()
    return {'sleeve': S, 'border': B, 'endLen': float(L / 2 - border), 'removed': int(remove.sum())}


def plain_hand(name):
    im = rgba(name)
    Image.fromarray(im).save(os.path.join(CUT, name + '.png'))
    sk = skin_of(im); ys, xs = np.nonzero(sk)
    rec = {'palm': [float(xs.mean()), float(ys.mean())], 'skinTop': float(ys.min()), 'skinBox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}
    if name in ('h13f_open', 'h13g_open'):
        # the pinch: the topmost-left skin region (thumb and index tips meet at the upper left of the hand)
        top = ys < ys.min() + (90 if name == 'h13f_open' else 150)
        rec['pinch'] = [float(xs[top].min() + 10), float(ys[top].mean())]
    return rec


def face(name):
    """The eraser lies across her fingers at the bottom edge: its blank sleeve's paper-white inside is found (largest pale
    component in the lower middle), and the fingers lying over it are written as an overlay (<name>_fingers.png), so the page
    can print the sleeve and put the fingers back on top."""
    im = rgba(name)
    Image.fromarray(im).save(os.path.join(CUT, name + '.png'))
    r, g, b, a = (im[..., i].astype(int) for i in range(4))
    H, W = a.shape
    box = np.zeros((H, W), bool); box[900:, 400:1000] = True
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    pale = box & (a > 200) & (mn > 215) & ((mx - mn) < 22)
    lab, n = ndimage.label(pale)
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = 1 + int(np.argmax(sizes))
    ys, xs = np.nonzero(lab == big)
    x0, x1, y0, y1 = int(np.percentile(xs, 0.5)), int(np.percentile(xs, 99.5)), int(np.percentile(ys, 0.5)), int(np.percentile(ys, 99.5))
    rect = [x0, y0, x1 - x0 + 1, y1 - y0 + 1]
    sk = skin_of(im)
    dark = (a > 100) & (mx < 120)
    fing = (sk | (dark & ndimage.binary_dilation(sk, iterations=4)))
    zone = np.zeros((H, W), bool); zone[y0 - 6:y1 + 7, x0 - 6:x1 + 7] = True
    fing = ndimage.binary_closing(fing & zone, iterations=1)
    ov = np.zeros_like(im); ov[fing] = im[fing]
    Image.fromarray(ov).save(os.path.join(CUT, name + '_fingers.png'))
    return {'sleeveRect': rect}


if __name__ == '__main__':
    names = sys.argv[1:] or ['h13f_slap', 'h13f_open', 'h13f_erase', 'h13f_hover', 'r13f_face', 'r13f_face_up', 'p13f_guitar']
    AN = json.load(open(ANP)) if os.path.exists(ANP) else {}
    for n in names:
        if not os.path.exists(os.path.join(OUT, n + '.png')): print('missing', n); continue
        if n.startswith('p13f'):
            shutil.copyfile(os.path.join(OUT, n + '.png'), os.path.join(CUT, n + '.png')); AN[n] = {}
        elif n in ('h13f_slap', 'h13f_open', 'h13g_slap', 'h13g_open'): AN[n] = plain_hand(n)
        elif n.startswith('h13'): AN[n] = cut_hand_at_border(n)
        else: AN[n] = face(n)
        print(n, json.dumps(AN[n]))
    json.dump(AN, open(ANP, 'w'), indent=1)
