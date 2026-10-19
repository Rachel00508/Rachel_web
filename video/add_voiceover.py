"""Sync locally generated English narration to the 10-second Rachel promo.

The original MP4 is left untouched. Requires FFmpeg/ffprobe. First generate
the WAV clips with video/render_offline_voice.ps1, then run this script.
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

VIDEO_DIR = ROOT / "video"
VOICE_DIR = VIDEO_DIR / "voice"
VOICE_DIR.mkdir(exist_ok=True)
INPUT = VIDEO_DIR / "rachel_tiktok_10s.mp4"
OUTPUT = VIDEO_DIR / "rachel_tiktok_10s_voice.mp4"

# Start/end times follow verified visual cuts in create_tiktok_promo.py.
# One short phrase belongs to each visible segment.
SEGMENTS = [
    ("intro", 0.12, 1.55, "Meet Rachel."),
    ("hermes", 1.67, 3.18, "Fresh and green."),
    ("jo_malone", 3.30, 4.81, "Coastal calm."),
    ("armani", 4.93, 6.44, "Tea and calm."),
    ("versace", 6.56, 8.07, "A brighter mood."),
    ("outro", 8.20, 10.00, "Find your signature."),
]


def duration(path: Path) -> float:
    result = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
        text=True,
    )
    return float(json.loads(result)["format"]["duration"])


def render():
    inputs = []
    filters = ["[0:a]volume=0.18[bed]"]
    tracks = ["[bed]"]
    for i, (name, start, end, line) in enumerate(SEGMENTS, start=1):
        path = VOICE_DIR / f"{name}.wav"
        clip_duration = duration(path)
        available = end - start - 0.08
        print(f"{name}: {line} / {clip_duration:.2f}s / slot {available:.2f}s", flush=True)
        if clip_duration > available:
            raise RuntimeError(f"{name} narration is {clip_duration:.2f}s but its visual window is {available:.2f}s: {line}")
        inputs += ["-i", str(path)]
        filters.append(f"[{i}:a]adelay={int(start * 1000)}:all=1,volume=1.15[v{i}]")
        tracks.append(f"[v{i}]")
    filters.append("".join(tracks) + f"amix=inputs={len(tracks)}:duration=first:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=8[out]")
    command = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(INPUT), *inputs,
               "-filter_complex", ";".join(filters), "-map", "0:v:0", "-map", "[out]",
               "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", "10", "-movflags", "+faststart", str(OUTPUT)]
    subprocess.run(command, check=True)
    print(f"Rendered: {OUTPUT}")


def main():
    render()


if __name__ == "__main__":
    main()
