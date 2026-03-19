#!/usr/bin/env python3
"""
find-brand-mentions.py

Scans all markdown files in content/ for bare "Provenance" mentions
that are not yet wrapped in {{< brand >}}...{{< /brand >}}.

Usage:
  python3 scripts/find-brand-mentions.py           # review mode (default)
  python3 scripts/find-brand-mentions.py --apply   # auto-replace all matches

Output (review mode):
  FILE:LINE  (N mentions)
    PREV: ...surrounding line...
    MATCH: ...matching line...
    NEXT: ...surrounding line...
"""

import re
import sys
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content"

# Lines where Provenance should NOT be wrapped (even if bare):
SKIP_LINE_PATTERNS = [
    re.compile(r'^\s*#'),                          # headings
    re.compile(r'https?://\S*Provenance'),          # Provenance in URLs
    re.compile(r'Provenance-Emu/'),                # GitHub org paths
    re.compile(r'Provenance-[a-zA-Z]+\.(ipa|app|zip|dmg)'),  # file names
    re.compile(r'`[^`]*Provenance[^`]*`'),          # inline code
    re.compile(r'^\s*-{3,}\s*$'),                  # frontmatter delimiter
    re.compile(r'Merge pull request.*Provenance'),  # git merge commit lines
    re.compile(r'from Provenance-Emu/'),            # branch paths
]

# Pattern to detect Provenance inside markdown link text [Provenance...](...)
# Shortcodes cannot be used inside markdown link text
LINK_TEXT_PATTERN = re.compile(r'\[([^\]]*Provenance[^\]]*)\]\([^)]+\)')


def has_provenance_only_in_link_text(line):
    """Return True if ALL bare Provenance occurrences are inside markdown link text."""
    # Remove all link-text occurrences to see if any Provenance remains
    cleaned = LINK_TEXT_PATTERN.sub(lambda m: '[' + m.group(1).replace('Provenance', '') + ']()', line)
    # Also remove already-wrapped ones
    cleaned = re.sub(r'\{\{<\s*brand\s*>\}\}Provenance\{\{<\s*/brand\s*>\}\}', '', cleaned)
    return 'Provenance' not in cleaned


def parse_file(filepath):
    """Return list of (lineno, line, in_code_block, in_frontmatter) tuples."""
    lines = filepath.read_text(encoding='utf-8').splitlines()
    result = []
    in_frontmatter = False
    frontmatter_done = False
    fence_count = 0  # track nested ``` blocks

    for i, line in enumerate(lines):
        # Frontmatter detection (only at top of file)
        if i == 0 and line.strip() == '---':
            in_frontmatter = True
            result.append((i + 1, line, False, True))
            continue
        if in_frontmatter and line.strip() == '---':
            in_frontmatter = False
            frontmatter_done = True
            result.append((i + 1, line, False, True))
            continue
        if in_frontmatter:
            result.append((i + 1, line, False, True))
            continue

        # Code block detection
        if line.strip().startswith('```'):
            fence_count = 1 - fence_count  # toggle
        in_code = fence_count == 1

        result.append((i + 1, line, in_code, False))

    return result


def should_skip_line(line):
    for pat in SKIP_LINE_PATTERNS:
        if pat.search(line):
            return True
    return False


def is_already_wrapped(line):
    """Return True if every Provenance in the line is already brand-wrapped."""
    bare = re.sub(r'\{\{<\s*brand\s*>\}\}Provenance\{\{<\s*/brand\s*>\}\}', '', line)
    return 'Provenance' not in bare


def find_mentions(filepath):
    parsed = parse_file(filepath)
    results = []

    for i, (lineno, line, in_code, in_front) in enumerate(parsed):
        if in_front or in_code:
            continue
        if 'Provenance' not in line:
            continue
        if should_skip_line(line):
            continue
        if is_already_wrapped(line):
            continue
        if has_provenance_only_in_link_text(line):
            continue

        prev_line = parsed[i - 1][1] if i > 0 else ''
        next_line = parsed[i + 1][1] if i < len(parsed) - 1 else ''
        results.append((lineno, prev_line, line, next_line))

    return results


def apply_replacement_to_line(line):
    """Wrap bare Provenance in brand shortcode, avoiding double-wrapping."""
    if should_skip_line(line):
        return line, False

    # First: replace **Provenance** (bold-only) with brand shortcode
    result = re.sub(r'\*\*Provenance\*\*', '{{< brand >}}Provenance{{< /brand >}}', line)

    # Then: replace remaining bare Provenance (not in link text, not already wrapped)
    def replacer(m):
        start = m.start()
        # Check if inside markdown link text [...]
        for lm in LINK_TEXT_PATTERN.finditer(result):
            if lm.start(1) <= start <= lm.end(1):
                return m.group(0)  # leave alone
        return '{{< brand >}}Provenance{{< /brand >}}'

    result = re.sub(r'(?<!\{\{< brand >\}\})Provenance(?!\{\{< /brand >\}\})', replacer, result)
    return result, result != line


def apply_replacements(filepath):
    parsed = parse_file(filepath)
    lines_out = []
    changed = False

    for lineno, line, in_code, in_front in parsed:
        if in_front or in_code or 'Provenance' not in line:
            lines_out.append(line)
            continue
        if is_already_wrapped(line):
            lines_out.append(line)
            continue

        new_line, line_changed = apply_replacement_to_line(line)
        lines_out.append(new_line)
        if line_changed:
            changed = True

    if changed:
        filepath.write_text('\n'.join(lines_out) + '\n', encoding='utf-8')

    return changed


def main():
    apply_mode = '--apply' in sys.argv

    md_files = sorted(CONTENT_DIR.rglob('*.md'))
    total_matches = 0
    files_with_matches = 0

    for filepath in md_files:
        rel = filepath.relative_to(CONTENT_DIR.parent)

        if apply_mode:
            changed = apply_replacements(filepath)
            if changed:
                print(f"  UPDATED: {rel}")
                files_with_matches += 1
        else:
            mentions = find_mentions(filepath)
            if not mentions:
                continue
            files_with_matches += 1
            print(f"\n{'='*70}")
            print(f"  {rel}  ({len(mentions)} mention{'s' if len(mentions) != 1 else ''})")
            print(f"{'='*70}")
            for lineno, prev, match, nxt in mentions:
                total_matches += 1
                print(f"\n  Line {lineno}:")
                if prev.strip():
                    print(f"    PREV:  {prev[:100]}")
                print(f"    MATCH: {match[:120]}")
                if nxt.strip():
                    print(f"    NEXT:  {nxt[:100]}")

    if apply_mode:
        print(f"\nDone. Updated {files_with_matches} file(s).")
    else:
        print(f"\n{'='*70}")
        print(f"Found {total_matches} bare mention(s) across {files_with_matches} file(s).")
        print(f"Run with --apply to auto-replace all matches.")
        print(f"{'='*70}\n")


if __name__ == '__main__':
    main()
