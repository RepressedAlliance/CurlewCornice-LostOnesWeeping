"""Segment 16 (the ending figure, k556-k572): the close-up drawings of her (docs/分镜/16_结尾音型.md 第 5 节).
The ending mirrors frame 0: the same framing as segment 00's master r00_hold_v3 (art/cut/r00_hold_v3.png, 1536x1024, the page's
FRAMING preset), but nothing at her collar: no card, no hands, no lanyard. A short piece of the black Les Paul strap lies on her
left shoulder (viewer's right), because she is still wearing the guitar from segment 15.

  python art/design/prompts/_make_seg16.py face   -> r16_face_a/_b   (the master: r00_hold_v3 redrawn, three changes)
  python art/design/prompts/_make_seg16.py diffs  -> r16_shut_a, r16_free_a_a, r16_free_b_a  (variants of the chosen master)
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant

FLAT = (
    "Her FACE: no longer cold. A plain, still, open face looking straight into the camera, at the viewer, like the face in the "
    "second attached image (her official expression sheet, the neutral face) but looking straight at the viewer: the eyebrows LEVEL "
    "and relaxed, no crease between them, not pressed down; the eyes fully open in their normal shape (the upper lid an ordinary "
    "curve, not flat and heavy, not narrowed), both teal irises (#218EA3) whole and centred towards the camera, a dark pupil and one "
    "small catchlight each; the small mouth closed in one short flat line. Not cold, not hostile, not soft, not sad, not smiling.")
NO_LANYARD = (
    "The lanyard is GONE: no teal cords at all at her neck, collar or shirt, no card; the white shirt collar, the teal ribbon tie and "
    "the white shirt front between the blazer lapels are plain and clear, nothing hangs down her shirt but the ribbon tie.")
STRAP = (
    "A guitar strap: one plain BLACK flat strap, about as wide as two of her fingers side by side (about 5 cm), lies over her LEFT "
    "shoulder (on the VIEWER'S RIGHT side of the picture): it comes over the top of that shoulder from behind, lies on the blazer's "
    "shoulder seam and runs straight down the front of the blazer, outside the lapel, near the arm, off the bottom edge of the "
    "picture (the guitar hangs below the picture, not seen). Matte black with a thin dark outline and one hard-edged shadow tone, "
    "nothing printed on it, no buckle visible. Nothing on her other shoulder.")
FACE = ("three things: (1) " + FLAT + " (2) " + NO_LANYARD + " (3) " + STRAP +
        " Hair, bow, headband, hairclips, head shape, size and position, collar, ribbon tie, blazer, shoulders, the framing and the "
        "canvas exactly as they are, line for line. The line art one step bolder than usual, because this picture is shown full screen.")

SHUT = ("her EYES only: she has closed both eyes, calmly (not squeezed): each eye is now one gently curved closed-lid line with "
        "the eyelashes, at the height where her eyes are now; the eyebrows, mouth, face and everything else stay exactly as they "
        "are, line for line.")
FREE_A = ("her FACE only, small but clearly readable: RELIEF, as if she has just let out a long breath. The INNER ends of both "
          "eyebrows rise a little and the eyebrows soften into a gentle, slightly lowered curve (relaxed, not worried, not sad); the "
          "upper eyelids relax and come down a little, covering the top of each iris a bit, but her eyes stay open and still look "
          "straight at the viewer; the lower lids soft; the mouth relaxed, the corners level, the lips parted VERY slightly (a tiny "
          "dark gap, no teeth). No tears, no smile, no blush. Hair, bow, collar, strap, everything else exactly as it is.")
FREE_B = ("her FACE only, small but clearly readable: the smallest smile. The eyebrows soften and relax the same way (inner ends "
          "a little higher, a gentle lowered curve); the lower eyelids lifted very slightly by her cheeks, but the eyes stay OPEN, "
          "not curved into smiling arcs, still looking straight at the viewer; the corners of the closed mouth turned up only a "
          "very little. No teeth, no tears, no blush. Hair, bow, collar, strap, everything else exactly as it is.")

which = sys.argv[1] if len(sys.argv) > 1 else 'face'
w = lambda n, t: open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
if which == 'face':
    for n in ('r16_face_a', 'r16_face_b'):
        w(n, variant(FACE))
elif which == 'diffs':
    w('r16_shut_a', variant(SHUT)); w('r16_free_a_a', variant(FREE_A)); w('r16_free_b_a', variant(FREE_B))
print('ok', which)

# round 2 of the faces after k564 (2026-11-20): r16_free_a_a read right (lids and brows let go) but its bow's left loop came back
# about 15 px further left, and its lips were a thick dash; r16_free_b_a changed only the mouth (the brows and lids must change
# too, 16_结尾音型.md 第 5 节). Both again from the master, the change one step clearer for a phone screen, the bow pinned.
PIN = (" The big white bow, both its loops and the knot, the headband, the hairclips and every hair outline stay EXACTLY where they "
       "are in the first attached image, pixel for pixel; only the eyebrows, eyelids and mouth change.")
FREE_A2 = ("her FACE only, small but clearly readable even when the picture is shown small: RELIEF, as if she has just let out a "
           "long breath and let go of something. The eyebrows: their INNER ends rise a little and the whole brow softens into a gentle "
           "curve that sits a little lower and further from the eye's top line than now (relaxed, not worried, not sad, not angry). "
           "The upper eyelids: relaxed and lowered clearly, so the lid line now crosses the top quarter of each iris (heavy-lidded and "
           "calm, NOT sleepy, NOT closed); the eyes still look straight at the viewer. The mouth: the same small closed mouth, one "
           "thin short line, the corners level, NOT a thick dash. No tears, no smile, no blush." + PIN)
FREE_B2 = ("her FACE only, small but clearly readable even when the picture is shown small: the smallest smile. The eyebrows soften "
           "exactly the same way as in relief (inner ends a little higher, a gentle curve sitting a little lower); the upper eyelids "
           "relax a little; the LOWER eyelids are lifted slightly by her cheeks, so the eyes are a little narrower from below, but the "
           "eyes stay OPEN, NOT curved into smiling arcs, still looking straight at the viewer; the corners of the small closed mouth "
           "turn up only a very little. No teeth, no tears, no blush." + PIN)
if which == 'diffs2':
    w('r16_free_a_b', variant(FREE_A2)); w('r16_free_a_c', variant(FREE_A2)); w('r16_free_b_b', variant(FREE_B2))
    print('ok diffs2')

# round 4 (2026-11-20, after the blind review of the two samples): the start face was the wrong one. Frame 0 / 00 k7 is a COLD
# GLARE (r00_hold_v3); the ending must start from that glare so that k564's release has somewhere to fall from (a flat open face
# relaxing a little read as "she blinked" on a phone). New master r16_glare = r16_face (no lanyard, strap, same framing) with
# only the face changed back to the glare of r00_hold_v3 (second reference). r16_face itself, drawn from the same lineage, is then
# the released face; r16_open2 is an alternative release drawn from the new master.
GLARE = ("her FACE only: put back the cold, hard glare of the SECOND attached image (the same girl, same framing), exactly as it is "
         "drawn there: the eyebrows pressed DOWN and drawn together, the inner ends low with two short crease strokes between them; "
         "the upper eyelids FLAT and heavy, a straight dark line cutting across the top of each iris so the eyes are narrowed; both "
         "teal irises (#218EA3) looking straight into the camera, at the viewer; the small mouth pressed into one short flat line. "
         "Take ONLY the face from the second image: NOT its teal lanyard cords (there are none in this picture), not its shoulders or collar. Cold, guarded, staring us down. The eyes stay at exactly the same height and spacing as in the first image." + PIN)
SHUT2 = ("her EYES only: she closes both eyes, calmly, not squeezed: each eye becomes one gently curved closed-lid line with the "
         "eyelashes, at the height of the eye's top line now. The eyebrows STAY pressed down and drawn together exactly as they are, "
         "with the same crease strokes; the mouth stays exactly as it is." + PIN)
OPEN2 = ("her FACE only, clearly readable even when the picture is shown very small: she has let go. The eyebrows are no longer "
         "pressed down: the crease strokes between them are GONE, both brows rise back to a level, relaxed, gently curved line with "
         "clear space above the eyes (the inner ends a little higher than the outer ends, not worried, not sad); the upper eyelids "
         "open back to their natural curved shape, no longer flat, so each whole teal iris shows with a little white above the lower "
         "lid, but the eyes are calm, not wide or surprised; still looking straight at the viewer; the lower lids soft; the mouth the "
         "same small closed short line, the corners level. No smile, no tears, no blush." + PIN)
if which == 'v4':
    w('r16_glare_a', variant(GLARE)); w('r16_glare_b', variant(GLARE))
    print('ok v4')
elif which == 'v4diffs':
    w('r16_shut2_a', variant(SHUT2)); w('r16_shut2_b', variant(SHUT2)); w('r16_open2_a', variant(OPEN2)); w('r16_open2_b', variant(OPEN2))
    print('ok v4diffs')
