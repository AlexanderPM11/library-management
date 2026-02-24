import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}) => {
    const baseStyles = 'relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none overflow-hidden';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/20',
        secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
        ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
        glass: 'bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-xl',
    };

    const sizes = {
        sm: 'px-3.5 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Subtle Gradient Overlay for Primary */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}

            {isLoading ? (
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
            ) : null}
            <span className="relative z-10 flex items-center">{children}</span>
        </button>
    );
};
