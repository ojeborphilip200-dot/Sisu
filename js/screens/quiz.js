// Two-step onboarding quiz shown after "Get started": interests, then location preference.
import { interests, locations } from "../data/interests.js";
import { getProfile, saveProfile } from "../state.js";

function QuizShell({ step, total, title, subtitle, body, backHref, nextLabel }) {
  return `
    <section class="quiz">
      <div class="quiz-top">
        <a href="${backHref}" class="quiz-back" aria-label="Back">←</a>
        <div class="quiz-progress" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="${total}">
          <span style="width:${(step / total) * 100}%"></span>
        </div>
        <span class="quiz-step">${step}/${total}</span>
      </div>
      <h1 class="quiz-title">${title}</h1>
      <p class="quiz-subtitle">${subtitle}</p>
      <div class="quiz-body">${body}</div>
      <button class="button quiz-next" type="button" disabled>${nextLabel}</button>
    </section>
  `;
}

function OptionTile({ id, emoji, label, hint, selected }) {
  return `
    <button type="button" class="option ${selected ? "selected" : ""}" data-id="${id}" aria-pressed="${selected}">
      <span class="option-emoji">${emoji}</span>
      <span class="option-text">
        <span class="option-label">${label}</span>
        ${hint ? `<span class="option-hint">${hint}</span>` : ""}
      </span>
      <span class="option-check" aria-hidden="true">✓</span>
    </button>
  `;
}

export function QuizInterestsScreen() {
  const { interests: chosen } = getProfile();
  return QuizShell({
    step: 1,
    total: 2,
    title: "Welcome! 👋<br />What are you into?",
    subtitle: "Pick as many as you like. We'll use these to suggest activities and events for you.",
    body: `<div class="option-grid">${interests
      .map((i) => OptionTile({ ...i, selected: chosen.includes(i.id) }))
      .join("")}</div>`,
    backHref: "#/",
    nextLabel: "Continue",
  });
}

QuizInterestsScreen.mount = (root) => {
  const next = root.querySelector(".quiz-next");
  const selected = new Set(getProfile().interests);
  next.disabled = selected.size === 0;

  root.querySelectorAll(".option").forEach((tile) => {
    tile.addEventListener("click", () => {
      const id = tile.dataset.id;
      selected.has(id) ? selected.delete(id) : selected.add(id);
      const on = selected.has(id);
      tile.classList.toggle("selected", on);
      tile.setAttribute("aria-pressed", on);
      next.disabled = selected.size === 0;
    });
  });

  next.addEventListener("click", () => {
    saveProfile({ interests: [...selected] });
    location.hash = "#/quiz/location";
  });
};

export function QuizLocationScreen() {
  const { location: chosen } = getProfile();
  return QuizShell({
    step: 2,
    total: 2,
    title: "Where do you want to explore?",
    subtitle: "You can change this anytime.",
    body: `<div class="option-list">${locations
      .map((l) => OptionTile({ ...l, selected: chosen === l.id }))
      .join("")}</div>`,
    backHref: "#/quiz/interests",
    nextLabel: "Show my events",
  });
}

QuizLocationScreen.mount = (root) => {
  const next = root.querySelector(".quiz-next");
  let choice = getProfile().location;
  next.disabled = !choice;

  root.querySelectorAll(".option").forEach((tile) => {
    tile.addEventListener("click", () => {
      choice = tile.dataset.id;
      root.querySelectorAll(".option").forEach((t) => {
        const on = t === tile;
        t.classList.toggle("selected", on);
        t.setAttribute("aria-pressed", on);
      });
      next.disabled = false;
    });
  });

  next.addEventListener("click", () => {
    saveProfile({ location: choice });
    location.hash = "#/home";
  });
};
