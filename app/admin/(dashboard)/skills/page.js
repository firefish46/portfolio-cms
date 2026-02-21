'use client';
import { useState, useEffect } from 'react';

// Move icon map and generator function outside component
const iconMap = {
  // Frontend
  'react': 'fa-brands fa-react',
  'vue': 'fa-brands fa-vuejs',
  'vue.js': 'fa-brands fa-vuejs',
  'angular': 'fa-brands fa-angular',
  'svelte': 'fa-brands fa-js',
  'html': 'fa-brands fa-html5',
  'html5': 'fa-brands fa-html5',
  'css': 'fa-brands fa-css3-alt',
  'css3': 'fa-brands fa-css3-alt',
  'javascript': 'fa-brands fa-js',
  'js': 'fa-brands fa-js',
  'typescript': 'fa-brands fa-js',
  'ts': 'fa-brands fa-js',
  'sass': 'fa-brands fa-sass',
  'scss': 'fa-brands fa-sass',
  'less': 'fa-brands fa-less',
  'bootstrap': 'fa-brands fa-bootstrap',
  'tailwind': 'fa-brands fa-css3-alt',
  'tailwindcss': 'fa-brands fa-css3-alt',
  'next.js': 'fa-brands fa-react',
  'nextjs': 'fa-brands fa-react',
  'gatsby': 'fa-brands fa-react',
  'redux': 'fa-brands fa-react',
  'webpack': 'fa-brands fa-js',
  'vite': 'fa-solid fa-bolt',
  
  // Backend
  'node': 'fa-brands fa-node',
  'node.js': 'fa-brands fa-node-js',
  'nodejs': 'fa-brands fa-node-js',
  'express': 'fa-brands fa-node',
  'express.js': 'fa-brands fa-node',
  'nestjs': 'fa-brands fa-node',
  'nest.js': 'fa-brands fa-node',
  'python': 'fa-brands fa-python',
  'django': 'fa-brands fa-python',
  'flask': 'fa-solid fa-pepper-hot',
  'fastapi': 'fa-brands fa-python',
  'java': 'fa-brands fa-java',
  'spring': 'fa-brands fa-java',
  'spring boot': 'fa-brands fa-java',
  'php': 'fa-brands fa-php',
  'laravel': 'fa-brands fa-laravel',
  'ruby': 'fa-solid fa-gem',
  'rails': 'fa-solid fa-gem',
  'ruby on rails': 'fa-solid fa-gem',
  'go': 'fa-brands fa-golang',
  'golang': 'fa-brands fa-golang',
  'rust': 'fa-brands fa-rust',
  'c#': 'fa-solid fa-code',
  'c++': 'fa-brands fa-cuttlefish',
  'csharp': 'fa-solid fa-code',
  '.net': 'fa-solid fa-code',
  'dotnet': 'fa-solid fa-code',
  
  // Databases
  'mongodb': 'fa-brands fa-envira',
  'mysql': 'fa-solid fa-database',
  'postgresql': 'fa-brands fa-postgresql',
  'postgres': 'fa-brands fa-postgresql',
  'redis': 'fa-solid fa-database',
  'sqlite': 'fa-solid fa-database',
  'oracle': 'fa-solid fa-database',
  'mariadb': 'fa-solid fa-database',
  'dynamodb': 'fa-brands fa-aws',
  'firebase': 'fa-solid fa-fire',
  'supabase': 'fa-solid fa-database',
  'cassandra': 'fa-solid fa-database',
  'elasticsearch': 'fa-solid fa-magnifying-glass',
  
  // Cloud & DevOps
  'aws': 'fa-brands fa-aws',
  'amazon web services': 'fa-brands fa-aws',
  'azure': 'fa-brands fa-microsoft',
  'gcp': 'fa-brands fa-google',
  'google cloud': 'fa-brands fa-google',
  'docker': 'fa-brands fa-docker',
  'kubernetes': 'fa-solid fa-dharmachakra',
  'k8s': 'fa-solid fa-dharmachakra',
  'jenkins': 'fa-brands fa-jenkins',
  'terraform': 'fa-solid fa-cube',
  'ansible': 'fa-solid fa-server',
  'gitlab': 'fa-brands fa-gitlab',
  'github': 'fa-brands fa-github',
  'bitbucket': 'fa-brands fa-bitbucket',
  'circleci': 'fa-solid fa-circle',
  
  // Tools & Others
  'git': 'fa-brands fa-git-alt',
  'npm': 'fa-brands fa-npm',
  'yarn': 'fa-brands fa-yarn',
  'figma': 'fa-brands fa-figma',
  'sketch': 'fa-brands fa-sketch',
  'photoshop': 'fa-solid fa-image',
  'illustrator': 'fa-solid fa-palette',
  'jira': 'fa-brands fa-jira',
  'confluence': 'fa-brands fa-confluence',
  'slack': 'fa-brands fa-slack',
  'trello': 'fa-brands fa-trello',
  'vscode': 'fa-solid fa-code',
  'visual studio code': 'fa-solid fa-code',
  'postman': 'fa-solid fa-paper-plane',
  'insomnia': 'fa-solid fa-moon',
  'linux': 'fa-brands fa-linux',
  'ubuntu': 'fa-brands fa-ubuntu',
  'windows': 'fa-brands fa-windows',
  'macos': 'fa-brands fa-apple',
  'android': 'fa-brands fa-android',
  'ios': 'fa-brands fa-apple',
  'swift': 'fa-brands fa-swift',
  'kotlin': 'fa-brands fa-android',
  'flutter': 'fa-solid fa-mobile-screen',
  'react native': 'fa-brands fa-react',
  'graphql': 'fa-solid fa-diagram-project',
  'rest': 'fa-solid fa-plug',
  'api': 'fa-solid fa-plug',
  'wordpress': 'fa-brands fa-wordpress',
  'shopify': 'fa-brands fa-shopify',
  'woocommerce': 'fa-brands fa-wordpress',
};

