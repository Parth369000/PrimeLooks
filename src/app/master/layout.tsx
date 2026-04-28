'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith('/master/login');

  // Don't wrap the login page in AuthGuard
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard loginPath="/master/login">
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-8 tracking-wider">MASTER ADMIN</h1>
          <nav className="space-y-4 flex-1">
            <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
              Dashboard
            </Link>
            <Link href="/stores/new" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
              Create New Store
            </Link>
          </nav>
          <div className="pt-6 border-t border-slate-700">
            <LogoutButton
              variant="master"
              className="w-full px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-center"
            />
          </div>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
