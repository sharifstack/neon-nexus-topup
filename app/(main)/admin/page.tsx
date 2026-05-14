import AdminSidebar from './components/AdminSidebar';
import AdminDashboardClient from './AdminDashboardClient';
import { Calendar } from 'lucide-react';

export default function AdminPage() {
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
            <div className="flex items-center gap-md">
              <div className="glass-panel rounded-full px-md py-sm flex items-center gap-sm text-on-surface-variant text-label-md font-label-md cursor-pointer hover:bg-surface-variant/40 transition-colors">
                <Calendar className="w-4 h-4" />
                Last 7 Days
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </div>
            </div>
          </header>

          <AdminDashboardClient />
        </div>
      </main>
    </div>
  );
}

