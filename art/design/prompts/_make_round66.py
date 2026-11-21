"""Round 66: the slip master (candidate c): a blink, and the smile cracking on オチ (stronger than round 64's: the mouth and
brows must visibly change)."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
V = {'rslip_blink': "her eyes CLOSED in a blink (upper lids down, lashes as simple lines); everything else exactly as it is, the slip blank.",
     'rslip_crack': "her stiff smile CRACKS: the eyebrows lift and pinch together in the middle, the eyes open wider and fill with tears that "
                    "well on the lower lids (not falling yet), the mouth's corners still trying to smile but the lips pressed and trembling into "
                    "a wavy line; her hands grip the slip a little tighter. Everything else exactly as it is, the slip still blank and flat."}
for n, ch in V.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print(len(V), 'prompts')
