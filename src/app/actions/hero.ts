'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function uploadHeroImages(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const galleryImages = formData.getAll('galleryImages') as string[];
  const validGallery = galleryImages.filter(url => url && url.trim() !== '');

  if (validGallery.length > 0) {
    const user = await prisma.user.findUnique({ where: { id: session.adminId } });
    if (!user || !user.storeId) throw new Error('User has no store assigned');

    const maxOrderRes = await prisma.heroSliderImage.aggregate({
      _max: { order: true }
    });
    let currentOrder = (maxOrderRes._max.order ?? 0) + 1;

    await prisma.heroSliderImage.createMany({
      data: validGallery.map(url => ({
        url,
        order: currentOrder++,
        storeId: user.storeId!
      }))
    });
  }

  revalidatePath('/');
  revalidatePath('/admin/hero');
}

export async function deleteHeroImage(id: number) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.heroSliderImage.delete({
    where: { id }
  });

  revalidatePath('/');
  revalidatePath('/admin/hero');
}
