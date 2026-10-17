// components/search/SearchInput.tsx
'use client';

import { useSearch } from '@/hooks/useSearch';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface SearchInputProps {
    endpoint: string;
    placeholder?: string;
    debounceMs?: number;
    minChars?: number;
    locale?: string;
    pageSize?: number;
    onResultsChange?: (data: any) => void;
    onItemSelect?: (item: any) => void;
    renderResults?: (data: any, isEmpty: boolean) => React.ReactNode;
    showResultsInline?: boolean;
    className?: string;
}

// Memoized result item for better performance
const ResultItem = memo(({ item, index, onClick, locale = 'ar' }: any) => {
    const t = {
        inStock: locale === 'en' ? 'In Stock' : 'متوفر',
        outOfStock: locale === 'en' ? 'Out of Stock' : 'غير متوفر',
        colors: locale === 'en' ? 'colors' : 'ألوان',
        egp: locale === 'en' ? 'EGP' : 'ج.م',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
            onClick={() => onClick(item)}
        >
            <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.mainPic ? (
                        <Image
                            src={item.mainPic}
                            alt={locale === 'ar' ? item.itemNameA : item.itemName}
                            className="w-full h-full object-cover"
                            width={48}
                            height={48}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                        {locale === 'ar' ? item.itemNameA : item.itemName}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                        {item.hasDeal && item.dealPrice ? (
                            <>
                                <span className="text-sm font-semibold text-red-600">
                                    {item.dealPrice} {t.egp}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                    {item.price} {t.egp}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-semibold text-gray-900">
                                {item.price} {t.egp}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.quantity !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                                item.quantity > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {item.quantity > 0 
                                    ? `${t.inStock} (${item.quantity})` 
                                    : t.outOfStock}
                            </span>
                        )}

                        {item.colors && item.colors.length > 0 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {item.colors.length} {t.colors}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

ResultItem.displayName = 'ResultItem';

export const SearchInput = memo(function SearchInput({
    endpoint,
    placeholder,
    debounceMs = 300,
    minChars = 2,
    locale = 'ar',
    pageSize = 20,
    onResultsChange,
    onItemSelect,
    renderResults,
    showResultsInline = true,
    className = '',
}: SearchInputProps) {
    // Translation object
    const t = {
        searchPlaceholder: locale === 'en' 
            ? 'Search for products...' 
            : 'ابحث عن المنتجات...',
        error: locale === 'en' ? 'Error' : 'خطأ',
        noResults: locale === 'en' ? 'No results found' : 'لم يتم العثور على نتائج',
        tryDifferent: locale === 'en' 
            ? 'Try searching with different keywords' 
            : 'جرب البحث بكلمات مفتاحية مختلفة',
        found: locale === 'en' ? 'Found' : 'تم العثور على',
        results: locale === 'en' ? 'results' : 'نتيجة',
        typeAtLeast: locale === 'en' ? 'Type at least' : 'اكتب على الأقل',
        charactersToSearch: locale === 'en' ? 'characters to search' : 'أحرف للبحث',
        clearSearch: locale === 'en' ? 'Clear search' : 'مسح البحث',
    };

    const defaultPlaceholder = placeholder || t.searchPlaceholder;

    const {
        searchText,
        setSearchText,
        data,
        isLoading,
        error,
        isEmpty,
        totalCount,
        reset,
    } = useSearch({
        endpoint,
        debounceMs,
        minChars,
        locale,
        pageSize,
        cacheResults: true,
        onSuccess: onResultsChange,
    });

    const showResults = showResultsInline && searchText.length >= minChars;

    const handleItemClick = useCallback((item: any) => {
        onItemSelect?.(item);
    }, [onItemSelect]);

    const defaultRenderResults = useCallback((items: any[]) => {
        if (!Array.isArray(items)) return null;

        return items.map((item, index) => (
            <ResultItem
                key={item.id || item.itemCode || index}
                item={item}
                index={index}
                onClick={handleItemClick}
                locale={locale}
            />
        ));
    }, [handleItemClick, locale]);

    // Memoize results rendering
    const resultsContent = useMemo(() => {
        if (!showResults) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
            >
                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 border-b">
                        <p className="font-medium">{t.error}</p>
                        <p className="mt-1">{error}</p>
                    </div>
                )}

                {isEmpty && !error && (
                    <div className="p-8 text-center text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium">{t.noResults}</p>
                        <p className="text-xs mt-1">{t.tryDifferent}</p>
                    </div>
                )}

                {!error && !isEmpty && data && (
                    <>
                        {totalCount > 0 && (
                            <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-600">
                                {t.found} {totalCount} {t.results}
                            </div>
                        )}
                        <div className="py-2">
                            {renderResults ? renderResults(data, isEmpty) : defaultRenderResults(data)}
                        </div>
                    </>
                )}
            </motion.div>
        );
    }, [showResults, error, isEmpty, data, totalCount, renderResults, defaultRenderResults, t]);

    return (
        <div className={`relative w-full ${className}`}>
            <div className="relative">
                <div className={`absolute inset-y-0 flex items-center pl-3 pointer-events-none ${
                    locale === 'ar' ? 'right-0' : 'left-0'
                }`}>
                    <Search className="w-5 h-5 text-gray-400" />
                </div>

                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={defaultPlaceholder}
                    className={`w-full py-3 px-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                        locale === 'ar' ? 'text-right' : 'text-left'
                    }`}
                    autoComplete="off"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />

                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-y-0 flex items-center pr-3 ${
                                locale === 'ar' ? 'left-0 pl-3' : 'right-0'
                            }`}
                        >
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        </motion.div>
                    )}

                    {!isLoading && searchText && (
                        <motion.button
                            key="clear"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={reset}
                            className={`absolute inset-y-0 flex items-center pr-3 text-gray-400 hover:text-red-500 transition-colors ${
                                locale === 'ar' ? 'left-0 pl-3' : 'right-0'
                            }`}
                            aria-label={t.clearSearch}
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {searchText.length > 0 && searchText.length < minChars && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs text-gray-500 mt-1 ${
                        locale === 'ar' ? 'text-right' : 'text-left'
                    }`}
                >
                    {t.typeAtLeast} {minChars} {t.charactersToSearch}
                </motion.p>
            )}

            <AnimatePresence>
                {resultsContent}
            </AnimatePresence>
        </div>
    );
});

SearchInput.displayName = 'SearchInput';