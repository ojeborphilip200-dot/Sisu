// Components are plain functions that return HTML strings.
export function Card({ title, body }) {
  return `
    <div class="card">
      <h3>${title}</h3>
      <p>${body}</p>
    </div>
  `;
}
