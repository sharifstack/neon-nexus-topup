"use client";

import { useEffect, useState } from "react";
import MediaRenderer from "@/components/MediaRenderer";
import Link from "next/link";
import { FlashDeal } from "@/lib/db";
import { motion } from "framer-motion";

export default function FlashSaleClient({ deals }: { deals: FlashDeal[] }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const dhakaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const tomorrow = new Date(dhakaTime);
      tomorrow.setHours(24, 0, 0, 0); // Next midnight Dhaka time

      const diff = tomorrow.getTime() - dhakaTime.getTime();

      if (diff <= 0) return { h: 0, m: 0, s: 0 };

      return {
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  if (!deals || deals.length === 0) return null;

  const featuredDeal = deals[0];
  const secondaryDeals = deals.slice(1);

  return (
    <div className="space-y-16 pt-8">
      {/* ── Header & Countdown ─────────────────────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-10 px-4 overflow-hidden flex flex-col items-center text-center max-w-5xl mx-auto"
      >
        {/* Soft elegant ambient background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Limited Time Offers
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4">
          FLASH <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">DEALS</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 opacity-80 leading-relaxed">
          Daily exclusive premium rewards. Restocks every midnight Dhaka time.
        </p>

        {/* Premium Compact Countdown Box */}
        <div className="inline-block">
          <div className="relative flex flex-col md:flex-row items-center gap-6 bg-[#131b2e]/80 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-5 shadow-xl">
            <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-6">
              <span className="material-symbols-outlined text-cyan-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              <span className="text-xs font-bold tracking-wider text-white uppercase">Offer Ends In</span>
            </div>

            <div className="flex items-center gap-5 text-center">
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-3xl md:text-4xl font-black text-white tabular-nums">{format(timeLeft.h)}</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5">Hours</span>
              </div>
              <span className="text-2xl font-black text-white/20 mb-4">:</span>
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-3xl md:text-4xl font-black text-white tabular-nums">{format(timeLeft.m)}</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5">Minutes</span>
              </div>
              <span className="text-2xl font-black text-white/20 mb-4">:</span>
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-3xl md:text-4xl font-black text-white tabular-nums">{format(timeLeft.s)}</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-0.5">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Featured Primary Deal Card ─────────────────────────────────── */}
      {featuredDeal && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-gutter max-w-7xl mx-auto w-full"
        >
          <div className="bg-[#131b2e]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-10 transition-all duration-500 hover:border-cyan-500/30 group">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left: Media / Preview Container */}
              <div className="lg:col-span-6 relative h-72 md:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-lg bg-[#0a-0f-1d] flex items-center justify-center">
                <MediaRenderer
                  src={(featuredDeal.gameId as any)?.featuredBackgroundUrl || (featuredDeal.gameId as any)?.bannerImage || (featuredDeal.gameId as any)?.coverImage || featuredDeal.backgroundMedia}
                  alt={featuredDeal.title}
                  fill
                  className="group-hover:scale-105 transition-transform duration-700 opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  Featured Deal
                </div>
              </div>

              {/* Right: Content Hierarchy */}
              <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-purple-500/20 backdrop-blur-md">
                    <span className="material-symbols-outlined text-sm">stars</span>
                    {featuredDeal.bonusText}
                  </div>
                  <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                    {featuredDeal.title} <br />
                    <span className="text-cyan-400 font-extrabold text-2xl md:text-4xl block mt-1">
                      {featuredDeal.offerTitle}
                    </span>
                  </h2>
                  <p className="text-on-surface-variant text-base font-medium opacity-80 leading-relaxed max-w-[560px]">
                    Exclusive daily premium drop. Secure this deal before the allocated stock vanishes at midnight.
                  </p>
                </div>

                {/* Progress & Stock */}
                <div className="space-y-3 max-w-[440px]">
                  <div className="flex justify-between items-end gap-4">
                    <div className="space-y-1">
                      <p className="text-white/60 font-bold text-xs uppercase tracking-wider">Stock Status</p>
                      <p className="text-cyan-400 font-bold text-sm uppercase">{featuredDeal.limitedQuantity}</p>
                    </div>
                    <p className="text-white font-black text-xl">{featuredDeal.stockStatus}%</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                      style={{ width: `${featuredDeal.stockStatus}%` }}
                    />
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-white text-4xl md:text-5xl font-black tabular-nums">${featuredDeal.discountedPrice}</span>
                    <span className="text-on-surface-variant text-base font-bold line-through opacity-50">${featuredDeal.originalPrice}</span>
                  </div>
                  <Link
                    href={`/marketplace/${typeof featuredDeal.gameId === 'object' ? (featuredDeal.gameId as any)._id || (featuredDeal.gameId as any).id : featuredDeal.gameId}`}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg hover:shadow-[0_4px_20px_rgba(6,182,212,0.3)] active:scale-95"
                  >
                    SECURE DEAL
                    <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Secondary Deals Grid ─────────────────────────────────── */}
      {secondaryDeals.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="px-gutter max-w-7xl mx-auto w-full mt-16"
        >
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
            <div className="w-2 h-6 bg-purple-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">More Flash Deals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryDeals.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={item.id || (item as any)._id || idx}
                className="group relative bg-[#131b2e]/50 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between"
              >
                {/* Media Header */}
                <div className="relative h-56 overflow-hidden bg-[#0a0f1d]">
                  <MediaRenderer
                    src={(item.gameId as any)?.bannerImage || (item.gameId as any)?.featuredBackgroundUrl || (item.gameId as any)?.coverImage || item.backgroundMedia}
                    alt={item.title}
                    fill
                    className="group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-md">
                    {item.bonusText || "Special Offer"}
                  </div>
                </div>

                {/* Content Layer */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-white text-xl font-extrabold uppercase tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-cyan-400 font-bold text-sm uppercase line-clamp-1">
                      {item.offerTitle}
                    </p>
                  </div>

                  {/* Stock Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/60 font-bold uppercase">{item.limitedQuantity || "Limited Stock"}</span>
                      <span className="text-white font-black">{item.stockStatus}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${item.stockStatus}%` }}
                      />
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider opacity-60 line-through">${item.originalPrice}</span>
                      <span className="text-white text-2xl font-black tabular-nums">${item.discountedPrice}</span>
                    </div>
                    <Link
                      href={`/marketplace/${typeof item.gameId === 'object' ? (item.gameId as any)._id || (item.gameId as any).id : item.gameId}`}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500 hover:to-cyan-600 text-cyan-400 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-cyan-500/30 hover:border-transparent shadow-md active:scale-95"
                    >
                      Secure Deal
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
