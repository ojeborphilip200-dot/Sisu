// Tiny hash router (#/events). Hash URLs work on GitHub Pages with no server config.
export function startRouter({ routes, notFound, outlet, onNavigate }) {
  function render() {
    const path = location.hash.slice(1) || "/";
    const route = routes.find((r) => r.path === path);
    const screen = route ? route.screen : notFound;
    outlet.innerHTML = screen();
    outlet.scrollTop = 0;
    onNavigate?.(path);
  }

  window.addEventListener("hashchange", render);
  render();
}
