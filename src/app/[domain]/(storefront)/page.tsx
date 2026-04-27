import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/uitoolkit/Button';
import { Badge } from '@/components/uitoolkit/Badge';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroVideoSlider } from '@/components/layout/HeroVideoSlider';

export const dynamic = 'force-dynamic'; // Prevent caching so new products appear immediately

export default async function HomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const store = await prisma.store.findUnique({
    where: { domain }
  });

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Store Not Found</h1>
          <p className="text-gray-500">The store {domain} does not exist.</p>
        </div>
      </div>
    );
  }

  const trendingProducts = await prisma.product.findMany({
    where: { storeId: store.id, isVisible: true, isTrending: true },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
    take: 5,
    orderBy: { id: 'desc' }
  });

  const latestProducts = await prisma.product.findMany({
    where: { storeId: store.id, isVisible: true },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
    take: 8,
    orderBy: { id: 'desc' }
  });

  const heroImages = await prisma.heroSliderImage.findMany({
    where: { storeId: store.id },
    orderBy: { order: 'asc' }
  });
  const heroImageUrls = heroImages.map(img => img.url);

  return (
    <div className="relative bg-[#FAFAFA] overflow-hidden min-h-screen">
      <HeroVideoSlider images={heroImageUrls} />

      {/* Luxury Repetitive Monogram Pattern */}
      <div className="absolute inset-0 top-[100vh] pointer-events-none opacity-[0.02] z-0" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230f172a' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpolygon points='16,2 30,10 30,22 16,30 2,22 2,10' /%3E%3Cpath d='M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5' /%3E%3C/g%3E%3C/svg%3E")`, 
             backgroundSize: '150px 150px',
             backgroundPosition: 'center center'
           }}>
      </div>
      
      {/* Giant Ambient Geometric Silhouette */}
      <div className="absolute top-[130vh] right-[-15vw] pointer-events-none opacity-[0.015] text-slate-900 z-0">
        <svg className="w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] -rotate-12" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.2" strokeLinejoin="round" strokeLinecap="round">
          <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" />
          <path d="M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5" />
        </svg>
      </div>

      {/* Featured Products Showcase */}
      <section id="featured" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        <div className="mb-12 flex flex-col items-center sm:items-start pl-2">
          <span className="text-amber-500 font-bold tracking-[0.2em] text-xs uppercase mb-3 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Curated For You
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-slate-900 tracking-[0.1em] uppercase">
            Trending <span className="font-bold">Now</span>
          </h2>
        </div>

        {trendingProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No products available yet. Add some from the Admin Panel!
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-2">
            {trendingProducts.map((product, index) => {
              const thumb = product.images.find(img => img.isPrimary) || product.images[0];
              const delayClass = index < 4 ? `animation-delay-${(index + 1) * 100}` : '';
              return (
                <div key={product.id} className="w-[220px] md:w-[240px] lg:w-[250px] snap-start flex-shrink-0">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    actualPrice={product.actualPrice}
                    sellingPrice={product.sellingPrice}
                    categoryName={product.category.name}
                    thumbnailUrl={thumb?.url}
                    className={delayClass}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Latest Products Showcase */}
      <section id="latest" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 scroll-mt-20 border-t border-gray-200/50">
        <div className="mb-12 flex flex-col items-center sm:items-start pl-2">
          <span className="text-amber-500 font-bold tracking-[0.2em] text-xs uppercase mb-3 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Fresh Off The Line
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-slate-900 tracking-[0.1em] uppercase">
            Latest <span className="font-bold">Arrivals</span>
          </h2>
        </div>

        {latestProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No newer products available yet.
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-2">
            {latestProducts.map((product) => {
              const thumb = product.images.find(img => img.isPrimary) || product.images[0];
              return (
                <div key={product.id} className="w-[220px] md:w-[240px] lg:w-[250px] snap-start flex-shrink-0">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    actualPrice={product.actualPrice}
                    sellingPrice={product.sellingPrice}
                    categoryName={product.category.name}
                    thumbnailUrl={thumb?.url}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
