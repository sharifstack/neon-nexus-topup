"use client";

import { useTranslation } from "@/lib/LanguageContext";

import MediaRenderer from "@/components/MediaRenderer";

function GameCard({ game }: { game: any }) {
  const thumb = game.coverImage || `https://via.placeholder.com/180?text=${encodeURIComponent(game.name)}`;
  const linkId = game.slug || game._id || game.id;

  return (
    <a
      href={`/marketplace/${linkId}`}
      className="flex flex-col items-center gap-2 flex-shrink-0 group"
      style={{ width: 72 }}
    >
      <div
        className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-md"
        style={{ background: "#1a1a2e" }}
      >
        <MediaRenderer
          src={thumb}
          alt={game.name}
          fill
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-[10px] font-semibold uppercase text-on-surface-variant group-hover:text-primary transition-colors text-center leading-tight w-full truncate">
        {game.name}
      </span>
    </a>
  );
}

export default function GameSlider({ games }: { games: any[] }) {
  const { dict } = useTranslation();
  const t = dict.marketplace;

  if (!games || games.length === 0) return null;

  const items = [...games, ...games, ...games];
  const ITEM_WIDTH = 88;
  const duration = `${(games.length * ITEM_WIDTH) / 60}s`;

  return (
    <div className="mt-10 rounded-2xl bg-surface-container-high border border-white/5 p-5 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            public
          </span>
          {t.discoverRegion}
        </p>
        <a
          href="/marketplace"
          className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
        >
          {games.length} {t.gamesCount}
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
          style={{ animation: `marquee-slide ${duration} linear infinite` }}
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
