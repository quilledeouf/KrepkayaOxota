/* map.js — страница «Карта»: спутниковая подложка, фильтры, маркеры мест (F1, F5, F7). */
(() => {
  const state = { type: 'all', season: null, districtId: '', q: '' };
  let map, markerLayer;
  const el = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('map');
    el('searchIcon').outerHTML = UI.icon('search');

    buildSeasonToggles();
    buildTypeToggles();
    await buildDistrictSelect();
    bindSearch();
    initMap();
    await refresh();

    // Фокус на месте из ссылки ?place=id
    const placeId = new URLSearchParams(location.search).get('place');
    if (placeId) focusPlace(Number(placeId));
  }

  function buildSeasonToggles() {
    const host = el('seasonToggles');
    const seasons = [
      ['spring', 'Весна'], ['summer', 'Лето'], ['autumn', 'Осень'], ['winter', 'Зима'],
    ];
    host.innerHTML = seasons.map(([c, t]) => `<button class="toggle" data-season="${c}">${t}</button>`).join('');
    host.querySelectorAll('.toggle').forEach((b) =>
      b.addEventListener('click', () => {
        const same = state.season === b.dataset.season;
        state.season = same ? null : b.dataset.season;
        host.querySelectorAll('.toggle').forEach((x) => x.classList.toggle('active', !same && x === b));
        refresh();
      })
    );
  }

  function buildTypeToggles() {
    const host = el('typeToggles');
    const types = [['all', 'Все'], ['fishing', 'Рыбалка'], ['hunting', 'Охота']];
    host.innerHTML = types
      .map(([v, t]) => `<button class="toggle ${v === 'all' ? 'active' : ''}" data-type="${v}">${t}</button>`)
      .join('');
    host.querySelectorAll('.toggle').forEach((b) =>
      b.addEventListener('click', () => {
        state.type = b.dataset.type;
        host.querySelectorAll('.toggle').forEach((x) => x.classList.toggle('active', x === b));
        refresh();
      })
    );
  }

  async function buildDistrictSelect() {
    const districts = await Api.getDistricts();
    el('districtSelect').innerHTML =
      '<option value="">Все районы</option>' +
      districts.map((d) => `<option value="${d.id}">${d.name}</option>`).join('');
    el('districtSelect').addEventListener('change', (e) => {
      state.districtId = e.target.value;
      refresh();
    });
  }

  function bindSearch() {
    let t;
    el('search').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = e.target.value; refresh(); }, 200);
    });
  }

  function initMap() {
    map = L.map('map', { zoomControl: true }).setView([47.22, 39.72], 11);
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri', maxZoom: 18 }
    ).addTo(map);
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, opacity: 0.9 }
    ).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }

  function seasonForStatus() { return state.season || Api.currentSeasonCode(); }
  const isOpen = (place) => place.species.some((s) => s.seasons[seasonForStatus()] === 'open');

  function pinIcon(open) {
    const color = open ? '#1a9d4e' : '#f0820f';
    return L.divIcon({
      className: 'place-pin',
      html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5">
               <path d="M12 22s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/>
               <circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg>`,
      iconSize: [30, 30], iconAnchor: [15, 28], popupAnchor: [0, -26],
    });
  }

  async function refresh() {
    const places = await Api.getPlaces(state);
    markerLayer.clearLayers();
    places.forEach((p) => {
      const open = isOpen(p);
      const marker = L.marker(p.coords, { icon: pinIcon(open) }).addTo(markerLayer);
      marker.bindPopup(popupHtml(p, open));
      marker._placeId = p.id;
    });
    el('resultCount').textContent =
      places.length ? `Найдено мест: ${places.length}` : 'Ничего не найдено. Измените фильтры.';
  }

  function popupHtml(p, open) {
    const tags = p.species.slice(0, 4).map((s) => UI.chip(s.name)).join('');
    const typeLabel = p.type === 'hunting' ? 'Охота' : p.type === 'both' ? 'Охота и рыбалка' : 'Рыбалка';
    return `
      <div class="popup">
        <div class="popup-title">${p.name}</div>
        <div class="muted" style="font-size:.82rem">${p.district} · ${typeLabel} · ${p.distanceKm} км</div>
        <div style="margin:4px 0">${UI.stars(p.rating)} <b>${p.rating}</b> <span class="muted">(${p.reviews})</span></div>
        <div style="font-size:.82rem; color:${open ? '#1a9d4e' : '#d8412f'}; font-weight:700">
          ${open ? '● Сейчас есть открытые виды' : '● Сейчас закрыто'}
        </div>
        <div class="popup-tags">${tags}</div>
      </div>`;
  }

  function focusPlace(id) {
    let target;
    markerLayer.eachLayer((m) => { if (m._placeId === id) target = m; });
    if (target) {
      map.setView(target.getLatLng(), 13, { animate: true });
      target.openPopup();
    }
  }
})();
