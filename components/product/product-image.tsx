/* // components/product/product-image.tsx
'use client';

import Image from 'next/image';
import { useState, memo, RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import noImage from '@/assets/No_Image.png';

interface ProductImageProps {
    images: string[];
    alt: string;
    priority?: boolean;
    sizes?: string;
    imageRef?: RefObject<HTMLDivElement>; // Changed from HTMLImageElement to HTMLDivElement
}

export const ProductImage = memo(function ProductImage({
    images,
    alt,
    priority = false,
    sizes = '(max-width: 768px) 50vw, 25vw',
    imageRef
}: ProductImageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const hasMultipleImages = images.length > 1;
    const currentImage = images[currentIndex] || noImage;

    return (
        <div
            ref={imageRef} // Attach ref to the wrapper div
            className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
            onMouseEnter={() => hasMultipleImages && setCurrentIndex(1)}
            onMouseLeave={() => hasMultipleImages && setCurrentIndex(0)}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                        duration: 0.4, 
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentImage}
                        alt={alt}
                        fill
                        sizes={sizes}
                        priority={priority}
                        quality={85}
                        className="object-cover"
                        onLoad={() => setIsLoading(false)}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </motion.div>
            </AnimatePresence>

            {isLoading && (
                <motion.div 
                    className="absolute inset-0 bg-gray-200"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            )}

            {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.slice(0, 2).map((_, idx) => (
                        <motion.div
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full bg-white"
                            initial={{ opacity: 0.5 }}
                            animate={{ 
                                opacity: idx === currentIndex ? 1 : 0.5,
                                scale: idx === currentIndex ? 1.2 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}); */


// components/product/product-image.tsx
// ============================================
'use client';

import Image from 'next/image';
import { useState, memo, RefObject } from 'react';
import { motion } from 'framer-motion';
import noImage from '@/assets/No_Image.png';

interface ProductImageProps {
    images: string[];
    alt: string;
    priority?: boolean;
    sizes?: string;
    imageRef?: RefObject<HTMLDivElement>;
    disableHover?: boolean; // New prop to disable hover effect
}

export const ProductImage = memo(function ProductImage({
    images,
    alt,
    priority = false,
    sizes = '(max-width: 768px) 50vw, 25vw',
    imageRef,
    disableHover = false,
}: ProductImageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const hasMultipleImages = images.length > 1 && !disableHover;
    const currentImage = images[currentIndex] || noImage;

    return (
        <div
            ref={imageRef}
            className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
            onMouseEnter={() => hasMultipleImages && setCurrentIndex(1)}
            onMouseLeave={() => hasMultipleImages && setCurrentIndex(0)}
        >
            {/* Use key to force instant re-render when images change */}
            <motion.div
                key={`${currentImage}-${currentIndex}`}
                initial={false} // Disable initial animation for instant changes
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }} // Very quick fade
                className="absolute inset-0"
            >
                <Image
                    src={currentImage}
                    alt={alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    quality={85}
                    className="object-cover"
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </motion.div>

            {/* Loading skeleton */}
            {isLoading && (
                <motion.div
                    className="absolute inset-0 bg-gray-200"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            )}

            {/* Image indicator dots */}
            {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.slice(0, 2).map((_, idx) => (
                        <motion.div
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full bg-white"
                            initial={{ opacity: 0.5 }}
                            animate={{
                                opacity: idx === currentIndex ? 1 : 0.5,
                                scale: idx === currentIndex ? 1.2 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
        prevProps.images[0] === nextProps.images[0] &&
        prevProps.alt === nextProps.alt &&
        prevProps.priority === nextProps.priority &&
        prevProps.disableHover === nextProps.disableHover
    );
});