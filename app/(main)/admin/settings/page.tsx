import AdminSidebar from '../components/AdminSidebar';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="flex relative min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 relative z-10 w-full min-h-screen">
        <div className="max-w-container-max mx-auto px-md md:px-gutter py-xl flex flex-col gap-xl">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">Platform Settings</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Manage global configurations for Neon Nexus.</p>
            </div>
          </header>
          <SettingsClient />
        </div>
      </main>
    </div>
  );
}
