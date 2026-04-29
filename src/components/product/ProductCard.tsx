import React from 'react';
import Link from 'next/link';
import { Card } from '../uitoolkit/Card';
import { Badge } from '../uitoolkit/Badge';
import { AddToCartButton } from '../cart/AddToCartButton';

interface ProductProps {
  id: number;
  name: string;
  actualPrice: number;
  sellingPrice: number;
  categoryName?: string;
  thumbnailUrl?: string;
  className?: string;
}

export const ProductCard = ({
  id,
  name,
  actualPrice,
  sellingPrice,
  categoryName,
  thumbnailUrl,
  className = '',
}: ProductProps) => {
  const discount = Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);

  return (
    <Card className={`group flex flex-col relative !p-0 overflow-hidden rounded-none animate-fade-in-up ${className} border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white`}>
      {/* Premium Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <Badge className="bg-slate-900 text-white font-medium tracking-[0.15em] !px-2 rounded-sm text-[10px] uppercase border-0">{discount}% OFF</Badge>
        </div>
      )}

      {/* Product Image Wrapper */}
      <Link href={`/product/${id}`} className="block relative bg-white">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 group-hover:scale-105 transition-transform duration-500" />
          )}
        </div>
      </Link>

      {/* Product Details Centered Layout */}
      <div className="p-6 flex flex-col flex-grow items-center text-center bg-white">
        {categoryName && <p className="text-amber-500 tracking-[0.2em] text-[10px] font-bold uppercase mb-3">{categoryName}</p>}
        <Link href={`/product/${id}`}>
          <h3 className="font-light text-base md:text-lg text-slate-900 tracking-widest line-clamp-2 group-hover:text-amber-600 transition-colors uppercase leading-snug">{name}</h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-center pt-4">
          <div className="flex items-center gap-3">
            <span className="text-lg md:text-xl font-medium tracking-wide text-slate-900">₹{sellingPrice.toLocaleString()}</span>
            {discount > 0 && (
              <span className="text-sm font-light text-slate-400 line-through">₹{actualPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Button Mount without inner padding blocks */}
      <div className="px-5 pb-6 bg-white flex justify-center">
        <AddToCartButton
          product={{ id, name, sellingPrice, actualPrice, categoryName }}
          fullWidth
        />
      </div>
    </Card>
  );
};
