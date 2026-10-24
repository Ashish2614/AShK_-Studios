import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Bed, Key, Coffee, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideoWalkthrough: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const suiteHighlights = [
    {
      id: 1,
      title: 'Estate Organic Cotton Bedding',
      category: 'Linen & Sleep',
      desc: '500-thread count long-staple Indian organic cotton tailored for breezy coastal and hill retreats.',
      price: '₹4,800',
      slug: 'estate-organic-cotton-bedding',
      icon: Bed
    },
    {
      id: 2,
      title: 'Hand-Cast Brass Room Keys & Teak Fobs',
      category: 'Arrival Decor',
      desc: 'Solid sand-cast brass with laser-engraved cottage numbers on the executive oceanfront writing desk.',
      price: '₹2,200',
      slug: 'heritage-brass-room-keys-fobs',
      icon: Key
    },
    {
      id: 3,
      title: 'Single-Estate Morning Hamper',
      category: 'Hospitality Hamper',
      desc: 'First-flush Darjeeling tea, raw Coorg honey, and hand-beaten brass strainer enjoyed on the balcony.',
      price: '₹1,950',
      slug: 'single-estate-morning-hamper',
      icon: Coffee
    }
  ];

  return (
    <section id="experience" className="py-20 bg-[#12281D] text-[#FBF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Virtual Suite Walkthrough</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FBF9F5] leading-tight">
            Step Inside the AShK Signature Ocean Suite.
          </h2>
          <p className="mt-4 text-base text-[#D1D5DB] leading-relaxed">
            Experience how our tactile linens, artisanal furnishings, and thoughtful details come together to create an unforgettable sanctuary by the sea.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="relative rounded-2xl overflow-hidden border border-[#2A563F] shadow-2xl bg-[#0B1711] aspect-video max-w-5xl mx-auto group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
          >
            {/* Direct video stream for luxury coastal suite */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-hotel-room-with-a-view-of-the-sea-42526-large.mp4"
              type="video/mp4"
            />
            {/* Fallback stream */}
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Ambient Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Top Video Status Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#C87A55] animate-pulse" />
              <span className="font-medium tracking-wide">AShK Coastal Sanctuary · Master Ocean Suite</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white/80">
              <Shield className="w-3.5 h-3.5 text-[#C87A55]" />
              <span>Full Homestay Product Integration</span>
            </div>
          </div>

          {/* Video Control Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#1B3B2B] hover:bg-[#2A563F] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause walkthrough video' : 'Play walkthrough video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute walkthrough audio' : 'Mute walkthrough audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="hidden md:inline text-xs text-white/70">
                Oceanfront Panorama · Floor-to-Ceiling Balcony
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#FBF9F5] bg-[#C87A55] hover:bg-[#B3643D] px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Shop This Suite</span>
              </Link>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="View in fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products inside this Walkthrough */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {suiteHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                onMouseEnter={() => setActiveHotspot(idx)}
                onMouseLeave={() => setActiveHotspot(null)}
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  activeHotspot === idx 
                    ? 'bg-[#1B3B2B] border-[#C87A55] shadow-lg' 
                    : 'bg-[#0B1711] border-[#2A563F]/60 hover:border-[#2A563F]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B3B2B] text-[#C87A55] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#FBF9F5] tabular-nums">
                    {item.price}
                  </span>
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C87A55] mb-1">
                  {item.category}
                </div>
                <h4 className="font-serif text-lg font-bold text-[#FBF9F5] mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                  {item.desc}
                </p>
                <Link
                  to={`/products/${item.slug}`}
                  className="text-xs font-medium text-[#C87A55] hover:text-[#E8E3D9] inline-flex items-center gap-1 transition-colors"
                >
                  <span>View Product Details</span>
                  <span>→</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Host Advisory Banner */}
        <div className="mt-12 max-w-5xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-[#1B3B2B] to-[#12281D] border border-[#2A563F] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-xl font-bold text-[#FBF9F5]">
              Own a homestay or heritage villa in India?
            </h4>
            <p className="text-sm text-[#D1D5DB]">
              Transform your guest suites into five-star sanctuaries with our curated setup audit & wholesale sourcing.
            </p>
          </div>
          <Link
            to="/products/homestay-setup-audit-consulting"
            className="px-5 py-2.5 rounded-lg bg-[#C87A55] text-white text-xs font-medium hover:bg-[#B3643D] transition-colors whitespace-nowrap shrink-0 shadow-md"
          >
            Explore Host Advisory
          </Link>
        </div>
      </div>
    </section>
  );
};
