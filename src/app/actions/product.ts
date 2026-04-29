'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireStoreAdminSession } from '@/lib/auth';

export async function createProduct(formData: FormData) {
  const session = await requireStoreAdminSession();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const actualPrice = parseFloat(formData.get('actualPrice') as string);
  const sellingPrice = parseFloat(formData.get('sellingPrice') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const categoryId = parseInt(formData.get('categoryId') as string, 10);
  const thumbnail = formData.get('thumbnail') as string;
  const galleryImages = formData.getAll('galleryImages') as string[];
  const isTrending = formData.get('isTrending') === 'on';

  if (!name || !description || !actualPrice || !sellingPrice || !categoryId) {
    throw new Error('Missing required fields');
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, storeId: session.storeId },
    select: { id: true },
  });
  if (!category) throw new Error('Invalid category');

  const product = await prisma.product.create({
    data: {
      storeId: session.storeId,
      name,
      description,
      actualPrice,
      sellingPrice,
      stock: isNaN(stock) ? 0 : stock,
      categoryId,
      isVisible: true,
      isTrending,
    },
  });

  // Save thumbnail as primary image
  if (thumbnail) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: thumbnail,
        isPrimary: true,
      },
    });
  }

  // Save gallery images
  if (galleryImages.length > 0) {
    const validGallery = galleryImages.filter(url => url && url.trim() !== '');
    if (validGallery.length > 0) {
      await prisma.productImage.createMany({
        data: validGallery.map(url => ({
          productId: product.id,
          url,
          isPrimary: false,
        })),
      });
    }
  }

  revalidatePath('/admin/products');
}

export async function deleteProduct(id: number) {
  const session = await requireStoreAdminSession();

  await prisma.product.deleteMany({
    where: { id, storeId: session.storeId },
  });

  revalidatePath('/admin/products');
}

export async function toggleProductVisibility(id: number, currentVisibility: boolean) {
  const session = await requireStoreAdminSession();

  await prisma.product.updateMany({
    where: { id, storeId: session.storeId },
    data: { isVisible: !currentVisibility },
  });

  revalidatePath('/admin/products');
}
