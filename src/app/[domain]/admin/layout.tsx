'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ToastProvider } from '@/context/ToastContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith('/admin/login');

  // Don't wrap the login page in AuthGuard
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard loginPath="/admin/login">
      <ToastProvider>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </AuthGuard>
  );
}
