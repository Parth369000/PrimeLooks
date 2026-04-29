import React from 'react';
import { Header } from '@/components/layout/Header';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { StorefrontFooter } from '@/components/layout/StorefrontFooter';
import { LuxuryCartDrawer } from '@/components/cart/LuxuryCartDrawer';

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const store = await prisma.store.findUnique({
    where: { domain },
    include: {
      categories: {
        orderBy: { id: 'asc' },
        take: 6,
      },
      settings: {
        where: { key: 'whatsapp_number' },
        take: 1,
      },
    },
  });

  if (!store) {
    notFound();
  }

  const themeStyles = {
    '--theme-primary': store.themeColor,
  } as React.CSSProperties;
  const whatsappNumber = store.settings[0]?.value ?? null;

  return (
    <ToastProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-[#f7f4ee]" style={themeStyles}>
          <Header storeId={store.id} storeName={store.name} logoUrl={store.logoUrl} />
          <LuxuryCartDrawer />
          <main className="flex-grow">
            {children}
          </main>
          <StorefrontFooter
            storeName={store.name}
            categories={store.categories}
            whatsappNumber={whatsappNumber}
          />
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
