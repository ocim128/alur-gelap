from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
assets = root / 'public/assets/005-sabuk-ketiga'
previous = assets / 'selected-orchestrated'
selected = assets / 'selected-owner-approved'
selected.mkdir(parents=True, exist_ok=True)
sheet = Image.new('RGB', (1440, 1840), '#151a22')
draw = ImageDraw.Draw(sheet)
for n in range(1, 25):
    name = f'p{n:02}.webp'
    if n in (11, 18, 20):
        with Image.open(assets / 'final-attempt' / f'{n:02}.webp') as im:
            im = ImageOps.pad(im.convert('RGB'), (1080, 1920), color='#07080b', method=Image.Resampling.LANCZOS)
            im.save(selected / name, 'WEBP', quality=95)
    else:
        copyfile(previous / name, selected / name)
    with Image.open(selected / name) as im:
        thumb = ImageOps.contain(im.convert('RGB'), (220, 410))
    x, y = (n - 1) % 6 * 240 + 10, (n - 1) // 6 * 460 + 30
    sheet.paste(thumb, (x + (220 - thumb.width) // 2, y))
    draw.text((x, y - 21), f'P{n:02}', fill='white')
copyfile(previous / 'panel-final-jolt.webp', selected / 'panel-final-jolt.webp')
sheet.save(root / 'episodes/005-sabuk-ketiga/panels-contact-owner-approved.jpg', quality=92)
