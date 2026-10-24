import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../lib/pricing/catalog';
import { ProductCard } from '../components/ProductCard';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'bedding', label: 'Linen & Bedding' },
    { id: 'furniture', label: 'Teak Furniture' },
    { id: 'brass-decor', label: 'Brass & Decor' },
    { id: 'gourmet-hampers', label: 'Estate Hampers' },
    { id: 'host-services', label: 'Host Advisory' }
  ];

  const handleCategorySelect = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePaise - b.pricePaise;
      if (sortBy === 'price-desc') return b.pricePaise - a.pricePaise;
      return 0; // relevance / default
    });
  }, [currentCategory, searchQuery, sortBy]);

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
            The Homestay Collection
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
            Crafted for Comfort & Hospitality
          </h1>
          <p className="mt-2 text-sm text-[#6B7280] max-w-2xl">
            All prices listed in Indian Rupees (₹) inclusive of canonical server pricing. Direct checkout available via Razorpay (UPI, cards, netbanking) and Stripe International.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E3D9] shadow-2xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Buttons (Segmented Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  currentCategory === cat.id
                    ? 'bg-[#1B3B2B] text-[#FBF9F5] shadow-xs'
                    : 'text-[#4A5568] hover:bg-[#F3EFE6] hover:text-[#1B3B2B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-[#E8E3D9] bg-[#FBF9F5] text-[#1F2421] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="text-xs bg-transparent border border-[#E8E3D9] rounded-md px-2.5 py-1.5 text-[#1F2421] focus:outline-none cursor-pointer"
              >
                <option value="relevance">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#6B7280]">
          <span>
            Showing <strong className="text-[#1F2421] tabular-nums">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#C87A55] hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-[#E8E3D9] p-8">
            <h3 className="font-serif text-lg font-semibold text-[#1F2421] mb-2">
              No products found
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-6">
              We couldn't find any products matching your search term "{searchQuery}". Try selecting a different category or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategorySelect('all');
              }}
              className="px-4 py-2 bg-[#1B3B2B] text-[#FBF9F5] text-xs font-medium rounded-md hover:bg-[#2A563F] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
