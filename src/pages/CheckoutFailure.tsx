import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';

export const CheckoutFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('ref');
  const reason = searchParams.get('reason') || 'Transaction could not be completed by payment gateway.';

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Payment Incomplete
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1B3B2B] mt-1">
              Payment Authorization Failed
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Your bank or card issuer was unable to authorize the charge. No funds have been deducted from your account.
            </p>
          </div>

          {orderRef && (
            <div className="p-3 bg-[#F8F6F0] rounded-md border border-[#E8E3D9] text-xs text-[#6B7280]">
              <span>Pending Order Reference: </span>
              <strong className="text-[#1F2421] font-serif">{orderRef}</strong>
            </div>
          )}

          <div className="p-4 bg-red-50/50 rounded-lg border border-red-100 text-xs text-red-800 text-left">
            <strong className="block font-semibold mb-0.5">Gateway Notice:</strong>
            <p className="break-words">{reason}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/checkout"
              className="px-5 py-3 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-semibold hover:bg-[#2A563F] transition-colors inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Payment</span>
            </Link>

            <Link
              to="/contact"
              className="px-5 py-3 rounded-md border border-[#E8E3D9] text-[#1F2421] text-xs font-semibold hover:bg-[#F3EFE6] transition-colors inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#C87A55]" />
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
