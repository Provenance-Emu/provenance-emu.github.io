---
title: "Release 3.2.0"
date: 2025-11-21T00:00:00-05:00
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
description: "3.2.0 Release: Full skin support for everyone, major performance improvements, and quality of life enhancements."
image: "images/banners/banner-1.jpg"
lightgallery: true
fontawesome: true
linkToMarkdown: true
rssFullText: false
layout: photography
---

# Release 3.2.0

We're excited to announce Provenance 3.2.0, a major update focused on performance, skins, and quality of life improvements. This release brings highly requested features and fixes that make Provenance faster and more enjoyable than ever.

## 🎨 Skins: Now Free for Everyone!

The biggest news: **Full skin support is now available to all users—no Provenance Plus required!** We believe everyone should enjoy customizing their gaming experience. However, if you love what we're building, please consider supporting the project through [Provenance Plus](https://apps.apple.com/us/app/provenance-app/id1596862805) or [Patreon](https://www.patreon.com/provenance).

### What's New with Skins

- **Full Manic and Delta Skin Support** for all systems (except 3DS and DS—those are coming soon!)
- **Dramatically Improved Performance**: Faster rendering, loading, and smoother UI
- **Fixed Rotation Issues**: No more slow redraws when changing orientation
- **Memory Optimizations**: More efficient skin storage and rendering
- **RetroArch Core Support**: Skins now work across all emulator cores
- **GameBoy Color Skins on GameBoy**: Use your favorite GBC skins on original GameBoy games
- **Enhanced Skin Browser**: Faster, more responsive skin selection and preview

<div class="section mockup-carousel bg-light" style="margin: 3rem 0;">
	<div class="container">
		<div class="row justify-content-center text-center mb-5">
			<div class="col-lg-10">
				<h2 class="font-weight-bold mb-3">See the New Skins in Action</h2>
				<p class="text-muted">Beautiful system-specific skins bring your favorite retro games to life</p>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-10 m-auto">
				<div class="mockup-slider owl-carousel owl-theme">
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-saturn.webp" onerror="this.src='/images/mockups/iphone-saturn.png'" alt="Sega Saturn">
						<h5 class="mt-3">Sega Saturn</h5>
					</div>
          <div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-dreamcast.webp" onerror="this.src='/images/mockups/iphone-dreamcast.png'" alt="Sega Dreamcast">
						<h5 class="mt-3">Sega Dreamcast</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-psp.webp" onerror="this.src='/images/mockups/iphone-psp.png'" alt="PlayStation Portable">
						<h5 class="mt-3">PlayStation Portable</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-gb.webp" onerror="this.src='/images/mockups/iphone-gb.png'" alt="Nintendo Game Boy">
						<h5 class="mt-3">Nintendo Game Boy</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-gbc.webp" onerror="this.src='/images/mockups/iphone-gbc.png'" alt="Nintendo Game Boy Color">
						<h5 class="mt-3">Nintendo Game Boy Color</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-gba.webp" onerror="this.src='/images/mockups/iphone-gba.png'" alt="Nintendo Game Boy Advance">
						<h5 class="mt-3">Nintendo Game Boy Advance</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-3ds.webp" onerror="this.src='/images/mockups/iphone-3ds.png'" alt="Nintendo 3DS">
						<h5 class="mt-3">Nintendo 3DS</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-nes-crt.webp" onerror="this.src='/images/mockups/iphone-nes-crt.png'" alt="Nintendo Entertainment System">
						<h5 class="mt-3">Nintendo Entertainment System</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-nes.webp" onerror="this.src='/images/mockups/iphone-snes.png'" alt="Super Nintendo Entertainment System">
						<h5 class="mt-3">Super Nintendo Entertainment System</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-n64.webp" onerror="this.src='/images/mockups/iphone-n64.png'" alt="Nintendo 64">
						<h5 class="mt-3">Nintendo 64</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-psx.webp" onerror="this.src='/images/mockups/iphone-psx.png'" alt="Sony PlayStation">
						<h5 class="mt-3">Sony PlayStation</h5>
					</div>
					<div class="item text-center">
						<img class="img-fluid" src="/images/mockups/iphone-32x-doom.webp" onerror="this.src='/images/mockups/iphone-32x-doom.png'" alt="Sega 32X">
						<h5 class="mt-3">Sega 32X</h5>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

## ⚡ Performance Improvements

### Library & UI
- **Faster Main Library**: Significantly improved scrolling and navigation performance
- **Optimized Rendering Loop**: Better frame pacing and smoother gameplay across all cores

### Core Performance
- **Dreamcast/Flycast Enhancements**:
  - Faster emulation speed
  - Windows CE-based games now supported
  - Full networking support enabled
