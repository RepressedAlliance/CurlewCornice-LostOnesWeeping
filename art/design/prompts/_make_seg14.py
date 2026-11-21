"""Segment 14 (最终副歌, docs/分镜/14_最终副歌.md) sample drawings for the two designs of the key shot (k471-k488).

Shared (S3, she looks round for someone to ask; both designs):
  - R14_down   (master)  front, eye level, behind the closed gate, head bowed over her own card on her chest, Les Paul on her back
  - R14_askL   (R14_down, one change: head turned to the viewer's left, about to ask)
  - R14_askR   (R14_down, one change: head turned to the viewer's right, calling out)
Design A (甲, four steps in, a yank and a throw, the card flies at us and fills the frame):
  - R14_grip   (R14_down, one change: right fist grips the card on her chest)
  - R14_grip2  (R14_grip, one change: squeezes harder, shoulders up, glaring)
  - R14_throw  (R14_down, one change: right arm flung out to the viewer's left, hand open, the card and lanyard gone)
  - R14_yank   (the in-between of R14_grip2 and R14_throw: the card yanked out, the clasp popped, the lanyard sliding off)
Design B (乙, the close-up of 00's first frame turned round: the card held to her nose, yanked off, let go):
  - R14b_hold  (r00_cover_v3 redrawn with two changes: eyes down, the card printed and on its lanyard)
  - R14b_yank  (R14b_hold, one change: the card yanked down out of the frame, the clasp popped, the face bare)
  - R14b_let   (R14b_hold, one change: hands and card gone, the face bare, singing with lowered eyes)
  - R14b_free  (R14_down, one change: no card, no lanyard, head up, singing, for the wide shot where the town's cards fall)

Scale of the standing drawings (fixed, so the page places every one of them by numbers): landscape 3:2 canvas showing a fixed
1.31 m x 0.88 m: bottom edge 0.80 m above the floor, top edge 1.68 m; 11.7 px/cm; her body's centre line at 66% of the width.
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg14.py   -> writes the .txt prompts and prints the make_jobs arguments for each round
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
LESPAUL = '../canon/lespaul_goldtop_front_side_back.png'
CARD_HERS = '../canon/card_front_hers_blank.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
COVER = '../cut/r00_cover_v3.png'
OUT = '../design/out/'

LIGHT = "Lighting: plain even indoor daylight of a station hall, the flat colours of the turnaround, one hard-edged shadow tone per material."
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and her guitar: no floor, no shadow, no frame, no gate, no "
         "scenery. Every part of her fully opaque. No text, no logos. No red anywhere.")
SCALE = (
    "Framing and scale (important: the film places this drawing by measurement): LANDSCAPE canvas 3:2 showing a FIXED 1.31 m wide by "
    "0.88 m high: the top edge is 1.68 m above the floor and the bottom edge 0.80 m above the floor, so the bottom edge cuts straight "
    "across her hips (no legs in the picture; her body must reach the bottom edge). She is 152 cm tall: the top of her head (the hair, "
    "not the bow) is 18% of the canvas height below the top edge; the bow rises above it but stays inside the canvas. Do NOT enlarge her "
    "to fill the canvas. Her body's vertical centre line is at 66% of the canvas width from the LEFT edge (she stands right of centre; "
    "the left third of the canvas stays empty for a later arm movement). Camera exactly at her eye height (about 1.4 m), straight on, "
    "long lens: no high or low angle, no perspective distortion, the shoulders level.")
GUITAR = (
    "Her guitar (the gold-top Les Paul of the second attached image) is slung on her BACK on a plain black strap: the strap runs "
    "diagonally across the front of her body from her LEFT shoulder (on the viewer's RIGHT) down to her right hip; behind her only the "
    "guitar's neck and headstock show, rising behind her LEFT shoulder on the viewer's RIGHT, tilted a little outward, seen from the "
    "back: the dark brown back of the neck (#3A302C, near pencil black) and the back of the headstock with three tuning pegs. The bow "
    "stays fully visible in front of it. No gig bag.")
CARD = (
    "Her name card: a white landscape card 15 x 10 cm in a thin clear plastic holder (the third attached image: the teal printed grid "
    "of empty oval bubbles, nothing filled, nothing written), hanging flat on the middle of her chest, facing the viewer squarely (not "
    "tilted, not turned), so the film can print on it. It hangs on a TEAL lanyard about 1.5 cm wide (a little wider than real so it "
    "reads on screen) that runs from both sides of her neck down to the clip in the middle of the card's top edge.")

R14_DOWN = "\n".join([
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "her name card on a teal lanyard (described below)"),
    "This drawing: she stands still in a lane of the station's automatic ticket gates, behind the closed gate doors, facing the viewer "
    "(front view). Her HEAD is bowed and her eyes look DOWN at the card on her chest, eyelids lowered, her bangs shading her eyes a "
    "little; a quiet, lost face, mouth closed. No tears. Both arms hang relaxed at her sides.",
    GUITAR, CARD, SCALE, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

ARM = ("Her arm is a full-length 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm, "
       "about 760 px on this canvas): not short, not small, not foreshortened into a stub; the hand a slim young hand of normal size.")

V = {
    'R14_askL': variant(
        "her head turns to the viewer's LEFT (her right) by about 45 degrees, towards the person standing in the next lane; her "
        "eyebrows rise, her lips part as if she is about to ask something; her eyes look to the viewer's left at her own eye level "
        "(not at the viewer). Her body, arms, card, lanyard and guitar do not move."),
    'R14_askR': variant(
        "her head turns to the viewer's RIGHT (her left) by about 45 degrees and leans a little forward; her mouth opens wider as if "
        "calling out to someone over there; her eyebrows rise and pinch together; her eyes look to the viewer's right at her own eye "
        "level (not at the viewer). Her body, arms, card, lanyard and guitar do not move."),
    'R14_grip': variant(
        "her RIGHT hand (on the viewer's LEFT) comes up and grips her card on her chest in a tight fist: the fist covers the lower half "
        "of the card from below, the upper half of the card (with its top edge, clip and the top rows of the grid) stays visible and "
        "facing us, its free corners bent up a little by the squeeze. The lanyard still hangs slack round her neck. Her head bows a "
        "little lower; her left arm still hangs at her side. " + ARM.replace("full-length", "normal")),
    'R14_throw': variant(
        "she has just THROWN the card: her RIGHT arm (on the viewer's LEFT) is flung out to the viewer's LEFT and a little towards the "
        "viewer, fully extended, about 45 degrees out from her body, the hand at about 1.15 m above the floor and reaching to about 20% "
        "of the canvas width from the left edge; the hand is OPEN, fingers spread, palm towards the viewer, empty (the card is NOT in "
        "the picture). The card and the lanyard are GONE from her: nothing round her neck except her collar and tie. Her left arm "
        "still hangs. Her face turns a little to the viewer's left, her eyes follow the thrown card (looking past the viewer to the "
        "left, not at the viewer), mouth open wide, singing hard. The guitar strap and guitar stay as they are. " + ARM),
}
V['R14b_free'] = variant(
    "the card and the lanyard are GONE: nothing round her neck except her collar and tie, nothing on her chest but the blazer, tie "
    "and guitar strap. Both arms hang loosely. Her head is raised level (no longer bowed); her eyes, half-lidded, stare straight ahead "
    "past the viewer (a little to the viewer's left, NOT into the camera); her mouth is open, singing, tired and free, not smiling.")

# round 3: from the drawings of round 2
GRIP2 = variant(
    "she squeezes harder: the card is bent into a curve in her fist, her shoulders hunch up, her chin is tucked in, and she glares at "
    "the card from under her bangs, teeth clenched. Nothing else moves.")
YANK = "\n".join([
    "Redraw the girl of the first attached image (R14_grip) in the SAME canvas, framing, size and position, the same line work, colours "
    "and lighting, keep the fully TRANSPARENT background (PNG alpha). This drawing is the moment BETWEEN the first image and the second "
    "image (R14_throw): every part of her lies between the two.",
    "She YANKS: her RIGHT fist (on the viewer's LEFT), still gripping the card, has pulled the card out and down to the viewer's left, "
    "to about the height of her waist (about 1.0 m above the floor, just above the bottom edge), the arm half extended, the card "
    "turned a little. The plastic safety clasp at the back of her neck has popped open: the two loose ends of the TEAL lanyard fly up "
    "off both her shoulders and slide down, the loose ends whipping out beside her neck on both sides; the lanyard runs from the card "
    "in her fist up to the two loose ends; NOTHING is tight round her neck, no loop round the neck at all. Her head lifts, teeth "
    "clenched, eyes wide, looking at the card in her fist (not at the viewer). Her left arm hangs. The guitar and its strap stay "
    "exactly as they are. " + ARM.replace("full-length", "normal"),
    "Everything else exactly as in the first image, line for line."])

# round 3 (as run): R14_throw of round 2 held the hand at chest height and read as a reach, not a throw; redrawn with the arm
# rising to chin height. Round 4 (as run): the in-between, two tries from R14_grip2 + R14_throw2; R14_yankB is the one in the
# film (art/cut/R14_yank.png): both clasp ends fly clear of the neck, nothing round the neck reads as a loop.
THROW2 = variant("she has just THROWN the card: her RIGHT arm (on the viewer's LEFT) is flung out to the viewer's LEFT, fully extended and nearly straight, pointing out and slightly UP: the arm rises a little from the shoulder so the open hand is at the height of her CHIN (about one third of the canvas height down from the top edge, level with her chin, well above the height of her chest), reaching to about 22% of the canvas width from the left edge. The hand is OPEN, fingers spread, palm towards the viewer, empty (the card is NOT in the picture). The card and the lanyard are GONE from her: nothing round her neck except her collar and tie. Her left arm still hangs at her side. Her face turns a little to the viewer's left, her eyes follow the thrown card (looking past the viewer to the left, not at the viewer), mouth open wide, singing hard. The guitar strap and guitar stay as they are. Her arm is a full-length 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm, about 600 px on this canvas): not short, not small, not foreshortened into a stub; the hand a slim young hand of normal size.")
YANK4 = "Redraw the girl of the first attached image (R14_grip2) in the SAME canvas, framing, size and position, the same line work, colours and lighting, keep the fully TRANSPARENT background (PNG alpha). This drawing is the moment BETWEEN the first image and the second image (R14_throw2): every part of her lies between the two.\nShe YANKS: her RIGHT fist (on the viewer's LEFT), still gripping the card, has pulled the card out and down to the viewer's left, to the height of her waist and about a forearm's length out to the viewer's left of her body (the fist at about 55% of the canvas height from the top, at about 52% of the canvas width from the left), the arm half extended and straightening, the card turned a little. The plastic safety clasp at the back of her neck has popped open: the two loose ends of the TEAL lanyard fly up off both her shoulders and slide down, the loose ends whipping out beside her neck on both sides; the lanyard runs from the card in her fist up to the two loose ends; NOTHING is tight round her neck, no loop round the neck at all. Her head lifts, teeth clenched, eyes wide, looking at the card in her fist (not at the viewer). Her left arm hangs. The guitar and its strap stay exactly as they are. Her arm is a normal 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm, about 760 px on this canvas): not short, not small, not foreshortened into a stub; the hand a slim young hand of normal size.\nEverything else exactly as in the first image, line for line."
YANK4B = "Redraw the girl of the first attached image (R14_grip2) in the SAME canvas, framing, size and position, the same line work, colours and lighting, keep the fully TRANSPARENT background (PNG alpha). This drawing is the moment BETWEEN the first image and the second image (R14_throw2): every part of her lies between the two.\nShe YANKS: her RIGHT fist (on the viewer's LEFT), still gripping the card, has pulled the card out and down to the viewer's left, to the height of her waist and about a forearm's length out to the viewer's left of her body (the fist at about 55% of the canvas height from the top, at about 52% of the canvas width from the left), the arm half extended and straightening, the card turned a little. The plastic safety clasp at the back of her neck has popped open: the two loose ends of the TEAL lanyard fly up off both her shoulders and slide down, the loose ends whipping out beside her neck on both sides; the lanyard runs from the card in her fist up to the two loose ends; NOTHING is tight round her neck, no loop round the neck at all. Her head lifts, teeth clenched, eyes wide, looking at the card in her fist (not at the viewer). Her left arm hangs. The guitar and its strap stay exactly as they are. Her arm is a normal 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm, about 760 px on this canvas): not short, not small, not foreshortened into a stub; the hand a slim young hand of normal size.\nEverything else exactly as in the first image, line for line."
# round 5 (as run): in the film the fist of R14_yankB sits at 0.95-1.0 m, on the C3 frame's bottom edge and behind the gate
# machine's top, so the yank could not be seen; redrawn from R14_yankB with the fist raised. R14_yankD is the one in the film
# (art/cut/R14_yank.png): the arm out at mouth height, both clasp ends in the air; R14_yankC's strand lies across her collar.
YANK5C = "Redraw the first attached image exactly: the same figure, face, hair, bow, clothes, the same framing, size and position in the canvas, the same line work, colours and lighting, keep the fully TRANSPARENT background (PNG alpha). Change only this: her RIGHT arm (on the viewer's LEFT) is RAISED: the fist, still gripping the card, is now at the height of her CHIN and collarbones, not at her chest or waist: the fist's centre at about 40% of the canvas height from the TOP edge and about 36% of the canvas width from the LEFT edge, the elbow bent a little and pointing down-left, the forearm swinging up and out to the viewer's left (a pull that is turning into a throw). The card in the fist faces the viewer, a little tilted. The two TEAL lanyard strands run from the card up and back over to the two popped clasp ends, which still fly free in the air above her shoulders on both sides of her head exactly as now; NOTHING touches or loops round her neck. Her face, teeth, eyes and everything else stay as they are. Her arm is a normal 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm, about 600 px on this canvas): not short, not small, not foreshortened into a stub; the fist a slim young hand of normal size. Everything else stays exactly as it is, line for line."
YANK5D = "Redraw the first attached image exactly: the same figure, face, hair, bow, clothes, the same framing, size and position in the canvas, the same line work, colours and lighting, keep the fully TRANSPARENT background (PNG alpha). Change only this: her RIGHT arm (on the viewer's LEFT) swings UP and out: the fist, still gripping the card, is now level with her MOUTH: the fist's centre at about 38% of the canvas height from the TOP edge and about 33% of the canvas width from the LEFT edge, the arm almost straight, rising from the shoulder towards the viewer's upper left. The card in the fist faces the viewer, a little tilted. The two TEAL lanyard strands trail from the card back towards her shoulders and end in the two popped clasp ends flying free in the air beside her head; NOTHING touches or loops round her neck. Her face, teeth, eyes and everything else stay as they are. Her arm is a normal 14-year-old girl's arm, the same length as on the turnaround (shoulder to fingertips about 65 cm, about 600 px on this canvas): not short, not small, not foreshortened into a stub; the fist a slim young hand of normal size. Everything else stays exactly as it is, line for line."

# ---- design B: the close-up ----
B_HOLD = "\n".join([
    "Redraw the first attached image (00's first frame of this film) exactly: the same girl, face, hair, bow, hands, the same framing, "
    "size and position in the canvas, the same line work and colours, a fully TRANSPARENT background (PNG alpha, no glow round her). "
    "Change only these two things:",
    "1) Her eyes look DOWN (eyelids lowered, irises low, looking at the top edge of the card), NOT at the viewer; her brows stay drawn "
    "tight, angry and hurt.",
    "2) The card she holds now has the teal printed grid of the third attached image on its face (the same card size and position as "
    "the plain card, facing us squarely), and below the card's bottom edge two strands of a TEAL lanyard (about 1.5 cm wide) come "
    "down from behind the card to both sides of her collar.",
    "The second attached image is her turnaround: match it.", LARGE, HANDS, NEVER])
B_YANK = "\n".join([
    "Redraw the first attached image exactly: the same girl, face, hair, bow, the same framing, size and position in the canvas, the "
    "same line work and colours, keep the fully TRANSPARENT background (PNG alpha). Change only this:",
    "she has YANKED the card away from her face: her RIGHT hand (on the viewer's LEFT), still gripping the card in a fist, has pulled "
    "it DOWN and out to the bottom-left corner of the canvas (the card tilted, partly cut by the bottom edge); her other hand has let "
    "go and is out of the picture. Her whole face is now bare: teeth clenched, eyes wide open, looking down at the card in her fist "
    "(NOT at the viewer). The plastic safety clasp at the back of her neck has popped open: the two loose ends of the TEAL lanyard "
    "fly off her shoulders on both sides of her neck, whipping outward, running down to the card in her fist; nothing is tight round "
    "her neck, no loop round the neck at all.",
    "The second attached image is her turnaround: match it.", LARGE, HANDS, NEVER])
B_LET = "\n".join([
    "Redraw the first attached image exactly: the same girl, face, hair, bow, the same framing, size and position in the canvas, the "
    "same line work and colours, keep the fully TRANSPARENT background (PNG alpha). Change only this:",
    "her hands and the card are GONE from the picture (she has let go; her hands are down out of the frame). Her whole face is bare. "
    "Her eyelids are half lowered, her eyes look down and a little to the viewer's left past the viewer (NOT at the viewer), and her "
    "mouth is open, singing, tired and done with it: let go, not angry, not smiling. No lanyard round her neck, nothing on her chest "
    "but the blazer, shirt and teal ribbon tie.",
    "The second attached image is her turnaround: match it.", LARGE, NEVER])

PROMPTS = {'R14_down': R14_DOWN, **V, 'R14_grip2': GRIP2, 'R14_throw2': THROW2, 'R14_yank': YANK4, 'R14_yankB': YANK4B, 'R14_yankC': YANK5C, 'R14_yankD': YANK5D,
           'R14b_hold': B_HOLD, 'R14b_yank': B_YANK, 'R14b_let': B_LET}
for k, v in PROMPTS.items():
    open(os.path.join(here, k + '.txt'), 'w', encoding='utf-8').write(v)

o = lambda n: OUT + n + '.png'
ROUNDS = {
    1: [f'-R14_down:{TURN}+{LESPAUL}+{CARD_HERS}+{HANDS_REF}', f'-R14b_hold:{COVER}+{TURN}+{CARD_HERS}+{FACES_REF}+{HANDS_REF}'],
    2: [f'-R14_askL:{o("R14_down")}+{TURN}', f'-R14_askR:{o("R14_down")}+{TURN}',
        f'-R14_grip:{o("R14_down")}+{TURN}+{HANDS_REF}', f'-R14_throw:{o("R14_down")}+{TURN}+{HANDS_REF}',
        f'-R14b_free:{o("R14_down")}+{TURN}',
        f'-R14b_yank:{o("R14b_hold")}+{TURN}+{FACES_REF}+{HANDS_REF}', f'-R14b_let:{o("R14b_hold")}+{TURN}+{FACES_REF}'],
    3: [f'-R14_throw2:{o("R14_down")}+{TURN}+{HANDS_REF}', f'-R14_grip2:{o("R14_grip")}+{TURN}+{HANDS_REF}'],
    4: [f'-R14_yank:{o("R14_grip2")}+{o("R14_throw2")}+{TURN}+{HANDS_REF}', f'-R14_yankB:{o("R14_grip2")}+{o("R14_throw2")}+{TURN}+{HANDS_REF}'],
    5: [f'-R14_yankC:{o("R14_yankB")}+{o("R14_throw2")}+{TURN}+{HANDS_REF}', f'-R14_yankD:{o("R14_yankB")}+{o("R14_throw2")}+{TURN}+{HANDS_REF}'],
}
if __name__ == '__main__':
    for r, args in ROUNDS.items():
        print(f'round {r}: python tools/make_jobs.py seg14_r{r} ' + ' '.join(f'"{a}"' for a in args))
