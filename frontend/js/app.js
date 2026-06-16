/*
 * app.js — состояние приложения и UI-логика главной страницы (карта).
 * Связывает переключатели (режим/сезон), поиск, карту и боковую панель.
 * Данные получает только через Api, карту — через MapView.
 */
(() => {
  // ── Глобальное состояние (см. docs/ARCHITECTURE.md §3) ───
  const state = {
    mode: 'hunting', // F2: 'hunting' | 'fishing'
    season: Api.currentSeasonCode(), // F4: текущий сезон по дате
    selectedRegionId: null, // F3
    speciesFilter: null, // F5: id вида или null
  };

  // ── Ссылки на элементы ───────────────────────────────────
  const el = {};
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    el.modeBtns = document.querySelectorAll('[data-mode]');
    el.seasonSelect = $('seasonSelect');
    el.search = $('searchInput');
    el.searchResults = $('searchResults');
    el.panel = $('panel');
    el.speciesFilter = $('speciesFilter');
    el.clearFilter = $('clearFilter');

    await buildSeasonSelect();
    await buildSpeciesFilter();
    bindControls();

    await MapView.init('map', onRegionSelected);
    renderEmptyPanel();
  }

  // ── Построение контролов ─────────────────────────────────
  async function buildSeasonSelect() {
    const seasons = await Api.getSeasons();
    el.seasonSelect.innerHTML = seasons
      .map((s) => `<option value="${s.code}">${s.title}</option>`)
      .join('');
    el.seasonSelect.value = state.season;
  }

  async function buildSpeciesFilter() {
    const species = await Api.getAllSpecies({ mode: state.mode });
    el.speciesFilter.innerHTML =
      '<option value="">— все виды —</option>' +
      species.map((s) => `<option value="${s.id}">${s.emoji} ${s.name}</option>`).join('');
    el.speciesFilter.value = state.speciesFilter || '';
  }

  // ── Обработчики ──────────────────────────────────────────
  function bindControls() {
    // F2 — режим охота/рыбалка
    el.modeBtns.forEach((btn) =>
      btn.addEventListener('click', async () => {
        state.mode = btn.dataset.mode;
        el.modeBtns.forEach((b) => b.classList.toggle('active', b === btn));
        state.speciesFilter = null;
        await buildSpeciesFilter();
        MapView.highlightRegions([]);
        if (state.selectedRegionId) refreshPanel();
      })
    );

    // F4 — сезон
    el.seasonSelect.addEventListener('change', () => {
      state.season = el.seasonSelect.value;
      applySpeciesFilter();
      if (state.selectedRegionId) refreshPanel();
    });

    // F7 — поиск региона
    el.search.addEventListener('input', onSearch);

    // F5 — фильтр по виду
    el.speciesFilter.addEventListener('change', () => {
      state.speciesFilter = el.speciesFilter.value || null;
      applySpeciesFilter();
    });
    el.clearFilter.addEventListener('click', () => {
      state.speciesFilter = null;
      el.speciesFilter.value = '';
      MapView.highlightRegions([]);
    });
  }

  // ── Поиск (F7) ───────────────────────────────────────────
  async function onSearch() {
    const results = await Api.searchRegions(el.search.value);
    if (!el.search.value.trim()) {
      el.searchResults.innerHTML = '';
      return;
    }
    if (results.length === 0) {
      // Ветка ошибки из User Flow: ничего не найдено
      el.searchResults.innerHTML =
        '<li class="muted">Ничего не найдено. Выберите регион на карте.</li>';
      return;
    }
    el.searchResults.innerHTML = results
      .map((r) => `<li data-region="${r.id}">${r.name}</li>`)
      .join('');
    el.searchResults.querySelectorAll('li[data-region]').forEach((li) =>
      li.addEventListener('click', () => {
        const id = Number(li.dataset.region);
        MapView.selectRegion(id);
        onRegionSelected(id);
        el.searchResults.innerHTML = '';
        el.search.value = '';
      })
    );
  }

  // ── Фильтр по виду (F5) ──────────────────────────────────
  async function applySpeciesFilter() {
    if (!state.speciesFilter) {
      MapView.highlightRegions([]);
      return;
    }
    const ids = await Api.getRegionsBySpecies(state.speciesFilter, { season: state.season });
    MapView.highlightRegions(ids);
  }

  // ── Боковая панель: карточка региona (F3) ────────────────
  function onRegionSelected(regionId) {
    state.selectedRegionId = regionId;
    refreshPanel();
  }

  async function refreshPanel() {
    try {
      const data = await Api.getRegionSpecies(state.selectedRegionId, {
        mode: state.mode,
        season: state.season,
      });
      renderPanel(data);
    } catch (err) {
      // Ветка ошибки из User Flow: нет данных по региону
      el.panel.innerHTML = `<div class="panel-empty">Данные по региону уточняются.</div>`;
    }
  }

  function renderPanel(data) {
    const modeTitle = state.mode === 'fishing' ? 'Рыбалка' : 'Охота';
    const seasonTitle = el.seasonSelect.options[el.seasonSelect.selectedIndex].text;

    if (!data.species.length) {
      // Ветка ошибки из User Flow: в этом сезоне ничего не доступно
      el.panel.innerHTML = `
        <h2>${data.region.name}</h2>
        <div class="badges"><span class="badge">${modeTitle}</span><span class="badge">${seasonTitle}</span></div>
        <p class="panel-empty">В этом сезоне ${modeTitle.toLowerCase()} здесь закрыта или данных нет.</p>`;
      return;
    }

    const rows = data.species
      .map((s) => {
        const ok = s.isAllowed;
        const period = ok && s.dateFrom ? `${fmt(s.dateFrom)} — ${fmt(s.dateTo)}` : '—';
        return `
          <li class="species-row ${ok ? 'allowed' : 'closed'}">
            <span class="sp-emoji">${s.emoji || '•'}</span>
            <span class="sp-name">${s.name}</span>
            <span class="sp-status">${ok ? '✅ открыто' : '⛔ закрыто'}</span>
            <span class="sp-period">${period}</span>
            ${s.restriction ? `<span class="sp-restr">${s.restriction}</span>` : ''}
          </li>`;
      })
      .join('');

    el.panel.innerHTML = `
      <h2>${data.region.name}</h2>
      <div class="badges"><span class="badge">${modeTitle}</span><span class="badge">${seasonTitle}</span></div>
      <ul class="species-list">${rows}</ul>
      <p class="hint">Сроки и ограничения — демо-данные прототипа.</p>`;
  }

  function renderEmptyPanel() {
    el.panel.innerHTML = `
      <div class="panel-empty">
        <p>👈 Выберите регион на карте или через поиск,<br>чтобы увидеть, что можно добыть.</p>
      </div>`;
  }

  const fmt = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  };
})();
