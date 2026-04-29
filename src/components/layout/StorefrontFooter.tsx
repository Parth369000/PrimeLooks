import React from 'react';
import Link from 'next/link';

interface FooterCategory {
  id: number;
  name: string;
  slug: string;
}

interface StorefrontFooterProps {
  storeName: string;
  categories: FooterCategory[];
  whatsappNumber?: string | null;
}

export function StorefrontFooter({
  storeName,
  categories,
  whatsappNumber,
}: StorefrontFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#05070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0))]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200">
            Prime Luxury Edit
          </span>
          <div>
            <h2 className="text-3xl font-light uppercase tracking-[0.18em] text-white">
              {storeName}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
              Statement watches, cleaner presentation, and personal order support for customers
              who want their style to look considered from the first glance.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-white/75 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                Style
              </p>
              <p className="mt-2 font-medium text-white">Watches that feel bold, polished, and gift-worthy</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                Service
              </p>
              <p className="mt-2 font-medium text-white">Personal assistance before and after checkout</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/85">
            Explore
          </p>
          <div className="mt-5 space-y-3 text-sm text-white/65">
            <Link href="/" className="block transition-colors hover:text-amber-300">
              Home
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="block transition-colors hover:text-amber-300"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/checkout" className="block transition-colors hover:text-amber-300">
              Checkout
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/85">
            Customer Care
          </p>
          <div className="mt-5 space-y-4 text-sm text-white/65">
            <p>Fast confirmation, styling confidence, gifting support, and direct follow-up when you are ready to order.</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                WhatsApp Concierge
              </p>
              <p className="mt-2 font-medium text-white">
                {whatsappNumber ? `+${whatsappNumber}` : 'Available after configuration'}
              </p>
            </div>
            <p className="text-xs text-white/40">
              Selected collections, personal support, and a premium browsing experience from homepage to order confirmation.
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {currentYear} {storeName}. All rights reserved.</p>
          <p>Luxury watch discovery with a more personal buying finish.</p>
        </div>
      </div>
    </footer>
  );
}
