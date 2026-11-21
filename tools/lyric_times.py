"""The one table of when every character of the lyrics is sung. Every lyric shown in the film takes its times
from here, never from times typed by hand.

Source: the karaoke ASS (per-character timing from NetEase YRC), shifted 0.10 s earlier (measured against the
separated vocal: the file is a constant ~0.10 s late, docs/音源与字幕核对.md), then the per-character fixes
measured on the vocal stem (work/audio/lyric_fixes.json). A pitch change inside one held vowel is not a new
character: a melisma on the last や is still や.

usage:
  python tools/lyric_times.py build                  write work/audio/lyrics_timed.json
  python tools/lyric_times.py find もうどうだっていいや 170 185   print the times of that text sung in that window,
                                                     comma-separated (for a scene's ltimes)
"""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ASS = os.path.join(os.environ.get('LOSTONE_INPUT') or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'input'), 'lyrics_karaoke.ass')
FIXES = os.path.join(ROOT, 'work', 'audio', 'lyric_fixes.json')
OUT = os.path.join(ROOT, 'work', 'audio', 'lyrics_timed.json')
OFFSET = -0.10


def ts(s):
    h, m, x = s.split(':'); return int(h) * 3600 + int(m) * 60 + float(x)


def build():
    lines = []
    for raw in open(ASS, encoding='utf-8-sig'):
        if not raw.startswith('Dialogue:'): continue
        parts = raw.rstrip('\n').split(',', 9)
        t = ts(parts[1]) + OFFSET; end = ts(parts[2]) + OFFSET
        chars = []
        for k, ch in re.findall(r'\{\\k(\d+)\}([^{]*)', parts[9]):
            for i, c in enumerate(ch):
                if c.strip() == '': continue
                d = int(k) / 100 if i == 0 else 0.0
                chars.append({'c': c, 't': round(t, 3), 'd': round(d, 3)})
            t += int(k) / 100
        lines.append({'start': round(chars[0]['t'], 3), 'end': round(end, 3), 'text': ''.join(c['c'] for c in chars), 'chars': chars})
    fixes = json.load(open(FIXES, encoding='utf-8')) if os.path.exists(FIXES) else []
    for fx in fixes:
        ln = next(l for l in lines if abs(l['start'] - fx['line_start']) < 0.3 and fx['text'] in l['text'])
        i0 = ln['text'].index(fx['text'])
        for j, tt in enumerate(fx['times']):
            if tt is not None: ln['chars'][i0 + j]['t'] = tt
        if 'end' in fx: ln['end'] = fx['end']
        for j in range(len(ln['chars']) - 1): ln['chars'][j]['d'] = round(ln['chars'][j + 1]['t'] - ln['chars'][j]['t'], 3)
        ln['chars'][-1]['d'] = round(ln['end'] - ln['chars'][-1]['t'], 3)
    json.dump(lines, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(lines), 'lines ->', OUT)


def find(text, t0, t1):
    lines = json.load(open(OUT, encoding='utf-8'))
    for l in lines:
        if l['end'] < t0 or l['start'] > t1 or text not in l['text']: continue
        i0 = l['text'].index(text)
        return [c['t'] for c in l['chars'][i0:i0 + len(text)]]
    raise SystemExit(f'not found: {text} in {t0}-{t1}')


if __name__ == '__main__':
    if sys.argv[1] == 'build': build()
    else: print(','.join(f'{t:.2f}' for t in find(sys.argv[2], float(sys.argv[3]), float(sys.argv[4]))))
