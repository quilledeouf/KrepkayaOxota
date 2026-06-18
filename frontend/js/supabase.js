/*
⣿⣿⣷⠻⣦⡶⢈⣴⣿⣿⣿⢿⣿⣿⣿⣿⣿⣷⣝⢮⠻⣷⣝⢾⡿⠃⠻⣿⣿⣿
⣿⣿⣷⣴⠞⣴⣿⡏⣿⣿⣿⣦⠻⢿⣿⣿⣿⣿⣿⣷⡀⠙⣿⣷⡙⣆⣿⣿⣿⣿
⣿⣿⣿⡟⣼⣿⠿⢃⠻⢿⣿⣿⠰⢇⢽⡟⢿⣿⣿⣿⣿⡄⢿⣿⣷⠘⢿⣿⣿⣿
⣿⣿⡿⢹⢸⣿⢰⡝⡅⡆⢿⣿⣿⢸⣦⠙⠆⠙⢿⡏⠿⣷⡈⣿⣿⡇⠰⣍⢿⣿
⣿⣿⡇⣿⢸⣿⢸⢡⣷⡘⡄⠻⣿⡆⡷⠚⡙⠢⡀⣙⠀⣿⡇⢹⣿⣿⡀⣿⣆⣿
⣿⣿⠃⣿⢸⡿⢎⠴⠚⢿⣮⣬⣦⡉⣇⠠⣷⠂⢹⣿⢠⢇⣴⢸⣿⣿⠁⣿⣿⢸
⣿⡇⡀⣿⠀⠇⢸⢀⣧⠄⣿⣿⣿⣿⣿⣆⣘⣠⣾⣇⡄⣾⣿⠘⠟⠁⠀⣿⣿⣸
⣿⡇⣧⠹⡇⠀⣿⣇⠘⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⢹⣿⡀⡖⠀⢸⡿⢃⡘
⣿⣷⠹⠆⠳⠀⣿⣿⣿⣿⣿⣿⣿⠛⠻⣿⣿⣿⣿⣿⡿⠀⣿⡇⠀⠀⠘⠁⣾⣇
⣿⣿⢢⡀⠱⣆⠹⣿⣿⣿⣿⣿⣿⣘⣣⣼⢿⣿⠿⠋⠀⠀⢻⡇⢀⠀⣀⠀⣿⡟

 */
const SB = (() => {
  const cfg = window.APP_CONFIG || {};
  const enabled = !!(
    window.supabase &&
    cfg.SUPABASE_URL && cfg.SUPABASE_URL.startsWith('http') &&
    cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY.length > 20
  );
  const client = enabled ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

  async function signUp({ email, password, fullName, username }) {
    if (!enabled) throw new Error('Supabase не подключён (нет ключей в config.js).');
    const { data, error } = await client.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, username } },
    });
    if (error) throw error;
    return data;
  }

  async function signIn({ email, password }) {
    if (!enabled) throw new Error('Supabase не подключён (нет ключей в config.js).');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() { if (enabled) await client.auth.signOut(); }

  async function getUser() {
    if (!enabled) return null;
    const { data } = await client.auth.getUser();
    return data.user;
  }

  async function getProfile(userId) {
    if (!enabled || !userId) return null;
    const { data } = await client.from('profiles').select('*').eq('id', userId).single();
    return data;
  }

  return { enabled, client, signUp, signIn, signOut, getUser, getProfile };
})();

window.SB = SB;
