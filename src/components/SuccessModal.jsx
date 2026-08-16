// components/SuccessModal.jsx
import { useEffect, useRef } from 'react';

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Success',
  message = 'Operation completed successfully.',
  buttonText = 'OK',
  autoClose = true,
  duration = 10000, // auto close after 3 seconds
}) {
  const closeRef = useRef(null);

  // Auto close after duration
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Focus the close button on open
  useEffect(() => {
    if (isOpen && closeRef.current) closeRef.current.focus();
  }, [isOpen]);

  if (!isOpen) return null;
return(
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div
    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  />

  {/* Dialog */}
  <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
    {/* Success Icon */}
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-600 dark:text-green-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>

    <h3 className="text-lg font-semibold text-gray-800 text-center dark:text-gray-100">
      {title}
    </h3>
    <p className="mt-2 text-sm text-gray-500 text-center dark:text-gray-400">
      {message}
    </p>

    <div className="mt-6 flex justify-center">
      <button
        ref={closeRef}
        onClick={onClose}
        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-500"
      >
        {buttonText}
      </button>
    </div>
  </div>
</div>
)
}