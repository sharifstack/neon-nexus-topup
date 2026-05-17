"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
}

export default function MediaRenderer({
  src,
  alt = "media",
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  fallbackSrc = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTNlbHJ1aTFya2I4Yng2YjNxcnFqMGRzbTlhemw1bjZ0bjRsdThjMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eV08lydIMcTftXX3vi/giphy.gif"
}: MediaRendererProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const isValidSrc = typeof imgSrc === 'string' && imgSrc.trim().length > 0;
  const isGif = isValidSrc && (imgSrc.toLowerCase().includes('.gif') || imgSrc.toLowerCase().includes('fetch_format=gif') || imgSrc.toLowerCase().includes('f_gif'));

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  if (!isValidSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fallbackSrc}
        alt={alt}
        className={`object-cover ${className}`}
        style={fill ? { position: 'absolute', height: '100%', width: '100%', left: 0, top: 0 } : { width, height }}
      />
    );
  }

  // If it's a GIF, render using standard <img> to ensure smooth autoplay and avoid next/image optimization issues
  if (isGif) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        className={`object-cover ${className}`}
        style={fill ? { position: 'absolute', height: '100%', width: '100%', left: 0, top: 0 } : { width, height }}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? (width || 500) : undefined}
      height={!fill ? (height || 300) : undefined}
      className={`object-cover ${className}`}
      priority={priority}
      unoptimized
      onError={handleError}
    />
  );
}
