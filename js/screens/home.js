import { EventCard } from "../components/EventCard.js";
import { events, eventById } from "../data/mock.js";
import { interests } from "../data/interests.js";
import { getProfile } from "../state.js";
import { pickedFor } from "../curation.js";
import { describeArea } from "../data/places.js";

// Top-of-feed nudge toward real-world connection: check in on a past plan, or try the coach.
function Nudge(profile) {
  const pending = Object.entries(profile.plans).find(([, p]) => !p.checkedIn);
  if (pending) {
    const event = eventById[pending[0]];
    return `<a class="card nudge" href="#/goals">
      <p class="nudge-label">Your plan</p>
      <h3>🙋 ${event.title}</h3>
      <p>Been yet? Check in to see how your confidence is growing and earn brave points.</p>
    </a>`;
  }
  return `<a class="card nudge" href="#/coach?topic=goal">
    <p class="nudge-label">This week</p>
    <h3>🎯 Set a small social goal</h3>
    <p>Sisu Coach can help you pick one that feels doable.</p>
  </a>`;
}

// One-line "why" for a feed card: the strongest reason (a "see more" request beats an interest match),
// plus a count of the rest. The event page lists them all.
function summarize(reasons) {
  const ups = reasons.filter((r) => r.effect === "up");
  const top = ups.find((r) => r.text.startsWith("You asked")) || ups[0];
  const rest = ups.length - 1;
  return rest > 0 ? `${top.text} · +${rest} more reason${rest > 1 ? "s" : ""}` : top.text;
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
  const picks = pickedFor(events, profile);

  return `
    <h1>Picked for you</h1>
    <div class="chips">${labels}</div>
    <p class="muted">📍 ${describeArea(profile.area)}${profile.area.transport === "car" ? " · 🚗" : " · 🚶 no car"} ·
      <a href="#/profile">Edit</a></p>
    ${Nudge(profile)}
    <p class="feed-explainer">✨ Sisu AI found these on campus and community calendars and ranked them by
      your interests. Tap any event to see exactly why it's here. <a href="#/sources">Sources</a></p>
    ${
      picks.length
        ? picks.map((p) => EventCard(p.event, { reason: summarize(p.reasons), transport: profile.area.transport })).join("")
        : `<p class="muted">No matches yet. Try adding more interests.</p>`
    }
    <a href="#/events" class="button">Browse all events</a>
  `;
}
