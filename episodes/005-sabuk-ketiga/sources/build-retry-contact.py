import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
items = json.loads((Path(__file__).parent / 'retry-map.json').read_text())
dest = root / 'public/assets/005-sabuk-ketiga/retries'
dest.mkdir(parents=True, exist_ok=True)
sheet = Image.new('RGB', (6 * 240, 2 * 460), '#151a22')
draw = ImageDraw.Draw(sheet)
for index, item in enumerate(items):
    image = Image.open(item['source']).convert('RGB')
    image.save(dest / (item['id'].lower() + '-retry1.webp'), 'WEBP', quality=95)
    thumb = ImageOps.contain(image, (220, 410))
    x, y = (index % 6) * 240 + 10, (index // 6) * 460 + 30
    sheet.paste(thumb, (x + (220 - thumb.width) // 2, y))
    draw.text((x, y - 21), item['id'] + ' retry', fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/retries-contact.jpg', quality=92)
