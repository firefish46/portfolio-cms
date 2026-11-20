'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function DeleteButton({ id }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fixes Hydration Error #418 by ensuring Portal only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include', // Fixes 401 Unauthorized on Vercel
      });

      if (res.ok) {
        router.refresh();
      } else {
        const errorData = await res.json();
        console.error("Delete failed server-side:", errorData.error);
        alert("Failed to delete: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Network error during delete:", err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  // Prevent server-side rendering of the button to avoid mismatch
  if (!mounted) return <div style={{ width: '40px', height: '40px' }} />;

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      
      <button 
        className='delete-btn'
        onClick={() => setShowConfirm(true)}
        style={{ 
          width: 'fit-content',
          height: 'fit-content',
          padding: '12px',
          background: 'none', 
          border: '1px solid var(--danger)', 
          color: 'var(--danger)', 
          cursor: 'pointer',
          fontSize: '0.8rem',
          marginTop: '-1rem',
          marginRight: '-1rem',
          borderRadius: '8px',
          transition: 'all 0.2s'
        }}
      >
        <i className="fa-solid fa-trash-can"></i> 
      </button>

      {/* CONFIRMATION OVERLAY */}
      {showConfirm && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999999,
          padding: '20px'
        }}>
          <div className="responsive-card" style={{ 
            padding: '2rem', 
            maxWidth: '400px', 
            width: '100%', 
            background: 'var(--surface)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--danger)', fontSize: '1.5rem', fontFamily: 'var(--font-fredoka)' }}>
              Are you sure?
            </h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--foreground)' }}>
              This action cannot be undone. This message will be permanently removed from your database.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  background: 'var(--surface-2)', 
                  border: 'none', 
                  color: 'var(--muted)', 
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontWeight: '600',
                  flex: 1
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  background: 'var(--danger)', 
                  border: 'none', 
                  color: 'var(--on-accent)', 
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  borderRadius: '8px',
                  fontWeight: '600',
                  flex: 1,
                  opacity: isDeleting ? 0.7 : 1
                }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}