"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/lib/LanguageContext';

const GAME_ICONS: Record<string, string> = {
  "eight-ball-pool": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/8_Ball_Pool_cover.jpg/250px-8_Ball_Pool_cover.jpg",
  "pool-city": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKlBLtddQcBiRMcE3F-fVNdC3DokjYxWgKqw&s",
  "ludo-world": "https://play-lh.googleusercontent.com/cJ-448ovtGs12hh6wxxw9B-EucZvr0J3ZYkv3Ab6ME5HLMjTG3mYR9mwav9RcS1w3w",
  "ludo-king": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Ludo_King.png/250px-Ludo_King.png",
  "candy-match": "https://play-lh.googleusercontent.com/u_S3KuxzucT_n2muyOluFK2rmss8IdKGZ3zZX_2Uhjd5YczdSQ5u5-HUvICbUXkCHTY",
};

export default function MiniGamesSection({ games }: { games: any[] }) {
  const { dict } = useTranslation();
  const t = dict.miniGames;

  const miniGames = games.filter(g => g.category === 'Mini Game');
  const featured = miniGames.find(g => g.isFeaturedMiniGame) || miniGames[0];
  const others = miniGames.filter(g => g._id !== featured?._id);

  if (!miniGames.length) return null;

  return (
    <div className="mt-16 space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-white text-2xl font-black uppercase tracking-tighter">{t.title}</h2>
        <p className="text-on-surface-variant text-[11px] leading-relaxed max-w-3xl opacity-70">
          {t.disclaimer} <span className="text-primary cursor-pointer hover:underline">{t.moreDetails}</span>
        </p>
      </div>

      {/* Featured Mini Game Card */}
      {featured && (
        <div className="group relative w-full h-[280px] rounded-3xl overflow-hidden bg-surface-container-high border border-white/5 flex items-center shadow-2xl transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,242,255,0.15)]">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.featuredBackgroundUrl || featured.bannerImage}
              alt="background"
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[5s]"
              onError={(e) => { (e.target as HTMLImageElement).src = featured.bannerImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/10 z-10" />
          </div>

          <div className="relative z-20 flex items-center gap-10 px-12 w-full h-full">
            <div className="relative w-40 h-40 flex-shrink-0">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-colors" />
              <div className="relative w-full h-full rounded-full border-2 border-white/20 p-2 overflow-hidden bg-black/40 backdrop-blur-sm shadow-2xl">
                <Image
                  src={GAME_ICONS[featured.id] || featured.coverImage}
                  alt={featured.name}
                  fill
                  className="object-cover rounded-full"
                  unoptimized
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-5">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{featured.name}</h3>
                <span className="bg-primary/20 text-primary text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-primary/30 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px]">sports_esports</span>
                  {t.miniGamesLabel}
                </span>
              </div>
              <p className="text-on-surface-variant text-base md:text-lg font-semibold max-w-2xl leading-relaxed opacity-90 drop-shadow-md">
                {featured.description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={`/marketplace/${featured.id}/recharge`}
                  className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                </Link>
                <Link
                  href={featured.playUrl || '#'}
                  className="px-12 h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:shadow-[0_0_50px_rgba(0,242,255,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl">play_circle</span>
                  {t.playNow}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Mini Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map(game => (
          <div
            key={game._id || game.id}
            className="group relative h-[140px] rounded-2xl overflow-hidden bg-surface-container-high border border-white/5 flex items-center shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={game.bannerImage}
                alt={game.name}
                fill
                className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-surface-container-high/80 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center gap-4 px-6 w-full">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={GAME_ICONS[game.id] || game.coverImage}
                  alt={game.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-grow space-y-3">
                <h4 className="text-white text-sm font-black uppercase tracking-tight">{game.name}</h4>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/marketplace/${game.id}/recharge`}
                    className="flex-grow h-9 rounded-lg bg-white/5 border border-white/10 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    {t.shop}
                  </Link>
                  <Link
                    href={game.playUrl || '#'}
                    className="flex-grow h-9 rounded-lg bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:scale-[1.03] transition-all shadow-glow"
                  >
                    <span className="material-symbols-outlined text-[16px]">sports_esports</span>
                    {t.playNow}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
