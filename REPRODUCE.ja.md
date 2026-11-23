# 『ロストワンの号哭』実行ガイド

[简体中文](REPRODUCE.md) · [English](REPRODUCE.en.md) · 日本語 · [作品トップ](README.ja.md)

コマンドは特記のない限りリポジトリ直下で実行します。出力先は `work/full/film.mp4`。物語や素材、演出は [制作ガイド](docs/guide.ja.md) にあります。

## 環境

| ソフト | 制作時 | 用途 |
|---|---|---|
| Windows | 11、ビルド 26200 | 制作環境。macOS・Linux は下の項目を参照。 |
| Node.js | 24.15 | ページと Puppeteer Core 24、Three.js 0.180。 |
| Chrome | 安定版 | ヘッドレスでの連番取得。 |
| Python | 3.12.10 | 解析、レンダリング管理、結合、検査。 |
| FFmpeg / ffprobe | 8.1 | エンコード、結合、音源の確認。 |
| Codex CLI | 画像生成対応版 | 人物原画を作り直す場合。 |
| Demucs | 4.1 | 人声と伴奏を分け直す場合。`python -m pip install demucs` で追加。 |

```powershell
Push-Location web
npm install
Pop-Location
python -m pip install -r requirements.txt
```

Chrome の場所が既定と違う場合は、実行ファイルを `CHROME_PATH` に設定します。

## 音源と歌詞

| 手元で用意するもの | 内容 |
|---|---|
| `input/song.flac` | 時刻の基準にした 214.27 秒、48 kHz の配信音源。冒頭の無音と全長を確認します。数十ミリ秒の差でも拍がずれます。 |
| `lyrics.txt` | 歌う順に一行ずつ、計 54 行。行中の空白は除きます。別の場所に置いて引数で指定できます。 |
| `input/instrumental.flac` | 音声を再解析する場合の伴奏。任意。 |
| `input/lyrics_karaoke.ass` | 発音時刻を付け直す場合のカラオケ ASS。任意。 |

楽曲と歌詞全文は同梱していません。適法に入手した入力を使います。入力先を変えるにはフォルダを `LOSTONE_INPUT`、音源を `LOSTONE_AUDIO` で指定します。

```powershell
python tools/lyrics_fill.py lyrics.txt
```

同梱するのは時刻と字数です。`work/audio/lyrics_timed.json` に 54 行・632 文字分の時刻付き歌詞ができます。字数が異なると何行目か表示されます。表記、句読点、改行を確認します。

## 時刻表の確認とプレビュー

```powershell
python tools/segments.py check
python tools/segments.py table
node web/preview.mjs "page=seg_03" 20.0 24.5 g0700 --out work/preview
```

`check` は 18 区間が切れずにつながり、6,381 フレームを覆うことを確認します。`table` は `docs/帧表.md` を出力します。元データは [web/segments.json](web/segments.json)。フレーム `g` は曲の `g/30` 秒を表示します。プレビューは 1920×1080 のフレームと時刻入りの一覧、BEAT、HOLD、SCALE の記録を出します。数字は曲の秒、`g` 付きは全編でのフレーム番号です。

## 全編のレンダリングと結合

```powershell
python tools/render_film.py status
python tools/render_film.py measure --ids seg_12
python tools/render_film.py run --jobs 6
python tools/assemble_film.py --out work/full/film.mp4
python tools/assemble_film.py --out work/full/film_phone.mp4 --phone
```

並列数は計測に合わせて選びます。制作時は Chrome 一つあたり約 1～2 GB でした。各フレームは一時ファイルを経て `work/full/frames/<区間>/g_<7桁>.png` に保存されます。処理を止めても同じコマンドで足りないフレームを補います。`deps.json` は区間が読んだファイルと SHA-1 を持ち、ファイルが変わった区間は再出力し、区間の境界だけが変わったときは既存フレームを再利用できます。

一つの区間を出すには `--ids seg_07` を加えます。さらに狭い範囲の指定例です。

```powershell
node web/render_film.mjs web/scenes/sheet.html "page=seg_07" work/full/frames/seg_07 1910 2221 --chunk 2000:2100
```

各区間を個別にエンコードして登録順に結合し、音源を加え、つなぎ目の前後のフレームと音の同期を確認します。

