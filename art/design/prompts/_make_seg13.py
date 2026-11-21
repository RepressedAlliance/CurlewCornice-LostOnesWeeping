"""Segment 13 (C, docs/分镜/13_C.md) sample drawings for the two designs of the reveal (k437-k455).

Both designs:
  - h13_open     (master of the desk hand) her right hand from straight above (her own view down at the desk), thumb and
                 index finger pinching the edge of a folded paper as if lifting it; the paper is NOT drawn (code draws it)
  - h13_erase    (h13_open, only the grip changed) the same hand pinching the lower end of the big eraser, the eraser at 35
                 degrees from vertical (upper end to the upper left); the eraser IS drawn, with a blank sleeve, so the grip is
                 real; tools/seg13_cut.py removes the eraser pixels and the page draws the canon eraser in their place
  - h13_hover    (h13_erase, only the tension changed) about to come down: wrist pressed lower, fingers tighter
  - r13_face     (master) bust at eye level across the desk, her right hand holding the eraser up by her chin, eyes down on it,
                 wet eyes, no tear falling, lamp light from the side (viewer's left, low)
  - r13_face_up  (r13_face, only the eyes) she looks up straight into the camera
  - r13_face_tear (r13_face, design A only) one tear has run down and drops from her chin line
Props (pencil on plain white, composited with multiply):
  - p13_guitar   a six-year-old's careful pencil drawing of an electric guitar (Les Paul outline)
  - p13_kids     four other children's small pencil drawings in a 2x2 grid: airplane, bread, soccer ball, tulip

Guides (grey lines, position and scale only): board/guide_h13_arm.png, board/guide_h13_eraser.png (50 px/cm, 1024x1536).
usage: python art/design/prompts/_make_seg13.py      -> writes guides + prompts and prints the make_jobs arguments
"""
import math, os, sys
from PIL import Image, ImageDraw
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
HWRITE = '../cut/h08b_write.png'        # 08b: the same hand, the same night, from straight above
STARE = '../cut/r08b_stare.png'         # 08b: the same face, the same night
ERASER = '../canon/machine_big_eraser.png'
LESPAUL = '../canon/lespaul_goldtop_front_side_back.png'
G_ARM = 'board/guide_h13_arm.png'
G_ER = 'board/guide_h13_eraser.png'

# ---------- guides: 1024 x 1536 at 50 px/cm (the eraser 16 x 3 cm = 800 x 150 px, 35 degrees from vertical) ----------
K = 50
LOW = (650, 830)                                   # the eraser's lower (held) end, centre of the rounded tip
ANG = math.radians(35)
DIRV = (-math.sin(ANG), -math.cos(ANG))            # from the lower end up to the upper end
PERP = (math.cos(ANG), -math.sin(ANG))


def guides():
    board = os.path.join(here, '..', 'board')
    G, L = (120, 120, 120), (175, 175, 175)

    def arm(d):
        # forearm in its sleeve: from the bottom edge up to the cuff; the wrist and the back of the hand above it
        d.polygon([(560, 1536), (880, 1536), (830, 1150), (600, 1150)], outline=L, width=3)
        d.line([(600, 1150), (830, 1150)], fill=G, width=3)                     # the cuff opening (about 4.6 cm)
        d.ellipse([560, 820, 830, 1160], outline=L, width=3)                    # the hand's area
    a = Image.new('RGB', (1024, 1536), (255, 255, 255)); arm(ImageDraw.Draw(a)); a.save(os.path.join(board, 'guide_h13_arm.png'))
    b = Image.new('RGB', (1024, 1536), (255, 255, 255)); d = ImageDraw.Draw(b); arm(d)
    Lpx, Wpx = 16 * K, 3 * K
    p = lambda s, t: (LOW[0] + DIRV[0] * s + PERP[0] * t, LOW[1] + DIRV[1] * s + PERP[1] * t)
    d.polygon([p(0, -Wpx / 2), p(Lpx, -Wpx / 2), p(Lpx, Wpx / 2), p(0, Wpx / 2)], outline=G, width=4)
    for s in (Lpx / 6, Lpx * 5 / 6):                                            # the sleeve's two edges (middle two thirds)
        d.line([p(s, -Wpx / 2), p(s, Wpx / 2)], fill=G, width=3)
    b.save(os.path.join(board, 'guide_h13_eraser.png'))


