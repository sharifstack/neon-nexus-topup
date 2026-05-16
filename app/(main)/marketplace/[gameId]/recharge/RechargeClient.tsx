"use client";

import { useState, useMemo } from 'react';
import { Game, Package, PaymentMethod } from '@/lib/db';
import { processCheckout } from '@/app/actions/checkout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/currency';

const GAME_ICONS: Record<string, string> = {
  "pubg-mobile": "https://cdn2.steamgriddb.com/icon_thumb/db4f084e914385e578364fa4eebe3bec.png",
  "delta-force": "https://assets-prd.ignimgs.com/2024/08/28/delta-force-button-replacement-1724855313566.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80",
  "honor-of-kings": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT2hr2EhvzGvLWP7ESdvP9Ea8hlxg0MkQGIfbRX9bjcHv1VC8Ez",
  "mobile-legends": "https://sm.ign.com/ign_za/screenshot/default/mobile-legends-bang-bang_c51z.png",
  "free-fire": "https://play-lh.googleusercontent.com/EJ83sg58Oo2gAjMHFxFVLM6Z53kuH4_R0M7Yq7gts5fWSIlFchUlmskG1vJKMoncmfOxBXcgJyIaO-nak6sO-MM",
  "genshin-impact": "https://cdn1.epicgames.com/spt-assets/99dc46c68ea14324964a856d18dcac5b/genshin-impact-hqdph.jpg",
  "valorant": "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/valo2.png",
  "clash-of-clans": "https://play-lh.googleusercontent.com/sFmWfYbYp_2ea7VRMTnwd3gjIBrPGXHj_d_ab1_k1q1p2OMk4riGMF1vqxdhONOtTYOt_BVpk7a4AYcKU68LNGQ",
};

