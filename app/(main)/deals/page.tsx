import { readDb } from "@/lib/db";
import FlashSaleClient from "./FlashSaleClient";
import LiveDropsSection from "./LiveDropsSection";

export const metadata = {
  title: 'Flash Deals – Neon Nexus',
  description: 'Limited time offers on premium game top-ups. Secure your deals now.',
};

export default async function FlashDealsPage() {
  const db = await readDb();
  const deals = db.flashDeals || [];
  const drops = db.liveDrops || [];
  
  // For the MVP, we take the first active deal
  const featuredDeal = deals[0];

  return (
    <div className="flex-grow bg-[#08080c] min-h-screen pb-24">
      {/* Dynamic Flash Sale Section */}
      <FlashSaleClient deal={featuredDeal} />

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

