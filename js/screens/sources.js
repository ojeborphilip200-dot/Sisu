import { sources } from "../data/sources.js";
import { events } from "../data/mock.js";
import { travelSources } from "../data/transit.js";
import { places, placeInArea } from "../data/places.js";
import { getProfile } from "../state.js";
import { SourcePrefButtons, bindSourcePrefButtons } from "../components/SourcePrefButtons.js";

function SourceCard(s, counts, active = true) {
  return `
    <div class="card source-card ${active ? "" : "inactive"}">
      <h3>${s.name}</h3>
      <p>${s.kind}</p>
      <p class="event-card-meta">${
        active ? `${counts[s.id]} events found · last checked ${s.lastScanned}` : "Not being checked"
      }</p>
      <p class="event-card-meta">${s.method} · <a href="${s.url}" target="_blank" rel="noopener">Visit ↗</a></p>
      ${active ? SourcePrefButtons(s.id) : ""}
    </div>`;
}

export function SourcesScreen() {
  const { area } = getProfile();
  const counts = Object.fromEntries(sources.map((s) => [s.id, events.filter((e) => e.source === s.id).length]));
  const campusSources = sources.filter((s) => s.scope === "campus");
  const byPlace = places
    .map((p) => ({ place: p, list: sources.filter((s) => s.place === p.id), active: placeInArea(p.id, area) }))
    .filter((g) => g.list.length);
  const active = byPlace.filter((g) => g.active);
  const inactive = byPlace.filter((g) => !g.active);

  return `
    <h1>Sources</h1>
    <p class="muted">Sisu doesn't create events. Our AI checks these public calendars and listings,
      summarizes what it finds, and links back to the original. You decide which sources you see more or less of.</p>

    <h2>On campus</h2>
    ${campusSources.map((s) => SourceCard(s, counts)).join("")}

    ${active
      .map((g) => `<h2>${g.place.home ? `Around ${g.place.name}` : `${g.place.name} · saved place`}</h2>
        ${g.list.map((s) => SourceCard(s, counts)).join("")}`)
      .join("")}

    ${inactive.length
      ? `<h2>Not being checked</h2>
         <p class="muted">These towns are outside your area, so Sisu isn't checking their sources.
           <a href="#/profile">Add a saved place</a> to include them.</p>
         ${inactive.map((g) => g.list.map((s) => SourceCard({ ...s, name: `${s.name} · ${g.place.name}` }, counts, false)).join("")).join("")}`
      : ""}

    <h2>Travel info</h2>
    <p class="muted">Used for “Getting there” on event pages. These don't decide which events you see.</p>
    ${travelSources
      .map(
        (t) => `
      <div class="card source-card">
        <h3>${t.name}</h3>
        <p>${t.kind}</p>
        <p class="event-card-meta">Last checked ${t.lastScanned}${
          t.url ? ` · <a href="${t.url}" target="_blank" rel="noopener">Visit ↗</a>` : ""
        }</p>
      </div>`
      )
      .join("")}

    <p class="sample-note">Prototype: these sources, events, routes, and prices are fictional samples.</p>
  `;
}

SourcesScreen.mount = (root) => {
  bindSourcePrefButtons(root, () => {
    root.innerHTML = SourcesScreen();
    SourcesScreen.mount(root);
  });
};
