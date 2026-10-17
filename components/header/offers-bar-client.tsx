// components/header/offers-bar-client.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OffersBarClientProps {
  offers: string[];
}

export function OffersBarClient({ offers }: OffersBarClientProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (offers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [offers.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="relative bg-gradient-to-r from-gray-600 to-gray-500 text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-4 relative">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_linear_infinite]" />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-center min-h-[24px] flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-sm md:text-base font-medium text-center"
            >
              {offers[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="relative p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close offers bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Indicator */}
      {offers.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
          <motion.div
            key={currentIndex}
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
}