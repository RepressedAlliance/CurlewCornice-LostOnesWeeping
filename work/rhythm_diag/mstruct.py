import json, os, sys
import numpy as np
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'drums.json')))
bt = D['beats']; sl = D['slots']
SEG = [('00', 0, 8), ('01', 8, 36), ('02', 36, 40), ('03', 40, 71), ('04', 71, 104), ('05', 104, 135), ('06', 135, 171), ('07', 171, 199),
       ('08a', 199, 232), ('08b', 232, 264), ('09', 264, 295), ('10', 295, 327), ('11', 327, 359), ('12', 359, 423), ('13', 423, 455),
       ('14', 455, 488), ('15', 488, 556), ('16', 556, 573)]
K = np.array([b['kick'] for b in bt]); Sn = np.array([b['snare'] for b in bt]); Hh = np.array([b['hat'] for b in bt])
Cr = np.nan_to_num(np.array([b['crash_db'] for b in bt])); R = np.array([b['rms_db'] for b in bt]); V = np.array([b['voc_db'] for b in bt])
mode = sys.argv[1] if len(sys.argv) > 1 and __name__ == "__main__" else "none"
if mode == 'phase':
    for name, a, b in SEG:
        ks = np.arange(a, min(b, len(bt)))
        print(name, 'kick by k%4', [round(float(K[ks[ks % 4 == j]].mean()), 2) for j in range(4)],
              'snare', [round(float(Sn[ks[ks % 4 == j]].mean()), 2) for j in range(4)],
              'hat', round(float(Hh[ks].mean()), 2), 'rms', round(float(R[ks].mean()), 1), 'voc', round(float(V[ks].mean()), 1))
if mode == 'seg':
    a, b = int(sys.argv[2]), int(sys.argv[3])
    for k in range(a, b):
        x = bt[k]
        sub = ''.join('K' if v > 0.55 else ('k' if v > 0.3 else '.') for v in x['sub'])
        subs = ''.join('S' if v > 0.55 else ('s' if v > 0.3 else '.') for v in x['subs'])
        print(f"k{k:3d} t{x['t']:7.2f} {'|' if k % 4 == 0 else ' '} kick{x['kick']:.2f} sn{x['snare']:.2f} hat{x['hat']:.2f} cr{x['crash_db']:5.1f} rms{x['rms_db']:6.1f} hi{x['hi_db']:6.1f} voc{x['voc_db']:6.1f}  {sub} {subs}")
