'use client';
import { useState, useEffect } from 'react';

export default function AdminProfile() {
  const [user, setUser] = useState({ name: '', email: '', bio: '', avatar: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [status, setStatus] = useState('');

  // 1. Fetch current admin details
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data) setUser({ 
          name: data.name || '', 
          email: data.email || '', 
          bio: data.bio || '', 
          avatar: data.avatar || '' 
        });
      });
  }, []);

  // 2. Handle Image Conversion to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Update Profile Info (Bio, Name, Avatar)
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setStatus('Updating...');
  
  // Strip out the _id to avoid Mongoose immutable errors
  const { _id, ...updateData } = user;

  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  
  if (res.ok) {
    const data = await res.json();
    setUser(data); // This refreshes the state with saved data
    setStatus('Profile updated successfully!');
  }
};
  // 4. Change Password Logic
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus('Changing password...');
    const res = await fetch('/api/admin/profile/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwords),
    });
    if (res.ok) {
      setStatus('Password changed successfully!');
      setPasswords({ current: '', new: '' });
    } else {
      setStatus('Error: Current password incorrect.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem', alignItems:'center' }}>
      <header>
        <h1 style={{ fontFamily: 'var(--font-fredoka)' }}>Account Settings</h1>
        {status && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(var(--accent-rgb), 0.1)', 
            borderLeft: '4px solid var(--accent)',
            margin: '1rem 0',
            fontWeight: 'bold'
          }}>
            {status}
          </div>
        )}
      </header>

      {/* SECTION: PERSONAL & BIO */}
      <section id='profile' className="glass" style={{ padding: '1rem', flexDirection: 'column', display: 'flex', gap: '2rem', width: '100%' }}>
        
        <form onSubmit={handleUpdateProfile} style={{ display: 'inline-block', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Public Profile</h2>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              overflow: 'hidden', background: '#222', border: '2px solid var(--accent)' 
            }}>
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%', opacity: 0.5 }}>No Image</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.8rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label>Full Name</label>
              <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label>Email Address</label>
              <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label>Bio / About Me</label>
            <textarea 
              rows="5" 
              value={user.bio} 
              onChange={(e) => setUser({...user, bio: e.target.value})}
              placeholder="This will appear on your homepage..."
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',marginBottom:'1rem' }}
            />
          </div>

          <button type="submit" className="modern-btn">Save Profile Changes</button>
        </form>
      </section>

      {/* SECTION: SECURITY */}
      <section className="glass" style={{ padding: '2rem', borderTop: '4px solid #ff4444' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Security & Password</h2>
        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input 
              type="password" 
              placeholder="Current Password" 
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            />
          </div>
          <button className="modern-btn secondary" type="submit">Update Password</button>
        </form>
      </section>
    </div>
  );
}