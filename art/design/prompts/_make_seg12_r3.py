"""Segment 12 (副歌2, docs/分镜/12_副歌2.md 第 3 稿) drawings for the finished segment, design 甲 (after the blind review of the
samples). The sample drawings (r12_play, p12_anoko, r12_shout_a, r12_shout_b) come from _make_seg12.py.

Round 1 (masters and the one face variant that only needs a master already made):
  - r12_play_cold  r12_play redrawn, only the face: a colder, heavier-lidded stare at the viewer (review: k381 has to read as
                   "coldly staring back", well apart from the bland printed bust). Used for all of S2 (k366-k383).
  - r12_strain     (master) S4: upper body, leaning forward, arms reaching down out of the picture, head bowed, looking down,
                   brows knitted, teeth clenched. Only her brows and eyes are ever seen, through the cut-line slit.
  - h12_pry_l      (master) S4: her LEFT hand only, the back of the hand to the viewer, turned to the viewer's left, thumb and
                   index pinching hard at the tips (pinching a printed ring on the paper's face); sleeve and cuff at the wrist.
  - r12_full_play  (master) S5: whole figure, front, feet apart, playing, looking down at her strumming hand.
  - p12_bag        S5 prop: her soft gig bag, empty, slumped against the locker doors.
Round 2 (variants of the round 1 masters):
  - r12_strain_b       r12_strain, only eyes and brows: squeezed shut, brows lower.
  - h12_pry_r          the pair of h12_pry_l: her RIGHT hand, mirror pose.
  - r12_full_shout_a   r12_full_play, only head and right arm: head forward, eyes shut, shouting; the strum just gone down.
  - r12_full_shout_b   r12_full_play, only head and right arm: head thrown back, shouting up; the right arm flung up high.
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg12_r3.py      -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
BAG = '../canon/gigbag_front_back_side_open.png'
HOLD = '../cut/rmid_master.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
PLAY = '../cut/r12_play.png'

LIGHT = ("Lighting: NIGHT, she stands under one cool white fluorescent strip light that is above and a little in front of her (on "
         "top of a bank of coin lockers): flat colours slightly cooler than daylight, exactly one hard-edged shadow tone per material; "
         "no rim light, no glow, no light band along the outline, no gradients. Her bow, hairclips and shirt stay clean white.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the drawn subject: no wall, no lockers, no floor, no shadow, no "
         "frame, no scenery. Every part of the subject fully opaque, with a clean hard edge (no halo, no soft fringe, no glow). No "
         "text, no logos. No red anywhere.")
GUITAR = ("The guitar is the gold-top Les Paul of the attached guitar sheet; match it exactly: gold top, cream binding, two cream P-90 "
          "pickups, cream pickguard, one silver bar bridge, four gold knobs, black headstock with NO logo or text, 3+3 tuners with "
          "cream buttons, rosewood fretboard with cream trapezoid inlays. True size for a 152 cm girl: the whole guitar is about two "
          "thirds of her height. A plain black strap over her LEFT shoulder (viewer's right). She plays right-handed: LEFT hand on "
          "the neck, RIGHT hand at the strings with a small cream pick.")
CARD = ("Her name card hangs on the teal lanyard in front of her chest, ABOVE the guitar body, facing the viewer: a white landscape "
        "card 15 x 10 cm in a thin clear holder, its face left completely plain white (nothing printed on it), not covered.")

R_PLAY_COLD = variant(
    "her FACE only: a colder, harder stare straight at the viewer. The upper eyelids come down a little so the top edge of each teal "
    "iris is just covered: a level, heavy-lidded, unimpressed look (not sleepy, not angry, not sad). The brows straight and low, "
    "drawn slightly together. The mouth a small firm straight closed line, its corners a touch down. The eyes stay exactly where "
    "they are and the same size, still looking straight into the camera. Her body, arms, hands, the guitar, the strap, the card "
    "(still plain white), the hair and the bow do not move at all.")

R_STRAIN = "\n".join([
    IDENTITY,
    "One illustration for a film shot, landscape canvas 3:2. UPPER BODY: from the top of her bow down to her waist; the bottom edge "
    "of the canvas cuts straight across her waist. Camera exactly at her eye height, straight on, long lens: no high or low angle, "
    "shoulders level.",
    "She stands facing the viewer and STRAINS: her upper body leans a little forward, both arms reach forward and DOWN in front of "
    "her, the forearms leaving the picture at the bottom edge (her hands are NOT in the picture), the shoulders raised and tense. Her "
    "head is bowed a little and her eyes look DOWN and forward at something in front of her below the picture, not at the viewer. "
    "The brows knitted hard, pulled down and together; the teeth clenched, the lips drawn back a little to show the clenched teeth. "
    "Effort and stubbornness, not pain, not fear. Dry face, no tears.",
    "The guitar hangs on its black strap across her body, low, its body mostly below the bottom edge; the strap over her LEFT "
    "shoulder (viewer's right). " + CARD,
    "Placement in the canvas: her face in the CENTRE of the canvas horizontally (the centre of the face at 50% of the width), the "
    "eyes at about 42% of the canvas height, the face (cheek to cheek) about 20% of the canvas width; the bow loops below the top "
    "edge. Nothing of her crosses the left, top or right edge.",
    "The second attached image is the same girl on the same night (her face and colours); it gives the face only, not the pose.",
    DRAW, SHEET_RULE, LIGHT, LARGE, NEVER, ALPHA])

R_STRAIN_B = variant(
    "her EYES and BROWS only: the eyes squeezed tightly SHUT with the effort (each closed eye two strong curved lines, at most one "
    "or two short crease lines at the outer corner), the brows pulled down even lower and harder together. The mouth, the head, the "
    "hair and everything else exactly as in the first attached image.")

H_PRY_L = "\n".join([
    "One illustration for a film insert, landscape canvas 3:2: ONLY the LEFT hand and wrist of the girl of the first attached image "
    "(Kagamine Rin, 14, slim; the turnaround), nothing else of her. Camera straight on, eye level, long lens.",
    "Her left hand has come out towards the viewer through a hole in a sheet of paper (the paper and the hole are NOT drawn) and "
    "turns to the viewer's LEFT: we see the BACK of her left hand. The wrist is a little right of the centre of the canvas; the hand "
    "points to the viewer's LEFT and a little down. Her thumb and index finger PINCH hard together at their tips, as if gripping the "
    "thick edge of a flat ring that lies on a surface right in front of her; the middle, ring and little fingers curled tight into "
    "the palm. The grip is tense and determined.",
    "At the wrist: the end of her charcoal-grey school blazer sleeve with a narrow white shirt cuff just inside it; the sleeve runs "
    "back to the viewer's RIGHT and is cut off straight by the RIGHT edge of the canvas. The hand is about 55% of the canvas width "
    "from fingertips to wrist.",
    "Drawing: the same hand as the turnaround: clean modern Japanese anime illustration, crisp even dark-grey outlines, flat colours "
    "with exactly one hard-edged shadow tone, simple shapes, few inner lines, no gradients, no blur, no texture. Skin the warm light "
    "skin of the turnaround, lit by a cool white fluorescent light from above (flat, one shadow tone).",
    HANDS, NEVER, ALPHA])

H_PRY_R = "\n".join([
    "Redraw the hand of the first attached image as its pair: the same girl's RIGHT hand, the mirror image of the first attached "
    "image's pose: it has come out towards the viewer through a hole in a sheet of paper (not drawn) and turns to the viewer's RIGHT; "
    "we see the BACK of her right hand; the thumb and index finger pinch hard together at their tips as if gripping the thick edge of "
    "a flat ring lying on a surface in front of her; the other three fingers curled tight. The wrist a little LEFT of the centre of "
    "the canvas, the charcoal blazer sleeve with the white shirt cuff running back to the viewer's LEFT and cut off straight by the "
    "LEFT edge of the canvas. The same size, the same drawing, line weight, colours and lighting as the first attached image.",
    HANDS, NEVER, ALPHA])

R_FULL_PLAY = "\n".join([
    IDENTITY,
    "One illustration for a film shot, PORTRAIT canvas 2:3. Her WHOLE figure from the top of the bow to the soles of her loafers, "
    "with a small margin above and below; camera at the height of her chest, straight on, long lens: no high or low angle, "
    "shoulders level.",
    "She stands facing the viewer (front view), feet planted apart a little wider than her shoulders, both loafers flat on the floor, "
    "toes turned slightly out; legs straight. She plays the guitar: it hangs on its strap across her body, the body at her right hip "
    "(viewer's LEFT), the neck rising to the viewer's RIGHT at about 20 degrees; her RIGHT hand strums over the pickups with a small "
    "cream pick, her LEFT hand frets a chord in the middle of the neck. Her head is bowed a little and her eyes look DOWN at her "
    "strumming right hand (not at the viewer); the mouth closed; cold and intent.",
    CARD,
    GUITAR,
    "The third attached image shows how she holds this guitar (the hold only, not the drawing style, angle or face).",
    "Placement: the figure centred left to right, her face exactly at the horizontal centre of the canvas; the top of the bow about "
    "3% below the top edge; the soles about 2% above the bottom edge. Nothing of her or the guitar crosses an edge.",
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])

MOUTH = ("the inside of the mouth a dark muted grey-brown and the tongue a pale dusty beige-pink, nothing red or saturated pink")
R_FULL_SHOUT_A = variant(
    "her HEAD and her RIGHT arm only: her head is pushed forward and a little down and she SHOUTS with her eyes squeezed shut, the "
    "mouth wide open (upper teeth visible; " + MOUTH + "), the brows pulled down hard; her RIGHT hand has just struck down through "
    "the strings and is now just below the strings past the bridge, the pick still in it. She does not look at the viewer. Her legs, "
    "feet, body, left hand, the card, the guitar and the strap do not move at all: they must lie exactly on the first attached image.")
R_FULL_SHOUT_B = variant(
    "her HEAD and her RIGHT arm only: her head is thrown BACK, her face tilted up towards the ceiling, shouting upwards with the "
    "mouth wide open (" + MOUTH + "), eyes shut; her RIGHT arm, having struck the strings, is flung HIGH up and out to the viewer's "
    "left above her shoulder, the pick still in her hand, the hand drawn simply. Her legs, feet, body, left hand, the card, the "
    "guitar and the strap do not move at all: they must lie exactly on the first attached image.")

P_BAG = "\n".join([
    "One prop illustration for a film shot, landscape canvas 3:2: ONLY the soft guitar gig bag of the first attached image, EMPTY "
    "(the guitar has been taken out): unzipped along its side, the flap hanging open, slumped and sagging, its neck end folded over "
    "and drooping, leaning against a wall (the wall and floor are NOT drawn) as if dropped there. Seen straight on from the front, "
    "camera level, long lens. Charcoal black (#2E2E33) with exactly one hard-edged shadow tone, two zipped front pockets, the padded "
    "side handle, a small blank white paper tag on the handle, the inside lining a slightly lighter dark grey.",
    "Drawing: clean modern Japanese anime illustration, crisp even dark-grey outlines, flat colours, exactly one hard-edged shadow "
    "tone, simple shapes, no gradients, no blur, no texture. Lit by a cool white fluorescent light from above.",
    NEVER, ALPHA])

PROMPTS = {'r12_play_cold': R_PLAY_COLD, 'r12_strain': R_STRAIN, 'r12_strain_b': R_STRAIN_B, 'h12_pry_l': H_PRY_L,
           'h12_pry_r': H_PRY_R, 'r12_full_play': R_FULL_PLAY, 'r12_full_shout_a': R_FULL_SHOUT_A,
           'r12_full_shout_b': R_FULL_SHOUT_B, 'p12_bag': P_BAG}
for n, t in PROMPTS.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)

ROUND1 = [f'-r12_play_cold:{PLAY}+{FACES}', f'-r12_strain:{TURN}+{PLAY}+{FACES}', f'-h12_pry_l:{TURN}+{HANDS_REF}',
          f'-r12_full_play:{TURN}+{LP}+{HOLD}+{HANDS_REF}', f'-p12_bag:{BAG}']
ROUND2 = ['-r12_strain_b:out/r12_strain.png+' + FACES, '-h12_pry_r:out/h12_pry_l.png+' + HANDS_REF,
          '-r12_full_shout_a:out/r12_full_play.png+' + FACES, '-r12_full_shout_b:out/r12_full_play.png+' + FACES]
print('round 1:', ' '.join(f'"{a}"' for a in ROUND1))
print('round 2:', ' '.join(f'"{a}"' for a in ROUND2))

# Round 2 fix: r12_strain came back glaring at the viewer (S4 must not look at the camera: 改定 5). Its pose, brows and teeth
# are right, so it is redrawn with one change, the eyes.
R_STRAIN2 = variant(
    "her EYES only: she looks DOWN, not at the viewer: the upper eyelids lowered so they cover the top third of each eye, and the "
    "teal irises sit at the BOTTOM of the eyes, touching the lower lids, the gaze aimed at the ground in front of her below the "
    "picture. The brows stay knitted hard exactly as they are, the clenched teeth exactly as they are.")
R_STRAIN2_B = variant(
    "her EYES and BROWS only: the eyes squeezed tightly SHUT with the effort (each closed eye two strong curved lines, at most one "
    "or two short crease lines at the outer corner), the brows pulled down even lower and harder together. The mouth, the head, the "
    "hair and everything else exactly as in the first attached image.")
for n, t in {'r12_strain2': R_STRAIN2, 'r12_strain2_b': R_STRAIN2_B}.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
print('round 2 (fix):', '"-r12_strain2:out/r12_strain.png+../ref/sheet_faces.png"', 'then "-r12_strain2_b:out/r12_strain2.png+../ref/sheet_faces.png"')

# r12_play_cold came back with the guitar neck turned (headstock ~40 px off, 6 % outline change): the swap to r12_shout_a at
# k383 (0.9 % from r12_play) would jump. Redrawn from r12_play again with the body locked harder.
R_PLAY_COLD2 = variant(
    "ONLY the eyelids, the brows and the mouth. Upper eyelids: lowered a little so the top edge of each teal iris is just covered "
    "(a level, heavy-lidded, cold unimpressed look; not sleepy, not angry). Brows: straight and low, drawn slightly together. "
    "Mouth: a small firm straight closed line. The irises stay exactly where they are, looking straight into the camera. "
    "IMPORTANT: this is an edit of a few lines of the face only. The guitar must not move or turn at all: the neck, the "
    "headstock, the tuners, both hands, the arms, the strap, the card, the hair outline and the bow lie pixel for pixel on the "
    "first attached image.")
open(os.path.join(here, 'r12_play_cold2.txt'), 'w', encoding='utf-8').write(R_PLAY_COLD2)
open(os.path.join(here, 'r12_play_cold3.txt'), 'w', encoding='utf-8').write(R_PLAY_COLD2)

# The guitar neck turns a little in every face redraw of r12_play (three tries, 6-7 % outline change). The first r12_play_cold
# has the right face, so the two shout faces are redrawn from IT: the push into the tear lands on k383 without the neck jumping.
from _make_seg12 import R_SHOUT_A, R_SHOUT_B  # noqa: E402  (same change text as the sample's shout faces)
open(os.path.join(here, 'r12c_shout_a.txt'), 'w', encoding='utf-8').write(R_SHOUT_A)
open(os.path.join(here, 'r12c_shout_b.txt'), 'w', encoding='utf-8').write(R_SHOUT_B)
print('round 3:', '"-r12c_shout_a:out/r12_play_cold.png+../ref/sheet_faces.png"', '"-r12c_shout_b:out/r12_play_cold.png+../cut/r12_shout_b.png+../ref/sheet_faces.png"', '"-r12_strain2_b:out/r12_strain2.png+../ref/sheet_faces.png"')

# r12_full_shout_a came back with the head 19 % larger (it read "head thrust forward" as a bigger head): redrawn with the head
# size locked.
R_FULL_SHOUT_A2 = variant(
    "her HEAD and her RIGHT arm only. Head: the SAME SIZE as in the first attached image (the bow, hair and face exactly as big), "
    "tipped a little forward and down, and she SHOUTS with her eyes squeezed shut, the mouth wide open (upper teeth visible; " + MOUTH +
    "), the brows pulled down hard. Right arm: the hand has just struck down through the strings and is now just below the strings "
    "past the bridge, the pick still in it. She does not look at the viewer. Her legs, feet, body, shoulders, left hand, the card, "
    "the guitar and the strap do not move at all: they must lie exactly on the first attached image.")
open(os.path.join(here, 'r12_full_shout_a2.txt'), 'w', encoding='utf-8').write(R_FULL_SHOUT_A2)
