/*
 * components.js — общие части интерфейса
 * режима (Охота/Рыбалка), подвал, утилиты. Подключается первым из UI-скриптов и прочей осталой херни 
 */
const UI = (() => {
  const inPages = location.pathname.replace(/\\/g, '/').includes('/pages/');
  const base = inPages ? '../' : '';
  const link = (p) => base + p;

  // Текущий пользователь
  function currentUser() { try { return JSON.parse(localStorage.getItem('ko-user') || 'null'); } catch (e) { return null; } }
  function setUser(u) { if (u) localStorage.setItem('ko-user', JSON.stringify(u)); else localStorage.removeItem('ko-user'); }
  function initials(name) {
    if (!name) return '';
    const parts = name.trim().split(/[\s@._-]+/).filter(Boolean);
    return ((parts[0] || '')[0] + (parts[1] ? parts[1][0] : (parts[0] || '')[1] || '')).toUpperCase();
  }

  // Режим/тема:
  function getMode() { return localStorage.getItem('ko-mode') || 'hunt'; }
  function applyMode(m) { document.body.dataset.mode = m; }
  // Применяем сразу, чтобы не было «мигания» темы
  if (document.body) applyMode(getMode());

  // ── Иконки 24 на 24 тунг тунг сахура
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
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  };
  const icon = (name, cls = '') =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;

  const logoImg = () => `<img class="logo-img" src="${link('assets/img/logo.png')}" alt="Логотип Крепкая Охота" />`;

  const NAV = [
    { href: 'index.html', label: 'Главная', key: 'home' },
    { href: 'pages/map.html', label: 'Карта', key: 'map' },
    { href: 'pages/handbook.html', label: 'Справочник', key: 'handbook' },
    { href: 'pages/laws.html', label: 'Законы', key: 'laws' },
    { href: 'pages/guides.html', label: 'Гиды', key: 'guides' },
  ];

  function renderHeader(active) {
    const host = document.getElementById('appHeader');
    if (!host) return;
    const items = NAV.map(
      (n) => `<a href="${link(n.href)}" class="nav-link ${n.key === active ? 'active' : ''}">${n.label}</a>`
    ).join('');
    const mode = getMode();
    const user = currentUser();
    host.innerHTML = `
      <div class="header-inner">
        <a class="brand" href="${link('index.html')}">${logoImg()}<span>Крепкая Охота</span></a>
        <nav class="nav" aria-label="Основная навигация">${items}</nav>
        <div class="header-actions">
          <div class="mode-toggle-h" role="group" aria-label="Режим">
            <button class="mode-dot fish" data-mode="fish" aria-pressed="${mode === 'fish'}" title="Рыбалка">${icon('fish')}</button>
            <button class="mode-dot hunt" data-mode="hunt" aria-pressed="${mode === 'hunt'}" title="Охота">${icon('paw')}</button>
          </div>
          <button class="icon-btn" aria-label="Уведомления">${icon('bell')}</button>
          ${user
            ? `<a class="avatar" href="${link('pages/profile.html')}" aria-label="Профиль" title="${user.name || 'Профиль'}">${user.initials || initials(user.name) || 'У'}</a>`
            : `<a class="avatar avatar-guest" href="${link('pages/login.html')}" aria-label="Войти" title="Войти">${icon('user')}</a>`}
          <button class="burger" aria-label="Меню" aria-expanded="false">${icon('filter')}</button>
        </div>
      </div>`;

    // Переключатель режима
    host.querySelectorAll('.mode-dot').forEach((btn) =>
      btn.addEventListener('click', () => {
        const m = btn.dataset.mode;
        localStorage.setItem('ko-mode', m);
        applyMode(m);
        host.querySelectorAll('.mode-dot').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
        document.dispatchEvent(new CustomEvent('modechange', { detail: m }));
      })
    );
    // Бургер-меню, омерика омерика
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
        <span class="brand-sm">${logoImg()} Крепкая Охота</span>
        <span class="muted">Учебная практика · Ростов-на-Дону · данные ознакомительные</span>
      </div>`;
  }

  //Утилиты
  function stars(rating) {
    const full = Math.round(rating);
    let out = '';
    for (let i = 1; i <= 5; i++) out += icon('star', i <= full ? 'star-on' : 'star-off');
    return `<span class="stars">${out}</span>`;
  }
  function seasonBars(seasons) {
    const order = [['spring', 'Вес'], ['summer', 'Лет'], ['autumn', 'Осе'], ['winter', 'Зим']];
    return `<div class="season-bars" role="img" aria-label="Доступность по сезонам">${order
      .map(([k, lbl]) => `<span class="sbar ${seasons[k] === 'open' ? 'ok' : 'bad'}" title="${lbl}: ${seasons[k] === 'open' ? 'открыто' : 'закрыто'}">${lbl}</span>`)
      .join('')}</div>`;
  }
  const chip = (text, cls = '') => `<span class="chip ${cls}">${text}</span>`;

  function init(active) {
    applyMode(getMode());
    renderHeader(active);
    renderFooter();
  }

  return { icon, logoImg, init, getMode, renderHeader, renderFooter, stars, seasonBars, chip, link, currentUser, setUser, initials };
})();

window.UI = UI;
