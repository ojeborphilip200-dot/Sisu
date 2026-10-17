import { confidenceScale } from "../data/challenges.js";

// Five-face 1–5 rating. Read the choice with root.querySelector(".conf-btn.selected").
export function ConfidenceScale(selected = null) {
  return `
    <div class="conf-scale" role="radiogroup">
      ${confidenceScale
        .map(
          (c) => `
        <button type="button" class="conf-btn ${selected === c.value ? "selected" : ""}" data-value="${c.value}"
          role="radio" aria-checked="${selected === c.value}" aria-label="${c.label}">
          <span class="conf-emoji">${c.emoji}</span>
          <span class="conf-label">${c.label}</span>
        </button>`
        )
        .join("")}
    </div>
  `;
}

export function bindConfidenceScale(root, onChange) {
  root.querySelectorAll(".conf-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      root.querySelectorAll(".conf-btn").forEach((b) => {
        b.classList.toggle("selected", b === btn);
        b.setAttribute("aria-checked", b === btn);
      });
      onChange(Number(btn.dataset.value));
    })
  );
}
