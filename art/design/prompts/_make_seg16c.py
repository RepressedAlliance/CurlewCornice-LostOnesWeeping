"""Segment 16, third round (2026-11-21, after the user's second-cut feedback: 「lost one的号哭 很多都是做砸吉他 我们要不要也做
但是不能简单的做……要用你的优势 做出来要高质量」; strings drawn by code over a drawing are gone: 「吉他弦和吉他不是一块的」).
The ending smashes the guitar into her reader (machine 4, the one that printed もう一度 at her in 03) on the last chord k570.
Key drawings only (no frame-by-frame swing); every drawing has its own strings, nothing is laid over them by code.

  r16_glare_sh   r16_glare redrawn: the Les Paul over her right shoulder like a bat, its gold body beside her head (S8, k556)
  R16_raise      master of the BAT frame (square, transparent): the guitar raised high over her head, glaring down at the reader
  R16_after      R16_raise redrawn: the swing done, the guitar's body driven down into the reader at the viewer's left (k570.5)
  i16_impact     the impact drawing, pure black ink on white (code inverts it and prints it teal): the gold body hitting the
                 reader's top, the panel bursting into a few big printed pieces, the slip torn, her lunging (k570, 5 frames)
  m16_wreck      (made from a render) the target cabinet redrawn smashed in, transparent, laid over her in R16_after

usage: python art/design/prompts/_make_seg16c.py first   -> r16_glare_sh_a/_b, R16_raise_a/_b, i16_impact_a/_b
       python art/design/prompts/_make_seg16c.py after   -> R16_after_a/_b (variants of art/cut/R16_raise.png)
       python art/design/prompts/_make_seg16c.py wreck   -> m16_wreck_a/_b (from work/seg/16/smash/cabinet_ref.png)
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, full, IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER, ALPHA

TURN = 'board/rin_A2.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
GATE = '../canon/ticket_gate_front_side.png'

GUITAR = ("The guitar is the gold-top Les Paul of the attached guitar sheet; match it exactly: gold top with cream binding, two "
          "cream P-90 pickups, a cream pickguard, ONE silver wraparound bar bridge, four gold knobs, a rosewood fretboard with cream "
          "trapezoid inlays, a black headstock of the sheet's shape with six cream tuner buttons; the back and sides dark brown "
          "(gold only on the top face). EXACTLY six thin steel strings, drawn in the picture, straight and unbroken from the bridge "
          "to the nut except where a hand is in front of them. No strap. ")
NOCARD = "NO lanyard and NO card anywhere on her (her name card is gone). "
EXPR_GLARE = ("Her expression: the cold glare of the turnaround's angry face: brows drawn down and in, lids low and hard, mouth a small "
              "tight closed line; no tears, no smile, no shouting. ")

GLARE_SH = variant(
    "only her right shoulder and what is on it: she now carries the gold Les Paul over her RIGHT shoulder like a baseball bat (her "
    "right is the viewer's LEFT), the way the second attached figure carries it: her right fist holds the neck in front of her right "
    "collarbone at the very bottom edge of the picture (the fist and the headstock below it are cut off by the bottom edge), the "
    "neck rises from there over her right shoulder, and the gold BODY stands up beside her head on the viewer's LEFT, above the shoulder, its top part cut off by the top edge of the picture. "
    "Since it is seen from the front, we see the gold top with the cream pickguard and pickups and the six strings, tilted about 20 "
    "degrees from upright, away from her face (it never covers her face, her bow or her hair clips). Remove the black strap on the "
    "viewer's right shoulder. Her face, eyes (exactly where they are), expression, hair, bow, collar and tie do not move at all, line "
    "for line; the dark background stays.", keep_bg=False) + "\n" + GUITAR + NOCARD + "No red anywhere."
GLARE_SH2 = GLARE_SH.replace("Remove the black strap", "SCALE: the guitar is FULL SIZE and close to her: the gold body is much "
    "WIDER than her whole head (about 1.7 times the width of her face), so only its lower half shows: the top edge of the picture cuts "
    "straight through the body (the knobs and the wide end are above the picture); we see the cutaway, the pickguard, both pickups "
    "and the neck joint large; the neck is as wide as her eye is long. The fourth attached picture shows this pose, but its guitar is "
    "drawn far too small; the third attached image shows the guitar's true shape. Remove the black strap")

RAISE_SUBJECT = (
    "This drawing: a WAIST-UP-AND-ABOVE figure on a SQUARE canvas, the camera straight on and level at her chest height, long lens: "
    "a flat front view, no perspective distortion, no looking up or down, verticals vertical, no tilt. She stands facing the camera, "
    "her body's centre line at about 60% of the canvas width from the left (the left part of the canvas is left empty for where the "
    "guitar will come down). "
    "SCALE (most important): the Les Paul is a FULL-SIZE electric guitar, 99 cm long, about two thirds of her height: from the "
    "headstock to the far end of the body it is about 4.7 times the height of her head (hair top to chin), and its body is wider "
    "than her shoulders. So SHE IS SMALL IN THE CANVAS: her head (hair top to chin) is only about one tenth of the canvas height; "
    "the bottom edge of the canvas cuts her legs just above the knees; her hair top is at about 46% of the canvas height from the "
    "top; the whole raised guitar fits inside the canvas with a margin. The second attached image shows the pose, but its guitar "
    "is drawn far too small and she is drawn too big: do NOT copy those sizes. "
    "The moment: she has raised the guitar HIGH OVER HER HEAD to smash it down. Both hands grip the neck close to the headstock, one "
    "above the other, her arms almost straight and raised above her head and a little to the viewer's left; the guitar is upside "
    "down, the headstock at her hands and the long neck and gold BODY reaching up and out to the viewer's upper LEFT, tilted "
    "about 60 degrees from vertical (the body high above the empty left part of the canvas, not over her head); we see its gold top face with pickguard, both pickups and the bar bridge. Her body leans back "
    "slightly, her weight on her back foot, her shoulders lifted; her hair and the ends of her ribbon tie are tossed up a little by "
    "the motion; the bow stays on her headband. Her head is level, her eyes glare DOWN to the viewer's LOWER LEFT (at a machine "
    "below the frame's left side), teeth clenched: the mouth a short tight line with a narrow white sliver of teeth, small and "
    "simple. She wears the charcoal-grey school blazer, white shirt, teal ribbon tie, charcoal pleated skirt. "
    + NOCARD + "The blazer's sleeves slide down a little on the raised arms; the cuffs of the white shirt show. "
    + GUITAR + EXPR_GLARE.replace('mouth a small tight closed line', 'teeth clenched as above') +
    "Lighting: plain even indoor light from the front, flat colours, one hard-edged shadow tone per material.")
RAISE = full(RAISE_SUBJECT, large=True, hands=True, night=False, alpha=True).replace("a teal lanyard with her white name card in a clear holder, ", "") + " The line art one step bolder than usual."

AFTER = variant(
    "only her arms, the guitar, her hair and her face: the swing is DONE. The guitar has come down to the viewer's LEFT: its gold "
    "body is now LOW at the far left of the canvas, its centre at about 22% of the canvas width from the left and 72% of the canvas "
    "height from the top, driven down into something (draw the whole body anyway, its wide end pointing down and to the left, the "
    "gold top facing us; something will be laid over its lower half later). The guitar keeps EXACTLY its size in the first image "
    "(it is a full-size guitar: do not shrink it). Two or three strings have SNAPPED near the bridge: their "
    "loose ends curl up in the air from the bridge end, still attached to the guitar; the other strings hang slack. From the body "
    "the long neck rises diagonally to the viewer's right to her two fists, which still hold the neck near the headstock, in front of "
    "her at about chest height, her arms straight and reaching forward and down along the neck. She stands straight again, her shoulders down, her head slightly lowered, her eyes "
    "now looking straight at the viewer, level brows, neither frowning nor smiling, mouth closed; a few strands of hair fallen over "
    "her face; the bow still in place on the headband. Her legs and skirt do not move.", keep_bg=True) + "\n" + GUITAR.replace(
    "EXACTLY six thin steel strings, drawn in the picture, straight and unbroken from the bridge to the nut except where a hand is in "
    "front of them. ", "") + NOCARD + "No red anywhere."

IMPACT = (
    "A single dramatic IMPACT FRAME in the style of Japanese TV anime action cuts (a monochrome impact shot): PURE BLACK INK on a pure "
    "white ground, only black and white, no grey, no colour, no halftone dots, no gradients. Landscape canvas 3:2, the important "
    "part inside the middle 16:9 band. Camera level and straight on, long lens; the machine's vertical edges stay vertical (no "
    "tilted composition).\n"
    "What it shows, close up: the moment a gold Les Paul guitar (shape exactly as the attached guitar sheet: single cutaway body, "
    "pickguard, two pickups, bar bridge, knobs) SMASHES DOWN into the top of a station ticket-gate cabinet (shape as the attached "
    "gate sheet: a narrow upright cabinet with rounded corners, a small reader box on its top, a printed panel). The impact point "
    "is a little left of the picture's centre: the guitar body, coming down from the upper right, hits the cabinet's top; the "
    "reader box on top caves in and bursts into FOUR or FIVE big flat panel pieces frozen in the air around the impact point (big, "
    "clean shapes, not dust, not many tiny bits); a strip of paper (a receipt slip) torn in two flies up. Bold speed lines "
    "(concentration lines) converge on the impact point from the edges. On the right side, cut by the right edge, Kagamine Rin "
    "(attached Image 1 is her turnaround; match her face, bob haircut, hair clips and big ribbon bow) lunges down with the swing: "
    "her two hands on the guitar's neck, her arms stretched towards the impact, her hair and bow flung forward, her eyes fierce "
    "and narrow; drawn as simply as the turnaround (anime line art), only in black ink: solid black for her blazer and the "
    "cabinet's shadow sides, white for skin, paper and the guitar's top, bold clean outlines. Strong graphic contrast like a "
    "printed manga panel, clean and designed, every shape readable at a glance. No text, no sound-effect lettering, no logos, no "
    "red, no grey.")

which = sys.argv[1] if len(sys.argv) > 1 else 'first'
w = lambda n, t: open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
args = []
if which == 'first':
    for n in ('r16_glare_sh_a', 'r16_glare_sh_b'):
        w(n, GLARE_SH); args.append(f"-{n}:../cut/r16_glare.png+{TURN}+{LP}+../cut/s04d_shoulder.png+{FACES}")
    for n in ('R16_raise_a', 'R16_raise_b'):
        w(n, RAISE); args.append(f"-{n}:{TURN}+../cut/s04d_shoulder.png+{LP}+../cut/R15_strum_1.png+{HANDS_REF}+{FACES}")
    for n in ('i16_impact_a', 'i16_impact_b'):
        w(n, IMPACT); args.append(f"-{n}:{TURN}+{LP}+{GATE}+../cut/s04d_shoulder.png")
elif which == 'glare2':
    for n in ('r16_glare_sh2_a', 'r16_glare_sh2_b'):
        w(n, GLARE_SH2); args.append(f"-{n}:../cut/r16_glare.png+{TURN}+{LP}+out/r16_glare_sh_a.png+{FACES}")
elif which == 'raise2':
    for n in ('R16_raise2_a', 'R16_raise2_b', 'R16_raise2_c'):
        w(n, RAISE); args.append(f"-{n}:{TURN}+out/R16_raise_a.png+{LP}+../cut/R15_strum_1.png+{HANDS_REF}+{FACES}")
elif which == 'after':
    for n in ('R16_after_a', 'R16_after_b', 'R16_after_c'):
        w(n, AFTER); args.append(f"-{n}:../cut/R16_raise.png+{TURN}+{LP}+{HANDS_REF}+{FACES}")
elif which == 'wreck':
    WRECK = (
        "Redraw the first attached image (a station ticket-gate cabinet drawn as flat print: paper-white panel, teal outlines, teal "
        "sides, a small dark reader box on top with a paper slip standing out of it) as a component on a fully TRANSPARENT "
        "background (PNG alpha; the grey of the reference is NOT part of the picture): the same size and position in the 2:3 canvas, "
        "the same flat printed style, line widths and colours. Change only this: a guitar has just been SMASHED down into the "
        "cabinet's top. The second attached image shows exactly where that guitar's gold body lies in front of the cabinet (the "
        "guitar and the girl are drawn separately on top later: do NOT draw the guitar, the girl or any part of them). So: the "
        "cabinet's top edge is crushed and bent down into a deep jagged V where the guitar body hit it (a little left of the "
        "middle of the top); the teal top band is cracked and buckled; the dark reader box is knocked off and lies tilted, cracked, "
        "half on the broken top edge; the paper slip is torn in half, its upper half hanging limp over the broken edge; two bold "
        "straight cracks run down the front panel from the V; one indicator window's glass is cracked; three or four flat broken "
        "panel pieces (paper-white with teal edges, big simple shapes) lie leaning against the foot of the cabinet and on the "
        "ground beside it, nothing floating in the air. The lower part of the cabinet keeps its shape. Clean bold shapes, flat "
        "print, no shading gradients. No red, no fire, no sparks, no smoke, no dust, no text.")
    for n in ('m16_wreck_a', 'm16_wreck_b', 'm16_wreck_c'):
        w(n, WRECK); args.append(f"-{n}:../../work/seg/16/smash/cabinet_ref.png+../../work/seg/16/smash/cabinet_her_ref.png+{GATE}")
print(' '.join(args))
