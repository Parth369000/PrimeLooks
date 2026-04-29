'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CartIcon } from '@/components/cart/CartIcon';

interface Category {
  id: number;
  slug: string;
  name: string;
}

export const HeaderInteractive = ({
  categories,
  storeName,
  logoUrl,
}: {
  categories: Category[];
  storeName?: string;
  logoUrl?: string | null;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const nameSegments = (storeName ?? 'PrimeLooks')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const leadName = nameSegments.slice(0, -1).join(' ');
  const accentName = nameSegments[nameSegments.length - 1] ?? 'PrimeLooks';

  return (
    <>
      <header
        className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 z-50 w-full transition-all duration-500 ease-out ${
          isSolid
            ? 'border-b border-slate-200/70 bg-[#faf7f0]/90 py-0 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
            : 'border-transparent bg-transparent py-2'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="group flex items-center gap-3">
                {logoUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-white/80 shadow-sm">
                    <Image
                      src={logoUrl}
                      alt={storeName || 'Store'}
                      fill
                      sizes="40px"
                      className="object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ease-out group-hover:scale-105 ${
                      isSolid
                        ? 'border-slate-200 bg-white text-slate-900'
                        : 'border-white/15 bg-black/20 text-zinc-50 backdrop-blur-md'
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 32 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" />
                      <path d="M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5" />
                    </svg>
                  </div>
                )}
                <h1
                  className={`text-lg uppercase tracking-[0.28em] transition-colors duration-300 md:text-xl ${
                    isSolid ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {leadName ? <span className="font-light">{leadName} </span> : null}
                  <span className="font-semibold">{accentName}</span>
                </h1>
              </Link>
            </div>

            <nav className="hidden flex-1 items-center justify-center gap-3 px-6 md:flex">
              <Link
                href="/"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-amber-400 ${
                  pathname === '/'
                    ? isSolid
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white/10 text-white backdrop-blur-md'
                    : isSolid
                      ? 'text-gray-700 hover:bg-white'
                      : 'text-gray-200 drop-shadow-md hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-amber-400 ${
                    pathname === `/category/${cat.slug}`
                      ? isSolid
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white/10 text-white backdrop-blur-md'
                      : isSolid
                        ? 'text-gray-700 hover:bg-white'
                        : 'text-gray-200 drop-shadow-md hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:hidden ${
                  isSolid
                    ? 'border-slate-200 bg-white text-slate-900 shadow-sm'
                    : 'border-white/15 bg-black/15 text-white backdrop-blur-md'
                }`}
                aria-label="Toggle navigation"
                aria-expanded={isMenuOpen}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M6 18 18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4 7h16M4 12h16M4 17h16"
                    />
                  )}
                </svg>
              </button>
              <CartIcon isSolid={isSolid} />
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed inset-x-4 top-20 z-50 rounded-[1.75rem] border border-white/10 bg-[#0b1017]/95 p-5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-500 ease-out md:hidden ${
          isMenuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Navigate</p>
        </div>
        <nav className="space-y-2">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block rounded-2xl px-4 py-3 text-sm transition-colors ${
              pathname === '/'
                ? 'bg-white text-slate-950'
                : 'bg-white/5 text-white/85 hover:bg-white/10'
            }`}
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className={`block rounded-2xl px-4 py-3 text-sm transition-colors ${
                pathname === `/category/${cat.slug}`
                  ? 'bg-white text-slate-950'
                  : 'bg-white/5 text-white/85 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/checkout"
            onClick={() => setIsMenuOpen(false)}
            className="mt-3 block rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-300/15"
          >
            Proceed to Checkout
          </Link>
        </nav>
      </div>
    </>
  );
};
