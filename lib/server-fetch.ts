// lib/server-fetch.ts
import { API_CONFIG } from '@/utils/constants';
import { fetchWithTimeout, buildBaseHeaders } from './shared/fetch-utils';
import { handleResponse } from './shared/response-handler';
import { handleError, logError } from './shared/error-handler';

interface ServerFetchOptions {
    locale?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    revalidate?: number | false;
    cache?: RequestCache;
    tags?: string[];
    includeAuth?: boolean;
    timeout?: number;
}

interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
    detail?: string;
    errorCode?: string;
    status?: number;
    details?: any;
}

/**
 * Server-side fetch with optimized error handling
 */
export async function serverFetch(endpoint: string, options: ServerFetchOptions = {}): Promise<ApiResponse> {
    const {
        locale = 'ar',
        method = 'GET',
        body = null,
        headers: customHeaders = {},
        revalidate,
        cache,
        tags = [],
        includeAuth = true,
        timeout = API_CONFIG.TIMEOUT,
    } = options;

    // Clean endpoint (avoid double slashes)
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;

    const headers = buildBaseHeaders(locale, customHeaders);

    // Add auth token efficiently (only if needed)
   /*  if (includeAuth) {
        try {
            const session = await auth();
            if (session?.accessToken) {
                headers['Authorization'] = `Bearer ${session.accessToken}`;
            }
        } catch (error) {
            // Silent fail for auth - log only in development
            if (process.env.NODE_ENV === 'development') {
                logError('Session fetch failed', error);
            }
        }
    } */

    const fetchOptions: RequestInit & { next?: any } = {
        method,
        headers,
    };

    // Add body for mutation requests
    if (body && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(body);
    }

    // Next.js caching strategy
    if (revalidate !== undefined) {
        fetchOptions.next = { revalidate, tags };
    } else if (cache) {
        fetchOptions.cache = cache;
    } else if (method === 'GET') {
        // Default caching for GET requests only
        fetchOptions.next = { revalidate: 60, tags };
    } else {
        // No caching for mutations
        fetchOptions.cache = 'no-store';
    }

    try {
        const response = await fetchWithTimeout(url, fetchOptions, timeout);
        return await handleResponse(response);
    } catch (error: any) {
        // Structured error logging
        const errorContext = {
            endpoint: cleanEndpoint,
            method,
            locale,
            status: error?.status,
        };

        // Log differently based on severity
        if (error?.status >= 500) {
            logError(`Server error [${method} ${cleanEndpoint}]`, error, errorContext);
        } else if (process.env.NODE_ENV === 'development') {
            logError(`Request failed [${method} ${cleanEndpoint}]`, error, errorContext);
        }

        return handleError(error, process.env.NODE_ENV === 'development');
    }
}

/**
 * Convenience methods
 */
export const serverApi = {
    get: (endpoint: string, options: ServerFetchOptions = {}) =>
        serverFetch(endpoint, { ...options, method: 'GET' }),

    post: (endpoint: string, body: any, options: ServerFetchOptions = {}) =>
        serverFetch(endpoint, { ...options, method: 'POST', body, cache: 'no-store' }),

    put: (endpoint: string, body: any, options: ServerFetchOptions = {}) =>
        serverFetch(endpoint, { ...options, method: 'PUT', body, cache: 'no-store' }),

    patch: (endpoint: string, body: any, options: ServerFetchOptions = {}) =>
        serverFetch(endpoint, { ...options, method: 'PATCH', body, cache: 'no-store' }),

    delete: (endpoint: string, options: ServerFetchOptions = {}) =>
        serverFetch(endpoint, { ...options, method: 'DELETE', cache: 'no-store' }),
};