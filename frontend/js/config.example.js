/*
 * config.example.js — шаблон конфигурации ключей.
 *
 * 1. Скопируйте этот файл рядом и назовите config.js
 * 2. Впишите свои ключи (config.js уже в .gitignore — в репозиторий не попадёт).
 *
 * Где взять ключи:
 *  • YANDEX_MAPS_KEY  — developer.tech.yandex.ru/services → сервис
 *    «JavaScript API и HTTP Геокодер» → создать ключ (бесплатно, по Яндекс-аккаунту,
 *    без карты). Карта работает и без ключа в режиме разработки.
 *  • SUPABASE_URL и SUPABASE_ANON_KEY — supabase.com → ваш проект →
 *    Project Settings → API → «Project URL» и «anon public» ключ.
 */
window.APP_CONFIG = {
  YANDEX_MAPS_KEY: '',
  SUPABASE_URL: 'https://ВАШ_ПРОЕКТ.supabase.co',
  SUPABASE_ANON_KEY: 'ВСТАВЬТЕ_ANON_KEY',
};
