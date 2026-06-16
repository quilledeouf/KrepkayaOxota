# Backend — этап 2 (скелет)

> На MVP бэкенда **нет**: фронтенд работает на статических данных. Эта папка
> фиксирует план будущего сервиса, чтобы его можно было начать без проектирования
> с нуля. Контракт — [../docs/API.md](../docs/API.md), схема БД —
> [../db/schema.sql](../db/schema.sql).

## Технологии

- **Node.js + Express** — REST API.
- **PostgreSQL + PostGIS** — хранилище (геоданные угодий).
- **JWT** — авторизация для раздела «Избранное».

## Планируемая структура

```
backend/
├── package.json
├── src/
│   ├── index.js            # запуск Express, middleware, CORS
│   ├── config/db.js        # пул подключений к PostgreSQL
│   ├── routes/             # маршруты по ресурсам
│   │   ├── regions.js      # /api/v1/regions
│   │   ├── species.js      # /api/v1/species
│   │   ├── meta.js         # /api/v1/categories, /seasons
│   │   └── favorites.js    # /api/v1/favorites (JWT)
│   ├── services/           # бизнес-логика (сезоны, доступность)
│   ├── repositories/       # SQL-запросы
│   └── middleware/
│       ├── auth.js         # проверка JWT
│       └── errorHandler.js # единый формат ошибок (см. API.md)
└── tests/
```

## Порядок реализации (из бэклога)

1. **DEV-20** — поднять БД, накатить `schema.sql` + `seed.sql`.
2. **DEV-21** — реализовать REST по контракту `openapi.yaml`.
3. **DEV-22** — переключить фронт с моков на API (поменять только `frontend/js/api.js`).
4. **DEV-23** — авторизация и избранное.
5. **DEV-24** — деплой (Render/Railway) + CI.

## Локальный запуск (когда появится код)

```bash
cd backend
npm install
cp .env.example .env     # DATABASE_URL, JWT_SECRET
npm run dev              # http://localhost:3000/api/v1
```
