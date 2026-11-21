"""Roof riff (1:38.13-1:49.98), third version: queries, render windows and the edit, from one shot list.
Writes work/v3/*.txt queries and work/v3/manifest.json; tools/cut_roof_v3.py edits the frames by the manifest.

Shot list in beats from 1:38.13 (162 BPM, 8 bars; crashes on beats 0, 16, 31):
  hits get the most extreme pictures, every wide shot has its own set-up, the rings keep turning, and in the last
  two bars every close-up picture is used once.
usage: python tools/build_roof_v3.py [--cycles 0|1]   (cycles=1: headbang loops on the eighth notes)
"""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'work', 'v3')
os.makedirs(OUT, exist_ok=True)
T0, T1, BEAT, FPS = 98.13, 109.98, 60 / 162, 30
t = lambda b: round(T0 + b * BEAT, 4)
CYCLES = '--cycles' in sys.argv and sys.argv[sys.argv.index('--cycles') + 1] == '1'

# the drawings in the 3D shots (index = position in rin=)
DRAW = ['rlow3_master_k_an', 'rlow3_bang_an', 'rlow3_back_an', 'rlow3_jump_an', 'rlow3_stroke_an', 'rlow3_stomp_an', 'rlow3_up_k_an',
        'rlow3_fist_k_an', 'rlow3_down_k_an', 'rlow3_crouch_an', 'rlow3_land_an', 'rlow3_bangmid_an', 'rlow3_bangup_an', 'rback_an']
MASTER, BANG, BACK, JUMP, STROKE, STOMP, UP, FIST, DOWN, CROUCH, LAND, BMID, BUP, RBACK = range(14)
HEADUV = '0.443,0.094;0.531,0.178;0.218,0.161;0.440,0.094;0.445,0.139;0.487,0.196;0.558,0.095;0.442,0.093;0.455,0.165;0.450,0.510;0.450,0.188;0.620,0.143;0.373,0.143;0.614,0.101'
CABYS = '0.9974,0.9980,0.9948,0.9316,0.9974,0.9974,0.9980,0.9967,0.9974,0.9954,0.9844,0.9974,0.9987,0.9915'
CABXS = ','.join(['0.002'] * 13 + ['0.997'])
RHS = ','.join(['0'] * 13 + ['1.66'])

# (start beat, source, 3D drawing or None, camera key) -- camera key: dist0>dist1:cx0>cx1:roll0>roll1[:ch0>ch1:pitch0>pitch1]
SHOTS = [
    (0, 'worm', None, '2.6:0:-4'),
    (2, 'main', None, '2.9>2.2:0>0:-5>-3'),
    (8, 'main', RBACK, '2.1>1.9:-0.35>-0.3:2>3'),
    (10, 'face3', None, '2:0:0'), (11, 'face', None, '2:0:0'),
    (12, 'main', None, '1.7>1.4:-0.3>-0.1:8>10'),
    (16, 'main', None, '24>1.6:0>0:-6>-3:7>0.85:-14>10'),
    (17, 'main', None, '1.6>1.45:0>0:-3>-2'),
    (18, 'high', None, '2:0:0'),
    (20, 'main', None, '2.5>2.1:0.9>0.6:-8>-6'),
    (24, 'card', None, '2:0:0'), (25, 'feet2', None, '2:0:0'), (25.5, 'feet', None, '2:0:0'), (26, 'face2', None, '2:0:0'),
    (27, 'main', LAND, '1.6>1.5:0.1>0.1:6>7'),
    (28, 'eye', None, '2:0:0'), (28.5, 'main', BUP, '1.2>1.15:-0.2>-0.2:-11>-12'),
    (29, 'face4', None, '2:0:0'), (29.5, 'main', UP, '1.3>1.25:0.25>0.25:10>11'),
    (30, 'main', STOMP, '1.3>1.25:0.3>0.3:-10>-11'), (30.5, 'hand', None, '2:0:0'),
    (31, 'main', BACK, '1.4>2.4:0>0:-4>0'),
]
# the drawings through the 3D shots, by beat
if CYCLES:
    W1 = [(2, MASTER), (2.5, BMID), (3, BANG), (3.5, BUP), (4, MASTER), (4.5, BMID), (5, BANG), (5.5, BUP), (6, STROKE), (7, FIST), (7.5, DOWN)]
    W5 = [(20, BMID), (20.5, BANG), (21, BUP), (21.5, MASTER), (22, BMID), (22.5, BANG), (23, BUP), (23.5, STROKE)]
else:
    W1 = [(2, MASTER), (3, BANG), (4, STROKE), (5, STOMP), (6, FIST), (7, DOWN)]
    W5 = [(20, BANG), (21, STROKE), (22, DOWN), (23, BUP)]
PTL = W1 + [(8, RBACK), (12, CROUCH), (12.5, JUMP), (13.25, LAND), (13.75, STOMP), (14, BACK), (16, STROKE), (17, FIST)] + W5 + \
      [(27, LAND), (28.5, BUP), (29.5, UP), (30, STOMP), (31, BACK)]
# rings of the vortex reached by each beat: bursts on the crashes, a ring every two or three beats in between
RKEYS = '-1:0,0:0,0.75:5,15.9:11,16:11,16.75:18,30.9:22,31:22,31.6:26'
CRASH = '0,16,31'

base = open(os.path.join(ROOT, 'work', 'seq_roof_night2_query.txt'), encoding='utf-8').read().strip()
drop = {'rin', 'cabys', 'cabx', 'cabxs', 'headuv', 'ptl', 'camkeys', 'rkeys', 'hits', 'crash', 'shk', 'shkc', 'shkcr', 'rhs', 'hn', 'halo',
        'vortex', 'hd', 'hgt', 'flipdur', 'rjit', 'feetalign', 'lifts'}