- **emuThreeDS (3DS Core)**: Performance bump and reduced graphic glitches
- **PPSSPP**: More options exposed, layout fixes, and full skin support

### ROM Management
- **Rewritten ROM Importer**:
  - Batch processing for multiple imports
  - Significantly improved artwork matching—more comprehensive, faster, and more accurate
  - Much faster and more reliable with fewer errors
  - Fixed bug where existing ROMs were repeatedly re-imported
  - Eliminated erroneous duplicate imports
  - **7zip Archive Support**: Fixed large 7zip archive handling
- **MAME/CPS ZIP Support**: Drop MAME/CPS1,2,3 ZIP files directly into imports or the MAME/CPS ROMs folder—they'll import and load correctly!

## 🐛 Major Bug Fixes

### Core Stability
- **GameCube/Wii (Dolphin) Improvements**:
  - Fixed flickering after pause/resume
  - Fixed mis-mapped button inputs
  - Corrected inverted settings
  - Faster access to overclock/underclock settings
  - Performance improvements matching dedicated emulator apps
- **Atari ST**: No longer crashes at boot
- **Vectrex**: Fixed core booting and blank video output
- **Mednafen**: Fixed static audio in CHD files with FLAC compression
- **Odyssey2**: Added numpad button support (can now select game number at boot)
- **Atari 8-bit**: Fixed and added proper controller support
- **CPS1/2/3 (Capcom Arcade)**: Better compatibility and support
- **RetroArch Core Crashes**: Fixed many boot-up crashes
- **RetroArch Pause Bug**: Cores now properly pause when menu is opened, and menus are fully navigable
- **VSync Output**: Fixed video output issues when VSync was disabled

### System Issues
- **Siri Search Bug**: Opening games from Siri search no longer causes games to reopen when closed
- **Spotlight Database Corruption**: Fixed critical bug that could corrupt the database during Spotlight searches, requiring slow re-imports
- **ROM System Migration**: Fixed bug where ROMs moved to different systems wouldn't actually move their files, causing incorrect re-imports
- **Sideload Bundle ID**: Sideloaded apps with changed bundle IDs no longer think they're App Store builds—all Provenance Plus features now work when sideloading or building with Xcode!

## 📊 Development Tools

### FPS Indicator Improvements
- **More Accurate Stats**: Works with native Provenance cores (3D accelerated)
- **Additional Information**: More detailed performance metrics
- Note: Currently limited to native cores; RetroArch-based cores coming later

## ☁️ iCloud Sync Enhancements

- **CloudKit Improvements**: More reliable sync with better error detection
- **Better Error Messaging**: Clear, actionable error messages throughout the app
- **Faster Sync**: Optimized sync speeds for game saves and ROMs

## 🎮 Quality of Life

### PPSSPP Updates
- More emulation options exposed in settings
- Fixed options not saving correctly
- UI layout improvements
- Full skin support

### emuThreeDS (3DS) Updates
- Settings fixes
- Graphic glitch improvements
- Slight performance increase

### General UI
- **Improved Pause Menu**: Cleaner, more intuitive interface
- **Better Messaging**: Enhanced error messages and notifications throughout the app

## 🌐 Website Update

We've completely refreshed [provenance-emu.com](https://provenance-emu.com) with:
- Updated information and screenshots
- Modern styling and improved navigation
- New [donation page](/donate/) with multiple support options

## 🚀 Coming Soon

We're hard at work on exciting features for future releases:
- **tvOS App Store Release**: Official App Store distribution for Apple TV
- **3DS & DS Skin Support**: Complete the skin coverage
- **More Cores**: Additional system support
- **Enhanced Stability**: Continued refinement and optimization
- **Seamless Cloud Storage**: On-demand downloading for iCloud ROMs

## 💖 Support the Project

Provenance is a labor of love, built by the community for the community. If you'd like to support continued development:

- **[Provenance Plus](https://apps.apple.com/us/app/provenance-app/id1596862805)**: Optional in-app purchase (App Store builds only)
- **[Patreon](https://www.patreon.com/provenance)**: Monthly support with exclusive perks
- **[Buy Me a Coffee](https://buymeacoffee.com/joemattiello)**: One-time contributions
- **[Open Collective](https://opencollective.com/provenanceemu)**: Transparent funding

Every contribution helps keep this project alive and thriving. Thank you!

## Installation

Get Provenance 3.2.0:
- **App Store**: [Download from the App Store](https://apps.apple.com/us/app/provenance-app/id1596862805)
- **IPA Download**: [GitHub Releases](https://github.com/Provenance-Emu/Provenance/releases)
- **Sideload**: [Installation Instructions](https://wiki.provenance-emu.com/installation-and-usage/installing-provenance/sideloading)

---

Thank you for being part of the Provenance community. Happy gaming! 🎮
