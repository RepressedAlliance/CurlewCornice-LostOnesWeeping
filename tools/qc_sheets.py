"""Check sheets by event, not every 4th frame (docs/制作约定.md, 十 4: 逐帧看).

usage:
  python tools/qc_sheets.py <frames_dir> <audit.json | -> <out_dir> [--t0 SEC] [--fps 30] [--log FILE]
         [--lyrics work/audio/lyrics_timed.json]

What it puts on the sheets (thumbnails 640x360, each labelled with frame number, song time, beat number and name):
  cuts_NN.png    every cut and every drawing swap: the frame before, the frame it lands on, the frame after;
                 plus any jump in the frame difference that no cut or swap explains ("帧差突变");
  shots_NN.png   every shot: its first, middle and last frame;
  holds/         every drawing or still picture that stays more than 1 s: one full-size frame from its middle
                 (with a label strip under it), so it can be looked at as a still;
  lyrics_NN.png  every lyric line in the range: the frame before its first character is sung and the frame it is sung on;
  index.md       what is on every sheet, plus the page's AUDIT / BEAT AUDIT / HOLD AUDIT console lines.
Cuts come from audit.holds (kind 'shot') and events named 'cut ...'; swaps from audit.drawings and audit.holds (kind
'key' / 'inbetween'). Without an audit.json ('-' or missing) cuts are found by frame difference (a frame-to-frame jump
at least 3x the neighbouring motion and over 15 grey levels) and the console lines come from the render log
(--log, default <frames_dir>.log). An event at song time T lands on the first frame whose time is >= T.
Frame times follow tools/static_scan.py (g_ frames: g/fps; f_ frames: t0 + n/fps, t0 from --t0 or the render log).
"""
import argparse, json, math, os, re, sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from static_scan import diff, frame_list, frame_still, load_audit, small  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEAT, BV0 = 60 / 162, 0.354 - 0.036          # web/lib/score.js grid (docs/制作约定.md, 六)
TW, TH, LAB, GAP = 640, 360, 30, 8
FONT_PATH = os.path.join(ROOT, 'assets', 'fonts', 'ZenKakuGothicNew-Medium.ttf')


def font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()


class Frames:
    def __init__(self, fl, fps):
        self.paths = [p for p, _ in fl]
        self.times = [t for _, t in fl]
        self.fps = fps
        self.n = len(fl)

    def at(self, t):
        """the first frame showing song time >= t"""
        i = int(math.ceil((t - self.times[0]) * self.fps - 1e-6))
        return i

    def label(self, i, name=''):
        t = self.times[i]
        k = (t - BV0) / BEAT
        return f'#{i}  {t:.3f}s  拍{k:.2f}  {name}'

    def thumb(self, i):
        if not 0 <= i < self.n:
            im = Image.new('RGB', (TW, TH), (40, 40, 40))
            ImageDraw.Draw(im).text((10, 10), 'outside the range', fill=(200, 200, 200), font=font(20))
            return im
        return Image.open(self.paths[i]).convert('RGB').resize((TW, TH), Image.BILINEAR)


def sheet(fr, rows, path, cols):
    """rows: [(title, [(frame, caption), ...])]"""
    f_lab, f_title = font(18), font(22)
    W = cols * TW + (cols - 1) * GAP
    H = sum(LAB + 34 + TH + GAP for _ in rows)
    im = Image.new('RGB', (W, H), (24, 24, 26))
    d = ImageDraw.Draw(im)
    y = 0
    for title, cells in rows:
        d.text((6, y + 4), title, fill=(255, 230, 120), font=f_title)
        y += 34
        for c, (i, cap) in enumerate(cells):
            x = c * (TW + GAP)
            d.rectangle((x, y, x + TW, y + LAB), fill=(0, 0, 0))
            d.text((x + 6, y + 4), (fr.label(i, cap) if 0 <= i < fr.n else f'#{i} (none)'), fill=(255, 255, 255), font=f_lab)
            im.paste(fr.thumb(i), (x, y + LAB))
        y += LAB + TH + GAP
    im.save(path)


