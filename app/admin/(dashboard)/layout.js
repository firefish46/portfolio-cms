'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { 
        method: 'POST' 
      });

      if (res.ok) {
        router.push('/admin/login');
        router.refresh(); 
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <aside className="glass-nav" style={{ 
        width: '280px', 
        margin: '1rem', 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 2rem)',
        position: 'sticky',
        top: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.05)',

      }}>
        <h2 style={{ 
          color: 'var(--accent)', 
          fontSize: '1.8rem', 
          marginBottom: '2rem',
          fontFamily: 'var(--font-fredoka)'
        }}>
          CMS Admin
        </h2>
        
        <nav className='admin-nav' style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/dashboard" className="nav-link">📊 Dashboard</Link>
          <Link href="/admin/projects" className="nav-link">📂 Projects</Link>
          <Link href="/admin/skills" className="nav-link">🛠️ Skills</Link>
          <Link href="/admin/profile" className="nav-link">👤 Profile</Link>
            <Link href="/admin/about" className="nav-link">📝 about</Link>
          
          {/* NEW CONTACT MESSAGES LINK */}
          <Link href="/admin/messages" className="nav-link">✉️ Messages</Link>
          
          <Link href="/admin/settings" className="nav-link">⚙️ Settings</Link>

          <div style={{ marginTop: 'auto' }}>
            <button 
              className="modern-btn secondary" 
              id='logout'
              style={{ 
                width: '100%',
                borderColor: 'rgba(255, 77, 77, 0.4)', 
                color: '#ff4d4d' 
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem 4rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}