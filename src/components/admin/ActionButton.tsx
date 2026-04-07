'use client';

import React, { useTransition } from 'react';
import { useToast } from '@/context/ToastContext';

interface ActionButtonProps {
  action: () => Promise<void>;
  successMessage: string;
  errorMessage?: string;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
}

export const ActionButton = ({
  action,
  successMessage,
  errorMessage = 'Action failed. Please try again.',
  children,
  className = '',
  confirmMessage,
}: ActionButtonProps) => {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (confirmMessage) {
      if (!window.confirm(confirmMessage)) return;
    }

    startTransition(async () => {
      try {
        await action();
        showToast(successMessage, 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : errorMessage, 'error');
      }
    });
  };

  return (
    <button 
      type="button" 
      onClick={handleAction} 
      className={`${className} ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      disabled={isPending}
    >
      {isPending ? '...' : children}
    </button>
  );
};
