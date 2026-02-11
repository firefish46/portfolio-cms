'use client';
import { useState, useRef } from 'react';
import DeleteButton from "./DeleteButton";

export default function SwipeableMessage({ msg }) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // Changed to state
  const startX = useRef(0);

  if (!msg || !msg._id) return null;

  const handleStart = (e) => {
    setIsDragging(true);
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    
    // Only allow swiping left, limit to -150px
    if (diff <= 0 && diff > -150) {
      setOffset(diff);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    // Snap logic: if swiped past -70px, lock it at -100px
    if (offset < -70) {
      setOffset(-100);
    } else {
      setOffset(0);
    }
  };

  return (
    <div 
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', userSelect: 'none' }}
      onMouseLeave={handleEnd}
    >
      {/* BACKGROUND ACTION LAYER */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '100px',
        background: 'rgba(133, 8, 8, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <DeleteButton id={msg._id} />
      </div>

      {/* FOREGROUND MESSAGE LAYER */}
      <div 
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        style={{
          transform: `translateX(${offset}px)`,
          // Now using state variable 'isDragging', which is safe for render
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          position: 'relative',
          zIndex: 2,
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: 'var(--background, #0a0a0a)' 
        }}
      >
        <div id='msg' className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: 'var(--accent)' }}>{msg.name || "Anonymous"}</strong>
              <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{msg.email}</p>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.4' }}>{msg.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}