"use client";

import useSWR from 'swr';
import { 
  Users, ShoppingCart, TrendingUp, Clock, Package, 
  Search, Filter, MoreVertical, CreditCard, Activity, Star, Zap, AlertCircle
} from 'lucide-react';
import RevenueChart from '../components/RevenueChart';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnalyticsClient() {
  const [range, setRange] = useState('7d');

  const { data: overview, isLoading: loadingOverview } = useSWR('/api/admin/analytics/overview', fetcher, { refreshInterval: 60000 });
  const { data: revenue, isLoading: loadingRevenue } = useSWR(`/api/admin/analytics/revenue?range=${range}`, fetcher, { refreshInterval: 60000 });
  const { data: orders, isLoading: loadingOrders } = useSWR('/api/admin/analytics/orders', fetcher, { refreshInterval: 60000 });
  const { data: users, isLoading: loadingUsers } = useSWR('/api/admin/analytics/users', fetcher, { refreshInterval: 60000 });
  const { data: payments, isLoading: loadingPayments } = useSWR('/api/admin/analytics/payments', fetcher, { refreshInterval: 60000 });

  const isLoading = loadingOverview || loadingRevenue || loadingOrders || loadingUsers || loadingPayments;

  if (isLoading) {
    return (
      <div className="space-y-xl animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface-variant/20 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          <div className="lg:col-span-2 h-[400px] bg-surface-variant/20 rounded-xl" />
          <div className="h-[400px] bg-surface-variant/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Overview Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard 
          title="Total Revenue" 
          value={`$${overview?.revenue?.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
          change={`${overview?.revenue?.growth > 0 ? '+' : ''}${overview?.revenue?.growth.toFixed(1)}% vs previous`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="primary"
          isWarning={overview?.revenue?.growth < 0}
        />
        <StatCard 
          title="Total Orders" 
          value={(overview?.orders?.total || 0).toLocaleString()}
          change={`${overview?.orders?.growth > 0 ? '+' : ''}${overview?.orders?.growth.toFixed(1)}% vs previous`}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="primary"
          isWarning={overview?.orders?.growth < 0}
        />
        <StatCard 
          title="Active Users" 
          value={(overview?.activeUsers || 0).toLocaleString()}
          change="Last 7 Days"
          icon={<Users className="w-5 h-5" />}
          color="secondary"
        />
        <StatCard 
          title="Pending Orders" 
          value={(overview?.pendingOrders || 0).toLocaleString()}
          change={overview?.pendingOrders > 0 ? 'Requires attention' : 'All caught up'}
          icon={<Clock className="w-5 h-5" />}
          color={overview?.pendingOrders > 0 ? 'error' : 'tertiary'}
          isWarning={overview?.pendingOrders > 0}
        />
      </section>

      {/* Main Charts & Top Titles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:gap-lg">
        {/* Revenue Chart */}
        <section className="lg:col-span-2 glass-panel rounded-xl p-md lg:p-lg flex flex-col shadow-[0_0_20px_rgba(0,242,255,0.05)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Revenue Trends</h3>
            <div className="flex gap-xs bg-surface-variant/30 p-1 rounded-lg">
              {['7d', '30d', '12m'].map(r => (
                <button 
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-sm py-1 rounded text-label-sm font-label-sm transition-all ${range === r ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '12 Months'}
                </button>
              ))}
            </div>
          </div>
          {revenue?.trends ? (
            <RevenueChart data={revenue.trends} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">No data available</div>
          )}
        </section>

        {/* Top Selling Titles */}
        <section className="glass-panel rounded-xl p-md lg:p-lg flex flex-col">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-lg">Top Selling Games</h3>
          <div className="flex flex-col gap-sm flex-1">
            {orders?.topSelling?.map((game: any, idx: number) => (
              <div key={idx} className="flex items-center gap-md p-sm rounded-lg hover:bg-surface-variant/30 transition-colors border border-transparent hover:border-outline-variant/20">
                <div className="w-10 h-10 rounded-lg bg-surface border border-outline-variant/30 overflow-hidden shrink-0 flex items-center justify-center text-primary relative">
                  {game.image ? (
                    <img src={game.image} alt={game.name} className="object-cover w-full h-full" />
                  ) : (
                    <Package className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-label-md text-label-md text-on-surface truncate">{game.name}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant truncate">{game.orderCount} Orders</div>
                </div>
                <div className="font-body-md text-body-md font-bold text-primary">${game.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            ))}
            {(!orders?.topSelling || orders.topSelling.length === 0) && (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant text-label-md">
                No sales data yet.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Analytics Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:gap-lg">
        {/* Payment Gateways */}
        <section className="glass-panel rounded-xl p-md lg:p-lg flex flex-col">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-lg">Payment Methods</h3>
          <div className="flex flex-col gap-sm">
            {payments?.payments?.map((payment: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-xs p-sm bg-surface-container/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface capitalize">{payment.method}</span>
                  <span className="font-label-md text-label-md text-primary font-bold">${payment.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="flex-1 h-2 bg-surface-variant/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.max(1, payment.usagePercentage)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-on-surface-variant w-8 text-right">{payment.usagePercentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Activity Widgets */}
        <section className="glass-panel rounded-xl p-md lg:p-lg flex flex-col">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-lg flex items-center gap-xs">
            <Activity className="w-5 h-5 text-secondary" />
            Live Activity
          </h3>
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-surface-container/40 p-md rounded-lg flex flex-col gap-xs border border-outline-variant/10">
              <span className="text-label-sm text-on-surface-variant">Online Users</span>
              <div className="flex items-center gap-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-headline-sm font-bold text-on-surface">{overview?.live?.onlineUsers || 0}</span>
              </div>
            </div>
            <div className="bg-surface-container/40 p-md rounded-lg flex flex-col gap-xs border border-outline-variant/10">
              <span className="text-label-sm text-on-surface-variant">Active Deals</span>
              <div className="flex items-center gap-sm text-tertiary">
                <Zap className="w-4 h-4" />
                <span className="text-headline-sm font-bold">{overview?.live?.activeFlashDeals || 0}</span>
              </div>
            </div>
            <div className="bg-surface-container/40 p-md rounded-lg flex flex-col gap-xs border border-outline-variant/10">
              <span className="text-label-sm text-on-surface-variant">Low Stock</span>
              <div className="flex items-center gap-sm text-error">
                <AlertCircle className="w-4 h-4" />
                <span className="text-headline-sm font-bold">{overview?.live?.lowStockGames || 0}</span>
              </div>
            </div>
            <div className="bg-surface-container/40 p-md rounded-lg flex flex-col gap-xs border border-outline-variant/10">
              <span className="text-label-sm text-on-surface-variant">Failed Payments</span>
              <div className="flex items-center gap-sm text-on-surface">
                <CreditCard className="w-4 h-4 text-error" />
                <span className="text-headline-sm font-bold">{overview?.live?.failedPaymentsToday || 0}</span>
              </div>
            </div>
          </div>
        </section>

        {/* User Insights */}
        <section className="glass-panel rounded-xl p-md lg:p-lg flex flex-col">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-lg">User Insights</h3>
          <div className="flex flex-col gap-md">
            <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg">
              <span className="text-label-md text-on-surface-variant">New Registrations (30d)</span>
              <span className="text-label-lg font-bold text-on-surface">+{users?.newRegistrations || 0}</span>
            </div>
            <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg">
              <span className="text-label-md text-on-surface-variant">Returning Users (30d)</span>
              <span className="text-label-lg font-bold text-primary">{users?.returningUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg">
              <span className="text-label-md text-on-surface-variant">Points Distributed</span>
              <span className="text-label-lg font-bold text-tertiary flex items-center gap-xs">
                <Star className="w-3 h-3" />
                {(overview?.pointsDistributed || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg">
              <span className="text-label-md text-on-surface-variant">Conversion Rate</span>
              <span className="text-label-lg font-bold text-secondary">
                {(overview?.conversionRate || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Transactions Table */}
      <section className="glass-panel rounded-xl overflow-hidden flex flex-col mb-xl">
        <div className="p-md lg:p-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 bg-surface/50">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Recent Transactions</h3>
          <div className="flex items-center gap-md w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="w-full sm:w-64 bg-surface border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-label-md focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-variant/20 border-b border-outline-variant/30 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="p-md font-medium">Order ID</th>
                <th className="p-md font-medium">Game Title</th>
                <th className="p-md font-medium">Customer</th>
                <th className="p-md font-medium">Amount</th>
                <th className="p-md font-medium">Status</th>
                <th className="p-md font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/10">
              {orders?.recentTransactions?.map((order: any) => (
                <tr key={order._id} className="hover:bg-surface-variant/20 transition-colors group">
                  <td className="p-md font-mono text-[11px] text-on-surface-variant uppercase">
                    {order.transactionId || `#${order._id.slice(-8)}`}
                  </td>
                  <td className="p-md flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-surface-container shrink-0 border border-outline-variant/20 flex items-center justify-center">
                      {order.gameId?.iconImage || order.gameId?.coverImage ? (
                        <img src={order.gameId.iconImage || order.gameId.coverImage} alt={order.gameId.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md font-bold">{order.gameId?.name || 'Deleted Game'}</span>
                      <span className="text-[10px] text-on-surface-variant truncate max-w-[200px]">{order.packageName}</span>
                    </div>
                  </td>
                  <td className="p-md">
                    <div className="font-label-md">{order.userId?.name || 'Unknown User'}</div>
                    <div className="text-[10px] text-on-surface-variant">{order.userId?.email}</div>
                  </td>
                  <td className="p-md font-bold text-primary">
                    ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-md">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-md text-right text-xs text-on-surface-variant">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {(!orders?.recentTransactions || orders.recentTransactions.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-xl text-center text-on-surface-variant">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
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
      className={`glass-panel rounded-xl p-md lg:p-lg flex flex-col gap-sm hover:scale-[1.02] transition-transform duration-300 hover:border-${color}/40 relative overflow-hidden group border border-outline-variant/10`}
    >
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${color}/10 rounded-full blur-xl group-hover:bg-${color}/20 transition-colors`}></div>
      <div className="flex justify-between items-start">
        <span className="font-label-md text-label-md text-on-surface-variant">{title}</span>
        <div className={`w-10 h-10 rounded-full bg-${color}/10 flex items-center justify-center text-${color} border border-${color}/20`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="font-headline-lg text-headline-lg font-bold text-on-surface truncate">{value}</div>
        <div className={`flex items-center gap-xs ${isWarning ? 'text-error' : `text-${color}`} mt-xs`}>
          {isWarning ? <TrendingUp className="w-3 h-3 rotate-180" /> : <TrendingUp className="w-3 h-3" />}
          <span className="font-label-sm text-[11px] truncate">{change}</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
    'Pending': 'bg-primary/10 text-primary border-primary/20',
    'Processing': 'bg-primary/10 text-primary border-primary/20',
    'Failed': 'bg-error/10 text-error border-error/20',
    'Refunded': 'bg-surface-variant/30 text-on-surface-variant border-outline-variant/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
}
