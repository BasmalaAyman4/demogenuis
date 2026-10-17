// lib/api-client.ts
import { API_CONFIG } from '@/utils/constants';
import { fetchWithRetry, buildBaseHeaders } from './shared/fetch-utils';
import { handleResponse } from './shared/response-handler';
import { handleError } from './shared/error-handler';

interface RequestOptions {
    headers?: Record<string, string>;
    skipCache?: boolean;
    retries?: number;
    timeout?: number;
}

interface CachedData {
    data: any;
    timestamp: number;
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

class ApiClient {
    private baseURL: string;
    private activeRequests: Map<string, Promise<any>>;
    private requestCache: Map<string, CachedData>;
    private cacheTimeout: number;
    private accessToken: string | null;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.activeRequests = new Map();
        this.requestCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
        this.accessToken = null;
    }

    /**
     * Set access token (call this after login or from session provider)
     */
    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    /**
     * Clear access token (call on logout)
     */
    clearAccessToken(): void {
        this.accessToken = null;
    }

    /**
     * Get headers with auth token (no async needed)
     */
    getHeaders(locale: string, customHeaders: Record<string, string> = {}): Record<string, string> {
        const headers = buildBaseHeaders(locale, customHeaders);

        // Add auth token if available
        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        return headers;
    }

    /**
     * Cache helpers
     */
    private getCacheKey(method: string, endpoint: string, locale: string): string {
        return `${method}:${endpoint}:${locale}`;
    }

    private getFromCache(cacheKey: string): any | null {
        const cached = this.requestCache.get(cacheKey);

        if (!cached) return null;

        // Check if expired
        if (Date.now() - cached.timestamp >= this.cacheTimeout) {
            this.requestCache.delete(cacheKey);
            return null;
        }

        return cached.data;
    }

    private setCache(cacheKey: string, data: any): void {
        this.requestCache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });

        // Cleanup old entries (keep max 50)
        if (this.requestCache.size > 50) {
            const firstKey = this.requestCache.keys().next().value;
            this.requestCache.delete(firstKey);
        }
    }

    /**
     * Clear all cache
     */
    clearCache(): void {
        this.requestCache.clear();
    }

    /**
     * Request deduplication
     */
    private async deduplicateRequest<T>(requestKey: string, requestFn: () => Promise<T>): Promise<T> {
        // لو الطلب موجود بالفعل، استني عليه

        const existingRequest = this.activeRequests.get(requestKey);

        if (existingRequest) {
            return existingRequest; // نفس النتيجة للكل!
        }

        // لو جديد، اعمله وخزنه
        const promise = requestFn().finally(() => {
            this.activeRequests.delete(requestKey); // امسحه لما يخلص
        });

        this.activeRequests.set(requestKey, promise);
        return promise;
    }

    /**
     * GET request
     */
    async get(endpoint: string, locale: string = 'ar', options: RequestOptions = {}): Promise<ApiResponse> {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = this.getCacheKey('GET', endpoint, locale);

        // Check cache first
        if (!options.skipCache) {
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[Cache Hit]', endpoint);
                }
                return cached;
            }
        }

        const headers = this.getHeaders(locale, options.headers);

        return this.deduplicateRequest(cacheKey, async () => {
            try {
                const response = await fetchWithRetry(
                    url,
                    { method: 'GET', headers },
                    options.retries,
                    options.timeout
                );

                const result = await handleResponse(response);

                // Cache successful GET responses
                if (result.success && !options.skipCache) {
                    this.setCache(cacheKey, result);
                }

                return result;
            } catch (error) {
                return handleError(error, process.env.NODE_ENV === 'development');
            }
        });
    }

    /**
     * POST request
     */
    async post(endpoint: string, data: any, locale: string = 'ar', options: RequestOptions = {}): Promise<ApiResponse> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(locale, options.headers);

        try {
            const response = await fetchWithRetry(
                url,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data),
                },
                options.retries ?? 0,
                options.timeout
            );

            return await handleResponse(response);
        } catch (error) {
            return handleError(error, process.env.NODE_ENV === 'development');
        }
    }

    /**
     * PUT request
     */
    async put(endpoint: string, data: any, locale: string = 'ar', options: RequestOptions = {}): Promise<ApiResponse> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(locale, options.headers);

        try {
            const response = await fetchWithRetry(
                url,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(data),
                },
                options.retries ?? 0,
                options.timeout
            );

            return await handleResponse(response);
        } catch (error) {
            return handleError(error, process.env.NODE_ENV === 'development');
        }
    }

    /**
     * DELETE request
     */
    async delete(endpoint: string, locale: string = 'ar', options: RequestOptions = {}): Promise<ApiResponse> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(locale, options.headers);

        try {
            const response = await fetchWithRetry(
                url,
                { method: 'DELETE', headers },
                options.retries ?? 1,
                options.timeout
            );

            return await handleResponse(response);
        } catch (error) {
            return handleError(error, process.env.NODE_ENV === 'development');
        }
    }

    /**
     * Cancel specific request
     */
    cancelRequest(requestKey: string): boolean {
        return this.activeRequests.delete(requestKey);
    }

    /**
     * Cancel all active requests
     */
    cancelAll(): void {
        this.activeRequests.clear();
    }
}

// Singleton instance
const apiClient = new ApiClient();

// Export singleton
export default apiClient;

// Export convenience API
export const api = {
    get: (endpoint: string, locale?: string, options?: RequestOptions) =>
        apiClient.get(endpoint, locale, options),
    post: (endpoint: string, data: any, locale?: string, options?: RequestOptions) =>
        apiClient.post(endpoint, data, locale, options),
    put: (endpoint: string, data: any, locale?: string, options?: RequestOptions) =>
        apiClient.put(endpoint, data, locale, options),
    delete: (endpoint: string, locale?: string, options?: RequestOptions) =>
        apiClient.delete(endpoint, locale, options),
    setToken: (token: string) => apiClient.setAccessToken(token),
    clearToken: () => apiClient.clearAccessToken(),
    clearCache: () => apiClient.clearCache(),
    cancelRequest: (key: string) => apiClient.cancelRequest(key),
    cancelAll: () => apiClient.cancelAll(),
};