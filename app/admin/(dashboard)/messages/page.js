import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";

export default async function AdminMessages() {
  await connectDB();
  const messages = await Contact.find().sort({ createdAt: -1 });

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fredoka)', marginBottom: '2rem' }}>Inbox</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => (
          <div key={msg._id} className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--accent)' }}>{msg.name}</strong>
              <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{msg.email}</p>
            <p style={{ opacity: 0.8 }}>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}