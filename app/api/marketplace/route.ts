import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all active products
    const products = await Game.find({ isActive: true }).sort({ displayPriority: -1, createdAt: -1 });
    
    // Categorize for frontend
    const allGames = products.filter(p => p.type === 'game' || p.category === 'Mobile Games' || p.category === 'PC Games');
    const miniGames = products.filter(p => p.isMiniGame || p.type === 'minigame');
    const flashDeals = products.filter(p => p.isFlashDeal || p.type === 'flashdeal');
    const entertainment = products.filter(p => p.type === 'entertainment');
    const featured = products.filter(p => p.isFeatured);

    return NextResponse.json({
      allGames,
      miniGames,
      flashDeals,
      entertainment,
      featured
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
