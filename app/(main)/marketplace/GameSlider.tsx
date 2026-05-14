"use client";

import { Game } from "@/lib/db";

const GAME_THUMBS: Record<string, string> = {
  "pubg-mobile": "https://cdn2.steamgriddb.com/icon_thumb/db4f084e914385e578364fa4eebe3bec.png",
  "delta-force": "https://assets-prd.ignimgs.com/2024/08/28/delta-force-button-replacement-1724855313566.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80",
  "honor-of-kings": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT2hr2EhvzGvLWP7ESdvP9Ea8hlxg0MkQGIfbRX9bjcHv1VC8Ez",
  "mobile-legends": "https://sm.ign.com/ign_za/screenshot/default/mobile-legends-bang-bang_c51z.png",
  "free-fire": "https://play-lh.googleusercontent.com/EJ83sg58Oo2gAjMHFxFVLM6Z53kuH4_R0M7Yq7gts5fWSIlFchUlmskG1vJKMoncmfOxBXcgJyIaO-nak6sO-MM",
  "genshin-impact": "https://cdn1.epicgames.com/spt-assets/99dc46c68ea14324964a856d18dcac5b/genshin-impact-hqdph.jpg",
  "valorant": "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/valo2.png",
  "clash-of-clans": "https://play-lh.googleusercontent.com/sFmWfYbYp_2ea7VRMTnwd3gjIBrPGXHj_d_ab1_k1q1p2OMk4riGMF1vqxdhONOtTYOt_BVpk7a4AYcKU68LNGQ",
};

function GameCard({ game }: { game: Game }) {
  const thumb = GAME_THUMBS[game.id] ?? `https://via.placeholder.com/180?text=${encodeURIComponent(game.name)}`;
  return (
    <a
      href={`/marketplace/${game.id}`}
      className="flex flex-col items-center gap-2 flex-shrink-0 group"
      style={{ width: 72 }}
    >
      <div
        className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-md"
        style={{ background: "#1a1a2e" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          draggable={false}
        />
      </div>
      <span className="text-[10px] font-semibold uppercase text-on-surface-variant group-hover:text-primary transition-colors text-center leading-tight w-full truncate">
        {game.name}
      </span>
    </a>
  );
}

export default function GameSlider({ games }: { games: Game[] }) {
  // Duplicate items 3× to guarantee seamless loop at all viewport widths
  const items = [...games, ...games, ...games];
  // Speed: px per second. More items → longer duration so speed is constant.
  const ITEM_WIDTH = 88; // 72px card + 16px gap
  const duration = `${(games.length * ITEM_WIDTH) / 60}s`; // ~60 px/s

  return (
    <div className="mt-10 rounded-2xl bg-surface-container-high border border-white/5 p-5 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            public
          </span>
          Discover Other Region Games
        </p>
        <a
          href="/marketplace"
          className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
        >
          {games.length} Games
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </a>
      </div>

      {/* Fade edges */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--color-surface-container-high), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--color-surface-container-high), transparent)" }}
        />

        {/* Scrolling track */}
        <div
          className="flex gap-4 w-max"
          style={{
            animation: `marquee-slide ${duration} linear infinite`,
          }}
          // Pause on hover of the entire track
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
        >
          {items.map((game, i) => (
            <GameCard key={`${game.id}-${i}`} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
