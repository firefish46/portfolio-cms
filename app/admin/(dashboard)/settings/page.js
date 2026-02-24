'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    heroTitle: '',
    accentColor: '#3b82f6',
  });
  const [status, setStatus] = useState('');

  // 1. Load current settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) setSettings(data);
      });
  }, []);

const handleSave = async (e) => {
  e.preventDefault();
  setStatus('Saving...');
  
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      // This ensures cookies (the token) are sent to the API
      credentials: 'include' 
    });

    if (res.status === 401) {
      setStatus('Session expired. Please login again.');
      return;
    }

    if (res.ok) {
      setStatus('Settings updated!');
      document.documentElement.style.setProperty('--accent', settings.accentColor);
      setTimeout(() => setStatus(''), 3000);
    }
  } catch (err) {
    setStatus('Network error occurred.');
  }
};
return (
  <div className="admin-about-container">
    <header className="admin-header">
      <h1 className="name">Theme Engine</h1>
      <p>Configure your global portfolio identity.</p>
    </header>

    <form onSubmit={handleSave} className="admin-form">
      {/* Branding Section */}
      <section className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 className="fredoka-regular" style={{ marginBottom: '1.5rem' }}>Branding</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="input-group">
            <label>Site Name</label>
            <input 
              type="text" 
              value={settings.siteName} 
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              placeholder="e.g. Mehedi's Portfolio"
            />
          </div>
          <div className="input-group">
            <label>Hero Title</label>
            <input 
              type="text" 
              value={settings.heroTitle} 
              onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
        </div>
      </section>

      {/* Visuals Section */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2 className="fredoka-regular" style={{ marginBottom: '1.5rem' }}>Visuals</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="input-group">
            <label>Accent Color</label>
            <input 
              type="color" 
              value={settings.accentColor} 
              onChange={(e) => {
                setSettings({...settings, accentColor: e.target.value});
                // Immediate CSS update for that "Wow" factor
                document.documentElement.style.setProperty('--accent', e.target.value);
              }}
              style={{ width: '80px', height: '80px', padding: '5px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p className="fredoka-regular" style={{ opacity: 0.8 }}>
              This color changes buttons, links, and highlights sitewide.
            </p>
            <button type="button" className="modern-btn" style={{ marginTop: '10px', width: 'auto' }}>
              Sample Button
            </button>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button type="submit" className="modern-btn" style={{ width: '250px' }}>
          Save Configuration
        </button>
        {status && <span className="fredoka-regular" style={{ color: 'var(--accent)' }}>{status}</span>}
      </div>
    </form>
  </div>
);
}