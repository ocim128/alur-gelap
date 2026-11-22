import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
items = json.loads((Path(__file__).parent / 'audit-corrections-map.json').read_text())
dest = root / 'public/assets/005-sabuk-ketiga/audit-corrections'
dest.mkdir(parents=True, exist_ok=True)
sheet = Image.new('RGB', (1200, 920), '#151a22')
draw = ImageDraw.Draw(sheet)
for index, item in enumerate(items):
    im = Image.open(item['source']).convert('RGB')
    im.save(dest / ('p' + item['id'] + '.webp'), 'WEBP', quality=95)
    im = ImageOps.contain(im, (220, 410))
    x, y = index % 5 * 240 + 10, index // 5 * 460 + 30
    sheet.paste(im, (x + (220 - im.width) // 2, y))
    draw.text((x, y - 21), 'P' + item['id'], fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/audit-corrections-contact.jpg', quality=92)
