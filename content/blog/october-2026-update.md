---
title: "October Update: iCube and iFly on TestFlight, Provenance 3.4, and a Virtual Jaguar Desktop App"
date: 2026-10-13T00:00:00-04:00
draft: true
tags: ["development", "testflight", "icube", "ifly", "virtual-jaguar"]
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
description: "Provenance 3.4.0 is in TestFlight, iCube and iFly have public TestFlight builds, and Virtual Jaguar 3.8.1 adds a desktop app for macOS, Windows and Linux."
image: "images/banners/banner-1.jpg"
---

# October Update

The last post here was the skin catalog in March. Since then 3.3.0 went out (2026-03-14: iCloud sync, the new tvOS UI, video filters) without a post of its own, `develop` has moved 1,490 commits past 3.3.1, and iCube, iFly and Virtual Jaguar each picked up a new way to install. This is a catch-up on all four.

## Provenance 3.4.0

`MARKETING_VERSION` on `develop` is `3.4.0`, and 3.3.1 (a pre-release from 2026-03-30) was skipped in favor of it. No date yet. The upgrade from 3.3.x changes a lot underneath (database schema 28 -> 29, the RetroArch integration moving from a thick wrapper to a thin one, a new iCloud settings sync), so it gets a full smoke test before it goes to the App Store, and that checklist is still open.

What's in it so far, from the TestFlight notes and the rolling alpha:

- RetroAchievements memory-map fixes for SNES, GBA, PSP, PC Engine and GBC, NES wired up through FCEU, and hardcore mode enforced on quickload.
- Stored credentials moved to the Keychain.
- Atari Jaguar CD, as a beta system. BIN/CUE and CDI only (the importer doesn't take ISO or CHD yet), and some CD games still crash.
- Sega NAOMI, NAOMI 2 and Atomiswave, also as beta systems.
- Dolphin rebased onto a much newer upstream core (2509).
- ROM patching with RHDN search (#3736, #3738), a shader preset browser, an LCD look for DS and 3DS skins, and import of RetroArch save states from 3.3.x.
- The cheat lookup, CRT controls and button remapping from the [March preview]({{< relref "development-preview-next.md" >}}).
- Browse, launch and import games from iFly.
- Archive paths sanitized on import (zip-slip), plus import and save-data safety fixes.

Two ways to try it now. [Patreon supporters](https://www.patreon.com/provenance) get TestFlight builds through the [beta page](/beta/). The sideload build installs as a separate app, Provenance Alpha, from the AltStore/SideStore source `https://provenance-emu.com/apps.json`, or as a plain IPA from [/install/](/install/#downloads).

## iCube

iCube is the GameCube and Wii emulator for iOS and tvOS (Dolphin underneath).

- **TestFlight:** a build is uploaded from `develop` every day, iOS and tvOS, and goes to external testers once Apple's beta review clears it. Join from [icube-emu.com/testflight](https://icube-emu.com/testflight/).
- **Sideload:** the rolling `alpha` release on GitHub, rebuilt on every push: a non-jailbroken IPA, a TrollStore `.tipa`, and rootful and rootless `.deb`s. iOS only for now; on tvOS it's TestFlight.

Changes since Beta 5 (2025-09-14):

- New SwiftUI settings screens, and a redesigned pause menu (a tile grid on iOS and tvOS).
- tvOS: a library side rail with L1/R1 paging, and BootMii NAND backup import through the web UI.
- Controller skins: import Delta and Manic skins, or browse the [Provenance skin catalog](https://provenance-emu.com/skins/) from inside the app.
- A controllers hub with per-player screens, and a touch pointer for Wii.
- Audio output with surround and spatial modes, microphone support, and a GameCube mic button on the touch overlay.
- A quick menu, and ReplayKit recording.
- A crash-report consent switch.

On iOS 26, iCube runs Dolphin's JIT recompiler again when a JIT broker such as StikDebug is attached at launch. Without one it falls back to the Cached Interpreter. It never requires JIT to run ([JIT guide](https://icube-emu.com/guide/jit/)).

## iFly

iFly is the Dreamcast emulator for iOS and tvOS, with NAOMI and Atomiswave too, built on Flycast. TestFlight is open at [ifly-emu.com/testflight](https://ifly-emu.com/testflight/), and the minimum is iOS/tvOS 17.4. Sideload builds of 1.0.0 (2026-10-09 and 10-10) are on [/install/](/install/#downloads) and in the `apps.json` source, but TestFlight is ahead of them.

In the current TestFlight builds (still in testing, so report what breaks):

- Audio output modes: System Stereo, Spatial, or Surround 5.1.
- An All Saves tab and Boot a Save tiles, plus continue-from-another-device on Top Shelf and the widget.
- Arcade overlays with latching gear and flap switches, a portrait layout, throttle lock and rudder.
- Turbo and hold, set per game, and a light gun aim fix.
- A fix for the Hard Restart boot stall, and a merge of upstream Flycast (`f03faffd2`).

Earlier October builds fixed crashes when pausing or leaving a game, made pause-button remaps stick, and stopped emulator settings from syncing over iCloud unless you opt in (Settings > Saves & Sync).

## Virtual Jaguar 3.8.1 and the desktop app

Virtual Jaguar is the Atari Jaguar core we maintain for RetroArch and {{< brand >}}Provenance{{< /brand >}} ([libretro/virtualjaguar-libretro](https://github.com/libretro/virtualjaguar-libretro)). 3.8.0 went out on 2026-10-13: Flip Out runs, Fight For Your Life boots on the real BIOS, Club Drive has audio under HLE, 2-player Doom holds 60 fps over netplay, and all 28 discs in the Jaguar CD test set reach game code. (Some of those are verified headless only, not yet in a RetroArch build. Jaguar CD itself has been in the core since 3.0.0 in August, and Adrien Beudin, [@beudbeud](https://github.com/beudbeud), did much of the CD work in 3.7.0.)

3.8.1 is next, and it adds a standalone desktop app for macOS, Windows and Linux. About 120 commits since 3.8.0, almost all in `app/`. The core is linked statically and driven through the same `retro_*` API RetroArch uses, with SDL3, Dear ImGui and OpenGL 3.3 on top:

- A game library: point it at folders and it identifies games by CRC32 against the libretro databases, fetches box art on demand, and splits cartridges, Jaguar CD and BIOS files into tabs.
- RetroArch `.slangp` shader presets through librashader.
- Remapping for every Jaguar controller type, the 12-key keypad, rotary, driving, paddle, light gun and Team Tap among them.
- Cheats, RetroAchievements (rcheevos), save states, and a netplay window for link-cable games.

Packages: a macOS universal zip, a Windows x64 installer or portable zip, and Linux AppImage and `.deb` builds for x86_64 and aarch64. They're unsigned for now, so on macOS right-click > Open the first time, and Windows shows a SmartScreen warning. On Intel Macs shaders may not load yet (the librashader in the universal build is arm64-only). Nightly builds of the app are up at [jaguar.provenance-emu.com/app.html](https://jaguar.provenance-emu.com/app.html) and on [/install/](/install/#downloads), and 3.8.1 will carry the same packages under its version number.
