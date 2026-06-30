"""Create brand-colour favicon assets when logo.png is not yet available."""
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise SystemExit("Install Pillow: pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

BLUE = (86, 136, 199, 255)
WHITE = (255, 255, 255, 255)


def draw_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = max(2, size // 8)
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=size // 4, fill=BLUE)
    # Simple ampersand-like mark
    cx, cy = size // 2, size // 2
    r = size // 6
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=WHITE, width=max(1, size // 16))
    return img


for s in (16, 32, 48):
    draw_icon(s)

icons = [draw_icon(s) for s in (16, 32, 48)]
icons[0].save(ASSETS / "favicon.ico", format="ICO", sizes=[(i.width, i.height) for i in icons])
draw_icon(180).save(ASSETS / "apple-touch-icon.png", format="PNG")
print("Created favicon.ico and apple-touch-icon.png in assets/")
