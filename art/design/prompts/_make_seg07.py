"""Segment 07 (前副歌1, docs/分镜/07_前副歌1.md) sample drawings for the two endings of section 3.3 (k179-k199).

Her room seen from outside the window (an orthographic elevation, eye level): she sits on the bed under the window, her back
against a big pillow at the left wall, hugging her knees, facing screen RIGHT (profile). The window sill hides her from the
knees down; the film shows only what is above the sill.
  - r07_sit   (master)   profile, chin on knees, eyes half down
  - r07_look  (r07_sit with one change: the head lifts off the knees and turns towards the window = the viewer, 3/4 face,
               looking past the camera, up and to the camera's left)
  - r07_say   (r07_look with one change: lips parted as if saying it, brows eased, upper lids a little raised)       [design 甲]
  - r07_open  (new master from r07_look: her right hand reaches forward-right to the window sash and pushes it open) [design 乙]
  - p07_lespaul  the gold Les Paul standing in a guitar stand, straight front elevation (a component of the room)

Scale (fixed, so the page places every drawing of her by numbers): landscape 3:2 canvas; the bottom edge cuts across her just
below the knees, the top of the bow is close to the top edge; her back at about 22% of the width, her knees at about 60%.
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
Round 9 (version 4 of the segment): a new master r07_sit9 with her chest card showing (body three-quarters to us, knees
lower), its variants r07_look9 / r07_say9 and the in-between r07_turn9; installed as art/cut/r07b_*.png.
Round 10 (version 5): look / say redrawn at high resolution with the gaze clearly up and away (see the round-10 note).
usage: python art/design/prompts/_make_seg07.py [round]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
FACES_REF = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'

LIGHT = ("Lighting: plain, soft daylight of a small bedroom in the late afternoon, the flat colours of the turnaround, one hard-edged "
         "shadow tone per material. No rim light, no glow.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her: draw NO pillow, NO bed, NO wall, NO window, NO floor, NO "
         "shadow, no scenery at all. Every part of her fully opaque. No text, no logos. No red anywhere.")
SIT_FRAME = (
    "Framing and scale (important: the film places this drawing by measurement and hides her lower body behind a window sill): "
    "LANDSCAPE canvas 3:2. Camera exactly level with her face, straight from her side (a pure side view of the body), long lens, no "
    "high or low angle, no perspective distortion. The bottom edge of the canvas cuts straight across her just BELOW HER KNEES (it "
    "cuts her shins in front and her hips/lower back behind; no feet, no mattress in the picture; her body must reach the bottom "
    "edge). The top of her bow is about 5% of the canvas height below the top edge. Her back is at about 22% of the canvas width from "
    "the left edge and the front of her knees at about 60%; the right third of the canvas is EMPTY (transparent). Draw her as large as "
    "this framing makes her: her head (without the bow) is about 38% of the canvas height.")
SIT_POSE = (
    "This drawing: she sits on her bed with her knees drawn up to her chest, hugging her shins with both arms, her back leaning "
    "against a big soft pillow behind her (the pillow is NOT drawn: her back just leans back a little, as if resting on it). She faces "
    "the viewer's RIGHT: we see her body in pure profile, her RIGHT side towards the viewer, her right arm in front wrapped round her "
    "shins with the right hand holding her left wrist in front of the shins. Her CHIN rests on top of her knees. Her face is in "
    "profile, looking to the right and a little down, eyelids half lowered, mouth closed, an empty, quiet face (not crying, no "
    "tears, not smiling). The teal lanyard round her neck runs down into the gap between her chest and her knees (the card itself is "
    "hidden there). School uniform as on the turnaround: charcoal blazer, white shirt, teal ribbon tie, charcoal pleated skirt over "
    "the thighs, black knee socks.")

R07_SIT = "\n".join([IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard round her neck"),
                     SIT_POSE, SIT_FRAME, DRAW, SHEET_RULE, LIGHT, HANDS, LARGE, NEVER, ALPHA])

LOOK = ("her HEAD lifts off her knees and turns towards the viewer: the face is now a three-quarter view turned towards us (both eyes "
        "visible, her right cheek nearer to us), the chin lifted a little above the knees; her teal eyes look PAST the camera, a little "
        "upwards and to the viewer's LEFT of the camera, as if gazing out of a window at something far away (clearly not looking into "
        "the camera). Eyes fully open, calm and a little sad, mouth closed. The bow, bangs and hair follow the head naturally. Her "
        "shoulders, both arms, hands, knees, skirt, legs and the lanyard do not move at all.")
SAY = ("her MOUTH opens a little, as if quietly saying a word out loud (a small, soft speaking mouth: lips parted, the opening about a "
       "third of the mouth's width, the upper teeth line barely visible or not at all; not shouting, not singing), her eyebrows ease a "
       "little and her upper eyelids lift slightly, as if she finally says it. The head angle, the direction of her gaze (past the "
       "camera, up and to the viewer's left), the hair, bow, shoulders, arms, hands, knees and everything else do not move.")
OPEN = ("her RIGHT arm (the arm nearest the viewer) lets go of her shins and reaches forward to the viewer's RIGHT, nearly straight, "
        "at the height of her shoulders, and her right hand presses flat, palm forward, fingers up, against an UNDRAWN vertical window "
        "frame a little in front of her knees: the hand at about 62% of the canvas width and 40% of the canvas height, as if sliding a "
        "window open to her right. The blazer sleeve and white shirt cuff follow the arm. Her LEFT arm still hugs her shins; her knees, "
        "skirt and legs do not move. Her head and face stay EXACTLY as they are (three-quarter towards us, looking past the camera, up "
        "and to the viewer's left), mouth closed. Draw nothing under or around the hand: no window, no frame, no glass.")

LESPAUL = "\n".join([
    "One prop drawing for a film: the gold-top electric guitar of the first attached image (this film's Les Paul set sheet; match its "
    "front view exactly: gold top, two cream P-90 pickups, cream pickguard, one silver bar bridge, four gold top-hat knobs on the lower "
    "side, the three-way switch on the upper side, black headstock face with NO logo or text, 3+3 tuners with cream buttons, rosewood "
    "fretboard with cream binding and trapezoid inlays), standing upright in a simple black A-frame floor guitar stand.",
    "View: a strict FRONT elevation, straight on, at the height of the guitar's middle, no perspective: the guitar stands vertically, "
    "headstock UP, its gold front facing the viewer, very slightly leaning back into the stand (the lean is invisible from the front). "
    "The stand: two thin black tubular legs splayed in an A behind and below the body, a black padded cradle under the bottom of the "
    "body, and a black neck yoke holding the neck just below the headstock on a thin black upright pole behind the neck.",
    "Portrait canvas 2:3. The whole guitar and stand fill the canvas height with a small margin: the headstock top about 4% below the "
    "top edge, the stand's feet about 3% above the bottom edge, centred horizontally. The black strap is NOT attached.",
    "Drawing: clean modern Japanese anime prop design, crisp even dark-grey outlines, flat colours with exactly one hard-edged shadow "
    "tone per material, a tiny hard highlight on metal only, no gradients, no blur, no texture, no glow.",
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the guitar and the stand: no floor, no shadow, no wall. No text, no "
    "logos, no watermark. No red anywhere."])

# round 8 (full segment, after the blind review of the samples): the k194 change must read on a phone in the medium shot,
# so the speaking mouth opens one step more and the brows lift a little more; everything else is r07_say line for line
SAY2 = ("her MOUTH opens one step wider than it is now, as if clearly saying a word out loud to someone outside: the lips parted "
        "into a soft rounded opening about HALF as tall as the mouth is wide, the inside of the mouth one flat dark muted brownish grey "
        "(about #5E4645, NOT red, NOT pink), a small flat tongue shape at the bottom in a slightly lighter muted tone is allowed, no "
        "teeth drawn; not shouting, not singing, not a scream. Her eyebrows lift a little more at their inner ends and her upper "
        "eyelids open a little more, as if she finally says it. The head angle, the direction of her gaze (past the camera, up and "
        "to the viewer's right), the hair, bow, shoulders, arms, hands, knees and everything else do not move.")

# round 9 (full-segment review, 2026-11-20): her chest card is the film's thread (審査後改定 15) and must show in all her drawings
# here, so a NEW master: the same room pose (on the bed, back against the pillow, knees up, arms round the shins) with the body
# turned three-quarters to the viewer so the card hangs visible on her chest above the knees. The card face is drawn plain
# white: the page lays the card face (読み取れません / ロストワン / の号哭, card.js) onto it by its measured corners.
SIT9_POSE = (
    "This drawing: she sits on her bed, her back leaning against a big soft pillow behind her (the pillow is NOT drawn: her back just "
    "leans back a little, as if resting on it). Her knees are drawn up in front of her and both arms are wrapped loosely round her "
    "shins, her hands clasped in front of the shins. Her BODY is turned three-quarters towards the viewer and to the viewer's RIGHT: we "
    "see her front and her right side, her knees towards the viewer's right. Her knees are LOW enough that her whole chest is visible "
    "above them: the tops of her knees are at about the height of her elbows, well below her chin. Her head is bowed a little and turned "
    "to the viewer's RIGHT, the face in profile, looking to the right and a little down, eyelids half lowered, mouth closed, an empty, "
    "quiet face (not crying, no tears, not smiling). The thin teal lanyard goes round her neck and down the front of her shirt to a "
    "small clip, and her NAME CARD hangs from the clip flat on the front of her chest, above her knees, fully visible and not covered "
    "by her arms, hair or knees: a LANDSCAPE card about as wide as her face is wide, in a thin clear plastic holder, its face turned "
    "towards the viewer (seen three-quarters, like her chest). The card's face is PLAIN, FLAT, PURE WHITE with NOTHING printed or "
    "written on it (no lines, no boxes, no text, no ovals): just a white rectangle with slightly rounded corners and a thin grey "
    "outline. School uniform as on the turnaround: charcoal blazer (open at the front), white shirt, teal ribbon tie, charcoal pleated "
    "skirt over the thighs, black knee socks.")
SIT9_FRAME = (
    "Framing and scale (important: the film places this drawing by measurement and hides her lower body behind a window sill): "
    "LANDSCAPE canvas 3:2. Camera exactly level with her face, long lens, no high or low angle, no perspective distortion. The bottom "
    "edge of the canvas cuts straight across her just BELOW HER KNEES (it cuts her shins and her hips; no feet, no mattress in the "
    "picture; her body must reach the bottom edge). The top of her bow is about 4% of the canvas height below the top edge. Her figure "
    "fills the LEFT 62% of the canvas: her back at about 12% of the width from the left edge, the front of her knees at about 62%; the "
    "right part of the canvas is EMPTY (transparent). Draw her as large as this framing makes her: her head (without the bow) is about "
    "36% of the canvas height.")
R07_SIT9 = "\n".join([IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard with her name card (plain white face) in a clear holder"),
                      SIT9_POSE, SIT9_FRAME, DRAW, SHEET_RULE, LIGHT, HANDS, LARGE, NEVER, ALPHA])
LOOK9 = ("her HEAD lifts and turns towards the viewer: the face is now a three-quarter view turned towards us (both eyes visible, her "
         "right cheek nearer to us), the chin lifted a little; her teal eyes look PAST the camera, a little upwards and to the viewer's "
         "LEFT of the camera (the irises sit towards the viewer's LEFT side of each eye), as if gazing out of a window at something far "
         "away (clearly not looking into the camera). Eyes open, calm and a little sad, mouth closed. The bow, bangs and hair follow "
         "the head naturally. Her shoulders, both arms, hands, knees, skirt, legs, the lanyard and the plain white card do not move at "
         "all.")
SAY9 = ("her MOUTH opens, as if quietly saying a word out loud to someone far away: the lips parted into a soft opening about a third "
        "as tall as the mouth is wide, the inside of the mouth one flat dark muted brownish grey (about #5E4645, NOT red, NOT pink), no "
        "teeth drawn; not shouting, not singing, not surprised. Her upper eyelids come down a little (the eyes slightly narrower, a "
        "little low and sad) and her eyebrows ease a little at the inner ends: she finally says it, quietly, with some sadness. The "
        "head angle, the direction of her gaze (past the camera, up and to the viewer's LEFT), the hair, bow, shoulders, arms, hands, "
        "knees, the lanyard, the plain white card and everything else do not move.")
TURN9 = ("Redraw the first attached image exactly (the same figure, clothes, card, framing, size and position in the canvas, line work and "
         "colours, keep the fully TRANSPARENT background (PNG alpha)), as the IN-BETWEEN drawing of a head turn from the first attached "
         "image to the second attached image: her head is HALFWAY between the two: halfway lifted and halfway turned towards the "
         "viewer, a face between profile and three-quarter, and her eyes have already turned to look the way they look in the second "
         "image (past the camera, up and to the viewer's left). Eyes, brows and mouth are each between the two drawings, mouth closed. "
         "Shoulders, arms, hands, knees, the lanyard and the card do not move at all: line for line as in both images.")


# round 10 (2026-11-21, review of version 4, the one MUST): at the end she must read as looking OUT of the window, not at us.
# In r07b_look / r07b_say the face turns three-quarters to the viewer's right while the irises sat in the middle of the eye,
# a little to the left: the two cancel and the gaze lands on the camera, the head level and a little low. The cause is the
# prompt (LOOK9 said "past the camera, up and to the left" but nothing about where the iris sits in the eye or how far the chin
# lifts), so the drawings never moved the iris up. Now: the chin lifts ~10-15 degrees, both irises are pushed up under the upper
# lids and to the viewer's left with the eye-white showing below-right of each iris. And the end close-up (2.52x, 25 px/cm on
# screen) showed a 16 px/cm drawing enlarged 1.5x, so look and say are drawn at high resolution: the master r07b_sit's crop
# x 180..862.67, y 0..1024 (all of her that shows above the sill) enlarged 1.5x to a 1024 x 1536 canvas (24 px/cm) and
# redrawn crisp with the one change; turn is redrawn on the master's canvas from sit and the new look.
HI_BOX = (180, 0, 180 + 1024 / 1.5, 1024)          # drawing px of r07b_sit -> the 1024 x 1536 high-res canvas (x1.5)
UP_RIN = ("The first attached image is an ENLARGED, blurry low-resolution copy of a finished drawing of her (the master drawing). "
          "Redraw it as a crisp, clean drawing at full resolution: EXACTLY the same framing, size and position in the canvas (do not "
          "move, shrink or enlarge her: her shoulders, both arms, both hands, her knees, the blazer, the lanyard, the clip and the "
          "plain white card in its holder, and the cut of the bottom edge all stay exactly where they are in the first image), the "
          "same clothes, the same flat colours and the same line work, keep the fully TRANSPARENT background (PNG alpha). Every line "
          "clean, sharp and even at this size, as if drawn for this size; nothing blurry, nothing soft. ")
GAZE10 = ("Change only her HEAD and EYES: her head LIFTS: the chin comes UP by about 15 degrees (the face tilts up: we see a little "
          "of the underside of her jaw and chin, the neck a little longer, the eyes a little higher in the face than in the master), "
          "and the head turns towards the viewer to a three-quarter view (both eyes fully visible, her right cheek nearer to us, the "
          "face still turned a little to the viewer's RIGHT). She gazes UP and far away, out of a window, over and past the viewer: "
          "in BOTH eyes the teal iris is pushed hard UP and to the viewer's LEFT, into the upper-left corner of the eye, the top of "
          "each iris tucked UNDER the upper eyelid line, and a clear area of white eye shows BELOW the iris and to the RIGHT of it "
          "(viewer's right) in both eyes. Her gaze must clearly NOT meet the viewer: it goes above and to the left of the camera, "
          "towards the sky. Eyes open, calm and a little sad, the eyebrows soft and level (NOT frowning, NOT knitted), mouth closed, "
          "a quiet face. The bow, bangs and hair follow the lifted head naturally.")
LOOK10 = UP_RIN + GAZE10
SAY10 = ("Redraw the first attached image exactly: the same figure, face, hair, bow, clothes, the same framing, size and position in "
         "the canvas, the same line work, colours and lighting, keep the fully TRANSPARENT background (PNG alpha). Change only this: "
         "her MOUTH opens, as if quietly saying a word out loud to someone far away: the lips parted into a soft opening about a third "
         "as tall as the mouth is wide, the inside of the mouth one flat dark muted brownish grey (about #5E4645, NOT red, NOT pink), "
         "no teeth drawn; not shouting, not singing, not surprised; her eyebrows lift a little at their INNER ends (a quiet, low, sad "
         "look). The lifted head, the direction of her gaze (BOTH irises pushed up under the upper lids and to the viewer's LEFT, "
         "white eye showing below-right of each iris: looking up and away over the viewer, NOT at the viewer), the hair, bow, "
         "shoulders, arms, hands, knees, the lanyard, the plain white card and everything else do not move, line for line.")
TURN10 = ("Redraw the first attached image exactly (the same figure, clothes, card, framing, size and position in the canvas, line "
          "work and colours, keep the fully TRANSPARENT background (PNG alpha)), as the IN-BETWEEN drawing of a head turn from the "
          "first attached image to the second attached image (the second is the same canvas): her head is HALFWAY between the two: "
          "halfway lifted (the chin halfway up) and halfway turned towards the viewer, a face between profile and three-quarter; "
          "her eyes have already turned the way they look in the second image (both irises up and to the viewer's left, looking up "
          "and away, NOT at the viewer). Eyes, brows and mouth are each between the two drawings, mouth closed. Shoulders, arms, "
          "hands, knees, the lanyard and the card do not move at all: line for line as in both images.")
# the first two in-betweens came back about 80% of the way to the look (the eyes 50 of the 63 px up): this says how far
# (the next two came back on a PORTRAIT canvas, squeezed: the canvas is now spelled out)
TURN10H = "The output canvas is LANDSCAPE 3:2 (1536 x 1024 px), exactly the canvas of the first attached image; never portrait, never squeezed. " + TURN10 + (" EXACTLY HALFWAY, not most of the way: the eyes sit about midway in height between where they are in the first "
                    "image and where they are in the second (about 30 px higher than in the first image and 30 px lower than in the "
                    "second); the face is turned only half as far towards the viewer as in the second image (the far eye partly "
                    "hidden behind the nose line, narrower than in the second image); the chin still a little low, not yet lifted.")

# (those came back squeezed onto a portrait canvas again: Codex keeps the canvas of a portrait reference.) So the in-between is
# drawn on the high-res canvas too, like look and say: from the enlarged master crop and the high-res look, both 1024 x 1536.
TURN10P = (UP_RIN + "This crisp redraw is the IN-BETWEEN drawing of a head turn from the first attached image to the second attached "
           "image (the second is the finished drawing at the same canvas, framing and size): her head is EXACTLY HALFWAY between the "
           "two, not most of the way: halfway lifted (the chin halfway up, the eyes midway in height between the two drawings) and "
           "turned only half as far towards the viewer as in the second image (the far eye narrower than in the second image, "
           "partly behind the line of the nose); her eyes have already turned the way they look in the second image (both irises up "
           "and to the viewer's LEFT, looking up and away, NOT at the viewer). Eyes, brows and mouth are each between the two "
           "drawings, mouth closed. Shoulders, arms, hands, knees, the lanyard and the card do not move at all: line for line as in "
           "both images.")


def board10():
    """the master's crop enlarged to the high-res canvas (the blurry copy Codex redraws) -> art/design/board/seg07/"""
    from PIL import Image
    d = os.path.join(here, '..', 'board', 'seg07'); os.makedirs(d, exist_ok=True)
    im = Image.open(os.path.join(here, '..', '..', 'cut', 'r07b_sit.png')).convert('RGBA')
    im.transform((1024, 1536), Image.Transform.EXTENT, HI_BOX, Image.Resampling.BICUBIC).save(os.path.join(d, 'r07c_sit_up.png'))


