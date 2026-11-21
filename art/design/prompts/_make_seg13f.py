"""Segment 13 (C) full cut, after the blind review of the two samples (design 乙 picked; review must_fix):
  - the desk hand is redrawn as ONE new master set, a 14-year-old girl's small slim hand (the sample's hands read as an adult's):
      h13f_slap   (master) palm flat, pressing a small folded square onto the desk (the paper is drawn by code)
      h13f_open   (h13f_slap, only the fingers) thumb and index pinch a paper edge, lifting it
      h13f_erase  (h13f_slap, only the grip) pinching the lower end of the big eraser, 45 degrees (eraser drawn, cut out after)
      h13f_hover  (h13f_erase, only the tension) about to press, hesitating
  - p13f_guitar: a real first-grader's drawing (the sample's guitar was an accurate Les Paul): a little girl with a big bow
    holding a guitar that is too big for her, pencil only
  - r13f_face / r13f_face_up: the bust no longer holds the eraser up like a product: her hand rests on the desk at the bottom
    edge with the eraser in it; the lamp is on the viewer's RIGHT (her left: the lamp stands at the far left of her desk in the
    desk shot), so the light falls on the viewer's right side of her face.
usage: python art/design/prompts/_make_seg13f.py   -> writes prompts, prints make_jobs arguments per round
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant
from _make_seg13 import (TURN, FACES, HANDS_REF, HWRITE, STARE, ERASER, G_ARM, G_ER, DESK_LIGHT, ALPHA_HAND, CARD_LOW,
                         PENCIL_PROP, guides)

GIRL_HAND = ("Her hand is a 14-year-old GIRL's hand, clearly smaller and slimmer than an adult's: a narrow palm, a thin wrist, "
             "long thin tapering fingers with small rounded tips, short neat nails, smooth skin, no knuckle lines, no veins, no "
             "tendons. Drawn as simply as the hands on the turnaround (enlarged in the last attached image).")
SLEEVE = ("The sleeve is HER school blazer exactly as on the turnaround: charcoal grey, with two small round dark buttons on the "
          "outer side of the cuff, and the white shirt cuff showing about 1 cm beyond it. The sleeve is slim (a girl's forearm).")
HANDBASE = ("One illustration for a film close-up: the RIGHT hand and forearm of the girl of the turnaround (Kagamine Rin in this "
            "film's design, 14 years old), nothing else of her. Seen from STRAIGHT ABOVE, from her own eyes looking down at her "
            "desk.")

H_SLAP = "\n".join([
    HANDBASE,
    "Portrait canvas 2:3. Place the forearm, cuff and hand exactly in the grey areas of the second attached image (a position "
    "guide only: do NOT draw its grey lines): the forearm in its sleeve comes in through the BOTTOM edge of the canvas and runs "
    "straight up to the cuff at about three quarters of the way down; the hand is above the cuff, in the middle of the canvas.",
    "The pose: the hand has just slapped a small folded square of paper flat onto the desk and keeps pressing it down: the PALM "
    "lies flat, the four fingers straight and close together, pointing up the canvas (away from her), the thumb along the side "
    "of the hand, the fingertips pressing a little (the fingers very slightly arched at the last joint). A firm, quiet press, "
    "the hand lying still. Leave the paper OUT: draw only the hand and sleeve.",
    GIRL_HAND, SLEEVE,
    DRAW, SHEET_RULE, DESK_LIGHT, HANDS, NEVER, ALPHA_HAND.format(x='')])

H_OPEN = variant(
    "only the fingers: the THUMB and the INDEX finger now pinch together at the upper left of the hand, as if holding the thin "
    "edge of a sheet of paper between their tips and flicking it up (leave the paper out; the two fingertips meet with a hair's "
    "gap). The middle, ring and little fingers relax and curl loosely, resting on the desk; the wrist lifts slightly. The "
    "forearm, cuff, sleeve buttons, hand size and position stay exactly the same.")

H_ERASE = variant(
    "the grip. The thumb and the index finger now pinch the LOWER END of a long stick eraser (the eraser of the second attached "
    "image, the front view at its upper left: white rubber, both ends rounded, the middle two thirds in a TEAL paper sleeve with a "
    "thin teal border; draw the sleeve completely BLANK, no letters, no squares on it). The eraser lies flat and is tilted: it "
    "runs from the hand up to the UPPER LEFT, 45 degrees from vertical (diagonal), exactly along the grey outline of the third attached "
    "image (a position and size guide only: do not draw its grey lines): 16 cm long and 3 cm wide; her small hand is a little "
    "shorter than the eraser. The thumb presses on the near (right) side of the eraser's lower end, the index finger lies on top "
    "of it, the middle finger tucked beside it; ring and little fingers curled under the hand. The eraser's rounded rubber ends "
    "are smudged dull grey with graphite. The forearm, cuff, sleeve buttons, hand size and wrist stay exactly where they are.")

H_HOVER = variant(
    "only the tension of the hand: it is about to press down and hesitates. The wrist is pushed a little lower, the fingers grip "
    "the eraser tighter, the thumb presses harder (its tip a little paler), the curled ring and little fingers clench. The "
    "eraser, its position, angle, size and blank sleeve stay exactly the same; the forearm, cuff and sleeve stay exactly where "
    "they are.")

LAMP_R = ("Lighting: NIGHT, her room dark; the only light is a white desk lamp on the desk to the viewer's RIGHT (out of the "
          "picture, at about the height of her chest): it lights the viewer's-RIGHT side of her face, hair, hand and the "
          "eraser in plain neutral white light, and the viewer's-LEFT side of her face and body is in one flat, hard-edged "
          "shadow tone, clearly darker than daylight but still her colours (not black, not blue). A very weak soft fill from "
          "below (light bounced off the paper on the desk) only keeps the shadow side readable; NOT a horror under-light. No rim "
          "light, no glow, no light band along the outline.")
R_FACE = "\n".join([
    CARD_LOW,
    "One illustration for a film close-up, landscape canvas 3:2. She sits at her desk facing the camera; camera exactly at her eye "
    "height, straight on, long lens; no high or low angle. Framing: from just above the top of her bow down to her waist level at "
    "the desk: the bottom edge of the canvas is the edge of her desk. Her head large: the face about one quarter of the canvas "
    "height. Her body and face face the viewer squarely (turned at most 10 degrees). Place her a little RIGHT of the canvas "
    "centre.",
    "Her RIGHT forearm (on the viewer's LEFT) rests on the desk along the bottom edge of the canvas, relaxed; her hand lies there "
    "loosely holding the long stick eraser of the third attached image (the front view at its upper left) lying across her "
    "fingers, nearly horizontal, its teal paper sleeve facing up towards her and the camera, completely BLANK (no letters, no "
    "squares); the rounded rubber ends smudged dull grey with graphite. Real size: 16 cm long, 3 cm wide (a bit longer than her "
    "hand). The hand and the eraser are low in the picture, the bottom edge cutting just under them; her left arm is down out of "
    "the picture.",
    "Her eyes look DOWN at the eraser in her hand on the desk: the upper eyelids lowered over the top half of the teal irises, "
    "the gaze clearly down. Her eyes are WET: a thin glossy line of tears along the lower lids, but NO tear falls and the cheeks "
    "are dry. Expression: blank and still, no frown, the brows level and relaxed, the mouth a small closed line. Quiet, not "
    "angry, not scary. Shoulders slightly dropped.",
    DRAW, SHEET_RULE, LAMP_R, LARGE, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside her, her hand and the eraser: no wall, no desk surface, no lamp, "
    "no frame. Every part of her fully opaque. No text, no logos. No red anywhere."])

R_FACE_UP = variant(
    "only the eyes and brows: she raises her eyes and looks straight INTO THE CAMERA, at the viewer. The upper eyelids lift to "
    "their normal open position, the teal irises move to the centre of the eyes, fully visible; the brows relax a tiny bit more "
    "(not raised, not frowning). The eyes stay exactly as wet (the thin glossy line along the lower lids), no tear falls. The look "
    "is calm and steady: 'you already knew, didn't you' - not cold, not angry, not crying. The head, mouth, hand, eraser, hair, "
    "clothes and light stay exactly the same, line for line.")

P_GUITAR = "\n".join([
    "One drawing made in HB PENCIL by a SIX-YEAR-OLD Japanese first-grader (age six: a real small child's drawing, not an older "
    "child's, not an adult imitating a child) for her essay 'my dream': HERSELF playing the guitar.",
    "What is in it: a little girl standing, drawn the way six-year-olds draw people: a big round head with two dot eyes and a "
    "smiling curved mouth, short hair, a BIG RIBBON BOW on top of her head with exactly TWO big loops, a triangle dress, thin "
    "straight arms and legs, simple mitten hands; across her body she holds an ELECTRIC GUITAR that is much too big for her: a "
    "single-cutaway body (a rounded body with a bite taken out of its upper side), a short thick neck pointing up to the upper "
    "right, a lopsided headstock with little circles for pegs. Six strings drawn with a RULER, straight but unevenly spaced, "
    "not quite reaching the end; two rectangles for pickups; three knobs of different sizes. Two or three small music notes "
    "float beside her.",
    "How it is drawn: slow, stiff, a bit wobbly lines with small overshoots where lines meet and one or two corrected double "
    "lines; wrong proportions (head too big, guitar too big, neck too short); the guitar body coloured in with HARD-PRESSED, "
    "uneven back-and-forth pencil scribbles that leave white gaps and go over the outline in two places; the dress shaded "
    "lighter. Sincere, charming and clearly 'a little girl with a guitar' even when small - NOT neat, NOT symmetrical, NOT an "
    "illustration, NOT a messy scribble, NOT crayon, no colour.",
    "Portrait canvas 2:3, the drawing filling about 85% of the height, centred.",
    PENCIL_PROP])

PROMPTS = {'h13f_slap': H_SLAP, 'h13f_open': H_OPEN, 'h13f_erase': H_ERASE, 'h13f_hover': H_HOVER,
           'r13f_face': R_FACE, 'r13f_face_up': R_FACE_UP, 'p13f_guitar': P_GUITAR}

G_ER45 = 'board/guide_h13f_eraser45.png'


def guide45():
    import math
    from PIL import Image, ImageDraw
    G, L = (120, 120, 120), (175, 175, 175)
    b = Image.new('RGB', (1024, 1536), (255, 255, 255)); d = ImageDraw.Draw(b)
    d.polygon([(560, 1536), (880, 1536), (830, 1150), (600, 1150)], outline=L, width=3)
    d.line([(600, 1150), (830, 1150)], fill=G, width=3)
    d.ellipse([560, 820, 830, 1160], outline=L, width=3)
    low, ang, K = (650, 830), math.radians(45), 50
    dv, pp = (-math.sin(ang), -math.cos(ang)), (math.cos(ang), -math.sin(ang))
    Lpx, Wpx = 16 * K, 3 * K
    p = lambda s, t: (low[0] + dv[0] * s + pp[0] * t, low[1] + dv[1] * s + pp[1] * t)
    d.polygon([p(0, -Wpx / 2), p(Lpx, -Wpx / 2), p(Lpx, Wpx / 2), p(0, Wpx / 2)], outline=G, width=4)
    for s in (Lpx / 6, Lpx * 5 / 6):
        d.line([p(s, -Wpx / 2), p(s, Wpx / 2)], fill=G, width=3)
    b.save(os.path.join(here, '..', G_ER45))


if __name__ == '__main__':
    guides(); guide45()
    for n, t in PROMPTS.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
    R1 = [f'-h13f_slap:{TURN}+{G_ARM}+{HANDS_REF}', f'-r13f_face:{TURN}+{STARE}+{ERASER}+{FACES}+{HANDS_REF}', '-p13f_guitar']
    R2 = [f'-h13f_open:out/h13f_slap.png', f'-h13f_erase:out/h13f_slap.png+{ERASER}+{G_ER45}', '-r13f_face_up:out/r13f_face.png']
    R3 = ['-h13f_hover:out/h13f_erase.png']
    for i, R in enumerate((R1, R2, R3), 1):
        print(f'round {i}:', ' '.join(f'"{a}"' for a in R))
