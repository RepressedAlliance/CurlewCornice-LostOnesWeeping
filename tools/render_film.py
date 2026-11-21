"""Render the film from the segment registry, resumably: only segments that changed or are unfinished, only the
frames that are missing.

usage:
  python tools/render_film.py run [--ids a,b] [--jobs N] [--chunk-frames K] [--force] [--include-todo]
                                  [--reserve-mb 1500] [--stall 240] [--retries 2] [--strict-audit]
  python tools/render_film.py status [--ids a,b] [--include-todo]
  python tools/render_film.py measure --ids <id> [--frames 90]     measure one Chrome render process (memory, ms/frame)

Frames go to work/full/frames/<id>/g_<7-digit global frame>.png (frame g = song time g/30 s), rendered by
web/render_film.mjs. A segment is done when every frame of [f0, f1) is there; then work/full/<id>.done is written
with its dependency hash, and audit.json / deps.json are merged next to the frames. State: work/full/state.json.

The dependency hash is the SHA-1 of the page parameters (url, query, size, fps) and of every file the page requested
(deps.json, SHA-1 as served). On the next run the files are hashed again; a segment whose hash changed is rendered
again from scratch (frames written before the new attempt count as stale and are overwritten; the old <id>.mp4, if
any, is moved to work/full/prev/). Changing only f0/f1 keeps the frames (frame g always shows time g/30) and renders
the frames that are now missing. Changing the renderer or Chrome does not change the hash: use --force.

Each segment's missing frames are split into chunks that run in parallel, one node + Chrome per chunk. --jobs
defaults to (available RAM - reserve) / (peak private memory of one render process), from work/full/mem_profile.json
(updated with the largest peak seen) or the measured default. A chunk that writes nothing for --stall seconds is
killed and retried. Every child runs in a Windows job object that kills the whole tree (node and its Chrome) if this
script dies, so a forced stop leaves no Chrome behind; running the same command again renders only the missing frames.
"""
import argparse, ctypes, hashlib, json, math, os, subprocess, sys, threading, time
from ctypes import wintypes
import psutil

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import segments as SEG  # noqa: E402

ROOT = SEG.ROOT
FULL = os.path.join(ROOT, 'work', 'full')
PROFILE = os.path.join(ROOT, 'work', 'full', 'mem_profile.json')   # machine-wide, also when --work points elsewhere
RENDERER = os.path.join(ROOT, 'web', 'render_film.mjs')
DEFAULT_PRIVATE_MB = 700      # measured 2026-11-20, see mem_profile.json once a run has recorded more
AUDIT_KEYS = ['id', 'beat', 'holds', 'layout', 'drawings', 'events']


def now_ms():
    return int(time.time() * 1000)


def frames_dir(sid):
    return os.path.join(FULL, 'frames', sid)


def frame_path(sid, g):
    return os.path.join(frames_dir(sid), f'g_{g:07d}.png')


def frame_ok(p, since_ms):
    try:
        st = os.stat(p)
    except OSError:
        return False
    if st.st_size < 1024 or st.st_mtime * 1000 < since_ms:
        return False
    with open(p, 'rb') as f:
        f.seek(st.st_size - 12)
        return b'IEND' in f.read(12)


def missing_frames(seg, since_ms):
    return [g for g in range(seg['f0'], seg['f1']) if not frame_ok(frame_path(seg['id'], g), since_ms)]


def read_json(p, default=None):
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def write_json(p, obj):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)


class State:
    def __init__(self):
        self.d = read_json(os.path.join(FULL, 'state.json'), {}) or {}
        self.d.setdefault('segments', {})
        self.d.setdefault('sha_cache', {})
        self.lock = threading.Lock()

    def seg(self, sid):
        return self.d['segments'].setdefault(sid, {})

    def save(self):
        with self.lock:
            write_json(os.path.join(FULL, 'state.json'), self.d)

    def sha1(self, rel):
        """SHA-1 of a project file now, cached by size and mtime"""
        p = os.path.join(ROOT, rel)
        try:
            st = os.stat(p)
        except OSError:
            return None
        key = f'{st.st_size}:{st.st_mtime_ns}'
        c = self.d['sha_cache'].get(rel)
        if c and c[0] == key:
            return c[1]
        h = hashlib.sha1()
        with open(p, 'rb') as f:
            for b in iter(lambda: f.read(1 << 20), b''):
                h.update(b)
        self.d['sha_cache'][rel] = [key, h.hexdigest()]
        return h.hexdigest()


