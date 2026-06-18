INSERT INTO category (id, code, title) VALUES
  (1, 'hunting', 'Охота'),
  (2, 'fishing', 'Рыбалка');
INSERT INTO season (id, code, title, month_from, month_to) VALUES
  (1, 'spring', 'Весна', 3, 5),
  (2, 'summer', 'Лето',  6, 8),
  (3, 'autumn', 'Осень', 9, 11),
  (4, 'winter', 'Зима', 12, 2);
INSERT INTO region (id, name, ground_type, description) VALUES
  (1, 'Ростов-на-Дону', 'общедоступное', 'Город и пойма Дона: водоплавающая дичь, степная дичь рядом, рыбалка на Дону.');
INSERT INTO species (id, category_id, name, latin_name, description) VALUES
  (10, 1, 'Кабан',        'Sus scrofa',          'Крупный охотничий зверь, активен в пойменных лесах.'),
  (11, 1, 'Заяц-русак',   'Lepus europaeus',     'Распространён в степной зоне.'),
  (12, 1, 'Косуля',       'Capreolus capreolus', 'Лесостепной вид, охота по лицензии.'),
  (13, 1, 'Утка кряква',  'Anas platyrhynchos',  'Водоплавающая дичь.'),
  (14, 1, 'Фазан',        'Phasianus colchicus', 'Полевая дичь.'),
  (20, 2, 'Судак',        'Sander lucioperca',   'Хищная рыба семейства окунёвых.'),
  (21, 2, 'Лещ',          'Abramis brama',       'Стайная рыба, обычна в водохранилищах.'),
  (22, 2, 'Сазан',        'Cyprinus carpio',     'Крупная карповая рыба.'),
  (23, 2, 'Щука',         'Esox lucius',         'Хищник, нерест ранней весной.'),
  (24, 2, 'Тарань',       'Rutilus heckelii',    'Полупроходная плотва Азово-Донского бассейна.');
INSERT INTO availability (region_id, species_id, season_id, is_allowed, date_from, date_to, restriction) VALUES
  (1, 13, 1, FALSE, NULL, NULL, 'весенний запрет'),
  (1, 10, 2, TRUE,  '2026-06-01', '2026-08-31', 'по путёвке, ограниченно'),
  (1, 13, 3, TRUE,  '2026-09-01', '2026-11-30', 'нормы добычи'),
  (1, 14, 3, TRUE,  '2026-10-01', '2026-12-31', NULL),
  (1, 10, 3, TRUE,  '2026-10-01', '2026-12-31', 'по путёвке'),
  (1, 12, 3, TRUE,  '2026-10-01', '2026-12-31', 'по лицензии'),
  (1, 11, 4, TRUE,  '2026-11-01', '2027-01-15', NULL),
  (1, 10, 4, TRUE,  '2026-11-01', '2026-12-31', 'по путёвке'),
  (1, 24, 1, TRUE,  '2026-03-01', '2026-03-31', 'до начала нереста'),
  (1, 20, 1, FALSE, NULL, NULL, 'нерестовый запрет'),
  (1, 23, 1, FALSE, NULL, NULL, 'нерестовый запрет'),
  (1, 22, 2, TRUE,  '2026-06-16', '2026-08-31', 'суточная норма'),
  (1, 21, 2, TRUE,  '2026-06-16', '2026-08-31', NULL),
  (1, 20, 2, TRUE,  '2026-06-16', '2026-08-31', 'суточная норма'),
  (1, 20, 3, TRUE,  '2026-09-01', '2026-11-30', 'суточная норма'),
  (1, 21, 3, TRUE,  '2026-09-01', '2026-11-30', NULL),
  (1, 23, 3, TRUE,  '2026-09-01', '2026-11-30', NULL),
  (1, 21, 4, TRUE,  '2026-12-01', '2027-02-28', 'зимняя ловля'),
  (1, 20, 4, TRUE,  '2026-12-01', '2027-02-28', 'суточная норма');
INSERT INTO hunting_ground (id, region_id, name, owner) VALUES
  (1, 1, 'Ростовское охотхозяйство', 'РОООиР');
INSERT INTO contact (hunting_ground_id, phone, email, note) VALUES
  (1, '+7 (863) 000-00-00', 'rostov@example.ru', 'Оформление путёвок пн-пт');
SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));
SELECT setval('season_id_seq',   (SELECT MAX(id) FROM season));
SELECT setval('region_id_seq',   (SELECT MAX(id) FROM region));
SELECT setval('species_id_seq',  (SELECT MAX(id) FROM species));
SELECT setval('hunting_ground_id_seq', (SELECT MAX(id) FROM hunting_ground));
