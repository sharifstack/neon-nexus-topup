"use client";

import Image from "next/image";
import Link from "next/link";
import { LiveDrop } from "@/lib/db";

const BADGE_COLORS = {
  "Almost Gone": "bg-red-500/20 text-red-400 border-red-500/30",
  "Restocked": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Limited": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function LiveDropsSection({ drops }: { drops: LiveDrop[] }) {
  return (
    <section className="px-gutter max-w-7xl mx-auto w-full mt-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(0,242,255,0.5)]" />
          <h3 className="text-3xl font-black text-white uppercase tracking-tight">LIVE DROPS</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-black text-on-surface-variant uppercase tracking-widest opacity-60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Feed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="group relative bg-surface-container-high rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
          >
            {/* Image Layer */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src={drop.image}
                alt={drop.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent" />
              
              {/* Status Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${BADGE_COLORS[drop.badge]}`}>
                  {drop.badge}
                </div>
              </div>

              {/* Flash Alert Tag */}
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/10">
                  FLASH ALERT
                </div>
              </div>
            </div>

            {/* Content Layer */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h4 className="text-white text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                  {drop.name}
                </h4>
                <p className="text-on-surface-variant text-sm font-semibold opacity-70">
                  {drop.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Drop Price</span>
                  <span className="text-white text-2xl font-black">$5.99</span>
                </div>
                <Link
                  href={`/marketplace/${drop.gameId}`}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white text-on-surface hover:text-black flex items-center justify-center transition-all border border-white/10"
                >
                  <span className="material-symbols-outlined font-black">add_shopping_cart</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / Coming Soon */}
      <div className="mt-16 glass-panel rounded-3xl border-dashed border-white/10 p-12 text-center group cursor-help">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">protocol</span>
        </div>
        <h4 className="text-white text-xl font-black uppercase tracking-widest mb-2 italic">Protocol: Next Drop</h4>
        <p className="text-on-surface-variant text-sm font-semibold opacity-60 max-w-md mx-auto">
          Neural link established. Monitoring game servers for exclusive loot drops. Stay sharp, Operative.
        </p>
      </div>
    </section>
  );
}
