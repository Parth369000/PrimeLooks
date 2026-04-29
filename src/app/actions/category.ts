'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireStoreAdminSession } from '@/lib/auth';

export async function createCategory(formData: FormData) {
  const session = await requireStoreAdminSession();

  const name = formData.get('name') as string;
  
  if (!name) {
    throw new Error('Category name is required');
  }
  
  // Basic slugification
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.category.create({
    data: {
      name,
      slug,
      storeId: session.storeId,
    },
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: number) {
  const session = await requireStoreAdminSession();

  await prisma.category.deleteMany({
    where: { id, storeId: session.storeId },
  });

  revalidatePath('/admin/categories');
}
