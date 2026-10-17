// Profile: everything Sisu stores or uses about the student, how it's used,
// and controls to edit, delete, or download it. Transparency is the point of this screen.
import { interests, locations } from "../data/interests.js";
import { sourceById } from "../data/sources.js";
import { eventById } from "../data/mock.js";
import { challengeById, confidenceScale } from "../data/challenges.js";
import { getProfile, saveProfile, toggleSourcePref, clearProfile } from "../state.js";
import { progress, setGoalDone, deleteGoal, cancelPlan } from "../social.js";
import { clearCoachHistory, setRememberChats } from "./coach.js";
import { openSheet, closeSheet } from "../components/Sheet.js";

const escape = (s) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const face = (v) => (v ? confidenceScale.find((c) => c.value === v) : null);

function Section({ id, title, uses, body, empty }) {
  return `
    <section class="data-section" id="${id}">
      <h2>${title}</h2>
      <p class="data-uses"><strong>How Sisu uses this:</strong> ${uses}</p>
      ${body || `<p class="muted data-empty">${empty}</p>`}
    </section>`;
}

const deleteBtn = (attrs, label) =>
  `<button type="button" class="icon-btn" ${attrs} aria-label="${label}" title="${label}">🗑️</button>`;

export function ProfileScreen() {
  const profile = getProfile();
  const p = progress(profile);
  const plans = Object.entries(profile.plans);
  const sourcePrefs = Object.entries(profile.sourcePrefs);
  const chat = profile.coachHistory;

  return `
    <h1>Profile</h1>
    <p class="muted">Sisu stores some information about you so its AI can suggest events and support your goals. All of it is on this page. You can see it, change it, download it, or delete it at any time.</p>

    <div class="privacy-card">
      <h3>Our data promises</h3>
      <p>🗄️ <strong>Stored in your Sisu account</strong>, encrypted, so it follows you across devices.</p>
      <p>👀 <strong>Only you can see it.</strong> Not your university, not other students, not advertisers. We never sell your data.</p>
      <p>🤖 <strong>The AI only uses what's listed here</strong>, and each section explains exactly how.</p>
      <p>🧾 <strong>You're in control.</strong> Edit, download, or delete anything, anytime. Deleting really deletes.</p>
    </div>

    <div class="data-jump">
      <a href="#" data-jump="d-account">Account</a>
      <a href="#" data-jump="d-interests">Interests</a>
      <a href="#" data-jump="d-location">Location</a>
      <a href="#" data-jump="d-sources">Sources</a>
      <a href="#" data-jump="d-events">Events</a>
      <a href="#" data-jump="d-goals">Social goals</a>
      <a href="#" data-jump="d-coach">Coach</a>
      <a href="#" data-jump="d-export">Download / delete</a>
    </div>

    ${Section({
      id: "d-account",
      title: "Account",
      uses: "Your university email confirms you're a student, so events and people on Sisu come from your campus community. Your name is only shown to people you choose to connect with.",
      body: `<ul class="data-list">
          <li><span><strong>Name</strong><small>Not set in this prototype</small></span></li>
          <li><span><strong>University email</strong><small>Not set in this prototype</small></span></li>
        </ul>`,
    })}

    ${Section({
      id: "d-interests",
      title: "Interests",
      uses: "Events need to match one of these to appear in Picked for you. Each match adds +3 to an event's ranking.",
      body: `<div class="toggle-chips">${interests
        .map((i) => {
          const on = profile.interests.includes(i.id);
          return `<button type="button" class="toggle-chip ${on ? "on" : ""}" data-interest="${i.id}" aria-pressed="${on}">${i.emoji} ${i.label}</button>`;
        })
        .join("")}</div>
        <p class="data-hint">Tap to turn on or off. Changes apply right away.</p>`,
    })}

    ${Section({
      id: "d-location",
      title: "Where you want to explore",
      uses: "If you choose on campus only, community events are hidden from Picked for you.",
      body: `<div class="toggle-chips">${locations
        .map((l) => {
          const on = profile.location === l.id;
          return `<button type="button" class="toggle-chip ${on ? "on" : ""}" data-location="${l.id}" aria-pressed="${on}">${l.emoji} ${l.label}</button>`;
        })
        .join("")}</div>`,
    })}

    ${Section({
      id: "d-sources",
      title: "Source preferences",
      uses: "“See more” adds +2 to that source's events. “See less” hides them from Picked for you.",
      empty: `You haven't asked to see more or less from any source. <a href="#/sources">Manage sources</a>`,
      body:
        sourcePrefs.length &&
        `<ul class="data-list">${sourcePrefs
          .map(
            ([id, pref]) => `
          <li>
            <span><strong>${sourceById[id]?.name ?? id}</strong><small>${pref === "more" ? "👍 See more" : "👎 See less"}</small></span>
            ${deleteBtn(`data-source="${id}" data-pref="${pref}"`, "Remove this preference")}
          </li>`
          )
          .join("")}</ul>`,
    })}

    ${Section({
      id: "d-events",
      title: "Events you planned or attended",
      uses: "Your confidence before an event decides which goals we suggest. Check-ins earn brave points and badges.",
      empty: `No events yet. Tap <strong>I'm going</strong> on any event to plan one.`,
      body:
        plans.length &&
        `<ul class="data-list">${plans
          .map(([id, plan]) => {
            const e = eventById[id];
            const before = face(plan.before);
            const after = face(plan.after);
            return `
          <li>
            <span>
              <strong>${e?.title ?? id}</strong>
              <small>${plan.checkedIn ? "Attended · checked in" : "Planned"} · Confidence before: ${before.emoji} ${before.label}${
                after ? ` · after: ${after.emoji} ${after.label}` : ""
              }</small>
            </span>
            ${deleteBtn(`data-plan="${id}"`, "Delete this event and its goals")}
          </li>`;
          })
          .join("")}</ul>`,
    })}

    ${Section({
      id: "d-goals",
      title: "Social goals",
      uses: `Goals you mark as tried earn brave points (currently ${p.points}) and unlock badges. Goals don't change which events you see.`,
      empty: `No social goals yet. <a href="#/goals">Set one</a>`,
      body:
        profile.goals.length &&
        `<ul class="data-list">${profile.goals
          .map((g) => {
            const c = challengeById[g.challenge];
            const where = g.eventId ? eventById[g.eventId]?.title : "Personal goal";
            return `
          <li>
            <button type="button" class="goal-check ${g.done ? "is-done" : ""}" data-toggle-goal="${g.id}" aria-pressed="${g.done}"
              aria-label="${g.done ? "Mark not tried" : "Mark tried"}">${g.done ? "✓" : ""}</button>
            <span><strong>${c.emoji} ${c.title}</strong><small>${where} · ${g.done ? "Tried" : "Not tried yet"}</small></span>
            ${deleteBtn(`data-goal="${g.id}"`, "Delete this goal")}
          </li>`;
          })
          .join("")}</ul>`,
    })}

    ${Section({
      id: "d-coach",
      title: "Sisu Coach conversations",
      uses: "So Coach can remember what you've talked about and follow up on your goals. Conversations are never used to rank events, and are never read by staff without your permission.",
      body: `
        <label class="switch-row">
          <span><strong>Remember my conversations</strong><small>${profile.rememberChats
            ? "Turning this off deletes saved conversations and stops saving new ones."
            : "Turn on to save conversations from now on."}</small></span>
          <input type="checkbox" class="switch" data-remember ${profile.rememberChats ? "checked" : ""} />
        </label>
        ${
          chat.length
            ? `<ul class="data-list">
                <li>
                  <span><strong>${chat.length} messages saved</strong><small>Last: “${escape(truncate(chat[chat.length - 1].text, 70))}”</small></span>
                  <button type="button" class="button-outline-dark" data-view-chat>View</button>
                  ${deleteBtn("data-delete-chat", "Delete saved conversation")}
                </li>
              </ul>`
            : `<p class="muted data-empty">${profile.rememberChats ? "No saved conversations." : "Conversations aren't being saved."} <a href="#/coach">Talk to Coach</a></p>`
        }`,
    })}

    <section class="data-section" id="d-export">
      <h2>Download or delete everything</h2>
      <button type="button" class="button data-btn" data-download>⬇️ Download my data</button>
      <p class="data-hint">A JSON file with everything on this page, readable in any text editor.</p>
      <button type="button" class="button danger data-btn" data-delete-all>Delete all my data</button>
      <p class="data-hint">Permanently erases everything on this page and starts Sisu fresh.</p>
    </section>

    <p class="sample-note">Prototype note: this demo keeps your data in your browser instead of a Sisu account, so it works without signing up. The controls work the same way.</p>
  `;
}

// A readable export: raw values plus names, so the file makes sense on its own.
function exportData() {
  const profile = getProfile();
  return {
    exportedAt: new Date().toISOString(),
    about: "Everything Sisu has stored about you, as shown on your Sisu Profile page.",
    interests: profile.interests.map((id) => interests.find((i) => i.id === id)?.label ?? id),
    location: locations.find((l) => l.id === profile.location)?.label ?? null,
    sourcePreferences: Object.entries(profile.sourcePrefs).map(([id, pref]) => ({ source: sourceById[id]?.name ?? id, preference: pref })),
    events: Object.entries(profile.plans).map(([id, plan]) => ({
      event: eventById[id]?.title ?? id,
      status: plan.checkedIn ? "attended" : "planned",
      confidenceBefore: plan.before,
      confidenceAfter: plan.after,
    })),
    socialGoals: profile.goals.map((g) => ({
      goal: challengeById[g.challenge]?.title ?? g.challenge,
      forEvent: g.eventId ? eventById[g.eventId]?.title ?? g.eventId : null,
      tried: g.done,
    })),
    progress: (({ points, goalsDone, checkIns, badges }) => ({
      bravePoints: points,
      goalsTried: goalsDone,
      eventsCheckedIn: checkIns,
      badgesEarned: badges.filter((b) => b.earned).map((b) => b.name),
    }))(progress(profile)),
    coachConversations: {
      remember: profile.rememberChats,
      messages: profile.coachHistory.map((m) => ({ from: m.from === "me" ? "you" : "Sisu Coach", text: m.text, at: m.at })),
    },
    raw: profile,
  };
}

function download() {
  const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sisu-my-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function confirmSheet({ title, body, confirmLabel, danger = false }, onConfirm) {
  const sheet = openSheet(`
    <h2>${title}</h2>
    <p class="muted">${body}</p>
    <button type="button" class="button sheet-primary ${danger ? "danger" : ""}" data-confirm>${confirmLabel}</button>
    <button type="button" class="sheet-secondary" data-close>Cancel</button>
  `);
  sheet.querySelector("[data-confirm]").addEventListener("click", () => {
    closeSheet();
    onConfirm();
  });
}

ProfileScreen.mount = (root) => {
  const rerender = () => {
    const y = root.scrollTop;
    root.innerHTML = ProfileScreen();
    ProfileScreen.mount(root);
    root.scrollTop = y; // Stay in place after an edit.
  };
  const on = (selector, handler) =>
    root.querySelectorAll(selector).forEach((el) => el.addEventListener("click", (e) => handler(el, e)));

  on("[data-jump]", (el, e) => {
    e.preventDefault();
    root.querySelector(`#${el.dataset.jump}`).scrollIntoView({ behavior: "smooth" });
  });

  on("[data-interest]", (el) => {
    const set = new Set(getProfile().interests);
    set.has(el.dataset.interest) ? set.delete(el.dataset.interest) : set.add(el.dataset.interest);
    saveProfile({ interests: [...set] });
    rerender();
  });

  on("[data-location]", (el) => {
    saveProfile({ location: el.dataset.location });
    rerender();
  });

  on("[data-source]", (el) => {
    toggleSourcePref(el.dataset.source, el.dataset.pref); // Toggling the active pref clears it.
    rerender();
  });

  on("[data-toggle-goal]", (el) => {
    setGoalDone(el.dataset.toggleGoal, el.getAttribute("aria-pressed") !== "true");
    rerender();
  });

  on("[data-goal]", (el) =>
    confirmSheet(
      { title: "Delete this goal?", body: "It will be removed along with any brave points it earned.", confirmLabel: "Delete goal", danger: true },
      () => {
        deleteGoal(el.dataset.goal);
        rerender();
      }
    )
  );

  on("[data-plan]", (el) =>
    confirmSheet(
      {
        title: "Delete this event?",
        body: "This removes your plan, confidence ratings, and goals for this event, plus any points they earned.",
        confirmLabel: "Delete event data",
        danger: true,
      },
      () => {
        cancelPlan(el.dataset.plan);
        rerender();
      }
    )
  );

  root.querySelector("[data-remember]")?.addEventListener("change", (e) => {
    if (e.target.checked) {
      setRememberChats(true);
      rerender();
    } else {
      e.target.checked = true; // Wait for confirmation.
      confirmSheet(
        {
          title: "Stop remembering conversations?",
          body: "Your saved Coach conversations will be deleted, and new ones won't be saved. Coach won't be able to follow up on past chats.",
          confirmLabel: "Turn off and delete",
          danger: true,
        },
        () => {
          setRememberChats(false);
          rerender();
        }
      );
    }
  });

  on("[data-view-chat]", () => {
    const fmt = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "");
    openSheet(`
      <h2>Saved conversation</h2>
      <p class="muted">Exactly what Sisu has stored from your chats with Coach.</p>
      <div class="transcript">${getProfile()
        .coachHistory.map(
          (m) => `<div class="msg msg-${m.from}">${escape(m.text).replace(/\n/g, "<br />")}<small>${fmt(m.at)}</small></div>`
        )
        .join("")}</div>
      <button type="button" class="button sheet-primary" data-close>Close</button>
    `);
  });

  on("[data-delete-chat]", () =>
    confirmSheet(
      { title: "Delete saved conversation?", body: "Coach won't remember anything you talked about.", confirmLabel: "Delete conversation", danger: true },
      () => {
        clearCoachHistory();
        rerender();
      }
    )
  );

  on("[data-download]", download);

  on("[data-delete-all]", () =>
    confirmSheet(
      {
        title: "Delete all your data?",
        body: "This permanently erases your interests, settings, source preferences, events, goals, points, and Coach conversations. It can't be undone. You may want to download your data first.",
        confirmLabel: "Yes, delete everything",
        danger: true,
      },
      () => {
        clearCoachHistory();
        clearProfile(); // Last, so nothing is re-saved after it.
        location.hash = "#/";
      }
    )
  );
};
