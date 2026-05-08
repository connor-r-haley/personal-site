"""
Recolor the Connor Haley logo into a single teal mark on a transparent
background. Foreground (ink) -> teal; everything else -> transparent.

Output:
  frontend/public/logo_color.png
"""
from __future__ import annotations
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "logo_source.png"
OUT = ROOT / "frontend" / "public" / "logo_color.png"

TEAL = (45, 212, 191)


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    arr = np.array(img)
    rgb = arr[..., :3].astype(np.int16)
    src_alpha = arr[..., 3].astype(np.int16)

    # Anti-aliased ink coverage: pixels are darker on white background, so
    # coverage = 1 - normalized_luminance, scaled by source alpha.
    lum = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2])
    coverage = np.clip(255 - lum, 0, 255)
    coverage = (coverage * (src_alpha / 255.0)).astype(np.uint8)

    out = np.zeros_like(arr)
    out[..., 0] = TEAL[0]
    out[..., 1] = TEAL[1]
    out[..., 2] = TEAL[2]
    out[..., 3] = coverage
    Image.fromarray(out, "RGBA").save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
