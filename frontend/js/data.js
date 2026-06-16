/*
 * data.js — демо-данные прототипа «Крепкая Охота».
 *
 * На MVP данные встроены прямо в страницу (через window.APP_DATA), чтобы
 * прототип работал даже при открытии index.html двойным кликом (file://),
 * без локального сервера и без бэкенда.
 *
 * На этапе 2 эти же данные будут приходить из REST API (см. docs/API.md),
 * а здесь останется только заглушка. Структура совпадает с db/seed.sql.
 */
window.APP_DATA = {
  // Режимы (F2)
  categories: [
    { id: 1, code: 'hunting', title: 'Охота' },
    { id: 2, code: 'fishing', title: 'Рыбалка' },
  ],

  // Сезоны (F4)
  seasons: [
    { id: 1, code: 'spring', title: 'Весна', monthFrom: 3, monthTo: 5 },
    { id: 2, code: 'summer', title: 'Лето', monthFrom: 6, monthTo: 8 },
    { id: 3, code: 'autumn', title: 'Осень', monthFrom: 9, monthTo: 11 },
    { id: 4, code: 'winter', title: 'Зима', monthFrom: 12, monthTo: 2 },
  ],

  // Виды: дичь (categoryId 1) и рыба (categoryId 2) (F6)
  species: [
    { id: 10, categoryId: 1, name: 'Кабан', latinName: 'Sus scrofa', emoji: '🐗', description: 'Крупный охотничий зверь, активен в пойменных лесах.' },
    { id: 11, categoryId: 1, name: 'Заяц-русак', latinName: 'Lepus europaeus', emoji: '🐇', description: 'Распространён в степной зоне области.' },
    { id: 12, categoryId: 1, name: 'Косуля', latinName: 'Capreolus capreolus', emoji: '🦌', description: 'Лесостепной вид, охота по лицензии.' },
    { id: 13, categoryId: 1, name: 'Утка кряква', latinName: 'Anas platyrhynchos', emoji: '🦆', description: 'Водоплавающая дичь, массовый объект охоты.' },
    { id: 14, categoryId: 1, name: 'Фазан', latinName: 'Phasianus colchicus', emoji: '🐓', description: 'Полевая дичь.' },
    { id: 20, categoryId: 2, name: 'Судак', latinName: 'Sander lucioperca', emoji: '🐟', description: 'Хищная рыба семейства окунёвых.' },
    { id: 21, categoryId: 2, name: 'Лещ', latinName: 'Abramis brama', emoji: '🐟', description: 'Стайная рыба, обычна в водохранилищах.' },
    { id: 22, categoryId: 2, name: 'Сазан', latinName: 'Cyprinus carpio', emoji: '🐠', description: 'Крупная карповая рыба.' },
    { id: 23, categoryId: 2, name: 'Щука', latinName: 'Esox lucius', emoji: '🐡', description: 'Хищник, нерест ранней весной.' },
    { id: 24, categoryId: 2, name: 'Тарань', latinName: 'Rutilus heckelii', emoji: '🐟', description: 'Полупроходная плотва Азово-Донского бассейна.' },
  ],

  // Доступность: что × где × когда (F3). seasonId: 1 весна,2 лето,3 осень,4 зима
  availability: [
    { regionId: 1, speciesId: 10, seasonId: 3, isAllowed: true, dateFrom: '2026-10-01', dateTo: '2026-12-31', restriction: 'по путёвке' },
    { regionId: 1, speciesId: 13, seasonId: 3, isAllowed: true, dateFrom: '2026-09-01', dateTo: '2026-11-30', restriction: 'нормы добычи' },
    { regionId: 1, speciesId: 20, seasonId: 1, isAllowed: false, dateFrom: null, dateTo: null, restriction: 'нерестовый запрет' },
    { regionId: 1, speciesId: 20, seasonId: 3, isAllowed: true, dateFrom: '2026-09-01', dateTo: '2026-11-30', restriction: 'суточная норма' },
    { regionId: 2, speciesId: 11, seasonId: 4, isAllowed: true, dateFrom: '2026-11-01', dateTo: '2027-01-15', restriction: null },
    { regionId: 2, speciesId: 12, seasonId: 3, isAllowed: true, dateFrom: '2026-10-01', dateTo: '2026-12-31', restriction: 'по лицензии' },
    { regionId: 3, speciesId: 22, seasonId: 2, isAllowed: true, dateFrom: '2026-06-16', dateTo: '2026-08-31', restriction: 'суточная норма' },
    { regionId: 3, speciesId: 21, seasonId: 3, isAllowed: true, dateFrom: '2026-09-01', dateTo: '2026-11-30', restriction: null },
    { regionId: 3, speciesId: 23, seasonId: 1, isAllowed: false, dateFrom: null, dateTo: null, restriction: 'нерестовый запрет' },
    { regionId: 4, speciesId: 10, seasonId: 3, isAllowed: true, dateFrom: '2026-10-01', dateTo: '2026-12-31', restriction: 'по путёвке' },
    { regionId: 4, speciesId: 14, seasonId: 3, isAllowed: true, dateFrom: '2026-10-01', dateTo: '2026-12-31', restriction: null },
    { regionId: 5, speciesId: 11, seasonId: 4, isAllowed: true, dateFrom: '2026-11-01', dateTo: '2027-01-15', restriction: null },
    { regionId: 6, speciesId: 24, seasonId: 1, isAllowed: true, dateFrom: '2026-03-01', dateTo: '2026-04-30', restriction: 'до начала нереста' },
    { regionId: 6, speciesId: 20, seasonId: 3, isAllowed: true, dateFrom: '2026-09-01', dateTo: '2026-11-30', restriction: 'суточная норма' },
  ],

  // Регионы Ростовской обл. в формате GeoJSON (границы упрощены для прототипа, F1)
  regions: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: 1, name: 'Азовский район', groundType: 'общедоступное' },
        geometry: { type: 'Polygon', coordinates: [[[39.05, 46.95], [39.55, 46.95], [39.55, 47.25], [39.05, 47.25], [39.05, 46.95]]] },
      },
      {
        type: 'Feature',
        properties: { id: 2, name: 'Сальский район', groundType: 'закреплённое' },
        geometry: { type: 'Polygon', coordinates: [[[41.2, 46.25], [41.85, 46.25], [41.85, 46.7], [41.2, 46.7], [41.2, 46.25]]] },
      },
      {
        type: 'Feature',
        properties: { id: 3, name: 'Цимлянский район', groundType: 'общедоступное' },
        geometry: { type: 'Polygon', coordinates: [[[42.0, 47.5], [42.7, 47.5], [42.7, 47.9], [42.0, 47.9], [42.0, 47.5]]] },
      },
      {
        type: 'Feature',
        properties: { id: 4, name: 'Шолоховский район', groundType: 'общедоступное' },
        geometry: { type: 'Polygon', coordinates: [[[41.4, 49.4], [42.3, 49.4], [42.3, 49.85], [41.4, 49.85], [41.4, 49.4]]] },
      },
      {
        type: 'Feature',
        properties: { id: 5, name: 'Морозовский район', groundType: 'закреплённое' },
        geometry: { type: 'Polygon', coordinates: [[[41.6, 48.15], [42.4, 48.15], [42.4, 48.55], [41.6, 48.55], [41.6, 48.15]]] },
      },
      {
        type: 'Feature',
        properties: { id: 6, name: 'Неклиновский район', groundType: 'общедоступное' },
        geometry: { type: 'Polygon', coordinates: [[[38.35, 47.05], [38.95, 47.05], [38.95, 47.35], [38.35, 47.35], [38.35, 47.05]]] },
      },
    ],
  },
};