ALPHA_HAND = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve{x}: no desk, no paper, no shadow, no "
              "lamp. No text, no logos, no red anywhere.")
DESK_LIGHT = ("Lighting: a white desk lamp at the upper left of the desk, out of the picture: plain neutral light from the upper "
              "left, exactly one hard-edged shadow tone, no rim light, no glow, no warm tint.")
HANDBASE = ("One illustration for a film close-up: the RIGHT hand and forearm of the girl of the turnaround (Kagamine Rin in this "
            "film's design, 14 years old), nothing else of her. Seen from STRAIGHT ABOVE, from her own eyes looking down at her "
            "desk. The second attached image is the SAME hand from the same camera on the same night: keep its hand size, "
            "skin colour, white shirt cuff, charcoal blazer sleeve and drawing style.")

H_OPEN = "\n".join([
    HANDBASE,
    "Portrait canvas 2:3. Place the forearm, cuff and hand exactly in the grey areas of the first attached image (a position guide "
    "only: do NOT draw its grey lines): the forearm in its charcoal blazer sleeve comes in through the BOTTOM edge of the canvas and "
    "runs straight up to the white shirt cuff at about three quarters of the way down; the hand is above the cuff, in the middle of "
    "the canvas, slightly right of centre.",
    "The pose: the hand rests on the desk, palm down, about to lift the top fold of a folded sheet of paper: the THUMB and the INDEX "
    "finger pinch together at the upper left of the hand, as if holding the thin edge of a sheet of paper between their tips (leave "
    "the paper out: draw only the hand; the two fingertips meet with a hair's gap between them). The middle, ring and little fingers "
    "are relaxed and loosely curled, resting on the desk. The wrist slightly raised.",
    "Her hand is a 14-year-old girl's: small and slim, a narrow palm and wrist, thin fingers, drawn as simply as the hands on the "
    "turnaround (enlarged in the last attached image).",
    DRAW, SHEET_RULE, DESK_LIGHT, HANDS, NEVER, ALPHA_HAND.format(x='')])

H_ERASE = variant(
    "the grip. The thumb and the index finger now pinch the LOWER END of a long stick eraser (the eraser of the second attached "
    "image, the front view at its upper left: white rubber, both ends rounded, the middle two thirds in a TEAL paper sleeve with a "
    "thin teal border; draw the sleeve completely BLANK, no letters, no squares on it). The eraser lies flat on the desk and is "
    "tilted: it runs from the hand up to the UPPER LEFT, 35 degrees from vertical, exactly along the grey outline of the third "
    "attached image (a position and size guide only: do not draw its grey lines): 16 cm long and 3 cm wide, the same scale as the "
    "hand (the hand is as long as the eraser). The thumb presses on the near (right) side of the eraser's lower end, the index "
    "finger lies on top of it, the middle finger tucked beside it; ring and little fingers curled under the hand. The eraser's "
    "rounded rubber ends are smudged dull grey with graphite. The forearm, cuff and wrist stay exactly where they are.")

H_HOVER = variant(
    "only the tension of the hand: it is about to press down and hesitates. The wrist is pushed a little lower and forward, the "
    "fingers grip the eraser tighter, the knuckles of the index and middle finger stand out slightly, the thumb presses harder (its "
    "tip a little paler). The eraser, its position, angle, size and blank sleeve stay exactly the same; the forearm, cuff and sleeve "
    "stay exactly where they are.")

CARD_LOW = IDENTITY.replace("a teal lanyard with her white name card in a clear holder",
                            "a thin teal lanyard round her neck (its two straps run down out of the bottom edge of the picture; "
                            "the card hangs lower, outside the picture)")
LAMP = ("Lighting: NIGHT, her room dark; the only light is a white desk lamp low on the desk to the viewer's LEFT (out of the "
        "picture): it lights the viewer's-left side of her face, hair, hand and the eraser in plain neutral white light, and the "
        "viewer's-right side of her face and body is in one flat, hard-edged shadow tone, clearly darker than daylight but still "
        "her colours (not black, not blue). A very weak soft fill from below (light bounced off the paper on the desk) only keeps "
        "the shadow side readable; NOT a horror under-light. No rim light, no glow, no light band along the outline.")
