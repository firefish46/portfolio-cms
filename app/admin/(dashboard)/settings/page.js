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
    
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setStatus('Settings updated! Refreshing theme...');
      // Update CSS variable immediately for live preview
      document.documentElement.style.setProperty('--accent', settings.accentColor);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Theme Engine & Settings</h1>
        <p style={{ opacity: 0.7 }}>Configure your global portfolio identity.</p>
      </header>

      <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Branding Section */}
        <section className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Branding</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label>Site Name</label>
            <input 
              type="text" 
              value={settings.siteName} 
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              placeholder="e.g. Mehedi's Portfolio"
            />
            <label>Hero Title</label>
            <input 
              type="text" 
              value={settings.heroTitle} 
              onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
        </section>

        {/* Visuals Section */}
        <section className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Visuals</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Accent Color</label>
              <input 
                type="color" 
                value={settings.accentColor} 
                onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                style={{ width: '100px', height: '50px', cursor: 'pointer', border: 'none', background: 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                The accent color affects buttons, links, and borders across your entire site.
              </p>
              <div style={{ 
                marginTop: '10px', 
                padding: '5px 15px', 
                background: settings.accentColor, 
                color: '#fff', 
                borderRadius: '5px',
                display: 'inline-block'
              }}>
                Live Preview
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" style={{ padding: '1rem 2rem' }}>Save Configuration</button>
          {status && <span style={{ color: 'var(--accent)' }}>{status}</span>}
        </div>
      </form>
    </div>
  );
}