'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TABS = ['Branding', 'Visuals'];

export default function AdminSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Branding');
  const [settings, setSettings] = useState({
    siteName: '',
    heroTitle: '',
    accentColor: '#3b82f6',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
     .then((data) => {
  if (data) setSettings({
    siteName:    data.siteName    ?? '',
    heroTitle:   data.heroTitle   ?? '',
    accentColor: data.accentColor ?? '#3b82f6',
  });
});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: 'loading', message: 'Saving...' });

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        credentials: 'include',
      });

      if (res.status === 401) {
        setStatus({ type: 'error', message: 'Session expired. Please login again.' });
        return;
      }
      if (res.ok) {
        document.documentElement.style.setProperty('--accent', settings.accentColor);
        setStatus({ type: 'success', message: 'Settings saved!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const statusColors = { success: '#4dffb4', error: '#ff4d4d', loading: 'var(--accent)' };

  return (
    <div style={{
      maxWidth: '680px', margin: '2rem auto', width: '90dvw',
      display: 'flex', flexDirection: 'column', gap: '1.5rem',
      paddingBottom: '4rem', fontFamily: 'var(--font-cal-sans)'
    }}>

      {/* ── Page Header ── */}
      <div style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: 0 }}>
          Theme Engine
        </h1>
        <p style={{ opacity: 0.45, fontSize: '0.85rem', marginTop: '0.4rem' }}>
          Configure your global portfolio identity
        </p>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        display: 'flex', gap: '0.5rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '5px',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '0.6rem 1rem',
              borderRadius: '10px', border: 'none',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
              fontFamily: 'var(--font-fredoka)',
              transition: 'all 0.2s ease',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'inherit',
              opacity: activeTab === tab ? 1 : 0.5,
              boxShadow: activeTab === tab ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {tab === 'Branding' ? '🏷️' : '🎨'} {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <form onSubmit={handleSave}>

        {/* BRANDING TAB */}
        {activeTab === 'Branding' && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '2rem',
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-fredoka)', fontSize: '1.2rem', margin: '0 0 0.3rem' }}>
                Site Identity
              </h2>
              <p style={{ opacity: 0.4, fontSize: '0.8rem', margin: 0 }}>
                These values appear in your portfolio header and metadata.
              </p>
            </div>

            <div className="input-group">
              <label>Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                placeholder="e.g. Mehedi's Portfolio"
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Hero Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                placeholder="e.g. Full Stack Developer"
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              />
            </div>

            {/* Change password link */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.2rem',
              background: 'rgba(255,68,68,0.06)',
              border: '1px solid rgba(255,68,68,0.2)',
              borderRadius: '12px',
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Password & Security</p>
                <p style={{ margin: '0.2rem 0 0', opacity: 0.45, fontSize: '0.78rem' }}>
                  Update your admin password
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/admin/profile/password')}
                className="edit-btn"
                style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', borderRadius: '8px' }}
              >
                🔐 Change Password
              </button>
            </div>
          </div>
        )}

        {/* VISUALS TAB */}
        {activeTab === 'Visuals' && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '2rem',
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-fredoka)', fontSize: '1.2rem', margin: '0 0 0.3rem' }}>
                Accent Color
              </h2>
              <p style={{ opacity: 0.4, fontSize: '0.8rem', margin: 0 }}>
                This color applies to buttons, links, and highlights sitewide.
              </p>
            </div>

            {/* Color picker row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => {
                    setSettings({ ...settings, accentColor: e.target.value });
                    document.documentElement.style.setProperty('--accent', e.target.value);
                  }}
                  style={{
                    width: '72px', height: '72px', padding: '4px',
                    borderRadius: '14px', border: '2px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer', background: 'none',
                  }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {/* Hex value display */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', padding: '0.4rem 0.8rem',
                  width: 'fit-content',
                }}>
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: settings.accentColor, flexShrink: 0,
                  }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                   {settings.accentColor?.toUpperCase() ?? '#3B82F6'}
                  </span>
                </div>

                <p style={{ opacity: 0.4, fontSize: '0.78rem', margin: 0 }}>
                  Click the swatch to pick a new color. Changes preview live.
                </p>
              </div>
            </div>

            {/* Live preview */}
            <div style={{
              padding: '1.2rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
            }}>
              <p style={{ opacity: 0.4, fontSize: '0.75rem', margin: '0 0 0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Preview
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button type="button" className="modern-btn" style={{ width: 'auto' }}>
                  Primary Button
                </button>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                  Accent Link →
                </span>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--accent)', opacity: 0.8,
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Save Bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '1.5rem', gap: '1rem', flexWrap: 'wrap',
        }}>
          {status.message ? (
            <span style={{
              fontSize: '0.85rem', fontWeight: 600,
              color: statusColors[status.type] || 'inherit',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              {status.type === 'success' ? '✅' : status.type === 'error' ? '❌' : '⏳'}
              {status.message}
            </span>
          ) : <span />}

          <button
            type="submit"
            className="modern-btn"
            disabled={saving}
            style={{ width: '180px', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}