kv = [x for x in base.split('&') if x and x.split('=')[0] not in drop]
common = kv + ['halo=1', 'vortex=1', 'hn=26', 'hd0=16', 'hdg=0.12', 'ha0=0.05', 'hda=0.032', 'hcw=1.4', 'hgt=0.45', 'hmine=3.5',
               f'rkeys={RKEYS}', 'flipdur=0.14', 'rjit=0.5', f'crash={CRASH}', 'skydark=0.8', 'blackout=31', 'bodur=0.25']
main = common + ['rin=' + ','.join(DRAW), f'cabys={CABYS}', f'cabxs={CABXS}', f'rhs={RHS}', f'headuv={HEADUV}', 'feetalign=0',
                 'ptl=' + ','.join(f'{b}:{k}' for b, k in PTL),
                 'camkeys=' + '|'.join(f'{b}:{ck}' for b, _, _, ck in SHOTS),
                 'hits=' + ','.join(f'{b}:0.10' for b in (0, 16, 31)), 'shk=0', 'shkcr=0.6']
open(os.path.join(OUT, 'main_query.txt'), 'w', encoding='utf-8').write('&'.join(main))

# plates for the close-ups: the same scene without her, from fixed set-ups, so their skies turn black with the rest
plates = {
    'plate_sky': 'camkeys=0:2.4:0:10:0.9:48',             # looking up at the vortex
    'plate_worm': 'camkeys=0:1.4:0:0:0.12:28&haimy=7',            # from the floor in front of her feet
    'plate_floor': 'camkeys=0:1.0:0:0:0.12:26',           # floor level behind the stomping foot
    'plate_high': 'camkeys=0:2.2:0:0:4.2:-62',            # from above: the roof floor and the town round it
}
for name, ck in plates.items():
    open(os.path.join(OUT, name + '_query.txt'), 'w', encoding='utf-8').write('&'.join(common + [ck, 'hits=', 'shk=0']))

# close-ups: (image, plate, layout) -- rendered only over their own window (plus a frame each side)
INS = {
    'worm':  ('rworm_an', 'plate_worm', 'is=0.7&ix=960&iy=540&z0=1.0&z1=1.07'),
    'face3': ('rcu_face3_an', 'plate_sky', 'is=1.22&ix=960&iy=600&z0=1.0&z1=1.04'),
    'face':  ('rcu_face_an', 'plate_sky', 'is=1.22&ix=980&iy=600&z0=1.03&z1=1.08'),
    'high':  ('rhigh_an', 'plate_high', 'is=0.95&ix=960&iy=560&z0=1.06&z1=1.0'),
    'card':  ('rcu_card_an', 'plate_sky', 'is=1.3&ix=960&iy=560&z0=1.0&z1=1.08'),
    'feet2': ('rcu_feet2_an', 'plate_floor', 'is=1.32&ix=960&iy=500&z0=1.0&z1=1.02'),
    'feet':  ('rcu_feet_an', 'plate_floor', 'is=1.32&ix=960&iy=500&z0=1.04&z1=1.0'),
    'face2': ('rcu_face2_an', 'plate_sky', 'is=1.22&ix=940&iy=600&z0=1.0&z1=1.05'),
    'eye':   ('rcu_eye_an', 'plate_sky', 'is=1.3&ix=960&iy=540&z0=1.0&z1=1.06'),
    'face4': ('rcu_face4_an', 'plate_sky', 'is=1.22&ix=980&iy=600&z0=1.0&z1=1.05'),
    'hand':  ('rcu_hand2_dn', 'plate_sky', 'is=1.2&ix=960&iy=560&z0=1.0&z1=1.06'),
}
# the plates are rendered only over the windows they are used in (plate_sky over the whole riff)
PLATE_WIN = {'plate_sky': (T0, T1), 'plate_worm': (t(0) - 0.07, t(2) + 0.07), 'plate_floor': (t(25) - 0.07, t(26) + 0.07),
             'plate_high': (t(18) - 0.07, t(20) + 0.07)}
starts = [s[0] for s in SHOTS] + [(T1 - T0) / BEAT]
manifest = {'T0': T0, 'T1': T1, 'FPS': FPS, 'BEAT': BEAT, 'crash': [0, 16, 31], 'shots': [],
            'plates': {k: [round(a, 4), round(b, 4)] for k, (a, b) in PLATE_WIN.items()}}
for i, (b0, src, _, _) in enumerate(SHOTS):
    b1 = starts[i + 1]
    shot = {'b0': b0, 'b1': b1, 'src': src}
    if src != 'main':
        img, plate, lay = INS[src]
        w0, w1 = t(b0) - 2 / FPS, t(b1) + 2 / FPS
        q = (f'page=insert&img={img}&{lay}&bgseq=work/v3/{plate}&bgt0={round(PLATE_WIN[plate][0], 4)}&bgz=1.12&t0={t(b0)}&t1={t(b1)}&shk=0&shx=0&shy=0'
             f'&hits=' + ','.join(f'{t(b)}:0.08' for b in (0, 16, 31) if b0 <= b < b1))
        open(os.path.join(OUT, f'ins_{src}_query.txt'), 'w', encoding='utf-8').write(q)
        shot.update({'dir': f'work/v3/ins_{src}', 'w0': round(w0, 4), 'w1': round(w1, 4), 'start': round((w0 - T0) * FPS)})
    manifest['shots'].append(shot)
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print(len(SHOTS), 'shots;', sum(1 for s in SHOTS if s[1] != 'main'), 'close-ups; cycles', CYCLES)
