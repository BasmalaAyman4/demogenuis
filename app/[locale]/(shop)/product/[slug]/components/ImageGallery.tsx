// app/[locale]/(shop)/product/[slug]/components/ImageGallery.tsx
'use client';

import { useState, useCallback, useTransition ,RefObject} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
      imageRef?: RefObject<HTMLDivElement>; // Changed from HTMLImageElement to HTMLDivElement
  
}

export default function ImageGallery({ images, productName,imageRef }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback((direction: 'prev' | 'next') => {
    startTransition(() => {
      setCurrentIndex((prev) => {
        if (direction === 'prev') {
          return prev === 0 ? images.length - 1 : prev - 1;
        }
        return (prev + 1) % images.length;
      });
    });
  }, [images.length]);

  const handleImageError = useCallback((index: number) => {
    setImageError((prev) => new Set(prev).add(index));
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    startTransition(() => {
      setCurrentIndex(index);
    });
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigate('prev');
    if (e.key === 'ArrowRight') navigate('next');
  }, [navigate]);

  if (!images || images.length === 0) {
    return (
      <div className="flex-1 bg-gray-100 rounded-2xl flex items-center justify-center h-[600px]">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Thumbnails */}
      <div  className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-thin">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
              currentIndex === idx
                ? 'border-black'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            aria-label={`View image ${idx + 1}`}
          >
            {!imageError.has(idx) ? (
              <Image
                src={img}
                alt={`${productName} - View ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                sizes="80px"
                onError={() => handleImageError(idx)}
                loading="lazy"
                quality={75}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image Container - Fixed aspect ratio to prevent layout shift */}
      <div className="relative flex-1 bg-gray-50 rounded-xl overflow-hidden group aspect-square max-h-[600px]">
        {!imageError.has(currentIndex) ? (
          <div className="relative w-full h-full" ref={imageRef} >
            <Image
              key={currentIndex} // Force re-mount for instant updates
              src={images[currentIndex]}
              alt={`${productName} - Main view`}
              fill
              priority={currentIndex === 0}
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => handleImageError(currentIndex)}
              quality={90}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Image not available
          </div>
        )}

        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigate('prev')}
              disabled={isPending}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 focus:opacity-100 disabled:opacity-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('next')}
              disabled={isPending}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 focus:opacity-100 disabled:opacity-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                disabled={isPending}
                className={`h-2 rounded-full transition-all disabled:opacity-50 ${
                  currentIndex === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}