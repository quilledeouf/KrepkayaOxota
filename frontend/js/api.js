/*
 * api.js — единый слой доступа к данным (см. CONTRIBUTING.md).
 * UI берёт данные только отсюда. Сейчас источник — window.APP_DATA (data.js);
 * на этапе 2 тела функций заменяются на fetch() к REST API (docs/API.md).
 * Все функции возвращают Promise, чтобы переход на сеть не ломал вызывающий код.
 */
const Api = (() => {
  const db = window.APP_DATA;
  const tick = (v) => Promise.resolve(v);

  const districtName = (id) => (db.districts.find((d) => d.id === id) || {}).name || '—';
  const speciesById = (id) => db.species.find((s) => s.id === id) || null;

  function currentSeasonCode(date = new Date()) {
    const m = date.getMonth() + 1;
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';
    return 'winter';
  }

  // ── Справочники ──────────────────────────────────────────
  const getSeasons = () => tick(db.seasons);
  const getDistricts = () => tick(db.districts);
  const getCategories = () => tick(db.categories);
  const getLaws = () => tick(db.laws);
  const getTrophies = () => tick(db.trophies);
  const getGuides = () => tick(db.guides);
  const getProfile = () => tick(db.profile);
  const speciesPhoto = (cat) => db.speciesPhotos[cat] || '';

  // ── Виды (Справочник, F6) ────────────────────────────────
  function getSpecies({ cat, q } = {}) {
    let list = db.species.slice();
    if (cat) list = list.filter((s) => s.cat === cat);
    if (q) {
      const t = q.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(t) || (s.latin || '').toLowerCase().includes(t));
    }
    return tick(list);
  }
  const getSpeciesById = (id) => tick(speciesById(Number(id)));

  // ── Места (F1, F3, F7) ───────────────────────────────────
  /** Места с раскрытыми районом и видами. Фильтры: тип, сезон, район, поиск. */
  function getPlaces({ type, season, districtId, q, speciesId } = {}) {
    let list = db.places.slice();
    if (type && type !== 'all') list = list.filter((p) => p.type === type || p.type === 'both');
    if (districtId) list = list.filter((p) => p.districtId === Number(districtId));
    if (season) list = list.filter((p) => p.bestSeasons.includes(season));
    if (speciesId) list = list.filter((p) => p.speciesIds.includes(Number(speciesId)));
    if (q) {
      const t = q.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(t) || districtName(p.districtId).toLowerCase().includes(t)
      );
    }
    return tick(list.map(expandPlace));
  }

  function getPlaceById(id) {
    const p = db.places.find((x) => x.id === Number(id));
    return tick(p ? expandPlace(p) : null);
  }

  /** Место дня — самое высокооценённое. */
  function getFeaturedPlace() {
    const top = db.places.slice().sort((a, b) => b.rating - a.rating)[0];
    return tick(expandPlace(top));
  }

  function expandPlace(p) {
    return {
      ...p,
      district: districtName(p.districtId),
      species: p.speciesIds.map(speciesById).filter(Boolean),
    };
  }

  /** Места, сгруппированные по районам (выбор пользователя). */
  async function getPlacesByDistrict(filters = {}) {
    const places = await getPlaces(filters);
    return db.districts.map((d) => ({
      district: d,
      places: places.filter((p) => p.districtId === d.id),
    }));
  }

  return {
    currentSeasonCode,
    getSeasons,
    getDistricts,
    getCategories,
    getLaws,
    getSpecies,
    getSpeciesById,
    getPlaces,
    getPlaceById,
    getFeaturedPlace,
    getPlacesByDistrict,
    getTrophies,
    getGuides,
    getProfile,
    speciesPhoto,
  };
})();

window.Api = Api;
