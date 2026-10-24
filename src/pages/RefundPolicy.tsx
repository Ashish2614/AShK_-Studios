import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="bg-[#FBF9F5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1B3B2B] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E8E3D9] shadow-xs space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
              <RefreshCw className="w-4 h-4" />
              <span>Customer Satisfaction Guarantee</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
              Refund & Cancellation Policy
            </h1>
            <p className="mt-2 text-xs text-[#6B7280]">
              Last updated: October 2026 · AShK Stays
            </p>
          </div>

          <div className="prose prose-slate text-sm text-[#4A5568] leading-relaxed space-y-6">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">1. Physical Goods — 14-Day Replacement Policy</h2>
              <p>
                We stand behind the craft and endurance of all AShK Stays products. If an item arrives damaged, defective, or incorrect, you are eligible for an immediate replacement or full refund within <strong>14 days of delivery</strong>.
              </p>
              <p>
                To initiate a return or replacement, email <a href="mailto:concierge@ashkstays.com" className="text-[#C87A55] underline">concierge@ashkstays.com</a> with your Order Reference (e.g., <code>ASHK-2610-XXXX</code>) and clear photographs of the defect.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">2. Custom Engraved & Bespoke Items</h2>
              <p>
                Heritage Brass Room Keys engraved with your property or cottage names are customized to your specifications. Unless there is a typographical error made by our artisans or a structural manufacturing flaw, customized pieces are non-refundable once engraved.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">3. Host Advisory & Consulting Cancellations</h2>
              <p>
                Consulting appointments may be rescheduled at no additional fee up to 24 hours prior to the scheduled session. If cancelled more than 48 hours prior to the video session, a 100% refund is issued. Within 48 hours, a 50% cancellation fee applies to offset reserved specialist time.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">4. Failed & Duplicate Transactions</h2>
              <p>
                If your card or UPI account was debited for a transaction that failed or was cancelled at checkout, the funds are automatically reversed by your issuing bank and Razorpay/Stripe within 3 to 5 business days. If duplicate charges ever occur, our team will proactively reconcile and refund the secondary charge immediately upon detection.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">5. Processing Timelines</h2>
              <p>
                Approved refunds are returned strictly to the original payment source (UPI ID, card, or bank account). Domestic refunds typically reflect in 5-7 business days, while international Stripe refunds may take 5-10 business days depending on your overseas bank.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
