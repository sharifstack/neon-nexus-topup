"use client";

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { formatPrice } from '@/lib/currency';
import {
  Search, Shield, ShieldOff, Ban, UserCheck, ChevronDown,
  Clock, Activity, ShoppingBag, AlertTriangle, X, Check, Loader2,
  Globe, Calendar, Filter, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const SUSPENSION_OPTIONS = [
  { label: '1 Day',   days: 1 },
  { label: '3 Days',  days: 3 },
  { label: '7 Days',  days: 7 },
  { label: '21 Days', days: 21 },
  { label: '30 Days', days: 30 },
  { label: '1 Year',  days: 365 },
];

function timeAgo(date?: string | Date | null): string {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Active now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function suspensionCountdown(until?: string | Date | null): string {
  if (!until) return '';
  const ms = new Date(until).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days === 1) return '< 1 day left';
  return `${days} days left`;
}

function StatusBadge({ status, suspendedUntil }: { status: string; suspendedUntil?: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    active:    { cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Active' },
    suspended: { cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',     label: 'Suspended' },
    banned:    { cls: 'bg-red-500/15 text-red-400 border-red-500/30',           label: 'Banned' },
  };
  const c = cfg[status] ?? cfg.active;
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${c.cls}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {c.label}
      </span>
      {status === 'suspended' && suspendedUntil && (
        <span className="text-[9px] text-amber-400/70 ml-2">{suspensionCountdown(suspendedUntil)}</span>
      )}
    </div>
  );
}

function OnlineDot({ isOnline, lastSeen }: { isOnline?: boolean; lastSeen?: string }) {
  const ago = timeAgo(lastSeen);
  const active = isOnline || ago === 'Active now';
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-gray-600'}`} />
      <span className={`text-[10px] ${active ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
        {active ? 'Online' : ago}
      </span>
    </div>
  );
}

// ── Moderation Modal ────────────────────────────────────────────────────────
function ModerationModal({
  user, action, onClose, onConfirm, loading
}: {
  user: any;
  action: 'suspend' | 'ban' | 'activate';
  onClose: () => void;
  onConfirm: (opts: { durationDays?: number; reason: string; note: string }) => void;
  loading: boolean;
}) {
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  const config = {
    suspend:  { title: 'Suspend User',        accentBorder: 'border-amber-500/50',   accentText: 'text-amber-400',   headerBg: 'bg-amber-500/10',   icon: <Shield   className="w-5 h-5" /> },
    ban:      { title: 'Permanently Ban User', accentBorder: 'border-red-500/50',     accentText: 'text-red-400',     headerBg: 'bg-red-500/10',     icon: <Ban      className="w-5 h-5" /> },
    activate: { title: 'Restore User Access', accentBorder: 'border-emerald-500/50', accentText: 'text-emerald-400', headerBg: 'bg-emerald-500/10', icon: <UserCheck className="w-5 h-5" /> },
  };
  const c = config[action];

  const btnConfirmCls = {
    suspend:  'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30',
    ban:      'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30',
    activate: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative bg-[#0d0d14] border ${c.accentBorder} rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] z-10 w-full max-w-[500px] flex flex-col overflow-hidden`}
        style={{ minWidth: '320px' }}
      >
        {/* Header */}
        <div className={`${c.headerBg} border-b ${c.accentBorder} px-6 py-4 flex items-center justify-between`}>
          <div className={`flex items-center gap-3 ${c.accentText}`}>
            {c.icon}
            <span className="font-black text-sm tracking-widest uppercase">{c.title}</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* User Preview */}
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="relative flex-shrink-0">
              <img src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user._id}`}
                className="w-12 h-12 rounded-full border-2 border-white/10" alt="" />
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0d0d14] ${user.isOnline ? 'bg-emerald-500' : 'bg-white/20'}`} />
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold truncate">{user.name}</div>
              <div className="text-on-surface-variant text-xs truncate">{user.email}</div>
              <div className="mt-1">
                <StatusBadge status={user.status || 'active'} suspendedUntil={user.suspendedUntil} />
              </div>
            </div>
          </div>

          {/* Suspend Duration */}
          {action === 'suspend' && (
            <div className="space-y-3">
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Suspension Duration</div>
              <div className="grid grid-cols-2 gap-2">
                {SUSPENSION_OPTIONS.map(opt => (
                  <button key={opt.days} onClick={() => setDays(opt.days)}
                    className={`py-3 px-4 rounded-xl text-xs font-black border transition-all flex items-center justify-between group ${
                      days === opt.days 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'bg-white/[0.02] border-white/5 text-on-surface-variant hover:border-white/20 hover:text-white'
                    }`}>
                    <span className="uppercase">{opt.label}</span>
                    {days === opt.days && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reason */}
          {action !== 'activate' && (
            <div className="space-y-2">
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                Reason <span className="text-red-500">*</span>
              </div>
              <input 
                type="text" 
                value={reason} 
                onChange={e => setReason(e.target.value)}
                placeholder={action === 'ban' ? 'Reason for permanent ban...' : 'Reason for suspension...'}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all placeholder:text-white/20"
              />
            </div>
          )}

          {/* Admin Note */}
          <div className="space-y-2">
            <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Admin Note (Internal)</div>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)}
              placeholder="Internal moderation notes..."
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none transition-all resize-none placeholder:text-white/20"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 font-black text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
              Cancel
            </button>
            <button 
              disabled={loading || (action !== 'activate' && !reason.trim())}
              onClick={() => onConfirm({ durationDays: days, reason, note })}
              className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${btnConfirmCls[action]}`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : c.icon}
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── User Row ────────────────────────────────────────────────────────────────
function UserRow({ user, onAction }: { user: any; onAction: (u: any, a: 'suspend' | 'ban' | 'activate') => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.tr
      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group relative"
    >
      {/* Avatar + Name */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user._id}`}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
              alt={user.name}
            />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0f] ${
              user.isOnline ? 'bg-emerald-400' : 'bg-gray-600'
            }`} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{user.name}</p>
            <p className="text-on-surface-variant text-[11px]">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
          user.role === 'admin'
            ? 'bg-primary/15 text-primary border-primary/30'
            : 'bg-white/5 text-on-surface-variant border-white/10'
        }`}>
          {user.role}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={user.status || 'active'} suspendedUntil={user.suspendedUntil} />
      </td>

      {/* Activity */}
      <td className="px-4 py-4">
        <OnlineDot isOnline={user.isOnline} lastSeen={user.lastSeen} />
        {user.country && (
          <div className="flex items-center gap-1 mt-1">
            <Globe className="w-2.5 h-2.5 text-on-surface-variant" />
            <span className="text-[10px] text-on-surface-variant">{user.country}</span>
          </div>
        )}
      </td>

      {/* Purchases */}
      <td className="px-4 py-4">
        <div className="text-primary font-black text-sm">{formatPrice(user.totalSpent || 0, 'BDT')}</div>
        <div className="text-on-surface-variant text-[10px]">{user.totalOrders || 0} orders</div>
        {user.latestOrder && (
          <div className="text-[10px] text-on-surface-variant mt-0.5 max-w-[120px] truncate" title={user.latestOrder.gameName}>
            ↳ {user.latestOrder.gameName}
          </div>
        )}
      </td>

      {/* Joined */}
      <td className="px-4 py-4">
        <div className="text-on-surface-variant text-xs">
          {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
        </div>
        {user.latestOrder && (
          <div className="text-[10px] text-on-surface-variant/60 mt-0.5">
            Last buy: {timeAgo(user.latestOrder.date)}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <div className="relative inline-block">
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface-variant hover:text-white transition-all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-10 z-50 bg-[#0d0d14] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
                >
                  {(user.status === 'suspended' || user.status === 'banned') && (
                    <button
                      onClick={() => { setMenuOpen(false); onAction(user, 'activate'); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" /> Restore Access
                    </button>
                  )}
                  {user.status !== 'suspended' && user.status !== 'banned' && (
                    <button
                      onClick={() => { setMenuOpen(false); onAction(user, 'suspend'); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      <Shield className="w-4 h-4" /> Suspend
                    </button>
                  )}
                  {user.status !== 'banned' && (
                    <button
                      onClick={() => { setMenuOpen(false); onAction(user, 'ban'); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Ban className="w-4 h-4" /> Permanent Ban
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function UsersClient() {
  const { data: users, mutate, isLoading } = useSWR('/api/admin/users', fetcher, {
    refreshInterval: 30000,
  });

  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState('all');
  const [roleFilter, setRole]         = useState('all');
  const [sortBy, setSortBy]           = useState<'created' | 'spent' | 'orders'>('created');
  const [page, setPage]               = useState(1);
  const [modalUser, setModalUser]     = useState<any>(null);
  const [modalAction, setModalAction] = useState<'suspend' | 'ban' | 'activate'>('suspend');
  const [modLoading, setModLoading]   = useState(false);

  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    if (!users) return [];
    return users
      .filter((u: any) => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
        const matchRole   = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchStatus && matchRole;
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'spent')  return (b.totalSpent  || 0) - (a.totalSpent  || 0);
        if (sortBy === 'orders') return (b.totalOrders || 0) - (a.totalOrders || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [users, search, statusFilter, roleFilter, sortBy]);

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  // Summary stats
  const stats = useMemo(() => {
    if (!users) return { total: 0, active: 0, suspended: 0, banned: 0, revenue: 0 };
    return {
      total:     users.length,
      active:    users.filter((u: any) => (u.status || 'active') === 'active').length,
      suspended: users.filter((u: any) => u.status === 'suspended').length,
      banned:    users.filter((u: any) => u.status === 'banned').length,
      revenue:   users.reduce((s: number, u: any) => s + (u.totalSpent || 0), 0),
    };
  }, [users]);

  const openModal = (user: any, action: typeof modalAction) => {
    setModalUser(user);
    setModalAction(action);
  };

  const handleModerate = async ({ durationDays, reason, note }: { durationDays?: number; reason: string; note: string }) => {
    if (!modalUser) return;
    setModLoading(true);
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: modalUser._id, action: modalAction, durationDays, reason, note }),
      });
      mutate();
      setModalUser(null);
    } finally {
      setModLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl">

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-md">
        {[
          { label: 'Total Users',   value: stats.total,      icon: '👥', color: 'text-white' },
          { label: 'Active',        value: stats.active,     icon: '✅', color: 'text-emerald-400' },
          { label: 'Suspended',     value: stats.suspended,  icon: '⏸',  color: 'text-amber-400' },
          { label: 'Banned',        value: stats.banned,     icon: '🚫', color: 'text-red-400' },
          { label: 'Total Revenue', value: formatPrice(stats.revenue, 'BDT'), icon: '💰', color: 'text-primary', isStr: true },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-2xl p-4 border border-white/5">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`font-black text-xl ${s.color}`}>{s.isStr ? s.value : s.value}</div>
            <div className="text-on-surface-variant text-[11px] uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-md justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-md w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or email..."
              className="w-full bg-surface-variant/20 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="flex bg-surface-variant/20 p-1 rounded-xl border border-outline-variant/10 overflow-x-auto no-scrollbar gap-1">
            {['all','active','suspended','banned'].map(s => (
              <button key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-all ${
                  statusFilter === s ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-md items-center">
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={e => setRole(e.target.value)}
            className="bg-surface-variant/20 border border-outline-variant/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-surface-variant/20 border border-outline-variant/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="created">Newest First</option>
            <option value="spent">Most Spent</option>
            <option value="orders">Most Orders</option>
          </select>

          <button onClick={() => mutate()} className="p-2.5 bg-surface-variant/20 border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-all">
            <RefreshCcw className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5 text-on-surface-variant text-[10px] font-black uppercase tracking-widest">
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Activity</th>
                <th className="px-4 py-3.5">Purchases</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : paginated.map((user: any) => (
                      <UserRow key={user._id} user={user} onAction={openModal} />
                    ))
                }
              </AnimatePresence>
            </tbody>
          </table>

          {!isLoading && filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-on-surface-variant gap-3">
              <Search className="w-10 h-10 opacity-20" />
              <p className="text-sm">No users match your filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-on-surface-variant text-xs">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1 ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Moderation Modal */}
      <AnimatePresence>
        {modalUser && (
          <ModerationModal
            user={modalUser}
            action={modalAction}
            onClose={() => setModalUser(null)}
            onConfirm={handleModerate}
            loading={modLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
