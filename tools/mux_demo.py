"""Mux a rendered frame sequence with the song: python tools/mux_demo.py <frames_dir> <t0> <out.mp4> [--phone]
Frames are f_00000.png ... at 30 fps starting at song time t0; the audio is cut from the FLAC at t0 for the same length.
--phone also writes <out>_phone.mp4 (1280x720, small enough to send to a phone)."""
import glob, math, os, subprocess, sys
FLAC = os.path.join(os.environ.get('LOSTONE_INPUT') or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'input'), 'song.flac')
frames, t0, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
n = len([f for f in os.listdir(frames) if f.startswith('f_') and f.endswith('.png')])
dur = n / 30
# the audio length rounded up to 0.1 ms: rounded down (e.g. 400 frames = 13.3333 s) -shortest drops the last frame
base = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', os.path.join(frames, 'f_%05d.png'), '-ss', f'{t0:.4f}', '-t', f'{math.ceil(dur * 10000) / 10000:.4f}', '-i', FLAC]
subprocess.run(base + ['-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', out], check=True)
if '--phone' in sys.argv:
    subprocess.run(base + ['-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', out.replace('.mp4', '_phone.mp4')], check=True)
print(f'{out}: {n} frames, {dur:.2f} s from {t0}')
