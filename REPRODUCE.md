# 运行指南

简体中文 · [English](REPRODUCE.en.md) · [日本語](REPRODUCE.ja.md) · [作品首页](README.md)

从一台干净的机器到成片 `work/full/film.mp4` 的完整步骤。所有命令都在仓库根目录执行。

## 0. 环境

| 软件 | 制作时的版本 | 用途 |
|---|---|---|
| Windows 11 | 26200 | 制作环境（其他系统见“常见问题”） |
| Node.js | 24.15 | 段落页面与渲染器（puppeteer-core 24、three 0.180） |
| Google Chrome | 稳定版 | headless 渲染 |
| Python | 3.12.10 | 音频分析、调度、合成、检查 |
| FFmpeg / ffprobe | 8.1 | 编码、拼接、读音频长度 |
| Codex CLI | 带图像生成的版本 | 只在重新出人物图时需要 |
| Demucs | 4.1 | 只在重新做人声/伴奏分轨时需要（`pip install demucs`） |

```powershell
Push-Location web
npm install
Pop-Location
python -m pip install -r requirements.txt
```

Chrome 不在默认位置时设置 `CHROME_PATH`（例如 `$env:CHROME_PATH = 'D:\Apps\Chrome\chrome.exe'`）。

## 1. 自备输入

歌曲和歌词受版权保护，不随仓库分发。

| 文件 | 说明 |
|---|---|
| `input/song.flac` | 原曲。时间轴以 214.27 秒、48 kHz 的发行版为准；换成其他版本前先比对时长和开头，差几十毫秒就会让所有拍点错位 |
| `lyrics.txt`（任意位置） | 歌词，一行一句、按演唱顺序，共 54 句；行内空格忽略 |
| `input/instrumental.flac` | 可选：伴奏版，只在重做音频分析时用 |
| `input/lyrics_karaoke.ass` | 可选：带逐字计时的卡拉 OK 字幕，只在重做逐字时间时用 |

想把输入放在别处，设置 `LOSTONE_INPUT`（目录）或 `LOSTONE_AUDIO`（歌曲文件）。

生成页面要读的逐字歌词表：

```powershell
python tools/lyrics_fill.py lyrics.txt
# -> work/audio/lyrics_timed.json（54 句、632 字）
```

每句的字数必须和仓库里的时间表一致，不一致时脚本会指出第几句，不会悄悄错位。异体字、标点、断句不同都会被它抓到。

## 2. 检查注册表

```powershell
python tools/segments.py check      # 18 段首尾相接、帧号连续、覆盖到歌曲结尾
python tools/segments.py table          # 重新生成 docs/帧表.md
```

帧 g 显示歌曲第 g/30 秒，全片 6381 帧。每段的页面、帧范围和说明都在 `web/segments.json`。

## 3. 单帧预览

```powershell
node web/preview.mjs "page=seg_03" 20.0 24.5 g0700 --out work/preview
```

输出每个时间点的 1920×1080 帧和一张带时间标注的对照图，并打印页面的 AUDIT 行（BEAT / HOLD / SCALE）。改分镜时先用它看几个关键拍。

## 4. 渲染全片

```powershell
python tools/render_film.py status          # 哪些段已完成、缺多少帧
python tools/render_film.py run --jobs 6    # 并行分块渲染缺的帧
```

- 帧写到 `work/full/frames/<段>/g_<7 位帧号>.png`，先写临时名再改名，中断不会留下半帧；同一命令再跑一遍只补缺的帧。
- 每段渲染时记录它请求过的每个文件及其 SHA-1（`deps.json`）。下次运行时文件变了，这一段自动整段重渲；只改帧范围则保留已有帧。
- 只渲一段：`--ids seg_07`。只渲一段中的一截：直接调用 `node web/render_film.mjs web/scenes/sheet.html "page=seg_07" work/full/frames/seg_07 1910 2221 --chunk 2000:2100`。
- `--jobs` 是同时运行的 Chrome 数。每个 Chrome 进程约占 1–2 GB 内存，先用 `python tools/render_film.py measure --ids seg_12` 量一次再定。

## 5. 合成

```powershell
python tools/assemble_film.py --out work/full/film.mp4
python tools/assemble_film.py --out work/full/film_phone.mp4 --phone   # 手机预览版
```

每段先单独编码，再按注册表顺序拼接、接入原曲；每个接缝前后逐帧比对，并检查音画同步。

## 6. 出片前检查

| 检查 | 命令 |
|---|---|
| 全片不出现红色 | `python tools/red_scan.py work/full/film.mp4` |
| 画面停滞列表 | `python tools/static_scan.py work/full/frames/seg_07` |
| 人物图复用表 | `python tools/reuse_audit.py work/full/frames/seg_*` |
| 人物裁边不入画 | `python tools/bleed_check.py image.png cx cy scale`（见脚本说明） |
| 差分对母版 | `python tools/swap_check.py master.png variant.png` |
| 审片拼图（按事件取帧） | `python tools/review_sheets.py work/full/frames/seg_07 work/review/07 63.67` |
| 明暗层次 | `python tools/value_check.py frame.png out.png` |

