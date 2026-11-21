"""Round 39, after the fourth review.
- g1_mother_v2: the mother walking away in 01 had her name card on her back. Cards hang on the chest: from behind only
  the lanyard round the back of her neck shows.
- rin_open2: the opening (00) with the card large enough to read in the first seconds: she holds it up beside her face.
- g5_crowd: the people further back in the hall of 05, so the falling cards come from somebody: each has just lost the
  card off their lanyard.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
CARD = ("Her name card is exactly the film's card in the attached card reference: a white landscape paper card in a clear plastic holder with a "
        "thin teal edge, hung from a small metal clip at the MIDDLE of its top LONG edge, on a narrow teal lanyard about 1.5 cm wide. ")
RIN = ("the girl in the attached turnaround (Kagamine Rin in this film's design): short blonde bob, large white bow with two upright loops, white "
       "hairclips in her fringe, teal eyes #218EA3, charcoal-gray blazer with the dark emblem on the pocket, white shirt, teal ribbon tie. Keep her "
       "design exactly as in the turnaround. ")
STYLE = ("Style: exactly like the turnaround: clean modern Japanese anime illustration, crisp even dark-gray lines, flat colours with exactly one "
         "hard-edged shadow tone, no gradients, no blur. Pure white background, no text.")
jobs = {
 'g1_mother_v2': ("One illustration (portrait 2:3).\nRedraw the first attached image exactly: the same mother and boy, the same faces, hair, clothes, "
   "pose, the same high camera angle, size and position in the canvas, the same single-teal printed illustration style with the same screentone, "
   "pure white background. Change only this: the mother's name card is NOT on her back. Name cards hang at the front of the chest, so from behind "
   "we see only her grey lanyard as a thin strap round the back of her neck, going forward over her shoulders; nothing hangs on her back. The boy, "
   "who looks back over his shoulder, has his card at the front of his chest too."),
 'rin_open2': ("One illustration (landscape 3:2). A chest-up portrait of " + RIN +
   "Camera at eye level, about 0.9 m in front of her, straight on. She holds her name card up beside her face with her right hand, at the height "
   "of her chin, its face turned flat to the camera, as if showing an ID: the card is large in the picture (about as wide as her face), held by its "
   "lower corner with her fingertips so nothing covers its face; the lanyard still goes from the back of her neck to the clip. Her head is a "
   "little tilted, she looks straight into the camera, guarded and defiant, lips pressed together. The whole head with the big bow is in the "
   "picture with some room above the bow; the picture ends at her chest. " + CARD + STYLE),
 'g5_crowd': ("One illustration (landscape 3:2), a sheet of 8 different townspeople from the first attached lineup's town (other people, not the "
   "ones in it), each a separate full-body figure standing on pure white with clear space between them, no overlaps. Drawing style exactly like the "
   "first attached image: a printed illustration in ONE ink colour only, teal (#218EA3) line art on white with clean teal screentone dots; no other "
   "colours. Camera: seen from ABOVE like the second attached image: the viewer's eye about 2.3 m above the floor and about 10 m away, looking down "
   "about 15 degrees: we see the tops of heads and shoulders and the tops of the shoes. Each person has JUST lost the name card off their lanyard: "
   "a grey lanyard ending in an EMPTY clip at the chest; they react in different ways: looking down at the empty clip, looking up at cards falling "
   "(not drawn), touching their chest, turning to a neighbour. Mixed ages and builds: a school girl, a school boy, an office worker with a bag, an "
   "old woman, a young father with a toddler on his hip (one figure), a delivery man, a woman in a coat, a tall man in a suit."),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
