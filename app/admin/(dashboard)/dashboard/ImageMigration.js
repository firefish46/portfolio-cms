'use client';
import { useEffect, useState } from 'react';

// Shows only while images are still stored inline (base64) in MongoDB.
export default function ImageMigration() {
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/migrate-images')
      .then((r) => (r.ok ? r.json() : { remaining: 0 }))
      .then((d) => setRemaining(d.remaining ?? 0))
      .catch(() => setRemaining(0));
  }, []);

  const run = async () => {
    setRunning(true);
    setError('');
    try {
      // Each call moves a small batch; repeat until nothing is left
      for (;;) {
        const res = await fetch('/api/admin/migrate-images', { method: 'POST' });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'Migration failed');
        setDone((n) => n + d.migrated);
        setRemaining(d.remaining);
        if (!d.remaining || !d.migrated) break;
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  if (!remaining && !done) return null;

  return (
    <section
      className="glass"
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        border: '1px solid var(--border-strong)',
        background: 'var(--surface)',
      }}
    >
      <div style={{ maxWidth: 620 }}>
        <h4 style={{ marginBottom: '0.3rem' }}>
          {remaining ? `${remaining} image${remaining === 1 ? '' : 's'} stored inside the database` : 'All images moved to Cloudinary'}
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          {remaining
            ? 'They are sent inside every page, which makes the site slow. Move them to Cloudinary once — it only takes a moment.'
            : `${done} image${done === 1 ? '' : 's'} moved. Pages are now much lighter.`}
        </p>
        {error && <p style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.4rem' }}>{error}</p>}
      </div>
      {remaining > 0 && (
        <button className="modern-btn" style={{ width: 'auto', padding: '0.7rem 1.2rem' }} onClick={run} disabled={running}>
          {running ? `Moving… ${done} done` : 'Move images to Cloudinary'}
        </button>
      )}
    </section>
  );
}
