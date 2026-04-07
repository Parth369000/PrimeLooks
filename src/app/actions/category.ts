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

  await prisma.category.create({
    data: {
      name,
      slug,
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
