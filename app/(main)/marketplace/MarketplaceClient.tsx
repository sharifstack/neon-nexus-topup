"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

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

export default function MarketplaceClient({ games }: { games: any[] }) {
  const { dict } = useTranslation();
  const t = dict.marketplace;

  const CATEGORIES = [t.allGames, t.latest, t.entertainment, t.miniGame];
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const filtered = activeCategory === t.allGames
    ? games
    : activeCategory === t.miniGame
      ? games.filter(g => g.isMiniGame)
      : activeCategory === t.latest
        ? [...games].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : games.filter(g => g.category === activeCategory);

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3 mt-8">
        <h1 className="text-white font-extrabold text-xl tracking-widest uppercase">{t.title}</h1>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
          <span>{t.officialStore}</span>
        </div>
      </div>

      {/* Category pills */}
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

      {/* Games Grid */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {(game.tag || game.isFlashDeal) && (
                  <div className={`absolute bottom-0 inset-x-0 flex items-center justify-center gap-1 py-1 text-white text-[10px] font-bold ${game.isFlashDeal ? 'bg-secondary' : tagStyle}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{game.isFlashDeal ? 'bolt' : tagIcon}</span>
                    {game.isFlashDeal ? dict.home.flashDeal.toUpperCase() : game.tag}
                  </div>
                )}
              </div>
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
