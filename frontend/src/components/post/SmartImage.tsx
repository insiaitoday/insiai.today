'use client';

import { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
}

/**
 * SmartImage - auto-detects the natural aspect ratio of any uploaded image
 * and renders it fully visible without cropping.
 *
 * Strategy:
 * - Render a hidden <img> to get naturalWidth / naturalHeight
 * - Classify the image: wide (>1.6), square-ish (0.9–1.6), tall (<0.9)
 * - Apply appropriate container styles so the full image is visible
 */
export function SmartImage({ src, alt }: SmartImageProps) {
  const [style, setStyle]   = useState<React.CSSProperties>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w   = img.naturalWidth;
    const h   = img.naturalHeight;
    const ratio = w / h;

    let containerStyle: React.CSSProperties;

    if (ratio >= 1.6) {
      // Wide / landscape — show full width, let height be natural (capped at 520px)
      containerStyle = { maxHeight: '520px' };
    } else if (ratio >= 0.75) {
      // Square-ish — show full, cap height reasonably
      containerStyle = { maxHeight: '520px' };
    } else {
      // Portrait / tall — constrain width so it doesn't stretch the layout
      containerStyle = { maxWidth: '480px', margin: '0 auto' };
    }

    setStyle(containerStyle);
    setLoaded(true);
  };

  if (error) return null;

  return (
    <div className="smart-image-wrapper mb-8" style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={() => setError(true)}
        className={`smart-image ${loaded ? 'smart-image--loaded' : 'smart-image--loading'}`}
      />
    </div>
  );
}
