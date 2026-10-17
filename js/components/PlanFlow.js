// The two moments that bracket an event:
//   openPlanSheet:    "I'm going" → rate confidence → pick a social goal sized to that confidence
//   openCheckInSheet: afterwards → which goals did you try? → confidence now → celebrate effort
import { openSheet, setSheet, closeSheet } from "./Sheet.js";
import { ConfidenceScale, bindConfidenceScale } from "./ConfidenceScale.js";
import { challenges, challengeById, levels, confidenceScale, recommendedLevel } from "../data/challenges.js";
import { getProfile, saveProfile } from "../state.js";
import { planEvent, checkIn, pointsFor, CHECK_IN_POINTS } from "../social.js";
import { travelOptions, fmtTime, fmtDuration } from "../travel.js";
import { modeEmoji } from "../data/transit.js";

const faceFor = (v) => confidenceScale.find((c) => c.value === v);

export function openPlanSheet(event, onDone) {
  let confidence = null;
  const sheet = openSheet(`
    <h2>You're going to ${event.title}! 🎉</h2>
    <p class="muted">Quick check-in: how confident do you feel about going?</p>
    ${ConfidenceScale()}
    <p class="sheet-note">There's no wrong answer. This just helps us suggest the right-sized goal.</p>
    <button class="button sheet-primary" type="button" disabled>Next</button>
  `);
  const next = sheet.querySelector(".sheet-primary");
  bindConfidenceScale(sheet, (v) => {
    confidence = v;
    next.disabled = false;
  });
  next.addEventListener("click", () => showGoalPicker(sheet, event, confidence, onDone));
}

function showGoalPicker(sheet, event, confidence, onDone) {
  const rec = recommendedLevel(confidence);
  const recLevel = levels.find((l) => l.level === rec);
  const selected = new Set([challenges.find((c) => c.level === rec).id]);
  const encouragement =
    confidence <= 2
      ? "Feeling nervous is completely normal, and going anyway is brave. Let's keep it small."
      : confidence === 3
      ? "You've got this. Here's a goal to help you connect with someone."
      : "You're feeling good! Want to try something a little braver?";

  const tile = (c) => `
    <button type="button" class="goal-tile ${selected.has(c.id) ? "selected" : ""}" data-id="${c.id}" aria-pressed="${selected.has(c.id)}">
      <span>${c.emoji}</span><span>${c.title}</span><span class="pts">+${c.level}</span>
    </button>`;

  setSheet(sheet, `
    <h2>Pick a social goal</h2>
    <p class="muted">${encouragement}</p>
    <p class="rec-label">${recLevel.emoji} Suggested for you: <strong>${recLevel.name}</strong></p>
    <div class="goal-tiles">${challenges.filter((c) => c.level === rec).map(tile).join("")}</div>
    <details class="more-goals">
      <summary>See all goals</summary>
      <div class="goal-tiles">${challenges.filter((c) => c.level !== rec).map(tile).join("")}</div>
    </details>
    <button class="button sheet-primary" type="button">Save my plan</button>
    <button class="sheet-secondary" type="button" data-skip>Skip goals. Showing up is enough today.</button>
    <a class="text-link" href="#/coach?topic=nervous">💬 Talk it through with Sisu Coach first</a>
  `);

  sheet.querySelectorAll(".goal-tile").forEach((t) =>
    t.addEventListener("click", () => {
      selected.has(t.dataset.id) ? selected.delete(t.dataset.id) : selected.add(t.dataset.id);
      t.classList.toggle("selected", selected.has(t.dataset.id));
      t.setAttribute("aria-pressed", selected.has(t.dataset.id));
    })
  );

  const next = (ids) =>
    event.town === "campus" ? finish(sheet, event, confidence, ids, null, onDone) : showTravelPicker(sheet, event, confidence, ids, onDone);
  sheet.querySelector(".sheet-primary").addEventListener("click", () => next([...selected]));
  sheet.querySelector("[data-skip]").addEventListener("click", () => next([]));
}

// Off-campus events: "How will you get there?" using the same options as the Getting there panel.
function showTravelPicker(sheet, event, confidence, ids, onDone) {
  const profile = getProfile();
  const options = travelOptions(event, profile.area.transport).filter((o) => !o.unavailable);
  const choices = [
    ...options.map((o) => ({
      mode: o.mode,
      label: o.label,
      leave: o.leave ?? null,
      detail: `${fmtDuration(o.minutes)} · ${o.cost}${o.leave != null ? ` · ${o.departures ? "leaves" : "leave by"} ${fmtTime(o.leave)}` : ""}`,
      warn: o.returnWarning,
    })),
    ...(event.buddies
      ? [{ mode: "buddy", label: "With a ride buddy", leave: null, detail: `${event.buddies} students from campus are open to traveling together` }]
      : []),
  ];

  setSheet(sheet, `
    <h2>How will you get there?</h2>
    <p class="muted">Planning the trip ahead makes it a lot less stressful.</p>
    <div class="goal-tiles">${choices
      .map(
        (c, i) => `
      <button type="button" class="goal-tile trip-tile" data-i="${i}">
        <span>${modeEmoji[c.mode]}</span>
        <span><strong>${c.label}</strong><small>${c.detail}</small>${c.warn ? `<small class="trip-warn">⚠️ ${c.warn}</small>` : ""}</span>
      </button>`
      )
      .join("")}</div>
    <button type="button" class="sheet-secondary" data-unsure>Not sure yet</button>
    <a class="text-link" href="#/coach?topic=travel">💬 Help me plan the trip with Sisu Coach</a>
  `);

  sheet.querySelectorAll(".trip-tile").forEach((t) =>
    t.addEventListener("click", () => {
      const { mode, label, leave, warn } = choices[t.dataset.i];
      if (mode === "buddy") {
        // Opting in here is the same as the toggle on the event page, and it's a ladder goal.
        saveProfile({ rideBuddies: { ...getProfile().rideBuddies, [event.id]: true } });
        if (!ids.includes("travel-together")) ids = [...ids, "travel-together"];
      }
      finish(sheet, event, confidence, ids, { mode, label, leave, warn: warn || null }, onDone);
    })
  );
  sheet.querySelector("[data-unsure]").addEventListener("click", () => finish(sheet, event, confidence, ids, null, onDone));
}

