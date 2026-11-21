"""Segment 03 (片名・検票口) finishing pass (design 甲 chosen in the blind review of the samples): the drawings the sample did
not have, and the expression fix the review asked for.

  h03_hold  (master)  the title shot k40-k48: her LEFT hand holding her blank name card flat, face up, square to the viewer, seen
                      from straight above (her own view down at the card); the code prints 読み取れません / ロストワン / の号哭 on it
  h03_pen   (master)  the title shot: her RIGHT hand writing with the canon pencil, from the lower right, seen from straight above;
                      the code places it by the pencil tip and moves it along the strokes of の号哭
  r03_down2 / r03_peer2 / r03_drop2   r03_down / r03_peer / r03_drop redrawn with one change: the eyebrows. The sample's brows were
                      pressed low with a crease (read as impatient, review B); here they are relaxed, the inner ends a little raised:
                      lost, not annoyed. Everything else line for line, so the swaps at k58, k64 and k68 (to r03_up2) still register.

Scales: h03_hold landscape 3:2 (1536 x 1024), the card (15 cm) 60% of the width, about 61 px/cm; h03_pen landscape 3:2, the hand
from the wrist crease to the tip of the middle finger about 13 cm = 55% of the canvas width, about 65 px/cm (the page shows both at
about 54 px/cm, under 1.0x).
Written without _style.txt (jobs listed with a leading '-').
usage: python art/design/prompts/_make_seg03c.py [hands|brows]  -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import DRAW, SHEET_RULE, HANDS, NEVER, variant

TURN = '../canon/rin_turnaround.png'
HANDS_REF = '../ref/sheet_hands.png'
CARD_HERS = '../canon/card_front_hers_blank.png'
PENCIL_REF = '../canon/rin_hand_pencil.png'
LIGHT = "Lighting: plain even daylight, the flat colours of the turnaround, one hard-edged shadow tone per material."

TOP_DOWN = ("Camera straight above, looking DOWN onto the card as she sees it held in front of her (top-down view): no perspective, "
            "no tilt, the card is a perfect flat rectangle with its edges parallel to the canvas edges.")

H_HOLD_ARM = ("Her LEFT hand holds the card by its LEFT edge: the forearm comes in from the BOTTOM-LEFT corner of the canvas (the sleeve cut by "
              "the bottom edge, left of the card), the hand comes up to the card's lower left corner;")
H_HOLD_ARM2 = ("Her LEFT hand holds the card by its LEFT edge: the forearm comes straight UP from the BOTTOM edge of the canvas, entering it "
               "between 14% and 30% of the canvas width from the left (the sleeve is cut ONLY by the bottom edge; the arm never touches the "
               "left edge of the canvas), the hand comes up to the card's lower left corner;")
H_HOLD = "\n".join([
    "One drawing for a film shot: the LEFT hand and forearm of the girl on the attached turnaround (Kagamine Rin in this film's "
    "design, 14 years old, 152 cm), nothing else of her. Her own view: she looks down at her name card held in front of her chest.",
    TOP_DOWN,
    "Landscape canvas 3:2. The card is the card of the second attached image: a white landscape card (15 x 10 cm, 3:2) with its teal "
    "printed grid of empty oval bubbles, the long name box along the top, the small boxes down the left, corner marks and timing "
    "marks; nothing filled in, nothing written. It sits in a thin clear plastic holder (a thin light-grey rim round it). The card is "
    "60% of the canvas width, centred horizontally, its top edge 17% of the canvas height below the top edge.",
    H_HOLD_ARM + " the thumb lies on top of the card only on the narrow left margin, pressing the card's left edge at about two thirds of its height down (the thumb tip must not reach the "
    "bubbles or the small boxes); the other fingers are behind the card and do not show above it. The rest of the card face is "
    "completely free and visible.",
    "Her hand is a 14-year-old girl's: small and slim (the palm about 7 cm wide, so the card is about twice the width of her hand). "
    "Sleeve: the charcoal-grey blazer cuff of the turnaround with a thin white shirt cuff showing.",
    "A thin teal lanyard leaves the clip hole in the middle of the card's top edge and runs straight UP out of the top edge of the "
    "canvas (to her neck, above the viewer); it never crosses the card face.",
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve, card and lanyard: no table, no body, no shadow. No "
    "text, no logos, no red anywhere."])

H_PEN = "\n".join([
    "One drawing for a film shot: the RIGHT hand and forearm of the girl on the attached turnaround (Kagamine Rin in this film's "
    "design, 14 years old), writing with a pencil, nothing else of her.",
    "Camera straight above, looking DOWN onto the hand as it writes on a flat card (top-down view, as she sees her own hand): no "
    "perspective. Landscape canvas 3:2.",
    "Grip and pencil exactly as on the second attached image (the same green hexagonal pencil, sharpened, a natural tripod grip), but "
    "seen from ABOVE: the back of the hand towards the viewer, the pencil leaning away up-left. The pencil TIP touches the paper at a "
    "point 26% of the canvas width from the left edge and 30% of the canvas height from the top edge; the pencil's end rises towards "
    "the upper middle of the canvas. The hand comes in from the lower RIGHT: the wrist and forearm run down to the lower-right corner "
    "and leave the canvas through the bottom edge near the right corner (the sleeve cut by the canvas edge).",
    "Size: from the wrist crease to the tip of the middle finger the hand is about 55% of the canvas width. Her hand is a 14-year-old "
    "girl's: small and slim, thin fingers. Sleeve: the charcoal-grey blazer cuff of the turnaround with a thin white shirt cuff.",
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, pencil and sleeve: no paper, no card, no table, no shadow. "
    "No text, no logos, no red anywhere."])

BROWS = ("her EYEBROWS only: relaxed and soft, drawn as the plain thin brows of the turnaround, the INNER ends lifted very slightly "
         "(a lost, worried look), NOT pressed down, NOT drawn together, NO crease or extra line between or above the brows. Her eyes, "
         "eyelids, gaze direction and mouth stay exactly as they are.")


BROWS3 = ("her EYEBROWS only, and nothing else: draw them exactly like the eyebrows in the second attached image (a close-up of "
          "the wanted brows): soft thin brows whose inner ends are lifted a little (a lost, worried look). REMOVE the short extra "
          "crease line drawn just above her eyebrow on the viewer's left and the frown lines between the brows: none of those lines "
          "remain. Her eyes, eyelids, lashes, gaze direction, mouth, hair, bow and everything else stay pixel for pixel as they are, "
          "and the figure keeps exactly the same size and position on the canvas.")


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'hands'
    out = []
    if what == 'hands':
        write('h03_hold', H_HOLD); out.append(f"-h03_hold:{TURN}+{CARD_HERS}+{HANDS_REF}")
        write('h03_pen', H_PEN); out.append(f"-h03_pen:{TURN}+{PENCIL_REF}+{HANDS_REF}")
    elif what == 'hands2':
        # round 2 of the hands: h03_hold's forearm left the canvas through its LEFT edge, so the card could not sit in the middle of
        # the frame without the sleeve's cut showing; h03_pen's pencil was a stub. Same drawings otherwise.
        write('h03_hold2', H_HOLD.replace(H_HOLD_ARM, H_HOLD_ARM2).replace("its top edge 17% of the canvas height below the top edge",
              "its top edge 14% of the canvas height below the top edge"))
        out.append(f"-h03_hold2:{TURN}+{CARD_HERS}+{HANDS_REF}")
        write('h03_pen2', H_PEN.replace("(the same green hexagonal pencil, sharpened, a natural tripod grip)",
              "(the same green hexagonal pencil, sharpened, a natural tripod grip). The pencil is a full-length new pencil about 17 cm "
              "long: most of its length shows, its end rising well above the hand towards the top edge of the canvas"))
        out.append(f"-h03_pen2:{TURN}+{PENCIL_REF}+{HANDS_REF}")
    elif what == 'brows3':
        # round 2: the first try moved r03_down's whole figure and left the crease on r03_peer / r03_drop; this one names the crease
        # and shows the wanted brows (r03_down2's) as the second image
        for src in ('r03_down', 'r03_peer', 'r03_drop'):
            write(src + '3', variant(BROWS3)); out.append(f"-{src}3:out/{src}.png+out/r03_down2_brows.png+{TURN}")
    elif what == 'brows':
        for src in ('r03_down', 'r03_peer', 'r03_drop'):
            write(src + '2', variant(BROWS)); out.append(f"-{src}2:out/{src}.png+{TURN}+../ref/sheet_faces.png")
    print(' '.join(f'"{a}"' for a in out))
