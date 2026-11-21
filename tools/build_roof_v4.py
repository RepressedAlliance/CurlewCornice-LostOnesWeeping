"""Roof riff, the 3D demo (docs/demo说明.md), under docs/交付检查清单.md:
still cameras (the only moves: the rush on the second crash and the pull-back at the end); the rings aimed once per
shot and turning only on the crashes and the bar lines; the close-ups held still on a still sky; every close-up picture
used once (the picking hand is a true down/up cycle); all faces from the face master rface_mb.
Writes work/v4/*.txt and manifest.json; tools/cut_roof_v4.py edits it.
"""
import json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'work', 'v4')
os.makedirs(OUT, exist_ok=True)
T0, T1, BEAT, FPS = 98.13, 109.98, 60 / 162, 30
t = lambda b: round(T0 + b * BEAT, 4)

DRAW = ['rlow3_master_k_an', 'rlow3_bang_an', 'rlow3_back_an', 'rlow3_jump_an', 'rlow3_stroke_an', 'rlow3_stomp_an', 'rlow3_up_k_an',
        'rlow3_fist_k_an', 'rlow3_down_k_an', 'rlow3_crouch_an', 'rlow3_land_an', 'rlow3_bangmid_an', 'rlow3_bangup_an',
        'rback_an', 'rback_w1', 'rback_w2', 'rlow3_back_w1', 'rlow3_back_w2']
(MASTER, BANG, BACK, JUMP, STROKE, STOMP, UP, FIST, DOWN, CROUCH, LAND, BMID, BUP, RBACK, RW1, RW2, BW1, BW2) = range(18)
HEADUV = ('0.443,0.094;0.531,0.178;0.218,0.161;0.440,0.094;0.445,0.139;0.487,0.196;0.558,0.095;0.442,0.093;0.455,0.165;0.450,0.510;'
          '0.450,0.188;0.620,0.143;0.373,0.143;0.614,0.101;0.614,0.101;0.614,0.101;0.218,0.161;0.218,0.161')
CABYS = '0.9974,0.9980,0.9948,0.9316,0.9974,0.9974,0.9980,0.9967,0.9974,0.9954,0.9844,0.9974,0.9987,0.9915,0.9915,0.9915,0.9948,0.9948'
CABXS = ','.join(['0.002'] * 13 + ['0.997'] * 3 + ['0.002'] * 2)
RHS = ','.join(['0'] * 13 + ['1.66'] * 3 + ['0'] * 2)

# (start beat, source, camera: dist0>dist1:cx0>cx1:roll0>roll1[:ch0>ch1:pitch0>pitch1]) -- still unless it says '>'
SHOTS = [
    (0, 'worm', '2.6:0:-4'),
    (1, 'main', '1.85:0:-4'),
    (8, 'main', '2.0:-0.35:2'),
    (10, 'face_in', '2:0:0'), (11, 'face_scr', '2:0:0'),
    (12, 'main', '1.6:-0.2:6'),
    (16, 'main', '24:0:-6:7:-14'), (17, 'main', '1.5:0:-3'),     # a hard cut from the far wide to the close-up, both still
    (18, 'hand', '2:0:0'),
    (20, 'main', '1.8:0.6:-6'),
    (24, 'card', '2:0:0'), (25, 'feet2', '2:0:0'), (25.5, 'feet', '2:0:0'), (26, 'face_cl', '2:0:0'),
    (27, 'main', '1.6:0.1:6'),
    (28, 'eye', '2:0:0'), (28.5, 'main', '1.2:-0.2:-11'), (29, 'face_up', '2:0:0'), (29.5, 'main', '1.3:0.25:10'),
    (30, 'main', '1.3:0.3:-10'), (30.5, 'main', '1.25:-0.15:8'),
    (31, 'main', '1.4>2.4:0>0:-4>0'),
]
two = 2 / (BEAT * FPS)
def headbang(b0, b1):            # the head lands on every beat; the in-betweens are two frames each
    out = []
    for n in range(b0, b1):
        out += [(n, BANG), (round(n + 0.45, 3), BUP), (round(n + 0.45 + two, 3), MASTER), (round(n + 1 - two, 3), BMID)]
    return out
PTL = (headbang(1, 6) + [(6, STROKE), (7, FIST)] +
       [(8, RBACK), (8.5, RW1), (9, RBACK), (9.5, RW2)] +
       [(12, CROUCH), (12.5, JUMP), (13.25, LAND), (13.75, STOMP), (14, BACK), (14.5, BW1), (15, BACK), (15.5, BW2)] +
       [(16, STROKE), (17, FIST)] + headbang(20, 24) +
       [(27, LAND), (28.5, BUP), (29.5, STROKE), (30, STOMP), (30.5, FIST), (31, BACK)])
