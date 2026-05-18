import AdminSidebar from '../components/AdminSidebar';
import AnalyticsClient from './AnalyticsClient';
import { Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return (
    <div className="flex relative min-h-screen">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 bg-background relative z-10 w-full min-h-screen">
        <div className="max-w-container-max mx-auto px-md md:px-gutter py-xl flex flex-col gap-xl">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">Analytics Overview</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Real-time performance metrics for Neon Nexus.</p>
            </div>
          </header>

          <AnalyticsClient />
        </div>
      </main>
    </div>
  );
}
