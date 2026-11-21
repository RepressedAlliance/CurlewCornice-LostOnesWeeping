"""Segment 08b (副歌1后半, docs/分镜/08b_副歌1后半.md) sample drawings for the two designs of 句24-25 (k247-k264).

Design A (甲, the storyboard as written): the machine stacks everyone's answer sheets, hers covers them blank; cut to her
bust (cold, looking down at her sheet); cut to her hand writing across はい/いいえ and snapping the pencil in its fist.
  - r08b_stare   (master) her bust, 3/4 to the viewer's left, chin down, eyes lowered to the lower left, cold, dry tear tracks
  - h08b_write   (master) her right hand from straight above, writing hard with the green wooden pencil of Demo 1 (hpen3)
  - h08b_snap    (h08b_write with one change: the fist clenched, the pencil snapped, the broken stub pointing down to the paper)
Design B (乙): her hand is on her sheet from the first beat (hovering over はい while everyone's はい close in round it), she
writes both halves of 句25 herself, and the only cut is to her face at the snap.
  - h08b_write   (shared with A: the hand hovering is the same drawing lifted, as in Demo 1)
  - r08b_snapb   (master) chest-up, eye level, her right fist raised in front of her chest, the pencil snapped in it, eyes down

Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg08b.py      -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
CRY = '../cut/rface_scr2.png'          # the same girl a few seconds earlier (Demo 2's crying shout)
HPEN = '../cut/hpen3.png'              # Demo 1's hand and pencil
EXPR = '../canon/rin_expressions.png'

DAY = ("Lighting: plain even indoor daylight from the upper left, the flat colours of the turnaround, exactly one hard-edged shadow "
       "tone per material; no rim light, no glow, no light band along the outline.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her: no wall, no desk, no shadow, no frame, no scenery. Every "
         "part of her fully opaque. No text, no logos. No red anywhere.")
TEARS = ("She cried a few seconds ago and has stopped: on each cheek one thin, dry, pale tear track (a narrow pale line from the lower "
         "lid down the cheek, as on the second attached image but dried, no drops, no wet shine). The eyes are not wet any more.")
CARD_HIDDEN = IDENTITY.replace("a teal lanyard with her white name card in a clear holder",
                               "a thin teal lanyard round her neck (its two straps run down out of the bottom edge of the picture; "
                               "the card itself hangs lower, outside the picture)")

R_STARE = "\n".join([
    CARD_HIDDEN,
    "One illustration for a film close-up, landscape canvas 3:2. Her BUST: from just above the top of her bow down to the middle of "
    "her chest (the bottom edge of the canvas cuts across her blazer a little below the ribbon tie). Her head is large in the canvas: "
    "the face is about one third of the canvas height. Camera exactly at her eye height, straight on, long lens: no high or low angle.",
    "Her body and face are turned three-quarters towards the viewer's LEFT (we see more of her right cheek, on the viewer's right). Her "
    "chin is lowered a little. Her eyes look DOWN and to the viewer's LEFT, at a sheet of paper lying on a desk below and in front of "
    "her (out of the picture): the upper eyelids lowered to cover the top third of the irises, the teal irises still clearly visible "
    "under them. She does NOT look at the viewer.",
    "Expression: cold and flat, past crying. The brows level and straight, not raised and not frowning hard; the mouth a small closed "
    "straight line; no smile, no pout. The coldness is in the lowered lids and the lowered chin.",
    TEARS,
    "Place her a little LEFT of the canvas centre, the back of her head and her right shoulder towards the right side.",
    DRAW, SHEET_RULE, DAY, LARGE, NEVER, ALPHA])

H_WRITE = "\n".join([
    "One illustration for a film close-up: the RIGHT hand and forearm of the girl of the turnaround (Kagamine Rin in this film's "
    "design, 14 years old), nothing else of her. The first attached image is the SAME hand holding the SAME pencil from the same "
    "camera: keep its hand, sleeve, pencil, size, position and drawing style.",
    "Portrait canvas 2:3. Seen from straight above, looking down at a desk: her right hand WRITING HARD with the Japanese school "
    "pencil (a dark green painted hexagonal body, a sharpened natural-wood cone and a black graphite point, its other end a FLAT "
    "painted end). The graphite point presses down on the paper at the upper left of the hand, at the same place as in the first "
    "attached image. She presses hard, angrily: the thumb and index finger pinch the pencil tightly a little above the wood cone, the "
    "fingertips a little paler with the pressure, the index finger bent, the middle finger braced under the pencil, the ring and "
    "little fingers curled tight under the hand; the pencil a little more upright than in the first attached image. The wrist comes "
    "out of a white shirt cuff and the charcoal blazer sleeve, and the forearm in its sleeve runs straight down and leaves the picture "
    "through the bottom edge.",
    "Her hand is a 14-year-old girl's: small and slim, a narrow palm and wrist, thin fingers, drawn as simply as the hands on the "
    "turnaround (enlarged in the last attached image).",
    DRAW, SHEET_RULE, "Lighting: plain daylight from the upper left, one hard-edged shadow tone, no rim light, no glow.", HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve and pencil: no desk, no paper, no shadow. No text, "
    "no logos, no red anywhere."])

H_SNAP = variant(
    "the hand is now clenched into a tight FIST around the pencil, and the pencil has SNAPPED in two in the middle, between the thumb "
    "and the index finger: the front half with the wood cone and the graphite point is GONE (it is not in the picture at all). The fist "
    "holds the back half: its flat painted end still sticks out past the knuckles towards the lower right as before, and its BROKEN "
    "end points down to the upper left, ending exactly where the graphite point was before (so the broken end touches the paper at "
    "the same spot): a jagged, splintered break of pale natural wood with a few short sharp splinters and a short stub of black "
    "graphite showing in the middle. The fingers are curled tight into the palm, the thumb pressed down over the index finger. The same "
    "hand size, the same wrist, white cuff and blazer sleeve in the same place, the forearm still leaving through the bottom edge.")

R_SNAPB = "\n".join([
    CARD_HIDDEN.replace("the card itself hangs lower, outside the picture", "the card itself hidden behind her raised right forearm"),
    "One illustration for a film shot, landscape canvas 3:2. Chest-up: from just above the top of her bow down to her lower chest "
    "(the bottom edge of the canvas cuts across her blazer at the height of the lower blazer pocket tops). She is sitting at a school "
    "desk that is below the picture. Camera exactly at her eye height, straight on, long lens: no high or low angle, the shoulders "
    "level.",
    "Her body faces the viewer, turned only slightly (about 20 degrees) towards the viewer's LEFT. Her RIGHT hand (on the viewer's "
    "LEFT) is raised in front of her chest, at the height of her ribbon tie, a little to the viewer's left of her centre: clenched in "
    "a tight FIST around a Japanese school pencil (dark green painted hexagonal body, as in the third attached image) that has just "
    "SNAPPED in two inside her fist. She holds the back half: its flat painted green end sticks out of the bottom of the fist (the "
    "little-finger side), and its BROKEN end sticks out of the top of the fist (the thumb side) pointing up and to the viewer's left: "
    "a jagged, splintered break of pale natural wood with a few short sharp splinters and a short stub of black graphite in the middle. "
    "The front half of the pencil is NOT in the picture. Her forearm comes up from below the bottom edge to the fist. Her left arm is "
    "down, out of the picture.",
    "Her head is lowered a little and her eyes look DOWN at her fist and past it to the desk: the upper eyelids lowered over the top "
    "third of the teal irises. She does NOT look at the viewer. Expression: cold, flat and hard, past crying; the brows level, the jaw "
    "set, the mouth a small closed straight line pressed a little tight. The hardness is in the lowered lids, the set mouth and the "
    "tight fist, not in a scowl.",
    TEARS,
    "Her whole figure centred a little LEFT of the canvas centre.",
    DRAW, SHEET_RULE, DAY, LARGE, HANDS, NEVER, ALPHA])

PROMPTS = {'r08b_stare': R_STARE, 'h08b_write': H_WRITE, 'h08b_snap': H_SNAP, 'r08b_snapb': R_SNAPB}
for n, t in PROMPTS.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)

ROUND1 = [f'-r08b_stare:{TURN}+{CRY}+{FACES}', f'-h08b_write:{HPEN}+{TURN}+{HANDS_REF}', f'-r08b_snapb:{TURN}+{CRY}+{HPEN}+{FACES}+{HANDS_REF}']
ROUND2 = ['-h08b_snap:out/h08b_write.png']
print('round 1:', ' '.join(f'"{a}"' for a in ROUND1))
print('round 2:', ' '.join(f'"{a}"' for a in ROUND2))

# ---------------------------------------------------------------------------------------------------------------------
# 细做 (2026-11-20, design 乙 chosen by both reviewers): the whole segment. New drawings:
#  - h08b_pull    (h08b_write with one change) the hand jerked back off the paper the instant the black closes in (k253)
#  - h08b_scrawl  (h08b_write with one change) gripping hard and writing angrily in the 理由 box (k255-k259); a different
#                  drawing from the hover so the hand track is hover -> pull -> scrawl, never back to the same drawing
#  - r08b_grip    (new master) the last shot: her face in the LEFT half, cold, looking down at her raised fist in the
#                  foreground, the WHOLE pencil gripped in it like a dagger; the right part of the canvas left empty
#                  (graphite and her white letters go there). Bigger fist than r08b_snapb (both reviewers: too small).
#  - r08b_snapc   (r08b_grip with one change) the pencil snapped in the fist, the front half gone
H_PULL = variant(
    "she has just JERKED the pencil back off the paper: the hand pulled back a little towards the lower right of the canvas (the "
    "whole hand, sleeve and forearm shifted about one twentieth of the canvas towards the lower right, the forearm still leaving "
    "through the bottom edge), the wrist bent slightly back, the fingers stiff and tense round the pencil, and the pencil tipped "
    "more UPRIGHT so that, seen from above, it looks shorter: its graphite point now nearer to the thumb than before. The point is "
    "lifted off the paper.")
H_SCRAWL = variant(
    "the grip is now much TIGHTER and angrier: the thumb and index finger clench the pencil hard just above the wood cone (closer "
    "to the point than before), the index finger bent sharply, the knuckles raised, the ring and little fingers dug in tight under "
    "the hand, the pencil held a little more upright and pressing down hard on its point. The same hand size, the same sleeve, cuff "
    "and forearm in the same place, the point at the same spot.")
R_GRIP = "\n".join([
    CARD_HIDDEN.replace("the card itself hangs lower, outside the picture", "the card itself hidden behind her raised right forearm"),
    "One illustration for a film shot, landscape canvas 3:2. Chest-up: from just above the top of her bow down to her lower chest. "
    "Camera exactly at her eye height, straight on, long lens: no high or low angle, the shoulders level.",
    "LAYOUT (important): she fills only the LEFT 60 percent of the canvas. Her face centre is at about one third of the canvas width "
    "from the left edge. The RIGHT 40 percent of the canvas is completely EMPTY (transparent): nothing of her there.",
    "Her body faces the viewer, turned slightly (about 20 degrees) towards the viewer's LEFT. Her RIGHT hand (on the viewer's LEFT) is "
    "raised in front of her chest and close to the camera, at the height of her chin, in front of her right shoulder: a tight FIST, "
    "BIG in the picture (the fist about one fifth of the canvas width), the back of the hand turned a little towards the viewer, all "
    "fingers curled hard, the thumb pressed down over the index finger. In the fist she grips a WHOLE Japanese school pencil like a "
    "dagger (a dark green painted hexagonal body as in the third attached image, a sharpened natural-wood cone and a black graphite "
    "point, its other end a flat painted green end): the front part with the wood cone and the point sticks UP out of the top of the "
    "fist (the thumb side), long and clearly visible, pointing up and a little to the viewer's left; the flat green end sticks out of "
    "the bottom of the fist (the little-finger side). The pencil is straight and unbroken. Her forearm comes up from below the bottom "
    "edge to the fist. Her left arm is down, out of the picture.",
    "Her head is lowered a little and her eyes look DOWN at her fist and past it: the upper eyelids lowered over the top third of the "
    "teal irises. She does NOT look at the viewer. Expression: cold, flat and hard, past crying; the brows level, the jaw set, the mouth "
    "a small closed straight line pressed a little tight. The hardness is in the lowered lids, the set mouth and the tight fist, not in "
    "a scowl.",
    TEARS,
    DRAW, SHEET_RULE, DAY, LARGE, HANDS, NEVER, ALPHA])
R_SNAPC = variant(
    "the pencil has just SNAPPED in two inside her fist: the front part that stuck up out of the top of the fist (the wood cone and "
    "the graphite point) is GONE, not in the picture at all. Out of the top of the fist now sticks only a short BROKEN end of the "
    "green pencil body, pointing up and a little to the viewer's left: a jagged splintered break of pale natural wood with a few "
    "short sharp splinters and a small black stub of graphite in the middle. The fist is clenched even a little tighter. The flat "
    "green end still sticks out of the bottom of the fist. Her face, eyes, expression, hair, bow and clothes do not change.")
P2 = {'h08b_pull': H_PULL, 'h08b_scrawl': H_SCRAWL, 'r08b_grip': R_GRIP, 'r08b_snapc': R_SNAPC}
for n, t in P2.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
ROUND4 = [f'-r08b_grip:{TURN}+{CRY}+{HPEN}+{FACES}+{HANDS_REF}', '-h08b_pull:out/h08b_write.png', '-h08b_scrawl:out/h08b_write.png']
ROUND5 = ['-r08b_snapc:out/r08b_grip.png']
print('round 4:', ' '.join(f'"{a}"' for a in ROUND4))
print('round 5:', ' '.join(f'"{a}"' for a in ROUND5))

# round 5 (manual, kept here): h08b_scrawl2 = h08b_scrawl redone without the lines on the back of the hand (round 4's
# h08b_scrawl drew tendons and creases, an old man's hand).
# (prompt: art/design/prompts/h08b_scrawl2.txt)
# round 6: both reviewers found the fist and the broken end too small for a phone. r08b_grip2 = r08b_grip with one change: the
# raised fist brought towards the camera, so the fist and the pencil are about twice as big; then r08b_snapc2 from it.
R_GRIP2 = variant(
    "her raised right FIST is brought much closer to the camera, so it is about TWICE as big in the picture: the fist now about one "
    "third of the canvas height, in the lower LEFT foreground, in front of her right shoulder and her chest, its top at the height "
    "of her chin (it must NOT cover any part of her face, her mouth or her chin). The WHOLE pencil gripped in it like a dagger is "
    "twice as big too and clearly visible: the long front part with the green painted body, the natural-wood cone and the black "
    "graphite point sticks UP out of the top of the fist, pointing up and a little to the viewer's left, beside her cheek but not "
    "over it; the flat green end sticks out of the bottom of the fist. The fist drawn as simply as the rest: a few clean outlines, "
    "flat skin colour, one hard-edged shadow shape, no knuckle lines, no tendons, no creases. Her face, eyes, expression, tear "
    "tracks, hair, bow, clothes and her place in the canvas do not change; the right 40 percent of the canvas stays empty.")
R_SNAPC2 = variant(
    "the pencil has just SNAPPED in two inside her fist: the long front part that stuck up out of the top of the fist (the green "
    "body above the fist, the wood cone and the graphite point) is GONE, not in the picture at all. Out of the top of the fist now "
    "sticks only a short BROKEN end of the green pencil body, pointing up and a little to the viewer's left: a jagged, splintered "
    "break of pale natural wood with three or four sharp splinters and a small black stub of graphite in the middle, clearly "
    "visible. The fist is clenched a little tighter. The flat green end still sticks out of the bottom of the fist. Her face, eyes, "
    "expression, hair, bow and clothes do not change.")
for n, t in {'r08b_grip2': R_GRIP2, 'r08b_grip2b': R_GRIP2, 'r08b_snapc2': R_SNAPC2, 'r08b_snapc2b': R_SNAPC2}.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
print('round 6:', '"-r08b_grip2:out/r08b_grip.png+../canon/rin_turnaround.png+../ref/sheet_hands.png"')
print('round 7:', '"-r08b_snapc2:out/r08b_grip2.png"')

# round 8 (2026-11-20, review: the flying front half and the crumbs were flat code-drawn icons, the break drawn as a second
# point). The pieces that fly off at the snap are drawn by Codex as transparent components in r08b_grip's line work:
#  - p08b_front   the snapped-off front half of the pencil alone (green body, wood cone, point, a jagged splintered break)
#  - p08b_bits    a sheet of separate small pieces: wood splinters, slivers of the green skin, graphite crumbs
PIECE_STYLE = ("Draw it in exactly the line work and colouring of the pencil in the first attached image: clean black outlines of "
               "even weight (the outline about one twelfth of the pencil's width), flat colours, exactly one hard-edged darker "
               "shadow tone per material (the green paint, the pale natural wood, the dark graphite), a single small clean "
               "highlight on the graphite; no gradients, no texture noise, no glow, no drop shadow, no motion lines.")
P_FRONT = "\n".join([
    "Use the first attached image only as the model of the pencil (her pencil, gripped in her fist). Draw ONLY the FRONT HALF of "
    "that pencil, which has just been SNAPPED OFF: nothing of her, no hand, no fist, no clothes. The piece is the dark green painted "
    "hexagonal body with its sharpened natural-wood cone and black graphite point exactly as they stick out of the top of her fist "
    "in the first attached image, plus a little more green body; its other end is the BREAK: a jagged, splintered break of pale "
    "natural wood, torn, with three or four long sharp splinters of different lengths sticking out and a short ragged stub of black "
    "graphite in the middle. The break is clearly a torn end, wider and messier than the point, never a second sharpened point. It is "
    "the matching other half of the broken stub in the second attached image.",
    "Composition: the single piece alone, BIG, lying diagonally across the middle of a landscape 3:2 canvas, the graphite point at the "
    "upper left, the broken end at the lower right, its length about 70 percent of the canvas width. Seen from the side, flat, no "
    "perspective foreshortening.",
    PIECE_STYLE,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the piece; the piece fully opaque. No text, no red anywhere."])
P_BITS = "\n".join([
    "Use the first attached image only as the model of the pencil (her dark green painted wooden school pencil). Draw a sheet of the "
    "small pieces that burst out when the pencil is snapped in two in a fist, each piece separate from the others with plenty of "
    "transparent space between them, nothing touching, nothing overlapping: SIX thin sharp WOOD SPLINTERS of pale natural wood "
    "(narrow jagged slivers, pointed at both ends, of different lengths, some slightly bent, each with one darker side), THREE small "
    "slivers of the green painted skin (green on the outside, a thin edge of pale wood showing), and FOUR small irregular chips of "
    "black graphite lead (angular, sharp-edged, a tiny highlight). Arrange the thirteen pieces in a loose grid over a landscape 3:2 "
    "canvas, each piece about one tenth of the canvas width long (the graphite chips smaller), lying at different angles.",
    PIECE_STYLE,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the pieces; every piece fully opaque. No text, no red anywhere."])
for n, t in {'p08b_front': P_FRONT, 'p08b_front2': P_FRONT, 'p08b_bits': P_BITS, 'p08b_bits2': P_BITS}.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
print('round 8:', '"-p08b_front:../cut/r08b_grip.png+../cut/r08b_snapc.png" "-p08b_bits:../cut/r08b_grip.png+../cut/r08b_snapc.png"')
# round 8b: p08b_front came out as a long piece (six times as long as wide); the part that stuck out of her fist in
# r08b_grip is short (the cone and a little green body, about 2.3 times as long as the pencil is wide), so the piece that
# flies off must be that short.
P_FRONT_SHORT = P_FRONT.replace("plus a little more green body; its other end", "and only a SHORT length of green body, about as long as "
    "the wood cone, so that the whole piece is only about TWO AND A HALF times as long as the pencil is wide (a short stubby piece, "
    "NOT a long pencil); its other end").replace("its length about 70 percent of the canvas width", "its length about 55 percent of "
    "the canvas width (so it is drawn large and its width is large)")
for n in ('p08b_front3', 'p08b_front4'):
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(P_FRONT_SHORT)
