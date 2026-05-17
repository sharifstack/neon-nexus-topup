"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MediaRenderer from "@/components/MediaRenderer";

interface Banner {
  _id: string;
  accentColor?: string;
  gradient?: string;
  imageUrl: string;
  badge?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  href: string;
}

export default function BannerCarousel({ banners = [] }: { banners?: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!banners || banners.length === 0 || isHovered) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners, isHovered]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[current];

  return (
    <div 
      className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] rounded-[2rem] overflow-hidden shadow-2xl mb-12 group bg-[#0a0f1d] border border-white/10 flex flex-col md:flex-row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 flex flex-col md:flex-row"
        >
          {/* ── LEFT: Cinematic Media Container (Desktop/Tablet) & Background (Mobile) ──────────────────────────── */}
          <div className="absolute inset-0 md:relative md:w-[60%] lg:w-[65%] md:h-full flex-shrink-0 overflow-hidden bg-[#0a0f1d]">
            <MediaRenderer
              src={currentBanner.imageUrl}
              alt={currentBanner.badge || currentBanner.title}
              fill
              className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-[10s]"
              priority
            />
            {/* Seamless Gradient Overlays */}
            {/* Desktop/Tablet horizontal blend into right panel */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#131b2e]/50 to-[#131b2e] hidden md:block" />
            {/* Mobile vertical blend into bottom content */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#131b2e]/90 to-transparent md:hidden" />
          </div>

          {/* ── RIGHT: Luxurious Premium Content Container ───────────────────── */}
          <div className="flex-1 flex flex-col justify-end md:justify-center p-6 pb-16 md:pb-8 md:p-8 lg:p-10 relative overflow-hidden bg-transparent md:bg-[#131b2e]/90 backdrop-blur-none md:backdrop-blur-2xl border-l-0 md:border-l border-white/10 z-20 md:z-auto">
            {/* Subtle Background Decorative Glow (Desktop) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 hidden md:block pointer-events-none" />
            
            <div className="relative z-20 space-y-2 md:space-y-4 max-w-[560px]">
              {/* Premium Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-full backdrop-blur-md shadow-md"
              >
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-cyan-500"></span>
                </span>
                <span className="material-symbols-outlined text-[10px] md:text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
                {currentBanner.badge || "Featured Marketplace Drop"}
              </motion.div>

              {/* Grand Title */}
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-white text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight line-clamp-2"
              >
                {currentBanner.title}
              </motion.h2>

              {/* Elegant Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-on-surface-variant text-[11px] md:text-sm font-medium opacity-80 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-3"
              >
                {currentBanner.subtitle || "Experience top-tier gaming top-ups with instant delivery. Secure your premium currency packages today."}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-1 md:pt-2 flex flex-wrap items-center gap-2 md:gap-4"
              >
                <Link
                  href={currentBanner.href}
                  className="px-4 py-2 md:px-8 md:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1 md:gap-2 shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all"
                >
                  {currentBanner.ctaText || "Explore Package"}
                  <span className="material-symbols-outlined text-sm md:text-base">arrow_forward</span>
                </Link>

                <Link
                  href="/deals"
                  className="px-4 py-2 md:px-6 md:py-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-1 md:gap-2 backdrop-blur-md active:scale-95"
                >
                  View Deals
                  <span className="material-symbols-outlined text-sm md:text-base">local_offer</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation Controls & Animated Progress Bar ────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-4 md:bottom-6 flex items-center justify-between px-6 md:px-8 lg:px-12 z-30 pointer-events-none">
        {/* Pagination Bars */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#131b2e]/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white/10 shadow-md">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 md:h-1.5 rounded-full transition-all duration-500 relative overflow-hidden ${
                i === current ? "w-5 md:w-12 bg-white/20" : "w-1.5 md:w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0 h-full bg-cyan-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* Glassmorphism Navigation Arrows (Desktop/Tablet) */}
        <div className="flex items-center gap-2 pointer-events-auto hidden md:flex">
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="w-10 h-10 rounded-xl bg-[#131b2e]/80 hover:bg-cyan-500/20 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 text-white hover:text-cyan-400 flex items-center justify-center transition-all shadow-lg active:scale-95"
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="w-10 h-10 rounded-xl bg-[#131b2e]/80 hover:bg-cyan-500/20 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 text-white hover:text-cyan-400 flex items-center justify-center transition-all shadow-lg active:scale-95"
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