R_FACE = "\n".join([
    CARD_LOW,
    "One illustration for a film close-up, landscape canvas 3:2. Her BUST: from just above the top of her bow down to her upper "
    "chest (the bottom edge cuts across her blazer below the ribbon tie). Her head large in the canvas: the face about one third of "
    "the canvas height. Camera exactly at her eye height, straight on, long lens: she is sitting at her desk facing the camera; no "
    "high or low angle. Her body and face face the viewer squarely (turned at most 10 degrees).",
    "Her RIGHT hand (on the viewer's LEFT) is raised in front of her, beside her chin on the viewer's left: it holds the long stick "
    "eraser of the third attached image (the front view at its upper left) by its LOWER end between the thumb and the index finger, "
    "the middle finger under it. The eraser stands UPRIGHT, tilted only a little (about 10 degrees, its upper end leaning towards "
    "her face), its upper rounded end at the height of her eyes, a little in front of her face and NOT covering it. Its real size: "
    "16 cm long, 3 cm wide (as long as her hand from wrist to fingertip, a bit shorter than her face is tall). The teal paper "
    "sleeve faces the camera FLAT and is completely BLANK (no letters, no squares; the film prints them later); the white rubber "
    "ends are smudged dull grey with graphite.",
    "Her eyes look DOWN at the eraser in her hand: the upper eyelids lowered over the top third of the teal irises. Her eyes are WET: "
    "a thin glossy line of tears along the lower lids, the eyes shining a little more, but NO tear falls and the cheeks are dry. "
    "Expression: blank and still, no frown, the brows level and relaxed, the mouth a small closed line. Quiet, not angry, not "
    "scary.",
    "Place her a little RIGHT of the canvas centre, so the raised hand and eraser sit left of centre.",
    DRAW, SHEET_RULE, LAMP, LARGE, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside her, her hand and the eraser: no wall, no desk, no lamp, no "
    "frame. Every part of her fully opaque. No text, no logos. No red anywhere."])

R_FACE_UP = variant(
    "only the eyes and brows: she raises her eyes and looks straight INTO THE CAMERA, at the viewer. The upper eyelids lift to "
    "their normal open position, the teal irises move to the centre of the eyes, fully visible; the brows relax a tiny bit more "
    "(not raised, not frowning). The eyes stay exactly as wet (the thin glossy line along the lower lids), no tear falls. The look "
    "is calm and steady: 'you already knew, didn't you' - not cold, not angry, not crying. The head, mouth, hand, eraser, hair, "
    "clothes and light stay exactly the same, line for line.")

R_FACE_TEAR = variant(
    "only one thing: a single tear has spilled from her left eye (on the viewer's right) and run down her cheek: a thin wet line "
    "from the lower lid down the cheek and one small clear drop just leaving the line of her jaw. Her eyes are as wet and as lowered "
    "as before; the face, hand, eraser and light stay exactly the same.")

PENCIL_PROP = ("Plain pure WHITE background (#ffffff) everywhere, nothing else on it: no paper texture, no grid, no frame, no "
               "shadow, no text, no signature, no colour at all: only grey graphite pencil marks.")
P_GUITAR = "\n".join([
    "One drawing: an electric guitar drawn in HB PENCIL by a six-year-old Japanese first-grader who loves it and tried very hard. "
    "The guitar is a Les Paul (the attached image shows the real one, gold; only its outline matters, no colour): a single-cutaway body, "
    "upright, the headstock at the top, the body at the bottom, seen from the front.",
    "How a careful six-year-old draws it: the outline is slow, a little stiff and wobbly in places, but closed and tidy; the body "
    "too big and the neck too short; left and right drawn nearly symmetric with effort; SIX strings drawn with a RULER (straight, "
    "evenly spaced, a little too far apart) from the headstock to the bridge; frets as short straight lines across the neck; two "
    "rectangles for the pickups, four small circles for the knobs, six small dots for the tuning pegs on the headstock; the body "
    "shaded with hard-pressed, uneven back-and-forth pencil strokes that leave white gaps and go a little over the outline in one "
    "or two places. It is charming and clearly a guitar, NOT an adult's illustration and NOT a messy scribble, NOT crayon.",
    "Portrait canvas 2:3, the guitar filling about 80% of the height, centred.",
    PENCIL_PROP])
