import React from 'react';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <CartDrawer />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-100 py-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} PrimeLooks. Crafted for premium shopping.</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
