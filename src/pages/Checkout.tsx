import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/pricing/catalog';
import { PricingCalculationResult } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [provider, setProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pricing, setPricing] = useState<PricingCalculationResult | null>(null);
  const [calculatingPricing, setCalculatingPricing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch authoritative server pricing when items change
  useEffect(() => {
    if (items.length === 0) {
      setPricing(null);
      return;
    }

    const fetchServerPricing = async () => {
      setCalculatingPricing(true);
      try {
        const res = await fetch('/api/pricing/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
            currency: 'INR'
          })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to calculate server pricing');
        }

        const data: PricingCalculationResult = await res.json();
        setPricing(data);
        setServerError(null);
      } catch (err: any) {
        setServerError(err.message || 'Error communicating with pricing engine');
      } finally {
        setCalculatingPricing(false);
      }
    };

    fetchServerPricing();
  }, [items]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (min 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number with at least 10 digits';
    }

    if (pricing?.requiresShipping) {
      if (!addressLine1.trim() || addressLine1.trim().length < 5) {
        newErrors.addressLine1 = 'Street address is required for product delivery';
      }
      if (!city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!state.trim()) {
        newErrors.state = 'State is required';
      }
      if (!postalCode.trim() || postalCode.trim().length < 4) {
        newErrors.postalCode = 'Valid postal / PIN code is required';
      }
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    if (!items || items.length === 0) {
      setServerError('Your shopping bag is empty.');
      return;
    }

    setSubmitting(true);

    const payload = {
      customerName: fullName.trim(),
      customerEmail: email.trim().toLowerCase(),
      customerPhone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      provider,
      items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      termsAccepted: true
    };

    try {
      if (provider === 'razorpay') {
        // Step 1: Create server order and Razorpay order
        const res = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to initiate Razorpay checkout');
        }

        const data = await res.json();

        // Step 2: Open Razorpay checkout interface
        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay({
            key: data.keyId,
            amount: data.amountPaise,
            currency: data.currency,
            name: 'AShK Stays',
            description: `Order ${data.orderReference}`,
            order_id: data.razorpayOrderId,
            prefill: {
              name: data.customer.name,
              email: data.customer.email,
              contact: data.customer.phone
            },
            theme: {
              color: '#1B3B2B'
            },
            handler: async (response: any) => {
              // Step 3: Verify cryptographic signature server-side
              try {
                const verifyRes = await fetch('/api/checkout/razorpay/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderReference: data.orderReference,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });

                if (verifyRes.ok) {
                  clearCart();
                  navigate(`/checkout/success?ref=${data.orderReference}`);
                } else {
                  const verifyErr = await verifyRes.json();
                  navigate(`/checkout/failure?ref=${data.orderReference}&reason=${encodeURIComponent(verifyErr.error || 'Signature verification failed')}`);
                }
              } catch (err: any) {
                navigate(`/checkout/failure?ref=${data.orderReference}&reason=verification_network_error`);
              }
            },
            modal: {
              ondismiss: () => {
                setSubmitting(false);
              }
            }
          });

          rzp.open();
        } else {
          // If Razorpay script wasn't loaded or in mock mode, simulate verification for test mode
          if (data.isTestMode) {
            // Test mode simulation verification
            const verifyRes = await fetch('/api/checkout/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderReference: data.orderReference,
                razorpay_order_id: data.razorpayOrderId,
                razorpay_payment_id: `pay_test_${Date.now()}`,
                razorpay_signature: 'test_valid_signature'
              })
            });

            if (verifyRes.ok) {
              clearCart();
              navigate(`/checkout/success?ref=${data.orderReference}`);
            }
          } else {
            throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
          }
        }
      } else {
        // Stripe International Card Checkout
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to initiate Stripe Checkout session');
        }

        const data = await res.json();
        clearCart();
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setServerError(err.message || 'An unexpected error occurred during checkout.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FBF9F5] px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#1B3B2B] mb-2">
          Your Bag is Empty
        </h2>
        <p className="text-sm text-[#6B7280] mb-6">
          Add items to your bag before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="px-5 py-2.5 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-semibold hover:bg-[#2A563F] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1B3B2B]">
            Checkout & Order Confirmation
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Authoritative server-side pricing · 256-bit SSL encrypted transaction
          </p>
        </div>

        {serverError && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Payment Initialization Notice</strong>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Customer Contact */}
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E8E3D9] shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#1B3B2B]">
                  1. Contact Information
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Vikramaditya Rao"
                      className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                        errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                          errors.email ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                          errors.phone ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address (Only if items require physical shipping) */}
              {pricing?.requiresShipping && (
                <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E8E3D9] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-[#1B3B2B]">
                      2. Delivery Address
                    </h2>
                    <span className="text-xs text-[#6B7280]">Tracked Express Courier</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Street Address / Estate / Cottage *
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={e => setAddressLine1(e.target.value)}
                        placeholder="House / Villa No., Estate Road"
                        className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                          errors.addressLine1 ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                        }`}
                      />
                      {errors.addressLine1 && <p className="text-xs text-red-600 mt-1">{errors.addressLine1}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                        Apartment, Suite, Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={e => setAddressLine2(e.target.value)}
                        placeholder="Near Coffee Plantation Gate"
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F5] text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="e.g. Madikeri"
                          className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                            errors.city ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                          }`}
                        />
                        {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={e => setState(e.target.value)}
                          placeholder="e.g. Karnataka"
                          className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                            errors.state ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                          }`}
                        />
                        {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                          PIN / Postal Code *
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={e => setPostalCode(e.target.value)}
                          placeholder="571201"
                          className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                            errors.postalCode ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                          }`}
                        />
                        {errors.postalCode && <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E8E3D9] shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#1B3B2B]">
                  3. Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                    provider === 'razorpay' ? 'border-[#1B3B2B] bg-[#FBF9F5] shadow-xs' : 'border-[#E8E3D9] hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentProvider"
                        value="razorpay"
                        checked={provider === 'razorpay'}
                        onChange={() => setProvider('razorpay')}
                        className="mt-1 text-[#1B3B2B] focus:ring-[#1B3B2B]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-semibold text-[#1F2421]">
                            India — Razorpay (UPI, Cards & Netbanking)
                          </strong>
                          <span className="text-[11px] font-semibold text-[#1B3B2B] bg-[#E8E3D9]/60 px-2 py-0.5 rounded">
                            Recommended for India
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Google Pay, PhonePe, Paytm, all Indian debit/credit cards, and netbanking across 50+ banks.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Stripe Option */}
                  <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                    provider === 'stripe' ? 'border-[#1B3B2B] bg-[#FBF9F5] shadow-xs' : 'border-[#E8E3D9] hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentProvider"
                        value="stripe"
                        checked={provider === 'stripe'}
                        onChange={() => setProvider('stripe')}
                        className="mt-1 text-[#1B3B2B] focus:ring-[#1B3B2B]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-semibold text-[#1F2421]">
                            International — Stripe Checkout
                          </strong>
                          <CreditCard className="w-4 h-4 text-[#6B7280]" />
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">
                          International Visa, Mastercard, American Express with secure 3D-Secure hosted checkout.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Terms acknowledgement */}
                <div className="pt-3 border-t border-[#F3EFE6]">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 text-[#1B3B2B] rounded focus:ring-[#1B3B2B]"
                    />
                    <span className="text-xs text-[#6B7280] leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" target="_blank" className="text-[#1B3B2B] underline">
                        Terms of Service
                      </Link>
                      ,{' '}
                      <Link to="/privacy" target="_blank" className="text-[#1B3B2B] underline">
                        Privacy Policy
                      </Link>
                      , and{' '}
                      <Link to="/refund-policy" target="_blank" className="text-[#1B3B2B] underline">
                        Refund Policy
                      </Link>
                      . I understand prices are verified and calculated authoritatively by AShK Stays.
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-600 mt-1">{errors.terms}</p>}
                </div>
              </div>
            </div>

            {/* Right Column: Authoritative Server Order Summary */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-xl border border-[#E8E3D9] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E3D9] pb-4">
                <h2 className="font-serif text-lg font-bold text-[#1B3B2B]">
                  Order Summary
                </h2>
                {calculatingPricing && (
                  <span className="text-xs text-[#C87A55] flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying rates...</span>
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#F3EFE6] max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="py-3 flex justify-between gap-3 text-xs">
                    <div>
                      <strong className="font-medium text-[#1F2421] block">
                        {item.product.title}
                      </strong>
                      <span className="text-[#6B7280]">
                        Qty: {item.quantity} × {formatINR(item.product.pricePaise)}
                      </span>
                    </div>
                    <span className="font-semibold text-[#1F2421] tabular-nums shrink-0">
                      {formatINR(item.product.pricePaise * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Server Price Calculation Breakdown */}
              {pricing && (
                <div className="pt-4 border-t border-[#E8E3D9] space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1F2421] tabular-nums">
                      {pricing.formattedSubtotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#C87A55]" />
                      <span>Pan-India Shipping</span>
                    </span>
                    <span className="font-semibold text-[#1F2421] tabular-nums">
                      {pricing.formattedShipping}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6B7280]">
                    <span>GST (18% Goods & Services Tax)</span>
                    <span className="font-semibold text-[#1F2421] tabular-nums">
                      {pricing.formattedTax}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#1B3B2B] flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-[#1B3B2B]">
                      Total Payable
                    </span>
                    <div className="text-right">
                      <span className="font-serif text-2xl font-bold text-[#1B3B2B] tabular-nums block">
                        {pricing.formattedTotal}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Indian Rupees (INR)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || calculatingPricing}
                className="w-full py-4 px-6 rounded-md bg-[#1B3B2B] hover:bg-[#2A563F] text-[#FBF9F5] text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to {provider === 'razorpay' ? 'Razorpay' : 'Stripe'}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {pricing?.formattedTotal || ''}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-[#6B7280] space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1B3B2B]" />
                  <span>Card and payment details are never stored on our servers.</span>
                </div>
                <p>A confirmed order reference is created before payment processing.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
