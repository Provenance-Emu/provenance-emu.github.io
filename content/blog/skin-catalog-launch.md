---
title: "Introducing the Provenance Skin Catalog"
date: 2026-03-13T00:00:00-05:00
draft: false
tags: ["skins", "community", "feature"]
type: "post"
author: "Joe Mattiello"
authorImage: "images/team/joe.jpg"
authorSocial:
  - icon : "tf-ion-social-github"
    URL : "https://github.com/JoeMatt"
  - icon : "tf-ion-social-twitter"
    URL : "https://twitter.com/joemattiello"
authorDescription: "Joe Mattiello is the lead developer of Provenance, an open-source multi-system emulator for iOS and tvOS with 10+ years of active development."
categories: ["feature", "community"]
description: "Browse and submit community-made controller skins at provenance-emu.com/skins/ — searchable by system, with automatic thumbnail previews."
image: "images/blog/skin-catalog-launch.webp"
---

# The Provenance Skin Catalog Is Live

We've launched a new community skin catalog at **[provenance-emu.com/skins/](https://provenance-emu.com/skins/)** — a searchable, browsable directory of controller skins for {{< brand >}}Provenance{{< /brand >}}, updated automatically from community GitHub repos.

## What It Is

The [Skin Catalog](https://provenance-emu.com/skins/) is an open-source directory of `.deltaskin` and `.manicskin` files compatible with {{< brand >}}Provenance{{< /brand >}}. Skins are indexed from the community automatically, with thumbnail previews extracted directly from the skin files themselves.

- **Browse** skins by system — GBA, SNES, PSX, N64, and more
- **Search** by name or author
- **Submit** your own skin in under a minute

The catalog powers the in-app skin browser (Settings → Skins → Browse Catalog), so anything you submit shows up right inside {{< brand >}}Provenance{{< /brand >}}.

## How to Submit a Skin

There are four ways to get your skin in the catalog:

1. **Drop a URL** — Go to [provenance-emu.com/skins/submit](https://provenance-emu.com/skins/submit) and paste any direct link to your `.deltaskin` or `.manicskin` file. The site parses the file in your browser and creates a GitHub issue pre-filled with your skin's metadata.

2. **Open a GitHub issue** — Visit [github.com/Provenance-Emu/skins/issues/new](https://github.com/Provenance-Emu/skins/issues/new/choose) and use the "Submit a Skin" template. Paste your download URL and it's automatically processed into the catalog.

3. **Pull request** — Fork [Provenance-Emu/skins](https://github.com/Provenance-Emu/skins), add a JSON file to the `skins/` directory, and open a PR. Automated validation runs on every PR.

4. **Register your repo** — If you maintain a GitHub repo full of skins, open a "Register Source" issue to have it crawled weekly. Your skins will be indexed automatically going forward.

## For Skin Creators

If you've been hosting skins on DeltaStyles, a personal GitHub repo, or anywhere else — you can bring them into the {{< brand >}}Provenance{{< /brand >}} catalog without moving any files. The catalog just links to your existing download URL.

Want your whole repo crawled automatically? [Register it as a source](https://github.com/Provenance-Emu/skins/issues/new/choose).

## Under the Hood

The catalog is fully open source at [github.com/Provenance-Emu/skins](https://github.com/Provenance-Emu/skins). It:

- Crawls community repos weekly for new skins
- Extracts thumbnail images from inside skin ZIP files (PNG preferred, PDF converted to PNG via poppler)
- Stores thumbnails on GitHub Releases as a CDN, with repo fallback
- Rebuilds the catalog JSON on every change and deploys to GitHub Pages
- Validates all submissions via CI before they go live

The JSON catalog at `catalog.json` follows an open schema — if you want to build your own browser or integrate it into another app, go for it.

---

**[Browse the Skin Catalog →](https://provenance-emu.com/skins/)**
