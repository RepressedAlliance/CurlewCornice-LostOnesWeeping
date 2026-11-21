"""Segment 16, sixth round (2026-11-22, independent re-review of the fifth): the last picture R16_final was not worth a
screenshot (she stood straight with her arms down and a blank face, like a character sheet beside a guitar; big flat bands
of lane light; her face small), and the smashed cabinet was a different machine from its neighbours (a white box with two
square glass windows, where every cabinet in the film is the code cabinet: teal rounded top band, a black reader box on top,
grey-white body, two small square windows with dot-matrix circles just under the top).

  R16_final  redrawn closer (1100 px a metre instead of 1035), level camera at the cabinet's height, long lens; she and
             the planted guitar fill the frame's height; she has JUST let go: one hand still in the air a hand's breadth from
             the neck (a, b) or her body half turned to the guitar and her head turned back to us (c, d); hair and tie still
             settling; a released, cool look (not blank). The smashed cabinet is the code cabinet smashed (its crop is attached).
             Placement guide work/seg/16/v6/guide/layout_final6.png (work/seg/16/v6/make_guide.py).

usage: python art/design/prompts/_make_seg16f.py -> prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER

TURN = 'board/rin_A2.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
GUIDE = '../../work/seg/16/v6/guide/layout_final6.png'
CAB = '../../work/seg/16/v6/ref/code_cabinet.png'
PREV = '../cut/R16_final.png'

COMMON = (
    "This drawing is the LAST picture of the film, held for three seconds and made to be screenshotted: a 3:2 LANDSCAPE canvas, a "
    "close shot, the camera level at the height of the cabinet's top, long lens, flat front view, no perspective distortion, "
    "verticals vertical, no tilt, NOT looking up at her. "
    "Attached images: 1 her turnaround; 2 the placement guide on the same canvas (do NOT draw its coloured lines or its grey); "
    "3 the previous version of this picture (keep only its idea and the damage of the guitar; the framing, her pose, her face and "
    "the cabinet all change); 4 the cabinet's exact design, intact; 5 the guitar sheet; then her hands and faces enlarged. "
    "Keep every position and size of the guide: the cabinet box, the green line where the cabinet's top is crushed, the orange "
    "ellipse and line where the guitar is, the blue circle (her head, the same size), the blue box (her body), the small blue circle "
    "(where her hand is). "
    "THE CABINET is the SAME machine as attached image 4, smashed: the same flat printed style and colours: two teal side strips with "
    "a fine teal halftone, a grey-white body (#dedcd8) with a thin teal outline and a thin teal inner panel outline, a solid teal "
    "band across the top whose top corners are rounded. Its top is caved in along the green line into a jagged V: the teal top band "
    "bent down and buckled, its rounded corners crumpled; the small black reader box that sat on top knocked loose, tilted and "
    "cracked on the broken edge. Just under the top, exactly where the guide shows two small square windows, the cabinet's own two "
    "small square windows with thin teal frames: the LEFT window smashed (its paper-white face cracked from one point, its ring of "
    "dots broken and scattered), the RIGHT window's face DARK GREY and empty (switched off), with one single thin diagonal crack, "
    "nothing written in it. One bold crack runs down the grey-white body from the V. The cabinet runs out of the BOTTOM edge of the "
    "canvas. Not a different machine: no glass box, no white box, no extra panels. "
    "THE GUITAR is planted in the smashed cabinet like a sword in a stone, standing on its own: its gold BODY driven into the caved-in "
    "top where the orange ellipse is, the lower part of the body INSIDE the cabinet, hidden behind the buckled front and side edges "
    "and the windows, which are drawn IN FRONT of it; nothing gold beside the cabinet lower down. The neck rises to the viewer's "
    "upper LEFT along the orange line, about 35 degrees from vertical, the black headstock fully inside the canvas near the top left. "
    "It is DAMAGED as in image 3: a bold crack through the gold top, a chunk of the body's edge broken off with raw pale wood, the "
    "cream binding split; three strings snapped at the bridge and curling up in loose loops, the other three slack. The gold-top Les "
    "Paul of the guitar sheet: gold top, cream binding, two cream P-90 pickups, cream pickguard, one silver bar bridge, gold knobs, "
    "rosewood fretboard with cream trapezoid inlays, black headstock with six cream tuner buttons, back and sides dark brown. ")

POSE_HAND = (
    "SHE has JUST let go of it, this instant: she stands a half step behind the cabinet and to its right, in the blue box, the "
    "bottom edge of the canvas cutting her at mid-thigh. Her right arm (the arm on the viewer's LEFT) is still raised from the "
    "smash: the hand that held the neck has just opened and hangs in the air at the small blue circle, a hand's breadth from the "
    "neck, fingers loose and spread a little, the palm turned towards the guitar. Her other arm hangs loosely at her side. Her body "
    "turns a little towards the guitar; her head turns to face the camera and she looks straight at the viewer. ")
POSE_TURN = (
    "SHE has JUST let go of it, this instant: she stands a half step behind the cabinet and to its right, in the blue box, the "
    "bottom edge of the canvas cutting her at mid-thigh. Her body is HALF TURNED towards the guitar (a three-quarter view from her "
    "right side, her shoulders angled towards the viewer's left), as if she has just stepped back from it; her right hand (the "
    "viewer's left) is dropping away from the neck, still at the height of the small blue circle, fingers opening; her other hand "
    "loose at her side. Her head turns back over her shoulder to face the camera: she looks straight at the viewer. ")
FACE_AND_MOTION = (
    "Her face: released and cool, the calm right after the hit: her brows level and relaxed (no longer drawn in), her upper lids a "
    "little lowered over the teal eyes, a steady direct look at the viewer, her mouth small and closed with the faintest relaxed "
    "line, as if she has just let out a breath. Not angry, not smiling, not crying, not blank: someone who has just finished. "
    "The swing is still settling: her bob still lifted and swinging from the smash, three or four clean clumps of hair in the air "
    "on the side away from the guitar, drawn as big clean clumps; her teal ribbon tie lifted and curving in the air, not yet hanging "
    "down; her skirt's pleats still swinging out a little; her bow on its headband, very slightly tilted. Her blazer a little "
    "pushed up at the shoulders. NO lanyard and NO card anywhere on her (her name card is gone). "
    "Lighting: plain even indoor light from the front, flat colours, one hard-edged shadow tone per material. Her face, eyes and "
    "hair are drawn with the most care in the picture: it is shown large and held for three seconds. ")
TAIL = ("The cabinet, the guitar and the girl are ONE picture: where they touch or overlap, the overlaps are drawn. Fully "
        "TRANSPARENT background (PNG alpha) everywhere else; the girl, the guitar and the cabinet fully opaque. No floor, no wall, "
        "no shadow on the background. No red anywhere, no fire, no sparks, no smoke, no dust, no speed lines, no text. The line art "
        "one step bolder than usual.")
ID = IDENTITY.replace("a teal lanyard with her white name card in a clear holder, ", "")
mk = lambda pose: "\n".join([ID, COMMON + pose + FACE_AND_MOTION, DRAW, SHEET_RULE, LARGE, HANDS, NEVER, TAIL])

w = lambda n, t: open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
args = []
for n, pose in (('R16_final6_a', POSE_HAND), ('R16_final6_b', POSE_HAND), ('R16_final6_c', POSE_TURN), ('R16_final6_d', POSE_TURN)):
    w(n, mk(pose)); args.append(f"-{n}:{TURN}+{GUIDE}+{PREV}+{CAB}+{LP}+{HANDS_REF}+{FACES}")
print(' '.join(args))
