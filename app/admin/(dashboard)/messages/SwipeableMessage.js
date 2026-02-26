'use client';
import { useState, useRef, useEffect } from 'react';
import DeleteButton from "./DeleteButton";
import { Undo2 } from 'lucide-react';

export default function SwipeableMessage({ msg }) {
  const [mounted, setMounted] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOptimisticallyDeleted, setIsOptimisticallyDeleted] = useState(false);
  const [isPermanentlyDeleted, setIsPermanentlyDeleted] = useState(false);
  const startX = useRef(0);
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!msg || !msg._id) return null;
  if (isPermanentlyDeleted) return null;

  // --- DELETE SEQUENCE ---
  const triggerDeleteSequence = () => {
    setIsOptimisticallyDeleted(true);

    timerRef.current = setTimeout(async () => {
      await performActualDelete();
    }, 5000);
  };

  const handleUndo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOptimisticallyDeleted(false);
    setOffset(0);
  };

  const performActualDelete = async () => {
    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg._id }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Delete failed");
      setIsOptimisticallyDeleted(false);
      setIsPermanentlyDeleted(true);
    } catch (err) {
      console.error(err);
      handleUndo();
      alert("Could not delete message. Restoring...");
    }
  };

  // --- SWIPE LOGIC ---
  const handleStart = (e) => {
    setIsDragging(true);
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    if (diff <= 0 && diff > -150) setOffset(diff);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (offset < -70) setOffset(-100);
    else setOffset(0);
  };

  // --- RENDER ---

  if (isOptimisticallyDeleted) {
    return (
      <div className="glass" style={{
        padding: '1rem 1.5rem',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255, 77, 77, 0.4)',
        background: 'rgba(255, 77, 77, 0.05)',
        marginBottom: '1rem',
        animation: 'fadeIn 0.3s ease',
        gap: '1rem',
      }}>
        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>message deleted</span>
          <div style={{
            width: '100%', height: '4px', borderRadius: '2px',
            background: 'rgba(255, 77, 77, 0.15)', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              borderRadius: '2px',
              background: 'var(--accent)',
              animation: 'shrink 5s linear forwards',
            }} />
          </div>
        </div>
        <button
          onClick={handleUndo}
          style={{
            background: 'var(--accent)',
            color: 'white', border: 'none',
            padding: '8px 16px', borderRadius: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600',
            flexShrink: 0,
          }}
        >
          <Undo2 size={16} /> Undo
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', userSelect: 'none', marginBottom: '1rem' }}
      onMouseLeave={handleEnd}
    >
      {/* BACKGROUND ACTION LAYER */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px',
        background: 'rgba(255, 77, 77, 0.1)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1
      }}>
        <div onClick={(e) => { e.stopPropagation(); triggerDeleteSequence(); }}>
          <DeleteButton id={msg._id} customTrigger={true} />
        </div>
      </div>

      {/* FOREGROUND MESSAGE LAYER */}
      <div
        onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
        onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          position: 'relative', zIndex: 2,
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: 'transparent'
        }}
      >
        <div style={{
          background: 'var(--background)', padding: '1.5rem', display: 'flex',
          gap: '1rem', border: '1px solid rgba(90, 87, 87, 0.3)', borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: 'var(--accent)' }}>{msg.name || "Anonymous"}</strong>
              <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                {mounted && msg.createdAt
                  ? new Date(msg.createdAt).toLocaleDateString()
                  : ''}
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