# Run the Lost One's Weeping project

[简体中文](REPRODUCE.md) · English · [日本語](REPRODUCE.ja.md) · [Project home](README.en.md)

The following commands run from the repository root unless indicated. The finished output is `work/full/film.mp4`. For the story, artwork and effects, see the [making-of guide](docs/guide.en.md).

## Environment

| Tool | Production setup | Purpose |
|---|---|---|
| Windows | 11, build 26200 | See the platform note below for macOS or Linux. |
| Node.js | 24.15 | Pages and Puppeteer Core 24 with Three.js 0.180. |
| Chrome | Stable | Headless frame capture. |
| Python | 3.12.10 | Analysis, scheduling, assembly and checks. |
| FFmpeg and ffprobe | 8.1 | Encoding, concatenation and inspecting the audio. |
| Codex CLI | Image generation enabled | Optional when replacing a figure drawing. |
| Demucs | 4.1 | Optional when making new audio stems. Install with `python -m pip install demucs`. |

```powershell
Push-Location web
npm install
Pop-Location
python -m pip install -r requirements.txt
```

If Chrome is installed elsewhere, set `CHROME_PATH` to its executable.

## Supply the audio and lyrics

| Local input | Requirements |
|---|---|
| `input/song.flac` | The 214.27-second, 48 kHz release recording. Compare the opening and length first. Even a short offset shifts all the beat markers. |
| `lyrics.txt` | Supply 54 sung lines, one per line, in order. Spaces inside lines are ignored. The filename can be elsewhere and passed as an argument. |
| `input/instrumental.flac` | Optional accompaniment when redoing audio analysis. |
| `input/lyrics_karaoke.ass` | Optional timed karaoke ASS for rebuilding lyric timing. |

The song and full lyrics are not distributed. Use your own legally obtained inputs. Set `LOSTONE_INPUT` for another input directory or `LOSTONE_AUDIO` to the track's path.

```powershell
python tools/lyrics_fill.py lyrics.txt
```

The result `work/audio/lyrics_timed.json` holds 54 lines and 632 timed character slots. The shipped table only contains timings and counts. If the input count is different, the script reports the affected line. Review variant spellings, punctuation and line breaks.

## Check the timeline and preview a frame

```powershell
python tools/segments.py check
python tools/segments.py table
node web/preview.mjs "page=seg_03" 20.0 24.5 g0700 --out work/preview
```

`check` confirms that the 18 consecutive intervals cover all 6,381 frames. `table` generates `docs/帧表.md`. [web/segments.json](web/segments.json) is the source of truth. Frame `g` displays the song at `g/30` seconds. The preview writes 1920×1080 frames plus a labelled contact sheet and reports BEAT, HOLD and SCALE events. A number is an absolute song time in seconds; a `g` prefix chooses a global frame.

## Render and assemble

```powershell
python tools/render_film.py status
python tools/render_film.py measure --ids seg_12
python tools/render_film.py run --jobs 6
python tools/assemble_film.py --out work/full/film.mp4
python tools/assemble_film.py --out work/full/film_phone.mp4 --phone
```

Set the job count to fit your measurement. Each running Chrome used about 1–2 GB in production. The renderer writes a temporary file before finishing each `work/full/frames/<segment>/g_<7-digit-frame>.png`. Run the same command to fill missing frames after an interruption. `deps.json` records files read by the page and their SHA-1 values; a change to a dependency rerenders the segment, while a range-only change can retain existing frames.

Use `--ids seg_07` to render only that segment. To capture a smaller interval directly:

```powershell
node web/render_film.mjs web/scenes/sheet.html "page=seg_07" work/full/frames/seg_07 1910 2221 --chunk 2000:2100
```

Assembly encodes each interval, joins them in registry order, adds the original track and checks the seams and audio sync.

## Review the output

| Check | Command |
|---|---|
| Red frame audit | `python tools/red_scan.py work/full/film.mp4` |
| Holds and near-still stretches | `python tools/static_scan.py work/full/frames/seg_07` |
| Reused character drawings | `python tools/reuse_audit.py work/full/frames/seg_*` |
| Cutout edges in shot | `python tools/bleed_check.py image.png cx cy scale` |
| Variant against master | `python tools/swap_check.py master.png variant.png` |
| Contact sheet for the events | `python tools/review_sheets.py work/full/frames/seg_07 work/review/07 63.67` |
| Value grouping | `python tools/value_check.py frame.png out.png` |

Check the frame against the [production guidance](docs/guide.en.md#timing-and-review) after applying these reports. Run previews through the adjoining shots and check the small display as well.

## Change a drawing

The cutouts are already present in `art/cut/`. For new drawings, write a named prompt in `art/design/prompts/`. `make_jobs.py` prepends `_style.txt` unless the name starts with `-`. After the colon pass reference paths relative to `art/design/`, joined with `+`.

```powershell
python tools/make_jobs.py round_new r07_look:../canon/rin_turnaround.png+../canon/rin_expressions.png
pwsh tools/gen_batch.ps1 -JobsFile art/design/jobs/round_new.json -Throttle 4
python tools/cutout.py art/design/out/r07_look.png art/cut/r07_look.png
python tools/defringe.py art/cut/r07_look.png art/cut/r07_look.png
```

Set the aspect ratio of the input references first. Draw a complete image using the source sheet and the intended camera angle. For a variant, give the master and change one element, then compare silhouette and proportion with `swap_check.py`. The historical jobs expect generated `*_full.txt` files. Rebuild them with `make_jobs.py` before rerunning a job.

## Rebuild the song timing

The files under `work/audio/` include the production grid, bars, accents and character times. For a new recording or song, run:

```powershell
python -m demucs input/song.flac -o work/audio/sep
python tools/analyze_audio.py
python tools/beat_grid.py
python tools/segment_bars.py
python tools/beat_accents.py
python tools/lyric_times.py
```

The lyric step reads `input/lyrics_karaoke.ass` and aligns with the isolated voice. If the grid changes, update `web/lib/score.js` and the scene timing together.

## How the reviews were organised

| Script under `work/workflows/` | Role |
|---|---|
| `produce_segments.js` | Build each segment, get an independent blind review, apply MUST items, review again. |
| `fix_segments.js` | Follow up on the required changes in segments that failed review. |
| `unify_card.js` | Align the main card design across sections. |
| `film_review.js` | Have separate reviewers watch the assembled film and assign changes by segment. |
| `rhythm_pass.js` | Review accents, cuts and lyric timing in each segment. |
| `polish_pass.js` | Reduce excessive screen motion and fix attachments that drift off the drawings. |

The `CTX` blocks document the division of work, art, rendering and checks. If adapting these scripts, set `ROOT` or `LOSTONE_ROOT` to the repository's absolute path.

## Troubleshooting

- **Fonts missing.** Use the preview or render process so `FontFace` can load from `assets/fonts/` over its local server.
- **Lyrics missing.** Run `lyrics_fill.py` to create `work/audio/lyrics_timed.json`.
- **Sound shifted.** Compare opening silence and duration with the 214.27-second release source.
- **macOS or Linux.** Set `CHROME_PATH` for Chrome or Chromium. The image-generation scripts require PowerShell 7. Production was tested on Windows.
- **Running low on memory.** Lower `--jobs` and resume the render later.
- **Reading the effects.** The [making-of guide](docs/guide.en.md) links the reusable methods. The top of each `web/scenes/segments/seg_XX.js` has beat-by-beat scene notes where available.
