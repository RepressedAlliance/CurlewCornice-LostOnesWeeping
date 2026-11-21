"""Segment 14 (最终副歌) FINAL drawings (docs/分镜/14_最终副歌.md, design 甲 + the two blind reviews' must_fix).

Why a new set: the sample drawings (_make_seg14.py) came back at 9.2 px/cm, so the chest-up framing (C3, 0.95 m high) blew them
up 1.24x (rule: at most 1.0x). Every standing drawing of her is redrawn at about 13 px/cm from ONE new master:
  - R14f_down   master: the sample's R14_down enlarged 1.413x into the new framing (art/design/board/seg14/R14_down_up.png) and
                redrawn crisp at full resolution. Landscape 3:2 showing 1.18 m x 0.79 m: top edge 1.70 m, bottom 0.91 m (behind
                the closed gate doors, whose top is 0.95 m), her centre line at 66% of the width.
  - R14f_see    (master, one change) head turned to the viewer's right, eyes a little wider          S2
  - R14f_askL   (master, one change) turns to the viewer's left and reaches her hand towards him     S3
  - R14f_askR   (master, one change) turns to the viewer's right and calls out, leaning              S3
  - R14f_grip   (master, one change) right fist grips the card, the upper card flat and facing us   S4
  - R14f_grip2  (R14f_grip, one change) squeezes harder, shoulders up, glaring                         S4
  - R14f_throw  (master shrunk into a wider canvas, board/seg14/R14f_down_wide.png, one change) the arm flung out, hand open
  - R14f_yank   (in-between of R14f_grip2 and R14f_throw) a pull forward and down: the card torn off the neck, the clasp at the
                back of the neck popped, the two strands running from the card up over both shoulders to the two clasp halves.
Town people for the seven-lane wide (W7), not drawn by 01 or 15 (01 scale: 1024 x 1536 showing 2.00 m to 0.25 m):
  - t14_p4 伊藤 亮, t14_p5 渡辺 翔, t14_p10 山口 茂, t14_p11 中村 トメ (from their set-pack sheets), t14_n4, t14_n7 (new people).
usage: python art/design/prompts/_make_seg14f.py   -> writes the prompts and prints the make_jobs line of each round
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant
import _make_seg15 as S15

TURN = '../canon/rin_turnaround.png'
LESPAUL = '../canon/lespaul_goldtop_front_side_back.png'
CARD_HERS = '../canon/card_front_hers_blank.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
UP = '../design/board/seg14/R14_down_up.png'
WIDE = '../design/board/seg14/R14f_down_wide.png'
OUT = '../design/out/'
o = lambda n: OUT + n + '.png'

ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and her guitar: no floor, no shadow, no frame, no gate, no "
         "scenery. Every part of her fully opaque. No text, no logos. No red anywhere.")
CARD_FACE = ("Her card stays a plain white card in a clear holder with only a thin printed teal border and a faint teal grid, "
             "flat and facing the viewer squarely (the film prints its face over it later), never bent, never turned edge-on.")
ARM = ("Her arm is a normal 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm): not "
       "short, not small, not foreshortened into a stub; the hand a slim young hand of normal size.")

DOWN = "\n".join([
    "The first attached image is an ENLARGED, blurry low-resolution copy of a finished drawing of this girl. Redraw it as a crisp, "
    "clean drawing at full resolution: EXACTLY the same framing, size and position in the canvas (do not move, shrink or enlarge her: "
    "every part of her stays where it is in the first image, the top of the bow, the shoulders, the card, the guitar headstock, the cut "
    "of the bottom edge), the same pose, the same face and expression, the same clothes and colours. Every line clean, sharp and even "
    "at this size, as if drawn for this size; nothing blurry, nothing soft.",
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "her name card on a teal lanyard"),
    "She stands still, facing the viewer, head bowed, eyes looking DOWN at the card on her chest, eyelids lowered, bangs shading her "
    "eyes a little; a quiet, lost face, mouth closed, no tears. Both arms hang relaxed at her sides (cut by the bottom edge). Her guitar "
    "(the second attached image) is on her back on a black strap running from her left shoulder (viewer's right) across her chest; "
    "only its dark brown neck and headstock show behind her left shoulder (viewer's right). Her name card (the third attached image) "
    "hangs flat on the middle of her chest from a TEAL lanyard about 1.5 cm wide coming down from both sides of her neck to the clip on "
    "the card's top edge. " + CARD_FACE,
    DRAW, SHEET_RULE, LARGE, HANDS, NEVER, ALPHA])

KEEP = " Her body, arms, card, lanyard and guitar do not move."
V = {
    'R14f_see': variant(
        "only her HEAD and EYES: she lifts her head a little and turns it about 40 degrees to the viewer's RIGHT (her left), towards "
        "the person standing in the next lane; her eyes open a little wider, looking to the viewer's right at her own eye level (NOT at "
        "the viewer), stunned; her mouth stays closed. No shouting." + KEEP),
    'R14f_askL': variant(
        "she turns her head about 45 degrees to the viewer's LEFT (her right), towards the man standing in the next lane, eyebrows "
        "raised, lips parted as if about to ask him something; her eyes look to the viewer's left at her own eye level (NOT at the "
        "viewer). Her RIGHT hand (on the viewer's LEFT) comes up a little from her side and reaches out towards him at waist height, "
        "fingers loosely open, as if about to touch his sleeve (the forearm forward and out to the viewer's left, the hand at about the "
        "height of her waist, inside the canvas). Her left arm, the card, the lanyard and the guitar do not move. " + ARM),
    'R14f_askR': variant(
        "she turns her head about 45 degrees to the viewer's RIGHT (her left) and leans her head and shoulders a little that way; her "
        "mouth opens WIDE as if calling out to someone over there; her eyebrows rise and pinch together, pleading; her eyes look to the "
        "viewer's right at her own eye level (NOT at the viewer)." + KEEP),
    'R14f_grip': variant(
        "her RIGHT hand (on the viewer's LEFT) comes up and grips the bottom edge of her card in a tight fist, pulling it down so the "
        "lanyard goes taut: the fist covers only the lower third of the card from below; the upper two thirds of the card (with its top "
        "edge and clip) stay visible, FLAT and facing the viewer squarely. Her head bows a little lower, her eyes on the card. Her left "
        "arm still hangs at her side. " + CARD_FACE + " " + ARM),
}
GRIP2 = variant(
    "she squeezes harder and pulls: her fist on the bottom of the card clenches tighter and pulls the card a little lower, so both "
    "strands of the lanyard are pulled straight and tight from the card up to the sides of her neck; her shoulders hunch up, her chin "
    "is tucked in, and she glares at the card from under her bangs, teeth clenched. The upper two thirds of the card stay FLAT and "
    "facing the viewer. Nothing else moves.")
THROW = variant(
    "she has just THROWN the card: her RIGHT arm (on the viewer's LEFT) is flung out to the viewer's LEFT, fully extended and nearly "
    "straight, rising a little from the shoulder so the open hand is level with her CHIN, reaching far out towards the left part of the "
    "canvas but staying inside it with a clear margin. The hand is OPEN, fingers spread, palm towards the viewer, EMPTY (the card is NOT "
    "in the picture). The card and the lanyard are GONE from her: nothing round her neck except her collar and tie. Her left arm still "
    "hangs at her side. Her face turns a little to the viewer's left, her eyes follow the thrown card (looking past the viewer to the "
    "left, not at the viewer), mouth open wide, singing hard. The guitar strap and guitar stay exactly as they are. " + ARM)
YANK = "\n".join([
    "Redraw the girl of the first attached image (R14f_grip2) in the SAME canvas, framing, size and position, the same line work, "
    "colours and lighting, keep the fully TRANSPARENT background (PNG alpha). This drawing is the instant BETWEEN the first image and "
    "the second image (the throw, drawn smaller on a wider canvas: use it only for the arm's direction and the face).",
    "She has just YANKED the card OFF HER NECK with one hard pull forward and down: her RIGHT fist (on the viewer's LEFT), still "
    "gripping the bottom of the card, has pulled it out in front of her and down to the viewer's left, to the height of her lower ribs, "
    "about 25 cm out to the viewer's left of her body's centre, the elbow bent and drawn back at her side (a pull, not a punch: the "
    "forearm points down and forward, the arm NOT stretched out sideways). The card in her fist is FLAT and faces the viewer, tilted "
    "about 15 degrees. The lanyard is ONE teal strap: from the clip on the top of the card its two strands run up, pulled straight and "
    "TAUT, over the fronts of both her shoulders to the back of her neck, and there the plastic safety clasp has just SNAPPED OPEN: "
    "its two small teal plastic halves are flying up into the air just above her shoulders on either side of her neck, each still on "
    "the end of its strand, so you can see the strap is connected all the way from the card to the two popped clasp halves. The strands "
    "lift off her shoulders; NOTHING is tight round her neck, no loop round the neck at all, nothing crosses her face.",
    "Her head lifts with the pull, teeth clenched, eyes wide and furious, looking at the card in her fist (not at the viewer). Her "
    "left arm hangs. The guitar and its strap stay exactly as they are. " + CARD_FACE + " " + ARM,
    "Everything else exactly as in the first image, line for line."])

# ---- the town: four people of the set pack, two new people (the 01/15 scale and style) ----
def town_canon(who, pose):
    return "\n".join(["One character illustration for a film shot: a person of the town, redrawn from the attached set-pack sheet "
                      "(this same person: the same face, hair, build and clothes).", who,
                      "Pose: standing still in a station hall, body and face toward the viewer (front view), the HEAD BOWED forward and "
                      "the EYES LOOKING DOWN at the middle of their own chest (where their name card will hang), eyelids lowered, a "
                      "quiet empty face. Shoulders level and relaxed. " + pose,
                      S15.TLANYARD + " Nothing hangs from it in this drawing: NO card, NO clip, NO holder.",
                      S15.TSCALE, S15.TOWN_HAND, S15.TTAIL])

TOWN = {
    't14_p4': town_canon("Ito Ryo, cram-school teacher, about 33, 175 cm, V-neck sweater over a shirt, holding a stack of textbooks.",
                         "He holds the stack of textbooks against his right hip with his right arm (at the side, the chest stays clear); "
                         "his left arm hangs relaxed."),
    't14_p5': town_canon("Watanabe Sho, a boy from another high school, 17, 170 cm, close-cropped hair, a black stand-collar gakuran "
                         "uniform, a messenger bag on a strap.",
                         "The bag hangs at his left hip, its strap over his RIGHT shoulder running behind his arm (not across the "
                         "middle of the chest: the chest stays clear); both arms hang relaxed."),
    't14_p10': town_canon("Yamaguchi Shigeru, station staff, about 55, 170 cm, heavy-set, station uniform jacket and uniform cap.",
                          "Both arms hang relaxed at his sides."),
    't14_p11': town_canon("Nakamura Tome, an old woman of about 82, 142 cm, bent back, round glasses, a shopping cart.",
                          "Both hands rest on the handle of her small shopping cart beside her on the viewer's right, at hip height "
                          "(the cart at her side, the chest stays clear)."),
    't14_n4': S15.town_new("A man of about 45, 170 cm, broad, short greying hair parted at the side, a dark suit with a loosened tie, "
                           "a briefcase.",
                           "His right hand holds a briefcase down at his side; his left arm hangs relaxed."),
    't14_n7': S15.town_new("A girl of about 19, 160 cm, slim, a short dark bob with a fringe, an oversized knit cardigan over a long "
                           "skirt, a tote bag on her right shoulder.",
                           "Her right hand holds the strap of the tote bag at her shoulder (at the side, the chest stays clear); her "
                           "left arm hangs relaxed."),
}
CANON = {'t14_p4': 'p04_ito_ryo_cramschool', 't14_p5': 'p05_watanabe_sho_gakuran', 't14_p10': 'p10_yamaguchi_shigeru_stationstaff',
         't14_p11': 'p11_nakamura_tome_cart'}

# round 1b: R14f_down hung the card at hip height (its centre 0.98 m), under the chest-up frame's bottom edge (0.95 m, the
# doors' top); the lanyard shortened so the card hangs on her upper stomach. R14f_down2 is the master from here on.
DOWN2 = variant(
    "only the LANYARD and the CARD: the lanyard is SHORTER, so her name card hangs HIGHER, on her upper stomach just below her chest: "
    "the card's centre about 20 cm higher than now (the card's centre at about 79% of the canvas height from the TOP edge, its "
    "bottom edge well above the bottom edge of the canvas), still in the middle of her body, flat and facing the viewer squarely, the "
    "same size. The two teal strands run from both sides of her neck down to the clip on the card's top edge. Her face, hair, bow, "
    "arms, clothes, guitar and everything else stay exactly where they are, line for line.")
# round 3: R14f_askL's reaching hand came out at 1.0 m, under the medium shot's bottom edge (about 1.05 m): redrawn from it
# with the hand raised to her chest height, towards his elbow
ASKL2 = variant(
    "only her RIGHT ARM (on the viewer's LEFT): she raises it higher: the reaching hand is now at the height of her CHEST (the "
    "fingertips at about 64% of the canvas height from the TOP edge, level with the top edge of her card), still reaching out to the "
    "viewer's left towards the man in the next lane as if to tap his elbow, fingers loosely open, palm down, the elbow slightly bent. "
    "Her head, face, eyes, mouth, left arm, card, lanyard and guitar stay exactly as they are. " + ARM)
PROMPTS = {'R14f_askL2': ASKL2, 'R14f_down': DOWN, 'R14f_down2': DOWN2, **V, 'R14f_grip2': GRIP2, 'R14f_throw': THROW, 'R14f_yank': YANK, **TOWN}
for k, v in PROMPTS.items():
    open(os.path.join(here, k + '.txt'), 'w', encoding='utf-8').write(v)

town_jobs = [f'-{k}:../canon/town/{CANON[k]}.png' if k in CANON else f'-{k}:{S15.TOWN_STYLE_REF}' for k in TOWN]
ROUNDS = {
    1: [f'-R14f_down:{UP}+{TURN}+{LESPAUL}+{CARD_HERS}+{FACES_REF}+{HANDS_REF}'] + town_jobs,
    15: [f'-R14f_down2:{o("R14f_down2")}+{TURN}+{CARD_HERS}'],
    2: [f'-R14f_see:{o("R14f_down2")}+{TURN}', f'-R14f_askL:{o("R14f_down2")}+{TURN}+{HANDS_REF}', f'-R14f_askR:{o("R14f_down2")}+{TURN}',
        f'-R14f_grip:{o("R14f_down2")}+{TURN}+{HANDS_REF}', f'-R14f_throw:{WIDE}+{TURN}+{HANDS_REF}'],
    3: [f'-R14f_grip2:{o("R14f_grip")}+{TURN}+{HANDS_REF}', f'-R14f_askL2:{o("R14f_askL")}+{TURN}+{HANDS_REF}'],
    4: [f'-R14f_yank:{o("R14f_grip2")}+{o("R14f_throw")}+{TURN}+{HANDS_REF}'],
}
if __name__ == '__main__':
    for r, args in ROUNDS.items():
        print(f'round {r}: python tools/make_jobs.py seg14_f{r} ' + ' '.join(f'"{a}"' for a in args))
