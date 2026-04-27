'use client';

import React, { useState } from 'react';
import { Button } from '@/components/uitoolkit/Button';
import { Card } from '@/components/uitoolkit/Card';
import { loginAction } from '@/app/actions/auth';

export default function MasterLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">
            Master <span className="text-amber-500">Access</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">SaaS Platform Control Panel</p>
        </div>

        <Card className="p-8 shadow-2xl border-0 bg-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
              <input 
                name="username"
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-gray-600"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 rounded-xl shadow-lg bg-amber-600 hover:bg-amber-700 text-white text-base font-bold tracking-wide border-0" 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
