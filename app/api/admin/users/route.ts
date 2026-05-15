import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { ensureAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - fetch all users with order stats
export async function GET(req: NextRequest) {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const users = await User.find({})
      .select('-passwordHash -verificationToken')
      .sort({ createdAt: -1 })
      .lean();

    // Auto-lift expired suspensions
    const now = new Date();
    const enriched = await Promise.all(users.map(async (u: any) => {
      // Auto-lift expired suspension
      if (u.status === 'suspended' && u.suspendedUntil && new Date(u.suspendedUntil) < now) {
        await User.findByIdAndUpdate(u._id, {
          status: 'active',
          $unset: { suspendedUntil: 1, suspendReason: 1 }
        });
        u.status = 'active';
        u.suspendedUntil = undefined;
      }

      // Pull aggregate order stats
      const stats = await Order.aggregate([
        { $match: { userId: u._id, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]);
      const orderStats = stats[0] || { total: 0, count: 0 };

      // Latest order
      const latestOrder = await Order.findOne({ userId: u._id })
        .sort({ createdAt: -1 })
        .populate('gameId', 'name')
        .lean();

      return {
        ...u,
        totalSpent: orderStats.total,
        totalOrders: orderStats.count,
        latestOrder: latestOrder ? {
          gameName: (latestOrder.gameId as any)?.name || 'Unknown',
          packageName: latestOrder.packageName,
          amount: latestOrder.amount,
          status: latestOrder.status,
          date: latestOrder.createdAt,
        } : null,
      };
    }));

    return NextResponse.json(enriched);
  } catch (error: any) {
    console.error('[ADMIN/USERS GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - moderation actions
export async function PATCH(req: NextRequest) {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const body = await req.json();
    const { userId, action, durationDays, reason, note } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Prevent moderating other admins
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'Cannot moderate admin accounts' }, { status: 403 });
    }

    switch (action) {
      case 'suspend': {
        const days = durationDays || 1;
        const suspendedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        user.status = 'suspended';
        user.suspendedUntil = suspendedUntil;
        user.suspendReason = reason || `Suspended for ${days} day(s)`;
        if (note) user.moderationNote = note;
        break;
      }
      case 'ban': {
        user.status = 'banned';
        user.banReason = reason || 'Violated platform terms of service';
        if (note) user.moderationNote = note;
        break;
      }
      case 'unban':
      case 'unsuspend':
      case 'activate': {
        user.status = 'active';
        user.suspendedUntil = undefined;
        user.banReason = undefined;
        user.suspendReason = undefined;
        if (note) user.moderationNote = note;
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ success: true, status: user.status });
  } catch (error: any) {
    console.error('[ADMIN/USERS PATCH]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
