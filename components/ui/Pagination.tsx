// components/ui/Pagination.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    maxVisiblePages?: number;
    className?: string;
    locale:string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    maxVisiblePages = 5,
    className = '',
    locale
}: PaginationProps) {
    // Calculate which page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Calculate range around current page
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let startPage = Math.max(1, currentPage - halfVisible);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            // Adjust if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            // Add first page and ellipsis
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
            }

            // Add visible pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis and last page
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            {/* First Page Button */}
            {showFirstLast && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    aria-label="First page"
                >
                    <ChevronsLeft className="w-5 h-5" />
                </motion.button>
            )}

            {/* Previous Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <motion.button
                            key={pageNum}
                            whileHover={{ scale: isActive ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPageChange(pageNum)}
                            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all ${isActive
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {pageNum}
                        </motion.button>
                    );
                })}
            </div>

            {/* Next Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label="Next page"
            >
                <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Last Page Button */}
            {showFirstLast && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    aria-label="Last page"
                >
                    <ChevronsRight className="w-5 h-5" />
                </motion.button>
            )}
        </div>
    );
}

// Compact pagination info component
interface PaginationInfoProps {
    startIndex: number;
    endIndex: number;
    totalItems: number;
    className?: string;
    locale:string
}

export function PaginationInfo({
    startIndex,
    endIndex,
    totalItems,
    className = '',
    locale
}: PaginationInfoProps) {
    return (
        <div className={`text-sm text-gray-600 ${className}`}>
           {locale === 'en' ? (
    <>
      Showing{' '}
      <span className="font-medium text-gray-900">{startIndex + 1}</span> to{' '}
      <span className="font-medium text-gray-900">{endIndex}</span> of{' '}
      <span className="font-medium text-gray-900">{totalItems}</span> results
    </>
  ) : (
    <>
      عرض من{' '}
      <span className="font-medium text-gray-900">{startIndex + 1}</span> إلى{' '}
      <span className="font-medium text-gray-900">{endIndex}</span> من أصل{' '}
      <span className="font-medium text-gray-900">{totalItems}</span> نتيجة
    </>
  )}
        </div>
    );
}

// Items per page selector
interface ItemsPerPageSelectorProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
    className?: string;
    locale:string
}

export function ItemsPerPageSelector({
    value,
    onChange,
    options = [12, 24, 36, 48],
    className = '',
    locale
}: ItemsPerPageSelectorProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-sm text-gray-600">{locale=='en'?'Show:':'عرض:'}</span>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <span className="text-sm text-gray-600">{locale=='en'? 'per page' : 'لكل صفحة'}</span>
        </div>
    );
}