import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
root = Path(__file__).resolve().parents[3]
items = json.loads((Path(__file__).parent / 'orchestrated-candidates-2-map.json').read_text())
dest = root / 'public/assets/005-sabuk-ketiga/orchestrated-candidates-2'
dest.mkdir(parents=True, exist_ok=True)
sheet = Image.new('RGB', (1440, 460), '#151a22')
d = ImageDraw.Draw(sheet)
for i, item in enumerate(items):
    im = Image.open(item['source']).convert('RGB')
    im.save(dest / ('p' + item['id'] + '.webp'), 'WEBP', quality=95)
    im = ImageOps.contain(im, (220, 410))
    x, y = i * 240 + 10, 30
    sheet.paste(im, (x + (220 - im.width) // 2, y))
    d.text((x, y - 21), 'P' + item['id'], fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/orchestrated-candidates-2-contact.jpg', quality=92)
