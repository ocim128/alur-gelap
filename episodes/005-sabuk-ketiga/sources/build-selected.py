from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[3]
assets = root / 'public/assets/005-sabuk-ketiga'
dest = assets / 'selected-draft'
dest.mkdir(parents=True, exist_ok=True)
retries = {1, 2, 5, 6, 10, 12, 15, 16, 23}
final_retries = {17: 'exec-16c95117-77a9-4ceb-bed7-e76c8ab3b01b.png', 19: 'exec-d61ec1c1-94d4-4abe-b246-b287c393c280.png'}
generated = Path('C:/Users/user/.codex/generated_images/01a20449-a999-79f1-bab3-6539e8dad694')
sheet = Image.new('RGB', (1440, 1840), '#151a22')
draw = ImageDraw.Draw(sheet)
for number in range(1, 25):
    name = f'p{number:02}'
    if number in final_retries:
        source = generated / final_retries[number]
    elif number in retries:
        source = assets / 'retries' / (name + '-retry1.webp')
    else:
        source = assets / 'panels' / (name + '.webp')
    im = Image.open(source).convert('RGB')
    im.save(dest / (name + '.webp'), 'WEBP', quality=95)
    thumb = ImageOps.contain(im, (220, 410))
    x, y = ((number - 1) % 6) * 240 + 10, ((number - 1) // 6) * 460 + 30
    sheet.paste(thumb, (x + (220 - thumb.width) // 2, y))
    draw.text((x, y - 21), name.upper(), fill='white')
sheet.save(root / 'episodes/005-sabuk-ketiga/panels-contact-selected.jpg', quality=92)
