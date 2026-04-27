import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateProduct } from '@/app/actions/productEdit';
import { Card } from '@/components/uitoolkit/Card';
import { ProductEditForm } from '@/components/admin/ProductEditForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!product) return notFound();

  const categories = await prisma.category.findMany();

  const updateAction = updateProduct.bind(null, productId);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
          ← Back to Products
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h2>

      <Card className="p-8">
        <ProductEditForm
          product={product}
          categories={categories}
          action={updateAction}
        />
      </Card>
    </div>
  );
}
