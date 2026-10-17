// Sisu Coach conversation script (prototype: scripted, not a live AI model).
//
// Style guide, drawn from counseling practice (e.g. motivational interviewing):
//   • Validate and normalize feelings before offering ideas.
//   • Ask open questions; let the student choose (autonomy).
//   • Suggest small, concrete steps; praise effort, not outcomes.
//   • Notice strengths. Never diagnose. Point to real people for serious concerns.
//
// Each node: { say: [lines], options: [{ label, next } | { label, goal }], input? }
//   - `goal: "<challenge id>"` adds that goal, then continues at "goal-added".
//   - `input: "practice"` means the next typed message is a role-play reply.
//   - A line can be a function (ctx) => string for dynamic text.
import { challengeById } from "../data/challenges.js";

const MAIN_MENU = [
  { label: "🎯 Set a social goal", next: "goal-1" },
  { label: "😬 I'm nervous about an event", next: "nervous-1" },
  { label: "😕 Something didn't go well", next: "rough-1" },
  { label: "🎭 Practice small talk", next: "practice-1" },
  { label: "💛 I'm feeling lonely", next: "lonely-1" },
];

const goalOption = (id) => ({ label: `➕ ${challengeById[id].title}`, goal: id });

export const nodes = {
  start: {
    say: [
      "Hi, I'm Sisu Coach 👋",
      "I'm here to help you set social goals, get ready for events, and talk through anything that feels hard. There are no wrong answers here.",
      "What would you like to do?",
    ],
    options: MAIN_MENU,
  },

  // ── Setting goals ───────────────────────────────────────────
  "goal-1": {
    say: ["Love that you're thinking about this. 💪", "Which of these feels closest to what you want right now?"],
    options: [
      { label: "Meet new people", next: "goal-meet" },
      { label: "Turn an acquaintance into a friend", next: "goal-deepen" },
      { label: "Feel less awkward in conversations", next: "goal-talk" },
      { label: "I'm not sure yet", next: "goal-unsure" },
    ],
  },
  "goal-meet": {
    say: [
      "Meeting new people is a great place to start.",
      "Let's keep the first step small enough that it feels doable, even on a low-energy day. Which of these sounds right?",
    ],
    options: [goalOption("say-hi"), goalOption("learn-name"), goalOption("show-up")],
  },
  "goal-deepen": {
    say: [
      "That's a big one, and it's how friendships actually form. Friendships usually grow through seeing the same people again and again.",
      "Which step feels doable this week?",
    ],
    options: [goalOption("invite"), goalOption("coffee"), goalOption("swap-contact")],
  },
  "goal-talk": {
    say: [
      "Lots of people feel awkward in conversations, even ones who look confident. It gets easier with practice.",
      "Pick one to practice this week:",
    ],
    options: [goalOption("small-talk"), goalOption("share-home"), goalOption("in-common")],
  },
  "goal-unsure": {
    say: [
      "That's okay. Not knowing is a normal place to start.",
      "On a scale of 1 to 5, how comfortable do you feel starting conversations with people you don't know?",
    ],
    options: [
      { label: "1–2 · Not very", next: "goal-meet" },
      { label: "3 · Somewhat", next: "goal-talk" },
      { label: "4–5 · Pretty comfortable", next: "goal-deepen" },
    ],
  },
  "goal-added": {
    say: [
      (ctx) => `Done! I added “${ctx.lastGoal.title}” to your Goals. ✅`,
      (ctx) => `Tip: ${ctx.lastGoal.tip}`,
      "Mark it as tried in your Goals tab, however it goes. Trying is the win.",
    ],
    options: [
      { label: "Set another goal", next: "goal-1" },
      { label: "Practice for it", next: "practice-1" },
      { label: "I'm good for now", next: "end" },
    ],
  },

  // ── Nervous before an event ─────────────────────────────────
  "nervous-1": {
    say: [
      "It makes complete sense to feel nervous. New places, new people, maybe a different language. Going anyway takes real courage.",
      "What worries you most?",
    ],
    options: [
      { label: "I won't know anyone", next: "nervous-alone" },
      { label: "My English isn't good enough", next: "nervous-language" },
      { label: "Awkward silences", next: "nervous-silence" },
      { label: "People won't be interested in me", next: "nervous-rejection" },
    ],
  },
  "nervous-alone": {
    say: [
      "A lot of people at events came alone too, even if it doesn't look like it.",
      "One trick: arrive early. It's easier to talk while the room is quiet, and early arrivals are often looking for someone to talk to.",
      "It can also help to plan your exit: “I'll stay 20 minutes, and then I'm allowed to leave.” Would a goal like that help?",
    ],
    options: [goalOption("show-up"), { label: "Give me some openers", next: "openers" }, { label: "Something else", next: "start" }],
  },
  "nervous-language": {
    say: [
      "Speaking a second language all day is tiring, and it's brave. Your accent isn't a problem. It's part of your story.",
      "Most people care far more about friendliness than perfect grammar. Questions are your friend, because they let the other person do most of the talking.",
      "Would some easy openers help?",
    ],
    options: [{ label: "Yes, show me openers", next: "openers" }, goalOption("small-talk"), { label: "Something else", next: "start" }],
  },
  "nervous-silence": {
    say: [
      "Silences feel much longer to us than to anyone else. Usually the other person is just thinking too.",
      "A good back-pocket move: comment on something you can both see. “Have you tried the food yet?” or “How did you hear about this?”",
    ],
    options: [{ label: "More openers please", next: "openers" }, { label: "Let's practice", next: "practice-1" }],
  },
  "nervous-rejection": {
    say: [
      "That fear is really common, and it shows how much you care about connecting.",
      "If a conversation doesn't click, it's usually about timing or energy, not about you. Not every chat needs to become a friendship. Each one is practice.",
      "What's one small thing that would make you feel proud after this event?",
    ],
    options: [goalOption("say-hi"), goalOption("learn-name"), { label: "I want to talk more about this", next: "listen-prompt" }],
  },
  openers: {
    say: [
      "Here are some openers that work almost anywhere:",
      "• “Hi, I'm ___. Is this your first time at one of these?”\n• “How do you know the people running this?”\n• “I'm from ___. Where are you from?”\n• “Have you tried the ___? Is it good?”",
      "Pick one and keep it in your back pocket. You only need the first sentence. The conversation takes it from there.",
    ],
    options: [{ label: "🎭 Practice one with me", next: "practice-1" }, { label: "🎯 Set a goal", next: "goal-1" }, { label: "Thanks!", next: "end" }],
  },

  // ── After a hard experience ─────────────────────────────────
  "rough-1": {
    say: [
      "Thank you for telling me. I'm sorry it didn't go the way you hoped.",
      "Do you want to tell me what happened? You can type it out, or pick whichever is closest.",
    ],
    options: [
      { label: "The conversation felt awkward", next: "rough-awkward" },
      { label: "I didn't talk to anyone", next: "rough-quiet" },
      { label: "Someone seemed uninterested", next: "rough-rejected" },
    ],
  },
  "rough-awkward": {
    say: [
      "Awkward moments happen to everyone, including people who seem really confident. The other person almost certainly remembers it less than you do.",
      "Can I point something out? You started a conversation. That's the hardest part, and you did it.",
      "What's one thing that went even a little bit okay?",
    ],
    options: [
      { label: "At least I said hi", next: "rough-strength" },
      { label: "I stayed the whole time", next: "rough-strength" },
      { label: "Honestly, nothing", next: "rough-nothing" },
    ],
  },
  "rough-quiet": {
    say: [
      "That's okay. Going at all was a step, and it counts.",
      "Sometimes we need a few visits to a new place before it feels safe enough to talk. That's normal, not a failure.",
      "Would a smaller goal for next time help?",
    ],
    options: [goalOption("learn-name"), goalOption("show-up"), { label: "Talk about what held me back", next: "nervous-1" }],
  },
  "rough-rejected": {
    say: [
      "Ouch. That can sting, especially when you're far from home.",
      "People seem uninterested for lots of reasons: they're tired, distracted, or shy themselves. It rarely means something is wrong with you.",
      "Who's someone, anywhere, who does enjoy talking with you?",
    ],
    options: [
      { label: "A friend from home", next: "rough-strength" },
      { label: "A classmate", next: "rough-strength" },
      { label: "No one right now", next: "lonely-1" },
    ],
  },
  "rough-strength": {
    say: [
      "That matters. 💛 It shows you already know how to connect. You've done it before, and you can do it again.",
      "Want to set a small goal for next time so you can build on that?",
    ],
    options: [{ label: "Yes, let's set one", next: "goal-1" }, { label: "Not right now", next: "end" }],
  },
  "rough-nothing": {
    say: [
      "That sounds really discouraging, and it's okay to feel that way.",
      "Even so: you went, you tried, and now you're reflecting on it. That takes more courage than you're giving yourself credit for.",
      "Would it help to plan a smaller, easier step for next time?",
    ],
    options: [{ label: "Yes, something small", next: "goal-meet" }, { label: "I just feel down", next: "lonely-1" }, { label: "Not right now", next: "end" }],
  },

  // ── Loneliness ──────────────────────────────────────────────
  "lonely-1": {
    say: [
      "I'm really glad you told me. Feeling lonely far from home is very common for international students. It doesn't mean anything is wrong with you.",
      "Can I ask, is it more that you miss people back home, or that you don't have your people here yet?",
    ],
    options: [
      { label: "I miss home", next: "lonely-home" },
      { label: "I don't have people here yet", next: "lonely-here" },
      { label: "Both", next: "lonely-here" },
    ],
  },
  "lonely-home": {
    say: [
      "Missing home shows how much those people mean to you. 💛",
      "Some students find it helps to keep a regular call with family, and to bring small pieces of home here, like cooking a familiar meal or finding students from the same region.",
      "A gentle event like International Coffee Hour can be a good place to meet people who understand. Want to make that a goal?",
    ],
    options: [goalOption("show-up"), { label: "I also want people here", next: "lonely-here" }, { label: "Maybe later", next: "end" }],
  },
  "lonely-here": {
    say: [
      "Building friendships in a new place takes time. Friendships usually grow from seeing the same people again and again, so going back to one regular activity often helps more than meeting lots of new people once.",
      "Is there a weekly club or event you could try a few times in a row?",
      "And if loneliness has felt heavy for a while, your campus counseling center is a great, confidential place to talk. Lots of students go, and that's exactly what it's there for.",
    ],
    options: [goalOption("show-up"), { label: "Help me turn someone into a friend", next: "goal-deepen" }, { label: "Thanks, that helps", next: "end" }],
  },

  // ── Small talk role-play ────────────────────────────────────
  "practice-1": {
    say: [
      "Let's practice! 🎭 I'll play someone you just met.",
      "Scene: You're at International Coffee Hour, by the snack table. The person next to you smiles at you.",
      "Type what you'd say to start the conversation.",
    ],
    input: "practice",
  },

  // ── Free text and safety ────────────────────────────────────
  "listen-prompt": {
    say: ["I'm listening. Take your time and type whatever's on your mind."],
  },
  listen: {
    say: [
      "Thank you for sharing that with me. It sounds like it really matters to you.",
      "I'm a simple demo coach, so I may not understand everything you write. Which of these is closest to what you'd like help with?",
    ],
    options: MAIN_MENU,
  },
  crisis: {
    say: [
      "I'm really glad you told me, and I'm concerned about you. You deserve support from a real person right now.",
      "📞 Call or text 988 (Suicide & Crisis Lifeline, US): free, confidential, 24/7\n🏥 Your campus counseling center\n🚨 If you're in immediate danger, call 911",
      "I'm a demo coach, so I can't give you the help you deserve, but these people can, and they want to hear from you.",
    ],
    options: [{ label: "Back to the menu", next: "start" }],
  },
  end: {
    say: ["Anytime. I'm proud of you for working on this. 🌱", "Come back whenever you want to plan, practice, or just talk something through."],
    options: [{ label: "Start over", next: "start" }, { label: "Go to my goals", href: "#/goals" }],
  },
};

