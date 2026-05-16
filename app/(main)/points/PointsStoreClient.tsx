"use client";

import { useState, useMemo } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  all:      { label: 'All Rewards', icon: '🏆', color: 'from-primary/30 to-primary/10' },
  uc:       { label: 'UC',          icon: '🔫', color: 'from-blue-500/30 to-blue-500/10' },
  diamonds: { label: 'Diamonds',    icon: '💎', color: 'from-cyan-400/30 to-cyan-400/10' },
  skins:    { label: 'Skins',       icon: '🎨', color: 'from-purple-500/30 to-purple-500/10' },
  passes:   { label: 'Passes',      icon: '🎟️', color: 'from-amber-500/30 to-amber-500/10' },
  vouchers: { label: 'Vouchers',    icon: '🎁', color: 'from-emerald-500/30 to-emerald-500/10' },
  coins:    { label: 'Coins',       icon: '🪙', color: 'from-yellow-500/30 to-yellow-500/10' },
};

const BADGE_COLORS: Record<string, string> = {
  HOT:     'bg-red-500 text-white',
  LIMITED: 'bg-amber-500 text-black',
  POPULAR: 'bg-primary text-black',
  NEW:     'bg-emerald-500 text-white',
  RARE:    'bg-purple-500 text-white',
  VALUE:   'bg-blue-500 text-white',
  CHANCE:  'bg-orange-500 text-white',
  STARTER: 'bg-gray-500 text-white',
};

