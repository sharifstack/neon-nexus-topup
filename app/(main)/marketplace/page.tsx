import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';
import HeroBanner from '@/models/HeroBanner';
import BannerCarousel from './BannerCarousel';
import MarketplaceClient from './MarketplaceClient';
import GameSlider from './GameSlider';
import MiniGamesSection from './MiniGamesSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Marketplace – Neon Nexus',
  description: 'Buy top-up packages for your favourite games at the best prices.',
};

export default async function MarketplacePage() {
  try {
    console.log('[MARKETPLACE] Connecting to database...');
    await connectToDatabase();
    
    console.log('[MARKETPLACE] Fetching products and banners...');
    const [products, banners] = await Promise.all([
      Game.find({ isActive: true }).sort({ displayPriority: -1, createdAt: -1 }).lean(),
      HeroBanner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean()
    ]);
    
    // Ensure we handle empty results gracefully
    if (!products) {
      console.warn('[MARKETPLACE] No products returned from database');
    }

    // Convert Mongoose documents to plain objects for props
    // This is critical for Server-to-Client component data passing
    const games = JSON.parse(JSON.stringify(products || []));
    const heroBanners = JSON.parse(JSON.stringify(banners || []));

    console.log(`[MARKETPLACE] Rendering ${games.length} games and ${heroBanners.length} banners`);

    return (
      <div className="flex-grow bg-[#0d1117] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Animated banner carousel */}
          <BannerCarousel banners={heroBanners} />

          {/* Games grid with client-side category filter */}
          <MarketplaceClient games={games} />

          {/* Discover other region games – scrollable slider */}
          <GameSlider games={games.filter((g: any) => g.showInOtherRegion)} />

          {/* Mini Games section */}
          <MiniGamesSection games={games} />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('[MARKETPLACE ERROR]', error);
    // In production, we want to throw so the error boundary (error.tsx) catches it
    throw error;
  }
}
