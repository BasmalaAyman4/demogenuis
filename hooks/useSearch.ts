// hooks/useSearch.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api-client';

interface UseSearchOptions {
    endpoint: string;
    debounceMs?: number;
    minChars?: number;
    locale?: string;
    enabled?: boolean;
    pageSize?: number;
    cacheResults?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
}

interface SearchState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
    totalCount: number;
}

// Simple in-memory cache with TTL
class SearchCache {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private ttl = 5 * 60 * 1000; // 5 minutes

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    set(key: string, data: any): void {
        this.cache.set(key, { data, timestamp: Date.now() });

        // Limit cache size to 50 entries
        if (this.cache.size > 50) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    clear(): void {
        this.cache.clear();
    }
}

const searchCache = new SearchCache();

export function useSearch<T = any>(options: UseSearchOptions) {
    const {
        endpoint,
        debounceMs = 300,
        minChars = 2,
        locale = 'ar',
        enabled = true,
        pageSize = 20,
        cacheResults = true,
        onSuccess,
        onError,
    } = options;

    const [searchText, setSearchText] = useState('');
    const [state, setState] = useState<SearchState<T>>({
        data: null,
        isLoading: false,
        error: null,
        isEmpty: false,
        totalCount: 0,
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const performSearch = useCallback(
        async (query: string) => {
            const trimmedQuery = query.trim();

            if (trimmedQuery.length < minChars) {
                setState({
                    data: null,
                    isLoading: false,
                    error: null,
                    isEmpty: false,
                    totalCount: 0,
                });
                return;
            }

            // Check cache first
            const cacheKey = `${endpoint}-${trimmedQuery}-${locale}`;
            if (cacheResults) {
                const cachedData = searchCache.get(cacheKey);
                if (cachedData && mountedRef.current) {
                    // Handle nested data structure: response.data.data.item
                    const innerData = cachedData.data?.data || cachedData.data;
                    const items = innerData?.item || innerData?.items || innerData;
                    const totalCount = innerData?.totalProductCount || innerData?.totalCount || (Array.isArray(items) ? items.length : 0);

                    setState({
                        data: items,
                        isLoading: false,
                        error: null,
                        isEmpty: !items || (Array.isArray(items) && items.length === 0),
                        totalCount,
                    });
                    onSuccess?.(cachedData);
                    return;
                }
            }

            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            if (mountedRef.current) {
                setState(prev => ({ ...prev, isLoading: true, error: null }));
            }

            try {
                const url = `${endpoint}?searchText=${encodeURIComponent(trimmedQuery)}&pageNo=1&pageSize=${pageSize}`;
                const result = await api.get(url, locale, { skipCache: true });

                if (!mountedRef.current) return;

                if (result.success && result.data) {
                    // Cache the full response
                    const fullResponse = result;

                    if (cacheResults) {
                        searchCache.set(cacheKey, fullResponse);
                    }

                    // Handle nested structure: result.data.data.item
                    // API returns: {success: true, data: {data: {item: [], lastPageNo: 1, totalProductCount: 1045}}}
                    const innerData = result.data.data || result.data;
                    const items = innerData.item || innerData.items || innerData;
                    const totalCount = innerData.totalProductCount || innerData.totalCount || (Array.isArray(items) ? items.length : 0);
                    const isEmpty = !items || (Array.isArray(items) && items.length === 0);

                    setState({
                        data: items,
                        isLoading: false,
                        error: null,
                        isEmpty,
                        totalCount,
                    });

                    // Pass full response to callback
                    onSuccess?.(fullResponse);
                } else {
                    const errorMsg = result.error || result.detail || 'Search failed';
                    setState({
                        data: null,
                        isLoading: false,
                        error: errorMsg,
                        isEmpty: false,
                        totalCount: 0,
                    });
                    onError?.(errorMsg);
                }
            } catch (error: any) {
                if (error.name !== 'AbortError' && mountedRef.current) {
                    const errorMsg = error.message || 'An error occurred';
                    setState({
                        data: null,
                        isLoading: false,
                        error: errorMsg,
                        isEmpty: false,
                        totalCount: 0,
                    });
                    onError?.(errorMsg);
                }
            }
        },
        [endpoint, locale, minChars, pageSize, cacheResults, onSuccess, onError]
    );

    // Debounced search effect
    useEffect(() => {
        if (!enabled) {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            return;
        }

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (searchText.length === 0) {
            setState({
                data: null,
                isLoading: false,
                error: null,
                isEmpty: false,
                totalCount: 0,
            });
            return;
        }

        if (searchText.length < minChars) {
            setState(prev => ({ ...prev, isLoading: false }));
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            performSearch(searchText);
        }, debounceMs);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchText, enabled, debounceMs, minChars, performSearch]);

    const reset = useCallback(() => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        setSearchText('');
        setState({
            data: null,
            isLoading: false,
            error: null,
            isEmpty: false,
            totalCount: 0,
        });
    }, []);

    const clearCache = useCallback(() => {
        searchCache.clear();
    }, []);

    return {
        searchText,
        setSearchText,
        reset,
        clearCache,
        ...state,
    };
}