/* 
// components/product/product-card.tsx
'use client';

import { useState, useCallback, memo, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '@/types/product';
import { ProductImage } from '../product/product-image';
import { SizeSelector } from '../product/size-selector';
import { ProductActions } from '../product/product-actions';
import { ColorSelector } from '../product/color-selector';
import { useSession } from '@/hooks/useSession';
import { useCart as useCartHook } from '@/hooks/useCart';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFlyToCart } from '@/hooks/useFlyToCart';

interface ProductCardProps {
    product: Product;
    locale: string;
    priority?: boolean;
    showActions?: boolean;
}

export const ProductCard = memo(function ProductCard({
    product,
    locale,
    priority = false,
    showActions = true,
}: ProductCardProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const { session } = useSession();
    const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.itemColor);
    const [selectedSize, setSelectedSize] = useState<number | undefined>();
    const [showSizes, setShowSizes] = useState(false);

    const isArabic = locale === 'ar';
    const productName = isArabic ? product.itemNameA : product.itemNameE;

    const selectedColor = product.colors.find(c => c.itemColor === selectedColorId);
    const images = selectedColor?.images || product.twoImages || [];
    const availableSizes = selectedColor?.sizesCode || [];

    const hasDiscount = product.hasDeal;
    const displayPrice = product.hasDeal ? product.dealPrice : product.originalPrice;

    // Hooks
    const { addToCart, isLoading: isAddingToCart } = useCartHook(locale);
    const { incrementCount } = useCart();
    const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
    const { flyToCart } = useFlyToCart();

    // Check if product is favorite
    const productIsFavorite = isFavorite(product.itemCode);

    const handleAddToCart = useCallback(async () => {
        if (!session) {
            toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
                duration: 800,
                description: isArabic
                    ? 'قم بتسجيل الدخول للمتابعة'
                    : 'Sign in to continue shopping',
            });
            return;
        }

        if (!selectedSize && availableSizes.length > 0) {
            setShowSizes(true);
            toast.info(isArabic ? 'الرجاء اختيار المقاس' : 'Please select a size', {
                duration: 500,
            });
            return;
        }

        const success = await addToCart({
            itemCode: product.id,
            itemColor: selectedColorId,
            itemSize: selectedSize,
            price: displayPrice,
            quantity: 1,
        });

        if (success) {
            flyToCart(imageRef.current);
            incrementCount();
            setShowSizes(false);
            setSelectedSize(undefined);
        }
    }, [
        session,
        product.id,
        selectedColorId,
        selectedSize,
        availableSizes.length,
        displayPrice,
        isArabic,
        addToCart,
        flyToCart,
        incrementCount,
    ]);

    const handleToggleFavorite = useCallback(async () => {
        if (!session) {
            toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
                duration: 2000,
                description: isArabic
                    ? 'قم بتسجيل الدخول لإضافة المنتجات إلى المفضلة'
                    : 'Sign in to save favorites',
            });
            return;
        }

        await toggleFavorite(product.itemCode);
    }, [session, toggleFavorite, product.itemCode, isArabic]);

    const handleColorChange = useCallback((colorId: number) => {
        setSelectedColorId(colorId);
        setSelectedSize(undefined);
        setShowSizes(false);
    }, []);

    return (
        <motion.article
            className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            layout
        >
            <Link href={`/${locale}/product/${product.itemCode}`} className="block">
                <ProductImage
                    images={images}
                    alt={productName}
                    priority={priority}
                    imageRef={imageRef}
                />
            </Link>

            {showActions && (
                <ProductActions
                    isFavorite={productIsFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickView={() => { }}
                    isAuthenticated={!!session}
                    loading={isFavoriteLoading}
                />
            )}

            {hasDiscount && (
                <motion.div
                    className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    -{Math.round(((product.originalPrice - product.dealPrice) / product.originalPrice) * 100)}%
                </motion.div>
            )}

            <div className="p-4 space-y-3">
                <Link href={`/${locale}/product/${product.itemCode}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors min-h-[2.5rem]">
                        {productName}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        EGP {displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                            EGP {product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {product.colors.length > 0 && (
                    <ColorSelector
                        colors={product.colors}
                        selectedColorId={selectedColorId}
                        onColorChange={handleColorChange}
                    />
                )}

                <AnimatePresence>
                    {showSizes && availableSizes.length > 0 && (
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="text-xs font-medium text-gray-700">
                                {isArabic ? 'اختر المقاس' : 'Select Size'}
                            </label>
                            <SizeSelector
                                sizes={availableSizes}
                                selectedSize={selectedSize}
                                onSizeChange={setSelectedSize}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-white border border-gray-900 text-gray-900 py-3 rounded-lg 
                        hover:bg-black hover:text-white transition-colors duration-200 
                        flex items-center justify-center gap-2 font-medium 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm sm:text-base"
                    whileHover={{ scale: isAddingToCart ? 1 : 1.02 }}
                    whileTap={{ scale: isAddingToCart ? 1 : 0.98 }}
                >
                    <ShoppingCart size={18} />
                    {showSizes
                        ? (isArabic ? 'أضف إلى السلة' : 'Add To Cart')
                        : (isArabic ? 'سريعا إلى السلة' : 'Quick To Cart')}
                </motion.button>
            </div>
        </motion.article>
    );
}); */

// components/product/product-card.tsx
'use client';

