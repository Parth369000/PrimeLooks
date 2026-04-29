import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/uitoolkit/Card';
import { ActionForm } from '@/components/admin/ActionForm';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { uploadHeroImages, deleteHeroImage } from '@/app/actions/hero';
import { Button } from '@/components/uitoolkit/Button';
import Image from 'next/image';
import { requireStoreAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HeroSliderAdminPage() {
  const session = await requireStoreAdminSession();
  const images = await prisma.heroSliderImage.findMany({
    where: { storeId: session.storeId },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Hero Slider Manager</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Upload New Backgrounds</h2>
        <ActionForm action={uploadHeroImages} successMessage="Images added to slider successfully!" resetOnSuccess>
          <ImageUploader label="Slider Images" name="galleryImages" multiple />
          <Button type="submit" className="mt-4 w-full">Upload Images</Button>
        </ActionForm>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Active Slider Images ({images.length})</h2>
        {images.length === 0 ? (
          <div className="bg-gray-50 border border-dashed rounded-xl p-8 text-center text-gray-500">
            No images uploaded yet. The homepage will display standard minimal fallbacks until you upload.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map(img => {
              const removeAction = deleteHeroImage.bind(null, img.id);
              return (
                <Card key={img.id} className="p-3 shadow-sm flex flex-col gap-3">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                    <Image src={img.url} alt="Slider Background" fill className="object-cover" unoptimized={img.url.startsWith('http')} />
                  </div>
                  <form action={removeAction}>
                    <Button type="submit" variant="danger" className="w-full text-xs">
                      Remove from Homepage Slider
                    </Button>
                  </form>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
