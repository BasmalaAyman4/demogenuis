// app/[locale]/(auth)/signin/components/OTPVerification.tsx
'use client';

import { useState } from 'react';
import OtpInput from 'react-otp-input';

interface OTPVerificationProps {
    locale: string;
    error: string | null;
    onSubmit: (otp: string) => void;
    t:any
}

export default function OTPVerification({
    locale,
    error,
    onSubmit,
    t
}: OTPVerificationProps) {
    const [otp, setOtp] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
            onSubmit(otp);
        }
    };

 
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t.EnterVerificationCode}
                </h3>
                <p className="text-gray-600 text-sm">
                    {t.Wesentaverificationcodetoyourmobile}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="flex justify-center" dir="ltr">
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => (
                        <input
                            {...props}
                            className="!w-12 !h-12 mx-1 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                    )}
                    shouldAutoFocus
                    inputType="tel"
                />
            </div>

            <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full bg-black hover:bg-black-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                {t.Verify}
            </button>

           
        </form>
    );
}