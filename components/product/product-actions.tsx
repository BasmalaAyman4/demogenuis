'use client';

import { memo, useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductActionsProps {
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onQuickView: () => void;
    position?: 'absolute' | 'relative';
    isAuthenticated?: boolean;
    loading?: boolean;
}

export const ProductActions = memo(function ProductActions({
    isFavorite,
    onToggleFavorite,
    onQuickView,
    position = 'absolute',
    isAuthenticated = false,
    loading = false,
}: ProductActionsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const containerClass = position === 'absolute'
        ? 'absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        : 'flex gap-2';

    const actions = [
        {
            icon: Heart,
            label: 'Add to wishlist',
            onClick: onToggleFavorite,
            active: isFavorite,
            requiresAuth: true,
        }
    ];

    return (
        <div className={containerClass}>
            {actions.map((action, index) => {
                const Icon = action.icon;
                // Only apply disabled logic after mount to ensure SSR/client match
                
                return (
                    <motion.button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        aria-label={action.label}
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                            delay: index * 0.1,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }}
                        whileHover={{ 
                            scale: 1.1,
                            rotate: action.icon === Heart ? [0, -10] : 0,
                        }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                            w-10 h-10 rounded-full bg-white shadow-md
                            flex items-center justify-center
                            hover:bg-black hover:text-white
                            transition-colors duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${action.active ? 'text-red-500' : 'text-gray-700'}
                        `}
                    >
                        <motion.div
                            animate={action.active && action.icon === Heart ? {
                                scale: [1, 1.2, 1],
                            } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <Icon 
                                size={18} 
                                fill={action.active ? 'currentColor' : 'none'} 
                            />
                        </motion.div>
                    </motion.button>
                );
            })}
        </div>
    );
});