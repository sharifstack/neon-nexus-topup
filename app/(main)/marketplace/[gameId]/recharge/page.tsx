import connectToDatabase from '@/lib/mongodb';
import Game from '@/models/Game';
import PaymentMethod from '@/models/PaymentMethod';
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
  
  // Try to fetch payment methods from DB, fallback to defaults if empty
  let paymentMethods = [];
  try {
    const dbPaymentMethods = await PaymentMethod.find({ isActive: true });
    if (dbPaymentMethods && dbPaymentMethods.length > 0) {
      paymentMethods = JSON.parse(JSON.stringify(dbPaymentMethods));
    } else {
      throw new Error('No methods in DB');
    }
  } catch (err) {
    paymentMethods = [
      { id: 'bkash', name: 'bKash', logo: '💳', fee: 0.015, description: 'Mobile banking' },
      { id: 'nagad', name: 'Nagad', logo: '📱', fee: 0.01, description: 'Digital wallet' },
      { id: 'rocket', name: 'Rocket', logo: '🚀', fee: 0.01, description: 'Dutch Bangla' }
    ];
  }

  return (
    <div className="flex-grow bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RechargeClient game={game} paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
