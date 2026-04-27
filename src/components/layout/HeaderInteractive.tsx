'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartIcon } from '@/components/cart/CartIcon';

interface Category {
  id: number;
  slug: string;
  name: string;
}

export const HeaderInteractive = ({ categories, storeName, logoUrl }: { categories: Category[], storeName?: string, logoUrl?: string | null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = !isHome || isScrolled;

  return (
    <header className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
      isSolid
        ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-0 shadow-sm' 
        : 'bg-transparent border-transparent py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Premium Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              {logoUrl ? (
                <img src={logoUrl} alt={storeName || "Store"} className="h-8 object-contain mr-2 transition-all duration-500 ease-out group-hover:scale-110" />
              ) : (
                <svg className={`w-8 h-8 mr-2 transition-all duration-500 ease-out group-hover:scale-110 ${isSolid ? 'text-slate-900' : 'text-zinc-50'}`} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                  <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" />
                  <path d="M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5" />
                </svg>
              )}
              <h1 className={`text-xl md:text-2xl font-light tracking-[0.2em] uppercase transition-colors duration-300 ${isSolid ? 'text-slate-900' : 'text-white'}`}>
                {storeName ? (
                  <span dangerouslySetInnerHTML={{ __html: storeName.replace(/^(\w+)/, '$1<span class="font-bold">').replace(/\s/g, '') + '</span>' }} />
                ) : (
                  <>Prime<span className="font-bold">Looks</span></>
                )}
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8 px-6">
            <Link href="/" className={`whitespace-nowrap flex-shrink-0 font-medium transition-colors text-sm hover:text-amber-400 ${isSolid ? 'text-gray-700' : 'text-gray-200 drop-shadow-md'}`}>
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`whitespace-nowrap flex-shrink-0 font-medium transition-colors text-sm hover:text-amber-400 ${isSolid ? 'text-gray-700' : 'text-gray-200 drop-shadow-md'}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <div className="flex items-center space-x-3">
            <CartIcon isSolid={isSolid} />
          </div>
        </div>
      </div>
    </header>
  );
};
