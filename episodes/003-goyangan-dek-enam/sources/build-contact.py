from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[3]
batch = root / 'public/assets/003-goyangan-dek-enam/master-batch-01'
episode = root / 'episodes/003-goyangan-dek-enam'
try:
    font = ImageFont.truetype('arial.ttf', 24)
except OSError:
    font = ImageFont.load_default()

def make_sheet(ids, columns, width, target):
    height = width * 16 // 9
    header = 36
    rows = (len(ids) + columns - 1) // columns
    sheet = Image.new('RGB', (columns * width, rows * (height + header)), '#e7e7e7')
    draw = ImageDraw.Draw(sheet)
    for index, panel in enumerate(ids):
        x, y = (index % columns) * width, (index // columns) * (height + header)
        path = batch / f'p{panel:02}.webp'
        draw.text((x + 6, y + 3), f'P{panel:02}' + ('' if path.exists() else ' MISSING'), font=font, fill='#101010')
        if path.exists():
            with Image.open(path) as image:
                sheet.paste(image.convert('RGB').resize((width, height), Image.Resampling.LANCZOS), (x, y + header))
    sheet.save(target, quality=92, subsampling=0)

make_sheet(list(range(1, 25)), 4, 240, episode / 'panels-contact.jpg')
for start in range(1, 25, 6):
    make_sheet(list(range(start, start + 6)), 3, 360, episode / f'panels-contact-{start:02}-{start+5:02}.jpg')
