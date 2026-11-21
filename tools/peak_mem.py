"""Run a command and report wall time and peak working set of it and its children.
usage: python peak_mem.py <cmd> [args...]"""
import subprocess, sys, time
import psutil

t0 = time.time()
p = subprocess.Popen(sys.argv[1:])
peak = 0
pp = psutil.Process(p.pid)
while p.poll() is None:
    try:
        procs = [pp] + pp.children(recursive=True)
        rss = sum(x.memory_info().rss for x in procs if x.is_running())
        peak = max(peak, rss)
    except psutil.Error:
        pass
    time.sleep(0.1)
print(f'PEAK_MB {peak / 2**20:.0f}  WALL_S {time.time() - t0:.1f}  EXIT {p.returncode}')
