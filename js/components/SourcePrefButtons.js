// "See more / See less" controls for a source. Wire up with bindSourcePrefButtons().
import { getProfile, toggleSourcePref } from "../state.js";

export function SourcePrefButtons(sourceId) {
  const pref = getProfile().sourcePrefs[sourceId];
  const btn = (value, label) =>
    `<button type="button" class="pref-btn ${pref === value ? "active" : ""}"
       data-source="${sourceId}" data-pref="${value}" aria-pressed="${pref === value}">${label}</button>`;
  return `<div class="pref-btns">${btn("more", "👍 See more")}${btn("less", "👎 See less")}</div>`;
}

// Saves the choice, then calls rerender() so the screen reflects the new preference.
export function bindSourcePrefButtons(root, rerender) {
  root.querySelectorAll(".pref-btn").forEach((b) =>
    b.addEventListener("click", () => {
      toggleSourcePref(b.dataset.source, b.dataset.pref);
      rerender();
    })
  );
}