function formatPts(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

// ── Rarity Config ────────────────────────────────────────────────────────────
const RARITY_CONFIG: Record<string, { bg: string; text: string; shadow: string; border: string }> = {
  LIMITED: { 
    bg: 'from-amber-600/20 to-amber-500/10', 
    text: 'text-amber-400', 
    shadow: 'shadow-amber-900/20',
    border: 'border-amber-500/30'
  },
  HOT: { 
    bg: 'from-rose-600/20 to-rose-500/10', 
    text: 'text-rose-400', 
    shadow: 'shadow-rose-900/20',
    border: 'border-rose-500/30'
  },
  POPULAR: { 
    bg: 'from-cyan-600/20 to-cyan-500/10', 
    text: 'text-cyan-400', 
    shadow: 'shadow-cyan-900/20',
    border: 'border-cyan-500/30'
  },
  RARE: { 
    bg: 'from-purple-600/20 to-purple-500/10', 
    text: 'text-purple-400', 
    shadow: 'shadow-purple-900/20',
    border: 'border-purple-500/30'
  },
  NEW: { 
    bg: 'from-emerald-600/20 to-emerald-500/10', 
    text: 'text-emerald-400', 
    shadow: 'shadow-emerald-900/20',
    border: 'border-emerald-500/30'
  },
  CHANCE: { 
    bg: 'from-indigo-600/20 to-indigo-500/10', 
    text: 'text-indigo-400', 
    shadow: 'shadow-indigo-900/20',
    border: 'border-indigo-500/30'
  },
  DEFAULT: { 
    bg: 'bg-white/5', 
    text: 'text-white/60', 
    shadow: 'shadow-transparent',
    border: 'border-white/10'
  },
};

// ── Reward Card ──────────────────────────────────────────────────────────────
function RewardCard({
  reward,
  userBalance,
  isLoggedIn,
  onRedeem,
  redeeming,
}: {
  reward: any;
  userBalance: number;
  isLoggedIn: boolean;
  onRedeem: (reward: any) => void;
  redeeming: string | null;
}) {
  const canAfford = isLoggedIn && userBalance >= reward.pointsCost;
  const isRedeeming = redeeming === reward._id;
  const cat = CATEGORY_META[reward.category] || CATEGORY_META.all;
  const rarity = RARITY_CONFIG[reward.badgeLabel] || RARITY_CONFIG.DEFAULT;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative h-full flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 group ${
        canAfford
          ? 'border-white/10 bg-[#0f111a] hover:border-primary/30 hover:shadow-2xl hover:shadow-black/50'
          : 'border-white/5 bg-[#0a0c12] opacity-70 grayscale-[0.2]'
      }`}
    >
      {/* Subtle Background Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Rarity Badge - More subtle */}
      {reward.badgeLabel && (
        <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full border ${rarity.border} ${rarity.bg} ${rarity.text} text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md`}>
          {reward.badgeLabel}
        </div>
      )}

      {/* Reward Icon Header - More compact */}
      <div className="relative aspect-[16/10] flex items-center justify-center overflow-hidden bg-white/[0.02] border-b border-white/5">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:16px_16px]" />
        
        <div className="relative z-10 w-20 h-20 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${cat.color} blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500`} />
          <span className="text-5xl z-10 select-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
            {cat.icon}
          </span>
        </div>

        {/* Category Tag - Subtler */}
        <div className="absolute bottom-3 left-4 z-10">
          <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
            {reward.category}
          </span>
        </div>
      </div>

      {/* Content Section - Tightened spacing */}
      <div className="flex flex-col flex-1 p-5 gap-3.5 relative z-10">
        <div className="space-y-1">
          {reward.game && (
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/50">
              {reward.game}
            </span>
          )}
          <h3 className="text-white font-bold text-lg leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
            {reward.title}
          </h3>
        </div>

        <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 opacity-50 group-hover:opacity-80 transition-opacity duration-300">
          {reward.description}
        </p>

        {/* Value & Cost - Integrated Section */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Redeem for</span>
              <span className="text-xs font-bold text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 w-fit">
                {reward.rewardValue}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Required</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500/80 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className={`text-xl font-black italic tracking-tighter ${canAfford ? 'text-amber-500/90' : 'text-on-surface-variant/30'}`}>
                  {formatPts(reward.pointsCost)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative group/btn">
            {!isLoggedIn ? (
              <a 
                href="/login" 
                className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold text-[10px] uppercase tracking-[0.15em] flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
              >
                Sign In to Unlock
              </a>
            ) : (
              <button
                onClick={() => onRedeem(reward)}
                disabled={!canAfford || isRedeeming}
                className={`w-full py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden ${
                  canAfford
                    ? 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black shadow-lg shadow-primary/5'
                    : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                }`}
              >
                {isRedeeming ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    Processing
                  </>
                ) : canAfford ? (
                  <>
                    <span className="material-symbols-outlined text-base">redeem</span>
                    Redeem Reward
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">lock</span>
                    Locked
                  </>
                )}
              </button>
            )}

            {isLoggedIn && !canAfford && (
              <div className="absolute -top-10 left-0 right-0 flex justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xl">
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">
                    Need {formatPts(reward.pointsCost - userBalance)} more
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({
  reward,
  balance,
  onConfirm,
  onClose,
  loading,
}: {
  reward: any;
  balance: number;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative bg-[#0d0d14]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,242,255,0.1)] z-10 w-full max-w-lg overflow-hidden"
      >
        {/* Header Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Confirm Redemption</h2>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Action Required</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-white/40 hover:text-white transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-10 space-y-8">
          {/* Main Info Card */}
          <div className="bg-[#1a1c2e]/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-black opacity-60">Reward Item</span>
              <span className="text-white font-black text-lg tracking-tight">{reward.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-black opacity-60">Redemption Value</span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest">
                {reward.rewardValue}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <span className="text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-black opacity-60">Points Cost</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="text-amber-400 font-black text-2xl tracking-tighter italic">{formatPts(reward.pointsCost)}</span>
              </div>
            </div>
          </div>

          {/* Balance After */}
          <div className="flex items-center justify-between px-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="text-on-surface-variant text-[11px] uppercase tracking-[0.2em] font-black opacity-60">Remaining Balance</span>
            <div className="flex items-center gap-2">
              <span className="text-white/40 font-black line-through text-sm">{formatPts(balance)}</span>
              <span className="material-symbols-outlined text-white/20 text-xs">arrow_forward</span>
              <span className="text-white font-black text-lg">{formatPts(balance - reward.pointsCost)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-5 rounded-[1.5rem] border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-5 rounded-[1.5rem] bg-gradient-to-r from-primary to-primary-container text-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_15px_40px_rgba(0,242,255,0.2)] hover:shadow-[0_20px_50px_rgba(0,242,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading
                ? <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span> Processing</>
                : <><span className="material-symbols-outlined text-xl">check_circle</span> Confirm</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── History Panel ────────────────────────────────────────────────────────────
function HistoryRow({ tx }: { tx: any }) {
  const isEarned = tx.type === 'earned';
  return (
    <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isEarned ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
          <span className={`material-symbols-outlined text-xl ${isEarned ? 'text-emerald-400' : 'text-amber-400'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {isEarned ? 'add_circle' : 'redeem'}
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-black leading-tight tracking-tight">{tx.description}</p>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">
            {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-black text-lg italic tracking-tighter ${isEarned ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isEarned ? '+' : '-'}{formatPts(tx.points)}
        </span>
        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">PTS</span>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function PointsStoreClient({ user }: { user: any }) {
  const [category, setCategory] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [confirmReward, setConfirmReward] = useState<any>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const rewardsUrl = `/api/points/rewards${category !== 'all' ? `?category=${category}` : ''}`;
  const { data: rewards, isLoading: rewardsLoading } = useSWR(rewardsUrl, fetcher, { refreshInterval: 60000 });
  const { data: historyData, mutate: mutateHistory } = useSWR(
    user ? '/api/points/history' : null, fetcher, { refreshInterval: 30000 }
  );

  const balance = historyData?.balance ?? user?.points ?? 0;
  const totalEarned = historyData?.totalEarned ?? user?.totalPointsEarned ?? 0;
  const history = historyData?.transactions ?? [];

  const handleRedeem = async () => {
    if (!confirmReward) return;
    setRedeeming(confirmReward._id);
    try {
      const res = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: confirmReward._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`🎉 Redeemed "${data.reward}" for ${formatPts(data.pointsSpent)} pts!`);
      setConfirmReward(null);
      mutateHistory();
      globalMutate(rewardsUrl);
    } catch (err: any) {
      toast.error(err.message || 'Redemption failed.');
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div className="flex-grow bg-[#0d1117] min-h-screen">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <span className="material-symbols-outlined text-amber-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Points Store</h1>
              </div>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
                Elevate your gaming experience. Earn points with every purchase and redeem them for exclusive in-game rewards, premium skins, seasonal passes, and more.
              </p>
            </div>

            {/* Balance Cards */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none bg-[#0d0d14]/80 backdrop-blur-md border border-amber-500/30 rounded-3xl px-6 py-4 flex flex-col items-center shadow-[0_0_40px_rgba(245,158,11,0.1)] relative overflow-hidden group min-w-[160px]">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-black text-amber-400/80 uppercase tracking-[0.3em] mb-2 z-10">Your Balance</span>
                <div className="flex items-center gap-2 z-10">
                  <span className="material-symbols-outlined text-amber-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="font-black text-3xl text-amber-400 tracking-tight">{formatPts(balance)}</span>
                </div>
              </div>

              <div className="flex-1 md:flex-none bg-[#0d0d14]/80 backdrop-blur-md border border-white/10 rounded-3xl px-6 py-4 flex flex-col items-center min-w-[160px] group">
                <span className="text-[10px] font-black text-on-surface-variant/80 uppercase tracking-[0.3em] mb-2">Total Earned</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                  <span className="font-black text-3xl text-white tracking-tight">{formatPts(totalEarned)}</span>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => setShowHistory(v => !v)}
                  className={`h-full md:h-[84px] w-full md:w-20 rounded-3xl border py-4 md:py-0 flex flex-row md:flex-col items-center justify-center transition-all duration-300 ${
                    showHistory 
                      ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,242,255,0.2)] text-primary' 
                      : 'bg-[#0d0d14]/80 border-white/10 text-on-surface-variant hover:border-white/30 hover:text-white backdrop-blur-md'
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] md:mb-1">History</span>
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </button>
              )}
            </div>
          </div>

          {/* How to earn info bar */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 bg-[#1a1c2e]/40 backdrop-blur-sm border border-white/5 rounded-[1.5rem] px-8 py-5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pr-4 border-r border-white/10 flex-shrink-0">
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Methods</span>
            </div>
            {[
              { icon: 'payments', label: '100৳ Purchase = 1,000 PTS', color: 'text-amber-400' },
              { icon: 'bolt', label: 'Instant Delivery', color: 'text-primary' },
              { icon: 'lock_open', label: 'Lifetime Validity', color: 'text-emerald-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">receipt_long</span>
                    Points History
                  </span>
                  <span className="text-on-surface-variant text-xs">{history.length} transactions</span>
                </div>
                <div className="px-5 max-h-64 overflow-y-auto no-scrollbar">
                  {history.length === 0 ? (
                    <div className="py-8 text-center text-on-surface-variant text-sm">
                      No transactions yet. Make a purchase to start earning!
                    </div>
                  ) : (
                    history.map((tx: any) => <HistoryRow key={tx._id} tx={tx} />)
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 mb-8">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest whitespace-nowrap transition-all duration-300 border-2 ${
                category === key
                  ? 'bg-primary text-black border-primary shadow-[0_10px_30px_rgba(0,242,255,0.3)] scale-105'
                  : 'bg-white/5 text-on-surface-variant border-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{meta.icon}</span>
              {meta.label}
            </button>
          ))}
        </div>

        {/* Login prompt */}
        {!user && (
          <div className="mb-6 flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-primary text-lg">info</span>
            <p className="text-sm text-on-surface-variant">
              <a href="/login" className="text-primary font-bold hover:underline">Log in</a> to redeem rewards and track your balance.
            </p>
          </div>
        )}

        {/* Grid Section */}
        {rewardsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[380px] bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse flex flex-col p-5 gap-4">
                <div className="aspect-[16/10] bg-white/5 rounded-2xl" />
                <div className="h-6 bg-white/5 rounded-full w-2/3" />
                <div className="h-3 bg-white/5 rounded-full w-full" />
                <div className="h-3 bg-white/5 rounded-full w-5/6" />
                <div className="mt-auto h-12 bg-white/5 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : !rewards || rewards.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-5 text-on-surface-variant">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-4xl opacity-40">🏷️</span>
            </div>
            <p className="text-sm font-bold tracking-widest opacity-40 uppercase">No rewards available yet</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {rewards.map((reward: any) => (
                <RewardCard
                  key={reward._id}
                  reward={reward}
                  userBalance={balance}
                  isLoggedIn={!!user}
                  onRedeem={setConfirmReward}
                  redeeming={redeeming}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmReward && (
          <ConfirmModal
            reward={confirmReward}
            balance={balance}
            onConfirm={handleRedeem}
            onClose={() => setConfirmReward(null)}
            loading={!!redeeming}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
