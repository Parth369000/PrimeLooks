'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    sellingPrice: number;
    actualPrice: number;
    categoryName?: string;
  };
  className?: string;
  fullWidth?: boolean;
}

export const AddToCartButton = ({ product, className = '', fullWidth = false }: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        showToast(`${product.name} added to cart!`, 'success');
      }}
      className={`py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add to Cart
    </button>
  );
};
