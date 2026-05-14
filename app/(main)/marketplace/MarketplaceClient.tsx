
"use client";

import { useState } from "react";
import Link from "next/link";
import { Game } from "@/lib/db";

const GAME_IMAGES: Record<string, string> = {
  "pubg-mobile":     "https://cdn2.steamgriddb.com/thumb/13816ba0dd3a36209cbc3cfef265dc7c.jpg",
  "delta-force":     "https://cdn2.steamgriddb.com/thumb/b604cbf4909675b9fd8e31920ae686f0.jpg",
  "honor-of-kings":  "https://cdn2.steamgriddb.com/thumb/6776c7f6cd45c6fb6f8557a6df90d86d.jpg",
  "mobile-legends":  "https://cdn2.steamgriddb.com/thumb/0226eaaf8270cfee15be9b7bae9dff2e.png",
  "free-fire":       "https://cdn2.steamgriddb.com/thumb/c6e7526fe6c02eaf3de35b5d3c1dde29.jpg",
  "genshin-impact":  "https://cdn2.steamgriddb.com/thumb/17ac85cc7b94b7e29577acb5f9b38aa7.jpg",
  "valorant":        "https://cdn2.steamgriddb.com/thumb/9edb6b9b7fc3b263b86740c635839dc4.jpg",
  "clash-of-clans":  "https://m.media-amazon.com/images/M/MV5BYWMyYzc5ZWEtOTk1ZS00NzFlLTkwNjEtZmVhMzlhNDhkMmQ5XkEyXkFqcGc@._V1_.jpg",
};

const TAG_STYLES: Record<string, string> = {
  discount: "bg-gradient-to-r from-yellow-500 to-orange-500",
  bonus:    "bg-gradient-to-r from-red-500 to-rose-600",
  star:     "bg-gradient-to-r from-green-500 to-emerald-600",
};
const TAG_ICONS: Record<string, string> = {
  discount: "thumb_up",
  bonus:    "local_fire_department",
  star:     "star",
};

const CATEGORIES = ["All Games", "Latest", "Entertainment", "Mini Game"];

export default function MarketplaceClient({ games }: { games: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All Games");

  const filtered = activeCategory === "All Games"
    ? games
    : games.filter(g => g.category === activeCategory || (activeCategory === "Mini Game" && g.isMiniGame));

  return (
    <div className="w-full">
      {/* ── Section header ─────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-3 mt-8">
        <h1 className="text-white font-extrabold text-xl tracking-widest uppercase">ALL GAMES</h1>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
          <span>We are the official recharge store</span>
        </div>
      </div>

      {/* ── Category pills ─────────────────────────────────── */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,242,255,0.4)]"
                : "bg-white/5 text-on-surface-variant hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Games Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-8">
        {filtered.map(game => {
          const img = game.coverImage;
          const tagStyle = TAG_STYLES[game.tagColor || "bonus"] || TAG_STYLES.bonus;
          const tagIcon  = TAG_ICONS[game.tagColor || "bonus"] || "local_fire_department";

          return (
            <Link
              key={game._id}
              href={`/topup/${game.slug || game._id}`}
              className="group flex flex-col items-center"
            >
              {/* card */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md
                              transition-all duration-300
                              group-hover:-translate-y-2
                              group-hover:shadow-[0_16px_30px_rgba(0,0,0,0.5)]
                              bg-surface-container-highest border border-white/5">
                <img
                  src={img}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* tag badge */}
                {(game.tag || game.isFlashDeal) && (
                  <div className={`absolute bottom-0 inset-x-0 flex items-center justify-center gap-1 py-1 text-white text-[10px] font-bold ${game.isFlashDeal ? 'bg-secondary' : tagStyle}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{game.isFlashDeal ? 'bolt' : tagIcon}</span>
                    {game.isFlashDeal ? 'FLASH DEAL' : game.tag}
                  </div>
                )}
              </div>

              {/* title */}
              <p className="mt-2 text-center font-bold text-on-surface text-[11px] uppercase tracking-wide leading-snug group-hover:text-primary transition-colors">
                {game.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

