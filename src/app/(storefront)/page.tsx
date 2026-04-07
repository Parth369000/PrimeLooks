import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/uitoolkit/Button';
import { Badge } from '@/components/uitoolkit/Badge';
import { ProductCard } from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic'; // Prevent caching so new products appear immediately

export default async function HomePage() {
  const trendingProducts = await prisma.product.findMany({
    where: { isVisible: true },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
    take: 8,
    orderBy: { id: 'desc' }
  });

  const categories = await prisma.category.findMany({ take: 1 });

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-50 pt-20 pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/50 to-white/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="success" className="mb-6 px-4 py-1 text-sm border-0 bg-green-100 text-green-800">
            ✨ Spring Collection is Live
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            Elevate Your Style with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">PrimeLooks</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Discover premium clothing and accessories curated for modern aesthetics. Experience effortless shopping via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="#featured">
              <Button size="lg" className="w-full sm:w-auto shadow-indigo-200/50">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-500 mt-2">Our most popular pieces right now.</p>
          </div>
          <Link href={categories[0] ? `/category/${categories[0].slug}` : '#'}>
            <Button variant="ghost" className="hidden sm:inline-flex">View All &rarr;</Button>
          </Link>
        </div>

        {trendingProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No products available yet. Add some from the Admin Panel!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product, index) => {
              const thumb = product.images.find(img => img.isPrimary) || product.images[0];
              const delayClass = index < 4 ? `animation-delay-${(index + 1) * 100}` : '';
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  actualPrice={product.actualPrice}
                  sellingPrice={product.sellingPrice}
                  categoryName={product.category.name}
                  thumbnailUrl={thumb?.url}
                  className={delayClass}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
