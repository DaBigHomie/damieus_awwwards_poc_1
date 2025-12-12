import { useState, useEffect } from 'react';

export const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  const handlePrevious = () => {
    const newIndex = index > 0 ? index - 1 : images.length - 1;
    setIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = index < images.length - 1 ? index + 1 : 0;
    setIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('lightbox-backdrop')) {
      onClose();
    }
  };

  return (
    <div 
      className="lightbox-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      <div className="lightbox-container">
        <button 
          className="lightbox-close" 
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button 
          className="lightbox-nav lightbox-prev" 
          onClick={handlePrevious}
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="lightbox-content">
          <img 
            src={images[index].url} 
            alt={images[index].alt || `Image ${index + 1}`}
            className="lightbox-image"
          />
          {images[index].caption && (
            <p className="lightbox-caption">{images[index].caption}</p>
          )}
        </div>

        <button 
          className="lightbox-nav lightbox-next" 
          onClick={handleNext}
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="lightbox-counter">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};
