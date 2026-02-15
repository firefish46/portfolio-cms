'use client';
import { useState } from 'react';
import Image from 'next/image';
import './projectGallery.css';

export default function ProjectGallery({ images, title }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="no-images-placeholder">
        <span>No Images Available</span>
      </div>
    );
  }

  const handleImageClick = (img, index) => {
    setSelectedImg(img);
    setCurrentIndex(index);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImg(images[nextIndex]);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImg(images[prevIndex]);
  };

  return (
    <>
      <div className="hide-scrollbar project-gallery">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(img, index)}
            className="gallery-image-wrapper"
          >
            <Image 
              src={img} 
              alt={`${title} - Image ${index + 1}`}
              width={800}
              height={500}
              sizes="(max-width: 768px) 100vw, 800px"
              className="gallery-image"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* FULLSCREEN OVERLAY */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          className="fullscreen-overlay"
        >
          <div 
            className="fullscreen-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImg} 
              alt={`${title} - Image ${currentIndex + 1}`}
              className="fullscreen-image"
            />
          </div>

          {/* Navigation Arrows (only show if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="nav-button nav-prev"
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                onClick={handleNext}
                className="nav-button nav-next"
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="image-counter">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImg(null);
            }}
            className="close-button"
            aria-label="Close fullscreen"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}