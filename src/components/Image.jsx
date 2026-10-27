import { useState } from "react";
export default function Image({
  src,
  alt = "",
  aspectRatio = "4/3",
  objectFit = "cover",
  className = "",
  containerClassName = "",
  fallback = "/placeholder.png",
  loading = "lazy",
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const imgSrc = src && failedSrc !== src ? src : fallback;
  return (
    <div
      className={`overflow-hidden soft-surface ${containerClassName}`}
      style={{ aspectRatio }}
    >
      <img
        src={imgSrc}
        alt={alt}
        onError={() => {
          if (imgSrc !== fallback) setFailedSrc(src);
        }}
        className={`h-full w-full ${className}`}
        style={{ objectFit }}
        loading={loading}
      />
    </div>
  );
}
