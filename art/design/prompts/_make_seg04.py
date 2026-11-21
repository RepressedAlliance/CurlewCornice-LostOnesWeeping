"""Segment 04 (A1, docs/分镜/04_A1.md) sample drawings for the two designs of the key shot (k92-k104, her in front of the
enlarged card back, the gold Les Paul's first appearance, held like a weapon).

Design A (甲, 越肩拔琴): the gig bag hangs on her back from her right shoulder.
  - r04a_zip   (master)  front, eye level; right hand over the right shoulder pinching the zip pull at the bag's top end
  - r04a_half  (r04a_zip, one change: right arm and guitar: the guitar half drawn out over the right shoulder, gold shows)
  - r04a_hang  (r04a_zip, one change: right arm hangs, the fist grips the neck at the body, the guitar hangs at her thigh;
                the empty bag sags behind the shoulder)
Design B (乙, 甩到身前拉开): the bag swung to the front, held across her hips.
  - r04b_zip   (master)  front, eye level; the bag held across the hips, the right hand pulls the zip, a gold slit shows
  - r04b_half  (r04b_zip, one change: the guitar pulled half out of the bag by its neck, the bag sagging)
  - r04b_hang  (r04b_zip, one change: the bag gone (dropped), the guitar hangs from her right fist at her thigh, as r04a_hang)

Scale (fixed, so the page places every drawing by numbers): SQUARE canvas showing heights 0.40 m (bottom edge) to 1.85 m (top
edge), as the seg03 standing drawings but widened to a square (art/design/board/seg04_scale_sq.png is r03_up padded to a
square: the same size of her on the canvas). The card on her chest is NOT drawn: the lanyard ends at a clip, the page hangs her
card from it (card.js state of 03 onwards).
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg04.py [round]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, variant

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
GUITAR = '../canon/lespaul_goldtop_front_side_back.png'
SCALE = 'board/seg04_scale_sq.png'
HANDS_REF = '../ref/sheet_hands.png'

LIGHT = "Lighting: plain even daylight, the flat colours of the turnaround, one hard-edged shadow tone per material."
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her, the bag and the guitar: no floor, no shadow, no frame, "
         "no scenery, no paper. Every part of her, the bag and the guitar fully opaque. No text, no logos. No red anywhere.")
SCALE_TXT = (
    "Framing and scale (important: the film places this drawing by measurement): SQUARE canvas showing a FIXED 1.45 m of height: "
    "the top edge is 1.85 m above the floor and the bottom edge 0.40 m above the floor, so the bottom edge of the canvas cuts straight "
    "across her legs just above the knees (no knees, calves or feet; the legs reach the bottom edge). She is exactly as big on the "
    "canvas as in the fourth attached image (which shows this exact framing): the top of her head (not the bow) 23% of the canvas "
    "height below the top edge. Do NOT enlarge her to fill the canvas. Her body centred horizontally. Camera exactly at her eye height, "
    "straight on, long lens: no high or low angle, no perspective distortion, the shoulders level.")
LANYARD = ("A thin teal lanyard round her neck: its two strands come down over her shirt and meet at one small silver clip in the "
           "middle of her chest, at the height of the blazer's top button. NOTHING hangs from the clip: no card, no holder (the film "
           "adds her card later); the blazer and shirt below the clip are drawn complete.")
COLD = ("Her face: cold and expressionless, quietly threatening: the eyelids lowered (half-closed, heavy), the brows level and flat, "
        "the mouth a small closed straight line. Not sad, not crying, not angry-shouting, no smile. She does NOT look at the viewer.")
GUITAR_TXT = (
    "The guitar is exactly the Les Paul of the second attached image: gold top with cream binding, two cream P-90 pickups, cream "
    "pickguard, a bar bridge, four gold knobs, black headstock with NO logo and 3+3 tuners with cream buttons, rosewood fingerboard with "
    "cream trapezoid inlays; its back, sides and the back of the neck dark brown, nearly pencil black. Real proportions: 99 cm long, "
    "about two thirds of her height; the body 44 x 33 cm.")

ID = IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard (see below)")

A_ZIP = "\n".join([
    ID,
    "This drawing: she stands facing the viewer (front view), feet a little apart.",
    "The black soft guitar gig bag of the second attached image hangs on her back from her RIGHT shoulder only (her right is the "
    "viewer's LEFT), by one of its shoulder straps: the strap runs over her right shoulder and down across the front of her chest on the "
    "viewer's left side to her right side under the arm. The bag hangs behind her back, a little diagonal; its narrow neck end rises "
    "behind her right shoulder (viewer's LEFT), its rounded top about 15 cm above the top of her head, a little to the left of her head; "
    "the bag's body is hidden behind her. The bow stays fully visible in front of it.",
    "Her RIGHT arm (viewer's LEFT) is raised: the elbow lifted up beside her head, the forearm bent back over her right shoulder, and "
    "her right hand pinches the zip pull at the top of the bag's neck end, behind and above her shoulder, about to pull it open. Her "
    "LEFT arm hangs relaxed at her side, the hand loose.",
    "Her head tilts very slightly toward her right shoulder; her eyes look DOWN and to the side, toward her right shoulder (the "
    "viewer's left, downward). " + COLD,
    LANYARD, SCALE_TXT, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

B_ZIP = "\n".join([
    ID,
    "This drawing: she stands facing the viewer (front view), feet a little apart.",
    "She has swung the black soft guitar gig bag of the second attached image off her back to her front: she holds it across the front "
    "of her hips and thighs, almost horizontal (tilted only a little, the narrow neck end to the viewer's LEFT and slightly higher, the "
    "wide body end to the viewer's RIGHT), the bag's front face with its two zip pockets towards the viewer. One shoulder strap still "
    "runs from the bag up over her right shoulder (viewer's left). The whole bag (106 cm long) is inside the canvas, both ends visible. "
    "Her LEFT hand (viewer's right) supports the bag from underneath near its body end. Her RIGHT hand (viewer's left) pinches the zip "
    "pull on the TOP edge of the bag near the neck end and has pulled the zip open along a short stretch of the top edge: through that "
    "narrow gap a thin slit of the guitar inside shows: gold top with a cream binding line (the only warm colour).",
    "Her head is bowed a little and her eyes look DOWN at the gold slit. " + COLD,
    LANYARD, SCALE_TXT, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

V2 = {
    'r04a_half': ("r04a_zip", "her RIGHT arm and the bag's top only: the zip at the top of the bag's neck end is now pulled open, and her "
                  "right hand GRIPS the guitar's neck and has drawn the guitar half out of the bag, like drawing a sword from a scabbard "
                  "on her back: the dark neck comes out of the open bag behind her right shoulder and rises diagonally over her right "
                  "shoulder, her fist round the neck just above the shoulder, the black headstock (3+3 cream tuner buttons, no logo) "
                  "above and to the LEFT of her head (viewer's left, upward), fully inside the canvas. At the bag's open mouth just behind "
                  "her right shoulder the upper horn of the gold top body with its cream binding shows (a clear patch of gold). Her eyes "
                  "still look down and to her right shoulder, following the neck; the face stays cold, not looking at the viewer. " + GUITAR_TXT),
    'r04a_hang': ("r04a_zip", "her RIGHT arm, the guitar and the bag: the guitar is now completely out of the bag. Her RIGHT arm (viewer's "
                  "LEFT) hangs straight down at her side; her right fist grips the guitar's neck right where it joins the body (around "
                  "the 16th fret, knuckles towards the viewer), and the whole guitar hangs from her fist beside her right thigh: the gold "
                  "top faces the viewer, the gold body hangs below the fist along the outside of her thigh (the bottom of the body is cut "
                  "off by the bottom edge of the canvas), the neck rises from the fist slightly outward, the black headstock beside and "
                  "outside her right shoulder. She holds it like a weapon, not like an instrument. The now EMPTY gig bag hangs limp and "
                  "flat behind her right shoulder, no longer rising above the shoulder line; the strap stays as it was. Her head bows a "
                  "little more and her eyes look down along the neck at the guitar body; the face stays cold. " + GUITAR_TXT),
    'r04b_half': ("r04b_zip", "her hands, the bag and the guitar: the zip along the bag's top edge is pulled further open, and her RIGHT "
                  "hand (viewer's left) grips the guitar's neck and has pulled the guitar HALF out of the bag towards the viewer's left: "
                  "the neck and the black headstock (no logo, 3+3 cream tuner buttons) come out of the bag's opened neck end and point "
                  "up to the viewer's left, the upper half of the gold body has come out of the open zip; the bag sags down and slips "
                  "lower on her thighs, her left hand still under it. Her eyes follow the guitar, looking down; the face stays cold. " + GUITAR_TXT),
    'r04b_hang': ("r04b_zip", "her arms, the bag and the guitar: the bag has dropped and is GONE from the picture (remove the bag and its "
                  "strap completely; her blazer, skirt and legs are drawn complete where the bag was). Her RIGHT arm (viewer's LEFT) hangs "
                  "straight down at her side; her right fist grips the guitar's neck right where it joins the body (around the 16th fret, "
                  "knuckles towards the viewer), and the whole guitar hangs from her fist beside her right thigh: the gold top faces the "
                  "viewer, the gold body hangs below the fist along the outside of her thigh (the bottom of the body is cut off by the "
                  "bottom edge of the canvas), the neck rises from the fist slightly outward, the black headstock beside and outside her "
                  "right shoulder. She holds it like a weapon, not like an instrument. Her LEFT arm hangs relaxed at her side. Her head "
                  "bows a little and her eyes look down along the neck at the guitar body; the face stays cold. " + GUITAR_TXT),
}


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':
        write('r04a_zip', A_ZIP); out.append(f"-r04a_zip:{TURN}+{BAG}+{GUITAR}+{SCALE}+{HANDS_REF}")
        write('r04b_zip', B_ZIP); out.append(f"-r04b_zip:{TURN}+{BAG}+{GUITAR}+{SCALE}+{HANDS_REF}")
    elif rnd == '2':
        for n, (src, ch) in V2.items():
            write(n, variant(ch) + "\n" + HANDS + "\n" + NEVER)
            out.append(f"-{n}:out/{src}.png+{GUITAR}+{TURN}+{HANDS_REF}")
    elif rnd == '3':
        # design B's two swaps, from its own master; the hanging pose also takes design A's finished P4c as its pose reference
        for n in ('r04b_half', 'r04b_hang'):
            src, ch = V2[n]
            if n == 'r04b_hang':
                ch += (" The hanging pose of her right arm, fist and guitar exactly as in the second attached image (the same grip, the "
                       "same angle and height of the guitar beside her thigh); everything else of her from the first attached image.")
                refs = f"out/{src}.png+out/r04a_hang.png+{GUITAR}+{TURN}+{HANDS_REF}"
            else:
                refs = f"out/{src}.png+{GUITAR}+{TURN}+{HANDS_REF}"
            write(n, variant(ch) + "\n" + HANDS + "\n" + NEVER)
            out.append(f"-{n}:{refs}")
    elif rnd in ('4', '5', '6'):
        from _make_seg04_r4 import round45
        out = round45(rnd, write)
    print(' '.join(f'"{a}"' for a in out))
