// Map-based "where do you want to explore?" editor: home-base radius, saved places, and how the
// student gets around. Uses Leaflet + OpenStreetMap (loaded in index.html). Used by the
// onboarding quiz and the Profile page.
import { campus, places, placeById, radiusPresets, transportModes, milesBetween, DEFAULT_AREA } from "../data/places.js";

const METERS_PER_MILE = 1609.34;
const awayPlaces = places.filter((p) => !p.home);

export function AreaEditor(area) {
  const a = { ...DEFAULT_AREA, ...area };
  return `
    <div class="area-editor">
      <div class="area-map" role="img" aria-label="Map of your home base and saved places"></div>
      <p class="area-home">🏫 Home base: <strong>${campus.name}</strong></p>

      <div class="area-block">
        <div class="area-row">
          <span class="area-title">How far from campus?</span>
          <strong class="radius-value">${a.radius} mi</strong>
        </div>
        <input type="range" class="radius-slider" min="1" max="25" step="1" value="${a.radius}" aria-label="Distance from campus in miles" />
        <div class="radius-presets">
          ${radiusPresets
            .map(
              (r) => `<button type="button" class="preset ${a.radius === r.miles ? "on" : ""}" data-miles="${r.miles}">
                <strong>${r.label}</strong><small>${r.hint}</small></button>`
            )
            .join("")}
        </div>
      </div>

      <div class="area-block">
        <span class="area-title">Saved places</span>
        <p class="area-hint">Towns you'd travel to for the right event. You can also tap them on the map.</p>
        <div class="toggle-chips">
          ${awayPlaces
            .map((p) => {
              const on = a.places.includes(p.id);
              return `<button type="button" class="toggle-chip ${on ? "on" : ""}" data-place="${p.id}" aria-pressed="${on}">
                ${on ? "✓" : "＋"} ${p.name} <small>${Math.round(milesBetween(campus, p))} mi</small></button>`;
            })
            .join("")}
        </div>
      </div>

      <div class="area-block">
        <span class="area-title">How do you get around?</span>
        <div class="transport-options">
          ${transportModes
            .map(
              (t) => `<button type="button" class="preset ${a.transport === t.id ? "on" : ""}" data-transport="${t.id}">
                <strong>${t.emoji} ${t.label}</strong><small>${t.hint}</small></button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

// Wires up the controls and map. onChange(area) fires after every change.
export function mountAreaEditor(root, area, onChange) {
  const a = { ...DEFAULT_AREA, ...area, places: [...(area?.places || [])] };
  const el = root.querySelector(".area-editor");
  const L = window.L;
  let map, radiusCircle;
  const placeLayers = {};

  const placeStyle = (on) => ({
    color: on ? "#7048e8" : "#868e96",
    fillColor: on ? "#7048e8" : "#adb5bd",
    fillOpacity: on ? 0.18 : 0.12,
    weight: on ? 2 : 1,
    dashArray: on ? null : "4 4",
  });

  // Bounds come from coordinates (not layers) so they work before the map has rendered.
  const circleBounds = (lat, lon, miles) => L.latLng(lat, lon).toBounds(miles * 2 * METERS_PER_MILE);
  const fit = () => {
    if (!map) return;
    const bounds = circleBounds(campus.lat, campus.lon, a.radius);
    a.places.forEach((id) => {
      const p = placeById[id];
      bounds.extend(circleBounds(p.lat, p.lon, p.radius));
    });
    map.fitBounds(bounds, { padding: [16, 16], maxZoom: 13 });
  };

  if (L) {
    map = L.map(el.querySelector(".area-map"), { scrollWheelZoom: false, zoomSnap: 0.25 }).setView([campus.lat, campus.lon], 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    radiusCircle = L.circle([campus.lat, campus.lon], {
      radius: a.radius * METERS_PER_MILE,
      color: "#3b5bdb",
      fillColor: "#3b5bdb",
      fillOpacity: 0.12,
      weight: 2,
    }).addTo(map);
    L.circleMarker([campus.lat, campus.lon], { radius: 6, color: "#fff", weight: 2, fillColor: "#3b5bdb", fillOpacity: 1 })
      .bindTooltip("🏫 " + campus.name, { direction: "top", offset: [0, -6] })
      .addTo(map);
    awayPlaces.forEach((p) => {
      placeLayers[p.id] = L.circle([p.lat, p.lon], { radius: p.radius * METERS_PER_MILE, ...placeStyle(a.places.includes(p.id)) })
        .bindTooltip(p.name, { permanent: true, direction: "center", className: "place-label" })
        .on("click", () => togglePlace(p.id))
        .addTo(map);
    });
    fit();
    setTimeout(() => {
      map.invalidateSize();
      fit();
    }, 0);
  } else {
    el.querySelector(".area-map").innerHTML = `<p class="area-hint">Map unavailable offline. You can still use the options below.</p>`;
  }

  const changed = () => onChange({ ...a, places: [...a.places] });

  const setRadius = (miles) => {
    a.radius = miles;
    el.querySelector(".radius-value").textContent = `${miles} mi`;
    el.querySelector(".radius-slider").value = miles;
    el.querySelectorAll("[data-miles]").forEach((b) => b.classList.toggle("on", Number(b.dataset.miles) === miles));
    radiusCircle?.setRadius(miles * METERS_PER_MILE);
  };

  const togglePlace = (id) => {
    a.places = a.places.includes(id) ? a.places.filter((p) => p !== id) : [...a.places, id];
    const on = a.places.includes(id);
    const chip = el.querySelector(`[data-place="${id}"]`);
    chip.classList.toggle("on", on);
    chip.setAttribute("aria-pressed", on);
    chip.firstChild.textContent = `${on ? "✓" : "＋"} ${placeById[id].name} `;
    placeLayers[id]?.setStyle(placeStyle(on));
    fit();
    changed();
  };

  const slider = el.querySelector(".radius-slider");
  slider.addEventListener("input", () => setRadius(Number(slider.value)));
  slider.addEventListener("change", () => {
    fit();
    changed();
  });
  el.querySelectorAll("[data-miles]").forEach((b) =>
    b.addEventListener("click", () => {
      setRadius(Number(b.dataset.miles));
      fit();
      changed();
    })
  );
  el.querySelectorAll("[data-place]").forEach((b) => b.addEventListener("click", () => togglePlace(b.dataset.place)));
  el.querySelectorAll("[data-transport]").forEach((b) =>
    b.addEventListener("click", () => {
      a.transport = b.dataset.transport;
      el.querySelectorAll("[data-transport]").forEach((x) => x.classList.toggle("on", x === b));
      changed();
    })
  );
}
