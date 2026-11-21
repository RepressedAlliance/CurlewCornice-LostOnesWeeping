"""Round 45: the roof is now at night (dark print, the town's lit windows, the lit cards overhead). Rin was drawn in
flat daylight and sat on the night like a sticker. Same drawings, same transparent background, relit for the scene:
cool light from behind and above (the lit cards), a thin rim along hair, bow, shoulders and guitar edge, the front a
little darker and cooler, still clean two-tone anime shading.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
L = ("Redraw the attached image exactly: the same figure, pose, face, expression, hair, clothes, guitar, cable, card, the same framing, "
     "size and position in the canvas, the same clean line work, keep the fully TRANSPARENT background (PNG alpha) and keep every part of the "
     "figure fully opaque. Change only the lighting to NIGHT: she stands under a sky full of pale lit paper cards, so the light comes from "
     "behind and above her and is cool and pale (#cfd8d6): draw a thin, crisp rim of that light along the top edges of her hair, the bow, "
     "the shoulders, the arms and the edge of the guitar; the rest of her is in soft night shade, a little darker and cooler than daylight "
     "(skin and hair keep their colours, the gold guitar stays gold), still flat colours with one hard-edged shadow tone, no gradients, "
     "no glow, no blur.")
for n in ['rlow3_master_k_a', 'rlow3_bang_a', 'rlow3_back_a', 'rlow3_jump_a', 'rlow3_stroke_a', 'rlow3_stomp_a', 'rlow3_up_k_a', 'rlow3_fist_k_a', 'rlow3_down_k_a', 'rcu_hand_a']:
    open(os.path.join(here, n + 'n.txt'), 'w', encoding='utf-8').write("One illustration, same canvas as the attached image.\n" + L + "\n")
open(os.path.join(here, 'rcu_face_an.txt'), 'w', encoding='utf-8').write("One illustration, same canvas as the attached image.\n" + L +
     " Also remove the cartoon sweat drops on and around her face (no drops at all).\n")
open(os.path.join(here, 'rcu_feet_an.txt'), 'w', encoding='utf-8').write("One illustration, same canvas as the attached image.\n" + L.replace(
     "keep the fully TRANSPARENT background", "keep the grey concrete floor tiles (now in night shade, dark grey-teal) and the fully TRANSPARENT background above them") + "\n")
print('ok')
