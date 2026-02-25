'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function DeleteButton({ id }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <button 
        className='delete-btn'
        onClick={() => setShowConfirm(true)}
        style={{ 
          width: 'fit-content',
          height: 'fit-content',
          padding: '12px 12px',
          background: 'none', 
          border: '1px solid #ff4d4d', 
          color: '#ff4d4d', 
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

      {/* CONFIRMATION OVERLAY — rendered at document.body to escape all stacking contexts */}
      {showConfirm && createPortal(
        <div  style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999999,
          padding: '20px'
        }}>
          <div className="resonsive-card" style={{ 
            padding: '2rem!important', 
            maxWidth: '400px', 
            width: '100%', 
            background:'var(--glass-bg2)',
            textAlign: 'center',
            flexDirection: 'column',
            borderRadius: '10px',
            border: '1px solid rgba(255, 77, 77, 0.3)' 
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#000000',fontSize: '1.5rem'}}>Are you sure?</h2>
            <p style={{ opacity: 0.8, marginBottom: '1rem', fontSize: '0.8rem' }}>
              This action cannot be undone. This message will be permanently removed from your database.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className='delete-btn'
                onClick={() => setShowConfirm(false)}
                style={{ 
                  padding: '0.6rem 1.2rem', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                   width:'fit-content'
                }}
              >
                Cancel
              </button>
              <button 
                className='delete-btn'
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ 
                  padding: '0.6rem 1.2rem', 
                  background: '#ff4d4d', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  width:'fit-content'
                  
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