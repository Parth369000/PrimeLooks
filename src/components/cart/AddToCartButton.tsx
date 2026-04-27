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
      className={`py-3.5 px-6 rounded-none bg-transparent overflow-hidden relative group border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-medium tracking-[0.15em] text-xs uppercase flex items-center justify-center transition-all duration-300 cursor-pointer ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span className="relative z-10 font-bold">ADD TO CART</span>
    </button>
  );
};
