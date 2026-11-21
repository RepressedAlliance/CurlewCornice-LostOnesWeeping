"""Write art/cut/seg14f_anchors.json: her drawings (px per metre, centre column, canvas top height, card corners TL/TR/BL,
the open hand of the throw), the six new town people and the two crisp close-up redraws (work/seg/14/town_anchors.json). Card corners: the paper-white
blob of the card (work/seg/14/measure.py) for the square-on cards; given by hand (CARD_HAND) for the tilted ones.
usage: python work/seg/14/make_anchors.py"""
import json, subprocess, sys, re, os
sys.path.insert(0, 'work/seg/14')
ROOT = 'art/cut/seg14f_anchors.json'
STD = {'ppm': 1300, 'cx': 1014, 'top': 1.70}          # the master's framing (art/design/prompts/_make_seg14f.py)
WIDE = {'ppm': 1200, 'cx': 1167, 'top': 1.75}         # R14f_throw's wider canvas
CARD_HAND = json.load(open('work/seg/14/card_hand.json', encoding='utf-8')) if os.path.exists('work/seg/14/card_hand.json') else {}
names = ['R14f_down2', 'R14f_see', 'R14f_askL', 'R14f_askL3', 'R14f_askR', 'R14f_grip', 'R14f_grip2', 'R14f_yank', 'R14f_throw', 'R14f_throw2']
out = {'_note': __doc__, 'rin': {}, 'town': json.load(open('work/seg/14/town_anchors.json', encoding='utf-8')),
       # 佐藤 and 高橋 redrawn crisp for the close two-shot: the world box of each canvas (metres about the person's x), registered
       # on their 01 drawings by alpha overlap (IoU 0.995; art/design/prompts/_make_seg14g.py)
       'hires': json.load(open('work/seg/14/hires_reg.json', encoding='utf-8'))}
for n in names:
    a = dict(WIDE if n.startswith('R14f_throw') else STD)
    if not n.startswith('R14f_throw') and 'card' not in CARD_HAND.get(n, {}):
        r = subprocess.run([sys.executable, 'work/seg/14/measure.py', n], capture_output=True, text=True).stdout
        m = re.search(r"'card': \[(\d+), (\d+), (\d+), (\d+)\]", r)
        x, y, w, h = map(int, m.groups()); a['card'] = [[x, y], [x + w, y], [x, round(y + w / 1.5)]]
    a.update(CARD_HAND.get(n, {}))
    out['rin'][n] = a
json.dump(out, open(ROOT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(out['rin'], indent=0))
