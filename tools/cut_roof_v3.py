"""Edit the roof riff, third version, from work/v3/manifest.json (written by tools/build_roof_v3.py).
Hard cuts one frame ahead of the beat; on the three crashes the frame flashes as a screen of paper-coloured dots for
three frames and the key plate slips a few pixels out of register and settles. Nothing on the other cuts.
usage: python tools/cut_roof_v3.py <out_dir>
"""
import json, os, sys
import numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
M = json.load(open(os.path.join(ROOT, 'work', 'v3', 'manifest.json')))
T0, T1, FPS, BEAT = M['T0'], M['T1'], M['FPS'], M['BEAT']
PAPER = np.array([245, 243, 237], np.float32); TEAL = np.array([33, 142, 163], np.float32)
_DOTS = {}


def light_pulse(img, cover):
    h, w = img.shape[:2]
    if (h, w) not in _DOTS:
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); a = np.deg2rad(15); p = 7.0
        u = (xx * np.cos(a) - yy * np.sin(a)) / p; v = (xx * np.sin(a) + yy * np.cos(a)) / p
        _DOTS[(h, w)] = np.hypot(u - np.round(u), v - np.round(v))
    r = np.sqrt(cover / np.pi)
    m = np.clip((r - _DOTS[(h, w)]) / 0.06 + 0.5, 0, 1)[..., None]
    return img * (1 - m) + PAPER * m


def slip(img, dx, dy, amt):
    lum = img.mean(2) / 255.0
    dark = np.clip((0.62 - lum) / 0.62, 0, 1) ** 1.2 * amt
    g = np.zeros_like(dark); h, w = dark.shape
    ys, yd = (slice(0, h - dy), slice(dy, h)) if dy >= 0 else (slice(-dy, h), slice(0, h + dy))
    xs, xd = (slice(0, w - dx), slice(dx, w)) if dx >= 0 else (slice(-dx, w), slice(0, w + dx))
    g[yd, xd] = dark[ys, xs]
    return img * (1 - g[..., None] * (1 - TEAL / 255.0))


def source(i):
    b = (i / FPS + 1 / FPS) / BEAT                    # one frame ahead of the sound
    shot = M['shots'][0]
    for s in M['shots']:
        if b >= s['b0']: shot = s
    if shot['src'] == 'main':
        return os.path.join(ROOT, 'work', 'v3', 'main', f'f_{i:05d}.png'), b
    d = os.path.join(ROOT, shot['dir'])
    n = len([f for f in os.listdir(d) if f.endswith('.png')])
    k = min(max(0, i - shot['start']), n - 1)
    return os.path.join(d, f'f_{k:05d}.png'), b


def frame(i):
    p, b = source(i)
    img = np.asarray(Image.open(p).convert('RGB')).astype(np.float32)
    for cb in M['crash']:
        k = (b - cb) * BEAT * FPS
        if 0 <= k < 3: img = light_pulse(img, [0.42, 0.22, 0.09][int(k)])
        if 0 <= k < 4: a = (4 - k) / 4; img = slip(img, int(round(6 * a)), int(round(-4 * a)), 0.6)
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(sys.argv[1], f'f_{i:05d}.png'))
    return os.path.basename(os.path.dirname(p))


if __name__ == '__main__':
    os.makedirs(sys.argv[1], exist_ok=True)
    n = int(round((T1 - T0) * FPS))
    with ProcessPoolExecutor(max_workers=6) as ex:
        srcs = list(ex.map(frame, range(n), chunksize=8))
    print(n, 'frames;', {s: srcs.count(s) for s in sorted(set(srcs))})
