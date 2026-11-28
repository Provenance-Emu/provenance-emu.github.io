#!/usr/bin/env bash
# Check an existing Hugo build. Used by CI and the local site audit.
set -euo pipefail

ignore_urls='/localhost/,/twitter\.com/,/x\.com/,/fonts\.gstatic\.com/,/fonts\.googleapis\.com/,/discord\.gg/,/api\.github\.com/'
ignore_urls+=',/github\.com\/login/,/github\.com\/[^/]+\/[^/]+\/(releases\/download|commit|compare|pull|issues)\//'
ignore_urls+=',/objects\.githubusercontent\.com/,/provenance-emu\.com/,/s3.*amazonaws\.com/'

# GitHub can return transient gateway errors during bulk external link checks.
# Keep checking the destinations so permanent errors such as 404 still surface.
exec htmlproofer "${1:-./public}" \
  --checks Links,Images,Scripts,OpenGraph \
  --ignore-urls "$ignore_urls" \
  --ignore-status-codes '0,429,999,403,502,503' \
  --ignore-files '/404\.html/,/release-2\.1\.0/,/\/categories\//,/\/tags\//'
