import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        <p className="text-gray-500 mt-2">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
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
    </div>
  );
}
