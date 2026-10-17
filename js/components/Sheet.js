// Bottom sheet that slides up over the current screen. Returns the sheet element so the
// caller can wire up buttons; anything with [data-close] (or tapping the backdrop) closes it.
export function openSheet(html) {
  closeSheet();
  const wrap = document.createElement("div");
  wrap.className = "sheet-backdrop";
  wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap || e.target.closest("[data-close]")) closeSheet();
  });
  document.getElementById("device").appendChild(wrap);
  return wrap.querySelector(".sheet");
}

export function setSheet(sheet, html) {
  sheet.innerHTML = html;
}

export function closeSheet() {
  document.querySelector(".sheet-backdrop")?.remove();
}

// Closing on navigation keeps a sheet from lingering over the next screen.
window.addEventListener("hashchange", closeSheet);
