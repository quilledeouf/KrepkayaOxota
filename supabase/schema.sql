-- ============================================================
--  Крепкая Охота — схема для Supabase (PostgreSQL)
--  Запуск: Supabase → SQL Editor → New query → вставить → Run.
--  Аутентификация — встроенная (auth.users). Здесь — прикладные таблицы.
-- ============================================================

-- ── Профиль пользователя (1:1 с auth.users) ────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  username    text unique,
  avatar_url  text,
  level       int default 1,
  level_title text default 'Новичок',
  trips       int default 0,
  species_count int default 0,
  km          int default 0,
  created_at  timestamptz default now()
);

-- ── Места (рыбалка/охота) ──────────────────────────────────
create table if not exists public.places (
  id          bigserial primary key,
  name        text not null,
  district    text,
  type        text check (type in ('fishing','hunting','both')),
  lat         double precision,
  lng         double precision,
  distance_km numeric,
  rating      numeric default 0,
  reviews     int default 0,
  access      text,            -- free | paid
  legality    text,            -- open | restricted | license  (для легенды карты)
  photo_url   text,
  description text,
  infrastructure text[],       -- parking, pier, toilet, camping
  species_ids int[]
);

-- ── Виды (рыбы/животные/птицы) ─────────────────────────────
create table if not exists public.species (
  id        int primary key,
  cat       text check (cat in ('fish','animal','bird')),
  name      text not null,
  latin     text,
  size      text,
  tax_rub   int,
  photo_url text,
  description text,
  -- статус по сезонам: {"spring":"open","summer":"open","autumn":"open","winter":"closed"}
  seasons   jsonb,
  note      text
);

-- ── Избранные места пользователя ───────────────────────────
create table if not exists public.favorites (
  id        bigserial primary key,
  user_id   uuid references auth.users(id) on delete cascade,
  place_id  bigint references public.places(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, place_id)
);

-- ── Дневник выездов ────────────────────────────────────────
create table if not exists public.trips (
  id        bigserial primary key,
  user_id   uuid references auth.users(id) on delete cascade,
  place_name text,
  species   text,
  weight    text,
  trip_date date,
  photo_url text
);

-- ── Гиды ───────────────────────────────────────────────────
create table if not exists public.guides (
  id     bigserial primary key,
  name   text not null,
  rating numeric default 0,
  info   text,
  photo_url text,
  contact text
);

-- ============================================================
--  Row Level Security (RLS)
-- ============================================================
alter table public.profiles  enable row level security;
alter table public.favorites enable row level security;
alter table public.trips     enable row level security;

-- Справочные таблицы (places, species, guides) — публичное чтение.
alter table public.places  enable row level security;
alter table public.species enable row level security;
alter table public.guides  enable row level security;

create policy "public read places"  on public.places  for select using (true);
create policy "public read species" on public.species for select using (true);
create policy "public read guides"  on public.guides  for select using (true);

-- Профиль: владелец видит и правит свой.
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile upsert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Избранное и дневник: только свои записи.
create policy "own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own trips"     on public.trips     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Автосоздание профиля при регистрации ───────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
