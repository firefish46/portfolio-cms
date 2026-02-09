'use client';
import Link from 'next/link';
import '../globals.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout-wrapper">
      
      <aside className="glass" style={{ 
        width: '260px', 
        margin: '1rem', 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        height: 'calc(100vh - 2rem)',
        position: 'sticky',
        top: '1rem'
      }}>
        <h2 style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1rem' }}>CMS Admin</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin/dashboard" className="nav-link">📊 Dashboard</Link>
          <Link href="/admin/projects" className="nav-link">📂 Projects</Link>
          <Link href="/admin/skills" className="nav-link">🛠️ Skills</Link>
          <Link href="/admin/profile" className="nav-link">👤 Profile</Link>
          <Link href="/admin/settings" className="nav-link">⚙️ Settings</Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            className="glass" 
            style={{ 
              width: '100%', 
              padding: '0.8rem', 
              color: '#ff4d4d', 
              cursor: 'pointer',
              border: '1px solid rgba(255, 77, 77, 0.3)' 
            }}
            onClick={() => {/* logout logic next */}}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}