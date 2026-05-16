import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PointsTransaction from '@/models/PointsTransaction';
import User from '@/models/User';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/points/history — authenticated user's points transaction history
export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [transactions, user] = await Promise.all([
      PointsTransaction.find({ userId: sessionUser._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      User.findById(sessionUser._id).select('points totalPointsEarned').lean(),
    ]);

    return NextResponse.json({
      balance: (user as any)?.points ?? 0,
      totalEarned: (user as any)?.totalPointsEarned ?? 0,
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
