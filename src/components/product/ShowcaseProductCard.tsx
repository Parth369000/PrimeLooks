import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/uitoolkit/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Reveal } from '@/components/layout/Reveal';

interface ShowcaseProductCardProps {
  id: number;
  name: string;
  actualPrice: number;
  sellingPrice: number;
  categoryName?: string;
  thumbnailUrl?: string;
  revealDelayMs?: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export function ShowcaseProductCard({
  id,
  name,
  actualPrice,
  sellingPrice,
  categoryName,
  thumbnailUrl,
  revealDelayMs = 0,
}: ShowcaseProductCardProps) {
  const discount = Math.max(0, Math.round(((actualPrice - sellingPrice) / actualPrice) * 100));

  return (
    <Reveal delayMs={revealDelayMs} className="h-full">
      <article className="group relative flex h-full min-h-[33rem] flex-col overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(15,23,42,0.14)]">
        {discount > 0 ? (
          <div className="pointer-events-none absolute left-4 top-4 z-10">
            <Badge className="rounded-full border-0 bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white">
              {discount}% Off
            </Badge>
          </div>
        ) : null}

        <Link href={`/product/${id}`} className="relative block bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_35%),linear-gradient(180deg,_#f8fafc,_#eef2f7)]">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 220px, 250px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-50 transition-transform duration-700 group-hover:scale-105" />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/16 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </Link>

        <div className="flex flex-grow flex-col bg-white p-6 text-center">
          {categoryName ? (
            <p className="mb-3 min-h-[1rem] text-[10px] font-bold uppercase tracking-[0.24em] text-amber-600">
              {categoryName}
            </p>
          ) : null}
          <Link href={`/product/${id}`} className="block">
            <h3 className="min-h-[3.5rem] line-clamp-2 text-base font-light uppercase leading-snug tracking-[0.18em] text-slate-900 transition-colors duration-300 group-hover:text-amber-600 md:text-lg">
              {name}
            </h3>
          </Link>

          <div className="mt-auto pt-5">
            <div className="flex items-end justify-center gap-3">
              <span className="text-lg font-semibold tracking-wide text-slate-900 md:text-xl">
                {formatCurrency(sellingPrice)}
              </span>
              {discount > 0 ? (
                <span className="text-sm font-light text-slate-400 line-through">
                  {formatCurrency(actualPrice)}
                </span>
              ) : null}
            </div>
            <p className="mt-2 min-h-[2rem] text-xs uppercase tracking-[0.18em] text-slate-400">
              Ready to elevate your look
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-center bg-white px-5 pb-6">
          <AddToCartButton
            product={{ id, name, sellingPrice, actualPrice, categoryName, thumbnailUrl }}
            fullWidth
          />
        </div>
      </article>
    </Reveal>
  );
}
