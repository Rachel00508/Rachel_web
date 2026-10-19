"""Render Rachel's 10-second 9:16 TikTok preview from local site assets.

Run from the perfume project root: python video/create_tiktok_promo.py
Requires Pillow, NumPy and FFmpeg. All source images are illustrative concepts.
"""

from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "video"
OUT.mkdir(exist_ok=True)
W, H, FPS, DURATION = 1080, 1920, 30, 10
FRAMES = FPS * DURATION
CREAM = (248, 246, 241)
OLIVE = (49, 61, 52)
GOLD = (173, 150, 113)
INK = (37, 35, 31)
MUTED = (111, 107, 100)
FONT_ROOT = Path("C:/Windows/Fonts")
SERIF = FONT_ROOT / "georgia.ttf"
SERIF_ITALIC = FONT_ROOT / "georgiai.ttf"
SANS = FONT_ROOT / "segoeui.ttf"
SANS_BOLD = FONT_ROOT / "segoeuib.ttf"

PRODUCTS = [
    ("Hermès", "Un Jardin sur le Nil", "A green escape.", "hermes-nile.png"),
    ("Jo Malone London", "Wood Sage & Sea Salt", "The coast, close to you.", "jo-malone-sea-salt.png"),
    ("Armani Privé", "Thé Yulong", "A moment of calm.", "armani-the-yulong.png"),
    ("Versace", "Bright Crystal", "A brighter mood.", "versace-bright-crystal.png"),
]
STARTS = [0.0, 1.55, 3.18, 4.81, 6.44, 8.07]
ENDS = STARTS[1:] + [10.0]
FADE = 0.20


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def centered(draw: ImageDraw.ImageDraw, y: int, text: str, face: ImageFont.FreeTypeFont, fill: tuple[int, int, int]):
    bbox = draw.textbbox((0, 0), text, font=face)
    draw.text(((W - (bbox[2] - bbox[0])) / 2, y), text, font=face, fill=fill)


