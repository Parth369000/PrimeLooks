'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireStoreAdminSession } from '@/lib/auth';

export async function updateSetting(formData: FormData) {
  const session = await requireStoreAdminSession();

  const key = formData.get('key') as string;
  const value = formData.get('value') as string;

  if (!key || !value) {
    throw new Error('Key and value are required');
  }

  await prisma.setting.upsert({
    where: { storeId_key: { storeId: session.storeId, key } },
    update: { value },
    create: { key, value, storeId: session.storeId },
  });

  revalidatePath('/admin/settings');
}
