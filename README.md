# Sisu
International students app — a prototype for the [AI for the Public Good Challenge](https://sinelab.github.io/ai-for-good-challenge/) at SUNY Albany.

Sisu helps international students get into more social situations. This repo is a clickable proof of concept, hosted on GitHub Pages.

**Live site:** https://ojeborphilip200-dot.github.io/Sisu/

## Run it locally

No build step and no installs needed. From the repo folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly won't work; browsers block JS modules loaded from `file://`.)

## Project structure

```
index.html            App shell (header, main area, tab bar)
css/styles.css        All styles; design tokens (colors, spacing) at the top
js/app.js             Route list — register new screens here
js/router.js          Hash router (#/events), works on GitHub Pages as-is
js/components/        Reusable UI pieces (functions that return HTML strings)
js/screens/           One file per screen
js/curation.js        The visible "algorithm": rules that rank events and explain why
js/state.js           Quiz answers, see more/less choices, plans and goals (saved in the browser)
js/social.js          Social goals, event check-ins, brave points and badges
js/coach/script.js    Everything Sisu Coach says (edit this to change the conversation)
js/data/mock.js       Sample events (description, time, place, attendance, source)
js/data/sources.js    Sample sources the AI "scans" (fictional, example.edu/.org links)
js/data/interests.js  Quiz interest and location options
js/data/challenges.js The social ladder: goals from "say hi" to "ask someone to coffee"
assets/               Images, icons
```

## Adding a screen

1. Create `js/screens/my-screen.js`:
   ```js
   export function MyScreen() {
     return `<h1>My screen</h1>`;
   }
   ```
2. Import it in `js/app.js` and add `{ path: "/my-screen", screen: MyScreen }` to `routes`. Add `tab: "Label"` to put it in the bottom navigation.
3. Link to it from anywhere with `<a href="#/my-screen">`.

## Deploying

Pushing to `main` updates the live site within a minute or two. One-time setup (repo owner): **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save.**
