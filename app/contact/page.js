import { handleContact } from "../actions";

export default function ContactPage() {
  return (
    <div style={{ padding: '1rem 0rem', maxWidth: '600px', margin: '0 0' }}>
      <h1 style={{ fontFamily: 'var(--font-fredoka)', marginBottom: '1rem' }}>Get in Touch</h1>
      <p style={{ marginBottom: '3rem', opacity: 0.7 }}>Have a project in mind? Let&apos;s build something great together.</p>

      <form action={handleContact} className="glass" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Your Name</label>
          <input name="name" type="text" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Email Address</label>
          <input name="email" type="email" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Message</label>
          <textarea name="message" rows="5" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}></textarea>
        </div>

        <button type="submit" className="modern-btn">Send Message</button>
      </form>
    </div>
  );
}