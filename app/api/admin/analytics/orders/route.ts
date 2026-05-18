import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Game from '@/models/Game';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();

    // Recent Transactions
    const recentTransactions = await Order.find()
      .sort({ createdAt: -1 })
      .limit(15)
      .populate('userId', 'name email avatar')
      .populate('gameId', 'name coverImage iconImage category')
      .lean();

    // Top Selling Games
    const topSellingData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$gameId', totalRevenue: { $sum: '$amount' }, orderCount: { $sum: 1 } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 6 }
    ]);

    const topSelling = await Promise.all(
      topSellingData.map(async (item) => {
        const game = await Game.findById(item._id).select('name coverImage iconImage category').lean();
        return {
          gameId: item._id,
          name: game ? game.name : 'Deleted Game',
          image: game ? (game.iconImage || game.coverImage) : null,
          category: game ? game.category : 'Unknown',
          totalRevenue: item.totalRevenue,
          orderCount: item.orderCount
        };
      })
    );

    return NextResponse.json({
      recentTransactions,
      topSelling
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
