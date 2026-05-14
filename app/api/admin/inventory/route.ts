import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';
import { ensureAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const games = await Game.find().sort({ createdAt: -1 });
    return NextResponse.json(games);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const body = await req.json();
    
    // Simple slug generation if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }

    const newGame = await Game.create(body);
    return NextResponse.json(newGame);
  } catch (error: any) {
    console.error('[INVENTORY POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureAdmin();
    await connectToDatabase();
    const { id, ...updateData } = await req.json();
    
    const updatedGame = await Game.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedGame) throw new Error('Game not found');
    
    return NextResponse.json(updatedGame);
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
    
    if (!id) throw new Error('ID required');
    
    await Game.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
