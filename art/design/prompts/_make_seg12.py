"""Segment 12 (副歌2, docs/分镜/12_副歌2.md) sample drawings for the two designs of k359-k391 (第 3 节).

Design A (甲, recommended): the exam page is a paper wall in front of her; she stands behind it in front of the coin lockers at
night. k366 the cut line splits and one of her eyes looks through; Q2's figure is a printed bust of HER at the same place and
size; the slit is torn wider, strips fold down, the rest of the figure swings open like a door, the camera pushes into the tear
and she shouts at us.
  - r12_play     (master) upper body, front, eye level, playing the Les Paul, cold, looking straight at the viewer
  - p12_anoko    the same framing as r12_play, drawn as a TEXTBOOK illustration in teal print: bland, eyes a little off, no
                 guitar, hands out of the picture (first reference r12_play, so the head lies exactly on hers)
  - r12_shout_a  r12_play redrawn, only the face changed: brows down, glaring, teeth bared, shouting at the viewer
  - r12_shout_b  r12_play redrawn (shout_a second): head pushed forward a quarter of a head, mouth wider, side hair flung up
Design B (乙): the frame is split by a cut line; the right half is the night coin lockers where she takes her guitar back.
  - r12b_pick    (master) thigh-up, 3/4 to the viewer's left, guitar on, right hand raised with the pick, side glance left
  - r12b_yank    the same camera, scale and place: she has just yanked the soft gig bag out of her locker (viewer's right)
  - r12b_sling   the same camera: the guitar just put on, settling the strap, looking down at it
  - r12b_strum   r12b_pick redrawn, only the right arm and face: the strum has gone down through the strings, glaring left
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg12.py      -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
BAG = '../canon/gigbag_front_back_side_open.png'
HOLD = '../cut/rmid_master.png'            # Demo 2: how she holds and strums this guitar (hold only)
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'

LIGHT = ("Lighting: NIGHT, she stands under one cool white fluorescent strip light that is above and a little in front of her (on "
         "top of a bank of coin lockers): flat colours slightly cooler than daylight, exactly one hard-edged shadow tone per material "
         "(under the chin, under the bow, under the arms); no rim light, no glow, no light band along the outline, no gradients. "
         "Her bow, hairclips and shirt stay clean white.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the guitar: no wall, no lockers, no floor, no shadow, no "
         "frame, no scenery. Every part of her and the guitar fully opaque, with a clean hard edge (no halo, no soft fringe). No text, "
         "no logos. No red anywhere.")
GUITAR = ("The guitar is the gold-top Les Paul of the second attached image; match it exactly: gold top, cream binding, two cream P-90 "
          "pickups, cream pickguard, one silver bar bridge, four gold knobs, black headstock with NO logo or text, 3+3 tuners with "
          "cream buttons, rosewood fretboard with cream trapezoid inlays; back and sides dark brown. True size for a 152 cm girl: "
          "the whole guitar is about two thirds of her height. A plain black strap over her LEFT shoulder (viewer's right). She "
          "plays right-handed: LEFT hand on the neck, RIGHT hand at the strings with a small cream pick.")
CARD = ("Her name card hangs on the teal lanyard in front of her chest, ABOVE the guitar body, facing the viewer: a white landscape "
        "card 15 x 10 cm in a thin clear holder, its face left completely plain white (nothing printed on it), not covered.")

R_PLAY = "\n".join([
    IDENTITY,
    "One illustration for a film shot, landscape canvas 3:2. UPPER BODY: from the top of her bow down to her waist; the bottom edge "
    "of the canvas cuts straight across her waist and across the guitar body. Camera exactly at her eye height, straight on, long "
    "lens: no high or low angle, shoulders level.",
    "She stands facing the viewer (front view) and plays the guitar: the guitar hangs on its strap across her body, the body at her "
    "right hip (viewer's LEFT, partly cut by the bottom edge), the neck rising to the viewer's RIGHT at about 20 degrees, long, the "
    "headstock far out to the right, outside her silhouette. Her RIGHT hand rests on the strings over the pickups holding the pick, "
    "her LEFT hand frets a chord in the middle of the neck, arm extended to the right.",
    "Her head is level and she looks STRAIGHT INTO THE CAMERA, at the viewer: eyes fully open, the teal irises centred, calm and cold. "
    "Expression: cold, still and flat; the brows level, the mouth a small closed straight line. Not angry, not sad, not smiling, not "
    "wide-eyed. Dry face, no tears.",
    CARD,
    GUITAR,
    "The third attached image shows how she holds this guitar (use it for the hold only, not for the drawing style, angle, background "
    "or face).",
    "Placement in the canvas (important, the film lines it up exactly): her FACE is in the LEFT part of the canvas, the centre of her "
    "face at about 26% of the canvas width from the left edge; the top of the bow loops about 2% below the top edge; her chin at about "
    "50% of the canvas height; the face (cheek to cheek) about 18% of the canvas width. The headstock tip at about 85% of the canvas "
    "width and about 45% of the canvas height. Nothing of her or the guitar crosses the left, top or right edge.",
    DRAW, SHEET_RULE, LIGHT, LARGE, HANDS, NEVER, ALPHA])

P_ANOKO = "\n".join([
    "Redraw the girl of the first attached image as a TEXTBOOK ILLUSTRATION printed in one ink: the same girl (the turnaround is the "
    "second attached image), the same canvas, the same framing, and her HEAD exactly the same size and exactly the same position in "
    "the canvas as in the first attached image: the same outline of the head, the hair, the bangs and the bow, the eyes at the same "
    "place and the same size, the shoulders at the same place.",
    "Changes from the first attached image: there is NO guitar and no strap; her arms hang straight down at her sides, both hands out "
    "of the picture below the bottom edge. Her expression is the bland, polite, empty face of a model student in a school textbook: "
    "a faint neutral mouth, the brows soft and level; her eyes look a little to the viewer's LEFT, past the viewer, not at the viewer. "
    "The lanyard and plain white card on her chest as before.",
    "Printing: ONLY ONE INK, teal #218EA3, on a plain white ground. Fine, even, clean teal outlines; the shadows and the dark blazer "
    "and skirt are flat, regular, round halftone dots in teal (a fine dot screen, as in a printed school textbook); the hair and skin "
    "are white paper with teal outlines, the hair with a light dot screen; the irises teal. No other colour at all: no yellow, no "
    "grey, no black, no skin colour. It must look like an illustration printed in a Japanese school textbook.",
    "Fully TRANSPARENT background (PNG alpha) outside her (the white paper inside her outline stays white and opaque). No text, no "
    "frame, no caption, no red anywhere.",
    NEVER])

R_SHOUT_A = variant(
    "her FACE only: she now SHOUTS straight at the viewer, furious: the brows pulled down hard and angled, the eyes glaring at the "
    "viewer (still fully visible teal irises, looking straight into the camera), the mouth open in a shout showing the upper and lower "
    "teeth. No tears, dry face, no blush, no sweat. Her body, arms, hands, the guitar, the strap, the card, the hair and the bow do "
    "not move at all: they must lie exactly on the first attached image.")
R_SHOUT_B = variant(
    "her head is thrust FORWARD towards the viewer by about a quarter of a head (so the head is drawn a little larger and a little "
    "lower than in the first attached image), her mouth is open WIDER and rounder in a full-throated shout (upper teeth visible; the inside "
    "of the mouth a dark muted grey-brown and the tongue a pale dusty beige-pink, nothing red or saturated pink), "
    "the brows down hard, the eyes glaring straight at the viewer, and the hair at both sides of her face is flung up and outwards by "
    "the movement (a few clean clumps, not many thin strands). Her shoulders, arms, hands, the guitar and the strap do not move at all.")

R_PICK = "\n".join([
    IDENTITY,
    "One illustration for a film shot, PORTRAIT canvas 2:3. From the top of her bow down to just below her knees (the bottom edge "
    "cuts across her shins just below the knees). Camera exactly at her eye height, straight on, long lens: no high or low angle, "
    "shoulders level. She stands in the middle of the canvas, her body turned three-quarters towards the viewer's LEFT.",
    "The guitar hangs on its strap across her body in playing position. Her RIGHT arm is raised: the right hand lifted high above the "
    "strings, at the height of her chest, holding the small cream pick, about to strike down hard. Her LEFT hand frets a chord on the "
    "neck. Her head is turned towards the viewer's LEFT, chin a little down, and her eyes look sharply SIDEWAYS to the viewer's left "
    "(out of the picture, at something beside her), not at the viewer: a cold, hard sideways glance; the brows level and low, the "
    "mouth a small closed straight line.",
    CARD,
    GUITAR,
    "The third attached image shows how she holds this guitar (use it for the hold only, not for the drawing style, angle or face).",
    "Her whole figure fits inside the canvas left to right with a margin; the top of the bow about 3% below the top edge.",
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

SAME_CAM = ("The first attached image is the SAME girl in the SAME shot a moment later: keep exactly its canvas, framing (bow near "
            "the top, the bottom edge across her shins just below the knees), her size and her position in the canvas, the drawing "
            "style, line weight, colours and lighting. Only the pose changes, as written here.")

R_YANK = "\n".join([
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a teal lanyard with a plain white card in a clear holder"),
    SAME_CAM,
    "This moment: she has just YANKED her black soft guitar gig bag (the gig bag of the third attached image, closed, the guitar inside) "
    "out of a tall coin locker that is just outside the picture at the viewer's RIGHT. Her body is turned three-quarters towards the "
    "viewer's RIGHT, leaning back a little with the pull, feet apart. Both hands grip the gig bag's padded side handle in front of her "
    "waist; the bag swings out horizontally across the lower part of the picture, its neck end pointing to the viewer's RIGHT and still "
    "cut by the right edge of the canvas, its wide body end towards the viewer's left in front of her legs. Her head is turned to the "
    "bag, eyes on it, cold and determined, mouth closed in a straight line. There is NO guitar in her hands, it is inside the bag.",
    "The gig bag: charcoal black (#2E2E33), one hard-edged shadow tone, two zipped front pockets, a small blank white paper tag on the "
    "handle.",
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

R_SLING = "\n".join([
    IDENTITY,
    SAME_CAM,
    "This moment: she has just put the guitar on. The guitar (the Les Paul of the third attached image) hangs on its strap across her "
    "body in playing position, exactly where it hangs in the first attached image. Her RIGHT hand is up at her LEFT shoulder (viewer's "
    "right), gripping the black strap and pulling it straight; her LEFT hand holds the guitar neck. Body turned three-quarters to the "
    "viewer's LEFT as in the first attached image. Her head is bowed and her eyes look DOWN at the guitar, cold, mouth closed.",
    CARD,
    GUITAR.replace("second attached image", "third attached image"),
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

R_STRUM = variant(
    "her RIGHT arm and her FACE only: the right hand has struck DOWN hard through the strings and is now just below the strings, past "
    "the bridge, the pick still in it, the forearm swung down across the guitar body; her eyes glare harder to the viewer's LEFT, the "
    "brows pulled down, the mouth a little open with the effort (teeth just showing). Her body, legs, left hand, the guitar and the "
    "strap do not move.")

PROMPTS = {'r12_play': R_PLAY, 'p12_anoko': P_ANOKO, 'r12_shout_a': R_SHOUT_A, 'r12_shout_b': R_SHOUT_B, 'r12_shout_b2': R_SHOUT_B,
           'r12b_pick': R_PICK, 'r12b_yank': R_YANK, 'r12b_sling': R_SLING, 'r12b_strum': R_STRUM}
for n, t in PROMPTS.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)

ROUND1 = [f'-r12_play:{TURN}+{LP}+{HOLD}+{FACES}+{HANDS_REF}', f'-r12b_pick:{TURN}+{LP}+{HOLD}+{HANDS_REF}']
ROUND2A = ['-p12_anoko:out/r12_play.png+' + TURN, '-r12_shout_a:out/r12_play.png+' + FACES,
           '-r12_shout_b:out/r12_play.png+' + FACES]
ROUND2B = [f'-r12b_yank:out/r12b_pick.png+{TURN}+{BAG}+{HANDS_REF}', f'-r12b_sling:out/r12b_pick.png+{TURN}+{LP}+{HANDS_REF}',
           '-r12b_strum:out/r12b_pick.png+' + HANDS_REF]
print('round 1:', ' '.join(f'"{a}"' for a in ROUND1))
print('round 2a:', ' '.join(f'"{a}"' for a in ROUND2A))
print('round 2b:', ' '.join(f'"{a}"' for a in ROUND2B))
