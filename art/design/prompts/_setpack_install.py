"""Install the set-pack fixes (rounds 3 and 4, 2026-11-20) into art/canon: move each replaced sheet to archive/canon_replaced/ (never
overwriting what is already there), then write the chosen new sheet with its transparent area cleaned (tools/alpha_clean.py).
usage: python art/design/prompts/_setpack_install.py [name ...]   (no names: everything in INSTALL4, the latest round)
"""
import os, shutil, subprocess, sys

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
out = os.path.join(root, 'art', 'design', 'out')
canon = os.path.join(root, 'art', 'canon')
arch = os.path.join(root, 'archive', 'canon_replaced')

# canon path (relative to art/canon) <- chosen file in art/design/out ; old_name: the replaced file if it had another name
# round 4 (second art review, 2026-11-20): run with these names to install them
INSTALL4 = {
    'lespaul_goldtop_front_side_back.png': ('sp_lespaul_h_fit.png', None),
    'machine_big_eraser.png': ('sp_eraser_e_print.png', None),
    'card_reader_cutaway.png': ('sp_reader_i_print.png', None),
    'town/classmates_lineup_ref.png': ('sp_classmates_c.png', None),
    'rin_hand_pencil.png': ('sp_hand_k.png', None),
}
INSTALL3 = {
    'lespaul_goldtop_front_side_back.png': ('sp_lespaul_c_refit.png', None),
    'machine_big_eraser.png': ('sp_eraser_c_crop.png', None),
    'card_reader_cutaway.png': ('sp_reader_e.png', None),
    'ticket_gate_front_side.png': ('sp_gate_f.png', None),
    'gigbag_front_back_side_open.png': ('sp_gigbag_d.png', None),
    'leadholder_2mm.png': ('sp_leadholder_c_fix.png', None),
    'town/classmates_lineup_ref.png': ('sp_classmates_a.png', None),
    'town/h04_kimura_hiroshi_chief.png': ('sp_h04_kimura_v3.png', None),
    'town/p02_tanaka_misaki_officeworker.png': ('sp_p02_tanaka_v3.png', None),
    'town/p06_yamamoto_sakura_student.png': ('sp_p06_yamamoto_v3.png', None),
    'town/h02_matsumoto_aya_clerk.png': ('sp_h02_matsumoto_v3.png', None),
    'town/p07_kobayashi_yumi_and_sota.png': ('sp_p07_kobayashi_v4.png', None),
    'rin_hand_pencil.png': ('sp_hand_j.png', 'rin_hand_pencil_demo1.png'),
}

INSTALL = {**INSTALL3, **INSTALL4}           # a name in both: the round-4 choice
names = sys.argv[1:] or list(INSTALL4)
for name in names:
    new, old_name = INSTALL[name]
    if new is None:
        print('skip', name, '(no chosen file yet)')
        continue
    old = os.path.join(canon, old_name or name)
    if os.path.exists(old):
        dst = os.path.join(arch, os.path.relpath(old, canon))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        base, ext = os.path.splitext(dst)
        i = 1
        while os.path.exists(dst):
            dst = f'{base}_{i}{ext}'; i += 1
        shutil.move(old, dst)
        print('archived', os.path.relpath(old, root), '->', os.path.relpath(dst, root))
    target = os.path.join(canon, name)
    r = subprocess.run([sys.executable, os.path.join(root, 'tools', 'alpha_clean.py'), os.path.join(out, new), target],
                       capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
