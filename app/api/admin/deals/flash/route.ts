import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FlashDeal from '@/models/FlashDeal';
import Game from '@/models/Game';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const deals = await FlashDeal.find().populate('gameId').sort({ createdAt: -1 }).lean();
    return NextResponse.json(deals);
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

    const deal = await FlashDeal.create(body);
    return NextResponse.json(deal);
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

    const deal = await FlashDeal.findByIdAndUpdate(id, data, { new: true });
    if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(deal);
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
    await FlashDeal.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
