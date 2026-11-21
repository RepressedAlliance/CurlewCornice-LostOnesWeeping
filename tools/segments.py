"""The film's segment registry (web/segments.json): checks, the frame table, and helpers the render and assembly
tools import.

usage:
  python tools/segments.py check [--scope active|all] [--allow-gaps] [--full]
      every segment's frame range [f0, f1) is checked: ids unique, integers, t0 = f0/fps, no overlaps, consecutive
      segments meet end to start (a gap is an error unless --allow-gaps), the last frame starts before the audio ends.
      --scope active (default) checks only segments whose status is not "todo"; --scope all checks every segment.
      --full also requires the checked segments to cover the whole song, from frame 0 to the end of the audio.
      Exit code 0 = no errors, 1 = errors.
  python tools/segments.py table [--out docs/帧表.md]
      writes the Markdown frame table (segments in frame order, gaps shown as rows of their own, lyric lines).
  python tools/segments.py at <seconds|gNNNN> ...
      the global frame of a song time (or the time of a frame) and the segment that holds it.

Frame g shows song time g/fps seconds. The audio length is read from the FLAC with ffprobe."""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY = os.path.join(ROOT, 'web', 'segments.json')
STATUSES = ['todo', 'draft', 'self-checked', 'reviewed', 'approved']
LYRICS = os.path.join(ROOT, 'work', 'audio', 'lyrics_timed.json')


def load(path=REGISTRY):
    with open(path, encoding='utf-8') as f:
        reg = json.load(f)
    reg.setdefault('fps', 30)
    reg.setdefault('width', 1920)
    reg.setdefault('height', 1080)
    reg.setdefault('url', 'web/scenes/sheet.html')
    # the song is not in the repository: LOSTONE_AUDIO, or the registry path relative to the project root
    a = os.environ.get('LOSTONE_AUDIO') or reg.get('audio', 'input/song.flac')
    reg['audio'] = a if os.path.isabs(a) else os.path.join(ROOT, a)
    return reg


def ordered(reg, ids=None, include_todo=True):
    segs = [s for s in reg['segments'] if (include_todo or s.get('status') != 'todo')]
    if ids:
        want = set(ids)
        unknown = want - {s['id'] for s in reg['segments']}
        if unknown:
            raise SystemExit(f'unknown segment id(s): {", ".join(sorted(unknown))}')
        segs = [s for s in reg['segments'] if s['id'] in want]
    return sorted(segs, key=lambda s: (s['f0'], s['f1']))


def audio_seconds(reg):
    p = reg.get('audio')
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', p],
                         capture_output=True, text=True)
    if out.returncode != 0 or not out.stdout.strip():
        raise SystemExit(f'ffprobe could not read the audio: {p}\n{out.stderr}')
    return float(out.stdout.strip())


def audio_frames(reg, dur=None):
    """the number of frames that start before the audio ends: the largest f1 allowed"""
    dur = audio_seconds(reg) if dur is None else dur
    return math.ceil(dur * reg['fps'] - 1e-9)


def fmt_t(sec):
    m, s = divmod(sec, 60)
    return f'{int(m)}:{s:06.3f}'


def check(reg, scope='active', allow_gaps=False, full=False, dur=None, quiet=False):
    """returns (errors, warnings) as lists of strings"""
    errors, warnings = [], []
    fps = reg['fps']
    ids = [s.get('id') for s in reg['segments']]
    for i in sorted({i for i in ids if ids.count(i) > 1}, key=str):
        errors.append(f'duplicate id {i}')
    for s in reg['segments']:
        sid = s.get('id', '?')
        for k in ('id', 'page', 'f0', 'f1', 't0', 'lyrics', 'status'):
            if k not in s:
                errors.append(f'{sid}: missing field "{k}"')
        f0, f1 = s.get('f0'), s.get('f1')
        if not (isinstance(f0, int) and isinstance(f1, int)) or isinstance(f0, bool) or isinstance(f1, bool):
            errors.append(f'{sid}: f0 and f1 must be integers (got {f0!r}, {f1!r})')
            continue
        if f0 < 0 or f1 <= f0:
            errors.append(f'{sid}: bad range [{f0}, {f1})')
        if 't0' in s and abs(s['t0'] - f0 / fps) > 1e-6:
            errors.append(f'{sid}: t0 = {s["t0"]} but f0/{fps} = {f0 / fps:.6f}')
        if s.get('status') not in STATUSES:
            errors.append(f'{sid}: status "{s.get("status")}" is not one of {"/".join(STATUSES)}')
        if not isinstance(s.get('lyrics', []), list):
            errors.append(f'{sid}: lyrics must be a list of lyric line numbers')
    segs = [s for s in reg['segments'] if isinstance(s.get('f0'), int) and isinstance(s.get('f1'), int)]
    if scope == 'active':
        segs = [s for s in segs if s.get('status') != 'todo']
    segs.sort(key=lambda s: (s['f0'], s['f1']))
    for a, b in zip(segs, segs[1:]):
        if b['f0'] < a['f1']:
            errors.append(f'overlap: {a["id"]} [{a["f0"]}, {a["f1"]}) and {b["id"]} [{b["f0"]}, {b["f1"]}) share {a["f1"] - b["f0"]} frame(s)')
        elif b['f0'] > a['f1']:
            msg = (f'gap: frames {a["f1"]}..{b["f0"]} ({b["f0"] - a["f1"]} frames, {fmt_t(a["f1"] / fps)}-{fmt_t(b["f0"] / fps)}) '
                   f'between {a["id"]} and {b["id"]}')
            (warnings if allow_gaps else errors).append(msg)
    if segs:
        nmax = audio_frames(reg, dur)
        last = max(segs, key=lambda s: s['f1'])
        if last['f1'] > nmax:
            errors.append(f'{last["id"]}: f1 = {last["f1"]} runs past the audio ({nmax} frames, frame {last["f1"] - 1} '
                          f'starts at {(last["f1"] - 1) / fps:.3f} s)')
        if full:
            if segs[0]['f0'] != 0:
                errors.append(f'the film starts at frame {segs[0]["f0"]}, not 0 ({segs[0]["id"]})')
            if last['f1'] != nmax:
                errors.append(f'the film ends at frame {last["f1"]}, the audio needs f1 = {nmax}')
    elif not quiet:
        warnings.append('no segments in scope')
    return errors, warnings


