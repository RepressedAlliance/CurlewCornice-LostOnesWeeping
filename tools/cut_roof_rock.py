"""Edit the roof riff direction test (1:38.13-1:49.98, 8 bars at 162 BPM) from frame sequences rendered over the same
window at 30 fps: the 3D wide shot and the three close-ups. Hard cuts on the beat (one frame ahead of the sound),
faster toward the end; on the three crashes a one-frame negative flash, then the plates slip out of register for a
few frames and settle; a smaller slip on every cut.

usage: python tools/cut_roof_rock.py <out_dir>    (reads work/seq/roof_rock1, work/seq/ins_face|hand|feet)
"""
import os, sys
import numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
T0, T1, FPS, BEAT = 98.13, 109.98, 30, 60 / 162
MODE = os.environ.get('ROCK_MODE', 'day')
SRC = {'wide': 'work/seq/roof_rock2', 'face': 'work/seq/ins_face', 'hand': 'work/seq/ins_hand', 'feet': 'work/seq/ins_feet'}
if MODE == 'night':
    SRC = {'wide': 'work/seq/roof_night1', 'face': 'work/seq/insn_face', 'face2': 'work/seq/insn_face2', 'hand': 'work/seq/insn_hand', 'feet': 'work/seq/insn_feet'}
# (start beat, source); a segment runs to the next start
CUTS = [(0, 'wide'), (8, 'hand'), (10, 'face'), (12, 'wide'), (24, 'face'), (25, 'wide'), (26, 'hand'), (27, 'feet'),
        (28, 'wide'), (28.5, 'face'), (29, 'hand'), (29.5, 'feet'), (30, 'wide'), (30.5, 'face'), (31, 'wide')]
if MODE == 'night':
    # cuts on the bar lines; the only burst is the last bar. The face is never the same drawing twice in a row
    CUTS = [(0, 'wide'), (8, 'hand'), (10, 'face'), (12, 'wide'), (24, 'face2'), (26, 'hand'), (27, 'feet'),
            (28, 'wide'), (29, 'face'), (29.5, 'hand'), (30, 'feet'), (30.5, 'face2'), (31, 'wide')]
CRASH = [0, 16, 31]
PAPER = np.array([245, 243, 237], np.float32); GRAPH = np.array([35, 35, 39], np.float32); TEAL = np.array([33, 142, 163], np.float32)


def source_at(b):
    s = CUTS[0][1]
    for b0, k in CUTS:
        if b >= b0: s = k
    return s


def slip(img, dx, dy, amt):
    """the key plate printed a second time, off register, in teal: a ghost of the dark lines shifted by (dx, dy)"""
    lum = img.mean(2) / 255.0
    dark = np.clip((0.62 - lum) / 0.62, 0, 1) ** 1.2 * amt
    g = np.zeros_like(dark); h, w = dark.shape
    ys, yd = (slice(0, h - dy), slice(dy, h)) if dy >= 0 else (slice(-dy, h), slice(0, h + dy))
    xs, xd = (slice(0, w - dx), slice(dx, w)) if dx >= 0 else (slice(-dx, w), slice(0, w + dx))
    g[yd, xd] = dark[ys, xs]
    mul = 1 - g[..., None] * (1 - TEAL / 255.0)
    return img * mul


def negative(img):
    lum = img.mean(2, keepdims=True) / 255.0
    return GRAPH + (PAPER - GRAPH) * (1 - lum) ** 1.1


_DOTS = {}
def light_pulse(img, cover):
    """a flash printed as light: a screen of paper-coloured dots over the whole frame, the dot size set by cover"""
    h, w = img.shape[:2]
    if (h, w) not in _DOTS:
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); a = np.deg2rad(15); p = 7.0
        u = (xx * np.cos(a) - yy * np.sin(a)) / p; v = (xx * np.sin(a) + yy * np.cos(a)) / p
        _DOTS[(h, w)] = np.hypot(u - np.round(u), v - np.round(v))
    r = np.sqrt(cover / np.pi)
    m = np.clip((r - _DOTS[(h, w)]) / 0.06 + 0.5, 0, 1)[..., None]
    return img * (1 - m) + PAPER * m


def frame(i):
    out_dir = sys.argv[1]
    t = T0 + i / FPS
    b = (t + 1 / FPS - T0) / BEAT                      # cuts land one frame ahead of the sound, like the renders
    src = source_at(b)
    img = np.asarray(Image.open(os.path.join(ROOT, SRC[src], f'f_{i:05d}.png')).convert('RGB')).astype(np.float32)
    fb = b * BEAT * FPS                                 # frames since T0 (beat-aligned)
    for cb in CRASH:
        k = fb - cb * BEAT * FPS                         # frames since the crash
        if MODE == 'night':
            if 0 <= k < 3: img = light_pulse(img, [0.42, 0.22, 0.09][int(k)])
            if 0 <= k < 4: a = (4 - k) / 4; img = slip(img, int(round(6 * a)), int(round(-4 * a)), 0.6)
        else:
            if 0 <= k < 1: img = negative(img)
            elif 1 <= k < 6:
                a = (6 - k) / 5; img = slip(img, int(round(22 * a)), int(round(-14 * a)), 0.9)
    # every cut: a small slip for two frames (day look only)
    for b0, _ in CUTS[1:]:
        if MODE == 'night' or b0 in CRASH: continue
        k = fb - b0 * BEAT * FPS
        if 0 <= k < 2: img = slip(img, 10 if k < 1 else 5, -6 if k < 1 else -3, 0.7)
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(out_dir, f'f_{i:05d}.png'))
    return src


if __name__ == '__main__':
    os.makedirs(sys.argv[1], exist_ok=True)
    n = int(round((T1 - T0) * FPS))
    with ProcessPoolExecutor() as ex:
        srcs = list(ex.map(frame, range(n), chunksize=8))
    print(n, 'frames;', {s: srcs.count(s) for s in set(srcs)})
