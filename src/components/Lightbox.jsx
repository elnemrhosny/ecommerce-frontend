// components/Lightbox.jsx
import { useEffect, useCallback, useRef } from 'react';

export default function Lightbox({
  images = [],
  currentIndex,
  onClose,
  onPrev,
  onNext,
  isOpen,
}) {
  const hasMultiple = images.length > 1;

  // Stable callback with ref
  const onCloseRef = useRef(onClose);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  onCloseRef.current = onClose;
  onPrevRef.current = onPrev;
  onNextRef.current = onNext;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onCloseRef.current();
    if (e.key === 'ArrowLeft' && hasMultiple) onPrevRef.current();
    if (e.key === 'ArrowRight' && hasMultiple) onNextRef.current();
  }, [hasMultiple]);

  useEffect(() => {
    if (!isOpen) return;   // don't do anything when closed

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Left arrow */}
      {hasMultiple && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {hasMultiple && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex].image_url}
        alt="Enlarged view"
        className="max-h-[90vh] max-w-[90vw] object-contain select-none"
        onClick={onClose}
      />
    </div>
  );
}