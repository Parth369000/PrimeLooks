'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { setSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter both username and password' };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  // We are using a simple sha256 hash in this iteration
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  if (hashedPassword !== user.password) {
    return { error: 'Invalid credentials' };
  }

  await setSession(user.id, user.username);
  
  if (user.role === 'SUPER_ADMIN') {
    redirect('/');
  } else {
    redirect('/admin/dashboard');
  }
}

export async function logoutAction() {
  const { logout } = await import('@/lib/auth');
  await logout();
  redirect('/admin/login');
}

export async function masterLogoutAction() {
  const { logout } = await import('@/lib/auth');
  await logout();
  redirect('/master/login');
}

export async function checkSessionAction(): Promise<{ valid: boolean }> {
  const { getSession } = await import('@/lib/auth');
  const session = await getSession();
  return { valid: !!session };
}
