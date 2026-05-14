import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';
import { notFound } from 'next/navigation';
import TopUpClient from './TopUpClient';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export default async function TopUpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  
  let gameDoc = null;

  // 1. Try finding by slug
  gameDoc = await Game.findOne({ slug: slug });

  // 2. If not found and slug looks like an ObjectId, try finding by _id
  if (!gameDoc && mongoose.Types.ObjectId.isValid(slug)) {
    gameDoc = await Game.findById(slug);
  }
  
  if (!gameDoc) {
    console.log(`[TOPUP] Game not found for slug/id: ${slug}`);
    notFound();
  }

  const game = JSON.parse(JSON.stringify(gameDoc));

  return (
    <div className="w-full bg-[#050506]">
      <TopUpClient game={game} />
    </div>
  );
}
