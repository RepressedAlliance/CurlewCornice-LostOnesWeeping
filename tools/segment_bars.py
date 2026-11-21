"""Per-bar timbre/harmony features on the 162 BPM grid -> novelty curve and clustered section labels."""
import json
import os
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa

ROOT = Path(__file__).resolve().parent.parent
MIX = Path(os.environ.get('LOSTONE_INPUT') or Path(__file__).resolve().parents[1] / 'input') / 'song.flac'
grid = json.loads((ROOT / "work/audio/grid.json").read_text())
bars = np.array(grid["bars"])

y, sr = sf.read(MIX, always_2d=True)
y = librosa.resample(y.mean(1).astype(np.float32), orig_sr=sr, target_sr=22050)
sr = 22050
hop = 512
C = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop)
M = librosa.feature.mfcc(y=y, sr=sr, hop_length=hop, n_mfcc=20)
sc = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop)[0]
on = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=2048)
bands = {"sub": f < 120, "low": (f >= 120) & (f < 500), "mid": (f >= 500) & (f < 3000), "high": f >= 3000}

fr = lambda tt: int(tt * sr / hop)
feats, rows = [], []
for i in range(len(bars) - 1):
    a, b = fr(bars[i]), fr(bars[i + 1])
    c = C[:, a:b].mean(1); m = M[:, a:b].mean(1)
    feats.append(np.r_[c / (np.linalg.norm(c) + 1e-9) * 3, (m - M.mean(1)) / (M.std(1) + 1e-9)])
    bd = {k: float(20 * np.log10(S[v, a:b].mean() + 1e-9)) for k, v in bands.items()}
    rows.append({"bar": i, "t": round(float(bars[i]), 2), "centroid": int(sc[a:b].mean()),
                 "onset": round(float(on[a:b].mean()), 2), **{k: round(v, 1) for k, v in bd.items()}})
X = np.array(feats)
# novelty between consecutive 2-bar blocks
nov = [0.0] + [float(np.linalg.norm(X[max(0, i - 2):i].mean(0) - X[i:i + 2].mean(0))) for i in range(1, len(X))]
from sklearn.cluster import AgglomerativeClustering
lab = AgglomerativeClustering(n_clusters=8).fit_predict(X)
for r, n, l in zip(rows, nov, lab):
    r["novelty"] = round(n, 2); r["cluster"] = int(l)
(ROOT / "work/audio/bars.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
print(" bar     t  cl  nov   cent  onset  sub   low   mid  high")
for r in rows:
    mark = " <==" if r["novelty"] > np.percentile(nov, 88) else ""
    print(f'{r["bar"]:4d} {r["t"]:6.2f}  {"ABCDEFGH"[r["cluster"]]}  {r["novelty"]:4.1f} {r["centroid"]:6d} {r["onset"]:5.2f} '
          f'{r["sub"]:5.1f} {r["low"]:5.1f} {r["mid"]:5.1f} {r["high"]:5.1f}{mark}')
