'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function createCoupon(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const code = (formData.get('code') as string).toUpperCase().trim();
  const discountType = formData.get('discountType') as string;
  const discountValue = parseFloat(formData.get('discountValue') as string);
  const minCartValue = parseFloat(formData.get('minCartValue') as string) || 0;
  const maxDiscountCap = formData.get('maxDiscountCap') ? parseFloat(formData.get('maxDiscountCap') as string) : null;
  const usageLimit = parseInt(formData.get('usageLimit') as string, 10) || 0;
  const expiryDate = formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : null;

  if (!code || !discountType || !discountValue) {
    throw new Error('Missing required fields');
  }

  const user = await prisma.user.findUnique({ where: { id: session.adminId } });
  if (!user || !user.storeId) throw new Error('User has no store assigned');

  await prisma.coupon.create({
    data: {
      code,
      discountType,
      discountValue,
      minCartValue,
      maxDiscountCap,
      usageLimit,
      expiryDate,
      isActive: true,
      storeId: user.storeId,
    },
  });

  revalidatePath('/admin/coupons');
}

export async function toggleCouponStatus(id: number, currentStatus: boolean) {
  await prisma.coupon.update({
    where: { id },
    data: { isActive: !currentStatus },
  });

  revalidatePath('/admin/coupons');
}

export async function deleteCoupon(id: number) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.coupon.delete({
    where: { id },
  });

  revalidatePath('/admin/coupons');
}

export async function validateCoupon(code: string, cartTotal: number) {
  // In a real multi-tenant app we would pass the storeId or domain. For now findFirst by code.
  const coupon = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon) {
    return { success: false, message: 'Invalid coupon code' };
  }

  if (!coupon.isActive) {
    return { success: false, message: 'This coupon is no longer active' };
  }

  const today = new Date();
  if (coupon.expiryDate && new Date(coupon.expiryDate) < today) {
    return { success: false, message: 'This coupon has expired' };
  }

  if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
    return { success: false, message: 'This coupon has reached its usage limit' };
  }

  if (cartTotal < coupon.minCartValue) {
    return { success: false, message: `Minimum cart value of ₹${coupon.minCartValue} required` };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
      discount = coupon.maxDiscountCap;
    }
  } else {
    discount = coupon.discountValue;
  }

  return {
    success: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.round(discount),
    },
  };
}

