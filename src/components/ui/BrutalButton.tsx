// src/components/ui/BrutalButton.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const baseStyles = "relative font-bold inline-flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none border-4 border-black disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[6px_6px_0px_0px_#0f0f0f]";

    const variants = {
      primary: "bg-purple-500 text-white shadow-[6px_6px_0px_0px_#0f0f0f] hover:bg-purple-400",
      secondary: "bg-white text-black shadow-[6px_6px_0px_0px_#0f0f0f] hover:bg-gray-100",
      danger: "bg-red-500 text-white shadow-[6px_6px_0px_0px_#0f0f0f] hover:bg-red-400",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base uppercase tracking-wide",
      lg: "px-8 py-4 text-lg md:text-xl uppercase tracking-wider",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BrutalButton.displayName = 'BrutalButton';