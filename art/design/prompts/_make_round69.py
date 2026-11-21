"""Round 69: in-betweens, so the changes play as motion (ココロ: draw the in-between from the two key drawings, two frames each,
the arrival on the beat). Two candidates each:
- rface_ochi_half2: between rface_ochi_half (the smile slipping) and rface_ochi_crack (cracked, eyes wet)
- rmid_upmid: between rmid_bmid2 (head halfway down) and rmid_up (head thrown back screaming): the head coming up through level
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
V = {
 'rface_ochi_half2': ("the moment HALFWAY between this face and the cracked face in the second attached image: the eyebrows lifted further, the "
                      "eyes wider with tears just gathering, the smile half gone into a wavering line; everything else exactly as it is."),
 'rmid_upmid': ("the moment HALFWAY between this pose and the head-thrown-back scream in the second attached image: her head coming up through "
                "level, chin lifting, eyes shut, mouth opening into the scream, her hair swinging back from her face, the bow's two loops "
                "upright; her hands, guitar, body and framing stay as they are."),
}
for n, ch in V.items():
    for suf in ('_a', '_b'):
        open(os.path.join(here, n + suf + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print(len(V) * 2, 'prompts')
