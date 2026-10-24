import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight, Mail, Home, Package, ShieldCheck } from 'lucide-react';
import { formatINR } from '../lib/pricing/catalog';

interface OrderDetails {
  orderReference: string;
  customerName: string;
  customerEmail: string;
  status: string;
  amountPaise: number;
  currency: string;
  subtotalPaise: number;
  shippingPaise: number;
  taxPaise: number;
  provider: string;
  items: Array<{
    productId: string;
    productTitle: string;
    unitPricePaise: number;
    quantity: number;
    lineTotalPaise: number;
  }>;
  shippingAddress?: any;
}

export const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('ref');

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authoritatively fetch order state from server (Never trust query params alone!)
  useEffect(() => {
    if (!orderRef) {
      setLoading(false);
      return;
    }

    const checkOrderStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderRef}`);
        if (!res.ok) {
          throw new Error('Order not found or database unavailable');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Unable to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [orderRef]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FBF9F5] px-4">
        <Clock className="w-8 h-8 text-[#1B3B2B] animate-spin mb-4" />
        <h2 className="font-serif text-xl font-bold text-[#1B3B2B]">
          Verifying Payment with Server...
        </h2>
        <p className="text-xs text-[#6B7280] mt-1">
          Cryptographically confirming transaction with payment gateway.
        </p>
      </div>
    );
  }

  const isVerifiedPaid = order?.status === 'paid';

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-sm overflow-hidden p-8 sm:p-10">
          {/* Header Status */}
          <div className="text-center pb-8 border-b border-[#E8E3D9]">
            {isVerifiedPaid ? (
              <div className="w-16 h-16 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-[#1B3B2B]" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
            )}

            <span className="text-xs font-semibold uppercase tracking-wider text-[#C87A55]">
              {isVerifiedPaid ? 'Payment Verified & Confirmed' : 'Payment Awaiting Settlement'}
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B3B2B] mt-1">
              {isVerifiedPaid ? 'Thank You for Your Order' : 'Order Received — Verifying'}
            </h1>

            <p className="mt-2 text-sm text-[#6B7280] max-w-md mx-auto">
              {isVerifiedPaid
                ? 'Your order has been authorized and recorded in our systems. A confirmation receipt has been dispatched to your email.'
                : 'Your order reference has been reserved. Our webhook gateway is completing final bank confirmation.'}
            </p>

            {orderRef && (
              <div className="mt-6 inline-block bg-[#F8F6F0] px-4 py-2 rounded-md border border-[#E8E3D9]">
                <span className="text-xs text-[#6B7280]">Order Reference: </span>
                <strong className="text-sm font-serif font-bold text-[#1B3B2B] tracking-wide ml-1">
                  {orderRef}
                </strong>
              </div>
            )}
          </div>

          {/* Itemized Order Breakdown */}
          {order && (
            <div className="py-6 border-b border-[#E8E3D9] space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#1B3B2B] uppercase tracking-wider">
                Purchased Pieces
              </h3>

              <div className="divide-y divide-[#F3EFE6]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="font-semibold text-[#1F2421] block">
                        {item.productTitle}
                      </strong>
                      <span className="text-[#6B7280]">
                        Qty: {item.quantity} × {formatINR(item.unitPricePaise)}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-[#1F2421] tabular-nums">
                      {formatINR(item.lineTotalPaise)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#F3EFE6] space-y-1.5 text-xs text-[#6B7280]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#1F2421]">{formatINR(order.subtotalPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums font-medium text-[#1F2421]">
                    {order.shippingPaise === 0 ? 'FREE' : formatINR(order.shippingPaise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="tabular-nums font-medium text-[#1F2421]">{formatINR(order.taxPaise)}</span>
                </div>
                <div className="pt-2 border-t border-[#1B3B2B] flex justify-between text-sm font-bold text-[#1B3B2B]">
                  <span>Total Paid</span>
                  <span className="font-serif text-base tabular-nums">{formatINR(order.amountPaise)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Next Steps */}
          <div className="py-6 border-b border-[#E8E3D9] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#4A5568]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#1B3B2B]">
                <Package className="w-4 h-4 text-[#C87A55]" />
                <span>Next Steps & Dispatch</span>
              </div>
              <p className="leading-relaxed">
                Handcrafted pieces are inspected, boxed in plastic-free packaging, and dispatched within 2-4 business days. Tracked shipping details will follow via email.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#1B3B2B]">
                <Mail className="w-4 h-4 text-[#1B3B2B]" />
                <span>Concierge Support</span>
              </div>
              <p className="leading-relaxed">
                Need to add special estate instructions or adjust cottage engraving? Contact concierge@ashkstays.com with your reference number.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-md border border-[#E8E3D9] text-[#1F2421] text-xs font-semibold hover:bg-[#F3EFE6] transition-colors inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <Link
              to="/products"
              className="px-5 py-2.5 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-semibold hover:bg-[#2A563F] transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <span>Explore More Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
