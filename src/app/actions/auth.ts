'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter both username and password' };
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: 'Invalid credentials' };
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    return { error: 'Invalid credentials' };
  }

  await setSession(admin.id, admin.username);
  
  redirect('/admin/products');
}

export async function logoutAction() {
  // We'll implement logout in lib/auth and call it here
  const { logout } = await import('@/lib/auth');
  await logout();
  redirect('/admin/login');
}
