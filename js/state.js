// The student's quiz answers and feed preferences, saved in the browser so the demo remembers them.
// Prototype only: nothing leaves the device and there is no account system.
const KEY = "sisu.profile";
// plans: { [eventId]: { before, after, checkedIn } } — confidence ratings around an event.
// goals: [{ id, challenge, eventId | null, done }] — see js/social.js.
const DEFAULTS = {
  language: null,
  country: null,
  interests: [],
  location: null,
  sourcePrefs: {},
  plans: {},
  goals: [],
};

export function getProfile() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return { ...DEFAULTS };
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

// sourcePrefs[sourceId] is "more", "less", or absent (neutral). Clicking the active choice resets it.
export function toggleSourcePref(sourceId, pref) {
  const sourcePrefs = { ...getProfile().sourcePrefs };
  if (sourcePrefs[sourceId] === pref) delete sourcePrefs[sourceId];
  else sourcePrefs[sourceId] = pref;
  return saveProfile({ sourcePrefs });
}
