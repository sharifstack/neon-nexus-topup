"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';
import { formatPrice } from '@/lib/currency';

const GATEWAYS = [
  { id: 'bkash',  name: 'bKash',  fee: 0.015, icon: '🟣' },
  { id: 'nagad',  name: 'Nagad',  fee: 0.010, icon: '🟠' },
  { id: 'visa',   name: 'Visa',   fee: 0.025, icon: '💳' },
  { id: 'paypal', name: 'PayPal', fee: 0.030, icon: '🔵' },
  { id: 'crypto', name: 'Crypto', fee: 0.000, icon: '🟡' },
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
        <div className="rounded-2xl bg-surface-container-high border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{game.name}</p>
              <p className="text-on-surface-variant text-[11px]">Secure Checkout · Neon Nexus</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1">
              <span className="material-symbols-outlined text-primary text-sm">lock</span>
              <span className="text-primary text-[11px] font-bold">SECURED</span>
            </div>
          </div>

          <div className="p-6 space-y-8">

            {/* ── Step 1: Player Identity ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(0,242,255,0.5)]">1</div>
                <h2 className="text-white font-bold text-base tracking-tight">Player Identity</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">badge</span>
                  <input
                    className="w-full bg-[#0a0a0f] border border-outline-variant/40 rounded-xl py-3 pl-11 pr-4 text-on-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant/60"
                    placeholder="Enter Player ID"
                    value={playerId}
                    onChange={e => setPlayerId(e.target.value)}
                    type="text"
                  />
                </div>
                {game.requiresZoneId && (
                  <div className="relative sm:w-36">
                    <input
                      className="w-full bg-[#0a0a0f] border border-outline-variant/40 rounded-xl py-3 px-4 text-on-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant/60"
                      placeholder="Zone ID"
                      value={zoneId}
                      onChange={e => setZoneId(e.target.value)}
                      type="text"
                    />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-outline mt-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px]">info</span>
                Tap your avatar in-game to find your Player ID.
              </p>
            </div>

            {/* ── Step 2: Select Payload ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(0,242,255,0.5)]">2</div>
                <h2 className="text-white font-bold text-base tracking-tight">Select Payload</h2>
              </div>
              {game.packages?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {game.packages.map((pkg: any) => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`relative rounded-xl p-4 text-center transition-all duration-200 border overflow-hidden group ${
                          isSelected
                            ? 'border-primary bg-primary/10 scale-[1.03] shadow-[0_0_20px_rgba(0,242,255,0.2)]'
                            : 'border-white/10 bg-white/[0.03] hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute top-0 right-0 bg-secondary text-on-secondary text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                            Best Value
                          </div>
                        )}
                        <span className={`material-symbols-outlined text-3xl mb-2 block transition-colors ${isSelected ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary/80'}`}>
                          {CURRENCY_ICONS[game.currency] || 'monetization_on'}
                        </span>
                        <div className="text-white font-black text-base leading-none mb-1">{pkg.name}</div>
                        {pkg.bonus && (
                          <div className="text-primary text-[11px] font-semibold mb-2">+ {pkg.bonus}</div>
                        )}
                        <div className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {formatPrice(pkg.price, resolvedCurrency(pkg))}
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(0,242,255,1)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-on-surface-variant text-sm border border-white/5 rounded-xl bg-white/[0.02]">
                  No packages available for this game yet.
                </div>
              )}
            </div>

            {/* ── Step 3: Payment Gateway ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(0,242,255,0.5)]">3</div>
                <h2 className="text-white font-bold text-base tracking-tight">Payment Gateway</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {GATEWAYS.map(g => {
                  const isActive = selectedGateway === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGateway(g.id)}
                      className={`relative h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all duration-200 overflow-hidden ${
                        isActive
                          ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      <span className={`font-bold text-xs tracking-tight uppercase ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {g.name}
                      </span>
                      {g.fee > 0 && (
                        <span className="text-[9px] text-outline">+{(g.fee * 100).toFixed(0)}% fee</span>
                      )}
                      {g.fee === 0 && (
                        <span className="text-[9px] text-tertiary font-bold">No fee</span>
                      )}
                      {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Transmission Summary ── */}
            <div className="rounded-xl bg-[#050508] border border-white/5 overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-on-surface-variant text-[11px] font-black uppercase tracking-widest">
                  Transmission Summary
                </h3>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">
                    {selectedPkg ? selectedPkg.name : 'Select a package'}
                  </span>
                  <span className="text-white font-semibold">{formatPrice(subtotal, displayCurrency)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-outline">Gateway Fee ({gateway?.name})</span>
                  <span className="text-outline">{formatPrice(fee, displayCurrency)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-white font-bold text-base">Total Payable</span>
                  <span className="text-primary font-black text-xl drop-shadow-[0_0_10px_rgba(0,242,255,0.6)]">
                    {formatPrice(total, displayCurrency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            {/* ── Initiate Transfer ── */}
            <button
              onClick={handleTransfer}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-blue-500 text-on-primary font-black text-base py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,255,0.35)] disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-2xl">bolt</span>
                  Initiate Transfer
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-1">
              {[
                { icon: 'lock', label: 'SSL Secured' },
                { icon: 'bolt', label: 'Instant Delivery' },
                { icon: 'shield', label: '100% Safe' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[14px]">{b.icon}</span>
                  <span className="text-[10px] font-semibold">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
