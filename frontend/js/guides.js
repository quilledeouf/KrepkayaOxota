/* гиды */
(() => {
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('guides');
    const guides = await Api.getGuides();
    document.getElementById('guidesGrid').innerHTML = guides
      .map(
        (g) => `
        <article class="guide-card">
          <div class="guide-media">
            <div class="g-name"><span>${g.name}</span><span>${UI.icon('star', 'star-on')} ${g.rating}</span></div>
          </div>
          <div class="guide-body">
            <div class="muted">${g.info}</div>
            <div class="muted">${UI.icon('bell')} ${g.contact}</div>
            <button class="btn btn-primary" data-id="${g.id}">Записаться</button>
          </div>
        </article>`
      )
      .join('');
    document.querySelectorAll('.guide-card .btn').forEach((b) =>
      b.addEventListener('click', () => {
        const g = guides.find((x) => x.id === Number(b.dataset.id));
        b.textContent = 'Заявка отправлена ✓';
        b.disabled = true;
      })
    );
  }
})();
