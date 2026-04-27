'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// Using simple hashing for demo purposes, replace with bcrypt or similar in production
import crypto from 'crypto';

export async function createStore(formData: FormData) {
  const name = formData.get('name') as string;
  const domain = formData.get('domain') as string;
  const themeColor = formData.get('themeColor') as string;
  const adminUsername = formData.get('adminUsername') as string;
  const adminPassword = formData.get('adminPassword') as string;

  if (!name || !domain || !adminUsername || !adminPassword) {
    return { error: 'All fields are required.' };
  }

  try {
    // 1. Check if domain already exists
    const existingStore = await prisma.store.findUnique({ where: { domain } });
    if (existingStore) {
      return { error: 'Domain already in use.' };
    }

    // 2. Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username: adminUsername } });
    if (existingUser) {
      return { error: 'Username already in use.' };
    }

    // 3. Hash password (simple demo hash)
    const hashedPassword = crypto.createHash('sha256').update(adminPassword).digest('hex');

    // 4. Create Store and Admin User in a transaction
    await prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          name,
          domain,
          themeColor: themeColor || '#000000',
        }
      });

      await tx.user.create({
        data: {
          username: adminUsername,
          password: hashedPassword,
          role: 'STORE_ADMIN',
          storeId: store.id,
        }
      });
    });

    revalidatePath('/');
  } catch (error: any) {
    console.error('Error creating store:', error);
    return { error: 'Failed to create store.' };
  }

  redirect('/');
}
