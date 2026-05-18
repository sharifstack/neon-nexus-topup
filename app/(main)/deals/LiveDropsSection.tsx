"use client";

import MediaRenderer from "@/components/MediaRenderer";
import Link from "next/link";
import { LiveDrop } from "@/lib/db";
import { motion } from "framer-motion";

const BADGE_COLORS: Record<string, string> = {
  "Almost Gone": "bg-red-500/10 text-red-400 border-red-500/20",
  "Restocked": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Limited": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function LiveDropsSection({ drops }: { drops: LiveDrop[] }) {
  return (
    <section className="px-gutter max-w-7xl mx-auto w-full mt-24">
      <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.4)]" />
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">LIVE DROPS</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider opacity-80 bg-[#131b2e]/60 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Feed Active
        </div>
      </div>

      {drops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drops.map((drop, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={drop.id}
              className="group relative bg-[#131b2e]/50 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between"
            >
              {/* Image Layer */}
              <div className="relative h-56 overflow-hidden bg-[#0a0f1d]">
                <MediaRenderer
                  src={(drop.gameId as any)?.bannerImage || (drop.gameId as any)?.featuredBackgroundUrl || (drop.gameId as any)?.coverImage || drop.image}
                  alt={drop.name}
                  fill
                  className="group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-90" />
                
                {/* Status Badge */}
                <div className="absolute top-5 left-5 z-10">
                  <div className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-md ${BADGE_COLORS[drop.badge] || "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"}`}>
                    {drop.badge}
                  </div>
                </div>

                {/* Flash Alert Tag */}
                <div className="absolute top-5 right-5 z-10">
                  <div className="bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
                    FLASH ALERT
                  </div>
                </div>
              </div>

              {/* Content Layer */}
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-white text-xl font-extrabold uppercase tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {drop.name}
                  </h4>
                  <p className="text-on-surface-variant text-sm font-medium opacity-80 line-clamp-2 leading-relaxed">
                    {drop.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider opacity-60">Special Drop Price</span>
                    <span className="text-white text-2xl font-black tabular-nums">$5.99</span>
                  </div>
                  <Link
                    href={`/marketplace/${typeof drop.gameId === 'object' ? (drop.gameId as any)._id || (drop.gameId as any).id : drop.gameId}`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500 hover:to-cyan-600 text-cyan-400 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-cyan-500/30 hover:border-transparent shadow-md active:scale-95"
                  >
                    Claim Drop
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Loading Skeleton / Empty Grid Structure */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#131b2e]/30 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 space-y-6 animate-pulse">
              <div className="h-44 bg-white/5 rounded-2xl w-full" />
              <div className="space-y-3">
                <div className="h-6 bg-white/10 rounded-lg w-2/3" />
                <div className="h-4 bg-white/5 rounded-lg w-full" />
                <div className="h-4 bg-white/5 rounded-lg w-4/5" />
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="h-8 bg-white/5 rounded-lg w-1/3" />
                <div className="h-10 bg-white/10 rounded-xl w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Premium Protocol Empty State Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 bg-gradient-to-r from-[#0a0f1d] via-[#131b2e] to-[#0a0f1d] rounded-3xl border border-white/10 p-10 md:p-12 text-center group shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
        <div className="w-16 h-16 bg-[#131b2e] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-cyan-500/30 transition-all shadow-md">
          <span className="material-symbols-outlined text-3xl text-cyan-400 group-hover:scale-110 transition-transform">protocol</span>
        </div>
        <h4 className="text-white text-xl font-extrabold uppercase tracking-wider mb-3">Protocol: Next Drop Monitoring</h4>
        <p className="text-on-surface-variant text-sm font-medium opacity-80 max-w-[512px] mx-auto leading-relaxed">
          Neural link established. Active automated monitoring of game developer APIs for upcoming exclusive loot drops. Stay sharp, Operative.
        </p>
      </motion.div>
    </section>
  );
}
