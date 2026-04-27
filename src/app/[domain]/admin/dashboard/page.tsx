import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/uitoolkit/Card';
import { Badge } from '@/components/uitoolkit/Badge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [totalProducts, totalCategories, totalOrders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { orderStatus: 'COMPLETED' },
  });

  const pendingOrders = await prisma.order.count({ where: { orderStatus: 'PENDING' } });

  const stats = [
    { label: 'Total Products', value: totalProducts, color: 'bg-brand-500', icon: '📦' },
    { label: 'Categories', value: totalCategories, color: 'bg-emerald-500', icon: '🏷️' },
    { label: 'Total Orders', value: totalOrders, color: 'bg-amber-500', icon: '🛒' },
    { label: 'Revenue', value: `₹${revenue._sum.totalAmount || 0}`, color: 'bg-rose-500', icon: '💰' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        {pendingOrders > 0 && (
          <Link href="/admin/orders">
            <Badge variant="danger" className="px-4 py-1.5 text-sm cursor-pointer">
              {pendingOrders} Pending Order{pendingOrders > 1 ? 's' : ''}
            </Badge>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl text-white shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No orders yet. They will appear here once customers place orders.
                  </td>
                </tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.orderStatus === 'COMPLETED' ? 'success' : order.orderStatus === 'CANCELLED' ? 'danger' : 'warning'}>
                      {order.orderStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
