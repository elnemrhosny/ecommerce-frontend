// components/Image.jsx
import { useState } from 'react';

export default function Image({
  src,
  alt = '',
  aspectRatio = '4/3',        // width / height ratio, e.g. '4/3', '1/1', '16/9'
  objectFit = 'cover',         // 'cover', 'contain', 'fill', 'none', 'scale-down'
  className = '',              // additional classes for the <img> tag
  containerClassName = '',     // additional classes for the outer container
  fallback = '/placeholder.png', // fallback image if src fails to load
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  // Reset if src changes externally
  if (src !== imgSrc && !hasError) {
    setImgSrc(src);
  }

  return (
  <div
    className={`overflow-hidden bg-gray-100 dark:bg-gray-700 ${containerClassName}`}
    style={{ aspectRatio }}
  >
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`h-full w-full ${className}`}
      style={{ objectFit }}
      loading="lazy"
    />
  </div>
);
}