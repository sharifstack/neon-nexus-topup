import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { seedDatabaseIfNeeded } from '@/lib/db-init';
import { ensureAdmin } from '@/lib/auth';
import Game from '@/models/Game';

export async function GET() {
  try {
    await ensureAdmin();
    await connectToDatabase();
    
    // Force the seed function to run
    console.log('[FORCE SYNC] Manually triggering database synchronization...');
    await seedDatabaseIfNeeded();
    
    const gameCount = await Game.countDocuments();
    
    return NextResponse.json({ 
      success: true, 
      message: `Database synchronization completed.`,
      totalGamesInDb: gameCount
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