def editorial_line(draw: ImageDraw.ImageDraw, y: int, width: int = 118):
    draw.line(((W - width) // 2, y, (W + width) // 2, y), fill=GOLD, width=3)


def make_intro(t: float) -> Image.Image:
    frame = Image.new("RGB", (W, H), OLIVE)
    draw = ImageDraw.Draw(frame)
    # Quiet editorial circles echo the hero art on the website.
    offset = int(15 * math.sin(t * 1.8))
    draw.ellipse((130 + offset, 415, 950 + offset, 1235), outline=(91, 106, 91), width=3)
    draw.ellipse((220 - offset, 505, 860 - offset, 1145), outline=(74, 90, 76), width=2)
    centered(draw, 264, "R A C H E L", font(SERIF, 84), CREAM)
    centered(draw, 380, "P A R F U M S", font(SANS, 24), (217, 213, 194))
    editorial_line(draw, 806)
    centered(draw, 865, "Wear what", font(SERIF, 96), CREAM)
    centered(draw, 984, "moves you.", font(SERIF_ITALIC, 100), (221, 208, 184))
    centered(draw, 1278, "CURATED FRAGRANCES, DISTINCTLY YOU", font(SANS, 25), (218, 219, 206))
    centered(draw, 1630, "DISCOVER THE RACHEL EDIT", font(SANS_BOLD, 24), CREAM)
    return frame


def make_product(index: int, progress: float, photos: list[Image.Image]) -> Image.Image:
    frame = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(frame)
    brand, title, mood, _ = PRODUCTS[index]
    # One restrained pan per image keeps the generated product still life intact.
    source = photos[index]
    x = int(45 + 28 * progress)
    y = int(40 + 24 * progress)
    crop = source.crop((x, y, x + 1080, y + 1080))
    frame.paste(crop, (0, 82))
    draw = ImageDraw.Draw(frame)
    draw.rectangle((0, 0, W, 82), fill=CREAM)
    draw.text((64, 25), "R A C H E L", font=font(SERIF, 31), fill=INK)
    draw.text((754, 31), f"0{index + 1}  /  0{len(PRODUCTS)}", font=font(SANS_BOLD, 22), fill=MUTED)
    draw.rectangle((0, 1162, W, H), fill=CREAM)
    draw.text((72, 1232), "THE RACHEL EDIT", font=font(SANS_BOLD, 25), fill=GOLD, stroke_width=0)
    draw.line((72, 1300, 1008, 1300), fill=(215, 211, 200), width=2)
    draw.text((72, 1370), brand, font=font(SERIF, 59), fill=INK)
    title_size = 66 if len(title) < 19 else 55
    draw.text((72, 1460), title, font=font(SERIF_ITALIC, title_size), fill=OLIVE)
    draw.text((74, 1585), mood, font=font(SANS, 35), fill=MUTED)
    draw.text((73, 1776), "EXPLORE THE COLLECTION", font=font(SANS_BOLD, 27), fill=OLIVE)
    draw.line((73, 1824, 505, 1824), fill=GOLD, width=3)
    draw.text((73, 1860), "CONCEPT IMAGERY  ·  NOT ACTUAL PACKAGING", font=font(SANS, 17), fill=(143, 139, 132))
    return frame


def make_outro(t: float, photos: list[Image.Image]) -> Image.Image:
    frame = Image.new("RGB", (W, H), OLIVE)
    for i, photo in enumerate(photos):
        tile = photo.resize((490, 490), Image.Resampling.LANCZOS)
        frame.paste(tile, (42 + (i % 2) * 506, 185 + (i // 2) * 506))
    draw = ImageDraw.Draw(frame)
    draw.rectangle((0, 1260, W, H), fill=OLIVE)
    centered(draw, 1326, "R A C H E L", font(SERIF, 84), CREAM)
    centered(draw, 1444, "Find your signature.", font(SERIF_ITALIC, 57), (221, 208, 184))
    editorial_line(draw, 1544)
    centered(draw, 1617, "EXPLORE THE COLLECTION", font(SANS_BOLD, 28), CREAM)
    centered(draw, 1808, "FRAGRANCE FOR THE ART OF BEING YOURSELF", font(SANS, 18), (205, 209, 196))
    return frame


def current_scene(t: float) -> int:
    return max(i for i, start in enumerate(STARTS) if t >= start)


def scene_frame(scene: int, t: float, photos: list[Image.Image]) -> Image.Image:
    if scene == 0:
        return make_intro(t)
    if scene == 5:
        return make_outro(t - STARTS[scene], photos)
    duration = ENDS[scene] - STARTS[scene]
    progress = max(0.0, min(1.0, (t - STARTS[scene]) / duration))
    return make_product(scene - 1, progress, photos)


def add_tone(audio: np.ndarray, start: float, duration: float, frequency: float, amplitude: float, decay: float = 1.0):
    sr = 48000
    first = round(start * sr)
    n = min(round(duration * sr), len(audio) - first)
    if n <= 0:
        return
    x = np.arange(n) / sr
    envelope = (1 - np.exp(-x * 55)) * np.exp(-x * decay)
    tone = (np.sin(2 * np.pi * frequency * x) + 0.25 * np.sin(2 * np.pi * frequency * 2 * x)) * envelope
    audio[first:first + n] += amplitude * tone


def make_audio(path: Path):
    sr = 48000
    count = DURATION * sr
    audio = np.zeros(count, dtype=np.float64)
    chords = [(146.83, 174.61, 220.0, 261.63), (130.81, 164.81, 196.0, 246.94),
              (116.54, 146.83, 174.61, 220.0), (130.81, 164.81, 196.0, 261.63)]
    for bar, chord in enumerate(chords):
        start = bar * 2.5
        for f in chord:
            add_tone(audio, start, 2.48, f, 0.012, 0.28)
        for beat, f in enumerate(chord):
            add_tone(audio, start + beat * 0.625, 0.8, f * 2, 0.025, 5.5)
    rng = np.random.default_rng(42)
    for beat in np.arange(0, 10, 0.625):
        first = int(beat * sr)
        n = min(int(0.23 * sr), count - first)
        x = np.arange(n) / sr
        kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-x * 25)) * x) * np.exp(-x * 22)
        audio[first:first + n] += 0.11 * kick
    for tick in np.arange(0.3125, 10, 0.3125):
        first = int(tick * sr)
        n = min(int(0.065 * sr), count - first)
        x = np.arange(n) / sr
        noise = rng.normal(0, 1, n)
        audio[first:first + n] += 0.009 * noise * np.exp(-x * 75)
    fade = np.minimum(np.arange(count) / (sr * 0.25), (count - np.arange(count)) / (sr * 0.5)).clip(0, 1)
    audio *= fade
    audio /= max(1.0, np.max(np.abs(audio)) / 0.75)
    pcm = np.int16(audio * 32767)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        wav.writeframes(pcm.tobytes())


def main():
    photos = []
    for *_, filename in PRODUCTS:
        photo = Image.open(ROOT / "public" / "products" / filename).convert("RGB")
        photos.append(photo.resize((1200, 1200), Image.Resampling.LANCZOS))

    audio_path = OUT / "rachel_tiktok_music.wav"
    video_path = OUT / "rachel_tiktok_10s.mp4"
    make_audio(audio_path)
    ffmpeg = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", str(audio_path), "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-16:TP=-1.5:LRA=8", "-c:a", "aac", "-b:a", "192k", "-t", str(DURATION), "-movflags", "+faststart", str(video_path)]
    encoder = subprocess.Popen(ffmpeg, stdin=subprocess.PIPE)
    assert encoder.stdin is not None
    try:
        for n in range(FRAMES):
            t = n / FPS
            scene = current_scene(t)
            frame = scene_frame(scene, t, photos)
            if scene > 0 and t - STARTS[scene] < FADE:
                previous = scene_frame(scene - 1, STARTS[scene], photos)
                frame = Image.blend(previous, frame, (t - STARTS[scene]) / FADE)
            if n == 23:
                frame.save(OUT / "rachel_tiktok_cover.png")
            encoder.stdin.write(frame.tobytes())
    finally:
        encoder.stdin.close()
    if encoder.wait() != 0:
        raise RuntimeError("FFmpeg failed to render the video")
    print(video_path)


if __name__ == "__main__":
    main()
