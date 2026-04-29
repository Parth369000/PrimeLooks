import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/uitoolkit/Badge';
import { WhatsAppButton } from '@/components/product/WhatsAppButton';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ShowcaseProductCard } from '@/components/product/ShowcaseProductCard';

export const dynamic = 'force-dynamic';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ domain: string; id: string }>;
}) {
  const { domain, id } = await params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    return notFound();
  }

  const store = await prisma.store.findUnique({
    where: { domain: decodeURIComponent(domain) },
    select: { id: true },
  });

  if (!store) {
    return notFound();
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, storeId: store.id },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
  });

  if (!product || !product.isVisible) {
    return notFound();
  }

  const discount = Math.max(
    0,
    Math.round(((product.actualPrice - product.sellingPrice) / product.actualPrice) * 100)
  );
  const savings = product.actualPrice - product.sellingPrice;

  const whatsappSetting = await prisma.setting.findFirst({
    where: {
      key: 'whatsapp_number',
      store: { domain: decodeURIComponent(domain) },
    },
  });
  const whatsappNumber = whatsappSetting?.value || '';

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
  const primaryImage = product.images.find((image) => image.isPrimary) || product.images[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-amber-600">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.category.slug}`}
          className="transition-colors hover:text-amber-600"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            discount={discount}
          />
        </div>

        <div className="flex flex-col">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-amber-600">
            {product.category.name}
          </p>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{product.name}</h1>
          <p className="mb-6 max-w-xl text-base leading-7 text-gray-600">
            A confident choice for customers who want their watch to look polished, noticeable,
            and easy to style from everyday wear to gifting moments.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-extrabold text-gray-900">
              {formatCurrency(product.sellingPrice)}
            </span>
            {discount > 0 ? (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.actualPrice)}
                </span>
                <Badge variant="success">You save {formatCurrency(savings)}</Badge>
              </>
            ) : null}
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-sm font-medium text-green-600">
                Ready to order • {product.stock} piece{product.stock > 1 ? 's' : ''} available
              </span>
            ) : (
              <span className="text-sm font-medium text-red-500">Currently unavailable</span>
            )}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ['Best For', 'Customers who want a sharper, more put-together wrist presence'],
              ['Why It Works', 'Easy to pair with everyday outfits, festive dressing, and gifting'],
              ['Buying Feel', 'Direct WhatsApp support keeps the final step warm and reassuring'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-[#faf7f0] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 border-t border-gray-100 pt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Why customers choose this piece
            </h3>
            <p className="leading-relaxed text-gray-600">{product.description}</p>
            <p className="mt-4 leading-relaxed text-gray-600">
              If you are looking for a {product.category.name.toLowerCase()} that feels premium
              the moment you wear it, this piece is designed to deliver a cleaner, more confident
              impression.
            </p>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  sellingPrice: product.sellingPrice,
                  actualPrice: product.actualPrice,
                  categoryName: product.category.name,
                  thumbnailUrl: primaryImage?.url,
                }}
                fullWidth
                className="!py-3.5 !text-base"
              />
              {whatsappNumber ? (
                <WhatsAppButton
                  productName={product.name}
                  sellingPrice={product.sellingPrice}
                  whatsappNumber={whatsappNumber}
                />
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
                  Order support will appear here once the store WhatsApp number is configured.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-20">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
                Continue Exploring
              </p>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-[0.12em] text-slate-950">
                You May Also Like
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Similar pieces for customers who like the same premium look, cleaner styling, and
              confident wrist presence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct, index) => {
              const thumb =
                relatedProduct.images.find((image) => image.isPrimary) || relatedProduct.images[0];

              return (
                <ShowcaseProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  actualPrice={relatedProduct.actualPrice}
                  sellingPrice={relatedProduct.sellingPrice}
                  categoryName={relatedProduct.category.name}
                  thumbnailUrl={thumb?.url ?? primaryImage?.url}
                  revealDelayMs={index * 90}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

