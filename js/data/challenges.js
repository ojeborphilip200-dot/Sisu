// The social ladder: small, concrete social goals ordered from gentle to brave.
// `points` = brave points earned for trying it (trying counts, however it goes).
export const levels = [
  { level: 1, name: "Warm-up", emoji: "🌱", blurb: "Just being there" },
  { level: 2, name: "Small talk", emoji: "💬", blurb: "Getting a conversation going" },
  { level: 3, name: "Brave", emoji: "🦁", blurb: "Turning acquaintances into friends" },
];

export const challenges = [
  { id: "show-up", level: 1, emoji: "🚪", title: "Go and stay for 20 minutes",
    tip: "Give yourself permission to leave after 20 minutes. Most people end up staying longer." },
  { id: "say-hi", level: 1, emoji: "👋", title: "Say hi to one new person",
    tip: "A smile and “Hi, I'm ___” is all it takes. You don't need a plan for what comes next." },
  { id: "learn-name", level: 1, emoji: "🏷️", title: "Learn one person's name",
    tip: "Repeat it back (“Nice to meet you, Maya”). It helps you remember and makes people feel seen." },
  { id: "small-talk", level: 2, emoji: "💬", title: "Ask someone a question about themselves",
    tip: "Try “How did you hear about this?” or “What are you studying?” Questions let the other person do the talking." },
  { id: "share-home", level: 2, emoji: "🌍", title: "Share something about your home country",
    tip: "A favorite food or festival from home is an easy, interesting thing to share." },
  { id: "in-common", level: 2, emoji: "🔗", title: "Find something you have in common",
    tip: "Classes, music, shows, food, being new here. Shared things turn small talk into real talk." },
  { id: "invite", level: 3, emoji: "📨", title: "Invite someone you met to another event",
    tip: "“I'm going to ___ on Friday. Want to come?” Low pressure, and you both get a familiar face there." },
  { id: "coffee", level: 3, emoji: "☕", title: "Ask someone to get coffee after",
    tip: "“I'm grabbing coffee after this. Want to come?” If they can't, that's okay. Asking is the win." },
  { id: "swap-contact", level: 3, emoji: "📱", title: "Swap contact info with someone",
    tip: "“Can I get your Instagram/number so we can find each other at the next one?”" },
];

export const challengeById = Object.fromEntries(challenges.map((c) => [c.id, c]));

// Confidence is rated 1–5 before and after events.
export const confidenceScale = [
  { value: 1, emoji: "😰", label: "Very nervous" },
  { value: 2, emoji: "😟", label: "Nervous" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Pretty good" },
  { value: 5, emoji: "😄", label: "Excited" },
];

// Suggest goals that stretch a little but don't overwhelm.
export function recommendedLevel(confidence) {
  if (confidence <= 2) return 1;
  if (confidence === 3) return 2;
  return 3;
}
