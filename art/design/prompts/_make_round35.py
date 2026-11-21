"""Round 35, after the third review.
- rin_open: the new opening shot (00): her face and her card in one picture, eye level, so she is known at once.
- rlow3_master: the master for the roof shot (03), drawn as a real low angle from waist height (the old set had an
  eye-level head on low-angle legs, so she looked short and flat), with the guitar covering her skirt.
- rin_gate_v6, g1_instructor_v2, g1_officewoman_v2: the 01 drawings redrawn with the card hung the one way the
  film's card is hung (clip at the middle of the top long edge, as in the card master).
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
CARD = ("Her name card is exactly the film's card in the attached card reference: a white landscape card in a clear plastic holder with a thin "
        "teal border, hung from a small metal clip at the MIDDLE of its top LONG edge, on a narrow teal lanyard about 1.5 cm wide (clearly narrower "
        "than her ribbon tie). ")
RIN = ("the girl in the attached turnaround (Kagamine Rin in this film's design): short blonde bob, large white bow with two upright loops, white "
       "hairclips in her fringe, teal eyes #218EA3, charcoal-gray blazer with the dark emblem on the pocket, white shirt, teal ribbon tie, charcoal "
       "pleated skirt reaching just above her knees, black knee socks, brown loafers. Keep her design exactly as in the turnaround. ")
STYLE = ("Style: exactly like the turnaround: clean modern Japanese anime illustration, crisp even dark-gray lines, flat colours with exactly one "
         "hard-edged shadow tone, hair in a few clean clumps, few clothing folds, no gradients, no blur. Pure white background, no floor, no "
         "shadow, no text.")
jobs = {
 'rin_open': ("One illustration (landscape 3:2). A chest-up portrait of " + RIN +
   "Camera: at eye level with her chest, about 0.9 m in front of her, almost straight on (she is turned about 15 degrees toward the viewer's "
   "LEFT). She holds her name card up in front of her chest with both hands, its face toward the camera, and looks down at it: head tilted down a "
   "little, both eyes visible under the fringe looking down at the card, a guarded, sullen look, lips pressed together. The whole head with the "
   "big bow and the hairclips is in the picture, from the top of the bow down to her waist; the card is at the lower middle of the picture, "
   "large and flat to the camera, held by its edges with her fingertips (fingers do not cover its face). The lanyard runs from the back of her "
   "neck over her collar down to the clip, separate from the ribbon tie. " + CARD + STYLE),
 'rlow3_master': ("One full-body illustration (portrait 2:3) of " + RIN +
   "She plays the gold Les Paul from the attached guitar design (gold top, two cream P-90 pickups, one-piece wraparound bridge, cream pickguard, "
   "3+3 headstock) on a black strap, a black cable leaving the jack at the lower edge of the body and running down to the floor at the left. "
   "She is shouting the riff with her eyes OPEN, glaring down into the camera, mouth open with the upper teeth visible, her right hand mid-strum "
   "with a pick. "
   "Camera: LOW, from waist height: the viewer's eye is about 0.9 m above the floor and about 2.6 m in front of her, looking UP at about 20 "
   "degrees. The low angle must show in the whole body: we see the underside of her chin and jaw and a little of the underside of the bow, her "
   "head looks smaller and her legs larger because they are nearer the camera, the vertical lines of her body converge upward; her shoes are "
   "below the eye so we see their tops. In the picture she is about 6.5 heads tall, slim and tall-looking, not squat. "
   "Pose: feet a little wider than her shoulders, knees straight, weight forward; the guitar hangs low across her hips so its body covers the "
   "front of her skirt; nothing under the skirt can be seen. " + CARD + "Full body, both shoes in the picture. " + STYLE),
}
REDRAW = ("Redraw the first attached image exactly: the same person, the same face, hair, clothes, pose, hands, camera angle, size and position in "
          "the canvas and the same drawing style and colours, pure white background. Change only this: the name card is hung the way it is in "
          "the second attached image: the lanyard's small metal clip holds the card at the MIDDLE of its top LONG edge (the card is a landscape "
          "card), so the lanyard comes down to the centre of the card's long edge, not to one end of it. Everything else stays exactly the same.")
for n in ['rin_gate_v6', 'g1_instructor_v2', 'g1_officewoman_v2']:
    jobs[n] = "One illustration (portrait 2:3).\n" + REDRAW
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
