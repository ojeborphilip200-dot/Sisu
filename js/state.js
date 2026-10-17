// Everything Sisu stores about the student. In the envisioned app this lives in their Sisu account;
// in this prototype it's kept in the browser's localStorage so the demo works without accounts.
const KEY = "sisu.profile";
// plans: { [eventId]: { before, after, checkedIn } } — confidence ratings around an event.
// goals: [{ id, challenge, eventId | null, done }] — see js/social.js.
// coachHistory: [{ from, text, at }] — saved only while rememberChats is on.
const DEFAULTS = {
  language: null,
  country: null,
  interests: [],
  location: null,
  sourcePrefs: {},
  plans: {},
  goals: [],
  coachHistory: [],
  rememberChats: true,
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

// Permanently removes everything Sisu has saved about the student on this device.
export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing was stored.
  }
}
