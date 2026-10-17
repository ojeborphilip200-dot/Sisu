// Where events happen. The prototype is set at SUNY Oneonta; other towns can be saved as places.
// Coordinates are real; distances are straight-line ("as the crow flies").
export const campus = { id: "campus", name: "SUNY Oneonta", lat: 42.4686, lon: -75.0649 };

// Towns a student can add as saved places. `radius` = how much of the town counts (miles).
export const places = [
  { id: "oneonta", name: "Oneonta", lat: 42.4529, lon: -75.0638, radius: 3, home: true },
  { id: "albany", name: "Albany", lat: 42.6526, lon: -73.7562, radius: 6 },
  { id: "cooperstown", name: "Cooperstown", lat: 42.7006, lon: -74.9243, radius: 3 },
  { id: "binghamton", name: "Binghamton", lat: 42.0987, lon: -75.918, radius: 5 },
];

export const placeById = Object.fromEntries(places.map((p) => [p.id, p]));

// Home-base radius choices, labeled by how a student would actually get there.
export const radiusPresets = [
  { miles: 1, label: "Walking distance", hint: "about 1 mi" },
  { miles: 5, label: "Around town", hint: "local bus or short ride, 5 mi" },
  { miles: 15, label: "Nearby area", hint: "usually needs a car, 15 mi" },
];

export const transportModes = [
  { id: "no-car", emoji: "🚶", label: "No car", hint: "Walking, buses, rides from others" },
  { id: "car", emoji: "🚗", label: "I have a car", hint: "Or can usually borrow one" },
];

export const DEFAULT_AREA = { radius: 5, places: [], transport: "no-car" };

export function milesBetween(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

export const fmtMiles = (mi) => (mi < 0.5 ? "on campus" : `${mi < 10 ? mi.toFixed(1) : Math.round(mi)} mi`);

// Is a town covered by the student's area (inside the radius, or saved)?
export function placeInArea(placeId, area) {
  const p = placeById[placeId];
  if (!p) return false;
  return area.places.includes(placeId) || milesBetween(campus, p) <= area.radius + p.radius;
}

export function describeArea(area) {
  const saved = area.places.map((id) => placeById[id]?.name).filter(Boolean);
  return `Within ${area.radius} mi of campus${saved.length ? ` + ${saved.join(", ")}` : ""}`;
}
