'use client';
import { useState, useEffect } from 'react';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', category: 'Frontend' });

  // 1. Fetch Skills
  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []));
  }, []);

  // 2. Add Skill
  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkill),
    });

    if (res.ok) {
      const savedSkill = await res.json();
      setSkills([...skills, savedSkill]);
      setNewSkill({ name: '', level: 'Beginner', category: 'Frontend' });
    }
  };

  // 3. Delete Skill
  const handleDelete = async (id) => {
    const res = await fetch('/api/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setSkills(skills.filter((s) => s._id !== id));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Form Section */}
      <section className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
        <h2>Add Technical Skill</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="Skill Name (e.g. React)" 
            value={newSkill.name}
            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
            required
          />
          
          <select 
            value={newSkill.category} 
            onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Tools">Tools</option>
          </select>

          <select 
            value={newSkill.level} 
            onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          <button type="submit">Add to Stack</button>
        </form>
      </section>

      {/* List Section */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2>Current Stack</h2>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {skills.map((skill) => (
            <div key={skill._id} className="glass" style={{ 
              padding: '0.8rem 1rem', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.05)'
            }}>
              <div>
                <b style={{ color: 'var(--accent)' }}>{skill.name}</b>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '10px' }}>{skill.category}</span>
              </div>
              <button 
                onClick={() => handleDelete(skill._id)}
                style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
          {skills.length === 0 && <p style={{ opacity: 0.5 }}>No skills added yet.</p>}
        </div>
      </section>
    </div>
  );
}