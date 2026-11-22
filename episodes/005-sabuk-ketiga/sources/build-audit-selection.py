from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
assets = root / 'public/assets/005-sabuk-ketiga'
dest = assets / 'selected-audit-revision'
dest.mkdir(parents=True, exist_ok=True)
first = {5, 8, 9, 18, 20}
second = {7, 11, 21}
sheet = Image.new('RGB', (1440, 1840), '#151a22')
draw = ImageDraw.Draw(sheet)
for n in range(1, 25):
    name = f'p{n:02}.webp'
    source = assets / ('audit-corrections' if n in first else 'audit-corrections-2' if n in second else 'selected-draft') / name
    copyfile(source, dest / name)
    with Image.open(source) as im:
        im = ImageOps.contain(im.convert('RGB'), (220, 410))
        x, y = ((n - 1) % 6) * 240 + 10, ((n - 1) // 6) * 460 + 30
        sheet.paste(im, (x + (220 - im.width) // 2, y))
    draw.text((x, y - 21), f'P{n:02}', fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/panels-contact-audit-revision.jpg', quality=92)
