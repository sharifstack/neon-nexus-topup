import { readDb } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const db = await readDb();
  const game = db.games?.find(g => g.id === gameId);
  if (!game) notFound();

  // Redirect straight to the dedicated recharge page
  redirect(`/marketplace/${gameId}/recharge`);
}
