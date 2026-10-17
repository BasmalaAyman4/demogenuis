// app/[locale]/(shop)/product/[slug]/components/SizeSelector.tsx
'use client';

import { Size } from '../types';

interface SizeSelectorProps {
  sizes: Size[];
  selected: number;
  onSelect: (sizeId: number) => void;
  getStock: (sizeId: number) => number;
  onSizeGuideClick?: () => void;
  locale:string
}

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  getStock,
  onSizeGuideClick,
  locale
}: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">{locale=='en'?'Size':'المقاس'}</span>
        {onSizeGuideClick && (
          <button
            onClick={onSizeGuideClick}
            className="text-sm text-gray-600 underline hover:text-black transition-colors"
          >
             {locale=='en'?'Size guide':'دليل المقاس'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const stock = getStock(size.id);
          const isOutOfStock = stock === 0;
          const isSelected = selected === size.id;
          const isLowStock = stock > 0 && stock <= 5;

          return (
            <button
              key={size.id}
              onClick={() => !isOutOfStock && onSelect(size.id)}
              disabled={isOutOfStock}
              className={`relative h-12 rounded-lg border-2 font-medium transition-all ${
                isOutOfStock
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-black hover:bg-gray-50'
              }`}
              aria-label={`Size ${size.name}${isOutOfStock ? ' - Out of stock' : ''}`}
              aria-pressed={isSelected}
              title={
                isOutOfStock
                  ? 'Out of stock'
                  : isLowStock
                  ? `Only ${stock} left`
                  : `${stock} in stock`
              }
            >
              {size.name}
              
              {/* Out of stock diagonal line */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-300 rotate-30" />
                </div>
              )}

              {/* Low stock indicator */}
              {isLowStock && !isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}