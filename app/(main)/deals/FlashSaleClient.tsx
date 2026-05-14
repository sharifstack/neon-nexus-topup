"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlashDeal } from "@/lib/db";

export default function FlashSaleClient({ deal }: { deal: FlashDeal }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Bangladesh is GMT+6
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

  if (!deal) return null;

  return (
    <div className="space-y-12">
      {/* ── Header & Countdown ─────────────────────────────────── */}
      <section className="relative py-12 px-4 overflow-hidden flex flex-col items-center text-center">
        {/* Animated ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-4 italic">
          FLASH <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary drop-shadow-[0_0_30px_rgba(255,0,255,0.4)]">DEALS</span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 opacity-80 leading-relaxed">
          Daily exclusive rewards. Restocks every midnight Dhaka time.
        </p>

        {/* Premium Countdown Box */}
        <div className="inline-block">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/50 via-primary/50 to-secondary/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col items-center bg-[#12121a]/80 backdrop-blur-2xl rounded-2xl border border-white/5 px-12 py-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="text-[11px] font-black tracking-[0.2em] text-secondary uppercase">Ends In</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{format(timeLeft.h)}</span>
                  <span className="text-[9px] font-black text-on-surface-variant uppercase mt-1">Hours</span>
                </div>
                <span className="text-3xl font-black text-white/10 mb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{format(timeLeft.m)}</span>
                  <span className="text-[9px] font-black text-on-surface-variant uppercase mt-1">Minutes</span>
                </div>
                <span className="text-3xl font-black text-white/10 mb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{format(timeLeft.s)}</span>
                  <span className="text-[9px] font-black text-on-surface-variant uppercase mt-1">Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Deal Card ─────────────────────────────────── */}
      <section className="px-gutter max-w-7xl mx-auto w-full">
        <div className="relative group rounded-[2.5rem] overflow-hidden bg-surface-container-high border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-[0_0_80px_rgba(255,0,255,0.1)]">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src={deal.backgroundMedia}
              alt="bg"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform "
              onError={(e) => {
                e.currentTarget.src = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTNlbHJ1aTFya2I4Yng2YjNxcnFqMGRzbTlhemw1bjZ0bjRsdThjMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eV08lydIMcTftXX3vi/giphy.gif";
              }}
            />
            {/* Premium Dark Cyberpunk Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 p-10 md:p-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 flex-1 min-w-0">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary text-xs font-black px-4 py-2 rounded-xl border border-secondary/30 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  {deal.bonusText}
                </div>
                <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
                  {deal.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
                    {deal.offerTitle}
                  </span>
                </h2>
                <p className="text-on-surface-variant text-lg font-medium opacity-80">
                  Exclusive daily drop. Secure this deal before it vanishes at midnight.
                </p>
              </div>

              {/* Progress & Stock */}
              <div className="space-y-3">
                <div className="flex justify-between items-end gap-4">
                  <div className="space-y-1">
                    <p className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">STOCK STATUS</p>
                    <p className="text-secondary font-black text-sm uppercase whitespace-nowrap">{deal.limitedQuantity}</p>
                  </div>
                  <p className="text-white font-black text-2xl">{deal.stockStatus}%</p>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                    style={{ width: `${deal.stockStatus}%` }}
                  />
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-on-surface-variant text-sm font-black line-through opacity-50 italic">${deal.originalPrice}</span>
                  <span className="text-white text-5xl font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">${deal.discountedPrice}</span>
                </div>
                <Link
                  href={`/marketplace/${deal.gameId}`}
                  className="px-10 h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  SECURE DEAL
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </Link>
              </div>
            </div>


          </div>
        </div>
      </section>
    </div>
  );
}

// Add a slow bounce animation to globals.css if needed, or use custom style
