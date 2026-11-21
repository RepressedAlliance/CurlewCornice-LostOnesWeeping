import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../..'))).replace('\\', '/')
import subprocess, numpy as np, sys
from PIL import Image, ImageDraw
from mstruct import SEG
ROOT=_LO_ROOT
W,H=320,180; B=60/162; fr=lambda k:int(round((0.318+k*B)*30))
p=subprocess.run(['ffmpeg','-v','error','-i',ROOT+'/work/full/film.mp4','-vf',f'scale={W}:{H}','-pix_fmt','rgb24','-f','rawvideo','-'],capture_output=True,check=True)
F=np.frombuffer(p.stdout,np.uint8).reshape(-1,H,W,3); n=len(F)
for name,a,b in SEG:
    ks=list(range(a,b)); cols=8; rows=(len(ks)+cols-1)//cols
    im=Image.new('RGB',(cols*W,rows*(H+14)),'white'); d=ImageDraw.Draw(im)
    for i,k in enumerate(ks):
        f=min(n-1,fr(k)+1); x,y=(i%cols)*W,(i//cols)*(H+14)
        im.paste(Image.fromarray(F[f]),(x,y+14)); d.text((x+2,y+1),f'k{k} f{f}',fill='black')
    im.save(f'sheets/s{name}.jpg',quality=80)
print('ok')
