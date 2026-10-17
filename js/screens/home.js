import { Card } from "../components/Card.js";
import { events } from "../data/mock.js";
import { interests } from "../data/interests.js";
import { getProfile } from "../state.js";

// Events that match the student's quiz answers.
function pickedFor(profile) {
  return events.filter(
    (e) =>
      profile.interests.includes(e.category) &&
      (profile.location === "community" || e.onCampus)
  );
}

export function HomeScreen() {
  const profile = getProfile();

  if (profile.interests.length === 0) {
    return `
      <h1>Welcome to Sisu</h1>
      <p class="muted">Tell us what you're into and we'll suggest events for you.</p>
      <a href="#/quiz/interests" class="button">Take the quiz</a>
    `;
  }

  const labels = interests
    .filter((i) => profile.interests.includes(i.id))
    .map((i) => `<span class="chip">${i.emoji} ${i.label}</span>`)
    .join("");
  const picks = pickedFor(profile);

  return `
    <h1>Picked for you</h1>
    <div class="chips">${labels}</div>
    <p class="muted">${profile.location === "community" ? "On campus and around town" : "On campus"} ·
      <a href="#/quiz/interests">Edit</a></p>
    ${
      picks.length
        ? picks
            .map((e) =>
              Card({ title: e.title, body: `${e.when} · ${e.where}${e.onCampus ? "" : " · Community"}` })
            )
            .join("")
        : `<p class="muted">No matches yet. Try adding more interests.</p>`
    }
    <a href="#/events" class="button">Browse all events</a>
  `;
}
