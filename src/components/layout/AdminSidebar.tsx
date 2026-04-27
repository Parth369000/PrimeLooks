'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '../uitoolkit/Badge';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📋', badge: true },
];

const catalogItems = [
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
];

const marketingItems = [
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
];

const systemItems = [
  { href: '/admin/hero', label: 'Hero Slider', icon: '🖼️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavLink = ({ href, label, icon, badge }: { href: string; label: string; icon: string; badge?: boolean }) => (
    <Link
      href={href}
      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors justify-between ${
        isActive(href)
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span className="flex items-center gap-3">
        <span>{icon}</span>
        {label}
      </span>
      {badge && !isActive(href) && <Badge variant="danger" className="!px-2 !py-0 text-[10px]">New</Badge>}
    </Link>
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <Link href="/admin/dashboard" className="flex items-center group">
          <svg className="w-7 h-7 mr-2 text-white group-hover:text-amber-400 transition-colors" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" />
            <path d="M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5" />
          </svg>
          <span className="text-lg font-light tracking-[0.15em] uppercase text-white">
            Prime<span className="font-bold">Looks</span>
          </span>
          <Badge variant="success" className="ml-3 !px-1.5 !py-0.5 text-[9px] bg-white/10 text-white border-0">ADMIN</Badge>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => <NavLink key={item.href} {...item} />)}

          <div className="pt-5 pb-2">
            <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog</span>
          </div>
          {catalogItems.map((item) => <NavLink key={item.href} {...item} />)}

          <div className="pt-5 pb-2">
            <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Marketing</span>
          </div>
          {marketingItems.map((item) => <NavLink key={item.href} {...item} />)}

          <div className="pt-5 pb-2">
            <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</span>
          </div>
          {systemItems.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link href="/" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
          <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <div>
            <p className="font-medium text-slate-200">Admin User</p>
            <p className="text-xs text-slate-500">View Storefront →</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
