"""Signed global offset / drift of ASS syllable starts vs vocal onset envelope, per section,
plus per-syllable detail for chosen lines."""
import re, sys
import os
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa

ROOT = Path(__file__).resolve().parent.parent
ASS = Path(os.environ.get('LOSTONE_INPUT') or Path(__file__).resolve().parents[1] / 'input') / 'lyrics_karaoke.ass'
VOC = ROOT / "work/audio/sep/htdemucs/song/vocals.wav"
y, sr = sf.read(VOC, always_2d=True)
y = librosa.resample(y.mean(1).astype(np.float32), orig_sr=sr, target_sr=22050)
sr, hop = 22050, 110
env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
env = (env - env.mean()) / (env.std() + 1e-9)
fps = sr / hop
onsets = librosa.onset.onset_detect(onset_envelope=env, sr=sr, hop_length=hop, units="time", backtrack=False)

sy = []
for raw in ASS.read_text(encoding="utf-8-sig").splitlines():
    if not raw.startswith("Dialogue:"):
        continue
    p = raw.split(",", 9)
    h, m, r = p[1].split(":"); cur = int(h) * 3600 + int(m) * 60 + float(r)
    li = []
    for k, ch in re.findall(r"\{\\k(\d+)\}([^{]*)", p[9]):
        li.append((cur, int(k) / 100, ch)); cur += int(k) / 100
    sy.append(li)

def best_shift(times, lo=-0.3, hi=0.3):
    shifts = np.arange(lo, hi + 1e-9, 0.005)
    sc = []
    for s in shifts:
        idx = np.round((np.asarray(times) + s) * fps).astype(int)
        idx = idx[(idx >= 0) & (idx < len(env))]
        sc.append(env[idx].mean())
    return float(shifts[int(np.argmax(sc))]), float(max(sc))

sections = {"A1 (1-6)": range(0, 6), "A2 (7-10)": range(6, 10), "pre1 (11-18)": range(10, 18), "cho1 (19-26)": range(18, 26),
            "B2 (27-30)": range(26, 30), "pre2 (31-38)": range(30, 38), "cho2 (39-46)": range(38, 46), "C (47-50)": range(46, 50),
            "last (51-54)": range(50, 54)}
print("section shift that best aligns ASS syllable starts with vocal onsets (+ = audio later than ASS)")
for name, rg in sections.items():
    ts = [s[0] for i in rg for s in sy[i] if s[2].strip()]
    print(f"  {name:14s} {best_shift(ts)[0]*1000:+5.0f} ms")
print("per line:")
for i, li in enumerate(sy):
    ts = [s[0] for s in li if s[2].strip()]
    sh, sc = best_shift(ts)
    print(f"  {i+1:2d} {li[0][0]:7.2f} {sh*1000:+5.0f} ms  {''.join(s[2] for s in li)}")

for n in map(int, sys.argv[1:]):
    li = sy[n - 1]
    print(f"\nline {n}: syllable start vs nearest onset")
    for s0, d, ch in li:
        j = int(np.argmin(np.abs(onsets - s0)))
        print(f"  {ch!r:6s} ass {s0:7.3f} dur {d:.2f}  onset {onsets[j]:7.3f}  diff {onsets[j]-s0:+.3f}")
    a = li[0][0] - 0.4; b = li[-1][0] + li[-1][1] + 0.6
    print("  onsets in window:", [round(float(o), 3) for o in onsets if a <= o <= b])
