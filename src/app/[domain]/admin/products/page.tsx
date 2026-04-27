import React from 'react';
import { prisma } from '@/lib/prisma';
import { createProduct, deleteProduct, toggleProductVisibility } from '@/app/actions/product';
import { Card } from '@/components/uitoolkit/Card';
import { Badge } from '@/components/uitoolkit/Badge';
import { ProductForm } from '@/components/admin/ProductForm';
import { ActionButton } from '@/components/admin/ActionButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { isPrimary: 'desc' } },
    },
    orderBy: { id: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
        <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border-gray-100 border p-6 rounded-2xl bg-white shadow-sm h-min">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Product</h3>
          <ProductForm categories={categories} action={createProduct} />
        </div>

        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No products yet. Create categories and add products.
                      </td>
                    </tr>
                  ) : products.map((product) => {
                    const profitMargin = ((product.sellingPrice - product.actualPrice) / product.actualPrice * 100).toFixed(1);
                    const thumbnail = product.images.find(img => img.isPrimary) || product.images[0];
                    return (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {thumbnail ? (
                                <img src={thumbnail.url} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-gray-200 to-gray-50" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{product.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{product.category.name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{product.images.length} image{product.images.length !== 1 ? 's' : ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">₹{product.sellingPrice}</div>
                          <div className="text-xs text-green-600 mt-1">Margin: {profitMargin}%</div>
                          <div className="text-xs text-slate-400 mt-0.5">Cost: ₹{product.actualPrice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <ActionButton 
                            action={toggleProductVisibility.bind(null, product.id, product.isVisible)}
                            successMessage={`Product "${product.name}" Visibility updated.`}
                          >
                            <Badge variant={product.isVisible ? 'success' : 'outline'}>
                              {product.isVisible ? 'Visible' : 'Hidden'}
                            </Badge>
                          </ActionButton>
                          <div className="text-xs text-slate-500 mt-2">Stock: {product.stock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                          <Link href={`/admin/products/${product.id}/edit`} className="text-brand-600 hover:text-brand-700 transition-colors">
                            Edit
                          </Link>
                          <ActionButton 
                            action={deleteProduct.bind(null, product.id)}
                            successMessage={`Product "${product.name}" deleted successfully.`}
                            confirmMessage={`Are you sure you want to delete "${product.name}"?`}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </ActionButton>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
