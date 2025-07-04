import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallback?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fallback,
  style,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Preload critical images
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }

    // Check if image is already cached
    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
      setImageSrc(src);
    };
    img.onerror = () => {
      if (fallback) {
        setImageSrc(fallback);
      } else {
        setError(true);
      }
    };
    img.src = src;

    return () => {
      if (priority) {
        const preloadLink = document.querySelector(`link[href="${src}"]`);
        if (preloadLink) {
          document.head.removeChild(preloadLink);
        }
      }
    };
  }, [src, priority, fallback]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    } else {
      setError(true);
      onError?.();
    }
  };

  if (error && !fallback) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          maxWidth: '100%',
          height: 'auto',
          ...(width && { width }),
          ...(height && { height }),
          ...style
        }}
      />
    </div>
  );
}