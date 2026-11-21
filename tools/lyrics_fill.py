"""Fill the lyric text into the published lyric timing.

The repository ships work/audio/lyrics_timing.json: for each of the 54 sung lines its start, end and per-character
times, but not the lyric text (the lyrics are copyrighted and are not redistributed here). The pages read
work/audio/lyrics_timed.json, which also carries each character. Build it from a lyrics text you obtained yourself:

  python tools/lyrics_fill.py lyrics.txt

lyrics.txt: UTF-8, one sung line per text line, in the order they are sung (54 lines; blank lines are ignored).
Whitespace inside a line is ignored. Each line must have exactly as many characters as the timing has for it; the
script stops and names the first line that does not match, so a different line split or a variant spelling is
caught instead of drifting out of sync.

If you have a karaoke .ass with per-syllable timing instead, tools/lyric_times.py rebuilds the whole file from it.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TIMING = os.path.join(ROOT, 'work', 'audio', 'lyrics_timing.json')
OUT = os.path.join(ROOT, 'work', 'audio', 'lyrics_timed.json')


def main(argv):
    if len(argv) != 1:
        print(__doc__); return 2
    timing = json.load(open(TIMING, encoding='utf-8'))['lines']
    text = [re.sub(r'\s+', '', ln) for ln in open(argv[0], encoding='utf-8-sig').read().splitlines()]
    text = [t for t in text if t]
    if len(text) != len(timing):
        print(f'{argv[0]} has {len(text)} lines, the timing has {len(timing)}'); return 1
    out = []
    for i, (t, line) in enumerate(zip(text, timing)):
        if len(t) != line['n']:
            print(f'line {i + 1}: {len(t)} characters, the timing has {line["n"]}: {t}'); return 1
        out.append({'start': line['start'], 'end': line['end'], 'text': t,
                    'chars': [dict(c=ch, **c) for ch, c in zip(t, line['chars'])]})
    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'wrote {OUT}: {len(out)} lines, {sum(len(l["chars"]) for l in out)} characters')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
