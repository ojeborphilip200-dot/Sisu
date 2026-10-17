// Fake events for the prototype. Replace or extend freely — there is no backend.
// `category` matches an id in interests.js; `source` matches an id in sources.js.
// `intlGoing` = how many of the people going are international students;
// `countries` = flag codes of a few of them (flag-icons codes).
export const events = [
  {
    id: "coffee-hour",
    title: "International Coffee Hour",
    category: "food",
    onCampus: true,
    when: "Fri, Oct 24 · 4:00–6:00 PM",
    where: "Campus Center, Room 375",
    description:
      "A relaxed weekly meetup with free coffee, tea and snacks from around the world. Drop in for ten minutes or stay the whole time. Volunteers help start conversations, so you don't need to come with friends.",
    going: 38, intlGoing: 27, countries: ["in", "cn", "ng", "br", "kr"],
    source: "intl-office", postingPath: "/news/coffee-hour",
    found: "Oct 13",
  },
  {
    id: "board-games",
    title: "Board Game Night",
    category: "gaming",
    onCampus: true,
    when: "Sat, Oct 25 · 7:00–10:00 PM",
    where: "Library, Group Study Room 2",
    description:
      "The Tabletop Club brings 40+ games, from quick party games to strategy classics. Rules are taught at the table, and beginners are paired with experienced players.",
    going: 21, intlGoing: 8, countries: ["jp", "de", "vn"],
    source: "student-orgs", postingPath: "/tabletop/game-night",
    found: "Oct 15",
  },
  {
    id: "soccer-pickup",
    title: "Intramural Soccer Pickup",
    category: "sports",
    onCampus: true,
    when: "Sun, Oct 26 · 2:00–4:00 PM",
    where: "West Field",
    description:
      "Casual mixed-level pickup soccer. Teams are picked on the spot, so come alone or with friends. Bring water and sneakers or cleats. Pinnies provided.",
    going: 26, intlGoing: 15, countries: ["mx", "gh", "fr", "co", "eg"],
    source: "campus-calendar", postingPath: "/intramurals/soccer-pickup",
    found: "Oct 12",
  },
  {
    id: "open-mic",
    title: "Open Mic Night",
    category: "music",
    onCampus: true,
    when: "Thu, Oct 23 · 8:00–10:30 PM",
    where: "Student Union Lounge",
    description:
      "Sing, play, read poetry, or just listen. Sign-up sheet opens at 7:30 PM. Performances in any language are encouraged, and there's a house guitar and keyboard.",
    going: 44, intlGoing: 12, countries: ["ph", "it", "ke"],
    source: "student-orgs", postingPath: "/music-collective/open-mic",
    found: "Oct 14",
  },
  {
    id: "watercolor",
    title: "Beginner Watercolor Workshop",
    category: "arts",
    onCampus: true,
    when: "Wed, Oct 22 · 6:00–7:30 PM",
    where: "Fine Arts Building, Studio 104",
    description:
      "A guided session for total beginners. All paints, brushes and paper are provided. Space is limited to 20, so RSVP through the original posting.",
    going: 17, intlGoing: 6, countries: ["kr", "tr", "np"],
    source: "campus-calendar", postingPath: "/arts/watercolor-workshop",
    found: "Oct 11",
  },
  {
    id: "hackathon",
    title: "Hackathon Kickoff Mixer",
    category: "gaming",
    onCampus: true,
    when: "Fri, Oct 24 · 6:00–8:00 PM",
    where: "Engineering Hall Atrium",
    description:
      "Meet potential teammates before this year's 24-hour hackathon. Pizza, team-matching games and short intros from mentors. No coding experience required to attend.",
    going: 52, intlGoing: 23, countries: ["in", "cn", "pk", "ng"],
    source: "campus-calendar", postingPath: "/engineering/hackathon-mixer",
    found: "Oct 10",
  },
  {
    id: "food-festival",
    title: "Downtown Food Festival",
    category: "food",
    onCampus: false,
    when: "Sat, Oct 25 · 12:00–6:00 PM",
    where: "Riverside Park, downtown",
    description:
      "Over 30 local food vendors, including many family-run spots serving dishes from around the world. Free entry, with live music on the main stage. About 15 minutes by city bus from campus.",
    going: 64, intlGoing: 19, countries: ["et", "th", "lb", "mx", "pe"],
    source: "city-calendar", postingPath: "/events/food-festival",
    found: "Oct 9",
  },
  {
    id: "fun-run",
    title: "Community 5K Fun Run",
    category: "sports",
    onCampus: false,
    when: "Sun, Oct 26 · 9:00–11:00 AM",
    where: "Riverside Trail, north entrance",
    description:
      "An untimed, all-paces 5K along the river. Walkers welcome. Registration is free for students with ID, and there's a post-race breakfast.",
    going: 33, intlGoing: 7, countries: ["ke", "gb", "es"],
    source: "parks-rec", postingPath: "/programs/fall-5k",
    found: "Oct 8",
  },
  {
    id: "jazz",
    title: "Live Jazz at the Café",
    category: "music",
    onCampus: false,
    when: "Fri, Oct 24 · 9:00–11:00 PM",
    where: "Corner Café, downtown",
    description:
      "A local trio plays standards and originals in a cozy café. No cover charge, and you only pay for what you order. A quieter option if loud parties aren't your thing.",
    going: 18, intlGoing: 4, countries: ["fr", "jp"],
    source: "arts-council", postingPath: "/events/cafe-jazz",
    found: "Oct 14",
  },
  {
    id: "gallery-walk",
    title: "Third Thursday Gallery Walk",
    category: "arts",
    onCampus: false,
    when: "Thu, Oct 23 · 5:00–8:00 PM",
    where: "Arts District galleries",
    description:
      "Galleries open their doors for a free evening walk with artist talks and light refreshments. Start at any gallery, and maps are handed out at each stop.",
    going: 29, intlGoing: 9, countries: ["it", "br", "cn"],
    source: "arts-council", postingPath: "/events/gallery-walk",
    found: "Oct 12",
  },
];

export const eventById = Object.fromEntries(events.map((e) => [e.id, e]));
