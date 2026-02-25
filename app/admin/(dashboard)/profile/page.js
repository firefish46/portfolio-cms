'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff,Loader2 } from 'lucide-react';

// ─── Password strength checker ─────────────────────────
function getPasswordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8)           score++;
  if (pw.length >= 12)          score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;

  if (score <= 1) return { label: 'Very Weak',  color: '#ff4d4d', width: '20%' };
  if (score === 2) return { label: 'Weak',       color: '#ff944d', width: '40%' };
  if (score === 3) return { label: 'Fair',       color: '#ffd84d', width: '60%' };
  if (score === 4) return { label: 'Strong',     color: '#7cdd6f', width: '80%' };
  return              { label: 'Very Strong', color: '#4dffb4', width: '100%' };
}

// ─── Step banner shown inside the security section ─────
function PasswordBanner({ state }) {
  if (!state) return null;

  const map = {
    idle:    { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)',  icon: '🔒', color: 'inherit'       },
    loading: { bg: 'rgba(124,111,255,0.12)', border: 'var(--accent,#7c6fff)', icon: '⏳', color: 'var(--accent)'  },
    success: { bg: 'rgba(77,255,180,0.1)',   border: '#4dffb4',               icon: '✅', color: '#4dffb4'        },
    error:   { bg: 'rgba(255,77,77,0.1)',    border: '#ff4d4d',               icon: '❌', color: '#ff4d4d'        },
    warning: { bg: 'rgba(255,212,77,0.1)',   border: '#ffd44d',               icon: '⚠️', color: '#ffd44d'        },
  };

  const s = map[state.type] || map.idle;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      padding: '0.9rem 1.1rem', borderRadius: '10px',
      background: s.bg, border: `1px solid ${s.border}`,
      marginBottom: '1.25rem', transition: 'all 0.3s ease'
    }}>
      <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
      <div>
        <p style={{ margin: 0, fontWeight: 600, color: s.color, fontSize: '0.92rem' }}>
          {state.title}
        </p>
        {state.detail && (
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', opacity: 0.75, lineHeight: 1.5 }}>
            {state.detail}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminProfile() {
  const [user, setUser] = useState({
    name: '', email: '', bio: '', avatar: '', title: '',
    location: '', available: true,
    socials: { github: '', linkedin: '', twitter: '' }
  });

// ── NEW: Initial Loading State ───────────────────────
  const [isLoading, setIsLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  // ── Password state ───────────────────────────────────
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw]       = useState({ current: false, new: false, confirm: false });
  const [pwStatus, setPwStatus]   = useState(null);   // { type, title, detail }
  const [pwLoading, setPwLoading] = useState(false);

  // ── Derived password validation ──────────────────────
  const strength        = getPasswordStrength(passwords.new);
  const newTooShort     = passwords.new.length > 0 && passwords.new.length < 8;
  const sameAsCurrent   = passwords.new.length > 0 && passwords.new === passwords.current;
  const newMismatch     = passwords.confirm.length > 0 && passwords.new !== passwords.confirm;
  const newMatch        = passwords.confirm.length > 0 && passwords.new === passwords.confirm;
  const submitDisabled  = pwLoading || newTooShort || sameAsCurrent || newMismatch
                          || !passwords.current || !passwords.new || !passwords.confirm;

                          
  useEffect(() => {
    setIsLoading(true); // Start loading
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data) setUser({
          name:      data.name      || '',
          email:     data.email     || '',
          bio:       data.bio       || '',
          avatar:    data.avatar    || '',
          title:     data.title     || '',
          location:  data.location  || '',
          available: data.available ?? true,
          socials: {
            github:   data.socials?.github   || '',
            linkedin: data.socials?.linkedin || '',
            twitter:  data.socials?.twitter  || '',
          }
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUser({ ...user, avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
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
      setIsEditing(false);
      setTimeout(() => setProfileStatus(''), 3000);
    }
  };

  // ── Password change — full step-by-step feedback ─────
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Client-side guard rails shown before any request
    if (!passwords.current) {
      return setPwStatus({ type: 'warning', title: 'Current password required', detail: 'Enter your existing password so we can verify your identity.' });
    }
    if (newTooShort) {
      return setPwStatus({ type: 'warning', title: 'New password too short', detail: 'Your new password must be at least 8 characters long.' });
    }
    if (sameAsCurrent) {
      return setPwStatus({ type: 'warning', title: 'Choose a different password', detail: 'Your new password must differ from your current password.' });
    }
    if (newMismatch) {
      return setPwStatus({ type: 'warning', title: 'Passwords don\'t match', detail: 'The confirmation field doesn\'t match the new password you entered.' });
    }

    // Optimistic loading state
    setPwLoading(true);
    setPwStatus({ type: 'loading', title: 'Verifying & updating…', detail: 'Please wait while we securely apply the change.' });

    try {
      const res  = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: passwords.current, new: passwords.new }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setPwStatus({
          type: 'success',
          title: 'Password updated successfully!',
          detail: 'Your account is now secured with the new password. Active sessions on other devices may require a fresh login.',
        });
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => setPwStatus(null), 7000);
      } else {
        // Map HTTP status codes → human-readable guidance
        const detail =
          res.status === 401 ? 'The current password you entered is incorrect. Please double-check and try again.' :
          res.status === 400 ? (data?.message || 'The request was invalid. Please review your input and try again.') :
          res.status === 429 ? 'Too many attempts. Please wait a few minutes before trying again.' :
          res.status >= 500  ? 'A server error occurred. Please try again in a moment.' :
          (data?.message     || 'An unexpected error occurred. Please try again.');

        setPwStatus({ type: 'error', title: 'Password update failed', detail });
      }
    } catch {
      setPwStatus({
        type: 'error',
        title: 'Connection error',
        detail: 'Could not reach the server. Please check your internet connection and try again.',
      });
    } finally {
      setPwLoading(false);
    }
  };

  // ── Eye-toggle button ────────────────────────────────
const EyeBtn = ({ field }) => (
  <button
    type="button"
    onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
    tabIndex={-1}
    aria-label={showPw[field] ? 'Hide password' : 'Show password'}
    style={{
      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer',
      opacity: 0.5, color: 'inherit', padding: '4px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.15s'
    }}
  >
    {/* Use icons instead of emojis */}
    {showPw[field] ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
);
if (isLoading) {
  return (
    <div className='responsive-card' style={{
      maxWidth: '800px', margin: '2rem auto', width: '90dvw',
      display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem'
    }}>
      <header style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
         <div className="skeleton" style={{ height: '35px', width: '220px' }} />
      </header>

      <section className='responsive-card' style={{ padding: '2.5rem', width: '100%' }}>
        {/* Profile Image Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div className="skeleton" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Full Name & Job Title */}
          <div>
            <div className="skeleton" style={{ height: '14px', width: '80px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '12px' }} />
          </div>

          <div>
            <div className="skeleton" style={{ height: '14px', width: '70px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '12px' }} />
          </div>

          {/* Email & Location Split Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div className="skeleton" style={{ height: '14px', width: '100px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '12px' }} />
            </div>
            <div>
              <div className="skeleton" style={{ height: '14px', width: '70px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '12px' }} />
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <div className="skeleton" style={{ height: '14px', width: '90px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '120px', width: '100%', borderRadius: '12px' }} />
          </div>

          {/* Github / Socials */}
          <div>
            <div className="skeleton" style={{ height: '14px', width: '60px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '12px' }} />
          </div>
        </div>
      </section>

      {/* Security Section Skeleton */}
      <section className='responsive-card' style={{ padding: '2rem', borderTop: '4px solid #333' }}>
        <div className="skeleton" style={{ height: '24px', width: '180px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '12px', width: '100%', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '12px', width: '80%', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '8px' }} />
      </section>
    </div>
  );
}
  return (
    <div className='responsive-card' style={{
      maxWidth: '800px', margin: '2rem auto', width: '90dvw',
      display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem'
    }}>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
      {/* Header */}
      <header className='singlerowdiv' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)' }}>Account Settings</h1>
        
      </header>
{!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-btn" style={{ background: 'var(--accent)',padding:'1%' }}>
           <i className="fa-solid fa-user-gear"></i> Edit Profile
          </button>
        )}
      {/* Profile save status */}
      {profileStatus && (
        <div className='responsive-card' style={{ padding: '1rem', background: 'rgba(var(--accent-rgb),0.1)', borderLeft: '4px solid var(--accent)', fontWeight: 'bold' }}>
          {profileStatus}
        </div>
      )}

      {/* ── SECTION: PERSONAL & BIO ── */}
      <section className='responsive-card' style={{ padding: '2rem', width: '100%',opacity: isEditing ? '1' : '.5' }}>
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
              {isEditing && <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.7rem', width: '150px' }} />}
            </div>

            {/* Info grid */}
            <div style={{ flex: 1, display: 'grid', gap: '1rem', minWidth: '250px' }}>
              <div className="input-group">
                <label style={{ width: '100%' }}>Full Name</label>
                <input style={{ width: '100%' }} disabled={!isEditing} type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label style={{ width: '100%' }}>Job Title</label>
                <input style={{ width: '100%' }} disabled={!isEditing} type="text" placeholder="e.g. Full Stack Developer" value={user.title} onChange={(e) => setUser({ ...user, title: e.target.value })} />
              </div>
            </div>
          </div>

          <div className='responsive-card' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="input-group .responsive-card">
              <label>Email Address</label>
              <input disabled={!isEditing} type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </div>
            <div  className='responsive-card'>
              <label>Location</label>
              <input disabled={!isEditing} type="text" placeholder="City, Country" value={user.location} onChange={(e) => setUser({ ...user, location: e.target.value })} />
            </div>
          </div>

          <div  className='responsive-card' style={{ marginBottom: '1.5rem' }}>
            <label>Bio / About Me</label>
            <textarea
              disabled={!isEditing} rows="4" value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              style={{ background: 'rgba(255,255,255,0.05)', width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
            />
          </div>

          <div className='responsive-card' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem',border:'none' }}>
            {['github', 'linkedin', 'twitter'].map((network) => (
              <div key={network} className='responsive-card'>
                <label style={{ textTransform: 'capitalize' }}>{network}</label>
                <input
                  disabled={!isEditing} type="text"
                  value={user.socials[network]}
                  onChange={(e) => setUser({ ...user, socials: { ...user.socials, [network]: e.target.value } })}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <input disabled={!isEditing} type="checkbox" checked={user.available} onChange={(e) => setUser({ ...user, available: e.target.checked })} style={{ width: '20px', height: '20px' }} />
            <label>Available for Hire / Projects</label>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="modern-btn">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="modern-btn secondary" style={{ background: '#44444469' }}>Cancel</button>
            </div>
          )}
        </form>
      </section>

      {/* ── SECTION: SECURITY ── */}
      <section  className='responsive-card' style={{ padding: '2rem', borderTop: '4px solid #ff4444' }}>
        <h2 style={{ marginBottom: '0.4rem' }}>Security & Password</h2>
        <p style={{ opacity: 0.45, fontSize: '0.82rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Use a strong, unique password — at least 8 characters with a mix of uppercase letters, numbers, and symbols.
        </p>

        {/* Step-by-step feedback banner */}
        <PasswordBanner state={pwStatus} />

        <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1.25rem' }}>

          {/* ① Current Password */}
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>
              Current Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw.current ? 'text' : 'password'}
                placeholder="Enter your current password"
                value={passwords.current}
                autoComplete="current-password"
                style={{ width: '100%', paddingRight: '2.5rem' }}
                onChange={(e) => { setPasswords({ ...passwords, current: e.target.value }); setPwStatus(null); }}
              />
              <EyeBtn field="current" />
            </div>
          </div>

          {/* ② New Password + strength meter */}
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw.new ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={passwords.new}
                autoComplete="new-password"
                style={{
                  width: '100%', paddingRight: '2.5rem',
                  borderColor: newTooShort ? '#ff4d4d' : sameAsCurrent ? '#ffd44d' : undefined
                }}
                onChange={(e) => { setPasswords({ ...passwords, new: e.target.value }); setPwStatus(null); }}
              />
              <EyeBtn field="new" />
            </div>

            {/* Strength bar — only visible when typing */}
            {passwords.new && strength && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px',
                    width: strength.width, background: strength.color,
                    transition: 'width 0.35s ease, background 0.35s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', minHeight: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>
                    {strength.label}
                  </span>
                  {newTooShort   && <span style={{ fontSize: '0.72rem', color: '#ff4d4d' }}>Min. 8 characters required</span>}
                  {sameAsCurrent && <span style={{ fontSize: '0.72rem', color: '#ffd44d' }}>Must differ from current password</span>}
                </div>
              </div>
            )}
          </div>

          {/* ③ Confirm Password */}
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw.confirm ? 'text' : 'password'}
                placeholder="Re-enter your new password"
                value={passwords.confirm}
                autoComplete="new-password"
                style={{
                  width: '100%', paddingRight: '2.5rem',
                  borderColor: newMismatch ? '#ff4d4d' : newMatch ? '#4dffb4' : undefined
                }}
                onChange={(e) => { setPasswords({ ...passwords, confirm: e.target.value }); setPwStatus(null); }}
              />
              <EyeBtn field="confirm" />
            </div>
            {newMismatch && <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: '#ff4d4d' }}>✗ Passwords do not match</p>}
            {newMatch    && <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: '#4dffb4' }}>✓ Passwords match</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="modern-btn secondary"
            disabled={submitDisabled}
            style={{ opacity: submitDisabled ? 0.45 : 1, cursor: submitDisabled ? 'not-allowed' : 'pointer' }}
          >
            {pwLoading ? '⏳ Updating…' : '🔐 Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
}