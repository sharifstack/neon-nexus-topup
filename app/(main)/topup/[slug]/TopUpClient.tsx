"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';

export default function TopUpClient({ game }: { game: any }) {
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [selectedGateway, setSelectedGateway] = useState('bkash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const gateways = [
    { id: 'bkash', name: 'bKash', fee: 0.015 },
    { id: 'nagad', name: 'Nagad', fee: 0.01 },
    { id: 'visa', name: 'Visa', fee: 0.025 },
    { id: 'paypal', name: 'PayPal', fee: 0.03 },
    { id: 'crypto', name: 'Crypto', fee: 0.0 }
  ];

  const subtotal = selectedPkg?.price || 0;
  const currentGateway = gateways.find(g => g.id === selectedGateway);
  const fee = subtotal * (currentGateway?.fee || 0);
  const total = subtotal + fee;

  const handleTransfer = async () => {
    if (!playerId) {
      setError('Please enter your Player ID');
      return;
    }
    if (game.requiresZoneId && !zoneId) {
      setError('Please enter your Zone ID');
      return;
    }
    if (!selectedPkg) {
      setError('Please select a package');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('amount', total.toFixed(2));
      formData.append('description', `${game.name} - ${selectedPkg.name} for ID: ${playerId}`);
      
      const result = await processCheckout(formData);
      if (result.success) {
        router.push('/account');
      } else {
        setError(result.error || 'Checkout failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-gutter py-xxl grid grid-cols-1 md:grid-cols-12 gap-xl">
      {/* Left Column: Info & Banner */}
      <div className="md:col-span-5 flex flex-col gap-xl">
        {/* Game Banner */}
        <div className="rounded-xl overflow-hidden glass-panel relative group">
          <div className="aspect-video w-full bg-surface-container-high relative">
            <img 
              alt={`${game.name} Banner`} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
              src={game.bannerImage || game.coverImage} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
            <div className="absolute bottom-md left-md">
              <h1 className="font-headline-xl text-headline-xl text-primary drop-shadow-lg uppercase tracking-tight">{game.name}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Instant {game.currency} Top-Up</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-panel rounded-xl p-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">About This Game</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">{game.description || `Dominate the battleground with instant ${game.currency} delivery. Neon Nexus guarantees secure and immediate delivery directly to your account.`}</p>
        </div>

        {/* How to Buy */}
        <div className="glass-panel rounded-xl p-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">How to Top Up</h2>
          <ul className="space-y-md font-body-md text-body-md text-on-surface-variant">
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_one</span>
              <span>Enter your Player ID{game.requiresZoneId ? ' and Zone ID' : ''}.</span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_two</span>
              <span>Select your desired {game.currency} package.</span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_3</span>
              <span>Choose your preferred payment method.</span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_4</span>
              <span>Complete the transaction and receive {game.currency} instantly!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column: Purchase Panel */}
      <div className="md:col-span-7">
        <div className="glass-panel rounded-xl p-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-t border-t-primary/20">
          
          {/* Step 1: User ID */}
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">1</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Player Identity</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-md">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">badge</span>
                <input 
                  className="w-full bg-[#050506] border border-outline-variant rounded-lg py-md pl-12 pr-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors font-body-md text-body-md placeholder-outline-variant" 
                  placeholder="Enter Player ID" 
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  type="text" 
                />
              </div>
              {game.requiresZoneId && (
                <div className="relative w-full sm:w-40">
                  <input 
                    className="w-full bg-[#050506] border border-outline-variant rounded-lg py-md px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors font-body-md text-body-md placeholder-outline-variant" 
                    placeholder="Zone ID" 
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    type="text" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Select Package */}
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">2</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Select Payload</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-md">
              {game.packages?.map((pkg: any) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`glass-panel rounded-lg p-md text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                    selectedPkg?.id === pkg.id ? 'border-primary ring-1 ring-primary scale-105' : 'border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-secondary text-on-secondary text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider z-10">Best Value</div>
                  )}
                  <div className="flex justify-center mb-sm">
                    <span className={`material-symbols-outlined text-4xl transition-colors ${selectedPkg?.id === pkg.id ? 'text-primary-container drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]' : 'text-primary group-hover:text-primary-container'}`}>
                      {game.currency === 'UC' ? 'monetization_on' : 'diamond'}
                    </span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface mb-xs">{pkg.name}</div>
                  <div className="font-label-sm text-label-sm text-tertiary-fixed mb-sm">{pkg.bonus ? `+ ${pkg.bonus}` : '+ 0 Bonus'}</div>
                  <div className="font-label-md text-label-md text-primary">${pkg.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">3</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Payment Gateway</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-md">
              {gateways.map(g => (
                <div 
                  key={g.id}
                  onClick={() => setSelectedGateway(g.id)}
                  className={`glass-panel rounded-lg p-sm flex items-center justify-center h-16 cursor-pointer transition-all duration-200 border-outline-variant/30 relative overflow-hidden ${
                    selectedGateway === g.id ? 'border-primary' : 'hover:border-primary/50'
                  }`}
                >
                  <span className={`font-label-md text-label-md uppercase tracking-tight ${selectedGateway === g.id ? 'text-primary font-bold' : 'text-on-surface'}`}>{g.name}</span>
                  {selectedGateway === g.id && <div className="absolute inset-0 bg-primary/10"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Summary */}
          <div className="bg-[#050506] rounded-xl p-lg border border-outline-variant/20 mb-xl">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md border-b border-outline-variant/20 pb-sm">Transmission Summary</h3>
            <div className="flex justify-between items-center mb-sm font-body-md text-body-md">
              <span className="text-on-surface">{selectedPkg ? selectedPkg.name : 'Select a package'}</span>
              <span className="text-on-surface">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-md font-body-sm text-body-sm">
              <span className="text-outline">Gateway Fee ({currentGateway?.name})</span>
              <span className="text-outline">${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-md border-t border-outline-variant/20">
              <span className="font-headline-md text-headline-md text-on-surface">Total Payable</span>
              <span className="font-headline-lg text-headline-lg text-primary drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Step 5: Error Message */}
          {error && (
            <div className="mb-md p-md bg-error/10 border border-error/20 rounded-lg text-error text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Step 6: Complete */}
          <button 
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-container to-blue-500 text-on-primary-container font-headline-md text-headline-md py-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-md shadow-[0_0_30px_rgba(0,242,255,0.4)] disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-3xl">bolt</span>
                INITIATE TRANSFER
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