## 出力の確認

| 確認すること | コマンド |
|---|---|
| 赤の有無 | `python tools/red_scan.py work/full/film.mp4` |
| 動きが止まる区間 | `python tools/static_scan.py work/full/frames/seg_07` |
| 人物素材の再使用 | `python tools/reuse_audit.py work/full/frames/seg_*` |
| 切り抜きの端が画面に出るか | `python tools/bleed_check.py image.png cx cy scale` |
| 差分と母版を比較 | `python tools/swap_check.py master.png variant.png` |
| 演出の時刻ごとの一覧 | `python tools/review_sheets.py work/full/frames/seg_07 work/review/07 63.67` |
| 明暗のまとまり | `python tools/value_check.py frame.png out.png` |

自動検出のあと [制作ガイドの確認項目](docs/guide.ja.md#拍と試写) を使い、前後の区間とスマートフォン相当の大きさで見ます。

## 原画の差し替え

採用した透過原画は `art/cut/` にあります。新しく作る場合は `art/design/prompts/` に名前を付けてプロンプトを作ります。名前の前に `-` を付けない限り `_style.txt` を自動で足します。コロンの後ろに `art/design/` からの相対パスで設定画を書き、複数は `+` でつなぎます。

```powershell
python tools/make_jobs.py round_new r07_look:../canon/rin_turnaround.png+../canon/rin_expressions.png
pwsh tools/gen_batch.ps1 -JobsFile art/design/jobs/round_new.json -Throttle 4
python tools/cutout.py art/design/out/r07_look.png art/cut/r07_look.png
python tools/defringe.py art/cut/r07_look.png art/cut/r07_look.png
```

参照の画角を先にそろえ、使用するカメラの向きで一枚をまとめて描きます。差分は同じ母版から一つの要素を変え、`swap_check.py` で輪郭と比率を確認します。過去のバッチを再実行する場合、参照先の `*_full.txt` を `make_jobs.py` で作り直します。

## 音声の再解析

`work/audio/` にある拍、小節、重音、発音時刻は制作時に使った値です。別の録音や曲を使う場合は次を実行します。

```powershell
python -m demucs input/song.flac -o work/audio/sep
python tools/analyze_audio.py
python tools/beat_grid.py
python tools/segment_bars.py
python tools/beat_accents.py
python tools/lyric_times.py
```

最後の処理は `input/lyrics_karaoke.ass` を分離した歌声に合わせます。拍を変える場合は `web/lib/score.js` と各場面の時刻も更新します。

## 役割を分けた試写

| `work/workflows/` のスクリプト | 役割 |
|---|---|
| `produce_segments.js` | 区間を制作し、独立した評者が見て必須修正を出し、修正と再確認を進める。 |
| `fix_segments.js` | 再確認で残った必須の修正をまとめて進める。 |
| `unify_card.js` | 全編で同じカード面を使うよう調整する。 |
| `film_review.js` | つないだ本編を複数の視点で見て、修正を区間に割り振る。 |
| `rhythm_pass.js` | 打音、カット、歌詞の時刻を区間ごとに見る。 |
| `polish_pass.js` | 画面全体の揺れを整理し、部品を人物の絵の位置に合わせる。 |

各ファイルの `CTX` に作業の分担、原画生成、レンダリング、点検の指示があります。応用する場合は `ROOT` または `LOSTONE_ROOT` をリポジトリの絶対パスにします。

## 困ったとき

- **フォントが出ない。** プレビューやレンダリングを通すと、ローカルサーバーから `FontFace` が `assets/fonts/` を読みます。
- **歌詞が出ない。** `lyrics_fill.py` で `work/audio/lyrics_timed.json` を作ります。
- **音が先行する、または遅い。** 214.27 秒の版と冒頭の無音、全長を比較します。
- **macOS・Linux。** Chrome または Chromium を `CHROME_PATH` に指定します。画像生成のスクリプトには PowerShell 7 が必要です。制作中の動作確認は Windows で行いました。
- **メモリ不足。** `--jobs` を減らして続きから実行します。
- **演出を調べたい。** [制作ガイド](docs/guide.ja.md) と各 `web/scenes/segments/seg_XX.js` の冒頭にある拍ごとのメモを読みます。
