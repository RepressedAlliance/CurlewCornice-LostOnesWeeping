"""Figure-drawing reuse table (docs/制作约定.md, 五: 全片用图表; 十 3: 人物图复用表).

usage:
  python tools/reuse_audit.py <segment ...> [--out work/infra/reuse_audit.md] [--art-prefix art/]
  a segment is a render folder holding audit.json and/or deps.json (web/render_film.mjs writes both), one of those
  files, or a page module web/scenes/<page>_page.js (fallback when nothing has been rendered with an audit yet).

From audit.json it takes the segment id and the drawings on screen (audit.drawings: {file, start, end}); from
deps.json every image the page requested and its SHA-1. Without either, it reads the page JS and takes the art the
page loads (img('/art/...png'), template paths filled from the literal arrays the page loops over); a drawing counts as
used when the variable it is loaded into (or its name string) appears again in the page. That fallback has no times
and is marked "inferred".

Writes Markdown (default work/infra/reuse_audit.md) and the same data as JSON next to it, with:
  1. drawing -> the segments and times it is on screen (and where else it is only loaded);
  2. segment -> the drawings it shows, in order, with how long each stays;
  3. flags: a drawing on screen in more than one segment; a drawing loaded but never on screen; A -> B -> A inside one
     segment (a drawing coming back after another one replaced it); the same image content under two file names;
     art the page requested that does not exist (404 in deps.json).
Exit code 0 (it lists; the reasons for any reuse are written by hand next to the table).
"""
import argparse, hashlib, json, os, re, sys
from collections import OrderedDict, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def norm(p):
    p = p.replace('\\', '/').split('?')[0]
    p = re.sub(r'^https?://[^/]+/', '', p)
    return p.lstrip('/')


def sha1_of(rel):
    p = os.path.join(ROOT, rel)
    if not os.path.isfile(p):
        return None
    h = hashlib.sha1()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def parse_js(path):
    """the art a page loads, and whether each one is used again after loading (inferred)."""
    src = open(path, encoding='utf-8').read()
    code = re.sub(r'//[^\n]*', '', src)                          # comments mention file names too
    found = OrderedDict()
    # literal paths: img('/art/cut/x.png') and the like
    for m in re.finditer(r"""['"`](/?art/[^'"`$]+?\.png)['"`]""", code):
        rel = norm(m.group(1))
        line_start = code.rfind('\n', 0, m.start()) + 1
        line = code[line_start:code.find('\n', m.end())]
        before = code[line_start:m.start()]
        var = None
        vm = re.findall(r'(?:const|let|var)?\s*([A-Za-z_$][\w$]*)\s*=\s*[^=;,]*$', before)
        if vm:
            var = vm[-1]
        rest = code[:line_start] + code[line_start + len(line):]
        used = bool(var) and re.search(r'(?<![\w$])' + re.escape(var) + r'(?![\w$])', rest) is not None
        found.setdefault(rel, {'file': rel, 'used': used, 'how': f'loaded into {var}' if var else 'literal path'})
    # template paths: `/art/cut/${n}.png` filled from a literal array the page loops over
    for m in re.finditer(r"`(/?art/[^`]*?)\$\{(\w+)\}([^`]*?\.png)`", code):
        pre, var, post = m.group(1), m.group(2), m.group(3)
        names = []
        for am in re.finditer(r'for\s*\(\s*const\s+' + re.escape(var) + r'\s+of\s+\[([^\]]*)\]', code[:m.start()]):
            names = re.findall(r"""['"]([^'"]+)['"]""", am.group(1))
        arr_span = None
        for am in re.finditer(r'for\s*\(\s*const\s+' + re.escape(var) + r'\s+of\s+\[[^\]]*\]', code[:m.start()]):
            arr_span = (am.start(), am.end())
        rest = code if not arr_span else code[:arr_span[0]] + code[arr_span[1]:]
        for n in names:
            rel = norm(pre + n + post)
            used = re.search(r"""['"]""" + re.escape(n) + r"""['"]""", rest) is not None
            found.setdefault(rel, {'file': rel, 'used': used, 'how': f'loop over [{", ".join(names)}]'})
    return list(found.values())