def page_params(seg, reg):
    return {'url': seg.get('url', reg['url']), 'query': seg['page'], 'size': [reg['width'], reg['height']], 'fps': reg['fps']}


def content_hash(params, files):
    """files: {path: sha1 or None}"""
    h = hashlib.sha1(json.dumps(params, sort_keys=True).encode())
    for p in sorted(files):
        h.update(f'\n{p}\t{files[p]}'.encode())
    return h.hexdigest()


def chunk_files(sid, kind, since_ms):
    d = frames_dir(sid)
    out = []
    if not os.path.isdir(d):
        return out
    for n in os.listdir(d):
        if n.startswith(kind + '.') and n.endswith('.json') and n != kind + '.json' and not n.endswith('.tmp'):
            p = os.path.join(d, n)
            if os.path.getmtime(p) * 1000 >= since_ms:
                out.append(p)
    return sorted(out)


def merge_deps(sid, since_ms):
    """union of the deps the chunks of this attempt recorded; returns ({path: sha1}, conflicts, changed_during)"""
    files, conflicts, changed = {}, [], []
    for p in chunk_files(sid, 'deps', since_ms):
        d = read_json(p, {}) or {}
        for f in d.get('files', []):
            if f.get('changed'):
                changed.append(f['path'])
            if f['path'] in files and files[f['path']] != f['sha1']:
                conflicts.append(f['path'])
            files.setdefault(f['path'], f['sha1'])
    return files, sorted(set(conflicts)), sorted(set(changed))


def current_files(state, files):
    return {p: state.sha1(p) for p in files}


def check_audit(a):
    """problems with an audit dict (missing fields, beat events off the grid, overlaps, out of frame)"""
    if not a or a.get('_missing'):
        return ['window.__audit missing'], []
    missing = [k for k in AUDIT_KEYS if k not in a]
    warn = []
    beat = a.get('beat') or {}
    if isinstance(beat, dict):
        if 'events' not in beat or 'off' not in beat:
            missing.append('beat.events/off')
        off = beat.get('off')
        if off and (off if isinstance(off, (int, float)) else len(off)):
            warn.append(f'beat off: {off}')
    lay = a.get('layout') or {}
    if isinstance(lay, dict):
        for k in ('boxes', 'overlaps', 'outOfFrame'):
            if k not in lay:
                missing.append(f'layout.{k}')
        for k in ('overlaps', 'outOfFrame'):
            v = lay.get(k)
            if isinstance(v, list):      # entries the page marks problem: false are notes, not problems
                v = [x for x in v if not (isinstance(x, dict) and x.get('problem') is False)]
                n = len(v)
            else:
                n = v or 0
            if n:
                warn.append(f'layout {k}: {n}')
    holds = a.get('holds') or []
    if isinstance(holds, list):
        for h in holds:
            if isinstance(h, dict) and not {'name', 'start', 'end', 'kind'} <= set(h):
                missing.append('holds[].name/start/end/kind')
                break
    return [f'missing {m}' for m in missing], warn