import { useState, useCallback, memo, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '@/types/product';
import { ProductImage } from '../product/product-image';
import { SizeSelector } from '../product/size-selector';
import { ProductActions } from '../product/product-actions';
import { ColorSelector } from '../product/color-selector';
import { useSession } from '@/hooks/useSession';
import { useCart as useCartHook } from '@/hooks/useCart';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFlyToCart } from '@/hooks/useFlyToCart';

interface ProductCardProps {
    product: Product;
    locale: string;
    priority?: boolean;
    showActions?: boolean;
}

export const ProductCard = memo(function ProductCard({
    product,
    locale,
    priority = false,
    showActions = true,
}: ProductCardProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const { session } = useSession();
    const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.itemColor);
    const [selectedSize, setSelectedSize] = useState<number | undefined>();
    const [showSizes, setShowSizes] = useState(false);

    const isArabic = locale === 'ar';
    const productName = isArabic ? product.itemNameA : product.itemNameE;

    // Memoize selected color to prevent recalculation
    const selectedColor = useMemo(
        () => product.colors.find(c => c.itemColor === selectedColorId),
        [product.colors, selectedColorId]
    );

    // Memoize images array to prevent reference changes
    const images = useMemo(
        () => selectedColor?.images || product.twoImages || [],
        [selectedColor?.images, product.twoImages]
    );

    // Memoize available sizes
    const availableSizes = useMemo(
        () => selectedColor?.sizesCode || [],
        [selectedColor?.sizesCode]
    );

    const hasDiscount = product.hasDeal;
    const displayPrice = product.hasDeal ? product.dealPrice : product.originalPrice;

    // Hooks
    const { addToCart, isLoading: isAddingToCart } = useCartHook(locale);
    const { incrementCount } = useCart();
    const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
    const { flyToCart } = useFlyToCart();

    // Check if product is favorite
    const productIsFavorite = isFavorite(product.itemCode);

    const handleAddToCart = useCallback(async () => {
        if (!session) {
            toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
                duration: 800,
                description: isArabic
                    ? 'قم بتسجيل الدخول للمتابعة'
                    : 'Sign in to continue shopping',
            });
            return;
        }

        if (!selectedSize && availableSizes.length > 0) {
            setShowSizes(true);
            toast.info(isArabic ? 'الرجاء اختيار المقاس' : 'Please select a size', {
                duration: 500,
            });
            return;
        }

        const success = await addToCart({
            itemCode: product.id,
            itemColor: selectedColorId,
            itemSize: selectedSize,
            price: displayPrice,
            quantity: 1,
        });

        if (success) {
            flyToCart(imageRef.current);
            incrementCount();
            setShowSizes(false);
            setSelectedSize(undefined);
        }
    }, [
        session,
        product.id,
        selectedColorId,
        selectedSize,
        availableSizes.length,
        displayPrice,
        isArabic,
        addToCart,
        flyToCart,
        incrementCount,
    ]);

    const handleToggleFavorite = useCallback(async () => {
        if (!session) {
            toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
                duration: 2000,
                description: isArabic
                    ? 'قم بتسجيل الدخول لإضافة المنتجات إلى المفضلة'
                    : 'Sign in to save favorites',
            });
            return;
        }

        await toggleFavorite(product.itemCode);
    }, [session, toggleFavorite, product.itemCode, isArabic]);

    // Optimized color change handler
    const handleColorChange = useCallback((colorId: number) => {
        setSelectedColorId(colorId);
        setSelectedSize(undefined);
        setShowSizes(false);
    }, []);
    return (
        <motion.article
            className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            layout
        >
            <Link href={`/${locale}/product/${product.itemCode}`} className="block">
                <ProductImage
                    images={images}
                    alt={productName}
                    priority={priority}
                    imageRef={imageRef}
                    // Disable hover effect when multiple colors exist
                    disableHover={product.colors.length < 1}
                />
            </Link>

            {showActions && (
                <ProductActions
                    isFavorite={productIsFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickView={() => { }}
                    isAuthenticated={!!session}
                    loading={isFavoriteLoading}
                />
            )}

            {hasDiscount && (
                <motion.div
                    className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    -{Math.round(((product.originalPrice - product.dealPrice) / product.originalPrice) * 100)}%
                </motion.div>
            )}

            <div className="p-4 space-y-3">
                <Link href={`/${locale}/product/${product.itemCode}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors min-h-[2.5rem]">
                        {productName}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                        EGP {displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs sm:text-sm md:text-base text-gray-500 line-through">
                            EGP {product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {product.colors.length > 0 && (
                    <ColorSelector
                        colors={product.colors}
                        selectedColorId={selectedColorId}
                        onColorChange={handleColorChange}
                    />
                )}

                <AnimatePresence>
                    {showSizes && availableSizes.length > 0 && (
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="text-xs font-medium text-gray-700">
                                {isArabic ? 'اختر المقاس' : 'Select Size'}
                            </label>
                            <SizeSelector
                                sizes={availableSizes}
                                selectedSize={selectedSize}
                                onSizeChange={setSelectedSize}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-white border border-gray-900 text-gray-900 py-3 rounded-lg 
                        hover:bg-black hover:text-white transition-colors duration-200 
                        flex items-center justify-center gap-2 font-medium 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm sm:text-base"
                    whileHover={{ scale: isAddingToCart ? 1 : 1.02 }}
                    whileTap={{ scale: isAddingToCart ? 1 : 0.98 }}
                >
                    <ShoppingCart size={18} />
                    {showSizes
                        ? (isArabic ? 'أضف إلى السلة' : 'Add To Cart')
                        : (isArabic ? 'سريعا إلى السلة' : 'Quick To Cart')}
                </motion.button>
            </div>
        </motion.article>
    );
});
