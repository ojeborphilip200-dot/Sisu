// Tiny hash router (#/events). Hash URLs work on GitHub Pages with no server config.
export function startRouter({ routes, notFound, outlet, onNavigate }) {
  function render() {
    const path = location.hash.slice(1) || "/";
    const route = routes.find((r) => r.path === path);
    const screen = route ? route.screen : notFound;
    outlet.innerHTML = screen();
    outlet.scrollTop = 0;
    // Interactive screens attach event listeners in an optional mount(outlet).
    screen.mount?.(outlet);
    onNavigate?.(path, route);
  }

  window.addEventListener("hashchange", render);
  render();
}
