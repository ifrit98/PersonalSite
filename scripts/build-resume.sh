#!/usr/bin/env bash
# Rebuilds the public résumé PDF from its only source, tex-src/main.tex.
#
# The PDF and the /resume page are two renderings of the same claims, and the
# PDF is the one that leaves the site and gets forwarded. Regenerating it by
# hand is how they drift apart, so: edit main.tex, run this, commit both.
#
#   npm run build:resume
#
# Uses tectonic (brew install tectonic) — it fetches what it needs and needs no
# TeX Live install.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT

command -v tectonic >/dev/null || {
  echo "tectonic not found. Install it with: brew install tectonic" >&2
  exit 1
}

cd "$root/tex-src"
tectonic -X compile main.tex --outdir "$out" >/dev/null 2>&1 || {
  echo "tectonic failed; rerun without output suppression to see the log" >&2
  exit 1
}

cp "$out/main.pdf" "$root/public/papers/resume.pdf"
echo "public/papers/resume.pdf rebuilt from tex-src/main.tex ($(wc -c < "$root/public/papers/resume.pdf") bytes)"
