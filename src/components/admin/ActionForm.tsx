'use client';

import React, { useRef } from 'react';
import { useToast } from '@/context/ToastContext';

interface ActionFormProps {
  action: (formData: FormData) => Promise<void>;
  successMessage: string;
  errorMessage?: string;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}

export const ActionForm = ({
  action,
  successMessage,
  errorMessage = 'Something went wrong. Please try again.',
  children,
  className = '',
  resetOnSuccess = true,
}: ActionFormProps) => {
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await action(formData);
      showToast(successMessage, 'success');
      if (resetOnSuccess && formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : errorMessage, 'error');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
