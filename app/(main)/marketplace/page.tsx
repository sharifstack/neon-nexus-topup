import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';
import BannerCarousel from './BannerCarousel';
import MarketplaceClient from './MarketplaceClient';
import GameSlider from './GameSlider';
import MiniGamesSection from './MiniGamesSection';

export const metadata = {
  title: 'Marketplace – Neon Nexus',
  description: 'Buy top-up packages for your favourite games at the best prices.',
};

export default async function MarketplacePage() {
  await connectToDatabase();
  const products = await Game.find({ isActive: true }).sort({ displayPriority: -1, createdAt: -1 });
  
  // Convert Mongoose documents to plain objects for props
  const games = JSON.parse(JSON.stringify(products));

  return (
    <div className="flex-grow bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Animated banner carousel */}
        <BannerCarousel />

        {/* Games grid with client-side category filter */}
        <MarketplaceClient games={games} />

        {/* Discover other region games – scrollable slider */}
        <GameSlider games={games} />

        {/* Mini Games section */}
        <MiniGamesSection games={games} />
      </div>
    </div>
  );
}


function getGameThumb(id: string): string {
  const map: Record<string, string> = {
    "pubg-mobile":    "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/capsule_616x353.jpg",
    "delta-force":    "https://cdn.cloudflare.steamstatic.com/steam/apps/2507920/capsule_616x353.jpg",
    "honor-of-kings": "https://play-lh.googleusercontent.com/RbMf21mUzXQ9jq7zqj3V5j9xJKd1ioJz0bZhcZqJKpApNYxIa0x4lG9k3G4KCJQ=s180",
    "mobile-legends": "https://cdn.cloudflare.steamstatic.com/steam/apps/1286780/capsule_616x353.jpg",
    "free-fire":      "https://play-lh.googleusercontent.com/E_DRl46akU8mzrM_MvhMqD-5VBDqRl5L7o29g0P0JBCV9a5EG8J8jTIvmXWnI4ZOBA=s180",
    "genshin-impact": "https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/capsule_616x353.jpg",
    "valorant":       "https://cdn.cloudflare.steamstatic.com/steam/apps/1735950/capsule_616x353.jpg",
    "clash-of-clans": "https://play-lh.googleusercontent.com/3WLt58c0EeZ0EQDtETgqxPLNuvbMuYwIXn9WFQFZ6Y6IVqKpOhFTiQpBjfMmEdCRLx4=s180",
  };
  return map[id] ?? "https://via.placeholder.com/300x400?text=Game";
}
