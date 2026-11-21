"""Assemble the film from rendered segments: one high-quality video per segment, joined in registry order, with the
song from the FLAC, checked frame by frame at every join.

usage:
  python tools/assemble_film.py [--ids a,b] [--range f0:f1] [--out work/full/film.mp4] [--phone] [--hls]
                                [--crf 14] [--allow-gaps] [--registry ...] [--work work/full]

  Each finished segment (work/full/<id>.done, every frame present) is encoded once to work/full/<id>.mp4
  (libx264 crf 14, preset slow, BT.709, yuv420p) and re-encoded only when its dependency hash changes.
  --range f0:f1 assembles only those global frames (partial segments are encoded to work/full/pieces/).
  The audio is cut from the FLAC at the same song time as the first frame (frame g = g/30 s); with --allow-gaps
  segments that do not meet are joined anyway and each gets its own slice of the song.
  An existing output is moved to work/full/prev/ first, never overwritten.

Checks: the output's frame count equals the sum of the pieces; audio and video lengths agree; at each join (and the
first and last frame) the decoded frame matches its own source PNG better than its neighbour (no shifted, repeated or
dropped frame), the two PNGs either side of the join are not identical (a repeated frame) and not black; blackdetect
over the whole output is reported.
--phone also writes <out>_phone.mp4 (1280x720, crf 21, a keyframe every 2 s); --hls writes HLS segments of the phone
version to <out>_hls/index.m3u8. Exit code 1 if a check fails.
"""
import argparse, json, os, re, subprocess, sys, time
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import segments as SEG  # noqa: E402
import render_film as RF  # noqa: E402


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace', **kw)
    if r.returncode != 0:
        raise SystemExit(f'failed: {" ".join(cmd)}\n{r.stderr[-3000:]}')
    return r


VF = 'scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p'
TAGS = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv']


def encode_piece(sid, a, b, out, fps, crf):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    pattern = os.path.join(RF.frames_dir(sid), 'g_%07d.png')
    run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-start_number', str(a), '-i', pattern,
         '-frames:v', str(b - a), '-vf', VF, '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf),
         '-x264-params', 'keyint=60:min-keyint=1', *TAGS, '-r', str(fps), '-an', out + '.part.mp4'])
    os.replace(out + '.part.mp4', out)


def count_frames(p):
    r = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries',
             'stream=nb_read_packets', '-of', 'csv=p=0', p])
    return int(r.stdout.strip().split(',')[0])


def durations(p):
    r = run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,duration', '-of', 'json', p])
    return {s['codec_type']: float(s.get('duration', 0)) for s in json.loads(r.stdout)['streams']}


def decode_frames(p, idx, w, h):
    """decoded RGB frames at output frame indices idx (sorted, unique)"""
    sel = '+'.join(f'eq(n\\,{k})' for k in idx)
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf',
                        f"select='{sel}',scale=in_color_matrix=bt709:in_range=tv:flags=accurate_rnd+full_chroma_int,format=rgb24",
                        '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True)
    if r.returncode != 0:
        raise SystemExit(r.stderr.decode(errors='replace')[-2000:])
    n = len(r.stdout) // (w * h * 3)
    return np.frombuffer(r.stdout[:n * w * h * 3], np.uint8).reshape(n, h, w, 3)


def pcm(p, t, dur, sr=48000):
    """mono float PCM of p from t for dur seconds (decoded from 0 and sliced, so the container's edit list / AAC priming
    is applied exactly as a player applies it)"""
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-t', f'{t + dur + 0.5:.3f}', '-map', '0:a:0', '-ac', '1', '-ar', str(sr),
                        '-f', 'f32le', '-'], capture_output=True)
    a = np.frombuffer(r.stdout, np.float32)
    return a[int(t * sr):int((t + dur) * sr)]


def audio_lag(out, flac, out_t, song_t, dur=1.5, sr=48000):
    """samples by which out's audio at out_t lags the song at song_t (cross-correlation; + = the film's sound is late)"""
    a, b = pcm(out, out_t, dur, sr), pcm(flac, song_t, dur, sr)
    n = min(len(a), len(b))
    if n < sr // 2 or np.abs(b[:n]).max() < 1e-3:
        return None
    A, B = np.fft.rfft(a[:n], 2 * n), np.fft.rfft(b[:n], 2 * n)
    c = np.fft.irfft(A * np.conj(B))
    k = int(np.argmax(c))
    return k if k < n else k - 2 * n


def psnr(a, b):
    m = np.mean((a.astype(np.float32) - b.astype(np.float32)) ** 2)
    return 99.0 if m == 0 else 10 * np.log10(255 ** 2 / m)


