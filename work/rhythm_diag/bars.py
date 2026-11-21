import json, sys
import numpy as np
D = json.load(open('drums.json')); bt = D['beats']
a, b = int(sys.argv[1]), int(sys.argv[2])
for k0 in range(a - a % 4, b, 4):
    row = []
    for k in range(k0, min(k0 + 4, len(bt))):
        x = bt[k]
        acc = x['kick'] + x['snare']
        row.append(f"k{k}:{'K' if x['kick']>0.9 else 'k' if x['kick']>0.6 else '.'}{'S' if x['snare']>1.1 else 's' if x['snare']>0.75 else '.'}{'C' if (x['crash_db'] or 0)>6 else ' '} {x['rms_db']:4.1f}/{x['hi_db']:4.1f}")
    print(f"{bt[k0]['t']:6.2f} | " + '  '.join(row))
