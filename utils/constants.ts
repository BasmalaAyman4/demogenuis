// utils/constants.ts

// Validate environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is required in environment variables');
}

export const API_CONFIG = {
    BASE_URL: API_URL,
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 1500, // 1.5 seconds
} as const;

export const TIME_CONSTANTS = {
    SESSION_MAX_AGE: 15 * 60 * 1000, // 15 min
    CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
    RATE_LIMIT_WINDOW_AUTH: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_WINDOW_API: 60 * 1000, // 1 minute
    RATE_LIMIT_WINDOW_SEARCH: 60 * 1000, // 1 minute
    REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

export const RATE_LIMITS = {
    AUTH: {
        limit: 5,
        window: TIME_CONSTANTS.RATE_LIMIT_WINDOW_AUTH,
        maxMapSize: 1000,
    },
    API: {
        limit: 60,
        window: TIME_CONSTANTS.RATE_LIMIT_WINDOW_API,
        maxMapSize: 1000,
    },
    SEARCH: {
        limit: 30,
        window: TIME_CONSTANTS.RATE_LIMIT_WINDOW_SEARCH,
        maxMapSize: 1000,
    },
} as const;

type ErrorMessageKeys = 'TIMEOUT' | 'NETWORK' | 'UNAUTHORIZED' | 'RATE_LIMIT' | 'SERVER_ERROR' | 'VALIDATION';

export const ERROR_MESSAGES: Record<'ar' | 'en', Record<ErrorMessageKeys, string>> = {
    ar: {
        TIMEOUT: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى',
        NETWORK: 'فشل الاتصال بالسيرفر. تحقق من اتصال الإنترنت',
        UNAUTHORIZED: 'غير مصرح',
        RATE_LIMIT: 'محاولات كثيرة جداً. يرجى الانتظار',
        SERVER_ERROR: 'خطأ في السيرفر. يرجى المحاولة لاحقاً',
        VALIDATION: 'بيانات غير صحيحة',
    },
    en: {
        TIMEOUT: 'Request timeout. Please try again',
        NETWORK: 'Network connection failed. Check your internet',
        UNAUTHORIZED: 'Unauthorized',
        RATE_LIMIT: 'Too many attempts. Please wait',
        SERVER_ERROR: 'Server error. Please try later',
        VALIDATION: 'Invalid data',
    }
};

export const getErrorMessage = (key: ErrorMessageKeys, locale: 'ar' | 'en' = 'ar'): string => {
    return ERROR_MESSAGES[locale]?.[key] || ERROR_MESSAGES.ar[key];
};