// lib/actions/auth-actions.ts
'use server';

import { signIn as nextAuthSignIn } from '@/auth';
import { serverApi } from '@/lib/server-fetch';
import type { LoginResponse, CompleteDataRequest, CompleteDataResponse } from '@/types/auth';
import { logError } from '@/lib/shared/error-handler';

/**
 * Login with mobile and password
 */
export async function loginWithPassword(mobile: string, password: string) {
    try {
        const result = await nextAuthSignIn('credentials', {
            mobile,
            password,
            redirect: false,
        });

        if (result?.error) {
            logError('Login failed with credentials', new Error(result.error), { mobile });
            return {
                success: false,
                error: 'رقم الموبايل أو كلمة المرور غير صحيحة'
            };
        }

        return { success: true };
    } catch (error: any) {
        logError('Login error', error, { mobile });
        return {
            success: false,
            error: error.message || 'فشل تسجيل الدخول'
        };
    }
}

/**
 * Login with OTP - Send OTP to mobile
 */
export async function loginWithOTP(mobile: string): Promise<LoginResponse> {
    try {
        const response = await serverApi.post(
            `api/Auth/logInWithOTP?mobile=${encodeURIComponent(mobile)}`,
            {
                cache: 'no-store',
                includeAuth: false,
            }
        );

        console.log('OTP Response:', response);

        if (response.success && response.data) {
            return response.data as LoginResponse;
        }

        logError('OTP Login failed', new Error('Invalid response'), {
            mobile,
            response
        });

        return {
            success: false,
            data: null as any,
        };
    } catch (error: any) {
        logError('OTP Login error', error, { mobile });
        return {
            success: false,
            data: null as any,
        };
    }
}

/**
 * Sign in with OTP token after verification
 * This creates a NextAuth session with the user data from OTP login
 */
export async function signInWithOTPToken(userData: {
    id: number;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    token: string;
    verify: boolean;
}) {
    try {
        const result = await nextAuthSignIn('otp-credentials', {
            userId: userData.id.toString(),
            mobile: userData.mobile,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            token: userData.token,
            verify: userData.verify.toString(),
            redirect: false,
        });

        if (result?.error) {
            logError('OTP session creation failed', new Error(result.error), {
                userId: userData.id
            });
            return {
                success: false,
                error: 'فشل في إنشاء الجلسة'
            };
        }

        return { success: true };
    } catch (error: any) {
        logError('OTP sign in error', error, { userId: userData.id });
        return {
            success: false,
            error: error.message || 'فشل تسجيل الدخول'
        };
    }
}

/**
 * Complete user profile after OTP verification
 */
export async function completeProfile(data: CompleteDataRequest): Promise<CompleteDataResponse> {
    try {
        const response = await serverApi.post(
            'api/Auth/completeDataWithOTP',
            data,
            {
                cache: 'no-store',
                includeAuth: false,
            }
        );

        if (response.success && response.data) {
            return response.data as CompleteDataResponse;
        }

        logError('Complete profile failed', new Error('Invalid response'), {
            userId: data.id,
            response
        });

        return {
            success: false,
            data: '',
            data2: null as any,
        };
    } catch (error: any) {
        logError('Complete profile error', error, { userId: data.id });
        return {
            success: false,
            data: '',
            data2: null as any,
        };
    }
}

/**
 * Sign in after completing profile
 */
export async function signInAfterProfileComplete(userData: {
    id: number;
    firstName: string;
    lastName: string;
    mobile: string;
    token: string;
    verify: boolean;
}) {
    try {
        const result = await nextAuthSignIn('otp-credentials', {
            userId: userData.id.toString(),
            mobile: userData.mobile,
            email: `${userData.mobile}@gmail.com`, // Construct email if not provided
            firstName: userData.firstName,
            lastName: userData.lastName,
            token: userData.token,
            verify: userData.verify.toString(),
            redirect: false,
        });

        if (result?.error) {
            logError('Profile complete session creation failed', new Error(result.error), {
                userId: userData.id
            });
            return {
                success: false,
                error: 'فشل في إنشاء الجلسة'
            };
        }

        return { success: true };
    } catch (error: any) {
        logError('Profile complete sign in error', error, { userId: userData.id });
        return {
            success: false,
            error: error.message || 'فشل تسجيل الدخول'
        };
    }
}