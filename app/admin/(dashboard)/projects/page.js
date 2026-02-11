'use client';
import { useState, useEffect } from 'react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ 
    title: '', description: '', link: '', category: '', role: '', tools: '', images: [] 
  });
  
  // States for Confirmation Overlay
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetch('/api/projects').then((res) => res.json()).then((data) => setProjects(data));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      tools: typeof formData.tools === 'string' ? formData.tools.split(',').map(t => t.trim()) : formData.tools
    };

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });

    if (res.ok) {
      const newProject = await res.json();
      setProjects([...projects, newProject]);
      setFormData({ title: '', description: '', link: '', category: '', role: '', tools: '', images: [] });
    }
  };

  // Open confirmation
  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Execute actual deletion
const executeDelete = async () => {
    if (!projectToDelete) return;

    // 1. CAPTURE the ID to delete
    const idToRemove = projectToDelete._id;

    // 2. OPTIMISTIC UPDATE: 
    // Close modal and remove from list IMMEDIATELY (before the server responds)
    setShowDeleteModal(false);
    setProjects(projects.filter(p => p._id !== idToRemove));

    try {
      // 3. DO THE WORK in the background
      const res = await fetch(`/api/projects?id=${idToRemove}`, { method: 'DELETE' });
      
      if (!res.ok) {
        // 4. ROLLBACK (Optional): If the server fails, put the project back
        // alert("Failed to delete from server. Refreshing list...");
        // fetch('/api/projects').then(res => res.json()).then(data => setProjects(data));
      }
    } catch (err) {
      console.error("Background delete failed:", err);
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <link cloudflare="true" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      
      {/* 1. ADD PROJECT FORM SECTION */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-fredoka)', color: 'var(--accent)' }}>🚀 Add New Project</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <input type="text" placeholder="Project Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <input type="text" placeholder="Category (e.g. Web App)" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          <input type="text" placeholder="My Role (e.g. Lead Designer)" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
          <input type="text" placeholder="Live Link / URL" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
          <input type="text" placeholder="Tools used (comma separated: React, Tailwind)" value={formData.tools} onChange={(e) => setFormData({...formData, tools: e.target.value})} style={{ gridColumn: 'span 2' }} />
          <textarea placeholder="Description" value={formData.description} style={{ gridColumn: 'span 2', minHeight: '100px' }} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Project Screenshots</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {formData.images.map((img, i) => (
                <img key={i} src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
              ))}
            </div>
          </div>
          <button type="submit" className="modern-btn" style={{ gridColumn: 'span 2' }}>Save Project</button>
        </form>
      </section>

      {/* 2. PROJECTS LIST SECTION */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2>Existing Projects</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {projects.map((project) => (
            <div key={project._id} className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--accent)' }}>{project.title}</strong>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Role: {project.role}</p>
                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                  {project.tools?.map((tool, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{tool}</span>
                  ))}
                </div>
              </div>
              
              <button 
                className='delete-btn' 
                onClick={() => confirmDelete(project)} 
                style={{ 
                  color: '#ff4d4d', border: '1px solid', background: 'none', 
                  width: '40px', height: '40px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                }}
              >
                <i className="fa-solid fa-trash-can" style={{color:'white'}}></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CONFIRMATION OVERLAY MODAL */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{ 
            padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center',
            border: '1px solid rgba(255, 77, 77, 0.3)' 
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Confirm Deletion</h3>
            <p style={{ opacity: 0.8, marginBottom: '2.5rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{projectToDelete?.title}</strong>? 
              This action will permanently remove all data and images associated with it.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className='delete-btn'
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
              >
                Go Back
              </button>
              <button className='delete-btn'
                onClick={executeDelete}
                style={{ 
                  flex: 1, padding: '12px', background: '#ff4d4d', border: 'none', 
                  color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}