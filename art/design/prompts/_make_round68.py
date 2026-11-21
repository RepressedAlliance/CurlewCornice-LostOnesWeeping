"""Round 68 (after the fifth reviews): the cracked smile needs more than one drawing over its 1.3 s (a trembling mouth with a tear
falling; a blink that keeps the wavy mouth); the writing hand needs a pressing drawing (not only one drawing moved about)."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
V = {
 'rface_ochi_crack2': ("the cracked smile trembling further: the lips parted a little in a shaky wavy line, one tear running down each cheek from "
                       "the lower lids, the eyebrows lifted in the middle; everything else exactly as it is."),
 'rface_ochi_crackblink2': ("her eyes CLOSED tight in a blink, the tears squeezed out along the lashes, the mouth EXACTLY the same trembling wavy line "
                            "as before (not a smile), the eyebrows lifted in the middle; everything else exactly as it is."),
 'hpen3_press': ("the hand PRESSING the pencil down onto the paper: the fingertips whiter with pressure, the index finger bent a little more, "
                 "the pencil a little more upright, the wrist dipped a few degrees; the same hand, sleeve, pencil, size and position."),
}
for n, ch in V.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print(len(V), 'prompts')
