import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import HeroBanner from '@/models/HeroBanner';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const banners = await HeroBanner.find().sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    // If making this active, potentially handle limits or reordering, but for now just save
    const newBanner = await HeroBanner.create(data);
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
