// components/ui/Select.tsx
'use client';

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={props.id}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg 
                            focus:ring-2 focus:ring-black focus:border-black 
                            focus:outline-none transition-shadow
                            disabled:bg-gray-100 disabled:cursor-not-allowed
                            appearance-none bg-white
                            ${error ? 'border-red-500' : ''}
                            ${className}`}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;