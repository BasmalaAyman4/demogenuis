// app/[locale]/(shop)/product/[slug]/utils.ts
import { ColorVariant, Color, Size } from './types';

/**
 * Extract unique colors from product variants
 */
export const getUniqueColors = (variants: ColorVariant[]): Color[] => {
  const colorMap = new Map<number, Color>();
  
  variants.forEach((variant) => {
    if (!colorMap.has(variant.itemColor)) {
      colorMap.set(variant.itemColor, {
        id: variant.itemColor,
        name: variant.colorName,
        hex: variant.colorHex,
        images: variant.productPic,
      });
    }
  });
  
  return Array.from(colorMap.values());
};

/**
 * Extract unique sizes from product variants
 */
export const getUniqueSizes = (variants: ColorVariant[]): Size[] => {
  const sizeMap = new Map<number, Size>();
  
  variants.forEach((variant) => {
    if (!sizeMap.has(variant.itemSize)) {
      sizeMap.set(variant.itemSize, {
        id: variant.itemSize,
        name: variant.sizeName,
      });
    }
  });
  
  // Sort sizes by ID (assuming ID represents size order)
  return Array.from(sizeMap.values()).sort((a, b) => a.id - b.id);
};

/**
 * Get stock quantity for specific color/size combination
 */
export const getVariantStock = (
  variants: ColorVariant[],
  colorId: number,
  sizeId: number
): number => {
  const variant = variants.find(
    (v) => v.itemColor === colorId && v.itemSize === sizeId
  );
  return variant?.quantity ?? 0;
};

/**
 * Get specific variant details
 */
export const getVariant = (
  variants: ColorVariant[],
  colorId: number,
  sizeId: number
): ColorVariant | undefined => {
  return variants.find(
    (v) => v.itemColor === colorId && v.itemSize === sizeId
  );
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  currentPrice: number
): number => {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Format price with currency
 */
export const formatPrice = (
  price: number,
  currency: string = 'EGP'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Check if product is on sale
 */
export const isOnSale = (originalPrice: number, currentPrice: number): boolean => {
  return originalPrice > currentPrice;
};

/**
 * Get available sizes for a specific color
 */
export const getAvailableSizesForColor = (
  variants: ColorVariant[],
  colorId: number
): Size[] => {
  const sizes = variants
    .filter((v) => v.itemColor === colorId && v.quantity > 0)
    .map((v) => ({ id: v.itemSize, name: v.sizeName }));
  
  // Remove duplicates
  return Array.from(new Map(sizes.map(s => [s.id, s])).values())
    .sort((a, b) => a.id - b.id);
};

/**
 * Check if size is available for selected color
 */
export const isSizeAvailable = (
  variants: ColorVariant[],
  colorId: number,
  sizeId: number
): boolean => {
  return getVariantStock(variants, colorId, sizeId) > 0;
};