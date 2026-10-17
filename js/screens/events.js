import { Card } from "../components/Card.js";
import { events } from "../data/mock.js";

export function EventsScreen() {
  return `
    <h1>Events</h1>
    ${events.map((e) => Card({ title: e.title, body: `${e.when} · ${e.where}` })).join("")}
  `;
}
