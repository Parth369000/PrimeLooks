import React from 'react';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const store = await prisma.store.findUnique({
    where: { domain }
  });

  if (!store) {
    notFound();
  }

  // Convert hex color to HSL for dynamic Tailwind variants if needed, or just set primary hex
  // We'll set a raw CSS variable for the theme color.
  const themeStyles = {
    '--theme-primary': store.themeColor,
  } as React.CSSProperties;

  return (
    <ToastProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen" style={themeStyles}>
          <Header storeId={store.id} storeName={store.name} logoUrl={store.logoUrl} />
          <CartDrawer />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-100 py-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} {store.name}. Powered by PrimeLooks SaaS.</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