// Role-play turns. Feedback praises what worked and offers one gentle tip.
export const practiceTurns = [
  (text) => [
    text.includes("?")
      ? "Nice, you asked a question! That's one of the easiest ways to start a conversation. 👏"
      : "Good start! Adding a question makes it easy for the other person to reply, like “…is this your first time here?”",
    "😊 Maya: “Hi! I'm Maya. Yeah, it's my first time too. I'm from Kenya, studying biology. What about you?”",
    "Your turn: answer, and try asking something back.",
  ],
  (text) => [
    text.includes("?")
      ? "Great, you shared something and asked back. That back-and-forth is exactly what small talk is."
      : "Nice sharing! Next time, try ending with a question back, like “What made you pick biology?”",
    "😊 Maya: “Oh cool! I'm hoping to come every week. Maybe I'll see you at the next one?”",
    "🎉 You just practiced a whole small-talk loop: open → share → ask back.",
  ],
];
export const practiceDone = {
  say: ["Want to turn this into a real goal for your next event?"],
  options: [goalOption("small-talk"), { label: "Practice again", next: "practice-1" }, { label: "Done for now", next: "end" }],
};

// Free-text routing. Safety is checked first, always.
const CRISIS = /suicid|kill myself|end my life|want to die|self[- ]?harm|hurt myself|don'?t want to (live|be here)/i;
const TOPICS = [
  [/lonely|alone|homesick|miss (home|my family)|no friends/i, "lonely-1"],
  [/nervous|scared|anxious|afraid|worried|shy/i, "nervous-1"],
  [/english|language|accent/i, "nervous-language"],
  [/awkward|went (badly|wrong)|rejected|ignored|embarrass/i, "rough-1"],
  [/goal/i, "goal-1"],
  [/practice|small talk|what (do|should) i say/i, "practice-1"],
];

export function routeFreeText(text) {
  if (CRISIS.test(text)) return "crisis";
  return TOPICS.find(([re]) => re.test(text))?.[1] || "listen";
}

// Entry points from elsewhere in the app, e.g. #/coach?topic=nervous
export const TOPIC_START = { nervous: "nervous-1", rough: "rough-1", goal: "goal-1", lonely: "lonely-1", practice: "practice-1" };
