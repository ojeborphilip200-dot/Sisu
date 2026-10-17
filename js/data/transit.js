// SAMPLE travel info from campus to each town. Route names, times, and prices are made up for
// the prototype and must not be read as real schedules. In the full app these would come from
// transit agencies' published schedule data and rideshare estimates, with sources shown.
//
// mode: walk | shuttle | bus | coach | rideshare | drive
// minutes: one-way travel time; departures: fixed departure times (24h) for scheduled trips;
// lastBack: last trip back to campus (24h); needsCar: only an option with a car.
export const travelByTown = {
  campus: [{ mode: "walk", label: "Walk", minutes: 8, cost: "Free" }],
  oneonta: [
    { mode: "walk", label: "Walk", minutes: 30, cost: "Free" },
    { mode: "bus", label: "Town bus · Route 2", minutes: 12, cost: "$1", every: 30, lastBack: "22:15" },
    { mode: "rideshare", label: "Rideshare", minutes: 8, cost: "~$9–14 estimate" },
    { mode: "drive", label: "Drive", minutes: 7, cost: "Parking free", needsCar: true },
  ],
  albany: [
    { mode: "coach", label: "Intercity bus", minutes: 100, cost: "~$25 each way", departures: ["07:15", "10:30", "13:30", "16:45"], lastBack: "18:30" },
    { mode: "rideshare", label: "Rideshare", minutes: 80, cost: "~$110–150 estimate" },
    { mode: "drive", label: "Drive", minutes: 80, cost: "Gas + parking", needsCar: true },
  ],
  cooperstown: [
    { mode: "rideshare", label: "Rideshare", minutes: 35, cost: "~$45–60 estimate" },
    { mode: "drive", label: "Drive", minutes: 35, cost: "Parking ~$10", needsCar: true },
  ],
  binghamton: [
    { mode: "coach", label: "Intercity bus", minutes: 75, cost: "~$20 each way", departures: ["08:00", "14:15"], lastBack: "19:00" },
    { mode: "drive", label: "Drive", minutes: 60, cost: "Gas + parking", needsCar: true },
  ],
};

export const modeEmoji = { walk: "🚶", shuttle: "🚐", bus: "🚌", coach: "🚍", rideshare: "🚕", drive: "🚗", buddy: "🤝" };

// Shown on the Sources tab and in each "Getting there" panel.
export const travelSources = [
  { id: "local-transit", name: "Town bus schedule", kind: "Local transit timetable (sample)", url: "https://transit.example.org", lastScanned: "3 hours ago", modes: ["bus", "shuttle"] },
  { id: "intercity", name: "Intercity bus timetable", kind: "Regional coach schedules (sample)", url: "https://coach.example.com", lastScanned: "1 day ago", modes: ["coach"] },
  { id: "rideshare-est", name: "Rideshare estimates", kind: "Typical price ranges, not quotes (sample)", url: null, lastScanned: "1 day ago", modes: ["rideshare"] },
];
