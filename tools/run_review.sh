#!/usr/bin/env bash
# Same as run_review.ps1 without PowerShell (the Store pwsh cannot be started from Git Bash, and resource-care's starts of it
# fail at random with CreateProcess error 5): a headless claude -p with read-only tools, prompt from a file, report to a file.
# usage: bash tools/run_review.sh <prompt_file> <out_file>
p="$1"; out="$2"; tmp="$out.part"; log="$out.log"
claude -p --allowedTools "Read,Glob,Grep" --output-format text < "$p" > "$tmp" 2> "$log"
code=$?
if [ $code -eq 0 ] && [ -s "$tmp" ] && [ $(wc -c < "$tmp") -gt 200 ]; then mv -f "$tmp" "$out"; echo "REVIEW OK $out"; else echo "REVIEW FAILED (exit $code), see $log"; exit 1; fi
