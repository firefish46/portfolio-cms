'use client'; // Required for scroll effects or mobile menus
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Don't show this navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      width: '96%',
      maxWidth: '1800px',
      padding: '0.5rem 2rem',
      display: 'flex',
  
      zIndex: 1000,
    }}>
      <div className='navlink-container' style={{ 
        fontFamily: 'var(--font-family)', 
        fontSize: '1.4rem', 
        fontWeight: '700',
        letterSpacing: '-0.5px'
      }}>
        Mehedi<span style={{ color: 'var(--accent)' }}>.</span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <NavLink className="nav-link" href="/" active={pathname === '/'}>Home</NavLink>
        <NavLink className="nav-link" href="/projects" active={pathname === '/projects'}>Work</NavLink>
        <NavLink className="nav-link" href="/contact" active={pathname === '/contact'}>Contact</NavLink>
        
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
      fontSize: active ? '1.05rem' : '1rem',  
      fontWeight: active ? '600' : '500',
      position: 'relative',
      opacity: active ? 1 : 0.5,
      paddingBottom: '4px',
    }} className="group">
      {children}
      {/* The Underline Div */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: 'var(--accent)',
        transform: active ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease',
      }} className="underline-hover" />
      
 
    </Link>
  );
}
