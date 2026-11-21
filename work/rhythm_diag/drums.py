import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../..'))).replace('\\', '/')
"""Drum-ish onset analysis on the instrumental stem: per 16th grid slot (beatV based) kick / snare / hat / crash strengths,
per-beat table, per-bar energy. Writes drums.json next to this script."""
import json, os, sys
import numpy as np
import librosa

ROOT = _LO_ROOT
WAV = ROOT + "/work/audio/sep/htdemucs/1. Neru - Lost One's Weeping/no_vocals.wav"
VOC = ROOT + "/work/audio/sep/htdemucs/1. Neru - Lost One's Weeping/vocals.wav"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'drums.json')
B, BV0, SR, HOP = 60 / 162, 0.318, 44100, 256
y, _ = librosa.load(WAV, sr=SR, mono=True)
yv, _ = librosa.load(VOC, sr=SR, mono=True)
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP))
fr = librosa.fft_frequencies(sr=SR, n_fft=2048)
T = librosa.frames_to_time(np.arange(S.shape[1]), sr=SR, hop_length=HOP)
LS = np.log1p(S * 50)


def flux(lo, hi):
    b = LS[(fr >= lo) & (fr < hi)]
    d = np.maximum(0, b[:, 1:] - b[:, :-1]).mean(0)
    return np.concatenate([[0], d])


def energy(lo, hi):
    return (S[(fr >= lo) & (fr < hi)] ** 2).sum(0)


kick = flux(35, 110)
snare_body = flux(160, 300)
snare_crack = flux(1500, 6000)
hat = flux(8000, 16000)
e_hi = energy(6000, 16000)
e_all = (S ** 2).sum(0)
vS = np.abs(librosa.stft(yv, n_fft=2048, hop_length=HOP)); e_voc = (vS ** 2).sum(0)


def norm(x):
    return x / (np.percentile(x, 99.5) + 1e-9)


kick, snare_body, snare_crack, hat = map(norm, (kick, snare_body, snare_crack, hat))
snare = np.sqrt(np.maximum(snare_body, 0) * np.maximum(snare_crack, 0))
snare = norm(snare)
dur = len(y) / SR
nk = int((dur - BV0) / B) + 1


def peak(x, t, w=0.035):
    m = (T >= t - w) & (T <= t + w)
    return float(x[m].max()) if m.any() else 0.0


def ehi_ratio(t):
    # crash: high-band energy 120-320 ms after t versus 150-30 ms before t (sustain, not a hat tick)
    a = (T >= t - 0.15) & (T < t - 0.03); b = (T >= t + 0.12) & (T < t + 0.32)
    return float(10 * np.log10((e_hi[b].mean() + 1e-9) / (e_hi[a].mean() + 1e-9)))


slots = []
for s in range(nk * 4):
    t = BV0 + s * B / 4
    slots.append({'s': s, 'k': s / 4, 't': round(t, 4), 'kick': round(peak(kick, t), 3), 'snare': round(peak(snare, t), 3),
                  'hat': round(peak(hat, t), 3), 'crash_db': round(ehi_ratio(t), 1)})
# beats
beats = []
for k in range(nk):
    t = BV0 + k * B
    w = (T >= t - 0.02) & (T < t + B - 0.02)
    beats.append({'k': k, 't': round(t, 3), 'kick': slots[4 * k]['kick'], 'snare': slots[4 * k]['snare'], 'hat': slots[4 * k]['hat'],
                  'crash_db': slots[4 * k]['crash_db'], 'rms_db': round(float(10 * np.log10(e_all[w].mean() + 1e-9)), 1),
                  'hi_db': round(float(10 * np.log10(e_hi[w].mean() + 1e-9)), 1),
                  'voc_db': round(float(10 * np.log10(e_voc[w].mean() + 1e-9)), 1),
                  'sub': [slots[4 * k + j]['kick'] for j in range(4)], 'subs': [slots[4 * k + j]['snare'] for j in range(4)]})
json.dump({'B': B, 'BV0': BV0, 'beats': beats, 'slots': slots}, open(OUT, 'w'))
print('beats', nk, 'written', OUT)
