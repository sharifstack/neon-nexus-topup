export const dynamic = "force-dynamic";

import AdminSidebar from '../components/AdminSidebar';
import OrdersClient from './OrdersClient';
import { ShoppingCart } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex relative min-h-screen">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 bg-background relative z-10 w-full min-h-screen">
        <div className="max-w-container-max mx-auto px-md md:px-gutter py-xl flex flex-col gap-xl">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-[0_0_15px_rgba(255,107,157,0.1)]">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs tracking-tight">Order Management</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Track and fulfill customer top-up requests.</p>
              </div>
            </div>
          </header>

          <OrdersClient />
        </div>
      </main>
    </div>
  );
}