def png(sid, g):
    return np.asarray(Image.open(os.path.join(RF.frames_dir(sid), f'g_{g:07d}.png')).convert('RGB'))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--ids', type=lambda s: [x for x in s.split(',') if x])
    ap.add_argument('--range')
    ap.add_argument('--out')
    ap.add_argument('--phone', action='store_true')
    ap.add_argument('--hls', action='store_true')
    ap.add_argument('--crf', type=int, default=14)
    ap.add_argument('--allow-gaps', action='store_true')
    ap.add_argument('--registry', default=SEG.REGISTRY)
    ap.add_argument('--work', default=RF.FULL)
    args = ap.parse_args()
    RF.FULL = os.path.abspath(args.work)
    full = RF.FULL
    reg = SEG.load(args.registry)
    fps, W, H = reg['fps'], reg['width'], reg['height']
    segs = SEG.ordered(reg, args.ids, include_todo=False)
    ra, rb = (map(int, args.range.split(':'))) if args.range else (0, 10 ** 9)
    t_start = time.time()

    # ---- pieces: (seg, a, b, mp4)
    pieces, problems = [], []
    for seg in segs:
        a, b = max(seg['f0'], ra), min(seg['f1'], rb)
        if a >= b:
            continue
        done = RF.read_json(os.path.join(full, f'{seg["id"]}.done'))
        if not done or done.get('f0') != seg['f0'] or done.get('f1') != seg['f1']:
            problems.append(f'{seg["id"]}: not rendered (no matching .done); run tools/render_film.py run first')
            continue
        miss = [g for g in range(a, b) if not RF.frame_ok(RF.frame_path(seg['id'], g), done.get('epoch', 0))]
        if miss:
            problems.append(f'{seg["id"]}: {len(miss)} frames missing')
            continue
        whole = (a, b) == (seg['f0'], seg['f1'])
        mp4 = os.path.join(full, f'{seg["id"]}.mp4') if whole else os.path.join(full, 'pieces', f'{seg["id"]}_{a}-{b}.mp4')
        pieces.append((seg, a, b, mp4, done['hash']))
    if problems:
        print('\n'.join(problems))
        return 1
    if not pieces:
        print('nothing to assemble')
        return 1
    for (s1, _, b1, _, _), (s2, a2, _, _, _) in zip(pieces, pieces[1:]):
        if a2 != b1 and not args.allow_gaps:
            print(f'{s1["id"]} ends at {b1} but {s2["id"]} starts at {a2}: the pieces do not meet (use --allow-gaps)')
            return 1

    # ---- encode
    for seg, a, b, mp4, h in pieces:
        side = mp4 + '.json'
        info = RF.read_json(side, {}) or {}
        if os.path.exists(mp4) and info.get('hash') == h and info.get('range') == [a, b] and info.get('crf') == args.crf:
            print(f'{seg["id"]}: {os.path.relpath(mp4, SEG.ROOT)} up to date')
            continue
        t = time.time()
        encode_piece(seg['id'], a, b, mp4, fps, args.crf)
        n = count_frames(mp4)
        if n != b - a:
            print(f'{seg["id"]}: encoded {n} frames, expected {b - a}')
            return 1
        RF.write_json(side, {'hash': h, 'range': [a, b], 'crf': args.crf, 'frames': n, 'encoded': time.strftime('%Y-%m-%d %H:%M:%S')})
        print(f'{seg["id"]}: encoded {n} frames in {time.time() - t:.0f} s -> {os.path.relpath(mp4, SEG.ROOT)}')

    # ---- concat with the song
    g0, g1 = pieces[0][1], pieces[-1][2]
    whole_film = not args.ids and not args.range and all(p[1] == q[2] for q, p in zip(pieces, pieces[1:]))
    out = os.path.abspath(args.out) if args.out else os.path.join(full, 'film.mp4' if whole_film else f'film_{g0}-{g1}.mp4')
    if os.path.exists(out):
        os.makedirs(os.path.join(full, 'prev'), exist_ok=True)
        stamp = time.strftime('%Y%m%d_%H%M%S', time.localtime(os.path.getmtime(out)))
        dest = os.path.join(full, 'prev', f'{os.path.splitext(os.path.basename(out))[0]}_{stamp}.mp4')
        os.replace(out, dest)
        print(f'previous output moved to {os.path.relpath(dest, SEG.ROOT)}')
    lst = os.path.join(full, 'concat_list.txt')
    with open(lst, 'w', encoding='utf-8') as f:
        for p in pieces:
            f.write(f"file '{p[3].replace(os.sep, '/')}'\n")
    spans = []
    for _, a, b, _, _ in pieces:
        if spans and spans[-1][1] == a:
            spans[-1][1] = b
        else:
            spans.append([a, b])
    af = ''.join(f'[1:a:0]atrim=start={a / fps:.6f}:end={b / fps:.6f},asetpts=PTS-STARTPTS[a{i}];' for i, (a, b) in enumerate(spans))
    af += ''.join(f'[a{i}]' for i in range(len(spans))) + f'concat=n={len(spans)}:v=0:a=1[aout]'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-i', reg['audio'],
         '-filter_complex', af, '-map', '0:v:0', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k',
         '-movflags', '+faststart', out])
    print(f'{os.path.relpath(out, SEG.ROOT)}: joined {len(pieces)} piece(s), frames {g0}-{g1}, song {g0 / fps:.3f}-{g1 / fps:.3f} s')

    # ---- checks
    fails, notes = [], []
    expect = sum(b - a for _, a, b, _, _ in pieces)
    n = count_frames(out)
    (fails if n != expect else notes).append(f'frame count {n}, expected {expect}')
    d = durations(out)
    if abs(d.get('audio', 0) - d.get('video', 0)) > 1.5 / fps + 0.03:
        fails.append(f'audio {d.get("audio")} s vs video {d.get("video")} s')
    else:
        notes.append(f'video {d.get("video"):.3f} s, audio {d.get("audio"):.3f} s')

    # sound against picture: frame g shows song time g / fps, so the output's audio at output time x must be the song at
    # g0 / fps + x (first span). Checked by cross-correlating the decoded output (edit list and AAC priming applied, as a
    # player does) with the FLAC at three points; any lag is a sync error (2026-11-21: measured 0 samples; kept as a check).
    def sync_check(path, label):
        span = spans[0][1] - spans[0][0]
        for frac in (0.15, 0.5, 0.85):
            x = round(span * frac) / fps
            lag = audio_lag(path, reg['audio'], x, g0 / fps + x)
            if lag is None:
                notes.append(f'{label} sync at {x:.1f} s: too quiet to measure')
            elif abs(lag) > 2:
                fails.append(f'{label} sound {lag:+d} samples ({lag / 48:.1f} ms) against the picture at {x:.1f} s')
            else:
                notes.append(f'{label} sound in sync at {x:.1f} s ({lag:+d} samples)')
    sync_check(out, 'film')
    # output index -> (seg id, global frame)
    where, k = [], 0
    for seg, a, b, _, _ in pieces:
        where.append((k, seg['id'], a, b))
        k += b - a
    joins = [w[0] for w in where[1:]]
    probe = sorted({0, n - 1} | {j for j in joins} | {j - 1 for j in joins})

    def src(i):
        for k0, sid, a, b in where:
            if k0 <= i < k0 + (b - a):
                return sid, a + i - k0
    dec = dict(zip(probe, decode_frames(out, probe, W, H)))
    if len(dec) != len(probe):
        fails.append(f'decoded {len(dec)} of {len(probe)} probe frames')
    for i in probe:
        if i not in dec:
            continue
        sid, g = src(i)
        own = psnr(dec[i], png(sid, g))
        # neighbours that differ visibly from this frame (a held drawing differs from its neighbour by a few pixels
        # only, below the encoder's own noise, so it cannot tell a shift apart and is left out)
        me = png(sid, g)
        nb = [psnr(dec[i], png(*src(j))) for j in (i - 1, i + 1) if 0 <= j < n and psnr(png(*src(j)), me) < 40]
        ok = own >= 30 and all(own > x for x in nb)
        msg = f'out frame {i} = {sid} g{g}: PSNR {own:.1f} dB vs own PNG' + (f', {max(nb):.1f} vs neighbour' if nb else '')
        (notes if ok else fails).append(msg)
    for j in joins:
        (s1, g1_), (s2, g2_) = src(j - 1), src(j)
        A, B = png(s1, g1_), png(s2, g2_)
        if np.array_equal(A, B):
            fails.append(f'join at out frame {j}: {s1} g{g1_} and {s2} g{g2_} are identical (repeated frame)')
        for nm, im in ((f'{s1} g{g1_}', A), (f'{s2} g{g2_}', B)):
            if im.mean() < 4:
                fails.append(f'join at out frame {j}: {nm} is black (mean {im.mean():.1f})')
        notes.append(f'join at out frame {j}: {s1} g{g1_} | {s2} g{g2_}, PSNR between them {psnr(A, B):.1f} dB')
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', out, '-vf', 'blackdetect=d=0.03:pic_th=0.98', '-an', '-f', 'null', '-'],
                       capture_output=True, text=True, encoding='utf-8', errors='replace')
    blacks = re.findall(r'black_start:(\S+) black_end:(\S+)', r.stderr)
    notes.append(f'blackdetect: {len(blacks)} black stretch(es)' + (f' {blacks[:5]}' if blacks else ''))

    outs = [out]
    if args.phone or args.hls:
        ph = out.replace('.mp4', '_phone.mp4')
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', out, '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264',
             '-preset', 'slow', '-crf', '21', '-g', str(2 * fps), *TAGS, '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', ph])
        pn = count_frames(ph)
        (fails if pn != n else notes).append(f'phone version {pn} frames')
        sync_check(ph, 'phone')
        outs.append(ph)
        if args.hls:
            hd = out.replace('.mp4', '_hls')
            os.makedirs(hd, exist_ok=True)
            run(['ffmpeg', '-y', '-loglevel', 'error', '-i', ph, '-c', 'copy', '-f', 'hls', '-hls_time', '4',
                 '-hls_playlist_type', 'vod', '-hls_segment_filename', os.path.join(hd, 'seg_%03d.ts'), os.path.join(hd, 'index.m3u8')])
            outs.append(os.path.join(hd, 'index.m3u8'))
    for x in notes:
        print('  ok  ', x)
    for x in fails:
        print('  FAIL', x)
    for o in outs:
        print(f'{o}  {os.path.getsize(o) / 2**20:.1f} MB')
    print(f'{"FAILED" if fails else "OK"} in {time.time() - t_start:.0f} s')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
