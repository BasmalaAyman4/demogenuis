// components/product/size-selector.tsx
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface Size {
    id: number;
    name: string;
}

interface SizeSelectorProps {
    sizes: Size[];
    selectedSize: number|undefined;
    onSizeChange: (size: number) => void;
    layout?: 'horizontal' | 'grid';
}

export const SizeSelector = memo(function SizeSelector({
    sizes,
    selectedSize,
    onSizeChange,
    layout = 'horizontal',
}: SizeSelectorProps) {
    const containerClass = layout === 'horizontal'
        ? 'flex gap-2 flex-wrap'
        : 'grid grid-cols-4 gap-2';

    return (
        <div className={containerClass} role="radiogroup" aria-label="Product sizes">
            {sizes.map((size, index) => {
                const isSelected = size.id === selectedSize;
                // Create a unique key combining id and index to handle potential duplicates
                const uniqueKey = `size-${size.id}-${index}`;

                return (
                    <motion.button
                        key={uniqueKey}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Size ${size.name}`}
                        onClick={() => onSizeChange(size.id)}
                        className={`
                            px-4 py-2 min-w-[3rem] text-sm font-medium rounded
                            transition-colors duration-200
                            ${isSelected
                                ? 'bg-black text-white'
                                : 'bg-white text-black border border-gray-300 hover:border-black'
                            }
                        `}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            delay: index * 0.05,
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {size.name}
                    </motion.button>
                );
            })}
        </div>
    );
});