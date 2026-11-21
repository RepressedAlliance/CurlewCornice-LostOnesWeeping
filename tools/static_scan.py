"""Static scan: where the picture stops moving. Lists, never fails (docs/制作约定.md, 十 3: 画面停滞列表).

usage:
  python tools/static_scan.py <frames_dir | video> [--audit audit.json] [--t0 SEC] [--fps 30] [--out DIR]
         [--min-still 1.0] [--mean 0.35] [--frac 0.002] [--workers 4]

1. Whole-frame still stretches: runs of frames that all stay within a small difference of the run's first frame (so a
   slow push or drift breaks the run, a frozen frame does not) and last at least --min-still seconds. The difference is
   measured on a 480x270 grey copy: mean absolute difference < --mean (0..255) and fewer than --frac of the pixels off
   by more than 10 levels.
2. With an audit.json (window.__audit as the renderer writes it, or given with --audit): for every drawing of a figure
   on screen (audit.drawings: {file, start, end[, box]}, song seconds) the time it is on screen and the stretches where
   neither the figure nor the camera moves. With a box ([x, y, w, h] in frame pixels) only that box is compared;
   without one the whole frame is compared on a 16x9 grid of cells and a frame counts as still while at most --cells
   of the cells change (more than 2% of a cell's pixels off by more than 10): a push, a pan or a shake moves edges
   in many cells at once, a word or a mark appearing changes only a few.
   Drawings shorter than 0.5 s are skipped from the still list (in-betweens) but still listed with their duration.

Frame times: g_<global>.png frames (web/render_film.mjs) show g/fps, or t0_override + (g - f0)/fps from
audit._render; f_<n>.png frames (web/render_seq.mjs) show t0 + n/fps, with t0 from --t0 or from the sibling log
<frames_dir>.log ("frame 0/N  t=50.050"); a video starts at --t0 (default 0).

Memory: a 480x270 grey copy of every frame is kept (130 KB a frame, about 1.2 GB for a whole 5-minute film), so
scan the film per segment.

Writes <out>/static_scan.json (default work/infra/static_scan/<name>) and prints the lists. Exit code 0 always
(2 on bad input).
"""
import argparse, json, math, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VID_EXT = ('.mp4', '.mov', '.mkv', '.webm', '.avi', '.m4v')
SW, SH = 480, 270


# ---------------- frames and their song times (same rules as tools/qc_sheets.py) ----------------
def load_audit(path):
    if path and os.path.isfile(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    return None


def frame_list(src, audit, t0_arg, fps_arg):
    """[(path, song_time)], fps, t0 for a frames folder."""
    names = sorted(f for f in os.listdir(src) if re.fullmatch(r'[fg]_\d+\.png', f))
    if not names:
        raise SystemExit(f'no f_*.png or g_*.png frames in {src}')
    rend = (audit or {}).get('_render') or {}
    fps = fps_arg or rend.get('fps') or 30
    if names[0].startswith('g_'):
        t0o = t0_arg if t0_arg is not None else rend.get('t0_override')
        f0 = rend.get('f0')
        out = []
        for n in names:
            g = int(n[2:-4])
            out.append((os.path.join(src, n), (t0o + (g - (f0 if f0 is not None else int(names[0][2:-4]))) / fps) if t0o is not None else g / fps))
        return out, fps, out[0][1]
    t0 = t0_arg
    if t0 is None:
        log = src.rstrip('\\/') + '.log'
        if os.path.isfile(log):
            m = re.search(r'frame 0/\d+\s+t=([\d.]+)', open(log, encoding='utf-8', errors='replace').read())
            if m:
                t0 = float(m.group(1))
    if t0 is None:
        raise SystemExit(f'cannot tell the song time of f_00000.png in {src}: pass --t0')
    return [(os.path.join(src, n), t0 + int(n[2:-4]) / fps) for n in names], fps, t0


def video_info(path):
    pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                         '-of', 'json', path], capture_output=True, text=True)
    st = json.loads(pr.stdout)['streams'][0]
    num, den = st['r_frame_rate'].split('/')
    return int(st['width']), int(st['height']), float(num) / float(den)


def video_small(path):
    """yield grey SWxSH frames of a video, plus the full size."""
    w, h, fps = video_info(path)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={SW}:{SH}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         stdout=subprocess.PIPE)
    n = SW * SH
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, np.uint8).reshape(SH, SW).copy()
    p.wait()


def small(path):
    im = Image.open(path).convert('L')
    full = im.size
    return np.asarray(im.resize((SW, SH), Image.BILINEAR)), full      # uint8: 130 KB a frame


# ---------------- the tests ----------------
def diff(a, b):
    return np.abs(a.astype(np.int16) - b.astype(np.int16))


def frame_still(a, b, mean_thr, frac_thr):
    d = diff(a, b)
    return d.mean() < mean_thr and (d > 10).mean() < frac_thr


