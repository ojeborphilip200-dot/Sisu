// First screen a new student sees. Flags use ISO country codes from flag-icons.
const orbitFlags = ["jp", "br", "ng", "in", "fr", "mx", "kr", "gh"];
const floatingFlags = ["cn", "it", "ke", "co", "de", "vn", "eg", "ph", "tr", "pk", "es", "np"];

export function OnboardingScreen() {
  const orbit = orbitFlags
    .map(
      (code, i) => `
        <span class="orbit-slot" style="--i:${i}; --n:${orbitFlags.length}">
          <span class="flag-bubble"><span class="fi fi-${code} fis"></span></span>
        </span>`
    )
    .join("");

  // Background flags drift upward at staggered positions, sizes, and speeds.
  const floaters = floatingFlags
    .map((code, i) => {
      const left = (i * 83) % 100;
      const size = 26 + ((i * 7) % 14);
      const duration = 9 + ((i * 5) % 7);
      const delay = -((i * 1.7) % duration);
      return `<span class="floater"
        style="left:${left}%; --size:${size}px; --dur:${duration}s; --delay:${delay}s"><span class="fi fi-${code} fis"></span></span>`;
    })
    .join("");

  return `
    <section class="onboarding">
      <div class="floaters" aria-hidden="true">${floaters}</div>

      <div class="orbit-stage" aria-hidden="true">
        <div class="orbit">${orbit}</div>
        <div class="orbit-center">👋</div>
      </div>

      <div class="onboarding-copy">
        <h1>Sisu</h1>
        <p>Find your people, wherever you're from.</p>
      </div>

      <div class="onboarding-actions">
        <!-- TODO: point these to sign-up and login screens once they exist. -->
        <a href="#/home" class="button button-light">Get started</a>
        <a href="#/home" class="button button-outline">Log in</a>
      </div>
    </section>
  `;
}
