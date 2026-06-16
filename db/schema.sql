-- ============================================================
--  Крепкая Охота — схема базы данных (PostgreSQL + PostGIS)
--  Этап 2. Соответствует docs/ER-MODEL.md.
--  Запуск: psql -d krepkaya_oxota -f db/schema.sql
-- ============================================================

-- Расширение для геоданных (полигоны угодий, точки баз)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── Справочник режимов: охота / рыбалка (F2) ───────────────
CREATE TABLE category (
    id     SERIAL PRIMARY KEY,
    code   VARCHAR(16) UNIQUE NOT NULL,   -- 'hunting' | 'fishing'
    title  VARCHAR(32) NOT NULL           -- 'Охота' | 'Рыбалка'
);

-- ── Справочник сезонов (F4) ────────────────────────────────
CREATE TABLE season (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(16) UNIQUE NOT NULL, -- spring/summer/autumn/winter
    title       VARCHAR(16) NOT NULL,
    month_from  SMALLINT NOT NULL CHECK (month_from BETWEEN 1 AND 12),
    month_to    SMALLINT NOT NULL CHECK (month_to   BETWEEN 1 AND 12)
);

-- ── Регионы / угодья (F1) ──────────────────────────────────
CREATE TABLE region (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(128) NOT NULL,
    ground_type  VARCHAR(32),                       -- общедоступное / закреплённое
    boundary     GEOMETRY(Polygon, 4326),           -- границы угодья
    description  TEXT
);

-- ── Виды (дичь/рыба) (F6) ──────────────────────────────────
CREATE TABLE species (
    id           SERIAL PRIMARY KEY,
    category_id  INTEGER NOT NULL REFERENCES category(id),
    name         VARCHAR(128) NOT NULL,
    latin_name   VARCHAR(128),
    photo_url    VARCHAR(256),
    description  TEXT
);

-- ── Доступность: ядро модели «что × где × когда» (F3) ──────
CREATE TABLE availability (
    id          SERIAL PRIMARY KEY,
    region_id   INTEGER NOT NULL REFERENCES region(id)  ON DELETE CASCADE,
    species_id  INTEGER NOT NULL REFERENCES species(id) ON DELETE CASCADE,
    season_id   INTEGER NOT NULL REFERENCES season(id),
    is_allowed  BOOLEAN NOT NULL DEFAULT FALSE,
    date_from   DATE,
    date_to     DATE,
    restriction VARCHAR(256),
    CONSTRAINT uq_avail UNIQUE (region_id, species_id, season_id),
    CONSTRAINT ck_dates CHECK (date_from IS NULL OR date_to IS NULL OR date_from <= date_to)
);

-- ── Охотхозяйства и контакты (F8) ──────────────────────────
CREATE TABLE hunting_ground (
    id         SERIAL PRIMARY KEY,
    region_id  INTEGER NOT NULL REFERENCES region(id) ON DELETE CASCADE,
    name       VARCHAR(128) NOT NULL,
    owner      VARCHAR(128)
);

CREATE TABLE contact (
    id                 SERIAL PRIMARY KEY,
    hunting_ground_id  INTEGER NOT NULL REFERENCES hunting_ground(id) ON DELETE CASCADE,
    phone              VARCHAR(32),
    email              VARCHAR(128),
    note               VARCHAR(256)
);

-- ── Базы отдыха (F8) ───────────────────────────────────────
CREATE TABLE base (
    id         SERIAL PRIMARY KEY,
    region_id  INTEGER NOT NULL REFERENCES region(id) ON DELETE CASCADE,
    name       VARCHAR(128) NOT NULL,
    location   GEOMETRY(Point, 4326),
    phone      VARCHAR(32)
);

-- ── Пользователи и избранное ───────────────────────────────
CREATE TABLE app_user (
    id             SERIAL PRIMARY KEY,
    email          VARCHAR(128) UNIQUE NOT NULL,
    password_hash  VARCHAR(256) NOT NULL,
    display_name   VARCHAR(64),
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE favorite (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    region_id   INTEGER NOT NULL REFERENCES region(id)   ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_favorite UNIQUE (user_id, region_id)
);

-- ── Индексы под частые запросы ─────────────────────────────
CREATE INDEX idx_species_category   ON species(category_id);
CREATE INDEX idx_avail_region       ON availability(region_id);
CREATE INDEX idx_avail_species      ON availability(species_id);
CREATE INDEX idx_avail_season       ON availability(season_id);
CREATE INDEX idx_region_boundary    ON region USING GIST (boundary);
CREATE INDEX idx_base_location      ON base   USING GIST (location);
