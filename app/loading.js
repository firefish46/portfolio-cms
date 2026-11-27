// Instant skeleton for the home page while it streams in.
export default function Loading() {
  return (
    <div className="sk-page" aria-busy="true">
      <span className="sk-sr" role="status">Loading…</span>

      {/* Hero card */}
      <div className="sk-hero">
        <span className="sk skeleton sk-avatar" />
        <span className="sk skeleton sk-line" style={{ width: 90 }} />
        <span className="sk skeleton sk-title" />
        <span className="sk skeleton sk-line" style={{ width: 160 }} />
        <div className="sk-row">
          {[0, 1, 2, 3].map((i) => <span key={i} className="sk skeleton sk-icon" />)}
        </div>
      </div>

      {/* About: text + tools grid */}
      <div className="sk-split">
        <div className="sk-stack">
          <span className="sk skeleton sk-line" style={{ width: 90 }} />
          <span className="sk skeleton sk-title" style={{ width: 220 }} />
          <span className="sk skeleton sk-line" style={{ width: "95%" }} />
          <span className="sk skeleton sk-line" style={{ width: "88%" }} />
          <span className="sk skeleton sk-line" style={{ width: "60%" }} />
        </div>
        <div className="sk-grid">
          {Array.from({ length: 8 }, (_, i) => <span key={i} className="sk skeleton sk-cell" />)}
        </div>
      </div>

      {/* Experience stats */}
      <div className="sk-stack" style={{ marginBottom: "2rem" }}>
        <span className="sk skeleton sk-line" style={{ width: 70 }} />
        <span className="sk skeleton sk-title" style={{ width: 280 }} />
      </div>
      <div className="sk-cards">
        {[0, 1, 2].map((i) => <span key={i} className="sk skeleton sk-card" />)}
      </div>
    </div>
  );
}
