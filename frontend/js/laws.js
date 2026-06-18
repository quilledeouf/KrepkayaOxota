/* laws.js — Законы: чекер законности, штрафы, нерестовые запреты, таксы. */
(() => {
  const el = (id) => document.getElementById(id);
  const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('laws');
    const laws = await Api.getLaws();
    const fish = await Api.getSpecies({ cat: 'fish' });

    buildMonths();
    el('checkBtn').addEventListener('click', check);
    renderFines(laws.fines);
    renderBans(laws.spawningBans);
    renderTaxes(fish);
    el('sourceNote').textContent = '⚠ ' + laws.source;
    check();
  }

  function buildMonths() {
    const now = new Date().getMonth();
    el('monthSel').innerHTML = MONTHS.map((m, i) => `<option value="${i + 1}" ${i === now ? 'selected' : ''}>${m} 2026</option>`).join('');
  }

  // Упрощённая логика «можно/нельзя» по виду и месяцу
  function verdict(activity, month) {
    if (activity === 'fishing') {
      if (month === 4 || month === 5) return { ok: false, title: 'НЕЛЬЗЯ', text: 'Действует нерестовый запрет (1 апреля — 31 мая). Лов с лодки и многими снастями запрещён, штраф за нарушение удваивается.' };
      if (month === 3) return { ok: false, title: 'ОСТОРОЖНО', text: 'С 15 марта по 30 апреля — запрет на тарань и плотву (Дон ниже Цимлянской ГЭС). Остальное — с ограничениями.' };
      return { ok: true, title: 'МОЖНО', text: 'Вне нереста рыбалка разрешена с соблюдением правил. Суточная норма — 5 кг; разрешены поплавочные удочки, спиннинг и т.п., не более 10 крючков на человека.' };
    }
    // hunting
    if (month >= 8 || month === 1) return { ok: true, title: 'МОЖНО', text: 'Открыт осенне-зимний сезон. Охота — по путёвке/лицензии и в установленные сроки для конкретного вида.' };
    return { ok: false, title: 'НЕЛЬЗЯ', text: 'Весенне-летний период — охота в основном закрыта (кроме отдельных сроков на пернатую дичь). Уточняйте по виду.' };
  }

  function check() {
    const activity = el('actSel').value;
    const month = Number(el('monthSel').value);
    const v = verdict(activity, month);
    el('verdict').innerHTML = `
      <div class="verdict ${v.ok ? 'ok' : 'bad'}">
        <div class="v-title">${v.ok ? '✓ ' : '✕ '}${v.title}</div>
        <p style="margin:8px 0 0">${v.text}</p>
      </div>`;
  }

  function renderFines(fines) {
    el('fineList').innerHTML = fines
      .map(
        (f) => `
        <div class="fine-row">
          <div><div class="f-name">${f.name}</div><div class="f-sub">${f.sub}</div></div>
          <div class="f-amount">${f.amount.toLocaleString('ru-RU')} ₽</div>
        </div>`
      )
      .join('');
  }

  function renderBans(bans) {
    el('banGrid').innerHTML = bans
      .map((b) => `<div class="ban-card"><h4>${b.title}</h4><div class="ban-period">${b.period}</div><div class="area">${b.area}</div><div class="note">${b.note}</div></div>`)
      .join('');
  }

  function renderTaxes(fish) {
    el('taxBody').innerHTML = fish
      .filter((s) => s.taxRub)
      .sort((a, b) => b.taxRub - a.taxRub)
      .map((s) => `<tr><td>${s.name}</td><td class="amount">${s.taxRub.toLocaleString('ru-RU')} ₽</td><td class="amount2">${(s.taxRub * 2).toLocaleString('ru-RU')} ₽</td></tr>`)
      .join('');
  }
})();
