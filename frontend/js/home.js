/* home.js — логика главной страницы (Место дня + карточки мест). */
(() => {
  // Фотофоны мест (Unsplash). Если нет сети — остаётся CSS-градиент.
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

  const isOpenNow = (place) => place.species.some((s) => s.seasons[season] === 'open');
  const speciesChips = (place, n = 3) =>
    place.species.slice(0, n).map((s) => UI.chip(s.name)).join('');

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('home');
    await renderFeatured();
    await renderPlaces();
  }

  async function renderFeatured() {
    const p = await Api.getFeaturedPlace();
    const host = document.getElementById('featured');
    host.style.backgroundImage =
      `linear-gradient(180deg, rgba(18,40,26,.15) 30%, rgba(18,40,26,.92)), url("${photoFor(p.id)}")`;
    host.innerHTML = `
      <div class="featured-body">
        <span class="eyebrow">Место дня</span>
        <h3>${p.name}</h3>
        <div class="meta">
          <span class="meta-item">${UI.icon('pin')} ${p.distanceKm} км от центра</span>
          <span class="meta-item">${UI.stars(p.rating)} ${p.rating} (${p.reviews} отзыва)</span>
        </div>
        <div class="chips">${p.species.map((s) => UI.chip(s.name)).join('')}</div>
        <a class="btn btn-primary" href="${UI.link('pages/map.html')}?place=${p.id}">
          ${UI.icon('route')} Построить маршрут
        </a>
      </div>`;
  }

  async function renderPlaces() {
    const places = await Api.getPlaces();
    const grid = document.getElementById('placesGrid');
    grid.innerHTML = places
      .map((p) => {
        const open = isOpenNow(p);
        return `
        <article class="place-card" data-id="${p.id}" tabindex="0" role="link"
                 aria-label="${p.name}, ${p.district}">
          <div class="place-media" style="background-image:url('${photoFor(p.id)}')">
            <span class="place-badge">${UI.icon('star')} ${p.rating}</span>
            <span class="status-dot ${open ? 'open' : 'closed'}"
                  title="${open ? 'Сейчас есть открытые виды' : 'Сейчас закрыто'}"></span>
          </div>
          <div class="place-body">
            <h4>${p.name}</h4>
            <div class="place-loc">${UI.icon('pin')} ${p.district} · ${p.distanceKm} км</div>
            <div class="place-tags">${speciesChips(p)}</div>
          </div>
        </article>`;
      })
      .join('');

    const go = (id) => (location.href = `${UI.link('pages/map.html')}?place=${id}`);
    grid.querySelectorAll('.place-card').forEach((card) => {
      card.addEventListener('click', () => go(card.dataset.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(card.dataset.id); }
      });
    });
  }
})();
