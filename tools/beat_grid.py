"""Fit a constant-tempo beat grid to the official mix and print a section energy map.

Writes work/audio/grid.json: bpm, first downbeat, beat times, bar times, per-bar energy.
"""
import json
import os
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa

MIX = Path(os.environ.get('LOSTONE_INPUT') or Path(__file__).resolve().parents[1] / 'input') / 'song.flac'
OUT = Path(__file__).resolve().parent.parent / "work" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

y, sr = sf.read(MIX, always_2d=True)
y = librosa.resample(y.mean(1).astype(np.float32), orig_sr=sr, target_sr=22050)
sr = 22050
hop = 128
oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop, aggregate=np.median)
t = librosa.frames_to_time(np.arange(len(oenv)), sr=sr, hop_length=hop)
dur = len(y) / sr


def score(bpm, phase, lo=27.0, hi=180.0):
    p = 60.0 / bpm
    bt = np.arange(phase, dur, p)
    bt = bt[(bt > lo) & (bt < hi)]
    idx = np.clip(np.round(bt * sr / hop).astype(int), 0, len(oenv) - 1)
    return float(oenv[idx].mean())


best = (0, 0, 0)
for bpm in np.arange(158.0, 166.0, 0.01):
    p = 60.0 / bpm
    for ph in np.arange(0, p, 0.002):
        s = score(bpm, ph)
        if s > best[0]:
            best = (s, bpm, ph)
s, bpm, ph = best
p = 60.0 / bpm
beats = np.arange(ph, dur, p)

# downbeat: choose beat offset (0..3) whose beats carry most low-frequency energy
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=2048)
low = S[f < 150].sum(0)
li = lambda tt: low[np.clip(np.round(tt * sr / hop).astype(int), 0, len(low) - 1)]
sel = (beats > 27) & (beats < 180)
off_scores = [float(li(beats[sel][o::4]).mean()) for o in range(4)]
# lyric lines start on bars too: use line starts as a second vote
ass_starts = [26.88, 29.86, 32.84, 35.78, 50.49, 53.56, 56.53, 59.50, 74.33, 77.29, 80.17, 83.18, 86.07,
              89.15, 92.06, 95.02, 109.83, 112.87, 133.59, 136.56, 157.22, 160.22, 168.92]
off = int(np.argmax(off_scores))
bars = beats[off::4]
# RMS per bar
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
ri = lambda a, b: float(20 * np.log10(rms[int(a * sr / hop):int(b * sr / hop)].mean() + 1e-9))
bar_e = [ri(bars[i], bars[i + 1]) for i in range(len(bars) - 1)]

res = {"bpm": round(float(bpm), 3), "phase": round(float(ph), 4), "score": s, "downbeat_offset": off,
       "offset_low_energy": off_scores, "beats": [round(float(b), 4) for b in beats],
       "bars": [round(float(b), 4) for b in bars], "bar_energy_db": [round(e, 1) for e in bar_e]}
(OUT / "grid.json").write_text(json.dumps(res, indent=1), encoding="utf-8")
print("bpm", res["bpm"], "phase", res["phase"], "downbeat offset", off, off_scores)
# nearest bar to each lyric start
for a in ass_starts:
    j = int(np.argmin(np.abs(bars - a)))
    print(f"line {a:7.2f}  nearest bar #{j} at {bars[j]:7.3f}  diff {a - bars[j]:+.3f}")
print("bar energy map (bar#, time, dB):")
for i, e in enumerate(bar_e):
    print(f"{i:3d} {bars[i]:7.2f} {e:6.1f} " + "#" * max(0, int((e + 40) / 1.5)))
