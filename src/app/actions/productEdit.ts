'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireStoreAdminSession } from '@/lib/auth';

export async function updateProduct(id: number, formData: FormData) {
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

  const product = await prisma.product.findFirst({
    where: { id, storeId: session.storeId },
    select: { id: true },
  });
  if (!product) throw new Error('Product not found');

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      actualPrice,
      sellingPrice,
      stock: isNaN(stock) ? 0 : stock,
      categoryId,
      isTrending,
    },
  });

  // Replace all images: delete old ones and insert new
  if (thumbnail || galleryImages.length > 0) {
    await prisma.productImage.deleteMany({ where: { productId: id } });

    if (thumbnail) {
      await prisma.productImage.create({
        data: { productId: id, url: thumbnail, isPrimary: true },
      });
    }

    const validGallery = galleryImages.filter(url => url && url.trim() !== '');
    if (validGallery.length > 0) {
      await prisma.productImage.createMany({
        data: validGallery.map(url => ({
          productId: id,
          url,
          isPrimary: false,
        })),
      });
    }
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
}
