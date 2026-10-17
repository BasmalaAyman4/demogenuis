// app/[locale]/(auth)/signin/components/LoginOptions.tsx
'use client';

import { memo, useCallback } from 'react';
import { LockKeyhole, Smartphone } from 'lucide-react';
import Button from '@/components/ui/Button';

interface LoginOptionsProps {
    locale: string;
    onSelectMethod: (method: 'password' | 'otp') => void;
    t: any;
}

const LoginOptions = memo(function LoginOptions({ 
    locale, 
    onSelectMethod, 
    t 
}: LoginOptionsProps) {
    const handlePasswordSelect = useCallback(() => {
        onSelectMethod('password');
    }, [onSelectMethod]);

    const handleOTPSelect = useCallback(() => {
        onSelectMethod('otp');
    }, [onSelectMethod]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-[250px]">
            <Button
                onClick={handlePasswordSelect}
                variant="primary"
                icon={<LockKeyhole size={18} />}
                fullWidth
                className="py-4 shadow-lg hover:shadow-xl"
            >
                {t.LoginwithPassword}
            </Button>

            <Button
                onClick={handleOTPSelect}
                variant="secondary"
                icon={<Smartphone size={18} />}
                fullWidth
                className="py-4"
            >
                {t.LoginwithOTP}
            </Button>
        </div>
    );
});

export default LoginOptions;