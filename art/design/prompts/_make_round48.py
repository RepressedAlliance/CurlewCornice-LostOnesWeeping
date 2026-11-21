"""Round 48, after the independent review of the roof test: she has to perform, the close-ups have to be actions that
are never repeated, and the hits need the most extreme angles. Everything at night, transparent background, derived
from the night master so the lighting and the girl stay the same.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
NIGHT = ("Night lighting exactly like the first attached image: cool pale light from behind and above (the lit paper cards in the sky), a "
         "thin crisp rim of that light along the top edges of hair, bow, shoulders and guitar, the rest in soft night shade; flat colours "
         "with one hard-edged shadow tone, crisp clean dark lines, no gradients, no glow, no blur, no sweat drops. ")
ALPHA = "Fully TRANSPARENT background (PNG alpha) everywhere outside the drawn subject; every part of the subject fully opaque."
RIN = ("the girl in the first attached image (Kagamine Rin in this film's design: short blonde bob, large white bow, white hairclips, teal "
       "eyes #218EA3, charcoal blazer, white shirt, teal ribbon tie, teal lanyard with her name card, gold-top Les Paul, black knee socks, "
       "brown loafers) ")
RINC = RIN[0].upper() + RIN[1:]
SAME = ("Redraw the attached image exactly: the same figure, framing, size and position in the canvas, the same night lighting and line "
        "work, keep the fully TRANSPARENT background (PNG alpha). Change only this: ")
jobs = {
 # close-ups
 'rcu_hand2_dn': ("One illustration (landscape 3:2). An extreme close-up from a low angle of the RIGHT hand of " + RIN + "playing: a "
   "slender 14-year-old girl's hand, small with slim fingers and short neat nails, in the charcoal blazer sleeve with the white shirt cuff, "
   "holding a small pick between thumb and index finger and striking DOWN across the six strings of the gold-top Les Paul in the second "
   "attached image (gold top, two cream P-90 pickups, tune-o-matic bridge) between the pickups; the strings are straight and taut, the "
   "struck ones drawn as two thin parallel lines. Only the hand, cuff and that part of the guitar are in the frame. " + NIGHT + ALPHA),
 'rcu_face3_an': ("One illustration, same canvas as the attached image.\n" + SAME + "the instant BEFORE the scream: her mouth is shut tight, "
   "jaw clenched, nostrils flared, her eyes wide open and wet, tears welling at the lower lids, brows drawn hard together; her hair hangs "
   "still. No sweat drops."),
 'rcu_face4_an': ("One illustration, same canvas as the attached image.\n" + SAME + "she is WAILING, not panicking: tears streaming from both "
   "eyes down her cheeks (clean shapes with a small highlight), brows pulled up in anguish, the same wide-open screaming mouth. No sweat "
   "drops at all."),
 'rcu_feet2_an': ("One illustration, same canvas as the attached image.\n" + SAME + "her right foot is LIFTED high, knee up, the sole of the "
   "brown loafer toward the camera, about to stomp down; the left foot stays planted on the floor tiles; keep the floor tiles as drawn."),
 'rcu_eye_an': ("One illustration (landscape 3:2). An extreme close-up of ONE teal eye (#218EA3) of " + RIN + "filling the frame "
   "horizontally, her blonde fringe and one white hairclip across the top edge; reflected small and curved in the iris: concentric rings of "
   "pale lit paper cards against a black night sky; a tear welling on the lower lid. " + NIGHT + ALPHA),
 'rcu_card_an': ("One illustration (landscape 3:2). An extreme close-up of the name card of " + RIN + "flying UP on its teal lanyard as she "
   "jerks forward: the card in the air at a sharp angle, the lanyard curving up from her collar, a piece of the charcoal blazer and white "
   "collar along the bottom edge. The card face is exactly the second attached image (her blank card: empty name box, empty bubbles), in "
   "its clear holder with a thin teal edge and the metal clip at the top as in the third attached image. " + NIGHT + ALPHA),
 # new camera angles, full body
 'rback_an': ("One full-body illustration (portrait 2:3). " + RINC + "seen from BEHIND and a little to her left, from a LOW camera at waist "
   "height looking up, while she plays her gold Les Paul facing away from us toward a city at night (not drawn): her back, the back of her "
   "head with the big white bow, the guitar neck sticking out to the left, the strap across her back, her right elbow, the lanyard round "
   "the back of her neck, black knee socks and brown loafers, the black guitar cable trailing on the ground. Light from in front of her "
   "(the city and the cards ahead): a pale cool rim around her silhouette, her back in night shade; flat colours, one hard shadow tone, "
   "crisp lines. Use the second attached turnaround for how she looks from behind. " + ALPHA),
 'rhigh_an': ("One full-body illustration (portrait 2:3). " + RINC + "seen from HIGH ABOVE, about 4 m up and a little in front of her, "
   "looking steeply down: she stands with her legs apart playing her gold Les Paul, head thrown back screaming UP into the camera, arms and "
   "guitar foreshortened, the top of her head and bow large, her loafers small below; the guitar cable trailing. " + NIGHT + ALPHA),
 'rworm_an': ("One full-body illustration (portrait 2:3). " + RINC + "seen from the GROUND right in front of her feet, the camera on the "
   "floor looking steeply up: her brown loafers and black socks huge in the foreground, the legs rising, the gold guitar body above, her "
   "face far above screaming down toward the camera, the bow against the sky; strong but real lens perspective. " + NIGHT + ALPHA),
 # jump and headbang in-betweens, from the night master
 'rlow3_crouch_an': ("One full-body illustration, same canvas as the attached image.\n" + SAME + "she CROUCHES to jump: knees deeply bent, "
   "body low, the guitar pulled in close, head down, hair falling forward; both feet flat where they were."),
 'rlow3_land_an': ("One full-body illustration, same canvas as the attached image.\n" + SAME + "she has just LANDED from a jump: knees bent "
   "taking the landing, both feet flat on the ground wide apart, the skirt and hair still flying UP from the fall, mouth open shouting."),
 'rlow3_bangmid_an': ("One full-body illustration, same canvas as the attached image.\n" + SAME + "her head is HALFWAY down in a headbang: "
   "chin toward her chest, hair swinging forward but not yet over her face, shoulders hunching."),
 'rlow3_bangup_an': ("One full-body illustration, same canvas as the attached image.\n" + SAME + "her head is whipping back UP from a "
   "headbang, halfway: her hair flung up and back by the motion, her face half visible, teeth gritted."),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
