"use server";

import { getSessionUser } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import PointsTransaction from '@/models/PointsTransaction';
import { randomUUID } from 'crypto';

// Points earned per 1 BDT/currency unit spent
const POINTS_PER_UNIT = 10;

export async function processCheckout(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'You must be logged in to make a purchase.' };
  }

  const amountStr = formData.get('amount') as string;
  const description = formData.get('description') as string || 'Neon Nexus Top Up';
  const gameIdStr = formData.get('gameId') as string | null;
  const packageName = formData.get('packageName') as string || description;
  const paymentMethod = formData.get('paymentMethod') as string || 'unknown';
  const gamePlayerId = formData.get('gamePlayerId') as string | undefined;
  const gameZoneId = formData.get('gameZoneId') as string | undefined;

  if (!amountStr) {
    return { error: 'Invalid amount.' };
  }
  
  if (!gameIdStr || gameIdStr.trim() === '') {
    return { error: 'Game reference missing. Please try again.' };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Invalid payment amount.' };
  }

  // Calculate points: 10 points per currency unit
  const pointsEarned = Math.floor(amount * POINTS_PER_UNIT);

  try {
    await connectToDatabase();

    const transactionId = `NX-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Create an Order record
    const orderData: any = {
      userId: user._id,
      gameId: gameIdStr,
      packageName,
      amount,
      status: 'Completed',
      paymentMethod,
      transactionId,
      pointsEarned,
      gamePlayerId,
      gameZoneId,
    };

    const order = await Order.create(orderData);

    // Atomically update user: add points + lifetime total + order stats
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        points: pointsEarned,
        totalPointsEarned: pointsEarned,
        totalSpent: amount,
        totalOrders: 1,
      },
    });

    // Log the points transaction
    await PointsTransaction.create({
      userId: user._id,
      type: 'earned',
      points: pointsEarned,
      description: `Earned from purchase: ${description}`,
      orderId: order._id,
    });

    return { success: true, transactionId, pointsEarned };
  } catch (err: any) {
    console.error('[CHECKOUT ERROR]', err);
    return { error: 'Payment processing failed. Please try again.' };
  }
}
