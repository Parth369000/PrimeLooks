import React from 'react';
import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '@/app/actions/category';
import { Button } from '@/components/uitoolkit/Button';
import { Input } from '@/components/uitoolkit/Input';
import { Card } from '@/components/uitoolkit/Card';
import { ActionForm } from '@/components/admin/ActionForm';
import { ActionButton } from '@/components/admin/ActionButton';
import { requireStoreAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const session = await requireStoreAdminSession();
  const categories = await prisma.category.findMany({
    where: { storeId: session.storeId },
    orderBy: { id: 'desc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
        <p className="text-sm text-gray-500">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Category</h3>
            <ActionForm action={createCategory} successMessage="Category created successfully!" className="space-y-4">
              <Input
                name="name"
                label="Category Name"
                placeholder="e.g. Men's Clothing"
                required
              />
              <Button type="submit" className="w-full">
                Save Category
              </Button>
            </ActionForm>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No categories found. Create your first one!
                      </td>
                    </tr>
                  ) : categories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{category.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category._count.products}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButton
                          action={deleteCategory.bind(null, category.id)}
                          successMessage={`"${category.name}" deleted successfully`}
                          confirmMessage={`Are you sure you want to delete "${category.name}"?`}
                          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          Delete
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
