import { sources } from "../data/sources.js";
import { events } from "../data/mock.js";
import { getProfile } from "../state.js";
import { SourcePrefButtons, bindSourcePrefButtons } from "../components/SourcePrefButtons.js";

export function SourcesScreen() {
  const { location } = getProfile();
  const counts = Object.fromEntries(sources.map((s) => [s.id, events.filter((e) => e.source === s.id).length]));

  const group = (scope, title) => `
    <h2>${title}</h2>
    ${scope === "community" && location !== "community"
      ? `<p class="muted">You chose on-campus events only, so these don't appear in Picked for you.
           <a href="#/quiz/location">Change</a></p>`
      : ""}
    ${sources
      .filter((s) => s.scope === scope)
      .map(
        (s) => `
        <div class="card source-card">
          <h3>${s.name}</h3>
          <p>${s.kind}</p>
          <p class="event-card-meta">${counts[s.id]} events found · last checked ${s.lastScanned}</p>
          <p class="event-card-meta">${s.method} · <a href="${s.url}" target="_blank" rel="noopener">Visit ↗</a></p>
          ${SourcePrefButtons(s.id)}
        </div>`
      )
      .join("")}
  `;

  return `
    <h1>Sources</h1>
    <p class="muted">Sisu doesn't create events. Our AI checks these public calendars and listings,
      summarizes what it finds, and links back to the original. You decide which sources you see more or less of.</p>
    ${group("campus", "On campus")}
    ${group("community", "In the community")}
    <p class="sample-note">Prototype: these sources and events are fictional samples.</p>
  `;
}

SourcesScreen.mount = (root) => {
  bindSourcePrefButtons(root, () => {
    root.innerHTML = SourcesScreen();
    SourcesScreen.mount(root);
  });
};
