"""Build a Codex job list: each prompt in art/design/prompts/<name>.txt plus the shared style text
(art/design/prompts/_style.txt, unless the name is listed with a leading '-') -> art/design/out/<name>.png.
usage: python tools/make_jobs.py <jobs_name> <name> [-name] [name:ref1.png+ref2.png] ...
"""
import json, os, sys

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'art', 'design')).replace('\\', '/')
style = open(f'{root}/prompts/_style.txt', encoding='utf-8').read().strip()
jobs = []
for arg in sys.argv[2:]:
    no_style = arg.startswith('-')
    arg = arg.lstrip('-')
    name, _, refs = arg.partition(':')
    body = open(f'{root}/prompts/{name}.txt', encoding='utf-8').read().strip()
    full = f'{root}/prompts/{name}_full.txt'
    open(full, 'w', encoding='utf-8').write(body if no_style else body + '\n\n' + style)
    job = {'prompt': full, 'out': f'{root}/out/{name}.png'}
    if refs:
        job['ref'] = [r if os.path.isabs(r) else f'{root}/{r}' for r in refs.split('+')]
    jobs.append(job)
os.makedirs(f'{root}/jobs', exist_ok=True)
path = f'{root}/jobs/{sys.argv[1]}.json'
json.dump(jobs, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs ->', path)
