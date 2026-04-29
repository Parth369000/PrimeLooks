import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HeroVideoSlider } from '@/components/layout/HeroVideoSlider';
import { Reveal } from '@/components/layout/Reveal';
import { ShowcaseProductCard } from '@/components/product/ShowcaseProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const store = await prisma.store.findUnique({
    where: { domain },
  });

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Store Not Found</h1>
          <p className="text-gray-500">The store {domain} does not exist.</p>
        </div>
      </div>
    );
  }

  const trendingProducts = await prisma.product.findMany({
    where: { storeId: store.id, isVisible: true, isTrending: true },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
    take: 5,
    orderBy: { id: 'desc' },
  });

  const latestProducts = await prisma.product.findMany({
    where: { storeId: store.id, isVisible: true },
    include: { category: true, images: { orderBy: { isPrimary: 'desc' } } },
    take: 8,
    orderBy: { id: 'desc' },
  });

  const heroImages = await prisma.heroSliderImage.findMany({
    where: { storeId: store.id },
    orderBy: { order: 'asc' },
  });
  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    take: 4,
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: { products: { where: { isVisible: true } } },
      },
    },
  });
  const visibleProductsCount = await prisma.product.count({
    where: { storeId: store.id, isVisible: true },
  });
  const heroImageUrls = heroImages.map((img) => img.url);

  const promiseCards = [
    {
      eyebrow: 'Statement Style',
      title: 'Watches that sharpen your overall look',
      description:
        'Each piece is presented to feel desirable before checkout, so the first impression already feels premium.',
    },
    {
      eyebrow: 'Buying Confidence',
      title: 'Browse clearly, choose faster, feel surer',
      description:
        'Cleaner copy, clearer pricing, and calmer product journeys reduce hesitation and keep intent high.',
    },
    {
      eyebrow: 'Human Support',
      title: 'Luxury service without the guesswork',
      description:
        'Customers can move from browsing to direct WhatsApp confirmation with a warmer, more personal finish.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f4ee] text-slate-900">
      <HeroVideoSlider images={heroImageUrls} />

      <div
        className="pointer-events-none absolute inset-0 top-[100vh] z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230f172a' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpolygon points='16,2 30,10 30,22 16,30 2,22 2,10' /%3E%3Cpath d='M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          backgroundPosition: 'center center',
        }}
      />
      <div className="pointer-events-none absolute right-[-15vw] top-[130vh] z-0 text-slate-900 opacity-[0.015]">
        <svg
          className="h-[100vw] max-h-[1200px] w-[100vw] max-w-[1200px] -rotate-12"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" />
          <path d="M12 22V10h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5" />
        </svg>
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-600">
                First Impression
              </p>
              <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.12em] text-slate-950 md:text-4xl">
                Designed for shoppers who buy with taste, not impulse.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
                PrimeLooks is no longer just a product grid. The experience now supports desire,
                trust, and a smoother path from discovery to purchase while keeping the same luxury
                watch aesthetic.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Curated Collections', categories.length.toString().padStart(2, '0')],
                ['Ready To Shop', visibleProductsCount.toString().padStart(2, '0')],
                ['Trending Styles', trendingProducts.length.toString().padStart(2, '0')],
              ].map(([label, value], index) => (
                <Reveal key={label} delayMs={140 + index * 120}>
                  <div className="rounded-[2rem] border border-slate-200/10 bg-[#111827] px-6 py-8 text-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{label}</p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight text-amber-300">{value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {promiseCards.map((card, index) => (
            <Reveal key={card.title} delayMs={120 + index * 120}>
              <div className="h-full rounded-[1.85rem] border border-slate-200/70 bg-white/80 p-7 shadow-[0_18px_48px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
                  {card.eyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-light leading-tight text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="featured"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
      >
        <Reveal>
          <div className="mb-12 flex flex-col items-center justify-between gap-6 pl-2 sm:items-start lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                <span className="h-[1px] w-8 bg-amber-500"></span>
                Best Sellers
              </span>
              <h2 className="text-4xl font-light uppercase tracking-[0.1em] text-slate-900 lg:text-5xl">
                Most Wanted <span className="font-bold">Now</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              The pieces here are the easiest entry into the brand: bold enough to stand out,
              polished enough to wear daily, and gift-worthy from the first glance.
            </p>
          </div>
        </Reveal>

        {trendingProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-500">
            No products available yet. Add some from the Admin Panel!
          </div>
        ) : (
          <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:mx-0 sm:px-2">
            {trendingProducts.map((product, index) => {
              const thumb = product.images.find((img) => img.isPrimary) || product.images[0];
              return (
                <div
                  key={product.id}
                  className="w-[220px] flex-shrink-0 snap-start md:w-[240px] lg:w-[250px]"
                >
                  <ShowcaseProductCard
                    id={product.id}
                    name={product.name}
                    actualPrice={product.actualPrice}
                    sellingPrice={product.sellingPrice}
                    categoryName={product.category.name}
                    thumbnailUrl={thumb?.url}
                    revealDelayMs={index * 90}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="rounded-[2.1rem] border border-amber-200/60 bg-[linear-gradient(135deg,rgba(120,53,15,0.96),rgba(17,24,39,0.96))] p-8 text-white shadow-[0_30px_70px_rgba(17,24,39,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/90">
                Why Customers Stay
              </p>
              <h2 className="mt-4 text-3xl font-light uppercase tracking-[0.1em]">
                Make the buying journey feel as premium as the watch.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
                Desire gets attention. Trust closes the order. These touchpoints are designed to
                make the store feel polished, reassuring, and easy to buy from.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Gift-Ready Appeal', 'Products feel suitable for personal style upgrades and thoughtful gifting alike.'],
              ['Clear Buying Path', 'Customers always know what to browse next and how to move toward checkout.'],
              ['Live Luxury Feel', 'Motion and transitions add energy without making the page noisy or cheap.'],
              ['Human Confirmation', 'WhatsApp support keeps the final step personal, direct, and reassuring.'],
            ].map(([title, description], index) => (
              <Reveal key={title} delayMs={120 + index * 110}>
                <div className="rounded-[1.7rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
                    {title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="latest"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 border-t border-gray-200/50 px-4 py-10 pb-24 sm:px-6 lg:px-8"
      >
        <Reveal>
          <div className="mb-12 flex flex-col items-center justify-between gap-6 pl-2 sm:items-start lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                <span className="h-[1px] w-8 bg-amber-500"></span>
                Just Added
              </span>
              <h2 className="text-4xl font-light uppercase tracking-[0.1em] text-slate-900 lg:text-5xl">
                New Arrivals <span className="font-bold">Worth Wearing First</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                    index === 0
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white/70 text-slate-700 hover:border-amber-400 hover:text-amber-600'
                  }`}
                >
                  {category.name} {category._count.products > 0 ? `(${category._count.products})` : ''}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {latestProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-500">
            No newer products available yet.
          </div>
        ) : (
          <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:mx-0 sm:px-2">
            {latestProducts.map((product, index) => {
              const thumb = product.images.find((img) => img.isPrimary) || product.images[0];
              return (
                <div
                  key={product.id}
                  className="w-[220px] flex-shrink-0 snap-start md:w-[240px] lg:w-[250px]"
                >
                  <ShowcaseProductCard
                    id={product.id}
                    name={product.name}
                    actualPrice={product.actualPrice}
                    sellingPrice={product.sellingPrice}
                    categoryName={product.category.name}
                    thumbnailUrl={thumb?.url}
                    revealDelayMs={index * 80}
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
