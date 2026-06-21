import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ImageViewer.css';

const ImageViewer = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="image-viewer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="image-viewer-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Close Button */}
          <button className="viewer-close" onClick={onClose}>
            <FiX />
          </button>

          {/* Image Counter */}
          <div className="viewer-counter">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button className="viewer-nav viewer-prev" onClick={goToPrev}>
              <FiChevronLeft />
            </button>
          )}

          {/* Image */}
          <div className="viewer-image-container">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Page ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button className="viewer-nav viewer-next" onClick={goToNext}>
              <FiChevronRight />
            </button>
          )}

          {/* Page Label */}
          <div className="viewer-label">Page {currentIndex + 1}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageViewer;
