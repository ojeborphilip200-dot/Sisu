// Entry point: registers screens and starts the router.
import { startRouter } from "./router.js";
import { TabBar } from "./components/TabBar.js";
import { OnboardingScreen } from "./screens/onboarding.js";
import { QuizInterestsScreen, QuizLocationScreen } from "./screens/quiz.js";
import { HomeScreen } from "./screens/home.js";
import { EventsScreen } from "./screens/events.js";
import { ProfileScreen } from "./screens/profile.js";
import { NotFoundScreen } from "./screens/not-found.js";

// To add a screen: create js/screens/<name>.js, import it, add a route here.
// Set `tab` to show it in the bottom navigation, `fullscreen` to hide the app chrome.
const routes = [
  { path: "/", screen: OnboardingScreen, fullscreen: true },
  { path: "/quiz/interests", screen: QuizInterestsScreen, fullscreen: true },
  { path: "/quiz/location", screen: QuizLocationScreen, fullscreen: true },
  { path: "/home", screen: HomeScreen, tab: "Home" },
  { path: "/events", screen: EventsScreen, tab: "Events" },
  { path: "/profile", screen: ProfileScreen, tab: "Profile" },
];

startRouter({
  routes,
  notFound: NotFoundScreen,
  outlet: document.getElementById("app"),
  onNavigate: (path, route) => {
    document.getElementById("device").classList.toggle("fullscreen", !!route?.fullscreen);
    document.getElementById("tab-bar").innerHTML = TabBar(routes, path);
  },
});
