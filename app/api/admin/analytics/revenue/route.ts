import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { ensureAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    const now = new Date();
    let startDate = new Date();
    let dateFormat = "%Y-%m-%d";

    if (range === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === '12m') {
      startDate.setMonth(now.getMonth() - 12);
      dateFormat = "%Y-%m"; // Group by month
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const trends = await Order.aggregate([
      { $match: { status: 'Completed', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: "$amount" }
        }
      },
      { $sort: { _id: 1 } } // Chronological order
    ]);

    // Format output
    const formattedTrends = trends.map(t => ({
      date: t._id,
      revenue: t.revenue,
      orders: t.orders,
      avgOrderValue: t.avgOrderValue
    }));

    return NextResponse.json({ trends: formattedTrends });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
