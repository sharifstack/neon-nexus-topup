import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Game from '@/models/Game';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();

    // Fetch dashboard stats
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const activeUsers = await User.countDocuments({ role: 'user' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // Fetch recent transactions
    const recentTransactions = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('gameId', 'name');

    // Fetch top selling games (aggregated)
    const topSelling = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$gameId', totalSales: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    // Populate game names for top selling
    const populatedTopSelling = await Promise.all(
      topSelling.map(async (item) => {
        const game = await Game.findById(item._id);
        return {
          name: game ? game.name : 'Unknown',
          totalSales: item.totalSales,
          count: item.count
        };
      })
    );

    // Revenue trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueTrends = await Order.aggregate([
      { $match: { status: 'Completed', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        activeUsers,
        pendingOrders
      },
      recentTransactions,
      topSelling: populatedTopSelling,
      revenueTrends
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
