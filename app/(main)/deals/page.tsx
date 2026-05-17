import connectToDatabase from '@/lib/mongodb';
import FlashDeal from '@/models/FlashDeal';
import LiveDrop from '@/models/LiveDrop';
import FlashSaleClient from "./FlashSaleClient";
import LiveDropsSection from "./LiveDropsSection";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Flash Deals – Neon Nexus',
  description: 'Limited time offers on premium game top-ups. Secure your deals now.',
};

export default async function FlashDealsPage() {
  await connectToDatabase();
  
  const [flashDealsData, liveDropsData] = await Promise.all([
    FlashDeal.find({ isActive: true }).lean(),
    LiveDrop.find({ isActive: true }).lean()
  ]);

  const deals = JSON.parse(JSON.stringify(flashDealsData || []));
  const drops = JSON.parse(JSON.stringify(liveDropsData || []));
  
  return (
    <div className="flex-grow bg-[#08080c] min-h-screen pb-24">
      {/* Dynamic Flash Sale Section */}
      {deals.length > 0 && <FlashSaleClient deals={deals} />}

      {/* Dynamic Live Drops Section */}
      <LiveDropsSection drops={drops} />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}

