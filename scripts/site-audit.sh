#!/usr/bin/env bash
# site-audit.sh — Local site audit runner for provenance-emu.com
#
# Usage:
#   ./scripts/site-audit.sh                  # Audit live site
#   ./scripts/site-audit.sh --local          # Build locally, audit localhost
#   ./scripts/site-audit.sh --url https://…  # Audit a specific URL
#   ./scripts/site-audit.sh --output report.md
#
# Tools used (install what you have, the rest are skipped):
#   htmlproofer  — gem install html-proofer
#   lighthouse   — npm install -g lighthouse
#   pa11y        — npm install -g pa11y
#   jq           — brew install jq

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
LIVE_URL="https://provenance-emu.com"
LOCAL_PORT=1315
HUGO_PUBLIC="./public"
HTMLPROOFER_IGNORE_URLS="/localhost/,/twitter\.com/,/x\.com/,/fonts\.gstatic\.com/,/fonts\.googleapis\.com/,/discord\.gg/,/api\.github\.com/"
HTMLPROOFER_IGNORE_CODES="0,429,999,403"
LH_THRESHOLD_PERF=70
LH_THRESHOLD_A11Y=80
LH_THRESHOLD_SEO=90

# ── Argument parsing ─────────────────────────────────────────────────────────
MODE="live"
AUDIT_URL="$LIVE_URL"
OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --local)  MODE="local"; AUDIT_URL="http://localhost:$LOCAL_PORT"; shift ;;
    --url)    AUDIT_URL="$2"; shift 2 ;;
    --output) OUTPUT_FILE="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[0;33m'; GREEN='\033[0;32m'; NC='\033[0m'; BOLD='\033[1m'
has() { command -v "$1" &>/dev/null; }
log()  { echo -e "${BOLD}▸ $*${NC}" >&2; }
ok()   { echo -e "${GREEN}✓${NC} $*" >&2; }
warn() { echo -e "${YELLOW}⚠${NC}  $*" >&2; }
fail() { echo -e "${RED}✗${NC} $*" >&2; }

REPORT=""
PASS=0; FAIL=0; SKIP=0
NOW=$(date -u +"%Y-%m-%d %H:%M UTC")

append() { REPORT+="$*"$'\n'; }
section() { append ""; append "---"; append ""; append "## $*"; append ""; }
score_icon() {
  local s=$1 t=$2
  if   [ "$s" -ge 90 ];     then echo "🟢"
  elif [ "$s" -ge "$t" ];   then echo "🟡"
  else echo "🔴"; fi
}

# ── Header ───────────────────────────────────────────────────────────────────
append "# Site Audit Report — provenance-emu.com"
append ""
append "> **Generated:** $NOW"
append "> **Target:** \`$AUDIT_URL\`"
append "> **Mode:** $MODE"

# ── Local build ───────────────────────────────────────────────────────────────
SERVER_PID=""
if [ "$MODE" = "local" ]; then
  section "Build"
  if ! has hugo; then
    fail "hugo not found — install Hugo to use --local mode"
    exit 1
  fi
  log "Building site…"
  hugo --minify --quiet 2>&1 | tail -5
  ok "Hugo build complete"
  append "Hugo build **passed**."

  log "Starting local server on port $LOCAL_PORT…"
  hugo server --port "$LOCAL_PORT" --disableLiveReload --quiet &
  SERVER_PID=$!
  sleep 3
  ok "Server running (PID $SERVER_PID)"
fi

# ── HTML & Link Check ─────────────────────────────────────────────────────────
section "HTML & Link Check"
if ! has htmlproofer; then
  warn "htmlproofer not found — skipping (gem install html-proofer)"
  append "⚠️ **Skipped** — install with \`gem install html-proofer\`"
  ((SKIP++))
