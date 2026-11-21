"""Register segment 07's high-res drawings (r07c_*, 1024 x 1536, 1.5x the master's crop x 180.., y 0..) on the master r07b_sit:
the scale k (master px per drawing px) and offset (ox, oy) that make the body below the neck (master y 560..840: shoulders,
arms, card, knees, all above the sill) overlap best, by alpha IoU; also the card's white face in drawing px and the head box.
usage: python art/design/prompts/_reg_seg07.py <drawing.png> [...]
"""
import sys
import numpy as np
from PIL import Image

def load_master():
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    return np.asarray(Image.open(os.path.join(here, '..', '..', 'cut', 'r07b_sit.png')).convert('RGBA'))


def place(im, k, ox, oy):
    """the drawing on the master canvas at scale k, origin (ox, oy) (master px)"""
    w, h = round(im.width * k), round(im.height * k)
    c = Image.new('RGBA', (1536, 1024), (0, 0, 0, 0))
    c.paste(im.resize((w, h), Image.Resampling.LANCZOS), (round(ox), round(oy)))
    return np.asarray(c)


def card_rect(a):
    """the plain white card face: the biggest near-white opaque blob in the chest band (drawing px)"""
    rgb, al = a[..., :3].astype(int), a[..., 3]
    white = (al > 200) & (rgb.min(-1) > 238)
    H, W = white.shape
    band = np.zeros_like(white); band[int(H * 0.65):int(H * 0.80), int(W * 0.30):int(W * 0.56)] = True
    m = white & band
    from scipy import ndimage
    lab, n = ndimage.label(m)
    if n == 0: return None
    sizes = ndimage.sum(m, lab, range(1, n + 1)); i = int(np.argmax(sizes)) + 1
    ys, xs = np.nonzero(lab == i)
    return [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]


def main():
    ma = load_master()[..., 3] > 128
    band = slice(560, 840)
    for p in sys.argv[1:]:
        im = Image.open(p).convert('RGBA')
        best = None
        for k in (1 / 1.5 * f for f in (0.99, 0.995, 1.0, 1.005, 1.01)):
            for ox in range(170, 191, 2):
                for oy in range(-10, 11, 2):
                    a = place(im, k, ox, oy)[..., 3] > 128
                    inter = (a[band] & ma[band]).sum(); uni = (a[band] | ma[band]).sum()
                    iou = inter / uni
                    if best is None or iou > best[0]: best = (iou, k, ox, oy)
        iou, k, ox, oy = best
        # refine by 1 px
        for ox2 in range(ox - 2, ox + 3):
            for oy2 in range(oy - 2, oy + 3):
                a = place(im, k, ox2, oy2)[..., 3] > 128
                v = (a[band] & ma[band]).sum() / (a[band] | ma[band]).sum()
                if v > best[0]: best = (v, k, ox2, oy2)
        iou, k, ox, oy = best
        cr = card_rect(np.asarray(im))
        al = np.asarray(im)[..., 3] > 40
        ys, xs = np.nonzero(al[: int(im.height * 0.42)])
        print(f'{p}: iou {iou:.4f}  k {k:.5f} (1.5x -> {1 / k:.4f})  ox {ox}  oy {oy}  card {cr}  top {ys.min()}')


if __name__ == '__main__':
    main()
