#!/usr/bin/env python3
"""
Conservative fixes for common words missing final 'ة' after previous cleanup.
Only edits files changed in last commit (HEAD)..
"""
import subprocess
from pathlib import Path
import re

REPLACEMENTS = [
    (re.compile(r'اسم\s+الماد\b'), 'اسم المادة'),
    (re.compile(r'\bالماد\b'), 'المادة'),
    (re.compile(r'\bماد\b'), 'مادة'),
    (re.compile(r'البحث\s+في\s+الكلي\b'), 'البحث في الكلية'),
    (re.compile(r'\bكلي\b'), 'كلية'),
    (re.compile(r'الجامع\b'), 'الجامعة'),
]

def git_changed_files():
    p = subprocess.run(['git','diff','--name-only','HEAD^','HEAD'], capture_output=True, text=True)
    return [s.strip() for s in p.stdout.splitlines() if s.strip()]

def process_file(path):
    p = Path(path)
    try:
        txt = p.read_text(encoding='utf-8')
    except Exception:
        return False, 'read-failed'
    orig = txt
    for pat, repl in REPLACEMENTS:
        txt = pat.sub(repl, txt)
    if txt != orig:
        p.write_text(txt, encoding='utf-8')
        return True, 'changed'
    return False, 'no-change'

def main():
    files = git_changed_files()
    summary = {'changed':0,'scanned':0}
    for f in files:
        if not Path(f).exists():
            continue
        if not Path(f).suffix in ('.js','.jsx','.ts','.tsx','.json','.css','.md'):
            continue
        summary['scanned'] += 1
        ok,msg = process_file(f)
        if ok:
            summary['changed'] += 1
            print('UPDATED', f)
    print('Scanned', summary['scanned'], 'files, updated', summary['changed'])

if __name__ == '__main__':
    main()
