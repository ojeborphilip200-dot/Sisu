export function TabBar(routes, currentPath) {
  return routes
    .filter((r) => r.tab)
    .map(
      (r) =>
        `<a href="#${r.path}" class="${r.path === currentPath ? "active" : ""}">${r.tab}</a>`
    )
    .join("");
}
