// app/[locale]/(shop)/category/[slug]/components/ProductSkeleton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductSkeletonProps {
  count?: number;
}

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-lg overflow-hidden shadow-sm"
  >
    {/* Image skeleton */}
    <div className="relative aspect-square bg-gray-200 animate-pulse" />

    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>

      {/* Colors */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-5 h-5 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </div>

      {/* Price and button */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
      </div>
    </div>
  </motion.div>
);

export default function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}