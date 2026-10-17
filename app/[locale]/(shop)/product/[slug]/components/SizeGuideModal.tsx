// app/[locale]/(shop)/product/[slug]/components/SizeGuideModal.tsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface SizeGuideModalProps {
  sizeChartImage: string;
  onClose: () => void;
}

export default function SizeGuideModal({
  sizeChartImage,
  onClose,
}: SizeGuideModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Size Guide</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {sizeChartImage ? (
            <div className="relative w-full min-h-[400px]">
              <Image
                src={sizeChartImage}
                alt="Size guide chart"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Size guide not available for this product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}