逐条标准见 `docs/交付检查清单.md` 和 `docs/经验与检查清单.md`。每个脚本开头都有用法说明。

## 7. 重新出人物图（可选）

入片的图都已在 `art/cut/`，可以直接用于渲染。要改一张图或给新镜头出图：

```powershell
# 1. 写提示词：art/design/prompts/<名字>.txt（共用画风在 _style.txt 自动拼上；名字前加 - 表示不拼）
# 2. 生成任务表，冒号后是参考图（相对 art/design/，多张用 + 连接）
python tools/make_jobs.py round_new r07_look:../canon/rin_turnaround.png+../canon/rin_expressions.png
# 3. 并行出图（每张图一个 codex exec，结果在 art/design/out/）
pwsh tools/gen_batch.ps1 -JobsFile art/design/jobs/round_new.json -Throttle 4
# 4. 抠图、清边，放进 art/cut/
python tools/cutout.py art/design/out/r07_look.png art/cut/r07_look.png
python tools/defringe.py art/cut/r07_look.png art/cut/r07_look.png
```

要点：

- **带设定图整张生成。** 人物出问题就带参考图重画，不用代码裁切拼接人物像素。
- **差分出自同一张母版。** 把母版作为参考图，提示词只写要改的那一处；生成后用 `swap_check.py` 对母版查轮廓和比例。
- **画幅先定好。** 参考图先垫成目标画幅（例如 2:3），否则画幅一变人物比例跟着变。
- **视角跟机位。** 平视画的人物只配水平机位；要俯拍、仰拍、回头，就按镜头重画。
- `art/design/jobs/` 保留了制作时每一批任务的记录；里面引用的 `*_full.txt` 是 `make_jobs.py` 生成的（提示词加画风），重跑旧任务前先用 `make_jobs.py` 重新生成。

## 8. 重做音频分析（可选）

仓库里的 `work/audio/grid.json`（节拍网格）、`bars.json`（小节）、`accents.json`（重音）和 `lyrics_timing.json`（逐字时间）就是成片用的数据。要换歌或重新测：

```powershell
python -m demucs input/song.flac -o work/audio/sep     # 人声 / 伴奏分轨（work/audio/sep/htdemucs/song/）
python tools/analyze_audio.py
python tools/beat_grid.py
python tools/segment_bars.py
python tools/beat_accents.py
python tools/lyric_times.py         # 需要 input/lyrics_karaoke.ass；对齐到人声分轨
```

`web/lib/score.js` 里的拍点表来自这些数据；换歌时要一起更新。

## 9. 多代理工作流（参考）

`work/workflows/` 是制作中用到的多代理工作流脚本：

| 脚本 | 做什么 |
|---|---|
| `produce_segments.js` | 逐段制作 → 独立评审盲看 → 按 MUST 修改 → 复审，直到通过 |
| `fix_segments.js` | 复审没过的段按 MUST 集中修改 |
| `unify_card.js` | 全片统一她的卡面画法 |
| `film_review.js` | 全片渲染合成后，多视角审片并按段分派修改 |
| `rhythm_pass.js` | 全片节奏诊断（拍点、重音、歌词时序）并逐段修改 |
| `polish_pass.js` | 整屏运动“有节奏但不晕”的规则与部件跟随的全片修改 |

脚本里的 `CTX` 段写明了工程做法、出图、渲染锁和检查要求，是给代理的工作说明，也是这套流程最集中的文字描述。运行前把 `ROOT` 设成你的仓库绝对路径（或设置环境变量 `LOSTONE_ROOT`）。

## 常见问题

- **字体没生效。** 页面用 `FontFace` 从 `assets/fonts/` 加载字体，必须用渲染器或预览工具（它们自带本地服务器），不要直接双击打开 HTML。
- **歌词表不存在。** 页面报找不到 `work/audio/lyrics_timed.json`：先做第 1 步的 `lyrics_fill.py`。
- **画面比声音早或晚。** 检查 `input/song.flac` 是否是同一发行版（时长 214.27 秒）。不同版本开头静音长度不同。
- **macOS / Linux。** 设置 `CHROME_PATH` 指向本机 Chrome/Chromium；`tools/gen*.ps1` 需要 PowerShell 7（`pwsh`）。其他脚本是跨平台的 Node 和 Python，但只在 Windows 上实测过。
- **内存不够。** 降低 `render_film.py run --jobs`；渲染可以随时中断、再跑一遍续上。
- **只想看某个效果怎么写的。** 先读对应段落的分镜（`docs/分镜/`），再看 `web/scenes/segments/seg_XX.js` 顶部的注释，那里列了每一拍的事件。
