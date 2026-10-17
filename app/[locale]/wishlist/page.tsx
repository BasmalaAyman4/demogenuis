// app/[locale]/favorites/page.tsx
'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

interface FavoritesPageProps {
  params: Promise<{ locale: string }>;
}

export default function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = use(params);
  const { favoritesData, isLoading, removeFavorite } = useFavorites();
  const isArabic = locale === 'ar';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (favoritesData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isArabic ? 'لا توجد منتجات مفضلة' : 'No Favorites Yet'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isArabic
              ? 'ابدأ بإضافة منتجات إلى المفضلة'
              : 'Start adding products to your favorites'}
          </p>
          <Link
            href={`/${locale}/`}
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isArabic ? 'تصفح المنتجات' : 'Browse Products'}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isArabic ? 'المفضلة' : 'My Favorites'}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritesData.map((product, index) => (
          <motion.div
            key={product.itemCode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFavorite(product.itemCode)}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <Heart size={18} className="text-red-500" fill="currentColor" />
            </button>

            <Link href={`/${locale}/product/${product.itemCode}`}>
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.mainPic}
                  alt={product.itemName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.hasDeal && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    DEAL
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.itemName}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    EGP {product.price.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      EGP {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.hasDeal && (
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    {isArabic ? 'سعر العرض' : 'Deal Price'}: EGP {product.dealPrice.toFixed(2)}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}