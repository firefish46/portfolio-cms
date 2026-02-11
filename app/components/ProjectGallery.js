'use client';
import { useState } from 'react';

export default function ProjectGallery({ images, title }) {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div style={{ height: '250px', background: '#111', display: 'grid', placeItems: 'center', opacity: 0.2 }}>
        <span>No Images Available</span>
      </div>
    );
  }

  return (
    <>
      <div className="hide-scrollbar" style={{ 
        display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', height: '250px', background: '#111' 
      }}>
        {images.map((img, index) => (
          <img 
            key={index} src={img} alt={title}
            onClick={() => setSelectedImg(img)}
            style={{ flex: '0 0 100%', width: '100%', objectFit: 'cover', scrollSnapAlign: 'start', cursor: 'zoom-in' }} 
          />
        ))}
      </div>

      {/* FULLSCREEN OVERLAY */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
            padding: '20px'
          }}
        >
          <img src={selectedImg} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
          <span style={{ position: 'absolute', top: '20px', right: '30px', color: '#fff', fontSize: '2rem' }}>&times;</span>
        </div>
      )}
    </>
  );
}