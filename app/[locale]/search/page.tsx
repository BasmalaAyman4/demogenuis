// app/[locale]/search/page.tsx
'use client';

import { SearchInput } from '@/components/search/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { ShoppingBag, TrendingUp, Package, Star, Tag, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import noImage from '@/public/No_Image.png'

interface ItemType {
  id: string;
  itemCode: string;
  barCode: string;
  itemName: string;
  itemNameA: string;
  price: number;
  originalPrice: number;
  discount: number;
  hasDeal: boolean;
  dealPrice: number;
  mainPic: string;
  quantity: number;
  colors: Array<{
    itemColor: number;
    colorName: string;
    colorHex: string;
  }>;
  categoryCode: number;
  productRate: number;
}

interface SearchResponse {
  success: boolean;
  data: {
    data: {
      item: ItemType[];
      lastPageNo: number;
      totalProductCount: number;
    };
  };
  status: number;
}

export default function SearchPage() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const router = useRouter();
  const locale = segments[0] as 'en' | 'ar';
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Translation object
  const t = {
    productSearch: locale === 'en' ? 'Product Search' : 'البحث عن المنتجات',
    discover: locale === 'en' ? 'Discover amazing products from E-commerce' : 'اكتشف منتجات مذهلة من المتجر الإلكتروني',
    searchPlaceholder: locale === 'en' 
      ? 'Search for products by name, code, or category...' 
      : 'ابحث عن المنتجات بالاسم أو الكود أو الفئة...',
    searchResults: locale === 'en' ? 'Search Results' : 'نتائج البحث',
    sale: locale === 'en' ? 'SALE' : 'تخفيض',
    outOfStock: locale === 'en' ? 'OUT OF STOCK' : 'غير متوفر',
    code: locale === 'en' ? 'Code' : 'الكود',
    inStock: locale === 'en' ? 'in stock' : 'متوفر',
    unavailable: locale === 'en' ? 'Unavailable' : 'غير متاح',
    noProducts: locale === 'en' ? 'No products found' : 'لم يتم العثور على منتجات',
    tryDifferent: locale === 'en' ? 'Try searching with different keywords' : 'جرب البحث بكلمات مفتاحية مختلفة',
    searchTips: locale === 'en' ? 'Search Tips' : 'نصائح البحث',
    tip1: locale === 'en' ? 'Type at least 2 characters to start searching' : 'اكتب على الأقل حرفين لبدء البحث',
    tip2: locale === 'en' ? 'Results appear automatically with smart caching' : 'تظهر النتائج تلقائياً مع التخزين الذكي',
    tip3: locale === 'en' ? 'Search by product name, code, or category' : 'ابحث باسم المنتج أو الكود أو الفئة',
    egp: locale === 'en' ? 'EGP' : 'ج.م',
  };

  const handleResultsChange = useCallback((response: SearchResponse) => {
    if (response?.data?.data?.item) {
      setSearchResults(response.data.data.item);
      setTotalCount(response.data.data.totalProductCount || 0);
    } else {
      setSearchResults([]);
      setTotalCount(0);
    }
  }, []);

  const handleItemClick = useCallback((item: ItemType) => {
    router.push(`/${locale}/product/${item.itemCode}`);
  }, [locale, router]);

  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-500 rounded-3xl mb-6 shadow-lg shadow-blue-500/30"
          >
            <ShoppingBag className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent mb-3">
            {t.productSearch}
          </h1>
          <p className="text-gray-600 text-lg">
            {t.discover}
          </p>
        </motion.div>

        {/* Search Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 rounded-3xl shadow-2xl shadow-gray-500/10 p-8 mb-8 border border-white/20"
        >
          <SearchInput
            endpoint="/api/ItemTypes/getItems"
            placeholder={t.searchPlaceholder}
            debounceMs={300}
            minChars={2}
            pageSize={20}
            locale={locale}
            onResultsChange={handleResultsChange}
            showResultsInline={false}
          />
        </motion.div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {searchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  {t.searchResults}
                </h2>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleItemClick(item)}
                    className="group bg-white rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-300 hover:shadow-xl"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-60 overflow-hidden">
                      {item.mainPic ? (
                        <Image
                          src={item.mainPic}
                          alt={locale === 'ar' ? item.itemNameA : item.itemName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            e.currentTarget.src = noImage.src;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-300" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.hasDeal && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {t.sale}
                          </span>
                        )}
                        {item.quantity === 0 && (
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full shadow-lg">
                            {t.outOfStock}
                          </span>
                        )}
                      </div>

                      {item.productRate > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-gray-900">
                            {item.productRate.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {locale === 'ar' ? item.itemNameA : item.itemName}
                      </h3>

                      <p className="text-xs text-gray-500 mb-3">
                        {t.code}: {item.itemCode}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        {item.hasDeal && item.dealPrice ? (
                          <>
                            <span className="text-2xl font-bold text-red-600">
                              {item.dealPrice} {t.egp}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {item.price} {t.egp}
                            </span>
                            <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">
                              -{Math.round(((item.price - item.dealPrice) / item.price) * 100)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {item.price} {t.egp}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {item.quantity !== undefined && (
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            item.quantity > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.quantity > 0 
                              ? `${item.quantity} ${t.inStock}` 
                              : t.unavailable}
                          </span>
                        )}

                        {item.colors && item.colors.length > 0 && (
                          <div className="flex items-center gap-1">
                            {item.colors.slice(0, 4).map((color) => (
                              <div
                                key={color.itemColor}
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: `#${color.colorHex}` }}
                                title={color.colorName}
                              />
                            ))}
                            {item.colors.length > 4 && (
                              <span className="text-xs text-gray-500 ml-1">
                                +{item.colors.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {searchResults && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t.noProducts}
              </h3>
              <p className="text-gray-600">
                {t.tryDifferent}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-60 rounded-3xl p-8 border border-gray-100"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.searchTips}</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 font-bold">•</span>
                  <span>{t.tip1}</span>
                </li>
              
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 font-bold">•</span>
                  <span>{t.tip3}</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}