// components/home/best-selling/BestSellingProducts.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductsGrid } from '@/components/product/products-grid';

interface Category {
  categoryId: number;
  categoryName: string;
  item: any[];
}

interface BestSellingProductsProps {
  categories: Category[];
  locale: string;
}

export function BestSellingProducts({ categories, locale }: BestSellingProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Memoize all products for "All Products" view
  const allProducts = useMemo(() => {
    return categories.flatMap(cat => cat.item);
  }, [categories]);

  // Memoize filtered products
  const displayedProducts = useMemo(() => {
    if (selectedCategory === null) {
      return allProducts;
    }
    const category = categories.find(cat => cat.categoryId === selectedCategory);
    return category?.item || [];
  }, [selectedCategory, categories, allProducts]);

  // Optimized category change handler
  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const isArabic = locale === 'ar';

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            {isArabic ? 'المنتجات الأكثر مبيعاً' : 'Best Selling Products'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isArabic 
              ? 'اكتشف مجموعتنا المختارة من المنتجات الأكثر مبيعاً والمفضلة لدى العملاء'
              : 'Discover our curated selection of best-selling products loved by customers'
            }
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* All Products Button */}
            <CategoryButton
              active={selectedCategory === null}
              onClick={() => handleCategoryChange(null)}
              label={isArabic ? 'جميع المنتجات' : 'All Products'}
            />

            {/* Category Buttons */}
            {categories.map((category, index) => (
              <CategoryButton
                key={category.categoryId}
                active={selectedCategory === category.categoryId}
                onClick={() => handleCategoryChange(category.categoryId)}
                label={category.categoryName}
                delay={0.05 * (index + 1)}
              />
            ))}
          </div>
        </motion.div>

        {/* Products Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory ?? 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProductsGrid
              products={displayedProducts}
              locale={locale}
              cols={4}
              gap={6}
              priorityCount={4}
              showViewMore={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {displayedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {isArabic ? 'لا توجد منتجات' : 'No Products Found'}
            </h3>
            <p className="text-gray-500">
              {isArabic 
                ? 'لا توجد منتجات في هذه الفئة حالياً'
                : 'No products available in this category at the moment'
              }
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Optimized Category Button Component
interface CategoryButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  delay?: number;
}

function CategoryButton({ active, onClick, label, delay = 0 }: CategoryButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-full font-medium transition-all duration-300
        ${active 
          ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg shadow-gray-500/30' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      {/* Active Indicator */}
      {active && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      
      {/* Label */}
      <span className="relative z-10">{label}</span>
      
      {/* Hover Effect */}
      {!active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-70 rounded-full opacity-0 hover:opacity-100 transition-opacity"
          initial={false}
        />
      )}
    </motion.button>
  );
}