else
  if [ "$MODE" = "local" ]; then
    log "Running htmlproofer on $HUGO_PUBLIC…"
    HTMLPROOFER_TMP=$(mktemp)
    if htmlproofer "$HUGO_PUBLIC" \
        --checks Links,Images,Scripts,OpenGraph \
        --ignore-urls "$HTMLPROOFER_IGNORE_URLS" \
        --ignore-status-codes "$HTMLPROOFER_IGNORE_CODES" \
        --typhoeus-concurrency 5 \
        2>&1 | tee "$HTMLPROOFER_TMP"; then
      ok "htmlproofer passed"
      append "✅ **Passed** — no broken links or missing images found."
      ((PASS++))
    else
      ERROR_COUNT=$(grep -c "ERROR" "$HTMLPROOFER_TMP" 2>/dev/null || echo "?")
      fail "htmlproofer found $ERROR_COUNT errors"
      append "❌ **Failed** — $ERROR_COUNT errors found."
      append ""
      append "<details><summary>Error details</summary>"
      append ""
      append '```'
      grep "ERROR" "$HTMLPROOFER_TMP" | head -40 >> /dev/null
      grep "ERROR" "$HTMLPROOFER_TMP" | head -40 | while read -r line; do append "$line"; done
      append '```'
      append ""
      append "</details>"
      ((FAIL++))
    fi
    rm -f "$HTMLPROOFER_TMP"
  else
    warn "htmlproofer works on local builds only — run with --local for link checking"
    append "⚠️ **Skipped** — use \`--local\` mode to run htmlproofer against the built site."
    ((SKIP++))
  fi
fi

# ── Lighthouse ────────────────────────────────────────────────────────────────
section "Lighthouse Performance / SEO / Accessibility"
LH_CMD=""
has lighthouse && LH_CMD="lighthouse"
has lhci && LH_CMD="lhci collect"

if [ -z "$LH_CMD" ]; then
  warn "lighthouse not found — skipping (npm install -g lighthouse)"
  append "⚠️ **Skipped** — install with \`npm install -g lighthouse\`"
  ((SKIP++))
else
  log "Running Lighthouse against $AUDIT_URL…"
  LH_TMP=$(mktemp -d)
  lighthouse "$AUDIT_URL" \
    --output json \
    --output-path "$LH_TMP/report.json" \
    --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
    --quiet 2>/dev/null || true

  LH_JSON="$LH_TMP/report.json"
  if [ ! -f "$LH_JSON" ]; then
    fail "Lighthouse did not produce output"
    append "❌ **Failed** — Lighthouse did not produce a report."
    ((FAIL++))
  else
    PERF=$(jq '.categories.performance.score * 100 | round' < "$LH_JSON" 2>/dev/null || echo 0)
    A11Y=$(jq '.categories.accessibility.score * 100 | round' < "$LH_JSON" 2>/dev/null || echo 0)
    BP=$(jq '."categories"."best-practices".score * 100 | round' < "$LH_JSON" 2>/dev/null || echo 0)
    SEO=$(jq '.categories.seo.score * 100 | round' < "$LH_JSON" 2>/dev/null || echo 0)

    append "| Category | Score | Status |"
    append "|---|:---:|:---:|"
    append "| Performance    | $PERF  | $(score_icon $PERF  $LH_THRESHOLD_PERF) |"
    append "| Accessibility  | $A11Y  | $(score_icon $A11Y  $LH_THRESHOLD_A11Y) |"
    append "| Best Practices | $BP    | $(score_icon $BP    80) |"
    append "| SEO            | $SEO   | $(score_icon $SEO   $LH_THRESHOLD_SEO) |"
    append ""

    LH_FAILED=0
    [ "$PERF" -lt "$LH_THRESHOLD_PERF" ] && { fail "Performance $PERF < $LH_THRESHOLD_PERF"; LH_FAILED=1; }
    [ "$A11Y" -lt "$LH_THRESHOLD_A11Y" ] && { fail "Accessibility $A11Y < $LH_THRESHOLD_A11Y"; LH_FAILED=1; }
    [ "$SEO"  -lt "$LH_THRESHOLD_SEO"  ] && { fail "SEO $SEO < $LH_THRESHOLD_SEO"; LH_FAILED=1; }

    if [ "$LH_FAILED" -eq 0 ]; then
      ok "Lighthouse scores all above thresholds"
      ((PASS++))
    else
      ((FAIL++))
    fi

    # Top opportunities
    if has jq; then
      append "**Top opportunities:**"
      append ""
      jq -r '.audits | to_entries[]
        | select(.value.score != null and .value.score < 0.9 and .value.details.type == "opportunity")
        | "- **\(.value.title)** — \(.value.displayValue // "see report")"' \
        < "$LH_JSON" 2>/dev/null | head -8 | while read -r line; do append "$line"; done
    fi
  fi
  rm -rf "$LH_TMP"
