# API-контракт — Крепкая Охота

> Задача разработчика №4. Контракт REST API. **На MVP API ещё нет** — фронтенд
> работает на статических данных, но контракт зафиксирован заранее, чтобы
> backend и frontend разрабатывались параллельно и состыковались без сюрпризов.
> Машиночитаемая версия — [openapi.yaml](openapi.yaml).

---

## Общие правила

| Параметр | Значение |
|----------|----------|
| Базовый URL | `/api/v1` |
| Формат | `application/json; charset=utf-8` |
| Кодировка | UTF-8 |
| Авторизация | JWT в заголовке `Authorization: Bearer <token>` (только для `/favorites`) |
| Версионирование | в URL (`/v1`) |
| Пагинация | `?page=1&limit=20` (где применимо) |

### Формат ответа об ошибке (единый)

```json
{
  "error": {
    "code": "REGION_NOT_FOUND",
    "message": "Регион с id=999 не найден",
    "details": null
  }
}
```

### Коды состояния HTTP

| Код | Когда |
|-----|-------|
| `200 OK` | Успешный GET |
| `201 Created` | Успешно создан ресурс (избранное) |
| `204 No Content` | Успешное удаление |
| `400 Bad Request` | Невалидные параметры (напр. неизвестный `season`) |
| `401 Unauthorized` | Нет/просрочен токен |
| `404 Not Found` | Ресурс не найден |
| `409 Conflict` | Дубликат (регион уже в избранном) |
| `422 Unprocessable Entity` | Тело запроса не прошло валидацию |
| `500 Internal Server Error` | Ошибка сервера |

### Прикладные коды ошибок (`error.code`)

| code | HTTP | Значение |
|------|------|----------|
| `VALIDATION_ERROR` | 400/422 | Неверные параметры запроса |
| `REGION_NOT_FOUND` | 404 | Регион не найден |
| `SPECIES_NOT_FOUND` | 404 | Вид не найден |
| `UNAUTHORIZED` | 401 | Требуется вход |
| `FAVORITE_EXISTS` | 409 | Регион уже в избранном |
| `INTERNAL_ERROR` | 500 | Внутренняя ошибка |

---

## Эндпоинты

### 1. Справочники

#### `GET /api/v1/categories`
Список режимов (охота/рыбалка). Для F2.

**Ответ `200`:**
```json
[
  { "id": 1, "code": "hunting", "title": "Охота" },
  { "id": 2, "code": "fishing", "title": "Рыбалка" }
]
```

#### `GET /api/v1/seasons`
Список сезонов. Для F4.

**Ответ `200`:**
```json
[
  { "id": 1, "code": "spring", "title": "Весна", "monthFrom": 3, "monthTo": 5 },
  { "id": 2, "code": "summer", "title": "Лето",  "monthFrom": 6, "monthTo": 8 },
  { "id": 3, "code": "autumn", "title": "Осень", "monthFrom": 9, "monthTo": 11 },
  { "id": 4, "code": "winter", "title": "Зима",  "monthFrom": 12, "monthTo": 2 }
]
```

---

### 2. Регионы (F1, F7)

#### `GET /api/v1/regions`
Список регионов. Геометрия — для отрисовки на карте.

**Query-параметры (опц.):**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `q` | string | Поиск по названию (F7) |
| `mode` | `hunting`\|`fishing` | Фильтр по режиму |

