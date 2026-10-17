// lib/shared/fetch-utils.ts
import { getApiLangCode } from '@/utils/locale';
import { API_CONFIG } from '@/utils/constants';

interface FetchOptions extends RequestInit {
    signal?: AbortSignal;
}

interface TimeoutError extends Error {
    name: 'TimeoutError';
    status: number;
    url: string;
}

interface NetworkError extends Error {
    name: 'NetworkError';
    status: number;
    url: string;
}

/**
 * Fetch مع timeout (shared بين client و server)
 */
export async function fetchWithTimeout(
    url: string,
    options: FetchOptions,
    timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);

        // Handle abort/timeout
        if (error.name === 'AbortError') {
            const timeoutError: TimeoutError = new Error(
                `Request timeout after ${timeout}ms: ${url}`
            ) as TimeoutError;
            timeoutError.name = 'TimeoutError';
            timeoutError.status = 408;
            timeoutError.url = url;
            throw timeoutError;
        }

        // Network error
        if (error.message === 'Failed to fetch') {
            const networkError: NetworkError = new Error(
                `Network error: Unable to reach ${url}`
            ) as NetworkError;
            networkError.name = 'NetworkError';
            networkError.status = 0;
            networkError.url = url;
            throw networkError;
        }

        // Re-throw original error with additional context
        error.url = url;
        throw error;
    }
}

/**
 * Retry logic (shared)
 */
export async function fetchWithRetry(
    url: string,
    options: FetchOptions,
    retries: number = API_CONFIG.RETRY_ATTEMPTS,
    timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> {
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetchWithTimeout(url, options, timeout);

            // لو 5xx error، جرب تاني
            if (response.status >= 500 && attempt < retries) {
                const waitTime = API_CONFIG.RETRY_DELAY * (attempt + 1);
                console.warn(
                    `Server error ${response.status}, retrying in ${waitTime}ms (attempt ${attempt + 1}/${retries})`
                );
                await delay(waitTime);
                continue;
            }

            return response;
        } catch (error: any) {
            lastError = error;

            const isRetryable =
                error.name === 'TimeoutError' ||
                error.name === 'NetworkError' ||
                error.message === 'Failed to fetch' ||
                error.name === 'TypeError';

            // لو network error أو timeout، جرب تاني
            if (isRetryable && attempt < retries) {
                const waitTime = API_CONFIG.RETRY_DELAY * (attempt + 1);
                console.warn(
                    `${error.name || 'Network error'}, retrying in ${waitTime}ms (attempt ${attempt + 1}/${retries})`
                );
                await delay(waitTime);
                continue;
            }

            // No more retries
            throw error;
        }
    }

    throw lastError;
}

/**
 * Delay helper
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build headers (shared logic)
 */
export function buildBaseHeaders(locale: string, customHeaders: Record<string, string> = {}): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'langCode': getApiLangCode(locale),
        'webOrMob': '2',
        ...customHeaders,
    };
}