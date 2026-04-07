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

export const ProductCard = ({ id, name, actualPrice, sellingPrice, categoryName, thumbnailUrl, className = '' }: ProductProps) => {
  const discount = Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);

  return (
    <Card className={`group flex flex-col relative !p-0 overflow-hidden animate-fade-in-up ${className}`}>
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <Badge variant="danger">{discount}% OFF</Badge>
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${id}`} className="block">
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 group-hover:scale-105 transition-transform duration-500" />
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <Link href={`/product/${id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors">{name}</h3>
        </Link>
        {categoryName && <p className="text-gray-500 text-sm mt-1 mb-4">{categoryName}</p>}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{sellingPrice}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">₹{actualPrice}</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 bg-white">
        <AddToCartButton
          product={{ id, name, sellingPrice, actualPrice, categoryName }}
          fullWidth
        />
      </div>
    </Card>
  );
};
