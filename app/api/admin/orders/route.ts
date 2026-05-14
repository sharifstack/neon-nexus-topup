import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('gameId', 'name');
      
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const { orderId, status } = await req.json();
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