export default function RechargeClient({ 
  game, 
  paymentMethods 
}: { 
  game: Game; 
  paymentMethods: PaymentMethod[];
}) {
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const subtotal = selectedPkg?.price || 0;
  const fee = selectedPayment ? subtotal * (selectedPayment.fee || 0) : 0;
  const total = subtotal + fee;
  // Resolve display currency: per-package → game-level → BDT fallback
  const pkgCurrency = (pkg?: Package | null) =>
    (pkg as any)?.priceCurrency || (game as any)?.priceCurrency || 'BDT';

  const handleCheckout = async () => {
    if (!playerId) {
      setError('Please enter your Player ID.');
      return;
    }
    if (game.requiresZoneId && !zoneId) {
      setError('Please enter your Zone ID.');
      return;
    }
    if (!selectedPkg) {
      setError('Please select a recharge package.');
      return;
    }
    if (!selectedPayment) {
      setError('Please select a payment method.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('amount', total.toFixed(2));
    formData.append('description', `${game.name} - ${selectedPkg.name} (${playerId}${zoneId ? ' / ' + zoneId : ''})`);
    formData.append('gameId', (game as any)._id || '');
    formData.append('paymentMethod', selectedPayment?.name || 'unknown');

    const result = await processCheckout(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      router.push('/account');
    }
  };

  const gameIcon = GAME_ICONS[game.id] || game.coverImage;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative pb-24">
      
      {/* ── Left Sidebar: Game Info ── */}
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <div className="rounded-2xl overflow-hidden bg-surface-container-high border border-white/5 p-6 shadow-xl">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-6 mx-auto lg:mx-0 border-2 border-white/10">
              <Image 
                src={gameIcon} 
                alt={game.name} 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            <h1 className="text-white text-2xl font-bold mb-2 uppercase tracking-wide">{game.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">bolt</span>
                INSTANT DELIVERY
              </span>
            </div>
            <div className="text-on-surface-variant text-sm leading-relaxed space-y-4">
              <p>Top up {game.name} {game.currency || 'Diamonds'} in seconds! Just enter your user ID, select the value you wish to purchase, complete the payment, and the items will be added immediately to your account.</p>
              <p>Pay conveniently using our secure local payment methods. No registration or log-in required!</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Content: Numbered Steps ── */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Step 1: Enter User ID */}
        <div className="bg-surface-container-high rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <div className="flex items-center gap-4 p-5 bg-white/5 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">1</div>
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">Enter User ID</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Player ID</label>
                <input 
                  type="text" 
                  placeholder="Enter User ID"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              {game.requiresZoneId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Zone ID</label>
                  <input 
                    type="text" 
                    placeholder="Zone ID"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              To find your User ID, click on your avatar in the top left corner of the main game screen. Your user ID is shown below your nickname. e.g. 12345678(1234).
            </p>
          </div>
        </div>

        {/* Step 2: Select Recharge */}
        <div className="bg-surface-container-high rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <div className="flex items-center gap-4 p-5 bg-white/5 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">2</div>
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">Select Recharge</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {game.packages.map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`group relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ${
                    selectedPkg?.id === pkg.id 
                      ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(0,242,255,0.1)]' 
                      : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter z-10">
                      BEST SELLER
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center gap-2">
                    <span className={`material-symbols-outlined text-3xl transition-colors ${selectedPkg?.id === pkg.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'}`}>
                      diamond
                    </span>
                    <p className="text-sm font-bold text-white line-clamp-1">{pkg.name}</p>
                    {pkg.bonus && (
                      <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                        +{pkg.bonus} BONUS
                      </span>
                    )}
                    <div className="mt-auto pt-2 w-full border-t border-white/5">
                      <p className={`text-xs font-bold ${selectedPkg?.id === pkg.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {formatPrice(pkg.price, pkgCurrency(pkg))}
                      </p>
                    </div>
                  </div>
                  {selectedPkg?.id === pkg.id && (
                    <div className="absolute top-1 right-1">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Select Payment */}
        <div className="bg-surface-container-high rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <div className="flex items-center gap-4 p-5 bg-white/5 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">3</div>
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">Select Payment</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map(pm => (
                <div 
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedPayment?.id === pm.id 
                      ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(0,242,255,0.1)]' 
                      : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d1117] flex items-center justify-center text-2xl shadow-inner border border-white/5">
                      {pm.logo}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{pm.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">{pm.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${selectedPayment?.id === pm.id ? 'text-primary' : 'text-white'}`}>
                      {formatPrice(subtotal * (1 + (pm.fee || 0)), pkgCurrency(selectedPkg))}
                    </p>
                    {pm.fee && pm.fee > 0 && (
                      <p className="text-[9px] text-on-surface-variant">Fee: {(pm.fee * 100).toFixed(1)}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Enter Details */}
        <div className="bg-surface-container-high rounded-2xl border border-white/5 overflow-hidden shadow-lg">
          <div className="flex items-center gap-4 p-5 bg-white/5 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">4</div>
            <h2 className="text-white font-bold text-lg uppercase tracking-wide">Enter Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-xs text-on-surface-variant">OPTIONAL: If you would like a receipt of the purchase by email, please enter an email address</p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 accent-primary w-4 h-4" />
                <span className="text-[11px] text-on-surface-variant group-hover:text-white transition-colors">Yes, send me messages with exclusive news and promotions.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 accent-primary w-4 h-4" />
                <span className="text-[11px] text-on-surface-variant group-hover:text-white transition-colors">I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* ── Sticky Summary Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d1117]/80 backdrop-blur-xl border-t border-white/10 z-50 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-on-surface-variant text-xs">
              <span className="font-bold uppercase tracking-widest text-[9px]">ORDER SUMMARY</span>
              <span className="text-white font-medium truncate max-w-[200px]">
                {selectedPkg ? `${selectedPkg.name} • ${playerId || 'Player ID'}` : 'No item selected'}
              </span>
            </div>
            {selectedPkg && (
              <div className="flex flex-col text-right">
                <span className="text-on-surface-variant text-[10px] line-through font-bold">{formatPrice(selectedPkg.price * 1.2, pkgCurrency(selectedPkg))}</span>
                <span className="text-primary font-black text-2xl tracking-tighter">{formatPrice(total, pkgCurrency(selectedPkg))}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {error && <p className="text-error text-xs font-bold animate-pulse hidden lg:block">{error}</p>}
            <div className="flex flex-col items-end gap-1">
              {selectedPkg && (
                <span className="hidden lg:flex items-center gap-1 text-[10px] text-amber-400/80 font-bold">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  +{Math.floor(total * 10).toLocaleString()} PTS on purchase
                </span>
              )}
              <button 
                onClick={handleCheckout}
                disabled={loading || !selectedPkg || !selectedPayment}
                className="flex-grow md:flex-none bg-gradient-to-r from-primary to-primary-container text-on-primary font-black uppercase tracking-widest px-12 py-4 rounded-xl shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-3 text-sm"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">payments</span>
                    Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
