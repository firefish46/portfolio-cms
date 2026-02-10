'use client';
import { useState, useEffect } from 'react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', link: '', category: '' });

  // 1. Fetch Projects on load
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newProject = await res.json();
      setProjects([...projects, newProject]); // Update UI
      setFormData({ title: '', description: '', link: '', category: '' }); // Clear form
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Create Project Form */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" placeholder="Project Title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <input 
            type="text" placeholder="Category (e.g. Web App, UI/UX)" 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})} 
          />
          <textarea 
            placeholder="Description" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <button type="submit">Save Project</button>
        </form>
      </section>

      {/* Projects List */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2>Existing Projects</h2>
        <div style={{ marginTop: '1rem' }}>
          {projects.map((project) => (
            <div key={project._id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '1rem 0', 
              borderBottom: '1px solid var(--glass-border)' 
            }}>
              <div>
                <strong style={{ color: 'var(--accent)' }}>{project.title}</strong>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{project.category}</p>
              </div>
              <button 
                onClick={async () => {
                  await fetch(`/api/projects?id=${project._id}`, { method: 'DELETE' });
                  setProjects(projects.filter(p => p._id !== project._id));
                }}
                style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}