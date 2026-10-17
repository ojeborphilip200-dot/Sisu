// Social goals, event plans, and the gamified progress built on top of them.
// Points and badges are derived from saved goals and check-ins, never stored separately.
import { getProfile, saveProfile } from "./state.js";
import { challengeById } from "./data/challenges.js";

const CHECK_IN_POINTS = 1; // Showing up counts.

export function addGoal(challengeId, eventId = null) {
  const { goals } = getProfile();
  if (goals.some((g) => g.challenge === challengeId && g.eventId === eventId && !g.done)) return;
  const goal = { id: `g${Date.now()}${Math.random().toString(36).slice(2, 6)}`, challenge: challengeId, eventId, done: false };
  saveProfile({ goals: [...goals, goal] });
}

export function setGoalDone(goalId, done) {
  const { goals } = getProfile();
  saveProfile({ goals: goals.map((g) => (g.id === goalId ? { ...g, done } : g)) });
}

export function deleteGoal(goalId) {
  const { goals } = getProfile();
  saveProfile({ goals: goals.filter((g) => g.id !== goalId) });
}

// "I'm going": records how confident the student feels and the goals they picked.
// travel: { mode, label, leave } chosen in the plan's "How will you get there?" step, or null.
export function planEvent(eventId, confidenceBefore, challengeIds, travel = null) {
  const { plans, goals } = getProfile();
  saveProfile({
    plans: { ...plans, [eventId]: { before: confidenceBefore, after: null, checkedIn: false, travel } },
    goals: goals.filter((g) => g.eventId !== eventId || g.done),
  });
  challengeIds.forEach((id) => addGoal(id, eventId));
}

export function cancelPlan(eventId) {
  const { plans, goals } = getProfile();
  const { [eventId]: _, ...rest } = plans;
  saveProfile({ plans: rest, goals: goals.filter((g) => g.eventId !== eventId) });
}

export function checkIn(eventId, doneGoalIds, confidenceAfter) {
  const { plans, goals } = getProfile();
  saveProfile({
    plans: { ...plans, [eventId]: { ...plans[eventId], after: confidenceAfter, checkedIn: true } },
    goals: goals.map((g) => (g.eventId === eventId ? { ...g, done: doneGoalIds.includes(g.id) } : g)),
  });
}

export function pointsFor(goal) {
  return challengeById[goal.challenge].level;
}

export function progress(profile = getProfile()) {
  const done = profile.goals.filter((g) => g.done);
  const checkIns = Object.values(profile.plans).filter((p) => p.checkedIn);
  const points = done.reduce((sum, g) => sum + pointsFor(g), 0) + checkIns.length * CHECK_IN_POINTS;
  const doneByLevel = [1, 2, 3].map((lvl) => done.filter((g) => challengeById[g.challenge].level === lvl).length);
  const grew = checkIns.some((p) => p.after > p.before);
  const has = (id) => done.some((g) => g.challenge === id);

  const badges = [
    { emoji: "👣", name: "First step", hint: "Check in after an event", earned: checkIns.length > 0 },
    { emoji: "👋", name: "Hello hero", hint: "Complete a Warm-up goal", earned: doneByLevel[0] > 0 },
    { emoji: "💬", name: "Conversation starter", hint: "Complete a Small talk goal", earned: doneByLevel[1] > 0 },
    { emoji: "☕", name: "Coffee courage", hint: "Ask someone to coffee", earned: has("coffee") },
    { emoji: "🤝", name: "Connector", hint: "Invite someone to an event", earned: has("invite") },
    { emoji: "🌱", name: "Growing", hint: "Feel more confident after an event than before", earned: grew },
  ];

  return { points, goalsDone: done.length, checkIns: checkIns.length, doneByLevel, badges };
}

export { CHECK_IN_POINTS };
