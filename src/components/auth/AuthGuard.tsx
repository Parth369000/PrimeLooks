'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  loginPath: string;
}

/**
 * Client-side auth guard that:
 * 1. Checks session on mount and on window focus (detects back-button after logout)
 * 2. Replaces history state so the user can't go "forward" to a protected page
 * 3. Shows a "session expired" overlay before redirecting
 */
export function AuthGuard({ children, loginPath }: AuthGuardProps) {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    async function verifySession() {
      try {
        const result = await checkSessionAction();
        if (!result.valid) {
          setSessionExpired(true);
          setTimeout(() => {
            router.replace(loginPath);
          }, 1500);
        }
      } catch {
        // If the action itself fails, session is likely invalid
        setSessionExpired(true);
        setTimeout(() => {
          router.replace(loginPath);
        }, 1500);
      }
    }

    // Check session on mount
    verifySession();

    // Re-check when user comes back to this tab (e.g. after logging out in another tab)
    const handleFocus = () => verifySession();
    window.addEventListener('focus', handleFocus);

    // Re-check on popstate (browser back/forward)
    const handlePopState = () => verifySession();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, loginPath]);

  if (sessionExpired) {
    return (
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Session Expired</h2>
          <p className="text-gray-500 text-sm mb-4">Your session has ended. Redirecting to login...</p>
          <div className="w-8 h-8 mx-auto border-3 border-gray-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
