'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export const CartIcon = () => {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button onClick={() => setIsCartOpen(true)} className="p-2 text-gray-500 hover:text-brand-600 transition-colors relative cursor-pointer">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-4.5 h-4.5 bg-accent-600 text-white text-[10px] font-bold rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
};