**Ответ `200`:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "id": 1, "name": "Азовский район", "groundType": "общедоступное" },
      "geometry": { "type": "Polygon", "coordinates": [[[39.1,47.1],[39.4,47.1],[39.4,47.3],[39.1,47.3],[39.1,47.1]]] }
    }
  ]
}
```

#### `GET /api/v1/regions/{id}`
Детали одного региона.

**Ответ `200`:**
```json
{
  "id": 1,
  "name": "Азовский район",
  "groundType": "общедоступное",
  "description": "Угодья в дельте Дона…"
}
```
**Ошибка `404`:** `{ "error": { "code": "REGION_NOT_FOUND", "message": "..." } }`

---

### 3. Доступность видов в регионе (F3 — основной сценарий)

#### `GET /api/v1/regions/{id}/species`
Что можно добывать в регионе с учётом режима и сезона.

**Query-параметры:**

| Параметр | Тип | Обяз. | Описание |
|----------|-----|:---:|----------|
| `mode` | `hunting`\|`fishing` | да | Режим (F2) |
| `season` | `spring`\|`summer`\|`autumn`\|`winter` | нет | Сезон (F4); по умолчанию — текущий |
| `onlyAllowed` | boolean | нет | Только разрешённое сейчас (F5) |

**Запрос:** `GET /api/v1/regions/1/species?mode=hunting&season=autumn`

**Ответ `200`:**
```json
{
  "region": { "id": 1, "name": "Азовский район" },
  "season": "autumn",
  "mode": "hunting",
  "species": [
    {
      "id": 10, "name": "Кабан", "photoUrl": "/img/boar.jpg",
      "isAllowed": true, "dateFrom": "2026-10-01", "dateTo": "2026-12-31",
      "restriction": "по путёвке"
    },
    {
      "id": 11, "name": "Заяц-русак", "photoUrl": "/img/hare.jpg",
      "isAllowed": false, "dateFrom": null, "dateTo": null,
      "restriction": "вне сезона"
    }
  ]
}
```
**Ошибки:** `400 VALIDATION_ERROR` (неизвестный `mode`/`season`), `404 REGION_NOT_FOUND`.

---

### 4. Виды (F5, F6)

#### `GET /api/v1/species`
Каталог видов с фильтрами.

**Query:** `?mode=fishing&q=судак`

**Ответ `200`:**
```json
[
  { "id": 20, "name": "Судак", "category": "fishing", "photoUrl": "/img/zander.jpg" }
]
```

#### `GET /api/v1/species/{id}`
Карточка вида (F6).

**Ответ `200`:**
```json
{
  "id": 20, "name": "Судак", "latinName": "Sander lucioperca",
  "category": "fishing", "photoUrl": "/img/zander.jpg",
  "description": "Хищная рыба семейства окунёвых…",
  "regions": [ { "regionId": 1, "season": "autumn", "isAllowed": true } ]
}
```

#### `GET /api/v1/species/{id}/regions`
В каких регионах встречается вид (для подсветки на карте, F5).

**Ответ `200`:**
```json
{ "speciesId": 20, "regionIds": [1, 3, 7] }
```

---

### 5. Избранное (требует авторизации)

#### `GET /api/v1/favorites`
Избранные регионы пользователя. `401` без токена.

#### `POST /api/v1/favorites`
**Тело:** `{ "regionId": 1 }`
**Ответ `201`:** `{ "id": 5, "regionId": 1 }`
**Ошибка `409`:** `FAVORITE_EXISTS`

#### `DELETE /api/v1/favorites/{regionId}`
**Ответ `204`** (без тела).

---

## Сводная таблица эндпоинтов

| Метод | Путь | Назначение | Функция | Авториз. |
|-------|------|-----------|:---:|:---:|
| GET | `/categories` | режимы | F2 | — |
| GET | `/seasons` | сезоны | F4 | — |
| GET | `/regions` | список/поиск регионов | F1, F7 | — |
| GET | `/regions/{id}` | детали региона | F3 | — |
| GET | `/regions/{id}/species` | доступность видов | F3 | — |
| GET | `/species` | каталог видов | F5 | — |
| GET | `/species/{id}` | карточка вида | F6 | — |
| GET | `/species/{id}/regions` | регионы вида | F5 | — |
| GET | `/favorites` | избранное | F8 | JWT |
| POST | `/favorites` | добавить в избранное | F8 | JWT |
| DELETE | `/favorites/{regionId}` | удалить из избранного | F8 | JWT |
