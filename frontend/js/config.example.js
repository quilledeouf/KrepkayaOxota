/*
 * config.example.js — шаблон конфигурации ключей.
 *
 * 1. Скопируйте этот файл рядом и назовите config.js
 * 2. Впишите свои ключи (config.js уже в .gitignore — в репозиторий не попадёт).
 *
 * Где взять ключи:
 *  • GOOGLE_MAPS_KEY  — Google Cloud Console → APIs & Services → включить
 *    «Maps JavaScript API» → Credentials → Create API key. Желательно ограничить
 *    ключ по HTTP-referrer (домену).
 *  • SUPABASE_URL и SUPABASE_ANON_KEY — supabase.com → ваш проект →
 *    Project Settings → API → «Project URL» и «anon public» ключ.
 */
window.APP_CONFIG = {
  GOOGLE_MAPS_KEY: 'ВСТАВЬТЕ_КЛЮЧ_GOOGLE_MAPS',
  SUPABASE_URL: 'https://ВАШ_ПРОЕКТ.supabase.co',
  SUPABASE_ANON_KEY: 'ВСТАВЬТЕ_ANON_KEY',
};