# ---------------------------------------------------------------- child processes: job object, watchdog, memory
class Job:
    """a Windows job object that kills every process in it when this script exits (or is killed)"""
    def __init__(self):
        self.h = None
        if os.name != 'nt':
            return
        k32 = ctypes.WinDLL('kernel32', use_last_error=True)

        class IO(ctypes.Structure):
            _fields_ = [(n, ctypes.c_ulonglong) for n in ('r', 'w', 'o', 'rb', 'wb', 'ob')]

        class BASIC(ctypes.Structure):
            _fields_ = [('PerProcessUserTimeLimit', ctypes.c_longlong), ('PerJobUserTimeLimit', ctypes.c_longlong),
                        ('LimitFlags', wintypes.DWORD), ('MinimumWorkingSetSize', ctypes.c_size_t),
                        ('MaximumWorkingSetSize', ctypes.c_size_t), ('ActiveProcessLimit', wintypes.DWORD),
                        ('Affinity', ctypes.c_size_t), ('PriorityClass', wintypes.DWORD), ('SchedulingClass', wintypes.DWORD)]

        class EXT(ctypes.Structure):
            _fields_ = [('BasicLimitInformation', BASIC), ('IoInfo', IO), ('ProcessMemoryLimit', ctypes.c_size_t),
                        ('JobMemoryLimit', ctypes.c_size_t), ('PeakProcessMemoryUsed', ctypes.c_size_t),
                        ('PeakJobMemoryUsed', ctypes.c_size_t)]
        self.k32 = k32
        k32.CreateJobObjectW.restype = wintypes.HANDLE
        k32.OpenProcess.restype = wintypes.HANDLE
        h = k32.CreateJobObjectW(None, None)
        if not h:
            return
        info = EXT()
        info.BasicLimitInformation.LimitFlags = 0x2000          # JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        if not k32.SetInformationJobObject(wintypes.HANDLE(h), 9, ctypes.byref(info), ctypes.sizeof(info)):
            return
        self.h = h

    def add(self, pid):
        if not self.h:
            return False
        ph = self.k32.OpenProcess(0x0100 | 0x0001, False, pid)   # PROCESS_SET_QUOTA | PROCESS_TERMINATE
        if not ph:
            return False
        ok = bool(self.k32.AssignProcessToJobObject(wintypes.HANDLE(self.h), wintypes.HANDLE(ph)))
        self.k32.CloseHandle(wintypes.HANDLE(ph))
        return ok


def kill_tree(pid):
    try:
        p = psutil.Process(pid)
        procs = p.children(recursive=True) + [p]
    except psutil.Error:
        return
    for x in procs:
        try:
            x.kill()
        except psutil.Error:
            pass
    psutil.wait_procs(procs, timeout=10)


def tree_mem(pid):
    """(rss, private) of a process and its children, in MB"""
    try:
        p = psutil.Process(pid)
        procs = [p] + p.children(recursive=True)
    except psutil.Error:
        return 0, 0
    rss = prv = 0
    for x in procs:
        try:
            m = x.memory_info()
            rss += m.rss
            prv += getattr(m, 'private', m.vms)
        except psutil.Error:
            pass
    return rss / 2**20, prv / 2**20


def kill_orphans(segs):
    """render processes left by a run that died without the job object (pid files written by render_film.mjs)"""
    n = 0
    for seg in segs:
        d = frames_dir(seg['id'])
        if not os.path.isdir(d):
            continue
        for name in os.listdir(d):
            if not (name.startswith('.render_') and name.endswith('.pid.json')):
                continue
            info = read_json(os.path.join(d, name), {}) or {}
            for key, want in (('node', 'node'), ('chrome', 'chrome')):
                pid = info.get(key)
                if not pid:
                    continue
                try:
                    p = psutil.Process(pid)
                    ok = want in p.name().lower() and p.create_time() * 1000 <= info.get('started', 0) + 5000
                    mark = 'render_film.mjs' if key == 'node' else 'puppeteer'
                    ok = ok and any(mark in c for c in p.cmdline())
                except psutil.Error:
                    continue
                if ok:
                    kill_tree(pid)
                    n += 1
            try:
                os.replace(os.path.join(d, name), os.path.join(d, name + '.stale'))
            except OSError:
                pass
    return n


