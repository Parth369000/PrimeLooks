'use server';

import bcrypt from 'bcryptjs';
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
    include: { store: true },
  });

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  const sha256Password = crypto.createHash('sha256').update(password).digest('hex');
  const isBcryptHash = user.password.startsWith('$2');
  const isValidPassword = isBcryptHash
    ? await bcrypt.compare(password, user.password)
    : sha256Password === user.password;

  if (!isValidPassword) {
    return { error: 'Invalid credentials' };
  }

  await setSession(
    user.id,
    user.username,
    user.role,
    user.storeId ?? null,
    user.store?.domain ?? null
  );
  
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
