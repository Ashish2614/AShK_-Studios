import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Leaf, ChevronDown, Check } from 'lucide-react';
import { PRODUCTS } from '../lib/pricing/catalog';
import { ProductCard } from '../components/ProductCard';
import { VideoWalkthrough } from '../components/VideoWalkthrough';

export const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const featuredProducts = PRODUCTS.slice(0, 4);

  const categories = [
    {
      id: 'bedding',
      name: 'Organic Bedding & Linens',
      desc: '500 TC certified long-staple Indian organic cotton for effortless elegance.',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      count: '2 Products'
    },
    {
      id: 'furniture',
      name: 'Plantation Teak Furniture',
      desc: 'Seasoned Nilambur teak and hand-stitched saddle leather luggage fixtures.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      count: '1 Product'
    },
    {
      id: 'brass-decor',
      name: 'Heritage Brass & Pottery',
      desc: 'Moradabad cast brass room keys and hand-thrown Khurja stoneware sets.',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
      count: '2 Products'
    },
    {
      id: 'gourmet-hampers',
      name: 'Estate Hampers & Mists',
      desc: 'Single-estate Darjeeling teas, raw Coorg honey, and Himalayan ambient scents.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      count: '2 Products'
    }
  ];

  const faqs = [
    {
      q: 'Are your products suitable for commercial homestays and heavy laundering?',
      a: 'Yes. All AShK Stays bedding, waffle towels, and furnishings are explicitly engineered to endure commercial hospitality laundering cycles while retaining their organic softness and structural luster.'
    },
    {
      q: 'Can room fobs and keys be custom-engraved with our estate or cottage names?',
      a: 'Absolutely. Complimentary laser engraving of your property name, cottage numbering, or insignia is included with every Heritage Brass Room Key set.'
    },
    {
      q: 'Do you deliver across all regions in India?',
      a: 'Yes, we provide tracked express courier shipping across every pin code in India. Shipping is complimentary on all orders over ₹2,500.'
    },
    {
      q: 'Can international hosts or diaspora travelers order with overseas credit cards?',
      a: 'Yes, international payments are seamlessly processed through Stripe Checkout, supporting all major international Visa, Mastercard, and American Express cards with clear pricing transparency.'
    },
    {
      q: 'What is included in the Homestay Host Advisory & Setup Audit?',
      a: 'Our advisory service pairs you with an experienced hospitality architect for a comprehensive 90-minute virtual audit covering room layout, guest amenity checklists, pricing strategy, and direct artisan procurement pricing.'
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSuccess(true);
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#F3EFE6] border-b border-[#E8E3D9] overflow-hidden">
        {/* Background Image with Optical Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Indian Homestay Estate"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12281D]/90 via-[#1B3B2B]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl text-[#FBF9F5]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8E3D9] font-semibold mb-4">
              <Sparkles className="w-4 h-4 text-[#C87A55]" />
              <span>Premium Indian Hospitality & Homestay Craft</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FBF9F5] leading-tight text-balance">
              Feel at Home, Wherever You Stay.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#E2E8F0] leading-relaxed">
              We design and craft bespoke homestay linens, hand-carved teak furnishings, heirloom brass accents, and sensory morning hampers for India’s finest retreats.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="px-6 py-3.5 rounded-md bg-[#FBF9F5] text-[#1B3B2B] text-sm font-semibold hover:bg-[#E8E3D9] transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Explore Our Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-md border border-[#FBF9F5]/40 text-[#FBF9F5] text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Host Advisory & Contact
              </Link>
            </div>

            {/* Quick Trust Attributes */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-6 text-xs text-[#E2E8F0]">
              <div>
                <strong className="block font-serif text-base sm:text-lg text-white">100% Organic</strong>
                <span>Certified Indian Cottons</span>
              </div>
              <div>
                <strong className="block font-serif text-base sm:text-lg text-white">Solid Teak</strong>
                <span>Sustainable Reclaimed Wood</span>
              </div>
              <div>
                <strong className="block font-serif text-base sm:text-lg text-white">UPI & Stripe</strong>
                <span>Encrypted Pan-India Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-20 bg-[#FBF9F5] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
                Curated Essentials
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
                Signature Homestay Products
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-[#1B3B2B] hover:text-[#C87A55] inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Suite Tour Section (User uploaded video context!) */}
      <VideoWalkthrough />

      {/* Categories Grid */}
      <section className="py-20 bg-[#F8F6F0] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
              Collections
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
              Crafted for Every Guest Touchpoint
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group relative rounded-xl overflow-hidden bg-white border border-[#E8E3D9] flex flex-col hover:shadow-md transition-all"
              >
                <div className="aspect-4/3 overflow-hidden bg-[#F3EFE6]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#C87A55] uppercase tracking-wider">
                      {cat.count}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1F2421] group-hover:text-[#1B3B2B] transition-colors mt-1">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#6B7280] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F3EFE6] text-xs font-semibold text-[#1B3B2B] flex items-center justify-between">
                    <span>Browse Collection</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose AShK Stays */}
      <section className="py-20 bg-[#FBF9F5] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
              The AShK Standard
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
              Why Leading Indian Homestays Partner with Us
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#6B7280]">
              Every piece in our catalog is engineered to bridge traditional Indian artisan heritage with the rigorous durability required by commercial boutique hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-white border border-[#E8E3D9] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#1B3B2B]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B3B2B]">
                Conscious & Sustainable
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                We prioritize GOTS-certified organic cottons, reclaimed plantation teak wood, and plastic-free packaging to uphold environmental stewardship.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[#E8E3D9] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-[#C87A55]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B3B2B]">
                Direct Artisan Guilds
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                By commissioning directly from Moradabad brass masters, Khurja potters, and Coimbatore weavers, we preserve legacy techniques while guaranteeing fair compensation.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[#E8E3D9] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#1B3B2B]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B3B2B]">
                Commercial Durability
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Tested against frequent industrial laundering and guest turnover, our products maintain their handfeel, seams, and appearance season after season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Rest Section */}
      <section className="py-24 bg-[#1B3B2B] text-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold">
                Our Heritage & Origins
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FBF9F5] leading-tight">
                Born in the Coffee Hills of Coorg, Crafted for Sanctuaries Across India.
              </h2>
              <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
                AShK Stays began when our founding hosts experienced the frustration of generic, plasticky hotel amenities that felt out of place in intimate heritage homestays.
              </p>
              <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
                We set out to create an honest collection: crisp unbleached cottons that breathe in the monsoon mist, solid wood luggage fixtures that never wobble, and breakfast hampers that celebrate India’s rich estates.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#FBF9F5] hover:text-[#C87A55] transition-colors border-b border-[#C87A55] pb-1"
                >
                  <span>Read the Full AShK Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#2A563F] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Heritage Indian Courtyard Homestay"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-xs text-[#E2E8F0]">
                  Restored 19th-Century Estate Suite featuring AShK bespoke linens and teak accents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest & Host Experiences */}
      <section className="py-20 bg-[#FBF9F5] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
              Guest & Host Impressions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
              Reflections from Verified Retreats
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E8E3D9] flex flex-col justify-between">
              <p className="text-sm text-[#4A5568] leading-relaxed italic mb-6">
                "Our guests constantly ask where we source our bedding and waffle robes. The organic cotton maintains its crispness even after twenty washings in humid coastal Goa."
              </p>
              <div className="pt-4 border-t border-[#F3EFE6] text-xs">
                <strong className="block font-serif text-sm font-bold text-[#1F2421]">Aarav & Priya Deshmukh</strong>
                <span className="text-[#6B7280]">Hosts, Casa Mandovi Boutique Villa, Goa</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E3D9] flex flex-col justify-between">
              <p className="text-sm text-[#4A5568] leading-relaxed italic mb-6">
                "The cast brass room keys with custom engraved cottage names added an instant heirloom feel to our coffee estate cottages. It sets the tone the second a guest arrives."
              </p>
              <div className="pt-4 border-t border-[#F3EFE6] text-xs">
                <strong className="block font-serif text-sm font-bold text-[#1F2421]">Rohan Muthappa</strong>
                <span className="text-[#6B7280]">Managing Partner, Silvermist Plantations, Coorg</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E3D9] flex flex-col justify-between">
              <p className="text-sm text-[#4A5568] leading-relaxed italic mb-6">
                "The Homestay Host Advisory gave us the exact roadmap to overhaul our guest amenity procurement. We reduced operational re-ordering friction while elevating guest reviews."
              </p>
              <div className="pt-4 border-t border-[#F3EFE6] text-xs">
                <strong className="block font-serif text-sm font-bold text-[#1F2421]">Sunita Mehta</strong>
                <span className="text-[#6B7280]">Founder, Deodar Mountain Sanctuary, Himachal Pradesh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-[#F8F6F0] border-b border-[#E8E3D9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
              Common Questions
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1B3B2B]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-[#E8E3D9] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-serif text-base font-semibold text-[#1F2421]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C87A55] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#4A5568] leading-relaxed border-t border-[#F3EFE6]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Concierge / Newsletter CTA */}
      <section className="py-20 bg-[#12281D] text-[#FBF9F5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
            Stay Connected
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FBF9F5] mb-4">
            Receive Hospitality Notes & Seasonal Releases
          </h2>
          <p className="text-sm text-[#D1D5DB] mb-8 max-w-lg mx-auto">
            Periodic dispatches on Indian homestay design, artisan collaborations, and seasonal breakfast hamper harvests.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 rounded-lg bg-[#1B3B2B] border border-[#2A563F] max-w-md mx-auto flex items-center justify-center gap-2 text-sm text-[#FBF9F5]">
              <Check className="w-5 h-5 text-[#C87A55]" />
              <span>Thank you. We have saved your email for upcoming notes.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-md bg-white/10 border border-white/20 text-[#FBF9F5] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#C87A55]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-[#C87A55] hover:bg-[#B3643D] text-[#FBF9F5] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
