// "Getting there" panel for an event page: travel options from campus, honest warnings,
// where the travel info came from, and opting in to travel with other students.
import { travelOptions, fmtTime, fmtDuration, distanceFromCampus, townName } from "../travel.js";
import { modeEmoji, travelSources } from "../data/transit.js";
import { fmtMiles } from "../data/places.js";

const sourceFor = (mode) => travelSources.find((s) => s.modes.includes(mode));

function OptionRow(o) {
  const timing =
    o.leave == null
      ? ""
      : o.departures
      ? `Leaves ${fmtTime(o.leave)}, arrives ${fmtTime(o.arrive)}${o.late ? " (after it starts)" : ""}`
      : `Leave by ${fmtTime(o.leave)}`;
  return `
    <li class="trip-option ${o.unavailable ? "unavailable" : ""}">
      <span class="trip-emoji">${modeEmoji[o.mode]}</span>
      <span class="trip-text">
        <span><strong>${o.label}</strong> · ${fmtDuration(o.minutes)} · ${o.cost}</span>
        ${o.unavailable ? `<small>${o.unavailable}</small>` : timing ? `<small>${timing}</small>` : ""}
        ${o.returnWarning && !o.unavailable ? `<small class="trip-warn">⚠️ ${o.returnWarning}</small>` : ""}
      </span>
    </li>`;
}

export function GettingThere(event, profile) {
  if (event.town === "campus") {
    return `
      <section class="panel getting-there">
        <h2>Getting there</h2>
        <p class="muted">🚶 On campus, about a ${travelOptions(event)[0].minutes}-minute walk from most dorms.</p>
      </section>`;
  }

  const options = travelOptions(event, profile.area.transport);
  const scheduleSources = [...new Set(options.map((o) => sourceFor(o.mode)).filter((src) => src?.url))];
  const hasRideshare = options.some((o) => o.mode === "rideshare");
  const buddyOn = !!profile.rideBuddies[event.id];

  return `
    <section class="panel getting-there">
      <h2>Getting there</h2>
      <p class="muted">📍 ${townName(event)} · ${fmtMiles(distanceFromCampus(event))} from campus</p>
      <ul class="trip-options">${options.map(OptionRow).join("")}</ul>
      <p class="trip-source">${[
        ...scheduleSources.map((src) => `Times from ${src.name} (sample), checked ${src.lastScanned}.`),
        hasRideshare ? "Rideshare prices are typical estimates, not quotes. Check your app before you go." : "",
      ].join(" ")}</p>

      <div class="buddy-card">
        <p><strong>🤝 ${event.buddies} student${event.buddies === 1 ? " is" : "s are"} going from campus and open to traveling together</strong></p>
        <button type="button" class="pref-btn ${buddyOn ? "active" : ""}" data-buddy aria-pressed="${buddyOn}">
          ${buddyOn ? "✓ You're open to traveling together" : "I'm open to traveling together"}</button>
        <p class="sheet-note">Only verified students from your campus see this. Meet on campus, travel in groups, and you can leave anytime.
          ${buddyOn ? "In the full app, you'd get a group chat once others confirm." : ""}</p>
      </div>

      <a class="text-link" href="#/coach?topic=travel">💬 Unsure about the trip? Plan it with Sisu Coach</a>
    </section>`;
}
