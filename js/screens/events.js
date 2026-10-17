import { EventCard } from "../components/EventCard.js";
import { events } from "../data/mock.js";

export function EventsScreen() {
  return `
    <h1>All events</h1>
    <p class="muted">Everything Sisu found, unfiltered. ${events.length} events from campus and community sources.</p>
    ${events.map((e) => EventCard(e)).join("")}
  `;
}
