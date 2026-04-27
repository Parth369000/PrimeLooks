'use client';

import React from 'react';
import { Button } from '@/components/uitoolkit/Button';
import { Input } from '@/components/uitoolkit/Input';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ActionForm } from '@/components/admin/ActionForm';

interface Category {
  id: number;
  name: string;
}

interface ProductEditFormProps {
  product: {
    id: number;
    name: string;
    description: string;
    actualPrice: number;
    sellingPrice: number;
    stock: number;
    isTrending: boolean;
    categoryId: number;
    images: { id: number; url: string; isPrimary: boolean }[];
  };
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
}

export const ProductEditForm = ({ product, categories, action }: ProductEditFormProps) => {
  const thumbnail = product.images.find(img => img.isPrimary);
  const galleryImages = product.images.filter(img => !img.isPrimary);

  return (
    <ActionForm 
      action={action} 
      successMessage="Product updated successfully!" 
      resetOnSuccess={false}
      className="space-y-5"
    >
      <Input name="name" label="Product Name" defaultValue={product.name} required />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          name="categoryId"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          defaultValue={product.categoryId}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] text-sm"
          defaultValue={product.description}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input type="number" step="0.01" name="actualPrice" label="Cost Price (₹)" defaultValue={product.actualPrice} required />
        <Input type="number" step="0.01" name="sellingPrice" label="Selling Price (₹)" defaultValue={product.sellingPrice} required />
      </div>

      <Input type="number" name="stock" label="Stock Quantity" defaultValue={product.stock} required />

      <div className="flex items-center gap-2 mt-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
        <input 
          type="checkbox" 
          id="isTrending" 
          name="isTrending" 
          defaultChecked={product.isTrending}
          className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
        />
        <label htmlFor="isTrending" className="text-sm font-bold text-amber-900 select-none cursor-pointer">
          🔥 Mark as Trending (Show on Homescreen)
        </label>
      </div>

      {/* Thumbnail Upload */}
      <ImageUploader
        label="Product Thumbnail"
        name="thumbnail"
        existingImages={thumbnail ? [thumbnail] : []}
      />

      {/* Gallery Upload */}
      <ImageUploader
        label="Gallery Images"
        name="galleryImages"
        multiple
        existingImages={galleryImages}
      />

      <Button type="submit" className="w-full mt-4">
        Save Changes
      </Button>
    </ActionForm>
  );
};
