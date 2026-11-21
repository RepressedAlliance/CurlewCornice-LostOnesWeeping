"""Red scan: find red in frames, a video or a folder of art (the film uses no red; docs/制作约定.md, 二).

usage:
  python tools/red_scan.py <frames_dir | video | art_dir> [--every N] [--out DIR] [--stats]
         [--hue-lo 340] [--hue-hi 20] [--sat 0.55] [--val 0.30] [--min-area 0.0001] [--workers 2]

A pixel counts as red when its hue is in [hue-lo, 360) or [0, hue-hi] degrees and both its saturation and its value
(HSV, 0..1) are at least --sat and --val. Red pixels are grouped into connected patches; a patch is reported when its
area is at least --min-area of the image area (a fraction; 0.0001 of 1920x1080 is about 207 px, a 15 x 15 px mark). Fully transparent
pixels of cut-out art (alpha < 128) are ignored.

Thresholds were set on the two approved demos (work/a2v4/v15, work/c1a/v15), which come out clean, and on art/cut:
in the demos the most saturated pixel in the red hue range is 0.553 (her open mouth; skin and blush are far paler,
99th percentile 0.46); open mouths in art/cut reach a patch mean of 0.51 (rface_up2, rlow3_up_k_a). A real red (a
stamp, a red pen, a muted brick red 170,70,70) is 0.59 and up, so the line is 0.55. Magenta-pink (hue < 340) is not red.

Writes to --out (default work/infra/red_scan/<name>): report.json (every flagged image: index, area, boxes) and, for
each flagged image, <name>_red.png: the image at half size with the red patches outlined in cyan and labelled.
--stats also prints how saturated the pixels in the red hue range are (to re-tune thresholds).
Exit code: 0 clean, 1 red found, 2 bad input.
"""
import argparse, json, os, subprocess, sys
from concurrent.futures import ProcessPoolExecutor

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

IMG_EXT = ('.png', '.jpg', '.jpeg', '.webp', '.bmp')
VID_EXT = ('.mp4', '.mov', '.mkv', '.webm', '.avi', '.m4v')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def red_mask(rgb, alpha, a):
    """rgb: HxWx3 uint8; returns (mask, hue in degrees, sat, val) for the red test."""
    f = rgb.astype(np.float32) / 255.0
    mx, mn = f.max(axis=2), f.min(axis=2)
    d = mx - mn
    sat = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    dd = np.maximum(d, 1e-6)
    hue = np.where(mx == r, ((g - b) / dd) % 6, np.where(mx == g, (b - r) / dd + 2, (r - g) / dd + 4)) * 60.0
    hue = np.where(d > 0, hue, -1)
    inhue = (hue >= a.hue_lo) | ((hue >= 0) & (hue <= a.hue_hi))
    m = inhue & (sat >= a.sat) & (mx >= a.val)
    if alpha is not None:
        m &= alpha >= 128
    return m, hue, sat, mx, inhue


def scan_array(rgb, alpha, a):
    m, hue, sat, val, inhue = red_mask(rgb, alpha, a)
    h, w = m.shape
    min_px = max(1, int(round(a.min_area * h * w)))
    patches = []
    if m.any():
        lab, n = ndimage.label(m, structure=np.ones((3, 3), bool))
        if n:
            areas = ndimage.sum(m, lab, index=np.arange(1, n + 1))
            sl = ndimage.find_objects(lab)
            for k, (ar, s) in enumerate(zip(areas, sl)):
                if ar >= min_px:
                    sub = lab[s] == k + 1
                    patches.append({'area': int(ar), 'box': [int(s[1].start), int(s[0].start), int(s[1].stop - s[1].start), int(s[0].stop - s[0].start)],
                                    'mean_sat': round(float(sat[s][sub].mean()), 3), 'mean_hue': round(float(hue[s][sub].mean()), 1)})
    st = None
    if a.stats:
        sel = inhue & (val >= a.val)
        if alpha is not None:
            sel &= alpha >= 128
        sv = sat[sel]
        st = {'inhue_px': int(sel.sum()), 'sat_p99': round(float(np.percentile(sv, 99)), 3) if sv.size else 0,
              'sat_max': round(float(sv.max()), 3) if sv.size else 0, 'red_px_any_size': int(m.sum())}
    return {'w': w, 'h': h, 'red_px': int(m.sum()), 'patches': patches, 'stats': st}


def load_image(path):
    im = Image.open(path)
    alpha = None
    if im.mode in ('RGBA', 'LA', 'PA') or (im.mode == 'P' and 'transparency' in im.info):
        im = im.convert('RGBA')
        arr = np.asarray(im)
        return arr[..., :3], arr[..., 3]
    return np.asarray(im.convert('RGB')), alpha


def scan_file(args):
    path, a = args
    rgb, alpha = load_image(path)
    r = scan_array(rgb, alpha, a)
    r['file'] = path
    return r


def annotate(rgb, patches, path_out, title):
    im = Image.fromarray(rgb).convert('RGB')
    w, h = im.size
    k = 0.5 if w > 1000 else 1.0
    im = im.resize((max(1, int(w * k)), max(1, int(h * k))))
    d = ImageDraw.Draw(im)
    for p in patches:
        x, y, bw, bh = [v * k for v in p['box']]
        d.rectangle((x - 3, y - 3, x + bw + 3, y + bh + 3), outline=(0, 255, 255), width=3)
        d.rectangle((x - 3, y - 18, x + 150, y - 3), fill=(0, 0, 0))
        d.text((x, y - 16), f"{p['area']}px s{p['mean_sat']}", fill=(0, 255, 255))
    d.rectangle((0, 0, 8 + 7 * len(title), 16), fill=(0, 0, 0))
    d.text((4, 2), title, fill=(255, 255, 255))
    im.save(path_out)


