'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminProfile() {
  // 1. Expanded State to match Mongoose Model
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    title: '',
    location: '',
    available: true,
    socials: { github: '', linkedin: '', twitter: '' }
  });

  const [isEditing, setIsEditing] = useState(false); // Toggle for Edit mode
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [status, setStatus] = useState('');

  // 2. Fetch current admin details
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser({
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            title: data.title || '',
            location: data.location || '',
            available: data.available ?? true,
            socials: {
              github: data.socials?.github || '',
              linkedin: data.socials?.linkedin || '',
              twitter: data.socials?.twitter || ''
            }
          });
        }
      });
  }, []);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus('Updating...');
    
    const { _id, ...updateData } = user;

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setStatus('Profile updated successfully!');
      setIsEditing(false); // Switch back to view mode
      setTimeout(() => setStatus(''), 3000);
    }
  };

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
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus('Error: Current password incorrect.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)' }}>Account Settings</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="modern-btn" style={{ background: 'var(--accent)' }}>
            Edit Profile
          </button>
        )}
      </header>

      {status && (
        <div style={{ padding: '1rem', background: 'rgba(var(--accent-rgb), 0.1)', borderLeft: '4px solid var(--accent)', fontWeight: 'bold' }}>
          {status}
        </div>
      )}

      {/* SECTION: PERSONAL & BIO */}
      <section className="glass" style={{ padding: '2rem', width: '100%' }}>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            {/* Avatar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#222', border: '2px solid var(--accent)' }}>
                {user.avatar ? (
                  <Image src={user.avatar} alt="Profile"  width={500}
      height={500}style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'grid', placeItems: 'center', height: '100%', opacity: 0.5 }}>No Image</div>
                )}
              </div>
              {isEditing && <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.7rem', width: '150px' }} />}
            </div>

            {/* Info Column */}
            <div style={{ flex: 1, display: 'grid', gap: '1rem', minWidth: '250px' }}>
              <div className="input-group">
                <label style={{width:'100%', }}>Full Name</label>
                <input  style={{width:'100%', }} disabled={!isEditing} type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label style={{width:'100%', }}>Job Title</label>
                <input style={{width:'100%', }} disabled={!isEditing} type="text" placeholder="e.g. Full Stack Developer" value={user.title} onChange={(e) => setUser({...user, title: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label>Email Address</label>
              <input disabled={!isEditing} type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input disabled={!isEditing} type="text" placeholder="City, Country" value={user.location} onChange={(e) => setUser({...user, location: e.target.value})} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>Bio / About Me</label>
            <textarea 
              disabled={!isEditing}
              rows="4" 
              value={user.bio} 
              onChange={(e) => setUser({...user, bio: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.05)',  width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
            />
          </div>

          {/* Missing Model Fields: Socials & Availability */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label>GitHub User</label>
              <input disabled={!isEditing} type="text" value={user.socials.github} onChange={(e) => setUser({...user, socials: {...user.socials, github: e.target.value}})} />
            </div>
            <div className="input-group">
              <label>LinkedIn</label>
              <input disabled={!isEditing} type="text" value={user.socials.linkedin} onChange={(e) => setUser({...user, socials: {...user.socials, linkedin: e.target.value}})} />
            </div>
            <div className="input-group">
              <label>Twitter</label>
              <input disabled={!isEditing} type="text" value={user.socials.twitter} onChange={(e) => setUser({...user, socials: {...user.socials, twitter: e.target.value}})} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <input 
                disabled={!isEditing} 
                type="checkbox" 
                checked={user.available} 
                onChange={(e) => setUser({...user, available: e.target.checked})} 
                style={{ width: '20px', height: '20px' }}
             />
             <label>Available for Hire / Projects</label>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="modern-btn">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="modern-btn secondary" style={{ background: '#444' }}>Cancel</button>
            </div>
          )}
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