/*
 * map.js — карта Leaflet и работа с полигонами регионов (F1).
 * Отвечает только за карту: отрисовку, выделение, подсветку. Бизнес-логику
 * (какие данные показать) держит app.js, данные берёт через Api.
 */
const MapView = (() => {
  let map = null;
  let regionLayer = null;
  let onRegionClick = null; // колбэк, который ставит app.js
  let highlightedIds = new Set();

  // Стили полигонов
  const STYLE_DEFAULT = { color: '#2f6b3d', weight: 1.5, fillColor: '#5a9e6f', fillOpacity: 0.25 };
  const STYLE_HOVER = { fillOpacity: 0.45, weight: 2.5 };
  const STYLE_SELECTED = { color: '#1c4427', weight: 3, fillColor: '#f0a020', fillOpacity: 0.55 };
  const STYLE_HIGHLIGHT = { color: '#b5560a', weight: 2.5, fillColor: '#f0a020', fillOpacity: 0.5 };
  const STYLE_DIMMED = { fillOpacity: 0.08, weight: 1 };

  /** Инициализация карты и загрузка регионов. */
  async function init(containerId, clickHandler) {
    onRegionClick = clickHandler;

    map = L.map(containerId, { zoomControl: true }).setView([47.22, 39.72], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    try {
      const geojson = await Api.getRegionsGeoJSON();
      regionLayer = L.geoJSON(geojson, {
        style: STYLE_DEFAULT,
        onEachFeature: bindFeature,
      }).addTo(map);
      map.fitBounds(regionLayer.getBounds(), { padding: [20, 20] });
    } catch (e) {
      // Ветка ошибки из User Flow: карта/данные не загрузились
      showMapError();
    }
  }

  function bindFeature(feature, layer) {
    const { id, name } = feature.properties;
    layer.bindTooltip(name, { sticky: true });

    layer.on('mouseover', () => {
      if (!isSelected(layer)) layer.setStyle(STYLE_HOVER);
    });
    layer.on('mouseout', () => restyle(layer));
    layer.on('click', () => {
      selectRegion(id);
      if (onRegionClick) onRegionClick(id);
    });
  }

  let selectedId = null;
  const isSelected = (layer) => layer.feature.properties.id === selectedId;

  /** Перекрасить один слой согласно текущему состоянию. */
  function restyle(layer) {
    const id = layer.feature.properties.id;
    if (id === selectedId) return layer.setStyle(STYLE_SELECTED);
    if (highlightedIds.size > 0) {
      return layer.setStyle(highlightedIds.has(id) ? STYLE_HIGHLIGHT : STYLE_DIMMED);
    }
    layer.setStyle(STYLE_DEFAULT);
  }

  function restyleAll() {
    if (regionLayer) regionLayer.eachLayer(restyle);
  }

  /** Выделить регион (по клику или из поиска) и приблизить к нему. */
  function selectRegion(id) {
    selectedId = Number(id);
    restyleAll();
    if (regionLayer) {
      regionLayer.eachLayer((layer) => {
        if (layer.feature.properties.id === selectedId) {
          map.fitBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 9 });
        }
      });
    }
  }

  /** Подсветить регионы по фильтру вида (F5). Пустой массив — снять подсветку. */
  function highlightRegions(ids) {
    highlightedIds = new Set((ids || []).map(Number));
    restyleAll();
  }

  function showMapError() {
    const el = document.getElementById('map');
    if (el) {
      el.innerHTML =
        '<div class="map-error">🗺 Не удалось загрузить карту.<br>Проверьте соединение и нажмите «Повторить».' +
        '<br><button onclick="location.reload()">Повторить</button></div>';
    }
  }

  return { init, selectRegion, highlightRegions };
})();

window.MapView = MapView;
