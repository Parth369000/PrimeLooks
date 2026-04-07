'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function updateSetting(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const key = formData.get('key') as string;
  const value = formData.get('value') as string;

  if (!key || !value) {
    throw new Error('Key and value are required');
  }

  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  revalidatePath('/admin/settings');
}
