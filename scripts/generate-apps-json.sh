#!/usr/bin/env bash
set -euo pipefail

# Generate static/apps.json from GitHub Releases + altstore-source.json
# Dependencies: curl, jq (both pre-installed on GitHub Actions runners)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$REPO_ROOT/altstore-source.json"
OUTPUT_FILE="$REPO_ROOT/static/apps.json"

GITHUB_REPO="${GITHUB_REPO:-Provenance-Emu/Provenance}"
MAX_VERSIONS="${MAX_VERSIONS:-10}"
MAX_NEWS="${MAX_NEWS:-3}"
IPA_PATTERN="${IPA_PATTERN:-iOS}"

API_URL="https://api.github.com/repos/$GITHUB_REPO/releases?per_page=$MAX_VERSIONS"

echo "Fetching releases from $GITHUB_REPO..."

# Fetch releases (non-draft only)
RELEASES=$(curl -sf "$API_URL" \
  ${GITHUB_TOKEN:+-H "Authorization: token $GITHUB_TOKEN"}) || {
  echo "Error: Failed to fetch releases from GitHub API" >&2
  exit 1
}

# Build versions array from releases that have an iOS IPA asset
VERSIONS=$(echo "$RELEASES" | jq -r --arg pattern "$IPA_PATTERN" '
  [.[] | select(.draft == false) |
    # Find the iOS IPA asset
    (.assets[] | select(.name | test($pattern; "i")) | select(.name | test("\\.ipa$"; "i"))) as $asset |
    {
      version: (.tag_name | ltrimstr("v")),
      date: .published_at,
      downloadURL: $asset.browser_download_url,
      size: $asset.size,
      localizedDescription: (
        .body //  "" |
        # Strip markdown formatting for clean display
        gsub("#{1,6}\\s*"; "") |
        gsub("\\*{1,2}([^*]+)\\*{1,2}"; "\(.x // "")") |
        gsub("\\[([^]]+)\\]\\([^)]+\\)"; "\(.x // "")") |
        gsub("<!---?[^>]*-?-->"; "") |
        gsub("\r\n"; "\n") |
        gsub("\r"; "\n") |
        # Truncate to reasonable length
        if length > 500 then .[0:497] + "..." else . end
      )
    }
  ]
')

VERSION_COUNT=$(echo "$VERSIONS" | jq 'length')
if [ "$VERSION_COUNT" -eq 0 ]; then
  echo "Error: No releases found with iOS IPA assets matching pattern '$IPA_PATTERN'" >&2
  exit 1
fi

echo "Found $VERSION_COUNT versions with iOS IPA assets"

# Extract latest version info for top-level fields (SideStore compatibility)
LATEST=$(echo "$VERSIONS" | jq '.[0]')
LATEST_VERSION=$(echo "$LATEST" | jq -r '.version')
LATEST_DATE=$(echo "$LATEST" | jq -r '.date')
LATEST_URL=$(echo "$LATEST" | jq -r '.downloadURL')
LATEST_SIZE=$(echo "$LATEST" | jq -r '.size')
LATEST_DESC=$(echo "$LATEST" | jq -r '.localizedDescription')

echo "Latest version: $LATEST_VERSION"

# Build news array from most recent releases
NEWS=$(echo "$RELEASES" | jq -r --argjson max "$MAX_NEWS" '
  [.[:$max][] | select(.draft == false) |
    {
      title: .name,
      identifier: ("release-" + (.tag_name | ltrimstr("v"))),
      caption: (
        .body // "" |
        gsub("#{1,6}\\s*"; "") |
        gsub("\\*{1,2}([^*]+)\\*{1,2}"; "\(.x // "")") |
        gsub("\\[([^]]+)\\]\\([^)]+\\)"; "\(.x // "")") |
        gsub("<!---?[^>]*-?-->"; "") |
        gsub("\r\n"; "\n") |
        gsub("\r"; "\n") |
        split("\n") | map(select(length > 0)) | .[0:2] | join(" ") |
        if length > 200 then .[0:197] + "..." else . end
      ),
      date: .published_at,
      tintColor: "162434",
      url: .html_url,
      appID: "org.provenance-emu.provenance",
      notify: false
    }
  ]
')

# Read static config
CONFIG=$(cat "$CONFIG_FILE")

# Assemble final apps.json
jq -n \
  --argjson config "$CONFIG" \
  --argjson versions "$VERSIONS" \
  --argjson news "$NEWS" \
  --arg latestVersion "$LATEST_VERSION" \
  --arg latestDate "$LATEST_DATE" \
  --arg latestUrl "$LATEST_URL" \
  --argjson latestSize "$LATEST_SIZE" \
  --arg latestDesc "$LATEST_DESC" \
  '{
    name: $config.name,
    identifier: $config.identifier,
    sourceURL: $config.sourceURL,
    subtitle: $config.subtitle,
    website: $config.website,
    tintColor: $config.tintColor,
    apps: [
      ($config.app + {
        # AltStore v2 versions array
        versions: $versions,
        # Top-level fields for SideStore compatibility + AltStore v1 fallback
        version: $latestVersion,
        versionDate: $latestDate,
        versionDescription: $latestDesc,
        downloadURL: $latestUrl,
        size: $latestSize
      })
    ],
    news: $news,
    userInfo: {}
  }' > "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
echo "  App: $(jq -r '.apps[0].name' "$OUTPUT_FILE")"
echo "  Latest: $(jq -r '.apps[0].version' "$OUTPUT_FILE")"
echo "  Versions: $(jq '.apps[0].versions | length' "$OUTPUT_FILE")"
echo "  News items: $(jq '.news | length' "$OUTPUT_FILE")"
