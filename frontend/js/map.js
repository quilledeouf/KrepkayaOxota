/* map.js — страница «Карта» на Яндекс.Картах: спутник/гибрид, фильтры, маркеры. */
(() => {
  const state = { q: '', season: null, activity: 'all', species: null, infra: new Set(), reach: new Set() };
  let map, markers, placemarks = {}, allPlaces = [];
  const el = (id) => document.getElementById(id);

  const PRESET = { open: 'islands#greenDotIcon', license: 'islands#orangeDotIcon', restricted: 'islands#redDotIcon' };
  const SPECIES_FILTER = [11, 14, 15, 19, 31, 32, 41, 33]; // судак, щука, сом, окунь, кабан, косуля, кряква, заяц
  const INFRA = [['parking', 'Парковка'], ['pier', 'Пирс'], ['toilet', 'Туалет'], ['camping', 'Палатки']];
  const REACH = [['car', 'На машине'], ['foot', 'Пешком'], ['boat', 'На лодке']];
  const ACTIVITY = [['all', 'Все'], ['fishing', 'Рыбалка'], ['bird', 'Охота на птицу'], ['animal', 'Охота на животных']];

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('map');
    el('searchIcon').outerHTML = UI.icon('search');
    allPlaces = await Api.getPlaces();
    buildSeasonToggles();
    buildSimpleToggles('typeToggles', ACTIVITY, true, (v) => { state.activity = v; refresh(); }, 'all');
    buildSpeciesToggles();
    buildMultiToggles('infraToggles', INFRA, state.infra);
    buildMultiToggles('reachToggles', REACH, state.reach);
    bindSearch();
    loadYandex(initMap);
  }

  // ── Конструкторы фильтров ────────────────────────────────
  function buildSeasonToggles() {
    const seasons = [['spring', 'Весна'], ['summer', 'Лето'], ['autumn', 'Осень'], ['winter', 'Зима']];
    const host = el('seasonToggles');
    host.innerHTML = seasons.map(([c, t]) => `<button class="toggle" data-v="${c}">${t}</button>`).join('');
    host.querySelectorAll('.toggle').forEach((b) =>
      b.addEventListener('click', () => {
        const same = state.season === b.dataset.v;
        state.season = same ? null : b.dataset.v;
        host.querySelectorAll('.toggle').forEach((x) => x.classList.toggle('active', !same && x === b));
        refresh();
      })
    );
  }

  function buildSimpleToggles(id, items, single, onPick, def) {
    const host = el(id);
    host.innerHTML = items.map(([v, t]) => `<button class="toggle ${v === def ? 'active' : ''}" data-v="${v}">${t}</button>`).join('');
    host.querySelectorAll('.toggle').forEach((b) =>
      b.addEventListener('click', () => {
        host.querySelectorAll('.toggle').forEach((x) => x.classList.toggle('active', x === b));
        onPick(b.dataset.v);
      })
    );
  }

  function buildSpeciesToggles() {
    const host = el('speciesToggles');
    const list = SPECIES_FILTER.map((id) => APP_DATA.species.find((s) => s.id === id)).filter(Boolean);
    host.innerHTML = list.map((s) => `<button class="toggle" data-id="${s.id}">${s.name}</button>`).join('');
    host.querySelectorAll('.toggle').forEach((b) =>
      b.addEventListener('click', () => {
        const id = Number(b.dataset.id);
        const same = state.species === id;
        state.species = same ? null : id;
        host.querySelectorAll('.toggle').forEach((x) => x.classList.toggle('active', !same && x === b));
        refresh();
      })
    );
  }

  function buildMultiToggles(id, items, set) {
    const host = el(id);
    host.innerHTML = items.map(([v, t]) => `<button class="toggle" data-v="${v}">${t}</button>`).join('');
    host.querySelectorAll('.toggle').forEach((b) =>
      b.addEventListener('click', () => {
        const v = b.dataset.v;
        if (set.has(v)) set.delete(v); else set.add(v);
        b.classList.toggle('active', set.has(v));
        refresh();
      })
    );
  }

  function bindSearch() {
    let t;
    el('search').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; refresh(); }, 200); });
  }

  // ── Фильтрация ───────────────────────────────────────────
  function applyFilters() {
    return allPlaces.filter((p) => {
      if (state.q) {
        const q = state.q.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.district.toLowerCase().includes(q)) return false;
      }
      if (state.season && !p.bestSeasons.includes(state.season)) return false;
      if (state.activity === 'fishing' && !(p.type === 'fishing' || p.type === 'both')) return false;
      if (state.activity === 'bird' && !p.species.some((s) => s.cat === 'bird')) return false;
      if (state.activity === 'animal' && !p.species.some((s) => s.cat === 'animal')) return false;
      if (state.species && !p.speciesIds.includes(state.species)) return false;
      for (const i of state.infra) if (!(p.infra || []).includes(i)) return false;
      for (const r of state.reach) if (!(p.reach || []).includes(r)) return false;
      return true;
    });
  }

  // ── Яндекс.Карты ─────────────────────────────────────────
  function loadYandex(cb) {
    if (window.ymaps) return ymaps.ready(cb);
    const key = (window.APP_CONFIG || {}).YANDEX_MAPS_KEY;
    const s = document.createElement('script');
    s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU' + (key ? '&apikey=' + key : '');
    s.onload = () => ymaps.ready(cb);
    s.onerror = showMapError;
    document.head.appendChild(s);
  }

  function initMap() {
    map = new ymaps.Map('map', {
      center: [47.24, 39.78], zoom: 10, type: 'yandex#hybrid',
      controls: ['zoomControl', 'geolocationControl', 'typeSelector'],
    });
    markers = new ymaps.GeoObjectCollection();
    map.geoObjects.add(markers);
    refresh();
    const placeId = new URLSearchParams(location.search).get('place');
    if (placeId) focusPlace(Number(placeId));
  }

  function refresh() {
    const places = applyFilters();
    el('resultCount').textContent = places.length ? `Найдено мест: ${places.length}` : 'Ничего не найдено. Измените фильтры.';
    if (!markers) return;
    markers.removeAll();
    placemarks = {};
    places.forEach((p) => {
      const pm = new ymaps.Placemark(
        p.coords,
        { balloonContentHeader: p.name, balloonContentBody: balloonBody(p), hintContent: p.name },
        { preset: PRESET[p.legality] || PRESET.open }
      );
      markers.add(pm);
      placemarks[p.id] = pm;
    });
  }

  function balloonBody(p) {
    const typeLabel = p.type === 'hunting' ? 'Охота' : p.type === 'both' ? 'Охота и рыбалка' : 'Рыбалка';
    const legal = { open: 'Открыто', license: 'Нужна путёвка/лицензия', restricted: 'Ограниченный доступ' }[p.legality];
    const tags = p.species.slice(0, 4).map((s) => UI.chip(s.name)).join(' ');
    return `<div style="max-width:220px">
      <div style="color:#6b7770;font-size:12px">${p.district} · ${typeLabel} · ${p.distanceKm} км</div>
      <div style="margin:4px 0">${UI.stars(p.rating)} <b>${p.rating}</b> <span style="color:#6b7770">(${p.reviews})</span></div>
      <div style="font-weight:700;color:${p.legality === 'restricted' ? '#d8412f' : p.legality === 'license' ? '#d96e08' : '#1a9d4e'}">${legal}</div>
      <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">${tags}</div>
    </div>`;
  }

  function focusPlace(id) {
    const pm = placemarks[id];
    if (pm && map) { map.setCenter(allPlaces.find((p) => p.id === id).coords, 13, { duration: 400 }); pm.balloon.open(); }
  }

  function showMapError() {
    el('map').innerHTML = '<div class="map-error">🗺 Не удалось загрузить карту.<br>Проверьте соединение.<br>' +
      '<button class="btn btn-light" onclick="location.reload()">Повторить</button></div>';
  }
})();
