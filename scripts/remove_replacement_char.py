#!/usr/bin/env python3
"""
Scan source files and remove the Unicode replacement character (�, U+FFFD).
Writes files in-place using UTF-8.
"""
from pathlib import Path
import sys

ROOT = Path('.')
EXTS = {'.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.md', '.html'}

def should_process(p: Path):
    if not p.is_file():
        return False
    if any(part == 'node_modules' or part.startswith('.git') for part in p.parts):
        return False
    return p.suffix in EXTS

def main():
    files = list(ROOT.rglob('*'))
    changed = 0
    total = 0
    for p in files:
        if should_process(p):
            try:
                txt = p.read_text(encoding='utf-8', errors='replace')
            except Exception:
                continue
            if '�' in txt:
                total += txt.count('�')
                new = txt.replace('�', '')
                p.write_text(new, encoding='utf-8')
                changed += 1
    print(f"Files changed: {changed}")
    print(f"Total replacement chars removed: {total}")

if __name__ == '__main__':
    main()
