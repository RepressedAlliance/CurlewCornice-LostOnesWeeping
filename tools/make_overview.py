"""Rebuild out/stage1/样张总览.jpg: the six style frames and the three design boards, 3 x 3, with captions."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out' / 'stage1'
TILES = [
    ('00_开场_2D.png', '00  #0 开场：她胸前那张读不出来的卡（二维）'),
    ('01_检票口_3D.png', '01  #3 检票口：只有她被拦下（三维）'),
    ('02_どれも不正解_2D.png', '02  #6 どれも不正解というオチでした（二维）'),
    ('03_楼顶卡阵_3D.png', '03  #9 间奏：楼顶演奏和卡阵（三维）'),
    ('04_擦掉的梦_2D.png', '04  #13 その夢すら溝に捨てたのは（二维）'),
    ('05_扯下颈绳_3D.png', '05  #14 もうどうだっていいや（三维）'),
    ('人设_铃.png', '人设：铃'),
    ('人设_小城的人.png', '人设：小城的人'),
    ('道具_答题卡_色彩.png', '道具 · 答题卡 · 色彩'),
]
TW, TH, M, CAP = 1240, 698, 30, 56
W, H = M * 4 + TW * 3, M + (CAP + TH) * 3 + M
sheet = Image.new('RGB', (W, H), (30, 30, 34))
draw = ImageDraw.Draw(sheet)
font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 30)
for i, (name, cap) in enumerate(TILES):
    x = M + (i % 3) * (TW + M)
    y = M + (i // 3) * (CAP + TH)
    draw.text((x, y + 10), cap, font=font, fill=(214, 214, 218))
    sheet.paste(Image.open(OUT / name).convert('RGB').resize((TW, TH), Image.LANCZOS), (x, y + CAP))
sheet.save(OUT / '样张总览.jpg', quality=92)
print('saved', sheet.size)
