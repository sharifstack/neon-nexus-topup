import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') redirect('/');

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-6 pt-28">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            <div>
              <h1 className="font-headline-lg text-headline-lg font-black text-on-surface tracking-tight">
                User Management
              </h1>
              <p className="text-on-surface-variant text-sm mt-1">
                Monitor accounts, activity, and enforce platform moderation.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2">
              <span className="material-symbols-outlined text-primary text-base">shield_person</span>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Nexus Admin</span>
            </div>
          </div>

          <UsersClient />
        </div>
      </main>
    </div>
  );
}
