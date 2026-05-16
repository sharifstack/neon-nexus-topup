import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import PointsReward from '@/models/PointsReward';
import PointsTransaction from '@/models/PointsTransaction';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/points/redeem — authenticated user redeems a reward
export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'You must be logged in to redeem rewards.' }, { status: 401 });
    }

    await connectToDatabase();
    const { rewardId } = await req.json();

    if (!rewardId) {
      return NextResponse.json({ error: 'rewardId is required.' }, { status: 400 });
    }

    // Fetch reward
    const reward = await PointsReward.findById(rewardId);
    if (!reward || !reward.isActive) {
      return NextResponse.json({ error: 'Reward not found or unavailable.' }, { status: 404 });
    }

    // Check stock
    if (reward.stock !== null && reward.stock <= 0) {
      return NextResponse.json({ error: 'This reward is out of stock.' }, { status: 409 });
    }

    // Fetch latest user balance (don't trust session cache)
    const user = await User.findById(sessionUser._id);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.points < reward.pointsCost) {
      return NextResponse.json({
        error: `Insufficient points. You need ${reward.pointsCost.toLocaleString()} pts but have ${user.points.toLocaleString()} pts.`,
      }, { status: 402 });
    }

    // Deduct points atomically
    const updated = await User.findOneAndUpdate(
      { _id: user._id, points: { $gte: reward.pointsCost } }, // double-check race condition
      { $inc: { points: -reward.pointsCost } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Insufficient points (concurrent request).' }, { status: 402 });
    }

    // Decrement stock if limited
    if (reward.stock !== null) {
      await PointsReward.findByIdAndUpdate(rewardId, {
        $inc: { totalRedeemed: 1, stock: -1 },
      });
    } else {
      await PointsReward.findByIdAndUpdate(rewardId, {
        $inc: { totalRedeemed: 1 },
      });
    }

    // Log transaction
    await PointsTransaction.create({
      userId: user._id,
      type: 'redeemed',
      points: reward.pointsCost,
      description: `Redeemed: ${reward.title}`,
      rewardId: reward._id,
      rewardTitle: reward.title,
    });

    return NextResponse.json({
      success: true,
      reward: reward.title,
      pointsSpent: reward.pointsCost,
      newBalance: updated.points,
    });
  } catch (error: any) {
    console.error('[POINTS REDEEM]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
