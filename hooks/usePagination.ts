// hooks/usePagination.ts
import { useMemo, useState, useCallback } from 'react';

export interface PaginationConfig {
    itemsPerPage?: number;
    initialPage?: number;
}

export interface PaginationResult<T> {
    currentItems: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setItemsPerPage: (count: number) => void;
    itemsPerPage: number;
}

export function usePagination<T>(
    items: T[],
    config: PaginationConfig = {}
): PaginationResult<T> {
    const { itemsPerPage: initialItemsPerPage = 12, initialPage = 1 } = config;

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

    // Calculate pagination values
    const paginationData = useMemo(() => {
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const currentItems = items.slice(startIndex, endIndex);

        return {
            currentItems,
            totalPages,
            totalItems,
            startIndex,
            endIndex,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        };
    }, [items, currentPage, itemsPerPage]);

    // Navigation functions
    const goToPage = useCallback(
        (page: number) => {
            const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
            setCurrentPage(validPage);
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [paginationData.totalPages]
    );

    const nextPage = useCallback(() => {
        if (paginationData.hasNextPage) {
            goToPage(currentPage + 1);
        }
    }, [currentPage, paginationData.hasNextPage, goToPage]);

    const prevPage = useCallback(() => {
        if (paginationData.hasPrevPage) {
            goToPage(currentPage - 1);
        }
    }, [currentPage, paginationData.hasPrevPage, goToPage]);

    const setItemsPerPage = useCallback((count: number) => {
        setItemsPerPageState(count);
        setCurrentPage(1); // Reset to first page when changing items per page
    }, []);

    // Reset to page 1 when items array changes significantly
    useMemo(() => {
        if (currentPage > paginationData.totalPages && paginationData.totalPages > 0) {
            setCurrentPage(1);
        }
    }, [items.length, paginationData.totalPages]);

    return {
        ...paginationData,
        currentPage,
        itemsPerPage,
        goToPage,
        nextPage,
        prevPage,
        setItemsPerPage,
    };
}