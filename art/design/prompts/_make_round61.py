"""Round 61: her face for the 2D punchline (どれも不正解というオチでした): a bust, in daylight, a stiff self-mocking smile with
empty eyes. Drawn from the face master (rface_mb2) under the LARGE rule; three candidates."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full
BODY = (
    "One illustration (portrait 2:3). A bust of her, from the middle of the chest up, facing the camera straight on, the camera at her "
    "eye height. She has just been told every answer was wrong: she smiles stiffly, the corners of her small mouth pulled up, while her "
    "eyes are dull and half-lidded and look a little past the viewer, a self-mocking smile with nothing behind it. Her hands are not in "
    "the picture. Her face is the face in the second attached image (her face master): the same eyes, mouth and nose, with this "
    "expression. Her whole head, hair and bow are inside the picture with a little space above the bow; the blazer, white collar, teal "
    "ribbon tie and the teal lanyard with her name card run off the bottom edge. Plain flat daylight from the upper left: one hard-edged "
    "shadow tone, no rim light, no glow, no pale line along the outline.")
for name in ('rface_ochi_a', 'rface_ochi_b', 'rface_ochi_c'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(full(BODY, large=True, night=False) + "\n")
print('3 prompts')
