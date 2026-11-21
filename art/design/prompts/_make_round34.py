"""Round 34: the townspeople of shot 05 a moment before their cards fall, watching her. Each is its g5_*_on drawing
(card still on) redrawn exactly with only the head and eyes turned toward her, so on the drop beat the crowd reacts:
their heads go from her to their own empty clips / up into the falling cards.
In the shot she stands in the middle: the clerk and the office woman have her to the viewer's RIGHT, everyone else has
her to the viewer's LEFT.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
KEEP = ("Redraw the attached image exactly: the same person, the same face, hair, clothes and build, the same body pose, arms and hands, the "
        "same name card on the lanyard exactly as it is, the same high camera angle looking down, the same size and position in the canvas, the same "
        "feet positions, the same single-teal printed illustration style with the same screentone dots, pure white background, nothing else in the "
        "picture. ")
side = {'g5_clerk': 'RIGHT', 'g5_officewoman': 'RIGHT', 'g5_elder': 'LEFT', 'g5_girl': 'LEFT', 'g5_salaryman': 'LEFT', 'g5_mother': 'LEFT'}
look = {
 'g5_clerk': "Change only this: her head and eyes turn toward the viewer's {s}, looking at a girl shouting over there (not drawn), startled, lips parted.",
 'g5_officewoman': "Change only this: her head and eyes turn toward the viewer's {s}, looking at a girl shouting over there (not drawn), with a cold, startled stare.",
 'g5_elder': "Change only this: his head and eyes turn toward the viewer's {s}, looking at a girl shouting over there (not drawn), with a worried, gentle look.",
 'g5_girl': "Change only this: her head and eyes turn toward the viewer's {s}, looking at a girl shouting over there (not drawn), her eyes wide.",
 'g5_salaryman': "Change only this: his head and eyes turn toward the viewer's {s}, looking at a girl shouting over there (not drawn), frowning, his card still held up in his hand.",
 'g5_mother': "Change only this: the mother and her boy both turn their heads toward the viewer's {s}, looking at a girl shouting over there (not drawn): the mother worried, the boy curious, mouth a little open.",
}
for n, body in look.items():
    open(os.path.join(here, n + '_look.txt'), 'w', encoding='utf-8').write("One illustration (portrait 2:3).\n" + KEEP + body.format(s=side[n]) + "\n")
print(len(look), 'prompts')