def cells_moving(a, b):
    d = (diff(a, b) > 10).reshape(9, SH // 9, 16, SW // 16).mean(axis=(1, 3))
    return int((d > 0.02).sum())


def region_still(a, b, box, full, mean_thr, frac_thr, cells_max):
    if box:
        kx, ky = SW / full[0], SH / full[1]
        x0, y0 = max(0, int(box[0] * kx)), max(0, int(box[1] * ky))
        x1, y1 = min(SW, int(math.ceil((box[0] + box[2]) * kx))), min(SH, int(math.ceil((box[1] + box[3]) * ky)))
        if x1 - x0 < 2 or y1 - y0 < 2:
            return True
        return frame_still(a[y0:y1, x0:x1], b[y0:y1, x0:x1], mean_thr * 2, frac_thr * 2)
    return cells_moving(a, b) <= cells_max


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src')
    ap.add_argument('--audit')
    ap.add_argument('--t0', type=float)
    ap.add_argument('--fps', type=float)
    ap.add_argument('--out')
    ap.add_argument('--min-still', type=float, default=1.0)
    ap.add_argument('--mean', type=float, default=0.35)
    ap.add_argument('--frac', type=float, default=0.002)
    ap.add_argument('--cells', type=int, default=6, help='cells of 144 that may change in a still frame (no box)')
    ap.add_argument('--workers', type=int, default=4)
    a = ap.parse_args()
    src = os.path.abspath(a.src)
    is_video = os.path.isfile(src) and src.lower().endswith(VID_EXT)
    audit_path = a.audit or (os.path.join(src, 'audit.json') if os.path.isdir(src) else None)
    audit = load_audit(audit_path)
    name = os.path.splitext(os.path.basename(src.rstrip('\\/')))[0]
    if os.path.isdir(src):
        name = os.path.basename(os.path.dirname(src)) + '_' + name
    out = a.out or os.path.join(ROOT, 'work', 'infra', 'static_scan', name)
    os.makedirs(out, exist_ok=True)

    if is_video:
        w, h, vfps = video_info(src)
        fps = a.fps or vfps
        t0 = a.t0 or 0.0
        smalls = list(video_small(src))
        full = (w, h)
        times = [t0 + i / fps for i in range(len(smalls))]
    elif os.path.isdir(src):
        fl, fps, t0 = frame_list(src, audit, a.t0, a.fps)
        with ThreadPoolExecutor(max_workers=max(1, a.workers)) as ex:
            res = list(ex.map(small, [p for p, _ in fl]))
        smalls = [r[0] for r in res]
        full = res[0][1]
        times = [t for _, t in fl]
    else:
        print('not a frames folder or a video:', src); return 2
    n = len(smalls)
    min_frames = int(round(a.min_still * fps))

    # 1. whole-frame still runs (anchored at the run's first frame)
    still = []
    i = 0
    while i < n:
        j = i + 1
        while j < n and frame_still(smalls[j], smalls[i], a.mean, a.frac):
            j += 1
        if j - i >= min_frames:
            still.append({'f0': i, 'f1': j - 1, 't0': round(times[i], 3), 't1': round(times[j - 1] + 1 / fps, 3), 'sec': round((j - i) / fps, 2)})
        i = j

    # 2. per drawing on screen
    draw_rows = []
    if audit and audit.get('drawings'):
        fidx = lambda t: max(0, min(n, int(math.ceil((t - times[0]) * fps - 1e-6))))
        for d in audit['drawings']:
            s0, s1 = fidx(d['start']), fidx(d['end'])
            row = {'file': d['file'], 'start': d['start'], 'end': d['end'], 'on_screen': round(d['end'] - d['start'], 2),
                   'frames': [s0, s1 - 1], 'box': d.get('box'), 'still_runs': [], 'still_total': 0.0, 'still_longest': 0.0}
            if s1 - s0 > 0 and d['end'] - d['start'] >= 0.5:
                k = s0
                while k < s1:
                    m = k + 1
                    while m < s1 and region_still(smalls[m], smalls[k], d.get('box'), full, a.mean, a.frac, a.cells):
                        m += 1
                    if m - k >= max(2, int(round(0.5 * fps))):
                        row['still_runs'].append({'f0': k, 'f1': m - 1, 't0': round(times[k], 3), 'sec': round((m - k) / fps, 2)})
                    k = m
                row['still_total'] = round(sum(r['sec'] for r in row['still_runs']), 2)
                row['still_longest'] = max((r['sec'] for r in row['still_runs']), default=0.0)
            draw_rows.append(row)

    # the frame-to-frame motion curve, for the record
    motion = [0.0] + [round(float(diff(smalls[k], smalls[k - 1]).mean()), 3) for k in range(1, n)]
    rep = {'src': src, 'audit': audit_path if audit else None, 'frames': n, 'fps': fps, 't0': round(times[0], 3),
           'params': {'min_still': a.min_still, 'mean': a.mean, 'frac': a.frac, 'cells': a.cells},
           'still_frames': still, 'drawings': draw_rows, 'motion_per_frame': motion}
    with open(os.path.join(out, 'static_scan.json'), 'w', encoding='utf-8') as f:
        json.dump(rep, f, ensure_ascii=False, indent=1)

    print(f'static scan {src}: {n} frames from {times[0]:.3f}s at {fps:g} fps')
    print(f'  whole frame still >= {a.min_still}s: {len(still)}')
    for s in still:
        print(f"    frames {s['f0']}-{s['f1']}  {s['t0']:.2f}-{s['t1']:.2f}s  {s['sec']}s")
    if audit is None:
        print('  no audit.json: no per-drawing list')
    elif draw_rows:
        print('  figure drawings (on screen; figure and camera both still: longest / total, runs >= 0.5 s):')
        for r in draw_rows:
            tag = '' if r['on_screen'] >= 0.5 else '  (under 0.5 s, not checked)'
            print(f"    {os.path.basename(r['file']):28s} {r['start']:.2f}-{r['end']:.2f}s  on {r['on_screen']:.2f}s  "
                  f"still {r['still_longest']:.2f}s / {r['still_total']:.2f}s{'  box' if r['box'] else ''}{tag}")
    stills = sorted(motion[1:])
    if stills:
        print(f"  frame-to-frame motion (mean abs grey diff): median {stills[len(stills) // 2]:.3f}, frames under 0.05: "
              f"{sum(1 for v in motion[1:] if v < 0.05)}")
    print('report:', os.path.join(out, 'static_scan.json'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
