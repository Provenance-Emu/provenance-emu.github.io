---
title: "Development Preview: Cheats, Controllers & Netplay"
date: 2026-03-06T00:00:00-05:00
draft: false
tags: ["development", "preview", "cheats", "netplay"]
type: "post"
author: "Joe Mattiello"
authorImage: "images/team/joe.jpg"
authorSocial:
  - icon : "tf-ion-social-github"
    URL : "https://github.com/JoeMatt"
  - icon : "tf-ion-social-twitter"
    URL : "https://twitter.com/joemattiello"
authorDescription: "Joe Mattiello is the lead developer of Provenance, an open-source multi-system emulator for iOS and tvOS with 10+ years of active development."
categories: ["development"]
description: "A look at what's coming next: a complete cheat code system with online lookup, configurable CRT shaders, full button remapping, DOSBox keyboard support, and the start of netplay."
image: "images/banners/banner-1.jpg"
---

# Development Preview: What's Coming Next

A lot has been happening in the `develop` branch lately. None of this is in the App Store yet — these features are still being polished — but we wanted to share what's in the pipeline so you know where the project is heading. No release date promises here, just an honest look at the work in progress.

If you want early access to these features, [Patreon supporters](https://www.patreon.com/provenance) get beta builds as they become available.

---

## 🎮 Cheat Code System

This is the biggest new feature in active development, and it's shaping up to be something genuinely useful rather than just a checkbox.

At the core is a **bundled 67MB libretro cheat database** shipped directly with the app — no internet required. Tap the search icon on any game and {{< brand >}}Provenance{{< /brand >}} looks up cheats via **MD5 hash matching** for exact ROM identification, or falls back to a fuzzy title match. You get the right cheats for your exact ROM version, completely offline.

For users who want the absolute latest codes, there's also **optional online lookup** from the libretro GitHub-hosted cheat database, with 24-hour disk caching and a globe icon to indicate when results are coming from the network vs. local storage. The online path is opt-in; the offline database works without any network access at all.

The cheat editor itself has been rebuilt in SwiftUI with **real-time format validation** — the input field goes green or red as you type, auto-formats your code to the expected layout, and shows format-specific hints. No more guessing whether your code is entered correctly.

Cheat support is landing across **11+ emulator cores**:

- Game Boy / GBC (Gambatte)
- Game Boy Advance (mGBA)
- Nintendo DS (melonDS)
- Nintendo 64 (Mupen64Plus)
- PlayStation (BeetlePSX, DuckStation)
- Genesis (Genesis Plus GX)
- 32X (PicoDrive)
- All RetroArch cores via a libretro cheat API bridge

Supported formats include Game Genie, Game Shark, Pro Action Replay, Code Breaker, Gecko, and Action Replay.

---

## 📺 Configurable CRT Shader Parameters

CRT shaders have been in {{< brand >}}Provenance{{< /brand >}} for a while, but until now the settings were mostly fixed. A new settings UI with **sliders and toggles** lets you tune the visual effect in real time — adjustments feed directly into the Metal shaders as you move them, so you can dial things in visually instead of guessing.

**Simple CRT controls**: curvature, light boost, vignette, zoom, and brightness.

**Complex CRT controls**: bloom, scanlines, shadow mask, warp, and gamma — each individually toggleable and adjustable. Each section also has a reset-to-defaults button if you go too far.

---

## 🕹️ Custom Controller Button Remapping

Full button remapping is coming with proper profile support. You create **named controller profiles** with any button layout you want, then scope them to a specific controller vendor (DualSense, Xbox, MFi, Switch Pro), a specific system, or even a single game.

Priority works the way you'd expect: game-specific profiles override system-specific ones, which override the global default. Profiles apply automatically at game launch — no menu diving required every time you pick up a different controller.

---

## ⌨️ DOSBox: Keyboard and Mouse Support

Physical Bluetooth and USB keyboards now work in DOSBox games. Mouse movement tracking and left/right button support have been added as well.

This sounds small but it makes a real difference. Classic DOS games like Doom and Wing Commander are genuinely playable on iOS and tvOS now rather than being awkward workarounds. If you've got a Bluetooth keyboard handy, DOSBox games are finally worth loading up.

---

## 📖 In-App Controller Setup Guide

A new Controller Guide lives in Settings and also appears on the empty library screen. It walks through numbered pairing steps for DualSense, DualShock 4, Xbox, MFi, and iCade controllers, so new users have a clear path to getting a controller connected without hunting through documentation.

On tvOS the guide uses focusable controller cards, and it includes a note for Siri Remote users encouraging them to pair a proper game controller before diving into anything that needs analog input.

---

## 🌐 Netplay (Groundwork Laid)

To be clear: **netplay is not ready, and we're not announcing a timeline**. But the work has begun.

The architecture has been designed and documented. We've audited 60+ RetroArch cores for netplay compatibility. The planned rollout is phased: first enable the `HAVE_NETPLAY` build flag across all RetroArch cores, then build out the lobby UI, then integrate native iOS networking.

The reason to mention it now is to be transparent about where we're heading. The groundwork is done. When it's ready, it'll be ready — and it's being built to be stable rather than rushed.

---

## 💿 CHD Support (A Quiet Differentiator)

This one already exists in {{< brand >}}Provenance{{< /brand >}} but deserves more attention than it gets.

CHD (Compressed Hunks of Data) is MAME's disc image format — it compresses multi-track disc images for PS1, Saturn, PC-Engine CD, and other disc-based systems dramatically compared to raw BIN/CUE or ISO. Nearly all CD-based cores in {{< brand >}}Provenance{{< /brand >}} support CHD, so this isn't unusual across the board.

What is unusual: **{{< brand >}}Provenance{{< /brand >}}'s native Mednafen core supports CHD via a custom implementation that doesn't exist in other standalone Mednafen forks**. Standard upstream Mednafen has no CHD support at all. Beetle (RetroArch's Mednafen-derived core) does — and {{< brand >}}Provenance{{< /brand >}} includes Beetle too — but if you're running the native Mednafen core for PS1, Saturn, or PC-Engine CD, CHD just works here in a way it won't in other standalone Mednafen ports.

The practical impact: your disc-based game library takes significantly less storage while preserving disc accuracy. If you're sitting on a pile of BIN/CUE rips, CHD is worth converting to.

---

## 💖 Support the Project

All of this work is happening because of community support. Development takes real time, and the features above represent hundreds of hours of work that hasn't shipped yet.

If you want to help keep things moving:

- **[Patreon](https://www.patreon.com/provenance)** — Monthly support with early access to beta builds
- **[Provenance Plus](https://apps.apple.com/us/app/provenance-app/id1596862805)** — Optional in-app purchase on App Store builds
- **[Buy Me a Coffee](https://buymeacoffee.com/joemattiello)** — One-time contributions
- **[Open Collective](https://opencollective.com/provenanceemu)** — Transparent community funding

Thank you for following along and for your patience while these features get finished properly.
