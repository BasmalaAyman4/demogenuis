// lib/shared/response-handler.ts
import { ERROR_MESSAGES } from '@/utils/constants';

interface ApiResponse {
    success: boolean;
    data: any;
    status: number;
}

interface ApiErrorData {
    detail?: string;
    message?: string;
    title?: string;
    type?: string;
    traceId?: string;
    error?: string;
}

interface ApiError extends Error {
    status: number;
    data: ApiErrorData;
    detail?: string;
    title?: string;
    type?: string;
    traceId?: string;
}

/**
 * معالجة Response (shared بين client و server)
 */
export async function handleResponse(response: Response): Promise<ApiResponse> {
    const contentType = response.headers.get('content-type');

    let data: any;
    if (contentType?.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        // Try to parse as JSON if it's a JSON string
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        // If data is still a string, try to parse it one more time
        let errorData: ApiErrorData = data;
        if (typeof data === 'string') {
            try {
                errorData = JSON.parse(data);
            } catch {
                errorData = { message: data };
            }
        }

        // Get error message based on status code
        let errorMessage: string;

        switch (response.status) {
            case 400:
                errorMessage = errorData.detail || errorData.message || 'بيانات غير صحيحة';
                break;
            case 401:
                errorMessage = ERROR_MESSAGES.ar.UNAUTHORIZED;
                break;
            case 403:
                errorMessage = ERROR_MESSAGES.ar.FORBIDDEN;
                break;
            case 404:
                errorMessage = ERROR_MESSAGES.ar.NOT_FOUND;
                break;
            case 405:
                errorMessage = 'الطريقة المستخدمة غير مسموح بها (Method Not Allowed)';
                break;
            case 408:
                errorMessage = ERROR_MESSAGES.ar.TIMEOUT;
                break;
            case 422:
                errorMessage = errorData.detail || ERROR_MESSAGES.ar.VALIDATION_ERROR;
                break;
            case 429:
                errorMessage = 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً';
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                errorMessage = ERROR_MESSAGES.ar.SERVER_ERROR;
                break;
            default:
                errorMessage = errorData.detail || errorData.message || errorData.title || ERROR_MESSAGES.ar.SERVER_ERROR;
        }

        const error: ApiError = new Error(errorMessage) as ApiError;
        error.status = response.status;
        error.data = errorData;
        error.detail = errorData.detail;
        error.title = errorData.title;
        error.type = errorData.type;
        error.traceId = errorData.traceId;

        throw error;
    }

    return {
        success: true,
        data,
        status: response.status,
    };
}

/**
 * Parse error response
 */
export function parseErrorResponse(data: any): string {
    if (typeof data === 'string') {
        return data;
    }

    // Extract error message with priority: detail > message > error > title
    return data?.detail || data?.message || data?.error || data?.title || ERROR_MESSAGES.ar.SERVER_ERROR;
}