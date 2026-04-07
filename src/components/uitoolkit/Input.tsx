import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full relative">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-white border rounded-xl shadow-sm 
            transition-all duration-200 outline-none text-gray-900
            focus:ring-2 focus:ring-offset-1 placeholder:text-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-500 font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
