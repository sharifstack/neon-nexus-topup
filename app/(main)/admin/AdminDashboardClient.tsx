"use client";

import useSWR from 'swr';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Package, 
  Search,
  Filter,
  MoreVertical,
  Download,
  Plus
} from 'lucide-react';
import RevenueChart from './components/RevenueChart';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboardClient() {
  const { data, error, isLoading } = useSWR('/api/admin/dashboard', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds for real-time feel
  });

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px] text-error">
      Failed to load dashboard data.
    </div>
  );

  if (isLoading) return (
    <div className="space-y-xl animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-surface-variant/20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-2 h-[400px] bg-surface-variant/20 rounded-xl" />
        <div className="h-[400px] bg-surface-variant/20 rounded-xl" />
      </div>
    </div>
  );

  const { stats, recentTransactions, topSelling, revenueTrends } = data;

  return (
    <div className="flex flex-col gap-xl">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+12.5% vs last week"
          icon={<TrendingUp className="w-5 h-5" />}
          color="primary"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders.toLocaleString()}
          change="+5% vs last week"
          icon={<ShoppingCart className="w-5 h-5" />}
          color="primary"
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers.toLocaleString()}
          change="Steady"
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders.toLocaleString()}
          change="Requires attention"
          icon={<Clock className="w-5 h-5" />}
          color="error"
          isWarning
        />
      </section>

      {/* Main Charts & Top Titles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:gap-lg">
        {/* Revenue Chart */}
        <section className="lg:col-span-2 glass-panel rounded-xl p-lg flex flex-col shadow-[0_0_20px_rgba(0,242,255,0.1)]">
          <div className="flex justify-between items-center mb-xl">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Revenue Trends</h3>
            <div className="flex gap-sm">
              <button className="px-sm py-xs text-label-sm font-label-sm bg-primary/20 text-primary rounded border border-primary/30">Last 7 Days</button>
            </div>
          </div>
          <RevenueChart data={revenueTrends} />
        </section>

        {/* Top Selling Titles */}
        <section className="glass-panel rounded-xl p-lg flex flex-col">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-lg">Top Titles</h3>
          <div className="flex flex-col gap-md flex-1">
            {topSelling.map((game: any, idx: number) => (
              <div key={idx} className="flex items-center gap-md p-sm rounded-lg hover:bg-surface-variant/30 transition-colors">
                <div className="w-12 h-12 rounded bg-surface border border-outline-variant/30 overflow-hidden shrink-0 flex items-center justify-center text-primary">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-label-md text-label-md text-on-surface">{game.name}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">{game.count} Sales</div>
                </div>
                <div className="font-body-md text-body-md font-semibold text-primary">${game.totalSales.toLocaleString()}</div>
              </div>
            ))}
            {topSelling.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant text-label-md">
                No sales data yet.
              </div>
            )}
            <button className="mt-auto w-full py-sm text-center font-label-md text-label-md text-primary hover:text-primary-container transition-colors">
              View All Inventory →
            </button>
          </div>
        </section>
      </div>

      {/* Recent Transactions Table */}
      <section className="glass-panel rounded-xl overflow-hidden flex flex-col mb-xl">
        <div className="p-lg flex justify-between items-center border-b border-outline-variant/20 bg-surface/50">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Recent Transactions</h3>
          <div className="flex items-center gap-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="bg-surface border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-label-md focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/20 border-b border-outline-variant/30 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="p-md font-medium">Order ID</th>
                <th className="p-md font-medium">Game Title</th>
                <th className="p-md font-medium">Customer</th>
                <th className="p-md font-medium">Amount</th>
                <th className="p-md font-medium">Status</th>
                <th className="p-md font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/10">
              {recentTransactions.map((order: any) => (
                <tr key={order._id} className="hover:bg-surface-variant/20 transition-colors group">
                  <td className="p-md font-mono text-sm text-on-surface-variant uppercase">#{order._id.slice(-6)}</td>
                  <td className="p-md flex items-center gap-sm">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-[12px]"><TrendingUp className="w-3 h-3" /></div>
                    {order.gameId?.name || 'Unknown Game'}
                  </td>
                  <td className="p-md">
                    <div className="font-label-md">{order.userId?.name || 'Unknown User'}</div>
                    <div className="text-[10px] text-on-surface-variant">{order.userId?.email}</div>
                  </td>
                  <td className="p-md font-semibold text-primary">${order.amount.toLocaleString()}</td>
                  <td className="p-md">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-md text-right">
                    <button className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-xl text-center text-on-surface-variant">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-md bg-surface/30 border-t border-outline-variant/20 flex justify-center">
          <button className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
            Load More <Clock className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, change, icon, color, isWarning }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-xl p-md flex flex-col gap-sm hover:scale-[1.02] transition-transform duration-300 hover:border-${color}/40 relative overflow-hidden group`}
    >
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${color}/10 rounded-full blur-xl group-hover:bg-${color}/20 transition-colors`}></div>
      <div className="flex justify-between items-start">
        <span className="font-label-md text-label-md text-on-surface-variant">{title}</span>
        <div className={`w-8 h-8 rounded-full bg-${color}/10 flex items-center justify-center text-${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="font-headline-lg text-headline-lg font-bold text-on-surface">{value}</div>
        <div className={`flex items-center gap-xs ${isWarning ? 'text-error' : 'text-tertiary'} mt-xs`}>
          <TrendingUp className={`w-4 h-4 ${isWarning ? 'rotate-180' : ''}`} />
          <span className="font-label-sm text-label-sm">{change}</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Completed': 'bg-tertiary/10 text-tertiary border-tertiary/20',
    'Pending': 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]',
    'Processing': 'bg-primary/10 text-primary border-primary/20',
    'Failed': 'bg-error/10 text-error border-error/20',
    'Refunded': 'bg-surface-variant/30 text-on-surface-variant border-outline-variant/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-label-sm font-semibold border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
}