const generateIconClass = (name) => {
  if (!name) return 'fa-solid fa-code';
  
  const normalized = name.toLowerCase().trim();
  
  // Check exact match first
  if (iconMap[normalized]) {
    return iconMap[normalized];
  }
  
  // Check partial matches (e.g., "Node JS" contains "node")
  for (const [key, value] of Object.entries(iconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Fallback to generic code icon
  return 'fa-solid fa-code';
};

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    level: 'Beginner', 
    category: 'Frontend',
    icon: '' 
  });

  // 1. Fetch Skills on Load
  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load skills", err));
  }, []);

  // 2. Sync icon field whenever name input changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, icon: generateIconClass(prev.name) }));
  }, [formData.name]);

  // 3. Handle Add Skill (POST)
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const savedSkill = await res.json();
        setSkills([savedSkill, ...skills]);
        setFormData({ name: '', level: 'Beginner', category: 'Frontend', icon: '' });
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Failed to add'}`);
      }
    } catch (err) {
      alert("Network error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Delete (DELETE with URL Param)
  const executeDelete = async () => {
    if (!deletingId) return;

    const idToRemove = deletingId;
    setDeletingId(null); 

    setSkills(prev => prev.filter(s => s._id !== idToRemove));

    try {
      const res = await fetch(`/api/skills?id=${idToRemove}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert("Server failed to delete. Refreshing...");
        const refresh = await fetch('/api/skills');
        const data = await refresh.json();
        setSkills(data);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', padding: '1rem' }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />



      {/* LEFT: FORM SECTION */}
      <section className="glass" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
        <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontFamily: 'var(--font-fredoka)' }}>
          🚀 Add Technical Skill
        </h2>
        
        {/* ICON PREVIEW BOX */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2rem', background: 'rgba(255,255,255,0.03)', 
          borderRadius: '16px', marginBottom: '2rem', border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <i className={`${formData.icon} fa-4x`} style={{ color: 'var(--accent)', transition: 'all 0.3s ease' }}></i>
          <p style={{ fontSize: '0.75rem', marginTop: '15px', opacity: 0.5, letterSpacing: '1px' }}>
            CLASS: {formData.icon}
          </p>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.4rem', display: 'block' }}>Skill Name</label>
            <input 
              type="text" placeholder="e.g. React, Node JS, Python" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.4rem', display: 'block' }}>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                  <option value="Fulstack">fulstack</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.4rem', display: 'block' }}>Expertise</label>
              <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                <option value="vibe-coder">Vibe-coder</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="modern-btn" style={{ marginTop: '1rem' }}>
            {loading ? 'Adding to DB...' : 'Add to Tech Stack'}
          </button>
        </form>
      </section>

      {/* RIGHT: LIST SECTION */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Current Stack ({skills.length})</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {skills.map((skill) => (
            <div key={skill._id} className="glass" style={{ 
              padding: '1.2rem', display: 'flex', justifyContent: 'space-between', 
              alignItems: 'center', background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ 
                  width: '45px', height: '45px', display: 'grid', placeItems: 'center',
                  background: 'rgba(var(--accent-rgb), 0.1)', borderRadius: '10px'
                }}>
                  <i className={`${skill.icon || 'fa-solid fa-code'} fa-xl`} style={{ color: 'var(--accent)' }}></i>
                </div>
                <div>
                  <b style={{ fontSize: '1.1rem', display: 'block' }}>{skill.name}</b>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {skill.category} • {skill.level}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setDeletingId(skill._id)}
                style={{ 
                  background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', 
                  border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#ff4d4d'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 77, 77, 0.1)'}
              >
                <i className="fa-solid fa-trash-can" style={{ pointerEvents: 'none' }}></i>
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.3 }}>
              <i className="fa-solid fa-layer-group fa-3x" style={{ marginBottom: '1rem' }}></i>
              <p>Your stack is empty.</p>
            </div>
          )}
        </div>
      </section>

      {/* OVERLAY: DELETE CONFIRMATION */}
      {deletingId && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', 
          backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass" style={{ 
            padding: '2.5rem', textAlign: 'center', maxWidth: '380px', 
            border: '1px solid rgba(255, 77, 77, 0.3)', boxShadow: '0 0 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ color: '#ff4d4d', fontSize: '3.5rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>Are you sure?</h3>
            <p style={{ opacity: 0.7, margin: '1rem 0 2rem 0', lineHeight: '1.5' }}>
              This will permanently remove the skill from your portfolio and database.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setDeletingId(null)} className="modern-btn" style={{ background: 'rgba(255,255,255,0.1)', flex: 1 }}>
                Keep it
              </button>
              <button onClick={executeDelete} className="modern-btn" style={{ background: '#ff4d4d', flex: 1 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}