def lyric_lines():
    try:
        with open(LYRICS, encoding='utf-8') as f:
            return json.load(f)
    except OSError:
        return []


def table(reg, out):
    fps = reg['fps']
    lines = lyric_lines()
    dur = audio_seconds(reg)
    nmax = audio_frames(reg, dur)
    segs = ordered(reg)
    rows = []
    cursor = 0
    total = 0
    for i, s in enumerate(segs, 1):
        if s['f0'] > cursor:
            rows.append(f'| | （空） | | {cursor} | {s["f0"]} | {s["f0"] - cursor} | {fmt_t(cursor / fps)} | {fmt_t(s["f0"] / fps)} | | |')
        elif s['f0'] < cursor:
            rows.append(f'| | **重叠 {cursor - s["f0"]} 帧** | | | | | | | | |')
        ly = []
        for n in s.get('lyrics', []):
            if 0 <= n < len(lines):
                ly.append(f'{n} {lines[n]["text"]}')
            else:
                ly.append(str(n))
        n = s['f1'] - s['f0']
        total += n
        rows.append(f'| {i} | {s["id"]} | `{s["page"]}` | {s["f0"]} | {s["f1"]} | {n} | {fmt_t(s["f0"] / fps)} | '
                    f'{fmt_t(s["f1"] / fps)} | {"<br>".join(ly)} | {s["status"]} |')
        cursor = max(cursor, s['f1'])
    if cursor < nmax:
        rows.append(f'| | （空，到歌曲结束） | | {cursor} | {nmax} | {nmax - cursor} | {fmt_t(cursor / fps)} | {fmt_t(nmax / fps)} | | |')
    errors, warnings = check(reg, scope='all', allow_gaps=True, dur=dur, quiet=True)
    md = [
        '# 帧表',
        '',
        f'由 `tools/segments.py table` 从 `web/segments.json` 生成，不要手改。全片 {fps} fps，第 g 帧显示歌曲 g/{fps} 秒；'
        f'每段占 [f0, f1)，下一段的 f0 等于上一段的 f1。',
        f'音频 {dur:.3f} 秒，共 {nmax} 帧（最后一帧 {nmax - 1} 从 {(nmax - 1) / fps:.3f} 秒开始）。已登记 {len(segs)} 段、{total} 帧，'
        f'占全曲 {100 * total / nmax:.1f}%。',
        '',
        '| # | 段 | 页面 | f0 | f1 | 帧数 | 起 | 止 | 歌词 | 状态 |',
        '|---|---|---|---|---|---|---|---|---|---|',
        *rows,
        '',
    ]
    if errors or warnings:
        md += ['检查结果（全部段，空隙按提示）：', '']
        md += [f'- 错误：{e}' for e in errors] + [f'- 提示：{w}' for w in warnings] + ['']
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(md))
    print(f'{out}: {len(segs)} segments, {total} frames of {nmax}')


def at(reg, args):
    fps = reg['fps']
    for a in args:
        if a.startswith('g'):
            g = int(a[1:])
        else:
            g = round(float(a) * fps)
        seg = next((s for s in reg['segments'] if s['f0'] <= g < s['f1']), None)
        exact = '' if a.startswith('g') else f' (asked {a} s = frame {float(a) * fps:.3f})'
        where = f'{seg["id"]} local frame {g - seg["f0"]}' if seg else 'no segment'
        print(f'frame {g}  t = {g / fps:.4f} s  {fmt_t(g / fps)}{exact}  -> {where}')


def main(argv):
    if not argv or argv[0] in ('-h', '--help'):
        print(__doc__)
        return 0
    cmd, rest = argv[0], argv[1:]
    reg = load()
    if cmd == 'check':
        scope = 'all' if '--scope' in rest and rest[rest.index('--scope') + 1] == 'all' else 'active'
        errors, warnings = check(reg, scope=scope, allow_gaps='--allow-gaps' in rest, full='--full' in rest)
        segs = [s for s in reg['segments'] if scope == 'all' or s.get('status') != 'todo']
        print(f'checked {len(segs)} segment(s), scope={scope}')
        for w in warnings:
            print('WARN ', w)
        for e in errors:
            print('ERROR', e)
        print('OK' if not errors else f'{len(errors)} error(s)')
        return 1 if errors else 0
    if cmd == 'table':
        out = rest[rest.index('--out') + 1] if '--out' in rest else os.path.join(ROOT, 'docs', '帧表.md')
        table(reg, out)
        return 0
    if cmd == 'at':
        at(reg, rest)
        return 0
    print(__doc__)
    return 2


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
