"""Segment 16, fifth round (2026-11-22, director feedback on the smash: it cut away too fast and needed more screen time).
The smash moves from k570 to k564 (the heaviest crash, 00 k0's beat); the raise is slowed to two key drawings in the BAT frame;
after the smash about 3.3 s stay on one picture made to be the film's screenshot.

  R16_lift    R16_raise redrawn with one change: half way up (the guitar off her shoulder, hands at her forehead, the body
              above her head, more upright): the key drawing between the shoulder (S8) and the top (R16_raise)
  R16_final   the last picture, drawn whole by Codex at the size it is shown (1536 x 1024 at 1:1 on the 1920 x 1080 frame,
              940 px a metre): the guitar planted in the smashed reader cabinet like a sword in a stone, its neck rising to
              the upper left; she has let go and stands just behind the cabinet, beside it, looking at us. One picture: her,
              the guitar and the cabinet (根因清单: what she breaks is drawn with her). The cabinet's right indicator window is
              dark glass: code lights it (k567-k569 it stutters, k570 it dies).
  m16_bits    the pieces thrown up by the smash, on one sheet, apart: torn slip scraps, teal panel chips, a gold chip; code
              lets them fall (no code-drawn debris: 根因清单 08b)

usage: python art/design/prompts/_make_seg16e.py -> prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER

TURN = 'board/rin_A2.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
GATE = '../canon/ticket_gate_front_side.png'
GUIDE = '../../work/seg/16/v5/guide/layout_final.png'

LIFT = variant(
    "an EARLIER moment of the same swing, half way up. The guitar has just come off her shoulder: both hands grip the neck near the "
    "headstock, one above the other, at the height of her FOREHEAD, in front of her right shoulder (the viewer's left), elbows bent "
    "and lifted outwards; the guitar stands more upright than now, about 25 degrees from vertical, its gold BODY above and a little "
    "behind her head to the viewer's upper left, its top face towards us (pickguard, both pickups, the bar bridge, six strings), the "
    "same full size as now. Her body is a little more upright (the lean back is only starting), her weight still on both feet. Her "
    "eyes glare down to the viewer's lower left as now; her mouth a small tight CLOSED line (no teeth yet). Her hair and tie hang "
    "naturally (the toss up has not happened yet). Her face, head position and size, hair, bow, blazer, skirt and legs stay exactly "
    "where they are in the canvas; only her arms and the guitar move. Her hands are the small slim hands of the turnaround.") + " " + (
    "The guitar is the gold-top Les Paul of the attached guitar sheet, exactly as in the first image. NO lanyard and NO card. No red.")

FINAL_SUBJECT = (
    "This drawing is the LAST picture of the film, made to be remembered: a 3:2 LANDSCAPE canvas, the camera straight on and level at "
    "her chest height, long lens, flat front view, no perspective distortion, verticals vertical, no tilt. The second attached image "
    "is the placement guide on the same canvas (do NOT draw its coloured lines or its grey): the teal-and-white box is a station "
    "ticket-gate cabinet, the green line where its top is crushed, the orange ellipse and line where the guitar is, the blue circle "
    "and box where she stands. Keep every position and size of the guide. "
    "THE CABINET (the third attached image shows the same cabinet already smashed, and the fourth its intact design): a narrow "
    "station ticket-gate cabinet in this film's flat printed style: teal side strips, a paper-white front panel with a thin teal "
    "outline and a teal band along the top, flat colours, no gradients. It stands at the lower left exactly where the guide box is "
    "and runs out of the BOTTOM edge of the canvas. Its top is smashed down into a deep jagged V along the green line; the teal top "
    "band cracked and buckled; the sheet metal of the top folded up like crumpled tin; the small dark reader box knocked off, tilted "
    "and cracked, lying on the broken edge; the paper slip torn, half of it hanging limp over the front; two bold cracks run down the "
    "front panel from the V. On the front panel, exactly where the guide shows two small square windows: the LEFT window's glass "
    "smashed (cracks radiating from one point), the RIGHT window intact glass with one single thin diagonal crack, its screen DARK "
    "GREY and empty (switched off), a plain dark square inside its thin teal frame, nothing written in it. "
    "THE GUITAR: planted in the smashed cabinet like a sword in a stone: its gold BODY is driven into the crushed top where the orange "
    "ellipse is, the lower part of the body INSIDE the cabinet, hidden behind the crumpled front and side edges, which are drawn IN "
    "FRONT of it; the body shows only above the crushed edge, nothing gold beside the cabinet lower down. The neck rises straight up "
    "to the viewer's upper LEFT along the orange line, about 40 degrees from vertical, the black headstock near the top left of the "
    "canvas, fully inside the canvas. Nobody holds it: it stands on its own, stuck. It is DAMAGED: a bold crack through the gold top, "
    "a chunk of the body's edge broken off with raw pale wood showing, the cream binding split; three strings snapped at the bridge "
    "and curling up into the air in loose loops, the other three slack and bowed. "
    "SHE has let go of it. She stands a half step BEHIND the cabinet, just to its right (the viewer's right), where the blue shapes "
    "are: her head where the blue circle is (the same size), her body in the blue box, the cabinet's right edge in front of the edge "
    "of her skirt; the bottom edge of the canvas cuts her at mid-thigh. Her arms hang loosely at her sides, hands open and empty, "
    "relaxed. She faces the camera and looks straight at the viewer, calm: her brows relaxed and level (no longer drawn in), her "
    "upper lids relaxed, eyes fully open and soft, her mouth small, closed and relaxed: not angry, not smiling, not crying: the calm "
    "after letting go. Her hair a little out of place from the swing (two or three clumps of the bob tossed, drawn as clean clumps), "
    "her bow still on its headband, very slightly tilted; her blazer a little pushed up at the shoulders. NO lanyard and NO card "
    "anywhere on her (her name card is gone). "
    "The guitar is the gold-top Les Paul of the attached guitar sheet: gold top with cream binding, two cream P-90 pickups, a cream "
    "pickguard, one silver wraparound bar bridge, gold knobs, a rosewood fretboard with cream trapezoid inlays, the black headstock "
    "with six cream tuner buttons; the back and sides dark brown. "
    "Lighting: plain even indoor light from the front, flat colours, one hard-edged shadow tone per material. Her face, hair and "
    "eyes are drawn with the most care in the picture: this picture is shown large, at full size, and held for several seconds.")
FINAL = "\n".join([IDENTITY.replace("a teal lanyard with her white name card in a clear holder, ", ""), FINAL_SUBJECT, DRAW, SHEET_RULE,
                   LARGE, HANDS, NEVER,
                   "The cabinet, the guitar and the girl are ONE picture: where they touch or overlap, the overlaps are drawn. Fully "
                   "TRANSPARENT background (PNG alpha) everywhere else; the girl, the guitar and the cabinet fully opaque. No floor, "
                   "no wall, no shadow on the background. No red anywhere, no fire, no sparks, no smoke, no dust, no text. The line "
                   "art one step bolder than usual."])

BITS = (
    "A sheet of SEPARATE small pieces thrown up when a guitar was smashed into a station ticket-gate cabinet (the first attached "
    "image is that smashed cabinet and guitar: match its flat printed style, line widths and colours exactly). 3:2 landscape canvas, "
    "fully TRANSPARENT background (PNG alpha). Exactly NINE pieces, spread out in a loose 3 x 3 grid, each piece well apart from every "
    "other (at least 60 pixels of empty transparent space between any two pieces, none touching, none overlapping), each piece about "
    "the size of a hand at the scale of that picture (between 70 and 170 pixels across): "
    "five torn scraps of the cabinet's thin off-white paper slip (receipt paper, #f3f1ea, a thin grey outline, torn ragged edges, "
    "one or two curled at a corner, each carrying a few rows of tiny teal printed dots like fragments of a dot-matrix print, not "
    "readable as letters); two broken chips of the cabinet's sheet metal (flat teal on one face with a paper-white edge band, jagged "
    "broken edges, simple big shapes); one chip of the guitar's gold top with cream binding along one edge and raw pale wood on the "
    "broken edge; one small cream plastic chip of the guitar's pickguard. Each piece seen flat, front on, fully opaque, a clean dark "
    "outline, flat colours with one hard-edged shadow tone, no motion blur, no speed lines, no glow, no shadow under it. No red, no "
    "fire, no sparks, no smoke, no dust, no text, no people.")

w = lambda n, t: open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
which = sys.argv[1] if len(sys.argv) > 1 else 'all'
args = []
if which in ('all', 'lift'):
    for n in ('R16_lift_a', 'R16_lift_b'):
        w(n, LIFT); args.append(f"-{n}:../cut/R16_raise.png+{TURN}+{LP}+../cut/R16_shoulder.png+{HANDS_REF}+{FACES}")
if which in ('all', 'final'):
    for n in ('R16_final_a', 'R16_final_b', 'R16_final_c'):
        w(n, FINAL); args.append(f"-{n}:{TURN}+{GUIDE}+../cut/R16_wreck.png+{GATE}+{LP}+../cut/R16_raise.png+{HANDS_REF}+{FACES}")
if which in ('all', 'bits'):
    for n in ('m16_bits_a', 'm16_bits_b'):
        w(n, BITS); args.append(f"-{n}:../cut/R16_wreck.png+../cut/m16_wreck.png")
print(' '.join(args))
