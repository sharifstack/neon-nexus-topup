import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import PointsTransaction from '@/models/PointsTransaction';
import Game from '@/models/Game';
import FlashDeal from '@/models/FlashDeal';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const fourteenDaysAgo = new Date(sevenDaysAgo);
    fourteenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Revenue & Orders Current Period (Last 7 days)
    const currentPeriodStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'Completed' } },
      { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Revenue & Orders Previous Period (Days 8-14)
    const previousPeriodStats = await Order.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }, status: 'Completed' } },
      { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const currentRevenue = currentPeriodStats[0]?.revenue || 0;
    const previousRevenue = previousPeriodStats[0]?.revenue || 0;
    const revenueGrowth = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    const currentOrders = currentPeriodStats[0]?.count || 0;
    const previousOrders = previousPeriodStats[0]?.count || 0;
    const ordersGrowth = previousOrders === 0 ? 100 : ((currentOrders - previousOrders) / previousOrders) * 100;

    // Total Lifetime Stats
    const totalLifetime = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const lifetimeRevenue = totalLifetime[0]?.revenue || 0;
    const lifetimeOrders = totalLifetime[0]?.count || 0;

    // Active Users (last 7 days based on lastSeen or createdAt)
    const activeUsersCount = await User.countDocuments({
      $or: [
        { lastSeen: { $gte: sevenDaysAgo } },
        { createdAt: { $gte: sevenDaysAgo } }
      ]
    });

    // Pending Orders
    const pendingOrdersCount = await Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } });

    // Points Distributed
    const pointsData = await PointsTransaction.aggregate([
      { $match: { type: 'earned' } },
      { $group: { _id: null, totalPoints: { $sum: '$points' } } }
    ]);
    const pointsDistributed = pointsData[0]?.totalPoints || 0;

    // Conversion Rate (Completed Orders / All Orders)
    const allOrdersCount = await Order.countDocuments();
    const conversionRate = allOrdersCount === 0 ? 0 : (lifetimeOrders / allOrdersCount) * 100;

    // Live Activity Widgets
    const onlineUsers = await User.countDocuments({ isOnline: true });
    const activeFlashDeals = await FlashDeal.countDocuments({
      $or: [
        { endsAt: { $gte: now } },
        { endsAt: null }
      ]
    });
    const lowStockGames = await Game.countDocuments({ stock: { $lt: 20, $gt: 0 } });
    
    // Failed payments today
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const failedPaymentsToday = await Order.countDocuments({ status: 'Failed', createdAt: { $gte: startOfDay } });

    return NextResponse.json({
      revenue: {
        total: lifetimeRevenue,
        period: currentRevenue,
        growth: revenueGrowth
      },
      orders: {
        total: lifetimeOrders,
        period: currentOrders,
        growth: ordersGrowth
      },
      activeUsers: activeUsersCount,
      pendingOrders: pendingOrdersCount,
      pointsDistributed,
      conversionRate,
      live: {
        onlineUsers,
        activeFlashDeals,
        lowStockGames,
        failedPaymentsToday
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