def to_master_canvas(src, dst):
    """a high-res drawing put back on the master's 1536 x 1024 canvas (for the in-between's reference and swap_check)"""
    from PIL import Image
    im = Image.open(src).convert('RGBA').resize((round(1024 / 1.5), 1024), Image.Resampling.LANCZOS)
    c = Image.new('RGBA', (1536, 1024), (0, 0, 0, 0)); c.paste(im, (HI_BOX[0], 0)); c.save(dst)


NL = chr(10)


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':
        for suf in ('a', 'b'):
            write(f'r07_sit_{suf}', R07_SIT); out.append(f"-r07_sit_{suf}:{TURN}+{HANDS_REF}+{FACES_REF}")
        write('p07_lespaul', LESPAUL); out.append(f"-p07_lespaul:{LP}")
    elif rnd == '2':      # from the chosen master: python _make_seg07.py 2 <master name>
        m = sys.argv[2]
        for suf in ('a', 'b'):
            write(f'r07_look_{suf}', variant(LOOK) + "\n" + LARGE); out.append(f"-r07_look_{suf}:out/{m}.png+{TURN}+{FACES_REF}")
    elif rnd == '3':      # from the chosen look: python _make_seg07.py 3 <look name>
        m = sys.argv[2]
        write('r07_say', variant(SAY) + "\n" + LARGE); out.append(f"-r07_say:out/{m}.png+{TURN}+{FACES_REF}")
        write('r07_open', variant(OPEN) + "\n" + HANDS + "\n" + LARGE); out.append(f"-r07_open:out/{m}.png+{TURN}+{HANDS_REF}+{FACES_REF}")
    elif rnd == '8':      # from the cut r07_say: a wider speaking mouth (two tries)
        for suf in ('g', 'h'):
            write(f'r07_say_{suf}', variant(SAY2) + "\n" + LARGE); out.append(f"-r07_say_{suf}:../cut/r07_say.png+{TURN}+{FACES_REF}")
    elif rnd == '9':      # new master with the card showing (two tries)
        for suf in ('a', 'b'):
            write(f'r07_sit9_{suf}', R07_SIT9); out.append(f"-r07_sit9_{suf}:{TURN}+{HANDS_REF}+{FACES_REF}")
    elif rnd == '9b':     # from the chosen master: python _make_seg07.py 9b <master name>
        m = sys.argv[2]
        for suf in ('a', 'b'):
            write(f'r07_look9_{suf}', variant(LOOK9) + NL + LARGE); out.append(f"-r07_look9_{suf}:out/{m}.png+{TURN}+{FACES_REF}")
    elif rnd == '9c':     # python _make_seg07.py 9c <master name> <look name>
        m, lk = sys.argv[2], sys.argv[3]
        for suf in ('a', 'b'):
            write(f'r07_say9_{suf}', variant(SAY9) + NL + LARGE); out.append(f"-r07_say9_{suf}:out/{lk}.png+{TURN}+{FACES_REF}")
        write('r07_turn9_a', TURN9 + NL + LARGE); out.append(f"-r07_turn9_a:out/{m}.png+out/{lk}.png+{TURN}+{FACES_REF}")
    elif rnd == '10':     # high-res look from the enlarged master crop (three tries)
        board10()
        for suf in ('a', 'b', 'c'):
            write(f'r07c_look_{suf}', LOOK10 + NL + LARGE); out.append(f"-r07c_look_{suf}:board/seg07/r07c_sit_up.png+{TURN}+{FACES_REF}")
    elif rnd == '10b':    # python _make_seg07.py 10b <look name>: say from the chosen look, turn from sit + look
        lk = sys.argv[2]
        to_master_canvas(os.path.join(here, '..', 'out', lk + '.png'), os.path.join(here, '..', 'board', 'seg07', lk + '_master.png'))
        for suf in ('a', 'b'):
            write(f'r07c_say_{suf}', SAY10 + NL + LARGE); out.append(f"-r07c_say_{suf}:out/{lk}.png+{TURN}+{FACES_REF}")
        for suf in ('a', 'b'):
            write(f'r07c_turn_{suf}', TURN10 + NL + LARGE); out.append(f"-r07c_turn_{suf}:../cut/r07b_sit.png+board/seg07/{lk}_master.png+{TURN}+{FACES_REF}")
    elif rnd == '10c':    # python _make_seg07.py 10c <look name>: the in-between again, exactly halfway
        lk = sys.argv[2]
        for suf in ('e', 'f'):
            write(f'r07c_turn_{suf}', TURN10H + NL + LARGE); out.append(f"-r07c_turn_{suf}:../cut/r07b_sit.png+board/seg07/{lk}_master.png+{TURN}+{FACES_REF}")
    elif rnd == '10e':    # python _make_seg07.py 10e <look name>: the in-between on the high-res canvas
        lk = sys.argv[2]
        for suf in ('g', 'h'):
            write(f'r07c_turn_{suf}', TURN10P + NL + LARGE); out.append(f"-r07c_turn_{suf}:board/seg07/r07c_sit_up.png+out/{lk}.png+{TURN}+{FACES_REF}")
    print(' '.join(f'"{a}"' for a in out))
