// Sisu Coach chat. The conversation lives in js/coach/script.js; this file only runs it.
import { nodes, practiceTurns, practiceDone, routeFreeText, TOPIC_START } from "../coach/script.js";
import { challengeById } from "../data/challenges.js";
import { addGoal } from "../social.js";

const TYPING_MS = 550;
let history = []; // [{ from: "coach" | "me", text }] — kept while the page is open.
let pendingOptions = [];
let mode = null; // "practice" while role-playing
let practiceStep = 0;
const ctx = {};

const escape = (s) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
const bubble = (m) => `<div class="msg msg-${m.from}">${escape(m.text).replace(/\n/g, "<br />")}</div>`;

export function CoachScreen() {
  return `
    <section class="coach">
      <header class="coach-header">
        <a href="#/goals" class="quiz-back" aria-label="Back">←</a>
        <span class="coach-avatar">🌱</span>
        <div>
          <strong>Sisu Coach</strong>
          <small>A supportive guide, not a therapist</small>
        </div>
      </header>
      <div class="chat-log" aria-live="polite">${history.map(bubble).join("")}</div>
      <div class="chat-options"></div>
      <form class="chat-input">
        <input type="text" placeholder="Type a message…" aria-label="Message" autocomplete="off" />
        <button type="submit" class="button">Send</button>
      </form>
      <p class="coach-disclaimer">Prototype: scripted responses. In crisis? Call or text 988.</p>
    </section>
  `;
}

CoachScreen.mount = (root, params) => {
  const log = root.querySelector(".chat-log");
  const optionsEl = root.querySelector(".chat-options");
  const form = root.querySelector(".chat-input");
  const input = form.querySelector("input");
  const scroll = () => (log.scrollTop = log.scrollHeight);

  const showOptions = (options = []) => {
    pendingOptions = options;
    optionsEl.innerHTML = options
      .map((o, i) => `<button type="button" class="chip-btn" data-i="${i}">${escape(o.label)}</button>`)
      .join("");
  };

  const post = (from, text) => {
    history.push({ from, text });
    log.insertAdjacentHTML("beforeend", bubble({ from, text }));
    scroll();
  };

  // Coach "types" each line with a short pause so it feels conversational.
  const say = async (lines, options) => {
    showOptions([]);
    for (const line of lines) {
      log.insertAdjacentHTML("beforeend", `<div class="msg msg-coach typing"><span></span><span></span><span></span></div>`);
      scroll();
      await new Promise((r) => setTimeout(r, TYPING_MS));
      if (!log.isConnected) return; // Student navigated away mid-reply.
      log.querySelector(".typing")?.remove();
      post("coach", typeof line === "function" ? line(ctx) : line);
    }
    showOptions(options);
  };

  const go = (id) => {
    const node = nodes[id];
    mode = node.input || null;
    practiceStep = 0;
    say(node.say, node.options);
  };

  optionsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip-btn");
    if (!btn) return;
    const opt = pendingOptions[btn.dataset.i];
    post("me", opt.label);
    if (opt.href) {
      location.hash = opt.href;
    } else if (opt.goal) {
      addGoal(opt.goal);
      ctx.lastGoal = challengeById[opt.goal];
      go("goal-added");
    } else {
      go(opt.next);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    post("me", text);

    const target = routeFreeText(text);
    if (target === "crisis") return go("crisis"); // Safety always wins, even mid role-play.
    if (mode === "practice") {
      const lines = practiceTurns[practiceStep](text);
      practiceStep += 1;
      if (practiceStep < practiceTurns.length) return say(lines, []);
      mode = null;
      return say([...lines, ...practiceDone.say], practiceDone.options);
    }
    go(target);
  });

  // Fresh visit: start (or jump to a topic from another screen). Returning: offer the menu again.
  const topic = TOPIC_START[params.topic];
  if (topic) go(topic);
  else if (!history.length) go("start");
  else showOptions(nodes.start.options);
  scroll();
};
