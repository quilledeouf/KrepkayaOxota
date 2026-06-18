/* profile.js — профиль: реальный пользователь Supabase или демо-профиль. */
(() => {
  const $ = (id) => document.getElementById(id);
  document.addEventListener('DOMContentLoaded', init);

  const initials = (name) =>
    (name || '?').split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || 'АК';

  async function init() {
    UI.init('profile');
    const demo = await Api.getProfile();
    let user = null, prof = null;
    try { user = await SB.getUser(); if (user) prof = await SB.getProfile(user.id); } catch (e) {}

    if (user) {
      const name = (prof && prof.full_name) || user.email;
      renderBanner(`Вы вошли как <b>${name}</b>`, true);
      renderCard({
        name,
        initials: initials(name),
        levelTitle: (prof && prof.level_title) || 'Новичок',
        level: (prof && prof.level) || 1,
        stats: {
          trips: (prof && prof.trips) || 0,
          species: (prof && prof.species_count) || 0,
          km: (prof && prof.km) || 0,
          achievements: 0,
        },
      });
    } else {
      renderBanner(
        SB.enabled
          ? 'Это демо-профиль. <a class="auth-link" href="login.html">Войдите</a>, чтобы вести свой.'
          : 'Демо-профиль (Supabase не подключён).',
        false
      );
      renderCard(demo);
    }
    renderAchievements(demo.achievements);
    renderDiary(demo.diary);
  }

  function renderBanner(html, loggedIn) {
    $('authBanner').innerHTML = `
      <div class="source-note" style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px">
        <span>${html}</span>
        ${loggedIn ? '<button id="logoutBtn" class="btn btn-light">Выйти</button>' : ''}
      </div>`;
    const lo = $('logoutBtn');
    if (lo) lo.addEventListener('click', async () => { await SB.signOut(); location.reload(); });
  }

  function renderCard(p) {
    const s = p.stats;
    $('profileCard').innerHTML = `
      <div class="profile-card">
        <div class="profile-ava">${p.initials || 'АК'}</div>
        <div>
          <h1 class="profile-name">${p.name}</h1>
          <span class="level-badge">Уровень ${p.level} — ${p.levelTitle}</span>
          <div class="stat-row">
            <div class="stat"><div class="num">${s.trips}</div><div class="lbl">поездок</div></div>
            <div class="stat"><div class="num">${s.species}</div><div class="lbl">вида добычи</div></div>
            <div class="stat"><div class="num">${s.km}</div><div class="lbl">км пройдено</div></div>
            <div class="stat"><div class="num">${s.achievements}</div><div class="lbl">достижений</div></div>
          </div>
        </div>
      </div>`;
  }

  function renderAchievements(list) {
    $('achievements').innerHTML = list
      .map((a) => `<div class="ach-card" style="background:${a.color}"><span class="ach-ico">${a.emoji}</span>${a.title}</div>`)
      .join('');
  }

  function renderDiary(list) {
    $('diary').innerHTML = list
      .map(
        (d) => `
        <div class="diary-row">
          <div class="diary-thumb"></div>
          <div><h4>${d.place}</h4><div class="muted">${d.date} · ${d.species}</div></div>
        </div>`
      )
      .join('');
  }
})();
