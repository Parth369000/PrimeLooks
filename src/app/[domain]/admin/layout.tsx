'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ToastProvider } from '@/context/ToastContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
