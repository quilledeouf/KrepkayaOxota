/* handbook.js — Справочник: вкладки Рыбы/Животные/Птицы, поиск, карточки с фото. */
(() => {
  const state = { cat: 'fish', q: '' };
  const CAT = { fish: { icon: 'fish', label: 'Рыба' }, animal: { icon: 'paw', label: 'Зверь' }, bird: { icon: 'bird', label: 'Птица' } };
  const el = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('handbook');
    el('searchIcon').outerHTML = UI.icon('search');
    await buildTabs();
    bindSearch();
    render();
  }

  async function buildTabs() {
    const cats = await Api.getCategories();
    const host = el('tabs');
    host.innerHTML = cats.map((c) => `<button class="tab ${c.id === state.cat ? 'active' : ''}" data-cat="${c.id}">${c.title}</button>`).join('');
    host.querySelectorAll('.tab').forEach((b) =>
      b.addEventListener('click', () => {
        state.cat = b.dataset.cat;
        host.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === b));
        render();
      })
    );
  }

  function bindSearch() {
    let t;
    el('search').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; render(); }, 150); });
  }

  async function render() {
    const list = await Api.getSpecies(state);
    const host = el('cards');
    if (!list.length) { host.innerHTML = `<p class="muted">Ничего не найдено.</p>`; return; }
    host.innerHTML = list
      .map((s) => {
        const meta = s.taxRub
          ? `<span class="tax">Такса: ${s.taxRub.toLocaleString('ru-RU')} ₽</span>`
          : s.note ? `<span class="muted" style="font-size:.8rem">${s.note}</span>` : '';
        const photo = UI.link(`assets/img/species/${s.id}.avif`);
        return `
        <article class="species-card cat-${s.cat}">
          <div class="species-photo">
            <img src="${photo}" alt="${s.name}" loading="lazy" onerror="this.style.display='none'">
            <span class="sp-cat">${UI.icon(CAT[s.cat].icon)} ${CAT[s.cat].label}</span>
          </div>
          <div class="species-body">
            <h4>${s.name}</h4>
            <div class="latin">${s.latin}</div>
            <p>${s.desc}</p>
            <div class="species-meta"><span class="size">${s.size}</span>${meta}</div>
            ${UI.seasonBars(s.seasons)}
          </div>
        </article>`;
      })
      .join('');
  }
})();