def chunks(xs, n):
    return [xs[k:k + n] for k in range(0, len(xs), n)]


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('frames')
    ap.add_argument('audit')
    ap.add_argument('out')
    ap.add_argument('--t0', type=float)
    ap.add_argument('--fps', type=float)
    ap.add_argument('--log')
    ap.add_argument('--lyrics', default=os.path.join(ROOT, 'work', 'audio', 'lyrics_timed.json'))
    ap.add_argument('--rows', type=int, default=4, help='rows per sheet')
    a = ap.parse_args()
    src = os.path.abspath(a.frames)
    audit = load_audit(a.audit) if a.audit not in ('-', '') else None
    fl, fps, _ = frame_list(src, audit, a.t0, a.fps)
    fr = Frames(fl, fps)
    os.makedirs(os.path.join(a.out, 'holds'), exist_ok=True)
    t_first, t_last = fr.times[0], fr.times[-1] + 1 / fps

    # frame-to-frame motion, for cut detection and unexplained jumps
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=4) as ex:
        smalls = [s for s, _ in ex.map(small, fr.paths)]
    motion = [0.0] + [float(diff(smalls[k], smalls[k - 1]).mean()) for k in range(1, fr.n)]

    def jumps():
        out = []
        for k in range(1, fr.n):
            before = sorted(motion[max(1, k - 5):k]) or [0.0]
            after = sorted(motion[k + 1:k + 6]) or [0.0]
            ref = max(before[len(before) // 2], after[len(after) // 2])
            if motion[k] > 15 and motion[k] >= 3 * ref:
                out.append(k)
        return out

    cuts, swaps, shots, holds, notes = [], [], [], [], []
    if audit:
        for h in audit.get('holds', []):
            if h.get('kind') == 'shot':
                shots.append((h['name'], h['start'], h['end']))
                if h['start'] > t_first + 1e-6:
                    cuts.append((fr.at(h['start']), 'cut: ' + h['name']))
            elif h.get('kind') in ('key', 'inbetween') and h['start'] > t_first + 1e-6:
                swaps.append((fr.at(h['start']), f"{h['kind']}: {h['name']}"))
            if h.get('kind') in ('key', 'inbetween') and h['end'] - h['start'] > 1.0:
                holds.append((h['name'], h['start'], h['end']))
        for e in audit.get('events', []):
            if re.match(r'cut\b', e.get('name', ''), re.I):
                cuts.append((fr.at(e['t']), 'event: ' + e['name']))
        prev = None
        for dw in sorted(audit.get('drawings', []), key=lambda d: d['start']):
            nm = os.path.basename(dw['file'])
            if dw['start'] > t_first + 1e-6:
                swaps.append((fr.at(dw['start']), f'drawing on: {nm}'))
            if dw['end'] - dw['start'] > 1.0:
                holds.append((nm, dw['start'], dw['end']))
        # jumps that no cut or swap explains
        known = set(i for i, _ in cuts + swaps)
        for k in jumps():
            if not any(abs(k - i) <= 1 for i in known):
                near = [e['name'] for e in audit.get('events', []) if abs(fr.at(e['t']) - k) <= 1]
                cuts.append((k, f'帧差突变 diff {motion[k]:.1f}, no cut/swap here' + (f' (events: {", ".join(near)})' if near else ' (no event either)')))
    else:
        notes.append('没有 audit.json：切点按帧差找，镜头 = 切点之间；没有换张和人物停留表。')
        js = jumps()
        for k in js:
            cuts.append((k, f'帧差突变 (diff {motion[k]:.1f})'))
        bounds = [0] + js + [fr.n]
        for s0, s1 in zip(bounds, bounds[1:]):
            shots.append((f'shot {fr.times[s0]:.2f}s', fr.times[s0], fr.times[s1 - 1] + 1 / fps))
    # still pictures over 1 s (the whole frame), from the frame difference
    i = 0
    while i < fr.n:
        j = i + 1
        while j < fr.n and frame_still(smalls[j], smalls[i], 0.35, 0.002):
            j += 1
        if j - i > fps:
            holds.append((f'whole frame still', fr.times[i], fr.times[j - 1] + 1 / fps))
        i = j

    # merge cuts and swaps that land on the same frame
    events = {}
    for i, nm in sorted(cuts + swaps):
        events.setdefault(i, []).append(nm)
    ev_rows = [(f'{" / ".join(v)}', [(i - 1, 'before'), (i, 'lands'), (i + 1, 'after')]) for i, v in sorted(events.items())]
    shot_rows = []
    for nm, s, e in shots:
        f0, f1 = max(0, fr.at(s)), min(fr.n - 1, fr.at(e) - 1)
        shot_rows.append((f'{nm}  {s:.2f}-{e:.2f}s ({e - s:.2f}s)', [(f0, 'in'), ((f0 + f1) // 2, 'middle'), (f1, 'out')]))
    lyr_rows = []
    if os.path.isfile(a.lyrics):
        for ln in json.load(open(a.lyrics, encoding='utf-8')):
            t = ln['chars'][0]['t']
            if t_first <= t < t_last:
                i = fr.at(t)
                lyr_rows.append((f'「{ln["text"]}」 first character {ln["chars"][0]["c"]} at {t:.2f}s', [(i - 1, 'before'), (i, 'sung')]))

    written = []
    for k, rows in enumerate(chunks(ev_rows, a.rows), 1):
        p = os.path.join(a.out, f'cuts_{k:02d}.png'); sheet(fr, rows, p, 3); written.append((p, [r[0] for r in rows]))
    for k, rows in enumerate(chunks(shot_rows, a.rows), 1):
        p = os.path.join(a.out, f'shots_{k:02d}.png'); sheet(fr, rows, p, 3); written.append((p, [r[0] for r in rows]))
    for k, rows in enumerate(chunks(lyr_rows, a.rows), 1):
        p = os.path.join(a.out, f'lyrics_{k:02d}.png'); sheet(fr, rows, p, 2); written.append((p, [r[0] for r in rows]))
    seen = set()
    hold_files = []
    for nm, s, e in sorted(holds, key=lambda h: h[1]):
        i = min(fr.n - 1, max(0, (fr.at(s) + fr.at(e) - 1) // 2))
        if i in seen:
            continue
        seen.add(i)
        im = Image.open(fr.paths[i]).convert('RGB')
        canvas = Image.new('RGB', (im.width, im.height + 40), (0, 0, 0))
        canvas.paste(im, (0, 0))
        ImageDraw.Draw(canvas).text((10, im.height + 6), f'{nm}  {s:.2f}-{e:.2f}s ({e - s:.2f}s)   ' + fr.label(i), fill=(255, 255, 255), font=font(24))
        safe = re.sub(r'[^\w-]+', '_', os.path.splitext(nm)[0])[:40]
        p = os.path.join(a.out, 'holds', f'hold_{i:05d}_{safe}.png')
        canvas.save(p)
        hold_files.append((p, f'{nm} {s:.2f}-{e:.2f}s ({e - s:.2f}s), frame {i}'))

    # console audit lines
    lines = []
    rend = (audit or {}).get('_render') or {}
    if rend.get('console'):
        lines = [str(x) for x in rend['console']]
    else:
        log = a.log or (src.rstrip('\\/') + '.log')
        if os.path.isfile(log):
            lines = [l.strip().replace('[page] ', '') for l in open(log, encoding='utf-8', errors='replace') if 'AUDIT' in l]
    md = [f'# 检查图：{os.path.basename(os.path.dirname(src))}/{os.path.basename(src)}', '',
          f'帧 {fr.n} 张，{t_first:.3f}–{t_last:.3f}s，{fps:g} fps；audit：{a.audit if audit else "无"}。', '']
    md += [f'- {n}' for n in notes]
    if audit and audit.get('_fixture'):
        md.append(f'- audit 是测试用的手写夹具：{audit["_fixture"]}')
    md += ['', '## 控制台审计行', ''] + ([f'    {l}' for l in lines] or ['（没有）'])
    md += ['', f'## 切点和换张（{len(ev_rows)}）、镜头（{len(shot_rows)}）、歌词首字（{len(lyr_rows)}）', '']
    for p, titles in written:
        md.append(f'- `{os.path.basename(p)}`：' + '；'.join(titles))
    md += ['', f'## 停留超过 1 秒的画面（{len(hold_files)}，原尺寸）', '']
    md += [f'- `holds/{os.path.basename(p)}`：{t}' for p, t in hold_files]
    md.append('')
    open(os.path.join(a.out, 'index.md'), 'w', encoding='utf-8').write('\n'.join(md))
    json.dump({'frames': fr.n, 't0': t_first, 'events': [{'frame': i, 'names': v} for i, v in sorted(events.items())],
               'shots': [{'name': n, 'start': s, 'end': e} for n, s, e in shots], 'holds': [{'name': n, 'start': s, 'end': e} for n, s, e in holds],
               'lyrics': [r[0] for r in lyr_rows], 'console': lines}, open(os.path.join(a.out, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'qc sheets {src}: {len(ev_rows)} cuts/swaps, {len(shot_rows)} shots, {len(hold_files)} holds > 1 s, {len(lyr_rows)} lyric lines; '
          f'{len(written)} sheets + {len(hold_files)} full-size frames in {a.out}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
