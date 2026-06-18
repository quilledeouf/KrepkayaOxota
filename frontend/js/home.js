(() => {
  const PHOTOS = [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=60',
  ];
  const photoFor = (id) => PHOTOS[(id - 1) % PHOTOS.length];
  const season = Api.currentSeasonCode();
  const isOpenNow = (p) => p.species.some((s) => s.seasons[season] === 'open');
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('modechange', updateGreeting);

  async function init() {
    UI.init('home');
    updateGreeting();
    await Promise.all([renderFeatured(), renderPlaces(), renderTrophies()]);
    renderUseful();
  }

  function updateGreeting() {
    const el = $('heroHi');
    if (el) el.textContent = UI.getMode() === 'fish' ? 'Привет, рыбак!' : 'Привет, охотник!';
  }

  async function renderFeatured() {
    const p = await Api.getFeaturedPlace();
    const host = $('featured');
    host.style.backgroundImage =
      `linear-gradient(180deg, rgba(18,40,26,.12) 30%, rgba(18,40,26,.9)), url("${photoFor(p.id)}")`;
    host.innerHTML = `
      <div class="featured-body">
        <span class="eyebrow">Место дня</span>
        <h3>${p.name}</h3>
        <div class="meta">
          <span class="meta-item">${UI.icon('pin')} ${p.distanceKm} км от центра</span>
          <span class="meta-item">${UI.stars(p.rating)} ${p.rating} (${p.reviews} отзыва)</span>
        </div>
        <div class="chips">${p.species.map((s) => UI.chip(s.name)).join('')}</div>
        <a class="btn btn-primary" href="${UI.link('pages/map.html')}?place=${p.id}">${UI.icon('route')} Построить маршрут</a>
      </div>`;
  }

  async function renderPlaces() {
    const places = (await Api.getPlaces()).slice(0, 6);
    $('placesGrid').innerHTML = places
      .map((p) => {
        const open = isOpenNow(p);
        return `
        <article class="place-card" data-id="${p.id}" tabindex="0" role="link" aria-label="${p.name}, ${p.district}">
          <div class="place-media" style="background-image:url('${photoFor(p.id)}')">
            <span class="place-badge">${UI.icon('star')} ${p.rating}</span>
            <span class="status-dot ${open ? 'open' : 'closed'}" title="${open ? 'Сейчас есть открытые виды' : 'Сейчас закрыто'}"></span>
          </div>
          <div class="place-body">
            <h4>${p.name}</h4>
            <div class="place-loc">${UI.icon('pin')} ${p.district} · ${p.distanceKm} км</div>
            <div class="place-tags">${p.species.slice(0, 3).map((s) => UI.chip(s.name)).join('')}</div>
          </div>
        </article>`;
      })
      .join('');
    const go = (id) => (location.href = `${UI.link('pages/map.html')}?place=${id}`);
    $('placesGrid').querySelectorAll('.place-card').forEach((c) => {
      c.addEventListener('click', () => go(c.dataset.id));
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(c.dataset.id); } });
    });
  }

  async function renderTrophies() {
    const trophies = await Api.getTrophies();
    $('trophiesGrid').innerHTML = trophies
      .map(
        (t, i) => `
        <article class="trophy-card">
          <div class="trophy-media" style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35)),url('${PHOTOS[(i + 2) % PHOTOS.length]}')"></div>
          <div class="trophy-body">
            <h4>${t.species} · ${t.weight}</h4>
            <div class="muted">${UI.icon('pin')} ${t.place} · ${t.date}</div>
          </div>
        </article>`
      )
      .join('');
  }

  function renderUseful() {
    const items = [
      { icon: 'scale', title: 'Проверить законность', sub: 'Можно ли охотиться/ловить', href: 'pages/laws.html' },
      { icon: 'compass', title: 'Найти гида', sub: 'Проверенные проводники', href: 'pages/guides.html' },
      { icon: 'book', title: 'Справочник', sub: 'Виды рыб и животных', href: 'pages/handbook.html' },
    ];
    $('usefulGrid').innerHTML = items
      .map(
        (i) => `
        <a class="useful-card" href="${UI.link(i.href)}">
          <span class="useful-ico">${UI.icon(i.icon)}</span>
          <span><h4>${i.title}</h4><span class="muted">${i.sub}</span></span>
        </a>`
      )
      .join('');
  }
})();