def video_frames(path, every):
    pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                         '-of', 'json', path], capture_output=True, text=True)
    st = json.loads(pr.stdout)['streams'][0]
    w, h = int(st['width']), int(st['height'])
    num, den = st['r_frame_rate'].split('/')
    fps = float(num) / float(den)
    vf = f"select=not(mod(n\\,{every}))" if every > 1 else 'null'
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf', vf, '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         stdout=subprocess.PIPE)
    n = w * h * 3
    i = 0
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield i * every, i * every / fps, np.frombuffer(buf, np.uint8).reshape(h, w, 3)
        i += 1
    p.wait()


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src')
    ap.add_argument('--every', type=int, default=1)
    ap.add_argument('--out')
    ap.add_argument('--hue-lo', type=float, default=340)
    ap.add_argument('--hue-hi', type=float, default=20)
    ap.add_argument('--sat', type=float, default=0.55)
    ap.add_argument('--val', type=float, default=0.30)
    ap.add_argument('--min-area', type=float, default=0.0001)
    ap.add_argument('--workers', type=int, default=2)  # 2026-11-21: each worker ~1.5 GB; several segments scan at once
    ap.add_argument('--stats', action='store_true')
    a = ap.parse_args()
    src = os.path.abspath(a.src)
    name = os.path.basename(src.rstrip('\\/'))
    if os.path.basename(os.path.dirname(src)) and os.path.isdir(src):
        name = os.path.basename(os.path.dirname(src)) + '_' + name
    out = a.out or os.path.join(ROOT, 'work', 'infra', 'red_scan', os.path.splitext(name)[0])
    os.makedirs(out, exist_ok=True)
    results = []
    if os.path.isdir(src):
        files = sorted(os.path.join(src, f) for f in os.listdir(src) if f.lower().endswith(IMG_EXT))
        files = files[::max(1, a.every)]
        if not files:
            print('no images in', src); return 2
        with ProcessPoolExecutor(max_workers=max(1, a.workers)) as ex:
            for idx, r in enumerate(ex.map(scan_file, [(f, a) for f in files], chunksize=4)):
                r['index'] = idx * max(1, a.every)
                results.append(r)
        for r in results:
            if r['patches']:
                rgb, _ = load_image(r['file'])
                annotate(rgb, r['patches'], os.path.join(out, os.path.splitext(os.path.basename(r['file']))[0] + '_red.png'),
                         os.path.basename(r['file']))
    elif os.path.isfile(src) and src.lower().endswith(VID_EXT):
        for idx, t, rgb in video_frames(src, max(1, a.every)):
            r = scan_array(rgb, None, a)
            r.update(index=idx, time=round(t, 3), file=f'{name}#{idx}')
            if r['patches']:
                annotate(rgb, r['patches'], os.path.join(out, f'f_{idx:05d}_red.png'), f'frame {idx}  {t:.2f}s')
            results.append(r)
    else:
        print('not a folder of images or a video:', src); return 2

    flagged = [r for r in results if r['patches']]
    rep = {'src': src, 'images': len(results), 'flagged': len(flagged),
           'params': {k: getattr(a, k) for k in ('hue_lo', 'hue_hi', 'sat', 'val', 'min_area', 'every')},
           'hits': [{'index': r['index'], 'file': os.path.basename(r['file']), **({'time': r['time']} if 'time' in r else {}),
                     'area': sum(p['area'] for p in r['patches']), 'patches': r['patches']} for r in flagged]}
    if a.stats:
        sv = [r['stats'] for r in results if r['stats']]
        worst = sorted(results, key=lambda r: -(r['stats'] or {}).get('sat_max', 0))[:5]
        rep['stats'] = {'max_sat_in_red_hue': max((s['sat_max'] for s in sv), default=0),
                        'max_p99_sat_in_red_hue': max((s['sat_p99'] for s in sv), default=0),
                        'max_red_px_any_size': max((s['red_px_any_size'] for s in sv), default=0),
                        'most_saturated': [(os.path.basename(r['file']), r['stats']) for r in worst]}
    with open(os.path.join(out, 'report.json'), 'w', encoding='utf-8') as f:
        json.dump(rep, f, ensure_ascii=False, indent=1)
    print(f"red scan {src}: {len(results)} images, {len(flagged)} with red (sat>={a.sat}, val>={a.val}, hue {a.hue_lo}-{a.hue_hi}, patch>={a.min_area:.4%})")
    for h in rep['hits'][:40]:
        print(f"  {h['index']:5d} {h['file']}{'  t=' + str(h['time']) if 'time' in h else ''}  area {h['area']}  boxes " +
              ' '.join(str(p['box']) for p in h['patches'][:4]))
    if len(rep['hits']) > 40:
        print(f"  ... {len(rep['hits']) - 40} more in report.json")
    if a.stats:
        s = rep['stats']
        print(f"  stats: in-hue pixels max sat {s['max_sat_in_red_hue']}, worst p99 sat {s['max_p99_sat_in_red_hue']}, "
              f"most red pixels in one image (any patch size) {s['max_red_px_any_size']}")
        for fn, st in s['most_saturated']:
            print('   ', fn, st)
    print('report:', os.path.join(out, 'report.json'))
    return 1 if flagged else 0


if __name__ == '__main__':
    sys.exit(main())
