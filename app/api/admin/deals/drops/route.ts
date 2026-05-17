import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LiveDrop from '@/models/LiveDrop';
import Game from '@/models/Game';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const drops = await LiveDrop.find().populate('gameId').sort({ createdAt: -1 }).lean();
    return NextResponse.json(drops);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const body = await req.json();

    if (body.gameId) {
      const gameExists = await Game.findById(body.gameId);
      if (!gameExists) {
        return NextResponse.json({ error: 'Referenced Game does not exist in inventory' }, { status: 400 });
      }
    }

    const drop = await LiveDrop.create(body);
    return NextResponse.json(drop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const { id, ...data } = await req.json();

    if (data.gameId) {
      const gameExists = await Game.findById(data.gameId);
      if (!gameExists) {
        return NextResponse.json({ error: 'Referenced Game does not exist in inventory' }, { status: 400 });
      }
    }

    const drop = await LiveDrop.findByIdAndUpdate(id, data, { new: true });
    if (!drop) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(drop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await LiveDrop.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
