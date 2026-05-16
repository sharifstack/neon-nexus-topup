import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PointsReward from '@/models/PointsReward';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const rewards = await PointsReward.find().sort({ createdAt: -1 });
    return NextResponse.json(rewards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const data = await req.json();
    const reward = await PointsReward.create(data);
    return NextResponse.json(reward);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { id, ...data } = await req.json();
    const reward = await PointsReward.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(reward);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    await PointsReward.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
