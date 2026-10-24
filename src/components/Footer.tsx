import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#12281D] text-[#FBF9F5] border-t border-[#1B3B2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#2A563F]/50">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-[#FBF9F5]">
              <div className="w-8 h-8 rounded-sm bg-[#1B3B2B] text-[#FBF9F5] flex items-center justify-center border border-[#2A563F]">
                <Home className="w-4.5 h-4.5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">AShK Stays</span>
            </Link>
            <p className="text-sm text-[#A0AEC0] max-w-sm leading-relaxed">
              Curated homestay amenities, heirloom furnishings, and bespoke advisory for discerning property hosts and travelers across India.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#E2E8F0]">
              <ShieldCheck className="w-4 h-4 text-[#C87A55]" />
              <span>Direct Artisan Partnerships · Sustainable Materials</span>
            </div>
          </div>

          {/* Column 2: Collection */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FBF9F5]">
              The Collection
            </h4>
            <ul className="space-y-2 text-sm text-[#A0AEC0]">
              <li>
                <Link to="/products?category=bedding" className="hover:text-white transition-colors">
                  Organic Bedding & Linen
                </Link>
              </li>
              <li>
                <Link to="/products?category=furniture" className="hover:text-white transition-colors">
                  Plantation Teak Furniture
                </Link>
              </li>
              <li>
                <Link to="/products?category=brass-decor" className="hover:text-white transition-colors">
                  Heritage Brass & Pottery
                </Link>
              </li>
              <li>
                <Link to="/products?category=gourmet-hampers" className="hover:text-white transition-colors">
                  Estate Breakfast Hampers
                </Link>
              </li>
              <li>
                <Link to="/products?category=host-services" className="hover:text-white transition-colors">
                  Host Consulting & Audits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FBF9F5]">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[#A0AEC0]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/#experience" className="hover:text-white transition-colors">
                  Suite Walkthrough
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Host Concierge
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FBF9F5]">
              Concierge
            </h4>
            <div className="space-y-2.5 text-sm text-[#A0AEC0]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C87A55] shrink-0 mt-0.5" />
                <span>Indiranagar, Bangalore & Madikeri, Coorg, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C87A55] shrink-0" />
                <a href="mailto:concierge@ashkstays.com" className="hover:text-white transition-colors">
                  concierge@ashkstays.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C87A55] shrink-0" />
                <a href="tel:+918049102800" className="hover:text-white transition-colors">
                  +91 (80) 4910 2800
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718096]">
          <p>© {new Date().getFullYear()} AShK Stays Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Primary Market: India (INR ₹)</span>
            <span>·</span>
            <span>Domestic via Razorpay (UPI & Netbanking)</span>
            <span>·</span>
            <span>Global via Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
