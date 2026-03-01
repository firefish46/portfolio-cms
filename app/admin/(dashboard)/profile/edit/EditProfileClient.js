'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function EditProfileClient({ initialProfile }) {
  const router = useRouter();
  const [user, setUser] = useState(initialProfile ?? {
    name: '', email: '', bio: '', avatar: '', title: '',
    location: '', available: true,
    socials: { github: '', linkedin: '', twitter: '' }
  });
  const [profileStatus, setProfileStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUser({ ...user, avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileStatus('Updating...');
    const { _id, ...updateData } = user;
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setProfileStatus('Profile updated successfully!');
      setTimeout(() => router.push('/admin/profile'), 1500);
    } else {
      setProfileStatus('Failed to update. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className='responsive-card' style={{
      maxWidth: '800px', margin: '2rem auto', width: '90dvw',
      display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem'
    }}>

      {/* Header */}
      <header className='singlerowdiv' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)' }} >Edit Profile</h1>
      </header>

      <button onClick={() => router.back()} className="edit-btn" style={{ padding: '1%', width: 'fit-content' }}>
        ← Back
      </button>

      {/* Profile save status */}
      {profileStatus && (
        <div className='responsive-card' style={{ padding: '1rem', background: 'rgba(var(--accent-rgb),0.1)', borderLeft: '4px solid var(--accent)', fontWeight: 'bold' }}>
          {profileStatus}
        </div>
      )}

      {/* Profile form section */}
      <section className='responsive-card' style={{ padding: '2rem', width: '100%', opacity: '1' }}>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#222', border: '2px solid var(--accent)' }}>
                {user.avatar
                  ? <Image src={user.avatar} alt="Profile" width={500} height={500} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ display: 'grid', placeItems: 'center', height: '100%', opacity: 0.5 }}>No Image</div>
                }
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.7rem', width: '150px' }} />
            </div>

            {/* Info grid */}
            <div style={{ flex: 1, display: 'grid', gap: '1rem', minWidth: '250px' }}>
              <div className="input-group">
                <label style={{ width: '100%' }}>Full Name</label>
                <input style={{ width: '100%' }} type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label style={{ width: '100%' }}>Job Title</label>
                <input style={{ width: '100%' }} type="text" placeholder="e.g. Full Stack Developer" value={user.title} onChange={(e) => setUser({ ...user, title: e.target.value })} />
              </div>
            </div>
          </div>

          <div className='responsive-card' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="input-group .responsive-card">
              <label>Email Address</label>
              <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </div>
            <div className='responsive-card'>
              <label>Location</label>
              <input type="text" placeholder="City, Country" value={user.location} onChange={(e) => setUser({ ...user, location: e.target.value })} />
            </div>
          </div>

          <div className='responsive-card' style={{ marginBottom: '1.5rem' }}>
            <label>Bio / About Me</label>
            <textarea
              rows="4" value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              style={{ background: 'rgba(255,255,255,0.05)', width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
            />
          </div>

          <div className='responsive-card' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem', border: 'none' }}>
            {['github', 'linkedin', 'twitter'].map((network) => (
              <div key={network} className='responsive-card'>
                <label style={{ textTransform: 'capitalize' }}>{network}</label>
                <input
                  type="text"
                  value={user.socials[network]}
                  onChange={(e) => setUser({ ...user, socials: { ...user.socials, [network]: e.target.value } })}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <input type="checkbox" checked={user.available} onChange={(e) => setUser({ ...user, available: e.target.checked })} style={{ width: '20px', height: '20px' }} />
            <label>Available for Hire / Projects</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="modern-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()} className="modern-btn secondary" style={{ background: '#44444469' }}>
              Cancel
            </button>
          </div>

        </form>
      </section>
    </div>
  );
}