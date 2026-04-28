'use client';

import React, { useState } from 'react';
import { logoutAction, masterLogoutAction } from '@/app/actions/auth';

interface LogoutButtonProps {
  variant?: 'admin' | 'master';
  className?: string;
}

export function LogoutButton({ variant = 'admin', className = '' }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      if (variant === 'master') {
        await masterLogoutAction();
      } else {
        await logoutAction();
      }
    } catch {
      // redirect throws an error in Next.js, this is expected
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${className}`}
      id="logout-button"
    >
      {isLoggingOut ? (
        <>
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </>
      )}
    </button>
  );
}
