"""Round 44: the roof drawings again, exactly as they are, on a transparent background. Codex's image tool makes
transparent PNGs itself, so nothing is cut out of a white background any more (white parts of the figure such as
eyes, teeth, shirt, bow and card were impossible to tell from a white ground, and every enclosed gap had to be
judged by hand).
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
T = ("Redraw the attached image exactly: the same figure, pose, face, hair, clothes, guitar, cable, card, the same framing, size and "
     "position in the canvas, the same line work, colours and shading. Change only the background: make it fully TRANSPARENT (a PNG with "
     "an alpha channel), with no white or coloured background and no ground shadow. Every part of the figure stays fully opaque, including "
     "its white parts (eye whites, teeth, shirt, bow, the name card); every gap between arms, legs, body and guitar is transparent.")
TF = T.replace("Every part of the figure", "Keep the grey concrete floor tiles exactly as drawn (they stay opaque); only the empty white area above "
     "the floor becomes transparent. Every part of the figure")
names = ['rlow3_master_k', 'rlow3_bang', 'rlow3_back', 'rlow3_jump', 'rlow3_stroke', 'rlow3_stomp', 'rlow3_up_k', 'rlow3_fist_k', 'rlow3_down_k', 'rcu_face', 'rcu_hand']
for n in names:
    open(os.path.join(here, n + '_a.txt'), 'w', encoding='utf-8').write("One illustration, same canvas as the attached image.\n" + T + "\n")
open(os.path.join(here, 'rcu_feet_a.txt'), 'w', encoding='utf-8').write("One illustration, same canvas as the attached image.\n" + TF + "\n")
print(len(names) + 1, 'prompts')
