'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function updateOrderStatus(id: number, status: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.order.update({
    where: { id },
    data: { orderStatus: status },
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
}

export async function deleteOrder(id: number) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.order.delete({
    where: { id },
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  discountAmount: number;
  couponId?: number;
  items: { productId: number; quantity: number; priceAtTime: number }[];
}) {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the order
    const order = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        totalAmount: data.totalAmount,
        discountAmount: data.discountAmount,
        couponId: data.couponId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.priceAtTime,
          })),
        },
      },
    });

    // 2. Increment coupon usage if used
    if (data.couponId) {
      await tx.coupon.update({
        where: { id: data.couponId },
        data: { timesUsed: { increment: 1 } },
      });
    }

    return order;
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return result;
}