P_KIDS = "\n".join([
    "One sheet with FOUR separate small pencil drawings by four DIFFERENT six-year-old children, arranged in a 2x2 grid with wide "
    "white space between them (each drawing in its own quarter, none touching another or the edges): top left an AIRPLANE (side "
    "view, wings, round windows), top right a loaf of BREAD (a melon-pan or a bread loaf with a few lines on top), bottom left a "
    "SOCCER BALL (circle with pentagon patches), bottom right a TULIP (one flower on a stem with two leaves).",
    "Each drawn in HB pencil, carefully, with a child's slow stiff outline and hard-pressed uneven shading; each child's hand a bit "
    "different (one heavier, one lighter, one more wobbly). Clear, solid, readable shapes with confident dark outlines - each must "
    "read instantly even when small. Not adult illustration, not messy scribbles, not crayon.",
    "Landscape canvas 3:2.",
    PENCIL_PROP])

PROMPTS = {'h13_open': H_OPEN, 'h13_erase': H_ERASE, 'h13_hover': H_HOVER, 'r13_face': R_FACE, 'r13_face_up': R_FACE_UP,
           'r13_face_tear': R_FACE_TEAR, 'p13_guitar': P_GUITAR, 'p13_kids': P_KIDS}

# ---------- round 4 (2026-11-20, sample build) ----------
# h13_erase_v: design A (甲) shows her hand from the first stroke, rubbing straight up and down the columns, so the eraser is
# held UPRIGHT (not tilted). p13_guitar2: the first guitar came back too accomplished (adult proportions); a truer
# first-grader's drawing.
H_ERASE_V = variant(
    "only the angle of the eraser and the grip that follows it: the eraser now stands straight UPRIGHT, lying flat on the desk and "
    "running from her pinched fingers straight UP the canvas (vertical, not tilted), its lower rounded end held between the thumb "
    "and the index finger exactly as before, the middle finger beside it. Same length, same width, same blank teal sleeve. The "
    "hand turns slightly at the wrist to follow it (knuckles a little more to the left); the forearm, cuff and sleeve stay exactly "
    "where they are.")
P_GUITAR2 = "\n".join([
    "One drawing: an electric guitar drawn in HB PENCIL by a SIX-YEAR-OLD first-grader (age six, not ten, not an adult) who loves it "
    "and tried very hard. It is clearly a single-cutaway electric guitar like the attached one (outline only, no colour).",
    "It must look really drawn by a six-year-old: the BODY is much too BIG and ROUND (more than half the whole height), the NECK is "
    "SHORT and a little too WIDE, the headstock a simple slightly lopsided shape with six small circles for pegs; the cutaway is a "
    "simple bite out of the upper right of the body. Lines are slow and stiff, a bit wobbly, with small overshoots where lines "
    "meet and a few corrected double lines; the outline is closed and tidy enough. SIX strings drawn with a RULER: straight, but a "
    "little uneven in spacing, running from the pegs down to a simple rectangle bridge; four or five frets as short lines across "
    "the neck; two rectangles for pickups; three or four circles for knobs, slightly different sizes. The body is coloured in with "
    "HARD-PRESSED, uneven back-and-forth pencil scribbles that leave white gaps, change direction once, and go over the outline in "
    "two places. Charming, sincere and obviously a guitar - NOT an adult's or older child's illustration, NOT neat proportions, NOT "
    "a messy scribble, NOT crayon.",
    "Portrait canvas 2:3, the guitar filling about 80% of the height, centred.",
    PENCIL_PROP])
PROMPTS.update({'h13_erase_v': H_ERASE_V, 'p13_guitar2': P_GUITAR2})

if __name__ == '__main__':
    guides()
    for n, t in PROMPTS.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
    R1 = [f'-h13_open:{G_ARM}+{HWRITE}+{TURN}+{HANDS_REF}', f'-r13_face:{TURN}+{STARE}+{ERASER}+{FACES}+{HANDS_REF}',
          f"-p13_guitar:{LESPAUL}", "-p13_kids"]
    R1[2] = f'-p13_guitar:{LESPAUL}'
    R2 = [f'-h13_erase:out/h13_open.png+{ERASER}+{G_ER}', '-r13_face_up:out/r13_face.png', '-r13_face_tear:out/r13_face.png']
    R3 = ['-h13_hover:out/h13_erase.png']
    R4 = ['-h13_erase_v:out/h13_erase.png', f'-p13_guitar2:{LESPAUL}+out/p13_guitar.png']
    for i, R in enumerate((R1, R2, R3, R4), 1):
        print(f'round {i}:', ' '.join(f'"{a}"' for a in R))
