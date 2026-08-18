import { useEffect } from 'react';

export default function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if the click was inside the ref element
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Use mousedown and touchstart for better mobile support
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}