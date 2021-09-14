---
title: "Release 2.0.2"
date: 2021-09-14T19:05:12-04:00
draft: false
tags: ["release"]
type: "post"
author: "Joe Mattiello"
authorImage: "images/team/joe.jpg"
authorSocial:
  - icon : "tf-ion-social-github"
    URL : "https://github.com/JoeMatt"
  - icon : "tf-ion-social-twitter"
    URL : "https://twitter.com/joemattiello"
categories: ["release"]
description: "2.0.2 Release with bug fixes"
image: "images/icons/icon.512x512.png"
---

# Release 2.0.2

## Links

- 📲 [iOS IPA](/apps/2.0.2/Provenance-iOS.ipa)
- 📺 [tvOS IPA](/apps/2.0.2/Provenance-tvOS.ipa)
- 📝 [GitHub](https://github.com/Provenance-Emu/Provenance/releases/tag/2.0.2)
- 🏪 [AltStore](/altstore/)

🥰 [Patreon](https://patreon.com/provenance/)

## Install Instructions

https://wiki.provenance-emu.com/installation-and-usage/installing-provenance/sideloading

## Changes

*More Bug fixes mostly.*

### Added

- XCode will detect missing git submodules and auto-clone recursive before building the rest of the project

### Fixed

- [#1586](https://github.com/Provenance-Emu/Provenance/issues/1586) Running same core twice in a row would crash
- [#1593](https://github.com/Provenance-Emu/Provenance/issues/1593) Cheat codes menu crash fixes and other cheat code quality improvements

### Updated

- [#1564](https://github.com/Provenance-Emu/Provenance/issues/1564) SteamController native SPM package port
- Jaguar core updated with libretro upstream + my performance hacks. PR made https://github.com/libretro/virtualjaguar-libretro/pull/53#issuecomment-919242560
- Fix many static analyzer warnings about possible nil pointer/un-malloc'd memory usage, now we check and log nils or early exit where applicable
- SQLite.swift updated
- RxRealm updated from 5.0.2 to 5.0.3
- realm-cocoa updated from 10.14.0 to 10.15.0
