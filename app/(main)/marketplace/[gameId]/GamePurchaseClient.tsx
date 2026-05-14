"use client";

import { useState } from 'react';
import { Game, Package } from '@/lib/db';
import { processCheckout } from '@/app/actions/checkout';
import { useRouter } from 'next/navigation';

export default function GamePurchaseClient({ game }: { game: Game }) {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleBuyNow = async () => {
    if (!selectedPkg) {
      setError('Please select a package first.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('amount', (selectedPkg.price * quantity).toString());
    formData.append('description', `${game.name} - ${quantity}x ${selectedPkg.name}`);

    const result = await processCheckout(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      // Redirect to account or show success
      router.push('/account');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl mt-lg">
      
      {/* Packages Section */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-headline-md text-on-surface mb-md">Select Package</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
          {game.packages.map(pkg => (
            <div 
              key={pkg.id} 
              onClick={() => setSelectedPkg(pkg)}
              className={`relative bg-surface-container-high rounded-xl p-md cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                selectedPkg?.id === pkg.id 
                  ? 'border-primary shadow-[0_0_20px_rgba(0,242,255,0.2)] scale-[1.02]' 
                  : 'border-transparent hover:border-outline-variant hover:scale-[1.01]'
              }`}
            >
              {selectedPkg?.id === pkg.id && (
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
              )}
              
              <div className="flex flex-col items-center justify-center text-center gap-sm">
                <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
                </div>
                <h3 className="font-bold text-on-surface text-lg">{pkg.name}</h3>
                {pkg.bonus && (
                  <span className="text-secondary text-xs font-bold bg-secondary/10 px-2 py-1 rounded">
                    {pkg.bonus}
                  </span>
                )}
                <p className="text-on-surface-variant font-medium mt-1">${pkg.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="lg:col-span-1">
        <div className="glass-panel-premium rounded-2xl p-xl sticky top-24">
          <h2 className="text-xl font-headline-md text-on-surface mb-md">Order Summary</h2>
          
          {error && <div className="p-3 mb-4 bg-error/20 border border-error/50 text-error rounded-lg text-sm">{error}</div>}

          {selectedPkg ? (
            <div className="flex flex-col gap-md">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Item</span>
                <span className="font-bold text-on-surface">{selectedPkg.name}</span>
              </div>
              
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Price</span>
                <span className="font-bold text-on-surface">${selectedPkg.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Quantity</span>
                <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-2 py-1">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="text-on-surface-variant hover:text-white transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="font-bold text-on-surface min-w-[20px] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-on-surface-variant hover:text-white transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-lg text-on-surface font-medium">Total</span>
                <span className="text-2xl font-bold text-primary">${(selectedPkg.price * quantity).toFixed(2)}</span>
              </div>

              <button 
                onClick={handleBuyNow}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-bold py-3 rounded-xl mt-4 glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                    Buy Instantly
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center text-on-surface-variant py-xl border-2 border-dashed border-outline-variant/30 rounded-xl">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">ads_click</span>
              <p>Select a package to continue</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
