/*
 * components.js — общие части интерфейса: иконки (SVG), шапка, подвал, утилиты.
 * Подключается на каждой странице первым из UI-скриптов. Иконки — в стиле Lucide
 * (по рекомендации UI/UX Pro Max: SVG-иконки вместо эмодзи).
 */
const UI = (() => {
  // Базовый путь: страницы в /pages/ ссылаются на корень через ../
  const inPages = location.pathname.replace(/\\/g, '/').includes('/pages/');
  const base = inPages ? '../' : '';
  const link = (p) => base + p;

  // ── Иконки (24×24, stroke=currentColor) ──────────────────
  const paths = {
    home: '<path d="M3 9.8 12 3l9 6.8"/><path d="M5 10v10h14V10"/>',
    map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    book: '<path d="M12 7a4 4 0 0 0-4-4H3v15h6a3 3 0 0 1 3 3"/><path d="M12 7a4 4 0 0 1 4-4h5v15h-6a3 3 0 0 0-3 3"/>',
    scale: '<path d="M12 3v18"/><path d="M7 21h10"/><path d="M5 7h14l-1-2H6z"/><path d="m6 7-3 6a3 3 0 0 0 6 0z"/><path d="m18 7-3 6a3 3 0 0 0 6 0z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    fish: '<path d="M3 12c3-5 8-6 12-6 3 0 5 2 6 6-1 4-3 6-6 6-4 0-9-1-12-6z"/><path d="M16.5 11v.01"/><path d="m3 12-1.5-2.5M3 12l-1.5 2.5"/>',
    paw: '<circle cx="6.5" cy="11" r="1.7"/><circle cx="10" cy="7.5" r="1.7"/><circle cx="14" cy="7.5" r="1.7"/><circle cx="17.5" cy="11" r="1.7"/><path d="M8.5 15.5c0-1.9 1.6-3 3.5-3s3.5 1.1 3.5 3-1.6 3-3.5 3-3.5-1.1-3.5-3z"/>',
    bird: '<path d="M16 7h.01"/><path d="M3.5 17.5a8 8 0 0 1 13-8.2L20 6v5a8.5 8.5 0 0 1-8.5 8.5H6a2.5 2.5 0 0 1-2.5-2z"/><path d="M9 20v2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.8 6.1 20.3l1.3-6.5-4.9-4.5 6.6-.8z"/>',
    filter: '<path d="M3 5h18l-7 8.2V20l-4 1.5v-8.3z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    route: '<circle cx="6.5" cy="18.5" r="2.2"/><circle cx="17.5" cy="5.5" r="2.2"/><path d="M8.7 18.5H14a3.5 3.5 0 0 0 0-7H10a3.5 3.5 0 0 1 0-7h5.3"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 4.5 1.8 5.5 2 6H4c.2-.5 2-1.5 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    check: '<path d="M5 12.5 9.5 17 19 6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    leaf: '<path d="M4 20c8 0 16-5 16-16 0 0-12-2-16 4-2.4 3.6 0 8 0 12z"/><path d="M4 20c2-6 6-9 10-11"/>',
  };
  const icon = (name, cls = '') =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;

  const logoMark = () =>
    `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
       <circle cx="20" cy="20" r="19" fill="#16321f" stroke="#3d8456" stroke-width="2"/>
       <path d="M13 27c0-5 2-9 7-9s7 4 7 9" fill="none" stroke="#e7f0e9" stroke-width="2" stroke-linecap="round"/>
       <path d="M20 18V9M20 12l-4-3M20 12l4-3M16 9l-3-1M24 9l3-1" fill="none" stroke="#f0a020" stroke-width="2" stroke-linecap="round"/>
     </svg>`;

  const NAV = [
    { href: 'index.html', label: 'Главная', icon: 'home', key: 'home' },
    { href: 'pages/map.html', label: 'Карта', icon: 'map', key: 'map' },
    { href: 'pages/handbook.html', label: 'Справочник', icon: 'book', key: 'handbook' },
    { href: 'pages/laws.html', label: 'Законы', icon: 'scale', key: 'laws' },
    { href: 'pages/guides.html', label: 'Гиды', icon: 'compass', key: 'guides' },
    { href: 'pages/profile.html', label: 'Профиль', icon: 'user', key: 'profile' },
  ];

  function renderHeader(active) {
    const host = document.getElementById('appHeader');
    if (!host) return;
    const items = NAV.map(
      (n) =>
        `<a href="${link(n.href)}" class="nav-link ${n.key === active ? 'active' : ''}">
           ${icon(n.icon)}<span>${n.label}</span>
         </a>`
    ).join('');
    host.innerHTML = `
      <div class="header-inner">
        <a class="brand" href="${link('index.html')}">${logoMark()}<span>Крепкая Охота</span></a>
        <nav class="nav" aria-label="Основная навигация">${items}</nav>
        <div class="header-actions">
          <button class="icon-btn" aria-label="Уведомления">${icon('bell')}</button>
          <a class="avatar" href="${link('pages/profile.html')}" aria-label="Профиль">АК</a>
          <button class="burger" aria-label="Меню" aria-expanded="false">${icon('filter')}</button>
        </div>
      </div>`;
    const burger = host.querySelector('.burger');
    const nav = host.querySelector('.nav');
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  function renderFooter() {
    const host = document.getElementById('appFooter');
    if (!host) return;
    host.innerHTML = `
      <div class="footer-inner">
        <span class="brand-sm">${logoMark()} Крепкая Охота</span>
        <span class="muted">Учебная практика · Ростов-на-Дону · данные ознакомительные</span>
      </div>`;
  }

  // ── Утилиты отрисовки ────────────────────────────────────
  function stars(rating) {
    const full = Math.round(rating);
    let out = '';
    for (let i = 1; i <= 5; i++) out += icon('star', i <= full ? 'star-on' : 'star-off');
    return `<span class="stars">${out}</span>`;
  }

  function seasonBars(seasons) {
    const order = [
      ['spring', 'Вес'],
      ['summer', 'Лет'],
      ['autumn', 'Осе'],
      ['winter', 'Зим'],
    ];
    return `<div class="season-bars" role="img" aria-label="Доступность по сезонам">${order
      .map(
        ([k, lbl]) =>
          `<span class="sbar ${seasons[k] === 'open' ? 'ok' : 'bad'}" title="${lbl}: ${
            seasons[k] === 'open' ? 'открыто' : 'закрыто'
          }">${lbl}</span>`
      )
      .join('')}</div>`;
  }

  const chip = (text, cls = '') => `<span class="chip ${cls}">${text}</span>`;

  function init(active) {
    renderHeader(active);
    renderFooter();
  }

  return { icon, logoMark, init, renderHeader, renderFooter, stars, seasonBars, chip, link };
})();

window.UI = UI;
