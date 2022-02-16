---
title: "Release 2.0.3"
date: 2021-12-21T00:00:12-04:00
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
description: "2.0.3 Release with bug fixes"
image: "images/banners/203banner.jpg"
---

# Release 2.0.3

## Links

- 📲 [iOS IPA](/apps/2.0.3/Provenance-iOS.ipa)
- 📺 [tvOS IPA](/apps/2.0.3/Provenance-tvOS.ipa)
- 📝 [GitHub](https://github.com/Provenance-Emu/Provenance/releases/tag/2.0.3)
- 🏪 [AltStore](/altstore/)

🥰 [Patreon](https://patreon.com/provenance/)

## Install Instructions

https://wiki.provenance-emu.com/installation-and-usage/installing-provenance/sideloading

## Changes

*More Bug fixes, some core updates.*

## [2.0.3] - 2021-12-16

### Added

- Odyssey2 core
- Mac Catalyst early support (M1 and Intel) (not for public use yet)
- SNES FAST and PCE FAST core options for Mednafen
- watch os demo target
- Odyssey add and use od2 extension
- Add odyssey to build
- Tentative support for VecX and CrabEMU
- macOS testing catalyst
- Add nitotv methods for tvOS
- Override openURL for tvOS
- Add Patron link to readme
- Add Desmume2015 core
- DuckStation initial commit
- Cores add plist feature to ignore
- Add PPSSPP Source
- Play! PS2 initial commit
- Add Dolphin project
- Add GameCube support classes and metadata (WIP)
- Add flycast core (WIP)
- Add a Chinese loading example
- Add localized strings file and example

### Fixed

- #1621 GBC palette options crashed gambatte
- #1414 smarter expecptions in PVSystem
- #1645 PCE Audio setting tweaks to match real hardware
- #1637 Cheats label name cut off fixed
- #1649 two PCE module audio related setting tweaks that enable Provenance's PCE Audio output to match much closer to the measured MDFourier output of a real system, as tested with @artemio from the MDFourier project.
- Fixed rare crash in OERingBuffer
- Cores that don't support saves no loner display save actions in menu
- OpenVGDB Update (fixes artwork and metadata not loading)
- Fixed strong self refs in some classes, closures
- Fixed MD5 mismatch log message
- Add back a crash logger #1605 add crash logger and fix minor build settings
- switch jaguar to upstream branch
- core option as bool for objc
- RxDataSources switch to SPM package
- Fix some implicit self block refs
- closes Conflicts not reported #1601 conflicts reporting correctly
- fixes Gambatte core immediately crashes #1621 GBC palette options crashed gambatte
- refs After Resolving an "Import Conflict", subsequent imports no longer work #1414 smarter expecptions in PVSystem
- refs WebDav Server Always-On broken #822 add small main queue delay 4webdav start
- tvOS add multi micro gamepad to infoplist
- tvOS fix target order setting error
- Fix minor iCloud warning
- Fix random warnings
- Fix force unwraps in appdeleagte
- Fix finicky tvOS schemes
- Fix whole/single compilation for rel/arch targets
- Mednafen, proper ELOG in swift
- Mednafen remove dead file ref
- RxSwift fix some threading issues
- Fix GL_SILENCE_DEPRECATION=1
- Fix PS2 stealing PS1 bios
- Fix gamecub stealing n64 roms
- add nintendo DS enums
- Replace QuickTableViewController SPM with source
- PicoDrive fix naming
- altkit not in catalyst
- Remove reicast from build
- Fix catalyst and other build tweaks

### Updated

- Jaguar core upstream & custom performance hacks
- Mupen/GlideN64/Rice... updated to latest upstream
- All SPM packages to upstream

### Removed

- Delete Romefile
- dolphini remove used parent project

