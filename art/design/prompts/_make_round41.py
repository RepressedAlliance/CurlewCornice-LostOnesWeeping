"""Round 41: the pose variants, derived from the round-40 masters (same master, one change), with the same
change prompts that made them before. Plus the salaryman's two drawings again with a man's card (card_21,
池田 大和): round 40 gave him card_22, which carries a woman's name.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
for n in ['rlow3_down', 'rlow3_fist', 'rlow3_up', 'g5_clerk_look', 'g5_elder_look', 'g5_girl_look', 'g5_mother_look', 'g5_officewoman_look']:
    body = open(os.path.join(here, n + '.txt'), encoding='utf-8').read().strip()
    open(os.path.join(here, n + '_k.txt'), 'w', encoding='utf-8').write(body + "\n")
for n in ['g1_salaryman_k', 'g5_salaryman_on_k']:
    body = open(os.path.join(here, n + '.txt'), encoding='utf-8').read().strip()
    open(os.path.join(here, n + '2.txt'), 'w', encoding='utf-8').write(body + "\n")
print('ok')
