import { Card } from "../components/Card.js";

export function HomeScreen() {
  return `
    <h1>Welcome to Sisu</h1>
    <p class="muted">Find your people, one small step at a time.</p>
    ${Card({ title: "Placeholder", body: "Build the home screen here." })}
    <a href="#/events" class="button">Browse events</a>
  `;
}
