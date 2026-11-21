"""Merge URL query strings; later keys override earlier ones. usage: python tools/qmerge.py "a=1&b=2" "b=3&c=4" -> a=1&b=3&c=4"""
import sys
sys.stdout.reconfigure(encoding="utf-8")
out = {}
for q in sys.argv[1:]:
    for part in q.split('&'):
        if not part: continue
        k, _, v = part.partition('=')
        out.pop(k, None); out[k] = v
print('&'.join(f'{k}={v}' for k, v in out.items()))
