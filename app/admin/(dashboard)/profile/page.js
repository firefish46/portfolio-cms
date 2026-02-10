'use client';
import { useState, useEffect } from 'react';

export default function AdminProfile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [status, setStatus] = useState('');

  // 1. Fetch current admin details
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setUser({ name: data.name, email: data.email }));
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus('Updating...');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (res.ok) setStatus('Profile updated successfully!');
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
      setStatus('Password changed!');
      setPasswords({ current: '', new: '' });
    } else {
      setStatus('Error: Current password incorrect.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Admin Profile</h1>
        {status && <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{status}</p>}
      </header>

      {/* Profile Details */}
      <section className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Personal Details</h2>
        <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1rem' }}>
          <label>Name</label>
          <input 
            type="text" 
            value={user.name} 
            onChange={(e) => setUser({...user, name: e.target.value})} 
          />
          <label>Email</label>
          <input 
            type="email" 
            value={user.email} 
            onChange={(e) => setUser({...user, email: e.target.value})} 
          />
          <button type="submit">Update Info</button>
        </form>
      </section>

      {/* Security Section */}
      <section className="glass" style={{ padding: '2rem', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Security</h2>
        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1rem' }}>
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
          <button type="submit" style={{ background: '#333' }}>Change Password</button>
        </form>
      </section>
    </div>
  );
}