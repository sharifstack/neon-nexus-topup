import { getSessionUser } from '@/lib/auth';
import PointsStoreClient from './PointsStoreClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Points Store – Neon Nexus',
  description: 'Redeem your earned points for exclusive in-game rewards.',
};

export default async function PointsPage() {
  const user = await getSessionUser();
  return <PointsStoreClient user={user} />;
}
