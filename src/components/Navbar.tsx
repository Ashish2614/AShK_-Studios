import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Collection', path: '/products' },
    { label: 'Suite Tour', path: '/#experience' },
    { label: 'About Us', path: '/about' },
    { label: 'Host Advisory', path: '/products/homestay-setup-audit-consulting' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E3D9]">
      {/* Announcement Bar */}
      <div className="bg-[#1B3B2B] text-[#FBF9F5] text-[12px] py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span>Complimentary Pan-India Delivery on Orders Above ₹2,500</span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <span className="hidden sm:inline">Handcrafted by Master Artisans</span>
      </div>

      {/* Main Top Navigation conforming to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 text-[#1B3B2B] group whitespace-nowrap shrink-0"
          aria-label="AShK Stays Homepage"
        >
          <div className="w-8 h-8 rounded-sm bg-[#1B3B2B] text-[#FBF9F5] flex items-center justify-center shadow-xs">
            <Home className="w-4.5 h-4.5 text-[#FBF9F5]" strokeWidth={2} />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1B3B2B] group-hover:text-[#2A563F] transition-colors">
            AShK Stays
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Single-line, unboxed, hover underline) */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#4A5568]">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#1B3B2B] ${
                isActive(link.path)
                  ? 'text-[#1B3B2B] border-b-2 border-[#1B3B2B] font-semibold'
                  : 'text-[#4A5568]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Action Controls (Cart & Mobile Menu) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-medium hover:bg-[#2A563F] transition-colors whitespace-nowrap cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#1B3B2B] focus-visible:ring-offset-2"
            aria-label={`Open shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#FBF9F5]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums font-semibold bg-[#2A563F] px-1.5 py-0.5 rounded text-[11px]">
              {totalItems}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-md text-[#1B3B2B] hover:bg-[#E8E3D9]/50 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E3D9] bg-[#FBF9F5] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-[#1F2421] hover:bg-[#E8E3D9]/40 hover:text-[#1B3B2B] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E8E3D9] text-xs text-[#6B7280] px-3">
            <span>Primary Market: India (INR ₹)</span>
            <span className="mx-2">·</span>
            <span>Worldwide Cards Accepted</span>
          </div>
        </div>
      )}
    </header>
  );
};
