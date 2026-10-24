import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export const Privacy: React.FC = () => {
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
              <Lock className="w-4 h-4" />
              <span>Data Protection & Privacy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-[#6B7280]">
              Last updated: October 2026 · AShK Stays
            </p>
          </div>

          <div className="prose prose-slate text-sm text-[#4A5568] leading-relaxed space-y-6">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">1. Information We Collect</h2>
              <p>
                When you interact with AShK Stays, we collect information necessary to fulfill your orders and respond to your inquiries:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Contact details:</strong> Full name, email address, and phone number.</li>
                <li><strong>Shipping details:</strong> Street address, city, state, postal PIN code, and country.</li>
                <li><strong>Order metadata:</strong> Line items, quantities, transaction references, and delivery status.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">2. Payment Processing Integrity</h2>
              <p>
                We partner with PCI-DSS compliant payment gateways: <strong>Razorpay</strong> for domestic Indian transactions and <strong>Stripe</strong> for international card checkout. We never receive or store your credit/debit card numbers or bank credentials on our servers. All financial transactions are tokenized and processed through secure SSL/TLS channels.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">3. Transactional Emails</h2>
              <p>
                We use <strong>Resend</strong> to deliver transactional order confirmations, dispatch receipts, and customer service replies. We do not sell, rent, or trade your personal email address to third-party advertising networks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">4. Data Retention & Security Practices</h2>
              <p>
                Order records are securely stored within parameterized databases with strict Row-Level Security (RLS) enforcement. We implement rate-limiting, honeypot spam protection, and encrypted server storage.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-[#1F2421]">5. Customer Rights & Contact</h2>
              <p>
                You may request a copy of your personal data or request deletion of non-essential records by contacting our privacy officer at <a href="mailto:privacy@ashkstays.com" className="text-[#C87A55] underline">privacy@ashkstays.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
