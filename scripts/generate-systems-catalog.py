#!/usr/bin/env python3
"""Generate data/systems.json from Provenance's checked-in systems.plist."""
import argparse
import json
import plistlib
from pathlib import Path


SECTIONS = ("Nintendo", "Sega", "Atari", "Sony", "SNK", "NEC", "Bandai", "Arcade",
            "Computers", "Other systems", "Game engines & media")
ARCADE = {"mame", "cps1", "cps2", "cps3"}
COMPUTERS = {"appleII", "dos", "ep128", "msx", "msx2", "pc98", "zxspectrum"}
MEDIA = {"music", "wolf3d"}
NAMES = {
    "3ds": "Nintendo 3DS", "32X": "Sega 32X", "3DO": "3DO Interactive Multiplayer",
    "atari8bit": "Atari 8-bit Computers", "colecovision": "ColecoVision", "dos": "MS-DOS",
    "dreamcast": "Dreamcast", "ds": "Nintendo DS", "genesis": "Genesis / Mega Drive",
    "intellivision": "Intellivision", "mame": "MAME Arcade", "mastersystem": "Master System",
    "nes": "NES / Famicom", "odyssey2": "Odyssey²", "palmos": "Palm OS", "pce": "PC Engine / TurboGrafx-16",
    "pcecd": "PC Engine CD / TurboGrafx-CD", "pc98": "PC-98", "pcfx": "PC-FX", "snes": "Super Nintendo",
    "saturn": "Sega Saturn", "supervision": "Watara Supervision", "vectrex": "Vectrex",
    "wsc": "WonderSwan Color",
}
GUIDES = {"2600": "atari2600", "ds": "nds", "vb": "virtualboy"}
# The original PlayStation 2 guide remains available even when its core is disabled.
KEEP_GUIDES = {"ps2"}


def section_for(system_id, maker):
    if system_id in ARCADE:
        return "Arcade"
    if system_id in COMPUTERS:
        return "Computers"
    if system_id in MEDIA:
        return "Game engines & media"
    return maker if maker in SECTIONS else "Other systems"


def catalog(source, revision):
    grouped = {section: [] for section in SECTIONS}
    for system in source:
        system_id = system["PVSystemIdentifier"].removeprefix("com.provenance.")
        enabled = system.get("PVSupported", True)
        if system_id == "retroarch" or (not enabled and system_id not in KEEP_GUIDES):
            continue
        maker = system["PVManufacturer"]
        entry = {
            "id": system_id,
            "name": NAMES.get(system_id, system["PVSystemName"]),
            "guide": GUIDES.get(system_id, system_id.lower()),
        }
        if not enabled:
            entry["note"] = "Limited availability"
        elif system.get("PVAppStoreDisabled"):
            entry["note"] = "Outside the App Store"
        formats = sorted({extension.lower().lstrip(".") for extension in system.get("PVSupportedExtensions", [])
                          if extension.lower().lstrip(".") not in {"zip", "7z"}})
        if formats:
            entry["formats"] = formats
        grouped[section_for(system_id, maker)].append(entry)

    return {
        "revision": revision,
        "groups": [
            {"name": section, "systems": sorted(entries, key=lambda entry: entry["name"].casefold())}
            for section, entries in grouped.items() if entries
        ],
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plist", type=Path)
    parser.add_argument("revision", help="Provenance commit containing the input plist")
    args = parser.parse_args()
    with args.plist.open("rb") as source:
        output = catalog(plistlib.load(source), args.revision)
    target = Path(__file__).resolve().parent.parent / "data/systems.json"
    target.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