fi

# ── Pa11y Accessibility ───────────────────────────────────────────────────────
section "Pa11y Accessibility (WCAG 2.1 AA)"
if ! has pa11y; then
  warn "pa11y not found — skipping (npm install -g pa11y)"
  append "⚠️ **Skipped** — install with \`npm install -g pa11y\`"
  ((SKIP++))
else
  log "Running pa11y against $AUDIT_URL…"
  PA11Y_OUT=$(pa11y --standard WCAG2AA --reporter cli "$AUDIT_URL" 2>&1 || true)
  ISSUES=$(echo "$PA11Y_OUT" | grep -c "Error\|Warning\|Notice" 2>/dev/null || echo 0)
  ERRORS=$(echo "$PA11Y_OUT" | grep -c "^  Error:" 2>/dev/null || echo 0)

  if [ "$ERRORS" -eq 0 ]; then
    ok "Pa11y: no WCAG errors ($ISSUES notices/warnings)"
    append "✅ **Passed** — 0 WCAG 2.1 AA errors ($ISSUES notices/warnings)."
    ((PASS++))
  else
    fail "Pa11y: $ERRORS WCAG errors"
    append "❌ **Failed** — $ERRORS WCAG 2.1 AA errors."
    append ""
    append "<details><summary>Issues</summary>"
    append ""
    append '```'
    echo "$PA11Y_OUT" | head -50 | while read -r line; do append "$line"; done
    append '```'
    append ""
    append "</details>"
    ((FAIL++))
  fi
fi

# ── Mozilla Observatory ───────────────────────────────────────────────────────
section "Security Headers — Mozilla Observatory"
log "Scanning security headers…"
OBS_TRIGGER=$(curl -sX POST "https://http-observatory.security.mozilla.org/api/v1/analyze?host=provenance-emu.com" 2>/dev/null || echo "{}")
sleep 12
OBS_RESULT=$(curl -s "https://http-observatory.security.mozilla.org/api/v1/analyze?host=provenance-emu.com" 2>/dev/null || echo "{}")
OBS_GRADE=$(echo "$OBS_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('grade','N/A'))" 2>/dev/null || echo "N/A")
OBS_SCORE=$(echo "$OBS_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('score',0))" 2>/dev/null || echo "0")
OBS_STATE=$(echo "$OBS_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('state','unknown'))" 2>/dev/null || echo "unknown")

if [ "$OBS_STATE" = "FAILED" ] || [ "$OBS_GRADE" = "N/A" ]; then
  warn "Observatory scan failed or not ready — try running again"
  append "⚠️ **Inconclusive** — Observatory scan did not complete. State: \`$OBS_STATE\`"
  ((SKIP++))
