import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import SwipeableMessage from "./SwipeableMessage";

export default async function AdminMessages() {
  await connectDB();
  
  const rawMessages = await Contact.find().sort({ createdAt: -1 }).lean();
  const messages = JSON.parse(JSON.stringify(rawMessages));

  return (
    <div className="responsive-card" style={{width:'90dvw', maxWidth: '800px', margin: '0 auto', position: 'relative', padding: '1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-fredoka)', marginBottom: '2rem' }}>Inbox</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 ? (
          <p style={{ opacity: 0.5 }}>No messages in your inbox yet.</p>
        ) : (
          messages.map((msg) => (
            <SwipeableMessage key={msg._id} msg={msg} />
          ))
        )}
      </div>
    </div>
  );
}