"""Segment 10 B, the finished cut (design 乙 chosen by the blind review of the two samples; docs/分镜/10_B.md + the review's
must_fix). Drawings:

S1 down the aisle (k295-k311):
  - p10f_rowL, p10f_rowR (masters): the two rows of seated passengers, redrawn on the page's perspective guides
    (board/guide_seg10_row{L,R}.png). Changes from the sample: the people are the set-pack people seated (the sample A seated
    drawings p10_1..p10_6, which are h04/h01/h02/h05 + two new, are attached as identity AND line references: cleaner line,
    screentone only in shadow); every person separate (hands and knees of neighbours do not pile up); the card lies FLAT on the
    lap face up, held only by its two short ends (so the film's card can be printed over it: tools/card_swap.py), never upright
    like a phone.
  - p10f_rowLb, p10f_rowRb: k307, every head drops a LOT (chin to chest) and the eyelids half close; nothing else moves.
  - r10f_doorb: her back (master art/cut/r10_door.png, kept from the sample) with a big, readable sink: head well forward, the
    bow tipping forward with it, the nape showing, shoulders rounded.
S2 over her shoulder, the reflection (k311-k323):
  - r10f_back (master): her back, close, head bowed like r10f_doorb, from behind and a little to her left.
  - r10f_refl (master): her face in the glass (drawn as a normal front view; the page mirrors it): head and shoulders, bowed,
    eyelids HALF closed (the same drowse as the passengers), hugging the bag.
  - r10f_reflb: k316, the eyes come up, cold and looking down on everything; nothing else moves.
  - p10f_opp (master): three people on the bench opposite, front view, heads bowed, eyes half closed (seen only as a dark
    reflection behind her).
S3 the coin lockers (k323-k327):
  - h10f_tip (master): her right hand from below, fingertips pushing the edge of the open locker door.
  - h10f_press: the same hand, palm flat on the closed door.
  - g10f_bag: the gig bag standing upright, front view (inside the locker).
usage: python art/design/prompts/_make_seg10f.py   -> writes the .txt prompts, prints the make_jobs arguments (round 1, round 2)
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, LARGE, variant

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
LINEUP = '../canon/town/_lineup_same_scale.png'
CUT = '../cut/'

TOWN_HAND = (
    "Drawing style: the drawing hand of the attached seated passengers (images 2-4): a printed illustration in ONE ink colour only, "
    "teal (#218EA3), on paper white: clean, confident, even teal line art like a modern anime character sheet (outer contour a "
    "little heavier, inner lines few and simple), faces simple and anime-like (small nose of one short stroke, simple mouth), "
    "clothes with only a few fold lines. Shadow only where it matters (under the bowed head, under the arms, the dark coat), as "
    "clean regular round teal screentone dots of ONE size; dark hair and dark clothes as solid teal or a dense even dot. Large "
    "areas stay plain paper white. No hatching, no realistic rendering, no texture, no grey, no black, no gradients, no glow. "
    "As clean and simple as the girl's turnaround, only in teal.")
CARD = (
    "The card: each person holds their own answer card, a LANDSCAPE paper card 15 x 10 cm (bigger than a phone, wider than it is "
    "tall), lying FLAT on their lap, face UP, its long side along the thighs; they hold it only by its two SHORT ENDS between "
    "fingers and thumbs, so the whole face of the card is uncovered. Draw the card face as plain paper white with only a thin "
    "teal outline (the film prints the card design on it later). A thin teal lanyard comes down from the back of the neck to a "
    "small clip at the middle of the card's far long edge. It is a piece of paper: it does not glow, nobody holds it upright like "
    "a phone, no thumb swipes it.")
ROW_COMMON = (
    "The FIRST attached image is a grey perspective guide drawn by the film's camera: draw each person EXACTLY where the guide puts "
    "them: each grey oval is that person's head (same place, same size), the grey stick line is the spine, thigh and shin of the "
    "seated body; the thin light lines are the bench and floor edges converging on the grey dot (the vanishing point, at the "
    "camera's eye height, 1.45 m). The near people are big and cut by the bottom edge of the canvas at the lap, exactly as the "
    "guide shows; the far two sit on the next bench beyond a pair of doors, their seats at the same height as the near ones (the "
    "buttocks on the light seat line, the shins hanging down in front of the seat edge, the shoes on the floor line).\n"
    "Scene: five passengers of the town seated on one side of a commuter train car at night, seen from the aisle looking down the "
    "length of the car with a long lens (one-point perspective). They sit apart with a clear gap of empty seat between neighbours: "
    "every person's hands, card, knees and shins are SEPARATE and readable, nobody's limbs pile onto a neighbour's; where a nearer "
    "person overlaps a farther one, the overlap is clean (the nearer body simply in front). Each looks down at the card on the lap, "
    "the chin lowered about 30 degrees: ALL FIVE HEADS AT THE SAME ANGLE, like a row of the same machine. Quiet, absorbed, blank "
    "faces, eyes open on the card. Light from the ceiling straight above. Do NOT draw the bench, the windows, the floor, the straps "
    "or anything of the car: only the five people.\n" + CARD + "\n" + TOWN_HAND +
    "\nFully TRANSPARENT background (PNG alpha) everywhere outside the people; every part of the people fully opaque, including the "
    "paper-white parts. No text, no logos, no watermark. Absolutely no red, pink or orange anywhere.")
ROWS = {
    'p10f_rowL': ("They sit on the LEFT bench and face the viewer's RIGHT (toward the opposite bench across the aisle): each in "
                  "PROFILE facing right, the nearest turned about 20 degrees toward the viewer, the far ones in pure profile. From "
                  "near to far: (1) Kimura Hiroshi of image 2: section chief about 58, bald on top with a ring of short white hair, "
                  "round glasses, the open DARK wool overcoat over a suit, a folded newspaper under his arm; (2) Suzuki Keiko of "
                  "image 3: career woman about 38, short neat hair, suit jacket and skirt, a document folder under her forearm; "
                  "(3) Matsumoto Aya of image 4: clerk of 19, ponytail, sleepy heavy eyelids, an open zip-up hoodie over her "
                  "striped uniform shirt; (4, far) an old man in a flat cap and a quilted jacket; (5, far) a thin young man in a "
                  "hoodie with headphones round his neck. The far two sit side by side on their bench, both clearly seated on the "
                  "same seat line, knees forward, shins down, shoes on the floor.",
                  ['board/guide_seg10_rowL.png', CUT + 'p10_1.png', CUT + 'p10_2.png', CUT + 'p10_3.png']),
    'p10f_rowR': ("They sit on the RIGHT bench and face the viewer's LEFT (toward the opposite bench across the aisle): each in "
                  "PROFILE facing left, the nearest turned about 20 degrees toward the viewer, the far ones in pure profile. From "
                  "near to far: (1) Shimizu Aoi of image 2: schoolgirl of 16 of another school, sailor uniform, long straight black "
                  "hair (solid teal) in one low ponytail; (2) the construction worker of image 3: lean, about 45, cropped hair, "
                  "stubble, work jacket, his white hard hat beside him on the seat (not on his lap); (3) the small old woman of "
                  "image 4: about 78, permed white hair, knitted cardigan vest, a cloth shopping bag on the floor at her feet; "
                  "(4, far) a woman in a belted trench coat with a bob; (5, far) a university student in a knit beanie and a big "
                  "scarf. Keep a clear gap between the worker and the old woman so their hands, cards and knees never overlap.",
                  ['board/guide_seg10_rowR.png', CUT + 'p10_5.png', CUT + 'p10_6.png', CUT + 'p10_4.png']),
}
ROW_SINK = ("at the same instant every one of the five heads drops much further, by the same large amount: the head hangs forward "
            "about 20 degrees more, the chin almost on the chest, the face tipped down toward the lap so less of the face shows; "
            "every upper eyelid drops to HALF closed (drowsy, unfocused). The cards stay where they are. The shoulders, bodies, "
            "arms, hands, legs, clothes and positions do not move at all.")

HER_ID = IDENTITY.replace("a teal lanyard with her white name card in a clear holder",
                          "a thin teal lanyard round her neck (the card hangs at her chest, hidden behind the gig bag she hugs)")
TRAIN_LIGHT = ("Lighting: inside a night train under flat white ceiling light from straight above: the flat colours of the "
               "turnaround, very slightly cool, exactly one hard-edged shadow tone per material (under the bow, under the chin, under "
               "the arms); no rim light, no glow, no light band along the outline.")
HER_ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the bag: no window, no door, no floor, no shadow, "
             "no frame. Every part of her and the bag fully opaque. No text, no logos. No red anywhere.")
DOOR_SINK = ("her head bows deeply forward, about 25 degrees more, as if she is dozing off on her feet: seen from behind, the back "
             "of her head tips forward and down so we see more of the crown of her blonde hair, the big white bow tips forward with "
             "the head (its two loops lean away from us and look lower and shorter), a clear strip of the back of her neck (the nape, "
             "skin colour) now shows between the hair and the white shirt collar, and both shoulders round forward and sink a "
             "little. The arms, the gig bag, the skirt, the legs and the feet do not move at all.")
HUG = ("She hugs the black soft guitar gig bag of the attached gig-bag sheet UPRIGHT against her front with both arms, as if holding "
       "on to it: the bag's narrow neck end is at the top, its top end level with her RIGHT shoulder and just beside it.")
R_BACK = "\n".join([HER_ID,
    "This drawing: a CLOSE back view of her head and shoulders, for an over-the-shoulder shot on a night train. She stands facing a "
    "dark door window 30 cm in front of her (not drawn), her back to the viewer; the viewer is just behind her and a little to her "
    "LEFT, at her eye height: we see the back of her blonde bob and a sliver of her left cheek line and left ear hidden under the "
    "hair, NOT her face. Her clothes, hair and bag as in the second attached image, but her head is bowed much more deeply forward (dozing on her feet): the bow "
    "tipped forward with the head, a strip of the nape showing between the hair and the shirt collar. The big white bow and "
    "headband from behind, the back of her charcoal blazer collar and shoulders. " + HUG + " Seen from behind, only the top end of "
    "the bag shows, rising beside and just above her RIGHT shoulder (the viewer's RIGHT), the rest hidden by her body. The thin "
    "teal lanyard goes round the back of her neck under the hair.",
    "Framing: portrait canvas 2:3; her head fills the upper middle: the top of the bow 6% below the top edge, the "
    "canvas cut across her upper back at the bottom edge (shoulders and upper back fully in, both shoulders inside the canvas). "
    "Camera at her eye height, straight, long lens, no high or low angle.",
    DRAW, SHEET_RULE, LARGE, TRAIN_LIGHT, NEVER, HER_ALPHA])
R_REFL = "\n".join([HER_ID,
    "This drawing: her FACE, CLOSE, front view, from the top of her bow down to her upper chest, facing the viewer straight on (the "
    "viewer is the dark window pane she is facing; the film mirrors this drawing into the glass as her reflection). " + HUG +
    " In this FRONT view her RIGHT shoulder is on the VIEWER'S LEFT, so the top end of the bag rises on the viewer's LEFT beside "
    "her chin and cheek. Her head is bowed forward about 25 degrees as if she is dozing on her feet, the arms and the bag of "
    "the second attached image (her head bowed further than there); her upper eyelids have dropped to HALF closed, the eyes unfocused and drowsy, looking down; an "
    "empty, tired face, mouth closed, brows level and relaxed. One hand shows on the bag near the bottom edge.",
    "Framing and scale: portrait canvas 2:3 showing her head and shoulders large: the top of the bow 4% below the top edge, her "
    "face in the upper middle (the face about 30% of the canvas width), the bottom edge across her upper chest. Centred. Camera at "
    "her eye height, straight on, long lens.",
    DRAW, SHEET_RULE, LARGE, HANDS, TRAIN_LIGHT, NEVER, HER_ALPHA])
REFL_COLD = ("her eyes come UP: the eyeballs turn up to look straight ahead at eye level (not at the viewer: just past the viewer's "
             "left shoulder, a little to the viewer's right), the upper eyelids still lowered a little so the look is narrow, cold "
             "and looking DOWN ON everything, the teal pupils still and fixed; not angry, not crying, not smiling. The head, the "
             "brows, the mouth, the hair, the bow, the hand and the bag do not move at all.")
P_OPP = "\n".join([
    "One illustration for a film shot: three passengers of the town sitting side by side on a long train bench at night, seen "
    "from straight in front across the aisle at seated eye level (front view, long lens). From left to right: a middle-aged woman "
    "in a long coat with a scarf, a university student in a knit cap and a puffer jacket, an old man with a paper shopping bag on "
    "the floor by his feet. Each is a NEW person, different from everyone in the attached lineup, drawn in exactly its hand. All "
    "three hold their small landscape paper answer card flat on the lap in both hands (a thin teal lanyard from the neck), and all "
    "three heads hang forward at the SAME angle, the chin almost on the chest, the upper eyelids HALF closed, dozing; quiet, blank. "
    "A small gap between them, nobody's limbs over a neighbour's. Full figures: shoes complete and flat on the floor at the bottom; "
    "the bench is NOT drawn (they sit on an invisible seat).",
    "Framing: landscape canvas 3:2, the three people side by side filling the width, heads in the upper third.",
    TOWN_HAND.replace("(images 2-4)", "(image 2)"),
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the people; every part of the people fully opaque. No text, no "
    "logos, no watermark. Absolutely no red, pink or orange anywhere."])
H_TIP = "\n".join([
    "One drawing for a film close-up: HER RIGHT HAND only (the girl of the attached turnaround), drawn in exactly the hand of the "
    "attached close hand drawing (image 2) and the turnaround's own hands: small, slim, young, a clean dark-grey outline, flat skin "
    "colour with one hard-edged shadow shape, no knuckle lines, no veins.",
    "Pose: the hand comes up from the BOTTOM edge of the canvas, the forearm in her charcoal blazer sleeve with the white shirt "
    "cuff showing, going out of the canvas at the bottom edge (the sleeve is cut only by the canvas edge). The four fingers are "
    "together and straight, held vertical, and the side of the hand, with the fingertips, presses against a vertical door edge "
    "just to its RIGHT (the door is not drawn: an invisible vertical line at 62% of the canvas width that the tips of the fingers "
    "touch), pushing it shut; the thumb tucked along the side of the palm; the wrist a little bent, a small effort. Seen from the "
    "front at eye level, the palm facing the viewer's right.",
    "Framing: portrait canvas 2:3; the fingertips at 30% from the top, the hand about 40% of the canvas width.",
    DRAW, SHEET_RULE, HANDS, TRAIN_LIGHT,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand and sleeve; every part fully opaque. No text. No red."])
H_PRESS = ("the door is now shut and lies in the picture plane, facing the viewer, and the hand lies FLAT on it: we see the BACK "
           "of the hand, the palm pressed flat on the door surface, the four fingers together pointing straight up, the thumb "
           "alongside, a small steady pressure. The hand stays in the same place and at the same size; the wrist, cuff, sleeve and "
           "forearm stay exactly where they are.")
G_BAG = "\n".join([
    "One prop drawing for a film shot: the black soft guitar gig bag of the attached sheet, FRONT view only, standing upright on "
    "its bottom end, the neck end at the top, exactly its outline, its two zip pockets, its zips, its handle on the side, its one "
    "hard shadow tone. No tag, no label, no strap hanging loose, nothing else.",
    "Drawing: clean modern anime prop drawing like the attached sheet: crisp even dark-grey outline, flat charcoal (#2E2E33) with "
    "one hard-edged shadow tone, simple shapes, no texture, no gradient.",
    "Framing: portrait canvas 2:3, the bag centred, 92% of the canvas height.",
    "Fully TRANSPARENT background (PNG alpha) outside the bag; every part of the bag fully opaque. No text. No red."])

if __name__ == '__main__':
    def w(n, t):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
    r1, r2 = [], []
    for n, (t, ref) in ROWS.items():
        w(n, ROW_COMMON + "\n" + t); r1.append(f"-{n}:{'+'.join(ref)}")
        w(n + 'b', variant(ROW_SINK)); r2.append(f"-{n}b:out/{n}.png")
    w('r10f_doorb', variant(DOOR_SINK)); r1.append(f"-r10f_doorb:{CUT}r10_door.png+{TURN}")
    w('r10f_back', R_BACK); r1.append(f"-r10f_back:{TURN}+{CUT}r10_doorb.png+{BAG}+{FACES_REF}")
    w('r10f_refl', R_REFL); r1.append(f"-r10f_refl:{TURN}+{CUT}r10_reflb.png+{BAG}+{FACES_REF}+{HANDS_REF}")
    w('r10f_reflb', variant(REFL_COLD)); r2.append(f"-r10f_reflb:out/r10f_refl.png+{TURN}+{FACES_REF}")
    w('p10f_opp', P_OPP); r1.append(f"-p10f_opp:{LINEUP}+{CUT}p10_4.png")
    w('h10f_tip', H_TIP); r1.append(f"-h10f_tip:{TURN}+{CUT}hpen3.png+{HANDS_REF}")
    w('h10f_press', variant(H_PRESS)); r2.append(f"-h10f_press:out/h10f_tip.png+{HANDS_REF}")
    w('g10f_bag', G_BAG); r1.append(f"-g10f_bag:{BAG}")
    print('ROUND1', ' '.join(r1))
    print('ROUND2', ' '.join(r2))
