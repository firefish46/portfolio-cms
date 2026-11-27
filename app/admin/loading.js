// Neutral placeholder for admin routes (keeps them from inheriting the
// home-page skeleton from app/loading.js).
export default function Loading() {
  return (
    <div className="sk-page" aria-busy="true" style={{ padding: "2rem" }}>
      <span className="sk-sr" role="status">Loading…</span>
      <div className="sk-stack">
        <span className="sk skeleton sk-title" style={{ width: 260 }} />
        <span className="sk skeleton sk-line" style={{ width: 320 }} />
      </div>
      <div className="sk-cards" style={{ marginTop: "2rem" }}>
        {[0, 1, 2].map((i) => <span key={i} className="sk skeleton sk-card" />)}
      </div>
    </div>
  );
}