def load_segment(arg, art_prefix):
    p = os.path.abspath(arg)
    seg = {'src': arg, 'id': None, 'drawings': None, 'loaded': {}, 'inferred': False, 'notes': []}
    audit = deps = None
    if os.path.isdir(p):
        if os.path.isfile(os.path.join(p, 'audit.json')):
            audit = json.load(open(os.path.join(p, 'audit.json'), encoding='utf-8'))
        if os.path.isfile(os.path.join(p, 'deps.json')):
            deps = json.load(open(os.path.join(p, 'deps.json'), encoding='utf-8'))
        seg['id'] = os.path.basename(os.path.dirname(p)) + '/' + os.path.basename(p)
    elif p.endswith('.json'):
        d = json.load(open(p, encoding='utf-8'))
        if 'files' in d and 'drawings' not in d:
            deps = d
        else:
            audit = d
        seg['id'] = os.path.basename(os.path.dirname(p))
    elif p.endswith('.js'):
        seg['id'] = os.path.basename(p).replace('_page.js', '').replace('.js', '')
        seg['inferred'] = True
        for r in parse_js(p):
            seg['loaded'][r['file']] = {'sha1': sha1_of(r['file']), 'used': r['used'], 'how': r['how']}
        seg['drawings'] = None
        return seg
    else:
        raise SystemExit(f'not a render folder, audit/deps json or page js: {arg}')
    if audit and not audit.get('_missing'):
        seg['id'] = audit.get('id') or seg['id']
        if isinstance(audit.get('drawings'), list):
            seg['drawings'] = sorted(({'file': norm(d['file']), 'start': float(d['start']), 'end': float(d['end'])} for d in audit['drawings']),
                                     key=lambda d: (d['start'], d['end']))
        else:
            seg['notes'].append('audit.json has no drawings')
    elif audit is not None:
        seg['notes'].append('the page did not set window.__audit')
    if deps:
        for f in deps.get('files', []):
            rel = norm(f['path'])
            if rel.startswith(art_prefix) and rel.lower().endswith(('.png', '.webp', '.jpg')):
                seg['loaded'][rel] = {'sha1': f.get('sha1'), 'status': f.get('status', 200)}
    if seg['drawings'] is None and not seg['loaded']:
        seg['notes'].append('no drawings and no loaded art found')
    for d in seg['drawings'] or []:
        seg['loaded'].setdefault(d['file'], {'sha1': sha1_of(d['file'])})
    return seg


def aba(drawings):
    """A -> B -> A: a drawing back on screen after another drawing came on after it."""
    out = []
    for i, d in enumerate(drawings):
        for later in drawings[i + 1:]:
            if later['file'] != d['file'] or later['start'] < d['end'] - 1e-6:
                continue
            between = [x for x in drawings if x['file'] != d['file'] and d['start'] < x['start'] < later['start']]
            if between:
                out.append({'a': d['file'], 'b': between[0]['file'], 'first': [d['start'], d['end']], 'back': [later['start'], later['end']]})
            break
    return out


