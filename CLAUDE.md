# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for the Provenance iOS/tvOS multi-emulator app, built with Hugo static site generator. Hosted at https://provenance-emu.com via GitHub Pages.

## Build & Development Commands

```bash
# Local development server (requires Hugo installed)
hugo server

# Local dev server with drafts
hugo server --buildDrafts

# Production build (what CI runs)
hugo --minify

# Docker-based development (uses version from .env)
docker-compose up

# Full production-like build
hugo --gc --minify
```

Local dev server runs at http://localhost:1313/

## Deployment

Automated via GitHub Actions (`.github/workflows/gh-pages.yml`). Pushing to `main` triggers a build with Hugo extended (latest) and deploys to the `gh-pages` branch with CNAME `provenance-emu.com`. Pull requests get a build check but no deployment.

## Architecture

### Theme System

The site uses a **multi-theme chain** defined in `config.toml`:
```
theme = ["hugo-social-metadata", "hugo-redirect", "hugo-cloak-email", "small-apps-prov"]
```

- **`small-apps-prov`** — The primary custom theme (in `themes/small-apps-prov/`). All site layouts, partials, and SCSS live here.
- The other three themes are git submodules providing social metadata, URL redirects, and email obfuscation.
- `hugo-universal-theme` is also a submodule but is not in the active theme chain; it serves as a reference/base.

### Content is Data-Driven

The homepage and most static pages are **not built from Markdown content** — they are driven by YAML data files in `data/`:

- `data/homepage.yml` — Main homepage content (hero, features, systems list, download section, social proof, comparison table, carousel)
- `data/faq.yml`, `data/about.yml`, `data/contact.yml`, `data/privacy.yml`, `data/team.yml` — Page-specific data
- `data/carousel/`, `data/features/`, `data/releases/` — Structured data for homepage sections

The homepage template that consumes this data is `themes/small-apps-prov/layouts/index.html` (~410 lines).

Blog posts in `content/blog/` are the only traditional Markdown content. They use front matter with: title, date, tags, author, image.

### Custom Styling

- `static/css/provenance-custom.css` — Site-wide custom CSS overrides (~510 lines), loaded as a plugin via `config.toml`
- Theme SCSS files in `themes/small-apps-prov/assets/scss/` — Core theme styles compiled by Hugo Pipes

### Key Layouts

All in `themes/small-apps-prov/layouts/`:
- `index.html` — Homepage (complex, data-driven, most editing happens here)
- `_default/baseof.html` — Base template wrapper
- `partials/head.html`, `header.html`, `footer.html` — Shared page structure
- Page-specific layouts: `about/`, `product/`, `faq/`, `privacy/`, `contact/`, `team/`
- `layouts/donate/list.html` — Custom donate page (in root layouts dir, overrides theme)

### Configuration

`config.toml` controls: menus, social links, plugins (Bootstrap, jQuery, Owl Carousel, Fancybox, AOS animations), Disqus comments, Google Analytics, CTA section, and widget toggles. Many homepage sections (carousel, features, testimonials, clients, recent_posts) have enable/disable flags.

### Submodules

Clone with `--recursive` or run `git submodule update --init --recursive` after cloning. Required for themes to resolve.

## ⚠️ Hard Rules — Do Not Change Without Understanding Why

### AOS CSS must be loaded synchronously
`themes/small-apps-prov/layouts/partials/head.html` loads `plugins/aos/aos.css` with a plain `<link rel="stylesheet">` — **never change this to async/preload**.

Why: AOS sets `opacity:0` on `[data-aos]` elements via CSS. If the CSS loads after `AOS.init()` runs (which happens when CSS is async), the opacity is never reset to 1 — elements become permanently invisible. This broke the status page and homepage multiple times. The Lighthouse performance gain from async-loading this one small CSS file (~3KB) is negligible.

### All `<script>` tags must have `data-cfasync="false"`
Every `<script>` in `footer.html` has `data-cfasync="false"`. This bypasses Cloudflare Rocket Loader, which rewrites script tags and breaks our deferred execution order. Do not remove these attributes.

### Do not add `data-aos` to functional/dashboard pages
The `/status/` page layout (`themes/small-apps-prov/layouts/status/list.html`) intentionally has no `data-aos` attributes. AOS animations are for marketing pages only — adding them to functional dashboards causes invisible content if timing is off.

## GitHub Issues & PR Conventions

### Epic Issues
Issues labeled `epic` are parent tracking issues that group multiple related PRs. They must **never** be auto-closed by a PR merge.

- **NEVER** use `Closes #N`, `Fixes #N`, or `Resolves #N` when referencing an epic issue in a PR description.
- **ALWAYS** use `Part of #N` or `Related to #N` when a PR addresses work from an epic.
- Child/sub-issues (individual tasks) CAN be closed by PRs using `Closes #N`.
- If you create a PR that fully completes all tasks in an epic, manually close the epic after human review — do not rely on keyword auto-close.

### PR Description Template
```
## Summary
- Brief bullets of what changed

## Part of
- Part of #N (epic title)

## Test plan
- [ ] Hugo builds without errors
- [ ] Page renders correctly at localhost:1313
```
