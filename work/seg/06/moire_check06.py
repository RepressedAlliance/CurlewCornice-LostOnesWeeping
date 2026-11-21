"""Segment 06 moire check (same method as work/seg/03/moire_check.py): the low-frequency (1/8 res, box) frame difference of
patterned regions (16-dot print, stamp rules, bubble rows, the exit's dot screen and hatching) against plain paper in the same
shot, frame by frame, while the camera pushes or moves. A pattern that aliases under the camera's scaling crawls: its
low-frequency difference stays well above the plain paper's. Regions are screen rectangles (x0, x1, y0, y1) in 1920x1080.
usage: python work/seg/06/moire_check06.py <frames_dir>      (frames named g_NNNNNNN.png)"""
import sys, numpy as np
from PIL import Image
d = sys.argv[1]
def lo(f):
    im = Image.open(f'{d}/g_{f:07d}.png').convert('L')
    return np.asarray(im.resize((240, 135), Image.BOX), dtype=np.float32)
# (label, frames, {region: [(x0, x1, y0, y1), ...]}) -- windows chosen where nothing else moves through the regions
CHECKS = [
    ('spread push1 (after the last 正解, hand gone)', (1590, 1597), {
        '正解 stamps (16-dot k3.2 + rules)': [(716, 872, 512, 872), (1704, 1860, 512, 872)],
        'bubble rows': [(220, 660, 520, 860)],
        'plain paper': [(60, 880, 900, 1060), (1050, 1870, 900, 1060)]}),
    ('国語 push2 (stamps settled, before the cut to the slip)', (1750, 1775), {
        '不正解 stamps (16-dot k4.6 + rules)': [(1004, 1314, 476, 1060)],
        'question (16-dot k3.8)': [(1060, 1600, 250, 380)],
        'plain paper': [(1680, 1730, 480, 1060), (40, 1000, 420, 470)]}),
    ('face push (slip 16-dot under the face)', (1843, 1864), {
        'slip 16-dot lines': [(600, 1330, 860, 1060)],
        'plain field': [(80, 560, 200, 1000)]}),
    ('tail: the exit comes in (dot screen, hatching)', (1902, 1909), {
        'exit dot screen + hatching': [(200, 560, 1030, 1078), (1360, 1720, 1030, 1078)],
        'slip plain paper': [(700, 1300, 900, 990)]}),
]
for label, (f0, f1), regions in CHECKS:
    prev = None; acc = {k: [] for k in regions}
    for f in range(f0, f1 + 1):
        a = lo(f)
        if prev is not None:
            for k, rs in regions.items():
                acc[k].append(np.mean([np.abs(a[y0 // 8:y1 // 8, x0 // 8:x1 // 8] - prev[y0 // 8:y1 // 8, x0 // 8:x1 // 8]).mean() for x0, x1, y0, y1 in rs]))
        prev = a
    print(f'{label}, frames {f0}-{f1}:')
    for k, v in acc.items(): print(f'  {k}: mean {np.mean(v):.2f}  max {np.max(v):.2f} grey levels / frame (1/8 res)')
