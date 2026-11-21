"""Segment 15 (尾奏 riff), round g: the independent review of the finished segment (2026-11-21).
  MUST 1  f15_sota_b had a soft teal halo (5% semi-transparent edge pixels): redrawn, with a clean hard alpha edge.
  MUST 2  the そうた close-up drew a 6-7-year-old standing alone; the film's そうた (t01_p7, t15_p7_turn, the design sheet) is a
          3-year-old toddler sitting in his mother's right arm. Root cause: the old prompt said "about 5 years old" and "she is out
          of the picture", against the set pack (3 岁幼儿) and the storyboard (母亲的一缕头发和肩头在他身侧, 画在图内).
          Redrawn as the toddler, with his mother's neck, collar, shoulder and a loose strand of her hair in the picture; landscape,
          the mother's body running out of the TOP and RIGHT canvas edges (the film places those edges outside the frame).
  nice    f15_p6c: the cup she pulls off stays on the headband, its cushion facing her ear (the old cup floated, cushion outward).
          f15_n5_bg / f15_n4_bg: the people behind the two close-ups, turned to her (the storyboard's backboards).
          R15_strum_4b: the in-between of strum_3 (head lowest) and strum_5, as strum_4 was written (head still bowed); the old
          strum_4 jumped straight to an upright head.
          R15_strum_8b: strum_8 with the eyes lowered (改定 5: she does not look into the lens before segment 16's k556).
usage: python art/design/prompts/_make_seg15g.py <g1|g2>   -> writes the .txt prompts, prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
from _make_seg15 import TOWN_HAND, TTAIL, TURN, LP
from _make_seg15f import KEEP_GUITAR, STRUM

CUT = '../cut/'
CLEAN_EDGE = ("The edge of the figure against the transparent background is a crisp, clean cut: the outer teal contour line is fully "
              "opaque right to its outside edge, then fully transparent. NO glow, NO halo, NO soft or blurred fringe, NO coloured haze "
              "or semi-transparent band around the figure.")
CU_TAIL = ("Drawn LARGE, the drawing stays exactly as simple as the town's set-pack sheet: the same clean teal line art and round "
           "screentone dots, a simple anime face (a tiny nose stroke at most, no nostrils), no extra lines, no texture, no realism.")
TAIL2 = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the figures: no floor, no cast shadow, no frame, no paper colour "
         "behind them; every part of the figures fully opaque, including their paper-white parts. No text, no labels, no logos, no "
         "watermark. Absolutely no red, pink or orange anywhere.")

SOTA = (
    "One illustration, a CLOSE-UP of the little boy of the first attached image, Kobayashi Sota, a THREE-YEAR-OLD TODDLER (the second "
    "image is the design sheet of him and his mother): a big round head, full baby cheeks, a small chin, a very short neck, small soft "
    "shoulders, short chubby arms and tiny hands; the same short dark tousled hair and the same light hooded sweatshirt as in both "
    "images. He is NOT a schoolboy: a toddler's proportions, the head large against the small body.\n"
    "He sits on his mother's RIGHT forearm, held against her chest, exactly as in the first image: he is on the viewer's LEFT, she is "
    "behind him on the viewer's RIGHT. We see him from the top of his head down to his tummy. Beside and behind him on the viewer's "
    "right is his MOTHER, only partly: her slim neck and throat, the open collar and lapel of her long light coat over her dark top, "
    "her right shoulder behind the boy, and ONE LOOSE STRAND of her dark hair hanging down beside her neck (her hair is tied up in a low "
    "bun as in the images; only this strand shows). Her face is ABOVE the picture: the TOP edge of the canvas cuts her at the jaw/neck, "
    "and her body runs out of the RIGHT edge and the BOTTOM edge of the canvas. Her right hand and forearm under him run out of the "
    "bottom edge. A thin teal lanyard cord round her neck runs down her chest and out of the bottom edge.\n"
    "A thin teal lanyard round the boy's neck comes down onto his chest and STOPS about 3 cm below his collarbones, cut off cleanly "
    "(the film adds a small empty clip); the middle of his chest stays clear.\n"
    "{act}\n"
    "Framing: LANDSCAPE canvas 3:2 (wider than tall). The canvas shows 34 cm of height. The top of the boy's head is about 8% of the canvas "
    "height below the top edge; his face is centred at about 36% of the canvas width from the LEFT edge; the boy's head, shoulder and "
    "arm stay well INSIDE the LEFT edge (clear transparent space on the left); the only things touching the canvas edges are the "
    "mother (top, right and bottom edges) and the boy's body at the bottom edge. Camera at the boy's eye height, straight on, long lens: "
    "no high or low angle.")
SOTA_A = ("He has just turned his head to look at someone a little to the viewer's RIGHT and slightly ABOVE his eye level (a girl playing "
          "a guitar in front of them): head turned about 25 degrees to the viewer's right, the eyes looking right and a little up, eyes "
          "at their ordinary size, mouth closed, a quiet, curious, attentive toddler face. His small hand (the viewer's right) rests "
          "loosely on the edge of his MOTHER's coat collar.")
SOTA_B = ("only his face and his hand: his eyes open WIDE and round, his mouth opens into a small round 'o' (amazed, not scared, not "
          "smiling), and his small hand now GRIPS his mother's coat collar tightly in a little fist. The head direction, the hair, the "
          "mother, the clothes and everything else stay exactly the same. The MOTHER does not move at all: her chin, neck, collarbones, "
          "the strand of hair, the lanyard, the dark top and the whole coat stay exactly where they are in the first image, line for "
          "line (they must overlay it exactly); only the few centimetres of lapel edge inside his fist crease a little.")

P6C = ("only the headphone cup in her raised hand: the LEFT cup she has pulled off stays ATTACHED to the headband: the headband's left "
       "arm visibly runs from the top of her head, over her hair, down to that cup; the cup is held a few centimetres out from her left "
       "ear with its soft CUSHION side facing HER (towards her ear and cheek), so we see the cup's smooth OUTER shell and its rim, not the "
       "cushion. Her hand holds the cup naturally by its outer shell. Everything else (her face, gaze, hair, the other cup on her right "
       "ear, the coat, the straps, the lanyard, the framing) stays exactly as it is.")

BG_TAIL = ("Framing: portrait canvas 2:3, the person from the top of the head down to the waist; the head and shoulders well inside the "
           "left, right and top edges (transparent space there); only the bottom edge cuts the body. Camera at the person's eye height, "
           "straight on, long lens.")
N5 = ("One character illustration: the young man of the first attached image (the same face, hair, glasses, hoodie and puffer jacket), "
      "drawn CLOSER: from the top of his head down to his waist. He stands in a crowd and has turned his head about 45 degrees to the "
      "viewer's RIGHT, looking at someone in front of him to the right, startled and still: the eyes open, the mouth closed. Body facing "
      "the viewer; arms hanging. A thin teal lanyard round his neck STOPS about 4 cm below his collarbones, cut off cleanly.")
N4 = ("One character illustration: the man of the first attached image (the same face, greying hair, suit and tie; about 50), drawn "
      "CLOSER: from the top of his head down to his waist. He has LIFTED his head (no longer bowed) and turned it about 40 degrees to the "
      "viewer's RIGHT, looking at someone in front of him to the right, his eyes open and a little wide, his eyebrows raised slightly, the "
      "mouth a little open. Body facing the viewer; his right arm hangs (the hand with the briefcase is below the picture). A thin teal "
      "lanyard round his neck STOPS about 4 cm below his collarbones, cut off cleanly.")

STRUM4B = ("the in-between of the two attached poses of her: the FIRST image is the heavy down-strum (head bowed as low as it goes), "
           "the SECOND image is the next down-strum (head a little higher). Draw the rebound between them: her shoulders have come back "
           "UP and her upper body is upright again as in the second image, but her HEAD is still BOWED (halfway between the two: lower "
           "than in the second image, higher than in the first), the face visible, eyes OPEN and looking down at the strings, the bangs "
           "falling forward, the bow's two ribbon tails settling; her right hand swung up and held about a hand's width ABOVE the "
           "strings over the pickups." + KEEP_GUITAR)
STRUM8B = ("only her EYES and EYELIDS: her gaze goes DOWN: the upper lids lowered to half, the irises LOW in the eyes, looking down at "
           "her right hand over the strings, NOT at the viewer and not into the camera. The head stays upright and level exactly as it "
           "is; the face calm, the mouth closed. The head, hair, bow, hands, guitar and body do not move at all, line for line.")


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else 'g1'
    out = []
    if rnd == 'g1':
        write('f15_sota_a', "\n".join([SOTA.format(act=SOTA_A), TOWN_HAND, CU_TAIL, CLEAN_EDGE, TAIL2]))
        out.append(f"-f15_sota_a:{CUT}t15_p7_turn.png+../canon/town/p07_kobayashi_yumi_and_sota.png+{CUT}t01_p7.png")
        write('f15_p6c', variant(P6C) + "\n" + CLEAN_EDGE)
        out.append(f"-f15_p6c:{CUT}f15_p6b.png+../canon/town/p06_yamamoto_sakura_student.png")
        write('f15_n5_bg', "\n".join([N5, BG_TAIL, TOWN_HAND, CLEAN_EDGE, TTAIL]))
        out.append(f"-f15_n5_bg:{CUT}t15_n5_turn.png")
        write('f15_n4_bg', "\n".join([N4, BG_TAIL, TOWN_HAND, CLEAN_EDGE, TTAIL]))
        out.append(f"-f15_n4_bg:{CUT}t14_n4.png")
        write('R15_strum_4b', variant(STRUM4B))
        out.append(f"-R15_strum_4b:{CUT}R15_strum_3.png+{CUT}R15_strum_5.png+{TURN}+{LP}")
        write('R15_strum_8b', variant(STRUM8B))
        out.append(f"-R15_strum_8b:{CUT}R15_strum_8.png+{TURN}")
    elif rnd == 'g2':
        write('f15_sota_b', variant(SOTA_B) + "\n" + CLEAN_EDGE)
        out.append(f"-f15_sota_b:{CUT}f15_sota_a.png+../canon/town/p07_kobayashi_yumi_and_sota.png")
    print(' '.join(f'"{a}"' for a in out))