# rings reached by each beat: a burst on each crash, one ring on every bar line, nothing in between
RKEYS = ('-1:0,0:0,1.8:4,3.95:4,4:4,4.4:6,7.95:6,8:6,8.4:8,11.95:8,12:8,12.4:10,15.95:10,16:10,16.7:15,19.95:15,20:15,20.4:17,'
         '23.95:17,24:17,24.4:19,27.95:19,28:19,28.4:21,30.95:21,31:21,31.6:26')

base = open(os.path.join(ROOT, 'work', 'v3', 'main_query.txt'), encoding='utf-8').read().strip()
drop = {'rin', 'cabys', 'cabxs', 'headuv', 'ptl', 'camkeys', 'rkeys', 'hits', 'rhs', 'shkcr', 'shk', 'hfollow'}
kv = [x for x in base.split('&') if x and x.split('=')[0] not in drop]
main = kv + ['rin=' + ','.join(DRAW), f'cabys={CABYS}', f'cabxs={CABXS}', f'rhs={RHS}', f'headuv={HEADUV}',
             'ptl=' + ','.join(f'{b}:{k}' for b, k in PTL), 'camkeys=' + '|'.join(f'{b}:{c}' for b, _, c in SHOTS),
             f'rkeys={RKEYS}', 'hits=', 'shk=0', 'shkcr=0']
open(os.path.join(OUT, 'main_query.txt'), 'w', encoding='utf-8').write('&'.join(main))

plates = {'plate_sky': 'camkeys=0:2.4:0:10:0.9:48', 'plate_worm': 'camkeys=0:1.4:0:0:0.12:28&haimy=7', 'plate_floor': 'camkeys=0:1.0:0:0:0.12:26'}
pkv = [x for x in kv if not x.startswith('rin=')]
for name, ck in plates.items():
    open(os.path.join(OUT, name + '_query.txt'), 'w', encoding='utf-8').write('&'.join(pkv + [ck, f'rkeys={RKEYS}', 'hits=', 'shk=0']))
PLATE_WIN = {'plate_sky': (t(10) - 0.07, t(31) + 0.07), 'plate_worm': (t(0) - 0.07, t(1) + 0.07), 'plate_floor': (t(25) - 0.07, t(26) + 0.07)}

INS = {   # name: (image or cycle, plate, layout)
    'worm':     ('img=rworm_an', 'plate_worm', 'is=0.72&ix=960&iy=548'),
    'face_in':  ('img=rface_in', 'plate_sky', 'is=1.12&ix=960&iy=560'),
    'face_scr': ('img=rface_scr', 'plate_sky', 'is=1.12&ix=960&iy=560'),
    'hand':     ('imgs=rcu_hand2_dn,rcu_hand2_up&icyc=0.5', 'plate_sky', 'is=1.3&ix=960&iy=560'),
    'card':     ('img=rcu_card_an', 'plate_sky', 'is=1.3&ix=960&iy=560'),
    'feet2':    ('img=rcu_feet2_an', 'plate_floor', 'is=1.32&ix=960&iy=500'),
    'feet':     ('img=rcu_feet_an', 'plate_floor', 'is=1.32&ix=960&iy=500'),
    'face_cl':  ('img=rface_cl', 'plate_sky', 'is=1.12&ix=960&iy=560'),
    'eye':      ('img=rcu_eye_an', 'plate_sky', 'is=1.3&ix=960&iy=540'),
    'face_up':  ('img=rface_up', 'plate_sky', 'is=1.12&ix=960&iy=560'),
}
starts = [s[0] for s in SHOTS] + [(T1 - T0) / BEAT]
manifest = {'T0': T0, 'T1': T1, 'FPS': FPS, 'BEAT': BEAT, 'crash': [0, 16, 31], 'shots': [],
            'plates': {k: [round(a, 4), round(b, 4)] for k, (a, b) in PLATE_WIN.items()}}
for i, (b0, src, _) in enumerate(SHOTS):
    b1 = starts[i + 1]
    shot = {'b0': b0, 'b1': b1, 'src': src}
    if src != 'main':
        im, plate, lay = INS[src]
        w0, w1 = t(b0) - 2 / FPS, t(b1) + 2 / FPS
        q = (f'page=insert&{im}&{lay}&z0=1&z1=1&bgseq=work/v4/{plate}&bgt0={round(PLATE_WIN[plate][0], 4)}&bgz=1.0'
             f'&t0={t(b0)}&t1={t(b1)}&shk=0&shx=0&shy=0&hits=')
        open(os.path.join(OUT, f'ins_{src}_query.txt'), 'w', encoding='utf-8').write(q)
        shot.update({'dir': f'work/v4/ins_{src}', 'w0': round(w0, 4), 'w1': round(w1, 4), 'start': round((w0 - T0) * FPS)})
    manifest['shots'].append(shot)
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print(len(SHOTS), 'shots;', sum(1 for s in SHOTS if s[1] != 'main'), 'close-ups')
