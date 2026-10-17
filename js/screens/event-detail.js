import { eventById } from "../data/mock.js";
import { sourceById } from "../data/sources.js";
import { interests } from "../data/interests.js";
import { getProfile, saveProfile } from "../state.js";
import { explain } from "../curation.js";
import { SourcePrefButtons, bindSourcePrefButtons } from "../components/SourcePrefButtons.js";
import { openPlanSheet, openCheckInSheet } from "../components/PlanFlow.js";
import { challengeById, confidenceScale } from "../data/challenges.js";
import { cancelPlan } from "../social.js";
import { GettingThere } from "../components/GettingThere.js";
import { modeEmoji } from "../data/transit.js";
import { fmtTime } from "../travel.js";
import { NotFoundScreen } from "./not-found.js";

// "I'm going" area: the call to action, or the student's plan once they've committed.
function PlanBox(event, profile) {
  const plan = profile.plans[event.id];
  if (!plan) {
    return `
      <div class="plan-box">
        <button type="button" class="button plan-go" data-action="go">🙋 I'm going</button>
        <p class="sheet-note">We'll help you set a small social goal for it.</p>
      </div>`;
  }
  const goals = profile.goals.filter((g) => g.eventId === event.id);
  const face = (v) => confidenceScale.find((c) => c.value === v).emoji;
  return `
    <div class="plan-box planned">
      <p><strong>✅ You're going</strong> · confidence ${face(plan.before)}${plan.checkedIn ? ` → ${face(plan.after)}` : ""}</p>
      ${plan.travel
        ? `<p>${modeEmoji[plan.travel.mode]} ${plan.travel.label}${plan.travel.leave != null ? ` · leave by ${fmtTime(plan.travel.leave)}` : ""}</p>`
        : ""}
      ${goals.length
        ? `<ul class="plan-goals">${goals
            .map((g) => `<li>${g.done ? "☑️" : "⬜️"} ${challengeById[g.challenge].title}</li>`)
            .join("")}</ul>`
        : `<p class="muted">No goal this time. Showing up counts.</p>`}
      ${plan.checkedIn
        ? `<p class="muted">Checked in. Nice work! 🎉</p>`
        : `<div class="plan-actions">
             <button type="button" class="button" data-action="checkin">How did it go?</button>
             <button type="button" class="sheet-secondary" data-action="cancel">Not going anymore</button>
           </div>`}
    </div>`;
}

const ICONS = { up: "✅", down: "⚠️", block: "🚫" };

export function EventDetailScreen({ id }) {
  const event = eventById[id];
  if (!event) return NotFoundScreen();

  const source = sourceById[event.source];
  const interest = interests.find((i) => i.id === event.category);
  const profile = getProfile();
  const { include, reasons } = explain(event, profile);
  const pref = profile.sourcePrefs[event.source];
  const flags = event.countries.map((c) => `<span class="flag-dot"><span class="fi fi-${c} fis"></span></span>`).join("");
  const others = event.intlGoing - event.countries.length;

  return `
    <article class="event-detail">
      <a href="#/home" class="back-link">← Back</a>

      <span class="chip">${interest.emoji} ${interest.label}</span>
      <h1>${event.title}</h1>

      <ul class="event-facts">
        <li><span>🗓️</span><span>${event.when}</span></li>
        <li><span>📍</span><span>${event.where} · ${event.onCampus ? "On campus" : "In the community"}</span></li>
        <li><span>👥</span><span><strong>${event.going} going</strong>, including ${event.intlGoing} international students</span></li>
      </ul>

      <div class="going-flags">
        <div class="flag-stack">${flags}</div>
        ${others > 0 ? `<span class="muted">+${others} more international students</span>` : ""}
      </div>

      ${PlanBox(event, profile)}

      ${GettingThere(event, profile)}

      <h2>About</h2>
      <p>${event.description}</p>
      <p class="ai-note">🤖 Summarized by Sisu AI from the original posting. Details can change, so check the original before you go.</p>
      <a class="button" href="${source.url}${event.postingPath}" target="_blank" rel="noopener">View original posting ↗</a>

      <section class="panel">
        <h2>Why you're seeing this</h2>
        ${
          profile.interests.length
            ? `<p class="muted">${
                include
                  ? "This event is in your Picked for you feed because:"
                  : "This event is <strong>not</strong> in your Picked for you feed. Here's how it scored:"
              }</p>
              <ul class="reasons">
                ${reasons.map((r) => `<li class="reason-${r.effect}"><span>${ICONS[r.effect]}</span><span>${r.text}</span></li>`).join("")}
              </ul>
              <a href="#/quiz/interests" class="text-link">Change my interests</a>`
            : `<p class="muted">You haven't told us your interests yet, so this isn't personalized.</p>
               <a href="#/quiz/interests" class="text-link">Take the quiz</a>`
        }
      </section>

      <section class="panel">
        <h2>Where this came from</h2>
        <div class="source-row">
          <div>
            <strong>${source.name}</strong>
            <p class="muted">${source.kind}</p>
          </div>
        </div>
        <ul class="provenance">
          <li>Found by Sisu AI on ${event.found}</li>
          <li>${source.method}</li>
          <li>Source last checked ${source.lastScanned}</li>
        </ul>
        <p class="muted">${
          pref === "more"
            ? `You're seeing <strong>more</strong> from this source.`
            : pref === "less"
            ? `You're seeing <strong>less</strong> from this source. Its events are hidden from Picked for you.`
            : "Want this source to show up more or less in your feed?"
        }</p>
        ${SourcePrefButtons(source.id)}
        <a href="#/sources" class="text-link">See all sources Sisu checks</a>
      </section>
    </article>
  `;
}

EventDetailScreen.mount = (root, params) => {
  // Go back to wherever the student came from (feed, all events, sources); fall back to home.
  root.querySelector(".back-link")?.addEventListener("click", (e) => {
    if (history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
  const rerender = () => {
    root.innerHTML = EventDetailScreen(params);
    EventDetailScreen.mount(root, params);
  };
  bindSourcePrefButtons(root, rerender);

  const event = eventById[params.id];
  root.querySelector('[data-action="go"]')?.addEventListener("click", () => openPlanSheet(event, rerender));
  root.querySelector('[data-action="checkin"]')?.addEventListener("click", () => openCheckInSheet(event, rerender));
  root.querySelector("[data-buddy]")?.addEventListener("click", () => {
    const rideBuddies = { ...getProfile().rideBuddies };
    if (rideBuddies[event.id]) delete rideBuddies[event.id];
    else rideBuddies[event.id] = true;
    saveProfile({ rideBuddies });
    rerender();
  });
  root.querySelector('[data-action="cancel"]')?.addEventListener("click", () => {
    cancelPlan(event.id);
    rerender();
  });
};
