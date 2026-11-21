"""Segment 16, fourth round (2026-11-22, after the independent review of the third round).

  r16_glare_t   r16_glare_sh redrawn on a TRANSPARENT background (the third round cut it out of Codex's black ground; the
                glow around her hair and the guitar stayed in the matte as a dirty gold-to-black haze, and one control knob
                came out as a hole)
  R16_wreck     R16_after redrawn as ONE picture with the smashed reader cabinet: the guitar's body sits IN the crushed top
                of the cabinet, the bent front panel in front of the body's lower edge; the guitar itself is damaged.
                (third round: m16_wreck was laid over R16_after by code; the intact gold body showed on both sides of the
                cabinet and below its top, strings came out from behind the cabinet: two layers, not one thing)

usage: python art/design/prompts/_make_seg16d.py glare  -> r16_glare_t_a/_b
       python art/design/prompts/_make_seg16d.py wreck  -> R16_wreck_a/_b/_c
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant

TURN = 'board/rin_A2.png'
FACES = '../ref/sheet_faces.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
R3 = '../../work/seg/16/smash/r3'

GLARE_T = (
    "Redraw the first attached image EXACTLY, line for line: the same girl, face, eyes (exactly where they are), expression, hair, "
    "bow, hair clips, collar, tie, blazer, the same gold Les Paul over her shoulder with its six strings, the same framing, size and "
    "position in the canvas, the same line work and colours. Change only the BACKGROUND: it becomes fully TRANSPARENT (PNG alpha). "
    "Remove the black background completely, and remove the soft glow / halo around her hair, her head and the guitar completely: "
    "nothing of the glow remains, not even a faint gold or brown haze between the guitar neck and her hair, between the guitar body "
    "and her bow, or along her blazer. Every part of her and of the guitar is fully opaque, flat-coloured as now, and ends at its own "
    "dark outline, a clean hard edge; outside the outlines everything is transparent. The gaps between the guitar neck and her hair, "
    "between the guitar body and her head, and under the guitar body are transparent. The round control knob of the guitar beside "
    "the neck is a solid cream knob as on the attached guitar sheet (it is not a hole). Her blazer's edge at the viewer's left is a "
    "clean outline down to the bottom edge of the picture. No red anywhere.")

GUITAR = ("The guitar is the gold-top Les Paul of the attached guitar sheet, FULL SIZE exactly as in the first image (do not shrink "
          "it): gold top with cream binding, two cream P-90 pickups, a cream pickguard, one silver wraparound bar bridge, gold knobs, "
          "a rosewood fretboard with cream trapezoid inlays, the black headstock with six cream tuner buttons. ")

WRECK = variant(
    "the guitar and the machine it was smashed into are now drawn TOGETHER in this one picture. "
    "The second attached image is a placement guide on the same square canvas: it shows where a station ticket-gate cabinet stands "
    "(teal sides, paper-white front panel with two round indicator windows, a teal top, a small dark reader box on its top with a "
    "paper slip standing out of it), exactly at that position and size; the orange and green lines are guides only, do NOT draw "
    "them. Draw that cabinet in this picture at exactly that position and size, in its flat printed style (flat colours, teal "
    "outlines, no gradients), and SMASHED, the way the third attached image shows: "
    "the cabinet's top is crushed down into a jagged V roughly along the green guide line (a little left of the middle deepest); "
    "the teal top band cracked and buckled; the dark reader box knocked off, tilted and cracked, lying on the broken top edge; the "
    "paper slip torn, its upper half hanging limp over the broken edge; two bold cracks run down the front panel from the V; one "
    "indicator window's glass cracked. The lower part of the cabinet keeps its shape and runs out of the bottom edge of the picture. "
    "THE GUITAR: the swing is done and the guitar's gold BODY is driven INTO the crushed top of that cabinet, where the orange guide "
    "ellipse is: the guitar is now almost LEVEL (not hanging down): its body lies in the V at the left, its neck runs nearly "
    "horizontally to the right to her two fists, which still hold the neck near the headstock in front of her at about chest "
    "height, her arms straight forward. The lower part of the body is INSIDE the cabinet: the jagged, bent front-panel edge and the "
    "cabinet's bent side edges are IN FRONT of the body's lower edge and hide it; the sheet panel is folded up around the body like "
    "crumpled tin. The body overhangs the cabinet's sides only ABOVE the crushed edge: NO part of the guitar is below the crushed "
    "top edge, and nothing gold shows beside the cabinet lower down. The guitar is DAMAGED where it hit: a bold crack through the "
    "gold top of the lower bout, a chunk of the body's edge broken off with raw wood showing, the cream binding split; two or three "
    "strings snapped at the bridge and curling up into the air from the bridge end (still attached to the guitar, in front of "
    "everything, never coming from behind the cabinet), the other strings slack. "
    "Her face, eyes looking straight at the viewer, expression, hair, bow, clothes, skirt and legs stay as they are; only her arms "
    "follow the level guitar.", keep_bg=True) + "\n" + GUITAR + (
    "The cabinet, the guitar and the girl are one picture: where they touch, the overlaps are drawn (the crushed metal edge over "
    "the body, the body over the cabinet's top, her sleeve over nothing). Fully TRANSPARENT background everywhere else (the grey of "
    "the guide is NOT part of the picture); the girl, the guitar and the cabinet fully opaque. NO lanyard and NO card. No red, no "
    "fire, no sparks, no smoke, no dust, no text.")

which = sys.argv[1] if len(sys.argv) > 1 else 'glare'
w = lambda n, t: open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
args = []
if which == 'glare':
    for n in ('r16_glare_t_a', 'r16_glare_t_b'):
        w(n, GLARE_T); args.append(f"-{n}:out/r16_glare_sh2_a.png+{TURN}+{LP}+{FACES}")
elif which == 'wreck':
    for n in ('R16_wreck_a', 'R16_wreck_b', 'R16_wreck_c'):
        w(n, WRECK); args.append(f"-{n}:../cut/R16_after.png+{R3}/layout_target.png+../cut/m16_wreck.png+{LP}+{TURN}")
print(' '.join(args))
