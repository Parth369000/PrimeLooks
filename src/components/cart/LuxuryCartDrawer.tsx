'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export function LuxuryCartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    totalSavings,
    totalItems,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { showToast } = useToast();

  const handleRemove = (id: number, name: string) => {
    removeItem(id);
    showToast(`${name} removed from cart.`, 'info');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm transition-all duration-500 ${
          isCartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] flex h-full w-full max-w-md transform flex-col overflow-hidden border-l border-white/10 bg-[#f8f5ef] shadow-[0_20px_80px_rgba(15,23,42,0.3)] transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        <div className="bg-[linear-gradient(135deg,rgba(17,24,39,0.98),rgba(120,53,15,0.98))] px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200/90">
                Shopping Bag
              </p>
              <h2 className="mt-2 text-2xl font-light uppercase tracking-[0.16em]">
                Your Cart
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {totalItems > 0
                  ? `${totalItems} item${totalItems > 1 ? 's' : ''} selected`
                  : 'Empty for now, but ready for your next find.'}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-colors hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center">
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="mt-6 text-lg font-medium text-slate-900">Your cart is empty</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Explore the collection and add pieces here for a smoother checkout flow.
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <article
                key={item.id}
                className="animate-fade-in-up rounded-[1.75rem] border border-slate-200/80 bg-white/92 p-4 shadow-sm"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.25rem] bg-slate-100">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-600">
                      {item.categoryName || 'Curated piece'}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(item.sellingPrice)}
                      </span>
                      {item.actualPrice > item.sellingPrice ? (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.actualPrice)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="ml-auto text-xs font-medium uppercase tracking-[0.14em] text-rose-500 transition-colors hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-slate-200/80 bg-white/90 px-5 py-5">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-[#faf7f0] p-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {totalSavings > 0 ? (
                  <div className="flex justify-between text-emerald-700">
                    <span>You save</span>
                    <span>{formatCurrency(totalSavings)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-950">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-slate-800"
              >
                Continue to Checkout
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
