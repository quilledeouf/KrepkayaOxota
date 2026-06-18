/*
 * data.js — данные для всей этой залупкино
⠀⠀⢀⣀⠤⠿⢤⢖⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡔⢩⠂⠀⠒⠗⠈⠀⠉⠢⠄⣀⠠⠤⠄⠒⢖⡒⢒⠂⠤⢄⠀⠀⠀⠀
⠇⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠈⠀⠈⠈⡨⢀⠡⡪⠢⡀⠀
⠈⠒⠀⠤⠤⣄⡆⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⠀⢕⠱⠀
⠀⠀⠀⠀⠀⠈⢳⣐⡐⠐⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠁⠇
⠀⠀⠀⠀⠀⠀⠀⠑⢤⢁⠀⠆⠀⠀⠀⠀⠀⢀⢰⠀⠀⠀⡀⢄⡜⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⡦⠄⡷⠢⠤⠤⠤⠤⢬⢈⡇⢠⣈⣰⠎⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣃⢸⡇⠀⠀⠀⠀⠀⠈⢪⢀⣺⡅⢈⠆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠶⡿⠤⠚⠁⠀⠀⠀⢀⣠⡤⢺⣥⠟⢡⠃⠀
 */
window.APP_DATA = {
  // Районы Ростова
  districts: [
    { id: 1, name: 'Ворошиловский' },
    { id: 2, name: 'Железнодорожный' },
    { id: 3, name: 'Кировский' },
    { id: 4, name: 'Ленинский' },
    { id: 5, name: 'Октябрьский' },
    { id: 6, name: 'Первомайский' },
    { id: 7, name: 'Пролетарский' },
    { id: 8, name: 'Советский' },
  ],

  // Сезоны
  seasons: [
    { id: 1, code: 'spring', title: 'Весна', short: 'Вес', monthFrom: 3, monthTo: 5 },
    { id: 2, code: 'summer', title: 'Лето', short: 'Лет', monthFrom: 6, monthTo: 8 },
    { id: 3, code: 'autumn', title: 'Осень', short: 'Осе', monthFrom: 9, monthTo: 11 },
    { id: 4, code: 'winter', title: 'Зима', short: 'Зим', monthFrom: 12, monthTo: 2 },
  ],

  // Категории
  categories: [
    { id: 'fish', title: 'Рыбы', icon: 'fish' },
    { id: 'animal', title: 'Животные', icon: 'paw' },
    { id: 'bird', title: 'Птицы', icon: 'bird' },
  ],

  species: [
    // ── Рыбы ──
    { id: 11, cat: 'fish', name: 'Судак', latin: 'Sander lucioperca', size: 'до 8 кг', taxRub: 3305,
      desc: 'Хищник семейства окунёвых, основной трофей Дона. Активен на ямах и бровках.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: 'Весной — нерестовый запрет.' },
    { id: 12, cat: 'fish', name: 'Лещ', latin: 'Abramis brama', size: 'до 4 кг', taxRub: 500,
      desc: 'Стайная донная рыба, держится на глубоких плёсах и в заливах.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: null },
    { id: 13, cat: 'fish', name: 'Сазан', latin: 'Cyprinus carpio', size: 'до 15 кг', taxRub: 925,
      desc: 'Дикая форма карпа, сильный и осторожный. Любит коряжник и камыш.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: null },
    { id: 14, cat: 'fish', name: 'Щука', latin: 'Esox lucius', size: 'до 10 кг', taxRub: 925,
      desc: 'Засадный хищник заросших заводей и стариц. Нерест ранней весной.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: 'Весной — нерестовый запрет.' },
    { id: 15, cat: 'fish', name: 'Сом', latin: 'Silurus glanis', size: 'до 100+ кг', taxRub: 925,
      desc: 'Крупнейший хищник Дона, ведёт донный ночной образ жизни.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'closed' }, note: 'Зимой малоактивен.' },
    { id: 16, cat: 'fish', name: 'Тарань', latin: 'Rutilus heckelii', size: 'до 0.6 кг', taxRub: 500,
      desc: 'Полупроходная плотва Азово-Донского бассейна, ход весной.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: 'Запрет 15.03–30.04.' },
    { id: 17, cat: 'fish', name: 'Чехонь', latin: 'Pelecus cultratus', size: 'до 0.7 кг', taxRub: 500,
      desc: 'Стремительная стайная рыба верхних слоёв воды, бойкая поклёвка.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: null },
    { id: 18, cat: 'fish', name: 'Карась', latin: 'Carassius gibelio', size: 'до 2 кг', taxRub: 250,
      desc: 'Неприхотлив, ловится почти везде. Исключён из ряда запретов.',
      seasons: { spring: 'open', summer: 'open', autumn: 'open', winter: 'open' }, note: 'Разрешён круглый год.' },
    { id: 19, cat: 'fish', name: 'Окунь', latin: 'Perca fluviatilis', size: 'до 1.5 кг', taxRub: 250,
      desc: 'Массовый хищник, держится у коряг и свай. Отличная зимняя ловля.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: null },
    { id: 20, cat: 'fish', name: 'Толстолобик', latin: 'Hypophthalmichthys', size: 'до 25 кг', taxRub: 925,
      desc: 'Мирная пелагическая рыба, фильтратор. Активен в тёплой воде.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'closed' }, note: null },
    { id: 21, cat: 'fish', name: 'Пеленгас', latin: 'Planiliza haematocheila', size: 'до 7 кг', taxRub: null,
      desc: 'Дальневосточный вселенец, ловится на отмелях на нереиса (морского червя).',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: 'Такса по региональному перечню.' },
    { id: 31, cat: 'animal', name: 'Кабан', latin: 'Sus scrofa', size: 'до 200 кг', taxRub: null,
      desc: 'Крупный зверь пойменных лесов и тростников. Охота по путёвке и лицензии.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'open' }, note: 'Только по разрешению.' },
    { id: 32, cat: 'animal', name: 'Косуля', latin: 'Capreolus capreolus', size: 'до 35 кг', taxRub: null,
      desc: 'Лесостепной олень. Охота строго по лицензии в установленные сроки.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'closed' }, note: 'По лицензии.' },
    { id: 33, cat: 'animal', name: 'Заяц-русак', latin: 'Lepus europaeus', size: 'до 6 кг', taxRub: null,
      desc: 'Обычен в степи и на полях. Осенне-зимняя охота.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'open' }, note: null },
    { id: 34, cat: 'animal', name: 'Лисица', latin: 'Vulpes vulpes', size: 'до 10 кг', taxRub: null,
      desc: 'Распространённый пушной хищник. Регулируется осенью и зимой.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'open' }, note: null },
    { id: 35, cat: 'animal', name: 'Енотовидная собака', latin: 'Nyctereutes', size: 'до 10 кг', taxRub: null,
      desc: 'Вселенец пойм и плавней, активен в сумерках.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'open' }, note: null },

    //
    { id: 41, cat: 'bird', name: 'Кряква', latin: 'Anas platyrhynchos', size: 'до 1.5 кг', taxRub: null,
      desc: 'Самая массовая утка. Летне-осенняя охота на воде.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'closed' }, note: 'Открытие — 3-я суббота августа.' },
    { id: 42, cat: 'bird', name: 'Серый гусь', latin: 'Anser anser', size: 'до 4.5 кг', taxRub: null,
      desc: 'Крупная водоплавающая дичь, пролёт через дельту Дона.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'closed' }, note: null },
    { id: 43, cat: 'bird', name: 'Фазан', latin: 'Phasianus colchicus', size: 'до 1.8 кг', taxRub: null,
      desc: 'Полевая дичь лесополос и тростников. Осенняя охота.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'open' }, note: null },
    { id: 44, cat: 'bird', name: 'Серая куропатка', latin: 'Perdix perdix', size: 'до 0.5 кг', taxRub: null,
      desc: 'Оседлая степная птица, держится выводками на полях.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'closed' }, note: null },
    { id: 45, cat: 'bird', name: 'Перепел', latin: 'Coturnix coturnix', size: 'до 0.15 кг', taxRub: null,
      desc: 'Мелкая полевая дичь, ходовая летне-осенняя охота с легавой.',
      seasons: { spring: 'closed', summer: 'open', autumn: 'open', winter: 'closed' }, note: null },
    { id: 46, cat: 'bird', name: 'Лысуха', latin: 'Fulica atra', size: 'до 1 кг', taxRub: null,
      desc: 'Водоплавающая птица заросших водоёмов, объект осенней охоты.',
      seasons: { spring: 'closed', summer: 'closed', autumn: 'open', winter: 'closed' }, note: null },
  ],

  places: [
    { id: 1, name: 'Зелёный остров', districtId: 7, type: 'fishing', coords: [47.205, 39.695],
      distanceKm: 5, rating: 4.7, reviews: 124, access: 'free', legality: 'open',
      infra: ['parking', 'toilet'], reach: ['car', 'foot'],
      speciesIds: [11, 19, 12, 13], bestSeasons: ['summer', 'autumn'],
      desc: 'Крупнейший речной остров в черте города. Ямы и бровки Дона — судак, окунь, лещ, сазан.' },
    { id: 2, name: 'Кумженская роща', districtId: 8, type: 'fishing', coords: [47.18, 39.585],
      distanceKm: 9, rating: 4.6, reviews: 98, access: 'free', legality: 'open',
      infra: ['parking', 'camping'], reach: ['car', 'foot'],
      speciesIds: [21, 16, 12, 15], bestSeasons: ['summer', 'autumn'],
      desc: 'Слияние Дона и Мёртвого Донца. Отмели — пеленгас на нереиса, тарань, лещ, сом.' },
    { id: 3, name: 'Левобережная зона (Левбердон)', districtId: 7, type: 'fishing', coords: [47.20, 39.722],
      distanceKm: 4, rating: 4.4, reviews: 76, access: 'free', legality: 'open',
      infra: ['parking', 'pier'], reach: ['car'],
      speciesIds: [13, 18, 14], bestSeasons: ['summer', 'autumn'],
      desc: 'Левый берег Дона с заливами и затонами — сазан, карась, щука. Удобный подъезд.' },
    { id: 4, name: 'Городская набережная', districtId: 3, type: 'fishing', coords: [47.215, 39.72],
      distanceKm: 1, rating: 4.0, reviews: 53, access: 'free', legality: 'open',
      infra: ['parking', 'toilet'], reach: ['foot', 'car'],
      speciesIds: [17, 16, 19], bestSeasons: ['summer', 'autumn'],
      desc: 'Рыбалка в центре с гранитного берега — чехонь, тарань, окунь. Городской вариант на час.' },
    { id: 5, name: 'Мёртвый Донец', districtId: 8, type: 'both', coords: [47.15, 39.55],
      distanceKm: 14, rating: 4.5, reviews: 64, access: 'free', legality: 'license',
      infra: ['camping'], reach: ['car', 'boat'],
      speciesIds: [14, 19, 18, 41], bestSeasons: ['autumn', 'winter'],
      desc: 'Тихий рукав с камышами — щука, окунь, карась. Осенью в плавнях — водоплавающая дичь (по путёвке).' },
    { id: 6, name: 'Ростовское море (вдхр.)', districtId: 1, type: 'fishing', coords: [47.30, 39.70],
      distanceKm: 11, rating: 4.2, reviews: 41, access: 'paid', legality: 'restricted',
      infra: ['parking', 'pier', 'toilet'], reach: ['car'],
      speciesIds: [18, 13, 20], bestSeasons: ['summer', 'autumn'],
      desc: 'Водохранилище на Темернике в Северном — карась, сазан, толстолобик. Платные/ограниченные участки.' },
    { id: 7, name: 'Река Темерник', districtId: 2, type: 'fishing', coords: [47.275, 39.73],
      distanceKm: 7, rating: 3.6, reviews: 28, access: 'free', legality: 'open',
      infra: [], reach: ['foot'],
      speciesIds: [18, 19], bestSeasons: ['summer'],
      desc: 'Небольшая городская река — карась, окунь. Подходит для лёгкой поплавочной ловли.' },
    { id: 8, name: 'Александровский затон', districtId: 6, type: 'both', coords: [47.21, 39.83],
      distanceKm: 12, rating: 4.3, reviews: 47, access: 'free', legality: 'license',
      infra: ['camping', 'pier'], reach: ['car', 'boat'],
      speciesIds: [13, 15, 12, 43], bestSeasons: ['summer', 'autumn'],
      desc: 'Затон на востоке города — сазан, сом, лещ. В лесополосах рядом — фазан осенью (по путёвке).' },
    { id: 9, name: 'Кизитеринская балка', districtId: 6, type: 'hunting', coords: [47.225, 39.80],
      distanceKm: 10, rating: 3.9, reviews: 19, access: 'free', legality: 'license',
      infra: [], reach: ['car', 'foot'],
      speciesIds: [33, 44, 45], bestSeasons: ['autumn'],
      desc: 'Степная балка с лесополосами — заяц, куропатка, перепел. Ходовая осенняя охота (по путёвке).' },
  ],

  laws: {
    spawningBans: [
      { title: 'Общий нерестовый запрет', period: '1 апреля — 31 мая', area: 'Водоёмы Ростовской области', note: 'Запрет любительского лова в большинстве водоёмов.' },
      { title: 'Запрет на тарань и плотву', period: '15 марта — 30 апреля', area: 'Дон ниже Цимлянской ГЭС, Таганрогский залив', note: 'Отдельные сроки для полупроходных видов.' },
    ],
    norms: [
      { label: 'Суточная норма вылова', value: '5 кг', note: 'Суммарно на человека (кроме случая, когда один экземпляр весит больше).' },
      { label: 'В запретный период / месте', value: '×2 таксы', note: 'Размер ущерба за каждый экземпляр удваивается.' },
      { label: 'Запрещённые орудия', value: 'сети, электроудочка, взрывчатка, остроги', note: 'Разрешена только любительская снасть в рамках правил.' },
    ],
    liability: [
      { code: 'КоАП РФ, ст. 8.37', title: 'Нарушение правил рыболовства', penalty: '2 000 – 5 000 ₽', extra: '+ конфискация снастей и улова' },
      { code: 'УК РФ, ст. 256', title: 'Незаконная добыча (крупный ущерб)', penalty: '300 000 – 500 000 ₽', extra: 'либо обязательные/исправительные работы, до 2 лет' },
    ],
    fines: [
      { name: 'Рыбалка в запрещённый период', sub: 'Нерест, запретные снасти', amount: 3000 },
      { name: 'Охота без путёвки', sub: 'Отсутствие разрешающих охоту документов', amount: 5000 },
      { name: 'Охота в заповедной зоне', sub: 'Нарушение границ ООПТ', amount: 10000 },
      { name: 'Превышение нормы вылова', sub: 'За каждый кг сверх нормы', amount: 500 },
    ],
    source: 'Постановление Правительства РФ № 1321 от 03.11.2018; Правила рыболовства Азово-Черноморского бассейна. Данные ознакомительные.',
  },

  // Трофеи
  trophies: [
    { species: 'Сом', weight: '113 кг', place: 'Цимлянское вдхр.', date: '17 мая' },
    { species: 'Щука', weight: '11.4 кг', place: 'Зелёный остров', date: '12 июня' },
    { species: 'Сазан', weight: '8.2 кг', place: 'Левбердон', date: '3 июня' },
  ],

  guides: [
    { id: 1, name: 'Алексей Щуков', rating: 4.5, info: '15 лет на Дону. Спиннинг, троллинг, судак и щука.', contact: '+7 (900) 000-00-01' },
    { id: 2, name: 'Игорь Сомов', rating: 4.8, info: 'Трофейная рыбалка на сома и сазана, своя лодка.', contact: '+7 (900) 000-00-02' },
    { id: 3, name: 'Пётр Гусев', rating: 4.6, info: 'Охота на водоплавающую дичь, обученные собаки.', contact: '+7 (900) 000-00-03' },
    { id: 4, name: 'Сергей Карпов', rating: 4.7, info: 'Зимняя рыбалка: мормышка, балансир, безмотылка.', contact: '+7 (900) 000-00-04' },
    { id: 5, name: 'Дмитрий Лосев', rating: 4.4, info: 'Охота на кабана и косулю по путёвкам и лицензиям.', contact: '+7 (900) 000-00-05' },
    { id: 6, name: 'Николай Уткин', rating: 4.9, info: 'Гид по угодьям левобережья, помощь новичкам.', contact: '+7 (900) 000-00-06' },
  ],

  speciesPhotos: {
    fish: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=60',
    animal: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=60',
    bird: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&q=60',
  },
};
