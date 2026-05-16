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
        <div className="group relative w-full h-auto md:h-[200px] rounded-3xl overflow-hidden bg-[#161b22] border border-white/5 flex flex-col md:flex-row items-center shadow-2xl transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,242,255,0.15)]">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.featuredBackgroundUrl || featured.bannerImage}
              alt="background"
              className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[5s]"
              onError={(e) => { (e.target as HTMLImageElement).src = featured.bannerImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          </div>

          <div className="relative z-20 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:px-10 w-full h-full">
            {/* Icon Container */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0">
              <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-3xl group-hover:bg-primary/50 transition-colors" />
              <div className="relative w-full h-full rounded-3xl border-2 border-white/20 p-2 overflow-hidden bg-black/40 backdrop-blur-sm shadow-2xl">
                <Image
                  src={GAME_ICONS[featured.id] || featured.coverImage}
                  alt={featured.name}
                  fill
                  className="object-cover rounded-2xl"
                  unoptimized
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-3 md:space-y-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">{featured.name}</h3>
                <span className="bg-primary/20 text-primary text-[9px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-primary/30 backdrop-blur-md w-fit">
                  <span className="material-symbols-outlined text-[12px]">sports_esports</span>
                  {t.miniGamesLabel}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs md:text-[11px] font-bold max-w-2xl leading-relaxed opacity-80 drop-shadow-md line-clamp-2">
                {featured.description}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                <Link
                  href={`/marketplace/${featured.id}/recharge`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">shopping_cart</span>
                </Link>
                <Link
                  href={featured.playUrl || '#'}
                  className="flex-1 md:flex-none px-6 md:px-10 h-10 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-primary-container text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:scale-105 active:scale-95 transition-all text-[10px] md:text-xs"
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">play_circle</span>
                  {t.playNow}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Mini Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {others.map(game => (
          <div
            key={game._id || game.id}
            className="group relative h-[120px] md:h-[140px] rounded-2xl overflow-hidden bg-[#161b22] border border-white/5 flex items-center shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={game.bannerImage}
                alt={game.name}
                fill
                className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#161b22] via-[#161b22]/90 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center gap-4 px-5 w-full">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={GAME_ICONS[game.id] || game.coverImage}
                  alt={game.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-grow space-y-2.5">
                <h4 className="text-white text-xs md:text-sm font-black uppercase tracking-tight line-clamp-1">{game.name}</h4>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/marketplace/${game.id}/recharge`}
                    className="flex-grow h-9 rounded-lg bg-white/5 border border-white/10 text-on-surface-variant text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    <span className="hidden xs:inline">{t.shop}</span>
                  </Link>
                  <Link
                    href={game.playUrl || '#'}
                    className="flex-grow h-9 rounded-lg bg-primary text-black text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:scale-[1.03] transition-all shadow-glow"
                  >
                    <span className="material-symbols-outlined text-[16px]">sports_esports</span>
                    <span className="hidden xs:inline">{t.playNow}</span>
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
