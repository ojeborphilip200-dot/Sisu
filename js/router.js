// Tiny hash router (#/events, #/event/coffee-hour). Hash URLs work on GitHub Pages with no server config.
// Route paths can include params like "/event/:id"; screens receive them as screen(params).
// Query strings (#/coach?topic=nervous) are merged into params too.
function match(routePath, path) {
  const a = routePath.split("/");
  const b = path.split("/");
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export function startRouter({ routes, notFound, outlet, onNavigate }) {
  function render() {
    const [path, query = ""] = (location.hash.slice(1) || "/").split("?");
    let route, params = {};
    for (const r of routes) {
      const p = match(r.path, path);
      if (p) { route = r; params = { ...Object.fromEntries(new URLSearchParams(query)), ...p }; break; }
    }
    const screen = route ? route.screen : notFound;
    outlet.innerHTML = screen(params);
    outlet.scrollTop = 0;
    // Interactive screens attach event listeners in an optional mount(outlet, params).
    screen.mount?.(outlet, params);
    onNavigate?.(path, route);
  }

  window.addEventListener("hashchange", render);
  render();
}
