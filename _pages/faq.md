---
layout: page
title: FAQ
include_in_header: true
---

* TOC
{:toc}

# General

## What is this?

UTM is an app for running other operating systems on your iPhone or iPad. It is **not** for running iOS on other systems. This allows you, among other things, to run Windows or Linux on your iOS device at a usable speed.

## Does this require a jailbreak?

UTM is supported on iOS 11, 12, and 13 for non-jailbroken devices through sideloading. UTM requires a jailbreak to use on iOS 14.

## How do I sideload an app?

Sideloading allows you to load unofficial apps on your iOS device. If you have a free Apple account, you must re-sign the app every 7 days. If you have a paid ($99/year) Apple developer account, you must re-sign the app every year. For more information checkout the [install page]({% link _pages/install.md %}).

## How does UTM work?

The majority of the work is done by [qemu](https://www.qemu.org). Because iOS devices lack hardware virtualization support, we cannot use the KVM accelerator and instead use the TCG accelerator which does dynamic code translation and JIT compilation. UTM also includes a [SPICE](https://www.spice-space.org) client written for Metal. This connects with the SPICE server in qemu and allows for some para-virtualization as the QXL graphics driver running on the guest OS can send low-level draw commands directly to Metal APIs.

For more in-depth information on the changes made to qemu for JIT to work on iOS, check out [this document](https://github.com/utmapp/qemu/blob/ios-support/docs/devel/ios.rst). 

## What are the limitations?

The lack of hardware virtualization on Apple A-chips means that even for ARM code we must re-compile it with JIT. Therefore performance would never reach the levels possible with KVM. There is also no support for GPU virtualization so that means no DirectX or OpenGL. This makes most modern games non-playable.

## How can I contribute?

We need all the help we can get! We need both people to work on improving/optimizing the qemu backend as well as people working on the UI and front-end. You can check out our [Github](https://github.com/utmapp/) and join our [Discord](https://discord.gg/UV2RUgD).

# Usage

## How do I create a VM?

Check out [the user guide]({% link _pages/guide.md %}) for usage directions. Check out [this page](https://mac.getutm.app/gallery) for some prebuilt VMs you can try.

## Help! I hid the toolbar!

Use a three-finger swipe down gesture to get it to re-appear.

## I get an error message about 'no bootable device'

You either forgot to add an ISO OR you did not add it as a 'CD/DVD Image' OR your ISO is not bootable.

## Linux boot fails early with a crash message

It's highly likely that you did not allocate enough RAM for the Linux Kernel/initrd to decompress.

## I get an error message about 'Guest Disabled Display'

This is expected on ARM systems before the display is set up. You just have to wait until the OS sets up the display late in the boot process. On older devices, this may take a very long time.

## The VM is stuck booting

On older systems booting any VM may take a very long time. Other common issues are: not allocating enough RAM, allocating too much RAM and allocating more cores than you have on your device. Note that if you are emulating i386 or x86_64, you *must* configure the VM with 1 core.

## How much RAM can I use for a VM?

A good rule of thumb is to allocate no more than 1/4 of your device's total memory. iOS will kill any app that uses 40-50% or more of the total system memory. Additionally, UTM/QEMU consumes some memory itself. If you keep seeing the low memory warning, you should lower the amount allocated.

# Support

## I found a bug/crash or something else unexpected

Please open an issue on [Github](https://github.com/utmapp/) so it can be tracked. Be sure to follow the template when creating an issue!

## I need help with UTM

You can join the community run [Discord](https://discord.gg/UV2RUgD). Please read and follow the rules.
