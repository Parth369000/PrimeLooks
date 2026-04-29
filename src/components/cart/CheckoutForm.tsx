'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { createOrder } from '@/app/actions/order';
import { Input } from '@/components/uitoolkit/Input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface CheckoutFormProps {
  whatsappNumber: string;
  domain: string;
}

export const CheckoutForm = ({ whatsappNumber, domain }: CheckoutFormProps) => {
  const { items, subtotal, totalSavings, clearCart } = useCart();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalTotal = subtotal;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', address: '' };

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter a valid full name (min 2 characters).';
      isValid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    if (!address.trim() || address.trim().length < 15) {
      newErrors.address =
        'Please provide a detailed address (min 15 chars) including House No, Street, and Pincode.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in your delivery details.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        totalAmount: finalTotal,
        discountAmount: 0,
        domain,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtTime: item.sellingPrice,
        })),
      });

      const itemLines = items
        .map(
          (item) =>
            `- ${item.name} x ${item.quantity} = Rs.${item.sellingPrice * item.quantity}`
        )
        .join('\n');

      const message = encodeURIComponent(
        `New Order from PrimeLooks\n\n` +
          `Customer: ${name}\n` +
          `Phone: ${phone}\n` +
          `Address: ${address}\n\n` +
          `Order Details:\n${itemLines}\n\n` +
          (totalSavings > 0 ? `Original Savings: Rs.${totalSavings}\n` : '') +
          `Final Total: Rs.${finalTotal}\n\n` +
          `Please confirm my order. Thank you!`
      );

      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      showToast('Order saved and WhatsApp opened!', 'success');

      setTimeout(() => {
        clearCart();
        setName('');
        setPhone('');
        setAddress('');
        setIsSubmitting(false);
      }, 1500);
    } catch (err: unknown) {
      console.error('Order Error:', err);
      showToast(
        err instanceof Error ? err.message : 'Failed to place order. Please try again.',
        'error'
      );
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <svg className="w-20 h-20 mx-auto mb-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products before checking out.</p>
        <Link href="/" className="text-brand-600 hover:text-brand-700 font-semibold">
          Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout via WhatsApp</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Order Summary
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} x Rs.{item.sellingPrice}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    Rs.{item.sellingPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs.{subtotal}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Product Savings</span>
                  <span>-Rs.{totalSavings}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span className="text-brand-600">Rs.{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={name}
                error={errors.name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="10 digit mobile number"
                maxLength={10}
                value={phone}
                error={errors.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhone(value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full relative">
              <label className="text-sm font-medium text-gray-700">
                Detailed Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                placeholder="Street name, House No, Landmark, City, State, Pincode"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl shadow-sm outline-none focus:ring-2 min-h-[120px] text-sm transition-all ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300'
                }`}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                required
              />
              {errors.address && (
                <span className="text-sm text-red-500 font-medium mt-0.5">{errors.address}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-600/20 active:scale-[0.98]"
            >
              <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {isSubmitting ? 'Processing...' : 'Send Order via WhatsApp'}
            </button>
            <p className="text-center text-[10px] text-gray-400">
              By clicking this button, your order will be saved in our system and you will be redirected to WhatsApp for final confirmation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
