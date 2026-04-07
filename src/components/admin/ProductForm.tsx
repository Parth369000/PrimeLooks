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

export const ProductForm = ({ categories, action }: { categories: Category[]; action: (formData: FormData) => Promise<void> }) => {
  return (
    <ActionForm 
      action={action} 
      successMessage="Product created successfully!" 
      className="space-y-4"
    >
      <Input name="name" label="Product Name" required />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          name="categoryId"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input type="number" step="0.01" name="actualPrice" label="Cost (₹)" required />
        <Input type="number" step="0.01" name="sellingPrice" label="Sell (₹)" required />
      </div>

      <Input type="number" name="stock" label="Stock Qty" defaultValue="10" required />

      {/* Thumbnail Upload */}
      <ImageUploader label="Product Thumbnail" name="thumbnail" />

      {/* Gallery Upload */}
      <ImageUploader label="Gallery Images" name="galleryImages" multiple />

      <Button type="submit" className="w-full mt-6">
        Save Product
      </Button>
    </ActionForm>
  );
};
