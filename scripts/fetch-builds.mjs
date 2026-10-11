#!/usr/bin/env node
/**
 * Writes data/builds.json: the latest GitHub releases of Provenance, iCube,
 * iFly and Virtual Jaguar, with GitHub-rendered release notes and download
 * links. The /install/ page renders it as one download list with expandable
 * changelogs. Run before `hugo`; the file is generated and git-ignored.
 *
 * Missing file => the page falls back to plain GitHub links, so local builds
 * work without it. In CI a failed fetch fails the job instead, so a transient
 * API error leaves the previous deployment live rather than replacing the
 * download list with the fallback.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'data', 'builds.json');
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const IN_CI = !!process.env.CI;
const MAX_NOTES_CHARS = 24000;

/**
 * rolling:  tag of a CI release that is replaced in place (shown first, as "Latest alpha")
 * skip:     tags that are CI noise rather than releases
 * assets:   which release assets get a download button
 * shown:    how many other releases to list
 */
const PRODUCTS = [
  {
    key: 'provenance', name: 'Provenance', site: 'https://provenance-emu.com/',
    tagline: 'Multi-system retro emulator for iOS, tvOS and macOS',
    repo: 'Provenance-Emu/Provenance', rolling: 'alpha', skip: /^alpha-\d+$/, shown: 3,
    assets: /\.ipa$/i,
  },
  {
    key: 'icube', name: 'iCube', site: 'https://icube-emu.com/',
    tagline: 'GameCube & Wii emulator for iOS and tvOS',
    repo: 'Provenance-Emu/iCube', rolling: 'alpha', skip: /^alpha-\d+$/, shown: 2,
    assets: /\.ipa$/i,
  },
  {
    key: 'ifly', name: 'iFly', site: 'https://ifly-emu.com/',
    tagline: 'Dreamcast emulator for iOS and tvOS',
    repo: 'JoeMatt/iFly-releases', shown: 3,
    assets: /\.ipa$/i,
  },
  {
    key: 'jaguar', name: 'Virtual Jaguar libretro', site: 'https://jaguar.provenance-emu.com/',
    tagline: 'Atari Jaguar core for RetroArch and Provenance',
    repo: 'libretro/virtualjaguar-libretro', skip: /^(nightly|prerelease)$/, shown: 3,
    assets: /^virtualjaguar_libretro-(ios|tvos)-arm64\.dylib$/,
  },
];

function fail(message) {
  if (IN_CI) {
    console.error(`::error::fetch-builds: ${message}`);
    process.exit(1);
  }
  console.warn(`fetch-builds: ${message} (continuing; not in CI)`);
  process.exit(0);
}

async function releasesOf(repo) {
  const all = [];
  for (let page = 1; page <= 3; page += 1) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, {
      headers: {
        // `full` adds body_html: release notes already rendered and sanitised by GitHub.
        accept: 'application/vnd.github.full+json',
        'user-agent': 'provenance-site-build',
        ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
      },
    }).catch((e) => fail(`request for ${repo} failed: ${e.message}`));
    if (!res.ok) fail(`GET releases for ${repo} returned HTTP ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch)) fail(`GET releases for ${repo} returned an invalid response`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.filter((r) => !r.draft);
}

/** Drop the boilerplate "Install" blocks some release bodies carry. */
function cleanNotes(html, releaseURL) {
  let out = (html || '')
    .replace(/<h[23][^>]*>\s*Install\s*<\/h[23]>[\s\S]*?(?=<h[123][\s>]|$)/gi, '')
    .trim();
  if (out.length > MAX_NOTES_CHARS) {
    // Cut between top-level headings so the HTML stays balanced.
    const kept = [];
    let size = 0;
    for (const section of out.split(/(?=<h[123][\s>])/)) {
      if (size + section.length > MAX_NOTES_CHARS) break;
      kept.push(section);
      size += section.length;
    }
    out = `${kept.join('')}<p><a href="${releaseURL}">Read the full notes on GitHub</a>.</p>`;
  }
  return out;
}

const products = [];
for (const p of PRODUCTS) {
  const all = await releasesOf(p.repo);
  const entry = (r, extra = {}) => ({
    tag: r.tag_name,
    title: r.name || r.tag_name,
    date: (r.published_at || r.created_at || '').slice(0, 10),
    prerelease: !!r.prerelease,
    url: r.html_url,
    notesHtml: cleanNotes(r.body_html, r.html_url),
    assets: (r.assets ?? [])
      .filter((a) => p.assets.test(a.name))
      .map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size })),
    ...extra,
  });

  const entries = [];
  const rolling = p.rolling && all.find((r) => r.tag_name === p.rolling);
  if (rolling) entries.push(entry(rolling, { rolling: true, title: 'Latest alpha (rolling CI build)' }));

  const others = all
    .filter((r) => r.tag_name !== p.rolling && !(p.skip && p.skip.test(r.tag_name)))
    .sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''))
    .slice(0, p.shown);
  for (const r of others) entries.push(entry(r));

  // Mark the newest stable release so the page can badge it.
  const newestStable = entries.find((e) => !e.prerelease && !e.rolling);
  if (newestStable) newestStable.latest = true;

  if (!entries.length) fail(`no releases found for ${p.repo}`);
  products.push({
    key: p.key, name: p.name, site: p.site, tagline: p.tagline,
    repoURL: `https://github.com/${p.repo}`,
    releasesURL: `https://github.com/${p.repo}/releases`,
    entries,
  });
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), products }, null, 2) + '\n');
console.log(`fetch-builds: ${products.map((p) => `${p.key}=${p.entries.length}`).join(' ')} -> ${path.relative(process.cwd(), OUT)}`);
