import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CartIcon } from '@/components/cart/CartIcon';

export const Header = async () => {
  const categories = await prisma.category.findMany({
    take: 5,
  });

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-brand-600 tracking-tight">
              Prime<span className="text-gray-900">Looks</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-brand-600 font-medium transition-colors text-sm">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors text-sm"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <div className="flex items-center space-x-3">
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};
