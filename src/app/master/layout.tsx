import React from 'react';
import Link from 'next/link';

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-8 tracking-wider">MASTER ADMIN</h1>
        <nav className="space-y-4">
          <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
            Dashboard
          </Link>
          <Link href="/stores/new" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">
            Create New Store
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
