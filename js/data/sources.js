// Places the (simulated) Sisu AI scans for events. All names and URLs are fictional samples
// for the prototype; example.edu / example.org are reserved demo domains.
export const sources = [
  {
    id: "campus-calendar",
    name: "Campus Events Calendar",
    kind: "Official university calendar",
    scope: "campus",
    url: "https://events.example.edu",
    method: "Reads the public calendar feed",
    lastScanned: "2 hours ago",
  },
  {
    id: "intl-office",
    name: "International Student Services",
    kind: "Campus office newsletter",
    scope: "campus",
    url: "https://iss.example.edu",
    method: "Reads the weekly newsletter page",
    lastScanned: "1 day ago",
  },
  {
    id: "student-orgs",
    name: "Student Org Pages",
    kind: "Club websites & posted flyers",
    scope: "campus",
    url: "https://clubs.example.edu",
    method: "Reads club event pages and flyer text",
    lastScanned: "5 hours ago",
  },
  {
    id: "city-calendar",
    name: "City Community Calendar",
    kind: "Municipal events listing",
    scope: "community",
    url: "https://calendar.example.org",
    method: "Reads the public calendar feed",
    lastScanned: "3 hours ago",
  },
  {
    id: "arts-council",
    name: "Regional Arts Council",
    kind: "Nonprofit arts listings",
    scope: "community",
    url: "https://arts.example.org",
    method: "Reads the public events page",
    lastScanned: "1 day ago",
  },
  {
    id: "parks-rec",
    name: "Parks & Recreation",
    kind: "City programs & races",
    scope: "community",
    url: "https://parks.example.org",
    method: "Reads the programs listing",
    lastScanned: "6 hours ago",
  },
];

export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));
