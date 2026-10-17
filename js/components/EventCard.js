import { sourceById } from "../data/sources.js";

// Tappable event summary. `reason` is an optional one-line "why you're seeing this".
export function EventCard(event, { reason } = {}) {
  const source = sourceById[event.source];
  return `
    <a class="card event-card" href="#/event/${event.id}">
      <h3>${event.title}</h3>
      <p>${event.when}</p>
      <p>${event.where}${event.onCampus ? "" : " · Community"}</p>
      <p class="event-card-meta">👥 ${event.going} going · via ${source.name}</p>
      ${reason ? `<p class="event-card-why">✨ ${reason}</p>` : ""}
    </a>
  `;
}
