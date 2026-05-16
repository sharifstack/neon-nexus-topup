import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PointsReward from '@/models/PointsReward';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/points/rewards — public list of active rewards
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query: any = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const rewards = await PointsReward.find(query)
      .sort({ isFeatured: -1, displayPriority: -1, pointsCost: 1 })
      .lean();

    return NextResponse.json(rewards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/points/rewards — admin: create a new reward
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const reward = await PointsReward.create(body);
    return NextResponse.json(reward, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
