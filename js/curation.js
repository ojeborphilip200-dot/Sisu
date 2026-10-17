// The "algorithm": simple, readable rules that decide what a student sees and why.
// Every rule that affects an event adds a plain-language reason, so the app can show its work.
import { interests } from "./data/interests.js";
import { sourceById } from "./data/sources.js";
import { placeById, fmtMiles, DEFAULT_AREA } from "./data/places.js";
import { access, distanceFromCampus, townName } from "./travel.js";

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

  // Location: inside the home-base radius, or in a saved place.
  const area = { ...DEFAULT_AREA, ...profile.area };
  const miles = distanceFromCampus(event);
  if (event.town === "campus") {
    score += 1;
    reasons.push({ effect: "up", text: "It's on campus" });
  } else if (miles <= area.radius) {
    score += 1;
    reasons.push({ effect: "up", text: `It's ${fmtMiles(miles)} from campus, within your ${area.radius} mi range` });
  } else if (area.places.includes(event.town)) {
    score += 1;
    reasons.push({ effect: "up", text: `It's in ${townName(event)}, one of your saved places` });
  } else {
    include = false;
    const hint = placeById[event.town] ? ` Add ${townName(event)} as a saved place to see events there.` : "";
    reasons.push({ effect: "block", text: `It's ${fmtMiles(miles)} away, outside your ${area.radius} mi range.${hint}` });
  }

  // Getting there without a car: flagged and ranked lower, never hidden.
  if (area.transport !== "car" && event.town !== "campus") {
    const a = access(event, area.transport);
    if (a.noTransit) {
      score -= 1;
      reasons.push({
        effect: "down",
        text: `No bus goes there, so you'd need a ride${a.rideshare ? ` (rideshare ${a.rideshare.cost})` : ""} or a ride buddy`,
      });
    } else if (a.lateReturnOnly) {
      score -= 1;
      reasons.push({ effect: "down", text: `${a.lastBack}, so plan another way home` });
    }
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
