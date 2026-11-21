"""Round 33: two in-between drawings for the stage-2 clip of shot 05, each redrawn from the drawing it follows.
- rfl_grab2: the grab held, pulling harder (so the 1.9 s hold before the pull is not a still).
- rfl_after: a moment after the throw, looking up into the falling cards, crying out (so the long hold after the
  throw has an end).
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
KEEP = ("Redraw the girl in the first attached image exactly (Kagamine Rin in this film's design, the same as in the second attached image): "
        "the same face, hair, large white bow, hairclips, teal eyes #218EA3, the same charcoal blazer, white shirt, teal ribbon tie, charcoal pleated "
        "skirt, black knee socks, brown loafers, the same black gig bag on her back by both straps; the same camera from slightly above at the same "
        "angle and distance, the same body size and the same position in the canvas, her feet in the same place on the ground. Keep the drawing style "
        "exactly: clean modern Japanese anime illustration, crisp even dark-gray lines, flat colours with exactly one hard-edged shadow tone, no "
        "gradients, pure white background, no floor, no shadow, no text. Hands: a 14-year-old girl's slim hands, correct fingers. ")
jobs = {
 'rfl_grab2': KEEP + ("Change only this: she pulls the lanyard harder: her right fist a little higher and further forward, the lanyard drawn tight from the "
   "back of her neck to her fist, the blank card swinging below her fist; her shoulders hunched up, her head bowed a little lower, teeth clenched, "
   "eyes OPEN and wet glaring down at the card, a tear dripping from her chin."),
 'rfl_after': KEEP + ("Change only this, for a moment after the throw: her lanyard and card are gone (thrown away); her throwing arm has dropped, both arms "
   "hanging at her sides with the hands open; she has lifted her face and looks UP at the cards falling all around her (do not draw any cards), "
   "crying out loud: eyes OPEN and wet looking up, brows raised in grief and relief, mouth open, tears streaming down both cheeks; she stands on both "
   "feet where she was, her weight settled."),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write("One full-body character illustration (portrait 2:3).\n" + body + "\n")
print(len(jobs), 'prompts')
