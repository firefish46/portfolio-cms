export default function Footer() {
  return (
    <footer style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
      <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Mehedi Portfolio. Built with Next.js 16 & MongoDB.
      </p>
    </footer>
  );
}