'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireStoreAdminSession } from '@/lib/auth';

export async function uploadHeroImages(formData: FormData) {
  const session = await requireStoreAdminSession();

  const galleryImages = formData.getAll('galleryImages') as string[];
  const validGallery = galleryImages.filter(url => url && url.trim() !== '');

  if (validGallery.length > 0) {
    const maxOrderRes = await prisma.heroSliderImage.aggregate({
      where: { storeId: session.storeId },
      _max: { order: true }
    });
    let currentOrder = (maxOrderRes._max.order ?? 0) + 1;

    await prisma.heroSliderImage.createMany({
      data: validGallery.map(url => ({
        url,
        order: currentOrder++,
        storeId: session.storeId
      }))
    });
  }

  revalidatePath('/');
  revalidatePath('/admin/hero');
}

export async function deleteHeroImage(id: number) {
  const session = await requireStoreAdminSession();

  await prisma.heroSliderImage.deleteMany({
    where: { id, storeId: session.storeId }
  });

  revalidatePath('/');
  revalidatePath('/admin/hero');
}
