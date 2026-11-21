"""Segment 13 (C) full cut, hand set g: the f hands (art/design/prompts/_make_seg13f.py) were drawn too SMALL against the
eraser (the f guide put a 16 cm eraser at 50 px/cm next to a hand drawn at about 24 px/cm, so on the desk her hand came out
about 8.7 cm long, shorter than her card). The g set keeps the f drawings and only fixes the scale:
  h13g_slap  (master) h13f_slap redrawn crisply at 1.75x (the enlarged f drawing is the layout): the hand fills the canvas,
             cuff to fingertip about 690 px = 16.4 cm (a 152 cm girl's hand) at 42 px/cm
  h13g_open  (h13g_slap, only the fingers) the f pinch (h13f_open as the pose reference)
  h13g_erase (h13g_slap, only the grip) pinching the lower end of the big eraser at its REAL size against her hand:
             17 x 3.3 cm = 713 x 138 px at 42 px/cm, 45 degrees (h13f_erase as the pose reference)
  h13g_hover (h13g_erase, only the tension) (h13f_hover as the pose reference)
usage: python art/design/prompts/_make_seg13g.py   -> writes prompts and the guide, prints make_jobs arguments per round
"""
import math, os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import DRAW, SHEET_RULE, HANDS, NEVER, variant
from _make_seg13 import TURN, HANDS_REF, ERASER, DESK_LIGHT, ALPHA_HAND
from _make_seg13f import GIRL_HAND, SLEEVE

G_BIG = 'board/guide_h13g_slap_big.png'      # h13f_slap enlarged 1.75x about (690, 1536) (made by this script's caller)
G_ER = 'board/guide_h13g_eraser45.png'

H_SLAP = "\n".join([
    "Redraw the first attached image exactly, at FULL resolution: it is a blurry ENLARGEMENT of a finished drawing (the second "
    "attached image is the same drawing, small and sharp: copy its line work and colours). Keep the hand, the cuff and the sleeve "
    "exactly the SIZE and POSITION they have in the first attached image (the hand large: from the white shirt cuff to the tip "
    "of the middle finger about 45% of the canvas height), the same pose (the palm flat, pressing down, the fingers straight and "
    "close together pointing up the canvas, the thumb along the side), the same two dark buttons on the cuff, the same light.",
    "Crisp, clean, even line work of a professional anime illustration at this size, not a blurry enlargement; no extra detail "
    "added (no knuckle lines, veins or tendons).",
    GIRL_HAND, SLEEVE, DRAW, SHEET_RULE, DESK_LIGHT, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand and sleeve, with a hard clean edge: NO glow, no halo, no "
    "soft light around the hand. No desk, no paper, no shadow. No text, no logos, no red anywhere."])

NOGLOW = " Keep the background fully transparent with a hard clean edge round the hand: no glow, no halo."

H_OPEN = variant(
    "only the fingers, as in the third attached image (the same hand, small, already in this pose: copy the pose, not its size): "
    "the THUMB and the INDEX finger pinch together at the upper left of the hand, as if holding the thin edge of a sheet of paper "
    "between their tips and flicking it up (leave the paper out; the two fingertips meet with a hair's gap). The middle, ring "
    "and little fingers relax and curl loosely; the wrist lifts slightly. The forearm, cuff, sleeve buttons, the hand's SIZE and "
    "position stay exactly as in the first attached image." + NOGLOW)

H_ERASE = variant(
    "the grip, as in the fourth attached image (the same hand, small, already in this grip: copy the grip, not its size). The "
    "thumb and the index finger pinch the LOWER END of a long stick eraser (the eraser of the second attached image: white "
    "rubber with both ends rounded and smudged dull grey with graphite, the middle two thirds in a TEAL paper sleeve with a thin "
    "teal border; draw the sleeve completely BLANK, no letters, no squares). The eraser lies flat and runs from the hand up to "
    "the UPPER LEFT, 45 degrees from vertical, exactly along the grey outline of the third attached image (a position and SIZE "
    "guide only: do not draw its lines): its real size is 17 cm long and 3.3 cm wide, and her hand from the cuff to the "
    "fingertips is about as long as the eraser, a little shorter - keep the hand exactly as LARGE as in the first attached "
    "image. The thumb presses on the near side of the eraser's lower end, the index finger lies on top of it, the middle finger "
    "tucked beside it, ring and little fingers curled under. The forearm, cuff, sleeve buttons and hand size stay exactly where "
    "they are." + NOGLOW)

H_HOVER = variant(
    "only the tension of the hand, as in the third attached image (the same hand, small, already tense: copy the tension, not "
    "its size): it is about to press down and hesitates. The wrist is pushed a little lower, the fingers grip the eraser "
    "tighter, the thumb presses harder (its tip a little paler), the curled ring and little fingers clench. The eraser, its "
    "position, angle, SIZE and blank sleeve stay exactly the same; the forearm, cuff and sleeve stay exactly where they are."
    + NOGLOW)

PROMPTS = {'h13g_slap': H_SLAP, 'h13g_open': H_OPEN, 'h13g_erase': H_ERASE, 'h13g_hover': H_HOVER}


def guide_eraser():
    from PIL import Image, ImageDraw
    G, L = (120, 120, 120), (175, 175, 175)
    b = Image.new('RGB', (1024, 1536), (255, 255, 255)); d = ImageDraw.Draw(b)
    d.polygon([(462, 1536), (1022, 1536), (935, 992), (532, 992)], outline=L, width=3)      # the sleeve (as h13g_slap)
    d.line([(532, 992), (935, 992)], fill=G, width=3)
    d.ellipse([470, 470, 900, 1000], outline=L, width=3)                                      # the hand
    low, ang, Kc = (690, 600), math.radians(45), 42
    dv, pp = (-math.sin(ang), -math.cos(ang)), (math.cos(ang), -math.sin(ang))
    Lpx, Wpx = 17 * Kc, 3.3 * Kc
    p = lambda s, t: (low[0] + dv[0] * s + pp[0] * t, low[1] + dv[1] * s + pp[1] * t)
    d.polygon([p(0, -Wpx / 2), p(Lpx, -Wpx / 2), p(Lpx, Wpx / 2), p(0, Wpx / 2)], outline=G, width=4)
    for s in (Lpx * 0.165, Lpx * 0.835):
        d.line([p(s, -Wpx / 2), p(s, Wpx / 2)], fill=G, width=3)
    b.save(os.path.join(here, '..', G_ER))


if __name__ == '__main__':
    guide_eraser()
    for n, t in PROMPTS.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
    R1 = [f'-h13g_slap:{G_BIG}+out/h13f_slap.png+{TURN}+{HANDS_REF}']
    R2 = [f'-h13g_open:out/h13g_slap.png+{TURN}+out/h13f_open.png',
          f'-h13g_erase:out/h13g_slap.png+{ERASER}+{G_ER}+out/h13f_erase.png']
    R3 = ['-h13g_hover:out/h13g_erase.png+out/h13f_hover.png']
    for i, R in enumerate((R1, R2, R3), 1):
        print(f'round {i}:', ' '.join(f'"{a}"' for a in R))
