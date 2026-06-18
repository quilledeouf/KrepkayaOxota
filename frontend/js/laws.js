/* laws.js — страница «Законы»: запреты, нормы, таксы, ответственность. */
(() => {
  const el = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('laws');
    const laws = await Api.getLaws();
    const fish = await Api.getSpecies({ cat: 'fish' });
    renderBans(laws.spawningBans);
    renderNorms(laws.norms);
    renderTaxes(fish);
    renderLiability(laws.liability);
    el('sourceNote').textContent = '⚠ ' + laws.source;
  }

  function renderBans(bans) {
    el('banGrid').innerHTML = bans
      .map(
        (b) => `
        <div class="ban-card">
          <h4>${b.title}</h4>
          <div class="ban-period">${b.period}</div>
          <div class="area">${b.area}</div>
          <div class="note">${b.note}</div>
        </div>`
      )
      .join('');
  }

  function renderNorms(norms) {
    el('normGrid').innerHTML = norms
      .map(
        (n) => `
        <div class="norm-card">
          <div class="norm-value">${n.value}</div>
          <div class="norm-label">${n.label}</div>
          <div class="note">${n.note}</div>
        </div>`
      )
      .join('');
  }

  function renderTaxes(fish) {
    el('taxBody').innerHTML = fish
      .filter((s) => s.taxRub)
      .sort((a, b) => b.taxRub - a.taxRub)
      .map(
        (s) => `
        <tr>
          <td>${s.name}</td>
          <td class="amount">${s.taxRub.toLocaleString('ru-RU')} ₽</td>
          <td class="amount2">${(s.taxRub * 2).toLocaleString('ru-RU')} ₽</td>
        </tr>`
      )
      .join('');
  }

  function renderLiability(list) {
    el('liabilityGrid').innerHTML = list
      .map(
        (l) => `
        <div class="liability-card">
          <div class="code">${l.code}</div>
          <h4>${l.title}</h4>
          <div class="penalty">${l.penalty}</div>
          <div class="muted" style="font-size:.85rem">${l.extra}</div>
        </div>`
      )
      .join('');
  }
})();
