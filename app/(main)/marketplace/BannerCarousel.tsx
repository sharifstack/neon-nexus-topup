"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[180px] md:h-[220px] rounded-2xl overflow-hidden shadow-2xl mb-6 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 flex"
        >
          {/* ── LEFT: game image ──────────────────────────── */}
          <div className="relative w-[40%] md:w-[55%] h-full flex-shrink-0 overflow-hidden hidden sm:block">
            <img
              src={banners[current].imageUrl}
              alt={banners[current].badge || banners[current].title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10s] scale-110 group-hover:scale-100"
            />
            {/* Gradient Overlay for blend */}
            <div 
              className="absolute inset-0 z-10"
              style={{ background: `linear-gradient(to right, transparent 0%, ${banners[current].accentColor || '#1a6df0'} 100%)` }}
            />
          </div>

          {/* ── RIGHT: promo text panel ───────────────────── */}
          <div
            className={`flex-1 flex flex-col justify-center px-6 md:px-8 py-4 md:py-6 relative overflow-hidden bg-gradient-to-br ${banners[current].gradient || 'from-[#1a6df0] to-[#0d3fa8]'}`}
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-20 space-y-1 md:space-y-2">
              <span className="inline-flex items-center gap-1.5 text-white/70 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full w-fit">
                <span className="material-symbols-outlined text-xs md:text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
                {banners[current].badge || "FEATURED"}
              </span>

              <h2 className="text-white text-lg md:text-[22px] font-extrabold leading-tight mb-1 md:mb-2 max-w-[260px] uppercase">
                {banners[current].title}
              </h2>

              <p className="text-white/75 text-[11px] md:text-sm mb-2 md:mb-4 max-w-[240px] line-clamp-2">
                {banners[current].subtitle}
              </p>

              <div className="pt-1">
                <Link
                  href={banners[current].href}
                  className="inline-flex items-center gap-2 bg-white text-black px-5 md:px-6 h-8 md:h-10 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  {banners[current].ctaText || "GO"}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Controls ────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-4 md:bottom-6 flex items-center justify-between px-4 md:px-8 z-30 pointer-events-none">
        {/* Dots */}
        <div className="flex gap-1.5 pointer-events-auto">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === current ? "w-6 md:w-10 bg-white" : "w-1 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-1.5 pointer-events-auto hidden md:flex">
          <button
            onClick={() => setCurrent(c => (c - 1 + banners.length) % banners.length)}
            className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrent(c => (c + 1) % banners.length)}
            className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
