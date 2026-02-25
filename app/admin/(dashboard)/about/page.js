'use client';
import { useState, useEffect } from 'react';
import "./admin-about.css";

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState({ highlights: [], aiTools: [] });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(true); 
// Add this near your other useState calls
const [editingIndex, setEditingIndex] = useState(null);
  // 1. Load Data from API
  useEffect(() => {
    async function fetchData() {
      try {
         setIsLoading(true);
        const res = await fetch('/api/about');
        const data = await res.json();
        
        if (data && !data.error) {
          setAboutData({
            highlights: data.highlights || [],
            aiTools: data.aiTools || []
            
          });
            setIsLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- NEW: Icon Upload Logic ---
  const handleIconUpload = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setStatus({ type: 'info', msg: 'Uploading icon...' });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        updateTool(index, 'image', data.url); 
        setStatus({ type: 'success', msg: 'Icon uploaded!' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Upload failed' });
    }
  };

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
      aiTools: [...prev.aiTools, { name: '', image: '/icons/default.svg', color: '#10a37f', delay: '0s' }]
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
      const payload = {
        highlights: aboutData.highlights.map(({ title, desc }) => ({ title, desc })),
        aiTools: aboutData.aiTools.map(({ name, image, color, delay }) => ({ name, image, color, delay }))
      };

      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Updated successfully!' });
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

if (isLoading) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* ── SECTION: PROFESSIONAL HIGHLIGHTS SKELETON ── */}
      <section className='responsive-card' style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: '28px', width: '220px' }} />
          <div className="skeleton" style={{ height: '32px', width: '110px', borderRadius: '20px' }} />
        </div>
        
        {/* Repeating Highlight Rows (3 items) */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '12px', width: '40px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ height: '45px', width: '100%' }} />
            </div>
            <div style={{ flex: 2 }}>
              <div className="skeleton" style={{ height: '12px', width: '80px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ height: '45px', width: '100%' }} />
            </div>
            <div className="skeleton" style={{ height: '45px', width: '45px', borderRadius: '8px' }} />
          </div>
        ))}
      </section>

      {/* ── SECTION: FLOATING TECH ORBIT SKELETON ── */}
      <section className='responsive-card' style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: '28px', width: '180px' }} />
          <div className="skeleton" style={{ height: '32px', width: '90px', borderRadius: '20px' }} />
        </div>

        {/* Repeating Tech Rows (3 items) */}
        {[1, 2, 3].map((i) => (
          <div key={i} className='responsive-card' style={{ 
            display: 'flex', alignItems: 'center', padding: '1rem', marginBottom: '1rem', gap: '1rem', border: '1px solid #eee' 
          }}>
            <div className="skeleton" style={{ height: '20px', width: '10px' }} /> {/* Drag handle */}
            <div className="skeleton" style={{ height: '35px', width: '35px', borderRadius: '4px' }} /> {/* Logo */}
            <div className="skeleton" style={{ height: '20px', width: '100px' }} /> {/* Name */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '35px', width: '70px', borderRadius: '6px' }} /> {/* Edit btn */}
              <div className="skeleton" style={{ height: '35px', width: '35px', borderRadius: '6px' }} /> {/* Delete btn */}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

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
            {aboutData.highlights.map((h, i) => (
              <div key={i} className="list-item-row">
                <div className="input-group">
                  <label>Title</label>
                  <input value={h.title || ''} onChange={(e) => updateHighlight(i, 'title', e.target.value)} required />
                </div>
                <div className="input-group grow">
                  <label>Description</label>
                  <input value={h.desc || ''} onChange={(e) => updateHighlight(i, 'desc', e.target.value)} required />
                </div>
                <button type="button" onClick={() => removeHighlight(i)} className="del-btn">
                  <i className="fa-regular fa-trash-can"></i>
                </button>
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
    <div key={i} className={`tool-item-container ${editingIndex === i ? 'is-editing' : 'is-list'}`}>
      
      {/* --- VIEW MODE (Compact List) --- */}
      {editingIndex !== i ? (
        <div className="tool-list-row">
          <div className="tool-main-info">
             <span className="drag-handle">::</span>
             <img src={t.image || '/icons/default.svg'} alt="" className="list-icon-preview" style={{borderColor: t.color}} />
             <span className="list-tool-name">{t.name || 'Unnamed Tool'}</span>
          </div>
          <div className="tool-actions">
            <button type="button" onClick={() => setEditingIndex(i)} className="edit-mini-btn">
              <i className="fa-regular fa-pen-to-square"></i> Edit
            </button>
            <button type="button" onClick={() => removeTool(i)} className="del-mini-btn">
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      ) : (
        /* --- EDIT MODE (Full Form) --- */
        <div className="tool-editor-card">
          <div className="editor-header">
            <h3>Editing: {t.name}</h3>
            <button type="button" onClick={() => setEditingIndex(null)} className="close-edit-btn">Done</button>
          </div>

          <div className="input-group">
            <label>Name</label>
            <input value={t.name || ''} onChange={(e) => updateTool(i, 'name', e.target.value)} />
          </div>

          <div className="input-group">
            <label>Icon Upload</label>
            <div className="upload-container">
              {t.image && <img src={t.image} alt="preview" className="admin-icon-preview" />}
              <input type="file" onChange={(e) => handleIconUpload(i, e.target.files[0])} />
            </div>
          </div>

          <div className="row-split">
            <div className="input-group">
              <label>Color</label>
              <input type="color" value={t.color || '#10a37f'} onChange={(e) => updateTool(i, 'color', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Delay</label>
              <input value={t.delay || '0s'} onChange={(e) => updateTool(i, 'delay', e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  ))}
</div>
        </section>

        <button type="submit" className="save-btn">Save All Changes</button>
      </form>
    </div>
  );
}