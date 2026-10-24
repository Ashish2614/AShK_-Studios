import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, ArrowLeft, Check, Sparkles, Plus, Minus } from 'lucide-react';
import { PRODUCTS } from '../lib/pricing/catalog';
import { formatINR } from '../lib/pricing/catalog';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = PRODUCTS.find(p => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FBF9F5] px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#1B3B2B] mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-[#6B7280] mb-6">
          The requested product does not exist in our current catalog.
        </p>
        <Link
          to="/products"
          className="px-5 py-2.5 rounded-md bg-[#1B3B2B] text-[#FBF9F5] text-xs font-semibold hover:bg-[#2A563F] transition-colors"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1B3B2B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#F3EFE6] border border-[#E8E3D9] shadow-xs">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx ? 'border-[#1B3B2B] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-[#E8E3D9] shadow-sm space-y-6">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C87A55] mb-2">
                <span>{product.category.replace('-', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span>{product.inStock ? 'In Stock' : 'Made to Order'}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B3B2B] leading-tight">
                {product.title}
              </h1>

              <p className="mt-1.5 text-sm text-[#6B7280]">
                {product.subtitle}
              </p>

              <div className="mt-4 pt-4 border-t border-[#F3EFE6] flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#1B3B2B] tabular-nums">
                  {formatINR(product.pricePaise)}
                </span>
                <span className="text-xs text-[#6B7280]">
                  (Inclusive of 18% GST)
                </span>
              </div>
            </div>

            <p className="text-sm text-[#4A5568] leading-relaxed">
              {product.description}
            </p>

            {/* Quantity and Add to Bag */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-[#1F2421]">Quantity:</span>
                <div className="flex items-center border border-[#E8E3D9] rounded-md bg-[#FBF9F5]">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:bg-[#E8E3D9]/60 text-[#1F2421] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-semibold text-[#1F2421] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(20, q + 1))}
                    className="p-2 hover:bg-[#E8E3D9]/60 text-[#1F2421] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-md text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
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
                    <span>Add to Bag — {formatINR(product.pricePaise * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Shipping & Trust badges */}
            <div className="pt-4 border-t border-[#F3EFE6] space-y-2.5 text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C87A55]" />
                <span>Complimentary tracked delivery on orders above ₹2,500</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1B3B2B]" />
                <span>14-Day replacement guarantee on physical homestay goods</span>
              </div>
            </div>

            {/* Key Features */}
            <div className="pt-4 border-t border-[#F3EFE6]">
              <h3 className="font-serif text-sm font-bold text-[#1F2421] mb-2.5">
                Highlights
              </h3>
              <ul className="space-y-1.5 text-xs text-[#4A5568]">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C87A55] font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div className="pt-4 border-t border-[#F3EFE6]">
              <h3 className="font-serif text-sm font-bold text-[#1F2421] mb-2.5">
                Craft Specifications
              </h3>
              <dl className="divide-y divide-[#F3EFE6] text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-2 flex justify-between">
                    <dt className="text-[#6B7280]">{key}</dt>
                    <dd className="font-medium text-[#1F2421] text-right">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8E3D9]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#1B3B2B]">
                Complementary Pieces
              </h2>
              <Link to="/products" className="text-xs font-semibold text-[#1B3B2B] hover:text-[#C87A55]">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
