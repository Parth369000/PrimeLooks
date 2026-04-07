import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'success' | 'warning' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = '' 
}) => {
  const variants = {
    primary: 'bg-brand-100 text-brand-600 border border-brand-200/50',
    danger: 'bg-accent-50 text-accent-600 border border-accent-200/50',
    success: 'bg-green-50 text-green-700 border border-green-200/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    outline: 'border border-gray-200 text-gray-600 bg-white',
  };

  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