function finish(sheet, event, confidence, ids, travel, onDone) {
  planEvent(event.id, confidence, ids, travel);
  const tips = ids.map((id) => challengeById[id]);
  setSheet(sheet, `
    <div class="celebrate">
      <div class="celebrate-emoji">📌</div>
      <h2>Plan saved!</h2>
      ${ids.length ? "" : `<p class="muted">Just going is a real step. We'll check in with you after.</p>`}
    </div>
    ${travel
      ? `<div class="tip-card trip-summary"><strong>${modeEmoji[travel.mode]} ${travel.label}${
          travel.leave != null ? ` · leave by ${fmtTime(travel.leave)}` : ""
        }</strong>${travel.warn ? `<p>⚠️ ${travel.warn}. Have a backup way home.</p>` : ""}</div>`
      : ""}
    ${ids.length ? `<p class="muted tips-label">${ids.length > 1 ? "Tips for your goals:" : "A tip for your goal:"}</p>` : ""}
    ${tips.map((c) => `<div class="tip-card"><strong>${c.emoji} ${c.title}</strong><p>${c.tip}</p></div>`).join("")}
    <p class="sheet-note">After the event, check in from your Goals tab to earn brave points.</p>
    <button class="button sheet-primary" type="button" data-close>Got it</button>
  `);
  onDone?.();
}

export function openCheckInSheet(event, onDone) {
  const profile = getProfile();
  const plan = profile.plans[event.id];
  const goals = profile.goals.filter((g) => g.eventId === event.id);
  const tried = new Set();
  let after = null;

  const sheet = openSheet(`
  <h2>How did ${event.title} go?</h2>
  ${
    goals.length
      ? `<p class="muted">Which goals did you try? Trying is what counts, not how it turned out.</p>
         <div class="goal-tiles">${goals
           .map((g) => {
             const c = challengeById[g.challenge];
             return `<button type="button" class="goal-tile" data-id="${g.id}" aria-pressed="false">
               <span>${c.emoji}</span><span>${c.title}</span><span class="pts">+${c.level}</span></button>`;
           })
           .join("")}</div>`
      : ""
  }
  <p class="muted">How confident do you feel now?</p>
  ${ConfidenceScale()}
  <button class="button sheet-primary" type="button" disabled>Save check-in</button>
  `);
  const save = sheet.querySelector(".sheet-primary");
  sheet.querySelectorAll(".goal-tile").forEach((t) =>
  t.addEventListener("click", () => {
    tried.has(t.dataset.id) ? tried.delete(t.dataset.id) : tried.add(t.dataset.id);
    t.classList.toggle("selected", tried.has(t.dataset.id));
    t.setAttribute("aria-pressed", tried.has(t.dataset.id));
  })
  );
  bindConfidenceScale(sheet, (v) => {
  after = v;
  save.disabled = false;
  });

  save.addEventListener("click", () => {
  checkIn(event.id, [...tried], after);
  const earned =
    CHECK_IN_POINTS + goals.filter((g) => tried.has(g.id)).reduce((s, g) => s + pointsFor(g), 0);
  const before = faceFor(plan.before);
  const now = faceFor(after);
  const grew = after > plan.before;
  const message = grew
    ? "Your confidence grew. That's what practice does. 🌱"
    : tried.size
    ? "You did something brave, even if it didn't feel easy. That counts."
    : "Showing up still counts. Some days that's the whole win.";
  setSheet(sheet, `
    <div class="celebrate">
      <div class="celebrate-emoji">${grew || tried.size ? "🎉" : "💛"}</div>
      <h2>+${earned} brave point${earned > 1 ? "s" : ""}</h2>
      <div class="conf-compare">
        <div><span>${before.emoji}</span><small>Before</small></div>
        <span class="arrow">→</span>
        <div><span>${now.emoji}</span><small>After</small></div>
      </div>
      <p>${message}</p>
    </div>
    ${
      !grew
        ? `<a class="text-link" href="#/coach?topic=rough">💬 Want to talk it through with Sisu Coach?</a>`
        : ""
    }
    <button class="button sheet-primary" type="button" data-close>Done</button>
  `);
  onDone?.();
  });
}

export { closeSheet };
