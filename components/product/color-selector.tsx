// components/product/color-selector.tsx
'use client';

import { memo } from 'react';
import type { ProductColor } from '@/types/product';
import Image from 'next/image';
import { motion } from 'framer-motion';
import noImage from '@/assets/No_Image.png';

interface ColorSelectorProps {
    colors: ProductColor[];
    selectedColorId: number;
    onColorChange: (colorId: number) => void;
}

export const ColorSelector = memo(function ColorSelector({
    colors,
    selectedColorId,
    onColorChange,
}: ColorSelectorProps) {
    return (
        <div className="flex items-center gap-2" role="radiogroup" aria-label="Product colors">
            {colors.map((color, index) => {
                const isSelected = color.itemColor === selectedColorId;
                const firstImage = color.images[0] || noImage;

                return (
                    <motion.button
                        key={color.itemColor}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={color.colorName}
                        onClick={() => onColorChange(color.itemColor)}
                        className="relative w-8 h-8 rounded-md overflow-hidden cursor-pointer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                            delay: index * 0.05,
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                        }}
                        whileHover={{ 
                            scale: 1.15,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        title={color.colorName}
                    >
                        <Image
                            src={firstImage}
                            alt={color.colorName}
                            className="w-full h-full object-cover"
                            fill
                            onError={(e) => {
                                e.currentTarget.src = '/No_Image.png';
                            }}


                        />
                        
                        {/* Selection indicator */}
                        <motion.div
                            className="absolute inset-0 border-2 border-gray-900 pointer-events-none"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: isSelected ? 1 : 0,
                                scale: isSelected ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.2 }}
                        />
                        
                        {/* White inner border for selected state */}
                        {isSelected && (
                            <motion.div
                                className="absolute inset-[2px] border-2 border-white pointer-events-none rounded-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
});