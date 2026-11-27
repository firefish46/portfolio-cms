// Instant skeleton for /works and /works/[category].
export default function Loading() {
  return (
    <div className="sk-page" aria-busy="true">
      <span className="sk-sr" role="status">Loading…</span>
      <div className="sk-stack" style={{ marginBottom: "2.5rem" }}>
        <span className="sk skeleton sk-line" style={{ width: 80 }} />
        <span className="sk skeleton sk-title" style={{ width: 300 }} />
        <span className="sk skeleton sk-line" style={{ width: 260 }} />
      </div>
      <div className="sk-tiles">
        {[0, 1, 2, 3].map((i) => <span key={i} className="sk skeleton sk-tile" />)}
      </div>
    </div>
  );
}
