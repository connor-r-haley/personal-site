"""
Tint a logo PNG to a flat target color while preserving its alpha
(anti-aliased edges, transparency, etc.).

Reads:
  frontend/public/logo.png    (filled brand mark, off-white on transparent)
Writes:
  frontend/public/logo_gold.png   (theme gold #d4af37)
"""
from __future__ import annotations
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend" / "public" / "logo.png"
OUT = ROOT / "frontend" / "public" / "logo_gold.png"

GOLD = (212, 175, 55)


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    arr = np.array(img)
    alpha = arr[..., 3]

    out = np.zeros_like(arr)
    out[..., 0] = GOLD[0]
    out[..., 1] = GOLD[1]
    out[..., 2] = GOLD[2]
    out[..., 3] = alpha
    Image.fromarray(out, "RGBA").save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
