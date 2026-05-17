import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import HeroBanner from '@/models/HeroBanner';
import Game from '@/models/Game';
import { getSessionUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const data = await req.json();

    if (data.gameId) {
      const gameExists = await Game.findById(data.gameId);
      if (!gameExists) {
        return NextResponse.json({ error: 'Referenced Game does not exist in inventory' }, { status: 400 });
      }
    }

    const updatedBanner = await HeroBanner.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBanner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const deletedBanner = await HeroBanner.findByIdAndDelete(id);
    
    if (!deletedBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
