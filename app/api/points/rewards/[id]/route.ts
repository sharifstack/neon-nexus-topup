import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PointsReward from '@/models/PointsReward';
import { getSessionUser } from '@/lib/auth';
import { ensureAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PATCH /api/points/rewards/[id] — admin: update reward
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    const reward = await PointsReward.findByIdAndUpdate(id, body, { new: true });
    if (!reward) return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    return NextResponse.json(reward);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/points/rewards/[id] — admin: delete reward
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const { id } = await params;
    await PointsReward.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
