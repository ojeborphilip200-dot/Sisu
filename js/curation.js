// The "algorithm": simple, readable rules that decide what a student sees and why.
// Every rule that affects an event adds a plain-language reason, so the app can show its work.
import { interests } from "./data/interests.js";
import { sourceById } from "./data/sources.js";

const interestById = Object.fromEntries(interests.map((i) => [i.id, i]));

// Returns { score, include, reasons[] }. Each reason: { effect: "up" | "down" | "block", text }.
export function explain(event, profile) {
  const reasons = [];
  let score = 0;
  let include = true;
  const interest = interestById[event.category];
  const source = sourceById[event.source];

  if (profile.interests.includes(event.category)) {
    score += 3;
    reasons.push({ effect: "up", text: `You picked ${interest.emoji} ${interest.label} in your interests` });
  } else {
    include = false;
    reasons.push({ effect: "block", text: `${interest.label} isn't one of your interests` });
  }

  if (event.onCampus) {
    score += 1;
    reasons.push({ effect: "up", text: "It's on campus" });
  } else if (profile.location === "community") {
    score += 1;
    reasons.push({ effect: "up", text: "It's in the community, and you opted in to exploring off campus" });
  } else {
    include = false;
    reasons.push({ effect: "block", text: "It's off campus, and you chose on-campus events only" });
  }

  const intlShare = event.intlGoing / event.going;
  if (intlShare >= 0.4) {
    score += 1;
    reasons.push({
      effect: "up",
      text: `Popular with international students: ${event.intlGoing} of ${event.going} going`,
    });
  }

  const pref = profile.sourcePrefs[event.source];
  if (pref === "more") {
    score += 2;
    reasons.push({ effect: "up", text: `You asked to see more from ${source.name}` });
  } else if (pref === "less") {
    include = false;
    reasons.push({ effect: "block", text: `You asked to see less from ${source.name}` });
  }

  return { score, include, reasons };
}

// Events for the "Picked for you" feed, best matches first.
export function pickedFor(events, profile) {
  return events
    .map((event) => ({ event, ...explain(event, profile) }))
    .filter((r) => r.include)
    .sort((a, b) => b.score - a.score);
}
