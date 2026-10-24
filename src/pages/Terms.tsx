import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
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
              <ShieldCheck className="w-4 h-4" />
              <span>Legal & Operational Terms</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-[#6B7280]">
              Last updated: October 2026 · AShK Stays Private Limited
            </p>
          </div>

          <div className="prose prose-slate text-sm text-[#4A5568] leading-relaxed space-y-6">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">1. Introduction & Acceptance</h2>
              <p>
                These Terms of Service govern your use of the website operated by AShK Stays Private Limited ("AShK Stays", "we", "us", "our") and the purchase of any homestay products, furnishings, or advisory services. By browsing our website or placing an order, you agree to be bound by these Terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">2. Canonical Pricing & Server Authority</h2>
              <p>
                All product prices are quoted in Indian Rupees (₹) unless explicitly stated otherwise. All orders are processed with authoritative server-side pricing calculated in integer paise. Client-submitted prices, tampered payloads, or manipulated currency requests will be automatically rejected by our order validation engine.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">3. Payment Processing & Security</h2>
              <p>
                We do not collect, process, or store raw card numbers, CVVs, or bank login credentials on our servers. Domestic Indian transactions are processed via Razorpay (supporting UPI, RuPay, Visa, Mastercard, and Netbanking). International transactions are processed through Stripe-hosted Checkout. Orders are marked as paid solely after cryptographic signature verification.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">4. Shipping & Delivery</h2>
              <p>
                Physical goods are shipped via insured, tracked courier partners across India. Orders exceeding ₹2,500 qualify for complimentary pan-India shipping. Standard lead times range between 2 to 4 business days for standard dispatch, plus transit times depending on your postal pin code.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">5. Homestay Advisory & Consulting Services</h2>
              <p>
                Digital advisory services, including the Homestay Host Advisory & Setup Audit, are delivered virtually via scheduled video conferences. Scheduling links are provided within 2 business days of order confirmation. Sessions may be rescheduled with at least 24 hours prior written notice.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">6. Intellectual Property</h2>
              <p>
                All trademarks, wordmarks, product photographs, suite walkthrough videos, copy, and architectural manuals on this website are the proprietary property of AShK Stays Private Limited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">7. Governing Law & Jurisdiction</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction resting in the courts of Bangalore, Karnataka.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
