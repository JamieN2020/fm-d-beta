"""Generate favicon.ico and apple-touch-icon.png from assets/logo.png."""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow not installed. Run: pip install Pillow")
    raise SystemExit(1)

ROOT = Path(__file__).resolve().parent
LOGO = ROOT / "assets" / "logo.png"

if not LOGO.exists():
    print(f"Logo not found at {LOGO}. Add logo.png first, then re-run this script.")
    raise SystemExit(1)

img = Image.open(LOGO).convert("RGBA")

# favicon.ico — multi-size
sizes = [(16, 16), (32, 32), (48, 48)]
icons = [img.resize(s, Image.Resampling.LANCZOS) for s in sizes]
icons[0].save(ROOT / "assets" / "favicon.ico", format="ICO", sizes=[(s.width, s.height) for s in icons])

# apple-touch-icon
img.resize((180, 180), Image.Resampling.LANCZOS).save(
    ROOT / "assets" / "apple-touch-icon.png", format="PNG"
)

print("Generated assets/favicon.ico and assets/apple-touch-icon.png")
