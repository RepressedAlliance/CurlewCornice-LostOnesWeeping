"""Segment 12 round 4 (2026-11-21, after the independent review of the finished segment): S4 and S5 re-framed.

The review: S4 showed her as a 45 px pair of eyes in a 60 px slit with 37 px hands (phone); S5 carried the chorus climax
with a full figure whose face was 90 px and cut by six slits. Both are re-framed so she is the subject:
  S4  the camera is close on the slit and panel 3: the slit opens wide enough to show her face from the brows to the
      clenched teeth (face ~440 px on screen), her two hands come through the paper TOWARDS the camera (forearm
      foreshortened, not lying flat on the paper: review nice 6) and pinch the printed rings.
  S5  waist-up behind the torn stack: the middle tear parts wide around her face (face ~360 px on screen).

New drawings (all with a transparent background, written without _style.txt):
  - r12_strain_close   (master) S4: head and shoulders, close, bowed a little, eyes DOWN, brows knitted, teeth clenched.
  - r12_strain_close_b r12_strain_close, eyes shut with the effort: plain closed lids (review nice 7: no >< comic marks).
  - h12_pry2_l         (master) S4: her LEFT forearm coming straight out at the camera, the hand turned to the viewer's left,
                       thumb and index pinching.
  - h12_pry2_r         its pair (right hand, mirror).
  - r12_bust_play      (master) S5: waist-up, playing, looking down at her strumming hand, face in the centre.
  - r12_bust_shout_a   r12_bust_play, head and right arm: eyes shut, shouting, the strum just gone down.
  - r12_bust_shout_b   r12_bust_play, head and right arm: head back, shouting up, the right arm swung up.
usage: python art/design/prompts/_make_seg12_r4.py   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant
from _make_seg12_r3 import LIGHT, ALPHA, GUITAR, CARD, MOUTH  # noqa: E402  (same night, same guitar, same card)

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
STRAIN = '../cut/r12_strain2.png'
PRY = '../cut/h12_pry_l.png'
COLD = '../cut/r12_play_cold.png'

CLOSED = ("each closed eye drawn as ONE clean, gently curved dark line following the lower edge of the eye (the upper lashes "
          "resting on it), the same width as the open eye; NO '><' or chevron marks, NO comic strain lines, no tears")

R_STRAIN_CLOSE = "\n".join([
    IDENTITY,
    "One illustration for a film CLOSE-UP, landscape canvas 3:2. HEAD AND SHOULDERS: from just above the top of her bow down to the "
    "middle of her chest; the bottom edge of the canvas cuts straight across her chest. Camera exactly at her eye height, straight on, "
    "long lens: no high or low angle, shoulders level.",
    "She STRAINS with all her strength: both arms reach forward and DOWN in front of her, out of the picture at the bottom edge (the "
    "hands are NOT in the picture), the shoulders raised and tense, the upper body leaning a little towards the viewer. Her head is "
    "bowed a little and her eyes look DOWN and forward at something just in front of her below the picture, NOT at the viewer: the "
    "upper eyelids lowered over the top third of each eye, the teal irises at the bottom of the eyes. The brows knitted hard, pulled "
    "down and together; the teeth clenched, the lips drawn back a little to show the clenched teeth. Stubborn effort, not pain, not "
    "fear. Dry face, no tears, no sweat.",
    "The teal lanyard runs down from her collar out of the picture (the card is below the picture). No guitar in the picture.",
    "Placement: her face in the CENTRE of the canvas horizontally; the eyes at about 46% of the canvas height; the face from cheek to "
    "cheek about 36% of the canvas width. The bow loops just below the top edge; nothing of her head crosses the top, left or right edge.",
    "The second attached image is the same girl in the same moment (her expression and the pose of the shoulders): draw it again much "
    "closer. Draw the face as simply as the enlarged sheet faces.",
    DRAW, SHEET_RULE, LIGHT, LARGE, NEVER, ALPHA])

R_STRAIN_CLOSE_B = variant(
    "her EYES and BROWS only: the eyes are now SHUT tight with the effort, " + CLOSED + "; the brows pressed a little lower and harder "
    "together. The mouth (the clenched teeth), the head, the hair, the bow and everything else exactly as in the first attached image.")

H_PRY2_L = "\n".join([
    "One illustration for a film insert, landscape canvas 3:2: ONLY the LEFT forearm and hand of the girl of the first attached image "
    "(Kagamine Rin, 14, slim; the turnaround), nothing else of her. Camera straight on, eye level, long lens.",
    "Her left forearm comes STRAIGHT OUT TOWARDS THE VIEWER (as if through a hole in a sheet of paper in front of her; the paper and "
    "the hole are NOT drawn): so we look almost straight into the END of her charcoal-grey blazer sleeve, which shows as a short, wide, "
    "strongly foreshortened tube (its opening an oval facing us), with the white shirt cuff a ring just inside it. The sleeve tube is "
    "in the RIGHT part of the canvas, its far end (towards her elbow) fading straight back away from us, cut off by nothing: the sleeve "
    "is short because we see it end-on. From the cuff her wrist bends and the hand reaches to the viewer's LEFT: we see the BACK of the "
    "hand, the thumb and index finger PINCH hard together at their tips (gripping the thick edge of a flat ring right in front of "
    "her), the middle, ring and little fingers curled tight. Tense, determined grip.",
    "Size: from the far edge of the sleeve to the fingertips about 60% of the canvas width. Nothing crosses an edge of the canvas.",
    "Drawing: the same hand as the turnaround and the second attached image: clean modern Japanese anime illustration, crisp even "
    "dark-grey outlines, flat colours with exactly one hard-edged shadow tone, simple shapes, few inner lines, no gradients, no blur, "
    "no texture. Skin the warm light skin of the turnaround, lit by a cool white fluorescent light from above (flat, one shadow tone). "
    "The inside of the sleeve opening is a flat dark charcoal.",
    HANDS, NEVER, ALPHA])

H_PRY2_R = "\n".join([
    "Redraw the forearm and hand of the first attached image as its pair: the same girl's RIGHT forearm and hand, the exact MIRROR "
    "image of the first attached image: the forearm comes straight out towards the viewer, the foreshortened blazer sleeve (seen "
    "end-on, its opening an oval facing us, the white shirt cuff a ring inside it) in the LEFT part of the canvas, the wrist bending so "
    "the hand reaches to the viewer's RIGHT; we see the BACK of her right hand; thumb and index pinching hard at their tips, the other "
    "three fingers curled tight. The same size, the same drawing, line weight, colours and lighting as the first attached image.",
    HANDS, NEVER, ALPHA])

R_BUST_PLAY = "\n".join([
    IDENTITY,
    "One illustration for a film shot, landscape canvas 3:2. WAIST-UP: from just above the top of her bow down to her hips; the bottom "
    "edge of the canvas cuts across her hips and the guitar body. Camera exactly at her eye height, straight on, long lens: no high or "
    "low angle, shoulders level.",
    "She stands facing the viewer (front view) and plays the guitar: it hangs on its strap across her body, the body low at her right "
    "hip (viewer's LEFT, partly cut by the bottom edge), the neck rising to the viewer's RIGHT at about 20 degrees, the headstock inside "
    "the canvas; her RIGHT hand strums over the pickups with a small cream pick, her LEFT hand frets a chord on the neck. Her head is "
    "bowed a little and her eyes look DOWN at her strumming right hand (not at the viewer); the mouth closed; cold and intent.",
    CARD,
    GUITAR,
    "The second attached image shows the same girl, the same guitar and the same night in another shot (her face, the hold): only as a "
    "reference, do not copy its framing or its stare.",
    "Placement: her face exactly in the horizontal centre of the canvas; the eyes at about 36% of the canvas height; the face from "
    "cheek to cheek about 24% of the canvas width. The bow loops just below the top edge. Nothing of her head, arms or the headstock "
    "crosses the top, left or right edge.",
    DRAW, SHEET_RULE, LIGHT, LARGE, HANDS, NEVER, ALPHA])

R_BUST_SHOUT_A = variant(
    "her HEAD and her RIGHT arm only. Head: the SAME SIZE as in the first attached image (bow, hair and face exactly as big), tipped a "
    "little forward and down, and she SHOUTS with her eyes shut tight (" + CLOSED + "), the mouth wide open (upper teeth visible; " +
    MOUTH + "), the brows pulled down hard. Right arm: the hand has just struck down through the strings and is now just below the "
    "strings past the bridge, the pick still in it. She does not look at the viewer. Her body, shoulders, left hand, the card, the "
    "guitar and the strap do not move at all: they must lie exactly on the first attached image.")

R_BUST_SHOUT_B = variant(
    "her HEAD and her RIGHT arm only. Head: the SAME SIZE as in the first attached image, thrown BACK, the face tilted up towards the "
    "ceiling (we see under her chin a little), shouting upwards with the mouth wide open (" + MOUTH + "), eyes shut (" + CLOSED + "). "
    "Right arm: having struck the strings, it is swung UP and out to the viewer's LEFT, the hand with the pick at the height of her "
    "ear, still INSIDE the canvas, drawn simply. Her body, shoulders, left hand, the card, the guitar and the strap do not move at "
    "all: they must lie exactly on the first attached image.")

# S3 k387: r12c_shout_a -> r12c_shout_b jumps (the head ~15 % bigger and the side hair flung out in one frame; review nice 8).
# The in-between, drawn from both keys at once, held half a beat (k387 - k387.5) as Demo 2's in-betweens.
R_SHOUT_AB = ("Draw the IN-BETWEEN of the first two attached images (the same girl, the same frame, the same guitar): exactly halfway "
              "from the first to the second. The head halfway forward (its size and position exactly halfway between the two), the "
              "mouth halfway between the two shouts (" + MOUTH + "), the brows and the glaring eyes halfway, still looking straight "
              "at the viewer; the hair at both sides of the face halfway between lying down (first) and flung out (second). Her "
              "shoulders, arms, hands, the guitar, the strap and the card do not move at all: they lie exactly on the first attached "
              "image. Keep the same canvas, framing, line work, colours and lighting, and the fully TRANSPARENT background (PNG alpha). "
              + NEVER)

PROMPTS = {'r12c_shout_ab': R_SHOUT_AB, 'r12_strain_close': R_STRAIN_CLOSE, 'r12_strain_close_b': R_STRAIN_CLOSE_B, 'h12_pry2_l': H_PRY2_L,
           'h12_pry2_r': H_PRY2_R, 'r12_bust_play': R_BUST_PLAY, 'r12_bust_shout_a': R_BUST_SHOUT_A,
           'r12_bust_shout_b': R_BUST_SHOUT_B}
if __name__ == '__main__':
    for n, t in PROMPTS.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
    R1 = [f'-r12_strain_close:{TURN}+{STRAIN}+{FACES}', f'-h12_pry2_l:{TURN}+{PRY}+{HANDS_REF}', f'-r12_bust_play:{TURN}+{COLD}+{LP}+{FACES}+{HANDS_REF}']
    R2 = ['-r12_strain_close_b:out/r12_strain_close.png+' + FACES, '-h12_pry2_r:out/h12_pry2_l.png+' + HANDS_REF,
          '-r12_bust_shout_a:out/r12_bust_play.png+' + FACES, '-r12_bust_shout_b:out/r12_bust_play.png+' + FACES]
    print('round 1:', ' '.join(f'"{a}"' for a in R1))
    print('round 2:', ' '.join(f'"{a}"' for a in R2))
