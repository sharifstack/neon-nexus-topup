import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const paymentStats = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { 
        $group: { 
          _id: '$paymentMethod', 
          revenue: { $sum: '$amount' }, 
          orderCount: { $sum: 1 } 
        } 
      },
      { $sort: { revenue: -1 } }
    ]);

    const totalOrders = paymentStats.reduce((sum, p) => sum + p.orderCount, 0);

    const formattedStats = paymentStats.map(stat => ({
      method: stat._id,
      revenue: stat.revenue,
      orderCount: stat.orderCount,
      usagePercentage: totalOrders > 0 ? (stat.orderCount / totalOrders) * 100 : 0
    }));

    return NextResponse.json({
      payments: formattedStats
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