else
  append "| Check | Result |"
  append "|---|---|"
  append "| Grade | **$OBS_GRADE** |"
  append "| Score | $OBS_SCORE / 100 |"
  append ""
  case "$OBS_GRADE" in
    A+|A) ok "Observatory: $OBS_GRADE ($OBS_SCORE/100)"; ((PASS++)) ;;
    B|C)  warn "Observatory: $OBS_GRADE ($OBS_SCORE/100) — room for improvement"; ((PASS++)) ;;
    *)    fail "Observatory: $OBS_GRADE ($OBS_SCORE/100)"; ((FAIL++)) ;;
  esac

  # Failed tests
  if has jq && has python3; then
    FAILED_TESTS=$(echo "$OBS_RESULT" | python3 -c "
import json, sys
d = json.load(sys.stdin)
tests = d.get('tests', {})
failed = [f'- **{k}**: {v.get(\"score_modifier\",0)} pts — {v.get(\"result\",\"\")}' for k,v in tests.items() if not v.get('pass', True)]
print('\n'.join(failed[:10]))
" 2>/dev/null || echo "")
    if [ -n "$FAILED_TESTS" ]; then
      append "**Failed checks:**"
      append ""
      echo "$FAILED_TESTS" | while read -r line; do append "$line"; done
    fi
  fi
fi

# ── SSL Labs ──────────────────────────────────────────────────────────────────
section "SSL / TLS — SSL Labs"
log "Triggering SSL Labs scan (this takes ~60–90s)…"
curl -s "https://api.ssllabs.com/api/v3/analyze?host=provenance-emu.com&startNew=on&publish=off" > /dev/null 2>&1 || true
SSL_GRADE="N/A"
for i in {1..9}; do
  sleep 20
  SSL_RESULT=$(curl -s "https://api.ssllabs.com/api/v3/analyze?host=provenance-emu.com&publish=off" 2>/dev/null || echo "{}")
  SSL_STATUS=$(echo "$SSL_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status',''))" 2>/dev/null || echo "")
  log "SSL Labs: $SSL_STATUS (attempt $i/9)…"
  if [ "$SSL_STATUS" = "READY" ]; then
    SSL_GRADE=$(echo "$SSL_RESULT" | python3 -c "
import json, sys
d=json.load(sys.stdin)
eps=d.get('endpoints',[])
print(eps[0].get('grade','N/A') if eps else 'N/A')
" 2>/dev/null || echo "N/A")
    break
  fi
done

if [ "$SSL_GRADE" = "N/A" ]; then
  warn "SSL Labs did not complete in time — try running standalone"
  append "⚠️ **Inconclusive** — SSL Labs did not complete. Try [manually](https://www.ssllabs.com/ssltest/analyze.html?d=provenance-emu.com)."
  ((SKIP++))
else
  append "| Check | Grade |"
  append "|---|---|"
  append "| SSL / TLS | **$SSL_GRADE** |"
  append ""
  case "$SSL_GRADE" in
    A+|A) ok "SSL Labs: $SSL_GRADE"; ((PASS++)) ;;
    B)    warn "SSL Labs: $SSL_GRADE — minor issues"; ((PASS++)) ;;
    *)    fail "SSL Labs: $SSL_GRADE"; ((FAIL++)) ;;
  esac
fi

# ── Cleanup ───────────────────────────────────────────────────────────────────
if [ -n "$SERVER_PID" ]; then
  kill "$SERVER_PID" 2>/dev/null || true
fi

# ── Summary ───────────────────────────────────────────────────────────────────
TOTAL=$((PASS + FAIL + SKIP))
section "Summary"
append "| Result | Count |"
append "|---|:---:|"
append "| ✅ Passed | $PASS |"
append "| ❌ Failed | $FAIL |"
append "| ⚠️ Skipped | $SKIP |"
append "| **Total checks** | **$TOTAL** |"
append ""
if [ "$FAIL" -eq 0 ]; then
  append "> **All executed checks passed.** 🎉"
else
  append "> ⚠️ **$FAIL check(s) failed.** Review the sections above."
fi

# ── Output ────────────────────────────────────────────────────────────────────
if [ -n "$OUTPUT_FILE" ]; then
  echo "$REPORT" > "$OUTPUT_FILE"
  ok "Report written to $OUTPUT_FILE"
else
  echo "$REPORT"
fi

[ "$FAIL" -eq 0 ]
