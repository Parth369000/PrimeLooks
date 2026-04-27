'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function createCategory(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  
  if (!name) {
    throw new Error('Category name is required');
  }
  
  // Basic slugification
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const user = await prisma.user.findUnique({ where: { id: session.adminId } });
  if (!user || !user.storeId) throw new Error('User has no store assigned');

  await prisma.category.create({
    data: {
      name,
      slug,
      storeId: user.storeId,
    },
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: number) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/admin/categories');
}
