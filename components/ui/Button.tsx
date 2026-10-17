// components/ui/Button.tsx
'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    loading?: boolean;
    loadingText?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
}

export default function Button({
    variant = 'primary',
    loading = false,
    loadingText,
    icon,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2';
    
    const variants = {
        primary: 'bg-gradient-to-r from-gray-600 to-gray-500 text-white disabled:bg-gray-400',
        secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-indigo-300',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <LoaderCircle className="animate-spin" size={18} />
                    <span>{loadingText || children}</span>
                </>
            ) : (
                <>
                    {icon}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
}