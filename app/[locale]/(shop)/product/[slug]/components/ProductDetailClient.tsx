// app/[locale]/(shop)/product/[slug]/components/ProductDetailClient.tsx
'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { Star, Heart, ShoppingCart, Truck } from 'lucide-react';
import { ProductData } from '../types';
import {
  getUniqueColors,
  getUniqueSizes,
  getVariantStock,
  getAvailableSizesForColor,
  formatPrice,
  calculateDiscountPercentage,
} from '../utils';
import ImageGallery from './ImageGallery';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import SizeGuideModal from './SizeGuideModal';
import { toast } from 'sonner'; 
import { useSession } from '@/hooks/useSession';
import { useCart as useCartHook } from '@/hooks/useCart';
import { useCart } from '@/contexts/CartContext';
import { useFlyToCart } from '@/hooks/useFlyToCart';
import { useFavorites } from '@/contexts/FavoritesContext';
interface ProductDetailClientProps {
  product: ProductData;
  locale: string;
}

export default function ProductDetailClient({
  product,
  locale,
}: ProductDetailClientProps) {
  // Memoize expensive computations
  const colors = useMemo(
    () => getUniqueColors(product.reacentlyAddedDetails),
    [product.reacentlyAddedDetails]
  );
  
  const sizes = useMemo(
    () => getUniqueSizes(product.reacentlyAddedDetails),
    [product.reacentlyAddedDetails]
  );
const imageRef = useRef<HTMLDivElement>(null);

  // State
  const { session, loading } = useSession();
  const isArabic = locale === 'ar';
  const [selectedColor, setSelectedColor] = useState(colors[0]?.id ?? 0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.id ?? 0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
    const { addToCart, isLoading: isAddingToCart } = useCartHook(locale);
  const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const productIsFavorite = isFavorite(product.itemCode);

const { incrementCount } = useCart();
    const { flyToCart } = useFlyToCart();
  // Current selection data
  const currentImages = useMemo(
    () => colors.find((c) => c.id === selectedColor)?.images ?? [product.mainPic],
    [colors, selectedColor, product.mainPic]
  );

  const currentStock = useMemo(
    () => getVariantStock(product.reacentlyAddedDetails, selectedColor, selectedSize),
    [product.reacentlyAddedDetails, selectedColor, selectedSize]
  );

 /*  const discountPercentage = useMemo(
    () => calculateDiscountPercentage(product.originalPrice, product.dealPrice),
    [product.originalPrice, product.dealPrice]
  ); */
  const discountPercentage = useMemo(
    () => product.hasDeal
      ? calculateDiscountPercentage(product.originalPrice, product.dealPrice)
      : 0,
    [product.hasDeal, product.originalPrice, product.dealPrice]
  );

  // Handlers
  const handleColorChange = useCallback(
    (colorId: number) => {
      setSelectedColor(colorId);
      
      // Auto-select first available size for this color
      const availableSizes = getAvailableSizesForColor(
        product.reacentlyAddedDetails,
        colorId
      );
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0].id);
      }
      
      // Reset quantity when color changes
      setQuantity(1);
    },
    [product.reacentlyAddedDetails]
  );

  const handleSizeChange = useCallback((sizeId: number) => {
    setSelectedSize(sizeId);
    // Reset quantity when size changes
    setQuantity(1);
  }, []);

  const handleQuantityIncrease = useCallback(() => {
    if (quantity >= currentStock) {
      toast.warning(
        isArabic 
          ? `الكمية المتاحة فقط ${currentStock}` 
          : `Only ${currentStock} item${currentStock !== 1 ? 's' : ''} available in stock`,
        {
          duration: 3000,
          description: isArabic 
            ? 'لا يمكن إضافة المزيد' 
            : 'Cannot add more items',
        }
      );
      return;
    }
    setQuantity((q) => Math.min(currentStock, q + 1));
  }, [quantity, currentStock, isArabic]);

  const handleQuantityDecrease = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const handleAddToCart = useCallback(async() => {
    if (currentStock === 0) return;
    
    if (!session) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
        duration: 3000,
        description: isArabic 
          ? 'قم بتسجيل الدخول للمتابعة' 
          : 'Sign in to continue shopping',
      });
      return;
    }

    const availableSizes = getAvailableSizesForColor(
      product.reacentlyAddedDetails,
      selectedColor
    );
    
    if (!selectedSize && availableSizes.length > 0) {
      toast.info(isArabic ? 'الرجاء اختيار المقاس' : 'Please select a size');
      return;
    }
    

    const success = await addToCart({
            itemCode: product.itemCode,
            itemColor: selectedColor,
            itemSize: selectedSize,
            price: product.price,
            quantity: quantity,
        });
     if (success) {
            // Trigger flying animation
            flyToCart(imageRef.current);
            // Optimistic UI update
            incrementCount();
        }
  }, [product.itemCode, product.reacentlyAddedDetails, selectedColor, selectedSize, quantity, currentStock, session, isArabic,  addToCart,
        flyToCart,
        incrementCount]);


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


  const getStockForSize = useCallback(
    (sizeId: number) =>
      getVariantStock(product.reacentlyAddedDetails, selectedColor, sizeId),
    [product.reacentlyAddedDetails, selectedColor]
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <ImageGallery imageRef={imageRef}
 images={currentImages} productName={product.itemName} />

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Brand & SKU */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {product.categoryName?.[0] || 'B'}
                    </span>
                  </div>
                  <span className="font-medium">{product.categoryName || 'Brand'}</span>
                </div>
                <span className="text-sm text-gray-500">{product.itemCode}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {product.itemName}
              </h1>

              {/* Rating */}
              {product.productRate > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= product.productRate
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.itemPayedCount} reviews
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold">
                  {product.hasDeal
                    ? formatPrice(product.dealPrice)
                    : formatPrice(product.price)}
                </span>
                {product.hasDeal && discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Color Selector */}
              <ColorSelector
                colors={colors}
                selected={selectedColor}
                onSelect={handleColorChange}
                locale={locale}
              />

              {/* Size Selector */}
              <SizeSelector
                sizes={sizes}
                selected={selectedSize}
                onSelect={handleSizeChange}
                getStock={getStockForSize}
                onSizeGuideClick={() => setShowSizeGuide(true)}
              locale={locale}
              />

              {/* Stock Warning */}
              {currentStock > 0 && currentStock <= 5 && (
                <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                  {isArabic 
                    ? `متبقي ${currentStock} فقط في المخزون!`
                    : `Only ${currentStock} left in stock!`}
                </div>
              )}

              {/* Quantity Selector */}
              {currentStock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    {isArabic ? 'الكمية' : 'Quantity'}
                  </span>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={handleQuantityDecrease}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={handleQuantityIncrease}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                      disabled={quantity >= currentStock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {isArabic 
                      ? `(${currentStock} متاح)`
                      : `(${currentStock} available)`}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className={`flex-1 h-14 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    currentStock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {currentStock === 0 
                    ? (isArabic ? 'نفذ من المخزون' : 'Out of Stock')
                    : (isArabic ? 'أضف إلى السلة' : 'Add to cart')}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                    productIsFavorite
                      ? 'bg-red-50 border-red-500 text-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label={productIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 ${productIsFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              {product.itemDesc && product.itemDesc !== '0' && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2">
                    {isArabic ? 'تفاصيل المنتج' : 'Product Details'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.itemDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          sizeChartImage={product.sizeChartPic}
          onClose={() => setShowSizeGuide(false)}
        
        />
      )}
    </>
  );
}