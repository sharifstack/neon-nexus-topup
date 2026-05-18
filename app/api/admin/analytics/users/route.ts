import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const newRegistrations = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Returning users: active in last 30 days but registered before 30 days
    const returningUsers = await User.countDocuments({
      lastSeen: { $gte: thirtyDaysAgo },
      createdAt: { $lt: thirtyDaysAgo }
    });

    // Top spenders
    const topSpenders = await User.find({ role: 'user' })
      .sort({ totalSpent: -1 })
      .limit(5)
      .select('name email avatar totalSpent totalOrders')
      .lean();

    // Highest points
    const highestPoints = await User.find({ role: 'user' })
      .sort({ points: -1 })
      .limit(5)
      .select('name email avatar points')
      .lean();

    // Most active
    const mostActive = await User.find({ role: 'user' })
      .sort({ totalOrders: -1 })
      .limit(5)
      .select('name email avatar totalOrders')
      .lean();

    return NextResponse.json({
      newRegistrations,
      returningUsers,
      topSpenders,
      highestPoints,
      mostActive
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
