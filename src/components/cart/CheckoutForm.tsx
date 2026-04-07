'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/uitoolkit/Input';
import { validateCoupon } from '@/app/actions/coupon';
import { createOrder } from '@/app/actions/order';
import { Button } from '@/components/uitoolkit/Button';

interface CheckoutFormProps {
  whatsappNumber: string;
}

export const CheckoutForm = ({ whatsappNumber }: CheckoutFormProps) => {
  const { items, subtotal, totalSavings, clearCart } = useCart();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: number;
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponError('');
    try {
      const result = await validateCoupon(couponCode, subtotal);
      if (result.success && result.coupon) {
        setAppliedCoupon(result.coupon);
        showToast(`Coupon "${result.coupon.code}" applied!`, 'success');
      } else {
        setCouponError(result.message || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('Error validating coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const finalTotal = subtotal - (appliedCoupon?.discountAmount || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order in DB (Save point)
      await createOrder({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        totalAmount: finalTotal,
        discountAmount: appliedCoupon?.discountAmount || 0,
        couponId: appliedCoupon?.id,
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          priceAtTime: i.sellingPrice,
        })),
      });

      // 2. Build WhatsApp message
      const itemLines = items.map(
        (item) => `▪ ${item.name} × ${item.quantity} = ₹${item.sellingPrice * item.quantity}`
      ).join('\n');

      const message = encodeURIComponent(
        `🛒 *New Order from PrimeLooks*\n\n` +
        `👤 *Customer:* ${name}\n` +
        `📱 *Phone:* ${phone}\n` +
        `📍 *Address:* ${address}\n\n` +
        `📦 *Order Details:*\n${itemLines}\n\n` +
        (totalSavings > 0 ? `🎉 *Original Savings:* ₹${totalSavings}\n` : '') +
        (appliedCoupon ? `🎟️ *Coupon Applied:* ${appliedCoupon.code}\n` : '') +
        (appliedCoupon ? `📉 *Coupon Discount:* -₹${appliedCoupon.discountAmount}\n` : '') +
        `💰 *Final Total:* ₹${finalTotal}\n\n` +
        `Please confirm my order. Thank you!`
      );

      // 3. Open WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      
      showToast('Order saved and WhatsApp opened!', 'success');
      
      // 4. Reset & Clear
      setTimeout(() => {
        clearCart();
        setName('');
        setPhone('');
        setAddress('');
        handleRemoveCoupon();
        setIsSubmitting(false);
      }, 1500);

    } catch (err: any) {
      console.error('Order Error:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
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
        <a href="/" className="text-brand-600 hover:text-brand-700 font-semibold">← Back to Shopping</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout via WhatsApp</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Order Summary */}
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
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.sellingPrice}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">₹{item.sellingPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Product Savings</span>
                  <span>−₹{totalSavings}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-brand-600 font-medium">
                  <div className="flex flex-col">
                    <span>Coupon Discount</span>
                    <span className="text-[10px] text-brand-400">({appliedCoupon.code})</span>
                  </div>
                  <span>−₹{appliedCoupon.discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span className="text-brand-600">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-brand-50/50 border border-brand-100/50 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-brand-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Apply Coupon
            </h4>
            
            {!appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <Button 
                    variant="brand" 
                    size="sm" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || isValidating}
                    className="h-[38px]"
                  >
                    {isValidating ? '...' : 'Apply'}
                  </Button>
                </div>
                {couponError && <p className="text-xs text-red-500 ml-1">{couponError}</p>}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-800">{appliedCoupon.code}</p>
                    <p className="text-[10px] text-green-600">Coupon applied successfully!</p>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveCoupon}
                  className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Form */}
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
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="10 digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-gray-700">Detailed Address</label>
              <textarea
                name="address"
                placeholder="Street name, House No, Landmark, City, State, Pincode"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white min-h-[120px] text-sm transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
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
