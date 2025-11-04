---
title: "Release 2.1.0"
date: 2022-02-15T00:00:12-04:00
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
description: "2.1.0 Release with UI updates and more."
image: "images/banners/210banner.jpg"
lightgallery: true
fontawesome: true
linkToMarkdown: true
rssFullText: false
layout: photography
---

# Release 2.1.0

## Links

- 📲 __[iOS IPA](https://provenance-builds.s3-us-east-2.amazonaws.com/Provenance%202022-02-15%2023-07-51/Provenance.ipa)__
- 📺 __[tvOS IPA](https://provenance-builds.s3-us-east-2.amazonaws.com/ProvenanceTV-Release%202022-02-15%2023-19-32/Provenance.ipa)__
- 📝 __[GitHub](https://github.com/Provenance-Emu/Provenance/releases/tag/2.1.0)__
- 🏪 __[AltStore](/altstore/)__
<!-- - 🥰 __[Patreon](https://patreon.com/provenance/)__ -->
- ___[Installation Instructions](https://wiki.provenance-emu.com/installation-and-usage/installing-provenance/sideloading)___

## Changes

### Site

- IPAs now hosted in Amazon S3 for faster downloads/installs.

### Core options

- Added support for more styles of Core Options (multiple select options, enumerations, Int and Float ranges)
- New Options exposed for
  - Mupen (N64)
  - Mednafen

{{< figure src="images/options-mednafen-ios.jpg" title="Mednafen new options menu items" width="360">}}
{{< figure src="images/ios-coreoptions-mednafen.jpg" title="Mednafen new options menu items" width="360">}}
{{< figure src="images/ios-coreoptions-genesis.jpg" title="Mednafen new options menu items" width="360">}}
{{< figure src="images/ios-coreoptions-mupen.jpg" title="Mednafen new options menu items" width="360">}}

### Controllers

{{< figure src="images/n64-onscreen-joystick-HD 1080p.mov" title="N64 and PSX new on-screen joystick" width="480px">}}
{{< figure src="images/n64-ios-newlayout.jpg" title="Updated N64 on screen controls" width="360">}}
{{< figure src="images/ipad-keyboard-controller.jpeg" title="iPad SmartKeyboard as a gamepad" width="360">}}

### GamePad menu Navigation

Fully navigate the iOS/iPad OS UI with any compatible GamePad (MFi, DualShock, Steam, iCade etc)
Completely wireless play, no need to be within touching distance of your mobile devices!

{{< figure src="images/gamepad-navigation-HD 1080p.mov" title="Full interface navigation with GamePad" width="480px">}}

### Update UI components for iOS and tvOS

{{< figure src="images/browser-ipad.jpg" title="iPad Browser UI" width="360">}}
{{< figure src="images/gameboy-ios-palettes-menu.jpg" title="GameBoy Color Select Menu" width="360">}}
{{< figure src="images/ios-menu-icons.jpg" title="iOS Menu Icons" width="360">}}
{{< figure src="images/tvos-browser-options.jpg" title="Apple TV new options styling" width="360">}}
{{< figure src="images/tvos-settings.jpg" title="tvOS Settings new Styling" width="360">}}

### Render Engine

{{< figure src="images/crt-closeup.jpg" title="CRT Filter improvements"width="360" >}}

#### Experimental Metal backend

All new CRT and more shaders native in Metal.

#### Google Cardboard / Split View 3D for VirtualBoy

Added a new option to enable Mednafen's VirtualBoy core to render 3D in left/right split view, with optional middle gap.
This is early support for using stereoscopic 3D screens such as 3D TV's with "Side by Side" mode, or Google Cardboard or similar headset with a mounted iPhone.

### Spotlight

{{< figure src="images/ios-spotlight-mk.jpg" title="Fixed iOS Spotlight Results" width="360">}}

### Log viewer

{{< figure src="images/ios-logview2.jpg" title="Fixed iOS Spotlight Results" width="360">}}
