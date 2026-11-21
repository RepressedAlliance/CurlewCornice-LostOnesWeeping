"""Segment 16 redo (2026-11-21, user feedback on the whole film: rock rhythm, the ending must hold viewers to the last second):
the strumming insert that opens the ending figure (design 甲「判定落空」, k556-k560).

  g16_pick_dn (master)  insert close-up of her right hand with the pick sweeping DOWN across the strings over the bridge pickup
  g16_pick_up           g16_pick_dn redrawn, only the right hand changed: the up-strum done, the pick turned, the hand above the strings

usage: python art/design/prompts/_make_seg16b.py master   -> g16_pick_dn_a / _b
       python art/design/prompts/_make_seg16b.py up       -> g16_pick_up_a / _b (variants of art/cut/g16_pick_dn.png)
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, HANDS, NEVER, DRAW, SHEET_RULE

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
HANDS_REF = '../ref/sheet_hands.png'

MASTER = (
    "Character: Kagamine Rin in this film's design (attached Image 1 is her turnaround; the second attached image shows this exact "
    "moment from further away: her right hand, her sleeve and the guitar at the same angle). Only her RIGHT forearm and hand and the "
    "front of her body behind the guitar are in this picture; her face is NOT in the picture. She wears the charcoal-grey school "
    "blazer (its sleeve ends in a plain cuff with two small dark buttons), a white shirt whose white cuff shows a little at the wrist, "
    "and the charcoal pleated skirt. NO lanyard, NO card anywhere.\n"
    "This drawing: an INSERT CLOSE-UP of the guitar and her strumming hand, as a film cuts in on the hand. Landscape canvas 3:2. "
    "Camera straight on, level, at the height of her right hand, long lens: the guitar top faces the camera flat, no perspective "
    "distortion, no tilt (the picture's vertical stays vertical).\n"
    "The guitar is the gold-top Les Paul of the third attached image; match it exactly: gold top, cream binding, two cream P-90 "
    "pickups, cream pickguard, ONE silver bar bridge (a wraparound bar, no separate tailpiece), gold knobs, rosewood fretboard with "
    "cream trapezoid inlays. In this picture we see the middle of the guitar body large: the bar bridge, the BRIDGE pickup and the "
    "neck pickup, part of the pickguard and of the cream binding of the body's edge, and the start of the fretboard. The neck rises to "
    "the viewer's UPPER RIGHT at about 40 degrees, exactly the angle of the guitar in the second attached image, and leaves the picture "
    "through the right part of the top edge or the upper right corner. EXACTLY SIX steel strings, thin, straight, parallel and evenly "
    "spaced, drawn as clean light-grey lines with a thin dark edge: they start at the bar bridge (lower left of the centre), run over "
    "both pickups and up the fretboard, and leave the picture with the neck at the upper right. Every string is one straight unbroken "
    "line except exactly where the hand or the pick is in front of it.\n"
    "Her RIGHT hand: her forearm comes into the picture from the viewer's LEFT, a little above the middle, the sleeve and cuff clearly "
    "drawn. She holds a small cream teardrop pick pinched between the pad of her thumb and the side of her bent index finger, the "
    "other three fingers loosely curled. The moment: a hard DOWN-strum: the pick has just swept down across all six strings right "
    "over the BRIDGE pickup and its tip is now just past the lowest string, the wrist leading, the hand still moving. The hand covers "
    "only a short part of the strings; the strings are clearly visible on both sides of the hand.\n"
    "Behind and around the guitar, wherever the guitar does not cover, the picture is filled by her: the charcoal blazer's front and "
    "hem and the charcoal pleated skirt, plain and flat, a few folds only. The picture is FULLY OPAQUE edge to edge: no transparency, "
    "no empty background, no floor. The picture is cropped by its edges on all four sides (nothing ends inside the picture: the "
    "guitar body, the sleeve, the skirt all run off the edges), with a margin of extra picture beyond what matters on every side.\n"
    "Lighting: plain even indoor light, the flat colours of the turnaround, one hard-edged shadow tone per material; the gold top a flat "
    "warm gold with one hard-edged shadow tone, no shine, no gradient.\n"
    + DRAW + " The line art one step bolder than usual, because this picture is shown full screen.\n"
    + SHEET_RULE + "\n" + HANDS + "\n" + NEVER +
    " No red anywhere. No text or logos on the guitar."
)
UP = variant(
    "only her RIGHT HAND: the UP-strum is done: the hand has swung back UP and is now held just ABOVE the strings (on the side of "
    "the strings towards the viewer's upper left), over the bridge pickup; the wrist turned, the cream pick turned over with its tip "
    "pointing down towards the strings, the same small pick pinched between thumb and index finger, the other fingers loosely curled. "
    "All six strings are now FULLY visible, unbroken, straight and parallel, exactly where they are. The guitar (body, pickups, bridge, "
    "strings, neck, angle), the sleeve's line, the blazer and skirt behind, the canvas and its framing do not move at all, line for "
    "line.", keep_bg=False) + " The picture stays fully opaque edge to edge."

which = sys.argv[1] if len(sys.argv) > 1 else 'master'
w = lambda n, t: open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
if which == 'master':
    args = []
    for n in ('g16_pick_dn_a', 'g16_pick_dn_b'):
        w(n, MASTER); args.append(f"-{n}:{TURN}+../cut/R15_strum_3.png+{LP}+../cut/R15_strum_1.png+{HANDS_REF}")
    print(' '.join(args))
elif which == 'up':
    args = []
    for n in ('g16_pick_up_a', 'g16_pick_up_b'):
        w(n, UP); args.append(f"-{n}:../cut/g16_pick_dn.png+{TURN}+{LP}+{HANDS_REF}")
    print(' '.join(args))
