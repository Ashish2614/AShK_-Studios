import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HeartHandshake, Leaf, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-[#FBF9F5] text-[#1F2421]">
      {/* Header Banner */}
      <section className="relative py-24 bg-[#1B3B2B] text-[#FBF9F5] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Courtyard Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C87A55] font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>The AShK Stays Philosophy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#FBF9F5]">
            Bridging Heritage Craft with Modern Hospitality
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#D1D5DB] max-w-2xl mx-auto leading-relaxed">
            Founded to celebrate the warmth, intimacy, and architectural character of independent Indian homestays.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 border-b border-[#E8E3D9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#1B3B2B] mb-6">
              Our Story
            </h2>
            <div className="prose prose-slate text-base sm:text-lg text-[#4A5568] leading-relaxed space-y-4">
              <p>
                India’s homestays are among the most soulful travel experiences in the world: restored planter bungalows in the Western Ghats, Chettinad stone mansions, coastal Goan villas, and Himalayan pine cottages. Yet for years, property hosts struggled to source amenities that respected their aesthetic.
              </p>
              <p>
                Commercial hotel suppliers offered synthetic poly-blend bedsheets, hollow plastic luggage racks, and mass-produced toiletries that drained homestays of their individual soul.
              </p>
              <p>
                <strong>AShK Stays</strong> was established to change that. We partner directly with multigenerational artisan communities across India to design functional hospitality essentials: certified organic cotton linens, solid plantation teak fixtures, sand-cast brass keys, and breakfast hampers filled with single-estate harvests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <img
              src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80"
              alt="Artisan woodcrafting"
              className="rounded-xl border border-[#E8E3D9] object-cover h-64 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
              alt="Brass casting"
              className="rounded-xl border border-[#E8E3D9] object-cover h-64 w-full"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#F8F6F0] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-xl bg-white border border-[#E8E3D9] space-y-4">
              <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold">
                Our Mission
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1B3B2B]">
                To elevate independent Indian homestays into world-class sanctuaries.
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                By providing thoughtful design, commercial-grade sustainable goods, and hands-on operational advisory, we help property owners build sustainable, high-reputation hospitality businesses.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[#E8E3D9] space-y-4">
              <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold">
                Our Vision
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1B3B2B]">
                Preserving India’s artisanal legacies through everyday guest touchpoints.
              </h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                We envision a future where every traveler in India sleeps in unbleached organic cotton, holds heirloom brass keys, and tastes authentic regional estate honeys and teas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
              Our Commitments
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1B3B2B]">
              Values That Guide Every Product
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#1B3B2B] text-[#FBF9F5] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1F2421]">
                Material Honesty
              </h4>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                No synthetic polyester coatings or faux veneers. We use pure long-staple cotton, plantation teak, sand-cast brass, and pure botanical distillates.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#1B3B2B] text-[#FBF9F5] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1F2421]">
                Fair Artisan Trade
              </h4>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                We contract directly with regional artisan guilds in Moradabad, Khurja, Karur, and Channapatna, bypassing exploitative middlemen to preserve indigenous craft.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#1B3B2B] text-[#FBF9F5] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1F2421]">
                Rigorous Endurance
              </h4>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Hospitality demands durability. Every seam, hinge, and glaze is tested to withstand frequent washings, heavy luggage weights, and constant guest turnover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop & Locations */}
      <section className="py-20 bg-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#1B3B2B] text-[#FBF9F5] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C87A55] font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Offices in Bangalore & Coorg, Karnataka</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Ready to elevate your property experience?
              </h3>
              <p className="text-sm text-[#D1D5DB]">
                Browse our curated homestay collection or schedule a 1-on-1 virtual property setup consultation.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                to="/products"
                className="px-6 py-3 rounded-md bg-[#FBF9F5] text-[#1B3B2B] text-xs font-semibold hover:bg-[#E8E3D9] transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>View Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-md border border-[#FBF9F5]/40 text-[#FBF9F5] text-xs font-semibold hover:bg-white/10 transition-colors"
              >
                Speak with Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
