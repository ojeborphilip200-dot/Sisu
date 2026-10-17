import { sourceById } from "../data/sources.js";
import { getProfile } from "../state.js";
import { access, distanceFromCampus, townName } from "../travel.js";
import { fmtMiles } from "../data/places.js";

// Tappable event summary. `reason` is an optional one-line "why you're seeing this".
export function EventCard(event, { reason, transport = getProfile().area.transport } = {}) {
  const source = sourceById[event.source];
  const trip = event.town === "campus" ? null : access(event, transport);
  return `
    <a class="card event-card" href="#/event/${event.id}">
      <h3>${event.title}</h3>
      <p>${event.when}</p>
      <p>${event.where}</p>
      <p class="event-card-trip">${
        trip
          ? `📍 ${townName(event)} · ${fmtMiles(distanceFromCampus(event))}${trip.summary ? ` · ~${trip.summary}` : ""}${
              trip.noTransit || trip.lateReturnOnly ? ` · <span class="trip-warn">⚠️ check getting there</span>` : ""
            }`
          : "🏫 On campus"
      }</p>
      <p class="event-card-meta">👥 ${event.going} going · via ${source.name}</p>
      ${reason ? `<p class="event-card-why">✨ ${reason}</p>` : ""}
    </a>
  `;
}
