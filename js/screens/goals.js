// Goals tab: the gamified side of Sisu, aimed at real-world connection rather than screen time.
import { levels, challenges, challengeById, confidenceScale } from "../data/challenges.js";
import { eventById } from "../data/mock.js";
import { getProfile } from "../state.js";
import { progress, setGoalDone, addGoal } from "../social.js";
import { openCheckInSheet } from "../components/PlanFlow.js";

const face = (v) => confidenceScale.find((c) => c.value === v).emoji;

function GoalRow(g) {
  const c = challengeById[g.challenge];
  return `
    <li class="goal-row ${g.done ? "done" : ""}">
      <button type="button" class="goal-check" data-goal="${g.id}" aria-pressed="${g.done}"
        aria-label="${g.done ? "Mark not done" : "Mark done"}">${g.done ? "✓" : ""}</button>
      <span class="goal-text">${c.emoji} ${c.title}</span>
      <span class="pts">+${c.level}</span>
    </li>`;
}

function PlanCard(eventId, plan, goals) {
  const event = eventById[eventId];
  return `
    <div class="card plan-card">
      <a href="#/event/${event.id}"><h3>${event.title}</h3></a>
      <p>${event.when}</p>
      <p class="event-card-meta">Confidence ${face(plan.before)}${plan.checkedIn ? ` → ${face(plan.after)}` : " before"}</p>
      ${goals.length ? `<ul class="goal-list">${goals.map(GoalRow).join("")}</ul>` : ""}
      ${plan.checkedIn
        ? ""
        : `<button type="button" class="button small" data-checkin="${event.id}">How did it go?</button>`}
    </div>`;
}

export function GoalsScreen() {
  const profile = getProfile();
  const p = progress(profile);
  const planEntries = Object.entries(profile.plans);
  const upcoming = planEntries.filter(([, plan]) => !plan.checkedIn);
  const past = planEntries.filter(([, plan]) => plan.checkedIn);
  const personal = profile.goals.filter((g) => !g.eventId);
  const goalsFor = (id) => profile.goals.filter((g) => g.eventId === id);
  // A gentle nudge: the first ladder goal they haven't done or planned yet.
  const used = new Set(profile.goals.map((g) => g.challenge));
  const nextUp = challenges.find((c) => !used.has(c.id));

  return `
    <h1>Your goals</h1>
    <p class="muted">Small, brave steps toward real-life friendships. Trying is what earns points, not how it turns out.</p>

    <div class="stats">
      <div><strong>${p.points}</strong><span>Brave points</span></div>
      <div><strong>${p.goalsDone}</strong><span>Goals tried</span></div>
      <div><strong>${p.checkIns}</strong><span>Events checked in</span></div>
    </div>

    <a href="#/coach" class="coach-cta">
      <span class="coach-avatar">🌱</span>
      <span><strong>Talk to Sisu Coach</strong><br /><small>Set a goal, prepare for an event, or talk something through</small></span>
    </a>

    <h2>Social ladder</h2>
    <div class="ladder">
      ${levels
        .slice()
        .reverse()
        .map(
          (l) => `
        <div class="rung ${p.doneByLevel[l.level - 1] ? "reached" : ""}">
          <span class="rung-emoji">${l.emoji}</span>
          <span class="rung-text"><strong>${l.name}</strong><small>${l.blurb}</small></span>
          <span class="rung-count">${p.doneByLevel[l.level - 1]} done</span>
        </div>`
        )
        .join("")}
    </div>

    ${nextUp
      ? `<div class="card nudge">
          <p class="nudge-label">Try next</p>
          <h3>${nextUp.emoji} ${nextUp.title}</h3>
          <p>${nextUp.tip}</p>
          <button type="button" class="button small" data-add="${nextUp.id}">Add to my goals</button>
        </div>`
      : ""}

    <h2>Upcoming</h2>
    ${upcoming.length
      ? upcoming.map(([id, plan]) => PlanCard(id, plan, goalsFor(id))).join("")
      : `<p class="muted">No plans yet. Tap <strong>I'm going</strong> on any event. <a href="#/home">Find events</a></p>`}

    ${personal.length
      ? `<h2>Personal goals</h2><ul class="goal-list card">${personal.map(GoalRow).join("")}</ul>`
      : ""}

    ${past.length ? `<h2>Past events</h2>${past.map(([id, plan]) => PlanCard(id, plan, goalsFor(id))).join("")}` : ""}

    <h2>Badges</h2>
    <div class="badges">
      ${p.badges
        .map(
          (b) => `
        <div class="badge ${b.earned ? "earned" : ""}" title="${b.hint}">
          <span>${b.emoji}</span><strong>${b.name}</strong><small>${b.earned ? "Earned!" : b.hint}</small>
        </div>`
        )
        .join("")}
    </div>
  `;
}

GoalsScreen.mount = (root) => {
  const rerender = () => {
    root.innerHTML = GoalsScreen();
    GoalsScreen.mount(root);
  };
  root.querySelectorAll("[data-goal]").forEach((b) =>
    b.addEventListener("click", () => {
      setGoalDone(b.dataset.goal, b.getAttribute("aria-pressed") !== "true");
      rerender();
    })
  );
  root.querySelectorAll("[data-checkin]").forEach((b) =>
    b.addEventListener("click", () => openCheckInSheet(eventById[b.dataset.checkin], rerender))
  );
  root.querySelector("[data-add]")?.addEventListener("click", (e) => {
    addGoal(e.currentTarget.dataset.add);
    rerender();
  });
};
