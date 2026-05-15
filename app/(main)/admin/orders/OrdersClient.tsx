"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  RefreshCcw,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/currency';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrdersClient() {
  const { data: orders, mutate, isLoading } = useSWR('/api/admin/orders', fetcher, {
    refreshInterval: 10000 // Poll every 10s for new orders
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.gameId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      if (res.ok) mutate();
    } catch (err) {
      console.error('Failed to update order status');
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Game, or Customer..." 
            className="bg-surface border border-outline-variant/30 rounded-full pl-10 pr-4 py-3 text-label-md w-full focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-sm bg-surface-variant/20 p-1 rounded-xl border border-outline-variant/10">
          {['All', 'Pending', 'Processing', 'Completed', 'Failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-label-sm font-label-sm transition-all ${
                statusFilter === status 
                  ? 'bg-primary text-on-primary shadow-lg glow-primary' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 border-b border-outline-variant/20 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
                <th className="p-lg font-medium">Timestamp</th>
                <th className="p-lg font-medium">Order ID</th>
                <th className="p-lg font-medium">Product / Customer</th>
                <th className="p-lg font-medium">Amount</th>
                <th className="p-lg font-medium">Status</th>
                <th className="p-lg font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <AnimatePresence mode='popLayout'>
                {filteredOrders?.map((order: any) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={order._id} 
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="p-lg">
                      <div className="font-label-md text-on-surface">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-lg font-mono text-sm text-primary font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-lg">
                      <div className="flex items-center gap-sm mb-xs">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary"><ArrowUpRight className="w-3 h-3" /></div>
                        <span className="font-label-md text-on-surface font-semibold">{order.gameId?.name || 'Deleted Product'}</span>
                      </div>
                      <div className="flex items-center gap-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/30"></span>
                        <span className="text-xs text-on-surface-variant">{order.userId?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="p-lg">
                      <div className="font-body-md font-bold text-primary">{formatPrice(order.amount, order.currency || 'BDT')}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase">{order.paymentMethod || 'Unknown'}</div>
                    </td>
                    <td className="p-lg">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-lg text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'Completed')}
                            className="p-2 bg-tertiary/10 text-tertiary hover:bg-tertiary/20 rounded-lg border border-tertiary/20 transition-all hover:scale-110"
                            title="Complete Order"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-surface-variant/30 text-on-surface-variant hover:text-primary rounded-lg border border-outline-variant/10 transition-all hover:scale-110">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {isLoading && (
            <div className="p-xl flex justify-center items-center gap-md text-primary animate-pulse">
              <RefreshCcw className="w-6 h-6 animate-spin" />
              <span className="font-label-md">Syncing orders...</span>
            </div>
          )}

          {!isLoading && filteredOrders?.length === 0 && (
            <div className="p-xxl flex flex-col items-center justify-center gap-md text-on-surface-variant">
              <Clock className="w-16 h-16 opacity-20" />
              <p className="font-label-md">No orders found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Completed': 'bg-tertiary/10 text-tertiary border-tertiary/20 shadow-[0_0_10px_rgba(72,207,203,0.2)]',
    'Pending': 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(0,242,255,0.2)] animate-pulse',
    'Processing': 'bg-primary/10 text-primary border-primary/20',
    'Failed': 'bg-error/10 text-error border-error/20',
  };

  return (
    <span className={`inline-flex items-center gap-xs px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${styles[status] || styles['Pending']}`}>
      <span className="w-1 h-1 rounded-full bg-current"></span>
      {status}
    </span>
  );
}
