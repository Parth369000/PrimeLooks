import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Reveal } from '@/components/layout/Reveal';
import { ShowcaseProductCard } from '@/components/product/ShowcaseProductCard';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ domain: string, slug: string }> }) {
  const { domain, slug } = await params;

  const category = await prisma.category.findFirst({
    where: { 
      slug,
      store: { domain: decodeURIComponent(domain) }
    },
  });

  if (!category) return notFound();

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isVisible: true,
    },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(17,24,39,0.96),rgba(120,53,15,0.95))] px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/55">
            <Link href="/" className="transition-colors hover:text-amber-200">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{category.name}</span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/90">
                Curated Collection
              </p>
              <h1 className="mt-3 text-3xl font-light uppercase tracking-[0.14em] text-white md:text-4xl">
                {category.name}
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/70">
              A cleaner, more editorial product grid for shoppers who prefer a premium browsing
              experience before they commit.
            </p>
          </div>
          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-500">
          No products in this category yet.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const thumb = product.images.find(img => img.isPrimary) || product.images[0];
            return (
              <ShowcaseProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                actualPrice={product.actualPrice}
                sellingPrice={product.sellingPrice}
                categoryName={product.category.name}
                thumbnailUrl={thumb?.url}
                revealDelayMs={index * 90}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
