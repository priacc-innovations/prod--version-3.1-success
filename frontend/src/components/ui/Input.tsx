import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;   // ⭐ Added
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, labelClassName, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
              labelClassName   // ⭐ Apply custom label class
            )}
          >
            {label}
          </label>
        )}

        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
            'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
