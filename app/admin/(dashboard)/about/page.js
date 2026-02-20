'use client';
import { useState, useEffect } from 'react';
import "./admin-about.css";

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState({ highlights: [], aiTools: [] });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // 1. Load Data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        
        console.log("Loaded Data from DB:", data);

        if (data && !data.error) {
          setAboutData({
            highlights: data.highlights || [],
            aiTools: data.aiTools || []
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Highlights Logic
  const addHighlight = () => {
    setAboutData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', desc: '' }]
    }));
  };

  const updateHighlight = (index, field, value) => {
    const updated = [...aboutData.highlights];
    updated[index][field] = value;
    setAboutData(prev => ({ ...prev, highlights: updated }));
  };

  const removeHighlight = (index) => {
    setAboutData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // 3. AI Tools Logic
  const addTool = () => {
    setAboutData(prev => ({
      ...prev,
      aiTools: [...prev.aiTools, { name: '', image: '/icons/', color: '#10a37f', delay: '0s' }]
    }));
  };

  const updateTool = (index, field, value) => {
    const updated = [...aboutData.aiTools];
    updated[index][field] = value;
    setAboutData(prev => ({ ...prev, aiTools: updated }));
  };

  const removeTool = (index) => {
    setAboutData(prev => ({
      ...prev,
      aiTools: prev.aiTools.filter((_, i) => i !== index)
    }));
  };

  // 4. Save Function
  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Saving to database...' });

    try {
      // Clean the data: Remove any extra MongoDB fields like _id or __v 
      // to ensure a clean update
      const payload = {
        highlights: aboutData.highlights.map(({ title, desc }) => ({ title, desc })),
        aiTools: aboutData.aiTools.map(({ name, image, color, delay }) => ({ name, image, color, delay }))
      };

      console.log("Sending Payload:", payload);

      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Updated successfully!' });
        // Sync state with the fresh data from the server
        setAboutData({
          highlights: result.highlights || [],
          aiTools: result.aiTools || []
        });
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      } else {
        throw new Error(result.error || 'Failed to update');
      }
    } catch (err) {
      console.error("Save Error:", err);
      setStatus({ type: 'error', msg: err.message });
    }
  };

  if (loading) return <div className="admin-loading">Connecting to database...</div>;

  return (
    <div className="admin-about-container">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />

      <header className="admin-header">
        <h1>About Section Content</h1>
        <p>Customize the &quot;Why Choose Me&quot; cards and the &quot;AI Orbit&quot; tools.</p>
      </header>

      {status.msg && (
        <div className={`status-msg ${status.type}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSave} className="admin-form">
        
        {/* HIGHLIGHTS */}
        <section className="admin-card">
          <div className="card-header">
            <h2>Professional Highlights</h2>
            <button type="button" onClick={addHighlight} className="add-btn">+ New Highlight</button>
          </div>
          <div className="highlights-list">
            {aboutData.highlights.length === 0 && <p className="empty-hint">No highlights created yet.</p>}
            {aboutData.highlights.map((h, i) => (
              <div key={i} className="list-item-row">
                <div className="input-group">
                  <label>Title</label>
                  <input 
                    value={h.title || ''} 
                    onChange={(e) => updateHighlight(i, 'title', e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group grow">
                  <label>Description</label>
                  <input 
                    value={h.desc || ''} 
                    onChange={(e) => updateHighlight(i, 'desc', e.target.value)} 
                    required 
                  />
                </div>
                <button type="button" onClick={() => removeHighlight(i)} className="del-btn"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            ))}
          </div>
        </section>

        {/* AI TOOLS */}
        <section className="admin-card">
          <div className="card-header">
            <h2>Floating Tech Orbit</h2>
            <button type="button" onClick={addTool} className="add-btn">+ New Tool</button>
          </div>
          <div className="tools-grid">
            {aboutData.aiTools.length === 0 && <p className="empty-hint">No tools added to orbit.</p>}
            {aboutData.aiTools.map((t, i) => (
              <div key={i} className="tool-editor-card">
                <button type="button" onClick={() => removeTool(i)} className="tool-del-btn"><i class="fa-regular fa-trash-can"></i></button>
                <div className="input-group">
                  <label>Name</label>
                  <input value={t.name || ''} onChange={(e) => updateTool(i, 'name', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Icon Path (/icons/filename.svg)</label>
                  <input value={t.image || ''} onChange={(e) => updateTool(i, 'image', e.target.value)} />
                </div>
                <div className="row-split">
                  <div className="input-group">
                    <label>Brand Color</label>
                    <input type="color" value={t.color || '#10a37f'} onChange={(e) => updateTool(i, 'color', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Delay (s)</label>
                    <input value={t.delay || '0s'} onChange={(e) => updateTool(i, 'delay', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="save-btn">Save All Changes</button>
      </form>
    </div>
  );
}