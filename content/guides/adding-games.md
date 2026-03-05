---
title: "How to Add Games to Provenance"
date: 2026-03-05T00:00:00-05:00
description: "Step-by-step guide to adding ROM files to Provenance, the free iOS and tvOS retro game emulator, on iPhone, iPad, and Apple TV."
tags: ["guide", "how-to"]
---

Provenance supports games from 38+ retro systems, but you need to provide your own ROM files. This guide explains several methods for getting games into Provenance on iPhone, iPad, or Apple TV.

## What You Need

You will need ROM files for the games you want to play. You are responsible for ensuring you have the legal right to use any ROM files. A common legal approach is to dump ROMs from physical cartridges you own.

## Method 1: Import from the Files App (Easiest)

This is the most straightforward method on iOS 17+.

1. **Transfer your ROM files to your iPhone or iPad.** You can do this via AirDrop, iCloud Drive, a USB cable and the Files app on Mac, or any cloud storage app like Google Drive or Dropbox.

2. **Open the Files app** and locate your ROM file.

3. **Long-press the ROM file** and tap **Share**.

4. **Select Provenance** from the share sheet. Provenance will open and automatically import the game into your library.

5. **Wait for the import to complete.** Provenance will scan the file, identify the system, and add the game to your library with artwork if available.

## Method 2: WebDAV (Recommended for Bulk Transfers)

Provenance includes a built-in WebDAV server that lets you transfer multiple ROMs at once from a computer on the same network.

1. **Open Provenance on your iPhone or iPad.**

2. **Go to Settings > Import/Export > WebDAV Server** and tap **Start WebDAV Server**. Provenance will show you an IP address and port number.

3. **On your Mac or PC**, open Finder (Mac) or Windows Explorer (Windows). On Mac, press `Cmd+K` in Finder and enter `http://[IP address shown in Provenance]:[port shown in Provenance]/`. On Windows, map a network drive to the same address, including the port.

4. **Copy your ROM files** into the appropriate system folder in the WebDAV share.

5. **Stop the WebDAV server** in Provenance and return to the library. Provenance will scan and import the new files.

## Method 3: iTunes File Sharing

If you prefer a wired connection to a Mac or PC:

1. **Connect your iPhone or iPad to your computer** with a USB cable.

2. **Open Finder on Mac** (or iTunes on Windows) and select your device.

3. **Go to the Files tab** and find Provenance in the app list.

4. **Drag your ROM files** into the Provenance documents folder.

5. **Disconnect and open Provenance.** The app will detect and import the new files.

## Method 4: Adding Games to Apple TV

Apple TV has a more restricted filesystem, so game management works differently.

1. **Add games using one of the methods above on your iPhone or iPad first.**

2. **Use the Provenance WebDAV server on iPhone/iPad** and access it from Apple TV via the Provenance tvOS app, if you have a shared library configured.

3. Alternatively, check the Provenance wiki for the latest recommended approach for Apple TV, as options may expand with new app versions.

## Tips

- Provenance automatically identifies most ROMs and downloads artwork from an online database. If a game is not recognized, try renaming the file to match the official game title.
- BIOS files for certain systems (PlayStation, Sega Saturn, etc.) must be added separately. See the Provenance wiki for the full list of required BIOS files and where to place them.
- If a game does not appear after import, check that the file extension matches the expected format for that system.

## Download Provenance

Provenance is free on the App Store and supports 38+ retro systems out of the box. [Get Provenance on the App Store](https://apps.apple.com/us/app/provenance-app/id1596862805). For advanced features, explore [Provenance Plus](/plus/).
