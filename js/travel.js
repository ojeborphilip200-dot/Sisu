// Works out how a student could get from campus to an event, using the sample data in
// data/transit.js. Every warning here is shown to the student, never applied silently.
import { travelByTown } from "./data/transit.js";
import { campus, placeById, milesBetween } from "./data/places.js";

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function fmtTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export const fmtDuration = (mins) =>
  mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} hr${mins % 60 ? ` ${mins % 60} min` : ""}`;

export const distanceFromCampus = (event) => milesBetween(campus, event);

export const townName = (event) => (event.town === "campus" ? campus.name : placeById[event.town]?.name ?? event.town);

// Each option gets: leave (minutes after midnight), arrive, late (arrives after start),
// unavailable (reason string), and returnWarning (ends after the last trip back).
export function travelOptions(event, transport = "no-car") {
  const start = toMin(event.start);
  const end = toMin(event.end);

  return (travelByTown[event.town] || []).map((opt) => {
    const o = { ...opt };
    if (opt.needsCar && transport !== "car") o.unavailable = "Needs a car";

    if (opt.departures) {
      // Scheduled trips: latest departure that arrives by the start, otherwise the first one
      // that still gives at least an hour at the event.
      const trips = opt.departures.map(toMin).map((d) => ({ leave: d, arrive: d + opt.minutes }));
      const onTime = trips.filter((t) => t.arrive <= start).pop();
      const lateButUseful = trips.find((t) => t.arrive > start && t.arrive <= end - 60);
      const pick = onTime || lateButUseful;
      if (pick) Object.assign(o, pick, { late: !onTime });
      else o.unavailable = o.unavailable || "No trip arrives in time";
    } else {
      o.leave = start - opt.minutes - 10; // 10 minutes of buffer
      o.arrive = start - 10;
    }

    if (opt.lastBack && end > toMin(opt.lastBack)) {
      o.returnWarning = `Ends after the last ${opt.mode === "coach" ? "bus" : opt.label.toLowerCase()} back (${fmtTime(toMin(opt.lastBack))})`;
    }
    return o;
  });
}

const TRANSIT = ["walk", "shuttle", "bus", "coach"];

// Summary used by the ranking rules and event cards.
export function access(event, transport) {
  const opts = travelOptions(event, transport).filter((o) => !o.unavailable);
  const transit = opts.filter((o) => TRANSIT.includes(o.mode));
  // Lead with the cheapest realistic way: transit if there is one, otherwise the fastest option.
  const fastest = (transit.length ? transit : opts).slice().sort((a, b) => a.minutes - b.minutes)[0];
  return {
    options: opts,
    noTransit: transit.length === 0,
    lateReturnOnly: transit.length > 0 && transit.every((o) => o.returnWarning),
    lastBack: transit.find((o) => o.returnWarning)?.returnWarning,
    rideshare: opts.find((o) => o.mode === "rideshare"),
    summary: fastest ? `${fmtDuration(fastest.minutes)} by ${fastest.mode === "coach" ? "bus" : fastest.label.toLowerCase()}` : null,
  };
}
