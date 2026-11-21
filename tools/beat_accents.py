"""Measure the drum accents on the beat grid (162 BPM, first bar line 0.354 s) from the instrumental stem.

For every beat (and half beat) it finds the onset peak within +-40 ms of the grid time in two bands: low (kick, 40-160 Hz)
and high (snare / cymbals, 2-10 kHz), and writes work/audio/accents.json:
  {"beat": B, "phase": 0.354, "half": [{"k": index in half beats, "t": grid time, "off_ms": measured peak - grid,
   "low": 0-1, "high": 0-1, "acc": 0-1}, ...]}
acc is the louder of the two bands, normalised over the song. The scenes put cuts, swaps and hits on the strongest beats.
usage: python tools/beat_accents.py [t0 t1]   (prints a table for that range)
"""
import json, os, sys
import numpy as np
import librosa

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WAV = os.path.join(ROOT, 'work', 'audio', 'sep', 'htdemucs', 'song', 'no_vocals.wav')
B, PH, SR, HOP = 60 / 162, 0.354, 22050, 128
y, _ = librosa.load(WAV, sr=SR, mono=True)
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP))
freqs = librosa.fft_frequencies(sr=SR, n_fft=2048)


def flux(lo, hi):
    band = S[(freqs >= lo) & (freqs < hi)]
    d = np.maximum(0, np.diff(np.log1p(band), axis=1)).sum(0)
    return np.concatenate([[0], d])


low, high = flux(40, 160), flux(2000, 10000)
times = librosa.frames_to_time(np.arange(S.shape[1]), sr=SR, hop_length=HOP)
dur = len(y) / SR
out = []
n_half = int((dur - PH) / (B / 2))
for k in range(n_half):
    t = PH + k * B / 2
    w = (times >= t - 0.04) & (times <= t + 0.04)
    if not w.any(): continue
    il, ih = np.argmax(np.where(w, low, -1)), np.argmax(np.where(w, high, -1))
    out.append({'k': k, 't': round(t, 4), 'low': float(low[il]), 'high': float(high[ih]),
                'off_ms': round(float((times[ih] if high[ih] > low[il] else times[il]) - t) * 1000, 1)})
L = np.percentile([o['low'] for o in out], 98); H = np.percentile([o['high'] for o in out], 98)
for o in out:
    o['low'] = round(min(1, o['low'] / L), 3); o['high'] = round(min(1, o['high'] / H), 3); o['acc'] = max(o['low'], o['high'])
json.dump({'beat': B, 'phase': PH, 'half': out}, open(os.path.join(ROOT, 'work', 'audio', 'accents.json'), 'w'))
offs = np.array([o['off_ms'] for o in out if o['k'] % 2 == 0 and o['acc'] > 0.4])
print(f'{len(out)} half beats; on-beat strong onsets: median offset {np.median(offs):.1f} ms, 90% within +-{np.percentile(np.abs(offs), 90):.1f} ms')
if len(sys.argv) > 2:
    t0, t1 = float(sys.argv[1]), float(sys.argv[2])
    for o in out:
        if t0 <= o['t'] <= t1 and o['k'] % 2 == 0:
            beat = o['k'] // 2; bar = '|' if beat % 4 == 0 else ' '
            print(f"{bar} beat {beat:4d} {o['t']:7.3f}  low {o['low']:.2f}  high {o['high']:.2f}  {'#' * int(o['acc'] * 20)}")
