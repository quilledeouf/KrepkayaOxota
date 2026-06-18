(() => {
  const $ = (id) => document.getElementById(id);
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    UI.init('profile');

    if (!SB.enabled) {
      UI.setUser(null);
      renderGate('Профиль недоступен', 'Supabase не подключён (нет ключей в config.js).', false);
      return;
    }

    let user = null;
    try { user = await SB.getUser(); } catch (e) {}

    if (!user) {
      UI.setUser(null);
      UI.renderHeader('profile'); // обновить аватар на «гость»
      renderGate('Войдите в профиль', 'Чтобы вести дневник выездов, сохранять места и видеть достижения — войдите или создайте аккаунт.', true);
      return;
    }

    let prof = null;
    try { prof = await SB.getProfile(user.id); } catch (e) {}
    const name = (prof && prof.full_name) || (user.user_metadata && user.user_metadata.full_name) || user.email;
    UI.setUser({ name, initials: UI.initials(name) });
    UI.renderHeader('profile');

    renderCard({
      name,
      initials: UI.initials(name) || 'У',
      level: (prof && prof.level) || 1,
      levelTitle: (prof && prof.level_title) || 'Новичок',
      stats: {
        trips: (prof && prof.trips) || 0,
        species: (prof && prof.species_count) || 0,
        km: (prof && prof.km) || 0,
        achievements: 0,
      },
    });

    $('profileBody').style.display = '';
    renderAchievements();
    await renderDiary(user.id);
  }

  function renderGate(title, text, showAuth) {
    $('profileBody').style.display = 'none';
    $('profileCard').innerHTML = `
      <div class="stub">
        ${UI.icon('user')}
        <h1>${title}</h1>
        <p>${text}</p>
        ${showAuth ? `<div style="margin-top:18px;display:flex;gap:10px;justify-content:center">
          <a class="btn btn-primary" href="login.html">Войти</a>
          <a class="btn btn-light" href="register.html">Создать аккаунт</a>
        </div>` : ''}
      </div>`;
  }

  function renderCard(p) {
    const s = p.stats;
    $('profileCard').innerHTML = `
      <div class="profile-card">
        <div class="profile-ava">${p.initials}</div>
        <div style="flex:1">
          <h1 class="profile-name">${p.name}</h1>
          <span class="level-badge">Уровень ${p.level} — ${p.levelTitle}</span>
          <div class="stat-row">
            <div class="stat"><div class="num">${s.trips}</div><div class="lbl">поездок</div></div>
            <div class="stat"><div class="num">${s.species}</div><div class="lbl">вида добычи</div></div>
            <div class="stat"><div class="num">${s.km}</div><div class="lbl">км пройдено</div></div>
            <div class="stat"><div class="num">${s.achievements}</div><div class="lbl">достижений</div></div>
          </div>
        </div>
        <button id="logoutBtn" class="btn btn-light">Выйти</button>
      </div>`;
    $('logoutBtn').addEventListener('click', async () => { await SB.signOut(); UI.setUser(null); location.href = 'login.html'; });
  }

  function renderAchievements() {
    // Достижения начисляются по мере выездов пока ну пусто, ну прям вообще пусто пусто.
    $('achievements').innerHTML = `<p class="muted">Достижения появятся после первых выездов и добытых трофеев.</p>`;
  }

  async function renderDiary(userId) {
    let trips = [];
    try {
      const { data } = await SB.client.from('trips').select('*').eq('user_id', userId).order('trip_date', { ascending: false });
      trips = data || [];
    } catch (e) {}
    if (!trips.length) {
      $('diary').innerHTML = `<p class="muted">Дневник пуст. Записи о выездах появятся здесь.</p>`;
      return;
    }
    $('diary').innerHTML = trips
      .map(
        (t) => `
        <div class="diary-row">
          <div class="diary-thumb"></div>
          <div><h4>${t.place_name || 'Выезд'}</h4><div class="muted">${t.trip_date || ''} · ${t.species || ''} ${t.weight || ''}</div></div>
        </div>`
      )
      .join('');
  }
})();
