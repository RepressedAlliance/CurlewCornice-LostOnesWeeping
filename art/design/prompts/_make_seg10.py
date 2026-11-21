"""Segment 10 B (docs/分镜/10_B.md) sample drawings for the two designs of the train-car shot (k295-k311).

Design A (甲, the car in cross-section, centred on a door):
  - p10_1 .. p10_6 (masters): six passengers of the town, seated, front view at eye level, both hands holding their card on the
    lap, heads bowed at the SAME angle. p10_1/2/3/5 are the set-pack people meant for segment 10 (art/canon/town/ h04, h01, h02,
    h05) redrawn seated; p10_4 (old woman) and p10_6 (worker) are new, drawn in the same hand.
  - p10_1b .. p10_6b: each master redrawn with one change: k307 head sinks ~3 degrees more, eyelids half closed, card tips.
  - r10_door (master): her, back view, full body, hugging the gig bag upright; r10_doorb: head and shoulders sink ~4 degrees.
  - r10_refl (master): her front, waist up, the same pose (it is mirrored into the door glass by code); r10_reflb: head sinks,
    eyelids half closed.
Design B (乙, down the aisle, long lens): her back is r10_door / r10_doorb (the same moment and pose, the frame cuts her at the
  waist); the passengers are two rows drawn in the page's perspective on the grey guides of _seg10_guides.py:
  - p10_rowL, p10_rowR (masters) and p10_rowLb, p10_rowRb (all heads sink at once).
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg10.py   -> writes the .txt prompts, prints the make_jobs arguments (masters, variants)
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, variant

TOWN_HAND = (
    "Drawing style: exactly the drawing hand of the attached set-pack sheet: a printed illustration in ONE ink colour only, teal "
    "(#218EA3), on paper white: clean confident teal line art (outer contour a little heavier, inner lines thin and few), shadows "
    "and darker materials as clean, regular, round teal screentone dots (one dot size for light tone, a denser one for dark tone), "
    "solid teal or very dense teal dots for black hair and very dark clothes. White areas are paper white. No other colours: no grey, "
    "no black, no brown, no gradients, no airbrush, no glow, no blur, no paper texture, no pencil sketchiness. A crisp printed page, "
    "as drawn by a professional anime character designer.")
SEAT = (
    "Framing and scale (the six passengers sit side by side on one bench in the film, at one scale): portrait canvas 2:3 showing a "
    "FIXED area 1.00 m wide and 1.50 m tall: its bottom edge is 3 cm below the floor and its top edge 1.47 m above the floor. The "
    "person sits on an INVISIBLE long train bench (do NOT draw the bench, the seat or any backrest): the buttocks rest 0.42 m above "
    "the floor (30% of the canvas height up from the bottom edge), the back upright against an invisible backrest. Centred "
    "horizontally. Full figure: both shoes complete and flat on the floor, the soles at 2% of the canvas height above the bottom "
    "edge. Camera at 1.2 m, straight on, front view, long lens: no high or low angle; the thighs come toward us, foreshortened, the "
    "knees and shins in front. Natural adult proportions (about 7 heads tall), not elongated.")
HOLD = (
    "Pose: sitting still on a night train. Both hands hold their own small paper card (an answer card, 15 x 10 cm, landscape: paper "
    "white with a thin teal border and three rows of tiny teal ovals, a few filled in solid teal) on the lap just above the knees, "
    "its face tilted up toward the face. The card hangs from a thin teal lanyard round the neck (the lanyard comes down loosely to "
    "the card). The HEAD IS BOWED: the chin lowered about 30 degrees, the face looking straight down at the card, eyes open and "
    "fixed on it; a quiet, absorbed, blank face. Shoulders relaxed. Light from the ceiling directly above: screentone shade under "
    "the brows, under the chin and on the chest under the bowed head. The card is paper and does NOT glow; nothing lights the face "
    "from below.")
TAIL = (
    "One single person, alone. Fully TRANSPARENT background (PNG alpha) everywhere outside the figure: no bench, no floor, no cast "
    "shadow, no frame, no paper colour behind it; every part of the figure fully opaque, including its paper-white parts. No text, "
    "no labels, no logos, no watermark. Absolutely no red, pink or orange anywhere.")
KEEP = "Keep this person's face, hairstyle, age, build and clothes exactly as on the attached set-pack sheet; only the pose and framing change."
NEW = ("This is a NEW person of the same town: draw them in exactly the hand of the attached set-pack lineup (same line, same dots, "
       "same proportions), but with a face different from everyone on it.")


def seated(who, extra, new=False):
    return "\n".join(["One character illustration for a film shot: a person of the town, seated on a night train.", who, HOLD,
                      extra, SEAT, TOWN_HAND, NEW if new else KEEP, TAIL])


LINEUP = '../canon/town/_lineup_same_scale.png'
P10 = {
    'p10_1': (seated("Kimura Hiroshi, section chief, about 58, 167 cm: bald on top with a short ring of white hair at the sides and "
                     "back, round glasses, an open DARK wool overcoat (dense dots) over a three-piece suit, a folded newspaper tucked "
                     "under his left arm against his side.",
                     "Knees a little apart. A sour, tired mouth."), ['../canon/town/h04_kimura_hiroshi_chief.png']),
    'p10_2': (seated("Suzuki Keiko, career woman, about 38, 160 cm: short neat hair, suit jacket and pencil skirt, low pumps; a "
                     "document folder held flat under her left forearm against her side.",
                     "Knees together, shins slanting slightly to the viewer's left. Stern, tired face."),
              ['../canon/town/h01_suzuki_keiko_career.png']),
    'p10_3': (seated("Matsumoto Aya, convenience-store clerk, 19, 155 cm, going home: ponytail, her striped uniform shirt under an "
                     "open zip-up hoodie (no apron), slim trousers, sneakers; small sleepy eyes with heavy lids, freckles.",
                     "Knees together, toes turned slightly inward. Exhausted face."), ['../canon/town/h02_matsumoto_aya_clerk.png']),
    'p10_4': (seated("An old woman, about 78, 148 cm, small with a rounded back: short permed white hair, a knitted cardigan vest "
                     "over a blouse, a long skirt, flat shoes; a cloth shopping bag with a leek sticking out stands on the floor "
                     "against her right shin (the viewer's left).",
                     "Knees together, feet side by side. A mild, blank face.", new=True), [LINEUP]),
    'p10_5': (seated("Shimizu Aoi, schoolgirl of another school, 16, 157 cm: long straight black hair (solid teal) gathered in one "
                     "low ponytail over her shoulder, sailor uniform, pleated skirt, dark knee socks, loafers; a school bag on the "
                     "floor at her feet.",
                     "Knees together, feet side by side. Expressionless."), ['../canon/town/h05_shimizu_aoi_sailor.png']),
    'p10_6': (seated("A construction worker, about 45, 170 cm, lean and wiry: short cropped hair, stubble, a work jacket with chest "
                     "pockets, baggy work trousers tucked into safety boots; his white hard hat sits on his left thigh (the viewer's "
                     "right), beside the card.",
                     "Knees apart, boots planted. Worn-out face.", new=True), [LINEUP]),
}
P10_SINK = ("At the same instant as everyone on the train: the head bows about 3 degrees further (the chin a little lower, the "
            "face tipped a little more toward the lap), the upper eyelids drop to HALF closed, the eyes unfocused and drowsy, and "
            "the card in the hands tips forward a little (its far edge dips toward the viewer, the wrists turning slightly with it). "
            "The shoulders, body, arms above the wrists, legs, shoes, clothes and bags do not move at all.")

HER_ID = IDENTITY.replace("a teal lanyard with her white name card in a clear holder",
                          "a thin teal lanyard round her neck (the card hangs at her chest, hidden behind the gig bag she hugs)")
HUG = ("She hugs the black soft guitar gig bag of the second attached image UPRIGHT against her front with both arms, as if holding "
       "on to it: the bag's narrow neck end is at the top, its top end level with her RIGHT shoulder and just beside it; the wide "
       "body end is lower, its bottom end at the height of her shins, hanging in front of her legs. Her forearms wrap round the bag "
       "at the height of her lower ribs. Her head is a little bowed, as if looking down at the bag.")
TRAIN_LIGHT = ("Lighting: inside a night train under flat white ceiling light from straight above: the flat colours of the "
               "turnaround, very slightly cool, exactly one hard-edged shadow tone per material (under the bow, under the chin, under "
               "the arms); no rim light, no glow, no light band along the outline.")
HER_ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the bag: no door, no floor, no shadow, no frame. "
             "Every part of her and the bag fully opaque. No text, no logos. No red anywhere.")
R_DOOR = "\n".join([HER_ID,
    "This drawing: BACK VIEW, full body. She stands on the floor of a night train facing a closed door 30 cm in front of her (the "
    "door is not drawn), her back to the viewer: we see the back of her blonde bob, the big white bow and headband from behind, the "
    "back of her charcoal blazer, her elbows at her sides, the pleated skirt, black knee socks and loafers (heels toward us). " + HUG +
    " Seen from behind, the top end of the bag shows just above and beside her RIGHT shoulder (the VIEWER'S RIGHT in this back view), "
    "and the wide lower part of the bag shows beyond both sides of her hips and thighs. The thin teal lanyard goes round the back of "
    "her neck under the hair. She stands still, weight on both feet, feet complete.",
    "Framing and scale: portrait canvas 2:3 showing a FIXED 1.80 m of height: the bottom edge 5 cm below the floor, the top edge "
    "1.75 m above the floor. She is 152 cm (her head top 152 cm, the bow higher). Centred. Camera at 1.2 m, straight on, long lens, "
    "no high or low angle.",
    DRAW, SHEET_RULE, TRAIN_LIGHT, HANDS, NEVER, HER_ALPHA])
R_REFL = "\n".join([HER_ID,
    "This drawing: FRONT VIEW, from the top of her bow down to her waist, facing the viewer straight on (the viewer is a dark window "
    "pane she is facing). " + HUG + " In this FRONT view her RIGHT shoulder is on the VIEWER'S LEFT, so the top end of the bag is on "
    "the viewer's LEFT, beside her chin. Her eyes are lowered, looking down at the bag, still open; an empty, tired face, mouth "
    "closed, brows level. Her hands are visible wrapped round the bag.",
    "Framing and scale: portrait canvas 2:3 showing a FIXED area 0.70 m wide and 1.05 m tall: the top edge 1.70 m above the floor, "
    "the bottom edge 0.65 m above the floor (it cuts across her and the bag below the waist). Centred. Camera at her eye height, "
    "straight on, long lens.",
    DRAW, SHEET_RULE, TRAIN_LIGHT, HANDS, NEVER, HER_ALPHA])
DOOR_SINK = ("her head bows about 4 degrees further forward: seen from behind, the back of her head tips forward and the big bow "
             "tips forward with it (a little more of the nape shows), and both shoulders sink about 1 cm. The arms, the gig bag, "
             "the skirt, the legs and the feet do not move at all.")
REFL_SINK = ("her head bows about 4 degrees further (the face tipped a little more down toward the bag), the upper eyelids drop to "
             "HALF closed and the eyes go unfocused and drowsy. The brows, mouth, hair, bow, arms, hands and bag do not move.")

ROW_COMMON = (
    "The FIRST attached image is a grey perspective guide drawn by the film's camera: draw each person EXACTLY where the guide puts "
    "them: each grey oval is that person's head (same place, same size), the grey stick line is the spine, thigh and shin of the "
    "seated body; the thin light lines are the bench and floor edges converging on the grey dot (the vanishing point, at the "
    "camera's eye height). The near people are big and cut by the bottom edge of the canvas at the lap, exactly as the guide shows; "
    "the far two sit on the next bench beyond a pair of doors. Nearer people overlap farther ones. The SECOND attached image is the "
    "town's set-pack lineup: draw every person in exactly its hand.\n"
    "Scene: five passengers of the town seated on one side of a commuter train car at night, seen from the aisle looking down the "
    "length of the car with a long lens (one-point perspective). Each holds a small paper card on the lap in both hands (it hangs "
    "from a thin teal lanyard round the neck) and looks down at it, the chin lowered about 30 degrees: ALL FIVE HEADS AT THE SAME "
    "ANGLE, like a row of the same machine. Quiet, absorbed, blank faces, eyes open on the card. Light from the ceiling straight "
    "above. Do NOT draw the bench, the windows, the floor, the straps or anything of the car: only the five people.\n" + TOWN_HAND +
    "\nFully TRANSPARENT background (PNG alpha) everywhere outside the people; every part of the people fully opaque. No text, no "
    "logos, no watermark. Absolutely no red, pink or orange anywhere.")
ROWS = {
    'p10_rowL': ("They sit on the LEFT bench and face the viewer's RIGHT (toward the opposite bench across the aisle): each in PROFILE "
                 "facing right, the nearest turned about 15 degrees toward the viewer, the far ones in pure profile. From near to "
                 "far: (1) a section chief about 58, bald on top with a ring of short white hair, round glasses, an open dark wool "
                 "overcoat; (2) a career woman about 38, short neat hair, suit jacket; (3) a clerk girl of 19, ponytail, a zip-up "
                 "hoodie over a striped shirt; (4, far) an old man in a flat cap and a quilted jacket; (5, far) a thin young man in a "
                 "hoodie with headphones round his neck."),
    'p10_rowR': ("They sit on the RIGHT bench and face the viewer's LEFT (toward the opposite bench across the aisle): each in PROFILE "
                 "facing left, the nearest turned about 15 degrees toward the viewer, the far ones in pure profile. From near to far: "
                 "(1) a schoolgirl of 16 in a sailor uniform, long straight black hair (solid teal) in one low ponytail; (2) a lean "
                 "construction worker about 45, cropped hair, stubble, work jacket, a hard hat on his knee under the card; (3) a "
                 "small old woman about 78, permed white hair, a knitted cardigan vest, a cloth shopping bag at her feet; (4, far) a "
                 "woman in a belted trench coat with a bob; (5, far) a university student in a knit beanie and a big scarf."),
}
ROW_SINK = ("All five heads bow about 3 degrees further at the same instant, by the same amount; every upper eyelid drops to HALF "
            "closed (drowsy, unfocused), and every card tips forward a little in the hands. Bodies, legs, clothes and positions do "
            "not move at all.")

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
HANDS_REF = '../ref/sheet_hands.png'
if __name__ == '__main__':
    def w(n, t):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
    masters, variants = [], []
    w('r10_door', R_DOOR); masters.append(f"-r10_door:{TURN}+{BAG}+{HANDS_REF}")
    w('r10_doorb', variant(DOOR_SINK)); variants.append(f"-r10_doorb:out/r10_door.png+{TURN}")
    w('r10_refl', R_REFL); masters.append(f"-r10_refl:{TURN}+{BAG}+{HANDS_REF}")
    w('r10_reflb', variant(REFL_SINK)); variants.append(f"-r10_reflb:out/r10_refl.png+{TURN}")
    for n, t in ROWS.items():
        side = n[-1]
        w(n, ROW_COMMON + "\n" + t); masters.append(f"-{n}:board/guide_seg10_row{side}.png+{LINEUP}")
        w(n + 'b', variant(ROW_SINK)); variants.append(f"-{n}b:out/{n}.png")
    for n, (t, ref) in P10.items():
        w(n, t); masters.append(f"-{n}:{'+'.join(ref)}")
        w(n + 'b', variant(P10_SINK)); variants.append(f"-{n}b:out/{n}.png+{ref[0]}")
    print('MASTERS', ' '.join(masters))
    print('VARIANTS', ' '.join(variants))
