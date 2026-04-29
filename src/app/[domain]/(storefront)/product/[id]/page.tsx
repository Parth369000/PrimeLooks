import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/uitoolkit/Badge';
import { WhatsAppButton } from '@/components/product/WhatsAppButton';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ domain: string, id: string }> }) {
  const { domain, id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) return notFound();

  const store = await prisma.store.findUnique({
    where: { domain: decodeURIComponent(domain) },
    select: { id: true },
  });
  if (!store) return notFound();

  const product = await prisma.product.findFirst({
    where: { id: productId, storeId: store.id },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
  });

  if (!product || !product.isVisible) return notFound();

  const discount = Math.round(((product.actualPrice - product.sellingPrice) / product.actualPrice) * 100);
  const savings = product.actualPrice - product.sellingPrice;

  // Fetch WhatsApp number from settings
  const whatsappSetting = await prisma.setting.findFirst({ 
    where: { 
      key: 'whatsapp_number',
      store: { domain: decodeURIComponent(domain) }
    } 
  });
  const whatsappNumber = whatsappSetting?.value || '';

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      storeId: store.id,
      categoryId: product.categoryId,
      isVisible: true,
      id: { not: product.id },
    },
    take: 4,
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-brand-600 transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          <ProductImageGallery 
            images={product.images} 
            productName={product.name} 
            discount={discount}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm text-brand-600 font-medium mb-2">{product.category.name}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Pricing */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-gray-900">₹{product.sellingPrice}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.actualPrice}</span>
                <Badge variant="success">You save ₹{savings}</Badge>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm font-medium">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-500 text-sm font-medium">✗ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Action Buttons */}
          {product.stock > 0 && (
            <div className="space-y-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  sellingPrice: product.sellingPrice,
                  actualPrice: product.actualPrice,
                  categoryName: product.category.name,
                }}
                fullWidth
                className="!py-3.5 !text-base"
              />
              {whatsappNumber && (
                <WhatsAppButton
                  productName={product.name}
                  sellingPrice={product.sellingPrice}
                  whatsappNumber={whatsappNumber}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((rp) => {
              const rpDiscount = Math.round(((rp.actualPrice - rp.sellingPrice) / rp.actualPrice) * 100);
              return (
                <Link key={rp.id} href={`/product/${rp.id}`} className="group block">
                  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 group-hover:scale-105 transition-transform duration-500" />
                      {rpDiscount > 0 && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge variant="danger">{rpDiscount}% OFF</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{rp.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-gray-900">₹{rp.sellingPrice}</span>
                        {rpDiscount > 0 && <span className="text-sm text-gray-400 line-through">₹{rp.actualPrice}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
