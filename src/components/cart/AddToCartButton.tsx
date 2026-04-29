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
    thumbnailUrl?: string;
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
      className={`relative flex items-center justify-center overflow-hidden rounded-full border border-slate-900 bg-transparent px-6 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white cursor-pointer ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span className="relative z-10 font-bold">ADD TO CART</span>
    </button>
  );
};
