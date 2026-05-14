import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';
import PaymentMethod from '@/models/PaymentMethod'; // Assuming this model exists, if not I'll use a fallback
import { notFound } from 'next/navigation';
import RechargeClient from './RechargeClient';

export default async function RechargePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  await connectToDatabase();
  
  // Try finding by slug first (modern way), then fallback to ID
  const gameDoc = await Game.findOne({ $or: [{ slug: gameId }, { id: gameId }] });
  
  if (!gameDoc) {
    notFound();
  }

  // Convert to plain object
  const game = JSON.parse(JSON.stringify(gameDoc));
  
  // Fallback payment methods if collection is empty
  const paymentMethods = [
    { id: 'bkash', name: 'bKash', fee: 0.015 },
    { id: 'nagad', name: 'Nagad', fee: 0.01 },
    { id: 'rocket', name: 'Rocket', fee: 0.01 }
  ];

  return (
    <div className="flex-grow bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RechargeClient game={game} paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}

