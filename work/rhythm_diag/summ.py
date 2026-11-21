import json, os
import numpy as np
D = json.load(open('drums.json')); bt = D['beats']; sl = D['slots']
from mstruct import SEG
R = np.array([b['rms_db'] for b in bt]); Hd = np.array([b['hi_db'] for b in bt]); V = np.array([b['voc_db'] for b in bt])
Cr = np.nan_to_num(np.array([b['crash_db'] for b in bt]))
Sn = np.array([b['snare'] for b in bt]); K = np.array([b['kick'] for b in bt])
# fill score: off-beat 16th snare activity
SS = np.array([[s['snare'] for s in sl[4*k:4*k+4]] for k in range(len(bt))])
KK = np.array([[s['kick'] for s in sl[4*k:4*k+4]] for k in range(len(bt))])
fill = SS[:, 1:].mean(1) + KK[:, 1:].mean(1) * 0.5
med = np.median(fill)
for name, a, b in SEG:
    ks = np.arange(a, min(b, len(bt)))
    cr = [int(k) for k in ks if Cr[k] > 6]
    rm = np.median(R[ks])
    brk = [int(k) for k in ks if R[k] < rm - 4]
    fz = [int(k) for k in ks if fill[k] > np.percentile(fill, 93)]
    acc = sorted(ks, key=lambda k: -(K[k] + Sn[k]))[:6]
    print(f"{name} k{a}-{b} rms{rm:5.1f} hi{np.median(Hd[ks]):5.1f} voc{np.median(V[ks]):5.1f} | crash {cr} | dips {brk} | fills {fz} | top {sorted(int(x) for x in acc)}")
