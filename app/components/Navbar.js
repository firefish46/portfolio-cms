'use client'; // Required for scroll effects or mobile menus
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Don't show this navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1100px',
      padding: '0.8rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{ 
        fontFamily: 'var(--font-fredoka)', 
        fontSize: '1.4rem', 
        fontWeight: '700',
        letterSpacing: '-0.5px'
      }}>
        Mehedi<span style={{ color: 'var(--accent)' }}>.</span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <NavLink href="/" active={pathname === '/'}>Home</NavLink>
        <NavLink href="/projects" active={pathname === '/projects'}>Work</NavLink>
        <NavLink href="/contact" active={pathname === '/contact'}>Contact</NavLink>
        
        {/* Call to Action Button */}
        <Link href="/contact">
          <button className="modern-btn" style={{ 
            padding: '0.5rem 1.2rem', 
            fontSize: '0.85rem',
            width: 'auto' 
          }}>
            Hire Me
          </button>
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }) {
  return (
    <Link href={href} style={{
      textDecoration: 'none',
      color: active ? 'var(--accent)' : 'var(--foreground)',
      fontWeight: active ? '700' : '500',
      fontSize: '0.95rem',
      transition: '0.2s opacity',
      opacity: active ? 1 : 0.7
    }}>
      {children}
    </Link>
  );
}