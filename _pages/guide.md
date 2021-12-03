---
layout: page
title: User Guide
include_in_header: true
---

* TOC
{:toc}

# Installation

See [this page]({% link _pages/install.md %}).

# Quick Start

The easiest way to try out UTM is with one of the [prebuilt VMs](https://mac.getutm.app/gallery/). Just download, unzip, and open the `.utm` from your device.

# Settings

## Background Options

If you enable running VM in the background, then UTM will query your location every few seconds to prevent iOS from killing the app. UTM does not store this unless debug logging is enabled (it shows up in the debug log). UTM does not send this data anywhere unless you manually export it and send it. Note that iOS may still kill the background app if it is using too much resources.

Auto save on background allows UTM to take a snapshot of the running VM whenever it enters the background. Then, if iOS decides to terminate it for any reason, it will resume from the snapshot. It is not recommended that this is enabled with the option to run in the background because any work done in the background will be lost when the snapshot is restored.

Auto save on low memory does the same thing except whenever iOS warns the app that it is running low on memory and may be terminated soon. Note this may not always work because iOS might kill the app as it is saving the snapshot.

## Gesture and Input Options

Gesture and input options are shared amongst all VMs and is configured in the Settings app. These do not apply to Console mode.

Gestures can be used to simulate right clicks, click and drags, or mouse wheel. You can also disable some gestures. See the section below for a list of gestures.

For cursor modes, you can choose how each input device simulates a mouse cursor. "Touch mode" or "tablet mode" emulates a USB tablet device and sends direct input events. "Follow cursor" emulates a touchpad where you can drag the cursor around. To use different cursor modes, your VM needs to support USB HID devices (specifically USB mouse and USB tablet) and you cannot use "legacy mode" input.

For the option to try hiding cursor, the cursor can only be hidden if [SPICE guest agent tools](https://www.spice-space.org/download.html) are installed.

## Gamepad Options

You can use any iOS supported gamepad and map the gamepad keys to keyboard keys. The right thumbstick maps to the mouse and the left thumbstick maps to the scrollwheel.

# Home Screen

## Exit

Due to an iOS bug, you **cannot** force quit the app (for example, by swiping up in the app switcher). The only good way to quit UTM is the X button on the top left of the screen (or with the Power/Quit button in the VM). If you quit the app without using the designated exit button, then the app will no longer launch until you reboot your device.

## Creating a new VM

Use the + button on the top right of the screen to create a new VM.

## Starting a VM

Each valid `.utm` package in UTM's `Documents` directory will show up as a tile. To start the VM, press the large button in the center of the tile. If there is currently a suspend image, then starting the VM will automatically resume it. You can only start one VM per launch of UTM. If you power down or exit UTM, then you can launch UTM again to get to the home screen.

## Modifying an existing VM

For each tile, there is an "i" button that you can press to modify the VM settings.

# New VM Settings

When creating a new VM with the + button, you are presented with a simplified set of options.

## System

Read the section below on **System** settings for more information.

## Drives

Read the section below on **Drives/Images** for more information.

## Advanced

Check "Open Configuration after Creation" to show all configuration options.

# Existing VM Settings

## Name

A unique name for this VM which will also be the file name of the `.utm` package.

## Debug

Check "Debug Log" to capture a verbose debug log that will be stored in `debug.log` inside the `.utm` package for this VM. Please note that sensitive data may be captured in this log including keystrokes and location data (if background is enabled). The "Export Log..." option allows you to quickly access `debug.log` so you can send it somewhere. The current version of UTM is also displayed in this section.

## System

### Architecture

One of the supported CPU architectures that QEMU can emulate. The most common option is **x86_64** which emulates an 64-bit PC.

### System

QEMU does not just emulate a CPU, it emulates an entire system. This allows you to choose one of QEMU's supported system. In most cases, you do not need to change from the default system for the selected architecture. It will automatically be highlighted when you select an architecture.

### Memory

The amount of host memory to assign to the VM. Please note that iOS does not permit a single app to use more than about 40% of the device's memory (it is even less on some devices). Because of JIT and other factors, the amount of memory specified here is not the total amount of memory that the VM will use. Near the bottom of the System page, you can find the estimated RAM usage along with the amount of RAM on the system.

If you do not know how much RAM to use, go with a safe guess and if it is too much the VM will either refuse to boot or you will get a warning about memory usage.

### CPU Count

**In most cases, you should put '1' here!** Even if you have a device with multiple cores, QEMU does not emulate multiple CPU on separate cores unless the architecture supports it. The most common architecture, x86_64 (and i386) do **not** support multicore emulation on ARM. Only architectures with a weak memory model (such as ARM and ARM64) does support multicore emulation (on ARM).

### Boot

Only applicable to **pc** targets. It specifies the device to boot from first. On other targets this option is ignored. It is usually safe to set it to **cd** even if you do not have a CD drive.

### JIT Cache

See comment about **Memory** above. This lets you fine tune the JIT cache size. By default, the JIT cache is set to 1/4 of the host memory. So for example, if you set host memory to 512 MB, then JIT cache will be 128 MB for a total of 640 MB. However, because iOS treats JIT memory differently, it sees JIT memory as double the size that is actually used. So iOS thinks the app is using 768 MB of memory. Remember iOS will kill any app that uses more than 40% of the total memory.

The **Estimated Usage** cell near the bottom will do the math for you.

### Force Multicore

Advanced users only. This will force multiple CPUs to be emulated on different physical cores. Note that this is unsupported for a reason. The emulation will not be correct in most cases and this should only be used for development or very simple BIOS apps.

### Machine Properties

Some targets support additional properties. You can specify them here in a comma separated list of the form `property=value`. For example: `via=pmu,vmport=off`. This is an advanced option that most do not need to touch. You can refer to QEMU documentation for valid properties to use.

### Additional QEMU Arguments

You can specify additional arguments to pass to QEMU. Note that the options are not checked in case they collide with automatically generated arguments. You can enable debug logging to see what options are passed to QEMU. Each additional argument is separated by a space. You can also use spaces in an argument such as `-option value`. If you want to escape spaces, make sure to use quotes: `-option "value with space"`.

## Drives/Images

To add a new drive, press the + button on the top right. To change the image file of an existing drive, select the drive in the list. To delete an existing drive you can swipe a row left or use the Edit button on the top right and then tap the - button to the left of the row.

Note that when you delete a drive, you will be prompted to delete the underlying file. If you choose not not delete the file, it will continue to use your storage and the disk image will be stored in the `.utm` package. You can add a new drive and re-link it to the image.

### Select Image

You can get to the selector by choosing the "Image Path".

You can select an existing image in the list or import/create a new image. Only images in the current `.utm` package are listed here. You can delete any image by swiping left or with the Edit button. Note that if you delete an image here, the file will be deleted permanently.

Press the + button on the top right to either Import or Create a new image. If you choose to Import an image, you can presented with a file selection screen where you can choose a disk image (e.g. ISO file) from any location. A copy of that file will be made into the `.utm` package. Once the import completes, it is safe to delete the original file.

If you choose to Create a new image, you can give it a file name (can be anything, the extension doesn't matter) and a size. Note the created disk image will be a QCOW2 formatted file that will auto-grow up to the specified size. Current UTM limitation prevents you from creating more than one disk image per launch.

### Image Type

* **Disk Image**: Most common type. Usually a QCOW2 image to use as the main disk for the VM. However, any disk image supported by QEMU can be used here. Note that only QCOW2 images support suspend/resume features.
* **CD/DVD Image**: Typically a read-only image such as an .ISO to use for booting into an installer or live CD.
* **BIOS**: Advanced usage. Allows you to specify a custom BIOS image.
* **Linux Kernel**: Advanced usage. Boot directly into a Linux kernel.
* **Linux RAM Disk**: Advanced usage. Linux initrd.
* **Linux Device Tree Binary**: Advanced usage. Linux DTB. Not required for Linux boot.

### Image Location

Specifies the hardware location for disk images and CD images. The most common option is **ide** for PC emulation. For ARM Virt emulation, use **virtio**. Other options are for advanced users only.

## Display

### Type

Full Graphics will emulate a VGA connection for graphical interfaces. Console Mode is faster but can only output a character port from the emulated device directly to UTM's built in terminal emulator.

### Resolution

Requires [SPICE guest agent tools](https://www.spice-space.org/download.html) to be installed on the VM guest. Currently only supported on Windows and a few Linux distributions.

**Fit to Screen** without **Retina Mode** will use the "effective" resolution of the device. This is usually 1/2 or 1/3 of the number of pixels on the display. You would need to use the Zoom function to zoom into the display, which should be the correct aspect ratio.

**Fit to Screen** with **Retina Mode** will use the "native" resolution of the device. If the OS does not have a HiDPI mode, then objects will be too small. This also requires a lot of host RAM for a large screen device (like the iPad), so if you enable this option and it does not work, you likely do not have enough RAM.

**Retina Mode** enabled without **Fit to Screen** enabled does nothing.

### Scaling

You can choose the minfilter (downscaling) and magfilter (upscaling). Linear will make text look blurry but images look smooth. Nearest neighbor will make text look sharp but images look blocky. If you are booting into a text UI, it is recommended that you choose nearest neighbor.

### Console Settings

Currently you can only choose the Font and Font Size. The Font can be any mono-spaced font installed on the system. If you want the cursor to blink, you have the option to enable that here as well.

### Resize Console Command

When you press the resize button in the VM, it will send this string of text to the terminal. The following replacements will be made to the string:

* `$ROWS` will be replaced by the number of rows that can currently be seen on screen.
* `$COLS` will be replaced by the number of columns that can currently be seen on screen.
* `\n` will be replaced by a new line (Enter key).

You can use this to send a resize command to the VM. The default uses `stty` which should work on most Linux distributions.

## Input

### Legacy Mode

When enabled, a PS/2 mouse and keyboard will be used. Otherwise a USB mouse and keyboard will be used. Legacy mode does not support emulated USB tablet device (used by "touch mode" or "tablet mode").

### Invert Mouse Scroll

When enabled, an external mouse or trackpad scroll event will be inverted.

### Gesture and Cursor Settings

Goes to the Settings screen.

## Networking

You can enable/disable networking and select the network card to emulate.

### Isolate Guest

This option makes it so the guest cannot see the host network at all.

### Advanced Configuration

These options let you configure the virtual guest network. UTM uses QEMU's slirp usermode networking driver.

### Port Forwarding

You can forward guest ports to host ports. For example, if you have an HTTP server running on the VM's port 80 and you forward host TCP port 8080 to guest TCP port 80 then you can access "http://localhost:8080/" from Safari to communicate with the HTTP server. If host/guest addresses are not specified, then all host interfaces will be binded to and all guests will be forwarded.

## Sound

You can enable/disable sound and select the sound card to emulate. Does not work in Console mode.

## Sharing

### Clipboard Sharing

Requires [SPICE guest agent tools](https://www.spice-space.org/download.html). This will synchronize the VM's clipboard with the device's clipboard. The synchronization happens whenever you copy something inside the VM or if you task switch (UTM to the foreground) on the host.

### Shared Directory

Requires [SPICE WebDAV service](https://www.spice-space.org/download.html). Note that Windows XP support by SPICE is not perfect and Windows 7 is recommended for working WebDAV. You can share any directory inside UTM's `Documents` directory except any `.utm` package.

# Virtual Machine

## Toolbar options

From left to right:

* **Power**: sends a power button event to the VM. Once this is pressed, the button changes to an X which allows you to force quit UTM. Note the power and X button are the only safe way of exiting UTM. If you quit UTM any other way (including swiping up from the app switcher), an iOS bug will prevent you from launching UTM again until you reboot.
* **Pause**: suspends the VM and makes a snapshot (if supported). This button becomes a Play button after Pause completes and can resume the VM (and delete the snapshot).
* **Restart**: sends a reset button event to the VM.
* **Zoom**: first press will attempt to zoom the display to fit. Second press will reset the display state (zoom out and centered).
* **Keyboard**: shows or hides the keyboard. In console mode, the keyboard must be shown to type anything in the console.
* **Settings**: not implemented
* **Hide**: Hides the toolbar. To show again, use a **three finger downwards** gesture. If the keyboard is visible, you need to make the gesture twice.

## Gestures

In Console mode, the only gestures available is Three Finger Swipe Up/Down.

### Long press

Configurable in Settings:

* Disabled
* Click & Hold (default)
* Right Click

### Two Finger Tap

Configurable in Settings:

* Disabled
* Right Click (default)

### Two Finger Pan

Configurable in Settings:

* Disabled
* Move Screen (default)
* Click & Hold (move cursor while clicking)
* Mouse Wheel (only up and down)

### Two Finger Pinch

If Move Screen is selected for Two Finger Pan: zoom the screen.

Otherwise: does nothing.

### Two Finger Swipe

Configurable in Settings:

* Disabled (default)
* Mouse Wheel (each swipe up or down is one event)

### Three Finger Pan

Configurable in Settings:

* Disabled (default)
* Move Screen
* Click & Hold (move cursor while clicking)
* Mouse Wheel (only up and down)

### Three Finger Swipe Up

If toolbar is visible: hide the toolbar

If toolbar is not visible: show the keyboard

### Three Finger Swipe Down

If toolbar is visible: hide the keyboard

If toolbar is not visible: show the toolbar

