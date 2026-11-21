"""Override parameters of a scene query file: python tools/qset.py in.txt out.txt key=value ... (key= removes it)."""
import sys
src, dst, *sets = sys.argv[1:]
kv = [x for x in open(src, encoding='utf-8').read().strip().split('&') if x]
for st in sets:
    k, v = st.split('=', 1)
    kv = [x for x in kv if x.split('=', 1)[0] != k]
    if v != '': kv.append(f'{k}={v}')
open(dst, 'w', encoding='utf-8').write('&'.join(kv))