class Runner:
    def __init__(self, args, reg, state):
        self.args, self.reg, self.state = args, reg, state
        self.job = Job()
        self.live = {}
        self.peak_rss = self.peak_prv = 0.0
        self.mem_lock = threading.Lock()
        self.results = []
        self.stop = False

    def run_chunk(self, seg, a, b, since, audit_only=False):
        sid = seg['id']
        os.makedirs(os.path.join(FULL, 'logs'), exist_ok=True)
        logp = os.path.join(FULL, 'logs', f'{sid}_{a}-{b}.log')
        cmd = ['node', RENDERER, seg.get('url', self.reg['url']), seg['page'], frames_dir(sid), str(seg['f0']), str(seg['f1']),
               '--chunk', f'{a}:{b}', '--since', str(since), '--fps', str(self.reg['fps']),
               '--size', f'{self.reg["width"]}x{self.reg["height"]}']
        if audit_only:
            cmd.append('--audit-only')
        for attempt in range(self.args.retries + 1):
            if self.stop:
                return 130
            with open(logp, 'a', encoding='utf-8') as log:
                log.write(f'\n==== {time.strftime("%Y-%m-%d %H:%M:%S")} attempt {attempt + 1}: {" ".join(cmd)}\n')
                log.flush()
                offset = log.tell()
                p = subprocess.Popen(cmd, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT,
                                     creationflags=getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0))
            self.job.add(p.pid)
            self.live[p.pid] = p
            last_size, last_change, pk_rss, pk_prv = -1, time.time(), 0, 0
            while p.poll() is None:
                time.sleep(0.5)
                rss, prv = tree_mem(p.pid)
                pk_rss, pk_prv = max(pk_rss, rss), max(pk_prv, prv)
                try:
                    size = os.path.getsize(logp)
                except OSError:
                    size = last_size
                if size != last_size:
                    last_size, last_change = size, time.time()
                elif time.time() - last_change > self.args.stall:
                    with open(logp, 'a', encoding='utf-8') as log:
                        log.write(f'[watchdog] no output for {self.args.stall} s, killing\n')
                    kill_tree(p.pid)
                if self.stop:
                    kill_tree(p.pid)
            self.live.pop(p.pid, None)
            with self.mem_lock:
                self.peak_rss, self.peak_prv = max(self.peak_rss, pk_rss), max(self.peak_prv, pk_prv)
            res = None
            with open(logp, encoding='utf-8', errors='replace') as f:
                f.seek(offset)
                for line in f:
                    if line.startswith('RESULT '):
                        res = line
            if res and p.returncode == 0:
                r = json.loads(res[7:])
                r.update(id=sid, peak_rss_mb=round(pk_rss), peak_private_mb=round(pk_prv))
                self.results.append(r)
            print(f'  {sid} [{a},{b}) exit {p.returncode}  peak {pk_prv:.0f} MB private / {pk_rss:.0f} MB rss'
                  + (f'  {json.loads(res[7:]).get("ms_per_frame")} ms/frame' if res and p.returncode == 0 else ''), flush=True)
            if p.returncode == 0 or self.stop:
                return p.returncode
            if p.returncode == 3:
                print(f'  {sid}: page error, not retrying; see {logp}', flush=True)
                return 3
        return p.returncode

    def pool(self, tasks):
        """run (seg, a, b, since) tasks with self.jobs workers; returns {sid: [exit codes]}"""
        codes = {}
        lock = threading.Lock()
        it = iter(tasks)

        def worker():
            while not self.stop:
                with lock:
                    t = next(it, None)
                if t is None:
                    return
                c = self.run_chunk(*t)
                with lock:
                    codes.setdefault(t[0]['id'], []).append(c)
        ths = [threading.Thread(target=worker, daemon=True) for _ in range(max(1, self.jobs))]
        for t in ths:
            t.start()
        try:
            while any(t.is_alive() for t in ths):
                for t in ths:
                    t.join(0.5)
        except KeyboardInterrupt:
            self.stop = True
            for pid in list(self.live):
                kill_tree(pid)
            raise
        return codes


def plan_chunks(seg, missing, chunk_frames):
    runs, out = [], []
    for g in missing:
        if runs and g == runs[-1][1]:
            runs[-1][1] = g + 1
        else:
            runs.append([g, g + 1])
    for a, b in runs:
        k = max(1, math.ceil((b - a) / chunk_frames))
        step = math.ceil((b - a) / k)
        for x in range(a, b, step):
            out.append((x, min(b, x + step)))
    return out


