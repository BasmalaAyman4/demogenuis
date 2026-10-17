// app/[locale]/(auth)/signin/SignInForm.tsx
'use client';

import { useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
    loginWithPassword,
    loginWithOTP,
    completeProfile,
    signInWithOTPToken,
    signInAfterProfileComplete
} from '@/lib/actions/auth-actions';
import { validateMobile, validateOTP } from '@/utils/validation';
import type { AuthStep, LoginResponse } from '@/types/auth';
import LoginOptions from './components/LoginOptions';
import PasswordLogin from './components/PasswordLogin';
import OTPLogin from './components/OTPLogin';
import OTPVerification from './components/OTPVerification';
import CompleteProfile from './components/CompleteProfile';

interface SignInFormProps {
    locale: string;
    t: any;
}

const SignInForm = memo(function SignInForm({ locale, t }: SignInFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>('login');
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp' | null>(null);
    const [userData, setUserData] = useState<LoginResponse['data'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle password login
    const handlePasswordLogin = useCallback(async (mobile: string, password: string) => {
        setLoading(true);
        setError(null);

        const mobileValidation = validateMobile(mobile);
        if (!mobileValidation.valid) {
            setError(mobileValidation.error || 'Invalid mobile number');
            setLoading(false);
            return;
        }

        try {
            const result = await loginWithPassword(mobile, password);
            if (result.success) {
                router.push(`/${locale}`);
                router.refresh();
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [locale, router]);

    // Handle OTP login
    const handleOTPLogin = useCallback(async (mobile: string) => {
        setLoading(true);
        setError(null);

        const mobileValidation = validateMobile(mobile);
        if (!mobileValidation.valid) {
            setError(mobileValidation.error || 'Invalid mobile number');
            setLoading(false);
            return;
        }

        try {
            const result = await loginWithOTP(mobile);
            if (result.success && result.data) {
                setUserData(result.data);
                setStep('otp');
            } else {
                setError('Failed to send OTP');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle OTP verification
    const handleOTPVerification = useCallback(async (otp: string) => {
        if (!userData) return;

        setLoading(true);
        setError(null);

        const otpValidation = validateOTP(otp);
        if (!otpValidation.valid) {
            setError(otpValidation.error || 'Invalid OTP');
            setLoading(false);
            return;
        }

        if (otp !== userData.userOTP) {
            setError(t.InvalidOTPcode);
            setLoading(false);
            return;
        }

        try {
            if (!userData.verify) {
                setStep('complete-profile');
            } else {
                const sessionResult = await signInWithOTPToken({
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    mobile: userData.mobile,
                    email: userData.email,
                    token: userData.token,
                    verify: userData.verify,
                });

                if (sessionResult.success) {
                    router.push(`/${locale}`);
                    router.refresh();
                } else {
                    setError(sessionResult.error || 'Failed to create session');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [userData, t, locale, router]);

    // Handle profile completion
    const handleCompleteProfile = useCallback(async (data: {
        firstName: string;
        lastName: string;
        password: string;
        address: string;
        birthdate: string;
    }) => {
        if (!userData) return;

        setLoading(true);
        setError(null);

        try {
            const result = await completeProfile({
                id: userData.id,
                ...data,
            });

            if (result.success && result.data2) {
                const sessionResult = await signInAfterProfileComplete({
                    id: result.data2.id,
                    firstName: result.data2.firstName,
                    lastName: result.data2.lastName,
                    mobile: result.data2.mobile,
                    token: result.data2.token,
                    verify: result.data2.verify,
                });

                if (sessionResult.success) {
                    router.push(`/${locale}`);
                    router.refresh();
                } else {
                    setError(sessionResult.error || 'Failed to create session');
                }
            } else {
                setError('Failed to complete profile');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [userData, locale, router]);

    const handleBack = useCallback(() => {
        setLoginMethod(null);
        setError(null);
    }, []);

    // Render based on current step
    if (step === 'login') {
        if (!loginMethod) {
            return (
                <LoginOptions
                    locale={locale}
                    onSelectMethod={setLoginMethod}
                    t={t}
                />
            );
        }

        if (loginMethod === 'password') {
            return (
                <PasswordLogin
                    locale={locale}
                    loading={loading}
                    error={error}
                    onSubmit={handlePasswordLogin}
                    onBack={handleBack}
                    t={t}
                />
            );
        }

        if (loginMethod === 'otp') {
            return (
                <OTPLogin
                    locale={locale}
                    loading={loading}
                    error={error}
                    onSubmit={handleOTPLogin}
                    onBack={handleBack}
                    t={t}
                />
            );
        }
    }

    if (step === 'otp') {
        return (
            <OTPVerification
                locale={locale}
                error={error}
                onSubmit={handleOTPVerification}
                t={t}
            />
        );
    }

    if (step === 'complete-profile') {
        return (
            <CompleteProfile
                locale={locale}
                loading={loading}
                error={error}
                onSubmit={handleCompleteProfile}
                t={t}
            />
        );
    }

    return null;
});

export default SignInForm;