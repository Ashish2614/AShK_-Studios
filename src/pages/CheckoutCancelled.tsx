import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const CheckoutCancelled: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('ref');

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-[#C87A55]" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C87A55]">
              Session Cancelled
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1B3B2B] mt-1">
              Checkout Was Cancelled
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              You have not been charged. Your items remain in your bag whenever you are ready to complete your purchase.
            </p>
          </div>

          {orderRef && (
            <div className="p-3 bg-[#F8F6F0] rounded-md border border-[#E8E3D9] text-xs text-[#6B7280]">
              <span>Reserved Reference: </span>
              <strong className="text-[#1F2421] font-serif">{orderRef}</strong>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/checkout"
              className="px-5 py-3 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-semibold hover:bg-[#2A563F] transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Return to Checkout</span>
            </Link>

            <Link
              to="/products"
              className="px-5 py-3 rounded-md border border-[#E8E3D9] text-[#1F2421] text-xs font-semibold hover:bg-[#F3EFE6] transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Browsing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
