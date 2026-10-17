// utils/validation.ts
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

interface ValidationResult {
    valid: boolean;
    error?: string;
    value?: string;
}

/**
 * تنظيف وتعقيم المدخلات من XSS و SQL Injection
 */
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return input;

    // إزالة HTML tags والمسافات الزائدة
    return validator.escape(validator.trim(input));
};

export const sanitizeHTML = (html: string): string => {
    if (typeof html !== 'string') return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
};

/**
 * التحقق من صحة رقم الموبايل المصري
 */
export const validateMobile = (mobile: string): ValidationResult => {
    const sanitized = sanitizeInput(mobile);

    // رقم مصري: يبدأ بـ 01 ويتبعه 9 أرقام
    const egyptianMobileRegex = /^01[0-2,5]{1}[0-9]{8}$/;

    if (!sanitized) {
        return { valid: false, error: 'Mobile number is required' };
    }

    if (!egyptianMobileRegex.test(sanitized)) {
        return { valid: false, error: 'Invalid Egyptian mobile number' };
    }

    return { valid: true, value: sanitized };
};

/**
 * التحقق من صحة كلمة المرور
 */
export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }

    // على الأقل حرف كبير، حرف صغير، ورقم
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return {
            valid: false,
            error: 'Password must contain uppercase, lowercase, and number'
        };
    }

    return { valid: true, value: password };
};

/**
 * التحقق من OTP (6 أرقام)
 */
export const validateOTP = (otp: string | number): ValidationResult => {
    const sanitized = sanitizeInput(String(otp));

    if (!sanitized) {
        return { valid: false, error: 'OTP is required' };
    }

    if (!/^\d{6}$/.test(sanitized)) {
        return { valid: false, error: 'OTP must be 6 digits' };
    }

    return { valid: true, value: sanitized };
};