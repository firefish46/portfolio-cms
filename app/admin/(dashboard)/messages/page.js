import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import SwipeableMessage from "./SwipeableMessage";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function AdminMessages() {
  await connectDB();
  
  // .lean() is good for performance
  const rawMessages = await Contact.find().sort({ createdAt: -1 }).lean();
  
  // Manually convert _id to string to avoid serialization warnings in Next.js
  const messages = rawMessages.map(msg => ({
    ...msg,
    _id: msg._id.toString(),
  }));

  return (
    <div className="responsive-card" style={{ width: '90dvw', maxWidth: '800px', margin: '0 auto', position: 'relative', padding: '1rem' }}>
      <h1 className="fredoka-regular" style={{ marginBottom: '2rem' }}>Inbox</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 ? (
          <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ opacity: 0.5 }}>No messages in your inbox yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <SwipeableMessage key={msg._id} msg={msg} />
          ))
        )}
      </div>
    </div>
  );
}