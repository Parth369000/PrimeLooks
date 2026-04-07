import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateOrderStatus, deleteOrder } from '@/app/actions/order';
import { Card } from '@/components/uitoolkit/Card';
import { Badge } from '@/components/uitoolkit/Badge';
import { ActionButton } from '@/components/admin/ActionButton';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: true } },
      coupon: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          No orders yet. They will appear here once customers place orders via WhatsApp.
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-sm text-gray-500">Order</span>
                    <p className="text-lg font-bold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Date</span>
                    <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total</span>
                    <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status change buttons */}
                  <ActionButton 
                    action={updateOrderStatus.bind(null, order.id, 'PENDING')}
                    successMessage={`Order #${order.id} set to Pending.`}
                  >
                    <Badge variant={order.orderStatus === 'PENDING' ? 'warning' : 'outline'} className={`cursor-pointer ${order.orderStatus === 'PENDING' ? 'ring-2 ring-amber-300' : ''}`}>
                      Pending
                    </Badge>
                  </ActionButton>

                  <ActionButton 
                    action={updateOrderStatus.bind(null, order.id, 'COMPLETED')}
                    successMessage={`Order #${order.id} marked as Completed.`}
                  >
                    <Badge variant={order.orderStatus === 'COMPLETED' ? 'success' : 'outline'} className={`cursor-pointer ${order.orderStatus === 'COMPLETED' ? 'ring-2 ring-green-300' : ''}`}>
                      Completed
                    </Badge>
                  </ActionButton>

                  <ActionButton 
                    action={updateOrderStatus.bind(null, order.id, 'CANCELLED')}
                    successMessage={`Order #${order.id} marked as Cancelled.`}
                  >
                    <Badge variant={order.orderStatus === 'CANCELLED' ? 'danger' : 'outline'} className={`cursor-pointer ${order.orderStatus === 'CANCELLED' ? 'ring-2 ring-red-300' : ''}`}>
                      Cancelled
                    </Badge>
                  </ActionButton>

                  <span className="text-gray-200">|</span>
                  <ActionButton 
                    action={deleteOrder.bind(null, order.id)}
                    successMessage={`Order #${order.id} deleted successfully.`}
                    confirmMessage={`Are you sure you want to delete order #${order.id}?`}
                    className="text-red-400 hover:text-red-600 transition-colors text-sm cursor-pointer"
                  >
                    Delete
                  </ActionButton>
                </div>
              </div>

              {/* Customer Info + Items */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</h4>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">📱 {order.customerPhone}</p>
                  <p className="text-sm text-gray-500">📍 {order.customerAddress}</p>
                </div>

                {/* Items */}
                <div className="md:col-span-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2.5">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{item.product.name}</span>
                          <span className="text-xs text-gray-400 ml-2">× {item.quantity}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">₹{item.priceAtTime * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between mt-3 text-sm text-green-600 px-4">
                      <span>Discount {order.coupon ? `(${order.coupon.code})` : ''}</span>
                      <span>-₹{order.discountAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
