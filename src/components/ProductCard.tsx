import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../lib/pricing/catalog';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white rounded-lg border border-[#E8E3D9] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Product Image Slot */}
      <Link 
        to={`/products/${product.slug}`} 
        className="relative aspect-4/3 overflow-hidden bg-[#F3EFE6] block"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer ${
              added 
                ? 'bg-[#2A563F] text-white' 
                : 'bg-[#1B3B2B] hover:bg-[#2A563F] text-[#FBF9F5]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#C87A55] mb-1.5">
            <span>{product.category.replace('-', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{product.inStock ? 'In Stock' : 'Pre-order'}</span>
          </div>

          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-base font-bold text-[#1F2421] group-hover:text-[#1B3B2B] transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F3EFE6] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9CA3AF] block leading-none">Price</span>
            <span className="font-serif text-base font-bold text-[#1B3B2B] tabular-nums">
              {formatINR(product.pricePaise)}
            </span>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-xs font-semibold text-[#1B3B2B] hover:text-[#C87A55] transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
