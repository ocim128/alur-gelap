from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[3]
assets = root / 'public' / 'assets' / '001-kamar-terkunci'
episode = root / 'episodes' / '001-kamar-terkunci'
try:
    font = ImageFont.truetype('arial.ttf', 24)
except OSError:
    font = ImageFont.load_default()

def build(ids, columns, width, output):
    height = width * 16 // 9
    header = 36
    rows = (len(ids) + columns - 1) // columns
    sheet = Image.new('RGB', (columns * width, rows * (height + header)), '#e7e7e7')
    draw = ImageDraw.Draw(sheet)
    for index, number in enumerate(ids):
        x, y = (index % columns) * width, (index // columns) * (height + header)
        path = assets / f'p{number:02}.webp'
        draw.text((x + 6, y + 3), f'P{number:02}' + ('' if path.exists() else ' — MISSING'), font=font, fill='#101010')
        if path.exists():
            with Image.open(path) as plate:
                sheet.paste(plate.convert('RGB').resize((width, height), Image.Resampling.LANCZOS), (x, y + header))
        else:
            draw.rectangle((x, y + header, x + width - 1, y + header + height - 1), fill='#555555')
    sheet.save(output, quality=92, subsampling=0)

build(list(range(1, 25)), 4, 240, episode / 'panels-contact.jpg')
for start in range(1, 25, 6):
    build(list(range(start, start + 6)), 3, 360, episode / f'panels-contact-{start:02}-{start+5:02}.jpg')
