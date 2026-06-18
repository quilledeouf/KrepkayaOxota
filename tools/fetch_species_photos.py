# -*- coding: utf-8 -*-
"""
Скачивает реальные фото видов из Wikipedia (pageimages) и сохраняет в AVIF.
Запуск: python tools/fetch_species_photos.py
Результат: frontend/assets/img/species/<id>.avif
"""
import io, json, os, subprocess, time, urllib.parse
from PIL import Image

OUT = os.path.join('frontend', 'assets', 'img', 'species')
os.makedirs(OUT, exist_ok=True)
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36')

# id -> заголовок статьи в ru.wikipedia (с учётом redirects)
SPECIES = {
    11: 'Судак (рыба)', 12: 'Лещ', 13: 'Сазан', 14: 'Обыкновенная щука',
    15: 'Обыкновенный сом', 16: 'Тарань', 17: 'Чехонь', 18: 'Серебряный карась',
    19: 'Речной окунь', 20: 'Белый толстолобик', 21: 'Пиленгас',
    31: 'Кабан', 32: 'Европейская косуля', 33: 'Заяц-русак',
    34: 'Обыкновенная лисица', 35: 'Енотовидная собака',
    41: 'Кряква', 42: 'Серый гусь', 43: 'Обыкновенный фазан',
    44: 'Серая куропатка', 45: 'Обыкновенный перепел', 46: 'Лысуха',
}

def get(url):
    last = ''
    for attempt in range(5):
        r = subprocess.run(['curl', '-sSL', '--fail', '-A', UA, url], capture_output=True, timeout=60)
        if r.returncode == 0:
            return r.stdout
        last = 'curl ' + str(r.returncode) + ' ' + r.stderr.decode('utf-8', 'ignore')[:60]
        time.sleep(2.5 * (attempt + 1))  # бэкофф при 429/сетевых ошибках
    raise RuntimeError(last)

def image_url(title):
    api = ('https://ru.wikipedia.org/w/api.php?action=query&format=json&redirects=1'
           '&prop=pageimages&piprop=thumbnail&pithumbsize=720&titles='
           + urllib.parse.quote(title))
    data = json.loads(get(api).decode('utf-8'))
    pages = data['query']['pages']
    for _, p in pages.items():
        th = p.get('thumbnail')
        if th and th.get('source'):
            return th['source']
    return None

ok, fail = [], []
for sid, title in SPECIES.items():
    out = os.path.join(OUT, f'{sid}.avif')
    if os.path.exists(out) and os.path.getsize(out) > 0:
        ok.append((sid, title, os.path.getsize(out)))
        continue
    try:
        time.sleep(1.5)  # бережём rate-limit Wikimedia
        src = image_url(title)
        if not src:
            fail.append((sid, title, 'no image'))
            continue
        raw = get(src)
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        # обрезаем по центру в 4:3 и уменьшаем до 640px
        w, h = im.size
        tw, th = 4, 3
        if w / h > tw / th:
            nw = int(h * tw / th); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = int(w * th / tw); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        im.thumbnail((640, 480), Image.LANCZOS)
        out = os.path.join(OUT, f'{sid}.avif')
        im.save(out, format='AVIF', quality=58)
        ok.append((sid, title, os.path.getsize(out)))
    except Exception as e:
        fail.append((sid, title, str(e)[:60]))

lines = [f'OK: {len(ok)} FAIL: {len(fail)}']
for sid, t, sz in ok:
    lines.append(f'  OK  {sid} {t} ({sz} b)')
for sid, t, e in fail:
    lines.append(f'  FAIL {sid} {t} -- {e}')
with open('tools/_photos_log.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('OK:', len(ok), 'FAIL:', len(fail), '(see tools/_photos_log.txt)')
