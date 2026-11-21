# 已弃用：用了红色，违反全片不用红色
"""Lay out the character design boards on paper: board 1 = Rin, board 2 = line-art Rin, child Rin,
the red-pen hand and the film's palette. Images are cut out from their white backgrounds."""
import subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out' / 'stage1'
OUT.mkdir(parents=True, exist_ok=True)
CUT = ROOT / 'work' / 'boardcut'
CUT.mkdir(parents=True, exist_ok=True)
MINCHO = 'C:/Windows/Fonts/BIZ-UDMinchoM.ttc'
GOTH = 'C:/Windows/Fonts/msyh.ttc'          # Chinese labels
JP = 'C:/Windows/Fonts/YuGothM.ttc'
PAPER = (238, 233, 220)
INK = (43, 43, 48)
RED = (215, 38, 61)


def cut(src):
    dst = CUT / (Path(src).stem + '.png')
    if not dst.exists():
        subprocess.run([sys.executable, str(ROOT / 'tools' / 'cutout.py'), str(src), str(dst)], check=True, capture_output=True)
    return Image.open(dst).convert('RGBA')


def place(board, im, box, label=None, font=None, anchor_bottom=True):
    x0, y0, x1, y1 = box
    s = min((x1 - x0) / im.width, (y1 - y0) / im.height)
    im2 = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    x = x0 + (x1 - x0 - im2.width) // 2
    y = (y1 - im2.height) if anchor_bottom else y0 + (y1 - y0 - im2.height) // 2
    board.alpha_composite(im2, (x, y))
    if label:
        d = ImageDraw.Draw(board)
        w = d.textlength(label, font=font)
        d.text(((x0 + x1) / 2 - w / 2, y1 + 18), label, font=font, fill=INK)


def board_base(title, sub):
    W, H = 3840, 2160
    b = Image.new('RGBA', (W, H), PAPER + (255,))
    d = ImageDraw.Draw(b)
    d.rectangle((0, 0, W, 150), fill=RED)
    d.text((80, 36), title, font=ImageFont.truetype(MINCHO, 72), fill=(246, 243, 234))
    d.text((80 + d.textlength(title, font=ImageFont.truetype(MINCHO, 72)) + 50, 58), sub, font=ImageFont.truetype(GOTH, 40), fill=(246, 243, 234))
    return b, d


def board1():
    b, d = board_base('鏡音リン　人物設定', '《ロストワンの号哭》MV　第一阶段')
    f = ImageFont.truetype(GOTH, 38)
    A = ROOT / 'art' / 'design'
    row = [(A / 'sheet' / 'sheet_front.png', '正面'), (A / 'sheet' / 'sheet_side.png', '侧面'), (A / 'sheet' / 'sheet_back.png', '背面'),
           (A / 'out' / 'rin_stand_clean_b.png', '站姿（3D 镜头用）'), (A / 'sheet' / 'sheet_guitar.png', '扫弦（最终副歌）'), (A / 'sheet' / 'sheet_gigbag.png', '背琴包')]
    x = 70
    widths = [520, 420, 520, 560, 820, 620]
    for (p, lab), w in zip(row, widths):
        place(b, cut(p), (x, 200, x + w, 1270), lab, f)
        x += w + 40
    # expressions: one sheet, already on white; trim and place
    ex = cut(A / 'sheet' / 'sheet_expr.png')
    place(b, ex, (70, 1480, 70 + 1520, 2110), None, f, anchor_bottom=False)
    d.text((80, 1410), '表情：空白、冷视、怒吼、无声地哭、疲惫、带泪的笑', font=f, fill=INK)
    # same drawing, two states
    m = cut(A / 'out' / 'portrait_master_a.png'); c = cut(A / 'out' / 'portrait_colorunder_a.png')
    place(b, m, (1700, 1490, 2180, 2030), '线稿（同学们）', f)
    place(b, c, (2200, 1490, 2680, 2030), '上色（她）', f)
    d.text((1710, 1410), '同一张画：只有她被“画完”了', font=f, fill=INK)
    notes = ['官方基础设定：金色短发、白色大蝴蝶结与发带、白色发夹、', '碧青色眼 #218EA3、14 岁、152 cm', '本片服装：藏青冬季水手服；红领巾＝「首の輪」，越系越紧，', '最后被她扯开', '左手食指创可贴、右袖口墨迹；吉他 Les Paul（金色面板）',
             '画法：铅笔质感的细线、平涂、每种颜色一档硬阴影，', '头发成大块、衣褶少；不用渐变和高光']
    y = 1490
    for n in notes:
        d.text((2800, y), n, font=ImageFont.truetype(GOTH, 34), fill=INK); y += 62
    b.convert('RGB').save(OUT / '人设_铃.png', quality=95)


def board2():
    b, d = board_base('配角・道具・色板', '《ロストワンの号哭》MV　第一阶段')
    f = ImageFont.truetype(GOTH, 38)
    A = ROOT / 'art' / 'design'
    items = [(A / 'out' / 'linerin_full_1.png', '线稿铃・坐姿 A'), (A / 'out' / 'linerin_full_2.png', '坐姿 B'), (A / 'out' / 'linerin_full_3.png', '坐姿 C'),
             (A / 'out' / 'linerin_seated_v1.png', '半身・低头'), (A / 'out' / 'child_s2a.png', '小时候的铃（C 段）')]
    x = 70; widths = [560, 560, 560, 760, 620]
    for (p, lab), w in zip(items, widths):
        place(b, cut(p), (x, 200, x + w, 1270), lab, f)
        x += w + 50
    place(b, cut(A / 'sheet' / 'redpen.png'), (70, 1420, 1100, 2030), '红笔的手（出题和打分的人，不露脸）', f)
    d.text((1260, 1400), '色板', font=ImageFont.truetype(MINCHO, 56), fill=INK)
    sw = [('纸白', '#EEE9DC', '世界的底色'), ('墨', '#2B2B30', '线、字'), ('批改红', '#D7263D', '本片标志色：打叉、画圈、分数、开场'),
          ('碧青', '#218EA3', '只属于她：眼睛、她写的字'), ('金发', '#F1C75B', '她'), ('藏青', '#262B47', '她的制服'), ('线稿灰', '#8C8E96', '同学们的铅笔线'), ('黑板绿', '#30483F', '黑板')]
    y = 1490
    for i, (n, hx, use) in enumerate(sw):
        col = tuple(int(hx[k:k + 2], 16) for k in (1, 3, 5))
        cx = 1260 + (i % 2) * 1260; cy = y + (i // 2) * 140
        d.rectangle((cx, cy, cx + 110, cy + 110), fill=col, outline=INK, width=2)
        d.text((cx + 140, cy + 6), f'{n}  {hx}', font=ImageFont.truetype(GOTH, 38), fill=INK)
        d.text((cx + 140, cy + 60), use, font=ImageFont.truetype(GOTH, 30), fill=(90, 90, 96))
    b.convert('RGB').save(OUT / '人设_配角与色板.png', quality=95)


board1(); board2()
print('ok')
