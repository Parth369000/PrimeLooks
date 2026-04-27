import React from 'react';
import { prisma } from '@/lib/prisma';
import { createCoupon, toggleCouponStatus, deleteCoupon } from '@/app/actions/coupon';
import { Button } from '@/components/uitoolkit/Button';
import { Input } from '@/components/uitoolkit/Input';
import { Card } from '@/components/uitoolkit/Card';
import { Badge } from '@/components/uitoolkit/Badge';
import { ActionForm } from '@/components/admin/ActionForm';
import { ActionButton } from '@/components/admin/ActionButton';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { id: 'desc' } });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Coupons</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Create Coupon</h3>
            <ActionForm action={createCoupon} successMessage="Coupon created successfully!" className="space-y-4">
              <Input name="code" label="Coupon Code" placeholder="e.g. SAVE20" required />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-700">Discount Type</label>
                <select
                  name="discountType"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <Input type="number" step="0.01" name="discountValue" label="Discount Value" required />
              <Input type="number" step="0.01" name="minCartValue" label="Min Cart Value (₹)" defaultValue="0" />
              <Input type="number" step="0.01" name="maxDiscountCap" label="Max Discount Cap (₹)" placeholder="Optional" />
              <Input type="number" name="usageLimit" label="Usage Limit (0 = unlimited)" defaultValue="0" />
              <Input type="date" name="expiryDate" label="Expiry Date (optional)" />

              <Button type="submit" className="w-full">Create Coupon</Button>
            </ActionForm>
          </Card>
        </div>

        {/* Coupons List */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No coupons yet. Create your first discount code!
                      </td>
                    </tr>
                  ) : coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">{coupon.code}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-semibold text-gray-900">
                          {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                        </span>
                        {coupon.minCartValue > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">Min: ₹{coupon.minCartValue}</p>
                        )}
                        {coupon.maxDiscountCap && (
                          <p className="text-xs text-gray-400">Cap: ₹{coupon.maxDiscountCap}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {coupon.timesUsed}/{coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}
                        {coupon.expiryDate && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Expires: {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <ActionButton 
                          action={toggleCouponStatus.bind(null, coupon.id, coupon.isActive)}
                          successMessage={`Coupon "${coupon.code}" ${coupon.isActive ? 'Deactivated' : 'Activated'}`}
                        >
                          <Badge variant={coupon.isActive ? 'success' : 'outline'} className="cursor-pointer">
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </ActionButton>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionButton 
                          action={deleteCoupon.bind(null, coupon.id)}
                          successMessage={`Coupon "${coupon.code}" deleted successfully.`}
                          confirmMessage={`Are you sure you want to delete coupon "${coupon.code}"?`}
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
