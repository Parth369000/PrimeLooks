'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createOrder } from '@/app/actions/order';
import { Input } from '@/components/uitoolkit/Input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Reveal } from '@/components/layout/Reveal';

interface StorefrontCheckoutFormProps {
  whatsappNumber: string;
  domain: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export function StorefrontCheckoutForm({
  whatsappNumber,
  domain,
}: StorefrontCheckoutFormProps) {
  const { items, subtotal, totalSavings, clearCart } = useCart();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', address: '' };

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter a valid full name.';
      isValid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    if (!address.trim() || address.trim().length < 15) {
      newErrors.address =
        'Please provide a detailed address including house, street, and pincode.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      showToast('Please review your delivery details.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        totalAmount: subtotal,
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
            `- ${item.name} x ${item.quantity} = ${formatCurrency(item.sellingPrice * item.quantity)}`
        )
        .join('\n');

      const message = encodeURIComponent(
        `New Order from PrimeLooks\n\n` +
          `Customer: ${name}\n` +
          `Phone: ${phone}\n` +
          `Address: ${address}\n\n` +
          `Order Details:\n${itemLines}\n\n` +
          (totalSavings > 0 ? `Product Savings: ${formatCurrency(totalSavings)}\n` : '') +
          `Final Total: ${formatCurrency(subtotal)}\n\n` +
          `Please confirm my order. Thank you.`
      );

      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
      showToast('Order saved and WhatsApp opened.', 'success');

      window.setTimeout(() => {
        clearCart();
        setName('');
        setPhone('');
        setAddress('');
        setIsSubmitting(false);
      }, 1200);
    } catch (error: unknown) {
      showToast(
        error instanceof Error ? error.message : 'Failed to place order. Please try again.',
        'error'
      );
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/85 px-6 py-12 shadow-sm">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-light uppercase tracking-[0.14em] text-slate-900">
            Your cart is empty
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Add a few pieces before continuing to checkout.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
          >
            Back to shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(17,24,39,0.96),rgba(120,53,15,0.95))] px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/90">
            Concierge Checkout
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-light uppercase tracking-[0.14em] md:text-4xl">
                Complete your order
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Review your selection, share your delivery details, and finish with direct
                WhatsApp confirmation so the order still feels personal.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
              {items.length} item{items.length > 1 ? 's' : ''} ready
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <div className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold uppercase tracking-[0.14em] text-slate-950">
                Order Summary
              </h2>
              <span className="text-xs uppercase tracking-[0.18em] text-amber-600">
                Ready to confirm
              </span>
            </div>

            <div className="hide-scrollbar mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-[#faf7f0] px-4 py-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-amber-600">
                        {item.categoryName || 'Curated piece'}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Qty {item.quantity} x {formatCurrency(item.sellingPrice)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-950">
                      {formatCurrency(item.sellingPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-[#faf7f0] p-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {totalSavings > 0 ? (
                  <div className="flex justify-between text-emerald-700">
                    <span>Product savings</span>
                    <span>{formatCurrency(totalSavings)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-950">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-7"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
                Delivery Details
              </p>
              <h2 className="mt-2 text-2xl font-light uppercase tracking-[0.12em] text-slate-950">
                Tell us where to send it
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={name}
                error={errors.name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) {
                    setErrors((current) => ({ ...current, name: '' }));
                  }
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
                onChange={(event) => {
                  setPhone(event.target.value.replace(/\D/g, ''));
                  if (errors.phone) {
                    setErrors((current) => ({ ...current, phone: '' }));
                  }
                }}
                required
              />
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Detailed Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                placeholder="House No, street, landmark, city, state, pincode"
                className={`min-h-[140px] w-full rounded-[1.25rem] border bg-[#faf7f0] px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all ${
                  errors.address
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                }`}
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  if (errors.address) {
                    setErrors((current) => ({ ...current, address: '' }));
                  }
                }}
                required
              />
              {errors.address ? (
                <span className="text-sm font-medium text-red-500">{errors.address}</span>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['Clear Checkout', 'Everything you need stays visible before you confirm'],
                ['Direct Support', 'Questions can be resolved quickly on WhatsApp'],
                ['Personal Finish', 'The final step still feels human, not automated'],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-[1.4rem] border border-slate-200/80 bg-[#faf7f0] px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Processing order...' : 'Send order via WhatsApp'}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-slate-500">
              Your order is saved first, then WhatsApp opens so the store can confirm availability
              and complete the order with you directly.
            </p>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
