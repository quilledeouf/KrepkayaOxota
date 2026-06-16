const Api = (() => {
  const db = window.APP_DATA;

  const tick = (value) => Promise.resolve(value);

  const modeToCategoryId = (mode) => (mode === 'fishing' ? 2 : 1);

  function currentSeasonCode(date = new Date()) {
    const m = date.getMonth() + 1; // 1..12
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';
    return 'winter';
  }

  const seasonByCode = (code) => db.seasons.find((s) => s.code === code) || null;

  const getCategories = () => tick(db.categories);
  const getSeasons = () => tick(db.seasons);

  const getRegionsGeoJSON = () => tick(db.regions);

  const getRegionById = (id) => {
    const f = db.regions.features.find((x) => x.properties.id === Number(id));
    return tick(f ? { id: f.properties.id, ...f.properties } : null);
  };

  const searchRegions = (query) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return tick([]);
    const list = db.regions.features
      .filter((f) => f.properties.name.toLowerCase().includes(q))
      .map((f) => ({ id: f.properties.id, name: f.properties.name }));
    return tick(list);
  };

  function getRegionSpecies(regionId, opts = {}) {
    const mode = opts.mode || 'hunting';
    const seasonCode = opts.season || currentSeasonCode();
    const season = seasonByCode(seasonCode);
    const catId = modeToCategoryId(mode);

    const region = db.regions.features.find((f) => f.properties.id === Number(regionId));
    if (!region) {
      return Promise.reject({ code: 'REGION_NOT_FOUND', message: `Регион id=${regionId} не найден` });
    }

    const rows = db.availability
      .filter((a) => a.regionId === Number(regionId) && (!season || a.seasonId === season.id))
      .map((a) => ({ a, sp: db.species.find((s) => s.id === a.speciesId) }))
      .filter((x) => x.sp && x.sp.categoryId === catId)
      .map(({ a, sp }) => ({
        id: sp.id,
        name: sp.name,
        emoji: sp.emoji,
        isAllowed: a.isAllowed,
        dateFrom: a.dateFrom,
        dateTo: a.dateTo,
        restriction: a.restriction,
      }));

    return tick({
      region: { id: region.properties.id, name: region.properties.name },
      mode,
      season: seasonCode,
      species: rows,
    });
  }

  function getAllSpecies(opts = {}) {
    let list = db.species.slice();
    if (opts.mode) list = list.filter((s) => s.categoryId === modeToCategoryId(opts.mode));
    if (opts.q) {
      const q = opts.q.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return tick(list);
  }

  const getSpeciesById = (id) => {
    const sp = db.species.find((s) => s.id === Number(id));
    return tick(sp || null);
  };

  function getRegionsBySpecies(speciesId, opts = {}) {
    const season = opts.season ? seasonByCode(opts.season) : null;
    const ids = db.availability
      .filter((a) => a.speciesId === Number(speciesId) && (!season || a.seasonId === season.id))
      .map((a) => a.regionId);
    return tick([...new Set(ids)]);
  }

  return {
    currentSeasonCode,
    getCategories,
    getSeasons,
    getRegionsGeoJSON,
    getRegionById,
    searchRegions,
    getRegionSpecies,
    getAllSpecies,
    getSpeciesById,
    getRegionsBySpecies,
  };
})();

window.Api = Api;
