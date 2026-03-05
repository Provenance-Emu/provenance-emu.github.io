---
title: "How to Install Custom Controller Skins"
date: 2026-03-05T00:00:00-05:00
description: "Step-by-step guide to downloading and installing custom controller skins in Provenance, the free iOS and tvOS retro game emulator."
tags: ["guide", "how-to"]
---

Provenance supports custom controller skins, letting you replace the default on-screen controls with artwork that more closely matches the original hardware. This guide walks you through finding, downloading, and installing custom skins.

## What Are Controller Skins?

Controller skins are image-based themes for the on-screen button overlay that appears when playing games without a physical controller. A skin defines the layout, appearance, and button positions for a particular system. Provenance uses a `.provenance-skin` file format (a ZIP archive containing image assets and a JSON configuration).

## Steps

1. **Find a skin to download.** The Provenance community shares skins on the official Discord server (`discord.gg/4TK7PU5`) and on GitHub. Look for files with the `.provenance-skin` extension.

2. **Download the skin file to your iPhone or iPad.** If you are downloading from Safari, the file will be saved to the Files app in your Downloads folder. If sent via Discord or another app, use the share sheet to save it to the Files app.

3. **Open Provenance.** From the main library screen, tap the **Settings** icon (gear icon in the top-right corner).

4. **Navigate to Controller Skins.** In Settings, scroll to the **Controller Skins** section and tap it to open the skin manager.

5. **Tap the import button (+ icon).** This will open the Files picker. Navigate to where you saved the `.provenance-skin` file and select it. Provenance will import and validate the skin.

6. **Activate the skin.** Once imported, the skin will appear in the list. Tap on it and select **Use This Skin** to set it as the active skin for that system or globally.

7. **Launch a game to verify.** Start any game for the system the skin is designed for. The custom skin should appear as the on-screen controller overlay.

## Tips

- Skins are system-specific. A skin designed for SNES will not work for Game Boy Advance — make sure you download a skin compatible with the system you want to use it for.
- If a skin does not appear after import, check that the `.provenance-skin` file is not corrupted. Re-download it if necessary.
- You can install multiple skins and switch between them at any time from the Controller Skins settings.
- On iPad, skins often have a landscape-specific layout. Make sure you have a skin that supports your preferred orientation.

## Download Provenance

Provenance is free to download from the App Store. [Get Provenance on the App Store](https://apps.apple.com/us/app/provenance-app/id1596862805). For additional features, explore [Provenance Plus](/plus/).
