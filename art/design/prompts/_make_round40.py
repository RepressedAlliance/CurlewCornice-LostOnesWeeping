"""Round 40: every card in the drawings is drawn by Codex.
Up to round 39 the card faces were pasted onto the drawings afterwards (tools/card_swap.py): a flat, crisp
rectangle on top of a drawn picture, which reads as stuck on. Now each drawing is redrawn whole, with the card
design attached as a reference, and nothing is pasted afterwards.
Card assignment (art/ref/cards/card_NN.png, names from web/scenes/cardgrid.js): Rin 00 (blank), instructor 01,
officewoman 02, clerk 04, elder 05, student boy 09, student girl 12, mother 14, girl 10, salaryman 22.
(The earlier assignment gave the officewoman, the girl and the clerk boys' names.)
Wave A here: the drawings that are not derived from another one. Wave B (round 41) derives the pose variants from
these new masters.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))

KEEP_RIN = ("Redraw the first attached image exactly: the same girl (Kagamine Rin in this film's design), the same face, expression, "
            "hair, bow, hairclips, clothes, guitar case if any, pose, hands and fingers, the same camera angle, the same size and position "
            "in the canvas, the same crisp dark-gray lines, flat colours with one hard-edged shadow tone, pure white background. ")
KEEP_TOWN = ("Redraw the first attached image exactly: the same people, the same faces, hair, clothes, poses, hands and fingers, the same "
             "camera angle, the same size and position in the canvas, the same printed illustration in ONE ink colour only, teal (#218EA3) "
             "line art on white with the same teal screentone, pure white background. ")
HOLDER_RIN = ("The card is in a clear plastic holder with a thin teal edge, hung from a small metal clip at the middle of its top long edge "
              "on her narrow teal lanyard, as in the last attached image. ")
FACE_RIN = ("Its face must be exactly the card in the second attached image, her own card: a white landscape card with '個人読取カード' "
            "in small teal letters at the top left, a long name box with a teal '氏名' label and NOTHING written in it, a grid of small teal "
            "oval bubbles numbered 0 to 9 in six rows with pale label blocks on the left, the 'こころ' row at the bottom with its oval EMPTY, "
            "small black squares in the corners and a row of black timing marks along the bottom edge. Nothing on her card is filled in. ")
FACE_TOWN = ("Its face must be exactly the card in the attached card image ({who}): '個人読取カード' at the top left, the name box with "
             "the name written in it, the grid of small oval bubbles numbered 0 to 9 in six rows with the SAME bubbles filled in with "
             "pencil as in the card image, the 'こころ' oval at the bottom filled in, black corner squares and timing marks along the "
             "bottom edge. Draw the card in the same single teal ink as the rest of the picture (the pencil marks as solid teal), in a "
             "clear holder with a thin edge, on the person's lanyard. ")
TAIL = ("Copy the card's layout and proportions faithfully; where the card is small, tiny letters may be simplified, but the layout must "
        "match. The card belongs to the drawing: same line weight, same flat colours and shading as everything else, in correct "
        "perspective, the fingers that hold it overlapping it naturally. Nothing else changes.")

def rin(change):
    return "One illustration, same canvas as the first attached image.\n" + KEEP_RIN + change + TAIL

def town(change, who):
    return "One illustration, same canvas as the first attached image.\n" + KEEP_TOWN + change + FACE_TOWN.format(who=who) + TAIL

jobs = {
 'rin_open2_k': rin("Change only the card she holds up beside her face. " + FACE_RIN.replace("NOTHING written in it", "the machine's "
   "verdict 読み取れません printed in it in heavy dark dot-matrix letters, exactly as in the second attached image") +
   "The card is flat to the camera and all of its face shows: her fingertips hold only its lower corner and cover none of the "
   "printing. 読み取れません must be written correctly and easy to read. " + HOLDER_RIN),
 'rin_gate_v6_k': rin("Change only her name card, held out at the end of its lanyard. " + FACE_RIN + HOLDER_RIN),
 'rlow3_master_k': rin("Change only the name card hanging on her chest. " + FACE_RIN + HOLDER_RIN),
 'rin_fling_v4_k': rin("Change only the card flying at the end of the lanyard. " + FACE_RIN + HOLDER_RIN),
 'rfl_grab_v2_k': rin("Change only the name card on her lanyard. " + FACE_RIN + HOLDER_RIN),
 'rfl_grab2_v2_k': rin("Change only the name card on her lanyard. " + FACE_RIN + HOLDER_RIN),
 'rfl_pull_v2_k': rin("Change only the name card at the end of the lanyard in her raised hand. " + FACE_RIN + HOLDER_RIN),
 'rin_story_k': ("One illustration, same canvas as the first attached image.\nRedraw the first attached image exactly: the same drawings "
   "of the same girl (Kagamine Rin in this film's design), every figure in the same pose, size and position, the same line style, flat "
   "colours and one hard shadow tone, the same background and any labels exactly as they are. Change only her name card in every "
   "drawing where it shows. " + FACE_RIN + HOLDER_RIN + TAIL),
 'g1_instructor_v2_k': town("Change only his name card. ", "his own card"),
 'g1_elder_k': town("Change only his name card. ", "his own card"),
 'g1_officewoman_v2_k': town("Change only her name card. ", "her own card"),
 'g1_salaryman_k': town("Change only his name card. ", "his own card"),
 'g1_students_k': town("Change only the two students' name cards: the boy's card is the second attached image, the girl's card is "
   "the third attached image. ", "each student's own card"),
 'g5_clerk_on_k': town("Change only her name card. ", "her own card"),
 'g5_elder_on_k': town("Change only his name card. ", "his own card"),
 'g5_girl_on_k': town("Change only her name card. ", "her own card"),
 'g5_mother_on_k': town("Change only the two name cards: the mother's card is the second attached image, the boy's card is the third "
   "attached image. ", "each one's own card"),
 'g5_officewoman_on_k': town("Change only her name card. ", "her own card"),
 'g5_salaryman_on_k': town("Change only his name card. ", "his own card"),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
