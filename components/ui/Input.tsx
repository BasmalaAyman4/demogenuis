// components/ui/Input.tsx
'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            showPasswordToggle,
            showPassword,
            onTogglePassword,
            className = '',
            ...props

        },
        ref
    ) => {
          const pathname = usePathname(); // e.g. "/en/products/123"
          const segments = pathname.split('/').filter(Boolean); // ["en", "products", "123"]
        
          const locale = segments[0];
        const iconPosition = locale=='ar' ? 'left-3' : 'right-3';
    const inputPadding = locale=='ar' ? 'pl-10 pr-4' : 'pr-10 pl-4';
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={props.id}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                       className={`w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-black focus:border-black 
              focus:outline-none transition-shadow
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''}
              ${className}`}
                        {...props}
                    />
                    {showPasswordToggle && (
                        <button
                            type="button"
                            onClick={onTogglePassword}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 ${iconPosition}`}
                            tabIndex={-1}
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;