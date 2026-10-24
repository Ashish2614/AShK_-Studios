import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, FREE_SHIPPING_THRESHOLD_PAISE } from '../lib/pricing/catalog';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotalPaise, totalItems } = useCart();

  if (!isOpen) return null;

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);
  const freeShippingProgress = Math.min(100, Math.round((subtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="cart-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#12281D]/40 backdrop-blur-xs transition-opacity" 
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] border-l border-[#E8E3D9] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E3D9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h2 id="cart-drawer-title" className="font-serif text-xl font-bold text-[#1B3B2B]">
                Your Shopping Bag
              </h2>
              <span className="text-xs text-[#6B7280] font-medium tabular-nums">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-md text-[#6B7280] hover:text-[#1B3B2B] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
              aria-label="Close shopping bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#F3EFE6] px-5 py-3 border-b border-[#E8E3D9]">
            <div className="flex items-center gap-2 text-xs text-[#1B3B2B] font-medium mb-1.5">
              <Truck className="w-4 h-4 text-[#C87A55]" />
              {freeShippingRemaining === 0 ? (
                <span className="font-semibold text-[#1B3B2B]">You have unlocked FREE pan-India delivery!</span>
              ) : (
                <span>Add <strong className="tabular-nums">{formatINR(freeShippingRemaining)}</strong> more for complimentary delivery</span>
              )}
            </div>
            <div className="w-full bg-[#E8E3D9] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#1B3B2B] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1F2421] mb-2">
                  Your bag is currently empty
                </h3>
                <p className="text-sm text-[#6B7280] max-w-xs mb-6">
                  Explore our collection of bespoke organic cotton linens, solid teak racks, and artisanal hampers.
                </p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-medium hover:bg-[#2A563F] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map(item => (
                <div 
                  key={item.product.id} 
                  className="flex gap-4 p-3 bg-white rounded-lg border border-[#E8E3D9] relative"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-md bg-[#F3EFE6] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-serif text-sm font-semibold text-[#1F2421] hover:text-[#1B3B2B] transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                      {item.product.subtitle}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8E3D9] rounded-md bg-[#FBF9F5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#E8E3D9]/60 text-[#1F2421] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#1F2421] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#E8E3D9]/60 text-[#1F2421] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="text-sm font-semibold text-[#1B3B2B] tabular-nums">
                        {formatINR(item.product.pricePaise * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-[#9CA3AF] hover:text-[#DC2626] transition-colors p-1 cursor-pointer"
                    aria-label={`Remove ${item.product.title} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8E3D9] bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F2421] tabular-nums">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-[#6B7280] text-xs">
                  <span>Shipping & Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E3D9] flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-[#1B3B2B]">Estimated Total</span>
                <span className="font-serif font-bold text-xl text-[#1B3B2B] tabular-nums">
                  {formatINR(subtotalPaise)}
                </span>
              </div>

              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full py-3 px-4 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-sm font-medium hover:bg-[#2A563F] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B7280]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B3B2B]" />
                <span>Encrypted 256-bit checkout via Razorpay & Stripe</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
