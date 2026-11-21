"""Check the word-timed ASS against the Demucs vocal stem of the official FLAC.

Reports per line: ASS start/end vs detected voice on/off, voice in ASS gaps,
and per-syllable onset agreement for selected suspicious lines.
"""
import json, re, sys
import os
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa

ROOT = Path(__file__).resolve().parent.parent
ASS = Path(os.environ.get('LOSTONE_INPUT') or Path(__file__).resolve().parents[1] / 'input') / 'lyrics_karaoke.ass'
VOC = ROOT / "work/audio/sep/htdemucs/song/vocals.wav"
OUT = ROOT / "work/audio"


def parse_ass(p):
    out = []
    for raw in p.read_text(encoding="utf-8-sig").splitlines():
        if not raw.startswith("Dialogue:"):
            continue
        parts = raw.split(",", 9)
        tt = lambda s: (lambda h, m, r: int(h) * 3600 + int(m) * 60 + float(r))(*s.split(":"))
        st, en = tt(parts[1]), tt(parts[2])
        cur, sy = st, []
        for k, ch in re.findall(r"\{\\k(\d+)\}([^{]*)", parts[9]):
            sy.append((cur, cur + int(k) / 100, ch)); cur += int(k) / 100
        out.append({"start": st, "end": en, "sylls": sy, "text": "".join(s[2] for s in sy)})
    return out


y, sr = sf.read(VOC, always_2d=True)
y = librosa.resample(y.mean(1).astype(np.float32), orig_sr=sr, target_sr=22050)
sr, hop = 22050, 110  # 5 ms
rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=hop)[0]
db = 20 * np.log10(rms + 1e-7)
ref = np.percentile(db, 98)
db -= ref
t = np.arange(len(db)) * hop / sr
on_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
onsets = librosa.onset.onset_detect(onset_envelope=on_env, sr=sr, hop_length=hop, units="time", backtrack=True)
THR = -30.0
act = db > THR
# smooth: fill holes < 60 ms
k = 12
act_s = np.convolve(act.astype(float), np.ones(k) / k, mode="same") > 0.3

lines = parse_ass(ASS)
idx = lambda x: int(np.clip(np.searchsorted(t, x), 0, len(t) - 1))
print("== voice inside gaps between ASS lines (ratio of frames above -30 dB) ==")
prev = 0.0
gaps = []
for ln in lines + [{"start": t[-1], "end": t[-1]}]:
    if ln["start"] - prev > 0.12:
        a, b = idx(prev + 0.03), idx(ln["start"] - 0.03)
        r = float(act_s[a:b].mean()) if b > a else 0
        # list voiced islands longer than 120 ms
        isl, i = [], a
        while i < b:
            if act_s[i]:
                j = i
                while j < b and act_s[j]:
                    j += 1
                if t[j - 1] - t[i] > 0.12:
                    isl.append((round(float(t[i]), 2), round(float(t[j - 1]), 2), round(float(db[i:j].max()), 1)))
                i = j
            else:
                i += 1
        gaps.append({"from": round(prev, 2), "to": round(ln["start"], 2), "ratio": round(r, 2), "islands": isl})
        print(f'{prev:7.2f}-{ln["start"]:7.2f} ({ln["start"]-prev:5.2f}s) voiced {r:.2f}  islands {isl[:8]}')
    prev = ln["end"]

print("\n== line start/end vs detected voice ==")
rows = []
for n, ln in enumerate(lines):
    # onset: first active frame in [start-0.5, start+0.4]
    a, b = idx(ln["start"] - 0.5), idx(ln["start"] + 0.4)
    w = np.nonzero(act_s[a:b])[0]
    von = float(t[a + w[0]]) if len(w) else None
    a2, b2 = idx(ln["end"] - 0.6), idx(ln["end"] + 1.2)
    w2 = np.nonzero(act_s[a2:b2])[0]
    # last active frame of the continuous region that contains/precedes end
    voff = None
    if len(w2):
        j = a2 + w2[0]
        last = j
        while j < b2:
            if act_s[j]:
                last = j
            elif t[j] - t[last] > 0.08:
                break
            j += 1
        voff = float(t[last])
    rows.append({"n": n + 1, "start": ln["start"], "end": ln["end"], "voice_on": von, "voice_off": voff, "text": ln["text"]})
    flag = ""
    if von is not None and abs(von - ln["start"]) > 0.12:
        flag += f" START{von - ln['start']:+.2f}"
    if voff is not None and voff - ln["end"] > 0.25:
        flag += f" TAIL+{voff - ln['end']:.2f}"
    print(f'{n+1:2d} {ln["start"]:7.2f}-{ln["end"]:7.2f}  voice {von if von is None else round(von,2)}-{voff if voff is None else round(voff,2)}{flag}  {ln["text"]}')

# syllable onset agreement: for each syllable start find nearest detected onset
print("\n== syllable timing: median |syllable start - nearest vocal onset| per line ==")
for n, ln in enumerate(lines):
    d = [float(np.min(np.abs(onsets - s0))) for s0, s1, ch in ln["sylls"] if ch.strip()]
    print(f'{n+1:2d} {ln["start"]:7.2f} med {np.median(d)*1000:5.0f} ms  p80 {np.percentile(d,80)*1000:5.0f} ms  {ln["text"]}')

(OUT / "ass_check.json").write_text(json.dumps({"gaps": gaps, "lines": rows}, ensure_ascii=False, indent=1), encoding="utf-8")
np.save(OUT / "vocal_onsets.npy", onsets)
