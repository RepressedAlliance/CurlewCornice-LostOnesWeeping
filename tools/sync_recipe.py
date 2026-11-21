"""Replace the 'query：' line of a style-frame recipe file with the contents of a query file.
usage: python tools/sync_recipe.py work/样张01_检票口_参数.txt work/g01_v2_query.txt"""
import sys
recipe, qfile = sys.argv[1], sys.argv[2]
q = open(qfile, encoding='utf-8').read().strip()
lines = open(recipe, encoding='utf-8').read().split('\n')
lines = [('query：' + q) if l.startswith('query：') else l for l in lines]
open(recipe, 'w', encoding='utf-8').write('\n'.join(lines))
print('synced', recipe)
