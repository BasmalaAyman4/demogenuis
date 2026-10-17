// components/banner/banner-carousel.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
  bannerType: string | null;
  productId: string | null;
  categoryId: string | null;
  subCategoryId: string | null;
  bannerLink: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  autoPlayInterval?: number;
}

const slideVariants = {
  enter: {
    y: '100%',
    opacity: 0,
    scale: 1.1,
  },
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    y: '-100%',
    opacity: 0,
    scale: 0.9,
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function BannerCarousel({
  banners,
  autoPlayInterval = 5000
}: BannerCarouselProps) {
  const [[currentIndex, direction], setPage] = useState([0, 0]);
  const [isHovering, setIsHovering] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalBanners = banners.length;

  const paginate = useCallback((newDirection: number) => {
    setPage(([prev]) => {
      const next = (prev + newDirection + totalBanners) % totalBanners;
      return [next, newDirection];
    });
  }, [totalBanners]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    const newDirection = index > currentIndex ? 1 : -1;
    setPage([index, newDirection]);
  }, [currentIndex]);

  // Auto-play with pause on hover
  useEffect(() => {
    if (totalBanners <= 1 || isHovering) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => paginate(1), autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paginate, autoPlayInterval, totalBanners, isHovering]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  // Preload adjacent images
  useEffect(() => {
    const prev = (currentIndex - 1 + totalBanners) % totalBanners;
    const next = (currentIndex + 1) % totalBanners;

    [prev, next].forEach((index) => {
      const img = new window.Image();
      img.src = banners[index].bannerLink;
    });
  }, [currentIndex, totalBanners, banners]);

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  }, []);

  if (!banners?.length) return null;

  return (
    <div
      className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Banner carousel"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 80, damping: 20 },
            opacity: { duration: 0.6, ease: 'easeInOut' },
            scale: { duration: 0.7, ease: 'easeOut' },
          }}
          className="absolute inset-0"
        >
          {!imageErrors.has(currentIndex) ? (
            <div className="relative w-full h-full">
              <Image
                src={banners[currentIndex].bannerLink}
                alt={`Banner ${currentIndex + 1}`}
                fill
                className="object-contain sm:object-cover transition-transform duration-700 ease-out"
                priority={currentIndex === 0}
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
                unoptimized={true}
                onError={() => handleImageError(currentIndex)}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">Failed to load image</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {totalBanners > 1 && (
        <>
          <motion.button
            onClick={() => paginate(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 md:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Previous banner"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            onClick={() => paginate(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 md:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Next banner"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </motion.button>
        </>
      )}

      {/* Dots Indicator */}
      {totalBanners > 1 && (
        <div
          className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2"
          role="tablist"
          aria-label="Banner navigation"
        >
          {banners.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to banner ${index + 1}`}
              className={`rounded-full focus:outline-none focus:ring-2 focus:ring-white ${index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              animate={{
                width: index === currentIndex ? 24 : 6,
                height: 6,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Banner {currentIndex + 1} of {totalBanners}
      </div>
    </div>
  );
}