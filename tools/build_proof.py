"""A three-second proof of the method, beats 4-12 of the roof riff (1:39.61-1:42.57), before anything is spread wider.
Rules (rules.py and the ココロ checks): one master per set-up, variants with one change; still camera in every shot; the
rings aimed once per shot and turning only on the bar lines; holds animated by wind phases of the same drawing.
Writes work/proof/*.txt and manifest.json; tools/cut_proof.py edits it.
"""
import json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'work', 'proof')
os.makedirs(OUT, exist_ok=True)
T0, BEAT, FPS = 98.13, 60 / 162, 30
t = lambda b: round(T0 + b * BEAT, 4)
B0, B1 = 4, 12

DRAW = ['rlow3_master_k_an', 'rlow3_bang_an', 'rlow3_bangmid_an', 'rlow3_bangup_an', 'rback_an', 'rback_w1', 'rback_w2']
MASTER, BANG, BMID, BUP, RBACK, RW1, RW2 = range(7)
HEADUV = '0.443,0.094;0.531,0.178;0.620,0.143;0.373,0.143;0.614,0.101;0.614,0.101;0.614,0.101'
CABYS = '0.9974,0.9980,0.9974,0.9987,0.9915,0.9915,0.9915'
CABXS = '0.002,0.002,0.002,0.002,0.997,0.997,0.997'
RHS = '0,0,0,0,1.66,1.66,1.66'

# a headbang on every beat: the head lands on the beat, the in-betweens are two frames each
two = 2 / (BEAT * FPS)
PTL = []
for n in range(4, 8):
    PTL += [(n, BANG), (n + 0.45, BUP), (round(n + 0.45 + two, 3), MASTER), (round(n + 1 - two, 3), BMID)]
PTL += [(8, RBACK), (8.5, RW1), (9, RBACK), (9.5, RW2)]          # wind: rest, gust, rest, the other gust
CAM = [(4, '2.35:0:-4'), (8, '2.0:-0.35:2'), (10, '2:0:0')]        # still cameras
RKEYS = '-1:0,0:0,0.6:5,3.95:5,4:5,4.45:7,7.95:7,8:7,8.45:9,40:9'  # the rings turn only on the bar lines

base = open(os.path.join(ROOT, 'work', 'v3', 'main_query.txt'), encoding='utf-8').read().strip()
drop = {'rin', 'cabys', 'cabxs', 'headuv', 'ptl', 'camkeys', 'rkeys', 'hits', 'rhs', 'shkcr', 'shk', 'blackout'}
kv = [x for x in base.split('&') if x and x.split('=')[0] not in drop]
main = kv + ['rin=' + ','.join(DRAW), f'cabys={CABYS}', f'cabxs={CABXS}', f'rhs={RHS}', f'headuv={HEADUV}',
             'ptl=' + ','.join(f'{b}:{k}' for b, k in PTL), 'camkeys=' + '|'.join(f'{b}:{c}' for b, c in CAM),
             f'rkeys={RKEYS}', 'hits=', 'shk=0', 'shkcr=0']
open(os.path.join(OUT, 'main_query.txt'), 'w', encoding='utf-8').write('&'.join(main))
plate = [x for x in kv if not x.startswith('rin=')] + ['camkeys=0:2.4:0:10:0.9:48', f'rkeys={RKEYS}', 'hits=', 'shk=0']
open(os.path.join(OUT, 'plate_sky_query.txt'), 'w', encoding='utf-8').write('&'.join(plate))

INS = {'face_in': ('rface_in', 10, 11), 'face_scr': ('rface_scr', 11, 12)}
shots = [{'b0': 4, 'b1': 8, 'src': 'main'}, {'b0': 8, 'b1': 10, 'src': 'main'}]
for name, (img, b0, b1) in INS.items():
    w0, w1 = t(b0) - 2 / FPS, t(b1) + 2 / FPS
    q = (f'page=insert&img={img}&is=1.0&ix=960&iy=540&z0=1&z1=1&bg=proof_plate_sky&bgz=1.0&t0={t(b0)}&t1={t(b1)}&shk=0&shx=0&shy=0&hits=')
    open(os.path.join(OUT, f'ins_{name}_query.txt'), 'w', encoding='utf-8').write(q)
    shots.append({'b0': b0, 'b1': b1, 'src': name, 'dir': f'work/proof/ins_{name}', 'w0': round(w0, 4), 'w1': round(w1, 4),
                  'start': round((w0 - T0) * FPS)})
json.dump({'T0': T0, 'BEAT': BEAT, 'FPS': FPS, 'b0': B0, 'b1': B1, 'win': [t(B0), t(B1)], 'shots': shots},
          open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print('ok', t(B0), t(B1))
