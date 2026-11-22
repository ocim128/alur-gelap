import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
assets = root / 'public/assets/005-sabuk-ketiga'
out = assets / 'selected-orchestrated'
out.mkdir(parents=True, exist_ok=True)
items = json.loads((Path(__file__).parent / 'orchestrated-final-map.json').read_text())
sources = {i['id']: Path(i['source']) for i in items}
first = {7, 16}
second = {5, 18, 20, 21, 23}
sheet = Image.new('RGB', (1440, 1840), '#151a22')
draw = ImageDraw.Draw(sheet)
for n in range(1, 25):
    name = f'p{n:02}.webp'
    source = sources['11'] if n == 11 else assets / 'orchestrated-candidates' / name if n in first else assets / 'orchestrated-candidates-2' / name if n in second else assets / 'selected-reaudit' / name
    with Image.open(source) as image:
        # Pad by at most one pixel on an edge before resizing; do not crop plot clues.
        image = ImageOps.pad(image.convert('RGB'), (1080, 1920), color='#07080b', method=Image.Resampling.LANCZOS)
        image.save(out / name, 'WEBP', quality=95)
        thumb = ImageOps.contain(image, (220, 410))
    x, y = (n - 1) % 6 * 240 + 10, (n - 1) // 6 * 460 + 30
    sheet.paste(thumb, (x + (220 - thumb.width) // 2, y))
    draw.text((x, y - 21), f'P{n:02}', fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/panels-contact-orchestrated.jpg', quality=92)
for item in items:
    with Image.open(item['source']) as im:
        im = ImageOps.pad(im.convert('RGB'), (1080, 1920), color='#07080b', method=Image.Resampling.LANCZOS)
        if item['id'] == 'jolt':
            im.save(out / 'panel-final-jolt.webp', 'WEBP', quality=95)
        else:
            im.save(assets / 'orchestrated-candidates' / (item['id'] + '-refinement.webp'), 'WEBP', quality=95)
