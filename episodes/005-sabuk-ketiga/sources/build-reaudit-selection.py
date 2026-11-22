import json
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
assets = root / 'public/assets/005-sabuk-ketiga'
candidates = assets / 'reaudit-candidates'
selected = assets / 'selected-reaudit'
candidates.mkdir(parents=True, exist_ok=True)
selected.mkdir(parents=True, exist_ok=True)
items = json.loads((Path(__file__).parent / 'reaudit-candidates-map.json').read_text())
for item in items:
    Image.open(item['source']).convert('RGB').save(candidates / f"p{item['id']}-candidate{item['run']}.webp", 'WEBP', quality=95)
sheet = Image.new('RGB', (1440, 1840), '#151a22')
draw = ImageDraw.Draw(sheet)
for number in range(1, 25):
    name = f'p{number:02}.webp'
    source = candidates / f'p{number:02}-candidate2.webp' if number in (22, 24) else assets / 'selected-audit-revision' / name
    copyfile(source, selected / name)
    with Image.open(source) as im:
        thumb = ImageOps.contain(im.convert('RGB'), (220, 410))
    x, y = (number - 1) % 6 * 240 + 10, (number - 1) // 6 * 460 + 30
    sheet.paste(thumb, (x + (220 - thumb.width) // 2, y))
    draw.text((x, y - 21), f'P{number:02}', fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/panels-contact-reaudit.jpg', quality=92)
