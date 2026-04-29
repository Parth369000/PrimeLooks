'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireStoreAdminSession } from '@/lib/auth';

export async function updateOrderStatus(id: number, status: string) {
  const session = await requireStoreAdminSession();

  await prisma.order.updateMany({
    where: { id, storeId: session.storeId },
    data: { orderStatus: status },
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
}

export async function deleteOrder(id: number) {
  const session = await requireStoreAdminSession();

  await prisma.order.deleteMany({
    where: { id, storeId: session.storeId },
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
  domain: string;
  items: { productId: number; quantity: number; priceAtTime: number }[];
}) {
  const store = await prisma.store.findUnique({ where: { domain: decodeURIComponent(data.domain) } });
  if (!store) throw new Error('Store not found');

  if (data.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      storeId: store.id,
      isVisible: true,
    },
    select: {
      id: true,
      sellingPrice: true,
      stock: true,
      name: true,
    },
  });

  if (products.length !== data.items.length) {
    throw new Error('One or more products are invalid for this store');
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  let computedSubtotal = 0;

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error('Invalid product');
    }
    if (item.quantity <= 0) {
      throw new Error('Invalid quantity');
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    computedSubtotal += product.sellingPrice * item.quantity;
  }

  let couponId: number | null = null;
  let discountAmount = 0;
  if (data.couponId) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        id: data.couponId,
        storeId: store.id,
        isActive: true,
      },
      select: {
        id: true,
        discountType: true,
        discountValue: true,
        minCartValue: true,
        maxDiscountCap: true,
        usageLimit: true,
        timesUsed: true,
        expiryDate: true,
      },
    });

    const today = new Date();
    if (
      coupon &&
      (!coupon.expiryDate || new Date(coupon.expiryDate) >= today) &&
      (coupon.usageLimit === 0 || coupon.timesUsed < coupon.usageLimit) &&
      computedSubtotal >= coupon.minCartValue
    ) {
      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = (computedSubtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap) {
          discountAmount = coupon.maxDiscountCap;
        }
      } else {
        discountAmount = coupon.discountValue;
      }
      couponId = coupon.id;
    }
  }

  discountAmount = Math.round(discountAmount);
  const finalTotal = Math.max(computedSubtotal - discountAmount, 0);

  const result = await prisma.$transaction(async (tx) => {
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        totalAmount: finalTotal,
        discountAmount,
        couponId,
        storeId: store.id,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: productMap.get(item.productId)?.sellingPrice ?? item.priceAtTime,
          })),
        },
      },
    });

    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { timesUsed: { increment: 1 } },
      });
    }

    return order;
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return result;
}
