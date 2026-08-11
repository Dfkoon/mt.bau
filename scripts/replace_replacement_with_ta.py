#!/usr/bin/env python3
"""
Restore files from previous commit (HEAD^) replacing Unicode replacement char � with Arabic taa-marbuTa 'ة'.
Only processes files changed in the last commit.
"""
import subprocess
from pathlib import Path
import sys

def git_list_changed():
    p = subprocess.run(['git','diff','--name-only','HEAD^','HEAD'], capture_output=True, text=True)
    return [s.strip() for s in p.stdout.splitlines() if s.strip()]

def restore_and_replace(path):
    try:
        p = subprocess.run(['git','show', f'HEAD^:{path}'], capture_output=True)
        if p.returncode != 0:
            return False, f'git show failed for {path}'
        content = p.stdout.decode('utf-8', errors='replace')
        if '�' not in content:
            return False, 'no replacement char in previous version'
        new = content.replace('�', 'ة')
        Path(path).write_text(new, encoding='utf-8')
        return True, 'restored and replaced'
    except Exception as e:
        return False, str(e)

def main():
    files = git_list_changed()
    if not files:
        print('No files changed in last commit')
        return
    processed = 0
    for f in files:
        ok, msg = restore_and_replace(f)
        print(f, ok, msg)
        if ok:
            processed += 1
    print('Processed', processed, 'files')

if __name__ == '__main__':
    main()
