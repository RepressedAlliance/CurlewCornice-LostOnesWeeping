"""Audio analysis for the official track.

- Aligns the instrumental FLAC to the official mix and derives a vocal stem (mix - inst).
- Measures tempo / beats / downbeat candidates.
- Builds a vocal-activity envelope and compares it with every ASS line and syllable.
Outputs go to work/audio/.
"""
import json, re, sys
import os
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa

SRC = Path(os.environ.get('LOSTONE_INPUT') or Path(__file__).resolve().parents[1] / 'input')
MIX = SRC / "song.flac"
INST = SRC / "instrumental.flac"
ASS = SRC / "lyrics_karaoke.ass"
OUT = Path(__file__).resolve().parent.parent / "work" / "audio"
OUT.mkdir(parents=True, exist_ok=True)


def load(p):
    y, sr = sf.read(p, always_2d=True)
    return y.astype(np.float32), sr


def parse_ass(p):
    lines = []
    for raw in p.read_text(encoding="utf-8-sig").splitlines():
        if not raw.startswith("Dialogue:"):
            continue
        parts = raw.split(",", 9)
        def t(s):
            h, m, rest = s.split(":")
            return int(h) * 3600 + int(m) * 60 + float(rest)
        st, en, text = t(parts[1]), t(parts[2]), parts[9]
        sylls, cur = [], st
        for k, ch in re.findall(r"\{\\k(\d+)\}([^{]*)", text):
            d = int(k) / 100
            sylls.append({"t0": round(cur, 3), "t1": round(cur + d, 3), "ch": ch})
            cur += d
        lines.append({"start": st, "end": en, "text": "".join(s["ch"] for s in sylls),
                      "k_end": round(cur, 3), "sylls": sylls})
    return lines


def main():
    mix, sr = load(MIX)
    inst, sr2 = load(INST)
    assert sr == sr2, (sr, sr2)
    # coarse alignment via onset-envelope cross-correlation (mono, 11 kHz)
    m = librosa.resample(mix.mean(1), orig_sr=sr, target_sr=11025)
    i = librosa.resample(inst.mean(1), orig_sr=sr, target_sr=11025)
    n = min(len(m), len(i))
    seg = slice(0, min(n, 11025 * 60))
    corr = np.correlate(m[seg][:11025 * 50], i[seg][: 11025 * 50 + 11025], mode="valid") if False else None
    # use FFT cross-correlation on first 60 s
    a, b = m[seg], i[seg]
    L = 1 << int(np.ceil(np.log2(len(a) + len(b))))
    cc = np.fft.irfft(np.fft.rfft(a, L) * np.conj(np.fft.rfft(b, L)), L)
    lag = int(np.argmax(np.r_[cc[-11025:], cc[:11025]])) - 11025  # +-1 s
    lag_s = lag / 11025
    # refine at full rate
    lag_full = int(round(lag_s * sr))
    best = (None, -1)
    for d in range(lag_full - 8, lag_full + 9):
        if d >= 0:
            x, yv = mix[d:d + sr * 30, 0], inst[: sr * 30, 0]
        else:
            x, yv = mix[: sr * 30, 0], inst[-d:-d + sr * 30, 0]
        k = min(len(x), len(yv))
        c = float(np.dot(x[:k], yv[:k]) / (np.linalg.norm(x[:k]) * np.linalg.norm(yv[:k]) + 1e-9))
        if c > best[1]:
            best = (d, c)
    d, c = best
    if d >= 0:
        inst_al = np.zeros_like(mix); k = min(len(mix) - d, len(inst)); inst_al[d:d + k] = inst[:k]
    else:
        inst_al = np.zeros_like(mix); k = min(len(mix), len(inst) + d); inst_al[:k] = inst[-d:-d + k]
    # gain match by least squares over whole track
    g = float(np.sum(mix * inst_al) / (np.sum(inst_al * inst_al) + 1e-9))
    voc = mix - g * inst_al
    sf.write(OUT / "vocal_diff.wav", voc, sr, subtype="PCM_16")
    resid_db = 20 * np.log10(np.std(voc) / (np.std(mix) + 1e-9))
    info = {"inst_lag_samples": d, "inst_lag_s": d / sr, "corr": c, "gain": g, "resid_db": round(float(resid_db), 2),
            "duration": len(mix) / sr}

    # drift check: residual level in 10 s windows where vocals are absent (intro)
    # tempo / beats on the mix
    y = librosa.to_mono(mix.T)
    y22 = librosa.resample(y, orig_sr=sr, target_sr=22050)
    tempo, beats = librosa.beat.beat_track(y=y22, sr=22050, units="time", tightness=200)
    info["tempo"] = float(np.atleast_1d(tempo)[0])
    oenv = librosa.onset.onset_strength(y=y22, sr=22050)
    tg = librosa.feature.tempogram(onset_envelope=oenv, sr=22050)
    info["tempo_candidates"] = [float(t) for t in librosa.feature.rhythm.tempo(onset_envelope=oenv, sr=22050, aggregate=None)[:1]]
    np.save(OUT / "beats.npy", np.asarray(beats))

    # vocal activity: RMS of vocal stem in 10 ms hops, 300 Hz-5 kHz band
    v = librosa.resample(librosa.to_mono(voc.T), orig_sr=sr, target_sr=22050)
    S = np.abs(librosa.stft(v, n_fft=1024, hop_length=220))
    f = librosa.fft_frequencies(sr=22050, n_fft=1024)
    band = S[(f > 250) & (f < 5000)].sum(0)
    db = 20 * np.log10(band + 1e-6)
    db -= np.percentile(db, 99)
    t = np.arange(len(db)) * 220 / 22050
    np.save(OUT / "vocal_env.npy", np.c_[t, db])

    lines = parse_ass(ASS)
    thr = -32.0
    act = db > thr
    def active(t0, t1):
        a, b = np.searchsorted(t, t0), np.searchsorted(t, t1)
        return float(act[a:b].mean()) if b > a else 0.0
    # find actual voiced region around each line: first/last active frame within [start-0.6, end+0.8]
    report = []
    for ln in lines:
        a, b = np.searchsorted(t, ln["start"] - 0.6), np.searchsorted(t, ln["end"] + 0.8)
        idx = np.nonzero(act[a:b])[0]
        on = float(t[a + idx[0]]) if len(idx) else None
        off = float(t[a + idx[-1]]) if len(idx) else None
        report.append({"start": ln["start"], "end": ln["end"], "k_end": ln["k_end"], "text": ln["text"],
                       "voiced_on": on, "voiced_off": off, "inside_ratio": round(active(ln["start"], ln["end"]), 2)})
    # gaps between lines: is there voice?
    gaps = []
    prev = 0.0
    for ln in lines + [{"start": info["duration"]}]:
        if ln["start"] - prev > 0.15:
            r = active(prev + 0.05, ln["start"] - 0.05)
            gaps.append({"from": round(prev, 2), "to": round(ln["start"], 2), "voiced_ratio": round(r, 2)})
        prev = ln.get("end", prev)
    info["lines"] = report
    info["gaps"] = gaps
    (OUT / "analysis.json").write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: v for k, v in info.items() if k not in ("lines", "gaps")}, indent=1))
    for g_ in gaps:
        print("GAP", g_)
    for r in report:
        print(f'{r["start"]:7.2f}-{r["end"]:7.2f} voiced {r["voiced_on"]}-{r["voiced_off"]} in={r["inside_ratio"]} {r["text"]}')


if __name__ == "__main__":
    main()
