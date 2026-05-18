"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';
import { formatPrice } from '@/lib/currency';

const GATEWAYS = [
  { id: 'bkash',  name: 'bKash',  fee: 0.015, color: '#e2136e', activeBg: 'rgba(226, 19, 110, 0.08)', logo: '/bkash.png' },
  { id: 'nagad',  name: 'Nagad',  fee: 0.010, color: '#f37021', activeBg: 'rgba(243, 112, 33, 0.08)', logo: '/nagad.jpg' },
];

const CURRENCY_ICONS: Record<string, string> = {
  UC: 'monetization_on',
  Gems: 'diamond',
  Diamonds: 'diamond',
  Coins: 'toll',
  Credits: 'toll',
  Gold: 'stars',
};

export default function TopUpClient({ game }: { game: any }) {
  const [playerId, setPlayerId]         = useState('');
  const [zoneId, setZoneId]             = useState('');
  const [selectedPkg, setSelectedPkg]   = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState('bkash');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const router = useRouter();

  // Use priceCurrency from first package, or game-level priceCurrency, or fallback BDT
  const resolvedCurrency = (pkg: any) =>
    pkg?.priceCurrency || game.priceCurrency || 'BDT';

  const subtotal     = selectedPkg?.price ?? 0;
  const gateway      = GATEWAYS.find(g => g.id === selectedGateway)!;
  const fee          = subtotal * (gateway?.fee ?? 0);
  const total        = subtotal + fee;
  const displayCurrency = selectedPkg ? resolvedCurrency(selectedPkg) : (game.priceCurrency || 'BDT');

  const handleTransfer = async () => {
    if (!playerId.trim()) { setError('Please enter your Player ID'); return; }
    if (game.requiresZoneId && !zoneId.trim()) { setError('Please enter your Zone ID'); return; }
    if (!selectedPkg) { setError('Please select a package'); return; }

    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('amount', total.toFixed(2));
      fd.append('description', `${game.name} — ${selectedPkg.name} | Player: ${playerId}`);
      fd.append('gameId', game._id || game.id || '');
      fd.append('packageName', selectedPkg.name);
      fd.append('paymentMethod', selectedGateway);
      fd.append('gamePlayerId', playerId);
      if (zoneId) fd.append('gameZoneId', zoneId);
      
      const result = await processCheckout(fd);
      if (result.success) { router.push('/account'); }
      else { setError(result.error || 'Checkout failed'); }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-4 sm:px-gutter py-8 md:py-xxl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-xl">

      {/* ── LEFT COLUMN ───────────────────────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-5">

        {/* Banner Card */}
        <div className="rounded-2xl overflow-hidden relative group shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/5">
          <div className="aspect-video w-full bg-surface-container-high relative">
            <img
              alt={`${game.name} Banner`}
              className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              src={game.bannerImage || game.coverImage}
            />
            {/* gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050506]/60 to-transparent" />
            {/* title */}
            <div className="absolute bottom-0 left-0 p-5">
              <h1 className="font-black text-2xl md:text-3xl text-white uppercase tracking-tight drop-shadow-2xl leading-none">
                {game.name}
              </h1>
              <p className="text-primary text-sm font-semibold mt-1 tracking-wide">
                Instant {game.currency} Top-Up
              </p>
            </div>
            {/* neon glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_12px_rgba(0,242,255,0.8)]" />
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl bg-surface-container-high border border-white/5 p-5 shadow-lg">
          <h2 className="font-bold text-base text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">info</span>
            About This Game
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {game.description || `Get instant ${game.currency} delivered directly to your account. Neon Nexus guarantees fast, secure, and reliable top-ups.`}
          </p>
        </div>

        {/* How to Top Up */}
        <div className="rounded-2xl bg-surface-container-high border border-white/5 p-5 shadow-lg">
          <h2 className="font-bold text-base text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">help_outline</span>
            How to Top Up
          </h2>
          <ul className="space-y-3">
            {[
              `Enter your Player ID${game.requiresZoneId ? ' and Zone ID' : ''}.`,
              `Select your desired ${game.currency} package.`,
              'Choose your preferred payment method.',
              `Complete the transaction and receive ${game.currency} instantly!`,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-[11px] font-black">{i + 1}</span>
                </div>
                <span className="text-on-surface-variant text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Box */}
        <div className="rounded-2xl bg-surface-container-high border border-l-4 border-tertiary/40 border-l-tertiary p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-tertiary text-2xl">support_agent</span>
            <h3 className="font-bold text-white">24/7 Support</h3>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed mb-3">
            Having trouble with your top-up? Our elite support squad is standing by.
          </p>
          <button className="text-tertiary text-xs font-semibold hover:underline flex items-center gap-1">
            Contact Support <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT COLUMN ──────────────────────────────── */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 shadow-sm">
              <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <p className="text-white font-bold text-sm">{game.name}</p>
              <p className="text-on-surface-variant text-[11px] font-medium">Secure Checkout</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-[14px]">lock</span>
              <span className="text-emerald-400 text-[11px] font-bold tracking-wide">SECURED</span>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-8">

            {/* ── Step 1: Player Identity ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">1</div>
                <h2 className="text-white font-semibold text-base">Player Identity</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">badge</span>
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder:text-on-surface-variant/70"
                    placeholder="Enter Player ID"
                    value={playerId}
                    onChange={e => setPlayerId(e.target.value)}
                    type="text"
                  />
                </div>
                {game.requiresZoneId && (
                  <div className="relative sm:w-40">
                    <input
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder:text-on-surface-variant/70"
                      placeholder="Zone ID"
                      value={zoneId}
                      onChange={e => setZoneId(e.target.value)}
                      type="text"
                    />
                  </div>
                )}
              </div>
              <p className="text-[12px] text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Tap your avatar in-game to find your Player ID.
              </p>
            </div>

            {/* ── Step 2: Select Payload ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">2</div>
                <h2 className="text-white font-semibold text-base">Select Payload</h2>
              </div>
              {game.packages?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {game.packages.map((pkg: any) => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`relative rounded-xl p-4 text-left transition-all duration-200 border ${
                          isSelected
                            ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_4px_20px_rgba(6,182,212,0.1)]'
                            : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/40'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute top-0 right-0 bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl tracking-wide">
                            POPULAR
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`material-symbols-outlined text-xl transition-colors ${isSelected ? 'text-cyan-400' : 'text-on-surface-variant'}`}>
                            {CURRENCY_ICONS[game.currency] || 'monetization_on'}
                          </span>
                          <span className="text-white font-bold text-sm">{pkg.name}</span>
                        </div>
                        {pkg.bonus && (
                          <div className="text-emerald-400 text-[11px] font-medium mb-1">+ {pkg.bonus}</div>
                        )}
                        <div className={`text-sm font-semibold mt-2 ${isSelected ? 'text-cyan-400' : 'text-on-surface-variant'}`}>
                          {formatPrice(pkg.price, resolvedCurrency(pkg))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-on-surface-variant text-sm border border-white/5 rounded-xl bg-black/20">
                  No packages available for this game yet.
                </div>
              )}
            </div>

            {/* ── Step 3: Payment Gateway ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">3</div>
                <h2 className="text-white font-semibold text-base">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GATEWAYS.map(g => {
                  const isActive = selectedGateway === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGateway(g.id)}
                      className={`relative flex items-center p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? `shadow-[0_4px_20px_rgba(0,0,0,0.2)]`
                          : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/40'
                      }`}
                      style={{
                        borderColor: isActive ? g.color : '',
                        backgroundColor: isActive ? g.activeBg : ''
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 overflow-hidden" style={{ backgroundColor: `${g.color}20` }}>
                        {g.logo ? (
                          <img src={g.logo} alt={g.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-lg" style={{ color: g.color }}>{g.name[0]}</span>
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-sm text-white">{g.name}</span>
                        {g.fee > 0 ? (
                          <span className="text-[11px] text-on-surface-variant">{(g.fee * 100).toFixed(1)}% processing fee</span>
                        ) : (
                          <span className="text-[11px] text-emerald-400">No processing fee</span>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="absolute top-4 right-4">
                          <span className="material-symbols-outlined text-[18px]" style={{ color: g.color }}>check_circle</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Summary & Checkout ── */}
            <div className="pt-6 border-t border-white/5 space-y-6">
              
              <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Selected Package</span>
                  <span className="text-white font-semibold">{selectedPkg ? selectedPkg.name : '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Gateway Fee ({gateway?.name})</span>
                  <span className="text-white font-semibold">{formatPrice(fee, displayCurrency)}</span>
                </div>
                <div className="h-px w-full bg-white/5 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Total Payable</span>
                  <span className="text-cyan-400 font-bold text-xl">
                    {formatPrice(total, displayCurrency)}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}

              {/* ── Initiate Transfer ── */}
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(8,145,178,0.3)] hover:shadow-[0_4px_25px_rgba(8,145,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">lock</span>
                    Pay Securely
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-8 pt-2">
                {[
                  { icon: 'shield_lock', label: 'SSL Encrypted' },
                  { icon: 'bolt', label: 'Instant Delivery' },
                  { icon: 'verified', label: '100% Secure' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5 text-on-surface-variant/80">
                    <span className="material-symbols-outlined text-[20px]">{b.icon}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider">{b.label}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
