"""Round 64: her punchline face (rface_ochi = candidate b) holds for three seconds; a blink, and the smile cracking on オチ."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
V = {'rface_ochi_blink': "her eyes CLOSED in a blink (the upper lids down, lashes as simple lines); everything else exactly as it is.",
     'rface_ochi_crack': "the stiff smile is starting to crack: the corners of her mouth still up but trembling into a wobble, her eyes a "
                         "little wider and wet, a tear welling on the lower lid of each eye but not falling, the eyebrows rising in the "
                         "middle; everything else exactly as it is."}
for n, ch in V.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print(len(V), 'prompts')
