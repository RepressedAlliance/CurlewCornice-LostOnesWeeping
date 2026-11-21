"""The fixed rules every drawing of her is generated under, after the method that worked on 少女A
(shoujo-a-video/work/gen/prompts.py) and the checks that worked on ココロ (kokoro-pv/docs/阶段3-犯过的错.md).

- Image 1 is always her turnaround (art/design/board/rin_A2.png): the sheet decides how she is drawn.
- A drawing shown large (a close-up) also gets the sheet's own faces enlarged (art/ref/sheet_faces.png) as the last
  image, and the LARGE rule: shown big, it stays exactly as simple as the sheet.
- A drawing with a hand near the camera gets the sheet's own hands enlarged (art/ref/sheet_hands.png) and the HANDS rule.
- Every drawing gets NEVER. Words in a prompt that invite what NEVER forbids (nostrils, sweat) are not used.
- A pose or expression variant is never a new drawing: it is the master redrawn with one change (VARIANT), and it is
  checked against the master with tools/swap_check.py before it is used.
"""
SHEET = 'board/rin_A2.png'
SHEET_FACES = '../ref/sheet_faces.png'
SHEET_HANDS = '../ref/sheet_hands.png'

IDENTITY = (
    "Character: Kagamine Rin in this film's design, an ordinary 14-year-old Japanese junior-high girl, 152 cm, slim 14-year-old "
    "proportions, not chibi and not adult. Attached Image 1 is her turnaround: match it exactly. Short yellow-blonde bob with bangs; "
    "three small parallel white hairclips on the bangs on the viewer's left; one big white ribbon bow with exactly two upright loops "
    "and a small knot on a white headband; teal eyes (#218EA3); charcoal-grey school blazer with a dark emblem on the left pocket, white "
    "shirt, teal ribbon tie, a teal lanyard with her white name card in a clear holder, charcoal pleated skirt, black knee socks, brown "
    "loafers. Her face exactly as on the turnaround: large eyes, a small mouth, and the nose drawn as on the sheet: almost nothing, at "
    "most one tiny short stroke or dot."
)
DRAW = (
    "Drawing: the same hand as the turnaround: clean modern Japanese anime illustration, crisp even dark-grey outlines, flat colours "
    "with exactly one hard-edged shadow tone per material, simple shapes, few inner lines, no gradients, no blur, no texture."
)
SHEET_RULE = (
    "The turnaround decides. Stay true to it and do not improve on it: nothing it does not have. Any other attached picture only gives "
    "pose, framing and lighting unless the text says otherwise."
)
LARGE = (
    "This drawing is shown very large on screen. Her face must be the face on the turnaround and on the enlarged sheet faces (the last "
    "attached image): the same eye shape and size, the same small mouth, the same nose (at most one tiny stroke, NEVER nostrils), the "
    "same line weight. Shown big it stays exactly as simple as the sheet and adds nothing: no extra lines, no texture, no rendering, no "
    "realism, no cartoon or comedy conventions."
)
HANDS = (
    "Her hands, whenever any part of one is visible: exactly the hands on the turnaround (enlarged in the last attached image): small, "
    "slim and young, a narrow palm and wrist, thin tapering fingers with simple rounded tips, drawn as simply as her face: a clean outline, "
    "at most one simple hard-edged shadow shape, no knuckle lines, no veins, no tendons. A hand near the camera gets bigger but never "
    "more detailed. Four fingers and one thumb wherever all are in view."
)
NEVER = (
    "Must NOT have: drawn nostrils or a realistic nose; sweat drops; blush or pink cheeks; sparkles or star-shaped catchlights; hair "
    "broken into many thin strands; many fold lines on clothes; soft glow, airbrushed gradients or soft shadows; dirty lines or muddy "
    "colour; a bow with more than two loops; extra fingers; adult, large or bony hands; text, logos or watermarks."
)
NIGHT = (
    "Lighting: NIGHT under a sky of pale lit paper cards: the light comes from behind and above her, cool and pale (#cfd8d6). It shows "
    "only as a thin crisp highlight band just INSIDE the top edges of hair, shoulders and guitar, inside the dark outline: the outer "
    "outline stays the same dark grey everywhere, with no pale line or glow along or outside it. The rest of her in night shade, a little "
    "darker and cooler than daylight, still flat colours with one hard-edged shadow tone. Her bow, hairclips and shirt stay clean white "
    "(at most very slightly cool), never grey or violet."
)
ALPHA = "Fully TRANSPARENT background (PNG alpha) everywhere outside her; every part of her fully opaque."


def variant(change, keep_bg=True):
    """A variant of a master: the master redrawn with exactly one change."""
    return ("Redraw the first attached image exactly: the same figure, face, hair, bow, clothes, the same framing, size and position in "
            "the canvas, the same line work, colours and lighting" + (", keep the fully TRANSPARENT background (PNG alpha)" if keep_bg else "") +
            ". Change only this: " + change + " Everything else stays exactly as it is, line for line.")


def full(subject, large=False, hands=False, night=True, alpha=True):
    """A new drawing of her (a master): identity, subject, drawing rules, and the extra rules it needs."""
    parts = [IDENTITY, subject, DRAW, SHEET_RULE]
    if night: parts.append(NIGHT)
    if large: parts.append(LARGE)
    if hands: parts.append(HANDS)
    parts.append(NEVER)
    if alpha: parts.append(ALPHA)
    return "\n".join(parts)


def refs(large=False, hands=False, extra=()):
    """What is attached, in order: the turnaround first, then the drawings the text names, then the sheet's faces or hands."""
    out = [SHEET, *extra]
    if large: out.append(SHEET_FACES)
    if hands: out.append(SHEET_HANDS)
    return out
