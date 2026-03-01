'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

function EyeBtn({ field, showPw, setShowPw }) {
  return (
    <button type="button" tabIndex={-1}
      onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
      aria-label={showPw[field] ? 'Hide password' : 'Show password'}
      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5,
        color: 'inherit', padding: '4px', display: 'flex', alignItems: 'center' }}
    >
      {showPw[field] ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw]       = useState({ current: false, new: false, confirm: false });
  const [status, setStatus]       = useState(null);
  const [loading, setLoading]     = useState(false);

  const strength      = getPasswordStrength(passwords.new);
  const newTooShort   = passwords.new.length > 0 && passwords.new.length < 8;
  const sameAsCurrent = passwords.new.length > 0 && passwords.new === passwords.current;
  const newMismatch   = passwords.confirm.length > 0 && passwords.new !== passwords.confirm;
  const newMatch      = passwords.confirm.length > 0 && passwords.new === passwords.confirm;
  const submitDisabled = loading || newTooShort || sameAsCurrent || newMismatch
                         || !passwords.current || !passwords.new || !passwords.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'loading', title: 'Verifying & updating…', detail: 'Please wait.' });

    try {
      const res  = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: passwords.current, new: passwords.new }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ type: 'success', title: 'Password updated!', detail: 'Your account is secured with the new password.' });
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => router.push('/admin/profile'), 2500);
      } else {
        const detail =
          res.status === 401 ? 'Current password is incorrect.' :
          res.status === 429 ? 'Too many attempts. Please wait.' :
          res.status >= 500  ? 'Server error. Try again shortly.' :
          data?.message || 'An unexpected error occurred.';
        setStatus({ type: 'error', title: 'Update failed', detail });
      }
    } catch {
      setStatus({ type: 'error', title: 'Connection error', detail: 'Check your internet and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    loading: { bg: 'rgba(124,111,255,0.12)', border: 'var(--accent)', icon: '⏳', color: 'var(--accent)' },
    success: { bg: 'rgba(77,255,180,0.1)',   border: '#4dffb4',       icon: '✅', color: '#4dffb4'       },
    error:   { bg: 'rgba(255,77,77,0.1)',    border: '#ff4d4d',       icon: '❌', color: '#ff4d4d'       },
  };

  return (
    <div className="responsive-card" style={{ maxWidth: '520px', margin: '2rem auto', width: '90dvw', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)' }}>Change Password</h1>
        <button onClick={() => router.back()} className="modern-btn secondary">← Back</button>
      </header>

      <section className="responsive-card" style={{ padding: '2rem', borderTop: '4px solid #ff4444' }}>
        <p style={{ opacity: 0.45, fontSize: '0.82rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Use a strong, unique password — at least 8 characters with uppercase, numbers, and symbols.
        </p>

        {/* Status banner */}
        {status && (() => {
          const s = statusStyles[status.type];
          return (
            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.9rem 1.1rem', borderRadius: '10px',
              background: s.bg, border: `1px solid ${s.border}`, marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: s.color, fontSize: '0.92rem' }}>{status.title}</p>
                {status.detail && <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', opacity: 0.75 }}>{status.detail}</p>}
              </div>
            </div>
          );
        })()}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>

          {/* Current password */}
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw.current ? 'text' : 'password'} placeholder="Enter current password"
                value={passwords.current} autoComplete="current-password"
                style={{ width: '100%', paddingRight: '2.5rem' }}
                onChange={(e) => { setPasswords({ ...passwords, current: e.target.value }); setStatus(null); }} />
              <EyeBtn field="current" showPw={showPw} setShowPw={setShowPw} />
            </div>
          </div>

          {/* New password */}
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw.new ? 'text' : 'password'} placeholder="At least 8 characters"
                value={passwords.new} autoComplete="new-password"
                style={{ width: '100%', paddingRight: '2.5rem', borderColor: newTooShort ? '#ff4d4d' : sameAsCurrent ? '#ffd44d' : undefined }}
                onChange={(e) => { setPasswords({ ...passwords, new: e.target.value }); setStatus(null); }} />
              <EyeBtn field="new" showPw={showPw} setShowPw={setShowPw} />
            </div>
            {passwords.new && strength && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '99px', width: strength.width, background: strength.color, transition: 'width 0.35s ease, background 0.35s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  {newTooShort   && <span style={{ fontSize: '0.72rem', color: '#ff4d4d' }}>Min. 8 characters</span>}
                  {sameAsCurrent && <span style={{ fontSize: '0.72rem', color: '#ffd44d' }}>Must differ from current</span>}
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw.confirm ? 'text' : 'password'} placeholder="Re-enter new password"
                value={passwords.confirm} autoComplete="new-password"
                style={{ width: '100%', paddingRight: '2.5rem', borderColor: newMismatch ? '#ff4d4d' : newMatch ? '#4dffb4' : undefined }}
                onChange={(e) => { setPasswords({ ...passwords, confirm: e.target.value }); setStatus(null); }} />
              <EyeBtn field="confirm" showPw={showPw} setShowPw={setShowPw} />
            </div>
            {newMismatch && <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: '#ff4d4d' }}>✗ Passwords do not match</p>}
            {newMatch    && <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: '#4dffb4' }}>✓ Passwords match</p>}
          </div>

          <button type="submit" className="modern-btn secondary" disabled={submitDisabled}
            style={{ opacity: submitDisabled ? 0.45 : 1, cursor: submitDisabled ? 'not-allowed' : 'pointer' }}>
            {loading ? '⏳ Updating…' : '🔐 Update Password'}
          </button>

        </form>
      </section>
    </div>
  );
}