def default_jobs(args):
    prof = read_json(PROFILE, {}) or {}
    per = max(prof.get('peak_private_mb', 0), DEFAULT_PRIVATE_MB) * 1.2
    avail = psutil.virtual_memory().available / 2**20
    n = int((avail - args.reserve_mb) // per)
    n = max(1, min(n, (os.cpu_count() or 4) // 2))
    return n, avail, per


def segment_status(seg, reg, state):
    """('done'|'changed'|'partial'|'new', detail, info)"""
    sid = seg['id']
    st = state.d['segments'].get(sid, {})
    done = read_json(os.path.join(FULL, f'{sid}.done'))
    params = page_params(seg, reg)
    epoch = st.get('epoch', 0)
    if done:
        deps = read_json(os.path.join(frames_dir(sid), 'deps.json'), {}) or {}
        files = {f['path']: f['sha1'] for f in deps.get('files', [])}
        now_hash = content_hash(params, current_files(state, files))
        if now_hash != done.get('hash'):
            changed = [p for p in files if state.sha1(p) != files[p]]
            if params != done.get('params'):
                changed.append('page parameters')
            return 'changed', f'{len(changed)} changed: {", ".join(changed[:6])}', {'hash': done.get('hash')}
        epoch = done.get('epoch', epoch)
        miss = missing_frames(seg, epoch)
        if done.get('f0') == seg['f0'] and done.get('f1') == seg['f1'] and not miss:
            return 'done', f'{seg["f1"] - seg["f0"]} frames', {}
        return 'partial', f'{len(miss)} of {seg["f1"] - seg["f0"]} frames missing (range or files)', {'resume_epoch': epoch}
    if st.get('epoch') is not None:
        # an attempt in progress: did a file it used change since?
        files, _, _ = merge_deps(sid, epoch)
        if files and (st.get('params') not in (None, params) or any(state.sha1(p) != h for p, h in files.items())):
            return 'changed', 'files changed during an unfinished attempt', {}
        miss = missing_frames(seg, epoch)
        return 'partial', f'{len(miss)} of {seg["f1"] - seg["f0"]} frames missing', {'resume_epoch': epoch}
    return 'new', 'not rendered', {}


def start_attempt(seg, state, reason):
    sid = seg['id']
    st = state.seg(sid)
    old = read_json(os.path.join(FULL, f'{sid}.done'))
    mp4 = os.path.join(FULL, f'{sid}.mp4')
    tag = (old or {}).get('hash', 'old')[:8]
    if os.path.exists(mp4):
        os.makedirs(os.path.join(FULL, 'prev'), exist_ok=True)
        os.replace(mp4, os.path.join(FULL, 'prev', f'{sid}_{tag}.mp4'))
    if old:
        os.replace(os.path.join(FULL, f'{sid}.done'), os.path.join(FULL, f'{sid}.done.prev'))
    st.clear()
    st.update(epoch=now_ms(), started=time.strftime('%Y-%m-%d %H:%M:%S'), reason=reason)
    state.save()
    return st['epoch']


def finalize(seg, reg, state, runner, args):
    """merge chunk audits/deps of this attempt, verify the frame count, write .done; returns (ok, message)"""
    sid = seg['id']
    st = state.seg(sid)
    epoch = st['epoch']
    n = seg['f1'] - seg['f0']
    miss = missing_frames(seg, epoch)
    if miss:
        return False, f'{len(miss)} frames still missing (first {miss[:5]})'
    if not chunk_files(sid, 'audit', epoch):
        runner.run_chunk(seg, seg['f0'], seg['f0'] + 1, epoch, audit_only=True)
    files, conflicts, changed = merge_deps(sid, epoch)
    if conflicts or changed:
        return False, f'files changed while rendering ({", ".join((conflicts + changed)[:6])}); run again'
    now = current_files(state, files)
    stale = [p for p in files if now[p] != files[p]]
    params = page_params(seg, reg)
    audits = [read_json(p, {}) for p in chunk_files(sid, 'audit', epoch)]
    audit = next((a for a in audits if a and not a.get('_missing')), audits[0] if audits else {'_missing': True})
    differ = [p for p, a in zip(chunk_files(sid, 'audit', epoch), audits)
              if {k: v for k, v in a.items() if k != '_render'} != {k: v for k, v in audit.items() if k != '_render'}]
    consoles = []
    for a in audits:
        for line in (a.get('_render') or {}).get('console', []):
            if line not in consoles:
                consoles.append(line)
    audit = dict(audit)
    audit['_render'] = {**(audit.get('_render') or {}), 'chunk': [seg['f0'], seg['f1']], 'console': consoles,
                        'merged_from': len(audits), 'chunks_differ': len(differ)}
    d = frames_dir(sid)
    write_json(os.path.join(d, 'audit.json'), audit)
    write_json(os.path.join(d, 'deps.json'), {'page_url': params['url'], 'query': params['query'], 'complete': True,
                                              'files': [{'path': p, 'sha1': files[p]} for p in sorted(files)]})
    problems, warns = check_audit(audit)
    if differ:
        warns.append(f'{len(differ)} chunk audit(s) differ from the first')
    res = [r for r in runner.results if r['id'] == sid and r.get('ms_per_frame')]
    msf = round(sum(r['ms'] for r in res) / max(1, sum(r['rendered'] for r in res)), 1) if res else st.get('ms_per_frame')
    h = content_hash(params, files)
    done = {'id': sid, 'hash': h, 'params': params, 'f0': seg['f0'], 'f1': seg['f1'], 'frames': n, 'epoch': epoch,
            'finished': time.strftime('%Y-%m-%d %H:%M:%S'), 'deps': len(files), 'ms_per_frame': msf,
            'audit_problems': problems, 'audit_warnings': warns}
    if args.strict_audit and problems:
        return False, 'audit: ' + '; '.join(problems)
    write_json(os.path.join(FULL, f'{sid}.done'), done)
    st.update(hash=h, params=params, finished=done['finished'], frames=n, ms_per_frame=msf,
              audit_problems=problems, audit_warnings=warns)
    state.save()
    msg = f'{n} frames, hash {h[:10]}, {len(files)} deps'
    if stale:
        msg += f'; WARNING {len(stale)} file(s) changed after rendering: {", ".join(stale[:4])} (next run re-renders)'
    if problems or warns:
        msg += '; audit: ' + '; '.join(problems + warns)
    return True, msg


def cmd_status(args, reg, state):
    segs = SEG.ordered(reg, args.ids, include_todo=args.include_todo)
    for seg in segs:
        s, detail, _ = segment_status(seg, reg, state)
        print(f'{seg["id"]:24s} [{seg["f0"]}, {seg["f1"]})  {seg["status"]:12s} {s:8s} {detail}')
    state.save()


def take_lock():
    p = os.path.join(FULL, '.lock')
    info = read_json(p)
    if info:
        try:
            q = psutil.Process(info['pid'])
            if 'python' in q.name().lower() and any('render_film.py' in c for c in q.cmdline()):
                raise SystemExit(f'another render_film.py is running (pid {info["pid"]})')
        except psutil.Error:
            pass
    write_json(p, {'pid': os.getpid(), 'started': time.strftime('%Y-%m-%d %H:%M:%S')})
    return p


def cmd_run(args, reg, state):
    os.makedirs(FULL, exist_ok=True)
    lock = take_lock()
    segs = SEG.ordered(reg, args.ids, include_todo=args.include_todo)
    k = kill_orphans(segs)
    if k:
        print(f'killed {k} render process(es) left by an earlier run')
    runner = Runner(args, reg, state)
    if args.jobs:
        runner.jobs = args.jobs
    else:
        runner.jobs, avail, per = default_jobs(args)
        print(f'jobs = {runner.jobs} (available {avail:.0f} MB - reserve {args.reserve_mb} MB, {per:.0f} MB per render)')
    t_start = time.time()
    todo = []
    for seg in segs:
        s, detail, info = segment_status(seg, reg, state)
        if s == 'done' and not args.force:
            print(f'{seg["id"]}: up to date ({detail})')
            continue
        if s in ('changed', 'new') or args.force:
            epoch = start_attempt(seg, state, 'forced' if args.force else f'{s}: {detail}')
        else:
            epoch = info['resume_epoch']
            st = state.seg(seg['id'])
            st['epoch'] = epoch
        st = state.seg(seg['id'])
        st['params'] = page_params(seg, reg)
        miss = missing_frames(seg, epoch)
        print(f'{seg["id"]}: {s} ({detail}) -> {len(miss)} frames to render')
        todo.append((seg, epoch, miss))
    state.save()
    failed = []
    try:
        for rnd in range(args.retries + 1):
            tasks = []
            for seg, epoch, miss in todo:
                if rnd:
                    miss = missing_frames(seg, epoch)
                cf = args.chunk_frames or max(60, math.ceil(len(miss) / runner.jobs)) if miss else 1
                tasks += [(seg, a, b, epoch) for a, b in plan_chunks(seg, miss, cf)]
            if not tasks:
                break
            if rnd:
                print(f'round {rnd + 1}: {len(tasks)} chunk(s) to fill gaps')
            codes = runner.pool(tasks)
            if any(3 in c for c in codes.values()):
                todo = [t for t in todo if 3 not in codes.get(t[0]['id'], [])]
                failed += [sid for sid, c in codes.items() if 3 in c]
        for seg, epoch, _ in todo:
            ok, msg = finalize(seg, reg, state, runner, args)
            print(f'{seg["id"]}: {"DONE" if ok else "NOT DONE"} {msg}')
            if not ok:
                failed.append(seg['id'])
    except KeyboardInterrupt:
        print('interrupted; run the same command again to render the missing frames')
        state.save()
        return 130
    finally:
        if runner.peak_prv:
            prof = read_json(PROFILE, {}) or {}
            if runner.peak_prv > prof.get('peak_private_mb', 0) or runner.peak_rss > prof.get('peak_rss_mb', 0):
                prof.update(peak_private_mb=round(max(runner.peak_prv, prof.get('peak_private_mb', 0))),
                            peak_rss_mb=round(max(runner.peak_rss, prof.get('peak_rss_mb', 0))),
                            updated=time.strftime('%Y-%m-%d %H:%M:%S'))
                write_json(PROFILE, prof)
        res = runner.results
        nr = sum(r['rendered'] for r in res)
        if nr:
            print(f'rendered {nr} frames in {time.time() - t_start:.0f} s with {runner.jobs} job(s); '
                  f'peak per render {runner.peak_prv:.0f} MB private / {runner.peak_rss:.0f} MB rss')
        try:
            os.replace(lock, lock + '.last')
        except OSError:
            pass
    return 1 if failed else 0


def cmd_measure(args, reg, state):
    """render N frames of one segment into a scratch folder with one process and record its memory and speed"""
    seg = SEG.ordered(reg, args.ids)[0]
    out = os.path.join(FULL, 'measure', seg['id'])
    a = seg['f0']
    b = min(seg['f1'], a + args.frames)
    cmd = ['node', RENDERER, seg.get('url', reg['url']), seg['page'], out, str(seg['f0']), str(seg['f1']),
           '--chunk', f'{a}:{b}', '--since', str(now_ms())]
    job = Job()
    t0 = time.time()
    p = subprocess.Popen(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8', errors='replace')
    job.add(p.pid)
    pk = [0, 0]
    lines = []

    def reader():
        for line in p.stdout:
            lines.append(line)
    th = threading.Thread(target=reader, daemon=True)
    th.start()
    while p.poll() is None:
        r, v = tree_mem(p.pid)
        pk = [max(pk[0], r), max(pk[1], v)]
        time.sleep(0.1)
    th.join(5)
    res = next((json.loads(x[7:]) for x in lines if x.startswith('RESULT ')), {})
    prof = {'peak_rss_mb': round(pk[0]), 'peak_private_mb': round(pk[1]), 'ms_per_frame': res.get('ms_per_frame'),
            'build_ms': res.get('build_ms'), 'frames': res.get('rendered'), 'wall_s': round(time.time() - t0, 1),
            'segment': seg['id'], 'updated': time.strftime('%Y-%m-%d %H:%M:%S')}
    old = read_json(PROFILE, {}) or {}
    prof['peak_private_mb'] = max(prof['peak_private_mb'], old.get('peak_private_mb', 0))
    prof['peak_rss_mb'] = max(prof['peak_rss_mb'], old.get('peak_rss_mb', 0))
    write_json(PROFILE, prof)
    print(json.dumps({**prof, 'this_run_rss_mb': round(pk[0]), 'this_run_private_mb': round(pk[1]), 'exit': p.returncode}))
    return p.returncode


def main():
    global FULL
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['run', 'status', 'measure'])
    ap.add_argument('--ids', type=lambda s: [x for x in s.split(',') if x])
    ap.add_argument('--jobs', type=int)
    ap.add_argument('--chunk-frames', type=int)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--include-todo', action='store_true')
    ap.add_argument('--reserve-mb', type=int, default=1500)
    ap.add_argument('--stall', type=int, default=240)
    ap.add_argument('--retries', type=int, default=2)
    ap.add_argument('--strict-audit', action='store_true')
    ap.add_argument('--frames', type=int, default=90)
    ap.add_argument('--registry', default=SEG.REGISTRY, help='segment registry (default web/segments.json)')
    ap.add_argument('--work', default=FULL, help='work folder for frames, state and .done files (default work/full)')
    args = ap.parse_args()
    FULL = os.path.abspath(args.work)
    reg = SEG.load(args.registry)
    errors, _ = SEG.check(reg, scope='all' if args.include_todo else 'active', allow_gaps=True, quiet=True)
    if errors:
        print('segments.json has errors:\n  ' + '\n  '.join(errors))
        return 1
    state = State()
    return {'run': cmd_run, 'status': cmd_status, 'measure': cmd_measure}[args.cmd](args, reg, state)


if __name__ == '__main__':
    sys.exit(main())
