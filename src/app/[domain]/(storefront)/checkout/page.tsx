import React from 'react';
import { prisma } from '@/lib/prisma';
import { CheckoutForm } from '@/components/cart/CheckoutForm';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const whatsappSetting = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } });
  const whatsappNumber = whatsappSetting?.value || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {!whatsappNumber ? (
        <div className="text-center py-20 text-gray-500 bg-amber-50 rounded-2xl border border-amber-200 max-w-xl mx-auto">
          <p className="text-lg font-medium text-amber-800">⚠️ WhatsApp number not configured</p>
          <p className="text-sm mt-2 text-amber-600">Please ask the admin to set a WhatsApp number in Settings.</p>
        </div>
      ) : (
        <CheckoutForm whatsappNumber={whatsappNumber} />
      )}
    </div>
  );
}
