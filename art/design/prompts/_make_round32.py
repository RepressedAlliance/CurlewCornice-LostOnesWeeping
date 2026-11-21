"""Round 32: drawings for the stage-2 clip of shot 05 (the last line of the final chorus).
- The townspeople a moment before their cards fall: each g5_* drawing redrawn exactly, with only the card put back
  on the lanyard's clip, so the swap at the drop beat changes nothing but the card.
- Rin's grab and pull before the fling, from the fling drawing (rin_fling_v3) as the master.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
CARD = ("The card is a small white landscape name card about 12 cm wide with a thin teal border and a faint teal grid of tiny printed ovals, "
        "a few of the ovals filled in with black pencil; it hangs from the lanyard's metal clip.")
KEEP = ("Redraw the attached image exactly: the same person, the same face, hair, clothes and build, the same pose and hands, the same high camera "
        "angle looking down, the same size and position in the canvas, the same feet positions, the same single-teal printed illustration "
        "style with the same screentone dots, pure white background, nothing else in the picture. ")
on = {
 'g5_salaryman_on': "Change only this: his name card is still on the clip: the clip he holds up in his right hand has his card hanging from it, and he stares at the card.",
 'g5_officewoman_on': "Change only this: her name card is still on her lanyard, hanging from the clip at the middle of her chest above the binder.",
 'g5_mother_on': "Change only this: both of their name cards are still on their lanyards: the mother's hangs at the middle of her chest, the boy's smaller lanyard holds his card at his chest.",
 'g5_elder_on': "Change only this: his name card is still on his lanyard, hanging from the clip at the middle of his chest.",
 'g5_girl_on': "Change only this: her name card is still on her lanyard, hanging from the clip at the middle of her chest, and her fingertips touch the card itself.",
 'g5_clerk_on': "Change only this: her name card is still on her lanyard, hanging from the clip at her chest, and both her hands hold the card at its edges.",
}
RIN = ("Redraw the girl in the first attached image (Kagamine Rin in this film's design, the same as in the second attached image): the same face, "
       "short blonde bob, large white bow with two upright loops, white hairclips in her fringe, teal eyes #218EA3, the same charcoal blazer with the "
       "dark pocket emblem, white shirt, teal ribbon tie, charcoal pleated skirt, black knee socks, brown loafers, the same black padded gig bag on her "
       "back by both straps; the same camera seen from slightly above at the same angle and distance as the first image (eye about 2.3 m above the "
       "floor, about 3.6 m away, looking down about 15 degrees), the same body size in the canvas, three-quarter view turned about 35 degrees toward "
       "the viewer's LEFT. Keep the drawing style exactly: clean modern Japanese anime illustration, crisp even dark-gray lines, flat colours with "
       "exactly one hard-edged shadow tone, no gradients, pure white background, no floor, no shadow, no text. Her lanyard is teal and her blank name "
       "card is a plain white landscape card with a thin teal border and nothing printed on it. Hands: a 14-year-old girl's slim hands, correct "
       "fingers, not spread like a fan. Face: crying, eyes OPEN and wet (not squeezed shut, not > < shapes), tears running down both cheeks. ")
rin = {
 'rfl_grab': RIN + ("Moment, a second before she tears it off: her right hand has grabbed the teal lanyard just under her chin and pulls it hard "
   "forward and up, the lanyard taut from the back of her neck to her fist, the blank card swinging just below her fist; her head is bowed, her eyes "
   "look down at the card, teeth clenched, her left fist clenched at her side; she stands with both feet on the floor, weight forward."),
 'rfl_pull': RIN + ("Moment, half a second before the throw: she is yanking the lanyard up and off over her head: her right arm is raised high above "
   "her head, her fist holding the lanyard, the loop of the lanyard just sliding off over the top of her bow, the blank card swinging up beside her fist; "
   "her chin is up, eyes open, crying and screaming, mouth wide open with the upper teeth visible; her left fist clenched at her side; her weight "
   "shifting onto her front foot."),
}
for name, body in on.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write("One illustration (portrait 2:3).\n" + KEEP + body + "\n" + CARD + "\n")
for name, body in rin.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write("One full-body character illustration (portrait 2:3).\n" + body + "\n")
print(len(on) + len(rin), 'prompts')