def fmt_t(t):
    m = int(t // 60)
    return f'{m}:{t - 60 * m:05.2f}'


def main():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('segments', nargs='+')
    ap.add_argument('--out', default=os.path.join(ROOT, 'work', 'infra', 'reuse_audit.md'))
    ap.add_argument('--art-prefix', default='art/')
    a = ap.parse_args()
    segs = [load_segment(s, a.art_prefix) for s in a.segments]

    # drawing -> uses
    uses = defaultdict(list)         # file -> [(seg id, start, end)]
    loaded_in = defaultdict(list)    # file -> [seg id]
    for s in segs:
        for d in s['drawings'] or []:
            uses[d['file']].append((s['id'], d['start'], d['end']))
        for f, info in s['loaded'].items():
            loaded_in[f].append(s['id'])
            if s['inferred'] and info.get('used'):
                uses[f].append((s['id'], None, None))
    flags = {'cross_segment': [], 'loaded_not_shown': [], 'aba': [], 'same_content': [], 'missing': []}
    for s in segs:
        for f, info in s['loaded'].items():
            if info.get('status') == 404 or (s['inferred'] and not os.path.isfile(os.path.join(ROOT, f))):
                flags['missing'].append({'segment': s['id'], 'file': f})
    for f, u in sorted(uses.items()):
        ids = sorted(set(x[0] for x in u))
        if len(ids) > 1:
            flags['cross_segment'].append({'file': f, 'segments': ids})
    for s in segs:
        shown = set(d['file'] for d in s['drawings'] or []) if not s['inferred'] else set(f for f, i in s['loaded'].items() if i.get('used'))
        if s['drawings'] is not None or s['inferred']:
            for f in s['loaded']:
                if f not in shown:
                    flags['loaded_not_shown'].append({'segment': s['id'], 'file': f, 'inferred': s['inferred']})
        if s['drawings']:
            for x in aba(s['drawings']):
                flags['aba'].append({'segment': s['id'], **x})
    by_sha = defaultdict(set)
    for s in segs:
        for f, info in s['loaded'].items():
            if info.get('sha1'):
                by_sha[info['sha1']].add(f)
    for h, fs in by_sha.items():
        if len(fs) > 1:
            flags['same_content'].append({'sha1': h, 'files': sorted(fs)})

    L = ['# 人物图复用表', '', f'由 `tools/reuse_audit.py` 生成，输入：' + '、'.join(f'`{s["src"]}`' for s in segs) + '。', '']
    inferred = [s['id'] for s in segs if s['inferred']]
    if inferred:
        L += [f'注意：{"、".join(inferred)} 没有 audit.json，按页面 JS 推断（只知道加载了哪些图、页面里有没有再用到，没有上屏时间）。', '']
    for s in segs:
        for n in s['notes']:
            L.append(f'- {s["id"]}：{n}')
    L += ['## 一、图 → 用到它的段落和时间', '', '| 图 | 上屏（段落：时间） | 只加载未上屏 |', '|---|---|---|']
    for f in sorted(set(uses) | set(loaded_in)):
        u = uses.get(f, [])
        on = '；'.join(f'{sid} {fmt_t(t0)}–{fmt_t(t1)}（{t1 - t0:.2f}s）' if t0 is not None else f'{sid}（推断）' for sid, t0, t1 in u) or '—'
        shown_ids = set(x[0] for x in u)
        only = '、'.join(sorted(set(loaded_in.get(f, [])) - shown_ids)) or ''
        mark = ' **跨段**' if len(shown_ids) > 1 else ''
        L.append(f'| `{f}`{mark} | {on} | {only} |')
    L += ['', '## 二、段落 → 用到的图', '']
    for s in segs:
        L.append(f'### {s["id"]}' + ('（推断）' if s['inferred'] else ''))
        L.append('')
        if s['drawings']:
            L += ['| 顺序 | 图 | 上屏 | 停留 |', '|---|---|---|---|']
            for k, d in enumerate(s['drawings'], 1):
                L.append(f'| {k} | `{d["file"]}` | {fmt_t(d["start"])}–{fmt_t(d["end"])} | {d["end"] - d["start"]:.2f}s |')
        elif s['inferred']:
            L += ['| 图 | 页面里再用到 | 依据 |', '|---|---|---|']
            for f, i in s['loaded'].items():
                L.append(f'| `{f}` | {"是" if i["used"] else "**否**"} | {i["how"]} |')
        else:
            L.append('（没有上屏记录）')
        L.append('')
    L += ['## 三、要看的地方', '']
    L.append(f'- 跨段上屏：{len(flags["cross_segment"])}')
    for x in flags['cross_segment']:
        L.append(f'  - `{x["file"]}`：{"、".join(x["segments"])}（要写复用理由，并查角度和机位是否相符）')
    L.append(f'- 加载了却没上屏：{len(flags["loaded_not_shown"])}')
    for x in flags['loaded_not_shown']:
        L.append(f'  - {x["segment"]}：`{x["file"]}`' + ('（推断）' if x['inferred'] else ''))
    L.append(f'- 同一段里 A→B→A：{len(flags["aba"])}')
    for x in flags['aba']:
        L.append(f'  - {x["segment"]}：`{x["a"]}` {fmt_t(x["first"][0])} → `{x["b"]}` → 回到 `{x["a"]}` {fmt_t(x["back"][0])}')
    L.append(f'- 同一内容不同文件名：{len(flags["same_content"])}')
    for x in flags['same_content']:
        L.append(f'  - ' + '、'.join(f'`{f}`' for f in x['files']))
    L.append(f'- 页面请求了但文件不存在（404）：{len(flags["missing"])}')
    for x in flags['missing']:
        L.append(f'  - {x["segment"]}：`{x["file"]}`')
    L.append('')
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))
    with open(os.path.splitext(a.out)[0] + '.json', 'w', encoding='utf-8') as f:
        json.dump({'segments': [{k: v for k, v in s.items()} for s in segs], 'flags': flags}, f, ensure_ascii=False, indent=1)
    print(f'reuse audit: {len(segs)} segments, {len(set(uses) | set(loaded_in))} drawings; cross-segment {len(flags["cross_segment"])}, '
          f'loaded not shown {len(flags["loaded_not_shown"])}, A->B->A {len(flags["aba"])}, same content {len(flags["same_content"])}, missing {len(flags["missing"])}')
    print('written:', a.out)
    return 0


if __name__ == '__main__':
    sys.exit(main())
