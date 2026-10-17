// The student's quiz answers, saved in the browser so the demo remembers them.
// Prototype only: nothing leaves the device and there is no account system.
const KEY = "sisu.profile";

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { interests: [], location: null };
  } catch {
    return { interests: [], location: null };
  }
}

export function saveProfile(changes) {
  const profile = { ...getProfile(), ...changes };
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // Storage can be blocked (e.g. private browsing); the demo still works for this visit.
  }
  return profile;
}
