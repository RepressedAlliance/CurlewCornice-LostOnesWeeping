"""Watchdog for background work, meant to run under the Monitor tool: every line it prints is an event that reaches me.
Background jobs here (renders, Codex batches, review agents) can fail to start, die, hang or finish with missing output
without any notification; this checks the expected output and the job's own log itself and speaks up at once.

usage: python tools/watch_jobs.py spec.json
spec: {"poll": 15, "stall_min": 4, "jobs": [
         {"name": "main render", "dir": "work/v4/main", "glob": ".png", "expect": 356, "rc": "<resource-care job id>"},
         {"name": "codex r56", "files": ["art/design/out/a.png", "art/design/out/b.png"], "rc": "<id>"},
         {"name": "review 2D", "file": "work/review_demo/v2_2d/report.md", "deadline_min": 15,
          "started": "work/review_demo/v2_2d/report.md.log", "rc": "<id>"}]}
Per job, optional: "rc" (resource-care job id, its log is read) or "log" (any log path); "fail" (regex, default below)
is searched in that log; "started" (a file the job creates at once) must appear within "start_min" (default 1.5).
Prints: START, PROGRESS (25/50/75 %), FAILED (failure line in the log), NOT STARTED, STALL (no new output for
stall_min), DONE, LATE (deadline passed); exits when every job is DONE (0) or every unfinished job needs attention (1).
"""
import json, os, re, sys, time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RC_LOGS = os.environ.get('RC_LOGS') or os.path.join(ROOT, 'work', 'logs')   # where the job launcher writes process logs
FAIL = r'CreateProcess failed|REVIEW FAILED|BATCH INCOMPLETE|FAIL missing|Traceback|Error: |ERROR:|exited with code [1-9]'
spec = json.load(open(sys.argv[1], encoding='utf-8'))
POLL, STALL = spec.get('poll', 15), spec.get('stall_min', 4) * 60
t_start = time.time()


def path(p):
    return p if os.path.isabs(p) else os.path.join(ROOT, p)


def count(job):
    if 'dir' in job:
        d = path(job['dir'])
        return len([f for f in os.listdir(d) if f.endswith(job.get('glob', ''))]) if os.path.isdir(d) else 0
    if 'files' in job:
        return sum(1 for f in job['files'] if os.path.exists(path(f)) and os.path.getsize(path(f)) > 0)
    if 'file' in job:
        f = path(job['file'])
        return 1 if os.path.exists(f) and os.path.getsize(f) > 0 else 0
    return 0


def expect(job):
    return job.get('expect') or (len(job['files']) if 'files' in job else 1)


def failure(job):
    log = job.get('log') or (os.path.join(RC_LOGS, job['rc'] + '.log') if 'rc' in job else None)
    if not log or not os.path.exists(path(log)): return None
    try:
        text = open(path(log), encoding='utf-8', errors='replace').read()
    except OSError:
        return None
    m = re.search(job.get('fail', FAIL), text)
    return text[max(0, text.rfind('\n', 0, m.start()) + 1):].split('\n')[0][:200] if m else None


state = {}
for j in spec['jobs']:
    state[j['name']] = {'n': count(j), 't': time.time(), 'marks': set(), 'status': 'run'}
    print(f"START {j['name']}: {state[j['name']]['n']}/{expect(j)}", flush=True)
while True:
    time.sleep(POLL)
    now = time.time()
    for j in spec['jobs']:
        s = state[j['name']]
        if s['status'] in ('done', 'failed'): continue
        n, e = count(j), expect(j)
        if n != s['n']: s['n'], s['t'] = n, now
        if n >= e:
            s['status'] = 'done'; print(f"DONE {j['name']}: {n}/{e} after {(now - t_start) / 60:.1f} min", flush=True); continue
        bad = failure(j)
        if bad:
            s['status'] = 'failed'; print(f"FAILED {j['name']} at {n}/{e}: {bad}", flush=True); continue
        if 'started' in j and s['status'] == 'run' and not os.path.exists(path(j['started'])) \
                and now - t_start > j.get('start_min', 1.5) * 60:
            s['status'] = 'nostart'; print(f"NOT STARTED {j['name']}: {j['started']} missing, restart it now", flush=True); continue
        if s['status'] == 'stall' and now - s['t'] < STALL: s['status'] = 'run'
        crossed = [m for m in (25, 50, 75) if n * 100 >= m * e and m not in s['marks']]
        if crossed: s['marks'].update(crossed); print(f"PROGRESS {j['name']}: {n}/{e}", flush=True)
        if 'deadline_min' in j and now - t_start > j['deadline_min'] * 60 and s['status'] == 'run':
            s['status'] = 'late'; print(f"LATE {j['name']}: no result after {j['deadline_min']} min, check it now", flush=True)
        elif 'deadline_min' not in j and now - s['t'] > STALL and s['status'] == 'run':
            s['status'] = 'stall'; print(f"STALL {j['name']}: stuck at {n}/{e} for {(now - s['t']) / 60:.0f} min, check it now", flush=True)
    if all(s['status'] == 'done' for s in state.values()):
        print('ALL DONE', flush=True); sys.exit(0)
    if all(s['status'] != 'run' for s in state.values()):
        print('NEEDS ATTENTION: ' + ', '.join(k for k, s in state.items() if s['status'] != 'done'), flush=True); sys.exit(1)
