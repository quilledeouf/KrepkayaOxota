/* auth.js — вход и регистрация через Supabase Auth (login.html, register.html). */
(() => {
  const $ = (id) => document.getElementById(id);
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    UI.init('');
    const msg = $('authMsg');
    if (!SB.enabled && msg) {
      msg.textContent = 'Демо-режим: Supabase не подключён (добавьте ключи в config.js).';
      msg.className = 'auth-msg err';
    }
    const loginForm = $('loginForm');
    const registerForm = $('registerForm');
    if (loginForm) loginForm.addEventListener('submit', onLogin);
    if (registerForm) registerForm.addEventListener('submit', onRegister);
  }

  function setMsg(text, ok) {
    const msg = $('authMsg');
    if (msg) { msg.textContent = text; msg.className = 'auth-msg ' + (ok ? 'ok' : 'err'); }
  }
  const busy = (btn, on) => { if (btn) { btn.disabled = on; btn.style.opacity = on ? '.7' : '1'; } };

  async function onLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    busy(btn, true); setMsg('Вход…', true);
    try {
      await SB.signIn({ email: $('email').value.trim(), password: $('password').value });
      setMsg('Готово! Перенаправляем…', true);
      location.href = 'profile.html';
    } catch (err) {
      setMsg(translate(err.message), false);
    } finally { busy(btn, false); }
  }

  async function onRegister(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    busy(btn, true); setMsg('Создаём аккаунт…', true);
    try {
      const data = await SB.signUp({
        email: $('email').value.trim(),
        password: $('password').value,
        fullName: $('fullname').value.trim(),
        username: ($('email').value.split('@')[0] || '').trim(),
      });
      if (data.session) {
        setMsg('Аккаунт создан! Перенаправляем…', true);
        location.href = 'profile.html';
      } else {
        setMsg('Аккаунт создан. Подтвердите почту по ссылке из письма, затем войдите.', true);
      }
    } catch (err) {
      setMsg(translate(err.message), false);
    } finally { busy(btn, false); }
  }

  function translate(m) {
    if (/Invalid login credentials/i.test(m)) return 'Неверный email или пароль.';
    if (/already registered|already exists/i.test(m)) return 'Такой email уже зарегистрирован.';
    if (/Password should be at least/i.test(m)) return 'Пароль слишком короткий (минимум 6 символов).';
    if (/valid email/i.test(m)) return 'Введите корректный email.';
    return m;
  }
})();
