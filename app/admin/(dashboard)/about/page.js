'use client';
import { useState, useEffect } from 'react';
import "./admin-about.css";

export default function AdminAbout() {
  // Initialize with empty arrays to prevent mapping errors before fetch
  const [aboutData, setAboutData] = useState({ highlights: [], aiTools: [] });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        
        if (data) {
          // IMPORTANT: Ensure we have arrays even if DB fields are missing
          setAboutData({
            _id: data._id, // Keep the ID for updates
            highlights: data.highlights || [],
            aiTools: data.aiTools || []
          });
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ... (addHighlight, addTool, update logic stay the same) ...

  if (loading) return <div className="admin-loading">Fetching your data...</div>;

  return (
    <div className="admin-about-container">
      {/* ... header ... */}

      <form onSubmit={handleSave} className="admin-form">
        
        {/* HIGHLIGHTS SECTION */}
        <section className="admin-card">
          <div className="card-header">
            <h2>Professional Highlights</h2>
            <button type="button" onClick={addHighlight} className="add-btn">+ Add Highlight</button>
          </div>
          <div className="highlights-list">
            {/* If highlights exists and has items, they will show here */}
            {aboutData.highlights.length === 0 && <p style={{color: '#666'}}>No highlights yet.</p>}
            
            {aboutData.highlights.map((h, i) => (
              <div key={i} className="list-item-row">
                <div className="input-group">
                  <label>Title</label>
                  <input 
                    value={h.title || ''} 
                    onChange={(e) => updateHighlight(i, 'title', e.target.value)} 
                  />
                </div>
                <div className="input-group grow">
                  <label>Description</label>
                  <input 
                    value={h.desc || ''} 
                    onChange={(e) => updateHighlight(i, 'desc', e.target.value)} 
                  />
                </div>
                <button type="button" onClick={() => removeHighlight(i)} className="del-btn">🗑️</button>
              </div>
            ))}
          </div>
        </section>

        {/* AI TOOLS SECTION */}
        <section className="admin-card">
          <div className="card-header">
            <h2>Floating Tech Orbit</h2>
            <button type="button" onClick={addTool} className="add-btn">+ Add Tool</button>
          </div>
          <div className="tools-grid">
             {aboutData.aiTools.map((t, i) => (
              <div key={i} className="tool-editor-card">
                <button type="button" onClick={() => removeTool(i)} className="tool-del-btn">×</button>
                <div className="input-group">
                  <label>Name</label>
                  <input value={t.name || ''} onChange={(e) => updateTool(i, 'name', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>SVG Path</label>
                  <input value={t.image || ''} onChange={(e) => updateTool(i, 'image', e.target.value)} />
                </div>
                <div className="row-split">
                  <input type="color" value={t.color || '#10a37f'} onChange={(e) => updateTool(i, 'color', e.target.value)} />
                  <input value={t.delay || '0s'} onChange={(e) => updateTool(i, 'delay', e.target.value)} placeholder="Delay" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}